"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { getMetrika, METRIKA_ID, reachGoal, stopMetrika } from "@/lib/metrika";
import { clearAnalyticsStorage, hasAnalyticsConsent, PRIVACY_EVENT } from "@/lib/privacy";
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
  const [allowed, setAllowed] = useState(false);
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const consent = hasAnalyticsConsent();
      if (!consent) {
        stopMetrika();
        previousUrl.current = null;
        try { clearAnalyticsStorage(); } catch { /* Storage may be disabled. */ }
      }
      setAllowed(consent);
    };
    sync();
    window.addEventListener(PRIVACY_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    const expiryCheck = window.setInterval(sync, 60_000);
    return () => {
      window.removeEventListener(PRIVACY_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.clearInterval(expiryCheck);
    };
  }, []);

  useEffect(() => {
    if (!allowed) return;
    // Wait for the navigation commit, including the page-specific document title.
    const frame = requestAnimationFrame(() => {
      const url = `${window.location.origin}${pathname}`;
      if (previousUrl.current === url) return;
      getMetrika()?.(METRIKA_ID, "hit", url, {
        title: document.title,
        referer: previousUrl.current ?? "",
      });
      previousUrl.current = url;
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, allowed]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const goal = CONTACT_GOALS.get(link?.getAttribute("href") ?? "");
      if (goal) reachGoal(goal);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!allowed) return null;
  return (
    <Script
      id="yandex-metrika"
      src={`https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`}
      strategy="lazyOnload"
    />
  );
}
