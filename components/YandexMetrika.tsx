"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { getMetrika, METRIKA_ID, reachGoal } from "@/lib/metrika";
import { SITE_CONFIG } from "@/data/site";

const CONTACT_GOALS = new Map([
  [`tel:${SITE_CONFIG.phoneRaw}`, "contact_phone"],
  [`mailto:${SITE_CONFIG.email}`, "contact_email"],
  [SITE_CONFIG.vkImUrl, "contact_vk"],
  [SITE_CONFIG.telegramUrl, "contact_telegram"],
  [SITE_CONFIG.whatsappUrl, "contact_whatsapp"],
  [SITE_CONFIG.maxUrl, "contact_max"],
]);

export default function YandexMetrika() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    // Wait for the navigation commit, including the page-specific document title.
    const frame = requestAnimationFrame(() => {
      const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
      if (previousUrl.current === url) return;
      getMetrika()?.(METRIKA_ID, "hit", url, {
        title: document.title,
        referer: previousUrl.current ?? document.referrer,
      });
      previousUrl.current = url;
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, query]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const goal = CONTACT_GOALS.get(link?.getAttribute("href") ?? "");
      if (goal) reachGoal(goal);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <Script
      id="yandex-metrika"
      src={`https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`}
      strategy="lazyOnload"
    />
  );
}
