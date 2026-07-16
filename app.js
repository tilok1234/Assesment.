import * as E from './sprite-engine.js';

const STORAGE_KEY = 'sprite-assembler-v1';
const PRESET_STORAGE_KEY = 'sprite-assembler-presets-v1';
const PRESET_VERSION = 3;
const PALETTE_STORAGE_KEY = 'sprite-assembler-palettes-v1';
const PALETTE_VERSION = 1;
const HISTORY_LIMIT = 100;
const ZOOM_LEVELS = [6, 10, 14, 20];
const EXPORT_SCALES = [4, 8, 12];
const DIRECTION_NAMES = { down: 'Down', left: 'Left', right: 'Right', up: 'Up' };
const DEFAULT_STATE = {
  mode: 'player',
  player: {
    skin: 'peach',
    hairStyle: 'spiky',
    hairColor: 'brown',
    headgear: 'none',
    outfit: 'tunic',
    outfitColor: 'royal',
    weapon: 'sword',
    shield: 'round',
    palette: null,
  },
  enemy: { family: 'slime', variant: 'lime' },
  characterName: '',
  exportName: '',
  dir: 'down',
  anim: 'walk',
  zoom: 14,
  spin: true,
  exportScale: 8,
};

const elements = {
  modeButtons: document.querySelector('#mode-buttons'),
  optionGroups: document.querySelector('#option-groups'),
  paletteEditor: document.querySelector('#palette-editor'),
  paletteSummary: document.querySelector('#palette-summary'),
  paletteInputs: [...document.querySelectorAll('[data-palette-color]')],
  resetPaletteButton: document.querySelector('#reset-palette-button'),
  paletteName: document.querySelector('#palette-name'),
  paletteSelect: document.querySelector('#palette-select'),
  savePaletteButton: document.querySelector('#save-palette-button'),
  loadPaletteButton: document.querySelector('#load-palette-button'),
  deletePaletteButton: document.querySelector('#delete-palette-button'),
  paletteStatus: document.querySelector('#palette-status'),
  animationButtons: document.querySelector('#animation-buttons'),
  zoomButtons: document.querySelector('#zoom-buttons'),
  cycleButton: document.querySelector('#cycle-button'),
  stageCanvas: document.querySelector('#stage-canvas'),
  liveLabel: document.querySelector('#live-label'),
  directionLetter: document.querySelector('#direction-letter'),
  directionButtons: [...document.querySelectorAll('[data-direction]')],
  directionCanvases: new Map(
    [...document.querySelectorAll('[data-direction-canvas]')]
      .map((canvas) => [canvas.dataset.directionCanvas, canvas]),
  ),
  sheetCanvas: document.querySelector('#sheet-canvas'),
  scaleButtons: document.querySelector('#scale-buttons'),
  sizeLabel: document.querySelector('#size-label'),
  characterName: document.querySelector('#character-name'),
  exportName: document.querySelector('#export-name'),
  exportFilenamePreview: document.querySelector('#export-filename-preview'),
  undoButton: document.querySelector('#undo-button'),
  redoButton: document.querySelector('#redo-button'),
  randomizeButton: document.querySelector('#randomize-button'),
  presetName: document.querySelector('#preset-name'),
  presetSelect: document.querySelector('#preset-select'),
  savePresetButton: document.querySelector('#save-preset-button'),
  loadPresetButton: document.querySelector('#load-preset-button'),
  deletePresetButton: document.querySelector('#delete-preset-button'),
  presetStatus: document.querySelector('#preset-status'),
  downloadButton: document.querySelector('#download-button'),
};

const thumbCache = new Map();
const spinCells = E.ANIMS.flatMap((anim) => E.DIRS.map((dir) => ({ anim, dir })));
let state = loadState();
let presetLibrary = loadPresetLibrary();
let paletteLibrary = loadPaletteLibrary();
let selectedPresetId = '';
let selectedPaletteId = '';
const historyPast = [];
const historyFuture = [];
let lastTime = 0;
let spinIndex = findSpinIndex();
let spinTime = 0;
let sheetKey = '';

function listHas(list, value) {
  return list.some((item) => item.id === value);
}

function validId(list, value, fallback) {
  return listHas(list, value) ? value : fallback;
}

function sanitizeText(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, maxLength)
    : '';
}

function catalogColorPair(list, id) {
  const item = list.find((entry) => entry.id === id) || list[0];
  return [...item.c];
}

