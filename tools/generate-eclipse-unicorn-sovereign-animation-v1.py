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

import generate_eclipse_unicorn_sovereign_directions_v1 as directions
import generate_eclipse_unicorn_sovereign_style_v1 as base

from boss_animation_authoring_v1 import (
    build_assets,
    fit_to_safe_area,
    hex_rgb,
    replace_colors,
    squash_pose,
)


# The shared builder executes apply_engine_treatment.mjs once for the 80-pose batch.
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
ASSET_PREFIX = "eclipse-unicorn-sovereign-animation-v1"

OUTLINE = base.OUTLINE
COAT = base.COAT
MANE = base.MANE
HORN = base.HORN
ARMOR = base.ARMOR
ARCANE = base.ARCANE
ECLIPSE_SHADOW = "#49336f"
ECLIPSE_BASE = "#8f5ac5"
ECLIPSE_HIGHLIGHT = "#d9b6ff"
SUNLIGHT = "#fff5b8"


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


def add_prance_sparks(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        "down": (
            ((5, 21),),
            ((8, 20), (18, 21)),
            ((4, 20), (15, 21), (20, 19)),
            ((3, 21), (9, 20), (16, 21), (21, 20)),
        ),
        "left": (
            ((19, 21),),
            ((16, 20), (21, 18)),
            ((13, 21), (18, 20), (21, 17)),
            ((10, 21), (16, 20), (20, 18), (21, 15)),
        ),
        "up": (
            ((5, 21),),
            ((9, 20), (18, 21)),
            ((4, 20), (14, 21), (20, 19)),
            ((3, 21), (10, 20), (16, 21), (21, 20)),
        ),
    }
    return add_points(
        image,
        patterns[direction][frame],
        (ARCANE["shadow"], HORN["highlight"], ARCANE["highlight"]),
    )


def add_charge_wake(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        "down": (
            ((4, 7),),
            ((3, 5), (20, 6)),
            ((2, 3), (21, 3), (4, 10), (20, 10)),
            ((5, 12), (19, 12), (12, 2)),
        ),
        "left": (
            ((20, 8),),
            ((18, 6), (21, 10)),
            ((2, 5), (19, 5), (21, 8), (20, 12)),
            ((4, 12), (18, 8), (21, 11)),
        ),
        "up": (
            ((4, 9),),
            ((3, 7), (20, 7)),
            ((2, 4), (21, 4), (4, 11), (20, 11)),
            ((5, 13), (19, 13), (12, 2)),
        ),
    }
    return add_points(
        image,
        patterns[direction][frame],
        (HORN["highlight"], ARCANE["highlight"], SUNLIGHT),
    )


def add_eclipse_corona(image: Image.Image, direction: str, frame: int) -> Image.Image:
    patterns = {
        "down": (
            ((4, 8), (20, 8)),
            ((3, 6), (21, 6), (12, 2)),
            ((2, 4), (21, 4), (4, 2), (20, 2), (12, 3)),
            ((4, 5), (20, 5), (12, 2)),
        ),
        "left": (
            ((4, 4), (19, 8)),
            ((3, 3), (18, 5), (21, 9)),
            ((2, 2), (6, 3), (17, 3), (21, 6), (20, 12)),
            ((3, 4), (18, 5), (21, 10)),
        ),
        "up": (
            ((4, 8), (20, 8)),
            ((3, 6), (21, 6), (12, 2)),
            ((2, 4), (21, 4), (4, 2), (20, 2), (12, 3)),
            ((4, 5), (20, 5), (12, 2)),
        ),
    }
    return add_points(
        image,
        patterns[direction][frame],
        (ECLIPSE_SHADOW, ECLIPSE_BASE, ECLIPSE_HIGHLIGHT, ARCANE["highlight"]),
    )


def add_hurt_shards(image: Image.Image, direction: str, frame: int) -> Image.Image:
    points = {
        "down": (((20, 5), (21, 7)), ((2, 12), (3, 14), (4, 16))),
        "left": (((20, 5), (21, 7)), ((3, 14), (4, 16), (5, 18))),
        "up": (((3, 6), (2, 8)), ((20, 11), (21, 13), (19, 15))),
    }[direction][frame]
    return add_points(image, points, (SUNLIGHT, ARCANE["highlight"]))


def add_fallen_motes(image: Image.Image, direction: str, frame: int) -> Image.Image:
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
        (HORN["shadow"], ARCANE["shadow"], MANE["base"]),
    )


