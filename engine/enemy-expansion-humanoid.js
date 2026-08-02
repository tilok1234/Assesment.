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

function plagueBeak(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Plague hood cloth');
  const shade = assertColor(colors[1], 'Plague mask shade');
  const lens = assertColor(colors[2], 'Plague mask lens');
  const bob = pose.bob;
  if (view === 'right') {
    paint(9, 5 + bob, 6, 2, cloth);
    paint(10, 7 + bob, 6, 3, shade);
    paint(14, 7 + bob, 1, 1, lens);
    paint(15, 8 + bob, 3, 1, cloth);
    paint(17, 9 + bob, 2, 1, shade);
    return;
  }
  if (view === 'up') {
    paint(8, 5 + bob, 8, 2, cloth);
    paint(7, 7 + bob, 10, 3, shade);
    paint(8, 9 + bob, 8, 1, cloth);
    return;
  }
  paint(8, 5 + bob, 8, 2, cloth);
  paint(9, 7 + bob, 6, 3, shade);
  paint(10, 7 + bob, 1, 1, lens);
  paint(13, 7 + bob, 1, 1, lens);
  paint(10, 9 + bob, 4, 2, cloth);
  paint(11, 11 + bob, 2, 1, shade);
}

function desertWrap(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Desert wrap cloth');
  const shade = assertColor(colors[1], 'Desert wrap shade');
  const accent = assertColor(colors[2], 'Desert wrap accent');
  const bob = pose.bob;
  if (view === 'right') {
    paint(9, 4 + bob, 7, 2, cloth);
    paint(10, 6 + bob, 6, 2, shade);
    paint(13, 8 + bob, 4, 2, cloth);
    paint(10, 12 + bob, 6, 2, cloth);
    paint(9, 13 + bob, 2, 4, accent);
    return;
  }
  paint(8, 4 + bob, 8, 2, cloth);
  paint(7, 6 + bob, 10, 2, shade);
  if (view === 'up') {
    paint(8, 8 + bob, 8, 2, cloth);
    paint(8, 12 + bob, 8, 2, accent);
    paint(15, 14 + bob, 2, 3, cloth);
    return;
  }
  paint(9, 8 + bob, 6, 2, cloth);
  paint(7, 12 + bob, 10, 2, accent);
  paint(7, 14 + bob, 2, 3, cloth);
}

function monkBeads(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const bead = assertColor(colors[0], 'Monk prayer bead');
  const cord = assertColor(colors[1], 'Monk prayer cord');
  const wrap = assertColor(colors[2], 'Monk arm wrap');
  const bob = pose.bob;
  if (view === 'right') {
    paint(11, 12 + bob, 1, 1, cord);
    paint(12, 13 + bob, 1, 1, bead);
    paint(13, 14 + bob, 1, 1, bead);
    paint(14, 15 + bob, 1, 1, cord);
    paint(15, 14 + bob, 2, 2, wrap);
    return;
  }
  if (view === 'up') {
    paint(9, 12 + bob, 6, 1, cord);
    paint(9, 13 + bob, 1, 1, bead);
    paint(14, 13 + bob, 1, 1, bead);
    paint(7, 14 + bob, 2, 2, wrap);
    paint(15, 14 + bob, 2, 2, wrap);
    return;
  }
  paint(9, 12 + bob, 1, 1, cord);
  paint(10, 13 + bob, 1, 1, bead);
  paint(11, 14 + bob, 1, 1, bead);
  paint(12, 15 + bob, 1, 1, cord);
  paint(13, 14 + bob, 1, 1, bead);
  paint(14, 13 + bob, 1, 1, bead);
  paint(6, 14 + bob, 2, 2, wrap);
  paint(16, 14 + bob, 2, 2, wrap);
}

