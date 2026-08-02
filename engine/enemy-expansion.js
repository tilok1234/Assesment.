import { ANIMS, DIRS, ENEMIES, SHEET_COLS, SIZE } from './catalogs.js';

function deepFreeze(value) {
  if (!value || (typeof value !== 'object' && typeof value !== 'function') || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function copyData(value) {
  if (Array.isArray(value)) return value.map(copyData);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, copyData(child)]));
}

function stableCompare(left, right) {
  const a = String(left);
  const b = String(right);
  return a < b ? -1 : a > b ? 1 : 0;
}

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLICE_PATTERN = /^EN-(?:F|E|B)\d{2}$/;

export const ENEMY_EXPANSION_STATES = deepFreeze({
  PLANNED: 'planned',
  IMPLEMENTED: 'implemented',
  APPROVED: 'approved',
});

export const ENEMY_EXPANSION_PROFILE = deepFreeze({
  id: 'enemy-expansion-v1',
  version: 1,
  legacyBaseline: {
    families: 57,
    variants: 202,
    frames: 16160,
    pixelDigestAlgorithm: 'sha256-family-variant-direction-animation-frame-json-v1',
    pixelDigest: '190a0f32b961b23fe0207c5a53fc005f9761666d27b15b98c0030325a10bef0c',
  },
  frameContract: {
    cell: SIZE,
    directions: [...DIRS],
    animations: ANIMS.map(({ id, frames, ms }) => ({ id, frames, ms })),
    columns: SHEET_COLS,
    width: SHEET_COLS * SIZE,
    height: DIRS.length * SIZE,
    alpha: 'binary',
  },
});

function ledgerEntry(id, title, kind, proposalCount, state, gate) {
  return { id, title, kind, proposalCount, state, gate };
}

