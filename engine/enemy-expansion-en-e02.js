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
  walk: 'Compact four-step humanoid gait under the authorized standard motion contract.',
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
    additionalVariants: [
      {
        variantId: 'leech-warden',
        rendererData: {
          actor: {
            bodyBuild: 'sturdy', skin: 'tan', hairStyle: 'bald', hairColor: 'black',
            expression: 'determined', faceDetail: 'scar', headgear: 'hood',
            outfit: 'ranger', outfitColor: 'umber', outfitTier: 'tier2',
            weapon: 'dagger', weaponTier: 'tier2', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#c9976c', '#8f6248'],
              hair: ['#302d2a', '#191817'],
              outfit: ['#72543f', '#423329'],
            },
          },
          identity: {
            overlays: [
              { id: 'plague-beak', colors: ['#665746', '#2e2925', '#d4a55b'] },
              { id: 'plague-satchel', colors: ['#815a38', '#493221', '#b48756'] },
            ],
          },
        },
      },
      {
        variantId: 'pestilent-magister',
        rendererData: {
          actor: {
            bodyBuild: 'heroic', skin: 'pale', hairStyle: 'bald', hairColor: 'white',
            expression: 'angry', faceDetail: 'none', headgear: 'hood',
            outfit: 'robe', outfitColor: 'purple', outfitTier: 'tier2',
            weapon: 'staff', weaponTier: 'tier2', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#dcc2ad', '#9e7965'],
              hair: ['#ddd8cf', '#9d9a93'],
              outfit: ['#624078', '#352743'],
            },
          },
          identity: {
            overlays: [
              { id: 'plague-beak', colors: ['#503660', '#241c2b', '#8de0c2'] },
              { id: 'plague-mantle', colors: ['#5e3b73', '#292033', '#c49a4a'] },
            ],
          },
        },
      },
    ],
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
    additionalVariants: [
      {
        variantId: 'sandbow-stalker',
        rendererData: {
          actor: {
            bodyBuild: 'lean', skin: 'tan', hairStyle: 'messy', hairColor: 'black',
            expression: 'determined', faceDetail: 'warpaint', headgear: 'bandana',
            outfit: 'ranger', outfitColor: 'umber', outfitTier: 'tier2',
            weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#c98d57', '#8d5838'],
              hair: ['#302928', '#191615'],
              outfit: ['#8a6844', '#55422f'],
            },
          },
          identity: {
            overlays: [
              { id: 'desert-wrap', colors: ['#b99a68', '#684d37', '#3d7880'] },
              { id: 'desert-quiver', colors: ['#775034', '#3d2c21', '#d8b15e'] },
              { id: 'sandbow', colors: ['#8b5a34', '#4b3324', '#d7c7a1'] },
            ],
          },
        },
      },
      {
        variantId: 'sunscar-captain',
        rendererData: {
          actor: {
            bodyBuild: 'heroic', skin: 'brown', hairStyle: 'topknot', hairColor: 'brown',
            expression: 'angry', faceDetail: 'scar', headgear: 'bandana',
            outfit: 'cape', outfitColor: 'crimson', outfitTier: 'tier2',
            weapon: 'scimitar', weaponTier: 'tier2', shield: 'round', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#a96d43', '#70452c'],
              hair: ['#5a3824', '#302016'],
              outfit: ['#a94a35', '#653026'],
            },
          },
          identity: {
            overlays: [
              { id: 'desert-wrap', colors: ['#d3af63', '#70452f', '#a33c34'] },
              { id: 'sunscar-command', colors: ['#b43e36', '#6a2727', '#e2b65f'] },
            ],
          },
        },
      },
    ],
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
    additionalVariants: [
      {
        variantId: 'chain-penitent',
        rendererData: {
          actor: {
            bodyBuild: 'classic', skin: 'pale', hairStyle: 'bald', hairColor: 'black',
            expression: 'angry', faceDetail: 'scar', headgear: 'none',
            outfit: 'barbarian', outfitColor: 'charcoal', outfitTier: 'tier1',
            weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#c99f7d', '#8a624b'],
              hair: ['#2e2929', '#181515'],
              outfit: ['#5a5050', '#302b2c'],
            },
          },
          identity: {
            overlays: [
              { id: 'monk-beads', colors: ['#8d6537', '#412a22', '#b9a58a'] },
              { id: 'penitent-bindings', colors: ['#59606a', '#292e35', '#8e6b45'] },
            ],
          },
        },
      },
      {
        variantId: 'bell-abbot',
        rendererData: {
          actor: {
            bodyBuild: 'sturdy', skin: 'tan', hairStyle: 'bald', hairColor: 'white',
            expression: 'determined', faceDetail: 'beard', headgear: 'circlet',
            outfit: 'cleric', outfitColor: 'crimson', outfitTier: 'tier2',
            weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d1a177', '#93684d'],
              hair: ['#ddd8c8', '#9f9987'],
              outfit: ['#9d3f3d', '#5b292c'],
            },
          },
          identity: {
            overlays: [
              { id: 'monk-beads', colors: ['#d0a146', '#6b3f2c', '#e0c7a0'] },
              { id: 'bell-abbot-regalia', colors: ['#a33f3a', '#5b292d', '#d2a94e'] },
            ],
          },
        },
      },
    ],
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
    additionalVariants: [
      {
        variantId: 'moonclaw-duelist',
        rendererData: {
          actor: {
            bodyBuild: 'lean', skin: 'brown', hairStyle: 'short', hairColor: 'white',
            expression: 'determined', faceDetail: 'scar', headgear: 'none',
            outfit: 'cape', outfitColor: 'royal', outfitTier: 'tier1',
            weapon: 'rapier', weaponTier: 'tier2', shield: 'buckler', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#a59a92', '#615a58'],
              hair: ['#dddde2', '#9da2ad'],
              outfit: ['#3d5fa7', '#293b6b'],
            },
          },
          identity: {
            overlays: [
              { id: 'catfolk-traits', colors: ['#a59a92', '#615a58', '#d8c4c1'] },
              { id: 'moonclaw-tail', colors: ['#a59a92', '#615a58', '#6ea5d8'] },
            ],
          },
        },
      },
      {
        variantId: 'pride-champion',
        rendererData: {
          actor: {
            bodyBuild: 'heroic', skin: 'tan', hairStyle: 'afro', hairColor: 'ginger',
            expression: 'angry', faceDetail: 'warpaint', headgear: 'none',
            outfit: 'plate', outfitColor: 'umber', outfitTier: 'tier2',
            weapon: 'greatsword', weaponTier: 'tier2', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d09a58', '#875932'],
              hair: ['#b96a32', '#75401f'],
              outfit: ['#8a673f', '#51402d'],
            },
          },
          identity: {
            overlays: [
              { id: 'catfolk-traits', colors: ['#d09a58', '#875932', '#e2b36d'] },
              { id: 'pride-mane', colors: ['#9b562b', '#5b321f', '#d5a648'] },
            ],
          },
        },
      },
    ],
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
    additionalVariants: [
      {
        variantId: 'horn-seer',
        rendererData: {
          actor: {
            bodyBuild: 'classic', skin: 'tan', hairStyle: 'long', hairColor: 'white',
            expression: 'determined', faceDetail: 'warpaint', headgear: 'circlet',
            outfit: 'robe', outfitColor: 'purple', outfitTier: 'tier2',
            weapon: 'staff', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d1b491', '#8b6c50'],
              hair: ['#ded8c8', '#a59a83'],
              outfit: ['#76528d', '#49345b'],
            },
          },
          identity: {
            overlays: [
              { id: 'goatfolk-traits', colors: ['#d1b491', '#8a673e', '#e7d2b2'] },
              { id: 'horn-seer-regalia', colors: ['#d4aa4d', '#74538f', '#4fa09b'] },
            ],
          },
        },
      },
      {
        variantId: 'ramguard-chieftain',
        rendererData: {
          actor: {
            bodyBuild: 'heroic', skin: 'brown', hairStyle: 'braids', hairColor: 'brown',
            expression: 'angry', faceDetail: 'scar', headgear: 'none',
            outfit: 'barbarian', outfitColor: 'forest', outfitTier: 'tier2',
            weapon: 'axe', weaponTier: 'tier2', shield: 'round', shieldTier: 'tier2', offhand: 'none',
            palette: {
              skin: ['#a98262', '#694d39'],
              hair: ['#68452e', '#3a291f'],
              outfit: ['#4f7143', '#30462d'],
            },
          },
          identity: {
            overlays: [
              { id: 'goatfolk-traits', colors: ['#b08b6b', '#65462f', '#d5b998'] },
              { id: 'ramguard-mantle', colors: ['#6d7a4b', '#3b452f', '#b78343'] },
            ],
          },
        },
      },
    ],
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

