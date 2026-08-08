from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"
BEAK = "#e8b93e"
EYE = "#2e2e38"

FUR = {
    "base": "#b97934",
    "shadow": "#754526",
    "highlight": "#d69a4a",
}
FEATHER = {
    "base": "#e5d5aa",
    "shadow": "#9d8058",
    "highlight": "#f4ead2",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # One raised rear wing makes the eagle half readable as a single large plane.
    poly(
        d,
        [(7, 16), (5, 14), (5, 11), (4, 9), (5, 6), (7, 7), (7, 4),
         (9, 5), (10, 2), (12, 4), (14, 3), (15, 6), (15, 9),
         (13, 14), (11, 16)],
        FEATHER["base"],
    )
    poly(
        d,
        [(5, 9), (8, 8), (13, 7), (14, 9), (12, 11), (8, 11), (5, 12)],
        FEATHER["shadow"],
    )
    poly(
        d,
        [(6, 12), (9, 11), (13, 11), (12, 14), (9, 15), (6, 14)],
        FEATHER["shadow"],
    )
    rect(d, (7, 6, 9, 6), FEATHER["highlight"])
    rect(d, (10, 4, 11, 5), FEATHER["highlight"])
    rect(d, (13, 5, 14, 6), FEATHER["highlight"])

    # A quiet horizontal lion torso anchors the winged silhouette.
    poly(
        d,
        [(8, 12), (11, 10), (15, 10), (18, 13), (18, 16),
         (16, 19), (11, 19), (7, 17), (6, 14)],
        FUR["base"],
    )
    rect(d, (8, 12, 11, 16), FUR["highlight"])
    poly(d, [(8, 16), (17, 16), (16, 19), (10, 19), (7, 17)], FUR["shadow"])
    poly(d, [(7, 13), (10, 11), (14, 11), (14, 12), (10, 12), (7, 15)], OUTLINE)
    rect(d, (8, 13, 12, 15), FUR["base"])

    # Two separated lion legs establish a stable ground-game stance.
    poly(d, [(8, 16), (11, 17), (10, 21), (7, 21), (7, 18)], FUR["base"])
    poly(d, [(15, 16), (18, 16), (18, 21), (15, 21), (14, 18)], FUR["base"])
    rect(d, (7, 18, 8, 20), FUR["highlight"])
    rect(d, (17, 18, 18, 20), FUR["shadow"])
    rect(d, (7, 20, 10, 21), OUTLINE)
    rect(d, (15, 20, 18, 21), OUTLINE)
    rect(d, (9, 20, 9, 20), BEAK)
    rect(d, (17, 20, 17, 20), BEAK)

    # Curled lion tail and dark tuft remain separate from the raised wing.
    poly(
        d,
        [(7, 14), (5, 14), (3, 15), (2, 17), (3, 19), (5, 19),
         (5, 17), (4, 17), (5, 16), (7, 17)],
        FUR["shadow"],
    )
    poly(d, [(2, 17), (3, 16), (5, 17), (5, 19), (3, 20), (2, 19)], FUR["highlight"])
    rect(d, (2, 18, 3, 19), OUTLINE)

    # White eagle neck bridges the lion body to a strongly projecting profile.
    poly(
        d,
        [(13, 10), (14, 7), (16, 5), (19, 5), (20, 7),
         (20, 10), (18, 13), (15, 14), (13, 12)],
        FEATHER["base"],
    )
    poly(d, [(14, 8), (16, 5), (18, 5), (17, 8), (15, 10)], FEATHER["highlight"])
    poly(d, [(15, 11), (20, 9), (19, 12), (17, 14), (14, 13)], FEATHER["shadow"])

    # Crest, single eye, and hooked beak give the focal area a clean profile read.
    poly(d, [(15, 6), (16, 3), (17, 5), (19, 3), (19, 6)], FEATHER["base"])
    rect(d, (17, 7, 17, 7), EYE)
    rect(d, (18, 7, 18, 7), FEATHER["highlight"])
    poly(d, [(19, 8), (21, 8), (20, 10), (18, 10)], BEAK)
    rect(d, (20, 9, 20, 9), FUR["shadow"])

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
    source.save(ROOT / "sun-crown-griffin-style-v3-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("fur", FUR),
                ("feather", FEATHER),
            ]
        ],
    }
    input_path = ROOT / "sun-crown-griffin-style-v3-source.json"
    treated_path = ROOT / "sun-crown-griffin-style-v3-treated.json"
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
            f"Sun-Crown Griffin v3 contains intermediate alpha: {sorted(alpha_values)}"
        )

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(
            f"Sun-Crown Griffin v3 lacks a two-pixel scaled safety border: {bounds}"
        )

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "sun-crown-griffin-style-v3.png"
    pilot.save(output, optimize=False)
    (ROOT / "sun-crown-griffin-style-v3-manifest.json").write_text(
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
