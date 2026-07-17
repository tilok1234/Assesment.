import { BONE, GOLD, INK, METAL, WOOD } from './catalogs.js';

const ARCANE = ['#30245c', '#7658d6', '#62d9ff', '#f0ffff'];
const LEGEND = ['#52308b', '#9b72e8', '#f2b84b', '#fff1a8'];

const SHIELD_TOP = {
  round: 12,
  kite: 11,
  buckler: 13,
  heater: 11,
  tower: 10,
  oval: 11,
  bone: 11,
  arcane: 11,
};

const PROFILE_HEIGHTS = {
  round: 5,
  kite: 7,
  buckler: 4,
  heater: 6,
  tower: 9,
  oval: 7,
  bone: 7,
  arcane: 7,
};

function drawLegacyFront(S, R, sx, u, shield, oc) {
  if (shield === 'round') {
    R(sx, 12 + u, 4, 5, WOOD[0]);
    R(sx, 12 + u, 1, 5, WOOD[1]);
    R(sx, 12 + u, 4, 1, WOOD[1]);
    S(sx + 1, 14 + u, METAL[0]); S(sx + 2, 14 + u, METAL[0]);
  }
  if (shield === 'kite') {
    R(sx, 11 + u, 4, 5, METAL[0]);
    R(sx, 11 + u, 4, 1, METAL[2]);
    S(sx + 1, 16 + u, METAL[1]); S(sx + 2, 16 + u, METAL[1]);
    S(sx + 1, 13 + u, oc[0]); S(sx + 2, 13 + u, oc[0]);
  }
  if (shield === 'buckler') {
    R(sx + 1, 13 + u, 3, 3, METAL[0]);
    S(sx + 2, 14 + u, METAL[2]);
    R(sx + 1, 15 + u, 3, 1, METAL[1]);
  }
}

function drawLegacyShield(S, R, d, C, u, layer) {
  if (layer === 'behind' && d === 'right') {
    R(7, 12 + u, 2, 5, C.shield === 'round' ? WOOD[0] : METAL[1]);
    R(7, 12 + u, 1, 5, C.shield === 'round' ? WOOD[1] : METAL[1]);
  }
  if (layer === 'front' && d !== 'right') {
    drawLegacyFront(S, R, d === 'down' ? 4 : 16, u, C.shield, C.oc);
  }
}

function drawRound(S, R, x, y) {
  R(x + 1, y, 3, 1, WOOD[1]);
  R(x, y + 1, 5, 3, WOOD[0]);
  R(x + 1, y + 4, 3, 1, WOOD[0]);
  S(x, y + 1, WOOD[1]); S(x, y + 3, WOOD[1]);
  S(x + 4, y + 1, METAL[1]); S(x + 4, y + 3, METAL[1]);
  S(x + 1, y + 4, WOOD[1]); S(x + 3, y + 4, METAL[1]);
  R(x + 1, y + 2, 3, 1, WOOD[2]);
  S(x + 2, y + 1, METAL[0]);
  S(x + 2, y + 2, METAL[2]);
  S(x + 2, y + 3, METAL[1]);
}

function drawKite(S, R, x, y, oc) {
  R(x, y, 5, 4, METAL[0]);
  R(x + 1, y + 4, 3, 2, METAL[0]);
  S(x + 2, y + 6, METAL[1]);
  R(x, y, 5, 1, METAL[2]);
  R(x, y + 1, 1, 3, METAL[1]);
  R(x + 4, y + 1, 1, 3, METAL[1]);
  S(x + 1, y + 4, METAL[1]); S(x + 3, y + 4, METAL[1]);
  S(x + 1, y + 5, METAL[1]); S(x + 3, y + 5, METAL[1]);
  R(x + 2, y + 1, 1, 4, oc[0]);
  R(x + 1, y + 2, 3, 1, oc[1]);
  S(x + 2, y + 2, GOLD[1]);
}

function drawBuckler(S, R, x, y) {
  R(x + 1, y, 2, 1, METAL[1]);
  R(x, y + 1, 4, 2, METAL[0]);
  R(x + 1, y + 3, 2, 1, METAL[1]);
  S(x, y + 1, METAL[2]); S(x + 3, y + 1, METAL[2]);
  S(x + 1, y + 1, METAL[2]); S(x + 2, y + 2, METAL[1]);
  S(x + 2, y + 1, GOLD[0]);
}

