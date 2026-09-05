import Link from "next/link";
import type { ReactNode } from "react";
import { buildBreadcrumbs } from "@/lib/seo";

interface PageHeaderProps {
  /** Заголовок страницы (H1) */
  title: string;
  /** Ссылка «назад» — только для страниц, которых нет в верхнем меню (например, «/»). Не задана — кнопки нет. */
  backTo?: string;
  /** Подпись кнопки возврата */
  backLabel?: string;
  /** Дополнительный контент внутри хедера (например, кнопки контактов) */
  children?: ReactNode;
}

export default function PageHeader({ title, backTo, backLabel = "На главную", children }: PageHeaderProps) {
  const breadcrumbJsonLd = buildBreadcrumbs([{ name: title }]);

  return (
    <section
      className="page-header"
      style={{ paddingBottom: "36px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container">
        {backTo && (
          <Link href={backTo} className="btn btn-glass" style={{ marginBottom: "24px" }}>
            ← {backLabel}
          </Link>
        )}
        <h1 className="subpage-hero-title">{title}</h1>
        {children}
      </div>
    </section>
  );
}
