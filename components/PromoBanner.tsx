"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PROMOS, PromoOffer } from "@/data/promos";

interface PromoBannerProps {
  offer?: PromoOffer;
  initialCategory?: "kitchens" | "wardrobes" | "customFurniture";
  className?: string;
  autoPlayInterval?: number;
  embedded?: boolean;
  variant?: "banner" | "cta-card";
}

export default function PromoBanner({
  offer,
  initialCategory,
  className = "",
  autoPlayInterval = 6000,
  embedded = false,
  variant = "banner",
}: PromoBannerProps) {
  const allOffers = Object.values(PROMOS).filter((o) => o.active);

  const getInitialIndex = () => {
    if (initialCategory && PROMOS[initialCategory]) {
      const idx = allOffers.findIndex((o) => o.id === PROMOS[initialCategory].id);
      if (idx !== -1) return idx;
    }
    if (offer) {
      const idx = allOffers.findIndex((o) => o.id === offer.id);
      if (idx !== -1) return idx;
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const isTransitioningRef = useRef(false);

  const goToOffer = useCallback(
    (newIndex: number) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setCycleKey((k) => k + 1);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      }, 360);
    },
    []
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((current) => {
      const nextIdx = (current + 1) % allOffers.length;
      goToOffer(nextIdx);
      return current;
    });
  }, [allOffers.length, goToOffer]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((current) => {
      const prevIdx = (current - 1 + allOffers.length) % allOffers.length;
      goToOffer(prevIdx);
      return current;
    });
  }, [allOffers.length, goToOffer]);

  // Auto-rotation: цикл перезапускается после ручного переключения (cycleKey)
  useEffect(() => {
    if (isPaused || allOffers.length <= 1) return;
    const intervalId = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(intervalId);
  }, [isPaused, allOffers.length, autoPlayInterval, handleNext, cycleKey]);

  const currentOffer = allOffers[currentIndex] || allOffers[0];
  if (!currentOffer) return null;

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (currentOffer.ctaHref.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(currentOffer.ctaHref);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        const input = target.querySelector<HTMLInputElement>("input:not([type=hidden])");
        if (input) {
          setTimeout(() => input.focus(), 300);
        }
      }
    }
  };

  const cardContent = (
    <div
      className="promo-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
        {/* Left: Content with smooth crossfade animation */}
        <div className={`promo-left promo-content-anim ${isTransitioning ? "is-transitioning" : ""}`}>
          {currentOffer.badge && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-green-brand)" }}>
                АКЦИЯ СТУДИИ · {currentOffer.badge.toUpperCase()}
              </span>
            </div>
          )}
          <h3 className="promo-title">{currentOffer.title}</h3>
        </div>

      {/* Right: Controls & CTA */}
      <div className="promo-right">
        {allOffers.length > 1 && (
          <div className="promo-nav-group">
            <span className="promo-counter-label">
              0{currentIndex + 1} / 0{allOffers.length}
            </span>
            <div className="promo-arrows">
              <button
                type="button"
                className="promo-nav-arrow"
                onClick={handlePrev}
                aria-label="Предыдущая акция"
                title="Предыдущая акция"
              >
                ←
              </button>
              <button
                type="button"
                className="promo-nav-arrow"
                onClick={handleNext}
                aria-label="Следующая акция"
                title="Следующая акция"
              >
                →
              </button>
            </div>
          </div>
        )}

        <Link
          href={currentOffer.ctaHref}
          onClick={handleCtaClick}
          className={`btn btn-green promo-cta-btn promo-content-anim ${isTransitioning ? "is-transitioning" : ""}`}
        >
          {currentOffer.ctaText}
        </Link>
      </div>
    </div>
  );

  if (variant === "cta-card") {
    return (
      <div
        className={`promo-cta-card ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="promo-cta-card-head">
          {currentOffer.badge && (
            <div className="promo-cta-card-badge">
              <span className="promo-cta-card-dot" />
              АКЦИЯ · {currentOffer.badge.toUpperCase()}
            </div>
          )}

          {allOffers.length > 1 && (
            <div className="promo-cta-card-nav">
              <span className="promo-counter-label">
                0{currentIndex + 1} / 0{allOffers.length}
              </span>
              <div className="promo-arrows">
                <button
                  type="button"
                  className="promo-nav-arrow"
                  onClick={handlePrev}
                  aria-label="Предыдущая акция"
                  title="Предыдущая акция"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="promo-nav-arrow"
                  onClick={handleNext}
                  aria-label="Следующая акция"
                  title="Следующая акция"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`promo-content-anim ${isTransitioning ? "is-transitioning" : ""}`} style={{ margin: "16px 0 20px 0" }}>
          <h3 className="promo-cta-card-title">{currentOffer.title}</h3>
        </div>

        <div>
          <Link
            href={currentOffer.ctaHref}
            onClick={handleCtaClick}
            className={`btn btn-green promo-cta-card-btn promo-content-anim ${isTransitioning ? "is-transitioning" : ""}`}
          >
            {currentOffer.ctaText}
          </Link>
        </div>
      </div>
    );
  }

  if (embedded) {
    return (
      <div className={`promo-embedded-wrapper ${className}`}>
        {cardContent}
      </div>
    );
  }

  return (
    <section className={`promo-architectural-banner ${className}`}>
      <div className="container">
        {cardContent}
      </div>
    </section>
  );
}
