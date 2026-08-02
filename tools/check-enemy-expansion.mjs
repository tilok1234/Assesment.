import { createHash } from 'node:crypto';
import * as engine from '../sprite-engine.js';

const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function rejects(run, messageFragment, label) {
  try {
    run();
    errors.push(`${label} was not rejected.`);
  } catch (error) {
    check(String(error.message).includes(messageFragment), `${label} returned the wrong error: ${error.message}`);
  }
}

function renderPixels(spec, direction, animationId, frame) {
  const pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    clearRect() { pixels.fill(null); },
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
          pixels[(py * engine.SIZE) + px] = fillStyle;
        }
      }
    },
  };
  engine.drawSprite(context, spec, direction, animationId, frame, { shadow: false });
  return pixels;
}

function legacyPixelDigest() {
  const hash = createHash('sha256');
  let sheets = 0;
  let frames = 0;
  for (const family of engine.ENEMIES) for (const variant of family.variants) {
    hash.update(`sheet:${family.id}/${variant.id}\n`);
    const spec = { kind: 'enemy', family: family.id, variant: variant.id };
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        hash.update(`${direction}:${animation.id}:${frame}:`);
        hash.update(JSON.stringify(renderPixels(spec, direction, animation.id, frame)));
        hash.update('\n');
        frames++;
      }
    }
    sheets++;
  }
  return { families: engine.ENEMIES.length, sheets, frames, digest: hash.digest('hex') };
}

const legacy = legacyPixelDigest();
check(legacy.families === 57, 'the legacy Enemy catalog must remain at 57 families');
check(legacy.sheets === 202, 'the legacy Enemy catalog must remain at 202 variant sheets');
check(legacy.frames === 16160, 'the legacy Enemy corpus must remain at 16,160 public frames');
check(
  legacy.digest === engine.ENEMY_EXPANSION_PROFILE.legacyBaseline.pixelDigest,
  `the legacy Enemy corpus digest changed: ${legacy.digest}`,
);
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 0, 'EN-F00 must not pre-register unfinished expansion families');
check(engine.ENEMY_EXPANSION_REGISTRY.publicFamilies.length === 0, 'EN-F00 must not expose expansion families to public selectors or packs');
check(Object.isFrozen(engine.ENEMY_EXPANSION_REGISTRY), 'the built-in expansion registry must be immutable');

const ledgerReport = engine.buildEnemyExpansionLedgerReport();
check(ledgerReport.counts.slices === 22, 'the expansion ledger must contain EN-F00, EN-E01..18, and EN-B01..03');
check(ledgerReport.counts.proposals === 80, 'the expansion ledger must account for all 80 intake proposals');
check(ledgerReport.counts.implemented === 1, 'EN-E01 must be the only implemented expansion slice at its Idle visual gate');
check(ledgerReport.counts.approved === 1, 'accepted EN-F00 must be the only approved expansion slice');
check(ledgerReport.counts.publicFamilies === 0, 'planned content must never be reported as shipped');
check(Object.isFrozen(ledgerReport) && Object.isFrozen(ledgerReport.slices), 'the expansion ledger report must be deeply immutable');

const renderCalls = [];
const testRenderers = [
  {
    key: 'test-humanoid-v1',
    chassis: 'humanoid-v1',
    render(payload) {
      renderCalls.push(`${payload.family.id}/${payload.variant.id}/${payload.direction}/${payload.animation.id}/${payload.frame}`);
      return payload.variant.id;
    },
  },
];
const implementedFamily = {
  id: 'test-witch',
  name: 'Test Witch',
  sliceId: 'EN-E01',
  rendererKey: 'test-humanoid-v1',
  state: engine.ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [
    { id: 'hexer', name: 'Hexer', brief: 'Baseline equipped caster silhouette.' },
    { id: 'familiar-keeper', name: 'Familiar-Keeper', brief: 'Specialist familiar-handler silhouette.' },
  ],
  review: { baselineVariant: 'hexer', scale: 8, notes: 'Idle directions first.' },
};
const approvedFamily = {
  id: 'test-alchemist',
  name: 'Test Alchemist',
  sliceId: 'EN-E01',
  rendererKey: 'test-humanoid-v1',
  state: engine.ENEMY_EXPANSION_STATES.APPROVED,
  variants: [
    { id: 'flask-thrower', name: 'Flask Thrower', brief: 'Approved baseline throwing silhouette.' },
  ],
  review: { baselineVariant: 'flask-thrower' },
};
const testRegistry = engine.createEnemyExpansionRegistry({
  renderers: testRenderers,
  families: [implementedFamily, approvedFamily],
});
check(
  JSON.stringify(testRegistry.families.map((family) => family.id)) === JSON.stringify(['test-alchemist', 'test-witch']),
  'expansion family registration must use stable deterministic id order',
);
check(testRegistry.publicFamilies.length === 1 && testRegistry.publicFamilies[0].id === 'test-alchemist', 'only approved expansion families may enter the public-family view');
check(Object.isFrozen(testRegistry.families[0].variants[0]), 'registered expansion family metadata must be deeply immutable');
check(
  engine.renderEnemyExpansionFrame(
    testRegistry,
    { kind: 'enemy', family: 'test-witch', variant: 'hexer' },
    'down',
    'idle',
    0,
    { target: 'test' },
  ) === 'hexer',
  'the expansion facade must route an implemented family through its registered renderer key',
);
check(renderCalls.length === 1 && renderCalls[0] === 'test-witch/hexer/down/idle/0', 'registered expansion renderer dispatch must receive exact frame metadata');

