from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
SLUG = "eclipse-unicorn-sovereign"
DISPLAY_NAME = "Eclipse Unicorn Sovereign"
OUTLINE = "#171622"

COAT = {
    "base": "#d7d4df",
    "shadow": "#77718a",
    "highlight": "#fff8f0",
}
MANE = {
    "base": "#4d2f73",
    "shadow": "#261b3e",
    "highlight": "#a85ed3",
}
HORN = {
    "base": "#f5c75e",
    "shadow": "#9a5f3c",
    "highlight": "#fff0a8",
}
ARMOR = {
    "base": "#334c78",
    "shadow": "#1f2946",
    "highlight": "#6d8fc4",
}
ARCANE = {
    "base": "#52d9e8",
    "shadow": "#2c6b94",
    "highlight": "#b9fbff",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Flowing eclipse mane and tail sit behind the pale body mass.
    poly(draw, [(7, 7), (5, 8), (4, 11), (5, 14), (4, 17), (7, 18), (9, 15), (9, 9)], MANE["shadow"])
    poly(draw, [(17, 13), (20, 14), (21, 17), (20, 20), (17, 19), (18, 17), (16, 16)], MANE["base"])
    rect(draw, (5, 10, 6, 15), MANE["highlight"])
    rect(draw, (19, 15, 20, 17), MANE["highlight"])

    # Broad equine shoulders, barrel, and rump form a low quadruped body.
    poly(draw, [(6, 9), (8, 7), (16, 7), (19, 10), (19, 16), (17, 18), (7, 18), (5, 16), (5, 11)], COAT["base"])
    poly(draw, [(8, 8), (11, 6), (16, 8), (17, 11), (7, 11)], COAT["highlight"])
    rect(draw, (7, 15, 17, 18), COAT["shadow"])

    # Four separated legs and bright fetlocks keep the front view animal-like.
    rect(draw, (4, 15, 6, 20), COAT["shadow"])
    rect(draw, (18, 15, 20, 20), COAT["shadow"])
    rect(draw, (7, 16, 9, 21), COAT["base"])
    rect(draw, (15, 16, 17, 21), COAT["base"])
    rect(draw, (4, 19, 6, 21), OUTLINE)
    rect(draw, (7, 20, 9, 21), OUTLINE)
    rect(draw, (15, 20, 17, 21), OUTLINE)
    rect(draw, (18, 19, 20, 21), OUTLINE)
    rect(draw, (5, 18, 5, 19), COAT["highlight"])
    rect(draw, (8, 18, 8, 19), COAT["highlight"])
    rect(draw, (16, 18, 16, 19), COAT["highlight"])
    rect(draw, (19, 18, 19, 19), COAT["highlight"])

    # Crescent barding and a cyan eclipse gem establish boss-scale regalia.
    poly(draw, [(6, 11), (9, 9), (18, 11), (18, 16), (16, 18), (8, 18), (6, 16)], ARMOR["shadow"])
    poly(draw, [(8, 11), (11, 9), (17, 11), (16, 15), (9, 15)], ARMOR["base"])
    rect(draw, (9, 11, 16, 11), ARMOR["highlight"])
    poly(draw, [(9, 14), (12, 12), (15, 14), (14, 17), (10, 17)], HORN["shadow"])
    poly(draw, [(10, 14), (12, 13), (14, 14), (13, 16), (11, 16)], HORN["base"])
    rect(draw, (12, 14, 12, 15), ARCANE["highlight"])
    rect(draw, (11, 15, 13, 16), ARCANE["base"])

    # Proud narrow face, pointed ears, luminous eyes, and long spiral horn.
    poly(draw, [(8, 7), (9, 4), (12, 3), (15, 4), (16, 7), (15, 12), (13, 15), (10, 14), (8, 11)], COAT["base"])
    poly(draw, [(9, 5), (6, 3), (7, 8), (9, 9)], COAT["shadow"])
    poly(draw, [(15, 5), (18, 3), (17, 8), (15, 9)], COAT["shadow"])
    rect(draw, (10, 5, 14, 8), COAT["highlight"])
    poly(draw, [(8, 8), (10, 7), (10, 10), (8, 10)], OUTLINE)
    poly(draw, [(14, 7), (16, 8), (16, 10), (14, 10)], OUTLINE)
    rect(draw, (9, 8, 9, 8), ARCANE["highlight"])
    rect(draw, (15, 8, 15, 8), ARCANE["highlight"])
    rect(draw, (10, 11, 14, 14), COAT["shadow"])
    rect(draw, (11, 11, 13, 12), COAT["base"])
    rect(draw, (11, 13, 11, 14), OUTLINE)
    rect(draw, (13, 13, 13, 14), OUTLINE)

    # The sunhorn is tall and striped so it cannot read as an ordinary horse.
    poly(draw, [(10, 6), (12, 2), (14, 6), (13, 10), (11, 10)], HORN["shadow"])
    poly(draw, [(11, 6), (12, 2), (13, 7), (12, 9)], HORN["base"])
    rect(draw, (12, 2, 12, 3), HORN["highlight"])
    rect(draw, (11, 5, 12, 5), ARMOR["highlight"])
    rect(draw, (12, 7, 13, 7), ARCANE["base"])

    # Reassert near forelegs above the barding.
    rect(draw, (7, 17, 9, 21), COAT["base"])
    rect(draw, (15, 17, 17, 21), COAT["base"])
    rect(draw, (7, 20, 9, 21), OUTLINE)
    rect(draw, (15, 20, 17, 21), OUTLINE)
    rect(draw, (8, 18, 8, 19), COAT["highlight"])
    rect(draw, (16, 18, 16, 19), COAT["highlight"])

    return image


def pixels_from_image(image: Image.Image) -> list[str | None]:
    return [
        f"#{red:02x}{green:02x}{blue:02x}" if alpha else None
        for red, green, blue, alpha in image.get_flattened_data()
    ]


def image_from_pixels(width: int, height: int, pixels: list[str | None]) -> Image.Image:
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    rgba_pixels = []
    for color in pixels:
        if color is None:
            rgba_pixels.append((0, 0, 0, 0))
        else:
            rgba_pixels.append(
                (int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16), 255)
            )
    image.putdata(rgba_pixels)
    return image


