import type { MetadataRoute } from "next";
import { KITCHENS } from "@/data/kitchens";
import { PROJECTS } from "@/data/projects";
import { KNOWLEDGE_ARTICLES } from "@/data/knowledge";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/kitchens", priority: 0.9, changeFrequency: "weekly" },
    { path: "/wardrobes", priority: 0.8, changeFrequency: "weekly" },
    { path: "/custom-furniture", priority: 0.8, changeFrequency: "weekly" },
    { path: "/production", priority: 0.7, changeFrequency: "monthly" },
    { path: "/calculator", priority: 0.7, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contacts", priority: 0.7, changeFrequency: "monthly" },
    { path: "/knowledge", priority: 0.8, changeFrequency: "weekly" },
    { path: "/design", priority: 0.7, changeFrequency: "monthly" },
    { path: "/apartment", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "monthly" },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page.path}/`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...KITCHENS.map((kitchen) => ({
      url: `${SITE_URL}/kitchens/${kitchen.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...KNOWLEDGE_ARTICLES.map((article) => ({
      url: `${SITE_URL}/knowledge/${article.slug}/`,
      lastModified: new Date(article.updatedAtISO || article.publishedAtISO),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
