(function () {
  "use strict";
  const P = "hda-windowcfg-";
  const H = () => window.HDAH;
  const f = (v) => (Math.round(v * 10) / 10).toString();
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  function rnd(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  function X(o) {
    const d = []; let n = 0;
    const st = (a) => a.map(([of, c, op]) => `<stop offset="${of}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
    const opt = (k, def) => (o.opt && o.opt[k]) || def;
    const fc = o.color || "#f4f3ef", tc = o.color2 || "#f4f3ef";
    const x = { o, d, opt, fc, tc, id: (k) => `${o.uid}-${k}${n++}`,
      lg(a, x1, y1, x2, y2) { const id = `${o.uid}-g${n++}`; d.push(`<linearGradient id="${id}" x1="${x1 == null ? 0 : x1}" y1="${y1 == null ? 0 : y1}" x2="${x2 == null ? 0 : x2}" y2="${y2 == null ? 1 : y2}">${st(a)}</linearGradient>`); return `url(#${id})`; },
      rg(a, cx, cy, r) { const id = `${o.uid}-g${n++}`; d.push(`<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r == null ? .5 : r}">${st(a)}</radialGradient>`); return `url(#${id})`; },
      clip(path) { const id = `${o.uid}-c${n++}`; d.push(`<clipPath id="${id}"><path d="${path}"/></clipPath>`); return `url(#${id})`; } };
    x.a = o.on ? cl(o.level == null ? .8 : +o.level || 0, 0, 1) : 0;
    x.style = opt("style", "dh"); x.inside = false; x.grille = opt("grille", "none"); x.glass = opt("glass", "clear");
    x.locked = opt("lock", "unlocked") === "locked" && x.a === 0; x.screen = opt("screen", "none"); x.tt = opt("tt", "tilt");
    return x;
  }
  const rect = (x, y, w, h) => `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
  const poly = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
  const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; };

  function wall(x, kind) {
    const r = rnd(kind.length * 17 + 3); let s = "";
    if (kind === "brick") { s += `<rect width="200" height="200" fill="#6a3a2c"/>`; for (let row = 0, y = 0; y < 200; y += 9, row++) for (let bx = -(row % 2) * 13; bx < 200; bx += 26) s += `<rect x="${bx + .7}" y="${y + .7}" width="24.6" height="7.6" rx=".8" fill="${H().mix("#8e4c38", "#b56a4c", r())}"/>`; }
    else if (kind === "siding") { s += `<rect width="200" height="200" fill="#c6ccd2"/>`; for (let y = 0; y < 200; y += 10) s += `<rect y="${y}" width="200" height="4" fill="#fff" opacity=".16"/><path d="M0 ${y + 9.5}H200" stroke="#000" stroke-opacity=".28" stroke-width="1"/>`; }
    else if (kind === "stucco") { s += `<rect width="200" height="200" fill="#e0d2b8"/>`; for (let i = 0; i < 220; i++) s += `<circle cx="${f(r() * 200)}" cy="${f(r() * 200)}" r="${f(.4 + r() * .9)}" fill="${r() > .5 ? "#fff" : "#7a6a50"}" opacity=".12"/>`; }
    else if (kind === "roofout") { s += `<rect width="200" height="200" fill="#4a4e56"/>`; for (let row = 0, y = 0; y < 200; y += 11, row++) for (let bx = -(row % 2) * 10; bx < 200; bx += 20) s += `<path d="M${bx + .6} ${y}H${bx + 19.4}V${y + 10}Q${bx + 10} ${y + 12} ${bx + .6} ${y + 10}Z" fill="${H().mix("#3a3d44", "#5c606a", r())}"/>`; }
    else if (kind === "roofin") { s += `<rect width="200" height="200" fill="${x.lg([[0, "#d9d2c6"], [1, "#a8a094"]])}"/><path d="M0 170L200 150V200H0Z" fill="#8a8276" opacity=".5"/>`; }
    else { s += `<rect width="200" height="200" fill="${x.lg([[0, "#8f8a9a"], [1, "#6a6575"]])}"/><rect y="182" width="200" height="18" fill="#6e4a33"/><rect y="176" width="200" height="6" fill="#ece8df"/>`; }
    return s + `<rect width="200" height="200" fill="${x.lg([[0, "#fff", .06], [1, "#000", .25]])}"/>`;
  }
  function viewArt(x, b) {
    const [bx, by, bw, bh] = b;
    if (x.inside) return `<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="${x.lg([[0, "#3a8ad8"], [.62, "#8ac4ee"], [1, "#d6edf8"]])}"/>` +
      `<g fill="#fff" opacity=".9"><ellipse cx="${f(bx + bw * .66)}" cy="${f(by + bh * .2)}" rx="${f(bw * .14)}" ry="${f(bh * .04)}"/><ellipse cx="${f(bx + bw * .72)}" cy="${f(by + bh * .17)}" rx="${f(bw * .08)}" ry="${f(bh * .05)}"/></g>` +
      `<path d="M${f(bx)} ${f(by + bh * .74)}Q${f(bx + bw / 2)} ${f(by + bh * .64)} ${f(bx + bw)} ${f(by + bh * .72)}V${f(by + bh)}H${f(bx)}Z" fill="${x.lg([[0, "#84c465"], [1, "#4a883b"]])}"/>` +
      `<rect x="${f(bx + bw * .22)}" y="${f(by + bh * .42)}" width="${f(bw * .04)}" height="${f(bh * .38)}" fill="#6a4a30"/><circle cx="${f(bx + bw * .24)}" cy="${f(by + bh * .38)}" r="${f(Math.min(bw, bh) * .2)}" fill="${x.rg([[0, "#98d870"], [.6, "#4d9c40"], [1, "#2b6328"]], .38, .3, .75)}"/>`;
    return `<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="${x.lg([[0, "#1c2029"], [1, "#3a3f4a"]])}"/>` +
      `<path d="M${f(bx)} ${f(by)}H${f(bx + bw * .6)}L${f(bx)} ${f(by + bh * .75)}Z" fill="#a8d4f2" opacity=".45"/><circle cx="${f(bx + bw * .78)}" cy="${f(by + bh * .72)}" r="${f(Math.min(bw, bh) * .18)}" fill="#6a9a5a" opacity=".22"/>` +
      `<path d="M${f(bx + bw * .7)} ${f(by)}H${f(bx + bw * .8)}L${f(bx + bw * .25)} ${f(by + bh)}H${f(bx + bw * .15)}Z" fill="#fff" opacity=".08"/>`;
  }
  const view = (x, pts) => `<g class="hda-bg"><g clip-path="${x.clip(poly(pts))}">${viewArt(x, bbox(pts))}</g></g>`;

  const glassFill = (x) => x.glass === "frosted" ? `<FILL fill="#f2f4f6" fill-opacity=".78"/>` : x.glass === "tinted" ? `<FILL fill="#2a2a20" fill-opacity=".45"/>` : `<FILL fill="${x.lg([[0, "#fff", .22], [.35, "#fff", .02], [.6, "#fff", .1], [.7, "#fff", .01]], 0, 0, 1, 1)}"/>`;
  function grilles(x, pts, mode, cols, rows) {
    if (mode === "none") return "";
    const [bx, by, bw, bh] = bbox(pts), c = H().shade(x.fc, .08), sw = Math.max(1.2, Math.min(bw, bh) * .025); let d = "";
    if (mode === "prairie") { const m = Math.min(bw, bh) * .16; d += `M${f(bx + m)} ${f(by)}V${f(by + bh)}M${f(bx + bw - m)} ${f(by)}V${f(by + bh)}M${f(bx)} ${f(by + m)}H${f(bx + bw)}M${f(bx)} ${f(by + bh - m)}H${f(bx + bw)}`; }
    else { const nc = cols || (bw > bh * 1.4 ? 3 : 2), nr = rows || (bh > bw * 1.3 ? 3 : 2); for (let i = 1; i < nc; i++) d += `M${f(bx + bw * i / nc)} ${f(by)}V${f(by + bh)}`; for (let j = 1; j < nr; j++) d += `M${f(bx)} ${f(by + bh * j / nr)}H${f(bx + bw)}`; }
    return `<g clip-path="${x.clip(poly(pts))}"><path d="${d}" stroke="#000" stroke-opacity=".25" stroke-width="${f(sw + 1)}" fill="none"/><path d="${d}" stroke="${c}" stroke-width="${f(sw)}" fill="none"/></g>`;
  }
  function sash(x, pts, fw, g, extra) {
    const d = poly(pts), cc = x.lg([[0, H().shade(x.fc, .25)], [.5, x.fc], [1, H().shade(x.fc, -.25)]], 0, 0, 1, 1);
    return glassFill(x).replace("<FILL", `<path d="${d}"`) + (g ? grilles(x, pts, g) : "") +
      `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="${f(fw + 1.6)}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${cc}" stroke-width="${f(fw)}" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".6" stroke-linejoin="round"/>` + (extra || "");
  }
  const R4 = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  function trim(x, x0, y0, w, h, arch) {
    const tc = x.tc, g = x.lg([[0, H().shade(tc, .2)], [.5, tc], [1, H().shade(tc, -.2)]], 0, 0, 1, 1), t = 8;
    const hole = arch ? `M${x0} ${y0 + h}V${y0 + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x0 + w} ${y0 + w / 2}V${y0 + h}Z` : `M${x0} ${y0}H${x0 + w}V${y0 + h}H${x0}Z`;
    const outer = arch ? `M${x0 - t} ${y0 + h + t}V${y0 + w / 2}A${w / 2 + t} ${w / 2 + t} 0 0 1 ${x0 + w + t} ${y0 + w / 2}V${y0 + h + t}Z` : `M${x0 - t} ${y0 - t}H${x0 + w + t}V${y0 + h + t}H${x0 - t}Z`;
    let s = `<path d="${outer}${hole}" fill="#000" opacity=".22" fill-rule="evenodd" transform="translate(2 2)"/><path d="${outer}${hole}" fill="${g}" fill-rule="evenodd"/>`;
    s += `<rect x="${x0 - t - 4}" y="${y0 + h + t - 2}" width="${w + 2 * t + 8}" height="6" rx="1" fill="${H().shade(tc, .08)}"/><rect x="${x0 - t - 4}" y="${y0 + h + t + 4}" width="${w + 2 * t + 8}" height="3" fill="#000" opacity=".25"/>`;
    return s;
  }
  const frameIn = (x, pts, fw) => `<path d="${poly(pts)}" fill="none" stroke="${H().shade(x.fc, -.15)}" stroke-width="${fw || 4}"/>`;
  function lockAt(x, cx, cy, kind) {
    const c = H().shade(x.fc, -.35), on = x.locked;
    if (kind === "cam") return `<rect x="${f(cx - 5)}" y="${f(cy - 1.6)}" width="10" height="3.2" rx="1.2" fill="${c}"/><path d="M${f(cx)} ${f(cy)}l${on ? 7 : 5} ${on ? 0 : -4}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>` + (on ? `<circle cx="${f(cx + 7)}" cy="${f(cy)}" r="1.3" fill="#34d399"/>` : "");
    return `<rect x="${f(cx - 1.6)}" y="${f(cy - 4)}" width="3.2" height="8" rx="1" fill="${c}"/><path d="M${f(cx)} ${f(cy)}l${on ? 0 : 6} ${on ? 7 : 0}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>` + (on ? `<circle cx="${f(cx)}" cy="${f(cy + 8)}" r="1.3" fill="#34d399"/>` : "");
  }
  function screenOver(x, pts, part) {
    if (x.screen === "none" || (part === "half" && x.screen !== "half" && x.screen !== "full") || (part === "full" && x.screen !== "full")) return "";
    const [bx, by, bw, bh] = bbox(pts); let d = ""; for (let yy = by + 1.5; yy < by + bh; yy += 1.5) d += `M${f(bx)} ${f(yy)}H${f(bx + bw)}`;
    return `<g clip-path="${x.clip(poly(pts))}"><rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="#5a6068" opacity=".28"/><path d="${d}" stroke="#2a2e34" stroke-opacity=".35" stroke-width=".4"/></g><path d="${poly(pts)}" fill="none" stroke="#8a9098" stroke-width="1.6"/>`;
  }

  const S = {};
  function hung(x, single, arch) {
    const x0 = 60, w = 80, y0 = arch ? 70 : 34, h = arch ? 84 : 116, mid = y0 + h / 2, a = x.a, lift = a * (h / 2 - 6);
    let under = view(x, R4(x0, y0, w, h)), s = trim(x, x0, y0, w, h, arch ? false : false);
    if (arch) { const top = `M${x0} ${y0}A${w / 2} ${w / 2} 0 0 1 ${x0 + w} ${y0}Z`;
      s = trim(x, x0, y0 - w / 2, w, h + w / 2, true); under += `<g class="hda-bg"><g clip-path="${x.clip(top)}">${viewArt(x, [x0, y0 - w / 2, w, w / 2])}</g></g>`;
      s += glassFill(x).replace("<FILL", `<path d="${top}"`) + (x.grille !== "none" ? `<g clip-path="${x.clip(top)}">${[30, 60, 90, 120, 150].map((dg) => `<path d="M${x0 + w / 2} ${y0}l${f(Math.cos(dg * Math.PI / 180) * -w)} ${f(-Math.sin(dg * Math.PI / 180) * w)}" stroke="${H().shade(x.fc, .08)}" stroke-width="1.6"/>`).join("")}</g>` : "") +
        `<path d="${top}" fill="none" stroke="${x.fc}" stroke-width="4"/>`; }
    s += frameIn(x, R4(x0, y0, w, h), 4);
    const upperG = x.grille === "none" ? null : x.grille;
    s += sash(x, R4(x0 + 3, y0 + 3, w - 6, h / 2 - 1), single ? 4 : 5, upperG);
    s += screenOver(x, R4(x0 + 3, mid, w - 6, h / 2 - 3), "half");
    const lowerG = x.grille === "top" || x.grille === "none" ? null : x.grille;
    s += sash(x, R4(x0 + 3, mid - lift, w - 6, h / 2 - 3), 5, lowerG, `<rect x="${x0 + w / 2 - 7}" y="${f(mid - lift + h / 2 - 9)}" width="14" height="2.4" rx="1.2" fill="${H().shade(x.fc, -.35)}"/>`);
    s += screenOver(x, R4(x0 + 3, y0 + 3, w - 6, h / 2 - 1), "full");
    if (!a) s += lockAt(x, x0 + w / 2, mid, "cam");
    return [under, s];
  }
  S.dh = (x) => hung(x, false); S.sh = (x) => hung(x, true); S.arch = (x) => hung(x, false, true);
  S.casement = (x) => { const x0 = 64, w = 72, y0 = 34, h = 116, th = x.a * 1.25, pw = w * Math.cos(th), ext = Math.sin(th) * 12;
    let s = trim(x, x0, y0, w, h) + frameIn(x, R4(x0, y0, w, h), 4);
    const pts = [[x0 + 2, y0 + 2], [x0 + 2 + pw - 4, y0 + 2 - ext], [x0 + 2 + pw - 4, y0 + h - 2 + ext], [x0 + 2, y0 + h - 2]];
    s += sash(x, pts, 5, x.grille === "top" ? null : (x.grille === "none" ? null : x.grille));
    if (x.grille === "top") s += grilles(x, [[pts[0][0], pts[0][1]], [pts[1][0], pts[1][1]], [pts[1][0], y0 + h * .3], [pts[0][0], y0 + h * .3]], "colonial", null, 1);
    s += screenOver(x, R4(x0 + 3, y0 + 3, w - 6, h - 6), "half") + lockAt(x, x0 + w - 5, y0 + h / 2, "lever") + `<rect x="${x0 + w / 2 - 6}" y="${y0 + h - 4}" width="12" height="4" rx="1.4" fill="${H().shade(x.fc, -.4)}"/>`;
    if (x.a > 0) { const bx = x0 + 2 + (pw - 4) * .6, by = y0 + h - 2 + ext * .6; s += `<path d="M${x0 + 14} ${y0 + h - 2}L${f(bx)} ${f(by)}" stroke="#7a8088" stroke-width="2.2" stroke-linecap="round"/><circle cx="${x0 + 14}" cy="${y0 + h - 2}" r="2" fill="#5a6068"/>`; }
    return [view(x, R4(x0, y0, w, h)), s]; };
  S.awning = (x) => { const x0 = 46, w = 108, y0 = 58, h = 70, th = x.a * 1.0, ph = h * Math.cos(th), ext = Math.sin(th) * 10;
    let s = trim(x, x0, y0, w, h) + frameIn(x, R4(x0, y0, w, h), 4);
    s += sash(x, [[x0 + 2, y0 + 2], [x0 + w - 2, y0 + 2], [x0 + w - 2 + ext, y0 + ph - 2], [x0 + 2 - ext, y0 + ph - 2]], 5, x.grille === "none" ? null : x.grille);
    if (x.a > 0) s += `<path d="M${x0 + 8} ${y0 + 4}L${x0 + 8} ${f(y0 + ph - 6)}M${x0 + w - 8} ${y0 + 4}L${x0 + w - 8} ${f(y0 + ph - 6)}" stroke="#8a9098" stroke-width="1.4"/>`;
    s += screenOver(x, R4(x0 + 3, y0 + 3, w - 6, h - 6), "half") + lockAt(x, x0 + w / 2, y0 + h - 4, "cam");
    return [view(x, R4(x0, y0, w, h)), s]; };
  S.hopper = (x) => { const x0 = 42, w = 116, y0 = 98, h = 44, th = x.a * .9, ph = h * Math.cos(th), ext = Math.sin(th) * 8;
    let s = trim(x, x0, y0, w, h) + frameIn(x, R4(x0, y0, w, h), 4);
    s += sash(x, [[x0 + 2 + ext, y0 + h - ph + 2], [x0 + w - 2 - ext, y0 + h - ph + 2], [x0 + w - 2, y0 + h - 2], [x0 + 2, y0 + h - 2]], 5, x.grille === "none" ? null : x.grille);
    s += screenOver(x, R4(x0 + 3, y0 + 3, w - 6, h - 6), "half") + lockAt(x, x0 + w / 2, y0 + 5, "cam");
    return [view(x, R4(x0, y0, w, h)) + (x.inside ? "" : `<g class="hda-bg"><rect y="160" width="200" height="40" fill="#5a7a3a"/><rect y="158" width="200" height="4" fill="#8a8a82"/></g>`), s]; };
  S.slider = (x) => { const x0 = 34, w = 132, y0 = 52, h = 86, hw = w / 2, mv = x.a * (hw - 8);
    let s = trim(x, x0, y0, w, h) + frameIn(x, R4(x0, y0, w, h), 4);
    s += sash(x, R4(x0 + 3, y0 + 3, hw, h - 6), 5, x.grille === "none" ? null : x.grille);
    s += screenOver(x, R4(x0 + hw, y0 + 3, hw - 3, h - 6), "half");
    s += sash(x, R4(x0 + hw - 3 - mv, y0 + 3, hw, h - 6), 5, x.grille === "none" ? null : x.grille, `<rect x="${f(x0 + hw - mv + 2)}" y="${y0 + h / 2 - 6}" width="2.4" height="12" rx="1.2" fill="${H().shade(x.fc, -.35)}"/>`);
    if (!x.a) s += lockAt(x, x0 + hw + 1, y0 + h / 2, "lever");
    return [view(x, R4(x0, y0, w, h)), s]; };
  S.picture = (x) => { const x0 = 40, w = 120, y0 = 40, h = 106;
    return [view(x, R4(x0, y0, w, h)), trim(x, x0, y0, w, h) + frameIn(x, R4(x0, y0, w, h), 4) + sash(x, R4(x0 + 3, y0 + 3, w - 6, h - 6), 6, x.grille === "none" ? null : x.grille === "top" ? null : x.grille) + (x.grille === "top" ? grilles(x, R4(x0 + 3, y0 + 3, w - 6, h * .25), "colonial", 4, 1) : "")]; };
  S.tt = (x) => { const x0 = 62, w = 76, y0 = 36, h = 114, a = x.a, tilt = x.tt === "tilt";
    let s = trim(x, x0, y0, w, h) + frameIn(x, R4(x0, y0, w, h), 4), pts;
    const sgn = x.inside ? 1 : -1;
    if (tilt) { const gap = a * 16, ext = sgn * a * 7; pts = [[x0 + 2 - ext, y0 + 2 + gap], [x0 + w - 2 + ext, y0 + 2 + gap], [x0 + w - 2, y0 + h - 2], [x0 + 2, y0 + h - 2]];
      if (a > 0) s += `<path d="M${x0 + w - 3} ${y0 + 2}L${f(x0 + w - 2 + ext)} ${f(y0 + 2 + gap)}" stroke="#9aa1a9" stroke-width="1.4"/>`; }
    else { const th = a * 1.3, pw = w * Math.cos(th), ext = sgn * Math.sin(th) * 12; pts = [[x0 + 2, y0 + 2], [x0 + 2 + pw - 4, y0 + 2 - ext], [x0 + 2 + pw - 4, y0 + h - 2 + ext], [x0 + 2, y0 + h - 2]]; }
    s += sash(x, pts, 7, x.grille === "none" || x.grille === "top" ? null : x.grille);
    const hx = tilt || a === 0 ? x0 + w - 7 : pts[1][0] - 4; s += `<rect x="${f(hx - 1.6)}" y="${y0 + h / 2 - 5}" width="3.2" height="10" rx="1" fill="${H().shade(x.fc, -.4)}"/><path d="M${f(hx)} ${y0 + h / 2}l0 ${x.locked ? 9 : 0}${x.locked ? "" : "l0 0"}" stroke="${H().shade(x.fc, -.4)}" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="M${f(hx)} ${y0 + h / 2}l${tilt && a > 0 ? 0 : x.locked ? 0 : 7} ${tilt && a > 0 ? -9 : x.locked ? 9 : 0}" stroke="${H().shade(x.fc, -.4)}" stroke-width="2.4" stroke-linecap="round"/>` + (x.locked ? `<circle cx="${f(hx)}" cy="${y0 + h / 2 + 11}" r="1.3" fill="#34d399"/>` : "");
    s += screenOver(x, R4(x0 + 4, y0 + 4, w - 8, h - 8), "full");
    return [view(x, R4(x0, y0, w, h)), s]; };
  S.bay = (x) => { const a = x.a, top = 50, bot = 146;
    const L = [[34, top + 10], [68, top], [68, bot], [34, bot - 10]], C = [[68, top], [132, top], [132, bot], [68, bot]], Rr = [[132, top], [166, top + 10], [166, bot - 10], [132, bot]];
    let s = `<path d="M28 ${top + 4}L66 ${top - 8}H134L172 ${top + 4}V${top + 10}L132 ${top}H68L28 ${top + 10}Z" fill="${x.lg([[0, H().shade(x.tc, .1)], [1, H().shade(x.tc, -.2)]])}"/><path d="M28 ${bot - 4}L68 ${bot + 6}H132L172 ${bot - 4}V${bot + 4}L132 ${bot + 14}H68L28 ${bot + 4}Z" fill="${H().shade(x.tc, -.1)}"/>`;
    s += sash(x, C, 6, x.grille === "none" ? null : x.grille);
    [[L, 1], [Rr, -1]].forEach(([q, sd]) => { const mid = (q[0][1] + q[3][1]) / 2, lift = a * 30, yl = (t) => q[0][1] + (q[3][1] - q[0][1]) * t, yr = (t) => q[1][1] + (q[2][1] - q[1][1]) * t;
      s += sash(x, [[q[0][0], q[0][1]], [q[1][0], q[1][1]], [q[1][0], yr(.5)], [q[0][0], yl(.5)]], 4, x.grille === "none" ? null : x.grille);
      s += sash(x, [[q[0][0], yl(.5) - lift], [q[1][0], yr(.5) - lift], [q[1][0], yr(1)], [q[0][0], yl(1)]], 4, x.grille === "none" || x.grille === "top" ? null : x.grille); });
    return [view(x, L) + view(x, C) + view(x, Rr), s]; };
  S.bow = (x) => { const a = x.a, P4 = [[30, 52, 146], [65, 46, 150], [100, 46, 150], [135, 52, 146]], wd = 35;
    let s = `<path d="M24 50Q100 30 176 50V56Q100 38 24 56Z" fill="${H().shade(x.tc, .05)}"/><path d="M24 148Q100 160 176 148V156Q100 168 24 156Z" fill="${H().shade(x.tc, -.1)}"/>`, under = "";
    P4.forEach((p, i) => { const pts = R4(p[0], p[1], wd, p[2] - p[1]); under += view(x, pts);
      const outer = i === 0 || i === 3;
      if (outer && a > 0) { const th = a * 1.1, pw = wd * Math.cos(th), ext = Math.sin(th) * 8, hx = i === 0 ? p[0] : p[0] + wd, dir = i === 0 ? 1 : -1;
        s += sash(x, [[hx, p[1]], [hx + dir * pw, p[1] - ext], [hx + dir * pw, p[2] + ext], [hx, p[2]]], 4, x.grille === "none" ? null : x.grille); }
      else s += sash(x, pts, 4, x.grille === "none" ? null : x.grille); });
    return [under, s]; };
  S.garden = (x) => { const a = x.a;
    const front = [[56, 78], [144, 78], [144, 140], [56, 140]], topG = [[64, 60], [136, 60], [144, 78], [56, 78]], sideL = [[44, 66], [56, 78], [56, 140], [44, 132]], sideR = [[156, 66], [144, 78], [144, 140], [156, 132]];
    let s = `<path d="M36 52H164V148H36ZM44 66L64 60H136L156 66V132L144 140H56L44 132Z" fill-rule="evenodd" fill="${x.lg([[0, H().shade(x.tc, .2)], [1, H().shade(x.tc, -.2)]])}"/>` + `<path d="M38 140H162L168 150H32Z" fill="${H().shade(x.tc, .05)}"/><path d="M60 136H140" stroke="${H().shade(x.fc, -.2)}" stroke-width="3"/>`;
    s += sash(x, topG, 4, null) + sash(x, front, 5, x.grille === "none" ? null : x.grille) + sash(x, sideL, 4, null);
    if (a > 0) { const th = a * 1.1, pw = 12 * Math.cos(th); s += sash(x, [[144, 78], [144 + pw, 70 - a * 6], [144 + pw, 136 + a * 6], [144, 140]], 3, null); } else s += sash(x, sideR, 4, null);
    s += `<g><path d="M88 136h10l-1 -6h-8Z" fill="#b8643f"/><circle cx="91" cy="126" r="4" fill="#4d9c40"/><circle cx="95" cy="124" r="4" fill="#5aa84a"/><path d="M112 136h9l-1 -5h-7Z" fill="#c8b8a0"/><circle cx="116" cy="127" r="4" fill="#d84a7a"/></g>`;
    return [view(x, front) + view(x, topG) + view(x, sideL) + view(x, sideR), s]; };
  S.roof = (x) => { const a = x.a, pts = [[62, 44], [138, 44], [142, 150], [58, 150]];
    const clad = x.inside ? x.tc : "#4a4e56", cg = x.lg([[0, H().shade(clad, .25)], [1, H().shade(clad, -.25)]]);
    let s = `<path d="M50 34H150L156 162H44Z${poly(pts)}" fill-rule="evenodd" fill="${cg}"/>` + (x.inside ? "" : `<path d="M44 162H156L160 170H40Z" fill="#3a3d44"/><path d="M50 34H150" stroke="#fff" stroke-opacity=".25"/>`) + `<path d="${poly(pts)}" fill="none" stroke="${H().shade(x.fc, -.2)}" stroke-width="4"/>`;
    const e = a * 7, g = a * 18, sp = [[62 + e, 44 + g], [138 - e, 44 + g], [142 + e, 150 - g * .55], [58 - e, 150 - g * .55]];
    s += sash(x, sp, 7, x.grille === "none" ? null : x.grille);
    if (a > 0) s += `<path d="M60 97L${f(60 - e * .2)} 97M140 97L${f(140 + e * .2)} 97" stroke="#2a2e34" stroke-width="3"/>`;
    s += `<rect x="84" y="${f(46 + g)}" width="32" height="3.4" rx="1.7" fill="${H().shade(x.fc, -.4)}"/>` + lockAt(x, 100, 54 + g, "cam");
    return [view(x, pts), s]; };

  const STYLES = [["dh", "Double-hung"], ["sh", "Single-hung"], ["casement", "Casement (crank out)"], ["awning", "Awning"], ["slider", "Sliding"], ["picture", "Picture (fixed)"], ["bay", "Bay"], ["bow", "Bow"], ["garden", "Garden window"], ["tt", "Tilt-and-turn"], ["roof", "Skylight / roof window"], ["hopper", "Basement hopper"], ["arch", "Arched top"]];
  const OPTS = [
    { id: "style", name: "Style", values: STYLES },
    { id: "grille", name: "Grilles", values: [["none", "None"], ["colonial", "Colonial grid"], ["prairie", "Prairie"], ["top", "Top only"]] },
    { id: "glass", name: "Glass", values: [["clear", "Clear"], ["frosted", "Frosted"], ["tinted", "Tinted"]] },
    { id: "tt", name: "Opens as", values: [["tilt", "Tilt in"], ["turn", "Swing in"]], when: { opt: "style", is: ["tt"] } },
    { id: "screen", name: "Screen", values: [["none", "None"], ["half", "Half"], ["full", "Full"]], when: { opt: "style", is: ["dh", "sh", "arch", "slider", "casement", "awning", "hopper", "tt"] } },
    { id: "lock", name: "Lock", values: [["unlocked", "Unlocked"], ["locked", "Locked"]], when: { opt: "style", is: ["dh", "sh", "arch", "slider", "casement", "awning", "hopper", "tt", "roof"] } },
  ];
  const FRAME = ["#f4f3ef", "#e6dcc6", "#2a2a2c", "#5a4636", "#a8743c", "#6a3e2a"], TRIM = ["#f4f3ef", "#ece4cf", "#2a2a2c", "#8d939a", "#a8743c"];
  function render(o, wallKind, inside) {
    const x = X(o); x.inside = inside;
    const fn = S[x.style] || S.dh, parts = fn(x);
    const wk = x.style === "roof" ? (inside ? "roofin" : "roofout") : wallKind;
    const vig = x.rg([[0, "#000", 0], [.65, "#000", .06], [1, "#000", .45]], .5, .46, .75), c = `${o.uid}-card`;
    const wl = wall(x, wk);
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${c}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>${x.d.join("")}</defs>` +
      `<g clip-path="url(#${c})"><g class="hda-bg">${wl}<rect width="200" height="200" fill="${vig}"/></g>${parts[0]}${parts[1]}</g>` +
      `<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g></svg>`;
  }
  const card = (id, name, wallKind, inside, def) => ({ id, name, colors: FRAME, picker: true, colorLabel: "Frame", colors2: TRIM, picker2: true, colorLabel2: "Trim",
    options: OPTS.map((op) => op.id === "style" ? Object.assign({}, op, { values: [STYLES.find((v) => v[0] === def)].concat(STYLES.filter((v) => v[0] !== def)) }) : op),
    render: (o) => render(o, wallKind, inside) });
  const icons = [
    card("winsiding", "Window on siding", "siding", false, "dh"),
    card("winbrick", "Window in brick", "brick", false, "casement"),
    card("winstucco", "Window in stucco", "stucco", false, "slider"),
    card("wininside", "Window, inside view", "inside", true, "tt"),
  ];

  const css = `@media (prefers-reduced-motion:reduce){.hda-windowcfg-x{animation:none}}`;
  (window.HDA = window.HDA || []).push({
    id: "windowcfg", tab: "Window builder", group: "Security", kind: "device", onWord: "Open", offWord: "Closed", levelLabel: "Open",
    intro: "Windows for contact sensors: pick the style, grilles, glass, screen and lock, plus the frame and trim colors. On = open as far as the slider: sashes slide up, casements swing out, awnings tilt out, sliders slide and tilt-and-turn tilts in.",
    css, icons,
  });
})();
