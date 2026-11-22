"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SpotlightArea from "@/components/SpotlightArea";
import type { ServicePageData } from "@/data/services";

interface DirectionHubGridProps {
  services: ServicePageData[];
}

export default function DirectionHubGrid({ services }: DirectionHubGridProps) {
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  const preloadCardPhotos = (urls: string[]) => {
    if (typeof window === "undefined") return;
    for (const url of urls) {
      if (!url || preloadedUrlsRef.current.has(url)) continue;
      preloadedUrlsRef.current.add(url);
      const img = new window.Image();
      img.decoding = "async";
      img.src = url;
    }
  };

  return (
    <SpotlightArea className="projects-grid" selector=".catalog-card">
      {services.map((service, idx) => {
        const photos =
          service.gallery.length > 0
            ? service.gallery.slice(0, 5)
            : service.cover
              ? [service.cover]
              : [];
        const currentIdx = cardPhoto[service.slug] ?? 0;
        const isPriority = idx < 3 && currentIdx === 0;

        return (
          <div
            key={service.slug}
            className="catalog-card project-card-item spotlight-target direction-hub-card"
            onMouseEnter={() => preloadCardPhotos(photos)}
            onTouchStart={() => preloadCardPhotos(photos)}
          >
            <div className="card-gallery-wrap">
              {photos.length > 0 ? (
                <>
                  <Image
                    src={photos[currentIdx] || photos[0]}
                    alt={
                      currentIdx === 0
                        ? service.coverAlt || service.shortTitle
                        : `${service.shortTitle} — фото ${currentIdx + 1}`
                    }
                    fill
                    priority={isPriority}
                    loading={isPriority ? undefined : currentIdx > 0 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="card-img-slide is-active"
                  />

                  {photos.length > 1 && (
                    <button
                      type="button"
                      className="card-photo-arrow arrow-prev"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCardPhoto((prev) => ({
                          ...prev,
                          [service.slug]:
                            currentIdx === 0
                              ? photos.length - 1
                              : currentIdx - 1,
                        }));
                      }}
                      aria-label="Предыдущее фото"
                    >
                      ←
                    </button>
                  )}

                  {photos.length > 1 && (
                    <button
                      type="button"
                      className="card-photo-arrow arrow-next"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCardPhoto((prev) => ({
                          ...prev,
                          [service.slug]: (currentIdx + 1) % photos.length,
                        }));
                      }}
                      aria-label="Следующее фото"
                    >
                      →
                    </button>
                  )}

                  {photos.length > 1 && (
                    <div className="card-photo-dots">
                      {photos.map((_, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          className={`photo-square-dot ${
                            currentIdx === pIdx ? "is-active" : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardPhoto((prev) => ({
                              ...prev,
                              [service.slug]: pIdx,
                            }));
                          }}
                          aria-label={`Фото ${pIdx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="direction-card-placeholder">
                  <span className="direction-card-placeholder-num">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="direction-card-placeholder-label">
                    Фото работ добавляются
                  </span>
                </div>
              )}

              <Link
                href={service.href}
                style={{ position: "absolute", inset: 0, zIndex: 2 }}
                aria-label={`Открыть направление: ${service.shortTitle}`}
              />
            </div>

            <Link
              href={service.href}
              className="card-body"
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <h2 className="card-title">{service.shortTitle}</h2>
              <p className="direction-card-desc">{service.cardDesc}</p>

              <div className="card-footer-row">
                <span className="card-view-btn">Подробнее о направлении →</span>
              </div>
            </Link>
          </div>
        );
      })}
    </SpotlightArea>
  );
}