export const EN_E02_FULL_PRODUCTION_GATE = deepFreeze({
  status: 'authorized',
  authorizedOn: '2026-08-02',
  scope: 'Five private families, 15 variants, and all standard Enemy motion with Cast/Death aliases.',
  exclusions: ['public registration', 'consumer exposure', 'separate effect assets', 'release', 'later slices'],
  nextGate: 'Exact full-slice visual approval before registration or consumer integration.',
});

export const EN_E02_COMPLETED_SLICE_GATE = deepFreeze({
  status: 'approved',
  approvedOn: '2026-08-02',
  implementationCommit: 'b2c1283c33dbfd6b2c307fc4d2288877a149c9df',
  artifact: 'enemy-expansion-review/en-e02-full/en-e02-full-overview.png',
  artifactSha256: '21f3175600377eaf75206f9fcb65856731da28eafb6715687821f782f41da6a8',
  presentationArtifact: 'enemy-expansion-review/en-e02-full/en-e02-presentation-review.png',
  presentationArtifactSha256: '211e9ace3eb965f243724249c73927567568e2f22f181f5448ba398ddab4a094',
  reviewManifest: 'enemy-expansion-review/en-e02-full/en-e02-full-review.json',
  reviewManifestSha256: '0a135fbed3eeeaf69400a3700d113af67a0c2a75043f95ab2a392711cd6b0afa',
  candidateFrameDigest: 'f4667a1ccefb3026c6df3604e114393fdaae619dab0c68bec969203986cb35bf',
  scope: 'Five approved families, 15 variants, four directions, and all 1,200 standard Enemy frames.',
  nextGate: 'Register only EN-E02 through the stable expansion registry; consumer integration remains separately gated.',
});

