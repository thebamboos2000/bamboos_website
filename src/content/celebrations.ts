import "server-only";
import type { Celebration } from "@/types/domain";
import { stock } from "./stock-images";

/**
 * Draft copy for client approval. It describes the occasion, not the venue's
 * capabilities: `bringToUs` lists questions for the visitor, never promises.
 */
const celebrations: Celebration[] = [
  {
    slug: "weddings",
    eventTypeId: "wedding",
    title: "Weddings",
    kicker: "The day itself",
    summary: "The hush before the ceremony, the rush of family, and the long table after.",
    body: [
      "A wedding moves through many moods in a single day. There is the quiet before the ceremony, the moment two families become one room, and the unhurried hours of food and photographs that follow.",
      "The space should hold all of it without getting in the way, so that what people remember is each other.",
    ],
    bringToUs: [
      "Your date, and any dates you could consider instead",
      "How many guests you expect, and how you imagine them seated",
      "The ceremony and its timings",
      "How you would like dining to work",
    ],
    heroVisual: stock.ivoryStage,
    visuals: [stock.floralArchway, stock.longTable],
    seo: {
      title: "Wedding Venue in Aluva",
      description:
        "Plan your wedding at BAMBOOS, an auditorium and wedding venue in Aluva, Kerala. Send an enquiry to discuss your date and guest numbers.",
    },
  },
  {
    slug: "engagements",
    eventTypeId: "engagement",
    title: "Engagements",
    kicker: "The first promise",
    summary: "An intimate occasion that still deserves a sense of arrival.",
    body: [
      "An engagement is often the first time both families share a room. It is smaller than the wedding that follows, but no less carefully watched by everyone in it.",
      "It asks for warmth and closeness, and for a setting that makes a modest guest list feel like the right number of people.",
    ],
    bringToUs: [
      "Your preferred date and time of day",
      "The number of guests you expect",
      "Any ceremony or exchange you are planning",
      "Whether you would like to include a meal",
    ],
    heroVisual: stock.marigoldHands,
    visuals: [stock.ringExchange, stock.jasmineGarland],
    seo: {
      title: "Engagement Venue in Aluva",
      description:
        "Host your engagement at BAMBOOS in Aluva, Kerala. Send an enquiry to discuss your date and guest numbers.",
    },
  },
  {
    slug: "receptions",
    eventTypeId: "reception",
    title: "Receptions",
    kicker: "The evening after",
    summary: "The couple arrives, the formality lifts, and the room finally celebrates.",
    body: [
      "A reception has a different energy. The ceremony is complete and guests have come to be glad together, to wait in line for a photograph and to stay longer than they planned.",
      "Good receptions are built on flow: how people arrive, greet the couple, eat and linger.",
    ],
    bringToUs: [
      "Your date and evening timings",
      "The number of guests you expect",
      "Your thoughts on the stage and photographs",
      "How you would like dining to work",
    ],
    heroVisual: stock.floralCeilingWide,
    visuals: [stock.receptionStage, stock.roundTables],
    seo: {
      title: "Reception Venue in Aluva",
      description:
        "Celebrate your reception at BAMBOOS in Aluva, Kerala. Send an enquiry to discuss your date and guest numbers.",
    },
  },
  {
    slug: "birthdays",
    eventTypeId: "birthday",
    title: "Birthday celebrations",
    kicker: "Milestones",
    summary: "First birthdays and landmark years, gathered under one roof.",
    body: [
      "Some birthdays are too big for the house: a child's first year, a parent's sixtieth, a reunion disguised as a party.",
      "These occasions gather every generation, so they need room for grandparents to sit, children to move and someone to raise a toast.",
    ],
    bringToUs: [
      "Whose milestone it is, and the date",
      "The number of guests you expect",
      "Any programme or performance you are planning",
      "Your plans for food",
    ],
    heroVisual: stock.stringLightTable,
    visuals: [stock.partyHat],
    seo: {
      title: "Birthday Celebration Venue in Aluva",
      description:
        "Host a milestone birthday at BAMBOOS in Aluva, Kerala. Send an enquiry to discuss your date and guest numbers.",
    },
  },
  {
    slug: "corporate-events",
    eventTypeId: "corporate",
    title: "Corporate events",
    kicker: "Business, well staged",
    summary: "Annual days, launches and award nights, where the setting carries the message.",
    body: [
      "A company gathering says something about the company. Launches, annual days and award nights all rely on a room that looks considered and keeps everyone's attention where it belongs.",
      "Planning usually starts with the agenda, the audience and what people should leave believing.",
    ],
    bringToUs: [
      "The type of event and its agenda",
      "Your expected attendance",
      "Your presentation and audio needs",
      "Your catering requirements",
    ],
    heroVisual: stock.corporateStage,
    visuals: [stock.moodyDining, stock.stageLights],
    seo: {
      title: "Corporate Event Venue in Aluva",
      description:
        "Plan your corporate event at BAMBOOS in Aluva, Kerala. Send an enquiry to discuss your agenda, dates and attendance.",
    },
  },
  {
    slug: "conferences",
    eventTypeId: "conference",
    title: "Conferences",
    kicker: "Ideas, in one room",
    summary: "A long day of sessions depends on sightlines, sound and a clear flow between them.",
    body: [
      "A conference succeeds on details the audience should never have to notice: whether every seat can see the screen, whether every word carries, and how smoothly people move between sessions.",
      "It starts with understanding how your day runs, hour by hour.",
    ],
    bringToUs: [
      "Your dates and daily schedule",
      "The number of delegates",
      "Your audio-visual needs",
      "Any breakout, registration or dining needs",
    ],
    heroVisual: stock.woodAuditorium,
    visuals: [stock.darkSeats],
    seo: {
      title: "Conference Venue in Aluva",
      description:
        "Host your conference at BAMBOOS in Aluva, Kerala. Send an enquiry to discuss your dates and delegate numbers.",
    },
  },
];

export async function getCelebrations(): Promise<Celebration[]> {
  return celebrations;
}

export async function getCelebrationBySlug(slug: string): Promise<Celebration | undefined> {
  return celebrations.find((celebration) => celebration.slug === slug);
}
