import { KNOWLEDGE_ARTICLES } from "@/data/knowledge";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function GET() {
  const items = KNOWLEDGE_ARTICLES.map(
    (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/knowledge/${article.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/knowledge/${article.slug}/</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedAtISO).toUTCString()}</pubDate>
      <category>${escapeXml(article.categoryLabel)}</category>
      <author>${escapeXml(article.author.name)}</author>
    </item>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>База знаний «ПитерМебель»</title>
    <link>${SITE_URL}/knowledge/</link>
    <description>Инженерные руководства от технологов мебельного производства в СПб</description>
    <language>ru</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
