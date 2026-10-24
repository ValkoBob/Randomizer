const UINT32_RANGE = 2 ** 32;

/** Uniform random integer in [0, n) from crypto, without modulo bias. */
export function randomInt(n: number): number {
  if (!Number.isInteger(n) || n <= 0) throw new RangeError(`randomInt: invalid n=${n}`);
  const limit = UINT32_RANGE - (UINT32_RANGE % n);
  const buf = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % n;
}

/** Fisher–Yates shuffle, returns a new array. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Where to cut the deck for a riffle: near the middle, ±2 cards. */
export function riffleCut(n: number): number {
  if (n < 2) return n;
  const cut = Math.floor(n / 2) + randomInt(5) - 2;
  return Math.min(n - 1, Math.max(1, cut));
}

/** Interleave two halves like a real riffle (Gilbert–Shannon–Reeds model). */
export function interleave<T>(left: readonly T[], right: readonly T[]): T[] {
  const result: T[] = [];
  let l = 0;
  let r = 0;
  while (l < left.length || r < right.length) {
    const leftRemaining = left.length - l;
    const rightRemaining = right.length - r;
    if (randomInt(leftRemaining + rightRemaining) < leftRemaining) result.push(left[l++]);
    else result.push(right[r++]);
  }
  return result;
}

export function riffle<T>(items: readonly T[]): T[] {
  const cut = riffleCut(items.length);
  return interleave(items.slice(0, cut), items.slice(cut));
}

export type ScanStep = { pos: number; delay: number };

/**
 * Steps for the highlight running over the cards: a few full laps that slow down
 * and stop exactly on `winnerPos`. `delay` is how long the highlight stays on the step.
 */
export function buildScanSchedule(count: number, winnerPos: number, minDelay = 60, maxDelay = 520): ScanStep[] {
  if (count <= 0) return [];
  const laps = count <= 6 ? 3 : count <= 15 ? 2 : 1;
  const total = laps * count + winnerPos + 1;
  const steps: ScanStep[] = [];
  for (let k = 0; k < total; k++) {
    const t = total === 1 ? 1 : k / (total - 1);
    steps.push({ pos: k % count, delay: Math.round(minDelay + (maxDelay - minDelay) * t ** 3) });
  }
  return steps;
}
