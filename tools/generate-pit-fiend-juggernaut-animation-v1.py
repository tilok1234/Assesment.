from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

from boss_animation_generator_common import planted_body_bob


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ROOT = PROJECT_ROOT / "death-review" / "boss-48-drafts"
sys.path.insert(0, str(ROOT))

import generate_pit_fiend_juggernaut_directions_v1 as directions
import generate_pit_fiend_juggernaut_style_v2 as base


LOGICAL_SIZE = 24
FRAME_SIZE = 48
DIRECTION_ORDER = ("down", "left", "right", "up")
ANIMATIONS = (
    {"id": "idle", "name": "Idle", "frames": 2, "ms": 420},
    {"id": "walk", "name": "Walk", "frames": 4, "ms": 150},
    {"id": "attack", "name": "Attack", "frames": 4, "ms": 115},
    {"id": "cast", "name": "Cast", "frames": 4, "ms": 170},
    {"id": "hurt", "name": "Hurt", "frames": 2, "ms": 140},
    {"id": "death", "name": "Death", "frames": 4, "ms": 210},
)
SHEET_COLUMNS = sum(animation["frames"] for animation in ANIMATIONS)
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
ASSET_PREFIX = "pit-fiend-juggernaut-animation-v1"

OUTLINE = base.OUTLINE
FIEND = base.FIEND
CHARCOAL = base.CHARCOAL
IRON = base.IRON
HORN = base.HORN
GOLD = base.GOLD
MOTION_COLORS = {
    OUTLINE,
    *FIEND.values(),
    *CHARCOAL.values(),
    *IRON.values(),
    *HORN.values(),
    *GOLD.values(),
}
WING_COLORS = {OUTLINE, *CHARCOAL.values()}


def source_directions() -> dict[str, Image.Image]:
    left = directions.left_source()
    return {
        "down": base.logical_source(),
        "left": left,
        "right": left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": directions.up_source(),
    }


def hex_rgb(color: str) -> tuple[int, int, int]:
    return tuple(bytes.fromhex(color.removeprefix("#")))


def move_matching(
    image: Image.Image,
    regions: tuple[tuple[int, int, int, int], ...],
    colors: set[str],
    dx: int,
    dy: int,
) -> Image.Image:
    wanted = {hex_rgb(color) for color in colors}
    result = image.copy()
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    for left, top, right, bottom in regions:
        for y in range(top, bottom + 1):
            for x in range(left, right + 1):
                pixel = image.getpixel((x, y))
                if pixel[3] and pixel[:3] in wanted:
                    result.putpixel((x, y), (0, 0, 0, 0))
                    target = (x + dx, y + dy)
                    if 0 <= target[0] < LOGICAL_SIZE and 0 <= target[1] < LOGICAL_SIZE:
                        layer.putpixel(target, pixel)
    result.alpha_composite(layer)
    return result


def opaque_count(image: Image.Image) -> int:
    return sum(alpha > 0 for alpha in image.getchannel("A").get_flattened_data())


def copy_matching_layer(
    source: Image.Image,
    regions: tuple[tuple[int, int, int, int], ...],
    colors: set[str],
    dx: int,
    dy: int,
    label: str,
) -> Image.Image:
    wanted = {hex_rgb(color) for color in colors}
    layer = Image.new("RGBA", source.size, (0, 0, 0, 0))
    copied = 0
    for left, top, right, bottom in regions:
        for y in range(top, bottom + 1):
            for x in range(left, right + 1):
                pixel = source.getpixel((x, y))
                if not pixel[3] or pixel[:3] not in wanted:
                    continue
                target_x = x + dx
                target_y = y + dy
                if not (
                    2 <= target_x <= LOGICAL_SIZE - 3
                    and 2 <= target_y <= LOGICAL_SIZE - 3
                ):
                    raise ValueError(f"{label} moved a Pit-Fiend wing pixel outside the safe area.")
                layer.putpixel((target_x, target_y), pixel)
                copied += 1
    if opaque_count(layer) != copied:
        raise ValueError(f"{label} overlapped Pit-Fiend wing pixels while building a motion layer.")
    return layer


def assert_preserved_source(
    result: Image.Image,
    source: Image.Image,
    label: str,
) -> None:
    for y in range(LOGICAL_SIZE):
        for x in range(LOGICAL_SIZE):
            if source.getpixel((x, y))[3] and not result.getpixel((x, y))[3]:
                raise ValueError(f"{label} punched a transparent hole in the Pit-Fiend body.")


