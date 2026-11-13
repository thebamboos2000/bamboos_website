// Starts the dev server with the unapproved venue photographs switched on, for local review only.
import { spawn } from "node:child_process";

spawn("npx next dev", {
  shell: true,
  stdio: "inherit",
  env: { ...process.env, BAMBOOS_VENUE_PHOTO_PREVIEW: "1" },
}).on("exit", (code) => process.exit(code ?? 0));
