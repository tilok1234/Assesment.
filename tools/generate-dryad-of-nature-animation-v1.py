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

import generate_dryad_of_nature_directions_v1 as directions
import generate_dryad_of_nature_style_v1 as base


# The shared builder executes apply_engine_treatment.mjs for every authored pose.
BOSS_ID = "dryad-of-nature"
DEFAULT_RUNTIME_ROOT = PROJECT_ROOT / "engine" / "assets" / "bosses"
OUTLINE = base.OUTLINE
EYE = base.EYE
BARK = base.BARK
LEAF = base.LEAF
MOSS = base.MOSS
BLOOM = base.BLOOM


def source_directions() -> dict[str, Image.Image]:
    right = base.profile_source()
    return {
        "down": base.down_source(),
        "left": right.transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "up": base.up_source(),
    }


def root_step(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    if direction == "left":
        leading = (6, 15, 13, 22)
        trailing = (11, 15, 19, 22)
    else:
        leading = (7, 15, 12, 22)
        trailing = (12, 15, 18, 22)

    if frame == 0:
        return move_region(
            source,
            leading,
            -1,
            -1,
            f"{direction} dryad leading root stride",
        )
    if frame == 1:
        contact = move_region(
            source,
            trailing,
            1,
            0,
            f"{direction} dryad trailing root stride",
        )
        return planted_body_bob(
            contact,
            20,
            f"{direction} dryad trailing-root contact dip",
        )
    if frame == 2:
        return move_region(
            source,
            leading,
            1,
            0,
            f"{direction} dryad crossing root stride",
        )
    recovery = move_region(
        source,
        trailing,
        -1,
        -1,
        f"{direction} dryad recovery root stride",
    )
    return planted_body_bob(
        recovery,
        20,
        f"{direction} dryad recovery-root contact dip",
    )


def thorn_sweep(
    image: Image.Image,
    direction: str,
    wide: bool,
) -> Image.Image:
    result = image.copy()
    draw = ImageDraw.Draw(result)
    if direction == "left":
        outer = (
            ((10, 7), (7, 8), (4, 10), (2, 13), (3, 17), (6, 19))
            if wide
            else ((9, 9), (6, 10), (4, 13), (5, 17))
        )
        thorns = ((5, 9), (2, 13), (4, 17)) if wide else ((5, 12), (5, 16))
    elif direction == "up":
        outer = (
            ((5, 15), (3, 12), (4, 8), (7, 5), (11, 3), (15, 4), (19, 7))
            if wide
            else ((6, 14), (5, 11), (7, 8), (11, 6), (15, 7))
        )
        thorns = ((4, 9), (8, 4), (16, 5)) if wide else ((6, 10), (13, 6))
    else:
        outer = (
            ((5, 10), (3, 12), (3, 16), (6, 19), (11, 20), (16, 18), (20, 14))
            if wide
            else ((6, 11), (4, 14), (6, 17), (11, 19), (16, 17))
        )
        thorns = ((3, 13), (5, 18), (17, 17)) if wide else ((5, 13), (8, 18))
    draw.line(outer, fill=LEAF["shadow"], width=2)
    draw.line(outer[1:-1], fill=MOSS["highlight"], width=1)
    for x, y in thorns:
        draw.point((x, y), fill=BLOOM["highlight"])
    return result


def nature_cast(
    source: Image.Image,
    direction: str,
    frame: int,
) -> Image.Image:
    leaves = (
        ((2, 18),),
        ((2, 18), (21, 17), (4, 9)),
        ((2, 18), (21, 17), (4, 9), (20, 8), (7, 3), (18, 3)),
        ((21, 17), (20, 8), (18, 3), (5, 5)),
    )[frame]
    result = add_points(
        source,
        leaves,
        BLOOM["highlight"] if frame in (1, 2) else LEAF["highlight"],
        f"{direction} dryad orbiting leaf cast {frame + 1}",
    )
    replacements = (
        {BLOOM["highlight"]: BLOOM["base"]},
        {
            LEAF["base"]: LEAF["highlight"],
            BLOOM["base"]: BLOOM["highlight"],
        },
        {
            BARK["highlight"]: BLOOM["base"],
            LEAF["shadow"]: LEAF["base"],
            LEAF["base"]: LEAF["highlight"],
            LEAF["highlight"]: BLOOM["base"],
            BLOOM["highlight"]: "#ffffff",
        },
        {
            LEAF["base"]: LEAF["highlight"],
            BLOOM["base"]: BLOOM["highlight"],
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
            f"{direction} dryad full-mass planted body bob",
        )

    if animation == "walk":
        return root_step(source, direction, frame)

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
                    BLOOM["highlight"]: BLOOM["base"],
                    LEAF["highlight"]: LEAF["base"],
                },
            )
        if frame == 2:
            return thorn_sweep(
                squash_pose(
                    source,
                    18,
                    -1 if direction == "left" else 0,
                ),
                direction,
                True,
            )
        return thorn_sweep(
            add_recovery_step(source, direction, OUTLINE),
            direction,
            False,
        )

    if animation == "cast":
        return nature_cast(source, direction, frame)

    if animation == "hurt":
        if frame == 0:
            return replace_colors(
                squash_pose(source, 19),
                {
                    BARK["shadow"]: "#6c5b32",
                    BARK["base"]: "#b49a4f",
                    BARK["highlight"]: "#e4d77a",
                    LEAF["base"]: MOSS["highlight"],
                    MOSS["base"]: LEAF["highlight"],
                    BLOOM["highlight"]: "#ffffff",
                },
            )
        return replace_colors(
            squash_pose(source, 17),
            {
                BARK["highlight"]: BARK["base"],
                LEAF["highlight"]: LEAF["base"],
                BLOOM["highlight"]: BLOOM["base"],
            },
        )

    if animation == "death":
        result = death_pose(source, frame, direction)
        replacements = (
            {BLOOM["highlight"]: BLOOM["base"]},
            {
                LEAF["highlight"]: LEAF["base"],
                BLOOM["highlight"]: BLOOM["base"],
            },
            {
                BARK["highlight"]: BARK["shadow"],
                LEAF["base"]: LEAF["shadow"],
                MOSS["base"]: MOSS["shadow"],
                BLOOM["base"]: BLOOM["shadow"],
            },
            {
                BARK["highlight"]: "#493622",
                BARK["base"]: "#493622",
                BARK["shadow"]: "#302417",
                LEAF["highlight"]: "#294b2c",
                LEAF["base"]: "#294b2c",
                LEAF["shadow"]: "#1c3420",
                MOSS["highlight"]: "#2d5141",
                MOSS["base"]: "#2d5141",
                MOSS["shadow"]: "#1c332c",
                BLOOM["highlight"]: "#695c35",
                BLOOM["base"]: "#695c35",
                BLOOM["shadow"]: "#443c27",
                EYE: "#566438",
            },
        )[frame]
        return replace_colors(result, replacements)

    raise ValueError(f"Unsupported animation: {animation}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate The Dryad of Nature boss-animation-v1 pilot."
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
            ("bark", BARK),
            ("leaf", LEAF),
            ("moss", MOSS),
            ("bloom", BLOOM),
        ),
        review_root=ROOT,
        runtime_root=arguments.runtime_root.resolve(),
    )
    write_manifest(manifest, ROOT)


if __name__ == "__main__":
    main()
