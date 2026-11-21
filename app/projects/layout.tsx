import type { Metadata } from "next";
import { buildOg, buildTwitter } from "@/lib/seo";

const TITLE = "Портфолио: кухни и мебель на заказ в СПб | ПитерМебель";
const DESCRIPTION =
  "Реализованные кухни, гардеробные, шкафы и корпусная мебель студии «ПитерМебель» в Санкт-Петербурге. Фотографии, материалы и расчёт под ваши размеры.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/projects/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/projects"),
  twitter: buildTwitter(TITLE, DESCRIPTION),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