def cast_wing_pose(
    source: Image.Image,
    wing_left: tuple[tuple[int, int, int, int], ...],
    wing_right: tuple[tuple[int, int, int, int], ...],
    left_offset: tuple[int, int],
    right_offset: tuple[int, int],
    label: str,
) -> Image.Image:
    left_layer = copy_matching_layer(
        source,
        wing_left,
        WING_COLORS,
        *left_offset,
        f"{label} left wing",
    )
    right_layer = copy_matching_layer(
        source,
        wing_right,
        WING_COLORS,
        *right_offset,
        f"{label} right wing",
    )
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    result.alpha_composite(left_layer)
    result.alpha_composite(right_layer)
    result.alpha_composite(source)
    assert_preserved_source(result, source, label)
    return result


def replace_colors(image: Image.Image, replacements: dict[str, str]) -> Image.Image:
    lookup = {hex_rgb(source): hex_rgb(target) for source, target in replacements.items()}
    pixels = []
    for red, green, blue, alpha in image.get_flattened_data():
        replacement = lookup.get((red, green, blue))
        pixels.append((*replacement, alpha) if replacement else (red, green, blue, alpha))
    result = Image.new("RGBA", image.size)
    result.putdata(pixels)
    return result


def replace_region_colors(
    image: Image.Image,
    regions: tuple[tuple[int, int, int, int], ...],
    replacements: dict[str, str],
) -> Image.Image:
    lookup = {hex_rgb(source): hex_rgb(target) for source, target in replacements.items()}
    result = image.copy()
    for left, top, right, bottom in regions:
        for y in range(top, bottom + 1):
            for x in range(left, right + 1):
                red, green, blue, alpha = result.getpixel((x, y))
                replacement = lookup.get((red, green, blue))
                if alpha and replacement:
                    result.putpixel((x, y), (*replacement, alpha))
    return result


def draw_bash_shield(image: Image.Image, direction: str) -> Image.Image:
    """Draw a foreground shield plane without clearing the body underneath."""
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "up":
        outer = ((14, 10), (18, 7), (21, 9), (21, 18), (18, 21), (14, 19))
        inner = ((15, 11), (18, 8), (20, 10), (20, 18), (18, 20), (15, 18))
        emblem = ((18, 12), (20, 14), (18, 17), (16, 14))
        shine = ((16, 11), (18, 9), (19, 10))
        shadow = ((16, 18), (18, 19), (19, 18))
    elif direction == "left":
        outer = ((2, 9), (6, 7), (10, 10), (9, 19), (6, 21), (2, 19))
        inner = ((3, 10), (6, 8), (9, 10), (8, 18), (6, 20), (3, 18))
        emblem = ((6, 12), (8, 14), (6, 17), (4, 14))
        shine = ((4, 10), (6, 9), (8, 10))
        shadow = ((4, 18), (6, 19), (7, 18))
    else:
        outer = ((2, 10), (6, 7), (10, 10), (10, 18), (7, 21), (3, 20), (2, 18))
        inner = ((3, 11), (6, 8), (9, 10), (9, 18), (7, 20), (4, 19), (3, 17))
        emblem = ((6, 12), (8, 14), (6, 17), (4, 14))
        shine = ((4, 11), (6, 9), (8, 10))
        shadow = ((4, 18), (7, 19), (8, 18))

    draw.polygon(outer, fill=hex_rgb(OUTLINE) + (255,))
    draw.polygon(inner, fill=hex_rgb(IRON["base"]) + (255,))
    draw.line(shine, fill=hex_rgb(IRON["highlight"]) + (255,), width=1)
    draw.line(shadow, fill=hex_rgb(IRON["shadow"]) + (255,), width=1)
    draw.polygon(emblem, fill=hex_rgb(OUTLINE) + (255,))
    inset = emblem[0][0], emblem[0][1] + 1
    draw.point(inset, fill=hex_rgb(FIEND["highlight"]) + (255,))
    draw.point((inset[0], inset[1] + 1), fill=hex_rgb(FIEND["base"]) + (255,))
    draw.point((inset[0] - 1, inset[1] + 1), fill=hex_rgb(GOLD["highlight"]) + (255,))
    return result