def treatment_ramps() -> list[dict[str, str]]:
    return [
        {"id": name, **ramp}
        for name, ramp in [
            ("coat", COAT),
            ("mane", MANE),
            ("horn", HORN),
            ("armor", ARMOR),
            ("arcane", ARCANE),
        ]
    ]


def treat(source: Image.Image, prefix: str) -> Image.Image:
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    input_path = ROOT / f"{prefix}-source.json"
    treated_path = ROOT / f"{prefix}-treated.json"
    input_path.write_text(
        json.dumps(
            {
                "width": LOGICAL_SIZE,
                "height": LOGICAL_SIZE,
                "pixels": pixels_from_image(source),
                "ramps": treatment_ramps(),
            }
        ),
        encoding="utf-8",
    )
    subprocess.run(
        ["node", str(ROOT / "apply_engine_treatment.mjs"), str(input_path), str(treated_path)],
        check=True,
        cwd=ROOT,
    )
    treated = json.loads(treated_path.read_text(encoding="utf-8"))
    return image_from_pixels(treated["width"], treated["height"], treated["pixels"])


def validate(frame: Image.Image, label: str) -> tuple[int, int, int, int]:
    alpha_values = set(frame.getchannel("A").get_flattened_data())
    if not alpha_values <= {0, 255}:
        raise ValueError(f"{label} contains intermediate alpha: {sorted(alpha_values)}")
    bounds = frame.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"{label} lacks a two-pixel safety border: {bounds}")
    return bounds


def main() -> None:
    logical = treat(logical_source(), f"{SLUG}-style-v1")
    pilot = logical.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.NEAREST)
    bounds = validate(pilot, DISPLAY_NAME)
    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / f"{SLUG}-style-v1.png"
    pilot.save(output, optimize=False)
    (ROOT / f"{SLUG}-style-v1-manifest.json").write_text(
        json.dumps(
            {
                "file": output.name,
                "width": OUTPUT_SIZE,
                "height": OUTPUT_SIZE,
                "logicalGrid": LOGICAL_SIZE,
                "bounds": list(bounds),
                "opaqueColors": len(colors),
                "hardAlpha": True,
                "reviewStatus": "candidate",
                "treatment": "24px logical Form + Complete B, nearest-neighbor 2x",
                "integrated": False,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
