#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
IMPULSE_README=https://raw.githubusercontent.com/eslupmi/impulse/develop/README.md uv run --no-project python <<'PY'
import html, os, pathlib, re, urllib.request
readme = urllib.request.urlopen(os.environ["IMPULSE_README"]).read().decode()
section = re.search(r"## Features\n+(.*?)(?=\n## )", readme, re.S).group(1)
def md(s):
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" class="brand-color">\1</a>', s)
    return s.replace("https://docs.impulse.bot", "/docs")
def quickstart(text):
    lines, out, para, i = text.splitlines(), [], [], 0
    def flush():
        if para:
            out.append("<p>" + md(" ".join(para)) + "</p>")
            para.clear()
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            flush()
            i += 1
            code = []
            while i < len(lines) and not lines[i].startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1
            out.append("<pre><code>" + html.escape("\n".join(code)) + "</code></pre>")
            continue
        if line.startswith("### "):
            flush()
            out.append("<h3>" + md(line[4:].strip()) + "</h3>")
        elif line.strip():
            para.append(line.strip())
        else:
            flush()
        i += 1
    flush()
    return "\n".join(out)
items = []
for line in section.splitlines():
    m = re.match(r"- (.*)", line)
    if m:
        items.append(f"<p>{md(m.group(1))}</p>")
qs = quickstart(re.search(r"## Quick start\n+(.*)\Z", readme, re.S).group(1).strip())
def fill(text, marker, body):
    start, end = f"<!-- {marker} -->", f"<!-- /{marker} -->"
    block = start + "\n" + body + "\n" + end
    pat = re.escape(start) + r".*?" + re.escape(end)
    return re.sub(pat, block, text, 1, re.S) if re.search(pat, text, re.S) else text.replace(start, block, 1)
path = pathlib.Path("content/_index.md")
path.write_text(path.read_text().replace("<!-- FEATURES -->", "\n      ".join(items), 1))
qs_path = pathlib.Path("content/quick-start.md")
qs_path.write_text(fill(qs_path.read_text(), "QUICKSTART", qs))
PY
hugo --minify
uv run --no-project scripts/build_docs.py
