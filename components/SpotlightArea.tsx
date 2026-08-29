"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface SpotlightAreaProps {
  children: ReactNode;
  className?: string;
  /** селектор карточек, внутри которых следует курсор */
  selector?: string;
}

/**
 * Постоянный эффект: мягкий свет следует за курсором внутри карточек
 * (по мотивам React Bits Spotlight Card). Позиция пишется в CSS-переменные --mx/--my.
 */
export default function SpotlightArea({ children, className, selector = ".spotlight-target" }: SpotlightAreaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest<HTMLElement>(selector);
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    root.addEventListener("mousemove", onMove);
    return () => root.removeEventListener("mousemove", onMove);
  }, [selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
