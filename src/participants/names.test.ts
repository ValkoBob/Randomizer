import { describe, expect, it } from 'vitest';
import { hueFromName, initials, parseNames } from './names';

describe('parseNames', () => {
  it('splits by new lines, commas, semicolons and tabs', () => {
    expect(parseNames('Олена\nТарас, Марко;Ірина\tБогдан\r\nСофія')).toEqual(['Олена', 'Тарас', 'Марко', 'Ірина', 'Богдан', 'Софія']);
  });

  it('drops empty entries, numbering, bullets and quotes', () => {
    expect(parseNames('\n 1. Олена \n2) Тарас\n- Марко\n• Ірина\n"Богдан"\n\n')).toEqual(['Олена', 'Тарас', 'Марко', 'Ірина', 'Богдан']);
  });

  it('keeps repeated names once, ignoring case', () => {
    expect(parseNames('Олена\nолена\nОЛЕНА\nТарас')).toEqual(['Олена', 'Тарас']);
  });

  it('strips a UTF-8 BOM from files', () => {
    expect(parseNames('﻿Олена\nТарас')).toEqual(['Олена', 'Тарас']);
  });

  it('keeps multi-word names whole', () => {
    expect(parseNames('Олена Петренко\nАнна-Марія')).toEqual(['Олена Петренко', 'Анна-Марія']);
  });

  it('returns nothing for blank text', () => {
    expect(parseNames('  \n , ; ')).toEqual([]);
  });
});

describe('initials', () => {
  it('takes the first letters of up to two words', () => {
    expect(initials('Олена Петренко')).toBe('ОП');
    expect(initials('тарас')).toBe('Т');
    expect(initials('Анна Марія Коваль')).toBe('АМ');
  });

  it('does not split emoji', () => {
    expect(initials('🦊 Лис')).toBe('🦊Л');
  });
});

describe('hueFromName', () => {
  it('is stable and within 0–359', () => {
    expect(hueFromName('Олена')).toBe(hueFromName('Олена'));
    for (const name of ['Олена', 'Тарас', 'Марко', 'A', '']) {
      expect(hueFromName(name)).toBeGreaterThanOrEqual(0);
      expect(hueFromName(name)).toBeLessThan(360);
    }
  });
});
