import { canUseAnalytics, LEGAL_VERSION } from "@/data/legal";

export const PRIVACY_KEY = "pm_privacy_v1";
export const PRIVACY_EVENT = "pm-privacy-change";
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export function hasAnalyticsConsent(): boolean {
  if (!canUseAnalytics || typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(PRIVACY_KEY);
    if (!raw) return true;
    const value = JSON.parse(raw);
    if (!value || typeof value.analytics !== "boolean") return true;
    if (typeof value.at !== "number" || !Number.isFinite(value.at) || Date.now() - value.at > CONSENT_MAX_AGE) return true;
    return value.analytics;
  } catch { return true; }
}

export function saveAnalyticsChoice(analytics: boolean): boolean {
  try {
    window.localStorage.setItem(PRIVACY_KEY, JSON.stringify({ analytics: analytics && canUseAnalytics, version: LEGAL_VERSION, at: Date.now() }));
    window.dispatchEvent(new Event(PRIVACY_EVENT));
    return true;
  } catch { return false; }
}

// The counter is destroyed before this cleanup; third-party cookies remain under the browser's control.
export function clearAnalyticsStorage() {
  for (const key of Object.keys(window.localStorage)) {
    if (key.startsWith("_ym")) window.localStorage.removeItem(key);
  }
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ym")) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    const parts = window.location.hostname.split(".");
    for (let i = 0; i < parts.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join(".")}`;
    }
  }
}

export function pageAddress(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? `${url.origin}${url.pathname}` : "";
  } catch { return ""; }
}
