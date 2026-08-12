import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E06_PUBLIC_REGISTRY } from './enemy-expansion-en-e06-public.js';
import { EN_E06_GROVE_TENDER_FAMILY, EN_E06_GROVE_TENDER_RENDERER } from './enemy-expansion-en-e06-dryad-grove-tender.js';
import { EN_E06_SPORE_CANTOR_FAMILY, EN_E06_SPORE_CANTOR_RENDERER } from './enemy-expansion-en-e06-dryad-spore-cantor.js';
import { EN_E06_HEARTWOOD_WARDEN_FAMILY, EN_E06_HEARTWOOD_WARDEN_GATE, EN_E06_HEARTWOOD_WARDEN_RENDERER } from './enemy-expansion-en-e06-dryad-heartwood-warden.js';
import { EN_E06_BARROW_STALKER_FAMILY, EN_E06_BARROW_STALKER_GATE, EN_E06_BARROW_STALKER_RENDERER } from './enemy-expansion-en-e06-redcap-barrow-stalker.js';
import { EN_E06_IRONBOOT_TRAPPER_FAMILY, EN_E06_IRONBOOT_TRAPPER_GATE, EN_E06_IRONBOOT_TRAPPER_RENDERER } from './enemy-expansion-en-e06-redcap-ironboot-trapper.js';
import { EN_E06_BLOODCAP_REAVER_FAMILY, EN_E06_BLOODCAP_REAVER_GATE, EN_E06_BLOODCAP_REAVER_RENDERER } from './enemy-expansion-en-e06-redcap-bloodcap-reaver.js';
import { EN_E06_SPRING_DANCER_FAMILY, EN_E06_SPRING_DANCER_GATE, EN_E06_SPRING_DANCER_RENDERER } from './enemy-expansion-en-e06-nymph-spring-dancer.js';
import { EN_E06_MIST_WEAVER_FAMILY, EN_E06_MIST_WEAVER_GATE, EN_E06_MIST_WEAVER_RENDERER } from './enemy-expansion-en-e06-nymph-mist-weaver.js';
import { EN_E06_RIVERCROWN_MUSE_FAMILY, EN_E06_RIVERCROWN_MUSE_GATE, EN_E06_RIVERCROWN_MUSE_RENDERER } from './enemy-expansion-en-e06-nymph-rivercrown-muse.js';
import { EN_E07_GLOAM_WALKER_FAMILY, EN_E07_GLOAM_WALKER_GATE, EN_E07_GLOAM_WALKER_RENDERER } from './enemy-expansion-en-e07-living-shadow-gloam-walker.js';
import { EN_E07_NIGHTGLASS_SEER_FAMILY, EN_E07_NIGHTGLASS_SEER_GATE, EN_E07_NIGHTGLASS_SEER_RENDERER } from './enemy-expansion-en-e07-living-shadow-nightglass-seer.js';
import { EN_E07_HOLLOWCROWN_REGENT_FAMILY, EN_E07_HOLLOWCROWN_REGENT_GATE, EN_E07_HOLLOWCROWN_REGENT_RENDERER } from './enemy-expansion-en-e07-living-shadow-hollowcrown-regent.js';
import { EN_E07_PALE_ECHO_FAMILY, EN_E07_PALE_ECHO_GATE, EN_E07_PALE_ECHO_RENDERER } from './enemy-expansion-en-e07-doppelganger-pale-echo.js';
import { EN_E07_FALSEFACE_ADEPT_FAMILY, EN_E07_FALSEFACE_ADEPT_GATE, EN_E07_FALSEFACE_ADEPT_RENDERER } from './enemy-expansion-en-e07-doppelganger-falseface-adept.js';
import { EN_E07_GRAND_PRETENDER_FAMILY, EN_E07_GRAND_PRETENDER_GATE, EN_E07_GRAND_PRETENDER_RENDERER } from './enemy-expansion-en-e07-doppelganger-grand-pretender.js';
import { EN_E07_LANTERN_MOTE_FAMILY, EN_E07_LANTERN_MOTE_GATE, EN_E07_LANTERN_MOTE_RENDERER } from './enemy-expansion-en-e07-will-o-wisp-lantern-mote.js';
import { EN_E07_FENBELL_SHEPHERD_FAMILY, EN_E07_FENBELL_SHEPHERD_GATE, EN_E07_FENBELL_SHEPHERD_RENDERER } from './enemy-expansion-en-e07-will-o-wisp-fenbell-shepherd.js';
import { EN_E07_MIRECROWN_BEACON_FAMILY, EN_E07_MIRECROWN_BEACON_GATE, EN_E07_MIRECROWN_BEACON_RENDERER } from './enemy-expansion-en-e07-will-o-wisp-mirecrown-beacon.js';
import { EN_E07_VEILSKIN_FOUNDLING_FAMILY, EN_E07_VEILSKIN_FOUNDLING_GATE, EN_E07_VEILSKIN_FOUNDLING_RENDERER } from './enemy-expansion-en-e07-changeling-veilskin-foundling.js';
import { EN_E07_MIRRORFOLD_HARRIER_FAMILY, EN_E07_MIRRORFOLD_HARRIER_GATE, EN_E07_MIRRORFOLD_HARRIER_RENDERER } from './enemy-expansion-en-e07-changeling-mirrorfold-harrier.js';
import { EN_E07_MANYFOLD_USURPER_FAMILY, EN_E07_MANYFOLD_USURPER_GATE, EN_E07_MANYFOLD_USURPER_RENDERER } from './enemy-expansion-en-e07-changeling-manyfold-usurper.js';
import { EN_E07_MIREMANE_COURSER_FAMILY, EN_E07_MIREMANE_COURSER_GATE, EN_E07_MIREMANE_COURSER_RENDERER } from './enemy-expansion-en-e07-kelpie-miremane-courser.js';
import { EN_E07_DROWNBRIDLE_STALKER_FAMILY, EN_E07_DROWNBRIDLE_STALKER_GATE, EN_E07_DROWNBRIDLE_STALKER_RENDERER } from './enemy-expansion-en-e07-kelpie-drownbridle-stalker.js';
import { EN_E07_BLACKWAKE_DREADMARE_FAMILY, EN_E07_BLACKWAKE_DREADMARE_GATE, EN_E07_BLACKWAKE_DREADMARE_RENDERER } from './enemy-expansion-en-e07-kelpie-blackwake-dreadmare.js';
import { EN_E08_HOLLOW_SENTRY_FAMILY, EN_E08_HOLLOW_SENTRY_GATE, EN_E08_HOLLOW_SENTRY_RENDERER } from './enemy-expansion-en-e08-animated-armor-hollow-sentry.js';
import { EN_E08_RUNEFORGE_CUSTODIAN_FAMILY, EN_E08_RUNEFORGE_CUSTODIAN_GATE, EN_E08_RUNEFORGE_CUSTODIAN_RENDERER } from './enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';
import { EN_E08_CROWNVAULT_CASTELLAN_FAMILY, EN_E08_CROWNVAULT_CASTELLAN_GATE, EN_E08_CROWNVAULT_CASTELLAN_RENDERER } from './enemy-expansion-en-e08-animated-armor-crownvault-castellan.js';
import { EN_E08_WHISPERVEIL_VISAGE_FAMILY, EN_E08_WHISPERVEIL_VISAGE_GATE, EN_E08_WHISPERVEIL_VISAGE_RENDERER } from './enemy-expansion-en-e08-possessed-mask-whisperveil-visage.js';
import { EN_E08_MOURNSEAL_CANTOR_FAMILY, EN_E08_MOURNSEAL_CANTOR_GATE, EN_E08_MOURNSEAL_CANTOR_RENDERER } from './enemy-expansion-en-e08-possessed-mask-mournseal-cantor.js';
import { EN_E08_THRENECROWN_HIEROPHANT_FAMILY, EN_E08_THRENECROWN_HIEROPHANT_GATE, EN_E08_THRENECROWN_HIEROPHANT_RENDERER } from './enemy-expansion-en-e08-possessed-mask-threnecrown-hierophant.js';
import { EN_E08_OATHBITE_CLEAVER_FAMILY, EN_E08_OATHBITE_CLEAVER_GATE, EN_E08_OATHBITE_CLEAVER_RENDERER } from './enemy-expansion-en-e08-living-weapon-oathbite-cleaver.js';
import { EN_E08_VOWCOIL_GLAIVE_FAMILY, EN_E08_VOWCOIL_GLAIVE_GATE, EN_E08_VOWCOIL_GLAIVE_RENDERER } from './enemy-expansion-en-e08-living-weapon-vowcoil-glaive.js';
import { EN_E08_CROWNMAW_GREATBLADE_FAMILY, EN_E08_CROWNMAW_GREATBLADE_GATE, EN_E08_CROWNMAW_GREATBLADE_RENDERER } from './enemy-expansion-en-e08-living-weapon-crownmaw-greatblade.js';
import { EN_E09_BRASSCOIL_SENTRY_FAMILY, EN_E09_BRASSCOIL_SENTRY_GATE, EN_E09_BRASSCOIL_SENTRY_RENDERER } from './enemy-expansion-en-e09-clockwork-automaton-brasscoil-sentry.js';
import { EN_E09_AETHERDIAL_SURVEYOR_FAMILY, EN_E09_AETHERDIAL_SURVEYOR_GATE, EN_E09_AETHERDIAL_SURVEYOR_RENDERER } from './enemy-expansion-en-e09-clockwork-automaton-aetherdial-surveyor.js';
import { EN_E09_EPOCHFORGE_COLOSSUS_FAMILY, EN_E09_EPOCHFORGE_COLOSSUS_GATE, EN_E09_EPOCHFORGE_COLOSSUS_RENDERER } from './enemy-expansion-en-e09-clockwork-automaton-epochforge-colossus.js';
import { EN_E09_CLASPBOUND_PRIMER_FAMILY, EN_E09_CLASPBOUND_PRIMER_GATE, EN_E09_CLASPBOUND_PRIMER_RENDERER } from './enemy-expansion-en-e09-living-book-claspbound-primer.js';