function catalogPlayerPalette(player) {
  return {
    skin: catalogColorPair(E.SKINS, player.skin),
    hair: catalogColorPair(E.HAIR_COLORS, player.hairColor),
    outfit: catalogColorPair(E.OUTFIT_COLORS, player.outfitColor),
  };
}

function sanitizeHexColor(value, fallback) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
    ? value.toLocaleLowerCase()
    : fallback;
}

function sanitizeColorPair(value, fallback) {
  return [
    sanitizeHexColor(value?.[0], fallback[0]),
    sanitizeHexColor(value?.[1], fallback[1]),
  ];
}

function sanitizeCustomPalette(value, player) {
  if (!value || typeof value !== 'object') return null;
  const fallback = catalogPlayerPalette(player);
  return {
    skin: sanitizeColorPair(value.skin, fallback.skin),
    hair: sanitizeColorPair(value.hair, fallback.hair),
    outfit: sanitizeColorPair(value.outfit, fallback.outfit),
  };
}

function clonePalette(palette) {
  return {
    skin: [...palette.skin],
    hair: [...palette.hair],
    outfit: [...palette.outfit],
  };
}

function resolvedPlayerPalette(player = state.player) {
  return sanitizeCustomPalette(player.palette, player) || catalogPlayerPalette(player);
}

function sanitizePlayer(player = {}) {
  const sanitized = {
    skin: validId(E.SKINS, player.skin, DEFAULT_STATE.player.skin),
    hairStyle: validId(E.HAIR_STYLES, player.hairStyle, DEFAULT_STATE.player.hairStyle),
    hairColor: validId(E.HAIR_COLORS, player.hairColor, DEFAULT_STATE.player.hairColor),
    headgear: validId(E.HEADGEAR, player.headgear, DEFAULT_STATE.player.headgear),
    outfit: validId(E.OUTFITS, player.outfit, DEFAULT_STATE.player.outfit),
    outfitColor: validId(E.OUTFIT_COLORS, player.outfitColor, DEFAULT_STATE.player.outfitColor),
    weapon: validId(E.WEAPONS, player.weapon, DEFAULT_STATE.player.weapon),
    shield: validId(E.SHIELDS, player.shield, DEFAULT_STATE.player.shield),
  };
  sanitized.palette = sanitizeCustomPalette(player.palette, sanitized);
  return sanitized;
}

function sanitizeEnemy(enemy = {}) {
  const family = E.ENEMIES.find((item) => item.id === enemy.family) || E.ENEMIES[0];
  const variant = validId(family.variants, enemy.variant, family.variants[0].id);
  return { family: family.id, variant };
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {}

  if (!saved || typeof saved !== 'object') return structuredClone(DEFAULT_STATE);

  const loaded = {
    ...DEFAULT_STATE,
    ...saved,
    player: sanitizePlayer(saved.player),
    enemy: sanitizeEnemy(saved.enemy),
  };

  loaded.mode = loaded.mode === 'enemy' ? 'enemy' : 'player';
  loaded.characterName = sanitizeText(loaded.characterName, 48);
  loaded.exportName = sanitizeText(loaded.exportName, 80);
  loaded.dir = E.DIRS.includes(loaded.dir) ? loaded.dir : DEFAULT_STATE.dir;
  loaded.anim = listHas(E.ANIMS, loaded.anim) ? loaded.anim : DEFAULT_STATE.anim;
  loaded.zoom = ZOOM_LEVELS.includes(loaded.zoom) ? loaded.zoom : DEFAULT_STATE.zoom;
  loaded.exportScale = EXPORT_SCALES.includes(loaded.exportScale)
    ? loaded.exportScale
    : DEFAULT_STATE.exportScale;
  loaded.spin = loaded.spin !== false;

  return loaded;
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function editableSnapshot(source = state) {
  return {
    mode: source.mode,
    player: {
      ...source.player,
      palette: source.player.palette ? clonePalette(source.player.palette) : null,
    },
    enemy: { ...source.enemy },
    characterName: source.characterName,
    exportName: source.exportName,
  };
}

function snapshotsMatch(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function pushHistory(stack, snapshot) {
  stack.push(snapshot);
  if (stack.length > HISTORY_LIMIT) stack.shift();
}

function setState(patch, { persist = true, render = true, recordHistory = true } = {}) {
  const tracksSprite = ['mode', 'player', 'enemy', 'characterName', 'exportName']
    .some((key) => Object.prototype.hasOwnProperty.call(patch, key));
  const before = tracksSprite ? editableSnapshot() : null;
  const next = { ...state, ...patch };

  if (recordHistory && before && !snapshotsMatch(before, editableSnapshot(next))) {
    pushHistory(historyPast, before);
    historyFuture.length = 0;
  }

  state = next;
  if (persist) persistState();
  if (render) renderUi();
}

function restoreSnapshot(snapshot) {
  state = {
    ...state,
    mode: snapshot.mode,
    player: sanitizePlayer(snapshot.player),
    enemy: sanitizeEnemy(snapshot.enemy),
    characterName: sanitizeText(snapshot.characterName, 48),
    exportName: sanitizeText(snapshot.exportName, 80),
  };
  persistState();
  renderUi();
}

function undo() {
  if (!historyPast.length) return;
  pushHistory(historyFuture, editableSnapshot());
  restoreSnapshot(historyPast.pop());
}

function redo() {
  if (!historyFuture.length) return;
  pushHistory(historyPast, editableSnapshot());
  restoreSnapshot(historyFuture.pop());
}

function currentSpec() {
  return state.mode === 'player'
    ? { kind: 'player', ...state.player }
    : { kind: 'enemy', ...state.enemy };
}

function sanitizeFilenameBase(value) {
  let base = sanitizeText(value, 80)
    .trim()
    .replace(/\.png$/i, '')
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/-+/g, '-')
    .replace(/[. ]+$/g, '')
    .trim()
    .slice(0, 80)
    .replace(/[. ]+$/g, '');
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(base)) base = `sprite-${base}`;
  return base;
}

