import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AmbientVideo, FilmPlayer } from "./video-player";
import { VisualFrame } from "./visual-frame";

const stubMotion = (reduced: boolean) => {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduced, media: query }));
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("VisualFrame", () => {
  it("renders a real image with its alt text", () => {
    render(
      <VisualFrame
        visual={{ kind: "image", asset: { src: "/media/hall.jpg", alt: "The main hall", width: 800, height: 600 } }}
      />,
    );
    expect(screen.getByRole("img", { name: "The main hall" })).toHaveAttribute("loading", "lazy");
  });

  it("marks an LCP image as eager and high priority", () => {
    render(
      <VisualFrame
        priority
        visual={{ kind: "image", asset: { src: "/media/hall.jpg", alt: "The main hall", width: 800, height: 600 } }}
      />,
    );
    const image = screen.getByRole("img", { name: "The main hall" });
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });

  it("visibly labels a stock photograph as illustrative", () => {
    render(
      <VisualFrame
        visual={{
          kind: "image",
          asset: { src: "/a.jpg", alt: "A hall, not BAMBOOS", width: 8, height: 6, illustrative: true },
        }}
      />,
    );
    expect(screen.getByText("Illustrative image")).toBeInTheDocument();
  });

  it("clearly labels a reserved frame, so it can't pass as a photo", () => {
    render(<VisualFrame visual={{ kind: "pending", art: "stage", brief: "The stage, lit" }} />);
    expect(
      screen.getByRole("img", {
        name: "Reserved frame: The stage, lit. Photograph to be supplied by BAMBOOS.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Reserved · Photograph to be supplied")).toBeInTheDocument();
  });
});

describe("AmbientVideo", () => {
  const source = { mp4: "/media/video/hero.mp4", webm: "/media/video/hero.webm" };

  it("doesn't load when reduced motion is requested", () => {
    stubMotion(true);
    const { container } = render(<AmbientVideo source={source} />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("doesn't load in Save-Data mode", () => {
    stubMotion(false);
    vi.stubGlobal("navigator", { ...navigator, connection: { saveData: true } });
    const { container } = render(<AmbientVideo source={source} />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("plays muted inline, and can be paused", async () => {
    stubMotion(false);
    const user = userEvent.setup();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockReturnValue(false);

    const { container } = render(<AmbientVideo source={source} />);
    const video = container.querySelector("video");
    expect(video?.muted).toBe(true);
    expect(video).toHaveAttribute("playsinline");

    await user.click(screen.getByRole("button", { name: "Pause film" }));
    expect(pause).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Play film" })).toBeInTheDocument();
  });
});

describe("FilmPlayer", () => {
  it("downloads nothing until played, and includes captions", () => {
    const { container } = render(
      <FilmPlayer title="A film" source={{ mp4: "/film.mp4", captions: "/film.vtt" }} />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("controls");
    expect(container.querySelector('track[kind="captions"]')).toHaveAttribute("src", "/film.vtt");
  });
});
