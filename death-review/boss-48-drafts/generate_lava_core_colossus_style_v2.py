from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"

STONE = {
    "base": "#4a4a52",
    "shadow": "#33333f",
    "highlight": "#6e6e78",
}
MAGMA = {
    "base": "#e8663a",
    "shadow": "#b03a1e",
    "highlight": "#f7b03e",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Irregular rear shoulders create the boss-scale boulder silhouette.
    poly(d, [(8, 7), (6, 4), (3, 3), (2, 6), (3, 11), (6, 13), (9, 11)], STONE["base"])
    poly(d, [(15, 7), (17, 5), (20, 3), (21, 6), (20, 11), (18, 13), (15, 11)], STONE["base"])
    rect(d, (3, 5, 5, 8), STONE["highlight"])
    rect(d, (18, 5, 20, 8), STONE["highlight"])
    rect(d, (2, 9, 5, 11), STONE["shadow"])
    rect(d, (19, 9, 21, 11), STONE["shadow"])
    rect(d, (5, 8, 7, 10), OUTLINE)
    rect(d, (17, 8, 19, 10), OUTLINE)

    # Oversized arms and fists hang as separate rock columns.
    poly(d, [(5, 9), (8, 12), (7, 18), (5, 21), (2, 19), (2, 13)], STONE["base"])
    poly(d, [(18, 9), (21, 12), (21, 19), (18, 21), (16, 18), (16, 12)], STONE["base"])
    rect(d, (2, 14, 4, 18), STONE["highlight"])
    rect(d, (19, 13, 21, 17), STONE["highlight"])
    rect(d, (3, 18, 6, 21), STONE["shadow"])
    rect(d, (18, 18, 21, 21), STONE["shadow"])
    rect(d, (3, 19, 4, 20), OUTLINE)
    rect(d, (19, 19, 20, 20), OUTLINE)

    # Large central torso with broad, quiet stone planes.
    poly(d, [(8, 7), (15, 7), (18, 11), (18, 18), (16, 21), (7, 21), (5, 18), (5, 11)], STONE["base"])
    rect(d, (6, 10, 8, 17), STONE["shadow"])
    rect(d, (15, 10, 17, 17), STONE["shadow"])
    rect(d, (8, 8, 15, 10), STONE["highlight"])
    poly(d, [(7, 17), (17, 17), (16, 21), (7, 21)], STONE["shadow"])

    # Integrated golem head sits high enough to remain distinct from the core.
    poly(d, [(8, 5), (10, 3), (14, 3), (16, 5), (16, 11), (14, 13), (9, 13), (7, 10), (7, 7)], STONE["base"])
    rect(d, (9, 4, 14, 5), STONE["highlight"])
    rect(d, (8, 9, 15, 12), STONE["shadow"])
    rect(d, (9, 7, 10, 8), MAGMA["highlight"])
    rect(d, (14, 7, 15, 8), MAGMA["highlight"])
    rect(d, (10, 10, 14, 10), OUTLINE)
    rect(d, (11, 11, 13, 11), STONE["highlight"])

    # Molten chest core is the single primary focal region.
    rect(d, (8, 12, 16, 18), OUTLINE)
    poly(d, [(9, 13), (15, 13), (16, 15), (15, 18), (9, 18), (8, 15)], MAGMA["shadow"])
    rect(d, (10, 14, 14, 17), MAGMA["base"])
    rect(d, (11, 14, 13, 15), MAGMA["highlight"])
    rect(d, (12, 16, 14, 17), MAGMA["shadow"])

    # Planted feet and sparse cracks preserve the simple family language.
    rect(d, (7, 19, 10, 21), STONE["shadow"])
    rect(d, (13, 19, 16, 21), STONE["shadow"])
    rect(d, (6, 20, 10, 21), OUTLINE)
    rect(d, (13, 20, 17, 21), OUTLINE)
    rect(d, (6, 12, 6, 14), MAGMA["base"])
    rect(d, (5, 14, 6, 14), MAGMA["highlight"])
    rect(d, (17, 11, 17, 13), MAGMA["shadow"])
    rect(d, (16, 13, 17, 13), MAGMA["base"])
    rect(d, (8, 18, 8, 19), MAGMA["shadow"])
    rect(d, (15, 18, 15, 19), MAGMA["base"])

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
    source.save(ROOT / "lava-core-colossus-style-v2-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("stone", STONE),
                ("magma", MAGMA),
            ]
        ],
    }
    input_path = ROOT / "lava-core-colossus-style-v2-source.json"
    treated_path = ROOT / "lava-core-colossus-style-v2-treated.json"
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
        raise ValueError(f"Lava-Core Colossus contains intermediate alpha: {sorted(alpha_values)}")

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"Lava-Core Colossus lacks a two-pixel scaled safety border: {bounds}")

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "lava-core-colossus-style-v2.png"
    pilot.save(output, optimize=False)
    (ROOT / "lava-core-colossus-style-v2-manifest.json").write_text(
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
