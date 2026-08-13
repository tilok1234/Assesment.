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
import {
  EN_E03_ADOPTION_GATE,
  EN_E03_ADOPTED_PUBLIC_REGISTRY,
} from './enemy-expansion-en-e03-adoption.js';
import {
  EN_E05_GHOUL_PUBLIC_GATE,
  PUBLIC_ENEMY_REPLACEMENT_ROUTES,
} from './enemy-expansion-en-e05-ghoul-public.js';
import { EN_E06_REGISTRATION_GATE } from './enemy-expansion-en-e06-public.js';
import {
  APPROVED_BACKLOG_V2_GATE,
  APPROVED_BACKLOG_V2_REGISTRY,
} from './enemy-expansion-approved-backlog-v2.js';
import {
  APPROVED_BACKLOG_V3_GATE,
  APPROVED_BACKLOG_V3_REGISTRY,
} from './enemy-expansion-approved-backlog-v3.js';
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
  EN_E03_ADOPTION_GATE,
  EN_E05_GHOUL_PUBLIC_GATE,
  EN_E06_REGISTRATION_GATE,
  APPROVED_BACKLOG_V2_GATE,
  APPROVED_BACKLOG_V3_GATE,
  PUBLIC_ENEMY_REPLACEMENT_ROUTES,
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

const ENEMY_EXPANSION_PRE_APPROVED_BACKLOG_REGISTRY = createEnemyExpansionRegistry({
  renderers: [
    ...ENEMY_EXPANSION_PRE_EN_E05_CONSUMER_REGISTRY.renderers,
    ...EN_E05_PUBLIC_REGISTRY.renderers,
  ],
  families: [
    ...ENEMY_EXPANSION_PRE_EN_E05_CONSUMER_REGISTRY.families,
    ...EN_E05_PUBLIC_REGISTRY.families,
  ],
});

// The approved backlog integrations append only complete, visually approved
// EN-E06 through EN-E11 suites plus the separately adopted EN-E03 suites.
// Incomplete candidates, prototypes, bosses, and effects remain outside this
// stable consumer boundary.
export const ENEMY_EXPANSION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [
    ...ENEMY_EXPANSION_PRE_APPROVED_BACKLOG_REGISTRY.renderers,
    ...APPROVED_BACKLOG_V2_REGISTRY.renderers,
    ...APPROVED_BACKLOG_V3_REGISTRY.renderers,
    ...EN_E03_ADOPTED_PUBLIC_REGISTRY.renderers,
  ],
  families: [
    ...ENEMY_EXPANSION_PRE_APPROVED_BACKLOG_REGISTRY.families,
    ...APPROVED_BACKLOG_V2_REGISTRY.families,
    ...APPROVED_BACKLOG_V3_REGISTRY.families,
    ...EN_E03_ADOPTED_PUBLIC_REGISTRY.families,
  ],
});

// Registration and generic assembler exposure were authorized together for
// this completed backlog, so consumers reuse the exact stable object.
export const ENEMY_EXPANSION_CONSUMER_REGISTRY = ENEMY_EXPANSION_REGISTRY;

export function resolvePublicEnemyExpansionRoute(spec) {
  if (spec?.kind !== 'enemy') return null;
  const replacement = PUBLIC_ENEMY_REPLACEMENT_ROUTES.find(({ target }) => (
    target.family === spec.family && target.variant === spec.variant
  ));
  if (replacement) {
    return Object.freeze({
      registry: replacement.registry,
      spec: Object.freeze({ ...spec, family: replacement.source.family, variant: replacement.source.variant }),
      replacementGate: replacement.gate,
    });
  }
  if (!ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies.some(({ id }) => id === spec.family)) return null;
  return Object.freeze({ registry: ENEMY_EXPANSION_CONSUMER_REGISTRY, spec, replacementGate: null });
}

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
