(function () {
  const P = "hda-doorcfg-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const WARM = "#ffd89c";

  const EXT_C = ["#8a2f37", "#2d3c5e", "#25262a", "#ecebe6", "#7f8f78", "#2f6266", "#a9784a", "#5e3e28"];
  const INT_C = ["#ecebe6", "#9aa0a6", "#2a2b2f", "#c79a6a", "#5e3e28", "#3e4a5a"];
  const PAT_C = ["#ecebe6", "#25262a", "#5e4432", "#8a8f94", "#a9784a"];
  const TRIM_C = ["#f2f1ec", "#e8dfcc", "#2a2b2f", "#5a4636", "#a9784a"];
  const HW = { nickel: "#b9bec4", black: "#2a2b2f", brass: "#c9a14a", bronze: "#5e4432" };
  const HWV = [["nickel", "Brushed nickel"], ["black", "Matte black"], ["brass", "Brass"], ["bronze", "Oil-rubbed bronze"]];
  const STATE = [["auto", "From on/off"], ["closed", "Closed"], ["open", "Open"], ["ajar", "Ajar"]];
  const EXT_S = [["sixpanel", "6-panel"], ["craftsman", "Craftsman, top lites"], ["fullglass", "Full glass"], ["halfglass", "Half glass"], ["halfgrille", "Half glass, grille"], ["flush", "Modern flush + lite strip"], ["lites4", "Modern 4 horizontal lites"], ["lites5", "Modern 5 horizontal lites"], ["plank", "Plank / rustic"], ["arched", "Arched top"], ["dutch", "Dutch door"], ["double", "Double French entry"]];
  const INT_S = [["shaker2", "2-panel shaker"], ["shaker5", "5-panel shaker"], ["colonial", "6-panel colonial"], ["flush", "Flush"], ["lites4", "Modern 4 horizontal lites"], ["lites5", "Modern 5 horizontal lites"], ["louver", "Louvered"], ["french", "French glass"], ["barn", "Barn door on track"], ["pocket", "Pocket door"], ["bifold", "Bifold"]];
  const PAT_S = [["slider2", "2-panel slider"], ["slider3", "3-panel slider"], ["french", "French swing"], ["folding", "Folding glass wall"]];
  const BOLTS = [["none", "None"], ["lock:keypad", "Keypad deadbolt"], ["lock:touch", "Touchscreen lock"], ["lock:retrofit", "Retrofit lock"], ["lock:fingerprint", "Fingerprint lever"], ["lock:handleset", "Handle set"], ["lock:mortise", "Mortise lock"], ["lock:video", "Video doorbell lock"], ["lock:sliding", "Sliding door lock"], ["lock:office", "Office lever"], ["lock:cylinder", "Key deadbolt"], ["lock:euro", "Euro cylinder"], ["lock:card", "Card key lock"],
    ["deadbolts:arched-push-button", "Keypad deadbolt, curved"], ["deadbolts:round-push-button", "Keypad deadbolt, oval"], ["deadbolts:arched-wi-fi-touch", "Touchscreen deadbolt, curved"], ["deadbolts:slim-wi-fi-touch", "Touchscreen deadbolt, square"], ["deadbolts:arched-keypad-lever", "Keypad lever, curved"], ["deadbolts:arched-touch-lever", "Touchscreen lever, curved"], ["deadbolts:slim-touch-lever", "Touchscreen lever, square"],
    ["lock2:glass-touchscreen", "Slim touchscreen lock"], ["lock2:push-button-keypad", "Slim push-button lock"], ["lock2:a2kftouch", "Key-free Touch"], ["lock2:slim-touchscreen", "Keyless slim lock"], ["lock2:levertouch", "Lever Touch"], ["lock2:leverkeypad", "Lever Keypad"], ["lock2:smart-lock-black", "Matter Black"], ["lock2:entrance-handle-lock", "Unity Entrance"]];
  const WITH_HANDLE = ["lock:fingerprint", "lock:handleset", "lock:mortise", "lock:office", "lock:card", "lock:sliding", "deadbolts:arched-keypad-lever", "deadbolts:arched-touch-lever", "deadbolts:slim-touch-lever", "lock2:levertouch", "lock2:leverkeypad", "lock2:entrance-handle-lock"];
  const BASE = ((typeof document !== "undefined" && document.currentScript && document.currentScript.src) || "").replace(/[^/]*$/, "");
  const setOf = (id) => (window.HDA || []).filter((st) => st && st.id === id && st.icons)[0];
  let loading = false;
  function ensureLocks() {
    if (loading || typeof document === "undefined" || !document.createElement) return;
    const miss = ["lock", "deadbolts", "lock2"].filter((id) => !setOf(id)); if (!miss.length) return;
    loading = true; let left = miss.length;
    miss.forEach((id) => { const sc = document.createElement("script"); sc.src = BASE + id + ".js"; sc.onload = sc.onerror = () => { if (--left) return; ["lock", "deadbolts", "lock2"].forEach((sid) => { const st = setOf(sid); if (st && st.css && !document.querySelector(`style[data-set="${sid}"]`)) { const el = document.createElement("style"); el.dataset.set = sid; el.textContent = st.css; document.head.appendChild(el); } }); if (typeof window.renderStage === "function") window.renderStage(); }; document.head.appendChild(sc); });
  }
  const dist = (a, b) => { const A = N().hx(a), B = N().hx(b); return Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1]) + Math.abs(A[2] - B[2]); };
  let lockN = 0;
  function lockArt(x, cx, cy, S) {
    const parts = x.bolt.split(":"), st = setOf(parts[0]), ic = st && st.icons.filter((i) => i.id === parts[1])[0];
    if (!ic) { ensureLocks(); return `<rect x="${f(cx - S * .14)}" y="${f(cy - S * .22)}" width="${f(S * .28)}" height="${f(S * .44)}" rx="${f(S * .06)}" fill="${x.url("hw")}"/><circle cx="${f(cx)}" cy="${f(cy + S * .08)}" r="${f(S * .06)}" fill="#222"/><circle cx="${f(cx)}" cy="${f(cy - S * .12)}" r="${f(S * .035)}" fill="${(LOCKC[x.lock] || LOCKC.unlocked)}"/>`; }
    const cols = ic.colors || []; let col = cols[0] || "#b6babe", best = 1e9; cols.forEach((c) => { const d = dist(c, x.hw); if (d < best) { best = d; col = c; } });
    let sv = ic.render({ on: x.locked, anim: x.o.anim, color: col, level: 1, opt: { state: x.lock }, uid: `${x.u}k${++lockN}` });
    const w = S * 150 / 184;
    sv = sv.replace(/^<svg[^>]*>/, `<svg x="${f(cx - w / 2)}" y="${f(cy - S / 2)}" width="${f(w)}" height="${f(S)}" viewBox="20 8 150 184" overflow="hidden">`);
    return `<g class="hda-nobg">${sv}</g>`;
  }
  const LOCKV = [["unlocked", "Unlocked"], ["locked", "Locked"], ["locking", "Locking"], ["unlocking", "Unlocking"], ["jammed", "Jammed"]];
  const LOCKC = { unlocked: "#ff5a5f", locked: "#34d399", locking: "#ffb020", unlocking: "#ffb020", jammed: "#ff3b30" };
  const first = (all, d) => { const i = Math.max(0, all.findIndex((a) => a[0] === d)); return [all[i]].concat(all.filter((_, k) => k !== i)); };
  const firstC = (all, d) => [d].concat(all.filter((c) => c !== d));

  function ctx(o) {
    const h = N(), c = o.color || "#8a2f37", t = o.color2 || TRIM_C[0], opt = o.opt || {};
    const state = opt.state && opt.state !== "auto" ? opt.state : (o.on ? "open" : "closed");
    return { o, u: o.uid, c, t, opt, state, ang: { closed: 0, ajar: 25, open: 75 }[state] * Math.PI / 180, slide: { closed: 0, ajar: .32, open: .92 }[state],
      hw: HW[opt.hw] || HW.nickel, locked: opt.lock === "locked", lock: LOCKC[opt.lock] ? opt.lock : "unlocked", bolt: opt.bolt || "none",
      p: { l: h.shade(c, .3), m: c, d: h.shade(c, -.28), k: h.shade(c, -.55) }, tp: { l: h.shade(t, .25), m: t, d: h.shade(t, -.3) },
      id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})`, n: 0 };
  }
  function defs(x) {
    const id = x.id, p = x.p, t = x.tp;
    return `<defs>
