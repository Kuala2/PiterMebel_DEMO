"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
  title: string;
  coverAlt?: string;
  initialRatios?: Record<string, number>;
  aspectRatio?: string;
  showThumbs?: boolean;
}

export default function Gallery({
  images,
  title,
  coverAlt,
  initialRatios,
  aspectRatio = "16 / 10",
  showThumbs = true,
}: GalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mountedIndices, setMountedIndices] = useState<number[]>([0]);
  const [lightbox, setLightbox] = useState(false);
  const [ratios, setRatios] = useState<Record<string, number>>(() => initialRatios ?? {});
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const galleryTriggerRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const count = images.length;

  const activateIndex = useCallback((nextIdx: number) => {
    setMountedIndices((prev) => (prev.includes(nextIdx) ? prev : [...prev, nextIdx]));
    setActiveIdx(nextIdx);
  }, []);

  const go = useCallback(
    (dir: number) => {
      setActiveIdx((current) => {
        const nextIdx = (current + dir + count) % count;
        setMountedIndices((prev) => (prev.includes(nextIdx) ? prev : [...prev, nextIdx]));
        return nextIdx;
      });
    },
    [count]
  );

  const getAltFor = useCallback(
    (idx: number) => (idx === 0 && coverAlt ? coverAlt : `${title} — фото ${idx + 1}`),
    [coverAlt, title]
  );

  // Автолистание каждые 5 секунд с паузой при наведении курсора, таче, фокусе или открытом лайтбоксе.
  // При ручном переключении слайда таймер перезапускается.
  useEffect(() => {
    if (count <= 1 || isPaused || lightbox) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = setInterval(() => {
      go(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [count, isPaused, lightbox, activeIdx, go]);

  // Лайтбокс: клавиатура, удержание фокуса и восстановление фокуса после закрытия.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab") {
        const controls = Array.from(
          lightboxRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])') || []
        );
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      lightboxRef.current?.querySelector<HTMLElement>(".lightbox-close")?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.requestAnimationFrame(() => galleryTriggerRef.current?.focus());
    };
  }, [lightbox, go]);

  // Свайп на мобильных устройствах
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        go(1);
      } else {
        go(-1);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="detail-gallery-main"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Главное окно галереи с фиксированным aspect-ratio (без прыжков высоты между слайдами) */}
      <div
        ref={galleryTriggerRef}
        className="detail-gallery-viewport"
        style={{
          aspectRatio: aspectRatio || "4 / 3",
          maxHeight: "72vh",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightbox(true)}
        role="button"
        tabIndex={0}
        aria-label="Открыть фото на весь экран"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setLightbox(true);
          }
        }}
      >
        {images.map((src, idx) => {
          const isMounted = idx === activeIdx || mountedIndices.includes(idx);
          const ratio = ratios[src] ?? initialRatios?.[src];
          return (
            <div
              key={src}
              className={`detail-gallery-slide ${idx === activeIdx ? "is-active" : ""}`}
              aria-hidden={idx !== activeIdx}
            >
              {isMounted && (
                <Image
                  src={src}
                  alt={getAltFor(idx)}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  style={{
                    objectFit: ratio && ratio < 0.72 ? "contain" : "cover",
                    objectPosition: "center",
                  }}
                  draggable={false}
                  onLoad={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.naturalWidth && target.naturalHeight) {
                      const r = +(target.naturalWidth / target.naturalHeight).toFixed(3);
                      setRatios((prev) => (prev[src] ? prev : { ...prev, [src]: r }));
                    }
                  }}
                />
              )}
            </div>
          );
        })}

        <div className="gallery-zoom-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <span>На весь экран</span>
        </div>

        {/* Стрелки переключения */}
        {count > 1 && (
          <>
            <button
              type="button"
              className="detail-gallery-arrow arrow-prev"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Предыдущее фото"
            >
              ←
            </button>
            <button
              type="button"
              className="detail-gallery-arrow arrow-next"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Следующее фото"
            >
              →
            </button>
            <span className="detail-gallery-count">
              {activeIdx + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Миниатюры для прямого выбора кадра */}
      {showThumbs && count > 1 && (
        <div className="detail-thumbs-grid">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              className={`detail-thumb-item ${idx === activeIdx ? "is-active" : ""}`}
              onClick={() => activateIndex(idx)}
              onMouseEnter={() => activateIndex(idx)}
              aria-label={`Перейти к фото ${idx + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox: полноэкранный просмотр */}
      {lightbox && (
        <div
          ref={lightboxRef}
          className="lightbox-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightbox(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Фото ${title}`}
          tabIndex={-1}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightbox(false)}
            aria-label="Закрыть"
          >
            ✕
          </button>

          <div className="lightbox-stage">
            <Image
              key={images[activeIdx]}
              src={images[activeIdx]}
              alt={getAltFor(activeIdx)}
              width={1920}
              height={1280}
              sizes="100vw"
              style={{
                maxWidth: "94vw",
                maxHeight: "88vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
              priority
            />
            <div className="lightbox-counter">
              {activeIdx + 1} / {count}
            </div>
            {count > 1 && (
              <>
                <button
                  type="button"
                  className="detail-gallery-arrow arrow-prev"
                  onClick={() => go(-1)}
                  aria-label="Предыдущее фото"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="detail-gallery-arrow arrow-next"
                  onClick={() => go(1)}
                  aria-label="Следующее фото"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
