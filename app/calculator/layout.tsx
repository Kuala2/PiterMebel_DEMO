import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Калькулятор кухни и мебели на заказ | ПитерМебель",
  description: "Предварительный расчет стоимости кухни или шкафа онлайн по ценам собственного производства — без наценок салонов. Санкт-Петербург, 3D-проект и консультация дизайнера.",
  alternates: {
    canonical: "/calculator",
  },
  openGraph: buildOg("Калькулятор кухни и мебели на заказ | ПитерМебель", "Предварительный расчет стоимости кухни или шкафа онлайн по ценам собственного производства — без наценок салонов. Санкт-Петербург, 3D-проект и консультация дизайнера.", "/calculator"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