function generatedNameBase() {
  const characterName = sanitizeFilenameBase(state.characterName)
    .toLocaleLowerCase()
    .replace(/\s+/g, '-');
  return characterName || E.describe(currentSpec());
}

function exportFilename() {
  const customName = sanitizeFilenameBase(state.exportName);
  if (customName) return `${customName}.png`;
  return `${generatedNameBase()}-sheet@${state.exportScale}x.png`;
}

function sanitizePreset(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const kind = raw.kind === 'enemy' ? 'enemy' : raw.kind === 'player' ? 'player' : null;
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 48) : '';
  if (!kind || !name) return null;

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : makePresetId(),
    name,
    kind,
    spec: kind === 'player' ? sanitizePlayer(raw.spec) : sanitizeEnemy(raw.spec),
    characterName: sanitizeText(raw.characterName, 48),
    exportName: sanitizeText(raw.exportName, 80),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

function loadPresetLibrary() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) || 'null');
  } catch {}

  if (!saved || ![1, 2, PRESET_VERSION].includes(saved.version) || !Array.isArray(saved.presets)) {
    return { version: PRESET_VERSION, presets: [] };
  }

  const ids = new Set();
  const presets = [];
  for (const raw of saved.presets) {
    const preset = sanitizePreset(raw);
    if (!preset || ids.has(preset.id)) continue;
    ids.add(preset.id);
    presets.push(preset);
  }
  return { version: PRESET_VERSION, presets };
}

function persistPresetLibrary() {
  try {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presetLibrary));
  } catch {}
}

function makePresetId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function selectedPreset() {
  return presetLibrary.presets.find((preset) => preset.id === selectedPresetId) || null;
}

function presetLabel(preset) {
  return `${preset.kind === 'player' ? 'Player' : 'Enemy'} · ${preset.name}`;
}

function setPresetStatus(message) {
  elements.presetStatus.textContent = message;
}

