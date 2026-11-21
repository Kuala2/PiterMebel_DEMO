import type { Metadata } from "next";
import { buildOg, buildTwitter } from "@/lib/seo";

const TITLE = "Калькулятор мебели на заказ | ПитерМебель";
const DESCRIPTION =
  "Онлайн-калькулятор стоимости кухни, шкафа или корпусной мебели на заказ в СПб по длине, планировке, материалу фасадов и опциям.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/calculator/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/calculator"),
  twitter: buildTwitter(TITLE, DESCRIPTION),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
