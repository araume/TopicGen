"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { randomTopicText, type Topic } from "@/lib/topics";

const SHUFFLE_MS = 720;
const FLICKER_MS = 80;

const topicSize = "text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05]";

export function TopicDisplay({ topic, shuffle }: { topic: Topic; shuffle: boolean }) {
  const reduce = useReducedMotion();
  const [shuffling, setShuffling] = useState(shuffle && !reduce);
  const [flicker, setFlicker] = useState(randomTopicText);

  useEffect(() => {
    if (!shuffling) return;
    const id = setInterval(() => setFlicker(randomTopicText()), FLICKER_MS);
    const done = setTimeout(() => setShuffling(false), SHUFFLE_MS);
    return () => {
      clearInterval(id);
      clearTimeout(done);
    };
  }, [shuffling]);

  return (
    <div className="flex min-h-48 w-full flex-col items-center justify-center text-center">
      <p className="mb-6 h-4 text-[11px] uppercase tracking-[0.3em] text-muted">
        {shuffling ? "" : topic.category}
      </p>
      {shuffling ? (
        <p aria-hidden className={`font-serif ${topicSize} text-faint blur-[2px]`}>
          {flicker}
        </p>
      ) : (
        <motion.h1
          aria-live="polite"
          initial={{ opacity: 0, filter: "blur(12px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`font-serif ${topicSize} text-balance text-fg`}
        >
          {topic.text}
        </motion.h1>
      )}
    </div>
  );
}

/** Small pinned version of the topic shown above the timers. */
export function TopicHeading({ topic }: { topic: Topic }) {
  return (
    <div className="text-center">
      <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-muted">{topic.category}</p>
      <h1 className="font-serif text-2xl text-balance text-fg sm:text-3xl">{topic.text}</h1>
    </div>
  );
}
