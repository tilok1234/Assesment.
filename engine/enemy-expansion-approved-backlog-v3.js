import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E10_DUNEBACK_SCAVENGER_FAMILY, EN_E10_DUNEBACK_SCAVENGER_GATE, EN_E10_DUNEBACK_SCAVENGER_RENDERER } from './enemy-expansion-en-e10-hyena-duneback-scavenger.js';
import { EN_E10_GLOAMSTRIPE_AMBUSHER_FAMILY, EN_E10_GLOAMSTRIPE_AMBUSHER_GATE, EN_E10_GLOAMSTRIPE_AMBUSHER_RENDERER } from './enemy-expansion-en-e10-hyena-gloamstripe-ambusher.js';
import { EN_E10_SCARCREST_MATRIARCH_FAMILY, EN_E10_SCARCREST_MATRIARCH_GATE, EN_E10_SCARCREST_MATRIARCH_RENDERER } from './enemy-expansion-en-e10-hyena-scarcrest-matriarch.js';
import { EN_E10_TUNDRAHIDE_GRAZER_FAMILY, EN_E10_TUNDRAHIDE_GRAZER_GATE, EN_E10_TUNDRAHIDE_GRAZER_RENDERER } from './enemy-expansion-en-e10-mammoth-tundrahide-grazer.js';
import { EN_E10_FROSTVEIN_WAYFINDER_FAMILY, EN_E10_FROSTVEIN_WAYFINDER_GATE, EN_E10_FROSTVEIN_WAYFINDER_RENDERER } from './enemy-expansion-en-e10-mammoth-frostvein-wayfinder.js';
import { EN_E10_RIMEVAULT_MATRIARCH_FAMILY, EN_E10_RIMEVAULT_MATRIARCH_GATE, EN_E10_RIMEVAULT_MATRIARCH_RENDERER } from './enemy-expansion-en-e10-mammoth-rimevault-matriarch.js';
import { EN_E10_STONECURL_GRAZER_FAMILY, EN_E10_STONECURL_GRAZER_GATE, EN_E10_STONECURL_GRAZER_RENDERER } from './enemy-expansion-en-e10-ram-stonecurl-grazer.js';
import { EN_E10_CLIFFCOIL_STRIDER_FAMILY, EN_E10_CLIFFCOIL_STRIDER_GATE, EN_E10_CLIFFCOIL_STRIDER_RENDERER } from './enemy-expansion-en-e10-ram-cliffcoil-strider.js';
import { EN_E10_CRAGCROWN_PATRIARCH_FAMILY, EN_E10_CRAGCROWN_PATRIARCH_GATE, EN_E10_CRAGCROWN_PATRIARCH_RENDERER } from './enemy-expansion-en-e10-ram-cragcrown-patriarch.js';
import { EN_E10_MUDPLATE_GRAZER_FAMILY, EN_E10_MUDPLATE_GRAZER_GATE, EN_E10_MUDPLATE_GRAZER_RENDERER } from './enemy-expansion-en-e10-rhino-mudplate-grazer.js';
import { EN_E10_REEDCREST_SKIRMISHER_FAMILY, EN_E10_REEDCREST_SKIRMISHER_GATE, EN_E10_REEDCREST_SKIRMISHER_RENDERER } from './enemy-expansion-en-e10-rhino-reedcrest-skirmisher.js';
import { EN_E10_STONEFERN_BASTION_FAMILY, EN_E10_STONEFERN_BASTION_GATE, EN_E10_STONEFERN_BASTION_RENDERER } from './enemy-expansion-en-e10-rhino-stonefern-bastion.js';
import { EN_E10_MOSSRACK_FORAGER_FAMILY, EN_E10_MOSSRACK_FORAGER_GATE, EN_E10_MOSSRACK_FORAGER_RENDERER } from './enemy-expansion-en-e10-stag-mossrack-forager.js';
import { EN_E10_BRIARSTEP_HARRIER_FAMILY, EN_E10_BRIARSTEP_HARRIER_GATE, EN_E10_BRIARSTEP_HARRIER_RENDERER } from './enemy-expansion-en-e10-stag-briarstep-harrier.js';
import { EN_E10_GLOAMCROWN_SOVEREIGN_FAMILY, EN_E10_GLOAMCROWN_SOVEREIGN_GATE, EN_E10_GLOAMCROWN_SOVEREIGN_RENDERER } from './enemy-expansion-en-e10-stag-gloamcrown-sovereign.js';
import { EN_E11_PEACOCK_RAINFAN_FORAGER_FAMILY, EN_E11_PEACOCK_RAINFAN_FORAGER_GATE, EN_E11_PEACOCK_RAINFAN_FORAGER_RENDERER } from './enemy-expansion-en-e11-peacock-rainfan-forager.js';
import { EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_FAMILY, EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE, EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_RENDERER } from './enemy-expansion-en-e11-peacock-mirrorfan-ambusher.js';
import { EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_FAMILY, EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE, EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_RENDERER } from './enemy-expansion-en-e11-peacock-crownveil-sovereign.js';
import { EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_FAMILY, EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE, EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_RENDERER } from './enemy-expansion-en-e11-cockatrice-bramblecomb-scratcher.js';
import { EN_E11_COCKATRICE_GLOAMGAZE_STALKER_FAMILY, EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE, EN_E11_COCKATRICE_GLOAMGAZE_STALKER_RENDERER } from './enemy-expansion-en-e11-cockatrice-gloamgaze-stalker.js';
import { EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_FAMILY, EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE, EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_RENDERER } from './enemy-expansion-en-e11-cockatrice-crowncoil-basilarch.js';
import { EN_E11_RAVEN_CINDERQUILL_SCAVENGER_FAMILY, EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE, EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER } from './enemy-expansion-en-e11-raven-cinderquill-scavenger.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

