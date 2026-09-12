/**
 * Юридические реквизиты не публикуются, пока владелец не подтвердит их.
 * После заполнения они автоматически появятся в футере и политике.
 */
export const LEGAL_DETAILS = {
  operatorLegalName: null as string | null,
  legalStatus: null as "ИП" | "ООО" | "Самозанятый" | "Физическое лицо" | null,
  inn: null as string | null,
  ogrnOrOgrnip: null as string | null,
  legalAddress: null as string | null,
};

export const hasConfirmedLegalDetails = Boolean(
  LEGAL_DETAILS.operatorLegalName && LEGAL_DETAILS.inn
);

