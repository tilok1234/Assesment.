import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E03_LARGE_HYBRID_RENDERER } from './enemy-expansion-large-hybrid.js';

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export const EN_E03_CONTRACT_CARDS = deepFreeze([
  {
    id: 'giant',
    name: 'Giant',
    sliceId: 'EN-E03',
    intendedScale: {
      cell: 24,
      class: 'large-humanoid',
      footprint: 'one-cell-margin',
      heightRead: 'Near-full cell height with broad shoulders and oversized limbs, without Boss-scale overflow.',
    },
    locomotion: {
      mode: 'large-bipedal',
      idle: 'Two-frame upper-body weight drop while both slab-like feet stay planted.',
      walk: 'Future long-stride gait must keep the club and shoulders inside the standard cell.',
      stance: 'Broad, top-heavy stance with an asymmetric club side and a clear gap between the planted boots.',
    },
    attackTell: {
      bodyCue: 'The shoulders dip toward the rear heel before the torso drives through the swing.',
      heldItemCue: 'The huge club head rises above the weapon-side shoulder without leaving the 24x24 cell.',
      externalized: ['impact dust', 'ground crack', 'thrown boulder'],
    },
    variantBriefs: [
      { role: 'common', id: 'hill-breaker', name: 'Hill Breaker', brief: 'Broad hill giant in a rough belted tunic carrying a block-headed wooden club.' },
      { role: 'specialist', id: 'boulder-hurler', name: 'Boulder Hurler', brief: 'Long-armed ranged giant whose boulder remains a separate projectile asset.' },
      { role: 'elite', id: 'storm-clan-jarl', name: 'Storm-Clan Jarl', brief: 'Armored giant leader with a bright clan band and no baked lightning or impact crack.' },
    ],
    externalEffects: ['impact dust', 'ground crack', 'boulder projectile', 'storm arc'],
    externalMechanics: ['stagger resistance', 'ground-slam radius', 'boulder pickup state'],
    baseline: {
      variantId: 'hill-breaker',
      reviewScale: 8,
      rendererData: {
        archetype: 'giant',
        actor: {
          palette: {
            skin: ['#c58b5b', '#7a4b35'],
            hair: ['#50372b', '#2b211c'],
            outfit: ['#80583b', '#4c3628'],
          },
        },
        materials: {
          hide: ['#6f4b32', '#3d2c22'],
          hoof: ['#3c302b', '#201a18'],
          wood: ['#8b5b37', '#4d3425'],
          accent: ['#c28b43', '#754b2a'],
        },
      },
    },
  },
  {
    id: 'centaur',
    name: 'Centaur',
    sliceId: 'EN-E03',
    intendedScale: {
      cell: 24,
      class: 'hybrid-quadruped',
      footprint: 'one-cell-margin',
      heightRead: 'Human torso joined visibly to a four-legged horse body in front, rear, and side views.',
    },
    locomotion: {
      mode: 'hybrid-quadrupedal',
      idle: 'Two-frame human-torso breath and tail shift over four firmly separated hoof contacts.',
      walk: 'Future gait must use a true four-leg contact cycle rather than a duplicated biped walk.',
      stance: 'Long horse body, four hooves, readable tail, and an upright spear-bearing torso joined at the withers.',
    },
    attackTell: {
      bodyCue: 'The horse chest settles behind the forelegs while the human torso rotates above the withers.',
      heldItemCue: 'The spear stays outside the head and foreleg silhouette before the future thrust frame.',
      externalized: ['charge dust', 'spear trail', 'hoof shock ring'],
    },
    variantBriefs: [
      { role: 'common', id: 'steppe-hunter', name: 'Steppe Hunter', brief: 'Chestnut centaur scout with a teal vest, four dark hooves, tail, and upright spear.' },
      { role: 'specialist', id: 'sun-lancer', name: 'Sun Lancer', brief: 'Fast cavalry specialist with a brighter lance pennant and no baked charge trail.' },
      { role: 'elite', id: 'banner-khan', name: 'Banner Khan', brief: 'Armored centaur commander whose banner and rally aura remain separate attachment/effect contracts.' },
    ],
    externalEffects: ['charge dust', 'spear trail', 'hoof shock ring', 'rally aura'],
    externalMechanics: ['charge state', 'turn radius', 'mounted momentum'],
    baseline: {
      variantId: 'steppe-hunter',
      reviewScale: 8,
      rendererData: {
        archetype: 'centaur',
        actor: {
          palette: {
            skin: ['#c79262', '#83563d'],
            hair: ['#66402c', '#35251d'],
            outfit: ['#347477', '#21484e'],
          },
        },
        materials: {
          hide: ['#9a613d', '#5d3c2a'],
          hoof: ['#41312a', '#211a18'],
          wood: ['#8b603a', '#4b3525'],
          accent: ['#d0a04c', '#7c572b'],
        },
      },
    },
  },
  {
    id: 'satyr',
    name: 'Satyr',
    sliceId: 'EN-E03',
    intendedScale: {
      cell: 24,
      class: 'hybrid-digitigrade',
      footprint: 'one-cell-margin',
      heightRead: 'Human torso over bent furred legs, cloven hooves, horns, ears, and a short tail.',
    },
    locomotion: {
      mode: 'digitigrade-bipedal',
      idle: 'Two-frame breathing bounce with a small tail lift and grounded split-hoof contacts.',
      walk: 'Future gait must articulate thigh, hock, and hoof instead of borrowing straight humanoid boots.',
      stance: 'Narrow playful torso above reverse-jointed legs, paired horns, side ears, tail, and crooked staff.',
    },
    attackTell: {
      bodyCue: 'The hocks compress and the horn line leans forward before a bounding staff strike.',
      heldItemCue: 'The crooked staff stays outside the horn and ear silhouette throughout the wind-up.',
      externalized: ['pollen motes', 'music notes', 'bramble burst'],
    },
    variantBriefs: [
      { role: 'common', id: 'briar-reveler', name: 'Briar Reveler', brief: 'Forest-green satyr with curled horns, visible tail, digitigrade legs, cloven hooves, and a crooked staff.' },
      { role: 'specialist', id: 'reed-charmer', name: 'Reed Charmer', brief: 'Pipe-playing controller whose music notes and charm radius remain separate effects.' },
      { role: 'elite', id: 'wildwood-hornlord', name: 'Wildwood Hornlord', brief: 'Larger-horned woodland champion with ritual trim and no baked bramble aura.' },
    ],
    externalEffects: ['pollen motes', 'music notes', 'bramble burst', 'charm ring'],
    externalMechanics: ['charm state', 'bounding dodge', 'forest concealment'],
    baseline: {
      variantId: 'briar-reveler',
      reviewScale: 8,
      rendererData: {
        archetype: 'satyr',
        actor: {
          palette: {
            skin: ['#cf9a69', '#895d43'],
            hair: ['#6c4931', '#38291f'],
            outfit: ['#4f7542', '#30472e'],
          },
        },
        materials: {
          hide: ['#8b6243', '#543d2e'],
          hoof: ['#45332a', '#211a17'],
          wood: ['#80603c', '#493725'],
          accent: ['#c99b4d', '#76572c'],
        },
      },
    },
  },
]);

