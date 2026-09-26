export interface DesignPackageItem {
  num: string;
  text: string;
  highlight?: boolean;
}

export const STANDARD_DESIGN_ITEMS: DesignPackageItem[] = [
  { num: "01", text: "Обмерный план" },
  { num: "02", text: "План возводимых перегородок" },
  { num: "03", text: "План после перепланировки" },
  { num: "04", text: "Маркировочный план проёмов и дверей" },
  { num: "05", text: "План расстановки мебели и сантехнического оборудования" },
  { num: "06", text: "План электрики (розетки и эл. выводы, выключатели)" },
  { num: "07", text: "План освещения" },
  { num: "08", text: "Схема включения освещения" },
  { num: "09", text: "Развёртки" },
];

export const PREMIUM_DESIGN_ITEMS: DesignPackageItem[] = [
  ...STANDARD_DESIGN_ITEMS,
  { num: "10", text: "Визуализации", highlight: true },
  { num: "11", text: "Комплектация", highlight: true },
];

interface DesignPackagesSectionProps {
  ctaHref?: string;
  showSectionHeading?: boolean;
  packageHeadingTag?: "h2" | "h3";
}

export default function DesignPackagesSection({
  ctaHref = "#measure",
  showSectionHeading = false,
  packageHeadingTag = "h3",
}: DesignPackagesSectionProps) {
  const CardTitleTag = packageHeadingTag;

  return (
    <section className="design-packages-section" id="design-services">
      <div className="container">
        {showSectionHeading && (
          <div className="design-section-intro">
            <h2 className="section-title">Услуги наших дизайнеров</h2>
            <p className="design-hero-lead">
              Опытные специалисты проработают каждый миллиметр вашей площади,
              дадут ценные советы и рекомендации, что необходимо для наилучшего
              результата.
            </p>
          </div>
        )}

        <div className="design-packages-grid">
          {/* Standard Package */}
          <article className="design-package-card">
            <div className="design-package-head">
              <div>
                <span className="design-package-kicker">Базовый проект</span>
                <CardTitleTag className="design-package-title">
                  Пакет «Стандартный»
                </CardTitleTag>
              </div>
              <div className="design-package-price-box">
                <span className="design-package-price">2 500 ₽</span>
                <span className="design-package-unit">за 1 м²</span>
              </div>
            </div>

            <div className="design-package-subtitle">Что входит:</div>

            <ul className="design-package-list">
              {STANDARD_DESIGN_ITEMS.map((item) => (
                <li key={item.num} className="design-package-item">
                  <span className="design-item-num">{item.num}</span>
                  <span className="design-item-text">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="design-package-footer">
              <a href={ctaHref} className="btn btn-glass design-package-btn">
                Выбрать пакет «Стандартный»
              </a>
            </div>
          </article>

          {/* Premium Package */}
          <article className="design-package-card is-premium">
            <div className="design-package-head">
              <div>
                <span className="design-package-kicker is-accent">
                  Полный проект + 3D
                </span>
                <CardTitleTag className="design-package-title">
                  Пакет «Премиум»
                </CardTitleTag>
              </div>
              <div className="design-package-price-box">
                <span className="design-package-price is-accent">5 000 ₽</span>
                <span className="design-package-unit">за 1 м²</span>
              </div>
            </div>

            <div className="design-package-subtitle">Что входит:</div>

            <ul className="design-package-list">
              {PREMIUM_DESIGN_ITEMS.map((item) => (
                <li
                  key={item.num}
                  className={`design-package-item ${item.highlight ? "is-highlight" : ""}`}
                >
                  <span className="design-item-num">{item.num}</span>
                  <span className="design-item-text">{item.text}</span>
                  {item.highlight && (
                    <span className="design-item-badge">Премиум</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="design-package-footer">
              <a href={ctaHref} className="btn btn-green design-package-btn">
                Выбрать пакет «Премиум»
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
