// Transparent combat overlays aligned to the standard 24x24 animation grid.

function directionalPlot(g, direction) {
  return (forward, lateral, color) => {
    if (direction === 'right') g.set(12 + forward, 12 + lateral, color);
    else if (direction === 'down') g.set(12 + lateral, 12 + forward, color);
    else if (direction === 'left') g.set(12 - forward, 12 - lateral, color);
    else g.set(12 - lateral, 12 - forward, color);
  };
}

function drawTrail(g, d, frame, effect) {
  const [light, base, dark] = effect.colors;
  const P = directionalPlot(g, d);
  const style = effect.style;

  if (style === 'thrust') {
    const reach = [3, 6, 9, 7][frame];
    const start = Math.max(1, reach - (frame === 2 ? 7 : 4));
    for (let n = start; n <= reach; n++) P(n, 0, n === reach ? light : base);
    P(reach - 1, -1, light); P(reach - 1, 1, dark);
    if (frame === 2) { P(reach, -2, light); P(reach, 2, light); }
    return;
  }

  if (style === 'block') {
    const reach = [2, 4, 5, 4][frame];
    const radius = [2, 4, 5, 3][frame];
    for (let lateral = -radius; lateral <= radius; lateral++) {
      const edge = Math.abs(lateral) === radius;
      P(reach + Math.max(0, radius - Math.abs(lateral)) / 3, lateral, edge ? light : base);
    }
    if (frame >= 1) { P(reach + 2, -radius + 1, light); P(reach + 2, radius - 1, light); }
    if (frame === 2) { P(reach + 4, -6, light); P(reach + 5, 5, base); }
    return;
  }

  if (style === 'crush') {
    const handle = [2, 4, 7, 8][frame];
    for (let n = 1; n <= handle; n++) P(n, -4 + Math.floor(n / 3), n === handle ? light : base);
    P(handle, -1, light); P(handle, 0, base); P(handle, 1, dark);
    if (frame >= 2) {
      for (const lateral of [-5, -3, 3, 5]) P(8, lateral, frame === 2 ? light : dark);
      P(6, -6, base); P(6, 6, base);
    }
    return;
  }

  const arcs = [
    [[1, -5], [2, -4], [3, -3]],
    [[1, -7], [2, -6], [3, -5], [4, -4], [5, -3], [6, -2], [7, -1]],
    [[3, -4], [4, -3], [5, -2], [6, -1], [7, 0], [8, 1], [8, 2], [7, 3]],
    [[6, 1], [8, 3], [7, 5]],
  ];
  const thick = style === 'cleave';
  for (const [forward, lateral] of arcs[frame]) {
    P(forward, lateral, light);
    P(forward - 1, lateral, base);
    if (thick) { P(forward - 1, lateral + 1, base); P(forward - 2, lateral + 1, dark); }
  }
  if (style === 'cleave' && frame === 2) { P(8, 4, light); P(7, 6, base); P(5, 7, dark); }
}

function drawProjectile(g, d, frame, effect) {
  const [light, base, dark] = effect.colors;
  const P = directionalPlot(g, d);
  const position = [1, 4, 7, 9][frame];
  const style = effect.style;

  if (style === 'arrow' || style === 'bolt') {
    const length = style === 'arrow' ? 4 : 3;
    for (let n = 0; n < length; n++) P(position - n, 0, n === 0 ? light : base);
    P(position - length + 1, -1, dark); P(position - length + 1, 1, dark);
    if (style === 'arrow') { P(position, -1, light); P(position, 1, light); }
    else { P(position - 1, -1, light); P(position - 1, 1, dark); }
    return;
  }

  if (style === 'ice') {
    P(position + 1, 0, light); P(position, -1, light); P(position, 0, base); P(position, 1, light);
    P(position - 1, -1, base); P(position - 1, 0, dark); P(position - 1, 1, base); P(position - 2, 0, dark);
    return;
  }

  const radius = style === 'poison' ? (frame % 2) + 1 : frame === 0 ? 1 : 2;
  P(position, 0, light);
  P(position - 1, 0, base); P(position + 1, 0, base);
  P(position, -1, base); P(position, 1, base);
  if (radius > 1) {
    P(position - 1, -1, dark); P(position - 1, 1, dark);
    P(position + 1, -1, light); P(position + 1, 1, light);
  }
  P(position - 3, frame % 2 ? -1 : 1, dark);
  if (style === 'fireball') { P(position - 4, -1, base); P(position - 5, 1, dark); }
  if (style === 'holy') { P(position, -3, light); P(position, 3, light); P(position + 1, 0, light); }
  if (style === 'shadow') { P(position - 2, -2, dark); P(position - 4, 2, dark); }
  if (style === 'poison') { P(position - 2, 2, light); P(position + 1, 2, dark); }
}

function impactCenter(d) {
  if (d === 'right') return [16, 12];
  if (d === 'down') return [12, 16];
  if (d === 'left') return [8, 12];
  return [12, 8];
}

