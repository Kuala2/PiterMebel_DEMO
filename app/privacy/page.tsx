import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { buildOg } from "@/lib/seo";
import { SITE_CONFIG } from "@/data/site";

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

      <main className="article-content-section">
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
              Оператор — студия мебели «{SITE_CONFIG.name}». Контакт для вопросов по обработке
              данных: {SITE_CONFIG.email}, {SITE_CONFIG.phone}. Адрес офиса: {SITE_CONFIG.officeAddress}
              {" "}({SITE_CONFIG.metro}).
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">2. Какие данные мы получаем</h2>
            <p className="article-paragraph">
              Через формы сайта (запись на консультацию, расчёт стоимости) вы можете передать:
              имя, номер телефона или адрес электронной почты, а также текст обращения и выбранные
              параметры проекта.
            </p>
            <p className="article-paragraph">
              Дополнительно сайт использует файлы cookie и обезличенные данные аналитики (тип
              браузера, просмотренные страницы) для корректной работы интерфейса и статистики посещений.
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
              Основанием обработки является ваше согласие, выражаемое отметкой в соответствующем
              поле формы перед её отправкой. Без отметки форма не отправляется, и данные не
              собираются.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">5. Хранение и передача третьим лицам</h2>
            <p className="article-paragraph">
              Данные хранятся до достижения целей обработки либо до отзыва вашего согласия.
              Мы не передаём персональные данные третьим лицам, за исключением случаев,
              прямо предусмотренных законодательством Российской Федерации.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">6. Ваши права</h2>
            <p className="article-paragraph">
              Вы можете запросить сведения об обработке ваших данных, потребовать их уточнения
              или удаления, а также отозвать согласие — для этого направьте письмо на{" "}
              {SITE_CONFIG.email}. Мы ответим в срок не позднее 10 рабочих дней.
            </p>
          </section>

          <section className="article-content-block">
            <h2 className="article-section-h2">7. Изменения политики</h2>
            <p className="article-paragraph">
              Политика может обновляться. Актуальная редакция всегда размещена на этой странице.
              Последнее обновление: 6 сентября 2026 года.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
