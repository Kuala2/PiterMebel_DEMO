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
export const PRIVACY_VERSION = "2026-09-29";
export const PRIVACY_DATE = "29 сентября 2026 года";

// Заполнять после проверки реальных договоров, баз и сроков: LEGAL_SETUP.md.
export const PROCESSING_SETUP = {
  approved: false,
  analyticsApproved: true,
  // Selected for future connection; approved stays false until deployment is verified.
  processors: [
    {
      name: "ООО «Яндекс.Облако» (Yandex Cloud)",
      address: "119021, Россия, г. Москва, ул. Льва Толстого, д. 16, пом. 528",
      purpose: "Облачный приём и хранение заявок и сведений о согласии, обработка запросов и отправка уведомлений оператору",
      databaseLocation: "Российская Федерация",
    },
    {
      name: "ООО «ЯНДЕКС» (Яндекс Почта)",
      address: "119021, Россия, г. Москва, ул. Льва Толстого, д. 16",
      purpose: "Доставка и хранение почтовых уведомлений о заявках в почтовом ящике оператора",
      databaseLocation: "Российская Федерация",
    },
  ] as { name: string; address: string; purpose: string; databaseLocation: string }[],
  analyticsProcessor: {
    name: "ООО «ЯНДЕКС» (сервис веб-аналитики Яндекс.Метрика)",
    address: "119021, Россия, г. Москва, ул. Льва Толстого, д. 16",
    purpose: "Веб-аналитика посещаемости и работы сайта (технические данные визита)",
    databaseLocation: "Российская Федерация",
  },
  leadRetentionDays: 90,
  technicalLogRetentionDays: 30,
};

export const canReceiveLeads = hasConfirmedLegalDetails && PROCESSING_SETUP.approved && PROCESSING_SETUP.processors.length > 0;
export const canUseAnalytics = hasConfirmedLegalDetails && PROCESSING_SETUP.analyticsApproved;
