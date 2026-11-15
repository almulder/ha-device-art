(function () {
  const H = window.HDAH, P = "hda-extras-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  const STEEL = "#b8bdc4", WHITE = "#eceae6", BLACK = "#2a2c31", GRAY = "#80858d", BSTEEL = "#4a4c52", BEIGE = "#d8cdb6";

  function ctx(o) {
    const c = o.color || WHITE, lv = o.level == null ? 1 : o.level;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on: !!o.on, lv, id, url, hot: H.mix(c, "#ffffff", .6) };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id } = x, S = H.shade;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .48]], .5, .48, .74)}
${lg(id("bd"), [[0, S(c, .2)], [.5, c], [1, S(c, -.3)]], 0, 0, 0, 1)}
${lg(id("bdh"), [[0, S(c, -.28)], [.15, S(c, .2)], [.5, c], [.85, S(c, -.12)], [1, S(c, -.4)]])}
${lg(id("bds"), [[0, S(c, -.2)], [1, S(c, -.45)]], 0, 0, 0, 1)}
${lg(id("bdt"), [[0, S(c, .32)], [1, S(c, .08)]], 0, 0, 0, 1)}
${rg(id("halo"), [[0, c, .85], [.45, c, .3], [1, c, 0]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("blk"), [[0, "#4a4b58"], [.4, "#22232b"], [1, "#0b0b10"]], 0, 0, 0, 1)}
${lg(id("blkh"), [[0, "#0b0b10"], [.3, "#3a3b46"], [.5, "#22232b"], [1, "#08080b"]])}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("wall"), [[0, "#5a5650"], [1, "#3c3934"]], 0, 0, 0, 1)}
${lg(id("garage"), [[0, "#555960"], [1, "#3a3d42"]], 0, 0, 0, 1)}
${lg(id("conc"), [[0, "#6a6b70"], [1, "#3f4045"]], 0, 0, 0, 1)}
${lg(id("floor"), [[0, "#5a4430"], [1, "#2e2218"]], 0, 0, 0, 1)}
${lg(id("sky"), [[0, "#1d2a48"], [.6, "#3a4a6c"], [1, "#6f6f8a"]], 0, 0, 0, 1)}
${lg(id("glass"), [[0, "#5a7090"], [.5, "#26324a"], [1, "#141b2a"]], 0, 0, 1, 1)}
${lg(id("lawn"), [[0, "#3a5a34"], [1, "#1a2e1c"]], 0, 0, 0, 1)}
${lg(id("leaf"), [[0, "#6aa850"], [1, "#2a5a28"]], 0, 0, 0, 1)}
${lg(id("wood"), [[0, "#b87a4a"], [.5, "#9a6038"], [1, "#6a3e22"]], 0, 0, 0, 1)}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
${extra || ""}</defs>`;
  }
  function svg(x, s, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${s.fx || ""}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }

  const shadow = (x, cx, cy, rx, ry, k) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${x.url("sh")}" opacity="${k == null ? .8 : k}"/>`;
  const hl = (d, o, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o == null ? .35 : o}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
  const drop = (x, shape, dx, dy, k) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${k == null ? .45 : k}" filter="${x.url("bl")}">${shape}</g>`;
  const led = (cx, cy, r, col, on, delay, blink) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${on ? col : "#2a2c30"}" ${on && blink ? `class="${P}blink" style="animation-delay:-${delay.toFixed(2)}s"` : ""}/>${on ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 2.4}" fill="${col}" fill-opacity=".22"/>` : ""}`;
  function digit(cx, cy, s, d, col) {
    const M = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcfgd", "-": "g" }[d] || "";
    const w = 6 * s, h = 5 * s, t = 1.3 * s, seg = {
      a: [-w / 2, -h - t / 2, w, t], g: [-w / 2, -t / 2, w, t], d: [-w / 2, h - t / 2, w, t],
      f: [-w / 2 - t / 2, -h, t, h], b: [w / 2 - t / 2, -h, t, h], e: [-w / 2 - t / 2, 0, t, h], c: [w / 2 - t / 2, 0, t, h] };
    return Object.keys(seg).map((k) => { const [a, b, ww, hh] = seg[k]; return `<rect x="${f(cx + a)}" y="${f(cy + b)}" width="${f(ww)}" height="${f(hh)}" rx="${f(t / 2)}" fill="${col}" fill-opacity="${M.indexOf(k) >= 0 ? 1 : .07}"/>`; }).join("");
  }
  const digits = (str, cx, cy, s, col, gap) => {
    gap = gap || 9 * s; const n = str.replace(/[.]/g, "").length, dotW = str.indexOf(".") >= 0 ? gap * .5 : 0;
    let x0 = cx - (n * gap + dotW) / 2 + gap / 2, out = "";
    for (const ch of str) {
      if (ch === ".") { out += `<circle cx="${f(x0 - gap / 2 + dotW / 2)}" cy="${f(cy + 5 * s)}" r="${f(s * .85)}" fill="${col}"/>`; x0 += dotW; }
      else { out += digit(x0, cy, s, ch, col); x0 += gap; }
    }
    return out; };
  function floorBoards(x, y0) {
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("floor")}"/><rect x="8" y="${y0 - 3}" width="184" height="3.4" fill="#d8d4cc" fill-opacity=".55"/>`;
    for (let i = -6; i <= 26; i++) { const bx = 8 + i * 9; s += `<path d="M${f(100 + (bx - 100) * .6)} ${y0} L${f(bx + (bx - 100) * .35)} 192" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`; }
    return s;
  }
  const garage = (x, y0) => `<rect x="8" y="8" width="184" height="${y0 - 8}" fill="${x.url("garage")}"/>${[30, 60, 90, 120].filter((y) => y < y0).map((y) => `<path d="M8 ${y} H192" stroke="#000" stroke-opacity=".18"/>`).join("")}<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("conc")}"/><path d="M8 ${y0} H192" stroke="#fff" stroke-opacity=".15"/><path d="M60 ${y0} L40 192 M140 ${y0} L160 192" stroke="#000" stroke-opacity=".25"/>`;
  function siding(x, y0, y1, col) { let s = `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${col}"/>`; for (let y = y0; y < y1; y += 12) s += `<path d="M8 ${y + 11} H192" stroke="#000" stroke-opacity=".38" stroke-width="1.8"/><path d="M8 ${y + 12.4} H192" stroke="#fff" stroke-opacity=".08"/>`; return s; }
  function bricks(x0, y0, x1, y1, seed, base) {
    const r = rnd(seed); let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${base || "#5e3a2b"}"/>`;
    for (let row = 0, y = y0; y < y1; y += 11, row++) {
      for (let bx = x0 - (row % 2) * 12; bx < x1; bx += 24) { const v = r(); s += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="22.4" height="9.4" rx="1.1" fill="${v > .5 ? "#000" : "#e3a07f"}" fill-opacity="${(.04 + v * .1).toFixed(2)}"/><path d="M${f(bx)} ${y} v11" stroke="#bcae9f" stroke-opacity=".2" stroke-width="1.5"/>`; }
      s += `<path d="M${x0} ${y} H${x1}" stroke="#bcae9f" stroke-opacity=".22" stroke-width="1.5"/>`;
    }
    return s;
  }
  function box3(x, fx, fy, w, h, d, rx) {
    const k = .45;
    return `<path d="M${fx + w} ${fy} L${fx + w + d} ${f(fy - d * k)} V${f(fy + h - d * k)} L${fx + w} ${fy + h} Z" fill="${x.url("bds")}"/>
<path d="M${fx} ${fy} L${fx + d} ${f(fy - d * k)} H${fx + w + d} L${fx + w} ${fy} Z" fill="${x.url("bdt")}"/><rect x="${fx}" y="${fy}" width="${w}" height="${h}" rx="${rx || 2}" fill="${x.url("bd")}"/>`;
  }


  function mouseRear(x, cx, cy, s) {
    const fur = x.id("fur");
    return `<linearGradient id="${fur}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a39a90"/><stop offset="1" stop-color="#6e655c"/></linearGradient>
<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M8 -10 C-2 -12 -12 -8 -13 0 C-13 6 -6 8 8 8 Z" fill="url(#${fur})"/><path d="M-4 -9 C-9 -7 -11 -3 -11 1" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>
<ellipse cx="-6" cy="7.4" rx="5" ry="1.8" fill="#d8a8a0"/><path d="M-12 1 C-22 2 -26 9 -36 8 C-42 7 -46 2 -44 -2" fill="none" stroke="#c99a92" stroke-width="1.8" stroke-linecap="round"/></g>`;
  }
  function mouseSide(x, cx, cy) {
    const fur = x.id("fur2");
    return `<linearGradient id="${fur}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a39a90"/><stop offset="1" stop-color="#6e655c"/></linearGradient>
<g transform="translate(${cx} ${cy})"><path d="M-22 4 C-34 6 -40 0 -46 2" fill="none" stroke="#c99a92" stroke-width="1.6" stroke-linecap="round"/>
<path d="M-24 2 C-24 -8 -12 -11 0 -10 C8 -9 14 -6 16 -2 C14 3 6 5 -4 5 C-14 5 -24 6 -24 2 Z" fill="url(#${fur})"/><circle cx="6" cy="-10" r="4" fill="#9a9188"/><circle cx="6" cy="-10" r="2.2" fill="#d8a8a0"/>
<circle cx="12" cy="-4" r=".9" fill="#1a1a1a"/><circle cx="16.4" cy="-1.6" r="1" fill="#d88a8a"/><path d="M-8 4 l-2 3 M2 4 l1 3" stroke="#d8a8a0" stroke-width="1.4" stroke-linecap="round"/></g>`;
  }
  const trapLed = (x, cx, cy) => led(cx, cy, 1.8, x.on ? "#ff4a4f" : "#7dff9a", true, 0, x.on);
  const base = (o) => Object.assign({ picker: true, colorLabel: "Finish" }, o);
  // (multi-function) o.parts holds only the parts the owner ticked. A part left out follows the one device as a Device
  // Image (no o.mf, exactly as today) and stays off / dark, never blinking, as a Multi-Function Image (o.mf). Status
  // parts (a box online, the internet up, activity, on battery) are contacts; a reading is o.pval[id].
  const MF = {
    has: (o, k) => !!(o.parts && o.parts[k] != null),
    on: (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on),
    val: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" && isFinite(+o.pval[k]) ? Math.round(+o.pval[k]) : null),
    pw: (o) => (!o.mf ? !!o.on : MF.has(o, "power") ? !!o.parts.power : true),
  };
  // the temperature tag (Multi-Function Images with a reading only)
  function ttag(o, X, Y) {
    const t = o.mf ? MF.val(o, "temp") : null; if (t == null) return "";
    const col = t >= 104 ? "#ff5a4f" : t >= 95 ? "#ffb347" : "#7ee08a";
    return `<rect x="${X - 14}" y="${Y - 6}" width="28" height="12" rx="3" fill="#0b0d12" fill-opacity=".88" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/><path d="M${X - 9} ${Y - 3}V${Y + 1.4}" stroke="${col}" stroke-width="1.4" stroke-linecap="round"/><circle cx="${X - 9}" cy="${Y + 2.4}" r="1.6" fill="${col}"/>` +
      `<text x="${X + 3}" y="${Y + 2.8}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="7.4" font-weight="700" fill="${col}">${t}°</text>`;
  }
  const APPL = [WHITE, STEEL, BLACK, BSTEEL, GRAY];

  const icons = [
    base({ id: "chestfreezer", name: "Chest freezer", colors: [WHITE, BLACK, STEEL, GRAY, "#c9d6e3"], render(o) {
      const x = ctx(o), col = x.on ? "#6fd0ff" : "#3a4048";
      const fx = shadow(x, 104, 172, 76, 7) + box3(x, 30, 96, 130, 74, 26, 4) +
        `<path d="M28 92 L54 80 H188 L162 92 Z" fill="${x.url("bdt")}"/><rect x="28" y="92" width="134" height="8" rx="2" fill="${x.url("bd")}"/><path d="M28 100 H162" stroke="#000" stroke-opacity=".35"/><path d="M162 92 L188 80 V88 L162 100 Z" fill="${x.url("bds")}"/>
<rect x="70" y="102" width="50" height="6" rx="3" fill="#000" fill-opacity=".25"/><path d="M72 102.6 H118" stroke="#fff" stroke-opacity=".3"/>
<rect x="126" y="114" width="28" height="16" rx="2.4" fill="#12161c"/>${digits("-18", 140, 122, .6, col, 7)}
<circle cx="132" cy="138" r="1.6" fill="${x.on ? "#7dff9a" : "#2a3a2a"}"/><circle cx="140" cy="138" r="2.4" fill="#000" fill-opacity=".2"/><circle cx="148" cy="138" r="2.4" fill="#000" fill-opacity=".2"/>
${Array.from({ length: 5 }, (_, i) => `<path d="M${168 + i * 3.4} ${f(150 - i * 1.5)} v12" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>`).join("")}
<rect x="34" y="168" width="10" height="4" fill="#111"/><rect x="146" y="168" width="10" height="4" fill="#111"/>${hl("M33 104 V164", .35, 1.4)}`;
      return svg(x, { bg: garage(x, 140), fx });
    } }),

    base({ id: "uprightfreezer", name: "Upright freezer", colors: APPL, render(o) {
      const x = ctx(o), col = x.on ? "#6fd0ff" : "#3a4048";
      const fx = shadow(x, 104, 182, 52, 6) + box3(x, 58, 26, 80, 154, 22, 4) +
        `<path d="M64 30 V176" stroke="#fff" stroke-opacity=".12" stroke-width="10"/><path d="M132 30 V176" stroke="#000" stroke-opacity=".12" stroke-width="6"/>
<rect x="126" y="52" width="6" height="64" rx="3" fill="${x.url("chr")}"/><rect x="126" y="52" width="6" height="64" rx="3" fill="none" stroke="#000" stroke-opacity=".3"/>
<rect x="74" y="38" width="36" height="14" rx="2.4" fill="#12161c"/>${digits("-2", 88, 45, .55, col, 7)}<circle cx="104" cy="45" r="1.4" fill="${x.on ? "#7dff9a" : "#2a3a2a"}"/>
<rect x="58" y="170" width="80" height="10" fill="#000" fill-opacity=".35"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${64 + i * 7} 172 v6" stroke="#000" stroke-opacity=".5" stroke-width="2"/>`).join("")}`;
      return svg(x, { bg: garage(x, 168), fx });
    } }),

    base({ id: "kegerator", name: "Kegerator", colors: [BLACK, STEEL, BSTEEL, WHITE, "#7a2a2a"], render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="150" fill="#3d3530"/><rect x="8" y="8" width="184" height="150" fill="${x.url("wall")}" opacity=".6"/>` + floorBoards(x, 160);
      const fx = shadow(x, 100, 184, 54, 6) + box3(x, 54, 76, 88, 104, 16, 3) +
        `<rect x="54" y="70" width="88" height="8" rx="2" fill="${x.url("chr")}"/><path d="M54 70 L70 63 H158 L142 70 Z" fill="${x.url("chr")}"/>
<rect x="64" y="86" width="68" height="78" rx="3" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><rect x="126" y="96" width="4" height="40" rx="2" fill="${x.url("chr")}"/>
<rect x="68" y="150" width="24" height="10" rx="1.6" fill="#12161c"/>${digits("38", 80, 155, .4, x.on ? "#ffb057" : "#3a3a3a", 5)}
<rect x="88" y="62" width="20" height="4" rx="1" fill="#333"/><rect x="66" y="58" width="44" height="6" rx="2" fill="${x.url("chr")}"/>
<rect x="93" y="18" width="10" height="44" rx="2" fill="${x.url("chr")}"/><rect x="74" y="20" width="48" height="8" rx="4" fill="${x.url("chr")}"/>
${[80, 116].map((tx) => `<rect x="${tx - 3}" y="27" width="6" height="8" fill="${x.url("chr")}"/><path d="M${tx - 2} 35 h4 l-1 6 h-2 Z" fill="#9aa0aa"/><rect x="${tx - 2.4}" y="10" width="4.8" height="12" rx="2" fill="#141418"/><rect x="${tx - 3}" y="18" width="6" height="4" fill="${x.url("chr")}"/>`).join("")}
<path d="M70 52 L74 30 H86 L90 52 Z" fill="#ffe2a0" fill-opacity=".22" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/><path d="M71.6 42 L73.4 33 H86.6 L88.4 42 Z" fill="#e8a63a" fill-opacity=".9"/><path d="M73.2 33 H86.8 L86 30.4 H74 Z" fill="#fff8ea"/>` +
        (x.on ? `<g class="${P}pour"><path d="M80 41 V34" stroke="#f0b04a" stroke-width="2" stroke-dasharray="2 2"/></g>` : "") + `${hl("M58 82 V176", .3, 1.4)}`;
      return svg(x, { bg, fx });
    } }),

    base({ id: "rack", name: "Home server rack", colors: [BLACK, GRAY, WHITE, "#3a4a5a", BSTEEL], render(o) {
      // (parts) Power, Switch / NAS / Mini PC 1 / Mini PC 2 / UPS (each box's status lights), Activity (the lights blink),
      // On battery (the UPS display and light turn amber, blinking), Temperature (a tag)
      const x = ctx(o), r = rnd(9), P0 = MF.pw(o), U = (k) => (!o.mf ? x.on : P0 && (MF.has(o, k) ? !!o.parts[k] : MF.has(o, "power"))),
        on1 = U("u1"), on2 = U("u2"), on3 = U("u3"), on4 = U("u4"), on5 = U("u5"), bk = !o.mf || (MF.has(o, "act") && !!o.parts.act), bat = o.mf && on5 && MF.has(o, "bat") && !!o.parts.bat;
      const bg = `<rect x="8" y="8" width="184" height="184" fill="#3a3d44"/>` + floorBoards(x, 172);
      let units = "";
      units += `<rect x="58" y="40" width="84" height="12" fill="#1a1b20"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${63 + i * 6.4}" y="43" width="4.6" height="5" fill="#0a0a0c" stroke="#555" stroke-width=".4"/>`).join("")}`;
      units += `<rect x="58" y="54" width="84" height="12" fill="#2a2c33"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${63 + i * 6.4}" y="58" width="4.6" height="5" fill="#0a0a0c"/>` + led(65.3 + i * 6.4, 56.6, .9, i % 3 ? "#7dff9a" : "#ffb347", on1, r() * 1.4, bk)).join("")}`;
      for (let i = 0; i < 6; i++) units += `<path d="M${65 + i * 12.8} 47 C${65 + i * 12.8} 52 ${66 + i * 12.8} 54 ${66 + i * 12.8} 60" stroke="${["#3a8ad8", "#e8e8e8", "#e8c43a", "#3a8ad8", "#d84a4a", "#e8e8e8"][i]}" stroke-width="1.6" fill="none"/>`;
      units += `<rect x="58" y="70" width="84" height="26" fill="${x.url("blk")}"/>${Array.from({ length: 4 }, (_, i) => `<rect x="${62 + i * 16}" y="73" width="14" height="20" rx="1" fill="#14151a" stroke="#3a3c44" stroke-width=".6"/>${Array.from({ length: 4 }, (_, j) => `<path d="M${64 + i * 16} ${77 + j * 3} h10" stroke="#2c2e36" stroke-width="1"/>`).join("")}` + led(69 + i * 16, 90.6, 1, "#4dabf7", on2, r() * 1.4, bk)).join("")}<rect x="128" y="74" width="10" height="4" rx="1" fill="#14151a"/>${led(133, 84, 1.3, "#7dff9a", on2, 0, false)}`;
      units += `<rect x="58" y="100" width="84" height="18" fill="#1d1e24"/><rect x="62" y="104" width="30" height="12" rx="2" fill="#5a5d66"/><rect x="96" y="104" width="30" height="12" rx="2" fill="#5a5d66"/>${led(66, 110, .9, "#ffffff", on3, .4, bk)}${led(100, 110, .9, "#ffffff", on4, .9, bk)}`;
      units += `<rect x="58" y="122" width="84" height="26" fill="#22232a"/><rect x="64" y="128" width="26" height="14" rx="1.6" fill="#0e1218"/>${digits("120", 77, 135, .32, on5 ? (bat ? "#ffb347" : "#7fd8ff") : "#2a3038", 4)}${Array.from({ length: 8 }, (_, i) => `<path d="M${98 + i * 5} 126 v18" stroke="#000" stroke-opacity=".5" stroke-width="2"/>`).join("")}${bat ? led(136, 130, 1.2, "#ffb347", true, 0, true) : led(136, 130, 1.2, "#7dff9a", on5, 0, false)}`;
      const fx = shadow(x, 100, 180, 56, 5) + `<rect x="48" y="26" width="104" height="150" rx="3" fill="${x.url("bdh")}"/><rect x="54" y="34" width="92" height="136" fill="#0c0c10"/>
<rect x="55" y="34" width="3" height="136" fill="#3a3c44"/><rect x="142" y="34" width="3" height="136" fill="#3a3c44"/>${Array.from({ length: 24 }, (_, i) => `<rect x="55.6" y="${36 + i * 5.6}" width="1.6" height="1.6" fill="#000"/><rect x="142.8" y="${36 + i * 5.6}" width="1.6" height="1.6" fill="#000"/>`).join("")}${units}
<rect x="54" y="34" width="92" height="136" fill="url(#${x.id("door")})"/><rect x="54" y="34" width="92" height="136" fill="none" stroke="${H.shade(x.c, -.3)}" stroke-width="2"/><rect x="138" y="90" width="4" height="22" rx="1" fill="${x.url("chr")}"/>
${Array.from({ length: 6 }, (_, i) => `<path d="M50 ${40 + i * 4} h3" stroke="#000" stroke-opacity=".5"/>`).join("")}<rect x="52" y="176" width="8" height="5" fill="#111"/><rect x="140" y="176" width="8" height="5" fill="#111"/>` + ttag(o, 172, 22);
      return svg(x, { bg, fx }, lg(x.id("door"), [[0, "#ffffff", .1], [.3, "#ffffff", .02], [.32, "#ffffff", .08], [.6, "#ffffff", 0], [1, "#ffffff", .05]], 0, 0, 1, 1));
    }, parts: [{ id: "power", name: "Power" }, { id: "u1", name: "Switch", type: "contact" }, { id: "u2", name: "NAS", type: "contact" }, { id: "u3", name: "Mini PC 1", type: "contact" }, { id: "u4", name: "Mini PC 2", type: "contact" },
      { id: "u5", name: "UPS", type: "contact" }, { id: "act", name: "Drive & port activity", type: "contact" }, { id: "bat", name: "On battery", type: "contact" }, { id: "temp", name: "Temperature", type: "value", unit: "°F", min: 50, max: 120, def: 80 }] }),

    base({ id: "boom", name: "Boom barrier", colorLabel: "Body", colors: ["#f2b632", "#e8833a", "#c9ccd2", "#3a3d44", WHITE], onWord: "Open", offWord: "Closed", render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="112" fill="${x.url("sky")}"/><rect x="8" y="96" width="184" height="24" fill="#24303a"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${14 + i * 24}" y="${88 - (i % 3) * 8}" width="18" height="${32 + (i % 3) * 8}" fill="#1c2630"/>`).join("")}
<rect x="8" y="120" width="184" height="72" fill="#3a3c42"/><path d="M8 120 H192" stroke="#fff" stroke-opacity=".15"/>${[60, 100, 140].map((a) => `<path d="M${a} 150 h18" stroke="#e8e0b0" stroke-opacity=".6" stroke-width="3"/>`).join("")}<rect x="8" y="164" width="184" height="6" fill="#8a8a88"/><path d="M8 164 H192" stroke="#fff" stroke-opacity=".3"/>`;
      let stripes = ""; for (let i = 0; i < 6; i++) stripes += `<rect x="${12 + i * 16}" y="-3" width="8" height="6" fill="#d83a3a"/>`;
      const arm = `<g transform="translate(46 116) rotate(${x.on ? -80 : 0})"><rect x="0" y="-3" width="104" height="6" rx="3" fill="#f4f4f2"/>${stripes}<rect x="0" y="-3" width="104" height="6" rx="3" fill="none" stroke="#000" stroke-opacity=".3"/><path d="M4 -1.6 H100" stroke="#fff" stroke-opacity=".6"/></g>`;
      const fx = shadow(x, 42, 170, 24, 4) + shadow(x, 150, 168, 8, 2) + `<rect x="148" y="120" width="4" height="48" fill="#c9ccd2"/><path d="M144 112 V120 H156 V112" fill="none" stroke="#c9ccd2" stroke-width="2.4"/>` + arm +
        `<rect x="24" y="110" width="34" height="58" rx="3" fill="${x.url("bdh")}"/><path d="M24 110 L32 104 H66 L58 110 Z" fill="${x.url("bdt")}"/><path d="M58 110 L66 104 V162 L58 168 Z" fill="${x.url("bds")}"/>
<rect x="30" y="126" width="22" height="30" rx="2" fill="none" stroke="#000" stroke-opacity=".3"/><circle cx="48" cy="141" r="1.6" fill="#333"/><circle cx="46" cy="116" r="6" fill="#3a3d44"/><circle cx="46" cy="116" r="2.4" fill="${x.url("chr")}"/>
<rect x="34" y="96" width="14" height="8" rx="2" fill="${x.on ? "#7dff9a" : "#d83a3a"}" ${x.on ? `class="${P}blink"` : ""}/><rect x="34" y="96" width="14" height="8" rx="2" fill="#fff" fill-opacity=".2"/>${hl("M27 114 V164", .35, 1.2)}`;
      return svg(x, { bg, fx });
    } }),

    base({ id: "xmastree", name: "Christmas tree", colorLabel: "Light", colors: ["#ffc477", "#ffe2ad", "#eef4ff", "#ff6b6b", "#69db7c", "#4dabf7"], glow: { x: .5, y: .5, r: 1.2 }, cast: "around", render(o) {
      // (parts) Lights (the first string and the star) and Second string (every other bulb); o.pcolor.light2 tints it
      const x = ctx(o), r = rnd(31), L = x.on ? .3 + .7 * x.lv : 0, s1 = MF.on(o, "light"), s2 = MF.on(o, "light2"),
        c2 = o.pcolor && /^#[0-9a-fA-F]{6}$/.test(o.pcolor.light2 || "") ? o.pcolor.light2 : x.c, h2 = H.mix(c2, "#ffffff", .6);
      const tf = (k) => (k ? .3 + .7 * x.lv : 0), L1 = !o.mf ? L : tf(s1), L2 = !o.mf ? L : tf(s2);
      const bg = `<rect x="8" y="8" width="184" height="160" fill="#3a2e2a"/><rect x="8" y="8" width="184" height="160" fill="${x.url("wall")}" opacity=".5"/><rect x="140" y="40" width="40" height="56" fill="#1a2238"/><path d="M160 40 V96 M140 68 H180" stroke="#d8d2c6" stroke-width="2.4"/><rect x="138" y="38" width="44" height="60" fill="none" stroke="#d8d2c6" stroke-width="3"/>` + floorBoards(x, 168);
      let tree = "";
      const tiers = [[100, 22, 20, 56], [100, 40, 32, 86], [100, 62, 44, 118], [100, 86, 56, 152]];
      tiers.forEach(([cx, top, hw, bot], t) => {
        tree += `<path d="M${cx} ${top} C${cx - hw * .4} ${top + (bot - top) * .5} ${cx - hw * .8} ${bot - 8} ${cx - hw} ${bot} Q${cx} ${bot + 8} ${cx + hw} ${bot} C${cx + hw * .8} ${bot - 8} ${cx + hw * .4} ${top + (bot - top) * .5} ${cx} ${top} Z" fill="url(#${x.id("fir")})"/>`;
        for (let i = 0; i < 26; i++) { const yy = top + 6 + r() * (bot - top - 4), half = hw * (yy - top) / (bot - top), xx = cx + (r() - .5) * 2 * half;
          tree += `<path d="M${f(xx)} ${f(yy)} l${f((r() - .5) * 6)} ${f(3 + r() * 3)}" stroke="${r() > .5 ? "#3d7a44" : "#0c2414"}" stroke-width="1.2" stroke-linecap="round"/>`; }
      });
      let bulbs = "", glows = "";
      for (let i = 0; i < 46; i++) { const t = r(), yy = 30 + t * 118, half = 8 + t * 52, xx = 100 + (r() - .5) * 2 * half * .85;
        const d = (r() * 2.2).toFixed(2);
        const b2 = i % 2 === 1, bo = !o.mf ? x.on : b2 ? s2 : s1, bL = b2 ? L2 : L1, bh = o.mf && b2 ? h2 : x.hot, bc = o.mf && b2 ? c2 : x.c;
        bulbs += bo ? `<g class="${P}tw" style="animation-delay:-${d}s"><circle cx="${f(xx)}" cy="${f(yy)}" r="1.7" fill="${bh}" fill-opacity="${(.5 + .5 * bL).toFixed(2)}"/><circle cx="${f(xx)}" cy="${f(yy)}" r="5.6" fill="${bc}" fill-opacity="${(.28 * bL).toFixed(2)}"/></g>` : `<circle cx="${f(xx)}" cy="${f(yy)}" r="1.5" fill="#d8d4c8" fill-opacity=".45"/>`; }
      for (let i = 0; i < 10; i++) { const t = r(), yy = 40 + t * 104, half = 10 + t * 46; tree += `<circle cx="${f(100 + (r() - .5) * 1.6 * half)}" cy="${f(yy)}" r="3" fill="${["#c0392b", "#d4a42a", "#2a5aa8"][i % 3]}"/>`; }
      if (!o.mf ? x.on : s1 || s2) glows = `<ellipse cx="100" cy="96" rx="76" ry="84" fill="${x.url("halo")}" opacity="${(.45 * (!o.mf ? L : Math.max(L1, L2))).toFixed(2)}"/>`;
      const fx = shadow(x, 100, 176, 60, 6) + glows + `<rect x="94" y="150" width="12" height="20" fill="#4a3020"/><path d="M74 168 L80 156 H120 L126 168 Z" fill="#8a2a2a"/>` + tree + bulbs +
        `<path d="M100 10 L103 18 L111 18 L105 23 L107 31 L100 26 L93 31 L95 23 L89 18 L97 18 Z" fill="${(!o.mf ? x.on : s1) ? x.hot : "#c9a24a"}"/>${(!o.mf ? x.on : s1) ? `<circle cx="100" cy="21" r="12" fill="${x.url("halo")}" opacity="${L1.toFixed(2)}"/>` : ""}
<rect x="40" y="152" width="28" height="22" fill="#2a6a8a"/><path d="M54 152 V174 M40 162 H68" stroke="#e8c45a" stroke-width="2"/><rect x="130" y="158" width="32" height="16" fill="#a83a4a"/><path d="M146 158 V174 M130 166 H162" stroke="#f0f0f0" stroke-width="2"/>`;
      return svg(x, { bg, fx }, lg(x.id("fir"), [[0, "#2f6a3a"], [1, "#143a22"]], 0, 0, 0, 1));
    }, parts: [{ id: "light", name: "Lights" }, { id: "light2", name: "Second string" }] }),

    base({ id: "iron", name: "Steam iron", colorLabel: "Body", colors: ["#7a4ab8", "#2a9a9a", "#3a6ad8", "#d83a5a", GRAY], render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="184" fill="#4a4e58"/>` + floorBoards(x, 168) + `<path d="M40 128 L60 168 M160 128 L140 168 M60 128 L150 168 M150 128 L60 168" stroke="#bfc4cc" stroke-width="2"/>`;
      let pat = ""; for (let i = 0; i < 16; i++) pat += `<circle cx="${30 + i * 10}" cy="${116 + (i % 2) * 4}" r="2" fill="#fff" fill-opacity=".25"/>`;
      const board = `<path d="M18 112 Q18 104 30 104 H160 Q186 106 190 116 Q186 126 160 128 H30 Q18 128 18 120 Z" fill="#3a6aa8"/>${pat}<path d="M18 112 Q18 104 30 104 H160 Q186 106 190 116" fill="none" stroke="#fff" stroke-opacity=".25"/>`;
      const sole = "M54 102 L66 80 C80 70 116 68 138 74 C146 78 150 90 148 102 Z";
      const fx = board + shadow(x, 100, 106, 50, 4) + `<path d="${sole}" fill="${x.url("bd")}"/><path d="M52 102 H150 V106 Q100 110 52 106 Z" fill="${x.url("chr")}"/>
<path d="M70 82 C86 74 112 72 130 76 L132 90 H72 Z" fill="#cfeaff" fill-opacity=".35" stroke="#fff" stroke-opacity=".4"/><path d="M74 88 H130" stroke="#5ab0e8" stroke-opacity=".6" stroke-width="3"/>
<path d="M92 70 C96 52 124 50 136 56 C142 60 142 66 140 74 L130 74 C130 66 126 64 118 64 C108 64 102 66 100 72 Z" fill="${x.url("bd")}"/><path d="M98 62 C104 56 120 54 132 58" stroke="#fff" stroke-opacity=".35" fill="none"/>
<circle cx="88" cy="90" r="5" fill="#ddd"/><path d="M88 87 V90" stroke="#333"/><circle cx="114" cy="94" r="1.6" fill="${x.on ? "#ff5040" : "#4a2a2a"}"/>${x.on ? `<circle cx="114" cy="94" r="4" fill="#ff5040" fill-opacity=".3"/>` : ""}
<path d="M148 92 C164 90 174 100 186 98" stroke="#222" stroke-width="2" fill="none"/>${hl("M60 98 L68 82", .4, 1.2)}` +
        (x.on ? [0, 1, 2, 3].map((i) => `<g class="${P}steam" style="animation-delay:-${(i * .55).toFixed(2)}s"><circle cx="${56 + i * 8}" cy="100" r="${5 + i}" fill="#fff" fill-opacity=".35"/></g>`).join("") : "");
      return svg(x, { bg, fx });
    } }),

    base({ id: "hairdryer", name: "Hair dryer", colorLabel: "Body", colors: [BLACK, WHITE, "#e86aa0", "#7a4ab8", GRAY], render(o) {
      const x = ctx(o), lvl = x.on ? .3 + .7 * x.lv : 0;
      let tile = `<rect x="8" y="8" width="184" height="184" fill="#9aa0a6"/>`; for (let i = 0; i < 10; i++) tile += `<path d="M8 ${8 + i * 22} H192 M${8 + i * 22} 8 V192" stroke="#6a7076" stroke-width="1"/>`;
      tile += `<rect x="8" y="8" width="184" height="184" fill="#000" fill-opacity=".45"/><rect x="8" y="160" width="184" height="32" fill="#e8e4dc"/><rect x="8" y="158" width="184" height="3" fill="#fff" fill-opacity=".4"/>`;
      const fx = `<path d="M150 64 C170 64 174 92 162 100 L118 100 L118 64 Z" fill="${x.url("bd")}"/><circle cx="150" cy="82" r="14" fill="${H.shade(x.c, -.35)}"/>${Array.from({ length: 4 }, (_, i) => `<circle cx="150" cy="82" r="${4 + i * 3}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".8"/>`).join("")}
<rect x="54" y="62" width="100" height="40" rx="18" fill="${x.url("bd")}"/><path d="M32 70 L58 64 V100 L32 94 Z" fill="${H.shade(x.c, -.15)}"/><ellipse cx="32" cy="82" rx="4" ry="12" fill="#14151a"/>
${x.on ? `<ellipse cx="33" cy="82" rx="3" ry="10" fill="#ff7a2a" fill-opacity="${(.4 + .6 * lvl).toFixed(2)}"/><ellipse cx="32" cy="82" rx="10" ry="18" fill="#ff8a3a" fill-opacity="${(.25 * lvl).toFixed(2)}"/>` : ""}
<path d="M112 100 C114 120 112 140 118 166 L138 166 C134 140 136 120 136 100 Z" fill="${x.url("bdh")}"/><rect x="114" y="160" width="26" height="8" rx="3" fill="${H.shade(x.c, -.3)}"/><path d="M127 168 C128 178 140 184 160 186" stroke="#111" stroke-width="2" fill="none"/>
<rect x="122" y="112" width="8" height="12" rx="3" fill="#222"/><rect x="123.4" y="${x.on ? 113.4 : 118}" width="5.2" height="5" rx="2" fill="#ddd"/><rect x="122" y="128" width="8" height="6" rx="2" fill="#222"/><circle cx="126" cy="138" r="1.4" fill="${x.on ? "#7fd8ff" : "#333"}"/>
${hl("M64 68 H146", .4, 2)}<rect x="68" y="62" width="4" height="40" fill="#000" fill-opacity=".1"/>` +
        (x.on ? [0, 1, 2, 3].map((i) => `<path d="M26 ${72 + i * 6} C18 ${70 + i * 6} 14 ${66 + i * 8} 8 ${62 + i * 10}" stroke="${i % 2 ? "#ffb27a" : "#e6eeff"}" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-dasharray="6 8" class="${P}flow" style="animation-delay:-${(i * .3).toFixed(1)}s"/>`).join("") : "");
      return svg(x, { bg: tile, fx });
    } }),

    base({ id: "scale", name: "Smart scale", colorLabel: "Body", colors: [BLACK, WHITE, GRAY, "#c9d6e3", "#e8c8c0"], render(o) {
      const x = ctx(o), col = x.on ? "#7fd8ff" : "#3a4048";
      let tile = `<rect x="8" y="8" width="184" height="184" fill="#b8b4ac"/>`;
      for (let i = 0; i < 6; i++) { const y = 30 + i * i * 6; tile += `<path d="M8 ${y} H192" stroke="#7a766e" stroke-width="1"/>`; }
      for (let i = -6; i <= 6; i++) tile += `<path d="M${100 + i * 14} 8 L${100 + i * 40} 192" stroke="#7a766e" stroke-width="1"/>`;
      tile += `<rect x="8" y="8" width="184" height="184" fill="#000" fill-opacity=".38"/>`;
      const top = "M40 66 Q42 58 52 58 H148 Q158 58 160 66 L172 156 Q173 166 162 166 H38 Q27 166 28 156 Z";
      const fx = drop(x, `<path d="${top}"/>`, 0, 6, .6) + `<path d="M28 156 L28 162 Q28 172 38 172 H162 Q172 172 172 162 L172 156" fill="${H.shade(x.c, -.4)}"/><path d="${top}" fill="${x.url("bd")}"/><path d="${top}" fill="url(#${x.id("gls")})"/>
${[[48, 132], [128, 132]].map(([a, b]) => `<path d="M${a} ${b} h24 l2 22 h-28 Z" fill="${x.url("chr")}" opacity=".85"/>`).join("")}${[[54, 82], [126, 82]].map(([a, b]) => `<path d="M${a} ${b} h20 l1 18 h-22 Z" fill="${x.url("chr")}" opacity=".85"/>`).join("")}
<rect x="78" y="70" width="44" height="18" rx="3" fill="#0c0e12"/>${digits("72.4", 100, 79, .55, col, 9)}${hl("M46 64 L64 62", .5, 1.2)}`;
      return svg(x, { bg: tile, fx }, lg(x.id("gls"), [[0, "#fff", .3], [.3, "#fff", .05], [.6, "#fff", 0], [1, "#000", .15]], 0, 0, 1, 1));
    } }),

    base({ id: "monitor", name: "Desk monitor", colors: [BLACK, "#c9ccd2", WHITE, GRAY], render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="136" fill="#4a4a52"/><rect x="8" y="8" width="184" height="136" fill="${x.url("wall")}" opacity=".5"/><rect x="8" y="140" width="184" height="52" fill="url(#${x.id("desk")})"/><path d="M8 140 H192" stroke="#fff" stroke-opacity=".25"/>`;
      const scr = x.on ? `<rect x="34" y="34" width="132" height="76" fill="url(#${x.id("wp")})"/><path d="M34 92 C60 76 80 84 100 78 C124 70 140 82 166 74 V110 H34 Z" fill="#2a2a6a" fill-opacity=".7"/><path d="M34 100 C64 90 92 98 120 90 C140 84 154 92 166 88 V110 H34 Z" fill="#1a1440"/><circle cx="128" cy="56" r="10" fill="#ffd8a8" fill-opacity=".85"/>
<rect x="74" y="104" width="52" height="5" rx="2.5" fill="#fff" fill-opacity=".25"/>${[80, 88, 96, 104, 112].map((a) => `<rect x="${a}" y="105" width="5" height="3" rx="1" fill="#fff" fill-opacity=".6"/>`).join("")}`
        : `<rect x="34" y="34" width="132" height="76" fill="#0a0b0e"/><path d="M34 34 L100 34 L34 90 Z" fill="#fff" fill-opacity=".05"/>`;
      const fx = shadow(x, 100, 150, 50, 4) + `<path d="M88 112 L84 142 H116 L112 112 Z" fill="${x.url("bdh")}"/><ellipse cx="100" cy="144" rx="30" ry="4" fill="${x.url("bd")}"/>
<rect x="30" y="30" width="140" height="86" rx="3" fill="${x.url("bd")}"/>${scr}<rect x="30" y="112" width="140" height="4" fill="${H.shade(x.c, -.2)}"/><circle cx="160" cy="114" r="1" fill="${x.on ? "#fff" : "#ffb347"}"/>
<path d="M50 168 L58 154 H134 L140 168 Z" fill="#2a2b30"/>${Array.from({ length: 4 }, (_, i) => `<path d="M${54 + i * 1.6} ${166 - i * 3.4} H${138 - i * 1.4}" stroke="#4a4b52" stroke-width="2" stroke-dasharray="4 1.4"/>`).join("")}
<ellipse cx="160" cy="162" rx="8" ry="11" fill="#2a2b30"/><path d="M160 152 V160" stroke="#555"/>`;
      return svg(x, { bg, fx }, lg(x.id("wp"), [[0, "#3a2a7a"], [.5, "#c25a8a"], [1, "#f3a66a"]], 0, 0, 0, 1) + lg(x.id("desk"), [[0, "#a07a50"], [1, "#6a4a2e"]], 0, 0, 0, 1));
    } }),

    base({ id: "router", name: "Wi-Fi router", colorLabel: "Body", colors: [BLACK, WHITE, GRAY, "#3a4a5a"], render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="124" fill="#4a4e58"/><rect x="8" y="132" width="184" height="60" fill="url(#${x.id("shelf")})"/><path d="M8 132 H192" stroke="#fff" stroke-opacity=".25"/>`;
      // (parts) Power (the lights), Internet (the second light), Wi-Fi (the waves), Activity (the port lights blink)
      const rp = MF.pw(o);
      const ant = (bx, by, a) => `<g transform="translate(${bx} ${by}) rotate(${a})"><rect x="-4" y="-66" width="8" height="66" rx="4" fill="${x.url("bdh")}"/><rect x="-5" y="-6" width="10" height="8" rx="2" fill="${H.shade(x.c, -.3)}"/>${hl("M-2 -62 V-8", .3, 1)}</g>`;
      const fx = shadow(x, 100, 150, 74, 6) + ant(48, 108, -14) + ant(80, 104, -4) + ant(120, 104, 4) + ant(152, 108, 14) +
        `<path d="M24 140 L40 108 H160 L176 140 Z" fill="${x.url("bd")}"/><path d="M24 140 H176 L172 148 H28 Z" fill="${H.shade(x.c, -.35)}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${62 + i * 9} 114 L${58 + i * 10} 132" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`).join("")}
