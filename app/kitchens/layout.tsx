import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Кухни на заказ в СПб от производителя | ПитерМебель",
  description: "Кухни на заказ по индивидуальным размерам в Санкт-Петербурге: эмаль, пластик и шпон. Проектирование, договор и монтаж под ключ.",
  alternates: {
    canonical: "/kitchens/",
  },
  openGraph: buildOg("Кухни на заказ в СПб от производителя | ПитерМебель", "Индивидуальные кухни из эмали, пластика и шпона с монтажом под ключ.", "/kitchens"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
