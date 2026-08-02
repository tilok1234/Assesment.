import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

const commonScale = {
  cell: 24,
  class: 'standard-humanoid',
  footprint: 'one-cell-margin',
};

const commonLocomotion = {
  mode: 'bipedal',
  idle: 'Two-frame breathing weight shift on the shared humanoid anchors.',
  walk: 'Deferred until Idle approval; compact four-step humanoid gait.',
};

export const EN_E02_CONTRACT_CARDS = deepFreeze([
  {
    id: 'plague-doctor',
    name: 'Plague Doctor',
    sliceId: 'EN-E02',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Guarded coat stance with the beaked mask leading and the medicine hand kept readable.',
    },
    attackTell: {
      bodyCue: 'The coat shoulder closes inward before a precise underhand strike.',
      heldItemCue: 'The treatment knife or vial hand rises clear of the beak before release.',
      externalized: ['thrown vial', 'miasma cloud', 'disease motes'],
    },
    variantBriefs: [
      { role: 'common', id: 'field-chirurgeon', name: 'Field Chirurgeon', brief: 'Beaked field medic with a dark hood, long coat, and compact treatment blade.' },
      { role: 'specialist', id: 'leech-warden', name: 'Leech Warden', brief: 'Satchel-heavy controller whose leeches remain separate child or projectile assets.' },
      { role: 'elite', id: 'pestilent-magister', name: 'Pestilent Magister', brief: 'Ornate senior physician with a stronger mask silhouette and no baked miasma.' },
    ],
    externalEffects: ['thrown vial projectile', 'miasma cloud', 'disease motes'],
    externalMechanics: ['infection stacks', 'treatment or antidote state'],
    baseline: {
      variantId: 'field-chirurgeon',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'classic', skin: 'pale', hairStyle: 'bald', hairColor: 'black',
          expression: 'determined', faceDetail: 'none', headgear: 'hood',
          outfit: 'ranger', outfitColor: 'forest', outfitTier: 'tier1',
          weapon: 'dagger', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#d7bea3', '#9c755d'],
            hair: ['#2f3331', '#191c1b'],
            outfit: ['#455a47', '#27372d'],
          },
        },
        identity: {
          overlays: [{ id: 'plague-beak', colors: ['#455a47', '#252f2a', '#9ad7c7'] }],
        },
      },
    },
  },
  {
    id: 'desert-raider',
    name: 'Desert Raider',
    sliceId: 'EN-E02',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Forward-leaning wrapped skirmisher stance distinct from the square Bandit and loose Pirate reads.',
    },
    attackTell: {
      bodyCue: 'The lead foot plants while the wrapped shoulder opens into a fast diagonal cut.',
      heldItemCue: 'The curved-blade read comes from stance and sword arc without a baked sand trail.',
      externalized: ['sand burst', 'dust trail', 'thrown sand'],
    },
    variantBriefs: [
      { role: 'common', id: 'dune-reaver', name: 'Dune Reaver', brief: 'Wrapped sword raider with layered scarf tails and a low mobile stance.' },
      { role: 'specialist', id: 'sandbow-stalker', name: 'Sandbow Stalker', brief: 'Ranged ambusher whose arrow and dust wake remain separate effects.' },
      { role: 'elite', id: 'sunscar-captain', name: 'Sunscar Captain', brief: 'Heavier lamellar leader with a bright command sash and no baked heat shimmer.' },
    ],
    externalEffects: ['dust trail', 'sand burst', 'arrow projectile'],
    externalMechanics: ['ambush state', 'desert concealment'],
    baseline: {
      variantId: 'dune-reaver',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'lean', skin: 'tan', hairStyle: 'messy', hairColor: 'black',
          expression: 'determined', faceDetail: 'warpaint', headgear: 'bandana',
          outfit: 'ranger', outfitColor: 'umber', outfitTier: 'tier1',
          weapon: 'sword', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#c88c57', '#8d5938'],
            hair: ['#332b29', '#1d1817'],
            outfit: ['#b88955', '#745235'],
          },
        },
        identity: {
          overlays: [{ id: 'desert-wrap', colors: ['#caa46d', '#73563e', '#2e6f76'] }],
        },
      },
    },
  },
  {
    id: 'fanatic-monk',
    name: 'Fanatic Monk',
    sliceId: 'EN-E02',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Narrow planted stance with a shaved head, prayer beads, and disciplined staff spacing.',
    },
    attackTell: {
      bodyCue: 'The torso coils around the planted rear foot before the staff snaps forward.',
      heldItemCue: 'Staff angle and wrapped forearms carry the tell without a sacred flare.',
      externalized: ['sacred flare', 'bell wave', 'ash burst'],
    },
    variantBriefs: [
      { role: 'common', id: 'ash-disciple', name: 'Ash Disciple', brief: 'Shaved staff fighter with red robes, wrapped arms, and heavy prayer beads.' },
      { role: 'specialist', id: 'chain-penitent', name: 'Chain Penitent', brief: 'Self-bound zealot whose loose chain motion requires an authored attachment contract.' },
      { role: 'elite', id: 'bell-abbot', name: 'Bell Abbot', brief: 'Broad ceremonial leader whose bell wave remains a separate effect.' },
    ],
    externalEffects: ['sacred flare', 'bell wave', 'ash burst'],
    externalMechanics: ['devotion threshold', 'penitence chain state'],
    baseline: {
      variantId: 'ash-disciple',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'lean', skin: 'pale', hairStyle: 'bald', hairColor: 'black',
          expression: 'angry', faceDetail: 'warpaint', headgear: 'none',
          outfit: 'robe', outfitColor: 'crimson', outfitTier: 'tier1',
          weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#d8ad83', '#9c6f50'],
            hair: ['#302728', '#1a1516'],
            outfit: ['#8f343b', '#56232a'],
          },
        },
        identity: {
          overlays: [
            { id: 'monk-beads', colors: ['#b88a42', '#5b3327', '#d7c2a0'] },
            { id: 'plain-quarterstaff', colors: ['#8b5a37', '#4f3424', '#d7c2a0'] },
          ],
        },
      },
    },
  },
  {
    id: 'catfolk',
    name: 'Catfolk',
    sliceId: 'EN-E02',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Light digitigrade-inspired stance with upright ears and a tail counterbalancing the weapon side.',
    },
    attackTell: {
      bodyCue: 'The tail lifts as the shoulders compress into a short pounce-like step.',
      heldItemCue: 'The dagger hand stays outside the muzzle and ear silhouette before the lunge.',
      externalized: ['claw trail', 'pounce dust', 'moon glint'],
    },
    variantBriefs: [
      { role: 'common', id: 'alley-prowler', name: 'Alley Prowler', brief: 'Tawny dagger scout with upright ears, visible tail, and compact paw-shaped feet.' },
      { role: 'specialist', id: 'moonclaw-duelist', name: 'Moonclaw Duelist', brief: 'Fine-coated blade specialist with a longer balanced tail and no baked slash trail.' },
      { role: 'elite', id: 'pride-champion', name: 'Pride Champion', brief: 'Broader mane-framed champion with a commanding feline silhouette.' },
    ],
    externalEffects: ['claw trail', 'pounce dust', 'moon glint'],
    externalMechanics: ['pounce state', 'feline balance or evasion'],
    baseline: {
      variantId: 'alley-prowler',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'lean', skin: 'brown', hairStyle: 'short', hairColor: 'black',
          expression: 'determined', faceDetail: 'none', headgear: 'none',
          outfit: 'leather', outfitColor: 'teal', outfitTier: 'tier1',
          weapon: 'dagger', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#c8874b', '#784830'],
            hair: ['#3a302d', '#211b19'],
            outfit: ['#326f72', '#21464d'],
          },
        },
        identity: {
          overlays: [{ id: 'catfolk-traits', colors: ['#c8874b', '#784830', '#e3b078'] }],
        },
      },
    },
  },
  {
    id: 'goatfolk',
    name: 'Goatfolk',
    sliceId: 'EN-E02',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Sturdy high-shouldered stance with paired horns, side ears, and compact cloven-hoof contacts.',
    },
    attackTell: {
      bodyCue: 'The head lowers behind the horn line as the rear leg loads for a driving step.',
      heldItemCue: 'The spear shifts aside so the horn-led body cue remains readable.',
      externalized: ['impact dust', 'horn shock ring', 'seer motes'],
    },
    variantBriefs: [
      { role: 'common', id: 'crag-skirmisher', name: 'Crag Skirmisher', brief: 'Hill spear fighter with swept horns, side ears, and dark cloven hooves.' },
      { role: 'specialist', id: 'horn-seer', name: 'Horn-Seer', brief: 'Robed diviner with decorated horns whose motes remain separate effects.' },
      { role: 'elite', id: 'ramguard-chieftain', name: 'Ramguard Chieftain', brief: 'Heavy horned leader with a broad shoulder and shield-ready silhouette.' },
    ],
    externalEffects: ['impact dust', 'horn shock ring', 'seer motes'],
    externalMechanics: ['charge state', 'horn-seer omen state'],
    baseline: {
      variantId: 'crag-skirmisher',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'sturdy', skin: 'tan', hairStyle: 'messy', hairColor: 'white',
          expression: 'determined', faceDetail: 'warpaint', headgear: 'none',
          outfit: 'barbarian', outfitColor: 'forest', outfitTier: 'tier1',
          weapon: 'spear', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#d0b28a', '#8a684a'],
            hair: ['#ded4bf', '#a49379'],
            outfit: ['#496d3d', '#2b4528'],
          },
        },
        identity: {
          overlays: [{ id: 'goatfolk-traits', colors: ['#d0b28a', '#7a5837', '#e8d1b0'] }],
        },
      },
    },
  },
]);

