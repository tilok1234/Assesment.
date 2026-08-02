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
  idle: 'Two-frame breathing weight shift with feet held to the shared humanoid anchors.',
  walk: 'Deferred until Idle approval; compact four-step humanoid gait.',
};

export const EN_E01_CONTRACT_CARDS = deepFreeze([
  {
    id: 'witch',
    name: 'Witch',
    sliceId: 'EN-E01',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Narrow robed caster stance with staff kept clear of the hat silhouette.',
    },
    attackTell: {
      bodyCue: 'Shoulders draw back and the staff hand rises before release.',
      heldItemCue: 'Staff angle and free-hand reach carry the tell without a spell burst.',
      externalized: ['spell projectile', 'spell glow', 'familiar', 'cauldron'],
    },
    variantBriefs: [
      { role: 'common', id: 'hexer', name: 'Hexer', brief: 'Crooked-hat staff caster with a lean robe silhouette and readable free hand.' },
      { role: 'specialist', id: 'familiar-keeper', name: 'Familiar-Keeper', brief: 'Gloved handler whose familiar remains a separate child asset.' },
      { role: 'elite', id: 'cauldron-brewer', name: 'Cauldron Brewer', brief: 'Heavy-apron coven elder whose cauldron remains an external encounter asset.' },
    ],
    externalEffects: ['spell projectile', 'cast glow', 'familiar child actor', 'cauldron encounter prop'],
    externalMechanics: ['familiar behavior', 'cauldron area state'],
    baseline: {
      variantId: 'hexer',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'lean', skin: 'pale', hairStyle: 'long', hairColor: 'black',
          expression: 'determined', faceDetail: 'none', headgear: 'none',
          outfit: 'robe', outfitColor: 'purple', outfitTier: 'tier1',
          weapon: 'staff', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#e8c7a6', '#b98265'],
            hair: ['#34283f', '#1e1727'],
            outfit: ['#74469a', '#45275f'],
          },
        },
        identity: {
          overlays: [{ id: 'crooked-hat', colors: ['#74469a', '#2a1c35', '#b58246'] }],
        },
      },
    },
    additionalVariants: [
      {
        variantId: 'familiar-keeper',
        rendererData: {
          actor: {
            bodyBuild: 'classic', skin: 'tan', hairStyle: 'long', hairColor: 'white',
            expression: 'determined', faceDetail: 'none', headgear: 'hood',
            outfit: 'robe', outfitColor: 'teal', outfitTier: 'tier1',
            weapon: 'wand', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d29a62', '#a86e3f'],
              hair: ['#d8d5cf', '#9b9da4'],
              outfit: ['#326f72', '#21464d'],
            },
          },
          identity: {
            overlays: [{ id: 'keeper-cuff', colors: ['#4b2d61', '#d5a94b'] }],
          },
        },
      },
      {
        variantId: 'cauldron-brewer',
        rendererData: {
          actor: {
            bodyBuild: 'sturdy', skin: 'deep', hairStyle: 'messy', hairColor: 'ginger',
            expression: 'angry', faceDetail: 'warpaint', headgear: 'none',
            outfit: 'robe', outfitColor: 'forest', outfitTier: 'tier2',
            weapon: 'mace', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#6f452c', '#4f2f1e'],
              hair: ['#b75a31', '#74351f'],
              outfit: ['#496d3d', '#2b4528'],
            },
          },
          identity: {
            overlays: [
              { id: 'crooked-hat', colors: ['#526d3f', '#283621', '#b98545'] },
              { id: 'brewer-apron', colors: ['#b39a73', '#746147', '#d4aa48'] },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'fallen-knight',
    name: 'Fallen Knight',
    sliceId: 'EN-E01',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Broad armored guard stance weighted behind a kite shield.',
    },
    attackTell: {
      bodyCue: 'Shield settles and the sword shoulder opens before the cut.',
      heldItemCue: 'Sword wind-up remains visible around the shield edge.',
      externalized: ['weapon trail', 'impact spark', 'banner cloth simulation'],
    },
    variantBriefs: [
      { role: 'common', id: 'shieldbearer', name: 'Shieldbearer', brief: 'Dark plate, battered kite shield, and torn tabard establish the fallen guard read.' },
      { role: 'specialist', id: 'banner-lancer', name: 'Banner Lancer', brief: 'Long-weapon formation breaker; banner motion remains an authored attachment contract.' },
      { role: 'elite', id: 'blackguard', name: 'Blackguard', brief: 'Heavier cursed plate with a dominant executioner silhouette and no baked aura.' },
    ],
    externalEffects: ['weapon trail', 'impact spark', 'curse aura'],
    externalMechanics: ['banner attachment state', 'shield-block state'],
    baseline: {
      variantId: 'shieldbearer',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'heroic', skin: 'brown', hairStyle: 'bald', hairColor: 'black',
          expression: 'angry', faceDetail: 'scar', headgear: 'helm',
          outfit: 'plate', outfitColor: 'charcoal', outfitTier: 'tier1',
          weapon: 'sword', weaponTier: 'tier1', shield: 'kite', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#a06a42', '#704326'],
            hair: ['#2e2e38', '#1c1c24'],
            outfit: ['#4b4d58', '#292b33'],
          },
        },
        identity: {
          overlays: [{ id: 'ragged-tabard', colors: ['#8f3035', '#552028'] }],
        },
      },
    },
    additionalVariants: [
      {
        variantId: 'banner-lancer',
        rendererData: {
          actor: {
            bodyBuild: 'classic', skin: 'tan', hairStyle: 'short', hairColor: 'brown',
            expression: 'determined', faceDetail: 'scar', headgear: 'helm',
            outfit: 'cape', outfitColor: 'crimson', outfitTier: 'tier1',
            weapon: 'spear', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d29a62', '#a86e3f'],
              hair: ['#60402a', '#382619'],
              outfit: ['#913438', '#57242b'],
            },
          },
          identity: {
            overlays: [{ id: 'ragged-tabard', colors: ['#304f87', '#213352'] }],
          },
        },
      },
      {
        variantId: 'blackguard',
        rendererData: {
          actor: {
            bodyBuild: 'sturdy', skin: 'deep', hairStyle: 'bald', hairColor: 'black',
            expression: 'angry', faceDetail: 'none', headgear: 'fullhelm',
            outfit: 'plate', outfitColor: 'charcoal', outfitTier: 'tier2',
            weapon: 'greatsword', weaponTier: 'tier2', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#6f452c', '#4f2f1e'],
              hair: ['#2e2e38', '#1c1c24'],
              outfit: ['#3d3f49', '#23252c'],
            },
          },
          identity: {
            overlays: [{ id: 'ragged-tabard', colors: ['#57316f', '#301d42'] }],
          },
        },
      },
    ],
  },
  {
    id: 'pirate',
    name: 'Pirate',
    sliceId: 'EN-E01',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Loose deck stance with a forward blade hand and readable coat tails.',
    },
    attackTell: {
      bodyCue: 'Blade shoulder rolls back while the free arm counterbalances.',
      heldItemCue: 'Cutlass arc begins in the actor sheet; gunfire and bombs do not.',
      externalized: ['muzzle flash', 'bullet', 'bomb', 'explosion'],
    },
    variantBriefs: [
      { role: 'common', id: 'deckhand', name: 'Deckhand', brief: 'Bandana, weathered coat, sash, and cutlass form the common deck-fighter silhouette.' },
      { role: 'specialist', id: 'gunner', name: 'Gunner', brief: 'Braced firearm pose with projectile and muzzle flash kept in the effects lane.' },
      { role: 'elite', id: 'bomb-bosun', name: 'Bomb-Bosun', brief: 'Heavy belt and throwing wind-up; bombs and explosions remain separate assets.' },
    ],
    externalEffects: ['muzzle flash', 'bullet projectile', 'bomb projectile', 'explosion'],
    externalMechanics: ['reload state', 'fuse timing'],
    baseline: {
      variantId: 'deckhand',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'classic', skin: 'tan', hairStyle: 'messy', hairColor: 'brown',
          expression: 'angry', faceDetail: 'eyepatch', headgear: 'bandana',
          outfit: 'ranger', outfitColor: 'umber', outfitTier: 'tier1',
          weapon: 'scimitar', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#d29a62', '#a86e3f'],
            hair: ['#654128', '#3b2719'],
            outfit: ['#76513a', '#4d3326'],
          },
        },
        identity: {
          overlays: [{ id: 'pirate-sash', colors: ['#b43b3f', '#70252c', '#d7aa45'] }],
        },
      },
    },
    additionalVariants: [
      {
        variantId: 'gunner',
        rendererData: {
          actor: {
            bodyBuild: 'lean', skin: 'deep', hairStyle: 'short', hairColor: 'black',
            expression: 'determined', faceDetail: 'scar', headgear: 'cap',
            outfit: 'ranger', outfitColor: 'charcoal', outfitTier: 'tier1',
            weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#6f452c', '#4f2f1e'],
              hair: ['#2e2e38', '#1c1c24'],
              outfit: ['#46515d', '#29323c'],
            },
          },
          identity: {
            overlays: [
              { id: 'pirate-sash', colors: ['#315f83', '#213e58', '#d7aa45'] },
              { id: 'pistol', colors: ['#aeb6bd', '#6c452c', '#e5d9b4'] },
            ],
          },
        },
      },
      {
        variantId: 'bomb-bosun',
        rendererData: {
          actor: {
            bodyBuild: 'sturdy', skin: 'tan', hairStyle: 'messy', hairColor: 'ginger',
            expression: 'angry', faceDetail: 'eyepatch', headgear: 'bandana',
            outfit: 'barbarian', outfitColor: 'umber', outfitTier: 'tier1',
            weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d29a62', '#a86e3f'],
              hair: ['#c06434', '#7e3a20'],
              outfit: ['#76513a', '#4d3326'],
            },
          },
          identity: {
            overlays: [
              { id: 'bosun-belt', colors: ['#4a3021', '#725035', '#d7aa45'] },
              { id: 'throwing-glove', colors: ['#7b4b2b', '#d7aa45'] },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'necromancer',
    name: 'Necromancer',
    sliceId: 'EN-E01',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Measured ritual stance with the grimoire held away from the robe hem.',
    },
    attackTell: {
      bodyCue: 'Book arm anchors while the casting shoulder and mask turn toward the target.',
      heldItemCue: 'The opening grimoire silhouette carries the pre-cast read.',
      externalized: ['skeleton summon', 'grave circle', 'soul wisp', 'spell glow'],
    },
    variantBriefs: [
      { role: 'common', id: 'bone-caller', name: 'Bone Caller', brief: 'Skull mask, grave robe, open grimoire, and bone charms identify the baseline summoner.' },
      { role: 'specialist', id: 'grave-binder', name: 'Grave Binder', brief: 'Chain-and-seal ritualist whose ground circle remains a separate effect.' },
      { role: 'elite', id: 'ossuary-master', name: 'Ossuary Master', brief: 'Crowned bone regalia with summons and soul wisps external to the actor sheet.' },
    ],
    externalEffects: ['summoned skeleton actor', 'grave circle', 'soul wisp', 'cast glow'],
    externalMechanics: ['summon ownership', 'corpse or grave targeting'],
    baseline: {
      variantId: 'bone-caller',
      reviewScale: 8,
      rendererData: {
        actor: {
          species: 'undead', bodyBuild: 'lean', skin: 'pale', hairStyle: 'bald', hairColor: 'white',
          expression: 'neutral', faceDetail: 'none', headgear: 'hood',
          outfit: 'necromancer', outfitColor: 'charcoal', outfitTier: 'tier1',
          weapon: 'spellbook', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#d8cfbf', '#9b948b'],
            hair: ['#d8d5cf', '#9b9da4'],
            outfit: ['#4e4359', '#2b2735'],
          },
        },
        identity: {
          overlays: [{ id: 'bone-charms', colors: ['#e3d7b6', '#a99c7d'] }],
        },
      },
    },
    additionalVariants: [
      {
        variantId: 'grave-binder',
        rendererData: {
          actor: {
            species: 'undead', bodyBuild: 'classic', skin: 'pale', hairStyle: 'bald', hairColor: 'white',
            expression: 'neutral', faceDetail: 'none', headgear: 'hood',
            outfit: 'necromancer', outfitColor: 'teal', outfitTier: 'tier1',
            weapon: 'staff', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d8cfbf', '#9b948b'],
              hair: ['#d8d5cf', '#9b9da4'],
              outfit: ['#315f62', '#203d42'],
            },
          },
          identity: {
            overlays: [{ id: 'grave-chain', colors: ['#aeb5b7', '#646c73', '#72d5c1'] }],
          },
        },
      },
      {
        variantId: 'ossuary-master',
        rendererData: {
          actor: {
            species: 'undead', bodyBuild: 'sturdy', skin: 'pale', hairStyle: 'bald', hairColor: 'white',
            expression: 'neutral', faceDetail: 'none', headgear: 'crown',
            outfit: 'necromancer', outfitColor: 'purple', outfitTier: 'tier2',
            weapon: 'staff', weaponTier: 'tier2', shield: 'bone', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#e3d7b6', '#a99c7d'],
              hair: ['#d8d5cf', '#9b9da4'],
              outfit: ['#643f83', '#38274f'],
            },
          },
          identity: {
            overlays: [{ id: 'bone-charms', colors: ['#f0e1bb', '#b4a17c'] }],
          },
        },
      },
    ],
  },
  {
    id: 'alchemist',
    name: 'Alchemist',
    sliceId: 'EN-E01',
    intendedScale: commonScale,
    locomotion: {
      ...commonLocomotion,
      stance: 'Compact work-coat stance with the live flask carried outside the torso silhouette.',
    },
    attackTell: {
      bodyCue: 'Throwing shoulder drops and the flask hand cocks back before release.',
      heldItemCue: 'A single held flask stays visible; splash and cloud begin after separation.',
      externalized: ['thrown flask', 'potion splash', 'smoke cloud', 'mutagen transformation'],
    },
    variantBriefs: [
      { role: 'common', id: 'flask-thrower', name: 'Flask Thrower', brief: 'Work coat, apron, glasses, bandolier read, and one held flask define the baseline.' },
      { role: 'specialist', id: 'smoke-brewer', name: 'Smoke Brewer', brief: 'Respirator and sealed bottles; smoke volume remains a separate effect.' },
      { role: 'elite', id: 'mutagenist', name: 'Mutagenist', brief: 'Reinforced harness with transformation handled as an external form/state contract.' },
    ],
    externalEffects: ['thrown flask projectile', 'potion splash', 'smoke cloud'],
    externalMechanics: ['mixture selection', 'mutagen form state'],
    baseline: {
      variantId: 'flask-thrower',
      reviewScale: 8,
      rendererData: {
        actor: {
          bodyBuild: 'classic', skin: 'brown', hairStyle: 'messy', hairColor: 'ginger',
          expression: 'determined', faceDetail: 'glasses', headgear: 'none',
          outfit: 'ranger', outfitColor: 'teal', outfitTier: 'tier1',
          weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
          palette: {
            skin: ['#a06a42', '#70462b'],
            hair: ['#bf6334', '#7e3d22'],
            outfit: ['#397d78', '#245451'],
          },
        },
        identity: {
          overlays: [{ id: 'flask-kit', colors: ['#9fdad5', '#5ed184', '#9a6841', '#d2c29a', '#8d7b5f'] }],
        },
      },
    },
    additionalVariants: [
      {
        variantId: 'smoke-brewer',
        rendererData: {
          actor: {
            bodyBuild: 'lean', skin: 'tan', hairStyle: 'short', hairColor: 'black',
            expression: 'determined', faceDetail: 'none', headgear: 'hood',
            outfit: 'ranger', outfitColor: 'charcoal', outfitTier: 'tier1',
            weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#d29a62', '#a86e3f'],
              hair: ['#2e2e38', '#1c1c24'],
              outfit: ['#4a5358', '#2b3238'],
            },
          },
          identity: {
            overlays: [
              { id: 'flask-kit', colors: ['#c4d2d0', '#d3b64a', '#7c5739', '#9ba3a0', '#5f696a'] },
              { id: 'respirator', colors: ['#777f83', '#d3b64a', '#383f43'] },
            ],
          },
        },
      },
      {
        variantId: 'mutagenist',
        rendererData: {
          actor: {
            bodyBuild: 'sturdy', skin: 'deep', hairStyle: 'spiky', hairColor: 'blue',
            expression: 'angry', faceDetail: 'glasses', headgear: 'none',
            outfit: 'leather', outfitColor: 'forest', outfitTier: 'tier2',
            weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
            palette: {
              skin: ['#6f452c', '#4f2f1e'],
              hair: ['#4a6fd4', '#31509f'],
              outfit: ['#3d7049', '#25452e'],
            },
          },
          identity: {
            overlays: [
              { id: 'flask-kit', colors: ['#c2a8df', '#a65de2', '#8b5a37', '#9aaa7f', '#5c6a4c'] },
              { id: 'mutagen-harness', colors: ['#39283f', '#aeb6bd', '#a65de2', '#5ed184'] },
            ],
          },
        },
      },
    ],
  },
]);

