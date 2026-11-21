import { SITE_CONFIG } from "@/data/site";

export const SITE_URL = "https://pitermebel.com";

/** Дефолтная обложка для соцсетей и мессенджеров (фирменное лого птички) */
export const OG_IMAGE = "/img/brand/og-bird.png";

export const HOME_TITLE = `${SITE_CONFIG.name} — кухни и мебель на заказ в Санкт-Петербурге`;

export const HOME_DESCRIPTION =
  "Проектируем и изготавливаем кухни, шкафы и корпусную мебель в Санкт-Петербурге с 2005 года. Договор, доставка и монтаж под ключ.";

/** Собирает уникальное описание сниппета без обрыва на предлоге или посреди фразы. */
export function buildMetaDescription(text: string, maxLength = 155) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  // Сначала пробуем закончить на границе целого предложения, если получается содержательный сниппет.
  const withinLimit = normalized.slice(0, maxLength);
  const sentenceEnds = [...withinLimit.matchAll(/[.!?](?:\s|$)/g)];
  if (sentenceEnds.length > 0) {
    const lastEnd = sentenceEnds[sentenceEnds.length - 1];
    const endIdx = (lastEnd.index ?? 0) + 1;
    if (endIdx >= 55) {
      return withinLimit.slice(0, endIdx).trim();
    }
  }

  const shortened = normalized.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");
  let trimmed = shortened.slice(0, lastSpace > 90 ? lastSpace : maxLength - 1);
  // Убираем висячие русские предлоги/союзы и знаки препинания в конце перед многоточием.
  const danglingWord =
    /(?:^|\s)(?:в|во|к|ко|с|со|у|о|об|и|а|но|или|на|по|из|от|до|за|под|при|для|без|над|про|как|что|где|чтобы|поэтому|который|которая|которое|которые)$/i;
  while (danglingWord.test(trimmed)) {
    trimmed = trimmed.replace(danglingWord, "").replace(/[,:;.!?\-\u2014\s]+$/, "");
  }
  return `${trimmed.replace(/[,:;.!?\-\u2014\s]+$/, "")}…`;
}

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
    images: [{ url: OG_IMAGE, width: 512, height: 512, alt: title, type: "image/png" }],
  };
}

/** Twitter / мессенджер-карточка страницы, чтобы не наследовались метаданные главной. */
export function buildTwitter(
  title: string,
  description: string,
  image?: { url: string; alt?: string }
) {
  return {
    card: (image ? "summary_large_image" : "summary") as "summary" | "summary_large_image",
    title,
    description,
    images: [
      image
        ? { url: image.url, alt: image.alt || title }
        : { url: OG_IMAGE, width: 512, height: 512, alt: title },
    ],
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
        ...(item.path
          ? {
              item: `${SITE_URL}${
                item.path === "/"
                  ? "/"
                  : item.path.endsWith("/")
                  ? item.path
                  : `${item.path}/`
              }`,
            }
          : {}),
      })),
    ],
  };
}
