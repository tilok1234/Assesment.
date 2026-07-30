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

import generate_flowered_jungle_tribe_beast_man_directions_v1 as directions
import generate_flowered_jungle_tribe_beast_man_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "flowered-jungle-tribe-beast-man"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
FUR = base.FUR
LEAF = base.LEAF
WOOD = base.WOOD
FLOWER = base.FLOWER
BONE = base.BONE


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def beast_step(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (3, 14, 12, 23)
        trailing = (11, 14, 20, 23)
    else:
        leading = (4, 14, 12, 23)
        trailing = (12, 14, 21, 23)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} beast-man leading claw prowl",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} beast-man trailing claw plant",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} beast-man shoulder-and-mane impact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} beast-man crossing claw prowl",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} beast-man recovery claw step",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} beast-man recovery shoulder-and-mane dip",
    )


def thornwood_sweep(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((18, 4), (14, 5), (9, 8), (5, 12), (2, 17))
            if wide
            else ((16, 6), (12, 8), (7, 13), (4, 18))
        )
        inner = (
            ((18, 5), (14, 6), (9, 9), (5, 13), (3, 17))
            if wide
            else ((16, 7), (12, 9), (7, 14), (5, 18))
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
            ((5, 4), (9, 5), (14, 8), (19, 12), (22, 17))
            if wide
            else ((7, 6), (11, 8), (16, 13), (20, 18))
        )
        inner = (
            ((5, 5), (9, 6), (14, 9), (19, 13), (21, 17))
            if wide
            else ((7, 7), (11, 9), (16, 14), (19, 18))
        )
    draw.line(outer, fill=LEAF["shadow"], width=2)
    draw.line(inner, fill=LEAF["highlight"], width=1)
    tip_x, tip_y = inner[-1]
    draw.point((tip_x, tip_y), fill=FLOWER["highlight"])
    return result


def jungle_bloom_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    result = source.copy()
    draw = ImageDraw.Draw(result)
    bloom_sets = (
        ((12, 3),),
        ((4, 8), (20, 9)),
        ((3, 5), (21, 5), (3, 18), (21, 18)),
        ((5, 7), (19, 8), (6, 19), (18, 19)),
    )[frame]
    for x, y in bloom_sets:
        draw.rectangle((x - 1, y, x + 1, y), fill=FLOWER["base"])
        draw.rectangle((x, y - 1, x, y + 1), fill=FLOWER["highlight"])
        if frame >= 2:
            leaf_dx = -1 if x > 12 else 1
            draw.line(
                ((x, y + 1), (x + leaf_dx, y + 3)),
                fill=LEAF["highlight"],
                width=1,
            )

    replacements = (
        {FLOWER["highlight"]: FLOWER["base"]},
        {
            FLOWER["shadow"]: "#a6425b",
            FLOWER["base"]: "#ef6c7e",
            FLOWER["highlight"]: "#ffe0a4",
        },
        {
            FLOWER["shadow"]: "#d14b68",
            FLOWER["base"]: "#ff8292",
            FLOWER["highlight"]: "#fff3b4",
            LEAF["highlight"]: "#a9e879",
            EYE: "#fff5a4",
        },
        {
            FLOWER["shadow"]: "#a6425b",
            FLOWER["base"]: "#ef6c7e",
            FLOWER["highlight"]: "#ffe0a4",
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
            f"{direction} beast-man full-mane planted breath",
        )

    if animation == "walk":
        return beast_step(source, direction, frame)

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
                    LEAF["highlight"]: LEAF["base"],
                    FLOWER["highlight"]: FLOWER["base"],
                },
            )
        if frame == 2:
            return thornwood_sweep(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        recovery_box = (
            (3, 14, 12, 23)
            if direction == "left"
            else (4, 14, 12, 23)
        )
        return thornwood_sweep(
            move_region(
                source,
                recovery_box,
                1 if direction == "left" else -1,
                0,
                f"{direction} beast-man spear-sweep recovery claw",
            ),
            direction,
            False,
        )

    if animation == "cast":
        return jungle_bloom_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    FUR["shadow"]: "#9b7d61",
                    FUR["base"]: "#e3c39b",
                    FUR["highlight"]: "#fff3d2",
                    LEAF["base"]: "#b8d990",
                    FLOWER["base"]: "#ffc0c2",
                    EYE: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                FUR["highlight"]: FUR["base"],
                LEAF["highlight"]: LEAF["base"],
                WOOD["highlight"]: WOOD["base"],
                FLOWER["highlight"]: FLOWER["base"],
                BONE["highlight"]: BONE["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {FLOWER["highlight"]: FLOWER["base"]},
            {
                FUR["highlight"]: FUR["base"],
                LEAF["highlight"]: LEAF["base"],
                FLOWER["highlight"]: FLOWER["base"],
                EYE: FLOWER["highlight"],
            },
            {
                FUR["base"]: FUR["shadow"],
                LEAF["base"]: LEAF["shadow"],
                WOOD["highlight"]: WOOD["base"],
                FLOWER["base"]: FLOWER["shadow"],
            },
            {
                FUR["highlight"]: "#5c4a38",
                FUR["base"]: "#5c4a38",
                FUR["shadow"]: "#352c27",
                LEAF["highlight"]: "#3e5b37",
                LEAF["base"]: "#3e5b37",
                LEAF["shadow"]: "#253728",
                WOOD["highlight"]: "#54412f",
                WOOD["base"]: "#54412f",
                WOOD["shadow"]: "#312a23",
                FLOWER["highlight"]: "#6c4a55",
                FLOWER["base"]: "#6c4a55",
                FLOWER["shadow"]: "#44333a",
                BONE["highlight"]: BONE["shadow"],
                BONE["base"]: BONE["shadow"],
                EYE: "#4c4430",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Generate the Flowered Jungle Tribe Beast-Man "
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
            ("fur", FUR),
            ("leaf", LEAF),
            ("wood", WOOD),
            ("flower", FLOWER),
            ("bone", BONE),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
