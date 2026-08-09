import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E06_FAIRY_FAMILY,
  EN_E06_FAIRY_GATE,
  EN_E06_FAIRY_RENDERER,
} from './enemy-expansion-en-e06-fairy.js';
import {
  EN_E06_THISTLE_HEXER_FAMILY,
  EN_E06_THISTLE_HEXER_GATE,
  EN_E06_THISTLE_HEXER_RENDERER,
} from './enemy-expansion-en-e06-fairy-thistle-hexer.js';
import {
  EN_E06_PETALCROWN_DUELIST_FAMILY,
  EN_E06_PETALCROWN_DUELIST_GATE,
  EN_E06_PETALCROWN_DUELIST_RENDERER,
} from './enemy-expansion-en-e06-fairy-petalcrown-duelist.js';
import {
  EN_E06_MIRE_CRONE_FAMILY,
  EN_E06_MIRE_CRONE_GATE,
  EN_E06_MIRE_CRONE_RENDERER,
} from './enemy-expansion-en-e06-hag-mire-crone.js';
import {
  EN_E06_CAULDRON_HEXER_FAMILY,
  EN_E06_CAULDRON_HEXER_GATE,
  EN_E06_CAULDRON_HEXER_RENDERER,
} from './enemy-expansion-en-e06-hag-cauldron-hexer.js';
import {
  EN_E06_BLACKTHORN_MATRON_FAMILY,
  EN_E06_BLACKTHORN_MATRON_GATE,
  EN_E06_BLACKTHORN_MATRON_RENDERER,
} from './enemy-expansion-en-e06-hag-blackthorn-matron.js';
import {
  EN_E06_GROVE_TENDER_FAMILY,
  EN_E06_GROVE_TENDER_GATE,
  EN_E06_GROVE_TENDER_RENDERER,
} from './enemy-expansion-en-e06-dryad-grove-tender.js';
import {
  EN_E06_SPORE_CANTOR_FAMILY,
  EN_E06_SPORE_CANTOR_GATE,
  EN_E06_SPORE_CANTOR_RENDERER,
} from './enemy-expansion-en-e06-dryad-spore-cantor.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

function sourceVariant(family, variantId) {
  const variant = family.variants.find((entry) => entry.id === variantId);
  assert(variant, `Approved EN-E06 source variant ${family.id}/${variantId} is missing.`);
  return { ...variant };
}

function registeredRenderer(key, chassis, variants) {
  return Object.freeze({
    key,
    chassis,
    render(args) {
      const renderer = variants[args.variant.id];
      assert(renderer, `Registered EN-E06 renderer ${key} does not own ${args.family.id}/${args.variant.id}.`);
      return renderer.render(args);
    },
  });
}

export const EN_E06_REGISTRATION_GATE = deepFreeze({
  id: 'en-e06-eight-enemy-registration-v1',
  status: 'authorized',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After reviewing the completed-but-private backlog, the designer said: sure lets go ahead and add them in as you reccomend.',
  families: {
    fairy: ['bramblewing-scout', 'thistle-hexer', 'petalcrown-duelist'],
    hag: ['mire-crone', 'cauldron-hexer', 'blackthorn-matron'],
    dryad: ['grove-tender', 'spore-cantor'],
  },
  sourceGates: [
    EN_E06_FAIRY_GATE.id,
    EN_E06_THISTLE_HEXER_GATE.id,
    EN_E06_PETALCROWN_DUELIST_GATE.id,
    EN_E06_MIRE_CRONE_GATE.id,
    EN_E06_CAULDRON_HEXER_GATE.id,
    EN_E06_BLACKTHORN_MATRON_GATE.id,
    EN_E06_GROVE_TENDER_GATE.id,
    EN_E06_SPORE_CANTOR_GATE.id,
  ],
  scope: 'Register and expose exactly the eight visually approved EN-E06 Fairy, Hag, and Dryad suites through generic assembler consumers without changing reviewed source pixels.',
  expectedExpansionFamilies: 20,
  expectedExpansionVariants: 51,
  expectedPublicFamilies: 77,
  expectedPublicVariants: 253,
  exclusions: ['Heartwood Warden', 'Redcap', 'Nymph', 'EN-E07', 'fixture generation or regeneration', 'effects', 'release', 'reviewed pixel changes'],
});

