import * as E from './sprite-engine.js';
import {
  buildCompleteCharacterKitPlan,
  completeCharacterKitCounts,
  COMPLETE_CHARACTER_KIT_FORMAT,
  COMPLETE_CHARACTER_KIT_LAYER_ORDER,
  COMPLETE_CHARACTER_KIT_RECIPE_LIMIT,
  COMPLETE_CHARACTER_KIT_VERSION,
  COMPLETE_CHARACTER_PACK_FORMAT,
  COMPLETE_CHARACTER_PACK_VERSION,
  MASTER_CHARACTER_KIT_SCALE,
} from './character-kit.js';
import { buildStoredZip } from './zip.js';

const STORAGE_KEY = 'sprite-assembler-v1';
const PRESET_STORAGE_KEY = 'sprite-assembler-presets-v1';
const PRESET_VERSION = 6;
const PALETTE_STORAGE_KEY = 'sprite-assembler-palettes-v1';
const PALETTE_VERSION = 1;
const PACK_STORAGE_KEY = 'sprite-assembler-character-pack-v1';
const PACK_VERSION = 1;
const PACK_ENTRY_LIMIT = 200;
const HISTORY_LIMIT = 100;
const ZOOM_LEVELS = [6, 10, 14, 20];
const PLAYBACK_SPEEDS = [0.5, 1, 2];
const EXPORT_SCALES = [1, 4, 8, 12];
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
    outfitTier: 'tier1',
    outfitColor: 'royal',
    weapon: 'sword',
    weaponTier: 'tier1',
    shield: 'round',
    shieldTier: 'tier1',
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
  packName: document.querySelector('#pack-name'),
  packSummary: document.querySelector('#pack-summary'),
  packList: document.querySelector('#pack-list'),
  packStatus: document.querySelector('#pack-status'),
  addToPackButton: document.querySelector('#add-to-pack-button'),
  clearPackButton: document.querySelector('#clear-pack-button'),
  downloadPackButton: document.querySelector('#download-pack-button'),
  packMasterKitSummary: document.querySelector('#pack-master-kit-summary'),
  downloadPackMasterKitButton: document.querySelector('#download-pack-master-kit-button'),
  masterKitSummary: document.querySelector('#master-kit-summary'),
  masterKitStatus: document.querySelector('#master-kit-status'),
  downloadMasterKitButton: document.querySelector('#download-master-kit-button'),
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
let packLibrary = loadPackLibrary();
let packExporting = false;
let rosterKitExporting = false;
let rosterKitProgress = null;
let masterKitExporting = false;
let masterKitProgress = null;
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
  const shield = validId(E.SHIELDS, player.shield, DEFAULT_STATE.player.shield);
  const sanitized = {
    skin: validId(E.SKINS, player.skin, DEFAULT_STATE.player.skin),
    hairStyle: validId(E.HAIR_STYLES, player.hairStyle, DEFAULT_STATE.player.hairStyle),
    hairColor: validId(E.HAIR_COLORS, player.hairColor, DEFAULT_STATE.player.hairColor),
    faceDetail: validId(E.FACIAL_DETAILS, player.faceDetail, DEFAULT_STATE.player.faceDetail),
    headgear: validId(E.HEADGEAR, player.headgear, DEFAULT_STATE.player.headgear),
    outfit: validId(E.OUTFITS, player.outfit, DEFAULT_STATE.player.outfit),
    outfitTier: validId(E.OUTFIT_TIERS, player.outfitTier, DEFAULT_STATE.player.outfitTier),
    outfitColor: validId(E.OUTFIT_COLORS, player.outfitColor, DEFAULT_STATE.player.outfitColor),
    weapon,
    weaponTier: weapon === 'none'
      ? 'tier1'
      : validId(E.WEAPON_TIERS, player.weaponTier, DEFAULT_STATE.player.weaponTier),
    shield,
    shieldTier: shield === 'none'
      ? 'tier1'
      : validId(E.SHIELD_TIERS, player.shieldTier, DEFAULT_STATE.player.shieldTier),
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

function makePackEntryId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `pack-entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sanitizePackEntry(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const kind = raw.kind === 'enemy' ? 'enemy' : raw.kind === 'player' ? 'player' : null;
  const name = sanitizeText(raw.name, 48).trim();
  if (!kind || !name) return null;
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : makePackEntryId(),
    name,
    kind,
    spec: kind === 'player' ? sanitizePlayer(raw.spec) : sanitizeEnemy(raw.spec),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  };
}

function loadPackLibrary() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(PACK_STORAGE_KEY) || 'null');
  } catch {}

  if (!saved || saved.version !== PACK_VERSION || !Array.isArray(saved.entries)) {
    return { version: PACK_VERSION, name: 'My Character Pack', entries: [] };
  }

  const ids = new Set();
  const entries = [];
  for (const raw of saved.entries.slice(0, PACK_ENTRY_LIMIT)) {
    const entry = sanitizePackEntry(raw);
    if (!entry || ids.has(entry.id)) continue;
    ids.add(entry.id);
    entries.push(entry);
  }
  return {
    version: PACK_VERSION,
    name: sanitizeText(saved.name, 64).trim() || 'My Character Pack',
    entries,
  };
}

function persistPackLibrary() {
  try {
    localStorage.setItem(PACK_STORAGE_KEY, JSON.stringify(packLibrary));
  } catch {}
}

function packEntrySpec(entry) {
  return entry.kind === 'player'
    ? { kind: 'player', ...entry.spec }
    : { kind: 'enemy', ...entry.spec };
}

function setPackStatus(message) {
  elements.packStatus.textContent = message;
}

function packIsBusy() {
  return packExporting || rosterKitExporting;
}

function addCurrentToPack() {
  if (packIsBusy()) return;
  if (packLibrary.entries.length >= PACK_ENTRY_LIMIT) {
    setPackStatus(`This pack already has the ${PACK_ENTRY_LIMIT}-character limit.`);
    return;
  }

  const spec = currentSpec();
  const name = sanitizeText(state.characterName, 48).trim()
    || E.describe(spec).replaceAll('-', ' ');
  packLibrary.entries.push({
    id: makePackEntryId(),
    name,
    kind: spec.kind,
    spec: spec.kind === 'player' ? sanitizePlayer(spec) : sanitizeEnemy(spec),
    createdAt: new Date().toISOString(),
  });
  persistPackLibrary();
  renderPackControls();
  setPackStatus(`Added “${name}” to the working pack.`);
}

function loadPackEntry(entryId) {
  const entry = packLibrary.entries.find((item) => item.id === entryId);
  if (!entry || packIsBusy()) return;
  const patch = entry.kind === 'player'
    ? { mode: 'player', player: sanitizePlayer(entry.spec) }
    : { mode: 'enemy', enemy: sanitizeEnemy(entry.spec) };
  patch.characterName = entry.name;
  patch.exportName = '';
  selectedPresetId = '';
  elements.presetName.value = '';
  setState(patch);
  setPackStatus(`Loaded “${entry.name}” into the editor.`);
}

function removePackEntry(entryId) {
  if (packIsBusy()) return;
  const entry = packLibrary.entries.find((item) => item.id === entryId);
  if (!entry) return;
  packLibrary.entries = packLibrary.entries.filter((item) => item.id !== entryId);
  persistPackLibrary();
  renderPackControls();
  setPackStatus(`Removed “${entry.name}” from the working pack.`);
}

function clearCharacterPack() {
  if (!packLibrary.entries.length || packIsBusy()) return;
  if (!globalThis.confirm(`Remove all ${packLibrary.entries.length} characters from this pack?`)) return;
  packLibrary.entries = [];
  persistPackLibrary();
  renderPackControls();
  setPackStatus('Cleared the working pack.');
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

  if (!saved || ![1, 2, 3, 4, 5, PRESET_VERSION].includes(saved.version) || !Array.isArray(saved.presets)) {
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
  if (key === 'shield' && value === 'none') player.shieldTier = 'tier1';
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
  const outfit = E.OUTFITS.find((item) => item.id === player.outfit) || E.OUTFITS[0];
  const weapon = E.WEAPONS.find((item) => item.id === player.weapon) || E.WEAPONS[0];
  const shield = E.SHIELDS.find((item) => item.id === player.shield) || E.SHIELDS[0];
  const outfitTierGroup = thumbnailGroup(
    'Armor tier',
    E.OUTFIT_TIERS,
    player.outfitTier,
    (value) => setPlayerOption('outfitTier', value),
    (item) => spec({ outfitTier: item.id }),
  );
  outfitTierGroup.selectedName = player.outfitTier === 'tier5'
    ? outfit.tier5Name
    : player.outfitTier === 'tier4'
      ? outfit.tier4Name
      : player.outfitTier === 'tier3'
        ? outfit.tier3Name
        : player.outfitTier === 'tier2'
          ? outfit.tier2Name
          : 'Standard issue';
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
  const shieldTierGroup = player.shield === 'none' ? null : thumbnailGroup(
    'Shield tier',
    E.SHIELD_TIERS,
    player.shieldTier,
    (value) => setPlayerOption('shieldTier', value),
    (item) => spec({ shieldTier: item.id }),
  );
  if (shieldTierGroup) {
    shieldTierGroup.selectedName = player.shieldTier === 'tier5'
      ? shield.tier5Name
      : player.shieldTier === 'tier4'
        ? shield.tier4Name
        : player.shieldTier === 'tier3'
          ? shield.tier3Name
          : player.shieldTier === 'tier2'
            ? shield.tier2Name
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
    outfitTierGroup,
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
    shieldTierGroup,
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
    scale === 1 ? '1x Native' : `${scale}x`,
    state.exportScale === scale,
    () => setState({ exportScale: scale }),
  )));
  elements.exportScope.value = state.exportScope;
  elements.sheetTitle.textContent = descriptor.title;
  elements.sheetContract.textContent = descriptor.contract;
  elements.sheetCanvas.dataset.scope = state.exportScope;
  elements.sheetCanvas.setAttribute('aria-label', descriptor.title);
  const nativeLabel = state.exportScale === 1 ? ' · native' : '';
  elements.sizeLabel.textContent = `${descriptor.width * state.exportScale}x${descriptor.height * state.exportScale}px${nativeLabel}`;
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

function renderPackEntry(entry) {
  const item = document.createElement('li');
  item.className = 'pack-entry';

  const canvas = document.createElement('canvas');
  canvas.width = E.SIZE;
  canvas.height = E.SIZE;
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  E.drawSprite(context, packEntrySpec(entry), 'down', 'idle', 0, { shadow: false });

  const copy = document.createElement('div');
  copy.className = 'pack-entry-copy';
  const name = document.createElement('strong');
  name.textContent = entry.name;
  name.title = entry.name;
  const meta = document.createElement('span');
  meta.textContent = `${entry.kind === 'player' ? 'Player' : 'Enemy'} · ${E.describe(packEntrySpec(entry)).replaceAll('-', ' ')}`;
  meta.title = meta.textContent;
  copy.append(name, meta);

  const actions = document.createElement('div');
  actions.className = 'pack-entry-actions';
  const loadButton = document.createElement('button');
  loadButton.type = 'button';
  loadButton.className = 'secondary-button';
  loadButton.textContent = 'Load';
  loadButton.disabled = packIsBusy();
  loadButton.setAttribute('aria-label', `Load ${entry.name} into the editor`);
  loadButton.addEventListener('click', () => loadPackEntry(entry.id));
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'secondary-button danger-action';
  removeButton.textContent = 'Remove';
  removeButton.disabled = packIsBusy();
  removeButton.setAttribute('aria-label', `Remove ${entry.name} from the pack`);
  removeButton.addEventListener('click', () => removePackEntry(entry.id));
  actions.append(loadButton, removeButton);

  item.append(canvas, copy, actions);
  return item;
}

function renderPackControls() {
  if (elements.packName.value !== packLibrary.name) elements.packName.value = packLibrary.name;
  const count = packLibrary.entries.length;
  const playerEntries = packLibrary.entries.filter((entry) => entry.kind === 'player');
  const playerCount = playerEntries.length;
  const busy = packIsBusy();
  const scaleLabel = state.exportScale === 1 ? '1x native' : `${state.exportScale}x`;
  elements.packSummary.textContent = `${count} character${count === 1 ? '' : 's'} · ${scaleLabel} full sheets`;

  if (count) {
    elements.packList.replaceChildren(...packLibrary.entries.map(renderPackEntry));
  } else {
    const empty = document.createElement('li');
    empty.className = 'pack-empty';
    empty.textContent = 'No characters added yet.';
    elements.packList.replaceChildren(empty);
  }

  elements.packName.disabled = busy;
  elements.addToPackButton.disabled = busy || count >= PACK_ENTRY_LIMIT;
  elements.clearPackButton.disabled = busy || count === 0;
  elements.downloadPackButton.disabled = busy || count === 0;
  elements.downloadPackButton.textContent = packExporting ? 'Building pack…' : 'Download pack ZIP';

  if (!playerCount) {
    elements.packMasterKitSummary.textContent = `Add up to ${COMPLETE_CHARACTER_KIT_RECIPE_LIMIT} players as recipes for one shared component kit.`;
  } else if (playerCount > COMPLETE_CHARACTER_KIT_RECIPE_LIMIT) {
    elements.packMasterKitSummary.textContent = `${playerCount} player recipes · remove ${playerCount - COMPLETE_CHARACTER_KIT_RECIPE_LIMIT} to reach the ${COMPLETE_CHARACTER_KIT_RECIPE_LIMIT}-recipe limit.`;
  } else {
    const counts = completeCharacterKitCounts();
    const totalPngs = counts.componentPngs + counts.enemySheets + playerCount;
    elements.packMasterKitSummary.textContent = `${playerCount} ready character${playerCount === 1 ? '' : 's'} + ${counts.componentPngs} unique components + ${counts.enemySheets} native enemies · ${totalPngs} PNGs total`;
  }
  elements.downloadPackMasterKitButton.disabled = busy
    || masterKitExporting
    || playerCount === 0
    || playerCount > COMPLETE_CHARACTER_KIT_RECIPE_LIMIT;
  elements.downloadPackMasterKitButton.textContent = rosterKitExporting && rosterKitProgress
    ? `Building ${rosterKitProgress.done} / ${rosterKitProgress.total}…`
    : 'Download Complete Pack';
}

function setMasterKitStatus(message) {
  elements.masterKitStatus.textContent = message;
}

function renderMasterKitControls() {
  if (state.mode !== 'player') {
    elements.masterKitSummary.textContent = 'Switch to Player mode to add the current character as the reference recipe.';
    elements.downloadMasterKitButton.disabled = true;
    elements.downloadMasterKitButton.textContent = 'Download Complete Character Kit';
    return;
  }

  const counts = completeCharacterKitCounts();
  elements.masterKitSummary.textContent = `${counts.componentPngs} unique components · ${counts.enemySheets} native enemies · 1 reference · ${counts.totalPngs} PNGs`;
  elements.downloadMasterKitButton.disabled = masterKitExporting || rosterKitExporting;
  elements.downloadMasterKitButton.textContent = masterKitExporting && masterKitProgress
    ? `Building ${masterKitProgress.done} / ${masterKitProgress.total}…`
    : 'Download Complete Character Kit';
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
  renderPackControls();
  renderMasterKitControls();
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

function dataUrlBytes(dataUrl) {
  const encoded = String(dataUrl).split(',')[1] || '';
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function canvasToPngBytes(canvas) {
  if (!canvas.toBlob) return Promise.resolve(dataUrlBytes(canvas.toDataURL('image/png')));
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('The sprite sheet could not be encoded as PNG.'));
        return;
      }
      try {
        resolve(new Uint8Array(await blob.arrayBuffer()));
      } catch (error) {
        reject(error);
      }
    }, 'image/png');
  });
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function packFilenameBase(value, fallback = 'character-pack') {
  return sanitizeFilenameBase(String(value || '').replace(/\.zip$/i, ''))
    .toLocaleLowerCase()
    .replace(/\s+/g, '-')
    || fallback;
}

function uniquePackCharacterPath(entry, scale, usedPaths) {
  const fallback = E.describe(packEntrySpec(entry));
  const base = packFilenameBase(entry.name, fallback);
  let suffix = 1;
  let path = `characters/${base}@${scale}x.png`;
  while (usedPaths.has(path.toLocaleLowerCase())) {
    suffix += 1;
    path = `characters/${base}-${suffix}@${scale}x.png`;
  }
  usedPaths.add(path.toLocaleLowerCase());
  return path;
}

function packAnimationContract() {
  let startColumn = 0;
  return E.ANIMS.map((animation) => {
    const contract = {
      id: animation.id,
      name: animation.name,
      startColumn,
      frames: animation.frames,
      frameDurationMs: animation.ms,
    };
    startColumn += animation.frames;
    return contract;
  });
}

function withoutRenderSpec(entry) {
  const { spec, ...manifestEntry } = entry;
  return manifestEntry;
}

function completeCharacterKitManifest(plan, name, exportedAt, options = {}) {
  const readyCharacters = Array.isArray(options.readyCharacters) ? options.readyCharacters : [];
  const includeReference = options.includeReference !== false;
  const counts = {
    ...plan.counts,
    referencePreviews: includeReference ? 1 : 0,
    readyCharacters: readyCharacters.length,
    totalPngs: plan.counts.componentPngs + plan.counts.enemySheets
      + (includeReference ? 1 : 0) + readyCharacters.length,
  };
  return {
    format: options.format || COMPLETE_CHARACTER_KIT_FORMAT,
    version: options.version || COMPLETE_CHARACTER_KIT_VERSION,
    name,
    exportedAt,
    exportScale: MASTER_CHARACTER_KIT_SCALE,
    transparent: true,
    bakedShadow: false,
    logicalFrame: { width: E.SIZE, height: E.SIZE },
    sheet: {
      logicalWidth: E.SHEET_COLS * E.SIZE,
      logicalHeight: E.DIRS.length * E.SIZE,
      width: E.SHEET_COLS * E.SIZE,
      height: E.DIRS.length * E.SIZE,
      columns: E.SHEET_COLS,
      rows: E.DIRS.length,
      directions: [...E.DIRS],
      animations: packAnimationContract(),
    },
    layering: {
      order: [...COMPLETE_CHARACTER_KIT_LAYER_ORDER],
      instructions: 'Draw each non-null recipe component in this order using the same frame rectangle, direction row, and animation column.',
    },
    counts,
    components: {
      skinBodies: plan.components.skinBodies.map(withoutRenderSpec),
      heads: plan.components.heads.map(withoutRenderSpec),
      hair: plan.components.hair.map(withoutRenderSpec),
      faceDetails: plan.components.faceDetails.map(withoutRenderSpec),
      outfitBack: plan.components.outfitBack.map(withoutRenderSpec),
      outfits: plan.components.outfits.map(withoutRenderSpec),
      headgear: plan.components.headgear.map(withoutRenderSpec),
      weapons: plan.components.weapons.map(withoutRenderSpec),
      shields: plan.components.shields.map(withoutRenderSpec),
    },
    enemies: plan.enemies.map((family) => ({
      family: family.family,
      name: family.name,
      variants: family.variants.map(withoutRenderSpec),
    })),
    recipes: plan.recipes,
    ...(readyCharacters.length ? { characters: readyCharacters } : {}),
    referencePreview: includeReference ? plan.reference.file : readyCharacters[0]?.file || null,
  };
}

function completeCharacterKitReadme(name, recipeCount, readyCharacterCount = 0) {
  const counts = completeCharacterKitCounts();
  return `${name} - ${readyCharacterCount ? 'Complete Character Pack' : 'Complete Character Kit'}\n\n`
    + 'This archive combines one deduplicated library of reusable character components with a ready-to-use enemy library.\n'
    + `${recipeCount} saved character recipe${recipeCount === 1 ? '' : 's'} reference those shared files without duplicating artwork.\n`
    + (readyCharacterCount
      ? `${readyCharacterCount} assembled native sprite sheet${readyCharacterCount === 1 ? '' : 's'} are included in characters/ for immediate game use.\n`
      : '')
    + `All PNG files are native 288x96 sprite sheets made from 24x24 frames. The enemies/ folder contains all ${counts.enemyFamilies} enemy families and ${counts.enemySheets} variations as complete assembled sheets.\n\n`
    + 'Component groups:\n'
    + '- skin-body: animated hands and neck for each skin tone\n'
    + '- heads: normal and shaded animated heads for each skin tone\n'
    + '- hair: each style and color, with full and under-headgear fits\n'
    + '- face-details: only the color-dependent variants each detail needs\n'
    + '- outfits: all five armor tiers as reusable front layers plus separate cape-back layers\n'
    + '- headgear: color variants only where the art actually uses outfit colors\n'
    + '- weapons and shields: all five tiers as direction-aware back/front animation layers\n'
    + '- enemies: every enemy variation as a complete native sheet, organized by family\n\n'
    + `Runtime draw order: ${COMPLETE_CHARACTER_KIT_LAYER_ORDER.join(' -> ')}.\n`
    + 'Use the same source rectangle, animation column, and direction row for every active component.\n'
    + 'Recipes in manifest.json are lightweight examples; change their component paths to craft new characters from this one library.\n'
    + 'Custom palette values remain in recipe specs for games that support runtime recoloring.\n';
}

async function renderCompleteCharacterKitPngs(plan, zipEntries, advance, options = {}) {
  for (const entry of plan.components.skinBodies) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering skin-body components.');
  }
  for (const entry of plan.components.heads) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering head components.');
  }
  for (const entry of plan.components.hair) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering reusable hair components.');
  }
  for (const entry of plan.components.faceDetails) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering facial-detail components.');
  }
  for (const entry of plan.components.outfitBack) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering cape-back components.');
  }
  for (const entry of plan.components.outfits) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering outfit components.');
  }
  for (const entry of plan.components.headgear) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering headgear components.');
  }
  for (const entry of plan.components.weapons) {
    await masterKitPng(zipEntries, entry.files.back, entry.spec, 'weapon-back');
    advance('Rendering weapon components.');
    await masterKitPng(zipEntries, entry.files.front, entry.spec, 'weapon-front');
    advance('Rendering weapon components.');
  }
  for (const entry of plan.components.shields) {
    await masterKitPng(zipEntries, entry.file, entry.spec, entry.layer);
    advance('Rendering shield components.');
  }
  for (const family of plan.enemies) {
    for (const entry of family.variants) {
      await masterKitPng(zipEntries, entry.file, entry.spec, 'complete');
      advance('Rendering native enemy sheets.');
    }
  }
  if (options.includeReference !== false) {
    await masterKitPng(zipEntries, plan.reference.file, plan.reference.spec, 'complete');
    advance('Rendering the assembled reference character.');
  }
}

async function masterKitPng(zipEntries, file, spec, layer) {
  const canvas = E.buildSheet(spec, MASTER_CHARACTER_KIT_SCALE, { layer });
  zipEntries.push({ name: file, data: await canvasToPngBytes(canvas) });
}

async function renderReadyPackCharacters(entries, plan, zipEntries, advance) {
  const readyCharacters = [];
  const usedPaths = new Set();
  for (const entry of entries) {
    const spec = packEntrySpec(entry);
    const canvas = E.buildSheet(spec, MASTER_CHARACTER_KIT_SCALE);
    const file = uniquePackCharacterPath(entry, MASTER_CHARACTER_KIT_SCALE, usedPaths);
    zipEntries.push({ name: file, data: await canvasToPngBytes(canvas) });
    readyCharacters.push({
      id: entry.id,
      recipeId: plan.recipes.find((recipe) => recipe.sourceId === entry.id)?.id || null,
      name: entry.name,
      kind: entry.kind,
      createdAt: entry.createdAt,
      file,
      width: canvas.width,
      height: canvas.height,
      spec,
    });
    advance('Rendering ready character sheets.');
  }
  return readyCharacters;
}

function updateMasterKitProgress(done, total, message) {
  masterKitProgress = { done, total };
  renderMasterKitControls();
  setMasterKitStatus(message);
}

async function downloadMasterCharacterKit() {
  if (masterKitExporting || rosterKitExporting || state.mode !== 'player') return;
  const player = sanitizePlayer(state.player);
  const characterName = sanitizeText(state.characterName, 48).trim()
    || E.describe({ kind: 'player', ...player }).replaceAll('-', ' ');
  const plan = buildCompleteCharacterKitPlan([{
    id: 'current-character',
    name: characterName,
    kind: 'player',
    spec: player,
  }]);
  const exportedAt = new Date().toISOString();
  const total = plan.counts.totalPngs;
  const zipEntries = [];
  let done = 0;
  masterKitExporting = true;
  updateMasterKitProgress(done, total, `Preparing ${total} native sprite sheets…`);

  const advance = (message) => {
    done += 1;
    if (done === 1 || done === total || done % 10 === 0) {
      updateMasterKitProgress(done, total, `${message} ${done} / ${total}`);
    }
  };

  try {
    await renderCompleteCharacterKitPngs(plan, zipEntries, advance);
    const manifest = completeCharacterKitManifest(plan, `${characterName} Complete Kit`, exportedAt);
    zipEntries.push({
      name: 'manifest.json',
      data: new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`),
    });
    zipEntries.push({
      name: 'README.txt',
      data: new TextEncoder().encode(completeCharacterKitReadme(`${characterName} Complete Kit`, plan.recipes.length)),
    });

    updateMasterKitProgress(total, total, 'Packaging one deduplicated Complete Character Kit…');
    const archive = buildStoredZip(zipEntries, new Date(exportedAt));
    const filename = `${packFilenameBase(characterName, 'character')}-complete-character-kit.zip`;
    triggerBlobDownload(new Blob([archive], { type: 'application/zip' }), filename);
    setMasterKitStatus(`Downloaded ${plan.counts.componentPngs} unique components, ${plan.counts.enemySheets} native enemies, one reference, and the “${characterName}” recipe.`);
  } catch (error) {
    console.error(error);
    setMasterKitStatus('The Complete Character Kit could not be exported. Please try again.');
  } finally {
    masterKitExporting = false;
    masterKitProgress = null;
    renderMasterKitControls();
  }
}

