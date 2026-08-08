from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"

SKIN = {
    "base": "#9a8f7a",
    "shadow": "#6f6552",
    "highlight": "#c7bca8",
}
METAL = {
    "base": "#b9c2cf",
    "shadow": "#7e8a9c",
    "highlight": "#e6ecf4",
}
ROYAL = {
    "base": "#4a4f5c",
    "shadow": "#303441",
    "highlight": "#68717d",
}
WOOD = {
    "base": "#6e492c",
    "shadow": "#4a3524",
    "highlight": "#8a5a33",
}
EMBER = {
    "base": "#ef6730",
    "shadow": "#b7492e",
    "highlight": "#ffc13f",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Massive forge hammer behind the left shoulder. The head and handle remain
    # one uninterrupted silhouette so the role reads before the armor details.
    rect(d, (4, 7, 5, 21), WOOD["shadow"])
    rect(d, (5, 8, 6, 20), WOOD["base"])
    poly(d, [(2, 4), (4, 2), (9, 3), (10, 5), (8, 8), (3, 8), (2, 7)], ROYAL["base"])
    rect(d, (3, 3, 8, 4), METAL["base"])
    rect(d, (2, 6, 8, 8), ROYAL["shadow"])
    rect(d, (4, 5, 7, 5), METAL["shadow"])

    # Rear armor and planted legs establish a tall, broad giant silhouette.
    poly(
        d,
        [(8, 8), (17, 8), (20, 11), (21, 16), (20, 20),
         (17, 21), (8, 21), (6, 19), (6, 12)],
        ROYAL["base"],
    )
    rect(d, (7, 12, 8, 19), ROYAL["shadow"])
    rect(d, (18, 12, 20, 19), ROYAL["shadow"])
    rect(d, (8, 19, 11, 21), ROYAL["shadow"])
    rect(d, (14, 19, 18, 21), ROYAL["shadow"])
    rect(d, (7, 20, 11, 21), METAL["shadow"])
    rect(d, (14, 20, 18, 21), METAL["shadow"])

    # Oversized right arm and fist keep the non-hammer side equally weighty.
    poly(d, [(17, 10), (20, 11), (21, 15), (20, 18), (17, 17), (16, 13)], SKIN["base"])
    rect(d, (18, 11, 20, 13), SKIN["highlight"])
    rect(d, (18, 16, 21, 19), SKIN["shadow"])
    rect(d, (19, 17, 20, 18), SKIN["base"])
    rect(d, (17, 15, 20, 16), METAL["shadow"])

    # Left arm wraps around the hammer handle instead of disappearing behind it.
    poly(d, [(8, 11), (6, 12), (6, 17), (8, 19), (10, 16), (10, 12)], SKIN["base"])
    rect(d, (6, 14, 8, 18), SKIN["shadow"])
    rect(d, (5, 15, 7, 17), SKIN["highlight"])
    rect(d, (6, 18, 9, 19), METAL["shadow"])

    # Broad plate torso with a small furnace-core secondary accent.
    poly(d, [(9, 10), (17, 10), (19, 14), (18, 19), (8, 19), (7, 14)], METAL["base"])
    rect(d, (9, 11, 17, 12), METAL["highlight"])
    rect(d, (8, 16, 18, 19), METAL["shadow"])
    rect(d, (10, 13, 16, 18), ROYAL["shadow"])
    rect(d, (11, 14, 15, 17), EMBER["shadow"])
    rect(d, (12, 15, 14, 17), EMBER["base"])
    rect(d, (13, 15, 13, 15), EMBER["highlight"])
    rect(d, (10, 13, 16, 13), OUTLINE)
    rect(d, (10, 18, 16, 18), OUTLINE)

    # Bald cyclops head. The eye is deliberately large, high-contrast, and
    # horizontally isolated from the chest core.
    poly(d, [(9, 5), (11, 3), (16, 3), (18, 5), (18, 10), (16, 13), (10, 13), (8, 10), (8, 7)], SKIN["base"])
    rect(d, (10, 4, 16, 5), SKIN["highlight"])
    rect(d, (9, 9, 17, 11), SKIN["shadow"])
    rect(d, (10, 6, 16, 8), METAL["highlight"])
    rect(d, (11, 6, 15, 8), "#f4f4f4")
    rect(d, (12, 6, 14, 8), EMBER["highlight"])
    rect(d, (13, 7, 13, 8), OUTLINE)
    rect(d, (11, 11, 15, 11), OUTLINE)
    rect(d, (12, 12, 14, 12), SKIN["highlight"])

    # Forge brow, shoulder plates, and sparse rivets.
    rect(d, (9, 4, 17, 4), ROYAL["shadow"])
    rect(d, (8, 9, 10, 12), METAL["shadow"])
    rect(d, (16, 9, 18, 12), METAL["shadow"])
    rect(d, (8, 9, 10, 9), METAL["highlight"])
    rect(d, (16, 9, 18, 9), METAL["highlight"])
    rect(d, (8, 12, 8, 12), EMBER["base"])
    rect(d, (18, 12, 18, 12), EMBER["base"])
    rect(d, (9, 19, 9, 20), OUTLINE)
    rect(d, (11, 19, 11, 20), OUTLINE)
    rect(d, (15, 19, 15, 20), OUTLINE)
    rect(d, (17, 19, 17, 20), OUTLINE)

    return image


def pixels_from_image(image: Image.Image) -> list[str | None]:
    return [
        f"#{red:02x}{green:02x}{blue:02x}" if alpha else None
        for red, green, blue, alpha in image.get_flattened_data()
    ]


def image_from_pixels(width: int, height: int, pixels: list[str | None]) -> Image.Image:
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    rgba = []
    for color in pixels:
        if color is None:
            rgba.append((0, 0, 0, 0))
        else:
            rgba.append(
                (
                    int(color[1:3], 16),
                    int(color[3:5], 16),
                    int(color[5:7], 16),
                    255,
                )
            )
    image.putdata(rgba)
    return image


def main() -> None:
    source = logical_source()
    source.save(ROOT / "cyclops-forge-titan-style-v2-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("skin", SKIN),
                ("metal", METAL),
                ("royal", ROYAL),
                ("wood", WOOD),
                ("ember", EMBER),
            ]
        ],
    }
    input_path = ROOT / "cyclops-forge-titan-style-v2-source.json"
    treated_path = ROOT / "cyclops-forge-titan-style-v2-treated.json"
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
    logical = image_from_pixels(
        treated["width"],
        treated["height"],
        treated["pixels"],
    )
    pilot = logical.resize(
        (OUTPUT_SIZE, OUTPUT_SIZE),
        Image.Resampling.NEAREST,
    )
    alpha_values = set(pilot.getchannel("A").get_flattened_data())
    if not alpha_values <= {0, 255}:
        raise ValueError(f"Forge-Titan contains intermediate alpha: {sorted(alpha_values)}")

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"Forge-Titan lacks a two-pixel scaled safety border: {bounds}")

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "cyclops-forge-titan-style-v2.png"
    pilot.save(output, optimize=False)
    (ROOT / "cyclops-forge-titan-style-v2-manifest.json").write_text(
        json.dumps(
            {
                "file": output.name,
                "width": OUTPUT_SIZE,
                "height": OUTPUT_SIZE,
                "logicalGrid": LOGICAL_SIZE,
                "bounds": list(bounds),
                "opaqueColors": len(colors),
                "hardAlpha": True,
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
