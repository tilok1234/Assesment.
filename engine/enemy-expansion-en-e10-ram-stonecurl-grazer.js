import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E10_SCARCREST_MATRIARCH_GATE } from './enemy-expansion-en-e10-hyena-scarcrest-matriarch.js';

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
  wool: ['#b8aa8e', '#7d725f', '#d8c9aa'],
  face: ['#55473e', '#302a28', '#756054'],
  horn: ['#c49a5a', '#7d5f38', '#e0bd78'],
  belly: ['#d8cbb2', '#968873', '#eee2c8'],
  ear: ['#a66c68', '#633f42'],
  hoof: '#292425',
  feature: '#171517',
  eye: '#d7b74a',
  flash: '#f4f4f4',
});

export const EN_E10_RAM_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e10-ram-baked-horned-grounded-quadruped-topology-v1',
  status: 'selected',
  selected: 'baked-single-actor-horned-grounded-quadruped',
  selectedOn: '2026-08-13',
  evidence: 'After the clean Scarcrest Matriarch publication, Codex recommended one connected grounded 24x24 Ram with a compact barrel torso, proud arched neck, wedge muzzle, two body-owned swept spiral horns, connected forehead wool and chest beard, four separated dark hooves, a short connected tail, a body-owned horn bash, zero child assets, and all effects external. The designer replied: approved. This selects that topology and authorizes exactly one private common Ram candidate.',
  childAssets: [],
  required: [
    'one connected grounded 24x24 actor',
    'compact barrel torso and proud arched neck',
    'wedge muzzle with two connected swept spiral horns',
    'connected forehead wool, chest beard, and short tail',
    'four readable grounded hooves in every direction',
    'body-owned horn bash',
  ],
  forbidden: [
    'detached horns',
    'detached beard or tail',
    'child assets',
    'runtime attachment offsets',
    'dust or debris sprites',
    'horn arcs or impact particles',
    'projectiles',
    'glow or illumination',
  ],
});

export const EN_E10_RAM_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-ram-stonecurl-grazer-v1',
  sliceId: 'EN-E10',
  family: 'ram',
  familyName: 'Ram',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingCheckpoint: {
    id: EN_E10_SCARCREST_MATRIARCH_GATE.id,
    variant: 'scarcrest-matriarch',
    status: 'approved-published-reconciled',
  },
  activeVariant: {
    id: 'stonecurl-grazer',
    name: 'Stonecurl Grazer',
    role: 'common',
    status: 'implemented-full-awaiting-visual-approval',
  },
  variantBriefs: [
    { role: 'common', brief: 'Ash-cream hill Ram with a compact wool barrel, charcoal face and legs, weathered ochre spiral horns, short beard, and direct body-owned horn bash.' },
    { role: 'specialist', brief: 'Deferred cliff runner with slimmer slate wool, longer swept horns, sure-foot markings, and a body-owned sidestep charge; no dust or rock shards.' },
    { role: 'elite', brief: 'Deferred broad crag patriarch with layered dark fleece, massive ringed horns, facial scars, and a body-owned double-impact ram; no detached trophies or effects.' },
  ],
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored Ram silhouette. Keep the torso compact and barrel-shaped, the neck proud and arched, the muzzle short and wedge-shaped, both spiral horns connected and readable, the forehead wool, beard, and short tail connected, and all four dark hooves separated. It must not collapse into a long-backed Dire Wolf, high-shouldered Hyena, bowed Miremane Courser, upright Goatfolk, or reduced Rhino Boss.',
  effectBoundary: 'external-dust-horn-arcs-impacts-debris-particles-projectiles-glow-illumination-and-runtime-attachments',
});

