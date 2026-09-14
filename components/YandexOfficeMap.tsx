"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_CONFIG } from "@/data/site";

declare global {
  interface Window {
    ymaps?: any;
  }
}

export default function YandexOfficeMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || shouldLoad) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    let isMounted = true;

    function initMap() {
      if (!window.ymaps || !mapContainerRef.current || mapInstanceRef.current) return;

      window.ymaps.ready(() => {
        if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

        // Clean container in case of re-renders
        mapContainerRef.current.innerHTML = "";

        const map = new window.ymaps.Map(
          mapContainerRef.current,
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
            hintContent: "Студия мебели «ПитерМебель» · пл. Стачек, 9, 4 этаж",
            iconCaption: "Питермебель",
          },
          {
            preset: "islands#redDotIconWithCaption",
          }
        );

        // Clicking placemark opens the exact Yandex Maps organization page
        placemark.events.add("click", () => {
          window.open(SITE_CONFIG.yandexMapsUrl, "_blank", "noopener,noreferrer");
        });

        map.geoObjects.add(placemark);
        mapInstanceRef.current = map;
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
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", initMap);
      }
    }

    return () => {
      isMounted = false;
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
      ref={mapContainerRef}
      data-sticky-cta-suppress
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#16191F",
        display: "grid",
        placeItems: "center",
      }}
    >
      {!shouldLoad && (
        <button type="button" className="btn btn-glass" onClick={() => setShouldLoad(true)}>
          Показать интерактивную карту
        </button>
      )}
    </div>
  );
}