export const EN_E03_IDLE_GATE = deepFreeze({
  status: 'awaiting-designer-approval',
  authorizedOn: '2026-08-03',
  artifact: 'enemy-expansion-review/en-e03/en-e03-idle-review.png',
  artifactSha256: 'e2022aa7038b6a23c702b5f0533188a94dcf0c3c7bcddd09c380c253a25fca61',
  assembledArtifact: 'enemy-expansion-review/en-e03/en-e03-idle-complete-b-form-review.png',
  assembledArtifactSha256: '17ff9e8056875cbfcc6de7f4e64ade8fef6b18bdc920e1e22f5bbcc41ffc6ac7',
  candidateFrameDigest: 'd7ed44c51002873fb12045317af13f16b76cbdeed647a2968537b017f5e933ad',
  scope: 'Three common baselines, four directions, two Idle frames, and raw plus Complete B + Form review only.',
  exclusions: ['specialist variants', 'elite variants', 'Walk', 'Attack', 'Hurt', 'Cast', 'Death', 'registration', 'consumer exposure', 'effects', 'release'],
  nextGate: 'Explicit visual approval of the exact EN-E03 Idle artifact before any later production.',
});

function baselineFamily(card) {
  const baselineBrief = card.variantBriefs.find((variant) => variant.id === card.baseline.variantId);
  return {
    id: card.id,
    name: card.name,
    sliceId: card.sliceId,
    rendererKey: EN_E03_LARGE_HYBRID_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
    variants: [{
      id: baselineBrief.id,
      name: baselineBrief.name,
      brief: baselineBrief.brief,
      rendererData: card.baseline.rendererData,
    }],
    rendererData: {
      contractCard: card.id,
      intendedScale: card.intendedScale,
    },
    review: {
      baselineVariant: card.baseline.variantId,
      scale: card.baseline.reviewScale,
      notes: 'Common-only EN-E03 Idle candidate; no later animation or public registration is authorized.',
    },
  };
}

export const EN_E03_IDLE_FAMILIES = deepFreeze(EN_E03_CONTRACT_CARDS.map(baselineFamily));

export const EN_E03_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_LARGE_HYBRID_RENDERER],
  families: EN_E03_IDLE_FAMILIES,
});
