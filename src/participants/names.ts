export const MAX_NAME_LENGTH = 40;

/**
 * Pasted text or a .txt/.csv file → clean list of names.
 * Names are separated by new lines, commas, semicolons or tabs; list numbering ("1.", "2)") and bullets are dropped,
 * so does surrounding CSV quoting. Repeats (ignoring case) are kept once.
 */
export function parseNames(text: string): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const raw of text.replace(/^﻿/, '').split(/[\r\n,;\t]+/)) {
    const name = raw
      .trim()
      .replace(/^(?:\d+[.)]\s*|[-•*–]\s+)/, '')
      .replace(/^["'«](.*)["'»]$/, '$1')
      .trim()
      .normalize('NFC')
      .slice(0, MAX_NAME_LENGTH);
    const key = name.toLocaleLowerCase('uk');
    if (!name || seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names;
}

/** "Олена Петренко" → "ОП", "тарас" → "Т". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toLocaleUpperCase('uk');
}

/** A stable hue (0–359) per name, so a name keeps its colour between rounds. */
export function hueFromName(name: string): number {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 360;
  return hash;
}
