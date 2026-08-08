from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"
INK = "#1f1c38"
EYE = "#c9f29b"

BODY = {
    "base": "#624b91",
    "shadow": "#382e5e",
    "highlight": "#9272b4",
}
GLOW = {
    "base": "#a57bd4",
    "shadow": "#7153a1",
    "highlight": "#d7c4f4",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Three uneven mantle spires establish the sea-crown silhouette.
    poly(d, [(7, 7), (6, 4), (7, 2), (9, 5), (10, 7)], BODY["shadow"])
    poly(d, [(9, 5), (11, 3), (12, 2), (14, 4), (14, 7)], BODY["base"])
    poly(d, [(14, 6), (16, 3), (18, 2), (17, 6), (16, 8)], BODY["shadow"])
    rect(d, (7, 3, 7, 4), BODY["highlight"])
    rect(d, (12, 2, 12, 3), BODY["highlight"])
    rect(d, (17, 3, 17, 4), BODY["highlight"])

    # Rear outer tentacles curl outward while preserving open negative space.
    poly(
        d,
        [(8, 12), (6, 13), (4, 14), (2, 16), (2, 19), (4, 21), (6, 21),
         (6, 19), (4, 19), (4, 17), (6, 16), (9, 16)],
        BODY["shadow"],
    )
    poly(
        d,
        [(16, 12), (18, 13), (20, 14), (21, 16), (21, 19), (19, 21), (17, 21),
         (17, 19), (19, 19), (19, 17), (17, 16), (15, 16)],
        BODY["shadow"],
    )
    rect(d, (3, 16, 4, 18), BODY["base"])
    rect(d, (19, 15, 20, 17), BODY["base"])
    rect(d, (4, 20, 5, 20), GLOW["shadow"])
    rect(d, (18, 20, 19, 20), GLOW["shadow"])

    # Four front tentacles form a readable radial base with dark channels.
    poly(d, [(9, 13), (7, 16), (7, 19), (6, 21), (9, 21), (10, 18), (11, 14)], BODY["base"])
    poly(d, [(11, 13), (10, 17), (10, 21), (12, 21), (13, 17), (13, 14)], BODY["highlight"])
    poly(d, [(13, 13), (13, 17), (12, 21), (15, 21), (16, 18), (15, 14)], BODY["base"])
    poly(d, [(15, 13), (16, 16), (16, 19), (15, 21), (18, 21), (18, 18), (17, 15)], BODY["highlight"])
    rect(d, (9, 16, 9, 20), OUTLINE)
    rect(d, (12, 17, 12, 20), OUTLINE)
    rect(d, (15, 17, 15, 20), OUTLINE)

    # Broad mantle sits over the tentacle roots like a single armored bell.
    poly(
        d,
        [(8, 5), (10, 3), (14, 3), (17, 5), (18, 8), (18, 12),
         (16, 15), (8, 15), (6, 12), (6, 8)],
        BODY["base"],
    )
    poly(d, [(7, 7), (9, 4), (12, 4), (11, 6), (8, 8), (8, 12), (7, 13), (6, 11)], BODY["highlight"])
    poly(d, [(15, 5), (17, 6), (18, 9), (17, 13), (15, 14), (15, 11)], BODY["shadow"])
    rect(d, (9, 4, 14, 4), BODY["highlight"])

    # Side fins widen the upper read without competing with the tentacles.
    poly(d, [(7, 8), (5, 7), (3, 9), (5, 12), (7, 11)], BODY["shadow"])
    poly(d, [(17, 8), (19, 7), (21, 9), (19, 12), (17, 11)], BODY["shadow"])
    rect(d, (4, 9, 5, 10), BODY["highlight"])
    rect(d, (19, 9, 20, 10), BODY["highlight"])

    # Recessed mask, luminous eyes, and a tiny beak create the face focal point.
    poly(d, [(8, 7), (10, 6), (15, 6), (17, 8), (16, 12), (14, 13), (10, 13), (8, 11)], INK)
    rect(d, (9, 8, 11, 9), EYE)
    rect(d, (14, 8, 16, 9), EYE)
    rect(d, (11, 9, 11, 9), BODY["shadow"])
    rect(d, (14, 9, 14, 9), BODY["shadow"])
    poly(d, [(11, 11), (13, 10), (15, 11), (13, 13)], GLOW["base"])
    rect(d, (12, 11, 14, 11), GLOW["highlight"])
    rect(d, (13, 12, 13, 12), OUTLINE)

    # Sparse crown glyphs and sucker lights carry the abyssal family language.
    rect(d, (9, 5, 10, 5), GLOW["shadow"])
    rect(d, (14, 5, 15, 5), GLOW["shadow"])
    rect(d, (7, 13, 8, 13), GLOW["base"])
    rect(d, (16, 13, 17, 13), GLOW["base"])
    rect(d, (7, 17, 7, 18), GLOW["highlight"])
    rect(d, (10, 18, 10, 19), GLOW["base"])
    rect(d, (14, 18, 14, 19), GLOW["base"])
    rect(d, (17, 17, 17, 18), GLOW["highlight"])

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
    source.save(ROOT / "abyssal-crown-kraken-style-v2-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("body", BODY),
                ("glow", GLOW),
            ]
        ],
    }
    input_path = ROOT / "abyssal-crown-kraken-style-v2-source.json"
    treated_path = ROOT / "abyssal-crown-kraken-style-v2-treated.json"
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
        raise ValueError(
            f"Abyssal Crown-Kraken contains intermediate alpha: {sorted(alpha_values)}"
        )

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(
            f"Abyssal Crown-Kraken lacks a two-pixel scaled safety border: {bounds}"
        )

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "abyssal-crown-kraken-style-v2.png"
    pilot.save(output, optimize=False)
    (ROOT / "abyssal-crown-kraken-style-v2-manifest.json").write_text(
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
