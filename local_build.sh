#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
IMPULSE_README=https://raw.githubusercontent.com/eslupmi/impulse/develop/README.md uv run --no-project scripts/sync_readme.py
hugo --minify
uv run --no-project scripts/build_docs.py
