import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { buildOg } from "@/lib/seo";
import { SITE_CONFIG } from "@/data/site";
import { LEGAL_DETAILS, hasConfirmedLegalDetails } from "@/data/legal";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | ПитерМебель",
  description:
    "Как студия «ПитерМебель» собирает, обрабатывает и защищает персональные данные посетителей сайта в соответствии с Федеральным законом № 152-ФЗ.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: buildOg(
    "Политика конфиденциальности | ПитерМебель",
    "Как студия «ПитерМебель» обрабатывает персональные данные посетителей сайта (ФЗ № 152-ФЗ).",
    "/privacy"
  ),
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page" style={{ minHeight: "100vh" }}>
      <PageHeader title="Политика конфиденциальности" backTo="/" />

      <section className="article-content-section">
        <div className="container article-narrow">
          <p className="article-paragraph" style={{ marginTop: 0 }}>
            Настоящая политика описывает, какие персональные данные получает студия «ПитерМебель»
            через этот сайт, зачем они используются и как вы можете управлять ими. Политика
            составлена в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных
            данных».
          </p>

          <section className="article-content-block">
            <h2 className="article-section-h2">1. Оператор персональных данных</h2>
            <p className="article-paragraph">
              Контакт студии «{SITE_CONFIG.name}» для вопросов по обработке данных:
              {" "}{SITE_CONFIG.email}, {SITE_CONFIG.phone}.
              Адрес офиса: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}).
            </p>
            {hasConfirmedLegalDetails && (
              <p className="article-paragraph">
                Оператор: {LEGAL_DETAILS.legalStatus} {LEGAL_DETAILS.operatorLegalName}, ИНН {LEGAL_DETAILS.inn}
                {LEGAL_DETAILS.ogrnOrOgrnip ? `, ОГРН/ОГРНИП ${LEGAL_DETAILS.ogrnOrOgrnip}` : ""}.
              </p>
            )}
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">2. Какие данные мы получаем</h2>
            <p className="article-paragraph">
              Через формы сайта (запись на консультацию, расчёт стоимости) вы можете передать:
              имя, номер телефона или адрес электронной почты, а также текст обращения и выбранные
              параметры проекта.
            </p>
            <p className="article-paragraph">
              Дополнительно сайт может получать технические данные: IP-адрес, тип устройства и
              браузера, просмотренные страницы, источник перехода и действия на сайте. Эти сведения
              используются для работы интерфейса, защиты формы и анализа посещаемости.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">3. Цели обработки</h2>
            <p className="article-paragraph">
              Данные используются только для связи с вами по оставленной заявке: уточнение
              пожеланий, предварительный расчёт стоимости, согласование визита в офис или замера,
              ответы на вопросы. Обезличенная статистика помогает улучшать сайт.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">4. Правовое основание</h2>
            <p className="article-paragraph">
              Основанием обработки данных, которые вы указываете в форме, является ваше согласие,
              выражаемое отметкой в соответствующем поле перед отправкой. Без отметки форма не
              отправляется и введённые в неё данные не передаются. Технические сведения могут
              обрабатываться при загрузке сайта сервисами, перечисленными в разделе 5.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">5. Сервисы обработки и хранение</h2>
            <p className="article-paragraph">
              Для приёма обращений сайт может использовать сервис обработки форм Web3Forms.
              Для статистики и отображения карты используются сервисы Яндекса. При обращении к этим
              сервисам им могут передаваться введённые вами данные или техническая информация согласно
              их условиям и политикам. Доступ также может предоставляться подрядчикам, которые обеспечивают
              работу сайта, только в объёме, необходимом для выполнения их задач.
            </p>
            <p className="article-paragraph">
              Данные хранятся не дольше, чем этого требуют цели обработки и применимые обязанности
              оператора, либо до отзыва согласия, если отсутствует иное законное основание обработки.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">6. Ваши права</h2>
            <p className="article-paragraph">
              Вы можете запросить сведения об обработке ваших данных, потребовать их уточнения
              или удаления, а также отозвать согласие — для этого направьте письмо на{" "}
              {SITE_CONFIG.email}. В обращении укажите контакт, который использовали в форме, чтобы
              мы могли найти вашу заявку.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">7. Изменения политики</h2>
            <p className="article-paragraph">
              Политика может обновляться. Актуальная редакция всегда размещена на этой странице.
              Последнее обновление: 12 сентября 2026 года.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