export const EN_E10_STONECURL_GRAZER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'ram',
  variant: 'stonecurl-grazer',
  role: 'common',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-compact-barrel-arched-neck-connected-spiral-horns-beard-four-hoof-ram-v1',
  silhouette: 'A grounded common Ram with a compact wool barrel, proud arched neck, short wedge muzzle, two large connected swept spiral horns, connected forehead fleece and chest beard, four separated dark hooves, and a short connected tail. It must read as a horned Ram rather than a long-backed Dire Wolf, sloped Hyena, bowed Miremane Courser, upright Goatfolk, antlered Stag, or reduced Rhino Boss.',
  visualIdentity: 'Ash-cream wool, charcoal-brown face and lower legs, weathered ochre spiral horns, pale cream beard and belly, muted rose ear interiors, amber eyes, and black-brown hooves establish the common hill grazer. Dust, horn arcs, impacts, debris, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_STONECURL_GRAZER_DATA = deepFreeze({
  actor: {
    species: 'authored-ram-default',
    bodyBuild: 'compact-barrel-proud-necked-four-hoof-common',
    skin: 'ash-cream-wool',
    hairStyle: 'connected-forehead-fleece-and-chest-beard',
    hairColor: 'ash-cream',
    expression: 'amber-hill-grazer-stare',
    faceDetail: 'short-charcoal-wedge-muzzle-rose-ears-amber-eyes-and-swept-spiral-horns',
    headgear: 'body-owned-weathered-ochre-spiral-horns',
    outfit: 'pale-belly-beard-and-charcoal-lower-legs',
    outfitColor: 'ash-cream-charcoal-ochre-rose-and-amber',
    outfitTier: 'tier1',
    weapon: 'body-owned-connected-horn-bash',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.wool, hair: COLORS.face, outfit: COLORS.belly },
  },
  stonecurlGrazer: COLORS,
  actorTopology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-compact-barrel-arched-neck-wedge-muzzle-connected-spiral-horns-forehead-wool-beard-tail-and-four-grounded-hooves',
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_STONECURL_GRAZER_GATE = deepFreeze({
  id: 'en-e10-ram-stonecurl-grazer-full-v1',
  status: 'awaiting-visual-approval',
  baseCheckpoint: 'a7d2abbd610dfc6096498d1dce096d652e50596d',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Scarcrest Matriarch implementation 88d00336ee8ff714f1d978a5cf37d9807bbb4719, approval record 0411a1a385ddddf090f0ca3d31c81e0a6f6e6214, initial published handoff e0c9fcce275380d501c7ac393619387e033f3046, and final reconciliation a7d2abbd610dfc6096498d1dce096d652e50596d were pushed and remote verified. Codex then presented the separate EN-E10 Ram topology decision: one connected grounded 24x24 actor with body-owned spiral horns and horn bash, four readable hooves, zero child assets, all effects external, and a raw, outlined, Form, and comparison review packet. The designer replied: approved. This selects baked-single-actor-horned-grounded-quadruped and authorizes exactly one private common Ram Stonecurl Grazer full 80-frame candidate. Public Ram or outline registration, fixtures, effects, child assets, specialist or elite Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E10_SCARCREST_MATRIARCH_GATE.id,
    artifactSha256: EN_E10_SCARCREST_MATRIARCH_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_SCARCREST_MATRIARCH_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_SCARCREST_MATRIARCH_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_SCARCREST_MATRIARCH_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_SCARCREST_MATRIARCH_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_SCARCREST_MATRIARCH_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_SCARCREST_MATRIARCH_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_SCARCREST_MATRIARCH_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_SCARCREST_MATRIARCH_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_SCARCREST_MATRIARCH_GATE.initialPublishedHandoff,
    currentReconciliation: 'a7d2abbd610dfc6096498d1dce096d652e50596d',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-ram-stonecurl-grazer/en-e10-ram-stonecurl-grazer-full-suite-raw.png',
  artifactSha256: '81759779be3730ca370f73644ec8fcb12d199119a72fd667a7fa7c301f005893',
  outlinedArtifact: 'enemy-expansion-review/en-e10-ram-stonecurl-grazer/en-e10-ram-stonecurl-grazer-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '7c07c23a49e6133bb45bf73fb5cb95f972f4b49a23a50dbbeb5355aa166c6070',
  assembledArtifact: 'enemy-expansion-review/en-e10-ram-stonecurl-grazer/en-e10-ram-stonecurl-grazer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '6e058b6586b992e6a2b22d67809cf3746bc5863738d40638e48c7f60326d4409',
  comparisonArtifact: 'enemy-expansion-review/en-e10-ram-stonecurl-grazer/en-e10-ram-stonecurl-grazer-family-comparison.png',
  comparisonArtifactSha256: '2bdbf2d4081faa40a4acc5cfb9daad602a254425892e87c35ce31f6c3d9c47f8',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-ram-stonecurl-grazer/en-e10-ram-stonecurl-grazer-full-suite-four-directions-labeled.gif',
      sha256: 'b22bda08edd16db96be31d31fb487fa614985959a618657427386f407d8a066b', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-ram-stonecurl-grazer/en-e10-ram-stonecurl-grazer-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '33c3ed194c31405ac9d78c2bf4a23671568e76dccd3b7716bd1f1fa48f3f6600', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: '79b440290b1c6f503834d44b13d2c9508b34ad48a4ae495c6e957e329095942f',
  scarcrestComparisonDigest: '81e0c289eae61184741155c99a1cef9c03d3d3bae115f7eb96489572fbc00cf7',
  miremaneComparisonDigest: '6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Stonecurl Grazer common Ram across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle lifts and settles the connected forehead fleece over a compact four-hoof stance. Walk uses four alternating diagonal hoof phases while the barrel torso and arched neck carry weight. Attack braces, lowers the connected spiral horns, drives one body-owned horn bash, and recovers without detached horns, dust, arc, debris, or impact pixels. Hurt uses a complete white recoil and colored wide four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, and Complete B + Form full-suite boards, synchronized GIFs, and approved Scarcrest Matriarch and Miremane Courser plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Scarcrest Matriarch or Miremane Courser rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Ram registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached horns, beard, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, horn arcs, impacts, debris, particles, projectiles, glow, illumination, or effects',
    'Ram specialist or elite',
    'Stag, Mammoth, or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'Stop for explicit visual approval of this exact frozen Stonecurl Grazer digest and its four PNG plus two GIF review hashes. Do not register or publish it before approval. The distinct outlined PNG is review evidence only and does not authorize outline registration. Specialist and elite Ram plus all later EN-E10 families remain closed.',
});

