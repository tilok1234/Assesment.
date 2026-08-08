from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"

GOBLIN = {
    "base": "#6aa04a",
    "shadow": "#47752f",
    "highlight": "#8fc45b",
}
METAL = {
    "base": "#b9c2cf",
    "shadow": "#7e8a9c",
    "highlight": "#e6ecf4",
}
GOLD = {
    "base": "#e8b93e",
    "shadow": "#a36f25",
    "highlight": "#f4d166",
}
CRIMSON = {
    "base": "#b4363e",
    "shadow": "#7e2933",
    "highlight": "#e83a3a",
}
WOOD = {
    "base": "#8a5a33",
    "shadow": "#4a3524",
    "highlight": "#a87447",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Command banner behind the left shoulder. Its spear point and simple
    # swallow-tail keep it distinct from the goblin's crown and armor.
    rect(d, (3, 5, 4, 21), WOOD["shadow"])
    rect(d, (4, 6, 4, 20), WOOD["base"])
    poly(d, [(2, 5), (4, 2), (6, 5), (5, 6), (3, 6)], METAL["base"])
    rect(d, (3, 4, 4, 4), METAL["highlight"])
    poly(d, [(5, 6), (10, 6), (9, 9), (10, 12), (5, 11)], CRIMSON["base"])
    rect(d, (5, 7, 8, 8), CRIMSON["highlight"])
    poly(d, [(8, 9), (10, 9), (9, 11), (8, 10)], GOLD["base"])

    # Rear cloak and broad commander stance create boss-scale mass without
    # simply enlarging the ordinary goblin body.
    poly(d, [(7, 9), (16, 9), (19, 12), (20, 19), (17, 21), (6, 21), (4, 18), (5, 12)], CRIMSON["shadow"])
    rect(d, (5, 13, 7, 19), CRIMSON["base"])
    rect(d, (17, 13, 19, 19), CRIMSON["base"])
    rect(d, (7, 18, 10, 21), WOOD["shadow"])
    rect(d, (13, 18, 16, 21), WOOD["shadow"])
    rect(d, (6, 20, 10, 21), OUTLINE)
    rect(d, (13, 20, 17, 21), OUTLINE)

    # Compact royal shield on the right, kept lower than the face and crown.
    poly(d, [(17, 11), (21, 12), (21, 18), (19, 21), (16, 19), (16, 13)], CRIMSON["base"])
    rect(d, (17, 12, 18, 18), CRIMSON["highlight"])
    rect(d, (20, 13, 21, 18), CRIMSON["shadow"])
    rect(d, (17, 11, 20, 12), GOLD["shadow"])
    rect(d, (18, 14, 20, 17), GOLD["base"])
    rect(d, (19, 14, 19, 15), GOLD["highlight"])
    rect(d, (18, 17, 20, 18), GOLD["shadow"])

    # Silver plate body with wide pauldrons and a single gold belt clasp.
    poly(d, [(7, 10), (16, 10), (18, 14), (17, 19), (6, 19), (5, 14)], METAL["base"])
    rect(d, (7, 11, 16, 12), METAL["highlight"])
    rect(d, (6, 16, 17, 19), METAL["shadow"])
    rect(d, (5, 11, 8, 14), GOLD["shadow"])
    rect(d, (15, 11, 18, 14), GOLD["shadow"])
    rect(d, (6, 11, 8, 12), GOLD["base"])
    rect(d, (15, 11, 17, 12), GOLD["base"])
    rect(d, (8, 13, 15, 17), METAL["base"])
    rect(d, (9, 13, 14, 14), METAL["highlight"])
    rect(d, (8, 16, 15, 17), METAL["shadow"])
    rect(d, (10, 17, 13, 18), GOLD["shadow"])
    rect(d, (11, 17, 12, 17), GOLD["highlight"])

    # Broad goblin head, oversized ears, and a compact readable face.
    poly(d, [(7, 6), (9, 4), (15, 4), (17, 6), (17, 11), (15, 13), (9, 13), (7, 11)], GOBLIN["base"])
    poly(d, [(8, 7), (5, 5), (5, 9), (8, 11)], GOBLIN["base"])
    poly(d, [(16, 7), (19, 5), (19, 9), (16, 11)], GOBLIN["base"])
    rect(d, (5, 7, 6, 9), GOBLIN["highlight"])
    rect(d, (18, 7, 19, 9), GOBLIN["highlight"])
    rect(d, (8, 10, 16, 12), GOBLIN["shadow"])
    rect(d, (9, 7, 11, 8), METAL["highlight"])
    rect(d, (14, 7, 16, 8), METAL["highlight"])
    rect(d, (10, 7, 10, 8), OUTLINE)
    rect(d, (15, 7, 15, 8), OUTLINE)
    rect(d, (11, 9, 13, 10), GOBLIN["highlight"])
    rect(d, (11, 11, 14, 11), OUTLINE)
    rect(d, (12, 12, 13, 12), METAL["highlight"])

    # Large three-prong crown is the primary silhouette and color focal point.
    rect(d, (7, 4, 17, 5), GOLD["base"])
    rect(d, (8, 3, 9, 5), GOLD["highlight"])
    rect(d, (11, 2, 13, 5), GOLD["highlight"])
    rect(d, (15, 3, 16, 5), GOLD["highlight"])
    rect(d, (11, 4, 13, 5), CRIMSON["base"])
    rect(d, (12, 4, 12, 4), CRIMSON["highlight"])
    rect(d, (7, 5, 17, 5), GOLD["shadow"])

    # Sparse internal seams preserve broad material planes.
    rect(d, (6, 14, 7, 16), OUTLINE)
    rect(d, (16, 14, 17, 16), OUTLINE)
    rect(d, (9, 18, 9, 19), OUTLINE)
    rect(d, (11, 18, 11, 19), OUTLINE)
    rect(d, (14, 18, 14, 19), OUTLINE)
    rect(d, (16, 18, 16, 19), OUTLINE)

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
    source.save(ROOT / "goblin-war-crown-style-v2-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("goblin", GOBLIN),
                ("metal", METAL),
                ("gold", GOLD),
                ("crimson", CRIMSON),
                ("wood", WOOD),
            ]
        ],
    }
    input_path = ROOT / "goblin-war-crown-style-v2-source.json"
    treated_path = ROOT / "goblin-war-crown-style-v2-treated.json"
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
        raise ValueError(f"War-Crown contains intermediate alpha: {sorted(alpha_values)}")

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"War-Crown lacks a two-pixel scaled safety border: {bounds}")

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "goblin-war-crown-style-v2.png"
    pilot.save(output, optimize=False)
    (ROOT / "goblin-war-crown-style-v2-manifest.json").write_text(
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
