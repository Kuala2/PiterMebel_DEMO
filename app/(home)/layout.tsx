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
  return children;
}
