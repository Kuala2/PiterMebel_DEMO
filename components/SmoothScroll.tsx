"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Плавный «бархатный» скролл в стиле доводчиков Blum. Уважает prefers-reduced-motion. */
export default function SmoothScroll() {
  useEffect(() => {
    // На мобильных устройствах нативный тач-скролл работает быстрее и с аппаратным ускорением 120Hz
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Якорные ссылки (#measure и т.п.) — плавный прокрут средствами Lenis
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
