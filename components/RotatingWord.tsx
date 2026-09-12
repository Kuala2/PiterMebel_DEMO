"use client";

import { useEffect, useState } from "react";

interface RotatingWordProps {
  words: string[];
  interval?: number;
}

/** Слово в строке, которое постоянно сменяется со сдвигом и блюром */
export default function RotatingWord({ words, interval = 2800 }: RotatingWordProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className="rotating-word" key={idx}>
      {words[idx]}
    </span>
  );
}
