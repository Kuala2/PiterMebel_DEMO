"use strict";

async function notify(lead, token) {
  const sender = process.env.POSTBOX_FROM;
  const recipient = process.env.LEAD_NOTIFY_TO;
  if (!sender || !recipient || !token) {
    throw new Error("Postbox is not configured");
  }
  const content = [
    `Новая заявка ${lead.id}`,
    `Телефон: ${lead.phone}`,
    `Тип мебели: ${lead.category}`,
    `Пожелания: ${lead.message}`,
    `Ссылка на эскиз: ${lead.sketch_url}`,
    `Источник: ${lead.source}`,
    `Калькулятор: ${lead.calculator_summary}`,
    `Страница: ${lead.page}`,
    `Время: ${lead.created_at}`,
  ].join("\n");
  const response = await fetch("https://postbox.cloud.yandex.net/v2/email/outbound-emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-YaCloud-SubjectToken": token },
    body: JSON.stringify({
      FromEmailAddress: sender,
      Destination: { ToAddresses: [recipient] },
      Content: { Simple: {
        Subject: { Data: `Заявка с сайта ПитерМебель ${lead.id}`, Charset: "UTF-8" },
        Body: { Text: { Data: content, Charset: "UTF-8" } },
      } },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Postbox returned ${response.status}`);
}

module.exports = { notify };
