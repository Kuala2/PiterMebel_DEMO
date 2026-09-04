import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import YandexOfficeMap from "@/components/YandexOfficeMap";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Контакты студии — ${SITE_CONFIG.name}`,
  description: `Контакты мебельной студии «ПитерМебель»: офис на ${SITE_CONFIG.officeAddress} (${SITE_CONFIG.metro}, по предварительной записи) и производство на ${SITE_CONFIG.productionAddress}. Консультации и предварительный расчет проекта.`,
};

export default function ContactsPage() {
  return (
    <div className="contacts-page">
      {/* 1. Page Header & Direct Channels */}
      <section
        className="page-header"
        style={{ paddingBottom: "48px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="container">
          <h1 className="subpage-hero-title">Контакты и визиты в студию</h1>
          <p className="subpage-hero-caption">
            Санкт-Петербург · Офис на площади Стачек, 9 · Собственное производство на Петергофском ш., 73
          </p>

          {/* Direct Communication Channels (Clean Canvas Actions) */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "28px", alignItems: "center" }}>
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
              href={SITE_CONFIG.vkImUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass"
              style={{ gap: "8px" }}
            >
              <VkIcon />
              Написать ВКонтакте
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="btn btn-glass"
              style={{ gap: "8px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="0" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {SITE_CONFIG.email}
            </a>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL GUARANTEES LINE */}
      <section style={{ padding: "64px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="contacts-editorial-guarantees">
            <div className="guarantee-item">
              <span className="guarantee-label">01</span>
              <div className="guarantee-title">Договор и оплата</div>
              <p className="guarantee-desc">Официальный договор. Оплата на расчетный счет, по реквизитам, по ссылке или через терминал.</p>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-label">02</span>
              <div className="guarantee-title">Точные сроки</div>
              <p className="guarantee-desc">Срок изготовления 14–21 день с финансовой гарантией по договору.</p>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-label">03</span>
              <div className="guarantee-title">Прямой цех</div>
              <p className="guarantee-desc">Без наценок салонов, посредников и аренды в торговых центрах.</p>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-label">04</span>
              <div className="guarantee-title">Чистый монтаж</div>
              <p className="guarantee-desc">Штатная бригада мастеров, подключение техники и вывоз мусора.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOCATIONS SHOWCASE: Студия образцов + Станочный цех + Яндекс.Карта */}
      <section style={{ padding: "112px 0", backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="contacts-split-showcase">
            {/* Left Column (44%): The 2 Real Factory Locations */}
            <div className="contacts-loc-list">
              {/* Location 1: Studio */}
              <div className="contacts-loc-block">
                <span className="contacts-loc-tag">Офис встреч и студия образцов</span>
                <h2 className="contacts-loc-title">пл. Стачек, 9 (офис 407)</h2>
                <div className="contacts-loc-address">
                  {SITE_CONFIG.metro} (2 мин пешком) · БЦ Кировский
                </div>
                <p className="contacts-loc-desc">
                  Экспозиция вееров эмалей по RAL/NCS, тактильные образцы шпона, плит Egger и механизмы Blum. Встречи строго по предварительной записи для детальной работы над проектом.
                </p>
                <div>
                  <a
                    href={SITE_CONFIG.yandexMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-green btn-sm"
                    style={{ padding: "12px 20px", fontSize: "14.5px" }}
                  >
                    Открыть на Яндекс.Картах →
                  </a>
                </div>
              </div>

              {/* Location 2: Workshop */}
              <div className="contacts-loc-block">
                <span className="contacts-loc-tag">Собственное производство</span>
                <h3 className="contacts-loc-title">Петергофское шоссе, 73</h3>
                <div className="contacts-loc-address">
                  Промышленная зона юго-запада СПб · закрытая территория
                </div>
                <p className="contacts-loc-desc">
                  Станочный цех чистового раскроя, качественная кромкооблицовка и 100% контрольная сборка перед доставкой заказчику.
                </p>
              </div>
            </div>

            {/* Right Column (56%): Yandex Office Map */}
            <div className="contacts-map-frame">
              <YandexOfficeMap />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Consultation Booking */}
      <section className="final-section" id="measure">
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <div>
                  <h2 className="final-headline">
                    Обсудить проект лично или онлайн
                  </h2>
                  <p className="final-desc">
                    Оставьте заявку на расчет или свяжитесь напрямую — технолог сориентирует по материалам, срокам и согласует удобное время встречи на площади Стачек, 9.
                  </p>
                  <div className="final-buttons-row">
                    <a
                      href={`tel:${SITE_CONFIG.phoneRaw}`}
                      className="btn btn-green"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {SITE_CONFIG.phone}
                    </a>
                    <a
                      href={SITE_CONFIG.vkImUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-glass"
                    >
                      <VkIcon />
                      ВКонтакте
                    </a>
                  </div>
                </div>
                <div className="final-subtext-note">
                  Офис: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}) · Пн – Пт: с 10:00 до 18:00 (по записи)
                </div>
              </div>

              <div className="final-info-block">
                <MeasureForm initialCategory="Консультация в офисе" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
