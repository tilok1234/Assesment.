from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from boss_animation_generator_common import (
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

import generate_chad_the_fantastic_guard_directions_v1 as directions
import generate_chad_the_fantastic_guard_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "chad-the-fantastic-guard"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
SKIN = base.SKIN
HAIR = base.HAIR
ARMOR = base.ARMOR
GOLD = base.GOLD
CAPE = base.CAPE
STEEL = base.STEEL


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def parade_step(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (7, 15, 14, 22)
        trailing = (12, 15, 20, 22)
    else:
        leading = (6, 15, 12, 22)
        trailing = (12, 15, 19, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} Chad leading parade stomp",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} Chad trailing parade plant",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} Chad cape-and-armor contact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} Chad crossing parade stomp",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} Chad recovery parade plant",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} Chad recovery cape-and-armor dip",
    )


def fantastic_bash(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((17, 5), (13, 6), (8, 9), (4, 13), (2, 17))
            if wide
            else ((16, 7), (12, 9), (7, 13), (4, 17))
        )
        inner = (
            ((17, 6), (13, 7), (8, 10), (4, 14), (3, 17))
            if wide
            else ((16, 8), (12, 10), (7, 14), (5, 17))
        )
    elif direction == "up":
        outer = (
            ((5, 18), (8, 13), (12, 9), (17, 5), (21, 3))
            if wide
            else ((7, 18), (10, 14), (15, 9), (19, 5))
        )
        inner = (
            ((6, 18), (9, 13), (13, 9), (18, 5), (21, 4))
            if wide
            else ((8, 18), (11, 14), (16, 9), (20, 5))
        )
    else:
        outer = (
            ((5, 5), (9, 6), (14, 9), (19, 13), (22, 17))
            if wide
            else ((7, 7), (11, 9), (16, 14), (20, 18))
        )
        inner = (
            ((5, 6), (9, 7), (14, 10), (19, 14), (21, 17))
            if wide
            else ((7, 8), (11, 10), (16, 15), (19, 18))
        )
    draw.line(outer, fill=GOLD["shadow"], width=2)
    draw.line(inner, fill=GOLD["highlight"], width=1)
    tip_x, tip_y = inner[-1]
    draw.point((tip_x, tip_y), fill=STEEL["highlight"])
    if not wide:
        sparkle = (21, 3) if direction == "left" else (6, 2)
        draw_radiant_star(
            draw,
            sparkle[0],
            sparkle[1],
            GOLD["highlight"],
        )
    return result


def draw_radiant_star(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    color: str,
) -> None:
    draw.point((x, y - 1), fill=color)
    draw.point((x, y + 1), fill=color)
    draw.point((x - 1, y), fill=color)
    draw.point((x + 1, y), fill=color)
    draw.point((x, y), fill=GOLD["highlight"])


def guard_oath_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    posed = (
        source.copy()
        if frame == 0
        else squash_pose(source, 19 if frame == 1 else 18)
        if frame in (1, 2)
        else planted_body_bob(
            source,
            20,
            f"{direction} Chad radiant oath recovery",
        )
    )
    result = posed.copy()
    draw = ImageDraw.Draw(result)
    star_sets = (
        ((6, 3),),
        ((6, 3), (18, 3)),
        ((6, 3), (18, 3), (6, 20), (18, 20)),
        ((8, 2), (16, 2)),
    )[frame]
    for x, y in star_sets:
        draw_radiant_star(
            draw,
            x,
            y,
            GOLD["highlight"] if frame >= 1 else GOLD["base"],
        )

    replacements = (
        {GOLD["highlight"]: GOLD["base"]},
        {
            GOLD["shadow"]: "#9a6528",
            GOLD["base"]: "#e2a63d",
            GOLD["highlight"]: "#fff09a",
        },
        {
            GOLD["shadow"]: "#c8872d",
            GOLD["base"]: "#ffd45d",
            GOLD["highlight"]: "#ffffff",
            ARMOR["highlight"]: "#92b6ff",
            EYE: "#ffffff",
        },
        {
            GOLD["shadow"]: "#9a6528",
            GOLD["base"]: "#e2a63d",
            GOLD["highlight"]: "#fff09a",
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
            f"{direction} Chad full-cape heroic breath",
        )

    if animation == "walk":
        return parade_step(source, direction, frame)

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
                    GOLD["highlight"]: GOLD["base"],
                    STEEL["highlight"]: STEEL["base"],
                },
            )
        if frame == 2:
            return fantastic_bash(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        recovery_box = (
            (7, 15, 14, 22)
            if direction == "left"
            else (6, 15, 12, 22)
        )
        return fantastic_bash(
            move_region(
                source,
                recovery_box,
                1 if direction == "left" else -1,
                0,
                f"{direction} Chad fantastic-bash recovery step",
            ),
            direction,
            False,
        )

    if animation == "cast":
        return guard_oath_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    SKIN["shadow"]: "#a9917c",
                    SKIN["base"]: "#ead6bd",
                    SKIN["highlight"]: "#ffffff",
                    HAIR["base"]: "#ffe28a",
                    ARMOR["base"]: "#a8bce6",
                    GOLD["base"]: "#ffeaa2",
                    STEEL["highlight"]: "#ffffff",
                    EYE: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                SKIN["highlight"]: SKIN["base"],
                HAIR["highlight"]: HAIR["base"],
                ARMOR["highlight"]: ARMOR["base"],
                GOLD["highlight"]: GOLD["base"],
                CAPE["highlight"]: CAPE["base"],
                STEEL["highlight"]: STEEL["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {GOLD["highlight"]: GOLD["base"]},
            {
                HAIR["highlight"]: HAIR["base"],
                ARMOR["highlight"]: ARMOR["base"],
                GOLD["highlight"]: GOLD["base"],
                EYE: STEEL["highlight"],
            },
            {
                HAIR["base"]: HAIR["shadow"],
                ARMOR["base"]: ARMOR["shadow"],
                CAPE["highlight"]: CAPE["base"],
                GOLD["base"]: GOLD["shadow"],
                STEEL["highlight"]: STEEL["base"],
            },
            {
                SKIN["highlight"]: "#6b5548",
                SKIN["base"]: "#6b5548",
                SKIN["shadow"]: "#3f3430",
                HAIR["highlight"]: "#695b38",
                HAIR["base"]: "#695b38",
                HAIR["shadow"]: "#453b2b",
                ARMOR["highlight"]: "#3c4763",
                ARMOR["base"]: "#3c4763",
                ARMOR["shadow"]: "#252d40",
                GOLD["highlight"]: "#66563a",
                GOLD["base"]: "#66563a",
                GOLD["shadow"]: "#443b2e",
                CAPE["highlight"]: CAPE["shadow"],
                CAPE["base"]: CAPE["shadow"],
                STEEL["highlight"]: "#56606b",
                STEEL["base"]: "#56606b",
                STEEL["shadow"]: "#353d49",
                EYE: "#4d5057",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Generate the Chad the Fantastic Guard "
            "boss-animation-v1 pilot."
        )
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
            ("gold", GOLD),
            ("cape", CAPE),
            ("steel", STEEL),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
