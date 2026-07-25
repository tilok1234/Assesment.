// Humanoid weapon pixel rendering.
// Existing enemy-compatible weapons preserve their original coordinates; new player weapons
// share the same direction and pose anchors so content can grow without covering the face.

import { GOLD, METAL, STRINGC, WOOD } from './catalogs.js';

const MAGIC = ['#59d8cc', '#2fa79b', '#c6f7ef'];
const BOOK = ['#7b4fb5', '#57357f', '#e9dca9', '#8be6dc'];
const TIER2 = {
  edge: '#f5fbff',
  rune: '#71e5ff',
  runeDark: '#318db5',
  gold: '#f7dc85',
  ember: '#ff8d4a',
};
const TIER3 = {
  core: '#fff4a8',
  astral: '#d979ff',
  astralDark: '#853db5',
  flame: '#ff5f45',
  storm: '#8ea7ff',
};
const TIER4 = {
  core: '#ffffff',
  mythic: '#ffd45c',
  void: '#6338c7',
  plasma: '#ff55d7',
  frost: '#67f2ff',
};
const TIER5_THEMES = {
  sword:      { apex: '#fff6d8', divine: '#f5b940', cosmic: '#ff8a3d', rift: '#d94832', abyss: '#4a201c' },
  greatsword: { apex: '#f5f7ff', divine: '#c7d5ff', cosmic: '#7893df', rift: '#8c68c9', abyss: '#272440' },
  scimitar:   { apex: '#fff1a6', divine: '#ffbe38', cosmic: '#ff7438', rift: '#a62d61', abyss: '#35132e' },
  rapier:     { apex: '#f5ffff', divine: '#f3d589', cosmic: '#77dcff', rift: '#5575c7', abyss: '#18294c' },
  dagger:     { apex: '#f5efff', divine: '#b99aff', cosmic: '#795bc9', rift: '#d25294', abyss: '#1d1433' },
  axe:        { apex: '#f4ffff', divine: '#e8c45f', cosmic: '#62d8ee', rift: '#4d70bd', abyss: '#172c45' },
  mace:       { apex: '#fff5bd', divine: '#ffc54a', cosmic: '#f08032', rift: '#b83c2f', abyss: '#47211d' },
  warhammer:  { apex: '#fff0cc', divine: '#f3a43d', cosmic: '#df5a2d', rift: '#8f2e28', abyss: '#3b211d' },
  spear:      { apex: '#efffff', divine: '#edce69', cosmic: '#55c9b8', rift: '#3d78ad', abyss: '#15333a' },
  club:       { apex: '#f1e7b7', divine: '#b9853f', cosmic: '#6e9b4f', rift: '#3f683c', abyss: '#2f261c' },
  bow:        { apex: '#fff7d4', divine: '#e5be5a', cosmic: '#72c6d4', rift: '#3a8795', abyss: '#23343a' },
  crossbow:   { apex: '#fff3d2', divine: '#d6ad54', cosmic: '#d96936', rift: '#8f352d', abyss: '#352326' },
  staff:      { apex: '#f4ffff', divine: '#edcf69', cosmic: '#62cbe7', rift: '#4968b9', abyss: '#1e2a52' },
  wand:       { apex: '#fff5ff', divine: '#c999ff', cosmic: '#b34fd7', rift: '#6840a6', abyss: '#26173e' },
  spellbook:  { apex: '#fff0bc', divine: '#d8ac4f', cosmic: '#55b9aa', rift: '#97404f', abyss: '#2b1c38' },
};

function weaponAnchors(C) {
  return {
    downX: 17,
    upX: 6,
    sideX: 14 + (C.sideWeaponOffset || 0),
  };
}

function drawVerticalHilt(S, R, x, guardY, {
  bladeBelow = false,
  guardSize = 3,
  gripSize = 2,
  style = 'cross',
} = {}) {
  const dir = bladeBelow ? -1 : 1;
  const guardX = x - Math.floor(guardSize / 2);
  R(guardX, guardY, guardSize, 1, GOLD[0]);
  S(guardX, guardY, GOLD[2]); S(guardX + guardSize - 1, guardY, GOLD[1]);
  for (let step = 1; step <= gripSize; step++) {
    S(x, guardY + dir * step, step % 2 ? WOOD[1] : WOOD[0]);
  }
  const pommelY = guardY + dir * (gripSize + 1);
  S(x, pommelY, GOLD[1]);

  if (style === 'greatsword') {
    S(x - 1, pommelY, GOLD[0]); S(x + 1, pommelY, GOLD[0]);
  }
  if (style === 'scimitar') {
    S(x + 1, guardY + dir, GOLD[0]); S(x + 1, guardY + dir * 2, GOLD[1]);
  }
  if (style === 'rapier') {
    S(x - 1, guardY + dir, GOLD[0]); S(x + 1, guardY + dir, GOLD[0]);
    S(x - 1, guardY + dir * 2, GOLD[1]); S(x + 1, guardY + dir * 2, GOLD[1]);
  }
}

function drawHorizontalHilt(S, R, guardX, y, {
  guardSize = 3,
  gripSize = 2,
  style = 'cross',
} = {}) {
  const guardY = y - Math.floor(guardSize / 2);
  R(guardX, guardY, 1, guardSize, GOLD[0]);
  S(guardX, guardY, GOLD[2]); S(guardX, guardY + guardSize - 1, GOLD[1]);
  for (let step = 1; step <= gripSize; step++) {
    S(guardX - step, y, step % 2 ? WOOD[1] : WOOD[0]);
  }
  const pommelX = guardX - gripSize - 1;
  S(pommelX, y, GOLD[1]);

  if (style === 'greatsword') {
    S(pommelX, y - 1, GOLD[0]); S(pommelX, y + 1, GOLD[0]);
  }
  if (style === 'scimitar') {
    S(guardX - 1, y + 1, GOLD[0]); S(guardX - 2, y + 1, GOLD[1]);
  }
  if (style === 'rapier') {
    S(guardX - 1, y - 1, GOLD[0]); S(guardX - 1, y + 1, GOLD[0]);
    S(guardX - 2, y - 1, GOLD[1]); S(guardX - 2, y + 1, GOLD[1]);
  }
}

const STRAIGHT_BLADE_PROFILES = {
  sword: {
    verticalLength: [6, 7, 8, 9, 9],
    sideLength: [6, 7, 7, 8, 8],
    thickness: [1, 1, 2, 2, 2],
    guardSize: [3, 3, 5, 5, 5],
    gripSize: 2,
    hiltStyle: 'cross',
  },
  greatsword: {
    verticalLength: [8, 9, 10, 11, 11],
    sideLength: [8, 8, 9, 9, 9],
    thickness: [2, 2, 3, 3, 3],
    guardSize: [5, 5, 5, 7, 7],
    gripSize: 3,
    hiltStyle: 'greatsword',
  },
  dagger: {
    verticalLength: [3, 4, 4, 5, 5],
    sideLength: [3, 4, 4, 5, 5],
    thickness: [1, 2, 2, 2, 2],
    guardSize: [3, 3, 3, 3, 5],
    gripSize: 1,
    hiltStyle: 'dagger',
  },
};

function straightBladeTier(C) {
  const parsed = Number.parseInt(String(C.weaponTier || 'tier1').replace('tier', ''), 10);
  return Math.max(1, Math.min(5, Number.isFinite(parsed) ? parsed : 1));
}

function straightBladeStyle(weapon, tier) {
  if (tier === 1) return {
    blade: METAL[0], edge: METAL[2], shadow: METAL[1],
    guard: GOLD[0], guardEdge: GOLD[2], guardDark: GOLD[1], rune: null,
  };
  if (tier === 2) return {
    blade: '#b9d7e8', edge: TIER2.edge, shadow: TIER2.runeDark,
    guard: TIER2.gold, guardEdge: '#fff0ad', guardDark: GOLD[1], rune: TIER2.rune,
  };
  if (tier === 3) return {
    blade: '#d4d8e8', edge: TIER3.core, shadow: TIER3.astralDark,
    guard: TIER2.gold, guardEdge: TIER3.core, guardDark: GOLD[1], rune: TIER3.astral,
  };
  if (tier === 4) return {
    blade: TIER4.frost, edge: TIER4.core, shadow: TIER4.void,
    guard: TIER4.mythic, guardEdge: TIER4.core, guardDark: TIER4.void, rune: TIER4.plasma,
  };
  const theme = TIER5_THEMES[weapon];
  return {
    blade: theme.divine, edge: theme.apex, shadow: theme.abyss,
    guard: theme.divine, guardEdge: theme.apex, guardDark: theme.rift, rune: theme.cosmic,
  };
}

function drawReadableVerticalBlade(S, R, x, guardY, length, thickness, bladeBelow, style, tier) {
  const direction = bladeBelow ? 1 : -1;
  for (let step = 1; step <= length; step++) {
    const y = guardY + direction * step;
    const tipDistance = length - step;
    const rowWidth = tipDistance === 0 ? 1 : (tipDistance === 1 ? Math.min(2, thickness) : thickness);
    const left = x - Math.floor((rowWidth - 1) / 2);
    if (rowWidth === 1) {
      S(x, y, tipDistance === 0 ? style.edge : style.blade);
    } else if (rowWidth === 2) {
      S(left, y, style.edge); S(left + 1, y, style.shadow);
    } else {
      S(left, y, style.edge); R(left + 1, y, rowWidth - 2, 1, style.blade); S(left + rowWidth - 1, y, style.shadow);
    }
  }
  if (style.rune && length >= 4) {
    const runeStep = Math.max(2, Math.floor(length / 2));
    S(x, guardY + direction * runeStep, style.rune);
    if (tier >= 5 && thickness >= 2 && runeStep + 2 < length) {
      S(x, guardY + direction * (runeStep + 2), style.rune);
    }
  }
}

function drawReadableHorizontalBlade(S, R, guardX, y, length, thickness, style, tier) {
  for (let step = 1; step <= length; step++) {
    const x = guardX + step;
    const tipDistance = length - step;
    const columnHeight = tipDistance === 0 ? 1 : (tipDistance === 1 ? Math.min(2, thickness) : thickness);
    const top = y - Math.floor((columnHeight - 1) / 2);
    if (columnHeight === 1) {
      S(x, y, tipDistance === 0 ? style.edge : style.blade);
    } else if (columnHeight === 2) {
      S(x, top, style.edge); S(x, top + 1, style.shadow);
    } else {
      S(x, top, style.edge); R(x, top + 1, 1, columnHeight - 2, style.blade); S(x, top + columnHeight - 1, style.shadow);
    }
  }
  if (style.rune && length >= 4) {
    const runeStep = Math.max(2, Math.floor(length / 2));
    S(guardX + runeStep, y, style.rune);
    if (tier >= 5 && thickness >= 2 && runeStep + 2 < length) S(guardX + runeStep + 2, y, style.rune);
  }
}

function drawReadableVerticalHilt(S, R, x, guardY, bladeBelow, profile, guardSize, style, tier) {
  const gripDirection = bladeBelow ? -1 : 1;
  const guardLeft = x - Math.floor(guardSize / 2);
  R(guardLeft, guardY, guardSize, 1, style.guardDark);
  if (guardSize > 2) R(guardLeft + 1, guardY, guardSize - 2, 1, style.guard);
  S(guardLeft, guardY, style.guardEdge); S(guardLeft + guardSize - 1, guardY, style.guardEdge);
  if (tier >= 2) S(x, guardY, style.rune || style.guardEdge);

  for (let step = 1; step <= profile.gripSize; step++) {
    S(x, guardY + gripDirection * step, step % 2 ? WOOD[1] : style.guardDark);
  }
  const pommelY = guardY + gripDirection * (profile.gripSize + 1);
  S(x, pommelY, style.guardDark);
  if (profile.hiltStyle === 'greatsword') {
    S(x - 1, pommelY, style.guard); S(x + 1, pommelY, style.guard);
  } else if (profile.hiltStyle === 'scimitar') {
    S(x + 1, pommelY, style.guard);
    S(x + 1, pommelY - gripDirection, style.guardDark);
  } else if (profile.hiltStyle === 'rapier') {
    const basketY = guardY + gripDirection;
    S(x - 1, basketY, style.guard); S(x + 1, basketY, style.guard);
    S(x - 1, basketY + gripDirection, style.guardDark); S(x + 1, basketY + gripDirection, style.guardDark);
  } else if (tier >= 4) {
    S(x, pommelY + gripDirection, style.guardEdge);
  }
  if (tier >= 4 && guardSize >= 5) {
    S(guardLeft + 1, guardY + gripDirection, style.guardDark);
    S(guardLeft + guardSize - 2, guardY + gripDirection, style.guardDark);
  }
}

function drawReadableHorizontalHilt(S, R, guardX, y, profile, guardSize, style, tier) {
  const guardTop = y - Math.floor(guardSize / 2);
  R(guardX, guardTop, 1, guardSize, style.guardDark);
  if (guardSize > 2) R(guardX, guardTop + 1, 1, guardSize - 2, style.guard);
  S(guardX, guardTop, style.guardEdge); S(guardX, guardTop + guardSize - 1, style.guardEdge);
  if (tier >= 2) S(guardX, y, style.rune || style.guardEdge);

  for (let step = 1; step <= profile.gripSize; step++) {
    S(guardX - step, y, step % 2 ? WOOD[1] : style.guardDark);
  }
  const pommelX = guardX - profile.gripSize - 1;
  S(pommelX, y, style.guardDark);
  if (profile.hiltStyle === 'greatsword') {
    S(pommelX, y - 1, style.guard); S(pommelX, y + 1, style.guard);
  } else if (profile.hiltStyle === 'scimitar') {
    S(pommelX, y + 1, style.guard);
    S(pommelX + 1, y + 1, style.guardDark);
  } else if (profile.hiltStyle === 'rapier') {
    S(guardX - 1, y - 1, style.guard); S(guardX - 1, y + 1, style.guard);
    S(guardX - 2, y - 1, style.guardDark); S(guardX - 2, y + 1, style.guardDark);
  } else if (tier >= 4) {
    S(pommelX - 1, y, style.guardEdge);
  }
  if (tier >= 4 && guardSize >= 5) {
    S(guardX - 1, guardTop + 1, style.guardDark);
    S(guardX - 1, guardTop + guardSize - 2, style.guardDark);
  }
}

function drawReadableStraightBlade(S, R, d, p, C) {
  const profile = STRAIGHT_BLADE_PROFILES[C.weapon];
  if (!profile) return false;

  const tier = straightBladeTier(C);
  const style = straightBladeStyle(C.weapon, tier);
  const thickness = profile.thickness[tier - 1];
  const guardSize = profile.guardSize[tier - 1];
  const verticalLength = profile.verticalLength[tier - 1];
  const sideLength = profile.sideLength[tier - 1];
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const isGreatsword = C.weapon === 'greatsword';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (d === 'down') {
    const guardY = strike ? 14 : wind ? 12 : 13;
    const bladeBelow = strike;
    const safeLength = bladeBelow
      ? Math.min(verticalLength, isGreatsword ? 7 : 8)
      : Math.min(verticalLength, isGreatsword ? 10 : guardY - 1);
    drawReadableVerticalBlade(S, R, downX, guardY, safeLength, thickness, bladeBelow, style, tier);
    drawReadableVerticalHilt(S, R, downX, guardY, bladeBelow, profile, guardSize, style, tier);
  } else if (d === 'up') {
    const guardY = strike ? 10 : 14;
    const bladeBelow = wind;
    const safeLength = bladeBelow
      ? Math.min(verticalLength, isGreatsword ? 7 : 8)
      : Math.min(verticalLength, isGreatsword && strike ? 8 : guardY - 1);
    drawReadableVerticalBlade(S, R, upX, guardY, safeLength, thickness, bladeBelow, style, tier);
    drawReadableVerticalHilt(S, R, upX, guardY, bladeBelow, profile, guardSize, style, tier);
  } else if (strike) {
    const guardX = isGreatsword ? 13 : 15;
    const safeLength = Math.min(sideLength, (isGreatsword ? 21 : 23) - guardX);
    drawReadableHorizontalBlade(S, R, guardX, 13, safeLength, thickness, style, tier);
    drawReadableHorizontalHilt(S, R, guardX, 13, profile, guardSize, style, tier);
  } else {
    const guardY = wind ? 11 : 14;
    const safeLength = Math.min(verticalLength, guardY - (isGreatsword && wind ? 2 : 1));
    drawReadableVerticalBlade(S, R, sideX, guardY, safeLength, thickness, false, style, tier);
    drawReadableVerticalHilt(S, R, sideX, guardY, false, profile, guardSize, style, tier);
  }
  return true;
}

const SCIMITAR_PROFILE = {
  verticalLength: [5, 6, 7, 8, 8],
  sideLength: [6, 7, 7, 8, 8],
  thickness: [1, 1, 2, 2, 2],
  guardSize: [3, 3, 3, 5, 5],
  gripSize: 2,
  hiltStyle: 'scimitar',
};

const RAPIER_PROFILE = {
  verticalLength: [7, 8, 8, 9, 9],
  sideLength: [7, 8, 8, 8, 8],
  guardSize: [3, 5, 5, 5, 5],
  gripSize: 2,
  hiltStyle: 'rapier',
};

function drawReadableCurvedBlade(S, x, guardY, length, thickness, bladeBelow, curveSign, style, tier) {
  const direction = bladeBelow ? 1 : -1;
  for (let step = 1; step <= length; step++) {
    const tipDistance = length - step;
    const curve = tipDistance === 0 ? curveSign * 2 : tipDistance === 1 ? curveSign : 0;
    const bladeX = x + curve;
    const bladeY = guardY + direction * step;
    S(bladeX, bladeY, tipDistance === 0 ? style.edge : style.blade);
    if (thickness >= 2 && tipDistance > 0) S(bladeX - curveSign, bladeY, style.shadow);
    if (style.rune && step === Math.max(2, Math.floor(length / 2))) S(bladeX, bladeY, style.rune);
    if (tier >= 5 && style.rune && step === Math.max(3, length - 2)) S(bladeX, bladeY, style.rune);
  }
}

function drawReadableHorizontalCurve(S, guardX, y, length, thickness, style, tier) {
  for (let step = 1; step <= length; step++) {
    const tipDistance = length - step;
    const lift = tipDistance === 0 ? -2 : tipDistance === 1 ? -1 : 0;
    const bladeX = guardX + step;
    const bladeY = y + lift;
    S(bladeX, bladeY, tipDistance === 0 ? style.edge : style.blade);
    if (thickness >= 2 && tipDistance > 0) S(bladeX, bladeY + 1, style.shadow);
    if (style.rune && step === Math.max(2, Math.floor(length / 2))) S(bladeX, bladeY, style.rune);
    if (tier >= 5 && style.rune && step === Math.max(3, length - 2)) S(bladeX, bladeY, style.rune);
  }
}

