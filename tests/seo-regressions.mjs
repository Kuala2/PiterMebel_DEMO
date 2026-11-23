import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

function load(file, globals) {
  const js = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = vm.createContext({ exports: {}, require: (id) => {
    if (id === "@/data/legal") return { canReceiveLeads: true, canUseAnalytics: true, LEGAL_VERSION: "2026-09-27" };
    if (id === "@/lib/privacy") return { isAnalyticsEnabled: () => true, pageAddress: (url) => url.split(/[?#]/)[0] };
    throw new Error(id);
  }, ...globals });
  vm.runInContext(js, context, { filename: file });
  return context.exports;
}


function form(bot = false) {
  const data = new FormData();
  data.set("contact", "+7 000 000 00 00");
  data.set("category", "Консультация");
  data.set("consent", "on");
  data.set("consent_version", "2026-09-27");
  if (bot) data.set("website", "https://spam.example");
  return data;
}

function submitter(fetch, key = "/api/leads") {
  return load("app/actions/measure.ts", {
    window: { setTimeout, clearTimeout }, fetch, FormData, AbortController,
    process: { env: { NEXT_PUBLIC_LEAD_ENDPOINT: key } },
  }).submitMeasureRequest;
}

test("Honeypot is not delivered and cannot count as a lead", async () => {
  const submit = submitter(() => assert.fail("Honeypot must not send a request"));
  const result = await submit({}, form(true));
  assert.equal(result.success, false);
  assert.notEqual(result.deliveryAccepted, true);
});

test("Unconfigured and invalid forms do not count as leads", async () => {
  const submit = submitter(() => assert.fail("No delivery expected"), "");
  const missingKey = await submit({}, form());
  assert.equal(missingKey.success, false);
  assert.notEqual(missingKey.deliveryAccepted, true);
  const invalid = form();
  invalid.delete("consent");
  assert.equal((await submit({}, invalid)).success, false);
});

test("Only a successful delivery response counts as a lead", async () => {
  for (const [ok, accepted] of [[true, true], [true, false], [false, true]]) {
    let requests = 0;
    const submit = submitter(async (_url, options) => {
      requests++;
      assert.equal(options.method, "POST");
      return { ok, json: async () => ({ success: accepted }) };
    });
    const result = await submit({}, form());
    assert.equal(result.success, ok && accepted);
    assert.equal(Boolean(result.deliveryAccepted), ok && accepted);
    assert.equal(requests, 1);
  }
});

test("Network and malformed-response failures do not count as leads", async () => {
  for (const fetch of [
    async () => { throw new Error("offline"); },
    async () => ({ ok: true, json: async () => { throw new Error("invalid JSON"); } }),
  ]) {
    const result = await submitter(fetch)({}, form());
    assert.equal(result.success, false);
    assert.notEqual(result.deliveryAccepted, true);
  }
});

test("Client reviews dataset stays factual, complete, and linked to Yandex Maps", () => {
  const reviewsModule = load("data/reviews.ts", {});
  const reviews = reviewsModule.CLIENT_REVIEWS;
  assert.equal(reviewsModule.YANDEX_REVIEWS_URL, "https://yandex.ru/maps/org/pitermebel/245406542043/reviews/");
  assert.equal(reviews.length, 8);
  const ids = new Set();
  for (const review of reviews) {
    assert.ok(review.id && !ids.has(review.id));
    ids.add(review.id);
    assert.ok(review.author.trim().length > 0);
    assert.equal(review.rating, 5);
    assert.ok(Array.isArray(review.lines) && review.lines.length > 0);
    assert.ok(review.lines.every((line) => line.trim().length > 0));
    assert.match(review.sourceUrl, /^https:\/\/yandex\.ru\/maps\/org\/(pitermebel\/)?245406542043\/reviews/);
  }
});

test("Homepage reviews use semantic HTML without self-serving or cherry-picked AggregateRating JSON-LD", () => {
  const layoutSource = readFileSync("app/layout.tsx", "utf8");
  const homeLayoutSource = readFileSync("app/(home)/layout.tsx", "utf8");
  const homeSource = readFileSync("app/(home)/page.tsx", "utf8");
  for (const source of [layoutSource, homeLayoutSource, homeSource]) {
    assert.equal(/AggregateRating|aggregateRating|reviewRating|reviewBody|itemReviewed|"@type":\s*"Review"/.test(source), false);
  }
  assert.match(layoutSource, /sameAs:\s*\[SITE_CONFIG\.vkUrl,\s*SITE_CONFIG\.yandexMapsUrl\]/);
  assert.match(homeSource, /id="reviews"\s+aria-labelledby="reviews-heading"/);
  assert.match(homeSource, /<article[\s\S]*?className="review-card"/);
  assert.match(homeSource, /<blockquote[^>]*className="review-text"[^>]*cite=\{review\.sourceUrl\}/);
  assert.match(homeSource, /role="img"\s+aria-label=\{`Оценка \$\{review\.rating\} из 5`\}/);
  assert.match(homeSource, /<span aria-hidden="true">\{stars\}<\/span>/);
  assert.match(homeSource, /aria-hidden=\{isDuplicate \? "true" : undefined\}/);
  assert.match(homeSource, /viewport\.scrollLeft\s*=\s*0/);

  if (existsSync("out/index.html")) {
    const html = readFileSync("out/index.html", "utf8");
    const reviewsStart = html.indexOf('id="reviews"');
    const manifestoStart = html.indexOf('id="manifesto"');
    assert.ok(reviewsStart !== -1 && manifestoStart > reviewsStart);
    const reviewsHtml = html.slice(reviewsStart, manifestoStart);
    assert.equal((reviewsHtml.match(/<article\b/g) || []).length, 8);
    assert.equal((reviewsHtml.match(/<blockquote\b/g) || []).length, 8);
    assert.equal((reviewsHtml.match(/role="img"\s+aria-label="Оценка 5 из 5"/g) || []).length, 8);
    assert.equal((reviewsHtml.match(/<span aria-hidden="true">★★★★★<\/span>/g) || []).length, 8);
    const dupStart = reviewsHtml.indexOf('aria-hidden="true"><div class="review-card"');
    assert.ok(dupStart !== -1);
    const dupHtml = reviewsHtml.slice(dupStart);
    assert.equal((dupHtml.match(/<article\b|<blockquote\b|role="img"/g) || []).length, 0);
    assert.equal((dupHtml.match(/tabIndex="-1"|tabindex="-1"/g) || []).length, 8);
    const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(ldMatches.length >= 1);
    for (const [, raw] of ldMatches) {
      assert.equal(/AggregateRating|aggregateRating|reviewRating|reviewBody|itemReviewed|"Review"/.test(raw), false);
    }
  }
});

function listHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listHtmlFiles(full));
    } else if (entry.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

test("Static export and sitemap match 1-to-1 with zero obsolete HTML stubs or legacy URLs", () => {
  assert.equal(existsSync("public/catalog/kitchen/index.html"), false, "Legacy stub public/catalog/kitchen/index.html must not exist");
  assert.equal(existsSync("public/kitchens/slavena/index.html"), false, "Legacy stub public/kitchens/slavena/index.html must not exist");
  assert.equal(existsSync("public/projects/bathroom-pur-vanity/index.html"), false, "Legacy stub public/projects/bathroom-pur-vanity/index.html must not exist");
  assert.equal(existsSync("data/projects.ts"), false, "Obsolete data/projects.ts must not remain in repository");

  if (!existsSync("out/sitemap.xml")) return;

  const sitemapXml = readFileSync("out/sitemap.xml", "utf8");
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapSet = new Set(sitemapUrls);
  assert.equal(sitemapUrls.length, sitemapSet.size, "Sitemap must not contain duplicate URLs");
  assert.equal(sitemapUrls.length, 44, `Expected 44 canonical URLs in sitemap.xml, got ${sitemapUrls.length}`);

  for (const url of sitemapUrls) {
    assert.match(url, /^https:\/\/pitermebel\.com\/(.*\/)?$/, `Non-canonical URL in sitemap: ${url}`);
    assert.doesNotMatch(url, /\/projects\/[^/]+\//, `Removed /projects/<slug>/ URL leaked into sitemap: ${url}`);
    assert.doesNotMatch(url, /\/kitchens\/(slavena|aleksandra|timofey|stefania|ulyana|valeria|viktoria)\//, `Removed kitchen slug leaked into sitemap: ${url}`);
    assert.doesNotMatch(url, /\/(en|quiz|catalog|basket|analytics-consent)\b/, `Legacy URL leaked into sitemap: ${url}`);
  }

  const allowedNonSitemap = new Set(["404.html", "404/index.html", "yandex_2290ffc6c48b46ac.html"]);
  const exportedUrls = new Set();
  for (const file of listHtmlFiles("out")) {
    const rel = path.relative("out", file).replace(/\\/g, "/");
    if (allowedNonSitemap.has(rel)) continue;
    assert.ok(rel === "index.html" || rel.endsWith("/index.html"), `Unexpected non-directory HTML file in out/: ${rel}`);
    const canonicalUrl = rel === "index.html"
      ? "https://pitermebel.com/"
      : `https://pitermebel.com/${rel.slice(0, -"index.html".length)}`;
    assert.ok(sitemapSet.has(canonicalUrl), `Exported HTML page ${rel} is missing from sitemap.xml`);
    exportedUrls.add(canonicalUrl);
  }
  assert.equal(exportedUrls.size, sitemapSet.size, "Every sitemap URL must correspond to an exported HTML file");
});

test("Caddyfile permanently redirects all legacy and removed URLs and preserves canonical trailing-slash routing", () => {
  const caddy = readFileSync("Caddyfile", "utf8");
  const legacyBlockMatch = caddy.match(/\(legacy_redirects\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(legacyBlockMatch, "Caddyfile must define (legacy_redirects) snippet");
  const legacyBlock = legacyBlockMatch[1];

  const requiredExactPaths = [
    "/en",
    "/en/*",
    "/quiz",
    "/quiz/*",
    "/analytics-consent",
    "/analytics-consent/",
    "/basket",
    "/basket/",
    "/catalog",
    "/catalog/",
    "/catalog/kitchen",
    "/catalog/kitchen/",
    "/kitchens/slavena",
    "/kitchens/slavena/",
    "/kitchens/aleksandra",
    "/kitchens/aleksandra/",
    "/kitchens/timofey",
    "/kitchens/timofey/",
    "/kitchens/stefania",
    "/kitchens/stefania/",
    "/kitchens/ulyana",
    "/kitchens/ulyana/",
    "/kitchens/valeria",
    "/kitchens/valeria/",
    "/kitchens/viktoria",
    "/kitchens/viktoria/",
    "/projects/bathroom-pur-vanity",
    "/projects/bathroom-pur-vanity/",
    "/projects/bathroom-vanity",
    "/projects/bathroom-vanity/",
    "/projects/glass-wardrobe",
    "/projects/glass-wardrobe/",
    "/projects/brick-wardrobe",
    "/projects/brick-wardrobe/",
    "/projects/light-wood-wardrobe",
    "/projects/light-wood-wardrobe/",
    "/projects/wardrobe-inside",
    "/projects/wardrobe-inside/",
    "/projects/bedroom-set",
    "/projects/bedroom-set/",
    "/projects/mirror-hall",
    "/projects/mirror-hall/",
    "/projects/slat-panels",
    "/projects/slat-panels/",
    "/projects/oak-veneer-panel",
    "/projects/oak-veneer-panel/",
    "/projects/office-reception",
    "/projects/office-reception/",
    "/projects/sliding-partition",
    "/projects/sliding-partition/",
    "/projects/cascade-partitions",
    "/projects/cascade-partitions/",
    "/projects/curved-oak-facades",
    "/projects/curved-oak-facades/",
  ];
  const matcherTokens = new Set(
    [...legacyBlock.matchAll(/@\w+\s+path\s+([^\n]+)/g)].flatMap((m) => m[1].trim().split(/\s+/))
  );
  for (const legacyPath of requiredExactPaths) {
    assert.ok(matcherTokens.has(legacyPath), `Caddyfile missing legacy path matcher token for ${legacyPath}`);
  }

  const kitchenProjectRegexMatch = legacyBlock.match(/path_regexp legacyKitchen \^\/projects\/\(([^)]+)\)\/\?\$/);
  assert.ok(kitchenProjectRegexMatch, "Caddyfile missing legacyKitchen regex redirect");
  const redirectedKitchenSlugs = new Set(kitchenProjectRegexMatch[1].split("|"));
  for (const slug of [
    "island-parquet",
    "oak-stone",
    "white-showcase",
    "marble-hood",
    "narrow-kitchen",
    "emerald-enamel",
    "velvet-matte",
    "sherman-cognac",
  ]) {
    assert.ok(redirectedKitchenSlugs.has(slug), `Caddyfile missing /projects/${slug}/ redirect`);
  }

  // Must import legacy_redirects in all 3 site blocks (http, https www, https apex)
  assert.equal(
    (caddy.match(/\bimport\s+legacy_redirects\b/g) || []).length,
    3,
    "Caddyfile must import legacy_redirects in http, https www, and https apex blocks"
  );

  // Must define single-hop canonical domain redirect for http and https www
  assert.match(caddy, /\(canonical_domain_redirect\)\s*\{/, "Caddyfile must define (canonical_domain_redirect)");
  assert.equal(
    (caddy.match(/\bimport\s+canonical_domain_redirect\b/g) || []).length,
    2,
    "Caddyfile must use canonical_domain_redirect in both http and https www blocks"
  );

  // Must NOT use try_files {path}/index.html which bypasses file_server trailing-slash redirect and serves 200 duplicates
  assert.doesNotMatch(
    caddy,
    /^\s*try_files\b/m,
    "Caddyfile must not use try_files (it serves 200 OK duplicates on non-trailing-slash URLs and /404)"
  );

  // Must return real HTTP 404 for exported /404 artifacts and canonicalize /index.html
  assert.match(caddy, /@notFoundPages\s+path\s+\/404\s+\/404\/\s+\/404\.html\s+\/404\/index\.html/);
  assert.match(caddy, /error\s+"Not Found"\s+404/);
  assert.match(caddy, /@rootIndexHtml\s+path\s+\/index\.html/);
  assert.match(caddy, /@nestedIndexHtml\s+path_regexp\s+nestedIdx/);
  const notFoundHandleIdx = caddy.indexOf("handle @notFoundPages");
  const rootIndexHandleIdx = caddy.indexOf("handle @rootIndexHtml");
  const nestedIndexHandleIdx = caddy.indexOf("handle @nestedIndexHtml");
  assert.ok(notFoundHandleIdx !== -1, "Caddyfile must define handle @notFoundPages");
  assert.ok(rootIndexHandleIdx !== -1, "Caddyfile must define handle @rootIndexHtml");
  assert.ok(nestedIndexHandleIdx !== -1, "Caddyfile must define handle @nestedIndexHtml");
  assert.ok(
    notFoundHandleIdx < rootIndexHandleIdx && notFoundHandleIdx < nestedIndexHandleIdx,
    "Caddyfile must evaluate @notFoundPages before @rootIndexHtml and @nestedIndexHtml so /404/index.html returns 404 directly"
  );
  assert.match(caddy, /@staticFiles\s*\{[\s\S]*?\*\.webmanifest/);
  assert.match(caddy, /handle_errors\s*\{[\s\S]*?header\s+Cache-Control\s+"no-store"/, "Caddyfile handle_errors must override Cache-Control with no-store so 404/5xx are never cached as immutable");
  assert.match(caddy, /@errStatic\s+path\b[^\n]*\*\.webmanifest/);
  assert.match(
    caddy,
    /handle\s+@errStatic\s*\{\s*respond\s+"\{err\.status_code\} \{err\.status_text\}"\s*\}/,
    "Caddyfile @errStatic must use standard handle_errors respond without redundant status code placeholder"
  );

  if (existsSync("out/sitemap.xml")) {
    const sitemapSet = new Set(
      [...readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    );
    for (const [, target] of legacyBlock.matchAll(/redir\s+(https:\/\/pitermebel\.com[^\s]+)\s+permanent/g)) {
      if (target.includes("{re.legacyKitchen.1}")) {
        for (const slug of redirectedKitchenSlugs) {
          const resolved = target.replace("{re.legacyKitchen.1}", slug);
          assert.ok(sitemapSet.has(resolved), `Redirect target not in sitemap: ${resolved}`);
        }
      } else {
        assert.ok(sitemapSet.has(target), `Redirect target not in sitemap: ${target}`);
      }
    }
  }
});

test("Every exported kitchen detail page includes valid Product JSON-LD with AggregateOffer", () => {
  if (!existsSync("out/kitchens")) return;
  const dirs = readdirSync("out/kitchens", { withFileTypes: true }).filter((d) => d.isDirectory());
  assert.equal(dirs.length, 15, `Expected 15 exported kitchen directories, got ${dirs.length}`);
  for (const dir of dirs) {
    const html = readFileSync(path.join("out/kitchens", dir.name, "index.html"), "utf8");
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]));
    const product = schemas.find((s) => s["@type"] === "Product");
    assert.ok(product, `Missing Product JSON-LD on /kitchens/${dir.name}/`);
    assert.equal(product.offers?.["@type"], "AggregateOffer", `Missing AggregateOffer on /kitchens/${dir.name}/`);
    assert.ok(product.offers.lowPrice >= 160000, `Invalid lowPrice on /kitchens/${dir.name}/`);
    assert.ok(product.offers.highPrice >= product.offers.lowPrice, `Invalid highPrice on /kitchens/${dir.name}/`);
    assert.equal(product.offers.priceCurrency, "RUB");
    assert.equal(product.offers.availability, "https://schema.org/PreOrder");
  }
});

test("Backend SEO artifacts (robots Clean-param, image sitemap, RSS 2.0, 404 metadata, JSON-LD graph, Caddy headers)", () => {
  const caddy = readFileSync("Caddyfile", "utf8");
  assert.match(caddy, /handle_errors\s*\{[\s\S]*?header\s+X-Robots-Tag\s+"noindex"/);
  assert.match(caddy, /header\s+\/feed\.xml\s+>Content-Type\s+"application\/rss\+xml; charset=utf-8"/);
  assert.match(caddy, /header\s+\/site\.webmanifest\s+>Content-Type\s+"application\/manifest\+json; charset=utf-8"/);
  assert.match(caddy, /header\s+@indexNowKeys\s+X-Robots-Tag\s+"noindex, nofollow"/);
  assert.match(caddy, /@rscPayloads\s+path\s+\/index\.txt\s+\*\/index\.txt/);
  assert.match(caddy, /header\s+@rscPayloads\s+X-Robots-Tag\s+"noindex, nofollow"/);
  assert.match(caddy, /header\s+@rscPayloads\s+Cache-Control\s+"no-cache, must-revalidate"/);
  assert.match(caddy, /header\s+\/downloads\/kitchen-electrics-checklist\.pdf\s+Link\s+`<https:\/\/pitermebel\.com\/knowledge\/rozetki-na-kuhne-shema-vysoty\/>; rel="canonical"`/);

  if (!existsSync("out/robots.txt")) return;

  const manifestBuf = readFileSync("out/site.webmanifest");
  assert.equal(
    manifestBuf[0] === 0xef && manifestBuf[1] === 0xbb && manifestBuf[2] === 0xbf,
    false,
    "out/site.webmanifest must not start with a UTF-8 BOM"
  );
  const manifestJson = JSON.parse(manifestBuf.toString("utf8"));
  assert.equal(manifestJson.start_url, "/");
  assert.equal(manifestJson.lang, "ru");

  const robots = readFileSync("out/robots.txt", "utf8");
  assert.match(robots, /^User-Agent:\s*\*/m);
  assert.match(robots, /^Clean-param:.*utm_source.*yclid.*ysclid.*ymclid.*erid.*_openstat.* \/$/m);
  assert.match(robots, /^Clean-param:.*category.*layout.*meters.* \/calculator\/$/m);
  assert.match(robots, /^Sitemap:\s*https:\/\/pitermebel\.com\/sitemap\.xml$/m);

  const sitemap = readFileSync("out/sitemap.xml", "utf8");
  assert.match(sitemap, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  const imageLocs = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);
  assert.ok(imageLocs.length >= 100, `Expected >=100 image sitemap entries, got ${imageLocs.length}`);
  for (const imgUrl of imageLocs) {
    assert.ok(imgUrl.startsWith("https://pitermebel.com/"));
    const rel = imgUrl.slice("https://pitermebel.com/".length);
    assert.ok(existsSync(path.join("out", rel)), `Image in sitemap.xml missing from out/: ${rel}`);
  }

  const feed = readFileSync("out/feed.xml", "utf8");
  assert.match(feed, /<lastBuildDate>[^<]+<\/lastBuildDate>/);
  assert.match(feed, /<author>[^\s<]+@[^\s<]+\s+\([^<]+\)<\/author>/);

  const html404 = readFileSync("out/404.html", "utf8");
  assert.match(html404, /<title>Страница не найдена \(404\) \| ПитерМебель<\/title>/);
  assert.match(html404, /name="twitter:title"\s+content="Страница не найдена \(404\) \| ПитерМебель"/);
  assert.match(html404, /name="robots"\s+content="noindex/);
  assert.doesNotMatch(html404, /content="index,\s*follow"/);

  const homeHtml = readFileSync("out/index.html", "utf8");
  const heroPreloads = homeHtml.match(/<link[^>]*rel="preload"[^>]*photo_hero_upscaled[^>]*>/g) || [];
  assert.equal(heroPreloads.length, 1, `Expected single hero preload on /, got ${heroPreloads.length}`);
  assert.match(homeHtml, /name="robots"\s+content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"/);
  assert.match(homeHtml, /property="og:image"\s+content="https:\/\/pitermebel\.com\/img\/og\/home\.jpg"/);
  assert.match(homeHtml, /name="twitter:card"\s+content="summary_large_image"/);
  const homeSchemas = [...homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((m) => {
      const parsed = JSON.parse(m[1]);
      return parsed["@graph"] || [parsed];
    });
  const org = homeSchemas.find((s) => s["@type"] === "LocalBusiness");
  assert.ok(org?.legalName, "LocalBusiness JSON-LD must include legalName");
  assert.ok(org?.taxID, "LocalBusiness JSON-LD must include taxID");
  assert.ok(org?.department?.["@id"] === "https://pitermebel.com/#workshop", "LocalBusiness JSON-LD must include workshop department");
  assert.ok(Array.isArray(org?.department?.image) && org.department.image.length >= 1, "Workshop LocalBusiness JSON-LD must include image[]");
  for (const imgUrl of org.department.image) {
    assert.ok(imgUrl.startsWith("https://pitermebel.com/"));
    const rel = imgUrl.slice("https://pitermebel.com/".length);
    assert.ok(existsSync(path.join("out", rel)), `Workshop JSON-LD image missing from out/: ${rel}`);
  }
  assert.ok(org?.hasOfferCatalog?.itemListElement?.length >= 5, "LocalBusiness JSON-LD must include hasOfferCatalog");

  const pageSchemaChecks = [
    ["out/contacts/index.html", "ContactPage"],
    ["out/production/index.html", "AboutPage"],
    ["out/calculator/index.html", "WebApplication"],
    ["out/kitchens/index.html", "CollectionPage"],
    ["out/knowledge/index.html", "CollectionPage"],
    ["out/knowledge/rozetki-na-kuhne-shema-vysoty/index.html", "FAQPage"],
  ];
  for (const [file, expectedType] of pageSchemaChecks) {
    const html = readFileSync(file, "utf8");
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap((m) => {
        const parsed = JSON.parse(m[1]);
        return parsed["@graph"] || [parsed];
      });
    assert.ok(
      schemas.some((s) => s["@type"] === expectedType),
      `Expected ${expectedType} JSON-LD in ${file}`
    );
  }

  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of sitemapUrls) {
    const relPath = url === "https://pitermebel.com/"
      ? "out/index.html"
      : path.join("out", url.slice("https://pitermebel.com/".length), "index.html");
    const html = readFileSync(relPath, "utf8");
    const breadcrumbs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]))
      .filter((s) => s["@type"] === "BreadcrumbList");
    for (const bc of breadcrumbs) {
      for (const item of bc.itemListElement || []) {
        assert.ok(
          typeof item.item === "string" && item.item.startsWith("https://pitermebel.com/") && item.item.endsWith("/"),
          `BreadcrumbList item in ${relPath} missing canonical trailing-slash item URL: ${JSON.stringify(item)}`
        );
      }
    }
  }
});
