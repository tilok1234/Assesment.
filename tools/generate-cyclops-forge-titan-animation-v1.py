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

import generate_cyclops_forge_titan_directions_v1 as directions
import generate_cyclops_forge_titan_style_v2 as base


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
ASSET_PREFIX = "cyclops-forge-titan-animation-v1"

OUTLINE = base.OUTLINE
SKIN = base.SKIN
METAL = base.METAL
ROYAL = base.ROYAL
WOOD = base.WOOD
EMBER = base.EMBER
HAMMER_COLORS = {OUTLINE, *METAL.values(), *ROYAL.values(), *WOOD.values()}


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


def opaque_count(image: Image.Image) -> int:
    return sum(alpha > 0 for alpha in image.getchannel("A").get_flattened_data())


def split_hammer(
    source: Image.Image,
    hammer_regions: tuple[tuple[int, int, int, int], ...],
    head_box: tuple[int, int, int, int],
) -> tuple[Image.Image, Image.Image]:
    wanted = {hex_rgb(color) for color in HAMMER_COLORS}
    head_left, head_top, head_right, head_bottom = head_box
    body = source.copy()
    hammer = Image.new("RGBA", source.size, (0, 0, 0, 0))

    for y in range(LOGICAL_SIZE):
        for x in range(LOGICAL_SIZE):
            pixel = source.getpixel((x, y))
            if not pixel[3]:
                continue
            in_head = head_left <= x <= head_right and head_top <= y <= head_bottom
            in_shaft = any(
                left <= x <= right
                and top <= y <= bottom
                and pixel[:3] in wanted
                for left, top, right, bottom in hammer_regions[1:]
            )
            if in_head or in_shaft:
                body.putpixel((x, y), (0, 0, 0, 0))
                hammer.putpixel((x, y), pixel)

    if opaque_count(body) + opaque_count(hammer) != opaque_count(source):
        raise ValueError("Cyclops body/hammer split lost source pixels.")
    return body, hammer


def translate_layer(layer: Image.Image, dx: int, dy: int, label: str) -> Image.Image:
    result = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    for y in range(LOGICAL_SIZE):
        for x in range(LOGICAL_SIZE):
            pixel = layer.getpixel((x, y))
            if not pixel[3]:
                continue
            target_x = x + dx
            target_y = y + dy
            if not (0 <= target_x < LOGICAL_SIZE and 0 <= target_y < LOGICAL_SIZE):
                raise ValueError(f"{label} moved a Cyclops pixel outside the logical frame.")
            result.putpixel((target_x, target_y), pixel)
    if opaque_count(result) != opaque_count(layer):
        raise ValueError(f"{label} lost Cyclops pixels while translating a layer.")
    return result


def assert_preserved_layer(
    result: Image.Image,
    required: Image.Image,
    label: str,
) -> None:
    for y in range(LOGICAL_SIZE):
        for x in range(LOGICAL_SIZE):
            if required.getpixel((x, y))[3] and not result.getpixel((x, y))[3]:
                raise ValueError(f"{label} punched a transparent hole in the Cyclops body.")


def compose_components(
    body: Image.Image,
    hammer: Image.Image,
    body_offset: tuple[int, int],
    hammer_offset: tuple[int, int],
    label: str,
) -> Image.Image:
    moved_body = translate_layer(body, *body_offset, f"{label} body")
    moved_hammer = translate_layer(hammer, *hammer_offset, f"{label} hammer")
    result = moved_body.copy()
    result.alpha_composite(moved_hammer)
    assert_preserved_layer(result, moved_body, label)
    return result