function drawReadableScimitar(S, R, d, p, C) {
  if (C.weapon !== 'scimitar') return false;
  const tier = straightBladeTier(C);
  const style = straightBladeStyle('scimitar', tier);
  const verticalLength = SCIMITAR_PROFILE.verticalLength[tier - 1];
  const sideLength = SCIMITAR_PROFILE.sideLength[tier - 1];
  const thickness = SCIMITAR_PROFILE.thickness[tier - 1];
  const guardSize = SCIMITAR_PROFILE.guardSize[tier - 1];
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (d === 'down') {
    const guardY = strike ? 14 : wind ? 11 : 13;
    const bladeBelow = strike;
    const safeLength = bladeBelow ? Math.min(verticalLength, 7) : Math.min(verticalLength, guardY - 2);
    drawReadableCurvedBlade(S, downX, guardY, safeLength, thickness, bladeBelow, bladeBelow ? -1 : 1, style, tier);
    drawReadableVerticalHilt(S, R, downX, guardY, bladeBelow, SCIMITAR_PROFILE, guardSize, style, tier);
  } else if (d === 'up') {
    const guardY = strike ? 10 : 14;
    const bladeBelow = wind;
    const safeLength = bladeBelow ? Math.min(verticalLength, 7) : Math.min(verticalLength, guardY - 2);
    drawReadableCurvedBlade(S, upX, guardY, safeLength, thickness, bladeBelow, bladeBelow ? 1 : -1, style, tier);
    drawReadableVerticalHilt(S, R, upX, guardY, bladeBelow, SCIMITAR_PROFILE, guardSize, style, tier);
  } else if (strike) {
    const guardX = 14;
    const safeLength = Math.min(sideLength, 21 - guardX);
    drawReadableHorizontalCurve(S, guardX, 13, safeLength, thickness, style, tier);
    drawReadableHorizontalHilt(S, R, guardX, 13, SCIMITAR_PROFILE, guardSize, style, tier);
  } else {
    const guardY = wind ? 11 : 13;
    const safeLength = Math.min(verticalLength, guardY - 2);
    drawReadableCurvedBlade(S, sideX, guardY, safeLength, thickness, false, 1, style, tier);
    drawReadableVerticalHilt(S, R, sideX, guardY, false, SCIMITAR_PROFILE, guardSize, style, tier);
  }
  return true;
}

function drawReadableRapier(S, R, d, p, C) {
  if (C.weapon !== 'rapier') return false;
  const tier = straightBladeTier(C);
  const style = straightBladeStyle('rapier', tier);
  const verticalLength = RAPIER_PROFILE.verticalLength[tier - 1];
  const sideLength = RAPIER_PROFILE.sideLength[tier - 1];
  const guardSize = RAPIER_PROFILE.guardSize[tier - 1];
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (d === 'down') {
    const guardY = strike ? 14 : wind ? 11 : 13;
    const bladeBelow = strike;
    const safeLength = bladeBelow ? Math.min(verticalLength, 7) : Math.min(verticalLength, guardY - 1);
    drawReadableVerticalBlade(S, R, downX, guardY, safeLength, 1, bladeBelow, style, tier);
    drawReadableVerticalHilt(S, R, downX, guardY, bladeBelow, RAPIER_PROFILE, guardSize, style, tier);
  } else if (d === 'up') {
    const guardY = strike ? 10 : 14;
    const bladeBelow = wind;
    const safeLength = bladeBelow
      ? Math.min(verticalLength, 7)
      : Math.min(verticalLength, strike ? 8 : guardY - 1);
    drawReadableVerticalBlade(S, R, upX, guardY, safeLength, 1, bladeBelow, style, tier);
    drawReadableVerticalHilt(S, R, upX, guardY, bladeBelow, RAPIER_PROFILE, guardSize, style, tier);
  } else if (strike) {
    const guardX = 14;
    const safeLength = Math.min(sideLength, 21 - guardX);
    drawReadableHorizontalBlade(S, R, guardX, 13, safeLength, 1, style, tier);
    drawReadableHorizontalHilt(S, R, guardX, 13, RAPIER_PROFILE, guardSize, style, tier);
  } else {
    const guardY = wind ? 11 : 13;
    const safeLength = Math.min(verticalLength, guardY - 1);
    drawReadableVerticalBlade(S, R, sideX, guardY, safeLength, 1, false, style, tier);
    drawReadableVerticalHilt(S, R, sideX, guardY, false, RAPIER_PROFILE, guardSize, style, tier);
  }
  return true;
}

const AXE_HEADS = [
  // T1 hatchet: one tall cutting edge with tapered top and beard.
  [[-1, -2, 'edge'], [-2, -1, 'edge'], [-1, -1, 'blade'], [0, -1, 'blade'], [-2, 0, 'edge'], [-1, 0, 'blade'], [0, 0, 'accent'], [-2, 1, 'edge'], [-1, 1, 'shadow'], [0, 1, 'shadow'], [-1, 2, 'shadow']],
  // T2 twinhead: retain the dominant cleaver and add a smaller counter-blade.
  [[-1, -2, 'edge'], [-2, -1, 'edge'], [-1, -1, 'blade'], [0, -1, 'blade'], [1, -1, 'blade'], [2, -1, 'edge'], [-2, 0, 'edge'], [-1, 0, 'blade'], [0, 0, 'accent'], [1, 0, 'blade'], [2, 0, 'edge'], [-2, 1, 'edge'], [-1, 1, 'shadow'], [0, 1, 'shadow'], [1, 1, 'shadow'], [2, 1, 'edge'], [-1, 2, 'shadow']],
  // T3 stormcleaver: a large crescent cheek plus a compact rear spike.
  [[-1, -3, 'edge'], [-3, -2, 'edge'], [-2, -2, 'edge'], [-1, -2, 'blade'], [0, -2, 'blade'], [-3, -1, 'edge'], [-2, -1, 'blade'], [-1, -1, 'blade'], [0, -1, 'blade'], [1, -1, 'blade'], [-3, 0, 'edge'], [-2, 0, 'blade'], [-1, 0, 'blade'], [0, 0, 'accent'], [1, 0, 'blade'], [2, 0, 'edge'], [-3, 1, 'edge'], [-2, 1, 'shadow'], [-1, 1, 'shadow'], [0, 1, 'shadow'], [-2, 2, 'shadow'], [-1, 2, 'shadow'], [-1, 3, 'shadow']],
  // T4 executioner: an oversized single cutting edge and a narrow back spike.
  [[-1, -3, 'edge'], [-3, -2, 'edge'], [-2, -2, 'edge'], [-1, -2, 'blade'], [0, -2, 'blade'], [-4, -1, 'edge'], [-3, -1, 'blade'], [-2, -1, 'blade'], [-1, -1, 'blade'], [0, -1, 'blade'], [1, -1, 'blade'], [-4, 0, 'edge'], [-3, 0, 'blade'], [-2, 0, 'blade'], [-1, 0, 'blade'], [0, 0, 'accent'], [1, 0, 'blade'], [2, 0, 'edge'], [-4, 1, 'edge'], [-3, 1, 'shadow'], [-2, 1, 'shadow'], [-1, 1, 'shadow'], [0, 1, 'shadow'], [-3, 2, 'edge'], [-2, 2, 'shadow'], [-1, 2, 'shadow'], [-1, 3, 'shadow']],
  // T5 heavenrend: a monumental bearded crescent with one narrow rear spike.
  [[-1, -4, 'edge'], [-3, -3, 'edge'], [-2, -3, 'edge'], [-1, -3, 'blade'], [0, -3, 'blade'], [-4, -2, 'edge'], [-3, -2, 'blade'], [-2, -2, 'blade'], [-1, -2, 'blade'], [0, -2, 'blade'], [-5, -1, 'edge'], [-4, -1, 'blade'], [-3, -1, 'blade'], [-2, -1, 'blade'], [-1, -1, 'blade'], [0, -1, 'accent'], [1, -1, 'shadow'], [-5, 0, 'edge'], [-4, 0, 'blade'], [-3, 0, 'blade'], [-2, 0, 'blade'], [-1, 0, 'accent'], [0, 0, 'accent'], [1, 0, 'blade'], [2, 0, 'blade'], [3, 0, 'edge'], [-5, 1, 'edge'], [-4, 1, 'shadow'], [-3, 1, 'shadow'], [-2, 1, 'shadow'], [-1, 1, 'shadow'], [0, 1, 'shadow'], [1, 1, 'shadow'], [-4, 2, 'edge'], [-3, 2, 'shadow'], [-2, 2, 'shadow'], [-1, 2, 'shadow'], [-2, 3, 'edge'], [-1, 3, 'shadow']],
];

function readableAxeStyle(tier) {
  if (tier === 1) return { blade: METAL[0], edge: METAL[2], shadow: METAL[1], accent: WOOD[1], shaft: WOOD[0], shaftDark: WOOD[1] };
  if (tier === 2) return { blade: '#b9d7e8', edge: TIER2.edge, shadow: TIER2.runeDark, accent: TIER2.gold, shaft: WOOD[0], shaftDark: WOOD[1] };
  if (tier === 3) return { blade: '#b8c9e8', edge: TIER3.core, shadow: '#5269a6', accent: TIER3.astral, shaft: '#65402d', shaftDark: '#3f2b23' };
  if (tier === 4) return { blade: '#91cfdf', edge: TIER4.core, shadow: '#354b78', accent: TIER4.plasma, shaft: '#5b3c2c', shaftDark: '#35251f' };
  const theme = TIER5_THEMES.axe;
  return { blade: '#76a9ba', edge: theme.apex, shadow: '#274864', accent: theme.divine, shaft: '#4a3428', shaftDark: '#2d211c' };
}

function drawReadableAxeHead(S, x, y, tier, style, horizontal = false, mirror = false) {
  for (const [sourceX, sourceY, colorKey] of AXE_HEADS[tier - 1]) {
    const headX = mirror ? -sourceX : sourceX;
    const drawX = horizontal ? x + sourceY : x + headX;
    const drawY = horizontal ? y + headX : y + sourceY;
    S(drawX, drawY, style[colorKey]);
  }
}

function drawReadableAxe(S, R, d, p, C) {
  if (C.weapon !== 'axe') return false;
  const tier = straightBladeTier(C);
  const index = tier - 1;
  const style = readableAxeStyle(tier);
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (d === 'down') {
    const axeX = tier === 5 ? downX - 1 : downX;
    const headY = strike ? [19, 19, 18, 18, 18][index] : wind ? 6 : 8;
    if (strike) R(axeX, 14, 1, 7, style.shaft); else R(axeX, headY, 1, 7, style.shaft);
    S(axeX, strike ? 16 : headY + 3, style.shaftDark);
    drawReadableAxeHead(S, axeX, headY, tier, style, false, true);
  } else if (d === 'up') {
    const axeX = tier === 5 ? upX + 1 : upX;
    const headY = strike ? [4, 4, 5, 5, 6][index] : wind ? 7 : 9;
    R(axeX, headY, 1, strike ? 8 : 7, style.shaft);
    S(axeX, headY + 3, style.shaftDark);
    drawReadableAxeHead(S, axeX, headY, tier, style, false, false);
  } else if (strike) {
    const headX = [19, 19, 18, 18, 18][index];
    R(14, 13, headX - 13, 1, style.shaft);
    S(17, 13, style.shaftDark);
    drawReadableAxeHead(S, headX, 13, tier, style, true, false);
  } else {
    const axeX = tier === 5 ? sideX - 1 : sideX;
    const headY = wind ? 6 : 8;
    R(axeX, headY, 1, 7, style.shaft);
    S(axeX, headY + 3, style.shaftDark);
    drawReadableAxeHead(S, axeX, headY, tier, style, false, true);
  }
  return true;
}

const BLUNT_HEAD_MAPS = {
  mace: [
    { anchorX: 2, rows: ['  E  ', ' ELC ', 'ECCCE', ' SSC ', '  H  '] },
    { anchorX: 2, rows: ['  E  ', ' ELE ', 'ECCCE', ' LACS', ' ESS ', '  H  '] },
    { anchorX: 3, rows: ['   E   ', ' E L E ', 'ELCCCLE', ' ECCCE ', '  SAS  ', '   H   '] },
    { anchorX: 3, rows: ['   E   ', ' E L E ', 'ELCCCLE', 'ECCACCE', ' SSSSS ', '  ESE  ', '   H   '] },
    { anchorX: 4, rows: ['    E    ', '  E L E  ', ' ELCACLE ', 'ELCCCCCCE', 'ECCAAACCE', ' SSSSSSS ', '  E S E  ', '    H    '] },
  ],
  warhammer: [
    { anchorX: 3, rows: [' ELLC  ', 'ELCCSSE', ' ESSS  ', '   H   '] },
    { anchorX: 3, rows: ['ELLLC  ', 'ELACSSE', 'ELCCSSE', '  SSS  ', '   H   '] },
    { anchorX: 4, rows: [' ELLLC   ', 'ELACCSEE ', 'ELCCCSS E', ' E SSS E ', '    H    '] },
    { anchorX: 4, rows: ['ELLLLC   ', 'ELACCSEE ', 'ELACCSS E', 'ELCCSS EE', '  SSSS   ', '    H    '] },
    { anchorX: 4, rows: ['ELLLLC    ', 'ELAACCSEE ', 'ELCCCSS E ', 'ESSSSS E  ', ' ESSSS    ', '  SSS     ', '    H     '] },
  ],
  club: [
    { anchorX: 1, rows: [' LE', 'LCC', 'CCS', 'LCS', ' CC', ' H ', ' H '] },
    { anchorX: 2, rows: [' LCE ', 'ELCCE', 'LCCS ', 'ECCSE', ' LCS ', '  H  ', '  H  '] },
    { anchorX: 2, rows: ['  LE ', ' ELCE', 'ELCCE', 'LCCS ', 'ECCSE', ' LCS ', '  H  ', '  H  '] },
    { anchorX: 3, rows: ['  ELCE ', ' ELCSE ', 'ELCACCE', 'LCCCSS ', 'ECCCS E', ' LCSS  ', '  LCS  ', '   H   ', '   H   '] },
    { anchorX: 3, rows: ['  ELC E ', ' ELCACEE', 'ELCCCCE ', 'LCCAACSE', 'ECCCSS E', ' LCCSS  ', 'ELCSS   ', '  LCS   ', '   H    ', '   H    '] },
  ],
};

const BLUNT_GLYPHS = {
  E: 'edge',
  L: 'light',
  C: 'core',
  S: 'shadow',
  A: 'accent',
  H: 'handle',
};

function readableBluntStyle(weapon, tier) {
  if (weapon === 'club') {
    if (tier === 1) return { edge: '#2d1d17', light: '#a56b3f', core: '#765039', shadow: '#4b3025', accent: METAL[0], handle: WOOD[0], handleDark: WOOD[1] };
    if (tier === 2) return { edge: '#332019', light: '#b87943', core: '#7d5132', shadow: '#4b3023', accent: TIER2.edge, handle: '#71482f', handleDark: '#402b22' };
    if (tier === 3) return { edge: '#2e2430', light: '#aa7445', core: '#6f4d39', shadow: '#443044', accent: TIER3.astral, handle: '#69452f', handleDark: '#3c2b27' };
    if (tier === 4) return { edge: '#24243a', light: '#c18a4d', core: '#76543b', shadow: '#3f3348', accent: TIER4.frost, handle: '#69472f', handleDark: '#33282a' };
    const theme = TIER5_THEMES.club;
    return { edge: theme.abyss, light: theme.apex, core: theme.divine, shadow: '#59452c', accent: theme.cosmic, handle: '#6b4b31', handleDark: '#32251d' };
  }

  const theme = TIER5_THEMES[weapon];
  if (tier === 1) return { edge: METAL[2], light: '#f4f4f4', core: METAL[0], shadow: METAL[1], accent: GOLD[0], handle: WOOD[0], handleDark: WOOD[1] };
  if (tier === 2) return { edge: TIER2.edge, light: '#d8f4ff', core: '#91bbcc', shadow: TIER2.runeDark, accent: TIER2.gold, handle: WOOD[0], handleDark: WOOD[1] };
  if (tier === 3) return { edge: TIER3.core, light: '#d9dfff', core: TIER3.storm, shadow: TIER3.astralDark, accent: TIER3.astral, handle: '#65402d', handleDark: '#3f2b23' };
  if (tier === 4) return { edge: TIER4.core, light: TIER4.frost, core: '#8497c7', shadow: TIER4.void, accent: TIER4.plasma, handle: '#5b3c2c', handleDark: '#35251f' };
  return { edge: theme.apex, light: theme.divine, core: theme.cosmic, shadow: theme.abyss, accent: theme.rift, handle: '#4a3428', handleDark: '#2d211c' };
}

function drawReadableBluntHead(S, x, y, weapon, tier, style, { horizontal = false, inverted = false } = {}) {
  const profile = BLUNT_HEAD_MAPS[weapon][tier - 1];
  const anchorY = profile.rows.length - 1;
  for (let row = 0; row < profile.rows.length; row++) {
    for (let column = 0; column < profile.rows[row].length; column++) {
      const colorKey = BLUNT_GLYPHS[profile.rows[row][column]];
      if (!colorKey) continue;
      const sourceX = column - profile.anchorX;
      const sourceY = (row - anchorY) * (inverted ? -1 : 1);
      const drawX = horizontal ? x - sourceY : x + sourceX;
      const drawY = horizontal ? y + sourceX : y + sourceY;
      S(drawX, drawY, style[colorKey]);
    }
  }
}

function bluntPoseRoots(weapon, tier) {
  const index = tier - 1;
  if (weapon === 'mace') return {
    hold: 10,
    wind: [8, 8, 8, 8, 9][index],
    downStrike: [17, 16, 16, 15, 14][index],
    upStrike: [6, 7, 7, 8, 9][index],
    sideStrike: [17, 16, 16, 15, 14][index],
  };
  if (weapon === 'warhammer') return {
    hold: 10,
    wind: 8,
    downStrike: [18, 17, 17, 16, 15][index],
    upStrike: [5, 6, 6, 7, 8][index],
    sideStrike: [18, 17, 17, 16, 15][index],
  };
  return {
    hold: 13,
    wind: 11,
    downStrike: [17, 17, 16, 15, 14][index],
    upStrike: [6, 6, 7, 8, 9][index],
    sideStrike: 14,
  };
}

function drawReadableBlunt(S, R, d, p, C) {
  const weapon = C.weapon;
  if (!BLUNT_HEAD_MAPS[weapon]) return false;
  const tier = straightBladeTier(C);
  const style = readableBluntStyle(weapon, tier);
  const roots = bluntPoseRoots(weapon, tier);
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (d === 'down') {
    const rootY = strike ? roots.downStrike : wind ? roots.wind : roots.hold;
    if (strike) R(downX, 14, 1, rootY - 13, style.handle); else R(downX, rootY, 1, 15 - rootY, style.handle);
    S(downX, strike ? 15 : Math.min(14, rootY + 2), style.handleDark);
    drawReadableBluntHead(S, downX, rootY, weapon, tier, style, { inverted: strike });
  } else if (d === 'up') {
    const rootY = strike ? roots.upStrike : wind ? roots.wind : roots.hold;
    R(upX, rootY, 1, Math.max(1, 11 - rootY), style.handle);
    S(upX, Math.min(10, rootY + 2), style.handleDark);
    drawReadableBluntHead(S, upX, rootY, weapon, tier, style);
  } else if (strike) {
    const rootX = roots.sideStrike;
    R(14, 13, Math.max(1, rootX - 13), 1, style.handle);
    S(Math.min(rootX, 16), 13, style.handleDark);
    drawReadableBluntHead(S, rootX, 13, weapon, tier, style, { horizontal: true });
  } else {
    const rootY = wind ? roots.wind : roots.hold;
    R(sideX, rootY, 1, 15 - rootY, style.handle);
    S(sideX, Math.min(14, rootY + 2), style.handleDark);
    drawReadableBluntHead(S, sideX, rootY, weapon, tier, style);
  }
  return true;
}

function drawPixelLine(S, x0, y0, x1, y1, color) {
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  while (true) {
    S(x, y, color);
    if (x === x1 && y === y1) break;
    const doubled = error * 2;
    if (doubled >= dy) { error += dy; x += sx; }
    if (doubled <= dx) { error += dx; y += sy; }
  }
}

const SPEAR_HEAD_MAPS = [
  { anchorX: 1, rows: [' E ', 'LCL', ' S ', ' H '] },
  { anchorX: 2, rows: ['  E  ', ' LCL ', 'LCACL', '  S  ', '  H  '] },
  { anchorX: 2, rows: ['  E  ', ' LCL ', 'LCACL', 'LCSCL', '  S  ', '  H  '] },
  { anchorX: 2, rows: ['  E  ', ' LCL ', ' LCL ', 'LCACL', ' LSL ', '  S  ', '  H  '] },
  { anchorX: 2, rows: ['  E  ', ' LCL ', ' LCL ', 'LCCCL', 'LCACL', ' LSL ', '  S  ', '  H  '] },
];

