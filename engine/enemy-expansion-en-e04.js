import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E04_NAGA_MOTION_FAMILY,
  EN_E04_NAGA_MOTION_GATE,
  EN_E04_NAGA_MOTION_RENDERER,
} from './enemy-expansion-en-e04-naga-motion.js';
import {
  EN_E04_NAGA_EXPANDED_SLICE_FAMILY,
  EN_E04_NAGA_EXPANDED_SLICE_GATE,
  EN_E04_NAGA_EXPANDED_SLICE_RENDERER,
} from './enemy-expansion-en-e04-venom-motion-rajah-idle.js';
import {
  EN_E04_TEMPLE_RAJAH_MOTION_FAMILY,
  EN_E04_TEMPLE_RAJAH_MOTION_GATE,
  EN_E04_TEMPLE_RAJAH_MOTION_RENDERER,
} from './enemy-expansion-en-e04-rajah-motion.js';
import {
  EN_E04_MERFOLK_TIDEGUARD_FAMILY,
  EN_E04_MERFOLK_TIDEGUARD_GATE,
  EN_E04_MERFOLK_TIDEGUARD_RENDERER,
} from './enemy-expansion-en-e04-merfolk-tideguard.js';
import {
  EN_E04_MERFOLK_REEFCALLER_FAMILY,
  EN_E04_MERFOLK_REEFCALLER_GATE,
  EN_E04_MERFOLK_REEFCALLER_RENDERER,
} from './enemy-expansion-en-e04-merfolk-reefcaller.js';
import {
  EN_E04_MERFOLK_PEARL_REGENT_FAMILY,
  EN_E04_MERFOLK_PEARL_REGENT_GATE,
  EN_E04_MERFOLK_PEARL_REGENT_RENDERER,
} from './enemy-expansion-en-e04-merfolk-pearl-regent.js';
import {
  EN_E04_BIRDFOLK_AERIE_SCOUT_FAMILY,
  EN_E04_BIRDFOLK_AERIE_SCOUT_GATE,
  EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER,
} from './enemy-expansion-en-e04-birdfolk-aerie-scout.js';
import {
  EN_E04_BIRDFOLK_GALE_AUGUR_FAMILY,
  EN_E04_BIRDFOLK_GALE_AUGUR_GATE,
  EN_E04_BIRDFOLK_GALE_AUGUR_RENDERER,
} from './enemy-expansion-en-e04-birdfolk-gale-augur.js';
import {
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_FAMILY,
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE,
  EN_E04_BIRDFOLK_STORMCROWN_EXARCH_RENDERER,
} from './enemy-expansion-en-e04-birdfolk-stormcrown-exarch.js';

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
  assert(variant, `Approved EN-E04 source variant ${family.id}/${variantId} is missing.`);
  return { ...variant };
}

function registeredRenderer(key, chassis, variants) {
  return Object.freeze({
    key,
    chassis,
    render(args) {
      const renderer = variants[args.variant.id];
      assert(renderer, `Registered EN-E04 renderer ${key} does not own ${args.family.id}/${args.variant.id}.`);
      return renderer.render(args);
    },
  });
}

export const EN_E04_REGISTRATION_GATE = deepFreeze({
  id: 'en-e04-nine-enemy-registration-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  approvalEvidence: 'After reviewing and approving Stormcrown Exarch, the designer approved the proposed publication, registration, and assembler-integration sequence by saying: sure lets do 123.',
  sourceCheckpoint: '6f81c92',
  families: ['naga', 'merfolk', 'birdfolk'],
  variants: {
    naga: ['coilguard', 'venom-oracle', 'temple-rajah'],
    merfolk: ['tideguard', 'reefcaller', 'pearl-regent'],
    birdfolk: ['aerie-scout', 'gale-augur', 'stormcrown-exarch'],
  },
  sourceGates: [
    EN_E04_NAGA_MOTION_GATE.id,
    EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
    EN_E04_TEMPLE_RAJAH_MOTION_GATE.id,
    EN_E04_MERFOLK_TIDEGUARD_GATE.id,
    EN_E04_MERFOLK_REEFCALLER_GATE.id,
    EN_E04_MERFOLK_PEARL_REGENT_GATE.id,
    EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id,
    EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id,
    EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.id,
  ],
  candidateFrameDigest: '137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459',
  scope: 'Register exactly three approved EN-E04 families and nine approved common/specialist/elite variants through the stable expansion registry without changing any reviewed source pixels.',
  exclusions: ['consumer exposure', 'editor selectors', 'random generation', 'persistence', 'game-pack exports', 'effects', 'release', 'later expansion slices'],
  nextGate: 'After exact 720-frame candidate/registered parity and stable-registry validation, route EN-E04 through the separately authorized assembler consumer-integration gate.',
});

