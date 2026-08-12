import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD } from './enemy-expansion-en-e09-clockwork-automaton-brasscoil-sentry.js';
import { EN_E09_EPOCHFORGE_COLOSSUS_GATE } from './enemy-expansion-en-e09-clockwork-automaton-epochforge-colossus.js';

function assert(condition, message) { if (!condition) throw new TypeError(message); }
function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COLORS = deepFreeze({
  cover: ['#7d3547', '#3b1827', '#b85a66'],
  brass: ['#b6833c', '#684523', '#e0bc68'],
  page: ['#d6c9a1', '#756b58', '#f1e4ba'],
  hinge: ['#50565d', '#23282d', '#90989b'],
  cavity: ['#24202a', '#090a0d'],
  rune: '#7ad6c7',
  flash: '#f4f4f4',
});

export const EN_E09_LIVING_BOOK_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e09-living-book-baked-single-actor-v1',
  status: 'selected',
  selected: 'baked-single-actor',
  selectedOn: '2026-08-12',
  baseCheckpoint: '85b29f76cb77ae85a116cec56eeed5b61ea5a375',
  selectionEvidence: 'After the exact Epochforge Colossus publication tuple was clean and remote verified, the designer replied: lets do next. The recommended Living Book topology was then presented as one deterministic connected 24x24 baked actor with a thick cover, spine hinges, clasp, page block, body-owned page-flex and snap motion, zero child assets, and loose pages plus rune effects kept Effects Off. The designer replied: approved. This selects only that topology and authorizes one private common Claspbound Primer candidate.',
  childAssets: [],
  forbidden: ['schema changes', 'shared renderer changes', 'runtime attachment offsets', 'detached pages', 'rune flare as permanent body pixels', 'projectiles'],
  reopenRule: 'Any loose page, detached bookmark, separate cover, state asset, or runtime attachment requires a new explicit architecture gate.',
});

