import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Явно разрешаем поисковых и AI-краулеров (GEO: ChatGPT, Perplexity, AI Overviews)
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "YandexBot",
  "YandexImages",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
      },
    ],
    sitemap: "https://pitermebel.com/sitemap.xml",
  };
}