function plainQuarterstaff(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const wood = assertColor(colors[0], 'Quarterstaff wood');
  const shade = assertColor(colors[1], 'Quarterstaff shade');
  const wrap = assertColor(colors[2], 'Quarterstaff grip wrap');
  let x = view === 'up' ? 6 : view === 'right' ? 16 : 17;
  let y = 8 + pose.bob;
  if (pose.attackPhase === 'wind') {
    x = view === 'up' ? 8 : 14;
    y = 6 + pose.bob;
  } else if (pose.attackPhase === 'strike') {
    x = view === 'up' ? 3 : view === 'right' ? 18 : 19;
    y = 9 + pose.bob;
  }
  paint(x, y, 1, 13, shade);
  paint(x + 1, y, 1, 12, wood);
  paint(x, y + 5, 2, 2, wrap);
}

function catfolkTraits(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const fur = assertColor(colors[0], 'Catfolk fur');
  const shade = assertColor(colors[1], 'Catfolk fur shade');
  const inner = assertColor(colors[2], 'Catfolk ear accent');
  const bob = pose.bob;
  const tailLift = pose.frame === 1 ? -1 : 0;
  if (view === 'right') {
    paint(11, 4 + bob, 2, 3, fur);
    paint(12, 5 + bob, 1, 1, inner);
    paint(14, 15 + bob, 3, 2, fur);
    paint(16, 16 + bob + tailLift, 3, 2, fur);
    paint(18, 15 + bob + tailLift, 2, 1, shade);
    paint(9, 20 + bob, 2, 2, shade);
    paint(13, 20 + bob, 2, 2, shade);
    return;
  }
  paint(8, 4 + bob, 2, 3, fur);
  paint(14, 4 + bob, 2, 3, fur);
  paint(9, 5 + bob, 1, 1, inner);
  paint(14, 5 + bob, 1, 1, inner);
  const tailX = view === 'up' ? 6 : 16;
  paint(tailX, 15 + bob, 2, 3, fur);
  paint(tailX + (view === 'up' ? -1 : 2), 14 + bob + tailLift, 2, 2, shade);
  paint(7, 20 + bob, 3, 2, shade);
  paint(14, 20 + bob, 3, 2, shade);
}

function goatfolkTraits(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const fur = assertColor(colors[0], 'Goatfolk fur');
  const horn = assertColor(colors[1], 'Goatfolk horn');
  const accent = assertColor(colors[2], 'Goatfolk accent');
  const bob = pose.bob;
  if (view === 'right') {
    paint(10, 3 + bob, 2, 3, fur);
    paint(11, 1 + bob, 1, 3, horn);
    paint(12, 2 + bob, 2, 1, horn);
    paint(14, 6 + bob, 3, 1, accent);
    paint(9, 20 + bob, 2, 2, horn);
    paint(13, 20 + bob, 2, 2, horn);
    return;
  }
  paint(8, 4 + bob, 2, 3, fur);
  paint(14, 4 + bob, 2, 3, fur);
  paint(6, 2 + bob, 2, 2, horn);
  paint(7, 1 + bob, 2, 2, horn);
  paint(16, 2 + bob, 2, 2, horn);
  paint(15, 1 + bob, 2, 2, horn);
  paint(7, 7 + bob, 2, 1, accent);
  paint(15, 7 + bob, 2, 1, accent);
  if (view === 'up') paint(11, 8 + bob, 2, 2, accent);
  else paint(11, 10 + bob, 2, 2, fur);
  paint(7, 20 + bob, 3, 2, horn);
  paint(14, 20 + bob, 3, 2, horn);
}

