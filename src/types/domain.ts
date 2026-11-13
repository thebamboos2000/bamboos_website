import type { StaticImageData } from "next/image";

/** Shared domain types. `null` always means "not verified by BAMBOOS yet". See DATA_MODEL.md. */

export interface PostalAddress {
  streetAddress: string | null;
  addressLocality: string;
  addressRegion: string;
  postalCode: string | null;
  addressCountry: "IN";
}

export interface OpeningHours {
  days: ("Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su")[];
  opens: string;
  closes: string;
}

export interface BusinessInfo {
  name: string;
  legalName: string | null;
  category: string;
  district: string;
  address: PostalAddress;
  geo: { latitude: number; longitude: number } | null;
  googleMapsUrl: string | null;
  /** Must be an https://www.google.com/maps/embed URL. Loaded only after a visitor's click. */
  googleMapsEmbedUrl: string | null;
  openingHours: OpeningHours[] | null;
}

export interface ContactInfo {
  phoneE164: string | null;
  /** Digits only, international format. */
  whatsappNumber: string | null;
  email: string | null;
  enquiryHours: string | null;
}

export interface MediaAsset {
  src: StaticImageData | string;
  alt: string;
  decorative?: boolean;
  width?: number;
  height?: number;
  credit?: string;
  /** A stock photograph standing in for real BAMBOOS photography. Labelled on screen; blocks launch. */
  illustrative?: boolean;
  /** CSS object-position, keeping the subject in frame across crops. */
  focal?: string;
}

export type ArtKind = "arch" | "aisle" | "canopy" | "tables" | "stage" | "stalks";

/**
 * A frame waiting for real photography. It renders a labelled original
 * illustration, and its brief doubles as the photographer's shot list.
 */
export interface PendingVisual {
  kind: "pending";
  art: ArtKind;
  brief: string;
}

export type Visual = { kind: "image"; asset: MediaAsset } | PendingVisual;

export interface VideoSource {
  mp4: string;
  webm?: string;
  captions?: string;
}

export interface Hall {
  id: string;
  name: string;
  description: string;
  capacity: { seated: number | null; dining: number | null };
  visual: Visual;
}

export interface VenueSpec {
  id: string;
  label: string;
  value: string | null;
  requiredForLaunch: boolean;
}

export interface Venue {
  headline: string;
  summary: string;
  story: string[];
  halls: Hall[];
  specs: VenueSpec[];
  heroVisual: Visual;
  /** Muted hero film. Stays null until a licensed file is supplied. */
  heroVideo: VideoSource | null;
  /** The later scenes of the homepage's opening journey. */
  houseVisuals: { main: Visual; accent: Visual; tall: Visual };
  storyVisual: Visual;
  auditoriumVisuals: { main: Visual; detail: Visual; tall: Visual };
  locationVisual: Visual;
  closing: { home: Visual; venue: Visual; events: Visual; occasion: Visual; facilities: Visual; gallery: Visual };
  pageVisuals: { events: Visual; venue: Visual; facilities: Visual; contact: Visual };
}

export type FacilityGroup = "seating" | "dining" | "stage-av" | "parking" | "guest-comfort" | "other";

export interface Facility {
  id: string;
  name: string;
  group: FacilityGroup;
  /** What a visitor will learn here once confirmed. Never a claim about the venue. */
  covers: string;
  /** Verified description. Null renders as "To be confirmed". */
  description: string | null;
  visual: Visual | null;
  requiredForLaunch: boolean;
}

export interface Celebration {
  slug: string;
  eventTypeId: EventTypeId;
  title: string;
  kicker: string;
  summary: string;
  body: string[];
  bringToUs: string[];
  heroVisual: Visual;
  visuals: Visual[];
  seo: { title: string; description: string };
}

export type EventTypeId =
  | "wedding"
  | "engagement"
  | "reception"
  | "birthday"
  | "corporate"
  | "conference"
  | "other";

export type GalleryCategory =
  | "wedding"
  | "engagement"
  | "reception"
  | "celebration"
  | "corporate"
  | "venue";

export type GalleryLayout = "wide" | "tall" | "square";

interface GalleryItemBase {
  id: string;
  category: GalleryCategory;
  layout: GalleryLayout;
  featured?: boolean;
}

export type GalleryItem =
  | (GalleryItemBase & { kind: "visual"; title: string; visual: Visual })
  | (GalleryItemBase & {
      kind: "video";
      title: string;
      poster: MediaAsset;
      source: ({ type: "file" } & VideoSource) | { type: "youtube"; videoId: string };
    });
