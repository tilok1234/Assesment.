from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "enemy-expansion-review" / "en-e03-wildwood-hornlord-idle"
FRAMES = OUTPUT / "animation-frames"


def build_gif(frame_names: list[str], output_name: str) -> str:
    images = [Image.open(FRAMES / name).convert("RGBA") for name in frame_names]
    try:
        destination = OUTPUT / output_name
        images[0].save(
            destination,
            save_all=True,
            append_images=images[1:],
            duration=240,
            loop=0,
            disposal=2,
            optimize=False,
        )
        with Image.open(destination) as review:
            assert review.size == (192, 224), f"{output_name} must be 192x224"
            assert getattr(review, "n_frames", 1) == 2, f"{output_name} must contain two frames"
            assert review.info.get("loop") == 0, f"{output_name} must loop forever"
            durations = []
            for frame in range(review.n_frames):
                review.seek(frame)
                durations.append(review.info.get("duration"))
            assert durations == [240, 240], f"{output_name} must retain two 240 ms frames"
        return hashlib.sha256(destination.read_bytes()).hexdigest()
    finally:
        for image in images:
            image.close()


raw_hash = build_gif(
    ["raw-1.png", "raw-2.png"],
    "en-e03-wildwood-hornlord-idle-four-directions-labeled.gif",
)
assembled_hash = build_gif(
    ["complete-b-form-1.png", "complete-b-form-2.png"],
    "en-e03-wildwood-hornlord-idle-four-directions-labeled-complete-b-form.gif",
)

print("Generated the two exact labeled Wildwood Hornlord Idle review GIFs.")
print(f"- Raw GIF SHA-256: {raw_hash}")
print(f"- Complete B + Form GIF SHA-256: {assembled_hash}")
