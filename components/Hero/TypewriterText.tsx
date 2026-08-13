"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterTextProps {
  words: string[];
  className?: string;
}

/** Cycles through `words`, typing and deleting each in turn. */
export default function TypewriterText({
  words,
  className,
}: TypewriterTextProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset when the word list identity changes (e.g. a language switch) —
  // otherwise the in-progress `text` from the old language gets sliced
  // against a word from the new language, producing a garbled flash.
  const prevWords = useRef(words);
  useEffect(() => {
    if (prevWords.current !== words) {
      prevWords.current = words;
      setIndex(0);
      setText("");
      setDeleting(false);
    }
  }, [words]);

  useEffect(() => {
    if (reduceMotion) return;

    const current = words[index % words.length];
    const done = text === current;
    const empty = text === "";

    let delay = deleting ? 45 : 90;
    if (done && !deleting) delay = 1600; // pause at full word
    if (empty && deleting) delay = 300; // pause before next word

    const timer = setTimeout(() => {
      if (!deleting && done) {
        setDeleting(true);
      } else if (deleting && empty) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1),
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, reduceMotion]);

  // Reduced motion: show the first word whole, no cycling, no blinking caret.
  // Wait for mount to avoid SSR hydration mismatch since server doesn't know client preferences.
  if (mounted && reduceMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={className}>
      {text}
      <span className="ml-0.5 inline-block w-[3px] animate-blink self-stretch bg-accent align-middle">
        &nbsp;
      </span>
    </span>
  );
}
