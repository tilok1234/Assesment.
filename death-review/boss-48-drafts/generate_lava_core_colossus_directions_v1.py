from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_lava_core_colossus_style_v2 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
STONE = base.STONE
MAGMA = base.MAGMA


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Uneven shoulders rotate into staggered boulders rather than a front arch.
    poly(d, [(8, 8), (6, 5), (3, 4), (2, 7), (3, 11), (6, 13), (9, 11)], STONE["base"])
    poly(d, [(13, 8), (16, 6), (19, 3), (21, 5), (20, 10), (17, 13), (14, 11)], STONE["base"])
    rect(d, (3, 6, 5, 9), STONE["highlight"])
    rect(d, (18, 5, 20, 8), STONE["highlight"])
    rect(d, (2, 9, 5, 11), STONE["shadow"])
    rect(d, (18, 9, 20, 11), STONE["shadow"])

    # The leading fist projects left while the far arm recedes behind the back.
    poly(d, [(6, 10), (9, 12), (8, 18), (6, 21), (2, 19), (2, 13)], STONE["base"])
    rect(d, (2, 14, 4, 18), STONE["highlight"])
    rect(d, (3, 18, 6, 21), STONE["shadow"])
    rect(d, (3, 19, 4, 20), OUTLINE)
    poly(d, [(15, 10), (19, 12), (21, 16), (20, 20), (17, 21), (15, 17)], STONE["shadow"])
    rect(d, (18, 13, 20, 17), STONE["base"])
    rect(d, (18, 18, 21, 21), STONE["shadow"])
    rect(d, (19, 19, 20, 20), OUTLINE)

    # A long side torso stays massive but exposes fewer front-facing planes.
    poly(d, [(8, 7), (14, 7), (17, 11), (17, 18), (15, 21), (6, 21), (4, 18), (5, 11)], STONE["base"])
    rect(d, (5, 10, 7, 17), STONE["shadow"])
    rect(d, (14, 10, 16, 17), STONE["shadow"])
    rect(d, (8, 8, 14, 10), STONE["highlight"])
    poly(d, [(6, 17), (16, 17), (15, 21), (6, 21)], STONE["shadow"])

    # One leading eye, projecting brow, muzzle, and jaw establish facing.
    poly(d, [(7, 5), (9, 3), (13, 3), (15, 5), (15, 11), (13, 13), (8, 13), (6, 10), (6, 7)], STONE["base"])
    rect(d, (8, 4, 13, 5), STONE["highlight"])
    rect(d, (11, 9, 14, 12), STONE["shadow"])
    poly(d, [(6, 7), (4, 8), (6, 10), (9, 10), (9, 7)], STONE["base"])
    rect(d, (5, 7, 7, 8), MAGMA["highlight"])
    rect(d, (5, 8, 5, 8), OUTLINE)
    rect(d, (5, 10, 9, 10), OUTLINE)
    rect(d, (7, 11, 10, 11), STONE["highlight"])

    # The front furnace compresses into one narrow side vent and short fissures.
    rect(d, (7, 12, 11, 18), OUTLINE)
    poly(d, [(8, 13), (10, 13), (11, 15), (10, 18), (8, 18), (7, 15)], MAGMA["shadow"])
    rect(d, (8, 14, 9, 17), MAGMA["base"])
    rect(d, (8, 14, 9, 15), MAGMA["highlight"])
    rect(d, (6, 12, 6, 14), MAGMA["base"])
    rect(d, (5, 14, 6, 14), MAGMA["highlight"])
    rect(d, (15, 12, 15, 14), MAGMA["shadow"])
    rect(d, (14, 14, 15, 14), MAGMA["base"])

    # Planted feet and sparse cracks keep the family language intact.
    rect(d, (6, 19, 9, 21), STONE["shadow"])
    rect(d, (12, 19, 15, 21), STONE["shadow"])
    rect(d, (5, 20, 9, 21), OUTLINE)
    rect(d, (12, 20, 16, 21), OUTLINE)
    rect(d, (7, 18, 7, 19), MAGMA["shadow"])
    rect(d, (14, 18, 14, 19), MAGMA["base"])

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Rear shoulder boulders remain irregular and frame the back of the head.
    poly(d, [(8, 7), (6, 4), (3, 3), (2, 6), (3, 11), (6, 13), (9, 11)], STONE["base"])
    poly(d, [(15, 7), (17, 5), (20, 3), (21, 6), (20, 11), (18, 13), (15, 11)], STONE["base"])
    rect(d, (3, 5, 5, 8), STONE["shadow"])
    rect(d, (18, 5, 20, 8), STONE["shadow"])
    rect(d, (2, 9, 5, 11), STONE["highlight"])
    rect(d, (19, 9, 21, 11), STONE["highlight"])
    rect(d, (5, 8, 7, 10), OUTLINE)
    rect(d, (17, 8, 19, 10), OUTLINE)

    # Both arms face away as separate rock columns with rear-lit planes.
    poly(d, [(5, 9), (8, 12), (7, 18), (5, 21), (2, 19), (2, 13)], STONE["base"])
    poly(d, [(18, 9), (21, 12), (21, 19), (18, 21), (16, 18), (16, 12)], STONE["base"])
    rect(d, (2, 14, 4, 18), STONE["shadow"])
    rect(d, (19, 13, 21, 17), STONE["shadow"])
    rect(d, (3, 18, 6, 21), STONE["shadow"])
    rect(d, (18, 18, 21, 21), STONE["shadow"])
    rect(d, (3, 19, 4, 20), OUTLINE)
    rect(d, (19, 19, 20, 20), OUTLINE)

    # A broad rear plate replaces the front furnace with a stone spine.
    poly(d, [(8, 7), (15, 7), (18, 11), (18, 18), (16, 21), (7, 21), (5, 18), (5, 11)], STONE["base"])
    rect(d, (6, 10, 8, 17), STONE["shadow"])
    rect(d, (15, 10, 17, 17), STONE["shadow"])
    rect(d, (8, 8, 15, 10), STONE["highlight"])
    rect(d, (10, 11, 14, 18), STONE["shadow"])
    rect(d, (11, 10, 12, 18), STONE["highlight"])
    rect(d, (9, 13, 15, 13), OUTLINE)
    rect(d, (9, 17, 15, 17), OUTLINE)
    poly(d, [(7, 18), (17, 18), (16, 21), (7, 21)], STONE["shadow"])

    # Back of the integrated head contains no eyes, mouth, or front brow.
    poly(d, [(8, 5), (10, 3), (14, 3), (16, 5), (16, 11), (14, 13), (9, 13), (7, 10), (7, 7)], STONE["base"])
    rect(d, (9, 4, 14, 5), STONE["highlight"])
    rect(d, (8, 9, 15, 12), STONE["shadow"])
    rect(d, (10, 6, 14, 10), STONE["shadow"])
    rect(d, (11, 6, 13, 9), STONE["base"])

    # Only restrained magma fissures remain on the back and limbs.
    rect(d, (6, 12, 6, 14), MAGMA["shadow"])
    rect(d, (5, 14, 6, 14), MAGMA["base"])
    rect(d, (17, 11, 17, 13), MAGMA["shadow"])
    rect(d, (16, 13, 17, 13), MAGMA["base"])
    rect(d, (11, 14, 11, 16), MAGMA["shadow"])
    rect(d, (12, 16, 12, 17), MAGMA["base"])

    rect(d, (7, 19, 10, 21), STONE["shadow"])
    rect(d, (13, 19, 16, 21), STONE["shadow"])
    rect(d, (6, 20, 10, 21), OUTLINE)
    rect(d, (13, 20, 17, 21), OUTLINE)
    rect(d, (8, 18, 8, 19), MAGMA["shadow"])
    rect(d, (15, 18, 15, 19), MAGMA["base"])

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"lava-core-colossus-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("stone", STONE),
                ("magma", MAGMA),
            ]
        ],
    }
    input_path = ROOT / f"{prefix}-source.json"
    treated_path = ROOT / f"{prefix}-treated.json"
    input_path.write_text(json.dumps(treatment_input), encoding="utf-8")
    subprocess.run(
        [
            "node",
            str(ROOT / "apply_engine_treatment.mjs"),
            str(input_path),
            str(treated_path),
        ],
        check=True,
        cwd=ROOT,
    )
    treated = json.loads(treated_path.read_text(encoding="utf-8"))
    logical = base.image_from_pixels(treated["width"], treated["height"], treated["pixels"])
    frame = logical.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.NEAREST)

    alpha_values = set(frame.getchannel("A").get_flattened_data())
    if not alpha_values <= {0, 255}:
        raise ValueError(f"{direction} contains intermediate alpha: {sorted(alpha_values)}")
    bounds = frame.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"{direction} lacks a two-pixel safety border: {bounds}")
    colors = {pixel for pixel in frame.get_flattened_data() if pixel[3] == 255}
    frame.save(ROOT / f"{prefix}.png", optimize=False)
    return frame, {
        "direction": direction,
        "file": f"{prefix}.png",
        "bounds": list(bounds),
        "opaqueColors": len(colors),
    }


def main() -> None:
    left = left_source()
    sources = {
        "down": base.logical_source(),
        "left": left,
        "right": left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": up_source(),
    }
    frames: list[Image.Image] = []
    facts: list[dict[str, object]] = []
    for direction in DIRECTIONS:
        frame, frame_facts = treat_direction(direction, sources[direction])
        frames.append(frame)
        facts.append(frame_facts)

    approved_down = Image.open(ROOT / "lava-core-colossus-style-v2.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Lava-Core Colossus v2.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "lava-core-colossus-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "lava-core-colossus-directions-v1-manifest.json").write_text(
        json.dumps(
            {
                "file": sheet_path.name,
                "width": sheet.width,
                "height": sheet.height,
                "cell": OUTPUT_SIZE,
                "directionOrder": list(DIRECTIONS),
                "hardAlpha": True,
                "downMatchesApprovedV2": True,
                "treatment": "24px logical Form + Complete B, nearest-neighbor 2x",
                "integrated": False,
                "frames": facts,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
