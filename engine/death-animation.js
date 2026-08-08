// Approved Player Death motion and coordinate transform. The public animation
// catalog imports only the immutable animation identity below.

export const PLAYER_DEATH_ANIMATION = Object.freeze({
  id: 'death',
  name: 'Death',
  frames: 4,
  ms: 160,
});

export const PLAYER_DEATH_PROFILE = Object.freeze({
  id: 'player-death-v1',
  version: 1,
  animation: PLAYER_DEATH_ANIMATION,
});

const PLAYER_DEATH_POSES = Object.freeze([
  Object.freeze({
    phase: 'stagger',
    bodyBob: 0,
    leg: -1,
    arm: -1,
    quarterTurn: false,
  }),
  Object.freeze({
    phase: 'buckle',
    bodyBob: 1,
    leg: 1,
    arm: 1,
    quarterTurn: false,
  }),
  Object.freeze({
    phase: 'fall',
    bodyBob: 1,
    leg: -1,
    arm: -1,
    quarterTurn: true,
  }),
  Object.freeze({
    phase: 'still',
    bodyBob: 0,
    leg: 0,
    arm: 0,
    quarterTurn: true,
  }),
]);

export function playerDeathPose(frameIndex) {
  if (
    !Number.isInteger(frameIndex)
    || frameIndex < 0
    || frameIndex >= PLAYER_DEATH_ANIMATION.frames
  ) {
    throw new RangeError(
      `Player Death frame must be an integer from 0 to ${PLAYER_DEATH_ANIMATION.frames - 1}.`,
    );
  }
  return PLAYER_DEATH_POSES[frameIndex];
}

export function transformPlayerDeathPixels(
  pixels,
  direction,
  frameIndex,
  size = 24,
) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('Player Death transform size must be a positive integer.');
  }
  const pose = playerDeathPose(frameIndex);
  if (!Array.isArray(pixels) || pixels.length !== size * size) {
    throw new RangeError(`Player Death pixels must contain exactly ${size * size} cells.`);
  }
  if (!['down', 'left', 'right', 'up'].includes(direction)) {
    throw new RangeError(`Unsupported Player Death direction: ${String(direction)}.`);
  }

  const transformed = new Array(pixels.length).fill(null);
  if (!pose.quarterTurn) {
    for (let index = 0; index < pixels.length; index++) {
      transformed[index] = pixels[index];
    }
    return transformed;
  }

  const counterClockwise = direction === 'up';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const source = (y * size) + x;
      const targetX = counterClockwise ? y : size - 1 - y;
      const targetY = counterClockwise ? size - 1 - x : x;
      transformed[(targetY * size) + targetX] = pixels[source];
    }
  }
  return transformed;
}
