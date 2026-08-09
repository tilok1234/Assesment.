// Immutable review-only catalog for approved 48x48 direction pilots and active
// visual candidates.
// These assets do not participate in the procedural renderer or 24x24 sheets.

export const BOSS_DIRECTION_FRAME_SIZE = 48;
export const BOSS_DIRECTION_SHEET_WIDTH = 48;
export const BOSS_DIRECTION_SHEET_HEIGHT = 192;
export const BOSS_DIRECTIONS = Object.freeze(['down', 'left', 'right', 'up']);

export const BOSS_DIRECTION_PILOT_PROFILE = Object.freeze({
  id: 'boss-directions-v1',
  version: 1,
  frameSize: BOSS_DIRECTION_FRAME_SIZE,
  sheetWidth: BOSS_DIRECTION_SHEET_WIDTH,
  sheetHeight: BOSS_DIRECTION_SHEET_HEIGHT,
  directionOrder: BOSS_DIRECTIONS,
  hardAlpha: true,
  exportScale: 1,
  animated: false,
  effects: false,
});

const ASSET_ROOT = './engine/assets/bosses';

function boss(id, name, note, status = 'approved') {
  const base = `${ASSET_ROOT}/${id}-directions-v1`;
  return Object.freeze({
    id,
    name,
    note,
    status,
    sheet: `${base}.png`,
    frames: Object.freeze(Object.fromEntries(
      BOSS_DIRECTIONS.map((direction) => [direction, `${base}-${direction}.png`]),
    )),
  });
}

export const BOSS_DIRECTION_PILOTS = Object.freeze([
  boss('ancient-mirejaw', 'Ancient Mirejaw', 'Horned swamp brute with a heavy jaw and rear skull plate.'),
  boss('bone-reliquary-king', 'Bone Reliquary King', 'Crowned undead ruler with lantern, ribs, cloak, and ceremonial axe.'),
  boss('scorpion-empress', 'Scorpion Empress', 'Layered pincers, crown, low legs, armored abdomen, and raised stinger.'),
  boss('cyclops-forge-titan', 'Cyclops Forge-Titan', 'Single bright eye, massive forge hammer, planted armor, and furnace core.'),
  boss('pit-fiend-juggernaut', 'Pit-Fiend Juggernaut', 'Horned infernal heavy with dark wings and a dominant tower shield.'),
  boss('goblin-war-crown', 'Goblin War-Crown', 'Compact commander with corrected eyes, oversized crown, banner, and royal shield.'),
  boss('lava-core-colossus', 'Lava-Core Colossus', 'Irregular boulder construct with oversized fists and a dominant molten core.'),
  boss('abyssal-crown-kraken', 'Abyssal Crown-Kraken', 'Crowned mantle with luminous mask, side fins, and separated radial tentacles.'),
  boss('sun-crown-griffin', 'Sun-Crown Griffin', 'Approved front, hooked-beak profiles, low wings, lion body, and rear crest.'),
  boss(
    'cruel-catgirl-templar-of-the-brutes',
    'Cruel Catgirl Templar of the Brutes',
    'Feline brute-templar with exposed ears, armored tail, broken-cross tabard, and a foreground-held execution hammer.',
  ),
  boss(
    'divine-armored-templar-astro-knight',
    'Divine Armored Templar Astro Knight',
    'Sealed celestial plate with a distinct domed helm, narrow radiant T-visor, astrolabe halo, star-lance, constellation cloak, and orbit shield.',
  ),
  boss(
    'furious-depraved-rhino',
    'Furious Depraved Rhino',
    'Low quadrupedal charge beast with a dominant nasal horn, shoulder hump, four separated legs and hooves, scarred grey hide, broken restraints, rage brand, and corrupted flesh patches.',
    'candidate',
  ),
  boss(
    'gunslinger-boar-rider',
    'Gunslinger Boar Rider',
    'Mounted outlaw with a wide-brim hat, red bandana, foregrounded twin revolvers, split duster, armored saddle, and a massive bristled boar with red eyes and paired tusks.',
  ),
  boss(
    'eclipse-unicorn-sovereign',
    'Eclipse Unicorn Sovereign',
    'Majestic war-unicorn with a long striped sunhorn, luminous cyan eyes, flowing eclipse mane and tail, crescent barding, and four separated hoof columns.',
  ),
]);
