from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

from boss_animation_generator_common import planted_body_bob


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ROOT = PROJECT_ROOT / "death-review" / "boss-48-drafts"
sys.path.insert(0, str(ROOT))

import generate_bone_king_directions_v1 as directions
import generate_bone_king_style_v2 as base


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
ASSET_PREFIX = "bone-reliquary-king-animation-v1"

OUTLINE = base.OUTLINE
RED = base.RED
BONE = base.BONE
METAL = base.METAL
GOLD = base.GOLD
WOOD = base.WOOD
CLOTH = base.CLOTH


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


def move_box(
    image: Image.Image,
    box: tuple[int, int, int, int],
    dx: int,
    dy: int,
) -> Image.Image:
    left, top, right, bottom = box
    crop = image.crop((left, top, right + 1, bottom + 1))
    result = image.copy()
    for y in range(top, bottom + 1):
        for x in range(left, right + 1):
            result.putpixel((x, y), (0, 0, 0, 0))
    result.alpha_composite(crop, (left + dx, top + dy))
    return result


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


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    if frame == 0:
        angle = 6 if direction in {"down", "up"} else -7
    elif frame == 1:
        angle = 20 if direction in {"down", "up"} else -23
    elif frame == 2:
        angle = 45 if direction in {"down", "up"} else -50
    else:
        angle = 78 if direction in {"down", "up"} else -82
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
        content = collapsed.crop(bounds)
        target_height = max(7, content.height - 2)
        content = content.resize((content.width, target_height), Image.Resampling.NEAREST)
        collapsed = Image.new("RGBA", collapsed.size, (0, 0, 0, 0))
        collapsed.alpha_composite(
            content,
            ((LOGICAL_SIZE - content.width) // 2, LOGICAL_SIZE - 2 - target_height),
        )
    return collapsed


def front_or_back_pose(source: Image.Image, animation: str, frame: int) -> Image.Image:
    axe_regions = ((2, 3, 7, 9), (3, 7, 4, 21))
    lantern_regions = ((18, 12, 21, 20),)
    axe_colors = {*METAL.values(), *WOOD.values()}
    lantern_colors = {*GOLD.values(), *WOOD.values(), RED}
    left_leg = (6, 17, 10, 21)
    right_leg = (13, 17, 17, 21)

    if animation == "idle":
        if frame == 0:
            return source.copy()
        return planted_body_bob(source, 20, "bone king front/back idle")

    if animation == "walk":
        if frame == 0:
            result = move_matching(source, axe_regions, axe_colors, 0, -1)
            return move_box(result, right_leg, 1, 0)
        if frame == 1:
            return move_box(source, (7, 3, 16, 12), 0, 1)
        if frame == 2:
            result = move_matching(source, lantern_regions, lantern_colors, 0, -1)
            return move_box(result, left_leg, -1, 0)
        return source.copy()

    if animation == "attack":
        if frame == 0:
            return move_matching(source, axe_regions, axe_colors, 1, -1)
        if frame == 1:
            raised = move_matching(source, axe_regions, axe_colors, 3, -2)
            return move_box(raised, (5, 12, 7, 16), 1, -1)
        if frame == 2:
            strike = move_matching(source, axe_regions, axe_colors, 5, 2)
            return move_box(strike, (5, 12, 7, 16), 2, 1)
        return move_matching(source, axe_regions, axe_colors, 2, 1)

    if animation == "cast":
        if frame == 0:
            return move_matching(source, lantern_regions, lantern_colors, 0, -1)
        if frame == 1:
            raised = move_matching(source, lantern_regions, lantern_colors, -1, -2)
            return replace_colors(raised, {RED: "#ff655d", GOLD["highlight"]: "#ffe48a"})
        if frame == 2:
            raised = move_matching(source, lantern_regions, lantern_colors, -2, -2)
            return replace_colors(raised, {
                RED: "#fff2c2",
                GOLD["base"]: "#f4d166",
                GOLD["highlight"]: "#fff6cc",
                BONE["highlight"]: "#ffffff",
            })
        raised = move_matching(source, lantern_regions, lantern_colors, -1, -1)
        return replace_colors(raised, {RED: "#ff655d"})

    if animation == "hurt":
        if frame == 0:
            return replace_colors(source, {
                BONE["base"]: "#ffffff",
                BONE["shadow"]: "#d7d5cb",
                BONE["highlight"]: "#ffffff",
                METAL["base"]: "#e7edf4",
                METAL["shadow"]: "#b9c2cf",
                METAL["highlight"]: "#ffffff",
                GOLD["base"]: "#f7dc8d",
                GOLD["shadow"]: "#d6aa5b",
                GOLD["highlight"]: "#fff5c7",
                CLOTH["base"]: "#70748e",
                CLOTH["shadow"]: "#50536b",
                CLOTH["highlight"]: "#959ab5",
            })
        recoiling = move_box(source, (7, 2, 18, 19), 1, 1)
        return replace_colors(recoiling, {RED: "#ff655d"})

    raise ValueError(f"Unsupported animation: {animation}")


def profile_pose(source: Image.Image, animation: str, frame: int) -> Image.Image:
    axe_regions = ((16, 3, 21, 9), (17, 7, 18, 21))
    lantern_regions = ((3, 12, 6, 20),)
    axe_colors = {*METAL.values(), *WOOD.values()}
    lantern_colors = {*GOLD.values(), *WOOD.values(), RED}
    head = (3, 2, 15, 12)
    near_leg = (5, 17, 11, 21)
    far_leg = (12, 17, 18, 21)

    if animation == "idle":
        if frame == 0:
            return source.copy()
        return planted_body_bob(source, 20, "bone king profile idle")

    if animation == "walk":
        if frame == 0:
            result = move_matching(source, axe_regions, axe_colors, 0, -1)
            return move_box(result, far_leg, 1, 0)
        if frame == 1:
            return move_box(source, head, 0, 1)
        if frame == 2:
            result = move_matching(source, lantern_regions, lantern_colors, 0, -1)
            return move_box(result, near_leg, -1, 0)
        return source.copy()

    if animation == "attack":
        if frame == 0:
            return move_matching(source, axe_regions, axe_colors, -1, -1)
        if frame == 1:
            raised = move_matching(source, axe_regions, axe_colors, -3, -2)
            return move_box(raised, (13, 12, 15, 16), -1, -1)
        if frame == 2:
            strike = move_matching(source, axe_regions, axe_colors, -6, 2)
            return move_box(strike, (13, 12, 15, 16), -2, 1)
        return move_matching(source, axe_regions, axe_colors, -2, 1)

    if animation == "cast":
        if frame == 0:
            return move_matching(source, lantern_regions, lantern_colors, 0, -1)
        if frame == 1:
            raised = move_matching(source, lantern_regions, lantern_colors, 1, -2)
            return replace_colors(raised, {RED: "#ff655d", GOLD["highlight"]: "#ffe48a"})
        if frame == 2:
            raised = move_matching(source, lantern_regions, lantern_colors, 2, -2)
            return replace_colors(raised, {
                RED: "#fff2c2",
                GOLD["base"]: "#f4d166",
                GOLD["highlight"]: "#fff6cc",
                BONE["highlight"]: "#ffffff",
            })
        raised = move_matching(source, lantern_regions, lantern_colors, 1, -1)
        return replace_colors(raised, {RED: "#ff655d"})

    if animation == "hurt":
        if frame == 0:
            return replace_colors(source, {
                BONE["base"]: "#ffffff",
                BONE["shadow"]: "#d7d5cb",
                BONE["highlight"]: "#ffffff",
                METAL["base"]: "#e7edf4",
                METAL["shadow"]: "#b9c2cf",
                METAL["highlight"]: "#ffffff",
                GOLD["base"]: "#f7dc8d",
                GOLD["shadow"]: "#d6aa5b",
                GOLD["highlight"]: "#fff5c7",
                CLOTH["base"]: "#70748e",
                CLOTH["shadow"]: "#50536b",
                CLOTH["highlight"]: "#959ab5",
            })
        return move_box(source, (4, 2, 16, 19), 1, 1)

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
                ("bone", BONE),
                ("metal", METAL),
                ("gold", GOLD),
                ("wood", WOOD),
                ("cloth", CLOTH),
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

    with tempfile.TemporaryDirectory(prefix="bone-king-animation-") as temporary_directory:
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
        approved = Image.open(ROOT / f"bone-reliquary-king-directions-v1-{direction}.png").convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(f"{direction} Idle frame 1 drifted from the approved direction pilot.")

    return {
        "profile": "boss-animation-v1",
        "boss": "bone-reliquary-king",
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
    parser = argparse.ArgumentParser(description="Generate the Bone Reliquary King boss-animation-v1 pilot.")
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
