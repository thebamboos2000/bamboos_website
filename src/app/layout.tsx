import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { siteUrl } from "@/config/env";
import { seo } from "@/config/seo";
import "./globals.css";

// One family throughout. The upright weights are preloaded; the italic swaps in when needed.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: "normal",
  display: "swap",
});

const poppinsItalic = Poppins({
  variable: "--font-poppins-italic",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: "italic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.defaultTitle, template: seo.titleTemplate },
  description: seo.defaultDescription,
  applicationName: seo.siteName,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a1712",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${poppinsItalic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
