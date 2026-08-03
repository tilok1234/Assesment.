import { SIZE } from './catalogs.js';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const INK = '#1b1720';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function color(value, label) {
  assert(typeof value === 'string' && HEX_COLOR.test(value), label + ' must be a six-digit hex color.');
  return value.toLowerCase();
}

function pair(value, label) {
  assert(Array.isArray(value) && value.length >= 2, label + ' must provide a base/shadow pair.');
  return [color(value[0], label + ' base'), color(value[1], label + ' shadow')];
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Large-hybrid pixel rectangles must use positive integer geometry.',
    );
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function resolveColors(rendererData) {
  const actorPalette = rendererData.actor?.palette;
  const materials = rendererData.materials;
  assert(actorPalette && materials, 'Large-hybrid variants need actor palette and material data.');
  return {
    ink: INK,
    skin: pair(actorPalette.skin, 'Large-hybrid skin'),
    hair: pair(actorPalette.hair, 'Large-hybrid hair'),
    cloth: pair(actorPalette.outfit, 'Large-hybrid outfit'),
    hide: pair(materials.hide, 'Large-hybrid hide'),
    hoof: pair(materials.hoof, 'Large-hybrid hoof'),
    wood: pair(materials.wood, 'Large-hybrid wood'),
    accent: pair(materials.accent, 'Large-hybrid accent'),
  };
}

// EN-E03 v2 follows the established Enemy source-art grammar: palette shapes
// are authored without a baked silhouette outline, one-pixel clusters carry
// facial/material detail, and the shared Complete B pass owns the exterior ink.

function drawGiantDown(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { ink, skin, hair, cloth, hide, wood, accent } = colors;

  rect(19, 3 + bob, 3, 2, wood[1]);
  rect(18, 4 + bob, 4, 2, wood[0]);
  dot(18, 3 + bob, wood[0]);
  rect(20, 6 + bob, 1, 12, wood[1]);
  dot(19, 7 + bob, wood[0]);

  rect(8, 17, 3, 5, cloth[1]);
  rect(13, 17, 3, 5, cloth[0]);
  rect(7, 21, 4, 2, hide[1]);
  rect(13, 21, 4, 2, hide[1]);
  dot(10, 20, hide[0]);
  dot(13, 20, hide[0]);

  rect(4, 11 + bob, 3, 6, skin[1]);
  rect(5, 16 + bob, 3, 2, skin[0]);
  rect(17, 11 + bob, 3, 6, skin[0]);
  rect(18, 16 + bob, 3, 2, skin[1]);
  rect(6, 10 + bob, 12, 3, cloth[0]);
  rect(7, 12 + bob, 10, 6, cloth[0]);
  rect(15, 12 + bob, 2, 6, cloth[1]);
  rect(7, 16 + bob, 10, 2, cloth[1]);
  rect(8, 14 + bob, 9, 1, accent[1]);
  dot(12, 14 + bob, accent[0]);

  rect(10, 9 + bob, 4, 2, skin[1]);
  rect(10, 2 + bob, 4, 1, hair[1]);
  rect(9, 3 + bob, 6, 2, hair[0]);
  rect(8, 5 + bob, 8, 4, skin[0]);
  rect(8, 5 + bob, 1, 4, hair[1]);
  rect(15, 5 + bob, 1, 4, skin[1]);
  rect(9, 4 + bob, 6, 1, hair[1]);
  rect(7, 6 + bob, 1, 2, skin[1]);
  rect(16, 6 + bob, 1, 2, skin[0]);
  dot(10, 6 + bob, ink);
  dot(14, 6 + bob, ink);
  dot(12, 7 + bob, skin[1]);
  rect(11, 8 + bob, 3, 1, hair[1]);
  if (frame) dot(9, 9 + bob, hair[0]);
}

