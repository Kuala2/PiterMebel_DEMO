import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Кухни на заказ в СПб от производителя | ПитерМебель",
  description: "Кухни на заказ по индивидуальным размерам от собственного производства в Санкт-Петербурге. Эмаль по RAL, шпон, ультаматовые фасады. Схема электрики в подарок, офис: пл. Стачек, 9.",
  alternates: {
    canonical: "/kitchens",
  },
  openGraph: buildOg("Кухни на заказ в СПб от производителя | ПитерМебель", "Кухни на заказ по индивидуальным размерам от собственного производства в Санкт-Петербурге. Эмаль по RAL, шпон, ультаматовые фасады. Схема электрики в подарок, офис: пл. Стачек, 9.", "/kitchens"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
