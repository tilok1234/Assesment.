from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

import generate_scorpion_empress_style_v3 as base


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
DIRECTIONS = ("down", "left", "right", "up")
ROOT = Path(__file__).resolve().parent
OUTLINE = base.OUTLINE
CARAPACE = base.CARAPACE
CRIMSON = base.CRIMSON
GOLD = base.GOLD


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def left_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The raised tail stays behind the body and curls into a distinct stinger.
    poly(
        d,
        [
            (14, 18),
            (17, 16),
            (18, 13),
            (18, 10),
            (20, 8),
            (20, 5),
            (19, 4),
            (20, 3),
            (21, 4),
            (21, 7),
            (20, 10),
            (20, 13),
            (18, 17),
            (16, 19),
        ],
        CARAPACE["base"],
    )
    rect(d, (18, 13, 19, 15), CARAPACE["shadow"])
    rect(d, (19, 9, 20, 11), CARAPACE["highlight"])
    rect(d, (20, 6, 21, 8), CARAPACE["shadow"])
    rect(d, (20, 5, 21, 5), CRIMSON["highlight"])
    poly(d, [(19, 4), (19, 2), (21, 2), (21, 4), (20, 5)], GOLD["base"])
    rect(d, (20, 2, 21, 2), GOLD["highlight"])

    # Far legs recede behind the body; near legs make a stepped ground read.
    poly(d, [(10, 15), (8, 16), (6, 18), (3, 18), (2, 19), (4, 20), (8, 19), (11, 17)], CARAPACE["shadow"])
    poly(d, [(15, 15), (17, 16), (19, 18), (21, 18), (21, 20), (18, 20), (15, 18)], CARAPACE["shadow"])
    poly(d, [(10, 17), (8, 18), (7, 20), (4, 20), (5, 21), (9, 21), (12, 19)], CARAPACE["base"])
    poly(d, [(15, 17), (17, 18), (18, 20), (21, 20), (20, 21), (17, 21), (14, 19)], CARAPACE["base"])
    rect(d, (4, 20, 6, 21), CRIMSON["shadow"])
    rect(d, (19, 20, 21, 21), CRIMSON["shadow"])

    # The far pincer is small and lifted, so the leading claw owns the profile.
    poly(d, [(10, 12), (8, 10), (7, 9), (6, 10), (8, 13)], CARAPACE["shadow"])
    poly(d, [(7, 10), (6, 7), (4, 7), (5, 10)], CRIMSON["shadow"])
    poly(d, [(6, 10), (4, 10), (5, 12), (8, 12)], CRIMSON["base"])
    rect(d, (4, 7, 5, 8), CRIMSON["highlight"])

    # The leading arm and broad notched pincer project clearly to the left.
    poly(d, [(10, 13), (7, 11), (5, 11), (5, 14), (8, 15), (11, 16)], CARAPACE["base"])
    poly(d, [(6, 11), (4, 8), (2, 8), (3, 11), (5, 12)], CRIMSON["base"])
    poly(d, [(5, 12), (3, 11), (2, 13), (4, 15), (7, 13)], CRIMSON["shadow"])
    rect(d, (2, 10, 3, 11), GOLD["base"])
    rect(d, (3, 8, 4, 8), CRIMSON["highlight"])

    # A long plated abdomen carries the side view without becoming a flat bar.
    poly(
        d,
        [(8, 11), (13, 10), (17, 12), (18, 15), (17, 19), (14, 21), (9, 20), (7, 17), (7, 13)],
        CARAPACE["base"],
    )
    rect(d, (15, 12, 17, 18), CARAPACE["shadow"])
    poly(d, [(8, 17), (17, 17), (16, 20), (14, 21), (9, 20), (7, 18)], CARAPACE["shadow"])
    rect(d, (10, 12, 14, 13), CARAPACE["highlight"])
    rect(d, (10, 16, 16, 16), OUTLINE)
    rect(d, (11, 19, 15, 19), CARAPACE["base"])

    # One red eye, a projecting muzzle, and a narrow crown establish facing.
    poly(d, [(7, 9), (9, 7), (12, 8), (13, 11), (12, 14), (8, 14), (6, 12)], CARAPACE["shadow"])
    rect(d, (7, 9, 10, 12), CARAPACE["base"])
    rect(d, (6, 10, 7, 11), CRIMSON["highlight"])
    rect(d, (6, 12, 9, 12), OUTLINE)
    rect(d, (8, 13, 10, 13), OUTLINE)
    rect(d, (7, 7, 12, 8), GOLD["base"])
    rect(d, (7, 6, 8, 7), GOLD["highlight"])
    rect(d, (10, 5, 10, 7), GOLD["highlight"])
    rect(d, (12, 6, 12, 8), GOLD["highlight"])
    rect(d, (8, 8, 11, 8), GOLD["shadow"])

    return image


