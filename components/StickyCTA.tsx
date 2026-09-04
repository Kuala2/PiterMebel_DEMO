import Link from "next/link";
import { SITE_CONFIG } from "@/data/site";

/** Фиксированная панель действий на мобильных: позвонить + записаться на замер */
export default function StickyCTA() {
  return (
    <div className="sticky-cta">
      <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="btn btn-green">
        Позвонить
      </a>
      <Link href="/contacts#measure" className="btn btn-glass">
        Консультация
      </Link>
    </div>
  );
}
