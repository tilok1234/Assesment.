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

import generate_tide_man_the_blue_directions_v1 as directions
import generate_tide_man_the_blue_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "tide-man-the-blue"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
DEEP = base.DEEP
SHELL = base.SHELL
TIDE = base.TIDE
FOAM = base.FOAM


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
        leading = (6, 16, 12, 22)
        trailing = (11, 16, 19, 22)
    else:
        leading = (7, 16, 12, 22)
        trailing = (12, 16, 18, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} tide man leading stride",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} tide man trailing stride",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} tide man trailing-foot contact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} tide man crossing stride",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} tide man recovery stride",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} tide man recovery-foot contact dip",
    )


def tidal_strike(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((9, 7), (6, 8), (3, 11), (2, 15), (5, 18))
            if wide
            else ((8, 9), (5, 11), (4, 15), (6, 17))
        )
        inner = (
            ((8, 8), (6, 10), (4, 12), (3, 15), (5, 17))
            if wide
            else ((8, 10), (6, 12), (5, 15), (6, 16))
        )
    elif direction == "up":
        outer = (
            ((5, 14), (4, 10), (6, 6), (9, 3), (12, 2), (16, 4), (19, 8))
            if wide
            else ((6, 14), (6, 10), (8, 7), (11, 5), (15, 6))
        )
        inner = (
            ((6, 14), (5, 10), (7, 7), (10, 4), (13, 3), (16, 5))
            if wide
            else ((7, 14), (7, 10), (9, 8), (12, 6), (14, 7))
        )
    else:
        outer = (
            ((5, 10), (3, 13), (4, 17), (8, 19), (12, 20), (17, 18), (20, 14))
            if wide
            else ((6, 11), (4, 14), (6, 17), (10, 19), (15, 18))
        )
        inner = (
            ((6, 11), (4, 14), (5, 16), (9, 18), (13, 19), (17, 17))
            if wide
            else ((7, 12), (5, 14), (7, 16), (10, 18), (14, 17))
        )
    draw.line(outer, fill=TIDE["shadow"], width=2)
    draw.line(inner, fill=FOAM["highlight"], width=1)
    return result


def tide_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    droplets = (
        ((2, 18),),
        ((2, 18), (21, 17), (3, 9)),
        ((2, 18), (21, 17), (3, 9), (20, 8), (6, 3), (18, 3)),
        ((21, 17), (20, 8), (18, 3), (5, 5)),
    )[frame]
    result = add_points(
        source,
        droplets,
        FOAM["highlight"] if frame in (1, 2) else TIDE["highlight"],
        f"{direction} tide man current cast {frame + 1}",
    )
    replacements = (
        {FOAM["highlight"]: FOAM["base"]},
        {
            TIDE["base"]: TIDE["highlight"],
            FOAM["base"]: FOAM["highlight"],
        },
        {
            DEEP["highlight"]: TIDE["base"],
            TIDE["shadow"]: TIDE["base"],
            TIDE["base"]: TIDE["highlight"],
            TIDE["highlight"]: FOAM["base"],
            FOAM["highlight"]: "#ffffff",
        },
        {
            TIDE["base"]: TIDE["highlight"],
            FOAM["base"]: FOAM["highlight"],
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
            f"{direction} tide man full-mass planted body bob",
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
                    FOAM["highlight"]: FOAM["base"],
                    TIDE["highlight"]: TIDE["base"],
                },
            )
        if frame == 2:
            return tidal_strike(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return tidal_strike(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return tide_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    DEEP["shadow"]: "#275da0",
                    DEEP["base"]: "#4f9ed4",
                    DEEP["highlight"]: "#8ce8ed",
                    SHELL["base"]: "#78afbf",
                    TIDE["base"]: FOAM["base"],
                    FOAM["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                DEEP["highlight"]: DEEP["base"],
                TIDE["highlight"]: TIDE["base"],
                FOAM["highlight"]: FOAM["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {FOAM["highlight"]: FOAM["base"]},
            {
                TIDE["highlight"]: TIDE["base"],
                FOAM["highlight"]: FOAM["base"],
            },
            {
                DEEP["highlight"]: DEEP["shadow"],
                TIDE["base"]: TIDE["shadow"],
                FOAM["base"]: FOAM["shadow"],
            },
            {
                DEEP["highlight"]: DEEP["shadow"],
                DEEP["base"]: DEEP["shadow"],
                SHELL["highlight"]: SHELL["shadow"],
                SHELL["base"]: SHELL["shadow"],
                TIDE["highlight"]: "#173852",
                TIDE["base"]: "#173852",
                TIDE["shadow"]: "#10283d",
                FOAM["highlight"]: "#31576b",
                FOAM["base"]: "#31576b",
                FOAM["shadow"]: "#203d50",
                EYE: "#285466",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Tide Man the Blue boss-animation-v1 pilot."
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
            ("deep", DEEP),
            ("shell", SHELL),
            ("tide", TIDE),
            ("foam", FOAM),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