function drawHeater(S, R, x, y, oc) {
  R(x + 1, y, 3, 1, METAL[2]);
  R(x, y + 1, 5, 3, METAL[0]);
  R(x + 1, y + 4, 3, 1, METAL[0]);
  S(x + 2, y + 5, METAL[1]);
  S(x, y + 1, METAL[1]); S(x + 4, y + 1, METAL[1]);
  S(x, y + 3, METAL[1]); S(x + 4, y + 3, METAL[1]);
  S(x + 1, y + 4, METAL[1]); S(x + 3, y + 4, METAL[1]);
  R(x + 2, y + 1, 1, 4, oc[0]);
  R(x + 1, y + 2, 3, 1, oc[1]);
  S(x + 2, y + 2, GOLD[1]);
}

function drawTower(S, R, x, y, oc) {
  R(x + 1, y, 3, 1, METAL[2]);
  R(x, y + 1, 5, 7, METAL[0]);
  R(x + 1, y + 8, 3, 1, METAL[1]);
  R(x, y + 1, 1, 7, METAL[1]);
  R(x + 4, y + 1, 1, 7, METAL[1]);
  R(x + 1, y + 2, 3, 1, oc[0]);
  R(x + 1, y + 6, 3, 1, oc[0]);
  R(x + 2, y + 3, 1, 3, oc[1]);
  S(x + 2, y + 4, GOLD[1]);
  S(x, y + 1, METAL[2]); S(x + 4, y + 1, METAL[2]);
}

function drawOval(S, R, x, y) {
  R(x + 1, y, 2, 1, WOOD[1]);
  R(x, y + 1, 4, 5, WOOD[0]);
  R(x + 1, y + 6, 2, 1, WOOD[1]);
  R(x, y + 1, 1, 5, WOOD[1]);
  R(x + 3, y + 1, 1, 5, METAL[1]);
  R(x + 1, y + 3, 2, 1, WOOD[2]);
  S(x + 1, y + 2, METAL[0]); S(x + 2, y + 2, METAL[2]);
  S(x + 1, y + 4, METAL[1]); S(x + 2, y + 4, METAL[0]);
}

function drawBone(S, R, x, y) {
  R(x + 2, y, 1, 7, BONE[1]);
  S(x + 1, y, BONE[0]); S(x + 3, y, BONE[0]);
  S(x, y + 1, BONE[1]); S(x + 4, y + 1, BONE[1]);
  S(x + 1, y + 2, BONE[0]); S(x + 3, y + 2, BONE[0]);
  S(x, y + 3, BONE[1]); S(x + 4, y + 3, BONE[1]);
  S(x + 1, y + 4, BONE[0]); S(x + 3, y + 4, BONE[0]);
  S(x, y + 5, BONE[1]); S(x + 4, y + 5, BONE[1]);
  S(x + 1, y + 6, BONE[0]); S(x + 3, y + 6, BONE[0]);
  S(x + 2, y + 1, INK); S(x + 2, y + 3, METAL[1]); S(x + 2, y + 5, INK);
}

function drawArcane(S, R, x, y) {
  S(x + 2, y, ARCANE[2]);
  R(x + 1, y + 1, 3, 1, ARCANE[1]);
  R(x, y + 2, 5, 3, ARCANE[0]);
  R(x + 1, y + 5, 3, 1, ARCANE[1]);
  S(x + 2, y + 6, ARCANE[2]);
  S(x, y + 2, ARCANE[2]); S(x + 4, y + 2, ARCANE[2]);
  S(x, y + 4, ARCANE[1]); S(x + 4, y + 4, ARCANE[1]);
  S(x + 2, y + 1, ARCANE[3]);
  R(x + 2, y + 2, 1, 3, ARCANE[2]);
  R(x + 1, y + 3, 3, 1, ARCANE[2]);
  S(x + 2, y + 3, ARCANE[3]);
}

