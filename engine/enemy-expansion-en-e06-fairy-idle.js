import { GOLD, SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E05_CONSUMER_INTEGRATION_GATE } from './enemy-expansion-en-e05.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

function contractCard({ id, anatomy, intendedScale, locomotion, attackTell, variants, externalEffects }) {
  return {
    id,
    sliceId: 'EN-E06',
    anatomy,
    intendedScale,
    locomotion,
    attackTell,
    externalEffects,
    roleOrder: ['common', 'specialist', 'elite'],
    variants,
  };
}

export const EN_E06_CONTRACT_CARDS = deepFreeze([
  contractCard({
    id: 'fairy',
    anatomy: 'small-winged-fey-humanoid',
    intendedScale: 'A compact 14-16 px body with readable pointed ears and connected leaf-veined wings inside the standard 24x24 Enemy cell.',
    locomotion: 'A body-and-wing hover cycle with no ground contact; wings are permanent body parts rather than detached effects.',
    attackTell: 'The body draws back while the wing pair closes, then the leading hand and needle-sized body weapon line drive forward. Trails and impact light remain external.',
    externalEffects: ['glow', 'pollen', 'sparkles', 'wing trails', 'needle trails', 'impact light'],
    variants: [
      {
        id: 'bramblewing-scout', name: 'Bramblewing Scout', role: 'common', status: 'implemented-full-approved',
        brief: 'A compact woodland scout with plum hair, leaf-green dress, pointed ears, pale veined wings, and a steady alert hover.',
      },
      {
        id: 'thistle-hexer', name: 'Thistle Hexer', role: 'specialist', status: 'implemented-full-approved',
        brief: 'A thorn-crowned curse specialist with folded thistle wings; curse motes and pollen remain external.',
      },
      {
        id: 'petalcrown-duelist', name: 'Petalcrown Duelist', role: 'elite', status: 'implemented-full-approved',
        brief: 'A petal-armored aerial duelist with a wider crown-wing silhouette; dash trails and impact flashes remain external.',
      },
    ],
  }),
  contractCard({
    id: 'hag',
    anatomy: 'stooped-feral-fey-humanoid',
    intendedScale: 'A hunched standard Enemy whose hooked profile, long forearms, and crooked back stay distinct from the equipped humanoid Witch.',
    locomotion: 'A grounded crooked shuffle with uneven shoulder timing and planted clawed feet.',
    attackTell: 'The long leading arm coils toward the chest before a broad hooked rake; thrown charms and hex bursts remain external.',
    externalEffects: ['hex bursts', 'thrown charms', 'cauldron fumes', 'summoned familiars'],
    variants: [
      { id: 'mire-crone', name: 'Mire Crone', role: 'common', status: 'implemented-full-approved', brief: 'Feral bog Hag with rope hair, hooked nose, long claws, and a mud-dark shawl.' },
      { id: 'cauldron-hexer', name: 'Cauldron Hexer', role: 'specialist', status: 'implemented-full-approved', brief: 'Charm-brewing Hag with a ladle-like hand tool; fumes and thrown brews remain external.' },
      { id: 'blackthorn-matron', name: 'Blackthorn Matron', role: 'elite', status: 'implemented-full-approved', brief: 'Briar-armored elder Hag with a crown of hooked blackthorn and a heavier raking silhouette.' },
    ],
  }),
  contractCard({
    id: 'dryad',
    anatomy: 'humanoid-fey-with-living-wood-limbs',
    intendedScale: 'A slim upright fey at ordinary humanoid scale, never a reduced Treant or a trunk-shaped large creature.',
    locomotion: 'A rooted-looking but mobile stride led by flexible branch arms and leaf-weighted shoulders.',
    attackTell: 'One branch arm draws back and visibly forks before a sweeping lash; vines, spores, and roots remain external.',
    externalEffects: ['vines', 'spores', 'root eruptions', 'leaf trails', 'summoned plants'],
    variants: [
      { id: 'grove-tender', name: 'Grove Tender', role: 'common', status: 'implemented-full-candidate', brief: 'Young bark-limbed Dryad with a leaf mantle and narrow humanoid trunk line.' },
      { id: 'spore-cantor', name: 'Spore Cantor', role: 'specialist', status: 'planned', brief: 'Fungal-crowned Dryad whose spore clouds remain separate effects.' },
      { id: 'heartwood-warden', name: 'Heartwood Warden', role: 'elite', status: 'planned', brief: 'Dense heartwood guardian with branch pauldrons while retaining fey rather than Treant scale.' },
    ],
  }),
  contractCard({
    id: 'redcap',
    anatomy: 'small-stocky-goblin-fey',
    intendedScale: 'A short, broad, ground-bound fey with an oversized cap, heavy boots, and a low center of mass.',
    locomotion: 'A quick stomping run whose cap and shoulders lag behind the planted iron-boot rhythm.',
    attackTell: 'The weapon shoulder drops low before an upward cleave or hooked swing; blood spray and ground chips remain external.',
    externalEffects: ['blood spray', 'ground chips', 'weapon trails', 'trap markers'],
    variants: [
      { id: 'barrow-stalker', name: 'Barrow Stalker', role: 'common', status: 'planned', brief: 'Low red-capped ambusher with iron-dark boots and a hooked hand weapon.' },
      { id: 'ironboot-trapper', name: 'Ironboot Trapper', role: 'specialist', status: 'planned', brief: 'Heavy-footed trapper whose snares and trap markers remain external assets.' },
      { id: 'bloodcap-reaver', name: 'Bloodcap Reaver', role: 'elite', status: 'planned', brief: 'Broad-shouldered Redcap raider with a torn crimson cap and heavier cleaving read.' },
    ],
  }),
  contractCard({
    id: 'nymph',
    anatomy: 'graceful-element-touched-fey-humanoid',
    intendedScale: 'A slender character silhouette at humanoid/fey scale, never an embodied Elemental mass.',
    locomotion: 'A light grounded glide with flowing hair and garment rhythms while the base actor remains self-contained.',
    attackTell: 'Both hands gather close to the torso before a clear outward release pose; water, mist, and elemental arcs remain external.',
    externalEffects: ['water arcs', 'mist', 'petals', 'elemental flares', 'ground ripples'],
    variants: [
      { id: 'spring-dancer', name: 'Spring Dancer', role: 'common', status: 'planned', brief: 'Clear humanoid Nymph with flowing hair, ribbon-like dress edges, and a light spring identity.' },
      { id: 'mist-weaver', name: 'Mist Weaver', role: 'specialist', status: 'planned', brief: 'Veiled Nymph caster whose mist layers remain external effects.' },
      { id: 'rivercrown-muse', name: 'Rivercrown Muse', role: 'elite', status: 'planned', brief: 'Regal river Nymph with a broad flowing crown and self-contained character silhouette.' },
    ],
  }),
]);

