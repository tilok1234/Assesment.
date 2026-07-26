import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import {
  buildShadeMaterialLookup,
  FORM_DARK_FEATURE_LUMINANCE_THRESHOLD,
  FORM_TINY_ACCENT_MAX_PIXELS,
  protectedShadeMask,
  shadePixels,
} from '../engine/shade-renderer.js';
import { capturePixels, renderSpritePixels } from '../engine/pixel-buffer.js';
import { SHADE_PILOTS } from './shade-pilots.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(
  root,
  outputFlag >= 0 ? process.argv[outputFlag + 1] : 'shade-review',
);
await mkdir(output, { recursive: true });

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
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
  format: '8-bit-sprite-assembler-shade-review',
  version: 1,
  generatedAt: new Date().toISOString(),
  algorithm: {
    darkFeatureLuminanceThreshold: FORM_DARK_FEATURE_LUMINANCE_THRESHOLD,
    tinyAccentMaximumPixels: FORM_TINY_ACCENT_MAX_PIXELS,
    edgePrecedence: ['top', 'bottom', 'right'],
    backgrounds: ['#191b22', '#e8ddc4'],
  },
  pilots: [],
  totals: {
    sourceFrames: 0,
    formModeCases: 0,
    changedPixels: 0,
    protectedSourcePixels: 0,
    deterministicCases: 0,
    materialControlDifferences: 0,
    outlinePreservationCases: 0,
    malformedPixels: 0,
  },
  failures: [],
};

for (const pilot of SHADE_PILOTS) {
  const summary = {
    id: pilot.id,
    label: pilot.label,
    kind: pilot.spec.kind,
    frames: 0,
    formModeCases: 0,
    changedPixels: 0,
    protectedSourcePixels: 0,
    palette: new Set(),
    materialControlDifferences: 0,
  };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const source = renderSpritePixels(
        pilot.spec,
        direction,
        animation.id,
        frame,
        { shadow: false },
      );
      const lookup = buildShadeMaterialLookup(pilot.spec);
      const protectedMask = protectedShadeMask(source);
      const materialForm = shadePixels(source, lookup, { protectedMask });
      const silhouetteControl = shadePixels(source, lookup, {
        protectedMask,
        silhouetteOnly: true,
      });
      const controlDifferences = materialForm.filter((
        color,
        index,
      ) => color !== silhouetteControl[index]).length;
      summary.materialControlDifferences += controlDifferences;
      report.totals.materialControlDifferences += controlDifferences;
      summary.protectedSourcePixels += protectedMask.reduce((
        count,
        value,
        index,
      ) => count + (value && source[index] ? 1 : 0), 0);
      summary.frames++;
      report.totals.sourceFrames++;

      for (const outlineMode of [
        engine.OUTLINE_MODE_NONE,
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const before = renderAssembled(pilot.spec, direction, animation.id, frame, {
          outlineMode,
        });
        const form = renderAssembled(pilot.spec, direction, animation.id, frame, {
          shadeMode: engine.SHADE_MODE_FORM,
          outlineMode,
        });
        const repeat = renderAssembled(pilot.spec, direction, animation.id, frame, {
          shadeMode: engine.SHADE_MODE_FORM,
          outlineMode,
        });
        const prefix = `${pilot.id} ${direction} ${animation.id}/${frame + 1} ${outlineMode}`;
        if (!arraysEqual(form, repeat)) report.failures.push(`${prefix}: nondeterministic output`);
        else report.totals.deterministicCases++;

        for (let index = 0; index < form.length; index++) {
          const color = form[index];
          if (color !== null && !/^#[0-9a-f]{6}$/.test(color)) {
            report.totals.malformedPixels++;
            report.failures.push(`${prefix}: malformed pixel ${String(color)}`);
          }
          if (before[index] !== source[index] && form[index] !== before[index]) {
            report.failures.push(`${prefix}: changed approved outline pixel ${index}`);
          }
          if (form[index] !== before[index]) {
            summary.changedPixels++;
            report.totals.changedPixels++;
          }
          if (color) summary.palette.add(color);
        }
        summary.formModeCases++;
        report.totals.formModeCases++;
        report.totals.outlinePreservationCases++;
      }
    }
  }
  if (!summary.changedPixels) report.failures.push(`${pilot.id}: no visible Form changes`);
  if (!summary.materialControlDifferences) {
    report.failures.push(`${pilot.id}: material Form matches silhouette-only control`);
  }
  report.totals.protectedSourcePixels += summary.protectedSourcePixels;
  report.pilots.push({
    ...summary,
    palette: [...summary.palette].sort(),
  });
}

