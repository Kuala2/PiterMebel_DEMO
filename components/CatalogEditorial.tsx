interface EditorialItem {
  title: string;
  text: string;
}

interface EditorialLink {
  href: string;
  label: string;
}

interface EditorialFaq {
  question: string;
  answer: string;
}

interface CatalogEditorialProps {
  title: string;
  intro: string;
  items: EditorialItem[];
  links?: EditorialLink[];
  faq?: EditorialFaq[];
}

export default function CatalogEditorial({
  title,
  intro,
  items,
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

        <div className="catalog-editorial-grid">
          {items.map((item) => (
            <article key={item.title} className="catalog-editorial-item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
