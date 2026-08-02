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

function candidateFamily(card) {
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
      notes: 'Four-direction two-frame Idle candidate only; not public and not full-animation approved.',
    },
  };
}

export const EN_E01_CANDIDATE_FAMILIES = deepFreeze(EN_E01_CONTRACT_CARDS.map(candidateFamily));

export const EN_E01_CANDIDATE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E01_HUMANOID_RENDERER],
  families: EN_E01_CANDIDATE_FAMILIES,
});
