import { SIZE } from './catalogs.js';
import { drawSprite } from './renderer.js';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function assertColor(value, label) {
  assert(typeof value === 'string' && HEX_COLOR.test(value), label + ' must be a six-digit hex color.');
  return value;
}

const DEFAULT_ACTOR = Object.freeze({
  species: 'human',
  bodyBuild: 'classic',
  skin: 'pale',
  hairStyle: 'short',
  hairColor: 'black',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'tunic',
  outfitColor: 'charcoal',
  outfitTier: 'tier1',
  weapon: 'none',
  weaponTier: 'tier1',
  shield: 'none',
  shieldTier: 'tier1',
  offhand: 'none',
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  return (x, y, width, height, color) => {
    assertColor(color, 'Humanoid identity overlay color');
    const paintX = mirrored ? SIZE - x - width : x;
    context.fillStyle = color;
    context.fillRect(paintX, y, width, height);
  };
}

function raggedTabard(paint, direction, bob, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Ragged tabard cloth');
  const shade = assertColor(colors[1], 'Ragged tabard shade');
  if (view === 'right') {
    paint(10, 15 + bob, 4, 1, cloth);
    paint(10, 16 + bob, 2, 3, cloth);
    paint(12, 16 + bob, 2, 2, shade);
    paint(10, 19, 1, 1, shade);
    return;
  }
  paint(10, 15 + bob, 4, 1, cloth);
  paint(10, 16 + bob, 2, 3, cloth);
  paint(12, 16 + bob, 2, 2, shade);
  paint(view === 'down' ? 10 : 13, 19, 1, 1, shade);
}

function crookedHat(paint, direction, bob, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Crooked hat cloth');
  const shade = assertColor(colors[1], 'Crooked hat shade');
  const band = assertColor(colors[2], 'Crooked hat band');
  if (view === 'right') {
    paint(12, 1 + bob, 1, 1, shade);
    paint(11, 2 + bob, 2, 1, cloth);
    paint(10, 3 + bob, 4, 1, cloth);
    paint(9, 4 + bob, 6, 2, cloth);
    paint(9, 6 + bob, 6, 1, band);
    paint(7, 7 + bob, 10, 1, shade);
    return;
  }
  paint(10, 1 + bob, 1, 1, shade);
  paint(9, 2 + bob, 2, 1, cloth);
  paint(9, 3 + bob, 4, 1, cloth);
  paint(8, 4 + bob, 6, 2, cloth);
  paint(8, 6 + bob, 6, 1, band);
  paint(6, 7 + bob, 11, 1, shade);
}

function pirateSash(paint, direction, bob, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const sash = assertColor(colors[0], 'Pirate sash cloth');
  const shade = assertColor(colors[1], 'Pirate sash shade');
  const buckle = assertColor(colors[2], 'Pirate sash buckle');
  if (view === 'right') {
    paint(9, 16 + bob, 6, 1, sash);
    paint(13, 16 + bob, 1, 1, buckle);
    paint(9, 17 + bob, 1, 2, sash);
    paint(8, 19, 1, 1, shade);
    return;
  }
  paint(8, 16 + bob, 8, 1, sash);
  paint(12, 16 + bob, 1, 1, buckle);
  const tailX = view === 'down' ? 8 : 15;
  paint(tailX, 17 + bob, 1, 2, sash);
  paint(tailX + (view === 'down' ? -1 : 0), 19, 1, 1, shade);
}

function boneCharms(paint, direction, bob, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const bone = assertColor(colors[0], 'Bone charm highlight');
  const shade = assertColor(colors[1], 'Bone charm shade');
  if (view === 'right') {
    paint(13, 13 + bob, 1, 1, bone);
    paint(14, 14 + bob, 1, 2, bone);
    paint(13, 16 + bob, 1, 1, shade);
    return;
  }
  const left = view === 'down' ? 10 : 13;
  paint(left, 13 + bob, 1, 1, bone);
  paint(left + 1, 14 + bob, 1, 1, shade);
  paint(left + 2, 15 + bob, 1, 1, bone);
  paint(left + 1, 16 + bob, 1, 1, bone);
}

function flaskKit(paint, direction, bob, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const glass = assertColor(colors[0], 'Flask glass');
  const liquid = assertColor(colors[1], 'Flask liquid');
  const cork = assertColor(colors[2], 'Flask cork');
  const apron = assertColor(colors[3], 'Alchemist apron');
  const shade = assertColor(colors[4], 'Alchemist apron shade');

  if (view === 'right') {
    paint(12, 14 + bob, 2, 4, apron);
    paint(12, 17 + bob, 2, 1, shade);
    paint(16, 13 + bob, 1, 1, cork);
    paint(15, 14 + bob, 3, 2, glass);
    paint(16, 15 + bob, 2, 1, liquid);
    return;
  }

  if (view === 'up') {
    paint(8, 16 + bob, 8, 1, shade);
    paint(9, 17 + bob, 1, 1, liquid);
    paint(14, 17 + bob, 1, 1, glass);
  } else {
    paint(11, 13 + bob, 2, 5, apron);
    paint(10, 16 + bob, 4, 1, apron);
    paint(11, 17 + bob, 2, 1, shade);
    paint(9, 16 + bob, 1, 1, liquid);
    paint(14, 16 + bob, 1, 1, glass);
  }
  const flaskX = view === 'down' ? 17 : 6;
  paint(flaskX, 13 + bob, 1, 1, cork);
  paint(flaskX - 1, 14 + bob, 3, 2, glass);
  paint(flaskX, 15 + bob, 2, 1, liquid);
}

const IDENTITY_OVERLAYS = Object.freeze({
  'crooked-hat': crookedHat,
  'ragged-tabard': raggedTabard,
  'pirate-sash': pirateSash,
  'bone-charms': boneCharms,
  'flask-kit': flaskKit,
});

function playerSpec(rendererData) {
  const actor = rendererData.actor;
  assert(actor && typeof actor === 'object' && !Array.isArray(actor), 'Humanoid expansion variants need actor renderer data.');
  const palette = actor.palette === undefined ? undefined : {
    skin: actor.palette.skin,
    hair: actor.palette.hair,
    outfit: actor.palette.outfit,
  };
  return {
    ...DEFAULT_ACTOR,
    ...actor,
    palette,
    kind: 'player',
  };
}

function drawIdentityOverlays(context, rendererData, direction, frame) {
  const overlays = rendererData.identity?.overlays || [];
  assert(Array.isArray(overlays), 'Humanoid expansion identity overlays must be an array.');
  const paint = createPainter(context, direction);
  const bob = frame === 1 ? 1 : 0;
  for (const overlay of overlays) {
    assert(overlay && typeof overlay === 'object' && !Array.isArray(overlay), 'Every humanoid identity overlay must be an object.');
    const draw = IDENTITY_OVERLAYS[overlay.id];
    assert(draw, 'Unknown humanoid identity overlay ' + overlay.id + '.');
    assert(Array.isArray(overlay.colors), 'Humanoid identity overlay ' + overlay.id + ' needs colors.');
    draw(paint, direction, bob, overlay.colors);
  }
}

function renderHumanoidThreat({ context, family, variant, direction, animation, frame }) {
  assert(context && typeof context.clearRect === 'function' && typeof context.fillRect === 'function', 'Humanoid expansion rendering needs a 2D pixel context.');
  assert(animation.id === 'idle', 'EN-E01 baseline candidates are Idle-only until visual approval.');
  const actor = playerSpec(variant.rendererData);
  drawSprite(context, actor, direction, animation.id, frame, {
    shadow: false,
    onOutOfBounds: typeof context.onOutOfBounds === 'function'
      ? (write) => context.onOutOfBounds({ ...write, family: family.id, variant: variant.id })
      : undefined,
  });
  drawIdentityOverlays(context, variant.rendererData, direction, frame);
  return Object.freeze({
    family: family.id,
    variant: variant.id,
    direction,
    animation: animation.id,
    frame,
  });
}

export const EN_E01_HUMANOID_RENDERER = Object.freeze({
  key: 'humanoid-threat-v1',
  chassis: 'humanoid-v1',
  render: renderHumanoidThreat,
});
