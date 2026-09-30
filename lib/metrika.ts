import { isAnalyticsEnabled } from "@/lib/privacy";

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
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
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
  // Preserve the queue object: the loaded SDK wraps its push() to dispatch commands.
  // Replacing it with [] breaks init/hit after destruct. Splice also drops pending events.
  target.ym?.a?.splice(0);
  target.piterMetrikaInitialized = false;
}

/** The matching JavaScript-event goal must also exist in the Metrica account. */
export function reachGoal(goal: string) {
  getMetrika()?.(METRIKA_ID, "reachGoal", goal);
}
