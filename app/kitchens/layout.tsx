import type { Metadata } from "next";
import { buildOg, buildTwitter } from "@/lib/seo";

const TITLE = "Кухни на заказ в СПб от производителя | ПитерМебель";
const DESCRIPTION =
  "Кухни на заказ в Санкт-Петербурге от 160 000 ₽ (угловая 3,5 м от 250 тыс. ₽): Egger, пластик AGT, эмаль и шпон, столешница Slotex 38 мм. Срок 3–4 недели.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/kitchens/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/kitchens"),
  twitter: buildTwitter(TITLE, DESCRIPTION),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
