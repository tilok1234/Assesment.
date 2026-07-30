// Immutable review-only catalog for the 48x48 boss direction pilots.
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

function boss(id, name, note) {
  const base = `${ASSET_ROOT}/${id}-directions-v1`;
  return Object.freeze({
    id,
    name,
    note,
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
  boss('royal-night-elf-prince', 'Royal Night Elf Prince', 'Silver-haired lunar duelist with pointed ears, split royal cape, crescent crown, and moonsteel glaive.'),
  boss('living-pyre', 'The Living Pyre', 'Scorched human warlord with a visible face, charred limbs, molten heart, burning fists, and a crown of living flame.'),
  boss('tide-man-the-blue', 'Tide Man the Blue', 'Oceanic humanoid champion with wave-crested hair, pale aqua eyes, flowing tide mantle, and a coral-steel trident.'),
  boss('dryad-of-nature', 'The Dryad of Nature', 'Humanoid forest guardian with a branch-antler crown, glowing green eyes, layered leaf mantle, root-feet, and a living staff.'),
  boss('fierce-void-dragon', 'Fierce Void Dragon', 'Western void dragon with an open fanged jaw, S-curved neck, broad bat wing, four taloned legs, a sweeping barbed tail, violet eyes, and a fractured ribcage core.'),
  boss('dragon-rider-of-the-fallen', 'Dragon Rider of the Fallen', 'Unmounted fallen knight with a dragon-skull helm, scale cuirass, torn wing-cloak, broken dragon lance, clawed sabatons, and a spectral remnant of his dead dragon bond.'),
  boss('ogre-brute-king', 'Ogre Brute King', 'Massive green ogre monarch with a battered gold crown, tusked jaw, fur-and-chain mantle, belly plate, huge free fist, and an oversized ironwood maul.'),
  boss('mecha-deathbot', 'Mecha Deathbot', 'Hulking black-steel execution machine with a red sensor visor, armored reactor chest, piston limbs, shoulder cannon, magnetic feet, and a crushing claw.'),
  boss('flowered-jungle-tribe-beast-man', 'Flowered Jungle Tribe Beast-Man', 'Broad tawny feline-ape jungle guardian with a flower-and-vine headdress, golden eyes, tusked muzzle, leaf-fiber tribal armor, clawed feet, and a thornwood spear.'),
  boss('chad-the-fantastic-guard', 'Chad the Fantastic Guard', 'Ridiculously heroic human sentinel with a blond pompadour, enormous square jaw, cobalt-and-gold plate, crimson cape, radiant star shield, and ceremonial halberd.'),
]);
