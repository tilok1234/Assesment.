import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E12_BASILISK_IRONHALO_TYRANT_GATE,
} from './enemy-expansion-en-e12-basilisk-ironhalo-tyrant.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E12_MANTICORE_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e12-manticore-actor-topology-v1',
  sliceId: 'EN-E12',
  family: 'manticore',
  status: 'approved',
  selected: 'baked-single-actor-grounded-mane-faced-scorpion-tailed-quadruped',
  approvedOn: '2026-08-15',
  approvalEvidence: 'The exact revised Ironhalo Tyrant implementation 7a00ef8691da6df2821cf3ad02437198d0d9f2e6, approval record 16f797813361c61f0bcda2933ecb86d03b0d66cc, initial published handoff f0d4b503162703b88213372e1e2831162d1a9ccf, and final reconciliation b0f17a8c780b22b8535ae48ad4c739e73d1f667d are pushed and remote verified. After that bounded Basilisk elite publication completed, the designer replied lets do next, opening only the documented EN-E12 Manticore topology decision. Codex recommended one connected grounded 24x24 mane-faced lion quadruped with four paws and one body-owned segmented scorpion tail, no wings, zero child assets, and external venom or impact effects. The designer replied approved. This selects only baked-single-actor-grounded-mane-faced-scorpion-tailed-quadruped and authorizes exactly one private common Manticore full 80-frame candidate. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, specialist or elite Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  alternatives: [
    {
      id: 'baked-single-actor-grounded-mane-faced-scorpion-tailed-quadruped',
      status: 'selected',
      summary: 'One connected low lion-bodied actor with a broad mane, mask-like face, four grounded paws, and one body-owned segmented scorpion tail ending in a readable stinger.',
    },
    {
      id: 'winged-lion-scorpion-manticore',
      status: 'rejected',
      summary: 'Wings would overload the 24x24 silhouette and consume the later Sphinx and 48x48 Chimera distinction.',
    },
    {
      id: 'lion-body-plus-detached-stinger-child',
      status: 'rejected',
      summary: 'A detached stinger crosses the child-asset boundary and weakens the continuous body-owned tail attack.',
    },
  ],
  childAssets: [],
  effectBoundary: 'Venom, poison spray, tail trails, dust, projectiles, detached quills or teeth, shock rings, impacts, glow, illumination, and particles remain external.',
  rationale: 'The common Manticore must read from silhouette as neither an ordinary Big Cat nor an enlarged Scorpion. A low lion body, broad mane and mask-like face, four grounded paws, and a high connected segmented stinger tail preserve the classic composite identity inside one 24x24 actor while reserving wings and regal upright mass for the later Sphinx.',
});

