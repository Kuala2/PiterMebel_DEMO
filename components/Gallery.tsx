"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const currentImg = images[activeIdx] || images[0];

  return (
    <div>
      {/* Main Image */}
      <div className="detail-gallery-main">
        <Image
          src={currentImg}
          alt={`${title} — ракурс ${activeIdx + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 680px"
          style={{ objectFit: "cover", objectPosition: "center 50%" }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="detail-thumbs-grid">
          {images.map((img, idx) => (
            <div
              key={img + idx}
              className="detail-thumb-item"
              onClick={() => setActiveIdx(idx)}
              style={{
                cursor: "pointer",
                borderColor: activeIdx === idx ? "var(--color-green-brand)" : undefined,
                opacity: activeIdx === idx ? 1 : 0.75,
                transition: "all 0.2s ease",
              }}
            >
              <Image
                src={img}
                alt={`${title} — миниатюра ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 160px"
                style={{ objectFit: "cover", objectPosition: "center 50%" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
