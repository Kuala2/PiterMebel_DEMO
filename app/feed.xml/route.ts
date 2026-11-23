import { KNOWLEDGE_ARTICLES } from "@/data/knowledge";
import { SITE_CONFIG } from "@/data/site";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function GET() {
  const timestamps = KNOWLEDGE_ARTICLES.map((a) =>
    new Date(a.updatedAtISO || a.publishedAtISO).getTime()
  );
  const lastBuildDate =
    timestamps.length > 0
      ? new Date(Math.max(...timestamps)).toUTCString()
      : new Date("2026-11-23T00:00:00Z").toUTCString();

  const items = KNOWLEDGE_ARTICLES.map(
    (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/knowledge/${article.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/knowledge/${article.slug}/</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedAtISO).toUTCString()}</pubDate>
      <category>${escapeXml(article.categoryLabel)}</category>
      <author>${escapeXml(SITE_CONFIG.email)} (${escapeXml(article.author.name)})</author>
    </item>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>База знаний «ПитерМебель»</title>
    <link>${SITE_URL}/knowledge/</link>
    <description>Практические материалы о проектировании и подготовке мебели на заказ в Санкт-Петербурге</description>
    <language>ru</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
