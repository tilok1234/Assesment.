// Procedural 24x24 sprite renderer.

import {
  ANIMS,
  BONE,
  BOOTS,
  COMBAT_EFFECTS,
  CREAM,
  ENEMIES,
  GOLD,
  HAIR_COLORS,
  HEADGEAR,
  INK,
  IRONPANTS,
  METAL,
  OUTFIT_COLORS,
  PANTS,
  SIZE,
  SKINS,
  WOOD,
} from './catalogs.js';
import { drawWeapon } from './weapon-renderer.js';
import { drawShield } from './shield-renderer.js';
import { drawCombatEffect } from './effect-renderer.js';

const find = (list, id) => list.find(x => x.id === id) || list[0];
const isHexColor = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
const palettePair = (value, fallback) => (
  Array.isArray(value) && value.length === 2 && value.every(isHexColor)
    ? value
    : fallback
);
const OUTFIT_TIER_IDS = ['tier1', 'tier2', 'tier3', 'tier4', 'tier5'];
const outfitTierRank = (tier) => Math.max(1, OUTFIT_TIER_IDS.indexOf(tier) + 1);
const BODY_BUILD_PROFILES = {
  classic: { id: 'classic', frontX: 8, frontW: 8, sideX: 9, sideW: 6, capeSideX: 7, capeSideW: 2 },
  lean: { id: 'lean', frontX: 9, frontW: 6, sideX: 10, sideW: 5, capeSideX: 8, capeSideW: 1 },
  sturdy: { id: 'sturdy', frontX: 7, frontW: 10, sideX: 8, sideW: 8, capeSideX: 6, capeSideW: 3 },
  heroic: { id: 'heroic', frontX: 9, frontW: 6, sideX: 10, sideW: 5, capeSideX: 7, capeSideW: 2, heroic: true },
};

function bodyBuildProfile(id) {
  return BODY_BUILD_PROFILES[id] || BODY_BUILD_PROFILES.classic;
}

function drawOutfitTier(S, R, d, u, BT, C, outfit) {
  const rank = outfitTierRank(C.outfitTier);
  if (rank === 1 || C.bone) return;
  const tier2Trim = outfit === 'leather' ? METAL[1] : METAL[2];
  const tier3Trim = GOLD[0];
  const tier5Glow = '#fff2a8';

  // Tier 2: reinforced shoulders and waist trim.
  if (d === 'right') {
    S(9, BT + u + 1, tier2Trim); S(14, BT + u + 1, tier2Trim);
    R(10, 17, 4, 1, tier2Trim);
  } else {
    S(8, BT + u + 1, tier2Trim); S(15, BT + u + 1, tier2Trim);
    R(10, 17, 4, 1, tier2Trim);
  }

  // Tier 3: a readable gold chest crest and stronger edge binding.
  if (rank >= 3) {
    if (d === 'down') {
      S(11, BT + u + 2, tier3Trim); S(12, BT + u + 2, tier3Trim);
      S(11, BT + u + 3, tier3Trim);
    } else if (d === 'up') {
      R(10, BT + u + 2, 4, 1, tier3Trim);
      S(12, BT + u + 3, tier3Trim);
    } else {
      S(13, BT + u + 2, tier3Trim); S(13, BT + u + 3, tier3Trim);
    }
    S(9, 17, tier3Trim); S(14, 17, tier3Trim);
  }

  // Tier 4: broad mythic pauldrons extend the silhouette beyond the base torso.
  if (rank >= 4) {
    if (d === 'right') {
      S(8, BT + u + 1, INK); S(15, BT + u, INK);
      S(8, BT + u, tier3Trim); S(15, BT + u + 1, tier3Trim);
    } else {
      S(7, BT + u, INK); S(16, BT + u, INK);
      S(7, BT + u + 1, tier3Trim); S(16, BT + u + 1, tier3Trim);
    }
    S(10, 16, tier3Trim); S(13, 16, tier3Trim);
  }

  // Tier 5: apex shoulder crowns and a luminous central sigil.
  if (rank >= 5) {
    if (d === 'right') {
      S(8, BT + u - 1, tier5Glow); S(15, BT + u - 1, tier5Glow);
      S(14, BT + u + 3, tier5Glow);
    } else {
      S(7, BT + u - 1, tier5Glow); S(16, BT + u - 1, tier5Glow);
      S(11, BT + u + 1, tier5Glow); S(12, BT + u + 1, tier5Glow);
    }
    S(11, 17, tier5Glow); S(12, 17, tier5Glow);
  }
}

// ---------------- pixel buffer ----------------
function makeG() {
  const px = new Array(SIZE * SIZE).fill(null);
  const g = {
    px,
    set(x, y, c) {
      x |= 0; y |= 0;
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
      px[y * SIZE + x] = c;
    },
    rect(x, y, w, h, c) {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g.set(x + i, y + j, c);
    },
  };
  return g;
}

// ---------------- pose ----------------
function makePose(animId, f) {
  const p = { bob: 0, leg: 0, arm: 0, wep: 'hold', flash: false, lunge: 0, f };
  if (animId === 'idle') { p.bob = f === 1 ? 1 : 0; }
  if (animId === 'walk') {
    p.bob = (f === 1 || f === 3) ? 1 : 0;
    p.leg = f === 0 ? 1 : (f === 2 ? -1 : 0);
    p.arm = p.leg;
  }
  if (animId === 'attack') {
    p.wep = ['wind', 'strike', 'strike', 'recover'][f];
    p.lunge = f === 1 ? 2 : (f === 2 ? 1 : 0);
  }
  if (animId === 'hurt') {
    p.flash = f === 0;
    p.lunge = f === 0 ? -1 : 0;
  }
  return p;
}

// ============================================================
// HUMANOID RIG — players, goblins, skeletons
// C: {skin, hair, hairStyle, gear, outfit, oc, weapon, shield,
//     face:'human'|'skull'|'goblin', small, bone, eye}
// ============================================================
function drawPlayerSpeciesBack(S, R, d, p, u, species, skin) {
  if (species === 'tiefling') {
    const sway = p.leg === 1 ? 1 : p.leg === -1 ? -1 : p.wep === 'strike' ? 1 : 0;
    if (d === 'down' || d === 'up') {
      S(15, 16 + u, skin[1]); S(16, 17 + u, skin[0]);
      S(17, 18 + u, skin[0]); S(18, 18 + u + sway, skin[1]);
      S(19, 17 + u + sway, skin[0]);
      S(19, 16 + u + sway, skin[0]); S(20, 17 + u + sway, skin[0]);
    } else {
      S(9, 16 + u, skin[1]); S(8, 17 + u, skin[0]);
      S(7, 18 + u, skin[0]); S(6, 18 + u + sway, skin[1]);
      S(5, 17 + u + sway, skin[0]);
      S(4, 16 + u + sway, skin[0]); S(4, 18 + u + sway, skin[0]);
    }
  }

  if (species === 'celestial') {
    const wing = ['#f3ead7', '#d4b65d'];
    const flap = p.leg !== 0 || p.wep === 'wind' ? -1 : 0;
    const wy = u + flap;
    if (d === 'down' || d === 'up') {
      R(4, 10 + wy, 3, 1, wing[0]); R(3, 11 + wy, 4, 3, wing[0]);
      S(3, 14 + wy, wing[1]); S(4, 15 + wy, wing[1]); S(5, 14 + wy, wing[1]);
      R(17, 10 + wy, 3, 1, wing[0]); R(17, 11 + wy, 4, 3, wing[0]);
      S(18, 14 + wy, wing[1]); S(19, 15 + wy, wing[1]); S(20, 14 + wy, wing[1]);
    } else {
      R(6, 9 + wy, 3, 1, wing[0]); R(5, 10 + wy, 4, 4, wing[0]);
      S(5, 14 + wy, wing[1]); S(6, 15 + wy, wing[1]); S(7, 14 + wy, wing[1]);
    }
  }
}

function drawPlayerSpeciesFront(S, R, d, u, HT, species, skin, gearDef) {
  if (!species || species === 'human' || gearDef.hideAll) return;

  if (species === 'elf') {
    if (d === 'down' || d === 'up') {
      S(7, HT + u + 3, skin[0]); S(6, HT + u + 2, skin[0]); S(7, HT + u + 2, skin[1]);
      S(16, HT + u + 3, skin[0]); S(17, HT + u + 2, skin[0]); S(16, HT + u + 2, skin[1]);
    } else {
      S(8, HT + u + 3, skin[0]); S(7, HT + u + 2, skin[0]); S(8, HT + u + 2, skin[1]);
    }
    return;
  }

  if (species === 'orc') {
    if (d === 'down' || d === 'up') {
      S(7, HT + u + 3, skin[0]); S(6, HT + u + 2, skin[0]); S(6, HT + u + 3, skin[1]);
      S(16, HT + u + 3, skin[0]); S(17, HT + u + 2, skin[0]); S(17, HT + u + 3, skin[1]);
    } else {
      S(8, HT + u + 3, skin[0]); S(7, HT + u + 2, skin[0]); S(7, HT + u + 3, skin[1]);
    }
    if (d === 'down') {
      S(10, HT + u + 7, '#f4f0df'); S(13, HT + u + 7, '#f4f0df');
      S(10, HT + u + 4, skin[1]); S(13, HT + u + 4, skin[1]);
    } else if (d === 'right') {
      S(14, HT + u + 7, '#f4f0df'); S(14, HT + u + 4, skin[1]);
    }
    return;
  }

  if (species === 'goblin') {
    if (d === 'down' || d === 'up') {
      S(7, HT + u + 3, skin[0]); S(6, HT + u + 2, skin[0]); S(5, HT + u + 1, skin[0]);
      S(6, HT + u + 3, skin[1]);
      S(16, HT + u + 3, skin[0]); S(17, HT + u + 2, skin[0]); S(18, HT + u + 1, skin[0]);
      S(17, HT + u + 3, skin[1]);
      if (d === 'down') { S(10, HT + u + 4, skin[1]); S(13, HT + u + 4, skin[1]); }
    } else {
      S(8, HT + u + 3, skin[0]); S(7, HT + u + 2, skin[0]); S(6, HT + u + 1, skin[0]);
      S(7, HT + u + 3, skin[1]); S(14, HT + u + 4, skin[1]);
    }
    return;
  }

  if (species === 'tiefling') {
    if (d === 'down' || d === 'up') {
      S(9, HT + u - 1, BONE[1]); S(8, HT + u - 2, BONE[0]); S(7, HT + u - 2, BONE[0]);
      S(14, HT + u - 1, BONE[1]); S(15, HT + u - 2, BONE[0]); S(16, HT + u - 2, BONE[0]);
    } else {
      S(11, HT + u - 1, BONE[1]); S(10, HT + u - 2, BONE[0]);
      S(14, HT + u - 1, BONE[1]); S(15, HT + u - 2, BONE[0]);
    }
    return;
  }

  if (species === 'celestial') {
    if (d === 'right') {
      R(10, HT + u - 1, 6, 1, GOLD[0]); S(9, HT + u - 1, GOLD[1]);
    } else {
      R(9, HT + u - 1, 6, 1, GOLD[0]); S(8, HT + u - 1, GOLD[1]); S(15, HT + u - 1, GOLD[1]);
    }
  }
}

