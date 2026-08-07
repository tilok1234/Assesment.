import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E03_GIANT_HURT_FAMILY,
  EN_E03_GIANT_HURT_GATE,
  EN_E03_GIANT_HURT_RENDERER,
} from './enemy-expansion-en-e03-giant-hurt.js';
import {
  EN_E03_CENTAUR_HURT_FAMILY,
  EN_E03_CENTAUR_HURT_GATE,
  EN_E03_CENTAUR_HURT_RENDERER,
} from './enemy-expansion-en-e03-centaur-hurt.js';
import {
  EN_E03_SATYR_HURT_FAMILY,
  EN_E03_SATYR_HURT_GATE,
  EN_E03_SATYR_HURT_RENDERER,
} from './enemy-expansion-en-e03-satyr-hurt.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_COMMON_ALIAS_GATE = deepFreeze({
  id: 'en-e03-common-cast-death-aliases-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Briar Reveler Hurt animations together and said: approved lets do next. Codex explicitly bounded the next gate as common Cast/Death aliases across approved Hill Breaker, Steppe Hunter, and Briar Reveler only.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed the exact labeled all-four-direction Cast raw, Cast Complete B + Form, Death raw, and Death Complete B + Form GIFs together and said: approved.',
  precedingApproval: {
    gateId: EN_E03_SATYR_HURT_GATE.id,
    artifactSha256: EN_E03_SATYR_HURT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_HURT_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_SATYR_HURT_GATE.candidateFrameDigest,
  },
  approvedCommonBaselines: {
    hillBreaker: {
      gateId: EN_E03_GIANT_HURT_GATE.id,
      artifactSha256: EN_E03_GIANT_HURT_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_GIANT_HURT_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_GIANT_HURT_GATE.candidateFrameDigest,
    },
    steppeHunter: {
      gateId: EN_E03_CENTAUR_HURT_GATE.id,
      artifactSha256: EN_E03_CENTAUR_HURT_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_CENTAUR_HURT_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_CENTAUR_HURT_GATE.candidateFrameDigest,
    },
    briarReveler: {
      gateId: EN_E03_SATYR_HURT_GATE.id,
      artifactSha256: EN_E03_SATYR_HURT_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_SATYR_HURT_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_SATYR_HURT_GATE.candidateFrameDigest,
    },
  },
  artifact: 'enemy-expansion-review/en-e03-common-aliases/en-e03-common-cast-death-aliases-raw.png',
  artifactSha256: '1353962c4861960683c99a1e608654685b093fd101a6534c4777c5687e3f3b89',
  assembledArtifact: 'enemy-expansion-review/en-e03-common-aliases/en-e03-common-cast-death-aliases-complete-b-form.png',
  assembledArtifactSha256: '0ab28ed6467e798e5f24a8f19e6a4d2a522cba5d6ad7d045ea865b8953942575',
  reviewAnimations: {
    castRaw: {
      artifact: 'enemy-expansion-review/en-e03-common-aliases/en-e03-common-cast-three-families-four-directions-labeled.gif',
      sha256: 'e7340c687b8b4febc9852d56afaeed8d2545a37f9c3a816cfa3fa3fc25600d85', width: 576, height: 224, frames: 4, durationMs: 480,
    },
    castCompleteBForm: {
      artifact: 'enemy-expansion-review/en-e03-common-aliases/en-e03-common-cast-three-families-four-directions-labeled-complete-b-form.gif',
      sha256: '26594c7f08b61de870bde6046bca8a0d276cb24b6b7c9f87387546bd934c68c3', width: 576, height: 224, frames: 4, durationMs: 480,
    },
    deathRaw: {
      artifact: 'enemy-expansion-review/en-e03-common-aliases/en-e03-common-death-three-families-four-directions-labeled.gif',
      sha256: '438d31742ddd372018af80d96b84f20aec47246967a092b2f98684fe7580dae4', width: 576, height: 224, frames: 4, durationMs: 480,
    },
    deathCompleteBForm: {
      artifact: 'enemy-expansion-review/en-e03-common-aliases/en-e03-common-death-three-families-four-directions-labeled-complete-b-form.gif',
      sha256: 'b4adbb78be7ab2d5f8d7c47b207dba99938b0b3c108799aa651f56b1fcbb93f0', width: 576, height: 224, frames: 4, durationMs: 480,
    },
  },
  candidateFrameDigest: 'be86cf5677286e745d76f7744a49462ba22d4deeb63bc92026160a5ca84b8d89',
  scope: 'Common Cast and Death aliases only for Hill Breaker, Steppe Hunter, and Briar Reveler across Down, Left, Right, and Up.',
  aliasContract: 'Cast C1-C4 aliases approved Attack A1-A4 frame-for-frame. Death D1-D4 aliases approved Hurt H1,H2,H2,H2. The gate authors no new sprite pixels.',
  reviewPresentation: 'Show four labeled all-four-direction, three-family GIFs together: Cast raw/no-outline, Cast Complete B + Form, Death raw/no-outline, and Death Complete B + Form.',
  exclusions: [
    'new sprite pixels',
    'Idle changes',
    'Walk changes',
    'Attack changes',
    'Hurt changes',
    'specialist variants',
    'elite variants',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete and this bounded alias lane is published. No registration, integration, variants, effects, release, or later EN-E03 work is authorized without a separate explicit continuation.',
});

