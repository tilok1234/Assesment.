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

import generate_sun_crown_griffin_directions_v1 as directions
import generate_sun_crown_griffin_style_v3 as profile
import generate_sun_crown_griffin_style_v4 as base

from boss_animation_authoring_v1 import (
    build_assets,
    fit_to_safe_area,
    hex_rgb,
    replace_colors,
    squash_pose,
)


DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
ASSET_PREFIX = "sun-crown-griffin-animation-v1"
# The shared builder executes apply_engine_treatment.mjs once for the 80-pose batch.

OUTLINE = base.OUTLINE
BEAK = base.BEAK
EYE = base.EYE
FUR = base.FUR
FEATHER = base.FEATHER
SOLAR_SHADOW = "#d98b2b"
SOLAR_BASE = "#f4c84d"
SOLAR_HIGHLIGHT = "#fff2a6"


class GriffinAuthoringBase:
    """Adapter that keeps every approved Griffin direction source unchanged."""

    SLUG = "sun-crown-griffin"
    pixels_from_image = staticmethod(base.pixels_from_image)
    image_from_pixels = staticmethod(base.image_from_pixels)

    @staticmethod
    def treatment_ramps() -> list[dict[str, str]]:
        return [
            {"id": "fur", **FUR},
            {"id": "feather", **FEATHER},
        ]


AUTHORING_BASE = GriffinAuthoringBase()


def rgba(color: str) -> tuple[int, int, int, int]:
    return hex_rgb(color) + (255,)


def source_directions() -> dict[str, Image.Image]:
    # The approved direction pilot authors its profile facing right; derive the
    # left source once so every animated right frame can remain an exact mirror.
    right = profile.logical_source()
    return {
        "down": base.logical_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "right": right,
        "up": directions.up_source(),
    }


