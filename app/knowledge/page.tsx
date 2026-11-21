import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { KNOWLEDGE_ARTICLES, getArticleReadTime } from "@/data/knowledge";
import LeadSection from "@/components/LeadSection";
import PageHeader from "@/components/PageHeader";
import { buildOg, buildTwitter } from "@/lib/seo";

const TITLE = "База знаний о проектировании мебели | ПитерМебель";
const DESCRIPTION =
  "Практические материалы о подготовке кухни, выборе фасадов, наполнении гардеробных и монтаже мебели на заказ в Санкт-Петербурге.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/knowledge/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/knowledge"),
  twitter: buildTwitter(TITLE, DESCRIPTION),
};

export default function KnowledgePage() {
  return (
    <div className="knowledge-page" style={{ minHeight: "100vh" }}>
      <PageHeader title="База знаний о мебели на заказ" backTo="/" />

      {/* 2. ARTICLE LIST: от новых к старым */}
      {KNOWLEDGE_ARTICLES.length > 0 && (
        <section className="knowledge-featured-section">
          <div className="container" style={{ display: "grid", gap: "48px" }}>
            {KNOWLEDGE_ARTICLES.map((article, articleIdx) => (
              <Link
                key={article.slug}
                href={`/knowledge/${article.slug}/`}
                className="knowledge-feature-card"
              >
                <div className="knowledge-feature-media">
                  <Image
                    src={article.placeholderImage || "/img/knowledge/kitchen_sockets_plan.jpg"}
                    alt={article.title}
                    fill
                    priority={articleIdx === 0}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="knowledge-feature-img"
                  />
                  <span className="knowledge-card-badge">{article.categoryLabel}</span>
                </div>

                <div className="knowledge-feature-body">
                  <div className="knowledge-card-meta">
                    <span>{getArticleReadTime(article)} мин чтения</span>
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
                    <span className="knowledge-read-btn">Читать статью →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. CTA: обсуждение привязки коммуникаций */}
      <LeadSection
        id="consult"
        initialCategory="Кухня"
        source="База знаний"
      />
    </div>
  );
}