function savePreset() {
  const spec = currentSpec();
  const typedName = elements.presetName.value.trim().slice(0, 48);
  const name = typedName || E.describe(spec).replaceAll('-', ' ');
  const normalizedName = name.toLocaleLowerCase();
  const selected = selectedPreset();
  const sameSelectedName = selected?.kind === spec.kind
    && selected.name.toLocaleLowerCase() === normalizedName;
  const existing = sameSelectedName
    ? selected
    : presetLibrary.presets.find((preset) => (
      preset.kind === spec.kind && preset.name.toLocaleLowerCase() === normalizedName
    ));
  const now = new Date().toISOString();
  const preset = {
    id: existing?.id || makePresetId(),
    name,
    kind: spec.kind,
    spec: spec.kind === 'player' ? sanitizePlayer(spec) : sanitizeEnemy(spec),
    characterName: state.characterName,
    exportName: state.exportName,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (existing) {
    presetLibrary.presets = presetLibrary.presets.map((item) => item.id === existing.id ? preset : item);
  } else {
    presetLibrary.presets.push(preset);
  }

  selectedPresetId = preset.id;
  elements.presetName.value = preset.name;
  persistPresetLibrary();
  renderPresetControls();
  setPresetStatus(existing ? `Updated “${preset.name}”.` : `Saved “${preset.name}”.`);
}

function loadSelectedPreset() {
  const preset = selectedPreset();
  if (!preset) return;
  const patch = preset.kind === 'player'
    ? { mode: 'player', player: sanitizePlayer(preset.spec) }
    : { mode: 'enemy', enemy: sanitizeEnemy(preset.spec) };
  patch.characterName = preset.characterName;
  patch.exportName = preset.exportName;
  setState(patch);
  elements.presetName.value = preset.name;
  setPresetStatus(`Loaded “${preset.name}”.`);
}

function deleteSelectedPreset() {
  const preset = selectedPreset();
  if (!preset) return;
  presetLibrary.presets = presetLibrary.presets.filter((item) => item.id !== preset.id);
  selectedPresetId = '';
  elements.presetName.value = '';
  persistPresetLibrary();
  renderPresetControls();
  setPresetStatus(`Deleted “${preset.name}”.`);
}

function sanitizePalettePreset(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 48) : '';
  const palette = sanitizeCustomPalette(raw.palette, DEFAULT_STATE.player);
  if (!name || !palette) return null;
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : makePaletteId(),
    name,
    palette,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

function loadPaletteLibrary() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(PALETTE_STORAGE_KEY) || 'null');
  } catch {}
  if (!saved || saved.version !== PALETTE_VERSION || !Array.isArray(saved.palettes)) {
    return { version: PALETTE_VERSION, palettes: [] };
  }

  const ids = new Set();
  const palettes = [];
  for (const raw of saved.palettes) {
    const preset = sanitizePalettePreset(raw);
    if (!preset || ids.has(preset.id)) continue;
    ids.add(preset.id);
    palettes.push(preset);
  }
  return { version: PALETTE_VERSION, palettes };
}

function persistPaletteLibrary() {
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(paletteLibrary));
  } catch {}
}

function makePaletteId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `palette-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function selectedPalettePreset() {
  return paletteLibrary.palettes.find((palette) => palette.id === selectedPaletteId) || null;
}

function setPaletteStatus(message) {
  elements.paletteStatus.textContent = message;
}

function updatePlayerPalette(material, index, value) {
  const palette = clonePalette(resolvedPlayerPalette());
  palette[material][index] = sanitizeHexColor(value, palette[material][index]);
  setState({ player: { ...state.player, palette } });
}

function resetPlayerPalette() {
  if (!state.player.palette) return;
  setState({ player: { ...state.player, palette: null } });
  setPaletteStatus('Using the selected catalog colors.');
}

function savePalettePreset() {
  const typedName = elements.paletteName.value.trim().slice(0, 48);
  const name = typedName || `Palette ${paletteLibrary.palettes.length + 1}`;
  const normalizedName = name.toLocaleLowerCase();
  const selected = selectedPalettePreset();
  const existing = selected?.name.toLocaleLowerCase() === normalizedName
    ? selected
    : paletteLibrary.palettes.find((palette) => palette.name.toLocaleLowerCase() === normalizedName);
  const now = new Date().toISOString();
  const preset = {
    id: existing?.id || makePaletteId(),
    name,
    palette: clonePalette(resolvedPlayerPalette()),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (existing) {
    paletteLibrary.palettes = paletteLibrary.palettes.map((item) => item.id === existing.id ? preset : item);
  } else {
    paletteLibrary.palettes.push(preset);
  }
  selectedPaletteId = preset.id;
  elements.paletteName.value = preset.name;
  persistPaletteLibrary();
  renderPaletteControls();
  setPaletteStatus(existing ? `Updated “${preset.name}”.` : `Saved “${preset.name}”.`);
}

function loadSelectedPalette() {
  const preset = selectedPalettePreset();
  if (!preset) return;
  setState({ player: { ...state.player, palette: clonePalette(preset.palette) } });
  elements.paletteName.value = preset.name;
  setPaletteStatus(`Loaded “${preset.name}”.`);
}

function deleteSelectedPalette() {
  const preset = selectedPalettePreset();
  if (!preset) return;
  paletteLibrary.palettes = paletteLibrary.palettes.filter((item) => item.id !== preset.id);
  selectedPaletteId = '';
  elements.paletteName.value = '';
  persistPaletteLibrary();
  renderPaletteControls();
  setPaletteStatus(`Deleted “${preset.name}”.`);
}

function currentFamily() {
  return E.ENEMIES.find((family) => family.id === state.enemy.family) || E.ENEMIES[0];
}

function setPlayerOption(key, value) {
  const player = { ...state.player, [key]: value };
  if (state.player.palette) {
    const palette = clonePalette(resolvedPlayerPalette());
    if (key === 'skin') palette.skin = catalogColorPair(E.SKINS, value);
    if (key === 'hairColor') palette.hair = catalogColorPair(E.HAIR_COLORS, value);
    if (key === 'outfitColor') palette.outfit = catalogColorPair(E.OUTFIT_COLORS, value);
    player.palette = palette;
  }
  setState({ player });
}

function setEnemyFamily(familyId) {
  const family = E.ENEMIES.find((item) => item.id === familyId) || E.ENEMIES[0];
  setState({ enemy: { family: family.id, variant: family.variants[0].id } });
}

function findSpinIndex() {
  const index = spinCells.findIndex((cell) => cell.anim.id === state.anim && cell.dir === state.dir);
  return index >= 0 ? index : 0;
}

function makeButton(label, active, onClick, className = 'segment-button') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${className}${active ? ' active' : ''}`;
  button.textContent = label;
  button.setAttribute('aria-pressed', String(active));
  button.addEventListener('click', onClick);
  return button;
}