${lg(id("dr"), [[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 1)}
${lg(id("fr"), [[0, t.d], [.3, t.l], [.7, t.m], [1, t.d]])}
${lg(id("frv"), [[0, t.l], [1, t.d]], 0, 0, 0, 1)}
${lg(id("gls"), [[0, "#9fb6c6"], [.5, "#5c7486"], [1, "#2c3a46"]], 0, 0, 1, 1)}
${lg(id("frost"), [[0, "#eef3f6"], [1, "#b9c6ce"]], 0, 0, 0, 1)}
${lg(id("sh"), [[0, "#fff", .16], [.3, "#fff", 0], [.7, "#000", 0], [1, "#000", .22]])}
${lg(id("dn"), [[0, "#000", .5], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("hw"), [[0, N().shade(x.hw, .45)], [.5, x.hw], [1, N().shade(x.hw, -.4)]], 0, 0, 1, 1)}
${lg(id("in"), [[0, "#5a4636"], [1, "#2a2018"]], 0, 0, 0, 1)}
${rg(id("lp"), [[0, WARM, .9], [.5, WARM, .35], [1, WARM, 0]])}
${rg(id("cs"), [[0, "#000", .5], [1, "#000", 0]])}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .45]], .5, .45, .75)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath></defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;

  function scene(x, kind, fy) {
    const h = N(); let s = "", d = "";
    if (kind === "front" || kind === "back") {
      const c = kind === "front" ? "#8a97a3" : "#9b6a52";
      s += `${lg(x.id("wl"), [[0, h.shade(c, -.15)], [1, h.shade(c, .05)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.url("wl")}"/>`;
      if (kind === "front") { for (let y = 14; y < fy; y += 7) d += `M8 ${y}H192`; s += `<path d="${d}" stroke="#000" stroke-opacity=".22"/>`; }
      else { for (let y = 10, i = 0; y < fy; y += 6, i++) { d += `M8 ${y}H192`; for (let xx = 8 + (i % 2) * 7; xx < 192; xx += 14) d += `M${xx} ${y}v6`; } s += `<path d="${d}" stroke="#d8cdbd" stroke-opacity=".35" stroke-width=".7"/>`; }
      s += `<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="#8d8478"/><path d="M8 ${fy}H192" stroke="#fff" stroke-opacity=".3"/><rect x="8" y="${fy}" width="184" height="4" fill="${x.url("dn")}" opacity=".6"/>`;
    } else if (kind === "patio") {
      s += `${lg(x.id("wl"), [[0, "#c9bba3"], [1, "#e0d4c0"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.url("wl")}"/>`;
      for (let xx = 8; xx < 192; xx += 9) d += `M${xx} ${fy}L${f(100 + (xx - 100) * 1.4)} 192`;
      s += `<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="#8a6440"/><path d="${d}" stroke="#000" stroke-opacity=".22"/>`;
    } else {
      s += `${lg(x.id("wl"), [[0, "#b9b2a6"], [1, "#d6cfc2"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.url("wl")}"/><rect x="8" y="${fy - 8}" width="184" height="8" fill="#f2f0ea"/><path d="M8 ${fy - 8}H192" stroke="#000" stroke-opacity=".12"/>`;
      for (let y = fy + 5; y < 192; y += 6) d += `M8 ${y}H192`;
      s += `<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="#9a7650"/><path d="${d}" stroke="#000" stroke-opacity=".2"/>`;
    }
    return BGW(s);
  }
  function beyond(x, X, Y, W, H, ext) {
    return `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(H)}" fill="${ext ? x.url("in") : "#8f8579"}"/><rect x="${f(X + W * .15)}" y="${f(Y + H * .1)}" width="${f(W * .7)}" height="${f(H * .62)}" fill="${ext ? "#7a6450" : "#b3a896"}"/><path d="M${f(X)} ${f(Y + H)}L${f(X + W * .15)} ${f(Y + H * .72)}H${f(X + W * .85)}L${f(X + W)} ${f(Y + H)}Z" fill="${ext ? "#4a3a2c" : "#a07c56"}"/>` +
      (ext ? `<ellipse cx="${f(X + W / 2)}" cy="${f(Y + H * .25)}" rx="${f(W * .7)}" ry="${f(H * .6)}" fill="${x.url("lp")}" opacity=".8"/>` : `<rect x="${f(X + W * .38)}" y="${f(Y + H * .3)}" width="${f(W * .24)}" height="${f(H * .2)}" fill="#e9e2d2" stroke="#6a5a44" stroke-width=".6"/>`);
  }

  function rpan(px, py, pw, ph, flat) {
    const d = Math.max(.8, Math.min(pw, ph) * .12);
    return `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="#000" fill-opacity="${flat ? .08 : .05}"/><path d="M${f(px)} ${f(py + ph)}V${f(py)}H${f(px + pw)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/><path d="M${f(px + pw)} ${f(py)}V${f(py + ph)}H${f(px)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>` +
      (flat ? "" : `<rect x="${f(px + d)}" y="${f(py + d)}" width="${f(pw - 2 * d)}" height="${f(ph - 2 * d)}" fill="#fff" fill-opacity=".06"/><path d="M${f(px + d)} ${f(py + ph - d)}V${f(py + d)}H${f(px + pw - d)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".6"/>`);
  }
  function glass(x, px, py, pw, ph, rows, cols, frost) {
    let s = `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="${x.url(frost ? "frost" : "gls")}"/><path d="M${f(px)} ${f(py + ph * .85)}L${f(px + pw * .6)} ${f(py)}H${f(px + pw * .85)}L${f(px)} ${f(py + ph)}Z" fill="#fff" opacity=".16"/>`;
    let d = ""; for (let r = 1; r < rows; r++) d += `M${f(px)} ${f(py + r * ph / rows)}h${f(pw)}`; for (let c = 1; c < cols; c++) d += `M${f(px + c * pw / cols)} ${f(py)}v${f(ph)}`;
    if (d) s += `<path d="${d}" stroke="${x.p.m}" stroke-width="${f(Math.max(1, pw * .05))}"/>`;
    return s + `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".6"/>`;
  }
  function leafFace(x, W, H, style, hand, ext) {
    const h = N(), m = W * .14;
    let s = `<rect width="${f(W)}" height="${f(H)}" fill="${x.url("dr")}"/>`;
    const st = style;
    if (st === "sixpanel" || st === "colonial") { const pw = (W - 3 * m) / 2; [[.05, .17], [.27, .36], [.68, .26]].forEach(([y, hh]) => { s += rpan(m, H * y, pw, H * hh) + rpan(2 * m + pw, H * y, pw, H * hh); }); }
    else if (st === "craftsman") { s += glass(x, m, H * .07, W - 2 * m, H * .26, 1, 3) + `<rect x="${f(m * .6)}" y="${f(H * .35)}" width="${f(W - 1.2 * m)}" height="${f(H * .03)}" fill="${x.p.l}"/>`; const pw = (W - 4 * m) / 3; for (let i = 0; i < 3; i++) s += rpan(m + i * (pw + m), H * .42, pw, H * .5, true); }
    else if (st === "fullglass") s += glass(x, m, H * .06, W - 2 * m, H * .86, 1, 1);
    else if (st === "halfglass" || st === "halfgrille") { s += glass(x, m, H * .06, W - 2 * m, H * .42, st === "halfgrille" ? 3 : 1, st === "halfgrille" ? 3 : 1); const pw = (W - 3 * m) / 2; s += rpan(m, H * .56, pw, H * .36) + rpan(2 * m + pw, H * .56, pw, H * .36); }
    else if (st === "flush") s += glass(x, W * (hand > 0 ? .2 : .66), H * .08, W * .14, H * .84, 1, 1, true) + (x.c === "#a9784a" || x.c === "#5e3e28" || x.c === "#c79a6a" ? grain(W, H, 3) : "");
    else if (st === "lites4" || st === "lites5") { const n = st === "lites4" ? 4 : 5, y0 = n === 4 ? .1 : .075, sp = n === 4 ? .24 : .19, gh = n === 4 ? .08 : .07, gx = W * .15, fr = (x.opt.glass || "clear") === "frost"; let d = ""; for (let i = 0; i < n; i++) { const gy = H * (y0 + i * sp); s += `<rect x="${f(gx - .8)}" y="${f(gy - .8)}" width="${f(W - 2 * gx + 1.6)}" height="${f(H * gh + 1.6)}" fill="#000" fill-opacity=".18"/>` + glass(x, gx, gy, W - 2 * gx, H * gh, 1, 1, fr); if (i < n - 1) for (let k = 1; k < 3; k++) d += `M${f(gx)} ${f(gy + H * gh + k * H * (sp - gh) / 3)}H${f(W - gx)}`; } s += `<path d="${d}" stroke="#000" stroke-opacity=".12" stroke-width=".5"/><path d="M${f(gx * .55)} ${f(H * .03)}V${f(H * .97)}M${f(W - gx * .55)} ${f(H * .03)}V${f(H * .97)}" stroke="#000" stroke-opacity=".1" stroke-width=".5"/>`; }
    else if (st === "plank") { let d = ""; for (let xx = W / 6; xx < W - .5; xx += W / 6) d += `M${f(xx)} 0V${f(H)}`; s += grain(W, H, 5) + `<path d="${d}" stroke="#000" stroke-opacity=".4" stroke-width=".8"/>`; const sw = Math.max(1.2, H * .025); [.18, .82].forEach((y) => { s += `<path d="M${f(hand > 0 ? 1 : W - 1)} ${f(H * y - sw)}H${f(hand > 0 ? W * .55 : W * .45)}L${f(hand > 0 ? W * .6 : W * .4)} ${f(H * y)}L${f(hand > 0 ? W * .55 : W * .45)} ${f(H * y + sw)}H${f(hand > 0 ? 1 : W - 1)}Z" fill="#1c1c1e"/>`; }); s += glass(x, W * .32, H * .12, W * .36, H * .14, 1, 2); }
    else if (st === "arched") { s += glass(x, m, H * .04, W - 2 * m, H * .46, 3, 2) + rpan(m, H * .58, W - 2 * m, H * .34); }
    else if (st === "dutch") { s += glass(x, m, H * .07, W - 2 * m, H * .3, 2, 2) + `<rect x="0" y="${f(H * .48)}" width="${f(W)}" height="${f(H * .035)}" fill="${x.p.l}"/><path d="M0 ${f(H * .5)}H${f(W)}" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>`; const pw = (W - 3 * m) / 2; s += rpan(m, H * .58, pw, H * .34) + rpan(2 * m + pw, H * .58, pw, H * .34); }
    else if (st === "frenchleaf") s += glass(x, m * .8, H * .05, W - 1.6 * m, H * .88, 5, 2);
    else if (st === "shaker2") { s += rpan(m, H * .06, W - 2 * m, H * .42, true) + rpan(m, H * .54, W - 2 * m, H * .4, true); }
    else if (st === "shaker5") { for (let i = 0; i < 5; i++) s += rpan(m, H * (.05 + i * .182), W - 2 * m, H * .15, true); }
    else if (st === "louver") { let d = ""; for (let y = H * .07; y < H * .93; y += H * .035) d += `<rect x="${f(m)}" y="${f(y)}" width="${f(W - 2 * m)}" height="${f(H * .022)}" fill="${x.p.d}"/><path d="M${f(m)} ${f(y)}h${f(W - 2 * m)}" stroke="#fff" stroke-opacity=".3" stroke-width=".5"/>`; s += `<rect x="${f(m)}" y="${f(H * .06)}" width="${f(W - 2 * m)}" height="${f(H * .88)}" fill="#000" fill-opacity=".3"/>` + d; }
    else if (st === "french") s += glass(x, m * .8, H * .05, W - 1.6 * m, H * .88, 5, 3);
    else if (st === "barn") { s += grain(W, H, 9); let d = ""; for (let xx = W / 5; xx < W - .5; xx += W / 5) d += `M${f(xx)} 0V${f(H)}`; s += `<path d="${d}" stroke="#000" stroke-opacity=".35" stroke-width=".7"/><path d="M${f(W * .06)} ${f(H * .06)}H${f(W * .94)}V${f(H * .94)}H${f(W * .06)}Z" fill="none" stroke="${x.p.d}" stroke-width="${f(W * .08)}"/><path d="M${f(W * .1)} ${f(H * .1)}L${f(W * .9)} ${f(H * .9)}M${f(W * .9)} ${f(H * .1)}L${f(W * .1)} ${f(H * .9)}" stroke="${x.p.d}" stroke-width="${f(W * .07)}"/>`; }
    else if (st === "glasspanel") s += glass(x, W * .07, H * .04, W * .86, H * .92, 1, 1);
    s += `<rect width="${f(W)}" height="${f(H)}" fill="${x.url("sh")}"/>`;
    return s;
  }
  function grain(W, H, seed) { const r = rnd(seed); let d = ""; for (let xx = 1; xx < W; xx += 1.4 + r() * 2) { const a = r() * 1.2 - .6; d += `M${f(xx)} 0C${f(xx + a)} ${f(H * .3)} ${f(xx - a)} ${f(H * .6)} ${f(xx)} ${f(H)}`; } return `<path d="${d}" fill="none" stroke="#2a1606" stroke-opacity=".18" stroke-width=".5"/>`; }
  function hardware(x, W, H, hand, opt) {
    opt = opt || {};
    const hx = hand > 0 ? W - W * .12 : W * .12, hy = H * .52, k = Math.max(1.6, W * .045);
    const wh = WITH_HANDLE.indexOf(x.bolt) >= 0;
    let s = opt.pull ? `<rect x="${f(hx - k * .35)}" y="${f(hy - H * .12)}" width="${f(k * .7)}" height="${f(H * .24)}" rx="${f(k * .3)}" fill="${x.url("hw")}"/>`
      : (x.bolt !== "none" && wh ? "" : `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(k * .9)}" fill="${x.url("hw")}"/><path d="M${f(hx)} ${f(hy)}h${f(-hand * k * 3)}" stroke="${x.url("hw")}" stroke-width="${f(k * .9)}" stroke-linecap="round"/>`);
    if (x.bolt !== "none") {
      const S = Math.min(W * .5, H * (wh ? .3 : .2)), cy = wh ? hy - H * .05 : hy - H * .14, lx = opt.pull ? hx - hand * W * .12 : hx;
      s += opt.full ? lockArt(x, lx, cy, S) : `<rect x="${f(lx - k * .7)}" y="${f(cy - k * 1.6)}" width="${f(k * 1.4)}" height="${f(k * 3.2)}" rx="${f(k * .4)}" fill="#26272a"/><circle cx="${f(lx)}" cy="${f(cy - k * .8)}" r="${f(k * .3)}" fill="${(LOCKC[x.lock] || LOCKC.unlocked)}"/>`;
    }
    return s;
  }
  function hinged(x, X, Y, W, H, style, hs, ext, bolt) {
    const a = x.ang, face = leafFace(x, W, H, style, -hs, ext) + hardware(x, W, H, -hs, { full: a === 0 });
    if (a === 0) return `<g transform="translate(${f(X)} ${f(Y)})">${face}</g>`;
    const F = 230, c = Math.cos(a), sn = Math.sin(a), y0 = Y + H * .45, hx = hs < 0 ? X : X + W;
    const k = (u) => F / (F + u * sn), uOf = (xl) => (hs < 0 ? xl : W - xl);
    const M = (xl) => { const u = uOf(xl); return hx - hs * u * c * k(u); };
    const n = 8; let strips = "";
    for (let i = 0; i < n; i++) {
      const x0 = i * W / n, x1 = (i + 1) * W / n, A = (M(x1) - M(x0)) / (x1 - x0), sk = k(uOf((x0 + x1) / 2)), cid = x.id("st" + (x.n++));
      strips += `<g transform="matrix(${A.toFixed(4)} 0 0 ${sk.toFixed(4)} ${f(M(x0) - A * x0)} ${f(y0 + (Y - y0) * sk)})"><clipPath id="${cid}"><rect x="${f(x0 - .05)}" y="-1" width="${f(x1 - x0 + .1)}" height="${f(H + 2)}"/></clipPath><g clip-path="url(#${cid})">${face}</g></g>`;
    }
    const kf = k(W), fx = M(hs < 0 ? W : 0), top = (kk) => y0 + (Y - y0) * kk, bot = (kk) => y0 + (Y + H - y0) * kk;
    const poly = `M${f(hx)} ${f(Y)}L${f(fx)} ${f(top(kf))}L${f(fx)} ${f(bot(kf))}L${f(hx)} ${f(Y + H)}Z`;
    const th = Math.max(1.6, W * .055) * sn * kf, ed = `M${f(fx)} ${f(top(kf))}L${f(fx - hs * th)} ${f(top(kf) + th * .15)}V${f(bot(kf) - th * .15)}L${f(fx)} ${f(bot(kf))}Z`;
    return `<g class="${P}swing" style="transform-origin:${f(hx)}px ${f(y0)}px">${strips}<path d="${poly}" fill="#000" opacity="${f(.28 * sn)}"/><path d="${poly}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/><path d="${ed}" fill="${x.p.d}"/><path d="${ed}" fill="#fff" opacity=".15"/></g>`;
  }
  function frame(x, X, Y, W, H, t, arch) {
    const top = arch ? `<path d="M${f(X - t)} ${f(Y + W * .28)}A${f(W / 2 + t)} ${f(W * .32 + t)} 0 0 1 ${f(X + W + t)} ${f(Y + W * .28)}V${f(Y + H)}H${f(X + W)}V${f(Y + W * .28)}A${f(W / 2)} ${f(W * .32)} 0 0 0 ${f(X)} ${f(Y + W * .28)}V${f(Y + H)}H${f(X - t)}Z" fill="${x.url("fr")}"/>`
      : `<path d="M${f(X - t)} ${f(Y + H)}V${f(Y - t)}H${f(X + W + t)}V${f(Y + H)}H${f(X + W)}V${f(Y)}H${f(X)}V${f(Y + H)}Z" fill="${x.url("fr")}"/><path d="M${f(X - t)} ${f(Y - t)}H${f(X + W + t)}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`;
    return top;
  }

  function exterior(x, kind) {
    const o = x.opt, style = o.style || "sixpanel", dbl = style === "double", arch = style === "arched";
    const side = o.side || "none", tr = o.transom || "none", fy = 170;
    const lw = dbl ? 46 : 58, LW = dbl ? lw * 2 : lw, H = 112, sw = 16, t = 5;
    const nS = side === "both" ? 2 : side === "one" ? 1 : 0, total = LW + nS * (sw + t);
    let X = 100 - total / 2 + (side === "both" || side === "one" ? sw + t : 0), Y = fy - H - (tr !== "none" && !arch ? 18 : 0) + (tr !== "none" && !arch ? 18 : 0);
    Y = fy - H;
    let s = scene(x, kind, fy);
    s += BGW(`<rect x="${f(Math.max(16, X - (nS ? sw + t : 0) - 22))}" y="${f(Y + 20)}" width="8" height="14" rx="2" fill="#1b1c1e"/><rect x="${f(Math.max(16, X - (nS ? sw + t : 0) - 21))}" y="${f(Y + 22)}" width="6" height="9" fill="#ffe2a4" opacity=".85"/>`);
    s += `<rect x="${f(X - (nS ? sw + t : 0) - 14)}" y="${fy}" width="${f(total + 28)}" height="8" fill="#a8a196"/><path d="M${f(X - (nS ? sw + t : 0) - 14)} ${fy}h${f(total + 28)}" stroke="#fff" stroke-opacity=".4"/><rect x="${f(X - (nS ? sw + t : 0) - 14)}" y="${fy + 8}" width="${f(total + 28)}" height="3" fill="#000" opacity=".25"/>`;
    let tY = Y;
    if (tr !== "none" && !arch) {
      tY = Y - 22;
      if (tr === "rect") s += `<rect x="${f(X - t)}" y="${f(tY - t)}" width="${f(LW + 2 * t)}" height="${f(22 + t)}" fill="${x.url("fr")}"/>` + glass(x, X, tY, LW, 18, 1, dbl ? 4 : 3);
      else { const r = LW / 2; s += `<path d="M${f(X - t)} ${f(Y)}V${f(Y - 4)}A${f(r + t)} ${f(r * .45 + t)} 0 0 1 ${f(X + LW + t)} ${f(Y - 4)}V${f(Y)}Z" fill="${x.url("fr")}"/><path d="M${f(X)} ${f(Y - 4)}A${f(r)} ${f(r * .45)} 0 0 1 ${f(X + LW)} ${f(Y - 4)}Z" fill="${x.url("gls")}"/>`; let d = ""; for (let i = 1; i < 6; i++) { const a = Math.PI * (1 - i / 6); d += `M${f(X + r)} ${f(Y - 4)}L${f(X + r + r * Math.cos(a))} ${f(Y - 4 - r * .45 * Math.sin(a))}`; } s += `<path d="${d}" stroke="${x.tp.m}" stroke-width="1"/>`; }
    }
    const sl = (sx) => `<rect x="${f(sx - t)}" y="${f(Y - t)}" width="${f(sw + 2 * t)}" height="${f(H + t)}" fill="${x.url("fr")}"/>` + glass(x, sx, Y + 3, sw, H * .62, 4, 1, true) + rpan(sx + 1, Y + H * .7, sw - 2, H * .26) + `<rect x="${f(sx)}" y="${f(Y + H * .66)}" width="${f(sw)}" height="${f(H * .34)}" fill="${x.url("dr")}" opacity=".9"/>` + rpan(sx + 2, Y + H * .7, sw - 4, H * .26);
    if (nS >= 1) s += sl(X - sw - t);
    if (nS === 2) s += sl(X + LW + t);
    const clipD = arch ? `M${f(X)} ${f(Y + H)}V${f(Y + LW * .28)}A${f(LW / 2)} ${f(LW * .32)} 0 0 1 ${f(X + LW)} ${f(Y + LW * .28)}V${f(Y + H)}Z` : `M${f(X)} ${f(Y)}H${f(X + LW)}V${f(Y + H)}H${f(X)}Z`;
    const k = x.id("oc");
    s += `<clipPath id="${k}"><path d="${clipD}"/></clipPath>`;
    if (x.ang > 0) s += `<g clip-path="url(#${k})">${beyond(x, X, Y, LW, H, true)}</g>`;
    s += frame(x, X, Y, LW, H, t, arch);
    const leaves = dbl ? hinged(Object.assign({}, x, { bolt: "none" }), X, Y, lw, H, "frenchleaf", -1, true, false) + hinged(x, X + lw, Y, lw, H, "frenchleaf", 1, true, true)
      : hinged(x, X, Y, LW, H, style, -1, true, true);
    s += arch && x.ang === 0 ? `<g clip-path="url(#${k})">${leaves}</g>` : leaves;
    if (x.ang > 0) s += `<path d="M${f(X)} ${fy}H${f(X + LW)}L${f(X + LW + 20)} 192H${f(X - 20)}Z" fill="${x.url("lp")}" opacity=".35"/>`;
    s += BGW(`<rect x="${f(X + LW + t + (nS === 2 ? sw + t : 0) + 6)}" y="${f(Y + H * .45)}" width="5" height="9" rx="1.5" fill="#26272a"/><circle cx="${f(X + LW + t + (nS === 2 ? sw + t : 0) + 8.5)}" cy="${f(Y + H * .45 + 5.5)}" r="1.4" fill="#9fd8ff"/>`);
    return s;
  }

  function patio(x) {
    const o = x.opt, st = o.style || "slider2", fy = 172, Y = 46, H = fy - Y, X = 26, W = 148, t = 6;
    let s = scene(x, "patio", fy), k = x.id("pc");
    s += `<clipPath id="${k}"><rect x="${X}" y="${Y}" width="${W}" height="${H}"/></clipPath>`;
    s += `<g clip-path="url(#${k})">${lg(x.id("sky"), [[0, "#8ab7dc"], [1, "#d8e8f0"]], 0, 0, 0, 1)}<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("sky")}"/><path d="M${X} ${f(Y + H * .55)}Q${X + 40} ${f(Y + H * .42)} ${X + 80} ${f(Y + H * .52)}T${X + W} ${f(Y + H * .48)}V${Y + H}H${X}Z" fill="#5f8a4a"/><rect x="${X}" y="${f(Y + H * .78)}" width="${W}" height="${f(H * .22)}" fill="#9a7a56"/></g>`;
    s += `<rect x="${X - t}" y="${Y - t}" width="${W + 2 * t}" height="${H + t}" fill="none" stroke="${x.t}" stroke-width="${2 * t}"/>`;
    const panel = (px, pw, handleSide) => `<rect x="${f(px)}" y="${Y}" width="${f(pw)}" height="${H}" fill="none" stroke="${x.c}" stroke-width="5"/>` + `<rect x="${f(px + 2.5)}" y="${Y + 2.5}" width="${f(pw - 5)}" height="${H - 5}" fill="#9fc3dc" opacity=".18"/><path d="M${f(px + 4)} ${f(Y + H * .9)}L${f(px + pw * .6)} ${Y + 4}H${f(px + pw * .8)}L${f(px + 4)} ${Y + H - 4}Z" fill="#fff" opacity=".14"/>` +
      (handleSide ? `<rect x="${f(handleSide > 0 ? px + pw - 6 : px + 4)}" y="${f(Y + H * .45)}" width="2.4" height="16" rx="1.2" fill="${x.url("hw")}"/>` : "");
    if (st === "slider2" || st === "slider3") {
      const n = st === "slider2" ? 2 : 3, pw = W / n;
      for (let i = 0; i < n; i++) if (i !== n - 1) s += panel(X + i * pw, pw, 0);
      const off = x.slide * pw * (n - 1) * (n === 2 ? 1 : .5);
      s += `<g class="${P}slide">${panel(X + (n - 1) * pw - off, pw, -1)}${x.bolt !== "none" ? lockArt(x, X + (n - 1) * pw - off + 9, Y + H * .5, H * .22) : ""}</g>`;
      s += `<path d="M${X} ${fy - 1}H${X + W}" stroke="#555" stroke-width="2"/>`;
    } else if (st === "folding") {
      const n = 4, pw = W / n, fold = x.slide;
      if (fold === 0) { for (let i = 0; i < n; i++) s += panel(X + i * pw, pw, i === n - 1 ? -1 : 0); if (x.bolt !== "none") s += lockArt(x, X + W - 9, Y + H * .5, H * .22); }
      else {
        const cw = pw * (1 - fold * .82);
        for (let i = 0; i < n; i++) { const px = X + i * cw, sk = (i % 2 ? -1 : 1) * fold * 6; s += `<g transform="translate(${f(px)} ${Y}) skewY(${f(sk)}) translate(${f(-px)} ${-Y})">${panel(px, cw, 0)}</g>`; }
      }
    } else {
      s += `<g clip-path="url(#${k})">${x.ang > 0 ? "" : ""}</g>` + hinged(Object.assign({}, x, { bolt: "none" }), X, Y, W / 2, H, "glasspanel", -1, true, false) + hinged(x, X + W / 2, Y, W / 2, H, "glasspanel", 1, true, true);
    }
    return s;
  }
  const lockDot = (x, cx, cy) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="2" fill="${(LOCKC[x.lock] || LOCKC.unlocked)}"/>`;

  function interior(x) {
    const o = x.opt, st = o.style || "shaker2", fy = 174, W = 60, H = 116, X = 100 - W / 2, Y = fy - H, t = 6;
    let s = scene(x, "interior", fy), k = x.id("ic");
    s += `<clipPath id="${k}"><rect x="${X}" y="${Y}" width="${W}" height="${H}"/></clipPath>`;
    if (st === "bifold") {
      const BW = 96, BX = 100 - BW / 2;
      s += `<rect x="${BX}" y="${Y}" width="${BW}" height="${H}" fill="#3a3028"/><path d="M${BX + 4} ${Y + 14}H${BX + BW - 4}" stroke="#7a6a58" stroke-width="2"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${BX + 8 + i * 13}" y="${Y + 16}" width="9" height="${30 + (i % 3) * 8}" fill="${["#5a7aa8", "#a85a5a", "#7aa85a", "#d0c0a0", "#3a3d44", "#a88a5a"][i]}"/>`).join("")}`;
      s += frame(x, BX, Y, BW, H, t, false);
      const pw = BW / 4, fold = x.slide;
      for (let side = -1; side <= 1; side += 2) for (let j = 0; j < 2; j++) {
        const cw = pw * (1 - fold * .7), base = side < 0 ? BX + j * cw : BX + BW - (j + 1) * cw, sk = (j % 2 ? 1 : -1) * side * fold * 8;
        s += `<g transform="translate(${f(base)} ${Y}) skewY(${f(sk)})"><g transform="scale(${(cw / pw).toFixed(3)} 1)">${leafFace(x, pw, H, "louver", side, false)}</g></g>`;
      }
      s += `<circle cx="${f(BX + BW / 2 - 4 - (x.slide ? BW * .25 : 0))}" cy="${f(Y + H * .5)}" r="1.6" fill="${x.url("hw")}"/>` + (x.bolt !== "none" && x.slide === 0 ? lockArt(x, BX + BW / 2 + 6, Y + H * .4, H * .18) : "");
      return s;
    }
    if (x.ang > 0 || x.slide > 0) s += `<g clip-path="url(#${k})">${beyond(x, X, Y, W, H, false)}</g>`;
    if (st === "barn") {
      const bw = W + 12, bx = X - 6 + x.slide * (W + 4);
      s += frame(x, X, Y, W, H, t, false) + `<rect x="${f(X - 16)}" y="${Y - 12}" width="${f(W * 2 + 30)}" height="4" rx="2" fill="#26272a"/>`;
      s += `<g class="${P}slide"><rect x="${f(bx)}" y="${Y - 6}" width="${bw}" height="${H + 4}" fill="none"/>` + `<g transform="translate(${f(bx)} ${Y - 6})">${leafFace(x, bw, H + 4, "barn", 1, false)}${hardware(x, bw, H + 4, -1, { pull: true })}</g>` +
        `<circle cx="${f(bx + 10)}" cy="${Y - 10}" r="4" fill="#26272a"/><circle cx="${f(bx + bw - 10)}" cy="${Y - 10}" r="4" fill="#26272a"/><path d="M${f(bx + 10)} ${Y - 10}v8M${f(bx + bw - 10)} ${Y - 10}v8" stroke="#26272a" stroke-width="2.4"/></g>`;
      return s;
    }
    if (st === "pocket") {
      const off = x.slide * W * .95;
      s += `<g clip-path="url(#${k})"><g class="${P}slide"><g transform="translate(${f(X - off)} ${Y})">${leafFace(x, W, H, "flush", 1, false)}<rect x="${f(W - 6)}" y="${f(H * .5 - 6)}" width="3" height="12" rx="1.5" fill="${x.url("hw")}"/>${x.bolt !== "none" && x.slide === 0 ? lockArt(x, W - 8, H * .38, H * .2) : ""}</g></g></g>` + frame(x, X, Y, W, H, t, false);
      return s;
    }
    s += frame(x, X, Y, W, H, t, false) + hinged(x, X, Y, W, H, st === "flush" ? "slab" : st, -1, false, false);
    return s;
  }

  const icons = [];
  function card(id, name, d) {
    const options = [{ id: "style", name: "Style", values: first(d.styles, d.style) }];
    if (d.ext) options.push({ id: "side", name: "Sidelites", values: first([["none", "None"], ["one", "One"], ["both", "Both"]], d.side || "none"), when: { opt: "style", is: d.styles.map((s) => s[0]).filter((s) => s !== "double" || true) } },
      { id: "transom", name: "Transom", values: first([["none", "None"], ["rect", "Rectangle"], ["arched", "Arched"]], d.transom || "none"), when: { opt: "style", is: d.styles.map((s) => s[0]).filter((s) => s !== "arched") } });
    if (d.styles.some((s) => s[0] === "lites4")) options.push({ id: "glass", name: "Glass", values: first([["clear", "Clear"], ["frost", "Frosted"]], d.glass || "clear"), when: { opt: "style", is: ["lites4", "lites5"] } });
    options.push({ id: "bolt", name: "Deadbolt", values: first(BOLTS, d.bolt || "none") }, { id: "lock", name: "Lock", values: LOCKV, when: { opt: "bolt", is: BOLTS.slice(1).map((v) => v[0]) } });
    options.push({ id: "hw", name: "Hardware", values: first(HWV, d.hw || "nickel") }, { id: "state", name: "State", values: STATE });
    const ic = { id, name, colors: firstC(d.colors, d.c), picker: true, colorLabel: "Door", colors2: firstC(TRIM_C, d.t || TRIM_C[0]), picker2: true, colorLabel2: "Frame", options,
      render(o) { const x = ctx(o); return svg(x, d.draw(x)); } };
    icons.push(ic);
  }
  card("front", "Front door", { styles: EXT_S, style: "craftsman", colors: EXT_C, c: "#8a2f37", ext: true, bolt: "deadbolts:arched-wi-fi-touch", side: "both", transom: "none", hw: "black", draw: (x) => exterior(x, "front") });
  card("back", "Back / side door", { styles: EXT_S, style: "halfgrille", colors: EXT_C, c: "#ecebe6", ext: true, bolt: "lock:cylinder", hw: "nickel", draw: (x) => exterior(x, "back") });
  card("patio", "Patio door", { styles: PAT_S, style: "slider2", colors: PAT_C, c: "#ecebe6", bolt: "lock:sliding", hw: "nickel", draw: patio });
  card("interior", "Interior door", { styles: INT_S, style: "shaker2", glass: "frost", colors: INT_C, c: "#ecebe6", hw: "nickel", draw: interior });

  const css = `
.hda-doorcfg-slide{transform-box:fill-box}
.hda-anim .hda-doorcfg-swing{animation:hda-doorcfg-ease 1.2s cubic-bezier(.3,.7,.3,1) both}
.hda-anim .hda-doorcfg-slide{animation:hda-doorcfg-slide 1.2s cubic-bezier(.3,.7,.3,1) both}
@keyframes hda-doorcfg-ease{from{opacity:.4;transform:scaleX(1.25)}to{opacity:1;transform:scaleX(1)}}
@keyframes hda-doorcfg-slide{from{transform:translateX(-8%)}to{transform:translateX(0)}}
.hda-anim .hda-doorcfg-blink{animation:hda-doorcfg-blink 1.2s ease-in-out infinite}
@keyframes hda-doorcfg-blink{0%,100%{opacity:.25}50%{opacity:.6}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-doorcfg-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "doorcfg",
    tab: "Door builder",
    group: "Security",
    kind: "device",
    onWord: "Open",
    offWord: "Closed",
    intro: "Build any door: front, back or side, patio and interior. Pick the real style (6-panel, craftsman, full or half glass, modern flush, plank, arched, Dutch, French entry; sliders, French and folding patio doors; shaker, colonial, flush, louvered, French, barn, pocket and bifold inside), sidelites and transom, hardware finish, door color and frame color. On swings the door open (or slides or folds it); Ajar and Closed are in the State menu, and any door can take a Deadbolt from our lock sets, drawn on the door, with a Lock menu: unlocked, locked, locking, unlocking or jammed.",
    css,
    icons,
  });
})();
