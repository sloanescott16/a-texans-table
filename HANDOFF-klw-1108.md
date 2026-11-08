# HANDOFF: Louisiana week, Sun 8 to Thu 12 Nov 2026 (job 1108-1118-klw)

Local only. Nothing pushed, published or merged.

## What was built
Branch klw-louisiana of the site repo, worktree C:\NIGEL-scratch\1108-1118-klw\wt, cut from origin/main 051c429 (live). Four pages on the carne guisada pattern (the scampi page plus the single-screen checklist), 3 servings default, 2 to 6:
- grillades-and-grits.html (Sun, 3:00 to 6:30): cast iron sear in two batches with per-side slots, double dark roux in the drippings (half out for Monday), grillades braised 90 min in the same pan, grits with water and powdered chicken stock (half set in a dish for Wednesday), green beans. The week's prep has its own slots: trinity for all four nights bagged per night, ground pork into the freezer, Monday's gumbo loaded into the Instant Pot inner pot and into the fridge.
- chicken-andouille-gumbo.html (Mon): 7:00 am inner pot in, Slow Cook More (High) 6 hours, then Keep Warm; 5:00 rice cooker double batch; Saute simmer; Thursday's rice cooled on a sheet pan and stored by 6:10.
- fried-grits-andouille-creole.html (Wed, 6:00 to 6:30): set grits fried in the cast iron, andouille Creole sauce in the small saucepan; after dinner the pork goes from freezer to fridge.
- dirty-rice.html (Thu, 6:00 to 6:30): ground pork only, Monday's rice to 165°F, green beans. A dated "Wed night" thaw row back-times with the rest.
- recipes.json and the embedded copy in index.html: four entries after red beans. sw.js: pages in the shell, cache kitchen-v20 to v22.
- tools-gen-klw-1108.ts writes the pages; tools-check-klw-1108.ts is the headless check.

Matches the Captain's final list of 11:20 AM: no milk, no chicken livers, fallbacks for Cajun seasoning, thyme and hot sauce from smoked paprika, chili powder, oregano and cumin. Nothing outside the shop and house lists is used.

## How to test
Set TEMP and TMP to C:\NIGEL-scratch\1108-1118-klw, then from the worktree, once per page:
    bun tools-check-klw-1108.ts . C:/NIGEL-scratch/1108-1118-klw/shots C:/NIGEL-scratch/1108-1118-klw/edge-profile <slug> <YYYY-MM-DD>
Slugs and dates: grillades-and-grits 2026-11-08, chicken-andouille-gumbo 2026-11-09, fried-grits-andouille-creole 2026-11-11, dirty-rice 2026-11-12.
Last run: 25 of 25 on each page. Headless Edge at 390 x 844, own profile, speech stubbed, audio muted, service worker blocked, clock pinned. Checks: every row and checklist clock back-timed at 6:30, 7:15 and 5:45; servings 3 to 6 raise every measured amount and the step lines; back to 3 restores; no sideways scroll; checklist one line a row and fits under the sticky bar; no dashes, milk or livers; every heat cue has °F; index link; no console errors. Screenshots in C:\NIGEL-scratch\1108-1118-klw\shots.

## Unsure or worth a look
- Grillades braise 90 minutes in the 12 inch cast iron with one can of tomatoes. A seasoned pan takes it, but long acid simmers can dull seasoning; the lid is "lid or foil" since I do not know if he has one.
- Roux temperature 325 to 350°F on the infrared is my working number for a canola roux, not from the researcher.
- Monday: Slow Cook More 6 hours from a fridge-cold full pot, then about 5.5 hours on Keep Warm. Thighs will be very soft, which suits gumbo.
- Thursday's trinity is cut on Sunday, four days ahead. Fine for onion, pepper and celery, a little less crisp.
- The step player (play and pause) on carne guisada is not on these pages.
- The unmerged tom-kha-retime-1027 branch also bumps sw.js to v21; this branch goes to v22, so merge order does not matter for the cache, but sw.js and recipes.json will need a hand merge.

## Fix round 1 (checker's CHECK-ALL.md)
- Sunday: roux step says to set Eating at later if the roux is not dark by its time; sear bits no longer read as "start again"; raw chicken sealed in its own bag on top of the inner pot overnight; grits keep 3 to 4 days; beef stock, Monday's trinity and sausage, and the beans listed on their steps; 14 inch or deep braiser note for 5 or 6 servings; leftovers out of the cast iron before the fridge; 8 by 8 or 9 by 9 pan for Wednesday's grits.
- Monday: 7 am step tips in the bagged chicken and stirs from the bottom; rice lines are tonight and Thursday amounts; time to 140°F note and probe 165°F before serving; Keep Warm about 4 hours.
- Wednesday: 9 squares from the square pan.
- All pages: plain names (parsley, chicken thighs, andouille), no salt brand names.
- Rerun: 25 of 25 on each page at 390 px.

## Change 2 (job 1108-1229-sp4): chuck tender roast
- Sunday's beef is one beef chuck tender roast, 2.77 lb (use or freeze by 10 Nov): silver skin off, 1/2 inch medallions across the grain, pounded to 1/4 inch, seared in three batches with pepper on each seared face, braised 2 hours with two stir checks, fork test plus 195 to 205°F inside.
- First move now 2:24 for 6:30. Scaled to 2.75 lb: salt 1 1/2 tsp, pepper 1 tsp, sear oil 3 tbsp, roux 1 1/4 cups oil and flour (half each night), beef stock 3 tsp base in 3 1/2 cups water, Cajun 3 tsp, thyme 3/4 tsp, smoked paprika 1 1/2 tsp, garlic and tomato paste 1 1/2 tbsp. Week totals still fit: the tomato paste is 2 1/2 tbsp in all, everything else changed is from the house.
- Checklist rows tightened (no row padding) so Sunday's 41 rows fit one 390 x 844 screen. All four pages 25/25 again.

## Change 3 (job 1108-1234-1e0): meat as bought
- Gumbo: thighs boneless or bone-in, skin on or off. Sunday pulls the skin off and bags boneless pieces or bone-in thighs whole (about 2 1/4 lb bone-in). Monday probes near the bone and has a 6:12 slot to pull the meat off the bones.
- Dirty rice: ground pork, ground beef or breakfast sausage, with a branch for each (beef: drain if fatty; breakfast sausage: half the salt and Cajun seasoning, taste first). The thaw slots say ground meat.
- Names are loose: andouille or smoked sausage, chicken thighs. RECIPE-RULES.md has the shopping list meat rule.
- 390 px check: 25/25 on all four.