function drawGiantUp(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { skin, hair, cloth, hide, wood, accent } = colors;

  rect(2, 3 + bob, 3, 2, wood[1]);
  rect(2, 4 + bob, 4, 2, wood[0]);
  dot(5, 3 + bob, wood[0]);
  rect(3, 6 + bob, 1, 12, wood[1]);
  dot(4, 7 + bob, wood[0]);

  rect(8, 17, 3, 5, cloth[0]);
  rect(13, 17, 3, 5, cloth[1]);
  rect(7, 21, 4, 2, hide[1]);
  rect(13, 21, 4, 2, hide[1]);
  dot(10, 20, hide[0]);
  dot(13, 20, hide[0]);

  rect(4, 11 + bob, 3, 6, skin[0]);
  rect(3, 16 + bob, 3, 2, skin[1]);
  rect(17, 11 + bob, 3, 6, skin[1]);
  rect(6, 10 + bob, 12, 3, cloth[1]);
  rect(7, 12 + bob, 10, 6, cloth[1]);
  rect(7, 12 + bob, 2, 6, cloth[0]);
  rect(7, 16 + bob, 10, 2, cloth[0]);
  dot(8, 13 + bob, accent[1]);
  dot(9, 14 + bob, accent[1]);
  rect(10, 15 + bob, 6, 1, accent[1]);
  if (frame) dot(16, 15 + bob, accent[0]);

  rect(10, 9 + bob, 4, 2, hair[1]);
  rect(10, 2 + bob, 4, 1, hair[1]);
  rect(9, 3 + bob, 6, 2, hair[0]);
  rect(8, 5 + bob, 8, 4, hair[0]);
  rect(8, 7 + bob, 8, 2, hair[1]);
  dot(7, 6 + bob, skin[1]);
  dot(16, 6 + bob, skin[0]);
}

function drawGiantSide(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { ink, skin, hair, cloth, hide, wood, accent } = colors;

  rect(19, 3 + bob, 3, 2, wood[1]);
  rect(18, 4 + bob, 5, 2, wood[0]);
  dot(18, 3 + bob, wood[0]);
  rect(20, 6 + bob, 1, 12, wood[1]);
  dot(19, 7 + bob, wood[0]);

  rect(9, 17, 3, 5, cloth[1]);
  rect(14, 17, 3, 5, cloth[0]);
  rect(8, 21, 5, 2, hide[1]);
  rect(14, 21, 5, 2, hide[1]);
  dot(12, 20, hide[0]);
  dot(14, 20, hide[0]);

  rect(7, 11 + bob, 3, 6, skin[1]);
  rect(8, 16 + bob, 3, 2, skin[0]);
  rect(16, 11 + bob, 3, 6, skin[0]);
  rect(18, 16 + bob, 3, 2, skin[1]);
  rect(8, 10 + bob, 10, 3, cloth[0]);
  rect(9, 12 + bob, 9, 6, cloth[0]);
  rect(9, 16 + bob, 9, 2, cloth[1]);
  rect(10, 14 + bob, 8, 1, accent[1]);
  dot(16, 14 + bob, accent[0]);

  rect(11, 9 + bob, 4, 2, skin[1]);
  rect(11, 2 + bob, 4, 1, hair[1]);
  rect(10, 3 + bob, 6, 2, hair[0]);
  rect(10, 5 + bob, 7, 4, skin[0]);
  rect(10, 5 + bob, 1, 4, hair[1]);
  rect(11, 4 + bob, 5, 1, hair[1]);
  rect(17, 6 + bob, 2, 2, skin[0]);
  dot(17, 6 + bob, ink);
  dot(16, 8 + bob, hair[1]);
  if (frame) dot(9, 9 + bob, hair[0]);
}

function drawGiant(paint, bob, frame, colors) {
  if (paint.view === 'up') drawGiantUp(paint, bob, frame, colors);
  else if (paint.view === 'right') drawGiantSide(paint, bob, frame, colors);
  else drawGiantDown(paint, bob, frame, colors);
}

function drawCentaurDown(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(19, 2 + bob, 2, 2, accent[0]);
  dot(20, 1 + bob, accent[0]);
  rect(20, 4 + bob, 1, 14, wood[1]);
  dot(19, 5 + bob, wood[0]);

  rect(6, 16, 2, 6, hide[1]);
  rect(9, 16, 2, 6, hide[0]);
  rect(14, 16, 2, 6, hide[1]);
  rect(17, 16, 2, 6, hide[0]);
  rect(6, 21, 2, 2, hoof[1]);
  rect(9, 21, 2, 2, hoof[0]);
  rect(14, 21, 2, 2, hoof[1]);
  rect(17, 21, 2, 2, hoof[0]);
  rect(7, 12, 11, 6, hide[0]);
  rect(6, 14, 2, 4, hide[1]);
  rect(17, 13, 2, 5, hide[1]);
  rect(8, 17, 9, 2, hide[1]);
  rect(18, 13 + tailLift, 3, 2, hair[0]);
  dot(21, 12 + tailLift, hair[1]);
  dot(20, 15 + tailLift, hair[1]);

  rect(8, 8 + bob, 8, 6, cloth[0]);
  rect(9, 13 + bob, 7, 2, cloth[1]);
  rect(7, 10 + bob, 2, 4, skin[1]);
  rect(16, 10 + bob, 3, 4, skin[0]);
  rect(18, 12 + bob, 3, 2, skin[1]);
  rect(9, 12 + bob, 7, 1, accent[1]);
  dot(12, 12 + bob, accent[0]);

  rect(10, 2 + bob, 5, 1, hair[1]);
  rect(9, 3 + bob, 7, 2, hair[0]);
  rect(9, 5 + bob, 7, 4, skin[0]);
  rect(9, 5 + bob, 1, 4, hair[1]);
  dot(8, 6 + bob, skin[1]);
  dot(16, 6 + bob, skin[0]);
  dot(11, 6 + bob, ink);
  dot(14, 6 + bob, ink);
  dot(12, 8 + bob, hair[1]);
}

