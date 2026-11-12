# Handoff: pasta-section-1111 (done from the Captain's chat, no PC job code)

What changed
- The menu section "Mains & Pasta" is now two sections: "Mains" (id mains, 14 recipes) and "Pasta" (id pasta, 4 recipes: shrimp scampi, carbonara, sausage and antipasto pasta, baked bacon mac and cheese). Pasta sits straight after Mains. The Captain, 11 Nov 2026: "I think pasta should get its own page, don't you? er own tab."
- recipes.json: the chapters list, and the chapter of those four recipes. index.html: the DATA line, still exactly JSON.stringify of recipes.json. sw.js: cache kitchen-v33 to kitchen-v34. No recipe page changed.
- Built on 5f9ec98 (Build a cook), which is untouched.

For later jobs
- A new recipe built on pasta gets chapter "pasta". Every other dinner stays in "mains". Meatballs stay in Mains: there is no pasta on that page.
- Searching "pasta" now returns the Pasta section (and anything that names pasta), not every main.
- A branch cut before this commit will conflict on the index.html DATA line: merge recipes.json, then rebuild the line from it, as before.

How it was checked
- 390 px, headless Chrome, real touch taps, the folder served under /a-texans-table/: 45 of 45.
- recipes.json differs from 5f9ec98 only in the section list and the section of the four dishes; menu order and counts; Pasta and Mains each open in place and list the right dishes, easiest first; every Pasta link opens; back from a recipe returns to the menu with Pasta still open; Build a cook still opens; search (pasta, carbonara, pot roast) and the Shrimp filter; links straight to #pasta, #mains and #cook; the weekly menu page; the service worker (cache kitchen-v34, the whole shell, the offline copy of the menu has the Pasta section).
