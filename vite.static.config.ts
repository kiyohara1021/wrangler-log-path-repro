// Static import: wrangler is evaluated before this file's body runs,
// so the WRANGLER_LOG_PATH set below is ignored.
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

process.env.WRANGLER_LOG_PATH = ".wrangler-logs/static";

export default defineConfig({
  plugins: [cloudflare()],
});
