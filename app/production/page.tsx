import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Производство — ${SITE_CONFIG.name} в Санкт-Петербурге`,
  description: `Собственный мебельный цех с ${SITE_CONFIG.foundedYear} года на ул. Трефолева, 1П. Станочный парк ЧПУ, влагостойкий PUR-шов и тестовая контрольная сборка мебели без посредников.`,
};

export default function ProductionPage() {
  return (
    <div>
      {/* 1. Subpage Hero Banner (Cinema Workshop Interior + HUD metrics) */}
      <section className="subpage-hero">
        <div className="subpage-hero-bg">
          <Image
            src="/img/brand/workshop_hero.jpg"
            alt="Производственный цех ПитерМебель на Трефолева"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 45%" }}
          />
        </div>
        <div className="subpage-hero-overlay" />
        <div className="container subpage-hero-content">
          <h1 className="subpage-hero-title">
            Собственный цех в Санкт-Петербурге
          </h1>

          {/* Integrated Telemetry HUD Bar */}
          <div className="prod-hero-stats-bar">
            <div className="prod-hero-stat-cell">
              <span className="prod-stat-val">850 м²</span>
              <span className="prod-stat-lbl">Площадь цеха на Трефолева</span>
            </div>
            <div className="prod-hero-stat-cell">
              <span className="prod-stat-val">0.1 мм</span>
              <span className="prod-stat-lbl">Допуск раскроя и присадки ЧПУ</span>
            </div>
            <div className="prod-hero-stat-cell">
              <span className="prod-stat-val">PUR</span>
              <span className="prod-stat-lbl">Влагостойкий клеевой шов</span>
            </div>
            <div className="prod-hero-stat-cell">
              <span className="prod-stat-val">100%</span>
              <span className="prod-stat-lbl">Тестовая фабричная сборка</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Intro Bar */}
      <section className="subpage-intro-bar">
        <div className="container">
          <p className="subpage-intro-desc" style={{ marginBottom: 0 }}>
            {SITE_CONFIG.name} — это полный производственный цикл без посредников с {SITE_CONFIG.foundedYear} года. Мы несем прямую ответственность за каждый этап: от первого лазерного замера до идеальной станочной обработки и чистой установки под ключ.
          </p>
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
            <Link href="#visit" className="btn btn-glass prod-head-btn">
              Записаться на визит в цех →
            </Link>
          </div>

          <div className="prod-equip-grid">
            {/* Card 1: CNC Machining */}
            <div className="prod-equip-card">
              <div className="prod-equip-photo-wrap">
                <Image
                  src="/img/brand/workshop_cnc.jpg"
                  alt="Фрезерный станочный центр ЧПУ Biesse Rover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="prod-equip-tag">Biesse Rover • ЧПУ</div>
              </div>
              <div className="prod-equip-body">
                <h3 className="prod-equip-title">Фрезерно-присадочные центры ЧПУ</h3>
                <p className="prod-equip-desc">
                  Высокоточный раскрой плитных материалов (Egger, МДФ, шпон) и фигурная 3D-фрезеровка мебельных фасадов с допуском до 0.1 мм без сколов.
                </p>
                <ul className="prod-equip-specs-list">
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Автоматическая смена инструмента</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Лазерная юстировка осей координат</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Безупречная геометрия углов и пазов</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: PUR Edge Banding */}
            <div className="prod-equip-card">
              <div className="prod-equip-photo-wrap">
                <Image
                  src="/img/brand/workshop_edge.jpg"
                  alt="Кромкооблицовочный станок с PUR-узлом"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="prod-equip-tag">PUR Hotmelt • Нулевой шов</div>
              </div>
              <div className="prod-equip-body">
                <h3 className="prod-equip-title">Влагостойкое PUR-кромление</h3>
                <p className="prod-equip-desc">
                  Герметизация торцов деталей полиуретановым термоклеем. PUR-шов полностью водонепроницаем и не боится горячего пара от варочной панели и раковины.
                </p>
                <ul className="prod-equip-specs-list">
                  <li>
                    <span className="check-icon">✓</span>
                    <span>100% защита от пара и вздутия плит</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Невидимая линия клеевого соединения</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Термостойкость к высоким температурам</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Test Assembly */}
            <div className="prod-equip-card">
              <div className="prod-equip-photo-wrap">
                <Image
                  src="/img/brand/workshop_hero.jpg"
                  alt="Участок контрольной сборки мебели"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="prod-equip-tag">100% Контрольная сборка</div>
              </div>
              <div className="prod-equip-body">
                <h3 className="prod-equip-title">Тестовая сборка на фабрике</h3>
                <p className="prod-equip-desc">
                  Перед отправкой каждый гарнитур собирается в цеху. Мастера проверяют параллельность линий, примыкание фасадов и плавность хода направляющих Blum.
                </p>
                <ul className="prod-equip-specs-list">
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Юстировка зазоров и петель на стенде</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Проверка плавности доводчиков и ящиков</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Нулевой риск ошибок и брака на монтаже</span>
                  </li>
                </ul>
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

      {/* 5. PROCESS PIPELINE (5 Sequential Steps) */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "80px", paddingBottom: "85px" }}>
        <div className="container">
          <div style={{ marginBottom: "36px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Сквозной процесс: от замера до установки
            </h2>
          </div>

          <div className="prod-pipeline-grid">
            <div className="prod-pipeline-card">
              <div className="prod-pipeline-head">
                <div className="prod-pipeline-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 3L3 21" /><path d="M14 3l7 7-4 4-7-7 4-4z" /><path d="M3 14l7 7 4-4-7-7-4 4z" />
                  </svg>
                </div>
                <span className="prod-pipeline-num">01</span>
              </div>
              <h3 className="prod-pipeline-title">Лазерный замер</h3>
              <p className="prod-pipeline-desc">
                Инженер сканирует геометрию стен, углы и выводы коммуникаций с чемоданом образцов.
              </p>
            </div>

            <div className="prod-pipeline-card">
              <div className="prod-pipeline-head">
                <div className="prod-pipeline-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" />
                  </svg>
                </div>
                <span className="prod-pipeline-num">02</span>
              </div>
              <h3 className="prod-pipeline-title">3D-проект и смета</h3>
              <p className="prod-pipeline-desc">
                Разработка технологических раскройных карт, интеграция техники и фиксация цены.
              </p>
            </div>

            <div className="prod-pipeline-card">
              <div className="prod-pipeline-head">
                <div className="prod-pipeline-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <span className="prod-pipeline-num">03</span>
              </div>
              <h3 className="prod-pipeline-title">Раскрой и PUR-шов</h3>
              <p className="prod-pipeline-desc">
                Распил на станках ЧПУ и полиуретановая герметизация торцов для защиты от влаги.
              </p>
            </div>

            <div className="prod-pipeline-card">
              <div className="prod-pipeline-head">
                <div className="prod-pipeline-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 14 14" />
                  </svg>
                </div>
                <span className="prod-pipeline-num">04</span>
              </div>
              <h3 className="prod-pipeline-title">Тестовая сборка</h3>
              <p className="prod-pipeline-desc">
                Фабричная проверка геометрии, регулировка петель и зазоров до отправки к вам.
              </p>
            </div>

            <div className="prod-pipeline-card">
              <div className="prod-pipeline-head">
                <div className="prod-pipeline-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="prod-pipeline-num">05</span>
              </div>
              <h3 className="prod-pipeline-title">Чистый монтаж</h3>
              <p className="prod-pipeline-desc">
                Штатная бригада устанавливает гарнитур, подключает технику и убирает мусор.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VISIT WORKSHOP & MEASURE FORM */}
      <section className="final-section" id="visit" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Ждем вас в цеху на Трефолева, 1П
                </h2>
                <p className="final-desc">
                  Приезжайте на наше производство в Санкт-Петербурге рядом с метро «Нарвская». Вы сможете своими глазами увидеть работу станков, оценить качество сборки и выбрать материалы из сотен образцов шпона, эмалей и пластиков.
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
                  {SITE_CONFIG.address} ({SITE_CONFIG.metro}) · Пн–Сб с 10:00 до 20:00 (по записи)
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory="Визит на производство" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
