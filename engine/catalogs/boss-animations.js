// Immutable contract for review-approved 48x48 boss animation pilots.
// This catalog is independent from the procedural 24x24 renderer and sheets.

export const BOSS_ANIMATION_FRAME_SIZE = 48;
export const BOSS_ANIMATION_SHEET_COLUMNS = 20;
export const BOSS_ANIMATION_SHEET_WIDTH = 960;
export const BOSS_ANIMATION_SHEET_HEIGHT = 192;
export const BOSS_ANIMATION_DIRECTIONS = Object.freeze(['down', 'left', 'right', 'up']);
export const BOSS_ANIMATIONS = Object.freeze([
  Object.freeze({ id: 'idle', name: 'Idle', frames: 2, ms: 420, column: 0 }),
  Object.freeze({ id: 'walk', name: 'Walk', frames: 4, ms: 150, column: 2 }),
  Object.freeze({ id: 'attack', name: 'Attack', frames: 4, ms: 115, column: 6 }),
  Object.freeze({ id: 'cast', name: 'Cast', frames: 4, ms: 170, column: 10 }),
  Object.freeze({ id: 'hurt', name: 'Hurt', frames: 2, ms: 140, column: 14 }),
  Object.freeze({ id: 'death', name: 'Death', frames: 4, ms: 210, column: 16 }),
]);

export const BOSS_ANIMATION_PROFILE = Object.freeze({
  id: 'boss-animation-v1',
  version: 1,
  frameSize: BOSS_ANIMATION_FRAME_SIZE,
  sheetColumns: BOSS_ANIMATION_SHEET_COLUMNS,
  sheetWidth: BOSS_ANIMATION_SHEET_WIDTH,
  sheetHeight: BOSS_ANIMATION_SHEET_HEIGHT,
  directionOrder: BOSS_ANIMATION_DIRECTIONS,
  animations: BOSS_ANIMATIONS,
  hardAlpha: true,
  exportScale: 1,
  animated: true,
  effects: false,
});

const ASSET_ROOT = './engine/assets/bosses';

function animationPilot(id, name, reviewStatus = 'reviewed') {
  const base = `${ASSET_ROOT}/${id}-animation-v1`;
  return Object.freeze({
    id,
    name,
    reviewStatus,
    profileId: BOSS_ANIMATION_PROFILE.id,
    fullSheet: `${base}-full.png`,
    directionSheets: Object.freeze(Object.fromEntries(
      BOSS_ANIMATION_DIRECTIONS.map((direction) => [
        direction,
        `${base}-direction-${direction}.png`,
      ]),
    )),
    animationSheets: Object.freeze(Object.fromEntries(
      BOSS_ANIMATIONS.map((animation) => [
        animation.id,
        `${base}-animation-${animation.id}.png`,
      ]),
    )),
    frames: Object.freeze(Object.fromEntries(
      BOSS_ANIMATIONS.map((animation) => [
        animation.id,
        Object.freeze(Object.fromEntries(
          BOSS_ANIMATION_DIRECTIONS.map((direction) => [
            direction,
            Object.freeze(Array.from(
              { length: animation.frames },
              (_, frame) => `${base}-${animation.id}-${direction}-${frame + 1}.png`,
            )),
          ]),
        )),
      ]),
    )),
  });
}

export const BOSS_ANIMATION_PILOTS = Object.freeze([
  animationPilot('ancient-mirejaw', 'Ancient Mirejaw'),
  animationPilot('bone-reliquary-king', 'Bone Reliquary King'),
  animationPilot('scorpion-empress', 'Scorpion Empress'),
  animationPilot('cyclops-forge-titan', 'Cyclops Forge-Titan'),
  animationPilot('pit-fiend-juggernaut', 'Pit-Fiend Juggernaut'),
  animationPilot('goblin-war-crown', 'Goblin War-Crown', 'candidate'),
  animationPilot(
    'cruel-catgirl-templar-of-the-brutes',
    'Cruel Catgirl Templar of the Brutes',
  ),
  animationPilot(
    'divine-armored-templar-astro-knight',
    'Divine Armored Templar Astro Knight',
  ),
  animationPilot(
    'furious-depraved-rhino',
    'Furious Depraved Rhino',
    'candidate',
  ),
  animationPilot(
    'gunslinger-boar-rider',
    'Gunslinger Boar Rider',
    'candidate',
  ),
  animationPilot('lava-core-colossus', 'Lava-Core Colossus'),
  animationPilot('abyssal-crown-kraken', 'Abyssal Crown-Kraken'),
]);
