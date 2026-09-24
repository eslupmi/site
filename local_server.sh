#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
./local_build.sh
uv run --no-project -m http.server --directory publish 1313
