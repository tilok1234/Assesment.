// Humanoid weapon pixel rendering.
// Existing enemy-compatible weapons preserve their original coordinates; new player weapons
// share the same direction and pose anchors so content can grow without covering the face.

import { GOLD, METAL, STRINGC, WOOD } from './catalogs.js';

const MAGIC = ['#59d8cc', '#2fa79b', '#c6f7ef'];
const BOOK = ['#7b4fb5', '#57357f', '#e9dca9', '#8be6dc'];

function weaponAnchors(C) {
  return {
    downX: 17,
    upX: 6,
    sideX: 14 + (C.sideWeaponOffset || 0),
  };
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
    if (d === 'down') {
      if (strike) { R(17, 15, 1, len, METAL[0]); S(17, 15 + len - 1, METAL[2]); R(16, 14, 3, 1, GOLD[0]); }
      else if (wind) { R(17, 12 - len, 1, len, METAL[0]); S(17, 12 - len, METAL[2]); R(16, 12, 3, 1, GOLD[0]); }
      else { R(17, 13 - len, 1, len, METAL[0]); S(17, 13 - len, METAL[2]); R(16, 13, 3, 1, GOLD[0]); }
    } else if (d === 'up') {
      if (strike) { R(6, 12 - len - 4, 1, len + 2, METAL[0]); S(6, 12 - len - 4, METAL[2]); R(5, 10, 3, 1, GOLD[0]); }
      else if (wind) { R(6, 15, 1, len, METAL[0]); R(5, 14, 3, 1, GOLD[0]); }
      else { R(6, 8, 1, len, METAL[0]); S(6, 8, METAL[2]); R(5, 8 + len, 3, 1, GOLD[0]); }
    } else {
      if (strike) { R(15, 13, len + 2, 1, METAL[0]); S(15 + len + 1, 13, METAL[2]); R(15, 12, 1, 3, GOLD[0]); }
      else if (wind) { R(sideX, 11 - len, 1, len, METAL[0]); S(sideX, 11 - len, METAL[2]); R(sideX - 1, 11, 3, 1, GOLD[0]); }
      else { R(sideX, 14 - len, 1, len, METAL[0]); S(sideX, 14 - len, METAL[2]); R(sideX - 1, 14, 3, 1, GOLD[0]); }
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
      R(downX - 1, bladeY, 2, 9, METAL[0]); S(downX - 1, bladeY, METAL[2]);
      R(downX - 2, strike ? 13 : wind ? 11 : 13, 5, 1, GOLD[0]);
    } else if (d === 'up') {
      const bladeY = strike ? 0 : 5;
      R(upX - 1, bladeY, 2, strike ? 10 : 9, METAL[0]); S(upX - 1, bladeY, METAL[2]);
      R(upX - 2, strike ? 10 : 14, 5, 1, GOLD[0]);
    } else if (strike) {
      R(14, 12, 9, 2, METAL[0]); S(22, 12, METAL[2]); R(14, 11, 1, 4, GOLD[0]);
    } else {
      const bladeY = wind ? 1 : 4;
      R(sideX - 1, bladeY, 2, 10, METAL[0]); S(sideX - 1, bladeY, METAL[2]);
      R(sideX - 2, wind ? 11 : 14, 5, 1, GOLD[0]);
    }
  }

  if (w === 'scimitar') {
    if (d === 'down') {
      const bladeY = strike ? 15 : wind ? 6 : 8;
      R(downX, bladeY, 1, 5, METAL[0]); S(downX - 1, strike ? 20 : bladeY - 1, METAL[2]);
      R(downX - 1, strike ? 14 : wind ? 11 : 13, 3, 1, GOLD[0]);
    } else if (d === 'up') {
      R(upX, strike ? 2 : 8, 1, 6, METAL[0]); S(upX - 1, strike ? 1 : 7, METAL[2]);
      R(upX - 1, strike ? 9 : 14, 3, 1, GOLD[0]);
    } else if (strike) {
      R(15, 13, 7, 1, METAL[0]); S(22, 12, METAL[2]); R(15, 12, 1, 3, GOLD[0]);
    } else {
      const bladeY = wind ? 6 : 8;
      R(sideX, bladeY, 1, 5, METAL[0]); S(sideX + 1, bladeY - 1, METAL[2]);
      R(sideX - 1, wind ? 11 : 13, 3, 1, GOLD[0]);
    }
  }

  if (w === 'rapier') {
    if (d === 'down') {
      const bladeY = strike ? 15 : wind ? 4 : 6;
      R(downX, bladeY, 1, 7, METAL[2]); S(downX, strike ? 21 : bladeY, '#f4f4f4');
      R(downX - 1, strike ? 14 : wind ? 11 : 13, 3, 1, GOLD[0]); S(downX - 1, strike ? 13 : wind ? 10 : 12, GOLD[0]);
    } else if (d === 'up') {
      R(upX, strike ? 1 : 7, 1, 7, METAL[2]); S(upX, strike ? 0 : 7, '#f4f4f4');
      R(upX - 1, strike ? 9 : 14, 3, 1, GOLD[0]);
    } else if (strike) {
      R(15, 13, 8, 1, METAL[2]); S(22, 13, '#f4f4f4'); R(15, 12, 1, 3, GOLD[0]);
    } else {
      const bladeY = wind ? 4 : 6;
      R(sideX, bladeY, 1, 7, METAL[2]); S(sideX, bladeY, '#f4f4f4');
      R(sideX - 1, wind ? 11 : 13, 3, 1, GOLD[0]);
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
      R(15, 11, 5, 3, WOOD[0]); R(16, 9, 1, 7, STRINGC);
      R(18, 13, 4, 1, METAL[1]);
      if (strike) { R(20, 13, 3, 1, WOOD[0]); S(23, 13, METAL[2]); }
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
      R(15, 11, 4, 4, BOOK[0]); R(15, 11, 1, 4, BOOK[1]); R(18, 12, 1, 2, BOOK[2]); S(16, 12, BOOK[3]);
      if (strike) { S(20, 12, BOOK[3]); S(21, 10, MAGIC[2]); S(22, 13, MAGIC[1]); }
    }
  }
}
