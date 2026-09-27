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
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const js = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    vm.runInNewContext(js, { exports, window, URL, Date, Event, FormData, AbortController, fetch,
      process: { env: { NEXT_PUBLIC_LEAD_ENDPOINT: endpoint } },
      require(id) {
        if (id === "@/data/legal") return { canReceiveLeads: approved, canUseAnalytics: analyticsApproved, LEGAL_VERSION: VERSION };
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

test("Analytics needs current, unexpired consent and operator setup", () => {
  const { load, window, values } = runtime();
  const privacy = load("lib/privacy.ts");
  const metrika = load("lib/metrika.ts");
  metrika.reachGoal("contact_phone");
  assert.equal(window.ym, undefined);
  for (const value of ["invalid", JSON.stringify({ analytics: true, at: Date.now(), version: "old" }), JSON.stringify({ analytics: true, at: Date.now() - privacy.CONSENT_MAX_AGE, version: VERSION }), JSON.stringify({ analytics: true, at: Date.now() + 99999, version: VERSION })]) {
    values.set(privacy.PRIVACY_KEY, value);
    assert.equal(privacy.hasAnalyticsConsent(), false);
  }
  assert.equal(privacy.saveAnalyticsChoice(true), true);
  metrika.reachGoal("contact_phone");
  assert.equal(window.ym.a[0][1], "init");
  assert.equal(window.ym.a[0][2].webvisor, false);
  privacy.saveAnalyticsChoice(false);
  const count = window.ym.a.length;
  metrika.reachGoal("zayavka");
  assert.equal(window.ym.a.length, count);
  metrika.stopMetrika();
  assert.equal(window.ym.a.length, 0);
  const blocked = runtime({ analyticsApproved: false });
  blocked.load("lib/privacy.ts").saveAnalyticsChoice(true);
  assert.equal(blocked.load("lib/privacy.ts").hasAnalyticsConsent(), false);
});

test("Unavailable browser storage cannot activate analytics", () => {
  const { load, window } = runtime();
  window.localStorage.getItem = () => { throw new Error("blocked"); };
  window.localStorage.setItem = () => { throw new Error("blocked"); };
  assert.equal(load("lib/privacy.ts").hasAnalyticsConsent(), false);
  assert.equal(load("lib/privacy.ts").saveAnalyticsChoice(true), false);
});

test("Unapproved setup and external or malformed endpoints never transmit leads", async () => {
  for (const options of [{ approved: false }, { endpoint: "" }, { endpoint: "https://external.example/submit" }, { endpoint: "//external.example/api/leads" }, { endpoint: "/api/../external" }, { endpoint: "/api/leads?redirect=external" }]) {
    const submit = runtime(options).load("app/actions/measure.ts").submitMeasureRequest;
    assert.equal((await submit({}, form())).success, false);
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