function readableProjectileStyle(weapon, tier) {
  const theme = TIER5_THEMES[weapon];
  if (tier === 1) return {
    edge: METAL[2], light: '#f4f4f4', core: METAL[0], shadow: METAL[1], accent: GOLD[0],
    shaft: WOOD[0], shaftDark: WOOD[1], limb: WOOD[0], limbLight: '#a86e42',
    limbDark: WOOD[1], string: STRINGC, stock: WOOD[0], stockDark: WOOD[1], bolt: METAL[0], tip: METAL[2],
  };
  if (tier === 2) return {
    edge: TIER2.edge, light: '#d8f4ff', core: '#91bbcc', shadow: TIER2.runeDark, accent: TIER2.gold,
    shaft: '#7a5135', shaftDark: '#493126', limb: '#9b663d', limbLight: TIER2.gold,
    limbDark: '#553328', string: '#dff8ff', stock: '#795037', stockDark: '#453027', bolt: TIER2.rune, tip: TIER2.edge,
  };
  if (tier === 3) return {
    edge: TIER3.core, light: '#d9dfff', core: TIER3.storm, shadow: TIER3.astralDark, accent: TIER3.astral,
    shaft: '#65402d', shaftDark: '#3f2b23', limb: '#7651a0', limbLight: TIER3.astral,
    limbDark: TIER3.astralDark, string: '#d7ddff', stock: '#68432f', stockDark: '#3c2a28', bolt: TIER3.storm, tip: TIER3.core,
  };
  if (tier === 4) return {
    edge: TIER4.core, light: TIER4.frost, core: '#8497c7', shadow: TIER4.void, accent: TIER4.plasma,
    shaft: '#51355f', shaftDark: '#2d2441', limb: TIER4.void, limbLight: TIER4.frost,
    limbDark: '#34235f', string: '#b9d4da', stock: '#5d3d54', stockDark: '#30233b', bolt: TIER4.frost, tip: TIER4.core,
  };
  if (weapon === 'crossbow') return {
    edge: theme.apex, light: theme.divine, core: theme.cosmic, shadow: theme.abyss, accent: theme.rift,
    shaft: theme.abyss, shaftDark: '#172024', limb: theme.divine, limbLight: theme.apex,
    limbDark: theme.rift, string: '#6f6258', stock: '#6f402e', stockDark: theme.abyss,
    bolt: theme.cosmic, tip: theme.apex,
  };
  return {
    edge: theme.apex, light: theme.divine, core: theme.cosmic, shadow: theme.abyss, accent: theme.rift,
    shaft: weapon === 'spear' ? '#52735b' : theme.abyss, shaftDark: '#172024', limb: theme.cosmic, limbLight: theme.divine,
    limbDark: theme.abyss, string: '#9fb8b8', stock: theme.abyss, stockDark: '#171d22', bolt: theme.cosmic, tip: theme.apex,
  };
}

function drawReadableSpearHead(S, x, y, tier, style, { horizontal = false, inverted = false } = {}) {
  const profile = SPEAR_HEAD_MAPS[tier - 1];
  const anchorY = profile.rows.length - 1;
  for (let row = 0; row < profile.rows.length; row++) {
    for (let column = 0; column < profile.rows[row].length; column++) {
      const glyph = profile.rows[row][column];
      const colorKey = glyph === 'H' ? 'shaft' : BLUNT_GLYPHS[glyph];
      if (!colorKey) continue;
      const sourceX = column - profile.anchorX;
      const sourceY = (row - anchorY) * (inverted ? -1 : 1);
      const drawX = horizontal ? x - sourceY : x + sourceX;
      const drawY = horizontal ? y + sourceX : y + sourceY;
      S(drawX, drawY, style[colorKey]);
    }
  }
}

function drawReadableSpear(S, R, d, p, C) {
  if (C.weapon !== 'spear') return false;
  const tier = straightBladeTier(C);
  const style = readableProjectileStyle('spear', tier);
  const index = tier - 1;
  const holdRoot = [7, 7, 8, 8, 9][index];
  const windRoot = holdRoot - 1;
  const downStrikeRoot = [18, 17, 17, 15, 14][index];
  const upStrikeRoot = [5, 6, 7, 8, 9][index];
  const sideStrikeRoot = [18, 17, 17, 15, 14][index];
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (d === 'down') {
    const rootY = strike ? downStrikeRoot : wind ? windRoot : holdRoot;
    if (strike) R(downX, 13, 1, rootY - 12, style.shaft); else R(downX, rootY, 1, 17 - rootY, style.shaft);
    S(downX, strike ? 14 : 13, style.shaftDark);
    drawReadableSpearHead(S, downX, rootY, tier, style, { inverted: strike });
  } else if (d === 'up') {
    const rootY = strike ? upStrikeRoot : wind ? windRoot : holdRoot;
    R(upX, rootY, 1, strike ? Math.max(1, 11 - rootY) : 17 - rootY, style.shaft);
    S(upX, strike ? 9 : 13, style.shaftDark);
    drawReadableSpearHead(S, upX, rootY, tier, style);
  } else if (strike) {
    R(13, 13, sideStrikeRoot - 12, 1, style.shaft);
    S(14, 13, style.shaftDark);
    drawReadableSpearHead(S, sideStrikeRoot, 13, tier, style, { horizontal: true });
  } else {
    const rootY = wind ? windRoot : holdRoot;
    R(sideX, rootY, 1, 17 - rootY, style.shaft);
    S(sideX, 13, style.shaftDark);
    drawReadableSpearHead(S, sideX, rootY, tier, style);
  }
  return true;
}

function orientedRangedPlotter(S, direction, originX, originY) {
  const point = (x, y) => {
    if (direction === 'down') return [originX + y, originY + x];
    if (direction === 'up') return [originX - y, originY - x];
    return [originX + x, originY + y];
  };
  return {
    pixel(x, y, color) {
      const [drawX, drawY] = point(x, y);
      S(drawX, drawY, color);
    },
    line(x0, y0, x1, y1, color) {
      const [drawX0, drawY0] = point(x0, y0);
      const [drawX1, drawY1] = point(x1, y1);
      drawPixelLine(S, drawX0, drawY0, drawX1, drawY1, color);
    },
  };
}

function drawReadableBow(S, d, p, C) {
  if (C.weapon !== 'bow') return false;
  const tier = straightBladeTier(C);
  const style = readableProjectileStyle('bow', tier);
  const index = tier - 1;
  const span = [5, 6, 6, 7, 8][index];
  const depth = [4, 4, 4, 5, 5][index];
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const centerY = 12;
  const gripX = d === 'down'
    ? 22
    : d === 'up'
      ? 2
      : strike ? 18 : 20;

  // Keep the established upright bow in every view. The side profile is the
  // only mirrored piece: its tips and string sit in front of the character.
  const side = d === 'up' ? 1 : -1;
  const stringX = gripX + side * depth;
  const topY = centerY - span;
  const bottomY = centerY + span;
  const hookSize = tier === 5 ? 2 : tier >= 3 ? 1 : 0;
  const hookX = stringX - side * hookSize;
  const bendX = gripX + side;
  const bendY = Math.ceil(span / 2);
  const stringColor = ['#5a5047', '#58666a', '#625979', '#51606c', '#46656a'][index];
  const pullDistance = tier >= 4 ? 3 : 2;
  const pullX = d === 'up'
    ? stringX + pullDistance
    : stringX - pullDistance;
  const line = (x0, y0, x1, y1, color) => drawPixelLine(S, x0, y0, x1, y1, color);
  const pixel = (x, y, color) => S(x, y, color);

  if (wind) {
    line(stringX, topY, pullX, centerY, stringColor);
    line(pullX, centerY, stringX, bottomY, stringColor);
  } else {
    line(stringX, topY, stringX, bottomY, stringColor);
  }

  line(stringX, topY, hookX, topY + 1, style.limbLight);
  line(hookX, topY + 1, bendX, centerY - bendY, style.limb);
  line(bendX, centerY - bendY, gripX, centerY, style.limb);
  line(gripX, centerY, bendX, centerY + bendY, style.limbDark);
  line(bendX, centerY + bendY, hookX, bottomY - 1, style.limbDark);
  line(hookX, bottomY - 1, stringX, bottomY, style.accent);

  pixel(gripX, centerY, style.accent);
  if (tier >= 2) pixel(gripX, centerY + 1, style.limbDark);
  if (tier >= 3) {
    pixel(bendX - side, centerY - bendY, style.limbLight);
    pixel(bendX - side, centerY + bendY, style.accent);
  }
  if (tier === 5) {
    // The apex bow is a longer, deeper connected crescent with reinforced
    // recurved tips and riser; no detached ornament or direction rewrite.
    pixel(hookX - side, topY + 1, style.light);
    pixel(hookX - side, bottomY - 1, style.accent);
    pixel(bendX, centerY - bendY + 1, style.limbLight);
    pixel(bendX, centerY + bendY - 1, style.limb);
    pixel(gripX - side, centerY - 1, style.limbLight);
    pixel(gripX, centerY - 1, style.light);
    pixel(gripX - side, centerY + 1, style.limbDark);
    pixel(gripX, centerY + 1, style.accent);
  }

  if (wind) {
    if (d === 'right') {
      line(pullX, centerY, gripX + 2, centerY, style.bolt);
      pixel(gripX + 2, centerY, style.tip);
    }
  } else if (strike && d === 'right') {
    const arrowEnd = 20;
    line(gripX - 1, centerY, arrowEnd, centerY, style.bolt);
    pixel(arrowEnd, centerY, style.tip);
    pixel(arrowEnd - 1, centerY - 1, style.tip);
    pixel(arrowEnd - 1, centerY + 1, style.tip);
  }
  return true;
}

function drawReadableCrossbow(S, d, p, C) {
  if (C.weapon !== 'crossbow') return false;
  const tier = straightBladeTier(C);
  const style = readableProjectileStyle('crossbow', tier);
  const index = tier - 1;
  const span = [3, 4, 4, 5, 6][index];
  const back = [3, 4, 4, 5, 5][index];
  const middle = Math.ceil(span / 2);
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  const origin = d === 'down'
    ? [17, strike ? 13 : 14]
    : d === 'up'
      ? [6, strike ? 10 : 11]
      : [strike ? 14 : 17, 13];
  const plot = orientedRangedPlotter(S, d, origin[0], origin[1]);

  if (tier === 5) {
    // The Apocalypse Engine keeps an unmistakable recurved bow in front of a
    // reinforced stock. Bright connected limbs carry the silhouette; the
    // darker string remains visible without becoming a firearm-like barrel.
    plot.line(0, -span, 1, -middle, style.limbLight);
    plot.line(1, -middle, 3, -1, style.limb);
    plot.line(3, -1, 3, 1, style.accent);
    plot.line(3, 1, 1, middle, style.limbDark);
    plot.line(1, middle, 0, span, style.limbDark);
    plot.pixel(-1, -span + 1, style.light);
    plot.pixel(-1, span - 1, style.accent);
    plot.pixel(2, -1, style.limbLight);
    plot.pixel(2, 1, style.limb);
  } else {
    plot.line(0, -span, 1, -middle, style.limb);
    plot.line(1, -middle, 2, 0, style.limb);
    plot.line(2, 0, 1, middle, style.limbDark);
    plot.line(1, middle, 0, span, style.limbDark);
    plot.pixel(0, -span, style.limbLight);
    plot.pixel(0, span, style.limbLight);
    if (tier >= 3) {
      plot.pixel(1, -middle, style.limbLight);
      plot.pixel(1, middle, style.accent);
    }
  }

  const latch = strike ? 2 : wind ? -2 : -1;
  plot.line(0, -span, latch, 0, style.string);
  plot.line(latch, 0, 0, span, style.string);
  plot.line(-back, 0, 3, 0, style.stock);
  plot.pixel(-back, 0, style.stockDark);
  if (tier === 5) {
    plot.line(-back + 1, 1, 0, 1, style.stockDark);
    plot.pixel(-back, 1, style.stockDark);
    plot.line(-1, -1, 3, -1, style.accent);
    plot.pixel(1, -1, style.light);
    plot.line(-1, 1, -3, 3, style.stockDark);
    plot.pixel(-2, 2, style.accent);
  } else {
    plot.line(-1, 0, -2, 2, style.stockDark);
    plot.pixel(-1, 1, style.accent);
  }

  const boltEnd = strike ? (d === 'up' ? 8 : 7) : 3;
  plot.line(latch, 0, boltEnd, 0, style.bolt);
  plot.pixel(boltEnd, 0, style.tip);
  plot.pixel(boltEnd - 1, -1, style.tip);
  plot.pixel(boltEnd - 1, 1, style.tip);
  return true;
}

function drawReadableRanged(S, R, d, p, C) {
  if (drawReadableSpear(S, R, d, p, C)) return true;
  if (drawReadableBow(S, d, p, C)) return true;
  if (drawReadableCrossbow(S, d, p, C)) return true;
  return false;
}

const STAFF_FOCUS_PATTERNS = [
  [
    [0, 0, 'trim'], [-1, -1, 'edge'], [0, -1, 'core'], [1, -1, 'light'], [0, -2, 'light'],
  ],
  [
    [-1, 0, 'trim'], [0, 0, 'trim'], [1, 0, 'trim'],
    [-1, -1, 'edge'], [0, -1, 'core'], [1, -1, 'light'],
    [-1, -2, 'edge'], [0, -2, 'core'], [1, -2, 'light'], [0, -3, 'light'],
  ],
  [
    [-1, 0, 'edge'], [0, 0, 'trim'], [1, 0, 'trim'],
    [-2, -1, 'edge'], [-1, -2, 'edge'], [0, -2, 'core'], [1, -2, 'shadow'],
    [2, -1, 'light'], [2, -2, 'light'], [-1, -3, 'edge'], [0, -3, 'core'], [1, -3, 'light'],
  ],
  [
    [-1, 0, 'trim'], [0, 0, 'trim'], [1, 0, 'trim'],
    [-2, -1, 'edge'], [2, -1, 'light'], [-2, -2, 'edge'], [2, -2, 'light'],
    [-1, -3, 'edge'], [0, -4, 'light'], [1, -3, 'light'],
    [-1, -1, 'shadow'], [0, -1, 'core'], [1, -1, 'shadow'], [0, -2, 'core'],
    [3, -2, 'trim'], [2, -3, 'trim'],
  ],
  [
    [-1, 0, 'trim'], [0, 0, 'trim'], [1, 0, 'trim'],
    [-2, -1, 'edge'], [2, -1, 'light'], [-2, -2, 'edge'], [3, -2, 'light'],
    [-2, -3, 'edge'], [3, -3, 'light'], [-2, -4, 'edge'], [2, -4, 'light'],
    [-1, -5, 'edge'], [0, -5, 'light'], [1, -5, 'light'],
    [-1, -1, 'shadow'], [0, -1, 'core'], [1, -1, 'shadow'],
    [-1, -2, 'core'], [0, -2, 'light'], [1, -2, 'core'],
    [-1, -3, 'shadow'], [0, -3, 'core'], [1, -3, 'shadow'], [2, -2, 'trim'], [2, -3, 'trim'],
  ],
];

const WAND_FOCUS_PATTERNS = [
  [[0, 0, 'trim'], [-1, -1, 'edge'], [0, -1, 'core'], [1, -1, 'light']],
  [
    [-1, 0, 'trim'], [0, 0, 'trim'], [1, 0, 'trim'],
    [-1, -1, 'edge'], [0, -1, 'core'], [1, -1, 'light'], [0, -2, 'light'],
  ],
  [
    [0, 0, 'trim'], [-1, -1, 'edge'], [0, -1, 'core'], [1, -1, 'light'],
    [-2, -2, 'edge'], [-1, -2, 'core'], [0, -2, 'light'], [1, -2, 'core'], [2, -2, 'light'],
  ],
  [
    [-1, 0, 'trim'], [0, 0, 'trim'], [1, 0, 'trim'],
    [-2, -1, 'edge'], [-1, -1, 'core'], [0, -1, 'light'], [1, -1, 'core'], [2, -1, 'light'],
    [-1, -2, 'edge'], [0, -2, 'core'], [1, -2, 'light'], [0, -3, 'light'],
  ],
  [
    [-1, 0, 'trim'], [0, 0, 'trim'], [1, 0, 'trim'],
    [-2, -1, 'edge'], [-1, -1, 'core'], [0, -1, 'light'], [1, -1, 'core'], [2, -1, 'light'],
    [-2, -2, 'edge'], [-1, -2, 'shadow'], [0, -2, 'core'], [1, -2, 'shadow'], [2, -2, 'light'],
    [-1, -3, 'edge'], [0, -3, 'light'], [1, -3, 'light'],
  ],
];

function readableMagicStyle(weapon, tier) {
  if (tier === 1) return {
    shaft: WOOD[0], shaftDark: WOOD[1], trim: GOLD[0], edge: MAGIC[1], core: MAGIC[0], light: MAGIC[2], shadow: '#315c78',
  };
  if (tier === 2) return {
    shaft: '#76523a', shaftDark: '#3d2a23', trim: TIER2.gold, edge: TIER2.edge, core: TIER2.rune, light: '#dffcff', shadow: TIER2.runeDark,
  };
  if (tier === 3) return {
    shaft: '#445477', shaftDark: '#28314f', trim: TIER3.astralDark, edge: TIER3.astral, core: TIER3.storm, light: TIER3.core, shadow: '#543482',
  };
  if (tier === 4) return {
    shaft: TIER4.void, shaftDark: '#1c1738', trim: TIER4.mythic, edge: TIER4.plasma, core: TIER4.frost, light: TIER4.core, shadow: '#66358f',
  };
  const theme = TIER5_THEMES[weapon];
  return {
    shaft: theme.abyss, shaftDark: '#171326', trim: theme.divine, edge: theme.rift, core: theme.cosmic, light: theme.apex, shadow: theme.abyss,
  };
}

function drawMagicFocus(S, rootX, rootY, pattern, style, { horizontal = false, mirror = false, invert = false } = {}) {
  for (const [sourceX, sourceY, colorKey] of pattern) {
    const dx = mirror ? -sourceX : sourceX;
    const dy = invert ? -sourceY : sourceY;
    if (horizontal) S(rootX - sourceY, rootY + sourceX, style[colorKey]);
    else S(rootX + dx, rootY + dy, style[colorKey]);
  }
}

function drawReadableStaff(S, R, d, p, C) {
  if (C.weapon !== 'staff' || !C.weaponFollowRig) return false;
  const tier = straightBladeTier(C);
  const index = tier - 1;
  const style = readableMagicStyle('staff', tier);
  const pattern = STAFF_FOCUS_PATTERNS[index];
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';

  if (d === 'right' && strike) {
    const rootX = [19, 18, 18, 17, 16][index];
    R(9, 13, rootX - 8, 1, style.shaft);
    S(11, 13, style.shaftDark);
    if (tier >= 2) S(12, 13, style.trim);
    drawMagicFocus(S, rootX, 13, pattern, style, { horizontal: true });
    return true;
  }

  const shaftX = d === 'down' ? 17 : d === 'up' ? 6 : weaponAnchors(C).sideX;
  const focusX = d === 'down'
    ? [19, 19, 19, 18, 18][index]
    : d === 'up'
      ? [4, 4, 4, 5, 5][index]
      : [20, 20, 19, 18, 18][index];
  let rootY;
  let bottomY;
  let invert = false;
  if (d === 'down' && strike) {
    rootY = [19, 18, 18, 17, 16][index];
    bottomY = 14;
    invert = true;
    drawPixelLine(S, shaftX, bottomY, focusX, rootY, style.shaft);
  } else if (d === 'up' && strike) {
    rootY = [4, 5, 5, 6, 7][index];
    bottomY = 10;
    drawPixelLine(S, focusX, rootY, shaftX, bottomY, style.shaft);
  } else {
    rootY = wind
      ? [6, 6, 6, 6, 7][index]
      : [7, 7, 7, 7, 8][index];
    bottomY = 16;
    drawPixelLine(S, focusX, rootY, shaftX, rootY + 2, style.shaft);
    R(shaftX, rootY + 2, 1, bottomY - rootY - 1, style.shaft);
  }
  S(shaftX, strike && d === 'down' ? 15 : Math.min(bottomY, rootY + 4), style.shaftDark);
  if (tier >= 2) S(shaftX + (d === 'up' ? -1 : 1), strike && d === 'down' ? 16 : Math.min(bottomY, rootY + 5), style.trim);
  if (tier >= 4) S(shaftX + (d === 'up' ? -1 : 1), strike && d === 'down' ? 15 : bottomY - 1, style.edge);
  drawMagicFocus(S, focusX, rootY, pattern, style, { mirror: d === 'up', invert });
  return true;
}

