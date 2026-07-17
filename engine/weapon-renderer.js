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
      S(13, 9, TIER2.gold); S(21, 9, TIER2.gold);
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
      S(downX - 4, headY + 1, TIER3.storm); S(downX + 3, headY + 1, TIER3.storm);
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

export function drawWeapon(S, R, d, p, C, u) {
  const w = C.weapon;
  const ph = p.wep; // hold | wind | strike | recover
  const strike = ph === 'strike';
  const wind = ph === 'wind';
  const { downX, upX, sideX } = weaponAnchors(C);

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
      if (strike) { R(6, 2, 1, 7, WOOD[0]); R(5, 0, 2, 2, MAGIC[0]); S(5, 0, MAGIC[2]); S(8, 1, MAGIC[2]); }
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

  if (C.weaponTier === 'tier2' || C.weaponTier === 'tier3') drawTierTwoUpgrade(S, R, d, ph, C);
  if (C.weaponTier === 'tier3') drawTierThreeUpgrade(S, R, d, ph, C);
}
