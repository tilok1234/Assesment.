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

import generate_fierce_void_dragon_directions_v1 as directions
import generate_fierce_void_dragon_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "fierce-void-dragon"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
SCALE = base.SCALE
PLATE = base.PLATE
WING = base.WING
RIFT = base.RIFT


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def claw_step(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (7, 15, 13, 22)
        trailing = (13, 15, 20, 22)
    else:
        leading = (5, 14, 12, 22)
        trailing = (12, 14, 20, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} void dragon leading claw stride",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} void dragon trailing claw stride",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} void dragon trailing-claw contact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} void dragon crossing claw stride",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} void dragon recovery claw stride",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} void dragon recovery-claw contact dip",
    )


def void_rend(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        slashes = (
            (((9, 7), (5, 10), (2, 15), (3, 19)),
             ((11, 8), (7, 12), (4, 18)),
             ((12, 10), (9, 14), (7, 19)))
            if wide
            else (((9, 9), (6, 12), (4, 17)),
                  ((11, 10), (8, 14), (6, 18)))
        )
    elif direction == "up":
        slashes = (
            (((5, 15), (5, 10), (8, 6), (12, 3)),
             ((8, 17), (8, 11), (11, 7), (15, 4)),
             ((11, 18), (12, 12), (16, 8), (19, 6)))
            if wide
            else (((6, 15), (7, 11), (10, 7)),
                  ((9, 17), (10, 12), (14, 8)))
        )
    else:
        slashes = (
            (((4, 10), (3, 14), (5, 19), (9, 21)),
             ((8, 11), (7, 16), (10, 20), (15, 21)),
             ((12, 11), (13, 16), (17, 19), (20, 18)))
            if wide
            else (((5, 12), (5, 16), (8, 19)),
                  ((10, 13), (11, 17), (15, 19)))
        )
    for index, slash in enumerate(slashes):
        draw.line(
            slash,
            fill=RIFT["highlight"] if index == 1 else RIFT["shadow"],
            width=1 if index == 1 else 2,
        )
    return result


def void_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    motes = (
        ((2, 2),),
        ((2, 2), (21, 2)),
        ((2, 2), (21, 2), (2, 20), (21, 20)),
        ((2, 20), (21, 20)),
    )[frame]
    result = add_points(
        source,
        motes,
        RIFT["highlight"] if frame in (1, 2) else WING["highlight"],
        f"{direction} void dragon rift cast {frame + 1}",
    )
    replacements = (
        {RIFT["highlight"]: RIFT["base"]},
        {
            WING["base"]: WING["highlight"],
            RIFT["base"]: RIFT["highlight"],
        },
        {
            SCALE["highlight"]: RIFT["base"],
            WING["shadow"]: WING["base"],
            WING["base"]: WING["highlight"],
            RIFT["base"]: RIFT["highlight"],
            RIFT["highlight"]: "#ffffff",
        },
        {
            WING["base"]: WING["highlight"],
            RIFT["base"]: RIFT["highlight"],
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
            f"{direction} void dragon full-mass planted body bob",
        )

    if animation == "walk":
        return claw_step(source, direction, frame)

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
                    RIFT["highlight"]: RIFT["base"],
                    WING["highlight"]: WING["base"],
                },
            )
        if frame == 2:
            return void_rend(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return void_rend(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return void_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    SCALE["shadow"]: "#5d447b",
                    SCALE["base"]: "#a178c0",
                    SCALE["highlight"]: "#e4b8ec",
                    PLATE["base"]: "#a2a5c9",
                    WING["base"]: RIFT["base"],
                    RIFT["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                SCALE["highlight"]: SCALE["base"],
                WING["highlight"]: WING["base"],
                RIFT["highlight"]: RIFT["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {RIFT["highlight"]: RIFT["base"]},
            {
                WING["highlight"]: WING["base"],
                RIFT["highlight"]: RIFT["base"],
            },
            {
                SCALE["highlight"]: SCALE["shadow"],
                WING["base"]: WING["shadow"],
                RIFT["base"]: RIFT["shadow"],
            },
            {
                SCALE["highlight"]: "#302950",
                SCALE["base"]: "#302950",
                SCALE["shadow"]: "#1c1932",
                PLATE["highlight"]: "#484961",
                PLATE["base"]: "#484961",
                PLATE["shadow"]: "#292a3b",
                WING["highlight"]: "#3f2558",
                WING["base"]: "#3f2558",
                WING["shadow"]: "#281836",
                RIFT["highlight"]: "#59315f",
                RIFT["base"]: "#59315f",
                RIFT["shadow"]: "#38213e",
                EYE: "#5e3966",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Fierce Void Dragon boss-animation-v1 pilot."
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
            ("scale", SCALE),
            ("plate", PLATE),
            ("wing", WING),
            ("rift", RIFT),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
