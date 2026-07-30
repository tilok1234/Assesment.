from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
SLUG = "furious-depraved-rhino"
DISPLAY_NAME = "Furious Depraved Rhino"
OUTLINE = "#171923"

HIDE = {
    "base": "#66706a",
    "shadow": "#384440",
    "highlight": "#9aa39b",
}
HORN = {
    "base": "#d9cfab",
    "shadow": "#8f8569",
    "highlight": "#fff4cf",
}
RUST = {
    "base": "#9b5934",
    "shadow": "#593326",
    "highlight": "#d68845",
}
RAGE = {
    "base": "#b72d3f",
    "shadow": "#681e31",
    "highlight": "#f06062",
}
CORRUPTION = {
    "base": "#714568",
    "shadow": "#432a4e",
    "highlight": "#b56b9b",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def logical_source() -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # A broad shoulder/rump mass sits behind the lowered head. The four
    # separated legs and visible belly gap make this read as an animal, not a
    # standing brute with arms.
    poly(draw, [(5, 8), (8, 5), (15, 5), (19, 8), (20, 14), (18, 17), (5, 17), (3, 14), (4, 9)], HIDE["base"])
    poly(draw, [(7, 6), (10, 3), (15, 4), (18, 8), (16, 10), (7, 10)], HIDE["highlight"])
    rect(draw, (5, 14, 18, 17), HIDE["shadow"])

    # Rear legs sit wider and slightly higher; the two front legs descend
    # beside the muzzle with transparent channels between all four hooves.
    rect(draw, (4, 15, 6, 20), HIDE["shadow"])
    rect(draw, (17, 15, 19, 20), HIDE["shadow"])
    rect(draw, (7, 16, 9, 21), HIDE["base"])
    rect(draw, (14, 16, 16, 21), HIDE["base"])
    rect(draw, (4, 19, 6, 21), OUTLINE)
    rect(draw, (7, 20, 9, 21), OUTLINE)
    rect(draw, (14, 20, 16, 21), OUTLINE)
    rect(draw, (17, 19, 19, 21), OUTLINE)
    rect(draw, (5, 18, 5, 19), HIDE["highlight"])
    rect(draw, (8, 18, 8, 19), HIDE["highlight"])
    rect(draw, (15, 18, 15, 19), HIDE["highlight"])
    rect(draw, (18, 18, 18, 19), HIDE["highlight"])

    # Rusted harness and broken restraint links ride over the shoulders.
    poly(draw, [(5, 9), (7, 7), (17, 15), (16, 17), (12, 13), (9, 17), (7, 16), (11, 11)], RUST["shadow"])
    rect(draw, (5, 10, 7, 11), RUST["base"])
    rect(draw, (16, 10, 18, 11), RUST["base"])
    rect(draw, (8, 12, 9, 13), RUST["highlight"])
    rect(draw, (14, 14, 15, 15), RUST["highlight"])
    rect(draw, (2, 9, 3, 10), RUST["base"])
    rect(draw, (3, 10, 4, 11), OUTLINE)
    rect(draw, (20, 9, 21, 10), RUST["base"])
    rect(draw, (19, 10, 20, 11), OUTLINE)

    # The low forward head overlaps the chest. Broad ears, tiny rage eyes,
    # paired nostrils, and the nasal horn provide an unmistakable rhino face.
    poly(draw, [(7, 7), (9, 5), (15, 5), (17, 7), (18, 12), (16, 16), (8, 16), (6, 12)], HIDE["base"])
    poly(draw, [(8, 7), (4, 5), (4, 9), (7, 10)], HIDE["shadow"])
    poly(draw, [(16, 7), (20, 5), (20, 9), (17, 10)], HIDE["shadow"])
    rect(draw, (8, 8, 16, 10), HIDE["highlight"])
    poly(draw, [(7, 10), (10, 9), (9, 12), (7, 12)], OUTLINE)
    poly(draw, [(14, 9), (17, 10), (17, 12), (15, 12)], OUTLINE)
    rect(draw, (8, 10, 8, 10), RAGE["highlight"])
    rect(draw, (16, 10, 16, 10), RAGE["highlight"])
    rect(draw, (8, 13, 16, 16), HIDE["shadow"])
    rect(draw, (9, 13, 15, 14), HIDE["base"])
    rect(draw, (9, 15, 10, 16), OUTLINE)
    rect(draw, (14, 15, 15, 16), OUTLINE)

    # The great nasal horn projects from the muzzle; the smaller secondary
    # horn and forehead ridge prevent a generic tusk read.
    poly(draw, [(9, 11), (12, 2), (15, 11), (13, 14), (10, 14)], HORN["shadow"])
    poly(draw, [(11, 10), (12, 2), (13, 11), (12, 13)], HORN["base"])
    rect(draw, (12, 2, 12, 5), HORN["highlight"])
    poly(draw, [(13, 9), (15, 6), (16, 10)], HORN["base"])
    rect(draw, (15, 7, 15, 8), HORN["highlight"])

    # Depraved markings remain secondary to the quadruped silhouette.
    poly(draw, [(10, 15), (12, 13), (14, 15), (13, 18), (11, 18)], RAGE["shadow"])
    rect(draw, (11, 15, 13, 17), RAGE["base"])
    rect(draw, (12, 14, 12, 18), RAGE["highlight"])
    rect(draw, (10, 16, 14, 16), RAGE["highlight"])
    rect(draw, (5, 12, 6, 13), CORRUPTION["base"])
    rect(draw, (17, 13, 18, 14), CORRUPTION["shadow"])
    rect(draw, (18, 13, 18, 13), CORRUPTION["highlight"])

    # Reassert all four lower legs above the belly paint so they survive the
    # 2x treatment as four discrete hoof columns.
    rect(draw, (3, 17, 5, 20), HIDE["shadow"])
    rect(draw, (18, 17, 20, 20), HIDE["shadow"])
    rect(draw, (7, 17, 9, 21), HIDE["base"])
    rect(draw, (14, 17, 16, 21), HIDE["base"])
    rect(draw, (3, 19, 5, 21), OUTLINE)
    rect(draw, (7, 20, 9, 21), OUTLINE)
    rect(draw, (14, 20, 16, 21), OUTLINE)
    rect(draw, (18, 19, 20, 21), OUTLINE)
    rect(draw, (4, 18, 4, 19), HIDE["highlight"])
    rect(draw, (8, 18, 8, 19), HIDE["highlight"])
    rect(draw, (15, 18, 15, 19), HIDE["highlight"])
    rect(draw, (19, 18, 19, 19), HIDE["highlight"])

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
            rgba_pixels.append(
                (int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16), 255)
            )
    image.putdata(rgba_pixels)
    return image


def treatment_ramps() -> list[dict[str, str]]:
    return [
        {"id": name, **ramp}
        for name, ramp in [
            ("hide", HIDE),
            ("horn", HORN),
            ("rust", RUST),
            ("rage", RAGE),
            ("corruption", CORRUPTION),
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
                "reviewStatus": "candidate",
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
