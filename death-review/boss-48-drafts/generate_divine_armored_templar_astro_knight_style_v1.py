from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
SLUG = "divine-armored-templar-astro-knight"
DISPLAY_NAME = "Divine Armored Templar Astro Knight"
OUTLINE = "#14182b"

CELESTIAL = {
    "base": "#7d8dab",
    "shadow": "#3f4d70",
    "highlight": "#dbe8ff",
}
GOLD = {
    "base": "#d6a63a",
    "shadow": "#80552d",
    "highlight": "#fff0a3",
}
COSMIC = {
    "base": "#293463",
    "shadow": "#171c40",
    "highlight": "#526bb3",
}
RADIANCE = {
    "base": "#8ce8f2",
    "shadow": "#338ca8",
    "highlight": "#f3ffff",
}
VIOLET = {
    "base": "#7046a2",
    "shadow": "#3c275f",
    "highlight": "#b982e6",
}


def rgba(color: str) -> tuple[int, int, int, int]:
    return tuple(bytes.fromhex(color.removeprefix("#"))) + (255,)


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def draw_halo(draw: ImageDraw.ImageDraw, direction: str) -> None:
    if direction == "left":
        rect(draw, (8, 2, 12, 2), GOLD["shadow"])
        rect(draw, (6, 3, 8, 3), GOLD["base"])
        rect(draw, (12, 3, 14, 3), GOLD["base"])
        rect(draw, (5, 4, 5, 7), GOLD["shadow"])
        rect(draw, (15, 4, 15, 7), GOLD["shadow"])
        rect(draw, (7, 8, 13, 8), GOLD["base"])
        rect(draw, (6, 4, 6, 5), GOLD["highlight"])
        rect(draw, (14, 3, 14, 4), GOLD["highlight"])
        rect(draw, (2, 4, 2, 4), RADIANCE["highlight"])
        rect(draw, (18, 3, 18, 4), RADIANCE["base"])
        return

    rect(draw, (9, 2, 14, 2), GOLD["shadow"])
    rect(draw, (7, 3, 9, 3), GOLD["base"])
    rect(draw, (14, 3, 16, 3), GOLD["base"])
    rect(draw, (6, 4, 6, 7), GOLD["shadow"])
    rect(draw, (17, 4, 17, 7), GOLD["shadow"])
    rect(draw, (8, 8, 15, 8), GOLD["base"])
    rect(draw, (7, 4, 7, 5), GOLD["highlight"])
    rect(draw, (16, 3, 16, 4), GOLD["highlight"])
    rect(draw, (3, 4, 3, 4), RADIANCE["highlight"])
    rect(draw, (20, 6, 20, 7), RADIANCE["base"])


def draw_star_lance(
    draw: ImageDraw.ImageDraw,
    grip: tuple[int, int],
    head: tuple[int, int],
) -> None:
    draw.line((grip, head), fill=rgba(OUTLINE), width=3)
    draw.line((grip, head), fill=rgba(GOLD["base"]), width=1)
    hx, hy = head
    poly(
        draw,
        [
            (hx, hy - 3),
            (hx + 1, hy - 1),
            (hx + 3, hy),
            (hx + 1, hy + 1),
            (hx, hy + 3),
            (hx - 1, hy + 1),
            (hx - 3, hy),
            (hx - 1, hy - 1),
        ],
        RADIANCE["shadow"],
    )
    poly(
        draw,
        [
            (hx, hy - 2),
            (hx + 1, hy - 1),
            (hx + 2, hy),
            (hx + 1, hy + 1),
            (hx, hy + 2),
            (hx - 1, hy + 1),
            (hx - 2, hy),
            (hx - 1, hy - 1),
        ],
        RADIANCE["base"],
    )
    rect(draw, (hx, hy, hx, hy), RADIANCE["highlight"])


