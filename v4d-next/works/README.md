# Works

The authored sitters the public Viewer shows. A plain visit opens the first one listed in
`works.json`; with no `works.json` here (as now), the Viewer shows the stand-in walker.

Everything in this folder is artwork, © Mehran Ahmadi, all rights reserved (`LICENSE-ART.md`),
not covered by the code's Apache licence.

## Publishing a sitter

1. Rebuild the kept sitting in the Lab (`lab/sitting-to-v4d.bat`). For the web, keep it light:
   set `POINTS=8000` at the top of the `.bat` (a 20 s sitting is then about 25 MB; GitHub
   refuses files over 100 MB, and visitors on phones download it whole).
2. Copy the `…-lab.v4d` here, under a plain name, e.g. `sitter-01.v4d`.
3. Write `works.json` next to it:

   ```json
   {
     "works": [
       {
         "file": "sitter-01.v4d",
         "title": "Sitter, I",
         "line": "Someone, kept in time.",
         "about": "The sitter is …, kept for twenty seconds on 3 November 2026.",
         "colour": "material"
       }
     ]
   }
   ```

   - `line`: the words under V4D (default: the Viewer's own line).
   - `about`: replaces the About panel's paragraph on the figure.
   - `colour`: `material` (default) draws the sitter in the lenses' silver and light; `source`
     keeps the colours the camera saw, on the same grounds.
   - `ev`: a bias in stops on the Viewer's auto-exposure for the light lenses (Echo,
     Exposure). Usually not needed: auto-exposure keeps a still sitter from burning white.
     Use it to lean darker (−1) or brighter (+1).
4. Commit and push to `main`; the Pages workflow publishes it.

Links: `?work=1` opens the second work listed, `?work=none` the walker.