export const EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT = deepFreeze({
  family: 'manticore',
  variant: 'thornmane-stalker',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E12_MANTICORE_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected low Manticore joins a broad tawny lion body, high oxblood thorn mane, mask-like old-bone face, four separately readable grounded dark paws, and one thick segmented charcoal scorpion tail that rises from the rump, arches above the back, and ends in a body-owned copper hook stinger. It has no wings and must remain distinct from ordinary Big Cat, ordinary Scorpion, the preceding four-clawed crowned-serpent Basilisk, the later winged Sphinx, and 48x48 Chimera work.',
  identity: 'Sun-baked tawny and ochre fur, a dark oxblood mane, warm old-bone facial mask, pale sand belly, charcoal tail plates, a rust-copper stinger, amber eyes, black-brown paws, and small ivory fangs establish the common Manticore without relying on venom, glow, dust, projectiles, trails, impacts, or detached parts.',
  effectBoundary: EN_E12_MANTICORE_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E12_MANTICORE_COMMON_CONTRACT_CARD = deepFreeze({
  family: 'manticore',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id,
  precedingFamily: {
    id: 'basilisk',
    finalVariant: 'ironhalo-tyrant',
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.variant,
    role: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
});

export const EN_E12_MANTICORE_THORNMANE_STALKER_GATE = deepFreeze({
  id: 'en-e12-manticore-thornmane-stalker-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-15',
  authorizationEvidence: EN_E12_MANTICORE_TOPOLOGY_DECISION.approvalEvidence,
  baseCheckpoint: 'b0f17a8c780b22b8535ae48ad4c739e73d1f667d',
  architectureDecision: EN_E12_MANTICORE_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-15',
  approvalEvidence: 'The final approval prompt posted the exact labeled all-four-direction Thornmane Stalker raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Ironhalo-public Tiger-public Emperor Scorpion comparison PNGs together with both synchronized full-suite GIFs and candidate digest 734d1a7f43bd39399fdb8f81011ca065f931804ee1207ff82fc72784768342f9. The packet was regenerated exactly after approval; all four PNGs, all eight raw and Complete B + Form phase boards, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution; Aseprite parsed all six principal files; focused, fast, and full validation passed. The designer replied: approved. Pixel approval applies only to implementation a2bb4a00d2e4fda941f781efce6e82df3a66e9b2, that digest, and its six frozen review hashes. The reply contains no continuation request and does not authorize public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, specialist or elite Manticore, Sphinx, boss work, release, accepted drift, a pull request, or another enemy gate.',
  approvedImplementation: 'a2bb4a00d2e4fda941f781efce6e82df3a66e9b2',
  publicationAuthorizedOn: '2026-08-15',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied approved to the exact Thornmane Stalker packet. This does not authorize public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, specialist or elite Manticore, Sphinx, boss work, release, accepted drift, a pull request, or another enemy gate.',
  publishedImplementation: 'a2bb4a00d2e4fda941f781efce6e82df3a66e9b2',
  publishedApprovalRecord: '1551a82ff386f61f91da98a9069618f98fbb3cca',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id,
    candidateFrameDigest: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.candidateFrameDigest,
    publishedImplementation: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.initialPublishedHandoff,
    currentReconciliation: 'b0f17a8c780b22b8535ae48ad4c739e73d1f667d',
  },
  artifact: 'enemy-expansion-review/en-e12-manticore-thornmane-stalker/en-e12-manticore-thornmane-stalker-full-suite-raw.png',
  artifactSha256: '45f5d6431d7ffc34f1af6daebec9c98e5d7a25941aa3c4e9cd50d1c3251bd18a',
  outlinedArtifact: 'enemy-expansion-review/en-e12-manticore-thornmane-stalker/en-e12-manticore-thornmane-stalker-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '844124203877c721982b8dfbe2547d762b1089cb1c9286c2a633f20d4efafb3e',
  assembledArtifact: 'enemy-expansion-review/en-e12-manticore-thornmane-stalker/en-e12-manticore-thornmane-stalker-full-suite-complete-b-form.png',
  assembledArtifactSha256: '3fbfad8e95779e8b0a8e0e22c36b4772e11d170db60138cd842a1374a35198cf',
  comparisonArtifact: 'enemy-expansion-review/en-e12-manticore-thornmane-stalker/en-e12-manticore-thornmane-stalker-family-comparison.png',
  comparisonArtifactSha256: 'fb951630360d1b9927103eb3861231a6b4228253882ff8d3a3bee619d5652438',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e12-manticore-thornmane-stalker/en-e12-manticore-thornmane-stalker-full-suite-four-directions-labeled.gif',
      sha256: 'f5c09be98b57db33db691fd61069ac3b50b6fcc3972c734d5bbb76a920017277',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e12-manticore-thornmane-stalker/en-e12-manticore-thornmane-stalker-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '90c83b11a1a8e99eaa93e4e5c60c971fbf6c3525aa96e8f39099974e3a509ed6',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '734d1a7f43bd39399fdb8f81011ca065f931804ee1207ff82fc72784768342f9',
  ironhaloComparisonDigest: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.candidateFrameDigest,
  tigerComparisonDigest: 'e94b68febfb6d9c6a00d6e0215b3295b243080c756c9e1a769e72ceff2ac6783',
  emperorScorpionComparisonDigest: '79aefd7497c18adb488b25cb33280e78527569ef8b8bd3e0b4ad2c2241371dc4',
  scope: 'One complete private 80-frame Manticore Thornmane Stalker common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves one connected grounded mane-faced lion-and-scorpion actor. Idle breathes through the mane while the connected stinger tail holds a hooked watch. Walk uses four alternating paw weight shifts with the mask face, mane, lion body, four contacts, segmented tail, and stinger readable. Attack braces all four paws, coils and raises the connected tail, drives one body-owned over-back stinger thrust with no venom, trail, projectile, or impact pixels, and recovers. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Thornmane Stalker raw/no-outline, distinct Complete B outlined, Complete B + Form, approved Ironhalo Tyrant plus public Tiger and Emperor Scorpion comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Ironhalo Tyrant source module and pixels',
    'public Big Cat Tiger pixels',
    'public Emperor Scorpion pixels',
    'approved-enemy copy package contents',
    'Manticore specialist or elite variants',
    'Sphinx',
    '48x48 boss work',
    'new Cast pixels',
    'new Death pixels',
    'detached tail, stinger, quill, tooth, mane, mask, or other child assets',
    'baked venom or poison-spray pixels',
    'baked tail-trail pixels',
    'baked glow or illumination pixels',
    'baked dust pixels',
    'baked projectile pixels',
    'baked shock-ring, impact, or particle pixels',
    'registration',
    'outline registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'The exact Thornmane Stalker implementation a2bb4a00d2e4fda941f781efce6e82df3a66e9b2 and approval record 1551a82ff386f61f91da98a9069618f98fbb3cca are pushed and remote verified. Only the initial published handoff and final reconciliation remain open to complete the bounded Manticore common publication tuple. The approval reply contains no continuation request, so the next enemy gate remains closed after publication and requires a fresh explicit continuation. Public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, specialist or elite Manticore, Sphinx, boss work, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E12_MANTICORE_THORNMANE_STALKER_DATA = deepFreeze({
  actor: {
    species: 'manticore',
    bodyBuild: 'low-lion-bodied-broad-maned-four-pawed-scorpion-tailed-common',
    skin: 'sun-baked-tawny-fur',
    hairStyle: 'connected-oxblood-thorn-mane',
    hairColor: 'oxblood-umber',
    expression: 'amber-mask-faced-stinger-watch',
    faceDetail: 'old-bone-mask-flat-lion-muzzle-amber-eyes-and-small-ivory-fangs',
    headgear: 'none',
    outfit: 'pale-sand-belly-charcoal-segmented-tail-and-rust-copper-stinger',
    outfitColor: 'tawny-oxblood-old-bone-sand-charcoal-rust-and-amber',
    outfitTier: 'tier1',
    weapon: 'body-owned-over-back-hook-stinger-thrust',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#b9783f', '#6c3d29'],
      hair: ['#5a2d2b', '#2a1c22'],
      outfit: ['#d7b77a', '#3c3944', '#a95b3b'],
    },
  },
  actorTopology: EN_E12_MANTICORE_TOPOLOGY_DECISION.selected,
  childAssets: [],
  manticore: {
    fur: ['#b9783f', '#6c3d29', '#d8a65a'],
    mane: ['#5a2d2b', '#2a1c22', '#8a4939'],
    belly: ['#d7b77a', '#8a6745', '#efd69a'],
    mask: ['#c9aa78', '#6e5340', '#ead3a2'],
    tail: ['#3c3944', '#1f2028', '#68606a'],
    stinger: ['#a95b3b', '#59322f', '#d58a4f'],
    paw: ['#3a2826', '#1c1719', '#5d3b30'],
    fang: ['#eee0bd', '#8f7b5e'],
    mark: ['#93543a', '#4f3029', '#c27a49'],
    eye: '#e7c45b',
    feature: '#17151a',
  },
  effectBoundary: 'external-venom-poison-spray-tail-trails-dust-projectiles-detached-quills-or-teeth-shock-rings-impacts-glow-illumination-and-particles',
  bakedEffects: [],
});

const THORNMANE_STALKER_VARIANT = deepFreeze({
  id: 'thornmane-stalker',
  name: 'Thornmane Stalker',
  role: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.role,
  status: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.state,
  brief: 'Private common Manticore with sun-baked tawny fur, a dark oxblood thorn mane, mask-like old-bone face, pale sand belly, amber eyes, four separately grounded black-brown paws, and one connected charcoal segmented scorpion tail ending in a rust-copper hook stinger.',
  rendererData: EN_E12_MANTICORE_THORNMANE_STALKER_DATA,
});

export const EN_E12_MANTICORE_THORNMANE_STALKER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'thornmane-hook-stinger-watch', bodyY: 0, headReach: 0, headY: 0, maneMode: 'set', tailMode: 'hooked', tailSide: -1, legPhase: 0, flash: false },
    { name: 'lion-barrel-mane-breath', bodyY: 1, headReach: 0, headY: 1, maneMode: 'breathed', tailMode: 'sway', tailSide: 1, legPhase: 1, flash: false },
  ],
  walk: [
    { name: 'front-left-paw-weight', bodyY: 0, headReach: 0, headY: 0, maneMode: 'set', tailMode: 'hooked', tailSide: -1, legPhase: 1, flash: false },
    { name: 'rear-right-tail-counter', bodyY: 1, headReach: 0, headY: 1, maneMode: 'breathed', tailMode: 'sway', tailSide: -1, legPhase: 2, flash: false },
    { name: 'front-right-paw-weight', bodyY: 0, headReach: 0, headY: 0, maneMode: 'set', tailMode: 'hooked', tailSide: 1, legPhase: 3, flash: false },
    { name: 'rear-left-mane-recover', bodyY: 1, headReach: 0, headY: 0, maneMode: 'breathed', tailMode: 'sway', tailSide: 1, legPhase: 4, flash: false },
  ],
  attack: [
    { name: 'four-paw-stinger-brace', bodyY: 1, headReach: 0, headY: 1, maneMode: 'pressed', tailMode: 'coiled', tailSide: -1, legPhase: 0, flash: false },
    { name: 'connected-segmented-tail-rise', bodyY: 0, headReach: 0, headY: 0, maneMode: 'lifted', tailMode: 'raised', tailSide: -1, legPhase: 2, flash: false },
    { name: 'body-owned-over-back-hook-thrust', bodyY: 0, headReach: 1, headY: 1, maneMode: 'pressed', tailMode: 'striking', tailSide: 1, legPhase: 3, flash: false },
    { name: 'thornmane-grounded-recover', bodyY: 1, headReach: 0, headY: 1, maneMode: 'set', tailMode: 'hooked', tailSide: 1, legPhase: 1, flash: false },
  ],
  hurt: [
    { name: 'white-mane-faced-stinger-recoil', bodyY: 1, headReach: 0, headY: 1, maneMode: 'pressed', tailMode: 'coiled', tailSide: -1, legPhase: 2, flash: true },
    { name: 'colored-four-paw-hooktail-recovery', bodyY: 1, headReach: 0, headY: 1, maneMode: 'set', tailMode: 'sway', tailSide: 1, legPhase: 0, flash: false },
  ],
});

