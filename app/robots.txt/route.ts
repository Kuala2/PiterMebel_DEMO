import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "",
    "Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid&ymclid&gclid&fbclid&etext&erid&_openstat&boost /",
    "Clean-param: category&layout&meters&material&options&step /calculator/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
