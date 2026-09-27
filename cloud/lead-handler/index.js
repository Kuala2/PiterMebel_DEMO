"use strict";

const { createHash } = require("node:crypto");
const db = require("./db");
const mail = require("./mail");

const CATEGORIES = new Set([
  "Кухня", "Шкаф или гардеробная", "Корпусная мебель",
  "Комплексный заказ", "Дизайн-проект", "Консультация",
]);
const MAX_BODY_BYTES = 12 * 1024;

function reply(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    body: JSON.stringify(body),
    isBase64Encoded: false,
  };
}

function text(form, key, max) {
  const values = form.getAll(key);
  if (values.length > 1 || (values[0] != null && typeof values[0] !== "string")) throw new Error("Invalid form field");
  const value = (values[0] || "").trim();
  if (value.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)) throw new Error("Invalid form field");
  return value;
}

async function parseForm(event) {
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
  const contentType = headers["content-type"] || "";
  if (!/^multipart\/form-data;\s*boundary=/i.test(contentType)) throw new Error("Unsupported content type");
  const body = event.isBase64Encoded ? Buffer.from(event.body || "", "base64") : Buffer.from(event.body || "", "utf8");
  if (body.length > MAX_BODY_BYTES) throw new Error("Form is too large");
  const request = new Request("https://pitermebel.com/api/leads", {
    method: "POST", body, headers: { "content-type": contentType },
  });
  return request.formData();
}

function cleanPage(value, origin) {
  try {
    const url = new URL(value);
    if (url.origin !== origin) return origin;
    return `${url.origin}${url.pathname}`;
  } catch { return origin; }
}

function cleanSketch(value) {
  if (!value || value === "Не указана") return "Не указана";
  const url = new URL(value);
  if (!/^(https?):$/.test(url.protocol) || value.length > 500) throw new Error("Invalid sketch URL");
  return value;
}

function buildLead(form, now, origin, consentVersion, consentText) {
  const id = text(form, "submission_id", 36);
  const phone = text(form, "Телефон", 32);
  const category = text(form, "Тип мебели", 80);
  const version = text(form, "consent_version", 64);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error("Invalid submission ID");
  if (phone.replace(/\D/g, "").length < 10 || phone.replace(/\D/g, "").length > 15 || !CATEGORIES.has(category)) throw new Error("Invalid lead");
  if (text(form, "consent", 8) !== "true" || version !== consentVersion || text(form, "consent_document", 32) !== "/consent/") throw new Error("Invalid consent");
  const consentClientAt = text(form, "consent_client_at", 40);
  if (!Number.isFinite(Date.parse(consentClientAt))) throw new Error("Invalid consent time");
  const createdAt = new Date(now).toISOString();
  return {
    id, phone, category,
    message: text(form, "Пожелания", 2000) || "Не указаны",
    sketch_url: cleanSketch(text(form, "Ссылка на эскиз", 500)),
    source: text(form, "Источник формы", 120) || "Сайт",
    calculator_summary: text(form, "Параметры калькулятора", 1000) || "Нет",
    page: cleanPage(text(form, "Страница", 300), origin),
    created_at: createdAt,
    consent_version: version,
    consent_document: "/consent/",
    consent_client_at: consentClientAt,
    consent_server_at: createdAt,
    consent_text: consentText,
    consent_sha256: createHash("sha256").update(consentText).digest("hex"),
    notification_status: "pending",
    expires_at: Math.floor(now / 1000) + 88 * 86400,
  };
}

function createHandler(deps = {}) {
  const storage = deps.db || db;
  const sendMail = deps.notify || mail.notify;
  const clock = deps.now || Date.now;
  return async function main(event, context = {}) {
    if (event?.httpMethod !== "POST") return reply(405, { success: false });
    const origin = process.env.LEAD_ALLOWED_ORIGIN;
    const consentVersion = process.env.LEAD_CONSENT_VERSION;
    const consentText = process.env.LEAD_CONSENT_TEXT;
    if (process.env.LEAD_ENABLED !== "true" || !origin || !consentVersion || !consentText || consentText.length < 100) return reply(503, { success: false });
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    if (headers.origin !== origin) return reply(403, { success: false });
    let form, lead;
    try {
      form = await parseForm(event);
      if (text(form, "website", 200) || text(form, "confirm_order", 8)) return reply(200, { success: true });
      lead = buildLead(form, clock(), origin, consentVersion, consentText);
    } catch { return reply(400, { success: false }); }
    const token = typeof context.token === "string" ? context.token : context.token?.access_token;
    try {
      const existing = await storage.getLead(lead.id, token);
      if (existing && existing.notification_status === "sent") return reply(200, { success: true });
      if (existing) lead = existing;
      else {
        if (await storage.isRateLimited(lead.phone, clock(), token)) return reply(429, { success: false });
        const inserted = await storage.saveLead(lead, token);
        if (!inserted) {
          lead = await storage.getLead(lead.id, token);
          if (!lead) throw new Error("Lead insert could not be confirmed");
          if (lead.notification_status === "sent") return reply(200, { success: true });
        }
      }
    } catch (error) {
      console.error("Lead storage failed", error.message);
      return reply(503, { success: false });
    }
    try {
      await sendMail(lead, token);
      await storage.markNotified(lead.id, token);
    } catch (error) {
      console.error("Lead notification pending", lead.id, error.message);
      return reply(503, { success: false });
    }
    return reply(200, { success: true });
  };
}

module.exports = { main: createHandler(), createHandler, buildLead, parseForm };
