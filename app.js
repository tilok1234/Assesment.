import * as E from './sprite-engine.js';

const STORAGE_KEY = 'sprite-assembler-v1';
const PRESET_STORAGE_KEY = 'sprite-assembler-presets-v1';
const PRESET_VERSION = 4;
const PALETTE_STORAGE_KEY = 'sprite-assembler-palettes-v1';
const PALETTE_VERSION = 1;
const HISTORY_LIMIT = 100;
const ZOOM_LEVELS = [6, 10, 14, 20];
const PLAYBACK_SPEEDS = [0.5, 1, 2];
const EXPORT_SCALES = [4, 8, 12];
const EXPORT_SCOPES = ['full', 'animation', 'direction'];
const DIRECTION_NAMES = { down: 'Down', left: 'Left', right: 'Right', up: 'Up' };
const DEFAULT_STATE = {
  mode: 'player',
  player: {
    skin: 'peach',
    hairStyle: 'spiky',
    hairColor: 'brown',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'tunic',
    outfitColor: 'royal',
    weapon: 'sword',
    weaponTier: 'tier1',
    shield: 'round',
    palette: null,
  },
  enemy: { family: 'slime', variant: 'lime' },
  characterName: '',
  exportName: '',
  dir: 'down',
  anim: 'walk',
  frame: 0,
  playing: true,
  playbackSpeed: 1,
  zoom: 14,
  spin: true,
  exportScale: 8,
  exportScope: 'full',
  exportAnim: 'walk',
  exportDir: 'down',
  comparison: null,
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
  previousFrameButton: document.querySelector('#previous-frame-button'),
  playPauseButton: document.querySelector('#play-pause-button'),
  nextFrameButton: document.querySelector('#next-frame-button'),
  frameButtons: document.querySelector('#frame-buttons'),
  frameReadout: document.querySelector('#frame-readout'),
  playbackSpeed: document.querySelector('#playback-speed'),
  stageCanvas: document.querySelector('#stage-canvas'),
  liveLabel: document.querySelector('#live-label'),
  directionLetter: document.querySelector('#direction-letter'),
  directionButtons: [...document.querySelectorAll('[data-direction]')],
  directionCanvases: new Map(
    [...document.querySelectorAll('[data-direction-canvas]')]
      .map((canvas) => [canvas.dataset.directionCanvas, canvas]),
  ),
  sheetCanvas: document.querySelector('#sheet-canvas'),
  sheetTitle: document.querySelector('#sheet-title'),
  sheetContract: document.querySelector('#sheet-contract'),
  exportScope: document.querySelector('#export-scope'),
  scaleButtons: document.querySelector('#scale-buttons'),
  sizeLabel: document.querySelector('#size-label'),
  characterName: document.querySelector('#character-name'),
  exportName: document.querySelector('#export-name'),
  exportFilenamePreview: document.querySelector('#export-filename-preview'),
  undoButton: document.querySelector('#undo-button'),
  redoButton: document.querySelector('#redo-button'),
  resetButton: document.querySelector('#reset-button'),
  duplicateButton: document.querySelector('#duplicate-button'),
  compareButton: document.querySelector('#compare-button'),
  randomizeButton: document.querySelector('#randomize-button'),
  presetName: document.querySelector('#preset-name'),
  presetSelect: document.querySelector('#preset-select'),
  savePresetButton: document.querySelector('#save-preset-button'),
  loadPresetButton: document.querySelector('#load-preset-button'),
  deletePresetButton: document.querySelector('#delete-preset-button'),
  presetStatus: document.querySelector('#preset-status'),
  downloadButton: document.querySelector('#download-button'),
  compareDialog: document.querySelector('#compare-dialog'),
  compareContext: document.querySelector('#compare-context'),
  closeCompareButton: document.querySelector('#close-compare-button'),
  savedCopyCanvas: document.querySelector('#saved-copy-canvas'),
  currentCopyCanvas: document.querySelector('#current-copy-canvas'),
  savedCopyName: document.querySelector('#saved-copy-name'),
  currentCopyName: document.querySelector('#current-copy-name'),
  savedCopyMeta: document.querySelector('#saved-copy-meta'),
  currentCopyMeta: document.querySelector('#current-copy-meta'),
  restoreCopyButton: document.querySelector('#restore-copy-button'),
  keepCurrentButton: document.querySelector('#keep-current-button'),
  removeCopyButton: document.querySelector('#remove-copy-button'),
  replaceCopyButton: document.querySelector('#replace-copy-button'),
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
let animationTime = 0;
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
  const weapon = validId(E.WEAPONS, player.weapon, DEFAULT_STATE.player.weapon);
  const sanitized = {
    skin: validId(E.SKINS, player.skin, DEFAULT_STATE.player.skin),
    hairStyle: validId(E.HAIR_STYLES, player.hairStyle, DEFAULT_STATE.player.hairStyle),
    hairColor: validId(E.HAIR_COLORS, player.hairColor, DEFAULT_STATE.player.hairColor),
    faceDetail: validId(E.FACIAL_DETAILS, player.faceDetail, DEFAULT_STATE.player.faceDetail),
    headgear: validId(E.HEADGEAR, player.headgear, DEFAULT_STATE.player.headgear),
    outfit: validId(E.OUTFITS, player.outfit, DEFAULT_STATE.player.outfit),
    outfitColor: validId(E.OUTFIT_COLORS, player.outfitColor, DEFAULT_STATE.player.outfitColor),
    weapon,
    weaponTier: weapon === 'none'
      ? 'tier1'
      : validId(E.WEAPON_TIERS, player.weaponTier, DEFAULT_STATE.player.weaponTier),
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

function sanitizeEditableSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return null;
  return {
    mode: snapshot.mode === 'enemy' ? 'enemy' : 'player',
    player: sanitizePlayer(snapshot.player),
    enemy: sanitizeEnemy(snapshot.enemy),
    characterName: sanitizeText(snapshot.characterName, 48),
    exportName: sanitizeText(snapshot.exportName, 80),
  };
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
  const loadedAnimation = E.ANIMS.find((anim) => anim.id === loaded.anim) || E.ANIMS[0];
  loaded.frame = Number.isInteger(loaded.frame)
    ? Math.max(0, Math.min(loadedAnimation.frames - 1, loaded.frame))
    : DEFAULT_STATE.frame;
  loaded.playing = loaded.playing !== false;
  loaded.playbackSpeed = PLAYBACK_SPEEDS.includes(loaded.playbackSpeed)
    ? loaded.playbackSpeed
    : DEFAULT_STATE.playbackSpeed;
  loaded.zoom = ZOOM_LEVELS.includes(loaded.zoom) ? loaded.zoom : DEFAULT_STATE.zoom;
  loaded.exportScale = EXPORT_SCALES.includes(loaded.exportScale)
    ? loaded.exportScale
    : DEFAULT_STATE.exportScale;
  loaded.exportScope = EXPORT_SCOPES.includes(loaded.exportScope)
    ? loaded.exportScope
    : DEFAULT_STATE.exportScope;
  loaded.exportAnim = listHas(E.ANIMS, loaded.exportAnim) ? loaded.exportAnim : DEFAULT_STATE.exportAnim;
  loaded.exportDir = E.DIRS.includes(loaded.exportDir) ? loaded.exportDir : DEFAULT_STATE.exportDir;
  loaded.spin = loaded.spin !== false;
  loaded.comparison = sanitizeEditableSnapshot(loaded.comparison);

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

function resetCurrentDocument() {
  const patch = state.mode === 'player'
    ? { player: sanitizePlayer(DEFAULT_STATE.player), characterName: '', exportName: '' }
    : { enemy: sanitizeEnemy(DEFAULT_STATE.enemy), characterName: '', exportName: '' };
  selectedPresetId = '';
  elements.presetName.value = '';
  setState(patch);
  setPresetStatus('Reset to defaults. Undo restores the previous sprite.');
}

function openComparison() {
  if (!state.comparison) return;
  if (!elements.compareDialog.open) elements.compareDialog.showModal();
  renderComparisonControls();
}

function closeComparison() {
  if (elements.compareDialog.open) elements.compareDialog.close();
}

function duplicateCurrentForComparison() {
  if (state.comparison) return;
  setState({ comparison: editableSnapshot() }, { recordHistory: false });
  openComparison();
}

function restoreComparisonCopy() {
  const patch = snapshotPatch(state.comparison);
  if (!patch) return;
  closeComparison();
  setState(patch);
}

function replaceComparisonCopy() {
  setState({ comparison: editableSnapshot() }, { recordHistory: false });
}

function removeComparisonCopy() {
  closeComparison();
  setState({ comparison: null }, { recordHistory: false });
}

function currentSpec() {
  return state.mode === 'player'
    ? { kind: 'player', ...state.player }
    : { kind: 'enemy', ...state.enemy };
}

function snapshotSpec(snapshot) {
  return snapshot.mode === 'player'
    ? { kind: 'player', ...snapshot.player }
    : { kind: 'enemy', ...snapshot.enemy };
}

function snapshotPatch(snapshot) {
  const sanitized = sanitizeEditableSnapshot(snapshot);
  if (!sanitized) return null;
  return {
    mode: sanitized.mode,
    player: sanitized.player,
    enemy: sanitized.enemy,
    characterName: sanitized.characterName,
    exportName: sanitized.exportName,
  };
}

function snapshotDisplayName(snapshot) {
  return snapshot.characterName.trim()
    || E.describe(snapshotSpec(snapshot)).replaceAll('-', ' ');
}

function snapshotMeta(snapshot) {
  const kind = snapshot.mode === 'player' ? 'Player' : 'Enemy';
  return `${kind} · ${E.describe(snapshotSpec(snapshot)).replaceAll('-', ' ')}`;
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

function selectedExportAnimation() {
  return E.ANIMS.find((anim) => anim.id === state.exportAnim) || E.ANIMS[0];
}

function exportDescriptor() {
  if (state.exportScope === 'animation') {
    const anim = selectedExportAnimation();
    return {
      width: anim.frames * E.SIZE,
      height: E.DIRS.length * E.SIZE,
      title: `${anim.name} animation`,
      contract: `${anim.frames} frame columns · 4 direction rows`,
      filenamePart: `${anim.id}-animation`,
      buttonLabel: `Download ${anim.name.toLocaleLowerCase()} animation`,
    };
  }
  if (state.exportScope === 'direction') {
    const directionName = DIRECTION_NAMES[state.exportDir];
    return {
      width: E.SHEET_COLS * E.SIZE,
      height: E.SIZE,
      title: `${directionName} direction`,
      contract: '12 frame columns · idle, walk, attack, and hurt',
      filenamePart: `${state.exportDir}-direction`,
      buttonLabel: `Download ${directionName.toLocaleLowerCase()} direction`,
    };
  }
  return {
    width: E.SHEET_COLS * E.SIZE,
    height: E.DIRS.length * E.SIZE,
    title: 'Full sprite sheet',
    contract: '12 columns · 4 rows · all animations and directions',
    filenamePart: 'sheet',
    buttonLabel: 'Download full sheet',
  };
}

function buildExportCanvas(spec, scale = 1) {
  if (state.exportScope === 'animation') {
    return E.buildAnimationSheet(spec, state.exportAnim, scale);
  }
  if (state.exportScope === 'direction') {
    return E.buildDirectionSheet(spec, state.exportDir, scale);
  }
  return E.buildSheet(spec, scale);
}

function exportFilename() {
  const customName = sanitizeFilenameBase(state.exportName);
  if (customName) return `${customName}.png`;
  return `${generatedNameBase()}-${exportDescriptor().filenamePart}@${state.exportScale}x.png`;
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

  if (!saved || ![1, 2, 3, PRESET_VERSION].includes(saved.version) || !Array.isArray(saved.presets)) {
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
  if (key === 'weapon' && value === 'none') player.weaponTier = 'tier1';
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

function activeAnimation(animId = state.anim) {
  return E.ANIMS.find((anim) => anim.id === animId) || E.ANIMS[0];
}

function clampFrame(frame, anim = activeAnimation()) {
  return Math.max(0, Math.min(anim.frames - 1, Number.isInteger(frame) ? frame : 0));
}

function animationColumn(animId, frame) {
  let column = 0;
  for (const anim of E.ANIMS) {
    if (anim.id === animId) return column + clampFrame(frame, anim);
    column += anim.frames;
  }
  return 0;
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
  const weapon = E.WEAPONS.find((item) => item.id === player.weapon) || E.WEAPONS[0];
  const weaponTierGroup = player.weapon === 'none' ? null : thumbnailGroup(
    'Weapon tier',
    E.WEAPON_TIERS,
    player.weaponTier,
    (value) => setPlayerOption('weaponTier', value),
    (item) => spec({ weaponTier: item.id }),
  );
  if (weaponTierGroup) {
    weaponTierGroup.selectedName = player.weaponTier === 'tier5'
      ? weapon.tier5Name
      : player.weaponTier === 'tier4'
        ? weapon.tier4Name
        : player.weaponTier === 'tier3'
          ? weapon.tier3Name
          : player.weaponTier === 'tier2'
            ? weapon.tier2Name
            : 'Standard issue';
  }
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
      'Facial detail',
      E.FACIAL_DETAILS,
      player.faceDetail,
      (value) => setPlayerOption('faceDetail', value),
      (item) => spec({ faceDetail: item.id, headgear: 'none' }),
    ),
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
    weaponTierGroup,
    thumbnailGroup(
      'Shield',
      E.SHIELDS,
      player.shield,
      (value) => setPlayerOption('shield', value),
      (item) => spec({ shield: item.id }),
    ),
  ].filter(Boolean);
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
    state.anim === anim.id,
    () => chooseAnimation(anim.id),
  )));

  elements.zoomButtons.replaceChildren(...ZOOM_LEVELS.map((zoom) => makeButton(
    `${zoom}x`,
    state.zoom === zoom,
    () => setState({ zoom }),
  )));

  elements.cycleButton.classList.toggle('active', state.spin);
  elements.cycleButton.setAttribute('aria-pressed', String(state.spin));
  elements.playPauseButton.textContent = state.playing ? 'Pause' : 'Play';
  elements.playPauseButton.setAttribute('aria-label', state.playing ? 'Pause animation' : 'Play animation');
  elements.playPauseButton.setAttribute('aria-pressed', String(state.playing));
  elements.playbackSpeed.value = String(state.playbackSpeed);
  const anim = activeAnimation();
  const frameButtons = Array.from({ length: anim.frames }, (_, frame) => makeButton(
    String(frame + 1),
    frame === clampFrame(state.frame, anim),
    () => inspectFrame(frame),
    'frame-button',
  ));
  for (const [frame, button] of frameButtons.entries()) {
    button.setAttribute('aria-label', `Inspect ${anim.name} frame ${frame + 1}`);
  }
  elements.frameButtons.dataset.animation = anim.id;
  elements.frameButtons.replaceChildren(...frameButtons);
  elements.stageCanvas.style.width = `${E.SIZE * state.zoom}px`;
  renderFrameInspection(anim.id, state.frame);
}

