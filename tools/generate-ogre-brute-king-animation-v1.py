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

import generate_ogre_brute_king_directions_v1 as directions
import generate_ogre_brute_king_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "ogre-brute-king"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
OGRE = base.OGRE
GOLD = base.GOLD
FUR = base.FUR
IRON = base.IRON
WOOD = base.WOOD
BONE = base.BONE


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def brute_step(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (5, 17, 11, 22)
        trailing = (10, 17, 17, 22)
    else:
        leading = (5, 17, 12, 22)
        trailing = (12, 17, 20, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} ogre king leading stomp",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} ogre king trailing stomp",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} ogre king trailing-foot impact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} ogre king crossing stomp",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} ogre king planted recovery stomp",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} ogre king recovery-foot impact dip",
    )


def king_maul_slam(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((8, 7), (5, 10), (3, 15), (2, 20))
            if wide
            else ((7, 10), (5, 13), (4, 18))
        )
        inner = (
            ((8, 8), (6, 11), (4, 15), (3, 20))
            if wide
            else ((7, 11), (6, 14), (5, 18))
        )
    elif direction == "up":
        outer = (
            ((7, 16), (9, 11), (12, 6), (15, 3))
            if wide
            else ((9, 16), (11, 11), (14, 6))
        )
        inner = (
            ((8, 16), (10, 11), (13, 6), (16, 3))
            if wide
            else ((10, 16), (12, 11), (15, 6))
        )
    else:
        outer = (
            ((6, 8), (10, 11), (15, 15), (20, 19))
            if wide
            else ((8, 10), (12, 13), (18, 18))
        )
        inner = (
            ((6, 9), (10, 12), (15, 16), (20, 20))
            if wide
            else ((8, 11), (12, 14), (18, 19))
        )
    draw.line(outer, fill=IRON["shadow"], width=2)
    draw.line(inner, fill=GOLD["highlight"], width=1)
    return result


def royal_roar_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    sparks = (
        ((2, 2), (21, 2)),
        ((2, 2), (21, 2), (2, 8), (21, 8)),
        ((2, 2), (21, 2), (2, 8), (21, 8), (2, 20), (21, 20)),
        ((2, 8), (21, 8), (2, 20), (21, 20)),
    )[frame]
    result = add_points(
        source,
        sparks,
        GOLD["highlight"] if frame in (1, 2) else GOLD["base"],
        f"{direction} ogre king royal roar {frame + 1}",
    )
    replacements = (
        {GOLD["highlight"]: GOLD["base"]},
        {
            GOLD["shadow"]: "#a66b19",
            GOLD["base"]: "#e1a62f",
            GOLD["highlight"]: "#fff0a3",
        },
        {
            GOLD["shadow"]: "#cf7c1c",
            GOLD["base"]: "#ffd15a",
            GOLD["highlight"]: "#ffffff",
            EYE: "#fff6ba",
            OGRE["highlight"]: "#b9d982",
        },
        {
            GOLD["shadow"]: "#a66b19",
            GOLD["base"]: "#e1a62f",
            GOLD["highlight"]: "#fff0a3",
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
            f"{direction} ogre king full-mass planted body bob",
        )

    if animation == "walk":
        return brute_step(source, direction, frame)

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
                    IRON["highlight"]: IRON["base"],
                    GOLD["highlight"]: GOLD["base"],
                },
            )
        if frame == 2:
            return king_maul_slam(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return king_maul_slam(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return royal_roar_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    OGRE["shadow"]: "#8a846f",
                    OGRE["base"]: "#c9c3a3",
                    OGRE["highlight"]: "#ffffff",
                    GOLD["base"]: "#f0d5a0",
                    FUR["base"]: "#b9a79e",
                    EYE: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                OGRE["highlight"]: OGRE["base"],
                GOLD["highlight"]: GOLD["base"],
                FUR["highlight"]: FUR["base"],
                IRON["highlight"]: IRON["base"],
                BONE["highlight"]: BONE["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {GOLD["highlight"]: GOLD["base"]},
            {
                OGRE["highlight"]: OGRE["base"],
                GOLD["highlight"]: GOLD["base"],
                BONE["highlight"]: BONE["base"],
            },
            {
                OGRE["base"]: OGRE["shadow"],
                GOLD["base"]: GOLD["shadow"],
                FUR["highlight"]: FUR["base"],
                IRON["highlight"]: IRON["base"],
            },
            {
                OGRE["highlight"]: "#555845",
                OGRE["base"]: "#555845",
                OGRE["shadow"]: "#35382d",
                GOLD["highlight"]: "#77683d",
                GOLD["base"]: "#77683d",
                GOLD["shadow"]: "#514628",
                FUR["highlight"]: FUR["shadow"],
                FUR["base"]: FUR["shadow"],
                IRON["highlight"]: "#555761",
                IRON["base"]: "#555761",
                IRON["shadow"]: "#343640",
                WOOD["highlight"]: WOOD["shadow"],
                WOOD["base"]: WOOD["shadow"],
                BONE["highlight"]: "#77705d",
                BONE["base"]: "#77705d",
                BONE["shadow"]: "#4d493d",
                EYE: "#6c6a3c",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Ogre Brute King boss-animation-v1 pilot."
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
            ("ogre", OGRE),
            ("gold", GOLD),
            ("fur", FUR),
            ("iron", IRON),
            ("wood", WOOD),
            ("bone", BONE),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
