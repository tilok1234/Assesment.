import {
  ANIMS,
  BODY_BUILDS,
  DIRS,
  ENEMIES,
  EXPRESSIONS,
  FACIAL_DETAILS,
  HAIR_COLORS,
  HAIR_STYLES,
  HEADGEAR,
  OFFHANDS,
  OUTFITS,
  OUTFIT_COLORS,
  OUTFIT_TIERS,
  SHIELDS,
  SHIELD_TIERS,
  SIZE,
  SKINS,
  SPECIES,
  WEAPONS,
  WEAPON_TIERS,
} from './catalogs.js';

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function copyJson(value) {
  if (Array.isArray(value)) return value.map(copyJson);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, copyJson(child)]));
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
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const COMMIT_PATTERN = /^[0-9a-f]{7,40}$/;

export const WILDSHOT_GAME_PACK_ACTOR_CATEGORIES = Object.freeze(['player', 'enemy']);
export const WILDSHOT_GAME_PACK_EFFECT_CATEGORIES = Object.freeze([
  'projectiles',
  'impacts',
  'trails',
  'statuses',
]);

export const WILDSHOT_GAME_PACK_POLICY = deepFreeze({
  pack: 'wildshot-assembler',
  version: 1,
  cell: 24,
  exportScale: 1,
  frameContract: {
    dirs: ['down', 'left', 'right', 'up'],
    anims: [
      { id: 'idle', frames: 2, ms: 420 },
      { id: 'walk', frames: 4, ms: 150 },
      { id: 'attack', frames: 4, ms: 115 },
      { id: 'cast', frames: 4, ms: 130 },
      { id: 'hurt', frames: 2, ms: 140 },
      { id: 'death', frames: 4, ms: 160 },
    ],
    layout: 'rows = dirs in order; columns = anims in order, frames left to right',
  },
});

const REQUIRED_NON_EMPTY_ACTOR_ANIMS = Object.freeze([
  'idle',
  'walk',
  'attack',
  'cast',
  'death',
]);

function actorPath(category, id) {
  return `${category === 'player' ? 'players' : 'enemies'}/${id}.png`;
}

function effectPath(category, id) {
  return `effects/${category}/${id}.png`;
}

function validateId(id, label) {
  assert(typeof id === 'string' && ID_PATTERN.test(id), `${label} must be a lower-kebab id.`);
}

function catalogHas(catalog, id) {
  return typeof id === 'string' && catalog.some((entry) => entry.id === id);
}

function validateCustomPalette(palette, actorId) {
  if (palette === null || palette === undefined) return;
  assert(palette && typeof palette === 'object' && !Array.isArray(palette), `Actor ${actorId} has an invalid custom palette.`);
  for (const key of ['skin', 'hair', 'outfit']) {
    assert(
      Array.isArray(palette[key])
        && palette[key].length === 2
        && palette[key].every((color) => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)),
      `Actor ${actorId} has an invalid ${key} palette.`,
    );
  }
}

function validatePlayerSpec(spec, actorId) {
  const fields = [
    ['species', SPECIES],
    ['bodyBuild', BODY_BUILDS],
    ['skin', SKINS],
    ['hairStyle', HAIR_STYLES],
    ['hairColor', HAIR_COLORS],
    ['expression', EXPRESSIONS],
    ['faceDetail', FACIAL_DETAILS],
    ['headgear', HEADGEAR],
    ['outfit', OUTFITS],
    ['outfitTier', OUTFIT_TIERS],
    ['outfitColor', OUTFIT_COLORS],
    ['weapon', WEAPONS],
    ['weaponTier', WEAPON_TIERS],
    ['shield', SHIELDS],
    ['shieldTier', SHIELD_TIERS],
    ['offhand', OFFHANDS],
  ];
  for (const [field, catalog] of fields) {
    assert(catalogHas(catalog, spec[field]), `Actor ${actorId} has an invalid ${field} id.`);
  }
  assert(spec.weapon !== 'none' || spec.weaponTier === 'tier1', `Actor ${actorId} has invalid unarmed tier metadata.`);
  assert(spec.shield !== 'none' || spec.shieldTier === 'tier1', `Actor ${actorId} has invalid shield tier metadata.`);
  assert(
    spec.shield === 'none' || spec.offhand === 'none',
    `Actor ${actorId} cannot equip a shield and utility off-hand together.`,
  );
  validateCustomPalette(spec.palette, actorId);
}

