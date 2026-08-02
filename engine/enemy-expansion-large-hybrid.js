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
  return {
    view,
    rect(x, y, width, height, fill) {
      assert(
        [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
        'Large-hybrid pixel rectangles must use positive integer geometry.',
      );
      context.fillStyle = fill;
      context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
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

function drawGiantDown(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, wood, accent } = colors;

  rect(19, 7 + bob, 3, 13, ink);
  rect(20, 8 + bob, 1, 11, wood[0]);
  rect(18, 5 + bob, 4, 4, ink);
  rect(19, 6 + bob, 3, 2, frame ? wood[0] : wood[1]);

  rect(5, 15, 6, 8, ink);
  rect(13, 15, 6, 8, ink);
  rect(6, 16, 4, 5, cloth[1]);
  rect(14, 16, 4, 5, cloth[0]);
  rect(5, 20, 6, 3, hide[1]);
  rect(13, 20, 6, 3, hide[1]);

  rect(3, 9 + bob, 5, 9, ink);
  rect(16, 9 + bob, 5, 9, ink);
  rect(4, 10 + bob, 3, 7, skin[1]);
  rect(17, 10 + bob, 3, 7, skin[0]);
  rect(4, 8 + bob, 16, 10, ink);
  rect(5, 9 + bob, 14, 8, cloth[0]);
  rect(5, 14 + bob, 14, 3, cloth[1]);
  rect(8, 9 + bob, 8, 2, accent[0]);

  rect(7, 2 + bob, 10, 8, ink);
  rect(8, 3 + bob, 8, 6, skin[0]);
  rect(8, 2 + bob, 8, 3, hair[1]);
  rect(7, 4 + bob, 2, 3, hair[0]);
  rect(15, 4 + bob, 2, 3, hair[0]);
  rect(9, 6 + bob, 2, 1, ink);
  rect(13, 6 + bob, 2, 1, ink);
  rect(11, 8 + bob, 3, 1, hair[1]);
}

function drawGiantUp(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, wood, accent } = colors;

  rect(2, 7 + bob, 3, 13, ink);
  rect(3, 8 + bob, 1, 11, wood[0]);
  rect(2, 5 + bob, 4, 4, ink);
  rect(3, 6 + bob, 3, 2, frame ? wood[0] : wood[1]);

  rect(5, 15, 6, 8, ink);
  rect(13, 15, 6, 8, ink);
  rect(6, 16, 4, 5, cloth[1]);
  rect(14, 16, 4, 5, cloth[0]);
  rect(5, 20, 6, 3, hide[1]);
  rect(13, 20, 6, 3, hide[1]);
  rect(3, 9 + bob, 5, 9, ink);
  rect(16, 9 + bob, 5, 9, ink);
  rect(4, 10 + bob, 3, 7, skin[1]);
  rect(17, 10 + bob, 3, 7, skin[0]);
  rect(4, 8 + bob, 16, 10, ink);
  rect(5, 9 + bob, 14, 8, cloth[1]);
  rect(7, 9 + bob, 10, 2, accent[1]);
  rect(7, 2 + bob, 10, 8, ink);
  rect(8, 3 + bob, 8, 6, hair[0]);
  rect(8, 7 + bob, 8, 2, hair[1]);
}

function drawGiantSide(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, wood, accent } = colors;

  rect(19, 5 + bob, 3, 16, ink);
  rect(20, 6 + bob, 1, 14, wood[0]);
  rect(18, 4 + bob, 4, 4, ink);
  rect(19, 5 + bob, 3, 2, frame ? wood[0] : wood[1]);

  rect(7, 15, 6, 8, ink);
  rect(13, 15, 6, 8, ink);
  rect(8, 16, 4, 5, cloth[1]);
  rect(14, 16, 4, 5, cloth[0]);
  rect(6, 20, 7, 3, hide[1]);
  rect(13, 20, 7, 3, hide[1]);

  rect(5, 8 + bob, 14, 10, ink);
  rect(6, 9 + bob, 12, 8, cloth[0]);
  rect(6, 14 + bob, 12, 3, cloth[1]);
  rect(8, 9 + bob, 8, 2, accent[0]);
  rect(15, 9 + bob, 5, 8, ink);
  rect(16, 10 + bob, 3, 6, skin[0]);

  rect(8, 2 + bob, 10, 8, ink);
  rect(9, 3 + bob, 8, 6, skin[0]);
  rect(16, 5 + bob, 3, 3, ink);
  rect(16, 5 + bob, 2, 2, skin[1]);
  rect(9, 2 + bob, 7, 3, hair[1]);
  rect(9, 4 + bob, 2, 4, hair[0]);
  rect(15, 5 + bob, 1, 1, ink);
  rect(14, 8 + bob, 3, 1, hair[1]);
}

