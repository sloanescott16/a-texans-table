import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
const [SRC, DST] = process.argv.slice(2);
const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
const rnd = Array.from(crypto.getRandomValues(new Uint8Array(6))).map(b => chars[b % 36]).join("");
const dir = process.argv[4] || `preview-1025-${rnd}`;
if (!existsSync(DST + "/" + dir)) mkdirSync(DST + "/" + dir);
const pages = ["peruvian-grilled-chicken", "carne-guisada", "tom-kha", "pork-chops-onion-pear"];
for (const p of pages) {
  let h = readFileSync(`${SRC}/${p}.html`, "utf8");
  const n0 = h;
  h = h.replace(/(<meta name="viewport"[^>]*>)/, `$1\r\n<meta name="robots" content="noindex, nofollow">`);
  h = h.replace(/(href|src)="\.\/([^"]+)"/g, (m, a, f) => { if (!existsSync(DST + "/" + f)) throw new Error("live main lacks " + f); return `${a}="../${f}"`; });
  h = h.replace("<a class='back' href='./'>", "<a class='back' href='../'>");
  h = h.replace(/if\("serviceWorker" in navigator\)\{ navigator\.serviceWorker\.register\("\.\/sw\.js"\)\.catch\(function\(\)\{\}\); \}\r?\n/, "");
  if (/(href|src)="\.\//.test(h) || h.includes("serviceWorker") || h.includes("href='./'")) throw new Error("leftover in " + p);
  if (!h.includes('content="noindex, nofollow"')) throw new Error("robots " + p);
  writeFileSync(`${DST}/${dir}/${p}.html`, h);
}
console.log(dir);
