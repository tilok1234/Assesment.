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

function resolveEnemyAnimation(animationId, frame) {
  if (animationId === 'cast') return { id: 'attack', frame };
  if (animationId === 'death') return { id: 'hurt', frame: Math.min(frame, 1) };
  return { id: animationId, frame };
}

function animationPose(animationId, frame) {
  const pose = {
    animation: animationId,
    frame,
    bob: 0,
    leg: 0,
    arm: 0,
    attackPhase: 'hold',
    flash: false,
  };
  if (animationId === 'idle') pose.bob = frame === 1 ? 1 : 0;
  if (animationId === 'walk') {
    pose.bob = frame === 1 || frame === 3 ? 1 : 0;
    pose.leg = frame === 0 ? 1 : frame === 2 ? -1 : 0;
    pose.arm = pose.leg;
  }
  if (animationId === 'attack') pose.attackPhase = ['wind', 'strike', 'strike', 'recover'][frame] || 'recover';
  if (animationId === 'hurt') pose.flash = frame === 1;
  return Object.freeze(pose);
}

function createPainter(context, direction, flash) {
  const mirrored = direction === 'left';
  return (x, y, width, height, color) => {
    const resolvedColor = flash ? '#ffffff' : assertColor(color, 'Humanoid identity overlay color');
    const paintX = mirrored ? SIZE - x - width : x;
    context.fillStyle = resolvedColor;
    context.fillRect(paintX, y, width, height);
  };
}

