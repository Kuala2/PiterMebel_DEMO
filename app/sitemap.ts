import type { MetadataRoute } from "next";
import { KITCHENS } from "@/data/kitchens";
import { SERVICE_PAGES } from "@/data/services";
import { KNOWLEDGE_ARTICLES } from "@/data/knowledge";
import { LEGAL_VERSION, PRIVACY_VERSION } from "@/data/legal";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const CATALOG_UPDATED_AT = new Date("2026-11-23");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly";
    lastModified: Date;
    images?: string[];
  }[] = [
    {
      path: "",
      priority: 1,
      changeFrequency: "weekly",
      lastModified: CATALOG_UPDATED_AT,
      images: [`${SITE_URL}/img/hero/photo_hero_upscaled.webp`],
    },
    { path: "/kitchens", priority: 0.9, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/wardrobes", priority: 0.9, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/custom-furniture", priority: 0.9, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    {
      path: "/apartment",
      priority: 0.85,
      changeFrequency: "monthly",
      lastModified: CATALOG_UPDATED_AT,
      images: [`${SITE_URL}/video/studio-apartment-poster.jpg`],
    },
    {
      path: "/production",
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: CATALOG_UPDATED_AT,
      images: [
        `${SITE_URL}/img/production/panel-cutting.webp`,
        `${SITE_URL}/img/production/edge-banding.webp`,
        `${SITE_URL}/img/production/line-boring.webp`,
      ],
    },
    { path: "/calculator", priority: 0.7, changeFrequency: "monthly", lastModified: CATALOG_UPDATED_AT },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/contacts", priority: 0.7, changeFrequency: "monthly", lastModified: CATALOG_UPDATED_AT },
    { path: "/knowledge", priority: 0.8, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/design", priority: 0.7, changeFrequency: "monthly", lastModified: CATALOG_UPDATED_AT },
    { path: "/privacy", priority: 0.2, changeFrequency: "monthly", lastModified: new Date(PRIVACY_VERSION) },
    { path: "/consent", priority: 0.2, changeFrequency: "monthly", lastModified: new Date(LEGAL_VERSION) },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page.path}/`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(page.images?.length ? { images: page.images } : {}),
    })),
    ...SERVICE_PAGES.map((service) => {
      const photos = service.gallery.length
        ? service.gallery
        : service.cover
          ? [service.cover]
          : [];
      return {
        url: `${SITE_URL}${service.href}`,
        lastModified: CATALOG_UPDATED_AT,
        changeFrequency: "weekly" as const,
        priority: 0.85,
        ...(photos.length ? { images: photos.map((p) => `${SITE_URL}${p}`) } : {}),
      };
    }),
    ...KITCHENS.map((kitchen) => {
      const photos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];
      return {
        url: `${SITE_URL}/kitchens/${kitchen.slug}/`,
        lastModified: CATALOG_UPDATED_AT,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        images: photos.map((p) => `${SITE_URL}${p}`),
      };
    }),
    ...KNOWLEDGE_ARTICLES.map((article) => {
      const imgs = [
        article.placeholderImage || "/img/knowledge/kitchen_sockets_plan.jpg",
        ...(article.caseStudy?.image ? [article.caseStudy.image] : []),
      ];
      return {
        url: `${SITE_URL}/knowledge/${article.slug}/`,
        lastModified: new Date(article.updatedAtISO || article.publishedAtISO),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        images: imgs.map((p) => `${SITE_URL}${p}`),
      };
    }),
  ];
}
