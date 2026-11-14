// For comparison: WRANGLER_WRITE_LOGS set after a static import IS respected,
// because it is read lazily on each write.
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

process.env.WRANGLER_WRITE_LOGS = "false";

export default defineConfig({
  plugins: [cloudflare()],
});