export const ENEMY_EXPANSION_LEDGER = deepFreeze([
  ledgerEntry('EN-F00', 'Expansion renderer foundation', 'foundation', 0, ENEMY_EXPANSION_STATES.APPROVED, 'accepted-2026-08-02'),
  ledgerEntry('EN-E01', 'Humanoid threat pilot', 'standard', 5, ENEMY_EXPANSION_STATES.IMPLEMENTED, 'idle-approved-full-production-authorized'),
  ledgerEntry('EN-E02', 'Humanoid culture variants', 'standard', 5, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E03', 'Large and hybrid walkers', 'standard', 3, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E04', 'Serpentine and aquatic peoples', 'standard', 3, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E05', 'Undead humanoids', 'standard', 5, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E06', 'Fey and folklore', 'standard', 5, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E07', 'Shapeshifters and apparitions', 'standard', 5, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E08', 'Possessed equipment', 'standard', 5, ENEMY_EXPANSION_STATES.PLANNED, 'architecture-gated'),
  ledgerEntry('EN-E09', 'Arcane constructs', 'standard', 4, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E10', 'Heavy quadrupeds', 'standard', 5, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E11', 'Birds', 'standard', 5, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E12', 'Mythic composite creatures', 'standard', 3, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-B01', 'Hydra direction pilot', 'boss', 1, ENEMY_EXPANSION_STATES.PLANNED, 'boss-review-blocked'),
  ledgerEntry('EN-B02', 'Chimera direction pilot', 'boss', 1, ENEMY_EXPANSION_STATES.PLANNED, 'boss-review-blocked'),
  ledgerEntry('EN-B03', 'Roc direction pilot', 'boss', 1, ENEMY_EXPANSION_STATES.PLANNED, 'boss-review-blocked'),
  ledgerEntry('EN-E13', 'Ground insects', 'standard', 4, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E14', 'Parasites and wetland insects', 'standard', 4, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E15', 'Fast aquatic predators', 'standard', 4, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E16', 'Benthic and unusual aquatics', 'standard', 4, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E17', 'Dry-land plant creatures', 'standard', 4, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
  ledgerEntry('EN-E18', 'Seasonal and wet plant creatures', 'standard', 4, ENEMY_EXPANSION_STATES.PLANNED, 'queued'),
]);

function normalizeRenderer(renderer) {
  assert(renderer && typeof renderer === 'object' && !Array.isArray(renderer), 'Every expansion renderer must be an object.');
  assert(typeof renderer.key === 'string' && ID_PATTERN.test(renderer.key), 'Every expansion renderer needs a lower-kebab key.');
  assert(typeof renderer.chassis === 'string' && ID_PATTERN.test(renderer.chassis), `Expansion renderer ${renderer.key} needs a lower-kebab chassis key.`);
  assert(typeof renderer.render === 'function', `Expansion renderer ${renderer.key} needs a render function.`);
  return deepFreeze({ key: renderer.key, chassis: renderer.chassis, render: renderer.render });
}

function normalizeVariant(variant, familyId) {
  assert(variant && typeof variant === 'object' && !Array.isArray(variant), `Expansion family ${familyId} has an invalid variant.`);
  assert(typeof variant.id === 'string' && ID_PATTERN.test(variant.id), `Expansion family ${familyId} has an invalid variant id.`);
  assert(typeof variant.name === 'string' && variant.name.trim(), `Expansion variant ${familyId}/${variant.id} needs a name.`);
  assert(typeof variant.brief === 'string' && variant.brief.trim(), `Expansion variant ${familyId}/${variant.id} needs a production brief.`);
  assert(variant.rendererData === undefined || (variant.rendererData && typeof variant.rendererData === 'object' && !Array.isArray(variant.rendererData)), `Expansion variant ${familyId}/${variant.id} has invalid renderer data.`);
  return deepFreeze({
    id: variant.id,
    name: variant.name.trim(),
    brief: variant.brief.trim(),
    rendererData: copyData(variant.rendererData || {}),
  });
}

function normalizeFamily(family, rendererKeys, legacyIds, sliceIds) {
  assert(family && typeof family === 'object' && !Array.isArray(family), 'Every expansion family must be an object.');
  assert(typeof family.id === 'string' && ID_PATTERN.test(family.id), 'Every expansion family needs a lower-kebab id.');
  assert(!legacyIds.has(family.id), `Expansion family id ${family.id} collides with the legacy Enemy catalog.`);
  assert(typeof family.name === 'string' && family.name.trim(), `Expansion family ${family.id} needs a name.`);
  assert(typeof family.sliceId === 'string' && SLICE_PATTERN.test(family.sliceId) && sliceIds.has(family.sliceId), `Expansion family ${family.id} needs a valid planned slice id.`);
  assert(typeof family.rendererKey === 'string' && rendererKeys.has(family.rendererKey), `Expansion family ${family.id} references absent renderer ${family.rendererKey}.`);
  assert(
    family.state === ENEMY_EXPANSION_STATES.IMPLEMENTED || family.state === ENEMY_EXPANSION_STATES.APPROVED,
    `Expansion family ${family.id} cannot be registered before implementation.`,
  );
  assert(Array.isArray(family.variants) && family.variants.length > 0, `Expansion family ${family.id} needs at least one implemented variant.`);
  const variants = family.variants.map((variant) => normalizeVariant(variant, family.id));
  const variantIds = new Set();
  for (const variant of variants) {
    assert(!variantIds.has(variant.id), `Expansion family ${family.id} duplicates variant id ${variant.id}.`);
    variantIds.add(variant.id);
  }
  assert(family.review && typeof family.review === 'object' && !Array.isArray(family.review), `Expansion family ${family.id} needs review metadata.`);
  assert(variantIds.has(family.review.baselineVariant), `Expansion family ${family.id} review metadata needs a valid baseline variant.`);
  const scale = family.review.scale === undefined ? 8 : family.review.scale;
  assert(Number.isInteger(scale) && scale > 0, `Expansion family ${family.id} review scale must be a positive integer.`);
  assert(family.rendererData === undefined || (family.rendererData && typeof family.rendererData === 'object' && !Array.isArray(family.rendererData)), `Expansion family ${family.id} has invalid renderer data.`);
  return deepFreeze({
    id: family.id,
    name: family.name.trim(),
    sliceId: family.sliceId,
    rendererKey: family.rendererKey,
    state: family.state,
    variants,
    rendererData: copyData(family.rendererData || {}),
    review: {
      baselineVariant: family.review.baselineVariant,
      scale,
      notes: typeof family.review.notes === 'string' ? family.review.notes.trim() : '',
    },
  });
}

function publicFamily(family) {
  return deepFreeze({
    id: family.id,
    name: family.name,
    variants: family.variants.map((variant) => ({
      ...copyData(variant.rendererData),
      id: variant.id,
      name: variant.name,
    })),
  });
}

export function createEnemyExpansionRegistry({
  legacyFamilies = ENEMIES,
  renderers = [],
  families = [],
  ledger = ENEMY_EXPANSION_LEDGER,
} = {}) {
  assert(Array.isArray(legacyFamilies), 'legacyFamilies must be an array.');
  assert(Array.isArray(renderers), 'renderers must be an array.');
  assert(Array.isArray(families), 'families must be an array.');
  assert(Array.isArray(ledger), 'ledger must be an array.');

  const legacyIds = new Set();
  for (const family of legacyFamilies) {
    assert(family && typeof family.id === 'string', 'Every legacy Enemy family needs an id.');
    assert(!legacyIds.has(family.id), `Legacy Enemy family id ${family.id} is duplicated.`);
    legacyIds.add(family.id);
  }

  const sliceIds = new Set();
  for (const entry of ledger) {
    assert(entry && typeof entry.id === 'string' && SLICE_PATTERN.test(entry.id), 'Every expansion ledger entry needs a valid slice id.');
    assert(!sliceIds.has(entry.id), `Expansion ledger slice ${entry.id} is duplicated.`);
    sliceIds.add(entry.id);
  }

  const normalizedRenderers = renderers.map(normalizeRenderer).sort((left, right) => stableCompare(left.key, right.key));
  const rendererKeys = new Set();
  for (const renderer of normalizedRenderers) {
    assert(!rendererKeys.has(renderer.key), `Expansion renderer key ${renderer.key} is duplicated.`);
    rendererKeys.add(renderer.key);
  }

  const normalizedFamilies = families
    .map((family) => normalizeFamily(family, rendererKeys, legacyIds, sliceIds))
    .sort((left, right) => stableCompare(left.id, right.id));
  const familyIds = new Set();
  for (const family of normalizedFamilies) {
    assert(!familyIds.has(family.id), `Expansion family id ${family.id} is duplicated.`);
    familyIds.add(family.id);
  }

  const approvedFamilies = normalizedFamilies.filter((family) => family.state === ENEMY_EXPANSION_STATES.APPROVED);
  return deepFreeze({
    profile: ENEMY_EXPANSION_PROFILE.id,
    renderers: normalizedRenderers,
    families: normalizedFamilies,
    implementedFamilies: normalizedFamilies,
    approvedFamilies,
    publicFamilies: approvedFamilies.map(publicFamily),
  });
}

export const ENEMY_EXPANSION_REGISTRY = createEnemyExpansionRegistry();

export function buildEnemyExpansionLedgerReport(
  ledger = ENEMY_EXPANSION_LEDGER,
  registry = ENEMY_EXPANSION_REGISTRY,
) {
  assert(Array.isArray(ledger), 'ledger must be an array.');
  assert(registry && Array.isArray(registry.families), 'registry must be an Enemy expansion registry.');
  const stateCounts = {
    [ENEMY_EXPANSION_STATES.PLANNED]: 0,
    [ENEMY_EXPANSION_STATES.IMPLEMENTED]: 0,
    [ENEMY_EXPANSION_STATES.APPROVED]: 0,
  };
  const registeredBySlice = new Map();
  const publicBySlice = new Map();
  for (const family of registry.families) {
    registeredBySlice.set(family.sliceId, (registeredBySlice.get(family.sliceId) || 0) + 1);
    if (family.state === ENEMY_EXPANSION_STATES.APPROVED) {
      publicBySlice.set(family.sliceId, (publicBySlice.get(family.sliceId) || 0) + 1);
    }
  }
  const seen = new Set();
  let proposals = 0;
  const slices = ledger.map((entry) => {
    assert(entry && typeof entry.id === 'string' && SLICE_PATTERN.test(entry.id), 'Every expansion ledger entry needs a valid slice id.');
    assert(!seen.has(entry.id), `Expansion ledger slice ${entry.id} is duplicated.`);
    seen.add(entry.id);
    assert(Object.values(ENEMY_EXPANSION_STATES).includes(entry.state), `Expansion ledger slice ${entry.id} has an invalid state.`);
    assert(Number.isInteger(entry.proposalCount) && entry.proposalCount >= 0, `Expansion ledger slice ${entry.id} has an invalid proposal count.`);
    stateCounts[entry.state]++;
    proposals += entry.proposalCount;
    return {
      ...copyData(entry),
      registeredFamilies: registeredBySlice.get(entry.id) || 0,
      publicFamilies: publicBySlice.get(entry.id) || 0,
    };
  });
  for (const family of registry.families) {
    assert(seen.has(family.sliceId), `Expansion family ${family.id} references untracked slice ${family.sliceId}.`);
  }
  return deepFreeze({
    profile: ENEMY_EXPANSION_PROFILE.id,
    counts: {
      slices: slices.length,
      proposals,
      planned: stateCounts[ENEMY_EXPANSION_STATES.PLANNED],
      implemented: stateCounts[ENEMY_EXPANSION_STATES.IMPLEMENTED],
      approved: stateCounts[ENEMY_EXPANSION_STATES.APPROVED],
      registeredFamilies: registry.families.length,
      publicFamilies: registry.publicFamilies.length,
    },
    slices,
  });
}

export function buildEnemyExpansionReviewPlan(registry, { familyId, sliceId } = {}) {
  assert(registry && Array.isArray(registry.families), 'registry must be an Enemy expansion registry.');
  assert(Boolean(familyId) !== Boolean(sliceId), 'Select exactly one expansion family or slice for review.');
  if (familyId) assert(typeof familyId === 'string' && ID_PATTERN.test(familyId), 'Review familyId must be a lower-kebab id.');
  if (sliceId) assert(typeof sliceId === 'string' && SLICE_PATTERN.test(sliceId), 'Review sliceId must be a valid expansion slice id.');
  const families = registry.families
    .filter((family) => (familyId ? family.id === familyId : family.sliceId === sliceId))
    .sort((left, right) => stableCompare(left.id, right.id));
  assert(families.length > 0, `No implemented expansion families match ${familyId || sliceId}.`);
  const idle = ENEMY_EXPANSION_PROFILE.frameContract.animations.find((animation) => animation.id === 'idle');
  return deepFreeze({
    profile: ENEMY_EXPANSION_PROFILE.id,
    selector: familyId ? { familyId } : { sliceId },
    families: families.map((family) => ({
      id: family.id,
      name: family.name,
      sliceId: family.sliceId,
      state: family.state,
      rendererKey: family.rendererKey,
      variant: family.review.baselineVariant,
      scale: family.review.scale,
      notes: family.review.notes,
    })),
    frames: ENEMY_EXPANSION_PROFILE.frameContract.directions.flatMap((direction) => (
      Array.from({ length: idle.frames }, (_, frame) => ({ direction, animation: idle.id, frame }))
    )),
  });
}

export function renderEnemyExpansionFrame(registry, spec, direction, animationId, frame, context = {}) {
  assert(registry && Array.isArray(registry.families) && Array.isArray(registry.renderers), 'registry must be an Enemy expansion registry.');
  assert(spec && spec.kind === 'enemy', 'Expansion rendering needs an Enemy specification.');
  const family = registry.families.find((entry) => entry.id === spec.family);
  assert(family, `Expansion family ${spec?.family} is not implemented.`);
  const variant = family.variants.find((entry) => entry.id === spec.variant);
  assert(variant, `Expansion variant ${spec.family}/${spec.variant} is not implemented.`);
  const renderer = registry.renderers.find((entry) => entry.key === family.rendererKey);
  assert(renderer, `Expansion family ${family.id} references absent renderer ${family.rendererKey}.`);
  assert(ENEMY_EXPANSION_PROFILE.frameContract.directions.includes(direction), `Expansion direction ${direction} is invalid.`);
  const animation = ENEMY_EXPANSION_PROFILE.frameContract.animations.find((entry) => entry.id === animationId);
  assert(animation, `Expansion animation ${animationId} is invalid.`);
  assert(Number.isInteger(frame) && frame >= 0 && frame < animation.frames, `Expansion frame ${frame} is invalid for ${animationId}.`);
  return renderer.render({ context, spec: copyData(spec), family, variant, direction, animation, frame });
}

export function validateEnemyExpansionSheet(sheet) {
  assert(sheet && typeof sheet === 'object' && !Array.isArray(sheet), 'Completed expansion sheet evidence must be an object.');
  const contract = ENEMY_EXPANSION_PROFILE.frameContract;
  assert(sheet.width === contract.width && sheet.height === contract.height, `Completed expansion sheets must be exactly ${contract.width}x${contract.height}.`);
  assert(
    Array.isArray(sheet.directions) && JSON.stringify(sheet.directions) === JSON.stringify(contract.directions),
    `Completed expansion sheet directions must be ${contract.directions.join(', ')} in order.`,
  );
  const expectedFrames = contract.directions.flatMap((direction) => (
    contract.animations.flatMap((animation) => (
      Array.from({ length: animation.frames }, (_, frame) => ({ direction, animation: animation.id, frame }))
    ))
  ));
  assert(Array.isArray(sheet.frames) && sheet.frames.length === expectedFrames.length, `Completed expansion sheets need exactly ${expectedFrames.length} frame records.`);
  let opaquePixels = 0;
  for (let index = 0; index < expectedFrames.length; index++) {
    const expected = expectedFrames[index];
    const actual = sheet.frames[index];
    assert(actual && typeof actual === 'object', `Completed expansion sheet frame ${index} is missing.`);
    assert(
      actual.direction === expected.direction && actual.animation === expected.animation && actual.frame === expected.frame,
      `Completed expansion sheet frame ${index} has the wrong direction or animation order.`,
    );
    assert(Array.isArray(actual.outOfBoundsWrites), `Completed expansion sheet frame ${index} needs out-of-bounds evidence.`);
    assert(actual.outOfBoundsWrites.length === 0, `Completed expansion sheet frame ${index} attempted out-of-bounds drawing.`);
    assert(Array.isArray(actual.alpha) || ArrayBuffer.isView(actual.alpha), `Completed expansion sheet frame ${index} needs alpha evidence.`);
    assert(actual.alpha.length === contract.cell * contract.cell, `Completed expansion sheet frame ${index} has the wrong cell dimensions.`);
    let frameOpaque = 0;
    for (const alpha of actual.alpha) {
      assert(Number.isInteger(alpha) && (alpha === 0 || alpha === 255), `Completed expansion sheet frame ${index} contains non-binary alpha.`);
      if (alpha === 255) frameOpaque++;
    }
    assert(frameOpaque > 0, `Completed expansion sheet frame ${index} is empty.`);
    opaquePixels += frameOpaque;
  }
  return deepFreeze({
    valid: true,
    width: sheet.width,
    height: sheet.height,
    frames: expectedFrames.length,
    opaquePixels,
    binaryAlpha: true,
  });
}