function sourceVariant(sourceFamily) {
  assert(sourceFamily.variants.length === 1, `${sourceFamily.id} source must own one variant.`);
  return { ...sourceFamily.variants[0] };
}

function dispatcher(key, chassis, entries) {
  const variants = Object.fromEntries(entries.map(({ family, renderer }) => [sourceVariant(family).id, renderer]));
  return Object.freeze({
    key,
    chassis,
    render(args) {
      const renderer = variants[args.variant.id];
      assert(renderer, `${key} does not own ${args.family.id}/${args.variant.id}.`);
      return renderer.render(args);
    },
  });
}

function family(id, name, sliceId, renderer, entries) {
  return deepFreeze({
    id,
    name,
    sliceId,
    state: ENEMY_EXPANSION_STATES.APPROVED,
    chassis: renderer.chassis,
    rendererKey: renderer.key,
    variants: entries.map(({ family: source }) => sourceVariant(source)),
    rendererData: { registrationGate: APPROVED_BACKLOG_V3_GATE_ID },
    review: {
      baselineVariant: sourceVariant(entries[0].family).id,
      scale: 8,
      notes: 'Exact approved EN-E10/EN-E11 suites exposed with source-pixel parity; outline enrollment and fixture generation remain separate.',
    },
  });
}

const APPROVED_BACKLOG_V3_GATE_ID = 'approved-enemy-assembler-integration-v3';
export const APPROVED_BACKLOG_V3_GATE = deepFreeze({
  id: APPROVED_BACKLOG_V3_GATE_ID,
  status: 'authorized',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'After the live assembler audit identified exactly 22 approved private full suites across EN-E10 and EN-E11, the designer asked to update the current assembler and also make the .bat launch the current one as well as the .exe. This authorizes content-only registration of those exact 22 suites plus a current local launcher and standalone executable. It does not authorize source-pixel edits, outline enrollment, fixture generation or regeneration, effects, incomplete Raven roles, later Bird families, release, accepted drift, or a pull request.',
  baseCheckpoint: 'a56211531caaa55be96979af2f53aafaa08c1067',
  expectedPublicFamilies: 100,
  expectedPublicVariants: 316,
  integratedFamilies: 8,
  integratedVariants: 22,
  scope: 'Expose exactly 22 complete visually approved EN-E10 and EN-E11 private variants through generic assembler consumers while preserving every approved source pixel and all 232 existing fixture sheets.',
  exclusions: ['source pixel changes', 'outline enrollment', 'fixture generation or regeneration', 'accepted drift', 'effects', 'child assets', 'incomplete Raven roles', 'Owl', 'Phoenix', 'release', 'pull request'],
});

