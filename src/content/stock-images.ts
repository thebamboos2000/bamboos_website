import "server-only";
import type { StaticImageData } from "next/image";
import type { Visual } from "@/types/domain";
import goldenBallroomImage from "@/assets/media/stock/golden-ballroom.jpg";
import seatedBallroomImage from "@/assets/media/stock/seated-ballroom.jpg";
import marbleColumnsImage from "@/assets/media/stock/marble-columns-hall.jpg";
import domedBallroomImage from "@/assets/media/stock/domed-ballroom.jpg";
import libraryBallroomImage from "@/assets/media/stock/green-ballroom-tables.jpg";
import candleFloralTableImage from "@/assets/media/stock/candles-white-flowers-table.jpg";
import floralChandeliersImage from "@/assets/media/stock/floral-ceiling-chandeliers.jpg";
import floralCeilingWideImage from "@/assets/media/stock/floral-ceiling-wide.jpg";
import floralChandelierTallImage from "@/assets/media/stock/floral-chandelier-tall.jpg";
import rosesCeilingImage from "@/assets/media/stock/roses-ceiling.jpg";
import hangingGardenImage from "@/assets/media/stock/hanging-garden.jpg";
import darkPillarsImage from "@/assets/media/stock/dark-pillared-hall.jpg";
import arcadeHallImage from "@/assets/media/stock/arcade-hall-marble.jpg";
import ornateHallwayImage from "@/assets/media/stock/ornate-hallway.jpg";
import candleChandelierImage from "@/assets/media/stock/candle-chandelier.jpg";
import crystalDarkImage from "@/assets/media/stock/crystal-chandeliers-dark.jpg";
import goldCrystalImage from "@/assets/media/stock/gold-crystal-chandelier.jpg";
import ivoryVaultImage from "@/assets/media/stock/ivory-vaulted-hall.jpg";
import whiteArchesImage from "@/assets/media/stock/white-arched-hall.jpg";
import sunlitLobbyImage from "@/assets/media/stock/sunlit-marble-lobby.jpg";
import marigoldHandsImage from "@/assets/media/stock/marigold-henna-hands.jpg";
import marigoldYellowImage from "@/assets/media/stock/marigold-henna-yellow.jpg";
import jasmineGarlandImage from "@/assets/media/stock/jasmine-garland.jpg";
import stringLightTableImage from "@/assets/media/stock/string-lights-gold-candelabra.jpg";
import redCandleTableImage from "@/assets/media/stock/tapered-candles-table.jpg";
import darkLongTableImage from "@/assets/media/stock/dark-room-long-table.jpg";
import dimCandlesImage from "@/assets/media/stock/dim-candlelit-room.jpg";
import floralDrapeImage from "@/assets/media/stock/floral-gold-drape.jpg";
import theatreTiersImage from "@/assets/media/stock/theatre-tiers.jpg";
import floralStageImage from "@/assets/media/stock/floral-wedding-stage.jpg";
import floralArchwayImage from "@/assets/media/stock/white-floral-archway.jpg";
import longTableImage from "@/assets/media/stock/long-table-setting.jpg";
import ringExchangeImage from "@/assets/media/stock/ring-exchange-henna.jpg";
import heldHandsImage from "@/assets/media/stock/held-hands-ceremony.jpg";
import receptionStageImage from "@/assets/media/stock/reception-stage-sofa.jpg";
import roundTablesImage from "@/assets/media/stock/round-tables-floral.jpg";
import partyHatImage from "@/assets/media/stock/birthday-hat-flowers.jpg";
import corporateStageImage from "@/assets/media/stock/corporate-stage-lights.jpg";
import blackTableImage from "@/assets/media/stock/black-linen-table.jpg";
import woodAuditoriumImage from "@/assets/media/stock/wood-panelled-auditorium.jpg";
import aisleAuditoriumImage from "@/assets/media/stock/auditorium-central-aisle.jpg";
import darkSeatsImage from "@/assets/media/stock/rows-of-seats-dusk.jpg";
import ivoryHallImage from "@/assets/media/stock/ivory-hall-red-seats.jpg";
import stageLightsImage from "@/assets/media/stock/stage-lighting-rig.jpg";
import grandHallImage from "@/assets/media/stock/grand-hall-skylight.jpg";
import floralHoopImage from "@/assets/media/stock/floral-hoop-arch.jpg";
import goldSareeImage from "@/assets/media/stock/gold-saree-detail.jpg";
import ivoryStageImage from "@/assets/media/stock/ivory-drape-stage.jpg";
import ballroomRoundsImage from "@/assets/media/stock/ballroom-round-tables.jpg";
import candleTableImage from "@/assets/media/stock/candles-white-roses.jpg";
import beamedHallImage from "@/assets/media/stock/beamed-hall-chandelier.jpg";
import moodyDiningImage from "@/assets/media/stock/moody-timber-dining.jpg";

