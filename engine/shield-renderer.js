import { BONE, GOLD, INK, METAL, WOOD } from './catalogs.js';

const ARCANE = ['#30245c', '#7658d6', '#62d9ff', '#f0ffff'];
const LEGEND = ['#52308b', '#9b72e8', '#f2b84b', '#fff1a8'];
const MYTHIC = { core: '#ffffff', gold: '#ffd45c', void: '#6338c7', plasma: '#ff55d7', frost: '#67f2ff' };
const ARTIFACT = {
  core: '#ffffff', sun: '#fff29a', gold: '#ffbd3f', ember: '#ff574f',
  blood: '#b8294f', void: '#241248', astral: '#8b4dff', soul: '#61ffc7',
  frost: '#55eaff', steel: '#526b91', darkSteel: '#1f2c49',
};

// Each full-face shield contains a solid grip pixel at x + 2 and at the
// family-specific y offset below. That grip is placed directly on the body's
// animated shield-hand socket. The body renderer suppresses its ordinary hand
// pixels in views where that hand is visible, so the equipped shield owns the
// socket instead of floating beyond a separately rendered hand.
const SHIELD_GRIP_OFFSET_Y = {
  round: 1,
  kite: 3,
  buckler: 1,
  heater: 2,
  tower: 5,
  oval: 3,
  bone: 3,
  arcane: 3,
};

const SHIELD_HAND_X = {
  down: 7,
  up: 17,
  side: 13,
};
const SHIELD_HAND_Y = 15;

function shieldGripColor(shield) {
  if (shield === 'arcane') return ARCANE[3];
  if (shield === 'bone') return INK;
  if (shield === 'round' || shield === 'oval') return WOOD[1];
  return METAL[1];
}

function shieldFaceOriginX(d, shield) {
  if (d === 'right') return SHIELD_HAND_X.side;
  if (d === 'down') return shield === 'buckler' ? 4 : 3;
  return 16;
}

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
  S(x + 1, y + 4, METAL[1]); S(x + 2, y + 4, METAL[1]);
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

function drawBoneTier3Foundation(S, R, x, y) {
  // Give the open rib cage one readable shield mass without losing its gaps.
  R(x + 1, y + 1, 3, 5, LEGEND[0]);
}