const hyenaEntries = [
  { family: EN_E10_DUNEBACK_SCAVENGER_FAMILY, renderer: EN_E10_DUNEBACK_SCAVENGER_RENDERER },
  { family: EN_E10_GLOAMSTRIPE_AMBUSHER_FAMILY, renderer: EN_E10_GLOAMSTRIPE_AMBUSHER_RENDERER },
  { family: EN_E10_SCARCREST_MATRIARCH_FAMILY, renderer: EN_E10_SCARCREST_MATRIARCH_RENDERER },
];
const mammothEntries = [
  { family: EN_E10_TUNDRAHIDE_GRAZER_FAMILY, renderer: EN_E10_TUNDRAHIDE_GRAZER_RENDERER },
  { family: EN_E10_FROSTVEIN_WAYFINDER_FAMILY, renderer: EN_E10_FROSTVEIN_WAYFINDER_RENDERER },
  { family: EN_E10_RIMEVAULT_MATRIARCH_FAMILY, renderer: EN_E10_RIMEVAULT_MATRIARCH_RENDERER },
];
const ramEntries = [
  { family: EN_E10_STONECURL_GRAZER_FAMILY, renderer: EN_E10_STONECURL_GRAZER_RENDERER },
  { family: EN_E10_CLIFFCOIL_STRIDER_FAMILY, renderer: EN_E10_CLIFFCOIL_STRIDER_RENDERER },
  { family: EN_E10_CRAGCROWN_PATRIARCH_FAMILY, renderer: EN_E10_CRAGCROWN_PATRIARCH_RENDERER },
];
const rhinoEntries = [
  { family: EN_E10_MUDPLATE_GRAZER_FAMILY, renderer: EN_E10_MUDPLATE_GRAZER_RENDERER },
  { family: EN_E10_REEDCREST_SKIRMISHER_FAMILY, renderer: EN_E10_REEDCREST_SKIRMISHER_RENDERER },
  { family: EN_E10_STONEFERN_BASTION_FAMILY, renderer: EN_E10_STONEFERN_BASTION_RENDERER },
];
const stagEntries = [
  { family: EN_E10_MOSSRACK_FORAGER_FAMILY, renderer: EN_E10_MOSSRACK_FORAGER_RENDERER },
  { family: EN_E10_BRIARSTEP_HARRIER_FAMILY, renderer: EN_E10_BRIARSTEP_HARRIER_RENDERER },
  { family: EN_E10_GLOAMCROWN_SOVEREIGN_FAMILY, renderer: EN_E10_GLOAMCROWN_SOVEREIGN_RENDERER },
];
const peacockEntries = [
  { family: EN_E11_PEACOCK_RAINFAN_FORAGER_FAMILY, renderer: EN_E11_PEACOCK_RAINFAN_FORAGER_RENDERER },
  { family: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_FAMILY, renderer: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_RENDERER },
  { family: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_FAMILY, renderer: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_RENDERER },
];
const cockatriceEntries = [
  { family: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_FAMILY, renderer: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_RENDERER },
  { family: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_FAMILY, renderer: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_RENDERER },
  { family: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_FAMILY, renderer: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_RENDERER },
];
const ravenEntries = [
  { family: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_FAMILY, renderer: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER },
];

