import type { Metadata } from "next";
import Link from "next/link";
import LeadSection from "@/components/LeadSection";
import VkIcon from "@/components/VkIcon";
import TelegramIcon from "@/components/TelegramIcon";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import MaxIcon from "@/components/MaxIcon";
import YandexOfficeMap from "@/components/YandexOfficeMap";
import { SITE_CONFIG } from "@/data/site";
import PageHeader from "@/components/PageHeader";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Контакты студии — ${SITE_CONFIG.name}`,
  description: `Контакты студии «ПитерМебель»: офис на ${SITE_CONFIG.officeAddress}, ${SITE_CONFIG.metro}. Консультации по предварительной записи.`,
  alternates: {
    canonical: "/contacts/",
  },
  openGraph: buildOg(
    `Контакты студии — ${SITE_CONFIG.name}`,
    `Офис: ${SITE_CONFIG.officeAddress} (${SITE_CONFIG.metro}). Производство: ${SITE_CONFIG.productionAddress}.`,
    "/contacts"
  ),
};

export default function ContactsPage() {
  return (
    <div className="contacts-page">
      {/* 1. Page Header & Direct Channels */}
      <PageHeader title="Контакты и визиты в студию">
        <div className="contacts-channels-grid" data-sticky-cta-suppress>
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="contacts-channel-card is-primary"
          >
            <span className="contacts-channel-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span className="contacts-channel-body">
              <span className="contacts-channel-label">Телефон студии</span>
              <strong className="contacts-channel-title">{SITE_CONFIG.phone}</strong>
            </span>
            <span className="contacts-channel-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contacts-channel-card"
          >
            <span className="contacts-channel-icon" aria-hidden="true">
              <WhatsAppIcon size={22} />
            </span>
            <span className="contacts-channel-body">
              <span className="contacts-channel-label">Мессенджер</span>
              <strong className="contacts-channel-title">WhatsApp</strong>
            </span>
            <span className="contacts-channel-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href={SITE_CONFIG.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contacts-channel-card is-primary"
          >
            <span className="contacts-channel-icon" aria-hidden="true">
              <TelegramIcon size={22} />
            </span>
            <span className="contacts-channel-body">
              <span className="contacts-channel-label">Мессенджер</span>
              <strong className="contacts-channel-title">Telegram</strong>
            </span>
            <span className="contacts-channel-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href={SITE_CONFIG.maxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contacts-channel-card"
          >
            <span className="contacts-channel-icon" aria-hidden="true">
              <MaxIcon size={22} />
            </span>
            <span className="contacts-channel-body">
              <span className="contacts-channel-label">Мессенджер</span>
              <strong className="contacts-channel-title">Max</strong>
            </span>
            <span className="contacts-channel-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href={SITE_CONFIG.vkImUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contacts-channel-card is-primary"
          >
            <span className="contacts-channel-icon" aria-hidden="true">
              <VkIcon size={22} />
            </span>
            <span className="contacts-channel-body">
              <span className="contacts-channel-label">Сообщество и диалог</span>
              <strong className="contacts-channel-title">Написать ВКонтакте</strong>
            </span>
            <span className="contacts-channel-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="contacts-channel-card"
          >
            <span className="contacts-channel-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="0" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <span className="contacts-channel-body">
              <span className="contacts-channel-label">Почта для эскизов</span>
              <strong className="contacts-channel-title">{SITE_CONFIG.email}</strong>
            </span>
            <span className="contacts-channel-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </PageHeader>

      {/* 2. EDITORIAL GUARANTEES LINE */}
      <section style={{ padding: "64px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="contacts-editorial-guarantees">
            <div className="guarantee-item">
              <div className="guarantee-title">Договор и оплата</div>
              <p className="guarantee-desc">Заключаем договор с согласованной сметой. Оплатить заказ можно на расчётный счёт, по ссылке СБП, через терминал или в рассрочку.</p>
            </div>
            <div className="guarantee-item">
              <div className="guarantee-title">Сроки в договоре</div>
              <p className="guarantee-desc">Срок изготовления рассчитываем по выбранным материалам фасадов и комплектации и фиксируем вместе со сметой.</p>
            </div>
            <div className="guarantee-item">
              <div className="guarantee-title">Выезд на замер</div>
              <p className="guarantee-desc">После предварительного расчёта и согласования планировки специалист выезжает на адрес для точной привязки размеров.</p>
            </div>
            <div className="guarantee-item">
              <div className="guarantee-title">Монтаж под ключ</div>
              <p className="guarantee-desc">Штатная бригада собирает мебель и подключает бытовую технику, сантехнику и подсветку в день установки.</p>
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
                <h2 className="contacts-loc-title">Офис и образцы — пл. Стачек, 9, оф. 407</h2>
                <div className="contacts-loc-address">
                  {SITE_CONFIG.metro} (2 мин пешком) · БЦ «Кировский» · Пн–Пт 10:00–18:00 по записи
                </div>
                <p className="contacts-loc-desc">
                  В офисе обсуждаем планировку, показываем вживую образцы фасадов, столешниц и фурнитуры и составляем проект. Встречи проводим по предварительной записи.
                </p>
                <div>
                  <a
                    href={SITE_CONFIG.yandexMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-green btn-sm"
                    style={{ padding: "12px 20px", fontSize: "15px" }}
                  >
                    Открыть на Яндекс.Картах →
                  </a>
                </div>
              </div>

              {/* Location 2: Workshop */}
              <div className="contacts-loc-block">
                <h2 className="contacts-loc-title">Производственный цех — Петергофское шоссе, 73</h2>
                <p className="contacts-loc-desc">
                  Цех полного цикла на юго-западе Санкт-Петербурга: чистовой раскрой плитных материалов, кромление с прифуговкой и присадка отверстий под фурнитуру по рабочим чертежам.
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
      <LeadSection
        id="measure"
        source="Контакты"
      />
    </div>
  );
}
