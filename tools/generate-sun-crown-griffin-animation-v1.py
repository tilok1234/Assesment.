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

import generate_sun_crown_griffin_directions_v1 as directions
import generate_sun_crown_griffin_style_v3 as profile
import generate_sun_crown_griffin_style_v4 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "sun-crown-griffin"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
BEAK = base.BEAK
EYE = base.EYE
FUR = base.FUR
FEATHER = base.FEATHER


def source_directions() -> dict[str, Image.Image]:
    right = profile.logical_source()
    return {
        "down": base.logical_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": directions.up_source(),
    }


def draw_dive_slash(image: Image.Image, direction: str) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = ((8, 9), (5, 12), (2, 18))
        light = ((8, 10), (5, 13), (3, 18))
    else:
        outer = ((7, 10), (4, 13), (2, 18))
        light = ((8, 10), (5, 13), (3, 18))
        draw.line(
            ((17, 10), (20, 13), (21, 18)),
            fill=OUTLINE,
            width=2,
        )
        draw.line(
            ((16, 10), (19, 13), (20, 18)),
            fill=BEAK,
            width=1,
        )
    draw.line(outer, fill=OUTLINE, width=2)
    draw.line(light, fill=BEAK, width=1)
    return result


def add_solar_aura(image: Image.Image, frame: int) -> Image.Image:
    points = (
        ((2, 2),),
        ((2, 2), (21, 2)),
        ((2, 2), (21, 2), (2, 20), (21, 20)),
        ((2, 20), (21, 20)),
    )[frame]
    color = FEATHER["highlight"] if frame == 2 else BEAK
    return add_points(image, points, color, f"griffin cast {frame + 1}")


def wing_settle(source: Image.Image, direction: str) -> Image.Image:
    return move_region(
        source,
        (2, 2, 22, 15),
        0,
        1,
        f"{direction} griffin planted wing-and-chest settle",
    )


def lifted_paw(
    source: Image.Image,
    direction: str,
    leading: bool,
) -> Image.Image:
    if direction == "left":
        box = (5, 16, 11, 22) if leading else (13, 16, 19, 22)
    else:
        box = (6, 16, 12, 22) if leading else (13, 16, 19, 22)
    phase = "leading" if leading else "trailing"
    return move_region(
        source,
        box,
        0,
        -1,
        f"{direction} griffin {phase} paw lift",
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
            f"{direction} griffin full-mass planted body bob",
        )

    if animation == "walk":
        if frame == 0:
            return lifted_paw(source, direction, True)
        if frame == 1:
            return wing_settle(source, direction)
        if frame == 2:
            return lifted_paw(source, direction, False)
        return add_recovery_step(source, direction, OUTLINE)

    if animation == "attack":
        if frame == 0:
            return source.copy()
        if frame == 1:
            return replace_colors(
                squash_pose(source, 18),
                {
                    FEATHER["highlight"]: FEATHER["base"],
                    FUR["highlight"]: FUR["base"],
                },
            )
        if frame == 2:
            return replace_colors(
                draw_dive_slash(squash_pose(source, 17), direction),
                {
                    FEATHER["highlight"]: "#ffffff",
                    FUR["highlight"]: "#efb65e",
                },
            )
        return replace_colors(
            add_recovery_step(squash_pose(source, 19), direction, OUTLINE),
            {
                FEATHER["highlight"]: FEATHER["base"],
                FUR["highlight"]: FUR["base"],
            },
        )

    if animation == "cast":
        result = add_solar_aura(source, frame)
        replacements = (
            {FEATHER["highlight"]: FEATHER["base"]},
            {
                FEATHER["base"]: "#f0dfb4",
                FEATHER["highlight"]: "#fff8e2",
            },
            {
                FUR["base"]: "#d58b35",
                FUR["highlight"]: "#ffc85c",
                FEATHER["shadow"]: "#c19a5b",
                FEATHER["base"]: "#fff0bd",
                FEATHER["highlight"]: "#ffffff",
            },
            {
                FEATHER["base"]: "#f0dfb4",
                FEATHER["highlight"]: "#fff8e2",
            },
        )[frame]
        return replace_colors(result, replacements)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    FUR["shadow"]: "#a07f6b",
                    FUR["base"]: "#d8b59a",
                    FUR["highlight"]: "#ffffff",
                    FEATHER["shadow"]: "#bcb6a8",
                    FEATHER["base"]: "#e8e5df",
                    FEATHER["highlight"]: "#ffffff",
                    BEAK: "#fff2b0",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                FUR["highlight"]: FUR["base"],
                FEATHER["highlight"]: FEATHER["shadow"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {FEATHER["highlight"]: FEATHER["base"]},
            {
                FEATHER["highlight"]: FEATHER["base"],
                FEATHER["base"]: FEATHER["shadow"],
            },
            {
                FEATHER["highlight"]: FEATHER["shadow"],
                FUR["highlight"]: FUR["base"],
            },
            {
                FEATHER["highlight"]: "#6f624e",
                FEATHER["base"]: "#6f624e",
                FEATHER["shadow"]: "#4a4036",
                FUR["highlight"]: FUR["shadow"],
                FUR["base"]: FUR["shadow"],
                BEAK: "#8f6f2f",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Sun-Crown Griffin boss-animation-v1 pilot."
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
        ramps=(("fur", FUR), ("feather", FEATHER)),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
