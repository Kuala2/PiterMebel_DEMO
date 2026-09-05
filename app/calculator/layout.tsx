import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Калькулятор кухни и мебели на заказ | ПитерМебель",
  description: "Предварительный расчет стоимости кухни или шкафа онлайн по ценам собственного производства — без наценок салонов. Санкт-Петербург, замер и смета в подарок.",
  alternates: {
    canonical: "/calculator",
  },
  openGraph: buildOg("Калькулятор кухни и мебели на заказ | ПитерМебель", "Предварительный расчет стоимости кухни или шкафа онлайн по ценам собственного производства — без наценок салонов. Санкт-Петербург, замер и смета в подарок.", "/calculator"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
