# Site overview

Onboarding review of `MehranMarxian/mehranmarxian.github.io`, written 2026-09-30 at site version 26.76 (commit `61868c9`). Keep this file current when structure or conventions change.

## 1. Architecture

**Stack.** Hand-written static HTML, one shared stylesheet (`css/site.css`) and a few small vanilla-JS files. No generator, no build step, no package manager, no CI. Each page carries its own `<head>` (meta, Open Graph, JSON-LD) and a page-scoped `<style>` block for its layout.

**Deploy.** GitHub Pages serves the `main` branch from the repo root ("deploy from branch", classic Pages). A push or merge to `main` is live within a minute or two. There is no `.nojekyll`, so Pages runs Jekyll over the files first: harmless today (no `_` folders, no `{{ }}` in live pages), but anything starting with `_` would silently not publish.

**Domain.** `CNAME` holds `mehran-ahmadi.com` (the apex). GitHub Pages therefore serves the apex and redirects `www.mehran-ahmadi.com` and `mehranmarxian.github.io` to it. Every canonical URL, `og:url`, the sitemap and JSON-LD use the apex. DNS itself lives at the registrar and is not in the repo.

**Sibling sites under the same domain.** The other repos publish their own Pages sites, which appear as sub-paths of this domain:

| Path | Source repo |
|---|---|
| `/Particle-Memory-VOID/` (and `/app/?demo=1`, embedded on the homepage and generative-art page) | `Particle-Memory-VOID` |
| `/OpenLayer/` (listed in the sitemap) | `OpenLayer` |
| `/Window-Drift/` (linked from `software.html`) | `Window-Drift` (not in this project) |

Renaming or unpublishing one of those repos breaks links here.

### File map

```
index.html                 Homepage: Moondust video hero slide + slideshow, work cards, VOID live hero
home.html                  Previous homepage, kept live as "Archive" (footer link, in sitemap)
photography.html           Photography hub
  portraits.html, Documentryphotography.html, wall.html, empty-space.html
generative-art.html        Generative-art hub (VOID card, Moondust card)
  False-Restorations.html, Melancholictoons.html, the_animal_machine.html,
  head-reconstruction.html, you.html, brammbles.html
photogrammetry.html        3D scan work (experiments.html is a copy, canonical -> photogrammetry)
software.html              OpenLayer, VOID, Moondust, Window-Drift
Moondust.html              Moondust product page (wishlist = mailto link)
PStoComfy2026.html         OpenLayer article
works.html                 All-works index
blog.html                  Journal index (posts live in archive/: blog-1, the-metahumans, pstocomfyui3)
about.html, contact.html
404.html                   Custom 404 (root-relative paths, safe at any depth)
AI WORKS.html, computer-vision.html   Old URLs kept alive; canonical -> generative-art.html
projects.html              Old URL; redirects to archive/projects.html (broken, see backlog)

css/site.css               THE stylesheet: tokens, nav, footer, shared components, site version
js/site-nav.js             Mobile menu + hide-on-scroll nav (every live page)
js/void-demo.js            Mounts the VOID iframe only while on screen
js/gallery-lightbox.js, js/documentary-filmstrip.js, js/blog-preview.js   Per-page helpers
webfonts/PTSans_Regular/   Self-hosted PT Sans (the only site font)
Images/                    All current artwork, by series folder; Images/og/ = 1200x630 social cards
icons/                     Social icons (use the social-*.svg set)
favicon.*, icon-*.png, apple-touch-icon.png, site.webmanifest, robots.txt, sitemap.xml, CNAME
scripts/, .github/workflows/site-checks.yml, .htmlvalidate.json   PR checks (see CLAUDE.md)

Drafts and leftovers, all public but noindex or unlinked:
  2026home1, Home-design, blog-redesign, hoeme26test, home-before-*, home-redesign,
  home-test*, homeA/B/C, homeredesigned, indexpreloading (.html)
  archive/                 ~40 superseded pages + legacy-assets (52 MB)
  images/, img/, pstocomfyui_files/   older image folders (images/ is still used by 2 live pages)
  Images/UnusedImages/     13 MB
  CSS/bootstrap-4.4.1.css, js/bootstrap*, js/jquery*, js/popper*, js/modernizr*, js/main.js, css/style.css, css/reset.css
                           only used by drafts and archive pages
```

### How a change reaches production

1. Branch from `main` (`feature/…`, `fix/…`, `chore/…`).
2. Edit HTML/CSS/JS directly; preview locally (see `CLAUDE.md`).
3. Open a PR. Mehran reviews and merges.
4. Pages rebuilds from `main`; live in a minute or two. Hard-refresh to beat the CDN cache.

