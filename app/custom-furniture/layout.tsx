import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Корпусная мебель на заказ в СПб | ПитерМебель",
  description: "Прихожие, реечные стеновые панели, ТВ-зоны и мебель для бизнеса по индивидуальным размерам. Производство полного цикла в Санкт-Петербурге с 2005 года.",
  alternates: {
    canonical: "/custom-furniture",
  },
  openGraph: buildOg("Корпусная мебель на заказ в СПб | ПитерМебель", "Прихожие, реечные стеновые панели, ТВ-зоны и мебель для бизнеса по индивидуальным размерам. Производство полного цикла в Санкт-Петербурге с 2005 года.", "/custom-furniture"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
