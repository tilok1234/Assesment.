import * as E from './sprite-engine.js';

const STORAGE_KEY = 'sprite-assembler-v1';
const PRESET_STORAGE_KEY = 'sprite-assembler-presets-v1';
const PRESET_VERSION = 1;
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
  },
  enemy: { family: 'slime', variant: 'lime' },
  dir: 'down',
  anim: 'walk',
  zoom: 14,
  spin: true,
  exportScale: 8,
};

const elements = {
  modeButtons: document.querySelector('#mode-buttons'),
  optionGroups: document.querySelector('#option-groups'),
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
let selectedPresetId = '';
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

function sanitizePlayer(player = {}) {
  return {
    skin: validId(E.SKINS, player.skin, DEFAULT_STATE.player.skin),
    hairStyle: validId(E.HAIR_STYLES, player.hairStyle, DEFAULT_STATE.player.hairStyle),
    hairColor: validId(E.HAIR_COLORS, player.hairColor, DEFAULT_STATE.player.hairColor),
    headgear: validId(E.HEADGEAR, player.headgear, DEFAULT_STATE.player.headgear),
    outfit: validId(E.OUTFITS, player.outfit, DEFAULT_STATE.player.outfit),
    outfitColor: validId(E.OUTFIT_COLORS, player.outfitColor, DEFAULT_STATE.player.outfitColor),
    weapon: validId(E.WEAPONS, player.weapon, DEFAULT_STATE.player.weapon),
    shield: validId(E.SHIELDS, player.shield, DEFAULT_STATE.player.shield),
  };
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
    player: { ...source.player },
    enemy: { ...source.enemy },
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
  const tracksSprite = ['mode', 'player', 'enemy']
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
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

function loadPresetLibrary() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) || 'null');
  } catch {}

  if (!saved || saved.version !== PRESET_VERSION || !Array.isArray(saved.presets)) {
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

function currentFamily() {
  return E.ENEMIES.find((family) => family.id === state.enemy.family) || E.ENEMIES[0];
}

function setPlayerOption(key, value) {
  setState({ player: { ...state.player, [key]: value } });
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

function createOptionGroup({ label, selectedName, type, options }) {
  const group = document.createElement('section');
  group.className = 'option-group';

  const heading = document.createElement('div');
  heading.className = 'option-heading';
  const title = document.createElement('h2');
  title.textContent = label;
  const selection = document.createElement('span');
  selection.textContent = selectedName;
  heading.append(title, selection);
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

function dotGroup(label, list, selected, pick) {
  const selectedItem = list.find((item) => item.id === selected) || list[0];
  return {
    label,
    selectedName: selectedItem.name,
    type: 'dots',
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

function renderUi() {
  renderModeButtons();
  renderOptionGroups();
  renderPlaybackControls();
  renderDirectionControls();
  renderExportControls();
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
  elements.liveLabel.textContent = `${anim.name} · ${DIRECTION_NAMES[direction]}`.toUpperCase();
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
  if (state.mode === 'player') setState({ player: E.randomPlayer() });
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
  triggerDownload(canvas, `${E.describe(spec)}-sheet@${state.exportScale}x.png`);
}

elements.cycleButton.addEventListener('click', toggleCycle);
elements.undoButton.addEventListener('click', undo);
elements.redoButton.addEventListener('click', redo);
elements.randomizeButton.addEventListener('click', randomize);
elements.savePresetButton.addEventListener('click', savePreset);
elements.loadPresetButton.addEventListener('click', loadSelectedPreset);
elements.deletePresetButton.addEventListener('click', deleteSelectedPreset);
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
