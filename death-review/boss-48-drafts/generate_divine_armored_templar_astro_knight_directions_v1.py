from __future__ import annotations

import json

from PIL import Image, ImageDraw

import generate_divine_armored_templar_astro_knight_style_v1 as base


LOGICAL_SIZE = base.LOGICAL_SIZE
OUTPUT_SIZE = base.OUTPUT_SIZE
DIRECTIONS = ("down", "left", "right", "up")
ROOT = base.ROOT
SLUG = base.SLUG
OUTLINE = base.OUTLINE
CELESTIAL = base.CELESTIAL
GOLD = base.GOLD
COSMIC = base.COSMIC
RADIANCE = base.RADIANCE
VIOLET = base.VIOLET


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source(include_relics: bool = True) -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    base.draw_halo(d, "left")

    # The profile pushes the constellation cloak backward and the visor forward.
    poly(d, [(7, 9), (14, 9), (18, 12), (20, 19), (17, 21), (7, 21), (4, 19), (4, 13)], COSMIC["shadow"])
    poly(d, [(12, 10), (18, 13), (19, 19), (16, 21), (12, 18)], VIOLET["base"])
    rect(d, (17, 15, 17, 15), RADIANCE["base"])
    rect(d, (14, 19, 14, 19), GOLD["highlight"])
    rect(d, (6, 19, 9, 21), CELESTIAL["shadow"])
    rect(d, (11, 19, 14, 21), CELESTIAL["shadow"])
    rect(d, (5, 21, 9, 21), OUTLINE)
    rect(d, (11, 21, 15, 21), OUTLINE)

    poly(d, [(7, 10), (14, 10), (17, 13), (16, 19), (5, 19), (4, 13)], CELESTIAL["base"])
    rect(d, (7, 11, 14, 12), CELESTIAL["highlight"])
    rect(d, (5, 17, 16, 19), CELESTIAL["shadow"])
    poly(d, [(4, 10), (7, 9), (9, 11), (7, 15), (2, 14), (2, 12)], GOLD["shadow"])
    poly(d, [(12, 11), (14, 9), (17, 10), (19, 12), (18, 14), (14, 15)], GOLD["shadow"])
    rect(d, (3, 11, 7, 13), CELESTIAL["base"])
    rect(d, (14, 10, 17, 13), CELESTIAL["base"])
    rect(d, (3, 11, 6, 11), CELESTIAL["highlight"])
    poly(d, [(8, 13), (12, 13), (13, 21), (10, 20), (8, 21), (7, 17)], COSMIC["base"])
    rect(d, (9, 14, 11, 19), COSMIC["highlight"])
    rect(d, (9, 15, 10, 19), GOLD["base"])
    rect(d, (8, 16, 12, 17), GOLD["base"])
    rect(d, (9, 16, 10, 17), RADIANCE["highlight"])

    # The profile keeps the same dome, brow, narrow eye slit, cheek plate,
    # and chin guard as the front-facing sealed helmet.
    poly(d, [(8, 5), (9, 3), (11, 2), (13, 3), (15, 5), (15, 11), (13, 13), (7, 12), (4, 10), (5, 7)], GOLD["shadow"])
    poly(d, [(8, 5), (10, 4), (12, 3), (14, 5), (14, 7), (6, 7), (6, 6)], CELESTIAL["base"])
    rect(d, (9, 4, 12, 4), CELESTIAL["highlight"])
    rect(d, (11, 2, 12, 5), GOLD["base"])
    rect(d, (6, 6, 14, 7), GOLD["base"])
    poly(d, [(6, 8), (13, 8), (13, 11), (11, 12), (7, 11), (4, 10), (4, 9)], COSMIC["shadow"])
    rect(d, (5, 9, 10, 9), RADIANCE["base"])
    rect(d, (5, 9, 7, 9), RADIANCE["highlight"])
    rect(d, (7, 10, 8, 12), CELESTIAL["shadow"])
    rect(d, (12, 9, 13, 11), CELESTIAL["shadow"])
    rect(d, (8, 11, 11, 12), GOLD["base"])
    rect(d, (5, 14, 6, 17), OUTLINE)
    rect(d, (14, 14, 15, 17), OUTLINE)
    rect(d, (7, 19, 7, 20), OUTLINE)
    rect(d, (13, 19, 13, 20), OUTLINE)

    if include_relics:
        image.alpha_composite(base.held_relic_layer("left"))
    return image


