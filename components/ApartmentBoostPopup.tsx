"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { reachGoal } from "@/lib/seo";

const POPUP_DELAY_MS = 10_000;
const STORAGE_DISMISSED_KEY = "pm_boost_dismissed_v1";
const STORAGE_STARTED_KEY = "pm_boost_started_at_v1";

let memoryStartedAt = 0;
let memoryDismissed = false;

function getOrInitStartedAt(now: number): number {
  try {
    window.sessionStorage.removeItem(STORAGE_DISMISSED_KEY);
    const raw = Number(window.sessionStorage.getItem(STORAGE_STARTED_KEY) || "0");
    window.sessionStorage.removeItem(STORAGE_STARTED_KEY);
    if (raw > 0 && !Number.isNaN(raw) && now - raw >= 0 && now - raw < POPUP_DELAY_MS) {
      memoryStartedAt = raw;
      return raw;
    }
  } catch {
    // ignore storage errors
  }
  if (memoryStartedAt > 0 && now - memoryStartedAt >= 0) {
    return memoryStartedAt;
  }
  memoryStartedAt = now;
  return now;
}

export default function ApartmentBoostPopup() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isOnBoostPage =
    (pathname?.startsWith("/apartment") || pathname?.startsWith("/boost")) ?? false;

  const dismissPopup = useCallback((goalName?: string) => {
    memoryDismissed = true;
    if (goalName) reachGoal(goalName);
    setIsClosing(true);
    window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 260);
  }, []);

  useEffect(() => {
    if (isOnBoostPage) {
      setIsClosing(false);
      setIsVisible(false);
      return;
    }

    let forceBoost = false;
    try {
      const params = new URLSearchParams(window.location.search);
      forceBoost = params.get("boost") === "1";
    } catch {
      forceBoost = false;
    }

    if (forceBoost) {
      memoryDismissed = false;
    }

    if (memoryDismissed) {
      return;
    }

    const now = Date.now();
    const startedAt = getOrInitStartedAt(now);
    const elapsed = Math.max(0, now - startedAt);
    const remaining = forceBoost ? 150 : Math.max(0, POPUP_DELAY_MS - elapsed);

    const timerId = window.setTimeout(() => {
      if (memoryDismissed) return;
      setIsClosing(false);
      setIsVisible(true);
      reachGoal("boost_popup_show");
    }, remaining);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [pathname, isOnBoostPage]);

  useEffect(() => {
    if (!isVisible || isOnBoostPage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissPopup("boost_popup_close");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVisible, isOnBoostPage, dismissPopup]);

  if (!isVisible || isOnBoostPage) return null;

  return (
    <aside
      className={`boost-popup ${isClosing ? "is-closing" : ""}`}
      aria-label="Комплексная меблировка квартиры"
    >
      <button
        type="button"
        className="boost-popup-close"
        onClick={() => dismissPopup("boost_popup_close")}
        aria-label="Закрыть подсказку"
        title="Закрыть"
      >
        ✕
      </button>

      <div className="boost-popup-body">
        <p className="boost-popup-title">
          Купили квартиру или готовите её к сдаче?
        </p>

        <div className="boost-popup-actions">
          <Link
            href="/apartment/"
            className="btn btn-glass boost-popup-cta"
            onClick={() => reachGoal("boost_popup_click")}
          >
            Подробнее →
          </Link>
        </div>
      </div>
    </aside>
  );
}
