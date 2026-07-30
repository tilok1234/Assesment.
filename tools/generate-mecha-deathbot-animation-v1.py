from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from boss_animation_generator_common import (
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

import generate_mecha_deathbot_directions_v1 as directions
import generate_mecha_deathbot_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "mecha-deathbot"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
ARMOR = base.ARMOR
STEEL = base.STEEL
REACTOR = base.REACTOR
HAZARD = base.HAZARD
WIRE = base.WIRE


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def piston_step(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (4, 15, 11, 22)
        trailing = (10, 15, 18, 22)
    else:
        leading = (5, 14, 12, 22)
        trailing = (12, 14, 21, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} deathbot leading piston step",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} deathbot trailing piston step",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} deathbot trailing magnetic-foot impact",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} deathbot crossing piston step",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} deathbot planted recovery step",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} deathbot recovery magnetic-foot impact",
    )


def crusher_cleave(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((8, 7), (5, 10), (3, 14), (2, 19))
            if wide
            else ((7, 10), (5, 13), (4, 18))
        )
        inner = (
            ((8, 8), (6, 11), (4, 14), (3, 19))
            if wide
            else ((7, 11), (6, 14), (5, 18))
        )
    elif direction == "up":
        outer = (
            ((6, 16), (8, 11), (12, 7), (17, 3))
            if wide
            else ((8, 16), (10, 12), (15, 6))
        )
        inner = (
            ((7, 16), (9, 11), (13, 7), (18, 3))
            if wide
            else ((9, 16), (11, 12), (16, 6))
        )
    else:
        outer = (
            ((5, 7), (9, 10), (14, 14), (20, 19))
            if wide
            else ((7, 10), (12, 13), (18, 18))
        )
        inner = (
            ((5, 8), (9, 11), (14, 15), (20, 20))
            if wide
            else ((7, 11), (12, 14), (18, 19))
        )
    draw.line(outer, fill=STEEL["highlight"], width=2)
    draw.line(inner, fill=REACTOR["highlight"], width=1)
    return result


def reactor_overload_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    result = source.copy()
    draw = ImageDraw.Draw(result)
    arc_sets = (
        (((11, 4), (9, 3), (8, 4)),),
        (
            ((7, 10), (5, 8), (3, 9)),
            ((17, 10), (19, 8), (21, 9)),
        ),
        (
            ((8, 8), (5, 6), (2, 3)),
            ((16, 8), (19, 6), (21, 3)),
            ((8, 17), (6, 20), (3, 21)),
            ((16, 17), (18, 20), (21, 21)),
        ),
        (
            ((7, 11), (5, 9), (3, 10)),
            ((17, 11), (19, 9), (20, 10)),
        ),
    )[frame]
    for arc in arc_sets:
        draw.line(arc, fill=REACTOR["shadow"], width=2)
        draw.line(arc, fill=REACTOR["highlight"], width=1)

    replacements = (
        {REACTOR["highlight"]: REACTOR["base"]},
        {
            REACTOR["shadow"]: "#a62830",
            REACTOR["base"]: "#ed4d3d",
            REACTOR["highlight"]: "#ffba62",
        },
        {
            REACTOR["shadow"]: "#d13b35",
            REACTOR["base"]: "#ff6a45",
            REACTOR["highlight"]: "#fff4b0",
            EYE: "#ffffff",
            WIRE["highlight"]: "#a9f0e4",
        },
        {
            REACTOR["shadow"]: "#a62830",
            REACTOR["base"]: "#ed4d3d",
            REACTOR["highlight"]: "#ffba62",
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
            f"{direction} deathbot full-chassis planted servo bob",
        )

    if animation == "walk":
        return piston_step(source, direction, frame)

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
                    STEEL["highlight"]: STEEL["base"],
                    REACTOR["highlight"]: REACTOR["base"],
                },
            )
        if frame == 2:
            return crusher_cleave(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return crusher_cleave(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return reactor_overload_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    ARMOR["shadow"]: "#8d9299",
                    ARMOR["base"]: "#c6cdd0",
                    ARMOR["highlight"]: "#ffffff",
                    STEEL["base"]: "#e4e8e8",
                    REACTOR["base"]: "#ffd0a1",
                    EYE: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                ARMOR["highlight"]: ARMOR["base"],
                STEEL["highlight"]: STEEL["base"],
                REACTOR["highlight"]: REACTOR["base"],
                WIRE["highlight"]: WIRE["base"],
                HAZARD["highlight"]: HAZARD["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {REACTOR["highlight"]: REACTOR["base"]},
            {
                ARMOR["highlight"]: ARMOR["base"],
                REACTOR["highlight"]: REACTOR["base"],
                EYE: REACTOR["base"],
            },
            {
                ARMOR["base"]: ARMOR["shadow"],
                STEEL["highlight"]: STEEL["base"],
                REACTOR["base"]: REACTOR["shadow"],
                WIRE["highlight"]: WIRE["base"],
            },
            {
                ARMOR["highlight"]: "#424650",
                ARMOR["base"]: "#424650",
                ARMOR["shadow"]: "#292d35",
                STEEL["highlight"]: "#686c70",
                STEEL["base"]: "#686c70",
                STEEL["shadow"]: "#3f4348",
                REACTOR["highlight"]: "#5b3534",
                REACTOR["base"]: "#5b3534",
                REACTOR["shadow"]: "#3d292c",
                HAZARD["highlight"]: HAZARD["shadow"],
                HAZARD["base"]: HAZARD["shadow"],
                WIRE["highlight"]: WIRE["shadow"],
                WIRE["base"]: WIRE["shadow"],
                EYE: "#4b3032",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Mecha Deathbot boss-animation-v1 pilot."
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
            ("armor", ARMOR),
            ("steel", STEEL),
            ("reactor", REACTOR),
            ("hazard", HAZARD),
            ("wire", WIRE),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