function drawTier2Full(S, R, x, y, shield) {
  if (shield === 'round') {
    S(x + 2, y - 1, METAL[2]); S(x - 1, y + 2, METAL[1]);
    S(x + 5, y + 2, METAL[1]); S(x + 2, y + 5, METAL[1]);
    S(x + 1, y + 1, GOLD[0]); S(x + 3, y + 3, GOLD[1]);
  }
  if (shield === 'kite') {
    S(x - 1, y + 1, METAL[2]); S(x + 5, y + 1, METAL[2]);
    S(x + 2, y + 7, METAL[1]);
    R(x + 1, y + 1, 3, 1, GOLD[0]); S(x + 2, y + 5, GOLD[1]);
  }
  if (shield === 'buckler') {
    R(x + 1, y - 1, 2, 1, METAL[2]);
    S(x - 1, y + 1, METAL[1]); S(x + 4, y + 1, METAL[1]);
    R(x + 1, y + 4, 2, 1, METAL[1]);
    S(x + 1, y + 2, GOLD[0]); S(x + 2, y + 1, GOLD[1]);
  }
  if (shield === 'heater') {
    S(x - 1, y + 1, METAL[2]); S(x + 5, y + 1, METAL[2]);
    S(x + 2, y + 6, METAL[1]);
    S(x + 1, y + 1, GOLD[0]); S(x + 3, y + 1, GOLD[0]);
    S(x + 2, y + 4, GOLD[1]);
  }
  if (shield === 'tower') {
    S(x, y - 1, METAL[2]); S(x + 2, y - 1, GOLD[0]); S(x + 4, y - 1, METAL[2]);
    R(x - 1, y + 2, 1, 5, METAL[1]); R(x + 5, y + 2, 1, 5, METAL[1]);
    R(x + 1, y + 9, 3, 1, METAL[1]);
    S(x, y + 4, GOLD[0]); S(x + 4, y + 4, GOLD[0]);
  }
  if (shield === 'oval') {
    R(x + 1, y - 1, 2, 1, METAL[2]);
    S(x - 1, y + 3, METAL[1]); S(x + 4, y + 3, METAL[1]);
    R(x + 1, y + 7, 2, 1, METAL[1]);
    S(x + 1, y + 1, GOLD[0]); S(x + 2, y + 5, GOLD[1]);
  }
  if (shield === 'bone') {
    S(x + 2, y - 1, BONE[0]);
    S(x - 1, y + 1, BONE[1]); S(x + 5, y + 1, BONE[1]);
    S(x - 1, y + 5, BONE[1]); S(x + 5, y + 5, BONE[1]);
    S(x + 2, y + 7, BONE[0]);
    S(x + 1, y + 3, INK); S(x + 3, y + 3, INK); S(x + 2, y + 4, GOLD[0]);
  }
  if (shield === 'arcane') {
    S(x + 2, y - 1, ARCANE[3]);
    S(x - 1, y + 2, ARCANE[2]); S(x + 5, y + 2, ARCANE[2]);
    S(x - 1, y + 4, ARCANE[1]); S(x + 5, y + 4, ARCANE[1]);
    S(x + 2, y + 7, ARCANE[3]);
    S(x + 1, y + 2, ARCANE[3]); S(x + 3, y + 4, ARCANE[2]);
  }
}

