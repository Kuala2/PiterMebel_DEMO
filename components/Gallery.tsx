"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Автолистание каждые 5 секунд, пауза при наведении
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  if (!images || images.length === 0) return null;

  const currentImg = images[activeIdx] || images[0];

  return (
    <div
      className="detail-gallery-main"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Фото от края до края, целиком — высота по пропорции кадра,
          экстремально вертикальные кадры мягко подрезаются снизу/сверху до 85vh */}
      <Image
        key={currentImg}
        src={currentImg}
        alt={`${title} — фото ${activeIdx + 1}`}
        width={1920}
        height={1280}
        priority
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "85vh",
          objectFit: "cover",
          display: "block",
        }}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="detail-gallery-arrow arrow-prev"
            onClick={() => setActiveIdx((activeIdx - 1 + images.length) % images.length)}
            aria-label="Предыдущее фото"
          >
            ←
          </button>
          <button
            type="button"
            className="detail-gallery-arrow arrow-next"
            onClick={() => setActiveIdx((activeIdx + 1) % images.length)}
            aria-label="Следующее фото"
          >
            →
          </button>
          <span className="detail-gallery-count">
            {activeIdx + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
