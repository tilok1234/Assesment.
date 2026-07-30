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

import generate_dragon_rider_of_the_fallen_directions_v1 as directions
import generate_dragon_rider_of_the_fallen_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "dragon-rider-of-the-fallen"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
FLESH = base.FLESH
SCALE = base.SCALE
BONE = base.BONE
CLOAK = base.CLOAK
SOUL = base.SOUL


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def rider_step(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (6, 17, 11, 22)
        trailing = (10, 17, 16, 22)
    else:
        leading = (7, 17, 12, 22)
        trailing = (12, 17, 18, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} fallen rider leading armored step",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} fallen rider trailing armored step",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} fallen rider trailing-foot contact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} fallen rider crossing armored step",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} fallen rider planted recovery step",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} fallen rider recovery-foot contact dip",
    )


def dragon_lance_rend(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((8, 5), (5, 7), (3, 11), (2, 16), (4, 19))
            if wide
            else ((7, 8), (4, 11), (3, 15), (5, 17))
        )
        inner = (
            ((8, 6), (6, 8), (4, 12), (3, 16), (5, 18))
            if wide
            else ((7, 9), (5, 11), (4, 15), (5, 16))
        )
    elif direction == "up":
        outer = (
            ((4, 15), (6, 10), (10, 6), (14, 3), (19, 2))
            if wide
            else ((6, 15), (8, 11), (12, 7), (17, 4))
        )
        inner = (
            ((5, 16), (7, 11), (11, 7), (15, 4), (19, 3))
            if wide
            else ((7, 16), (9, 12), (13, 8), (17, 5))
        )
    else:
        outer = (
            ((5, 6), (8, 8), (12, 11), (17, 15), (21, 18))
            if wide
            else ((7, 8), (11, 11), (16, 14), (20, 16))
        )
        inner = (
            ((5, 7), (8, 9), (12, 12), (17, 16), (21, 19))
            if wide
            else ((7, 9), (11, 12), (16, 15), (20, 17))
        )
    draw.line(outer, fill=BONE["shadow"], width=2)
    draw.line(inner, fill=SOUL["highlight"], width=1)
    return result


def fallen_bond_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    motes = (
        ((2, 2), (21, 2)),
        ((2, 2), (21, 2), (2, 8), (21, 8)),
        ((2, 2), (21, 2), (2, 8), (21, 8), (2, 20), (21, 20)),
        ((2, 8), (21, 8), (2, 20), (21, 20)),
    )[frame]
    result = add_points(
        source,
        motes,
        SOUL["highlight"] if frame in (1, 2) else SOUL["base"],
        f"{direction} fallen dragon-bond cast {frame + 1}",
    )
    replacements = (
        {SOUL["highlight"]: SOUL["base"]},
        {
            SOUL["shadow"]: "#2b9b9b",
            SOUL["base"]: "#62e7dc",
            SOUL["highlight"]: "#d8fff7",
        },
        {
            SOUL["shadow"]: "#45b8b1",
            SOUL["base"]: "#9bfff0",
            SOUL["highlight"]: "#ffffff",
            EYE: "#ffffff",
            CLOAK["highlight"]: "#cf5961",
        },
        {
            SOUL["shadow"]: "#2b9b9b",
            SOUL["base"]: "#62e7dc",
            SOUL["highlight"]: "#d8fff7",
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
            f"{direction} fallen rider full-mass planted body bob",
        )

    if animation == "walk":
        return rider_step(source, direction, frame)

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
                    BONE["highlight"]: BONE["base"],
                    SOUL["highlight"]: SOUL["base"],
                },
            )
        if frame == 2:
            return dragon_lance_rend(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return dragon_lance_rend(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return fallen_bond_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    FLESH["shadow"]: "#8b7f88",
                    FLESH["base"]: "#c5b5ba",
                    FLESH["highlight"]: "#ffffff",
                    SCALE["base"]: "#7b6e7d",
                    BONE["base"]: "#e3d6b5",
                    CLOAK["base"]: "#a94c58",
                    SOUL["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                FLESH["highlight"]: FLESH["base"],
                BONE["highlight"]: BONE["base"],
                CLOAK["highlight"]: CLOAK["base"],
                SOUL["highlight"]: SOUL["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {SOUL["highlight"]: SOUL["base"]},
            {
                BONE["highlight"]: BONE["base"],
                SOUL["highlight"]: SOUL["base"],
            },
            {
                BONE["base"]: BONE["shadow"],
                CLOAK["highlight"]: CLOAK["base"],
                SOUL["base"]: SOUL["shadow"],
            },
            {
                FLESH["highlight"]: "#55515d",
                FLESH["base"]: "#55515d",
                FLESH["shadow"]: "#34323b",
                SCALE["highlight"]: SCALE["shadow"],
                SCALE["base"]: SCALE["shadow"],
                BONE["highlight"]: "#6a6555",
                BONE["base"]: "#6a6555",
                BONE["shadow"]: "#484438",
                CLOAK["highlight"]: CLOAK["shadow"],
                CLOAK["base"]: CLOAK["shadow"],
                SOUL["highlight"]: "#375b60",
                SOUL["base"]: "#375b60",
                SOUL["shadow"]: "#2b3e43",
                EYE: "#3e696e",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Generate the Dragon Rider of the Fallen boss-animation-v1 pilot."
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
            ("flesh", FLESH),
            ("scale", SCALE),
            ("bone", BONE),
            ("cloak", CLOAK),
            ("soul", SOUL),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
