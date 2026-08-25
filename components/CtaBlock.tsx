import Link from "next/link";
import { SITE_CONFIG } from "@/data/site";

interface CtaBlockProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CtaBlock({
  title = "Готовы обсудить ваш проект мебели?",
  subtitle = "Запишитесь на бесплатный выезд мастера по Санкт-Петербургу для снятия точных размеров помещения.",
  buttonText = "Записаться на замер",
  buttonHref = "#measure",
}: CtaBlockProps) {
  return (
    <div
      style={{
        background: "var(--bg-surface-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "48px 36px",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2 className="section-title" style={{ marginBottom: "16px" }}>
        {title}
      </h2>
      <p className="section-subtitle" style={{ margin: "0 auto 28px", maxWidth: "600px" }}>
        {subtitle}
      </p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href={buttonHref} className="btn btn-green">
          {buttonText}
        </Link>
        <a
          href={SITE_CONFIG.vkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-glass"
        >
          Написать ВКонтакте
        </a>
      </div>
    </div>
  );
}