function assert(condition, message) { if (!condition) throw new TypeError(message); }
function deepFreeze(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; Object.freeze(value); for (const entry of Object.values(value)) deepFreeze(entry); return value; }
function sourceVariant(family) { assert(family.variants.length === 1, `${family.id} source must own one variant.`); return { ...family.variants[0] }; }
function dispatcher(key, chassis, entries) {
  const variants = Object.fromEntries(entries.map(({ family, renderer }) => [sourceVariant(family).id, renderer]));
  return Object.freeze({ key, chassis, render(args) { const renderer = variants[args.variant.id]; assert(renderer, `${key} does not own ${args.family.id}/${args.variant.id}.`); return renderer.render(args); } });
}
function family(id, name, sliceId, renderer, entries) {
  return deepFreeze({ id, name, sliceId, state: ENEMY_EXPANSION_STATES.APPROVED, chassis: renderer.chassis, rendererKey: renderer.key, variants: entries.map(({ family: source }) => sourceVariant(source)), rendererData: { registrationGate: APPROVED_BACKLOG_V2_GATE_ID }, review: { baselineVariant: sourceVariant(entries[0].family).id, scale: 8, notes: 'Exact approved suites exposed with source-pixel parity.' } });
}

const APPROVED_BACKLOG_V2_GATE_ID = 'approved-enemy-assembler-integration-v2';
export const APPROVED_BACKLOG_V2_GATE = deepFreeze({
  id: APPROVED_BACKLOG_V2_GATE_ID, status: 'authorized', authorizedOn: '2026-08-12',
  authorizationEvidence: 'After Claspbound Primer was visually approved, the designer asked whether all approved sprites should be put into the assembler. The exact complete backlog was audited as 35 variants across later EN-E06, EN-E07, EN-E08, and EN-E09. The assistant recommended registering these exact suites without fixture regeneration, excluding incomplete candidates, Headless Rider prototypes, bosses, effects, and unapproved art. The designer replied: lets do it.',
  baseCheckpoint: '641d741f5e135a734fec5c0410b4a27ce87a136a',
  expectedPublicFamilies: 92, expectedPublicVariants: 294, integratedVariants: 35,
  scope: 'Expose exactly 35 complete visually approved private variants through generic assembler consumers while preserving every source pixel and the existing 232 fixture sheets.',
  exclusions: ['incomplete EN-E03 variants', 'Headless Rider prototypes', 'boss candidates', 'effects', 'fixture generation or regeneration', 'accepted drift', 'source pixel changes', 'release', 'pull request'],
});