def draw_orbit_shield(
    draw: ImageDraw.ImageDraw,
    points: list[tuple[int, int]],
    inner: list[tuple[int, int]],
    center: tuple[int, int],
) -> None:
    poly(draw, points, OUTLINE)
    poly(draw, inner, GOLD["shadow"])
    cx, cy = center
    poly(
        draw,
        [(cx, cy - 4), (cx + 3, cy - 2), (cx + 2, cy + 3), (cx, cy + 5), (cx - 2, cy + 3), (cx - 3, cy - 2)],
        CELESTIAL["base"],
    )
    rect(draw, (cx - 1, cy - 2, cx + 1, cy + 2), COSMIC["base"])
    rect(draw, (cx - 2, cy - 1, cx + 2, cy + 1), COSMIC["base"])
    rect(draw, (cx, cy - 2, cx, cy + 2), RADIANCE["base"])
    rect(draw, (cx - 2, cy, cx + 2, cy), RADIANCE["base"])
    rect(draw, (cx, cy, cx, cy), RADIANCE["highlight"])


def held_relic_layer(direction: str) -> Image.Image:
    if direction == "right":
        return held_relic_layer("left").transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    layer = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if direction == "left":
        draw_star_lance(d, (7, 13), (5, 18))
        draw_orbit_shield(
            d,
            [(13, 11), (17, 10), (21, 12), (20, 19), (17, 21), (14, 20)],
            [(14, 12), (17, 11), (20, 13), (19, 18), (17, 21), (15, 19)],
            (17, 15),
        )
        grip = (7, 13)
    elif direction == "up":
        draw_star_lance(d, (7, 13), (5, 5))
        draw_orbit_shield(
            d,
            [(14, 11), (18, 10), (21, 12), (21, 19), (18, 21), (15, 20)],
            [(15, 12), (18, 11), (21, 13), (20, 18), (18, 21), (16, 19)],
            (18, 15),
        )
        grip = (7, 13)
    else:
        draw_star_lance(d, (16, 13), (18, 5))
        draw_orbit_shield(
            d,
            [(2, 12), (6, 10), (10, 12), (9, 19), (6, 21), (3, 20)],
            [(3, 13), (6, 11), (9, 13), (8, 18), (6, 21), (4, 19)],
            (6, 15),
        )
        grip = (16, 13)

    gx, gy = grip
    rect(d, (gx - 1, gy - 1, gx + 1, gy + 1), OUTLINE)
    rect(d, (gx, gy - 1, gx + 1, gy), CELESTIAL["base"])
    rect(d, (gx, gy - 1, gx, gy - 1), CELESTIAL["highlight"])
    return layer


