import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { KNOWLEDGE_ARTICLES } from "@/data/knowledge";
import { SITE_CONFIG } from "@/data/site";
import MeasureForm from "@/components/MeasureForm";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "База знаний и инженерные руководства | ПитерМебель",
  description:
    "Практические руководства по электрике кухни, выбору фасадов, наполнению гардеробных и монтажу мебели в потолок от технологов мебельного цеха в СПб.",
  alternates: {
    canonical: "/knowledge",
  },
};

export default function KnowledgePage() {
  const article = KNOWLEDGE_ARTICLES[0];

  return (
    <div className="knowledge-page" style={{ minHeight: "100vh" }}>
      <PageHeader title="База знаний" backTo="/" />

      {/* 2. ARTICLE LIST: от новых к старым */}
      {article && (
        <section className="knowledge-featured-section">
          <div className="container">
            <div className="knowledge-featured-head">
              <span className="knowledge-eyebrow">Последняя статья</span>
            </div>

            <Link href={`/knowledge/${article.slug}`} className="knowledge-feature-card">
              <div className="knowledge-feature-media">
                <Image
                  src={article.placeholderImage || "/img/knowledge/kitchen_sockets_plan.jpg"}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="knowledge-feature-img"
                />
                <span className="knowledge-card-badge">{article.categoryLabel}</span>
              </div>

              <div className="knowledge-feature-body">
                <div className="knowledge-card-meta">
                  <span>{article.readTime}</span>
                  <span className="meta-dot">·</span>
                  <span>{article.publishedAt}</span>
                </div>

                <h2 className="knowledge-feature-title">{article.title}</h2>
                <p className="knowledge-feature-desc">{article.excerpt}</p>

                <ul className="knowledge-feature-points">
                  {article.keyTakeaways.slice(0, 2).map((point, idx) => (
                    <li key={idx} className="knowledge-feature-point">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="knowledge-feature-footer">
                  <span className="knowledge-author-label">
                    {article.author.name} · {article.author.role}
                  </span>
                  <span className="knowledge-read-btn">Читать статью →</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 3. CTA: бесплатная проверка плана */}
      <section className="knowledge-cta-section" style={{ backgroundColor: "var(--bg-studio)", padding: "112px 0" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Бесплатная проверка привязки розеток и коммуникаций
                </h2>
                <p className="final-desc">
                  Делаете ремонт в Санкт-Петербурге? Пришлите эскиз или план помещения от застройщика.
                  Наш технолог бесплатно проверит расположение выводов электрики и вентиляции
                  до начала чистовой отделки.
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
                  >
                    Написать технологу в VK
                  </a>
                  <Link href="/calculator" className="btn btn-glass">
                    Калькулятор мебели
                  </Link>
                </div>

                <div className="final-footnote" style={{ fontSize: "13.5px", color: "var(--color-text-muted)", marginTop: "24px" }}>
                  Офис: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}) · Цех: {SITE_CONFIG.productionAddress}
                </div>
              </div>

              <div className="final-info-block">
                <MeasureForm initialCategory="Кухня" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
