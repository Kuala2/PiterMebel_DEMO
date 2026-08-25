import Link from "next/link";

interface SectionHeadProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
}

export default function SectionHead({
  kicker,
  title,
  subtitle,
  linkText,
  linkHref,
}: SectionHeadProps) {
  return (
    <div className="section-head-row">
      <div>
        {kicker && (
          <div style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-green-brand)", marginBottom: "8px" }}>
            {kicker}
          </div>
        )}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {linkText && linkHref && (
        <div style={{ flexShrink: 0 }}>
          <Link href={linkHref} className="btn btn-glass btn-sm">
            {linkText}
          </Link>
        </div>
      )}
    </div>
  );
}
