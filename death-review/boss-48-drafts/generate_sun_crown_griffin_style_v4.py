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

    # Wings sit below the head and angle down, avoiding the old crown/owl read.
    poly(
        d,
        [(9, 9), (7, 7), (4, 7), (2, 9), (3, 12), (2, 14),
         (4, 16), (3, 18), (6, 18), (8, 16), (9, 13)],
        FEATHER["base"],
    )
    poly(
        d,
        [(15, 9), (17, 7), (20, 7), (21, 9), (20, 12), (21, 14),
         (19, 16), (20, 18), (17, 18), (16, 16), (15, 13)],
        FEATHER["base"],
    )

    # Two broad feather tiers read as wings without small checkerboard detail.
    poly(d, [(3, 9), (7, 9), (9, 11), (8, 13), (4, 12)], FEATHER["shadow"])
    poly(d, [(20, 9), (17, 9), (15, 11), (16, 13), (20, 12)], FEATHER["shadow"])
    poly(d, [(3, 14), (6, 13), (8, 14), (7, 17), (4, 17)], FEATHER["shadow"])
    poly(d, [(20, 14), (18, 13), (16, 14), (17, 17), (20, 17)], FEATHER["shadow"])
    rect(d, (4, 7, 6, 7), FEATHER["highlight"])
    rect(d, (18, 7, 20, 7), FEATHER["highlight"])

    # Quiet lion torso and belly form one solid grounded mass.
    poly(
        d,
        [(8, 11), (11, 10), (13, 10), (16, 11), (18, 14),
         (17, 19), (15, 21), (9, 21), (7, 19), (6, 14)],
        FUR["base"],
    )
    rect(d, (7, 13, 9, 18), FUR["highlight"])
    rect(d, (15, 13, 17, 18), FUR["shadow"])
    poly(d, [(8, 17), (16, 17), (15, 21), (9, 21)], FUR["shadow"])

    # Front paws are separated by dark channels and use only tiny claw accents.
    poly(d, [(7, 15), (10, 15), (10, 21), (7, 21)], FUR["base"])
    poly(d, [(14, 15), (17, 15), (17, 21), (14, 21)], FUR["base"])
    rect(d, (10, 17, 10, 20), OUTLINE)
    rect(d, (14, 17, 14, 20), OUTLINE)
    rect(d, (7, 20, 10, 21), OUTLINE)
    rect(d, (14, 20, 17, 21), OUTLINE)
    rect(d, (8, 20, 8, 20), BEAK)
    rect(d, (16, 20, 16, 20), BEAK)

    # White neck is a single taper between the lion body and eagle head.
    poly(
        d,
        [(10, 10), (14, 10), (15, 13), (14, 16), (12, 17),
         (10, 16), (9, 13)],
        FEATHER["base"],
    )
    rect(d, (10, 12, 11, 15), FEATHER["highlight"])
    rect(d, (13, 12, 14, 15), FEATHER["shadow"])

    # Large head sits clearly above both wing shoulders.
    poly(
        d,
        [(9, 6), (10, 4), (11, 3), (12, 2), (13, 3), (15, 4),
         (16, 6), (16, 9), (14, 12), (10, 12), (8, 9), (8, 7)],
        FEATHER["base"],
    )
    poly(d, [(9, 6), (11, 4), (13, 4), (15, 6), (14, 7), (10, 7)], FEATHER["highlight"])
    poly(d, [(8, 8), (10, 7), (14, 7), (16, 8), (15, 10), (9, 10)], FEATHER["shadow"])
    poly(d, [(9, 9), (7, 10), (9, 12), (11, 11)], FEATHER["base"])
    poly(d, [(15, 9), (17, 10), (15, 12), (13, 11)], FEATHER["base"])

    # Two single-pixel eyes and one oversized hooked beak are the only face detail.
    rect(d, (10, 8, 10, 8), EYE)
    rect(d, (14, 8, 14, 8), EYE)
    poly(d, [(10, 9), (14, 9), (15, 10), (12, 13), (9, 10)], BEAK)
    rect(d, (11, 9, 13, 9), FEATHER["highlight"])
    rect(d, (12, 12, 12, 12), FUR["shadow"])

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
    source.save(ROOT / "sun-crown-griffin-style-v4-source-24.png", optimize=False)

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
    input_path = ROOT / "sun-crown-griffin-style-v4-source.json"
    treated_path = ROOT / "sun-crown-griffin-style-v4-treated.json"
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
            f"Sun-Crown Griffin v4 contains intermediate alpha: {sorted(alpha_values)}"
        )

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(
            f"Sun-Crown Griffin v4 lacks a two-pixel scaled safety border: {bounds}"
        )

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "sun-crown-griffin-style-v4.png"
    pilot.save(output, optimize=False)
    (ROOT / "sun-crown-griffin-style-v4-manifest.json").write_text(
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
