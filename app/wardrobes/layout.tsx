import type { Metadata } from "next";
import { buildOg, buildTwitter } from "@/lib/seo";

const TITLE = "Шкафы и гардеробные на заказ в СПб | ПитерМебель";
const DESCRIPTION =
  "Распашные и встроенные шкафы, шкафы-купе, гардеробные, прихожие и спальни на заказ в СПб от 80 000 ₽. ЛДСП Egger, МДФ, Stopsol. Срок 2–4 недели.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/wardrobes/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/wardrobes"),
  twitter: buildTwitter(TITLE, DESCRIPTION),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