export const EN_E10_STONECURL_GRAZER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'forehead-fleece-lift', pose: 'idle', bob: 0, head: 0, horn: -1, reach: 0, stride: [0, 0, 0, 0] },
  { name: 'barrel-body-settle', pose: 'idle', bob: 1, head: 1, horn: 0, reach: 0, stride: [0, 0, 0, 0] },
]);
const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-hoof', pose: 'walk', bob: 0, head: 0, horn: -1, reach: 0, stride: [-1, 1, 0, -1] },
  { name: 'arched-neck-pass', pose: 'walk', bob: -1, head: 0, horn: 0, reach: 0, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-hoof', pose: 'walk', bob: 0, head: 1, horn: 0, reach: 0, stride: [1, -1, 0, 1] },
  { name: 'stonecurl-weight-settle', pose: 'walk', bob: 1, head: 1, horn: -1, reach: 0, stride: [0, -1, 1, 0] },
]);
const ATTACK_PHASES = deepFreeze([
  { name: 'four-hoof-brace', pose: 'brace', bob: 1, head: 0, horn: 0, reach: 0, stride: [-1, 0, 1, 0] },
  { name: 'connected-spiral-horns-lower', pose: 'lower', bob: 1, head: 2, horn: -1, reach: 0, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-horn-bash', pose: 'bash', bob: 0, head: 2, horn: 0, reach: -2, stride: [-1, 1, 1, -1] },
  { name: 'grazer-recover', pose: 'recover', bob: 1, head: 1, horn: -1, reach: 0, stride: [0, 0, 0, 0] },
]);
const HURT_PHASES = deepFreeze([
  { name: 'white-ram-recoil', pose: 'hurt', bob: -1, head: 0, horn: 0, reach: 1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-wide-four-hoof-brace', pose: 'hurt-brace', bob: 1, head: 2, horn: -1, reach: 0, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Stonecurl Grazer geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Stonecurl Grazer pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, positions, stride) {
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + stride[index];
    const legY = 14 + bodyY;
    paint.rect(upperX, legY, 2, 4, index < 2 ? COLORS.face[0] : COLORS.wool[1]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.face[0]);
    paint.rect(footX, legY + 3, 1, 18 - legY, COLORS.face[1]);
    paint.rect(footX, 18, 1, 3, COLORS.belly[1]);
    paint.rect(footX, 21, 2, 2, COLORS.hoof);
  }
}

function drawEndLegs(paint, bodyY, stride) {
  const positions = [5, 9, 13, 17];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + (stride[index] > 0 ? 1 : 0);
    const rearLeg = index === 0 || index === 3;
    const legY = 15 + bodyY + (rearLeg ? 1 : 0);
    paint.rect(upperX, legY, 2, 3, rearLeg ? COLORS.wool[1] : COLORS.face[0]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.face[0]);
    paint.rect(footX, legY + 2, 1, 21 - legY, COLORS.belly[1]);
    paint.rect(footX, 21, 2, 2, COLORS.hoof);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 3 + phase.reach);
  const faceY = 6 + phase.head;

  paint.rect(8, 8 + y, 11, 7, COLORS.wool[0]);
  paint.rect(9, 6 + y, 9, 4, COLORS.wool[2]);
  paint.rect(10, 9 + y, 8, 3, COLORS.wool[1]);
  paint.rect(10, 13 + y, 8, 3, COLORS.belly[0]);
  paint.rect(17, 9 + y, 4, 6, COLORS.wool[1]);
  paint.rect(6, 7 + y, 6, 9, COLORS.wool[0]);
  paint.rect(7, 10 + y, 4, 6, COLORS.belly[2]);

  // Keep the connected forehead fleece behind the face, horn, ear, and eye.
  // This preserves the arched neck while keeping the profile expression readable.
  paint.rect(7, 5 + y, 3, 4, COLORS.wool[2]);
  paint.rect(8, 4 + y, 4, 4, COLORS.wool[0]);
  paint.rect(10, 5 + y, 3, 3, COLORS.wool[2]);

  paint.rect(headX + 2, faceY, 6, 6, COLORS.face[0]);
  paint.rect(headX, faceY + 3, 6, 3, COLORS.face[1]);
  paint.rect(headX + 1, faceY + 5, 5, 2, COLORS.face[2]);
  paint.rect(headX + 5, faceY + 5, 3, 5, COLORS.belly[2]);
  paint.rect(headX + 6, faceY + 7, 2, 4, COLORS.belly[0]);

  const hornY = faceY - 3 + phase.horn;
  paint.rect(headX + 4, hornY, 4, 2, COLORS.horn[2]);
  paint.rect(headX + 6, hornY + 1, 3, 3, COLORS.horn[0]);
  paint.rect(headX + 7, hornY + 3, 2, 4, COLORS.horn[1]);
  paint.rect(headX + 5, hornY + 5, 3, 2, COLORS.horn[2]);
  paint.dot(headX + 7, faceY + 1, COLORS.ear[0]);
  paint.dot(headX + 8, faceY + 2, COLORS.ear[1]);
  paint.dot(headX + 5, faceY + 2, COLORS.eye);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 6, 3, 1, COLORS.feature);

  paint.rect(19, 10 + y, 3, 3, COLORS.wool[0]);
  paint.rect(21, 11 + y, 2, 2, COLORS.wool[2]);
  paint.dot(13, 8 + y, COLORS.belly[2]);
  paint.rect(15, 10 + y, 2, 1, COLORS.face[2]);

  drawSideLegs(paint, y, [5, 9, 14, 18], phase.stride);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const headY = phase.head;
  const hornY = 3 + y + phase.horn;

  paint.rect(6, 9 + y, 13, 7, COLORS.wool[0]);
  paint.rect(7, 7 + y, 11, 5, COLORS.wool[2]);
  paint.rect(8, 13 + y, 9, 4, COLORS.belly[0]);
  paint.rect(7, 15 + y, 11, 2, COLORS.wool[1]);
  paint.rect(8, 5 + headY, 8, 8, COLORS.face[0]);
  paint.rect(9, 9 + headY, 6, 4, COLORS.face[1]);
  paint.rect(10, 11 + headY, 4, 3, COLORS.face[2]);
  paint.rect(10, 4 + y, 4, 4, COLORS.wool[2]);
  paint.rect(9, 5 + y, 6, 3, COLORS.wool[0]);
  paint.rect(10, 12 + y, 4, 5, COLORS.belly[2]);

  paint.rect(4, hornY, 4, 2, COLORS.horn[2]);
  paint.rect(3, hornY + 1, 2, 4, COLORS.horn[0]);
  paint.rect(4, hornY + 4, 4, 2, COLORS.horn[1]);
  paint.rect(7, hornY + 3, 3, 3, COLORS.horn[2]);
  paint.rect(16, hornY, 4, 2, COLORS.horn[2]);
  paint.rect(19, hornY + 1, 2, 4, COLORS.horn[0]);
  paint.rect(16, hornY + 4, 4, 2, COLORS.horn[1]);
  paint.rect(14, hornY + 3, 3, 3, COLORS.horn[2]);

  paint.dot(7, 7 + headY, COLORS.ear[0]);
  paint.dot(16, 7 + headY, COLORS.ear[0]);
  paint.dot(10, 8 + headY, COLORS.eye);
  paint.dot(13, 8 + headY, COLORS.eye);
  paint.dot(10, 11 + headY, COLORS.feature);
  paint.dot(13, 11 + headY, COLORS.feature);
  paint.rect(11, 13 + headY, 2, 1, COLORS.feature);
  paint.rect(18, 11 + y, 3, 3, COLORS.wool[1]);
  paint.rect(20, 12 + y, 2, 2, COLORS.wool[2]);
  drawEndLegs(paint, y, phase.stride);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const headY = phase.head;
  const hornY = 4 + y + phase.horn;

  paint.rect(6, 9 + y, 13, 7, COLORS.wool[0]);
  paint.rect(7, 7 + y, 11, 5, COLORS.wool[2]);
  paint.rect(8, 13 + y, 9, 4, COLORS.belly[1]);
  paint.rect(7, 15 + y, 11, 2, COLORS.wool[1]);
  paint.rect(8, 5 + headY, 8, 8, COLORS.face[0]);
  paint.rect(9, 4 + y, 6, 4, COLORS.wool[0]);
  paint.rect(10, 3 + y, 4, 3, COLORS.wool[2]);
  paint.rect(10, 10 + y, 4, 5, COLORS.belly[2]);

  paint.rect(4, hornY, 4, 2, COLORS.horn[2]);
  paint.rect(3, hornY + 1, 2, 4, COLORS.horn[0]);
  paint.rect(4, hornY + 4, 4, 2, COLORS.horn[1]);
  paint.rect(7, hornY + 3, 3, 3, COLORS.horn[2]);
  paint.rect(16, hornY, 4, 2, COLORS.horn[2]);
  paint.rect(19, hornY + 1, 2, 4, COLORS.horn[0]);
  paint.rect(16, hornY + 4, 4, 2, COLORS.horn[1]);
  paint.rect(14, hornY + 3, 3, 3, COLORS.horn[2]);

  paint.dot(7, 7 + headY, COLORS.ear[1]);
  paint.dot(16, 7 + headY, COLORS.ear[1]);
  paint.rect(18, 11 + y, 3, 3, COLORS.wool[1]);
  paint.rect(20, 12 + y, 2, 2, COLORS.wool[2]);
  drawEndLegs(paint, y, phase.stride);
}