const laterDryadEntries=[{family:EN_E06_HEARTWOOD_WARDEN_FAMILY,renderer:EN_E06_HEARTWOOD_WARDEN_RENDERER}];
const dryadEntries=[{family:EN_E06_GROVE_TENDER_FAMILY,renderer:EN_E06_GROVE_TENDER_RENDERER},{family:EN_E06_SPORE_CANTOR_FAMILY,renderer:EN_E06_SPORE_CANTOR_RENDERER},...laterDryadEntries];
const redcapEntries=[{family:EN_E06_BARROW_STALKER_FAMILY,renderer:EN_E06_BARROW_STALKER_RENDERER},{family:EN_E06_IRONBOOT_TRAPPER_FAMILY,renderer:EN_E06_IRONBOOT_TRAPPER_RENDERER},{family:EN_E06_BLOODCAP_REAVER_FAMILY,renderer:EN_E06_BLOODCAP_REAVER_RENDERER}];
const nymphEntries=[{family:EN_E06_SPRING_DANCER_FAMILY,renderer:EN_E06_SPRING_DANCER_RENDERER},{family:EN_E06_MIST_WEAVER_FAMILY,renderer:EN_E06_MIST_WEAVER_RENDERER},{family:EN_E06_RIVERCROWN_MUSE_FAMILY,renderer:EN_E06_RIVERCROWN_MUSE_RENDERER}];
const livingShadowEntries=[{family:EN_E07_GLOAM_WALKER_FAMILY,renderer:EN_E07_GLOAM_WALKER_RENDERER},{family:EN_E07_NIGHTGLASS_SEER_FAMILY,renderer:EN_E07_NIGHTGLASS_SEER_RENDERER},{family:EN_E07_HOLLOWCROWN_REGENT_FAMILY,renderer:EN_E07_HOLLOWCROWN_REGENT_RENDERER}];
const doppelgangerEntries=[{family:EN_E07_PALE_ECHO_FAMILY,renderer:EN_E07_PALE_ECHO_RENDERER},{family:EN_E07_FALSEFACE_ADEPT_FAMILY,renderer:EN_E07_FALSEFACE_ADEPT_RENDERER},{family:EN_E07_GRAND_PRETENDER_FAMILY,renderer:EN_E07_GRAND_PRETENDER_RENDERER}];
const wispEntries=[{family:EN_E07_LANTERN_MOTE_FAMILY,renderer:EN_E07_LANTERN_MOTE_RENDERER},{family:EN_E07_FENBELL_SHEPHERD_FAMILY,renderer:EN_E07_FENBELL_SHEPHERD_RENDERER},{family:EN_E07_MIRECROWN_BEACON_FAMILY,renderer:EN_E07_MIRECROWN_BEACON_RENDERER}];
const changelingEntries=[{family:EN_E07_VEILSKIN_FOUNDLING_FAMILY,renderer:EN_E07_VEILSKIN_FOUNDLING_RENDERER},{family:EN_E07_MIRRORFOLD_HARRIER_FAMILY,renderer:EN_E07_MIRRORFOLD_HARRIER_RENDERER},{family:EN_E07_MANYFOLD_USURPER_FAMILY,renderer:EN_E07_MANYFOLD_USURPER_RENDERER}];
const kelpieEntries=[{family:EN_E07_MIREMANE_COURSER_FAMILY,renderer:EN_E07_MIREMANE_COURSER_RENDERER},{family:EN_E07_DROWNBRIDLE_STALKER_FAMILY,renderer:EN_E07_DROWNBRIDLE_STALKER_RENDERER},{family:EN_E07_BLACKWAKE_DREADMARE_FAMILY,renderer:EN_E07_BLACKWAKE_DREADMARE_RENDERER}];
const armorEntries=[{family:EN_E08_HOLLOW_SENTRY_FAMILY,renderer:EN_E08_HOLLOW_SENTRY_RENDERER},{family:EN_E08_RUNEFORGE_CUSTODIAN_FAMILY,renderer:EN_E08_RUNEFORGE_CUSTODIAN_RENDERER},{family:EN_E08_CROWNVAULT_CASTELLAN_FAMILY,renderer:EN_E08_CROWNVAULT_CASTELLAN_RENDERER}];
const maskEntries=[{family:EN_E08_WHISPERVEIL_VISAGE_FAMILY,renderer:EN_E08_WHISPERVEIL_VISAGE_RENDERER},{family:EN_E08_MOURNSEAL_CANTOR_FAMILY,renderer:EN_E08_MOURNSEAL_CANTOR_RENDERER},{family:EN_E08_THRENECROWN_HIEROPHANT_FAMILY,renderer:EN_E08_THRENECROWN_HIEROPHANT_RENDERER}];
const weaponEntries=[{family:EN_E08_OATHBITE_CLEAVER_FAMILY,renderer:EN_E08_OATHBITE_CLEAVER_RENDERER},{family:EN_E08_VOWCOIL_GLAIVE_FAMILY,renderer:EN_E08_VOWCOIL_GLAIVE_RENDERER},{family:EN_E08_CROWNMAW_GREATBLADE_FAMILY,renderer:EN_E08_CROWNMAW_GREATBLADE_RENDERER}];
const automatonEntries=[{family:EN_E09_BRASSCOIL_SENTRY_FAMILY,renderer:EN_E09_BRASSCOIL_SENTRY_RENDERER},{family:EN_E09_AETHERDIAL_SURVEYOR_FAMILY,renderer:EN_E09_AETHERDIAL_SURVEYOR_RENDERER},{family:EN_E09_EPOCHFORGE_COLOSSUS_FAMILY,renderer:EN_E09_EPOCHFORGE_COLOSSUS_RENDERER}];
const bookEntries=[{family:EN_E09_CLASPBOUND_PRIMER_FAMILY,renderer:EN_E09_CLASPBOUND_PRIMER_RENDERER}];

