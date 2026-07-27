import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import {
  PLAYER_CAST_ANIMATION,
  PLAYER_CAST_PROFILE,
  playerCastPose,
} from '../engine/cast-animation.js';
import {
  capturePixels,
  renderLayerPixels,
  renderSpritePixels,
} from '../engine/pixel-buffer.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(
  root,
  outputFlag >= 0 ? process.argv[outputFlag + 1] : 'cast-review',
);
await mkdir(output, { recursive: true });

const BASE_PLAYER = Object.freeze({
  kind: 'player',
  species: 'human',
  bodyBuild: 'classic',
  skin: 'peach',
  hairStyle: 'spiky',
  hairColor: 'brown',
  expression: 'determined',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'tunic',
  outfitTier: 'tier1',
  outfitColor: 'royal',
  weapon: 'sword',
  weaponTier: 'tier1',
  shield: 'none',
  shieldTier: 'tier1',
  offhand: 'none',
  palette: null,
});

const PILOTS = Object.freeze([
  Object.freeze({
    id: 'mage-lantern',
    label: 'Mage · Staff + Lantern · Lean',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'celestial',
      bodyBuild: 'lean',
      skin: 'pale',
      hairStyle: 'long',
      hairColor: 'white',
      expression: 'neutral',
      headgear: 'wizard',
      outfit: 'robe',
      outfitTier: 'tier3',
      outfitColor: 'purple',
      weapon: 'staff',
      weaponTier: 'tier3',
      offhand: 'lantern',
    }),
  }),
  Object.freeze({
    id: 'guardian-shield',
    label: 'Guardian · Sword + Tower · Sturdy',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'dwarf',
      bodyBuild: 'sturdy',
      skin: 'tan',
      hairStyle: 'braids',
      hairColor: 'ginger',
      faceDetail: 'beard',
      headgear: 'helm',
      outfit: 'plate',
      outfitTier: 'tier3',
      outfitColor: 'crimson',
      weapon: 'sword',
      weaponTier: 'tier3',
      shield: 'tower',
      shieldTier: 'tier3',
    }),
  }),
  Object.freeze({
    id: 'ranger-bow',
    label: 'Ranger · Bow · Classic',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'elf',
      bodyBuild: 'classic',
      skin: 'pale',
      hairStyle: 'ponytail',
      hairColor: 'blonde',
      faceDetail: 'warpaint',
      headgear: 'hood',
      outfit: 'ranger',
      outfitTier: 'tier2',
      outfitColor: 'forest',
      weapon: 'bow',
      weaponTier: 'tier2',
    }),
  }),
  Object.freeze({
    id: 'warlock-ward',
    label: 'Warlock · Wand + Arcane · Classic',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'tiefling',
      bodyBuild: 'classic',
      skin: 'deep',
      hairStyle: 'mohawk',
      hairColor: 'pink',
      expression: 'angry',
      faceDetail: 'scar',
      headgear: 'horns',
      outfit: 'necromancer',
      outfitTier: 'tier3',
      outfitColor: 'charcoal',
      weapon: 'wand',
      weaponTier: 'tier3',
      shield: 'arcane',
      shieldTier: 'tier3',
    }),
  }),
  Object.freeze({
    id: 'vanguard-greatsword',
    label: 'Vanguard · Greatsword · Heroic',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'beastkin',
      bodyBuild: 'heroic',
      skin: 'brown',
      hairStyle: 'messy',
      hairColor: 'black',
      expression: 'angry',
      faceDetail: 'warpaint',
      headgear: 'none',
      outfit: 'barbarian',
      outfitTier: 'tier4',
      outfitColor: 'umber',
      weapon: 'greatsword',
      weaponTier: 'tier4',
    }),
  }),
  Object.freeze({
    id: 'unarmed-cleric',
    label: 'Cleric · Unarmed · Lean',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'human',
      bodyBuild: 'lean',
      skin: 'brown',
      hairStyle: 'bald',
      hairColor: 'black',
      expression: 'neutral',
      faceDetail: 'none',
      headgear: 'circlet',
      outfit: 'cleric',
      outfitTier: 'tier1',
      outfitColor: 'teal',
      weapon: 'none',
      weaponTier: 'tier1',
    }),
  }),
]);

