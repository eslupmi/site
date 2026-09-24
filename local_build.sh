#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
IMPULSE_README=https://raw.githubusercontent.com/eslupmi/impulse/develop/README.md uv run scripts/sync_readme.py
uv run hugo --minify
uv run scripts/build_docs.py
