from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw

import generate_cruel_catgirl_templar_style_v1 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
SLUG = base.SLUG
OUTLINE = base.OUTLINE
FUR = base.FUR
STEEL = base.STEEL
IVORY = base.IVORY
CRIMSON = base.CRIMSON
WOOD = base.WOOD


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source(include_hammer: bool = True) -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The curling tail trails the turn without colliding with the face.
    poly(d, [(14, 16), (18, 15), (21, 17), (20, 20), (17, 21), (16, 19), (19, 19), (19, 17), (16, 18), (13, 18)], FUR["shadow"])
    rect(d, (19, 17, 20, 18), FUR["base"])
    rect(d, (17, 19, 18, 20), FUR["base"])
    rect(d, (20, 16, 21, 17), STEEL["highlight"])

    poly(d, [(7, 10), (14, 10), (17, 13), (17, 20), (14, 21), (6, 21), (4, 19), (4, 13)], CRIMSON["shadow"])
    rect(d, (5, 13, 7, 19), CRIMSON["base"])
    rect(d, (14, 13, 16, 19), CRIMSON["base"])
    rect(d, (6, 18, 9, 21), STEEL["shadow"])
    rect(d, (11, 18, 14, 21), STEEL["shadow"])
    rect(d, (5, 20, 9, 21), OUTLINE)
    rect(d, (11, 20, 15, 21), OUTLINE)

    poly(d, [(7, 10), (14, 10), (16, 13), (15, 18), (5, 18), (4, 13)], STEEL["base"])
    rect(d, (7, 11, 14, 12), STEEL["highlight"])
    rect(d, (5, 16, 15, 18), STEEL["shadow"])
    poly(d, [(4, 10), (7, 9), (9, 11), (7, 14), (3, 13)], STEEL["shadow"])
    poly(d, [(12, 11), (14, 9), (17, 10), (18, 13), (14, 14)], STEEL["shadow"])
    rect(d, (4, 11, 7, 12), STEEL["base"])
    rect(d, (14, 10, 16, 12), STEEL["base"])
    poly(d, [(3, 10), (2, 11), (3, 12)], CRIMSON["highlight"])

    poly(d, [(8, 12), (12, 12), (13, 20), (10, 19), (8, 20), (7, 16)], IVORY["base"])
    rect(d, (8, 13, 11, 14), IVORY["highlight"])
    rect(d, (8, 18, 12, 20), IVORY["shadow"])
    rect(d, (9, 14, 10, 18), CRIMSON["base"])
    rect(d, (8, 15, 12, 16), CRIMSON["base"])

    # Pointed muzzle, one slit eye, two ears, and a fang create a true profile.
    poly(d, [(7, 6), (8, 3), (10, 5), (13, 5), (15, 7), (15, 11), (13, 13), (8, 13), (5, 11), (5, 8)], FUR["base"])
    poly(d, [(7, 6), (8, 2), (11, 5)], FUR["base"])
    poly(d, [(11, 5), (14, 3), (15, 7)], FUR["base"])
    poly(d, [(8, 5), (8, 3), (10, 5)], CRIMSON["shadow"])
    rect(d, (7, 5, 14, 7), STEEL["base"])
    rect(d, (8, 5, 13, 5), STEEL["highlight"])
    rect(d, (7, 7, 14, 8), STEEL["shadow"])
    poly(d, [(5, 8), (3, 9), (5, 10)], FUR["highlight"])
    rect(d, (6, 9, 9, 9), CRIMSON["highlight"])
    rect(d, (7, 9, 7, 10), OUTLINE)
    rect(d, (4, 11, 9, 11), OUTLINE)
    rect(d, (7, 12, 7, 13), IVORY["highlight"])
    rect(d, (13, 9, 15, 11), FUR["shadow"])

    rect(d, (5, 14, 6, 16), OUTLINE)
    rect(d, (14, 14, 15, 16), OUTLINE)
    rect(d, (7, 18, 7, 19), OUTLINE)
    rect(d, (13, 18, 13, 19), OUTLINE)
    if include_hammer:
        image.alpha_composite(base.held_hammer_layer("left"))
    return image


