import { SIZE } from './catalogs.js';
import {
  ENEMY_EXPANSION_REGISTRY,
  renderEnemyExpansionFrame,
} from './enemy-expansion-public.js';
import { drawSprite as drawLegacySprite } from './renderer.js';

const publicExpansionFamilyIds = new Set(
  ENEMY_EXPANSION_REGISTRY.publicFamilies.map((family) => family.id),
);

export function isPublicEnemyExpansionSpec(spec) {
  return spec?.kind === 'enemy' && publicExpansionFamilyIds.has(spec.family);
}

function drawExpansionShadow(context) {
  context.fillStyle = 'rgba(26,28,44,0.15)';
  context.fillRect(8, 22, 8, 1);
  context.fillRect(9, 23, 6, 1);
}

function bridgedExpansionContext(context, spec, onOutOfBounds) {
  const bridge = {
    clearRect() {
      // The public dispatcher owns clear/compose semantics. The reviewed
      // expansion renderer still clears when called directly for gate checks.
    },
    get fillStyle() { return context.fillStyle; },
    set fillStyle(value) { context.fillStyle = value; },
    fillRect(x, y, width, height) {
      if (typeof onOutOfBounds === 'function') {
        for (let py = Math.floor(y); py < y + height; py++) {
          for (let px = Math.floor(x); px < x + width; px++) {
            if (px < 0 || py < 0 || px >= SIZE || py >= SIZE) {
              onOutOfBounds({
                x: px,
                y: py,
                operation: 'fillRect',
                color: context.fillStyle,
                family: spec.family,
                variant: spec.variant,
              });
            }
          }
        }
      }
      context.fillRect(x, y, width, height);
    },
  };
  if (typeof onOutOfBounds === 'function') bridge.onOutOfBounds = onOutOfBounds;
  return bridge;
}

export function drawPublicSprite(context, spec, direction, animationId, frame, options = {}) {
  if (!isPublicEnemyExpansionSpec(spec)) {
    return drawLegacySprite(context, spec, direction, animationId, frame, options);
  }

  const renderLayer = typeof options.layer === 'string' ? options.layer : 'complete';
  if (options.clear !== false) context.clearRect(0, 0, SIZE, SIZE);
  if (renderLayer !== 'complete' && renderLayer !== 'body') return undefined;
  if (options.shadow !== false) drawExpansionShadow(context);

  return renderEnemyExpansionFrame(
    ENEMY_EXPANSION_REGISTRY,
    spec,
    direction,
    animationId,
    frame,
    bridgedExpansionContext(context, spec, options.onOutOfBounds),
  );
}