def add_recovery_step(image: Image.Image) -> Image.Image:
    """Extend the planted toe by one logical pixel for a clean recovery silhouette."""
    result = image.copy()
    result.putpixel((5, 21), hex_rgb(OUTLINE) + (255,))
    return result


def add_infernal_sparks(image: Image.Image, direction: str, frame: int) -> Image.Image:
    points_by_direction = {
        "down": {
            1: ((5, 7), (19, 8)),
            2: ((3, 4), (21, 5), (5, 15), (20, 14)),
            3: ((2, 20), (21, 20)),
        },
        "left": {
            1: ((4, 7), (18, 8)),
            2: ((2, 5), (20, 5), (4, 15), (18, 14)),
            3: ((2, 20), (21, 20)),
        },
        "up": {
            1: ((5, 7), (19, 8)),
            2: ((3, 4), (21, 5), (5, 15), (19, 14)),
            3: ((2, 20), (21, 20)),
        },
    }
    points = points_by_direction[direction].get(frame, ())
    if not points:
        return image
    result = image.copy()
    for index, (x, y) in enumerate(points):
        if result.getpixel((x, y))[3]:
            continue
        color = GOLD["highlight"] if frame == 2 and index % 2 == 0 else FIEND["highlight"]
        result.putpixel((x, y), (*hex_rgb(color), 255))
        if frame == 2 and y + 1 < LOGICAL_SIZE and not result.getpixel((x, y + 1))[3]:
            result.putpixel((x, y + 1), (*hex_rgb(GOLD["shadow"]), 255))
    return result


