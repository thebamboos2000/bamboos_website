import "server-only";
import { venueVisual } from "@/config/venue-photos";
import type { Venue } from "@/types/domain";
import { stock } from "./stock-images";

/** Copy here is draft brand language for client approval. It makes no factual claims. */
const venue: Venue = {
  headline: "A room built around the moment everyone turns to look.",
  summary:
    "BAMBOOS is an auditorium, wedding venue and event destination in Aluva, Kerala, made for occasions that bring people together.",
  story: [
    "Every gathering has a moment when the room falls quiet and a hundred separate conversations become one shared memory. An auditorium exists for that moment.",
    "BAMBOOS is a place for the rituals, speeches, first dances and long goodbyes that families and organisations plan for months, and remember for years.",
  ],
  halls: [],
  specs: [
    // Seating and parking: the venue's Instagram profile, 9 November 2026. A third-party
    // listing says 600 guests, so BAMBOOS should confirm which figure is right.
    { id: "seating", label: "Seating capacity", value: "Up to 300 guests", requiredForLaunch: true },
    { id: "dining", label: "Dining capacity", value: null, requiredForLaunch: true },
    { id: "stage", label: "Stage dimensions", value: null, requiredForLaunch: false },
    { id: "parking", label: "Parking capacity", value: "Up to 75 cars", requiredForLaunch: false },
  ],
  // Each venue photograph falls back to its labelled stand-in until it may be shown.
  heroVisual: venueVisual("entrance", stock.aisleAuditorium, "56% 50%"),
  heroVideo: null,
  houseVisuals: {
    tall: venueVisual("entranceEvening", stock.ivoryVault, "88% 45%"),
    main: venueVisual("outdoorLawn", stock.arcadeHall, "50% 45%"),
    accent: venueVisual("playArea", stock.candleChandelier, "50% 60%"),
  },
  storyVisual: venueVisual("hallDoorway", stock.seatedBallroom, "52% 50%"),
  auditoriumVisuals: {
    main: venueVisual("stageFlorals", stock.whiteArches, "50% 50%"),
    detail: venueVisual("auditoriumStage", stock.ivoryHall, "50% 45%"),
    tall: venueVisual("stageAisle", stock.theatreTiers, "50% 50%"),
  },
  locationVisual: venueVisual("entranceEvening", {
    kind: "pending",
    art: "stalks",
    brief: "The venue exterior and entrance at dusk",
  }, "70% 50%"),
  closing: {
    home: venueVisual("gardenReception", stock.darkPillars, "60% 50%"),
    venue: venueVisual("gardenReception", stock.candleChandelier, "60% 50%"),
    // No event photographs of the venue exist, so event pages close on labelled stock.
    events: stock.dimCandles,
    occasion: stock.ornateHallway,
    facilities: venueVisual("gardenReception", stock.redCandleTable, "60% 50%"),
    gallery: venueVisual("outdoorLawn", stock.seatedBallroom, "55% 50%"),
  },
  pageVisuals: {
    events: venueVisual("gardenReception", stock.floralChandeliers, "55% 62%"),
    venue: venueVisual("hallAisle", stock.domedBallroom, "50% 55%"),
    facilities: venueVisual("entrance", stock.sunlitLobby, "60% 50%"),
    contact: venueVisual("outdoorLawn", stock.crystalDark, "55% 40%"),
  },
};

export async function getVenue(): Promise<Venue> {
  return venue;
}