export const EN_E04_NAGA_REGISTERED_RENDERER = registeredRenderer(
  'en-e04-naga-registered-v1',
  EN_E04_NAGA_MOTION_RENDERER.chassis,
  {
    coilguard: EN_E04_NAGA_MOTION_RENDERER,
    'venom-oracle': EN_E04_NAGA_EXPANDED_SLICE_RENDERER,
    'temple-rajah': EN_E04_TEMPLE_RAJAH_MOTION_RENDERER,
  },
);

export const EN_E04_MERFOLK_REGISTERED_RENDERER = registeredRenderer(
  'en-e04-merfolk-registered-v1',
  EN_E04_MERFOLK_TIDEGUARD_RENDERER.chassis,
  {
    tideguard: EN_E04_MERFOLK_TIDEGUARD_RENDERER,
    reefcaller: EN_E04_MERFOLK_REEFCALLER_RENDERER,
    'pearl-regent': EN_E04_MERFOLK_PEARL_REGENT_RENDERER,
  },
);

export const EN_E04_BIRDFOLK_REGISTERED_RENDERER = registeredRenderer(
  'en-e04-birdfolk-registered-v1',
  EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER.chassis,
  {
    'aerie-scout': EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER,
    'gale-augur': EN_E04_BIRDFOLK_GALE_AUGUR_RENDERER,
    'stormcrown-exarch': EN_E04_BIRDFOLK_STORMCROWN_EXARCH_RENDERER,
  },
);

export const EN_E04_APPROVED_FAMILIES = deepFreeze([
  {
    id: 'naga',
    name: 'Naga',
    sliceId: 'EN-E04',
    rendererKey: EN_E04_NAGA_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [
      sourceVariant(EN_E04_NAGA_MOTION_FAMILY, 'coilguard'),
      sourceVariant(EN_E04_NAGA_EXPANDED_SLICE_FAMILY, 'venom-oracle'),
      sourceVariant(EN_E04_TEMPLE_RAJAH_MOTION_FAMILY, 'temple-rajah'),
    ],
    rendererData: {
      registrationGate: EN_E04_REGISTRATION_GATE.id,
      approvedVariantGates: [EN_E04_NAGA_MOTION_GATE.id, EN_E04_NAGA_EXPANDED_SLICE_GATE.id, EN_E04_TEMPLE_RAJAH_MOTION_GATE.id],
    },
    review: {
      baselineVariant: 'coilguard',
      scale: 6,
      notes: 'Designer-approved Naga common, specialist, and elite registered with exact reviewed-pixel parity.',
    },
  },
  {
    id: 'merfolk',
    name: 'Merfolk',
    sliceId: 'EN-E04',
    rendererKey: EN_E04_MERFOLK_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [
      sourceVariant(EN_E04_MERFOLK_TIDEGUARD_FAMILY, 'tideguard'),
      sourceVariant(EN_E04_MERFOLK_REEFCALLER_FAMILY, 'reefcaller'),
      sourceVariant(EN_E04_MERFOLK_PEARL_REGENT_FAMILY, 'pearl-regent'),
    ],
    rendererData: {
      registrationGate: EN_E04_REGISTRATION_GATE.id,
      approvedVariantGates: [EN_E04_MERFOLK_TIDEGUARD_GATE.id, EN_E04_MERFOLK_REEFCALLER_GATE.id, EN_E04_MERFOLK_PEARL_REGENT_GATE.id],
    },
    review: {
      baselineVariant: 'tideguard',
      scale: 6,
      notes: 'Designer-approved Merfolk common, specialist, and elite registered with exact reviewed-pixel parity.',
    },
  },
  {
    id: 'birdfolk',
    name: 'Birdfolk',
    sliceId: 'EN-E04',
    rendererKey: EN_E04_BIRDFOLK_REGISTERED_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [
      sourceVariant(EN_E04_BIRDFOLK_AERIE_SCOUT_FAMILY, 'aerie-scout'),
      sourceVariant(EN_E04_BIRDFOLK_GALE_AUGUR_FAMILY, 'gale-augur'),
      sourceVariant(EN_E04_BIRDFOLK_STORMCROWN_EXARCH_FAMILY, 'stormcrown-exarch'),
    ],
    rendererData: {
      registrationGate: EN_E04_REGISTRATION_GATE.id,
      approvedVariantGates: [EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id, EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id, EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.id],
    },
    review: {
      baselineVariant: 'aerie-scout',
      scale: 6,
      notes: 'Designer-approved Birdfolk common, specialist, and elite registered with exact reviewed-pixel parity.',
    },
  },
]);

export const EN_E04_PUBLIC_REGISTRY = createEnemyExpansionRegistry({
  renderers: [
    EN_E04_NAGA_REGISTERED_RENDERER,
    EN_E04_MERFOLK_REGISTERED_RENDERER,
    EN_E04_BIRDFOLK_REGISTERED_RENDERER,
  ],
  families: EN_E04_APPROVED_FAMILIES,
});
