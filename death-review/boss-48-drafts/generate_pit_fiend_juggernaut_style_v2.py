from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"

FIEND = {
    "base": "#8c2626",
    "shadow": "#5f1818",
    "highlight": "#b93636",
}
CHARCOAL = {
    "base": "#4a4e5a",
    "shadow": "#303441",
    "highlight": "#68717d",
}
IRON = {
    "base": "#7e8a9c",
    "shadow": "#4a4f5c",
    "highlight": "#b9c2cf",
}
HORN = {
    "base": "#d9c194",
    "shadow": "#a58e68",
    "highlight": "#e9e4d0",
}
GOLD = {
    "base": "#e8b93e",
    "shadow": "#a36f25",
    "highlight": "#f4d166",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Broad, dark wings stay behind the red body and avoid bright membrane
    # detail so they read as silhouette rather than two extra focal areas.
    poly(d, [(9, 9), (6, 7), (3, 4), (2, 5), (3, 10), (2, 14), (6, 13), (9, 16)], CHARCOAL["base"])
    poly(d, [(15, 9), (18, 7), (21, 4), (21, 9), (20, 13), (17, 13), (15, 16)], CHARCOAL["base"])
    rect(d, (4, 7, 5, 12), CHARCOAL["highlight"])
    rect(d, (18, 7, 19, 12), CHARCOAL["highlight"])
    poly(d, [(3, 10), (6, 9), (8, 13), (5, 12)], CHARCOAL["shadow"])
    poly(d, [(16, 13), (18, 9), (20, 10), (19, 12)], CHARCOAL["shadow"])

    # Planted legs and rear armored bulk establish the juggernaut weight.
    poly(d, [(8, 10), (16, 10), (19, 14), (19, 20), (16, 21), (7, 21), (5, 19), (5, 14)], FIEND["base"])
    rect(d, (6, 14, 8, 20), FIEND["shadow"])
    rect(d, (16, 14, 18, 20), FIEND["shadow"])
    rect(d, (7, 18, 10, 21), CHARCOAL["shadow"])
    rect(d, (13, 18, 17, 21), CHARCOAL["shadow"])
    rect(d, (6, 20, 10, 21), IRON["shadow"])
    rect(d, (13, 20, 17, 21), IRON["shadow"])

    # Right-side armored fist balances the tower shield without introducing a
    # second weapon silhouette.
    poly(d, [(16, 11), (19, 11), (21, 14), (21, 18), (19, 20), (16, 18)], FIEND["base"])
    rect(d, (18, 12, 20, 14), FIEND["highlight"])
    rect(d, (18, 16, 21, 19), IRON["shadow"])
    rect(d, (19, 16, 20, 17), IRON["base"])
    rect(d, (17, 14, 20, 15), IRON["highlight"])

    # Central black-iron breastplate with restrained red structure.
    poly(d, [(8, 10), (16, 10), (18, 14), (17, 19), (7, 19), (6, 14)], CHARCOAL["base"])
    rect(d, (8, 11, 16, 12), CHARCOAL["highlight"])
    rect(d, (7, 16, 17, 19), CHARCOAL["shadow"])
    rect(d, (9, 13, 15, 17), FIEND["shadow"])
    rect(d, (10, 13, 14, 15), FIEND["base"])
    rect(d, (11, 13, 13, 13), FIEND["highlight"])
    rect(d, (9, 16, 15, 16), OUTLINE)
    rect(d, (11, 17, 13, 18), FIEND["base"])

    # Horned face: one compact red mass with gold eyes and tiny pale fangs.
    poly(d, [(8, 6), (10, 4), (15, 4), (17, 6), (17, 11), (15, 13), (9, 13), (7, 10), (7, 7)], FIEND["base"])
    rect(d, (9, 5, 15, 6), FIEND["highlight"])
    rect(d, (8, 10, 16, 12), FIEND["shadow"])
    poly(d, [(9, 6), (6, 4), (4, 2), (4, 5), (7, 8)], HORN["base"])
    poly(d, [(15, 6), (18, 4), (20, 2), (20, 5), (17, 8)], HORN["base"])
    rect(d, (4, 2, 5, 3), HORN["highlight"])
    rect(d, (19, 2, 20, 3), HORN["highlight"])
    rect(d, (6, 5, 7, 7), HORN["shadow"])
    rect(d, (17, 5, 18, 7), HORN["shadow"])
    rect(d, (9, 7, 11, 8), GOLD["base"])
    rect(d, (14, 7, 16, 8), GOLD["base"])
    rect(d, (10, 8, 10, 8), OUTLINE)
    rect(d, (14, 8, 14, 8), OUTLINE)
    rect(d, (10, 10, 14, 10), OUTLINE)
    rect(d, (11, 11, 11, 12), HORN["highlight"])
    rect(d, (14, 11, 14, 12), HORN["highlight"])

    # Tower shield dominates the left foreground as one simple iron shape.
    poly(d, [(2, 10), (7, 9), (9, 11), (9, 19), (6, 21), (3, 20), (2, 17)], IRON["base"])
    rect(d, (3, 11, 4, 19), IRON["highlight"])
    rect(d, (7, 11, 8, 19), IRON["shadow"])
    rect(d, (3, 10, 8, 11), CHARCOAL["shadow"])
    rect(d, (3, 19, 8, 20), CHARCOAL["shadow"])
    rect(d, (5, 13, 6, 17), FIEND["shadow"])
    rect(d, (4, 14, 7, 15), FIEND["base"])
    rect(d, (5, 14, 5, 14), GOLD["highlight"])

    # Sparse seams keep the large planes readable.
    rect(d, (8, 12, 8, 15), OUTLINE)
    rect(d, (16, 12, 16, 15), OUTLINE)
    rect(d, (8, 19, 8, 20), OUTLINE)
    rect(d, (10, 19, 10, 20), OUTLINE)
    rect(d, (14, 19, 14, 20), OUTLINE)
    rect(d, (16, 19, 16, 20), OUTLINE)

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
    source.save(ROOT / "pit-fiend-juggernaut-style-v2-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("fiend", FIEND),
                ("charcoal", CHARCOAL),
                ("iron", IRON),
                ("horn", HORN),
                ("gold", GOLD),
            ]
        ],
    }
    input_path = ROOT / "pit-fiend-juggernaut-style-v2-source.json"
    treated_path = ROOT / "pit-fiend-juggernaut-style-v2-treated.json"
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
        raise ValueError(f"Pit-Fiend contains intermediate alpha: {sorted(alpha_values)}")

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"Pit-Fiend lacks a two-pixel scaled safety border: {bounds}")

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "pit-fiend-juggernaut-style-v2.png"
    pilot.save(output, optimize=False)
    (ROOT / "pit-fiend-juggernaut-style-v2-manifest.json").write_text(
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