def eclipse_phase(image: Image.Image, frame: int) -> Image.Image:
    replacements = (
        {
            ARCANE["highlight"]: ECLIPSE_HIGHLIGHT,
            HORN["highlight"]: SUNLIGHT,
        },
        {
            ARCANE["base"]: "#73eaf2",
            ARCANE["highlight"]: "#dcffff",
            MANE["highlight"]: ECLIPSE_HIGHLIGHT,
        },
        {
            ARCANE["shadow"]: ARCANE["base"],
            ARCANE["base"]: "#a8f8ff",
            ARCANE["highlight"]: "#ffffff",
            MANE["base"]: ECLIPSE_BASE,
            MANE["highlight"]: "#edc9ff",
            HORN["base"]: SUNLIGHT,
            HORN["highlight"]: "#ffffff",
        },
        {
            ARCANE["highlight"]: ARCANE["base"],
            MANE["highlight"]: MANE["base"],
            HORN["highlight"]: HORN["base"],
        },
    )[frame]
    return replace_colors(image, replacements)


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (7, 24, 50, 78)
    angle = -angles[frame] if direction in {"left", "up"} else angles[frame]
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
        collapsed = squash_pose(collapsed, 10, -1 if direction == "left" else 1)
    elif frame == 3:
        collapsed = squash_pose(collapsed, 5, -2 if direction == "left" else 2)
    dimming = (
        {COAT["highlight"]: COAT["base"]},
        {
            COAT["highlight"]: COAT["base"],
            ARCANE["highlight"]: ARCANE["base"],
            HORN["highlight"]: HORN["base"],
        },
        {
            COAT["highlight"]: COAT["shadow"],
            ARCANE["highlight"]: ARCANE["shadow"],
            MANE["highlight"]: MANE["base"],
        },
        {
            COAT["highlight"]: COAT["shadow"],
            COAT["base"]: COAT["shadow"],
            MANE["highlight"]: MANE["shadow"],
            MANE["base"]: MANE["shadow"],
            ARMOR["highlight"]: ARMOR["shadow"],
            ARMOR["base"]: ARMOR["shadow"],
            ARCANE["highlight"]: OUTLINE,
            ARCANE["base"]: ARCANE["shadow"],
        },
    )[frame]
    return add_fallen_motes(replace_colors(collapsed, dimming), direction, frame)


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
        return add_points(
            replace_colors(
                breathing,
                {
                    MANE["highlight"]: MANE["base"],
                    ARCANE["highlight"]: ARCANE["base"],
                },
            ),
            ((11, 2),),
            (HORN["highlight"],),
        )

    if animation == "walk":
        heights = (18, 20, 17, 19)
        result = add_prance_sparks(squash_pose(source, heights[frame]), direction, frame)
        palette = (
            {COAT["highlight"]: COAT["base"]},
            {MANE["highlight"]: MANE["base"]},
            {ARCANE["base"]: ARCANE["highlight"]},
            {HORN["highlight"]: HORN["base"]},
        )[frame]
        return replace_colors(result, palette)

    if animation == "attack":
        heights = (20, 17, 19, 18)
        result = add_charge_wake(squash_pose(source, heights[frame]), direction, frame)
        palette = (
            {HORN["highlight"]: HORN["base"]},
            {COAT["highlight"]: COAT["base"]},
            {
                HORN["base"]: SUNLIGHT,
                HORN["highlight"]: "#ffffff",
                ARCANE["base"]: ARCANE["highlight"],
                MANE["highlight"]: ECLIPSE_HIGHLIGHT,
            },
            {ARCANE["highlight"]: ARCANE["base"]},
        )[frame]
        return replace_colors(result, palette)

    if animation == "cast":
        heights = (18, 19, 20, 17)
        result = add_eclipse_corona(
            squash_pose(source, heights[frame]),
            direction,
            frame,
        )
        return eclipse_phase(result, frame)

    if animation == "hurt":
        heights = (18, 15)
        result = add_hurt_shards(squash_pose(source, heights[frame]), direction, frame)
        if frame == 0:
            return replace_colors(
                result,
                {
                    COAT["shadow"]: "#a990a8",
                    COAT["base"]: "#ead8e6",
                    COAT["highlight"]: "#ffffff",
                    MANE["base"]: "#8f5d91",
                    MANE["highlight"]: "#ffd7ff",
                    ARCANE["base"]: "#b9fbff",
                    ARCANE["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            result,
            {
                COAT["highlight"]: COAT["base"],
                MANE["highlight"]: MANE["base"],
                ARCANE["highlight"]: ARCANE["base"],
            },
        )

    if animation == "death":
        return death_pose(source, frame, direction)
    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Eclipse Unicorn Sovereign boss-animation-v1 candidate."
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
        temporary_prefix="eclipse-unicorn-sovereign-animation-",
    )
    manifest_path = ROOT / f"{ASSET_PREFIX}-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {manifest['boss']} ({manifest['width']}x{manifest['height']} full sheet)."
    )


if __name__ == "__main__":
    main()
