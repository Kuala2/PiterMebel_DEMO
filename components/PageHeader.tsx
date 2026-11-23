import Link from "next/link";
import type { ReactNode } from "react";
import { buildBreadcrumbs } from "@/lib/seo";

interface PageHeaderProps {
  /** Заголовок страницы (H1) */
  title: string;
  /** Короткое пояснение под заголовком */
  subtitle?: string;
  /** Ссылка «назад» — только для страниц, которых нет в верхнем меню (например, «/»). Не задана — кнопки нет. */
  backTo?: string;
  /** Подпись кнопки возврата */
  backLabel?: string;
  /** Канонический путь страницы для BreadcrumbList JSON-LD (не отображается визуально) */
  breadcrumbPath?: string;
  /** Дополнительный контент внутри хедера (например, кнопки контактов) */
  children?: ReactNode;
}

export default function PageHeader({ title, subtitle, backTo, backLabel = "На главную", breadcrumbPath, children }: PageHeaderProps) {
  const breadcrumbJsonLd = buildBreadcrumbs([{ name: title, ...(breadcrumbPath ? { path: breadcrumbPath } : {}) }]);

  return (
    <section
      className="page-header"
      style={{ paddingBottom: "28px", borderBottom: "1px solid rgba(255, 255, 255, 0.12)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container">
        {backTo && (
          <Link href={backTo} className="back-link-inline">
            ← {backLabel}
          </Link>
        )}
        <h1 className="subpage-hero-title">{title}</h1>
        {subtitle && (
          <p className="subpage-hero-caption" style={{ marginTop: "10px", maxWidth: "720px" }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
