import "server-only";
import { canShowVenuePhoto, VENUE_PHOTOS, venueVisual, type VenuePhotoId } from "@/config/venue-photos";
import type { GalleryCategory, GalleryItem, GalleryLayout, Visual } from "@/types/domain";
import { stock } from "./stock-images";

/**
 * Stock images here are illustrative and don't show BAMBOOS. Venue photographs come
 * from config/venue-photos.ts, and replace the stock "venue" category once they may be
 * shown, so real and stock rooms are never mixed. Real event photos need licence and
 * guest consent first (ADR-006).
 */
const photo = (
  id: string,
  category: GalleryCategory,
  layout: GalleryLayout,
  visual: Visual,
  title: string,
  featured = false,
): GalleryItem => ({ id, kind: "visual", category, layout, featured, title, visual });

const stockGallery: GalleryItem[] = [
  photo("grand-hall", "venue", "wide", stock.grandHall, "Long tables beneath an arched skylight", true),
  photo("floral-tall", "reception", "tall", stock.floralChandelierTall, "A chandelier within a canopy of flowers", true),
  photo("marigold-yellow", "engagement", "tall", stock.marigoldYellow, "Henna and marigold", true),
  photo("ballroom-rounds", "reception", "wide", stock.ballroomRounds, "A ballroom set for a formal evening", true),
  photo("candle-table", "wedding", "wide", stock.candleFloralTable, "White flowers and candlelight", true),
  photo("marble", "venue", "tall", stock.marbleColumns, "Arched bays above a marble floor", true),
  photo("hanging-garden", "wedding", "wide", stock.hangingGarden, "Flowers sweeping overhead", true),
  photo("corporate-lights", "corporate", "wide", stock.corporateStage, "An audience before a lit stage", true),
  photo("candle-roses", "wedding", "square", stock.candleTable, "White roses and pearl candles"),
  photo("theatre-tiers", "venue", "wide", stock.theatreTiers, "Curved tiers of balconies"),
  photo("floral-wide", "reception", "wide", stock.floralChandeliers, "Crystal within a ceiling of flowers"),
  photo("sunlit", "venue", "wide", stock.sunlitLobby, "Morning light across marble"),
  photo("held-hands", "engagement", "wide", stock.heldHands, "Hands held, henna and jewellery"),
  photo("roses-ceiling", "wedding", "wide", stock.rosesCeiling, "Roses cascading from above"),
  photo("dim-candles", "celebration", "wide", stock.dimCandles, "Small tables in candlelight"),
  photo("gold-saree", "engagement", "tall", stock.goldSaree, "Embroidered gold, up close"),
  photo("red-candles", "celebration", "tall", stock.redCandleTable, "Tapered candles and dark flowers"),
  photo("string-lights", "celebration", "square", stock.stringLightTable, "Candelabra beneath string lights"),
  photo("stage-lights", "corporate", "wide", stock.stageLights, "Beams from a lighting rig"),
  photo("floral-drape", "reception", "wide", stock.floralDrape, "Gold drapes and hanging lamps"),
  photo("black-table", "corporate", "wide", stock.blackTable, "A formal table in black linen"),
  photo("ornate-hallway", "venue", "wide", stock.ornateHallway, "A golden hallway of columns"),
  photo("floral-hoop", "wedding", "tall", stock.floralHoop, "A floral hoop arch"),
  photo("beamed-hall", "venue", "tall", stock.beamedHall, "A timber-beamed hall with chandeliers"),
];

const venuePhoto = (
  id: VenuePhotoId,
  layout: GalleryLayout,
  title: string,
  focal?: string,
  featured = true,
): GalleryItem[] => {
  if (!canShowVenuePhoto(VENUE_PHOTOS[id].status)) return [];
  const visual = venueVisual(id, { kind: "pending", art: "stalks", brief: title }, focal);
  return [photo(id, "venue", layout, visual, title, featured)];
};

const venueGallery: GalleryItem[] = [
  ...venuePhoto("auditoriumStage", "wide", "The auditorium, set for a wedding"),
  ...venuePhoto("stageFlorals", "tall", "A stage of red roses", "50% 45%"),
  ...venuePhoto("hallDoorway", "wide", "The doorway into the hall"),
  ...venuePhoto("hallAisle", "wide", "The aisle to the stage"),
  ...venuePhoto("stageAisle", "tall", "A stage dressed for a wedding"),
  ...venuePhoto("entranceDay", "wide", "The driveway and entrance", undefined, false),
  ...venuePhoto("archesHall", "wide", "Three floral arches", undefined, false),
  ...venuePhoto("aisleFlowers", "wide", "An aisle lined with flowers", undefined, false),
  ...venuePhoto("diningCanopy", "wide", "Dining under the canopy", undefined, false),
  ...venuePhoto("lawnDusk", "wide", "The lawn at dusk", undefined, false),
  ...venuePhoto("lawnDay", "wide", "The lawn by day", undefined, false),
  ...venuePhoto("buffet", "wide", "The buffet counter", undefined, false),
  ...venuePhoto("lightArch", "wide", "An arch of light", undefined, false),
  ...venuePhoto("signNight", "wide", "The sign at dusk", undefined, false),
  ...venuePhoto("signGarden", "wide", "Marigolds by the sign", undefined, false),
  ...venuePhoto("playground", "wide", "The play area", undefined, false),
  ...venuePhoto("entranceEvening", "wide", "The entrance at dusk"),
  ...venuePhoto("decoratedHall", "tall", "The hall, set for a ceremony", "78% 45%"),
  ...venuePhoto("outdoorLawn", "wide", "The lawn by day"),
  ...venuePhoto("entrance", "wide", "The driveway and bamboo hedges"),
  ...venuePhoto("gardenReception", "square", "The lawn at dusk", "62% 55%"),
  ...venuePhoto("auditoriumSeating", "wide", "Rows of covered chairs in the hall"),
  ...venuePhoto("outdoorDining", "wide", "Tables laid out on the lawn"),
  ...venuePhoto("playArea", "square", "The play area"),
];

const gallery: GalleryItem[] =
  venueGallery.length > 0
    ? [
        ...venueGallery,
        ...stockGallery
          .filter((item) => item.category !== "venue")
          .map((item) => ({ ...item, featured: false })),
      ]
    : stockGallery;

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return gallery;
}

export async function getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  return gallery.filter((item) => item.featured);
}
