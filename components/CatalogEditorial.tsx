import Link from "next/link";

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
  eyebrow: string;
  title: string;
  intro: string;
  items: EditorialItem[];
  links: EditorialLink[];
  faq: EditorialFaq[];
}

export default function CatalogEditorial({
  eyebrow,
  title,
  intro,
  items,
  links,
  faq,
}: CatalogEditorialProps) {
  return (
    <section className="catalog-editorial-section" data-sticky-cta-suppress>
      <div className="container">
        <div className="catalog-editorial-heading">
          <p className="eyebrow">{eyebrow}</p>
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

        <div className="catalog-editorial-links" aria-label="Полезные следующие шаги">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label} →
            </Link>
          ))}
        </div>

        <div className="catalog-editorial-faq">
          <h2>Вопросы перед началом проекта</h2>
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
