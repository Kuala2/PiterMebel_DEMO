import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Производство — ${SITE_CONFIG.name} в Санкт-Петербурге`,
  description: `Собственный станочный цех 850 м² с ${SITE_CONFIG.foundedYear} года в Санкт-Петербурге. ЧПУ-раскрой плит, влагостойкий PUR-шов и 100% контрольная тестовая сборка мебели без посредников.`,
};

export default function ProductionPage() {
  return (
    <div>
      {/* 1. Page Header (Синхронизировано по отступам и линии с каталогами) */}
      <section
        className="page-header"
        style={{ paddingBottom: "36px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="container">
          <h1 className="subpage-hero-title">
            Собственное производство в Санкт-Петербурге
          </h1>
          <p className="subpage-hero-caption">
            Полный цикл производства: раскрой, кромление, сборка — всё в одном месте
          </p>
        </div>
      </section>

      {/* 2. Original Intro Text (Один цельный текст без двойного заголовка, под ним тонкая линия) */}
      <section
        style={{
          backgroundColor: "var(--bg-dark)",
          paddingTop: "32px",
          paddingBottom: "32px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="container">
          <p className="prod-intro-text">
            {SITE_CONFIG.name} — это полный производственный цикл без посредников с {SITE_CONFIG.foundedYear} года. Мы несем прямую ответственность за каждый этап: от первого лазерного замера до станочной обработки и чистой установки под ключ.
          </p>
        </div>
      </section>

      {/* 3. Мощности цеха — БЕЗ ПЛИТОК (Чистая сквозная типографика на холсте) */}
      <section style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="prod-stats-strip">
            <div className="prod-stat-item">
              <span className="prod-stat-num">850 м²</span>
              <span className="prod-stat-label">Площадь собственного цеха в СПб</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">2005</span>
              <span className="prod-stat-label">Год запуска производства</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">PUR</span>
              <span className="prod-stat-label">Влагостойкая герметизация швов</span>
            </div>
            <div className="prod-stat-item">
              <span className="prod-stat-num">100%</span>
              <span className="prod-stat-label">Контрольная сборка до отгрузки</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE: Высокоточный ЧПУ-парк — БЕЗ ПЛИТОК (Сплит 65/35 прямо на холсте) */}
      <section style={{ backgroundColor: "var(--bg-studio)", padding: "88px 0" }}>
        <div className="container">
          <div style={{ marginBottom: "40px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Станочный комплекс и чистовой раскрой
            </h2>
          </div>

          <div className="prod-split-showcase">
            {/* 65% Panoramic photo without card box */}
            <div className="prod-showcase-photo">
              <div style={{ position: "relative", width: "100%", height: "460px" }}>
                <Image
                  src="/img/brand/ws_cnc_wood_1.jpg"
                  alt="Станочный ЧПУ комплекс ПитерМебель"
                  fill
                  sizes="(max-width: 1024px) 100vw, 860px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>

            {/* 35% Specifications table directly on canvas */}
            <div className="prod-specs-editorial">
              <h3 className="prod-specs-title">
                ЧПУ-раскрой плитных материалов
              </h3>
              <p className="prod-specs-lead">
                Раскрой австрийских плит Egger, МДФ и натурального шпона выполняется на автоматизированных центрах с ЧПУ. Компьютерная раскладка исключает сколы, задиры и микротрещины, гарантируя эталонную геометрию каждого модуля.
              </p>

              <div className="prod-specs-table">
                <div className="prod-specs-row">
                  <span className="prod-specs-label">Точность реза</span>
                  <span className="prod-specs-val">±0.1 мм</span>
                </div>
                <div className="prod-specs-row">
                  <span className="prod-specs-label">Скорость шпинделя</span>
                  <span className="prod-specs-val">24 000 об/мин</span>
                </div>
                <div className="prod-specs-row">
                  <span className="prod-specs-label">Фрезеровка фасадов</span>
                  <span className="prod-specs-val">Ручки Gola, J-Pull, 3D-рифление</span>
                </div>
                <div className="prod-specs-row">
                  <span className="prod-specs-label">Материалы</span>
                  <span className="prod-specs-val">Egger 18 мм, МДФ, шпон дуба</span>
                </div>
                <div className="prod-specs-row">
                  <span className="prod-specs-label">Качество кромки</span>
                  <span className="prod-specs-val">Алмазная чистота реза</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL TABLE: Влагостойкий PUR-шов — БЕЗ ПЛИТОК (Инженерная спецификация) */}
      <section
        style={{
          backgroundColor: "var(--bg-dark)",
          padding: "88px 0",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "860px" }}>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>
              Влагостойкий PUR-шов: почему наша мебель не боится пара
            </h2>
            <p style={{ fontSize: "16px", color: "#9BA1B0", lineHeight: 1.65, margin: 0 }}>
              Большинство салонов используют дешевый клей EVA, который размягчается от пара чайника и духовки уже при 60°C. Мы герметизируем 100% торцов полиуретановым термоклеем PUR, формирующим неразрывную химическую связь с плитой.
            </p>
          </div>

          <div className="prod-editorial-table-wrap">
            <table className="prod-editorial-table">
              <thead>
                <tr>
                  <th>Параметр</th>
                  <th>Обычный клей EVA (стандарт рынка)</th>
                  <th>Фабричный PUR-шов (стандарт «ПитерМебель»)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="prod-td-param">Стойкость к пару и температуре</td>
                  <td className="prod-td-eva">
                    До +60°C. Размягчается от горячего пара чайника и духовки, со временем кромка отслаивается.
                  </td>
                  <td className="prod-td-pur">
                    <strong>До +150°C.</strong> Полная химическая полимеризация — пар из духовки и чайника абсолютно безвреден.
                  </td>
                </tr>
                <tr>
                  <td className="prod-td-param">Защита от влаги в зоне мойки</td>
                  <td className="prod-td-eva">
                    Пористая структура пропускает капли воды — плита ЛДСП разбухает и деформируется.
                  </td>
                  <td className="prod-td-pur">
                    <strong>100% гидроизоляция.</strong> Модули возле мойки и посудомоечной машины служат более 15 лет без деформации.
                  </td>
                </tr>
                <tr>
                  <td className="prod-td-param">Внешний вид клеевого стыка</td>
                  <td className="prod-td-eva">
                    Заметная темная клеевая полоса, накапливающая грязь и пыль со временем.
                  </td>
                  <td className="prod-td-pur">
                    <strong>Оптически невидимый «нулевой шов».</strong> Монолитное слияние кромки и фасада.
                  </td>
                </tr>
                <tr>
                  <td className="prod-td-param">Эксплуатационный ресурс</td>
                  <td className="prod-td-eva">
                    3–5 лет до первых сколов или отслоений на торцах.
                  </td>
                  <td className="prod-td-pur">
                    <strong>Более 15 лет</strong> ежедневной интенсивной эксплуатации без потери геометрии.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. STANDARDS SPLIT: 100% Контрольная сборка — БЕЗ ПЛИТОК (Фото + Редакционные строки) */}
      <section style={{ backgroundColor: "var(--bg-studio)", padding: "88px 0" }}>
        <div className="container">
          <div style={{ marginBottom: "40px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Контроль качества перед отгрузкой
            </h2>
          </div>

          <div className="prod-quality-split">
            {/* Left 50%: Assembly Photo on canvas */}
            <div className="prod-quality-media">
              <div style={{ position: "relative", width: "100%", height: "460px" }}>
                <Image
                  src="/img/production/assembly.jpg"
                  alt="Контрольная сборка мебели в цеху ПитерМебель"
                  fill
                  sizes="(max-width: 960px) 100vw, 680px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Right 50%: Editorial numbered standards on canvas */}
            <div className="prod-standards-list">
              <div className="prod-standard-item">
                <span className="prod-standard-num">01</span>
                <div>
                  <h3 className="prod-standard-title">
                    100% контрольная сборка каждого гарнитура в цеху
                  </h3>
                  <p className="prod-standard-desc">
                    Перед упаковкой и доставкой мебель полностью монтируется на проверочных стапелях цеха. Мастера проверяют соосность выдвижных механизмов, примыкание фасадов с зазором ровно 2 мм и плавность хода доводчиков.
                  </p>
                </div>
              </div>

              <div className="prod-standard-item">
                <span className="prod-standard-num">02</span>
                <div>
                  <h3 className="prod-standard-title">
                    Оригинальная австрийская фурнитура Blum
                  </h3>
                  <p className="prod-standard-desc">
                    Петли Clip Top Blumotion и направляющие Legrabox рассчитаны на 200 000 циклов открывания. Это 20 лет бесшумной работы без перекосов и провисаний.
                  </p>
                </div>
              </div>

              <div className="prod-standard-item">
                <span className="prod-standard-num">03</span>
                <div>
                  <h3 className="prod-standard-title">
                    Экологичные австрийские плиты Egger 18 мм
                  </h3>
                  <p className="prod-standard-desc">
                    Используем плотную плиту толщиной 18 мм высшего класса экологичности E1. Мебель абсолютно безопасна для спален и детских комнат, а крепеж держится мертво.
                  </p>
                </div>
              </div>

              <div className="prod-standard-item">
                <span className="prod-standard-num">04</span>
                <div>
                  <h3 className="prod-standard-title">
                    Бережная доставка и защита углов
                  </h3>
                  <p className="prod-standard-desc">
                    Все фасадные и корпусные детали упаковываются в трехслойный гофрокартон и защитный вспененный профиль. Доставка осуществляется штатной машиной студии.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROCESS TRACK: 5 этапов создания мебели — БЕЗ ПЛИТОК */}
      <section
        style={{
          backgroundColor: "var(--bg-dark)",
          padding: "88px 0",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: "16px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Производственный маршрут
            </h2>
          </div>

          <div className="prod-linear-track">
            <div className="prod-step-col">
              <span className="prod-step-num">01 / ЭТАП</span>
              <h3 className="prod-step-title">Лазерный замер</h3>
              <p className="prod-step-desc">
                Инженер сканирует геометрию стен, углы разворота и выводы коммуникаций с чемоданом образцов.
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">02 / ЭТАП</span>
              <h3 className="prod-step-title">Карты кроя</h3>
              <p className="prod-step-desc">
                Технолог разрабатывает карты ЧПУ-раскроя и схему бесшовной интеграции встраиваемой техники.
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">03 / ЭТАП</span>
              <h3 className="prod-step-title">ЧПУ и PUR-шов</h3>
              <p className="prod-step-desc">
                Распил на автоматизированных центрах и влагостойкая полиуретановая герметизация всех торцов.
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">04 / ЭТАП</span>
              <h3 className="prod-step-title">Тестовая сборка</h3>
              <p className="prod-step-desc">
                Контрольная сборка гарнитура, проверка зазоров и регулировка плавности хода петель в цеху.
              </p>
            </div>

            <div className="prod-step-col">
              <span className="prod-step-num">05 / ЭТАП</span>
              <h3 className="prod-step-title">Чистый монтаж</h3>
              <p className="prod-step-desc">
                Штатная бригада монтирует гарнитур под потолок, подключает технику и убирает строительным пылесосом.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CANVAS CTA: Встречи в офисе и бесплатный выезд инженера */}
      <section className="final-section" id="consult" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Встречи в офисе студии и бесплатный выезд инженера
                </h2>
                <p className="final-desc">
                  Собственное производство — это закрытая станочная площадка с непрерывным циклом обработки плит. Для комфортного обсуждения проекта, подбора оттенков эмалей по веерам RAL/NCS, натурального шпона и чашки кофе мы ждем вас в офисе студии на площади Стачек по предварительной записи. Либо наш ведущий инженер бесплатно приедет к вам на объект с образцами материалов.
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
                <div style={{ fontSize: "13.5px", color: "var(--color-text-muted)", marginTop: "18px" }}>
                  Офис: пл. Стачек, 9, 4 этаж (м. «Нарвская», по записи) · Собственное производство: СПб (закрытый цех 850 м²)
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
