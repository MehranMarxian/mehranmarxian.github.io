# mehran-ahmadi.com: notes for Claude

Personal portfolio site of Mehran Ahmadi (designer, photographer, creative technologist). Hand-written static HTML/CSS/JS, served by GitHub Pages from `main` at https://mehran-ahmadi.com (apex; `www` and `mehranmarxian.github.io` redirect to it). No build step.

Read `docs/SITE-OVERVIEW.md` before any non-trivial change: it has the file map, the design language, the conventions and the prioritized backlog. Keep it and this file current in the same PR when structure or conventions change.

## Working rules (from Mehran; apply to every task)

- **Never commit to `main`.** Every task gets its own branch: `feature/<short-name>`, `fix/<short-name>` or `chore/<short-name>`.
- **One task = one branch = one PR.** Keep PRs small and focused.
- **After each task, open a PR for Mehran to review. Never merge it yourself.** The description covers what changed and why, how it was tested, screenshots or a short description for visual changes, risks and follow-ups, and ends with a short **Suggestions** section of 1–3 ideas. Never build a suggestion without approval.
- **Verify before opening a PR:** run the site locally, check desktop and mobile widths, check the console for errors, check that links and images load. Fix problems before asking for review.
- **Commits:** clear, imperative messages, authored by Mehran alone. No `Co-Authored-By` trailers and no "Generated with Claude" lines in commits or PR text.
- **Ask before anything destructive or outward-facing:** deleting files or branches, force-pushing, changing DNS or `CNAME`, adding third-party scripts, analytics or trackers, forms that collect data, spending money.
- **Don't break the live site.** Keep the existing design, URLs and features unless asked. If a URL must change, add a redirect (a stub page with `<meta http-equiv="refresh">` plus a canonical, since Pages has no server redirects).
- **Keep it lightweight.** Plain HTML/CSS/JS; avoid heavy dependencies and explain any new one. Images as WebP/AVIF, sized (`width`/`height`), lazy-loaded below the fold.
- **Quality bar:** responsive; accessible (semantic HTML, contrast, keyboard focus, alt text, `prefers-reduced-motion` respected); fast (aim for Lighthouse 90+); SEO-ready (title, meta description, Open Graph/Twitter card, sitemap, robots, canonical).
- **When unsure, ask** a short, specific question instead of guessing. For a big request, propose a plan before coding.
- **Docs:** update `CLAUDE.md` / `docs/SITE-OVERVIEW.md` in the same PR when structure or conventions change. `CHANGELOG.md` gets one line per merged PR (add it in the PR itself).

## Run and preview locally

Serve the repo root over HTTP. Opening files with `file://` breaks the root-relative paths (`/css/site.css`, `/favicon.ico`) that the 404 page and favicons use.

```bash
# from the repo root; either one works
python -m http.server 8899          # Windows (python3 on macOS/Linux)
npx http-server -p 8899 -c-1        # Node; -c-1 turns caching off
```

Then open http://localhost:8899/. `.claude/launch.json` runs the Python command on the same port.

What the local preview does not show:
- **Case sensitivity.** GitHub Pages is case-sensitive; Windows is not. `Images/` and `images/` are two different folders in the repo. Check that every new path matches the file name exactly.
- **The custom 404.** Local servers return their own 404; open `/404.html` directly to check it.
- **Sibling sites.** `/Particle-Memory-VOID/…` and `/OpenLayer/` are served by other repos, so the pages link to them on the live domain.

## Automated checks

`.github/workflows/site-checks.yml` runs on every PR:
1. `scripts/check_links.py`: every local link and asset on the live pages exists with exactly that capitalisation; sitemap entries exist (a live page missing from the sitemap is a warning).
2. `html-validate` (config `.htmlvalidate.json`) over the live pages.
3. `scripts/check_pages.mjs`: headless Chromium at 390 px and 1440 px; fails on sideways scrolling, JavaScript errors or local 404s on pages the PR changes (on every page if it touches `css/` or `js/`), warns elsewhere.

"Live pages" = root pages without `noindex`, plus `404.html` and the archive posts the sitemap lists (`scripts/site_pages.py`). Run the same checks locally before pushing:

```bash
npm install --no-save --no-package-lock playwright@1.56.1 html-validate@9.7.1
python3 scripts/check_links.py
python3 scripts/site_pages.py | tr '\n' '\0' | xargs -0 npx html-validate
python3 -m http.server 8899 &   # in another terminal on Windows
node scripts/check_pages.mjs    # needs: npx playwright install chromium
```

## Checks before a PR

1. Open every page you touched at **1440 px and 390 px** wide (browser devtools, or headless Chromium with Playwright). No horizontal scroll on mobile.
2. Console clean: no errors, no 404s in the Network tab.
3. Every new `<img>` has meaningful `alt` (or `alt=""` plus `aria-hidden` for decoration), `width`/`height`, and `loading="lazy"` unless it is above the fold.
4. New motion is disabled under `prefers-reduced-motion: reduce`.
5. A new or renamed page gets: the shared nav and footer, `css/site.css`, `js/site-nav.js`, GA4 tag (same as the other live pages), a unique title and description, canonical on `https://mehran-ahmadi.com/…`, OG/Twitter tags with an image in `Images/og/`, and an entry in `sitemap.xml`.
6. Feature work bumps `--site-version` in `css/site.css` (style `YY.NN`).

## Where things are

```
index.html            homepage (styles in its own <style>, prefixed .rs-)
*.html (root)         one file per page; see docs/SITE-OVERVIEW.md for which are live vs drafts
css/site.css          shared tokens, nav, footer, components, --site-version
js/site-nav.js        mobile menu + hide-on-scroll nav
js/void-demo.js       lazy VOID iframe
Images/<Series>/      artwork; Images/og/ = 1200x630 social cards
webfonts/             self-hosted PT Sans (the only font)
archive/              superseded pages; three journal posts here are still live
```

## Design in one breath

Black page, off-white ink (`#f1f0ec`), grey muted text, colour only from the artwork. PT Sans throughout; small uppercase tracked eyebrows and buttons; regular-weight titles. Full-bleed heroes with bottom-left captions, square cards, solid and ghost buttons. Motion is slow and eased (`cubic-bezier(.16,1,.3,1)`, 750 ms fade-ups) and always gated by reduced motion. Details in `docs/SITE-OVERVIEW.md` section 2.
