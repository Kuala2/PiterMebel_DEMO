import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { KNOWLEDGE_ARTICLES } from "@/data/knowledge";
import { SITE_CONFIG } from "@/data/site";
import LeadSection from "@/components/LeadSection";
import PageHeader from "@/components/PageHeader";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "База знаний о проектировании мебели | ПитерМебель",
  description:
    "Практические материалы о подготовке кухни, выборе фасадов, наполнении гардеробных и монтаже мебели на заказ в Санкт-Петербурге.",
  alternates: {
    canonical: "/knowledge",
  },
  openGraph: buildOg(
    "База знаний о проектировании мебели | ПитерМебель",
    "Практические материалы о подготовке кухни, выборе фасадов и монтаже мебели на заказ.",
    "/knowledge"
  ),
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

      {/* 3. CTA: обсуждение привязки коммуникаций */}
      <LeadSection
        id="consult"
        initialCategory="Кухня"
        title="Обсудим проект и привязку коммуникаций"
        source="База знаний"
      />
    </div>
  );
}
