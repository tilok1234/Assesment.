import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E04_MERFOLK_PEARL_REGENT_GATE } from './enemy-expansion-en-e04-merfolk-pearl-regent.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT = deepFreeze({
  family: 'birdfolk',
  variant: 'aerie-scout',
  role: 'common',
  state: 'implemented-complete-motion-candidate',
  chassis: 'upright-avian-person',
  silhouette: 'One upright feathered torso joins a beaked head and connected crest, two shoulder-rooted wing-arms, two digitigrade legs ending in broad three-pronged talons, and one connected tail fan. No direction contains human hair, a human face, ordinary boot blocks, floating wing islands, or the exposed-human Harpy identity.',
  identity: 'Slate-blue plumage, a cream throat bib, rust flight-feather tips, a bronze scout harness, teal sash marks, amber eyes, a gold beak and talons, and a compact connected tail fan distinguish the common Aerie Scout.',
  effectBoundary: 'Wind streaks, loose feathers, dust puffs, dive trails, gust rings, air blades, and impact effects remain external.',
});

export const EN_E04_BIRDFOLK_AERIE_SCOUT_GATE = deepFreeze({
  id: 'en-e04-birdfolk-aerie-scout-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving, publishing, and reconciling the complete Merfolk Pearl Regent elite, the designer said: next. The documented EN-E04 order now advances to the untouched Birdfolk family; because the live plan defines its upright-avian anatomy but does not pre-name its roles, Codex named and bounded the continuation to one complete 80-frame Birdfolk Aerie Scout common enemy only.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The designer reviewed the exact hash-frozen raw/no-outline and Complete B + Form Birdfolk Aerie Scout full-suite pair and said: very good approved. They then paused only to restart Codex for a new MCP setup and resumed this bounded approval workflow with: ok lets keep going; both exact 1428x760 boards were opened through the working Aseprite MCP after restart.',
  precedingApproval: {
    gateId: EN_E04_MERFOLK_PEARL_REGENT_GATE.id,
    artifactSha256: EN_E04_MERFOLK_PEARL_REGENT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_MERFOLK_PEARL_REGENT_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_MERFOLK_PEARL_REGENT_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_MERFOLK_PEARL_REGENT_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_MERFOLK_PEARL_REGENT_GATE.candidateFrameDigest,
    publishedCheckpoint: 'ef0ab54b73718b62f8db99f601020f7ef14090f8',
    publishedHandoff: '3a5ff4fdd2709731cb1c673c84ce0956057541e1',
  },
  artifact: 'enemy-expansion-review/en-e04-birdfolk-aerie-scout/en-e04-birdfolk-aerie-scout-full-suite-raw.png',
  artifactSha256: 'e1d6bd053edeab115ae354383ba39b5ed0698aecc445985cfd5ea06bc67b3b47',
  assembledArtifact: 'enemy-expansion-review/en-e04-birdfolk-aerie-scout/en-e04-birdfolk-aerie-scout-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'b7bb2f42c79868a1f311340e3df4ecf22d166170a4eb279c0cc293532de3e9b9',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-birdfolk-aerie-scout/en-e04-birdfolk-aerie-scout-full-suite-four-directions-labeled.gif',
      sha256: 'f50d8b6768eca83561aef0f44576cebcd64f399ec3294a90585972ba7e41d81b',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-birdfolk-aerie-scout/en-e04-birdfolk-aerie-scout-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '4ef54ceb8050955b8c6611a3ef1c57124012f315220276283879a021b3d59c4a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8',
  scope: 'One complete 80-frame Birdfolk Aerie Scout common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle breathes and settles the crest over planted talons. Walk uses four distinct digitigrade strides with counter-swinging wing-arms and tail fan. Attack braces, raises both wings, drives a forward wing-and-talon rake, and recovers through the full body. Hurt uses a complete-silhouette white recoil and colored recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Birdfolk Aerie Scout full-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display Idle, Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Pearl Regent pixel changes',
    'Birdfolk specialist',
    'Birdfolk elite',
    'additional Birdfolk variants',
    'new Cast pixels',
    'new Death pixels',
    'baked wind-streak pixels',
    'baked loose-feather pixels',
    'baked dust-puff pixels',
    'baked dive-trail pixels',
    'baked gust-ring pixels',
    'baked air-blade pixels',
    'baked impact pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Bounded commit, push, and publication of this exact ten-file Aerie Scout lane are authorized. No Birdfolk specialist or elite, additional Birdfolk variants, registration, integration, effects, release, or broader EN-E04 work is authorized by this approval.',
});

