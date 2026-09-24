#!/usr/bin/env python3
import html, os, pathlib, re, urllib.request

readme = urllib.request.urlopen(os.environ["IMPULSE_README"]).read().decode()
text = re.search(r"## Quick start\n+(.*)\Z", readme, re.S).group(1).strip()

def md(s):
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" class="brand-color">\1</a>', s)
    return s.replace("https://docs.impulse.bot", "/docs")

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
        body = "\n".join(
            '<span class="c1">' + html.escape(line) + "</span>" if re.match(r"\s*#", line) else html.escape(line)
            for line in code
        )
        out.append('<div class="highlight"><pre><code>' + body + "</code></pre></div>")
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

path = pathlib.Path("content/quick-start.md")
src = path.read_text()
start, end = "<!-- QUICKSTART -->", "<!-- /QUICKSTART -->"
block = start + "\n" + "\n".join(out) + "\n" + end
path.write_text(re.sub(re.escape(start) + r".*?" + re.escape(end), block, src, 1, re.S))