function drawCentaurUp(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailShift = frame ? 1 : 0;

  rect(2, 2 + bob, 2, 2, accent[0]);
  dot(3, 1 + bob, accent[0]);
  rect(3, 4 + bob, 1, 14, wood[1]);
  dot(4, 5 + bob, wood[0]);

  rect(6, 16, 2, 6, hide[0]);
  rect(9, 16, 2, 6, hide[1]);
  rect(14, 16, 2, 6, hide[0]);
  rect(17, 16, 2, 6, hide[1]);
  rect(6, 21, 2, 2, hoof[0]);
  rect(9, 21, 2, 2, hoof[1]);
  rect(14, 21, 2, 2, hoof[0]);
  rect(17, 21, 2, 2, hoof[1]);
  rect(7, 12, 11, 6, hide[1]);
  rect(6, 14, 2, 4, hide[0]);
  rect(17, 13, 2, 5, hide[0]);
  rect(8, 12, 9, 2, hide[0]);
  rect(11 + tailShift, 17, 2, 5, hair[0]);
  dot(12 + tailShift, 22, hair[1]);

  rect(8, 8 + bob, 8, 6, cloth[1]);
  rect(9, 8 + bob, 7, 2, cloth[0]);
  rect(7, 10 + bob, 2, 4, skin[0]);
  rect(16, 10 + bob, 2, 4, skin[1]);
  rect(4, 12 + bob, 4, 2, skin[1]);
  rect(9, 12 + bob, 7, 1, accent[1]);
  dot(15, 12 + bob, accent[0]);

  rect(10, 2 + bob, 5, 1, hair[1]);
  rect(9, 3 + bob, 7, 2, hair[0]);
  rect(9, 5 + bob, 7, 4, hair[0]);
  rect(9, 7 + bob, 7, 2, hair[1]);
  dot(8, 6 + bob, skin[1]);
  dot(16, 6 + bob, skin[0]);
}

function drawCentaurSide(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(20, 2 + bob, 2, 2, accent[0]);
  dot(21, 1 + bob, accent[0]);
  dot(22, 2 + bob, accent[1]);
  rect(21, 4 + bob, 1, 14, wood[1]);
  dot(20, 5 + bob, wood[0]);

  rect(5, 16, 2, 6, hide[1]);
  rect(9, 16, 2, 6, hide[1]);
  rect(16, 16, 2, 6, hide[0]);
  rect(19, 16, 2, 6, hide[0]);
  rect(5, 21, 2, 2, hoof[1]);
  rect(9, 21, 2, 2, hoof[1]);
  rect(16, 21, 2, 2, hoof[0]);
  rect(19, 21, 2, 2, hoof[0]);
  rect(4, 12, 16, 6, hide[0]);
  rect(5, 16, 14, 2, hide[1]);
  rect(17, 11, 4, 6, hide[0]);
  dot(20, 12, hide[1]);
  rect(2, 12 + tailLift, 3, 2, hair[0]);
  dot(1, 12 + tailLift, hair[1]);
  dot(2, 14 + tailLift, hair[1]);
  rect(10, 12, 6, 1, accent[1]);
  dot(15, 12, accent[0]);

  rect(11, 7 + bob, 7, 7, cloth[0]);
  rect(12, 12 + bob, 6, 2, cloth[1]);
  rect(17, 9 + bob, 3, 4, skin[0]);
  rect(19, 11 + bob, 3, 2, skin[1]);
  rect(12, 2 + bob, 5, 1, hair[1]);
  rect(11, 3 + bob, 7, 2, hair[0]);
  rect(12, 5 + bob, 6, 4, skin[0]);
  rect(11, 5 + bob, 1, 4, hair[1]);
  rect(18, 6 + bob, 2, 2, skin[0]);
  dot(18, 6 + bob, ink);
  dot(17, 8 + bob, hair[1]);
}

