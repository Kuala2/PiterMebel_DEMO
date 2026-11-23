import type { Metadata } from "next";
import { buildOg, buildTwitter, buildWideOgImage } from "@/lib/seo";

const TITLE = "Шкафы и гардеробные на заказ в СПб | ПитерМебель";
const DESCRIPTION =
  "Распашные и встроенные шкафы, шкафы-купе, гардеробные, прихожие и спальни на заказ в СПб от 80 000 ₽. ЛДСП Egger, МДФ, Stopsol. Срок 21–40 рабочих дней.";
const OG_COVER = buildWideOgImage(
  "/img/og/services/walk-in.jpg",
  "Шкафы и гардеробные на заказ в Санкт-Петербурге — ПитерМебель"
);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/wardrobes/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/wardrobes", OG_COVER),
  twitter: buildTwitter(TITLE, DESCRIPTION, OG_COVER),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
