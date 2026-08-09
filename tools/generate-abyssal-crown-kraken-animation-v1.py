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

import generate_abyssal_crown_kraken_directions_v1 as directions
import generate_abyssal_crown_kraken_style_v2 as base

from boss_animation_authoring_v1 import build_assets, hex_rgb, replace_colors


# The shared builder executes apply_engine_treatment.mjs once for the 80-pose batch.
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
ASSET_PREFIX = "abyssal-crown-kraken-animation-v1"

OUTLINE = base.OUTLINE
INK = base.INK
EYE = base.EYE
BODY = base.BODY
GLOW = base.GLOW


class KrakenAuthoringBase:
    """Adapter that leaves the approved v2 style source byte-for-byte unchanged."""

    SLUG = "abyssal-crown-kraken"
    pixels_from_image = staticmethod(base.pixels_from_image)
    image_from_pixels = staticmethod(base.image_from_pixels)

    @staticmethod
    def treatment_ramps() -> list[dict[str, str]]:
        return [
            {"id": "body", **BODY},
            {"id": "glow", **GLOW},
        ]


AUTHORING_BASE = KrakenAuthoringBase()


def rgba(color: str) -> tuple[int, int, int, int]:
    return hex_rgb(color) + (255,)


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
    baseline: int = 22,
) -> Image.Image:
    bounds = source.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("Abyssal Crown-Kraken pose became empty.")
    content = source.crop(bounds).resize(
        (target_width, target_height),
        Image.Resampling.NEAREST,
    )
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    x = max(2, min(22 - target_width, ((24 - target_width) // 2) + offset_x))
    y = max(2, min(22 - target_height, baseline - target_height))
    result.alpha_composite(content, (x, y))
    return result


TENTACLE_WAVES = (
    (0, 0, 1, 1, 0, -1, -1, 0, 1),
    (0, -1, -1, 0, 1, 1, 0, -1, -1),
    (0, 0, -1, -1, 0, 1, 1, 0, -1),
    (0, 1, 1, 0, -1, -1, 0, 1, 1),
)


def wave_tentacles(image: Image.Image, phase: int) -> Image.Image:
    """Ripple the lower limb rows while leaving the armored mantle readable."""

    shifts = TENTACLE_WAVES[phase]
    result = Image.new("RGBA", image.size, (0, 0, 0, 0))
    for y in range(image.height):
        dx = shifts[min(y - 13, len(shifts) - 1)] if y >= 13 else 0
        for x in range(image.width):
            pixel = image.getpixel((x, y))
            if not pixel[3]:
                continue
            target_x = max(2, min(21, x + dx))
            result.putpixel((target_x, y), pixel)
    return result


def glow_phase(image: Image.Image, phase: str) -> Image.Image:
    replacements = {
        "ebb": {
            GLOW["highlight"]: GLOW["base"],
            EYE: GLOW["highlight"],
        },
        "rise": {
            GLOW["shadow"]: GLOW["base"],
            GLOW["base"]: GLOW["highlight"],
            EYE: "#e9ffd1",
        },
        "surge": {
            GLOW["shadow"]: GLOW["base"],
            GLOW["base"]: "#d9b2ff",
            GLOW["highlight"]: "#fff4ff",
            EYE: "#ffffff",
        },
        "spent": {
            GLOW["highlight"]: GLOW["base"],
            GLOW["base"]: GLOW["shadow"],
            EYE: "#9fba83",
        },
    }[phase]
    return replace_colors(image, replacements)


def add_lash(image: Image.Image, direction: str) -> Image.Image:
    paths = {
        "down": [(13, 14), (15, 16), (18, 17), (20, 20)],
        "left": [(9, 14), (7, 15), (5, 17), (3, 19)],
        "up": [(11, 15), (9, 13), (6, 12), (3, 10)],
    }
    points = paths[direction]
    result = image.copy()
    draw = ImageDraw.Draw(result)
    draw.line(points, fill=rgba(OUTLINE), width=3, joint="curve")
    draw.line(points, fill=rgba(BODY["base"]), width=1, joint="curve")
    for point in points[1:-1]:
        draw.point(point, fill=rgba(BODY["highlight"]))
    draw.point(points[-1], fill=rgba(GLOW["highlight"]))
    return result


def add_cast_marks(
    image: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    patterns = {
        "down": (
            ((5, 8), (19, 8)),
            ((4, 6), (20, 6), (12, 2)),
            ((3, 5), (21, 5), (5, 2), (19, 2)),
            ((6, 4), (18, 4)),
        ),
        "left": (
            ((4, 7), (19, 12)),
            ((3, 5), (20, 9), (7, 2)),
            ((3, 3), (20, 7), (4, 12), (19, 15)),
            ((5, 4), (18, 10)),
        ),
        "up": (
            ((5, 9), (19, 9)),
            ((4, 7), (20, 7), (12, 2)),
            ((3, 6), (21, 6), (5, 2), (19, 2)),
            ((6, 5), (18, 5)),
        ),
    }
    result = image.copy()
    draw = ImageDraw.Draw(result)
    colors = (GLOW["shadow"], GLOW["base"], GLOW["highlight"], EYE)
    for index, point in enumerate(patterns[direction][frame]):
        draw.point(point, fill=rgba(colors[(index + frame) % len(colors)]))
    return result


def add_tentacle_sprawl(
    image: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if frame == 0:
        return image
    patterns = {
        "down": (
            (),
            (((10, 18), (6, 20), (3, 20)), ((14, 18), (18, 20), (21, 20))),
            (((11, 18), (7, 19), (3, 20)), ((13, 18), (17, 19), (21, 20))),
            (((10, 19), (6, 20), (2, 20)), ((14, 19), (18, 20), (21, 20))),
        ),
        "left": (
            (),
            (((9, 18), (5, 19), (2, 20)), ((14, 18), (18, 20), (21, 20))),
            (((8, 18), (5, 19), (2, 20)), ((13, 18), (17, 19), (20, 20))),
            (((8, 19), (4, 20), (2, 20)), ((13, 19), (17, 20), (20, 20))),
        ),
        "up": (
            (),
            (((9, 18), (6, 19), (3, 20)), ((15, 18), (18, 19), (21, 20))),
            (((10, 18), (6, 19), (2, 20)), ((14, 18), (18, 19), (21, 20))),
            (((10, 19), (5, 20), (2, 20)), ((14, 19), (19, 20), (21, 20))),
        ),
    }
    result = image.copy()
    draw = ImageDraw.Draw(result)
    for index, points in enumerate(patterns[direction][frame]):
        draw.line(points, fill=rgba(OUTLINE), width=3, joint="curve")
        draw.line(
            points,
            fill=rgba(BODY["base"] if index == 0 else BODY["shadow"]),
            width=1,
            joint="curve",
        )
        draw.point(points[-1], fill=rgba(GLOW["shadow"]))
    return result


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    widths = (20, 20, 20, 19)
    heights = (18, 14, 9, 5)
    offsets = (0, 1, -1, 0)
    collapsed = resize_pose(source, widths[frame], heights[frame], offsets[frame])
    collapsed = add_tentacle_sprawl(collapsed, direction, frame)
    dimming = (
        {
            GLOW["highlight"]: GLOW["base"],
            EYE: GLOW["highlight"],
        },
        {
            GLOW["highlight"]: GLOW["base"],
            GLOW["base"]: GLOW["shadow"],
            EYE: "#9fba83",
        },
        {
            BODY["highlight"]: BODY["base"],
            GLOW["highlight"]: GLOW["shadow"],
            GLOW["base"]: GLOW["shadow"],
            EYE: INK,
        },
        {
            BODY["highlight"]: BODY["shadow"],
            BODY["base"]: BODY["shadow"],
            GLOW["highlight"]: OUTLINE,
            GLOW["base"]: OUTLINE,
            GLOW["shadow"]: OUTLINE,
            EYE: INK,
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
        breathing = resize_pose(source, 19, 19)
        return glow_phase(wave_tentacles(breathing, 0), "rise")

    if animation == "walk":
        widths = (19, 20, 19, 20)
        heights = (19, 18, 20, 18)
        offsets = (-1, 0, 1, 0)
        phases = (0, 1, 2, 3)
        glows = ("ebb", "rise", "surge", "rise")
        result = resize_pose(source, widths[frame], heights[frame], offsets[frame])
        return glow_phase(wave_tentacles(result, phases[frame]), glows[frame])

    if animation == "attack":
        widths = (18, 20, 19, 19)
        heights = (19, 20, 17, 19)
        offsets = (-1, 1, 0, 0)
        phases = (1, 2, 3, 0)
        glows = ("ebb", "rise", "surge", "spent")
        result = resize_pose(source, widths[frame], heights[frame], offsets[frame])
        result = wave_tentacles(result, phases[frame])
        if frame == 2:
            result = add_lash(result, direction)
        return glow_phase(result, glows[frame])

    if animation == "cast":
        widths = (18, 19, 20, 19)
        heights = (18, 19, 20, 18)
        offsets = (0, -1, 0, 1)
        baselines = (22, 21, 22, 22)
        phases = (0, 1, 2, 3)
        glows = ("ebb", "rise", "surge", "spent")
        result = resize_pose(
            source,
            widths[frame],
            heights[frame],
            offsets[frame],
            baselines[frame],
        )
        result = wave_tentacles(result, phases[frame])
        result = add_cast_marks(result, direction, frame)
        return glow_phase(result, glows[frame])

    if animation == "hurt":
        widths = (20, 18)
        heights = (18, 15)
        offsets = (1, -1)
        result = wave_tentacles(
            resize_pose(source, widths[frame], heights[frame], offsets[frame]),
            (2, 0)[frame],
        )
        if frame == 0:
            return replace_colors(
                result,
                {
                    BODY["shadow"]: "#7467a6",
                    BODY["base"]: "#b7a0dc",
                    BODY["highlight"]: "#f2ebff",
                    GLOW["shadow"]: "#aa86d8",
                    GLOW["base"]: "#e2c9ff",
                    GLOW["highlight"]: "#ffffff",
                    EYE: "#ffffff",
                },
            )
        return replace_colors(
            result,
            {
                BODY["highlight"]: BODY["base"],
                GLOW["highlight"]: GLOW["base"],
                GLOW["base"]: GLOW["shadow"],
                EYE: "#9fba83",
            },
        )

    if animation == "death":
        return death_pose(source, frame, direction)
    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Abyssal Crown-Kraken boss-animation-v1 candidate."
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
        temporary_prefix="abyssal-crown-kraken-animation-",
    )
    manifest_path = ROOT / f"{ASSET_PREFIX}-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {manifest['boss']} ({manifest['width']}x{manifest['height']} full sheet)."
    )


if __name__ == "__main__":
    main()
