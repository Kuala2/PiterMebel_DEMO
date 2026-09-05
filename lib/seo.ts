import { SITE_CONFIG } from "@/data/site";

export const SITE_URL = "https://pitermebel.com";

/** Дефолтная обложка для соцсетей и мессенджеров (1200×630) */
export const OG_IMAGE = "/img/brand/og-cover.jpg";

export const HOME_TITLE = `${SITE_CONFIG.name} — Индивидуальные кухни и мебель на заказ в СПб | Собственное производство`;

export const HOME_DESCRIPTION =
  "Производство кухонь, гардеробных и корпусной мебели на заказ в Санкт-Петербурге. Собственный цех с 2005 года на Петергофском шоссе, 73. Офис: пл. Стачек, 9, офис 407 (по предварительной записи). Консультация и предварительный расчет.";

/**
 * Единый openGraph-блок для страниц сайта.
 * Next не мерджит openGraph глубоко, поэтому каждая страница задаёт его целиком.
 */
export function buildOg(title: string, description: string, path?: string) {
  return {
    title,
    description,
    siteName: SITE_CONFIG.name,
    locale: "ru_RU",
    type: "website" as const,
    url: path ? `${SITE_URL}${path}/` : SITE_URL,
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
