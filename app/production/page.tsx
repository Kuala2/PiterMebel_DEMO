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
              <span className="prod-stat-num">Любой размер</span>
              <span className="prod-stat-label">Точный шаг деталей без наценки за нестандарт</span>
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
              Цех на Петергофском шоссе, 73 оснащён оборудованием для полного цикла обработки плитных материалов: от чистового раскроя до точной присадки под фурнитуру.
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
              <div className="prod-stage-badge">01 · Раскрой плит</div>
              <h3 className="prod-stage-title">Чистовой раскрой</h3>
              <p className="prod-stage-desc">
                Форматно-раскроечный станок с подрезным диском. Распиливаем плиты ЛДСП и МДФ точно по картам кроя под размеры помещения. Подрезной узел исключает появление сколов на ламинате.
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
              <div className="prod-stage-badge">02 · Кромление торцов</div>
              <h3 className="prod-stage-title">Кромление с прифуговкой</h3>
              <p className="prod-stage-desc">
                Кромкооблицовочный станок с узлом прифуговки. Алмазная фреза снимает микронеровности перед поклейкой кромки, обеспечивая плотный шов и надёжную защиту плиты от влаги.
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
              <div className="prod-stage-badge">03 · Отверстия под фурнитуру</div>
              <h3 className="prod-stage-title">Сверлильно-присадочные станки</h3>
              <p className="prod-stage-desc">
                Сверлим технологические отверстия под петли, стяжки и направляющие Blum и Hettich строго по чертежам, чтобы корпуса и фасады мебели собирались ровно и без перекосов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Преимущества работы напрямую с цехом: 3 конкретных факта вместо «воды» */}
      <section style={{ backgroundColor: "var(--bg-dark)", padding: "96px 0" }}>
        <div className="container">
          <div style={{ maxWidth: "760px", marginBottom: "44px" }}>
            <h2 className="section-title" style={{ marginBottom: "12px" }}>
              Преимущества работы напрямую с цехом
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "16px", lineHeight: "1.6", margin: 0 }}>
              Изготавливаем мебель под индивидуальные габариты помещения без посреднических наценок и ограничений типовой сетки.
            </p>
          </div>

          <div className="prod-benefits-grid">
            <div className="prod-benefit-item">
              <span className="prod-benefit-tag">Точность до миллиметра</span>
              <h3 className="prod-benefit-title">Без наценки за нестандарт</h3>
              <p className="prod-benefit-desc">
                В отличие от серийных фабрик со стандартными шкафами (30, 40, 60 см), мы распиливаем детали под точные размеры вашей ниши по стандартной стоимости материала.
              </p>
            </div>

            <div className="prod-benefit-item">
              <span className="prod-benefit-tag">Безопасность E1</span>
              <h3 className="prod-benefit-title">Проверенные европейские плиты</h3>
              <p className="prod-benefit-desc">
                Работаем с сертифицированным ЛДСП Egger и плотным МДФ с минимальным классом эмиссии. Мебель безопасна для спален и детских комнат.
              </p>
            </div>

            <div className="prod-benefit-item">
              <span className="prod-benefit-tag">Комфортная встреча</span>
              <h3 className="prod-benefit-title">Офис отдельно от цеха</h3>
              <p className="prod-benefit-desc">
                Встречи, подбор декоров вживую и проектирование проходят в уютном офисе на площади Стачек, 9. В цех на Петергофском шоссе уходят уже готовые чертежи.
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
