import type { Metadata } from "next";
import { buildOg, buildTwitter } from "@/lib/seo";

const TITLE = "Корпусная мебель на заказ в СПб | ПитерМебель";
const DESCRIPTION =
  "Мебель для ванной, ТВ-зоны, перегородки, детские, кабинеты, постирочные, лоджии, комоды и ресепшен на заказ в СПб от 80 000 ₽. Свой цех с 2005 года.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/custom-furniture/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/custom-furniture"),
  twitter: buildTwitter(TITLE, DESCRIPTION),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