function drawReadableWand(S, R, d, p, C) {
  if (C.weapon !== 'wand' || !C.weaponFollowRig) return false;
  const tier = straightBladeTier(C);
  const index = tier - 1;
  const style = readableMagicStyle('wand', tier);
  const pattern = WAND_FOCUS_PATTERNS[index];
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';

  if (d === 'right' && strike) {
    const rootX = 20;
    R(14, 13, rootX - 13, 1, style.shaft);
    S(16, 13, style.shaftDark);
    drawMagicFocus(S, rootX, 13, pattern, style, { horizontal: true });
    return true;
  }

  const shaftX = d === 'down' ? 17 : d === 'up' ? 6 : weaponAnchors(C).sideX;
  const focusX = d === 'down' ? 18 : d === 'up' ? 5 : 20;
  let rootY;
  let bottomY;
  let invert = false;
  if (d === 'down' && strike) {
    rootY = [18, 18, 18, 17, 17][index];
    bottomY = 14;
    invert = true;
    drawPixelLine(S, shaftX, bottomY, focusX, rootY, style.shaft);
  } else if (d === 'up' && strike) {
    rootY = [3, 4, 4, 5, 5][index];
    bottomY = 10;
    drawPixelLine(S, focusX, rootY, shaftX, bottomY, style.shaft);
  } else {
    rootY = [10, 10, 9, 9, 8][index] - (wind ? 1 : 0);
    bottomY = 15;
    drawPixelLine(S, focusX, rootY, shaftX, rootY + 1, style.shaft);
    R(shaftX, rootY + 1, 1, bottomY - rootY, style.shaft);
  }
  S(shaftX, strike && d === 'down' ? 15 : Math.min(bottomY, rootY + 3), style.shaftDark);
  if (tier >= 2) S(shaftX + (d === 'up' ? -1 : 1), strike && d === 'down' ? 15 : bottomY - 1, style.trim);
  if (tier >= 4) S(shaftX, bottomY, style.edge);
  drawMagicFocus(S, focusX, rootY, pattern, style, { mirror: d === 'up', invert });
  return true;
}

function readableBookStyle(tier) {
  if (tier === 1) return { cover: BOOK[0], coverDark: BOOK[1], pages: '#f1dfb4', pageShadow: BOOK[2], trim: GOLD[0], rune: BOOK[3] };
  if (tier === 2) return { cover: '#74496e', coverDark: '#382641', pages: '#fff1c4', pageShadow: '#cfb47d', trim: TIER2.gold, rune: TIER2.rune };
  if (tier === 3) return { cover: '#535086', coverDark: '#28274d', pages: '#f4eece', pageShadow: '#b7afd0', trim: TIER3.astral, rune: TIER3.core };
  if (tier === 4) return { cover: '#5c3485', coverDark: TIER4.void, pages: '#e8f7ff', pageShadow: '#9bbdd8', trim: TIER4.mythic, rune: TIER4.core };
  const theme = TIER5_THEMES.spellbook;
  return { cover: theme.rift, coverDark: theme.abyss, pages: '#fff2c7', pageShadow: '#d7bd8c', trim: theme.divine, rune: theme.apex };
}

const READABLE_BOOK_WIDTHS = [4, 5, 6, 7, 7];
const READABLE_BOOK_HEIGHTS = [4, 4, 5, 5, 6];

function drawReadableBookShape(S, x, y, tier, style) {
  const width = READABLE_BOOK_WIDTHS[tier - 1];
  const height = READABLE_BOOK_HEIGHTS[tier - 1];
  const spine = Math.floor(width / 2);
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const corner = (row === 0 || row === height - 1) && (column === 0 || column === width - 1);
      const openNotch = tier >= 3 && row === 0 && column === spine;
      if (corner || openNotch) continue;
      const border = row === 0 || row === height - 1 || column === 0 || column === width - 1;
      const color = column === spine
        ? style.trim
        : border
          ? (column < spine ? style.coverDark : style.cover)
          : ((row + column) % 2 ? style.pages : style.pageShadow);
      S(x + column, y + row, color);
    }
  }
  S(x + Math.max(1, spine - 1), y + Math.floor(height / 2), style.rune);
  if (tier >= 2) {
    S(x + 1, y, style.trim);
    S(x + width - 2, y + height - 1, style.trim);
  }
  if (tier >= 3) {
    S(x + 1, y - 1, style.pages);
    S(x + width - 2, y - 1, style.pageShadow);
  }
  if (tier >= 4) {
    S(x, y + 1, style.trim);
    S(x + width - 1, y + height - 2, style.trim);
  }
  if (tier >= 5) S(x + spine, y + height, style.rune);
}

function drawReadableSpellbook(S, d, p, C) {
  if (C.weapon !== 'spellbook' || !C.weaponFollowRig) return false;
  const tier = straightBladeTier(C);
  const width = READABLE_BOOK_WIDTHS[tier - 1];
  const height = READABLE_BOOK_HEIGHTS[tier - 1];
  const style = readableBookStyle(tier);
  const strike = p.wep === 'strike';
  const wind = p.wep === 'wind';
  let x;
  let y;
  if (d === 'down') {
    x = 16;
    y = strike ? 22 - height : wind ? 13 - height : 15 - height;
  } else if (d === 'up') {
    x = 9 - width;
    y = strike ? 2 : wind ? 13 - height : 15 - height;
  } else {
    x = strike ? 23 - width : 16;
    y = strike ? 12 - Math.floor(height / 2) : wind ? 13 - height : 15 - height;
  }
  drawReadableBookShape(S, x, y, tier, style);
  return true;
}

function drawReadableMagic(S, R, d, p, C) {
  if (drawReadableStaff(S, R, d, p, C)) return true;
  if (drawReadableWand(S, R, d, p, C)) return true;
  if (drawReadableSpellbook(S, d, p, C)) return true;
  return false;
}

function drawTierTwoUpgrade(S, R, d, ph, C) {
  const w = C.weapon;
  const strike = ph === 'strike';
  const wind = ph === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (w === 'sword' || w === 'dagger') {
    const len = w === 'sword' ? 6 : 3;
    const gripSize = w === 'sword' ? 2 : 1;
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 12 : 13;
      const runeY = strike ? 16 : guardY - Math.max(2, len - 2);
      S(downX, runeY, TIER2.rune); S(downX + (strike ? -1 : 1), runeY, TIER2.edge);
      S(downX - 2, guardY, TIER2.gold); S(downX + 2, guardY, TIER2.gold);
      S(downX, guardY + (strike ? -1 : 1) * (gripSize + 1), TIER2.runeDark);
    } else if (d === 'up') {
      const guardY = strike ? 10 : wind ? 14 : 8 + len;
      const runeY = strike ? 5 : wind ? 17 : 10;
      S(upX, runeY, TIER2.rune); S(upX + 1, runeY, TIER2.edge);
      S(upX - 2, guardY, TIER2.gold); S(upX + 2, guardY, TIER2.gold);
      S(upX, guardY + gripSize + 1, TIER2.runeDark);
    } else if (strike) {
      S(19, 13, TIER2.rune); S(20, 12, TIER2.edge);
      S(15, 11, TIER2.gold); S(15, 15, TIER2.gold); S(12 - gripSize, 13, TIER2.runeDark);
    } else {
      const guardY = wind ? 11 : 14;
      const runeY = guardY - Math.max(2, len - 2);
      S(sideX, runeY, TIER2.rune); S(sideX + 1, runeY, TIER2.edge);
      S(sideX - 2, guardY, TIER2.gold); S(sideX + 2, guardY, TIER2.gold);
      S(sideX, guardY + gripSize + 1, TIER2.runeDark);
    }
  }

  if (w === 'greatsword') {
    if (d === 'down') {
      const guardY = strike ? 13 : wind ? 11 : 13;
      const runeY = strike ? 17 : wind ? 5 : 7;
      S(downX - 1, runeY, TIER2.rune); S(downX, runeY + (strike ? 1 : -1), TIER2.edge);
      S(downX - 3, guardY, TIER2.gold); S(downX + 3, guardY, TIER2.gold); S(downX, guardY, TIER2.runeDark);
    } else if (d === 'up') {
      const guardY = strike ? 10 : 14;
      S(upX - 1, strike ? 4 : 8, TIER2.rune); S(upX, strike ? 3 : 7, TIER2.edge);
      S(upX - 3, guardY, TIER2.gold); S(upX + 3, guardY, TIER2.gold); S(upX, guardY, TIER2.runeDark);
    } else if (strike) {
      S(18, 12, TIER2.rune); S(20, 13, TIER2.edge);
      S(13, 11, TIER2.gold); S(14, 16, TIER2.gold); S(14, 13, TIER2.runeDark);
    } else {
      const guardY = wind ? 11 : 14;
      S(sideX - 1, wind ? 4 : 7, TIER2.rune); S(sideX, wind ? 3 : 6, TIER2.edge);
      S(sideX - 3, guardY, TIER2.gold); S(sideX + 3, guardY, TIER2.gold); S(sideX, guardY, TIER2.runeDark);
    }
  }

  if (w === 'scimitar') {
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 11 : 13;
      S(downX + 1, strike ? 18 : wind ? 7 : 9, TIER2.gold);
      S(downX - 1, strike ? 20 : wind ? 5 : 7, TIER2.edge); S(downX, guardY, TIER2.ember);
    } else if (d === 'up') {
      S(upX + 1, strike ? 4 : 9, TIER2.gold); S(upX - 1, strike ? 1 : 7, TIER2.edge);
      S(upX, strike ? 9 : 14, TIER2.ember);
    } else if (strike) {
      S(19, 12, TIER2.gold); S(22, 11, TIER2.edge); S(15, 13, TIER2.ember);
    } else {
      S(sideX + 1, wind ? 8 : 10, TIER2.gold); S(sideX + 1, wind ? 5 : 7, TIER2.edge);
      S(sideX, wind ? 11 : 13, TIER2.ember);
    }
  }

  if (w === 'rapier') {
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 11 : 13;
      S(downX, strike ? 18 : wind ? 7 : 9, TIER2.rune); S(downX, strike ? 20 : wind ? 5 : 7, TIER2.edge);
      S(downX - 2, guardY + (strike ? -1 : 1), TIER2.gold); S(downX + 2, guardY + (strike ? -1 : 1), TIER2.gold);
    } else if (d === 'up') {
      const guardY = strike ? 9 : 14;
      S(upX, strike ? 4 : 10, TIER2.rune); S(upX, strike ? 1 : 7, TIER2.edge);
      S(upX - 2, guardY + 1, TIER2.gold); S(upX + 2, guardY + 1, TIER2.gold);
    } else if (strike) {
      S(19, 13, TIER2.rune); S(22, 13, TIER2.edge); S(14, 11, TIER2.gold); S(14, 15, TIER2.gold);
    } else {
      const guardY = wind ? 11 : 13;
      S(sideX, wind ? 7 : 9, TIER2.rune); S(sideX, wind ? 4 : 6, TIER2.edge);
      S(sideX - 2, guardY + 1, TIER2.gold); S(sideX + 2, guardY + 1, TIER2.gold);
    }
  }

  if (w === 'axe') {
    if (d === 'down') {
      const headY = strike ? 17 : wind ? 6 : 8;
      R(downX + 1, headY, 2, 3, METAL[0]); S(downX + 2, headY, TIER2.edge);
      S(downX - 3, headY + 1, TIER2.edge); S(downX, headY + 1, TIER2.runeDark);
    } else if (d === 'up') {
      const headY = strike ? 2 : 8;
      R(upX - 2, headY, 2, 3, METAL[0]); S(upX - 2, headY, TIER2.edge);
      S(upX + 3, headY + 1, TIER2.edge); S(upX, headY + 1, TIER2.runeDark);
    } else if (strike) {
      R(18, 14, 2, 2, METAL[0]); S(19, 15, TIER2.edge); S(19, 12, TIER2.runeDark);
    } else {
      const headY = wind ? 5 : 8;
      R(sideX - 1, headY, 1, 3, METAL[0]); S(sideX - 1, headY, TIER2.edge);
      S(sideX + 3, headY + 1, TIER2.edge); S(sideX, headY + 1, TIER2.runeDark);
    }
  }

  if (w === 'mace') {
    const spikes = (x, y, leftX = x - 3) => {
      S(x - 1, y - 2, TIER2.edge); S(x - 1, y + 2, TIER2.runeDark);
      S(leftX, y, TIER2.edge); S(x + 1, y, TIER2.runeDark); S(x - 1, y, TIER2.gold);
    };
    if (d === 'down') spikes(downX + 1, (strike ? 18 : wind ? 5 : 7) + 1);
    else if (d === 'up') spikes(upX + 1, (strike ? 2 : 6) + 1);
    else if (strike) spikes(21, 13);
    else spikes(sideX + 1, (wind ? 5 : 7) + 1, sideX - 1);
  }

  if (w === 'warhammer') {
    if (d === 'down') {
      const headY = strike ? 18 : wind ? 5 : 7;
      S(downX - 3, headY, TIER2.edge); S(downX + 3, headY + 1, TIER2.runeDark); S(downX, headY, TIER2.gold);
    } else if (d === 'up') {
      const headY = strike ? 1 : 6;
      S(upX - 3, headY + 1, TIER2.edge); S(upX + 3, headY + 2, TIER2.runeDark); S(upX, headY + 1, TIER2.gold);
    } else {
      const headX = strike ? 18 : sideX - 1;
      const headY = strike ? 11 : wind ? 5 : 7;
      S(strike ? headX - 1 : headX, headY, TIER2.edge); S(headX + 5, headY + 1, TIER2.runeDark); S(headX + 2, headY, TIER2.gold);
    }
  }

  if (w === 'spear') {
    if (d === 'down') {
      const tipY = strike ? 21 : 6;
      S(downX - 1, tipY, TIER2.rune); S(downX + 1, tipY, TIER2.rune); S(downX, strike ? 22 : 5, TIER2.edge);
    } else if (d === 'up') {
      const tipY = strike ? 1 : 7;
      S(upX - 1, tipY, TIER2.rune); S(upX + 1, tipY, TIER2.rune); S(upX, strike ? 0 : 6, TIER2.edge);
      if (strike) S(upX + 1, 4, TIER2.gold);
    } else if (strike) {
      S(21, 12, TIER2.rune); S(21, 14, TIER2.rune); S(22, 13, TIER2.edge);
    } else {
      const tipY = wind ? 5 : 6;
      S(sideX - 1, tipY, TIER2.rune); S(sideX + 1, tipY, TIER2.rune); S(sideX, tipY - 1, TIER2.edge);
    }
  }

  if (w === 'club') {
    const stud = (x, y, protectFace = false) => {
      S(x, y, TIER2.edge); S(x + 2, y, METAL[1]); S(x, y + 2, METAL[1]); S(x + 2, y + 2, TIER2.runeDark); S(x + 1, y + 1, TIER2.gold);
      S(x + 1, y - 1, METAL[0]); S(x + 3, y + 1, METAL[0]); S(x + 1, y + 3, METAL[1]);
      if (!protectFace) S(x - 1, y + 1, METAL[0]);
    };
    if (d === 'down') stud(16, strike ? 18 : 7);
    else if (d === 'up') stud(5, strike ? 3 : 13);
    else if (strike) stud(18, 12);
    else stud(sideX - 1, wind ? 5 : 7, true);
  }

  if (w === 'bow') {
    if (d === 'right') {
      S(16, 9, TIER2.gold); S(16, 16, TIER2.gold); S(17, 12, TIER2.rune);
      S(18, 8, TIER2.gold); S(18, 17, TIER2.gold);
      if (strike) { S(21, 13, TIER2.rune); S(22, 13, TIER2.edge); }
    } else if (d === 'down') {
      S(17, 9, TIER2.gold); S(17, 15, TIER2.gold); S(18, 12, TIER2.rune);
      S(16, 8, TIER2.gold); S(19, 9, TIER2.gold); S(16, 16, TIER2.gold); S(19, 15, TIER2.gold);
      if (strike) S(13, 21, TIER2.edge);
    } else {
      S(6, 9, TIER2.gold); S(6, 15, TIER2.gold); S(5, 12, TIER2.rune);
      S(7, 8, TIER2.gold); S(4, 9, TIER2.gold); S(7, 16, TIER2.gold); S(4, 15, TIER2.gold);
      if (strike) S(10, 0, TIER2.edge);
    }
  }

  if (w === 'crossbow') {
    if (d === 'down') {
      S(14, 10, TIER2.gold); S(20, 10, TIER2.gold); S(17, 11, TIER2.rune);
      S(14, 9, TIER2.gold); S(21, 9, TIER2.gold);
      if (strike) S(17, 22, TIER2.edge);
    } else if (d === 'up') {
      S(3, 10, TIER2.gold); S(9, 10, TIER2.gold); S(6, 11, TIER2.rune);
      S(2, 9, TIER2.gold); S(10, 9, TIER2.gold);
      if (strike) S(6, 1, TIER2.edge);
    } else {
      S(sideX - 1, 11, TIER2.gold); S(sideX + 3, 11, TIER2.gold); S(sideX + 1, 12, TIER2.rune);
      S(sideX - 1, 10, TIER2.gold); S(sideX + 4, 10, TIER2.gold); S(sideX - 1, 14, TIER2.gold); S(sideX + 4, 14, TIER2.gold);
      if (strike) S(sideX + 6, 13, TIER2.edge);
    }
  }

  if (w === 'staff') {
    if (d === 'down') {
      const orbY = strike ? 19 : 5;
      S(downX - 2, orbY, TIER2.gold); S(downX + 1, orbY + 1, TIER2.gold); S(downX - 1, orbY, TIER2.edge); S(downX + 2, orbY - 1, TIER2.rune);
    } else if (d === 'up') {
      const orbY = strike ? 0 : 6;
      S(upX - 2, orbY, TIER2.gold); S(upX + 1, orbY + 1, TIER2.gold); S(upX - 1, orbY, TIER2.edge); S(upX + 2, orbY, TIER2.rune);
      if (strike) S(upX + 1, 5, TIER2.gold);
    } else if (strike) {
      S(19, 11, TIER2.gold); S(21, 14, TIER2.gold); S(20, 12, TIER2.edge); S(23, 11, TIER2.rune);
    } else {
      const orbY = 5;
      S(sideX - 1, orbY, TIER2.gold); S(sideX + 1, orbY + 1, TIER2.gold); S(sideX, orbY, TIER2.edge); S(sideX + 2, orbY - 1, TIER2.rune);
    }
  }

  if (w === 'wand') {
    if (d === 'down') {
      const gemY = strike ? 18 : 8;
      S(downX - 2, gemY, TIER2.gold); S(downX + 1, gemY + 1, TIER2.gold); S(downX - 1, gemY, TIER2.edge); S(downX + 2, gemY - 1, TIER2.rune);
    } else if (d === 'up') {
      const gemY = strike ? 1 : 8;
      S(upX - 2, gemY, TIER2.gold); S(upX + 1, gemY + 1, TIER2.gold); S(upX - 1, gemY, TIER2.edge); S(upX + 2, gemY - 1, TIER2.rune);
      if (strike) S(upX + 1, 5, TIER2.gold);
    } else if (strike) {
      S(19, 11, TIER2.gold); S(21, 14, TIER2.gold); S(20, 12, TIER2.edge); S(23, 13, TIER2.rune);
    } else {
      const gemY = wind ? 6 : 8;
      S(sideX - 1, gemY, TIER2.gold); S(sideX + 1, gemY + 1, TIER2.gold); S(sideX, gemY, TIER2.edge); S(sideX + 2, gemY - 1, TIER2.rune);
    }
  }

  if (w === 'spellbook') {
    const gild = (x, y, protectFace = false) => {
      S(x, y, TIER2.gold); S(x + 3, y, TIER2.gold); S(x, y + 3, TIER2.gold); S(x + 3, y + 3, TIER2.gold);
      S(x + 1, y + 1, TIER2.rune); S(x + 2, y + 2, TIER2.edge);
      S(x + 4, y + 2, TIER2.gold);
      if (!protectFace) S(x - 1, y + 1, TIER2.gold);
    };
    if (d === 'down') { gild(15, 11); if (strike) { S(14, 17, TIER2.rune); S(20, 18, TIER2.edge); } }
    else if (d === 'up') { gild(5, 11); if (strike) { S(4, 8, TIER2.rune); S(10, 6, TIER2.edge); } }
    else { gild(sideX - 1, 11, true); if (strike) { S(sideX + 4, 9, TIER2.rune); S(sideX + 6, 12, TIER2.edge); } }
  }
}