def resize_pose(
    source: Image.Image,
    width_delta: int,
    height_delta: int,
    offset_x: int = 0,
    baseline: int = 22,
) -> Image.Image:
    """Resize the occupied logical pose while preserving a grounded baseline."""

    bounds = source.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("Sun-Crown Griffin pose became empty.")
    content = source.crop(bounds)
    target_width = max(8, min(20, content.width + width_delta))
    target_height = max(5, min(20, content.height + height_delta))
    content = content.resize(
        (target_width, target_height),
        Image.Resampling.NEAREST,
    )
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    x = max(
        2,
        min(22 - target_width, ((24 - target_width) // 2) + offset_x),
    )
    y = max(2, min(22 - target_height, baseline - target_height))
    result.alpha_composite(content, (x, y))
    return result


def add_stride_claw(image: Image.Image, direction: str, frame: int) -> Image.Image:
    """Give the prowl a readable alternating planted talon at logical scale."""

    anchors = {
        "down": ((7, 20), (16, 20), (6, 21), (17, 21)),
        "left": ((14, 20), (6, 20), (15, 21), (5, 21)),
        "up": ((7, 20), (16, 20), (6, 21), (17, 21)),
    }
    result = image.copy()
    x, y = anchors[direction][frame]
    draw = ImageDraw.Draw(result)
    draw.point((x, y), fill=rgba(OUTLINE))
    inner_x = x + (1 if direction == "left" else (-1 if frame % 2 == 0 else 1))
    inner_x = max(2, min(21, inner_x))
    draw.point((inner_x, y), fill=rgba(BEAK))
    return result


def add_talon_rake(
    image: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    """Extend connected eagle talons through the pounce and impact frames."""

    paths = {
        "down": {
            1: (((8, 16), (6, 19), (5, 20)), ((16, 16), (18, 19), (19, 20))),
            2: (((8, 15), (6, 18), (3, 21)), ((16, 15), (18, 18), (21, 21))),
        },
        "left": {
            1: (((10, 16), (7, 18), (4, 19)),),
            2: (((11, 15), (7, 17), (4, 19), (2, 20)), ((7, 9), (4, 9), (2, 10))),
        },
        "up": {
            1: (((8, 16), (7, 13), (6, 11)), ((16, 16), (17, 13), (18, 11))),
            2: (((9, 17), (7, 13), (4, 9)), ((15, 17), (17, 13), (20, 9))),
        },
    }
    result = image.copy()
    draw = ImageDraw.Draw(result)
    for points in paths[direction].get(frame, ()):
        draw.line(points, fill=rgba(OUTLINE), width=3, joint="curve")
        draw.line(points, fill=rgba(BEAK), width=1, joint="curve")
        draw.point(points[-1], fill=rgba(SOLAR_HIGHLIGHT))
    return result


def add_solar_marks(
    image: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    """Build a compact crown-shaped flare around the casting silhouette."""

    patterns = {
        "down": (
            ((6, 7), (18, 7)),
            ((4, 6), (20, 6), (12, 2)),
            ((2, 5), (21, 5), (5, 2), (19, 2), (12, 3)),
            ((5, 5), (19, 5), (12, 2)),
        ),
        "left": (
            ((4, 5), (18, 7)),
            ((3, 3), (18, 5), (20, 9)),
            ((2, 2), (5, 3), (17, 3), (21, 7), (19, 12)),
            ((3, 4), (18, 5), (20, 10)),
        ),
        "up": (
            ((6, 7), (18, 7)),
            ((4, 6), (20, 6), (12, 2)),
            ((2, 5), (21, 5), (5, 2), (19, 2), (12, 3)),
            ((5, 5), (19, 5), (12, 2)),
        ),
    }
    result = image.copy()
    draw = ImageDraw.Draw(result)
    colors = (SOLAR_SHADOW, SOLAR_BASE, SOLAR_HIGHLIGHT)
    for index, point in enumerate(patterns[direction][frame]):
        color = colors[(index + frame) % len(colors)]
        draw.point(point, fill=rgba(color))
        if frame == 2 and point[1] + 1 <= 21 and not result.getpixel((point[0], point[1] + 1))[3]:
            draw.point((point[0], point[1] + 1), fill=rgba(SOLAR_SHADOW))
    return result


def solar_phase(image: Image.Image, frame: int) -> Image.Image:
    replacements = (
        {
            FEATHER["highlight"]: "#fff5dc",
            BEAK: SOLAR_BASE,
        },
        {
            FEATHER["base"]: "#f1dfb4",
            FEATHER["highlight"]: "#fff8e5",
            BEAK: SOLAR_HIGHLIGHT,
            EYE: SOLAR_BASE,
        },
        {
            FEATHER["shadow"]: "#c9a55f",
            FEATHER["base"]: "#fff0bf",
            FEATHER["highlight"]: "#fffcec",
            BEAK: SOLAR_HIGHLIGHT,
            EYE: "#ffffff",
        },
        {
            FEATHER["highlight"]: "#fff5dc",
            BEAK: SOLAR_BASE,
            EYE: SOLAR_SHADOW,
        },
    )[frame]
    return replace_colors(image, replacements)


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    """Fold the wings into a four-stage fall, impact, and grounded collapse."""

    angles = (8, 27, 54, 76)
    if direction == "left":
        angle = -angles[frame]
    elif direction == "up":
        angle = -angles[frame]
    else:
        angle = angles[frame]
    rotated = source.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    collapsed = fit_to_safe_area(rotated)
    if frame == 1:
        collapsed = resize_pose(collapsed, -1, -2, 0, 22)
    elif frame == 2:
        collapsed = squash_pose(collapsed, 11, -1 if direction == "left" else 1)
    elif frame == 3:
        collapsed = squash_pose(collapsed, 6, -2 if direction == "left" else 2)

    dimming = (
        {
            FEATHER["highlight"]: FEATHER["base"],
            BEAK: SOLAR_BASE,
        },
        {
            FEATHER["highlight"]: FEATHER["base"],
            FUR["highlight"]: FUR["base"],
            BEAK: SOLAR_SHADOW,
        },
        {
            FEATHER["highlight"]: FEATHER["shadow"],
            FEATHER["base"]: FEATHER["shadow"],
            FUR["highlight"]: FUR["base"],
            EYE: OUTLINE,
        },
        {
            FEATHER["highlight"]: "#725f48",
            FEATHER["base"]: "#725f48",
            FEATHER["shadow"]: "#554737",
            FUR["highlight"]: FUR["shadow"],
            FUR["base"]: FUR["shadow"],
            BEAK: "#70542a",
            EYE: OUTLINE,
        },
    )[frame]
    return replace_colors(collapsed, dimming)


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
        settled = resize_pose(source, -1, -1)
        return replace_colors(
            settled,
            {
                FEATHER["highlight"]: FEATHER["base"],
                FUR["highlight"]: FUR["base"],
            },
        )

    if animation == "walk":
        dimensions = ((-1, -1), (0, -2), (-2, 0), (-1, -3))
        offsets = (-1, 0, 1, 0)
        baselines = (22, 21, 22, 21)
        result = resize_pose(
            source,
            dimensions[frame][0],
            dimensions[frame][1],
            offsets[frame],
            baselines[frame],
        )
        result = add_stride_claw(result, direction, frame)
        tones = (
            {FUR["highlight"]: FUR["base"]},
            {FEATHER["highlight"]: FEATHER["base"]},
            {FUR["base"]: FUR["highlight"]},
            {FEATHER["shadow"]: FEATHER["base"]},
        )[frame]
        return replace_colors(result, tones)

    if animation == "attack":
        dimensions = ((-2, -3), (-1, -1), (-2, 0), (-1, -2))
        offsets_by_direction = {
            "down": (0, 0, 0, 1),
            "left": (1, 0, 1, 0),
            "up": (0, 0, 0, -1),
        }
        baselines = (22, 21, 21, 22)
        result = resize_pose(
            source,
            dimensions[frame][0],
            dimensions[frame][1],
            offsets_by_direction[direction][frame],
            baselines[frame],
        )
        result = add_talon_rake(result, direction, frame)
        if frame == 2:
            return replace_colors(
                result,
                {
                    BEAK: SOLAR_HIGHLIGHT,
                    FEATHER["highlight"]: "#ffffff",
                    FUR["highlight"]: "#efb95f",
                },
            )
        if frame == 3:
            return replace_colors(
                result,
                {
                    FEATHER["highlight"]: FEATHER["base"],
                    FUR["highlight"]: FUR["base"],
                },
            )
        return result

    if animation == "cast":
        dimensions = ((-2, -2), (-1, -1), (0, 0), (-2, -1))
        offsets = (0, 0, 0, 1 if direction == "left" else 0)
        baselines = (22, 21, 21, 22)
        result = resize_pose(
            source,
            dimensions[frame][0],
            dimensions[frame][1],
            offsets[frame],
            baselines[frame],
        )
        result = add_solar_marks(result, direction, frame)
        return solar_phase(result, frame)

    if animation == "hurt":
        dimensions = ((0, -2), (-3, -5))
        offsets_by_direction = {
            "down": (1, -1),
            "left": (1, 2),
            "up": (-1, 1),
        }
        result = resize_pose(
            source,
            dimensions[frame][0],
            dimensions[frame][1],
            offsets_by_direction[direction][frame],
            (21, 22)[frame],
        )
        if frame == 0:
            return replace_colors(
                result,
                {
                    FUR["shadow"]: "#b86f63",
                    FUR["base"]: "#efb3a0",
                    FUR["highlight"]: "#ffffff",
                    FEATHER["shadow"]: "#c8a6a0",
                    FEATHER["base"]: "#f5d8d0",
                    FEATHER["highlight"]: "#ffffff",
                    BEAK: "#fff0ba",
                    EYE: "#ffffff",
                },
            )
        return replace_colors(
            result,
            {
                FUR["highlight"]: FUR["base"],
                FEATHER["highlight"]: FEATHER["base"],
                BEAK: SOLAR_SHADOW,
            },
        )

    if animation == "death":
        return death_pose(source, frame, direction)
    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Sun-Crown Griffin boss-animation-v1 candidate."
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
        temporary_prefix="sun-crown-griffin-animation-",
    )
    manifest_path = ROOT / f"{ASSET_PREFIX}-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {manifest['boss']} ({manifest['width']}x{manifest['height']} full sheet)."
    )


if __name__ == "__main__":
    main()
