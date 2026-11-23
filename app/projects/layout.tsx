import type { Metadata } from "next";
import { buildOg, buildTwitter, buildWideOgImage } from "@/lib/seo";

const TITLE = "Портфолио: кухни и мебель на заказ в СПб | ПитерМебель";
const DESCRIPTION =
  "Реализованные кухни, гардеробные, шкафы и корпусная мебель студии «ПитерМебель» в Санкт-Петербурге. Фотографии, материалы и расчёт под ваши размеры.";
const OG_COVER = buildWideOgImage(
  "/img/og/kitchens/sherman-cognac.jpg",
  "Портфолио кухонь и мебели на заказ в СПб — ПитерМебель"
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/projects/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/projects", OG_COVER),
  twitter: buildTwitter(TITLE, DESCRIPTION, OG_COVER),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