function drawHumanoid(g, d, p, C, renderLayer = 'complete') {
  const small = !!C.small;
  const HT = small ? 5 : 3;      // head top
  const BT = small ? 13 : 12;    // torso top
  const u = p.bob;               // upper-body bob offset
  const ox = d === 'down' ? 0 : d === 'up' ? 0 : p.lunge; // side lunge x
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, c) => g.set(x + ox, y + oy, c);
  const R = (x, y, w, h, c) => g.rect(x + ox, y + oy, w, h, c);
  // Player weapons share the animated hand's idle bob and walk swing. Attack geometry already
  // encodes wind/strike/recover offsets and still inherits the humanoid lunge through S/R.
  const weaponRigY = C.weaponFollowRig ? u + (p.wep === 'hold' ? p.arm : 0) : 0;
  const weaponS = (x, y, c) => S(x, y + weaponRigY, c);
  const weaponR = (x, y, w, h, c) => R(x, y + weaponRigY, w, h, c);

  const skin = C.skin, oc = C.oc, hair = C.hair;
  const gear = C.gear || 'none';
  const gearDef = find(HEADGEAR, gear);
  const outfit = C.outfit || 'tunic';
  const build = bodyBuildProfile(C.bodyBuild);
  const armorRank = outfitTierRank(C.outfitTier);
  const robe = outfit === 'robe';
  const pants = C.bone ? BONE : (outfit === 'plate' ? IRONPANTS : PANTS);
  const eyeC = C.eye || INK;

  // Character-kit equipment sheets are split around the complete body so a game can
  // preserve the same direction-aware occlusion as the assembled renderer.
  if (renderLayer === 'weapon-back') {
    if (d === 'up' && C.weapon && C.weapon !== 'none') drawWeapon(weaponS, weaponR, d, p, C, u);
    return;
  }
  if (renderLayer === 'shield-back') {
    drawShield(S, R, d, p, C, u, 'behind');
    return;
  }
  if (renderLayer === 'shield-front') {
    drawShield(S, R, d, p, C, u, 'front');
    return;
  }
  if (renderLayer === 'weapon-front') {
    if (C.weapon && C.weapon !== 'none' && d !== 'up') drawWeapon(weaponS, weaponR, d, p, C, u);
    return;
  }
  if (renderLayer === 'species-back') {
    drawPlayerSpeciesBack(S, R, d, p, u, C.species, skin);
    return;
  }
  if (renderLayer === 'species-front') {
    drawPlayerSpeciesFront(S, R, d, u, HT, C.species, skin, gearDef);
    return;
  }
  const includeEquipment = renderLayer === 'complete';
  const includeFullBody = renderLayer === 'complete' || renderLayer === 'body';
  const includeOutfitBack = includeFullBody || renderLayer === 'outfit-back';
  const includeOutfit = includeFullBody || renderLayer === 'outfit';
  const includeSkinBody = includeFullBody || renderLayer === 'skin-body';
  const includeHead = includeFullBody || renderLayer === 'head';
  const includeExpression = includeFullBody || renderLayer === 'expression';
  const includeFaceDetail = includeFullBody || renderLayer === 'face-detail';
  const includeHair = includeFullBody || renderLayer === 'hair';
  const includeHeadgear = includeFullBody || renderLayer === 'headgear';

  // ---- weapon (behind for up-facing) ----
  if (includeEquipment && d === 'up' && C.weapon && C.weapon !== 'none') drawWeapon(weaponS, weaponR, d, p, C, u);

  if (includeEquipment) drawShield(S, R, d, p, C, u, 'behind');

  if (includeFullBody) drawPlayerSpeciesBack(S, R, d, p, u, C.species, skin);

  // ---- cape behind (side view) ----
  if (includeOutfitBack && outfit === 'cape' && d === 'right') {
    const sway = p.leg !== 0 ? 1 : 0;
    const capeX = build.capeSideX - sway;
    R(capeX, 12 + u, build.capeSideW, 6, oc[0]);
    R(capeX, 17 + u, build.capeSideW, 1, oc[1]);
    if (build.heroic) { S(capeX - 1, 12 + u, oc[0]); S(capeX + build.capeSideW, 13 + u, oc[1]); }
    if (armorRank >= 2) S(capeX, 13 + u, METAL[2]);
    if (armorRank >= 3) S(capeX - 1, 15 + u, GOLD[0]);
    if (armorRank >= 4) { S(capeX - 1, 12 + u, INK); S(capeX - 1, 17 + u, GOLD[0]); }
    if (armorRank >= 5) { S(capeX - 2, 13 + u, '#fff2a8'); S(capeX - 2, 16 + u, '#fff2a8'); }
  }

  // ---- legs ----
  if (includeOutfit && !robe) {
    if (d === 'down' || d === 'up') {
      const legDU = (x0, raised) => {
        if (raised) {
          R(x0, 18, 3, 1, pants[0]);
          R(x0, 19, 3, 1, C.bone ? BONE[0] : BOOTS[0]);
          R(x0, 20, 3, 1, C.bone ? BONE[1] : BOOTS[1]);
        } else {
          R(x0, 18, 3, 2, pants[0]);
          R(x0, 20, 3, 1, C.bone ? BONE[0] : BOOTS[0]);
          R(x0, 21, 3, 1, C.bone ? BONE[1] : BOOTS[1]);
        }
        if (C.bone) S(x0 + 1, 19, INK);
      };
      legDU(8, p.leg === 1);
      legDU(13, p.leg === -1);
    } else {
      // side: back leg darker, legs scissor
      let back = 9, front = 12;
      if (p.leg === 1) { back = 8; front = 13; }
      if (p.leg === -1) { back = 10; front = 12; }
      const legS = (x0, dark) => {
        R(x0, 18, 3, 2, dark ? pants[1] : pants[0]);
        R(x0, 20, 3, 1, C.bone ? (dark ? BONE[1] : BONE[0]) : (dark ? BOOTS[1] : BOOTS[0]));
        R(x0, 21, 3, 1, C.bone ? BONE[1] : BOOTS[1]);
      };
      legS(back, true);
      legS(front, false);
    }
  } else if (includeOutfit) {
    // robe: boots peeking
    if (d === 'right') { R(10, 20, 2, 2, BOOTS[1]); R(13, 20, 2, 2, BOOTS[0]); }
    else { R(9, 20, 2, 2, BOOTS[0]); R(13, 20, 2, 2, BOOTS[0]); }
  }

  // ---- harpy wings (behind torso) ----
  if (includeFullBody && C.wings) {
    const w0 = C.wings[0], w1 = C.wings[1];
    const wu = u - (p.leg !== 0 ? 1 : 0);
    if (d === 'down' || d === 'up') {
      R(4, 11 + wu, 3, 1, w0); R(3, 12 + wu, 3, 3, w0); S(3, 15 + wu, w1); S(4, 15 + wu, w1);
      R(17, 11 + wu, 3, 1, w0); R(18, 12 + wu, 3, 3, w0); S(19, 15 + wu, w1); S(20, 15 + wu, w1);
    } else {
      R(6, 10 + wu, 3, 1, w0); R(5, 11 + wu, 3, 4, w0); S(5, 15 + wu, w1); S(6, 15 + wu, w1);
    }
  }

  // ---- torso ----
  if (includeOutfit) {
    const torsoC = outfit === 'plate' ? METAL : (outfit === 'cape' || outfit === 'leather' ? CREAM : oc);
    if (d === 'right') {
      const tw = build.sideW, tx = build.sideX;
      if (robe) {
        R(tx, BT + u, tw, 19 - (BT + u) + 1, oc[0]);
        if (build.heroic) R(tx - 1, BT + u, tw + 2, 2, oc[0]);
        R(tx, 19, tw, 1, oc[1]);
        R(tx, BT + u, 1, 8 - u, oc[1]);
      } else {
        R(tx, BT + u, tw, 17 - (BT + u), torsoC[0]);
        if (build.heroic) R(tx - 1, BT + u, tw + 2, 2, torsoC[0]);
        if (outfit === 'leather') R(tx + 2, BT + u, Math.max(1, tw - 3), 17 - (BT + u), WOOD[0]);
        R(tx, 17, tw, 1, outfit === 'plate' ? METAL[1] : PANTS[1]);
      }
    } else {
      const tx = build.frontX, tw = build.frontW;
      if (robe) {
        R(tx, BT + u, tw, 19 - (BT + u) + 1, oc[0]);
        if (build.heroic) R(tx - 1, BT + u, tw + 2, 2, oc[0]);
        R(tx, 19, tw, 1, oc[1]);
        if (d === 'down') { S(11, 19, GOLD[0]); S(12, 19, GOLD[0]); }
      } else {
        R(tx, BT + u, tw, 17 - (BT + u), torsoC[0]);
        if (build.heroic) R(tx - 1, BT + u, tw + 2, 2, torsoC[0]);
        if (outfit === 'leather') R(tx + 2, BT + u, Math.max(2, tw - 4), 17 - (BT + u), WOOD[0]);
        if (outfit === 'plate' && d === 'down') { S(tx + 1, BT + u + 1, METAL[2]); S(tx + 2, BT + u + 1, METAL[2]); }
        if (C.bone && d === 'down') {
          // ribcage
          R(9, 13 + u, 6, 1, BONE[0]); R(9, 15 + u, 6, 1, BONE[0]);
          R(9, 14 + u, 6, 1, INK); R(9, 16 + u, 6, 1, INK);
          S(11, 14 + u, BONE[1]); S(12, 16 + u, BONE[1]);
        }
        R(tx, 17, tw, 1, outfit === 'plate' ? METAL[1] : PANTS[1]);
        if (d === 'down' && !C.bone) { S(11, 17, GOLD[0]); S(12, 17, GOLD[0]); }
      }
    }
  }

  // ---- cape covers back (up view) ----
  if (includeOutfit && outfit === 'cape' && d === 'up') {
    const tx = build.frontX, tw = build.frontW;
    R(tx, BT + u, tw, 19 - (BT + u), oc[0]);
    if (build.heroic) R(tx - 1, BT + u, tw + 2, 2, oc[0]);
    R(tx, 18, tw, 1, oc[1]);
    S(9, 19, oc[1]); S(11, 19, oc[1]); S(13, 19, oc[1]);
  }

  if (includeOutfit) drawOutfitTier(S, R, d, u, BT, C, outfit);

  // ---- arms ----
  const sleeveC = C.bone ? BONE : (outfit === 'plate' ? METAL : (outfit === 'cape' || outfit === 'leather' ? CREAM : oc));
  if (d === 'down' || d === 'up') {
    const armDU = (x0, off) => {
      if (includeOutfit) {
        R(x0, BT + u + off, 2, 3, sleeveC[0]);
        if (outfit === 'plate') R(x0, BT + u + off, 2, 1, METAL[2]);
        if (C.bone) S(x0, BT + u + off + 2, INK);
      }
      if (includeSkinBody) {
        R(x0, BT + u + off + 3, 2, 2, C.bone ? BONE[0] : skin[0]);
        S(x0, BT + u + off + 4, C.bone ? BONE[1] : skin[1]);
        S(x0 + 1, BT + u + off + 4, C.bone ? BONE[1] : skin[1]);
      }
    };
    let armOffL = -p.arm, armOffR = p.arm;
    if (p.wep === 'wind') armOffR = -1;
    if (p.wep === 'strike') armOffR = 0;
    armDU(6, d === 'down' ? armOffL : armOffR);
    armDU(16, d === 'down' ? armOffR : armOffL);
  } else {
    let off = p.arm;
    if (C.weaponFollowRig && p.wep === 'wind') off = -1;
    if (includeOutfit) R(12, BT + u + off, 2, 3, sleeveC[0]);
    if (includeSkinBody) {
      R(12, BT + u + off + 3, 2, 2, C.bone ? BONE[0] : skin[0]);
      S(12, BT + u + off + 4, C.bone ? BONE[1] : skin[1]);
      S(13, BT + u + off + 4, C.bone ? BONE[1] : skin[1]);
    }
  }

  // ---- neck ----
  if (includeSkinBody) {
    S(11, BT - 1 + u, C.bone ? BONE[1] : skin[1]);
    S(12, BT - 1 + u, C.bone ? BONE[1] : skin[1]);
  }

  // ---- head ----
  const hx = d === 'right' ? 9 : 8;
  const faceShade = gearDef.shade;
  const headSkin = C.bone ? BONE : skin;
  const headBase = faceShade ? headSkin[1] : headSkin[0];
  if (includeHead) {
    R(hx, HT + u, 8, 8, headBase);
    R(hx, HT + u + 7, 8, 1, headSkin[1]);
  }

  // ---- face ----
  if (!gearDef.hideAll) {
    if (includeHead && (!C.expression || C.face !== 'human')) {
      if (d === 'down') {
        if (C.face === 'skull') {
          S(10, HT + u + 4, INK); S(10, HT + u + 5, INK);
          S(13, HT + u + 4, INK); S(13, HT + u + 5, INK);
          if (C.eye) { S(10, HT + u + 4, eyeC); S(13, HT + u + 4, eyeC); }
          S(11, HT + u + 6, INK);
          S(10, HT + u + 7, INK); S(12, HT + u + 7, INK); S(14, HT + u + 7, INK);
        } else if (C.face === 'cyclops') {
          R(11, HT + u + 4, 2, 2, '#f4f4f4');
          S(11, HT + u + 5, eyeC); S(12, HT + u + 5, eyeC);
        } else if (C.face === 'zombie') {
          S(10, HT + u + 5, eyeC); S(13, HT + u + 4, eyeC); S(13, HT + u + 5, skin[1]);
          S(11, HT + u + 6, skin[1]); S(12, HT + u + 6, skin[1]);
        } else {
          S(10, HT + u + 5, eyeC); S(13, HT + u + 5, eyeC);
          if (C.face === 'goblin' || C.face === 'imp') { S(10, HT + u + 4, skin[1]); S(13, HT + u + 4, skin[1]); }
        }
      } else if (d === 'right') {
        if (C.face === 'skull') {
          S(14, HT + u + 4, INK); S(14, HT + u + 5, INK);
          S(13, HT + u + 7, INK); S(15, HT + u + 7, INK);
        } else if (C.face === 'cyclops') {
          R(14, HT + u + 4, 2, 2, '#f4f4f4');
          S(15, HT + u + 5, eyeC);
        } else {
          S(14, HT + u + 5, eyeC);
        }
      }
    }
    if (includeExpression && C.face === 'human' && C.expression) {
      drawFacialExpression(S, R, d, u, HT, C.expression, eyeC);
    }
    if (includeFullBody) drawPlayerSpeciesFront(S, R, d, u, HT, C.species, skin, gearDef);
    if (includeFaceDetail && C.face === 'human' && C.detail && C.detail !== 'none') {
      drawFacialDetail(S, R, d, u, HT, C.detail, hair, skin, oc, eyeC);
    }
  }

  // ---- goblin/orc ears ----
  if ((C.face === 'goblin' || C.face === 'orc') && !gearDef.hideAll) {
    if (d === 'down' || d === 'up') {
      S(7, HT + u + 3, skin[0]); S(6, HT + u + 2, skin[0]); S(6, HT + u + 3, skin[1]);
      S(16, HT + u + 3, skin[0]); S(17, HT + u + 2, skin[0]); S(17, HT + u + 3, skin[1]);
    } else {
      S(8, HT + u + 3, skin[0]); S(7, HT + u + 2, skin[0]); S(7, HT + u + 3, skin[1]);
    }
  }

  // ---- imp horns ----
  if (C.face === 'imp' && !gearDef.hideAll) {
    if (d === 'down' || d === 'up') {
      S(8, HT + u - 1, BONE[0]); S(7, HT + u - 2, BONE[0]);
      S(15, HT + u - 1, BONE[0]); S(16, HT + u - 2, BONE[0]);
    } else {
      S(11, HT + u - 1, BONE[0]); S(10, HT + u - 2, BONE[0]); S(14, HT + u - 1, BONE[0]);
    }
  }

  // ---- orc tusks ----
  if (C.face === 'orc' && !gearDef.hideAll) {
    if (d === 'down') { S(10, HT + u + 7, '#f4f4f4'); S(13, HT + u + 7, '#f4f4f4'); }
    else if (d === 'right') { S(14, HT + u + 7, '#f4f4f4'); }
  }

  // ---- snout + beast ears (kobold/gnoll/ratfolk) ----
  if (C.face === 'snout' && !gearDef.hideAll) {
    if (C.horns === 'bull') {
      // minotaur horns: sweep outward and up
      if (d === 'down' || d === 'up') {
        S(7, HT + u + 1, BONE[1]); S(6, HT + u, BONE[0]); S(6, HT + u - 1, BONE[0]); S(5, HT + u - 2, BONE[0]);
        S(16, HT + u + 1, BONE[1]); S(17, HT + u, BONE[0]); S(17, HT + u - 1, BONE[0]); S(18, HT + u - 2, BONE[0]);
      } else {
        S(10, HT + u, BONE[1]); S(10, HT + u - 1, BONE[0]); S(11, HT + u - 2, BONE[0]);
        S(14, HT + u - 1, BONE[0]); S(15, HT + u - 2, BONE[0]);
      }
    } else if (C.horns) {
      // kobold horn nubs instead of ears
      if (d === 'down' || d === 'up') {
        S(9, HT + u - 1, BONE[0]); S(9, HT + u, BONE[1]);
        S(14, HT + u - 1, BONE[0]); S(14, HT + u, BONE[1]);
      } else {
        S(11, HT + u - 1, BONE[0]); S(14, HT + u - 1, BONE[0]);
      }
    }
    if (d === 'down') {
      R(11, HT + u + 5, 2, 2, skin[1]);
      S(11, HT + u + 6, INK); S(12, HT + u + 6, INK);
      if (!C.horns) {
        S(7, HT + u + 1, skin[0]); S(7, HT + u + 2, skin[1]);
        S(16, HT + u + 1, skin[0]); S(16, HT + u + 2, skin[1]);
      }
    } else if (d === 'right') {
      R(17, HT + u + 4, 2, 2, skin[0]);
      S(18, HT + u + 4, INK); S(18, HT + u + 5, skin[1]);
      if (!C.horns) { S(10, HT + u + 1, skin[0]); S(10, HT + u + 2, skin[1]); }
    } else {
      if (!C.horns) { S(7, HT + u + 1, skin[0]); S(16, HT + u + 1, skin[0]); }
    }
  }

  // ---- tail (rat / lizard) ----
  if (C.tail) {
    const t0 = C.tail === 'lizard' ? skin[0] : '#e0a8a0';
    const t1 = C.tail === 'lizard' ? skin[1] : '#bc7f78';
    if (d === 'down' || d === 'up') {
      S(17, 20, t0); S(18, 19, t0); S(19, 19, t1);
    } else {
      S(6, 20, t0); S(5, 19, t0); S(4, 18, t1);
    }
  }

  // ---- elf ears (pointed, close to head) ----
  if (C.face === 'elf' && !gearDef.hideAll) {
    if (d === 'down' || d === 'up') {
      S(7, HT + u + 3, skin[0]); S(7, HT + u + 2, skin[1]);
      S(16, HT + u + 3, skin[0]); S(16, HT + u + 2, skin[1]);
    } else {
      S(8, HT + u + 3, skin[0]); S(8, HT + u + 2, skin[1]);
    }
  }

  // ---- beard ----
  if (includeHead && C.beard && !gearDef.hideAll) {
    const bc = C.beard;
    if (d === 'down') {
      R(9, HT + u + 6, 6, 2, bc[0]);
      R(10, HT + u + 8, 4, 1, bc[0]);
      S(11, HT + u + 8, bc[1]); S(12, HT + u + 8, bc[1]);
    } else if (d === 'right') {
      R(12, HT + u + 6, 4, 2, bc[0]);
      R(13, HT + u + 8, 3, 1, bc[1]);
    }
  }

  // ---- hair ----
  if (includeHair && !C.bone && !gearDef.hideAll && C.hairStyle && C.hairStyle !== 'bald') {
    drawHair(S, R, d, u, HT, hx, C.hairStyle, hair, gearDef.hideTop);
  }

  // ---- back of head for up view (hair or skin already ok; bald keeps skin) ----
  if (includeHead && d === 'up' && !C.bone && !gearDef.hideAll && (C.hairStyle === 'bald' || !C.hairStyle)) {
    R(hx, HT + u, 8, 2, headSkin[0]);
  }

  // ---- headgear ----
  if (includeHeadgear && gear !== 'none') drawGear(S, R, d, u, HT, hx, gear, oc, C);

  if (includeEquipment) drawShield(S, R, d, p, C, u, 'front');

  // ---- weapon (in front) ----
  if (includeEquipment && C.weapon && C.weapon !== 'none' && d !== 'up') drawWeapon(weaponS, weaponR, d, p, C, u);
}

function drawFacialExpression(S, R, d, u, HT, expression, eye) {
  if (d !== 'down' && d !== 'right') return;
  const y = HT + u;
  const selected = expression || 'neutral';

  if (d === 'down') {
    if (selected === 'happy') {
      R(9, y + 4, 2, 1, eye); R(13, y + 4, 2, 1, eye);
      S(10, y + 6, eye); S(13, y + 6, eye); R(11, y + 7, 2, 1, eye);
      return;
    }
    if (selected === 'angry') {
      S(9, y + 3, eye); S(10, y + 4, eye); S(14, y + 3, eye); S(13, y + 4, eye);
      S(10, y + 5, eye); S(13, y + 5, eye); R(11, y + 7, 2, 1, eye);
      return;
    }
    if (selected === 'sad') {
      S(10, y + 4, eye); S(13, y + 4, eye); S(10, y + 5, eye); S(13, y + 5, eye);
      R(11, y + 6, 2, 1, eye); S(10, y + 7, eye); S(13, y + 7, eye);
      return;
    }
    if (selected === 'surprised') {
      R(10, y + 4, 1, 2, eye); R(13, y + 4, 1, 2, eye); R(11, y + 7, 2, 1, eye);
      return;
    }
    if (selected === 'determined') {
      R(9, y + 4, 2, 1, eye); R(13, y + 4, 2, 1, eye);
      S(10, y + 5, eye); S(13, y + 5, eye); R(10, y + 7, 4, 1, '#f4f4f4');
      return;
    }
    S(10, y + 5, eye); S(13, y + 5, eye);
    return;
  }

  if (selected === 'happy') {
    S(14, y + 4, eye); S(14, y + 6, eye); S(15, y + 7, eye);
  } else if (selected === 'angry') {
    S(13, y + 4, eye); S(14, y + 5, eye); S(15, y + 7, eye);
  } else if (selected === 'sad') {
    S(14, y + 5, eye); S(15, y + 6, eye); S(14, y + 7, eye);
  } else if (selected === 'surprised') {
    R(14, y + 4, 1, 2, eye); S(15, y + 7, eye);
  } else if (selected === 'determined') {
    S(13, y + 4, eye); S(14, y + 5, eye); R(14, y + 7, 2, 1, '#f4f4f4');
  } else {
    S(14, y + 5, eye);
  }
}

function drawFacialDetail(S, R, d, u, HT, detail, hair, skin, outfit, eye) {
  if (d !== 'down' && d !== 'right') return;
  const y = HT + u;
  const hairBase = hair?.[0] || INK;
  const hairShade = hair?.[1] || INK;

  if (detail === 'beard') {
    if (d === 'down') {
      R(9, y + 6, 6, 2, hairBase);
      R(10, y + 8, 4, 1, hairBase);
      S(11, y + 8, hairShade); S(12, y + 8, hairShade);
    } else {
      R(12, y + 6, 4, 2, hairBase);
      R(13, y + 8, 3, 1, hairShade);
    }
    return;
  }

  if (detail === 'mustache') {
    if (d === 'down') {
      S(10, y + 6, hairBase); S(11, y + 6, hairShade);
      S(12, y + 6, hairShade); S(13, y + 6, hairBase);
    } else {
      S(14, y + 6, hairShade); S(15, y + 6, hairBase);
    }
    return;
  }

  if (detail === 'scar') {
    if (d === 'down') {
      S(14, y + 4, skin[1]); S(14, y + 5, skin[1]); S(13, y + 6, skin[1]);
    } else {
      S(15, y + 4, skin[1]); S(15, y + 5, skin[1]); S(14, y + 6, skin[1]);
    }
    return;
  }

  if (detail === 'eyepatch') {
    const patch = '#20202a';
    const patchLight = '#493846';
    if (d === 'down') {
      S(10, y + 3, patch); S(11, y + 3, patch); S(12, y + 4, patch);
      R(13, y + 4, 2, 2, patch);
      S(14, y + 4, patchLight);
    } else {
      S(11, y + 3, patch); S(12, y + 3, patch); S(13, y + 4, patch);
      R(14, y + 4, 2, 2, patch);
      S(15, y + 4, patchLight);
    }
    return;
  }

  if (detail === 'glasses') {
    const frame = '#758396';
    if (d === 'down') {
      S(9, y + 4, frame); S(11, y + 4, frame); S(9, y + 5, frame); S(11, y + 5, frame);
      S(12, y + 4, frame); S(14, y + 4, frame); S(12, y + 5, frame); S(14, y + 5, frame);
    } else {
      S(12, y + 4, frame); S(13, y + 4, frame); S(15, y + 4, frame);
      S(13, y + 5, frame); S(15, y + 5, frame);
    }
    return;
  }

  if (detail === 'blush') {
    const blush = '#c9656f';
    if (d === 'down') {
      S(9, y + 6, blush); S(14, y + 6, blush);
    } else {
      S(15, y + 6, blush);
    }
    return;
  }

  if (detail === 'warpaint') {
    const paint = outfit[0];
    if (d === 'down') {
      S(9, y + 4, paint); S(10, y + 4, paint);
      S(13, y + 4, paint); S(14, y + 4, paint);
    } else {
      S(13, y + 4, paint); S(14, y + 4, paint); S(15, y + 4, paint);
    }
  }
}

