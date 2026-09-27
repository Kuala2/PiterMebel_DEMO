"use strict";

const { createHmac } = require("node:crypto");

function config() {
  const endpoint = process.env.YDB_DOCUMENT_ENDPOINT;
  const table = process.env.YDB_LEADS_TABLE;
  if (!endpoint || !/^https:\/\/docapi\.serverless\.yandexcloud\.net\/ru-central1\//.test(endpoint) || !table || !/^[\w.-]{3,255}$/.test(table)) {
    throw new Error("YDB is not configured");
  }
  return { endpoint, table };
}

async function callYdb(action, payload, token) {
  const { endpoint } = config();
  if (!token) throw new Error("Function service account token is missing");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-amz-json-1.0",
      "X-Amz-Target": `DynamoDB_20120810.${action}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const type = String(data.__type || data.code || "");
    if (type.includes("ConditionalCheckFailed")) return { conditionalFailure: true };
    throw new Error(`YDB ${action} failed: ${response.status} ${type.slice(0, 80)}`);
  }
  return data;
}

function digest(value) {
  const key = process.env.LEAD_HASH_KEY;
  if (!key || key.length < 32) throw new Error("LEAD_HASH_KEY is missing or too short");
  return createHmac("sha256", key).update(value).digest("hex");
}

async function isRateLimited(phone, now, token) {
  const { table } = config();
  const window = Math.floor(now / 600000);
  const hash = digest(phone.replace(/\D/g, ""));
  for (let slot = 0; slot < 3; slot++) {
    const result = await callYdb("PutItem", {
      TableName: table,
      Item: {
        id: { S: `rate#${hash}#${window}#${slot}` },
        kind: { S: "rate" },
        expires_at: { N: String(Math.floor(now / 1000) + 1200) },
      },
      ConditionExpression: "attribute_not_exists(id)",
    }, token);
    if (!result.conditionalFailure) return false;
  }
  return true;
}

async function saveLead(lead, token) {
  const { table } = config();
  const item = { id: { S: `lead#${lead.id}` }, kind: { S: "lead" } };
  for (const [key, value] of Object.entries(lead)) {
    if (key === "id") continue;
    item[key] = key === "expires_at" ? { N: String(value) } : { S: String(value) };
  }
  const result = await callYdb("PutItem", {
    TableName: table,
    Item: item,
    ConditionExpression: "attribute_not_exists(id)",
  }, token);
  return !result.conditionalFailure;
}

async function getLead(id, token) {
  const { table } = config();
  const result = await callYdb("GetItem", {
    TableName: table,
    Key: { id: { S: `lead#${id}` } },
    ConsistentRead: true,
  }, token);
  if (!result.Item) return null;
  const lead = Object.fromEntries(Object.entries(result.Item).map(([key, value]) => [key, value.S ?? value.N]));
  lead.id = id;
  return lead;
}

async function markNotified(id, token) {
  const { table } = config();
  await callYdb("UpdateItem", {
    TableName: table,
    Key: { id: { S: `lead#${id}` } },
    UpdateExpression: "SET notification_status = :sent, notified_at = :time",
    ConditionExpression: "attribute_exists(id)",
    ExpressionAttributeValues: {
      ":sent": { S: "sent" },
      ":time": { S: new Date().toISOString() },
    },
  }, token);
}

module.exports = { saveLead, getLead, markNotified, isRateLimited, callYdb };
