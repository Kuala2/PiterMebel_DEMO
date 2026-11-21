import Link from "next/link";

export interface EditorialItem {
  title: string;
  text: string;
}

export interface EditorialLink {
  href: string;
  label: string;
}

export interface EditorialFaq {
  question: string;
  answer: string;
}

export interface EditorialMaterialRow {
  material: string;
  priceTier: string;
  leadTime: string;
}

export interface EditorialSummaryFact {
  label: string;
  value: string;
}

interface CatalogEditorialProps {
  title: string;
  intro: string;
  items: EditorialItem[];
  materials?: EditorialMaterialRow[];
  materialsTitle?: string;
  materialsNote?: string;
  summaryFacts?: EditorialSummaryFact[];
  calculatorHref?: string;
  calculatorLabel?: string;
  links?: EditorialLink[];
  linksTitle?: string;
  faq?: EditorialFaq[];
}

export default function CatalogEditorial({
  title,
  intro,
  items,
  materials = [],
  materialsTitle,
  materialsNote,
  summaryFacts = [],
  calculatorHref,
  calculatorLabel,
  links = [],
  linksTitle,
  faq = [],
}: CatalogEditorialProps) {
  const faqJsonLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const hasFaq = faq.length > 0;
  const hasPanel = materials.length > 0 || summaryFacts.length > 0;
  const hasSplit = hasFaq || hasPanel;
  const isSingleSplit = !hasFaq || !hasPanel;
  const calcButtonText = (calculatorLabel || "Рассчитать под свои размеры").replace(
    /\s*→\s*$/,
    ""
  );

  return (
    <section className="catalog-editorial-section" data-sticky-cta-suppress>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="container">
        <div className="catalog-editorial-heading">
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>

        {items.length > 0 && (
          <div className="catalog-editorial-grid">
            {items.map((item, idx) => (
              <article key={item.title} className="catalog-editorial-item">
                <span className="catalog-editorial-num" aria-hidden="true">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        )}

        {hasSplit && (
          <div className={`editorial-split${isSingleSplit ? " editorial-split--single" : ""}`}>
            {hasPanel && (
              <div className="editorial-pricing-panel">
                <h3 className="editorial-panel-title">
                  {materialsTitle || "Материалы и ориентир цен"}
                </h3>

                {materials.length > 0 ? (
                  <ul className="editorial-price-list">
                    {materials.map((row) => (
                      <li key={row.material}>
                        <span className="editorial-price-name">{row.material}</span>
                        <span className="editorial-price-meta">
                          <strong className="editorial-price-val">{row.priceTier}</strong>
                          <span className="editorial-price-time">{row.leadTime}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="editorial-price-list">
                    {summaryFacts.map((fact) => (
                      <li key={fact.label}>
                        <span className="editorial-price-name">{fact.label}</span>
                        <strong className="editorial-price-val">{fact.value}</strong>
                      </li>
                    ))}
                  </ul>
                )}

                {(calculatorHref || materialsNote) && (
                  <div className="editorial-panel-action">
                    {calculatorHref && (
                      <Link
                        href={calculatorHref}
                        className="btn btn-green editorial-calc-btn"
                      >
                        <span>{calcButtonText}</span>
                        <span className="editorial-calc-arrow" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    )}
                    {materialsNote && (
                      <p className="editorial-panel-note">{materialsNote}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {hasFaq && (
              <div className="catalog-editorial-faq">
                <h3>Частые вопросы</h3>
                <div className="catalog-faq-list">
                  {faq.map((item) => (
                    <details key={item.question}>
                      <summary>
                        <span>{item.question}</span>
                        <span className="catalog-faq-icon" aria-hidden="true" />
                      </summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {links.length > 0 && (
          <div className="catalog-editorial-related">
            <span className="catalog-editorial-related-label">
              {linksTitle || "Смежные направления"}
            </span>
            <nav
              className="catalog-editorial-links"
              aria-label={linksTitle || "Смежные направления"}
            >
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="catalog-related-link">
                  <span>{link.label}</span>
                  <span className="catalog-related-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
