import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
