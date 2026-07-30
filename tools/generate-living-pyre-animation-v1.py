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

import generate_living_pyre_directions_v1 as directions
import generate_living_pyre_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "living-pyre"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
EYE_GLOW = base.EYE_GLOW
CINDER = base.CINDER
IRON = base.IRON
EMBER = base.EMBER
FLAME = base.FLAME


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
        trailing = (11, 16, 18, 22)
    else:
        leading = (7, 16, 12, 22)
        trailing = (12, 16, 18, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} living pyre leading stride",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} living pyre trailing stride",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} living pyre trailing-foot contact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} living pyre crossing stride",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} living pyre recovery stride",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} living pyre recovery-foot contact dip",
    )


def fire_strike(
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
    draw.line(outer, fill=FLAME["shadow"], width=2)
    draw.line(inner, fill=FLAME["highlight"], width=1)
    return result


def inferno_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    orbit_points = (
        ((2, 18),),
        ((2, 18), (21, 17), (3, 9)),
        ((2, 18), (21, 17), (3, 9), (20, 8), (6, 3), (18, 3)),
        ((21, 17), (20, 8), (18, 3), (5, 5)),
    )[frame]
    result = add_points(
        source,
        orbit_points,
        FLAME["highlight"] if frame in (1, 2) else FLAME["base"],
        f"{direction} living pyre inferno cast {frame + 1}",
    )
    replacements = (
        {FLAME["highlight"]: FLAME["base"]},
        {
            EMBER["base"]: FLAME["base"],
            FLAME["base"]: FLAME["highlight"],
        },
        {
            CINDER["highlight"]: EMBER["base"],
            EMBER["shadow"]: EMBER["base"],
            EMBER["base"]: FLAME["base"],
            FLAME["base"]: FLAME["highlight"],
            FLAME["highlight"]: "#ffffff",
        },
        {
            EMBER["base"]: FLAME["base"],
            FLAME["base"]: FLAME["highlight"],
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
            f"{direction} living pyre full-mass planted body bob",
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
                    FLAME["highlight"]: FLAME["base"],
                    EMBER["highlight"]: EMBER["base"],
                },
            )
        if frame == 2:
            return fire_strike(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return fire_strike(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return inferno_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    CINDER["shadow"]: "#7a2a17",
                    CINDER["base"]: "#b9471f",
                    CINDER["highlight"]: "#ff9b35",
                    IRON["base"]: "#8b4936",
                    EMBER["base"]: FLAME["highlight"],
                    FLAME["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                CINDER["highlight"]: CINDER["base"],
                EMBER["highlight"]: EMBER["base"],
                FLAME["highlight"]: FLAME["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {FLAME["highlight"]: FLAME["base"]},
            {
                EMBER["highlight"]: EMBER["base"],
                FLAME["highlight"]: FLAME["base"],
            },
            {
                CINDER["highlight"]: CINDER["shadow"],
                EMBER["base"]: EMBER["shadow"],
                FLAME["base"]: FLAME["shadow"],
            },
            {
                CINDER["highlight"]: CINDER["shadow"],
                CINDER["base"]: CINDER["shadow"],
                IRON["highlight"]: IRON["shadow"],
                IRON["base"]: IRON["shadow"],
                EMBER["highlight"]: "#4a170f",
                EMBER["base"]: "#4a170f",
                EMBER["shadow"]: "#2b100e",
                FLAME["highlight"]: "#5c2112",
                FLAME["base"]: "#5c2112",
                FLAME["shadow"]: "#35110d",
                EYE: "#6b3020",
                EYE_GLOW: "#4a170f",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate The Living Pyre boss-animation-v1 pilot."
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
            ("cinder", CINDER),
            ("iron", IRON),
            ("ember", EMBER),
            ("flame", FLAME),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
