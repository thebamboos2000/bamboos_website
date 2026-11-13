import { describe, expect, it } from "vitest";
import type { GalleryCategory, GalleryItem } from "@/types/domain";
import { availableFilters, filterGallery, stepIndex } from "./filter-gallery";

const item = (id: string, category: GalleryCategory): GalleryItem => ({
  id,
  category,
  kind: "visual",
  layout: "square",
  title: id,
  visual: { kind: "pending", art: "arch", brief: id },
});

const items = [item("a", "wedding"), item("b", "venue"), item("c", "wedding")];

describe("filterGallery", () => {
  it("returns everything for the all filter, as a copy", () => {
    const result = filterGallery(items, "all");
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  it("keeps original order within a category", () => {
    expect(filterGallery(items, "wedding").map((entry) => entry.id)).toEqual(["a", "c"]);
  });

  it("returns nothing for an empty category", () => {
    expect(filterGallery(items, "corporate")).toEqual([]);
  });

  it("does not mutate its input", () => {
    const before = [...items];
    filterGallery(items, "venue");
    expect(items).toEqual(before);
  });
});

describe("availableFilters", () => {
  it("hides empty categories and reports counts", () => {
    expect(availableFilters(items).map(({ id, count }) => [id, count])).toEqual([
      ["all", 3],
      ["wedding", 2],
      ["venue", 1],
    ]);
  });
});

describe("stepIndex", () => {
  it.each([
    [0, 1, 3, 1],
    [2, 1, 3, 0],
    [0, -1, 3, 2],
  ])("from %i by %i of %i gives %i", (current, delta, length, expected) => {
    expect(stepIndex(current, delta, length)).toBe(expected);
  });
});