export const EN_E03_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

function aliasRenderer({ key, familyId, variantId, sourceRenderer, sourceGate }) {
  return Object.freeze({
    key,
    chassis: sourceRenderer.chassis,
    render(args) {
      assert(args.family.id === familyId, 'The EN-E03 common alias renderer ' + key + ' is restricted to ' + familyId + '.');
      assert(args.variant.id === variantId, 'The EN-E03 common alias renderer ' + key + ' is restricted to ' + variantId + '.');
      if (args.animation.id !== 'cast' && args.animation.id !== 'death') return sourceRenderer.render(args);
      const sourceAnimation = args.animation.id === 'cast' ? 'attack' : 'hurt';
      const sourceFrame = args.animation.id === 'cast' ? args.frame : EN_E03_DEATH_SOURCE_FRAMES[args.frame];
      const sourceResult = sourceRenderer.render({
        ...args,
        animation: { ...args.animation, id: sourceAnimation },
        frame: sourceFrame,
      });
      return Object.freeze({
        ...sourceResult,
        animation: args.animation.id,
        frame: args.frame,
        renderedAnimation: sourceAnimation,
        renderedFrame: sourceFrame,
        commonAliasGate: EN_E03_COMMON_ALIAS_GATE.id,
        approvedSourceGate: sourceGate.id,
        aliasOf: sourceAnimation + ':' + sourceFrame,
      });
    },
  });
}

export const EN_E03_GIANT_ALIAS_RENDERER = aliasRenderer({
  key: 'en-e03-giant-common-aliases-v1', familyId: 'giant', variantId: 'hill-breaker',
  sourceRenderer: EN_E03_GIANT_HURT_RENDERER, sourceGate: EN_E03_GIANT_HURT_GATE,
});

export const EN_E03_CENTAUR_ALIAS_RENDERER = aliasRenderer({
  key: 'en-e03-centaur-common-aliases-v1', familyId: 'centaur', variantId: 'steppe-hunter',
  sourceRenderer: EN_E03_CENTAUR_HURT_RENDERER, sourceGate: EN_E03_CENTAUR_HURT_GATE,
});

export const EN_E03_SATYR_ALIAS_RENDERER = aliasRenderer({
  key: 'en-e03-satyr-common-aliases-v1', familyId: 'satyr', variantId: 'briar-reveler',
  sourceRenderer: EN_E03_SATYR_HURT_RENDERER, sourceGate: EN_E03_SATYR_HURT_GATE,
});

function aliasFamily(sourceFamily, renderer, approvedHurtGate) {
  return deepFreeze({
    id: sourceFamily.id,
    name: sourceFamily.name,
    sliceId: sourceFamily.sliceId,
    rendererKey: renderer.key,
    state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
    variants: sourceFamily.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      brief: variant.brief + ' Common Cast and Death now alias the approved Attack and Hurt frames without new pixels.',
      rendererData: variant.rendererData,
    })),
    rendererData: {
      ...sourceFamily.rendererData,
      approvedHurtGate: approvedHurtGate.id,
      activeGate: EN_E03_COMMON_ALIAS_GATE.id,
    },
    review: {
      ...sourceFamily.review,
      notes: 'Approved common Cast/Death alias baseline; every rendered pixel comes from the approved Attack or Hurt source and the family remains internal and non-public.',
    },
  });
}

export const EN_E03_COMMON_ALIAS_FAMILIES = deepFreeze([
  aliasFamily(EN_E03_GIANT_HURT_FAMILY, EN_E03_GIANT_ALIAS_RENDERER, EN_E03_GIANT_HURT_GATE),
  aliasFamily(EN_E03_CENTAUR_HURT_FAMILY, EN_E03_CENTAUR_ALIAS_RENDERER, EN_E03_CENTAUR_HURT_GATE),
  aliasFamily(EN_E03_SATYR_HURT_FAMILY, EN_E03_SATYR_ALIAS_RENDERER, EN_E03_SATYR_HURT_GATE),
]);

export const EN_E03_COMMON_ALIAS_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_GIANT_ALIAS_RENDERER, EN_E03_CENTAUR_ALIAS_RENDERER, EN_E03_SATYR_ALIAS_RENDERER],
  families: EN_E03_COMMON_ALIAS_FAMILIES,
});
