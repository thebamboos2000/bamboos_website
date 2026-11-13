import type { Metadata } from "next";
import { seo } from "@/config/seo";
import { siteUrl } from "@/config/env";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Absolute path without a query string. It is also the canonical URL. */
  path: string;
  /** Use the title as written, without the site title template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : seo.titleTemplate.replace("%s", title);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: seo.siteName,
      locale: seo.locale,
      title: fullTitle,
      description,
      url: `${siteUrl}${path === "/" ? "" : path}`,
      // A page-level openGraph object replaces the inherited file-based image.
      images: [seo.socialImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [seo.socialImage] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
