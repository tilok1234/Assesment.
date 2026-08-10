import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_DOPPELGANGER_CONTRACT_CARD,
  EN_E07_PALE_ECHO_GATE,
} from './enemy-expansion-en-e07-doppelganger-pale-echo.js';
import {
  EN_E07_FALSEFACE_ADEPT_GATE,
  renderEnE07FalsefaceAdeptFrame,
} from './enemy-expansion-en-e07-doppelganger-falseface-adept.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COLORS = deepFreeze({
  skin: ['#cbbec2', '#91838f', '#ead9d5'],
  hair: ['#4b4558', '#2b2935', '#736a7e'],
  cloth: ['#4c6072', '#303e4c', '#74899b'],
  accent: ['#92566f', '#663a52', '#c47b96'],
  veil: ['#a9a0aa', '#756d7c', '#d0c4cd'],
  eye: '#d8eef2',
  flash: '#f4f4f4',
});

const RECOLOR = Object.freeze({
  '#cbbec2': COLORS.skin[0],
  '#91838f': COLORS.skin[1],
  '#ead9d5': COLORS.skin[2],
  '#4b4558': COLORS.hair[0],
  '#2b2935': COLORS.hair[1],
  '#736a7e': COLORS.hair[2],
  '#4c6072': COLORS.cloth[0],
  '#303e4c': COLORS.cloth[1],
  '#74899b': COLORS.cloth[2],
  '#92566f': COLORS.accent[0],
  '#663a52': COLORS.accent[1],
  '#c47b96': COLORS.accent[2],
  '#a9a0aa': COLORS.veil[0],
  '#756d7c': COLORS.veil[1],
  '#d0c4cd': COLORS.veil[2],
  '#d8eef2': COLORS.eye,
  '#f4f4f4': COLORS.flash,
});