// ---------------- hair ----------------
function drawHair(S, R, d, u, HT, hx, style, hc, hideTop) {
  const top = !hideTop;
  if (d === 'down') {
    if (top) {
      if (style === 'mohawk') {
        R(11, HT + u - 1, 2, 5, hc[0]); S(11, HT + u + 3, hc[1]);
      } else {
        R(8, HT + u, 8, 3, hc[0]);
        R(8, HT + u + 2, 8, 1, hc[1]);
        S(8, HT + u + 3, hc[0]); S(15, HT + u + 3, hc[0]);
        if (style === 'spiky') { S(9, HT + u - 1, hc[0]); S(12, HT + u - 1, hc[0]); S(15, HT + u - 1, hc[0]); }
        if (style === 'bowl') { R(8, HT + u, 8, 4, hc[0]); R(8, HT + u + 3, 8, 1, hc[1]); }
      }
    }
    if (style === 'long') {
      R(8, HT + u + 3, 1, 6, hc[0]); R(15, HT + u + 3, 1, 6, hc[0]);
      S(7, HT + u + 8, hc[1]); S(16, HT + u + 8, hc[1]);
    }
  } else if (d === 'right') {
    if (top) {
      if (style === 'mohawk') {
        R(10, HT + u - 1, 6, 2, hc[0]); S(10, HT + u + 1, hc[1]);
      } else {
        R(9, HT + u, 8, 3, hc[0]);
        R(9, HT + u + 2, 4, 1, hc[1]);
        R(9, HT + u + 3, 2, 2, hc[0]);
        if (style === 'spiky') { S(10, HT + u - 1, hc[0]); S(13, HT + u - 1, hc[0]); }
        if (style === 'bowl') { R(9, HT + u, 8, 4, hc[0]); R(15, HT + u + 3, 2, 1, hc[1]); }
      }
    }
    if (style === 'long') { R(9, HT + u + 3, 2, 6, hc[0]); S(9, HT + u + 8, hc[1]); }
    if (style === 'ponytail') { S(8, HT + u + 2, hc[0]); S(8, HT + u + 3, hc[0]); S(8, HT + u + 4, hc[1]); }
  } else if (d === 'up') {
    if (style === 'mohawk') {
      R(11, HT + u - 1, 2, 7, hc[0]);
    } else if (top) {
      R(8, HT + u, 8, 6, hc[0]);
      R(8, HT + u + 5, 8, 1, hc[1]);
      S(10, HT + u + 3, hc[1]); S(13, HT + u + 2, hc[1]);
      if (style === 'spiky') { S(9, HT + u - 1, hc[0]); S(12, HT + u - 1, hc[0]); S(15, HT + u - 1, hc[0]); }
      if (style === 'bowl') R(8, HT + u, 8, 7, hc[0]);
    } else {
      R(8, HT + u + 4, 8, 2, hc[0]);
    }
    if (style === 'long') { R(8, HT + u, 8, 10, hc[0]); R(8, HT + u + 9, 8, 1, hc[1]); S(10, HT + u + 6, hc[1]); S(13, HT + u + 7, hc[1]); }
    if (style === 'ponytail') { R(11, HT + u + 3, 2, 8, hc[0]); R(11, HT + u + 4, 2, 1, hc[1]); }
  }
}

// ---------------- headgear ----------------
function drawGear(S, R, d, u, HT, hx, gear, oc, C) {
  if (gear === 'cap') {
    R(hx, HT + u, 8, 3, oc[0]);
    R(hx, HT + u + 2, 8, 1, oc[1]);
    if (d === 'down') R(hx, HT + u + 3, 8, 1, oc[1]);
    if (d === 'right') { S(17, HT + u + 2, oc[1]); S(18, HT + u + 2, oc[1]); }
    if (d === 'up') S(hx + 4, HT + u + 1, oc[1]);
  }
  if (gear === 'helm') {
    R(hx, HT + u - 1, 8, 4, METAL[0]);
    R(hx, HT + u - 1, 8, 1, METAL[2]);
    R(hx, HT + u + 2, 8, 1, METAL[1]);
    if (d === 'down') { S(11, HT + u + 3, METAL[1]); S(12, HT + u + 3, METAL[1]); }
  }
  if (gear === 'fullhelm') {
    R(hx, HT + u, 8, 8, METAL[0]);
    R(hx, HT + u, 8, 1, METAL[2]);
    R(hx, HT + u + 6, 8, 2, METAL[1]);
    if (d === 'down') { R(10, HT + u + 4, 4, 1, INK); }
    if (d === 'right') { R(13, HT + u + 4, 3, 1, INK); }
    if (d === 'up') { R(hx + 1, HT + u + 3, 6, 1, METAL[1]); }
  }
  if (gear === 'hood') {
    R(hx, HT + u - 1, 8, 3, oc[0]);
    R(hx, HT + u + 1, 8, 1, oc[1]);
    R(hx, HT + u + 2, 1, 6, oc[0]);
    R(hx + 7, HT + u + 2, 1, 6, oc[0]);
    if (d === 'up') R(hx, HT + u, 8, 8, oc[0]);
    if (d === 'right') R(9, HT + u, 3, 8, oc[0]);
  }
  if (gear === 'crown') {
    R(hx, HT + u, 8, 1, GOLD[0]);
    S(hx + 1, HT + u - 1, GOLD[0]); S(hx + 4, HT + u - 1, GOLD[0]); S(hx + 7 - 1, HT + u - 1, GOLD[0]);
    if (d === 'down') S(hx + 4, HT + u, '#e83a3a');
  }
  if (gear === 'wizard') {
    R(hx - 2, HT + u + 1, 12, 1, oc[1]);
    R(hx + 1, HT + u - 3, 4, 4, oc[0]);
    R(hx + 2, HT + u - 4, 2, 1, oc[0]);
    S(hx + 4, HT + u - 3, oc[1]);
    S(hx + 1, HT + u, oc[1]);
  }
  if (gear === 'horns') {
    R(hx, HT + u - 1, 8, 3, METAL[0]);
    R(hx, HT + u - 1, 8, 1, METAL[2]);
    R(hx, HT + u + 1, 8, 1, METAL[1]);
    if (d !== 'right') {
      S(hx - 1, HT + u - 1, BONE[0]); S(hx - 1, HT + u, BONE[0]); S(hx - 2, HT + u - 2, BONE[0]);
      S(hx + 8, HT + u - 1, BONE[0]); S(hx + 8, HT + u, BONE[0]); S(hx + 9, HT + u - 2, BONE[0]);
    } else {
      S(hx + 1, HT + u - 1, BONE[0]); S(hx + 1, HT + u - 2, BONE[0]); S(hx, HT + u - 3, BONE[0]);
    }
  }
}

// ============================================================
// ENEMY DRAWERS (non-humanoid)
// ============================================================
function drawSlime(g, d, p, f, V, animId) {
  const c = V.c;
  let dh = 0, dw = 0, lift = 0;
  if (animId === 'idle') { if (f === 1) { dh = 1; dw = 1; } }
  if (animId === 'walk') {
    if (f === 0) { dh = 2; dw = 2; }
    if (f === 1) { lift = 2; dh = -1; dw = -1; }
    if (f === 2) { lift = 3; }
    if (f === 3) { dh = 1; dw = 1; }
  }
  if (animId === 'attack') { if (f === 1 || f === 2) { dh = 1; dw = 1; } }
  if (animId === 'hurt' && f === 0) { dh = 2; dw = 2; }

  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) - lift;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const top = 12 + dh, L = 8 - dw, Rr = 15 + dw;

  // dome
  for (let y = top; y <= 21; y++) {
    let x0 = L, x1 = Rr;
    if (y === top) { x0 = L + 2; x1 = Rr - 2; }
    else if (y === top + 1) { x0 = L + 1; x1 = Rr - 1; }
    if (y === 21) { x0 = L + 1; x1 = Rr - 1; }
    for (let x = x0; x <= x1; x++) S(x, y, y >= 20 ? c[1] : c[0]);
  }
  // shine
  S(L + 2, top + 2, c[2]); S(L + 3, top + 2, c[2]); S(L + 2, top + 3, c[2]);
  // face
  if (d === 'down') {
    S(10, 16 + dh, INK); S(10, 17 + dh, INK);
    S(13, 16 + dh, INK); S(13, 17 + dh, INK);
    if (animId === 'attack') { S(11, 19, INK); S(12, 19, INK); S(11, 18, INK); S(12, 18, INK); }
    else { S(11, 19, c[1]); S(12, 19, c[1]); }
  } else if (d === 'right') {
    S(13, 16 + dh, INK); S(13, 17 + dh, INK);
    if (animId === 'attack') { S(15, 18, INK); S(14, 18, INK); }
  }
}

function drawBat(g, d, p, f, V, animId) {
  const flap = f % 2 === 0;
  const fy = -3 + (flap ? 0 : 1);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + fy;
  const S = (x, y, c) => g.set(x + ox, y + oy, c);
  const R = (x, y, w, h, c) => g.rect(x + ox, y + oy, w, h, c);
  const fur = V.fur, wing = V.wing;

  if (flap) {
    // wings spread
    R(3, 12, 6, 1, wing[0]); R(4, 13, 5, 2, wing[0]); S(4, 15, wing[1]); S(6, 15, wing[1]); S(8, 15, wing[1]);
    R(15, 12, 6, 1, wing[0]); R(15, 13, 5, 2, wing[0]); S(15, 15, wing[1]); S(17, 15, wing[1]); S(19, 15, wing[1]);
  } else {
    // wings down
    R(5, 14, 4, 3, wing[0]); S(5, 17, wing[1]); S(7, 17, wing[1]);
    R(15, 14, 4, 3, wing[0]); S(16, 17, wing[1]); S(18, 17, wing[1]);
  }
  // body
  R(9, 12, 6, 5, fur[0]);
  R(9, 16, 6, 1, fur[1]);
  S(9, 10, fur[0]); S(9, 11, fur[0]); S(14, 10, fur[0]); S(14, 11, fur[0]); // ears
  if (d === 'down') {
    S(10, 13, V.eye); S(13, 13, V.eye);
    if (animId === 'attack') { S(11, 15, INK); S(12, 15, INK); }
    S(10, 16, '#f4f4f4'); S(13, 16, '#f4f4f4'); // fangs
  } else if (d === 'right') {
    S(13, 13, V.eye);
    S(13, 16, '#f4f4f4');
  }
}

function drawGhost(g, d, p, f, V, animId) {
  const fy = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const wave = f % 2 === 0;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + fy - 2;
  const S = (x, y, c) => g.set(x + ox, y + oy, c);
  const R = (x, y, w, h, c) => g.rect(x + ox, y + oy, w, h, c);
  const c = V.c;

  R(10, 8, 4, 1, c[0]);
  R(9, 9, 6, 1, c[0]);
  R(8, 10, 8, 8, c[0]);
  R(8, 16, 1, 2, c[1]); R(15, 16, 1, 2, c[1]);
  // wavy hem
  if (wave) { S(8, 18, c[0]); S(9, 18, c[1]); S(11, 18, c[0]); S(12, 18, c[1]); S(14, 18, c[0]); }
  else { S(9, 18, c[0]); S(10, 18, c[1]); S(12, 18, c[0]); S(13, 18, c[1]); S(15, 18, c[0]); }
  // arms
  const ay = animId === 'attack' ? 10 : 12;
  if (d !== 'right') { R(6, ay, 2, 2, c[0]); S(6, ay + 2, c[1]); R(16, ay, 2, 2, c[0]); S(17, ay + 2, c[1]); }
  else { R(16, ay, 2, 2, c[0]); S(17, ay + 2, c[1]); }
  // face
  if (d === 'down') {
    S(10, 11, V.eye); S(10, 12, V.eye); S(13, 11, V.eye); S(13, 12, V.eye);
    if (animId === 'attack') R(11, 14, 2, 2, V.eye);
  } else if (d === 'right') {
    S(13, 11, V.eye); S(13, 12, V.eye);
    if (animId === 'attack') R(14, 14, 2, 2, V.eye);
  }
}

function drawSpider(g, d, p, f, V, animId) {
  const wig = f % 2 === 0 ? 0 : 1;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, c) => g.set(x + ox, y + oy, c);
  const R = (x, y, w, h, c) => g.rect(x + ox, y + oy, w, h, c);
  const c = V.c;

  if (d === 'down' || d === 'up') {
    // legs: 4 each side
    const raise = animId === 'attack' ? 1 : 0;
    for (let i = 0; i < 4; i++) {
      const y = 12 + i * 2 + (i % 2 === wig ? 0 : 1);
      S(7, y, c[1]); S(6, y, c[0]); S(5, y + 1, c[0]); S(4, y + 1, c[1]);
      S(16, y, c[1]); S(17, y, c[0]); S(18, y + 1, c[0]); S(19, y + 1, c[1]);
      if (raise && i === 0) { S(5, y - 1, c[0]); S(18, y - 1, c[0]); }
    }
    // abdomen
    R(9, 14, 6, 1, c[0]);
    R(8, 15, 8, 4, c[0]);
    R(9, 19, 6, 1, c[1]);
    R(8, 18, 8, 1, c[1]);
    if (d === 'up') { R(11, 15, 2, 2, V.mark); S(11, 17, V.mark); S(12, 14, V.mark); }
    // head
    R(10, 11, 4, 3, c[0]);
    R(10, 13, 4, 1, c[1]);
    if (d === 'down') {
      S(10, 12, V.eye); S(13, 12, V.eye);
      S(11, 11, V.eye); S(12, 11, V.eye);
      if (animId === 'attack') { S(10, 14, '#f4f4f4'); S(13, 14, '#f4f4f4'); }
    }
  } else {
    // side
    for (let i = 0; i < 4; i++) {
      const x = 8 + i * 2;
      const yv = 17 + ((i % 2 === wig) ? 0 : 1);
      S(x, yv, c[0]); S(x, yv + 1, c[0]); S(x, yv + 2, c[1]);
    }
    R(7, 12, 7, 6, c[0]);
    R(7, 12, 7, 1, c[1]); R(7, 17, 7, 1, c[1]);
    R(11, 15, 2, 2, V.mark);
    R(14, 13, 4, 4, c[0]);
    R(14, 16, 4, 1, c[1]);
    S(16, 14, V.eye); S(17, 15, V.eye);
    if (animId === 'attack') { S(17, 17, '#f4f4f4'); }
  }
}

function drawShroom(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { x: 0,  bob: 0, lx: 8, ly: 20, rx: 13, ry: 19 },
    { x: 1,  bob: 1, lx: 9, ly: 20, rx: 14, ry: 20 },
    { x: 0,  bob: 0, lx: 9, ly: 19, rx: 14, ry: 20 },
    { x: -1, bob: 1, lx: 8, ly: 20, rx: 13, ry: 20 },
  ][f] : { x: 0, bob: 0, lx: 9, ly: 20, rx: 13, ry: 20 };
  const u = walking ? gait.bob : ((animId === 'idle' && f === 1) ? 1 : 0);
  const bx = gait.x;
  const ox = (d === 'right' ? p.lunge : 0);
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, c) => g.set(x + ox, y + oy, c);
  const R = (x, y, w, h, c) => g.rect(x + ox, y + oy, w, h, c);
  const c = V.c;

  // The feet trade ground contact across all four walk frames while the
  // complete upper body follows the step. This avoids the old detached cap
  // slide where only the hat moved and the stem stayed frozen.
  R(gait.lx, gait.ly, 2, 2, CREAM[1]);
  R(gait.rx, gait.ry, 2, 2, CREAM[1]);
  if (walking && f === 0) S(gait.lx - 1, gait.ly + 1, CREAM[1]);
  if (walking && f === 2) S(gait.rx + 2, gait.ry + 1, CREAM[1]);
  // stem/body
  R(9 + bx, 13 + u, 6, 7 - u, CREAM[0]);
  R(9 + bx, 13 + u, 1, 7 - u, CREAM[1]);
  // face
  if (d === 'down') {
    S(10 + bx, 15 + u, INK); S(13 + bx, 15 + u, INK);
    if (animId === 'attack') { S(11 + bx, 17 + u, INK); S(12 + bx, 17 + u, INK); }
  } else if (d === 'right') {
    S(13 + bx, 15 + u, INK);
  }
  // cap
  const cx = bx;
  R(9 + cx, 8 + u, 6, 1, c[0]);
  R(8 + cx, 9 + u, 8, 2, c[0]);
  R(7 + cx, 11 + u, 10, 1, c[0]);
  R(7 + cx, 12 + u, 10, 1, c[1]);
  if (d !== 'up') {
    S(9 + cx, 9 + u, V.dot); S(13 + cx, 10 + u, V.dot); S(11 + cx, 11 + u, V.dot);
  } else {
    S(10 + cx, 9 + u, V.dot); S(13 + cx, 11 + u, V.dot); S(8 + cx, 10 + u, V.dot);
  }
  // spore puff on attack
  if (animId === 'attack' && (f === 1 || f === 2)) {
    S(8, 5 + f, V.dot); S(12, 4 + f, V.dot); S(16, 6 - f, V.dot); S(10, 3 + f, c[2] || V.dot);
  }
}

