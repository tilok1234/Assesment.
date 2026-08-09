import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E05_GHOUL_UPGRADE_FAMILY,
  EN_E05_GHOUL_UPGRADE_GATE,
  EN_E05_GHOUL_UPGRADE_RENDERER,
} from './enemy-expansion-en-e05-ghoul-upgrade.js';
import {
  EN_E05_MUMMY_FAMILY,
  EN_E05_MUMMY_GATE,
  EN_E05_MUMMY_RENDERER,
} from './enemy-expansion-en-e05-mummy.js';
import {
  EN_E05_VAMPIRE_FAMILY,
  EN_E05_VAMPIRE_GATE,
  EN_E05_VAMPIRE_RENDERER,
} from './enemy-expansion-en-e05-vampire.js';
import {
  EN_E05_REVENANT_FAMILY,
  EN_E05_REVENANT_GATE,
  EN_E05_REVENANT_RENDERER,
} from './enemy-expansion-en-e05-revenant.js';
import {
  EN_E05_LICH_FAMILY,
  EN_E05_LICH_GATE,
  EN_E05_LICH_RENDERER,
} from './enemy-expansion-en-e05-lich.js';

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
  assert(variant, `Approved EN-E05 source variant ${family.id}/${variantId} is missing.`);
  return { ...variant };
}

function registeredRenderer(key, chassis, variants) {
  return Object.freeze({
    key,
    chassis,
    render(args) {
      const renderer = variants[args.variant.id];
      assert(renderer, `Registered EN-E05 renderer ${key} does not own ${args.family.id}/${args.variant.id}.`);
      return renderer.render(args);
    },
  });
}

export const EN_E05_REGISTRATION_GATE = deepFreeze({
  id: 'en-e05-five-undead-registration-v1',
  status: 'authorized',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the repaired Lich Soul Regent, the designer said: lets do next. The clean Lich handoff names EN-E05 registration and Wave 2 as separate later gates; stable EN-E05 registration is the next dependency and this authorization does not open consumer integration or Wave 2.',
  sourceCheckpoint: 'c0e438ba25de3f0adc063e6b294cba6c7b5182be',
  approvedSources: {
    ghoulUpgrade: {
      gateId: EN_E05_GHOUL_UPGRADE_GATE.id,
      candidateFrameDigest: EN_E05_GHOUL_UPGRADE_GATE.candidateFrameDigest,
      implementation: '88d32e951441b9ce8f89eb6e3ab279bfc037a497',
      handoff: '1aa733c1cd47c60538e9fa8ff621987867e451e3',
    },
    mummy: {
      gateId: EN_E05_MUMMY_GATE.id,
      candidateFrameDigest: EN_E05_MUMMY_GATE.candidateFrameDigest,
      implementation: '85f1ed77b34d7aa300e6ef7454b85f5295ad1da1',
      handoff: '3387bf2fd465e6e861450ba6e69ed2de31fd45ad',
    },
    vampire: {
      gateId: EN_E05_VAMPIRE_GATE.id,
      candidateFrameDigest: EN_E05_VAMPIRE_GATE.candidateFrameDigest,
      implementation: '6a7cce2f84f86f7836b583341f56a1ae7e9c7a51',
      handoff: '16f58760be6483ba463e0b5acf88cdaa4592943b',
    },
    revenant: {
      gateId: EN_E05_REVENANT_GATE.id,
      candidateFrameDigest: EN_E05_REVENANT_GATE.candidateFrameDigest,
      implementation: '7434578d5af8f3e7355add884cf0d33e3f312288',
      handoff: '97db37e151e04f42367c517955c88826c4ed7f51',
    },
    lich: {
      gateId: EN_E05_LICH_GATE.id,
      candidateFrameDigest: EN_E05_LICH_GATE.candidateFrameDigest,
      implementation: '4cebc7b09f979913d73330d275ac3e4729511465',
      handoff: 'c0e438ba25de3f0adc063e6b294cba6c7b5182be',
    },
  },
  families: {
    mummy: ['tomb-walker'],
    vampire: ['night-noble'],
    revenant: ['grave-oathkeeper'],
    lich: ['soul-regent'],
  },
  replacement: {
    source: { family: 'ghoul-upgrade', variant: 'ghoul' },
    target: { family: 'zombie', variant: 'ghoul' },
  },
  candidateFrameDigest: '732c6097b237131e85bdf435112c2bed7ec1f8bf8317dee4e42605f0c1730d32',
  scope: 'Register exactly four approved new EN-E05 families plus one approved legacy zombie/ghoul replacement record with exact 400-frame source parity. Advance only the stable registry; keep the current assembler consumer registry, public catalog, and fixtures unchanged.',
  exclusions: [
    'assembler consumer exposure',
    'editor selectors',
    'random generation',
    'persistence',
    'public zombie/ghoul replacement',
    'game-pack exports',
    'asset-pack fixture generation or regeneration',
    'schema changes',
    'reviewed pixel changes',
    'baked effects',
    'release',
    'Wave 2',
  ],
  nextGate: 'After exact 400-frame candidate/registered parity and stable-registry validation, publish this bounded registration checkpoint and stop. Assembler consumer integration, public zombie/ghoul replacement, fixtures, and Wave 2 require later explicit authorization.',
});

