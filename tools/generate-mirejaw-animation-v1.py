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

import generate_mirejaw_directions_v1 as directions
import generate_mirejaw_style_v2 as base


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
ASSET_PREFIX = "ancient-mirejaw-animation-v1"

OUTLINE = base.OUTLINE
SKIN = base.SKIN
BELLY = base.BELLY
STONE = base.STONE
MOSS = base.MOSS
EYE = base.EYE
BONE = base.BONE


def source_directions() -> dict[str, Image.Image]:
    left = directions.left_source()
    return {
        "down": base.logical_source(),
        "left": left,
        "right": left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": directions.up_source(),
    }


def move_box(
    image: Image.Image,
    box: tuple[int, int, int, int],
    dx: int,
    dy: int,
) -> Image.Image:
    """Move an inclusive logical-pixel region without antialiasing."""
    left, top, right, bottom = box
    crop_box = (left, top, right + 1, bottom + 1)
    crop = image.crop(crop_box)
    result = image.copy()
    ImageDraw.Draw(result).rectangle(box, fill=(0, 0, 0, 0))
    result.alpha_composite(crop, (left + dx, top + dy))
    return result


def replace_colors(image: Image.Image, replacements: dict[str, str]) -> Image.Image:
    lookup = {
        tuple(bytes.fromhex(source.removeprefix("#"))): tuple(bytes.fromhex(target.removeprefix("#")))
        for source, target in replacements.items()
    }
    pixels = []
    for red, green, blue, alpha in image.get_flattened_data():
        replacement = lookup.get((red, green, blue))
        pixels.append((*replacement, alpha) if replacement else (red, green, blue, alpha))
    result = Image.new("RGBA", image.size)
    result.putdata(pixels)
    return result


