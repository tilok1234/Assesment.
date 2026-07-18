// Enemy family and variant definitions.

import { INK } from './palettes.js';

// ---------------- enemies ----------------
export const ENEMIES = [
  { id: 'slime', name: 'Slime', variants: [
    { id: 'lime',   name: 'Lime',   c: ['#7ddb4f', '#4faa2e', '#c9f29b'] },
    { id: 'aqua',   name: 'Aqua',   c: ['#4fc7db', '#2e8faa', '#aeeef7'] },
    { id: 'magma',  name: 'Magma',  c: ['#e8663a', '#b03a1e', '#f7b03e'] },
    { id: 'shadow', name: 'Shadow', c: ['#7b5fb5', '#523a85', '#b49ae0'] },
    { id: 'honey',  name: 'Honey',  c: ['#e8b93e', '#b7871f', '#f7dc85'] },
    { id: 'rock',   name: 'Rock',   c: ['#9a9aa2', '#6e6e78', '#c9c9d2'] },
    { id: 'rose',   name: 'Rose',   c: ['#e878a8', '#bc4f7f', '#f7c2da'] },
  ]},
  { id: 'goblin', name: 'Goblin', variants: [
    { id: 'scout',  name: 'Scout',  skin: ['#7cb850', '#54903a'], outfit: 'leather', oc: 'umber',  weapon: 'dagger', small: true },
    { id: 'brute',  name: 'Hobgoblin', skin: ['#c88a4a', '#96612e'], outfit: 'tunic', oc: 'umber',  weapon: 'club',   small: false },
    { id: 'shaman', name: 'Shaman', skin: ['#6aa04a', '#47752f'], outfit: 'robe',    oc: 'purple', weapon: 'staff',  small: true, gear: 'hood' },
    { id: 'archer', name: 'Archer', skin: ['#7cb850', '#54903a'], outfit: 'tunic',   oc: 'forest', weapon: 'bow',    small: true },
    { id: 'chief',  name: 'Chief',  skin: ['#6aa04a', '#47752f'], outfit: 'plate',   oc: 'crimson', weapon: 'spear', small: false, gear: 'crown' },
  ]},
  { id: 'skeleton', name: 'Skeleton', variants: [
    { id: 'grunt',  name: 'Grunt',  outfit: 'tunic', oc: 'charcoal', weapon: 'none',  gear: 'none' },
    { id: 'knight', name: 'Knight', outfit: 'plate', oc: 'charcoal', weapon: 'sword', gear: 'helm', shield: 'kite' },
    { id: 'mage',   name: 'Mage',   outfit: 'robe',  oc: 'purple',   weapon: 'staff', gear: 'hood', eye: '#7ee0ff' },
    { id: 'archer', name: 'Archer', outfit: 'leather', oc: 'umber',  weapon: 'bow',   gear: 'hood' },
    { id: 'lord',   name: 'Bone lord', outfit: 'plate', oc: 'purple', weapon: 'axe',  gear: 'crown', shield: 'round', eye: '#e83a3a' },
  ]},
  { id: 'bat', name: 'Bat', variants: [
    { id: 'cave',    name: 'Cave',    fur: ['#8a6a4a', '#63482e'], wing: ['#63482e', '#42301e'], eye: '#e8b93e' },
    { id: 'frost',   name: 'Frost',   fur: ['#7ea8d8', '#5578a8'], wing: ['#5578a8', '#3a5478'], eye: '#e6f2ff' },
    { id: 'vampire', name: 'Vampire', fur: ['#6a3a4a', '#4a2432'], wing: ['#4a2432', '#301620'], eye: '#e83a3a' },
    { id: 'moss',    name: 'Moss',    fur: ['#7ca85e', '#557838'], wing: ['#557838', '#3a5424'], eye: '#c9f29b' },
  ]},
  { id: 'ghost', name: 'Ghost', variants: [
    { id: 'pale',     name: 'Pale',     c: ['#eef0f4', '#c3c9d6'], eye: INK },
    { id: 'spectral', name: 'Spectral', c: ['#a8e8e0', '#6ab8b0'], eye: '#1f6f6d' },
    { id: 'cursed',   name: 'Cursed',   c: ['#5a5f78', '#3f4358'], eye: '#e83a3a' },
    { id: 'ember',    name: 'Ember',    c: ['#e8a06a', '#b06a3a'], eye: '#e83a3a' },
  ]},
  { id: 'spider', name: 'Spider', variants: [
    { id: 'forest', name: 'Forest', c: ['#8a6a3a', '#5f4626'], mark: '#c2b492', eye: '#e8b93e' },
    { id: 'widow',  name: 'Widow',  c: ['#33333f', '#1f1f28'], mark: '#e83a3a', eye: '#e83a3a' },
    { id: 'venom',  name: 'Venom',  c: ['#5f9c3f', '#3f6b28'], mark: '#c9f29b', eye: '#c9f29b' },
    { id: 'frost',  name: 'Frost',  c: ['#7ea8d8', '#5578a8'], mark: '#e6f2ff', eye: '#e6f2ff' },
  ]},
  { id: 'shroom', name: 'Shroom', variants: [
    { id: 'toad',   name: 'Toadcap', c: ['#d84a3a', '#a12b20'], dot: '#f4ede0' },
    { id: 'violet', name: 'Violet',  c: ['#8a5fc2', '#61408f'], dot: '#e0cef4' },
    { id: 'earth',  name: 'Earth',   c: ['#9c7a4a', '#6f5530'], dot: '#e8ddc4' },
    { id: 'sky',    name: 'Sky',     c: ['#5f9cc2', '#3f6f8f'], dot: '#e0f0f7' },
  ]},
  { id: 'zombie', name: 'Zombie', variants: [
    { id: 'shambler', name: 'Shambler', skin: ['#a8bc8a', '#7a8f5e'], outfit: 'tunic',   oc: 'charcoal', weapon: 'none' },
    { id: 'ghoul',    name: 'Ghoul',    skin: ['#a8a89a', '#78786c'], outfit: 'leather', oc: 'umber',    weapon: 'dagger' },
    { id: 'rotter',   name: 'Rotter',   skin: ['#7a9c5e', '#557038'], outfit: 'tunic',   oc: 'forest',   weapon: 'club' },
    { id: 'brute',    name: 'Brute',    skin: ['#8aa06a', '#5f7544'], outfit: 'plate',   oc: 'charcoal', weapon: 'club', gear: 'helm' },
  ]},
  { id: 'imp', name: 'Imp', variants: [
    { id: 'sprite', name: 'Sprite', skin: ['#e05545', '#a83226'], outfit: 'tunic', oc: 'charcoal', weapon: 'spear', small: true },
    { id: 'pyro',   name: 'Pyro',   skin: ['#e05545', '#a83226'], outfit: 'robe',  oc: 'crimson',  weapon: 'staff', small: true },
    { id: 'fiend',  name: 'Fiend',  skin: ['#b03a5a', '#7d2440'], outfit: 'tunic', oc: 'umber',    weapon: 'club',  small: false },
  ]},
  { id: 'wolf', name: 'Wolf', variants: [
    { id: 'gray',   name: 'Gray',   shape: 'wolf', c: ['#9aa2ae', '#6b7280'], eye: '#e8b93e' },
    { id: 'timber', name: 'Timber', shape: 'wolf', c: ['#8a6a4a', '#63482e'], eye: '#e8b93e' },
    { id: 'dire',   name: 'Dire',   shape: 'wolf', c: ['#3f4149', '#2a2c33'], eye: '#e83a3a' },
  ]},
  { id: 'boar', name: 'Boar', variants: [
    { id: 'tusker', name: 'Tusker', shape: 'boar', c: ['#8a5a3a', '#5f3d26'], mark: '#e0a8a0', eye: '#1a1c2c' },
    { id: 'ash',    name: 'Ash',    shape: 'boar', c: ['#7a7a72', '#55554e'], mark: '#c9a8a0', eye: '#1a1c2c' },
    { id: 'blood',  name: 'Blood',  shape: 'boar', c: ['#7d3a30', '#54261f'], mark: '#e0a8a0', eye: '#e8b93e' },
  ]},
  { id: 'bear', name: 'Bear', variants: [
    { id: 'brown', name: 'Brown', shape: 'bear', c: ['#7d5636', '#5a3c24'], eye: '#1a1c2c' },
    { id: 'cave',  name: 'Cave',  shape: 'bear', c: ['#6e6e78', '#4a4a52'], eye: '#e8b93e' },
    { id: 'polar', name: 'Polar', shape: 'bear', c: ['#e6e6e6', '#b4bac4'], eye: '#1a1c2c' },
  ]},
  { id: 'bigcat', name: 'Big cat', variants: [
    { id: 'lynx',    name: 'Lynx',    shape: 'cat', c: ['#c9a86a', '#96794a'], mk: '#6f5530', marks: 'spots',   tail: 'bob',  tuft: true, mark: '#e0a8a0', eye: '#e8b93e' },
    { id: 'tiger',   name: 'Tiger',   shape: 'cat', c: ['#e08a3a', '#a85a20'], mk: '#2e2e38', marks: 'stripes', tail: 'long', mark: '#e0a8a0', eye: '#e8b93e' },
    { id: 'panther', name: 'Panther', shape: 'cat', c: ['#33333f', '#22222c'], marks: null,   tail: 'long', mark: '#e0a8a0', eye: '#c9f29b' },
    { id: 'snow',    name: 'Snow leopard', shape: 'cat', c: ['#d8dde4', '#a8b0bc'], mk: '#6b7280', marks: 'spots', tail: 'long', mark: '#e0a8a0', eye: '#7ee0ff' },
  ]},
  { id: 'elf', name: 'Elf', variants: [
    { id: 'ranger',  name: 'Ranger',  skin: ['#f4d1a4', '#d9a06b'], hair: 'blonde', hs: 'long',     outfit: 'leather', oc: 'forest', weapon: 'bow',    gear: 'hood' },
    { id: 'mage',    name: 'Mage',    skin: ['#f4d1a4', '#d9a06b'], hair: 'white',  hs: 'long',     outfit: 'robe',    oc: 'teal',   weapon: 'staff' },
    { id: 'duelist', name: 'Duelist', skin: ['#eab98a', '#c98a56'], hair: 'blonde', hs: 'ponytail', outfit: 'tunic',   oc: 'royal',  weapon: 'sword' },
    { id: 'dark',    name: 'Dark elf', skin: ['#8a7ab5', '#61548f'], hair: 'white', hs: 'long',     outfit: 'leather', oc: 'purple', weapon: 'dagger' },
  ]},
  { id: 'dwarf', name: 'Dwarf', variants: [
    { id: 'warrior', name: 'Warrior', skin: ['#eab98a', '#c98a56'], beard: 'ginger', outfit: 'plate',   oc: 'crimson', weapon: 'axe',  gear: 'helm', shield: 'round', small: true },
    { id: 'miner',   name: 'Miner',   skin: ['#f4d1a4', '#d9a06b'], beard: 'brown',  outfit: 'leather', oc: 'umber',   weapon: 'club', gear: 'cap',   small: true },
    { id: 'king',    name: 'King',    skin: ['#eab98a', '#c98a56'], beard: 'white',  outfit: 'plate',   oc: 'purple',  weapon: 'axe',  gear: 'crown', small: true },
  ]},
  { id: 'bandit', name: 'Bandit', variants: [
    { id: 'thug',    name: 'Thug',    skin: ['#eab98a', '#c98a56'], hair: 'black',  hs: 'spiky',  outfit: 'leather', oc: 'charcoal', weapon: 'dagger' },
    { id: 'brigand', name: 'Brigand', skin: ['#d29a62', '#a86e3f'], hair: 'black',  hs: 'mohawk', outfit: 'leather', oc: 'umber',    weapon: 'axe' },
    { id: 'sniper',  name: 'Sniper',  skin: ['#f4d1a4', '#d9a06b'], hair: 'brown',  hs: 'short',  outfit: 'tunic',   oc: 'forest',   weapon: 'bow',    gear: 'cap' },
  ]},
  { id: 'cultist', name: 'Cultist', variants: [
    { id: 'acolyte', name: 'Acolyte', skin: ['#eab98a', '#c98a56'], hair: 'black', hs: 'bald', outfit: 'robe', oc: 'purple',   weapon: 'dagger', gear: 'hood', eye: '#e83a3a' },
    { id: 'zealot',  name: 'Zealot',  skin: ['#d29a62', '#a86e3f'], hair: 'black', hs: 'bald', outfit: 'robe', oc: 'crimson',  weapon: 'staff',  gear: 'hood', eye: '#e8b93e' },
    { id: 'oracle',  name: 'Oracle',  skin: ['#f4d1a4', '#d9a06b'], hair: 'white', hs: 'long', outfit: 'robe', oc: 'purple',   weapon: 'staff',  gear: 'wizard', eye: '#7ee0ff' },
  ]},
  { id: 'orc', name: 'Orc', variants: [
    { id: 'grunt',     name: 'Grunt',     skin: ['#6cb54e', '#4a8b36'], hs: 'bald',   outfit: 'leather', oc: 'umber',    weapon: 'axe' },
    { id: 'berserker', name: 'Berserker', skin: ['#8fbc4a', '#679330'], hs: 'mohawk', hair: 'black', outfit: 'tunic', oc: 'crimson', weapon: 'club' },
    { id: 'warlord',   name: 'Warlord',   skin: ['#7a8f62', '#55673f'], hs: 'bald',   outfit: 'plate',   oc: 'charcoal', weapon: 'sword', gear: 'horns', shield: 'round' },
  ]},
  { id: 'ogre', name: 'Ogre', variants: [
    { id: 'brute',   name: 'Brute',   skin: ['#c2a05a', '#94763a'], hs: 'bald',  outfit: 'tunic',   oc: 'umber',    weapon: 'club' },
    { id: 'crusher', name: 'Crusher', skin: ['#9a8f7a', '#6f6552'], hs: 'bald',  outfit: 'leather', oc: 'charcoal', weapon: 'axe' },
    { id: 'magi',    name: 'Magi',    skin: ['#7a8fd0', '#54689f'], hs: 'short', hair: 'black', outfit: 'robe', oc: 'teal', weapon: 'staff', eye: '#7ee0ff' },
  ]},
  { id: 'troll', name: 'Troll', variants: [
    { id: 'cave',   name: 'Cave',   skin: ['#7ca86a', '#547844'], hs: 'spiky', hair: 'black', outfit: 'tunic',   oc: 'umber',    weapon: 'club' },
    { id: 'bridge', name: 'Bridge', skin: ['#9a9aa2', '#6e6e78'], hs: 'bald',  outfit: 'leather', oc: 'charcoal', weapon: 'axe' },
    { id: 'frost',  name: 'Frost',  skin: ['#8ab8d8', '#5f88a8'], hs: 'spiky', hair: 'white', outfit: 'tunic',  oc: 'teal',     weapon: 'spear' },
  ]},
  { id: 'kobold', name: 'Kobold', variants: [
    { id: 'skirmisher', name: 'Skirmisher', skin: ['#b06a42', '#82492a'], hs: 'bald', outfit: 'tunic',   oc: 'umber',   weapon: 'spear',  small: true },
    { id: 'trapper',    name: 'Trapper',    skin: ['#8a5a3a', '#5f3d26'], hs: 'bald', outfit: 'leather', oc: 'forest',  weapon: 'dagger', small: true },
    { id: 'sorcerer',   name: 'Sorcerer',   skin: ['#a04a3a', '#742f24'], hs: 'bald', outfit: 'robe',    oc: 'crimson', weapon: 'staff',  small: true, eye: '#e8b93e' },
  ]},
  { id: 'gnoll', name: 'Gnoll', variants: [
    { id: 'raider', name: 'Raider', skin: ['#c2a06a', '#94763a'], hs: 'spiky', hair: 'brown', outfit: 'leather', oc: 'umber',    weapon: 'axe' },
    { id: 'hunter', name: 'Hunter', skin: ['#a8845a', '#7a5c38'], hs: 'spiky', hair: 'black', outfit: 'tunic',   oc: 'forest',   weapon: 'bow' },
    { id: 'alpha',  name: 'Alpha',  skin: ['#6e6058', '#4a413a'], hs: 'spiky', hair: 'black', outfit: 'plate',   oc: 'charcoal', weapon: 'sword', eye: '#e8b93e' },
  ]},
  { id: 'ratfolk', name: 'Ratfolk', variants: [
    { id: 'skulker', name: 'Skulker', skin: ['#9a9aa2', '#6e6e78'], hs: 'bald', outfit: 'tunic',   oc: 'charcoal', weapon: 'dagger', small: true },
    { id: 'plague',  name: 'Plague',  skin: ['#a8b08a', '#7a825e'], hs: 'bald', outfit: 'robe',    oc: 'forest',   weapon: 'staff',  small: true, gear: 'hood', eye: '#c9f29b' },
    { id: 'blade',   name: 'Blade',   skin: ['#8a6a4a', '#63482e'], hs: 'bald', outfit: 'leather', oc: 'umber',    weapon: 'sword',  small: true },
  ]},
  { id: 'lizardfolk', name: 'Lizardfolk', variants: [
    { id: 'saurian',   name: 'Saurian',   skin: ['#5f9c3f', '#3f6b28'], hs: 'bald', outfit: 'tunic',   oc: 'forest', weapon: 'spear' },
    { id: 'marsh',     name: 'Marsh',     skin: ['#7a825e', '#555c3e'], hs: 'bald', outfit: 'leather', oc: 'umber',  weapon: 'club' },
    { id: 'chromatic', name: 'Chromatic', skin: ['#2f9c98', '#1f6f6d'], hs: 'bald', outfit: 'robe',    oc: 'teal',   weapon: 'staff', eye: '#e8b93e' },
  ]},
  { id: 'minotaur', name: 'Minotaur', variants: [
    { id: 'bull',     name: 'Bull',     skin: ['#7d5636', '#5a3c24'], hs: 'bald', outfit: 'tunic',   oc: 'crimson',  weapon: 'axe' },
    { id: 'ironhorn', name: 'Ironhorn', skin: ['#6e6e78', '#4a4a52'], hs: 'bald', outfit: 'plate',   oc: 'charcoal', weapon: 'club', eye: '#e83a3a' },
    { id: 'warden',   name: 'Warden',   skin: ['#5a3c24', '#3d2f20'], hs: 'bald', outfit: 'leather', oc: 'umber',    weapon: 'spear' },
  ]},
  { id: 'demon', name: 'Demon', variants: [
    { id: 'duke',    name: 'Duke',      skin: ['#a83a3a', '#7d2626'], hs: 'bald', outfit: 'plate', oc: 'charcoal', weapon: 'sword', eye: '#e8b93e', shield: 'kite' },
    { id: 'pit',     name: 'Pit fiend', skin: ['#8c2626', '#5f1818'], hs: 'bald', outfit: 'tunic', oc: 'charcoal', weapon: 'club',  eye: '#e8b93e' },
    { id: 'warlock', name: 'Warlock',   skin: ['#7b4fb5', '#57357f'], hs: 'bald', outfit: 'robe',  oc: 'purple',   weapon: 'staff', eye: '#7ee0ff' },
  ]},
  { id: 'golem', name: 'Golem', variants: [
    { id: 'stone', name: 'Stone', c: ['#9a9aa2', '#6e6e78', '#c9c9d2'], crack: '#55555e', eye: '#e8b93e' },
    { id: 'lava',  name: 'Lava',  c: ['#4a4a52', '#33333f', '#6e6e78'], crack: '#e8663a', eye: '#f7b03e' },
    { id: 'ice',   name: 'Ice',   c: ['#a8d0e8', '#78a8c8', '#e0f0f7'], crack: '#e0f0f7', eye: '#2e8faa' },
  ]},
  { id: 'elemental', name: 'Elemental', variants: [
    { id: 'flame', name: 'Flame', c: ['#e8663a', '#b03a1e', '#f7b03e'] },
    { id: 'water', name: 'Water', c: ['#4fc7db', '#2e8faa', '#aeeef7'] },
    { id: 'storm', name: 'Storm', c: ['#7b5fb5', '#523a85', '#e8b93e'] },
  ]},
  { id: 'treant', name: 'Treant', variants: [
    { id: 'oak',      name: 'Oak',      bark: ['#8a5a33', '#63401f'], leaf: ['#3f8f4f', '#2a6638'], eye: '#e8b93e' },
    { id: 'willow',   name: 'Willow',   bark: ['#9c7a4a', '#6f5530'], leaf: ['#7ddb4f', '#4faa2e'], eye: '#1a1c2c' },
    { id: 'blighted', name: 'Blighted', bark: ['#5a4632', '#3d2f20'], leaf: ['#7b5fb5', '#523a85'], eye: '#e83a3a' },
  ]},
  { id: 'gargoyle', name: 'Gargoyle', variants: [
    { id: 'granite',   name: 'Granite',   c: ['#9a9aa2', '#6e6e78'], eye: '#e8b93e' },
    { id: 'obsidian',  name: 'Obsidian',  c: ['#33333f', '#22222c'], eye: '#e83a3a' },
    { id: 'verdigris', name: 'Verdigris', c: ['#6aa89a', '#47786d'], eye: '#e8b93e' },
  ]},
  { id: 'cyclops', name: 'Cyclops', variants: [
    { id: 'shepherd', name: 'Shepherd', skin: ['#d29a62', '#a86e3f'], hs: 'bald', outfit: 'tunic',   oc: 'umber',    weapon: 'club' },
    { id: 'smasher',  name: 'Smasher',  skin: ['#a8845a', '#7a5c38'], hs: 'bald', outfit: 'leather', oc: 'charcoal', weapon: 'axe' },
    { id: 'titan',    name: 'Titan',    skin: ['#9a8f7a', '#6f6552'], hs: 'bald', outfit: 'plate',   oc: 'royal',    weapon: 'sword', eye: '#e8b93e' },
  ]},
  { id: 'harpy', name: 'Harpy', variants: [
    { id: 'screech', name: 'Screecher', skin: ['#f4d1a4', '#d9a06b'], hair: 'black',  hs: 'long', outfit: 'tunic', oc: 'umber',   wing: ['#8a5a33', '#63401f'] },
    { id: 'storm',   name: 'Storm',     skin: ['#eab98a', '#c98a56'], hair: 'blue',   hs: 'long', outfit: 'tunic', oc: 'teal',    wing: ['#4a6fd4', '#31509f'] },
    { id: 'blood',   name: 'Blood',     skin: ['#d29a62', '#a86e3f'], hair: 'ginger', hs: 'long', outfit: 'tunic', oc: 'crimson', wing: ['#c23a3a', '#8c2626'] },
  ]},
  { id: 'snake', name: 'Snake', variants: [
    { id: 'viper', name: 'Viper', c: ['#5f9c3f', '#3f6b28'], eye: '#e8b93e' },
    { id: 'cobra', name: 'Cobra', c: ['#c2a05a', '#94763a'], eye: '#1a1c2c', hood: true },
    { id: 'frost', name: 'Frost', c: ['#7ea8d8', '#5578a8'], eye: '#e6f2ff' },
  ]},
  { id: 'worm', name: 'Worm', variants: [
    { id: 'dirt',  name: 'Dirt',  c: ['#b48a6a', '#8a6248'] },
    { id: 'frost', name: 'Frost', c: ['#a8d0e8', '#78a8c8'] },
    { id: 'magma', name: 'Magma', c: ['#e8663a', '#b03a1e'] },
  ]},
  { id: 'eyemonster', name: 'Eye monster', variants: [
    { id: 'watcher', name: 'Watcher', c: ['#eef0f4', '#c3c9d6'], iris: '#e8b93e' },
    { id: 'doom',    name: 'Doom',    c: ['#eef0f4', '#c3c9d6'], iris: '#e83a3a' },
    { id: 'void',    name: 'Void',    c: ['#5a5f78', '#3f4358'], iris: '#7ee0ff' },
  ]},
  { id: 'scorpion', name: 'Scorpion', variants: [
    { id: 'dune',    name: 'Dune',    c: ['#c2a05a', '#94763a'], eye: '#1a1c2c' },
    { id: 'emperor', name: 'Emperor', c: ['#33333f', '#22222c'], eye: '#e83a3a' },
    { id: 'venom',   name: 'Venom',   c: ['#5f9c3f', '#3f6b28'], eye: '#c9f29b' },
  ]},
  { id: 'crab', name: 'Crab', variants: [
    { id: 'shore',    name: 'Shore',    c: ['#e0663a', '#a8431f', '#f7b03e'] },
    { id: 'rock',     name: 'Rock',     c: ['#9a9aa2', '#6e6e78', '#c9c9d2'] },
    { id: 'sapphire', name: 'Sapphire', c: ['#4a6fd4', '#31509f', '#8fb0f0'] },
  ]},
  { id: 'beetle', name: 'Beetle', variants: [
    { id: 'scarab', name: 'Scarab', c: ['#2f9c98', '#1f6f6d', '#8fe0d8'] },
    { id: 'stag',   name: 'Stag',   c: ['#8a5a33', '#63401f', '#c2925f'] },
    { id: 'bomber', name: 'Bomber', c: ['#4a4e5a', '#33363f', '#e8b93e'] },
  ]},
  { id: 'wasp', name: 'Wasp', variants: [
    { id: 'yellowjacket', name: 'Yellowjacket', c: ['#e8b93e', '#2e2e38'], st: '#2e2e38' },
    { id: 'hornet',       name: 'Hornet',       c: ['#c2703a', '#5f3d26'], st: '#2e2e38' },
    { id: 'royal',        name: 'Royal',        c: ['#7b4fb5', '#57357f'], st: '#e8b93e' },
  ]},
  { id: 'mimic', name: 'Mimic', variants: [
    { id: 'wooden', name: 'Wooden', c: ['#8a5a33', '#63401f'], tr: '#e8b93e', eye: '#e8b93e' },
    { id: 'royal',  name: 'Royal',  c: ['#7b4fb5', '#57357f'], tr: '#e8b93e', eye: '#f7dc85' },
    { id: 'cursed', name: 'Cursed', c: ['#4a4e5a', '#33363f'], tr: '#8a94a4', eye: '#e83a3a' },
  ]},
  { id: 'drake', name: 'Drake', variants: [
    { id: 'ember',   name: 'Ember',   c: ['#c23a3a', '#8c2626'], belly: '#f7b03e', eye: '#e8b93e', br: ['#e8663a', '#f7b03e'] },
    { id: 'frost',   name: 'Frost',   c: ['#7ea8d8', '#5578a8'], belly: '#e6f2ff', eye: '#1a1c2c', br: ['#aeeef7', '#e6f2ff'] },
    { id: 'verdant', name: 'Verdant', c: ['#5f9c3f', '#3f6b28'], belly: '#c9f29b', eye: '#e8b93e', br: ['#c9f29b', '#8fe06a'] },
  ]},
  { id: 'frog', name: 'Frog', variants: [
    { id: 'bog',    name: 'Bog hopper',  c: ['#6f9f45', '#446b2c'], belly: '#b8cd78', mark: '#d6c45a', eye: '#f7dc85' },
    { id: 'dart',   name: 'Poison dart', c: ['#3b9fd8', '#236a9c'], belly: '#79d4ee', mark: '#f0d33b', eye: '#1a1c2c' },
    { id: 'ember',  name: 'Ember toad',  c: ['#d85b36', '#96351f'], belly: '#f29a4a', mark: '#f7dc85', eye: '#fff2a8' },
    { id: 'frost',  name: 'Frost croaker', c: ['#78b8d8', '#4f7fa8'], belly: '#c8eef4', mark: '#eef8ff', eye: '#1a1c2c' },
  ]},
  { id: 'crocodile', name: 'Crocodile', variants: [
    { id: 'marsh',   name: 'Marsh',     c: ['#668f42', '#3e612a', '#91b45d'], belly: '#b6c77b', mark: '#d7c864', eye: '#e8b93e' },
    { id: 'albino',  name: 'Albino',    c: ['#d8d7c5', '#9f9f91', '#f1ead5'], belly: '#efe0c8', mark: '#c79a9a', eye: '#e83a3a' },
    { id: 'ash',     name: 'Ashscale',  c: ['#676b72', '#3f434b', '#8d929b'], belly: '#aeb2b5', mark: '#d47743', eye: '#f7b03e' },
    { id: 'ancient', name: 'Mirejaw',   c: ['#375f48', '#213d30', '#628165'], belly: '#80966c', mark: '#b6d54a', eye: '#c9f29b' },
  ]},
  { id: 'turtle', name: 'Turtle', variants: [
    { id: 'mossback', name: 'Mossback',      c: ['#607b3d', '#3d5229'], skin: ['#7da251', '#4f7135'], mark: '#a9c65e', eye: '#1a1c2c' },
    { id: 'iron',    name: 'Iron shell',     c: ['#707681', '#454a54'], skin: ['#8b9485', '#5c665a'], mark: '#b6bec8', eye: '#e8b93e' },
    { id: 'frost',   name: 'Frost shell',    c: ['#72a9c6', '#466f91'], skin: ['#a9d4df', '#6f9cac'], mark: '#e6f2ff', eye: '#1a1c2c' },
    { id: 'magma',   name: 'Magma tortoise', c: ['#77362f', '#482420'], skin: ['#b55436', '#7f3425'], mark: '#f7b03e', eye: '#fff2a8' },
  ]},
  { id: 'jellyfish', name: 'Jellyfish', variants: [
    { id: 'moon',  name: 'Moon jelly',   c: ['#9cd9e6', '#588ca8'], glow: '#e8fbff', eye: '#31506b' },
    { id: 'venom', name: 'Venom medusa', c: ['#78b65a', '#477a36'], glow: '#c9f29b', eye: '#253b22' },
    { id: 'ember', name: 'Ember bell',   c: ['#e06b44', '#a13c2c'], glow: '#f7c45a', eye: '#5a231f' },
    { id: 'void',  name: 'Void drifter', c: ['#7660aa', '#46386f'], glow: '#c4a7f2', eye: '#eef0ff' },
  ]},
  { id: 'centipede', name: 'Centipede', variants: [
    { id: 'cave',  name: 'Cave crawler', c: ['#9b6538', '#623d25', '#c99352'], eye: '#f7dc85', venom: '#d7e28a' },
    { id: 'venom', name: 'Venom spine',  c: ['#5e963e', '#365e2a', '#99c65c'], eye: '#c9f29b', venom: '#d7ff72' },
    { id: 'bone',  name: 'Bone runner',  c: ['#d5cfb5', '#8f8978', '#f0ead4'], eye: '#e83a3a', venom: '#f4f4f4' },
    { id: 'magma', name: 'Magma burrower', c: ['#c94f32', '#7f2d24', '#ef8a3d'], eye: '#fff2a8', venom: '#f7b03e' },
  ]},
  { id: 'carniplant', name: 'Carnivorous plant', variants: [
    { id: 'snapvine', name: 'Snapvine',    stem: ['#5f923e', '#375e29'], bloom: ['#cf493f', '#8f2d31'], maw: '#f1dd9c', pollen: '#f7dc85' },
    { id: 'corpse',   name: 'Corpse bloom', stem: ['#61733e', '#3c492c'], bloom: ['#8c5aa8', '#57366f'], maw: '#d9c5df', pollen: '#d69acb' },
    { id: 'frost',    name: 'Frostbud',    stem: ['#6999a9', '#416b78'], bloom: ['#8fcce2', '#557fa8'], maw: '#eef8ff', pollen: '#b8f0ff' },
    { id: 'ember',    name: 'Ember maw',   stem: ['#8b6133', '#594022'], bloom: ['#e06436', '#9f3426'], maw: '#f7d06a', pollen: '#fff2a8' },
  ]},
  { id: 'anglerfish', name: 'Anglerfish', variants: [
    { id: 'deepglow', name: 'Deepglow', c: ['#315a82', '#20384f'], belly: '#548bb1', lure: '#8ff2f0', eye: '#e6fbff' },
    { id: 'bloodfin', name: 'Bloodfin', c: ['#9b3843', '#5c252f'], belly: '#cb5b55', lure: '#f7b03e', eye: '#fff2a8' },
    { id: 'frostfin', name: 'Frostfin', c: ['#75abc6', '#476e91'], belly: '#b8dde8', lure: '#eef8ff', eye: '#1a1c2c' },
    { id: 'voidlight', name: 'Voidlight', c: ['#66519a', '#3d315f'], belly: '#967bc2', lure: '#d4b8ff', eye: '#eef0ff' },
  ]},
  { id: 'griffin', name: 'Griffin', variants: [
    { id: 'royal', name: 'Royal', fur: ['#b97934', '#754526'], wing: ['#e5d5aa', '#9d8058'], beak: '#e8b93e', eye: '#1a1c2c' },
    { id: 'ash',   name: 'Ashwing', fur: ['#6f7179', '#44464f'], wing: ['#aeb4bd', '#6e7580'], beak: '#c28f45', eye: '#e8b93e' },
    { id: 'frost', name: 'Frostcrest', fur: ['#779db8', '#4b6f8d'], wing: ['#d9edf2', '#91b8c8'], beak: '#9ccbd8', eye: '#1a1c2c' },
    { id: 'night', name: 'Nightfeather', fur: ['#3d3852', '#252236'], wing: ['#66578f', '#40365f'], beak: '#9b75c8', eye: '#c9f29b' },
  ]},
];