export const EN_E06_FAIRY_CONTRACT_CARD = EN_E06_CONTRACT_CARDS[0];
export const EN_E06_HAG_CONTRACT_CARD = EN_E06_CONTRACT_CARDS[1];
export const EN_E06_DRYAD_CONTRACT_CARD = EN_E06_CONTRACT_CARDS[2];

export const EN_E06_FAIRY_IDLE_GATE = deepFreeze({
  id: 'en-e06-fairy-bramblewing-scout-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After the clean EN-E05 documentation handoff named Wave 2 as a separate closed choice, the designer said: very good. wave 2. The live plan starts Wave 2 with EN-E06, lists Fairy and Hag as priority-first, and requires the baseline Fairy four-direction Idle gate before any later motion or family art.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After the exact four-direction raw/no-outline and Complete B + Form Bramblewing Scout Idle boards and GIFs were presented, the designer replied: very good,. but lately we been doing all animations for 1 sprite each pass. This approves the presented identity and Idle pixels while correcting the continuation cadence to one full sprite per pass.',
  precedingApproval: {
    gateId: EN_E05_CONSUMER_INTEGRATION_GATE.id,
    consumerFrameDigest: EN_E05_CONSUMER_INTEGRATION_GATE.consumerFrameDigest,
    publishedCheckpoint: '773cfad1c550db8e5b43cc9360e55fe03ddc0ae2',
    publishedHandoff: '7ffbb0464f766f7ed29d64cd59f3613a3cfd1834',
    documentationAudit: '4ba29e2a3fbe9ec584107994c0a324364d8f9240',
    documentationHandoff: '4b2f49dfb80c3c39b6e49672a2c594746f6c030a',
  },
  artifact: 'enemy-expansion-review/en-e06-fairy-idle/en-e06-fairy-bramblewing-scout-idle-raw.png',
  artifactSha256: '1b90e95fe2ff0db982a491cf8cccdd2eec2fbc702b1a72f2fb396162915ce56f',
  assembledArtifact: 'enemy-expansion-review/en-e06-fairy-idle/en-e06-fairy-bramblewing-scout-idle-complete-b-form.png',
  assembledArtifactSha256: 'c7e563a36433ad86d71d10565165563f3137764e8b1e800f017e6a48d097cf70',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-fairy-idle/en-e06-fairy-bramblewing-scout-idle-four-directions-labeled.gif',
      sha256: '010301dad8d68856c8b95267e87d6476d01518f5c41a82019239d7c6bea29350', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-fairy-idle/en-e06-fairy-bramblewing-scout-idle-four-directions-labeled-complete-b-form.gif',
      sha256: '358bc1475a2ebb19d74862480e9d4ee4f47867c0e59d5681998b55b709c2e616', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: '017464b22419f24d2bec6988effe1e36695da0ded04e31d84954eb9941e7893f',
  scope: 'Write all five EN-E06 family contract cards and implement only Bramblewing Scout common Fairy Idle F1-F2 across Down, Left, Right, and Up, reviewed raw and with Complete B + Form.',
  identityContract: 'A compact plum-haired pointed-ear fey hovers above the ground with leaf-green dress planes, paired pale mint open-lattice wings, gold fasteners, and readable front, side, and rear poses. Wings are connected body parts; all glow, pollen, sparkle, trail, and impact-light effects remain external.',
  transparencyPolicy: 'The standard hard-alpha contract remains exact. Wing translucency is represented by connected opaque rim and vein pixels around deliberate transparent negative-space windows; no partial-alpha membrane, glow, or particle pixel is baked into the actor.',
  animationContract: 'A slow two-frame 480 ms hover breath: F2 lowers the compact body by one pixel while the connected wing pair changes angle and the leaf skirt settles. Both frames retain clear ground separation.',
  exclusions: [
    'Fairy Walk',
    'Fairy Attack',
    'Fairy Cast',
    'Fairy Hurt',
    'Fairy Death',
    'Thistle Hexer implementation',
    'Petalcrown Duelist implementation',
    'Hag implementation',
    'Dryad implementation',
    'Redcap implementation',
    'Nymph implementation',
    'baked glow',
    'baked pollen or sparkles',
    'baked trails or impact light',
    'registration',
    'consumer exposure',
    'fixture generation or regeneration',
    'effects',
    'release',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The approved Idle pixels are frozen. The same response authorizes only the remaining Bramblewing Scout Walk, Attack, Cast aliases, Hurt, and Death aliases as one complete private 80-frame candidate. Do not publish, add Fairy variants, begin Hag, register EN-E06, generate fixtures, or advance another sprite without a separate continuation.',
});

export const EN_E06_FAIRY_IDLE_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'light',
    hairStyle: 'short',
    hairColor: 'purple',
    expression: 'focused',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'ranger',
    outfitColor: 'forest',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#e7a2a8', '#a65a72', '#ffd1c8'],
      hair: ['#6a3a79', '#321c45', '#a969a5'],
      outfit: ['#76cdb0', '#3f887d', '#c4f2d6'],
    },
  },
  fairy: {
    skin: ['#e7a2a8', '#a65a72', '#ffd1c8'],
    hair: ['#6a3a79', '#321c45', '#a969a5'],
    leaf: ['#76cdb0', '#3f887d', '#c4f2d6'],
    wing: ['#76cdb0', '#3f887d', '#c4f2d6'],
    gold: GOLD,
    eye: ['#f7dc85', '#321c45'],
  },
  alphaPolicy: 'binary-open-lattice-negative-space',
  effectBoundary: 'external-glow-pollen-sparkles-trails-and-impact-light',
  bakedEffects: [],
});