export const EN_E01_IDLE_GATE = deepFreeze({
  status: 'approved',
  approvedOn: '2026-08-02',
  artifact: 'enemy-expansion-review/en-e01/en-e01-idle-review.png',
  artifactSha256: '2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee',
  candidateFrameDigest: '339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323',
  scope: 'Five common baselines, four directions, and two Idle frames only.',
  nextGate: 'Full three-variant animation review before public registration.',
});

function familyDefinition(card, variants, notes) {
  return {
    id: card.id,
    name: card.name,
    sliceId: card.sliceId,
    rendererKey: EN_E01_HUMANOID_RENDERER.key,
    state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
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

function productionFamily(card) {
  const rendererDataByVariant = new Map([
    [card.baseline.variantId, card.baseline.rendererData],
    ...card.additionalVariants.map((variant) => [variant.variantId, variant.rendererData]),
  ]);
  const variants = card.variantBriefs.map((brief) => {
    const rendererData = rendererDataByVariant.get(brief.id);
    if (!rendererData) throw new TypeError('EN-E01 variant ' + card.id + '/' + brief.id + ' needs renderer data.');
    return {
      id: brief.id,
      name: brief.name,
      brief: brief.brief,
      rendererData,
    };
  });
  return familyDefinition(card, variants, 'Full common/specialist/elite animation candidate; not public before completed-slice review.');
}

export const EN_E01_IDLE_FAMILIES = deepFreeze(EN_E01_CONTRACT_CARDS.map(baselineFamily));

export const EN_E01_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E01_HUMANOID_RENDERER],
  families: EN_E01_IDLE_FAMILIES,
});

export const EN_E01_CANDIDATE_FAMILIES = deepFreeze(EN_E01_CONTRACT_CARDS.map(productionFamily));

export const EN_E01_CANDIDATE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E01_HUMANOID_RENDERER],
  families: EN_E01_CANDIDATE_FAMILIES,
});
