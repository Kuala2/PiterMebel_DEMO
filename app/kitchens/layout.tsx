import type { Metadata } from "next";
import { buildOg, buildTwitter, buildWideOgImage } from "@/lib/seo";

const TITLE = "Кухни на заказ в СПб от производителя | ПитерМебель";
const DESCRIPTION =
  "Кухни на заказ в Санкт-Петербурге от 160 000 ₽ (угловая 3,5 м от 250 тыс. ₽): Egger, пластик AGT, эмаль и шпон, столешница Slotex 38 мм. От 3–4 недель.";
const OG_COVER = buildWideOgImage(
  "/img/og/kitchens/sherman-cognac.jpg",
  "Кухни на заказ в Санкт-Петербурге — ПитерМебель"
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/kitchens/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/kitchens", OG_COVER),
  twitter: buildTwitter(TITLE, DESCRIPTION, OG_COVER),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
