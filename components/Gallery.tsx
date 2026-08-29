"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const currentImg = images[activeIdx] || images[0];

  const go = useCallback(
    (dir: number) => setActiveIdx((i) => (i + dir + count) % count),
    [count]
  );

  // Автолистание каждые 5 секунд, пауза при наведении и в лайтбоксе
  useEffect(() => {
    if (paused || lightbox || count <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % count);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, lightbox, count]);

  // Лайтбокс: стрелки и Esc на клавиатуре + блокировка скролла страницы
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  return (
    <div>
      {/* Main Image — фото целиком, клик открывает лайтбокс */}
      <div
        className="detail-gallery-main"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          className="detail-gallery-open"
          onClick={() => setLightbox(true)}
          aria-label="Открыть фото на весь экран"
        >
          <Image
            key={currentImg}
            src={currentImg}
            alt={`${title} — фото ${activeIdx + 1}`}
            width={1920}
            height={1280}
            priority
            sizes="(max-width: 1024px) 100vw, 640px"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "620px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </button>

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
            <span className="detail-gallery-count">
              {activeIdx + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Lightbox: просмотр на весь экран */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Фото ${title}`}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightbox(false)}
            aria-label="Закрыть"
          >
            ✕
          </button>

          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <Image
              key={currentImg}
              src={currentImg}
              alt={`${title} — фото ${activeIdx + 1}`}
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
