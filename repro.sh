#!/usr/bin/env bash
# Runs each variant and prints where Wrangler wrote its debug log.
# XDG_CONFIG_HOME is redirected so the "global" log dir is visible inside this folder.
set -u
cd "$(dirname "$0")"
export XDG_CONFIG_HOME="$PWD/.fake-global-config"
export WRANGLER_LOG=debug
export WRANGLER_SEND_METRICS=false
# Proxy env vars make Wrangler log a warning at import time, which would
# muddy the comparison. Remove them for this repro.
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy

for variant in static dynamic env writelogs; do
  rm -rf .wrangler-logs .fake-global-config dist
  npm run -s "build:$variant" > /dev/null 2>&1
  echo "== $variant"
  logs=$(find .wrangler-logs .fake-global-config -name 'wrangler-*.log' 2>/dev/null)
  echo "${logs:-  (no log file written)}"
done
