import { canUseAnalytics, PRIVACY_VERSION } from "@/data/legal";

export const PRIVACY_KEY = "pm_privacy_v1";
export const PRIVACY_EVENT = "pm-privacy-change";
// Keep an explicit choice for this page even if the browser cannot persist it.
let temporaryChoice: boolean | undefined;

// This is the enabled state of an opt-out model, not proof of explicit consent.
export function isAnalyticsEnabled(): boolean {
  if (!canUseAnalytics || typeof window === "undefined") return false;
  if (temporaryChoice !== undefined) return temporaryChoice;
  try {
    const raw = window.localStorage.getItem(PRIVACY_KEY);
    if (!raw) return true;
    const value = JSON.parse(raw);
    if (!value || typeof value.analytics !== "boolean") return true;
    return value.analytics;
  } catch { return true; }
}

export function saveAnalyticsChoice(analytics: boolean): boolean {
  if (typeof window === "undefined") return false;
  temporaryChoice = analytics && canUseAnalytics;
  let persisted = false;
  try {
    window.localStorage.setItem(PRIVACY_KEY, JSON.stringify({ analytics: temporaryChoice, version: PRIVACY_VERSION, at: Date.now() }));
    temporaryChoice = undefined;
    persisted = true;
  } catch { /* Apply the choice immediately even when persistence fails. */ }
  window.dispatchEvent(new Event(PRIVACY_EVENT));
  return persisted;
}

// The counter is destroyed before this cleanup; third-party cookies remain under the browser's control.
export function clearAnalyticsStorage() {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("_ym")) window.localStorage.removeItem(key);
    }
  } catch { /* Cookie cleanup should still run if localStorage is unavailable. */ }
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