${Array.from({ length: 7 }, (_, i) => led(58 + i * 14, 143.6, 1.2, i === 0 ? "#ffffff" : "#7fd8ff", !o.mf ? x.on : i === 1 ? rp && MF.on(o, "net") : rp, i * .23, i > 1 && (!o.mf || MF.on(o, "act")))).join("")}${hl("M44 110 H156", .25, 1)}` +
        ((!o.mf ? x.on : rp && MF.on(o, "wifi")) ? [0, 1, 2].map((i) => `<path d="M${88 - i * 8} ${34 - i * 6} Q100 ${24 - i * 8} ${112 + i * 8} ${34 - i * 6}" stroke="#7fd8ff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round" class="${P}wave" style="animation-delay:-${(i * .35).toFixed(2)}s"/>`).join("") : "");
      return svg(x, { bg, fx }, lg(x.id("shelf"), [[0, "#a07a50"], [1, "#5a3e24"]], 0, 0, 0, 1));
    }, parts: [{ id: "power", name: "Power" }, { id: "net", name: "Internet", type: "contact" }, { id: "wifi", name: "Wi-Fi" }, { id: "act", name: "Activity", type: "contact" }] }),

    base({ id: "mesh", name: "Mesh Wi-Fi pair", colorLabel: "Body", colors: [WHITE, BLACK, GRAY, "#d8d0c4"], render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="128" fill="#55606a"/><rect x="8" y="136" width="184" height="56" fill="url(#${x.id("shelf")})"/><path d="M8 136 H192" stroke="#fff" stroke-opacity=".25"/><path d="M8 100 H192" stroke="#000" stroke-opacity=".15"/>
<path d="M150 110 L156 100 H176 L180 110 Z" fill="#2a4a2a"/><rect x="156" y="110" width="22" height="26" fill="#d8d0c4"/>`;
      // (parts) Main node and Satellite node (online = its light); the link waves show while both are online
      const n1 = MF.on(o, "n1"), n2 = MF.on(o, "n2");
      const node = (cx, s, on) => `<g transform="translate(${cx} 140) scale(${s})">${shadow(x, 0, 0, 24, 4)}<rect x="-20" y="-78" width="40" height="78" rx="10" fill="${x.url("bdh")}"/><ellipse cx="0" cy="-78" rx="20" ry="5" fill="${x.url("bdt")}"/>
${Array.from({ length: 5 }, (_, i) => `<path d="M-10 ${-60 + i * 4} H10" stroke="#000" stroke-opacity=".12"/>`).join("")}<path d="M-20 -10 H20" stroke="#000" stroke-opacity=".2"/>${led(0, -16, 1.6, "#7fd8ff", on, 0, false)}${hl("M-14 -72 V-8", .4, 1.6)}</g>`;
      const fx = node(58, 1, !o.mf ? x.on : n1) + node(136, .82, !o.mf ? x.on : n2) + ((!o.mf ? x.on : n1 && n2) ? [0, 1, 2].map((i) => `<path d="M${80 + i * 4} 80 Q97 ${68 - i * 3} ${114 - i * 4} 84" stroke="#7fd8ff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round" class="${P}wave" style="animation-delay:-${(i * .35).toFixed(2)}s"/>`).join("") : "");
      return svg(x, { bg, fx }, lg(x.id("shelf"), [[0, "#c9b48e"], [1, "#7a6040"]], 0, 0, 0, 1));
    }, parts: [{ id: "n1", name: "Main node", type: "contact" }, { id: "n2", name: "Satellite node", type: "contact" }] }),

    base({ id: "rollershutter", name: "Roller shutter", colorLabel: "Body", colors: [WHITE, "#3c4046", BEIGE, "#5a4636", GRAY], onWord: "Down", offWord: "Up", render(o) {
      const x = ctx(o), down = x.on ? x.lv : 0, wy = 52, wh = 112, sh = wh * down;
      const bg = siding(x, 8, 192, "#c7c1b5").replace('fill="#c7c1b5"', 'fill="#6e6a62"');
      let slats = ""; for (let y = wy; y < wy + sh - .5; y += 6) slats += `<rect x="46" y="${f(y)}" width="108" height="6" fill="${x.url("bd")}"/><path d="M46 ${f(y + 5.6)} H154" stroke="#000" stroke-opacity=".35"/>`;
      const fx = `<rect x="38" y="${wy - 4}" width="124" height="${wh + 12}" fill="#e8e4dc"/><rect x="46" y="${wy}" width="108" height="${wh}" fill="${x.url("glass")}"/><path d="M100 ${wy} V${wy + wh} M46 ${wy + wh * .45} H154" stroke="#e8e4dc" stroke-width="3.4"/><path d="M50 ${wy + 4} L84 ${wy + 4} L50 ${wy + 60} Z" fill="#fff" fill-opacity=".07"/>
<rect x="56" y="${wy + 20}" width="20" height="30" fill="#d8b070" fill-opacity=".25"/>${slats}${down > 0 ? `<rect x="46" y="${f(wy + sh - 4)}" width="108" height="5" fill="${H.shade(x.c, -.35)}"/>` : ""}
<rect x="40" y="${wy}" width="6" height="${wh}" fill="${x.url("bdh")}"/><rect x="154" y="${wy}" width="6" height="${wh}" fill="${x.url("bdh")}"/>
<rect x="36" y="${wy - 22}" width="128" height="22" rx="2" fill="${x.url("bd")}"/><path d="M36 ${wy - 2} H164" stroke="#000" stroke-opacity=".35"/>${hl(`M40 ${wy - 19} H160`, .4, 1)}<rect x="32" y="${wy + wh + 6}" width="136" height="6" fill="#d8d2c6"/>`;
      return svg(x, { bg, fx });
    } }),

    base({ id: "swingshutters", name: "Swing shutters", colorLabel: "Body", colors: ["#2a3a4a", "#2f4a34", BLACK, WHITE, "#7a2a24", "#b98a5a"], onWord: "Closed", offWord: "Open", render(o) {
      const x = ctx(o);
      const bg = siding(x, 8, 192, "#a8a094").replace('fill="#a8a094"', 'fill="#8a8478"') + `<rect x="8" y="170" width="184" height="22" fill="#2a3a24"/>${Array.from({ length: 14 }, (_, i) => `<circle cx="${14 + i * 14}" cy="${170 + (i % 3) * 3}" r="8" fill="#2f4a2a"/>`).join("")}`;
      const panel = (px, py, w, h) => `<rect x="${px}" y="${py}" width="${w}" height="${h}" fill="${x.url("bd")}"/><rect x="${px + 3}" y="${py + 3}" width="${w - 6}" height="${h / 2 - 5}" fill="${H.shade(x.c, -.3)}"/><rect x="${px + 3}" y="${py + h / 2 + 2}" width="${w - 6}" height="${h / 2 - 5}" fill="${H.shade(x.c, -.3)}"/>
${Array.from({ length: Math.floor(h / 5) }, (_, i) => (py + 5 + i * 5 < py + h / 2 - 2 || py + 5 + i * 5 > py + h / 2 + 3) && py + 5 + i * 5 < py + h - 3 ? `<path d="M${px + 3} ${py + 5 + i * 5} H${px + w - 3} L${px + w - 3} ${py + 7 + i * 5} H${px + 3} Z" fill="${x.url("bdh")}"/>` : "").join("")}
<rect x="${px}" y="${py}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-opacity=".4"/>`;
      const wx = 62, wy = 40, ww = 76, wh = 116;
      const fx = `<rect x="${wx - 6}" y="${wy - 6}" width="${ww + 12}" height="${wh + 14}" fill="#ecebe6"/><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${x.url("glass")}"/><path d="M${wx + ww / 2} ${wy} V${wy + wh} M${wx} ${wy + wh / 2} H${wx + ww}" stroke="#ecebe6" stroke-width="3.4"/><rect x="${wx - 10}" y="${wy + wh + 6}" width="${ww + 20}" height="5" fill="#ecebe6"/>` +
        (x.on ? drop(x, `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}"/>`, 2, 3, .45) + panel(wx, wy, ww / 2, wh) + panel(wx + ww / 2, wy, ww / 2, wh) + `<rect x="${wx + ww / 2 - 1.6}" y="${wy + wh / 2 - 6}" width="3.2" height="12" fill="#222"/>`
          : drop(x, `<rect x="${wx - 46}" y="${wy}" width="38" height="${wh}"/><rect x="${wx + ww + 8}" y="${wy}" width="38" height="${wh}"/>`, 2, 3, .45) + panel(wx - 46, wy, 38, wh) + panel(wx + ww + 8, wy, 38, wh) +
            `<path d="M${wx - 8} ${wy + 20} h-4 M${wx - 8} ${wy + wh - 20} h-4 M${wx + ww + 8} ${wy + 20} h4 M${wx + ww + 8} ${wy + wh - 20} h4" stroke="#111" stroke-width="2.4"/>`);
      return svg(x, { bg, fx });
    } }),

    base({ id: "mailbox", name: "Through-wall mailbox", colors: ["#c9a24a", BLACK, "#b8bdc4", "#5a4636", "#2f4a34"], onWord: "Mail", offWord: "Empty", render(o) {
      const x = ctx(o);
      const bg = bricks(8, 8, 192, 192, 7);
      const fx = drop(x, `<rect x="44" y="60" width="112" height="72" rx="6"/>`, 2, 6, .55) + `<rect x="44" y="60" width="112" height="72" rx="6" fill="${x.url("bd")}"/><rect x="48" y="64" width="104" height="64" rx="4" fill="none" stroke="#fff" stroke-opacity=".25"/>
<rect x="60" y="84" width="80" height="14" rx="3" fill="#0c0c10"/><path d="M58 82 H142 L138 88 H62 Z" fill="${x.url("bdt")}"/>${x.on ? `<path d="M70 96 L72 84 H112 L114 96 Z" fill="#f4efe2"/><path d="M72 84 L92 92 L112 84" stroke="#b8b0a0" fill="none" stroke-width=".8"/>` : ""}
${[56, 144].map((a) => [68, 124].map((b) => `<circle cx="${a}" cy="${b}" r="2" fill="${H.shade(x.c, -.3)}"/>`).join("")).join("")}
<rect x="84" y="108" width="32" height="10" rx="2" fill="${H.shade(x.c, -.25)}"/>${led(100, 113, 1.6, "#ff5a3a", x.on, 0, true)}
<g transform="translate(160 104) rotate(${x.on ? -90 : 0})"><rect x="-2" y="-3" width="26" height="6" rx="1" fill="#d83a2a"/><rect x="16" y="-6" width="10" height="12" rx="1" fill="#d83a2a"/></g><circle cx="160" cy="104" r="3" fill="${H.shade(x.c, -.3)}"/>${hl("M50 66 H150", .45, 1.2)}`;
      return svg(x, { bg, fx });
    } }),

    base({ id: "gardenbed", name: "Raised garden bed", colors: ["#b87a4a", "#8a8378", "#2a2c31", "#a8b0b8", "#6a4a32"], onWord: "Watered", offWord: "Dry", render(o) {
      const x = ctx(o), r = rnd(51), soil = x.on ? "#2a1a10" : "#7a5a3a";
      const bg = `<rect x="8" y="8" width="184" height="70" fill="${x.url("sky")}"/><rect x="8" y="64" width="184" height="18" fill="#7a6a5a"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${8 + i * 12}" y="56" width="9" height="26" fill="#8a7a66"/>`).join("")}<rect x="8" y="78" width="184" height="114" fill="${x.url("lawn")}"/>`;
      let plants = "";
      [[46, 110], [70, 106], [96, 112], [120, 104], [146, 110]].forEach(([px, py], i) => {
        if (i % 2 === 0) { for (let k = 0; k < 7; k++) { const a = -80 + k * 27; plants += `<ellipse cx="${f(px + Math.cos(a * Math.PI / 180 - Math.PI / 2) * 6)}" cy="${f(py - 6 + Math.sin(a * Math.PI / 180 - Math.PI / 2) * 6)}" rx="7" ry="4.4" fill="${H.mix("#7ac05a", "#3a8a3a", r())}" transform="rotate(${a} ${f(px)} ${f(py - 6)})"/>`; } }
        else { plants += `<path d="M${px} ${py} V${py - 50}" stroke="#a88a5a" stroke-width="2"/><path d="M${px} ${py - 4} C${px - 8} ${py - 20} ${px + 8} ${py - 30} ${px} ${py - 44}" stroke="#3a7a34" stroke-width="2.4" fill="none"/>`;
          for (let k = 0; k < 6; k++) plants += `<ellipse cx="${px + (k % 2 ? 7 : -7)}" cy="${py - 10 - k * 6}" rx="6" ry="3" fill="#3f8a3a" transform="rotate(${k % 2 ? 20 : -20} ${px + (k % 2 ? 7 : -7)} ${py - 10 - k * 6})"/>`;
          plants += `<circle cx="${px - 5}" cy="${py - 22}" r="4.4" fill="#d83a2a"/><circle cx="${px + 6}" cy="${py - 32}" r="3.8" fill="#e85a2a"/><circle cx="${px - 4}" cy="${py - 38}" r="3.4" fill="#7ab040"/>`; }
      });
      const fx = shadow(x, 100, 168, 86, 8) + `<path d="M24 112 L40 96 H176 L160 112 Z" fill="${soil}"/>${Array.from({ length: 30 }, () => `<circle cx="${f(40 + r() * 124)}" cy="${f(98 + r() * 12)}" r="${f(.6 + r())}" fill="#000" fill-opacity=".3"/>`).join("")}
<path d="M30 108 H168" stroke="#222" stroke-width="1.6"/>` + plants +
        `<rect x="22" y="112" width="140" height="48" fill="${x.url("bd")}"/>${[124, 136, 148].map((y) => `<path d="M22 ${y} H162" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>`).join("")}${Array.from({ length: 6 }, () => `<path d="M${f(30 + r() * 120)} ${f(116 + r() * 40)} h${f(8 + r() * 12)}" stroke="#000" stroke-opacity=".15"/>`).join("")}
<path d="M162 112 L178 96 V144 L162 160 Z" fill="${x.url("bds")}"/><rect x="18" y="108" width="148" height="6" fill="${x.url("bdt")}"/><path d="M166 108 L182 92 V98 L166 114 Z" fill="${x.url("bds")}"/>
<rect x="20" y="112" width="6" height="50" fill="${H.shade(x.c, -.2)}"/><rect x="158" y="112" width="6" height="50" fill="${H.shade(x.c, -.25)}"/>` +
        (x.on ? [50, 82, 110, 140].map((a, i) => `<g class="${P}drip" style="animation-delay:-${(i * .3).toFixed(1)}s"><path d="M${a} 104 c-1.2 2 -1.2 3.4 0 3.8 c1.2 -.4 1.2 -1.8 0 -3.8 Z" fill="#9fd8ff"/></g>`).join("") + `<path d="M40 103 H170" stroke="#9fd8ff" stroke-opacity=".25" stroke-width="2"/>` : "");
      return svg(x, { bg, fx });
    } }),

    base({ id: "mousetrap", name: "Smart mouse trap", colorLabel: "Body", colors: [BLACK, WHITE, GRAY, "#3a4a3a"], onWord: "Caught", offWord: "Empty",
      options: [{ id: "style", name: "Style", values: [["box", "Smart box"], ["zapper", "Zapper station"]] }], render(o) {
      const x = ctx(o), zap = o.opt && o.opt.style === "zapper";
      const bg = `<rect x="8" y="8" width="184" height="128" fill="#6a665e"/><rect x="8" y="120" width="184" height="16" fill="#e8e4dc"/><path d="M8 120 H192" stroke="#000" stroke-opacity=".2"/>` + floorBoards(x, 138).replace(/<rect x="8" y="135"[^>]*>/, "");
      let fx;
      if (!zap) {
        fx = shadow(x, 104, 172, 70, 7) + `<path d="M40 166 L40 118 Q40 108 54 106 L150 104 Q166 104 168 116 L170 166 Z" fill="${x.url("bd")}"/><path d="M168 116 L184 108 V158 L170 166 Z" fill="${x.url("bds")}"/>
<path d="M40 118 Q40 108 54 106 L150 104 Q166 104 168 116 L184 108 Q182 98 166 96 L70 98 Q52 100 50 108 Z" fill="${x.url("bdt")}"/>
<path d="M46 166 V132 Q46 124 56 124 H72 Q80 124 80 132 V166 Z" fill="#0a0a0c"/>${x.on ? mouseRear(x, 54, 160, 1.15) : `<path d="M48 166 V134 Q48 126 56 126 H70" stroke="#333" fill="none"/>`}
<rect x="116" y="124" width="36" height="14" rx="2" fill="#0e1014"/>${trapLed(x, 124, 131)}<circle cx="134" cy="131" r="1.4" fill="#2a2c30"/><circle cx="142" cy="131" r="1.4" fill="#2a2c30"/>
${Array.from({ length: 4 }, (_, i) => `<path d="M${100 + i * 6} 110 l2 0" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/>`).join("")}${hl("M54 112 L150 108", .3, 1.4)}`;
      } else {
        fx = shadow(x, 104, 172, 60, 6) + box3(x, 54, 92, 90, 76, 18, 6);
        fx += `<path d="M62 168 V138 Q62 128 74 128 H86 Q98 128 98 138 V168 Z" fill="#0a0a0c"/>` + (x.on ? mouseRear(x, 70, 162, 1.15) : `<path d="M64 166 V140" stroke="#333" stroke-width="1"/>`);
        fx += `<rect x="108" y="100" width="28" height="22" rx="3" fill="#000" fill-opacity=".25"/><path d="M112 104 H132 M112 110 H132 M112 116 H132" stroke="#fff" stroke-opacity=".12"/>`;
        fx += `<path d="M120 132 l-6 10 h5 l-3 9 9 -12 h-5 l3 -7 z" fill="${x.on ? "#5a5c62" : "#ffd23e"}"/>` + trapLed(x, 128, 160) + hl("M60 96 L136 96", .35, 1.2);
      }
      return svg(x, { bg, fx });
    } }),

    base({ id: "snapsensor", name: "Snap trap + sensor", colorLabel: "Sensor", colors: [BLACK, WHITE, "#2f6fb8", "#d8402f"], onWord: "Caught", offWord: "Set", render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="128" fill="#6a665e"/><rect x="8" y="120" width="184" height="16" fill="#e8e4dc"/><path d="M8 120 H192" stroke="#000" stroke-opacity=".2"/>` + floorBoards(x, 138);
      const wood = `M36 166 L52 142 H166 L150 166 Z`;
      let fx = shadow(x, 100, 170, 70, 6) + `<path d="${wood}" fill="${x.url("wood")}"/><path d="M36 166 H150 V171 H36 Z" fill="#6a3e22"/><path d="M150 166 L166 142 V147 L150 171 Z" fill="#5a3218"/>`;
      fx += `<path d="M60 150 H130" stroke="#3a1f0c" stroke-opacity=".25"/><path d="M58 158 H124" stroke="#3a1f0c" stroke-opacity=".2"/>`;
      fx += `<ellipse cx="106" cy="154" rx="10" ry="3.4" fill="#e8c34a"/><ellipse cx="106" cy="153" rx="7" ry="2" fill="#f6e08a"/>`;
      fx += `<path d="M76 156 a6 3 0 1 0 12 0 a6 3 0 1 0 -12 0" fill="none" stroke="${x.url("chr")}" stroke-width="2.2"/>`;
      fx += x.on ? mouseSide(x, 100, 151) + `<path d="M82 156 L96 142 L132 142" fill="none" stroke="#c9ced6" stroke-width="2.2"/><path d="M84 156 L132 160" stroke="#c9ced6" stroke-width="2"/>`
        : `<path d="M82 156 L58 148 L62 144 L138 144 L134 148 L110 156" fill="none" stroke="#c9ced6" stroke-width="2"/><path d="M60 146 H136" stroke="#fff" stroke-opacity=".5"/>`;
      fx += drop(x, `<rect x="140" y="128" width="26" height="22" rx="4"/>`, 2, 3, .45) + `<rect x="140" y="128" width="26" height="22" rx="4" fill="${x.url("bd")}"/><rect x="140" y="128" width="26" height="6" rx="3" fill="${x.url("bdt")}"/>` +
        `<path d="M146 150 V158 M160 150 V158" stroke="#9aa0a8" stroke-width="2"/>` + trapLed(x, 153, 140);
      return svg(x, { bg, fx });
    } }),

    base({ id: "multicatch", name: "Multi-catch box", colorLabel: "Body", colors: [STEEL, GRAY, BLACK, "#3a5a3a"], onWord: "Caught", offWord: "Empty", render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="128" fill="#5e5a54"/><rect x="8" y="120" width="184" height="16" fill="#e8e4dc"/><path d="M8 120 H192" stroke="#000" stroke-opacity=".2"/>` + floorBoards(x, 138);
      let fx = shadow(x, 104, 172, 76, 6) + box3(x, 30, 132, 136, 36, 16, 2);
      fx += `<path d="M40 132 L56 125 H150 L166 132 Z" fill="#bfe0f2" fill-opacity=".25"/>`;
      fx += `<path d="M36 168 V150 Q36 144 44 144 H54 Q62 144 62 150 V168 Z" fill="#0a0a0c"/><path d="M134 168 V150 Q134 144 142 144 H152 Q160 144 160 150 V168 Z" fill="#0a0a0c"/>`;
      for (let i = 0; i < 6; i++) fx += `<path d="M${72 + i * 9} 140 V160" stroke="#000" stroke-opacity=".18" stroke-width="1.4"/>`;
      if (x.on) fx += mouseRear(x, 44, 163, 1);
      fx += `<rect x="92" y="148" width="20" height="10" rx="2" fill="#0e1014"/>` + trapLed(x, 98, 153) + hl("M34 134 H160", .3, 1);
      return svg(x, { bg, fx });
    } }),

    base({ id: "clamptrap", name: "Clamp trap", colorLabel: "Body", colors: [WHITE, BLACK, "#d8402f", "#3a6a4a"], onWord: "Caught", offWord: "Set", render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="128" fill="#6a665e"/><rect x="8" y="120" width="184" height="16" fill="#e8e4dc"/><path d="M8 120 H192" stroke="#000" stroke-opacity=".2"/>` + floorBoards(x, 138);
      const teeth = (x0, y, dir) => { let d = `M${x0} ${y}`; for (let i = 0; i < 6; i++) d += ` l3 ${dir * 5} l3 ${-dir * 5}`; return `<path d="${d}" fill="#f4f4f2" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>`; };
      let fx = shadow(x, 106, 170, 64, 6) + `<path d="M50 166 L58 152 H156 Q166 152 166 160 V166 Z" fill="${x.url("bd")}"/><path d="M50 166 H166 V170 H50 Z" fill="${H.shade(x.c, -.4)}"/>
<path d="M60 152 H102 V158 H60 Z" fill="${H.shade(x.c, -.15)}"/>${teeth(66, 152, -1)}<ellipse cx="96" cy="156" rx="9" ry="2.6" fill="${H.shade(x.c, -.3)}"/>`;
      if (x.on) fx += mouseRear(x, 66, 154, 1);
      const upper = `<path d="M132 148 C120 128 96 124 66 132 L64 140 C92 134 116 136 128 152 Z" fill="${x.url("bd")}"/><path d="M68 134 C92 128 114 130 128 146" fill="none" stroke="#fff" stroke-opacity=".4"/>${teeth(64, 140, 1)}`;
      fx += `<g transform="rotate(${x.on ? 9 : -26} 132 148)">${upper}</g>`;
      fx += `<path d="M126 146 L160 132 L166 140 L134 154 Z" fill="${x.url("bdh")}"/><path d="M150 136 l4 8 M156 134 l4 8" stroke="#000" stroke-opacity=".25"/><circle cx="132" cy="149" r="5" fill="${H.shade(x.c, -.2)}"/><circle cx="132" cy="149" r="2" fill="#9aa0a8"/>`;
      return svg(x, { bg, fx });
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "extras",
    tab: "Home extras",
    group: "Home",
    kind: "device",
    onWord: "On", offWord: "Off",
    intro: "Freezers, a kegerator, a server rack, a boom barrier, a tree with lights, small appliances, routers, shutters, a mailbox, a garden bed and four mouse traps, all in their own setting.",
    
    css: `.hda-anim .hda-extras-blink{animation:hda-extras-blink 1.2s steps(1) infinite}
@keyframes hda-extras-blink{0%{opacity:1}50%{opacity:.2}}
.hda-anim .hda-extras-tw{animation:hda-extras-tw 2.2s ease-in-out infinite}
@keyframes hda-extras-tw{0%,100%{opacity:1}50%{opacity:.3}}
.hda-anim .hda-extras-steam{animation:hda-extras-steam 2.2s ease-out infinite}
@keyframes hda-extras-steam{0%{transform:translate(0,0);opacity:.9}100%{transform:translate(-10px,-40px);opacity:0}}
.hda-anim .hda-extras-flow{animation:hda-extras-flow .8s linear infinite}
@keyframes hda-extras-flow{to{stroke-dashoffset:28}}
.hda-anim .hda-extras-wave{animation:hda-extras-wave 1.4s ease-in-out infinite}
@keyframes hda-extras-wave{0%,100%{opacity:.15}50%{opacity:1}}
.hda-anim .hda-extras-drip{animation:hda-extras-drip 1s ease-in infinite}
@keyframes hda-extras-drip{0%{transform:translate(0,0);opacity:1}100%{transform:translate(0,10px);opacity:0}}
.hda-anim .hda-extras-pour{animation:hda-extras-pour .5s linear infinite}
@keyframes hda-extras-pour{0%{transform:translate(0,0)}100%{transform:translate(0,4px)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-extras-blink,.hda-anim .hda-extras-tw,.hda-anim .hda-extras-steam,.hda-anim .hda-extras-flow,.hda-anim .hda-extras-wave,.hda-anim .hda-extras-drip,.hda-anim .hda-extras-pour{animation:none}}`,
    icons,
  });
})();