function createColorContext(context, forcedColor = null) {
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
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds(write);
    },
    clearRect(x, y, width, height) {
      context.clearRect(x, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = forcedColor || fillStyle;
      context.fillRect(x, y, width, height);
    },
  };
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Thornmane Stalker rectangles must use positive integer geometry.',
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

function drawSideTail(paint, phase) {
  const { tail, stinger } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const bob = phase.bodyY;
  paint.rect(5, 12 + bob, 5, 4, tail[0]);
  paint.rect(4, 10 + bob, 4, 4, tail[1]);
  if (phase.tailMode === 'striking') {
    paint.rect(3, 7 + bob, 4, 5, tail[0]);
    paint.rect(4, 4 + bob, 4, 4, tail[2]);
    paint.rect(7, 3 + bob, 5, 3, tail[0]);
    paint.rect(10, 4 + bob, 3, 2, stinger[0]);
    paint.dot(12, 5 + bob, stinger[2]);
    return;
  }
  if (phase.tailMode === 'raised') {
    paint.rect(2, 7 + bob, 4, 5, tail[0]);
    paint.rect(1, 4 + bob, 3, 4, tail[2]);
    paint.rect(1, 3 + bob, 3, 2, stinger[0]);
    paint.dot(3, 4 + bob, stinger[2]);
    return;
  }
  if (phase.tailMode === 'coiled') {
    paint.rect(2, 9 + bob, 4, 4, tail[0]);
    paint.rect(1, 7 + bob, 3, 3, tail[2]);
    paint.rect(1, 6 + bob, 3, 2, stinger[0]);
    paint.dot(3, 7 + bob, stinger[2]);
    return;
  }
  const sway = phase.tailMode === 'sway' ? 1 : 0;
  paint.rect(2, 8 + bob + sway, 4, 4, tail[0]);
  paint.rect(1, 5 + bob + sway, 3, 4, tail[2]);
  paint.rect(1, 4 + bob + sway, 3, 2, stinger[0]);
  paint.dot(3, 5 + bob + sway, stinger[2]);
}

