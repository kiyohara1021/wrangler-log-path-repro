// Workaround: set the env var first, then import the plugin dynamically.
import { defineConfig } from "vite";

export default defineConfig(async () => {
  process.env.WRANGLER_LOG_PATH = ".wrangler-logs/dynamic";
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return { plugins: [cloudflare()] };
});
