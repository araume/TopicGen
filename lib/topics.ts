import data from "@/data/topics.json";
import { readJSON, writeJSON } from "./storage";

export type Topic = {
  text: string;
  category: string;
};

export const topics: Topic[] = data.topics;

const SEEN_KEY = "sg:seen";

function randomIndex(length: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % length;
}

/**
 * Picks a topic the user hasn't seen yet. Once every topic has been shown,
 * the history resets (never repeating `current` immediately).
 */
export function pickTopic(current?: string): Topic | null {
  if (topics.length === 0) return null;

  let seen = new Set(readJSON<string[]>(SEEN_KEY) ?? []);
  let pool = topics.filter((t) => !seen.has(t.text));

  if (pool.length === 0) {
    seen = new Set();
    pool = topics.length > 1 ? topics.filter((t) => t.text !== current) : topics;
  }

  const topic = pool[randomIndex(pool.length)];
  seen.add(topic.text);
  writeJSON(SEEN_KEY, [...seen]);
  return topic;
}

/** Any topic text, used for the shuffle flicker before a reveal. */
export function randomTopicText() {
  return topics.length ? topics[randomIndex(topics.length)].text : "…";
}
