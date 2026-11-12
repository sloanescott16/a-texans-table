# Hand-off: quick guide and "You'll use" tick boxes (chat job quick-guide-1111, 11 Nov 2026)

Branch quick-guide-1111, cut from origin/main c69c47e (live). Built in a chat workspace on a fresh clone of the site repo, not on the Base Station, so the Base Station's copy of the repo has none of this until it fetches.

Published 11 Nov 2026 on the Captain's yes (9:34 pm, in chat, to the grit cakes page going live): these six files went onto main as one commit through GitHub's upload page in his Chrome, because the chat workspace is not allowed to push. Nothing else on the site changed.

## What the Captain said (11 Nov, 9:05 pm, looking at the fried grit cakes page on his phone)
- With a screenshot of the Checklist at the top: "Check list isn't helpful. A quick guide would be but that isn't"
- With a screenshot of a step's "You'll use" list: "For things like this with a bunch of little things in there, a little checkbox as I go down would be helpful."

## What was built
- fried-grits-andouille-creole.html: the Checklist block is gone. In its place a Quick guide: three blocks (night before 8:30 pm, 6:50 am, 6:00 pm), each headed by its time and how long it takes, each a few lines with the amounts in them. The block for right now is shaded, the way the step for right now is. Every line of every "You'll use" list has a tick box.
- tools-quick-guide-1111.ts: quickGuide(html, quick, slug) and useTicks(html, slug), the two changes to a page's own copy of the page code. Run as a tool it adds the tick boxes to pages no generator writes: bun tools-quick-guide-1111.ts <site folder> <slug> [slug ...]
- tools-gen-klw-1108.ts: the fried grit cakes recipe has a `quick`; page() calls useTicks on every page it writes and quickGuide where a recipe has a `quick`. So the next time grillades, gumbo, dirty rice or the broth page is written by this generator it gains the tick boxes and keeps its Checklist until it has a `quick` of its own.
- tools-check-quick-guide-1111.ts: the headless check for a page with a quick guide.
- RECIPE-RULES.md: "Quick guide, not a checklist".
- Not touched: recipes.json, index.html, week.html, week.json, sw.js. Pages are fetched network first and nothing new joins the cache list, so the cache stays at kitchen-v32.

## How it works
- QUICK sits on its own line after STEPS: [{at, mins, lines}]. `at` is the first step of the block, so the heading time moves with Eating at (whenOf). In a line {I:id} is the scaled amount and name from the ingredient list, {Q:id} the amount alone, {t:N} a clock time.
- A tick on a "You'll use" line is saved with the page's other ticks under use:<step id>:<ingredient id>, apart from the step's tick and the ingredient list's tick. Reset everything clears it. The step card is a label, so the tap is caught and stopped before it can tick the whole step.
- The weekly menu reads ING and STEPS from the page by pattern; both lines are unchanged and week.html still shows the page.

## How to test
    bun tools-check-quick-guide-1111.ts . <outDir> <browserProfileDir> fried-grits-andouille-creole 2026-11-12
Edge on the Base Station; anywhere else set KITCHEN_BROWSER to a Chromium binary. Last run 11 Nov: 42 of 42, Chrome 153 headless at 390 x 844 with real touch taps, clock pinned. It covers: no Checklist left; three blocks with times that follow Eating at (7:15, 5:45, 6:56); amounts equal to the ingredient list at 3 and at 2 servings; one screen under the sticky bar; °F on the heat cues; a tap on a line, its box or its amount ticks that line only; a second tap unticks; ticks hold through a servings change and a reload; a tap on the instruction still ticks the step; Reset clears; the right block shaded a minute into each block and none an hour before the first move; no sideways scroll; no dashes; weekly menu and index still show the page; no console errors.
Also looked at by eye at 393 x 852 in dark and light.

## Unsure or worth a look
- Chrome only. Safari on his iPhone was not run (no WebKit in the chat workspace). The tick does not lean on anything Safari handles differently that I know of, but his phone is the real test.
- tools-check-mnp-1108.ts and tools-check-klw-1108.ts expect Checklist rows, so on this page their checklist checks now fail. For a page with a quick guide use tools-check-quick-guide-1111.ts.
- The old Checklist code (renderChecklist, the .ck styles) is still in the page, unused. The template the generator copies, carne-guisada.html, still has its own Checklist.
- The quick guide carries the full amounts for the nine things that go into the insert, in one long line. If he finds that too much, the line can name them without amounts and leave the amounts to the step's tick list.

## Left to do
- The other five pages with a Checklist need a quick guide written for each: carne-guisada, grillades-and-grits, chicken-andouille-gumbo, dirty-rice, chicken-broth.
- Tick boxes on the other 37 recipe pages. useTicks was tried on a scratch copy of all 38 pages with "You'll use" lists and applied cleanly to every one (both copies of the step code: the carne guisada pattern and the older scampi pattern). Not committed: it wants a smoke run on every page first, and the generators that still write those pages need the same useTicks call.