const backlogRenderers=[
  dispatcher('approved-v2-dryad',EN_E06_GROVE_TENDER_RENDERER.chassis,dryadEntries),dispatcher('approved-v2-redcap',EN_E06_BARROW_STALKER_RENDERER.chassis,redcapEntries),dispatcher('approved-v2-nymph',EN_E06_SPRING_DANCER_RENDERER.chassis,nymphEntries),
  dispatcher('approved-v2-living-shadow',EN_E07_GLOAM_WALKER_RENDERER.chassis,livingShadowEntries),dispatcher('approved-v2-doppelganger',EN_E07_PALE_ECHO_RENDERER.chassis,doppelgangerEntries),dispatcher('approved-v2-will-o-wisp',EN_E07_LANTERN_MOTE_RENDERER.chassis,wispEntries),dispatcher('approved-v2-changeling',EN_E07_VEILSKIN_FOUNDLING_RENDERER.chassis,changelingEntries),dispatcher('approved-v2-kelpie',EN_E07_MIREMANE_COURSER_RENDERER.chassis,kelpieEntries),
  dispatcher('approved-v2-animated-armor',EN_E08_HOLLOW_SENTRY_RENDERER.chassis,armorEntries),dispatcher('approved-v2-possessed-mask',EN_E08_WHISPERVEIL_VISAGE_RENDERER.chassis,maskEntries),dispatcher('approved-v2-living-weapon',EN_E08_OATHBITE_CLEAVER_RENDERER.chassis,weaponEntries),dispatcher('approved-v2-clockwork-automaton',EN_E09_BRASSCOIL_SENTRY_RENDERER.chassis,automatonEntries),dispatcher('approved-v2-living-book',EN_E09_CLASPBOUND_PRIMER_RENDERER.chassis,bookEntries),
];
const preservedEnE06Families=EN_E06_PUBLIC_REGISTRY.families.filter(({id})=>id!=='dryad');
const preservedEnE06RendererKeys=new Set(preservedEnE06Families.map(({rendererKey})=>rendererKey));
const preservedEnE06Renderers=EN_E06_PUBLIC_REGISTRY.renderers.filter(({key})=>preservedEnE06RendererKeys.has(key));
const renderers=[...preservedEnE06Renderers,...backlogRenderers];
const families=[...preservedEnE06Families,family('dryad','Dryad','EN-E06',backlogRenderers[0],dryadEntries),family('redcap','Redcap','EN-E06',backlogRenderers[1],redcapEntries),family('nymph','Nymph','EN-E06',backlogRenderers[2],nymphEntries),family('living-shadow','Living Shadow','EN-E07',backlogRenderers[3],livingShadowEntries),family('doppelganger','Doppelganger','EN-E07',backlogRenderers[4],doppelgangerEntries),family('will-o-wisp','Will-o-Wisp','EN-E07',backlogRenderers[5],wispEntries),family('changeling','Changeling','EN-E07',backlogRenderers[6],changelingEntries),family('kelpie','Kelpie','EN-E07',backlogRenderers[7],kelpieEntries),family('animated-armor','Animated Armor','EN-E08',backlogRenderers[8],armorEntries),family('possessed-mask','Possessed Mask','EN-E08',backlogRenderers[9],maskEntries),family('living-weapon','Living Weapon','EN-E08',backlogRenderers[10],weaponEntries),family('clockwork-automaton','Clockwork Automaton','EN-E09',backlogRenderers[11],automatonEntries),family('living-book','Living Book','EN-E09',backlogRenderers[12],bookEntries)];