// ---------------- quadrupeds: wolf / boar / bear ----------------
function drawQuad(g, d, p, f, V, animId) {
  const fur = V.c, eye = V.eye || INK;
  const shape = V.shape;
  const bear = shape === 'bear';
  const u = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const crouch = animId === 'attack' && f === 0 ? 1 : 0;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, c) => g.set(x + ox, y + oy, c);
  const R = (x, y, w, h, c) => g.rect(x + ox, y + oy, w, h, c);
  const leg = p.leg;
  const lw = bear ? 3 : 2;
  const cat = shape === 'cat';

  if (d === 'right') {
    const bu = u + crouch;
    // legs: far pair darker, near pair lit, scissor on walk
    const legH = (x, cc) => R(x, 17, lw, 5, cc);
    if (bear) {
      legH(12 - leg, fur[1]); legH(7 + leg, fur[1]);
      legH(14 + leg, fur[0]); legH(4 - leg, fur[0]);
    } else {
      legH(13 - leg, fur[1]); legH(8 + leg, fur[1]);
      legH(15 + leg, fur[0]); legH(6 - leg, fur[0]);
    }
    // body
    if (bear) {
      R(4, 9 + bu, 14, 8 - bu, fur[0]);
      R(4, 15, 14, 2, fur[1]);
      S(4, 10 + bu, fur[1]);
    } else {
      R(5, 11 + bu, 13, 6 - bu, fur[0]);
      R(5, 15, 13, 2, fur[1]);
    }
    if (shape === 'boar') R(6, 10 + bu, 10, 1, fur[1]);
    if (cat && V.marks === 'stripes') { R(7, 12 + bu, 1, 3, V.mk); R(10, 12 + bu, 1, 4, V.mk); R(13, 12 + bu, 1, 3, V.mk); R(16, 12 + bu, 1, 2, V.mk); }
    if (cat && V.marks === 'spots') { S(7, 13 + bu, V.mk); S(10, 15 + bu, V.mk); S(12, 12 + bu, V.mk); S(15, 14 + bu, V.mk); S(9, 12 + bu, V.mk); }
    // tail
    if (shape === 'wolf') { R(3, 9 + bu, 2, 3, fur[0]); S(2, 8 + bu, fur[0]); S(3, 11 + bu, fur[1]); }
    if (shape === 'boar') { S(4, 10 + bu, fur[1]); S(3, 9 + bu, fur[0]); S(4, 8 + bu, fur[0]); }
    if (bear) S(3, 11 + bu, fur[1]);
    if (cat) {
      if (V.tail === 'bob') { S(4, 10 + bu, fur[0]); S(4, 9 + bu, fur[1]); }
      else { S(4, 11 + bu, fur[0]); S(3, 10 + bu, fur[0]); S(3, 9 + bu, fur[0]); S(3, 8 + bu, V.mk || fur[1]); }
    }
    // head + snout
    const hy = (bear ? 7 : 8) + bu + (strike ? 1 : 0);
    R(15, hy, 5, bear ? 5 : 4, fur[0]);
    if (bear) { S(15, hy - 1, fur[0]); S(18, hy - 1, fur[0]); }
    else { S(15, hy - 1, fur[0]); S(17, hy - 1, fur[1]); if (cat && V.tuft) { S(15, hy - 2, INK); S(17, hy - 2, INK); } }
    const ey = hy + (bear ? 2 : 1);
    const sw = cat ? 2 : 3;
    R(19, ey, sw, 2, fur[0]);
    S(18 + sw, ey, V.mark || INK);
    S(17, ey, eye);
    if (shape === 'boar') S(19, ey + 2, '#f4f4f4');
    if (strike) { R(19, ey + 2, sw, 1, INK); S(19, ey + 2, '#f4f4f4'); }
  } else {
    const bu = u + crouch;
    const px0 = bear ? 7 : 8, px1 = 14;
    const paw = (x, raised) => {
      R(x, 18, lw, raised ? 3 : 4, fur[0]);
      R(x, raised ? 20 : 21, lw, 1, fur[1]);
    };
    paw(px0, leg === 1);
    paw(px1, leg === -1);
    // body
    if (bear) { R(7, 13 + bu, 10, 6 - bu, fur[0]); R(7, 17, 10, 1, fur[1]); }
    else { R(8, 13 + bu, 8, 6 - bu, fur[0]); R(8, 17, 8, 1, fur[1]); }
    // head (face down / back of head up)
    R(9, 8 + bu, 6, 5, fur[0]);
    S(9, 7 + bu, fur[0]); S(14, 7 + bu, fur[0]);
    if (cat && V.tuft) { S(9, 6 + bu, INK); S(14, 6 + bu, INK); }
    if (d === 'down') {
      S(10, 10 + bu, eye); S(13, 10 + bu, eye);
      R(11, 11 + bu, 2, 2, fur[1]);
      S(11, 11 + bu, V.mark || INK); S(12, 11 + bu, V.mark || INK);
      if (shape === 'boar') { S(10, 12 + bu, '#f4f4f4'); S(13, 12 + bu, '#f4f4f4'); }
      if (strike) { R(10, 13 + bu, 4, 1, INK); S(10, 13 + bu, '#f4f4f4'); S(13, 13 + bu, '#f4f4f4'); }
      if (cat && V.marks === 'stripes') { S(9, 14 + bu, V.mk); S(12, 15 + bu, V.mk); S(14, 14 + bu, V.mk); S(10, 16 + bu, V.mk); }
      if (cat && V.marks === 'spots') { S(9, 14 + bu, V.mk); S(13, 15 + bu, V.mk); S(11, 16 + bu, V.mk); }
    } else {
      R(9, 12 + bu, 6, 1, fur[1]);
      if (shape === 'wolf') { R(11, 14 + bu, 2, 4, fur[0]); S(11, 17 + bu, fur[1]); S(12, 17 + bu, fur[1]); }
      if (shape === 'boar') { S(11, 14 + bu, fur[1]); S(12, 13 + bu, fur[0]); }
      if (bear) S(11, 14 + bu, fur[1]);
      if (shape === 'boar') R(11, 13 + bu, 2, 1, fur[1]);
      if (cat) {
        if (V.marks === 'stripes') { S(9, 14 + bu, V.mk); S(14, 15 + bu, V.mk); S(10, 16 + bu, V.mk); S(13, 13 + bu, V.mk); }
        if (V.marks === 'spots') { S(9, 14 + bu, V.mk); S(13, 16 + bu, V.mk); S(14, 13 + bu, V.mk); }
        if (V.tail === 'bob') S(11, 14 + bu, fur[0]);
        else { R(11, 14 + bu, 1, 5, fur[0]); S(11, 18 + bu, V.mk || fur[1]); }
      }
    }
  }
}

// ---------------- golem / elemental / treant / gargoyle ----------------
function drawGolem(g, d, p, f, V, animId) {
  const u = p.bob;
  const wind = animId === 'attack' && f === 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c;
  const ay = wind ? 6 : strike ? 14 : 10;
  if (d === 'down' || d === 'up') {
    R(8, 18, 3, p.leg === 1 ? 3 : 4, c[1]);
    R(13, 18, 3, p.leg === -1 ? 3 : 4, c[1]);
    R(6, 10 + u, 12, 8 - u, c[0]);
    R(6, 16, 12, 2, c[1]);
    S(7, 11 + u, c[2]); S(8, 11 + u, c[2]);
    R(4, ay + u, 2, 6, c[0]); R(4, ay + u + 5, 2, 1, c[1]);
    R(18, ay + u, 2, 6, c[0]); R(18, ay + u + 5, 2, 1, c[1]);
    R(9, 5 + u, 6, 5, c[0]);
    R(9, 9 + u, 6, 1, c[1]);
    if (d === 'down') { S(10, 7 + u, V.eye); S(13, 7 + u, V.eye); }
    S(12, 13 + u, V.crack); S(13, 14 + u, V.crack); S(8, 15 + u, V.crack);
    if (d === 'up') S(11, 7 + u, V.crack);
  } else {
    R(9, 18, 3, p.leg === 1 ? 3 : 4, c[1]);
    R(13, 18, 3, p.leg === -1 ? 3 : 4, c[1]);
    R(7, 10 + u, 10, 8 - u, c[0]);
    R(7, 16, 10, 2, c[1]);
    S(8, 11 + u, c[2]);
    R(15, ay + u, 3, 6, c[0]); R(15, ay + u + 5, 3, 1, c[1]);
    R(10, 5 + u, 6, 5, c[0]); R(10, 9 + u, 6, 1, c[1]);
    S(14, 7 + u, V.eye);
    S(11, 13 + u, V.crack); S(9, 15 + u, V.crack);
  }
}

function drawElemental(g, d, p, f, V, animId) {
  const flick = f % 2 === 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + (flick ? 0 : 1) - 2;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c;
  R(10, 8, 4, 2, c[0]);
  R(9, 10, 6, 6, c[0]);
  R(8, 12, 8, 4, c[0]);
  R(9, 16, 6, 2, c[1]);
  R(10, 18, 4, 1, c[1]);
  if (flick) { S(9, 7, c[0]); S(12, 6, c[0]); S(14, 8, c[1]); }
  else { S(11, 6, c[0]); S(14, 7, c[0]); S(9, 8, c[1]); }
  R(10, 12, 4, 4, c[2]);
  if (strike) {
    if (d !== 'right') { R(6, 11, 2, 2, c[0]); S(5, 12, c[1]); R(16, 11, 2, 2, c[0]); S(18, 12, c[1]); }
    else { R(16, 11, 3, 2, c[0]); S(19, 12, c[1]); }
  }
  if (d === 'down') { S(10, 13, INK); S(13, 13, INK); }
  else if (d === 'right') S(13, 13, INK);
}

function drawTreant(g, d, p, f, V, animId) {
  const u = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const wind = animId === 'attack' && f === 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const bark = V.bark, leaf = V.leaf;
  R(8, 18, 3, p.leg === 1 ? 3 : 4, bark[1]);
  R(13, 18, 3, p.leg === -1 ? 3 : 4, bark[1]);
  S(7, 21, bark[1]); S(16, 21, bark[1]);
  R(8, 10 + u, 8, 8 - u, bark[0]);
  R(8, 16, 8, 2, bark[1]);
  const ay = wind ? 7 : strike ? 13 : 10;
  if (d !== 'right') {
    R(5, ay + u, 3, 1, bark[0]); S(5, ay + u - 1, bark[0]); S(4, ay + u - 2, leaf[0]);
    R(16, ay + u, 3, 1, bark[0]); S(18, ay + u - 1, bark[0]); S(19, ay + u - 2, leaf[0]);
  } else {
    R(16, ay + u, 3, 1, bark[0]); S(18, ay + u - 1, bark[0]); S(19, ay + u - 2, leaf[0]);
  }
  if (d === 'down') {
    S(10, 12 + u, V.eye); S(13, 12 + u, V.eye);
    S(11, 14 + u, bark[1]); S(12, 14 + u, bark[1]);
    if (strike) { S(11, 15 + u, INK); S(12, 15 + u, INK); }
  } else if (d === 'right') S(14, 12 + u, V.eye);
  R(7, 4 + u, 10, 4, leaf[0]);
  R(8, 3 + u, 8, 1, leaf[0]);
  R(7, 7 + u, 10, 1, leaf[1]);
  S(9, 5 + u, leaf[1]); S(13, 4 + u, leaf[1]);
  if (d === 'up') R(8, 8 + u, 8, 2, leaf[0]);
}

function drawGargoyle(g, d, p, f, V, animId) {
  const flap = f % 2 === 0;
  const u = (animId === 'idle' && f === 1) ? 1 : (animId === 'walk' && (f === 1 || f === 3)) ? -1 : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + u;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c;
  if (d !== 'right') {
    if (flap) { R(3, 9, 4, 1, c[1]); R(4, 10, 3, 4, c[1]); S(4, 14, c[1]); R(17, 9, 4, 1, c[1]); R(17, 10, 3, 4, c[1]); S(19, 14, c[1]); }
    else { R(5, 11, 2, 5, c[1]); S(5, 16, c[1]); R(17, 11, 2, 5, c[1]); S(18, 16, c[1]); }
  } else {
    if (flap) { R(6, 8, 5, 1, c[1]); R(7, 9, 4, 4, c[1]); }
    else { R(8, 11, 3, 5, c[1]); }
  }
  R(8, 18, 3, 3, c[1]); R(13, 18, 3, 3, c[1]);
  R(8, 12, 8, 6, c[0]);
  R(8, 17, 8, 1, c[1]);
  const hx2 = d === 'right' ? 10 : 9;
  R(hx2, 8, 6, 4, c[0]);
  S(hx2, 7, c[1]); S(hx2 + 5, 7, c[1]);
  if (d === 'down') {
    S(hx2 + 1, 9, V.eye); S(hx2 + 4, 9, V.eye);
    if (strike) R(hx2 + 2, 11, 2, 1, INK);
  } else if (d === 'right') {
    S(hx2 + 4, 9, V.eye);
    if (strike) S(hx2 + 5, 11, INK);
  }
}

// ---------------- snake / worm / eye monster ----------------
function drawSnake(g, d, p, f, V, animId) {
  const u = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const wig = f % 2 === 0 ? 0 : 1;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, eye = V.eye || INK;
  if (d === 'down' || d === 'up') {
    R(8 + wig, 15, 8, 2, c[0]);
    R(7 + wig, 17, 10, 2, c[0]);
    R(8 + wig, 19, 8, 2, c[0]);
    R(8 + wig, 20, 8, 1, c[1]);
    S(7 + wig, 16, c[1]); S(16 + wig, 18, c[1]);
    S(6 + wig, 18, c[0]); S(5 + wig, 18, c[1]);
    const hy = 9 + u + (strike ? 2 : 0);
    R(11, hy + 4, 2, 16 - (hy + 4) + 1, c[0]);
    R(10, hy, 4, 4, c[0]);
    R(10, hy + 3, 4, 1, c[1]);
    if (V.hood) { S(9, hy + 1, c[1]); S(9, hy + 2, c[1]); S(14, hy + 1, c[1]); S(14, hy + 2, c[1]); }
    if (d === 'down') {
      S(10, hy + 1, eye); S(13, hy + 1, eye);
      if (strike) { S(11, hy + 4, '#e83a3a'); S(12, hy + 5, '#e83a3a'); }
    }
  } else {
    R(3, 18 + wig, 4, 2, c[0]);
    S(2, 19 + wig, c[1]);
    R(6, 18 - wig, 4, 2, c[0]);
    R(9, 18 + wig, 4, 2, c[0]);
    const hu = u + (strike ? 1 : 0);
    R(12, 13 + u, 2, 7 - u, c[0]);
    R(12, 10 + hu, 4, 3, c[0]);
    R(12, 12 + hu, 4, 1, c[1]);
    if (V.hood) { S(11, 10 + hu, c[1]); S(11, 11 + hu, c[1]); }
    S(14, 11 + hu, eye);
    if (strike) { S(16, 11 + hu, '#e83a3a'); S(17, 11 + hu, '#e83a3a'); }
  }
}

function drawWorm(g, d, p, f, V, animId) {
  const u = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const wig = f % 2 === 0 ? 0 : 1;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c;
  R(7, 20, 10, 1, '#5a4632');
  R(8, 21, 8, 1, '#3d2f20');
  S(6, 21, '#5a4632'); S(17, 21, '#5a4632');
  const bx = 9 + wig;
  R(bx, 9 + u, 6, 12 - u, c[0]);
  R(bx + 1, 8 + u, 4, 1, c[0]);
  for (let y = 14 + u; y < 20; y += 3) R(bx, y, 6, 1, c[1]);
  if (d === 'down') {
    if (animId === 'attack') {
      R(bx + 1, 10 + u, 4, 3, INK);
      S(bx + 1, 10 + u, '#f4f4f4'); S(bx + 4, 10 + u, '#f4f4f4');
      S(bx + 1, 12 + u, '#f4f4f4'); S(bx + 4, 12 + u, '#f4f4f4');
    } else {
      R(bx + 1, 11 + u, 4, 1, c[1]);
    }
  } else if (d === 'right') {
    if (animId === 'attack') {
      R(bx + 3, 10 + u, 3, 3, INK);
      S(bx + 5, 10 + u, '#f4f4f4'); S(bx + 5, 12 + u, '#f4f4f4');
    } else {
      S(bx + 4, 11 + u, c[1]);
    }
  }
}

function drawEyeball(g, d, p, f, V, animId) {
  const fy = f % 2 === 0 ? 0 : 1;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + fy - 2;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const sc = V.c[0], sh = V.c[1], iris = V.iris;
  R(10, 8, 4, 1, sc);
  R(9, 9, 6, 1, sc);
  R(8, 10, 8, 6, sc);
  R(9, 16, 6, 1, sh);
  R(10, 17, 4, 1, sh);
  R(8, 15, 1, 1, sh); R(15, 15, 1, 1, sh);
  S(9, 7, sh); S(12, 6, sh); S(15, 8, sh); S(7, 11, sh); S(16, 12, sh);
  if (d === 'down') {
    R(10, 10, 4, 4, iris);
    R(11, 11, 2, 2, INK);
    S(11, 11, '#f4f4f4');
    if (strike) { S(9, 10, iris); S(14, 13, iris); S(9, 13, iris); S(14, 10, iris); }
  } else if (d === 'right') {
    R(12, 10, 3, 4, iris);
    R(13, 11, 2, 2, INK);
    if (strike) { S(15, 10, iris); S(15, 13, iris); }
  } else {
    S(10, 11, '#e83a3a'); S(12, 13, '#e83a3a'); S(13, 10, '#e83a3a'); S(11, 14, '#e83a3a');
  }
}

