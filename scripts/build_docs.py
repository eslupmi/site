#!/usr/bin/env python3
import html, json, os, posixpath, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "publish" / "docs"
SRC = Path("/tmp/impulse")
REPO = "https://github.com/eslupmi/impulse.git"
JS = Path(__file__).with_name("versions.js")
CSS = Path(__file__).with_name("docs.css")
VENV = ROOT / ".venv"

def sh(args, **kw):
    subprocess.check_call(args, **kw)

def ensure():
    if Path(sys.prefix).resolve() == VENV.resolve():
        return
    py = VENV / "bin" / "python"
    if not py.is_file():
        sh(["uv", "venv", str(VENV)])
        sh(["uv", "pip", "install", "markdown", "pymdown-extensions", "pygments", "pyyaml", "--python", str(py)])
    os.execv(py, [str(py), *sys.argv])

def tags():
    found = []
    for tag in subprocess.check_output(["git", "tag", "-l", "v*"], cwd=SRC, text=True).split():
        if re.fullmatch(r"v\d+\.\d+\.\d+", tag) and subprocess.call(
            ["git", "cat-file", "-e", f"{tag}:docs/mkdocs.yml"], cwd=SRC, stderr=subprocess.DEVNULL
        ) == 0:
            found.append(tag)
    found.sort(key=lambda t: tuple(map(int, t[1:].split("."))), reverse=True)
    return found

def page_path(md):
    p = Path(md)
    if p.name == "index.md":
        return "" if str(p.parent) == "." else f"{p.parent.as_posix()}/"
    return f"{p.with_suffix('').as_posix()}/"

def page_url(name, md):
    return f"/docs/{name}/{page_path(md)}"

def title_of(text, fallback):
    m = re.search(r"(?m)^#\s+(.+?)\s*$", text)
    if not m:
        return fallback
    t = html.unescape(re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", m.group(1)))
    return t.strip() or fallback

def rewrite(href, src, name):
    if "://" in href or href.startswith(("#", "mailto:", "/")):
        return href
    path, sep, frag = href.partition("#")
    query = ""
    if "?" in path:
        path, query = path.split("?", 1)
        query = "?" + query
    path = path.rstrip("/")
    if not path.endswith(".md"):
        return href
    target = posixpath.normpath(str(Path(src).parent.as_posix() + "/" + path))
    if target.startswith("..") or not target.endswith(".md"):
        return href
    return page_url(name, target) + query + (("#" + frag) if sep else "")

def fix_hrefs(text, src, name):
    return re.sub(r'href="([^"]+)"', lambda m: f'href="{rewrite(m.group(1), src, name)}"', text)

def fix_images(text, src, name):
    def repl(m):
        url = m.group(2)
        if "://" in url or url.startswith(("#", "/")):
            return m.group(0)
        target = posixpath.normpath(posixpath.join(posixpath.dirname(src), url))
        if target.startswith(".."):
            return m.group(0)
        return f'![{m.group(1)}](/docs/{name}/{target})'
    return re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', repl, text)

def nav_html(items, titles, current, name, root=True):
    out = []
    for item in items or []:
        if isinstance(item, str):
            out.append(f'<a{" class=\"active\"" if item == current else ""} href="{page_url(name, item)}">{html.escape(titles[item])}</a>')
        else:
            title, value = next(iter(item.items()))
            if isinstance(value, str):
                out.append(f'<a{" class=\"active\"" if value == current else ""} href="{page_url(name, value)}">{html.escape(str(title))}</a>')
            else:
                inner = nav_html(value, titles, current, name, False)
                label = html.escape(str(title))
                if root:
                    out.append(f'<div class="nav-section nav-root"><div class="nav-section-title">{label}</div>{inner}</div>')
                else:
                    opened = " open" if ' class="active"' in inner else ""
                    out.append(f'<details class="nav-section"{opened}><summary class="nav-section-title">{label}</summary>{inner}</details>')
    return "".join(out)

def plain(fragment):
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment).replace("¶", " ")
    return re.sub(r"\s+", " ", fragment).strip()

def slice_div(page, i):
    depth = 0
    j = i
    while j < len(page):
        if page.startswith("<div", j) and page[j + 4:j + 5] in " >/":
            depth += 1
            j = page.find(">", j) + 1
        elif page.startswith("</div>", j):
            depth -= 1
            j += 6
            if depth == 0:
                return page[i:j]
        else:
            j += 1

def load_chrome():
    page = (ROOT / "publish" / "index.html").read_text()
    header = re.search(r"<header class=\"?header\"?>.*?</header>", page, re.S).group(0)
    footer = re.search(r"<footer class=\"?footer\"?>.*?</footer>", page, re.S).group(0)
    at = page.find("privacy-modal")
    modal = slice_div(page, page.rfind("<div", 0, at))
    gtag = re.search(r'<script async src="https://www.googletagmanager.com/gtag/js\?id=[^"]+"></script><script>.*?</script>', page)
    return header, footer, modal, gtag.group(0) if gtag else ""

