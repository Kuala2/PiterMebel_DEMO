"use strict";

const test = require("node:test");
const assert = require("node:assert");
const { createHandler, buildLead, buildMailBody } = require("./index");

const ORIGIN = "https://pitermebel.com";
const UUID = "7e2b9c1a-3d4f-4e5a-9b8c-1d2e3f4a5b6c";

function formBody(fields) {
  const boundary = "----pitermebeltest";
  const parts = Object.entries(fields)
    .map(([name, value]) => `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`)
    .join("");
  return {
    body: `${parts}--${boundary}--\r\n`,
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

function event(fields, overrides = {}) {
  const { body, contentType } = formBody(fields);
  return {
    httpMethod: "POST",
    headers: { Origin: ORIGIN, "Content-Type": contentType },
    body,
    isBase64Encoded: false,
    ...overrides,
  };
}

function validFields(overrides = {}) {
  return {
    submission_id: UUID,
    "Телефон": "+79001234567",
    "Тип мебели": "Консультация",
    "Пожелания": "Тестовая заявка",
    "Ссылка на эскиз": "Не указана",
    "Источник формы": "Сайт",
    "Параметры калькулятора": "Нет",
    "Страница": "https://pitermebel.com/contacts/",
    consent: "true",
    consent_version: "2026-09-29",
    consent_document: "/consent/",
    consent_client_at: "2026-10-04T12:00:00Z",
    website: "",
    confirm_order: "",
    ...overrides,
  };
}

function withEnv(overrides, run) {
  const saved = { ...process.env };
  Object.assign(process.env, {
    LEAD_ENABLED: "true",
    LEAD_ALLOWED_ORIGIN: ORIGIN,
    LEAD_CONSENT_VERSION: "2026-09-29",
    ...overrides,
  });
  return Promise.resolve(run()).finally(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in saved)) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });
}

test("valid lead reaches the mailer", async () => {
  await withEnv({}, async () => {
    const sent = [];
    const handler = createHandler({ notify: async (lead) => sent.push(lead) });
    const response = await handler(event(validFields()), { token: "test-token" });
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), { success: true });
    assert.equal(sent.length, 1);
    assert.equal(sent[0].phone, "+79001234567");
    assert.equal(sent[0].consent_version, "2026-09-29");
  });
});

test("preflight from the allowed origin passes", async () => {
  await withEnv({}, async () => {
    const handler = createHandler({ notify: async () => assert.fail("must not be called") });
    const response = await handler({ httpMethod: "OPTIONS", headers: { Origin: ORIGIN } }, {});
    assert.equal(response.statusCode, 204);
    assert.equal(response.headers["Access-Control-Allow-Origin"], ORIGIN);
  });
});

test("requests from other origins are rejected", async () => {
  await withEnv({}, async () => {
    const handler = createHandler({ notify: async () => assert.fail("must not be called") });
    const response = await handler(event(validFields(), { headers: { Origin: "https://evil.example", "Content-Type": "multipart/form-data; boundary=x" }, body: "" }), {});
    assert.equal(response.statusCode, 403);
  });
});

test("disabled handler answers 503", async () => {
  await withEnv({ LEAD_ENABLED: "false" }, async () => {
    const handler = createHandler({ notify: async () => assert.fail("must not be called") });
    const response = await handler(event(validFields()), { token: "test-token" });
    assert.equal(response.statusCode, 503);
  });
});

test("filled honeypot gets a neutral success without mail", async () => {
  await withEnv({}, async () => {
    const sent = [];
    const handler = createHandler({ notify: async (lead) => sent.push(lead) });
    const response = await handler(event(validFields({ website: "http://spam.example" })), { token: "test-token" });
    assert.equal(response.statusCode, 200);
    assert.equal(sent.length, 0);
  });
});

test("wrong consent version is rejected", async () => {
  await withEnv({}, async () => {
    const handler = createHandler({ notify: async () => assert.fail("must not be called") });
    const response = await handler(event(validFields({ consent_version: "2020-01-01" })), { token: "test-token" });
    assert.equal(response.statusCode, 400);
  });
});

test("unknown category is rejected", async () => {
  await withEnv({}, async () => {
    const handler = createHandler({ notify: async () => assert.fail("must not be called") });
    const response = await handler(event(validFields({ "Тип мебели": "Диван" })), { token: "test-token" });
    assert.equal(response.statusCode, 400);
  });
});

test("mail failure answers 503 so the visitor can retry", async () => {
  await withEnv({}, async () => {
    const handler = createHandler({ notify: async () => { throw new Error("Postbox returned 500"); } });
    const response = await handler(event(validFields()), { token: "test-token" });
    assert.equal(response.statusCode, 503);
  });
});

test("mail body puts key fields first and service info in the footer", () => {
  const lead = {
    id: UUID,
    phone: "+79001234567",
    category: "Консультация",
    message: "Тестовая заявка",
    sketch_url: "Не указана",
    source: "Сайт",
    calculator_summary: "Нет",
    page: "https://pitermebel.com/contacts/",
    received_at: "2026-10-04T12:59:36.456Z",
    consent_version: "2026-09-29",
    consent_document: "/consent/",
    consent_client_at: "2026-10-04T12:00:00Z",
  };
  const body = buildMailBody(lead);
  const footerIndex = body.indexOf("——————————————");
  assert.ok(footerIndex > 0, "footer separator expected");
  const header = body.slice(0, footerIndex);
  const footer = body.slice(footerIndex);
  assert.match(body, /^Новая заявка: Консультация/m);
  assert.match(header, /Телефон: \+79001234567/);
  assert.match(header, /Пожелания: Тестовая заявка/);
  assert.match(header, /Ссылка на эскиз: Не указана/);
  for (const part of ["Страница:", "Источник:", "Калькулятор:", "Получена:", "Номер заявки:", "Согласие:"]) {
    assert.match(footer, new RegExp(part));
    assert.doesNotMatch(header, new RegExp(part));
  }
  assert.match(footer, /МСК/);
});

test("buildLead keeps only same-origin page addresses", () => {
  withEnv({}, async () => {
    const form = new FormData();
    form.set("submission_id", UUID);
    form.set("Телефон", "+79001234567");
    form.set("Тип мебели", "Кухня");
    form.set("consent", "true");
    form.set("consent_version", "2026-09-29");
    form.set("consent_document", "/consent/");
    form.set("consent_client_at", "2026-10-04T12:00:00Z");
    form.set("Страница", "https://pitermebel.com/kitchens/?utm=x");
    form.set("Ссылка на эскиз", "Не указана");
    const lead = buildLead(form);
    assert.equal(lead.page, "https://pitermebel.com/kitchens/");
    assert.ok(lead.received_at);
  });
});
