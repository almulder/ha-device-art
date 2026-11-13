(function () {
  "use strict";
  const CFG = {
    id: "treebuilder", tab: "Tree builder", P: "hda-treebuilder-", key: "hda-builder-tree-",
    sources: [{ set: "trees", prefix: "hda-trees-", group: "Trees", plantColor: null }],
    noun: "tree", potNoun: "Planter", potColorLabel: "Planter color",
    potName: {
      fiddle: "Woven basket", olive: "Speckled rim pot", kentia: "Glossy tall pot", ficus: "Pot on a stand", money: "Bellied bowl", lemon: "Glazed urn",
      bonsai: "Bonsai tray", dracaena: "Corn plant planter", norfolk: "Ribbed pot", jmaple: "Garden bed", oak: "Lawn",
    },
    anchors: { bonsai: { x: 100, y: 154, rx: 50 } },
    skipPot: { fallmaple: 1, birch: 1, spruce: 1, cherry: 1, palm: 1, willow: 1, apple: 1, aspen: 1, magnolia: 1 },
    potColored: (src, ic) => !!ic && /^(Pot|Basket|Tray)$/.test(ic.colorLabel || ""),
    plantColorLabel: (src, ic) => ic.colorLabel ? ic.colorLabel + " color" : "Color",
    examples: [["olive", "olive"], ["lemon", "bonsai"], ["cherry", "lemon"], ["kentia", "fiddle"], ["jmaple", "money"], ["fiddle", "norfolk"]],
    intro: "Pick any tree from the Trees set and stand it in any of their planters. The planter color and, where the tree has one, the leaf, blossom or fruit color are yours; the tree's own planter gives back the original drawing.",
    
  };

  const P = CFG.P, H = () => window.HDAH;
  const BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/]*$/, "");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const n1 = (v) => (Math.round(v * 100) / 100).toString();
  const store = {
    get(k, d) { try { const v = localStorage.getItem(CFG.key + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(CFG.key + k, JSON.stringify(v)); } catch (e) {} },
  };
  const setOf = (id) => (window.HDA || []).filter((s) => s && s.id === id && s.icons)[0];
  function ensure(cb) {
    const miss = CFG.sources.map((s) => s.set).filter((id) => !setOf(id));
    const done = () => { CFG.sources.forEach((s) => { const set = setOf(s.set); if (set && set.css && !document.querySelector(`style[data-set="${s.set}"]`)) { const el = document.createElement("style"); el.dataset.set = s.set; el.textContent = set.css; document.head.appendChild(el); } }); cb(); };
    if (!miss.length) return done();
    let left = miss.length; const W = (window.__hdaSrcLoad = window.__hdaSrcLoad || {});
    miss.forEach((id) => { const fin = () => { if (--left === 0) done(); };
      if (W[id]) { W[id].push(fin); return; } W[id] = [fin];
      const sc = document.createElement("script"); sc.src = BASE + id + ".js"; sc.onload = sc.onerror = () => { const q = W[id]; W[id] = { push: (f) => f() }; q.forEach((f) => f()); }; document.head.appendChild(sc); });
  }
  let uidN = 0; const uid = () => "b" + CFG.id.slice(0, 2) + (++uidN);
  function split(svg, prefix) {
    const a = svg.indexOf(">") + 1, b = svg.lastIndexOf("</svg>"); let inner = svg.slice(a, b), defs = "";
    const dm = inner.match(/^\s*<defs>([\s\S]*?)<\/defs>/); if (dm) { defs = dm[1]; inner = inner.slice(dm[0].length); }
    const re = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g, els = []; let depth = 0, start = 0, tag = "", m;
    while ((m = re.exec(inner))) { const close = m[1] === "/", self = m[4] === "/";
      if (!close) { if (depth === 0) { start = m.index; tag = m[0]; } if (self) { if (depth === 0) els.push({ s: start, e: re.lastIndex, t: tag }); } else depth++; }
      else { depth--; if (depth === 0) els.push({ s: start, e: re.lastIndex, t: tag }); } }
    const isPl = (t) => t.indexOf(`class="${prefix}sway`) >= 0 || t.indexOf(`class="${prefix}hang`) >= 0 || t.indexOf(`class="${prefix}whip`) >= 0;
    let i0 = els.findIndex((e) => isPl(e.t)); if (i0 < 0) i0 = els.length;
    const part = (arr) => arr.map((e) => inner.slice(e.s, e.e)).join("");
    return { defs, pot: part(els.slice(0, i0)), plant: part(els.slice(i0)) };
  }
  function soils(pot, u) {
    const out = [], id = u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`<ellipse cx="([-\\d.]+)" cy="([-\\d.]+)" rx="([-\\d.]+)" ry="([-\\d.]+)" fill="url\\(#${id}-so(?:il[-\\d]*)?\\)"`, "g"); let m;
    while ((m = re.exec(pot))) out.push({ x: +m[1], y: +m[2], rx: +m[3] });
    const rp = new RegExp(`<path d="([^"]+)" fill="url\\(#${id}-so(?:il[-\\d]*)?\\)"`, "g");
    while ((m = rp.exec(pot))) { const nums = m[1].match(/-?\d+(\.\d+)?/g).map(Number), xs = [], ys = []; for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
      const x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs); out.push({ x: (x0 + x1) / 2, y: (Math.min.apply(0, ys) + Math.max.apply(0, ys)) / 2, rx: (x1 - x0) / 2 }); }
    return out;
  }
  let CAT = null;
  function catalog() {
    if (CAT && CAT.plants.length) return CAT;
    const plants = [], pots = [], seenKey = {};
    CFG.sources.forEach((src) => { const set = setOf(src.set); if (!set) return;
      set.icons.forEach((ic) => { const u = uid(); let sp, an = [];
        try { sp = split(ic.render({ on: true, anim: false, level: .8, color: (ic.colors || ["#c8693f"])[0], uid: u, parts: {}, opt: {} }), src.prefix); an = soils(sp.pot, u); if (CFG.anchors && CFG.anchors[ic.id]) an = [CFG.anchors[ic.id]]; } catch (e) { sp = null; }
        const fixed = !sp || an.length !== 1 || !sp.plant;
        const potKey = src.set === "flowers" && sp ? ((sp.defs.match(new RegExp(`id="${u}-pot(\\w+)"`)) || [])[1]) : null;
        const pl = { id: ic.id, name: ic.name, ic, src, fixed, anchor: an[0], potKey, colored: !CFG.potColored(src, ic), label: CFG.plantColorLabel ? CFG.plantColorLabel(src, ic) : src.plantColor };
        plants.push(pl);
        if (!fixed && !CFG.skipPot[ic.id]) { const nk = potKey ? "f:" + potKey : ic.id; const name = CFG.potName[ic.id + ":pot"] || CFG.potName[nk] || ic.name + " pot";
          seenKey[name] = (seenKey[name] || 0) + 1; { const nm = seenKey[name] > 1 ? name + " " + seenKey[name] : name; pots.push({ id: ic.id, name: nm, potSrc: pl, recolor: !!potKey, tint: CFG.potColored(src, ic), colors: CFG.potColored(src, ic) ? ic.colors : potKey ? ["#c8693f", "#f4f1ea", "#2d2c35", "#2a4486", "#8eac85", "#d9a42f", "#c27a8a"] : null }); }
          }
      }); });
    CAT = { plants, pots, P: {}, Q: {} }; plants.forEach((p) => { CAT.P[p.id] = p; }); pots.forEach((p) => { CAT.Q[p.id] = p; });
    return CAT;
  }
  function recolor(defs, u, key, c) {
    const h = H(), l = h.shade(c, .4), m = c, d = h.shade(c, -.5);
    const g = `<linearGradient id="${u}-pot${key}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${h.shade(d, -.25)}"/><stop offset=".2" stop-color="${m}"/><stop offset=".36" stop-color="${l}"/><stop offset=".6" stop-color="${m}"/><stop offset=".86" stop-color="${d}"/><stop offset="1" stop-color="${h.shade(d, -.35)}"/></linearGradient>`;
    return defs.replace(new RegExp(`<linearGradient id="${u}-pot${key}"[\\s\\S]*?</linearGradient>`), g);
  }
  const base = (st) => ({ on: !!st.on, anim: !!st.anim, level: st.level == null ? .8 : st.level, parts: {}, opt: {} });
  const ownPot = (pl) => pl.id;
  function compose(c, st) {
    const K = catalog(), pl = K.P[c.plant] || K.plants[0]; if (!pl) return "";
    let po = K.Q[c.pot] || K.Q[ownPot(pl)]; if (pl.fixed || !po) po = null;
    const own = !po || po.id === pl.id;
    const plantCol = pl.colored ? (c.color || pl.ic.colors[0]) : pl.ic.colors[0];
    if (own) { const u = uid(); let svg = pl.ic.render(Object.assign(base(st), { uid: u, color: pl.colored ? plantCol : (c.potColor || pl.ic.colors[0]) }));
      if (pl.potKey && c.potColor) svg = svg.replace(/<defs>([\s\S]*?)<\/defs>/, (all, d) => `<defs>${recolor(d, u, pl.potKey, c.potColor)}</defs>`);
      return svg; }
    const u1 = uid(), u2 = uid();
    const s1 = split(pl.ic.render(Object.assign(base(st), { uid: u1, color: plantCol })), pl.src.prefix);
    const potSrc = po.potSrc, dc = po.tint ? (c.potColor || potSrc.ic.colors[0]) : (potSrc.colored && pl.colored && pl.src === potSrc.src ? plantCol : potSrc.ic.colors[0]);
    const s2 = split(potSrc.ic.render(Object.assign(base(st), { uid: u2, color: dc })), potSrc.src.prefix);
    let d2 = s2.defs; if (po.recolor && c.potColor) d2 = recolor(d2, u2, potSrc.potKey, c.potColor);
    const A = pl.anchor, B = potSrc.anchor, k = cl(Math.min(B.rx / A.rx, (B.y - 4) / Math.max(20, A.y - 6)), .5, 1.16);
    const tr = `translate(${n1(B.x)} ${n1(B.y)}) scale(${n1(k)}) translate(${n1(-A.x)} ${n1(-A.y)})`;
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>${d2}${s1.defs}</defs>${s2.pot}<g transform="${tr}">${s1.plant}</g></svg>`;
  }

  const css = `
.${P}root { display: block; color: #f3efff; }
.${P}top { display: grid; grid-template-columns: minmax(260px, 380px) 1fr; gap: 18px; align-items: start; }
@media (max-width: 760px) { .${P}top { grid-template-columns: 1fr; } }
.${P}card { position: relative; border-radius: 24px; background: rgba(28, 19, 60, .62); border: 1px solid rgba(255, 255, 255, .1); box-shadow: 0 12px 40px rgba(5, 2, 20, .4), inset 0 1px 0 rgba(255, 255, 255, .08); padding: 12px; min-width: 0; }
.${P}card svg { display: block; width: 100%; height: auto; }
.${P}name { font-weight: 650; font-size: 15px; margin: 2px 4px 0; } .${P}name small { display: block; font-weight: 500; font-size: 12px; color: rgba(200, 190, 240, .7); }
.${P}ctl { display: grid; gap: 14px; padding: 16px; border-radius: 18px; background: rgba(32, 20, 80, .52); border: 1px solid rgba(255, 255, 255, .1); font-size: 12.5px; color: rgba(234, 226, 255, .78); }
.${P}f { display: grid; gap: 6px; }
.${P}lab { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: rgba(222, 212, 255, .7); font-weight: 650; }
.${P}ctl select { height: 32px; border-radius: 9px; padding: 0 8px; font: inherit; font-size: 13px; color: #f3efff; background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 255, 255, .16); max-width: 320px; }
.${P}ctl select:disabled { opacity: .5; }
.${P}ctl option, .${P}ctl optgroup { background: #1d1145; color: #f3efff; }
.${P}sw { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.${P}sw button { width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .25); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .25); cursor: pointer; padding: 0; }
.${P}sw button[aria-pressed="true"] { border-color: #fff; box-shadow: 0 0 0 2px #a78bfa; }
.${P}sw button.${P}orig { width: auto; border-radius: 99px; padding: 0 9px; font: inherit; font-size: 11.5px; color: inherit; background: rgba(255, 255, 255, .08); }
.${P}sw input[type=color] { width: 30px; height: 26px; padding: 0; border: 1px solid rgba(255, 255, 255, .25); border-radius: 8px; background: transparent; cursor: pointer; }
.${P}hint { color: rgba(200, 190, 240, .62); font-size: 12px; }
.${P}row { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
@media (max-width: 1000px) { .${P}row { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.${P}ex { border-radius: 18px; background: rgba(28, 19, 60, .62); border: 1px solid rgba(255, 255, 255, .1); padding: 8px; cursor: pointer; text-align: left; color: inherit; font: inherit; }
.${P}ex:hover { border-color: rgba(179, 157, 255, .5); }
.${P}ex svg { display: block; width: 100%; height: auto; }
.${P}ex span { display: block; font-size: 12px; font-weight: 600; margin: 2px 4px; } .${P}ex small { display: block; font-size: 11px; color: rgba(200, 190, 240, .65); font-weight: 500; }
.${P}light .${P}card, .${P}light .${P}ex { background: rgba(255, 255, 255, .6); border-color: rgba(255, 255, 255, .9); color: #1f2033; }
.${P}light .${P}ctl { background: rgba(255, 255, 255, .55); color: #3b3f5c; } .${P}light .${P}lab { color: #5b5f7a; }
.${P}light .${P}ctl select { color: #1f2033; background: rgba(255, 255, 255, .8); border-color: rgba(31, 32, 51, .15); } .${P}light .${P}ctl option { background: #fff; color: #1f2033; }
.${P}light .${P}name small, .${P}light .${P}ex small, .${P}light .${P}hint { color: #5b5f7a; }
`;
  let ROOT = null, ST = null, C = null;
  const load = () => ({ plant: store.get(CFG.noun, null), pot: store.get("pot", null), potColor: store.get("potColor", null), color: store.get("color", null) });
  const save = () => { store.set(CFG.noun, C.plant); store.set("pot", C.pot); store.set("potColor", C.potColor); store.set("color", C.color); };
  function swatches(kind, list, cur, orig) {
    return `<div class="${P}sw">${orig ? `<button type="button" class="${P}orig" data-${kind}="" aria-pressed="${!cur}">Original</button>` : ""}${list.map((c) => `<button type="button" data-${kind}="${c}" style="background:${c}" aria-pressed="${String(cur).toLowerCase() === String(c).toLowerCase()}" aria-label="${c}"></button>`).join("")}<input type="color" data-${kind}pick value="${cur || list[0]}" aria-label="Any color"></div>`;
  }
  function exName(e) { const K = catalog(), p = K.P[e[0]], q = K.Q[e[1]] || (K.P[e[1]] && K.Q[ownPot(K.P[e[1]])]); return [p ? p.name : e[0], q ? q.name : ""]; }
  function draw() {
    if (!ROOT) return; const K = catalog();
    if (!K.plants.length) { ROOT.querySelector(`.${P}card`).innerHTML = `<div class="${P}hint">Loading the original drawings…</div>`; return; }
    const pl = K.P[C.plant] || K.plants[0]; C.plant = pl.id;
    if (pl.fixed) C.pot = null; else if (!K.Q[C.pot]) C.pot = ownPot(pl);
    const po = C.pot ? K.Q[C.pot] : null;
    ROOT.className = `${P}root` + (ST && ST.bg === "light" ? ` ${P}light` : "");
    const pSel = ROOT.querySelector("[data-plant]"), qSel = ROOT.querySelector("[data-pot]");
    pSel.value = pl.id; qSel.value = pl.fixed ? "" : C.pot; qSel.disabled = !!pl.fixed;
    const state = ST.on ? (ST.level >= .6 ? "watered" : ST.level >= .3 ? "needs water soon" : "droopy, needs water") : "dry";
    ROOT.querySelector(`.${P}card`).innerHTML = compose(C, ST) + `<div class="${P}name">${esc(pl.name)}<small>${pl.fixed || !po ? "in its own planter" : "in the " + esc(po.name.toLowerCase())} · ${state}</small></div>`;
    const ownTint = pl.fixed && !pl.colored;
    const tint = (po && (po.tint || po.recolor)) || ownTint;
    const pr = ROOT.querySelector("[data-potrow]"); pr.style.display = tint ? "" : "none";
    if (tint) ROOT.querySelector("[data-potsw]").innerHTML = swatches("pc", (po ? po.colors : pl.ic.colors).slice(0, 7), C.potColor, true);
    const fr = ROOT.querySelector("[data-colrow]"); fr.style.display = pl.colored ? "" : "none";
    if (pl.colored) { fr.querySelector(`.${P}lab`).textContent = pl.label || "Color"; ROOT.querySelector("[data-colsw]").innerHTML = swatches("fc", pl.ic.colors.slice(0, 7), C.color || pl.ic.colors[0]); }
    ROOT.querySelector(`.${P}row`).innerHTML = CFG.examples.map((e, i) => { const nm = exName(e); return `<button type="button" class="${P}ex" data-ex="${i}">${compose({ plant: e[0], pot: K.Q[e[1]] ? e[1] : (K.P[e[1]] ? ownPot(K.P[e[1]]) : null) }, ST)}<span>${esc(nm[0])}<small>${esc(nm[1])}</small></span></button>`; }).join("");
  }
  function build() {
    const K = catalog();
    const groups = CFG.sources.map((s) => `<optgroup label="${esc(s.group)}">${K.plants.filter((p) => p.src === s).map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</optgroup>`).join("");
    ROOT.querySelector("[data-plant]").innerHTML = groups;
    ROOT.querySelector("[data-pot]").innerHTML = `<option value="" hidden>Its own planter</option>` + K.pots.map((q) => `<option value="${q.id}">${esc(q.name)}</option>`).join("");
    draw();
  }
  function mount(el, st) {
    ST = st; C = load();
    el.innerHTML = `<div class="${P}root"><div class="${P}top"><div class="${P}card"></div><div class="${P}ctl">
      <label class="${P}f"><span class="${P}lab">${CFG.noun === "tree" ? "Tree" : "Plant"}</span><select data-plant></select></label>
      <label class="${P}f"><span class="${P}lab">${esc(CFG.potNoun)}</span><select data-pot></select></label>
      <div class="${P}f" data-potrow><span class="${P}lab">${esc(CFG.potColorLabel)}</span><div data-potsw></div></div>
      <div class="${P}f" data-colrow><span class="${P}lab">Color</span><div data-colsw></div></div>
      <div class="${P}hint">Every ${CFG.noun} fits every ${CFG.noun === "tree" ? "planter" : "pot"}; its own ${CFG.noun === "tree" ? "planter" : "pot"} shows the original drawing. The Water slider makes it lush or droopy; All off shows it dry. Tap an example below to load it.</div>
    </div></div><div class="${P}row"></div></div>`;
    ROOT = el.firstChild;
    const pick = (k, v) => { C[k] = v; save(); draw(); };
    ROOT.addEventListener("change", (e) => { const t = e.target;
      if (t.matches("[data-plant]")) { const p = catalog().P[t.value]; C.plant = t.value; C.pot = p ? ownPot(p) : null; C.potColor = null; C.color = null; save(); draw(); }
      else if (t.matches("[data-pot]")) { C.pot = t.value; C.potColor = null; save(); draw(); } });
    ROOT.addEventListener("input", (e) => { const t = e.target; if (t.matches("[data-pcpick]")) pick("potColor", t.value); else if (t.matches("[data-fcpick]")) pick("color", t.value); });
    ROOT.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.pc != null) pick("potColor", b.dataset.pc || null); else if (b.dataset.fc != null) pick("color", b.dataset.fc || null);
      else if (b.dataset.ex != null) { const x = CFG.examples[+b.dataset.ex], K = catalog(); C = { plant: x[0], pot: K.Q[x[1]] ? x[1] : (K.P[x[1]] ? ownPot(K.P[x[1]]) : null), potColor: null, color: null }; save(); draw(); } });
    ROOT.querySelector(`.${P}card`).innerHTML = `<div class="${P}hint">Loading the original drawings…</div>`;
    ensure(() => { CAT = null; build(); });
  }
  function update(st) { ST = st; if (ROOT && catalog().plants.length) draw(); }

  (window.HDA = window.HDA || []).push({
    id: CFG.id, tab: CFG.tab, group: "Plants", kind: "custom", intro: CFG.intro,  css, mount, update,
    draw: (c, st) => compose(c, st), catalog: () => catalog(), ensure,
  });
})();