function drawCentaur(paint, bob, frame, colors) {
  if (paint.view === 'up') drawCentaurUp(paint, bob, frame, colors);
  else if (paint.view === 'right') drawCentaurSide(paint, bob, frame, colors);
  else drawCentaurDown(paint, bob, frame, colors);
}

function drawClovenLegsDown(rect, hide, hoof) {
  rect(8, 16, 2, 4, hide[0]);
  rect(7, 18, 2, 3, hide[1]);
  rect(6, 20, 3, 1, hoof[1]);
  rect(6, 21, 1, 2, hoof[1]);
  rect(8, 21, 1, 2, hoof[0]);
  rect(14, 16, 2, 4, hide[1]);
  rect(15, 18, 2, 3, hide[0]);
  rect(15, 20, 3, 1, hoof[1]);
  rect(15, 21, 1, 2, hoof[1]);
  rect(17, 21, 1, 2, hoof[0]);
}

function drawSatyrDown(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(19, 3 + bob, 2, 1, accent[0]);
  rect(20, 4 + bob, 1, 16, wood[1]);
  dot(19, 4 + bob, wood[0]);
  dot(19, 5 + bob, wood[0]);
  dot(18, 4 + bob, wood[0]);
  drawClovenLegsDown(rect, hide, hoof);

  rect(8, 10 + bob, 8, 7, cloth[0]);
  rect(9, 15 + bob, 6, 2, cloth[1]);
  rect(8, 14 + bob, 8, 1, accent[1]);
  dot(12, 14 + bob, accent[0]);
  rect(6, 11 + bob, 3, 5, skin[1]);
  rect(5, 15 + bob, 3, 2, skin[0]);
  rect(15, 11 + bob, 3, 5, skin[0]);
  rect(17, 14 + bob, 4, 2, skin[1]);
  rect(16, 14 + tailLift, 3, 2, hair[0]);
  dot(19, 13 + tailLift, hair[1]);

  rect(10, 4 + bob, 4, 1, hair[0]);
  rect(9, 5 + bob, 6, 5, skin[0]);
  rect(9, 5 + bob, 1, 5, hair[1]);
  rect(10, 5 + bob, 5, 2, hair[0]);
  dot(8, 7 + bob, skin[1]);
  dot(15, 7 + bob, skin[0]);
  dot(11, 7 + bob, ink);
  dot(14, 7 + bob, ink);
  dot(12, 9 + bob, hair[1]);

  dot(9, 4 + bob, accent[1]);
  dot(8, 4 + bob, accent[0]);
  dot(7, 4 + bob, accent[0]);
  dot(7, 3 + bob, accent[0]);
  dot(6, 3 + bob, accent[1]);
  dot(6, 2 + bob, accent[1]);
  dot(14, 4 + bob, accent[1]);
  dot(15, 4 + bob, accent[0]);
  dot(16, 4 + bob, accent[0]);
  dot(16, 3 + bob, accent[0]);
  dot(17, 3 + bob, accent[1]);
  dot(17, 2 + bob, accent[1]);
}

function drawSatyrUp(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailShift = frame ? 1 : 0;

  rect(3, 3 + bob, 2, 1, accent[0]);
  rect(3, 4 + bob, 1, 16, wood[1]);
  dot(4, 4 + bob, wood[0]);
  dot(4, 5 + bob, wood[0]);
  dot(5, 4 + bob, wood[0]);
  drawClovenLegsDown(rect, hide, hoof);

  rect(8, 10 + bob, 8, 7, cloth[1]);
  rect(9, 10 + bob, 6, 2, cloth[0]);
  rect(9, 15 + bob, 6, 2, cloth[0]);
  rect(8, 14 + bob, 8, 1, accent[1]);
  dot(15, 14 + bob, accent[0]);
  rect(6, 11 + bob, 3, 5, skin[0]);
  rect(3, 14 + bob, 4, 2, skin[1]);
  rect(15, 11 + bob, 3, 5, skin[1]);
  rect(11 + tailShift, 15, 2, 4, hair[0]);
  dot(12 + tailShift, 19, hair[1]);

  rect(10, 4 + bob, 4, 1, hair[0]);
  rect(9, 5 + bob, 6, 5, hair[0]);
  rect(9, 8 + bob, 6, 2, hair[1]);
  dot(8, 7 + bob, skin[1]);
  dot(15, 7 + bob, skin[0]);
  dot(9, 4 + bob, accent[1]);
  dot(8, 4 + bob, accent[0]);
  dot(7, 4 + bob, accent[0]);
  dot(7, 3 + bob, accent[0]);
  dot(6, 3 + bob, accent[1]);
  dot(6, 2 + bob, accent[1]);
  dot(14, 4 + bob, accent[1]);
  dot(15, 4 + bob, accent[0]);
  dot(16, 4 + bob, accent[0]);
  dot(16, 3 + bob, accent[0]);
  dot(17, 3 + bob, accent[1]);
  dot(17, 2 + bob, accent[1]);
}