export const EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD = deepFreeze({
  id: 'en-e09-living-book-v1',
  sliceId: 'EN-E09',
  family: 'living-book',
  familyName: 'Living Book',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'epochforge-colossus', name: 'Epochforge Colossus', role: 'elite',
    identity: 'en-e09-clockwork-publication-base', status: 'approved-published',
  },
  activeVariant: {
    id: 'claspbound-primer', name: 'Claspbound Primer', role: 'common',
    identity: 'hinged-cover-clasp-rune-page-block-primer', status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and a compact readable book silhouette. Keep one thick burgundy cover, connected dark spine, brass hinges and clasp, ivory page block, and a single readable turquoise cover rune. Page flex and the snapping attack remain body-owned. The book must remain one baked actor without a humanoid face, hands, floating pages, detached bookmark, projectiles, rune flare, glow, or child assets.',
  effectBoundary: EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_CLASPBOUND_PRIMER_CONTRACT = deepFreeze({
  sliceId: 'EN-E09', family: 'living-book', variant: 'claspbound-primer', role: 'common',
  identity: 'hinged-cover-clasp-rune-page-block-primer',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-thick-cover-spine-hinges-clasp-page-block-cover-rune-v1',
  silhouette: 'A compact hovering book with a thick cover, connected spine, squared page block, brass hinges and clasp, and one cover rune. Attack opens into a broad connected page spread and snaps back shut. It must read as a living book rather than a handheld player spellbook, Mimic chest, Possessed Mask, Living Weapon, humanoid caster, or detached page effect.',
  visualIdentity: 'Burgundy leather, warm brass hardware, ivory pages, dark iron hinges, and one turquoise geometric rune communicate an animated common grimoire. No eyes, mouth, hands, limbs, cloth body, weapon anatomy, loose pages, aura, glow, projectiles, or detached component is used.',
  effectBoundary: EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_CLASPBOUND_PRIMER_DATA = deepFreeze({
  actor: {
    species: 'baked-living-book', bodyBuild: 'compact-thick-hinged-grimoire',
    skin: 'none', hairStyle: 'none', hairColor: 'none', expression: 'single-readable-cover-rune',
    faceDetail: 'geometric-turquoise-rune-without-face-anatomy', headgear: 'none',
    outfit: 'baked-burgundy-cover-brass-hinges-clasp-ivory-page-block-and-spine',
    outfitColor: 'burgundy-brass-ivory-dark-iron-and-turquoise', outfitTier: 'tier1',
    weapon: 'body-owned-page-snap', weaponTier: 'none', shield: 'none', shieldTier: 'tier1', offhand: 'none',
    palette: { skin: COLORS.page, hair: COLORS.brass, outfit: COLORS.cover },
  },
  claspboundPrimer: COLORS,
  actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-cover-spine-hinges-clasp-page-block-rune-and-connected-page-spread',
  effectBoundary: EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E09_CLASPBOUND_PRIMER_GATE = deepFreeze({
  id: 'en-e09-living-book-claspbound-primer-full-v1',
  status: 'approved',
  baseCheckpoint: '85b29f76cb77ae85a116cec56eeed5b61ea5a375',
  authorizedOn: '2026-08-12',
  authorizationEvidence: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selectionEvidence,
  architectureDecision: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-12',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Epochforge Colossus, Whisperveil Visage, and Crownmaw Greatblade family comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in Aseprite. The designer replied: approved. In context this explicitly approves candidate digest bb00346a7bf5f8157f018b92dfd038373977d8ba9dc372f7affee7e2dc3dedf4 and its five frozen review hashes only. The designer then asked whether all approved sprites should be added to the assembler; that question does not itself authorize registration or fixture changes. Standing permission authorizes bounded publication of this candidate but no broader gate.',
  approvedImplementation: '785c851672d427e7b45459716b70fff5834fa0a5',
  publicationAuthorizedOn: '2026-08-12',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any other unopened gate.',
  publishedImplementation: null, publishedApprovalRecord: null, initialPublishedHandoff: null,
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E09_EPOCHFORGE_COLOSSUS_GATE.id,
    artifactSha256: EN_E09_EPOCHFORGE_COLOSSUS_GATE.artifactSha256,
    assembledArtifactSha256: EN_E09_EPOCHFORGE_COLOSSUS_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E09_EPOCHFORGE_COLOSSUS_GATE.comparisonArtifactSha256,
    candidateFrameDigest: EN_E09_EPOCHFORGE_COLOSSUS_GATE.candidateFrameDigest,
    publishedImplementation: EN_E09_EPOCHFORGE_COLOSSUS_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E09_EPOCHFORGE_COLOSSUS_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E09_EPOCHFORGE_COLOSSUS_GATE.initialPublishedHandoff,
    currentReconciliation: '85b29f76cb77ae85a116cec56eeed5b61ea5a375',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e09-living-book-claspbound-primer/en-e09-living-book-claspbound-primer-full-suite-raw.png',
  artifactSha256: '599371272dcf6fe37c608cf5d54942deebcd5d5ad012214955a362eea922faf6',
  assembledArtifact: 'enemy-expansion-review/en-e09-living-book-claspbound-primer/en-e09-living-book-claspbound-primer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '9640beb5757e955acd1c01f3f2aa25d4cc4620013c3c38105ee10cbc1179f661',
  comparisonArtifact: 'enemy-expansion-review/en-e09-living-book-claspbound-primer/en-e09-living-book-claspbound-primer-family-comparison.png',
  comparisonArtifactSha256: 'a0b9668b23945384eb03ea93790d8b45b8f39834f6e05c7106becd779b401b0a',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e09-living-book-claspbound-primer/en-e09-living-book-claspbound-primer-full-suite-four-directions-labeled.gif', sha256: '286ea0ae857639c2a202ea0568818db46ee50b54adfc5dc15e8f369ea46b2b42', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e09-living-book-claspbound-primer/en-e09-living-book-claspbound-primer-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '5dac6f4fb41daf9208a275864f836aac54026e5ec093090c70cf64b6cb97c020', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: 'bb00346a7bf5f8157f018b92dfd038373977d8ba9dc372f7affee7e2dc3dedf4',
  scope: 'One complete 80-frame Claspbound Primer common Living Book across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle flexes the cover and page block. Walk uses four hovering hinge-led tilts. Attack guards, opens into a connected page spread, performs a body-owned snapping-book strike with no loose-page or rune-flare pixels, and recovers. Hurt uses a complete white recoil and colored bent-spine brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Epochforge Colossus, Whisperveil Visage, and Crownmaw Greatblade family comparisons together.',
  exclusions: ['changes to approved Epochforge Colossus or earlier rendered pixels', 'public Living Book registration', 'public catalog or facade exposure', 'asset-pack fixture or manifest changes', 'schema changes', 'shared renderer changes', 'exporter changes', 'validator changes', 'frame-contract changes', 'deterministic child/state exports', 'runtime attachment offsets', 'loose pages', 'detached bookmark', 'separate covers', 'new Cast pixels', 'new Death pixels', 'humanoid face', 'eyes or mouth', 'hands or limbs', 'handheld weapon or shield', 'aura', 'glow', 'particles', 'projectiles', 'rune flare', 'impacts', 'illumination', 'effects', 'specialist or elite Living Book', 'Runic Idol, Crystal Beast, or later work', 'release', 'accepted drift'],
  nextGate: 'The exact Claspbound Primer packet is visually approved at implementation 785c851672d427e7b45459716b70fff5834fa0a5. Standing publication permission opens only its approval record, branch push, and handoff reconciliation. Separately audit the approved private backlog and propose an exact assembler-integration gate; do not infer registration or fixture authorization from the designer asking whether integration should happen. Effects, child/state assets, later roles/families, release, accepted drift, and a pull request remain closed.',
});

export const EN_E09_CLASPBOUND_PRIMER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);
const IDLE = deepFreeze([{ name: 'cover-breathe', pose: 'closed', bob: 0, tilt: 0 }, { name: 'page-block-flex', pose: 'flex', bob: -1, tilt: 1 }]);
const WALK = deepFreeze([{ name: 'left-hinge-tilt', pose: 'closed', bob: 0, tilt: -1 }, { name: 'hover-rise', pose: 'flex', bob: -2, tilt: 0 }, { name: 'right-hinge-tilt', pose: 'closed', bob: 0, tilt: 1 }, { name: 'hover-settle', pose: 'flex', bob: 1, tilt: 0 }]);
const ATTACK = deepFreeze([{ name: 'clasp-guard', pose: 'guard', bob: 0, tilt: 0 }, { name: 'connected-page-unfurl', pose: 'open', bob: -1, tilt: 0 }, { name: 'body-owned-snapping-book-strike', pose: 'snap', bob: 0, tilt: 0 }, { name: 'primer-recover', pose: 'recover', bob: 1, tilt: 0 }]);
const HURT = deepFreeze([{ name: 'white-binding-recoil', pose: 'hurt', bob: -1, tilt: -1, flash: true }, { name: 'colored-bent-spine-brace', pose: 'brace', bob: 1, tilt: 1, flash: false }]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }
function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Claspbound Primer geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Claspbound Primer pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawFront(p, phase, rear) {
  const y = phase.bob;
  if (phase.pose === 'open') {
    p.rect(2, 7 + y, 20, 11, COLORS.cover[1]);
    p.rect(3, 8 + y, 8, 9, COLORS.page[0]);
    p.rect(13, 8 + y, 8, 9, COLORS.page[2]);
    p.rect(11, 6 + y, 2, 13, COLORS.hinge[1]);
    p.rect(10, 8 + y, 1, 9, COLORS.brass[1]);
    p.rect(13, 8 + y, 1, 9, COLORS.brass[0]);
    p.rect(5, 10 + y, 4, 1, COLORS.page[1]);
    p.rect(15, 10 + y, 4, 1, COLORS.page[1]);
    p.rect(6, 13 + y, 3, 1, COLORS.rune);
    p.rect(15, 13 + y, 3, 1, COLORS.rune);
    return;
  }
  const wide = phase.pose === 'guard' || phase.pose === 'snap' ? 1 : 0;
  const x = 6 - wide;
  const width = 13 + (wide * 2);
  p.rect(x, 4 + y, width, 16, COLORS.cover[1]);
  p.rect(x + 1, 5 + y, width - 2, 14, COLORS.cover[0]);
  p.rect(x + 3, 6 + y, width - 5, 12, COLORS.page[0]);
  p.rect(x + 4, 7 + y, width - 7, 10, rear ? COLORS.cover[1] : COLORS.page[2]);
  p.rect(x, 5 + y, 3, 14, COLORS.hinge[1]);
  p.rect(x + 1, 7 + y, 2, 2, COLORS.brass[0]);
  p.rect(x + 1, 14 + y, 2, 2, COLORS.brass[0]);
  p.rect(x + width - 2, 10 + y, 3, 4, COLORS.brass[1]);
  p.rect(x + width - 1, 11 + y, 2, 2, COLORS.brass[2]);
  if (rear) {
    p.rect(x + 5, 8 + y, width - 9, 7, COLORS.cover[2]);
    p.rect(x + 6, 10 + y, width - 11, 3, COLORS.hinge[0]);
  } else {
    const cx = x + Math.floor(width / 2);
    p.rect(cx - 2, 9 + y, 5, 6, COLORS.cavity[1]);
    p.rect(cx, 10 + y, 1, 4, COLORS.rune);
    p.rect(cx - 1, 11 + y, 3, 2, COLORS.rune);
  }
  if (phase.pose === 'flex' || phase.pose === 'recover') {
    p.rect(x + 4, 4 + y, width - 7, 2, COLORS.page[2]);
  }
}

function drawSide(p, phase) {
  const y = phase.bob;
  if (phase.pose === 'open') {
    p.rect(5, 8 + y, 17, 10, COLORS.cover[1]);
    p.rect(6, 9 + y, 13, 8, COLORS.page[0]);
    p.rect(8, 7 + y, 3, 11, COLORS.hinge[1]);
    p.rect(10, 9 + y, 10, 2, COLORS.page[2]);
    p.rect(18, 10 + y, 4, 5, COLORS.brass[1]);
    p.rect(19, 11 + y, 3, 2, COLORS.brass[2]);
    p.rect(13, 13 + y, 5, 1, COLORS.rune);
    return;
  }
  const x = phase.tilt < 0 ? 7 : 8;
  const wide = phase.pose === 'guard' || phase.pose === 'snap' ? 2 : 0;
  p.rect(x, 5 + y, 10 + wide, 15, COLORS.cover[1]);
  p.rect(x + 2, 6 + y, 8 + wide, 13, COLORS.page[0]);
  p.rect(x + 3, 7 + y, 6 + wide, 11, COLORS.page[2]);
  p.rect(x, 6 + y, 3, 13, COLORS.hinge[1]);
  p.rect(x + 1, 8 + y, 2, 2, COLORS.brass[0]);
  p.rect(x + 1, 14 + y, 2, 2, COLORS.brass[0]);
  p.rect(x + 9 + wide, 10 + y, 3, 4, COLORS.brass[1]);
  p.rect(x + 10 + wide, 11 + y, 2, 2, COLORS.brass[2]);
  p.rect(x + 5, 10 + y, 3 + wide, 4, COLORS.cavity[1]);
  p.rect(x + 7 + wide, 11 + y, 1, 2, COLORS.rune);
  if (phase.pose === 'flex' || phase.pose === 'recover') p.rect(x + 3, 5 + y, 6 + wide, 2, COLORS.page[2]);
}

function mirrorPixels(pixels) {
  const result = createPixels();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  return result;
}
function phaseFor(animation, frame) {
  const source = animation === 'idle' ? IDLE : animation === 'walk' ? WALK : (animation === 'attack' || animation === 'cast') ? ATTACK : animation === 'hurt' ? HURT : animation === 'death' ? HURT : null;
  if (!source) throw new TypeError('Animation ' + animation + ' is not implemented for Claspbound Primer.');
  const actual = animation === 'death' ? EN_E09_CLASPBOUND_PRIMER_DEATH_SOURCE_FRAMES[frame] : frame;
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
  else throw new TypeError('Unsupported Claspbound Primer direction ' + direction + '.');
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

export function renderEnE09ClaspboundPrimerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Claspbound Primer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Claspbound Primer direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame); paintPixels(context, pixels);
  return Object.freeze({ family: 'living-book', variant: 'claspbound-primer', direction, animation, frame, phase: phase.name,
    claspboundPrimerGate: EN_E09_CLASPBOUND_PRIMER_GATE.id, approvedPrecedingGate: EN_E09_EPOCHFORGE_COLOSSUS_GATE.id,
    actorTopology: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected, childAssetCount: 0,
    alphaPolicy: EN_E09_CLASPBOUND_PRIMER_DATA.alphaPolicy, effectBoundary: EN_E09_CLASPBOUND_PRIMER_DATA.effectBoundary });
}

export const EN_E09_CLASPBOUND_PRIMER_RENDERER = deepFreeze({
  key: 'en-e09-living-book-claspbound-primer-v1', chassis: EN_E09_CLASPBOUND_PRIMER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-book' && variant.id === 'claspbound-primer', 'Claspbound Primer renderer is restricted to its private candidate.');
    return renderEnE09ClaspboundPrimerFrame(context, direction, animation.id, frame);
  },
});
const VARIANT = deepFreeze({ id: 'claspbound-primer', name: 'Claspbound Primer', role: 'common', status: EN_E09_CLASPBOUND_PRIMER_CONTRACT.state,
  brief: 'A private complete common Living Book using one baked 24x24 actor: burgundy cover, dark spine, brass hinges and clasp, ivory page block, turquoise rune, connected open spread, and body-owned snap; loose pages, rune flare, child assets, projectiles, and effects remain external.', rendererData: EN_E09_CLASPBOUND_PRIMER_DATA });
export const EN_E09_CLASPBOUND_PRIMER_FAMILY = deepFreeze({
  id: 'living-book', name: 'Living Book Claspbound Primer Review', sliceId: 'EN-E09', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E09_CLASPBOUND_PRIMER_CONTRACT.chassis, rendererKey: EN_E09_CLASPBOUND_PRIMER_RENDERER.key,
  variants: [VARIANT], rendererData: { contractCard: EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD.id, architectureDecision: EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.id, approvedPrecedingGate: EN_E09_EPOCHFORGE_COLOSSUS_GATE.id, activeGate: EN_E09_CLASPBOUND_PRIMER_GATE.id },
  review: { baselineVariant: 'claspbound-primer', scale: 8, notes: 'Awaiting visual review as one connected baked common Living Book. Keep registration, fixtures, loose pages, child assets, effects, later roles/families, release, accepted drift, and a pull request separate.' },
});
export const EN_E09_CLASPBOUND_PRIMER_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E09_CLASPBOUND_PRIMER_RENDERER], families: [EN_E09_CLASPBOUND_PRIMER_FAMILY] });
