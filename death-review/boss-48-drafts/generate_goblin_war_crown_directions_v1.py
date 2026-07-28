from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_goblin_war_crown_style_v2 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
GOBLIN = base.GOBLIN
METAL = base.METAL
GOLD = base.GOLD
CRIMSON = base.CRIMSON
WOOD = base.WOOD


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The command banner trails behind the turned shoulder.
    rect(d, (18, 5, 19, 21), WOOD["shadow"])
    rect(d, (17, 6, 18, 20), WOOD["base"])
    poly(d, [(16, 5), (18, 2), (20, 5), (19, 6), (17, 6)], METAL["base"])
    rect(d, (17, 4, 18, 4), METAL["highlight"])
    poly(d, [(12, 6), (17, 6), (16, 9), (17, 12), (12, 11)], CRIMSON["base"])
    rect(d, (13, 7, 16, 8), CRIMSON["highlight"])
    poly(d, [(15, 9), (17, 9), (16, 11), (15, 10)], GOLD["base"])

    # A narrower plate-and-cloak mass keeps the commander stocky in profile.
    poly(d, [(8, 9), (14, 9), (17, 12), (18, 19), (15, 21), (6, 21), (4, 18), (5, 12)], CRIMSON["shadow"])
    rect(d, (5, 13, 7, 19), CRIMSON["base"])
    rect(d, (15, 12, 17, 19), CRIMSON["base"])
    rect(d, (7, 18, 10, 21), WOOD["shadow"])
    rect(d, (12, 18, 15, 21), WOOD["shadow"])
    rect(d, (6, 20, 10, 21), OUTLINE)
    rect(d, (12, 20, 16, 21), OUTLINE)

    # Side armor turns the broad breastplate and pauldrons into layered planes.
    poly(d, [(8, 10), (14, 10), (16, 14), (15, 19), (6, 19), (5, 14)], METAL["base"])
    rect(d, (8, 11, 14, 12), METAL["highlight"])
    rect(d, (6, 16, 15, 19), METAL["shadow"])
    rect(d, (5, 11, 8, 14), GOLD["shadow"])
    rect(d, (13, 11, 16, 14), GOLD["shadow"])
    rect(d, (6, 11, 8, 12), GOLD["base"])
    rect(d, (13, 11, 15, 12), GOLD["base"])
    rect(d, (8, 13, 14, 17), METAL["base"])
    rect(d, (9, 13, 13, 14), METAL["highlight"])
    rect(d, (8, 16, 14, 17), METAL["shadow"])
    rect(d, (10, 17, 12, 18), GOLD["shadow"])

    # A single aligned eye, leading ear, nose, and jaw establish the profile.
    poly(d, [(7, 6), (9, 4), (13, 4), (15, 6), (15, 11), (13, 13), (8, 13), (6, 11), (6, 7)], GOBLIN["base"])
    poly(d, [(7, 7), (3, 5), (3, 9), (7, 11)], GOBLIN["base"])
    rect(d, (3, 7, 4, 9), GOBLIN["highlight"])
    poly(d, [(13, 7), (16, 6), (16, 9), (14, 11)], GOBLIN["shadow"])
    rect(d, (10, 10, 14, 12), GOBLIN["shadow"])
    rect(d, (6, 7, 9, 8), METAL["highlight"])
    rect(d, (7, 7, 7, 8), OUTLINE)
    rect(d, (5, 9, 8, 10), GOBLIN["highlight"])
    rect(d, (5, 11, 10, 11), OUTLINE)
    rect(d, (7, 12, 8, 12), METAL["highlight"])

    # The three-prong crown compresses into a staggered side silhouette.
    rect(d, (7, 4, 15, 5), GOLD["base"])
    rect(d, (8, 3, 9, 5), GOLD["highlight"])
    rect(d, (11, 2, 12, 5), GOLD["highlight"])
    rect(d, (14, 3, 15, 5), GOLD["highlight"])
    rect(d, (11, 4, 12, 5), CRIMSON["base"])
    rect(d, (7, 5, 15, 5), GOLD["shadow"])

    # The royal shield leads and stays below the face.
    poly(d, [(2, 10), (6, 9), (8, 11), (8, 19), (6, 21), (3, 20), (2, 17)], CRIMSON["base"])
    rect(d, (3, 11, 4, 19), CRIMSON["highlight"])
    rect(d, (6, 11, 7, 19), CRIMSON["shadow"])
    rect(d, (3, 10, 7, 11), GOLD["shadow"])
    rect(d, (4, 14, 6, 17), GOLD["base"])
    rect(d, (5, 14, 5, 15), GOLD["highlight"])
    rect(d, (4, 17, 6, 18), GOLD["shadow"])

    rect(d, (6, 14, 7, 16), OUTLINE)
    rect(d, (14, 14, 15, 16), OUTLINE)
    rect(d, (8, 18, 8, 19), OUTLINE)
    rect(d, (10, 18, 10, 19), OUTLINE)
    rect(d, (13, 18, 13, 19), OUTLINE)
    rect(d, (15, 18, 15, 19), OUTLINE)

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # A 180-degree turn swaps the command banner to the opposite screen side.
    rect(d, (19, 5, 20, 21), WOOD["shadow"])
    rect(d, (18, 6, 19, 20), WOOD["base"])
    poly(d, [(17, 5), (19, 2), (21, 5), (20, 6), (18, 6)], METAL["base"])
    rect(d, (18, 4, 19, 4), METAL["highlight"])
    poly(d, [(13, 6), (18, 6), (17, 9), (18, 12), (13, 11)], CRIMSON["base"])
    rect(d, (14, 7, 17, 8), CRIMSON["highlight"])
    poly(d, [(16, 9), (18, 9), (17, 11), (16, 10)], GOLD["shadow"])

    # Rear cloak and boots preserve the broad commander stance.
    poly(d, [(7, 9), (16, 9), (19, 12), (20, 19), (17, 21), (6, 21), (4, 18), (5, 12)], CRIMSON["shadow"])
    rect(d, (5, 13, 7, 19), CRIMSON["base"])
    rect(d, (17, 13, 19, 19), CRIMSON["base"])
    rect(d, (7, 18, 10, 21), WOOD["shadow"])
    rect(d, (13, 18, 16, 21), WOOD["shadow"])
    rect(d, (6, 20, 10, 21), OUTLINE)
    rect(d, (13, 20, 17, 21), OUTLINE)

    # Rear plate replaces the front breastplate with a spine and cloak straps.
    poly(d, [(7, 10), (16, 10), (18, 14), (17, 19), (6, 19), (5, 14)], METAL["base"])
    rect(d, (7, 11, 16, 12), METAL["highlight"])
    rect(d, (6, 16, 17, 19), METAL["shadow"])
    rect(d, (5, 11, 8, 14), GOLD["shadow"])
    rect(d, (15, 11, 18, 14), GOLD["shadow"])
    rect(d, (6, 11, 8, 12), GOLD["base"])
    rect(d, (15, 11, 17, 12), GOLD["base"])
    rect(d, (9, 13, 14, 18), METAL["shadow"])
    rect(d, (11, 12, 12, 18), METAL["base"])
    rect(d, (8, 13, 15, 13), OUTLINE)
    rect(d, (8, 17, 15, 18), OUTLINE)
    rect(d, (8, 14, 9, 17), CRIMSON["shadow"])
    rect(d, (14, 14, 15, 17), CRIMSON["shadow"])

    # Back of the head keeps both ears but removes eyes, nose, mouth, and tooth.
    poly(d, [(7, 6), (9, 4), (15, 4), (17, 6), (17, 11), (15, 13), (9, 13), (7, 11)], GOBLIN["base"])
    poly(d, [(8, 7), (5, 5), (5, 9), (8, 11)], GOBLIN["base"])
    poly(d, [(16, 7), (19, 5), (19, 9), (16, 11)], GOBLIN["base"])
    rect(d, (5, 7, 6, 9), GOBLIN["shadow"])
    rect(d, (18, 7, 19, 9), GOBLIN["shadow"])
    rect(d, (8, 10, 16, 12), GOBLIN["shadow"])
    rect(d, (10, 6, 14, 10), METAL["shadow"])
    rect(d, (11, 6, 13, 9), METAL["base"])

    # Rear crown retains the three prongs but hides the front red jewel face.
    rect(d, (7, 4, 17, 5), GOLD["base"])
    rect(d, (8, 3, 9, 5), GOLD["highlight"])
    rect(d, (11, 2, 13, 5), GOLD["highlight"])
    rect(d, (15, 3, 16, 5), GOLD["highlight"])
    rect(d, (11, 4, 13, 5), GOLD["shadow"])
    rect(d, (7, 5, 17, 5), GOLD["shadow"])

    # The shield also swaps screen side and shows a dimmer rear face.
    poly(d, [(2, 11), (6, 10), (8, 12), (8, 19), (6, 21), (3, 20), (2, 18)], CRIMSON["shadow"])
    rect(d, (3, 12, 4, 19), CRIMSON["base"])
    rect(d, (6, 12, 7, 19), CRIMSON["shadow"])
    rect(d, (3, 11, 7, 12), GOLD["shadow"])
    rect(d, (4, 14, 6, 17), WOOD["shadow"])
    rect(d, (4, 17, 6, 18), GOLD["shadow"])

    rect(d, (6, 14, 7, 16), OUTLINE)
    rect(d, (16, 14, 17, 16), OUTLINE)
    rect(d, (9, 18, 9, 19), OUTLINE)
    rect(d, (11, 18, 11, 19), OUTLINE)
    rect(d, (14, 18, 14, 19), OUTLINE)
    rect(d, (16, 18, 16, 19), OUTLINE)

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"goblin-war-crown-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("goblin", GOBLIN),
                ("metal", METAL),
                ("gold", GOLD),
                ("crimson", CRIMSON),
                ("wood", WOOD),
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

    approved_down = Image.open(ROOT / "goblin-war-crown-style-v2.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Goblin War-Crown v2.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "goblin-war-crown-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "goblin-war-crown-directions-v1-manifest.json").write_text(
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
