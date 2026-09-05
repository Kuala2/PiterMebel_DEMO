import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Портфолио: кухни и мебель на заказ в СПб | ПитерМебель",
  description: "Реализованные проекты студии «ПитерМебель»: кухни, гардеробные, корпусная мебель. Фото с объектов, материалы, сроки и стоимость — собственное производство в СПб.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: buildOg("Портфолио: кухни и мебель на заказ в СПб | ПитерМебель", "Реализованные проекты студии «ПитерМебель»: кухни, гардеробные, корпусная мебель. Фото с объектов, материалы, сроки и стоимость — собственное производство в СПб.", "/projects"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