export const EN_E04_BIRDFOLK_AERIE_SCOUT_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'lean',
    skin: 'pale',
    hairStyle: 'short',
    hairColor: 'black',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'leather',
    outfitColor: 'teal',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#6f91a8', '#3e5d72'],
      hair: ['#31495c', '#203442'],
      outfit: ['#3b8c88', '#245a5b', '#c58a4a'],
    },
  },
  birdfolk: {
    plumage: ['#6f91a8', '#3e5d72', '#a9c5d0'],
    flight: ['#31495c', '#203442', '#88a9ba'],
    throat: ['#e2d5ad', '#9f916c', '#fff0c7'],
    rust: ['#b85f3e', '#71382d', '#e58a59'],
    bronze: ['#c58a4a', '#75502f', '#edb86a'],
    teal: ['#3b8c88', '#245a5b', '#70c2b3'],
    beak: ['#dda447', '#925f2f', '#f3ca66'],
    eye: ['#f0ce55', '#4a2630'],
  },
  effectBoundary: 'external-wind-streaks-loose-feathers-dust-puffs-dive-trails-gust-rings-air-blades-and-impacts',
  bakedEffects: [],
});

const AERIE_SCOUT_VARIANT = deepFreeze({
  id: 'aerie-scout',
  name: 'Aerie Scout',
  role: EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.role,
  status: EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.state,
  brief: 'Common Birdfolk pathfinder with a beaked crested head, shoulder-rooted wing-arms, slate-and-cream plumage, bronze harness, teal sash, digitigrade talons, and a connected tail fan; the complete standard suite is implemented with external wind effects.',
  rendererData: EN_E04_BIRDFOLK_AERIE_SCOUT_DATA,
});

export const EN_E04_BIRDFOLK_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'plume-breath', forward: 0, lift: 0, upperBob: 0, wingPhase: 0, legPhase: 0, tailSway: 0, flash: false },
  { name: 'crest-settle', forward: 0, lift: 0, upperBob: 1, wingPhase: 1, legPhase: 0, tailSway: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-talon-step', forward: 0, lift: 0, upperBob: 0, wingPhase: 1, legPhase: 1, tailSway: -1, flash: false },
  { name: 'center-feather-compress', forward: 0, lift: 0, upperBob: 1, wingPhase: 0, legPhase: 0, tailSway: 0, flash: false },
  { name: 'right-talon-step', forward: 0, lift: 0, upperBob: 0, wingPhase: 1, legPhase: 2, tailSway: 1, flash: false },
  { name: 'aerie-recover', forward: 0, lift: 0, upperBob: 0, wingPhase: 0, legPhase: 3, tailSway: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'wing-brace', forward: -1, lift: 0, upperBob: 0, wingPhase: 2, legPhase: 3, tailSway: -1, flash: false },
  { name: 'crest-rise', forward: 0, lift: -1, upperBob: 0, wingPhase: 3, legPhase: 3, tailSway: 0, flash: false },
  { name: 'talon-rake', forward: 1, lift: 0, upperBob: 0, wingPhase: 4, legPhase: 4, tailSway: 1, flash: false },
  { name: 'scout-recover', forward: 0, lift: 0, upperBob: 1, wingPhase: 1, legPhase: 0, tailSway: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-wing-recoil', forward: -1, lift: 0, upperBob: 0, wingPhase: 2, legPhase: 3, tailSway: -1, flash: true },
  { name: 'planted-talon-recovery', forward: 0, lift: 0, upperBob: 1, wingPhase: 1, legPhase: 0, tailSway: 0, flash: false },
]);

const FRONT_LEG_PHASES = deepFreeze([
  { leftX: 0, rightX: 0, leftLift: 0, rightLift: 0 },
  { leftX: -1, rightX: 1, leftLift: 0, rightLift: 1 },
  { leftX: 1, rightX: -1, leftLift: 1, rightLift: 0 },
  { leftX: -1, rightX: 1, leftLift: 0, rightLift: 0 },
  { leftX: 0, rightX: 1, leftLift: 2, rightLift: 0 },
]);

