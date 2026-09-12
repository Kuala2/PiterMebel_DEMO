import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Шкафы и гардеробные на заказ в СПб | ПитерМебель",
  description: "Встроенные шкафы и гардеробные на заказ по индивидуальным размерам в Санкт-Петербурге. Проектирование, изготовление и монтаж под ключ.",
  alternates: {
    canonical: "/wardrobes",
  },
  openGraph: buildOg("Шкафы и гардеробные на заказ в СПб | ПитерМебель", "Встроенные шкафы и гардеробные по индивидуальным размерам с монтажом.", "/wardrobes"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
