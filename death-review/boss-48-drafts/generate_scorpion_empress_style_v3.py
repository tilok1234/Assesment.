from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
OUTLINE = "#1a1c2c"

CARAPACE = {
    "base": "#33333f",
    "shadow": "#22222c",
    "highlight": "#555563",
}
CRIMSON = {
    "base": "#b4363e",
    "shadow": "#7e2933",
    "highlight": "#e83a3a",
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

    # Raised tail stays dark so it reads as a separate silhouette instead of
    # merging with the crown and claws into one bright horizontal band.
    poly(
        d,
        [(14, 18), (16, 16), (17, 13), (17, 10), (19, 8), (19, 5),
         (18, 4), (19, 3), (21, 4), (21, 7), (20, 10), (19, 12),
         (19, 15), (17, 18)],
        CARAPACE["base"],
    )
    rect(d, (17, 13, 18, 15), CARAPACE["shadow"])
    rect(d, (18, 9, 19, 11), CARAPACE["highlight"])
    rect(d, (19, 6, 20, 8), CARAPACE["shadow"])
    rect(d, (19, 5, 20, 5), CRIMSON["highlight"])
    poly(d, [(18, 4), (19, 2), (21, 2), (21, 3), (21, 5), (20, 4)], GOLD["base"])
    rect(d, (20, 2, 21, 2), GOLD["highlight"])

    # Stepped legs form a low, stable base while leaving air around the claws.
    poly(d, [(9, 14), (6, 14), (4, 15), (2, 15), (3, 17), (7, 16), (10, 16)], CARAPACE["base"])
    poly(d, [(9, 16), (6, 17), (4, 19), (2, 19), (3, 21), (7, 19), (10, 18)], CARAPACE["shadow"])
    poly(d, [(15, 14), (18, 14), (20, 15), (21, 15), (21, 17), (17, 16), (14, 16)], CARAPACE["base"])
    poly(d, [(15, 16), (18, 17), (20, 19), (21, 19), (21, 21), (17, 19), (14, 18)], CARAPACE["shadow"])
    rect(d, (3, 19, 5, 20), CRIMSON["shadow"])
    rect(d, (19, 19, 21, 20), CRIMSON["shadow"])

    # Distinct pincer silhouettes. Each has a dark arm, a crimson claw, a
    # transparent outer notch, and only one small gold cutting-edge accent.
    poly(d, [(10, 12), (8, 10), (6, 9), (5, 11), (7, 13), (9, 14)], CARAPACE["base"])
    poly(d, [(6, 10), (4, 7), (2, 7), (3, 10), (5, 11)], CRIMSON["base"])
    poly(d, [(5, 11), (3, 10), (2, 12), (4, 14), (7, 12)], CRIMSON["shadow"])
    rect(d, (3, 7, 4, 8), CRIMSON["highlight"])
    rect(d, (2, 9, 3, 10), GOLD["base"])

    poly(d, [(14, 12), (16, 10), (18, 9), (19, 11), (17, 13), (15, 14)], CARAPACE["base"])
    poly(d, [(18, 10), (20, 7), (21, 7), (21, 10), (19, 11)], CRIMSON["base"])
    poly(d, [(19, 11), (21, 10), (21, 12), (20, 14), (17, 12)], CRIMSON["shadow"])
    rect(d, (20, 7, 21, 8), CRIMSON["highlight"])
    rect(d, (20, 9, 21, 10), GOLD["base"])

    # Large dark abdomen anchors the design and provides a quiet central mass.
    poly(
        d,
        [(9, 11), (15, 11), (17, 14), (17, 18), (15, 21),
         (13, 21), (10, 21), (7, 20), (7, 15)],
        CARAPACE["base"],
    )
    rect(d, (7, 15, 8, 19), CARAPACE["shadow"])
    rect(d, (15, 14, 16, 18), CARAPACE["shadow"])
    poly(d, [(8, 18), (16, 18), (15, 21), (13, 21), (10, 21), (8, 20)], CARAPACE["shadow"])
    rect(d, (9, 16, 14, 17), CARAPACE["highlight"])
    rect(d, (10, 19, 14, 19), CARAPACE["base"])
    rect(d, (11, 20, 13, 20), OUTLINE)

    # Compact face and crown create one unambiguous focal area.
    poly(d, [(9, 10), (10, 8), (14, 8), (15, 10), (15, 14), (9, 14)], CARAPACE["shadow"])
    rect(d, (10, 10, 14, 12), CARAPACE["base"])
    rect(d, (10, 10, 11, 11), CRIMSON["highlight"])
    rect(d, (13, 10, 14, 11), CRIMSON["highlight"])
    rect(d, (11, 13, 13, 13), OUTLINE)
    rect(d, (10, 7, 14, 8), GOLD["base"])
    rect(d, (10, 6, 10, 7), GOLD["highlight"])
    rect(d, (12, 5, 12, 7), GOLD["highlight"])
    rect(d, (14, 6, 14, 7), GOLD["highlight"])
    rect(d, (11, 8, 13, 8), GOLD["shadow"])

    # A few internal separators keep the armor broad and readable.
    rect(d, (9, 14, 15, 14), OUTLINE)
    rect(d, (9, 18, 15, 18), OUTLINE)
    rect(d, (8, 16, 8, 17), OUTLINE)
    rect(d, (15, 16, 15, 17), OUTLINE)

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
    source.save(ROOT / "scorpion-empress-style-v3-source-24.png", optimize=False)

    treatment_input = {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in [
                ("carapace", CARAPACE),
                ("crimson", CRIMSON),
                ("gold", GOLD),
            ]
        ],
    }
    input_path = ROOT / "scorpion-empress-style-v3-source.json"
    treated_path = ROOT / "scorpion-empress-style-v3-treated.json"
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
        raise ValueError(f"Scorpion Empress v3 contains intermediate alpha: {sorted(alpha_values)}")

    bounds = pilot.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"Scorpion Empress v3 lacks a two-pixel scaled safety border: {bounds}")

    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / "scorpion-empress-style-v3.png"
    pilot.save(output, optimize=False)
    (ROOT / "scorpion-empress-style-v3-manifest.json").write_text(
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
                "revision": "readability-v3",
                "integrated": False,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
