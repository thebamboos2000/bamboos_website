import type { Visual } from "@/types/domain";

/**
 * Venue photographs. The project owner's own photographs are approved. The ones from the
 * venue's BookMyMandap listing are NOT cleared for publication. See "Venue photographs"
 * in ASSET_ATTRIBUTION.md.
 *
 * Until a photo's status is "approved", it appears only in a local preview, never
 * on a Vercel deployment.
 * Approving one means: BAMBOOS has confirmed it shows the real venue and that it
 * may be reused. Then set its status, and stop ignoring its file in .gitignore.
 */
export type VenuePhotoStatus = "unconfirmed" | "approved";

interface VenuePhoto {
  file: string;
  width: number;
  height: number;
  alt: string;
  status: VenuePhotoStatus;
}

const photo = (
  file: string,
  width: number,
  height: number,
  alt: string,
  status: VenuePhotoStatus = "unconfirmed",
): VenuePhoto => ({
  file: `/images/bamboos/${file}.webp`,
  width,
  height,
  alt,
  status,
});

/** The project owner's own photographs (bamboo_images), approved for publication on 13 November 2026. */
const ownPhoto = (file: string, width: number, height: number, alt: string): VenuePhoto =>
  photo(file, width, height, alt, "approved");

export const VENUE_PHOTOS = {
  entrance: photo(
    "bamboos-entrance",
    1774,
    887,
    "A paved driveway curving through bamboo hedges to a red-tiled building, with a sign reading The Bamboos",
  ),
  entranceEvening: photo(
    "bamboos-entrance-evening",
    1448,
    1086,
    "The entrance of The Bamboos at dusk, with fairy lights along the hedges and a lit sign",
  ),
  outdoorLawn: photo(
    "bamboos-outdoor-lawn",
    1448,
    1086,
    "A sunny lawn with a white canopy, string lights and tables set with white chairs",
  ),
  // Held back from every page: its centrepiece is a deity idol, which the project's
  // photo rules exclude. It stays registered so the decision can be revisited.
  mainAuditorium: photo(
    "bamboos-main-auditorium",
    1536,
    1024,
    "A white hall with rows of covered chairs facing a decorated stage",
  ),
  decoratedHall: photo(
    "bamboos-decorated-hall",
    1448,
    1086,
    "A hall with rows of white chairs facing a stage framed by three floral arches",
  ),
  gardenReception: photo(
    "bamboos-garden-reception",
    1448,
    1086,
    "A lit lawn at dusk, with a covered buffet and tables along its far side",
  ),
  auditoriumSeating: photo(
    "bamboos-auditorium-seating",
    1448,
    1086,
    "Rows of chairs in white covers beneath a coffered ceiling with ceiling fans",
  ),
  outdoorDining: photo(
    "bamboos-outdoor-dining",
    1448,
    1086,
    "Long dining tables and white chairs laid out in rows on a lawn beside a red-tiled building",
  ),
  playArea: photo(
    "bamboos-play-area",
    1448,
    1086,
    "A view from above of swings, slides and a roundabout on green turf",
  ),
  // Supplied by the project owner from D:\BK Events\bamboo_images (4.jpeg and 3.jpeg).
  auditoriumStage: ownPhoto(
    "bamboos-auditorium-stage",
    1600,
    1200,
    "The auditorium set for a wedding, with a floral stage beneath a lit ceiling and gold-covered chairs either side",
  ),
  stageFlorals: ownPhoto(
    "bamboos-stage-roses",
    3200,
    2400,
    "A stage dressed with a wall of red roses, white hanging flowers and a cream sofa",
  ),
  // Supplied by the project owner from D:\BK Events\bamboo_images (35.png).
  hallDoorway: ownPhoto(
    "bamboos-hall-doorway",
    1448,
    1086,
    "A doorway draped in pale gold fabric and framed with roses, opening onto a decorated hall and stage",
  ),
  // Supplied by the project owner from D:\BK Events\bamboo_images (22.jpeg and 23.jpeg).
  hallAisle: ownPhoto(
    "bamboos-hall-aisle",
    2600,
    1950,
    "The auditorium set for a wedding, with rows of chairs either side of a carpeted aisle leading to a floral stage",
  ),
  stageAisle: ownPhoto(
    "bamboos-stage-aisle",
    2000,
    2667,
    "A wedding stage with a draped, flower-framed backdrop, and an aisle lined with flowers",
  ),
  // Supplied by the project owner from D:\BK Events\bamboo_images, for the gallery.
  entranceDay: ownPhoto(
    "bamboos-entrance-day",
    2400,
    1800,
    "The driveway curving past bamboo hedges to the red-tiled building, with The Bamboos sign",
  ),
  archesHall: ownPhoto(
    "bamboos-arches-hall",
    1800,
    2400,
    "The hall with three floral arches behind the stage and a dark carpet down the aisle",
  ),
  aisleFlowers: ownPhoto(
    "bamboos-aisle-flowers",
    2400,
    1800,
    "Chairs either side of a carpeted aisle lined with flowers, in a hall with a patterned feature wall",
  ),
  diningCanopy: ownPhoto(
    "bamboos-dining-canopy",
    2400,
    1800,
    "Tables and chairs under a long covered dining area beside the lawn, lit at dusk",
  ),
  lawnDusk: ownPhoto(
    "bamboos-lawn-dusk",
    2400,
    1800,
    "The lawn at dusk, with the lit building and hedges beyond",
  ),
  lawnDay: ownPhoto(
    "bamboos-lawn-day",
    2400,
    1800,
    "A wide lawn bordered by hedges, with a covered dining area along the far side",
  ),
  buffet: ownPhoto(
    "bamboos-buffet",
    2400,
    1800,
    "A long buffet counter with serving dishes under a covered walkway",
  ),
  lightArch: ownPhoto(
    "bamboos-light-arch",
    1280,
    960,
    "A glowing sun-shaped arch over the driveway at night, lined with fairy lights",
  ),
  signNight: ownPhoto(
    "bamboos-sign-night",
    1800,
    2400,
    "The Bamboos sign above a lit bamboo hedge at dusk",
  ),
  signGarden: ownPhoto(
    "bamboos-sign-garden",
    2400,
    1800,
    "The Bamboos sign beside a bed of marigolds and bamboo",
  ),
  playground: ownPhoto(
    "bamboos-playground",
    2400,
    1800,
    "Swings, slides and a climbing frame on green turf, beside a hedge",
  ),
} as const satisfies Record<string, VenuePhoto>;

export type VenuePhotoId = keyof typeof VENUE_PHOTOS;

/** Vercel preview deployments are public too, so the switch is ignored on all of them. */
export function isVenuePhotoPreview(flag: string | undefined, vercelEnv: string | undefined): boolean {
  return flag === "1" && !vercelEnv;
}

export const venuePhotoPreview = isVenuePhotoPreview(
  process.env.BAMBOOS_VENUE_PHOTO_PREVIEW,
  process.env.VERCEL_ENV,
);

export function canShowVenuePhoto(status: VenuePhotoStatus, preview = venuePhotoPreview): boolean {
  return status === "approved" || preview;
}

/** The venue photograph if it may be shown here, otherwise the labelled stock stand-in. */
export function venueVisual(id: VenuePhotoId, fallback: Visual, focal?: string): Visual {
  const { file, width, height, alt, status } = VENUE_PHOTOS[id];
  if (!canShowVenuePhoto(status)) return fallback;
  return { kind: "image", asset: { src: file, alt, width, height, focal } };
}

/** Whether any venue photograph is on screen, which changes what the site says about its images. */
export const showsVenuePhotos = Object.values(VENUE_PHOTOS).some(({ status }) => canShowVenuePhoto(status));