function mirrorPixels(pixels) {
  const mirrored = createPixels();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  return mirrored;
}

function phaseFor(animation, frame) {
  if (animation === 'idle') { assert(frame >= 0 && frame < 2, 'Frame ' + frame + ' is invalid for idle.'); return IDLE_PHASES[frame]; }
  if (animation === 'walk') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for walk.'); return WALK_PHASES[frame]; }
  if (animation === 'attack' || animation === 'cast') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for ' + animation + '.'); return ATTACK_PHASES[frame]; }
  if (animation === 'hurt') { assert(frame >= 0 && frame < 2, 'Frame ' + frame + ' is invalid for hurt.'); return HURT_PHASES[frame]; }
  if (animation === 'death') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.'); return HURT_PHASES[EN_E10_STONECURL_GRAZER_DEATH_SOURCE_FRAMES[frame]]; }
  throw new TypeError('Animation ' + animation + ' is not implemented for Stonecurl Grazer.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Stonecurl Grazer direction ' + direction + '.');
  let rendered = direction === 'right' ? mirrorPixels(pixels) : pixels;
  if (phase.flash) rendered = rendered.map((color) => color ? COLORS.flash : null);
  return { phase, pixels: rendered };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color) { context.fillStyle = color; context.fillRect(x, y, 1, 1); }
  }
}