function validateEnemySpec(spec, actorId, enemyFamilies) {
  const family = enemyFamilies.find((entry) => entry.id === spec.family);
  assert(family, `Actor ${actorId} has an invalid enemy family id.`);
  assert(catalogHas(family.variants, spec.variant), `Actor ${actorId} has an invalid enemy variant id.`);
}

function validateActorSpec(actor, enemyFamilies) {
  assert(actor.spec.kind === actor.category, `Actor ${actor.id} specification kind must match its category.`);
  if (actor.category === 'player') validatePlayerSpec(actor.spec, actor.id);
  else validateEnemySpec(actor.spec, actor.id, enemyFamilies);
}

function normalizeActor(actor, enemyFamilies) {
  assert(actor && typeof actor === 'object', 'Every actor must be an object.');
  validateId(actor.id, 'Actor id');
  assert(
    WILDSHOT_GAME_PACK_ACTOR_CATEGORIES.includes(actor.category),
    `Actor ${actor.id} has an invalid category.`,
  );
  assert(actor.spec && typeof actor.spec === 'object' && !Array.isArray(actor.spec), `Actor ${actor.id} needs a specification.`);
  validateActorSpec(actor, enemyFamilies);
  const expectedSheet = actorPath(actor.category, actor.id);
  assert(actor.sheet === expectedSheet, `Actor ${actor.id} must use ${expectedSheet}.`);
  return {
    id: actor.id,
    category: actor.category,
    sheet: expectedSheet,
    spec: copyJson(actor.spec),
    ...(Array.isArray(actor.tags) ? { tags: actor.tags.map(String) } : {}),
  };
}

function normalizeEffect(effect) {
  assert(effect && typeof effect === 'object', 'Every effect must be an object.');
  validateId(effect.id, 'Effect id');
  assert(
    WILDSHOT_GAME_PACK_EFFECT_CATEGORIES.includes(effect.category),
    `Effect ${effect.id} has an invalid category.`,
  );
  const expectedSheet = effectPath(effect.category, effect.id);
  assert(effect.sheet === expectedSheet, `Effect ${effect.id} must use ${expectedSheet}.`);
  assert(Number.isInteger(effect.frames) && effect.frames > 0, `Effect ${effect.id} needs a positive frame count.`);
  assert(Number.isInteger(effect.ms) && effect.ms > 0, `Effect ${effect.id} needs a positive frame duration.`);
  assert(
    Array.isArray(effect.anchor)
      && effect.anchor.length === 2
      && effect.anchor.every((coordinate) => Number.isInteger(coordinate)),
    `Effect ${effect.id} needs a two-integer anchor.`,
  );
  assert(typeof effect.directional === 'boolean', `Effect ${effect.id} needs a directional flag.`);
  return {
    id: effect.id,
    category: effect.category,
    sheet: expectedSheet,
    frames: effect.frames,
    ms: effect.ms,
    anchor: [...effect.anchor],
    directional: effect.directional,
  };
}

function assertUniqueIds(entries, label) {
  const ids = new Set();
  for (const entry of entries) {
    assert(!ids.has(entry.id), `${label} id ${entry.id} is duplicated.`);
    ids.add(entry.id);
  }
}