const SIDE_LEG_PHASES = deepFreeze([
  { farX: -1, nearX: 0, farLift: 0, nearLift: 0 },
  { farX: 0, nearX: 1, farLift: 1, nearLift: 0 },
  { farX: -1, nearX: 0, farLift: 0, nearLift: 1 },
  { farX: -1, nearX: 1, farLift: 0, nearLift: 0 },
  { farX: -1, nearX: 2, farLift: 0, nearLift: 2 },
]);

function createTransformedContext(context, shift = { x: 0, y: 0 }, forcedColor = null) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() {
      return forcedColor || fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = forcedColor || value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') {
        context.onOutOfBounds({ ...write, x: write.x + shift.x, y: write.y + shift.y });
      }
    },
    clearRect(x, y, width, height) {
      if (x === 0 && y === 0 && width >= SIZE && height >= SIZE) {
        context.clearRect(0, 0, SIZE, SIZE);
        return;
      }
      context.clearRect(x + shift.x, y + shift.y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = forcedColor || fillStyle;
      context.fillRect(x + shift.x, y + shift.y, width, height);
    },
  };
}

function physicalShift(direction, phase) {
  if (direction === 'right') return Object.freeze({ x: phase.forward, y: phase.lift });
  if (direction === 'left') return Object.freeze({ x: -phase.forward, y: phase.lift });
  return Object.freeze({
    x: 0,
    y: phase.lift + (direction === 'down' ? phase.forward : -phase.forward),
  });
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Birdfolk rectangles must use positive integer geometry.',
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

function drawTailFan({ view, rect, dot }, phase, rearView) {
  const { flight, rust, teal } = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  const sway = phase.tailSway;
  if (view === 'right') {
    rect(7 + sway, 15, 5, 3, flight[0]);
    rect(5 + sway, 17, 6, 2, flight[1]);
    rect(3 + sway, 18, 6, 2, rearView ? flight[0] : rust[0]);
    dot(3 + sway, 20, rust[2]);
    dot(5 + sway, 20, rust[1]);
    dot(7 + sway, 20, rust[2]);
    return;
  }
  rect(9 + sway, 15, 6, 3, flight[0]);
  rect(7 + sway, 17, 10, 2, flight[1]);
  rect(6 + sway, 19, 12, 1, rearView ? flight[2] : rust[0]);
  dot(6 + sway, 20, rust[2]);
  dot(8 + sway, 20, rust[1]);
  dot(11 + sway, 20, rearView ? teal[2] : rust[2]);
  dot(14 + sway, 20, rust[1]);
  dot(17 + sway, 20, rust[2]);
}

function drawFrontWingArms({ rect, dot }, phase, rearView) {
  const { flight, rust } = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  const bob = phase.upperBob;
  const main = rearView ? flight[1] : flight[0];
  const shade = rearView ? flight[0] : flight[1];
  if (phase.wingPhase === 3) {
    rect(4, 6 + bob, 5, 7, main); rect(3, 7 + bob, 3, 4, shade);
    rect(15, 6 + bob, 5, 7, main); rect(18, 7 + bob, 3, 4, shade);
    dot(3, 6 + bob, rust[2]); dot(20, 6 + bob, rust[2]);
    return;
  }
  if (phase.wingPhase === 4) {
    rect(2, 9 + bob, 7, 4, main); rect(3, 13 + bob, 6, 2, shade);
    rect(15, 9 + bob, 7, 4, main); rect(15, 13 + bob, 6, 2, shade);
    dot(2, 12 + bob, rust[2]); dot(4, 15 + bob, rust[0]);
    dot(21, 12 + bob, rust[2]); dot(19, 15 + bob, rust[0]);
    return;
  }
  if (phase.wingPhase === 2) {
    rect(3, 10 + bob, 6, 4, main); rect(4, 14 + bob, 5, 3, shade);
    rect(15, 10 + bob, 6, 4, main); rect(15, 14 + bob, 5, 3, shade);
    dot(3, 16 + bob, rust[2]); dot(20, 16 + bob, rust[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  rect(5, 10 + bob + lower, 4, 5, main); rect(4, 13 + bob + lower, 4, 4, shade);
  rect(15, 10 + bob + lower, 4, 5, main); rect(16, 13 + bob + lower, 4, 4, shade);
  dot(4, 16 + bob + lower, rust[2]); dot(6, 17 + bob + lower, rust[0]);
  dot(19, 16 + bob + lower, rust[2]); dot(17, 17 + bob + lower, rust[0]);
}

function drawSideWingArms({ rect, dot }, phase) {
  const { flight, rust } = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  const bob = phase.upperBob;
  rect(7, 10 + bob, 5, 4, flight[1]);
  if (phase.wingPhase === 3) {
    rect(6, 5 + bob, 5, 8, flight[0]);
    rect(8, 6 + bob, 6, 5, flight[1]);
    dot(5, 5 + bob, rust[2]); dot(6, 7 + bob, rust[0]);
    return;
  }
  if (phase.wingPhase === 4) {
    rect(12, 9 + bob, 8, 4, flight[0]);
    rect(13, 13 + bob, 7, 2, flight[1]);
    dot(20, 10 + bob, rust[2]); dot(20, 12 + bob, rust[0]);
    return;
  }
  if (phase.wingPhase === 2) {
    rect(4, 9 + bob, 9, 4, flight[0]);
    rect(3, 12 + bob, 8, 4, flight[1]);
    dot(3, 15 + bob, rust[2]); dot(5, 16 + bob, rust[0]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  rect(5, 11 + bob + lower, 8, 4, flight[0]);
  rect(4, 14 + bob + lower, 7, 3, flight[1]);
  dot(4, 16 + bob + lower, rust[2]); dot(6, 17 + bob + lower, rust[0]);
}

function drawTorso({ view, rect, dot }, phase, rearView) {
  const { plumage, throat, bronze, teal, flight } = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  const bob = phase.upperBob;
  if (view === 'right') {
    rect(8, 9 + bob, 8, 8, plumage[0]);
    rect(9, 15 + bob, 7, 3, plumage[1]);
    rect(13, 10 + bob, 3, 5, throat[0]);
    rect(9, 12 + bob, 7, 1, bronze[1]);
    dot(14, 12 + bob, bronze[2]);
    rect(10, 15 + bob, 6, 1, teal[0]);
    dot(11, 16 + bob, teal[2]);
    return;
  }
  rect(8, 9 + bob, 8, 8, plumage[0]);
  rect(9, 15 + bob, 6, 3, plumage[1]);
  rect(7, 10 + bob, 2, 5, plumage[1]);
  rect(15, 10 + bob, 2, 5, plumage[1]);
  if (rearView) {
    rect(10, 10 + bob, 4, 5, flight[1]);
    rect(11, 11 + bob, 2, 4, flight[2]);
  } else {
    rect(10, 9 + bob, 4, 6, throat[0]);
    rect(11, 10 + bob, 2, 4, throat[2]);
  }
  rect(8, 12 + bob, 8, 1, bronze[1]);
  dot(9, 12 + bob, bronze[2]);
  dot(14, 12 + bob, bronze[2]);
  rect(9, 15 + bob, 6, 1, teal[0]);
  dot(12, 16 + bob, teal[2]);
}

function drawFrontLeg({ rect }, x, lift, rearView) {
  const { plumage, beak } = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  rect(x, 16, 2, 3, plumage[1]);
  rect(x, 18 - lift, 2, 3, beak[1]);
  rect(x - 1, 21 - lift, 4, 1, rearView ? beak[1] : beak[0]);
}

function drawSideLeg({ rect }, x, lift, farLeg) {
  const { plumage, beak } = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  rect(x, 16, 2, 3, farLeg ? plumage[1] : plumage[0]);
  rect(x + 1, 18 - lift, 2, 3, beak[1]);
  rect(x + 1, 21 - lift, 4, 1, farLeg ? beak[1] : beak[0]);
}

function drawLegs(paint, phase, rearView) {
  if (paint.view === 'right') {
    const state = SIDE_LEG_PHASES[phase.legPhase];
    drawSideLeg(paint, 10 + state.farX, state.farLift, true);
    drawSideLeg(paint, 14 + state.nearX, state.nearLift, false);
    return;
  }
  const state = FRONT_LEG_PHASES[phase.legPhase];
  drawFrontLeg(paint, 9 + state.leftX, state.leftLift, rearView);
  drawFrontLeg(paint, 14 + state.rightX, state.rightLift, rearView);
}

function drawHead({ view, rect, dot }, phase, rearView) {
  const { plumage, flight, rust, throat, beak, eye } = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  const bob = phase.upperBob;
  if (view === 'right') {
    rect(12, 2 + bob, 5, 2, flight[1]);
    dot(11, 3 + bob, rust[0]); dot(17, 3 + bob, rust[2]);
    rect(11, 4 + bob, 7, 6, plumage[0]);
    rect(11, 7 + bob, 3, 3, throat[0]);
    dot(16, 6 + bob, eye[0]);
    dot(17, 6 + bob, eye[1]);
    rect(17, 7 + bob, 4, 2, beak[0]);
    dot(20, 9 + bob, beak[1]);
    rect(10, 8 + bob, 2, 3, plumage[1]);
    return;
  }
  rect(10, 2 + bob, 4, 2, flight[1]);
  dot(9, 3 + bob, rust[0]); dot(14, 3 + bob, rust[2]);
  rect(9, 4 + bob, 6, 5, plumage[0]);
  rect(8, 5 + bob, 2, 3, plumage[1]);
  rect(14, 5 + bob, 2, 3, plumage[1]);
  if (rearView) {
    rect(10, 5 + bob, 4, 3, flight[1]);
    dot(11, 6 + bob, flight[2]); dot(12, 7 + bob, flight[2]);
  } else {
    dot(10, 6 + bob, eye[0]); dot(13, 6 + bob, eye[0]);
    dot(10, 7 + bob, eye[1]); dot(13, 7 + bob, eye[1]);
    rect(10, 8 + bob, 4, 2, beak[0]);
    rect(11, 10 + bob, 2, 1, beak[1]);
  }
}

export function drawBirdfolkAerieScoutAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTailFan(paint, phase, rearView);
  if (paint.view === 'right') drawSideWingArms(paint, phase);
  else drawFrontWingArms(paint, phase, rearView);
  drawTorso(paint, phase, rearView);
  drawLegs(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const shiftedContext = createTransformedContext(
    args.context,
    physicalShift(args.direction, phase),
    phase.flash ? '#ffffff' : null,
  );
  drawBirdfolkAerieScoutAnatomy(shiftedContext, args.direction, phase);
}

function resultFor(args, renderedAnimation, renderedFrame, motion) {
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation,
    renderedFrame,
    birdfolkAerieScoutGate: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id,
    approvedPrecedingGate: EN_E04_MERFOLK_PEARL_REGENT_GATE.id,
    role: EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.role,
    anatomy: EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.chassis,
    upperBody: 'beaked-crested-head-with-connected-wing-arms-and-scout-harness',
    lowerBody: 'two-digitigrade-legs-with-connected-three-pronged-talons-and-tail-fan',
    motion,
    effectBoundary: EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = IDLE_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'idle', args.frame, phase.name);
}

function renderWalk(args) {
  const phase = WALK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'walk', args.frame, phase.name);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = ATTACK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-full-body-wing-and-talon-rake' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-planted-talon-hurt' : phase.name,
  );
}

function renderBirdfolkAerieScout(args) {
  assert(args.family.id === 'birdfolk', 'The EN-E04 Birdfolk renderer is restricted to Birdfolk.');
  assert(args.variant.id === 'aerie-scout', 'The EN-E04 Birdfolk renderer is restricted to Aerie Scout.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Birdfolk Aerie Scout Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Birdfolk Aerie Scout Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Birdfolk Aerie Scout Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Birdfolk Aerie Scout Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Birdfolk Aerie Scout Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Birdfolk Aerie Scout Death authorizes only D1-D4.');
    const sourceFrame = EN_E04_BIRDFOLK_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E04 Birdfolk Aerie Scout gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER = Object.freeze({
  key: 'en-e04-birdfolk-aerie-scout-full-v1',
  chassis: EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.chassis,
  render: renderBirdfolkAerieScout,
});

export const EN_E04_BIRDFOLK_AERIE_SCOUT_FAMILY = deepFreeze({
  id: 'birdfolk',
  name: 'Birdfolk',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [AERIE_SCOUT_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E04_MERFOLK_PEARL_REGENT_GATE.id,
    activeGate: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id,
  },
  review: {
    baselineVariant: 'aerie-scout',
    scale: 6,
    notes: 'Exact paired visual candidate approved; one complete Birdfolk Aerie Scout common remains internal, non-public, and effect-free.',
  },
});

export const EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER],
  families: [EN_E04_BIRDFOLK_AERIE_SCOUT_FAMILY],
});