def place_hammer(
    source: Image.Image,
    hammer_regions: tuple[tuple[int, int, int, int], ...],
    head_box: tuple[int, int, int, int],
    head_position: tuple[int, int],
    grip: tuple[int, int],
    body_offset: tuple[int, int],
    label: str,
) -> Image.Image:
    left, top, right, bottom = head_box
    head = source.crop((left, top, right + 1, bottom + 1))
    body, _hammer = split_hammer(source, hammer_regions, head_box)
    moved_body = translate_layer(body, *body_offset, f"{label} body")

    head_x, head_y = head_position
    shaft_end = (head_x + (head.width // 2), head_y + head.height - 2)
    hammer = Image.new("RGBA", source.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(hammer)
    moved_grip = (grip[0] + body_offset[0], grip[1] + body_offset[1])
    draw.line((moved_grip, shaft_end), fill=WOOD["shadow"], width=2)
    draw.line((moved_grip, shaft_end), fill=WOOD["base"], width=1)
    hammer.alpha_composite(head, head_position)
    result = moved_body.copy()
    result.alpha_composite(hammer)
    assert_preserved_layer(result, moved_body, label)
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


def add_forge_sparks(image: Image.Image, direction: str, frame: int) -> Image.Image:
    points_by_direction = {
        "down": {
            1: ((7, 9), (20, 10)),
            2: ((5, 5), (21, 8), (7, 14), (20, 15)),
            3: ((8, 7), (19, 12)),
        },
        "left": {
            1: ((4, 8), (17, 10)),
            2: ((3, 5), (19, 7), (4, 14), (18, 15)),
            3: ((5, 7), (17, 13)),
        },
        "up": {
            1: ((6, 8), (18, 9)),
            2: ((4, 5), (20, 6), (6, 14), (18, 15)),
            3: ((7, 7), (17, 13)),
        },
    }
    points = points_by_direction[direction].get(frame, ())
    if not points:
        return image

    result = image.copy()
    for index, (x, y) in enumerate(points):
        if result.getpixel((x, y))[3]:
            continue
        color = EMBER["highlight"] if frame == 2 and index % 2 == 0 else EMBER["base"]
        result.putpixel((x, y), (*hex_rgb(color), 255))
        trail_y = y + 1
        if frame == 2 and trail_y < LOGICAL_SIZE and not result.getpixel((x, trail_y))[3]:
            result.putpixel((x, trail_y), (*hex_rgb(EMBER["shadow"]), 255))
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


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    if frame == 0:
        angle = 5 if direction in {"down", "up"} else -6
    elif frame == 1:
        angle = 18 if direction in {"down", "up"} else -21
    elif frame == 2:
        angle = 42 if direction in {"down", "up"} else -48
    else:
        angle = 76 if direction in {"down", "up"} else -82
    rotated = source.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    collapsed = fit_to_safe_area(rotated)
    if frame == 3:
        bounds = collapsed.getchannel("A").getbbox()
        if bounds is None:
            raise ValueError("Death pose became empty.")
        content = collapsed.crop(bounds)
        target_height = max(7, content.height - 3)
        content = content.resize((content.width, target_height), Image.Resampling.NEAREST)
        collapsed = Image.new("RGBA", collapsed.size, (0, 0, 0, 0))
        collapsed.alpha_composite(
            content,
            ((LOGICAL_SIZE - content.width) // 2, LOGICAL_SIZE - 2 - target_height),
        )
    if frame == 0:
        return replace_colors(collapsed, {
            EMBER["highlight"]: EMBER["base"],
        })
    if frame == 1:
        return replace_colors(collapsed, {
            EMBER["highlight"]: EMBER["base"],
            EMBER["base"]: EMBER["shadow"],
        })
    if frame == 2:
        return replace_colors(collapsed, {
            EMBER["highlight"]: EMBER["shadow"],
            EMBER["base"]: EMBER["shadow"],
        })
    return replace_colors(collapsed, {
        EMBER["highlight"]: "#5b2c2b",
        EMBER["base"]: "#5b2c2b",
        EMBER["shadow"]: "#3b2529",
    })


def front_or_back_pose(
    source: Image.Image,
    animation: str,
    frame: int,
    direction: str,
) -> Image.Image:
    if direction == "down":
        hammer = ((2, 2, 10, 9), (4, 7, 6, 21))
        hammer_head = (2, 2, 10, 9)
        hammer_grip = (5, 16)
        attack_positions = ((3, 2), (6, 2), (2, 12), (3, 7))
        hammer_sign = 1
        cast_positions = ((3, 2), (5, 2), (7, 2), (5, 3))
    else:
        hammer = ((13, 2, 21, 9), (17, 7, 19, 21))
        hammer_head = (13, 2, 21, 9)
        hammer_grip = (18, 16)
        attack_positions = ((12, 2), (9, 2), (13, 12), (12, 7))
        hammer_sign = -1
        cast_positions = ((12, 2), (10, 2), (8, 2), (10, 3))

    body, hammer_layer = split_hammer(source, hammer, hammer_head)
    body_away = -hammer_sign

    if animation == "idle":
        if frame == 0:
            return source.copy()
        return planted_body_bob(source, 20, f"{direction} cyclops idle")

    if animation == "walk":
        body_offsets = (
            (0, -1),
            (0, 0),
            (0, -1),
            (0, 0),
        )
        hammer_offsets = (
            (hammer_sign, 0),
            (hammer_sign * 2, 0),
            (0, 0),
            (hammer_sign, 0),
        )
        return compose_components(
            body,
            hammer_layer,
            body_offsets[frame],
            hammer_offsets[frame],
            f"{direction} walk {frame + 1}",
        )

    if animation == "attack":
        body_offsets = (
            (0, 0),
            (body_away, -1),
            (body_away, 0),
            (0, -1),
        )
        result = place_hammer(
            source,
            hammer,
            hammer_head,
            attack_positions[frame],
            hammer_grip,
            body_offsets[frame],
            f"{direction} attack {frame + 1}",
        )
        if frame == 2:
            return replace_colors(result, {
                EMBER["highlight"]: "#fff2b0",
                METAL["highlight"]: "#ffffff",
            })
        return result

    if animation == "cast":
        body_offsets = (
            (0, -1),
            (body_away, 0),
            (0, -1),
            (body_away, 0),
        )
        raised = place_hammer(
            source,
            hammer,
            hammer_head,
            cast_positions[frame],
            hammer_grip,
            body_offsets[frame],
            f"{direction} cast {frame + 1}",
        )
        if frame == 0:
            colored = replace_colors(raised, {EMBER["highlight"]: "#ffe48a"})
        elif frame == 1:
            colored = replace_colors(raised, {
                EMBER["base"]: "#ff8552",
                EMBER["highlight"]: "#fff2b0",
            })
        elif frame == 2:
            colored = replace_colors(raised, {
                EMBER["base"]: "#ffc13f",
                EMBER["shadow"]: "#ef6730",
                EMBER["highlight"]: "#fff8d0",
                METAL["highlight"]: "#ffffff",
            })
        else:
            colored = replace_colors(raised, {
                EMBER["base"]: "#ff8552",
                EMBER["highlight"]: "#ffe48a",
            })
        return add_forge_sparks(colored, direction, frame)

    if animation == "hurt":
        if frame == 0:
            impact = compose_components(
                body,
                hammer_layer,
                (body_away, 0),
                (hammer_sign, 0),
                f"{direction} hurt {frame + 1}",
            )
            return replace_colors(impact, {
                SKIN["base"]: "#ded8cb",
                SKIN["shadow"]: "#aaa294",
                SKIN["highlight"]: "#ffffff",
                METAL["base"]: "#e7edf4",
                METAL["shadow"]: "#b9c2cf",
                METAL["highlight"]: "#ffffff",
                ROYAL["base"]: "#7f8793",
                ROYAL["shadow"]: "#59616e",
                ROYAL["highlight"]: "#aeb6c1",
                EMBER["base"]: "#ff9b69",
                EMBER["shadow"]: "#d66a50",
                EMBER["highlight"]: "#ffffff",
            })
        recoiling = compose_components(
            body,
            hammer_layer,
            (body_away, -1),
            (hammer_sign * 2, 0),
            f"{direction} hurt {frame + 1}",
        )
        return replace_colors(recoiling, {
            METAL["highlight"]: METAL["base"],
            EMBER["highlight"]: EMBER["shadow"],
        })

    raise ValueError(f"Unsupported animation: {animation}")


def profile_pose(source: Image.Image, animation: str, frame: int) -> Image.Image:
    hammer = ((14, 2, 21, 9), (17, 7, 19, 21))
    hammer_head = (14, 2, 21, 9)
    hammer_grip = (18, 15)
    attack_positions = ((13, 2), (10, 2), (3, 12), (10, 7))
    cast_positions = ((13, 2), (10, 2), (7, 2), (10, 3))
    body, hammer_layer = split_hammer(source, hammer, hammer_head)

    if animation == "idle":
        if frame == 0:
            return source.copy()
        return planted_body_bob(source, 20, "left cyclops idle")

    if animation == "walk":
        body_offsets = ((0, -1), (0, 0), (0, -1), (0, 0))
        hammer_offsets = ((-1, 0), (-2, 0), (0, 0), (-1, 0))
        return compose_components(
            body,
            hammer_layer,
            body_offsets[frame],
            hammer_offsets[frame],
            f"left walk {frame + 1}",
        )

    if animation == "attack":
        body_offsets = ((0, 0), (1, -1), (1, 0), (0, -1))
        result = place_hammer(
            source,
            hammer,
            hammer_head,
            attack_positions[frame],
            hammer_grip,
            body_offsets[frame],
            f"left attack {frame + 1}",
        )
        if frame == 2:
            return replace_colors(result, {
                EMBER["highlight"]: "#fff2b0",
                METAL["highlight"]: "#ffffff",
            })
        return result

    if animation == "cast":
        body_offsets = ((0, -1), (1, 0), (0, -1), (1, 0))
        raised = place_hammer(
            source,
            hammer,
            hammer_head,
            cast_positions[frame],
            hammer_grip,
            body_offsets[frame],
            f"left cast {frame + 1}",
        )
        if frame == 0:
            colored = replace_colors(raised, {EMBER["highlight"]: "#ffe48a"})
        elif frame == 1:
            colored = replace_colors(raised, {
                EMBER["base"]: "#ff8552",
                EMBER["highlight"]: "#fff2b0",
            })
        elif frame == 2:
            colored = replace_colors(raised, {
                EMBER["base"]: "#ffc13f",
                EMBER["shadow"]: "#ef6730",
                EMBER["highlight"]: "#fff8d0",
                METAL["highlight"]: "#ffffff",
            })
        else:
            colored = replace_colors(raised, {
                EMBER["base"]: "#ff8552",
                EMBER["highlight"]: "#ffe48a",
            })
        return add_forge_sparks(colored, "left", frame)

    if animation == "hurt":
        if frame == 0:
            impact = compose_components(
                body,
                hammer_layer,
                (1, 0),
                (-1, 0),
                f"left hurt {frame + 1}",
            )
            return replace_colors(impact, {
                SKIN["base"]: "#ded8cb",
                SKIN["shadow"]: "#aaa294",
                SKIN["highlight"]: "#ffffff",
                METAL["base"]: "#e7edf4",
                METAL["shadow"]: "#b9c2cf",
                METAL["highlight"]: "#ffffff",
                ROYAL["base"]: "#7f8793",
                ROYAL["shadow"]: "#59616e",
                ROYAL["highlight"]: "#aeb6c1",
                EMBER["base"]: "#ff9b69",
                EMBER["shadow"]: "#d66a50",
                EMBER["highlight"]: "#ffffff",
            })
        recoiling = compose_components(
            body,
            hammer_layer,
            (1, -1),
            (-2, 0),
            f"left hurt {frame + 1}",
        )
        return replace_colors(recoiling, {
            METAL["highlight"]: METAL["base"],
            EMBER["highlight"]: EMBER["shadow"],
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
    if direction in {"down", "up"}:
        return front_or_back_pose(source, animation, frame, direction)
    return profile_pose(source, animation, frame)


def treatment_input(source: Image.Image) -> dict[str, object]:
    return {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": [
            {"id": name, **ramp}
            for name, ramp in (
                ("skin", SKIN),
                ("metal", METAL),
                ("royal", ROYAL),
                ("wood", WOOD),
                ("ember", EMBER),
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

    with tempfile.TemporaryDirectory(prefix="cyclops-forge-titan-animation-") as temporary_directory:
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
        approved = Image.open(ROOT / f"cyclops-forge-titan-directions-v1-{direction}.png").convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(f"{direction} Idle frame 1 drifted from the approved direction pilot.")

    return {
        "profile": "boss-animation-v1",
        "boss": "cyclops-forge-titan",
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
    parser = argparse.ArgumentParser(description="Generate the Cyclops Forge-Titan boss-animation-v1 pilot.")
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
