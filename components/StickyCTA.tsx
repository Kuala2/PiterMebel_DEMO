"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/data/site";

/** Фиксированная панель действий на мобильных: позвонить + консультация. */
export default function StickyCTA() {
  const pathname = usePathname();
  const [isInteractiveZoneVisible, setIsInteractiveZoneVisible] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(
      "[data-sticky-cta-suppress], #measure-form, .hero-cta-wrap, .detail-actions-row, .final-section, .calculator-section, .catalog-card, .kitchen-ladder-item"
    ));

    const visibleTargets = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleTargets.add(entry.target);
          else visibleTargets.delete(entry.target);
        });
        setIsInteractiveZoneVisible(visibleTargets.size > 0);
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const initialHeight = window.innerHeight;
    const updateKeyboardState = () => {
      setIsKeyboardOpen(viewport.height < initialHeight * 0.76);
    };
    updateKeyboardState();
    viewport.addEventListener("resize", updateKeyboardState);
    return () => viewport.removeEventListener("resize", updateKeyboardState);
  }, [pathname]);

  const isHidden = pathname.startsWith("/calculator") || isInteractiveZoneVisible || isKeyboardOpen;

  useEffect(() => {
    document.body.classList.toggle("has-sticky-cta", !isHidden);
    return () => document.body.classList.remove("has-sticky-cta");
  }, [isHidden]);

  // Не перекрываем калькулятор, экранную клавиатуру, формы, карточки и основные CTA.
  if (isHidden) return null;

  return (
    <div className="sticky-cta" aria-label="Быстрые действия">
      <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="btn btn-green">
        Позвонить
      </a>
      <Link href="/contacts/#measure" className="btn btn-glass">
        Консультация
      </Link>
    </div>
  );
}
