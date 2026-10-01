import { canUseAnalytics, PRIVACY_VERSION } from "@/data/legal";

export const PRIVACY_KEY = "pm_privacy_v1";
export const PRIVACY_EVENT = "pm-privacy-change";

export function isAnalyticsEnabled(): boolean {
  return false;
}

export function saveAnalyticsChoice(_analytics: boolean): boolean {
  return false;
}

export function pageAddress(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? `${url.origin}${url.pathname}` : "";
  } catch { return ""; }
}