def render(name, dest, chrome):
    import markdown
    import yaml
    header, footer, modal, gtag = chrome
    cfg = yaml.safe_load((SRC / "docs" / "mkdocs.yml").read_text())
    content = SRC / "docs" / (cfg.get("docs_dir") or "content")
    site_name = cfg.get("site_name") or "Docs"
    pages = sorted(p.relative_to(content).as_posix() for p in content.rglob("*.md"))
    texts = {rel: (content / rel).read_text() for rel in pages}
    titles = {rel: title_of(texts[rel], Path(rel).stem) for rel in pages}
    md = markdown.Markdown(extensions=[
        "admonition", "pymdownx.details", "pymdownx.highlight", "pymdownx.superfences",
        "pymdownx.tabbed", "tables", "toc",
    ], extension_configs={
        "toc": {"permalink": True, "toc_depth": "2-6"},
        "pymdownx.highlight": {"guess_lang": False},
        "pymdownx.tabbed": {"alternate_style": True},
    })
    shutil.rmtree(dest, ignore_errors=True)
    for p in content.rglob("*"):
        if p.is_file() and p.suffix.lower() != ".md":
            target = dest / p.relative_to(content)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, target)
    (dest / "js").mkdir(parents=True, exist_ok=True)
    shutil.copy(JS, dest / "js" / "versions.js")
    (dest / "assets").mkdir(parents=True, exist_ok=True)
    (dest / "assets" / "docs.css").write_text(CSS.read_text())
    index = []
    for rel in pages:
        md.reset()
        body = fix_hrefs(md.convert(fix_images(texts[rel], rel, name)), rel, name)
        toc = md.toc if "<li>" in md.toc else ""
        url = page_url(name, rel)
        nav = nav_html(cfg.get("nav"), titles, rel, name)
        index.append({"t": titles[rel], "u": url, "s": plain(body)})
        toc_html = f'<aside class="docs-toc">{toc}</aside>' if toc else ""
        page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<script>
(function () {{
  var t = localStorage.getItem("theme");
  if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = t;
}})();
</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(titles[rel])} - {html.escape(site_name)}</title>
<link rel="canonical" href="https://impulse.bot{url}">
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/css/style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&family=Russo+One&display=swap" rel="stylesheet">
<link id="docs-css" rel="stylesheet" href="/docs/{name}/assets/docs.css">
{gtag}
</head>
<body>
{header}
<div id="page">
<div class="docs-page">
<div class="docs-layout{" no-toc" if not toc else ""}">
<button type="button" class="docs-nav-toggle" aria-label="Contents" aria-expanded="false"><svg class="docs-nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg><svg class="docs-nav-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
<button type="button" class="docs-version-toggle" aria-label="Version" aria-expanded="false"><svg class="docs-version-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg><svg class="docs-version-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
<nav class="docs-version-panel"></nav>
<nav class="docs-nav">{nav}</nav>
<main class="docs-main"><article>{body}</article></main>
<div class="docs-side"><div class="docs-search"><input type="search" placeholder="Search" aria-label="Search"><div class="docs-search-list" hidden></div></div>{toc_html}<div class="docs-version-slot"></div></div>
</div>
</div>
</div>
<div class="container">{footer}</div>
{modal}
<script src="/js/main.js"></script>
<script src="/docs/{name}/js/versions.js"></script>
</body>
</html>
"""
        out = dest / "index.html" if page_path(rel) == "" else dest / page_path(rel) / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page)
    (dest / "search.json").write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")))

def build(name, ref, chrome):
    sh(["git", "checkout", "-f", ref], cwd=SRC)
    sh(["git", "clean", "-fd"], cwd=SRC)
    render(name, OUT / name, chrome)

def main():
    ensure()
    if (SRC / ".git").is_dir():
        sh(["git", "fetch", "--tags", "--force", "origin"], cwd=SRC)
    else:
        sh(["git", "clone", REPO, str(SRC)])
    found = tags()
    chrome = load_chrome()
    OUT.mkdir(parents=True, exist_ok=True)
    build("stable", found[0], chrome)
    build("latest", "origin/develop", chrome)
    for tag in found:
        build(tag, tag, chrome)
    names = ["stable", "latest", *found]
    (OUT / "versions.json").write_text(json.dumps({"default": "stable", "versions": names}) + "\n")
    (OUT / "index.html").write_text(
        "<!DOCTYPE html>\n"
        '<meta http-equiv="refresh" content="0;url=/docs/stable/">\n'
        '<link rel="canonical" href="https://impulse.bot/docs/stable/">\n'
        '<a href="/docs/stable/">Documentation</a>\n'
    )

if __name__ == "__main__":
    main()