export const EN_E07_GRAND_PRETENDER_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'doppelganger',
  variant: 'grand-pretender',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'fused-three-panel-visage-swept-crest-asymmetric-mantle-layered-split-coat-connected-claiming-hands-grounded-humanoid-v1',
  silhouette: 'A broad but public-humanoid-scale authored Doppelganger elite with one fused three-panel visage, a swept three-point hair crest, asymmetric connected mantle wings, a layered split formal coat, two connected long-finger claiming hands, separated legs, and grounded broad boots. It must read as the family elite without becoming a Living Shadow crown, robed caster, armored monarch, copied actor, detached-mask swarm, or simply an enlarged Falseface Adept.',
  identity: 'The approved pale gray-rose, charcoal-violet, cool-slate, faded-wine, and soft-veil family language is concentrated into a single connected ceremonial default form. A fused tri-seam face, swept crest, opposed mantle folds, layered coat panels, and paired claiming hands establish rank while the authored sheet never copies another actor or bakes in a detached face, mirror, double, reflection, ribbon, glow, or projectile.',
  effectBoundary: EN_E07_DOPPELGANGER_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_GRAND_PRETENDER_DATA = deepFreeze({
  actor: {
    species: 'authored-doppelganger-default',
    bodyBuild: 'broad-grounded-public-humanoid',
    skin: 'pale-gray-rose',
    hairStyle: 'swept-three-point-crest',
    hairColor: 'charcoal-violet',
    expression: 'fused-three-panel-grand-pretender',
    faceDetail: 'connected-tri-seam-visage-and-offset-eyes',
    headgear: 'none',
    outfit: 'asymmetric-connected-mantle-layered-split-formal-coat',
    outfitColor: 'cool-slate-and-faded-wine',
    outfitTier: 'tier3',
    weapon: 'paired-connected-claiming-hands',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: COLORS.cloth,
    },
  },
  grandPretender: COLORS,
  alphaPolicy: 'binary-connected-three-panel-visage-swept-crest-asymmetric-mantle-layered-split-coat-twin-connected-claiming-hands-separated-legs-and-grounded-boots',
  effectBoundary: 'external-copied-actors-detached-faces-mirror-doubles-reflection-planes-peeling-skin-loose-ribbons-afterimages-glow-particles-projectiles-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E07_GRAND_PRETENDER_GATE = deepFreeze({
  id: 'en-e07-doppelganger-grand-pretender-full-v1',
  status: 'approved',
  baseCheckpoint: 'b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact repaired Falseface Adept was visually approved, committed, pushed, and reconciled at clean published checkpoint b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c, the designer replied: lets do nezxt. The frozen Doppelganger role order is common, specialist, elite, so the one-complete-sprite cadence authorizes only one private elite Grand Pretender 80-frame candidate.',
  approvedOn: '2026-08-10',
  approvalEvidence: 'After the exact repaired labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Pale Echo and Falseface Adept plus public Cultist Zealot comparison, and paired GIF evidence were presented, and the three exact repaired PNG review boards were opened together in responsive Aseprite, the designer replied: Approved lets do next. Approval applies only to candidate digest 03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb; Doppelganger registration, fixtures, runtime copying, effects, Will-o-Wisp, later families, release, and EN-E08 remain separate gates.',
  approvedImplementation: '0a8d5094d5e5de575f1966db30fc01d093a866c3',
  publicationAuthorizedOn: '2026-08-10',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, runtime copying, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  publicationState: 'authorized-pending-bounded-publication',
  precedingApproval: {
    gateId: EN_E07_FALSEFACE_ADEPT_GATE.id,
    artifactSha256: EN_E07_FALSEFACE_ADEPT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_FALSEFACE_ADEPT_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_FALSEFACE_ADEPT_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_FALSEFACE_ADEPT_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_FALSEFACE_ADEPT_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_FALSEFACE_ADEPT_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_FALSEFACE_ADEPT_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_FALSEFACE_ADEPT_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_FALSEFACE_ADEPT_GATE.initialPublishedHandoff,
    currentReconciliation: 'b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-doppelganger-grand-pretender/en-e07-doppelganger-grand-pretender-full-suite-raw.png',
  artifactSha256: 'd919fcc3003fa0fdc5283c4b4388aa9b2032a0d0d14a0ee006ca8da3dd21ad98',
  assembledArtifact: 'enemy-expansion-review/en-e07-doppelganger-grand-pretender/en-e07-doppelganger-grand-pretender-full-suite-complete-b-form.png',
  assembledArtifactSha256: '92468560ff1e0fa304eb7d681c8ab330c30fd8abf8ddacf656881ba321df36f5',
  comparisonArtifact: 'enemy-expansion-review/en-e07-doppelganger-grand-pretender/en-e07-doppelganger-grand-pretender-humanoid-comparison.png',
  comparisonArtifactSha256: '0e6acc2acc79b5f2cd0792e807b54286c1a9897ce7ff09e3b3bf3bbbd8d77b66',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-doppelganger-grand-pretender/en-e07-doppelganger-grand-pretender-full-suite-four-directions-labeled.gif',
      sha256: '8980e6a317f8bb228690616ba41dc8bdc0d734fb40a78d2b2bf82ab89b0ca1b9',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-doppelganger-grand-pretender/en-e07-doppelganger-grand-pretender-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'fc8619df2ab422d7bc62fb7f2559d97de7e1f61a6e55ab936b265b09206290f9',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb',
  cultistZealotComparisonDigest: 'ce0afd5e1e6fb0fcf4b6e5afd5b35b7064c982eff0e35c03737bde59fa417fb0',
  paleEchoComparisonDigest: EN_E07_PALE_ECHO_GATE.candidateFrameDigest,
  falsefaceAdeptComparisonDigest: EN_E07_FALSEFACE_ADEPT_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Grand Pretender elite Doppelganger across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the fused three-panel visage, swept crest, and opposed mantle folds. Walk uses four grounded alternating steps with counter-moving crest, mantle, coat tails, and connected claiming hands. Attack frames the face with both connected hands, compresses the fused tri-seam without detaching it, opens into one broad opposing-hand identity claim, and resets the authored elite form. Hurt uses a complete white recoil and a colored mantle brace that preserves the head, split legs, and boots. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and an approved Pale Echo and Falseface Adept plus public Cultist Zealot silhouette comparison together.',
  exclusions: [
    'changes to approved Pale Echo rendered pixels',
    'changes to approved Falseface Adept rendered pixels',
    'changes to approved Living Shadow source modules or pixels',
    'public Doppelganger registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'runtime actor copying',
    'new Cast pixels',
    'new Death pixels',
    'copied actor silhouettes',
    'detached faces',
    'mirror doubles',
    'reflection planes',
    'peeling skin',
    'loose skin ribbons',
    'afterimages',
    'glow',
    'particles',
    'projectiles',
    'impact flashes',
    'effects',
    'release',
    'another Doppelganger variant',
    'Will-o-Wisp',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact repaired Grand Pretender candidate is visually approved and its implementation is committed at 0a8d5094d5e5de575f1966db30fc01d093a866c3. Its bounded approval-record, documentation reconciliation, and branch push are authorized. After a clean published reconciliation, the same Approved lets do next response opens only one private common Will-o-Wisp candidate. Do not register Doppelganger, generate fixtures, add runtime copying or effects, release, start another Will-o-Wisp role or later family beyond that candidate, or advance EN-E08.',
});

export const EN_E07_GRAND_PRETENDER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-mantle-step', pose: 'walk', bob: 0, step: -1, arm: 1, seam: -1 },
  { name: 'swept-crest-pass', pose: 'walk', bob: -1, step: 0, arm: -1, seam: 1 },
  { name: 'right-mantle-step', pose: 'walk', bob: 0, step: 1, arm: -1, seam: 1 },
  { name: 'split-coat-settle', pose: 'walk', bob: 1, step: 0, arm: 1, seam: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'paired-visage-frame', pose: 'frame', bob: 0, step: 0, arm: 0, seam: 0 },
  { name: 'fused-tri-seam-compress', pose: 'compress', bob: -1, step: 0, arm: 1, seam: 1 },
  { name: 'opposed-identity-claim', pose: 'claim', bob: 0, step: 1, arm: -1, seam: 0 },
  { name: 'authored-mantle-reset', pose: 'reset', bob: 1, step: 0, arm: 0, seam: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-pretender-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, seam: 0, flash: true },
  { name: 'colored-mantle-brace', pose: 'brace', bob: 1, step: 0, arm: -1, seam: -1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Grand Pretender Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'tri-panel-visage-hold', pose: 'idle', bob: 0, step: 0, arm: -1, seam: -1 }
      : { name: 'swept-crest-settle', pose: 'idle', bob: 1, step: 0, arm: 1, seam: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E07_GRAND_PRETENDER_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function pixelCanvas() {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Grand Pretender clear must remain inside the 24x24 cell.');
        pixels[(py * SIZE) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Grand Pretender source pixels must remain inside the 24x24 cell.');
        pixels[(py * SIZE) + px] = fillStyle;
      }
    },
  };
  return { context, pixels };
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Grand Pretender rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Grand Pretender authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function overlayFront(paint, rear, phase) {
  const y = phase.bob || 0;
  const sweep = phase.seam > 0 ? 1 : 0;

  // Replace the inherited fringe with one continuous right-swept staircase.
  paint.rect(7 + sweep, 3 + y, 3, 4, null);

  // Broad asymmetric mantle wings remain fused to the shoulders and torso.
  paint.rect(5, 9 + y, 4, 5, COLORS.veil[1]);
  paint.rect(15, 9 + y, 4, 5, COLORS.veil[0]);
  paint.dot(4, 10 + y, COLORS.veil[2]);
  paint.dot(19, 10 + y, COLORS.accent[2]);

  // One fused three-panel visage; rear view keeps only its connected clasp.
  if (rear) {
    paint.rect(10, 6 + y, 4, 4, COLORS.veil[1]);
    paint.dot(11, 7 + y, COLORS.veil[2]);
    paint.dot(13, 8 + y, COLORS.accent[2]);
  } else {
    paint.dot(10, 7 + y, COLORS.skin[0]);
    paint.dot(14, 8 + y, COLORS.skin[0]);
    paint.rect(10, 5 + y, 1, 5, COLORS.veil[2]);
    paint.rect(13, 5 + y, 1, 5, COLORS.accent[2]);
    paint.dot(11, 7 + y, COLORS.eye);
    paint.dot(14, 7 + y, COLORS.eye);
    paint.dot(12, 6 + y, COLORS.skin[2]);
  }

  // Hair occludes the seam tops so the face cannot turn into a crown silhouette.
  paint.rect(8 + sweep, 5 + y, 8, 2, COLORS.hair[1]);
  paint.rect(10 + sweep, 4 + y, 8, 1, COLORS.hair[1]);
  paint.rect(13 + sweep, 3 + y, 5, 1, COLORS.hair[1]);
  paint.dot(11 + sweep, 5 + y, COLORS.hair[2]);
  paint.dot(18 + sweep, 4 + y, COLORS.accent[2]);

  // Layered split formal coat broadens the elite while preserving two legs.
  paint.rect(6, 12 + y, 3, 6, COLORS.cloth[1]);
  paint.rect(15, 12 + y, 3, 6, COLORS.accent[1]);
  paint.rect(9, 13 + y, 2, 5, COLORS.veil[1]);
  paint.rect(13, 13 + y, 2, 5, COLORS.veil[0]);
  paint.dot(11, 14 + y, COLORS.cloth[2]);
  paint.dot(12, 15 + y, COLORS.accent[2]);
  paint.rect(7, 18, 4, 2, COLORS.veil[1]);
  paint.rect(13, 18, 4, 2, COLORS.veil[0]);

  if (phase.pose === 'frame') {
    // Connected cheek-side hands frame the visage without replacing it.
    paint.rect(6, 9 + y, 3, 2, COLORS.skin[1]);
    paint.rect(8, 8 + y, 2, 2, COLORS.skin[2]);
    paint.rect(15, 9 + y, 3, 2, COLORS.skin[0]);
    paint.rect(14, 8 + y, 2, 2, COLORS.skin[2]);
    if (!rear) {
      paint.rect(10, 5 + y, 1, 5, COLORS.veil[2]);
      paint.rect(13, 5 + y, 1, 5, COLORS.accent[2]);
      paint.dot(11, 7 + y, COLORS.eye);
      paint.dot(14, 7 + y, COLORS.eye);
      paint.dot(12, 6 + y, COLORS.skin[2]);
    }
  } else if (phase.pose === 'compress') {
    paint.rect(9, 7 + y, 2, 3, COLORS.skin[1]);
    paint.rect(14, 7 + y, 2, 3, COLORS.skin[0]);
    paint.rect(11, 5 + y, 3, 4, COLORS.veil[0]);
    if (!rear) {
      paint.dot(11, 7 + y, COLORS.eye);
      paint.dot(14, 7 + y, COLORS.eye);
    }
  } else if (phase.pose === 'claim') {
    paint.rect(5, 10 + y, 7, 2, COLORS.skin[1]);
    paint.rect(12, 12 + y, 7, 2, COLORS.skin[0]);
    paint.dot(4, 10 + y, COLORS.veil[2]);
    paint.dot(19, 13 + y, COLORS.accent[2]);
  } else {
    const arm = phase.arm || 0;
    paint.rect(4, 13 + y, 3, 4, COLORS.skin[1]);
    paint.rect(17, 13 + y, 3, 4, COLORS.skin[0]);
    paint.rect(3, 16 + y + Math.max(arm, 0), 3, 1, COLORS.skin[2]);
    paint.rect(19, 16 + y + Math.max(-arm, 0), 3, 1, COLORS.skin[0]);
    paint.dot(3, 17 + y + Math.max(arm, 0), COLORS.veil[2]);
    paint.dot(21, 17 + y + Math.max(-arm, 0), COLORS.accent[2]);
  }

  if (phase.pose === 'brace') {
    paint.rect(5, 10 + y, 5, 4, COLORS.veil[1]);
    paint.rect(14, 10 + y, 5, 4, COLORS.veil[0]);
    paint.rect(10, 13 + y, 4, 2, COLORS.cloth[1]);
  }
}

function overlayRight(paint, phase) {
  const y = phase.bob || 0;
  const sweep = phase.seam > 0 ? 1 : 0;

  paint.rect(8 + sweep, 3 + y, 3, 4, null);
  paint.rect(6, 9 + y, 5, 5, COLORS.veil[1]);
  paint.rect(16, 9 + y, 4, 5, COLORS.veil[0]);
  paint.dot(5, 10 + y, COLORS.veil[2]);
  paint.dot(20, 10 + y, COLORS.accent[2]);

  paint.dot(15, 7 + y, COLORS.skin[0]);
  paint.rect(14, 5 + y, 1, 5, COLORS.veil[2]);
  paint.rect(17, 6 + y, 1, 4, COLORS.accent[2]);
  paint.dot(16, 7 + y, COLORS.eye);

  paint.rect(9 + sweep, 5 + y, 9, 2, COLORS.hair[1]);
  paint.rect(11 + sweep, 4 + y, 8, 1, COLORS.hair[1]);
  paint.rect(14 + sweep, 3 + y, 6, 1, COLORS.hair[1]);
  paint.dot(12 + sweep, 5 + y, COLORS.hair[2]);
  paint.dot(19 + sweep, 4 + y, COLORS.accent[2]);

  paint.rect(7, 12 + y, 3, 6, COLORS.cloth[1]);
  paint.rect(16, 12 + y, 3, 6, COLORS.accent[1]);
  paint.rect(10, 13 + y, 2, 5, COLORS.veil[1]);
  paint.rect(14, 13 + y, 2, 5, COLORS.veil[0]);
  paint.dot(12, 14 + y, COLORS.cloth[2]);
  paint.dot(13, 15 + y, COLORS.accent[2]);
  paint.rect(8, 18, 4, 2, COLORS.veil[1]);
  paint.rect(14, 18, 4, 2, COLORS.veil[0]);

  if (phase.pose === 'frame') {
    paint.rect(9, 9 + y, 3, 2, COLORS.skin[1]);
    paint.rect(11, 8 + y, 2, 2, COLORS.skin[2]);
    paint.rect(17, 9 + y, 3, 2, COLORS.skin[0]);
    paint.rect(16, 8 + y, 2, 2, COLORS.skin[2]);
    paint.rect(14, 5 + y, 1, 5, COLORS.veil[2]);
    paint.rect(17, 6 + y, 1, 4, COLORS.accent[2]);
    paint.dot(16, 7 + y, COLORS.eye);
  } else if (phase.pose === 'compress') {
    paint.rect(12, 7 + y, 2, 3, COLORS.skin[1]);
    paint.rect(17, 7 + y, 2, 3, COLORS.skin[0]);
    paint.rect(14, 5 + y, 3, 4, COLORS.veil[0]);
    paint.dot(16, 7 + y, COLORS.eye);
  } else if (phase.pose === 'claim') {
    paint.rect(6, 10 + y, 7, 2, COLORS.skin[1]);
    paint.rect(13, 12 + y, 7, 2, COLORS.skin[0]);
    paint.dot(5, 10 + y, COLORS.veil[2]);
    paint.dot(20, 13 + y, COLORS.accent[2]);
  } else {
    const arm = phase.arm || 0;
    paint.rect(5, 13 + y, 3, 4, COLORS.skin[1]);
    paint.rect(18, 13 + y, 3, 4, COLORS.skin[0]);
    paint.rect(4, 16 + y + Math.max(arm, 0), 3, 1, COLORS.skin[2]);
    paint.rect(20, 16 + y + Math.max(-arm, 0), 2, 1, COLORS.skin[0]);
    paint.dot(4, 17 + y + Math.max(arm, 0), COLORS.veil[2]);
    paint.dot(21, 17 + y + Math.max(-arm, 0), COLORS.accent[2]);
  }

  if (phase.pose === 'brace') {
    paint.rect(6, 10 + y, 5, 4, COLORS.veil[1]);
    paint.rect(15, 10 + y, 5, 4, COLORS.veil[0]);
    paint.rect(11, 13 + y, 4, 2, COLORS.cloth[1]);
  }
}

function mirrorPixels(pixels) {
  const result = new Array(SIZE * SIZE).fill(null);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  }
  return result;
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, 'Grand Pretender animation ' + animation + ' frame ' + frame + ' is out of range.');
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const source = pixelCanvas();
  renderEnE07FalsefaceAdeptFrame(source.context, canonicalDirection, animation, frame);
  let pixels = source.pixels.map((color) => color === null ? null : (RECOLOR[color] || color));
  const paint = painter(pixels);
  if (canonicalDirection === 'right') overlayRight(paint, phase);
  else overlayFront(paint, canonicalDirection === 'up', phase);
  if (phase.flash) pixels = pixels.map((color) => color ? COLORS.flash : null);
  if (direction === 'left') pixels = mirrorPixels(pixels);
  return Object.freeze({ phase, pixels: Object.freeze(pixels) });
}