function drawTierThreeUpgrade(S, R, d, ph, C) {
  const w = C.weapon;
  const strike = ph === 'strike';
  const wind = ph === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (w === 'sword' || w === 'dagger') {
    const len = w === 'sword' ? 6 : 3;
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 12 : 13;
      S(downX - 3, guardY, TIER3.astral); S(downX + 3, guardY, TIER3.astral);
      S(downX + (strike ? 1 : -1), strike ? 18 : guardY - Math.max(2, len - 1), TIER3.core);
    } else if (d === 'up') {
      const guardY = strike ? 10 : wind ? 14 : 8 + len;
      S(upX - 3, guardY, TIER3.astral); S(upX + 3, guardY, TIER3.astral);
      S(upX - 1, strike ? 5 : wind ? 17 : 9, TIER3.core);
      if (strike) S(upX + 2, 5, TIER3.astralDark);
    } else if (strike) {
      const tipX = Math.min(23, 16 + len);
      S(tipX, 13, TIER3.core); S(14, 16, TIER3.astral); S(13, 14, TIER3.astralDark);
    } else {
      const guardY = wind ? 11 : 14;
      S(sideX - 3, guardY, TIER3.astral); S(sideX + 3, guardY, TIER3.astral);
      S(sideX + 1, guardY - Math.max(2, len - 1), TIER3.core);
    }
  }

  if (w === 'greatsword') {
    if (d === 'down') {
      const guardY = strike ? 13 : wind ? 11 : 13;
      S(downX - 4, guardY, TIER3.astral); S(downX + 4, guardY, TIER3.astral);
      S(downX + 1, strike ? 19 : wind ? 3 : 5, TIER3.core);
    } else if (d === 'up') {
      const guardY = strike ? 10 : 14;
      S(upX - 4, guardY, TIER3.astral); S(upX + 4, guardY, TIER3.astral);
      S(upX + 1, strike ? 5 : 6, TIER3.core); if (strike) S(upX + 2, 5, TIER3.astralDark);
    } else if (strike) {
      S(23, 13, TIER3.core); S(13, 12, TIER3.astral); S(14, 17, TIER3.astralDark);
    } else {
      const guardY = wind ? 11 : 14;
      S(sideX - 4, guardY, TIER3.astral); S(sideX + 4, guardY, TIER3.astral);
      S(sideX + 1, wind ? 2 : 5, TIER3.core);
    }
  }

  if (w === 'scimitar') {
    if (d === 'down') {
      const bladeY = strike ? 19 : wind ? 6 : 8;
      S(downX + 2, bladeY, TIER3.flame); S(downX - 2, bladeY + (strike ? 2 : -1), TIER3.core);
      S(downX + 3, strike ? 16 : wind ? 9 : 11, TIER3.astral);
    } else if (d === 'up') {
      const bladeY = strike ? 4 : 9;
      S(upX + 2, bladeY, TIER3.flame); S(upX - 2, strike ? 2 : 7, TIER3.core);
      if (strike) S(upX + 2, 6, TIER3.astral);
    } else if (strike) {
      S(23, 11, TIER3.core); S(21, 15, TIER3.flame); S(17, 11, TIER3.astral);
    } else {
      const bladeY = wind ? 7 : 9;
      S(sideX + 2, bladeY, TIER3.flame); S(sideX + 2, bladeY - 3, TIER3.core);
      S(sideX + 3, wind ? 10 : 12, TIER3.astral);
    }
  }

  if (w === 'rapier') {
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 11 : 13;
      S(downX - 3, guardY + (strike ? -1 : 1), TIER3.astral); S(downX + 3, guardY + (strike ? -1 : 1), TIER3.astral);
      S(downX + 1, strike ? 21 : wind ? 4 : 6, TIER3.core);
    } else if (d === 'up') {
      const guardY = strike ? 9 : 14;
      S(upX - 3, guardY + 1, TIER3.astral); S(upX + 3, guardY + 1, TIER3.astral);
      S(upX + 1, strike ? 4 : 7, TIER3.core); if (strike) S(upX + 2, 5, TIER3.astralDark);
    } else if (strike) {
      S(23, 13, TIER3.core); S(14, 16, TIER3.astral); S(13, 13, TIER3.astralDark);
    } else {
      const guardY = wind ? 11 : 13;
      S(sideX - 3, guardY + 1, TIER3.astral); S(sideX + 3, guardY + 1, TIER3.astral);
      S(sideX + 1, wind ? 3 : 5, TIER3.core);
    }
  }

  if (w === 'axe') {
    if (d === 'down') {
      const headY = strike ? 17 : wind ? 6 : 8;
      S(downX - 3, headY + 1, TIER3.storm); S(downX + 3, headY + 1, TIER3.storm);
      S(downX, headY - 1, TIER3.core); S(downX, headY + 3, TIER3.astralDark);
    } else if (d === 'up') {
      const headY = strike ? 2 : 8;
      S(upX - 3, headY + 1, TIER3.storm); S(upX + 4, headY + 1, TIER3.storm);
      S(upX, headY - 1, TIER3.core); S(upX, headY + 3, TIER3.astralDark);
      if (strike) S(upX + 2, 6, TIER3.storm);
    } else if (strike) {
      S(20, 10, TIER3.core); S(21, 16, TIER3.storm); S(17, 15, TIER3.astralDark);
    } else {
      const headY = wind ? 5 : 8;
      S(sideX + 4, headY + 1, TIER3.storm); S(sideX + 1, headY - 1, TIER3.core);
      S(sideX + 1, headY + 3, TIER3.astralDark);
    }
  }

  if (w === 'mace') {
    const comet = (x, y, protectFace = false) => {
      if (!protectFace) { S(x - 3, y - 2, TIER3.astral); S(x - 3, y + 2, TIER3.storm); }
      S(x + 1, y - 2, TIER3.core); S(x + 1, y + 2, TIER3.astralDark);
      S(x + 2, y, TIER3.flame);
    };
    if (d === 'down') comet(downX + 1, (strike ? 18 : wind ? 5 : 7) + 1);
    else if (d === 'up') { comet(upX + 1, (strike ? 2 : 6) + 1); if (strike) S(upX + 2, 6, TIER3.astral); }
    else if (strike) comet(21, 13);
    else comet(sideX + 1, (wind ? 5 : 7) + 1, true);
  }

  if (w === 'warhammer') {
    if (d === 'down') {
      const headY = strike ? 18 : wind ? 5 : 7;
      S(downX - 2, headY - 1, TIER3.core); S(downX + 2, headY - 1, TIER3.storm);
      S(downX - 2, headY + 2, TIER3.astral); S(downX + 2, headY + 2, TIER3.astralDark);
    } else if (d === 'up') {
      const headY = strike ? 1 : 6;
      S(upX - 2, headY - 1, TIER3.core); S(upX + 2, headY - 1, TIER3.storm);
      S(upX - 2, headY + 2, TIER3.astral); S(upX + 2, headY + 2, TIER3.astralDark);
      if (strike) S(upX + 2, 6, TIER3.storm);
    } else {
      const headX = strike ? 18 : sideX - 1;
      const headY = strike ? 11 : wind ? 5 : 7;
      S(headX + 1, headY - 1, TIER3.core); S(headX + 3, headY - 1, TIER3.storm);
      S(headX + 1, headY + 2, TIER3.astral); S(headX + 3, headY + 2, TIER3.astralDark);
    }
  }

  if (w === 'spear') {
    if (d === 'down') {
      const tipY = strike ? 21 : 6;
      S(downX - 2, tipY, TIER3.astral); S(downX + 2, tipY, TIER3.astral);
      S(downX, strike ? 19 : 8, TIER3.core);
    } else if (d === 'up') {
      const tipY = strike ? 1 : 7;
      S(upX - 2, tipY, TIER3.astral); S(upX + 2, tipY, TIER3.astral);
      S(upX, strike ? 5 : 9, TIER3.core); if (strike) S(upX + 2, 5, TIER3.astralDark);
    } else if (strike) {
      S(21, 11, TIER3.astral); S(21, 15, TIER3.astral); S(20, 13, TIER3.core);
    } else {
      const tipY = wind ? 5 : 6;
      S(sideX + 2, tipY, TIER3.astral); S(sideX + 1, tipY - 2, TIER3.astral);
      S(sideX + 1, tipY + 1, TIER3.core);
    }
  }

  if (w === 'club') {
    const titan = (x, y, protectFace = false) => {
      if (!protectFace) { S(x - 2, y - 1, TIER3.core); S(x - 2, y + 3, TIER3.astralDark); }
      S(x + 4, y - 1, TIER3.core); S(x + 4, y + 3, TIER3.astral);
      S(x + 1, y - 2, TIER3.storm); S(x + 1, y + 4, TIER3.flame);
    };
    if (d === 'down') titan(16, strike ? 18 : 7);
    else if (d === 'up') { titan(5, strike ? 3 : 13); if (strike) S(upX + 2, 6, TIER3.astral); }
    else if (strike) titan(18, 12);
    else titan(sideX - 1, wind ? 5 : 7, true);
  }

  if (w === 'bow') {
    if (d === 'right') {
      S(19, 7, TIER3.astral); S(20, 8, TIER3.core); S(19, 18, TIER3.astral); S(20, 17, TIER3.core);
      S(19, 12, TIER3.storm); if (strike) S(23, 13, TIER3.flame);
    } else if (d === 'down') {
      S(15, 7, TIER3.astral); S(20, 8, TIER3.core); S(15, 17, TIER3.astral); S(20, 16, TIER3.core);
      S(19, 12, TIER3.storm); if (strike) S(12, 22, TIER3.flame);
    } else {
      S(8, 7, TIER3.astral); S(3, 8, TIER3.core); S(8, 17, TIER3.astral); S(3, 16, TIER3.core);
      S(4, 12, TIER3.storm); if (strike) S(11, 1, TIER3.flame);
    }
  }

  if (w === 'crossbow') {
    if (d === 'down') {
      S(12, 8, TIER3.astral); S(22, 8, TIER3.astral); S(14, 8, TIER3.core); S(20, 8, TIER3.core);
      S(17, 12, TIER3.flame); if (strike) S(16, 23, TIER3.flame);
    } else if (d === 'up') {
      S(1, 8, TIER3.astral); S(11, 8, TIER3.astral); S(3, 8, TIER3.core); S(9, 8, TIER3.core);
      S(6, 12, TIER3.flame); if (strike) S(upX + 2, 5, TIER3.astralDark);
    } else {
      S(sideX - 1, 9, TIER3.astral); S(sideX + 5, 9, TIER3.astral);
      S(sideX - 1, 15, TIER3.core); S(sideX + 5, 15, TIER3.core); S(sideX + 2, 12, TIER3.flame);
    }
  }

  if (w === 'staff') {
    if (d === 'down') {
      const orbY = strike ? 19 : 5;
      S(downX - 3, orbY - 1, TIER3.astral); S(downX + 3, orbY, TIER3.astral);
      S(downX, orbY - 2, TIER3.core); S(downX + 1, orbY + 2, TIER3.storm);
    } else if (d === 'up') {
      const orbY = strike ? 0 : 6;
      S(upX - 3, orbY, TIER3.astral); S(upX + 3, orbY + 1, TIER3.astral);
      S(upX, orbY - 1, TIER3.core); S(upX + 1, strike ? 5 : orbY + 2, TIER3.storm);
    } else if (strike) {
      S(19, 10, TIER3.astral); S(22, 15, TIER3.astral); S(21, 11, TIER3.core); S(23, 16, TIER3.storm);
    } else {
      S(sideX - 1, 4, TIER3.astral); S(sideX + 3, 5, TIER3.astral);
      S(sideX + 1, 3, TIER3.core); S(sideX + 2, 7, TIER3.storm);
    }
  }

  if (w === 'wand') {
    if (d === 'down') {
      const gemY = strike ? 18 : 8;
      S(downX - 3, gemY - 1, TIER3.astral); S(downX + 3, gemY, TIER3.astral);
      S(downX, gemY - 2, TIER3.core); S(downX + 1, gemY + 2, TIER3.flame);
    } else if (d === 'up') {
      const gemY = strike ? 1 : 8;
      S(upX - 3, gemY, TIER3.astral); S(upX + 3, gemY + 1, TIER3.astral);
      S(upX, gemY - 1, TIER3.core); S(upX + 1, strike ? 5 : gemY + 2, TIER3.flame);
    } else if (strike) {
      S(19, 10, TIER3.astral); S(22, 15, TIER3.astral); S(21, 11, TIER3.core); S(23, 16, TIER3.flame);
    } else {
      const gemY = wind ? 6 : 8;
      S(sideX - 1, gemY - 1, TIER3.astral); S(sideX + 3, gemY, TIER3.astral);
      S(sideX + 1, gemY - 2, TIER3.core); S(sideX + 2, gemY + 2, TIER3.flame);
    }
  }

  if (w === 'spellbook') {
    const eternal = (x, y, protectFace = false) => {
      if (!protectFace) S(x - 2, y, TIER3.astral);
      S(x + 5, y + 1, TIER3.astral); S(x - 1, y + 4, TIER3.core); S(x + 4, y + 4, TIER3.core);
      S(x + 1, y - 2, TIER3.storm); S(x + 3, y - 1, TIER3.flame);
    };
    if (d === 'down') eternal(15, 11);
    else if (d === 'up') eternal(5, 11);
    else eternal(sideX - 1, 11, true);
    if (strike) {
      if (d === 'down') { S(13, 18, TIER3.astral); S(21, 17, TIER3.core); }
      else if (d === 'up') { S(3, 7, TIER3.astral); S(11, 5, TIER3.core); }
      else { S(sideX + 4, 8, TIER3.astral); S(sideX + 6, 15, TIER3.core); }
    }
  }
}

