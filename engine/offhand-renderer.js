import { GOLD, INK, METAL } from './catalogs.js';

const OFFHAND_HAND_X = Object.freeze({
  down: 7,
  up: 17,
  side: 13,
});
const OFFHAND_HAND_Y = 15;

function offhandHandOffset(p, d) {
  if (d !== 'right') return -p.arm;
  if (p.wep === 'wind') return -1;
  return p.arm;
}

function drawLanternBody(S, R, x, y) {
  R(x + 1, y, 2, 1, METAL[1]);
  S(x, y + 1, METAL[1]);
  R(x + 1, y + 1, 2, 1, METAL[2]);
  S(x + 3, y + 1, METAL[1]);
  S(x, y + 2, INK);
  R(x + 1, y + 2, 2, 1, GOLD[2]);
  S(x + 3, y + 2, INK);
  S(x, y + 3, METAL[1]);
  S(x + 1, y + 3, GOLD[0]);
  S(x + 2, y + 3, GOLD[1]);
  S(x + 3, y + 3, METAL[1]);
  R(x, y + 4, 4, 1, METAL[1]);
  R(x + 1, y + 4, 2, 1, METAL[0]);
}

function drawLantern(S, R, d, handX, handY) {
  const bodyX = d === 'down' ? handX - 4 : handX + 1;
  const bodyY = handY + 1;

  if (d === 'down') {
    S(handX - 2, handY, METAL[1]);
    S(handX - 3, handY + 1, METAL[1]);
    S(handX - 2, handY + 1, METAL[2]);
  } else {
    S(handX + 1, handY, METAL[1]);
    S(handX + 1, handY + 1, METAL[2]);
    S(handX + 2, handY + 1, METAL[1]);
  }

  drawLanternBody(S, R, bodyX, bodyY);
}

export function drawOffhand(S, R, d, p, C, layer = 'front', viewDir = d) {
  if (
    C.offhand !== 'lantern'
    || (C.shield && C.shield !== 'none')
  ) return;

  const handOffset = offhandHandOffset(p, d);
  const handX = d === 'right' ? OFFHAND_HAND_X.side : OFFHAND_HAND_X[d];
  const handY = OFFHAND_HAND_Y + p.bob + handOffset;
  const faceLayer = d === 'right'
    ? (viewDir === 'left' ? 'front' : 'behind')
    : (d === 'up' ? 'behind' : 'front');

  if (layer === faceLayer) drawLantern(S, R, d, handX, handY);

  // The front pass owns the animated hand socket even when the lantern itself
  // is behind the body. This matches the existing shield-hand contract while
  // preserving the authored skin colors at the grip.
  if (layer === 'front') {
    R(handX - 1, handY, 2, 2, C.skin[0]);
    S(handX - 1, handY + 1, C.skin[1]);
  }
}
