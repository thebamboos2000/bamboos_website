import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": fileURLToPath(
        new URL("./tests/stubs/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      include: ["src/services/**", "src/schemas/**", "src/features/**/lib/**"],
      exclude: ["**/*.test.*"],
      thresholds: {
        "src/services/**": { statements: 95, branches: 90, functions: 95, lines: 95 },
        "src/schemas/**": { statements: 95, branches: 90, functions: 95, lines: 95 },
        "src/features/**/lib/**": { statements: 80, branches: 80, functions: 80, lines: 80 },
      },
    },
  },
});