function renderFrameInspection(animId, frame) {
  const anim = activeAnimation(animId);
  const safeFrame = clampFrame(frame, anim);
  if (elements.frameButtons.dataset.animation === anim.id) {
    for (const [index, button] of [...elements.frameButtons.children].entries()) {
      const active = index === safeFrame;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }
  const column = animationColumn(anim.id, safeFrame);
  elements.frameReadout.value = `Frame ${safeFrame + 1} / ${anim.frames} · column ${column + 1} / ${E.SHEET_COLS} · ${anim.ms} ms`;
  elements.frameReadout.title = `${anim.name} frame ${safeFrame + 1} is sheet column ${column + 1} of ${E.SHEET_COLS}`;
  elements.stageCanvas.dataset.animation = anim.id;
  elements.stageCanvas.dataset.direction = state.dir;
  elements.stageCanvas.dataset.frame = String(safeFrame + 1);
  elements.stageCanvas.dataset.playing = String(state.playing);
  elements.stageCanvas.dataset.speed = String(state.playbackSpeed);
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
  const descriptor = exportDescriptor();
  elements.scaleButtons.replaceChildren(...EXPORT_SCALES.map((scale) => makeButton(
    `${scale}x`,
    state.exportScale === scale,
    () => setState({ exportScale: scale }),
  )));
  elements.exportScope.value = state.exportScope;
  elements.sheetTitle.textContent = descriptor.title;
  elements.sheetContract.textContent = descriptor.contract;
  elements.sheetCanvas.dataset.scope = state.exportScope;
  elements.sheetCanvas.setAttribute('aria-label', descriptor.title);
  elements.sizeLabel.textContent = `${descriptor.width * state.exportScale}x${descriptor.height * state.exportScale}px`;
  elements.downloadButton.textContent = descriptor.buttonLabel;
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

function drawComparisonFrame(animId, direction, frame) {
  if (!elements.compareDialog.open || !state.comparison) return;
  const anim = activeAnimation(animId);
  const safeFrame = clampFrame(frame, anim);
  const savedContext = elements.savedCopyCanvas.getContext('2d');
  const currentContext = elements.currentCopyCanvas.getContext('2d');
  savedContext.imageSmoothingEnabled = false;
  currentContext.imageSmoothingEnabled = false;
  E.drawSprite(savedContext, snapshotSpec(state.comparison), direction, anim.id, safeFrame, { shadow: true });
  E.drawSprite(currentContext, currentSpec(), direction, anim.id, safeFrame, { shadow: true });
  elements.compareContext.textContent = `${anim.name} · ${DIRECTION_NAMES[direction]} · frame ${safeFrame + 1} / ${anim.frames}`;
  elements.savedCopyCanvas.dataset.frame = String(safeFrame + 1);
  elements.currentCopyCanvas.dataset.frame = String(safeFrame + 1);
}

function renderComparisonDialog() {
  if (!state.comparison) return;
  const current = editableSnapshot();
  elements.savedCopyName.textContent = snapshotDisplayName(state.comparison);
  elements.currentCopyName.textContent = snapshotDisplayName(current);
  elements.savedCopyMeta.textContent = snapshotMeta(state.comparison);
  elements.currentCopyMeta.textContent = snapshotMeta(current);
  drawComparisonFrame(state.anim, state.dir, state.frame);
}

function renderComparisonControls() {
  const hasCopy = Boolean(state.comparison);
  elements.duplicateButton.disabled = hasCopy;
  elements.compareButton.disabled = !hasCopy;
  elements.duplicateButton.title = hasCopy
    ? 'A saved comparison copy already exists'
    : 'Duplicate the current sprite into a saved comparison copy';
  elements.compareButton.title = hasCopy
    ? 'Compare the saved copy with the current editor'
    : 'Duplicate a sprite before comparing';
  elements.compareButton.classList.toggle('active', elements.compareDialog.open);
  if (!hasCopy && elements.compareDialog.open) elements.compareDialog.close();
  if (elements.compareDialog.open) renderComparisonDialog();
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
  renderComparisonControls();
  renderPresetControls();
}

function updateSheet(spec) {
  const key = JSON.stringify({
    spec,
    scope: state.exportScope,
    animation: state.exportAnim,
    direction: state.exportDir,
  });
  if (key === sheetKey) return;
  sheetKey = key;
  const sheet = buildExportCanvas(spec, 1);
  elements.sheetCanvas.width = sheet.width;
  elements.sheetCanvas.height = sheet.height;
  const context = elements.sheetCanvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, elements.sheetCanvas.width, elements.sheetCanvas.height);
  context.drawImage(sheet, 0, 0);
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
  renderFrameInspection(animId, frame);
  drawComparisonFrame(animId, direction, frame);
  updateSheet(spec);
}

function tick(time) {
  const delta = lastTime ? Math.min(100, time - lastTime) : 0;
  lastTime = time;
  let animId = state.anim;
  let direction = state.dir;
  let frame = clampFrame(state.frame);

  if (state.playing) {
    const scaledDelta = delta * state.playbackSpeed;
    if (state.spin) {
      spinTime += scaledDelta;
      let cell = spinCells[spinIndex % spinCells.length];
      let loops = cell.anim.frames <= 2 ? 2 : 1;
      let duration = cell.anim.frames * cell.anim.ms * loops;

      while (spinTime >= duration) {
        spinTime -= duration;
        spinIndex = (spinIndex + 1) % spinCells.length;
        cell = spinCells[spinIndex];
        loops = cell.anim.frames <= 2 ? 2 : 1;
        duration = cell.anim.frames * cell.anim.ms * loops;
        state = { ...state, anim: cell.anim.id, dir: cell.dir, frame: 0 };
        renderPlaybackControls();
        renderDirectionControls();
      }

      animId = cell.anim.id;
      direction = cell.dir;
      frame = Math.floor(spinTime / cell.anim.ms) % cell.anim.frames;
    } else {
      const anim = activeAnimation(animId);
      animationTime = (animationTime + scaledDelta) % (anim.frames * anim.ms);
      frame = Math.floor(animationTime / anim.ms) % anim.frames;
    }
  }

  if (frame !== state.frame) state = { ...state, frame };
  drawFrame(animId, direction, frame);
  requestAnimationFrame(tick);
}

function toggleCycle() {
  const spin = !state.spin;
  if (spin) {
    spinIndex = findSpinIndex();
    spinTime = 0;
    animationTime = 0;
  } else {
    const anim = activeAnimation();
    animationTime = clampFrame(state.frame, anim) * anim.ms;
  }
  const patch = spin
    ? { spin, playing: true, frame: 0 }
    : { spin, exportAnim: state.anim, exportDir: state.dir };
  setState(patch);
}

function chooseAnimation(animId) {
  const anim = activeAnimation(animId);
  animationTime = 0;
  spinTime = 0;
  setState({ anim: anim.id, exportAnim: anim.id, frame: 0, spin: false });
}

function togglePlayback() {
  const playing = !state.playing;
  if (playing) {
    const anim = activeAnimation();
    animationTime = clampFrame(state.frame, anim) * anim.ms;
    if (state.spin) spinTime = animationTime;
    lastTime = 0;
  }
  setState({ playing });
}

function inspectFrame(frame) {
  const anim = activeAnimation();
  const inspectedFrame = ((frame % anim.frames) + anim.frames) % anim.frames;
  animationTime = inspectedFrame * anim.ms;
  spinTime = 0;
  setState({
    frame: inspectedFrame,
    playing: false,
    spin: false,
    exportAnim: anim.id,
    exportDir: state.dir,
  });
}

function stepFrame(offset) {
  inspectFrame(state.frame + offset);
}

function chooseDirection(direction) {
  const anim = activeAnimation();
  animationTime = clampFrame(state.frame, anim) * anim.ms;
  spinTime = 0;
  setState({ dir: direction, exportDir: direction, spin: false });
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
  const canvas = buildExportCanvas(spec, state.exportScale);
  triggerDownload(canvas, exportFilename());
}

elements.cycleButton.addEventListener('click', toggleCycle);
elements.previousFrameButton.addEventListener('click', () => stepFrame(-1));
elements.playPauseButton.addEventListener('click', togglePlayback);
elements.nextFrameButton.addEventListener('click', () => stepFrame(1));
elements.playbackSpeed.addEventListener('change', () => {
  const playbackSpeed = Number(elements.playbackSpeed.value);
  if (PLAYBACK_SPEEDS.includes(playbackSpeed)) setState({ playbackSpeed });
});
elements.undoButton.addEventListener('click', undo);
elements.redoButton.addEventListener('click', redo);
elements.resetButton.addEventListener('click', resetCurrentDocument);
elements.duplicateButton.addEventListener('click', duplicateCurrentForComparison);
elements.compareButton.addEventListener('click', openComparison);
elements.closeCompareButton.addEventListener('click', closeComparison);
elements.restoreCopyButton.addEventListener('click', restoreComparisonCopy);
elements.keepCurrentButton.addEventListener('click', closeComparison);
elements.removeCopyButton.addEventListener('click', removeComparisonCopy);
elements.replaceCopyButton.addEventListener('click', replaceComparisonCopy);
elements.compareDialog.addEventListener('close', renderComparisonControls);
elements.randomizeButton.addEventListener('click', randomize);
elements.savePresetButton.addEventListener('click', savePreset);
elements.loadPresetButton.addEventListener('click', loadSelectedPreset);
elements.deletePresetButton.addEventListener('click', deleteSelectedPreset);
elements.exportScope.addEventListener('change', () => {
  setState({ exportScope: elements.exportScope.value });
});
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
  if (event.key === ' ') {
    event.preventDefault();
    togglePlayback();
    return;
  }
  if (event.key === '[') {
    event.preventDefault();
    stepFrame(-1);
    return;
  }
  if (event.key === ']') {
    event.preventDefault();
    stepFrame(1);
    return;
  }
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  chooseDirection(direction);
});

renderUi();
requestAnimationFrame(tick);
