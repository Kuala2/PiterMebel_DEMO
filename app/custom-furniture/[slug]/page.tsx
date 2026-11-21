import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CUSTOM_FURNITURE_SERVICES,
  getServiceByBranchAndSlug,
} from "@/data/services";
import { buildOg, buildTwitter } from "@/lib/seo";
import ServicePageView from "@/components/ServicePageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CUSTOM_FURNITURE_SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceByBranchAndSlug("custom-furniture", slug);
  if (!service) {
    return { title: "Направление не найдено — ПитерМебель" };
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: {
      canonical: service.href,
    },
    openGraph: {
      ...buildOg(service.seoTitle, service.seoDescription, service.href),
      ...(service.cover
        ? { images: [{ url: service.cover, alt: service.coverAlt || service.h1 }] }
        : {}),
    },
    twitter: buildTwitter(
      service.seoTitle,
      service.seoDescription,
      service.cover ? { url: service.cover, alt: service.coverAlt || service.h1 } : undefined
    ),
  };
}

export default async function CustomFurnitureServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceByBranchAndSlug("custom-furniture", slug);
  if (!service) {
    notFound();
  }

  return <ServicePageView service={service} />;
}
