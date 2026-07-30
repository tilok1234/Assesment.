from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from boss_animation_generator_common import (
    add_points,
    add_recovery_step,
    build_assets,
    death_pose,
    move_region,
    planted_body_bob,
    replace_colors,
    squash_pose,
    write_manifest,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ROOT = PROJECT_ROOT / "death-review" / "boss-48-drafts"
sys.path.insert(0, str(ROOT))

import generate_royal_night_elf_prince_directions_v1 as directions
import generate_royal_night_elf_prince_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "royal-night-elf-prince"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
SKIN = base.SKIN
HAIR = base.HAIR
ARMOR = base.ARMOR
ROYAL = base.ROYAL
MOONSTEEL = base.MOONSTEEL


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def step_pose(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (6, 17, 11, 22)
        trailing = (10, 17, 15, 22)
    else:
        leading = (7, 17, 12, 22)
        trailing = (12, 17, 18, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} prince leading duelist step",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} prince trailing duelist step",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} prince trailing-foot contact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} prince crossing duelist step",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} prince planted recovery step",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} prince recovery-foot contact dip",
    )


def draw_crescent_slash(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((8, 5), (5, 7), (3, 11), (3, 15), (5, 18))
            if wide
            else ((7, 7), (4, 10), (4, 14), (6, 16))
        )
        inner = (
            ((8, 6), (6, 8), (4, 11), (4, 15), (6, 17))
            if wide
            else ((7, 8), (5, 10), (5, 14), (6, 15))
        )
    else:
        outer = (
            ((16, 5), (19, 7), (21, 11), (21, 15), (19, 18))
            if wide
            else ((17, 7), (20, 10), (20, 14), (18, 16))
        )
        inner = (
            ((16, 6), (18, 8), (20, 11), (20, 15), (18, 17))
            if wide
            else ((17, 8), (19, 10), (19, 14), (18, 15))
        )
    draw.line(outer, fill=MOONSTEEL["shadow"], width=2)
    draw.line(inner, fill=MOONSTEEL["highlight"], width=1)
    return result


def lunar_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    orbit_points = (
        ((21, 3),),
        ((21, 3), (21, 8)),
        ((21, 3), (21, 8), (21, 13), (21, 18)),
        ((21, 13), (21, 18)),
    )[frame]
    color = EYE if frame in (1, 2) else MOONSTEEL["highlight"]
    result = add_points(
        source,
        orbit_points,
        color,
        f"{direction} prince lunar cast {frame + 1}",
    )
    replacements = (
        {MOONSTEEL["highlight"]: MOONSTEEL["base"]},
        {
            MOONSTEEL["base"]: "#a9d9dc",
            MOONSTEEL["highlight"]: "#e1fff8",
        },
        {
            MOONSTEEL["shadow"]: "#568da4",
            MOONSTEEL["base"]: "#b8edf0",
            MOONSTEEL["highlight"]: "#ffffff",
            ROYAL["highlight"]: "#c77ad0",
        },
        {
            MOONSTEEL["base"]: "#a9d9dc",
            MOONSTEEL["highlight"]: "#e1fff8",
        },
    )[frame]
    return replace_colors(result, replacements)


def pose(
    source: Image.Image,
    animation: str,
    frame: int,
    direction: str,
) -> Image.Image:
    if animation == "idle":
        if frame == 0:
            return source.copy()
        return planted_body_bob(
            source,
            20,
            f"{direction} prince full-mass planted body bob",
        )

    if animation == "walk":
        return step_pose(source, direction, frame)

    if animation == "attack":
        if frame == 0:
            return source.copy()
        if frame == 1:
            return replace_colors(
                squash_pose(
                    source,
                    19,
                    -1 if direction == "left" else 0,
                ),
                {
                    MOONSTEEL["highlight"]: MOONSTEEL["base"],
                    ROYAL["highlight"]: ROYAL["base"],
                },
            )
        if frame == 2:
            return draw_crescent_slash(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return draw_crescent_slash(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return lunar_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    SKIN["shadow"]: "#8f799a",
                    SKIN["base"]: "#c6abc8",
                    SKIN["highlight"]: "#ffffff",
                    HAIR["shadow"]: "#b8b8c8",
                    HAIR["base"]: "#e4e2ea",
                    HAIR["highlight"]: "#ffffff",
                    ARMOR["base"]: "#898ba4",
                    ROYAL["base"]: "#b779b4",
                    MOONSTEEL["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                SKIN["highlight"]: SKIN["base"],
                HAIR["highlight"]: HAIR["base"],
                ROYAL["highlight"]: ROYAL["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {HAIR["highlight"]: HAIR["base"]},
            {
                HAIR["highlight"]: HAIR["base"],
                MOONSTEEL["highlight"]: MOONSTEEL["base"],
            },
            {
                HAIR["base"]: HAIR["shadow"],
                ROYAL["highlight"]: ROYAL["base"],
                MOONSTEEL["base"]: MOONSTEEL["shadow"],
            },
            {
                SKIN["highlight"]: SKIN["shadow"],
                SKIN["base"]: SKIN["shadow"],
                HAIR["highlight"]: "#606078",
                HAIR["base"]: "#606078",
                HAIR["shadow"]: "#3c3d55",
                ARMOR["highlight"]: ARMOR["shadow"],
                ARMOR["base"]: ARMOR["shadow"],
                ROYAL["highlight"]: ROYAL["shadow"],
                ROYAL["base"]: ROYAL["shadow"],
                MOONSTEEL["highlight"]: MOONSTEEL["shadow"],
                MOONSTEEL["base"]: MOONSTEEL["shadow"],
                EYE: "#39515d",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Royal Night Elf Prince boss-animation-v1 pilot."
    )
    parser.add_argument(
        "--runtime-root",
        type=Path,
        default=DEFAULT_RUNTIME_ROOT,
    )
    arguments = parser.parse_args()
    manifest = build_assets(
        boss_id=BOSS_ID,
        sources=source_directions(),
        pose=pose,
        base_module=base,
        ramps=(
            ("skin", SKIN),
            ("hair", HAIR),
            ("armor", ARMOR),
            ("royal", ROYAL),
            ("moonsteel", MOONSTEEL),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