function drawFrontTail(paint, phase) {
  const { tail, stinger } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const bob = phase.bodyY;
  const right = phase.tailSide > 0;
  const striking = phase.tailMode === 'striking';
  const raised = phase.tailMode === 'raised';
  if (right) {
    paint.rect(15, 11 + bob, 5, 5, tail[0]);
    paint.rect(18, 8 + bob, 4, 5, tail[1]);
    if (striking) {
      paint.rect(16, 5 + bob, 4, 4, tail[2]);
      paint.rect(13, 3 + bob, 5, 3, tail[0]);
      paint.rect(10, 2 + bob, 4, 2, stinger[0]);
      paint.dot(10, 2 + bob, stinger[2]);
    } else {
      paint.rect(20, (raised ? 4 : 5) + bob, 3, 5, tail[2]);
      paint.rect(19, (raised ? 3 : 4) + bob, 4, 2, stinger[0]);
      paint.dot(19, (raised ? 4 : 5) + bob, stinger[2]);
    }
    return;
  }
  paint.rect(4, 11 + bob, 5, 5, tail[0]);
  paint.rect(2, 8 + bob, 4, 5, tail[1]);
  if (striking) {
    paint.rect(4, 5 + bob, 4, 4, tail[2]);
    paint.rect(6, 3 + bob, 5, 3, tail[0]);
    paint.rect(9, 2 + bob, 4, 2, stinger[0]);
    paint.dot(12, 2 + bob, stinger[2]);
  } else {
    paint.rect(1, (raised ? 4 : 5) + bob, 3, 5, tail[2]);
    paint.rect(1, (raised ? 3 : 4) + bob, 4, 2, stinger[0]);
    paint.dot(3, (raised ? 4 : 5) + bob, stinger[2]);
  }
}

