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
  if (typeof window === "undefined") return;
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
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }
  return target.ym;
}

/** The matching JavaScript-event goal must also exist in the Metrica account. */
export function reachGoal(goal: string) {
  getMetrika()?.(METRIKA_ID, "reachGoal", goal);
}
