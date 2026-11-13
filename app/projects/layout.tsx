import type { Metadata } from "next";
import { buildOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Портфолио: кухни и мебель на заказ в СПб | ПитерМебель",
  description: "Реализованные кухни, гардеробные и корпусная мебель студии «ПитерМебель». Фотографии, материалы и особенности проектов в Санкт-Петербурге.",
  alternates: {
    canonical: "/projects/",
  },
  openGraph: buildOg("Портфолио: кухни и мебель на заказ в СПб | ПитерМебель", "Фотографии, материалы и особенности реализованных проектов студии.", "/projects"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
