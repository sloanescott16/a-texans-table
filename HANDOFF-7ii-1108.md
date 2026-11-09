# Handoff, job 1108-1938-7ii (branch 7ii-lessons from ihu-tallow, not pushed)

What changed
- RECIPE-RULES.md: "Lessons from Sunday's grillades" (pressure braise when the clock is tight, active time checked against his evening, exact ingredient names, real roux and grits numbers). The same five rules are in meal-planner\data\dishes.json in the side worktree (branch meals-records-1108).
- grillades-and-grits.html: Instant Pot pressure route is the default, Dutch oven braise kept as the long route in the notes. Copper roux, about 70 minutes, cues at 30, 55 and 70 minutes. Grits 6 cups water, about 240 g, 10 to boil and 25 to cook. Green beans left off. First move 4:26 for 6:30, active about 2 hours, stated at the top.
- chicken-andouille-gumbo.html: lean, jar of copper roux darkened 10 minutes at 325 to 350°F first, 5 cups broth from the fridge, chicken snipped into the pot, rice cooker for tonight only, nothing for other nights. From 5:05, about 50 minutes active.
- dirty-rice.html: frozen green beans, no trimming, steamed from frozen. Because Monday no longer cooks Thursday's rice, Thursday starts its own rice cooker at 5:15 and steams the rice dry on a sheet pan.
- Wednesday has no beans; unchanged.
- sw.js cache kitchen-v31.

How to regenerate: `bun tools-gen-klw-1108.ts . grillades-and-grits chicken-andouille-gumbo dirty-rice`

How to test: `bun tools-check-mnp-1108.ts . <out> <profile> <slug> <YYYY-MM-DD>`. Last run 31 of 31 on each of the three pages (dates 8, 9 and 12 Nov).

Unsure
- Sunday's page is about 2 hours active, over the Sunday cap of about an hour; the 70 minute roux is the reason. A saved jar of roux brings it to about an hour.
- Monday is about 50 minutes active, over the weeknight cap of 20 to 30. It is his own gumbo; only waiting and other-night work was cut.
- Rice cooker times vary by model; Thursday allows 46 minutes before the rice is spread.