function drawTierFourUpgrade(S, R, d, ph, C) {
  const w = C.weapon;
  const strike = ph === 'strike';
  const wind = ph === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  if (w === 'sword' || w === 'dagger') {
    const dagger = w === 'dagger';
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 12 : 13;
      if (strike) {
        const startY = dagger ? 18 : 21;
        const endY = dagger ? 22 : 23;
        R(downX, startY, 1, endY - startY + 1, TIER4.frost); S(downX + 1, endY, TIER4.core);
      } else {
        const tipY = dagger ? (wind ? 4 : 5) : (wind ? 1 : 2);
        const endY = dagger ? (wind ? 8 : 9) : (wind ? 5 : 6);
        R(downX, tipY + 1, 1, endY - tipY, TIER4.frost); S(downX, tipY, TIER4.core);
      }
      S(downX - 4, guardY, TIER4.mythic); S(downX + 4, guardY, TIER4.mythic);
    } else if (d === 'up') {
      const guardY = strike ? 10 : wind ? 14 : dagger ? 11 : 14;
      if (strike) {
        R(upX + 1, 2, 1, 7, TIER4.frost); S(upX + 2, 2, TIER4.core); S(upX + 2, 6, TIER4.void);
      } else if (wind) {
        R(upX, 18, 1, 4, TIER4.frost); S(upX, 22, TIER4.core);
      } else {
        const tipY = dagger ? 4 : 2;
        R(upX, tipY + 1, 1, 5, TIER4.frost); S(upX, tipY, TIER4.core);
      }
      S(upX - 4, guardY, TIER4.mythic); S(upX + 4, guardY, TIER4.mythic);
    } else if (strike) {
      const startX = dagger ? 20 : 21;
      R(startX, 12, 24 - startX, 2, TIER4.frost); S(23, 12, TIER4.core);
      R(dagger ? 10 : 8, 13, dagger ? 4 : 6, 1, TIER4.void);
    } else {
      const tipY = dagger ? (wind ? 3 : 5) : 2;
      const endY = dagger ? (wind ? 8 : 10) : (wind ? 4 : 7);
      R(sideX, tipY + 1, 1, endY - tipY, TIER4.frost); S(sideX, tipY, TIER4.core);
      R(sideX, 18, 1, 4, TIER4.void); S(sideX + 1, 21, TIER4.mythic);
    }
  }

  if (w === 'greatsword') {
    if (d === 'down') {
      const guardY = strike ? 13 : wind ? 11 : 13;
      if (strike) { R(downX - 1, 22, 2, 2, TIER4.frost); S(downX, 23, TIER4.core); }
      else { R(downX - 1, wind ? 0 : 2, 2, wind ? 2 : 2, TIER4.frost); S(downX - 1, wind ? 0 : 2, TIER4.core); }
      S(downX - 5, guardY, TIER4.mythic); S(downX + 5, guardY, TIER4.mythic);
    } else if (d === 'up') {
      const guardY = strike ? 10 : 14;
      if (strike) { R(upX + 1, 2, 2, 7, TIER4.frost); S(upX + 2, 2, TIER4.core); }
      else { R(upX - 1, 2, 2, 3, TIER4.frost); S(upX, 2, TIER4.core); }
      S(upX - 5, guardY, TIER4.mythic); S(upX + 5, guardY, TIER4.mythic);
    } else if (strike) {
      R(21, 11, 3, 3, TIER4.frost); S(23, 12, TIER4.core); R(8, 13, 6, 1, TIER4.void);
    } else {
      R(sideX - 1, 2, 2, wind ? 2 : 3, TIER4.frost); S(sideX, 2, TIER4.core);
      R(sideX - 1, 18, 2, 4, TIER4.void); S(sideX, 21, TIER4.mythic);
    }
  }

  if (w === 'scimitar') {
    if (d === 'down') {
      if (strike) { S(downX - 2, 23, TIER4.core); R(downX + 1, 20, 1, 3, TIER4.plasma); }
      else { R(downX, wind ? 2 : 3, 1, 4, TIER4.frost); S(downX - 1, wind ? 1 : 2, TIER4.core); S(downX + 1, wind ? 3 : 4, TIER4.plasma); }
      S(downX + 4, strike ? 17 : wind ? 9 : 11, TIER4.mythic);
    } else if (d === 'up') {
      if (strike) { R(upX + 1, 2, 1, 6, TIER4.frost); S(upX + 2, 2, TIER4.core); }
      else { R(upX, 3, 1, 4, TIER4.frost); S(upX - 1, 2, TIER4.core); }
      S(upX + 3, strike ? 6 : 10, TIER4.plasma);
    } else if (strike) {
      R(20, 10, 4, 2, TIER4.frost); S(23, 10, TIER4.core); R(9, 13, 6, 1, TIER4.void);
    } else {
      R(sideX, 2, 1, wind ? 3 : 4, TIER4.frost); S(sideX + 1, 2, TIER4.core);
      R(sideX, 18, 1, 4, TIER4.void); S(sideX + 1, 21, TIER4.plasma);
    }
  }

  if (w === 'rapier') {
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 11 : 13;
      if (strike) { R(downX, 21, 1, 3, TIER4.frost); S(downX, 23, TIER4.core); }
      else { R(downX, wind ? 1 : 2, 1, wind ? 3 : 4, TIER4.frost); S(downX, wind ? 1 : 2, TIER4.core); }
      S(downX - 4, guardY + 1, TIER4.mythic); S(downX + 4, guardY + 1, TIER4.mythic);
    } else if (d === 'up') {
      const guardY = strike ? 9 : 14;
      if (strike) { R(upX + 1, 2, 1, 7, TIER4.frost); S(upX + 1, 2, TIER4.core); }
      else { R(upX, 2, 1, 5, TIER4.frost); S(upX, 2, TIER4.core); }
      S(upX - 4, guardY + 1, TIER4.mythic); S(upX + 4, guardY + 1, TIER4.mythic);
    } else if (strike) {
      R(20, 12, 4, 2, TIER4.frost); S(23, 13, TIER4.core); R(8, 13, 6, 1, TIER4.void);
    } else {
      R(sideX, 2, 1, wind ? 2 : 4, TIER4.frost); S(sideX, 2, TIER4.core);
      R(sideX, 17, 1, 5, TIER4.void); S(sideX + 1, 21, TIER4.mythic);
    }
  }

  if (w === 'axe') {
    if (d === 'down') {
      const headY = strike ? 17 : wind ? 6 : 8;
      if (strike) R(downX, 21, 1, 3, TIER4.void); else R(downX, 14, 1, 8, TIER4.void);
      S(downX - 5, headY + 1, TIER4.frost); S(downX + 4, headY + 1, TIER4.frost); S(downX, headY - 2, TIER4.core);
    } else if (d === 'up') {
      const headY = strike ? 2 : 8;
      R(upX, strike ? 6 : 14, 1, strike ? 9 : 8, TIER4.void);
      S(upX - 4, headY + 1, TIER4.frost); S(upX + 5, headY + 1, TIER4.frost); S(upX, strike ? 6 : headY - 2, TIER4.core);
    } else if (strike) {
      R(9, 13, 6, 1, TIER4.void); R(21, 9, 3, 8, TIER4.frost); S(23, 12, TIER4.core);
    } else {
      R(sideX, 14, 1, 8, TIER4.void); S(sideX + 5, wind ? 6 : 9, TIER4.frost);
      S(sideX + 1, wind ? 2 : 5, TIER4.core);
    }
  }

  if (w === 'mace') {
    if (d === 'down') {
      const headY = strike ? 19 : wind ? 6 : 8;
      R(downX, strike ? 12 : 13, 1, strike ? 6 : 9, TIER4.void);
      S(downX - (strike ? 4 : 3), headY, TIER4.plasma); S(downX + 4, headY, TIER4.plasma); S(downX, headY - 4, TIER4.core); S(downX, Math.min(23, headY + 4), TIER4.frost);
    } else if (d === 'up') {
      const headY = strike ? 3 : 7;
      R(upX, strike ? 6 : 13, 1, strike ? 9 : 9, TIER4.void);
      S(upX - 4, headY, TIER4.plasma); S(upX + 4, headY, TIER4.plasma); S(upX, strike ? 6 : headY - 4, TIER4.core);
    } else if (strike) {
      R(8, 13, 8, 1, TIER4.void); S(23, 13, TIER4.core); S(21, 8, TIER4.plasma); S(21, 18, TIER4.frost);
    } else {
      R(sideX, 13, 1, 9, TIER4.void); S(sideX + 5, wind ? 6 : 8, TIER4.plasma);
      S(sideX + 1, wind ? 2 : 4, TIER4.core); S(sideX + 1, wind ? 11 : 13, TIER4.frost);
    }
  }

  if (w === 'warhammer') {
    if (d === 'down') {
      const headY = strike ? 18 : wind ? 5 : 7;
      R(downX, strike ? 12 : 13, 1, strike ? 6 : 9, TIER4.void);
      R(downX - 2, headY - 1, 9, 4, TIER4.frost); R(downX - 1, headY, 6, 2, TIER4.void); S(downX + 2, headY, TIER4.core);
    } else if (d === 'up') {
      const headY = strike ? 1 : 6;
      R(upX, strike ? 5 : 13, 1, strike ? 10 : 9, TIER4.void);
      R(upX - 4, Math.max(0, headY - 1), 9, 4, TIER4.frost); R(upX - 2, headY, 5, 2, TIER4.void); S(upX, strike ? 5 : headY, TIER4.core);
    } else if (strike) {
      R(8, 13, 8, 1, TIER4.void); R(20, 8, 4, 8, TIER4.frost); R(21, 10, 3, 4, TIER4.void); S(22, 11, TIER4.core);
    } else {
      R(sideX, 13, 1, 9, TIER4.void); R(sideX + 1, wind ? 3 : 5, 7, 5, TIER4.frost);
      R(sideX + 2, wind ? 4 : 6, 5, 3, TIER4.void); S(sideX + 4, wind ? 5 : 7, TIER4.core);
    }
  }

  if (w === 'spear') {
    if (d === 'down') {
      R(downX, 2, 1, 20, TIER4.void); S(downX, 2, TIER4.core); S(downX - 3, strike ? 21 : 5, TIER4.plasma); S(downX + 3, strike ? 21 : 5, TIER4.plasma);
      if (strike) S(downX, 23, TIER4.core);
    } else if (d === 'up') {
      R(upX, 2, 1, 20, TIER4.void); S(upX, 2, TIER4.core); S(upX - 3, strike ? 3 : 6, TIER4.plasma); S(upX + 3, strike ? 3 : 6, TIER4.plasma);
      if (strike) S(upX + 2, 6, TIER4.frost);
    } else if (strike) {
      R(8, 13, 16, 1, TIER4.void); S(23, 13, TIER4.core); S(22, 10, TIER4.plasma); S(22, 16, TIER4.plasma);
    } else {
      R(sideX, 2, 1, 20, TIER4.void); S(sideX, 2, TIER4.core); S(sideX + 3, wind ? 5 : 6, TIER4.plasma);
      S(sideX + 2, wind ? 2 : 3, TIER4.frost); S(sideX + 1, 21, TIER4.mythic);
    }
  }

  if (w === 'club') {
    if (d === 'down') {
      const headY = strike ? 18 : 7;
      R(downX, strike ? 12 : 13, 1, strike ? 7 : 9, TIER4.void);
      R(14, Math.max(2, headY - 3), 7, 7, TIER4.mythic); R(15, Math.max(3, headY - 2), 5, 5, WOOD[0]); S(downX, headY, TIER4.core);
    } else if (d === 'up') {
      const headY = strike ? 3 : 13;
      R(upX, strike ? 6 : 10, 1, strike ? 10 : 12, TIER4.void);
      R(3, Math.max(2, headY - 3), 7, 7, TIER4.mythic); R(4, Math.max(3, headY - 2), 5, 5, WOOD[0]); S(upX, strike ? 6 : headY, TIER4.core);
    } else if (strike) {
      R(8, 13, 10, 1, TIER4.void); R(17, 9, 7, 8, TIER4.mythic); R(18, 10, 6, 6, WOOD[0]); S(22, 12, TIER4.core);
    } else {
      R(sideX, 13, 1, 9, TIER4.void); R(sideX + 1, wind ? 2 : 4, 7, 8, TIER4.mythic);
      R(sideX + 2, wind ? 3 : 5, 6, 6, WOOD[0]); S(sideX + 4, wind ? 5 : 7, TIER4.core);
    }
  }

  if (w === 'bow') {
    if (d === 'right') {
      R(20, 3, 1, 19, TIER4.mythic); S(19, 2, TIER4.core); S(19, 22, TIER4.core); R(19, 4, 1, 17, TIER4.frost);
      if (strike) R(18, 13, 6, 1, TIER4.plasma);
    } else if (d === 'down') {
      R(21, 4, 1, 17, TIER4.mythic); S(20, 3, TIER4.core); S(20, 21, TIER4.core); R(20, 5, 1, 15, TIER4.frost);
      if (strike) R(12, 18, 1, 6, TIER4.plasma);
    } else {
      R(2, 4, 1, 17, TIER4.mythic); S(3, 3, TIER4.core); S(3, 21, TIER4.core); R(3, 5, 1, 15, TIER4.frost);
      if (strike) R(10, 0, 1, 7, TIER4.plasma);
    }
  }

  if (w === 'crossbow') {
    if (d === 'down') {
      R(10, 13, 14, 3, TIER4.mythic); R(11, 14, 12, 1, TIER4.void); R(downX, 2, 1, 20, TIER4.frost); S(downX, 2, TIER4.core);
      if (strike) S(downX, 23, TIER4.plasma);
    } else if (d === 'up') {
      R(0, 7, 14, 3, TIER4.mythic); R(1, 8, 12, 1, TIER4.void); R(upX, 2, 1, 20, TIER4.frost); S(upX, 2, TIER4.core);
      if (strike) S(upX + 2, 6, TIER4.plasma);
    } else {
      R(sideX - 1, 6, 2, 16, TIER4.mythic); R(sideX, 7, 1, 14, TIER4.void); R(sideX + 1, 12, 7, 2, TIER4.frost);
      S(23, 12, TIER4.core); S(sideX + 6, 15, TIER4.plasma);
    }
  }

  if (w === 'staff') {
    if (d === 'down') {
      R(downX, 2, 1, 20, TIER4.void); S(downX, 21, TIER4.mythic); R(downX - 3, 2, 7, 3, TIER4.plasma); S(downX, 1, TIER4.core);
      if (strike) { S(downX - 5, 20, TIER4.frost); S(downX + 5, 18, TIER4.frost); }
    } else if (d === 'up') {
      R(upX, 2, 1, 20, TIER4.void); S(upX, 21, TIER4.mythic); R(upX - 3, 2, 7, 3, TIER4.plasma); S(upX, 1, TIER4.core);
      if (strike) S(upX + 3, 6, TIER4.frost);
    } else if (strike) {
      R(8, 13, 16, 1, TIER4.void); S(23, 13, TIER4.core); S(22, 8, TIER4.plasma); S(22, 18, TIER4.frost);
    } else {
      R(sideX, 2, 1, 20, TIER4.void); S(sideX, 21, TIER4.mythic); R(sideX - 1, 2, 6, 3, TIER4.plasma);
      S(sideX + 1, 1, TIER4.core); S(sideX + 5, wind ? 6 : 8, TIER4.frost);
    }
  }

  if (w === 'wand') {
    if (d === 'down') {
      R(downX, 4, 1, 18, TIER4.void); S(downX, 21, TIER4.mythic); R(downX - 2, 2, 5, 4, TIER4.plasma); S(downX, 1, TIER4.core);
      if (strike) S(downX + 5, 20, TIER4.frost);
    } else if (d === 'up') {
      R(upX, 4, 1, 18, TIER4.void); S(upX, 21, TIER4.mythic); R(upX - 2, 2, 5, 4, TIER4.plasma); S(upX, 1, TIER4.core);
      if (strike) S(upX + 3, 6, TIER4.frost);
    } else if (strike) {
      R(9, 13, 15, 1, TIER4.void); S(23, 13, TIER4.core); S(22, 9, TIER4.plasma); S(22, 17, TIER4.frost);
    } else {
      R(sideX, 3, 1, 19, TIER4.void); S(sideX, 21, TIER4.mythic); R(sideX - 1, 2, 5, 4, TIER4.plasma);
      S(sideX + 1, 1, TIER4.core); S(sideX + 5, wind ? 7 : 9, TIER4.frost);
    }
  }

  if (w === 'spellbook') {
    if (d === 'down') {
      R(15, 8, 9, 9, TIER4.void); R(16, 9, 7, 7, BOOK[0]); S(15, 8, TIER4.core); S(23, 16, TIER4.core);
      R(22, 2, 1, 20, TIER4.plasma); if (strike) R(11, 18, 12, 1, TIER4.frost);
    } else if (d === 'up') {
      R(2, 8, 9, 9, TIER4.void); R(3, 9, 7, 7, BOOK[0]); S(2, 8, TIER4.core); S(10, 16, TIER4.core);
      R(1, 2, 1, 20, TIER4.plasma); if (strike) R(1, 6, 12, 1, TIER4.frost);
    } else {
      R(sideX - 1, 8, 8, 9, TIER4.void); R(sideX, 9, 7, 7, BOOK[0]); S(sideX - 1, 8, TIER4.core); S(sideX + 6, 16, TIER4.core);
      R(sideX + 6, 2, 1, 20, TIER4.plasma); if (strike) R(sideX, 18, 7, 1, TIER4.frost);
    }
  }
}