function drawTail(paint, phase) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase);
}

const SIDE_LEG_X = Object.freeze([6, 9, 14, 17]);
const FRONT_LEG_X = Object.freeze([6, 9, 14, 17]);

function drawGroundedLeg(paint, x, phase, farLeg, index) {
  const { fur, belly, paw } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const bob = phase.bodyY;
  const active = ((phase.legPhase + index) % 4) < 2;
  const upper = farLeg ? fur[1] : (active ? fur[0] : belly[1]);
  const lean = active ? (index % 2 === 0 ? -1 : 1) : 0;
  paint.rect(x, 15 + bob, 2, 4 - bob, upper);
  paint.rect(Math.min(x, x + lean), 18, Math.abs(lean) + 2, 3, farLeg ? fur[1] : fur[0]);
  paint.rect(x + lean, 21, 2, 2, farLeg ? paw[1] : paw[0]);
  paint.dot(x + lean + 1, 22, farLeg ? paw[0] : paw[2]);
}

function drawLegs(paint, phase) {
  const positions = paint.view === 'right' ? SIDE_LEG_X : FRONT_LEG_X;
  for (let index = 0; index < positions.length; index++) {
    drawGroundedLeg(paint, positions[index], phase, index === 0 || index === 2, index);
  }
}

function drawSideBody(paint, phase) {
  const { fur, belly, mane, mark } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const bob = phase.bodyY;
  paint.rect(6, 10 + bob, 13, 7, fur[0]);
  paint.rect(7, 9 + bob, 10, 3, fur[2]);
  paint.rect(8, 15 + bob, 10, 4, fur[1]);
  paint.rect(10, 15 + bob, 7, 3, belly[0]);
  paint.rect(11, 17 + bob, 6, 2, belly[1]);
  paint.rect(14, 8 + bob, 5, 7, fur[0]);
  paint.rect(15, 9 + bob, 4, 5, mane[2]);
  paint.rect(8, 11 + bob, 2, 1, mark[2]);
  paint.dot(11, 12 + bob, mark[0]);
  paint.rect(13, 11 + bob, 2, 1, mark[1]);
  paint.dot(17, 13 + bob, mark[2]);
}