def logical_source(include_relics: bool = True) -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # The astrolabe ring and sparse star motes remain behind the plated body.
    draw_halo(d, "down")

    # Constellation cloak and planted greaves create a broad boss silhouette.
    poly(d, [(7, 9), (16, 9), (19, 13), (19, 20), (16, 21), (7, 21), (4, 20), (4, 13)], COSMIC["shadow"])
    poly(d, [(6, 12), (9, 10), (11, 18), (8, 21), (5, 19)], VIOLET["base"])
    poly(d, [(15, 10), (18, 13), (18, 19), (15, 21), (13, 18)], VIOLET["shadow"])
    rect(d, (5, 16, 5, 16), RADIANCE["base"])
    rect(d, (17, 18, 17, 18), GOLD["highlight"])
    rect(d, (7, 19, 10, 21), CELESTIAL["shadow"])
    rect(d, (13, 19, 16, 21), CELESTIAL["shadow"])
    rect(d, (6, 21, 10, 21), OUTLINE)
    rect(d, (13, 21, 17, 21), OUTLINE)

    # Heavy celestial plate, exaggerated pauldrons, and a narrow star-tabard.
    poly(d, [(7, 10), (16, 10), (18, 13), (17, 19), (6, 19), (5, 13)], CELESTIAL["base"])
    rect(d, (7, 11, 16, 12), CELESTIAL["highlight"])
    rect(d, (6, 17, 17, 19), CELESTIAL["shadow"])
    poly(d, [(5, 10), (8, 9), (10, 11), (8, 15), (3, 14), (3, 12)], GOLD["shadow"])
    poly(d, [(14, 11), (16, 9), (19, 10), (21, 12), (20, 14), (16, 15)], GOLD["shadow"])
    rect(d, (4, 11, 8, 13), CELESTIAL["base"])
    rect(d, (16, 10, 19, 13), CELESTIAL["base"])
    rect(d, (4, 11, 7, 11), CELESTIAL["highlight"])
    rect(d, (17, 10, 19, 10), CELESTIAL["highlight"])
    poly(d, [(9, 13), (14, 13), (15, 21), (12, 20), (9, 21), (8, 17)], COSMIC["base"])
    rect(d, (10, 14, 13, 19), COSMIC["highlight"])
    rect(d, (11, 14, 12, 19), GOLD["base"])
    rect(d, (9, 16, 14, 17), GOLD["base"])
    rect(d, (11, 15, 12, 18), RADIANCE["base"])
    rect(d, (10, 16, 13, 17), RADIANCE["base"])
    rect(d, (11, 16, 12, 17), RADIANCE["highlight"])

    # A plated dome, gold brow, cheek guards, and narrow T-visor make the
    # sealed helmet unmistakable; no face is exposed.
    poly(d, [(8, 5), (9, 3), (11, 2), (13, 2), (15, 3), (16, 5), (16, 11), (14, 13), (9, 13), (7, 11), (7, 6)], GOLD["shadow"])
    poly(d, [(9, 5), (10, 4), (12, 3), (14, 4), (15, 5), (15, 7), (8, 7), (8, 6)], CELESTIAL["base"])
    rect(d, (10, 4, 13, 4), CELESTIAL["highlight"])
    rect(d, (11, 2, 12, 5), GOLD["base"])
    rect(d, (11, 3, 11, 4), GOLD["highlight"])
    rect(d, (8, 6, 15, 7), GOLD["base"])
    poly(d, [(8, 8), (15, 8), (15, 11), (13, 12), (10, 12), (8, 11)], COSMIC["shadow"])
    rect(d, (9, 9, 14, 9), RADIANCE["base"])
    rect(d, (11, 9, 12, 11), RADIANCE["base"])
    rect(d, (11, 9, 12, 9), RADIANCE["highlight"])
    rect(d, (8, 10, 9, 12), CELESTIAL["shadow"])
    rect(d, (14, 10, 15, 12), CELESTIAL["shadow"])
    rect(d, (10, 12, 13, 13), GOLD["base"])
    rect(d, (11, 12, 12, 12), CELESTIAL["highlight"])

    rect(d, (6, 14, 7, 17), OUTLINE)
    rect(d, (16, 14, 17, 17), OUTLINE)
    rect(d, (8, 19, 8, 20), OUTLINE)
    rect(d, (15, 19, 15, 20), OUTLINE)

    if include_relics:
        image.alpha_composite(held_relic_layer("down"))
    return image


def pixels_from_image(image: Image.Image) -> list[str | None]:
    return [
        f"#{red:02x}{green:02x}{blue:02x}" if alpha else None
        for red, green, blue, alpha in image.get_flattened_data()
    ]


def image_from_pixels(width: int, height: int, pixels: list[str | None]) -> Image.Image:
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    rgba_pixels = []
    for color in pixels:
        if color is None:
            rgba_pixels.append((0, 0, 0, 0))
        else:
            rgba_pixels.append((int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16), 255))
    image.putdata(rgba_pixels)
    return image


def treatment_ramps() -> list[dict[str, str]]:
    return [
        {"id": name, **ramp}
        for name, ramp in [
            ("celestial", CELESTIAL),
            ("gold", GOLD),
            ("cosmic", COSMIC),
            ("radiance", RADIANCE),
            ("violet", VIOLET),
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
