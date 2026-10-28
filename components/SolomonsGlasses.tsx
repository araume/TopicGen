"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { pickTopic, type Topic } from "@/lib/topics";
import { useCountdown } from "@/lib/useCountdown";
import { usePersistentState } from "@/lib/usePersistentState";
import { Pill } from "./Pill";
import { RevealButton } from "./RevealButton";
import { Timer } from "./Timer";
import { Toggle } from "./Toggle";
import { TopicDisplay, TopicHeading } from "./TopicDisplay";
import { Wordmark } from "./Wordmark";

const RESEARCH_MS = 2 * 60 * 60 * 1000;
const PRESENT_MS = 3 * 60 * 1000;
const URGENT_MS = 30 * 1000;

type Phase = "idle" | "revealed" | "research" | "present" | "done";

type Session = {
  phase: Phase;
  topic: Topic | null;
  /** Bumped on every reveal so the topic animation replays. */
  revealId: number;
};

type Settings = {
  presentTimer: boolean;
};

const IDLE_SESSION: Session = { phase: "idle", topic: null, revealId: 0 };

export function SolomonsGlasses() {
  const [session, setSession, sessionReady] = usePersistentState<Session>("sg:session", IDLE_SESSION);
  const [settings, setSettings, settingsReady] = usePersistentState<Settings>("sg:settings", {
    presentTimer: true,
  });
  const research = useCountdown(RESEARCH_MS, "sg:research");
  const present = useCountdown(PRESENT_MS, "sg:present");
  // Only shuffle on a fresh click, not when restoring a revealed topic after a refresh.
  const [shuffleOnReveal, setShuffleOnReveal] = useState(false);

  const ready = sessionReady && settingsReady && research.hydrated && present.hydrated;
  const { phase, topic } = session;

  const reveal = useCallback(() => {
    setShuffleOnReveal(true);
    setSession((s) => ({ phase: "revealed", topic: pickTopic(s.topic?.text), revealId: s.revealId + 1 }));
  }, [setSession]);

  const goTo = (next: Phase) => setSession((s) => ({ ...s, phase: next }));

  const beginResearch = () => {
    research.start();
    goTo("research");
  };

  const finishResearch = () => {
    research.reset();
    if (settings.presentTimer) {
      present.reset();
      goTo("present");
    } else {
      goTo("done");
    }
  };

  const finishPresenting = () => {
    present.reset();
    goTo("done");
  };

  const startOver = () => {
    const inProgress = phase === "research" || phase === "present";
    if (inProgress && !window.confirm("Leave this session? Your timer will be lost.")) return;
    research.reset();
    present.reset();
    setSession((s) => ({ ...IDLE_SESSION, topic: s.topic, revealId: s.revealId }));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("button, a, input, textarea")) return;
      if (phase === "idle" && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        reveal();
      } else if (phase === "revealed" && e.key === "Escape") {
        setSession((s) => ({ ...s, phase: "idle" }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, reveal, setSession]);

  const tagline = settings.presentTimer
    ? "One topic · Two hours · Three minutes"
    : "One topic · Two hours";

  let content: React.ReactNode = null;

  if (phase === "idle") {
    content = (
      <div className="flex flex-col items-center gap-14">
        <RevealButton onClick={reveal} />
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">{tagline}</p>
      </div>
    );
  } else if (phase === "revealed") {
    content = (
      <div className="flex w-full flex-col items-center gap-12">
        {topic ? (
          <TopicDisplay key={session.revealId} topic={topic} shuffle={shuffleOnReveal} />
        ) : (
          <p className="max-w-sm text-center text-muted">
            No topics yet. Add some to <code className="text-fg">data/topics.json</code>.
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {topic && (
            <Pill variant="primary" onClick={beginResearch}>
              Begin research · 2:00:00
            </Pill>
          )}
          <Pill onClick={reveal}>Another topic</Pill>
        </div>
      </div>
    );
  } else if (phase === "research" && topic) {
    const finished = research.status === "finished";
    content = (
      <div className="flex w-full flex-col items-center gap-10">
        <TopicHeading topic={topic} />
        <Timer remaining={research.remaining} total={RESEARCH_MS} label={finished ? "Time’s up" : "Research"} />
        <div className="flex flex-wrap justify-center gap-3">
          {research.status === "running" && <Pill onClick={research.pause}>Pause</Pill>}
          {research.status === "paused" && <Pill onClick={research.resume}>Resume</Pill>}
          <Pill variant={finished ? "primary" : "ghost"} onClick={finishResearch}>
            {settings.presentTimer ? "Ready to present" : "Finish research"}
          </Pill>
        </div>
      </div>
    );
  } else if (phase === "present" && topic) {
    const finished = present.status === "finished";
    content = (
      <div className="flex w-full flex-col items-center gap-10">
        <TopicHeading topic={topic} />
        <Timer
          remaining={present.remaining}
          total={PRESENT_MS}
          label={finished ? "Time." : "Present"}
          urgentBelow={URGENT_MS}
        />
        <div className="flex flex-wrap justify-center gap-3">
          {present.status === "idle" && (
            <Pill variant="primary" onClick={present.start}>
              Start · 3:00
            </Pill>
          )}
          {present.status === "running" && <Pill onClick={present.pause}>Pause</Pill>}
          {present.status === "paused" && <Pill onClick={present.resume}>Resume</Pill>}
          <Pill variant={finished ? "primary" : "ghost"} onClick={finishPresenting}>
            {finished ? "Finish" : "End early"}
          </Pill>
        </div>
      </div>
    );
  } else if (phase === "done" && topic) {
    content = (
      <div className="flex flex-col items-center gap-10 text-center">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-muted">Complete</p>
          <h2 className="font-serif text-5xl italic text-fg sm:text-6xl">
            {settings.presentTimer ? "Well presented." : "Research complete."}
          </h2>
          <p className="mt-6 font-serif text-xl text-balance text-muted">{topic.text}</p>
        </div>
        <Pill variant="primary" onClick={startOver}>
          New topic
        </Pill>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <Wordmark />
        </header>

        <main className="flex flex-1 items-center justify-center py-8">
          {ready && (
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex w-full justify-center"
              >
                {content}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        <footer className="flex min-h-16 flex-wrap items-center justify-between gap-4 py-6">
          {ready && phase !== "present" && phase !== "done" ? (
            <Toggle
              label="Presentation timer"
              checked={settings.presentTimer}
              onChange={(presentTimer) => setSettings({ presentTimer })}
            />
          ) : (
            <span />
          )}
          {ready && phase !== "idle" && (
            <button
              type="button"
              onClick={startOver}
              className="cursor-pointer text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg"
            >
              Start over
            </button>
          )}
        </footer>
      </div>
    </MotionConfig>
  );
}
