import { PUBLIC_ENEMIES } from './enemy-expansion-public.js';
import { buildWildshotGamePackManifest as buildCatalogGamePackManifest } from './game-pack.js';

// Keep the schema/policy module catalog-injectable and renderer-free while the
// stable application facade opts approved expansion families into consumers.
export function buildWildshotGamePackManifest(options) {
  return buildCatalogGamePackManifest(options, { enemyFamilies: PUBLIC_ENEMIES });
}
