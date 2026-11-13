/** The single definition of site navigation: used by the header, menu, footer and sitemap. */
export const primaryNavigation = [
  { href: "/venue", label: "The Auditorium" },
  { href: "/celebrations", label: "Events" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNavigation = [{ href: "/privacy", label: "Privacy notice" }] as const;

export const enquiryHref = "/contact#enquiry" as const;
