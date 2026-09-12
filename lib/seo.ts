import { SITE_CONFIG } from "@/data/site";

export const SITE_URL = "https://pitermebel.com";

/** Дефолтная обложка для соцсетей и мессенджеров (1200×630) */
export const OG_IMAGE = "/img/brand/og-cover.jpg";

/** ID счётчика Яндекс.Метрики */
export const METRIKA_ID = 112318484;

/**
 * Отправка цели в Метрику (цель в интерфейсе Метрики должна иметь
 * тип «JavaScript-событие» с таким же идентификатором).
 */
export function reachGoal(goal: string) {
  if (typeof window === "undefined") return;
  const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
  ym?.(METRIKA_ID, "reachGoal", goal);
}

export const HOME_TITLE = `${SITE_CONFIG.name} — кухни и мебель на заказ в Санкт-Петербурге`;

export const HOME_DESCRIPTION =
  "Проектируем и изготавливаем кухни, шкафы и корпусную мебель в Санкт-Петербурге с 2005 года. Договор, доставка и монтаж под ключ.";

/**
 * Единый openGraph-блок для страниц сайта.
 * Next не мерджит openGraph глубоко, поэтому каждая страница задаёт его целиком.
 */
export function buildOg(title: string, description: string, path?: string) {
  let cleanPath = "";
  if (path && path !== "/") {
    cleanPath = path.endsWith("/") ? path : `${path}/`;
  }
  return {
    title,
    description,
    siteName: SITE_CONFIG.name,
    locale: "ru_RU",
    type: "website" as const,
    url: cleanPath ? `${SITE_URL}${cleanPath}` : `${SITE_URL}/`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
  };
}

/** Хлебные крошки для BreadcrumbList JSON-LD */
export function buildBreadcrumbs(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.name,
        ...(item.path ? { item: `${SITE_URL}${item.path}/` } : {}),
      })),
    ],
  };
}
