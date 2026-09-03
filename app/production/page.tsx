import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Производство — ${SITE_CONFIG.name} в Санкт-Петербурге`,
  description: `Собственный мебельный цех с ${SITE_CONFIG.foundedYear} года в Санкт-Петербурге. Станочный парк ЧПУ, влагостойкий PUR-шов и тестовая контрольная сборка мебели без посредников.`,
};

export default function ProductionPage() {
  return (
    <div>
      {/* 1. Page Header с «дышащим» шёлковым холстом */}
      <section className="page-header" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="subpage-hero-title">
            Собственный цех в Санкт-Петербурге
          </h1>
          <p className="subpage-hero-caption">
            Полный цикл производства · раскрой, кромление, сборка — всё в одном месте
          </p>
        </div>
      </section>

      {/* 2. Intro + Stats Row */}
      <section className="subpage-intro-bar">
        <div className="container">
          <p className="subpage-intro-desc" style={{ marginBottom: 0 }}>
            {SITE_CONFIG.name} — это полный производственный цикл без посредников с {SITE_CONFIG.foundedYear} года. Мы несем прямую ответственность за каждый этап: от первого лазерного замера до станочной обработки и чистой установки под ключ.
          </p>
          <div className="prod-stats-row">
            <div className="prod-stat">
              <span className="prod-stat-num">850 м²</span>
              <span className="prod-stat-label">Площадь собственного цеха</span>
            </div>
            <div className="prod-stat">
              <span className="prod-stat-num">2005</span>
              <span className="prod-stat-label">Год запуска производства</span>
            </div>
            <div className="prod-stat">
              <span className="prod-stat-num">PUR</span>
              <span className="prod-stat-label">Влагостойкий клеевой шов</span>
            </div>
            <div className="prod-stat">
              <span className="prod-stat-num">100%</span>
              <span className="prod-stat-label">Тестовая сборка перед отгрузкой</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MACHINERY & EQUIPMENT SHOWCASE (3 Visual Cards with Photography) */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "80px", paddingBottom: "85px" }}>
        <div className="container">
          <div className="prod-equip-head-row">
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Станочный парк и оснащение цеха
              </h2>
            </div>
            <Link href="#consult" className="btn btn-glass prod-head-btn">
              Консультация и выезд инженера →
            </Link>
          </div>

          <div className="prod-rows">
            {/* Row 1: CNC */}
            <div className="prod-row">
              <div className="prod-row-photo">
                <Image
                  src="/img/production/cnc.jpg"
                  alt="Станок с ЧПУ в цеху ПитерМебель"
                  fill
                  sizes="(max-width: 1024px) 100vw, 720px"
                  style={{ objectFit: "cover" }}
                />
                <span className="prod-row-caption">Собственное производство · участок раскроя</span>
              </div>
              <div className="prod-row-info">
                <h3 className="prod-row-title">Станки с ЧПУ</h3>
                <p className="prod-row-desc">
                  Точный раскрой плитных материалов — ЛДСП, МДФ, шпон — и аккуратная обработка криволинейных фасадов. Детали выходят со станка с чистой кромкой, без сколов и прижогов.
                </p>
              </div>
            </div>

            {/* Row 2: PUR Edge Banding */}
            <div className="prod-row is-reversed">
              <div className="prod-row-photo">
                <Image
                  src="/img/production/edge.jpg"
                  alt="Кромкооблицовочный станок с PUR-узлом"
                  fill
                  sizes="(max-width: 1024px) 100vw, 720px"
                  style={{ objectFit: "cover" }}
                />
                <span className="prod-row-caption">Участок кромления · PUR</span>
              </div>
              <div className="prod-row-info">
                <h3 className="prod-row-title">Влагостойкое PUR-кромление</h3>
                <p className="prod-row-desc">
                  Торцы каждой детали герметизируются полиуретановым термоклеем. Такой шов не пропускает влагу и выдерживает горячий пар от варочной панели и раковины — фасады не разбухают годами.
                </p>
              </div>
            </div>

            {/* Row 3: Test Assembly */}
            <div className="prod-row">
              <div className="prod-row-photo">
                <Image
                  src="/img/production/assembly.jpg"
                  alt="Участок контрольной сборки мебели"
                  fill
                  sizes="(max-width: 1024px) 100vw, 720px"
                  style={{ objectFit: "cover" }}
                />
                <span className="prod-row-caption">Участок контрольной сборки</span>
              </div>
              <div className="prod-row-info">
                <h3 className="prod-row-title">Тестовая сборка в цеху</h3>
                <p className="prod-row-desc">
                  Перед отправкой каждый гарнитур собирается целиком: проверяем геометрию корпуса, примыкание фасадов и плавность хода фурнитуры Blum. На объект мебель приезжает уже проверенной.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUALITY BENCHMARKS (2x2 Bento Cards) */}
      <section style={{ backgroundColor: "var(--bg-studio)", paddingTop: "80px", paddingBottom: "85px" }}>
        <div className="container">
          <div style={{ marginBottom: "36px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Стандарты фабричного качества
            </h2>
          </div>

          <div className="prod-quality-bento">
            <div className="prod-quality-card">
              <div className="prod-quality-num">01</div>
              <div className="prod-quality-content">
                <h3 className="prod-quality-title">Прямая фабричная цена</h3>
                <p className="prod-quality-desc">
                  Заказывая напрямую на производстве, вы получаете честную фабричную стоимость без торговых наценок мебельных салонов и аренды в ТЦ.
                </p>
              </div>
            </div>

            <div className="prod-quality-card">
              <div className="prod-quality-num">02</div>
              <div className="prod-quality-content">
                <h3 className="prod-quality-title">Оригинальные комплектующие</h3>
                <p className="prod-quality-desc">
                  Работаем только с сертифицированными материалами: австрийская фурнитура Blum и Egger, немецкий пластик и премиальные эмали по палитрам RAL и NCS.
                </p>
              </div>
            </div>

            <div className="prod-quality-card">
              <div className="prod-quality-num">03</div>
              <div className="prod-quality-content">
                <h3 className="prod-quality-title">Единый контур ответственности</h3>
                <p className="prod-quality-desc">
                  Инженерный замер, раскрой на станках, сборка модулей и чистовая установка выполняются штатными мастерами студии без субподрядчиков.
                </p>
              </div>
            </div>

            <div className="prod-quality-card">
              <div className="prod-quality-num">04</div>
              <div className="prod-quality-content">
                <h3 className="prod-quality-title">Чистый и аккуратный монтаж</h3>
                <p className="prod-quality-desc">
                  Монтажники с опытом от 8 лет бережно устанавливают гарнитур, врезают технику, подключают подсветку и проводят уборку строительным пылесосом.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS LINE */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "80px", paddingBottom: "85px" }}>
        <div className="container">
          <div style={{ marginBottom: "44px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              От замера до установки
            </h2>
          </div>

          <div className="process-track process-track--five">
            <div className="process-step">
              <h3 className="process-title">Лазерный замер</h3>
              <p className="process-desc">
                Инженер сканирует геометрию стен, углы и выводы коммуникаций с чемоданом образцов.
              </p>
            </div>

            <div className="process-step">
              <h3 className="process-title">3D-проект и смета</h3>
              <p className="process-desc">
                Разработка технологических раскройных карт, интеграция техники и фиксация цены.
              </p>
            </div>

            <div className="process-step">
              <h3 className="process-title">Раскрой и PUR-шов</h3>
              <p className="process-desc">
                Распил на станках ЧПУ и полиуретановая герметизация торцов для защиты от влаги.
              </p>
            </div>

            <div className="process-step">
              <h3 className="process-title">Тестовая сборка</h3>
              <p className="process-desc">
                Фабричная проверка геометрии, регулировка петель и зазоров до отправки к вам.
              </p>
            </div>

            <div className="process-step">
              <h3 className="process-title">Чистый монтаж</h3>
              <p className="process-desc">
                Штатная бригада устанавливает гарнитур, подключает технику и убирает мусор.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OFFICE MEETINGS & ENGINEER MEASUREMENT */}
      <section className="final-section" id="consult" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Встречи в офисе студии и бесплатный выезд инженера
                </h2>
                <p className="final-desc">
                  Собственное производство — это закрытая технологическая площадка со строгими нормами безопасности, где непрерывно работают ЧПУ-станки и кромкооблицовочные линии. Для комфортного обсуждения проектов, чашки кофе и подбора материалов из сотен образцов шпона, эмалей и пластиков мы ждем вас в офисе студии по предварительной записи. Либо наш ведущий инженер бесплатно приедет к вам на замер с чемоданом образцов.
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
                  <Link href="/calculator" className="btn btn-glass">
                    Калькулятор стоимости
                  </Link>
                </div>
                <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "14px" }}>
                  Офис для встреч по записи · Производство: {SITE_CONFIG.address} (закрытый цех)
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory="Консультация и выезд инженера" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
