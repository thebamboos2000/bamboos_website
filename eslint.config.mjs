import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const restrict = (...entries) => ({
  "no-restricted-imports": [
    "error",
    { patterns: entries.map(([group, message]) => ({ group, message })) },
  ],
});

const noRoutes = [["@/app/*"], "Only routes may depend on src/app."];
const noFeatures = [
  ["@/features/*"],
  "Features must not be imported here. Compose them in the route.",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "import/no-cycle": "error",
      "react/no-danger": "error",
    },
  },
  {
    // See ARCHITECTURE.md section 11. Files inside a feature use relative imports.
    files: ["src/features/**"],
    rules: restrict(noRoutes, noFeatures),
  },
  {
    files: ["src/components/**", "src/hooks/**"],
    rules: restrict(noRoutes, noFeatures, [
      ["@/content", "@/content/*"],
      "Shared components receive content as props.",
    ]),
  },
  {
    files: ["src/components/ui/**", "src/components/motion/**"],
    rules: restrict(noRoutes, noFeatures, [
      ["@/config/*", "@/content", "@/content/*", "@/services/*"],
      "Shared primitives must stay free of business knowledge.",
    ]),
  },
  {
    files: ["src/services/**", "src/schemas/**", "src/config/**"],
    rules: restrict(noRoutes, noFeatures, [
      ["@/components/*", "react", "react-dom", "next/*"],
      "This layer must stay framework-free so it can run on a future server.",
    ]),
  },
  {
    // The JSON-LD helper is the single approved use. See SECURITY.md section 4.
    files: ["src/lib/seo/json-ld.tsx"],
    rules: { "react/no-danger": "off" },
  },
]);

export default eslintConfig;