export function renderEnE10StonecurlGrazerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Stonecurl Grazer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Stonecurl Grazer direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'ram', variant: 'stonecurl-grazer', direction, animation, frame, phase: phase.name,
    stonecurlGrazerGate: EN_E10_STONECURL_GRAZER_GATE.id,
    architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_SCARCREST_MATRIARCH_GATE.id,
    actorTopology: EN_E10_STONECURL_GRAZER_DATA.actorTopology,
    childAssetCount: EN_E10_STONECURL_GRAZER_DATA.childAssets.length,
    alphaPolicy: EN_E10_STONECURL_GRAZER_DATA.alphaPolicy,
    effectBoundary: EN_E10_STONECURL_GRAZER_DATA.effectBoundary,
  });
}

export const EN_E10_STONECURL_GRAZER_RENDERER = deepFreeze({
  key: 'en-e10-ram-stonecurl-grazer-v1',
  chassis: EN_E10_STONECURL_GRAZER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'ram', 'The EN-E10 Stonecurl Grazer renderer is restricted to Ram.');
    assert(variant.id === 'stonecurl-grazer', 'The EN-E10 Stonecurl Grazer renderer is restricted to Stonecurl Grazer.');
    return renderEnE10StonecurlGrazerFrame(context, direction, animation.id, frame);
  },
});

