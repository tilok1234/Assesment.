from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ROOT = PROJECT_ROOT / "death-review" / "boss-48-drafts"
sys.path.insert(0, str(ROOT))

import generate_goblin_war_crown_directions_v1 as directions
import generate_goblin_war_crown_style_v2 as base


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
ASSET_PREFIX = "goblin-war-crown-animation-v1"

OUTLINE = base.OUTLINE
GOBLIN = base.GOBLIN
METAL = base.METAL
GOLD = base.GOLD
CRIMSON = base.CRIMSON
WOOD = base.WOOD


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


def squash_pose(source: Image.Image, target_height: int) -> Image.Image:
    bounds = source.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("Squash pose source became empty.")
    content = source.crop(bounds)
    target_width = min(LOGICAL_SIZE - 4, content.width)
    collapsed = content.resize((target_width, target_height), Image.Resampling.NEAREST)
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    x = max(2, min(LOGICAL_SIZE - 2 - target_width, (LOGICAL_SIZE - target_width) // 2))
    result.alpha_composite(collapsed, (x, LOGICAL_SIZE - 2 - target_height))
    return result


def add_step_toe(image: Image.Image, direction: str) -> Image.Image:
    result = image.copy()
    x = 21 if direction == "up" else 20
    result.putpixel((x, 21), hex_rgb(OUTLINE) + (255,))
    return result


def draw_bash_shield(image: Image.Image, direction: str) -> Image.Image:
    """Draw a large foreground shield without clearing the commander underneath."""
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "up":
        outer = ((2, 10), (6, 7), (10, 10), (10, 18), (7, 21), (3, 20), (2, 18))
        inner = ((3, 11), (6, 8), (9, 10), (9, 18), (7, 20), (4, 19), (3, 17))
        center = (6, 14)
    elif direction == "left":
        outer = ((2, 9), (6, 7), (10, 10), (9, 19), (6, 21), (2, 19))
        inner = ((3, 10), (6, 8), (9, 10), (8, 18), (6, 20), (3, 18))
        center = (6, 14)
    else:
        outer = ((13, 10), (17, 7), (21, 9), (21, 18), (18, 21), (14, 19))
        inner = ((14, 11), (17, 8), (20, 10), (20, 18), (18, 20), (15, 18))
        center = (17, 14)

    draw.polygon(outer, fill=hex_rgb(OUTLINE) + (255,))
    draw.polygon(inner, fill=hex_rgb(CRIMSON["base"]) + (255,))
    draw.line(inner[:3], fill=hex_rgb(CRIMSON["highlight"]) + (255,), width=1)
    draw.line(inner[-3:], fill=hex_rgb(CRIMSON["shadow"]) + (255,), width=1)
    cx, cy = center
    draw.rectangle((cx - 2, cy - 1, cx + 2, cy + 2), fill=hex_rgb(GOLD["shadow"]) + (255,))
    draw.rectangle((cx - 1, cy - 2, cx + 1, cy + 1), fill=hex_rgb(GOLD["base"]) + (255,))
    draw.point((cx, cy - 2), fill=hex_rgb(GOLD["highlight"]) + (255,))
    return result


def add_command_sparks(image: Image.Image, frame: int) -> Image.Image:
    points_by_frame = {
        0: ((6, 2),),
        1: ((5, 3), (18, 2)),
        2: ((2, 4), (21, 4), (5, 7), (20, 8)),
        3: ((7, 2), (18, 4), (21, 7)),
    }
    result = image.copy()
    for index, (x, y) in enumerate(points_by_frame[frame]):
        if result.getpixel((x, y))[3]:
            continue
        color = GOLD["highlight"] if index % 2 == 0 else CRIMSON["highlight"]
        result.putpixel((x, y), hex_rgb(color) + (255,))
        if frame == 2 and y + 1 < LOGICAL_SIZE and not result.getpixel((x, y + 1))[3]:
            result.putpixel((x, y + 1), hex_rgb(GOLD["shadow"]) + (255,))
    return result


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (6, 23, 50, 80)
    angle = -angles[frame] if direction == "left" else angles[frame]
    rotated = source.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    collapsed = fit_to_safe_area(rotated)
    if frame == 2:
        collapsed = squash_pose(collapsed, 13)
    elif frame == 3:
        collapsed = squash_pose(collapsed, 7)
    if frame == 0:
        return replace_colors(collapsed, {GOLD["highlight"]: GOLD["base"]})
    if frame == 1:
        return replace_colors(collapsed, {
            GOLD["highlight"]: GOLD["base"],
            GOLD["base"]: GOLD["shadow"],
            GOBLIN["highlight"]: GOBLIN["base"],
        })
    if frame == 2:
        return replace_colors(collapsed, {
            GOLD["highlight"]: GOLD["shadow"],
            GOLD["base"]: GOLD["shadow"],
            GOBLIN["highlight"]: GOBLIN["base"],
            CRIMSON["highlight"]: CRIMSON["base"],
        })
    return replace_colors(collapsed, {
        GOLD["highlight"]: "#5a4329",
        GOLD["base"]: "#5a4329",
        GOLD["shadow"]: "#3b2f28",
        GOBLIN["highlight"]: GOBLIN["shadow"],
        GOBLIN["base"]: GOBLIN["shadow"],
        CRIMSON["highlight"]: CRIMSON["shadow"],
        CRIMSON["base"]: CRIMSON["shadow"],
    })


def animation_pose(
    source: Image.Image,
    animation: str,
    frame: int,
    direction: str,
) -> Image.Image:
    crown = ((6, 2, 18, 6),) if direction != "left" else ((6, 2, 16, 6),)

    if animation == "idle":
        if frame == 0:
            return source.copy()
        settled = squash_pose(source, 19)
        return replace_region_colors(settled, crown, {
            GOLD["highlight"]: GOLD["base"],
            GOLD["base"]: GOLD["shadow"],
        })

    if animation == "walk":
        if frame == 0:
            return squash_pose(source, 19)
        if frame == 1:
            return replace_colors(source, {
                GOLD["highlight"]: GOLD["base"],
                WOOD["highlight"]: WOOD["base"],
            })
        if frame == 2:
            return replace_colors(squash_pose(source, 18), {
                GOLD["base"]: GOLD["highlight"],
            })
        return replace_colors(add_step_toe(source, direction), {
            CRIMSON["highlight"]: CRIMSON["base"],
            GOLD["shadow"]: "#80502b",
        })

    if animation == "attack":
        if frame == 0:
            return source.copy()
        if frame == 1:
            return replace_colors(squash_pose(source, 18), {
                METAL["highlight"]: METAL["base"],
                GOLD["highlight"]: GOLD["base"],
            })
        if frame == 2:
            result = draw_bash_shield(squash_pose(source, 17), direction)
            return replace_colors(result, {
                METAL["highlight"]: "#ffffff",
                GOLD["highlight"]: "#fff2b0",
                CRIMSON["highlight"]: "#ef4d55",
            })
        return replace_colors(squash_pose(source, 19), {
            METAL["highlight"]: METAL["base"],
            CRIMSON["highlight"]: CRIMSON["base"],
        })

    if animation == "cast":
        heights = (19, 20, 18, 19)
        result = squash_pose(source, heights[frame])
        if frame == 0:
            colored = replace_colors(result, {GOLD["highlight"]: "#ffe48a"})
        elif frame == 1:
            colored = replace_colors(result, {
                GOLD["base"]: "#f4d166",
                GOLD["highlight"]: "#fff2b0",
                CRIMSON["highlight"]: "#ef4d55",
            })
        elif frame == 2:
            colored = replace_colors(result, {
                GOLD["base"]: "#ffe48a",
                GOLD["shadow"]: "#d69a37",
                GOLD["highlight"]: "#fff8d0",
                GOBLIN["highlight"]: "#fff0c2",
                CRIMSON["base"]: "#d9434b",
            })
        else:
            colored = replace_colors(result, {
                GOLD["highlight"]: "#ffe48a",
                CRIMSON["highlight"]: "#ef4d55",
            })
        return add_command_sparks(colored, frame)

    if animation == "hurt":
        if frame == 0:
            impact = squash_pose(source, 19)
            return replace_colors(impact, {
                GOBLIN["base"]: "#d7e8c4",
                GOBLIN["shadow"]: "#9eb28e",
                GOBLIN["highlight"]: "#ffffff",
                METAL["base"]: "#e7edf4",
                METAL["shadow"]: "#b9c2cf",
                METAL["highlight"]: "#ffffff",
                GOLD["base"]: "#ffe49b",
                GOLD["shadow"]: "#d6aa5b",
                GOLD["highlight"]: "#ffffff",
                CRIMSON["base"]: "#e98c91",
                CRIMSON["shadow"]: "#b45f66",
                CRIMSON["highlight"]: "#ffffff",
                WOOD["base"]: "#c39b72",
                WOOD["shadow"]: "#8f755e",
                WOOD["highlight"]: "#ffffff",
            })
        return replace_colors(squash_pose(source, 17), {
            GOBLIN["highlight"]: GOBLIN["base"],
            GOLD["highlight"]: GOLD["base"],
            CRIMSON["highlight"]: CRIMSON["base"],
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
                ("goblin", GOBLIN),
                ("metal", METAL),
                ("gold", GOLD),
                ("crimson", CRIMSON),
                ("wood", WOOD),
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

    with tempfile.TemporaryDirectory(prefix="goblin-war-crown-animation-") as temporary_directory:
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
        approved = Image.open(ROOT / f"goblin-war-crown-directions-v1-{direction}.png").convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(f"{direction} Idle frame 1 drifted from the approved direction pilot.")

    return {
        "profile": "boss-animation-v1",
        "boss": "goblin-war-crown",
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
    parser = argparse.ArgumentParser(description="Generate the Goblin War-Crown boss-animation-v1 pilot.")
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
