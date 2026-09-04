import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Производство — ${SITE_CONFIG.name} в Санкт-Петербурге`,
  description: `Собственное производство мебели по индивидуальным размерам с ${SITE_CONFIG.foundedYear} года в Санкт-Петербурге (Петергофское шоссе, 73). Прямой заказ без салонных наценок и 100% контрольная сборка в цеху.`,
};

export default function ProductionPage() {
  return (
    <div>
      {/* 1. Page Header (Стандартный заголовок подраздела, как на всех страницах) */}
      <section className="page-header" style={{ paddingBottom: "36px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="container">
          <h1 className="subpage-hero-title">Собственное производство в Санкт-Петербурге</h1>
          <p className="subpage-hero-caption">
            Станочный цех на Петергофском шоссе, 73 · Работаем напрямую с {SITE_CONFIG.foundedYear} года
          </p>
        </div>
      </section>

      {/* 2. Key Facts Strip (Чистая горизонтальная строка цифр на холсте) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="prod-stats-strip">
            <div className="prod-stat-item">
              <span className="prod-stat-num">20 лет</span>
              <span className="prod-stat-label">Опыт в Санкт-Петербурге с {SITE_CONFIG.foundedYear} г.</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">1500+</span>
              <span className="prod-stat-label">Установленных проектов мебели под ключ</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">100%</span>
              <span className="prod-stat-label">Контрольная сборка модулей в цеху</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">0 ₽</span>
              <span className="prod-stat-label">Без наценок салонов и посредников</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Showcase: Реальность цеха и принципы (Сплит 58/42, естественные пропорции 3:2, без плиток) */}
      <section style={{ backgroundColor: "var(--bg-studio)", padding: "112px 0" }}>
        <div className="container">
          <div className="prod-showcase-split">
            {/* Левая колонка: Естественное фото мастера в цеху без обрезки */}
            <div className="prod-showcase-media">
              <Image
                src="/img/production/assembly.jpg"
                alt="Мастер за форматно-раскроечным стапелем в цеху ПитерМебель"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                style={{ objectFit: "cover" }}
              />
              <div className="prod-showcase-badge">
                <span className="dot" />
                Цех: {SITE_CONFIG.productionAddress}
              </div>
            </div>

            {/* Правая колонка: Единые заголовки без бровей-дубликатов и лишней воды */}
            <div className="prod-showcase-text">
              <h2 className="section-title" style={{ marginBottom: "0" }}>
                Прямой заказ у производителя
              </h2>

              <div className="prod-showcase-item">
                <h3 className="prod-showcase-title">
                  <span className="prod-accent-num">01 · </span>Без наценок салонов
                </h3>
                <p className="prod-showcase-desc">
                  Прямой расчет стоимости без расходов на аренду торговых залов и дилерских комиссий.
                </p>
              </div>

              <div className="prod-showcase-item">
                <h3 className="prod-showcase-title">
                  <span className="prod-accent-num">02 · </span>100% контрольная сборка
                </h3>
                <p className="prod-showcase-desc">
                  Каждый гарнитур предварительно собираем и проверяем в цеху до отправки на адрес.
                </p>
              </div>

              <div className="prod-showcase-item">
                <h3 className="prod-showcase-title">
                  <span className="prod-accent-num">03 · </span>Подгонка под геометрию стен
                </h3>
                <p className="prod-showcase-desc">
                  Изготовление точно под потолок и ниши с обходом балок, вентшахт и скрытых труб.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Фабричный цикл: 3 этапа с фото в естественных пропорциях 3:2 (Без дубликатов заголовков) */}
      <section style={{ backgroundColor: "var(--bg-dark)", padding: "112px 0" }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: "28px" }}>
            Участки производства
          </h2>

          <div className="prod-stages-row">
            {/* Этап 1: Раскрой */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/hero.jpg"
                  alt="Станочный чистовой раскрой плитных материалов"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">
                <span className="prod-accent-num">01 · </span>Раскрой плит
              </h3>
              <p className="prod-stage-desc">
                Чистовой распил ЛДСП Egger и МДФ без сколов.
              </p>
            </div>

            {/* Этап 2: Кромление */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/edge.jpg"
                  alt="Обработка и влагостойкое кромление торцов"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">
                <span className="prod-accent-num">02 · </span>Кромление торцов
              </h3>
              <p className="prod-stage-desc">
                Влагостойкая защита деталей от пара и влаги.
              </p>
            </div>

            {/* Этап 3: Присадка и сборка */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/cnc.jpg"
                  alt="Присадка отверстий и проверка фурнитуры"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">
                <span className="prod-accent-num">03 · </span>Присадка и сборка
              </h3>
              <p className="prod-stage-desc">
                Сверление под фурнитуру Blum и регулировка плавности хода.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Порядок работы над заказом (Лаконичная строка без простыней текста) */}
      <section style={{ backgroundColor: "var(--bg-studio)", padding: "112px 0" }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: "28px" }}>
            Порядок работы
          </h2>

          <div className="prod-linear-track">
            <div className="prod-step-col">
              <span className="prod-step-num">01</span>
              <h3 className="prod-step-title">Расчет сметы</h3>
              <p className="prod-step-desc">
                По размерам или эскизу
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">02</span>
              <h3 className="prod-step-title">Встреча в офисе</h3>
              <p className="prod-step-desc">
                Выбор материалов на Стачек, 9
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">03</span>
              <h3 className="prod-step-title">Точный замер</h3>
              <p className="prod-step-desc">
                Лазерная съемка помещения
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">04</span>
              <h3 className="prod-step-title">Изготовление</h3>
              <p className="prod-step-desc">
                В цеху на Петергофском ш., 73
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">05</span>
              <h3 className="prod-step-title">Чистый монтаж</h3>
              <p className="prod-step-desc">
                Установка и уборка
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Финальный блок: Консультация и форма */}
      <section className="final-section" id="consult" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Консультация и расчет проекта
                </h2>
                <p className="final-desc">
                  Встречи для обсуждения проекта и подбора материалов проходят в офисе студии на площади Стачек, 9 (по записи). Станочный цех расположен на Петергофском шоссе, 73. Также вы можете отправить размеры для онлайн-расчета сметы.
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
                    href={SITE_CONFIG.vkImUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-glass"
                    style={{ gap: "10px" }}
                  >
                    <VkIcon />
                    ВКонтакте
                  </a>
                  <Link href="/calculator" className="btn btn-glass">
                    Калькулятор стоимости
                  </Link>
                </div>
                <div style={{ fontSize: "13.5px", color: "var(--color-text-muted)", marginTop: "18px" }}>
                  Офис: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи) · Цех: {SITE_CONFIG.productionAddress}
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory="Консультация и расчет проекта" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
