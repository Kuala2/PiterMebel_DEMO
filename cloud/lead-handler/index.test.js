"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { createHandler } = require("./index");

process.env.LEAD_ENABLED = "true";
process.env.LEAD_ALLOWED_ORIGIN = "https://pitermebel.com";
process.env.LEAD_CONSENT_VERSION = "2026-09-27";
process.env.LEAD_CONSENT_TEXT = "Согласие на обработку персональных данных для ответа на заявку. ".repeat(3);

async function event(fields = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    submission_id: randomUUID(),
    "Телефон": "+7 921 000-00-00",
    "Тип мебели": "Кухня",
    "Пожелания": "Шкаф и кухня",
    "Ссылка на эскиз": "Не указана",
    "Источник формы": "Сайт",
    "Параметры калькулятора": "Нет",
    "Страница": "https://pitermebel.com/contacts/?phone=secret",
    consent: "true",
    consent_version: "2026-09-27",
    consent_document: "/consent/",
    consent_client_at: "2026-09-27T10:00:00.000Z",
    website: "",
    confirm_order: "",
    ...fields,
  })) form.set(key, value);
  const request = new Request("https://pitermebel.com/api/leads", { method: "POST", body: form });
  return {
    httpMethod: "POST",
    headers: { Origin: "https://pitermebel.com", "Content-Type": request.headers.get("content-type") },
    body: Buffer.from(await request.arrayBuffer()).toString("base64"),
    isBase64Encoded: true,
  };
}

function fakeDb() {
  const leads = new Map();
  return {
    leads,
    getLead: async (id) => leads.get(id) || null,
    isRateLimited: async () => false,
    saveLead: async (lead) => {
      if (leads.has(lead.id)) return false;
      leads.set(lead.id, lead);
      return true;
    },
    markNotified: async (id) => { leads.get(id).notification_status = "sent"; },
  };
}

test("valid lead is stored before one notification and can be retried idempotently", async () => {
  const storage = fakeDb();
  const sent = [];
  const handler = createHandler({ db: storage, notify: async (lead) => {
    assert.equal(storage.leads.get(lead.id).id, lead.id);
    sent.push(lead);
  }, now: () => Date.parse("2026-09-27T10:01:00Z") });
  const request = await event();
  const firstResponse = await handler(request, { token: "test" });
  assert.equal(firstResponse.statusCode, 200);
  assert.equal(firstResponse.headers["Access-Control-Allow-Origin"], "https://pitermebel.com");
  assert.equal(firstResponse.headers.Vary, "Origin");
  assert.equal((await handler(request, { token: "test" })).statusCode, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].page, "https://pitermebel.com/contacts/");
  assert.equal(storage.leads.size, 1);
  assert.equal(storage.leads.values().next().value.consent_version, "2026-09-27");
});

test("OPTIONS preflight returns 204 with CORS headers for allowed origin and 403 for disallowed origin", async () => {
  const handler = createHandler({ db: fakeDb(), notify: async () => assert.fail("unexpected mail") });
  const preflight = await handler({ httpMethod: "OPTIONS", headers: { Origin: "https://pitermebel.com" } });
  assert.equal(preflight.statusCode, 204);
  assert.equal(preflight.headers["Access-Control-Allow-Origin"], "https://pitermebel.com");
  assert.equal(preflight.headers["Access-Control-Allow-Methods"], "POST, OPTIONS");
  assert.equal(preflight.headers["Access-Control-Allow-Headers"], "Content-Type, Accept");
  assert.equal(preflight.headers.Vary, "Origin");

  const denied = await handler({ httpMethod: "OPTIONS", headers: { Origin: "https://attacker.example" } });
  assert.equal(denied.statusCode, 403);
  assert.equal(denied.headers["Access-Control-Allow-Origin"], undefined);
});

test("server rejects direct bot submissions and invalid consent without saving", async () => {
  const storage = fakeDb();
  const handler = createHandler({ db: storage, notify: async () => assert.fail("unexpected mail") });
  assert.equal((await handler(await event({ website: "https://spam.example" }), { token: "test" })).statusCode, 200);
  assert.equal((await handler(await event({ confirm_order: "on" }), { token: "test" })).statusCode, 200);
  assert.equal((await handler(await event({ consent: "false" }), { token: "test" })).statusCode, 400);
  assert.equal(storage.leads.size, 0);
});

test("origin and oversized body are blocked before storage", async () => {
  const storage = fakeDb();
  const handler = createHandler({ db: storage, notify: async () => assert.fail("unexpected mail") });
  const wrongOrigin = await event();
  wrongOrigin.headers.Origin = "https://attacker.example";
  assert.equal((await handler(wrongOrigin, { token: "test" })).statusCode, 403);
  assert.equal((await handler(await event({ "Пожелания": "x".repeat(14000) }), { token: "test" })).statusCode, 400);
  assert.equal(storage.leads.size, 0);
});

test("storage failure prevents email; failed email leaves lead for retry", async () => {
  const storage = fakeDb();
  const request = await event();
  const brokenDb = { ...storage, saveLead: async () => { throw new Error("offline"); } };
  const storageHandler = createHandler({ db: brokenDb, notify: async () => assert.fail("unexpected mail") });
  assert.equal((await storageHandler(request, { token: "test" })).statusCode, 503);
  let attempts = 0;
  const handler = createHandler({ db: storage, notify: async () => { if (++attempts === 1) throw new Error("mail offline"); } });
  assert.equal((await handler(request, { token: "test" })).statusCode, 503);
  assert.equal(storage.leads.size, 1);
  assert.equal((await handler(request, { token: "test" })).statusCode, 200);
  assert.equal(attempts, 2);
});