export function auditWildshotGamePackRuntime() {
  const issues = [];
  if (SIZE !== WILDSHOT_GAME_PACK_POLICY.cell) {
    issues.push(`cell:${SIZE}:expected:${WILDSHOT_GAME_PACK_POLICY.cell}`);
  }
  if (JSON.stringify(DIRS) !== JSON.stringify(WILDSHOT_GAME_PACK_POLICY.frameContract.dirs)) {
    issues.push('directions:mismatch');
  }

  const currentAnimations = ANIMS.map(({ id, frames, ms }) => ({ id, frames, ms }));
  const requiredAnimations = WILDSHOT_GAME_PACK_POLICY.frameContract.anims;
  for (const required of requiredAnimations) {
    const current = currentAnimations.find((animation) => animation.id === required.id);
    if (!current) {
      issues.push(`animation:${required.id}:missing`);
    } else if (current.frames !== required.frames || current.ms !== required.ms) {
      issues.push(`animation:${required.id}:mismatch`);
    }
  }
  if (JSON.stringify(currentAnimations.map(({ id }) => id))
    !== JSON.stringify(requiredAnimations.map(({ id }) => id))) {
    issues.push('animations:order-mismatch');
  }

  return deepFreeze({
    ready: issues.length === 0,
    current: {
      cell: SIZE,
      dirs: [...DIRS],
      anims: currentAnimations,
    },
    required: copyJson(WILDSHOT_GAME_PACK_POLICY.frameContract),
    issues,
  });
}

export function buildWildshotGamePackManifest({
  generated,
  toolCommit,
  actors = [],
  effects = [],
} = {}, { enemyFamilies = ENEMIES } = {}) {
  assert(typeof generated === 'string' && DATE_PATTERN.test(generated), 'generated must use YYYY-MM-DD.');
  assert(typeof toolCommit === 'string' && COMMIT_PATTERN.test(toolCommit), 'toolCommit must be a 7-40 character lowercase Git hash.');
  assert(Array.isArray(actors) && actors.length > 0, 'A game pack needs at least one actor.');
  assert(Array.isArray(effects), 'effects must be an array.');
  assert(Array.isArray(enemyFamilies) && enemyFamilies.length > 0, 'enemyFamilies must be a non-empty array.');

  const normalizedActors = actors.map((actor) => normalizeActor(actor, enemyFamilies));
  const normalizedEffects = effects.map(normalizeEffect);
  assertUniqueIds(normalizedActors, 'Actor');
  assertUniqueIds(normalizedEffects, 'Effect');

  normalizedActors.sort((left, right) => (
    WILDSHOT_GAME_PACK_ACTOR_CATEGORIES.indexOf(left.category)
      - WILDSHOT_GAME_PACK_ACTOR_CATEGORIES.indexOf(right.category)
    || stableCompare(left.id, right.id)
  ));
  normalizedEffects.sort((left, right) => (
    WILDSHOT_GAME_PACK_EFFECT_CATEGORIES.indexOf(left.category)
      - WILDSHOT_GAME_PACK_EFFECT_CATEGORIES.indexOf(right.category)
    || stableCompare(left.id, right.id)
  ));

  return {
    pack: WILDSHOT_GAME_PACK_POLICY.pack,
    version: WILDSHOT_GAME_PACK_POLICY.version,
    generated,
    tool_commit: toolCommit,
    cell: WILDSHOT_GAME_PACK_POLICY.cell,
    export_scale: WILDSHOT_GAME_PACK_POLICY.exportScale,
    frame_contract: copyJson(WILDSHOT_GAME_PACK_POLICY.frameContract),
    actors: normalizedActors,
    effects: normalizedEffects,
  };
}

