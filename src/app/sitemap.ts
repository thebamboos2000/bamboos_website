import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/env";
import { legalNavigation, primaryNavigation } from "@/config/navigation";
import { getCelebrations } from "@/content/celebrations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const celebrations = await getCelebrations();

  const paths = [
    "",
    ...primaryNavigation.map((item) => item.href),
    ...celebrations.map((celebration) => `/celebrations/${celebration.slug}`),
    ...legalNavigation.map((item) => item.href),
  ];

  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