function renderModeButtons() {
  elements.modeButtons.replaceChildren(
    makeButton('Player', state.mode === 'player', () => setState({ mode: 'player' })),
    makeButton('Enemies', state.mode === 'enemy', () => setState({ mode: 'enemy' })),
  );
}

function thumbUrl(spec) {
  const key = JSON.stringify(spec);
  if (!thumbCache.has(key)) {
    if (thumbCache.size > 800) thumbCache.clear();
    thumbCache.set(key, E.thumbURL(spec));
  }
  return thumbCache.get(key);
}

function createOptionGroup({ label, selectedName, type, options, randomize, canRandomize }) {
  const group = document.createElement('section');
  group.className = 'option-group';

  const heading = document.createElement('div');
  heading.className = 'option-heading';
  const title = document.createElement('h2');
  title.textContent = label;
  const headingMeta = document.createElement('div');
  headingMeta.className = 'option-heading-meta';
  const selection = document.createElement('span');
  selection.className = 'option-selection';
  selection.textContent = selectedName;
  const randomizeButton = document.createElement('button');
  randomizeButton.type = 'button';
  randomizeButton.className = 'category-randomize';
  randomizeButton.textContent = '↻';
  randomizeButton.title = `Randomize ${label}`;
  randomizeButton.setAttribute('aria-label', `Randomize ${label}`);
  randomizeButton.disabled = !canRandomize;
  randomizeButton.addEventListener('click', randomize);
  headingMeta.append(selection, randomizeButton);
  heading.append(title, headingMeta);
  group.append(heading);

  const choices = document.createElement('div');
  choices.className = type === 'dots' ? 'dot-options' : 'thumbnail-options';

  for (const option of options) {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = option.name;
    button.setAttribute('aria-label', `${label}: ${option.name}`);
    button.setAttribute('aria-pressed', String(option.active));
    button.addEventListener('click', option.pick);

    if (type === 'dots') {
      button.className = `dot-option${option.active ? ' active' : ''}`;
      button.style.background = option.color;
    } else {
      button.className = `thumbnail-option${option.active ? ' active' : ''}`;
      const thumbnail = document.createElement('span');
      thumbnail.className = 'thumbnail';
      thumbnail.style.backgroundImage = `url("${option.image}")`;
      const name = document.createElement('span');
      name.className = 'thumbnail-label';
      name.textContent = option.name;
      button.append(thumbnail, name);
    }
    choices.append(button);
  }

  group.append(choices);
  return group;
}

function randomDifferent(list, selected) {
  const choices = list.filter((item) => item.id !== selected);
  if (!choices.length) return null;
  return choices[Math.floor(Math.random() * choices.length)];
}

function randomizeChoice(list, selected, pick) {
  const choice = randomDifferent(list, selected);
  if (choice) pick(choice.id);
}

function dotGroup(label, list, selected, pick) {
  const selectedItem = list.find((item) => item.id === selected) || list[0];
  return {
    label,
    selectedName: selectedItem.name,
    type: 'dots',
    randomize: () => randomizeChoice(list, selectedItem.id, pick),
    canRandomize: list.length > 1,
    options: list.map((item) => ({
      name: item.name,
      color: item.c[0],
      active: item.id === selected,
      pick: () => pick(item.id),
    })),
  };
}