export const APPROVED_BACKLOG_V2_SOURCE_GATES=deepFreeze([EN_E06_HEARTWOOD_WARDEN_GATE,EN_E06_BARROW_STALKER_GATE,EN_E06_IRONBOOT_TRAPPER_GATE,EN_E06_BLOODCAP_REAVER_GATE,EN_E06_SPRING_DANCER_GATE,EN_E06_MIST_WEAVER_GATE,EN_E06_RIVERCROWN_MUSE_GATE,EN_E07_GLOAM_WALKER_GATE,EN_E07_NIGHTGLASS_SEER_GATE,EN_E07_HOLLOWCROWN_REGENT_GATE,EN_E07_PALE_ECHO_GATE,EN_E07_FALSEFACE_ADEPT_GATE,EN_E07_GRAND_PRETENDER_GATE,EN_E07_LANTERN_MOTE_GATE,EN_E07_FENBELL_SHEPHERD_GATE,EN_E07_MIRECROWN_BEACON_GATE,EN_E07_VEILSKIN_FOUNDLING_GATE,EN_E07_MIRRORFOLD_HARRIER_GATE,EN_E07_MANYFOLD_USURPER_GATE,EN_E07_MIREMANE_COURSER_GATE,EN_E07_DROWNBRIDLE_STALKER_GATE,EN_E07_BLACKWAKE_DREADMARE_GATE,EN_E08_HOLLOW_SENTRY_GATE,EN_E08_RUNEFORGE_CUSTODIAN_GATE,EN_E08_CROWNVAULT_CASTELLAN_GATE,EN_E08_WHISPERVEIL_VISAGE_GATE,EN_E08_MOURNSEAL_CANTOR_GATE,EN_E08_THRENECROWN_HIEROPHANT_GATE,EN_E08_OATHBITE_CLEAVER_GATE,EN_E08_VOWCOIL_GLAIVE_GATE,EN_E08_CROWNMAW_GREATBLADE_GATE,EN_E09_BRASSCOIL_SENTRY_GATE,EN_E09_AETHERDIAL_SURVEYOR_GATE,EN_E09_EPOCHFORGE_COLOSSUS_GATE,EN_E09_CLASPBOUND_PRIMER_GATE]);
export const APPROVED_BACKLOG_V2_SOURCE_ENTRIES=deepFreeze([...laterDryadEntries,...redcapEntries,...nymphEntries,...livingShadowEntries,...doppelgangerEntries,...wispEntries,...changelingEntries,...kelpieEntries,...armorEntries,...maskEntries,...weaponEntries,...automatonEntries,...bookEntries].map(({family,renderer})=>({family:family.id,variant:sourceVariant(family).id,registry:createEnemyExpansionRegistry({renderers:[renderer],families:[family]})})));
export const APPROVED_BACKLOG_V2_REGISTRY=createEnemyExpansionRegistry({renderers,families});
