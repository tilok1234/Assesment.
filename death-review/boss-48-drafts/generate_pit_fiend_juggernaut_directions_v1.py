from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_pit_fiend_juggernaut_style_v2 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
FIEND = base.FIEND
CHARCOAL = base.CHARCOAL
IRON = base.IRON
HORN = base.HORN
GOLD = base.GOLD


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The far wing collapses behind the body while one rear wing trails high.
    poly(d, [(10, 9), (13, 7), (16, 5), (17, 7), (16, 11), (17, 14), (14, 13), (11, 16)], CHARCOAL["shadow"])
    poly(d, [(13, 9), (16, 7), (20, 3), (21, 4), (20, 9), (21, 13), (17, 12), (14, 16)], CHARCOAL["base"])
    rect(d, (17, 7, 18, 12), CHARCOAL["highlight"])
    poly(d, [(17, 9), (20, 8), (20, 11), (18, 12)], CHARCOAL["shadow"])

    # The juggernaut body narrows in profile without losing its planted weight.
    poly(d, [(8, 9), (14, 9), (17, 12), (18, 17), (16, 21), (7, 21), (5, 19), (5, 13)], FIEND["base"])
    rect(d, (6, 13, 8, 20), FIEND["highlight"])
    rect(d, (15, 12, 17, 20), FIEND["shadow"])
    rect(d, (7, 18, 10, 21), CHARCOAL["shadow"])
    rect(d, (12, 18, 16, 21), CHARCOAL["shadow"])
    rect(d, (6, 20, 10, 21), IRON["shadow"])
    rect(d, (12, 20, 16, 21), IRON["shadow"])

    # The trailing fist recedes behind the shoulder and wing root.
    poly(d, [(14, 11), (17, 12), (19, 15), (18, 19), (15, 18), (13, 14)], FIEND["base"])
    rect(d, (17, 13, 18, 15), FIEND["highlight"])
    rect(d, (16, 16, 19, 19), IRON["shadow"])
    rect(d, (17, 16, 18, 17), IRON["base"])
    rect(d, (15, 14, 18, 15), IRON["highlight"])

    # Side armor turns the front emblem into a slim inset red plate.
    poly(d, [(8, 10), (14, 10), (16, 13), (16, 19), (7, 19), (6, 14)], CHARCOAL["base"])
    rect(d, (8, 11, 14, 12), CHARCOAL["highlight"])
    rect(d, (7, 16, 15, 19), CHARCOAL["shadow"])
    rect(d, (9, 13, 14, 17), FIEND["shadow"])
    rect(d, (9, 13, 10, 16), FIEND["base"])
    rect(d, (9, 13, 10, 13), FIEND["highlight"])
    rect(d, (10, 17, 14, 18), FIEND["base"])

    # The head turns left: one eye, projecting muzzle, and layered horns.
    poly(d, [(7, 6), (9, 4), (13, 4), (15, 6), (15, 11), (13, 13), (8, 13), (6, 10), (6, 7)], FIEND["base"])
    rect(d, (8, 5, 13, 6), FIEND["highlight"])
    rect(d, (11, 10, 14, 12), FIEND["shadow"])
    poly(d, [(8, 6), (6, 4), (3, 2), (3, 5), (6, 8)], HORN["base"])
    rect(d, (3, 2, 4, 3), HORN["highlight"])
    rect(d, (5, 5, 6, 7), HORN["shadow"])
    poly(d, [(12, 5), (15, 3), (17, 3), (16, 6), (14, 8)], HORN["shadow"])
    rect(d, (6, 7, 9, 8), GOLD["base"])
    rect(d, (7, 8, 7, 8), OUTLINE)
    rect(d, (5, 9, 8, 10), FIEND["shadow"])
    rect(d, (5, 10, 9, 10), OUTLINE)
    rect(d, (6, 11, 6, 12), HORN["highlight"])
    rect(d, (8, 11, 8, 12), HORN["highlight"])

    # The tower shield becomes the dominant leading silhouette.
    poly(d, [(2, 9), (6, 8), (8, 10), (8, 19), (6, 21), (3, 20), (2, 17)], IRON["base"])
    rect(d, (3, 10, 4, 19), IRON["highlight"])
    rect(d, (6, 10, 7, 19), IRON["shadow"])
    rect(d, (3, 9, 7, 10), CHARCOAL["shadow"])
    rect(d, (3, 19, 7, 20), CHARCOAL["shadow"])
    rect(d, (4, 13, 5, 17), FIEND["shadow"])
    rect(d, (3, 14, 6, 15), FIEND["base"])
    rect(d, (4, 14, 4, 14), GOLD["highlight"])

    rect(d, (8, 12, 8, 15), OUTLINE)
    rect(d, (14, 12, 14, 15), OUTLINE)
    rect(d, (7, 19, 7, 20), OUTLINE)
    rect(d, (9, 19, 9, 20), OUTLINE)
    rect(d, (13, 19, 13, 20), OUTLINE)
    rect(d, (15, 19, 15, 20), OUTLINE)

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Rear-facing wings reopen around the body with dark, quiet membranes.
    poly(d, [(9, 9), (6, 7), (3, 4), (2, 5), (3, 10), (2, 14), (6, 13), (9, 16)], CHARCOAL["base"])
    poly(d, [(15, 9), (18, 7), (21, 4), (21, 9), (20, 13), (17, 13), (15, 16)], CHARCOAL["base"])
    rect(d, (4, 7, 5, 12), CHARCOAL["shadow"])
    rect(d, (18, 7, 19, 12), CHARCOAL["shadow"])
    poly(d, [(3, 10), (6, 9), (8, 13), (5, 12)], CHARCOAL["highlight"])
    poly(d, [(16, 13), (18, 9), (20, 10), (19, 12)], CHARCOAL["highlight"])

    # Rear bulk and boots retain the same grounded juggernaut stance.
    poly(d, [(8, 9), (16, 9), (19, 13), (19, 20), (16, 21), (7, 21), (5, 19), (5, 13)], FIEND["base"])
    rect(d, (6, 13, 8, 20), FIEND["shadow"])
    rect(d, (16, 13, 18, 20), FIEND["shadow"])
    rect(d, (7, 18, 10, 21), CHARCOAL["shadow"])
    rect(d, (13, 18, 17, 21), CHARCOAL["shadow"])
    rect(d, (6, 20, 10, 21), IRON["shadow"])
    rect(d, (13, 20, 17, 21), IRON["shadow"])

    # The unshielded arm turns away and stays behind the rear plate.
    poly(d, [(8, 11), (5, 12), (3, 15), (3, 18), (5, 20), (8, 18)], FIEND["base"])
    rect(d, (4, 12, 6, 14), FIEND["highlight"])
    rect(d, (3, 16, 6, 19), IRON["shadow"])
    rect(d, (4, 16, 5, 17), IRON["base"])
    rect(d, (5, 14, 8, 15), IRON["highlight"])

    # Rear plate uses a spine and harness, never the front red emblem.
    poly(d, [(8, 10), (16, 10), (18, 14), (17, 19), (7, 19), (6, 14)], CHARCOAL["base"])
    rect(d, (8, 11, 16, 12), CHARCOAL["highlight"])
    rect(d, (7, 16, 17, 19), CHARCOAL["shadow"])
    rect(d, (10, 12, 14, 18), IRON["shadow"])
    rect(d, (11, 12, 12, 18), IRON["base"])
    rect(d, (8, 13, 16, 13), OUTLINE)
    rect(d, (8, 18, 16, 18), OUTLINE)
    rect(d, (8, 14, 9, 17), FIEND["shadow"])
    rect(d, (15, 14, 16, 17), FIEND["shadow"])

    # Back of the horned head: no eyes, muzzle, fangs, or front face seams.
    poly(d, [(8, 6), (10, 4), (15, 4), (17, 6), (17, 11), (15, 13), (9, 13), (7, 10), (7, 7)], FIEND["base"])
    rect(d, (9, 5, 15, 6), FIEND["highlight"])
    rect(d, (8, 10, 16, 12), FIEND["shadow"])
    poly(d, [(9, 6), (6, 4), (4, 2), (4, 5), (7, 8)], HORN["base"])
    poly(d, [(15, 6), (18, 4), (20, 2), (20, 5), (17, 8)], HORN["base"])
    rect(d, (4, 2, 5, 3), HORN["highlight"])
    rect(d, (19, 2, 20, 3), HORN["highlight"])
    rect(d, (6, 5, 7, 7), HORN["shadow"])
    rect(d, (17, 5, 18, 7), HORN["shadow"])
    rect(d, (10, 7, 14, 10), FIEND["shadow"])
    rect(d, (11, 7, 13, 9), CHARCOAL["shadow"])

    # A 180-degree turn places the tower shield on the opposite screen side.
    poly(d, [(16, 10), (20, 9), (21, 11), (21, 18), (20, 20), (17, 21), (15, 19), (15, 12)], IRON["base"])
    rect(d, (16, 11, 17, 19), IRON["shadow"])
    rect(d, (19, 10, 20, 19), IRON["highlight"])
    rect(d, (16, 10, 20, 11), CHARCOAL["shadow"])
    rect(d, (16, 19, 20, 20), CHARCOAL["shadow"])
    rect(d, (18, 13, 19, 17), FIEND["shadow"])
    rect(d, (17, 14, 20, 15), FIEND["base"])
    rect(d, (19, 14, 19, 14), GOLD["shadow"])

    rect(d, (8, 12, 8, 15), OUTLINE)
    rect(d, (16, 12, 16, 15), OUTLINE)
    rect(d, (8, 19, 8, 20), OUTLINE)
    rect(d, (10, 19, 10, 20), OUTLINE)
    rect(d, (14, 19, 14, 20), OUTLINE)
    rect(d, (16, 19, 16, 20), OUTLINE)

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"pit-fiend-juggernaut-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("fiend", FIEND),
                ("charcoal", CHARCOAL),
                ("iron", IRON),
                ("horn", HORN),
                ("gold", GOLD),
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

    approved_down = Image.open(ROOT / "pit-fiend-juggernaut-style-v2.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Pit-Fiend Juggernaut v2.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "pit-fiend-juggernaut-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "pit-fiend-juggernaut-directions-v1-manifest.json").write_text(
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
