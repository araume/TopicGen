"use client";

import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "./storage";

/** useState backed by localStorage. `hydrated` is false until the stored value has been read. */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // localStorage only exists in the browser, so the stored value has to be read after mount;
  // reading it during render would make the server and client HTML disagree.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = readJSON<T>(key);
    if (stored !== null) setValue(stored);
    setHydrated(true);
  }, [key]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (hydrated) writeJSON(key, value);
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
