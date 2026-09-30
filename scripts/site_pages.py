"""Which pages count as live: shared by the site checks."""
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = "https://mehran-ahmadi.com/"
# Served by other repos' Pages sites under the same domain.
SIBLING_PREFIXES = ("Particle-Memory-VOID/", "OpenLayer/", "Moondust/", "Window-Drift/")


def sitemap_paths():
    text = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", text)
    return [loc[len(DOMAIN):] for loc in locs if loc.startswith(DOMAIN)]


def live_pages():
    """Root pages that are not noindex drafts, plus 404.html and archive pages the sitemap lists."""
    pages = []
    for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
        name = os.path.basename(path)
        head = open(path, encoding="utf-8", errors="replace").read(6000)
        if name == "404.html" or not re.search(r'name="robots"[^>]*noindex', head):
            pages.append(name)
    for path in sitemap_paths():
        if path.startswith("archive/") and path.endswith(".html"):
            pages.append(path)
    return pages


def is_redirect(page):
    head = open(os.path.join(ROOT, page), encoding="utf-8", errors="replace").read(6000)
    return 'http-equiv="refresh"' in head


if __name__ == "__main__":
    import sys

    pages = live_pages()
    if "--no-redirects" in sys.argv:
        pages = [p for p in pages if not is_redirect(p)]
    print("\n".join(pages))
