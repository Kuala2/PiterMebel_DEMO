import type { Metadata } from "next";
import { buildOg, SITE_URL } from "@/lib/seo";
import { KITCHENS } from "@/data/kitchens";

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
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: KITCHENS.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.title,
      url: `${SITE_URL}/kitchens/${item.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />
      {children}
    </>
  );
}