function drawSatyrSide(paint, bob, frame, colors) {
  const { rect, dot } = paint;
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(20, 3 + bob, 2, 1, accent[0]);
  rect(21, 4 + bob, 1, 16, wood[1]);
  dot(20, 4 + bob, wood[0]);
  dot(20, 5 + bob, wood[0]);
  dot(19, 4 + bob, wood[0]);

  rect(10, 16, 2, 4, hide[1]);
  rect(9, 18, 2, 3, hide[0]);
  rect(8, 20, 3, 1, hoof[1]);
  rect(8, 21, 1, 2, hoof[1]);
  rect(10, 21, 1, 2, hoof[0]);
  rect(15, 16, 2, 4, hide[0]);
  rect(16, 18, 2, 3, hide[1]);
  rect(16, 20, 3, 1, hoof[1]);
  rect(16, 21, 1, 2, hoof[1]);
  rect(18, 21, 1, 2, hoof[0]);

  rect(9, 10 + bob, 8, 7, cloth[0]);
  rect(10, 15 + bob, 7, 2, cloth[1]);
  rect(10, 14 + bob, 7, 1, accent[1]);
  dot(16, 14 + bob, accent[0]);
  rect(7, 11 + bob, 3, 5, skin[1]);
  rect(8, 15 + bob, 3, 2, skin[0]);
  rect(16, 11 + bob, 3, 5, skin[0]);
  rect(18, 14 + bob, 4, 2, skin[1]);
  rect(6, 14 + tailLift, 4, 2, hair[0]);
  dot(5, 14 + tailLift, hair[1]);

  rect(11, 4 + bob, 4, 1, hair[0]);
  rect(10, 5 + bob, 7, 5, skin[0]);
  rect(10, 5 + bob, 1, 5, hair[1]);
  rect(11, 5 + bob, 5, 2, hair[0]);
  rect(17, 7 + bob, 2, 2, skin[0]);
  dot(17, 7 + bob, ink);
  dot(16, 9 + bob, hair[1]);
  dot(11, 4 + bob, accent[1]);
  dot(10, 4 + bob, accent[0]);
  dot(10, 3 + bob, accent[0]);
  dot(9, 3 + bob, accent[0]);
  dot(9, 2 + bob, accent[1]);
  dot(8, 2 + bob, accent[1]);
}

function drawSatyr(paint, bob, frame, colors) {
  if (paint.view === 'up') drawSatyrUp(paint, bob, frame, colors);
  else if (paint.view === 'right') drawSatyrSide(paint, bob, frame, colors);
  else drawSatyrDown(paint, bob, frame, colors);
}

const DRAWERS = Object.freeze({
  giant: drawGiant,
  centaur: drawCentaur,
  satyr: drawSatyr,
});

function renderLargeHybrid({ context, family, variant, direction, animation, frame }) {
  assert(context && typeof context.clearRect === 'function' && typeof context.fillRect === 'function', 'Large-hybrid expansion rendering needs a 2D pixel context.');
  assert(animation.id === 'idle', 'EN-E03 common-baseline renderer currently authorizes Idle only.');
  const archetype = variant.rendererData.archetype;
  const draw = DRAWERS[archetype];
  assert(draw, 'Unknown large-hybrid archetype ' + archetype + '.');
  const painter = createPainter(context, direction);
  const colors = resolveColors(variant.rendererData);
  context.clearRect(0, 0, SIZE, SIZE);
  draw(painter, frame === 1 ? 1 : 0, frame, colors);
  return Object.freeze({
    family: family.id,
    variant: variant.id,
    direction,
    animation: animation.id,
    frame,
    archetype,
  });
}

export const EN_E03_LARGE_HYBRID_RENDERER = Object.freeze({
  key: 'large-hybrid-v2',
  chassis: 'large-hybrid-v2',
  render: renderLargeHybrid,
});