function drawBoneTier3Frame(S, R, x, y) {
  // Join the ribs, crown, and lower teeth into one continuous bone frame.
  R(x, y + 1, 1, 5, BONE[1]);
  R(x + 4, y + 1, 1, 5, BONE[1]);
  R(x + 1, y, 3, 1, BONE[0]);
  R(x + 1, y + 6, 3, 1, BONE[0]);
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
    S(x, y - 1, GOLD[2]); S(x + 2, y - 1, GOLD[2]); S(x + 4, y - 1, GOLD[2]);
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

function drawBoneTier3Details(S, R, x, y) {
  S(x, y - 2, BONE[0]); S(x + 2, y - 2, LEGEND[1]); S(x + 4, y - 2, BONE[0]);
  S(x + 1, y - 1, BONE[1]); S(x + 3, y - 1, BONE[1]);
  S(x - 1, y + 3, BONE[0]); S(x + 5, y + 3, BONE[0]);
  S(x + 1, y + 8, BONE[1]); S(x + 2, y + 8, GOLD[1]); S(x + 3, y + 8, BONE[1]);
  S(x + 1, y + 3, LEGEND[1]); S(x + 3, y + 3, LEGEND[1]);
}

function drawTier4Full(S, R, x, y, shield) {
  if (shield === 'round') {
    S(x + 2, y - 3, MYTHIC.core);
    S(x - 1, y - 1, MYTHIC.gold); S(x + 5, y - 1, MYTHIC.gold);
    S(x - 2, y + 2, MYTHIC.frost); S(x + 6, y + 2, MYTHIC.frost);
    S(x - 1, y + 5, MYTHIC.plasma); S(x + 5, y + 5, MYTHIC.plasma);
    S(x + 2, y + 7, MYTHIC.core);
    R(x + 1, y + 1, 3, 1, MYTHIC.gold); S(x + 2, y + 3, MYTHIC.core);
  }
  if (shield === 'kite') {
    S(x + 2, y - 3, MYTHIC.core);
    S(x, y - 3, MYTHIC.plasma); S(x + 4, y - 3, MYTHIC.plasma);
    S(x - 2, y + 1, MYTHIC.frost); S(x + 6, y + 1, MYTHIC.frost);
    S(x - 2, y + 4, MYTHIC.void); S(x + 6, y + 4, MYTHIC.void);
    S(x + 1, y + 9, MYTHIC.gold); S(x + 3, y + 9, MYTHIC.gold);
    S(x + 2, y + 2, MYTHIC.core); S(x + 2, y + 6, MYTHIC.plasma);
  }
  if (shield === 'buckler') {
    S(x + 1, y - 3, MYTHIC.core); S(x + 2, y - 3, MYTHIC.core);
    S(x - 2, y, MYTHIC.frost); S(x + 5, y, MYTHIC.frost);
    S(x - 2, y + 3, MYTHIC.plasma); S(x + 5, y + 3, MYTHIC.plasma);
    S(x + 1, y + 6, MYTHIC.gold); S(x + 2, y + 6, MYTHIC.gold);
    S(x - 1, y - 1, MYTHIC.gold); S(x + 4, y + 4, MYTHIC.void);
    S(x + 1, y + 2, MYTHIC.void); S(x + 2, y + 1, MYTHIC.core);
  }
  if (shield === 'heater') {
    S(x + 2, y - 3, MYTHIC.core);
    S(x, y - 3, MYTHIC.gold); S(x + 4, y - 3, MYTHIC.gold);
    S(x - 2, y + 1, MYTHIC.frost); S(x + 6, y + 1, MYTHIC.frost);
    S(x - 2, y + 4, MYTHIC.void); S(x + 6, y + 4, MYTHIC.void);
    S(x + 2, y + 8, MYTHIC.core);
    S(x + 1, y + 2, MYTHIC.plasma); S(x + 3, y + 2, MYTHIC.plasma);
    S(x + 2, y + 4, MYTHIC.gold);
  }
  if (shield === 'tower') {
    S(x, y, MYTHIC.gold); S(x + 1, y, MYTHIC.core);
    S(x + 3, y, MYTHIC.core); S(x + 4, y, MYTHIC.gold);
    R(x - 2, y + 4, 1, 5, MYTHIC.void); R(x + 6, y + 4, 1, 5, MYTHIC.void);
    S(x - 1, y + 11, MYTHIC.frost); S(x + 2, y + 11, MYTHIC.core); S(x + 5, y + 11, MYTHIC.frost);
    R(x + 1, y + 2, 3, 1, MYTHIC.gold); R(x + 1, y + 7, 3, 1, MYTHIC.plasma);
    S(x, y + 4, MYTHIC.core); S(x + 4, y + 4, MYTHIC.core);
  }
  if (shield === 'oval') {
    S(x + 1, y - 2, MYTHIC.core); S(x + 2, y - 2, MYTHIC.core);
    S(x - 2, y + 2, MYTHIC.gold); S(x + 5, y + 2, MYTHIC.gold);
    S(x - 2, y + 5, MYTHIC.frost); S(x + 5, y + 5, MYTHIC.frost);
    S(x + 1, y + 10, MYTHIC.core); S(x + 2, y + 10, MYTHIC.core);
    R(x, y + 3, 4, 1, MYTHIC.void); R(x, y + 5, 4, 1, MYTHIC.gold);
  }
  if (shield === 'bone') {
    S(x, y - 2, BONE[0]); S(x + 1, y - 2, MYTHIC.core);
    S(x + 3, y - 2, MYTHIC.core); S(x + 4, y - 2, BONE[0]);
    S(x - 2, y + 3, BONE[1]); S(x + 6, y + 3, BONE[1]);
    S(x - 2, y + 5, MYTHIC.void); S(x + 6, y + 5, MYTHIC.void);
    S(x + 1, y + 10, BONE[0]); S(x + 3, y + 10, BONE[0]);
    S(x + 2, y + 2, MYTHIC.plasma); S(x + 2, y + 6, MYTHIC.gold);
  }
  if (shield === 'arcane') {
    S(x + 2, y - 3, MYTHIC.core);
    S(x, y - 3, MYTHIC.plasma); S(x + 4, y - 3, MYTHIC.frost);
    S(x - 2, y + 1, MYTHIC.void); S(x + 6, y + 1, MYTHIC.gold);
    S(x - 2, y + 6, MYTHIC.frost); S(x + 6, y + 6, MYTHIC.plasma);
    S(x + 2, y + 10, MYTHIC.core);
    S(x, y + 3, MYTHIC.gold); S(x + 4, y + 3, MYTHIC.gold);
    S(x + 2, y + 2, MYTHIC.plasma); S(x + 2, y + 5, MYTHIC.frost);
  }
}

function drawTier5Full(S, R, x, y, shield) {
  if (shield === 'round') {
    // Worldsun Disc: a burning solar corona around a brilliant central eye.
    S(x + 2, y - 3, ARTIFACT.sun);
    S(x, y - 3, ARTIFACT.ember); S(x + 4, y - 3, ARTIFACT.ember);
    S(x - 1, y - 1, ARTIFACT.gold); S(x + 5, y - 1, ARTIFACT.gold);
    S(x - 2, y + 2, ARTIFACT.ember); S(x + 6, y + 2, ARTIFACT.ember);
    S(x - 2, y + 4, ARTIFACT.sun); S(x + 6, y + 4, ARTIFACT.sun);
    S(x - 1, y + 5, ARTIFACT.gold); S(x + 5, y + 5, ARTIFACT.gold);
    S(x + 2, y + 7, ARTIFACT.sun);
    R(x + 1, y + 1, 3, 1, ARTIFACT.gold);
    R(x + 1, y + 3, 3, 1, ARTIFACT.sun);
    S(x + 2, y + 2, ARTIFACT.core); S(x + 2, y + 4, ARTIFACT.ember);
  }
  if (shield === 'kite') {
    // Voidwyrm Aegis: swept horns, astral wings, and a long draconic tail.
    S(x, y - 3, ARTIFACT.astral); S(x + 4, y - 3, ARTIFACT.astral);
    S(x + 1, y - 2, ARTIFACT.frost); S(x + 3, y - 2, ARTIFACT.frost);
    S(x + 2, y - 1, ARTIFACT.core);
    S(x - 2, y + 1, ARTIFACT.void); S(x + 6, y + 1, ARTIFACT.void);
    S(x - 1, y + 3, ARTIFACT.astral); S(x + 5, y + 3, ARTIFACT.astral);
    S(x, y + 6, ARTIFACT.frost); S(x + 4, y + 6, ARTIFACT.frost);
    S(x + 2, y + 9, ARTIFACT.astral); S(x + 2, y + 10, ARTIFACT.core);
    S(x + 1, y + 2, ARTIFACT.blood); S(x + 3, y + 2, ARTIFACT.blood);
    R(x + 2, y + 3, 1, 4, ARTIFACT.void);
  }
  if (shield === 'buckler') {
    // Paradox Star: a compact eight-point counterguard built around a void core.
    S(x + 1, y - 3, ARTIFACT.core); S(x + 2, y - 3, ARTIFACT.core);
    S(x - 1, y - 1, ARTIFACT.astral); S(x + 4, y - 1, ARTIFACT.astral);
    S(x - 2, y + 1, ARTIFACT.frost); S(x + 5, y + 1, ARTIFACT.frost);
    S(x - 1, y + 4, ARTIFACT.astral); S(x + 4, y + 4, ARTIFACT.astral);
    S(x + 1, y + 6, ARTIFACT.gold); S(x + 2, y + 6, ARTIFACT.gold);
    S(x, y + 1, ARTIFACT.core); S(x + 3, y + 2, ARTIFACT.core);
    S(x + 1, y + 1, ARTIFACT.void); S(x + 2, y + 2, ARTIFACT.void);
  }
  if (shield === 'heater') {
    // Throneheart Aegis: a royal crown, crimson wings, and a heart-shaped point.
    S(x, y - 3, ARTIFACT.gold); S(x + 2, y - 3, ARTIFACT.core); S(x + 4, y - 3, ARTIFACT.gold);
    S(x + 1, y - 2, ARTIFACT.sun); S(x + 3, y - 2, ARTIFACT.sun);
    S(x - 2, y + 1, ARTIFACT.blood); S(x + 6, y + 1, ARTIFACT.blood);
    S(x - 1, y + 4, ARTIFACT.gold); S(x + 5, y + 4, ARTIFACT.gold);
    S(x + 1, y + 7, ARTIFACT.blood); S(x + 3, y + 7, ARTIFACT.blood);
    S(x + 2, y + 8, ARTIFACT.core); S(x + 2, y + 9, ARTIFACT.gold);
    S(x + 1, y + 2, ARTIFACT.ember); S(x + 3, y + 2, ARTIFACT.ember);
    S(x + 2, y + 3, ARTIFACT.sun);
  }
  if (shield === 'tower') {
    // The Unbroken Gate: crenellations, twin warding pillars, and anchored feet.
    S(x - 1, y, ARTIFACT.steel); S(x, y, ARTIFACT.core);
    S(x + 2, y, ARTIFACT.gold); S(x + 3, y, ARTIFACT.core); S(x + 4, y, ARTIFACT.steel);
    R(x - 1, y, 1, 10, ARTIFACT.darkSteel); R(x + 4, y, 1, 10, ARTIFACT.darkSteel);
    S(x - 1, y + 11, ARTIFACT.steel); S(x + 4, y + 11, ARTIFACT.steel);
    S(x - 1, y + 12, ARTIFACT.frost); S(x + 2, y + 12, ARTIFACT.core); S(x + 4, y + 12, ARTIFACT.frost);
    R(x + 1, y + 2, 3, 1, ARTIFACT.gold); R(x + 1, y + 7, 3, 1, ARTIFACT.frost);
    R(x + 2, y + 3, 1, 4, ARTIFACT.darkSteel);
    S(x, y + 4, ARTIFACT.core); S(x + 4, y + 4, ARTIFACT.core);
  }
  if (shield === 'oval') {
    // Imperial Eternity: a tall war-disc enclosed by a golden victory laurel.
    S(x + 1, y - 2, ARTIFACT.gold); S(x + 2, y - 2, ARTIFACT.gold);
    S(x - 1, y - 1, ARTIFACT.sun); S(x + 4, y - 1, ARTIFACT.sun);
    S(x - 2, y + 2, ARTIFACT.gold); S(x + 5, y + 2, ARTIFACT.gold);
    S(x - 2, y + 5, ARTIFACT.gold); S(x + 5, y + 5, ARTIFACT.gold);
    S(x - 1, y + 8, ARTIFACT.ember); S(x + 4, y + 8, ARTIFACT.ember);
    S(x + 1, y + 10, ARTIFACT.core); S(x + 2, y + 10, ARTIFACT.core);
    R(x, y + 2, 4, 1, ARTIFACT.blood); R(x, y + 5, 4, 1, ARTIFACT.gold);
    S(x + 1, y + 3, ARTIFACT.sun); S(x + 2, y + 4, ARTIFACT.core);
  }
  if (shield === 'bone') {
    // Deathking's Reliquary: a horned skull-cage burning with captured souls.
    S(x, y - 2, BONE[0]); S(x + 4, y - 2, BONE[0]);
    S(x + 1, y - 2, ARTIFACT.soul); S(x + 3, y - 2, ARTIFACT.soul);
    S(x + 2, y - 2, ARTIFACT.core);
    S(x - 2, y + 1, BONE[1]); S(x + 6, y + 1, BONE[1]);
    S(x - 2, y + 5, ARTIFACT.void); S(x + 6, y + 5, ARTIFACT.void);
    S(x, y + 9, BONE[0]); S(x + 4, y + 9, BONE[0]);
    S(x + 1, y + 10, ARTIFACT.soul); S(x + 3, y + 10, ARTIFACT.soul);
    S(x + 1, y + 2, ARTIFACT.void); S(x + 3, y + 2, ARTIFACT.void);
    S(x + 2, y + 4, ARTIFACT.soul); S(x + 2, y + 7, ARTIFACT.astral);
  }
  if (shield === 'arcane') {
    // Event Horizon: an asymmetric orbit of runes around a lightless singularity.
    S(x + 2, y - 3, ARTIFACT.core);
    S(x - 1, y - 2, ARTIFACT.frost); S(x + 5, y, ARTIFACT.astral);
    S(x - 2, y + 1, ARTIFACT.astral); S(x + 6, y + 2, ARTIFACT.frost);
    S(x - 2, y + 6, ARTIFACT.frost); S(x + 6, y + 5, ARTIFACT.astral);
    S(x, y + 9, ARTIFACT.astral); S(x + 4, y + 9, ARTIFACT.frost);
    S(x + 2, y + 10, ARTIFACT.core);
    S(x, y + 3, ARTIFACT.gold); S(x + 4, y + 3, ARTIFACT.gold);
    R(x + 1, y + 2, 3, 3, ARTIFACT.void);
    S(x + 2, y + 3, ARTIFACT.core); S(x + 3, y + 5, ARTIFACT.soul);
  }
}

function drawFullShield(S, R, x, y, shield, oc, tier) {
  const reinforcedBoneFrame = shield === 'bone' && (tier === 'tier3' || tier === 'tier4');
  if (reinforcedBoneFrame) drawBoneTier3Foundation(S, R, x, y);
  if (shield === 'round') drawRound(S, R, x, y);
  if (shield === 'kite') drawKite(S, R, x, y, oc);
  if (shield === 'buckler') drawBuckler(S, R, x, y);
  if (shield === 'heater') drawHeater(S, R, x, y, oc);
  if (shield === 'tower') drawTower(S, R, x, y, oc);
  if (shield === 'oval') drawOval(S, R, x, y);
  if (shield === 'bone') drawBone(S, R, x, y);
  if (shield === 'arcane') drawArcane(S, R, x, y);
  if (tier === 'tier2' || tier === 'tier3' || tier === 'tier4' || tier === 'tier5') drawTier2Full(S, R, x, y, shield);
  if (shield === 'bone' && tier === 'tier3') drawBoneTier3Details(S, R, x, y);
  else if (tier === 'tier3' || tier === 'tier4' || tier === 'tier5') drawTier3Full(S, R, x, y, shield);
  if (reinforcedBoneFrame) drawBoneTier3Frame(S, R, x, y);
  if (tier === 'tier4') drawTier4Full(S, R, x, y, shield);
  if (tier === 'tier5') drawTier5Full(S, R, x, y, shield);
}

function shieldHandOffset(p, d, viewDir) {
  if (d !== 'right') return -p.arm;
  if (p.wep === 'wind') return -1;
  return p.arm;
}

export function drawShield(S, R, d, p, C, u, layer = 'front', viewDir = d) {
  if (!C.shield || C.shield === 'none') return;

  if (!C.shieldFollowRig) {
    drawLegacyShield(S, R, d, C, u, layer);
    return;
  }

  const gripOffsetY = SHIELD_GRIP_OFFSET_Y[C.shield];
  if (gripOffsetY === undefined) return;
  const handOffset = shieldHandOffset(p, d, viewDir);
  const handX = d === 'right' ? SHIELD_HAND_X.side : SHIELD_HAND_X[d];
  const originX = shieldFaceOriginX(d, C.shield);
  const originY = SHIELD_HAND_Y + p.bob + handOffset - gripOffsetY;
  const handY = SHIELD_HAND_Y + p.bob + handOffset;

  if (d === 'right') {
    // The same shield hand is near the viewer while facing right and far from
    // the viewer while facing left. Its forearm-relative orientation does not
    // change; only the screen attachment, body depth, and arm phase change.
    const nearHand = viewDir === 'left';
    const faceLayer = nearHand ? 'front' : 'behind';
    if (layer === faceLayer) {
      if (faceLayer === 'front') R(handX - 1, handY, 2, 2, shieldGripColor(C.shield));
      drawFullShield(S, R, originX, originY, C.shield, C.oc, C.shieldTier);
    }
    // A far-side face sits behind the torso, but its equipment-owned grip still
    // replaces the generic body hand in the front pass.
    if (layer === 'front' && faceLayer === 'behind') {
      R(handX - 1, handY, 2, 2, shieldGripColor(C.shield));
    }
    return;
  }

  const faceLayer = d === 'up' ? 'behind' : 'front';
  if (layer === faceLayer) {
    if (faceLayer === 'front') R(handX - 1, handY, 2, 2, shieldGripColor(C.shield));
    drawFullShield(S, R, originX, originY, C.shield, C.oc, C.shieldTier);
  }
  if (layer === 'front' && faceLayer === 'behind') {
    R(handX - 1, handY, 2, 2, shieldGripColor(C.shield));
  }
}