// ---------------- bugs: scorpion / crab / beetle / wasp ----------------
function drawScorp(g, d, p, f, V, animId) {
  const wig = f % 2 === 0 ? 0 : 1;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, eye = V.eye, gold = '#e8b93e';
  if (d === 'down' || d === 'up') {
    for (let i = 0; i < 3; i++) {
      const y = 13 + i * 2 + (i % 2 === wig ? 0 : 1);
      S(8, y, c[1]); S(7, y, c[0]); S(6, y + 1, c[1]);
      S(15, y, c[1]); S(16, y, c[0]); S(17, y + 1, c[1]);
    }
    R(9, 13, 6, 6, c[0]);
    R(9, 15, 6, 1, c[1]); R(9, 18, 6, 1, c[1]);
    R(10, 10, 4, 3, c[0]);
    if (d === 'down') { S(10, 11, eye); S(13, 11, eye); }
    R(6, 9, 2, 2, c[0]); S(6, 8, c[0]); S(8, 10, c[1]);
    R(16, 9, 2, 2, c[0]); S(17, 8, c[0]); S(15, 10, c[1]);
    if (strike) {
      S(12, 8, c[1]); S(12, 7, c[0]); S(11, 7, gold); S(10, 7, '#f7dc85');
    } else {
      S(12, 8, c[1]); S(12, 7, c[1]); S(11, 6, c[0]); S(10, 6, gold);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const x = 8 + i * 3;
      const yv = 19 + ((i % 2 === wig) ? 0 : 1);
      S(x, yv, c[1]); S(x, yv + 1, c[1]);
    }
    R(6, 15, 10, 4, c[0]);
    R(6, 18, 10, 1, c[1]);
    R(15, 14, 3, 3, c[0]);
    S(17, 15, eye);
    R(18, 14, 2, 2, c[0]); S(19, 13, c[0]);
    S(5, 15, c[1]); S(4, 14, c[1]); S(4, 13, c[1]); S(4, 12, c[1]); S(5, 11, c[0]); S(7, 10, c[0]); S(9, 9, c[0]);
    if (strike) { S(11, 10, gold); S(12, 11, '#f7dc85'); }
    else S(10, 9, gold);
  }
}

function drawCrab(g, d, p, f, V, animId) {
  const wig = f % 2 === 0 ? 0 : 1;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c;
  const cy = strike ? 11 : 13;
  if (d === 'down' || d === 'up') {
    S(5, 18 + wig, c[1]); S(4, 19 + wig, c[1]); S(6, 19 - wig, c[1]); S(7, 20 - wig, c[1]);
    S(18, 18 + wig, c[1]); S(19, 19 + wig, c[1]); S(17, 19 - wig, c[1]); S(16, 20 - wig, c[1]);
    R(8, 11, 8, 1, c[0]);
    R(7, 12, 10, 6, c[0]);
    R(7, 17, 10, 1, c[1]);
    S(9, 13, c[2]); S(10, 13, c[2]);
    if (d === 'down') {
      S(10, 10, c[1]); S(13, 10, c[1]);
      S(10, 9, INK); S(13, 9, INK);
      S(10, 14, INK); S(13, 14, INK);
      R(11, 16, 2, 1, c[1]);
    }
    R(4, cy, 3, 2, c[0]); S(4, cy - 1, c[0]); S(6, cy + 2, c[1]);
    R(17, cy, 3, 2, c[0]); S(19, cy - 1, c[0]); S(17, cy + 2, c[1]);
  } else {
    S(9, 18 + wig, c[1]); S(8, 19 + wig, c[1]); S(12, 19 - wig, c[1]); S(11, 20 - wig, c[1]); S(15, 18 + wig, c[1]);
    R(8, 12, 8, 6, c[0]);
    R(8, 11, 6, 1, c[0]);
    R(8, 17, 8, 1, c[1]);
    S(10, 13, c[2]);
    S(14, 10, c[1]); S(14, 9, INK);
    R(16, cy, 3, 2, c[0]); S(18, cy - 1, c[0]);
  }
}

function drawBeetle(g, d, p, f, V, animId) {
  const wig = f % 2 === 0 ? 0 : 1;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c;
  if (d === 'down' || d === 'up') {
    for (let i = 0; i < 3; i++) {
      const y = 12 + i * 2 + (i % 2 === wig ? 0 : 1);
      S(7, y, c[1]); S(6, y + 1, c[1]);
      S(16, y, c[1]); S(17, y + 1, c[1]);
    }
    R(9, 10, 6, 1, c[0]);
    R(8, 11, 8, 8, c[0]);
    R(9, 19, 6, 1, c[1]);
    R(11, 11, 1, 8, c[1]);
    S(9, 12, c[2]); S(9, 13, c[2]);
    if (d === 'down') {
      R(10, 8, 4, 2, c[1]);
      S(10, 8, '#f4f4f4'); S(13, 8, '#f4f4f4');
      S(11, 7, c[1]); S(11, 6, strike ? '#f4f4f4' : c[1]); S(12, 6, c[1]);
    } else {
      R(10, 8, 4, 2, c[0]);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const x = 8 + i * 3;
      S(x, 19 + (i % 2 === wig ? 0 : 1), c[1]); S(x, 20 + (i % 2 === wig ? 0 : 1), c[1]);
    }
    R(9, 11, 7, 1, c[0]);
    R(7, 12, 10, 6, c[0]);
    R(7, 17, 10, 1, c[1]);
    R(8, 14, 9, 1, c[1]);
    S(9, 12, c[2]);
    R(16, 13, 3, 3, c[1]);
    S(17, 14, '#f4f4f4');
    S(19, 12, c[1]); S(20, 11, c[1]);
    if (strike) { S(21, 10, c[1]); S(20, 10, '#f4f4f4'); }
  }
}

function drawWasp(g, d, p, f, V, animId) {
  const flap = f % 2 === 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + (flap ? -3 : -2);
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, st = V.st, wing = '#dde2e8';
  if (d === 'down' || d === 'up') {
    if (flap) { R(4, 11, 5, 2, wing); R(15, 11, 5, 2, wing); S(4, 13, '#b8c0cc'); S(19, 13, '#b8c0cc'); }
    else { R(6, 13, 4, 2, wing); R(14, 13, 4, 2, wing); }
    R(10, 8, 4, 3, c[1]);
    if (d === 'down') { S(10, 9, '#f4f4f4'); S(13, 9, '#f4f4f4'); }
    S(10, 7, c[1]); S(13, 7, c[1]);
    R(9, 11, 6, 3, c[0]);
    R(9, 14, 6, 5, c[0]);
    R(9, 15, 6, 1, st); R(9, 17, 6, 1, st);
    R(10, 19, 4, 1, c[0]);
    S(11, 20, INK); S(12, 20, INK);
    if (strike) { S(11, 21, '#e8b93e'); S(12, 21, '#e8b93e'); }
  } else {
    if (flap) { R(9, 7, 5, 2, wing); S(9, 9, '#b8c0cc'); }
    else { R(10, 9, 4, 2, wing); }
    R(15, 11, 3, 3, c[1]);
    S(17, 12, '#f4f4f4');
    S(16, 10, c[1]);
    R(11, 11, 4, 4, c[0]);
    R(5, 12, 6, 4, c[0]);
    R(6, 12, 1, 4, st); R(9, 12, 1, 4, st);
    S(4, 13, INK); S(3, 14, INK);
    if (strike) { S(2, 15, '#e8b93e'); }
    S(12, 15, c[1]); S(14, 15, c[1]);
  }
}

// ---------------- mimic / drake ----------------
function drawMimic(g, d, p, f, V, animId) {
  const hop = animId === 'walk' && (f === 1 || f === 3) ? 1 : 0;
  const crack = animId === 'idle' && f === 1;
  const open = animId === 'attack';
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) - hop;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, tr = V.tr, eye = V.eye;
  const W = '#f4f4f4', T = '#e05545';
  if (d === 'down' || d === 'up') {
    R(7, 15, 10, 5, c[0]);
    R(7, 19, 10, 1, c[1]);
    S(8, 20, c[1]); S(15, 20, c[1]);
    if (open) {
      R(7, 7, 10, 3, c[0]); R(7, 7, 10, 1, c[1]);
      R(7, 10, 10, 5, INK);
      if (d === 'down') {
        S(8, 10, W); S(10, 10, W); S(12, 10, W); S(14, 10, W);
        S(9, 14, W); S(11, 14, W); S(13, 14, W); S(15, 14, W);
        R(10, 12, 4, 2, T);
        S(9, 8, eye); S(14, 8, eye);
      }
    } else {
      const ly = crack ? 10 : 11;
      R(7, ly, 10, 4, c[0]);
      R(7, ly, 10, 1, c[1]);
      R(7, ly + 3, 10, 1, tr);
      if (crack) {
        R(7, 14, 10, 1, INK);
        if (d === 'down') { S(9, 14, eye); S(14, 14, eye); }
      }
      if (d === 'down') { R(11, 15, 2, 2, tr); S(11, 16, INK); }
      else { S(9, 15, tr); S(14, 15, tr); }
    }
  } else {
    R(9, 15, 7, 5, c[0]);
    R(9, 19, 7, 1, c[1]);
    S(10, 20, c[1]); S(14, 20, c[1]);
    if (open) {
      R(10, 7, 6, 2, c[0]);
      R(10, 9, 6, 6, INK);
      S(15, 9, W); S(15, 11, W); S(15, 13, W);
      S(13, 9, W); S(13, 13, W);
      R(11, 12, 4, 1, T); S(16, 12, T);
      S(13, 8, eye);
    } else {
      const ly = crack ? 10 : 11;
      R(9, ly, 7, 4, c[0]);
      R(9, ly, 7, 1, c[1]);
      R(9, ly + 3, 7, 1, tr);
      if (crack) { R(9, 14, 7, 1, INK); S(13, 14, eye); }
    }
  }
}

function drawDrake(g, d, p, f, V, animId) {
  const u = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const leg = p.leg;
  const flap = f % 2 === 0;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, br = V.br, eye = V.eye;
  if (d === 'right') {
    const legH = (x, cc) => R(x, 16, 2, 5, cc);
    legH(12 - leg, c[1]); legH(7 + leg, c[1]);
    legH(14 + leg, c[0]); legH(5 - leg, c[0]);
    R(4, 11 + u, 13, 5, c[0]);
    R(4, 14 + u, 13, 2, V.belly);
    S(3, 10 + u, c[0]); S(2, 9 + u, c[1]); S(2, 8 + u, c[1]);
    R(6, 8 + u, 6, 3, c[1]); S(5, 9 + u, c[1]); S(12, 8 + u, c[1]);
    S(6, 7 + u, c[1]);
    R(14, 6 + u, 4, 4, c[0]);
    S(14, 5 + u, BONE[0]); S(15, 4 + u, BONE[0]);
    R(18, 7 + u, 2, 2, c[0]); S(19, 7 + u, c[1]);
    S(16, 7 + u, eye);
    if (strike) {
      S(18, 9 + u, INK);
      S(20, 8 + u, br[0]); R(21, 7 + u, 2, 1, br[0]); S(21, 9 + u, br[1]); S(22, 8 + u, br[1]); S(23, 6 + u, br[0]);
    }
  } else {
    if (flap) {
      R(3, 10 + u, 5, 2, c[1]); R(4, 12 + u, 3, 1, c[1]); S(3, 12 + u, c[1]);
      R(16, 10 + u, 5, 2, c[1]); R(17, 12 + u, 3, 1, c[1]); S(20, 12 + u, c[1]);
    } else {
      R(6, 11 + u, 2, 5, c[1]);
      R(16, 11 + u, 2, 5, c[1]);
    }
    R(8, 11 + u, 8, 8 - u, c[0]);
    R(10, 15, 4, 3, V.belly);
    R(8, 19, 3, leg === 1 ? 2 : 3, c[1]);
    R(13, 19, 3, leg === -1 ? 2 : 3, c[1]);
    R(10, 6 + u, 4, 4, c[0]);
    S(9, 5 + u, BONE[0]); S(14, 5 + u, BONE[0]);
    if (d === 'down') {
      S(10, 8 + u, eye); S(13, 8 + u, eye);
      S(11, 9 + u, c[1]); S(12, 9 + u, c[1]);
      if (strike) { R(10, 10 + u, 4, 1, INK); S(9, 10 + u, br[0]); S(14, 10 + u, br[0]); S(8, 11 + u, br[1]); S(15, 11 + u, br[1]); }
    } else {
      R(11, 17, 2, 4, c[1]); S(12, 21, c[1]);
    }
  }
}

// ---------------- swamp and shoreline creatures ----------------
function drawFrog(g, d, p, f, V, animId) {
  const hop = animId === 'walk' && (f === 1 || f === 3) ? -2 : (animId === 'idle' && f === 1 ? 1 : 0);
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const kick = animId === 'walk' && (f === 0 || f === 2) ? (f === 0 ? -1 : 1) : 0;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + hop;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, belly = V.belly, mark = V.mark, eye = V.eye;
  const tongue = '#e878a8';

  if (d === 'right') {
    R(5 - kick, 18, 5, 2, c[1]); R(3 - kick, 20, 6, 2, c[1]);
    R(14 + kick, 18, 4, 2, c[0]); R(16 + kick, 20, 5, 2, c[1]);
    R(6, 13, 11, 6, c[0]); R(7, 17, 9, 2, belly);
    R(14, 10, 6, 5, c[0]); R(16, 9, 3, 2, c[0]);
    S(17, 10, eye); S(18, 11, '#f4f4f4');
    S(8, 14, mark); S(10, 16, mark); S(13, 14, mark);
    if (strike) {
      R(19, 13, 3, 1, tongue);
      if (f === 1) R(21, 13, 2, 1, tongue);
    }
  } else {
    R(5 - kick, 18, 5, 2, c[1]); R(4 - kick, 20, 6, 2, c[1]);
    R(14 + kick, 18, 5, 2, c[1]); R(14 + kick, 20, 6, 2, c[1]);
    R(7, 12, 10, 7, c[0]); R(8, 16, 8, 3, belly);
    R(6, 9, 12, 5, c[0]);
    R(7, 7, 4, 3, c[0]); R(13, 7, 4, 3, c[0]);
    S(8, 8, d === 'down' ? eye : mark); S(15, 8, d === 'down' ? eye : mark);
    S(9, 11, mark); S(14, 12, mark); S(11, 14, mark);
    if (d === 'down') {
      S(9, 9, '#f4f4f4'); S(14, 9, '#f4f4f4');
      if (strike) {
        R(11, 14, 2, f === 1 ? 7 : 5, tongue);
        S(11, 20, '#f2a0bd'); S(12, 20, '#f2a0bd');
      }
    } else {
      R(9, 10, 6, 1, c[1]);
      S(10, 13, mark); S(13, 15, mark);
    }
  }
}

function drawCrocodile(g, d, p, f, V, animId) {
  const step = animId === 'walk' ? (f === 0 ? -1 : f === 2 ? 1 : 0) : 0;
  const bob = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, belly = V.belly, mark = V.mark, eye = V.eye;

  if (d === 'right') {
    R(6 + step, 17, 3, 4, c[1]); R(13 - step, 17, 3, 4, c[1]);
    S(5 + step, 21, c[1]); S(16 - step, 21, c[1]);
    S(2, 15 + bob, c[1]); R(3, 14 + bob, 3, 2, c[0]); R(5, 12 + bob, 12, 6, c[0]);
    R(6, 16 + bob, 11, 2, belly);
    S(7, 11 + bob, c[2]); S(10, 10 + bob, c[2]); S(13, 11 + bob, c[2]);
    R(15, 10 + bob, 6, strike ? 5 : 4, c[0]);
    R(17, 13 + bob, 4, 2, belly);
    S(17, 11 + bob, eye); S(20, 12 + bob, mark);
    if (strike) {
      R(17, 14 + bob, 5, 1, INK);
      S(18, 14 + bob, '#f4f4f4'); S(20, 14 + bob, '#f4f4f4');
      S(21, 13 + bob, belly);
    }
    S(8, 13 + bob, mark); S(12, 15 + bob, mark);
  } else {
    R(5 - step, 15, 4, 3, c[1]); R(15 + step, 15, 4, 3, c[1]);
    R(6 + step, 19, 3, 3, c[1]); R(15 - step, 19, 3, 3, c[1]);
    R(8, 11 + bob, 8, 9 - bob, c[0]); R(9, 17, 6, 3, belly);
    R(7, 7 + bob, 10, 6, c[0]); R(8, 12 + bob, 8, 2, c[1]);
    S(8, 6 + bob, c[2]); S(11, 5 + bob, c[2]); S(15, 6 + bob, c[2]);
    S(9, 9 + bob, d === 'down' ? eye : mark); S(14, 9 + bob, d === 'down' ? eye : mark);
    S(10, 13 + bob, mark); S(13, 15 + bob, mark);
    if (d === 'down') {
      R(9, 11 + bob, 6, strike ? 2 : 1, belly);
      if (strike) {
        S(10, 12 + bob, '#f4f4f4'); S(13, 12 + bob, '#f4f4f4');
      }
    } else {
      R(10, 18, 4, 4, c[1]); S(11, 21, mark); S(12, 21, mark);
    }
  }
}

