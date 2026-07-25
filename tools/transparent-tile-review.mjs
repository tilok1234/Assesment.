import * as engine from '../sprite-engine.js';

const CARDINAL = [[0, -1], [-1, 0], [1, 0], [0, 1]];
const REVIEW_DIRECTIONS = engine.DIRS;
const REGION = { minX: 6, maxX: 17, minY: 11, maxY: 19 };
const MIDBODY = { minY: 14, maxY: 17 };
const EXAMPLE_LIMIT = 24;

const BASE_SPEC = {
  kind: 'player',
  species: 'human',
  bodyBuild: 'classic',
  skin: 'peach',
  hairStyle: 'short',
  hairColor: 'brown',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'tunic',
  outfitTier: 'tier1',
  outfitColor: 'charcoal',
  weapon: 'none',
  weaponTier: 'tier1',
  shield: 'none',
  shieldTier: 'tier1',
  palette: null,
};

class PixelContext {
  constructor() {
    this.fillStyle = '#000000';
    this.pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  }

  clearRect() {
    this.pixels.fill(null);
  }

  fillRect(x, y, width, height) {
    for (let py = Math.floor(y); py < y + height; py++) {
      for (let px = Math.floor(x); px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
          this.pixels[(py * engine.SIZE) + px] = this.fillStyle;
        }
      }
    }
  }
}

function render(spec, direction, animation, frame, outlineMode = engine.OUTLINE_MODE_NONE, layer = null) {
  const context = new PixelContext();
  if (outlineMode === engine.OUTLINE_MODE_NONE) {
    engine.drawSprite(context, spec, direction, animation, frame, {
      shadow: false,
      ...(layer ? { layer } : {}),
    });
  } else {
    engine.drawOutlinedSprite(context, spec, direction, animation, frame, {
      shadow: false,
      outlineMode,
    });
  }
  return context.pixels;
}

function mergePixels(...layers) {
  const pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  for (const layer of layers) {
    for (let index = 0; index < pixels.length; index++) {
      if (layer[index]) pixels[index] = layer[index];
    }
  }
  return pixels;
}

function enclosedComponents(pixels) {
  const seen = new Uint8Array(pixels.length);
  const components = [];
  for (let start = 0; start < pixels.length; start++) {
    if (pixels[start] || seen[start]) continue;
    const pending = [start];
    const cells = [];
    let touchesEdge = false;
    seen[start] = 1;
    while (pending.length) {
      const index = pending.pop();
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      cells.push(index);
      if (x === 0 || y === 0 || x === engine.SIZE - 1 || y === engine.SIZE - 1) {
        touchesEdge = true;
      }
      for (const [dx, dy] of CARDINAL) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= engine.SIZE || ny >= engine.SIZE) continue;
        const next = (ny * engine.SIZE) + nx;
        if (!pixels[next] && !seen[next]) {
          seen[next] = 1;
          pending.push(next);
        }
      }
    }
    if (!touchesEdge) components.push(cells.sort((left, right) => left - right));
  }
  return components;
}

function bridgeGroupsFor(pixels) {
  const marked = new Uint8Array(pixels.length);
  const dense = new Uint8Array(pixels.length);

  for (let y = REGION.minY; y <= REGION.maxY; y++) {
    for (let x = REGION.minX; x <= REGION.maxX; x++) {
      const index = (y * engine.SIZE) + x;
      if (pixels[index]) continue;
      const north = !!pixels[index - engine.SIZE];
      const south = !!pixels[index + engine.SIZE];
      const west = !!pixels[index - 1];
      const east = !!pixels[index + 1];
      const cardinalCount = Number(north) + Number(south) + Number(west) + Number(east);
      if (cardinalCount >= 3) dense[index] = 1;
      if (cardinalCount >= 3 || (west && east) || (north && south)) marked[index] = 1;
    }
  }

  const seen = new Uint8Array(marked.length);
  const groups = [];
  for (let start = 0; start < marked.length; start++) {
    if (!marked[start] || seen[start]) continue;
    const pending = [start];
    const cells = [];
    seen[start] = 1;

    while (pending.length) {
      const index = pending.pop();
      cells.push(index);
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (const [dx, dy] of CARDINAL) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= engine.SIZE || ny >= engine.SIZE) continue;
        const next = (ny * engine.SIZE) + nx;
        if (marked[next] && !seen[next]) {
          seen[next] = 1;
          pending.push(next);
        }
      }
    }

    const xs = cells.map((index) => index % engine.SIZE);
    const ys = cells.map((index) => Math.floor(index / engine.SIZE));
    const width = Math.max(...xs) - Math.min(...xs) + 1;
    const height = Math.max(...ys) - Math.min(...ys) + 1;
    const hasDenseCell = cells.some((index) => dense[index]);
    const isThinRun = (width === 1 && height >= 2) || (height === 1 && width >= 2);
    if (hasDenseCell || isThinRun) groups.push(cells.sort((left, right) => left - right));
  }

  return groups;
}

function coordinatesFor(cells) {
  return cells.map((index) => [index % engine.SIZE, Math.floor(index / engine.SIZE)]);
}

function isIntentionalLegSeparation(coordinates) {
  return coordinates.every(([x, y]) => y >= 18 && x >= 7 && x <= 16);
}

function isMidbodyTunnel(coordinates) {
  const ys = coordinates.map(([, y]) => y);
  return Math.min(...ys) >= MIDBODY.minY && Math.max(...ys) <= MIDBODY.maxY;
}