const BRAMBLEWING_SCOUT_VARIANT = deepFreeze({
  id: 'bramblewing-scout',
  name: 'Bramblewing Scout',
  brief: 'Common compact Fairy scout with pointed ears, leaf dress, and connected open-lattice wings; the two-frame Idle hover baseline is approved and frozen while all glow or trail effects remain external.',
  rendererData: EN_E06_FAIRY_IDLE_DATA,
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Fairy rectangles must use positive integer geometry.',
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
    pairRect(x, y, width, height, fill) {
      rect(x, y, width, height, fill);
      rect(SIZE - x - width, y, width, height, fill);
    },
    pairDot(x, y, fill) {
      rect(x, y, 1, 1, fill);
      rect(SIZE - x - 1, y, 1, 1, fill);
    },
  };
}

function drawPairedWings(paint, phase, rearView) {
  const { wing } = EN_E06_FAIRY_IDLE_DATA.fairy;
  const y = phase;
  const rim = rearView ? wing[0] : wing[1];
  const membrane = rearView ? wing[2] : wing[0];
  const glint = wing[2];

  if (phase === 0) {
    paint.pairRect(6, 5 + y, 2, 1, glint);
    paint.pairRect(5, 6 + y, 4, 1, rim);
    paint.pairRect(4, 7 + y, 2, 1, rim);
    paint.pairDot(8, 7 + y, membrane);
    paint.pairDot(4, 8 + y, rim);
    paint.pairRect(7, 8 + y, 2, 1, glint);
    paint.pairRect(4, 9 + y, 2, 1, rim);
    paint.pairDot(8, 9 + y, glint);
    paint.pairRect(5, 10 + y, 4, 1, membrane);
    paint.pairRect(7, 11 + y, 2, 1, rim);
    paint.pairRect(6, 12 + y, 3, 1, membrane);
    paint.pairRect(5, 13 + y, 2, 1, rim);
    paint.pairDot(8, 13 + y, membrane);
    paint.pairDot(5, 14 + y, rim);
    paint.pairDot(8, 14 + y, membrane);
    paint.pairRect(5, 15 + y, 2, 1, rim);
    paint.pairDot(8, 15 + y, glint);
    paint.pairRect(6, 16 + y, 3, 1, membrane);
  } else {
    paint.pairRect(7, 6 + y, 2, 1, rim);
    paint.pairRect(6, 7 + y, 3, 1, membrane);
    paint.pairRect(5, 8 + y, 2, 1, rim);
    paint.pairDot(8, 8 + y, membrane);
    paint.pairRect(4, 9 + y, 2, 1, rim);
    paint.pairDot(8, 9 + y, glint);
    paint.pairRect(4, 10 + y, 2, 1, rim);
    paint.pairRect(7, 10 + y, 2, 1, glint);
    paint.pairRect(5, 11 + y, 4, 1, membrane);
    paint.pairRect(6, 12 + y, 3, 1, rim);
    paint.pairRect(5, 13 + y, 4, 1, membrane);
    paint.pairDot(5, 14 + y, rim);
    paint.pairDot(8, 14 + y, membrane);
    paint.pairRect(5, 15 + y, 2, 1, rim);
    paint.pairDot(8, 15 + y, glint);
    paint.pairRect(6, 16 + y, 3, 1, membrane);
  }
}

