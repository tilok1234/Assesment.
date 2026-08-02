import {
  createEnemyExpansionRegistry,
} from './enemy-expansion.js';
import { EN_E01_PUBLIC_REGISTRY } from './enemy-expansion-en-e01.js';
import { EN_E02_PUBLIC_REGISTRY } from './enemy-expansion-en-e02.js';

const REPAIR_ID = 'enemy-expansion-repair-2026-08-03';
const ROBE_OUTFITS = new Set(['robe', 'cleric', 'necromancer']);
const REPAIR_FAMILY_IDS = [
  'catfolk',
  'desert-raider',
  'fallen-knight',
  'fanatic-monk',
  'goatfolk',
  'necromancer',
  'witch',
];
const REPAIR_FAMILIES = new Set(REPAIR_FAMILY_IDS);

function cloneData(value) {
  if (Array.isArray(value)) return value.map(cloneData);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneData(entry)]));
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

function replaceOverlay(overlays, fromId, toId) {
  return overlays.map((overlay) => overlay.id === fromId ? { ...overlay, id: toId } : overlay);
}

function repairRendererData(familyId, variant) {
  const rendererData = cloneData(variant.rendererData);
  const actor = rendererData.actor;
  let overlays = rendererData.identity?.overlays || [];

  if ((familyId === 'witch' || familyId === 'necromancer') && ROBE_OUTFITS.has(actor.outfit)) {
    actor.animatedRobeWalk = true;
  }

  if (familyId === 'fallen-knight' && variant.id === 'shieldbearer') {
    overlays.push({
      id: 'fallen-knight-seams-v2',
      colors: ['#b9c2cf', '#7e8a9c'],
    });
  }

  if (familyId === 'desert-raider') {
    overlays = replaceOverlay(overlays, 'desert-wrap', 'desert-wrap-v2');
  }

  if (familyId === 'fanatic-monk' && ROBE_OUTFITS.has(actor.outfit)) {
    actor.animatedRobeWalk = true;
  }

  if (familyId === 'catfolk') {
    actor.customFeet = true;
    overlays = replaceOverlay(overlays, 'catfolk-traits', 'catfolk-traits-v2');
  }

  if (familyId === 'goatfolk') {
    actor.customFeet = true;
    overlays = replaceOverlay(overlays, 'goatfolk-traits', 'goatfolk-traits-v2');
  }

  rendererData.identity = { ...rendererData.identity, overlays };
  return rendererData;
}

function repairFamily(family) {
  const review = cloneData(family.review);
  if (REPAIR_FAMILIES.has(family.id)) {
    review.notes += ' Approved ' + REPAIR_ID + ' correction; pre-repair pixels remain in the internal comparison registry.';
  }
  return {
    ...cloneData(family),
    variants: family.variants.map((variant) => ({
      ...cloneData(variant),
      rendererData: repairRendererData(family.id, variant),
    })),
    review,
  };
}

export const ENEMY_EXPANSION_PRE_REPAIR_REGISTRY = createEnemyExpansionRegistry({
  renderers: EN_E01_PUBLIC_REGISTRY.renderers,
  families: [
    ...EN_E01_PUBLIC_REGISTRY.families,
    ...EN_E02_PUBLIC_REGISTRY.families,
  ],
});

export const ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE = deepFreeze({
  id: REPAIR_ID,
  status: 'approved',
  authorizedOn: '2026-08-03',
  approvedOn: '2026-08-03',
  approvalEvidence: 'Designer accepted the live Complete B + Form Walk review: nice thats better lets keep going.',
  affectedFamilies: REPAIR_FAMILY_IDS,
  scope: 'Accept the reviewed walk-readability and enclosed-transparency repairs while retaining the pre-repair EN-E01/EN-E02 registry as immutable comparison evidence.',
  exclusions: ['EN-E03', 'new families', 'new variants', 'external effects', 'release acceptance'],
});

export const ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY = createEnemyExpansionRegistry({
  renderers: EN_E01_PUBLIC_REGISTRY.renderers,
  families: [
    ...EN_E01_PUBLIC_REGISTRY.families.map(repairFamily),
    ...EN_E02_PUBLIC_REGISTRY.families.map(repairFamily),
  ],
});

export const ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY = ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY;
