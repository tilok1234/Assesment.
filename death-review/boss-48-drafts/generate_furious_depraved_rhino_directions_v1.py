from __future__ import annotations

import json

from PIL import Image, ImageDraw

import generate_furious_depraved_rhino_style_v1 as base


LOGICAL_SIZE = base.LOGICAL_SIZE
OUTPUT_SIZE = base.OUTPUT_SIZE
DIRECTIONS = ("down", "left", "right", "up")
ROOT = base.ROOT
RUNTIME_ROOT = ROOT.parents[1] / "engine" / "assets" / "bosses"
SLUG = base.SLUG
OUTLINE = base.OUTLINE
HIDE = base.HIDE
HORN = base.HORN
RUST = base.RUST
RAGE = base.RAGE
CORRUPTION = base.CORRUPTION


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # A thin corrupted tail sits behind a long horizontal body.
    poly(draw, [(18, 10), (21, 9), (21, 12), (20, 14), (21, 16), (19, 17), (18, 15)], HIDE["shadow"])
    rect(draw, (20, 14, 21, 16), CORRUPTION["base"])
    rect(draw, (20, 15, 20, 15), CORRUPTION["highlight"])

    # High shoulder hump, long back, deep ribcage, and a clean belly line.
    # The head occupies only the front third instead of swallowing the body.
    poly(draw, [(7, 9), (10, 6), (14, 5), (18, 7), (20, 10), (20, 15), (18, 17), (8, 17), (6, 15), (6, 11)], HIDE["base"])
    poly(draw, [(9, 9), (11, 6), (14, 5), (18, 8), (18, 10), (9, 10)], HIDE["highlight"])
    rect(draw, (8, 15, 18, 17), HIDE["shadow"])
    rect(draw, (11, 16, 14, 17), OUTLINE)

    # Rusted harness, flank brand, scars, and corruption stay on the torso.
    poly(draw, [(9, 8), (11, 7), (18, 15), (17, 17), (13, 12), (10, 17), (8, 15), (12, 10)], RUST["shadow"])
    rect(draw, (10, 9, 12, 10), RUST["base"])
    rect(draw, (16, 13, 17, 14), RUST["highlight"])
    poly(draw, [(13, 12), (15, 11), (17, 14), (16, 17), (13, 16)], RAGE["shadow"])
    rect(draw, (14, 13, 15, 15), RAGE["base"])
    rect(draw, (15, 12, 15, 16), RAGE["highlight"])
    rect(draw, (13, 14, 17, 14), RAGE["highlight"])
    rect(draw, (18, 11, 19, 13), CORRUPTION["base"])
    rect(draw, (19, 12, 19, 12), CORRUPTION["highlight"])

    # Compact low head, heavy muzzle, torn ear, and one tiny furious eye.
    poly(draw, [(4, 8), (8, 7), (11, 9), (11, 13), (8, 16), (4, 16), (2, 14), (2, 11)], HIDE["base"])
    poly(draw, [(8, 8), (10, 5), (12, 7), (10, 10)], HIDE["shadow"])
    rect(draw, (5, 9, 9, 10), HIDE["highlight"])
    poly(draw, [(3, 11), (7, 10), (9, 12), (8, 15), (3, 15), (2, 13)], HIDE["shadow"])
    poly(draw, [(4, 10), (7, 10), (7, 12), (4, 12)], OUTLINE)
    rect(draw, (5, 11, 5, 11), RAGE["highlight"])
    rect(draw, (3, 13, 7, 15), HIDE["base"])
    rect(draw, (3, 13, 6, 13), HIDE["highlight"])
    rect(draw, (3, 14, 4, 15), OUTLINE)

    # Long nasal horn projects from the muzzle; a short secondary horn marks
    # the forehead without increasing the head mass.
    poly(draw, [(5, 11), (2, 7), (3, 12), (6, 13)], HORN["shadow"])
    poly(draw, [(4, 11), (2, 7), (5, 12)], HORN["base"])
    rect(draw, (2, 7, 2, 8), HORN["highlight"])
    poly(draw, [(7, 10), (6, 7), (9, 9)], HORN["base"])
    rect(draw, (6, 7, 6, 8), HORN["highlight"])

    # Broken collar links hang below the neck.
    rect(draw, (7, 14, 8, 15), RUST["base"])
    rect(draw, (8, 15, 9, 16), OUTLINE)
    rect(draw, (5, 16, 6, 17), RUST["base"])
    rect(draw, (4, 17, 5, 18), OUTLINE)

    # Two forelegs and two hindlegs occupy distinct x positions with a
    # visible belly gap. Far legs are shorter/darker; near legs reach lower.
    rect(draw, (10, 15, 11, 20), HIDE["shadow"])
    rect(draw, (19, 15, 20, 20), HIDE["shadow"])
    rect(draw, (7, 14, 8, 21), HIDE["base"])
    rect(draw, (16, 14, 17, 21), HIDE["base"])
    rect(draw, (9, 19, 11, 21), OUTLINE)
    rect(draw, (19, 19, 20, 21), OUTLINE)
    rect(draw, (6, 20, 8, 21), OUTLINE)
    rect(draw, (15, 20, 17, 21), OUTLINE)
    rect(draw, (7, 17, 7, 19), HIDE["highlight"])
    rect(draw, (16, 17, 16, 19), HIDE["highlight"])

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Rear tail, four separated legs, and the shoulder hump define the back
    # view as an animal body rather than a humanoid torso.
    poly(draw, [(17, 12), (20, 10), (21, 12), (20, 15), (21, 18), (19, 20), (16, 18)], HIDE["shadow"])
    rect(draw, (19, 17, 21, 19), CORRUPTION["base"])
    rect(draw, (20, 18, 20, 18), CORRUPTION["highlight"])
    rect(draw, (5, 14, 7, 20), HIDE["shadow"])
    rect(draw, (16, 14, 18, 20), HIDE["shadow"])
    rect(draw, (8, 16, 10, 21), HIDE["base"])
    rect(draw, (13, 16, 15, 21), HIDE["base"])
    rect(draw, (5, 19, 7, 21), OUTLINE)
    rect(draw, (8, 20, 10, 21), OUTLINE)
    rect(draw, (13, 20, 15, 21), OUTLINE)
    rect(draw, (16, 19, 18, 21), OUTLINE)
    poly(draw, [(6, 7), (9, 5), (15, 5), (18, 7), (20, 12), (18, 17), (5, 17), (3, 12)], HIDE["base"])
    poly(draw, [(8, 7), (10, 3), (15, 4), (18, 8), (16, 10), (7, 10)], HIDE["highlight"])
    rect(draw, (5, 14, 18, 17), HIDE["shadow"])

    # Broken restraint links hang from the shoulder harness, not from hands.
    rect(draw, (2, 9, 3, 10), RUST["base"])
    rect(draw, (3, 10, 4, 11), OUTLINE)
    rect(draw, (20, 9, 21, 10), RUST["base"])
    rect(draw, (19, 10, 20, 11), OUTLINE)

    # Crossed harness and an inverted depraved brand dominate the back.
    poly(draw, [(6, 10), (8, 9), (17, 17), (15, 19), (12, 15), (8, 19), (6, 17), (10, 12)], RUST["shadow"])
    rect(draw, (7, 10, 9, 11), RUST["base"])
    rect(draw, (14, 11, 16, 12), RUST["base"])
    rect(draw, (8, 12, 9, 13), RUST["highlight"])
    rect(draw, (14, 15, 15, 16), RUST["highlight"])
    poly(draw, [(9, 14), (12, 12), (15, 14), (14, 18), (10, 18)], RAGE["shadow"])
    rect(draw, (11, 14, 13, 17), RAGE["base"])
    rect(draw, (12, 14, 12, 18), RAGE["highlight"])
    rect(draw, (10, 16, 14, 16), RAGE["highlight"])
    rect(draw, (6, 15, 7, 16), CORRUPTION["shadow"])
    rect(draw, (16, 15, 18, 17), CORRUPTION["base"])

    # Rear skull is unmistakably non-facial: ears, thick neck, horn base,
    # and a central hide ridge, but no eyes, nostrils, or muzzle slit.
    poly(draw, [(6, 5), (8, 3), (15, 3), (18, 5), (19, 9), (17, 13), (7, 13), (4, 10), (4, 7)], HIDE["shadow"])
    poly(draw, [(6, 5), (3, 3), (3, 7), (6, 8)], HIDE["base"])
    poly(draw, [(17, 5), (20, 3), (21, 4), (20, 8), (17, 8)], HIDE["base"])
    rect(draw, (8, 4, 15, 6), HIDE["base"])
    rect(draw, (9, 4, 14, 4), HIDE["highlight"])
    poly(draw, [(10, 3), (12, 2), (14, 4), (14, 10), (12, 12), (10, 10)], HIDE["base"])
    rect(draw, (11, 3, 12, 9), HIDE["highlight"])
    rect(draw, (7, 9, 16, 12), HIDE["shadow"])
    rect(draw, (9, 10, 14, 12), CORRUPTION["shadow"])
    rect(draw, (11, 10, 12, 11), CORRUPTION["base"])
    rect(draw, (12, 10, 12, 10), CORRUPTION["highlight"])
    rect(draw, (7, 13, 9, 14), RUST["base"])
    rect(draw, (14, 13, 16, 14), RUST["base"])

    rect(draw, (7, 13, 7, 17), OUTLINE)
    rect(draw, (16, 13, 16, 17), OUTLINE)

    # Rear view keeps four hoof columns with clear transparent lanes.
    rect(draw, (3, 17, 5, 20), HIDE["shadow"])
    rect(draw, (18, 17, 20, 20), HIDE["shadow"])
    rect(draw, (7, 17, 9, 21), HIDE["base"])
    rect(draw, (14, 17, 16, 21), HIDE["base"])
    rect(draw, (3, 19, 5, 21), OUTLINE)
    rect(draw, (7, 20, 9, 21), OUTLINE)
    rect(draw, (14, 20, 16, 21), OUTLINE)
    rect(draw, (18, 19, 20, 21), OUTLINE)
    rect(draw, (4, 18, 4, 19), HIDE["highlight"])
    rect(draw, (8, 18, 8, 19), HIDE["highlight"])
    rect(draw, (15, 18, 15, 19), HIDE["highlight"])
    rect(draw, (19, 18, 19, 19), HIDE["highlight"])

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
