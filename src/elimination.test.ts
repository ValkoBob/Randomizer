import { describe, expect, it } from 'vitest';
import { ELIMINATION_FINALE_MS, ELIMINATION_INTRO_MS, eliminationStepMs, RACE_FINISH, raceProgress, seededUnit, treeLayout } from './elimination';

describe('eliminationStepMs', () => {
  it('includes the entrance and finale in the 11 s budget', () => {
    expect(eliminationStepMs(7)).toBe(1100);
    expect(eliminationStepMs(1)).toBe(1600);
    for (const losers of [5, 7, 10, 30, 60, 200]) {
      const duration = ELIMINATION_INTRO_MS + losers * eliminationStepMs(losers) + ELIMINATION_FINALE_MS;
      expect(duration).toBeCloseTo(11000);
    }
    expect(eliminationStepMs(0)).toBe(0);
  });
});

describe('seededUnit', () => {
  it('is stable and within [0, 1)', () => {
    expect(seededUnit('Олена', 3)).toBe(seededUnit('Олена', 3));
    expect(seededUnit('Олена', 3)).not.toBe(seededUnit('Олена', 4));
    for (let step = 0; step < 50; step++) {
      const v = seededUnit(`p:${step}`, step);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('treeLayout', () => {
  it.each([1, 2, 5, 8, 13, 30, 60])('hangs exactly %i ornaments inside the tree', (n) => {
    const { slots, size } = treeLayout(n);
    expect(slots).toHaveLength(n);
    expect(size).toBeGreaterThan(0);
    for (const { x, y } of slots) {
      expect(x).toBeGreaterThan(5);
      expect(x).toBeLessThan(95);
      expect(y).toBeGreaterThan(10);
      expect(y).toBeLessThan(80);
    }
  });

  it('does not let neighbouring balls overlap', () => {
    for (const n of [6, 12, 25, 40]) {
      const { slots, size } = treeLayout(n);
      // size is % of width; y is % of height (360 vs 300 wide), so compare in viewBox units.
      const pts = slots.map((s) => [s.x * 3, s.y * 3.6]);
      const d = size * 3;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          expect(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1])).toBeGreaterThanOrEqual(d * 0.99);
        }
      }
    }
  });

  it('is empty for nobody', () => {
    expect(treeLayout(0).slots).toEqual([]);
  });
});

describe('raceProgress', () => {
  it('starts everyone on the line and moves the field forward', () => {
    expect(raceProgress('a', 0, 5, false, false)).toBe(raceProgress('b', 0, 5, false, false));
    expect(raceProgress('a', 4, 5, false, false)).toBeGreaterThan(raceProgress('a', 1, 5, false, false));
  });

  it('keeps everyone before the line until the winner crosses it', () => {
    for (let step = 0; step <= 9; step++) {
      expect(raceProgress(`h${step}`, step, 9, false, false)).toBeLessThan(RACE_FINISH);
    }
    expect(raceProgress('w', 9, 9, true, true)).toBeGreaterThan(RACE_FINISH);
  });

  it('never sends an active horse backwards, including large fields', () => {
    for (const total of [2, 14, 58, 118, 398]) {
      for (let horse = 0; horse < 60; horse++) {
        let previous = raceProgress(`horse:${horse}`, 0, total, false, false);
        for (let tick = 1; tick <= total; tick++) {
          const current = raceProgress(`horse:${horse}`, tick, total, false, false);
          expect(current).toBeGreaterThan(previous);
          expect(current).toBeLessThan(RACE_FINISH);
          previous = current;
        }
      }
    }
  });

  it('clamps progress and never lets an eliminated horse cross the finish', () => {
    expect(raceProgress('a', -5, 10, false, false)).toBe(4);
    expect(raceProgress('a', 20, 10, false, false)).toBe(76);
    expect(raceProgress('a', 0, 0, false, false)).toBe(4);
    expect(raceProgress('a', 10, 10, true, false)).toBeLessThan(RACE_FINISH);
  });
});
