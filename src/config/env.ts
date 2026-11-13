import { z } from "zod";

const siteUrlSchema = z.url({ protocol: /^https?$/ });

export function resolveSiteUrl(value: string | undefined, onVercel: boolean): string {
  if (!value) {
    if (onVercel) {
      throw new Error("NEXT_PUBLIC_SITE_URL must be set on Vercel deployments.");
    }
    return "http://localhost:3000";
  }
  return siteUrlSchema.parse(value).replace(/\/$/, "");
}

export const siteUrl = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  Boolean(process.env.VERCEL_ENV),
);

/** Search engines may index only real production deployments. */
export const isIndexable = process.env.VERCEL_ENV === "production";
