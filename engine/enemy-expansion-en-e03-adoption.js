import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E03_CENTAUR_ALIAS_RENDERER,
  EN_E03_COMMON_ALIAS_FAMILIES,
  EN_E03_COMMON_ALIAS_GATE,
  EN_E03_GIANT_ALIAS_RENDERER,
  EN_E03_SATYR_ALIAS_RENDERER,
} from './enemy-expansion-en-e03-common-aliases.js';
import {
  EN_E03_BANNER_KHAN_MOTION_FAMILY,
  EN_E03_BANNER_KHAN_MOTION_GATE,
  EN_E03_BANNER_KHAN_MOTION_RENDERER,
} from './enemy-expansion-en-e03-centaur-elite-motion.js';
import {
  EN_E03_REED_CHARMER_MOTION_FAMILY,
  EN_E03_REED_CHARMER_MOTION_GATE,
  EN_E03_REED_CHARMER_MOTION_RENDERER,
} from './enemy-expansion-en-e03-satyr-specialist-motion.js';
import {
  EN_E03_WILDWOOD_HORNLORD_MOTION_FAMILY,
  EN_E03_WILDWOOD_HORNLORD_MOTION_GATE,
  EN_E03_WILDWOOD_HORNLORD_MOTION_RENDERER,
} from './enemy-expansion-en-e03-satyr-elite-motion.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

function family(id) {
  const result = EN_E03_COMMON_ALIAS_FAMILIES.find((entry) => entry.id === id);
  assert(result, `Approved EN-E03 common family ${id} is missing.`);
  return result;
}

function sourceVariant(sourceFamily, variantId) {
  const variant = sourceFamily.variants.find((entry) => entry.id === variantId);
  assert(variant, `Approved EN-E03 source variant ${sourceFamily.id}/${variantId} is missing.`);
  return { ...variant };
}

function registeredRenderer(key, chassis, variants) {
  return Object.freeze({
    key,
    chassis,
    render(args) {
      const renderer = variants[args.variant.id];
      assert(renderer, `Registered EN-E03 renderer ${key} does not own ${args.family.id}/${args.variant.id}.`);
      return renderer.render(args);
    },
  });
}

export const EN_E03_ADOPTION_GATE = deepFreeze({
  id: 'en-e03-six-enemy-adoption-v1',
  status: 'authorized',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After reviewing the completed-but-unregistered backlog and the recommended separate EN-E03 adoption gate, the designer said: sure lets go ahead and add them in as you reccomend.',
  families: {
    giant: ['hill-breaker'],
    centaur: ['steppe-hunter', 'banner-khan'],
    satyr: ['briar-reveler', 'reed-charmer', 'wildwood-hornlord'],
  },
  sourceGates: [EN_E03_COMMON_ALIAS_GATE.id, EN_E03_BANNER_KHAN_MOTION_GATE.id, EN_E03_REED_CHARMER_MOTION_GATE.id, EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id],
  scope: 'Adopt exactly six visually approved complete EN-E03 suites through generic assembler consumers; preserve rejected v1/v2 evidence and exclude partial approved Idle-only variants.',
  expectedExpansionFamilies: 23,
  expectedExpansionVariants: 57,
  expectedPublicFamilies: 80,
  expectedPublicVariants: 259,
  exclusions: ['Boulder Hurler', 'Storm-Clan Jarl', 'Sun Lancer', 'rejected EN-E03 v1/v2', 'fixture generation or regeneration', 'effects', 'release', 'reviewed pixel changes'],
});

export const EN_E03_GIANT_REGISTERED_RENDERER = registeredRenderer(
  'en-e03-giant-registered-v1',
  EN_E03_GIANT_ALIAS_RENDERER.chassis,
  { 'hill-breaker': EN_E03_GIANT_ALIAS_RENDERER },
);

export const EN_E03_CENTAUR_REGISTERED_RENDERER = registeredRenderer(
  'en-e03-centaur-registered-v1',
  EN_E03_CENTAUR_ALIAS_RENDERER.chassis,
  { 'steppe-hunter': EN_E03_CENTAUR_ALIAS_RENDERER, 'banner-khan': EN_E03_BANNER_KHAN_MOTION_RENDERER },
);

export const EN_E03_SATYR_REGISTERED_RENDERER = registeredRenderer(
  'en-e03-satyr-registered-v1',
  EN_E03_SATYR_ALIAS_RENDERER.chassis,
  {
    'briar-reveler': EN_E03_SATYR_ALIAS_RENDERER,
    'reed-charmer': EN_E03_REED_CHARMER_MOTION_RENDERER,
    'wildwood-hornlord': EN_E03_WILDWOOD_HORNLORD_MOTION_RENDERER,
  },
);

export const EN_E03_ADOPTED_FAMILIES = deepFreeze([
  {
    id: 'giant', name: 'Giant', sliceId: 'EN-E03', rendererKey: EN_E03_GIANT_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [sourceVariant(family('giant'), 'hill-breaker')],
    rendererData: { adoptionGate: EN_E03_ADOPTION_GATE.id },
    review: { baselineVariant: 'hill-breaker', scale: 6, notes: 'Exact approved complete Giant suite adopted; partial variants remain excluded.' },
  },
  {
    id: 'centaur', name: 'Centaur', sliceId: 'EN-E03', rendererKey: EN_E03_CENTAUR_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [sourceVariant(family('centaur'), 'steppe-hunter'), sourceVariant(EN_E03_BANNER_KHAN_MOTION_FAMILY, 'banner-khan')],
    rendererData: { adoptionGate: EN_E03_ADOPTION_GATE.id },
    review: { baselineVariant: 'steppe-hunter', scale: 6, notes: 'Exact approved complete Centaur suites adopted; Sun Lancer remains excluded.' },
  },
  {
    id: 'satyr', name: 'Satyr', sliceId: 'EN-E03', rendererKey: EN_E03_SATYR_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [
      sourceVariant(family('satyr'), 'briar-reveler'),
      sourceVariant(EN_E03_REED_CHARMER_MOTION_FAMILY, 'reed-charmer'),
      sourceVariant(EN_E03_WILDWOOD_HORNLORD_MOTION_FAMILY, 'wildwood-hornlord'),
    ],
    rendererData: { adoptionGate: EN_E03_ADOPTION_GATE.id },
    review: { baselineVariant: 'briar-reveler', scale: 6, notes: 'Exact approved complete Satyr suites adopted with source-pixel parity.' },
  },
]);

export const EN_E03_ADOPTED_PUBLIC_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_GIANT_REGISTERED_RENDERER, EN_E03_CENTAUR_REGISTERED_RENDERER, EN_E03_SATYR_REGISTERED_RENDERER],
  families: EN_E03_ADOPTED_FAMILIES,
});
