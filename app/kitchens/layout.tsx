import type { Metadata } from "next";
import { buildOg, SITE_URL } from "@/lib/seo";
import { KITCHENS } from "@/data/kitchens";

export const metadata: Metadata = {
  title: "Кухни на заказ в СПб от производителя | ПитерМебель",
  description: "Кухни на заказ по индивидуальным размерам в Санкт-Петербурге: эмаль, пластик и шпон. Проектирование, договор и монтаж под ключ.",
  alternates: {
    canonical: "/kitchens",
  },
  openGraph: buildOg("Кухни на заказ в СПб от производителя | ПитерМебель", "Индивидуальные кухни из эмали, пластика и шпона с монтажом под ключ.", "/kitchens"),
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
