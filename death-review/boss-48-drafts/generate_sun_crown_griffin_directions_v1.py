from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_sun_crown_griffin_style_v3 as profile
import generate_sun_crown_griffin_style_v4 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
BEAK = base.BEAK
EYE = base.EYE
FUR = base.FUR
FEATHER = base.FEATHER


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Rear wings remain low and angled down, with reversed feather planes.
    poly(
        d,
        [(9, 9), (7, 7), (4, 7), (2, 9), (3, 12), (2, 14), (4, 16), (3, 18), (6, 18), (8, 16), (9, 13)],
        FEATHER["base"],
    )
    poly(
        d,
        [(15, 9), (17, 7), (20, 7), (21, 9), (20, 12), (21, 14), (19, 16), (20, 18), (17, 18), (16, 16), (15, 13)],
        FEATHER["base"],
    )
    poly(d, [(3, 9), (7, 9), (9, 11), (8, 13), (4, 12)], FEATHER["highlight"])
    poly(d, [(20, 9), (17, 9), (15, 11), (16, 13), (20, 12)], FEATHER["highlight"])
    poly(d, [(3, 14), (6, 13), (8, 14), (7, 17), (4, 17)], FEATHER["shadow"])
    poly(d, [(20, 14), (18, 13), (16, 14), (17, 17), (20, 17)], FEATHER["shadow"])
    rect(d, (4, 7, 6, 7), FEATHER["shadow"])
    rect(d, (18, 7, 20, 7), FEATHER["shadow"])

    # Lion hindquarters and rear legs replace the front chest and forepaws.
    poly(
        d,
        [(8, 11), (11, 10), (13, 10), (16, 11), (18, 14), (17, 19), (15, 21), (9, 21), (7, 19), (6, 14)],
        FUR["base"],
    )
    rect(d, (7, 13, 9, 18), FUR["shadow"])
    rect(d, (15, 13, 17, 18), FUR["highlight"])
    poly(d, [(8, 17), (16, 17), (15, 21), (9, 21)], FUR["shadow"])
    poly(d, [(7, 15), (10, 15), (10, 21), (7, 21)], FUR["base"])
    poly(d, [(14, 15), (17, 15), (17, 21), (14, 21)], FUR["base"])
    rect(d, (10, 17, 10, 20), OUTLINE)
    rect(d, (14, 17, 14, 20), OUTLINE)
    rect(d, (7, 20, 10, 21), OUTLINE)
    rect(d, (14, 20, 17, 21), OUTLINE)
    rect(d, (8, 20, 8, 20), BEAK)
    rect(d, (16, 20, 16, 20), BEAK)

    # A small curled tail separates from the right wing and hind leg.
    poly(d, [(16, 15), (19, 14), (21, 15), (21, 18), (19, 19), (18, 18), (20, 17), (19, 16), (17, 17)], FUR["shadow"])
    rect(d, (20, 16, 21, 17), FUR["highlight"])
    rect(d, (19, 18, 20, 18), OUTLINE)

    # Rear neck is a clean taper between lion body and eagle head.
    poly(
        d,
        [(10, 10), (14, 10), (15, 13), (14, 16), (12, 17), (10, 16), (9, 13)],
        FEATHER["base"],
    )
    rect(d, (10, 12, 11, 15), FEATHER["shadow"])
    rect(d, (13, 12, 14, 15), FEATHER["highlight"])
    rect(d, (11, 12, 13, 16), FEATHER["shadow"])

    # Back of the eagle head keeps the crest but no eyes or hooked beak.
    poly(
        d,
        [(9, 6), (10, 4), (11, 3), (12, 2), (13, 3), (15, 4), (16, 6), (16, 9), (14, 12), (10, 12), (8, 9), (8, 7)],
        FEATHER["base"],
    )
    poly(d, [(9, 6), (11, 4), (13, 4), (15, 6), (14, 7), (10, 7)], FEATHER["shadow"])
    poly(d, [(8, 8), (10, 7), (14, 7), (16, 8), (15, 10), (9, 10)], FEATHER["shadow"])
    rect(d, (10, 8, 14, 11), FEATHER["base"])
    rect(d, (11, 8, 13, 10), FEATHER["highlight"])
    poly(d, [(9, 9), (7, 10), (9, 12), (11, 11)], FEATHER["shadow"])
    poly(d, [(15, 9), (17, 10), (15, 12), (13, 11)], FEATHER["shadow"])

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"sun-crown-griffin-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("fur", FUR),
                ("feather", FEATHER),
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
    right = profile.logical_source()
    sources = {
        "down": base.logical_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "right": right,
        "up": up_source(),
    }
    frames: list[Image.Image] = []
    facts: list[dict[str, object]] = []
    for direction in DIRECTIONS:
        frame, frame_facts = treat_direction(direction, sources[direction])
        frames.append(frame)
        facts.append(frame_facts)

    approved_down = Image.open(ROOT / "sun-crown-griffin-style-v4.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Sun-Crown Griffin v4.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "sun-crown-griffin-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "sun-crown-griffin-directions-v1-manifest.json").write_text(
        json.dumps(
            {
                "file": sheet_path.name,
                "width": sheet.width,
                "height": sheet.height,
                "cell": OUTPUT_SIZE,
                "directionOrder": list(DIRECTIONS),
                "hardAlpha": True,
                "downMatchesApprovedV4": True,
                "sidePoseSource": "profile-readability-v3 geometry",
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
