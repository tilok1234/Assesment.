from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "enemy-expansion-review" / "en-e11-cockatrice-bramblecomb-scratcher"
FRAMES = OUTPUT / "animation-frames"


def build_gif(prefix: str, output_name: str) -> str:
    images = [Image.open(FRAMES / f"{prefix}-{frame}.png").convert("RGBA") for frame in range(1, 5)]
    try:
        destination = OUTPUT / output_name
        images[0].save(
            destination,
            save_all=True,
            append_images=images[1:],
            duration=180,
            loop=0,
            disposal=2,
            optimize=False,
        )
        with Image.open(destination) as review:
            assert review.size == (640, 672)
            assert getattr(review, "n_frames", 1) == 4
            assert review.info.get("loop") == 0
            durations = []
            for frame in range(review.n_frames):
                review.seek(frame)
                durations.append(review.info.get("duration"))
            assert durations == [180, 180, 180, 180]
        return hashlib.sha256(destination.read_bytes()).hexdigest()
    finally:
        for image in images:
            image.close()


def validate_inspection_atlas() -> None:
    source = OUTPUT / "en-e11-cockatrice-bramblecomb-scratcher-inspection-atlas.png"
    with Image.open(source).convert("RGBA") as atlas:
        assert atlas.size == (480, 96)
        assert set(atlas.getchannel("A").get_flattened_data()) <= {0, 255}
        for row in range(4):
            for column in range(20):
                cell = atlas.crop((column * 24, row * 24, (column + 1) * 24, (row + 1) * 24))
                assert cell.getbbox() is not None
                boundary = (
                    [(pixel, 0) for pixel in range(24)]
                    + [(pixel, 23) for pixel in range(24)]
                    + [(0, pixel) for pixel in range(24)]
                    + [(23, pixel) for pixel in range(24)]
                )
                assert not any(cell.getpixel(point)[3] for point in boundary)


raw_hash = build_gif(
    "raw",
    "en-e11-cockatrice-bramblecomb-scratcher-full-suite-four-directions-labeled.gif",
)
assembled_hash = build_gif(
    "complete-b-form",
    "en-e11-cockatrice-bramblecomb-scratcher-full-suite-four-directions-labeled-complete-b-form.gif",
)
validate_inspection_atlas()
print("Generated the two exact labeled EN-E11 Cockatrice Bramblecomb Scratcher full-suite GIFs.")
print(f"- Raw GIF SHA-256: {raw_hash}")
print(f"- Complete B + Form GIF SHA-256: {assembled_hash}")
print("- Inspection atlas: 480x96, 80/80 nonempty, binary alpha, strict boundary clear")
