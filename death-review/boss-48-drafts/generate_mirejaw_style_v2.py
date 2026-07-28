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
    "base": "#375f48",
    "shadow": "#213d30",
    "highlight": "#628165",
}
BELLY = {
    "base": "#80966c",
    "shadow": "#55684f",
    "highlight": "#a7b98f",
}
STONE = {
    "base": "#5e6e69",
    "shadow": "#3b4a47",
    "highlight": "#83918a",
}
MOSS = "#b6d54a"
EYE = "#c9f29b"
BONE = "#dce3c6"


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Rear tail, feet, and body mass.
    poly(d, [(17, 13), (20, 11), (21, 12), (20, 14), (21, 16), (18, 18), (16, 17)], SKIN["shadow"])
    rect(d, (6, 17, 9, 21), SKIN["shadow"])
    rect(d, (14, 17, 17, 21), SKIN["shadow"])
    rect(d, (5, 20, 10, 21), STONE["shadow"])
    rect(d, (13, 20, 18, 21), STONE["shadow"])
    poly(d, [(6, 10), (17, 10), (19, 14), (18, 19), (15, 20), (8, 20), (5, 18), (4, 14)], SKIN["base"])
    rect(d, (5, 14, 6, 18), SKIN["shadow"])
    rect(d, (17, 14, 18, 18), SKIN["shadow"])

    # Chunky arms and simple claw accents.
    poly(d, [(5, 11), (3, 12), (2, 15), (3, 18), (5, 18), (7, 16), (7, 12)], SKIN["base"])
    poly(d, [(18, 11), (20, 12), (21, 15), (20, 18), (18, 18), (16, 16), (16, 12)], SKIN["base"])
    rect(d, (2, 13, 3, 16), SKIN["highlight"])
    rect(d, (20, 13, 21, 16), SKIN["highlight"])
    rect(d, (2, 17, 3, 18), BONE)
    rect(d, (4, 17, 5, 18), BELLY["shadow"])
    rect(d, (20, 17, 21, 18), BONE)
    rect(d, (18, 17, 19, 18), BELLY["shadow"])

    # Restrained belly panel, matching the existing enemy's simple torso read.
    poly(d, [(8, 11), (15, 11), (16, 18), (14, 20), (9, 20), (7, 18)], BELLY["base"])
    rect(d, (9, 12, 14, 13), BELLY["highlight"])
    rect(d, (8, 17, 15, 19), BELLY["shadow"])
    rect(d, (11, 12, 12, 19), OUTLINE)
    rect(d, (8, 15, 15, 15), OUTLINE)

    # Small ancient shoulder plates instead of a separate armor language.
    poly(d, [(4, 11), (4, 8), (6, 6), (8, 7), (8, 12)], STONE["base"])
    poly(d, [(19, 11), (19, 8), (17, 6), (15, 7), (15, 12)], STONE["base"])
    rect(d, (5, 7, 6, 8), STONE["highlight"])
    rect(d, (17, 7, 18, 8), STONE["highlight"])
    rect(d, (4, 10, 6, 11), STONE["shadow"])
    rect(d, (17, 10, 19, 11), STONE["shadow"])
    rect(d, (6, 6, 7, 6), MOSS)
    rect(d, (16, 6, 17, 6), MOSS)

    # Broad canonical down-facing crocodile head.
    poly(
        d,
        [(6, 4), (9, 3), (11, 4), (13, 3), (17, 4), (19, 6), (20, 9),
         (19, 12), (16, 13), (7, 13), (4, 11), (3, 8), (4, 6)],
        SKIN["base"],
    )
    rect(d, (4, 8, 5, 10), SKIN["shadow"])
    rect(d, (18, 7, 19, 10), SKIN["shadow"])
    rect(d, (6, 4, 9, 5), SKIN["highlight"])
    rect(d, (14, 4, 17, 5), SKIN["highlight"])

    # Three-pixel ancient crown, derived from the current family spikes.
    poly(d, [(7, 5), (8, 2), (10, 4), (12, 2), (14, 4), (16, 2), (17, 6)], STONE["base"])
    rect(d, (8, 2, 8, 4), STONE["highlight"])
    rect(d, (12, 2, 12, 4), STONE["highlight"])
    rect(d, (15, 3, 15, 5), STONE["shadow"])
    rect(d, (9, 4, 10, 4), MOSS)
    rect(d, (13, 4, 14, 4), MOSS)

    # Familiar face: two bright eyes, tiny nostrils, flat muzzle, two tusks.
    rect(d, (6, 7, 8, 8), OUTLINE)
    rect(d, (15, 7, 17, 8), OUTLINE)
    rect(d, (7, 7, 7, 7), EYE)
    rect(d, (16, 7, 16, 7), EYE)
    rect(d, (10, 9, 10, 9), OUTLINE)
    rect(d, (13, 9, 13, 9), OUTLINE)
    rect(d, (5, 10, 18, 10), OUTLINE)
    rect(d, (6, 11, 17, 12), BELLY["highlight"])
    rect(d, (8, 12, 9, 13), BONE)
    rect(d, (14, 12, 15, 13), BONE)
    rect(d, (10, 12, 13, 13), BELLY["base"])

    # Limb separation remains sparse, like the existing roster.
    rect(d, (6, 16, 7, 17), OUTLINE)
    rect(d, (16, 16, 17, 17), OUTLINE)
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
    source.save(ROOT / "ancient-mirejaw-style-v2-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("skin", SKIN),
                ("belly", BELLY),
                ("stone", STONE),
            ]
        ],
    }
    input_path = ROOT / "ancient-mirejaw-style-v2-source.json"
    treated_path = ROOT / "ancient-mirejaw-style-v2-treated.json"
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
        raise ValueError(f"v2 contains intermediate alpha: {sorted(alpha_values)}")

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"v2 lacks a two-pixel scaled safety border: {bounds}")

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "ancient-mirejaw-style-v2.png"
    pilot.save(output, optimize=False)
    (ROOT / "mirejaw-style-v2-manifest.json").write_text(
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