def up_source(include_relics: bool = True) -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    base.draw_halo(d, "up")

    poly(d, [(7, 9), (16, 9), (20, 13), (19, 20), (16, 21), (7, 21), (4, 20), (4, 13)], COSMIC["shadow"])
    poly(d, [(5, 13), (9, 10), (11, 19), (7, 21), (5, 19)], VIOLET["shadow"])
    poly(d, [(15, 10), (19, 13), (18, 19), (15, 21), (13, 18)], VIOLET["base"])
    rect(d, (6, 17, 6, 17), RADIANCE["base"])
    rect(d, (17, 15, 17, 15), GOLD["highlight"])
    rect(d, (7, 19, 10, 21), CELESTIAL["shadow"])
    rect(d, (13, 19, 16, 21), CELESTIAL["shadow"])
    rect(d, (6, 21, 10, 21), OUTLINE)
    rect(d, (13, 21, 17, 21), OUTLINE)

    poly(d, [(7, 10), (16, 10), (19, 13), (17, 19), (6, 19), (4, 13)], CELESTIAL["shadow"])
    rect(d, (7, 11, 16, 12), CELESTIAL["base"])
    rect(d, (6, 17, 17, 19), OUTLINE)
    poly(d, [(5, 10), (8, 9), (10, 11), (8, 15), (3, 14), (3, 12)], GOLD["shadow"])
    poly(d, [(14, 11), (16, 9), (19, 10), (21, 12), (20, 14), (16, 15)], GOLD["shadow"])
    rect(d, (4, 11, 8, 13), CELESTIAL["base"])
    rect(d, (16, 10, 19, 13), CELESTIAL["base"])
    rect(d, (4, 11, 7, 11), CELESTIAL["highlight"])
    rect(d, (17, 10, 19, 10), CELESTIAL["highlight"])

    # Rear plate carries an eight-point astral seal instead of a front tabard.
    poly(d, [(8, 12), (15, 12), (16, 20), (12, 21), (8, 20)], COSMIC["base"])
    rect(d, (10, 13, 13, 19), COSMIC["highlight"])
    rect(d, (11, 13, 12, 20), GOLD["base"])
    rect(d, (9, 15, 14, 17), GOLD["base"])
    rect(d, (11, 14, 12, 19), RADIANCE["base"])
    rect(d, (10, 15, 13, 17), RADIANCE["base"])
    rect(d, (11, 16, 12, 16), RADIANCE["highlight"])

    # The rear helm keeps the plated dome and a raised gold orbit spine, but
    # deliberately contains no face or visor pixels.
    poly(d, [(8, 5), (9, 3), (11, 2), (13, 2), (15, 3), (16, 5), (16, 11), (14, 13), (9, 13), (7, 11), (7, 6)], GOLD["shadow"])
    poly(d, [(9, 5), (10, 4), (12, 3), (14, 4), (15, 5), (15, 11), (13, 12), (9, 12), (8, 10), (8, 6)], CELESTIAL["shadow"])
    rect(d, (10, 4, 13, 5), CELESTIAL["base"])
    rect(d, (9, 6, 14, 10), COSMIC["base"])
    rect(d, (11, 2, 12, 11), GOLD["base"])
    rect(d, (11, 3, 11, 6), GOLD["highlight"])
    rect(d, (9, 7, 14, 8), CELESTIAL["base"])
    rect(d, (10, 9, 13, 10), CELESTIAL["shadow"])
    rect(d, (8, 11, 15, 12), GOLD["base"])
    rect(d, (10, 12, 13, 13), CELESTIAL["shadow"])
    rect(d, (6, 14, 7, 17), OUTLINE)
    rect(d, (16, 14, 17, 17), OUTLINE)
    rect(d, (8, 19, 8, 20), OUTLINE)
    rect(d, (15, 19, 15, 20), OUTLINE)

    if include_relics:
        image.alpha_composite(base.held_relic_layer("up"))
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
        raise ValueError(f"Down direction drifted from the approved {base.DISPLAY_NAME} v1 pilot.")

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