function drawTierFiveUpgrade(S, R, d, ph, C) {
  const w = C.weapon;
  const TIER5 = TIER5_THEMES[w];
  const strike = ph === 'strike';
  const wind = ph === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);
  const drawRune = (x, y) => {
    S(x, y - 1, TIER5.apex); S(x - 1, y, TIER5.divine);
    S(x + 1, y, TIER5.cosmic); S(x, y + 1, TIER5.rift);
  };
  const drawOrbit = (x, y, wide = false) => {
    const dx = wide ? 3 : 2;
    S(x, y - 2, TIER5.apex); S(x - dx, y, TIER5.cosmic);
    S(x + dx, y, TIER5.rift); S(x, y + 2, TIER5.divine);
  };
  const drawWorldroot = (left, top, width) => {
    R(left + 2, top, width - 4, 1, TIER5.abyss);
    R(left + 1, top + 1, width - 2, 2, TIER5.abyss);
    R(left, top + 3, width, 3, TIER5.abyss);
    R(left + 1, top + 6, width - 2, 3, TIER5.abyss);
    R(left + 2, top + 9, width - 4, 2, TIER5.abyss);
    R(left + 2, top + 1, width - 4, 2, WOOD[0]);
    R(left + 1, top + 3, width - 2, 3, WOOD[0]);
    R(left + 2, top + 6, width - 4, 3, WOOD[0]);
    R(left + 3, top + 9, Math.max(2, width - 6), 1, WOOD[1]);
    S(left, top + 2, TIER5.cosmic); S(left + width - 1, top + 1, TIER5.divine);
    S(left + 1, top + 7, TIER5.rift); S(left + width - 2, top + 5, TIER5.cosmic);
    S(left + Math.floor(width / 2), top + 3, TIER5.apex);
  };

  if (w === 'sword') {
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 12 : 13;
      if (strike) {
        S(downX - 1, 22, TIER5.cosmic); S(downX, 23, TIER5.apex);
        S(downX + 1, 22, TIER5.rift); S(downX - 2, 21, TIER5.divine);
      } else {
        const tipY = wind ? 0 : 2;
        S(downX - 1, tipY, TIER5.cosmic); S(downX, tipY, TIER5.apex);
        S(downX + 1, tipY, TIER5.rift); S(downX, tipY + 2, TIER5.divine);
      }
      S(downX - 5, guardY, TIER5.divine); S(downX + 5, guardY, TIER5.divine);
      drawRune(downX + 3, guardY + (strike ? -3 : -3));
    } else if (d === 'up') {
      const guardY = strike ? 10 : 14;
      if (strike) {
        S(upX - 1, 0, TIER5.cosmic); S(upX, 0, TIER5.apex); S(upX + 1, 0, TIER5.rift);
      } else if (wind) {
        S(upX - 1, 22, TIER5.cosmic); S(upX, 23, TIER5.apex); S(upX + 1, 22, TIER5.rift);
      } else {
        S(upX - 1, 2, TIER5.cosmic); S(upX, 2, TIER5.apex); S(upX + 1, 2, TIER5.rift);
      }
      S(upX - 5, guardY, TIER5.divine); S(upX + 5, guardY, TIER5.divine);
    } else if (strike) {
      S(22, 11, TIER5.cosmic); S(23, 12, TIER5.apex); S(22, 14, TIER5.rift);
      S(20, 10, TIER5.divine); S(20, 15, TIER5.divine); R(9, 13, 5, 1, TIER5.abyss);
    } else {
      const tipY = wind ? 0 : 2;
      S(sideX, tipY, TIER5.cosmic); S(sideX + 1, tipY, TIER5.apex); S(sideX + 2, tipY, TIER5.rift);
      S(sideX + 5, wind ? 11 : 14, TIER5.divine); S(sideX + 6, wind ? 11 : 14, TIER5.apex);
    }
  }

  if (w === 'dagger') {
    if (d === 'down') {
      const tipY = strike ? 21 : wind ? 3 : 4;
      S(downX - 1, tipY, TIER5.cosmic); S(downX, tipY, TIER5.apex);
      S(downX + 1, tipY + (strike ? 0 : 1), TIER5.rift); S(downX + 2, tipY + (strike ? -1 : 2), TIER5.divine);
      drawRune(downX + 3, strike ? 17 : wind ? 8 : 10);
    } else if (d === 'up') {
      const tipY = strike ? 1 : wind ? 20 : 3;
      S(upX - 1, tipY + 1, TIER5.cosmic); S(upX, tipY, TIER5.apex); S(upX + 1, tipY + 1, TIER5.rift);
      drawRune(upX + 3, strike ? 6 : wind ? 17 : 10);
    } else if (strike) {
      S(21, 12, TIER5.cosmic); S(23, 13, TIER5.apex); S(21, 14, TIER5.rift);
      drawRune(18, 10); S(12, 13, TIER5.divine);
    } else {
      const tipY = wind ? 2 : 4;
      S(sideX, tipY + 1, TIER5.cosmic); S(sideX + 1, tipY, TIER5.apex);
      S(sideX + 2, tipY + 1, TIER5.rift); S(sideX + 3, tipY + 2, TIER5.divine);
      drawRune(sideX + 4, wind ? 8 : 10);
    }
  }

  if (w === 'greatsword') {
    if (d === 'down') {
      const guardY = strike ? 13 : wind ? 11 : 13;
      if (strike) {
        R(downX - 1, 21, 2, 3, TIER5.abyss); S(downX, 23, TIER5.apex);
        S(downX - 2, 22, TIER5.cosmic); S(downX + 2, 22, TIER5.rift);
      } else {
        const tipY = wind ? 0 : 2;
        R(downX - 1, tipY, 2, 3, TIER5.abyss); S(downX - 1, tipY, TIER5.apex);
        S(downX - 2, tipY + 1, TIER5.cosmic); S(downX + 1, tipY + 1, TIER5.rift);
        R(downX, tipY + 3, 1, wind ? 5 : 6, TIER5.cosmic);
      }
      S(downX - 6, guardY, TIER5.divine); S(downX + 6, guardY, TIER5.divine);
      S(downX - 5, guardY + 1, TIER5.abyss); S(downX + 5, guardY + 1, TIER5.abyss);
    } else if (d === 'up') {
      const guardY = strike ? 10 : 14;
      const tipY = strike ? 0 : 2;
      R(upX - 1, tipY, 2, 3, TIER5.abyss); S(upX - 1, tipY, TIER5.apex);
      S(upX - 2, tipY + 1, TIER5.cosmic); S(upX + 1, tipY + 1, TIER5.rift);
      R(upX, tipY + 3, 1, strike ? 5 : 6, TIER5.cosmic);
      S(upX - 6, guardY, TIER5.divine); S(upX + 6, guardY, TIER5.divine);
    } else if (strike) {
      R(21, 12, 3, 2, TIER5.abyss); S(23, 12, TIER5.apex);
      S(22, 10, TIER5.cosmic); S(22, 15, TIER5.rift); R(17, 13, 5, 1, TIER5.cosmic);
      S(8, 12, TIER5.divine); S(8, 14, TIER5.divine);
    } else {
      const tipY = wind ? 0 : 2;
      R(sideX, tipY, 2, 3, TIER5.abyss); S(sideX, tipY, TIER5.apex);
      S(sideX + 2, tipY + 1, TIER5.cosmic); S(sideX + 3, tipY + 2, TIER5.rift);
      R(sideX + 1, tipY + 3, 1, wind ? 5 : 6, TIER5.cosmic);
      S(sideX + 5, wind ? 11 : 14, TIER5.divine); S(sideX + 6, wind ? 11 : 14, TIER5.apex);
    }
  }

  if (w === 'scimitar') {
    if (d === 'down') {
      const y = strike ? 21 : wind ? 1 : 2;
      S(downX - 2, y, TIER5.apex); S(downX - 1, y + 1, TIER5.divine);
      S(downX, y + 2, TIER5.cosmic); S(downX + 1, Math.min(23, y + 2), TIER5.rift);
      S(downX + 5, strike ? 17 : wind ? 9 : 11, TIER5.divine); S(downX + 4, strike ? 18 : wind ? 8 : 10, TIER5.abyss);
    } else if (d === 'up') {
      const y = strike ? 0 : 2;
      S(upX - 2, y, TIER5.apex); S(upX - 1, y + 1, TIER5.divine);
      S(upX, y + 2, TIER5.cosmic); S(upX + 1, y + 3, TIER5.rift); S(upX + 4, strike ? 6 : 10, TIER5.divine);
    } else if (strike) {
      S(23, 9, TIER5.apex); S(22, 10, TIER5.divine); S(21, 11, TIER5.cosmic);
      S(20, 13, TIER5.rift); S(19, 15, TIER5.abyss); R(10, 13, 5, 1, TIER5.divine);
    } else {
      const y = wind ? 0 : 2;
      S(sideX, y + 1, TIER5.apex); S(sideX + 1, y, TIER5.divine);
      S(sideX + 2, y + 1, TIER5.cosmic); S(sideX + 3, y + 3, TIER5.rift);
      S(sideX + 5, wind ? 9 : 11, TIER5.divine); S(sideX + 4, wind ? 8 : 10, TIER5.abyss);
    }
  }

  if (w === 'rapier') {
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 11 : 13;
      const tipY = strike ? 23 : wind ? 1 : 2;
      S(downX, tipY, TIER5.apex); S(downX - 1, strike ? 22 : tipY + 1, TIER5.cosmic);
      S(downX + 1, strike ? 22 : tipY + 1, TIER5.rift);
      S(downX - 4, guardY + 1, TIER5.divine); S(downX + 4, guardY + 1, TIER5.divine);
      S(downX - 3, guardY + 2, TIER5.abyss); S(downX + 3, guardY + 2, TIER5.abyss); S(downX, guardY + 3, TIER5.cosmic);
    } else if (d === 'up') {
      const guardY = strike ? 9 : 14;
      const tipY = strike ? 0 : 2;
      S(upX, tipY, TIER5.apex); S(upX - 1, tipY + 1, TIER5.cosmic); S(upX + 1, tipY + 1, TIER5.rift);
      S(upX - 4, guardY + 1, TIER5.divine); S(upX + 4, guardY + 1, TIER5.divine);
      S(upX - 3, guardY + 2, TIER5.abyss); S(upX + 3, guardY + 2, TIER5.abyss);
    } else if (strike) {
      S(23, 13, TIER5.apex); S(22, 12, TIER5.cosmic); S(22, 14, TIER5.rift);
      S(16, 10, TIER5.divine); S(16, 16, TIER5.divine); S(15, 11, TIER5.abyss); S(15, 15, TIER5.abyss);
    } else {
      const guardY = wind ? 11 : 13;
      const tipY = wind ? 0 : 2;
      S(sideX + 1, tipY, TIER5.apex); S(sideX, tipY + 1, TIER5.cosmic); S(sideX + 2, tipY + 1, TIER5.rift);
      S(sideX + 3, guardY + 1, TIER5.divine); S(sideX + 5, guardY + 1, TIER5.divine);
      S(sideX + 4, guardY + 2, TIER5.abyss);
    }
  }

  if (w === 'axe') {
    if (d === 'down') {
      const y = strike ? 17 : wind ? 6 : 8;
      S(15, y - 2, TIER5.apex); S(20, y - 2, TIER5.apex);
      S(14, y - 1, TIER5.cosmic); S(21, y - 1, TIER5.rift);
      S(14, y + 2, TIER5.divine); S(22, y + 2, TIER5.divine); S(23, y + 1, TIER5.apex);
      drawRune(18, y); S(downX - 1, strike ? 22 : 16, TIER5.divine); S(downX + 1, strike ? 22 : 16, TIER5.abyss);
    } else if (d === 'up') {
      const y = strike ? 2 : 8;
      S(1, y - 2, TIER5.apex); S(9, y - 2, TIER5.apex);
      S(0, y - 1, TIER5.cosmic); S(10, y - 1, TIER5.rift);
      S(0, y + 2, TIER5.divine); S(11, y + 2, TIER5.divine); S(12, y + 1, TIER5.apex);
      drawRune(6, y);
    } else if (strike) {
      S(23, 7, TIER5.apex); S(21, 8, TIER5.cosmic); S(20, 10, TIER5.divine);
      S(20, 16, TIER5.rift); S(21, 18, TIER5.divine); S(23, 19, TIER5.apex);
      drawRune(22, 13); S(9, 12, TIER5.divine); S(9, 14, TIER5.abyss);
    } else {
      const y = wind ? 5 : 8;
      S(sideX + 2, y - 2, TIER5.apex); S(sideX + 5, y - 2, TIER5.apex);
      S(sideX + 1, y - 1, TIER5.cosmic); S(sideX + 6, y - 1, TIER5.rift);
      S(sideX, y + 1, TIER5.divine); S(23, y + 1, TIER5.apex);
      drawRune(sideX + 4, y); S(sideX + 1, 16, TIER5.divine);
    }
  }

  if (w === 'mace') {
    if (d === 'down') {
      const y = strike ? 19 : wind ? 6 : 8;
      drawOrbit(18, y, true); drawRune(18, y);
      S(15, y - 2, TIER5.divine); S(21, y + 2, TIER5.rift);
    } else if (d === 'up') {
      const y = strike ? 3 : 7;
      drawOrbit(6, y, true); drawRune(6, y);
      S(3, y - 2, TIER5.divine); S(9, y + 2, TIER5.rift);
    } else if (strike) {
      drawOrbit(21, 13); drawRune(21, 13);
      S(18, 10, TIER5.divine); S(18, 16, TIER5.rift); S(10, 13, TIER5.abyss);
    } else {
      const y = wind ? 6 : 8;
      drawOrbit(21, y); drawRune(21, y);
      S(sideX + 1, y - 3, TIER5.divine); S(sideX + 1, y + 3, TIER5.rift);
    }
  }

  if (w === 'warhammer') {
    if (d === 'down') {
      const y = strike ? 18 : wind ? 5 : 7;
      S(14, y, TIER5.apex); S(23, y, TIER5.apex);
      S(15, y - 2, TIER5.divine); S(22, y - 2, TIER5.divine);
      S(15, y + 3, TIER5.abyss); S(22, y + 3, TIER5.abyss);
      R(17, y, 4, 1, TIER5.cosmic); S(19, y + 1, TIER5.rift);
    } else if (d === 'up') {
      const y = strike ? 1 : 6;
      S(0, y + 1, TIER5.apex); S(12, y + 1, TIER5.apex);
      S(1, y - 1, TIER5.divine); S(11, y - 1, TIER5.divine);
      S(1, y + 4, TIER5.abyss); S(11, y + 4, TIER5.abyss);
      R(4, y + 1, 5, 1, TIER5.cosmic); S(6, y + 2, TIER5.rift);
    } else if (strike) {
      S(23, 7, TIER5.apex); S(23, 18, TIER5.apex);
      S(21, 6, TIER5.divine); S(21, 19, TIER5.divine);
      S(19, 8, TIER5.abyss); S(19, 17, TIER5.abyss);
      R(21, 11, 3, 1, TIER5.cosmic); R(21, 14, 3, 1, TIER5.rift); S(10, 13, TIER5.divine);
    } else {
      const y = wind ? 4 : 6;
      S(sideX, y, TIER5.apex); S(23, y, TIER5.apex);
      S(sideX + 1, y - 2, TIER5.divine); S(22, y - 2, TIER5.divine);
      S(sideX + 1, y + 3, TIER5.abyss); S(22, y + 3, TIER5.abyss);
      R(sideX + 2, y, 4, 1, TIER5.cosmic); S(sideX + 4, y + 1, TIER5.rift);
    }
  }

  if (w === 'spear') {
    if (d === 'down') {
      const tipY = strike ? 22 : 2;
      S(downX, strike ? 23 : 2, TIER5.apex);
      S(downX - 2, tipY, TIER5.cosmic); S(downX + 2, tipY, TIER5.rift);
      S(downX - 1, strike ? 20 : 4, TIER5.divine); S(downX + 1, strike ? 20 : 4, TIER5.divine);
      S(downX - 1, 9, TIER5.abyss); S(downX + 1, 9, TIER5.cosmic);
    } else if (d === 'up') {
      const tipY = strike ? 1 : 21;
      S(upX, strike ? 0 : 21, TIER5.apex);
      S(upX - 2, tipY, TIER5.cosmic); S(upX + 2, tipY, TIER5.rift);
      S(upX - 1, strike ? 3 : 19, TIER5.divine); S(upX + 1, strike ? 3 : 19, TIER5.divine);
      S(upX - 1, 14, TIER5.abyss); S(upX + 1, 14, TIER5.cosmic);
    } else if (strike) {
      S(23, 13, TIER5.apex); S(21, 11, TIER5.cosmic); S(21, 15, TIER5.rift);
      S(19, 12, TIER5.divine); S(19, 14, TIER5.divine); S(9, 12, TIER5.abyss); S(9, 14, TIER5.cosmic);
    } else {
      const tipY = wind ? 0 : 2;
      S(sideX, tipY, TIER5.apex); S(sideX + 2, tipY + 1, TIER5.cosmic); S(sideX + 3, tipY + 2, TIER5.rift);
      S(sideX + 1, tipY + 3, TIER5.divine); S(sideX + 3, tipY + 4, TIER5.divine);
      S(sideX + 1, 10, TIER5.abyss); S(sideX + 2, 10, TIER5.cosmic);
    }
  }

  if (w === 'club') {
    if (d === 'down') {
      const top = strike ? 13 : 2;
      drawWorldroot(14, top, 10);
      S(downX - 1, strike ? 22 : 19, TIER5.divine); S(downX + 1, strike ? 22 : 19, TIER5.abyss);
    } else if (d === 'up') {
      const top = strike ? 0 : 10;
      drawWorldroot(0, top, 11);
    } else if (strike) {
      drawWorldroot(16, 7, 8);
      S(9, 12, TIER5.divine); S(9, 14, TIER5.abyss);
    } else {
      const top = wind ? 0 : 2;
      drawWorldroot(sideX, top, 24 - sideX);
    }
  }

  if (w === 'bow') {
    if (d === 'right') {
      S(19, 2, TIER5.apex); S(18, 3, TIER5.divine); S(19, 5, TIER5.cosmic);
      S(19, 21, TIER5.apex); S(18, 20, TIER5.divine); S(19, 18, TIER5.rift);
      S(21, 8, TIER5.abyss); S(21, 15, TIER5.abyss);
      if (strike) { S(23, 13, TIER5.apex); S(21, 12, TIER5.cosmic); S(21, 14, TIER5.rift); }
    } else if (d === 'down') {
      S(20, 2, TIER5.apex); S(19, 3, TIER5.divine); S(20, 5, TIER5.cosmic);
      S(20, 22, TIER5.apex); S(19, 21, TIER5.divine); S(20, 19, TIER5.rift);
      S(22, 8, TIER5.abyss); S(22, 16, TIER5.abyss);
      if (strike) { S(12, 23, TIER5.apex); S(11, 19, TIER5.cosmic); S(13, 19, TIER5.rift); }
    } else {
      S(3, 2, TIER5.apex); S(4, 3, TIER5.divine); S(3, 5, TIER5.cosmic);
      S(3, 21, TIER5.apex); S(4, 20, TIER5.divine); S(3, 18, TIER5.rift);
      S(1, 8, TIER5.abyss); S(1, 15, TIER5.abyss);
      if (strike) { S(10, 0, TIER5.apex); S(9, 3, TIER5.cosmic); S(11, 3, TIER5.rift); }
    }
  }

  if (w === 'crossbow') {
    if (d === 'down') {
      S(9, 12, TIER5.apex); S(9, 16, TIER5.divine); S(23, 12, TIER5.apex); S(23, 16, TIER5.divine);
      S(11, 11, TIER5.cosmic); S(21, 11, TIER5.rift); S(11, 17, TIER5.abyss); S(21, 17, TIER5.abyss);
      S(downX - 1, 2, TIER5.cosmic); S(downX + 1, 2, TIER5.rift); S(downX, 22, TIER5.apex);
      drawRune(20, 19);
    } else if (d === 'up') {
      S(0, 6, TIER5.apex); S(0, 10, TIER5.divine); S(14, 6, TIER5.apex); S(14, 10, TIER5.divine);
      S(2, 5, TIER5.cosmic); S(12, 5, TIER5.rift); S(2, 11, TIER5.abyss); S(12, 11, TIER5.abyss);
      S(upX - 1, 2, TIER5.cosmic); S(upX + 1, 2, TIER5.rift); S(upX, 22, TIER5.apex);
      drawRune(3, 18);
    } else {
      S(sideX, 5, TIER5.apex); S(sideX + 3, 4, TIER5.cosmic); S(sideX + 3, 22, TIER5.rift);
      S(sideX, 22, TIER5.divine); S(23, 11, TIER5.apex); S(23, 15, TIER5.divine);
      S(sideX + 5, 10, TIER5.cosmic); S(sideX + 5, 16, TIER5.rift); drawRune(sideX + 4, 18);
    }
  }

  if (w === 'staff') {
    if (d === 'down') {
      drawOrbit(downX, 4, true); S(downX, 4, TIER5.apex);
      S(downX - 2, 7, TIER5.divine); S(downX + 2, 7, TIER5.abyss);
      S(downX - 1, 11, TIER5.cosmic); S(downX + 1, 11, TIER5.rift);
      S(downX - 1, 18, TIER5.divine); S(downX + 1, 18, TIER5.abyss);
      if (strike) { S(14, 22, TIER5.cosmic); S(21, 20, TIER5.rift); }
    } else if (d === 'up') {
      drawOrbit(upX, 4, true); S(upX, 4, TIER5.apex);
      S(upX - 2, 7, TIER5.divine); S(upX + 2, 7, TIER5.abyss);
      S(upX - 1, 11, TIER5.cosmic); S(upX + 1, 11, TIER5.rift);
      S(upX - 1, 18, TIER5.divine); S(upX + 1, 18, TIER5.abyss);
    } else if (strike) {
      drawOrbit(21, 13, true); S(21, 13, TIER5.apex);
      S(19, 10, TIER5.cosmic); S(23, 10, TIER5.rift); S(19, 16, TIER5.rift); S(23, 16, TIER5.cosmic);
      S(9, 12, TIER5.divine); S(9, 14, TIER5.abyss);
    } else {
      drawOrbit(sideX + 2, 4, true); S(sideX + 2, 4, TIER5.apex);
      S(sideX, 7, TIER5.divine); S(sideX + 4, 7, TIER5.abyss);
      S(sideX, 11, TIER5.cosmic); S(sideX + 2, 11, TIER5.rift);
      S(sideX, 18, TIER5.divine); S(sideX + 2, 18, TIER5.abyss);
    }
  }

  if (w === 'wand') {
    if (d === 'down') {
      drawOrbit(downX, 4); S(downX, 4, TIER5.abyss); S(downX, 3, TIER5.apex);
      S(downX - 1, 8, TIER5.divine); S(downX + 1, 9, TIER5.rift);
      S(downX - 1, 15, TIER5.cosmic); S(downX + 1, 16, TIER5.abyss);
      if (strike) { S(14, 21, TIER5.cosmic); S(20, 19, TIER5.rift); }
    } else if (d === 'up') {
      drawOrbit(upX, 4); S(upX, 4, TIER5.abyss); S(upX, 3, TIER5.apex);
      S(upX - 1, 8, TIER5.divine); S(upX + 1, 9, TIER5.rift);
      S(upX - 1, 15, TIER5.cosmic); S(upX + 1, 16, TIER5.abyss);
    } else if (strike) {
      drawOrbit(21, 13); S(21, 13, TIER5.abyss); S(23, 13, TIER5.apex);
      S(19, 10, TIER5.cosmic); S(23, 10, TIER5.rift); S(19, 16, TIER5.rift); S(23, 16, TIER5.cosmic);
      S(10, 12, TIER5.divine); S(10, 14, TIER5.abyss);
    } else {
      drawOrbit(sideX + 2, 4); S(sideX + 2, 4, TIER5.abyss); S(sideX + 2, 3, TIER5.apex);
      S(sideX, 8, TIER5.divine); S(sideX + 2, 9, TIER5.rift);
      S(sideX, 15, TIER5.cosmic); S(sideX + 2, 16, TIER5.abyss);
    }
  }

  if (w === 'spellbook') {
    if (d === 'down') {
      S(15, 8, TIER5.apex); S(23, 8, TIER5.divine); S(15, 16, TIER5.cosmic); S(23, 16, TIER5.rift);
      R(19, 9, 1, 7, TIER5.divine); S(17, 10, TIER5.abyss); S(21, 11, TIER5.abyss);
      drawRune(19, 13); S(14, 6, TIER5.cosmic); S(22, 5, TIER5.rift); S(23, 2, TIER5.apex);
      if (strike) { S(14, 19, TIER5.apex); S(18, 21, TIER5.divine); S(22, 19, TIER5.cosmic); }
    } else if (d === 'up') {
      S(2, 8, TIER5.apex); S(10, 8, TIER5.divine); S(2, 16, TIER5.cosmic); S(10, 16, TIER5.rift);
      R(6, 9, 1, 7, TIER5.divine); S(4, 10, TIER5.abyss); S(8, 11, TIER5.abyss);
      drawRune(6, 13); S(1, 6, TIER5.cosmic); S(9, 5, TIER5.rift); S(0, 2, TIER5.apex);
      if (strike) { S(1, 5, TIER5.apex); S(6, 3, TIER5.divine); S(11, 5, TIER5.cosmic); }
    } else {
      S(sideX, 8, TIER5.apex); S(23, 8, TIER5.divine); S(sideX, 16, TIER5.cosmic); S(23, 16, TIER5.rift);
      R(sideX + 4, 9, 1, 7, TIER5.divine); S(sideX + 2, 10, TIER5.abyss); S(sideX + 6, 11, TIER5.abyss);
      drawRune(sideX + 4, 13); S(sideX, 6, TIER5.cosmic); S(22, 5, TIER5.rift); S(23, 2, TIER5.apex);
      if (strike) { S(sideX, 19, TIER5.apex); S(sideX + 4, 21, TIER5.divine); S(23, 19, TIER5.cosmic); }
    }
  }
}

