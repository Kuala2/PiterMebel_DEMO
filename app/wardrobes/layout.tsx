import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Шкафы и гардеробные на заказ в СПб | ПитерМебель",
  description: "Шкафы-купе, гардеробные системы и шкафы-витрины на заказ по индивидуальным размерам. Собственный цех в Санкт-Петербурге, индивидуальное проектирование и монтаж под ключ.",
  alternates: {
    canonical: "/wardrobes",
  },
  openGraph: buildOg("Шкафы и гардеробные на заказ в СПб | ПитерМебель", "Шкафы-купе, гардеробные системы и шкафы-витрины на заказ по индивидуальным размерам. Собственный цех в Санкт-Петербурге, индивидуальное проектирование и монтаж под ключ.", "/wardrobes"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
