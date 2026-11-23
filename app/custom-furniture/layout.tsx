import type { Metadata } from "next";
import { buildOg, buildTwitter, buildWideOgImage } from "@/lib/seo";

const TITLE = "Корпусная мебель на заказ в СПб | ПитерМебель";
const DESCRIPTION =
  "Мебель для ванной, ТВ-зоны, перегородки, детские, кабинеты, постирочные, лоджии, комоды и ресепшен на заказ в СПб от 80 000 ₽. Свой цех с 2005 года.";
const OG_COVER = buildWideOgImage(
  "/img/og/services/tv-zones.jpg",
  "Корпусная мебель на заказ в Санкт-Петербурге — ПитерМебель"
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/custom-furniture/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/custom-furniture", OG_COVER),
  twitter: buildTwitter(TITLE, DESCRIPTION, OG_COVER),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