def fit_to_safe_area(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
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
        angle = -5 if direction in {"down", "up"} else 7
    elif frame == 1:
        angle = -18 if direction in {"down", "up"} else 22
    elif frame == 2:
        angle = -42 if direction in {"down", "up"} else 48
    else:
        angle = -76 if direction in {"down", "up"} else 82
    rotated = source.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    collapsed = fit_to_safe_area(rotated)
    if frame == 3:
        # The final pose settles into a low, heavy silhouette.
        bounds = collapsed.getchannel("A").getbbox()
        content = collapsed.crop(bounds)
        target_height = max(7, content.height - 2)
        content = content.resize((content.width, target_height), Image.Resampling.NEAREST)
        collapsed = Image.new("RGBA", collapsed.size, (0, 0, 0, 0))
        collapsed.alpha_composite(content, ((LOGICAL_SIZE - content.width) // 2, LOGICAL_SIZE - 2 - target_height))
    return collapsed


def front_or_back_pose(source: Image.Image, animation: str, frame: int) -> Image.Image:
    left_arm = (2, 10, 8, 19)
    right_arm = (15, 10, 21, 19)
    left_leg = (4, 17, 10, 21)
    right_leg = (13, 17, 19, 21)

    if animation == "idle":
        if frame == 0:
            return source.copy()
        return move_box(source, (4, 2, 19, 16), 0, 1)

    if animation == "walk":
        if frame == 0:
            result = move_box(source, left_arm, 0, -1)
            return move_box(result, right_leg, 1, 0)
        if frame == 1:
            return move_box(source, (5, 3, 18, 16), 0, 1)
        if frame == 2:
            result = move_box(source, right_arm, 0, -1)
            return move_box(result, left_leg, -1, 0)
        return source.copy()

    if animation == "attack":
        if frame == 0:
            result = move_box(source, left_arm, -1, -1)
            return move_box(result, right_arm, 1, -1)
        if frame == 1:
            result = move_box(source, left_arm, -1, 0)
            result = move_box(result, right_arm, 1, 0)
            return move_box(result, (4, 2, 19, 13), 0, 1)
        if frame == 2:
            result = move_box(source, left_arm, 1, 1)
            result = move_box(result, right_arm, -1, 1)
            return move_box(result, (4, 2, 19, 13), 0, 1)
        return move_box(source, (5, 3, 18, 17), 0, 1)

    if animation == "cast":
        if frame == 0:
            result = move_box(source, left_arm, -1, -1)
            return move_box(result, right_arm, 1, -1)
        if frame == 1:
            raised = move_box(source, left_arm, -1, -2)
            raised = move_box(raised, right_arm, 1, -2)
            return replace_colors(raised, {MOSS: EYE})
        if frame == 2:
            raised = move_box(source, left_arm, -1, -2)
            raised = move_box(raised, right_arm, 1, -2)
            return replace_colors(raised, {
                MOSS: "#efffc9",
                EYE: "#efffc9",
                STONE["highlight"]: "#a8bca8",
            })
        lowered = move_box(source, left_arm, 0, -1)
        return move_box(lowered, right_arm, 0, -1)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(source, {
                SKIN["base"]: "#b9c8b3",
                SKIN["shadow"]: "#879b88",
                SKIN["highlight"]: "#e4ecd9",
                BELLY["base"]: "#d5dec1",
                BELLY["shadow"]: "#a6b297",
                BELLY["highlight"]: "#f5f8e9",
                STONE["base"]: "#bac5bb",
                STONE["shadow"]: "#89968b",
                STONE["highlight"]: "#e2e8df",
            })
        recoiling = move_box(source, (3, 2, 20, 18), 0, 1)
        return replace_colors(recoiling, {MOSS: EYE})

    raise ValueError(f"Unsupported animation: {animation}")


def profile_pose(source: Image.Image, animation: str, frame: int) -> Image.Image:
    near_arm = (3, 10, 10, 19)
    near_leg = (5, 17, 11, 21)
    far_leg = (12, 17, 18, 21)
    head = (3, 2, 18, 13)

    if animation == "idle":
        if frame == 0:
            return source.copy()
        return move_box(source, (3, 2, 18, 16), 0, 1)

    if animation == "walk":
        if frame == 0:
            result = move_box(source, near_arm, 0, -1)
            return move_box(result, far_leg, 1, 0)
        if frame == 1:
            return move_box(source, (5, 3, 18, 17), 0, 1)
        if frame == 2:
            result = move_box(source, near_arm, 0, 1)
            return move_box(result, near_leg, -1, 0)
        return source.copy()

    if animation == "attack":
        if frame == 0:
            result = move_box(source, near_arm, 1, -1)
            return move_box(result, head, 1, 0)
        if frame == 1:
            result = move_box(source, near_arm, 1, -2)
            return move_box(result, head, 1, 0)
        if frame == 2:
            result = move_box(source, near_arm, -1, 1)
            return move_box(result, head, -1, 1)
        return move_box(source, head, 0, 1)

    if animation == "cast":
        if frame == 0:
            return move_box(source, near_arm, 0, -1)
        if frame == 1:
            raised = move_box(source, near_arm, 0, -2)
            return replace_colors(raised, {MOSS: EYE})
        if frame == 2:
            raised = move_box(source, near_arm, -1, -2)
            return replace_colors(raised, {
                MOSS: "#efffc9",
                EYE: "#efffc9",
                STONE["highlight"]: "#a8bca8",
            })
        return move_box(source, near_arm, 1, -1)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(source, {
                SKIN["base"]: "#b9c8b3",
                SKIN["shadow"]: "#879b88",
                SKIN["highlight"]: "#e4ecd9",
                BELLY["base"]: "#d5dec1",
                BELLY["shadow"]: "#a6b297",
                BELLY["highlight"]: "#f5f8e9",
                STONE["base"]: "#bac5bb",
                STONE["shadow"]: "#89968b",
                STONE["highlight"]: "#e2e8df",
            })
        return move_box(source, (3, 2, 18, 19), 1, 1)

    raise ValueError(f"Unsupported animation: {animation}")


def animation_source(
    sources: dict[str, Image.Image],
    animation: str,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "right":
        left = animation_source(sources, animation, "left", frame)
        return left.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    source = sources[direction]
    if animation == "death":
        return death_pose(source, frame, direction)
    if direction in {"down", "up"}:
        return front_or_back_pose(source, animation, frame)
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
                ("belly", BELLY),
                ("stone", STONE),
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

    with tempfile.TemporaryDirectory(prefix="mirejaw-animation-") as temporary_directory:
        temporary_root = Path(temporary_directory)
        for animation in ANIMATIONS:
            animation_id = str(animation["id"])
            for direction in DIRECTION_ORDER:
                for frame in range(int(animation["frames"])):
                    key = f"{animation_id}-{direction}-{frame + 1}"
                    source = animation_source(sources, animation_id, direction, frame)
                    source = fit_to_safe_area(source)
                    output = treat_source(source, temporary_root, key)
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

    # The first idle frame is the exact approved direction pilot in every row.
    for direction in DIRECTION_ORDER:
        approved = Image.open(ROOT / f"ancient-mirejaw-directions-v1-{direction}.png").convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(f"{direction} Idle frame 1 drifted from the approved direction pilot.")

    return {
        "profile": "boss-animation-v1",
        "boss": "ancient-mirejaw",
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
    parser = argparse.ArgumentParser(description="Generate the Ancient Mirejaw boss-animation-v1 pilot.")
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