function drawGiant(rect, view, bob, frame, colors) {
  if (view === 'up') drawGiantUp(rect, bob, frame, colors);
  else if (view === 'right') drawGiantSide(rect, bob, frame, colors);
  else drawGiantDown(rect, bob, frame, colors);
}

function drawCentaurDown(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(18, 13 + tailLift, 4, 4, ink);
  rect(19, 14 + tailLift, 3, 2, hair[0]);

  for (const x of [4, 8, 13, 17]) {
    rect(x, 16, 3, 7, ink);
    rect(x + 1, 17, 1, 4, hide[x < 11 ? 1 : 0]);
    rect(x, 21, 3, 2, hoof[1]);
  }
  rect(4, 11, 16, 8, ink);
  rect(5, 12, 14, 6, hide[0]);
  rect(5, 16, 14, 2, hide[1]);
  rect(3, 13, 4, 5, ink);
  rect(4, 14, 3, 3, hide[1]);

  rect(19, 2 + bob, 3, 18, ink);
  rect(20, 3 + bob, 1, 16, wood[0]);
  rect(19, 1 + bob, 3, 3, accent[0]);

  rect(7, 7 + bob, 10, 9, ink);
  rect(8, 8 + bob, 8, 7, cloth[0]);
  rect(8, 13 + bob, 8, 2, cloth[1]);
  rect(6, 9 + bob, 3, 6, ink);
  rect(15, 9 + bob, 4, 6, ink);
  rect(7, 10 + bob, 2, 4, skin[1]);
  rect(16, 10 + bob, 2, 4, skin[0]);

  rect(8, 1 + bob, 8, 8, ink);
  rect(9, 2 + bob, 6, 6, skin[0]);
  rect(8, 1 + bob, 8, 3, hair[1]);
  rect(7, 3 + bob, 2, 3, hair[0]);
  rect(15, 3 + bob, 2, 3, hair[0]);
  rect(10, 5 + bob, 1, 1, ink);
  rect(13, 5 + bob, 1, 1, ink);
}

function drawCentaurUp(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailShift = frame ? 1 : 0;

  for (const x of [4, 8, 13, 17]) {
    rect(x, 16, 3, 7, ink);
    rect(x + 1, 17, 1, 4, hide[x < 11 ? 1 : 0]);
    rect(x, 21, 3, 2, hoof[1]);
  }
  rect(4, 11, 16, 8, ink);
  rect(5, 12, 14, 6, hide[1]);
  rect(5, 12, 14, 2, hide[0]);
  rect(10 + tailShift, 16, 4, 7, ink);
  rect(11 + tailShift, 17, 2, 6, hair[0]);

  rect(2, 2 + bob, 3, 18, ink);
  rect(3, 3 + bob, 1, 16, wood[0]);
  rect(2, 1 + bob, 3, 3, accent[0]);
  rect(7, 7 + bob, 10, 9, ink);
  rect(8, 8 + bob, 8, 7, cloth[1]);
  rect(8, 8 + bob, 8, 2, cloth[0]);
  rect(6, 9 + bob, 3, 6, ink);
  rect(15, 9 + bob, 3, 6, ink);
  rect(7, 10 + bob, 2, 4, skin[1]);
  rect(15, 10 + bob, 2, 4, skin[0]);
  rect(8, 1 + bob, 8, 8, ink);
  rect(9, 2 + bob, 6, 6, hair[0]);
  rect(8, 1 + bob, 8, 3, hair[1]);
  rect(8, 6 + bob, 8, 2, hair[1]);
}

