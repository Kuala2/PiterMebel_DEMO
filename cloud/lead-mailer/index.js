"use strict";

// Лёгкий вариант по решению владельца 04.10.2026: заявка только письмом,
// без YDB. Единственное хранение заявок — почтовый ящик оператора.
// Поля и ловушки совпадают с сайтом (см. app/actions/measure.ts).

const CATEGORIES = new Set([
  "Кухня", "Шкаф или гардеробная", "Корпусная мебель",
  "Комплексный заказ", "Дизайн-проект", "Консультация",
]);
const MAX_BODY_BYTES = 12 * 1024;
const POSTBOX_URL = "https://postbox.cloud.yandex.net/v2/email/outbound-emails";

function corsHeaders(requestOrigin, allowedOrigin) {
  const headers = { "Cache-Control": "no-store", Vary: "Origin" };
  if (allowedOrigin && requestOrigin === allowedOrigin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Accept";
  }
  return headers;
}

function reply(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders },
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

function buildLead(form) {
  const id = text(form, "submission_id", 36);
  const phone = text(form, "Телефон", 32);
  const category = text(form, "Тип мебели", 80);
  const version = text(form, "consent_version", 64);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error("Invalid submission ID");
  if (phone.replace(/\D/g, "").length < 10 || phone.replace(/\D/g, "").length > 15 || !CATEGORIES.has(category)) throw new Error("Invalid lead");
  if (text(form, "consent", 8) !== "true" || version !== process.env.LEAD_CONSENT_VERSION || text(form, "consent_document", 32) !== "/consent/") throw new Error("Invalid consent");
  const consentClientAt = text(form, "consent_client_at", 40);
  if (!Number.isFinite(Date.parse(consentClientAt))) throw new Error("Invalid consent time");
  return {
    id, phone, category,
    message: text(form, "Пожелания", 2000) || "Не указаны",
    sketch_url: cleanSketch(text(form, "Ссылка на эскиз", 500)),
    source: text(form, "Источник формы", 120) || "Сайт",
    calculator_summary: text(form, "Параметры калькулятора", 1000) || "Нет",
    page: cleanPage(text(form, "Страница", 300), process.env.LEAD_ALLOWED_ORIGIN || "https://pitermebel.com"),
    consent_version: version,
    consent_document: "/consent/",
    consent_client_at: consentClientAt,
    received_at: new Date().toISOString(),
  };
}

function formatMoscow(isoString) {
  try {
    const stamp = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(isoString));
    return `${stamp} (МСК)`;
  } catch {
    return isoString;
  }
}

function buildMailBody(lead) {
  return [
    `Новая заявка: ${lead.category}`,
    "",
    `Телефон: ${lead.phone}`,
    `Пожелания: ${lead.message}`,
    `Ссылка на эскиз: ${lead.sketch_url}`,
    "",
    "——————————————",
    `Страница: ${lead.page}`,
    `Источник: ${lead.source}`,
    `Калькулятор: ${lead.calculator_summary}`,
    `Получена: ${formatMoscow(lead.received_at)}`,
    `Номер заявки: ${lead.id}`,
    `Согласие: версия ${lead.consent_version}, документ ${lead.consent_document}, отмечено ${formatMoscow(lead.consent_client_at)}`,
  ].join("\n");
}

async function postboxNotify(lead, token) {
  const sender = process.env.POSTBOX_FROM;
  const recipient = process.env.LEAD_NOTIFY_TO;
  if (!sender || !recipient || !token) throw new Error("Postbox is not configured");
  const response = await fetch(POSTBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-YaCloud-SubjectToken": token },
    body: JSON.stringify({
      FromEmailAddress: sender,
      Destination: { ToAddresses: [recipient] },
      Content: { Simple: {
        Subject: { Data: `Заявка с сайта: ${lead.category} — ${lead.phone}`, Charset: "UTF-8" },
        Body: { Text: { Data: buildMailBody(lead), Charset: "UTF-8" } },
      } },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Postbox returned ${response.status}`);
}

function createHandler(deps = {}) {
  const notify = deps.notify || postboxNotify;
  return async function main(event, context = {}) {
    const origin = process.env.LEAD_ALLOWED_ORIGIN;
    const headers = Object.fromEntries(Object.entries(event?.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    const cors = corsHeaders(headers.origin, origin);
    if (event?.httpMethod === "OPTIONS") {
      if (!origin || headers.origin !== origin) return reply(403, { success: false }, cors);
      return { statusCode: 204, headers: cors, body: "", isBase64Encoded: false };
    }
    if (event?.httpMethod !== "POST") return reply(405, { success: false }, cors);
    if (process.env.LEAD_ENABLED !== "true" || !origin || !process.env.LEAD_CONSENT_VERSION) return reply(503, { success: false }, cors);
    if (headers.origin !== origin) return reply(403, { success: false }, cors);
    let lead;
    try {
      const form = await parseForm(event);
      if (text(form, "website", 200) || text(form, "confirm_order", 8)) return reply(200, { success: true }, cors);
      lead = buildLead(form);
    } catch { return reply(400, { success: false }, cors); }
    const token = typeof context.token === "string" ? context.token : context.token?.access_token;
    try {
      await notify(lead, token);
    } catch (error) {
      console.error("Lead notification failed", lead.id, error.message);
      return reply(503, { success: false }, cors);
    }
    return reply(200, { success: true }, cors);
  };
}

module.exports = { main: createHandler(), createHandler, buildLead, buildMailBody, parseForm };