export const EN_E05_CONSUMER_INTEGRATION_GATE = deepFreeze({
  id: 'en-e05-assembler-consumers-v1',
  status: 'authorized',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After the clean EN-E05 registration checkpoint was published and the next closed gates were named, the designer said: cool lets do next. The next dependency is assembler exposure of the four registered new families; public Ghoul replacement, fixtures, effects, release, and Wave 2 remain separate.',
  registrationCheckpoint: '7d273ef52960e5bd4568ce3d47148c1b68fdcf44',
  registrationHandoff: '59a694118e08733b6f5e069009abc31e75e517cf',
  registrationFrameDigest: EN_E05_REGISTRATION_GATE.candidateFrameDigest,
  scope: 'Route exactly the four registered EN-E05 new families through generic editor selectors and sanitization, persistence, random Enemy generation, public rendering, outline/Form assembly, thumbnails, native sheets, Complete Kits, ordinary packs, and Wildshot game-pack validation.',
  expectedExpansionFamilies: 17,
  expectedExpansionVariants: 43,
  expectedPublicFamilies: 74,
  expectedPublicVariants: 245,
  consumerFrameDigest: '947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f',
  exclusions: [
    'public zombie/ghoul replacement',
    'asset-pack fixture generation or regeneration',
    'slice-specific editor branches',
    'schema changes',
    'reviewed pixel changes',
    'baked effects',
    'release',
    'EN-E03 adoption',
    'Wave 2',
  ],
  nextGate: 'Validate all generic EN-E05 consumer routes, publish this bounded assembler-integration checkpoint, and stop. Public Ghoul replacement, fixtures, effects, release, and Wave 2 require later explicit authorization.',
});

export const EN_E05_GHOUL_REGISTERED_RENDERER = registeredRenderer(
  'en-e05-ghoul-replacement-registered-v1',
  EN_E05_GHOUL_UPGRADE_RENDERER.chassis,
  { ghoul: EN_E05_GHOUL_UPGRADE_RENDERER },
);

export const EN_E05_MUMMY_REGISTERED_RENDERER = registeredRenderer(
  'en-e05-mummy-registered-v1',
  EN_E05_MUMMY_RENDERER.chassis,
  { 'tomb-walker': EN_E05_MUMMY_RENDERER },
);

export const EN_E05_VAMPIRE_REGISTERED_RENDERER = registeredRenderer(
  'en-e05-vampire-registered-v1',
  EN_E05_VAMPIRE_RENDERER.chassis,
  { 'night-noble': EN_E05_VAMPIRE_RENDERER },
);

export const EN_E05_REVENANT_REGISTERED_RENDERER = registeredRenderer(
  'en-e05-revenant-registered-v1',
  EN_E05_REVENANT_RENDERER.chassis,
  { 'grave-oathkeeper': EN_E05_REVENANT_RENDERER },
);

