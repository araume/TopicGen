"use client";

import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "./storage";

/** useState backed by localStorage. `hydrated` is false until the stored value has been read. */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readJSON<T>(key);
    if (stored !== null) setValue(stored);
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (hydrated) writeJSON(key, value);
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
