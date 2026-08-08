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

import generate_cruel_catgirl_templar_directions_v1 as directions
import generate_cruel_catgirl_templar_style_v1 as base


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
ASSET_PREFIX = "cruel-catgirl-templar-of-the-brutes-animation-v1"

OUTLINE = base.OUTLINE
FUR = base.FUR
STEEL = base.STEEL
IVORY = base.IVORY
CRIMSON = base.CRIMSON
WOOD = base.WOOD


def source_directions(include_hammer: bool = True) -> dict[str, Image.Image]:
    left = directions.left_source(include_hammer)
    return {
        "down": base.logical_source(include_hammer),
        "left": left,
        "right": left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": directions.up_source(include_hammer),
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


def draw_ready_hammer(direction: str) -> Image.Image:
    return base.held_hammer_layer(direction)


def draw_action_hammer(direction: str, pose: str) -> tuple[Image.Image, bool]:
    if direction == "right":
        layer, foreground = draw_action_hammer("left", pose)
        return layer.transpose(Image.Transpose.FLIP_LEFT_RIGHT), foreground

    layer = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if direction == "left":
        geometry = {
            "windup": ((17, 19), (15, 7), (11, 2, 19, 6), False),
            "raised": ((16, 19), (12, 6), (7, 2, 15, 6), False),
            "slam": ((12, 10), (7, 18), (2, 17, 10, 21), True),
            "recover": ((13, 10), (8, 15), (3, 13, 11, 17), True),
        }
    elif direction == "up":
        geometry = {
            "windup": ((7, 19), (8, 7), (3, 2, 11, 6), False),
            "raised": ((8, 19), (11, 6), (7, 2, 15, 6), False),
            "slam": ((9, 10), (6, 18), (2, 17, 10, 21), True),
            "recover": ((9, 10), (7, 15), (3, 13, 11, 17), True),
        }
    else:
        geometry = {
            "windup": ((18, 19), (15, 7), (10, 2, 18, 6), False),
            "raised": ((17, 19), (13, 6), (8, 2, 16, 6), False),
            "slam": ((15, 10), (18, 18), (13, 17, 21, 21), True),
            "recover": ((15, 10), (18, 15), (13, 13, 21, 17), True),
        }

    handle_start, handle_end, head, foreground = geometry[pose]
    d.line((handle_start, handle_end), fill=hex_rgb(WOOD["shadow"]) + (255,), width=3)
    d.line((handle_start, handle_end), fill=hex_rgb(WOOD["base"]) + (255,), width=1)
    left, top, right, bottom = head
    d.rectangle(head, fill=hex_rgb(STEEL["shadow"]) + (255,))
    d.rectangle((left + 1, top + 1, right - 1, bottom - 1), fill=hex_rgb(STEEL["base"]) + (255,))
    d.line((left + 2, top + 1, right - 2, top + 1), fill=hex_rgb(STEEL["highlight"]) + (255,), width=1)
    spike_x = left - 1 if direction == "left" else right + 1
    spike_x = max(2, min(21, spike_x))
    d.polygon(((spike_x, top + 1), (spike_x, bottom - 1), (left if direction == "left" else right, (top + bottom) // 2)), fill=hex_rgb(CRIMSON["base"]) + (255,))
    return layer, foreground


def draw_action_grip(direction: str, pose: str) -> Image.Image:
    if direction == "right":
        return draw_action_grip("left", pose).transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    geometry = {
        "left": {
            "windup": ((16, 14), (17, 19)),
            "raised": ((14, 13), (16, 19)),
            "slam": ((11, 11), None),
            "recover": ((12, 11), None),
        },
        "up": {
            "windup": ((8, 14), (7, 19)),
            "raised": ((9, 13), (8, 19)),
            "slam": ((8, 12), None),
            "recover": ((8, 12), None),
        },
        "down": {
            "windup": ((16, 14), (18, 19)),
            "raised": ((15, 13), (17, 19)),
            "slam": ((16, 12), None),
            "recover": ((16, 12), None),
        },
    }
    grip, exposed_handle_end = geometry[direction][pose]
    layer = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if exposed_handle_end is not None:
        d.line((grip, exposed_handle_end), fill=hex_rgb(WOOD["shadow"]) + (255,), width=3)
        d.line((grip, exposed_handle_end), fill=hex_rgb(WOOD["base"]) + (255,), width=1)
    grip_x, grip_y = grip
    d.rectangle(
        (grip_x - 1, grip_y - 1, grip_x + 1, grip_y + 1),
        fill=hex_rgb(STEEL["shadow"]) + (255,),
    )
    d.point((grip_x, grip_y), fill=hex_rgb(STEEL["base"]) + (255,))
    d.point((grip_x, grip_y - 1), fill=hex_rgb(STEEL["highlight"]) + (255,))
    return layer


def compose(body: Image.Image, direction: str, pose: str = "ready") -> Image.Image:
    if pose == "ready":
        hammer = draw_ready_hammer(direction)
        foreground = True
    else:
        hammer, foreground = draw_action_hammer(direction, pose)
    if foreground:
        result = body.copy()
        result.alpha_composite(hammer)
    else:
        result = hammer.copy()
        result.alpha_composite(body)
    if pose != "ready":
        result.alpha_composite(draw_action_grip(direction, pose))
    return result


def add_sigil(image: Image.Image, direction: str, frame: int) -> Image.Image:
    result = image.copy()
    d = ImageDraw.Draw(result)
    positions = {
        0: ((3, 7), (20, 7)),
        1: ((2, 5), (21, 5), (4, 10), (19, 10)),
        2: ((2, 3), (21, 3), (3, 13), (20, 13), (11, 2)),
        3: ((4, 6), (19, 6), (11, 3)),
    }[frame]
    if direction == "left":
        positions = tuple((max(2, x - 1), y) for x, y in positions)
    for index, (x, y) in enumerate(positions):
        if result.getpixel((x, y))[3]:
            continue
        color = IVORY["highlight"] if index % 2 else CRIMSON["highlight"]
        d.point((x, y), fill=hex_rgb(color) + (255,))
        if frame == 2 and y + 1 <= 21 and not result.getpixel((x, y + 1))[3]:
            d.point((x, y + 1), fill=hex_rgb(CRIMSON["base"]) + (255,))
    return result


def add_impact_debris(image: Image.Image, direction: str) -> Image.Image:
    result = image.copy()
    d = ImageDraw.Draw(result)
    points = ((3, 19), (5, 17), (20, 19), (18, 17))
    if direction == "left":
        points = ((2, 16), (4, 19), (7, 16), (10, 20))
    elif direction == "up":
        points = ((2, 18), (4, 16), (8, 18), (11, 20))
    for index, (x, y) in enumerate(points):
        if not result.getpixel((x, y))[3]:
            d.point((x, y), fill=hex_rgb(IVORY["highlight"] if index % 2 else CRIMSON["highlight"]) + (255,))
    return result


def add_walk_toe(image: Image.Image, direction: str, frame: int) -> Image.Image:
    if frame not in {1, 3}:
        return image
    result = image.copy()
    if direction == "left":
        point = (4, 21) if frame == 1 else (21, 14)
    elif direction == "up":
        point = (5, 21) if frame == 1 else (21, 14)
    else:
        point = (5, 21) if frame == 1 else (17, 21)
    result.putpixel(point, hex_rgb(OUTLINE) + (255,))
    return result


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (7, 25, 52, 82)
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
        collapsed = squash_pose(collapsed, 13, -1 if direction == "left" else 1)
    elif frame == 3:
        collapsed = squash_pose(collapsed, 7, -2 if direction == "left" else 2)
    dimming = (
        {STEEL["highlight"]: STEEL["base"], IVORY["highlight"]: IVORY["base"]},
        {STEEL["highlight"]: STEEL["base"], STEEL["base"]: STEEL["shadow"], FUR["highlight"]: FUR["base"]},
        {STEEL["highlight"]: STEEL["shadow"], IVORY["highlight"]: IVORY["shadow"], CRIMSON["highlight"]: CRIMSON["base"]},
        {
            STEEL["highlight"]: STEEL["shadow"],
            STEEL["base"]: STEEL["shadow"],
            FUR["highlight"]: FUR["shadow"],
            FUR["base"]: FUR["shadow"],
            IVORY["highlight"]: IVORY["shadow"],
            IVORY["base"]: IVORY["shadow"],
            CRIMSON["highlight"]: CRIMSON["shadow"],
            CRIMSON["base"]: CRIMSON["shadow"],
        },
    )[frame]
    return replace_colors(collapsed, dimming)


def animation_source(
    full_sources: dict[str, Image.Image],
    body_sources: dict[str, Image.Image],
    animation: str,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "right":
        left = animation_source(full_sources, body_sources, animation, "left", frame)
        return fit_to_safe_area(left).transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    full = full_sources[direction]
    body = body_sources[direction]
    if animation == "idle":
        if frame == 0:
            return full.copy()
        return compose(squash_pose(body, 19), direction)

    if animation == "walk":
        heights = (19, 20, 18, 20)
        offsets = (-1, 0, 1, -1) if direction == "left" else (-1, 0, 1, 0)
        result = add_walk_toe(
            compose(squash_pose(body, heights[frame], offsets[frame]), direction),
            direction,
            frame,
        )
        if frame == 1:
            return replace_colors(result, {STEEL["highlight"]: STEEL["base"]})
        if frame == 2:
            return replace_colors(result, {CRIMSON["base"]: CRIMSON["highlight"]})
        if frame == 3:
            return replace_colors(result, {WOOD["base"]: WOOD["highlight"]})
        return result

    if animation == "attack":
        poses = ("windup", "raised", "slam", "recover")
        heights = (20, 19, 17, 19)
        offsets = (0, -1, 1, 0) if direction != "left" else (0, 1, -1, 0)
        result = compose(squash_pose(body, heights[frame], offsets[frame]), direction, poses[frame])
        if frame == 2:
            result = add_impact_debris(result, direction)
            return replace_colors(result, {
                STEEL["highlight"]: "#ffffff",
                IVORY["highlight"]: "#ffffff",
                CRIMSON["highlight"]: "#ff6572",
            })
        if frame == 1:
            return replace_colors(result, {STEEL["highlight"]: STEEL["base"]})
        if frame == 3:
            return replace_colors(result, {CRIMSON["highlight"]: CRIMSON["base"]})
        return result

    if animation == "cast":
        heights = (20, 19, 18, 20)
        result = compose(squash_pose(body, heights[frame]), direction)
        result = add_sigil(result, direction, frame)
        palettes = (
            {CRIMSON["highlight"]: "#ff5968"},
            {CRIMSON["base"]: "#d83a4d", IVORY["highlight"]: "#fff6d8"},
            {CRIMSON["base"]: "#ef4054", CRIMSON["highlight"]: "#ff8791", IVORY["base"]: "#f3e8c9", IVORY["highlight"]: "#ffffff"},
            {CRIMSON["highlight"]: "#ff5968", IVORY["highlight"]: "#fff6d8"},
        )
        return replace_colors(result, palettes[frame])

    if animation == "hurt":
        if frame == 0:
            impact = squash_pose(full, 19, -1 if direction == "left" else 1)
            return replace_colors(impact, {
                FUR["base"]: "#f3c8b8",
                FUR["shadow"]: "#bf8e87",
                FUR["highlight"]: "#ffffff",
                STEEL["base"]: "#d8dfe8",
                STEEL["shadow"]: "#939cab",
                STEEL["highlight"]: "#ffffff",
                IVORY["base"]: "#f4ecd8",
                IVORY["shadow"]: "#c4baa3",
                IVORY["highlight"]: "#ffffff",
                CRIMSON["base"]: "#eb8c97",
                CRIMSON["shadow"]: "#b65d6a",
                CRIMSON["highlight"]: "#ffffff",
            })
        return replace_colors(squash_pose(full, 17, 1 if direction == "left" else -1), {
            FUR["highlight"]: FUR["base"],
            STEEL["highlight"]: STEEL["base"],
            CRIMSON["highlight"]: CRIMSON["base"],
        })

    if animation == "death":
        return death_pose(full, frame, direction)
    raise ValueError(f"Unsupported animation: {animation}")


def treatment_input(source: Image.Image) -> dict[str, object]:
    return {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base.pixels_from_image(source),
        "ramps": base.treatment_ramps(),
    }


def treat_source(source: Image.Image, temporary_root: Path, key: str) -> Image.Image:
    input_path = temporary_root / f"{key}-source.json"
    treated_path = temporary_root / f"{key}-treated.json"
    input_path.write_text(json.dumps(treatment_input(source)), encoding="utf-8")
    subprocess.run(
        ["node", str(ROOT / "apply_engine_treatment.mjs"), str(input_path), str(treated_path)],
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
    full_sources = source_directions(True)
    body_sources = source_directions(False)
    frames: dict[tuple[str, str, int], Image.Image] = {}
    frame_facts = []

    with tempfile.TemporaryDirectory(prefix="cruel-catgirl-templar-animation-") as temporary_directory:
        temporary_root = Path(temporary_directory)
        for animation in ANIMATIONS:
            animation_id = str(animation["id"])
            for direction in DIRECTION_ORDER:
                for frame in range(int(animation["frames"])):
                    key = f"{animation_id}-{direction}-{frame + 1}"
                    source = animation_source(full_sources, body_sources, animation_id, direction, frame)
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

    full_sheet = Image.new("RGBA", (FRAME_SIZE * SHEET_COLUMNS, FRAME_SIZE * len(DIRECTION_ORDER)), (0, 0, 0, 0))
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
        sheet = Image.new("RGBA", (FRAME_SIZE * frame_count, FRAME_SIZE * len(DIRECTION_ORDER)), (0, 0, 0, 0))
        for row, direction in enumerate(DIRECTION_ORDER):
            for frame in range(frame_count):
                sheet.paste(frames[(animation_id, direction, frame)], (frame * FRAME_SIZE, row * FRAME_SIZE))
        filename = f"{ASSET_PREFIX}-animation-{animation_id}.png"
        save_asset(sheet, filename, output_roots)
        animation_sheets[animation_id] = filename

    for direction in DIRECTION_ORDER:
        approved = Image.open(ROOT / f"{base.SLUG}-directions-v1-{direction}.png").convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(f"{direction} Idle frame 1 drifted from the approved direction pilot.")

    return {
        "profile": "boss-animation-v1",
        "boss": base.SLUG,
        "reviewStatus": "reviewed",
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
    parser = argparse.ArgumentParser(description="Generate the Cruel Catgirl Templar boss-animation-v1 candidate.")
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