function drawTurtle(g, d, p, f, V, animId) {
  const step = animId === 'walk' ? (f === 0 ? -1 : f === 2 ? 1 : 0) : 0;
  const bob = animId === 'idle' && f === 1 ? 1 : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const shell = V.c, skin = V.skin, mark = V.mark, eye = V.eye;

  if (d === 'right') {
    R(5 + step, 18, 4, 3, skin[1]); R(13 - step, 18, 4, 3, skin[1]);
    S(4 + step, 20, skin[0]); S(17 - step, 20, skin[0]);
    S(4, 14 + bob, skin[1]); S(3, 15 + bob, skin[1]);
    R(5, 10 + bob, 12, 9 - bob, shell[0]);
    R(6, 9 + bob, 9, 1, shell[0]); R(6, 17, 10, 2, shell[1]);
    R(8, 11 + bob, 5, 5, shell[1]); R(9, 12 + bob, 3, 3, mark);
    const hx = strike ? 16 : 15;
    R(hx, 12 + bob, strike ? 6 : 5, 4, skin[0]);
    R(hx + 1, 15 + bob, strike ? 5 : 4, 1, skin[1]);
    S(hx + (strike ? 4 : 3), 13 + bob, eye);
    if (strike) S(21, 14 + bob, '#f4f4f4');
  } else {
    R(5 - step, 15, 4, 3, skin[1]); R(15 + step, 15, 4, 3, skin[1]);
    R(7 + step, 19, 3, 3, skin[1]); R(14 - step, 19, 3, 3, skin[1]);
    R(6, 10 + bob, 12, 9 - bob, shell[0]); R(7, 9 + bob, 10, 1, shell[0]);
    R(7, 17, 10, 2, shell[1]);
    R(8, 11 + bob, 8, 5, shell[1]);
    S(9, 12 + bob, mark); R(11, 11 + bob, 2, 2, mark); S(14, 14 + bob, mark); R(10, 15 + bob, 4, 1, mark);
    const hy = strike ? 6 : 7;
    R(9, hy + bob, 6, 4, skin[0]); R(10, hy + 3 + bob, 4, 1, skin[1]);
    if (d === 'down') {
      S(10, hy + 1 + bob, eye); S(13, hy + 1 + bob, eye);
      if (strike) { S(11, hy + 4 + bob, '#f4f4f4'); S(12, hy + 4 + bob, '#f4f4f4'); }
    } else {
      S(10, hy + 1 + bob, mark); S(13, hy + 2 + bob, mark);
    }
  }
}

function drawJellyfish(g, d, p, f, V, animId) {
  const float = f % 2 === 0 ? -2 : -1;
  const pulse = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3));
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + float;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, glow = V.glow, eye = V.eye;

  if (d === 'right') {
    R(8, 7, 8, 1, c[0]); R(7, 8, 10, pulse ? 5 : 6, c[0]);
    R(8, pulse ? 13 : 14, 8, 2, c[1]);
    S(10, 9, glow); S(14, 11, glow); S(15, 10, eye);
    R(8, 15, 2, strike ? 6 : 4, c[1]); R(12, 15, 2, strike ? 4 : 6, c[1]); R(16, 14, 1, strike ? 7 : 5, c[1]);
    S(7, 18, glow); S(11, 20, glow); S(15, 18, glow);
    if (strike) { R(17, 16, 4, 1, glow); S(21, 15, glow); S(22, 14, glow); }
  } else {
    R(9, 6, 6, 1, c[0]); R(7, 7, 10, 2, c[0]); R(6, 9, 12, pulse ? 5 : 6, c[0]);
    R(7, pulse ? 14 : 15, 10, 2, c[1]);
    S(9, 9, glow); S(14, 8, glow); S(12, 12, glow);
    if (d === 'down') { S(9, 11, eye); S(14, 11, eye); }
    else { S(10, 10, glow); S(13, 13, glow); }
    R(7, 16, 2, strike ? 6 : 4, c[1]); R(11, 16, 2, strike ? 4 : 6, c[1]); R(15, 16, 2, strike ? 6 : 4, c[1]);
    S(8, 20, glow); S(12, 21, glow); S(16, 19, glow);
    if (strike && d === 'down') { S(7, 22, glow); S(16, 22, glow); }
    if (strike && d === 'up') { S(7, 5, glow); S(16, 5, glow); }
  }
}

// ---------------- deep wilds creatures ----------------
function drawCentipede(g, d, p, f, V, animId) {
  const wig = f % 2 === 0 ? 0 : 1;
  const bob = animId === 'idle' && f === 1 ? 1 : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, eye = V.eye, venom = V.venom;

  if (d === 'right') {
    for (let i = 0; i < 5; i++) {
      const x = 4 + i * 3;
      const legDrop = (i + wig) % 2;
      R(x, 17, 2, 2, c[1]); S(x - 1, 19 + legDrop, c[1]); S(x + 2, 19 + (1 - legDrop), c[1]);
      R(x, 13 + bob, 3, 4 - bob, c[0]); S(x + 1, 13 + bob, c[2]);
    }
    R(18, 12 + bob, strike ? 4 : 3, 5, c[0]);
    S(19, 13 + bob, eye); S(21, 14 + bob, c[1]);
    S(19, 11 + bob, c[2]); S(20, 10 + bob, c[2]);
    if (strike) {
      S(21, 16 + bob, venom); S(22, 15 + bob, venom); S(22, 17 + bob, venom);
    }
    S(3, 14 + bob, c[1]); S(2, 15 + bob, c[1]);
  } else {
    for (let i = 0; i < 5; i++) {
      const y = 8 + i * 3;
      const legReach = (i + wig) % 2;
      R(10, y + bob, 4, 3, c[0]); S(11, y + bob, c[2]);
      S(9, y + 1 + bob, c[1]); S(8 - legReach, y + 2 + bob, c[1]);
      S(14, y + 1 + bob, c[1]); S(15 + legReach, y + 2 + bob, c[1]);
    }
    R(9, 5 + bob, 6, 4, c[0]);
    S(10, 6 + bob, d === 'down' ? eye : c[2]); S(13, 6 + bob, d === 'down' ? eye : c[2]);
    S(9, 4 + bob, c[2]); S(14, 4 + bob, c[2]);
    if (strike && d === 'down') {
      S(10, 9 + bob, venom); S(9, 10 + bob, venom); S(13, 9 + bob, venom); S(14, 10 + bob, venom);
    }
    if (d === 'up') { S(11, 22, c[1]); S(12, 22, c[1]); }
  }
}

function drawCarnivorousPlant(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { x: 0,  bob: 0, lx: 7, ly: 21, rx: 13, ry: 19 },
    { x: 1,  bob: 1, lx: 8, ly: 20, rx: 14, ry: 21 },
    { x: 0,  bob: 0, lx: 9, ly: 19, rx: 14, ry: 21 },
    { x: -1, bob: 1, lx: 7, ly: 21, rx: 13, ry: 20 },
  ][f] : { x: 0, bob: 0, lx: 8, ly: 21, rx: 13, ry: 21 };
  const bob = walking ? gait.bob : (animId === 'idle' && f === 1 ? 1 : 0);
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const stem = V.stem, bloom = V.bloom, maw = V.maw, pollen = V.pollen;
  const bx = gait.x;
  const cx = walking ? bx + p.leg : 0;

  // Bend the whole stalk with the bloom, then alternate the two roots as
  // actual stepping feet. The previous cycle moved only the bloom.
  R(10 + bx, 15 + bob, 4, 6 - bob, stem[0]); R(10 + bx, 19, 4, 2, stem[1]);
  S(9 + bx, 16 + bob, stem[0]); R(6 + bx, 17 + bob, 4, 2, stem[0]); S(6 + bx, 19 + bob, stem[1]);
  S(14 + bx, 15 + bob, stem[0]); R(14 + bx, 16 + bob, 4, 2, stem[0]); S(17 + bx, 18 + bob, stem[1]);
  R(gait.lx, gait.ly, 3, 1, stem[1]); R(gait.rx, gait.ry, 3, 1, stem[1]);
  S(gait.lx - 1, Math.min(22, gait.ly + 1), stem[1]); S(gait.rx + 2, Math.min(22, gait.ry + 1), stem[1]);

  if (d === 'right') {
    R(10 + cx, 8 + bob, 7, 7 - bob, bloom[0]);
    S(9 + cx, 9 + bob, bloom[1]); S(11 + cx, 7 + bob, bloom[0]); S(14 + cx, 6 + bob, bloom[1]); S(17 + cx, 8 + bob, bloom[1]);
    if (strike) {
      R(15 + cx, 9 + bob, 6, 5, INK); R(17 + cx, 11 + bob, 4, 2, maw);
      S(17 + cx, 9 + bob, '#f4f4f4'); S(19 + cx, 13 + bob, '#f4f4f4');
      R(18, 17, 3, 1, stem[0]); S(21, 16, pollen); S(22, 15, pollen);
    } else {
      S(15 + cx, 10 + bob, pollen); R(16 + cx, 12 + bob, 2, 1, bloom[1]);
    }
  } else {
    R(7 + cx, 8 + bob, 10, 7 - bob, bloom[0]);
    S(8 + cx, 7 + bob, bloom[1]); S(11 + cx, 6 + bob, bloom[0]); S(15 + cx, 7 + bob, bloom[1]);
    S(6 + cx, 10 + bob, bloom[1]); S(17 + cx, 11 + bob, bloom[1]);
    if (strike && d === 'down') {
      R(9 + cx, 9 + bob, 6, 5, INK); R(10 + cx, 11 + bob, 4, 2, maw);
      S(9 + cx, 9 + bob, '#f4f4f4'); S(14 + cx, 9 + bob, '#f4f4f4');
      S(10 + cx, 13 + bob, '#f4f4f4'); S(13 + cx, 13 + bob, '#f4f4f4');
    } else if (d === 'down') {
      S(10 + cx, 10 + bob, pollen); S(13 + cx, 10 + bob, pollen); R(11 + cx, 12 + bob, 2, 1, bloom[1]);
    } else {
      S(9 + cx, 10 + bob, pollen); S(14 + cx, 12 + bob, pollen); S(12 + cx, 8 + bob, stem[1]);
    }
    if (strike && d === 'up') { S(7, 6, pollen); S(16, 5, pollen); S(18, 7, pollen); }
  }
}

function drawAnglerfish(g, d, p, f, V, animId) {
  const swim = f % 2 === 0 ? -1 : 0;
  const tail = animId === 'walk' ? (f === 0 ? -1 : f === 2 ? 1 : 0) : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) + swim - 1;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, belly = V.belly, lure = V.lure, eye = V.eye;

  if (d === 'right') {
    S(3, 12 + tail, c[1]); R(4, 11 + tail, 3, 3, c[0]); S(3, 15 - tail, c[1]); R(4, 14 - tail, 3, 3, c[0]);
    R(6, 9, 11, 9, c[0]); R(7, 16, 10, 2, belly);
    R(15, 10, strike ? 7 : 5, 7, c[0]); S(18, 11, eye);
    S(11, 8, c[1]); S(9, 7, c[1]); S(7, 8, c[1]);
    S(15, 8, c[1]); S(15, 7, c[1]); S(16, 6, c[1]); S(17, 6, lure);
    S(9, 18, c[1]); S(12, 19, c[1]);
    if (strike) {
      R(18, 14, 4, 2, INK);
      S(18, 14, '#f4f4f4'); S(20, 14, '#f4f4f4'); S(19, 15, '#f4f4f4'); S(21, 15, '#f4f4f4');
    }
  } else {
    S(9 + tail, 18, c[1]); R(8 + tail, 19, 3, 2, c[0]); S(15 - tail, 18, c[1]); R(14 - tail, 19, 3, 2, c[0]);
    R(7, 9, 10, 10, c[0]); R(8, 16, 8, 3, belly);
    R(8, 7, 8, 4, c[0]); S(7, 8, c[1]); S(16, 8, c[1]);
    S(10, 5, c[1]); S(10, 4, c[1]); S(11, 3, lure);
    if (d === 'down') {
      S(9, 9, eye); S(14, 9, eye);
      if (strike) {
        R(9, 11, 6, 4, INK);
        S(9, 11, '#f4f4f4'); S(11, 11, '#f4f4f4'); S(13, 11, '#f4f4f4');
        S(10, 14, '#f4f4f4'); S(12, 14, '#f4f4f4'); S(14, 14, '#f4f4f4');
      }
    } else {
      S(9, 10, lure); S(14, 12, lure); R(10, 8, 4, 1, c[1]);
    }
    S(6, 13, c[1]); S(17, 14, c[1]);
  }
}

function drawGriffin(g, d, p, f, V, animId) {
  const flap = f % 2 === 0;
  const bob = (animId === 'idle' && f === 1) || (animId === 'walk' && (f === 1 || f === 3)) ? 1 : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const leg = p.leg;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const fur = V.fur, wing = V.wing, beak = V.beak, eye = V.eye;

  if (d === 'right') {
    R(6 + leg, 17, 2, 5, fur[1]); R(13 - leg, 17, 2, 5, fur[1]);
    S(5 + leg, 21, beak); S(15 - leg, 21, beak);
    R(5, 12 + bob, 11, 6 - bob, fur[0]); R(5, 16, 11, 2, fur[1]);
    S(4, 12 + bob, fur[0]); S(3, 11 + bob, fur[1]); S(2, 10 + bob, fur[1]);
    if (flap) { R(7, 7 + bob, 7, 2, wing[0]); R(8, 9 + bob, 6, 3, wing[1]); S(6, 6 + bob, wing[0]); }
    else { R(8, 9 + bob, 5, 4, wing[0]); R(9, 12 + bob, 4, 1, wing[1]); }
    R(14, 8 + bob, 5, 5, wing[0]); S(15, 7 + bob, wing[1]); S(17, 7 + bob, wing[1]);
    S(17, 9 + bob, eye); R(18, 10 + bob, strike ? 4 : 3, 2, beak); S(20, 12 + bob, beak);
    if (strike) { S(17, 18, beak); S(18, 19, beak); S(19, 18, beak); }
  } else {
    if (flap || strike) {
      R(3, 8 + bob, 5, 2, wing[0]); R(4, 10 + bob, 4, 4, wing[1]); S(3, 13 + bob, wing[1]);
      R(16, 8 + bob, 5, 2, wing[0]); R(16, 10 + bob, 4, 4, wing[1]); S(20, 13 + bob, wing[1]);
    } else {
      R(6, 10 + bob, 3, 6, wing[1]); R(15, 10 + bob, 3, 6, wing[1]);
    }
    R(8, 12 + bob, 8, 7 - bob, fur[0]); R(8, 17, 8, 2, fur[1]);
    R(8 + leg, 18, 3, 4, fur[1]); R(13 - leg, 18, 3, 4, fur[1]);
    S(7 + leg, 21, beak); S(10 + leg, 21, beak); S(13 - leg, 21, beak); S(16 - leg, 21, beak);
    R(9, 7 + bob, 6, 5, wing[0]); S(9, 6 + bob, wing[1]); S(14, 6 + bob, wing[1]);
    if (d === 'down') {
      S(10, 9 + bob, eye); S(13, 9 + bob, eye); R(11, 11 + bob, 2, 2, beak); S(12, 13 + bob, beak);
      if (strike) { S(7, 17, beak); S(16, 17, beak); }
    } else {
      R(10, 8 + bob, 4, 2, wing[1]); S(11, 11 + bob, fur[1]); S(12, 11 + bob, fur[1]);
      S(11, 19, fur[1]); S(12, 20, fur[1]);
    }
  }
}

// ---------------- strange wilds creatures ----------------
function drawMantis(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const bob = (animId === 'idle' && f === 1) || (walking && p.bob) ? 1 : 0;
  const stride = walking ? p.leg : 0;
  const sweep = walking ? [0, 1, 0, -1][f] : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, blade = V.blade, eye = V.eye;

  if (d === 'right') {
    R(7 + stride, 16, 2, 5, c[1]); S(6 + stride, 21, c[1]);
    R(11 - stride, 16, 2, 6, c[0]); S(13 - stride, 21, c[1]);
    S(8 - stride, 15, c[1]); S(6 - stride, 17, c[1]);
    S(13 + stride, 15, c[1]); S(15 + stride, 18, c[1]);
    R(5, 12 + bob, 7, 5 - bob, c[0]); R(4, 13 + bob, 3, 3, c[1]);
    R(10, 9 + bob, 6, 7 - bob, c[0]); S(11, 10 + bob, c[2]);
    R(15, 7 + bob, 5, 5, c[0]); S(18, 8 + bob, eye);
    S(17, 6 + bob, c[2]); S(18 + sweep, 4 + bob, c[1]); S(19 + sweep, 3 + bob, c[1]);
    if (strike) {
      R(17, 11 + bob, 5, 2, c[1]); S(22, 12 + bob, blade); S(23, 13 + bob, blade);
      R(16, 14 + bob, 5, 2, c[0]); S(21, 16 + bob, blade); S(22, 17 + bob, blade);
    } else {
      R(13 + sweep, 11 + bob, 3, 2, c[1]); R(15 + sweep, 9 + bob, 2, 4, c[0]);
      S(16 + sweep, 8 + bob, blade); S(17 + sweep, 7 + bob, blade);
      R(13 - sweep, 14 + bob, 3, 2, c[1]); S(16 - sweep, 16 + bob, blade);
    }
  } else {
    R(8 + stride, 17, 2, 5, c[1]); R(14 - stride, 17, 2, 5, c[1]);
    S(7 + stride, 21, c[1]); S(16 - stride, 21, c[1]);
    S(8 - stride, 15, c[1]); S(6 - stride, 18, c[1]);
    S(15 + stride, 15, c[1]); S(17 + stride, 18, c[1]);
    R(9, 13 + bob, 6, 7 - bob, c[0]); R(10, 17, 4, 3, c[1]);
    R(8, 9 + bob, 8, 6 - bob, c[0]); R(9, 6 + bob, 6, 5, c[0]);
    S(10, 7 + bob, d === 'down' ? eye : c[2]); S(13, 7 + bob, d === 'down' ? eye : c[2]);
    S(9, 5 + bob, c[1]); S(8 + sweep, 3 + bob, c[1]);
    S(14, 5 + bob, c[1]); S(15 - sweep, 3 + bob, c[1]);
    if (strike) {
      R(4, 10 + bob, 4, 2, c[1]); S(3, 12 + bob, blade); S(4, 13 + bob, blade);
      R(16, 10 + bob, 4, 2, c[1]); S(20, 12 + bob, blade); S(19, 13 + bob, blade);
      if (d === 'down') { S(8, 15, blade); S(15, 15, blade); }
    } else {
      R(5 + sweep, 11 + bob, 4, 2, c[1]); S(5 + sweep, 13 + bob, blade);
      R(15 - sweep, 11 + bob, 4, 2, c[1]); S(18 - sweep, 13 + bob, blade);
    }
  }
}

