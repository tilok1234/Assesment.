import {
  OUTLINE_COLOR,
  OUTLINE_MODE_COMPLETE_B,
  OUTLINE_MODE_SELECTIVE_C,
  outlineMaskForPixels,
} from '../engine/outline-renderer.js';
import {
  buildShadeMaterialLookup,
  protectedShadeMask,
  shadePixels,
} from '../engine/shade-renderer.js';

function applyOutline(pixels, mode) {
  const mask = outlineMaskForPixels(pixels, mode);
  return pixels.map((pixel, index) => pixel || (mask[index] ? OUTLINE_COLOR : null));
}

function mergeShade(source, outlined, shaded) {
  return outlined.map((color, index) => (
    source[index] && color === source[index] ? shaded[index] : color
  ));
}

export function buildEnemyExpansionCandidatePresentation(pixels, rendererData) {
  const actor = rendererData?.actor;
  if (!actor || typeof actor !== 'object' || Array.isArray(actor)) {
    throw new TypeError('Candidate presentation needs actor renderer data.');
  }
  const raw = [...pixels];
  const complete = applyOutline(raw, OUTLINE_MODE_COMPLETE_B);
  const selective = applyOutline(raw, OUTLINE_MODE_SELECTIVE_C);
  const materialLookup = buildShadeMaterialLookup({ kind: 'player', ...actor });
  const protectedMask = protectedShadeMask(raw);
  const form = shadePixels(raw, materialLookup, { protectedMask });
  return Object.freeze({
    raw: Object.freeze(raw),
    complete: Object.freeze(complete),
    selective: Object.freeze(selective),
    form: Object.freeze(form),
    formComplete: Object.freeze(mergeShade(raw, complete, form)),
    formSelective: Object.freeze(mergeShade(raw, selective, form)),
    protectedMask,
  });
}
