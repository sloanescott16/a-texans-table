# Handoff: site-release-1024 (job 1024-1050-rcp)

What: one integration branch, cut from main (db3cc28), carrying every recipe change waiting on a publish yes: red beans two-stage (red-beans-2stage-1020), pressure cooker chicken tacos (tacos-1022) and plain ingredient names (plain-names-1019). meals-1021 was already in main and live, so it needed no merge. Worktree: C:\NIGEL-scratch\wt-rcp-1024. Not pushed, not merged into main.

How to run: it is a static site. Serve the folder under /a-texans-table/ (as GitHub Pages does) or open the html files.

How to test: the checks in C:\NIGEL-scratch\1024-1050-rcp\tools run with bun: `bun <script> <siteFolder> <outDir> <edgeProfile>` for check-ucn-1020.ts (53/53), check-tacos-1022.ts (27/27) and smoke-all2.ts (118/118). Headless Edge, speech stubbed. Logs are log-*.txt in that folder.

Conflicts: index.html data line (rebuilt from merged recipes.json each time; it is exactly JSON.stringify of recipes.json); chicken-tacos.html, red-beans-and-rice.html and recipes.json took the newer two-stage and pressure cooker text, then plain names applied to it ("dried Mexican oregano" became "dried oregano").

Unsure: red beans keeps "Louisiana hot sauce" (a style, not a brand) and a heat note naming andouille as the spicier option, as the plain-names branch did. The tacos page says "salsa verde, one 16 oz jar at 4 servings": a size, kept. Publishing means a fast-forward of main to this branch and a push; PROGRESS and HANDOFF md files go along, as earlier branches' did.
