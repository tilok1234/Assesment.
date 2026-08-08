from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ROOT = PROJECT_ROOT / "death-review" / "boss-48-drafts"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import generate_furious_depraved_rhino_directions_v1 as directions
import generate_furious_depraved_rhino_style_v1 as base

from boss_animation_authoring_v1 import (
    ANIMATIONS,
    build_assets,
    fit_to_safe_area,
    hex_rgb,
    replace_colors,
    squash_pose,
)


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
ASSET_PREFIX = "furious-depraved-rhino-animation-v1"

OUTLINE = base.OUTLINE
HIDE = base.HIDE
HORN = base.HORN
RUST = base.RUST
RAGE = base.RAGE
CORRUPTION = base.CORRUPTION


def source_directions() -> dict[str, Image.Image]:
    left = directions.left_source()
    return {
        "down": base.logical_source(),
        "left": left,
        "right": left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": directions.up_source(),
    }


def add_points(
    image: Image.Image,
    points: tuple[tuple[int, int], ...],
    colors: tuple[str, ...],
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    for index, (x, y) in enumerate(points):
        draw.point((x, y), fill=hex_rgb(colors[index % len(colors)]) + (255,))
    return result


def add_stamp_dust(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        "down": (
            ((3, 20),),
            ((3, 21), (20, 20)),
            ((5, 21), (18, 21), (20, 19)),
            ((2, 19), (6, 21), (17, 21), (21, 19)),
        ),
        "left": (
            ((20, 20),),
            ((18, 21), (21, 19)),
            ((16, 21), (19, 20), (21, 18)),
            ((15, 21), (18, 20), (20, 19), (21, 17)),
        ),
        "up": (
            ((4, 20),),
            ((3, 20), (20, 21)),
            ((2, 19), (5, 21), (18, 21)),
            ((2, 18), (4, 20), (19, 21), (21, 19)),
        ),
    }
    return add_points(
        image,
        patterns[direction][frame],
        (RUST["shadow"], HIDE["highlight"]),
    )


def add_charge_wake(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        "down": (
            ((3, 7),),
            ((2, 9), (21, 9)),
            ((2, 6), (3, 8), (20, 8), (21, 6)),
            ((3, 12), (20, 12), (11, 2)),
        ),
        "left": (
            ((20, 8),),
            ((19, 6), (21, 10)),
            ((2, 8), (3, 10), (20, 6), (21, 8)),
            ((4, 12), (19, 9), (21, 11)),
        ),
        "up": (
            ((3, 10),),
            ((2, 8), (21, 8)),
            ((2, 6), (4, 8), (19, 8), (21, 6)),
            ((3, 13), (20, 13), (12, 2)),
        ),
    }
    return add_points(
        image,
        patterns[direction][frame],
        (HORN["highlight"], RAGE["highlight"], RUST["highlight"]),
    )


def add_corruption_roar(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        0: ((3, 5),),
        1: ((2, 4), (21, 6), (3, 12)),
        2: ((2, 3), (21, 3), (2, 13), (21, 14), (11, 2)),
        3: ((3, 6), (20, 5), (2, 16), (21, 16)),
    }
    points = patterns[frame]
    if direction == "left":
        points = tuple((max(2, x - 1), y) for x, y in points)
    return add_points(
        image,
        points,
        (CORRUPTION["highlight"], RAGE["highlight"], CORRUPTION["base"]),
    )


def add_hurt_shard(image: Image.Image, direction: str, frame: int) -> Image.Image:
    points = {
        "down": (((20, 5), (21, 7)), ((2, 11), (3, 13), (4, 15))),
        "left": (((20, 5), (21, 7)), ((3, 14), (4, 16), (5, 18))),
        "up": (((3, 6), (2, 8)), ((20, 11), (21, 13), (19, 15))),
    }[direction][frame]
    return add_points(image, points, (HORN["highlight"], RAGE["highlight"]))


def add_fallen_debris(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        0: ((3, 8),),
        1: ((3, 13), (20, 8)),
        2: ((4, 18), (18, 17), (21, 20)),
        3: ((2, 21), (7, 20), (17, 21), (21, 19)),
    }
    points = patterns[frame]
    if direction == "left":
        points = tuple((max(2, x - 1), y) for x, y in points)
    return add_points(
        image,
        points,
        (HORN["shadow"], RAGE["shadow"], RUST["base"]),
    )


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (7, 25, 52, 80)
    angle = -angles[frame] if direction == "left" else angles[frame]
    rotated = source.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    collapsed = fit_to_safe_area(rotated)
    if frame == 1:
        collapsed = squash_pose(collapsed, 16)
    elif frame == 2:
        collapsed = squash_pose(collapsed, 11)
    elif frame == 3:
        collapsed = squash_pose(collapsed, 6)
    dimming = (
        {HIDE["highlight"]: HIDE["base"]},
        {
            HIDE["highlight"]: HIDE["base"],
            RAGE["highlight"]: RAGE["base"],
        },
        {
            HIDE["highlight"]: HIDE["shadow"],
            RAGE["highlight"]: RAGE["shadow"],
            CORRUPTION["highlight"]: CORRUPTION["base"],
        },
        {
            HIDE["highlight"]: HIDE["shadow"],
            HIDE["base"]: HIDE["shadow"],
            RUST["highlight"]: RUST["shadow"],
            RUST["base"]: RUST["shadow"],
            RAGE["highlight"]: RAGE["shadow"],
            RAGE["base"]: RAGE["shadow"],
            CORRUPTION["highlight"]: CORRUPTION["shadow"],
            CORRUPTION["base"]: CORRUPTION["shadow"],
        },
    )[frame]
    return add_fallen_debris(replace_colors(collapsed, dimming), direction, frame)


def animation_source(
    sources: dict[str, Image.Image],
    animation: str,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "right":
        return animation_source(sources, animation, "left", frame).transpose(
            Image.Transpose.FLIP_LEFT_RIGHT
        )

    source = sources[direction]
    if animation == "idle":
        if frame == 0:
            return source.copy()
        breathing = squash_pose(source, 19)
        return add_points(breathing, ((11, 2),), (HIDE["highlight"],))

    if animation == "walk":
        heights = (18, 20, 17, 19)
        result = squash_pose(source, heights[frame])
        result = add_stamp_dust(result, direction, frame)
        palette = (
            {HIDE["highlight"]: HIDE["base"]},
            {RUST["highlight"]: RUST["base"]},
            {RAGE["base"]: RAGE["highlight"]},
            {CORRUPTION["highlight"]: CORRUPTION["base"]},
        )[frame]
        return replace_colors(result, palette)

    if animation == "attack":
        heights = (20, 17, 16, 18)
        result = squash_pose(source, heights[frame])
        result = add_charge_wake(result, direction, frame)
        palette = (
            {RAGE["highlight"]: RAGE["base"]},
            {HIDE["highlight"]: HIDE["base"]},
            {
                HORN["base"]: "#fff0b6",
                HORN["highlight"]: "#ffffff",
                RAGE["base"]: RAGE["highlight"],
            },
            {RUST["highlight"]: RUST["base"]},
        )[frame]
        return replace_colors(result, palette)

    if animation == "cast":
        heights = (20, 19, 18, 17)
        result = add_corruption_roar(
            squash_pose(source, heights[frame]),
            direction,
            frame,
        )
        palette = (
            {CORRUPTION["highlight"]: "#dc8bc0"},
            {RAGE["highlight"]: "#ff8782"},
            {
                CORRUPTION["base"]: "#9f5f91",
                CORRUPTION["highlight"]: "#f5a5da",
                RAGE["base"]: "#e23f50",
            },
            {
                CORRUPTION["highlight"]: CORRUPTION["base"],
                RAGE["highlight"]: RAGE["base"],
            },
        )[frame]
        return replace_colors(result, palette)

    if animation == "hurt":
        heights = (18, 16)
        result = add_hurt_shard(squash_pose(source, heights[frame]), direction, frame)
        if frame == 0:
            return replace_colors(
                result,
                {
                    HIDE["base"]: "#aab3ab",
                    HIDE["shadow"]: "#66706a",
                    HIDE["highlight"]: "#ffffff",
                    RAGE["base"]: "#ff7b7b",
                },
            )
        return replace_colors(
            result,
            {
                HIDE["highlight"]: HIDE["base"],
                RAGE["highlight"]: RAGE["base"],
                CORRUPTION["highlight"]: CORRUPTION["base"],
            },
        )

    if animation == "death":
        return death_pose(source, frame, direction)
    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Furious Depraved Rhino boss-animation-v1 candidate."
    )
    parser.add_argument(
        "--runtime-root",
        type=Path,
        default=DEFAULT_RUNTIME_ROOT,
        help="Runtime boss asset directory (defaults to engine/assets/bosses).",
    )
    arguments = parser.parse_args()
    manifest = build_assets(
        checkpoint_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
        base=base,
        asset_prefix=ASSET_PREFIX,
        source_directions=source_directions,
        animation_source=animation_source,
        temporary_prefix="furious-rhino-animation-",
    )
    manifest_path = ROOT / f"{ASSET_PREFIX}-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {manifest['boss']} ({manifest['width']}x{manifest['height']} full sheet)."
    )


if __name__ == "__main__":
    main()
