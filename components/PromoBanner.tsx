"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PROMOS, PromoOffer } from "@/data/promos";

interface PromoBannerProps {
  offer?: PromoOffer;
  initialCategory?: "kitchens" | "wardrobes" | "customFurniture";
  className?: string;
  autoPlayInterval?: number;
}

export default function PromoBanner({
  offer,
  initialCategory,
  className = "",
  autoPlayInterval = 6000,
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
  const [progress, setProgress] = useState(0);
  const isTransitioningRef = useRef(false);

  const goToOffer = useCallback(
    (newIndex: number) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setProgress(0);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      }, 240);
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

  // Smooth auto-rotation with progress timer
  useEffect(() => {
    if (isPaused || allOffers.length <= 1) return;

    const intervalStep = 50;
    const totalSteps = autoPlayInterval / intervalStep;

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 100 / totalSteps;
      });
    }, intervalStep);

    return () => clearInterval(intervalId);
  }, [isPaused, allOffers.length, autoPlayInterval, handleNext]);

  const currentOffer = allOffers[currentIndex] || allOffers[0];
  if (!currentOffer) return null;

  return (
    <section className={`promo-architectural-banner ${className}`}>
      <div className="container">
        <div
          className="promo-card"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Progress hairline indicator */}
          <div className="promo-progress-track">
            <div
              className="promo-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>

          {/* Left: Content with smooth crossfade animation */}
          <div className={`promo-left promo-content-anim ${isTransitioning ? "is-transitioning" : ""}`}>
            <h3 className="promo-title">{currentOffer.title}</h3>
            <p className="promo-desc">{currentOffer.description}</p>
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
              className={`btn btn-green promo-cta-btn promo-content-anim ${isTransitioning ? "is-transitioning" : ""}`}
            >
              {currentOffer.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
