// Direction-aware combat overlays that share the character 12x4 sheet grid.

export const COMBAT_EFFECTS = [
  {
    id: 'trails',
    name: 'Weapon trails',
    effects: [
      { id: 'sword-slash', name: 'Sword slash', style: 'slash', colors: ['#eef8ff', '#78c8e8', '#3f7fb3'] },
      { id: 'spear-thrust', name: 'Spear thrust', style: 'thrust', colors: ['#fff2b8', '#d8b85a', '#8f6d2f'] },
      { id: 'axe-cleave', name: 'Axe cleave', style: 'cleave', colors: ['#f2e5d0', '#d08a56', '#8d4935'] },
      { id: 'hammer-smash', name: 'Hammer smash', style: 'crush', colors: ['#f7dc85', '#d06b3f', '#74403a'] },
      { id: 'shield-block', name: 'Shield block', style: 'block', colors: ['#d8f1ff', '#72a9d4', '#3d5f91'] },
    ],
  },
  {
    id: 'projectiles',
    name: 'Projectiles',
    effects: [
      { id: 'arrow', name: 'Arrow', style: 'arrow', colors: ['#e9ddbb', '#9b673c', '#4b3426'] },
      { id: 'crossbow-bolt', name: 'Crossbow bolt', style: 'bolt', colors: ['#d8dce5', '#7a8290', '#3d434f'] },
      { id: 'fireball', name: 'Fireball', style: 'fireball', colors: ['#fff2a8', '#f28b3d', '#b83d2d'] },
      { id: 'ice-shard', name: 'Ice shard', style: 'ice', colors: ['#eef8ff', '#8ed9e8', '#4b82aa'] },
      { id: 'poison-glob', name: 'Poison glob', style: 'poison', colors: ['#d7ff72', '#76b84c', '#3e6534'] },
      { id: 'holy-orb', name: 'Holy orb', style: 'holy', colors: ['#fff7c9', '#f0cf59', '#b8872f'] },
      { id: 'shadow-shot', name: 'Shadow shot', style: 'shadow', colors: ['#d2a8ff', '#8056b8', '#3d315f'] },
    ],
  },
  {
    id: 'impacts',
    name: 'Impact effects',
    effects: [
      { id: 'sparks', name: 'Sparks', style: 'sparks', colors: ['#fff2a8', '#f7b03e', '#c55a32'] },
      { id: 'blood-hit', name: 'Blood hit', style: 'blood', colors: ['#f05b58', '#a92f3d', '#611f2d'] },
      { id: 'armor-impact', name: 'Armor impact', style: 'armor', colors: ['#eef1f5', '#9ca6b4', '#535d6d'] },
      { id: 'explosion', name: 'Explosion', style: 'explosion', colors: ['#fff2a8', '#f07a36', '#9f3027'] },
      { id: 'arcane-burst', name: 'Arcane burst', style: 'arcane', colors: ['#f0d5ff', '#a86bd4', '#5b3b8f'] },
      { id: 'dust-puff', name: 'Dust puff', style: 'dust', colors: ['#e2d2b0', '#aa8a61', '#66513d'] },
    ],
  },
  {
    id: 'statuses',
    name: 'Status overlays',
    effects: [
      { id: 'burning', name: 'Burning', style: 'burning', colors: ['#fff2a8', '#f28b3d', '#b83d2d'] },
      { id: 'frozen', name: 'Frozen', style: 'frozen', colors: ['#eef8ff', '#8ed9e8', '#4b82aa'] },
      { id: 'poisoned', name: 'Poisoned', style: 'poisoned', colors: ['#d7ff72', '#76b84c', '#3e6534'] },
      { id: 'stunned', name: 'Stunned', style: 'stunned', colors: ['#fff2a8', '#f0cf59', '#a56f2c'] },
      { id: 'cursed', name: 'Cursed', style: 'cursed', colors: ['#d2a8ff', '#8056b8', '#3d315f'] },
      { id: 'healing', name: 'Healing', style: 'healing', colors: ['#e2ffd0', '#72d66f', '#318f58'] },
    ],
  },
];
