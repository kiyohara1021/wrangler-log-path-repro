# wrangler-log-path-repro

Minimal reproduction: `WRANGLER_LOG_PATH` set inside `vite.config.ts` is ignored
when `@cloudflare/vite-plugin` is imported statically, because Wrangler resolves
the debug log file path once, at module evaluation time.

## Versions

- wrangler 4.162.0
- @cloudflare/vite-plugin 1.69.1
- vite 8.3.6
- Node 24 on macOS 27.2 (arm64), Node 22 on Linux

## Run

```sh
npm install
./repro.sh
```

`repro.sh` redirects `XDG_CONFIG_HOME` to `./.fake-global-config` so that
Wrangler's default (global) log directory is visible inside this folder.

## Variants

| Script | How the env var is set | Where the log goes |
|---|---|---|
| `build:static` | `process.env.WRANGLER_LOG_PATH = ...` after a static `import { cloudflare }` | ❌ global default dir (ignored) |
| `build:dynamic` | set env var, then `await import("@cloudflare/vite-plugin")` | ✅ `.wrangler-logs/dynamic` |
| `build:env` | set on the command line | ✅ `.wrangler-logs/env` |
| `build:writelogs` | `process.env.WRANGLER_WRITE_LOGS = "false"` after a static import | ✅ respected (no file) |

## Output

```
== static
.fake-global-config/.wrangler/logs/wrangler-<timestamp>.log
== dynamic
.wrangler-logs/dynamic/wrangler-<timestamp>.log
== env
.wrangler-logs/env/wrangler-<timestamp>.log
== writelogs
  (no log file written)
```

The `static` log only contains messages emitted during the build (after the
config body ran), so the env var was already set when Wrangler wrote to the file —
it just wasn't read again.

## Cause

`packages/wrangler/src/utils/log-file.ts`:

```ts
export const debugLogFilepath = getDebugFilepath(); // evaluated at import time
```

whereas `WRANGLER_WRITE_LOGS` is read lazily in `shouldLogToDisk()` on every write.
