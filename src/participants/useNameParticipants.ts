import { useCallback } from 'react';
import type { NamedParticipant } from './types';
import { usePersistentState } from './usePersistentState';

export type AddNamesResult = { added: number; skipped: number };

/** Participants without photos: just names, typed in or loaded from a text file. Kept apart from the photo list. */
export function useNameParticipants() {
  const [participants, setParticipants, loaded] = usePersistentState<NamedParticipant[]>('names', []);

  const addNames = useCallback(
    (names: string[]): AddNamesResult => {
      const existing = new Set(participants.map((p) => p.name.toLocaleLowerCase('uk')));
      const fresh = names.filter((name) => !existing.has(name.toLocaleLowerCase('uk')));
      setParticipants((prev) => [...prev, ...fresh.map((name) => ({ id: `n:${crypto.randomUUID()}`, name }))]);
      return { added: fresh.length, skipped: names.length - fresh.length };
    },
    [participants, setParticipants],
  );

  const rename = useCallback(
    (id: string, name: string) => setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p))),
    [setParticipants],
  );

  const remove = useCallback((id: string) => setParticipants((prev) => prev.filter((p) => p.id !== id)), [setParticipants]);

  const clear = useCallback(() => setParticipants([]), [setParticipants]);

  return { participants, loaded, addNames, rename, remove, clear };
}