function thumbnailGroup(label, list, selected, pick, specFor) {
  const selectedItem = list.find((item) => item.id === selected) || list[0];
  return {
    label,
    selectedName: selectedItem.name,
    type: 'thumbnails',
    randomize: () => randomizeChoice(list, selectedItem.id, pick),
    canRandomize: list.length > 1,
    options: list.map((item) => ({
      name: item.name,
      image: thumbUrl(specFor(item)),
      active: item.id === selected,
      pick: () => pick(item.id),
    })),
  };
}

function playerGroups() {
  const player = state.player;
  const spec = (patch) => ({ kind: 'player', ...player, ...patch });
  return [
    dotGroup('Skin', E.SKINS, player.skin, (value) => setPlayerOption('skin', value)),
    thumbnailGroup(
      'Hair style',
      E.HAIR_STYLES,
      player.hairStyle,
      (value) => setPlayerOption('hairStyle', value),
      (item) => spec({ hairStyle: item.id, headgear: 'none' }),
    ),
    dotGroup('Hair color', E.HAIR_COLORS, player.hairColor, (value) => setPlayerOption('hairColor', value)),
    thumbnailGroup(
      'Headgear',
      E.HEADGEAR,
      player.headgear,
      (value) => setPlayerOption('headgear', value),
      (item) => spec({ headgear: item.id }),
    ),
    thumbnailGroup(
      'Outfit',
      E.OUTFITS,
      player.outfit,
      (value) => setPlayerOption('outfit', value),
      (item) => spec({ outfit: item.id }),
    ),
    dotGroup(
      'Outfit color',
      E.OUTFIT_COLORS,
      player.outfitColor,
      (value) => setPlayerOption('outfitColor', value),
    ),
    thumbnailGroup(
      'Weapon',
      E.WEAPONS,
      player.weapon,
      (value) => setPlayerOption('weapon', value),
      (item) => spec({ weapon: item.id }),
    ),
    thumbnailGroup(
      'Shield',
      E.SHIELDS,
      player.shield,
      (value) => setPlayerOption('shield', value),
      (item) => spec({ shield: item.id }),
    ),
  ];
}

function enemyGroups() {
  const family = currentFamily();
  return [
    thumbnailGroup(
      'Family',
      E.ENEMIES,
      family.id,
      setEnemyFamily,
      (item) => ({ kind: 'enemy', family: item.id, variant: item.variants[0].id }),
    ),
    thumbnailGroup(
      'Variant',
      family.variants,
      state.enemy.variant,
      (variant) => setState({ enemy: { family: family.id, variant } }),
      (item) => ({ kind: 'enemy', family: family.id, variant: item.id }),
    ),
  ];
}

function renderOptionGroups() {
  const groups = state.mode === 'player' ? playerGroups() : enemyGroups();
  elements.optionGroups.replaceChildren(...groups.map(createOptionGroup));
}

function renderPlaybackControls() {
  elements.animationButtons.replaceChildren(...E.ANIMS.map((anim) => makeButton(
    anim.name,
    !state.spin && state.anim === anim.id,
    () => setState({ anim: anim.id, spin: false }),
  )));

  elements.zoomButtons.replaceChildren(...ZOOM_LEVELS.map((zoom) => makeButton(
    `${zoom}x`,
    state.zoom === zoom,
    () => setState({ zoom }),
  )));

  elements.cycleButton.classList.toggle('active', state.spin);
  elements.cycleButton.setAttribute('aria-pressed', String(state.spin));
  elements.stageCanvas.style.width = `${E.SIZE * state.zoom}px`;
}

function renderDirectionControls() {
  elements.directionLetter.textContent = DIRECTION_NAMES[state.dir][0];
  for (const button of elements.directionButtons) {
    const active = button.dataset.direction === state.dir;
    button.classList.toggle('active', active && !state.spin);
    button.classList.toggle('cycling', active && state.spin);
    button.setAttribute('aria-pressed', String(active));
  }
}

function renderExportControls() {
  elements.scaleButtons.replaceChildren(...EXPORT_SCALES.map((scale) => makeButton(
    `${scale}x`,
    state.exportScale === scale,
    () => setState({ exportScale: scale }),
  )));
  elements.sizeLabel.textContent = `${E.SHEET_COLS * E.SIZE * state.exportScale}x${E.DIRS.length * E.SIZE * state.exportScale}px`;
}

function renderExportFilename() {
  elements.exportFilenamePreview.textContent = exportFilename();
}

function renderNamingControls() {
  if (elements.characterName.value !== state.characterName) {
    elements.characterName.value = state.characterName;
  }
  if (elements.exportName.value !== state.exportName) {
    elements.exportName.value = state.exportName;
  }
  renderExportFilename();
}

