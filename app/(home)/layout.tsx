import type { Metadata } from "next";
import { buildOg, buildTwitter, HOME_TITLE, HOME_DESCRIPTION, OG_HOME_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: buildOg(HOME_TITLE, HOME_DESCRIPTION, "/", OG_HOME_IMAGE),
  twitter: buildTwitter(HOME_TITLE, HOME_DESCRIPTION, OG_HOME_IMAGE),
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