export const EN_E05_LICH_REGISTERED_RENDERER = registeredRenderer(
  'en-e05-lich-registered-v1',
  EN_E05_LICH_RENDERER.chassis,
  { 'soul-regent': EN_E05_LICH_RENDERER },
);

export const EN_E05_GHOUL_REGISTERED_REPLACEMENT_FAMILY = deepFreeze({
  id: 'ghoul-upgrade',
  name: 'Ghoul Replacement',
  sliceId: 'EN-E05',
  rendererKey: EN_E05_GHOUL_REGISTERED_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.APPROVED,
  variants: [sourceVariant(EN_E05_GHOUL_UPGRADE_FAMILY, 'ghoul')],
  rendererData: {
    registrationGate: EN_E05_REGISTRATION_GATE.id,
    approvedVariantGate: EN_E05_GHOUL_UPGRADE_GATE.id,
    replacementTarget: EN_E05_REGISTRATION_GATE.replacement.target,
  },
  review: {
    baselineVariant: 'ghoul',
    scale: 8,
    notes: 'Designer-approved Ghoul replacement registered separately from the stable new-family registry; public zombie/ghoul routing and fixture regeneration remain later gates.',
  },
});

function approvedFamily({
  id,
  name,
  variant,
  sourceFamily,
  sourceGate,
  renderer,
  scale = 8,
}) {
  return {
    id,
    name,
    sliceId: 'EN-E05',
    rendererKey: renderer.key,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    variants: [sourceVariant(sourceFamily, variant)],
    rendererData: {
      registrationGate: EN_E05_REGISTRATION_GATE.id,
      approvedVariantGate: sourceGate.id,
    },
    review: {
      baselineVariant: variant,
      scale,
      notes: `Designer-approved ${name} registered with exact reviewed-pixel parity.`,
    },
  };
}

export const EN_E05_APPROVED_FAMILIES = deepFreeze([
  approvedFamily({
    id: 'mummy',
    name: 'Mummy',
    variant: 'tomb-walker',
    sourceFamily: EN_E05_MUMMY_FAMILY,
    sourceGate: EN_E05_MUMMY_GATE,
    renderer: EN_E05_MUMMY_REGISTERED_RENDERER,
  }),
  approvedFamily({
    id: 'vampire',
    name: 'Vampire',
    variant: 'night-noble',
    sourceFamily: EN_E05_VAMPIRE_FAMILY,
    sourceGate: EN_E05_VAMPIRE_GATE,
    renderer: EN_E05_VAMPIRE_REGISTERED_RENDERER,
  }),
  approvedFamily({
    id: 'revenant',
    name: 'Revenant',
    variant: 'grave-oathkeeper',
    sourceFamily: EN_E05_REVENANT_FAMILY,
    sourceGate: EN_E05_REVENANT_GATE,
    renderer: EN_E05_REVENANT_REGISTERED_RENDERER,
  }),
  approvedFamily({
    id: 'lich',
    name: 'Lich',
    variant: 'soul-regent',
    sourceFamily: EN_E05_LICH_FAMILY,
    sourceGate: EN_E05_LICH_GATE,
    renderer: EN_E05_LICH_REGISTERED_RENDERER,
  }),
]);

export const EN_E05_GHOUL_REPLACEMENT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E05_GHOUL_REGISTERED_RENDERER],
  families: [EN_E05_GHOUL_REGISTERED_REPLACEMENT_FAMILY],
});

export const EN_E05_PUBLIC_REGISTRY = createEnemyExpansionRegistry({
  renderers: [
    EN_E05_MUMMY_REGISTERED_RENDERER,
    EN_E05_VAMPIRE_REGISTERED_RENDERER,
    EN_E05_REVENANT_REGISTERED_RENDERER,
    EN_E05_LICH_REGISTERED_RENDERER,
  ],
  families: EN_E05_APPROVED_FAMILIES,
});
