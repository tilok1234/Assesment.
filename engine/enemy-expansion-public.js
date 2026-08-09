import {
  buildEnemyExpansionLedgerReport as buildFoundationLedgerReport,
  buildEnemyExpansionReviewPlan,
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_LEDGER,
  ENEMY_EXPANSION_PROFILE,
  ENEMY_EXPANSION_STATES,
  renderEnemyExpansionFrame,
  validateEnemyExpansionSheet,
} from './enemy-expansion.js';
import {
  ENEMY_EXPANSION_PRE_REPAIR_REGISTRY,
  ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY,
} from './enemy-expansion-repairs.js';
import { EN_E04_PUBLIC_REGISTRY } from './enemy-expansion-en-e04.js';
import { EN_E05_PUBLIC_REGISTRY } from './enemy-expansion-en-e05.js';
import { ENEMIES } from './catalogs.js';

export {
  buildEnemyExpansionReviewPlan,
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_LEDGER,
  ENEMY_EXPANSION_PRE_REPAIR_REGISTRY,
  ENEMY_EXPANSION_PROFILE,
  ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY,
  ENEMY_EXPANSION_STATES,
  renderEnemyExpansionFrame,
  validateEnemyExpansionSheet,
};

// Preserve the exact historical EN-E04 consumer composition as the source for
// the later EN-E05 stable and consumer boundary.
const ENEMY_EXPANSION_PRE_EN_E05_CONSUMER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [
    ...ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY.renderers,
    ...EN_E04_PUBLIC_REGISTRY.renderers,
  ],
  families: [
    ...ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY.families,
    ...EN_E04_PUBLIC_REGISTRY.families,
  ],
});

export const ENEMY_EXPANSION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [
    ...ENEMY_EXPANSION_PRE_EN_E05_CONSUMER_REGISTRY.renderers,
    ...EN_E05_PUBLIC_REGISTRY.renderers,
  ],
  families: [
    ...ENEMY_EXPANSION_PRE_EN_E05_CONSUMER_REGISTRY.families,
    ...EN_E05_PUBLIC_REGISTRY.families,
  ],
});

// The separately authorized EN-E05 assembler gate exposes the exact stable
// four-family registration through every generic consumer. The Ghoul
// replacement remains outside this registry and keeps its own later gate.
export const ENEMY_EXPANSION_CONSUMER_REGISTRY = ENEMY_EXPANSION_REGISTRY;

// Approved expansion families join the public consumer catalog without
// rewriting the locked legacy ENEMIES array or its historical fixtures.
export const PUBLIC_ENEMIES = Object.freeze([
  ...ENEMIES,
  ...ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies,
]);

export function buildEnemyExpansionLedgerReport(
  ledger = ENEMY_EXPANSION_LEDGER,
  registry = ENEMY_EXPANSION_REGISTRY,
) {
  return buildFoundationLedgerReport(ledger, registry);
}
