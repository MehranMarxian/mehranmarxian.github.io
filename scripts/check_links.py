"""Check every local link and asset on the live pages, matching case exactly.

GitHub Pages is case-sensitive and Windows is not, so a path that works in a
local preview can still 404 on the live site. Exits 1 on any missing file.
Sitemap problems are reported as warnings.
"""
import html
import os
import re
import sys
from urllib.parse import unquote, urlparse

from site_pages import DOMAIN, ROOT, SIBLING_PREFIXES, live_pages, sitemap_paths

ATTR = re.compile(r"""\b(?:href|src|poster|data-src|data-full)\s*=\s*["']([^"']+)["']""", re.I)
SRCSET = re.compile(r"""\bsrcset\s*=\s*["']([^"']+)["']""", re.I)
CSS_URL = re.compile(r"""url\(\s*["']?([^"')]+)["']?\s*\)""")
JSON_LD = re.compile(r'<script type="application/ld\+json">.*?</script>', re.S)


def exists_exact(rel):
    """True if rel exists under ROOT with exactly this capitalisation."""
    cur = ROOT
    for part in rel.split("/"):
        if part in ("", "."):
            continue
        if part == ".." or not os.path.isdir(cur) or part not in os.listdir(cur):
            return False
        cur = os.path.join(cur, part)
    if os.path.isdir(cur):
        return "index.html" in os.listdir(cur)
    return True


def resolve(page, ref):
    """Repo-relative path for a local reference, or None if it is not local."""
    ref = html.unescape(ref.strip())
    if not ref or ref.startswith(("#", "mailto:", "tel:", "javascript:", "data:", "{")):
        return None
    url = urlparse(ref)
    if url.scheme in ("http", "https"):
        if not (ref.startswith(DOMAIN) or url.netloc in ("www.mehran-ahmadi.com", "mehranmarxian.github.io")):
            return None
        path = unquote(url.path).lstrip("/")
        return None if path.startswith(SIBLING_PREFIXES) else path
    if url.scheme or not url.path:
        return None
    path = unquote(url.path)
    if path.startswith("/"):
        return path.lstrip("/")
    return os.path.normpath(os.path.join(os.path.dirname(page), path)).replace(os.sep, "/")


def refs_in(page):
    text = open(os.path.join(ROOT, page), encoding="utf-8", errors="replace").read()
    text = JSON_LD.sub("", text)
    for match in ATTR.finditer(text):
        yield match.group(1)
    for match in SRCSET.finditer(text):
        for candidate in match.group(1).split(","):
            if candidate.strip():
                yield candidate.strip().split()[0]
    for match in CSS_URL.finditer(text):
        yield match.group(1)


def main():
    pages = live_pages() + ["css/site.css"]
    missing = 0
    for page in pages:
        for ref in sorted(set(refs_in(page))):
            path = resolve(page, ref)
            if path is not None and not exists_exact(path):
                missing += 1
                print(f"::error file={page}::missing {ref}")

    listed = set(sitemap_paths())
    for path in sorted(listed):
        if path and not path.startswith(SIBLING_PREFIXES) and not exists_exact(path):
            missing += 1
            print(f"::error file=sitemap.xml::lists {path}, which does not exist")
    for page in live_pages():
        if page in ("404.html",) or page in listed or (page == "index.html" and "" in listed):
            continue
        head = open(os.path.join(ROOT, page), encoding="utf-8").read(6000)
        canonical = re.search(r'rel="canonical" href="([^"]+)"', head)
        if canonical and canonical.group(1) == DOMAIN + page:
            print(f"::warning file=sitemap.xml::{page} is indexable but not in the sitemap")

    print(f"Checked {len(pages)} files: {missing} missing reference(s).")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