function drawCentaurSide(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(1, 12 + tailLift, 5, 4, ink);
  rect(2, 13 + tailLift, 4, 2, hair[0]);
  for (const x of [5, 9, 16, 19]) {
    rect(x, 16, 3, 7, ink);
    rect(x + 1, 17, 1, 4, hide[x < 12 ? 1 : 0]);
    rect(x, 21, 3, 2, hoof[1]);
  }
  rect(4, 11, 17, 8, ink);
  rect(5, 12, 15, 6, hide[0]);
  rect(5, 16, 15, 2, hide[1]);
  rect(16, 10, 6, 8, ink);
  rect(17, 11, 4, 6, hide[0]);

  rect(20, 2 + bob, 2, 19, ink);
  rect(20, 3 + bob, 1, 17, wood[0]);
  rect(19, 1 + bob, 3, 3, accent[0]);
  rect(10, 7 + bob, 10, 9, ink);
  rect(11, 8 + bob, 8, 7, cloth[0]);
  rect(11, 13 + bob, 8, 2, cloth[1]);
  rect(17, 9 + bob, 4, 6, ink);
  rect(18, 10 + bob, 2, 4, skin[0]);
  rect(12, 1 + bob, 8, 8, ink);
  rect(13, 2 + bob, 6, 6, skin[0]);
  rect(18, 4 + bob, 3, 3, ink);
  rect(18, 4 + bob, 2, 2, skin[1]);
  rect(12, 1 + bob, 7, 3, hair[1]);
  rect(12, 3 + bob, 2, 5, hair[0]);
  rect(17, 5 + bob, 1, 1, ink);
}

function drawCentaur(rect, view, bob, frame, colors) {
  if (view === 'up') drawCentaurUp(rect, bob, frame, colors);
  else if (view === 'right') drawCentaurSide(rect, bob, frame, colors);
  else drawCentaurDown(rect, bob, frame, colors);
}

function drawSatyrDown(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(19, 4 + bob, 3, 18, ink);
  rect(20, 5 + bob, 1, 16, wood[0]);
  rect(18, 3 + bob, 4, 4, ink);
  rect(19, 4 + bob, 2, 2, accent[0]);

  rect(7, 14, 4, 6, ink);
  rect(13, 14, 4, 6, ink);
  rect(6, 18, 4, 4, ink);
  rect(14, 18, 4, 4, ink);
  rect(4, 20, 6, 3, hoof[1]);
  rect(14, 20, 6, 3, hoof[1]);
  rect(8, 15, 2, 4, hide[0]);
  rect(14, 15, 2, 4, hide[1]);
  rect(17, 13 + tailLift, 4, 4, ink);
  rect(18, 14 + tailLift, 3, 2, hair[0]);

  rect(7, 8 + bob, 10, 9, ink);
  rect(8, 9 + bob, 8, 7, cloth[0]);
  rect(8, 14 + bob, 8, 2, cloth[1]);
  rect(5, 9 + bob, 4, 7, ink);
  rect(15, 9 + bob, 4, 7, ink);
  rect(6, 10 + bob, 2, 5, skin[1]);
  rect(16, 10 + bob, 2, 5, skin[0]);

  rect(8, 2 + bob, 8, 8, ink);
  rect(9, 3 + bob, 6, 6, skin[0]);
  rect(6, 1 + bob, 4, 4, ink);
  rect(14, 1 + bob, 4, 4, ink);
  rect(7, 1 + bob, 3, 3, hair[1]);
  rect(14, 1 + bob, 3, 3, hair[1]);
  rect(7, 4 + bob, 2, 2, skin[1]);
  rect(15, 4 + bob, 2, 2, skin[1]);
  rect(9, 2 + bob, 6, 3, hair[0]);
  rect(10, 6 + bob, 1, 1, ink);
  rect(13, 6 + bob, 1, 1, ink);
}

