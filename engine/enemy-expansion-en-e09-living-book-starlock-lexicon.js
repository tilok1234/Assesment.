import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD,
  EN_E09_CLASPBOUND_PRIMER_GATE,
  EN_E09_LIVING_BOOK_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e09-living-book-claspbound-primer.js';

function assert(condition, message) { if (!condition) throw new TypeError(message); }
function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COLORS = deepFreeze({
  cover: ['#355184', '#17243d', '#6687b5'],
  copper: ['#b66a3f', '#623523', '#e0a269'],
  page: ['#c8d5cf', '#697a75', '#edf1df'],
  binding: ['#56616d', '#202a34', '#98a7a8'],
  cavity: ['#1c2030', '#080b12'],
  sigil: '#f0b94f',
  flash: '#f4f4f4',
});

export const EN_E09_STARLOCK_LEXICON_CONTRACT_CARD = deepFreeze({
  id: 'en-e09-living-book-starlock-lexicon-v1',
  sliceId: 'EN-E09',
  family: 'living-book',
  familyName: 'Living Book',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'claspbound-primer', name: 'Claspbound Primer', role: 'common',
    identity: 'hinged-cover-clasp-rune-page-block-primer', status: 'approved-published',
  },
  activeVariant: {
    id: 'starlock-lexicon', name: 'Starlock Lexicon', role: 'specialist',
    identity: 'star-lock-stepped-index-connected-page-fan-lexicon', status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: ['elite'],
  actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and a taller narrow specialist-book silhouette. Keep one midnight-blue cover, connected iron spine, integrated copper star-lock and corners, pale stepped page index, and one readable amber geometric sigil. The asymmetric page fan and spine-led sweep remain body-owned. The book must remain one baked actor without a humanoid face, hands, loose pages, detached bookmark, projectiles, sigil flare, glow, or child assets.',
  effectBoundary: EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_STARLOCK_LEXICON_CONTRACT = deepFreeze({
  sliceId: 'EN-E09', family: 'living-book', variant: 'starlock-lexicon', role: 'specialist',
  identity: 'star-lock-stepped-index-connected-page-fan-lexicon',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-tall-cover-connected-spine-star-lock-stepped-page-index-asymmetric-page-fan-v1',
  silhouette: 'A tall narrow hovering codex with a raised iron spine, tapered cover ends, stepped page index, integrated star-lock, and a connected asymmetric page fan. Attack opens around the central spine and performs a body-owned horizontal sweep. It must read as a specialist living book rather than the compact Claspbound Primer, handheld spellbook, Mimic chest, Possessed Mask, Living Weapon, humanoid caster, or detached page effect.',
  visualIdentity: 'Midnight-blue leather, dark iron binding, copper corners and star-lock, pale blue-gray pages, and one amber geometric sigil communicate an arcane indexing specialist. No eyes, mouth, hands, limbs, cloth body, weapon anatomy, loose pages, aura, glow, projectiles, or detached component is used.',
  effectBoundary: EN_E09_STARLOCK_LEXICON_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_STARLOCK_LEXICON_DATA = deepFreeze({
  actor: {
    species: 'baked-living-book', bodyBuild: 'tall-narrow-indexed-arcane-codex',
    skin: 'none', hairStyle: 'none', hairColor: 'none', expression: 'single-readable-amber-star-sigil',
    faceDetail: 'geometric-amber-star-lock-without-face-anatomy', headgear: 'none',
    outfit: 'baked-midnight-cover-iron-spine-copper-star-lock-corners-and-stepped-page-index',
    outfitColor: 'midnight-blue-copper-pale-page-dark-iron-and-amber', outfitTier: 'tier2',
    weapon: 'body-owned-page-fan-spine-sweep', weaponTier: 'none', shield: 'none', shieldTier: 'tier1', offhand: 'none',
    palette: { skin: COLORS.page, hair: COLORS.copper, outfit: COLORS.cover },
  },
  starlockLexicon: COLORS,
  actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-cover-spine-star-lock-corners-page-index-sigil-and-connected-page-fan',
  effectBoundary: EN_E09_STARLOCK_LEXICON_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E09_STARLOCK_LEXICON_GATE = deepFreeze({
  id: 'en-e09-living-book-starlock-lexicon-full-v1',
  status: 'implemented-awaiting-visual-approval',
  baseCheckpoint: 'e7729e651044139bda7e4dcf14c3c2690dbd29be',
  authorizedOn: '2026-08-12',
  authorizationEvidence: 'After the approved 35-suite integration was completed and its next-chat handoff was read, the assistant recommended opening exactly one isolated Living Book specialist lane under the selected connected 24x24 zero-child topology. The designer replied: lets keep going. This authorizes only one private Starlock Lexicon 80-frame art candidate. Registration, fixtures, effects, child assets, the elite role, later families, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.id,
  approvedOn: null, approvalEvidence: null, approvedImplementation: null,
  publicationAuthorizedOn: '2026-08-12',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any other unopened gate.',
  publishedImplementation: null, publishedApprovalRecord: null, initialPublishedHandoff: null,
  publicationState: 'not-approved',
  precedingApproval: {
    gateId: EN_E09_CLASPBOUND_PRIMER_GATE.id,
    artifactSha256: EN_E09_CLASPBOUND_PRIMER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E09_CLASPBOUND_PRIMER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E09_CLASPBOUND_PRIMER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E09_CLASPBOUND_PRIMER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E09_CLASPBOUND_PRIMER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E09_CLASPBOUND_PRIMER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E09_CLASPBOUND_PRIMER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E09_CLASPBOUND_PRIMER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E09_CLASPBOUND_PRIMER_GATE.initialPublishedHandoff,
    currentReconciliation: '641d741f5e135a734fec5c0410b4a27ce87a136a',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e09-living-book-starlock-lexicon/en-e09-living-book-starlock-lexicon-full-suite-raw.png',
  artifactSha256: 'c3f5028aeaade2055f19068dfaf98615d41b8fde21863c98180f04e1167ce562',
  assembledArtifact: 'enemy-expansion-review/en-e09-living-book-starlock-lexicon/en-e09-living-book-starlock-lexicon-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'a499b0446b5d222df11e6f74da9126432a6cd1264111ffcf7fe71e19336cba70',
  comparisonArtifact: 'enemy-expansion-review/en-e09-living-book-starlock-lexicon/en-e09-living-book-starlock-lexicon-family-comparison.png',
  comparisonArtifactSha256: '5282fd2d1a1d523e6ff243689fb2b054f8b26979aef720bab9b564122a4daefe',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e09-living-book-starlock-lexicon/en-e09-living-book-starlock-lexicon-full-suite-four-directions-labeled.gif', sha256: 'b6e323cc6267113caebdc8ce309799e07b4be9df47ba39544bd2a0853cf99951', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e09-living-book-starlock-lexicon/en-e09-living-book-starlock-lexicon-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '3c614f28b8bc16bbfe4ae53da13426ecc9cc3cf96e7c629acf612f51c70e6e6c', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: '3cd86b946115179fc566160e5045eccfda4fd5ce61ce44eae269634b07f3e92c',
  scope: 'One complete 80-frame Starlock Lexicon specialist Living Book across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle indexes the connected page block and star-lock. Walk uses four tall hinge-led hover tilts. Attack braces, opens into one connected asymmetric page fan, performs a body-owned spine-led sweep with no loose-page or sigil-flare pixels, and recovers. Hurt uses a complete white recoil and colored iron-spine brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Claspbound Primer, Aetherdial Surveyor, and Mournseal Cantor family comparisons together.',
  exclusions: ['changes to approved Claspbound Primer or earlier rendered pixels', 'public Living Book registration', 'public catalog or facade exposure', 'asset-pack fixture or manifest changes', 'schema changes', 'shared renderer changes', 'exporter changes', 'validator changes', 'frame-contract changes', 'deterministic child/state exports', 'runtime attachment offsets', 'loose pages', 'detached bookmark', 'separate covers', 'new Cast pixels', 'new Death pixels', 'humanoid face', 'eyes or mouth', 'hands or limbs', 'handheld weapon or shield', 'aura', 'glow', 'particles', 'projectiles', 'sigil flare', 'impacts', 'illumination', 'effects', 'elite Living Book', 'Runic Idol, Crystal Beast, or later work', 'release', 'accepted drift'],
  nextGate: 'Stop for explicit designer visual approval of the exact frozen Starlock Lexicon review artifacts and candidate digest. Do not publish, register, add fixtures, add child/state assets, add effects, begin the elite role or later families, release, accept drift, or open a pull request.',
});

export const EN_E09_STARLOCK_LEXICON_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);
const IDLE = deepFreeze([{ name: 'star-lock-breathe', pose: 'sealed', bob: 0, tilt: 0 }, { name: 'connected-page-index', pose: 'index', bob: -1, tilt: 1 }]);
const WALK = deepFreeze([{ name: 'left-index-tilt', pose: 'sealed', bob: 0, tilt: -1 }, { name: 'lexicon-rise', pose: 'index', bob: -2, tilt: 0 }, { name: 'right-index-tilt', pose: 'sealed', bob: 0, tilt: 1 }, { name: 'lexicon-settle', pose: 'index', bob: 1, tilt: 0 }]);
const ATTACK = deepFreeze([{ name: 'star-lock-ward', pose: 'ward', bob: 0, tilt: 0 }, { name: 'connected-asymmetric-page-fan', pose: 'fan', bob: -1, tilt: 0 }, { name: 'body-owned-spine-led-sweep', pose: 'sweep', bob: 0, tilt: 0 }, { name: 'lexicon-recover', pose: 'recover', bob: 1, tilt: 0 }]);
const HURT = deepFreeze([{ name: 'white-index-recoil', pose: 'hurt', bob: -1, tilt: 1, flash: true }, { name: 'colored-iron-spine-brace', pose: 'brace', bob: 1, tilt: -1, flash: false }]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }
function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Starlock Lexicon geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Starlock Lexicon pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawStar(p, x, y) {
  p.rect(x + 1, y, 1, 5, COLORS.sigil);
  p.rect(x, y + 1, 3, 3, COLORS.sigil);
  p.dot(x - 1, y + 2, COLORS.sigil);
  p.dot(x + 3, y + 2, COLORS.sigil);
}

function drawFrontFan(p, phase, rear) {
  const y = phase.bob;
  p.rect(2, 7 + y, 9, 12, COLORS.binding[1]);
  p.rect(3, 5 + y, 8, 2, COLORS.binding[1]);
  p.rect(1, 10 + y, 2, 6, COLORS.binding[1]);
  p.rect(13, 6 + y, 8, 13, COLORS.binding[1]);
  p.rect(14, 4 + y, 7, 2, COLORS.binding[1]);
  p.rect(21, 9 + y, 2, 7, COLORS.binding[1]);
  p.rect(10, 4 + y, 4, 17, COLORS.binding[1]);
  p.rect(3, 7 + y, 7, 10, rear ? COLORS.cover[0] : COLORS.page[0]);
  p.rect(4, 6 + y, 6, 2, rear ? COLORS.cover[2] : COLORS.page[2]);
  p.rect(14, 6 + y, 7, 11, rear ? COLORS.cover[0] : COLORS.page[2]);
  p.rect(15, 5 + y, 6, 2, rear ? COLORS.cover[2] : COLORS.page[0]);
  p.rect(10, 5 + y, 4, 15, COLORS.copper[1]);
  p.rect(11, 5 + y, 2, 15, COLORS.binding[2]);
  p.rect(4, 9 + y, 5, 1, COLORS.page[1]);
  p.rect(5, 13 + y, 4, 1, COLORS.page[1]);
  p.rect(15, 9 + y, 5, 1, COLORS.page[1]);
  p.rect(15, 14 + y, 4, 1, COLORS.page[1]);
  p.rect(2, 15 + y, 2, 2, COLORS.copper[0]);
  p.rect(20, 13 + y, 2, 2, COLORS.copper[2]);
  if (rear) {
    p.rect(6, 10 + y, 2, 4, COLORS.binding[0]);
    p.rect(17, 10 + y, 2, 4, COLORS.binding[0]);
  } else {
    p.rect(16, 10 + y, 4, 6, COLORS.cavity[1]);
    drawStar(p, 16, 10 + y);
  }
}

function drawFrontSweep(p, phase, rear) {
  const y = phase.bob;
  p.rect(3, 8 + y, 18, 9, COLORS.binding[1]);
  p.rect(5, 6 + y, 8, 13, COLORS.binding[1]);
  p.rect(4, 9 + y, 7, 7, rear ? COLORS.cover[0] : COLORS.page[0]);
  p.rect(11, 8 + y, 9, 8, COLORS.cover[0]);
  p.rect(12, 9 + y, 7, 6, COLORS.cover[2]);
  p.rect(8, 7 + y, 4, 11, COLORS.copper[1]);
  p.rect(9, 7 + y, 2, 11, COLORS.binding[2]);
  p.rect(3, 11 + y, 2, 3, COLORS.copper[0]);
  p.rect(20, 10 + y, 2, 4, COLORS.copper[2]);
  p.rect(5, 11 + y, 4, 1, COLORS.page[1]);
  if (!rear) {
    p.rect(14, 9 + y, 4, 6, COLORS.cavity[1]);
    drawStar(p, 14, 9 + y);
  } else {
    p.rect(14, 10 + y, 3, 4, COLORS.binding[0]);
  }
}

function drawFront(p, phase, rear) {
  if (phase.pose === 'fan') return drawFrontFan(p, phase, rear);
  if (phase.pose === 'sweep') return drawFrontSweep(p, phase, rear);
  const y = phase.bob;
  const shift = phase.tilt < 0 ? -1 : phase.tilt > 0 ? 1 : 0;
  const wide = phase.pose === 'ward' ? 1 : 0;
  const x = 7 + shift - wide;
  const width = 10 + (wide * 2);
  p.rect(x + 1, 3 + y, width - 2, 2, COLORS.binding[1]);
  p.rect(x, 4 + y, width, 16, COLORS.binding[1]);
  p.rect(x + 1, 20 + y, width - 2, 1, COLORS.binding[1]);
  p.rect(x - 2, 6 + y, 3, 13, COLORS.binding[1]);
  p.rect(x - 1, 7 + y, 2, 3, COLORS.copper[0]);
  p.rect(x - 1, 15 + y, 2, 3, COLORS.copper[0]);
  p.rect(x + 1, 5 + y, width - 3, 14, COLORS.cover[0]);
  p.rect(x + 2, 6 + y, width - 5, 12, rear ? COLORS.cover[1] : COLORS.cover[2]);
  p.rect(x + width - 2, 5 + y, 2, 14, COLORS.page[0]);
  p.rect(x + width - 1, 7 + y, 2, 2, COLORS.page[2]);
  p.rect(x + width - 1, 11 + y, 3, 2, COLORS.copper[2]);
  p.rect(x + width - 1, 15 + y, 2, 2, COLORS.page[2]);
  if (rear) {
    p.rect(x + 3, 8 + y, width - 7, 8, COLORS.binding[0]);
    p.rect(x + 4, 10 + y, width - 9, 4, COLORS.copper[1]);
  } else {
    const cx = x + Math.floor(width / 2);
    p.rect(cx - 2, 8 + y, 5, 8, COLORS.cavity[1]);
    drawStar(p, cx - 1, 9 + y);
  }
  if (phase.pose === 'index' || phase.pose === 'recover') {
    p.rect(x + 3, 3 + y, width - 5, 3, COLORS.page[2]);
    p.rect(x + width - 1, 4 + y, 2, 2, COLORS.copper[0]);
  }
  if (phase.pose === 'brace') p.rect(x + 2, 18 + y, width - 4, 3, COLORS.copper[1]);
}

function drawSideFan(p, phase) {
  const y = phase.bob;
  p.rect(3, 8 + y, 19, 10, COLORS.binding[1]);
  p.rect(5, 6 + y, 7, 13, COLORS.binding[1]);
  p.rect(4, 9 + y, 7, 8, COLORS.page[0]);
  p.rect(11, 8 + y, 10, 8, COLORS.page[2]);
  p.rect(8, 5 + y, 4, 15, COLORS.binding[1]);
  p.rect(9, 6 + y, 2, 13, COLORS.copper[1]);
  p.rect(4, 12 + y, 5, 1, COLORS.page[1]);
  p.rect(13, 11 + y, 6, 1, COLORS.page[1]);
  p.rect(19, 9 + y, 3, 5, COLORS.cover[0]);
  p.rect(19, 10 + y, 3, 4, COLORS.cavity[1]);
  drawStar(p, 19, 10 + y);
}

function drawSideSweep(p, phase) {
  const y = phase.bob;
  p.rect(3, 9 + y, 19, 8, COLORS.binding[1]);
  p.rect(6, 7 + y, 6, 12, COLORS.binding[1]);
  p.rect(4, 10 + y, 8, 6, COLORS.page[0]);
  p.rect(11, 9 + y, 10, 7, COLORS.cover[0]);
  p.rect(12, 10 + y, 8, 5, COLORS.cover[2]);
  p.rect(8, 8 + y, 3, 10, COLORS.copper[1]);
  p.rect(18, 10 + y, 4, 5, COLORS.cavity[1]);
  drawStar(p, 18, 10 + y);
}

function drawSide(p, phase) {
  if (phase.pose === 'fan') return drawSideFan(p, phase);
  if (phase.pose === 'sweep') return drawSideSweep(p, phase);
  const y = phase.bob;
  const shift = phase.tilt < 0 ? -1 : phase.tilt > 0 ? 1 : 0;
  const wide = phase.pose === 'ward' ? 1 : 0;
  const x = 7 + shift - wide;
  p.rect(x + 1, 3 + y, 7 + wide, 2, COLORS.binding[1]);
  p.rect(x, 4 + y, 10 + wide, 17, COLORS.binding[1]);
  p.rect(x - 1, 6 + y, 3, 13, COLORS.binding[1]);
  p.rect(x + 2, 5 + y, 8 + wide, 15, COLORS.page[0]);
  p.rect(x + 3, 6 + y, 6 + wide, 13, COLORS.page[2]);
  p.rect(x, 7 + y, 3, 3, COLORS.copper[0]);
  p.rect(x, 15 + y, 3, 3, COLORS.copper[0]);
  p.rect(x + 8 + wide, 8 + y, 3, 8, COLORS.cover[0]);
  p.rect(x + 8 + wide, 9 + y, 3, 6, COLORS.cavity[1]);
  drawStar(p, x + 8 + wide, 9 + y);
  p.rect(x + 5, 5 + y, 4 + wide, 1, COLORS.page[1]);
  p.rect(x + 5, 18 + y, 4 + wide, 2, COLORS.copper[1]);
  if (phase.pose === 'index' || phase.pose === 'recover') {
    p.rect(x + 4, 3 + y, 5 + wide, 3, COLORS.page[2]);
    p.rect(x + 9 + wide, 5 + y, 2, 2, COLORS.copper[2]);
  }
  if (phase.pose === 'brace') p.rect(x + 3, 17 + y, 7 + wide, 4, COLORS.copper[1]);
}

function mirrorPixels(pixels) {
  const result = createPixels();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  return result;
}
function phaseFor(animation, frame) {
  const source = animation === 'idle' ? IDLE : animation === 'walk' ? WALK : (animation === 'attack' || animation === 'cast') ? ATTACK : animation === 'hurt' ? HURT : animation === 'death' ? HURT : null;
  if (!source) throw new TypeError('Animation ' + animation + ' is not implemented for Starlock Lexicon.');
  const actual = animation === 'death' ? EN_E09_STARLOCK_LEXICON_DEATH_SOURCE_FRAMES[frame] : frame;
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
  else throw new TypeError('Unsupported Starlock Lexicon direction ' + direction + '.');
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

export function renderEnE09StarlockLexiconFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Starlock Lexicon rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Starlock Lexicon direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame); paintPixels(context, pixels);
  return Object.freeze({ family: 'living-book', variant: 'starlock-lexicon', direction, animation, frame, phase: phase.name,
    starlockLexiconGate: EN_E09_STARLOCK_LEXICON_GATE.id, approvedPrecedingGate: EN_E09_CLASPBOUND_PRIMER_GATE.id,
    actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected, childAssetCount: 0,
    alphaPolicy: EN_E09_STARLOCK_LEXICON_DATA.alphaPolicy, effectBoundary: EN_E09_STARLOCK_LEXICON_DATA.effectBoundary });
}

export const EN_E09_STARLOCK_LEXICON_RENDERER = deepFreeze({
  key: 'en-e09-living-book-starlock-lexicon-v1', chassis: EN_E09_STARLOCK_LEXICON_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-book' && variant.id === 'starlock-lexicon', 'Starlock Lexicon renderer is restricted to its private candidate.');
    return renderEnE09StarlockLexiconFrame(context, direction, animation.id, frame);
  },
});
const VARIANT = deepFreeze({ id: 'starlock-lexicon', name: 'Starlock Lexicon', role: 'specialist', status: EN_E09_STARLOCK_LEXICON_CONTRACT.state,
  brief: 'A private complete specialist Living Book using one baked 24x24 actor: midnight cover, iron spine, copper star-lock, stepped page index, amber sigil, connected asymmetric page fan, and body-owned sweep; loose pages, sigil flare, child assets, projectiles, and effects remain external.', rendererData: EN_E09_STARLOCK_LEXICON_DATA });
export const EN_E09_STARLOCK_LEXICON_FAMILY = deepFreeze({
  id: 'living-book', name: 'Living Book Starlock Lexicon Review', sliceId: 'EN-E09', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E09_STARLOCK_LEXICON_CONTRACT.chassis, rendererKey: EN_E09_STARLOCK_LEXICON_RENDERER.key,
  variants: [VARIANT], rendererData: { contractCard: EN_E09_STARLOCK_LEXICON_CONTRACT_CARD.id, architectureDecision: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.id, approvedPrecedingGate: EN_E09_CLASPBOUND_PRIMER_GATE.id, activeGate: EN_E09_STARLOCK_LEXICON_GATE.id },
  review: { baselineVariant: 'starlock-lexicon', scale: 8, notes: 'Awaiting visual review as one connected baked specialist Living Book. Keep registration, fixtures, loose pages, child assets, effects, elite/later families, release, accepted drift, and a pull request separate.' },
});
export const EN_E09_STARLOCK_LEXICON_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E09_STARLOCK_LEXICON_RENDERER], families: [EN_E09_STARLOCK_LEXICON_FAMILY] });
