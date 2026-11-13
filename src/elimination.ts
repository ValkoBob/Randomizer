/** Pure helpers for the elimination scenes (the tree, the shooting, the race, the hopak). */

export const ELIMINATION_INTRO_MS = 1400;
export const ELIMINATION_FINALE_MS = 1900;
export const ELIMINATION_BUDGET_MS = 11000 - ELIMINATION_INTRO_MS - ELIMINATION_FINALE_MS;

/** At most ~11 s including the entrance/finale; small groups finish sooner. */
export function eliminationStepMs(losers: number): number {
  if (losers <= 0) return 0;
  return Math.min(1600, ELIMINATION_BUDGET_MS / losers);
}

/** Stable pseudo-random number in [0, 1) for a key and a step: same inputs, same jitter on every render. */
export function seededUnit(key: string, step = 0): number {
  let h = 2166136261;
  for (const ch of `${key}#${step}`) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 16777619);
  }
  // mulberry32 finaliser
  h = Math.imul(h ^ (h >>> 15), h | 1);
  h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
  return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
}

/* ───────── Ялинка ───────── */

/** The tree drawing's viewBox; slots and the floor are given in % of it. */
export const TREE_VIEWBOX = { width: 300, height: 360 };
const TREE_TOP_Y = 64;
const TREE_BOTTOM_Y = 272;
export const TREE_FLOOR_Y = 352;

/** Half-width of the branches at height y (viewBox units), a bit inside the outline. */
function treeHalfWidth(y: number): number {
  return 18 + ((y - TREE_TOP_Y) / (TREE_BOTTOM_Y - TREE_TOP_Y)) * 104;
}

export type TreeSlot = { x: number; y: number };
export type TreeLayout = { slots: TreeSlot[]; size: number };

/** Split `n` into parts proportional to `weights`, at least 1 each (largest remainder). */
function apportion(n: number, weights: number[]): number[] {
  const rest = n - weights.length;
  const sum = weights.reduce((a, b) => a + b, 0);
  const exact = weights.map((w) => (rest * w) / sum);
  const counts = exact.map((e) => 1 + Math.floor(e));
  let left = n - counts.reduce((a, b) => a + b, 0);
  const byRemainder = exact.map((e, i) => [e - Math.floor(e), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of byRemainder) {
    if (left-- <= 0) break;
    counts[i]++;
  }
  return counts;
}

/**
 * Where to hang `n` ornaments: rows from the top of the tree down, wider rows get more.
 * x, y are the ornament centres and `size` its diameter, all in % of the tree's width/height.
 */
export function treeLayout(n: number): TreeLayout {
  if (n <= 0) return { slots: [], size: 0 };
  const rows = Math.max(1, Math.min(n, Math.round(Math.sqrt(2 * n))));
  const ys = Array.from({ length: rows }, (_, k) =>
    rows === 1 ? (TREE_TOP_Y + TREE_BOTTOM_Y) * 0.6 : TREE_TOP_Y + ((TREE_BOTTOM_Y - TREE_TOP_Y) * k) / (rows - 1),
  );
  const counts = apportion(n, ys.map(treeHalfWidth));

  const slots: TreeSlot[] = [];
  let minSpacing = Infinity;
  ys.forEach((y, row) => {
    const span = treeHalfWidth(y) * 1.7;
    const spacing = span / counts[row];
    // A lone ball has no neighbours in its row: it may stick out of the narrow top a little.
    minSpacing = Math.min(minSpacing, counts[row] === 1 ? span + 20 : spacing);
    // Every other row is nudged sideways so the balls don't line up in columns.
    const nudge = row % 2 ? spacing * 0.12 : -spacing * 0.12;
    for (let i = 0; i < counts[row]; i++) {
      const x = counts[row] === 1 ? TREE_VIEWBOX.width / 2 : TREE_VIEWBOX.width / 2 - span / 2 + spacing * (i + 0.5) + nudge;
      slots.push({ x: (x / TREE_VIEWBOX.width) * 100, y: (y / TREE_VIEWBOX.height) * 100 });
    }
  });

  const rowGap = rows === 1 ? Infinity : (TREE_BOTTOM_Y - TREE_TOP_Y) / (rows - 1);
  const diameter = Math.min(44, minSpacing * 0.82, rowGap * 0.78);
  return { slots, size: (diameter / TREE_VIEWBOX.width) * 100 };
}

/* ───────── Скачки ───────── */

const RACE_START = 4;
const RACE_LAST_STRETCH = 76;
export const RACE_FINISH = 90;

/**
 * Horse position (% of the track) after `step` of `total` knock-outs.
 * Everyone moves forward together, jostling a little; the winner crosses the line at the end.
 */
export function raceProgress(id: string, step: number, total: number, finished: boolean, isWinner: boolean): number {
  // Reach the end of the strip, leaving room for the SVG's muzzle to cross on narrow tracks.
  if (finished && isWinner) return 100;
  const t = total <= 0 ? 0 : Math.max(0, Math.min(1, step / total));
  // A smooth, individual pace: its derivative stays positive, even with hundreds of ticks.
  // Independent random jitter at each tick used to make horses run backwards.
  const pace = t + (seededUnit(id, 6) - 0.5) * 0.16 * Math.sin(Math.PI * t);
  return RACE_START + (RACE_LAST_STRETCH - RACE_START) * pace;
}
