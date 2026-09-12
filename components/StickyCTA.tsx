"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/data/site";

/** Фиксированная панель действий на мобильных: позвонить + консультация. */
export default function StickyCTA() {
  const pathname = usePathname();
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const form = document.querySelector("#measure-form");
    if (!form) {
      setIsFormVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsFormVisible(entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, [pathname]);

  // Не перекрываем калькулятор и поля формы на телефоне.
  if (pathname.startsWith("/calculator") || isFormVisible) return null;

  return (
    <div className="sticky-cta">
      <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="btn btn-green">
        Позвонить
      </a>
      <Link href="/contacts#measure" className="btn btn-glass">
        Консультация
      </Link>
    </div>
  );
}
