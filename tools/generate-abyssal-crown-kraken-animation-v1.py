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

import generate_abyssal_crown_kraken_directions_v1 as directions
import generate_abyssal_crown_kraken_style_v2 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "abyssal-crown-kraken"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
INK = base.INK
EYE = base.EYE
BODY = base.BODY
GLOW = base.GLOW


def source_directions() -> dict[str, Image.Image]:
    left = directions.left_source()
    return {
        "down": base.logical_source(),
        "left": left,
        "up": directions.up_source(),
    }


def draw_tentacle_lash(image: Image.Image, direction: str) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = ((8, 18), (5, 15), (2, 11), (3, 7))
        inner = ((8, 17), (5, 14), (3, 11), (3, 8))
    else:
        outer = ((7, 18), (4, 15), (2, 10), (3, 6))
        inner = ((8, 18), (5, 14), (3, 10), (3, 7))
        draw.line(
            ((16, 18), (19, 15), (21, 10), (20, 6)),
            fill=OUTLINE,
            width=2,
        )
        draw.line(
            ((15, 18), (18, 14), (20, 10), (20, 7)),
            fill=BODY["highlight"],
            width=1,
        )
    draw.line(outer, fill=OUTLINE, width=2)
    draw.line(inner, fill=BODY["highlight"], width=1)
    return result


def add_abyssal_aura(image: Image.Image, frame: int) -> Image.Image:
    points = (
        ((2, 2),),
        ((2, 2), (21, 2)),
        ((2, 2), (21, 2), (2, 20), (21, 20)),
        ((2, 20), (21, 20)),
    )[frame]
    color = GLOW["highlight"] if frame == 2 else GLOW["base"]
    return add_points(image, points, color, f"kraken cast {frame + 1}")


def mantle_settle(source: Image.Image, direction: str) -> Image.Image:
    return move_region(
        source,
        (2, 2, 22, 14),
        0,
        1,
        f"{direction} kraken planted mantle settle",
    )


def lifted_tentacle_bank(
    source: Image.Image,
    direction: str,
    leading: bool,
) -> Image.Image:
    if direction == "left":
        box = (2, 14, 11, 22) if leading else (13, 14, 22, 22)
    else:
        box = (2, 14, 12, 22) if leading else (12, 14, 22, 22)
    phase = "leading" if leading else "trailing"
    return move_region(
        source,
        box,
        0,
        -1,
        f"{direction} kraken {phase} tentacle-bank lift",
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
            f"{direction} kraken full-mantle planted body bob",
        )

    if animation == "walk":
        if frame == 0:
            return lifted_tentacle_bank(source, direction, True)
        if frame == 1:
            return mantle_settle(source, direction)
        if frame == 2:
            return lifted_tentacle_bank(source, direction, False)
        return add_recovery_step(source, direction, OUTLINE)

    if animation == "attack":
        if frame == 0:
            return source.copy()
        if frame == 1:
            return replace_colors(
                squash_pose(source, 18),
                {BODY["highlight"]: BODY["base"]},
            )
        if frame == 2:
            return replace_colors(
                draw_tentacle_lash(squash_pose(source, 17), direction),
                {
                    BODY["highlight"]: "#c29ee0",
                    GLOW["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            add_recovery_step(squash_pose(source, 19), direction, OUTLINE),
            {
                BODY["highlight"]: BODY["base"],
                GLOW["highlight"]: GLOW["base"],
            },
        )

    if animation == "cast":
        result = add_abyssal_aura(source, frame)
        replacements = (
            {GLOW["highlight"]: GLOW["base"]},
            {
                GLOW["base"]: "#bd92e6",
                GLOW["highlight"]: "#eee1ff",
            },
            {
                BODY["base"]: "#7d5cac",
                GLOW["shadow"]: "#8d68bd",
                GLOW["base"]: "#d0a8f0",
                GLOW["highlight"]: "#ffffff",
            },
            {
                GLOW["base"]: "#bd92e6",
                GLOW["highlight"]: "#eee1ff",
            },
        )[frame]
        return replace_colors(result, replacements)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    BODY["shadow"]: "#766b8f",
                    BODY["base"]: "#b9acd0",
                    BODY["highlight"]: "#ffffff",
                    GLOW["shadow"]: "#b8a8cd",
                    GLOW["base"]: "#e4dcf0",
                    GLOW["highlight"]: "#ffffff",
                    INK: "#8b8799",
                    EYE: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                BODY["highlight"]: BODY["base"],
                GLOW["highlight"]: GLOW["shadow"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {GLOW["highlight"]: GLOW["base"]},
            {
                GLOW["highlight"]: GLOW["base"],
                GLOW["base"]: GLOW["shadow"],
            },
            {
                GLOW["highlight"]: GLOW["shadow"],
                GLOW["base"]: GLOW["shadow"],
                EYE: BODY["highlight"],
            },
            {
                GLOW["highlight"]: "#4e3d68",
                GLOW["base"]: "#4e3d68",
                GLOW["shadow"]: "#322b45",
                EYE: BODY["shadow"],
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Abyssal Crown-Kraken boss-animation-v1 pilot."
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
        ramps=(("body", BODY), ("glow", GLOW)),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
