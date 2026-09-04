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
  subtitle = "Запишитесь на консультацию в офис на пл. Стачек, 9 или отправьте размеры для предварительного расчета сметы.",
  buttonText = "Записаться на консультацию",
  buttonHref = "/contacts#measure",
}: CtaBlockProps) {
  return (
    <div
      style={{
        background: "var(--bg-surface-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0px",
        padding: "48px 40px",
        textAlign: "left",
        maxWidth: "920px",
        margin: "0 auto",
      }}
    >
      <h2 className="section-title" style={{ marginBottom: "16px", textAlign: "left" }}>
        {title}
      </h2>
      <p className="section-subtitle" style={{ margin: "0 0 28px", maxWidth: "680px", textAlign: "left" }}>
        {subtitle}
      </p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "flex-start", flexWrap: "wrap" }}>
        <Link href={buttonHref} className="btn btn-green">
          {buttonText}
        </Link>
        <a
          href={SITE_CONFIG.vkImUrl}
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
