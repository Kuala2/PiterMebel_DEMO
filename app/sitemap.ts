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
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/kitchens", priority: 0.9, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/wardrobes", priority: 0.9, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/custom-furniture", priority: 0.9, changeFrequency: "weekly", lastModified: CATALOG_UPDATED_AT },
    { path: "/apartment", priority: 0.85, changeFrequency: "monthly", lastModified: CATALOG_UPDATED_AT },
    { path: "/production", priority: 0.7, changeFrequency: "monthly", lastModified: CATALOG_UPDATED_AT },
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
    })),
    ...SERVICE_PAGES.map((service) => ({
      url: `${SITE_URL}${service.href}`,
      lastModified: CATALOG_UPDATED_AT,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...KITCHENS.map((kitchen) => ({
      url: `${SITE_URL}/kitchens/${kitchen.slug}/`,
      lastModified: CATALOG_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...KNOWLEDGE_ARTICLES.map((article) => ({
      url: `${SITE_URL}/knowledge/${article.slug}/`,
      lastModified: new Date(article.updatedAtISO || article.publishedAtISO),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