export function serializeWildshotGamePackManifest(manifest) {
  return new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function expectedFilePaths(manifest) {
  return [
    'manifest.json',
    ...manifest.actors.map(({ sheet }) => sheet),
    ...manifest.effects.map(({ sheet }) => sheet),
    'LICENSE',
  ];
}

function addIssue(issues, code, path = null) {
  issues.push(path ? `${code}:${path}` : code);
}

function validateManifestIdentity(manifest, issues) {
  if (manifest?.pack !== WILDSHOT_GAME_PACK_POLICY.pack) addIssue(issues, 'manifest:pack');
  if (manifest?.version !== WILDSHOT_GAME_PACK_POLICY.version) addIssue(issues, 'manifest:version');
  if (manifest?.cell !== WILDSHOT_GAME_PACK_POLICY.cell) addIssue(issues, 'manifest:cell');
  if (manifest?.export_scale !== 1) addIssue(issues, 'manifest:export-scale');
  if (!sameJson(manifest?.frame_contract, WILDSHOT_GAME_PACK_POLICY.frameContract)) {
    addIssue(issues, 'manifest:frame-contract');
  }
}

function validateManifestBytes(file, manifest, issues) {
  if (!(file?.data instanceof Uint8Array)) {
    addIssue(issues, 'manifest:bytes-missing', 'manifest.json');
    return;
  }
  const bytes = file.data;
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    addIssue(issues, 'manifest:bom', 'manifest.json');
    return;
  }
  try {
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (!sameJson(JSON.parse(decoded), manifest)) addIssue(issues, 'manifest:bytes-mismatch', 'manifest.json');
  } catch {
    addIssue(issues, 'manifest:utf8-json', 'manifest.json');
  }
}

export function validateWildshotGamePackExport({ manifest, files } = {}) {
  const issues = [];
  if (!manifest || typeof manifest !== 'object') return { valid: false, issues: ['manifest:missing'] };
  if (!Array.isArray(files)) return { valid: false, issues: ['files:missing'] };
  validateManifestIdentity(manifest, issues);

  const paths = files.map((file) => file?.path);
  const seen = new Set();
  for (const filePath of paths) {
    if (typeof filePath !== 'string' || seen.has(filePath)) addIssue(issues, 'file:path');
    seen.add(filePath);
  }

  const expectedPaths = expectedFilePaths(manifest);
  for (const filePath of expectedPaths) {
    if (!seen.has(filePath)) addIssue(issues, 'file:missing', filePath);
  }
  for (const filePath of seen) {
    if (!expectedPaths.includes(filePath)) addIssue(issues, 'file:orphan', filePath);
  }

  const byPath = new Map(files.map((file) => [file?.path, file]));
  const actorWidth = WILDSHOT_GAME_PACK_POLICY.frameContract.anims
    .reduce((sum, animation) => sum + animation.frames, 0) * WILDSHOT_GAME_PACK_POLICY.cell;
  const actorHeight = WILDSHOT_GAME_PACK_POLICY.frameContract.dirs.length
    * WILDSHOT_GAME_PACK_POLICY.cell;

  for (const actor of manifest.actors || []) {
    const file = byPath.get(actor.sheet);
    if (!file) continue;
    if (file.width !== actorWidth || file.height !== actorHeight) {
      addIssue(issues, 'actor:dimensions', actor.sheet);
    }
    if (file.binaryAlpha !== true) addIssue(issues, 'png:alpha', actor.sheet);
    const nonEmpty = Array.isArray(file.nonEmptyFrame0) ? file.nonEmptyFrame0 : [];
    for (const animationId of REQUIRED_NON_EMPTY_ACTOR_ANIMS) {
      if (!nonEmpty.includes(animationId)) addIssue(issues, `actor:empty:${animationId}`, actor.sheet);
    }
  }

  for (const effect of manifest.effects || []) {
    const file = byPath.get(effect.sheet);
    if (!file) continue;
    const expectedWidth = effect.frames * WILDSHOT_GAME_PACK_POLICY.cell;
    const expectedHeight = (effect.directional
      ? WILDSHOT_GAME_PACK_POLICY.frameContract.dirs.length
      : 1) * WILDSHOT_GAME_PACK_POLICY.cell;
    if (file.width !== expectedWidth || file.height !== expectedHeight) {
      addIssue(issues, 'effect:dimensions', effect.sheet);
    }
    if (file.binaryAlpha !== true) addIssue(issues, 'png:alpha', effect.sheet);
  }

  validateManifestBytes(byPath.get('manifest.json'), manifest, issues);
  const license = byPath.get('LICENSE');
  if (!(license?.data instanceof Uint8Array) || license.data.length === 0) {
    addIssue(issues, 'license:missing-content', 'LICENSE');
  }

  return { valid: issues.length === 0, issues };
}