function renderHistoryControls() {
  elements.undoButton.disabled = historyPast.length === 0;
  elements.redoButton.disabled = historyFuture.length === 0;
  elements.undoButton.title = historyPast.length ? 'Undo sprite change (Ctrl+Z)' : 'Nothing to undo';
  elements.redoButton.title = historyFuture.length ? 'Redo sprite change (Ctrl+Y)' : 'Nothing to redo';
}

function renderPresetControls() {
  if (!presetLibrary.presets.some((preset) => preset.id === selectedPresetId)) {
    selectedPresetId = '';
  }

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = presetLibrary.presets.length ? 'Choose a preset' : 'No presets saved';
  const options = presetLibrary.presets.map((preset) => {
    const option = document.createElement('option');
    option.value = preset.id;
    option.textContent = presetLabel(preset);
    return option;
  });
  elements.presetSelect.replaceChildren(placeholder, ...options);
  elements.presetSelect.value = selectedPresetId;
  elements.presetSelect.disabled = presetLibrary.presets.length === 0;
  elements.loadPresetButton.disabled = !selectedPresetId;
  elements.deletePresetButton.disabled = !selectedPresetId;
}

function renderPaletteControls() {
  elements.paletteEditor.hidden = state.mode !== 'player';
  if (state.mode !== 'player') return;

  const palette = resolvedPlayerPalette();
  elements.paletteSummary.textContent = state.player.palette ? 'Custom colors' : 'Catalog colors';
  elements.resetPaletteButton.disabled = !state.player.palette;
  for (const input of elements.paletteInputs) {
    const [material, indexText] = input.dataset.paletteColor.split('.');
    input.value = palette[material][Number(indexText)];
  }

  if (!paletteLibrary.palettes.some((preset) => preset.id === selectedPaletteId)) {
    selectedPaletteId = '';
  }
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = paletteLibrary.palettes.length ? 'Choose a palette' : 'No palettes saved';
  const options = paletteLibrary.palettes.map((preset) => {
    const option = document.createElement('option');
    option.value = preset.id;
    option.textContent = preset.name;
    return option;
  });
  elements.paletteSelect.replaceChildren(placeholder, ...options);
  elements.paletteSelect.value = selectedPaletteId;
  elements.paletteSelect.disabled = paletteLibrary.palettes.length === 0;
  elements.loadPaletteButton.disabled = !selectedPaletteId;
  elements.deletePaletteButton.disabled = !selectedPaletteId;
}

function renderUi() {
  renderModeButtons();
  renderPaletteControls();
  renderOptionGroups();
  renderPlaybackControls();
  renderDirectionControls();
  renderExportControls();
  renderNamingControls();
  renderHistoryControls();
  renderPresetControls();
}

function updateSheet(spec) {
  const key = JSON.stringify(spec);
  if (key === sheetKey) return;
  sheetKey = key;
  const context = elements.sheetCanvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, elements.sheetCanvas.width, elements.sheetCanvas.height);
  context.drawImage(E.buildSheet(spec, 1), 0, 0);
}

function drawFrame(animId, direction, frame) {
  const spec = currentSpec();
  E.drawSprite(elements.stageCanvas.getContext('2d'), spec, direction, animId, frame, { shadow: true });

  for (const dir of E.DIRS) {
    const canvas = elements.directionCanvases.get(dir);
    E.drawSprite(canvas.getContext('2d'), spec, dir, animId, frame, { shadow: true });
  }

  const anim = E.ANIMS.find((item) => item.id === animId) || E.ANIMS[0];
  const playbackLabel = `${anim.name} · ${DIRECTION_NAMES[direction]}`;
  elements.liveLabel.textContent = state.characterName.trim()
    ? `${state.characterName.trim()} · ${playbackLabel}`.toUpperCase()
    : playbackLabel.toUpperCase();
  updateSheet(spec);
}