const STONECURL_GRAZER_VARIANT = deepFreeze({
  id: 'stonecurl-grazer',
  name: 'Stonecurl Grazer',
  role: EN_E10_STONECURL_GRAZER_CONTRACT.role,
  status: EN_E10_STONECURL_GRAZER_CONTRACT.state,
  brief: 'A private complete common Ram with compact ash-cream wool barrel, charcoal face and lower legs, weathered ochre connected spiral horns, pale beard and belly, rose ears, amber eyes, short connected tail, four dark hooves, and a body-owned horn bash; all effects remain external.',
  rendererData: EN_E10_STONECURL_GRAZER_DATA,
});

export const EN_E10_STONECURL_GRAZER_FAMILY = deepFreeze({
  id: 'ram',
  name: 'Ram Stonecurl Grazer Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_STONECURL_GRAZER_CONTRACT.chassis,
  rendererKey: EN_E10_STONECURL_GRAZER_RENDERER.key,
  variants: [STONECURL_GRAZER_VARIANT],
  rendererData: {
    contractCard: EN_E10_RAM_CONTRACT_CARD.id,
    architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_SCARCREST_MATRIARCH_GATE.id,
    activeGate: EN_E10_STONECURL_GRAZER_GATE.id,
  },
  review: {
    baselineVariant: 'stonecurl-grazer',
    scale: 8,
    notes: 'Awaiting explicit visual approval as one common horned Ram against approved Scarcrest Matriarch and Miremane Courser plus public Dire Wolf. The packet includes a distinct Complete B outlined PNG as review evidence. Keep outline registration, public registration, fixtures, effects, child assets, later Ram roles and EN-E10 families, Rhino Boss work, and deferred Runic Idol separate.',
  },
});

export const EN_E10_STONECURL_GRAZER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_STONECURL_GRAZER_RENDERER],
  families: [EN_E10_STONECURL_GRAZER_FAMILY],
});
