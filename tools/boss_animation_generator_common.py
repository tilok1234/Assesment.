from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path
from typing import Callable

from PIL import Image


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


def hex_rgb(color: str) -> tuple[int, int, int]:
    return tuple(bytes.fromhex(color.removeprefix("#")))


def opaque_count(image: Image.Image) -> int:
    return sum(alpha > 0 for alpha in image.getchannel("A").get_flattened_data())


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


def squash_pose(
    source: Image.Image,
    target_height: int,
    offset_x: int = 0,
) -> Image.Image:
    bounds = source.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("Squash pose source became empty.")
    content = source.crop(bounds)
    target_width = min(LOGICAL_SIZE - 4, content.width)
    collapsed = content.resize((target_width, target_height), Image.Resampling.NEAREST)
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    x = max(
        2,
        min(
            LOGICAL_SIZE - 2 - target_width,
            ((LOGICAL_SIZE - target_width) // 2) + offset_x,
        ),
    )
    result.alpha_composite(collapsed, (x, LOGICAL_SIZE - 2 - target_height))
    return result


def move_region(
    source: Image.Image,
    box: tuple[int, int, int, int],
    offset_x: int,
    offset_y: int,
    label: str,
) -> Image.Image:
    x0, y0, x1, y1 = box
    if not (
        0 <= x0 < x1 <= LOGICAL_SIZE
        and 0 <= y0 < y1 <= LOGICAL_SIZE
    ):
        raise ValueError(f"{label} uses an invalid source box: {box}")

    result = source.copy()
    moved = Image.new("RGBA", source.size, (0, 0, 0, 0))
    moved_pixels = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            pixel = source.getpixel((x, y))
            if pixel[3] == 0:
                continue
            target_x = x + offset_x
            target_y = y + offset_y
            if not (
                0 <= target_x < LOGICAL_SIZE
                and 0 <= target_y < LOGICAL_SIZE
            ):
                raise ValueError(
                    f"{label} moves {(x, y)} outside the logical frame."
                )
            result.putpixel((x, y), (0, 0, 0, 0))
            moved.putpixel((target_x, target_y), pixel)
            moved_pixels += 1

    if moved_pixels == 0:
        raise ValueError(f"{label} did not select any authored pixels.")
    result.alpha_composite(moved)
    return result


def planted_body_bob(
    source: Image.Image,
    anchor_y: int,
    label: str,
) -> Image.Image:
    if not 1 <= anchor_y < LOGICAL_SIZE - 1:
        raise ValueError(f"{label} uses an invalid ground anchor: {anchor_y}")
    return move_region(
        source,
        (0, 0, LOGICAL_SIZE, anchor_y),
        0,
        1,
        label,
    )


def add_points(
    image: Image.Image,
    points: tuple[tuple[int, int], ...],
    color: str,
    label: str,
) -> Image.Image:
    result = image.copy()
    added = 0
    for x, y in points:
        if not (2 <= x <= LOGICAL_SIZE - 3 and 2 <= y <= LOGICAL_SIZE - 3):
            raise ValueError(f"{label} point {(x, y)} is outside the safe area.")
        if result.getpixel((x, y))[3]:
            continue
        result.putpixel((x, y), (*hex_rgb(color), 255))
        added += 1
    if added == 0:
        raise ValueError(f"{label} did not add a silhouette pixel.")
    return result


def add_recovery_step(image: Image.Image, direction: str, color: str) -> Image.Image:
    candidates = {
        "down": ((5, 21), (18, 21), (2, 20), (21, 20)),
        "left": ((3, 21), (18, 21), (2, 20), (21, 20)),
        "up": ((6, 21), (17, 21), (2, 20), (21, 20)),
    }[direction]
    for point in candidates:
        if not image.getpixel(point)[3]:
            return add_points(image, (point,), color, f"{direction} recovery")
    raise ValueError(f"{direction} recovery had no open authored toe position.")


def death_pose(
    source: Image.Image,
    frame: int,
    direction: str,
) -> Image.Image:
    angles = (6, 22, 48, 78)
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
        return squash_pose(collapsed, 13, -1 if direction == "left" else 1)
    if frame == 3:
        return squash_pose(collapsed, 7, -2 if direction == "left" else 2)
    return collapsed


def treatment_input(
    source: Image.Image,
    base_module: object,
    ramps: tuple[tuple[str, dict[str, str]], ...],
) -> dict[str, object]:
    return {
        "width": LOGICAL_SIZE,
        "height": LOGICAL_SIZE,
        "pixels": base_module.pixels_from_image(source),
        "ramps": [{"id": name, **ramp} for name, ramp in ramps],
    }


def treat_source(
    source: Image.Image,
    temporary_root: Path,
    key: str,
    review_root: Path,
    base_module: object,
    ramps: tuple[tuple[str, dict[str, str]], ...],
) -> Image.Image:
    input_path = temporary_root / f"{key}-source.json"
    treated_path = temporary_root / f"{key}-treated.json"
    input_path.write_text(
        json.dumps(treatment_input(source, base_module, ramps)),
        encoding="utf-8",
    )
    subprocess.run(
        [
            "node",
            str(review_root / "apply_engine_treatment.mjs"),
            str(input_path),
            str(treated_path),
        ],
        check=True,
        cwd=review_root,
    )
    treated = json.loads(treated_path.read_text(encoding="utf-8"))
    logical = base_module.image_from_pixels(
        treated["width"],
        treated["height"],
        treated["pixels"],
    )
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


def save_asset(
    image: Image.Image,
    filename: str,
    output_roots: tuple[Path, ...],
) -> None:
    for output_root in output_roots:
        output_root.mkdir(parents=True, exist_ok=True)
        image.save(output_root / filename, optimize=False)


def build_assets(
    *,
    boss_id: str,
    sources: dict[str, Image.Image],
    pose: Callable[[Image.Image, str, int, str], Image.Image],
    base_module: object,
    ramps: tuple[tuple[str, dict[str, str]], ...],
    review_root: Path,
    runtime_root: Path,
) -> dict[str, object]:
    asset_prefix = f"{boss_id}-animation-v1"
    output_roots = (review_root, runtime_root)
    frames: dict[tuple[str, str, int], Image.Image] = {}
    frame_facts = []

    with tempfile.TemporaryDirectory(prefix=f"{boss_id}-animation-") as temporary_directory:
        temporary_root = Path(temporary_directory)
        for animation in ANIMATIONS:
            animation_id = str(animation["id"])
            for direction in DIRECTION_ORDER:
                treated_signatures = []
                for frame in range(int(animation["frames"])):
                    key = f"{animation_id}-{direction}-{frame + 1}"
                    authored_direction = "left" if direction == "right" else direction
                    source = sources[authored_direction]
                    logical = pose(source, animation_id, frame, authored_direction)
                    logical = fit_to_safe_area(logical)
                    if direction == "right":
                        logical = logical.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                    output = treat_source(
                        logical,
                        temporary_root,
                        key,
                        review_root,
                        base_module,
                        ramps,
                    )
                    filename = f"{asset_prefix}-{key}.png"
                    save_asset(output, filename, output_roots)
                    frames[(animation_id, direction, frame)] = output
                    frame_facts.append({
                        "animation": animation_id,
                        "direction": direction,
                        "frame": frame + 1,
                        "file": filename,
                        "bounds": list(output.getchannel("A").getbbox()),
                    })
                    treated_signatures.append(output.getchannel("A").tobytes())
                if len(set(treated_signatures)) != int(animation["frames"]):
                    raise ValueError(
                        f"{boss_id}/{animation_id}/{direction} lacks distinct treated silhouettes."
                    )

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
                full_sheet.paste(
                    frames[(animation_id, direction, frame)],
                    (column * FRAME_SIZE, row * FRAME_SIZE),
                )
            column += 1
    full_filename = f"{asset_prefix}-full.png"
    save_asset(full_sheet, full_filename, output_roots)

    direction_sheets = {}
    for direction in DIRECTION_ORDER:
        sheet = Image.new(
            "RGBA",
            (FRAME_SIZE * SHEET_COLUMNS, FRAME_SIZE),
            (0, 0, 0, 0),
        )
        column = 0
        for animation in ANIMATIONS:
            animation_id = str(animation["id"])
            for frame in range(int(animation["frames"])):
                sheet.paste(
                    frames[(animation_id, direction, frame)],
                    (column * FRAME_SIZE, 0),
                )
                column += 1
        filename = f"{asset_prefix}-direction-{direction}.png"
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
                sheet.paste(
                    frames[(animation_id, direction, frame)],
                    (frame * FRAME_SIZE, row * FRAME_SIZE),
                )
        filename = f"{asset_prefix}-animation-{animation_id}.png"
        save_asset(sheet, filename, output_roots)
        animation_sheets[animation_id] = filename

    for direction in DIRECTION_ORDER:
        approved = Image.open(
            review_root / f"{boss_id}-directions-v1-{direction}.png"
        ).convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(
                f"{boss_id}/{direction} Idle frame 1 drifted from the approved direction pilot."
            )

    return {
        "profile": "boss-animation-v1",
        "boss": boss_id,
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


def write_manifest(
    manifest: dict[str, object],
    review_root: Path,
) -> None:
    boss_id = str(manifest["boss"])
    path = review_root / f"{boss_id}-animation-v1-manifest.json"
    path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Generated {len(manifest['frames'])} frames and 11 native sheets "
        f"for {boss_id} ({manifest['width']}x{manifest['height']} full sheet)."
    )
