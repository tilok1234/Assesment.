from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"
RED = "#e83a3a"

BONE = {
    "base": "#e9e4d0",
    "shadow": "#b3ab90",
    "highlight": "#e6ecf4",
}
METAL = {
    "base": "#b9c2cf",
    "shadow": "#7e8a9c",
    "highlight": "#d8e0e8",
}
GOLD = {
    "base": "#e8b93e",
    "shadow": "#a36f25",
    "highlight": "#f4d166",
}
WOOD = {
    "base": "#8a5a33",
    "shadow": "#633f1f",
    "highlight": "#a87447",
}
CLOTH = {
    "base": "#34364e",
    "shadow": "#24263a",
    "highlight": "#4b4e69",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Ceremonial axe behind the left shoulder.
    rect(d, (3, 7, 4, 21), WOOD["shadow"])
    rect(d, (4, 8, 4, 20), WOOD["base"])
    poly(d, [(2, 5), (4, 3), (7, 4), (7, 7), (5, 9), (2, 8)], METAL["base"])
    rect(d, (3, 5, 5, 6), METAL["highlight"])
    rect(d, (2, 7, 4, 8), METAL["shadow"])

    # Rear cloak and broad royal silhouette.
    poly(d, [(7, 8), (16, 8), (20, 12), (20, 20), (17, 21), (6, 21), (4, 19), (4, 12)], CLOTH["base"])
    rect(d, (5, 13, 7, 20), CLOTH["shadow"])
    rect(d, (17, 13, 19, 20), CLOTH["shadow"])
    rect(d, (6, 10, 8, 12), CLOTH["highlight"])
    rect(d, (15, 10, 17, 12), CLOTH["highlight"])

    # Lantern/reliquary on the right, kept in the roster's gold-red language.
    rect(d, (19, 12, 20, 19), WOOD["base"])
    rect(d, (18, 15, 21, 20), GOLD["shadow"])
    rect(d, (19, 14, 20, 15), GOLD["highlight"])
    rect(d, (19, 16, 20, 18), RED)
    rect(d, (18, 19, 21, 20), WOOD["shadow"])

    # Robe, feet, and central armored body.
    rect(d, (7, 16, 10, 21), CLOTH["shadow"])
    rect(d, (13, 16, 16, 21), CLOTH["shadow"])
    rect(d, (6, 20, 10, 21), METAL["shadow"])
    rect(d, (13, 20, 17, 21), METAL["shadow"])
    poly(d, [(7, 10), (16, 10), (18, 15), (16, 19), (7, 19), (5, 15)], METAL["base"])
    rect(d, (7, 11, 16, 12), METAL["highlight"])
    rect(d, (6, 16, 17, 18), METAL["shadow"])

    # Rib cage remains iconic but sparse.
    rect(d, (9, 11, 14, 18), BONE["base"])
    rect(d, (10, 12, 13, 13), BONE["highlight"])
    rect(d, (8, 13, 15, 13), OUTLINE)
    rect(d, (9, 16, 14, 16), OUTLINE)
    rect(d, (11, 11, 12, 18), OUTLINE)
    rect(d, (9, 14, 10, 15), BONE["shadow"])
    rect(d, (13, 14, 14, 15), BONE["shadow"])
    rect(d, (10, 18, 13, 19), GOLD["shadow"])
    rect(d, (11, 18, 12, 18), RED)

    # Skull and jaw.
    poly(d, [(7, 4), (9, 3), (14, 3), (16, 5), (16, 9), (14, 12), (9, 12), (7, 9)], BONE["base"])
    rect(d, (8, 4, 14, 5), BONE["highlight"])
    rect(d, (8, 9, 15, 10), BONE["shadow"])
    rect(d, (8, 6, 10, 7), OUTLINE)
    rect(d, (13, 6, 15, 7), OUTLINE)
    rect(d, (9, 6, 9, 6), RED)
    rect(d, (14, 6, 14, 6), RED)
    rect(d, (11, 8, 12, 8), OUTLINE)
    rect(d, (9, 10, 14, 10), OUTLINE)
    rect(d, (10, 10, 10, 11), BONE["highlight"])
    rect(d, (12, 10, 12, 11), BONE["highlight"])
    rect(d, (14, 10, 14, 11), BONE["highlight"])

    # Larger three-prong crown, preserving the current gold/red crown read.
    rect(d, (7, 3, 16, 4), GOLD["base"])
    rect(d, (8, 3, 9, 4), GOLD["highlight"])
    rect(d, (11, 2, 12, 4), GOLD["highlight"])
    rect(d, (14, 3, 15, 4), GOLD["highlight"])
    rect(d, (11, 3, 12, 4), RED)
    rect(d, (7, 4, 16, 4), GOLD["shadow"])

    # Minimal component seams and hand bones.
    rect(d, (5, 12, 6, 15), OUTLINE)
    rect(d, (17, 12, 18, 15), OUTLINE)
    rect(d, (5, 14, 6, 16), BONE["base"])
    rect(d, (17, 14, 18, 16), BONE["base"])
    rect(d, (7, 20, 7, 21), OUTLINE)
    rect(d, (9, 20, 9, 21), OUTLINE)
    rect(d, (14, 20, 14, 21), OUTLINE)
    rect(d, (16, 20, 16, 21), OUTLINE)

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
    source.save(ROOT / "bone-reliquary-king-style-v2-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
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
    input_path = ROOT / "bone-reliquary-king-style-v2-source.json"
    treated_path = ROOT / "bone-reliquary-king-style-v2-treated.json"
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
        raise ValueError(f"Bone King contains intermediate alpha: {sorted(alpha_values)}")

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"Bone King lacks a two-pixel scaled safety border: {bounds}")

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "bone-reliquary-king-style-v2.png"
    pilot.save(output, optimize=False)
    (ROOT / "bone-king-style-v2-manifest.json").write_text(
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