function drawFrontBody(paint, phase, rearView) {
  const { skin, hair, leaf, gold, eye } = EN_E06_FAIRY_IDLE_DATA.fairy;
  const y = phase;

  paint.rect(9, 5 + y, 6, 1, hair[1]);
  paint.rect(8, 6 + y, 8, 2, hair[0]);
  paint.pairDot(8, 8 + y, skin[2]);
  if (rearView) {
    paint.rect(9, 7 + y, 6, 4, hair[0]);
    paint.rect(10, 7 + y, 4, 2, hair[2]);
    paint.rect(11, 9 + y, 2, 2, hair[1]);
  } else {
    paint.rect(9, 7 + y, 6, 4, skin[0]);
    paint.rect(9, 7 + y, 6, 1, hair[2]);
    paint.pairDot(10, 8 + y, eye[0]);
    paint.pairDot(10, 9 + y, eye[1]);
    paint.rect(11, 10 + y, 2, 1, skin[1]);
  }
  paint.rect(10, 11 + y, 4, 4, hair[0]);
  paint.pairRect(9, 12 + y, 1, 4, skin[0]);
  paint.pairDot(9, 15 + y, skin[2]);
  paint.rect(11, 11 + y, 2, 1, hair[2]);
  paint.rect(10, 14 + y, 4, 1, gold[1]);
  paint.pairDot(10, 14 + y, gold[2]);
  paint.rect(9, 15 + y, 6, 1, leaf[1]);
  paint.rect(8, 16 + y, 8, 1, leaf[0]);
  paint.rect(9, 17 + y, 6, 1, leaf[2]);
  paint.pairRect(10, 18 + y, 1, 2, skin[1]);
  paint.pairDot(10, 19 + y, hair[1]);
}

