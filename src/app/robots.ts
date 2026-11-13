import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/config/env";

/** Only the production deployment may be crawled. Previews and local builds are disallowed. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
