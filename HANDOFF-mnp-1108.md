# Handoff, job 1108-1448-mnp (branch mnp-daylabel, not pushed)

What changed
- Day label: steps more than 12 hours before serving show "night before" (or morning before, day before, N days before) in the checklist and on the step, counted back from the time box. Only dirty-rice d0 is affected.
- Grillades is dinner only. Active time is stated at the top: about 1 hour 40 up front, a 2 hour hands-off braise, about 30 minutes at the end. First move 2:41 for 6:30.
- New rotisserie chicken broth page (chicken-broth.html), Instant Pot, timed forward from a Start at box (default 2:47). It sits under the new Stocks & Bases menu section.
- Monday, Wednesday and Thursday each dice their own trinity. Wednesday is now andouille Creole over creamy grits made that night. Thursday's night-before step thaws the ground meat in the fridge.
- One line per ingredient: the shared list code (36 pages) and the step lists (template pages) merge lines that have the same name into one scaled total.
- Rules are in RECIPE-RULES.md and meal-planner dishes.json (side worktree, branch meals-records-1108).

How to regenerate: `bun tools-gen-klw-1108.ts . <slug ...>`. The template is carne-guisada.html.

How to test
- `bun tools-check-mnp-1108.ts . <out> <profile> <slug> <YYYY-MM-DD>` runs the 390 px check on each Louisiana page.
- `bun tools-smoke-mnp-1108.ts . <out> <profile> 2026-11-08` runs the smoke check on all 36 pages.
- Last results: 31/31 on each of the five pages, smoke 109/109.

Unsure
- Monday's gumbo is about 58 minutes active, over the weeknight cap of 20 to 30. It is his own recipe and was not reworked.
- Thursday's rice is still cooked on Monday in the same rice cooker. It is kept as a zero-cost component.
- Merged lines that do not land on a kitchen fraction show as parts joined with "+" (for example grillades canola "3 tbsp + 1 1/4 cups").