function raggedTabard(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const bob = pose.bob;
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

function crookedHat(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const bob = pose.bob;
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

function pirateSash(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const bob = pose.bob;
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

function boneCharms(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const bob = pose.bob;
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

function keeperCuff(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Keeper cuff cloth');
  const trim = assertColor(colors[1], 'Keeper cuff trim');
  const armOffset = pose.animation === 'walk' ? -pose.arm : pose.attackPhase === 'wind' ? -1 : 0;
  if (view === 'right') {
    paint(8, 14 + pose.bob + armOffset, 2, 2, cloth);
    paint(8, 15 + pose.bob + armOffset, 1, 1, trim);
    return;
  }
  const x = view === 'down' ? 6 : 16;
  paint(x, 14 + pose.bob + armOffset, 2, 2, cloth);
  paint(x + (view === 'down' ? 1 : 0), 15 + pose.bob + armOffset, 1, 1, trim);
}

function brewerApron(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Brewer apron cloth');
  const shade = assertColor(colors[1], 'Brewer apron shade');
  const buckle = assertColor(colors[2], 'Brewer apron buckle');
  if (view === 'right') {
    paint(11, 14 + pose.bob, 3, 4, cloth);
    paint(12, 17 + pose.bob, 2, 1, shade);
    paint(13, 14 + pose.bob, 1, 1, buckle);
    return;
  }
  if (view === 'up') {
    paint(8, 16 + pose.bob, 8, 1, shade);
    paint(12, 16 + pose.bob, 1, 1, buckle);
    return;
  }
  paint(10, 13 + pose.bob, 4, 5, cloth);
  paint(11, 17 + pose.bob, 2, 1, shade);
  paint(12, 14 + pose.bob, 1, 1, buckle);
}

function graveChain(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const chain = assertColor(colors[0], 'Grave chain metal');
  const shade = assertColor(colors[1], 'Grave chain shade');
  const seal = assertColor(colors[2], 'Grave chain seal');
  if (view === 'right') {
    paint(11, 13 + pose.bob, 1, 1, chain);
    paint(12, 14 + pose.bob, 1, 1, chain);
    paint(13, 15 + pose.bob, 1, 1, shade);
    paint(13, 16 + pose.bob, 1, 1, seal);
    return;
  }
  if (view === 'up') {
    paint(10, 13 + pose.bob, 4, 1, shade);
    paint(12, 14 + pose.bob, 1, 1, seal);
    return;
  }
  paint(9, 13 + pose.bob, 1, 1, chain);
  paint(10, 14 + pose.bob, 1, 1, chain);
  paint(11, 15 + pose.bob, 1, 1, shade);
  paint(12, 16 + pose.bob, 1, 1, seal);
}

function heldFlaskPosition(view, pose) {
  if (view === 'right') {
    if (pose.attackPhase === 'wind') return { x: 14, y: 11 };
    if (pose.attackPhase === 'strike') return { x: 19, y: 10 };
    return { x: 16, y: 13 + pose.bob };
  }
  if (view === 'up') {
    if (pose.attackPhase === 'wind') return { x: 7, y: 11 };
    if (pose.attackPhase === 'strike') return { x: 3, y: 10 };
    return { x: 6, y: 13 + pose.bob };
  }
  if (pose.attackPhase === 'wind') return { x: 16, y: 11 };
  if (pose.attackPhase === 'strike') return { x: 20, y: 10 };
  return { x: 17, y: 13 + pose.bob };
}

function flaskKit(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const glass = assertColor(colors[0], 'Flask glass');
  const liquid = assertColor(colors[1], 'Flask liquid');
  const cork = assertColor(colors[2], 'Flask cork');
  const apron = assertColor(colors[3], 'Alchemist apron');
  const shade = assertColor(colors[4], 'Alchemist apron shade');

  if (view === 'right') {
    paint(12, 14 + pose.bob, 2, 4, apron);
    paint(12, 17 + pose.bob, 2, 1, shade);
  } else if (view === 'up') {
    paint(8, 16 + pose.bob, 8, 1, shade);
    paint(9, 17 + pose.bob, 1, 1, liquid);
    paint(14, 17 + pose.bob, 1, 1, glass);
  } else {
    paint(11, 13 + pose.bob, 2, 5, apron);
    paint(10, 16 + pose.bob, 4, 1, apron);
    paint(11, 17 + pose.bob, 2, 1, shade);
    paint(9, 16 + pose.bob, 1, 1, liquid);
    paint(14, 16 + pose.bob, 1, 1, glass);
  }

  const held = heldFlaskPosition(view, pose);
  paint(held.x, held.y, 1, 1, cork);
  paint(held.x - 1, held.y + 1, 3, 2, glass);
  paint(held.x, held.y + 2, 2, 1, liquid);
}

function pistol(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const metal = assertColor(colors[0], 'Pistol metal');
  const wood = assertColor(colors[1], 'Pistol grip');
  const highlight = assertColor(colors[2], 'Pistol highlight');
  let x;
  let y;
  if (view === 'right') {
    x = pose.attackPhase === 'wind' ? 13 : pose.attackPhase === 'strike' ? 17 : 15;
    y = pose.attackPhase === 'wind' ? 12 : pose.attackPhase === 'strike' ? 11 : 14 + pose.bob;
  } else if (view === 'up') {
    x = pose.attackPhase === 'wind' ? 7 : pose.attackPhase === 'strike' ? 3 : 6;
    y = pose.attackPhase === 'wind' ? 12 : pose.attackPhase === 'strike' ? 11 : 14 + pose.bob;
  } else {
    x = pose.attackPhase === 'wind' ? 14 : pose.attackPhase === 'strike' ? 17 : 15;
    y = pose.attackPhase === 'wind' ? 12 : pose.attackPhase === 'strike' ? 10 : 14 + pose.bob;
  }
  paint(x, y, 5, 1, metal);
  paint(x + 1, y + 1, 2, 2, wood);
  paint(x + 3, y, 1, 1, highlight);
}

function bosunBelt(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const belt = assertColor(colors[0], 'Bosun belt');
  const pouch = assertColor(colors[1], 'Bosun pouch');
  const buckle = assertColor(colors[2], 'Bosun buckle');
  if (view === 'right') {
    paint(9, 16 + pose.bob, 6, 1, belt);
    paint(10, 17 + pose.bob, 2, 2, pouch);
    paint(13, 16 + pose.bob, 1, 1, buckle);
    return;
  }
  paint(8, 16 + pose.bob, 8, 1, belt);
  paint(8, 17 + pose.bob, 2, 2, pouch);
  paint(14, 17 + pose.bob, 2, 2, pouch);
  paint(12, 16 + pose.bob, 1, 1, buckle);
}

function throwingGlove(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const glove = assertColor(colors[0], 'Throwing glove');
  const cuff = assertColor(colors[1], 'Throwing cuff');
  let x = view === 'right' ? 15 : view === 'down' ? 17 : 6;
  let y = 14 + pose.bob;
  if (pose.attackPhase === 'wind') {
    x += view === 'up' ? 1 : -1;
    y = 11;
  }
  if (pose.attackPhase === 'strike') {
    x += view === 'up' ? -3 : 3;
    y = 10;
  }
  paint(x, y, 2, 2, glove);
  paint(x + (view === 'up' ? 1 : -1), y + 1, 1, 1, cuff);
}

function respirator(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  if (view === 'up') return;
  const mask = assertColor(colors[0], 'Respirator mask');
  const filter = assertColor(colors[1], 'Respirator filter');
  const strap = assertColor(colors[2], 'Respirator strap');
  if (view === 'right') {
    paint(14, 8 + pose.bob, 3, 2, mask);
    paint(16, 9 + pose.bob, 2, 1, filter);
    paint(13, 8 + pose.bob, 1, 1, strap);
    return;
  }
  paint(10, 8 + pose.bob, 4, 2, mask);
  paint(11, 9 + pose.bob, 2, 1, filter);
  paint(9, 8 + pose.bob, 1, 1, strap);
  paint(14, 8 + pose.bob, 1, 1, strap);
}

function mutagenHarness(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const strap = assertColor(colors[0], 'Mutagen harness strap');
  const metal = assertColor(colors[1], 'Mutagen harness metal');
  const serum = assertColor(colors[2], 'Mutagen serum');
  const serumAlt = assertColor(colors[3], 'Mutagen alternate serum');
  if (view === 'right') {
    paint(10, 13 + pose.bob, 1, 5, strap);
    paint(13, 14 + pose.bob, 1, 3, metal);
    paint(14, 15 + pose.bob, 1, 1, serum);
    return;
  }
  if (view === 'up') {
    paint(9, 13 + pose.bob, 6, 1, strap);
    paint(9, 14 + pose.bob, 1, 3, serum);
    paint(14, 14 + pose.bob, 1, 3, serumAlt);
    return;
  }
  paint(9, 13 + pose.bob, 1, 5, strap);
  paint(14, 13 + pose.bob, 1, 5, strap);
  paint(10, 14 + pose.bob, 4, 1, metal);
  paint(9, 16 + pose.bob, 1, 1, serum);
  paint(14, 16 + pose.bob, 1, 1, serumAlt);
}

const IDENTITY_OVERLAYS = Object.freeze({
  'crooked-hat': crookedHat,
  'ragged-tabard': raggedTabard,
  'pirate-sash': pirateSash,
  'bone-charms': boneCharms,
  'keeper-cuff': keeperCuff,
  'brewer-apron': brewerApron,
  'grave-chain': graveChain,
  'flask-kit': flaskKit,
  pistol,
  'bosun-belt': bosunBelt,
  'throwing-glove': throwingGlove,
  respirator,
  'mutagen-harness': mutagenHarness,
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

function drawIdentityOverlays(context, rendererData, direction, pose) {
  const overlays = rendererData.identity?.overlays || [];
  assert(Array.isArray(overlays), 'Humanoid expansion identity overlays must be an array.');
  const paint = createPainter(context, direction, pose.flash);
  for (const overlay of overlays) {
    assert(overlay && typeof overlay === 'object' && !Array.isArray(overlay), 'Every humanoid identity overlay must be an object.');
    const draw = IDENTITY_OVERLAYS[overlay.id];
    assert(draw, 'Unknown humanoid identity overlay ' + overlay.id + '.');
    assert(Array.isArray(overlay.colors), 'Humanoid identity overlay ' + overlay.id + ' needs colors.');
    draw(paint, direction, pose, overlay.colors);
  }
}

function renderHumanoidThreat({ context, family, variant, direction, animation, frame }) {
  assert(context && typeof context.clearRect === 'function' && typeof context.fillRect === 'function', 'Humanoid expansion rendering needs a 2D pixel context.');
  const renderedAnimation = resolveEnemyAnimation(animation.id, frame);
  const pose = animationPose(renderedAnimation.id, renderedAnimation.frame);
  const actor = playerSpec(variant.rendererData);
  drawSprite(context, actor, direction, renderedAnimation.id, renderedAnimation.frame, {
    shadow: false,
    onOutOfBounds: typeof context.onOutOfBounds === 'function'
      ? (write) => context.onOutOfBounds({ ...write, family: family.id, variant: variant.id })
      : undefined,
  });
  drawIdentityOverlays(context, variant.rendererData, direction, pose);
  return Object.freeze({
    family: family.id,
    variant: variant.id,
    direction,
    animation: animation.id,
    frame,
    renderedAnimation: renderedAnimation.id,
    renderedFrame: renderedAnimation.frame,
  });
}

export const EN_E01_HUMANOID_RENDERER = Object.freeze({
  key: 'humanoid-threat-v1',
  chassis: 'humanoid-v1',
  render: renderHumanoidThreat,
});
