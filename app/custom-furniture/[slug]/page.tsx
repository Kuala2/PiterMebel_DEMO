import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CUSTOM_FURNITURE_SERVICES,
  getServiceByBranchAndSlug,
} from "@/data/services";
import { buildOg, buildTwitter } from "@/lib/seo";
import { getPublicImageMeta } from "@/lib/image-meta";
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

  const ogUrl = `/img/og/services/${service.slug}.jpg`;
  const ogMeta = getPublicImageMeta(ogUrl);
  const fallbackMeta = service.cover ? getPublicImageMeta(service.cover) : null;
  const image = ogMeta
    ? {
        url: ogUrl,
        width: ogMeta.width,
        height: ogMeta.height,
        type: ogMeta.type,
        alt: service.coverAlt || service.h1,
      }
    : service.cover
      ? {
          url: service.cover,
          ...(fallbackMeta
            ? { width: fallbackMeta.width, height: fallbackMeta.height, type: fallbackMeta.type }
            : {}),
          alt: service.coverAlt || service.h1,
        }
      : undefined;

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: {
      canonical: service.href,
    },
    openGraph: buildOg(service.seoTitle, service.seoDescription, service.href, image),
    twitter: buildTwitter(service.seoTitle, service.seoDescription, image),
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
