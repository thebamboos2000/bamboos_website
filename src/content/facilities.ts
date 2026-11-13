import "server-only";
import { venueVisual } from "@/config/venue-photos";
import type { Facility } from "@/types/domain";
import { stock } from "./stock-images";

/**
 * Topics visitors ask about. `covers` says what the entry will explain, and
 * `description` stays null until BAMBOOS confirms the facility. A null entry
 * is shown as "To be confirmed" and is not a claim that the facility exists.
 * Air conditioning and parking come from the venue's Instagram profile (9 November 2026).
 */
const facilities: Facility[] = [
  {
    id: "seating",
    name: "Seating",
    group: "seating",
    covers: "Capacity and seating arrangements for each kind of event.",
    description: null,
    visual: venueVisual("auditoriumSeating", stock.ivoryHall, "50% 60%"),
    requiredForLaunch: true,
  },
  {
    id: "stage",
    name: "Stage",
    group: "stage-av",
    covers: "Stage size, setup and what can be arranged on it.",
    description: null,
    visual: venueVisual("decoratedHall", stock.floralStage, "80% 45%"),
    requiredForLaunch: true,
  },
  {
    id: "lighting-sound",
    name: "Lighting and sound",
    group: "stage-av",
    covers: "The lighting and audio available for ceremonies and presentations.",
    description: null,
    visual: stock.goldCrystal,
    requiredForLaunch: true,
  },
  {
    id: "dining",
    name: "Dining",
    group: "dining",
    covers: "Dining space, service arrangements and catering options.",
    description: null,
    visual: venueVisual("outdoorDining", stock.darkLongTable, "50% 55%"),
    requiredForLaunch: true,
  },
  {
    id: "climate",
    name: "Air conditioning",
    group: "guest-comfort",
    covers: "Which spaces are air-conditioned.",
    description: "The auditorium is air-conditioned, and there is an open-air space as well.",
    visual: null,
    requiredForLaunch: true,
  },
  {
    id: "parking",
    name: "Parking",
    group: "parking",
    covers: "Parking capacity and arrival arrangements.",
    description: "Parking for up to 75 cars.",
    visual: null,
    requiredForLaunch: true,
  },
  {
    id: "accessibility",
    name: "Accessibility",
    group: "guest-comfort",
    covers: "Step-free access and arrangements for guests who need support.",
    description: null,
    visual: null,
    requiredForLaunch: true,
  },
  {
    id: "other",
    name: "Other amenities",
    group: "other",
    covers: "Rooms and services beyond the main hall.",
    description: null,
    visual: null,
    requiredForLaunch: false,
  },
];

export async function getFacilities(): Promise<Facility[]> {
  return facilities;
}
