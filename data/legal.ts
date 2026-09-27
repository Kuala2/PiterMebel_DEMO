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

export const LEGAL_VERSION = "2026-09-27";
export const LEGAL_DATE = "27 сентября 2026 года";

// Заполнять после проверки реальных договоров, баз и сроков: LEGAL_SETUP.md.
export const PROCESSING_SETUP = {
  approved: false,
  analyticsApproved: false,
  processors: [] as { name: string; address: string; purpose: string; databaseLocation: string }[],
  leadRetentionDays: 90,
  technicalLogRetentionDays: 30,
};

export const canReceiveLeads = hasConfirmedLegalDetails && PROCESSING_SETUP.approved && PROCESSING_SETUP.processors.length > 0;
export const canUseAnalytics = hasConfirmedLegalDetails && PROCESSING_SETUP.analyticsApproved;