function familyDefinition(card, variants, notes, state = ENEMY_EXPANSION_STATES.IMPLEMENTED) {
  return {
    id: card.id,
    name: card.name,
    sliceId: card.sliceId,
    rendererKey: EN_E01_HUMANOID_RENDERER.key,
    state,
    variants,
    rendererData: {
      contractCard: card.id,
      intendedScale: card.intendedScale,
    },
    review: {
      baselineVariant: card.baseline.variantId,
      scale: card.baseline.reviewScale,
      notes,
    },
  };
}

function baselineFamily(card) {
  const baselineBrief = card.variantBriefs.find((variant) => variant.id === card.baseline.variantId);
  return familyDefinition(card, [{
      id: baselineBrief.id,
      name: baselineBrief.name,
      brief: baselineBrief.brief,
      rendererData: card.baseline.rendererData,
    }], 'Exact approved four-direction common-baseline Idle evidence.');
}

function productionVariants(card) {
  const rendererDataByVariant = new Map([
    [card.baseline.variantId, card.baseline.rendererData],
    ...card.additionalVariants.map((variant) => [variant.variantId, variant.rendererData]),
  ]);
  return card.variantBriefs.map((brief) => {
    const rendererData = rendererDataByVariant.get(brief.id);
    if (!rendererData) throw new TypeError('EN-E02 variant ' + card.id + '/' + brief.id + ' needs renderer data.');
    return {
      id: brief.id,
      name: brief.name,
      brief: brief.brief,
      rendererData,
    };
  });
}

function productionFamily(card) {
  return familyDefinition(card, productionVariants(card), 'Frozen full common/specialist/elite candidate awaiting exact visual review.');
}

function approvedFamily(card) {
  return familyDefinition(
    card,
    productionVariants(card),
    'Designer-approved common/specialist/elite family registered after completed-slice review.',
    ENEMY_EXPANSION_STATES.APPROVED,
  );
}

export const EN_E02_IDLE_FAMILIES = deepFreeze(EN_E02_CONTRACT_CARDS.map(baselineFamily));

export const EN_E02_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E01_HUMANOID_RENDERER],
  families: EN_E02_IDLE_FAMILIES,
});

export const EN_E02_CANDIDATE_FAMILIES = deepFreeze(EN_E02_CONTRACT_CARDS.map(productionFamily));

export const EN_E02_CANDIDATE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E01_HUMANOID_RENDERER],
  families: EN_E02_CANDIDATE_FAMILIES,
});

export const EN_E02_APPROVED_FAMILIES = deepFreeze(EN_E02_CONTRACT_CARDS.map(approvedFamily));

export const EN_E02_PUBLIC_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E01_HUMANOID_RENDERER],
  families: EN_E02_APPROVED_FAMILIES,
});
