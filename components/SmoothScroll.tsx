"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** 
 * Плавный «бархатный» скролл в стиле доводчиков Blum
 * с гарантированным сбросом в начало страницы (0, 0) при любой навигации между вкладками/разделами.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Инициализация Lenis
  useEffect(() => {
    // Отключаем автоматическое восстановление скролла браузером в пользу чистого SPA-поведения
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (typeof window === "undefined") return;

    // На мобильных устройствах (<768px) нативный тач-скролл работает быстрее (120Hz)
    const isMobile = window.innerWidth < 768;
    let lenis: Lenis | null = null;
    let raf = 0;

    if (!isMobile) {
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

  // Сброс скролла в самый верх (0, 0) при любом переходе между страницами/вкладками
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
    } else {
      // Обычный переход на новую вкладку/страницу — СТРОГО с самого начала
      const resetScroll = () => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true, force: true });
          lenisRef.current.resize();
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      // 1. Мгновенно синхронно
      resetScroll();

      // 2. В следующем кадре анимации
      const rafId = requestAnimationFrame(resetScroll);

      // 3. Через 50ms на случай отложенного монтирования Next.js
      const timer = setTimeout(resetScroll, 50);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timer);
      };
    }
  }, [pathname]);

  return null;
}