function drawSideWings(paint, phase) {
  const { wing } = EN_E06_FAIRY_IDLE_DATA.fairy;
  const y = phase;
  if (phase === 0) {
    paint.rect(6, 5 + y, 3, 1, wing[2]);
    paint.rect(5, 6 + y, 2, 1, wing[1]);
    paint.rect(8, 6 + y, 2, 1, wing[0]);
    paint.rect(4, 7 + y, 2, 1, wing[1]);
    paint.rect(9, 7 + y, 2, 1, wing[0]);
    paint.dot(4, 8 + y, wing[1]);
    paint.rect(7, 8 + y, 3, 1, wing[2]);
    paint.dot(10, 8 + y, wing[0]);
    paint.rect(4, 9 + y, 2, 1, wing[1]);
    paint.dot(10, 9 + y, wing[2]);
    paint.rect(5, 10 + y, 7, 1, wing[0]);
    paint.rect(7, 11 + y, 5, 1, wing[1]);
    paint.rect(6, 12 + y, 2, 1, wing[0]);
    paint.rect(10, 12 + y, 2, 1, wing[1]);
    paint.rect(5, 13 + y, 2, 1, wing[1]);
    paint.dot(11, 13 + y, wing[0]);
    paint.rect(4, 14 + y, 2, 1, wing[1]);
    paint.dot(11, 14 + y, wing[0]);
    paint.rect(4, 15 + y, 2, 1, wing[1]);
    paint.dot(11, 15 + y, wing[2]);
    paint.rect(5, 16 + y, 2, 1, wing[1]);
    paint.rect(10, 16 + y, 2, 1, wing[0]);
    paint.rect(6, 17 + y, 5, 1, wing[2]);
  } else {
    paint.rect(7, 7 + y, 4, 1, wing[2]);
    paint.rect(6, 8 + y, 2, 1, wing[1]);
    paint.rect(10, 8 + y, 2, 1, wing[0]);
    paint.rect(5, 9 + y, 2, 1, wing[1]);
    paint.dot(11, 9 + y, wing[0]);
    paint.rect(4, 10 + y, 2, 1, wing[1]);
    paint.rect(9, 10 + y, 3, 1, wing[2]);
    paint.dot(11, 10 + y, wing[0]);
    paint.rect(4, 11 + y, 2, 1, wing[1]);
    paint.dot(11, 11 + y, wing[2]);
    paint.rect(5, 12 + y, 7, 1, wing[0]);
    paint.rect(7, 13 + y, 5, 1, wing[1]);
    paint.rect(6, 14 + y, 2, 1, wing[0]);
    paint.rect(10, 14 + y, 2, 1, wing[1]);
    paint.rect(5, 15 + y, 2, 1, wing[1]);
    paint.dot(11, 15 + y, wing[0]);
    paint.rect(4, 16 + y, 2, 1, wing[1]);
    paint.dot(11, 16 + y, wing[0]);
    paint.rect(5, 17 + y, 2, 1, wing[1]);
    paint.rect(10, 17 + y, 2, 1, wing[0]);
    paint.rect(6, 18 + y, 5, 1, wing[2]);
  }
}