def up_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The tail rises from the rear center. Its dark plates remain separate from
    # the gold stinger and from the quiet dorsal body.
    poly(
        d,
        [
            (11, 17),
            (10, 14),
            (11, 11),
            (13, 9),
            (14, 6),
            (14, 4),
            (15, 3),
            (17, 3),
            (18, 4),
            (17, 6),
            (16, 8),
            (15, 11),
            (14, 14),
            (14, 18),
        ],
        CARAPACE["base"],
    )
    rect(d, (12, 11, 14, 13), CARAPACE["shadow"])
    rect(d, (14, 7, 15, 10), CARAPACE["highlight"])
    rect(d, (15, 4, 17, 6), CARAPACE["shadow"])
    poly(d, [(16, 4), (17, 2), (19, 2), (19, 3), (18, 5)], GOLD["base"])
    rect(d, (18, 2, 19, 2), GOLD["highlight"])

    # Rear-facing pincers angle away from the viewer instead of opening across
    # the front plane.
    poly(d, [(9, 13), (7, 11), (5, 9), (4, 10), (6, 13), (8, 15)], CARAPACE["base"])
    poly(d, [(5, 10), (3, 7), (2, 8), (3, 11)], CRIMSON["base"])
    poly(d, [(4, 10), (2, 10), (3, 13), (6, 12)], CRIMSON["shadow"])
    rect(d, (2, 8, 3, 9), CRIMSON["highlight"])
    rect(d, (2, 10, 3, 10), GOLD["base"])
    poly(d, [(15, 13), (17, 11), (19, 9), (20, 10), (18, 13), (16, 15)], CARAPACE["base"])
    poly(d, [(19, 10), (21, 7), (21, 8), (21, 11)], CRIMSON["base"])
    poly(d, [(20, 10), (21, 10), (21, 13), (18, 12)], CRIMSON["shadow"])
    rect(d, (20, 8, 21, 9), CRIMSON["highlight"])
    rect(d, (20, 10, 21, 10), GOLD["base"])

    # Layered legs widen toward the floor while leaving clear air around claws.
    poly(d, [(9, 15), (6, 15), (4, 17), (2, 17), (3, 19), (7, 18), (10, 17)], CARAPACE["base"])
    poly(d, [(9, 17), (6, 18), (4, 20), (2, 20), (3, 21), (7, 20), (10, 19)], CARAPACE["shadow"])
    poly(d, [(15, 15), (18, 15), (20, 17), (21, 17), (21, 19), (17, 18), (14, 17)], CARAPACE["base"])
    poly(d, [(15, 17), (18, 18), (20, 20), (21, 20), (21, 21), (17, 20), (14, 19)], CARAPACE["shadow"])
    rect(d, (3, 20, 5, 21), CRIMSON["shadow"])
    rect(d, (20, 20, 21, 21), CRIMSON["shadow"])

    # Rear carapace replaces the face, eyes, and mouth with broad dorsal plates.
    poly(
        d,
        [(9, 9), (12, 8), (15, 10), (17, 14), (17, 19), (15, 21), (10, 21), (7, 19), (7, 14)],
        CARAPACE["base"],
    )
    rect(d, (8, 12, 9, 18), CARAPACE["shadow"])
    rect(d, (15, 12, 16, 18), CARAPACE["shadow"])
    rect(d, (10, 10, 14, 12), CARAPACE["highlight"])
    rect(d, (9, 14, 15, 14), OUTLINE)
    rect(d, (9, 18, 15, 18), OUTLINE)
    rect(d, (10, 15, 14, 17), CARAPACE["shadow"])
    rect(d, (10, 19, 14, 20), CARAPACE["shadow"])

    # Only the back rim of the crown remains; there are no red facial pixels.
    rect(d, (9, 8, 14, 9), GOLD["base"])
    rect(d, (9, 7, 10, 8), GOLD["highlight"])
    rect(d, (12, 6, 12, 8), GOLD["highlight"])
    rect(d, (14, 7, 14, 9), GOLD["highlight"])
    rect(d, (10, 9, 13, 9), GOLD["shadow"])

    return image


def treat_direction(direction: str, source: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    prefix = f"scorpion-empress-directions-v1-{direction}"
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("carapace", CARAPACE),
                ("crimson", CRIMSON),
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

    approved_down = Image.open(ROOT / "scorpion-empress-style-v3.png").convert("RGBA")
    if frames[0].tobytes() != approved_down.tobytes():
        raise ValueError("Down direction drifted from approved Scorpion Empress v3.")

    sheet = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE * len(DIRECTIONS)), (0, 0, 0, 0))
    for row, frame in enumerate(frames):
        sheet.paste(frame, (0, row * OUTPUT_SIZE))
    sheet_path = ROOT / "scorpion-empress-directions-v1.png"
    sheet.save(sheet_path, optimize=False)

    (ROOT / "scorpion-empress-directions-v1-manifest.json").write_text(
        json.dumps(
            {
                "file": sheet_path.name,
                "width": sheet.width,
                "height": sheet.height,
                "cell": OUTPUT_SIZE,
                "directionOrder": list(DIRECTIONS),
                "hardAlpha": True,
                "downMatchesApprovedV3": True,
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