function tick(time) {
  const delta = lastTime ? Math.min(100, time - lastTime) : 16;
  lastTime = time;
  let animId = state.anim;
  let direction = state.dir;
  let frame = 0;

  if (state.spin) {
    const cell = spinCells[spinIndex % spinCells.length];
    const loops = cell.anim.frames <= 2 ? 2 : 1;
    const duration = cell.anim.frames * cell.anim.ms * loops;
    spinTime += delta;

    if (spinTime >= duration) {
      spinTime = 0;
      spinIndex = (spinIndex + 1) % spinCells.length;
      const next = spinCells[spinIndex];
      state = { ...state, anim: next.anim.id, dir: next.dir };
      renderPlaybackControls();
      renderDirectionControls();
    }

    const activeCell = spinCells[spinIndex];
    animId = activeCell.anim.id;
    direction = activeCell.dir;
    frame = Math.floor(spinTime / activeCell.anim.ms) % activeCell.anim.frames;
  } else {
    const anim = E.ANIMS.find((item) => item.id === animId) || E.ANIMS[0];
    frame = Math.floor(time / anim.ms) % anim.frames;
  }

  drawFrame(animId, direction, frame);
  requestAnimationFrame(tick);
}

function toggleCycle() {
  const spin = !state.spin;
  if (spin) {
    spinIndex = findSpinIndex();
    spinTime = 0;
  }
  setState({ spin });
}

function chooseDirection(direction) {
  spinTime = 0;
  setState({ dir: direction, spin: false });
}

function randomize() {
  if (state.mode === 'player') setState({ player: sanitizePlayer(E.randomPlayer()) });
  else setState({ enemy: E.randomEnemy() });
}

function triggerDownload(canvas, filename) {
  const save = (url, revoke = false) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    if (revoke) setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (blob) save(URL.createObjectURL(blob), true);
      else save(canvas.toDataURL('image/png'));
    }, 'image/png');
  } else {
    save(canvas.toDataURL('image/png'));
  }
}

function downloadSheet() {
  const spec = currentSpec();
  const canvas = E.buildSheet(spec, state.exportScale);
  triggerDownload(canvas, exportFilename());
}

elements.cycleButton.addEventListener('click', toggleCycle);
elements.undoButton.addEventListener('click', undo);
elements.redoButton.addEventListener('click', redo);
elements.randomizeButton.addEventListener('click', randomize);
elements.savePresetButton.addEventListener('click', savePreset);
elements.loadPresetButton.addEventListener('click', loadSelectedPreset);
elements.deletePresetButton.addEventListener('click', deleteSelectedPreset);
for (const input of elements.paletteInputs) {
  input.addEventListener('change', () => {
    const [material, indexText] = input.dataset.paletteColor.split('.');
    updatePlayerPalette(material, Number(indexText), input.value);
    setPaletteStatus('Custom palette applied.');
  });
}
elements.resetPaletteButton.addEventListener('click', resetPlayerPalette);
elements.savePaletteButton.addEventListener('click', savePalettePreset);
elements.loadPaletteButton.addEventListener('click', loadSelectedPalette);
elements.deletePaletteButton.addEventListener('click', deleteSelectedPalette);
elements.paletteSelect.addEventListener('change', () => {
  selectedPaletteId = elements.paletteSelect.value;
  const preset = selectedPalettePreset();
  elements.paletteName.value = preset?.name || '';
  renderPaletteControls();
  setPaletteStatus(preset ? `Selected “${preset.name}”.` : 'Reusable across player presets.');
});
elements.paletteName.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  savePalettePreset();
});
elements.characterName.addEventListener('input', () => {
  const characterName = sanitizeText(elements.characterName.value, 48);
  setState({ characterName }, { render: false, recordHistory: false });
  renderExportFilename();
});
elements.exportName.addEventListener('input', () => {
  const exportName = sanitizeText(elements.exportName.value, 80);
  setState({ exportName }, { render: false, recordHistory: false });
  renderExportFilename();
});
elements.presetSelect.addEventListener('change', () => {
  selectedPresetId = elements.presetSelect.value;
  const preset = selectedPreset();
  elements.presetName.value = preset?.name || '';
  renderPresetControls();
  setPresetStatus(preset ? `Selected “${preset.name}”.` : 'Presets stay on this device.');
});
elements.presetName.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  savePreset();
});
elements.downloadButton.addEventListener('click', downloadSheet);
for (const button of elements.directionButtons) {
  button.addEventListener('click', () => chooseDirection(button.dataset.direction));
}

window.addEventListener('keydown', (event) => {
  const target = event.target;
  const editingText = target instanceof Element
    && target.matches('input, select, textarea, [contenteditable="true"]');
  if (editingText) return;

  const shortcut = (event.ctrlKey || event.metaKey) && !event.altKey;
  const key = event.key.toLocaleLowerCase();
  if (shortcut && key === 'z') {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }
  if (shortcut && key === 'y') {
    event.preventDefault();
    redo();
    return;
  }

  const directions = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  chooseDirection(direction);
});

renderUi();
requestAnimationFrame(tick);
