import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import {
  PLAYER_DEATH_ANIMATION,
  PLAYER_DEATH_PROFILE,
  playerDeathPose,
  transformPlayerDeathPixels,
} from '../engine/death-animation.js';
import {
  capturePixels,
  renderLayerPixels,
  renderSpritePixels,
} from '../engine/pixel-buffer.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(
  root,
  outputFlag >= 0 ? process.argv[outputFlag + 1] : 'death-review',
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
    label: 'Mage - Staff + Lantern - Lean',
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
    label: 'Guardian - Sword + Tower - Sturdy',
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
    label: 'Ranger - Bow - Classic',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'elf',
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
    label: 'Warlock - Wand + Arcane - Classic',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'tiefling',
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
    label: 'Vanguard - Greatsword - Heroic',
    spec: Object.freeze({
      ...BASE_PLAYER,
      species: 'beastkin',
      bodyBuild: 'heroic',
      skin: 'brown',
      hairStyle: 'messy',
      hairColor: 'black',
      expression: 'angry',
      faceDetail: 'warpaint',
      outfit: 'barbarian',
      outfitTier: 'tier4',
      outfitColor: 'umber',
      weapon: 'greatsword',
      weaponTier: 'tier4',
    }),
  }),
  Object.freeze({
    id: 'unarmed-cleric',
    label: 'Cleric - Unarmed - Lean',
    spec: Object.freeze({
      ...BASE_PLAYER,
      bodyBuild: 'lean',
      skin: 'brown',
      hairStyle: 'bald',
      hairColor: 'black',
      expression: 'neutral',
      headgear: 'circlet',
      outfit: 'cleric',
      outfitColor: 'teal',
      weapon: 'none',
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

function touches(first, second) {
  for (let index = 0; index < first.length; index++) {
    if (!first[index]) continue;
    const x = index % engine.SIZE;
    const y = Math.floor(index / engine.SIZE);
    for (const [dx, dy] of [[0, 0], [0, -1], [-1, 0], [1, 0], [0, 1]]) {
      const nextX = x + dx;
      const nextY = y + dy;
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

function bounds(pixels) {
  const points = pixels.flatMap((color, index) => (
    color ? [[index % engine.SIZE, Math.floor(index / engine.SIZE)]] : []
  ));
  if (!points.length) return null;
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    width: Math.max(...xs) - Math.min(...xs) + 1,
    height: Math.max(...ys) - Math.min(...ys) + 1,
  };
}

function renderAssembled(spec, direction, frame, options = {}) {
  return capturePixels((context) => {
    engine.drawAssembledSprite(
      context,
      spec,
      direction,
      PLAYER_DEATH_ANIMATION.id,
      frame,
      { ...options, clear: true, shadow: false },
    );
  });
}

const report = {
  format: '8-bit-sprite-assembler-player-death-pilot-review',
  version: 1,
  generatedAt: new Date().toISOString(),
  profile: PLAYER_DEATH_PROFILE,
  scope: {
    playerOnly: true,
    effects: 'off',
    publicAnimationCatalogChanged: true,
    publicSheetGeometryChanged: true,
    visualPilots: PILOTS.map(({ id }) => id),
    directions: [...engine.DIRS],
  },
  totals: {
    sourceFrames: 0,
    deterministicCases: 0,
    distinctFromIdleCases: 0,
    distinctFromHurtCases: 0,
    distinctFourFrameSequences: 0,
    fallenBodyCases: 0,
    recompositionCases: 0,
    equipmentAttachmentCases: 0,
    assembledTreatmentCases: 0,
    outOfBoundsDraws: 0,
  },
  failures: [],
};

if (
  engine.SHEET_COLS !== 20
  || JSON.stringify(engine.ANIMS.map(({ id }) => id))
    !== JSON.stringify(['idle', 'walk', 'attack', 'cast', 'hurt', 'death'])
) {
  report.failures.push('public animation and 20-column sheet contracts do not include approved Death');
}

if (
  !Object.isFrozen(PLAYER_DEATH_PROFILE)
  || !Object.isFrozen(PLAYER_DEATH_ANIMATION)
  || PLAYER_DEATH_PROFILE.animation !== PLAYER_DEATH_ANIMATION
  || JSON.stringify(PLAYER_DEATH_ANIMATION)
    !== JSON.stringify({ id: 'death', name: 'Death', frames: 4, ms: 160 })
) {
  report.failures.push('Player Death profile must expose the exact immutable four-frame contract');
}

const poseSignatures = [];
for (let frame = 0; frame < PLAYER_DEATH_ANIMATION.frames; frame++) {
  const pose = playerDeathPose(frame);
  poseSignatures.push(
    `${pose.phase}:${pose.bodyBob}:${pose.leg}:${pose.arm}:${pose.quarterTurn}`,
  );
  if (!Object.isFrozen(pose)) report.failures.push(`Player Death pose ${frame} is mutable`);
}
if (new Set(poseSignatures).size !== PLAYER_DEATH_ANIMATION.frames) {
  report.failures.push('Player Death must define four distinct pose phases');
}
for (const invalidFrame of [-1, 0.5, 4, Number.NaN]) {
  try {
    playerDeathPose(invalidFrame);
    report.failures.push(`Player Death accepted invalid frame ${String(invalidFrame)}`);
  } catch (error) {
    if (!(error instanceof RangeError)) {
      report.failures.push(`Player Death invalid frame ${String(invalidFrame)} raised the wrong error`);
    }
  }
}

const markerPixels = Array.from(
  { length: engine.SIZE * engine.SIZE },
  (_, index) => index,
);
for (const direction of engine.DIRS) {
  for (const frame of [2, 3]) {
    const transformed = transformPlayerDeathPixels(
      markerPixels,
      direction,
      frame,
      engine.SIZE,
    );
    if (
      transformed.length !== markerPixels.length
      || new Set(transformed).size !== markerPixels.length
      || !markerPixels.every((marker) => transformed.includes(marker))
    ) {
      report.failures.push(`${direction} Death frame ${frame + 1} is not a coordinate permutation`);
    }
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
    for (let frame = 0; frame < PLAYER_DEATH_ANIMATION.frames; frame++) {
      const prefix = `${pilot.id} ${direction} death/${frame + 1}`;
      const outOfBounds = [];
      const source = renderSpritePixels(
        pilot.spec,
        direction,
        PLAYER_DEATH_ANIMATION.id,
        frame,
        {
          shadow: false,
          onOutOfBounds: (draw) => outOfBounds.push(draw),
        },
      );
      const repeat = renderSpritePixels(
        pilot.spec,
        direction,
        PLAYER_DEATH_ANIMATION.id,
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
      if (!source.some(Boolean)) report.failures.push(`${prefix}: source render is empty`);

      const idleFrames = [0, 1].map((idleFrame) => (
        renderSpritePixels(pilot.spec, direction, 'idle', idleFrame, { shadow: false })
      ));
      if (idleFrames.some((idle) => arraysEqual(source, idle))) {
        report.failures.push(`${prefix}: Death is identical to an Idle frame`);
      } else {
        report.totals.distinctFromIdleCases++;
      }
      const hurtFrames = [0, 1].map((hurtFrame) => (
        renderSpritePixels(pilot.spec, direction, 'hurt', hurtFrame, { shadow: false })
      ));
      if (hurtFrames.some((hurt) => arraysEqual(source, hurt))) {
        report.failures.push(`${prefix}: Death is identical to a Hurt frame`);
      } else {
        report.totals.distinctFromHurtCases++;
      }

      const layers = layerOrder.map((layer) => (
        renderLayerPixels(
          pilot.spec,
          direction,
          PLAYER_DEATH_ANIMATION.id,
          frame,
          layer,
        )
      ));
      if (!arraysEqual(source, mergeLayers(layers))) {
        report.failures.push(`${prefix}: equipment/body layers did not recompose exactly`);
      } else {
        report.totals.recompositionCases++;
      }

      const bodyPixels = layers[3];
      if (frame >= 2) {
        const bodyBounds = bounds(bodyPixels);
        if (!bodyBounds || bodyBounds.width <= bodyBounds.height) {
          report.failures.push(`${prefix}: terminal body is not materially horizontal`);
        } else {
          report.totals.fallenBodyCases++;
        }
      }

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
          report.failures.push(`${prefix}: ${label} lost contact with the body`);
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
        const assembled = renderAssembled(pilot.spec, direction, frame, options);
        const assembledRepeat = renderAssembled(pilot.spec, direction, frame, options);
        if (!arraysEqual(assembled, assembledRepeat)) {
          report.failures.push(`${prefix}: assembled treatment is nondeterministic`);
        } else {
          report.totals.deterministicCases++;
        }
        if (!assembled.some(Boolean)) {
          report.failures.push(`${prefix}: assembled treatment is empty`);
        }
        report.totals.assembledTreatmentCases++;
      }
    }
    if (new Set(sequence).size !== PLAYER_DEATH_ANIMATION.frames) {
      report.failures.push(`${pilot.id} ${direction}: Death does not have four distinct source frames`);
    } else {
      report.totals.distinctFourFrameSequences++;
    }
  }
}

const deathSource = await readFile(
  path.join(root, 'engine', 'death-animation.js'),
  'utf8',
);
if ([...deathSource.matchAll(/from\s+['"]([^'"]+)['"]/g)].length) {
  report.failures.push('Player Death contract must not depend on catalogs or renderers');
}
if (/\b(document|window|localStorage|sessionStorage|canvas|getContext|Math\.random)\b/.test(deathSource)) {
  report.failures.push('Player Death contract crossed its pure dependency boundary');
}

const pilotsJson = JSON.stringify(PILOTS).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Player Death Pilot Review</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; background: #111318; color: #f3f4f6; }
    * { box-sizing: border-box; }
    body { margin: 0; min-width: 1020px; }
    header { position: sticky; top: 0; z-index: 3; padding: 15px 20px; background: rgba(17,19,24,.97); border-bottom: 1px solid #303541; }
    h1 { margin: 0 0 4px; font-size: 20px; }
    .sub { color: #aeb6c5; font-size: 13px; }
    .controls { display: grid; grid-template-columns: 2fr repeat(3, minmax(140px, 1fr)) 120px; gap: 10px; margin-top: 13px; align-items: end; }
    label { display: grid; gap: 5px; color: #aeb6c5; font-size: 11px; text-transform: uppercase; }
    select, input, button { min-height: 34px; border: 1px solid #3b4250; border-radius: 6px; background: #1b1f27; color: #f3f4f6; padding: 6px 9px; }
    button { cursor: pointer; font-weight: 700; }
    button.active { background: #5b65d9; }
    main { padding: 18px 20px 30px; }
    .notice { display: flex; justify-content: space-between; padding: 10px 12px; margin-bottom: 14px; border: 1px solid #3b4250; border-radius: 8px; background: #181c23; color: #cbd2df; font-size: 13px; }
    #stage { display: grid; grid-template-columns: repeat(5, minmax(180px, 1fr)); gap: 10px; padding: 14px; border-radius: 10px; background: #e8ddc4; }
    #stage.dark { background: #191b22; }
    .card { padding: 11px; border: 1px solid rgba(127,138,160,.42); border-radius: 8px; background: rgba(17,19,24,.9); }
    .card h2 { margin: 0; font-size: 13px; }
    .card p { min-height: 42px; margin: 5px 0 9px; color: #aeb6c5; font-size: 10px; line-height: 1.35; }
    .zoom-wrap { display: grid; place-items: center; min-height: 210px; overflow: hidden; }
    canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
    canvas.zoom { width: 192px; height: 192px; }
    .native { width: 24px; height: 24px; outline: 1px solid rgba(255,255,255,.2); }
    .native-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; color: #aeb6c5; font-size: 10px; }
    .metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 14px; }
    .metric { padding: 10px; background: #181c23; border: 1px solid #303541; border-radius: 7px; }
    .metric strong { display: block; font-size: 17px; }
    .metric span, .scope { color: #9da6b7; font-size: 11px; }
    .scope { margin-top: 12px; }
  </style>
</head>
<body>
  <header>
    <h1>Player Death - Isolated four-frame pilot</h1>
    <div class="sub">Stagger -> Buckle -> Fall -> Still - all directions - Effects Off - public 20-column sheets</div>
    <div class="controls">
      <label>Character<select id="pilot"></select></label>
      <label>Direction<select id="direction"></select></label>
      <label>Death frame<input id="frame" type="range" min="0" max="3" value="0"></label>
      <label>Background<select id="background"><option value="parchment">Parchment</option><option value="dark">Dark</option></select></label>
      <button id="cycle" type="button">Cycle Death</button>
    </div>
  </header>
  <main>
    <div class="notice"><span id="readout"></span><span>Approved Player Death is active in public ANIMS and generated 20-column exports.</span></div>
    <section id="stage">
      <article class="card"><h2>Idle control</h2><p>Existing idle frame 1.</p><div class="zoom-wrap"><canvas class="zoom" data-view="idle" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="idle" width="24" height="24"></canvas>native 24x24</div></article>
      <article class="card"><h2>Hurt control</h2><p>Existing Hurt frame for comparison.</p><div class="zoom-wrap"><canvas class="zoom" data-view="hurt" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="hurt" width="24" height="24"></canvas>native 24x24</div></article>
      <article class="card"><h2>Death - source</h2><p>Untreated candidate with Effects Off.</p><div class="zoom-wrap"><canvas class="zoom" data-view="source" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="source" width="24" height="24"></canvas>native 24x24</div></article>
      <article class="card"><h2>Death - Form + Complete B</h2><p>Approved Form with the strong outline.</p><div class="zoom-wrap"><canvas class="zoom" data-view="complete-b" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="complete-b" width="24" height="24"></canvas>native 24x24</div></article>
      <article class="card"><h2>Death - Form + Selective C</h2><p>Approved Form with the lighter outline.</p><div class="zoom-wrap"><canvas class="zoom" data-view="selective-c" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="selective-c" width="24" height="24"></canvas>native 24x24</div></article>
    </section>
    <section class="metrics">
      <div class="metric"><strong>${report.totals.sourceFrames}</strong><span>Death source frames</span></div>
      <div class="metric"><strong>${report.totals.distinctFourFrameSequences}</strong><span>distinct sequences</span></div>
      <div class="metric"><strong>${report.totals.recompositionCases}</strong><span>exact recompositions</span></div>
      <div class="metric"><strong>${report.totals.equipmentAttachmentCases}</strong><span>equipment attachments</span></div>
      <div class="metric"><strong>${report.failures.length}</strong><span>automated failures</span></div>
    </section>
    <div class="scope">Scope: 6 Players x 4 directions x 4 Death frames x source/Form/Complete B/Selective C. No Enemy, editor, export, schema, fixture, baseline, effect, release, or Windows-build change.</div>
  </main>
  <script type="module">
    import * as E from '../sprite-engine.js';
    import {
      PLAYER_DEATH_ANIMATION,
      playerDeathPose,
    } from '../engine/death-animation.js';

    const pilots = ${pilotsJson};
    const pilotSelect = document.querySelector('#pilot');
    const directionSelect = document.querySelector('#direction');
    const frameInput = document.querySelector('#frame');
    const backgroundSelect = document.querySelector('#background');
    const cycleButton = document.querySelector('#cycle');
    const stage = document.querySelector('#stage');
    let timer = null;

    for (const pilot of pilots) pilotSelect.add(new Option(pilot.label, pilot.id));
    for (const direction of E.DIRS) directionSelect.add(new Option(direction.toUpperCase(), direction));
    const selectedPilot = () => pilots.find(({ id }) => id === pilotSelect.value) || pilots[0];
    const selectedFrame = () => Math.min(Number(frameInput.value), 3);

    function drawView(context, view, spec, direction, frame) {
      context.clearRect(0, 0, E.SIZE, E.SIZE);
      context.imageSmoothingEnabled = false;
      let animationId = PLAYER_DEATH_ANIMATION.id;
      let candidateFrame = frame;
      const options = { shadow: true };
      if (view === 'idle') {
        animationId = 'idle';
        candidateFrame = 0;
      } else if (view === 'hurt') {
        animationId = 'hurt';
        candidateFrame = Math.min(frame, 1);
      } else if (view === 'complete-b') {
        options.shadeMode = E.SHADE_MODE_FORM;
        options.outlineMode = E.OUTLINE_MODE_COMPLETE_B;
      } else if (view === 'selective-c') {
        options.shadeMode = E.SHADE_MODE_FORM;
        options.outlineMode = E.OUTLINE_MODE_SELECTIVE_C;
      }
      E.drawAssembledSprite(context, spec, direction, animationId, candidateFrame, options);
    }

    function render() {
      const pilot = selectedPilot();
      const frame = selectedFrame();
      for (const canvas of document.querySelectorAll('canvas[data-view]')) {
        drawView(
          canvas.getContext('2d'),
          canvas.dataset.view,
          pilot.spec,
          directionSelect.value,
          frame,
        );
      }
      const pose = playerDeathPose(frame);
      document.querySelector('#readout').textContent =
        pilot.label + ' - ' + directionSelect.value.toUpperCase()
        + ' - ' + pose.phase.toUpperCase() + ' - frame ' + (frame + 1) + '/4';
      stage.classList.toggle('dark', backgroundSelect.value === 'dark');
    }

    function advance() {
      const next = selectedFrame() + 1;
      if (next < 4) {
        frameInput.value = String(next);
      } else {
        frameInput.value = '0';
        const directionIndex = E.DIRS.indexOf(directionSelect.value);
        if (directionIndex + 1 < E.DIRS.length) {
          directionSelect.value = E.DIRS[directionIndex + 1];
        } else {
          directionSelect.value = E.DIRS[0];
          const pilotIndex = pilots.findIndex(({ id }) => id === pilotSelect.value);
          pilotSelect.value = pilots[(pilotIndex + 1) % pilots.length].id;
        }
      }
      render();
    }

    function toggleCycle() {
      if (timer) {
        clearInterval(timer);
        timer = null;
        cycleButton.classList.remove('active');
        cycleButton.textContent = 'Cycle Death';
      } else {
        timer = setInterval(advance, PLAYER_DEATH_ANIMATION.ms * 3);
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
await writeFile(
  path.join(output, 'report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

if (report.failures.length) {
  console.error(`Player Death pilot failed with ${report.failures.length} error(s):`);
  for (const failure of report.failures.slice(0, 100)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Player Death pilot review generated.');
console.log(`- Source frames: ${report.totals.sourceFrames}`);
console.log(`- Distinct four-frame views: ${report.totals.distinctFourFrameSequences}`);
console.log(`- Fallen body cases: ${report.totals.fallenBodyCases}`);
console.log(`- Exact recompositions: ${report.totals.recompositionCases}`);
console.log(`- Equipment attachment cases: ${report.totals.equipmentAttachmentCases}`);
console.log(`- Assembled treatment cases: ${report.totals.assembledTreatmentCases}`);
console.log(`- Out-of-bounds draws: ${report.totals.outOfBoundsDraws}`);
console.log(`- Review: ${path.join(output, 'index.html')}`);
