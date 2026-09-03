import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import YandexOfficeMap from "@/components/YandexOfficeMap";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Контакты студии — ${SITE_CONFIG.name}`,
  description: `Контакты мебельной студии «ПитерМебель» в Санкт-Петербурге: ${SITE_CONFIG.address} (${SITE_CONFIG.metro}). Встречи в офисе по записи и бесплатный выезд инженера на замер.`,
};

export default function ContactsPage() {
  return (
    <div className="contacts-page">
      {/* 1. Page Header (Линия только под шапкой, без дублирования адреса) */}
      <section
        className="page-header"
        style={{ paddingBottom: "36px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="container">
          <h1 className="subpage-hero-title">Контакты студии</h1>
          <p className="subpage-hero-caption">
            Консультации, расчет сметы и встречи по предварительной записи
          </p>
        </div>
      </section>

      {/* 2. Direct Action Bar (Без надписи сверху, без полосы снизу) */}
      <section className="contacts-action-section">
        <div className="container">
          <div className="contacts-editorial-bar">
            <div className="contacts-bar-group">
              <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="contacts-bar-phone">
                {SITE_CONFIG.phone}
              </a>
              <div className="contacts-bar-sub">
                <span className="contacts-live-dot" />
                <span>Елена Волкова — консультации и расчёт сметы · Пн–Пт с 10:00 до 20:00</span>
              </div>
            </div>

            <div className="contacts-bar-buttons">
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="btn btn-green contacts-action-btn"
                style={{ gap: "8px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Позвонить
              </a>
              <a
                href={SITE_CONFIG.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass contacts-action-btn"
                style={{ gap: "8px" }}
              >
                <VkIcon />
                Написать в VK
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE: Офис и интерактивная карта Яндекс (Сплит 50/50: Инфо + Карта) */}
      <section style={{ padding: "88px 0" }}>
        <div className="container">
          <div className="contacts-editorial-split">
            {/* Left 50%: Office Info with unified location details */}
            <div className="contacts-office-editorial">
              <h2 className="contacts-office-title">
                Офис на площади Стачек, 9 (м. «Нарвская»)
              </h2>
              <div className="contacts-office-address">
                4 этаж · 2 минуты пешком от метро, напротив Нарвских триумфальных ворот
              </div>

              <div className="contacts-office-bullets">
                <div className="contacts-bullet-item">
                  <span style={{ color: "var(--color-green-brand)", fontWeight: 700 }}>—</span>
                  <div>
                    <span className="contacts-bullet-lead">Образцы и материалы: </span>
                    в офисе можно вживую посмотреть и сравнить цвета эмалей, фактуры шпона дуба и протестировать механизмы Blum.
                  </div>
                </div>

                <div className="contacts-bullet-item">
                  <span style={{ color: "var(--color-green-brand)", fontWeight: 700 }}>—</span>
                  <div>
                    <span className="contacts-bullet-lead">Обсуждение проекта: </span>
                    вместе разберем планировку, подскажем удобные решения для техники и сразу посчитаем точную стоимость без скрытых доплат.
                  </div>
                </div>

                <div className="contacts-bullet-item">
                  <span style={{ color: "var(--color-green-brand)", fontWeight: 700 }}>—</span>
                  <div>
                    <span className="contacts-bullet-lead">Встречи по договорённости: </span>
                    пожалуйста, позвоните или напишите перед визитом, чтобы мы были на месте и подготовили нужные материалы к вашему приходу.
                  </div>
                </div>
              </div>

              <div className="contacts-office-actions">
                <a
                  href={SITE_CONFIG.yandexMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-green contacts-action-btn"
                  style={{ gap: "8px" }}
                >
                  Открыть в Яндекс.Картах →
                </a>

                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="contacts-email-link"
                >
                  Проекты и чертежи: <strong>{SITE_CONFIG.email}</strong>
                </a>
              </div>
            </div>

            {/* Right 50%: Real Yandex Map without annoying balloon */}
            <div className="contacts-map-frame">
              <YandexOfficeMap />
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE SCENARIOS: Как начать работу (Без рамок, свободные 3 колонки) */}
      <section style={{ padding: "88px 0" }}>
        <div className="container">
          <div style={{ marginBottom: "16px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Как начать работу
            </h2>
          </div>

          <div className="contacts-scenarios-editorial">
            <div className="contacts-scenario-col">
              <span className="contacts-scenario-num">01 / ВСТРЕЧА В ОФИСЕ</span>
              <h3 className="contacts-scenario-title">Подбор материалов и 3D-проект</h3>
              <p className="contacts-scenario-desc">
                Согласуйте удобный день для визита на площадь Стачек, 9. За чашкой кофе подберем сочетания эмалей и шпона, разберем эргономику и составим точную смету.
              </p>
            </div>

            <div className="contacts-scenario-col">
              <span className="contacts-scenario-num">02 / ВЫЕЗД ИНЖЕНЕРА</span>
              <h3 className="contacts-scenario-title">Бесплатный лазерный замер</h3>
              <p className="contacts-scenario-desc">
                Мастер бесплатно приедет к вам на объект в Санкт-Петербурге или ЛО с чемоданом образцов и лазерным сканером стен, углов и коммуникаций.
              </p>
            </div>

            <div className="contacts-scenario-col">
              <span className="contacts-scenario-num">03 / ОНЛАЙН-РАСЧЁТ</span>
              <h3 className="contacts-scenario-title">Смета за 2 часа по фото или эскизу</h3>
              <p className="contacts-scenario-desc">
                Пришлите фото понравившейся мебели или чертеж от руки в чат сообщества ВКонтакте. Технолог рассчитает честную стоимость под ваш бюджет.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CANVAS CTA: Запись на визит в офис или замер */}
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Запишитесь на визит в офис или замер
                </h2>
                <p className="final-desc">
                  Оставьте контакты — специалист студии свяжется с вами в течение 15 минут, ответит на технологические вопросы и согласует удобное время для визита в офис на площади Стачек либо бесплатного выезда инженера к вам на объект.
                </p>
                <div className="final-buttons-row">
                  <a
                    href={`tel:${SITE_CONFIG.phoneRaw}`}
                    className="btn btn-green"
                    style={{ gap: "8px" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {SITE_CONFIG.phone}
                  </a>
                  <a
                    href={SITE_CONFIG.vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-glass"
                    style={{ gap: "10px" }}
                  >
                    <VkIcon />
                    ВКонтакте
                  </a>
                </div>
                <div style={{ fontSize: "13.5px", color: "var(--color-text-muted)", marginTop: "18px" }}>
                  Офис: {SITE_CONFIG.address} ({SITE_CONFIG.metro}) · Пн – Пт: с 10:00 до 20:00
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory="Запрос со страницы контактов" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
