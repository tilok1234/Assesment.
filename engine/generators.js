// Random sprite specifications and export-safe names.

import {
  ENEMIES,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OUTFITS,
  OUTFIT_COLORS,
  SHIELDS,
  SKINS,
  WEAPONS,
} from './catalogs.js';

// ---------------- random + naming ----------------
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
export function randomPlayer() {
  const weapons = WEAPONS.filter(w => w.id !== 'none');
  return {
    skin: rnd(SKINS).id,
    hairStyle: rnd(HAIR_STYLES).id,
    hairColor: rnd(HAIR_COLORS).id,
    faceDetail: rnd(FACIAL_DETAILS).id,
    headgear: rnd(HEADGEAR).id,
    outfit: rnd(OUTFITS).id,
    outfitColor: rnd(OUTFIT_COLORS).id,
    weapon: Math.random() < 0.85 ? rnd(weapons).id : 'none',
    shield: rnd(SHIELDS).id,
  };
}
export function randomEnemy() {
  const fam = rnd(ENEMIES);
  return { family: fam.id, variant: rnd(fam.variants).id };
}
export function describe(spec) {
  if (spec.kind === 'player') {
    const bits = [
      'hero',
      spec.hairStyle !== 'bald' ? spec.hairStyle : null,
      spec.faceDetail && spec.faceDetail !== 'none' ? spec.faceDetail : null,
      spec.outfit,
      spec.weapon !== 'none' ? spec.weapon : null,
    ];
    return bits.filter(Boolean).join('-');
  }
  return `${spec.family}-${spec.variant}`;
}
