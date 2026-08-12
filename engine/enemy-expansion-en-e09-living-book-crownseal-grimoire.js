import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD,
  EN_E09_LIVING_BOOK_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e09-living-book-claspbound-primer.js';
import {
  EN_E09_STARLOCK_LEXICON_GATE,
} from './enemy-expansion-en-e09-living-book-starlock-lexicon.js';

function assert(condition, message) { if (!condition) throw new TypeError(message); }
function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COLORS = deepFreeze({
  cover: ['#5a326f', '#21142e', '#9864a8'],
  gilt: ['#c79a3e', '#6e4722', '#f0d37a'],
  page: ['#d8d2bb', '#7d7469', '#fff2cf'],
  seal: ['#a83d47', '#54202b', '#e86a62'],
  binding: ['#59606f', '#222633', '#9ba5ad'],
  cavity: ['#1a1424', '#08070d'],
  script: '#68d5cc',
  flash: '#f4f4f4',
});

export const EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT_CARD = deepFreeze({
  id: 'en-e09-living-book-crownseal-grimoire-v1',
  sliceId: 'EN-E09',
  family: 'living-book',
  familyName: 'Living Book',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'starlock-lexicon', name: 'Starlock Lexicon', role: 'specialist',
    identity: 'star-lock-stepped-index-connected-page-fan-lexicon', status: 'approved-published',
  },
  activeVariant: {
    id: 'crownseal-grimoire', name: 'Crownseal Grimoire', role: 'elite',
    identity: 'crown-spine-tiered-page-mass-triple-seal-cathedral-vault-grimoire', status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: [],
  actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and a broad monumental elite-book silhouette. Keep one royal-violet cover mass, connected gilt crown-spine, tiered ivory page block, integrated crimson triple seals, and one readable turquoise crown script. The cathedral spread and twin-cover crush remain body-owned. The grimoire must remain one baked actor without a humanoid face, hands, loose pages, detached bookmark, projectiles, script flare, glow, or child assets.',
  effectBoundary: EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT = deepFreeze({
  sliceId: 'EN-E09', family: 'living-book', variant: 'crownseal-grimoire', role: 'elite',
  identity: 'crown-spine-tiered-page-mass-triple-seal-cathedral-vault-grimoire',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-broad-cover-connected-crown-spine-tiered-page-mass-triple-seal-cathedral-vault-v1',
  silhouette: 'A broad monumental hovering grimoire with a connected three-point crown-spine, deep cover shoulders, tiered page mass, integrated triple seals, and a wide cathedral page vault. Attack unfolds around the central crown-spine and performs a body-owned twin-cover crush. It must read as an elite living book rather than compact Claspbound Primer, tall Starlock Lexicon, handheld spellbook, Mimic chest, royal mask, clockwork construct, or detached page effect.',
  visualIdentity: 'Royal-violet leather, black binding, gilt crown-spine, layered ivory pages, crimson seal bands, and one turquoise crown script communicate an ancient sovereign grimoire. No eyes, mouth, hands, limbs, cloth body, weapon anatomy, loose pages, aura, glow, projectiles, or detached component is used.',
  effectBoundary: EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_CROWNSEAL_GRIMOIRE_DATA = deepFreeze({
  actor: {
    species: 'baked-living-book', bodyBuild: 'broad-monumental-sovereign-grimoire',
    skin: 'none', hairStyle: 'none', hairColor: 'none', expression: 'single-readable-turquoise-crown-script',
    faceDetail: 'geometric-crown-script-without-face-anatomy', headgear: 'none',
    outfit: 'baked-royal-violet-cover-gilt-crown-spine-tiered-ivory-page-mass-and-crimson-triple-seals',
    outfitColor: 'royal-violet-black-gilt-ivory-crimson-and-turquoise', outfitTier: 'tier3',
    weapon: 'body-owned-cathedral-vault-twin-cover-crush', weaponTier: 'none',
    shield: 'none', shieldTier: 'tier1', offhand: 'none',
    palette: { skin: COLORS.page, hair: COLORS.seal, outfit: COLORS.cover },
  },
  crownsealGrimoire: COLORS,
  actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-cover-crown-spine-tiered-page-mass-triple-seals-script-cathedral-vault-and-twin-cover-crush',
  effectBoundary: EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E09_CROWNSEAL_GRIMOIRE_GATE = deepFreeze({
  id: 'en-e09-living-book-crownseal-grimoire-full-v1',
  status: 'implemented-awaiting-visual-approval',
  baseCheckpoint: '77334139e5fb968b8f8415a3b13e60e6e0b632d0',
  authorizedOn: '2026-08-12',
  authorizationEvidence: 'After the exact Starlock Lexicon publication tuple was clean and remote verified at checkpoint 77334139e5fb968b8f8415a3b13e60e6e0b632d0, the designer replied: lets do nex t. Following the Living Book common-specialist-elite role order under the selected connected 24x24 zero-child topology, this authorizes only one private Crownseal Grimoire 80-frame elite art candidate. Registration, fixtures, effects, child assets, Runic Idol, Crystal Beast, later families, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.id,
  approvedOn: null, approvalEvidence: null, approvedImplementation: null,
  publicationAuthorizedOn: '2026-08-12',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any other unopened gate.',
  publishedImplementation: null, publishedApprovalRecord: null, initialPublishedHandoff: null,
  publicationState: 'not-approved',
  precedingApproval: {
    gateId: EN_E09_STARLOCK_LEXICON_GATE.id,
    artifactSha256: EN_E09_STARLOCK_LEXICON_GATE.artifactSha256,
    assembledArtifactSha256: EN_E09_STARLOCK_LEXICON_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E09_STARLOCK_LEXICON_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E09_STARLOCK_LEXICON_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E09_STARLOCK_LEXICON_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E09_STARLOCK_LEXICON_GATE.candidateFrameDigest,
    publishedImplementation: EN_E09_STARLOCK_LEXICON_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E09_STARLOCK_LEXICON_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E09_STARLOCK_LEXICON_GATE.initialPublishedHandoff,
    currentReconciliation: '77334139e5fb968b8f8415a3b13e60e6e0b632d0',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e09-living-book-crownseal-grimoire/en-e09-living-book-crownseal-grimoire-full-suite-raw.png',
  artifactSha256: '1ea8742965273838a4c96b3e3e0a71b8d29e19abf37f552b1aa4d0596c6b5b80',
  assembledArtifact: 'enemy-expansion-review/en-e09-living-book-crownseal-grimoire/en-e09-living-book-crownseal-grimoire-full-suite-complete-b-form.png',
  assembledArtifactSha256: '55dcef98ba7bfd5e208b17b25df537f93ef1b7de6554bb0dc54cf462a58c8593',
  comparisonArtifact: 'enemy-expansion-review/en-e09-living-book-crownseal-grimoire/en-e09-living-book-crownseal-grimoire-family-comparison.png',
  comparisonArtifactSha256: 'a44c5aaca75fef3dc60227cbf64d197a990c585d0765c1f681f4f60f6e4f4079',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e09-living-book-crownseal-grimoire/en-e09-living-book-crownseal-grimoire-full-suite-four-directions-labeled.gif', sha256: '7d5f61ff22612e8e984b1b009eecfe91e9eb9fd540d3f0ec8b3260adb21659f5', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e09-living-book-crownseal-grimoire/en-e09-living-book-crownseal-grimoire-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '61fd569f735a68e3dc5d50b3fe448321f879247ce27fa1ec966bcbe8180be9b4', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: '7c1ea4a637b46b0fc494670e83a6527535b02b0c21705c0450f74cf1293ce024',
  scope: 'One complete 80-frame Crownseal Grimoire elite Living Book across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the connected crown-spine and tiered page mass. Walk uses four heavy regal hover pitches. Attack braces, opens into one connected cathedral page vault, performs a body-owned twin-cover crush with no loose-page, impact, or script-flare pixels, and recovers. Hurt uses a complete white recoil and colored triple-seal brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Starlock Lexicon, Claspbound Primer, and Epochforge Colossus family comparisons together.',
  exclusions: ['changes to approved Starlock Lexicon, Claspbound Primer, or earlier rendered pixels', 'public Living Book registration', 'public catalog or facade exposure', 'asset-pack fixture or manifest changes', 'schema changes', 'shared renderer changes', 'exporter changes', 'validator changes', 'frame-contract changes', 'deterministic child/state exports', 'runtime attachment offsets', 'loose pages', 'detached bookmark', 'separate covers', 'new Cast pixels', 'new Death pixels', 'humanoid face', 'eyes or mouth', 'hands or limbs', 'handheld weapon or shield', 'aura', 'glow', 'particles', 'projectiles', 'script flare', 'impacts', 'illumination', 'effects', 'additional Living Book variants', 'Runic Idol, Crystal Beast, or later work', 'release', 'accepted drift'],
  nextGate: 'Stop for explicit designer visual approval of the exact frozen Crownseal Grimoire review artifacts and candidate digest. Do not publish, register, add fixtures, add child/state assets, add effects, begin Runic Idol, Crystal Beast, or later families, release, accept drift, or open a pull request.',
});

export const EN_E09_CROWNSEAL_GRIMOIRE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);
const IDLE = deepFreeze([{ name: 'crown-seal-hover', pose: 'sealed', bob: 0, tilt: 0 }, { name: 'tiered-page-thrum', pose: 'thrum', bob: -1, tilt: 0 }]);
const WALK = deepFreeze([{ name: 'left-regal-pitch', pose: 'sealed', bob: 0, tilt: -1 }, { name: 'sovereign-rise', pose: 'thrum', bob: -1, tilt: 0 }, { name: 'right-regal-pitch', pose: 'sealed', bob: 0, tilt: 1 }, { name: 'grimoire-settle', pose: 'thrum', bob: 1, tilt: 0 }]);
const ATTACK = deepFreeze([{ name: 'triple-seal-ward', pose: 'ward', bob: 0, tilt: 0 }, { name: 'connected-cathedral-page-vault', pose: 'vault', bob: -1, tilt: 0 }, { name: 'body-owned-twin-cover-crush', pose: 'crush', bob: 0, tilt: 0 }, { name: 'crownseal-recover', pose: 'recover', bob: 1, tilt: 0 }]);
const HURT = deepFreeze([{ name: 'white-crown-recoil', pose: 'hurt', bob: -1, tilt: 1, flash: true }, { name: 'colored-triple-seal-brace', pose: 'brace', bob: 1, tilt: -1, flash: false }]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }
function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Crownseal Grimoire geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Crownseal Grimoire pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawCrown(p, center, y) {
  p.rect(center - 4, 4 + y, 9, 2, COLORS.binding[1]);
  p.rect(center - 3, 3 + y, 2, 2, COLORS.gilt[0]);
  p.rect(center, 2 + y, 2, 3, COLORS.gilt[2]);
  p.rect(center + 3, 3 + y, 2, 2, COLORS.gilt[0]);
  p.rect(center - 2, 5 + y, 5, 2, COLORS.binding[0]);
}

function drawCrownScript(p, x, y) {
  p.rect(x + 1, y, 1, 5, COLORS.script);
  p.rect(x, y + 1, 3, 3, COLORS.script);
  p.dot(x - 1, y + 2, COLORS.script);
  p.dot(x + 3, y + 2, COLORS.script);
}

function drawFrontVault(p, phase, rear) {
  const y = phase.bob;
  p.rect(1, 7 + y, 10, 12, COLORS.binding[1]);
  p.rect(13, 7 + y, 10, 12, COLORS.binding[1]);
  p.rect(10, 5 + y, 4, 16, COLORS.binding[1]);
  drawCrown(p, 11, y);
  p.rect(2, 8 + y, 8, 9, rear ? COLORS.cover[0] : COLORS.page[0]);
  p.rect(14, 8 + y, 8, 9, rear ? COLORS.cover[0] : COLORS.page[2]);
  p.rect(3, 7 + y, 7, 2, rear ? COLORS.cover[2] : COLORS.page[2]);
  p.rect(14, 7 + y, 7, 2, rear ? COLORS.cover[2] : COLORS.page[0]);
  p.rect(2, 17 + y, 8, 2, COLORS.cover[0]);
  p.rect(14, 17 + y, 8, 2, COLORS.cover[0]);
  p.rect(10, 6 + y, 4, 14, COLORS.gilt[1]);
  p.rect(11, 6 + y, 2, 14, COLORS.binding[2]);
  p.rect(4, 10 + y, 5, 1, COLORS.page[1]);
  p.rect(4, 14 + y, 5, 1, COLORS.page[1]);
  p.rect(15, 10 + y, 5, 1, COLORS.page[1]);
  p.rect(15, 14 + y, 5, 1, COLORS.page[1]);
  p.rect(1, 10 + y, 2, 5, COLORS.seal[0]);
  p.rect(21, 10 + y, 2, 5, COLORS.seal[2]);
  if (rear) {
    p.rect(4, 10 + y, 4, 5, COLORS.binding[0]);
    p.rect(16, 10 + y, 4, 5, COLORS.binding[0]);
  } else {
    p.rect(16, 9 + y, 5, 7, COLORS.cavity[1]);
    drawCrownScript(p, 17, 10 + y);
  }
}

function drawFrontCrush(p, phase, rear) {
  const y = phase.bob;
  p.rect(2, 8 + y, 20, 10, COLORS.binding[1]);
  p.rect(4, 6 + y, 16, 14, COLORS.binding[1]);
  drawCrown(p, 11, y);
  p.rect(3, 9 + y, 8, 8, COLORS.cover[0]);
  p.rect(13, 9 + y, 8, 8, COLORS.cover[0]);
  p.rect(5, 7 + y, 6, 11, rear ? COLORS.cover[1] : COLORS.cover[2]);
  p.rect(13, 7 + y, 6, 11, rear ? COLORS.cover[1] : COLORS.cover[2]);
  p.rect(10, 7 + y, 4, 12, COLORS.gilt[1]);
  p.rect(11, 7 + y, 2, 12, COLORS.binding[2]);
  p.rect(2, 11 + y, 3, 4, COLORS.seal[0]);
  p.rect(19, 11 + y, 3, 4, COLORS.seal[2]);
  p.rect(6, 17 + y, 12, 3, COLORS.page[0]);
  if (rear) p.rect(8, 10 + y, 8, 5, COLORS.binding[0]);
  else {
    p.rect(14, 9 + y, 5, 7, COLORS.cavity[1]);
    drawCrownScript(p, 15, 10 + y);
  }
}

function drawFront(p, phase, rear) {
  if (phase.pose === 'vault') return drawFrontVault(p, phase, rear);
  if (phase.pose === 'crush') return drawFrontCrush(p, phase, rear);
  const y = phase.bob;
  const shift = phase.tilt < 0 ? -1 : phase.tilt > 0 ? 1 : 0;
  const ward = phase.pose === 'ward' ? 1 : 0;
  const x = 4 + shift - ward;
  const width = 16 + (ward * 2);
  const center = x + Math.floor(width / 2) - 1;
  drawCrown(p, center, y);
  p.rect(x + 1, 5 + y, width - 2, 2, COLORS.binding[1]);
  p.rect(x, 6 + y, width, 13, COLORS.binding[1]);
  p.rect(x + 2, 19 + y, width - 4, 2, COLORS.binding[1]);
  p.rect(x + 1, 7 + y, width - 2, 11, COLORS.cover[0]);
  p.rect(x + 2, 8 + y, width - 4, 9, rear ? COLORS.cover[1] : COLORS.cover[2]);
  p.rect(x + 2, 17 + y, width - 4, 3, COLORS.page[0]);
  p.rect(x + 3, 18 + y, width - 6, 1, COLORS.page[2]);
  p.rect(x + 1, 8 + y, 2, 8, COLORS.seal[0]);
  p.rect(x + width - 3, 8 + y, 2, 8, COLORS.seal[2]);
  p.rect(center - 2, 7 + y, 5, 10, COLORS.cavity[1]);
  p.rect(center - 1, 7 + y, 3, 2, COLORS.gilt[0]);
  if (rear) p.rect(center - 1, 10 + y, 3, 5, COLORS.binding[0]);
  else drawCrownScript(p, center - 1, 10 + y);
  if (phase.pose === 'thrum' || phase.pose === 'recover') {
    p.rect(x + 4, 5 + y, width - 8, 3, COLORS.page[2]);
    p.rect(x + 2, 16 + y, width - 4, 2, COLORS.gilt[1]);
  }
  if (phase.pose === 'brace') p.rect(x + 3, 16 + y, width - 6, 4, COLORS.seal[1]);
}

function drawSideVault(p, phase) {
  const y = phase.bob;
  p.rect(1, 8 + y, 22, 11, COLORS.binding[1]);
  p.rect(8, 6 + y, 7, 14, COLORS.binding[1]);
  drawCrown(p, 11, y);
  p.rect(3, 9 + y, 8, 8, COLORS.page[0]);
  p.rect(11, 8 + y, 10, 9, COLORS.page[2]);
  p.rect(4, 17 + y, 17, 2, COLORS.cover[0]);
  p.rect(9, 7 + y, 4, 12, COLORS.gilt[1]);
  p.rect(10, 7 + y, 2, 12, COLORS.binding[2]);
  p.rect(3, 12 + y, 6, 1, COLORS.page[1]);
  p.rect(14, 11 + y, 5, 1, COLORS.page[1]);
  p.rect(18, 9 + y, 4, 7, COLORS.cavity[1]);
  p.rect(19, 9 + y, 3, 2, COLORS.seal[2]);
  drawCrownScript(p, 19, 11 + y);
}

function drawSideCrush(p, phase) {
  const y = phase.bob;
  p.rect(2, 9 + y, 20, 9, COLORS.binding[1]);
  p.rect(6, 7 + y, 12, 13, COLORS.binding[1]);
  drawCrown(p, 11, y);
  p.rect(3, 10 + y, 8, 7, COLORS.cover[0]);
  p.rect(11, 8 + y, 10, 9, COLORS.cover[2]);
  p.rect(7, 8 + y, 5, 11, COLORS.gilt[1]);
  p.rect(8, 8 + y, 3, 11, COLORS.binding[2]);
  p.rect(5, 17 + y, 14, 3, COLORS.page[0]);
  p.rect(2, 12 + y, 4, 4, COLORS.seal[0]);
  p.rect(18, 10 + y, 4, 7, COLORS.cavity[1]);
  drawCrownScript(p, 19, 11 + y);
}

function drawSide(p, phase) {
  if (phase.pose === 'vault') return drawSideVault(p, phase);
  if (phase.pose === 'crush') return drawSideCrush(p, phase);
  const y = phase.bob;
  const shift = phase.tilt < 0 ? -1 : phase.tilt > 0 ? 1 : 0;
  const ward = phase.pose === 'ward' ? 1 : 0;
  const x = 5 + shift - ward;
  const width = 14 + (ward * 2);
  const center = x + Math.floor(width / 2) - 1;
  drawCrown(p, center, y);
  p.rect(x + 1, 5 + y, width - 2, 2, COLORS.binding[1]);
  p.rect(x, 6 + y, width, 14, COLORS.binding[1]);
  p.rect(x + 2, 20 + y, width - 4, 1, COLORS.binding[1]);
  p.rect(x + 1, 7 + y, width - 2, 12, COLORS.page[0]);
  p.rect(x + 2, 8 + y, width - 4, 10, COLORS.page[2]);
  p.rect(x + 1, 8 + y, 3, 9, COLORS.gilt[1]);
  p.rect(x + 2, 9 + y, 2, 7, COLORS.binding[2]);
  p.rect(x + width - 5, 8 + y, 4, 9, COLORS.cover[0]);
  p.rect(x + width - 5, 9 + y, 4, 7, COLORS.cavity[1]);
  p.rect(x + width - 5, 8 + y, 4, 2, COLORS.seal[2]);
  drawCrownScript(p, x + width - 4, 11 + y);
  p.rect(x + 4, 18 + y, width - 6, 2, COLORS.cover[0]);
  if (phase.pose === 'thrum' || phase.pose === 'recover') {
    p.rect(x + 4, 5 + y, width - 7, 3, COLORS.page[2]);
    p.rect(x + 4, 17 + y, width - 6, 2, COLORS.gilt[0]);
  }
  if (phase.pose === 'brace') p.rect(x + 3, 16 + y, width - 5, 4, COLORS.seal[1]);
}

function mirrorPixels(pixels) {
  const result = createPixels();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  return result;
}
function phaseFor(animation, frame) {
  const source = animation === 'idle' ? IDLE : animation === 'walk' ? WALK : (animation === 'attack' || animation === 'cast') ? ATTACK : animation === 'hurt' ? HURT : animation === 'death' ? HURT : null;
  if (!source) throw new TypeError('Animation ' + animation + ' is not implemented for Crownseal Grimoire.');
  const actual = animation === 'death' ? EN_E09_CROWNSEAL_GRIMOIRE_DEATH_SOURCE_FRAMES[frame] : frame;
  assert(Number.isInteger(actual) && actual >= 0 && actual < source.length, 'Frame ' + frame + ' is invalid for ' + animation + '.');
  return source[actual];
}
function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'left' ? 'right' : direction;
  const pixels = createPixels(); const p = painter(pixels);
  if (canonical === 'down') drawFront(p, phase, false);
  else if (canonical === 'up') drawFront(p, phase, true);
  else if (canonical === 'right') drawSide(p, phase);
  else throw new TypeError('Unsupported Crownseal Grimoire direction ' + direction + '.');
  let rendered = direction === 'left' ? mirrorPixels(pixels) : pixels;
  if (phase.flash) rendered = rendered.map((color) => color ? COLORS.flash : null);
  return { phase, pixels: rendered };
}
function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x]; if (!color) continue;
    context.fillStyle = color; context.fillRect(x, y, 1, 1);
  }
}

export function renderEnE09CrownsealGrimoireFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Crownseal Grimoire rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Crownseal Grimoire direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame); paintPixels(context, pixels);
  return Object.freeze({ family: 'living-book', variant: 'crownseal-grimoire', direction, animation, frame, phase: phase.name,
    crownsealGrimoireGate: EN_E09_CROWNSEAL_GRIMOIRE_GATE.id, approvedPrecedingGate: EN_E09_STARLOCK_LEXICON_GATE.id,
    actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected, childAssetCount: 0,
    alphaPolicy: EN_E09_CROWNSEAL_GRIMOIRE_DATA.alphaPolicy, effectBoundary: EN_E09_CROWNSEAL_GRIMOIRE_DATA.effectBoundary });
}

