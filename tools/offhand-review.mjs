import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import {
  capturePixels,
  renderLayerPixels,
  renderSpritePixels,
} from '../engine/pixel-buffer.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(
  root,
  outputFlag >= 0 ? process.argv[outputFlag + 1] : 'offhand-review',
);
await mkdir(output, { recursive: true });

const BASE_PLAYER = Object.freeze({
  kind: 'player',
  species: 'human',
  bodyBuild: 'classic',
  skin: 'peach',
  hairStyle: 'ponytail',
  hairColor: 'brown',
  expression: 'determined',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'ranger',
  outfitTier: 'tier2',
  outfitColor: 'forest',
  weapon: 'shortsword',
  weaponTier: 'tier2',
  shield: 'none',
  shieldTier: 'tier1',
  palette: null,
});

const PILOTS = Object.freeze([
  Object.freeze({
    id: 'ranger',
    label: 'Ranger · sword',
    spec: Object.freeze({ ...BASE_PLAYER }),
  }),
  Object.freeze({
    id: 'traveler',
    label: 'Traveler · free hand',
    spec: Object.freeze({
      ...BASE_PLAYER,
      bodyBuild: 'lean',
      hairStyle: 'short',
      expression: 'neutral',
      outfit: 'tunic',
      outfitTier: 'tier1',
      outfitColor: 'earth',
      weapon: 'none',
      weaponTier: 'tier1',
    }),
  }),
  Object.freeze({
    id: 'warden',
    label: 'Warden · spear',
    spec: Object.freeze({
      ...BASE_PLAYER,
      bodyBuild: 'sturdy',
      hairStyle: 'bald',
      expression: 'angry',
      headgear: 'hood',
      outfit: 'leather',
      outfitTier: 'tier3',
      outfitColor: 'ember',
      weapon: 'spear',
      weaponTier: 'tier3',
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
  format: '8-bit-sprite-assembler-offhand-integration-review',
  version: 1,
  generatedAt: new Date().toISOString(),
  scope: {
    item: 'lantern',
    publicSchemaChanged: true,
    effects: 'off',
    backgrounds: ['#e8ddc4', '#191b22'],
    visualPilots: PILOTS.map((pilot) => pilot.id),
  },
  totals: {
    sourceFrames: 0,
    assembledTreatmentCases: 0,
    deterministicCases: 0,
    recompositionCases: 0,
    attachmentCases: 0,
    shieldPrecedenceCases: 0,
    absentFieldParityCases: 0,
    outOfBoundsDraws: 0,
  },
  directions: {},
  failures: [],
};

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
    report.directions[direction] ||= {
      frames: 0,
      minimumVisibleOffhandPixels: Number.POSITIVE_INFINITY,
      maximumVisibleOffhandPixels: 0,
    };
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const prefix = `${pilot.id} ${direction} ${animation.id}/${frame + 1}`;
        const spec = { ...pilot.spec, offhand: 'lantern' };
        const withoutPilot = renderSpritePixels(
          pilot.spec,
          direction,
          animation.id,
          frame,
          { shadow: false },
        );
        const explicitNone = renderSpritePixels(
          { ...pilot.spec, offhand: 'none' },
          direction,
          animation.id,
          frame,
          { shadow: false },
        );
        const unknownPilot = renderSpritePixels(
          { ...pilot.spec, offhand: 'unknown' },
          direction,
          animation.id,
          frame,
          { shadow: false },
        );
        if (!arraysEqual(withoutPilot, explicitNone) || !arraysEqual(withoutPilot, unknownPilot)) {
          report.failures.push(`${prefix}: absent or unknown public offhand changed ordinary output`);
        } else {
          report.totals.absentFieldParityCases++;
        }

        const outOfBounds = [];
        const complete = renderSpritePixels(spec, direction, animation.id, frame, {
          shadow: false,
          onOutOfBounds: (draw) => outOfBounds.push(draw),
        });
        report.totals.outOfBoundsDraws += outOfBounds.length;
        if (outOfBounds.length) {
          report.failures.push(`${prefix}: ${outOfBounds.length} out-of-bounds draw(s)`);
        }

        const layers = layerOrder.map((layer) => (
          renderLayerPixels(spec, direction, animation.id, frame, layer)
        ));
        const recomposed = mergeLayers(layers);
        if (!arraysEqual(complete, recomposed)) {
          report.failures.push(`${prefix}: equipment/body layers did not recompose exactly`);
        } else {
          report.totals.recompositionCases++;
        }

        const offhandPixels = mergeLayers([layers[2], layers[5]]);
        const bodyPixels = layers[3];
        if (!touches(offhandPixels, bodyPixels)) {
          report.failures.push(`${prefix}: lantern lost contact with the animated body`);
        } else {
          report.totals.attachmentCases++;
        }

        const visibleOffhandPixels = offhandPixels.reduce((
          count,
          color,
          index,
        ) => count + (color && complete[index] === color ? 1 : 0), 0);
        if (visibleOffhandPixels < 10) {
          report.failures.push(`${prefix}: only ${visibleOffhandPixels} lantern-owned pixels remain visible`);
        }
        report.directions[direction].minimumVisibleOffhandPixels = Math.min(
          report.directions[direction].minimumVisibleOffhandPixels,
          visibleOffhandPixels,
        );
        report.directions[direction].maximumVisibleOffhandPixels = Math.max(
          report.directions[direction].maximumVisibleOffhandPixels,
          visibleOffhandPixels,
        );
        report.directions[direction].frames++;

        const shieldSpec = {
          ...pilot.spec,
          shield: 'round',
          shieldTier: 'tier2',
        };
        const shieldOnly = renderSpritePixels(
          shieldSpec,
          direction,
          animation.id,
          frame,
          { shadow: false },
        );
        const shieldWithPilot = renderSpritePixels(
          { ...shieldSpec, offhand: 'lantern' },
          direction,
          animation.id,
          frame,
          { shadow: false },
        );
        if (!arraysEqual(shieldOnly, shieldWithPilot)) {
          report.failures.push(`${prefix}: Lantern overrode an equipped shield`);
        } else {
          report.totals.shieldPrecedenceCases++;
        }

        for (const options of [
          {},
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
          const first = renderAssembled(spec, direction, animation.id, frame, options);
          const repeat = renderAssembled(spec, direction, animation.id, frame, options);
          if (!arraysEqual(first, repeat)) {
            report.failures.push(`${prefix}: nondeterministic assembled treatment`);
          } else {
            report.totals.deterministicCases++;
          }
          report.totals.assembledTreatmentCases++;
        }

        report.totals.sourceFrames++;
      }
    }
  }
}

for (const [direction, summary] of Object.entries(report.directions)) {
  if (!Number.isFinite(summary.minimumVisibleOffhandPixels)) {
    report.failures.push(`${direction}: no lantern visibility measurement`);
    summary.minimumVisibleOffhandPixels = 0;
  }
}

const pilotsJson = JSON.stringify(PILOTS).replaceAll('<', '\\u003c');
const reportJson = JSON.stringify(report).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Phase 5 Lantern Integration Review</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #111318; color: #f3f4f6; }
    * { box-sizing: border-box; }
    body { margin: 0; min-width: 920px; background: #111318; }
    header { position: sticky; top: 0; z-index: 5; padding: 16px 20px; background: rgba(17,19,24,.96); border-bottom: 1px solid #303541; }
    h1 { margin: 0 0 4px; font-size: 20px; }
    .subtitle { color: #aeb6c5; font-size: 13px; }
    .controls { display: grid; grid-template-columns: 1.5fr repeat(4, minmax(120px, 1fr)) 120px; gap: 10px; margin-top: 14px; align-items: end; }
    label { display: grid; gap: 5px; color: #aeb6c5; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    select, input, button { min-height: 34px; border: 1px solid #3b4250; border-radius: 6px; background: #1b1f27; color: #f3f4f6; padding: 6px 9px; }
    button { cursor: pointer; font-weight: 700; }
    button.active { background: #5b65d9; border-color: #7780ee; }
    main { padding: 18px 20px 32px; }
    .notice { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 10px 12px; margin-bottom: 14px; border: 1px solid #3b4250; border-radius: 8px; background: #181c23; color: #cbd2df; font-size: 13px; }
    #review-stage { display: grid; grid-template-columns: repeat(4, minmax(190px, 1fr)); gap: 12px; padding: 16px; border-radius: 10px; background: #e8ddc4; }
    #review-stage.dark { background: #191b22; }
    .card { min-width: 0; padding: 12px; border: 1px solid rgba(127,138,160,.42); border-radius: 8px; background: rgba(17,19,24,.86); }
    .card h2 { margin: 0; font-size: 13px; }
    .card p { min-height: 32px; margin: 5px 0 10px; color: #aeb6c5; font-size: 11px; line-height: 1.35; }
    .zoom-wrap { display: grid; place-items: center; min-height: 252px; overflow: hidden; border-radius: 5px; background: transparent; }
    canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
    canvas.zoom { width: 240px; height: 240px; }
    .native-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: #aeb6c5; font-size: 11px; }
    canvas.native { width: 24px; height: 24px; outline: 1px solid rgba(255,255,255,.18); }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 14px; }
    .metric { padding: 10px; background: #181c23; border: 1px solid #303541; border-radius: 7px; }
    .metric strong { display: block; font-size: 17px; }
    .metric span { color: #9da6b7; font-size: 11px; }
    .scope { margin-top: 12px; color: #9da6b7; font-size: 12px; }
  </style>
</head>
<body>
  <header>
    <h1>Phase 5 · Lantern Off-Hand Integration</h1>
    <div class="subtitle">Approved art in the public off-hand contract · Effects Off · independent back/front export layers</div>
    <div class="controls">
      <label>Bearer<select id="pilot"></select></label>
      <label>Direction<select id="direction"></select></label>
      <label>Animation<select id="animation"></select></label>
      <label>Frame<input id="frame" type="range" min="0" value="0"></label>
      <label>Background<select id="background"><option value="parchment" selected>Parchment #e8ddc4</option><option value="dark">Dark #191b22</option></select></label>
      <button id="cycle" type="button">Cycle all</button>
    </div>
  </header>
  <main>
    <div class="notice"><span id="readout"></span><span>Verify the approved item survives public state, outline, shade, and layer integration unchanged.</span></div>
    <section id="review-stage">
      <article class="card"><h2>No off-hand</h2><p>Pixel-exact ordinary renderer control.</p><div class="zoom-wrap"><canvas class="zoom" data-view="control" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="control" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Lantern · source</h2><p>Untreated approved art and occlusion.</p><div class="zoom-wrap"><canvas class="zoom" data-view="source" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="source" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Form · Complete B</h2><p>Approved Form shade with strong outline.</p><div class="zoom-wrap"><canvas class="zoom" data-view="complete-b" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="complete-b" width="24" height="24"></canvas>native 24×24</div></article>
      <article class="card"><h2>Form · Selective C</h2><p>Approved Form shade with light outline.</p><div class="zoom-wrap"><canvas class="zoom" data-view="selective-c" width="24" height="24"></canvas></div><div class="native-row"><canvas class="native" data-view="selective-c" width="24" height="24"></canvas>native 24×24</div></article>
    </section>
    <section class="metrics">
      <div class="metric"><strong>${report.totals.sourceFrames}</strong><span>reviewed source frames</span></div>
      <div class="metric"><strong>${report.totals.recompositionCases}</strong><span>exact recompositions</span></div>
      <div class="metric"><strong>${report.totals.attachmentCases}</strong><span>body attachments</span></div>
      <div class="metric"><strong>${report.failures.length}</strong><span>automated failures</span></div>
    </section>
    <div class="scope">Scope: 3 representative bearers × 4 directions × idle/walk/attack/hurt × every frame. Parchment and dark are review-only backgrounds. The lantern has no external glow or combat effect.</div>
  </main>
  <script type="module">
    import * as E from '../sprite-engine.js';
    const pilots = ${pilotsJson};
    const report = ${reportJson};
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

    function drawView(context, view, spec, direction, animationId, frameIndex) {
      context.clearRect(0, 0, 24, 24);
      context.imageSmoothingEnabled = false;
      const candidate = view === 'control' ? spec : { ...spec, offhand: 'lantern' };
      const options = { shadow: true };
      if (view === 'complete-b') {
        options.shadeMode = E.SHADE_MODE_FORM;
        options.outlineMode = E.OUTLINE_MODE_COMPLETE_B;
      }
      if (view === 'selective-c') {
        options.shadeMode = E.SHADE_MODE_FORM;
        options.outlineMode = E.OUTLINE_MODE_SELECTIVE_C;
      }
      E.drawAssembledSprite(context, candidate, direction, animationId, frameIndex, options);
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
      const directionMetrics = report.directions[directionSelect.value];
      document.querySelector('#readout').textContent =
        currentPilot.label + ' · ' + directionSelect.value.toUpperCase() +
        ' · ' + currentAnimation.name + ' · frame ' + (currentFrame + 1) +
        '/' + currentAnimation.frames + ' · visible lantern pixels ' +
        directionMetrics.minimumVisibleOffhandPixels + '–' +
        directionMetrics.maximumVisibleOffhandPixels;
      stage.classList.toggle('dark', backgroundSelect.value === 'dark');
    }

    function advance() {
      const nextFrame = frame() + 1;
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
  console.error(`Lantern integration review failed with ${report.failures.length} error${report.failures.length === 1 ? '' : 's'}:`);
  for (const failure of report.failures.slice(0, 80)) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Lantern off-hand integration review generated.');
console.log(`- Source frames: ${report.totals.sourceFrames}`);
console.log(`- Assembled treatment cases: ${report.totals.assembledTreatmentCases}`);
console.log(`- Exact recompositions: ${report.totals.recompositionCases}`);
console.log(`- Attachment cases: ${report.totals.attachmentCases}`);
console.log(`- Shield precedence cases: ${report.totals.shieldPrecedenceCases}`);
console.log(`- Absent-field parity cases: ${report.totals.absentFieldParityCases}`);
console.log(`- Out-of-bounds draws: ${report.totals.outOfBoundsDraws}`);
console.log(`- Review: ${path.join(output, 'index.html')}`);
