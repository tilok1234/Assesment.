// Random sprite specifications and export-safe names.

import {
  COMBAT_EFFECTS,
  ENEMIES,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OUTFITS,
  OUTFIT_COLORS,
  OUTFIT_TIERS,
  SHIELDS,
  SHIELD_TIERS,
  SKINS,
  WEAPONS,
  WEAPON_TIERS,
} from './catalogs.js';

// ---------------- random + naming ----------------
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
export function randomPlayer() {
  const weapons = WEAPONS.filter(w => w.id !== 'none');
  const weapon = Math.random() < 0.85 ? rnd(weapons).id : 'none';
  const shield = rnd(SHIELDS).id;
  return {
    skin: rnd(SKINS).id,
    hairStyle: rnd(HAIR_STYLES).id,
    hairColor: rnd(HAIR_COLORS).id,
    faceDetail: rnd(FACIAL_DETAILS).id,
    headgear: rnd(HEADGEAR).id,
    outfit: rnd(OUTFITS).id,
    outfitTier: rnd(OUTFIT_TIERS).id,
    outfitColor: rnd(OUTFIT_COLORS).id,
    weapon,
    weaponTier: weapon === 'none' ? 'tier1' : rnd(WEAPON_TIERS).id,
    shield,
    shieldTier: shield === 'none' ? 'tier1' : rnd(SHIELD_TIERS).id,
  };
}
export function randomEnemy() {
  const fam = rnd(ENEMIES);
  return { family: fam.id, variant: rnd(fam.variants).id };
}
export function randomEffect() {
  const category = rnd(COMBAT_EFFECTS);
  return { category: category.id, effect: rnd(category.effects).id };
}
export function describe(spec) {
  if (spec.kind === 'player') {
    const bits = [
      'hero',
      spec.hairStyle !== 'bald' ? spec.hairStyle : null,
      spec.faceDetail && spec.faceDetail !== 'none' ? spec.faceDetail : null,
      spec.outfit,
      spec.outfitTier && spec.outfitTier !== 'tier1' ? spec.outfitTier : null,
      spec.weaponTier && spec.weaponTier !== 'tier1' && spec.weapon !== 'none' ? spec.weaponTier : null,
      spec.weapon !== 'none' ? spec.weapon : null,
    ];
    return bits.filter(Boolean).join('-');
  }
  if (spec.kind === 'effect') return `${spec.category}-${spec.effect}`;
  return `${spec.family}-${spec.variant}`;
}