const sourceGroups = [hyenaEntries, mammothEntries, ramEntries, rhinoEntries, stagEntries, peacockEntries, cockatriceEntries, ravenEntries];
const renderers = [
  dispatcher('approved-v3-hyena', EN_E10_DUNEBACK_SCAVENGER_RENDERER.chassis, hyenaEntries),
  dispatcher('approved-v3-mammoth', EN_E10_TUNDRAHIDE_GRAZER_RENDERER.chassis, mammothEntries),
  dispatcher('approved-v3-ram', EN_E10_STONECURL_GRAZER_RENDERER.chassis, ramEntries),
  dispatcher('approved-v3-rhino', EN_E10_MUDPLATE_GRAZER_RENDERER.chassis, rhinoEntries),
  dispatcher('approved-v3-stag', EN_E10_MOSSRACK_FORAGER_RENDERER.chassis, stagEntries),
  dispatcher('approved-v3-peacock', EN_E11_PEACOCK_RAINFAN_FORAGER_RENDERER.chassis, peacockEntries),
  dispatcher('approved-v3-cockatrice', EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_RENDERER.chassis, cockatriceEntries),
  dispatcher('approved-v3-raven', EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER.chassis, ravenEntries),
];
const families = [
  family('hyena', 'Hyena', 'EN-E10', renderers[0], hyenaEntries),
  family('mammoth', 'Mammoth', 'EN-E10', renderers[1], mammothEntries),
  family('ram', 'Ram', 'EN-E10', renderers[2], ramEntries),
  family('rhino', 'Rhino', 'EN-E10', renderers[3], rhinoEntries),
  family('stag', 'Stag', 'EN-E10', renderers[4], stagEntries),
  family('peacock', 'Peacock', 'EN-E11', renderers[5], peacockEntries),
  family('cockatrice', 'Cockatrice', 'EN-E11', renderers[6], cockatriceEntries),
  family('raven', 'Raven', 'EN-E11', renderers[7], ravenEntries),
];

export const APPROVED_BACKLOG_V3_SOURCE_GATES = deepFreeze([
  EN_E10_DUNEBACK_SCAVENGER_GATE,
  EN_E10_GLOAMSTRIPE_AMBUSHER_GATE,
  EN_E10_SCARCREST_MATRIARCH_GATE,
  EN_E10_TUNDRAHIDE_GRAZER_GATE,
  EN_E10_FROSTVEIN_WAYFINDER_GATE,
  EN_E10_RIMEVAULT_MATRIARCH_GATE,
  EN_E10_STONECURL_GRAZER_GATE,
  EN_E10_CLIFFCOIL_STRIDER_GATE,
  EN_E10_CRAGCROWN_PATRIARCH_GATE,
  EN_E10_MUDPLATE_GRAZER_GATE,
  EN_E10_REEDCREST_SKIRMISHER_GATE,
  EN_E10_STONEFERN_BASTION_GATE,
  EN_E10_MOSSRACK_FORAGER_GATE,
  EN_E10_BRIARSTEP_HARRIER_GATE,
  EN_E10_GLOAMCROWN_SOVEREIGN_GATE,
  EN_E11_PEACOCK_RAINFAN_FORAGER_GATE,
  EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE,
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE,
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE,
  EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE,
  EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE,
]);

export const APPROVED_BACKLOG_V3_SOURCE_ENTRIES = deepFreeze(sourceGroups
  .flat()
  .map(({ family: sourceFamily, renderer }) => ({
    family: sourceFamily.id,
    variant: sourceVariant(sourceFamily).id,
    registry: createEnemyExpansionRegistry({ renderers: [renderer], families: [sourceFamily] }),
  })));

export const APPROVED_BACKLOG_V3_REGISTRY = createEnemyExpansionRegistry({ renderers, families });
