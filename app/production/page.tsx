import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import LeadSection from "@/components/LeadSection";
import { SITE_CONFIG, yearsInBusiness } from "@/data/site";
import PageHeader from "@/components/PageHeader";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Производство — ${SITE_CONFIG.name} в Санкт-Петербурге`,
  description: `Производство мебели по индивидуальным размерам в Санкт-Петербурге с ${SITE_CONFIG.foundingYear} года. Цех на Петергофском шоссе, 73.`,
  alternates: {
    canonical: "/production",
  },
  openGraph: buildOg(
    `Производство — ${SITE_CONFIG.name} в Санкт-Петербурге`,
    `Производство мебели по индивидуальным размерам с ${SITE_CONFIG.foundingYear} года. Цех на Петергофском шоссе, 73.`,
    "/production"
  ),
};

export default function ProductionPage() {
  return (
    <div>
      {/* 1. Page Header (Стандартный заголовок подраздела, как на всех страницах) */}
      <PageHeader title="Собственное производство мебели в Санкт-Петербурге" />

      {/* 2. Key Facts Strip (Чистая горизонтальная строка цифр на холсте) */}
      <section style={{ padding: "48px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="prod-stats-strip">
            <div className="prod-stat-item">
              <span className="prod-stat-num">{yearsInBusiness()}</span>
              <span className="prod-stat-label">Опыт в Санкт-Петербурге с {SITE_CONFIG.foundingYear} г.</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">1500+</span>
              <span className="prod-stat-label">Реализованных проектов мебели</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">По проекту</span>
              <span className="prod-stat-label">Считаем листы, фасады, петли и механизмы</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">Под ключ</span>
              <span className="prod-stat-label">Доставка, установка и подключения одной командой</span>
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
                src="/img/production/current/workshop-overview.webp"
                alt="Мастер измеряет мебельную деталь в производственном цеху"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Правая колонка: Единые заголовки без бровей-дубликатов и лишней воды */}
            <div className="prod-showcase-text">
              <h2 className="section-title" style={{ marginBottom: "0" }}>
                От проекта к готовой мебели
              </h2>

              <div className="prod-showcase-item">
                <h3 className="prod-showcase-title">
                  <span className="prod-accent-num">01 · </span>Подробный расчёт
                </h3>
                <p className="prod-showcase-desc">
                  Собираем смету по спецификации конкретного проекта: учитываем количество листов,
                  площадь фасадов, выбранные петли, механизмы и работы.
                </p>
              </div>

              <div className="prod-showcase-item">
                <h3 className="prod-showcase-title">
                  <span className="prod-accent-num">02 · </span>Изготовление в цеху
                </h3>
                <p className="prod-showcase-desc">
                  После согласования конструкции передаём проект в собственный цех, где подготавливаем
                  и обрабатываем детали под размеры будущей мебели.
                </p>
              </div>

              <div className="prod-showcase-item">
                <h3 className="prod-showcase-title">
                  <span className="prod-accent-num">03 · </span>Монтаж под ключ
                </h3>
                <p className="prod-showcase-desc">
                  Одна бригада отвечает за доставку и установку мебели, а также за заранее согласованные
                  подключения техники, сантехники и электрики.
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
            Основные этапы производства
          </h2>

          <div className="prod-stages-row">
            {/* Этап 1: Раскрой */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/current/panel-cutting.webp"
                  alt="Мастер раскраивает ламинированную мебельную плиту"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">
                <span className="prod-accent-num">01 · </span>Раскрой плит
              </h3>
              <p className="prod-stage-desc">
                ЛДСП и МДФ раскраиваем по карте деталей, подготовленной для конкретного проекта.
              </p>
            </div>

            {/* Этап 2: Кромление */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/current/edge-banding.webp"
                  alt="Мастер наносит кромку на мебельную деталь"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">
                <span className="prod-accent-num">02 · </span>Кромление торцов
              </h3>
              <p className="prod-stage-desc">
                Обрабатываем открытые торцы деталей, чтобы подготовить их к присадке и дальнейшей сборке.
              </p>
            </div>

            {/* Этап 3: Присадка и сборка */}
            <div className="prod-stage-col">
              <div className="prod-stage-photo">
                <Image
                  src="/img/production/current/line-boring.webp"
                  alt="Мастер выполняет присадку отверстий в мебельной детали"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="prod-stage-title">
                <span className="prod-accent-num">03 · </span>Присадка и сборка
              </h3>
              <p className="prod-stage-desc">
                Выполняем присадку по проекту и комплектуем детали выбранными петлями и механизмами.
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
              <h3 className="prod-step-title">Расчёт сметы</h3>
              <p className="prod-step-desc">
                Предварительно считаем проект по вашим размерам или эскизу
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">02</span>
              <h3 className="prod-step-title">Встреча в офисе</h3>
              <p className="prod-step-desc">
                Обсуждаем планировку и подбираем материалы на Стачек, 9
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">03</span>
              <h3 className="prod-step-title">Точный замер</h3>
              <p className="prod-step-desc">
                Проверяем размеры после предварительного согласования проекта
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">04</span>
              <h3 className="prod-step-title">Изготовление</h3>
              <p className="prod-step-desc">
                Передаём согласованный проект в цех на Петергофском шоссе, 73
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">05</span>
              <h3 className="prod-step-title">Монтаж под ключ</h3>
              <p className="prod-step-desc">
                Доставляем, собираем мебель и выполняем согласованные подключения
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Финальный блок: Консультация и форма */}
      <LeadSection
        id="consult"
        source="Производство"
      />
    </div>
  );
}
