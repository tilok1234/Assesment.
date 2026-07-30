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

import generate_divine_armored_templar_astro_knight_directions_v1 as directions
import generate_divine_armored_templar_astro_knight_style_v1 as base


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
ASSET_PREFIX = "divine-armored-templar-astro-knight-animation-v1"

OUTLINE = base.OUTLINE
CELESTIAL = base.CELESTIAL
GOLD = base.GOLD
COSMIC = base.COSMIC
RADIANCE = base.RADIANCE
VIOLET = base.VIOLET


def source_directions(include_relics: bool = True) -> dict[str, Image.Image]:
    left = directions.left_source(include_relics)
    return {
        "down": base.logical_source(include_relics),
        "left": left,
        "right": left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": directions.up_source(include_relics),
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
    x = max(
        2,
        min(
            LOGICAL_SIZE - 2 - target_width,
            ((LOGICAL_SIZE - target_width) // 2) + offset_x,
        ),
    )
    result.alpha_composite(collapsed, (x, LOGICAL_SIZE - 2 - target_height))
    return result


def shifted(points: list[tuple[int, int]], dx: int, dy: int) -> list[tuple[int, int]]:
    return [(x + dx, y + dy) for x, y in points]


def action_relic_layer(direction: str, pose: str) -> Image.Image:
    if direction == "right":
        return action_relic_layer("left", pose).transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    layer = Image.new("RGBA", (LOGICAL_SIZE, LOGICAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    if direction == "left":
        shield = (
            [(13, 11), (17, 10), (21, 12), (20, 19), (17, 21), (14, 20)],
            [(14, 12), (17, 11), (20, 13), (19, 18), (17, 21), (15, 19)],
            (17, 15),
        )
        geometry = {
            "brace": ((8, 13), (7, 5), (0, 0)),
            "charge": ((9, 13), (5, 9), (-1, -1)),
            "thrust": ((12, 13), (5, 13), (-1, 1)),
            "recover": ((8, 13), (6, 18), (0, 0)),
        }
    elif direction == "up":
        shield = (
            [(14, 11), (18, 10), (21, 12), (21, 19), (18, 21), (15, 20)],
            [(15, 12), (18, 11), (21, 13), (20, 18), (18, 21), (16, 19)],
            (18, 15),
        )
        geometry = {
            "brace": ((7, 13), (5, 5), (0, 0)),
            "charge": ((8, 13), (10, 6), (-1, -1)),
            "thrust": ((10, 13), (5, 16), (-1, 1)),
            "recover": ((8, 13), (7, 18), (0, 0)),
        }
    else:
        shield = (
            [(2, 12), (6, 10), (10, 12), (9, 19), (6, 21), (3, 20)],
            [(3, 13), (6, 11), (9, 13), (8, 18), (6, 21), (4, 19)],
            (6, 15),
        )
        geometry = {
            "brace": ((16, 13), (18, 5), (0, 0)),
            "charge": ((15, 13), (13, 6), (1, -1)),
            "thrust": ((13, 13), (18, 17), (1, 1)),
            "recover": ((15, 13), (18, 19), (0, 0)),
        }

    grip, head, (shield_dx, shield_dy) = geometry[pose]
    base.draw_star_lance(draw, grip, head)
    points, inner, center = shield
    base.draw_orbit_shield(
        draw,
        shifted(points, shield_dx, shield_dy),
        shifted(inner, shield_dx, shield_dy),
        (center[0] + shield_dx, center[1] + shield_dy),
    )
    grip_x, grip_y = grip
    draw.rectangle(
        (grip_x - 1, grip_y - 1, grip_x + 1, grip_y + 1),
        fill=hex_rgb(OUTLINE) + (255,),
    )
    draw.rectangle(
        (grip_x, grip_y - 1, grip_x + 1, grip_y),
        fill=hex_rgb(CELESTIAL["base"]) + (255,),
    )
    draw.point(
        (grip_x, grip_y - 1),
        fill=hex_rgb(CELESTIAL["highlight"]) + (255,),
    )
    return layer


def compose(body: Image.Image, direction: str, pose: str = "ready") -> Image.Image:
    result = body.copy()
    relic = (
        base.held_relic_layer(direction)
        if pose == "ready"
        else action_relic_layer(direction, pose)
    )
    # Both relics remain foregrounded in every pose. This is part of the
    # approved layering repair and must not be inferred from direction alone.
    result.alpha_composite(relic)
    return result


def add_stride_star(image: Image.Image, direction: str, frame: int) -> Image.Image:
    result = image.copy()
    positions = {
        "down": ((3, 20), (11, 21), (20, 20), (15, 21)),
        "left": ((3, 20), (8, 21), (20, 18), (12, 21)),
        "up": ((4, 20), (10, 21), (20, 18), (15, 21)),
    }[direction]
    x, y = positions[frame]
    if not result.getpixel((x, y))[3]:
        result.putpixel((x, y), hex_rgb(OUTLINE) + (255,))
    return result


def add_thrust_flare(image: Image.Image, direction: str) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    positions = {
        "down": ((18, 20), (20, 18), (20, 20)),
        "left": ((2, 11), (3, 13), (2, 15)),
        "up": ((3, 15), (4, 17), (2, 18)),
    }[direction]
    for index, (x, y) in enumerate(positions):
        if result.getpixel((x, y))[3]:
            continue
        color = RADIANCE["highlight"] if index == 1 else RADIANCE["base"]
        draw.point((x, y), fill=hex_rgb(color) + (255,))
    return result


def add_astral_sigil(image: Image.Image, direction: str, frame: int) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    positions = {
        0: ((3, 5), (20, 7)),
        1: ((2, 4), (21, 5), (3, 10), (20, 11)),
        2: ((2, 3), (21, 3), (2, 14), (21, 14), (11, 2)),
        3: ((4, 5), (19, 5), (3, 12), (20, 12), (11, 3)),
    }[frame]
    if direction == "left":
        positions = tuple((max(2, x - 1), y) for x, y in positions)
    for index, (x, y) in enumerate(positions):
        if result.getpixel((x, y))[3]:
            continue
        color = RADIANCE["highlight"] if index % 2 else GOLD["highlight"]
        draw.point((x, y), fill=hex_rgb(color) + (255,))
        if frame == 2 and y + 1 <= 21 and not result.getpixel((x, y + 1))[3]:
            draw.point((x, y + 1), fill=hex_rgb(RADIANCE["base"]) + (255,))
    return result


def add_hurt_shard(image: Image.Image, direction: str, frame: int) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    positions = {
        "down": ((20, 6), (3, 10)),
        "left": ((20, 6), (3, 15)),
        "up": ((3, 7), (20, 11)),
    }[direction]
    x, y = positions[frame]
    if not result.getpixel((x, y))[3]:
        draw.rectangle(
            (x, y, x, min(21, y + frame)),
            fill=hex_rgb(RADIANCE["highlight"]) + (255,),
        )
    return result


def add_fallen_halo_shards(image: Image.Image, direction: str, frame: int) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    positions = {
        0: ((3, 7),),
        1: ((3, 12), (20, 8)),
        2: ((4, 18), (18, 16), (20, 20)),
        3: ((3, 21), (8, 20), (18, 21), (21, 19)),
    }[frame]
    if direction == "left":
        positions = tuple((max(2, x - 1), y) for x, y in positions)
    for index, (x, y) in enumerate(positions):
        if not result.getpixel((x, y))[3]:
            color = GOLD["highlight"] if index % 2 else RADIANCE["base"]
            draw.point((x, y), fill=hex_rgb(color) + (255,))
    return result


def death_pose(source: Image.Image, frame: int, direction: str) -> Image.Image:
    angles = (8, 27, 54, 82)
    angle = -angles[frame] if direction == "left" else angles[frame]
    rotated = source.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        expand=False,
        center=(12, 18),
        fillcolor=(0, 0, 0, 0),
    )
    collapsed = fit_to_safe_area(rotated)
    if frame == 1:
        collapsed = squash_pose(collapsed, 16, -1 if direction == "left" else 1)
    elif frame == 2:
        collapsed = squash_pose(collapsed, 11, -1 if direction == "left" else 1)
    elif frame == 3:
        collapsed = squash_pose(collapsed, 6, -2 if direction == "left" else 2)
    dimming = (
        {CELESTIAL["highlight"]: CELESTIAL["base"]},
        {
            CELESTIAL["highlight"]: CELESTIAL["base"],
            RADIANCE["highlight"]: RADIANCE["base"],
        },
        {
            CELESTIAL["highlight"]: CELESTIAL["shadow"],
            GOLD["highlight"]: GOLD["base"],
            RADIANCE["highlight"]: RADIANCE["shadow"],
            VIOLET["highlight"]: VIOLET["base"],
        },
        {
            CELESTIAL["highlight"]: CELESTIAL["shadow"],
            CELESTIAL["base"]: CELESTIAL["shadow"],
            GOLD["highlight"]: GOLD["shadow"],
            GOLD["base"]: GOLD["shadow"],
            COSMIC["highlight"]: COSMIC["shadow"],
            COSMIC["base"]: COSMIC["shadow"],
            RADIANCE["highlight"]: RADIANCE["shadow"],
            RADIANCE["base"]: RADIANCE["shadow"],
            VIOLET["highlight"]: VIOLET["shadow"],
            VIOLET["base"]: VIOLET["shadow"],
        },
    )[frame]
    return add_fallen_halo_shards(replace_colors(collapsed, dimming), direction, frame)


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
        return squash_pose(full, 19)

    if animation == "walk":
        heights = (19, 20, 18, 17)
        offsets = (-1, 0, 1, 0)
        result = squash_pose(full, heights[frame], offsets[frame])
        result = add_stride_star(result, direction, frame)
        if frame == 1:
            return replace_colors(result, {CELESTIAL["highlight"]: CELESTIAL["base"]})
        if frame == 2:
            return replace_colors(result, {RADIANCE["base"]: RADIANCE["highlight"]})
        if frame == 3:
            return replace_colors(result, {GOLD["highlight"]: GOLD["base"]})
        return result

    if animation == "attack":
        poses = ("brace", "charge", "thrust", "recover")
        heights = (20, 18, 17, 19)
        offsets = (0, -1, 1, 0) if direction != "left" else (0, 1, -1, 0)
        result = compose(
            squash_pose(body, heights[frame], offsets[frame]),
            direction,
            poses[frame],
        )
        if frame == 1:
            return replace_colors(result, {RADIANCE["highlight"]: RADIANCE["base"]})
        if frame == 2:
            result = add_thrust_flare(result, direction)
            return replace_colors(
                result,
                {
                    RADIANCE["base"]: "#bcf8ff",
                    RADIANCE["highlight"]: "#ffffff",
                    GOLD["highlight"]: "#fff8c9",
                },
            )
        if frame == 3:
            return replace_colors(result, {GOLD["highlight"]: GOLD["base"]})
        return result

    if animation == "cast":
        heights = (20, 19, 18, 17)
        result = compose(squash_pose(body, heights[frame]), direction)
        result = add_astral_sigil(result, direction, frame)
        palettes = (
            {RADIANCE["highlight"]: "#ffffff"},
            {
                RADIANCE["base"]: "#a9f4fa",
                GOLD["highlight"]: "#fff8c9",
            },
            {
                RADIANCE["base"]: "#c8fbff",
                RADIANCE["highlight"]: "#ffffff",
                GOLD["base"]: "#e8bf58",
                GOLD["highlight"]: "#fffbd7",
            },
            {
                RADIANCE["highlight"]: "#ffffff",
                VIOLET["highlight"]: "#d7a7ff",
            },
        )
        return replace_colors(result, palettes[frame])

    if animation == "hurt":
        if frame == 0:
            impact = add_hurt_shard(
                squash_pose(full, 18, -1 if direction == "left" else 1),
                direction,
                frame,
            )
            return replace_colors(
                impact,
                {
                    CELESTIAL["base"]: "#dbe8ff",
                    CELESTIAL["shadow"]: "#7d8dab",
                    CELESTIAL["highlight"]: "#ffffff",
                    GOLD["base"]: "#fff0a3",
                    GOLD["shadow"]: "#d6a63a",
                    GOLD["highlight"]: "#ffffff",
                    RADIANCE["base"]: "#f3ffff",
                    RADIANCE["shadow"]: "#8ce8f2",
                    RADIANCE["highlight"]: "#ffffff",
                },
            )
        recoil = add_hurt_shard(
            squash_pose(full, 16, 1 if direction == "left" else -1),
            direction,
            frame,
        )
        return replace_colors(
            recoil,
            {
                CELESTIAL["highlight"]: CELESTIAL["base"],
                GOLD["highlight"]: GOLD["base"],
                RADIANCE["highlight"]: RADIANCE["base"],
            },
        )

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

    with tempfile.TemporaryDirectory(prefix="astro-knight-animation-") as temporary_directory:
        temporary_root = Path(temporary_directory)
        for animation in ANIMATIONS:
            animation_id = str(animation["id"])
            for direction in DIRECTION_ORDER:
                for frame in range(int(animation["frames"])):
                    key = f"{animation_id}-{direction}-{frame + 1}"
                    source = animation_source(
                        full_sources,
                        body_sources,
                        animation_id,
                        direction,
                        frame,
                    )
                    output = treat_source(fit_to_safe_area(source), temporary_root, key)
                    filename = f"{ASSET_PREFIX}-{key}.png"
                    save_asset(output, filename, output_roots)
                    frames[(animation_id, direction, frame)] = output
                    frame_facts.append(
                        {
                            "animation": animation_id,
                            "direction": direction,
                            "frame": frame + 1,
                            "file": filename,
                            "bounds": list(output.getchannel("A").getbbox()),
                        }
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
    full_filename = f"{ASSET_PREFIX}-full.png"
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
                sheet.paste(
                    frames[(animation_id, direction, frame)],
                    (frame * FRAME_SIZE, row * FRAME_SIZE),
                )
        filename = f"{ASSET_PREFIX}-animation-{animation_id}.png"
        save_asset(sheet, filename, output_roots)
        animation_sheets[animation_id] = filename

    for direction in DIRECTION_ORDER:
        approved = Image.open(
            ROOT / f"{base.SLUG}-directions-v1-{direction}.png"
        ).convert("RGBA")
        if frames[("idle", direction, 0)].tobytes() != approved.tobytes():
            raise ValueError(
                f"{direction} Idle frame 1 drifted from the approved direction pilot."
            )

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
    parser = argparse.ArgumentParser(
        description="Generate the Divine Armored Templar Astro Knight boss-animation-v1 candidate."
    )
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
