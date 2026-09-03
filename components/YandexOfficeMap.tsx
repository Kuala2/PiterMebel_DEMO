"use client";

import { useEffect, useRef } from "react";
import { SITE_CONFIG } from "@/data/site";

declare global {
  interface Window {
    ymaps?: any;
  }
}

export default function YandexOfficeMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#16191F",
      }}
    />
  );
}