function paintPixels(context, pixels) {
  for (let index = 0; index < pixels.length; index++) {
    const fill = pixels[index];
    if (!fill) continue;
    context.fillStyle = fill;
    context.fillRect(index % SIZE, Math.floor(index / SIZE), 1, 1);
  }
}

export function renderEnE07GrandPretenderFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Grand Pretender rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Grand Pretender direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'doppelganger',
    variant: 'grand-pretender',
    direction,
    animation,
    frame,
    phase: phase.name,
    grandPretenderGate: EN_E07_GRAND_PRETENDER_GATE.id,
    approvedPrecedingGate: EN_E07_FALSEFACE_ADEPT_GATE.id,
    alphaPolicy: EN_E07_GRAND_PRETENDER_DATA.alphaPolicy,
    effectBoundary: EN_E07_GRAND_PRETENDER_DATA.effectBoundary,
  });
}

export const EN_E07_GRAND_PRETENDER_RENDERER = deepFreeze({
  key: 'en-e07-doppelganger-grand-pretender-v1',
  chassis: EN_E07_GRAND_PRETENDER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'doppelganger', 'The EN-E07 Grand Pretender renderer is restricted to Doppelganger.');
    assert(variant.id === 'grand-pretender', 'The EN-E07 Grand Pretender renderer is restricted to Grand Pretender.');
    return renderEnE07GrandPretenderFrame(context, direction, animation.id, frame);
  },
});

