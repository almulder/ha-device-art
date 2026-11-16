(function () {
  const P = "hda-relays-";
  const H = () => window.HDAH;
  const n1 = (v) => (+v).toFixed(1);
  const GREEN = "#3ee07a", RED = "#ff4f4f", AMB = "#ffb547", BLUE = "#4aa8ff", CYAN = "#7dd3fc", WHITE = "#f4f8ff";
  const BLK = ["#050608", "#25282d", "#6f757d"], WHT = ["#7d8187", "#e4e6e8", "#ffffff"], REDW = ["#4a0909", "#c62828", "#ff9a90"],
    BLUW = ["#0a2350", "#1f5bc6", "#9cc2ff"], ORGW = ["#5a2604", "#e06a10", "#ffc690"], YELW = ["#5a4c04", "#d9b812", "#fff29a"],
    GRYW = ["#25282c", "#7b8087", "#c9cdd2"], GRNW = ["#0a3a12", "#2e9a3e", "#a6e8b0"], CU = ["#5a2a10", "#c27a45", "#ffd2ae"];
  const CHW = [REDW, BLUW, ORGW, YELW, REDW, BLUW, ORGW, YELW];

  function pal(c) {
    const h = H(), x = h.hx(c), lt = (x[0] * .3 + x[1] * .59 + x[2] * .11) / 255 > .62;
    return { l: h.shade(c, lt ? .5 : .3), m: c, d: h.shade(c, lt ? -.14 : -.3), k: h.shade(c, lt ? -.32 : -.55), lt };
  }
  const st = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("");
  const lg = (id, v, a) => `<linearGradient id="${id}" ${v ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" x2="1"'}>${st(a)}</linearGradient>`;
  const rg = (id, a, at) => `<radialGradient id="${id}" ${at || ""}>${st(a)}</radialGradient>`;
  const halo = (id, c) => rg(id, [[0, c, .9], [.4, c, .3], [1, c, 0]]);

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
${lg(u + "-v", 1, [[0, p.l], [.45, p.m], [1, p.d]])}${lg(u + "-t", 1, [[0, H().shade(p.l, .15)], [1, p.l]])}${lg(u + "-s", 0, [[0, p.d], [1, p.k]])}
${lg(u + "-fx", 0, [[0, "#fff", .18], [.12, "#fff", 0], [.86, "#000", 0], [1, "#000", .28]])}
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1">${st([[0, "#fff", .45], [.4, "#fff", 0]])}</linearGradient>
${lg(u + "-wall", 1, [[0, "#fff", .085], [1, "#fff", .035]])}${lg(u + "-flr", 1, [[0, "#a3a8ae", .3], [1, "#5d6369", .16]])}
${lg(u + "-mt", 1, [[0, "#f2f4f6"], [.45, "#a9b0b7"], [.55, "#7d848c"], [1, "#d9dde1"]])}${lg(u + "-mth", 0, [[0, "#545a61"], [.35, "#eef0f2"], [.65, "#b9bfc6"], [1, "#454b52"]])}
${lg(u + "-bk", 1, [[0, "#3e434a"], [.5, "#1b1e23"], [1, "#08090c"]])}${lg(u + "-gang", 1, [[0, "#3f74c4"], [1, "#1d4a8e"]])}
${lg(u + "-cav", 1, [[0, "#05070a"], [1, "#141a22"]])}${lg(u + "-rel", 1, [[0, "#4f8cf0"], [.5, "#1f5fd0"], [1, "#123c8c"]])}
${lg(u + "-term", 1, [[0, "#3d8af0"], [1, "#163f9a"]])}${lg(u + "-grn", 1, [[0, "#43b866"], [1, "#1f6e38"]])}
${lg(u + "-lcd", 1, [[0, "#081014"], [1, "#16242b"]])}${lg(u + "-encl", 1, [[0, "#4a5058"], [1, "#2a2e34"]])}
${lg(u + "-duct", 1, [[0, "#9aa0a7"], [.5, "#c9cdd2"], [1, "#7d838a"]])}${lg(u + "-pnl", 1, [[0, "#9aa1a9"], [1, "#6d747c"]])}
${rg(u + "-sh", [[0, "#000", .6], [1, "#000", 0]])}
${rg(u + "-dome", [[0, "#fff", .7], [.5, "#fff", .1], [1, "#000", .2]], 'cx=".35" cy=".3" r=".8"')}
${halo(u + "-hg", GREEN)}${halo(u + "-hr", RED)}${halo(u + "-ha", AMB)}${halo(u + "-hb", BLUE)}${halo(u + "-hc", CYAN)}${halo(u + "-hw", WHITE)}
${rg(u + "-bulb", [[0, "#fffbe8"], [.35, "#ffe9a8", .95], [1, "#ffb84a", 0]])}${halo(u + "-hl", o.color)}
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, `<clipPath id="${o.uid}-all"><rect width="200" height="200" rx="6"/></clipPath>` + (extra || ""))}<g clip-path="url(#${o.uid}-all)">${body}</g></svg>`;
  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry || 5)}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${r} ${r} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${r} ${r} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${r} ${r} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${r} ${r} 0 0 1 ${n1(x + r)} ${n1(y)}Z`; };
  const txt = (x, y, s, size, col, anchor, wt) => `<text x="${n1(x)}" y="${n1(y)}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${wt || 700}" fill="${col}" text-anchor="${anchor || "middle"}">${s}</text>`;
  const screw = (x, y, r) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" fill="#5b6168"/><circle cx="${n1(x - r * .15)}" cy="${n1(y - r * .15)}" r="${n1(r * .82)}" fill="#c3c8ce"/><path d="M${n1(x - r * .6)} ${n1(y + r * .25)}L${n1(x + r * .6)} ${n1(y - r * .25)}" stroke="#3a3f46" stroke-width="${n1(r * .34)}"/>`;

  const tube = (d, w, c) => `<path d="${d}" fill="none" stroke="${c[0]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${c[1]}" stroke-width="${n1(w * .66)}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${c[2]}" stroke-opacity=".6" stroke-width="${n1(w * .2)}" stroke-linejoin="round" transform="translate(${n1(-w * .15)} ${n1(-w * .15)})"/>`;
  const flow = (o, d, on, w, op, rev) => on ? `<path class="${P}flow${rev ? " " + P + "rev" : ""}" d="${d}" fill="none" stroke="#fff3b0" stroke-opacity="${n1(op == null ? .9 : op)}" stroke-width="${n1(w || 1.6)}" stroke-linecap="round" stroke-dasharray="2 6"/>` : "";
  const wire = (o, d, w, c, on, op, rev) => tube(d, w, c) + flow(o, d, on, w * .42, op, rev);
  const led = (o, x, y, r, on, col, hid, cls) => `<g${cls && on ? ` class="${P}${cls}"` : ""}>` + (on ? `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 4.2)}" fill="url(#${o.uid}-${hid})"/>` : "") +
    `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" fill="${on ? col : "#30353c"}" stroke="#000" stroke-opacity=".35" stroke-width=".4"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .35)}" r="${n1(r * .38)}" fill="#fff" opacity="${on ? .85 : .25}"/></g>`;
  const contact = (x, y, w, closed, col, on) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="1.5" fill="${col}"/><circle cx="${n1(x + w)}" cy="${n1(y)}" r="1.5" fill="${on || col}"/>` +
    `<path d="M${n1(x)} ${n1(y)}L${closed ? n1(x + w) + " " + n1(y) : n1(x + w * .88) + " " + n1(y - w * .42)}" stroke="${closed ? on || col : col}" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path d="M${n1(x - 5)} ${n1(y)}H${n1(x)}M${n1(x + w)} ${n1(y)}H${n1(x + w + 5)}" stroke="${col}" stroke-width="1.2"/>`;
  function box3d(o, x, y, w, h, d, r, g) {
    const u = o.uid;
    return `<path d="M${n1(x + 2)} ${n1(y)}L${n1(x + d + 2)} ${n1(y - d)}H${n1(x + w + d - 2)}L${n1(x + w - 2)} ${n1(y)}Z" fill="url(#${u}-${g ? g + "t" : "t"})"/>` +
      `<path d="M${n1(x + w)} ${n1(y + 2)}L${n1(x + w + d)} ${n1(y - d + 2)}V${n1(y + h - d - 2)}L${n1(x + w)} ${n1(y + h - 2)}Z" fill="url(#${u}-${g ? g + "s" : "s"})"/>` +
      `<path d="${rr(x, y, w, h, r || 3)}" fill="url(#${u}-${g || "v"})"/><path d="${rr(x, y, w, h, r || 3)}" fill="url(#${u}-fx)"/><path d="${rr(x, y, w, h, r || 3)}" fill="url(#${u}-g)" opacity=".35"/>` +
      `<path d="M${n1(x + 3)} ${n1(y + .6)}H${n1(x + w - 3)}" stroke="#fff" stroke-opacity=".35"/>`;
  }
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgecd", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", " ": "" };
  function digits(str, x, y, s, col, dim) {
    const w = s * .52, t = Math.max(.7, s * .14); let out = "", X = x;
    String(str).split("").forEach((ch) => {
      if (ch === ".") { out += `<circle cx="${n1(X - t * .4)}" cy="${n1(y + s)}" r="${n1(t * .55)}" fill="${col}"/>`; X += t * .9; return; }
      const sg = { a: [X + t * .6, y, X + w - t * .6, y], b: [X + w, y + t * .6, X + w, y + s / 2 - t * .5], c: [X + w, y + s / 2 + t * .5, X + w, y + s - t * .6],
        d: [X + t * .6, y + s, X + w - t * .6, y + s], e: [X, y + s / 2 + t * .5, X, y + s - t * .6], f: [X, y + t * .6, X, y + s / 2 - t * .5], g: [X + t * .6, y + s / 2, X + w - t * .6, y + s / 2] };
      const on = SEG[ch] || "";
      for (const k in sg) { const q = sg[k], lit = on.indexOf(k) >= 0; if (!lit && !dim) continue;
        out += `<path d="M${n1(q[0])} ${n1(q[1])}L${n1(q[2])} ${n1(q[3])}" stroke="${lit ? col : dim}" stroke-width="${n1(t)}" stroke-linecap="round"/>`; }
      X += w + t * 2.2;
    });
    return out;
  }
  const ch = (o, i) => o.parts && o.parts["c" + i] != null ? !!o.parts["c" + i] : o.on;
  const opt = (o, k, d) => (o.opt && o.opt[k]) || d;
  const parts = (n, key, when) => Array.from({ length: n }, (_, i) => {
    const p = { id: "c" + (i + 1), name: "Ch " + (i + 1) }; const w = when(i + 1); if (w) p.when = { opt: key, is: w }; return p; });

  const wallBg = (o, fy) => `<rect width="200" height="200" fill="url(#${o.uid}-wall)"/>` + (fy ? `<path d="M0 ${fy}H200V200H0Z" fill="url(#${o.uid}-flr)"/><path d="M0 ${fy}H200" stroke="#000" stroke-opacity=".3"/>` : "");
  const gangBox = (o, x, y, w, h) => BG(wallBg(o) + `<path d="${rr(x - 6, y - 6, w + 12, h + 12, 6)}" fill="#000" opacity=".25"/><path d="${rr(x, y, w, h, 5)}" fill="url(#${o.uid}-gang)"/>` +
    `<path d="${rr(x + 6, y + 6, w - 12, h - 12, 3)}" fill="url(#${o.uid}-cav)"/><path d="M${x + 7} ${y + 7}H${x + w - 7}" stroke="#000" stroke-opacity=".6" stroke-width="2"/>` +
    screw(x + w / 2, y + 3.4, 2) + screw(x + w / 2, y + h - 3.4, 2) + `<path d="M${x + 1} ${y + 1}H${x + w - 1}" stroke="#fff" stroke-opacity=".25"/>`);
  const rail = (o, y, x1, x2) => `<rect x="${x1}" y="${y - 9}" width="${x2 - x1}" height="18" fill="#1a1d21" opacity=".5"/><rect x="${x1}" y="${y - 7}" width="${x2 - x1}" height="14" fill="url(#${o.uid}-mt)"/>` +
    `<path d="M${x1} ${y - 4}H${x2}M${x1} ${y + 4}H${x2}" stroke="#000" stroke-opacity=".25"/>` +
    Array.from({ length: Math.floor((x2 - x1) / 16) }, (_, i) => `<path d="${rr(x1 + 5 + i * 16, y - 1.6, 8, 3.2, 1.6)}" fill="#2a2e33"/>`).join("");
  const duct = (o, y, h) => `<rect x="8" y="${y}" width="184" height="${h}" rx="1.5" fill="url(#${o.uid}-duct)"/>` +
    Array.from({ length: 23 }, (_, i) => `<rect x="${12 + i * 8}" y="${y + (y < 100 ? h - 7 : 0)}" width="3" height="7" fill="#3a3f45" opacity=".75"/>`).join("") + `<path d="M8 ${y + .6}H192" stroke="#fff" stroke-opacity=".4"/>`;
  const enclosure = (o) => BG(`<rect width="200" height="200" fill="url(#${o.uid}-encl)"/><rect x="4" y="4" width="192" height="192" rx="4" fill="#d6d9dc" opacity=".12"/>` + duct(o, 6, 22) + duct(o, 172, 22));

  const TYPES = [["relay", "Relay"], ["dimmer", "Dimmer"], ["dry", "Dry contact"], ["pilot", "Pilot wire"]];
  const PILOT = [["comfort", "Comfort"], ["eco", "Eco"], ["frost", "Frost guard"], ["off", "Off"]];
  function inwall(o) {
    const u = o.uid, p = pal(o.color), ty = opt(o, "type", "relay"), n = ty === "pilot" ? 1 : +opt(o, "ch", "1");
    const x = 48, y = 92, w = 98, h = 72, d = 12, pc = p.lt ? "#2b3036" : "#dfe3e8";
    const on = (i) => ch(o, i), any = Array.from({ length: n }, (_, i) => on(i + 1)).some(Boolean);
    let T = [];
    if (ty === "dry") { T.push(["+", REDW, any], ["-", BLK, any]); for (let i = 1; i <= n; i++) T.push(["C" + i, GRYW, on(i)], ["NO", CHW[i - 1], on(i)]); }
    else if (ty === "pilot") T = [["L", BLK, any], ["N", WHT, any], ["PW", BLK.map((c, k) => k ? ["#000", "#3a3f46", "#8d939b"][k] : c), any]];
    else { T = [["L", BLK, any], ["N", WHT, any]]; for (let i = 1; i <= n; i++) T.push(["O" + i, CHW[i - 1], on(i)]); }
    const dimOp = ty === "dimmer" ? .3 + .7 * o.level : .9;
    let s = gangBox(o, 28, 22, 150, 160) + sh(o, x + w / 2 + 8, y + h + 3, w * .58, 6) + box3d(o, x, y, w, h, d, 5);
    const tw = (w - 10) / T.length, top = (i) => [x + d * .5 + 6 + (i + .5) * tw, y - d * .5];
    if (ty === "dry") s += `<path d="M${x + 6} ${y - 1.5}L${x + 6 + d - 2} ${y - d + .5}H${x + w + d - 6}L${x + w - 4} ${y - 1.5}Z" fill="url(#${u}-grn)" stroke="#0d3a1a" stroke-width=".6"/>`;
    T.forEach((t, i) => { const q = top(i); s += `<path d="${rr(q[0] - tw * .38, q[1] - 3.4, tw * .76, 6.8, 1.5)}" fill="#000" opacity=".45"/>` + screw(q[0], q[1], Math.min(2.6, tw * .3)); });
    s += `<path d="${rr(x + 7, y + 7, w - 14, h - 28, 3)}" fill="${p.lt ? "#000" : "#fff"}" fill-opacity=".06" stroke="${pc}" stroke-opacity=".35" stroke-width=".6"/>`;
    const fx = x + 7, fy = y + 7, fw = w - 14, fh = h - 28;
    if (ty === "pilot") {
      const m = o.on ? opt(o, "pmode", "comfort") : "off", cols = { comfort: RED, eco: GREEN, frost: CYAN, off: "#b8bec6" }, hid = { comfort: "hr", eco: "hg", frost: "hc", off: "hw" };
      PILOT.forEach((pm, i) => { const cx = fx + 12 + i * (fw - 24) / 3, lit = pm[0] === m;
        s += led(o, cx, fy + 14, 2.6, lit, cols[pm[0]], hid[pm[0]]) + txt(cx, fy + 30, pm[1][0], 8, pc); });
      s += `<path d="M${fx + 8} ${fy + 36}H${fx + fw - 8}" stroke="${pc}" stroke-opacity=".3"/>`;
    } else {
      const cols = n === 1 ? 1 : 2, rows = n === 4 ? 2 : 1, cw = fw / cols, chh = fh / rows;
      for (let i = 0; i < n; i++) {
        const cx = fx + (i % cols + .5) * cw, cy = fy + (Math.floor(i / cols) + .5) * chh, lit = on(i + 1), sw = Math.min(cw * .42, 20);
        if (ty === "dimmer") {
          const bw = Math.min(cw * .7, 34);
          s += `<path d="M${n1(cx - bw / 2)} ${n1(cy - 2)}q${n1(bw / 8)} -7 ${n1(bw / 4)} 0t${n1(bw / 4)} 0t${n1(bw / 4)} 0t${n1(bw / 4)} 0" fill="none" stroke="${lit ? AMB : pc}" stroke-width="1.4"/>` +
            `<path d="${rr(cx - bw / 2, cy + 4, bw, 3.4, 1.7)}" fill="${pc}" fill-opacity=".25"/>` + (lit ? `<path d="${rr(cx - bw / 2, cy + 4, Math.max(3.4, bw * o.level), 3.4, 1.7)}" fill="${AMB}"/>` : "");
        } else s += contact(cx - sw / 2, cy + 2, sw, lit, pc, lit ? GREEN : null);
        if (n > 1) s += txt(cx - (ty === "dimmer" ? Math.min(cw * .35, 17) + 4 : sw / 2 + 7), cy - 3, i + 1, 6, pc);
      }
    }
    for (let i = 0; i < n; i++) s += led(o, x + 13 + i * 11, y + h - 11, 2.1, on(i + 1), ty === "dimmer" ? AMB : GREEN, ty === "dimmer" ? "ha" : "hg");
    s += led(o, x + w - 28, y + h - 11, 1.8, true, BLUE, "hb", "blink") + `<circle cx="${x + w - 13}" cy="${y + h - 11}" r="4.4" fill="${p.d}" stroke="#000" stroke-opacity=".4"/><circle cx="${x + w - 13.6}" cy="${y + h - 11.6}" r="3" fill="${p.l}" opacity=".6"/>`;
    s += `<path d="M${x + w - 18} ${y + 14}a5 5 0 0 1 7 0M${x + w - 20} ${y + 11}a8 8 0 0 1 11 0" fill="none" stroke="${pc}" stroke-opacity=".5" stroke-width="1"/>`;
    T.forEach((t, i) => { const q = top(i), ex = 40 + (i + .5) * 120 / T.length, dd = `M${n1(q[0])} ${n1(q[1] - 1)}C${n1(q[0])} ${n1(q[1] - 26)} ${n1(ex)} 46 ${n1(ex)} -6`;
      const fop = t[0].startsWith("O") ? dimOp : .9;
      s += wire(o, dd, 4.4, t[1], t[2], fop, t[0] === "N" || t[0] === "-") + `<path d="${rr(q[0] - 2.6, q[1] - 5.5, 5.2, 4, 1)}" fill="${t[1][1]}"/>`; });
    T.forEach((t, i) => { const q = top(i); s += txt(x + d * .5 + 6 + (i + .5) * tw - d * .5, y + 6.2, t[0], 4.6, pc, "middle", 600); });
    return svg(o, s);
  }

  function leads(o) {
    const u = o.uid, p = pal(o.color), dim = opt(o, "type", "relay") === "dimmer", lv = dim ? o.level : 1;
    const x = 58, y = 104, w = 78, h = 50, d = 10;
    let s = gangBox(o, 22, 18, 156, 168) + sh(o, x + w / 2 + 6, y + h + 3, w * .56, 5);
    const bx = 150, by = 44;
    s += (o.on ? `<circle cx="${bx}" cy="${by}" r="${n1(26 + 14 * lv)}" fill="url(#${u}-bulb)" opacity="${n1(.35 + .6 * lv)}"/>` : "") +
      `<path d="M${bx - 9} ${by + 4}C${bx - 13} ${by - 4} ${bx - 11} ${by - 16} ${bx} ${by - 17}C${bx + 11} ${by - 16} ${bx + 13} ${by - 4} ${bx + 9} ${by + 4}L${bx + 6} ${by + 11}H${bx - 6}Z" fill="${o.on ? H().mix("#fff4d0", "#ffd27a", 1 - lv) : "#d9dde2"}" fill-opacity="${o.on ? .95 : .35}" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/>` +
      `<path d="M${bx - 3} ${by + 6}V${by - 4}l3 -3 3 3V${by + 6}" fill="none" stroke="${o.on ? "#fff7d6" : "#7d838a"}" stroke-width="${o.on ? 1.3 : .8}"/>` +
      `<path d="${rr(bx - 6, by + 11, 12, 10, 2)}" fill="url(#${u}-mth)"/><path d="M${bx - 6} ${by + 14}H${bx + 6}M${bx - 6} ${by + 17}H${bx + 6}" stroke="#454b52" stroke-width=".7"/>` +
      `<path d="${rr(bx - 7, by + 21, 14, 7, 2)}" fill="url(#${u}-bk)"/>`;
    s += box3d(o, x, y, w, h, d, 4);
    s += `<path d="${rr(x + 6, y + 6, 46, h - 12, 2)}" fill="#ebebe5"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M${x + 10} ${y + 12 + i * 6}H${x + (i % 2 ? 40 : 46)}" stroke="#555b62" stroke-width="1.6" stroke-opacity=".55"/>`).join("") +
      `<rect x="${x + 40}" y="${y + 28}" width="9" height="9" fill="none" stroke="#3b4046" stroke-width="1.2"/><rect x="${x + 42.5}" y="${y + 30.5}" width="4" height="4" fill="#3b4046"/>` +
      led(o, x + 64, y + 16, 2.2, o.on, dim ? AMB : GREEN, dim ? "ha" : "hg") + `<circle cx="${x + 64}" cy="${y + 33}" r="4" fill="#000" opacity=".5"/><circle cx="${x + 64}" cy="${y + 33}" r="2.4" fill="${p.l}" opacity=".5"/>`;
    const L = [[BLK, 30, 24, o.on, false], [WHT, 46, 14, o.on, true], [BLUW, 64, 10, false, false], [REDW, 0, 0, o.on, false]];
    L.forEach((l, i) => { const sx = x + d * .5 + 16 + i * 14, sy = y - d * .5;
      if (i === 3) { const dd = `M${sx} ${sy}C${sx + 4} ${sy - 30} ${bx} ${by + 60} ${bx} ${by + 28}`; s += wire(o, dd, 4.2, l[0], l[3], n1(.3 + .6 * lv)); }
      else { const dd = `M${sx} ${sy}C${sx} ${sy - 30} ${l[1] + 10} ${l[2] + 34} ${l[1]} ${l[2]}`;
        s += wire(o, dd, 4.2, l[0], l[3], .9, l[4]) + `<path d="M${l[1]} ${l[2]}l-3 -6" stroke="url(#${u}-mth)" stroke-width="2"/><path d="M${l[1]} ${l[2]}l-3 -6" stroke="${CU[1]}" stroke-width="1.6" stroke-linecap="round"/>`; }
      s += `<ellipse cx="${sx}" cy="${sy}" rx="3.2" ry="1.6" fill="#000" opacity=".5"/>`; });
    return svg(o, s);
  }

  const RADIO = [["wifi", "Wi-Fi"], ["zigbee", "Zigbee"], ["zwave", "Z-Wave"]];
  function minibox(o) {
    const u = o.uid, p = pal(o.color), n = +opt(o, "ch", "1"), rad = opt(o, "radio", "wifi"), rc = { wifi: BLUE, zigbee: AMB, zwave: GREEN }[rad], rh = { wifi: "hb", zigbee: "ha", zwave: "hg" }[rad];
    const x = 42, y = 90, w = 116, h = 56, d = 10, pc = p.lt ? "#2b3036" : "#dfe3e8", any = ch(o, 1) || (n > 1 && ch(o, 2));
    let s = gangBox(o, 18, 30, 164, 150) + sh(o, x + w / 2 + 6, y + h + 3, w * .56, 6) + box3d(o, x, y, w, h, d, 9);
    const IN = [["L", BLK, any, 0], ["N", WHT, any, 1]], OUT = [];
    for (let i = 1; i <= n; i++) OUT.push(["O" + i, CHW[i - 1], ch(o, i), i - 1]);
    const tp = (k, right) => [right ? x + w - 10 - k * 12 + d * .5 : x + 12 + k * 12 + d * .5, y - d * .5];
    IN.forEach((t) => { const q = tp(t[3]); s += screw(q[0], q[1], 2.4); });
    OUT.forEach((t) => { const q = tp(t[3], true); s += screw(q[0], q[1], 2.4); });
    const cx = 100, cy = y + 26;
    s += `<circle cx="${cx}" cy="${cy}" r="13" fill="#000" opacity=".22"/>` + (any ? `<circle cx="${cx}" cy="${cy}" r="24" fill="url(#${u}-${rh})" opacity=".8"/>` : "") +
      `<circle cx="${cx}" cy="${cy}" r="11" fill="none" stroke="${any ? rc : "#5c626a"}" stroke-width="2.2" opacity="${any ? 1 : .6}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="8.6" fill="url(#${u}-v)"/><circle cx="${cx}" cy="${cy}" r="8.6" fill="url(#${u}-dome)"/>` +
      `<path d="M${cx} ${cy - 4.5}V${cy - .5}M${cx - 3.4} ${cy - 3}a4.6 4.6 0 1 0 6.8 0" fill="none" stroke="${pc}" stroke-width="1.3" stroke-linecap="round"/>`;
    for (let i = 1; i <= n; i++) s += led(o, x + 14 + (i - 1) * 10, y + h - 10, 1.9, ch(o, i), GREEN, "hg") + txt(x + 14 + (i - 1) * 10, y + h - 15, i, 4.6, pc);
    s += led(o, x + w - 14, y + h - 10, 1.7, true, rc, rh, "blink") + `<path d="M${x + w - 24} ${y + 12}a6 6 0 0 1 8 0M${x + w - 26} ${y + 9}a9 9 0 0 1 12 0" fill="none" stroke="${pc}" stroke-opacity=".45" stroke-width="1"/>`;
    IN.forEach((t) => { const q = tp(t[3]), dd = `M${n1(q[0])} ${n1(q[1])}C${n1(q[0])} ${n1(q[1] - 26)} 30 ${52 + t[3] * 8} -4 ${52 + t[3] * 10}`; s += wire(o, dd, 4.4, t[1], t[2], .9, t[0] === "N"); });
    OUT.forEach((t) => { const q = tp(t[3], true), dd = `M${n1(q[0])} ${n1(q[1])}C${n1(q[0])} ${n1(q[1] - 26)} 170 ${52 + t[3] * 8} 204 ${52 + t[3] * 10}`; s += wire(o, dd, 4.4, t[1], t[2]); });
    return svg(o, s);
  }

  function board(o) {
    const u = o.uid, p = pal(o.color), n = +opt(o, "ch", "4"), cols = Math.min(n, 4), rows = n > 4 ? 2 : 1;
    const cw = 34, bw = cols * cw + 34, bh = rows * 50 + 30, bx = 100 - bw / 2 + 6, by = 100 - bh / 2;
    let s = BG(`<rect width="200" height="200" fill="#1c2026"/><rect width="200" height="200" fill="url(#${u}-wall)"/>` +
      [[bx + 4, by + 4], [bx + bw - 4, by + 4], [bx + 4, by + bh - 4], [bx + bw - 4, by + bh - 4]].map((q) => `<circle cx="${q[0] + 2}" cy="${q[1] + 3}" r="5" fill="#000" opacity=".4"/>`).join(""));
    s += sh(o, 100 + 6, by + bh + 4, bw * .55, 6) + `<path d="${rr(bx, by, bw, bh, 4)}" fill="${p.d}"/><path d="${rr(bx, by, bw, bh - 2, 4)}" fill="${p.m}"/><path d="${rr(bx, by, bw, bh, 4)}" fill="url(#${u}-g)" opacity=".25"/>`;
    [[bx + 4, by + 4], [bx + bw - 4, by + 4], [bx + 4, by + bh - 4], [bx + bw - 4, by + bh - 4]].forEach((q) => { s += `<circle cx="${q[0]}" cy="${q[1]}" r="2.6" fill="#d9c27a"/><circle cx="${q[0]}" cy="${q[1]}" r="1.4" fill="#1a1d21"/>`; });
    s += `<path d="${rr(bx + 3, by + bh / 2 - 16, 8, 32, 1)}" fill="#15171a"/>` + [0, 1, 2, 3].map((i) => `<rect x="${bx + 5.6}" y="${by + bh / 2 - 13 + i * 7.4}" width="2.8" height="2.8" fill="#e6c76a"/>`).join("") +
      `<path d="M${bx + 12} ${by + 10}H${bx + bw - 10}M${bx + 12} ${by + bh - 10}H${bx + bw - 10}" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>`;
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols), c = i % cols, cx = bx + 26 + c * cw, cy = by + 30 + r * 50, lit = ch(o, i + 1), toTop = rows === 2 && r === 0;
      const ty = toTop ? by + 6 : by + bh - 6, ex = cx, dd = toTop ? `M${ex} ${ty}V-6` : `M${ex} ${ty}V206`;
      s += wire(o, dd, 3.6, CHW[i], lit) + `<path d="${rr(cx - 8, ty - 5, 16, 10, 1.5)}" fill="url(#${u}-term)"/>` + screw(cx - 3.6, ty, 1.9) + screw(cx + 3.6, ty, 1.9);
      s += `<path d="M${cx - 12} ${cy - 13}l4 -4h24l-4 4z" fill="#5f97f4"/><path d="M${cx + 12} ${cy - 13}l4 -4v22l-4 4z" fill="#123c8c"/><path d="${rr(cx - 12, cy - 13, 24, 26, 1.5)}" fill="url(#${u}-rel)"/>` +
        `<path d="${rr(cx - 9, cy - 9, 18, 13, 1.5)}" fill="#0b1830" stroke="#9cc2ff" stroke-opacity=".4" stroke-width=".6"/>` + contact(cx - 5, cy + 1, 10, lit, "#c8cdd4", lit ? "#ffe27a" : null) +
        `<path d="M${cx - 6} ${cy - 5}h12" stroke="#d07a3a" stroke-width="2.2" opacity=".85"/>` + `<path d="M${cx - 10} ${cy + 7}h20" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>` +
        led(o, cx + 12, cy + (toTop ? 16 : -18), 1.7, lit, RED, "hr") + txt(cx - 12, cy + (toTop ? 21 : -16), i + 1, 5, "#f2f4f6");
    }
    return svg(o, s);
  }

  function dinBody(o, x, w, nt, nb, topOn, botOn, cols) {
    const u = o.uid, p = pal(o.color), y = 48, h = 104;
    let s = sh(o, x + w / 2 + 4, y + h + 2, w * .55, 4) + `<path d="${rr(x, y, w, h, 2.5)}" fill="url(#${u}-v)"/>` +
      `<path d="${rr(x, y, w, 26, 2.5)}" fill="#000" opacity=".16"/><path d="${rr(x, y + h - 26, w, 26, 2.5)}" fill="#000" opacity=".16"/>` +
      `<rect x="${x + 2}" y="${y + 26}" width="${w - 4}" height="${h - 52}" fill="url(#${u}-t)"/><rect x="${x + 2}" y="${y + 26}" width="${w - 4}" height="${h - 52}" fill="url(#${u}-fx)"/>` +
      `<path d="M${x + 2} ${y + 26}H${x + w - 2}" stroke="#fff" stroke-opacity=".5"/><path d="M${x + 2} ${y + h - 26}H${x + w - 2}" stroke="#000" stroke-opacity=".35"/>` +
      `<path d="${rr(x, y, w, h, 2.5)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>` + (w > 30 ? [1, 2, 3, 4, 5, 6, 7].filter((k) => k * 22 < w - 6).map((k) => `<path d="M${x + k * 22} ${y + 2}V${y + 24}M${x + k * 22} ${y + h - 24}V${y + h - 2}" stroke="#000" stroke-opacity=".12"/>`).join("") : "");
    const tx = (k, N) => x + (k + .5) * w / N, cl = cols || [];
    for (let k = 0; k < nt; k++) { const X = tx(k, nt); s += wire(o, `M${n1(X)} ${y + 2}V22`, 3.6, cl[k] || (k % 2 ? BLUW : BLK), topOn[k], .9, k % 2 === 1 && !cols) + `<rect x="${n1(X - 3.4)}" y="${y}" width="6.8" height="4" fill="#0b0d10"/>` + screw(X, y + 14, 3.1); }
    for (let k = 0; k < nb; k++) { const X = tx(k, nb); s += wire(o, `M${n1(X)} ${y + h - 2}V178`, 3.6, CHW[k] || REDW, botOn[k]) + `<rect x="${n1(X - 3.4)}" y="${y + h - 4}" width="6.8" height="4" fill="#0b0d10"/>` + screw(X, y + h - 14, 3.1); }
    return s;
  }
  const lever = (o, cx, cy, on, col) => `<path d="${rr(cx - 3.6, cy - 10, 7.2, 20, 2)}" fill="#0d0f12"/><path d="${rr(cx - 3, on ? cy - 9.5 : cy + 1, 6, 8.5, 1.5)}" fill="${col || "#e9ecef"}"/><path d="M${cx - 2} ${on ? cy - 8 : cy + 2.5}h4" stroke="#fff" stroke-opacity=".7"/>`;
  function handle(o, cx, cy, ww, on, col, tie) {
    const hh = 30, hy = on ? cy - hh / 2 + 1 : cy + 1;
    return `<path d="${rr(cx - ww / 2 - 1, cy - hh / 2, ww + 2, hh, 2)}" fill="#0b0d10"/>` +
      `<path d="${rr(cx - ww / 2, hy, ww, hh / 2 - 2, 2)}" fill="${col}"/><path d="${rr(cx - ww / 2, hy, ww, hh / 2 - 2, 2)}" fill="url(#${o.uid}-fx)"/>` +
      `<path d="M${n1(cx - ww / 2 + 2)} ${n1(hy + 4)}H${n1(cx + ww / 2 - 2)}M${n1(cx - ww / 2 + 2)} ${n1(hy + 7)}H${n1(cx + ww / 2 - 2)}" stroke="#000" stroke-opacity=".3"/>` +
      `<path d="M${n1(cx - ww / 2 + 1)} ${n1(on ? hy + .6 : hy + hh / 2 - 2.6)}H${n1(cx + ww / 2 - 1)}" stroke="#fff" stroke-opacity=".45"/>` + (tie ? "" : "");
  }
  const flag = (cx, cy, w, on) => `<path d="${rr(cx - w / 2, cy - 3, w, 6, 1)}" fill="#0b0d10"/><rect x="${n1(cx - w / 2 + 1)}" y="${cy - 2}" width="${w - 2}" height="4" fill="${on ? "#e8312f" : "#33b04a"}"/>`;

  const MODS = [["r4", "Relay, 4 ch"], ["r1", "Relay, 1 ch"], ["r2", "Relay, 2 ch"], ["r8", "Relay, 8 ch"], ["contactor", "Contactor"], ["breaker", "Breaker"], ["meter", "Energy meter"]];
  function din(o) {
    const p = pal(o.color), m = opt(o, "mod", "r4"), pc = p.lt ? "#2b3036" : "#dfe3e8";
    const W = { r1: 36, r2: 46, r4: 80, r8: 150, contactor: 54, breaker: 46, meter: 58 }[m], x = 100 - W / 2;
    let s = enclosure(o) + BG(rail(o, 100, 10, 190));
    if (m[0] === "r") {
      const n = +m.slice(1), on = Array.from({ length: n }, (_, i) => ch(o, i + 1)), any = on.some(Boolean);
      const nt = Math.max(2, Math.min(n, 4));
      s += dinBody(o, x, W, nt, n, Array.from({ length: nt }, () => any), on);
      const cw = (W - 4) / n;
      for (let i = 0; i < n; i++) { const cx = x + 2 + (i + .5) * cw;
        s += led(o, cx, 82, n > 4 ? 1.6 : 2, on[i], GREEN, "hg") + lever(o, cx, 102, on[i]) + txt(cx, 121, i + 1, 5.4, pc); }
      if (W >= 46) s += led(o, x + W - 6, 80, 1.4, true, BLUE, "hb", "blink");
    } else if (m === "contactor") {
      const on = [o.on, o.on, o.on];
      s += dinBody(o, x, W, 3, 3, on, on) + `<path d="${rr(x + 10, 80, W - 20, 13, 2)}" fill="#0b0d10"/><rect x="${x + 12}" y="82" width="${W - 24}" height="9" fill="${o.on ? "#e8312f" : "#33b04a"}"/>` +
        txt(100, 89.6, o.on ? "I" : "O", 7.5, "#fff") + `<path d="${rr(x + 14, 98, W - 28, 20, 3)}" fill="#0b0d10"/><path d="${rr(o.on ? x + 15 : x + W - 27, 99, 12, 18, 2.5)}" fill="#f0f2f4"/>` +
        txt(x + 14, 125, "AUTO", 4, pc, "start") + txt(x + W - 14, 125, "0", 4.6, pc, "end") + led(o, x + W - 7, 80, 1.4, o.on, GREEN, "hg");
    } else if (m === "breaker") {
      const on = [o.on, o.on];
      s += dinBody(o, x, W, 2, 2, on, on, [BLK, BLUW]) + handle(o, 100, 104, W - 18, o.on, "#555b63") + flag(100, 81, 18, o.on) + led(o, x + 6, 81, 1.6, o.on, GREEN, "hg") + led(o, x + W - 6, 81, 1.4, true, BLUE, "hb", "blink");
    } else {
      const on = [o.on, o.on], kw = o.on ? (o.level * 3.6).toFixed(1) : "0.0";
      s += dinBody(o, x, W, 2, 2, on, on, [BLK, BLUW]) + `<path d="${rr(x + 6, 78, W - 12, 22, 2)}" fill="url(#${o.uid}-lcd)" stroke="#000" stroke-opacity=".5"/>` +
        (o.on ? `<path d="${rr(x + 6, 78, W - 12, 22, 2)}" fill="${CYAN}" fill-opacity=".08"/>` : "") + digits(kw, x + 12, 83, 12, o.on ? "#9fe8ff" : "#2b3a40", o.on ? "rgba(159,232,255,.08)" : null) +
        txt(x + W - 9, 97, "kW", 4.4, o.on ? "#9fe8ff" : "#3a4a50", "end") + led(o, x + 12, 110, 1.8, o.on, RED, "hr", "pulse") + txt(x + 18, 112, "imp", 4.4, pc, "start", 600) +
        `<path d="${rr(x + W - 18, 105, 10, 10, 2)}" fill="#0b0d10"/><circle cx="${x + W - 13}" cy="110" r="3" fill="#d9dde2"/>`;
    }
    return svg(o, s);
  }

  function cunit(o) {
    const u = o.uid, p = pal(o.color), n = +opt(o, "count", "4"), main = o.parts && o.parts.main != null ? o.parts.main : o.on;
    const bw = 20, mw = 36, tot = mw + n * bw, x0 = 100 - tot / 2;
    let s = BG(wallBg(o)) + sh(o, 104, 172, 86, 7) + `<path d="${rr(12, 30, 176, 140, 10)}" fill="url(#${u}-v)"/><path d="${rr(12, 30, 176, 140, 10)}" fill="url(#${u}-fx)"/><path d="${rr(12, 30, 176, 140, 10)}" fill="url(#${u}-g)" opacity=".3"/>` +
      `<path d="${rr(20, 38, 160, 124, 6)}" fill="none" stroke="#000" stroke-opacity=".15"/>` +
      `<path d="${rr(x0 - 6, 70, tot + 12, 64, 3)}" fill="#0c0e11"/>` + `<path d="${rr(x0 - 4, 52, tot + 8, 12, 2)}" fill="#f6f4e8" stroke="#000" stroke-opacity=".2"/>`;
    const put = (x, w, on, col, lbl, smart) => { const cx = x + w / 2;
      return `<path d="${rr(x + .6, 72, w - 1.2, 60, 1.5)}" fill="#eef0f2"/><path d="${rr(x + .6, 72, w - 1.2, 60, 1.5)}" fill="url(#${u}-fx)"/><path d="M${x + .6} 72.6H${x + w - .6}" stroke="#fff"/>` +
        handle(o, cx, 106, w - 8, on, col) + flag(cx, 80, w - 8, on) + (smart ? led(o, cx, 126, 1.5, on, GREEN, "hg") : "") +
        `<path d="M${n1(x + 3)} 58H${n1(x + w - 3)}" stroke="#4a5058" stroke-width="1.4" stroke-opacity=".55"/>` + (lbl ? txt(cx, 126.6, lbl, 4, "#565c63") : ""); };
    s += put(x0, mw, main, "#d22a2a", "", false) + txt(x0 + mw / 2, 128, "MAIN", 4.4, "#565c63");
    for (let i = 1; i <= n; i++) s += put(x0 + mw + (i - 1) * bw, bw, main && ch(o, i), "#555b63", "", true);
    s += `<path d="M24 150h30" stroke="#000" stroke-opacity=".15" stroke-width="2"/>` + led(o, 172, 150, 1.6, true, BLUE, "hb", "blink");
    return svg(o, s);
  }

  function loadc(o) {
    const u = o.uid, p = pal(o.color);
    let s = BG(wallBg(o)) + sh(o, 104, 194, 70, 5) + `<path d="${rr(36, 8, 128, 184, 4)}" fill="url(#${u}-v)"/><path d="${rr(36, 8, 128, 184, 4)}" fill="url(#${u}-fx)"/>` +
      `<path d="${rr(42, 14, 116, 172, 3)}" fill="none" stroke="#000" stroke-opacity=".2"/>` + screw(44, 16, 2) + screw(156, 16, 2) + screw(44, 184, 2) + screw(156, 184, 2);
    s += `<path d="${rr(76, 22, 48, 30, 2)}" fill="#0c0e11"/><path d="${rr(78, 24, 44, 26, 2)}" fill="url(#${u}-bk)"/>` +
      `<path d="${rr(o.on ? 82 : 98, 30, 20, 14, 2)}" fill="#33373d"/><path d="M${o.on ? 86 : 102} 37h12" stroke="#000" stroke-opacity=".5" stroke-width="3"/>` + txt(100, 58, "MAIN", 5, "#2b3036");
    s += `<path d="${rr(56, 64, 88, 112, 2)}" fill="#0c0e11"/>`;
    for (let i = 0; i < 6; i++) {
      const left = i < 3, r = i % 3, y = 68 + r * 36, x = left ? 59 : 101, on = ch(o, i + 1), hx = left ? (on ? x + 22 : x + 6) : (on ? x + 6 : x + 22);
      s += `<path d="${rr(x, y, 40, 32, 2)}" fill="url(#${u}-bk)"/><path d="M${x + 1} ${y + .6}H${x + 39}" stroke="#fff" stroke-opacity=".2"/>` +
        `<path d="${rr(x + 5, y + 10, 30, 12, 2)}" fill="#050608"/><path d="${rr(hx, y + 9, 12, 14, 2)}" fill="#6a7078"/><path d="M${hx + 3} ${y + 12}v8M${hx + 6} ${y + 12}v8M${hx + 9} ${y + 12}v8" stroke="#000" stroke-opacity=".45"/>` +
        led(o, left ? x + 6 : x + 34, y + 27, 1.5, on, GREEN, "hg") + txt(left ? x + 34 : x + 6, y + 29, i + 1, 5.4, "#9aa0a7");
    }
    return svg(o, s);
  }

  const SIG = [["pwm", "PWM"], ["v010", "0-10V"], ["dali", "DALI"], ["dmx", "DMX"]];
  function ledctl(o) {
    const u = o.uid, type = opt(o, "type", "inline"), lv = o.level, col = o.color, outN = { single: 2, rgb: 4, rgbw: 5 }[opt(o, "out", "rgb")];
    const sig = opt(o, "sig", "v010"), b = Object.assign({}, o, { color: type === "inline" ? "#2a2d33" : "#e9eaec", uid: o.uid + "n" });
    let s = defs(b) + BG(wallBg(o, 158));
    const sy = 168;
    s += (o.on ? `<ellipse cx="100" cy="${sy}" rx="110" ry="${n1(16 + 14 * lv)}" fill="url(#${u}-hl)" opacity="${n1(.25 + .6 * lv)}"/>` : "") +
      `<rect x="6" y="${sy - 5}" width="188" height="10" rx="1.5" fill="#f2f2ee"/><rect x="6" y="${sy - 5}" width="188" height="10" rx="1.5" fill="url(#${u}-fx)" opacity=".5"/>` +
      Array.from({ length: 16 }, (_, i) => { const x = 12 + i * 11.6; return `<rect x="${n1(x)}" y="${sy - 3}" width="5.6" height="6" rx=".8" fill="${o.on ? H().mix("#ffffff", col, .55) : "#e6e3d5"}" stroke="#b8b49f" stroke-width=".4"/>` +
        (o.on ? `<circle cx="${n1(x + 2.8)}" cy="${sy}" r="${n1(3 + 3 * lv)}" fill="${col}" opacity="${n1(.3 + .5 * lv)}"/>` : "") + (i % 4 === 3 ? `<path d="M${n1(x + 8.4)} ${sy - 5}v10" stroke="#c98a2a" stroke-width=".6"/>` : ""); }).join("");
    if (type === "inline") {
      const x = 58, y = 82, w = 84, h = 40, d = 9;
      s += sh(o, x + w / 2 + 4, y + h + 4, w * .55, 4) + box3d(b, x, y, w, h, d, 6) +
        `<path d="${rr(x + 8, y + 8, 30, h - 16, 3)}" fill="#000" opacity=".25"/><circle cx="${x + 23}" cy="${y + h / 2}" r="5" fill="#2a1416" stroke="#000"/><circle cx="${x + 21.5}" cy="${y + h / 2 - 1.5}" r="1.6" fill="#fff" opacity=".35"/>` +
        led(o, x + w - 14, y + 12, 2, o.on, GREEN, "hg") + led(o, x + w - 14, y + 26, 1.6, o.on, AMB, "ha", "blink");
      s += wire(o, `M${x} ${y + h / 2}C${x - 22} ${y + h / 2} 30 60 -4 50`, 5, BLK, o.on, .9) + `<path d="${rr(x - 10, y + h / 2 - 4, 10, 8, 2)}" fill="url(#${u}-bk)"/>`;
      const cols = [BLK, REDW, GRNW, BLUW, WHT].slice(0, outN);
      cols.forEach((c, i) => { const yy = y + 12 + i * 4; s += wire(o, `M${x + w} ${yy}C${x + w + 30} ${yy} ${150 + i * 3} ${sy - 30} ${150 + i * 3} ${sy - 5}`, 2.6, c, o.on && i > 0, n1(.3 + .6 * lv)); });
      s += `<path d="${rr(146, sy - 8, 6 + outN * 3, 5, 1)}" fill="#1a1d21"/>`;
    } else {
      const x = 74, W = 52;
      s += BG(rail(o, 100, 10, 190));
      s += dinBody(b, x, W, 2, 2, [o.on, o.on], [o.on, o.on], [BLK, BLUW]).replace(/V178/g, "V150") +
        `<path d="${rr(x + 8, 78, W - 16, 14, 2)}" fill="url(#${u}-lcd)"/>` + txt(100, 88, { pwm: "PWM", v010: "0-10V", dali: "DALI", dmx: "DMX" }[sig], 7, o.on ? "#9fe8ff" : "#3a4a50") +
        led(o, x + 12, 104, 1.8, o.on, GREEN, "hg") + led(o, x + 22, 104, 1.6, o.on, AMB, "ha", "blink") + `<path d="${rr(x + W - 22, 98, 12, 12, 6)}" fill="#0b0d10"/><circle cx="${x + W - 16}" cy="104" r="3.6" fill="#d9dde2"/>`;
      s += wire(o, `M${x + 13} 150C${x + 13} 158 ${x + 13} 158 ${x + 13} ${sy - 5}`, 3.4, BLK, o.on) + wire(o, `M${x + 39} 150C${x + 39} 158 ${x + 39} 158 ${x + 39} ${sy - 5}`, 3.4, REDW, o.on, n1(.3 + .6 * lv));
    }
    return svg(o, s);
  }

  const MESH = [["zigbee", "Zigbee"], ["zwave", "Z-Wave"], ["thread", "Thread"]];
  function waves(o, cx, cy, col, n, sp) {
    if (!o.on) return "";
    return Array.from({ length: n || 3 }, (_, i) => `<path class="${P}wave" style="animation-delay:${n1(i * .45)}s" d="M${n1(cx - 12 - i * (sp || 9))} ${n1(cy - 2 - i * 5)}A${n1(16 + i * 12)} ${n1(16 + i * 12)} 0 0 1 ${n1(cx + 12 + i * (sp || 9))} ${n1(cy - 2 - i * 5)}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`).join("");
  }
  const plate = (o, x, y, w, h) => `<path d="${rr(x + 2, y + 3, w, h, 6)}" fill="#000" opacity=".25"/><path d="${rr(x, y, w, h, 6)}" fill="#ecebe5"/><path d="${rr(x, y, w, h, 6)}" fill="url(#${o.uid}-fx)" opacity=".6"/>` +
    `<path d="M${x + 4} ${y + 1}H${x + w - 4}" stroke="#fff" stroke-opacity=".8"/>`;
  const outlet = (cx, cy) => `<path d="${rr(cx - 15, cy - 18, 30, 36, 8)}" fill="#e2e1da" stroke="#b9b8b0" stroke-width=".8"/><rect x="${cx - 7}" y="${cy - 9}" width="2.6" height="9" rx=".8" fill="#2a2d31"/><rect x="${cx + 4.4}" y="${cy - 9}" width="2.6" height="9" rx=".8" fill="#2a2d31"/><path d="M${cx - 3} ${cy + 10}a3 3 0 0 1 6 0v2.6h-6z" fill="#2a2d31"/>`;
  function plugrep(o) {
    const u = o.uid, p = pal(o.color), rad = opt(o, "mesh", "zigbee"), rc = { zigbee: AMB, zwave: GREEN, thread: CYAN }[rad], rh = { zigbee: "ha", zwave: "hg", thread: "hc" }[rad], pass = opt(o, "pass", "no") === "yes";
    let s = BG(wallBg(o) + plate(o, 66, 34, 68, 132) + outlet(100, 136) + screw(100, 100, 2.2));
    s += waves(o, 100, 38, rc, 3) + sh(o, 104, 104, 34, 6) +
      `<path d="${rr(68, 42, 64, 60, 16)}" fill="${p.k}" transform="translate(3 3)" opacity=".5"/><path d="${rr(66, 40, 68, 62, 16)}" fill="url(#${u}-v)"/><path d="${rr(66, 40, 68, 62, 16)}" fill="url(#${u}-fx)"/><path d="${rr(66, 40, 68, 62, 16)}" fill="url(#${u}-g)" opacity=".4"/>` +
      `<path d="${rr(72, 46, 56, 50, 12)}" fill="none" stroke="#000" stroke-opacity=".08"/>`;
    if (pass) s += outlet(100, 74).replace(/#e2e1da/, p.l).replace(/#b9b8b0/, p.d) + led(o, 122, 52, 1.8, o.on, rc, rh, "blink");
    else s += `<circle cx="100" cy="70" r="12" fill="#000" opacity=".06"/>` + (o.on ? `<circle cx="100" cy="70" r="22" fill="url(#${u}-${rh})" opacity=".55"/>` : "") +
      `<circle cx="100" cy="70" r="9" fill="none" stroke="${o.on ? rc : "#7d838a"}" stroke-width="2.4" opacity="${o.on ? 1 : .5}"${o.on ? ` class="${P}breathe"` : ""}/><circle cx="100" cy="70" r="5" fill="url(#${u}-v)"/><circle cx="100" cy="70" r="5" fill="url(#${u}-dome)"/>` +
      `<path d="M92 92h16" stroke="#000" stroke-opacity=".12" stroke-width="1.4"/>`;
    return svg(o, s);
  }

  function extender(o) {
    const u = o.uid, p = pal(o.color), na = +opt(o, "ant", "2"), sg = { strong: 3, fair: 2, weak: 1 }[opt(o, "sig", "strong")];
    let s = BG(wallBg(o) + plate(o, 70, 52, 60, 120) + outlet(100, 142));
    const ant = (x, lean) => `<g transform="rotate(${lean} ${x} 62)"><path d="${rr(x - 4, 14, 8, 50, 4)}" fill="${p.k}"/><path d="${rr(x - 3.4, 14, 6.8, 48, 3.4)}" fill="url(#${u}-v)"/><path d="M${x - 1.4} 18V58" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/></g>`;
    const xs = na === 4 ? [[64, -10], [80, -3], [120, 3], [136, 10]] : na === 2 ? [[66, -8], [134, 8]] : [];
    s += waves(o, 100, 46, CYAN, 3, 11) + xs.map((a) => ant(a[0], a[1])).join("") + sh(o, 104, 128, 38, 6) +
      `<path d="${rr(60, 52, 80, 74, 12)}" fill="url(#${u}-v)"/><path d="${rr(60, 52, 80, 74, 12)}" fill="url(#${u}-fx)"/><path d="${rr(60, 52, 80, 74, 12)}" fill="url(#${u}-g)" opacity=".4"/>` +
      Array.from({ length: 5 }, (_, r) => Array.from({ length: 7 }, (_, c) => `<circle cx="${73 + c * 9}" cy="${62 + r * 6}" r="1.3" fill="#000" opacity=".22"/>`).join("")).join("");
    s += `<path d="${rr(70, 96, 60, 20, 6)}" fill="#000" opacity=".12"/>` + led(o, 78, 106, 1.8, true, o.on ? WHITE : RED, o.on ? "hw" : "hr") +
      led(o, 90, 106, 1.8, o.on, BLUE, "hb", "blink");
    for (let i = 0; i < 3; i++) { const lit = o.on && i < sg, hh = 4 + i * 3; s += `<rect x="${104 + i * 7}" y="${110 - hh}" width="4.4" height="${hh}" rx="1" fill="${lit ? (sg === 1 ? AMB : GREEN) : "#3a3f46"}"/>` + (lit ? `<rect x="${104 + i * 7}" y="${110 - hh}" width="4.4" height="${hh}" rx="1" fill="#fff" opacity=".25"/>` : ""); }
    return svg(o, s);
  }

  function generic(o) {
    const u = o.uid, p = pal(o.color), shp = opt(o, "shape", "box");
    let s = BG(wallBg(o, 150));
    const cord = (x, y) => tube(`M${x} ${y}C${x + 20} ${y + 10} 176 150 186 168`, 3.6, BLK) + `<path d="${rr(180, 164, 14, 10, 2)}" fill="url(#${u}-bk)"/>`;
    if (shp === "box") {
      const x = 42, y = 92, w = 106, h = 58, d = 16;
      s += cord(x + w + 6, y + 30) + sh(o, x + w / 2 + 10, y + h + 2, w * .62, 6) + box3d(o, x, y, w, h, d, 5) +
        Array.from({ length: 6 }, (_, i) => `<path d="M${x + w + 4} ${y + 8 + i * 6.4}l${d - 8} ${-(d - 8)}" stroke="#000" stroke-opacity=".3" stroke-width="1.6"/>`).join("") +
        `<path d="M${x + 10} ${y + h - 12}H${x + 60}" stroke="#000" stroke-opacity=".15" stroke-width="2"/>` +
        led(o, x + w - 30, y + h - 12, 2.2, o.on, GREEN, "hg") + led(o, x + w - 20, y + h - 12, 1.6, o.on, AMB, "ha", "blink") +
        `<circle cx="${x + 14}" cy="${y + 16}" r="6" fill="#000" opacity=".18"/><circle cx="${x + 14}" cy="${y + 16}" r="4.6" fill="url(#${u}-v)"/><path d="M${x + 14} ${y + 12.6}v3M${x + 11.8} ${y + 13.8}a3.2 3.2 0 1 0 4.4 0" fill="none" stroke="${o.on ? GREEN : "#6b7178"}" stroke-width="1" stroke-linecap="round"/>`;
    } else if (shp === "tower") {
      const x = 74, y = 40, w = 52, h = 112, d = 14;
      s += cord(x + w + 4, y + h - 20) + sh(o, x + w / 2 + 8, y + h + 2, 44, 6) + box3d(o, x, y, w, h, d, 5) +
        Array.from({ length: 9 }, (_, i) => `<path d="M${x + 10} ${y + 40 + i * 6}H${x + w - 10}" stroke="#000" stroke-opacity=".22" stroke-width="2"/>`).join("") +
        `<circle cx="${x + w / 2}" cy="${y + 18}" r="7" fill="#000" opacity=".18"/><circle cx="${x + w / 2}" cy="${y + 18}" r="5.4" fill="url(#${u}-v)"/>` +
        (o.on ? `<circle cx="${x + w / 2}" cy="${y + 18}" r="7.4" fill="none" stroke="${GREEN}" stroke-width="1.2"/>` : "") + led(o, x + w / 2 - 6, y + 32, 1.6, o.on, GREEN, "hg") + led(o, x + w / 2 + 6, y + 32, 1.6, o.on, AMB, "ha", "blink");
    } else {
      s += cord(150, 128) + sh(o, 104, 142, 62, 9) + `<path d="M40 112V124A60 18 0 0 0 160 124V112Z" fill="url(#${u}-s)"/><ellipse cx="100" cy="112" rx="60" ry="18" fill="url(#${u}-v)"/><ellipse cx="100" cy="112" rx="60" ry="18" fill="url(#${u}-g)" opacity=".5"/>` +
        `<ellipse cx="100" cy="111" rx="40" ry="11" fill="none" stroke="#000" stroke-opacity=".12"/>` + (o.on ? `<path class="${P}breathe" d="M48 126A56 14 0 0 0 152 126" fill="none" stroke="${GREEN}" stroke-width="2" opacity=".85"/>` : "") +
        led(o, 100, 111, 2.2, o.on, GREEN, "hg");
    }
    return svg(o, s);
  }

  function sensor(o) {
    const u = o.uid, p = pal(o.color), shp = opt(o, "shape", "round"), mount = opt(o, "mount", "wall");
    let s = "", cx = 100, cy = 96;
    const ripple = o.on ? [0, 1, 2].map((i) => `<circle class="${P}rip" style="animation-delay:${n1(i * .7)}s" cx="${cx}" cy="${mount === "wall" ? cy : 112}" r="44" fill="none" stroke="${CYAN}" stroke-width="1.4" opacity="${o.anim ? 0 : n1(.5 - i * .15)}" transform="${o.anim ? "" : `translate(${cx} ${mount === "wall" ? cy : 112}) scale(${n1(1 + i * .25)}) translate(${-cx} ${mount === "wall" ? -cy : -112})`}"/>`).join("") : "";
    if (mount === "wall") {
      s += BG(wallBg(o)) + ripple + sh(o, cx + 4, cy + 44, 40, 5);
      const d = shp === "round" ? null : rr(cx - 38, cy - 38, 76, 76, 16);
      s += (d ? `<path d="${d}" fill="${p.k}" transform="translate(3 4)" opacity=".5"/><path d="${d}" fill="url(#${u}-v)"/><path d="${d}" fill="url(#${u}-fx)"/><path d="${d}" fill="url(#${u}-g)" opacity=".4"/>`
        : `<circle cx="${cx + 3}" cy="${cy + 4}" r="38" fill="${p.k}" opacity=".5"/><circle cx="${cx}" cy="${cy}" r="38" fill="url(#${u}-v)"/><circle cx="${cx}" cy="${cy}" r="38" fill="url(#${u}-dome)" opacity=".6"/>`) +
        `<circle cx="${cx}" cy="${cy}" r="${shp === "round" ? 28 : 26}" fill="none" stroke="#000" stroke-opacity=".1"/>` +
        `<circle cx="${cx}" cy="${cy - 6}" r="9" fill="#14181e"/><circle cx="${cx}" cy="${cy - 6}" r="9" fill="url(#${u}-dome)"/>` +
        Array.from({ length: 4 }, (_, i) => `<path d="M${cx - 12 + i * 8} ${cy + 18}v5" stroke="#000" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>`).join("") +
        led(o, cx, cy + 10, 1.8, o.on, CYAN, "hc", "blink");
    } else {
      s += BG(wallBg(o, 120)) + ripple + sh(o, cx + 4, 136, 46, 7);
      if (shp === "round") s += `<path d="M50 110V124A50 16 0 0 0 150 124V110Z" fill="url(#${u}-s)"/><ellipse cx="${cx}" cy="110" rx="50" ry="16" fill="url(#${u}-v)"/><ellipse cx="${cx}" cy="110" rx="50" ry="16" fill="url(#${u}-g)" opacity=".5"/><ellipse cx="${cx}" cy="110" rx="36" ry="11" fill="none" stroke="#000" stroke-opacity=".1"/>`;
      else s += `<path d="M52 120l18 -18h82l-18 18z" fill="url(#${u}-t)"/><path d="M134 120l18 -18v14l-18 18z" fill="url(#${u}-s)"/><path d="${rr(52, 120, 82, 14, 3)}" fill="url(#${u}-v)"/><path d="${rr(52, 120, 82, 14, 3)}" fill="url(#${u}-fx)"/>`;
      const lx = shp === "round" ? cx : 102, ly = shp === "round" ? 108 : 111;
      s += `<ellipse cx="${lx}" cy="${ly + 1}" rx="12" ry="5" fill="#14181e"/><ellipse cx="${lx}" cy="${ly}" rx="12" ry="5" fill="url(#${u}-dome)"/>` +
        led(o, shp === "round" ? cx + 30 : 120, shp === "round" ? 114 : 127, 1.8, o.on, CYAN, "hc", "blink");
    }
    return svg(o, s);
  }

  const css = `
.hda-relays-flow{stroke-dashoffset:0}
.hda-anim .hda-relays-flow{animation:hda-relays-flow .9s linear infinite}
.hda-anim .hda-relays-flow.hda-relays-rev{animation-direction:reverse}
@keyframes hda-relays-flow{to{stroke-dashoffset:-16}}
.hda-anim .hda-relays-blink{animation:hda-relays-blink 1.6s steps(1,end) infinite}
@keyframes hda-relays-blink{0%,69%{opacity:1}70%,100%{opacity:.25}}
.hda-anim .hda-relays-pulse{animation:hda-relays-pulse .7s steps(1,end) infinite}
@keyframes hda-relays-pulse{0%,30%{opacity:1}31%,100%{opacity:.15}}
.hda-anim .hda-relays-breathe{animation:hda-relays-breathe 2.4s ease-in-out infinite}
@keyframes hda-relays-breathe{50%{opacity:.35}}
.hda-relays-wave{opacity:.75}
.hda-anim .hda-relays-wave{animation:hda-relays-wave 1.4s ease-out infinite}
@keyframes hda-relays-wave{0%{opacity:0}30%{opacity:.95}100%{opacity:0}}
.hda-relays-rip{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-relays-rip{animation:hda-relays-rip 2.1s ease-out infinite}
@keyframes hda-relays-rip{0%{transform:scale(.6);opacity:.8}100%{transform:scale(1.5);opacity:0}}
`;

  const DARK = ["#1d1f23", "#f2f2ee", "#8d939b"], LIGHT = ["#f2f2ee", "#e8dfc8", "#1d1f23"], DINC = ["#e9eaec", "#f7f7f3", "#3b3f45"];
  const icons = [
    { id: "inwall", name: "In-wall relay", colors: DARK, picker: true, colorLabel: "Body",
      options: [{ id: "type", name: "Type", values: TYPES }, { id: "ch", name: "Channels", values: [["1", "1"], ["2", "2"], ["4", "4"]], when: { opt: "type", is: ["relay", "dimmer", "dry"] } },
        { id: "pmode", name: "Mode", values: PILOT, when: { opt: "type", is: "pilot" } }],
      parts: parts(4, "ch", (i) => i === 1 ? null : i === 2 ? ["2", "4"] : "4"), render: inwall },
    { id: "leads", name: "Flying-lead module", colors: DARK, picker: true, colorLabel: "Body", options: [{ id: "type", name: "Type", values: [["relay", "Relay"], ["dimmer", "Dimmer"]] }], render: leads },
    { id: "minibox", name: "Mini relay box", colors: LIGHT, picker: true, colorLabel: "Body",
      options: [{ id: "ch", name: "Channels", values: [["1", "1"], ["2", "2"]] }, { id: "radio", name: "Radio", values: RADIO }], parts: parts(2, "ch", (i) => i === 2 ? "2" : null), render: minibox },
    { id: "board", name: "Relay board", colors: ["#1f6e3e", "#1a3f8a", "#2b2b30", "#7a1d1d"], picker: true, colorLabel: "Board",
      options: [{ id: "ch", name: "Channels", values: [["4", "4"], ["1", "1"], ["2", "2"], ["8", "8"]] }], parts: parts(8, "ch", (i) => i === 1 ? null : i === 2 ? ["2", "4", "8"] : i <= 4 ? ["4", "8"] : "8"), render: board },
    { id: "din", name: "DIN-rail module", colors: DINC, picker: true, colorLabel: "Body", options: [{ id: "mod", name: "Module", values: MODS }],
      parts: parts(8, "mod", (i) => i === 1 ? ["r1", "r2", "r4", "r8"] : i === 2 ? ["r2", "r4", "r8"] : i <= 4 ? ["r4", "r8"] : "r8"), render: din },
    { id: "cunit", name: "Breaker row", colors: ["#f4f4f0", "#d9dcdf", "#2e3238"], picker: true, colorLabel: "Box",
      options: [{ id: "count", name: "Breakers", values: [["4", "4"], ["3", "3"], ["6", "6"]] }],
      parts: [{ id: "main", name: "Main" }].concat(parts(6, "count", (i) => i <= 3 ? null : i === 4 ? ["4", "6"] : "6")), render: cunit },
    { id: "loadc", name: "Smart load center", colors: ["#9aa1a9", "#d8d4c8", "#eef0f2"], picker: true, colorLabel: "Panel", parts: parts(6, "x", () => null), render: loadc },
    { id: "ledctl", name: "LED controller", colors: ["#ffd8a8", "#ff4d6d", "#4dabf7", "#69db7c", "#ffffff"], picker: true, colorLabel: "Light",
      options: [{ id: "type", name: "Type", values: [["inline", "Inline"], ["din", "DIN driver"]] }, { id: "out", name: "Output", values: [["rgb", "RGB"], ["single", "Single color"], ["rgbw", "RGBW"]], when: { opt: "type", is: "inline" } },
        { id: "sig", name: "Signal", values: SIG.slice(1).concat([SIG[0]]), when: { opt: "type", is: "din" } }], render: ledctl },
    { id: "plugrep", name: "Plug-in repeater", colors: LIGHT, picker: true, colorLabel: "Body",
      options: [{ id: "mesh", name: "Network", values: MESH }, { id: "pass", name: "Outlet", values: [["no", "No"], ["yes", "Pass-through"]] }], render: plugrep },
    { id: "extender", name: "Wi-Fi extender", colors: LIGHT, picker: true, colorLabel: "Body",
      options: [{ id: "ant", name: "Antennas", values: [["2", "2"], ["4", "4"], ["0", "None"]] }, { id: "sig", name: "Signal", values: [["strong", "Strong"], ["fair", "Fair"], ["weak", "Weak"]] }], render: extender },
    { id: "generic", name: "Generic device", colors: ["#8d939b", "#f2f2ee", "#1d1f23", "#3f6fb0"], picker: true, colorLabel: "Body",
      options: [{ id: "shape", name: "Shape", values: [["box", "Box"], ["tower", "Tower"], ["puck", "Puck"]] }], render: generic },
    { id: "sensor", name: "Generic sensor", colors: LIGHT, picker: true, colorLabel: "Body",
      options: [{ id: "shape", name: "Shape", values: [["round", "Round"], ["square", "Square"]] }, { id: "mount", name: "Mount", values: [["wall", "Wall"], ["table", "Table"]] }], render: sensor },
  ];

  (window.HDA = window.HDA || []).push({
    id: "relays", tab: "Relays & modules", group: "Utility", kind: "device", levelLabel: "Level",
    intro: "Twelve relay, module and fallback drawings. Builders: the in-wall relay (Type: relay, dimmer, dry contact, pilot wire; Channels 1/2/4), the relay board (1-8), the DIN-rail module (relays 1-8 ch, contactor, breaker, energy meter) and breaker panels with a chip per channel or breaker. On = LED lit, contact closed, handle up (or toward the center) and current moving in the wires. The slider is dimmer level or LED brightness.",
    css, icons,
  });
})();
