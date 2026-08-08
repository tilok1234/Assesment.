from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_abyssal_crown_kraken_style_v2 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
INK = base.INK
EYE = base.EYE
BODY = base.BODY
GLOW = base.GLOW


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Crown spires stagger in depth instead of retaining the front fan.
    poly(d, [(7, 7), (6, 4), (7, 2), (9, 5), (10, 7)], BODY["shadow"])
    poly(d, [(9, 6), (11, 3), (12, 2), (13, 5), (13, 7)], BODY["base"])
    poly(d, [(12, 7), (15, 4), (17, 3), (16, 7), (15, 9)], BODY["shadow"])
    rect(d, (7, 3, 7, 4), BODY["highlight"])
    rect(d, (12, 2, 12, 3), BODY["highlight"])
    rect(d, (16, 4, 16, 5), BODY["highlight"])

    # Far tentacles trail behind the mantle in quieter shadow shapes.
    poly(d, [(13, 13), (16, 14), (19, 14), (21, 16), (21, 19), (19, 21), (17, 21), (17, 19), (19, 19), (19, 17), (16, 16), (13, 16)], BODY["shadow"])
    poly(d, [(12, 14), (15, 16), (16, 19), (15, 21), (18, 21), (18, 18), (16, 15), (14, 13)], BODY["shadow"])
    rect(d, (19, 15, 20, 17), BODY["base"])
    rect(d, (18, 20, 19, 20), GLOW["shadow"])

    # Leading tentacles curl left and keep open channels between their tips.
    poly(d, [(9, 13), (7, 15), (4, 15), (2, 17), (2, 20), (4, 21), (6, 21), (6, 19), (4, 19), (4, 17), (7, 17), (10, 15)], BODY["base"])
    poly(d, [(10, 13), (8, 16), (7, 19), (7, 21), (10, 21), (11, 18), (12, 14)], BODY["highlight"])
    poly(d, [(12, 13), (11, 17), (11, 21), (13, 21), (14, 17), (14, 14)], BODY["base"])
    rect(d, (9, 16, 9, 20), OUTLINE)
    rect(d, (12, 17, 12, 20), OUTLINE)

    # The mantle narrows but remains a tall armored bell.
    poly(d, [(8, 5), (10, 3), (14, 3), (16, 5), (17, 8), (17, 12), (15, 15), (8, 15), (6, 12), (6, 8)], BODY["base"])
    poly(d, [(7, 7), (9, 4), (12, 4), (11, 6), (8, 8), (8, 12), (7, 13), (6, 11)], BODY["highlight"])
    poly(d, [(14, 5), (16, 6), (17, 9), (16, 13), (14, 14), (14, 11)], BODY["shadow"])
    rect(d, (9, 4, 13, 4), BODY["highlight"])

    # One leading fin and one recessed far fin establish side depth.
    poly(d, [(7, 8), (4, 7), (2, 9), (4, 12), (7, 11)], BODY["shadow"])
    poly(d, [(15, 8), (18, 8), (19, 10), (17, 12), (15, 11)], BODY["shadow"])
    rect(d, (3, 9, 4, 10), BODY["highlight"])

    # A single eye and projecting beak replace the front mask.
    poly(d, [(7, 7), (9, 6), (13, 6), (15, 8), (14, 12), (12, 13), (8, 12), (7, 10)], INK)
    rect(d, (7, 8, 10, 9), EYE)
    rect(d, (9, 9, 9, 9), BODY["shadow"])
    poly(d, [(7, 10), (5, 11), (7, 13), (10, 12)], GLOW["base"])
    rect(d, (6, 11, 8, 11), GLOW["highlight"])
    rect(d, (6, 12, 6, 12), OUTLINE)

    # Sparse glyphs and sucker lights rotate with the visible limbs.
    rect(d, (9, 5, 10, 5), GLOW["shadow"])
    rect(d, (13, 5, 14, 5), GLOW["shadow"])
    rect(d, (7, 13, 8, 13), GLOW["base"])
    rect(d, (6, 17, 6, 18), GLOW["highlight"])
    rect(d, (9, 18, 9, 19), GLOW["base"])
    rect(d, (13, 18, 13, 19), GLOW["base"])
    rect(d, (17, 17, 17, 18), GLOW["shadow"])

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The sea-crown remains visible, with rear-facing value planes.
    poly(d, [(7, 7), (6, 4), (7, 2), (9, 5), (10, 7)], BODY["base"])
    poly(d, [(9, 5), (11, 3), (12, 2), (14, 4), (14, 7)], BODY["shadow"])
    poly(d, [(14, 6), (16, 3), (18, 2), (17, 6), (16, 8)], BODY["base"])
    rect(d, (7, 3, 7, 4), BODY["shadow"])
    rect(d, (12, 2, 12, 3), BODY["highlight"])
    rect(d, (17, 3, 17, 4), BODY["shadow"])

    # Rear outer tentacles curl outward while keeping negative-space notches.
    poly(d, [(8, 12), (6, 13), (4, 14), (2, 16), (2, 19), (4, 21), (6, 21), (6, 19), (4, 19), (4, 17), (6, 16), (9, 16)], BODY["shadow"])
    poly(d, [(16, 12), (18, 13), (20, 14), (21, 16), (21, 19), (19, 21), (17, 21), (17, 19), (19, 19), (19, 17), (17, 16), (15, 16)], BODY["shadow"])
    rect(d, (3, 16, 4, 18), BODY["base"])
    rect(d, (19, 15, 20, 17), BODY["base"])

    # Four rear-facing tentacles form a changed radial base.
    poly(d, [(9, 13), (7, 16), (7, 19), (6, 21), (9, 21), (10, 18), (11, 14)], BODY["highlight"])
    poly(d, [(11, 13), (10, 17), (10, 21), (12, 21), (13, 17), (13, 14)], BODY["base"])
    poly(d, [(13, 13), (13, 17), (12, 21), (15, 21), (16, 18), (15, 14)], BODY["highlight"])
    poly(d, [(15, 13), (16, 16), (16, 19), (15, 21), (18, 21), (18, 18), (17, 15)], BODY["base"])
    rect(d, (9, 16, 9, 20), OUTLINE)
    rect(d, (12, 17, 12, 20), OUTLINE)
    rect(d, (15, 17, 15, 20), OUTLINE)

    # Rear mantle replaces the recessed face with a central dorsal ridge.
    poly(d, [(8, 5), (10, 3), (14, 3), (17, 5), (18, 8), (18, 12), (16, 15), (8, 15), (6, 12), (6, 8)], BODY["base"])
    poly(d, [(7, 7), (9, 4), (12, 4), (11, 6), (8, 8), (8, 12), (7, 13), (6, 11)], BODY["shadow"])
    poly(d, [(15, 5), (17, 6), (18, 9), (17, 13), (15, 14), (15, 11)], BODY["highlight"])
    rect(d, (9, 4, 14, 4), BODY["highlight"])
    rect(d, (10, 6, 14, 12), BODY["shadow"])
    rect(d, (11, 6, 13, 11), BODY["base"])
    rect(d, (10, 8, 14, 8), OUTLINE)
    rect(d, (10, 11, 14, 11), OUTLINE)

    # Rear fins widen the upper silhouette without recreating the face.
    poly(d, [(7, 8), (5, 7), (3, 9), (5, 12), (7, 11)], BODY["shadow"])
    poly(d, [(17, 8), (19, 7), (21, 9), (19, 12), (17, 11)], BODY["shadow"])
    rect(d, (4, 9, 5, 10), BODY["base"])
    rect(d, (19, 9, 20, 10), BODY["base"])

    # Dorsal glyphs and sucker lights remain, but no eye-colored pixels do.
    rect(d, (9, 5, 10, 5), GLOW["shadow"])
    rect(d, (14, 5, 15, 5), GLOW["shadow"])
    rect(d, (11, 7, 13, 7), GLOW["base"])
    rect(d, (12, 9, 12, 10), GLOW["highlight"])
    rect(d, (7, 13, 8, 13), GLOW["base"])
    rect(d, (16, 13, 17, 13), GLOW["base"])
    rect(d, (7, 17, 7, 18), GLOW["shadow"])
    rect(d, (10, 18, 10, 19), GLOW["base"])
    rect(d, (14, 18, 14, 19), GLOW["base"])
    rect(d, (17, 17, 17, 18), GLOW["shadow"])

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"abyssal-crown-kraken-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("body", BODY),
                ("glow", GLOW),
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

    approved_down = Image.open(ROOT / "abyssal-crown-kraken-style-v2.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Abyssal Crown-Kraken v2.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "abyssal-crown-kraken-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "abyssal-crown-kraken-directions-v1-manifest.json").write_text(
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
