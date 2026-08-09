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

import generate_lava_core_colossus_directions_v1 as directions
import generate_lava_core_colossus_style_v2 as base

from boss_animation_authoring_v1 import (
    build_assets,
    fit_to_safe_area,
    hex_rgb,
    replace_colors,
)


# The shared builder executes apply_engine_treatment.mjs once for the 80-pose batch.
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
ASSET_PREFIX = "lava-core-colossus-animation-v1"

OUTLINE = base.OUTLINE
STONE = base.STONE
MAGMA = base.MAGMA


class LavaAuthoringBase:
    """Adapter that leaves the approved v2 style source byte-for-byte unchanged."""

    SLUG = "lava-core-colossus"
    pixels_from_image = staticmethod(base.pixels_from_image)
    image_from_pixels = staticmethod(base.image_from_pixels)

    @staticmethod
    def treatment_ramps() -> list[dict[str, str]]:
        return [
            {"id": "stone", **STONE},
            {"id": "magma", **MAGMA},
        ]


AUTHORING_BASE = LavaAuthoringBase()


def source_directions() -> dict[str, Image.Image]:
    left = directions.left_source()
    return {
        "down": base.logical_source(),
        "left": left,
        "right": left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": directions.up_source(),
    }


def resize_pose(
    source: Image.Image,
    target_width: int,
    target_height: int,
    offset_x: int = 0,
) -> Image.Image:
    bounds = source.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("Lava-Core pose became empty.")
    content = source.crop(bounds).resize(
        (target_width, target_height),
        Image.Resampling.NEAREST,
    )
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    x = max(2, min(22 - target_width, ((24 - target_width) // 2) + offset_x))
    y = 22 - target_height
    result.alpha_composite(content, (x, y))
    return result


def core_temperature(image: Image.Image, phase: str) -> Image.Image:
    replacements = {
        "quiet": {
            MAGMA["highlight"]: MAGMA["base"],
        },
        "warm": {
            MAGMA["shadow"]: MAGMA["base"],
            MAGMA["base"]: MAGMA["highlight"],
        },
        "flare": {
            MAGMA["shadow"]: MAGMA["base"],
            MAGMA["base"]: "#ff9a4d",
            MAGMA["highlight"]: "#fff0a5",
        },
        "white-hot": {
            MAGMA["shadow"]: "#e8663a",
            MAGMA["base"]: "#ffc15c",
            MAGMA["highlight"]: "#ffffff",
        },
        "cool": {
            MAGMA["highlight"]: MAGMA["base"],
            MAGMA["base"]: MAGMA["shadow"],
        },
    }[phase]
    return replace_colors(image, replacements)


def stone_stress(image: Image.Image, frame: int) -> Image.Image:
    replacements = (
        {STONE["highlight"]: STONE["base"]},
        {STONE["shadow"]: STONE["base"]},
        {STONE["base"]: STONE["highlight"]},
        {STONE["highlight"]: STONE["base"], STONE["base"]: STONE["shadow"]},
    )[frame]
    return replace_colors(image, replacements)


def add_rubble(
    image: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    patterns = {
        "down": (
            ((4, 21),),
            ((4, 21), (19, 20)),
            ((3, 20), (6, 21), (18, 21), (21, 19)),
            ((2, 21), (5, 20), (8, 21), (16, 21), (19, 20), (21, 21)),
        ),
        "left": (
            ((20, 20),),
            ((18, 21), (21, 19)),
            ((4, 21), (17, 20), (20, 21), (21, 18)),
            ((3, 21), (7, 20), (15, 21), (18, 20), (20, 19), (21, 21)),
        ),
        "up": (
            ((19, 21),),
            ((4, 20), (19, 21)),
            ((3, 19), (6, 21), (18, 21), (21, 20)),
            ((2, 21), (5, 19), (8, 21), (16, 21), (19, 20), (21, 21)),
        ),
    }
    result = image.copy()
    draw = ImageDraw.Draw(result)
    colors = (STONE["shadow"], STONE["base"], MAGMA["shadow"], OUTLINE)
    for index, point in enumerate(patterns[direction][frame]):
        draw.point(point, fill=hex_rgb(colors[index % len(colors)]) + (255,))
    return result


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (8, 24, 48, 74)
    angle = -angles[frame] if direction == "left" else angles[frame]
    rotated = source.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    rotated = fit_to_safe_area(rotated)
    widths = (20, 18, 16, 13)
    heights = (18, 14, 9, 5)
    collapsed = resize_pose(rotated, widths[frame], heights[frame])
    dimming = (
        {
            STONE["highlight"]: STONE["base"],
            MAGMA["highlight"]: MAGMA["base"],
        },
        {
            STONE["highlight"]: STONE["base"],
            MAGMA["highlight"]: MAGMA["base"],
            MAGMA["base"]: MAGMA["shadow"],
        },
        {
            STONE["highlight"]: STONE["shadow"],
            STONE["base"]: STONE["shadow"],
            MAGMA["highlight"]: MAGMA["shadow"],
            MAGMA["base"]: MAGMA["shadow"],
        },
        {
            STONE["highlight"]: OUTLINE,
            STONE["base"]: STONE["shadow"],
            MAGMA["highlight"]: STONE["shadow"],
            MAGMA["base"]: STONE["shadow"],
            MAGMA["shadow"]: OUTLINE,
        },
    )[frame]
    return add_rubble(replace_colors(collapsed, dimming), direction, frame)


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
        return core_temperature(resize_pose(source, 19, 18), "warm")

    if animation == "walk":
        widths = (19, 20, 18, 20)
        heights = (18, 20, 17, 19)
        offsets = (-1, 0, 1, 0)
        temperatures = ("quiet", "warm", "flare", "cool")
        result = resize_pose(source, widths[frame], heights[frame], offsets[frame])
        return core_temperature(stone_stress(result, frame), temperatures[frame])

    if animation == "attack":
        # A full-body wind-up compresses into a two-fist ground slam, then recovers.
        widths = (18, 20, 20, 19)
        heights = (20, 17, 13, 19)
        offsets = (-1, 1, 0, 0)
        temperatures = ("warm", "flare", "white-hot", "cool")
        result = resize_pose(source, widths[frame], heights[frame], offsets[frame])
        return core_temperature(stone_stress(result, frame), temperatures[frame])

    if animation == "cast":
        # The furnace core draws inward, swells, peaks white-hot, and vents down.
        widths = (18, 19, 20, 17)
        heights = (18, 19, 20, 16)
        offsets = (0, -1, 0, 1)
        temperatures = ("quiet", "warm", "white-hot", "cool")
        result = resize_pose(source, widths[frame], heights[frame], offsets[frame])
        return core_temperature(result, temperatures[frame])

    if animation == "hurt":
        widths = (20, 17)
        heights = (19, 14)
        offsets = (1, -1)
        result = resize_pose(source, widths[frame], heights[frame], offsets[frame])
        if frame == 0:
            return replace_colors(
                result,
                {
                    STONE["shadow"]: "#767b86",
                    STONE["base"]: "#b9bec8",
                    STONE["highlight"]: "#f4f4f4",
                    MAGMA["shadow"]: "#dc5f4b",
                    MAGMA["base"]: "#ff9d70",
                    MAGMA["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            result,
            {
                STONE["highlight"]: STONE["base"],
                MAGMA["highlight"]: MAGMA["base"],
                MAGMA["base"]: MAGMA["shadow"],
            },
        )

    if animation == "death":
        return death_pose(source, frame, direction)
    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Lava-Core Colossus boss-animation-v1 candidate."
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
        base=AUTHORING_BASE,
        asset_prefix=ASSET_PREFIX,
        source_directions=source_directions,
        animation_source=animation_source,
        temporary_prefix="lava-core-colossus-animation-",
    )
    manifest_path = ROOT / f"{ASSET_PREFIX}-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {manifest['boss']} ({manifest['width']}x{manifest['height']} full sheet)."
    )


if __name__ == "__main__":
    main()
