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

import generate_lava_core_colossus_directions_v1 as directions
import generate_lava_core_colossus_style_v2 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "lava-core-colossus"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
STONE = base.STONE
MAGMA = base.MAGMA


def source_directions() -> dict[str, Image.Image]:
    left = directions.left_source()
    return {
        "down": base.logical_source(),
        "left": left,
        "up": directions.up_source(),
    }


def draw_magma_slam(image: Image.Image, direction: str) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outline = ((2, 20), (5, 18), (8, 20), (11, 19))
        magma = ((3, 20), (5, 19), (7, 20), (10, 19))
    else:
        outline = ((3, 20), (7, 18), (11, 20), (15, 18), (20, 20))
        magma = ((4, 20), (7, 19), (11, 20), (15, 19), (19, 20))
    draw.line(outline, fill=OUTLINE, width=2)
    draw.line(magma, fill=MAGMA["highlight"], width=1)
    return result


def add_core_aura(image: Image.Image, frame: int) -> Image.Image:
    points = (
        ((2, 2),),
        ((2, 2), (21, 2)),
        ((2, 2), (21, 2), (2, 20), (21, 20)),
        ((2, 20), (21, 20)),
    )[frame]
    color = MAGMA["highlight"] if frame == 2 else MAGMA["base"]
    return add_points(image, points, color, f"lava cast {frame + 1}")


def idle_settle(source: Image.Image, direction: str) -> Image.Image:
    return move_region(
        source,
        (2, 2, 22, 13),
        0,
        1,
        f"{direction} lava planted upper-body settle",
    )


def lifted_foot(
    source: Image.Image,
    direction: str,
    leading: bool,
) -> Image.Image:
    if direction == "left":
        box = (5, 18, 10, 22) if leading else (12, 18, 17, 22)
    else:
        box = (6, 18, 11, 22) if leading else (13, 18, 18, 22)
    phase = "leading" if leading else "trailing"
    return move_region(
        source,
        box,
        0,
        -1,
        f"{direction} lava {phase} stone-foot lift",
    )


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
            f"{direction} lava full-mass planted body bob",
        )

    if animation == "walk":
        if frame == 0:
            return lifted_foot(source, direction, True)
        if frame == 1:
            return idle_settle(source, direction)
        if frame == 2:
            return lifted_foot(source, direction, False)
        return add_recovery_step(source, direction, OUTLINE)

    if animation == "attack":
        if frame == 0:
            return source.copy()
        if frame == 1:
            return replace_colors(
                squash_pose(source, 18),
                {STONE["highlight"]: STONE["base"]},
            )
        if frame == 2:
            return replace_colors(
                draw_magma_slam(squash_pose(source, 16), direction),
                {
                    MAGMA["base"]: MAGMA["highlight"],
                    STONE["highlight"]: "#a7a7b1",
                },
            )
        return replace_colors(
            add_recovery_step(squash_pose(source, 19), direction, OUTLINE),
            {MAGMA["highlight"]: MAGMA["base"]},
        )

    if animation == "cast":
        result = add_core_aura(source, frame)
        replacements = (
            {MAGMA["highlight"]: MAGMA["base"]},
            {
                MAGMA["base"]: "#ff7b3f",
                MAGMA["highlight"]: "#ffd35a",
            },
            {
                MAGMA["shadow"]: "#ef4d25",
                MAGMA["base"]: "#ffc13f",
                MAGMA["highlight"]: "#fff3a3",
            },
            {
                MAGMA["base"]: "#ff7b3f",
                MAGMA["highlight"]: "#ffd35a",
            },
        )[frame]
        return replace_colors(result, replacements)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    STONE["shadow"]: "#747480",
                    STONE["base"]: "#a7a7b1",
                    STONE["highlight"]: "#ffffff",
                    MAGMA["shadow"]: "#f09b78",
                    MAGMA["base"]: "#ffd0a3",
                    MAGMA["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                STONE["highlight"]: STONE["base"],
                MAGMA["highlight"]: MAGMA["shadow"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {MAGMA["highlight"]: MAGMA["base"]},
            {
                MAGMA["highlight"]: MAGMA["base"],
                MAGMA["base"]: MAGMA["shadow"],
            },
            {
                MAGMA["highlight"]: MAGMA["shadow"],
                MAGMA["base"]: MAGMA["shadow"],
            },
            {
                MAGMA["highlight"]: "#5b3027",
                MAGMA["base"]: "#5b3027",
                MAGMA["shadow"]: "#3b2928",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Lava-Core Colossus boss-animation-v1 pilot."
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
        ramps=(("stone", STONE), ("magma", MAGMA)),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
