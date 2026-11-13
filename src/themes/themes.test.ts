import { describe, expect, it } from 'vitest';
import { getTheme, seasonalTheme, THEMES } from './themes';

describe('THEMES', () => {
  it('have unique ids', () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('fill every text, phase label and confetti colour', () => {
    for (const theme of THEMES) {
      for (const [key, value] of Object.entries(theme)) {
        if (typeof value === 'string') expect(value.trim(), `${theme.id}.${key}`).not.toBe('');
      }
      for (const phase of ['flipDown', 'gather', 'shuffle', 'deal', 'scan', 'reveal'] as const) {
        expect(theme.phaseLabels[phase], `${theme.id}.${phase}`).toBeTruthy();
      }
      expect(theme.confetti.colors.length).toBeGreaterThan(0);
    }
  });

  it('describe each elimination with all three labels', () => {
    for (const theme of THEMES) {
      if (!theme.elimination) continue;
      const { startLabel, outLabel, lastLabel } = theme.elimination;
      for (const label of [startLabel, outLabel, lastLabel]) expect(label.trim(), theme.id).not.toBe('');
      expect(outLabel, theme.id).toContain('{name}');
    }
  });

  it('give New Year, Mafia, Wild West and Ukrainian their own elimination scene', () => {
    const kinds = Object.fromEntries(THEMES.map((t) => [t.id, t.elimination?.kind]));
    expect(kinds).toMatchObject({ newyear: 'tree', mafia: 'shooting', wildwest: 'race', ukrainian: 'hopak' });
    expect(kinds.halloween).toBeUndefined();
  });
});

describe('getTheme', () => {
  it('finds a theme by id', () => {
    expect(getTheme('mafia').id).toBe('mafia');
  });

  it('falls back to Halloween for unknown or missing ids', () => {
    expect(getTheme('nope').id).toBe('halloween');
    expect(getTheme(null).id).toBe('halloween');
  });
});

describe('seasonalTheme', () => {
  it.each([
    [new Date(2026, 9, 31), 'halloween'],
    [new Date(2026, 11, 14), 'halloween'],
    [new Date(2026, 11, 15), 'newyear'],
    [new Date(2026, 11, 25), 'newyear'],
    [new Date(2027, 0, 5), 'newyear'],
    [new Date(2027, 0, 15), 'newyear'],
    [new Date(2027, 0, 16), 'halloween'],
    [new Date(2026, 5, 1), 'halloween'],
  ])('%s → %s', (date, expected) => {
    expect(seasonalTheme(date)).toBe(expected);
  });
});
