import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Калькулятор мебели на заказ | ПитерМебель",
  description: "Рассчитайте примерный диапазон стоимости кухни, шкафа или корпусной мебели по конфигурации, длине, фасадам и наполнению.",
  alternates: {
    canonical: "/calculator",
  },
  openGraph: buildOg("Калькулятор мебели на заказ | ПитерМебель", "Соберите параметры проекта и получите предварительный диапазон стоимости.", "/calculator"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
