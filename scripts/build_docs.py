#!/usr/bin/env python3
import json, re, shutil, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "publish" / "docs"
SRC = Path("/tmp/impulse")
REPO = "https://github.com/eslupmi/impulse.git"
JS = Path(__file__).with_name("versions.js")

def sh(args, **kw):
    subprocess.check_call(args, **kw)

def tags():
    found = []
    for tag in subprocess.check_output(["git", "tag", "-l", "v*"], cwd=SRC, text=True).split():
        if re.fullmatch(r"v\d+\.\d+\.\d+", tag) and subprocess.call(
            ["git", "cat-file", "-e", f"{tag}:docs/mkdocs.yml"], cwd=SRC, stderr=subprocess.DEVNULL
        ) == 0:
            found.append(tag)
    found.sort(key=lambda t: tuple(map(int, t[1:].split("."))), reverse=True)
    return found

def build(name, ref):
    dest = OUT / name
    current = subprocess.check_output(["git", "rev-parse", ref], cwd=SRC, text=True).strip()
    stamp = dest / ".rev"
    if stamp.is_file() and stamp.read_text() == current:
        return
    sh(["git", "checkout", "-f", ref], cwd=SRC)
    sh(["git", "clean", "-fd"], cwd=SRC)
    js_dir = SRC / "docs" / "content" / "js"
    js_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy(JS, js_dir / "versions.js")
    yml = SRC / "docs" / "mkdocs.yml"
    text = re.sub(r"(?m)^site_url:.*\n?", "", yml.read_text())
    text = f"site_url: https://impulse.bot/docs/{name}/\n" + text
    if "js/versions.js" not in text:
        text = re.sub(r"(?m)^extra_javascript:\s*$", "extra_javascript:\n  - js/versions.js", text, count=1)
        if "js/versions.js" not in text:
            text += "\nextra_javascript:\n  - js/versions.js\n"
    yml.write_text(text)
    venv = SRC / ".venv"
    sh(["uv", "venv", str(venv), "--clear"])
    sh(["uv", "pip", "install", "-r", "docs/requirements.txt", "--python", str(venv / "bin" / "python")], cwd=SRC)
    shutil.rmtree(dest, ignore_errors=True)
    sh([str(venv / "bin" / "mkdocs"), "build", "-f", "docs/mkdocs.yml", "-d", str(dest)], cwd=SRC)
    stamp.write_text(current)

def main():
    if (SRC / ".git").is_dir():
        sh(["git", "fetch", "--tags", "--force", "origin"], cwd=SRC)
    else:
        sh(["git", "clone", REPO, str(SRC)])
    found = tags()
    OUT.mkdir(parents=True, exist_ok=True)
    build("stable", found[0])
    build("latest", "origin/develop")
    for tag in found:
        build(tag, tag)
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