def up_source(include_hammer: bool = True) -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The 180-degree turn swaps the tail to the opposite side.
    poly(d, [(16, 16), (19, 15), (21, 17), (21, 20), (18, 21), (17, 19), (20, 19), (20, 17), (18, 18), (15, 18)], FUR["shadow"])
    rect(d, (20, 17, 21, 18), FUR["base"])
    rect(d, (18, 19, 19, 20), FUR["base"])
    rect(d, (20, 16, 21, 17), STEEL["highlight"])

    poly(d, [(7, 10), (16, 10), (19, 13), (18, 20), (16, 21), (7, 21), (5, 19), (4, 13)], CRIMSON["shadow"])
    rect(d, (5, 13, 7, 19), CRIMSON["base"])
    rect(d, (16, 13, 18, 19), CRIMSON["base"])
    rect(d, (7, 18, 10, 21), STEEL["shadow"])
    rect(d, (13, 18, 16, 21), STEEL["shadow"])
    rect(d, (6, 20, 10, 21), OUTLINE)
    rect(d, (13, 20, 17, 21), OUTLINE)

    poly(d, [(7, 10), (16, 10), (18, 13), (17, 18), (6, 18), (5, 13)], STEEL["base"])
    rect(d, (7, 11, 16, 12), STEEL["highlight"])
    rect(d, (6, 16, 17, 18), STEEL["shadow"])
    poly(d, [(5, 10), (8, 9), (10, 11), (8, 14), (4, 13)], STEEL["shadow"])
    poly(d, [(14, 11), (16, 9), (19, 10), (20, 13), (16, 14)], STEEL["shadow"])
    rect(d, (5, 11, 8, 12), STEEL["base"])
    rect(d, (16, 10, 18, 12), STEEL["base"])
    poly(d, [(4, 10), (3, 11), (4, 12)], CRIMSON["highlight"])
    poly(d, [(19, 10), (20, 11), (19, 12)], CRIMSON["highlight"])

    # Rear plate carries a crimson templar cross instead of the front tabard.
    rect(d, (9, 12, 14, 18), STEEL["shadow"])
    rect(d, (11, 12, 12, 18), CRIMSON["base"])
    rect(d, (9, 14, 14, 15), CRIMSON["base"])
    rect(d, (12, 14, 14, 14), CRIMSON["highlight"])
    rect(d, (9, 17, 14, 18), OUTLINE)

    # Rear helmet and ears contain no face pixels.
    poly(d, [(7, 6), (8, 3), (10, 5), (14, 5), (16, 3), (17, 7), (16, 11), (14, 13), (9, 13), (7, 11)], FUR["shadow"])
    poly(d, [(7, 6), (8, 2), (11, 5)], FUR["base"])
    poly(d, [(13, 5), (16, 2), (17, 7)], FUR["base"])
    poly(d, [(8, 5), (8, 3), (10, 5)], CRIMSON["shadow"])
    poly(d, [(14, 5), (16, 3), (16, 6)], CRIMSON["shadow"])
    rect(d, (8, 5, 16, 8), STEEL["shadow"])
    rect(d, (9, 5, 15, 6), STEEL["base"])
    rect(d, (10, 7, 14, 11), STEEL["base"])
    rect(d, (11, 7, 13, 10), STEEL["highlight"])
    rect(d, (9, 11, 15, 12), FUR["shadow"])

    rect(d, (6, 14, 7, 16), OUTLINE)
    rect(d, (16, 14, 17, 16), OUTLINE)
    rect(d, (8, 18, 8, 19), OUTLINE)
    rect(d, (15, 18, 15, 19), OUTLINE)
    if include_hammer:
        image.alpha_composite(base.held_hammer_layer("up"))
    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"{SLUG}-directions-v1-{direction}"
    logical = base.treat(source, prefix)
    frame = logical.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.NEAREST)
    bounds = base.validate(frame, direction)
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

    approved_down = Image.open(ROOT / f"{SLUG}-style-v1.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from the approved Cruel Catgirl Templar v1 design.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / f"{SLUG}-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / f"{SLUG}-directions-v1-manifest.json").write_text(
        json.dumps(
            {
                "file": sheet_path.name,
                "width": sheet.width,
                "height": sheet.height,
                "cell": OUTPUT_SIZE,
                "directionOrder": list(DIRECTIONS),
                "hardAlpha": True,
                "reviewStatus": "approved",
                "downMatchesApprovedV1": True,
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