function drawMoth(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const bob = (animId === 'idle' && f === 1) || (walking && p.bob) ? 1 : 0;
  const spread = walking ? [0, 1, 2, 1][f] : (animId === 'idle' && f === 1 ? 1 : 0);
  const sweep = walking ? [0, 1, 0, -1][f] : 0;
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = (d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0) - 1;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const body = V.body, wing = V.wing, dust = V.dust, eye = V.eye;

  if (d === 'right') {
    R(10, 9 + bob, 5, 8, body[0]); R(11, 15 + bob, 4, 4, body[1]);
    R(14, 7 + bob, 5, 5, body[0]); S(17, 8 + bob, eye);
    S(16, 6 + bob, body[1]); S(17 + sweep, 4 + bob, body[1]);
    S(18, 6 + bob, body[1]); S(20 + sweep, 5 + bob, body[1]);
    R(6 - spread, 7 + bob + sweep, 7 + spread, 4, wing[0]);
    R(7 - spread, 11 + bob, 6 + spread, 5, wing[1]);
    S(5 - spread, 8 + bob + sweep, wing[1]); S(6 - spread, 15 + bob, wing[0]);
    R(10, 18 + bob, 2, 2, body[1]); R(13, 18 + bob, 2, 2, body[1]);
    if (strike) {
      S(20, 10 + bob, dust); S(22, 9 + bob, dust); S(21, 12 + bob, dust);
      S(23, 14 + bob, dust); S(19, 15 + bob, dust);
    }
  } else {
    R(10, 8 + bob, 4, 10, body[0]); R(10, 15 + bob, 4, 4, body[1]);
    R(9, 6 + bob, 6, 5, body[0]);
    if (d === 'down') { S(10, 7 + bob, eye); S(13, 7 + bob, eye); }
    else { S(10, 8 + bob, wing[1]); S(13, 9 + bob, wing[1]); }
    S(10, 5 + bob, body[1]); S(8 + sweep, 3 + bob, body[1]);
    S(13, 5 + bob, body[1]); S(15 - sweep, 3 + bob, body[1]);
    R(3 - spread, 8 + bob + sweep, 7 + spread, 5, wing[0]);
    R(4 - spread, 13 + bob, 6 + spread, 4, wing[1]);
    R(14, 8 + bob - sweep, 7 + spread, 5, wing[0]);
    R(14, 13 + bob, 6 + spread, 4, wing[1]);
    S(2 - spread, 10 + bob + sweep, wing[1]); S(21 + spread, 10 + bob - sweep, wing[1]);
    R(9, 18 + bob, 2, 2, body[1]); R(13, 18 + bob, 2, 2, body[1]);
    if (strike) {
      const dy = d === 'down' ? 1 : -1;
      S(6, 17 + dy * f, dust); S(17, 16 + dy * f, dust);
      S(4, 19 + dy, dust); S(19, 18 + dy, dust); S(12, 21 + dy, dust);
    }
  }
}

function drawOctopus(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { x: 0, bob: 0, a: -1, b: 1 },
    { x: 1, bob: 1, a: 0, b: -1 },
    { x: 0, bob: 0, a: 1, b: -1 },
    { x: -1, bob: 1, a: 0, b: 1 },
  ][f] : { x: 0, bob: animId === 'idle' && f === 1 ? 1 : 0, a: 0, b: 0 };
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const c = V.c, underside = V.underside, ring = V.ring, ink = V.ink, eye = V.eye;
  const bx = gait.x, by = gait.bob;

  if (d === 'right') {
    R(8 + bx, 7 + by, 9, 10 - by, c[0]); R(10 + bx, 6 + by, 6, 2, c[0]);
    R(9 + bx, 14, 8, 3, underside); S(15 + bx, 9 + by, eye); S(16 + bx, 11 + by, ring);
    R(6 + gait.a, 16, 5, 2, c[1]); R(4 + gait.a, 18, 6, 2, c[0]); S(3 + gait.a, 20, c[1]);
    R(9 + gait.b, 17, 5, 2, c[1]); R(8 + gait.b, 20, 6, 2, c[0]); S(7 + gait.b, 22, c[1]);
    R(13 - gait.a, 17, 5, 2, c[1]); R(15 - gait.a, 19, 5, 2, c[0]); S(20 - gait.a, 21, c[1]);
    if (strike) {
      R(16, 15, 6, 2, c[0]); S(22, 14, c[1]); S(23, 13, ring);
      S(19, 9, ink); S(21, 8, ink); S(22, 10, ink);
    }
  } else {
    R(7 + bx, 7 + by, 10, 10 - by, c[0]); R(9 + bx, 5 + by, 6, 3, c[0]);
    R(8 + bx, 14, 8, 3, underside);
    if (d === 'down') { S(9 + bx, 9 + by, eye); S(14 + bx, 9 + by, eye); S(11 + bx, 12 + by, ring); S(13 + bx, 12 + by, ring); }
    else { S(9 + bx, 8 + by, ring); S(14 + bx, 10 + by, ring); R(10 + bx, 6 + by, 4, 1, c[1]); }
    R(4 + gait.a, 16, 6, 2, c[1]); R(3 + gait.a, 19, 5, 2, c[0]); S(2 + gait.a, 21, c[1]);
    R(8 + gait.b, 17, 4, 2, c[1]); R(7 + gait.b, 20, 5, 2, c[0]); S(6 + gait.b, 22, c[1]);
    R(12 - gait.b, 17, 4, 2, c[1]); R(12 - gait.b, 20, 5, 2, c[0]); S(17 - gait.b, 22, c[1]);
    R(14 - gait.a, 16, 6, 2, c[1]); R(16 - gait.a, 19, 5, 2, c[0]); S(21 - gait.a, 21, c[1]);
    if (strike) {
      if (d === 'down') { R(10, 17, 4, 5, c[0]); S(9, 22, ring); S(14, 22, ring); }
      S(5, 8, ink); S(3, 7, ink); S(19, 9, ink); S(21, 7, ink);
    }
  }
}

function drawMole(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { x: 0, bob: 0, left: 1, right: -1 },
    { x: 1, bob: 1, left: 0, right: 1 },
    { x: 0, bob: 0, left: -1, right: 1 },
    { x: -1, bob: 1, left: 0, right: -1 },
  ][f] : { x: 0, bob: animId === 'idle' && f === 1 ? 1 : 0, left: 0, right: 0 };
  const buried = animId === 'attack' && f === 1;
  const erupt = animId === 'attack' && f === 2;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const fur = V.fur, belly = V.belly, claw = V.claw, nose = V.nose, eye = V.eye;

  if (buried) {
    R(5, 19, 14, 3, fur[1]); R(7, 17, 10, 2, fur[0]);
    S(4, 21, claw); S(19, 21, claw); S(6, 18, belly); S(17, 18, belly);
    R(8, 22, 8, 1, fur[1]); S(3, 20, fur[0]); S(20, 20, fur[0]);
    return;
  }

  const bx = gait.x, by = gait.bob - (erupt ? 2 : 0);
  if (d === 'right') {
    R(6 + bx, 12 + by, 10, 7, fur[0]); R(7 + bx, 16 + by, 9, 3, belly);
    R(14 + bx, 9 + by, 6, 7, fur[0]); S(18 + bx, 10 + by, eye);
    R(19 + bx, 12 + by, 3, 2, nose); S(21 + bx, 14 + by, nose);
    S(15 + bx, 8 + by, fur[1]); S(17 + bx, 8 + by, fur[1]);
    R(7 + gait.left, 18, 3, 4, fur[1]); R(13 + gait.right, 18, 3, 4, fur[1]);
    S(6 + gait.left, 21, claw); S(16 + gait.right, 21, claw);
    R(15 + bx, 15 + by, erupt ? 6 : 4, 2, fur[1]);
    S(19 + bx, 17 + by, claw); S(20 + bx, 16 + by, claw); S(21 + bx, 15 + by, claw);
    S(5 + bx, 14 + by, fur[1]); S(4 + bx, 15 + by, fur[1]);
  } else {
    R(7 + bx, 11 + by, 10, 9, fur[0]); R(9 + bx, 16 + by, 6, 4, belly);
    R(8 + bx, 7 + by, 8, 7, fur[0]); S(8 + bx, 6 + by, fur[1]); S(15 + bx, 6 + by, fur[1]);
    if (d === 'down') {
      S(9 + bx, 9 + by, eye); S(14 + bx, 9 + by, eye); R(11 + bx, 12 + by, 3, 2, nose);
    } else {
      R(10 + bx, 8 + by, 4, 2, fur[1]); S(9 + bx, 11 + by, belly); S(14 + bx, 11 + by, belly);
    }
    R(6 + gait.left, 17, 3, 3, fur[1]); R(15 + gait.right, 17, 3, 3, fur[1]);
    S(5 + gait.left, 20, claw); S(6 + gait.left, 21, claw);
    S(18 + gait.right, 20, claw); S(17 + gait.right, 21, claw);
    R(8 + gait.left, 19, 3, 3, fur[1]); R(13 + gait.right, 19, 3, 3, fur[1]);
    S(7 + gait.left, 22, claw); S(16 + gait.right, 22, claw);
    if (erupt) { S(4, 18, claw); S(19, 18, claw); S(3, 20, fur[1]); S(20, 20, fur[1]); }
  }
}

// ---------------- cursed frontier creatures ----------------
function drawScarecrow(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { bob: 0, left: -1, right: 1, arm: -1 },
    { bob: 1, left: 0, right: 1, arm: 0 },
    { bob: 0, left: 1, right: -1, arm: 1 },
    { bob: 1, left: -1, right: 0, arm: 0 },
  ][f] : { bob: animId === 'idle' && f === 1 ? 1 : 0, left: 0, right: 0, arm: 0 };
  const spinning = animId === 'attack' && (f === 1 || f === 2);
  const spin = spinning ? (f === 1 ? -3 : 3) : gait.arm;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const cloth = V.cloth, straw = V.straw, hat = V.hat, eye = V.eye;
  const bob = gait.bob;

  if (d === 'right') {
    R(8 + gait.left, 17, 2, 5, cloth[1]); S(7 + gait.left, 21, straw);
    R(12 + gait.right, 17, 2, 5, cloth[0]); S(14 + gait.right, 21, straw);
    R(7, 10 + bob, 8, 9 - bob, cloth[0]); R(7, 15, 8, 3, cloth[1]);
    S(9, 12 + bob, straw); S(13, 16, straw);
    R(12, 6 + bob, 6, 5, straw); S(17, 8 + bob, eye);
    R(11, 4 + bob, 8, 2, hat[0]); R(13, 2 + bob, 5, 3, hat[1]); S(18, 3 + bob, hat[0]);
    if (spinning) {
      R(2, 11 + bob + spin, 7, 2, straw); S(1, 10 + bob + spin, straw);
      R(14, 11 + bob - spin, 8, 2, straw); S(22, 12 + bob - spin, straw);
      S(3, 7 + bob, straw); S(20, 17 + bob, straw);
    } else {
      R(3, 11 + bob + gait.arm, 5, 2, straw); S(2, 12 + bob + gait.arm, straw);
      R(14, 12 + bob - gait.arm, 6, 2, straw); S(20, 13 + bob - gait.arm, straw);
    }
  } else {
    R(8 + gait.left, 17, 3, 5, cloth[1]); R(13 + gait.right, 17, 3, 5, cloth[0]);
    S(7 + gait.left, 21, straw); S(16 + gait.right, 21, straw);
    R(8, 10 + bob, 8, 9 - bob, cloth[0]); R(9, 15, 6, 3, cloth[1]);
    S(10, 12 + bob, straw); S(14, 16, straw);
    R(9, 6 + bob, 6, 5, straw);
    R(7, 4 + bob, 10, 2, hat[0]); R(9, 2 + bob, 7, 3, hat[1]); S(8, 3 + bob, hat[0]);
    if (d === 'down') { S(10, 8 + bob, eye); S(13, 8 + bob, eye); S(11, 10 + bob, hat[1]); }
    else { R(10, 7 + bob, 4, 2, hat[1]); S(9, 10 + bob, cloth[1]); S(14, 10 + bob, cloth[1]); }
    if (spinning) {
      R(2, 11 + bob + spin, 7, 2, straw); S(1, 10 + bob + spin, straw);
      R(15, 11 + bob - spin, 7, 2, straw); S(22, 10 + bob - spin, straw);
      S(4, 7 + bob, straw); S(19, 17 + bob, straw);
    } else {
      R(3, 12 + bob + gait.arm, 6, 2, straw); S(2, 13 + bob + gait.arm, straw);
      R(15, 12 + bob - gait.arm, 6, 2, straw); S(21, 13 + bob - gait.arm, straw);
    }
  }
}

function drawSnail(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { slide: -1, bob: 0, stretch: 0, stalk: 1 },
    { slide: 0, bob: 1, stretch: 1, stalk: 0 },
    { slide: 1, bob: 0, stretch: 0, stalk: -1 },
    { slide: 0, bob: 1, stretch: -1, stalk: 0 },
  ][f] : { slide: 0, bob: animId === 'idle' && f === 1 ? 1 : 0, stretch: 0, stalk: animId === 'idle' && f === 1 ? 1 : 0 };
  const withdrawn = animId === 'attack' && f === 1;
  const rolling = animId === 'attack' && f === 2;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const body = V.body, shell = V.shell, trail = V.trail, eye = V.eye;
  const bx = gait.slide + (rolling ? 2 : 0), by = gait.bob - (rolling ? 1 : 0);

  if (withdrawn) {
    R(6, 10, 12, 10, shell[0]); R(8, 8, 8, 3, shell[0]); R(8, 13, 8, 5, shell[1]);
    R(10, 11, 5, 4, shell[2]); R(11, 12, 2, 2, shell[1]);
    R(5, 20, 14, 2, trail); S(4, 21, body[1]); S(19, 21, body[1]);
    return;
  }

  if (d === 'right') {
    R(4 + bx, 18 + by, 15 + gait.stretch, 4 - by, body[0]); R(3 + bx, 21, 18, 2, trail);
    R(6 + bx, 10 + by, 11, 10 - by, shell[0]); R(8 + bx, 8 + by, 7, 3, shell[0]);
    R(8 + bx, 13 + by, 7, 5, shell[1]); R(10 + bx, 11 + by, 5, 4, shell[2]);
    S(11 + bx, 13 + by, shell[1]); S(12 + bx, 14 + by, shell[1]);
    R(16 + bx, 15 + by, 5 + gait.stretch, 5 - by, body[0]); S(20 + bx + gait.stretch, 18 + by, body[1]);
    S(17 + bx, 14 + by, body[1]); S(17 + bx, 11 + by - gait.stalk, body[1]); S(17 + bx, 10 + by - gait.stalk, eye);
    S(20 + bx, 14 + by, body[1]); S(20 + bx, 12 + by + gait.stalk, body[1]); S(20 + bx, 11 + by + gait.stalk, eye);
    if (rolling) { S(4, 17, trail); S(2, 19, trail); S(1, 21, trail); }
  } else {
    R(6 + bx, 10 + by, 12, 10 - by, shell[0]); R(8 + bx, 8 + by, 8, 3, shell[0]);
    R(8 + bx, 13 + by, 8, 5, shell[1]); R(10 + bx, 11 + by, 5, 4, shell[2]); S(11 + bx, 13 + by, shell[1]);
    R(5 + bx, 18 + by, 14 + gait.stretch, 4 - by, body[0]); R(4 + bx, 21, 16 + gait.stretch, 2, trail);
    if (d === 'down') {
      R(8 + bx, 16 + by, 8 + gait.stretch, 5 - by, body[0]);
      S(8 + bx - gait.stretch, 15 + by, body[1]); S(7 + bx - gait.stretch, 12 + by - gait.stalk, body[1]); S(7 + bx - gait.stretch, 11 + by - gait.stalk, eye);
      S(15 + bx + gait.stretch, 15 + by, body[1]); S(16 + bx + gait.stretch, 12 + by + gait.stalk, body[1]); S(16 + bx + gait.stretch, 11 + by + gait.stalk, eye);
    } else {
      S(7 + bx - gait.stretch, 17 + by, body[1]); S(16 + bx + gait.stretch, 17 + by, body[1]); R(10 + bx, 18 + by, 4 + gait.stretch, 2, shell[2]);
    }
    if (rolling) { S(3, 18, trail); S(20, 19, trail); S(2, 21, trail); S(21, 21, trail); }
  }
}

