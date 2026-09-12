import type { Metadata } from "next";
import { buildOg, SITE_URL } from "@/lib/seo";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Портфолио: кухни и мебель на заказ в СПб | ПитерМебель",
  description: "Реализованные кухни, гардеробные и корпусная мебель студии «ПитерМебель». Фотографии, материалы и особенности проектов в Санкт-Петербурге.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: buildOg("Портфолио: кухни и мебель на заказ в СПб | ПитерМебель", "Фотографии, материалы и особенности реализованных проектов студии.", "/projects"),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PROJECTS.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.title,
      url: `${SITE_URL}/projects/${item.slug}/`,
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
