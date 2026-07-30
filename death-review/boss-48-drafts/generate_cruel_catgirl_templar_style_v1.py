from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


LOGICAL_SIZE = 24
OUTPUT_SIZE = 48
ROOT = Path(__file__).resolve().parent
SLUG = "cruel-catgirl-templar-of-the-brutes"
OUTLINE = "#1a1c2c"

FUR = {
    "base": "#b7654b",
    "shadow": "#743c35",
    "highlight": "#dc8a64",
}
STEEL = {
    "base": "#69717e",
    "shadow": "#393f4b",
    "highlight": "#adb7c3",
}
IVORY = {
    "base": "#d8cdae",
    "shadow": "#8f846e",
    "highlight": "#f2e7c8",
}
CRIMSON = {
    "base": "#a6293b",
    "shadow": "#5f1d2d",
    "highlight": "#e33b4c",
}
WOOD = {
    "base": "#76503a",
    "shadow": "#3f2d28",
    "highlight": "#a16b49",
}


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str) -> None:
    draw.rectangle(box, fill=color)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str) -> None:
    draw.polygon(points, fill=color)


def held_hammer_layer(direction: str) -> Image.Image:
    if direction == "right":
        return held_hammer_layer("left").transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    layer = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if direction == "down":
        grip = (15, 12)
        handle_end = (18, 19)
        head = (14, 17, 21, 21)
    else:
        grip = (8, 12)
        handle_end = (5, 19)
        head = (2, 17, 9, 21)

    d.line((grip, handle_end), fill=tuple(bytes.fromhex(WOOD["shadow"][1:])) + (255,), width=3)
    d.line((grip, handle_end), fill=tuple(bytes.fromhex(WOOD["base"][1:])) + (255,), width=1)
    left, top, right, bottom = head
    d.rectangle(head, fill=tuple(bytes.fromhex(STEEL["shadow"][1:])) + (255,))
    d.rectangle(
        (left + 1, top + 1, right - 1, bottom - 1),
        fill=tuple(bytes.fromhex(STEEL["base"][1:])) + (255,),
    )
    d.line(
        (left + 2, top + 1, right - 2, top + 1),
        fill=tuple(bytes.fromhex(STEEL["highlight"][1:])) + (255,),
        width=1,
    )
    accent_x = left if direction == "down" else right
    d.rectangle(
        (accent_x, top + 1, accent_x, bottom - 1),
        fill=tuple(bytes.fromhex(CRIMSON["base"][1:])) + (255,),
    )
    gx, gy = grip
    d.rectangle(
        (gx - 1, gy - 1, gx + 1, gy + 1),
        fill=tuple(bytes.fromhex(STEEL["shadow"][1:])) + (255,),
    )
    d.point((gx, gy - 1), fill=tuple(bytes.fromhex(STEEL["highlight"][1:])) + (255,))
    return layer