function drawImpact(g, d, frame, effect) {
  const [light, base, dark] = effect.colors;
  const [cx, cy] = impactCenter(d);
  const S = (x, y, color) => g.set(cx + x, cy + y, color);
  const style = effect.style;

  if (frame === 0) {
    S(0, 0, light); S(-1, 0, base); S(1, 0, base);
    if (style === 'blood') S(0, 1, dark);
    return;
  }

  if (style === 'blood') {
    const drops = frame === 1
      ? [[0, 0], [-2, -1], [2, -2], [1, 2]]
      : frame === 2
        ? [[-4, -2], [-2, 1], [0, -4], [3, -1], [4, 2], [1, 4]]
        : [[-3, 3], [0, 5], [4, 4], [5, 1]];
    for (const [x, y] of drops) { S(x, y, light); S(x, y + 1, dark); }
    return;
  }

  if (style === 'explosion') {
    const radius = frame === 1 ? 2 : frame === 2 ? 4 : 3;
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (Math.abs(x) + Math.abs(y) > radius + 1) continue;
        S(x, y, Math.abs(x) + Math.abs(y) < radius ? light : base);
      }
    }
    if (frame === 3) { S(-5, -3, dark); S(5, -4, dark); S(-4, 4, dark); S(4, 5, dark); }
    return;
  }

  if (style === 'dust') {
    const spread = frame + 1;
    for (const [x, y] of [[-spread, 1], [spread, 0], [-spread - 1, 2], [spread + 1, 2], [0, -spread]]) {
      S(x, y, base); S(x + 1, y, light); S(x, y + 1, dark);
    }
    return;
  }

  const radius = frame === 1 ? 2 : frame === 2 ? 5 : 6;
  const points = [[0, -radius], [radius, 0], [0, radius], [-radius, 0], [-radius + 2, -radius + 2], [radius - 2, -radius + 2], [-radius + 2, radius - 2], [radius - 2, radius - 2]];
  for (const [x, y] of points) { S(x, y, light); if (frame < 3) S(Math.sign(x) * Math.max(0, Math.abs(x) - 1), Math.sign(y) * Math.max(0, Math.abs(y) - 1), base); }
  S(0, 0, dark);
  if (style === 'armor') { S(-2, 0, base); S(2, 0, base); S(0, -2, light); S(0, 2, light); }
  if (style === 'arcane') { S(-3, -1, base); S(3, 1, base); S(-1, 3, dark); S(1, -3, dark); }
  if (style === 'sparks' && frame === 3) { S(-6, 3, base); S(5, -5, light); S(3, 6, dark); }
}

function drawStatus(g, frame, effect) {
  const [light, base, dark] = effect.colors;
  const t = frame % 4;
  const style = effect.style;

  if (style === 'burning') {
    const flames = [[5, 21, 3], [8, 20, 5], [11, 21, 4], [14, 20, 6], [18, 21, 3]];
    for (const [x, y, height] of flames) {
      g.set(x, y, dark); g.set(x, y - 1, base); g.set(x, y - 2 - ((x + t) % Math.max(2, height - 1)), light);
      g.set(x + 1, y - 1, base);
    }
    return;
  }
  if (style === 'frozen') {
    const shards = [[6, 20], [18, 20], [5, 14], [19, 13], [8, 8], [16, 7]];
    for (const [index, [x, y]] of shards.entries()) {
      const lift = (index + t) % 2;
      g.set(x, y - lift, dark); g.set(x, y - 1 - lift, base); g.set(x, y - 2 - lift, light);
      g.set(x - 1, y - 1 - lift, base); g.set(x + 1, y - 1 - lift, base);
    }
    g.rect(8, 21, 9, 1, light);
    g.set(6 + (t * 3), 4 + (t % 2), light);
    return;
  }
  if (style === 'poisoned') {
    const bubbles = [[6, 18], [18, 16], [8, 10], [16, 7], [12, 4]];
    for (const [index, [x, y]] of bubbles.entries()) {
      const lift = (t + index) % 4;
      g.set(x, y - lift, base); g.set(x + 1, y - lift, light);
      if ((index + t) % 2 === 0) g.set(x, y - lift - 1, dark);
    }
    return;
  }
  if (style === 'stunned') {
    const stars = [[8 + t, 5], [13 + (t % 2), 3], [17 - t, 6]];
    for (const [x, y] of stars) { g.set(x, y, light); g.set(x - 1, y, base); g.set(x + 1, y, base); g.set(x, y - 1, light); g.set(x, y + 1, dark); }
    g.set(10, 7, dark); g.set(14, 7, dark);
    return;
  }
  if (style === 'cursed') {
    const runes = [[6, 7], [18, 8], [5, 16], [19, 17], [12, 3]];
    for (const [index, [x, y]] of runes.entries()) {
      const shift = ((index + t) % 3) - 1;
      g.set(x + shift, y, base); g.set(x + shift, y + 1, dark); g.set(x + shift + 1, y - 1, light);
    }
    g.set(8 + t, 21, dark); g.set(16 - t, 21, dark);
    return;
  }
  const crosses = [[6, 16], [18, 13], [9, 7], [15, 4]];
  for (const [index, [x, y]] of crosses.entries()) {
    const lift = (index + t) % 3;
    g.set(x, y - lift, light); g.set(x - 1, y - lift, base); g.set(x + 1, y - lift, base);
    g.set(x, y - lift - 1, base); g.set(x, y - lift + 1, dark);
  }
  g.set(5 + (t * 4), 20 - t, light);
}

export function drawCombatEffect(g, direction, frame, effect, animationId) {
  if (effect.style === 'burning' || effect.style === 'frozen' || effect.style === 'poisoned'
    || effect.style === 'stunned' || effect.style === 'cursed' || effect.style === 'healing') {
    drawStatus(g, frame, effect);
    return;
  }
  if (animationId !== 'attack') return;
  if (['slash', 'thrust', 'cleave', 'crush', 'block'].includes(effect.style)) drawTrail(g, direction, frame, effect);
  else if (['arrow', 'bolt', 'fireball', 'ice', 'poison', 'holy', 'shadow'].includes(effect.style)) drawProjectile(g, direction, frame, effect);
  else drawImpact(g, direction, frame, effect);
}