def fit_to_safe_area(image: Image.Image) -> Image.Image:
    bounds = image.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("Animation pose became empty.")
    if (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= LOGICAL_SIZE - 2
        and bounds[3] <= LOGICAL_SIZE - 2
    ):
        return image.copy()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    content = image.crop(bounds)
    safe_size = LOGICAL_SIZE - 4
    if width > safe_size or height > safe_size:
        scale = min(safe_size / width, safe_size / height)
        width = max(1, round(width * scale))
        height = max(1, round(height * scale))
        content = content.resize((width, height), Image.Resampling.NEAREST)
    result = Image.new("RGBA", image.size, (0, 0, 0, 0))
    x = max(2, min(LOGICAL_SIZE - 2 - width, (LOGICAL_SIZE - width) // 2))
    y = LOGICAL_SIZE - 2 - height
    result.alpha_composite(content, (x, y))
    return result


def squash_pose(source: Image.Image, target_height: int, offset_x: int = 0) -> Image.Image:
    bounds = source.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("Squash pose source became empty.")
    content = source.crop(bounds)
    target_width = min(LOGICAL_SIZE - 4, content.width)
    collapsed = content.resize((target_width, target_height), Image.Resampling.NEAREST)
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    x = max(2, min(LOGICAL_SIZE - 2 - target_width, ((LOGICAL_SIZE - target_width) // 2) + offset_x))
    result.alpha_composite(collapsed, (x, LOGICAL_SIZE - 2 - target_height))
    return result


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (6, 22, 48, 78)
    angle = -angles[frame] if direction == "left" else angles[frame]
    folded = source
    if direction in {"down", "up"}:
        folded = move_matching(folded, ((2, 3, 9, 16),), WING_COLORS, 1, frame // 2)
        folded = move_matching(folded, ((15, 3, 21, 16),), WING_COLORS, -1, frame // 2)
    else:
        folded = move_matching(folded, ((10, 3, 21, 16),), WING_COLORS, -1, frame // 2)
    rotated = folded.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    collapsed = fit_to_safe_area(rotated)
    if frame == 2:
        collapsed = squash_pose(collapsed, 13, -1 if direction == "left" else 1)
    elif frame == 3:
        collapsed = squash_pose(collapsed, 7, -2 if direction == "left" else 2)
    if frame == 0:
        return replace_colors(collapsed, {GOLD["highlight"]: GOLD["base"]})
    if frame == 1:
        return replace_colors(collapsed, {
            GOLD["highlight"]: GOLD["base"],
            GOLD["base"]: GOLD["shadow"],
            FIEND["highlight"]: FIEND["base"],
        })
    if frame == 2:
        return replace_colors(collapsed, {
            GOLD["highlight"]: GOLD["shadow"],
            GOLD["base"]: GOLD["shadow"],
            FIEND["highlight"]: FIEND["base"],
        })
    return replace_colors(collapsed, {
        GOLD["highlight"]: "#5a4329",
        GOLD["base"]: "#5a4329",
        GOLD["shadow"]: "#3b2f28",
        FIEND["highlight"]: FIEND["shadow"],
        FIEND["base"]: FIEND["shadow"],
    })


def motion_config(direction: str) -> dict[str, object]:
    if direction == "down":
        return {
            "wing_left": ((2, 3, 9, 16),),
            "wing_right": ((15, 3, 21, 16),),
            "shield": ((2, 9, 9, 21),),
            "head": ((7, 2, 17, 10),),
            "leg_left": ((5, 18, 10, 21),),
            "leg_right": ((13, 18, 18, 21),),
            "idle_wings": ((-1, 0), (1, 0)),
            "attack_shield": ((-1, 0), (0, -1), (3, -1), (1, 1)),
            "recoil": 1,
        }
    if direction == "up":
        return {
            "wing_left": ((2, 3, 9, 16),),
            "wing_right": ((15, 3, 21, 16),),
            "shield": ((15, 9, 21, 21),),
            "head": ((7, 2, 17, 10),),
            "leg_left": ((5, 18, 10, 21),),
            "leg_right": ((13, 18, 18, 21),),
            "idle_wings": ((-1, 0), (1, 0)),
            "attack_shield": ((1, 0), (0, -1), (-3, -1), (-1, 1)),
            "recoil": -1,
        }
    return {
        "wing_left": ((10, 5, 16, 16),),
        "wing_right": ((16, 3, 21, 14),),
        "shield": ((2, 8, 8, 21),),
        "head": ((5, 2, 15, 10),),
        "leg_left": ((5, 18, 10, 21),),
        "leg_right": ((12, 18, 17, 21),),
        "idle_wings": ((0, 1), (1, 0)),
        "attack_shield": ((1, 0), (0, -1), (-2, -1), (-1, 1)),
        "recoil": 1,
    }


def animation_pose(
    source: Image.Image,
    animation: str,
    frame: int,
    direction: str,
) -> Image.Image:
    config = motion_config(direction)
    wing_left = config["wing_left"]
    wing_right = config["wing_right"]
    shield = config["shield"]
    head = config["head"]
    leg_left = config["leg_left"]
    leg_right = config["leg_right"]

    if animation == "idle":
        if frame == 0:
            return source.copy()
        return planted_body_bob(source, 20, f"{direction} pit fiend idle")

    if animation == "walk":
        if frame == 0:
            return squash_pose(source, 19)
        if frame == 1:
            return replace_colors(source, {
                GOLD["highlight"]: GOLD["base"],
                IRON["highlight"]: IRON["base"],
            })
        if frame == 2:
            return replace_colors(squash_pose(source, 18), {
                GOLD["base"]: GOLD["highlight"],
            })
        return replace_colors(add_recovery_step(source), {
            FIEND["highlight"]: FIEND["base"],
            GOLD["shadow"]: "#80502b",
        })

    if animation == "attack":
        if frame == 0:
            return source.copy()
        if frame == 1:
            return replace_colors(squash_pose(source, 18), {
                IRON["highlight"]: IRON["base"],
                GOLD["highlight"]: GOLD["base"],
            })
        if frame == 2:
            result = draw_bash_shield(squash_pose(source, 17), direction)
            return replace_colors(result, {
                IRON["highlight"]: "#ffffff",
                GOLD["highlight"]: "#fff2b0",
                FIEND["highlight"]: "#e34b42",
            })
        return replace_colors(squash_pose(source, 19), {
            IRON["highlight"]: IRON["base"],
            FIEND["highlight"]: FIEND["base"],
        })

    if animation == "cast":
        cast_wings = (
            (((0, 1), (0, 1))),
            (((0, -1), (0, -1))),
            (((0, -2), (0, -2))),
            (((0, 3), (0, 3))),
        )
        if direction == "left":
            cast_wings = (
                (((0, 1), (0, 1))),
                (((0, -1), (0, -1))),
                (((0, 3), (0, 3))),
                (((0, 2), (0, 2))),
            )
        result = cast_wing_pose(
            source,
            wing_left,
            wing_right,
            cast_wings[frame][0],
            cast_wings[frame][1],
            f"{direction} cast {frame + 1}",
        )
        if frame == 0:
            colored = replace_colors(result, {GOLD["highlight"]: "#ffe48a"})
        elif frame == 1:
            colored = replace_colors(result, {
                GOLD["base"]: "#f4d166",
                GOLD["highlight"]: "#fff2b0",
                FIEND["highlight"]: "#df453f",
            })
        elif frame == 2:
            colored = replace_colors(result, {
                GOLD["base"]: "#ffe48a",
                GOLD["shadow"]: "#d69a37",
                GOLD["highlight"]: "#fff8d0",
                FIEND["base"]: "#bd3631",
                FIEND["highlight"]: "#fff0c2",
            })
        else:
            colored = replace_colors(result, {
                GOLD["highlight"]: "#ffe48a",
                FIEND["highlight"]: "#df453f",
            })
        return add_infernal_sparks(colored, direction, frame)

    if animation == "hurt":
        if frame == 0:
            impact = squash_pose(source, 19)
            return replace_colors(impact, {
                FIEND["base"]: "#e28f8f",
                FIEND["shadow"]: "#b76464",
                FIEND["highlight"]: "#ffffff",
                CHARCOAL["base"]: "#b9bec9",
                CHARCOAL["shadow"]: "#8e95a2",
                CHARCOAL["highlight"]: "#ffffff",
                IRON["base"]: "#e7edf4",
                IRON["shadow"]: "#b9c2cf",
                IRON["highlight"]: "#ffffff",
                HORN["base"]: "#fff0cf",
                HORN["shadow"]: "#d6c7aa",
                HORN["highlight"]: "#ffffff",
                GOLD["base"]: "#ffe49b",
                GOLD["shadow"]: "#d6aa5b",
                GOLD["highlight"]: "#ffffff",
            })
        crouched = squash_pose(source, 17)
        return replace_colors(crouched, {
            FIEND["highlight"]: FIEND["base"],
            GOLD["highlight"]: GOLD["base"],
        })

    raise ValueError(f"Unsupported animation: {animation}")


def animation_source(
    sources: dict[str, Image.Image],
    animation: str,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "right":
        left = fit_to_safe_area(animation_source(sources, animation, "left", frame))
        return left.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    source = sources[direction]
    if animation == "death":
        return death_pose(source, frame, direction)
    return animation_pose(source, animation, frame, direction)


def treatment_input(source: Image.Image) -> dict[str, object]:
    return {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in (
                ("fiend", FIEND),
                ("charcoal", CHARCOAL),
                ("iron", IRON),
                ("horn", HORN),
                ("gold", GOLD),
            )
        ],
    }


def treat_source(source: Image.Image, temporary_root: Path, key: str) -> Image.Image:
    input_path = temporary_root / f"{key}-source.json"
    treated_path = temporary_root / f"{key}-treated.json"
    input_path.write_text(json.dumps(treatment_input(source)), encoding="utf-8")
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
    logical = base.image_from_pixels(treated["width"], treated["height"], treated["pixels"])
    output = logical.resize((FRAME_SIZE, FRAME_SIZE), Image.Resampling.NEAREST)
    alpha_values = set(output.getchannel("A").get_flattened_data())
    if not alpha_values <= {0, 255}:
        raise ValueError(f"{key} contains intermediate alpha: {sorted(alpha_values)}")
    bounds = output.getchannel("A").getbbox()
    if bounds is None or not (
        bounds[0] >= 2
        and bounds[1] >= 2
        and bounds[2] <= FRAME_SIZE - 2
        and bounds[3] <= FRAME_SIZE - 2
    ):
        raise ValueError(f"{key} lacks a two-pixel safety border: {bounds}")
    return output


def save_asset(image: Image.Image, filename: str, output_roots: tuple[Path, ...]) -> None:
    for output_root in output_roots:
        output_root.mkdir(parents=True, exist_ok=True)
        image.save(output_root / filename, optimize=False)


def build_assets(runtime_root: Path) -> dict[str, object]:
    output_roots = (ROOT, runtime_root)
    sources = source_directions()
    frames: dict[tuple[str, str, int], Image.Image] = {}
    frame_facts = []

    with tempfile.TemporaryDirectory(prefix="pit-fiend-juggernaut-animation-") as temporary_directory:
        temporary_root = Path(temporary_directory)
        for animation in ANIMATIONS:
            animation_id = str(animation["id"])
            for direction in DIRECTION_ORDER:
                for frame in range(int(animation["frames"])):
                    key = f"{animation_id}-{direction}-{frame + 1}"
                    source = animation_source(sources, animation_id, direction, frame)
                    output = treat_source(fit_to_safe_area(source), temporary_root, key)
                    filename = f"{ASSET_PREFIX}-{key}.png"
                    save_asset(output, filename, output_roots)
                    frames[(animation_id, direction, frame)] = output
                    frame_facts.append({
                        "animation": animation_id,
                        "direction": direction,
                        "frame": frame + 1,
                        "file": filename,
                        "bounds": list(output.getchannel("A").getbbox()),
                    })

    full_sheet = Image.new(
        "RGBA",
        (FRAME_SIZE * SHEET_COLUMNS, FRAME_SIZE * len(DIRECTION_ORDER)),
        (0, 0, 0, 0),
    )
    column = 0
    for animation in ANIMATIONS:
        animation_id = str(animation["id"])
        for frame in range(int(animation["frames"])):
            for row, direction in enumerate(DIRECTION_ORDER):
                full_sheet.paste(frames[(animation_id, direction, frame)], (column * FRAME_SIZE, row * FRAME_SIZE))
            column += 1
    full_filename = f"{ASSET_PREFIX}-full.png"
    save_asset(full_sheet, full_filename, output_roots)

    direction_sheets = {}
    for direction in DIRECTION_ORDER:
        sheet = Image.new("RGBA", (FRAME_SIZE * SHEET_COLUMNS, FRAME_SIZE), (0, 0, 0, 0))
        column = 0
        for animation in ANIMATIONS:
            animation_id = str(animation["id"])
            for frame in range(int(animation["frames"])):
                sheet.paste(frames[(animation_id, direction, frame)], (column * FRAME_SIZE, 0))
                column += 1
        filename = f"{ASSET_PREFIX}-direction-{direction}.png"
        save_asset(sheet, filename, output_roots)
        direction_sheets[direction] = filename

    animation_sheets = {}
    for animation in ANIMATIONS:
        animation_id = str(animation["id"])
        frame_count = int(animation["frames"])
        sheet = Image.new(
            "RGBA",
            (FRAME_SIZE * frame_count, FRAME_SIZE * len(DIRECTION_ORDER)),
            (0, 0, 0, 0),
        )
        for row, direction in enumerate(DIRECTION_ORDER):
            for frame in range(frame_count):
                sheet.paste(frames[(animation_id, direction, frame)], (frame * FRAME_SIZE, row * FRAME_SIZE))
        filename = f"{ASSET_PREFIX}-animation-{animation_id}.png"
        save_asset(sheet, filename, output_roots)
        animation_sheets[animation_id] = filename

    for direction in DIRECTION_ORDER:
        approved = Image.open(ROOT / f"pit-fiend-juggernaut-directions-v1-{direction}.png").convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(f"{direction} Idle frame 1 drifted from the approved direction pilot.")

    return {
        "profile": "boss-animation-v1",
        "boss": "pit-fiend-juggernaut",
        "fullSheet": full_filename,
        "width": full_sheet.width,
        "height": full_sheet.height,
        "cell": FRAME_SIZE,
        "columns": SHEET_COLUMNS,
        "directionOrder": list(DIRECTION_ORDER),
        "animations": list(ANIMATIONS),
        "directionSheets": direction_sheets,
        "animationSheets": animation_sheets,
        "hardAlpha": True,
        "exportScale": 1,
        "effects": False,
        "treatment": "24px authored logical poses, Form + Complete B, nearest-neighbor 2x",
        "idleFrameOneMatchesDirectionPilot": True,
        "frames": frame_facts,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate the Pit-Fiend Juggernaut boss-animation-v1 pilot.")
    parser.add_argument(
        "--runtime-root",
        type=Path,
        default=DEFAULT_RUNTIME_ROOT,
        help="Runtime boss asset directory (defaults to engine/assets/bosses).",
    )
    arguments = parser.parse_args()
    manifest = build_assets(arguments.runtime_root.resolve())
    manifest_path = ROOT / f"{ASSET_PREFIX}-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {manifest['boss']} ({manifest['width']}x{manifest['height']} full sheet)."
    )


if __name__ == "__main__":
    main()
