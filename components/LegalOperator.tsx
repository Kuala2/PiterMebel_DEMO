import { LEGAL_DETAILS, hasConfirmedLegalDetails } from "@/data/legal";
import { SITE_CONFIG } from "@/data/site";

export default function LegalOperator() {
  return <>
    {hasConfirmedLegalDetails ? <p className="article-paragraph">
      Оператор: {LEGAL_DETAILS.legalStatus} {LEGAL_DETAILS.operatorLegalName}.
      ИНН: {LEGAL_DETAILS.inn}.{LEGAL_DETAILS.ogrnOrOgrnip && ` ОГРН/ОГРНИП: ${LEGAL_DETAILS.ogrnOrOgrnip}.`}
      {" "}Адрес для обращений по вопросам персональных данных: {LEGAL_DETAILS.contactAddress} (офис, по предварительной записи).
    </p> : <p className="article-paragraph">
      Реквизиты оператора уточняются. Приём заявок через формы и аналитика отключены.
      Документ будет дополнен до их включения; «ПитерМебель» — название студии.
    </p>}
    <p className="article-paragraph">
      По вопросам персональных данных: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
      Телефон: <a href={`tel:${SITE_CONFIG.phoneRaw}`}>{SITE_CONFIG.phone}</a>.
    </p>
  </>;
}
