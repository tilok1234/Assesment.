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

import generate_gunslinger_boar_rider_directions_v1 as directions
import generate_gunslinger_boar_rider_style_v1 as base

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
ASSET_PREFIX = "gunslinger-boar-rider-animation-v1"

OUTLINE = base.OUTLINE
BOAR = base.BOAR
BRISTLE = base.BRISTLE
DUSTER = base.DUSTER
LEATHER = base.LEATHER
GUNMETAL = base.GUNMETAL
CRIMSON = base.CRIMSON
IVORY = base.IVORY


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


def add_gallop_dust(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        "down": (
            ((3, 20),),
            ((2, 21), (20, 20)),
            ((4, 21), (18, 21), (21, 19)),
            ((2, 19), (6, 21), (17, 21), (21, 18)),
        ),
        "left": (
            ((20, 20),),
            ((18, 21), (21, 19)),
            ((16, 21), (19, 20), (21, 18)),
            ((14, 21), (17, 20), (20, 19), (21, 17)),
        ),
        "up": (
            ((3, 20),),
            ((2, 20), (21, 20)),
            ((4, 21), (18, 21), (21, 18)),
            ((2, 18), (5, 21), (19, 20), (21, 17)),
        ),
    }
    return add_points(
        image,
        patterns[direction][frame],
        (BOAR["highlight"], DUSTER["shadow"]),
    )


def add_gun_action(image: Image.Image, direction: str, frame: int) -> Image.Image:
    if direction == "down":
        patterns = (
            ((2, 6), (21, 6)),
            ((2, 7), (3, 6), (3, 8)),
            ((2, 7), (3, 5), (3, 9), (21, 7), (20, 5), (20, 9)),
            ((3, 5), (20, 6), (21, 4)),
        )
    elif direction == "left":
        patterns = (
            ((2, 6),),
            ((2, 7), (3, 5), (3, 9)),
            ((2, 7), (3, 5), (3, 9), (18, 3), (20, 2), (20, 5)),
            ((2, 5), (3, 3), (20, 4)),
        )
    else:
        patterns = (
            ((2, 7), (21, 7)),
            ((2, 8), (3, 6), (3, 10)),
            ((2, 8), (3, 6), (3, 10), (21, 8), (20, 6), (20, 10)),
            ((3, 6), (20, 6), (21, 4)),
        )
    colors = (
        GUNMETAL["highlight"],
        IVORY["highlight"],
        CRIMSON["highlight"],
    )
    return add_points(image, patterns[frame], colors)


def add_deadeye_sigil(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        0: ((3, 4),),
        1: ((2, 4), (21, 6), (4, 10)),
        2: ((2, 3), (21, 3), (2, 12), (21, 13), (12, 2)),
        3: ((3, 5), (20, 5), (2, 15), (21, 15)),
    }
    points = patterns[frame]
    if direction == "left":
        points = tuple((max(2, x - 1), y) for x, y in points)
    return add_points(
        image,
        points,
        (GUNMETAL["highlight"], CRIMSON["highlight"], IVORY["highlight"]),
    )


def add_hurt_shard(image: Image.Image, direction: str, frame: int) -> Image.Image:
    points = {
        "down": (((20, 5), (21, 7)), ((2, 11), (3, 13), (4, 15))),
        "left": (((20, 5), (21, 7)), ((3, 14), (4, 16), (5, 18))),
        "up": (((3, 6), (2, 8)), ((20, 11), (21, 13), (19, 15))),
    }[direction][frame]
    return add_points(image, points, (IVORY["highlight"], CRIMSON["highlight"]))


