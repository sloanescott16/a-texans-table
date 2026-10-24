# HANDOFF: meals-1025 (job 1024-1130-hzw, Wednesday per job 1024-1131-3ar)

Local only. Nothing pushed, published or merged.

## What was built
- Branch meals-1025 in worktree C:\NIGEL-scratch\wt-hzw-1025, cut from site-release-1024 (a11c7f4).
  - GROCERY-WEEK-1025.md: the week's one shopping list, with the checker's plain-name fixes (gold potatoes, butter, pears).
  - Four new pages, built on the shrimp scampi pattern (same CSS and script, only the data and notes change):
    peruvian-grilled-chicken.html (Sun 25), carne-guisada.html (Mon 26), tom-kha.html (Wed 28, her 40 Aprons recipe), pork-chops-onion-pear.html (Thu 29, with the site's mash amounts and steps at 3 lb inlined).
  - recipes.json and the embedded DATA copy in index.html: four new entries (grilled chicken in Smoker and Grill, the others in Mains after red beans). sw.js: the four pages added to the shell, cache kitchen-v17 to kitchen-v18.
  - tools-gen-meals-1025.ts: the generator that writes the pages and entries. tools-check-meals-1025.ts: the headless check.
- Branch meals-records-1025 of the kitchen root repo, worktree C:\NIGEL-scratch\wt-hzw-records-1025, cut from tacos-1022:
  meal-planner\data\dish-history.json gets the four dishes served 25, 26, 28 and 29 Oct; dishes.json gets the four dish ids.

## How to test
    cd C:\NIGEL-scratch\1024-1130-hzw
    bun check-meals-1025.ts C:\NIGEL-scratch\wt-hzw-1025 C:\NIGEL-scratch\1024-1130-hzw\out C:\NIGEL-scratch\1024-1130-hzw\edge-profile
Last run: 65 of 65 passed. Headless Edge, 390 px, speech stubbed, audio muted, service worker blocked, clock pinned. Results in out\results.json, screenshots in out\.

## Unsure or worth a look
- Per-side timers: each side of every sear is its own timed row (the scampi pattern), not the pot roast's start and finish timer buttons.
- Monday's clock starts at 6:50 am for a 6:30 pm dinner: Slow Cook Normal 10 hours, then Keep Warm.
- Wednesday starts about 2:05 pm for 6:30, which assumes she is home by 2.
- Instant Pot "More" taken as High and "Normal" as Low, as the Instant Pot manual says.
- The meal-planner branch tacos-1022 is still unmerged, so meals-records-1025 sits on top of it.