const pilotsJson = JSON.stringify(SHADE_PILOTS).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shade Form Pilot Review</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      background: #111318;
      color: #f3f4f6;
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-width: 1040px; background: #111318; }
    header {
      position: sticky; top: 0; z-index: 5;
      padding: 16px 20px; background: rgba(17,19,24,.96);
      border-bottom: 1px solid #303541; backdrop-filter: blur(10px);
    }
    h1 { margin: 0 0 4px; font-size: 20px; }
    .subtitle { color: #aeb6c5; font-size: 13px; }
    .controls {
      display: grid; grid-template-columns: 2fr repeat(5, minmax(120px, 1fr));
      gap: 10px; margin-top: 14px; align-items: end;
    }
    label { display: grid; gap: 5px; color: #aeb6c5; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    select, input, button {
      min-height: 34px; border: 1px solid #3b4250; border-radius: 6px;
      background: #1b1f27; color: #f3f4f6; padding: 6px 9px;
    }
    button { cursor: pointer; font-weight: 700; }
    button.active { background: #5b65d9; border-color: #7780ee; }
    main { padding: 18px 20px 32px; }
    .notice {
      display: flex; justify-content: space-between; gap: 16px; align-items: center;
      padding: 10px 12px; margin-bottom: 14px; border: 1px solid #3b4250;
      border-radius: 8px; background: #181c23; color: #cbd2df; font-size: 13px;
    }
    #review-stage {
      display: grid; grid-template-columns: repeat(5, minmax(180px, 1fr));
      gap: 12px; padding: 16px; border-radius: 10px; background: #191b22;
    }
    #review-stage.parchment { background: #e8ddc4; }
    .card {
      min-width: 0; padding: 12px; border: 1px solid rgba(127,138,160,.42);
      border-radius: 8px; background: rgba(17,19,24,.82);
    }
    .card h2 { margin: 0; font-size: 13px; }
    .card p { min-height: 32px; margin: 5px 0 10px; color: #aeb6c5; font-size: 11px; line-height: 1.35; }
    .zoom-wrap {
      display: grid; place-items: center; min-height: 252px; overflow: hidden;
      border-radius: 5px; background: transparent;
    }
    canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
    canvas.zoom { width: 240px; height: 240px; }
    .native-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: #aeb6c5; font-size: 11px; }
    canvas.native { width: 24px; height: 24px; outline: 1px solid rgba(255,255,255,.18); }
    .metrics {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
      margin-top: 14px;
    }
    .metric { padding: 10px; background: #181c23; border: 1px solid #303541; border-radius: 7px; }
    .metric strong { display: block; font-size: 17px; }
    .metric span { color: #9da6b7; font-size: 11px; }
    .scope { margin-top: 12px; color: #9da6b7; font-size: 12px; }
  </style>
</head>
<body>
  <header>
    <h1>Shared Form Shade Pilot</h1>
    <div class="subtitle">Effects Off · approved Form algorithm · no exported background · inspect every direction, animation, and frame</div>
    <div class="controls">
      <label>Specimen<select id="pilot"></select></label>
      <label>Direction<select id="direction"></select></label>
      <label>Animation<select id="animation"></select></label>
      <label>Frame<input id="frame" type="range" min="0" value="0"></label>
      <label>Background<select id="background"><option value="parchment" selected>Parchment #e8ddc4</option><option value="dark">Dark #191b22</option></select></label>
      <button id="cycle" type="button">Cycle all</button>
    </div>
  </header>
  <main>
    <div class="notice">
      <span id="readout"></span>
      <span>Material-region Form must beat the silhouette-only control without noisy seams.</span>
    </div>
    <section id="review-stage" class="parchment">
      <article class="card"><h2>Before · None</h2><p>Approved untreated source.</p><div class="zoom-wrap"><canvas class="zoom" data-view="before" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="before" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Silhouette control</h2><p>Alpha edge only; comparison, not the candidate.</p><div class="zoom-wrap"><canvas class="zoom" data-view="control" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="control" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Form · None</h2><p>Material-aware shade without outline.</p><div class="zoom-wrap"><canvas class="zoom" data-view="form-none" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="form-none" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Form · Complete B</h2><p>Strong approved outline geometry.</p><div class="zoom-wrap"><canvas class="zoom" data-view="form-b" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="form-b" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Form · Selective C</h2><p>Light approved outline geometry.</p><div class="zoom-wrap"><canvas class="zoom" data-view="form-c" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="form-c" width="24" height="24"></canvas>native 24×24</div></article>
    </section>
    <section class="metrics">
      <div class="metric"><strong id="changed">0</strong><span>Form changed pixels</span></div>
      <div class="metric"><strong id="protected">0</strong><span>protected source pixels</span></div>
      <div class="metric"><strong id="materials">0</strong><span>registered material colors</span></div>
      <div class="metric"><strong id="control-diff">0</strong><span>material/control differences</span></div>
    </section>
    <div class="scope">Scope: 12 specimens × 4 directions × idle/walk/attack/hurt × every frame × None/Complete B/Selective C. The cycle control traverses the full selected-specimen sequence.</div>
  </main>
  <script type="module">
    import * as E from '../sprite-engine.js';
    import { buildShadeMaterialLookup, protectedShadeMask, shadePixels } from '../engine/shade-renderer.js';
    import { paintPixels, renderSpritePixels } from '../engine/pixel-buffer.js';

    const pilots = ${pilotsJson};
    const pilotSelect = document.querySelector('#pilot');
    const directionSelect = document.querySelector('#direction');
    const animationSelect = document.querySelector('#animation');
    const frameInput = document.querySelector('#frame');
    const backgroundSelect = document.querySelector('#background');
    const cycleButton = document.querySelector('#cycle');
    const stage = document.querySelector('#review-stage');
    let cycleTimer = null;

    for (const pilot of pilots) pilotSelect.add(new Option(pilot.label, pilot.id));
    for (const direction of E.DIRS) directionSelect.add(new Option(direction.toUpperCase(), direction));
    for (const animation of E.ANIMS) animationSelect.add(new Option(animation.name, animation.id));
    animationSelect.value = 'attack';
    frameInput.value = '1';

    const animation = () => E.ANIMS.find((entry) => entry.id === animationSelect.value) || E.ANIMS[0];
    const pilot = () => pilots.find((entry) => entry.id === pilotSelect.value) || pilots[0];
    const frame = () => Math.min(Number(frameInput.value), animation().frames - 1);

    function drawSilhouetteControl(context, spec, direction, animationId, frameIndex) {
      E.drawSprite(context, spec, direction, animationId, frameIndex, { shadow: true });
      const source = renderSpritePixels(spec, direction, animationId, frameIndex, { shadow: false });
      const lookup = buildShadeMaterialLookup(spec);
      const protectedMask = protectedShadeMask(source);
      paintPixels(context, shadePixels(source, lookup, { protectedMask, silhouetteOnly: true }));
    }

    function drawView(context, view, spec, direction, animationId, frameIndex) {
      context.clearRect(0, 0, 24, 24);
      context.imageSmoothingEnabled = false;
      if (view === 'control') {
        drawSilhouetteControl(context, spec, direction, animationId, frameIndex);
        return;
      }
      const options = { shadow: true };
      if (view !== 'before') options.shadeMode = E.SHADE_MODE_FORM;
      if (view === 'form-b') options.outlineMode = E.OUTLINE_MODE_COMPLETE_B;
      if (view === 'form-c') options.outlineMode = E.OUTLINE_MODE_SELECTIVE_C;
      E.drawAssembledSprite(context, spec, direction, animationId, frameIndex, options);
    }

    function render() {
      const currentPilot = pilot();
      const currentAnimation = animation();
      frameInput.max = String(currentAnimation.frames - 1);
      if (Number(frameInput.value) > currentAnimation.frames - 1) frameInput.value = '0';
      const currentFrame = frame();
      for (const canvas of document.querySelectorAll('canvas[data-view]')) {
        drawView(
          canvas.getContext('2d'),
          canvas.dataset.view,
          currentPilot.spec,
          directionSelect.value,
          currentAnimation.id,
          currentFrame,
        );
      }
      const source = renderSpritePixels(
        currentPilot.spec,
        directionSelect.value,
        currentAnimation.id,
        currentFrame,
        { shadow: false },
      );
      const lookup = buildShadeMaterialLookup(currentPilot.spec);
      const protectedMask = protectedShadeMask(source);
      const form = shadePixels(source, lookup, { protectedMask });
      const control = shadePixels(source, lookup, { protectedMask, silhouetteOnly: true });
      document.querySelector('#changed').textContent = String(form.filter((color, index) => color !== source[index]).length);
      document.querySelector('#protected').textContent = String(protectedMask.reduce((count, value, index) => count + (value && source[index] ? 1 : 0), 0));
      document.querySelector('#materials').textContent = String(lookup.size);
      document.querySelector('#control-diff').textContent = String(form.filter((color, index) => color !== control[index]).length);
      document.querySelector('#readout').textContent = currentPilot.label + ' · ' + directionSelect.value.toUpperCase() + ' · ' + currentAnimation.name + ' · frame ' + (currentFrame + 1) + '/' + currentAnimation.frames;
      stage.classList.toggle('parchment', backgroundSelect.value === 'parchment');
    }

    function advance() {
      let nextFrame = frame() + 1;
      if (nextFrame < animation().frames) {
        frameInput.value = String(nextFrame);
        render();
        return;
      }
      frameInput.value = '0';
      const animationIndex = E.ANIMS.findIndex((entry) => entry.id === animationSelect.value);
      if (animationIndex + 1 < E.ANIMS.length) {
        animationSelect.value = E.ANIMS[animationIndex + 1].id;
        render();
        return;
      }
      animationSelect.value = E.ANIMS[0].id;
      const directionIndex = E.DIRS.indexOf(directionSelect.value);
      directionSelect.value = E.DIRS[(directionIndex + 1) % E.DIRS.length];
      render();
    }

    function toggleCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
        cycleButton.classList.remove('active');
        cycleButton.textContent = 'Cycle all';
      } else {
        cycleTimer = setInterval(advance, 650);
        cycleButton.classList.add('active');
        cycleButton.textContent = 'Pause cycle';
      }
    }

    for (const control of [pilotSelect, directionSelect, animationSelect, frameInput, backgroundSelect]) {
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
  console.error(`Shade review failed with ${report.failures.length} error${report.failures.length === 1 ? '' : 's'}:`);
  for (const failure of report.failures.slice(0, 50)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Shade review generated.');
console.log(`- Pilots: ${report.pilots.length}`);
console.log(`- Source frames: ${report.totals.sourceFrames}`);
console.log(`- Form mode cases: ${report.totals.formModeCases}`);
console.log(`- Changed pixels: ${report.totals.changedPixels}`);
console.log(`- Protected source pixels: ${report.totals.protectedSourcePixels}`);
console.log(`- Material/control differences: ${report.totals.materialControlDifferences}`);
console.log(`- Deterministic cases: ${report.totals.deterministicCases}`);
console.log(`- Review: ${path.join(output, 'index.html')}`);