function drawSideBody(paint, phase) {
  const { skin, hair, leaf, gold, eye } = EN_E06_FAIRY_IDLE_DATA.fairy;
  const y = phase;

  paint.rect(11, 5 + y, 5, 1, hair[1]);
  paint.rect(10, 6 + y, 7, 2, hair[0]);
  paint.rect(12, 7 + y, 6, 4, skin[0]);
  paint.rect(11, 7 + y, 3, 4, hair[0]);
  paint.rect(12, 6 + y, 4, 1, hair[2]);
  paint.dot(18, 8 + y, skin[2]);
  paint.dot(16, 8 + y, eye[0]);
  paint.dot(17, 9 + y, eye[1]);
  paint.rect(11, 11 + y, 5, 4, hair[0]);
  paint.rect(15, 12 + y, 2, 1, skin[0]);
  paint.rect(16, 13 + y, 2, 2, skin[1]);
  paint.dot(18, 14 + y, skin[2]);
  paint.rect(12, 14 + y, 4, 1, gold[1]);
  paint.dot(15, 14 + y, gold[2]);
  paint.rect(10, 15 + y, 7, 1, leaf[1]);
  paint.rect(10, 16 + y, 8, 1, leaf[0]);
  paint.rect(11, 17 + y, 6, 1, leaf[2]);
  paint.rect(12, 18 + y, 1, 2, skin[1]);
  paint.rect(15, 18 + y, 1, 2, skin[0]);
  paint.dot(12, 19 + y, hair[1]);
  paint.dot(15, 19 + y, hair[1]);
}

export function drawFairyIdleIdentity(context, direction, phase) {
  assert(phase === 0 || phase === 1, 'Fairy Idle identity phase must be F1 or F2.');
  const paint = createPainter(context, direction);
  if (paint.view === 'right') {
    drawSideWings(paint, phase);
    drawSideBody(paint, phase);
  } else {
    drawPairedWings(paint, phase, paint.view === 'up');
    drawFrontBody(paint, phase, paint.view === 'up');
  }
}

function renderFairyIdle(args) {
  assert(args.family.id === 'fairy', 'The EN-E06 Fairy Idle renderer is restricted to Fairy.');
  assert(args.variant.id === 'bramblewing-scout', 'The EN-E06 Fairy Idle renderer is restricted to Bramblewing Scout.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E06 Fairy gate authorizes only two Idle frames.');
  drawFairyIdleIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    fairyIdleGate: EN_E06_FAIRY_IDLE_GATE.id,
    approvedPrecedingGate: EN_E05_CONSUMER_INTEGRATION_GATE.id,
    anatomy: EN_E06_FAIRY_CONTRACT_CARD.anatomy,
    locomotion: 'ground-clear-connected-wing-hover',
    alphaPolicy: EN_E06_FAIRY_IDLE_DATA.alphaPolicy,
    effectBoundary: EN_E06_FAIRY_IDLE_DATA.effectBoundary,
  });
}

export const EN_E06_FAIRY_IDLE_RENDERER = Object.freeze({
  key: 'en-e06-fairy-idle-v1',
  chassis: 'small-winged-fey-v1',
  render: renderFairyIdle,
});

export const EN_E06_FAIRY_IDLE_FAMILY = deepFreeze({
  id: 'fairy',
  name: 'Fairy',
  sliceId: 'EN-E06',
  rendererKey: EN_E06_FAIRY_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [BRAMBLEWING_SCOUT_VARIANT],
  rendererData: {
    contractCard: EN_E06_FAIRY_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E05_CONSUMER_INTEGRATION_GATE.id,
    activeGate: EN_E06_FAIRY_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'bramblewing-scout',
    scale: 8,
    notes: 'Approved common two-frame Idle hover baseline; internal, non-public, binary-alpha, effect-free, and frozen as the motion-suite predecessor.',
  },
});

export const EN_E06_FAIRY_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_FAIRY_IDLE_RENDERER],
  families: [EN_E06_FAIRY_IDLE_FAMILY],
});