export const EN_E02_IDLE_GATE = deepFreeze({
  status: 'approved',
  authorizedOn: '2026-08-02',
  approvedOn: '2026-08-02',
  artifact: 'enemy-expansion-review/en-e02/en-e02-idle-review.png',
  artifactSha256: 'c224258139c7c810c7a122ea9e95061f3dd1697864913765fe9d11e09f4eca50',
  candidateFrameDigest: '00d71d7e8f1904c275bfe84ec6cec746fb314fab4d27ce182d72e286a846d02b',
  scope: 'Five approved common baselines, four directions, and two Idle frames only.',
  nextGate: 'Explicit authorization for full three-variant animation production before any implementation beyond Idle.',
});

function baselineFamily(card) {
  const baselineBrief = card.variantBriefs.find((variant) => variant.id === card.baseline.variantId);
  return {
    id: card.id,
    name: card.name,
    sliceId: card.sliceId,
    rendererKey: EN_E01_HUMANOID_RENDERER.key,
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
      notes: 'Unapproved four-direction common-baseline Idle candidate.',
    },
  };
}

export const EN_E02_IDLE_FAMILIES = deepFreeze(EN_E02_CONTRACT_CARDS.map(baselineFamily));

export const EN_E02_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E01_HUMANOID_RENDERER],
  families: EN_E02_IDLE_FAMILIES,
});