function plagueSatchel(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const leather = assertColor(colors[0], 'Plague satchel leather');
  const shade = assertColor(colors[1], 'Plague satchel shade');
  const clasp = assertColor(colors[2], 'Plague satchel clasp');
  const bob = pose.bob;
  const sway = pose.animation === 'walk' ? pose.arm : pose.attackPhase === 'strike' ? 1 : 0;
  if (view === 'right') {
    paint(9, 11 + bob, 1, 6, shade);
    paint(7, 15 + bob + sway, 4, 4, leather);
    paint(8, 16 + bob + sway, 3, 1, clasp);
    return;
  }
  if (view === 'up') {
    paint(9, 11 + bob, 6, 1, shade);
    paint(14, 14 + bob + sway, 4, 4, leather);
    paint(15, 15 + bob + sway, 2, 1, clasp);
    return;
  }
  paint(9, 11 + bob, 1, 1, shade);
  paint(10, 12 + bob, 1, 1, shade);
  paint(11, 13 + bob, 1, 1, shade);
  paint(6, 15 + bob + sway, 4, 4, leather);
  paint(7, 16 + bob + sway, 2, 1, clasp);
}

function plagueMantle(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Plague mantle cloth');
  const shade = assertColor(colors[1], 'Plague mantle shade');
  const trim = assertColor(colors[2], 'Plague mantle trim');
  const bob = pose.bob;
  if (view === 'right') {
    paint(7, 10 + bob, 9, 3, shade);
    paint(8, 9 + bob, 6, 2, cloth);
    paint(8, 12 + bob, 8, 1, trim);
    paint(7, 13 + bob, 2, 3, cloth);
    return;
  }
  paint(6, 10 + bob, 5, 3, shade);
  paint(13, 10 + bob, 5, 3, shade);
  paint(8, 9 + bob, 8, 2, cloth);
  paint(7, 12 + bob, 10, 1, trim);
  if (view === 'up') paint(10, 13 + bob, 4, 2, shade);
  else paint(11, 11 + bob, 2, 3, trim);
}

function desertQuiver(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const leather = assertColor(colors[0], 'Desert quiver leather');
  const shade = assertColor(colors[1], 'Desert quiver shade');
  const fletching = assertColor(colors[2], 'Desert quiver fletching');
  const bob = pose.bob;
  const sway = pose.animation === 'walk' ? pose.arm : 0;
  if (view === 'right') {
    paint(7, 9 + bob + sway, 3, 8, leather);
    paint(8, 7 + bob + sway, 1, 3, shade);
    paint(6, 6 + bob + sway, 1, 3, fletching);
    paint(8, 5 + bob + sway, 1, 2, fletching);
    return;
  }
  const x = view === 'up' ? 15 : 6;
  paint(x, 10 + bob + sway, 3, 7, leather);
  paint(x + 1, 7 + bob + sway, 1, 4, shade);
  paint(x, 6 + bob + sway, 1, 2, fletching);
  paint(x + 2, 7 + bob + sway, 1, 2, fletching);
}

function sandbow(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const wood = assertColor(colors[0], 'Sandbow wood');
  const shade = assertColor(colors[1], 'Sandbow shade');
  const string = assertColor(colors[2], 'Sandbow string');
  const bob = pose.bob;
  let x = view === 'up' ? 5 : 16;
  let y = 8 + bob;
  let pull = 1;
  if (pose.attackPhase === 'wind') {
    x = view === 'up' ? 7 : 14;
    y = 7 + bob;
    pull = 3;
  } else if (pose.attackPhase === 'strike') {
    x = view === 'up' ? 3 : 18;
    y = 9 + bob;
    pull = 1;
  }
  paint(x + 1, y, 1, 2, wood);
  paint(x, y + 2, 1, 6, wood);
  paint(x + 1, y + 8, 1, 2, wood);
  paint(x + 2, y + 1, 1, 1, shade);
  paint(x + 2, y + 8, 1, 1, shade);
  paint(x + 2, y + 2, 1, 6, string);
  if (pull > 1) {
    paint(x + 3, y + 3, 1, 1, string);
    paint(x + 4, y + 4, 1, 2, string);
    paint(x + 3, y + 6, 1, 1, string);
  }
}