const familyReview = engine.buildEnemyExpansionReviewPlan(testRegistry, { familyId: 'test-witch' });
const sliceReview = engine.buildEnemyExpansionReviewPlan(testRegistry, { sliceId: 'EN-E01' });
check(familyReview.families.length === 1 && familyReview.families[0].variant === 'hexer', 'family review targeting must select only its baseline variant');
check(sliceReview.families.length === 2, 'slice review targeting must select every implemented family in that slice');
check(sliceReview.frames.length === 8, 'the first review plan must cover two Idle frames in all four directions');
check(
  JSON.stringify(sliceReview) === JSON.stringify(engine.buildEnemyExpansionReviewPlan(testRegistry, { sliceId: 'EN-E01' })),
  'review targeting must be deterministic',
);

rejects(
  () => engine.createEnemyExpansionRegistry({ renderers: testRenderers, families: [implementedFamily, implementedFamily] }),
  'duplicated',
  'duplicate expansion family ids',
);
rejects(
  () => engine.createEnemyExpansionRegistry({ renderers: testRenderers, families: [{ ...implementedFamily, id: 'slime' }] }),
  'collides',
  'legacy Enemy id collisions',
);
rejects(
  () => engine.createEnemyExpansionRegistry({ renderers: testRenderers, families: [{ ...implementedFamily, rendererKey: 'missing-renderer' }] }),
  'absent renderer',
  'missing expansion renderers',
);
rejects(
  () => engine.createEnemyExpansionRegistry({ renderers: testRenderers, families: [{ ...implementedFamily, state: engine.ENEMY_EXPANSION_STATES.PLANNED }] }),
  'cannot be registered before implementation',
  'planned family pre-registration',
);
rejects(
  () => engine.createEnemyExpansionRegistry({
    renderers: testRenderers,
    families: [{
      ...implementedFamily,
      variants: [implementedFamily.variants[0], implementedFamily.variants[0]],
    }],
  }),
  'duplicates variant id',
  'duplicate expansion variant ids',
);
rejects(
  () => engine.buildEnemyExpansionReviewPlan(testRegistry, {}),
  'exactly one',
  'ambiguous review targeting',
);

function validSheetEvidence() {
  const contract = engine.ENEMY_EXPANSION_PROFILE.frameContract;
  const frames = contract.directions.flatMap((direction) => (
    contract.animations.flatMap((animation) => (
      Array.from({ length: animation.frames }, (_, frame) => {
        const alpha = new Uint8Array(contract.cell * contract.cell);
        alpha[(frame + animation.id.length) % alpha.length] = 255;
        return { direction, animation: animation.id, frame, alpha, outOfBoundsWrites: [] };
      })
    ))
  ));
  return { width: contract.width, height: contract.height, directions: [...contract.directions], frames };
}

const validSheet = validSheetEvidence();
const validSheetResult = engine.validateEnemyExpansionSheet(validSheet);
check(validSheetResult.valid && validSheetResult.frames === 80 && validSheetResult.binaryAlpha, 'a complete valid 480x96 hard-alpha expansion sheet must pass');
rejects(
  () => engine.validateEnemyExpansionSheet({ ...validSheet, width: 479 }),
  'exactly 480x96',
  'wrong expansion sheet dimensions',
);
rejects(
  () => engine.validateEnemyExpansionSheet({ ...validSheet, directions: ['up', 'left', 'right', 'down'] }),
  'directions must be',
  'wrong expansion direction order',
);
const emptySheet = validSheetEvidence();
emptySheet.frames[0].alpha.fill(0);
rejects(() => engine.validateEnemyExpansionSheet(emptySheet), 'is empty', 'empty expansion frames');
const translucentSheet = validSheetEvidence();
translucentSheet.frames[0].alpha[0] = 128;
rejects(() => engine.validateEnemyExpansionSheet(translucentSheet), 'non-binary alpha', 'non-binary expansion alpha');
const clippedSheet = validSheetEvidence();
clippedSheet.frames[0].outOfBoundsWrites.push({ x: -1, y: 12 });
rejects(() => engine.validateEnemyExpansionSheet(clippedSheet), 'out-of-bounds', 'out-of-bounds expansion drawing');
const reorderedSheet = validSheetEvidence();
[reorderedSheet.frames[0], reorderedSheet.frames[1]] = [reorderedSheet.frames[1], reorderedSheet.frames[0]];
rejects(() => engine.validateEnemyExpansionSheet(reorderedSheet), 'wrong direction or animation order', 'reordered expansion frames');

if (errors.length) {
  console.error('Enemy expansion foundation validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Enemy expansion foundation validation passed at the EN-E01 Idle gate.');
console.log(`- Legacy families: ${legacy.families}`);
console.log(`- Legacy sheets: ${legacy.sheets}`);
console.log(`- Legacy frames: ${legacy.frames}`);
console.log(`- Legacy pixel digest: ${legacy.digest}`);
console.log(`- Ledger: ${ledgerReport.counts.slices} slices / ${ledgerReport.counts.proposals} proposals`);
console.log('- Registered expansion families: 0');
console.log('- Public expansion families: 0');
