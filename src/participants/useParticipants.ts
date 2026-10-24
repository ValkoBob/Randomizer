import { useCallback, useEffect, useMemo, useState } from 'react';
import { nameFromFileName } from './nameFromFileName';
import { resizeImage } from './resizeImage';
import type { Participant, StoredParticipant } from './types';
import { usePersistentState } from './usePersistentState';

export type AddFilesResult = { added: number; skipped: number };

/** Participants picked from the user's PC; photos live in the browser's IndexedDB, not in the project. */
export function useParticipants() {
  const [stored, setStored, loaded] = usePersistentState<StoredParticipant[]>('participants', []);
  const [urls, setUrls] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const next = new Map(stored.map((p) => [p.id, URL.createObjectURL(p.blob)]));
    setUrls(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [stored]);

  const participants = useMemo<Participant[]>(
    () =>
      stored.flatMap((p) => {
        const src = urls.get(p.id);
        return src ? [{ id: p.id, name: p.name, src }] : [];
      }),
    [stored, urls],
  );

  const addFiles = useCallback(
    async (files: File[]): Promise<AddFilesResult> => {
      const images = files.filter((f) => f.type.startsWith('image/'));
      const results = await Promise.allSettled(
        images.map(async (file) => ({
          id: `p:${crypto.randomUUID()}`,
          name: nameFromFileName(file.name),
          blob: await resizeImage(file),
        })),
      );
      const added = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
      results.forEach((r) => {
        if (r.status === 'rejected') console.error('Failed to process photo', r.reason);
      });
      added.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
      setStored((prev) => [...prev, ...added]);
      return { added: added.length, skipped: files.length - added.length };
    },
    [setStored],
  );

  const rename = useCallback(
    (id: string, name: string) => setStored((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p))),
    [setStored],
  );

  const remove = useCallback((id: string) => setStored((prev) => prev.filter((p) => p.id !== id)), [setStored]);

  const clear = useCallback(() => setStored([]), [setStored]);

  return { participants, loaded, addFiles, rename, remove, clear };
}
