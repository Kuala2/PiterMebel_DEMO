/** Подтверждённые владельцем сведения для политики и подвала сайта. */
export const LEGAL_DETAILS = {
  operatorLegalName: "Волкова Елена Михайловна" as string | null,
  legalStatus: "ИП" as "ИП" | "ООО" | "Самозанятый" | "Физическое лицо" | null,
  inn: "780720196029" as string | null,
  ogrnOrOgrnip: null as string | null,
  contactAddress: "г. Санкт-Петербург, пл. Стачек, 9, офис 407" as string | null,
};

export const hasConfirmedLegalDetails = Boolean(
  LEGAL_DETAILS.operatorLegalName && LEGAL_DETAILS.legalStatus && LEGAL_DETAILS.inn && LEGAL_DETAILS.contactAddress
);

export const LEGAL_VERSION = "2026-09-29";
export const LEGAL_DATE = "29 сентября 2026 года";
// Privacy and lead consent revisions are maintained independently.
// 2026-10-04: policy updated for the light lead scheme (no cloud storage, mail-only retention).
export const PRIVACY_VERSION = "2026-10-04";
export const PRIVACY_DATE = "4 октября 2026 года";

// Заполнять после проверки реальных договоров, баз и сроков: LEGAL_SETUP.md.
export const PROCESSING_SETUP = {
  approved: true,
  analyticsApproved: false,
  // Включено: обработчик развёрнут, уведомление в Роскомнадзор отправлено.
  processors: [
    {
      name: "ООО «Яндекс.Облако» (Yandex Cloud)",
      address: "119021, Россия, г. Москва, ул. Льва Толстого, д. 16, пом. 528",
      purpose: "Приём и серверная проверка заявок и сведений о согласии, отправка почтовых уведомлений оператору; заявки в облаке не хранятся",
      databaseLocation: "Российская Федерация",
    },
    {
      name: "ООО «ЯНДЕКС» (Яндекс Почта)",
      address: "119021, Россия, г. Москва, ул. Льва Толстого, д. 16",
      purpose: "Доставка и хранение почтовых уведомлений о заявках в почтовом ящике оператора",
      databaseLocation: "Российская Федерация",
    },
  ] as { name: string; address: string; purpose: string; databaseLocation: string }[],
  analyticsProcessor: null as { name: string; address: string; purpose: string; databaseLocation: string } | null,
  leadRetentionDays: 90,
  technicalLogRetentionDays: 30,
};

export const DEFAULT_LEAD_ENDPOINT = "https://functions.yandexcloud.net/d4eca99gj9rscbeuju4d";

export const canReceiveLeads = hasConfirmedLegalDetails && PROCESSING_SETUP.approved && PROCESSING_SETUP.processors.length > 0;
export const canUseAnalytics = false;