export function drawWeapon(S, R, d, p, C, u) {
  const w = C.weapon;
  const ph = p.wep; // hold | wind | strike | recover
  const strike = ph === 'strike';
  const wind = ph === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

  // Straight blades use explicit per-tier silhouettes instead of cumulative sparkle layers.
  // This keeps the weapon family readable before ornament and prevents Tier 5 shrinking after Tier 4.
  if (drawReadableStraightBlade(S, R, d, p, C)) return;
  if (drawReadableScimitar(S, R, d, p, C)) return;
  if (drawReadableRapier(S, R, d, p, C)) return;
  if (drawReadableAxe(S, R, d, p, C)) return;
  if (drawReadableBlunt(S, R, d, p, C)) return;
  if (drawReadableRanged(S, R, d, p, C)) return;
  if (drawReadableMagic(S, R, d, p, C)) return;

  // ---- existing compatibility set ----
  if (w === 'sword' || w === 'dagger') {
    const len = w === 'sword' ? 6 : 3;
    const gripSize = w === 'sword' ? 2 : 1;
    if (d === 'down') {
      const guardY = strike ? 14 : wind ? 12 : 13;
      if (strike) { R(17, 15, 1, len, METAL[0]); S(17, 15 + len - 1, METAL[2]); }
      else if (wind) { R(17, 12 - len, 1, len, METAL[0]); S(17, 12 - len, METAL[2]); }
      else { R(17, 13 - len, 1, len, METAL[0]); S(17, 13 - len, METAL[2]); }
      if (C.enhancedHilts) drawVerticalHilt(S, R, 17, guardY, { bladeBelow: strike, gripSize });
      else R(16, guardY, 3, 1, GOLD[0]);
    } else if (d === 'up') {
      const guardY = strike ? 10 : wind ? 14 : 8 + len;
      if (strike) { R(6, 12 - len - 4, 1, len + 2, METAL[0]); S(6, 12 - len - 4, METAL[2]); }
      else if (wind) { R(6, 15, 1, len, METAL[0]); }
      else { R(6, 8, 1, len, METAL[0]); S(6, 8, METAL[2]); }
      if (C.enhancedHilts) drawVerticalHilt(S, R, 6, guardY, { gripSize });
      else R(5, guardY, 3, 1, GOLD[0]);
    } else {
      if (strike) {
        R(15, 13, len + 2, 1, METAL[0]); S(15 + len + 1, 13, METAL[2]);
        if (C.enhancedHilts) drawHorizontalHilt(S, R, 15, 13, { gripSize });
        else R(15, 12, 1, 3, GOLD[0]);
      } else {
        const guardY = wind ? 11 : 14;
        if (wind) { R(sideX, 11 - len, 1, len, METAL[0]); S(sideX, 11 - len, METAL[2]); }
        else { R(sideX, 14 - len, 1, len, METAL[0]); S(sideX, 14 - len, METAL[2]); }
        if (C.enhancedHilts) drawVerticalHilt(S, R, sideX, guardY, { gripSize });
        else R(sideX - 1, guardY, 3, 1, GOLD[0]);
      }
    }
  }

  if (w === 'axe') {
    if (d === 'down') {
      if (strike) { R(17, 15, 1, 6, WOOD[0]); R(15, 17, 2, 3, METAL[0]); R(15, 17, 1, 3, METAL[2]); }
      else if (wind) { R(17, 6, 1, 6, WOOD[0]); R(15, 6, 2, 3, METAL[0]); R(15, 6, 1, 3, METAL[2]); }
      else { R(17, 8, 1, 6, WOOD[0]); R(15, 8, 2, 3, METAL[0]); R(15, 8, 1, 3, METAL[2]); }
    } else if (d === 'up') {
      if (strike) { R(6, 2, 1, 8, WOOD[0]); R(7, 2, 2, 3, METAL[0]); R(8, 2, 1, 3, METAL[2]); }
      else { R(6, 8, 1, 6, WOOD[0]); R(7, 8, 2, 3, METAL[0]); R(8, 8, 1, 3, METAL[2]); }
    } else {
      if (strike) { R(14, 13, 6, 1, WOOD[0]); R(18, 11, 2, 3, METAL[0]); R(18, 11, 2, 1, METAL[2]); }
      else if (wind) { R(sideX, 5, 1, 6, WOOD[0]); R(sideX + 1, 5, 2, 3, METAL[0]); }
      else { R(sideX, 8, 1, 6, WOOD[0]); R(sideX + 1, 8, 2, 3, METAL[0]); R(sideX + 1, 8, 2, 1, METAL[2]); }
    }
  }

  if (w === 'spear') {
    if (d === 'down') {
      if (strike) { R(17, 13, 1, 8, WOOD[0]); S(17, 21, METAL[0]); S(17, 22, METAL[2]); }
      else { R(17, 7, 1, 9, WOOD[0]); S(17, 6, METAL[0]); S(17, 5, METAL[2]); }
    } else if (d === 'up') {
      if (strike) { R(6, 1, 1, 9, WOOD[0]); S(6, 0, METAL[2]); S(6, 1, METAL[0]); }
      else { R(6, 8, 1, 9, WOOD[0]); S(6, 7, METAL[0]); S(6, 6, METAL[2]); }
    } else {
      if (strike) { R(13, 13, 8, 1, WOOD[0]); S(21, 13, METAL[0]); S(22, 13, METAL[2]); }
      else if (wind) { R(sideX, 6, 1, 9, WOOD[0]); S(sideX, 5, METAL[0]); }
      else { R(sideX, 7, 1, 9, WOOD[0]); S(sideX, 6, METAL[0]); S(sideX, 5, METAL[2]); }
    }
  }

  if (w === 'club') {
    if (d === 'down') {
      if (strike) { R(17, 15, 1, 4, WOOD[0]); R(16, 18, 3, 3, WOOD[0]); S(16, 18, WOOD[1]); S(18, 20, WOOD[1]); }
      else { R(17, 10, 1, 4, WOOD[0]); R(16, 7, 3, 3, WOOD[0]); S(16, 7, WOOD[1]); S(18, 9, WOOD[1]); }
    } else if (d === 'up') {
      if (strike) { R(6, 6, 1, 4, WOOD[0]); R(5, 3, 3, 3, WOOD[0]); S(5, 3, WOOD[1]); }
      else { R(6, 10, 1, 4, WOOD[0]); R(5, 13, 3, 3, WOOD[0]); }
    } else {
      if (strike) { R(14, 13, 4, 1, WOOD[0]); R(18, 12, 3, 3, WOOD[0]); S(20, 12, WOOD[1]); }
      else if (wind) { R(sideX, 8, 1, 4, WOOD[0]); R(sideX - 1, 5, 3, 3, WOOD[0]); }
      else { R(sideX, 10, 1, 4, WOOD[0]); R(sideX - 1, 7, 3, 3, WOOD[0]); S(sideX - 1, 7, WOOD[1]); }
    }
  }

  if (w === 'bow') {
    if (d === 'right') {
      S(16, 9, WOOD[0]); R(17, 10, 1, 6, WOOD[0]); S(16, 16, WOOD[0]);
      R(16, 10, 1, 6, STRINGC);
      if (wind) { R(11, 13, 5, 1, WOOD[0]); S(16, 13, METAL[0]); }
      if (strike) { R(17, 13, 4, 1, WOOD[0]); S(21, 13, METAL[0]); S(22, 13, METAL[2]); }
    } else if (d === 'down') {
      S(17, 9, WOOD[0]); R(18, 10, 1, 5, WOOD[0]); S(17, 15, WOOD[0]);
      R(17, 10, 1, 5, STRINGC);
      if (strike) { R(13, 17, 1, 4, WOOD[0]); S(13, 21, METAL[0]); }
      if (wind) { R(13, 12, 1, 4, WOOD[0]); S(13, 16, METAL[0]); }
    } else {
      S(6, 9, WOOD[0]); R(5, 10, 1, 5, WOOD[0]); S(6, 15, WOOD[0]);
      R(6, 10, 1, 5, STRINGC);
      if (strike) { R(10, 1, 1, 4, WOOD[0]); S(10, 0, METAL[0]); }
    }
  }

  if (w === 'staff') {
    if (d === 'down') {
      if (strike) { R(17, 13, 1, 6, WOOD[0]); R(16, 19, 2, 2, MAGIC[0]); S(16, 19, MAGIC[2]); S(15, 20, MAGIC[2]); S(19, 19, MAGIC[2]); }
      else { R(17, 7, 1, 9, WOOD[0]); R(16, 5, 2, 2, MAGIC[0]); S(16, 5, MAGIC[2]); }
    } else if (d === 'up') {
      // Keep the raised focus one cell below the source edge so the shared
      // enemy-caster strike has room for an exterior outline.
      if (strike) { R(6, 2, 1, 7, WOOD[0]); R(5, 1, 2, 2, MAGIC[0]); S(5, 1, MAGIC[2]); S(8, 2, MAGIC[2]); }
      else { R(6, 8, 1, 9, WOOD[0]); R(5, 6, 2, 2, MAGIC[0]); S(5, 6, MAGIC[2]); }
    } else {
      if (strike) { R(13, 13, 7, 1, WOOD[0]); R(20, 12, 2, 2, MAGIC[0]); S(20, 12, MAGIC[2]); S(22, 11, MAGIC[2]); S(19, 15, MAGIC[2]); }
      else if (wind) { R(sideX, 7, 1, 9, WOOD[0]); R(sideX - 1, 5, 2, 2, MAGIC[0]); }
      else { R(sideX, 7, 1, 9, WOOD[0]); R(sideX - 1, 5, 2, 2, MAGIC[0]); S(sideX - 1, 5, MAGIC[2]); }
    }
  }

  // ---- expanded blade set ----
  if (w === 'greatsword') {
    if (d === 'down') {
      const bladeY = strike ? 14 : wind ? 2 : 4;
      const guardY = strike ? 13 : wind ? 11 : 13;
      R(downX - 1, bladeY, 2, 9, METAL[0]); S(downX - 1, bladeY, METAL[2]);
      drawVerticalHilt(S, R, downX, guardY, { bladeBelow: strike, guardSize: 5, gripSize: 3, style: 'greatsword' });
    } else if (d === 'up') {
      const bladeY = strike ? 0 : 5;
      const guardY = strike ? 10 : 14;
      R(upX - 1, bladeY, 2, strike ? 10 : 9, METAL[0]); S(upX - 1, bladeY, METAL[2]);
      drawVerticalHilt(S, R, upX, guardY, { guardSize: 5, gripSize: 3, style: 'greatsword' });
    } else if (strike) {
      R(14, 12, 9, 2, METAL[0]); S(22, 12, METAL[2]);
      drawHorizontalHilt(S, R, 14, 13, { guardSize: 5, gripSize: 3, style: 'greatsword' });
    } else {
      const bladeY = wind ? 1 : 4;
      const guardY = wind ? 11 : 14;
      R(sideX - 1, bladeY, 2, 10, METAL[0]); S(sideX - 1, bladeY, METAL[2]);
      drawVerticalHilt(S, R, sideX, guardY, { guardSize: 5, gripSize: 3, style: 'greatsword' });
    }
  }

  if (w === 'scimitar') {
    if (d === 'down') {
      const bladeY = strike ? 15 : wind ? 6 : 8;
      const guardY = strike ? 14 : wind ? 11 : 13;
      R(downX, bladeY, 1, 5, METAL[0]); S(downX - 1, strike ? 20 : bladeY - 1, METAL[2]);
      drawVerticalHilt(S, R, downX, guardY, { bladeBelow: strike, style: 'scimitar' });
    } else if (d === 'up') {
      const guardY = strike ? 9 : 14;
      R(upX, strike ? 2 : 8, 1, 6, METAL[0]); S(upX - 1, strike ? 1 : 7, METAL[2]);
      drawVerticalHilt(S, R, upX, guardY, { style: 'scimitar' });
    } else if (strike) {
      R(15, 13, 7, 1, METAL[0]); S(22, 12, METAL[2]);
      drawHorizontalHilt(S, R, 15, 13, { style: 'scimitar' });
    } else {
      const bladeY = wind ? 6 : 8;
      const guardY = wind ? 11 : 13;
      R(sideX, bladeY, 1, 5, METAL[0]); S(sideX + 1, bladeY - 1, METAL[2]);
      drawVerticalHilt(S, R, sideX, guardY, { style: 'scimitar' });
    }
  }

  if (w === 'rapier') {
    if (d === 'down') {
      const bladeY = strike ? 15 : wind ? 4 : 6;
      const guardY = strike ? 14 : wind ? 11 : 13;
      R(downX, bladeY, 1, 7, METAL[2]); S(downX, strike ? 21 : bladeY, '#f4f4f4');
      drawVerticalHilt(S, R, downX, guardY, { bladeBelow: strike, style: 'rapier' });
    } else if (d === 'up') {
      const guardY = strike ? 9 : 14;
      R(upX, strike ? 1 : 7, 1, 7, METAL[2]); S(upX, strike ? 0 : 7, '#f4f4f4');
      drawVerticalHilt(S, R, upX, guardY, { style: 'rapier' });
    } else if (strike) {
      R(15, 13, 8, 1, METAL[2]); S(22, 13, '#f4f4f4');
      drawHorizontalHilt(S, R, 15, 13, { style: 'rapier' });
    } else {
      const bladeY = wind ? 4 : 6;
      const guardY = wind ? 11 : 13;
      R(sideX, bladeY, 1, 7, METAL[2]); S(sideX, bladeY, '#f4f4f4');
      drawVerticalHilt(S, R, sideX, guardY, { style: 'rapier' });
    }
  }

  // ---- expanded blunt set ----
  if (w === 'mace') {
    if (d === 'down') {
      const headY = strike ? 18 : wind ? 5 : 7;
      R(downX, strike ? 14 : headY + 3, 1, 5, WOOD[0]);
      R(downX - 1, headY, 3, 3, METAL[0]); S(downX - 1, headY, METAL[2]); S(downX + 1, headY + 2, METAL[1]);
    } else if (d === 'up') {
      const headY = strike ? 2 : 6;
      R(upX, headY + 3, 1, 5, WOOD[0]); R(upX - 1, headY, 3, 3, METAL[0]); S(upX - 1, headY, METAL[2]);
    } else {
      const headX = strike ? 19 : sideX - 1;
      if (strike) R(14, 13, 5, 1, WOOD[0]); else R(sideX, wind ? 8 : 10, 1, 4, WOOD[0]);
      R(headX, strike ? 12 : wind ? 5 : 7, 3, 3, METAL[0]); S(headX, strike ? 12 : wind ? 5 : 7, METAL[2]);
    }
  }

  if (w === 'warhammer') {
    if (d === 'down') {
      const headY = strike ? 18 : wind ? 5 : 7;
      R(downX, strike ? 14 : headY + 2, 1, 6, WOOD[0]);
      R(downX - 2, headY, 5, 2, METAL[0]); S(downX - 2, headY, METAL[2]); S(downX + 2, headY + 1, METAL[1]);
    } else if (d === 'up') {
      const headY = strike ? 1 : 6;
      R(upX, headY + 2, 1, 7, WOOD[0]); R(upX - 2, headY, 5, 2, METAL[0]); S(upX - 2, headY, METAL[2]);
    } else {
      const headX = strike ? 18 : sideX - 1;
      if (strike) R(14, 13, 4, 1, WOOD[0]); else R(sideX, wind ? 7 : 9, 1, 5, WOOD[0]);
      R(headX, strike ? 11 : wind ? 5 : 7, 5, 2, METAL[0]); S(headX, strike ? 11 : wind ? 5 : 7, METAL[2]);
    }
  }

  // ---- expanded ranged + magic set ----
  if (w === 'crossbow') {
    if (d === 'down') {
      R(15, 11, 5, 2, WOOD[0]); S(14, 10, WOOD[0]); S(20, 10, WOOD[0]); R(14, 10, 7, 1, STRINGC);
      R(17, 10, 1, 6, METAL[1]);
      if (strike) { R(17, 16, 1, 6, WOOD[0]); S(17, 22, METAL[2]); }
    } else if (d === 'up') {
      R(4, 11, 5, 2, WOOD[0]); S(3, 10, WOOD[0]); S(9, 10, WOOD[0]); R(3, 10, 7, 1, STRINGC);
      R(6, 8, 1, 7, METAL[1]);
      if (strike) { R(6, 2, 1, 6, WOOD[0]); S(6, 1, METAL[2]); }
    } else {
      R(sideX - 1, 11, 5, 3, WOOD[0]); R(sideX, 9, 1, 7, STRINGC);
      R(sideX + 1, 13, 4, 1, METAL[1]);
      if (strike) { R(sideX + 3, 13, 3, 1, WOOD[0]); S(sideX + 6, 13, METAL[2]); }
    }
  }

  if (w === 'wand') {
    if (d === 'down') {
      R(downX, strike ? 14 : 10, 1, 5, WOOD[0]); R(downX - 1, strike ? 18 : 8, 2, 2, MAGIC[0]); S(downX - 1, strike ? 18 : 8, MAGIC[2]);
      if (strike) { S(15, 20, MAGIC[2]); S(19, 19, MAGIC[2]); S(17, 22, MAGIC[1]); }
    } else if (d === 'up') {
      R(upX, strike ? 3 : 10, 1, 5, WOOD[0]); R(upX - 1, strike ? 1 : 8, 2, 2, MAGIC[0]); S(upX - 1, strike ? 1 : 8, MAGIC[2]);
      if (strike) { S(3, 2, MAGIC[2]); S(8, 1, MAGIC[2]); }
    } else {
      if (strike) {
        R(15, 13, 5, 1, WOOD[0]); R(20, 12, 2, 2, MAGIC[0]); S(21, 11, MAGIC[2]); S(23, 13, MAGIC[2]); S(20, 15, MAGIC[1]);
      } else {
        R(sideX, wind ? 8 : 10, 1, 5, WOOD[0]); R(sideX - 1, wind ? 6 : 8, 2, 2, MAGIC[0]); S(sideX - 1, wind ? 6 : 8, MAGIC[2]);
      }
    }
  }

  if (w === 'spellbook') {
    if (d === 'down') {
      R(15, 11, 4, 4, BOOK[0]); R(15, 11, 1, 4, BOOK[1]); R(18, 12, 1, 2, BOOK[2]); S(16, 12, BOOK[3]);
      if (strike) { S(16, 17, BOOK[3]); S(18, 18, MAGIC[2]); S(15, 19, MAGIC[1]); }
    } else if (d === 'up') {
      R(5, 11, 4, 4, BOOK[0]); R(8, 11, 1, 4, BOOK[1]); R(5, 12, 1, 2, BOOK[2]); S(7, 12, BOOK[3]);
      if (strike) { S(7, 8, BOOK[3]); S(9, 6, MAGIC[2]); S(5, 7, MAGIC[1]); }
    } else {
      R(sideX - 1, 11, 4, 4, BOOK[0]); R(sideX - 1, 11, 1, 4, BOOK[1]); R(sideX + 2, 12, 1, 2, BOOK[2]); S(sideX, 12, BOOK[3]);
      if (strike) { S(sideX + 3, 12, BOOK[3]); S(sideX + 4, 10, MAGIC[2]); S(sideX + 5, 13, MAGIC[1]); }
    }
  }

  if (C.weaponTier === 'tier2' || C.weaponTier === 'tier3' || C.weaponTier === 'tier4' || C.weaponTier === 'tier5') drawTierTwoUpgrade(S, R, d, ph, C);
  if (C.weaponTier === 'tier3' || C.weaponTier === 'tier4' || C.weaponTier === 'tier5') drawTierThreeUpgrade(S, R, d, ph, C);
  if (C.weaponTier === 'tier4') drawTierFourUpgrade(S, R, d, ph, C);
  if (C.weaponTier === 'tier5') drawTierFiveUpgrade(S, R, d, ph, C);
}
