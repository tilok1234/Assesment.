from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_cyclops_forge_titan_style_v2 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
SKIN = base.SKIN
METAL = base.METAL
ROYAL = base.ROYAL
WOOD = base.WOOD
EMBER = base.EMBER


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The hammer trails behind the profile as one uninterrupted rear silhouette.
    rect(d, (17, 7, 18, 21), WOOD["shadow"])
    rect(d, (18, 8, 19, 20), WOOD["base"])
    poly(d, [(15, 4), (17, 2), (21, 3), (21, 7), (19, 9), (15, 8), (14, 6)], ROYAL["base"])
    rect(d, (16, 3, 21, 4), METAL["base"])
    rect(d, (15, 6, 21, 8), ROYAL["shadow"])
    rect(d, (16, 5, 19, 5), METAL["shadow"])

    # A narrow but still massive plated body carries the giant profile.
    poly(
        d,
        [(8, 8), (14, 8), (17, 11), (18, 16), (17, 20), (15, 21), (7, 21), (5, 19), (5, 12)],
        ROYAL["base"],
    )
    rect(d, (6, 12, 8, 19), ROYAL["highlight"])
    rect(d, (15, 11, 17, 19), ROYAL["shadow"])
    rect(d, (7, 19, 10, 21), ROYAL["shadow"])
    rect(d, (12, 19, 16, 21), ROYAL["shadow"])
    rect(d, (6, 20, 10, 21), METAL["shadow"])
    rect(d, (12, 20, 16, 21), METAL["shadow"])

    # The far arm grips the hammer; the leading fist projects left and low.
    poly(d, [(13, 10), (16, 11), (17, 15), (15, 17), (13, 15)], SKIN["shadow"])
    rect(d, (15, 13, 18, 16), SKIN["base"])
    rect(d, (16, 14, 18, 15), SKIN["highlight"])
    poly(d, [(8, 11), (6, 12), (4, 15), (3, 18), (5, 20), (8, 18), (10, 14)], SKIN["base"])
    rect(d, (4, 15, 6, 18), SKIN["highlight"])
    rect(d, (3, 18, 7, 20), SKIN["shadow"])
    rect(d, (4, 18, 5, 19), SKIN["base"])
    rect(d, (6, 17, 8, 18), METAL["shadow"])

    # Side armor compresses the furnace into one narrow, readable ember slit.
    poly(d, [(8, 10), (14, 10), (16, 13), (16, 19), (7, 19), (6, 14)], METAL["base"])
    rect(d, (8, 11, 14, 12), METAL["highlight"])
    rect(d, (7, 16, 15, 19), METAL["shadow"])
    rect(d, (9, 13, 14, 18), ROYAL["shadow"])
    rect(d, (9, 14, 10, 17), EMBER["shadow"])
    rect(d, (9, 15, 10, 16), EMBER["base"])
    rect(d, (10, 13, 14, 13), OUTLINE)
    rect(d, (10, 18, 14, 18), OUTLINE)

    # One leading eye, projecting brow, nose, and jaw make facing explicit.
    poly(d, [(7, 5), (9, 3), (13, 3), (15, 5), (15, 10), (13, 13), (8, 13), (6, 10), (6, 7)], SKIN["base"])
    rect(d, (8, 4, 13, 5), SKIN["highlight"])
    rect(d, (11, 9, 14, 11), SKIN["shadow"])
    poly(d, [(6, 7), (4, 8), (6, 10), (9, 10), (9, 7)], METAL["highlight"])
    rect(d, (5, 7, 8, 9), "#f4f4f4")
    rect(d, (5, 7, 7, 9), EMBER["highlight"])
    rect(d, (5, 8, 5, 9), OUTLINE)
    rect(d, (5, 10, 9, 10), OUTLINE)
    rect(d, (7, 11, 11, 11), OUTLINE)
    rect(d, (8, 12, 10, 12), SKIN["highlight"])
    rect(d, (7, 4, 14, 4), ROYAL["shadow"])

    # Shoulder plates and sparse rivets retain the forge-built construction.
    rect(d, (7, 9, 9, 12), METAL["shadow"])
    rect(d, (13, 9, 15, 12), METAL["shadow"])
    rect(d, (7, 9, 9, 9), METAL["highlight"])
    rect(d, (13, 9, 15, 9), METAL["highlight"])
    rect(d, (7, 12, 7, 12), EMBER["base"])
    rect(d, (14, 12, 14, 12), EMBER["base"])
    rect(d, (7, 19, 7, 20), OUTLINE)
    rect(d, (9, 19, 9, 20), OUTLINE)
    rect(d, (13, 19, 13, 20), OUTLINE)
    rect(d, (15, 19, 15, 20), OUTLINE)

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Turning away swaps the hammer to the opposite screen side.
    rect(d, (18, 7, 19, 21), WOOD["shadow"])
    rect(d, (17, 8, 18, 20), WOOD["base"])
    poly(d, [(14, 4), (16, 2), (21, 3), (21, 7), (19, 9), (14, 8), (13, 6)], ROYAL["base"])
    rect(d, (15, 3, 20, 4), METAL["base"])
    rect(d, (14, 6, 21, 8), ROYAL["shadow"])
    rect(d, (16, 5, 19, 5), METAL["shadow"])

    # Rear armor and planted feet remain broad, tall, and weight-bearing.
    poly(
        d,
        [(7, 8), (16, 8), (19, 11), (20, 16), (19, 20), (16, 21), (7, 21), (4, 19), (4, 12)],
        ROYAL["base"],
    )
    rect(d, (5, 12, 7, 19), ROYAL["shadow"])
    rect(d, (17, 12, 19, 19), ROYAL["shadow"])
    rect(d, (7, 19, 10, 21), ROYAL["shadow"])
    rect(d, (13, 19, 17, 21), ROYAL["shadow"])
    rect(d, (6, 20, 10, 21), METAL["shadow"])
    rect(d, (13, 20, 17, 21), METAL["shadow"])

    # Both arms turn away; the hammer-side hand closes around the rear handle.
    poly(d, [(7, 10), (4, 12), (3, 16), (4, 19), (7, 18), (8, 13)], SKIN["base"])
    rect(d, (3, 14, 5, 18), SKIN["shadow"])
    rect(d, (4, 12, 6, 14), SKIN["highlight"])
    rect(d, (4, 17, 7, 19), METAL["shadow"])
    poly(d, [(16, 10), (19, 11), (20, 15), (19, 18), (16, 17), (15, 13)], SKIN["base"])
    rect(d, (18, 12, 20, 15), SKIN["highlight"])
    rect(d, (17, 16, 20, 19), SKIN["shadow"])
    rect(d, (18, 17, 19, 18), SKIN["base"])
    rect(d, (16, 15, 19, 16), METAL["shadow"])

    # The rear plate has a central spine and straps, never the front furnace.
    poly(d, [(7, 10), (16, 10), (18, 14), (17, 19), (6, 19), (5, 14)], METAL["base"])
    rect(d, (7, 11, 16, 12), METAL["highlight"])
    rect(d, (6, 16, 17, 19), METAL["shadow"])
    rect(d, (9, 12, 14, 18), ROYAL["shadow"])
    rect(d, (11, 11, 12, 18), ROYAL["highlight"])
    rect(d, (8, 13, 15, 13), OUTLINE)
    rect(d, (8, 18, 15, 18), OUTLINE)
    rect(d, (8, 14, 9, 17), WOOD["shadow"])
    rect(d, (14, 14, 15, 17), WOOD["shadow"])

    # Back of the bald head: no eye, pupil, mouth, or front brow opening.
    poly(d, [(8, 5), (10, 3), (15, 3), (17, 5), (17, 10), (15, 13), (9, 13), (7, 10), (7, 7)], SKIN["base"])
    rect(d, (9, 4, 15, 5), SKIN["highlight"])
    rect(d, (8, 9, 16, 12), SKIN["shadow"])
    rect(d, (10, 6, 14, 10), ROYAL["shadow"])
    rect(d, (11, 6, 13, 9), ROYAL["base"])
    rect(d, (8, 4, 16, 4), ROYAL["shadow"])

    # Rear shoulder caps and rivets replace the front eye/core focal stack.
    rect(d, (7, 9, 9, 12), METAL["shadow"])
    rect(d, (15, 9, 17, 12), METAL["shadow"])
    rect(d, (7, 9, 9, 9), METAL["highlight"])
    rect(d, (15, 9, 17, 9), METAL["highlight"])
    rect(d, (7, 12, 7, 12), EMBER["shadow"])
    rect(d, (17, 12, 17, 12), EMBER["shadow"])
    rect(d, (7, 19, 7, 20), OUTLINE)
    rect(d, (9, 19, 9, 20), OUTLINE)
    rect(d, (14, 19, 14, 20), OUTLINE)
    rect(d, (16, 19, 16, 20), OUTLINE)

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"cyclops-forge-titan-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("skin", SKIN),
                ("metal", METAL),
                ("royal", ROYAL),
                ("wood", WOOD),
                ("ember", EMBER),
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

    approved_down = Image.open(ROOT / "cyclops-forge-titan-style-v2.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Cyclops Forge-Titan v2.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "cyclops-forge-titan-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "cyclops-forge-titan-directions-v1-manifest.json").write_text(
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
