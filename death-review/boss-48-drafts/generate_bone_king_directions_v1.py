from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_bone_king_style_v2 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
RED = base.RED
BONE = base.BONE
METAL = base.METAL
GOLD = base.GOLD
WOOD = base.WOOD
CLOTH = base.CLOTH


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Ceremonial axe rotates behind the trailing shoulder.
    rect(d, (17, 7, 18, 21), WOOD["shadow"])
    rect(d, (17, 8, 17, 20), WOOD["base"])
    poly(d, [(16, 5), (18, 3), (21, 4), (21, 7), (19, 9), (16, 8)], METAL["base"])
    rect(d, (17, 5, 19, 6), METAL["highlight"])
    rect(d, (19, 7, 21, 8), METAL["shadow"])

    # Narrow profile cloak and robe mass.
    poly(d, [(8, 8), (15, 8), (18, 12), (18, 20), (15, 21), (7, 21), (5, 19), (5, 12)], CLOTH["base"])
    rect(d, (6, 13, 8, 20), CLOTH["highlight"])
    rect(d, (15, 12, 17, 20), CLOTH["shadow"])
    rect(d, (7, 17, 10, 21), CLOTH["shadow"])
    rect(d, (6, 20, 11, 21), METAL["shadow"])
    rect(d, (7, 20, 7, 21), OUTLINE)
    rect(d, (9, 20, 9, 21), OUTLINE)

    # Lantern hangs on the leading side with only one narrow red window.
    rect(d, (4, 12, 5, 18), WOOD["base"])
    rect(d, (3, 15, 6, 20), GOLD["shadow"])
    rect(d, (4, 14, 5, 15), GOLD["highlight"])
    rect(d, (4, 16, 5, 18), RED)
    rect(d, (3, 19, 6, 20), WOOD["shadow"])

    # Side armor and ribs compress into a narrow layered torso.
    poly(d, [(7, 10), (14, 10), (16, 15), (14, 19), (7, 19), (5, 15)], METAL["base"])
    rect(d, (7, 11, 14, 12), METAL["highlight"])
    rect(d, (6, 16, 15, 18), METAL["shadow"])
    rect(d, (8, 11, 11, 18), BONE["base"])
    rect(d, (8, 12, 10, 13), BONE["highlight"])
    rect(d, (8, 14, 11, 14), OUTLINE)
    rect(d, (8, 17, 11, 17), OUTLINE)
    rect(d, (10, 11, 10, 18), OUTLINE)
    rect(d, (8, 15, 9, 16), BONE["shadow"])
    rect(d, (9, 18, 11, 19), GOLD["shadow"])
    rect(d, (10, 18, 10, 18), RED)

    # Skull turns left: one eye socket, projecting nose, narrow jaw.
    poly(d, [(7, 4), (9, 3), (13, 3), (15, 5), (15, 9), (13, 12), (7, 12), (5, 9), (5, 6)], BONE["base"])
    rect(d, (6, 4, 11, 5), BONE["highlight"])
    rect(d, (12, 5, 14, 10), BONE["shadow"])
    poly(d, [(5, 7), (3, 8), (5, 10), (8, 10), (8, 7)], BONE["base"])
    rect(d, (5, 6, 7, 7), OUTLINE)
    rect(d, (6, 6, 6, 6), RED)
    rect(d, (4, 8, 4, 8), OUTLINE)
    rect(d, (4, 10, 11, 10), OUTLINE)
    rect(d, (6, 10, 6, 11), BONE["highlight"])
    rect(d, (8, 10, 8, 11), BONE["highlight"])

    # The three-prong crown becomes a staggered side silhouette.
    rect(d, (7, 3, 15, 4), GOLD["base"])
    rect(d, (8, 2, 9, 4), GOLD["highlight"])
    rect(d, (11, 3, 12, 4), RED)
    rect(d, (14, 2, 15, 4), GOLD["highlight"])
    rect(d, (7, 4, 15, 4), GOLD["shadow"])

    # Leading hand grips the lantern; trailing hand recedes near the axe.
    rect(d, (5, 12, 6, 16), OUTLINE)
    rect(d, (5, 14, 6, 16), BONE["base"])
    rect(d, (14, 12, 15, 16), OUTLINE)
    rect(d, (14, 14, 15, 16), BONE["shadow"])

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Axe and lantern remain visible at the sides, but the red front window closes.
    rect(d, (3, 7, 4, 21), WOOD["shadow"])
    rect(d, (4, 8, 4, 20), WOOD["base"])
    poly(d, [(2, 5), (4, 3), (7, 4), (7, 7), (5, 9), (2, 8)], METAL["base"])
    rect(d, (3, 5, 5, 6), METAL["highlight"])
    rect(d, (2, 7, 4, 8), METAL["shadow"])
    rect(d, (19, 12, 20, 19), WOOD["base"])
    rect(d, (18, 15, 21, 20), GOLD["shadow"])
    rect(d, (19, 14, 20, 15), GOLD["highlight"])
    rect(d, (19, 16, 20, 18), WOOD["shadow"])
    rect(d, (18, 19, 21, 20), WOOD["shadow"])

    # Rear cloak is the dominant plane; no ribs or breastplate remain.
    poly(d, [(7, 8), (16, 8), (20, 12), (20, 20), (17, 21), (6, 21), (4, 19), (4, 12)], CLOTH["base"])
    rect(d, (5, 13, 7, 20), CLOTH["shadow"])
    rect(d, (17, 13, 19, 20), CLOTH["shadow"])
    rect(d, (6, 10, 8, 12), CLOTH["highlight"])
    rect(d, (15, 10, 17, 12), CLOTH["highlight"])
    rect(d, (7, 16, 10, 21), CLOTH["shadow"])
    rect(d, (13, 16, 16, 21), CLOTH["shadow"])
    rect(d, (6, 20, 10, 21), METAL["shadow"])
    rect(d, (13, 20, 17, 21), METAL["shadow"])

    # A simple spine and rear shoulder armor replace the front rib cage.
    poly(d, [(7, 10), (16, 10), (18, 15), (16, 19), (7, 19), (5, 15)], METAL["base"])
    rect(d, (7, 11, 16, 12), METAL["highlight"])
    rect(d, (6, 16, 17, 18), METAL["shadow"])
    rect(d, (10, 11, 13, 18), BONE["shadow"])
    rect(d, (11, 11, 12, 18), BONE["base"])
    rect(d, (10, 13, 13, 13), OUTLINE)
    rect(d, (10, 16, 13, 16), OUTLINE)
    rect(d, (10, 18, 13, 19), GOLD["shadow"])

    # Back of skull: no eyes, nose, teeth, or jaw seam.
    poly(d, [(7, 4), (9, 3), (14, 3), (16, 5), (16, 9), (14, 12), (9, 12), (7, 9)], BONE["base"])
    rect(d, (8, 4, 14, 5), BONE["highlight"])
    rect(d, (8, 9, 15, 11), BONE["shadow"])
    rect(d, (10, 6, 13, 10), METAL["shadow"])
    rect(d, (11, 6, 12, 9), METAL["base"])

    # Crown back keeps all three prongs but hides the red jewel face.
    rect(d, (7, 3, 16, 4), GOLD["base"])
    rect(d, (8, 3, 9, 4), GOLD["highlight"])
    rect(d, (11, 2, 12, 4), GOLD["highlight"])
    rect(d, (14, 3, 15, 4), GOLD["highlight"])
    rect(d, (11, 3, 12, 4), GOLD["shadow"])
    rect(d, (7, 4, 16, 4), GOLD["shadow"])

    # Rear hands and feet maintain limb separation.
    rect(d, (5, 12, 6, 16), OUTLINE)
    rect(d, (17, 12, 18, 16), OUTLINE)
    rect(d, (5, 14, 6, 16), BONE["shadow"])
    rect(d, (17, 14, 18, 16), BONE["shadow"])
    rect(d, (7, 20, 7, 21), OUTLINE)
    rect(d, (9, 20, 9, 21), OUTLINE)
    rect(d, (14, 20, 14, 21), OUTLINE)
    rect(d, (16, 20, 16, 21), OUTLINE)

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"bone-reliquary-king-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("bone", BONE),
                ("metal", METAL),
                ("gold", GOLD),
                ("wood", WOOD),
                ("cloth", CLOTH),
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

    approved_down = Image.open(ROOT / "bone-reliquary-king-style-v2.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Bone Reliquary King v2.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "bone-reliquary-king-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "bone-reliquary-king-directions-v1-manifest.json").write_text(
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
