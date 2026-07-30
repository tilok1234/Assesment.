from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
SLUG = "gunslinger-boar-rider"
DISPLAY_NAME = "Gunslinger Boar Rider"
OUTLINE = "#171923"

BOAR = {
    "base": "#704a35",
    "shadow": "#402d28",
    "highlight": "#a16d49",
}
BRISTLE = {
    "base": "#393640",
    "shadow": "#24232e",
    "highlight": "#5d5761",
}
DUSTER = {
    "base": "#a36a31",
    "shadow": "#603c27",
    "highlight": "#d99a4d",
}
LEATHER = {
    "base": "#5b3828",
    "shadow": "#342521",
    "highlight": "#8a5532",
}
GUNMETAL = {
    "base": "#707b87",
    "shadow": "#3b4652",
    "highlight": "#b8c4cc",
}
CRIMSON = {
    "base": "#b4303f",
    "shadow": "#681f30",
    "highlight": "#ec5c5e",
}
IVORY = {
    "base": "#d9d1ac",
    "shadow": "#91876d",
    "highlight": "#fff5d2",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def draw_revolver(draw: ImageDraw.ImageDraw, grip: tuple[int, int], muzzle: tuple[int, int]) -> None:
    gx, gy = grip
    mx, my = muzzle
    draw.line((grip, muzzle), fill=OUTLINE, width=3)
    draw.line((grip, muzzle), fill=GUNMETAL["base"], width=1)
    rect(draw, (mx - 1, my - 1, mx + 1, my + 1), GUNMETAL["shadow"])
    rect(draw, (mx, my - 1, mx + 1, my), GUNMETAL["highlight"])
    rect(draw, (gx - 1, gy, gx, gy + 2), LEATHER["shadow"])
    rect(draw, (gx, gy, gx, gy + 1), LEATHER["highlight"])


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Four planted hooves and a broad armored boar body fill the lower frame.
    rect(draw, (5, 17, 8, 21), BOAR["shadow"])
    rect(draw, (9, 18, 11, 21), BOAR["shadow"])
    rect(draw, (13, 18, 15, 21), BOAR["shadow"])
    rect(draw, (16, 17, 19, 21), BOAR["shadow"])
    rect(draw, (4, 20, 8, 21), OUTLINE)
    rect(draw, (9, 20, 11, 21), OUTLINE)
    rect(draw, (13, 20, 15, 21), OUTLINE)
    rect(draw, (16, 20, 20, 21), OUTLINE)
    poly(draw, [(5, 11), (18, 11), (21, 14), (20, 19), (17, 20), (6, 20), (3, 18), (2, 14)], BOAR["base"])
    rect(draw, (4, 13, 19, 14), BOAR["highlight"])
    rect(draw, (4, 18, 19, 20), BOAR["shadow"])

    # Bristle crest and iron saddle make the mount boss-sized.
    poly(draw, [(4, 13), (5, 10), (7, 12), (9, 9), (11, 12), (13, 9), (15, 12), (18, 10), (19, 14)], BRISTLE["base"])
    rect(draw, (5, 12, 18, 13), BRISTLE["highlight"])
    poly(draw, [(7, 11), (16, 11), (18, 15), (16, 17), (7, 17), (5, 15)], LEATHER["shadow"])
    rect(draw, (7, 12, 16, 15), DUSTER["shadow"])
    rect(draw, (8, 12, 15, 13), DUSTER["highlight"])
    rect(draw, (6, 15, 17, 16), GUNMETAL["shadow"])
    rect(draw, (8, 15, 15, 15), GUNMETAL["base"])

    # Down-facing boar head: ears, angry eyes, broad snout, and paired tusks.
    poly(draw, [(5, 12), (3, 11), (2, 13), (4, 15), (7, 15)], BRISTLE["shadow"])
    poly(draw, [(18, 12), (20, 11), (21, 13), (19, 15), (16, 15)], BRISTLE["shadow"])
    poly(draw, [(6, 13), (17, 13), (19, 16), (18, 20), (15, 21), (8, 21), (5, 20), (4, 16)], BOAR["base"])
    rect(draw, (6, 14, 17, 15), BOAR["highlight"])
    poly(draw, [(6, 16), (9, 15), (9, 18), (5, 18)], OUTLINE)
    poly(draw, [(14, 15), (17, 16), (18, 18), (14, 18)], OUTLINE)
    rect(draw, (7, 16, 7, 16), CRIMSON["highlight"])
    rect(draw, (16, 16, 16, 16), CRIMSON["highlight"])
    rect(draw, (8, 18, 15, 20), BOAR["shadow"])
    rect(draw, (9, 18, 14, 18), BOAR["highlight"])
    rect(draw, (9, 19, 10, 20), OUTLINE)
    rect(draw, (13, 19, 14, 20), OUTLINE)
    poly(draw, [(7, 18), (5, 19), (5, 21), (8, 20)], IVORY["base"])
    poly(draw, [(16, 18), (18, 19), (18, 21), (15, 20)], IVORY["base"])
    rect(draw, (5, 20, 5, 20), IVORY["highlight"])
    rect(draw, (18, 20, 18, 20), IVORY["highlight"])

    # Rider boots straddle the saddle beneath the coat.
    rect(draw, (6, 10, 8, 15), LEATHER["shadow"])
    rect(draw, (15, 10, 17, 15), LEATHER["shadow"])
    rect(draw, (5, 14, 8, 16), OUTLINE)
    rect(draw, (15, 14, 18, 16), OUTLINE)
    rect(draw, (6, 11, 7, 14), LEATHER["highlight"])
    rect(draw, (16, 11, 17, 14), LEATHER["highlight"])

    # Compact gunslinger torso and split duster stay above the mount.
    poly(draw, [(8, 6), (15, 6), (17, 9), (16, 13), (13, 12), (12, 15), (10, 12), (7, 13), (6, 9)], DUSTER["base"])
    rect(draw, (8, 7, 15, 8), DUSTER["highlight"])
    poly(draw, [(9, 9), (14, 9), (15, 13), (12, 12), (9, 13), (8, 11)], DUSTER["shadow"])
    rect(draw, (11, 9, 12, 13), CRIMSON["base"])
    rect(draw, (9, 9, 14, 10), CRIMSON["shadow"])
    rect(draw, (10, 9, 13, 9), CRIMSON["highlight"])

    # Both revolvers are foregrounded and flare outward from the rider.
    draw_revolver(draw, (8, 8), (3, 7))
    draw_revolver(draw, (15, 8), (20, 7))
    rect(draw, (7, 7, 9, 9), DUSTER["base"])
    rect(draw, (14, 7, 16, 9), DUSTER["base"])
    rect(draw, (8, 8, 8, 8), IVORY["highlight"])
    rect(draw, (15, 8, 15, 8), IVORY["highlight"])

    # Wide-brim hat, shadowed face, and red bandana carry the outlaw read.
    poly(draw, [(9, 3), (10, 2), (14, 2), (15, 3), (15, 6), (8, 6), (8, 4)], LEATHER["base"])
    rect(draw, (10, 2, 13, 3), LEATHER["highlight"])
    rect(draw, (7, 4, 16, 5), OUTLINE)
    rect(draw, (8, 4, 15, 4), LEATHER["base"])
    rect(draw, (9, 5, 14, 7), IVORY["shadow"])
    rect(draw, (10, 5, 11, 5), OUTLINE)
    rect(draw, (13, 5, 14, 5), OUTLINE)
    rect(draw, (10, 6, 13, 7), CRIMSON["base"])
    rect(draw, (11, 6, 12, 6), CRIMSON["highlight"])
    rect(draw, (14, 6, 15, 7), CRIMSON["shadow"])

    return image


def pixels_from_image(image: Image.Image) -> list[str | None]:
    return [
        f"#{red:02x}{green:02x}{blue:02x}" if alpha else None
        for red, green, blue, alpha in image.get_flattened_data()
    ]


def image_from_pixels(width: int, height: int, pixels: list[str | None]) -> Image.Image:
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    values = []
    for color in pixels:
        if color is None:
            values.append((0, 0, 0, 0))
        else:
            values.append((int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16), 255))
    image.putdata(values)
    return image


