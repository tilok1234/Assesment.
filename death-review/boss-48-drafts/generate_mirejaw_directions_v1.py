from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_mirejaw_style_v2 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
SKIN = base.SKIN
BELLY = base.BELLY
STONE = base.STONE
MOSS = base.MOSS
EYE = base.EYE
BONE = base.BONE


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Trailing tail and far limbs sit behind the narrower profile torso.
    poly(d, [(16, 12), (19, 11), (21, 12), (20, 14), (21, 16), (18, 18), (15, 17)], SKIN["shadow"])
    rect(d, (13, 17, 16, 21), SKIN["shadow"])
    rect(d, (12, 20, 17, 21), STONE["shadow"])
    poly(d, [(9, 9), (16, 9), (18, 13), (17, 18), (14, 20), (9, 19), (7, 16), (7, 12)], SKIN["base"])
    rect(d, (15, 12, 17, 18), SKIN["shadow"])

    # The belly becomes a narrow leading plane instead of a centered front panel.
    poly(d, [(7, 11), (10, 11), (11, 18), (9, 20), (7, 17), (6, 13)], BELLY["base"])
    rect(d, (7, 12, 8, 17), BELLY["highlight"])
    rect(d, (9, 17, 10, 19), BELLY["shadow"])

    # Near arm and foot remain large; far-side equivalents recede.
    poly(d, [(7, 11), (5, 12), (4, 15), (5, 18), (7, 18), (9, 16), (9, 12)], SKIN["base"])
    rect(d, (4, 13, 5, 16), SKIN["highlight"])
    rect(d, (4, 17, 5, 18), BONE)
    rect(d, (7, 17, 8, 21), SKIN["base"])
    rect(d, (6, 20, 10, 21), STONE["shadow"])
    rect(d, (7, 20, 7, 21), OUTLINE)
    rect(d, (9, 20, 9, 21), OUTLINE)

    # Rotated shoulder plates show a broad near plate and slim far plate.
    poly(d, [(8, 11), (8, 7), (10, 5), (12, 7), (12, 11)], STONE["base"])
    rect(d, (9, 6, 10, 7), STONE["highlight"])
    rect(d, (8, 10, 11, 11), STONE["shadow"])
    rect(d, (9, 5, 10, 5), MOSS)
    poly(d, [(15, 10), (15, 7), (17, 6), (18, 9), (17, 12)], STONE["shadow"])
    rect(d, (16, 6, 17, 6), MOSS)

    # Long crocodile profile: one eye, one nostril, one tusk, trailing skull mass.
    poly(
        d,
        [(4, 6), (7, 4), (13, 4), (16, 5), (18, 7), (18, 10),
         (16, 12), (10, 13), (5, 12), (3, 10), (3, 7)],
        SKIN["base"],
    )
    rect(d, (3, 7, 4, 10), SKIN["highlight"])
    rect(d, (15, 5, 17, 10), SKIN["shadow"])
    rect(d, (6, 4, 10, 5), SKIN["highlight"])

    # Crown spikes turn with the skull instead of remaining front-facing.
    poly(d, [(8, 5), (9, 2), (11, 4), (13, 2), (14, 5), (16, 3), (17, 6)], STONE["base"])
    rect(d, (9, 2, 9, 4), STONE["highlight"])
    rect(d, (13, 3, 13, 4), STONE["highlight"])
    rect(d, (15, 4, 16, 5), STONE["shadow"])
    rect(d, (10, 4, 11, 4), MOSS)

    rect(d, (6, 7, 8, 8), OUTLINE)
    rect(d, (7, 7, 7, 7), EYE)
    rect(d, (4, 9, 4, 9), OUTLINE)
    rect(d, (3, 10, 13, 10), OUTLINE)
    rect(d, (4, 11, 12, 12), BELLY["highlight"])
    rect(d, (7, 12, 8, 13), BONE)
    rect(d, (9, 12, 12, 13), BELLY["base"])

    # Profile layer breaks prevent the near limbs from merging into the torso.
    rect(d, (8, 15, 9, 16), OUTLINE)
    rect(d, (11, 18, 12, 19), OUTLINE)

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Tail, legs, and broad back retain the approved overall scale.
    poly(d, [(17, 13), (20, 11), (21, 12), (20, 14), (21, 16), (18, 18), (16, 17)], SKIN["shadow"])
    rect(d, (6, 17, 9, 21), SKIN["shadow"])
    rect(d, (14, 17, 17, 21), SKIN["shadow"])
    rect(d, (5, 20, 10, 21), STONE["shadow"])
    rect(d, (13, 20, 18, 21), STONE["shadow"])
    poly(d, [(6, 10), (17, 10), (19, 14), (18, 19), (15, 20), (8, 20), (5, 18), (4, 14)], SKIN["base"])
    rect(d, (5, 14, 6, 18), SKIN["shadow"])
    rect(d, (17, 14, 18, 18), SKIN["shadow"])

    # Rear arms show knuckles only; claws and belly markings disappear.
    poly(d, [(5, 11), (3, 12), (2, 15), (3, 18), (5, 18), (7, 16), (7, 12)], SKIN["base"])
    poly(d, [(18, 11), (20, 12), (21, 15), (20, 18), (18, 18), (16, 16), (16, 12)], SKIN["base"])
    rect(d, (2, 13, 3, 16), SKIN["highlight"])
    rect(d, (20, 13, 21, 16), SKIN["highlight"])
    rect(d, (3, 17, 5, 18), SKIN["shadow"])
    rect(d, (18, 17, 20, 18), SKIN["shadow"])

    # Central dorsal plate replaces every front-only belly and muzzle feature.
    poly(d, [(8, 11), (15, 11), (16, 18), (14, 20), (9, 20), (7, 18)], STONE["base"])
    rect(d, (9, 12, 14, 13), STONE["highlight"])
    rect(d, (8, 17, 15, 19), STONE["shadow"])
    rect(d, (11, 12, 12, 19), OUTLINE)
    rect(d, (9, 14, 10, 14), MOSS)
    rect(d, (13, 16, 14, 16), MOSS)

    # Shoulder plates and rear skull overlap correctly from behind.
    poly(d, [(4, 11), (4, 8), (6, 6), (8, 7), (8, 12)], STONE["base"])
    poly(d, [(19, 11), (19, 8), (17, 6), (15, 7), (15, 12)], STONE["base"])
    rect(d, (5, 7, 6, 8), STONE["highlight"])
    rect(d, (17, 7, 18, 8), STONE["highlight"])
    rect(d, (4, 10, 6, 11), STONE["shadow"])
    rect(d, (17, 10, 19, 11), STONE["shadow"])
    rect(d, (6, 6, 7, 6), MOSS)
    rect(d, (16, 6, 17, 6), MOSS)

    poly(
        d,
        [(6, 4), (9, 3), (11, 4), (13, 3), (17, 4), (19, 6),
         (20, 9), (19, 12), (16, 13), (7, 13), (4, 11), (3, 8), (4, 6)],
        SKIN["base"],
    )
    rect(d, (4, 7, 5, 10), SKIN["shadow"])
    rect(d, (18, 7, 19, 10), SKIN["shadow"])
    rect(d, (6, 4, 9, 5), SKIN["highlight"])
    rect(d, (14, 4, 17, 5), SKIN["highlight"])

    # The crown is seen from behind; no eyes, nostrils, mouth, tusks, or belly.
    poly(d, [(7, 5), (8, 2), (10, 4), (12, 2), (14, 4), (16, 2), (17, 6)], STONE["base"])
    rect(d, (8, 2, 8, 4), STONE["highlight"])
    rect(d, (12, 2, 12, 4), STONE["highlight"])
    rect(d, (15, 3, 15, 5), STONE["shadow"])
    rect(d, (9, 4, 10, 4), MOSS)
    rect(d, (13, 4, 14, 4), MOSS)
    poly(d, [(7, 8), (10, 6), (14, 6), (17, 8), (16, 12), (8, 12)], STONE["shadow"])
    rect(d, (9, 7, 14, 8), STONE["base"])
    rect(d, (10, 7, 11, 7), MOSS)

    rect(d, (6, 16, 7, 17), OUTLINE)
    rect(d, (16, 16, 17, 17), OUTLINE)
    rect(d, (7, 20, 7, 21), OUTLINE)
    rect(d, (9, 20, 9, 21), OUTLINE)
    rect(d, (14, 20, 14, 21), OUTLINE)
    rect(d, (16, 20, 16, 21), OUTLINE)

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"ancient-mirejaw-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("skin", SKIN),
                ("belly", BELLY),
                ("stone", STONE),
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

    approved_down = Image.open(ROOT / "ancient-mirejaw-style-v2.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Ancient Mirejaw v2.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "ancient-mirejaw-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "ancient-mirejaw-directions-v1-manifest.json").write_text(
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
