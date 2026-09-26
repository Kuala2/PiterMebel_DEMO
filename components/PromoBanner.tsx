"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PROMOS } from "@/data/promos";

interface PromoBannerProps {
  initialCategory?: "kitchens" | "wardrobes" | "customFurniture";
  className?: string;
  autoPlayInterval?: number;
}

const ACTIVE_PROMOS = Object.values(PROMOS).filter((promo) => promo.active);

export default function PromoBanner({
  initialCategory,
  className = "",
  autoPlayInterval = 5000,
}: PromoBannerProps) {
  const allOffers = ACTIVE_PROMOS;

  const getInitialIndex = () => {
    if (initialCategory && PROMOS[initialCategory]) {
      const idx = allOffers.findIndex((o) => o.id === PROMOS[initialCategory].id);
      if (idx !== -1) return idx;
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isInteractiveHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const timerRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preferredOffer = initialCategory ? PROMOS[initialCategory] : undefined;
    if (!preferredOffer) return;

    const preferredIndex = allOffers.findIndex((item) => item.id === preferredOffer.id);
    if (preferredIndex !== -1) {
      setCurrentIndex(preferredIndex);
      currentIndexRef.current = preferredIndex;
    }
  }, [initialCategory, allOffers]);

  const goToOffer = useCallback(
    (newIndex: number) => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      setIsTransitioning(true);
      transitionTimeoutRef.current = window.setTimeout(() => {
        currentIndexRef.current = newIndex;
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, 150);
    },
    []
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (allOffers.length < 2 || autoPlayInterval <= 0) return;

    timerRef.current = window.setTimeout(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.hidden && !reducedMotion && !isInteractiveHoveredRef.current && !isFocusedRef.current) {
        const nextIdx = (currentIndexRef.current + 1) % allOffers.length;
        goToOffer(nextIdx);
      }
      startTimer();
    }, autoPlayInterval);
  }, [allOffers.length, autoPlayInterval, goToOffer]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleNext = useCallback(() => {
    if (allOffers.length < 2) return;
    const nextIdx = (currentIndexRef.current + 1) % allOffers.length;
    goToOffer(nextIdx);
    startTimer();
  }, [allOffers.length, goToOffer, startTimer]);

  const handlePrev = useCallback(() => {
    if (allOffers.length < 2) return;
    const prevIdx = (currentIndexRef.current - 1 + allOffers.length) % allOffers.length;
    goToOffer(prevIdx);
    startTimer();
  }, [allOffers.length, goToOffer, startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      pauseTimer();
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [startTimer, pauseTimer]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pauseTimer();
      } else if (!isInteractiveHoveredRef.current && !isFocusedRef.current) {
        startTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [pauseTimer, startTimer]);

  const handleInteractiveMouseEnter = () => {
    isInteractiveHoveredRef.current = true;
    pauseTimer();
  };

  const handleInteractiveMouseLeave = (containerEl?: HTMLElement | null) => {
    isInteractiveHoveredRef.current = false;
    if (document.activeElement instanceof HTMLElement && containerEl?.contains(document.activeElement)) {
      document.activeElement.blur();
      isFocusedRef.current = false;
    }
    startTimer();
  };

  const handleFocusCapture = () => {
    isFocusedRef.current = true;
    pauseTimer();
  };

  const handleBlurCapture = (e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      isFocusedRef.current = false;
      if (!isInteractiveHoveredRef.current) {
        startTimer();
      }
    }
  };

  if (allOffers.length === 0) return null;

  return (
    <div className={`promo-cta-card ${className}`}>
      <div className="promo-cta-card-head">
        <div className={`promo-content-anim promo-content-stack ${isTransitioning ? "is-transitioning" : ""}`}>
          {allOffers.map((item, idx) =>
            idx === currentIndex ? (
              <h3 key={item.id} className="promo-cta-card-title">
                {item.title}
              </h3>
            ) : (
              <div key={item.id} className="promo-cta-card-ghost" aria-hidden="true">
                {item.title}
              </div>
            )
          )}
        </div>

        {allOffers.length > 1 && (
          <div
            ref={navRef}
            className="promo-cta-card-nav"
            onMouseEnter={handleInteractiveMouseEnter}
            onMouseLeave={() => handleInteractiveMouseLeave(navRef.current)}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
          >
            <span className="promo-counter-label">
              0{currentIndex + 1} / 0{allOffers.length}
            </span>
            <div className="promo-arrows">
              <button type="button" className="promo-nav-arrow" onClick={handlePrev} aria-label="Предыдущая акция" title="Предыдущая акция">
                ←
              </button>
              <button type="button" className="promo-nav-arrow" onClick={handleNext} aria-label="Следующая акция" title="Следующая акция">
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