def treatment_ramps() -> list[dict[str, str]]:
    return [
        {"id": name, **ramp}
        for name, ramp in [
            ("boar", BOAR),
            ("bristle", BRISTLE),
            ("duster", DUSTER),
            ("leather", LEATHER),
            ("gunmetal", GUNMETAL),
            ("crimson", CRIMSON),
            ("ivory", IVORY),
        ]
    ]


def treat(source: Image.Image, prefix: str) -> Image.Image:
    source.save(ROOT / f"{prefix}-source-24.png", optimize=False)
    input_path = ROOT / f"{prefix}-source.json"
    treated_path = ROOT / f"{prefix}-treated.json"
    input_path.write_text(
        json.dumps(
            {
                "width": LOGICAL_SIZE,
                "height": LOGICAL_SIZE,
                "pixels": pixels_from_image(source),
                "ramps": treatment_ramps(),
            }
        ),
        encoding="utf-8",
    )
    subprocess.run(
        ["node", str(ROOT / "apply_engine_treatment.mjs"), str(input_path), str(treated_path)],
        check=True,
        cwd=ROOT,
    )
    treated = json.loads(treated_path.read_text(encoding="utf-8"))
    return image_from_pixels(treated["width"], treated["height"], treated["pixels"])


def validate(frame: Image.Image, label: str) -> tuple[int, int, int, int]:
    alpha_values = set(frame.getchannel("A").get_flattened_data())
    if not alpha_values <= {0, 255}:
        raise ValueError(f"{label} contains intermediate alpha: {sorted(alpha_values)}")
    bounds = frame.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= OUTPUT_SIZE - 2
        and bounds[3] <= OUTPUT_SIZE - 2
    ):
        raise ValueError(f"{label} lacks a two-pixel safety border: {bounds}")
    return bounds


def main() -> None:
    logical = treat(logical_source(), f"{SLUG}-style-v1")
    pilot = logical.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.NEAREST)
    bounds = validate(pilot, DISPLAY_NAME)
    colors = {pixel for pixel in pilot.get_flattened_data() if pixel[3] == 255}
    output = ROOT / f"{SLUG}-style-v1.png"
    pilot.save(output, optimize=False)
    (ROOT / f"{SLUG}-style-v1-manifest.json").write_text(
        json.dumps(
            {
                "file": output.name,
                "width": OUTPUT_SIZE,
                "height": OUTPUT_SIZE,
                "logicalGrid": LOGICAL_SIZE,
                "bounds": list(bounds),
                "opaqueColors": len(colors),
                "hardAlpha": True,
                "reviewStatus": "approved",
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