function sunscarCommand(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Sunscar command cloth');
  const shade = assertColor(colors[1], 'Sunscar command shade');
  const gold = assertColor(colors[2], 'Sunscar command trim');
  const bob = pose.bob;
  if (view === 'right') {
    paint(8, 10 + bob, 8, 2, shade);
    paint(8, 11 + bob, 2, 4, cloth);
    paint(10, 13 + bob, 6, 1, gold);
    paint(14, 14 + bob, 2, 4, cloth);
    return;
  }
  paint(5, 11 + bob, 5, 2, shade);
  paint(14, 11 + bob, 5, 2, shade);
  paint(7, 12 + bob, 10, 1, gold);
  paint(8, 13 + bob, 2, 5, cloth);
  paint(14, 13 + bob, 2, 5, cloth);
  if (view !== 'up') paint(10, 14 + bob, 4, 1, gold);
}

function penitentBindings(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const iron = assertColor(colors[0], 'Penitent binding iron');
  const shade = assertColor(colors[1], 'Penitent binding shade');
  const wrap = assertColor(colors[2], 'Penitent binding wrap');
  const bob = pose.bob;
  const arm = pose.animation === 'walk' ? pose.arm : pose.attackPhase === 'wind' ? -1 : pose.attackPhase === 'strike' ? 1 : 0;
  if (view === 'right') {
    paint(9, 12 + bob, 7, 1, shade);
    paint(10, 13 + bob, 1, 1, iron);
    paint(12, 14 + bob, 1, 1, iron);
    paint(14, 15 + bob, 1, 1, iron);
    paint(15, 14 + bob + arm, 3, 2, wrap);
    return;
  }
  paint(8, 12 + bob, 8, 1, shade);
  paint(9, 13 + bob, 1, 1, iron);
  paint(11, 14 + bob, 1, 1, iron);
  paint(13, 15 + bob, 1, 1, iron);
  paint(15, 16 + bob, 1, 1, iron);
  paint(5, 14 + bob - arm, 3, 2, wrap);
  paint(16, 14 + bob + arm, 3, 2, wrap);
  if (view === 'up') paint(10, 16 + bob, 4, 1, shade);
}

function bellAbbotRegalia(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const cloth = assertColor(colors[0], 'Bell Abbot mantle cloth');
  const shade = assertColor(colors[1], 'Bell Abbot mantle shade');
  const bell = assertColor(colors[2], 'Bell Abbot bell');
  const bob = pose.bob;
  if (view === 'right') {
    paint(7, 10 + bob, 9, 3, shade);
    paint(8, 9 + bob, 7, 2, cloth);
  } else {
    paint(6, 10 + bob, 5, 3, shade);
    paint(13, 10 + bob, 5, 3, shade);
    paint(8, 9 + bob, 8, 2, cloth);
  }
  let x = view === 'up' ? 6 : 16;
  let y = 14 + bob;
  if (pose.attackPhase === 'wind') {
    x = view === 'up' ? 8 : 14;
    y = 10 + bob;
  } else if (pose.attackPhase === 'strike') {
    x = view === 'up' ? 4 : 18;
    y = 12 + bob;
  }
  paint(x + 1, y, 1, 3, shade);
  paint(x, y + 2, 3, 3, bell);
  paint(x + 1, y + 5, 1, 1, shade);
}

function moonclawTail(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const fur = assertColor(colors[0], 'Moonclaw tail fur');
  const shade = assertColor(colors[1], 'Moonclaw tail shade');
  const accent = assertColor(colors[2], 'Moonclaw sash accent');
  const bob = pose.bob;
  const lift = pose.animation === 'walk' ? -Math.abs(pose.leg) : pose.attackPhase === 'wind' ? -1 : 0;
  if (view === 'right') {
    paint(17, 15 + bob, 3, 2, fur);
    paint(19, 13 + bob + lift, 2, 3, fur);
    paint(20, 11 + bob + lift, 2, 3, shade);
    paint(9, 13 + bob, 7, 1, accent);
    return;
  }
  const tailX = view === 'up' ? 4 : 17;
  paint(tailX, 15 + bob, 3, 2, fur);
  paint(tailX + (view === 'up' ? -1 : 2), 13 + bob + lift, 2, 3, shade);
  paint(8, 13 + bob, 8, 1, accent);
  paint(view === 'up' ? 8 : 14, 14 + bob, 2, 3, accent);
}

