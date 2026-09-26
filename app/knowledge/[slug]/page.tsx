import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  KNOWLEDGE_ARTICLES,
  getArticleBySlug,
  getArticleReadTime,
  getArticleWordCount,
} from "@/data/knowledge";
import { SITE_CONFIG } from "@/data/site";
import { buildBreadcrumbs, buildOg, SITE_URL } from "@/lib/seo";
import LeadSection from "@/components/LeadSection";
import { ElectricalBlueprint } from "@/components/KnowledgeBlueprints";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return KNOWLEDGE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Статья не найдена | ПитерМебель",
    };
  }

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: `/knowledge/${article.slug}/`,
    },
    openGraph: {
      ...buildOg(article.seoTitle, article.seoDescription, `/knowledge/${article.slug}`),
      type: "article",
      publishedTime: article.publishedAtISO,
      modifiedTime: article.updatedAtISO,
      authors: [article.author.name],
      section: article.categoryLabel,
      images: [{ url: article.placeholderImage || "/img/knowledge/kitchen_sockets_plan.jpg", alt: article.title }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const heroImage = article.placeholderImage || "/img/knowledge/kitchen_sockets_plan.jpg";
  const wordCount = getArticleWordCount(article);
  const readTime = getArticleReadTime(article);

  // Schema.org TechArticle microdata
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.publishedAtISO,
    dateModified: article.updatedAtISO,
    image: `https://pitermebel.com${heroImage}`,
    wordCount,
    inLanguage: "ru-RU",
    articleSection: article.categoryLabel,
    mainEntityOfPage: `${SITE_URL}/knowledge/${article.slug}/`,
    timeRequired: `PT${readTime}M`,
    author: {
      "@type": "Organization",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: "https://pitermebel.com/img/brand/logo_bird.svg",
      },
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbs([
    { name: "База знаний", path: "/knowledge/" },
    { name: article.title },
  ]);

  return (
    <div className="article-page" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article>
        {/* 1. ARTICLE HEADER */}
        <header className="article-header-section">
          <div className="container article-narrow">
            <Link href="/knowledge/" className="btn btn-glass" style={{ marginBottom: "24px" }}>
              ← База знаний
            </Link>

            <div className="article-badge-row">
              <span className="knowledge-card-badge">{article.categoryLabel}</span>
              <span className="article-read-time">{readTime} мин чтения</span>
              <span className="meta-dot">·</span>
              <span className="article-date">Опубликовано {article.publishedAt}</span>
              <span className="meta-dot">·</span>
              <span className="article-date">Обновлено {article.updatedAt}</span>
            </div>

            <h1 className="article-main-title">{article.title}</h1>

            <p className="article-lead-excerpt">{article.excerpt}</p>

            <div className="article-author-box">
              <div className="author-avatar-badge" aria-hidden="true">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <div className="author-name">{article.author.name}</div>
                <div className="author-role">{article.author.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* 2. HERO FIGURE */}
        <figure className="article-hero-figure">
          <div className="container article-narrow">
            <div className="article-hero-media">
              <Image
                src={heroImage}
                alt="Рабочий план привязки розеток к проекту кухни"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 820px"
                className="article-hero-img"
              />
            </div>
            <figcaption className="article-figure-caption">
              Пример схемы привязок. Размеры определяют по мебели, технике и отметке чистового пола
            </figcaption>
          </div>
        </figure>

        {/* 3. KEY TAKEAWAYS */}
        <section className="article-takeaways-section">
          <div className="container article-narrow">
            <div className="article-takeaways-card">
              <h2 className="takeaways-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Главное за 30 секунд
              </h2>
              <ul className="takeaways-list">
                {article.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="takeaways-item">
                    <span className="takeaways-num">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="takeaways-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {article.tableOfContents && (
          <div className="container article-narrow article-mobile-toc-wrap">
            <details className="article-mobile-toc" data-sticky-cta-suppress>
              <summary>Содержание статьи</summary>
              <ol className="article-toc-list">
                {article.tableOfContents.map((item, idx) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="article-toc-link">
                      <span className="article-toc-num">{String(idx + 1).padStart(2, "0")}</span>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </div>
        )}

        {/* 4. CONTENT + STICKY TOC */}
      <section className="article-content-section">
          <div className="container article-layout">
            <div className="article-body-flow">
              {article.sections.map((section) => (
                <section key={section.id} id={section.id} className="article-content-block">
                  <h2 className="article-section-h2">{section.heading}</h2>

                  {section.text.map((paragraph, pIdx) => (
                    <p key={pIdx} className="article-paragraph">
                      {paragraph}
                    </p>
                  ))}

                  {/* Blueprint figure */}
                  {section.figure?.blueprint === "electrical" && (
                    <figure className="article-figure">
                      <ElectricalBlueprint />
                      <figcaption className="article-figure-caption">
                        {section.figure.caption}
                      </figcaption>
                    </figure>
                  )}

                  {/* Numbered / check / tier lists */}
                  {section.list && (
                    <ul className={`article-list article-list-${section.list.style}`}>
                      {section.list.items.map((item, idx) => (
                        <li key={idx} className="article-list-item">
                          {section.list!.style === "check" ? (
                            <span className="article-list-marker" aria-hidden="true">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          ) : section.list!.style === "tiers" ? (
                            <span className="article-list-marker">{item.lead}</span>
                          ) : (
                            <span className="article-list-marker" aria-hidden="true">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          )}
                          <span className="article-list-text">
                            {section.list!.style === "tiers" ? (
                              item.body
                            ) : (
                              <>
                                <strong>{item.lead}.</strong> {item.body}
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Callout box */}
                  {section.callout && (
                    <div className={`article-callout article-callout-${section.callout.type}`}>
                      <div className="callout-header">
                        <span className="callout-icon" aria-hidden="true">
                          {section.callout.type === "warning" ? (
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                          ) : (
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18h6" />
                              <path d="M10 22h4" />
                              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
                            </svg>
                          )}
                        </span>
                        <h3 className="callout-title">{section.callout.title}</h3>
                      </div>
                      <p className="callout-body">{section.callout.body}</p>
                    </div>
                  )}

                  {/* Spec table */}
                  {section.table && (
                    <div className="article-table-wrap">
                      <table className="article-spec-table">
                        <thead>
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className={cIdx === 0 ? "table-bold-cell" : ""}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}

              <aside className="article-download-card" data-sticky-cta-suppress>
                <div>
                  <h2>Чек-лист перед электромонтажом</h2>
                  <p>Одна страница A4: исходные данные, таблица точек и финальная сверка для проектировщика, электрика и заказчика.</p>
                </div>
                <a href="/downloads/kitchen-electrics-checklist.pdf" className="btn btn-green" download>
                  Скачать PDF
                </a>
              </aside>

              {article.caseStudy && (
                <section id="case-study" className="article-content-block article-case-study">
                  <h2 className="article-section-h2">{article.caseStudy.title}</h2>
                  <div className="article-case-grid">
                    <div>
                      <p className="article-paragraph"><strong>Задача:</strong> {article.caseStudy.task}</p>
                      <p className="article-paragraph"><strong>Конфликт:</strong> {article.caseStudy.conflict}</p>
                      <p className="article-paragraph"><strong>Решение:</strong> {article.caseStudy.solution}</p>
                    </div>
                    <div className="article-case-media">
                      <Image
                        src={article.caseStudy.image}
                        alt={article.caseStudy.imageAlt}
                        fill
                        sizes="(max-width: 900px) 100vw, 420px"
                      />
                    </div>
                  </div>
                </section>
              )}

              <section id="faq" className="article-content-block" data-sticky-cta-suppress>
                <h2 className="article-section-h2">Вопросы и ответы</h2>
                <div className="article-faq-list">
                  {article.faq.map((item) => (
                    <details key={item.question}>
                      <summary>{item.question}</summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section id="sources" className="article-content-block" data-sticky-cta-suppress>
                <h2 className="article-section-h2">Источники и инструкции</h2>
                <p className="article-paragraph">
                  Перед монтажом используйте инструкцию именно выбранной модели техники.
                  Ссылки ниже помогают найти первичные документы, но не заменяют проверку
                  проектного решения квалифицированным специалистом.
                </p>
                <ul className="article-sources-list">
                  {article.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} target="_blank" rel="noopener noreferrer">
                        {source.title}
                      </a>
                      <p>{source.note}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <nav className="article-related-links" aria-label="Полезные ссылки по теме" data-sticky-cta-suppress>
                <h2 className="article-section-h2">Следующие шаги</h2>
                <div className="article-related-grid">
                  {article.relatedLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <strong>{link.title}</strong>
                      <span>{link.description}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Back to knowledge hub */}
              <div className="article-end-row">
                <Link href="/knowledge/" className="article-back-link">
                  Все руководства базы знаний
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Sticky TOC aside */}
            <aside className="article-aside">
              {article.tableOfContents && (
                <nav className="article-toc" aria-label="Содержание статьи">
                  <div className="article-toc-title">Содержание</div>
                  <ol className="article-toc-list">
                    {article.tableOfContents.map((item, idx) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="article-toc-link">
                          <span className="article-toc-num">{String(idx + 1).padStart(2, "0")}</span>
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="article-aside-card">
                <div className="article-aside-card-title">Нужна кухня под вашу электрику?</div>
                <p className="article-aside-card-text">
                  Спроектируем гарнитур с учётом выводов и выдадим схему привязки розеток.
                </p>
                <Link href="/kitchens/" className="btn btn-glass article-aside-btn">
                  Каталог кухонь
                </Link>
              </div>
            </aside>
          </div>
      </section>
      </article>

      {/* 5. CONVERSION CTA & FORM */}
      <LeadSection
        id="consult"
        initialCategory="Кухня"
        source="Статья базы знаний"
      />
    </div>
  );
}
