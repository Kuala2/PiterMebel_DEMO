"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** 
 * Плавный скролл на desktop. Стандартное восстановление позиции браузером
 * сохраняется, чтобы кнопка «Назад» возвращала пользователя к месту просмотра.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Инициализация Lenis
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }

    if (typeof window === "undefined") return;

    // На мобильных устройствах (<768px) нативный тач-скролл работает быстрее (120Hz)
    const isMobile = window.innerWidth < 768;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let raf = 0;

    if (!isMobile && !reduceMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoResize: true,
        stopInertiaOnNavigate: true,
      });

      lenisRef.current = lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    // Обработка кликов по якорным ссылкам (#measure и т.д.)
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      } else {
        (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (raf) cancelAnimationFrame(raf);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, []);

  // Якорные переходы ждут монтирования целевого блока.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;

    if (hash) {
      // Если переход был на страницу с конкретным якорем (например, /contacts/#measure)
      const scrollToHash = () => {
        const target = document.querySelector(hash);
        if (target) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target as HTMLElement, { offset: -80 });
          } else {
            (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
          }
          return true;
        }
        return false;
      };

      // Пробуем сразу и с микрозадержкой на случай монтажа DOM
      if (!scrollToHash()) {
        const timer = setTimeout(scrollToHash, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  return null;
}

