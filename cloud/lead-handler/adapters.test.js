"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const db = require("./db");
const { notify } = require("./mail");

test("YDB uses the function IAM token and conditional writes for rate limiting", async () => {
  process.env.YDB_DOCUMENT_ENDPOINT = "https://docapi.serverless.yandexcloud.net/ru-central1/folder/database";
  process.env.YDB_LEADS_TABLE = "pitermebel_leads";
  process.env.LEAD_HASH_KEY = "test-only-key-with-more-than-thirty-two-characters";
  const originalFetch = global.fetch;
  const used = new Set();
  const calls = [];
  global.fetch = async (url, options) => {
    assert.equal(url, process.env.YDB_DOCUMENT_ENDPOINT);
    assert.equal(options.headers.Authorization, "Bearer short-lived-token");
    const body = JSON.parse(options.body);
    calls.push(body);
    if (used.has(body.Item.id.S)) return { ok: false, status: 400, json: async () => ({ __type: "ConditionalCheckFailedException" }) };
    used.add(body.Item.id.S);
    return { ok: true, json: async () => ({}) };
  };
  try {
    for (let n = 0; n < 3; n++) assert.equal(await db.isRateLimited("+7 921 000-00-00", 1000000, "short-lived-token"), false);
    assert.equal(await db.isRateLimited("+7 921 000-00-00", 1000000, "short-lived-token"), true);
    assert.equal(calls[0].ConditionExpression, "attribute_not_exists(id)");
    assert.equal(calls[0].Item.id.S.includes("9210000000"), false);
  } finally { global.fetch = originalFetch; }
});

test("Postbox sends a plain text notification with the function IAM token", async () => {
  process.env.POSTBOX_FROM = "notice@pitermebel.com";
  process.env.LEAD_NOTIFY_TO = "piter.meb@yandex.ru";
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    assert.equal(url, "https://postbox.cloud.yandex.net/v2/email/outbound-emails");
    assert.equal(options.headers["X-YaCloud-SubjectToken"], "short-lived-token");
    const body = JSON.parse(options.body);
    assert.deepEqual(body.Destination.ToAddresses, ["piter.meb@yandex.ru"]);
    assert.match(body.Content.Simple.Body.Text.Data, /Телефон: \+7 921/);
    return { ok: true };
  };
  try {
    await notify({ id: "123", phone: "+7 921 000-00-00", category: "Кухня", message: "", sketch_url: "", source: "", calculator_summary: "", page: "", created_at: "" }, "short-lived-token");
  } finally { global.fetch = originalFetch; }
});
