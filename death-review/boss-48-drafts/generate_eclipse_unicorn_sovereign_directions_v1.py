from __future__ import annotations

import json

from PIL import Image, ImageDraw

import generate_eclipse_unicorn_sovereign_style_v1 as base


LOGICAL_SIZE = base.LOGICAL_SIZE
OUTPUT_SIZE = base.OUTPUT_SIZE
DIRECTIONS = ("down", "left", "right", "up")
ROOT = base.ROOT
RUNTIME_ROOT = ROOT.parents[1] / "engine" / "assets" / "bosses"
SLUG = base.SLUG
OUTLINE = base.OUTLINE
COAT = base.COAT
MANE = base.MANE
HORN = base.HORN
ARMOR = base.ARMOR
ARCANE = base.ARCANE


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Long flowing tail and neck mane establish an elegant horse silhouette.
    poly(draw, [(18, 10), (21, 9), (20, 12), (21, 15), (19, 18), (17, 16), (18, 13)], MANE["shadow"])
    poly(draw, [(19, 10), (21, 10), (20, 13), (21, 15), (19, 17), (18, 15)], MANE["base"])
    rect(draw, (19, 11, 20, 12), MANE["highlight"])
    poly(draw, [(8, 5), (11, 6), (11, 11), (9, 15), (7, 13), (8, 9)], MANE["shadow"])
    rect(draw, (9, 7, 10, 11), MANE["base"])
    rect(draw, (9, 8, 9, 10), MANE["highlight"])

    # High shoulders, long barrel, clean belly, and rounded rump.
    poly(draw, [(7, 9), (10, 7), (16, 7), (20, 10), (20, 15), (18, 17), (8, 17), (6, 15), (6, 11)], COAT["base"])
    poly(draw, [(9, 9), (11, 7), (16, 8), (19, 10), (18, 11), (8, 11)], COAT["highlight"])
    rect(draw, (8, 15, 18, 17), COAT["shadow"])

    # Crescent barding lies over the ribs without breaking the belly line.
    poly(draw, [(11, 8), (18, 9), (19, 14), (17, 17), (11, 16), (9, 12)], ARMOR["shadow"])
    poly(draw, [(12, 9), (17, 9), (18, 13), (16, 15), (11, 14), (10, 12)], ARMOR["base"])
    rect(draw, (12, 9, 17, 9), ARMOR["highlight"])
    poly(draw, [(13, 11), (15, 10), (17, 12), (16, 14), (14, 14), (13, 13)], HORN["base"])
    rect(draw, (15, 11, 15, 12), ARCANE["highlight"])
    rect(draw, (14, 12, 16, 13), ARCANE["base"])

    # Four legs occupy distinct horizontal positions. Far legs are shorter
    # and darker; near legs reach the common hoof line.
    rect(draw, (10, 15, 11, 20), COAT["shadow"])
    rect(draw, (19, 15, 20, 20), COAT["shadow"])
    rect(draw, (7, 14, 8, 21), COAT["base"])
    rect(draw, (16, 14, 17, 21), COAT["base"])
    rect(draw, (9, 19, 11, 21), OUTLINE)
    rect(draw, (19, 19, 20, 21), OUTLINE)
    rect(draw, (6, 20, 8, 21), OUTLINE)
    rect(draw, (15, 20, 17, 21), OUTLINE)
    rect(draw, (7, 17, 7, 19), COAT["highlight"])
    rect(draw, (16, 17, 16, 19), COAT["highlight"])

    # Arched neck and compact horse head keep the profile distinct from Rhino.
    poly(draw, [(7, 4), (10, 5), (11, 9), (9, 14), (7, 15), (5, 12), (5, 7)], COAT["base"])
    poly(draw, [(7, 4), (8, 3), (10, 5), (9, 8), (7, 8)], COAT["highlight"])
    poly(draw, [(5, 5), (3, 4), (4, 8), (6, 8)], COAT["shadow"])
    poly(draw, [(9, 4), (11, 3), (10, 7), (8, 7)], COAT["shadow"])
    poly(draw, [(3, 6), (7, 5), (9, 7), (8, 10), (4, 11), (2, 9)], COAT["base"])
    rect(draw, (4, 6, 7, 7), COAT["highlight"])
    poly(draw, [(4, 7), (6, 7), (6, 9), (4, 9)], OUTLINE)
    rect(draw, (5, 8, 5, 8), ARCANE["highlight"])
    rect(draw, (2, 9, 5, 10), COAT["shadow"])
    rect(draw, (2, 10, 3, 10), OUTLINE)

    # Long striped horn projects ahead of the forehead.
    poly(draw, [(4, 6), (2, 2), (6, 5), (6, 7)], HORN["shadow"])
    poly(draw, [(4, 5), (2, 2), (5, 5)], HORN["base"])
    rect(draw, (2, 2, 2, 3), HORN["highlight"])
    rect(draw, (3, 4, 4, 4), ARMOR["highlight"])
    rect(draw, (5, 5, 5, 5), ARCANE["base"])

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Rear mane and tail remain flowing but contain no facial marks.
    poly(draw, [(8, 5), (6, 7), (7, 10), (6, 13), (8, 16), (10, 14), (10, 7)], MANE["shadow"])
    rect(draw, (7, 8, 8, 12), MANE["base"])
    rect(draw, (7, 9, 7, 11), MANE["highlight"])
    poly(draw, [(17, 14), (20, 15), (21, 18), (19, 20), (17, 19), (18, 17), (16, 16)], MANE["base"])
    rect(draw, (19, 16, 20, 17), MANE["highlight"])

    # Broad rump and four rear-facing hoof columns.
    poly(draw, [(6, 9), (9, 7), (16, 7), (19, 10), (19, 15), (17, 16), (7, 16), (5, 15), (5, 11)], COAT["base"])
    poly(draw, [(8, 9), (11, 7), (16, 8), (18, 11), (7, 11)], COAT["highlight"])
    rect(draw, (7, 14, 17, 16), COAT["shadow"])
    rect(draw, (4, 16, 6, 20), COAT["shadow"])
    rect(draw, (18, 16, 20, 20), COAT["shadow"])
    rect(draw, (8, 16, 10, 21), COAT["base"])
    rect(draw, (14, 16, 16, 21), COAT["base"])
    rect(draw, (4, 19, 6, 21), OUTLINE)
    rect(draw, (8, 20, 10, 21), OUTLINE)
    rect(draw, (14, 20, 16, 21), OUTLINE)
    rect(draw, (18, 19, 20, 21), OUTLINE)
    rect(draw, (5, 18, 5, 19), COAT["highlight"])
    rect(draw, (9, 18, 9, 19), COAT["highlight"])
    rect(draw, (15, 18, 15, 19), COAT["highlight"])
    rect(draw, (19, 18, 19, 19), COAT["highlight"])

    # Rear barding reverses the crescent and centers the eclipse gem.
    poly(draw, [(7, 10), (10, 8), (17, 10), (18, 14), (16, 16), (8, 16), (6, 14)], ARMOR["shadow"])
    poly(draw, [(9, 10), (12, 9), (16, 10), (16, 15), (9, 15)], ARMOR["base"])
    rect(draw, (10, 10, 15, 10), ARMOR["highlight"])
    poly(draw, [(10, 13), (12, 11), (15, 13), (14, 16), (11, 16)], HORN["base"])
    rect(draw, (12, 13, 13, 15), ARCANE["base"])
    rect(draw, (13, 13, 13, 13), ARCANE["highlight"])

    # Back of the long neck and head: ears, horn ridge, no eyes or nostrils.
    poly(draw, [(8, 5), (10, 3), (14, 3), (16, 5), (17, 9), (15, 13), (9, 13), (7, 9)], COAT["base"])
    poly(draw, [(9, 5), (6, 3), (7, 7), (9, 8)], COAT["shadow"])
    poly(draw, [(15, 5), (18, 3), (17, 8), (15, 8)], COAT["shadow"])
    rect(draw, (10, 4, 14, 8), COAT["highlight"])
    rect(draw, (9, 9, 15, 12), COAT["shadow"])
    rect(draw, (11, 8, 13, 12), COAT["base"])
    poly(draw, [(10, 5), (12, 2), (14, 5), (13, 8), (11, 8)], HORN["shadow"])
    poly(draw, [(11, 5), (12, 2), (13, 6), (12, 7)], HORN["base"])
    rect(draw, (12, 2, 12, 3), HORN["highlight"])
    rect(draw, (11, 5, 12, 5), ARMOR["highlight"])
    rect(draw, (12, 7, 13, 7), ARCANE["base"])

    # Reassert near legs above the rump armor.
    rect(draw, (8, 16, 10, 21), COAT["base"])
    rect(draw, (14, 16, 16, 21), COAT["base"])
    rect(draw, (8, 20, 10, 21), OUTLINE)
    rect(draw, (14, 20, 16, 21), OUTLINE)
    rect(draw, (9, 18, 9, 19), COAT["highlight"])
    rect(draw, (15, 18, 15, 19), COAT["highlight"])

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"{SLUG}-directions-v1-{direction}"
    logical = base.treat(source, prefix)
    frame = logical.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.NEAREST)
    bounds = base.validate(frame, direction)
    colors = {pixel for pixel in frame.get_flattened_data() if pixel[3] == 255}
    filename = f"{prefix}.png"
    frame.save(ROOT / filename, optimize=False)
    RUNTIME_ROOT.mkdir(parents=True, exist_ok=True)
    frame.save(RUNTIME_ROOT / filename, optimize=False)
    return frame, {
        "direction": direction,
        "file": filename,
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

    candidate_down = Image.open(ROOT / f"{SLUG}-style-v1.png").convert("RGBA")
    if frames[0].tobytes() != candidate_down.tobytes():
        raise ValueError(f"Down direction drifted from the {base.DISPLAY_NAME} v1 candidate.")

    sheet = Image.new(
        "RGBA",
        (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)),
        (0, 0, 0, 0),
    )
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_filename = f"{SLUG}-directions-v1.png"
    sheet_path = ROOT / sheet_filename
    sheet.save(sheet_path, optimize=False)
    sheet.save(RUNTIME_ROOT / sheet_filename, optimize=False)

    (ROOT / f"{SLUG}-directions-v1-manifest.json").write_text(
        json.dumps(
            {
                "file": sheet_path.name,
                "width": sheet.width,
                "height": sheet.height,
                "cell": OUTPUT_SIZE,
                "directionOrder": list(DIRECTIONS),
                "hardAlpha": True,
                "reviewStatus": "candidate",
                "downMatchesCandidateV1": True,
                "sideMirroring": "Right is the exact horizontal mirror of Left.",
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
