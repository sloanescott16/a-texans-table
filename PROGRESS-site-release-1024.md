# site-release-1024 (job 1024-1050-rcp)

One integration branch so a single publish yes covers the waiting recipe pages. Cut from main at db3cc28. Not pushed, not merged into main.

## Stage 1, merges (24 Oct)
- meals-1021 (job 1019-1154-sw1): already in main and live at db3cc28, nothing to merge.
- red-beans-2stage-1020 (job 1020-1640-ucn): merged first, clean.
- tacos-1022 (job 1022-1327-abt): merged second. Conflict in index.html only (the embedded recipe data line); rebuilt from the merged recipes.json.
- plain-names-1019 (job 1019-2135-68r): merged last. Conflicts in chicken-tacos.html, red-beans-and-rice.html, recipes.json and index.html. Took the newer two-stage red beans and pressure cooker tacos text in each conflict hunk, kept every other plain-names change, then applied the plain-names rule to the new text ("dried Mexican oregano" to "dried oregano" on tacos). The two-stage red beans text already used plain names. index.html data line rebuilt from recipes.json.
- Service worker cache stays kitchen-v17 (main is v16, so phones pick up the new pages).

## Stage 2, local check (headless Edge, speech stubbed, muted, service worker blocked)
- Red beans two-stage check from job 1020-1640-ucn on the merged site: 53/53.
- Chicken tacos check from job 1022-1327-abt on the merged site: 27/27.
- All-pages smoke check (every page loads with no errors or failed requests, ingredients render, no brand or buying words on the page, index links both pages): 118/118.
- Scripts, logs and screenshots in C:NIGEL-scratchB4-1050-rcp.

Status: ready for the checker, then one publish yes. Not pushed, not merged into main.