## 2. Design language

- **Mood:** gallery-dark, cinematic, quiet. Full-bleed imagery does the talking; text is sparse and sits bottom-left over a black gradient.
- **Colour:** black page (`#000`), off-white ink `#f1f0ec` / `#f2f2f2`, muted grey `#9a9c99` / `#a8a8a8`, card surface `#15181a` (hover `#1c2023`), hairlines `rgba(241,240,236,.14)`. Colour comes from the artwork, never from UI chrome. Tokens: `:root` in `css/site.css`, `.rs` on the homepage.
- **Type:** PT Sans (self-hosted) for everything. Eyebrows and buttons are small uppercase with wide tracking (`letter-spacing: .14em–.22em`); titles are regular weight (400), uppercase on cards; body 1.55 line-height. Sizes are fluid `clamp()` values.
- **Components:** fixed translucent "glass" nav (blur 18px) that hides on scroll down and rides transparent over heroes (`body.nav-over-hero`); full-height heroes (`min-height: 100svh`) with bottom-left captions; square-cornered cards with 16:9 media and text below; solid off-white primary button and 1px ghost button (`.rs-btn`, `.rs-btn--ghost`); footer site index + social icons + "Version 26.xx".
- **Motion:** slow and eased. Hero slides travel left-to-right over 1.9 s `cubic-bezier(.16,1,.3,1)`; cards fade up 30 px over 750 ms with 90 ms staggers (`data-reveal`, `data-delay`); nav slides 380 ms. Reduced motion and Save-Data disable video autoplay and reveals. Keep new motion in this register and always gate it behind `prefers-reduced-motion`.
- **Tone of copy:** first-person, plain, a little poetic ("Forever unfinished, on purpose."). Short ledes, no marketing superlatives.

## 3. Conventions (inferred)

- **Versioning:** `--site-version` in `css/site.css` (shown in the footer via CSS `content`). Style `YY.NN`, bumped by feature work (26.69 VOID showcase, 26.76 Moondust). Feature branches have been named after the version (`feature/v26.69-void-showcase`).
- **Pages:** flat at the repo root, one file per page. Old names are kept for URL stability, so naming is mixed (`Documentryphotography.html`, `brammbles.html`, `the_animal_machine.html`, `AI WORKS.html`, `Moondust.html`). New pages: lowercase-kebab (`empty-space.html`, `head-reconstruction.html`). Never rename a live URL without a redirect.
- **Images:** `Images/<Series-Name>/<series-name>-NN-description.webp`, descriptive SEO file names, social cards as `Images/og/<page>-mehran-ahmadi.jpg` (1200×630).
- **Every live page has:** `lang="en"`, GA4 tag, unique title and meta description, canonical (apex), OG + Twitter card, favicon set, JSON-LD Person/WebPage, shared nav + footer markup, `css/site.css`, `js/site-nav.js`.
- **Drafts:** `noindex, nofollow`, kept at the root while in progress, then moved to `archive/`.
- **Commits:** short imperative subjects ("Add VOID live card…"), one concern per commit.

## 4. What was checked

- Static link/asset check over every root page, `css/site.css` and the three live archive posts (case-sensitive, as on GitHub Pages).
- Headless Chromium crawl of the 23 live pages plus 7 legacy URLs at 1440×900 and 390×844: console errors, failed local requests, `alt` attributes, `h1` count, title/description/canonical/OG, horizontal overflow, reduced-motion rules, bytes loaded after a full scroll.
- Not checked from the cloud: the live domain itself (outbound access to mehran-ahmadi.com is blocked here), DNS, real Lighthouse scores, the sibling sites' pages, third-party embeds.

**Healthy:** every live page has one `h1`, `lang`, title, description, canonical, OG image and `alt` on every image; no console errors or broken local assets on any live page; no horizontal scroll on mobile except one page; reduced motion is respected site-wide; the 404 page works at any depth.

## 5. Risks and tech debt (prioritized backlog)

Effort: S < 1 h, M = a few hours, L = a day or more.