function drawFrontBody(paint, phase, rearView) {
  const { fur, belly, mane, mark } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const bob = phase.bodyY;
  paint.rect(6, 10 + bob, 12, 8, fur[0]);
  paint.rect(7, 9 + bob, 10, 4, fur[2]);
  paint.rect(7, 15 + bob, 10, 4, fur[1]);
  paint.rect(9, 13 + bob, 6, 6, rearView ? mane[1] : belly[0]);
  paint.rect(10, 16 + bob, 4, 3, rearView ? mane[0] : belly[1]);
  paint.rect(5, 11 + bob, 3, 5, fur[0]);
  paint.rect(16, 11 + bob, 3, 5, fur[0]);
  paint.dot(7, 15 + bob, mark[2]);
  paint.dot(8, 16 + bob, mark[0]);
  paint.dot(15, 16 + bob, mark[1]);
  paint.dot(16, 15 + bob, mark[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawManeSide(paint, x, y, mode) {
  const { mane } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const lift = mode === 'lifted' ? -1 : 0;
  const press = mode === 'pressed' ? 1 : 0;
  paint.rect(x, y + 2 + press, 5, 8 - press, mane[1]);
  paint.rect(x - 1, y + 4 + press, 3, 7 - press, mane[0]);
  paint.rect(x + 2, y + lift, 4, 4, mane[2]);
  paint.rect(x + 4, y + 3 + lift, 3, 6, mane[0]);
  paint.dot(x - 1, y + 3 + press, mane[2]);
  paint.dot(x + 1, y + 1 + lift, mane[0]);
}

function drawManeFront(paint, x, y, mode) {
  const { mane } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const lift = mode === 'lifted' ? -1 : 0;
  const press = mode === 'pressed' ? 1 : 0;
  paint.rect(x, y + 2 + press, 10, 9 - press, mane[1]);
  paint.rect(x - 1, y + 4 + press, 3, 6 - press, mane[0]);
  paint.rect(x + 8, y + 4 + press, 3, 6 - press, mane[0]);
  paint.rect(x + 1, y + lift, 3, 4, mane[2]);
  paint.rect(x + 6, y + lift, 3, 4, mane[2]);
  paint.dot(x, y + 2 + lift, mane[0]);
  paint.dot(x + 9, y + 2 + lift, mane[0]);
}

function drawSideHead(paint, phase) {
  const { fur, mask, mane, fang, eye, feature } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const reach = phase.headReach;
  const y = 4 + phase.headY;
  drawManeSide(paint, 13 + Math.min(reach, 1), y, phase.maneMode);
  const faceX = 15 + reach;
  paint.rect(faceX, y + 3, 7, 7, fur[0]);
  paint.rect(faceX + 1, y + 2, 5, 3, fur[2]);
  paint.rect(faceX + 2, y + 4, 5, 5, mask[0]);
  paint.rect(faceX + 3, y + 7, 4, 3, mask[1]);
  paint.rect(faceX + 1, y + 1, 2, 2, mane[0]);
  paint.rect(faceX + 5, y + 1, 2, 2, mane[0]);
  paint.dot(faceX + 4, y + 4, eye);
  paint.dot(faceX + 5, y + 4, feature);
  paint.dot(faceX + 6, y + 8, fang[0]);
  paint.dot(faceX + 3, y + 8, feature);
  paint.dot(faceX + 5, y + 9, feature);
}

function drawFrontHead(paint, phase, rearView) {
  const { fur, mask, mane, fang, eye, feature } = EN_E12_MANTICORE_THORNMANE_STALKER_DATA.manticore;
  const y = 3 + phase.headY;
  const widen = phase.headReach > 0 ? 1 : 0;
  drawManeFront(paint, 7, y, phase.maneMode);
  paint.rect(8 - widen, y + 3, 8 + (widen * 2), 8, fur[0]);
  paint.rect(9 - widen, y + 2, 6 + (widen * 2), 4, fur[2]);
  paint.rect(9, y + 4, 6, 6, rearView ? mane[0] : mask[0]);
  paint.rect(10, y + 7, 4, 4, rearView ? mane[1] : mask[1]);
  paint.rect(8, y + 1, 3, 2, mane[0]);
  paint.rect(13, y + 1, 3, 2, mane[0]);
  if (rearView) {
    paint.rect(10, y + 4, 4, 3, mane[2]);
    return;
  }
  paint.dot(10, y + 5, eye);
  paint.dot(13, y + 5, eye);
  paint.dot(11, y + 6, feature);
  paint.dot(12, y + 6, feature);
  paint.dot(10, y + 9, fang[0]);
  paint.dot(13, y + 9, fang[0]);
  paint.rect(11, y + 9, 2, 1, feature);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawManticoreThornmaneStalkerAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase);
  drawLegs(paint, phase);
  drawBody(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawManticoreThornmaneStalkerAnatomy(colorContext, args.direction, phase);
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
    manticoreThornmaneStalkerGate: EN_E12_MANTICORE_THORNMANE_STALKER_GATE.id,
    architectureDecision: EN_E12_MANTICORE_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id,
    role: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.role,
    anatomy: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.chassis,
    upperBody: 'broad-oxblood-thorn-mane-mask-like-old-bone-lion-face-amber-eyes-and-small-ivory-fangs',
    lowerBody: 'low-sun-baked-tawny-lion-barrel-four-separately-grounded-dark-paws-and-connected-charcoal-segmented-rust-stinger-tail',
    motion,
    childAssetCount: EN_E12_MANTICORE_THORNMANE_STALKER_DATA.childAssets.length,
    effectBoundary: EN_E12_MANTICORE_THORNMANE_STALKER_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = MOTION_PHASES.idle[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'idle', args.frame, phase.name);
}

function renderWalk(args) {
  const phase = MOTION_PHASES.walk[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'walk', args.frame, phase.name);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = MOTION_PHASES.attack[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-four-paw-tail-rise-and-over-back-stinger-thrust' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = MOTION_PHASES.hurt[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-thornmane-stinger-hurt' : phase.name,
  );
}

function renderManticoreThornmaneStalker(args) {
  assert(args.family.id === 'manticore', 'The EN-E12 Manticore renderer is restricted to Manticore.');
  assert(args.variant.id === 'thornmane-stalker', 'The EN-E12 Manticore renderer is restricted to Thornmane Stalker.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Manticore Thornmane Stalker Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Manticore Thornmane Stalker Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Manticore Thornmane Stalker Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Manticore Thornmane Stalker Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Manticore Thornmane Stalker Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Manticore Thornmane Stalker Death authorizes only D1-D4.');
    const sourceFrame = EN_E12_MANTICORE_THORNMANE_STALKER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E12 Manticore Thornmane Stalker gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E12_MANTICORE_THORNMANE_STALKER_RENDERER = Object.freeze({
  key: 'en-e12-manticore-thornmane-stalker-full-v1',
  chassis: EN_E12_MANTICORE_THORNMANE_STALKER_CONTRACT.chassis,
  render: renderManticoreThornmaneStalker,
});

export const EN_E12_MANTICORE_THORNMANE_STALKER_FAMILY = deepFreeze({
  id: 'manticore',
  name: 'Manticore',
  sliceId: 'EN-E12',
  rendererKey: EN_E12_MANTICORE_THORNMANE_STALKER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [THORNMANE_STALKER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id,
    activeGate: EN_E12_MANTICORE_THORNMANE_STALKER_GATE.id,
    topologyDecision: EN_E12_MANTICORE_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'thornmane-stalker',
    scale: 6,
    notes: 'Approved private Thornmane Stalker common Manticore only, bound to exact implementation a2bb4a00d2e4fda941f781efce6e82df3a66e9b2, approval record 1551a82ff386f61f91da98a9069618f98fbb3cca, candidate digest 734d1a7f43bd39399fdb8f81011ca065f931804ee1207ff82fc72784768342f9, and its six frozen review hashes. The implementation and approval record are pushed and remote verified; only the initial handoff and final reconciliation remain. The designer replied approved to the exact packet with no continuation request. Keep public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, specialist or elite Manticore, Sphinx, boss work, release, accepted drift, a pull request, and another enemy gate separate.'
  },
});

export const EN_E12_MANTICORE_THORNMANE_STALKER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E12_MANTICORE_THORNMANE_STALKER_RENDERER],
  families: [EN_E12_MANTICORE_THORNMANE_STALKER_FAMILY],
});
