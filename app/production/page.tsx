import Image from "next/image";
import type { Metadata } from "next";
import LeadSection from "@/components/LeadSection";
import { SITE_CONFIG, yearsInBusiness } from "@/data/site";
import PageHeader from "@/components/PageHeader";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Собственное производство мебели — ${SITE_CONFIG.name} в СПб`,
  description: `Собственный мебельный цех на Петергофском шоссе, 73. Раскрой плит, кромление с прифуговкой и присадка под фурнитуру. Мебель на заказ с ${SITE_CONFIG.foundingYear} года.`,
  alternates: {
    canonical: "/production/",
  },
  openGraph: buildOg(
    `Собственное производство мебели — ${SITE_CONFIG.name} в СПб`,
    `Собственный мебельный цех на Петергофском шоссе, 73. Раскрой плит, кромление с прифуговкой и присадка под фурнитуру с ${SITE_CONFIG.foundingYear} года.`,
    "/production"
  ),
};

export default function ProductionPage() {
  return (
    <div>
      {/* 1. Page Header */}
      <PageHeader title="Собственное производство мебели в Санкт-Петербурге" />

      {/* 2. Key Facts Strip */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="prod-stats-strip">
            <div className="prod-stat-item">
              <span className="prod-stat-num">{yearsInBusiness()}</span>
              <span className="prod-stat-label">Опыт работы в Санкт-Петербурге с {SITE_CONFIG.foundingYear} года</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">1500+</span>
              <span className="prod-stat-label">Реализованных проектов мебели</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">Полный цикл</span>
              <span className="prod-stat-label">Раскрой, кромление и присадка в своём цеху</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">Свои мастера</span>
              <span className="prod-stat-label">Доставка, сборка и подключение техники штатной бригадой</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Станочный парк: 3 этапа производства с реальными фото цеха */}
      <section style={{ backgroundColor: "var(--bg-studio)", padding: "96px 0" }}>
        <div className="container">
          <div style={{ maxWidth: "760px", marginBottom: "48px" }}>
            <h2 className="section-title" style={{ marginBottom: "12px" }}>
              Станочный парк цеха
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "16px", lineHeight: "1.6", margin: 0 }}>
              Цех на Петергофском шоссе, 73 оснащён оборудованием для полного цикла обработки плитных материалов: от чистового раскроя до сверловки под фурнитуру.
            </p>
          </div>

          <div className="prod-stages-row">
            {/* Этап 1: Раскрой */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/panel-cutting.webp"
                  alt="Форматно-раскроечный станок для чистового распила ЛДСП и МДФ"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">Чистовой раскрой плит</h3>
              <p className="prod-stage-desc">
                Распиливаем листы ЛДСП и МДФ на форматно-раскроечном станке по картам кроя. Подрезной диск проходит ламинат перед основной пилой и оставляет край детали ровным, без сколов.
              </p>
            </div>

            {/* Этап 2: Кромление с прифуговкой */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/edge-banding.webp"
                  alt="Кромкооблицовочный станок с узлом прифуговки"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">Кромление с прифуговкой</h3>
              <p className="prod-stage-desc">
                Перед поклейкой кромки алмазная фреза станка снимает микроступеньку от пилы. Кромка плотно ложится на выровненный торец с минимальным клеевым швом и защищает плиту от влаги.
              </p>
            </div>

            {/* Этап 3: Присадка под фурнитуру */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/line-boring.webp"
                  alt="Мастер студии «ПитерМебель» за присадочным станком в цеху"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">Присадка под фурнитуру</h3>
              <p className="prod-stage-desc">
                Сверлим глухие и сквозные отверстия под петли, стяжки и направляющие на присадочных станках строго по чертежам. За счёт точной сверловки корпуса собираются без перекосов и с ровными зазорами фасадов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Преимущества работы напрямую с цехом */}
      <section style={{ backgroundColor: "var(--bg-dark)", padding: "96px 0" }}>
        <div className="container">
          <div style={{ maxWidth: "760px", marginBottom: "44px" }}>
            <h2 className="section-title" style={{ marginBottom: "12px" }}>
              Преимущества заказа напрямую с производства
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "16px", lineHeight: "1.6", margin: 0 }}>
              Работаем без дилеров и посредников: сами проектируем мебель, изготавливаем детали в цеху и устанавливаем на объекте.
            </p>
          </div>

          <div className="prod-benefits-grid">
            <div className="prod-benefit-item">
              <h3 className="prod-benefit-title">Любой размер без доплаты за нестандарт</h3>
              <p className="prod-benefit-desc">
                Серийные фабрики работают по стандартному шагу модулей 30, 40 и 60 см и берут наценку за отступ от сетки. В своём цеху мы сразу распиливаем детали с точностью до миллиметра под вашу нишу или выступ стены по обычной цене материала.
              </p>
            </div>

            <div className="prod-benefit-item">
              <h3 className="prod-benefit-title">Прямая смета по раскрою без наценок салонов</h3>
              <p className="prod-benefit-desc">
                В стоимость не заложены аренда шоурумов в мебельных центрах и комиссия посредников. Считаем заказ по фактическому количеству листов материала, площади фасадов и списку фурнитуры — и фиксируем итоговую сумму в договоре.
              </p>
            </div>

            <div className="prod-benefit-item">
              <h3 className="prod-benefit-title">Одна команда от чертежа до монтажа</h3>
              <p className="prod-benefit-desc">
                Проектировщик, мастера в цеху на Петергофском шоссе, 73 и штатные сборщики работают в одной связке. Сложные углы, короба и вырезы под трубы продумываются на этапе рабочих чертежей и распила, без перекладывания ответственности между салоном и сторонней фабрикой.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Финальный блок: Консультация и форма */}
      <LeadSection
        id="consult"
        source="Производство"
      />
    </div>
  );
}
