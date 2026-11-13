// Build dist/ha-device-art.js: helpers + drawing sets (only those the catalog uses) + catalog + names + card.
// Plain Node, no dependencies:  node tools/build.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src"), SETS = join(SRC, "sets");
const read = (p) => readFileSync(p, "utf8");
const catalog = JSON.parse(read(join(SRC, "catalog.json")));
const names = JSON.parse(read(join(SRC, "names.json")));

// which sets ship: every set the catalog names, plus what the builder cards are made from
const need = new Set();
const BUILDER_SOURCES = { plantbuilder: ["plants", "flowers"], treebuilder: ["trees"] };
const SKIP_BUILDERS = new Set(["moisture"]); // a full card UI of its own, not a single drawing
for (const c of catalog) for (const s of c.subs) for (const k of s.items) {
  if (k.startsWith("builder:")) { const id = k.slice(8); if (SKIP_BUILDERS.has(id)) continue; need.add(id); (BUILDER_SOURCES[id] || []).forEach((x) => need.add(x)); }
  else need.add(k.split("/")[0]);
}
// set id -> file: read each file's registered id
const fileOf = {};
for (const f of readdirSync(SETS).filter((f) => f.endsWith(".js"))) {
  const m = /\(window\.HDA = window\.HDA \|\| \[\]\)\.push\(\{\s*id:\s*"([\w-]+)"/.exec(read(join(SETS, f))) || /id:\s*"([\w-]+)",\s*tab:/.exec(read(join(SETS, f)));
  fileOf[m ? m[1] : f.replace(/\.js$/, "")] = f;
}
const missing = [...need].filter((id) => !fileOf[id] && !existsSync(join(SETS, id + ".js")));
if (missing.length) { console.error("Missing set files:", missing.join(", ")); process.exit(1); }

// keep only names that ship
const keepNames = {};
for (const k in names) { const sid = k.split(/[/:]/)[0]; if (need.has(sid)) keepNames[k] = names[k]; }
const shipCatalog = catalog.map((c) => ({ id: c.id, name: c.name, subs: c.subs.map((s) => ({ id: s.id, name: s.name, items: s.items.filter((k) => !(k.startsWith("builder:") && SKIP_BUILDERS.has(k.slice(8)))) })).filter((s) => s.items.length) }));

let out = `/* Device Art Card - detailed device drawings for Home Assistant dashboards. Built by tools/build.mjs; edit src/, not this file. */\n`;
out += `(function () {\nif (window.customElements && window.customElements.get("device-art-card")) return;\n`;
out += read(join(SRC, "helpers.js")) + "\n";
const usesArt = need.has("printers") || need.has("printers3d");
if (usesArt) for (const f of readdirSync(join(SETS, "printer-art")).filter((f) => f.endsWith(".js")).sort()) out += read(join(SETS, "printer-art", f)) + "\n";
const ids = [...need].sort();
for (const id of ids) out += read(join(SETS, fileOf[id] || id + ".js")) + "\n";
out += `window.HDA_CATALOG = ${JSON.stringify(shipCatalog)};\nwindow.HDA_NAMES = ${JSON.stringify(keepNames)};\n`;
out += read(join(SRC, "card.js")) + "\n})();\n";

mkdirSync(join(ROOT, "dist"), { recursive: true });
writeFileSync(join(ROOT, "dist", "ha-device-art.js"), out);
const items = shipCatalog.reduce((n, c) => n + c.subs.reduce((m, s) => m + s.items.length, 0), 0);
console.log(`dist/ha-device-art.js: ${(out.length / 1024 / 1024).toFixed(2)} MB, ${ids.length} sets, ${items} catalog items`);