function prideMane(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const mane = assertColor(colors[0], 'Pride mane');
  const shade = assertColor(colors[1], 'Pride mane shade');
  const clasp = assertColor(colors[2], 'Pride mane clasp');
  const bob = pose.bob;
  if (view === 'right') {
    paint(8, 5 + bob, 7, 2, shade);
    paint(7, 7 + bob, 9, 4, mane);
    paint(8, 10 + bob, 8, 3, shade);
    paint(14, 11 + bob, 2, 1, clasp);
    return;
  }
  paint(7, 5 + bob, 10, 2, shade);
  paint(6, 7 + bob, 4, 5, mane);
  paint(14, 7 + bob, 4, 5, mane);
  paint(8, 10 + bob, 8, 3, shade);
  paint(11, 11 + bob, 2, 1, clasp);
  if (view === 'up') paint(9, 6 + bob, 6, 4, mane);
}

function hornSeerRegalia(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const gold = assertColor(colors[0], 'Horn-Seer gold');
  const cloth = assertColor(colors[1], 'Horn-Seer cloth');
  const inset = assertColor(colors[2], 'Horn-Seer inset');
  const bob = pose.bob;
  if (view === 'right') {
    paint(11, 2 + bob, 2, 1, gold);
    paint(13, 3 + bob, 2, 1, inset);
    paint(9, 12 + bob, 7, 1, gold);
    paint(10, 13 + bob, 2, 5, cloth);
    paint(14, 14 + bob, 1, 3, inset);
    return;
  }
  paint(7, 2 + bob, 2, 1, gold);
  paint(15, 2 + bob, 2, 1, gold);
  paint(6, 3 + bob, 2, 1, inset);
  paint(16, 3 + bob, 2, 1, inset);
  paint(8, 12 + bob, 8, 1, gold);
  paint(10, 13 + bob, 4, 5, cloth);
  paint(11, 14 + bob, 2, 3, inset);
}

function ramguardMantle(paint, direction, pose, colors) {
  const view = direction === 'left' ? 'right' : direction;
  const armor = assertColor(colors[0], 'Ramguard mantle armor');
  const shade = assertColor(colors[1], 'Ramguard mantle shade');
  const bronze = assertColor(colors[2], 'Ramguard mantle bronze');
  const bob = pose.bob;
  if (view === 'right') {
    paint(6, 10 + bob, 11, 3, shade);
    paint(7, 9 + bob, 4, 3, armor);
    paint(13, 9 + bob, 4, 3, armor);
    paint(8, 12 + bob, 8, 1, bronze);
    return;
  }
  paint(5, 10 + bob, 6, 3, shade);
  paint(13, 10 + bob, 6, 3, shade);
  paint(6, 9 + bob, 4, 3, armor);
  paint(14, 9 + bob, 4, 3, armor);
  paint(7, 12 + bob, 10, 1, bronze);
  paint(10, 13 + bob, 4, 2, shade);
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
  'plague-beak': plagueBeak,
  'desert-wrap': desertWrap,
  'monk-beads': monkBeads,
  'plain-quarterstaff': plainQuarterstaff,
  'catfolk-traits': catfolkTraits,
  'goatfolk-traits': goatfolkTraits,
  'plague-satchel': plagueSatchel,
  'plague-mantle': plagueMantle,
  'desert-quiver': desertQuiver,
  sandbow,
  'sunscar-command': sunscarCommand,
  'penitent-bindings': penitentBindings,
  'bell-abbot-regalia': bellAbbotRegalia,
  'moonclaw-tail': moonclawTail,
  'pride-mane': prideMane,
  'horn-seer-regalia': hornSeerRegalia,
  'ramguard-mantle': ramguardMantle,
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