export const EN_E06_FAIRY_REGISTERED_RENDERER = registeredRenderer(
  'en-e06-fairy-registered-v1',
  EN_E06_FAIRY_RENDERER.chassis,
  {
    'bramblewing-scout': EN_E06_FAIRY_RENDERER,
    'thistle-hexer': EN_E06_THISTLE_HEXER_RENDERER,
    'petalcrown-duelist': EN_E06_PETALCROWN_DUELIST_RENDERER,
  },
);

export const EN_E06_HAG_REGISTERED_RENDERER = registeredRenderer(
  'en-e06-hag-registered-v1',
  EN_E06_MIRE_CRONE_RENDERER.chassis,
  {
    'mire-crone': EN_E06_MIRE_CRONE_RENDERER,
    'cauldron-hexer': EN_E06_CAULDRON_HEXER_RENDERER,
    'blackthorn-matron': EN_E06_BLACKTHORN_MATRON_RENDERER,
  },
);

export const EN_E06_DRYAD_REGISTERED_RENDERER = registeredRenderer(
  'en-e06-dryad-registered-v1',
  EN_E06_GROVE_TENDER_RENDERER.chassis,
  {
    'grove-tender': EN_E06_GROVE_TENDER_RENDERER,
    'spore-cantor': EN_E06_SPORE_CANTOR_RENDERER,
  },
);

export const EN_E06_APPROVED_FAMILIES = deepFreeze([
  {
    id: 'fairy',
    name: 'Fairy',
    sliceId: 'EN-E06',
    rendererKey: EN_E06_FAIRY_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [
      sourceVariant(EN_E06_FAIRY_FAMILY, 'bramblewing-scout'),
      sourceVariant(EN_E06_THISTLE_HEXER_FAMILY, 'thistle-hexer'),
      sourceVariant(EN_E06_PETALCROWN_DUELIST_FAMILY, 'petalcrown-duelist'),
    ],
    rendererData: { registrationGate: EN_E06_REGISTRATION_GATE.id },
    review: { baselineVariant: 'bramblewing-scout', scale: 8, notes: 'Exact approved Fairy suites exposed with source-pixel parity.' },
  },
  {
    id: 'hag',
    name: 'Hag',
    sliceId: 'EN-E06',
    rendererKey: EN_E06_HAG_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [
      sourceVariant(EN_E06_MIRE_CRONE_FAMILY, 'mire-crone'),
      sourceVariant(EN_E06_CAULDRON_HEXER_FAMILY, 'cauldron-hexer'),
      sourceVariant(EN_E06_BLACKTHORN_MATRON_FAMILY, 'blackthorn-matron'),
    ],
    rendererData: { registrationGate: EN_E06_REGISTRATION_GATE.id },
    review: { baselineVariant: 'mire-crone', scale: 8, notes: 'Exact approved Hag suites exposed with source-pixel parity.' },
  },
  {
    id: 'dryad',
    name: 'Dryad',
    sliceId: 'EN-E06',
    rendererKey: EN_E06_DRYAD_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [
      sourceVariant(EN_E06_GROVE_TENDER_FAMILY, 'grove-tender'),
      sourceVariant(EN_E06_SPORE_CANTOR_FAMILY, 'spore-cantor'),
    ],
    rendererData: { registrationGate: EN_E06_REGISTRATION_GATE.id },
    review: { baselineVariant: 'grove-tender', scale: 8, notes: 'Exact approved Dryad suites exposed with source-pixel parity.' },
  },
]);

export const EN_E06_PUBLIC_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_FAIRY_REGISTERED_RENDERER, EN_E06_HAG_REGISTERED_RENDERER, EN_E06_DRYAD_REGISTERED_RENDERER],
  families: EN_E06_APPROVED_FAMILIES,
});
