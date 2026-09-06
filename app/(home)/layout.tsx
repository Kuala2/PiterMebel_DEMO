import type { Metadata } from "next";
import { buildOg, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: buildOg(HOME_TITLE, HOME_DESCRIPTION, "/"),
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // LCP-элемент главной — hero-фото. Preload с высоким приоритетом:
  // картинка стартует грузиться сразу, не дожидаясь CSS (иначе LCP 13+с на 4G).
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/img/hero/photo_hero_upscaled.webp"
        fetchPriority="high"
      />
      {children}
    </>
  );
}