def logical_source(include_hammer: bool = True) -> Image.Image:
    image = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # A low curling tail remains separate from the legs and reads as feline.
    poly(d, [(7, 16), (4, 15), (2, 17), (3, 20), (6, 21), (7, 19), (5, 19), (4, 18), (5, 17), (8, 18)], FUR["shadow"])
    rect(d, (3, 17, 4, 18), FUR["base"])
    rect(d, (5, 19, 6, 20), FUR["base"])
    rect(d, (2, 17, 2, 18), STEEL["highlight"])

    # Broad cloak, planted greaves, and massive pauldrons create the templar
    # body mass while the narrow tabard keeps the center readable.
    poly(d, [(7, 10), (16, 10), (19, 13), (18, 20), (16, 21), (7, 21), (5, 19), (4, 13)], CRIMSON["shadow"])
    rect(d, (5, 13, 7, 19), CRIMSON["base"])
    rect(d, (16, 13, 18, 19), CRIMSON["base"])
    rect(d, (7, 18, 10, 21), STEEL["shadow"])
    rect(d, (13, 18, 16, 21), STEEL["shadow"])
    rect(d, (6, 20, 10, 21), OUTLINE)
    rect(d, (13, 20, 17, 21), OUTLINE)

    poly(d, [(7, 10), (16, 10), (18, 13), (17, 18), (6, 18), (5, 13)], STEEL["base"])
    rect(d, (7, 11, 16, 12), STEEL["highlight"])
    rect(d, (6, 16, 17, 18), STEEL["shadow"])
    poly(d, [(5, 10), (8, 9), (10, 11), (8, 14), (4, 13)], STEEL["shadow"])
    poly(d, [(14, 11), (16, 9), (19, 10), (20, 13), (16, 14)], STEEL["shadow"])
    rect(d, (5, 11, 8, 12), STEEL["base"])
    rect(d, (16, 10, 18, 12), STEEL["base"])
    poly(d, [(4, 10), (3, 11), (4, 12)], CRIMSON["highlight"])
    poly(d, [(19, 10), (20, 11), (19, 12)], CRIMSON["highlight"])

    # Ivory templar tabard and broken crimson cross.
    poly(d, [(9, 12), (14, 12), (15, 20), (12, 19), (9, 20), (8, 16)], IVORY["base"])
    rect(d, (9, 13, 13, 14), IVORY["highlight"])
    rect(d, (9, 18, 14, 20), IVORY["shadow"])
    rect(d, (11, 14, 12, 18), CRIMSON["base"])
    rect(d, (9, 15, 14, 16), CRIMSON["base"])
    rect(d, (12, 15, 14, 15), CRIMSON["highlight"])
    rect(d, (11, 18, 11, 18), CRIMSON["shadow"])

    # Exposed cat ears frame the helmet; the face is deliberately cruel and
    # compact with red slit eyes and one bright fang.
    poly(d, [(7, 6), (8, 3), (10, 5), (14, 5), (16, 3), (17, 7), (16, 11), (14, 13), (9, 13), (7, 11)], FUR["base"])
    poly(d, [(7, 6), (8, 2), (11, 5)], FUR["base"])
    poly(d, [(13, 5), (16, 2), (17, 7)], FUR["base"])
    poly(d, [(8, 5), (8, 3), (10, 5)], CRIMSON["shadow"])
    poly(d, [(14, 5), (16, 3), (16, 6)], CRIMSON["shadow"])
    rect(d, (8, 5, 16, 7), STEEL["base"])
    rect(d, (9, 5, 15, 5), STEEL["highlight"])
    rect(d, (8, 7, 16, 8), STEEL["shadow"])
    rect(d, (8, 9, 10, 9), CRIMSON["highlight"])
    rect(d, (14, 9, 16, 9), CRIMSON["highlight"])
    rect(d, (9, 9, 9, 10), OUTLINE)
    rect(d, (15, 9, 15, 10), OUTLINE)
    rect(d, (11, 10, 13, 11), FUR["highlight"])
    rect(d, (10, 12, 14, 12), OUTLINE)
    rect(d, (13, 12, 13, 13), IVORY["highlight"])

    # Sparse armor seams prevent the treatment from flattening the plate.
    rect(d, (6, 14, 7, 16), OUTLINE)
    rect(d, (16, 14, 17, 16), OUTLINE)
    rect(d, (8, 18, 8, 19), OUTLINE)
    rect(d, (15, 18, 15, 19), OUTLINE)

    if include_hammer:
        image.alpha_composite(held_hammer_layer("down"))
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
            rgba.append((int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16), 255))
    image.putdata(rgba)
    return image


def treatment_ramps() -> list[dict[str, str]]:
    return [
        {"id": name, **ramp}
        for name, ramp in [
            ("fur", FUR),
            ("steel", STEEL),
            ("ivory", IVORY),
            ("crimson", CRIMSON),
            ("wood", WOOD),
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
    bounds = validate(pilot, "Cruel Catgirl Templar")
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
