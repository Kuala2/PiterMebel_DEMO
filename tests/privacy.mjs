import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const VERSION = "2026-09-27";
function runtime({ approved = true, analyticsApproved = true, endpoint = "/api/leads", fetch = () => assert.fail("Unexpected request") } = {}) {
  const values = new Map();
  const localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  const window = { localStorage, dispatchEvent() {}, location: { origin: "https://pitermebel.com", pathname: "/contacts/" }, setTimeout, clearTimeout };
  const document = { referrer: "https://yandex.ru/" };
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const js = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    vm.runInNewContext(js, { exports, window, document, URL, Date, Event, FormData, AbortController, fetch,
      process: { env: { NEXT_PUBLIC_LEAD_ENDPOINT: endpoint } },
      require(id) {
        if (id === "@/data/legal") return { canReceiveLeads: approved, canUseAnalytics: analyticsApproved, LEGAL_VERSION: VERSION, PRIVACY_VERSION: "2026-09-29" };
        if (id.startsWith("@/")) return load(id.slice(2) + ".ts");
        throw new Error(id);
      },
    }, { filename: file });
    return exports;
  }
  return { load, window, values };
}
function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ contact: "+70000000000", category: "Консультация", consent: "on", consent_version: VERSION, page_url: "https://pitermebel.com/contacts/?phone=secret#private" })) data.set(key, value);
  return data;
}

test("Analytics is disabled and does not load external counters", () => {
  const { load } = runtime();
  const privacy = load("lib/privacy.ts");
  assert.equal(privacy.isAnalyticsEnabled(), false);
  assert.equal(privacy.saveAnalyticsChoice(true), false);
});

test("Unapproved setup and external or malformed endpoints never transmit leads", async () => {
  for (const options of [{ approved: false }, { endpoint: "" }, { endpoint: "https://external.example/submit" }, { endpoint: "//external.example/api/leads" }, { endpoint: "/api/../external" }, { endpoint: "/api/leads?redirect=external" }, { endpoint: "https://leads.pitermebel.com.evil.test/submit.php" }, { endpoint: "https://leads.pitermebel.com/submit.php?redirect=evil" }, { approved: false, endpoint: "https://leads.pitermebel.com/submit.php" }]) {
    const submit = runtime(options).load("app/actions/measure.ts").submitMeasureRequest;
    assert.equal((await submit({}, form())).success, false);
  }
});

test("Dedicated lead subdomain and Yandex Cloud Functions endpoint use readable responses without browser credentials", async () => {
  for (const endpoint of ["https://leads.pitermebel.com/submit.php", "https://functions.yandexcloud.net/d4eta2abudog5ok2q68f"]) {
    const { load } = runtime({ endpoint, fetch: async (url, options) => {
      assert.equal(url, endpoint);
      assert.equal(options.credentials, "omit");
      assert.equal(options.redirect, "error");
      assert.notEqual(options.mode, "no-cors");
      return { ok: true, json: async () => ({ success: true }) };
    } });
    assert.equal((await load("app/actions/measure.ts").submitMeasureRequest({}, form())).deliveryAccepted, true);
  }
});

test("Missing or outdated consent cannot send a lead", async () => {
  for (const field of ["consent", "consent_version"]) {
    const data = form();
    data.delete(field);
    const submit = runtime().load("app/actions/measure.ts").submitMeasureRequest;
    assert.equal((await submit({}, data)).success, false);
  }
});

test("Lead payload minimizes URLs and records the separate consent version", async () => {
  let sent = 0;
  const { load } = runtime({ fetch: async (url, options) => {
    sent++;
    assert.equal(url, "/api/leads");
    assert.equal(options.redirect, "error");
    assert.equal(options.referrerPolicy, "no-referrer");
    assert.equal(options.body.get("Страница"), "https://pitermebel.com/contacts/");
    assert.equal(options.body.get("consent_version"), VERSION);
    assert.equal(options.body.get("consent_document"), "/consent/");
    assert.equal(options.body.get("consent"), "true");
    assert.ok(Date.parse(options.body.get("consent_client_at")));
    assert.equal(options.body.has("access_key"), false);
    return { ok: true, json: async () => ({ success: true }) };
  } });
  const result = await load("app/actions/measure.ts").submitMeasureRequest({}, form());
  assert.equal(result.deliveryAccepted, true);
  assert.equal(sent, 1);
});

test("Truthy strings from a malformed backend are not accepted as success", async () => {
  const { load } = runtime({ fetch: async () => ({ ok: true, json: async () => ({ success: "false" }) }) });
  assert.equal((await load("app/actions/measure.ts").submitMeasureRequest({}, form())).success, false);
});
