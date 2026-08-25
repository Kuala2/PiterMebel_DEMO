import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Контакты и адрес производства — ${SITE_CONFIG.name}`,
  description: `Контакты мебельной студии «ПитерМебель» в Санкт-Петербурге: ул. Трефолева, 1П (район метро «Нарвская»). Запись на бесплатный замер и связь через сообщество ВКонтакте.`,
};

export default function ContactsPage() {
  return (
    <div>
      {/* 1. Subpage Hero Banner (70vh, Oak veneer panel & modules background) */}
      <section className="subpage-hero">
        <div className="subpage-hero-bg">
          <Image
            src="/img/projects/oak-veneer-panel/photo_1.jpg"
            alt="Контакты студии ПитерМебель"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 50%" }}
          />
        </div>
        <div className="subpage-hero-overlay" />
        <div className="container subpage-hero-content">
          <h1 className="subpage-hero-title">Контакты студии «ПитерМебель»</h1>
        </div>
      </section>

      {/* 2. Subtitle Intro Bar (Below Banner) */}
      <section className="subpage-intro-bar">
        <div className="container">
          <p className="subpage-intro-desc" style={{ marginBottom: 0 }}>
            Свяжитесь с нами удобным для вас способом: отправьте эскиз или проект в сообщество ВКонтакте, запишитесь на бесплатный выездной замер или приезжайте в цех на Трефолева.
          </p>
        </div>
      </section>

      {/* 2. Fast-Track Interaction Ways (Tone 1: #0A0C0E) */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "70px", paddingBottom: "70px" }}>
        <div className="container">
          <div className="steps-header" style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>3 способа начать работу над проектом</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {/* Way 1: Online */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", background: "var(--color-green-subtle)", color: "var(--color-green-brand)", border: "1px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-green-brand)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Экспресс · 30 минут
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Онлайн-оценка по эскизу
                </h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6", margin: 0 }}>
                  Пришлите понравившееся фото из интернета, схему от руки или размеры стен в чат ВКонтакте. Технолог сделает предварительный расчет сметы.
                </p>
              </div>
              <a
                href={SITE_CONFIG.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-green btn-sm"
                style={{ width: "100%", gap: "8px" }}
              >
                <VkIcon />
                Отправить эскиз в VK
              </a>
            </div>

            {/* Way 2: Measurement */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-green)",
                borderRadius: "var(--radius-md)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
                position: "relative",
                boxShadow: "0 4px 16px rgba(114, 186, 56, 0.15)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", background: "var(--color-green-brand)", color: "#0D0F11", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 3L3 21" /><path d="M14 3l7 7-4 4-7-7 4-4z" />
                    </svg>
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-green-brand)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Выездной замер · Бесплатно
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Замер с чемоданом образцов
                </h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6", margin: 0 }}>
                  Инженер приедет к вам в Санкт-Петербурге, выполнит лазерное сканирование стен, привезет веера эмалей RAL, образцы Fenix и натуральный шпон.
                </p>
              </div>
              <a href="#measure" className="btn btn-green btn-sm" style={{ width: "100%" }}>
                Вызвать мастера на замер
              </a>
            </div>

            {/* Way 3: Workshop Visit */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", background: "var(--color-green-subtle)", color: "var(--color-green-brand)", border: "1px solid var(--border-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-green-brand)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Визит на производство
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Встреча в цеху на Трефолева
                </h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6", margin: 0 }}>
                  Посмотрите на станки, проверьте точность присадки и оцените качество сборки мебели вживую перед заключением договора.
                </p>
              </div>
              <a
                href="https://yandex.ru/maps/?text=Санкт-Петербург+ул+Трефолева+1П"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-green btn-sm"
                style={{ width: "100%" }}
              >
                Проложить маршрут в цех →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Form Section (Tone 2: #101317) */}
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Запишитесь на замер помещения
                </h2>
                <p className="final-desc">
                  Инженер студии приедет в удобное для вас время с чемоданом образцов материалов (Fenix, эмаль по RAL, шпон дуба, камень), выполнит лазерный замер и проконсультирует по нюансам монтажа.
                </p>
                <div className="final-buttons-row">
                  <a
                    href={SITE_CONFIG.vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-green"
                    style={{ gap: "10px" }}
                  >
                    <VkIcon />
                    Обсудить в сообществе ВКонтакте
                  </a>
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