function modePersistence(cells, pixelsByMode) {
  return Object.fromEntries(Object.entries(pixelsByMode).map(([mode, pixels]) => [
    mode,
    cells.filter((index) => !pixels[index]).length,
  ]));
}

const report = {
  auditedFrames: 0,
  bridgeGroups: 0,
  intentionalLegGroups: 0,
  midbodyGroups: 0,
  allModeMidbodyGroups: 0,
  auditedBoneShieldFrames: 0,
  boneShieldInteriorComponents: 0,
  byBuild: {},
  byDirection: {},
  byAnimation: {},
  examples: [],
};

function increment(record, key) {
  record[key] = (record[key] || 0) + 1;
}

for (const bodyBuild of engine.BODY_BUILDS) {
  for (const outfit of engine.OUTFITS) {
    for (const outfitTier of engine.OUTFIT_TIERS) {
      const spec = {
        ...BASE_SPEC,
        bodyBuild: bodyBuild.id,
        outfit: outfit.id,
        outfitTier: outfitTier.id,
      };
      for (const direction of REVIEW_DIRECTIONS) {
        for (const animation of engine.ANIMS) {
          for (let frame = 0; frame < animation.frames; frame++) {
            report.auditedFrames++;
            const bodyPixels = render(
              spec,
              direction,
              animation.id,
              frame,
              engine.OUTLINE_MODE_NONE,
              'body',
            );
            const groups = bridgeGroupsFor(bodyPixels);
            report.bridgeGroups += groups.length;
            for (const cells of groups) {
              const coordinates = coordinatesFor(cells);
              if (isIntentionalLegSeparation(coordinates)) {
                report.intentionalLegGroups++;
                continue;
              }
              if (!isMidbodyTunnel(coordinates)) continue;

              const pixelsByMode = {
                none: render(spec, direction, animation.id, frame),
                'complete-b': render(
                  spec,
                  direction,
                  animation.id,
                  frame,
                  engine.OUTLINE_MODE_COMPLETE_B,
                ),
                'selective-c': render(
                  spec,
                  direction,
                  animation.id,
                  frame,
                  engine.OUTLINE_MODE_SELECTIVE_C,
                ),
              };
              const persistence = modePersistence(cells, pixelsByMode);
              report.midbodyGroups++;
              if (Object.values(persistence).every((count) => count > 0)) {
                report.allModeMidbodyGroups++;
              }
              increment(report.byBuild, bodyBuild.id);
              increment(report.byDirection, direction);
              increment(report.byAnimation, animation.id);
              if (report.examples.length < EXAMPLE_LIMIT) {
                report.examples.push({
                  bodyBuild: bodyBuild.id,
                  outfit: outfit.id,
                  outfitTier: outfitTier.id,
                  direction,
                  animation: animation.id,
                  frame: frame + 1,
                  coordinates,
                  transparentCellsByMode: persistence,
                });
              }
            }
          }
        }
      }
    }
  }
}

for (const bodyBuild of engine.BODY_BUILDS) {
  for (const shieldTier of engine.SHIELD_TIERS) {
    const spec = {
      ...BASE_SPEC,
      bodyBuild: bodyBuild.id,
      shield: 'bone',
      shieldTier: shieldTier.id,
    };
    for (const direction of REVIEW_DIRECTIONS) {
      for (const animation of engine.ANIMS) {
        for (let frame = 0; frame < animation.frames; frame++) {
          report.auditedBoneShieldFrames++;
          const shieldPixels = mergePixels(
            render(spec, direction, animation.id, frame, engine.OUTLINE_MODE_NONE, 'shield-back'),
            render(spec, direction, animation.id, frame, engine.OUTLINE_MODE_NONE, 'shield-front'),
          );
          const components = enclosedComponents(shieldPixels);
          report.boneShieldInteriorComponents += components.length;
          if (components.length && report.examples.length < EXAMPLE_LIMIT) {
            report.examples.push({
              owner: 'shield',
              shield: 'bone',
              shieldTier: shieldTier.id,
              bodyBuild: bodyBuild.id,
              direction,
              animation: animation.id,
              frame: frame + 1,
              enclosedComponents: components.map(coordinatesFor),
            });
          }
        }
      }
    }
  }
}

if (report.intentionalLegGroups === 0) {
  console.error('Transparent-tile review is invalid: the intentional leg-separation control was not observed.');
  process.exit(1);
}

if (report.allModeMidbodyGroups > 0 || report.boneShieldInteriorComponents > 0) {
  console.error(
    `Transparent-tile review failed: ${report.allModeMidbodyGroups} persistent mid-body tunnel groups `
    + `remain visible in None, Complete B, and Selective C across ${report.auditedFrames} body frames; `
    + `${report.boneShieldInteriorComponents} enclosed Bone-shield components remain across `
    + `${report.auditedBoneShieldFrames} directional shield frames.`,
  );
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log(
  `Transparent-tile review passed: ${report.auditedFrames} body frames, `
  + `${report.intentionalLegGroups} intentional leg-separation controls preserved, `
  + `${report.auditedBoneShieldFrames} Bone-shield frames with no enclosed checkerboard pockets, `
  + `0 persistent three-mode mid-body tunnels; ${report.midbodyGroups} `
  + 'single-mode or outline-resolved notches remain advisory.',
);
