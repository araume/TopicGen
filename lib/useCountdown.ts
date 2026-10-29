"use client";

import { useCallback, useEffect, useState } from "react";
import { usePersistentState } from "./usePersistentState";

export type CountdownStatus = "idle" | "running" | "paused" | "finished";

type CountdownState = {
  status: CountdownStatus;
  /** Wall-clock end time while running, so the timer survives tab sleep and refreshes. */
  endAt: number | null;
  /** Time left while idle or paused. */
  remaining: number;
};

export function useCountdown(duration: number, storageKey: string) {
  const [state, setState, hydrated] = usePersistentState<CountdownState>(storageKey, {
    status: "idle",
    endAt: null,
    remaining: duration,
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (state.status !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.status]);

  const remaining =
    state.status === "running" && state.endAt !== null
      ? Math.max(0, state.endAt - now)
      : state.remaining;

  useEffect(() => {
    if (state.status === "running" && remaining === 0) {
      setState({ status: "finished", endAt: null, remaining: 0 });
    }
  }, [state.status, remaining, setState]);

  // Refresh `now` alongside every start/resume so the first frame isn't computed from a stale clock.
  const start = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setState({ status: "running", endAt: t + duration, remaining: duration });
  }, [duration, setState]);

  const pause = useCallback(() => {
    setState((s) =>
      s.status === "running" && s.endAt !== null
        ? { status: "paused", endAt: null, remaining: Math.max(0, s.endAt - Date.now()) }
        : s,
    );
  }, [setState]);

  const resume = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setState((s) => (s.status === "paused" ? { status: "running", endAt: t + s.remaining, remaining: s.remaining } : s));
  }, [setState]);

  const reset = useCallback(() => {
    setState({ status: "idle", endAt: null, remaining: duration });
  }, [duration, setState]);

  return { status: state.status, remaining, hydrated, start, pause, resume, reset };
}
