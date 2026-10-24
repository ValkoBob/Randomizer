import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { get, set } from 'idb-keyval';

/** useState backed by IndexedDB. Works in memory if IndexedDB is unavailable. */
export function usePersistentState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    get<T>(key)
      .then((stored) => {
        if (alive && stored !== undefined) setValue(stored);
      })
      .catch((error: Error) => console.error(`Failed to read "${key}" from IndexedDB`, error))
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    set(key, value).catch((error: Error) => console.error(`Failed to save "${key}" to IndexedDB`, error));
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}
