from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "enemy-expansion-review" / "en-e11-phoenix-dawnthrone-imperator"
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


raw_hash = build_gif(
    "raw",
    "en-e11-phoenix-dawnthrone-imperator-full-suite-four-directions-labeled.gif",
)
assembled_hash = build_gif(
    "complete-b-form",
    "en-e11-phoenix-dawnthrone-imperator-full-suite-four-directions-labeled-complete-b-form.gif",
)
print("Generated the two exact labeled EN-E11 Phoenix Dawnthrone Imperator full-suite GIFs.")
print(f"- Raw GIF SHA-256: {raw_hash}")
print(f"- Complete B + Form GIF SHA-256: {assembled_hash}")