function drawTier3Full(S, R, x, y, shield) {
  if (shield === 'round') {
    S(x + 1, y - 2, GOLD[2]); S(x + 3, y - 2, GOLD[2]);
    S(x + 2, y - 1, GOLD[0]);
    S(x - 1, y + 1, GOLD[1]); S(x + 5, y + 3, GOLD[1]);
    S(x + 1, y + 6, GOLD[1]); S(x + 3, y + 6, GOLD[1]);
    S(x + 1, y + 2, GOLD[0]); S(x + 3, y + 2, GOLD[0]);
  }
  if (shield === 'kite') {
    S(x, y - 2, LEGEND[1]); S(x + 4, y - 2, LEGEND[1]);
    S(x + 1, y - 1, GOLD[2]); S(x + 3, y - 1, GOLD[2]);
    S(x - 1, y + 3, LEGEND[0]); S(x + 5, y + 3, LEGEND[0]);
    S(x + 2, y + 8, GOLD[1]);
    S(x + 1, y + 3, LEGEND[1]); S(x + 3, y + 3, LEGEND[1]);
  }
  if (shield === 'buckler') {
    S(x, y - 2, METAL[2]); S(x + 3, y - 2, METAL[2]);
    S(x - 1, y, GOLD[0]); S(x + 4, y + 3, GOLD[0]);
    S(x, y + 5, METAL[1]); S(x + 3, y + 5, METAL[1]);
    S(x + 1, y + 1, LEGEND[1]); S(x + 2, y + 2, GOLD[2]);
  }
  if (shield === 'heater') {
    S(x, y - 2, GOLD[2]); S(x + 2, y - 2, GOLD[2]); S(x + 4, y - 2, GOLD[2]);
    S(x + 1, y - 1, GOLD[0]); S(x + 3, y - 1, GOLD[0]);
    S(x - 1, y + 3, LEGEND[0]); S(x + 5, y + 3, LEGEND[0]);
    S(x + 1, y + 7, GOLD[1]); S(x + 3, y + 7, GOLD[1]);
    S(x + 2, y + 2, LEGEND[1]); S(x + 2, y + 3, GOLD[2]);
  }
  if (shield === 'tower') {
    S(x, y - 2, GOLD[2]); S(x + 2, y - 2, GOLD[2]); S(x + 4, y - 2, GOLD[2]);
    S(x - 1, y + 1, METAL[2]); S(x + 5, y + 1, METAL[2]);
    S(x - 1, y + 7, METAL[1]); S(x + 5, y + 7, METAL[1]);
    S(x, y + 10, METAL[1]); S(x + 2, y + 10, GOLD[1]); S(x + 4, y + 10, METAL[1]);
    R(x + 1, y + 3, 3, 1, LEGEND[0]); R(x + 1, y + 5, 3, 1, GOLD[0]);
  }
  if (shield === 'oval') {
    S(x, y - 2, GOLD[2]); S(x + 3, y - 2, GOLD[2]);
    S(x + 1, y - 1, GOLD[0]); S(x + 2, y - 1, GOLD[0]);
    S(x - 1, y + 1, LEGEND[0]); S(x + 4, y + 5, LEGEND[0]);
    S(x, y + 8, GOLD[1]); S(x + 3, y + 8, GOLD[1]);
    R(x + 1, y + 2, 2, 1, GOLD[2]); R(x + 1, y + 4, 2, 1, LEGEND[1]);
  }
  if (shield === 'bone') {
    S(x, y - 2, BONE[0]); S(x + 2, y - 2, LEGEND[1]); S(x + 4, y - 2, BONE[0]);
    S(x + 1, y - 1, BONE[1]); S(x + 3, y - 1, BONE[1]);
    S(x - 1, y + 3, BONE[0]); S(x + 5, y + 3, BONE[0]);
    S(x, y + 8, BONE[1]); S(x + 2, y + 8, GOLD[1]); S(x + 4, y + 8, BONE[1]);
    S(x + 1, y + 3, LEGEND[1]); S(x + 3, y + 3, LEGEND[1]);
  }
  if (shield === 'arcane') {
    S(x + 1, y - 2, LEGEND[3]); S(x + 3, y - 2, LEGEND[3]);
    S(x - 1, y, LEGEND[1]); S(x + 5, y + 6, LEGEND[1]);
    S(x + 1, y + 8, LEGEND[2]); S(x + 3, y + 8, LEGEND[2]);
    S(x + 1, y + 2, LEGEND[1]); S(x + 3, y + 2, LEGEND[1]);
    S(x + 1, y + 4, LEGEND[2]); S(x + 3, y + 4, LEGEND[2]);
    S(x + 2, y + 3, LEGEND[3]);
  }
}

function drawFullShield(S, R, x, y, shield, oc, tier) {
  if (shield === 'round') drawRound(S, R, x, y);
  if (shield === 'kite') drawKite(S, R, x, y, oc);
  if (shield === 'buckler') drawBuckler(S, R, x, y);
  if (shield === 'heater') drawHeater(S, R, x, y, oc);
  if (shield === 'tower') drawTower(S, R, x, y, oc);
  if (shield === 'oval') drawOval(S, R, x, y);
  if (shield === 'bone') drawBone(S, R, x, y);
  if (shield === 'arcane') drawArcane(S, R, x, y);
  if (tier === 'tier2' || tier === 'tier3') drawTier2Full(S, R, x, y, shield);
  if (tier === 'tier3') drawTier3Full(S, R, x, y, shield);
}

