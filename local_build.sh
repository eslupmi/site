#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
IMPULSE_README=https://raw.githubusercontent.com/eslupmi/impulse/develop/README.md uv run --no-project python <<'PY'
import os, pathlib, re, urllib.request
readme = urllib.request.urlopen(os.environ["IMPULSE_README"]).read().decode()
section = re.search(r"## Features\n+(.*?)(?=\n## )", readme, re.S).group(1)
def md(s):
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" class="brand-color">\1</a>', s)
    return s.replace("https://docs.impulse.bot", "/docs")
items = []
for line in section.splitlines():
    m = re.match(r"- (.*)", line)
    if m:
        items.append(f"<p>{md(m.group(1))}</p>")
html = "\n      ".join(items)
path = pathlib.Path("content/_index.md")
path.write_text(path.read_text().replace("<!-- FEATURES -->", html, 1))
PY
hugo --minify
uv run --no-project scripts/build_docs.py
