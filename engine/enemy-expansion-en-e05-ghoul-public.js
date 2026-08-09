import { EN_E05_GHOUL_REPLACEMENT_REGISTRY } from './enemy-expansion-en-e05.js';

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E05_GHOUL_PUBLIC_GATE = deepFreeze({
  id: 'en-e05-ghoul-public-replacement-v1',
  status: 'authorized',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After reviewing the completed Ghoul replacement as a separate assembler decision, the designer said: sure lets go ahead and add them in as you reccomend.',
  source: { family: 'ghoul-upgrade', variant: 'ghoul' },
  target: { family: 'zombie', variant: 'ghoul' },
  scope: 'Route the exact approved Ghoul upgrade through the existing public zombie/ghoul selector without adding a duplicate family or changing any other Zombie variant.',
  exclusions: ['fixture generation or regeneration', 'zombie/shambler', 'zombie/rotter', 'zombie/brute', 'reviewed pixel changes', 'effects', 'release'],
});

export const PUBLIC_ENEMY_REPLACEMENT_ROUTES = deepFreeze([
  {
    gate: EN_E05_GHOUL_PUBLIC_GATE.id,
    source: EN_E05_GHOUL_PUBLIC_GATE.source,
    target: EN_E05_GHOUL_PUBLIC_GATE.target,
    registry: EN_E05_GHOUL_REPLACEMENT_REGISTRY,
  },
]);
