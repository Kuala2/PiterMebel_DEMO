"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
}

/**
 * В HTML сразу находится итоговое значение. После гидратации оно один раз
 * набегает от нуля при появлении в кадре, если пользователь не отключил motion.
 */
export default function CountUp({ to, duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame = 0;
    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;
      const startedAt = performance.now();
      element.textContent = "0";

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(to * eased).toLocaleString("ru-RU");

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
        } else {
          element.textContent = to.toLocaleString("ru-RU");
        }
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        startAnimation();
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [duration, to]);

  const finalValue = to.toLocaleString("ru-RU");

  return (
    <span ref={ref} className={className} aria-label={finalValue} data-count-final={to}>
      {finalValue}
    </span>
  );
}