function drawPorcupine(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { x: -1, bob: 0, front: 1, back: -1 },
    { x: 0, bob: 1, front: 0, back: 1 },
    { x: 1, bob: 0, front: -1, back: 1 },
    { x: 0, bob: 1, front: 1, back: 0 },
  ][f] : { x: 0, bob: animId === 'idle' && f === 1 ? 1 : 0, front: 0, back: 0 };
  const flare = animId === 'attack' && (f === 1 || f === 2);
  const burst = animId === 'attack' && f === 2;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const fur = V.fur, quill = V.quill, belly = V.belly, eye = V.eye;
  const bx = gait.x, by = gait.bob;

  if (d === 'right') {
    R(6 + bx, 12 + by, 11, 7 - by, fur[0]); R(8 + bx, 16, 10, 3, belly);
    R(15 + bx, 13 + by, 6, 5 - by, fur[0]); S(19 + bx, 14 + by, eye); S(21 + bx, 17 + by, fur[1]);
    R(7 + gait.back, 18, 3, 4, fur[1]); R(15 + gait.front, 18, 3, 4, fur[1]);
    S(6 + gait.back, 21, quill[1]); S(18 + gait.front, 21, quill[1]);
    const spikes = flare
      ? [[3, 11], [4, 7], [7, 5], [10, 4], [13, 5], [16, 7]]
      : [[5, 11], [6, 8], [8, 7], [10, 6], [12, 7], [15, 9]];
    for (const [x, y] of spikes) { S(x + bx, y + by, quill[0]); S(x + 1 + bx, y + 1 + by, quill[1]); }
    S(5 + bx, 14 + by, quill[1]); S(4 + bx, 16 + by, quill[0]);
    if (burst) { S(1, 7, quill[0]); S(2, 3, quill[1]); S(18, 4, quill[0]); S(22, 6, quill[1]); }
  } else {
    R(7 + bx, 11 + by, 10, 9 - by, fur[0]); R(9 + bx, 16, 6, 4, belly);
    R(8 + bx, 8 + by, 8, 6, fur[0]);
    if (d === 'down') { S(9 + bx, 10 + by, eye); S(14 + bx, 10 + by, eye); S(11 + bx, 13 + by, fur[1]); S(12 + bx, 13 + by, fur[1]); }
    else { R(10 + bx, 9 + by, 4, 2, fur[1]); S(9 + bx, 13 + by, quill[1]); S(14 + bx, 13 + by, quill[1]); }
    R(6 + gait.back, 18, 3, 4, fur[1]); R(15 + gait.front, 18, 3, 4, fur[1]);
    S(5 + gait.back, 21, quill[1]); S(18 + gait.front, 21, quill[1]);
    const spikes = flare
      ? [[4, 10], [3, 6], [7, 4], [11, 3], [16, 4], [20, 7], [19, 12]]
      : [[6, 11], [5, 8], [8, 6], [11, 5], [15, 6], [18, 9]];
    for (const [x, y] of spikes) { S(x + bx, y + by, quill[0]); S(x + bx, y + 1 + by, quill[1]); }
    if (burst) { S(1, 5, quill[0]); S(22, 5, quill[0]); S(3, 2, quill[1]); S(20, 2, quill[1]); }
  }
}

function drawPuppet(g, d, p, f, V, animId) {
  const walking = animId === 'walk';
  const gait = walking ? [
    { bob: 0, left: -1, right: 1, arm: 2 },
    { bob: 1, left: 0, right: 1, arm: -1 },
    { bob: 0, left: 1, right: -1, arm: -2 },
    { bob: 1, left: -1, right: 0, arm: 1 },
  ][f] : { bob: animId === 'idle' && f === 1 ? 1 : 0, left: 0, right: 0, arm: animId === 'idle' && f === 1 ? 1 : 0 };
  const strike = animId === 'attack' && (f === 1 || f === 2);
  const slash = strike ? (f === 1 ? -3 : 3) : gait.arm;
  const ox = d === 'right' ? p.lunge : 0;
  const oy = d === 'down' ? p.lunge : d === 'up' ? -p.lunge : 0;
  const S = (x, y, cc) => g.set(x + ox, y + oy, cc);
  const R = (x, y, w, h, cc) => g.rect(x + ox, y + oy, w, h, cc);
  const wood = V.wood, cloth = V.cloth, joint = V.joint, glow = V.glow;
  const bob = gait.bob;

  if (d === 'right') {
    S(10, 1 + bob, glow); S(11, 3 + bob, joint); S(13, 1 + bob, glow); S(14, 4 + bob, joint);
    R(12, 5 + bob, 7, 6, wood[0]); S(17, 7 + bob, glow); R(18, 8 + bob, 2, 2, wood[1]);
    R(8, 10 + bob, 8, 8 - bob, cloth); R(10, 11 + bob, 5, 6 - bob, wood[0]);
    S(10, 13 + bob, joint); S(14, 16, joint);
    R(8 + gait.left, 17, 2, 3, wood[1]); S(8 + gait.left, 20, joint); R(7 + gait.left, 21, 3, 2, wood[0]);
    R(13 + gait.right, 17, 2, 3, wood[1]); S(14 + gait.right, 20, joint); R(14 + gait.right, 21, 3, 2, wood[0]);
    R(6, 11 + bob - slash, 3, 2, wood[0]); S(5, 12 + bob - slash, joint); S(4, 13 + bob - slash, wood[1]);
    if (strike) {
      R(15, 11 + bob + slash, 5, 2, wood[0]); S(20, 12 + bob + slash, joint); S(22, 12 + bob + slash, wood[1]);
      S(21, 10 + bob + slash, wood[1]); S(21, 14 + bob + slash, wood[1]);
    } else {
      R(15, 12 + bob + gait.arm, 4, 2, wood[0]); S(19, 13 + bob + gait.arm, joint); S(20, 14 + bob + gait.arm, wood[1]);
    }
  } else {
    S(9, 1 + bob, glow); S(10, 4 + bob, joint); S(14, 1 + bob, glow); S(14, 4 + bob, joint);
    R(9, 5 + bob, 6, 6, wood[0]); R(10, 6 + bob, 4, 4, wood[1]);
    if (d === 'down') { S(10, 7 + bob, glow); S(13, 7 + bob, glow); S(11, 9 + bob, joint); }
    else { R(10, 6 + bob, 4, 2, cloth); S(9, 9 + bob, joint); S(14, 9 + bob, joint); }
    R(8, 10 + bob, 8, 8 - bob, cloth); R(10, 11 + bob, 4, 6 - bob, wood[0]);
    S(9, 13 + bob, joint); S(14, 15 + bob, joint);
    R(8 + gait.left, 17, 2, 3, wood[1]); S(8 + gait.left, 20, joint); R(7 + gait.left, 21, 3, 2, wood[0]);
    R(14 + gait.right, 17, 2, 3, wood[1]); S(15 + gait.right, 20, joint); R(14 + gait.right, 21, 3, 2, wood[0]);
    if (strike) {
      R(3, 11 + bob - slash, 5, 2, wood[0]); S(2, 12 + bob - slash, joint); S(1, 13 + bob - slash, wood[1]);
      R(16, 11 + bob + slash, 5, 2, wood[0]); S(21, 12 + bob + slash, joint); S(22, 13 + bob + slash, wood[1]);
      S(3, 15 + bob - slash, wood[1]); S(20, 15 + bob + slash, wood[1]);
    } else {
      R(4, 12 + bob + gait.arm, 5, 2, wood[0]); S(3, 13 + bob + gait.arm, joint); S(2, 14 + bob + gait.arm, wood[1]);
      R(15, 12 + bob - gait.arm, 5, 2, wood[0]); S(20, 13 + bob - gait.arm, joint); S(21, 14 + bob - gait.arm, wood[1]);
    }
  }
}

// ============================================================
// TOP-LEVEL RENDER
// ============================================================
function buildHumanoidC(spec) {
  if (spec.kind === 'player') {
    const skin = find(SKINS, spec.skin).c;
    const hair = find(HAIR_COLORS, spec.hairColor).c;
    const outfit = find(OUTFIT_COLORS, spec.outfitColor).c;
    return {
      skin: palettePair(spec.palette?.skin, skin),
      species: spec.species || 'human',
      bodyBuild: spec.bodyBuild || 'classic',
      hair: palettePair(spec.palette?.hair, hair),
      hairStyle: spec.hairStyle,
      expression: spec.expression || 'neutral',
      gear: spec.headgear,
      outfit: spec.outfit,
      outfitTier: spec.outfitTier || 'tier1',
      oc: palettePair(spec.palette?.outfit, outfit),
      weapon: spec.weapon,
      weaponTier: spec.weaponTier || 'tier1',
      shield: spec.shield,
      shieldTier: spec.shieldTier || 'tier1',
      face: 'human',
      detail: spec.faceDetail || 'none',
      sideWeaponOffset: 3,
      weaponFollowRig: true,
      shieldFollowRig: true,
      enhancedHilts: true,
    };
  }
  const fam = find(ENEMIES, spec.family);
  const V = find(fam.variants, spec.variant);
  if (spec.family === 'goblin') {
    return {
      skin: V.skin, hair: null, hairStyle: 'bald',
      gear: V.gear || 'none',
      outfit: V.outfit, oc: find(OUTFIT_COLORS, V.oc).c,
      weapon: V.weapon, shield: 'none',
      face: 'goblin', small: V.small,
    };
  }
  if (spec.family === 'zombie') {
    return {
      skin: V.skin, hair: HAIR_COLORS[0].c, hairStyle: 'short',
      gear: V.gear || 'none',
      outfit: V.outfit, oc: find(OUTFIT_COLORS, V.oc).c,
      weapon: V.weapon || 'none', shield: 'none',
      face: 'zombie',
    };
  }
  if (spec.family === 'imp') {
    return {
      skin: V.skin, hair: null, hairStyle: 'bald',
      gear: V.gear || 'none',
      outfit: V.outfit, oc: find(OUTFIT_COLORS, V.oc).c,
      weapon: V.weapon, shield: 'none',
      face: 'imp', small: V.small,
    };
  }
  const HUM_FACE = { elf: 'elf', dwarf: 'human', bandit: 'human', cultist: 'human', orc: 'orc', ogre: 'orc', troll: 'orc', kobold: 'snout', gnoll: 'snout', ratfolk: 'snout', lizardfolk: 'snout', minotaur: 'snout', demon: 'imp', cyclops: 'cyclops', harpy: 'human' };
  if (HUM_FACE[spec.family]) {
    return {
      skin: V.skin,
      hair: find(HAIR_COLORS, V.hair || 'black').c,
      hairStyle: V.hs || 'short',
      beard: V.beard ? find(HAIR_COLORS, V.beard).c : null,
      gear: V.gear || 'none',
      outfit: V.outfit, oc: find(OUTFIT_COLORS, V.oc).c,
      weapon: V.weapon || 'none', shield: V.shield || 'none',
      face: HUM_FACE[spec.family],
      horns: spec.family === 'kobold' ? 'nub' : (spec.family === 'minotaur' ? 'bull' : null),
      tail: spec.family === 'ratfolk' ? 'rat' : (spec.family === 'lizardfolk' ? 'lizard' : null),
      wings: V.wing || null,
      small: !!V.small, eye: V.eye || null,
    };
  }
  // skeleton
  return {
    skin: BONE, hair: null, hairStyle: 'bald',
    gear: V.gear || 'none',
    outfit: V.outfit, oc: find(OUTFIT_COLORS, V.oc).c,
    weapon: V.weapon, shield: V.shield || 'none',
    face: 'skull', bone: true, eye: V.eye || null,
  };
}

function shadowFor(spec, animId, f) {
  if (spec.kind === 'enemy') {
    if (spec.family === 'bat' || spec.family === 'ghost' || spec.family === 'elemental' || spec.family === 'eyemonster' || spec.family === 'wasp' || spec.family === 'jellyfish' || spec.family === 'anglerfish' || spec.family === 'moth') return { x: 9, w: 6, a: 0.10 };
    if (spec.family === 'snake' || spec.family === 'worm' || spec.family === 'scorpion' || spec.family === 'crab' || spec.family === 'beetle' || spec.family === 'mimic' || spec.family === 'frog' || spec.family === 'turtle' || spec.family === 'centipede' || spec.family === 'carniplant' || spec.family === 'octopus' || spec.family === 'mole' || spec.family === 'snail') return { x: 7, w: 10, a: 0.15 };
    if (spec.family === 'golem' || spec.family === 'treant') return { x: 6, w: 12, a: 0.15 };
    if (spec.family === 'spider') return { x: 7, w: 10, a: 0.15 };
    if (spec.family === 'wolf' || spec.family === 'boar' || spec.family === 'bear' || spec.family === 'bigcat' || spec.family === 'drake' || spec.family === 'crocodile' || spec.family === 'griffin' || spec.family === 'porcupine') return { x: 6, w: 12, a: 0.15 };
    if (spec.family === 'slime' && animId === 'walk' && (f === 1 || f === 2)) return { x: 10, w: 4, a: 0.12 };
    if (spec.family === 'slime') return { x: 8, w: 8, a: 0.15 };
  }
  return { x: 8, w: 8, a: 0.15 };
}

export function drawSprite(ctx, spec, dir, animId, frameIdx, opts = {}) {
  const anim = find(ANIMS, animId);
  const f = ((frameIdx % anim.frames) + anim.frames) % anim.frames;
  const p = makePose(anim.id, f);
  const flip = dir === 'left';
  const d = flip ? 'right' : dir;
  const renderLayer = typeof opts.layer === 'string' ? opts.layer : 'complete';

  if (opts.clear !== false) ctx.clearRect(0, 0, SIZE, SIZE);

  if (spec.kind !== 'effect' && opts.shadow !== false && (renderLayer === 'complete' || renderLayer === 'body')) {
    const sh = shadowFor(spec, anim.id, f);
    ctx.fillStyle = `rgba(26,28,44,${sh.a})`;
    ctx.fillRect(sh.x, 22, sh.w, 1);
    ctx.fillRect(sh.x + 1, 23, sh.w - 2, 1);
  }

  const g = makeG();
  const HUMANOID_FAMS = ['goblin', 'skeleton', 'zombie', 'imp', 'elf', 'dwarf', 'bandit', 'cultist', 'orc', 'ogre', 'troll', 'kobold', 'gnoll', 'ratfolk', 'lizardfolk', 'minotaur', 'demon', 'cyclops', 'harpy'];
  if (spec.kind === 'effect' && (renderLayer === 'complete' || renderLayer === 'body')) {
    const category = find(COMBAT_EFFECTS, spec.category);
    const effect = find(category.effects, spec.effect);
    drawCombatEffect(g, d, f, effect, anim.id);
  } else if (spec.kind === 'player' || HUMANOID_FAMS.indexOf(spec.family) >= 0) {
    drawHumanoid(g, d, p, buildHumanoidC(spec), renderLayer);
  } else if (renderLayer === 'complete' || renderLayer === 'body') {
    const fam = find(ENEMIES, spec.family);
    const V = find(fam.variants, spec.variant);
    if (spec.family === 'slime') drawSlime(g, d, p, f, V, anim.id);
    if (spec.family === 'bat') drawBat(g, d, p, f, V, anim.id);
    if (spec.family === 'ghost') drawGhost(g, d, p, f, V, anim.id);
    if (spec.family === 'spider') drawSpider(g, d, p, f, V, anim.id);
    if (spec.family === 'shroom') drawShroom(g, d, p, f, V, anim.id);
    if (spec.family === 'wolf' || spec.family === 'boar' || spec.family === 'bear' || spec.family === 'bigcat') drawQuad(g, d, p, f, V, anim.id);
    if (spec.family === 'golem') drawGolem(g, d, p, f, V, anim.id);
    if (spec.family === 'elemental') drawElemental(g, d, p, f, V, anim.id);
    if (spec.family === 'treant') drawTreant(g, d, p, f, V, anim.id);
    if (spec.family === 'gargoyle') drawGargoyle(g, d, p, f, V, anim.id);
    if (spec.family === 'snake') drawSnake(g, d, p, f, V, anim.id);
    if (spec.family === 'worm') drawWorm(g, d, p, f, V, anim.id);
    if (spec.family === 'eyemonster') drawEyeball(g, d, p, f, V, anim.id);
    if (spec.family === 'scorpion') drawScorp(g, d, p, f, V, anim.id);
    if (spec.family === 'crab') drawCrab(g, d, p, f, V, anim.id);
    if (spec.family === 'beetle') drawBeetle(g, d, p, f, V, anim.id);
    if (spec.family === 'wasp') drawWasp(g, d, p, f, V, anim.id);
    if (spec.family === 'mimic') drawMimic(g, d, p, f, V, anim.id);
    if (spec.family === 'drake') drawDrake(g, d, p, f, V, anim.id);
    if (spec.family === 'frog') drawFrog(g, d, p, f, V, anim.id);
    if (spec.family === 'crocodile') drawCrocodile(g, d, p, f, V, anim.id);
    if (spec.family === 'turtle') drawTurtle(g, d, p, f, V, anim.id);
    if (spec.family === 'jellyfish') drawJellyfish(g, d, p, f, V, anim.id);
    if (spec.family === 'centipede') drawCentipede(g, d, p, f, V, anim.id);
    if (spec.family === 'carniplant') drawCarnivorousPlant(g, d, p, f, V, anim.id);
    if (spec.family === 'anglerfish') drawAnglerfish(g, d, p, f, V, anim.id);
    if (spec.family === 'griffin') drawGriffin(g, d, p, f, V, anim.id);
    if (spec.family === 'mantis') drawMantis(g, d, p, f, V, anim.id);
    if (spec.family === 'moth') drawMoth(g, d, p, f, V, anim.id);
    if (spec.family === 'octopus') drawOctopus(g, d, p, f, V, anim.id);
    if (spec.family === 'mole') drawMole(g, d, p, f, V, anim.id);
    if (spec.family === 'scarecrow') drawScarecrow(g, d, p, f, V, anim.id);
    if (spec.family === 'snail') drawSnail(g, d, p, f, V, anim.id);
    if (spec.family === 'porcupine') drawPorcupine(g, d, p, f, V, anim.id);
    if (spec.family === 'puppet') drawPuppet(g, d, p, f, V, anim.id);
  }

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const c = g.px[y * SIZE + x];
      if (!c) continue;
      ctx.fillStyle = p.flash && spec.kind !== 'effect' ? '#ffffff' : c;
      ctx.fillRect(flip ? SIZE - 1 - x : x, y, 1, 1);
    }
  }
}
