"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_CONFIG } from "@/data/site";

declare global {
  interface Window {
    ymaps?: any;
  }
}

export default function YandexOfficeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapTargetRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Автоматический запуск загрузки при приближении скролла к карте
  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldLoad) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [shouldLoad]);

  // Загрузка и инициализация API Яндекс.Карт
  useEffect(() => {
    if (!shouldLoad) return;
    let isMounted = true;
    let scriptLoadedHandler: (() => void) | null = null;
    let targetScript: HTMLElement | null = null;

    function initMap() {
      if (!window.ymaps || !mapTargetRef.current || mapInstanceRef.current) return;

      window.ymaps.ready(() => {
        if (!isMounted || !mapTargetRef.current || mapInstanceRef.current) return;

        try {
          const map = new window.ymaps.Map(
            mapTargetRef.current,
            {
              center: [59.9002, 30.2740],
              zoom: 16,
              controls: ["zoomControl"],
            },
            {
              suppressMapOpenBlock: true,
            }
          );

          map.behaviors.disable("scrollZoom");

          const placemark = new window.ymaps.Placemark(
            [59.899907, 30.272883],
            {
              hintContent: "Студия мебели «ПитерМебель» · пл. Стачек, 9, оф. 407, 4 этаж",
              iconCaption: "ПитерМебель",
            },
            {
              preset: "islands#redDotIconWithCaption",
            }
          );

          placemark.events.add("click", () => {
            window.open(SITE_CONFIG.yandexMapsUrl, "_blank", "noopener,noreferrer");
          });

          map.geoObjects.add(placemark);
          mapInstanceRef.current = map;
          if (isMounted) {
            setIsMapReady(true);
          }
        } catch {
          if (isMounted) {
            setLoadError(true);
            setIsMapReady(true);
          }
        }
      });
    }

    if (window.ymaps) {
      initMap();
    } else {
      const existingScript = document.getElementById("yandex-maps-api");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "yandex-maps-api";
        script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
        script.async = true;
        script.onload = () => {
          if (isMounted) initMap();
        };
        script.onerror = () => {
          if (isMounted) {
            setLoadError(true);
            setIsMapReady(true);
          }
        };
        document.head.appendChild(script);
      } else {
        targetScript = existingScript;
        scriptLoadedHandler = initMap;
        existingScript.addEventListener("load", scriptLoadedHandler);
      }
    }

    return () => {
      isMounted = false;
      if (scriptLoadedHandler && targetScript) {
        targetScript.removeEventListener("load", scriptLoadedHandler);
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      data-sticky-cta-suppress
      style={{
        width: "100%",
        height: "100%",
        minHeight: "420px",
        backgroundColor: "#16191F",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Изолированный контейнер исключительно для скрипта Яндекс.Карт */}
      <div
        ref={mapTargetRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
      />

      {/* Сообщение об ошибке загрузки (например, при блокировщиках рекламы uBlock/AdBlock) */}
      {loadError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#181B20",
            color: "rgba(255, 255, 255, 0.85)",
            zIndex: 2,
          }}
        >
          <p style={{ margin: 0, fontSize: "15px", maxWidth: "360px", lineHeight: "1.5" }}>
            Интерактивная карта временно недоступна или заблокирована расширением браузера.
          </p>
          <a
            href={SITE_CONFIG.yandexMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-green"
            style={{ fontSize: "14px", padding: "10px 20px", textDecoration: "none" }}
          >
            Открыть на Яндекс Картах ↗
          </a>
        </div>
      )}

      {/* Заглушка загрузки, управляемая React (не конфликтует с DOM карты) */}
      {!isMapReady && !loadError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "14px",
            backgroundColor: "#181B20",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "2px solid rgba(255, 255, 255, 0.15)",
              borderTopColor: "var(--color-primary-green, #9AE600)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span>Загрузка карты…</span>
        </div>
      )}
    </div>
  );
}