/**
 * Licensed stock photographs (Unsplash License), used as illustrative placeholders.
 * THEY DO NOT SHOW BAMBOOS, ITS FACILITIES OR ITS EVENTS. Each one is labelled on
 * screen and blocks launch through `check:launch` until replaced with real photography.
 * Sources are recorded in ASSET_ATTRIBUTION.md.
 */
const illustrative = (src: StaticImageData, description: string, credit: string, focal?: string): Visual => ({
  kind: "image",
  asset: {
    src,
    alt: `${description}. Illustrative stock photograph, not BAMBOOS.`,
    illustrative: true,
    credit,
    ...(focal ? { focal } : {}),
  },
});

export const stock = {
  goldenBallroom: illustrative(goldenBallroomImage, "A gilded ballroom with rows of lit chandeliers reflected in a polished floor", "mana5280", "50% 58%"),
  seatedBallroom: illustrative(seatedBallroomImage, "An ornate hall with rows of chairs beneath chandeliers, in low warm light", "Belov Sergey"),
  marbleColumns: illustrative(marbleColumnsImage, "An empty ballroom with arched bays and a patterned marble floor", "Adrien Olichon"),
  domedBallroom: illustrative(domedBallroomImage, "A circular ballroom with a lit dome, a chandelier and a mirror-like floor", "Adrien Olichon"),
  libraryBallroom: illustrative(libraryBallroomImage, "A dark green panelled ballroom with white tables set beneath chandeliers", "Lucas T Photography"),
  candleFloralTable: illustrative(candleFloralTableImage, "A table of white flowers and glowing candles in amber light", "Denio Rodríguez"),
  floralChandeliers: illustrative(floralChandeliersImage, "Crystal chandeliers suspended within a ceiling of amber flowers", "Road Ahead", "60% 40%"),
  floralCeilingWide: illustrative(floralCeilingWideImage, "A vast hall beneath an installation of flowers and lights", "Road Ahead"),
  floralChandelierTall: illustrative(floralChandelierTallImage, "A golden chandelier glowing within a canopy of hanging flowers", "Road Ahead"),
  rosesCeiling: illustrative(rosesCeilingImage, "Roses and greenery cascading from a ceiling", "佳颖 杜"),
  hangingGarden: illustrative(hangingGardenImage, "Ribbons of flowers and foliage sweeping overhead", "CHUTTERSNAP"),
  darkPillars: illustrative(darkPillarsImage, "Monumental dark columns framing a softly lit hall with a reflective floor", "Nhan Hoang", "50% 62%"),
  arcadeHall: illustrative(arcadeHallImage, "An empty hall with columns, arched windows and a reflective marble floor", "Thilina Alagiyawanna"),
  ornateHallway: illustrative(ornateHallwayImage, "A golden hallway of columns and a decorated ceiling", "Jahanzeb Ahsan"),
  candleChandelier: illustrative(candleChandelierImage, "A gold chandelier of lit candles against deep curtains", "Kamilla Isalieva"),
  crystalDark: illustrative(crystalDarkImage, "Crystal chandeliers shining in a dark, ornate hall", "Lena Maria"),
  goldCrystal: illustrative(goldCrystalImage, "A vast gold and crystal chandelier in a grand hall", "Anna Gelibterman"),
  ivoryVault: illustrative(ivoryVaultImage, "A vaulted ivory hall framed by columns, with a gold chandelier and rows of white chairs", "Sergei Kondalov"),
  whiteArches: illustrative(whiteArchesImage, "A white hall of tall arched windows and chandeliers above a timber floor", "Ula Kuźma"),
  sunlitLobby: illustrative(sunlitLobbyImage, "A sunlit marble lobby with tall windows looking out to palm trees", "Zoshua Colah"),
  marigoldHands: illustrative(marigoldHandsImage, "Henna-decorated hands wearing marigold garlands against yellow fabric", "Rejaul Karim", "50% 50%"),
  marigoldYellow: illustrative(marigoldYellowImage, "A bride's henna-decorated hands crossed among marigold flowers", "Rejaul Karim"),
  jasmineGarland: illustrative(jasmineGarlandImage, "A jasmine garland with pearls on a table beside gold stands", "Vidit Goswami"),
  stringLightTable: illustrative(stringLightTableImage, "A table with gold candelabra beneath loops of warm string lights", "Jennifer Kalenberg"),
  redCandleTable: illustrative(redCandleTableImage, "Tapered candles and dark flowers on a white table", "Katie Puzatova"),
  darkLongTable: illustrative(darkLongTableImage, "A long table with flowers and candles in a dark room", "Razan El Hout"),
  dimCandles: illustrative(dimCandlesImage, "Small candlelit tables in a dark, quiet room", "Ivan Benets"),
  floralDrape: illustrative(floralDrapeImage, "Gold drapes, flowers and white hanging lamps above a stone wall", "Sharif Islam"),
  theatreTiers: illustrative(theatreTiersImage, "Curved tiers of theatre balconies with red curtains", "Valentin Karisch"),
  floralStage: illustrative(floralStageImage, "A wedding stage framed with red and white flowers and draped ivory fabric", "Zaraq Iqbal"),
  floralArchway: illustrative(floralArchwayImage, "A white aisle passing through a floral archway in a softly lit reception hall", "Simply thrilled"),
  longTable: illustrative(longTableImage, "A long dining table set with gold-rimmed plates, white flowers and orange napkins", "McFollis"),
  ringExchange: illustrative(ringExchangeImage, "A close view of hands exchanging a ring, the bride's hand decorated with henna", "Manoj Chauhan", "62% 50%"),
  heldHands: illustrative(heldHandsImage, "A close view of two hands held together, with henna and traditional jewellery", "Mustafa Fatemi"),
  receptionStage: illustrative(receptionStageImage, "A reception stage with an ivory and gold sofa set beneath a wall of flowers", "zain raza"),
  roundTables: illustrative(roundTablesImage, "Round reception tables with white linen and banks of flowers in warm light", "Mathis Payet Descombes"),
  partyHat: illustrative(partyHatImage, "A gold-starred birthday hat on a table in front of a colourful flower arrangement", "Michael Kyule"),
  corporateStage: illustrative(corporateStageImage, "An audience seen from behind, facing a brightly lit stage with large screens", "Tyler Witkin"),
  blackTable: illustrative(blackTableImage, "A formal table with black linen, glassware and candles on a wooden floor", "Filip Rankovic Grobgaard"),
  woodAuditorium: illustrative(woodAuditoriumImage, "A wood-panelled auditorium with rows of seats facing a stage and screen", "Declan Sun"),
  aisleAuditorium: illustrative(aisleAuditoriumImage, "A central aisle between rows of seats, leading to a stage in a modern auditorium", "SR Engineers and Consultants", "50% 60%"),
  darkSeats: illustrative(darkSeatsImage, "Rows of empty theatre seats in low, coloured light", "Gabriela"),
  ivoryHall: illustrative(ivoryHallImage, "An ivory hall with chandeliers and rows of red chairs either side of an aisle", "Angelina Pukhova"),
  stageLights: illustrative(stageLightsImage, "Beams of white and red light from a stage lighting rig against a dark ceiling", "Ambitious Studio* | Rick Barrett"),
  grandHall: illustrative(grandHallImage, "Long banquet tables in a grand hall beneath an arched skylight", "Adrien Olichon"),
  floralHoop: illustrative(floralHoopImage, "A gold hoop arch dressed with red and white flowers in a banquet hall", "Anushka Shashimal"),
  goldSaree: illustrative(goldSareeImage, "A hand resting against richly embroidered gold fabric", "Pablo Heimplatz"),
  ivoryStage: illustrative(ivoryStageImage, "A wide wedding stage with ivory drapes, tall floral stands and warm light", "Zaraq Iqbal", "50% 55%"),
  ballroomRounds: illustrative(ballroomRoundsImage, "A large ballroom filled with round tables prepared for a formal event", "Manya Sivanandam"),
  candleTable: illustrative(candleTableImage, "White roses and pearl-wrapped candles on a table setting", "Babak Eshaghian"),
  beamedHall: illustrative(beamedHallImage, "A timber-beamed hall with chandeliers and flowers on a dining table", "Jonathan Borba"),
  moodyDining: illustrative(moodyDiningImage, "A dark timber-panelled room with round dining tables beneath glowing pendant lights", "Filip Rankovic Grobgaard"),
} as const;
