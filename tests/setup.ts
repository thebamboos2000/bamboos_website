import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom has no matchMedia. Reporting reduced motion keeps reveals out of component tests.
window.matchMedia ??= ((query: string) =>
  ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList);
