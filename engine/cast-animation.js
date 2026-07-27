// Approved Player Cast contract shared by the public animation catalog,
// renderer, and focused review.

export const PLAYER_CAST_ANIMATION = Object.freeze({
  id: 'cast',
  name: 'Cast',
  frames: 4,
  ms: 130,
});

export const PLAYER_CAST_PROFILE = Object.freeze({
  id: 'player-cast-v1',
  version: 1,
  animation: PLAYER_CAST_ANIMATION,
});

const PLAYER_CAST_POSES = Object.freeze([
  Object.freeze({
    phase: 'prepare',
    bodyBob: 1,
    leg: 0,
    sideHandReach: 0,
    weaponHandOffset: -1,
    offhandHandOffset: 1,
  }),
  Object.freeze({
    phase: 'focus',
    bodyBob: 1,
    leg: 1,
    sideHandReach: 1,
    weaponHandOffset: -1,
    offhandHandOffset: -1,
  }),
  Object.freeze({
    phase: 'release',
    bodyBob: 0,
    leg: 1,
    sideHandReach: 2,
    weaponHandOffset: 0,
    offhandHandOffset: -2,
  }),
  Object.freeze({
    phase: 'recover',
    bodyBob: 0,
    leg: -1,
    sideHandReach: 1,
    weaponHandOffset: 0,
    offhandHandOffset: 1,
  }),
]);

export function playerCastPose(frameIndex) {
  if (
    !Number.isInteger(frameIndex)
    || frameIndex < 0
    || frameIndex >= PLAYER_CAST_ANIMATION.frames
  ) {
    throw new RangeError(
      `Player Cast frame must be an integer from 0 to ${PLAYER_CAST_ANIMATION.frames - 1}.`,
    );
  }
  return PLAYER_CAST_POSES[frameIndex];
}