def add_fallen_gear(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        0: ((3, 7),),
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
        (GUNMETAL["shadow"], LEATHER["base"], CRIMSON["shadow"]),
    )


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (6, 23, 50, 78)
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
        {BOAR["highlight"]: BOAR["base"]},
        {
            BOAR["highlight"]: BOAR["base"],
            DUSTER["highlight"]: DUSTER["base"],
        },
        {
            BOAR["highlight"]: BOAR["shadow"],
            DUSTER["highlight"]: DUSTER["shadow"],
            CRIMSON["highlight"]: CRIMSON["base"],
        },
        {
            BOAR["highlight"]: BOAR["shadow"],
            BOAR["base"]: BOAR["shadow"],
            DUSTER["highlight"]: DUSTER["shadow"],
            DUSTER["base"]: DUSTER["shadow"],
            LEATHER["highlight"]: LEATHER["shadow"],
            LEATHER["base"]: LEATHER["shadow"],
            GUNMETAL["highlight"]: GUNMETAL["shadow"],
            GUNMETAL["base"]: GUNMETAL["shadow"],
            CRIMSON["highlight"]: CRIMSON["shadow"],
            CRIMSON["base"]: CRIMSON["shadow"],
        },
    )[frame]
    return add_fallen_gear(replace_colors(collapsed, dimming), direction, frame)


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
        mounted_breath = squash_pose(source, 19)
        return add_points(mounted_breath, ((11, 2),), (LEATHER["highlight"],))

    if animation == "walk":
        heights = (18, 20, 17, 19)
        result = add_gallop_dust(
            squash_pose(source, heights[frame]),
            direction,
            frame,
        )
        palette = (
            {BOAR["highlight"]: BOAR["base"]},
            {DUSTER["highlight"]: DUSTER["base"]},
            {CRIMSON["base"]: CRIMSON["highlight"]},
            {GUNMETAL["highlight"]: GUNMETAL["base"]},
        )[frame]
        return replace_colors(result, palette)

    if animation == "attack":
        heights = (20, 18, 17, 19)
        result = add_gun_action(
            squash_pose(source, heights[frame]),
            direction,
            frame,
        )
        palette = (
            {GUNMETAL["highlight"]: GUNMETAL["base"]},
            {
                GUNMETAL["base"]: "#aeb8c2",
                IVORY["highlight"]: "#ffffff",
            },
            {
                GUNMETAL["base"]: "#d0d8df",
                GUNMETAL["highlight"]: "#ffffff",
                CRIMSON["base"]: CRIMSON["highlight"],
            },
            {
                GUNMETAL["highlight"]: GUNMETAL["base"],
                DUSTER["highlight"]: DUSTER["base"],
            },
        )[frame]
        return replace_colors(result, palette)

    if animation == "cast":
        heights = (20, 19, 18, 17)
        result = add_deadeye_sigil(
            squash_pose(source, heights[frame]),
            direction,
            frame,
        )
        palette = (
            {CRIMSON["highlight"]: "#ff827e"},
            {GUNMETAL["highlight"]: "#edf7ff"},
            {
                CRIMSON["base"]: "#e34751",
                CRIMSON["highlight"]: "#ff9b8f",
                GUNMETAL["base"]: "#9fadb9",
            },
            {
                CRIMSON["highlight"]: CRIMSON["base"],
                GUNMETAL["highlight"]: GUNMETAL["base"],
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
                    BOAR["base"]: "#b4845f",
                    BOAR["shadow"]: "#704a35",
                    BOAR["highlight"]: "#f0c493",
                    DUSTER["base"]: "#e2a45d",
                    CRIMSON["base"]: "#ff7470",
                },
            )
        return replace_colors(
            result,
            {
                BOAR["highlight"]: BOAR["base"],
                DUSTER["highlight"]: DUSTER["base"],
                CRIMSON["highlight"]: CRIMSON["base"],
            },
        )

    if animation == "death":
        return death_pose(source, frame, direction)
    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Gunslinger Boar Rider boss-animation-v1 candidate."
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
        temporary_prefix="gunslinger-boar-rider-animation-",
    )
    manifest_path = ROOT / f"{ASSET_PREFIX}-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {manifest['boss']} ({manifest['width']}x{manifest['height']} full sheet)."
    )


if __name__ == "__main__":
    main()
