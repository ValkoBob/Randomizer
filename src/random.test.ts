import { describe, expect, it } from 'vitest';
import { buildScanSchedule, randomInt, riffle, shuffle } from './random';

describe('randomInt', () => {
  it('stays within [0, n) and hits every value', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const v = randomInt(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
      seen.add(v);
    }
    expect(seen.size).toBe(7);
  });

  it('rejects invalid n', () => {
    expect(() => randomInt(0)).toThrow(RangeError);
    expect(() => randomInt(1.5)).toThrow(RangeError);
  });
});

describe('shuffle and riffle', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  it('shuffle returns a permutation without mutating the input', () => {
    const copy = [...items];
    const result = shuffle(items);
    expect(items).toEqual(copy);
    expect([...result].sort()).toEqual(copy);
  });

  it('riffle returns a permutation', () => {
    expect([...riffle(items)].sort()).toEqual(items);
    expect(riffle(['x'])).toEqual(['x']);
  });
});

describe('buildScanSchedule', () => {
  it('ends on the winner after full laps', () => {
    for (let winner = 0; winner < 8; winner++) {
      const steps = buildScanSchedule(8, winner);
      expect(steps.at(-1)?.pos).toBe(winner);
      expect(steps.length).toBe(2 * 8 + winner + 1);
    }
  });

  it('slows down: delays never decrease', () => {
    const steps = buildScanSchedule(5, 3);
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].delay).toBeGreaterThanOrEqual(steps[i - 1].delay);
    }
  });

  it('is empty when there are no cards', () => {
    expect(buildScanSchedule(0, 0)).toEqual([]);
  });
});
