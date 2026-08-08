// Stable frame, direction, animation, and sheet-layout contract.

import { PLAYER_CAST_ANIMATION } from '../cast-animation.js';
import { PLAYER_DEATH_ANIMATION } from '../death-animation.js';

export const SIZE = 24;
export const DIRS = ['down', 'left', 'right', 'up'];
export const DIR_LABELS = { down: 'Down', left: 'Left', right: 'Right', up: 'Up' };
export const ANIMS = [
  { id: 'idle',   name: 'Idle',   frames: 2, ms: 420 },
  { id: 'walk',   name: 'Walk',   frames: 4, ms: 150 },
  { id: 'attack', name: 'Attack', frames: 4, ms: 115 },
  PLAYER_CAST_ANIMATION,
  { id: 'hurt',   name: 'Hurt',   frames: 2, ms: 140 },
  PLAYER_DEATH_ANIMATION,
];
export const SHEET_COLS = ANIMS.reduce((a, x) => a + x.frames, 0); // 20
