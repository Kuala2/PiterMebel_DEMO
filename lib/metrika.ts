import { hasAnalyticsConsent } from "@/lib/privacy";

export const METRIKA_ID = 112318484;

type MetrikaFunction = ((...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

type MetrikaWindow = Window & {
  ym?: MetrikaFunction;
  piterMetrikaInitialized?: boolean;
};

/** Queue init, pageviews and goals in order, even before the external tag loads. */
export function getMetrika() {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  const target = window as MetrikaWindow;
  if (!target.ym) {
    const queued: MetrikaFunction = (...args) => {
      (queued.a ??= []).push(args);
    };
    queued.l = Date.now();
    target.ym = queued;
  }
  if (!target.piterMetrikaInitialized) {
    target.piterMetrikaInitialized = true;
    target.ym(METRIKA_ID, "init", {
      defer: true,
      ssr: true,
      webvisor: false,
      clickmap: false,
      accurateTrackBounce: true,
      trackLinks: true,
      url: `${window.location.origin}${window.location.pathname}${window.location.search || ""}`,
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",
    });
  }
  return target.ym;
}

export function stopMetrika() {
  if (typeof window === "undefined") return;
  const target = window as MetrikaWindow;
  if (target.piterMetrikaInitialized) target.ym?.(METRIKA_ID, "destruct");
  // Drop unsent events from a script that has not loaded yet.
  if (target.ym?.a) target.ym.a = [];
  target.piterMetrikaInitialized = false;
}

/** The matching JavaScript-event goal must also exist in the Metrica account. */
export function reachGoal(goal: string) {
  getMetrika()?.(METRIKA_ID, "reachGoal", goal);
}
