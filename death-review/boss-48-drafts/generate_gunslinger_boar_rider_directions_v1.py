from __future__ import annotations

import json

from PIL import Image, ImageDraw

import generate_gunslinger_boar_rider_style_v1 as base


LOGICAL_SIZE = base.LOGICAL_SIZE
OUTPUT_SIZE = base.OUTPUT_SIZE
DIRECTIONS = ("down", "left", "right", "up")
ROOT = base.ROOT
RUNTIME_ROOT = ROOT.parents[1] / "engine" / "assets" / "bosses"
SLUG = base.SLUG
OUTLINE = base.OUTLINE
BOAR = base.BOAR
BRISTLE = base.BRISTLE
DUSTER = base.DUSTER
LEATHER = base.LEATHER
GUNMETAL = base.GUNMETAL
CRIMSON = base.CRIMSON
IVORY = base.IVORY


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # The boar is a long, low charge platform with a bristled tail.
    poly(draw, [(17, 12), (20, 10), (21, 11), (20, 13), (21, 15), (19, 16), (17, 15)], BRISTLE["base"])
    rect(draw, (20, 10, 21, 11), BRISTLE["highlight"])
    rect(draw, (5, 17, 8, 21), BOAR["shadow"])
    rect(draw, (10, 18, 13, 21), BOAR["shadow"])
    rect(draw, (16, 17, 19, 21), BOAR["shadow"])
    rect(draw, (4, 20, 8, 21), OUTLINE)
    rect(draw, (10, 20, 13, 21), OUTLINE)
    rect(draw, (16, 20, 20, 21), OUTLINE)
    poly(draw, [(5, 11), (17, 11), (21, 14), (20, 18), (17, 20), (6, 20), (3, 18), (3, 14)], BOAR["base"])
    rect(draw, (6, 12, 18, 13), BOAR["highlight"])
    rect(draw, (5, 18, 19, 20), BOAR["shadow"])
    poly(draw, [(7, 12), (9, 9), (11, 12), (13, 9), (15, 12), (18, 10), (19, 14)], BRISTLE["base"])
    rect(draw, (8, 11, 17, 12), BRISTLE["highlight"])

    # Side head projects in the travel direction with one tusk and red eye.
    poly(draw, [(5, 12), (3, 11), (2, 13), (3, 15), (6, 15)], BRISTLE["shadow"])
    poly(draw, [(5, 13), (10, 13), (12, 16), (10, 19), (5, 20), (2, 18), (2, 15)], BOAR["base"])
    rect(draw, (3, 14, 9, 15), BOAR["highlight"])
    poly(draw, [(4, 15), (8, 15), (7, 17), (3, 17)], OUTLINE)
    rect(draw, (4, 15, 4, 15), CRIMSON["highlight"])
    rect(draw, (2, 17, 7, 19), BOAR["shadow"])
    rect(draw, (2, 17, 4, 17), BOAR["highlight"])
    rect(draw, (2, 18, 3, 19), OUTLINE)
    poly(draw, [(6, 18), (4, 19), (4, 21), (7, 20)], IVORY["base"])
    rect(draw, (4, 20, 4, 20), IVORY["highlight"])

    # Saddle, rider legs, and split duster visibly straddle the mount.
    poly(draw, [(9, 11), (16, 11), (18, 15), (16, 17), (8, 17), (7, 14)], LEATHER["shadow"])
    rect(draw, (9, 12, 16, 15), DUSTER["shadow"])
    rect(draw, (10, 12, 15, 13), DUSTER["highlight"])
    rect(draw, (8, 15, 17, 16), GUNMETAL["shadow"])
    rect(draw, (10, 15, 15, 15), GUNMETAL["base"])
    rect(draw, (8, 10, 10, 16), LEATHER["shadow"])
    rect(draw, (15, 10, 17, 16), LEATHER["shadow"])
    rect(draw, (7, 15, 10, 17), OUTLINE)
    rect(draw, (15, 15, 18, 17), OUTLINE)

    # Rider leans forward with the near revolver fully foregrounded.
    poly(draw, [(10, 6), (15, 6), (17, 9), (16, 13), (13, 12), (11, 14), (9, 11), (8, 8)], DUSTER["base"])
    rect(draw, (10, 7, 15, 8), DUSTER["highlight"])
    poly(draw, [(11, 9), (15, 9), (16, 13), (13, 12), (11, 13), (10, 11)], DUSTER["shadow"])
    rect(draw, (11, 9, 15, 10), CRIMSON["shadow"])
    rect(draw, (12, 9, 14, 9), CRIMSON["highlight"])
    base.draw_revolver(draw, (10, 8), (3, 7))
    rect(draw, (9, 7, 11, 9), DUSTER["base"])
    rect(draw, (10, 8, 10, 8), IVORY["highlight"])
    # Rear-hand sidearm points upward so it remains distinct but secondary.
    base.draw_revolver(draw, (16, 8), (18, 4))
    rect(draw, (15, 7, 17, 9), DUSTER["shadow"])

    # Profile hat, shadowed face, and bandana tail.
    poly(draw, [(11, 3), (12, 2), (16, 2), (17, 4), (16, 6), (10, 6), (9, 4)], LEATHER["base"])
    rect(draw, (12, 2, 15, 3), LEATHER["highlight"])
    rect(draw, (8, 4, 17, 5), OUTLINE)
    rect(draw, (9, 4, 16, 4), LEATHER["base"])
    poly(draw, [(10, 5), (15, 5), (16, 7), (12, 8), (9, 7)], IVORY["shadow"])
    rect(draw, (10, 6, 11, 6), OUTLINE)
    rect(draw, (10, 7, 14, 8), CRIMSON["base"])
    rect(draw, (11, 7, 13, 7), CRIMSON["highlight"])
    poly(draw, [(14, 7), (18, 8), (16, 10)], CRIMSON["shadow"])

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Rear hooves, rump, and raised bristle tail establish the mount's back.
    rect(draw, (5, 17, 8, 21), BOAR["shadow"])
    rect(draw, (9, 18, 11, 21), BOAR["shadow"])
    rect(draw, (13, 18, 15, 21), BOAR["shadow"])
    rect(draw, (16, 17, 19, 21), BOAR["shadow"])
    rect(draw, (4, 20, 8, 21), OUTLINE)
    rect(draw, (9, 20, 11, 21), OUTLINE)
    rect(draw, (13, 20, 15, 21), OUTLINE)
    rect(draw, (16, 20, 20, 21), OUTLINE)
    poly(draw, [(5, 11), (18, 11), (21, 14), (20, 19), (17, 20), (6, 20), (3, 18), (2, 14)], BOAR["base"])
    rect(draw, (4, 13, 19, 14), BOAR["highlight"])
    rect(draw, (4, 18, 19, 20), BOAR["shadow"])
    poly(draw, [(4, 13), (5, 10), (7, 12), (9, 9), (11, 12), (13, 9), (15, 12), (18, 10), (19, 14)], BRISTLE["base"])
    rect(draw, (5, 12, 18, 13), BRISTLE["highlight"])
    poly(draw, [(17, 12), (20, 10), (21, 12), (20, 15), (21, 17), (19, 18), (17, 16)], BRISTLE["shadow"])
    rect(draw, (20, 10, 21, 11), BRISTLE["highlight"])

    # Rear saddle and rider boots flank the centerline.
    poly(draw, [(7, 11), (16, 11), (18, 15), (16, 17), (7, 17), (5, 15)], LEATHER["shadow"])
    rect(draw, (7, 12, 16, 15), DUSTER["shadow"])
    rect(draw, (8, 12, 15, 13), DUSTER["highlight"])
    rect(draw, (6, 15, 17, 16), GUNMETAL["shadow"])
    rect(draw, (8, 15, 15, 15), GUNMETAL["base"])
    rect(draw, (6, 10, 8, 16), LEATHER["shadow"])
    rect(draw, (15, 10, 17, 16), LEATHER["shadow"])
    rect(draw, (5, 14, 8, 16), OUTLINE)
    rect(draw, (15, 14, 18, 16), OUTLINE)

    # Back of the duster carries crossed holster straps.
    poly(draw, [(8, 6), (15, 6), (17, 9), (16, 13), (13, 12), (12, 15), (10, 12), (7, 13), (6, 9)], DUSTER["shadow"])
    rect(draw, (8, 7, 15, 8), DUSTER["base"])
    poly(draw, [(8, 7), (10, 7), (15, 13), (14, 14)], LEATHER["base"])
    poly(draw, [(15, 7), (13, 7), (8, 13), (9, 14)], LEATHER["base"])
    rect(draw, (11, 9, 12, 13), CRIMSON["shadow"])
    rect(draw, (11, 10, 12, 10), CRIMSON["highlight"])

    # Both sidearms remain visible beyond the shoulders in the rear view.
    base.draw_revolver(draw, (8, 8), (3, 8))
    base.draw_revolver(draw, (15, 8), (20, 8))
    rect(draw, (7, 7, 9, 9), DUSTER["base"])
    rect(draw, (14, 7, 16, 9), DUSTER["base"])

    # Rear hat crown and bandana knot contain no face pixels.
    poly(draw, [(9, 3), (10, 2), (14, 2), (15, 3), (15, 6), (8, 6), (8, 4)], LEATHER["shadow"])
    rect(draw, (10, 2, 13, 3), LEATHER["base"])
    rect(draw, (7, 4, 16, 5), OUTLINE)
    rect(draw, (8, 4, 15, 4), LEATHER["base"])
    rect(draw, (9, 5, 14, 7), DUSTER["shadow"])
    rect(draw, (10, 6, 13, 7), CRIMSON["base"])
    rect(draw, (11, 6, 12, 6), CRIMSON["highlight"])
    poly(draw, [(13, 7), (17, 8), (15, 10)], CRIMSON["shadow"])

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

    approved_down = Image.open(ROOT / f"{SLUG}-style-v1.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError(f"Down direction drifted from the approved {base.DISPLAY_NAME} v1 pilot.")

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
