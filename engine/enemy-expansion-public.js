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
import { EN_E01_PUBLIC_REGISTRY } from './enemy-expansion-en-e01.js';
import { EN_E02_PUBLIC_REGISTRY } from './enemy-expansion-en-e02.js';
import { ENEMIES } from './catalogs.js';

export {
  buildEnemyExpansionReviewPlan,
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_LEDGER,
  ENEMY_EXPANSION_PROFILE,
  ENEMY_EXPANSION_STATES,
  renderEnemyExpansionFrame,
  validateEnemyExpansionSheet,
};

// The stable approved registry records every completed, registered slice.
// Consumer integration remains an explicit later gate, so consumers retain a
// separately frozen subset until that routing is authorized and validated.
export const ENEMY_EXPANSION_REGISTRY = createEnemyExpansionRegistry({
  renderers: EN_E01_PUBLIC_REGISTRY.renderers,
  families: [
    ...EN_E01_PUBLIC_REGISTRY.families,
    ...EN_E02_PUBLIC_REGISTRY.families,
  ],
});

export const ENEMY_EXPANSION_CONSUMER_REGISTRY = EN_E01_PUBLIC_REGISTRY;

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