function arraysEqual(left, right) {
  return left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function mergeLayers(layers) {
  const merged = new Array(engine.SIZE * engine.SIZE).fill(null);
  for (const pixels of layers) {
    for (let index = 0; index < merged.length; index++) {
      if (pixels[index] !== null && pixels[index] !== undefined) {
        merged[index] = pixels[index];
      }
    }
  }
  return merged;
}

function nonTransparentCount(pixels) {
  return pixels.reduce((count, color) => count + (color ? 1 : 0), 0);
}

function touches(first, second) {
  for (let index = 0; index < first.length; index++) {
    if (!first[index]) continue;
    const x = index % engine.SIZE;
    const y = Math.floor(index / engine.SIZE);
    for (const [offsetX, offsetY] of [[0, 0], [0, -1], [-1, 0], [1, 0], [0, 1]]) {
      const nextX = x + offsetX;
      const nextY = y + offsetY;
      if (
        nextX >= 0
        && nextY >= 0
        && nextX < engine.SIZE
        && nextY < engine.SIZE
        && second[(nextY * engine.SIZE) + nextX]
      ) return true;
    }
  }
  return false;
}

function renderAssembled(spec, direction, animationId, frame, options = {}) {
  return capturePixels((context) => {
    engine.drawAssembledSprite(context, spec, direction, animationId, frame, {
      ...options,
      clear: true,
      shadow: false,
    });
  });
}

const report = {
  format: '8-bit-sprite-assembler-player-cast-pilot-review',
  version: 1,
  generatedAt: new Date().toISOString(),
  profile: PLAYER_CAST_PROFILE,
  scope: {
    playerOnly: true,
    effects: 'off',
    publicAnimationCatalogChanged: true,
    publicSheetGeometryChanged: true,
    backgrounds: ['#e8ddc4', '#191b22'],
    visualPilots: PILOTS.map((pilot) => pilot.id),
    directions: [...engine.DIRS],
  },
  totals: {
    sourceFrames: 0,
    deterministicCases: 0,
    distinctFromIdleCases: 0,
    distinctFromAttackCases: 0,
    distinctFourFrameSequences: 0,
    recompositionCases: 0,
    equipmentAttachmentCases: 0,
    assembledTreatmentCases: 0,
    outOfBoundsDraws: 0,
  },
  failures: [],
};

const originalAnimations = engine.ANIMS.map(({ id, name, frames, ms }) => ({
  id,
  name,
  frames,
  ms,
}));
if (
  engine.SHEET_COLS !== 20
  || JSON.stringify(originalAnimations.map(({ id }) => id))
    !== JSON.stringify(['idle', 'walk', 'attack', 'cast', 'hurt', 'death'])
) {
  report.failures.push('public 20-column animation and sheet contracts do not retain approved Cast');
}

if (
  !Object.isFrozen(PLAYER_CAST_PROFILE)
  || !Object.isFrozen(PLAYER_CAST_ANIMATION)
  || PLAYER_CAST_PROFILE.animation !== PLAYER_CAST_ANIMATION
  || JSON.stringify(PLAYER_CAST_ANIMATION)
    !== JSON.stringify({ id: 'cast', name: 'Cast', frames: 4, ms: 130 })
) {
  report.failures.push('Player Cast profile must expose the exact immutable four-frame contract');
}

const poseSignature = [];
for (let frame = 0; frame < PLAYER_CAST_ANIMATION.frames; frame++) {
  const pose = playerCastPose(frame);
  poseSignature.push(
    `${pose.phase}:${pose.bodyBob}:${pose.leg}:${pose.sideHandReach}:`
    + `${pose.weaponHandOffset}:${pose.offhandHandOffset}`,
  );
  if (!Object.isFrozen(pose)) {
    report.failures.push(`Player Cast pose ${frame} is mutable`);
  }
}
if (new Set(poseSignature).size !== PLAYER_CAST_ANIMATION.frames) {
  report.failures.push('Player Cast must define four distinct pose phases');
}
for (const invalidFrame of [-1, 0.5, 4, Number.NaN]) {
  try {
    playerCastPose(invalidFrame);
    report.failures.push(`Player Cast accepted invalid frame ${String(invalidFrame)}`);
  } catch (error) {
    if (!(error instanceof RangeError)) {
      report.failures.push(`Player Cast invalid frame ${String(invalidFrame)} raised the wrong error`);
    }
  }
}

const catalogByField = {
  species: engine.SPECIES,
  bodyBuild: engine.BODY_BUILDS,
  skin: engine.SKINS,
  hairStyle: engine.HAIR_STYLES,
  hairColor: engine.HAIR_COLORS,
  expression: engine.EXPRESSIONS,
  faceDetail: engine.FACIAL_DETAILS,
  headgear: engine.HEADGEAR,
  outfit: engine.OUTFITS,
  outfitTier: engine.OUTFIT_TIERS,
  outfitColor: engine.OUTFIT_COLORS,
  weapon: engine.WEAPONS,
  weaponTier: engine.WEAPON_TIERS,
  shield: engine.SHIELDS,
  shieldTier: engine.SHIELD_TIERS,
  offhand: engine.OFFHANDS,
};
for (const pilot of PILOTS) {
  for (const [field, catalog] of Object.entries(catalogByField)) {
    if (!catalog.some(({ id }) => id === pilot.spec[field])) {
      report.failures.push(`${pilot.id}: invalid ${field} id ${String(pilot.spec[field])}`);
    }
  }
  if (pilot.spec.shield !== 'none' && pilot.spec.offhand !== 'none') {
    report.failures.push(`${pilot.id}: shield and utility off-hand must remain mutually exclusive`);
  }
}

const layerOrder = [
  'weapon-back',
  'shield-back',
  'offhand-back',
  'body',
  'shield-front',
  'offhand-front',
  'weapon-front',
];

for (const pilot of PILOTS) {
  for (const direction of engine.DIRS) {
    const sequence = [];
    for (let frame = 0; frame < PLAYER_CAST_ANIMATION.frames; frame++) {
      const prefix = `${pilot.id} ${direction} cast/${frame + 1}`;
      const outOfBounds = [];
      const source = renderSpritePixels(
        pilot.spec,
        direction,
        PLAYER_CAST_ANIMATION.id,
        frame,
        {
          shadow: false,
          onOutOfBounds: (draw) => outOfBounds.push(draw),
        },
      );
      const repeat = renderSpritePixels(
        pilot.spec,
        direction,
        PLAYER_CAST_ANIMATION.id,
        frame,
        { shadow: false },
      );
      report.totals.sourceFrames++;
      report.totals.outOfBoundsDraws += outOfBounds.length;
      sequence.push(JSON.stringify(source));

      if (outOfBounds.length) {
        report.failures.push(`${prefix}: ${outOfBounds.length} out-of-bounds draw(s)`);
      }
      if (!arraysEqual(source, repeat)) {
        report.failures.push(`${prefix}: source render is nondeterministic`);
      } else {
        report.totals.deterministicCases++;
      }
      if (!nonTransparentCount(source)) {
        report.failures.push(`${prefix}: source render is empty`);
      }

      const idleFrames = Array.from({ length: 2 }, (_, idleFrame) => (
        renderSpritePixels(pilot.spec, direction, 'idle', idleFrame, { shadow: false })
      ));
      if (idleFrames.some((idle) => arraysEqual(source, idle))) {
        report.failures.push(`${prefix}: Cast is identical to an Idle frame`);
      } else {
        report.totals.distinctFromIdleCases++;
      }
      const attackFrames = Array.from({ length: 4 }, (_, attackFrame) => (
        renderSpritePixels(pilot.spec, direction, 'attack', attackFrame, { shadow: false })
      ));
      if (attackFrames.some((attack) => arraysEqual(source, attack))) {
        report.failures.push(`${prefix}: Cast is identical to an Attack frame`);
      } else {
        report.totals.distinctFromAttackCases++;
      }

      const layers = layerOrder.map((layer) => (
        renderLayerPixels(
          pilot.spec,
          direction,
          PLAYER_CAST_ANIMATION.id,
          frame,
          layer,
        )
      ));
      const recomposed = mergeLayers(layers);
      if (!arraysEqual(source, recomposed)) {
        report.failures.push(`${prefix}: equipment/body layers did not recompose exactly`);
      } else {
        report.totals.recompositionCases++;
      }

      const bodyPixels = layers[3];
      const equipmentGroups = [];
      if (pilot.spec.weapon !== 'none') {
        equipmentGroups.push(['weapon', mergeLayers([layers[0], layers[6]])]);
      }
      if (pilot.spec.shield !== 'none') {
        equipmentGroups.push(['shield', mergeLayers([layers[1], layers[4]])]);
      }
      if (pilot.spec.offhand !== 'none') {
        equipmentGroups.push(['off-hand', mergeLayers([layers[2], layers[5]])]);
      }
      for (const [label, equipmentPixels] of equipmentGroups) {
        if (!touches(equipmentPixels, bodyPixels)) {
          report.failures.push(`${prefix}: ${label} lost contact with the animated body`);
        } else {
          report.totals.equipmentAttachmentCases++;
        }
      }

      for (const options of [
        { shadeMode: engine.SHADE_MODE_FORM },
        {
          shadeMode: engine.SHADE_MODE_FORM,
          outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
        },
        {
          shadeMode: engine.SHADE_MODE_FORM,
          outlineMode: engine.OUTLINE_MODE_SELECTIVE_C,
        },
      ]) {
        const assembled = renderAssembled(
          pilot.spec,
          direction,
          PLAYER_CAST_ANIMATION.id,
          frame,
          options,
        );
        const assembledRepeat = renderAssembled(
          pilot.spec,
          direction,
          PLAYER_CAST_ANIMATION.id,
          frame,
          options,
        );
        if (!arraysEqual(assembled, assembledRepeat)) {
          report.failures.push(`${prefix}: assembled treatment is nondeterministic`);
        } else {
          report.totals.deterministicCases++;
        }
        if (!nonTransparentCount(assembled)) {
          report.failures.push(`${prefix}: assembled treatment is empty`);
        }
        report.totals.assembledTreatmentCases++;
      }
    }
    if (new Set(sequence).size !== PLAYER_CAST_ANIMATION.frames) {
      report.failures.push(`${pilot.id} ${direction}: Cast does not have four distinct source frames`);
    } else {
      report.totals.distinctFourFrameSequences++;
    }
  }
}

const castSource = await readFile(
  path.join(root, 'engine', 'cast-animation.js'),
  'utf8',
);
if ([...castSource.matchAll(/from\s+['"]([^'"]+)['"]/g)].length) {
  report.failures.push('Player Cast contract must not depend on catalogs, renderers, DOM, or storage');
}
if (/\b(document|window|localStorage|sessionStorage|canvas|getContext|Math\.random)\b/.test(castSource)) {
  report.failures.push('Player Cast contract crossed its pure dependency boundary');
}

const pilotsJson = JSON.stringify(PILOTS).replaceAll('<', '\\u003c');
const reportJson = JSON.stringify(report).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Player Cast Pilot Review</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #111318; color: #f3f4f6; }
    * { box-sizing: border-box; }
    body { margin: 0; min-width: 1040px; background: #111318; }
    header { position: sticky; top: 0; z-index: 5; padding: 16px 20px; background: rgba(17,19,24,.97); border-bottom: 1px solid #303541; }
    h1 { margin: 0 0 4px; font-size: 20px; }
    .subtitle { color: #aeb6c5; font-size: 13px; }
    .controls { display: grid; grid-template-columns: 2fr repeat(3, minmax(130px, 1fr)) 120px; gap: 10px; margin-top: 14px; align-items: end; }
    label { display: grid; gap: 5px; color: #aeb6c5; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    select, input, button { min-height: 34px; border: 1px solid #3b4250; border-radius: 6px; background: #1b1f27; color: #f3f4f6; padding: 6px 9px; }
    button { cursor: pointer; font-weight: 700; }
    button.active { background: #5b65d9; border-color: #7780ee; }
    main { padding: 18px 20px 32px; }
    .notice { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 10px 12px; margin-bottom: 14px; border: 1px solid #3b4250; border-radius: 8px; background: #181c23; color: #cbd2df; font-size: 13px; }
    #review-stage { display: grid; grid-template-columns: repeat(5, minmax(180px, 1fr)); gap: 10px; padding: 14px; border-radius: 10px; background: #e8ddc4; }
    #review-stage.dark { background: #191b22; }
    .card { min-width: 0; padding: 11px; border: 1px solid rgba(127,138,160,.42); border-radius: 8px; background: rgba(17,19,24,.88); }
    .card h2 { margin: 0; font-size: 13px; }
    .card p { min-height: 45px; margin: 5px 0 9px; color: #aeb6c5; font-size: 10px; line-height: 1.35; }
    .zoom-wrap { display: grid; place-items: center; min-height: 210px; overflow: hidden; border-radius: 5px; background: transparent; }
    canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
    canvas.zoom { width: 192px; height: 192px; }
    .native-row { display: flex; align-items: center; gap: 8px; margin-top: 9px; color: #aeb6c5; font-size: 10px; }
    canvas.native { width: 24px; height: 24px; outline: 1px solid rgba(255,255,255,.18); }
    .metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 14px; }
    .metric { padding: 10px; background: #181c23; border: 1px solid #303541; border-radius: 7px; }
    .metric strong { display: block; font-size: 17px; }
    .metric span { color: #9da6b7; font-size: 11px; }
    .scope { margin-top: 12px; color: #9da6b7; font-size: 12px; }
  </style>
</head>
<body>
  <header>
    <h1>Player Cast · Isolated four-frame pilot</h1>
    <div class="subtitle">Prepare → Focus → Release → Recover · all directions · Effects Off · public 20-column contract</div>
    <div class="controls">
      <label>Character<select id="pilot"></select></label>
      <label>Direction<select id="direction"></select></label>
      <label>Cast frame<input id="frame" type="range" min="0" max="3" value="0"></label>
      <label>Background<select id="background"><option value="parchment" selected>Parchment #e8ddc4</option><option value="dark">Dark #191b22</option></select></label>
      <button id="cycle" type="button">Cycle Cast</button>
    </div>
  </header>
  <main>
    <div class="notice"><span id="readout"></span><span>Approved Player Cast remains active in public ANIMS and generated 20-column exports.</span></div>
    <section id="review-stage">
      <article class="card"><h2>Idle control</h2><p>Existing frame 1. Confirms Cast is not a relabeled idle pose.</p><div class="zoom-wrap"><canvas class="zoom" data-view="idle" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="idle" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Attack control</h2><p>Matching frame number. Confirms Cast remains distinct from weapon attacks.</p><div class="zoom-wrap"><canvas class="zoom" data-view="attack" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="attack" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Cast · source</h2><p>Untreated Player pose with no shadow and no effects.</p><div class="zoom-wrap"><canvas class="zoom" data-view="source" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="source" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Cast · Form + Complete B</h2><p>Approved Form shade with the strong assembled outline.</p><div class="zoom-wrap"><canvas class="zoom" data-view="complete-b" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="complete-b" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Cast · Form + Selective C</h2><p>Approved Form shade with the lighter assembled outline.</p><div class="zoom-wrap"><canvas class="zoom" data-view="selective-c" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="selective-c" width="24" height="24"></canvas>native 24×24</div></article>
    </section>
    <section class="metrics">
      <div class="metric"><strong>${report.totals.sourceFrames}</strong><span>Cast source frames</span></div>
      <div class="metric"><strong>${report.totals.distinctFourFrameSequences}</strong><span>distinct four-frame views</span></div>
      <div class="metric"><strong>${report.totals.recompositionCases}</strong><span>exact recompositions</span></div>
      <div class="metric"><strong>${report.totals.equipmentAttachmentCases}</strong><span>equipment attachments</span></div>
      <div class="metric"><strong>${report.failures.length}</strong><span>automated failures</span></div>
    </section>
    <div class="scope">Scope: 6 representative Players × 4 directions × 4 Cast frames × source/Form/Complete B/Selective C. Enemies alias Attack during Cast; checked-in fixtures, baselines, effects behavior, releases, and Windows builds remain unchanged.</div>
  </main>
  <script type="module">
    import * as E from '../sprite-engine.js';
    import { PLAYER_CAST_ANIMATION, playerCastPose } from '../engine/cast-animation.js';

    const pilots = ${pilotsJson};
    const report = ${reportJson};
    const pilotSelect = document.querySelector('#pilot');
    const directionSelect = document.querySelector('#direction');
    const frameInput = document.querySelector('#frame');
    const backgroundSelect = document.querySelector('#background');
    const cycleButton = document.querySelector('#cycle');
    const stage = document.querySelector('#review-stage');
    let cycleTimer = null;

    for (const pilot of pilots) pilotSelect.add(new Option(pilot.label, pilot.id));
    for (const direction of E.DIRS) directionSelect.add(new Option(direction.toUpperCase(), direction));

    const pilot = () => pilots.find((entry) => entry.id === pilotSelect.value) || pilots[0];
    const frame = () => Math.min(Number(frameInput.value), PLAYER_CAST_ANIMATION.frames - 1);

    function drawView(context, view, spec, direction, frameIndex) {
      context.clearRect(0, 0, E.SIZE, E.SIZE);
      context.imageSmoothingEnabled = false;
      let animationId = PLAYER_CAST_ANIMATION.id;
      let candidateFrame = frameIndex;
      const options = { shadow: false };
      if (view === 'idle') {
        animationId = 'idle';
        candidateFrame = 0;
      }
      if (view === 'attack') animationId = 'attack';
      if (view === 'complete-b') {
        options.shadeMode = E.SHADE_MODE_FORM;
        options.outlineMode = E.OUTLINE_MODE_COMPLETE_B;
      }
      if (view === 'selective-c') {
        options.shadeMode = E.SHADE_MODE_FORM;
        options.outlineMode = E.OUTLINE_MODE_SELECTIVE_C;
      }
      E.drawAssembledSprite(context, spec, direction, animationId, candidateFrame, options);
    }

    function render() {
      const currentPilot = pilot();
      const currentFrame = frame();
      for (const canvas of document.querySelectorAll('canvas[data-view]')) {
        drawView(
          canvas.getContext('2d'),
          canvas.dataset.view,
          currentPilot.spec,
          directionSelect.value,
          currentFrame,
        );
      }
      const pose = playerCastPose(currentFrame);
      document.querySelector('#readout').textContent =
        currentPilot.label + ' · ' + directionSelect.value.toUpperCase()
        + ' · ' + pose.phase.toUpperCase() + ' · frame '
        + (currentFrame + 1) + '/' + PLAYER_CAST_ANIMATION.frames;
      stage.classList.toggle('dark', backgroundSelect.value === 'dark');
    }

    function advance() {
      const nextFrame = frame() + 1;
      if (nextFrame < PLAYER_CAST_ANIMATION.frames) {
        frameInput.value = String(nextFrame);
        render();
        return;
      }
      frameInput.value = '0';
      const directionIndex = E.DIRS.indexOf(directionSelect.value);
      if (directionIndex + 1 < E.DIRS.length) {
        directionSelect.value = E.DIRS[directionIndex + 1];
        render();
        return;
      }
      directionSelect.value = E.DIRS[0];
      const pilotIndex = pilots.findIndex((entry) => entry.id === pilotSelect.value);
      pilotSelect.value = pilots[(pilotIndex + 1) % pilots.length].id;
      render();
    }

    function toggleCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
        cycleButton.classList.remove('active');
        cycleButton.textContent = 'Cycle Cast';
      } else {
        cycleTimer = setInterval(advance, PLAYER_CAST_ANIMATION.ms * 3);
        cycleButton.classList.add('active');
        cycleButton.textContent = 'Pause cycle';
      }
    }

    for (const control of [pilotSelect, directionSelect, frameInput, backgroundSelect]) {
      control.addEventListener('input', render);
    }
    cycleButton.addEventListener('click', toggleCycle);
    render();
  </script>
</body>
</html>`;

await writeFile(path.join(output, 'index.html'), html, 'utf8');
await writeFile(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (report.failures.length) {
  console.error(
    `Player Cast pilot failed with ${report.failures.length} error`
    + `${report.failures.length === 1 ? '' : 's'}:`,
  );
  for (const failure of report.failures.slice(0, 100)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Player Cast pilot review generated.');
console.log(`- Source frames: ${report.totals.sourceFrames}`);
console.log(`- Distinct four-frame views: ${report.totals.distinctFourFrameSequences}`);
console.log(`- Exact recompositions: ${report.totals.recompositionCases}`);
console.log(`- Equipment attachment cases: ${report.totals.equipmentAttachmentCases}`);
console.log(`- Assembled treatment cases: ${report.totals.assembledTreatmentCases}`);
console.log(`- Out-of-bounds draws: ${report.totals.outOfBoundsDraws}`);
console.log(`- Review: ${path.join(output, 'index.html')}`);