const GRAND_PRETENDER_VARIANT = deepFreeze({
  id: 'grand-pretender',
  name: 'Grand Pretender',
  role: EN_E07_GRAND_PRETENDER_CONTRACT.role,
  status: EN_E07_GRAND_PRETENDER_CONTRACT.state,
  brief: 'An approved complete elite Doppelganger with one fused three-panel visage, swept hair crest, asymmetric connected mantle, layered split formal coat, paired connected claiming hands, separated legs, and planted boots; copied actors, detached faces, doubles, reflections, loose morph pieces, glow, and particles remain external.',
  rendererData: EN_E07_GRAND_PRETENDER_DATA,
});

export const EN_E07_GRAND_PRETENDER_FAMILY = deepFreeze({
  id: 'doppelganger',
  name: 'Doppelganger Grand Pretender Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_GRAND_PRETENDER_CONTRACT.chassis,
  rendererKey: EN_E07_GRAND_PRETENDER_RENDERER.key,
  variants: [GRAND_PRETENDER_VARIANT],
  rendererData: {
    contractCard: EN_E07_DOPPELGANGER_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_FALSEFACE_ADEPT_GATE.id,
    activeGate: EN_E07_GRAND_PRETENDER_GATE.id,
  },
  review: {
    baselineVariant: 'grand-pretender',
    scale: 8,
    notes: 'Visually approved as one broad public-humanoid-scale Grand Pretender against approved Pale Echo and Falseface Adept plus public Cultist Zealot. The exact implementation is committed locally and its bounded publication is authorized. Keep registration, fixtures, runtime copying, effects, Will-o-Wisp, and later Wave 2 work separate until the clean published reconciliation.',
  },
});

export const EN_E07_GRAND_PRETENDER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_GRAND_PRETENDER_RENDERER],
  families: [EN_E07_GRAND_PRETENDER_FAMILY],
});