export const EN_E09_CROWNSEAL_GRIMOIRE_RENDERER = deepFreeze({
  key: 'en-e09-living-book-crownseal-grimoire-v1', chassis: EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-book' && variant.id === 'crownseal-grimoire', 'Crownseal Grimoire renderer is restricted to its private candidate.');
    return renderEnE09CrownsealGrimoireFrame(context, direction, animation.id, frame);
  },
});
const VARIANT = deepFreeze({ id: 'crownseal-grimoire', name: 'Crownseal Grimoire', role: 'elite', status: EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT.state,
  brief: 'A private complete elite Living Book using one baked 24x24 actor: royal-violet cover mass, gilt crown-spine, tiered ivory pages, crimson triple seals, turquoise crown script, connected cathedral vault, and body-owned twin-cover crush; loose pages, script flare, child assets, projectiles, impacts, and effects remain external.', rendererData: EN_E09_CROWNSEAL_GRIMOIRE_DATA });
export const EN_E09_CROWNSEAL_GRIMOIRE_FAMILY = deepFreeze({
  id: 'living-book', name: 'Living Book Crownseal Grimoire Review', sliceId: 'EN-E09', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT.chassis, rendererKey: EN_E09_CROWNSEAL_GRIMOIRE_RENDERER.key,
  variants: [VARIANT], rendererData: { contractCard: EN_E09_CROWNSEAL_GRIMOIRE_CONTRACT_CARD.id, architectureDecision: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.id, approvedPrecedingGate: EN_E09_STARLOCK_LEXICON_GATE.id, activeGate: EN_E09_CROWNSEAL_GRIMOIRE_GATE.id },
  review: { baselineVariant: 'crownseal-grimoire', scale: 8, notes: 'Awaiting visual review as one connected baked elite Living Book. Keep registration, fixtures, loose pages, child assets, effects, later families, release, accepted drift, and a pull request separate.' },
});
export const EN_E09_CROWNSEAL_GRIMOIRE_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E09_CROWNSEAL_GRIMOIRE_RENDERER], families: [EN_E09_CROWNSEAL_GRIMOIRE_FAMILY] });
