import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/data/site";
import { buildTwitter, OG_HOME_IMAGE } from "@/lib/seo";

const NOT_FOUND_TITLE = "Страница не найдена (404) | ПитерМебель";
const NOT_FOUND_DESCRIPTION =
  "Запрошенная страница не найдена. Перейдите в каталог кухонь, шкафов или на главную страницу студии ПитерМебель.";

export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  description: NOT_FOUND_DESCRIPTION,
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
    siteName: SITE_CONFIG.name,
    locale: "ru_RU",
    type: "website",
    images: [OG_HOME_IMAGE],
  },
  twitter: buildTwitter(NOT_FOUND_TITLE, NOT_FOUND_DESCRIPTION, OG_HOME_IMAGE),
};

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="container not-found-content">
        <h1>Страница не найдена (404)</h1>
        <p>Возможно, адрес изменился или в ссылке есть опечатка.</p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-green">На главную</Link>
          <Link href="/kitchens/" className="btn btn-glass">Смотреть кухни</Link>
        </div>
      </div>
    </section>
  );
}

