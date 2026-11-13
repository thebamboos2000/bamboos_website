/** Joins class names, skipping falsy values. */
/** "+917592925757" becomes "+91 75929 25757". Other numbers are returned as they are. */
export function formatPhone(e164: string): string {
  const indian = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return indian ? `+91 ${indian[1]} ${indian[2]}` : e164;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Named `sizes` presets, so image widths match the real layouts. */
export const imageSizes = {
  hero: "(min-width: 1024px) 34vw, 72vw",
  full: "100vw",
  thumb: "(min-width: 1024px) 176px, 96px",
  half: "(min-width: 1024px) 50vw, 100vw",
  wide: "(min-width: 1024px) 66vw, 100vw",
  third: "(min-width: 768px) 33vw, 58vw",
  quarter: "(min-width: 1024px) 25vw, 72vw",
  galleryCard: "(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw",
  lightbox: "100vw",
} as const;

export type ImageSizePreset = keyof typeof imageSizes;