function drawSatyrUp(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;

  rect(2, 4 + bob, 3, 18, ink);
  rect(3, 5 + bob, 1, 16, wood[0]);
  rect(2, 3 + bob, 4, 4, ink);
  rect(3, 4 + bob, 2, 2, accent[0]);
  rect(7, 14, 4, 6, ink);
  rect(13, 14, 4, 6, ink);
  rect(6, 18, 4, 4, ink);
  rect(14, 18, 4, 4, ink);
  rect(4, 20, 6, 3, hoof[1]);
  rect(14, 20, 6, 3, hoof[1]);
  rect(8, 15, 2, 4, hide[0]);
  rect(14, 15, 2, 4, hide[1]);
  rect(10 + frame, 14, 4, 5, ink);
  rect(11 + frame, 15, 2, 3, hair[0]);
  rect(7, 8 + bob, 10, 9, ink);
  rect(8, 9 + bob, 8, 7, cloth[1]);
  rect(8, 9 + bob, 8, 2, cloth[0]);
  rect(5, 9 + bob, 4, 7, ink);
  rect(15, 9 + bob, 4, 7, ink);
  rect(6, 10 + bob, 2, 5, skin[1]);
  rect(16, 10 + bob, 2, 5, skin[0]);
  rect(8, 2 + bob, 8, 8, ink);
  rect(9, 3 + bob, 6, 6, hair[0]);
  rect(6, 1 + bob, 4, 4, ink);
  rect(14, 1 + bob, 4, 4, ink);
  rect(7, 1 + bob, 3, 3, hair[1]);
  rect(14, 1 + bob, 3, 3, hair[1]);
  rect(9, 7 + bob, 6, 2, hair[1]);
}

function drawSatyrSide(rect, bob, frame, colors) {
  const { ink, skin, hair, cloth, hide, hoof, wood, accent } = colors;
  const tailLift = frame ? -1 : 0;

  rect(19, 4 + bob, 3, 18, ink);
  rect(20, 5 + bob, 1, 16, wood[0]);
  rect(18, 3 + bob, 4, 4, ink);
  rect(19, 4 + bob, 2, 2, accent[0]);
  rect(7, 13 + tailLift, 5, 4, ink);
  rect(8, 14 + tailLift, 4, 2, hair[0]);

  rect(9, 14, 4, 6, ink);
  rect(14, 14, 4, 6, ink);
  rect(8, 18, 4, 4, ink);
  rect(15, 18, 4, 4, ink);
  rect(6, 20, 6, 3, hoof[1]);
  rect(15, 20, 6, 3, hoof[1]);
  rect(10, 15, 2, 4, hide[1]);
  rect(15, 15, 2, 4, hide[0]);

  rect(8, 8 + bob, 10, 9, ink);
  rect(9, 9 + bob, 8, 7, cloth[0]);
  rect(9, 14 + bob, 8, 2, cloth[1]);
  rect(16, 9 + bob, 4, 7, ink);
  rect(17, 10 + bob, 2, 5, skin[0]);
  rect(9, 2 + bob, 9, 8, ink);
  rect(10, 3 + bob, 7, 6, skin[0]);
  rect(16, 4 + bob, 3, 3, ink);
  rect(16, 4 + bob, 2, 2, skin[1]);
  rect(8, 1 + bob, 5, 4, ink);
  rect(9, 1 + bob, 4, 3, hair[1]);
  rect(10, 2 + bob, 6, 3, hair[0]);
  rect(15, 6 + bob, 1, 1, ink);
}

function drawSatyr(rect, view, bob, frame, colors) {
  if (view === 'up') drawSatyrUp(rect, bob, frame, colors);
  else if (view === 'right') drawSatyrSide(rect, bob, frame, colors);
  else drawSatyrDown(rect, bob, frame, colors);
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
  draw(painter.rect, painter.view, frame === 1 ? 1 : 0, frame, colors);
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
  key: 'large-hybrid-v1',
  chassis: 'large-hybrid-v1',
  render: renderLargeHybrid,
});
