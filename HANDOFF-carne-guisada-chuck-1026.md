# Hand-off: carne guisada for one 2.27 lb chuck (job 1026-1206-h20, 26 Oct 2026)

Branch carne-guisada-chuck-1026 in worktree C:\NIGEL-scratch\1026-1206-h20\wt, cut from meals-1025 a088702. Not pushed, not published.

## What was built
- carne-guisada.html rebuilt in place (same name, so the week plan's link still works). The old page was the all-day Slow Cook version; this week's plan and tonight are pressure cooker, so the page now is too. The slow cook version is still on live main and in git history if wanted back as its own page.
- Method: 1.5 inch cubes, pat dry and salt (no pepper), cast iron sear at 400 to 425°F in two batches with a row per side, pepper only on seared faces turned up and as they come off, onion and bell pepper then spices in the drippings at 325 to 350°F, deglaze with the stock into the Instant Pot, bay, tomato sauce on top unstirred, High 25 minutes, 15 minute natural release, spoon test, flour slurry on Saute at 195 to 205°F on a probe for 5 minutes, taste, tortillas on the dry cast iron at 400 to 450°F.
- Cast iron chosen over Saute: holds heat through cold beef, reads true on the infrared, better crust.
- Salt cut from the planned 2 tsp to 3/4 tsp at 4 servings, stock 1 cup (1 tsp paste) instead of 1.5 cups; optional 1/4 tsp to finish.
- Same page features as carne-asada-chuck: Eating at back-times all 21 steps (default 6:30 pm), servings 3 to 8 scale every amount including the step lines, compact checklist synced with the step cards, tidy amounts.
- recipes.json entry and the index DATA copy updated for the new method; sw.js cache kitchen-v18 to v19.
- Built by tools-gen-carne-guisada-chuck-1026.ts from the carne-asada-chuck.html template (branch carne-asada-1026, f460b43); wiring by tools-wire-carne-guisada-chuck-1026.ts.

## How to test
bun tools-check-carne-guisada-chuck-1026.ts <site folder> <out folder> <edge profile folder>, TEMP and TMP in C:\NIGEL-scratch\1026-1206-h20. Headless Edge, 375 px, speech stubbed, service worker blocked, clock pinned.
Last run 26 Oct: 46 of 46 passed (re-timing at 6:30, 7:15, 5:45; scaling at 3, 5, 6, 7, 8; pepper order; flour after sealing; °F on every cast iron heat row; checklist fits 375 x 667; ticks sync, reload, reset; no sideways scroll; no em dashes; index link; no console errors; no speech). Output in C:\NIGEL-scratch\1026-1206-h20\out.

## Unsure of
- 25 minutes High for 1.5 inch cubes is the plan's figure; the spoon test offers 5 more minutes.
- Sodium (about 2,900 mg at 4 servings) uses typical label values; tomato sauce brands vary a lot.
- The week plan file in morning-rag-meals still lists the older 4:30 to 6:10 times (browning on Saute); not touched, as it is another project.
- carne-asada-1026 also bumps sw.js to v19; whichever merges second needs v20.
