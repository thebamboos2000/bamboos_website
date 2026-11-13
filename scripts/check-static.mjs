// Fails if any route renders per request. See ADR-007.
// Reads the build's own route data, so run it after `npm run build`.
import { readFileSync } from "node:fs";

const read = (file) => JSON.parse(readFileSync(new URL(`../.next/${file}`, import.meta.url), "utf8"));

const routes = read("routes-manifest.json");
const prerender = read("prerender-manifest.json");

const prerendered = new Set(Object.keys(prerender.routes));
const dynamicTemplates = new Set(Object.keys(prerender.dynamicRoutes ?? {}));

const pages = [...routes.staticRoutes, ...routes.dynamicRoutes].map((route) => route.page);

// Metadata image and icon routes are generated at build time.
const dynamic = pages.filter(
  (page) => !prerendered.has(page) && !dynamicTemplates.has(page) && !page.startsWith("/_"),
);

if (dynamic.length > 0) {
  console.error(`Dynamic routes found:\n${dynamic.join("\n")}`);
  process.exit(1);
}

console.log(`Static check passed: ${prerendered.size} prerendered routes, 0 dynamic.`);
