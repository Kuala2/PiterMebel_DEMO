import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(file, globals) {
  const js = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = vm.createContext({ exports: {}, require: (id) => {
    if (id === "@/data/legal") return { canReceiveLeads: true, canUseAnalytics: true, LEGAL_VERSION: "2026-09-27" };
    if (id === "@/lib/privacy") return { hasAnalyticsConsent: () => true, pageAddress: (url) => url.split(/[?#]/)[0] };
    throw new Error(id);
  }, ...globals });
  vm.runInContext(js, context, { filename: file });
  return context.exports;
}

test("Metrica queues init once before early goals and pageviews", () => {
  const window = { location: { origin: "https://pitermebel.com", pathname: "/" } };
  const api = load("lib/metrika.ts", { window });
  api.reachGoal("contact_phone");
  api.getMetrika()(api.METRIKA_ID, "hit", "https://pitermebel.com/contacts/");
  api.reachGoal("zayavka");
  const calls = JSON.parse(JSON.stringify(window.ym.a));
  assert.deepEqual(calls.map((call) => call[1]), ["init", "reachGoal", "hit", "reachGoal"]);
  assert.equal(calls[0][2].defer, true);
  assert.equal(calls[0][2].webvisor, false);
  assert.equal(calls[0][2].trackLinks, true);
  assert.equal(calls[0][0], 112318484);
});

test("Metrica preserves an existing tag and is safe during static rendering", () => {
  let count = 0;
  const ym = () => { count++; };
  const api = load("lib/metrika.ts", { window: { ym, location: { origin: "https://pitermebel.com", pathname: "/" } } });
  assert.equal(api.getMetrika(), ym);
  api.getMetrika();
  assert.equal(count, 1);
  const serverApi = load("lib/metrika.ts", {});
  assert.equal(serverApi.getMetrika(), undefined);
  assert.doesNotThrow(() => serverApi.reachGoal("zayavka"));
});

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
