import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { GalleryCategory, GalleryItem } from "@/types/domain";
import { GalleryExplorer } from "./gallery-explorer";
import { Lightbox } from "./lightbox";

const item = (id: number, category: GalleryCategory): GalleryItem => ({
  id: `item-${id}`,
  category,
  kind: "visual",
  layout: "square",
  title: `Frame ${id}`,
  visual: { kind: "pending", art: "arch", brief: `Frame ${id}` },
});

const items = [
  ...Array.from({ length: 14 }, (_, index) => item(index, "wedding")),
  item(14, "venue"),
  item(15, "venue"),
];

beforeAll(() => {
  // jsdom doesn't implement dialog methods. Real behaviour is covered in Playwright.
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

const tiles = () => screen.getAllByRole("button", { name: /^View:/ });

describe("GalleryExplorer", () => {
  it("shows the first page and reveals more on request", async () => {
    const user = userEvent.setup();
    render(<GalleryExplorer items={items} />);

    expect(tiles()).toHaveLength(12);
    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(tiles()).toHaveLength(16);
    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
  });

  it("filters by category, marks the selection and announces the count", async () => {
    const user = userEvent.setup();
    render(<GalleryExplorer items={items} />);

    const filters = within(screen.getByRole("group", { name: "Filter the gallery" }));
    const venue = filters.getByRole("button", { name: /The venue/ });
    expect(venue).toHaveAttribute("aria-pressed", "false");

    await user.click(venue);

    expect(venue).toHaveAttribute("aria-pressed", "true");
    expect(tiles()).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent("Showing 2 of 2 items");
  });

  it("resets paging when the filter changes", async () => {
    const user = userEvent.setup();
    render(<GalleryExplorer items={items} />);
    await user.click(screen.getByRole("button", { name: "Show more" }));
    await user.click(screen.getByRole("button", { name: /Weddings/ }));
    expect(tiles()).toHaveLength(12);
  });
});

describe("Lightbox", () => {
  const setup = (index = 0) => {
    const onIndexChange = vi.fn();
    const onClose = vi.fn();
    render(
      <Lightbox items={items.slice(0, 3)} index={index} onIndexChange={onIndexChange} onClose={onClose} />,
    );
    return { onIndexChange, onClose };
  };

  it("names the current item and steps forward, wrapping at the end", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(2);
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next", hidden: true }));
    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("supports arrow keys", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(1);
    screen.getByRole("button", { name: "Next", hidden: true }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("reports closing", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();
    await user.click(screen.getByRole("button", { name: "Close", hidden: true }));
    expect(onClose).toHaveBeenCalled();
  });
});