| # | Issue | Why it matters | Effort |
|---|---|---|---|
| 1 | **Repo weight: 344 MB, of which ~313 MB of media is not used by any live page** (e.g. `Images/AI/stroies about humans/*.png` 1.6–8 MB each, duplicate `img/` and `pstocomfyui_files/` = copies of `archive/legacy-assets`, `Images/UnusedImages/`). GitHub Pages recommends < 1 GB and warns on big repos; clones and every Pages build are slow. | Deleting needs your approval; moving unused originals out of the repo (or into a release/LFS) is the fix. | M |
| 2 | **`Images/` and `images/` both exist** (differ only by case). On Windows they are the same folder, so a move or rename there can silently land in the wrong one; `blog.html` and `home.html` still load `images/mehran-ahmadi-photo-006.jpg`. | Case bugs only show up after deploy (Pages is case-sensitive, a Windows preview is not). | S |
| 3 | **Heavy pages.** After a full scroll: `works.html` 6.7 MB, `index.html` 6.4 MB (Moondust hero video 1.6–2.5 MB + slideshow JPEGs up to 1.1 MB), `blog.html` 5.4 MB, `Melancholictoons.html` 4.5 MB, `portraits.html` 4.2 MB. `images/mehran-ahmadi-photo-006.jpg` is 1.8 MB. Most `<img>` have no `width`/`height`, so layout shifts while loading. | Lighthouse performance and CLS; mobile data. | M |
| 4 | **`PStoComfy2026.html` scrolls sideways on phones** (intro header and `.openlayer-meta` list are ~600 px wide at 390 px). | Visible mobile bug on the OpenLayer article. | S |
| 5 | **Plain-text email** (`mehran.ahmadi@gmail.com`) in `mailto:` links on contact and Moondust and in JSON-LD, across 26 pages. The Moondust "wishlist" is a pre-filled email. | Scraper spam; a mailto wishlist loses sign-ups on phones without a mail app. | S–M |
| 6 | **Google Analytics 4 is on every live page** with no consent notice or privacy note. | Pre-existing, so left alone. GA4 sets cookies; a privacy note or a cookieless alternative is your call. | S |
| 7 | **Sitemap drift:** `Moondust.html` (your newest page) is missing; `lastmod` dates stop at 2026-09-09; it lists `home.html` (the archive homepage) at priority 0.9. | Search engines find the new page late. | S |
| 8 | **Root clutter:** 14 draft/test home pages and `indexpreloading.html` are public at the root (noindex, but reachable and crawl-budget noise); several reference files that no longer exist. `projects.html` redirects to `archive/projects.html`, which has 8 missing images, a missing stylesheet and a JS syntax error. | Confusing to maintain; broken pages reachable by old links. | S (with approval to move/delete) |
| 9 | **Dead vendor files:** Bootstrap 4.4.1, jQuery 2.1.1/3.4.1, popper, modernizr, `js/main.js`, `css/style.css`, `css/reset.css` are used only by drafts/archive. The nav still uses Bootstrap class names (`navbar`, `collapse`) but is styled by `site.css` and driven by `site-nav.js`. | Dead weight, and a trap for anyone who thinks Bootstrap is in use. | S |
| 10 | **Accessibility polish:** no skip-to-content link; link hover colour `#555` on black is about 2.8:1 contrast; hero video has no pause control (it stops for reduced-motion users, but WCAG 2.2.2 wants a control for anything that moves > 5 s). | Keyboard and low-vision users. | S |
| 11 | **Duplicated markup:** nav, footer, favicon block and JSON-LD Person are copy-pasted into ~25 pages; the version appears only via CSS. | Every nav/footer change touches every page; easy to miss one. A tiny build step or GitHub Action could template them, but that is a structural decision. | M–L |
| 12 | **Automation:** ~~no CI~~ PR checks added in `chore/pr-checks` (links, HTML validation, phone/desktop render); still no Lighthouse run. `.gitignore` is the Visual Studio template (no OS or editor files). No `.nojekyll`. README still describes the old Muse/Dreamweaver site. | Regressions reach production unseen. | S–M |

Not a problem, recorded so nobody "fixes" it: `experiments.html`, `AI WORKS.html` and `computer-vision.html` are duplicate old URLs whose canonicals point at the current pages. Keep them.

## 6. Questions for Mehran

1. **Primary domain:** your brief says `www.mehran-ahmadi.com`, but `CNAME` and every canonical use the apex `mehran-ahmadi.com` (so www redirects to apex). Keep the apex? (Recommended: yes, no change.)
2. **Version:** the footer shows 26.76 (bumped in "Moon dust added to home"). Is 26.76 right, and should every PR bump it, or only feature PRs?
3. **Unused media (~313 MB):** may I move it out of the repo (after listing it for you), or should it stay?
4. **Draft home pages and `archive/`:** move drafts into `archive/`, or delete them?
5. **Google Analytics:** keep GA4 as is, add a short privacy note, or replace it with a cookieless option later?
6. **`home.html` "Archive":** keep it indexed in the sitemap, or mark it noindex now that `index.html` is the homepage?