function drawTier2Profile(S, R, x, y, shield) {
  const height = PROFILE_HEIGHTS[shield];
  const middle = y + Math.floor(height / 2);
  const rim = shield === 'bone' ? BONE[0] : shield === 'arcane' ? ARCANE[3] : METAL[2];
  const accent = shield === 'arcane' ? ARCANE[2] : shield === 'bone' ? INK : GOLD[0];
  S(x + 1, y - 1, rim);
  S(x - 1, middle, rim);
  S(x + 1, y + height, rim);
  S(x, middle, accent);
  if (shield === 'tower') R(x - 1, y + 1, 1, height - 2, METAL[1]);
  if (shield === 'kite' || shield === 'heater') S(x + 1, y + height + 1, METAL[1]);
  if (shield === 'round' || shield === 'oval') S(x - 1, middle - 1, METAL[1]);
  if (shield === 'bone') S(x - 1, middle + 1, BONE[1]);
  if (shield === 'arcane') S(x - 1, middle + 1, ARCANE[1]);
}

function drawTier3Profile(S, R, x, y, shield) {
  const height = PROFILE_HEIGHTS[shield];
  const middle = y + Math.floor(height / 2);
  const crown = shield === 'bone' ? BONE[0] : shield === 'arcane' ? LEGEND[3] : GOLD[2];
  const tail = shield === 'arcane' ? LEGEND[2] : shield === 'bone' ? BONE[1] : GOLD[1];
  S(x - 1, y - 2, crown); S(x, y - 2, crown);
  S(x - 1, middle - 1, shield === 'arcane' ? LEGEND[1] : crown);
  S(x - 1, middle + 1, shield === 'bone' ? BONE[0] : tail);
  S(x, y + height + 2, tail); S(x + 2, y + height + 2, tail);
  S(x, middle, shield === 'bone' ? LEGEND[1] : LEGEND[0]);
  if (shield === 'tower') {
    S(x - 1, y, METAL[2]); S(x - 1, y + height, METAL[1]);
  }
  if (shield === 'buckler') S(x + 2, middle - 1, LEGEND[1]);
}

function drawProfile(S, R, x, y, shield, oc, tier) {
  const profiles = {
    round: [5, WOOD[0], WOOD[1]],
    kite: [7, METAL[0], METAL[1]],
    buckler: [4, METAL[0], METAL[1]],
    heater: [6, METAL[0], METAL[1]],
    tower: [9, METAL[0], METAL[1]],
    oval: [7, WOOD[0], WOOD[1]],
    bone: [7, BONE[0], BONE[1]],
    arcane: [7, ARCANE[1], ARCANE[2]],
  };
  const [height, face, rim] = profiles[shield];
  R(x + 1, y, 1, height, rim);
  R(x, y + 1, 2, height - 2, face);
  S(x, y + 1, rim); S(x, y + height - 2, rim);
  S(x + 2, y + Math.floor(height / 2), shield === 'arcane' ? ARCANE[3] : shield === 'bone' ? INK : oc[0]);
  if (shield === 'kite' || shield === 'heater') S(x + 1, y + height - 1, rim);
  if (shield === 'tower') {
    S(x, y, METAL[2]); S(x, y + height - 1, METAL[1]);
  }
  if (shield === 'buckler') S(x + 2, y + 1, METAL[2]);
  if (tier === 'tier2' || tier === 'tier3') drawTier2Profile(S, R, x, y, shield);
  if (tier === 'tier3') drawTier3Profile(S, R, x, y, shield);
}

function shieldRig(p, d) {
  const walkingArm = p.wep === 'hold' ? -p.arm : 0;
  const attackLift = p.wep === 'wind' ? -1 : 0;
  const direction = d === 'down' ? 1 : -1;
  const brace = p.wep === 'wind' ? -direction : p.wep === 'strike' ? direction : 0;
  return { x: brace, y: p.bob + walkingArm + attackLift };
}

export function drawShield(S, R, d, p, C, u, layer = 'front') {
  if (!C.shield || C.shield === 'none') return;

  if (!C.shieldFollowRig) {
    drawLegacyShield(S, R, d, C, u, layer);
    return;
  }

  const rig = shieldRig(p, d);
  const top = SHIELD_TOP[C.shield];
  if (top === undefined) return;

  if (d === 'right') {
    if (layer !== 'behind') return;
    drawProfile(S, R, 6 + rig.x, top + rig.y, C.shield, C.oc, C.shieldTier);
    return;
  }

  const expectedLayer = d === 'up' ? 'behind' : 'front';
  if (layer !== expectedLayer) return;
  const baseX = d === 'down' ? (C.shield === 'buckler' ? 4 : 3) : 17;
  drawFullShield(S, R, baseX + rig.x, top + rig.y, C.shield, C.oc, C.shieldTier);
}