function updateRosterKitProgress(done, total, message) {
  rosterKitProgress = { done, total };
  elements.downloadPackMasterKitButton.textContent = `Building ${done} / ${total}…`;
  setPackStatus(message);
}

async function downloadPackMasterKit() {
  if (packIsBusy() || masterKitExporting) return;
  const entries = packLibrary.entries
    .map((entry) => sanitizePackEntry(entry))
    .filter((entry) => entry?.kind === 'player');
  if (!entries.length) {
    setPackStatus('Add at least one player before building a Complete Character Pack.');
    return;
  }
  if (entries.length > COMPLETE_CHARACTER_KIT_RECIPE_LIMIT) {
    setPackStatus(`A Complete Character Pack supports up to ${COMPLETE_CHARACTER_KIT_RECIPE_LIMIT} saved players.`);
    return;
  }

  const plan = buildCompleteCharacterKitPlan(entries);
  const packName = sanitizeText(packLibrary.name, 64).trim() || 'Character Pack';
  const exportedAt = new Date().toISOString();
  const total = plan.counts.componentPngs + plan.counts.enemySheets + entries.length;
  const zipEntries = [];
  let done = 0;
  rosterKitExporting = true;
  rosterKitProgress = { done, total };
  renderPackControls();
  renderMasterKitControls();
  updateRosterKitProgress(done, total, `Preparing ${entries.length} ready characters, their recipes, the shared component library, and every native enemy variation…`);

  const advance = (message) => {
    done += 1;
    if (done === 1 || done === total || done % 10 === 0) {
      updateRosterKitProgress(done, total, `${message} ${done} / ${total}`);
    }
  };

  try {
    await renderCompleteCharacterKitPngs(plan, zipEntries, advance, { includeReference: false });
    const readyCharacters = await renderReadyPackCharacters(entries, plan, zipEntries, advance);
    const manifest = completeCharacterKitManifest(plan, packName, exportedAt, {
      format: COMPLETE_CHARACTER_PACK_FORMAT,
      version: COMPLETE_CHARACTER_PACK_VERSION,
      readyCharacters,
      includeReference: false,
    });
    zipEntries.push({
      name: 'manifest.json',
      data: new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`),
    });
    zipEntries.push({
      name: 'README.txt',
      data: new TextEncoder().encode(completeCharacterKitReadme(packName, entries.length, readyCharacters.length)),
    });

    updateRosterKitProgress(total, total, 'Packaging ready characters, the deduplicated master library, and native enemies together…');
    const archive = buildStoredZip(zipEntries, new Date(exportedAt));
    const filename = `${packFilenameBase(packName, 'character-pack')}-complete-character-pack.zip`;
    triggerBlobDownload(new Blob([archive], { type: 'application/zip' }), filename);
    setPackStatus(`Downloaded one Complete Pack with ${entries.length} ready character${entries.length === 1 ? '' : 's'}, matching recipes, ${plan.counts.componentPngs} unique components, and ${plan.counts.enemySheets} native enemies.`);
  } catch (error) {
    console.error(error);
    setPackStatus('The Complete Character Pack could not be exported. Please try again.');
  } finally {
    rosterKitExporting = false;
    rosterKitProgress = null;
    renderPackControls();
    renderMasterKitControls();
  }
}

async function downloadCharacterPack() {
  if (packIsBusy() || !packLibrary.entries.length) return;
  const entries = packLibrary.entries.map((entry) => sanitizePackEntry(entry)).filter(Boolean);
  const scale = state.exportScale;
  const exportedAt = new Date().toISOString();
  const packName = sanitizeText(packLibrary.name, 64).trim() || 'Character Pack';
  packExporting = true;
  renderPackControls();

  try {
    const zipEntries = [];
    const manifestCharacters = [];
    const usedPaths = new Set();
    for (const [index, entry] of entries.entries()) {
      setPackStatus(`Rendering ${index + 1} of ${entries.length}: ${entry.name}`);
      const spec = packEntrySpec(entry);
      const canvas = E.buildSheet(spec, scale);
      const file = uniquePackCharacterPath(entry, scale, usedPaths);
      zipEntries.push({ name: file, data: await canvasToPngBytes(canvas) });
      manifestCharacters.push({
        id: entry.id,
        name: entry.name,
        kind: entry.kind,
        createdAt: entry.createdAt,
        file,
        width: canvas.width,
        height: canvas.height,
        spec,
      });
    }

    const manifest = {
      format: '8-bit-sprite-assembler-character-pack',
      version: PACK_VERSION,
      name: packName,
      exportedAt,
      exportScale: scale,
      logicalFrame: { width: E.SIZE, height: E.SIZE },
      sheet: {
        logicalWidth: E.SHEET_COLS * E.SIZE,
        logicalHeight: E.DIRS.length * E.SIZE,
        width: E.SHEET_COLS * E.SIZE * scale,
        height: E.DIRS.length * E.SIZE * scale,
        columns: E.SHEET_COLS,
        rows: E.DIRS.length,
        directions: [...E.DIRS],
        animations: packAnimationContract(),
      },
      characters: manifestCharacters,
    };
    zipEntries.push({
      name: 'manifest.json',
      data: new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`),
    });
    const archive = buildStoredZip(zipEntries, new Date(exportedAt));
    triggerBlobDownload(new Blob([archive], { type: 'application/zip' }), `${packFilenameBase(packName)}.zip`);
    setPackStatus(`Downloaded ${entries.length} character${entries.length === 1 ? '' : 's'} at ${scale}x.`);
  } catch (error) {
    console.error(error);
    setPackStatus('The pack could not be exported. Please try again.');
  } finally {
    packExporting = false;
    renderPackControls();
  }
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
elements.addToPackButton.addEventListener('click', addCurrentToPack);
elements.clearPackButton.addEventListener('click', clearCharacterPack);
elements.downloadPackButton.addEventListener('click', downloadCharacterPack);
elements.downloadPackMasterKitButton.addEventListener('click', downloadPackMasterKit);
elements.downloadMasterKitButton.addEventListener('click', downloadMasterCharacterKit);
elements.packName.addEventListener('input', () => {
  const name = sanitizeText(elements.packName.value, 64);
  if (name !== elements.packName.value) elements.packName.value = name;
  packLibrary.name = name;
  persistPackLibrary();
});
elements.packName.addEventListener('change', () => {
  const name = packLibrary.name.trim() || 'My Character Pack';
  packLibrary.name = name;
  persistPackLibrary();
  renderPackControls();
  setPackStatus(`Working pack named “${name}”.`);
});
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
