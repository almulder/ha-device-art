(function () {
  const P = "hda-vacuum-";
  const H = () => window.HDAH;
  const WH = "#eef0f2", BK = "#2b2d33", SV = "#c4c9d0", GR = "#7d838c", BL = "#3e6db3";
  const SW = [WH, BK, SV, GR, BL];
  const sw = (first) => [first].concat(SW.filter((c) => c !== first));
  const GREEN = "#34d399", CYAN = "#67e8f9", WHITE = "#eef4ff", AMBER = "#ffb547", RED = "#ff4d5e", VIO = "#c4b5fd", BLUE = "#5aa9ff";
  const LEDS = { g: GREEN, c: CYAN, w: WHITE, a: AMBER, r: RED, v: VIO, b: BLUE };
  const K = .55;
  const n1 = (v) => (+v).toFixed(1);
  const live = (o) => o.on && o.anim;
  const rad = (a) => a * Math.PI / 180;
  const pt = (r, a) => `${n1(r * Math.cos(rad(a)))} ${n1(r * Math.sin(rad(a)))}`;
  function rng(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

  function pal(c) { const h = H(); return { l: h.shade(c, .55), m: c, d: h.shade(c, -.28), k: h.shade(c, -.55), e: h.shade(c, -.42) }; }

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    const halos = Object.keys(LEDS).map((k) => `<radialGradient id="${u}-h${k}"><stop offset="0" stop-color="${LEDS[k]}" stop-opacity=".8"/><stop offset=".45" stop-color="${LEDS[k]}" stop-opacity=".25"/><stop offset="1" stop-color="${LEDS[k]}" stop-opacity="0"/></radialGradient>`).join("");
    return `<defs>
<linearGradient id="${u}-c" x1="0" x2="1"><stop offset="0" stop-color="${p.k}"/><stop offset=".28" stop-color="${p.l}"/><stop offset=".6" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-sd" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<radialGradient id="${u}-s" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></radialGradient>
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-edge" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
<linearGradient id="${u}-dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f333b"/><stop offset="1" stop-color="#101216"/></linearGradient>
<linearGradient id="${u}-dc" x1="0" x2="1"><stop offset="0" stop-color="#0e1013"/><stop offset=".32" stop-color="#454a53"/><stop offset="1" stop-color="#0c0e11"/></linearGradient>
<radialGradient id="${u}-tt" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#5b616b"/><stop offset=".6" stop-color="#25282e"/><stop offset="1" stop-color="#121418"/></radialGradient>
<radialGradient id="${u}-glass" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#4b5260"/><stop offset=".5" stop-color="#1a1d24"/><stop offset="1" stop-color="#07080b"/></radialGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".5" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-stv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8ecf0"/><stop offset=".5" stop-color="#9aa1aa"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe9ff" stop-opacity=".55"/><stop offset="1" stop-color="#3a8fd6" stop-opacity=".85"/></linearGradient>
<linearGradient id="${u}-dw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a39a86" stop-opacity=".7"/><stop offset="1" stop-color="#4f4636" stop-opacity=".95"/></linearGradient>
<linearGradient id="${u}-clr" x1="0" x2="1"><stop offset="0" stop-color="#dff4ff" stop-opacity=".28"/><stop offset=".35" stop-color="#dff4ff" stop-opacity=".08"/><stop offset="1" stop-color="#dff4ff" stop-opacity=".2"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".6" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-fv" gradientUnits="userSpaceOnUse" cx="100" cy="132" r="100" gradientTransform="translate(100 132) scale(1 .66) translate(-100 -132)"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="${u}-fd" gradientUnits="userSpaceOnUse" cx="100" cy="132" r="100" gradientTransform="translate(100 132) scale(1 .66) translate(-100 -132)"><stop offset=".35" stop-color="#0a0818" stop-opacity="0"/><stop offset="1" stop-color="#0a0818" stop-opacity=".45"/></radialGradient>
<mask id="${u}-fm" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="url(#${u}-fv)"/></mask>
<linearGradient id="${u}-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f4ff" stop-opacity=".55"/><stop offset="1" stop-color="#e8f4ff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-scan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${VIO}" stop-opacity="0"/><stop offset="1" stop-color="${VIO}" stop-opacity=".5"/></linearGradient>
<pattern id="${u}-mopp" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#cfd6de"/><circle cx="1" cy="1" r="1" fill="#fff" fill-opacity=".8"/><circle cx="3" cy="3" r="1" fill="#9aa3ad" fill-opacity=".6"/></pattern>
<pattern id="${u}-grip" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#202328"/><rect width="1.5" height="3" fill="#33373e"/></pattern>
${halos}${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const floorWrap = (...a) => BGW(floorWrap_(...a));
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"/>`;
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);

  function led(o, x, y, r, k, cls, force) {
    const on = force == null ? o.on : force;
    if (!on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#3e434b"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".18"/>`;
    const c = LEDS[k || "g"];
    return `<g class="${P}${cls || "pulse"}"><circle cx="${x}" cy="${y}" r="${n1(r * 3.6)}" fill="url(#${o.uid}-h${k || "g"})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/></g><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .4)}" fill="#fff" fill-opacity=".85"/>`;
  }
  const spinA = (o, on, rev, d) => (on && o.anim ? `class="${P}${rev ? "spinr" : "spin"}" style="animation-duration:${d}s"` : "");

  function floorWrap_(o, inner, nd) { return `<g mask="url(#${o.uid}-fm)">${inner}${nd ? "" : `<rect x="0" y="30" width="200" height="170" fill="url(#${o.uid}-fd)"/>`}</g>`; }
  function wood(o, base, seed, y0) {
    const h = H(), r = rng(seed || 7); y0 = y0 || 44;
    let s = `<rect x="0" y="${y0}" width="200" height="${200 - y0}" fill="${base}"/>`, y = y0, hh = 7;
    let i = 0;
    while (y < 200) {
      s += `<rect x="0" y="${n1(y)}" width="200" height="${n1(hh)}" fill="${h.shade(base, (r() - .5) * .22)}"/>`;
      for (let g = 0; g < 2; g++) { const gx = r() * 160, gw = 30 + r() * 60, gy = y + hh * (.3 + r() * .5);
        s += `<path d="M${n1(gx)} ${n1(gy)}q${n1(gw / 2)} ${n1((r() - .5) * 2)} ${n1(gw)} 0" fill="none" stroke="${h.shade(base, -.35)}" stroke-opacity=".35" stroke-width=".6"/>`; }
      s += `<rect x="0" y="${n1(y)}" width="200" height=".8" fill="#000" fill-opacity=".35"/><rect x="0" y="${n1(y + .8)}" width="200" height=".6" fill="#fff" fill-opacity=".1"/>`;
      let jx = (i * 61 + r() * 50) % 140 - 20;
      while (jx < 200) { s += `<rect x="${n1(jx)}" y="${n1(y)}" width=".9" height="${n1(hh)}" fill="#000" fill-opacity=".3"/>`; jx += 90 + r() * 60; }
      y += hh; hh *= 1.15; i++;
    }
    return s + `<ellipse cx="62" cy="86" rx="60" ry="22" fill="#fff" fill-opacity=".07"/>`;
  }
  function tile(o, c1, c2, opts) {
    opts = opts || {}; const h = H(), ys = opts.ys || [48, 60, 74, 91, 111, 135, 164, 200], V = -150, st = opts.step || 30;
    const X = (d, y) => 100 + d * (y - V) / (48 - V);
    let s = `<rect x="0" y="${ys[0]}" width="200" height="${200 - ys[0]}" fill="${c1}"/>`;
    for (let i = 0; i < ys.length - 1; i++) for (let j = -6; j < 6; j++) {
      const a = ys[i], b = ys[i + 1], d0 = j * st, d1 = (j + 1) * st;
      if ((i + j) % 2 === 0 || opts.check) s += `<path d="M${n1(X(d0, a))} ${a}L${n1(X(d1, a))} ${a}L${n1(X(d1, b))} ${b}L${n1(X(d0, b))} ${b}Z" fill="${(i + j) % 2 === 0 ? c2 : h.shade(c1, .04)}"/>`;
    }
    for (let i = 0; i < ys.length; i++) s += `<rect x="0" y="${ys[i] - .5}" width="200" height="1.1" fill="${opts.grout || "#000"}" fill-opacity="${opts.go || .28}"/>`;
    for (let j = -6; j <= 6; j++) s += `<path d="M${n1(X(j * st, ys[0]))} ${ys[0]}L${n1(X(j * st, 200))} 200" stroke="${opts.grout || "#000"}" stroke-opacity="${opts.go || .28}" stroke-width="1"/>`;
    return s + `<ellipse cx="128" cy="92" rx="56" ry="20" fill="#fff" fill-opacity=".1"/>`;
  }
  function rug(o, col, kind, q) {
    const h = H(); q = q || [30, 84, 170, 84, 188, 182, 12, 182];
    const [ax, ay, bx, by, cx, cy, dx, dy] = q;
    const lerp = (a, b, t) => a + (b - a) * t;
    const inset = (t) => { const ty = t * (dy - ay) * .5; const tx = t; return `M${n1(lerp(ax, cx, tx * .5))} ${n1(ay + ty * .55)}L${n1(lerp(bx, dx, tx * .5))} ${n1(by + ty * .55)}L${n1(lerp(cx, ax, tx * .5))} ${n1(cy - ty)}L${n1(lerp(dx, bx, tx * .5))} ${n1(dy - ty)}Z`; };
    let s = `<path d="M${ax} ${ay + 3}L${bx} ${by + 3}L${cx} ${cy + 3}L${dx} ${dy + 3}Z" fill="#000" fill-opacity=".35"/>`;
    s += `<path d="M${ax} ${ay}L${bx} ${by}L${cx} ${cy}L${dx} ${dy}Z" fill="${col}"/>`;
    if (kind === "border") {
      s += `<path d="${inset(.07)}" fill="none" stroke="${h.shade(col, -.35)}" stroke-width="6"/><path d="${inset(.07)}" fill="none" stroke="${h.shade(col, .35)}" stroke-width="1.2"/>`;
      s += `<path d="${inset(.2)}" fill="${h.shade(col, -.12)}"/><path d="${inset(.32)}" fill="none" stroke="${h.shade(col, .25)}" stroke-opacity=".6" stroke-width="1.2" stroke-dasharray="3 3"/>`;
    } else if (kind === "stripe") {
      for (let i = 1; i < 9; i++) { const t = i / 9; s += `<path d="M${n1(lerp(ax, dx, t))} ${n1(lerp(ay, dy, t))}L${n1(lerp(bx, cx, t))} ${n1(lerp(by, cy, t))}" stroke="${i % 2 ? h.shade(col, -.25) : h.shade(col, .22)}" stroke-width="${n1(2 + t * 3)}" stroke-opacity=".6"/>`; }
    } else if (kind === "shag") {
      const r = rng(31); for (let i = 0; i < 160; i++) { const t = r(), w = r(); const x = lerp(lerp(ax, dx, t), lerp(bx, cx, t), w), y = lerp(ay, dy, t);
        s += `<path d="M${n1(x)} ${n1(y)}l${n1((r() - .5) * 2)} ${n1(-1.5 - t * 2)}" stroke="${r() > .5 ? h.shade(col, .3) : h.shade(col, -.3)}" stroke-width="1" stroke-linecap="round" stroke-opacity=".7"/>`; }
    } else if (kind === "play") {
      const cols = ["#f87171", "#fbbf24", "#34d399", "#60a5fa"];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const t0 = j / 3, t1 = (j + 1) / 3, w0 = i / 4, w1 = (i + 1) / 4;
        const P1 = (t, w) => `${n1(lerp(lerp(ax, dx, t), lerp(bx, cx, t), w))} ${n1(lerp(ay, dy, t))}`;
        s += `<path d="M${P1(t0, w0)}L${P1(t0, w1)}L${P1(t1, w1)}L${P1(t1, w0)}Z" fill="${cols[(i + j) % 4]}" fill-opacity=".55" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>`; }
    }
    for (let i = 0; i <= 44; i++) { const x = lerp(dx, cx, i / 44); s += `<path d="M${n1(x)} ${cy}l${n1((i % 3 - 1) * .6)} 4" stroke="${h.shade(col, .4)}" stroke-width=".9" stroke-opacity=".8"/>`; }
    return s + `<path d="M${ax} ${ay}L${bx} ${by}" stroke="#fff" stroke-opacity=".18" stroke-width="1"/>`;
  }
  function specks(list, col) { return list.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1}" fill="${col || "#d9cdb4"}" fill-opacity=".75"/>`).join(""); }
  function trail(o, x, y, R, gl, wet) {
    if (!o.on) return "";
    const ax = gl === "B" ? 14 : 20, ay = gl === "B" ? 4 : 6, ry = R * K;
    const X = x - ax - R, Y = y - ay - ry, W = 2 * (ax + R), Hh = 2 * (ay + ry);
    let s = `<rect x="${n1(X)}" y="${n1(Y)}" width="${n1(W)}" height="${n1(Hh)}" rx="${n1(R)}" ry="${n1(ry)}" fill="${wet ? "#cfefff" : "#fff"}" fill-opacity="${wet ? .16 : .11}"/>`;
    s += `<rect x="${n1(X + R * .5)}" y="${n1(Y + ry * .55)}" width="${n1(W - R)}" height="${n1(ry * .5)}" rx="${n1(ry * .25)}" fill="#fff" fill-opacity="${wet ? .16 : .06}"/>`;
    s += `<rect x="${n1(X + R * .5)}" y="${n1(Y + Hh - ry * 1.05)}" width="${n1(W - R)}" height="${n1(ry * .5)}" rx="${n1(ry * .25)}" fill="#fff" fill-opacity="${wet ? .16 : .06}"/>`;
    return s;
  }

  function brush(o, x, y, L, rev, n) {
    n = n || 3; const on = o.on && o.anim, d = dur(o, 1, .72);
    let arms = "";
    for (let i = 0; i < n; i++) { const a = i * 360 / n;
      arms += `<g transform="rotate(${a})"><path d="M2 0Q${n1(L * .5)} ${n1(L * .14)} ${n1(L)} ${n1(L * .1)}" fill="none" stroke="#2a2e35" stroke-width="2.4" stroke-linecap="round"/><path d="M2 -.4Q${n1(L * .5)} ${n1(L * .1)} ${n1(L * .6)} ${n1(L * .08)}" fill="none" stroke="#6b727c" stroke-width=".7"/>` +
        `<path d="M${n1(L * .55)} ${n1(L * .1)}L${n1(L * 1.05)} ${n1(L * .02)}M${n1(L * .55)} ${n1(L * .12)}L${n1(L * 1.02)} ${n1(L * .22)}M${n1(L * .55)} ${n1(L * .1)}L${n1(L * 1.06)} ${n1(L * .12)}" stroke="#d4d9e0" stroke-opacity=".8" stroke-width="1" stroke-linecap="round"/></g>`; }
    return `<g transform="translate(${n1(x)} ${n1(y)})">${o.on ? `<circle r="${n1(L)}" fill="#cfd6de" fill-opacity="${n1(.06 + .08 * o.level)}"/>` : ""}<g ${spinA(o, true, rev, d)}><circle r="${n1(L + 2)}" fill="none"/>${arms}</g><circle r="3.2" fill="#2d3137"/><circle r="1.4" fill="#8b929c"/></g>`;
  }
  function mopPad(o, x, y, r, rev) {
    const on = o.on, d = dur(o, 1.6, 1);
    let tufts = ""; for (let i = 0; i < 12; i++) tufts += `<path d="M0 0L${pt(r, i * 30)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.6"/>`;
    return `<g transform="translate(${n1(x)} ${n1(y)})">${on ? `<circle r="${n1(r + 3)}" fill="#9fd8ff" fill-opacity=".22"/>` : ""}<g ${spinA(o, true, rev, d)}><circle r="${n1(r)}" fill="url(#${o.uid}-mopp)"/>${tufts}<circle r="${n1(r)}" fill="none" stroke="#8e98a3" stroke-width="1.2"/></g><circle r="${n1(r * .3)}" fill="#59606a"/></g>`;
  }
  function seam(r, a1, a2, w) { return `<path d="M${pt(r, a1)}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${pt(r, a2)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="${w || 1.2}"/><path d="M${pt(r - 1.4, a1)}A${r - 1.4} ${r - 1.4} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${pt(r - 1.4, a2)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>`; }
  function pill(x, y, w, h, fill, hl) { return `<path d="${rr(x - w / 2, y - h / 2, w, h, h / 2)}" fill="${fill}"/>` + (hl ? `<path d="M${n1(x - w / 2 + h / 2)} ${n1(y - h * .22)}H${n1(x + w / 2 - h / 2)}" stroke="#fff" stroke-opacity="${hl}" stroke-width="1" stroke-linecap="round"/>` : ""); }
  function ringLed(o, r, k, w, cx, cy) {
    cx = cx || 0; cy = cy || 0;
    if (!o.on) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="${w || 2}"/>`;
    const c = LEDS[k || "w"];
    return `<g class="${P}pulse"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-opacity=".35" stroke-width="${(w || 2) * 4}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${w || 2}"/></g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".6"/>`;
  }
  function turret(o, lay, R, ty, tr, th) {
    let s = ""; th = th || 6;
    for (let i = 1; i <= th; i++) s += lay(-i, `<circle cy="${n1(ty)}" r="${n1(tr)}" fill="${H().mix("#121418", "#3c4048", i / th)}"/>`);
    const scan = o.on ? `<path d="M0 0L${pt(R * 1.6, -14)}A${n1(R * 1.6)} ${n1(R * 1.6)} 0 0 1 ${pt(R * 1.6, 14)}Z" fill="url(#${o.uid}-scan)" opacity="${n1(.35 + .4 * o.level)}"/><circle cx="${n1(tr * .78)}" r="1.6" fill="${VIO}"/>` : "";
    s += lay(-th - .5, `<circle cy="${n1(ty)}" r="${n1(tr)}" fill="url(#${o.uid}-tt)"/><circle cy="${n1(ty)}" r="${n1(tr * .7)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1"/>` +
      `<path d="M${n1(-tr * .5)} ${n1(ty + tr * .82)}A${n1(tr)} ${n1(tr)} 0 0 0 ${n1(tr * .5)} ${n1(ty + tr * .82)}" fill="none" stroke="#5c636e" stroke-width="2"/>` +
      `<g transform="translate(0 ${n1(ty)})"><g ${spinA(o, o.on, false, "1.30")}><circle r="${n1(R * 1.6)}" fill="none"/>${scan}</g></g>` +
      `<circle cx="${n1(-tr * .35)}" cy="${n1(ty - tr * .4)}" r="${n1(tr * .28)}" fill="#fff" fill-opacity=".14"/>`);
    return s;
  }

  function bot(o, c) {
    const u = o.uid, R = c.R, h = c.h, p = pal(o.color), ry = +(R * K).toFixed(1), shape = c.shape || "round";
    const mv = c.move !== false && live(o), T = (15 - 4 * o.level).toFixed(1), dl = n1(c.dl || 0);
    const ta = mv ? `class="${P}turn" style="animation-duration:${T}s;animation-delay:-${dl}s"` : `transform="rotate(${c.pose || 0})"`;
    const lay = (dy, inner) => `<g transform="translate(0 ${n1(dy)}) scale(1 ${K})"><g ${ta}><circle r="125" fill="none"/>${inner}</g></g>`;
    let s = `<ellipse cx="0" cy="${n1(h + 2)}" rx="${n1(R * 1.12)}" ry="${n1(ry * 1.18)}" fill="url(#${u}-sh)"/>`;
    if (c.floor) s += lay(h, c.floor(o, R, p));
    if (shape === "round") {
      s += `<path d="M${-R} 0V${h}A${R} ${ry} 0 0 0 ${R} ${h}V0Z" fill="url(#${u}-c)"/>`;
      const sk = n1(h * (c.skirt || .5));
      s += `<path d="M${-R} ${sk}V${h}A${R} ${ry} 0 0 0 ${R} ${h}V${sk}A${R} ${ry} 0 0 1 ${-R} ${sk}Z" fill="${c.skirtCol || "#0c0d10"}" fill-opacity="${c.skirtOp || .55}"/>`;
      s += `<path d="M${-R} 0V${h}A${R} ${ry} 0 0 0 ${R} ${h}V0Z" fill="url(#${u}-edge)" opacity=".6"/>`;
      s += `<ellipse rx="${R}" ry="${ry}" fill="url(#${u}-s)"/>`;
      s += `<path d="M${-R} 0A${R} ${ry} 0 0 0 ${R} 0" fill="none" stroke="${p.l}" stroke-opacity=".7" stroke-width="1"/>`;
    } else {
      const path = c.path(R);
      const n = Math.max(3, Math.round(h / 1.1));
      for (let i = 0; i <= n; i++) { const t = i / n, dy = h * (1 - t);
        const col = t < .45 ? H().mix("#0b0c0f", p.k, t / .45) : H().mix(p.k, p.d, (t - .45) / .55);
        s += lay(dy, `<path d="${path}" fill="${col}"/>`); }
      s += lay(0, `<path d="${path}" fill="url(#${u}-s)" stroke="${p.l}" stroke-opacity=".7" stroke-width="1.6"/>`);
    }
    if (c.top) s += lay(0, c.top(o, R, p));
    s += `<ellipse cx="${n1(-R * .22)}" cy="${n1(-ry * .32)}" rx="${n1(R * .66)}" ry="${n1(ry * .55)}" fill="url(#${u}-g)" opacity="${c.gloss || .32}"/>`;
    if (c.over) s += c.over(lay, R, p);
    const g = mv ? `<g class="${P}gl${c.glide || "A"}" style="animation-duration:${T}s;animation-delay:-${dl}s">` : `<g>`;
    return `<g transform="translate(${c.x} ${c.y})">${g}${s}</g></g>`;
  }
  const dPath = (R) => { const f = R * .78, cr = R * .2; return `M${-R} 0V${n1(f - cr)}Q${-R} ${n1(f)} ${n1(-R + cr)} ${n1(f)}H${n1(R - cr)}Q${R} ${n1(f)} ${R} ${n1(f - cr)}V0A${R} ${R} 0 0 0 ${-R} 0Z`; };
  const sqPath = (R) => { const a = R * .9, cr = R * .32; return rr(-a, -a, 2 * a, 2 * a, cr); };

  const btns = (o, y, k) => pill(0, y, 22, 8, "#1c1f24", .25) + `<circle cx="-5" cy="${y}" r="2.2" fill="#3a3f47"/><circle cx="5" cy="${y}" r="2.2" fill="#3a3f47"/>` + led(o, 0, y, 1.3, k || "w");
  const bump = (R) => seam(R - 7, 18, 162);

  function dockBox(o, x, y, w, h, top, r) {
    const u = o.uid;
    return `<path d="${rr(x, y + top * .5, w, h - top * .5, r)}" fill="url(#${u}-v)"/><path d="${rr(x, y + top * .5, w, h - top * .5, r)}" fill="url(#${u}-edge)" opacity=".7"/>` +
      `<path d="${rr(x, y, w, top, Math.min(r, top / 2))}" fill="${pal(o.color).l}"/><path d="${rr(x + 3, y + 1.5, w - 6, top - 3, Math.min(r, top / 2) - 1)}" fill="url(#${u}-g)" opacity=".5"/>` +
      `<path d="M${x + r} ${y + top}H${x + w - r}" stroke="#000" stroke-opacity=".22" stroke-width="1"/>`;
  }
  function ramp(o, x, y, w, d) {
    return `<path d="M${x - w / 2} ${y}L${x + w / 2} ${y}L${x + w / 2 + 8} ${y + d}L${x - w / 2 - 8} ${y + d}Z" fill="#1a1c21"/><path d="M${x - w / 2} ${y}L${x + w / 2} ${y}" stroke="#fff" stroke-opacity=".2"/>` +
      `<path d="M${x - w / 2 - 8} ${y + d}H${x + w / 2 + 8}V${y + d + 3}H${x - w / 2 - 8}Z" fill="#0b0c0f"/>`;
  }
  function chase(o, pts, col, d) {
    if (!o.on) return "";
    return pts.map((q, i) => `<circle class="${P}chase" cx="${q[0]}" cy="${q[1]}" r="${q[2] || 1.4}" fill="${col}" style="animation-duration:${d}s;animation-delay:-${n1(d * (pts.length - i) / pts.length)}s"/>`).join("");
  }
  function bubbles(o, list, col, d) {
    if (!o.on) return "";
    return list.map((b, i) => `<circle class="${P}rise" cx="${b[0]}" cy="${b[1]}" r="${b[2] || 1.4}" fill="none" stroke="${col || "#e6f6ff"}" stroke-width=".8" style="animation-duration:${d || 2.4}s;animation-delay:-${n1(i * .55)}s"/>`).join("");
  }

  const css = `
.hda-vacuum-spin,.hda-vacuum-spinr,.hda-vacuum-turn,.hda-vacuum-flip,.hda-vacuum-wig,.hda-vacuum-blink,.hda-vacuum-mowr{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-vacuum-spin{animation:hda-vacuum-spin .6s linear infinite}
.hda-anim .hda-vacuum-spinr{animation:hda-vacuum-spinr .6s linear infinite}
@keyframes hda-vacuum-spin{to{transform:rotate(360deg)}}
@keyframes hda-vacuum-spinr{to{transform:rotate(-360deg)}}
.hda-anim .hda-vacuum-turn{animation:hda-vacuum-turn 12s ease-in-out infinite}
@keyframes hda-vacuum-turn{0%,30%{transform:rotate(-90deg)}36%,44%{transform:rotate(0deg)}50%,80%{transform:rotate(90deg)}86%,94%{transform:rotate(180deg)}100%{transform:rotate(270deg)}}
.hda-anim .hda-vacuum-glA{animation:hda-vacuum-glA 12s ease-in-out infinite}
@keyframes hda-vacuum-glA{0%{transform:translate(-20px,-6px)}30%,36%{transform:translate(20px,-6px)}44%,50%{transform:translate(20px,6px)}80%,86%{transform:translate(-20px,6px)}94%,100%{transform:translate(-20px,-6px)}}
.hda-anim .hda-vacuum-glB{animation:hda-vacuum-glB 12s ease-in-out infinite}
@keyframes hda-vacuum-glB{0%{transform:translate(-14px,-4px)}30%,36%{transform:translate(14px,-4px)}44%,50%{transform:translate(14px,4px)}80%,86%{transform:translate(-14px,4px)}94%,100%{transform:translate(-14px,-4px)}}
.hda-anim .hda-vacuum-pulse{animation:hda-vacuum-pulse 2.4s ease-in-out infinite}
@keyframes hda-vacuum-pulse{50%{opacity:.45}}
.hda-anim .hda-vacuum-chg{animation:hda-vacuum-chg 3s ease-in-out infinite}
@keyframes hda-vacuum-chg{0%,100%{opacity:.2}50%{opacity:1}}
.hda-anim .hda-vacuum-alarm{animation:hda-vacuum-chg 1.1s ease-in-out infinite}
.hda-vacuum-chase{opacity:.25}
.hda-anim .hda-vacuum-chase{animation:hda-vacuum-chase 1.6s linear infinite}
@keyframes hda-vacuum-chase{0%{opacity:.15}20%{opacity:1}45%{opacity:.15}}
.hda-vacuum-rise{opacity:.7}
.hda-anim .hda-vacuum-rise{animation:hda-vacuum-rise 2.4s ease-in infinite}
@keyframes hda-vacuum-rise{0%{transform:translateY(6px);opacity:0}25%{opacity:.9}100%{transform:translateY(-22px);opacity:0}}
.hda-anim .hda-vacuum-win{animation:hda-vacuum-win 14s ease-in-out infinite}
@keyframes hda-vacuum-win{0%,4%{transform:translate(-26px,-30px)}18%,22%{transform:translate(26px,-30px)}30%,34%{transform:translate(26px,0px)}48%,52%{transform:translate(-26px,0px)}60%,64%{transform:translate(-26px,30px)}78%,82%{transform:translate(26px,30px)}100%{transform:translate(-26px,-30px)}}
.hda-anim .hda-vacuum-swim{animation:hda-vacuum-swim 12s ease-in-out infinite}
@keyframes hda-vacuum-swim{0%{transform:translate(-24px,0px) scale(1,1)}44%{transform:translate(24px,-4px) scale(1,1)}50%{transform:translate(24px,-4px) scale(-1,1)}94%{transform:translate(-24px,0px) scale(-1,1)}100%{transform:translate(-24px,0px) scale(1,1)}}
.hda-anim .hda-vacuum-mow{animation:hda-vacuum-mow 14s ease-in-out infinite}
@keyframes hda-vacuum-mow{0%{transform:translate(-22px,0px)}45%,55%{transform:translate(22px,6px)}100%{transform:translate(-22px,0px)}}
.hda-anim .hda-vacuum-mowr{animation:hda-vacuum-mowr 14s ease-in-out infinite}
@keyframes hda-vacuum-mowr{0%,43%{transform:scale(1,1)}47%,95%{transform:scale(-1,1)}99%,100%{transform:scale(1,1)}}
.hda-anim .hda-vacuum-push{animation:hda-vacuum-push 3.2s ease-in-out infinite}
@keyframes hda-vacuum-push{0%,100%{transform:translate(0px,0px)}50%{transform:translate(-5px,-7px)}}
.hda-anim .hda-vacuum-roll{animation:hda-vacuum-roll .5s linear infinite}
@keyframes hda-vacuum-roll{to{transform:translateY(4px)}}
.hda-anim .hda-vacuum-wig{animation:hda-vacuum-wig 2.6s ease-in-out infinite}
@keyframes hda-vacuum-wig{0%,60%,100%{transform:rotate(0deg)}66%{transform:rotate(-2.5deg)}74%{transform:rotate(2deg)}82%{transform:rotate(-1.5deg)}}
.hda-anim .hda-vacuum-blink{animation:hda-vacuum-blink 4s ease-in-out infinite}
@keyframes hda-vacuum-blink{0%,44%,52%,100%{transform:scale(1,1)}48%{transform:scale(1,.1)}}
.hda-anim .hda-vacuum-shim{animation:hda-vacuum-shim 3.4s ease-in-out infinite}
@keyframes hda-vacuum-shim{0%,100%{opacity:.25;transform:translateX(-3px)}50%{opacity:.75;transform:translateX(3px)}}
.hda-anim .hda-vacuum-clip{animation:hda-vacuum-clip 1s ease-out infinite}
@keyframes hda-vacuum-clip{0%{transform:translate(0px,0px);opacity:0}20%{opacity:1}100%{transform:translate(-12px,-12px);opacity:0}}
.hda-vacuum-clip{opacity:0}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-vacuum-"]{animation:none!important}}
`;

  const ic = (id, name, first, render) => ({ id, name, colors: sw(first), picker: true, colorLabel: "Body", render });

  const dirt = (o, x, y) => specks([[x - 52, y - 2, 1], [x + 44, y + 9, 1.2], [x - 30, y + 14, .9], [x + 8, y - 8, 1.1], [x + 30, y + 2, .8]].filter(() => !o.on)) +
    specks([[x - 78, y + 30, 1.2], [x + 80, y - 18, 1], [x + 70, y + 36, 1.3], [x - 84, y - 14, .9]]);

  const icons = [
    ic("lidar", "LiDAR robot", WH, (o) => { const R = 44, x = 100, y = 112, h = 12;
      return svg(o, floorWrap(o, wood(o, "#b98a5a", 3) + trail(o, x, y + h, R, "A") + dirt(o, x, y + h)) +
        bot(o, { x, y, R, h, dl: 0,
          floor: (o, R) => brush(o, -R * .66, R * .66, R * .42) + brush(o, R * .66, R * .66, R * .42, true),
          top: (o, R) => bump(R) + btns(o, R * .5, "w") + `<path d="M${-R * .55} ${-R * .62}h${R * 1.1}" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`,
          over: (lay, R) => turret(o, lay, R, -R * .14, R * .27, 6) })); }),

    ic("topcam", "Top camera", BK, (o) => { const R = 44, x = 100, y = 110, h = 11;
      return svg(o, floorWrap(o, wood(o, "#6f4a33", 11) + rug(o, "#8a5a6a", "border") + trail(o, x, y + h, R, "A") + dirt(o, x, y + h)) +
        bot(o, { x, y, R, h, dl: 3, gloss: .4,
          floor: (o, R) => brush(o, -R * .64, R * .68, R * .4, false, 5) + brush(o, R * .64, R * .68, R * .4, true, 5),
          top: (o, R) => `<circle r="${R * .78}" fill="url(#${o.uid}-glass)"/><circle r="${R * .78}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1"/>` +
            `<circle cy="${-R * .3}" r="7" fill="#050608" stroke="#4a515c" stroke-width="1.6"/><circle cy="${-R * .3}" r="3.6" fill="#1c2a44"/><circle cx="-1.4" cy="${-R * .3 - 1.4}" r="1.3" fill="#9fc7ff" fill-opacity=".8"/>` +
            ringLed(o, 6.5, "b", 1.6, 0, R * .32) + `<circle cy="${R * .32}" r="4.2" fill="#2c3036"/>` + seam(R - 4, 30, 150) })); }),

    ic("dshape", "D-shape robot", GR, (o) => { const R = 42, x = 100, y = 108, h = 12;
      return svg(o, floorWrap(o, tile(o, "#d8d3c8", "#cfc9bd") + rug(o, "#3f5d7a", "stripe", [24, 80, 176, 80, 192, 184, 8, 184]) + trail(o, x, y + h, R, "A") + dirt(o, x, y + h)) +
        bot(o, { x, y, R, h, dl: 6, shape: "d", path: dPath,
          floor: (o, R) => brush(o, R * .84, R * .66, R * .44, true, 3) + `<rect x="${-R * .8}" y="${R * .55}" width="${R * 1.4}" height="6" rx="3" fill="#15171b"/>`,
          top: (o, R) => `<path d="M${-R + 2} ${R * .62}H${R - 2}" stroke="#000" stroke-opacity=".35" stroke-width="5"/><path d="M${-R + 4} ${R * .5}H${R - 4}" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` +
            `<path d="${rr(-R * .5, -R * .5, R, R * .62, 9)}" fill="#000" fill-opacity=".14"/>` + btns(o, -R * .2, "c") + `<circle cx="${R * .6}" cy="${-R * .35}" r="3" fill="#202328"/>` })); }),

    ic("selfempty", "Self-empty base", WH, (o) => { const u = o.uid, R = 38, x = 100, y = 146, h = 11;
      const dust = o.on ? chase(o, [[100, 104], [100, 94], [100, 84], [100, 74], [100, 64], [100, 54]], "#e9dcc4", 1.4) : "";
      return svg(o, floorWrap(o, wood(o, "#a07650", 5)) + sh(o, 100, 136, 52, 8) +
        dockBox(o, 62, 18, 76, 116, 22, 12) +
        `<path d="${rr(74, 44, 52, 52, 8)}" fill="#0e1014"/><path d="${rr(77, 47, 46, 46, 6)}" fill="#3a3530"/><path d="M80 60Q100 52 120 62L120 90L80 90Z" fill="#cdbfa6" fill-opacity=".85"/>` +
        `<path d="M80 72Q92 66 104 74T120 72" fill="none" stroke="#8e8068" stroke-width="1"/><path d="${rr(74, 44, 52, 52, 8)}" fill="url(#${u}-clr)" stroke="#fff" stroke-opacity=".25"/>` +
        `<rect x="96" y="96" width="8" height="18" fill="#000" fill-opacity=".25"/>` + dust +
        `<path d="M74 54L98 92" stroke="#fff" stroke-opacity=".16" stroke-width="5"/>` +
        led(o, 100, 33, 1.8, "w", "chg") + `<path d="M84 33h8M108 33h8" stroke="#000" stroke-opacity=".2" stroke-width="2" stroke-linecap="round"/>` +
        ramp(o, 100, 126, 76, 12) +
        bot(o, { x, y, R, h, move: false, pose: 0,
          floor: (o, R) => brush(o, -R * .66, R * .66, R * .4) + brush(o, R * .66, R * .66, R * .4, true),
          top: (o, R) => bump(R) + btns(o, R * .5, "a"),
          over: (lay, R) => turret(Object.assign({}, o, { on: false }), lay, R, -R * .16, R * .27, 5) }) +
        led(o, 100, 172, 1.6, "a", "chg")); }),

    ic("allinone", "Mop dock", BK, (o) => { const u = o.uid, R = 36, x = 100, y = 150, h = 10;
      const tank = (tx, grad, lvl, lid) => `<path d="${rr(tx, 34, 38, 62, 7)}" fill="#0c0e11"/><path d="${rr(tx + 2.5, 36.5, 33, 57, 5)}" fill="#1b1f25"/>` +
        `<path d="${rr(tx + 2.5, 36.5 + 57 * (1 - lvl), 33, 57 * lvl, 5)}" fill="url(#${u}-${grad})"/><path d="M${tx + 3} ${n1(36.5 + 57 * (1 - lvl))}h32" stroke="#fff" stroke-opacity=".45"/>` +
        `<path d="${rr(tx, 34, 38, 62, 7)}" fill="url(#${u}-clr)" stroke="#fff" stroke-opacity=".22"/><path d="${rr(tx + 6, 26, 26, 8, 3)}" fill="${lid}"/><path d="M${tx + 6} ${45}L${tx + 16} ${86}" stroke="#fff" stroke-opacity=".14" stroke-width="4"/>`;
      return svg(o, floorWrap(o, tile(o, "#a9a49b", "#9f9a91", { grout: "#5f5a51", go: .4 })) + sh(o, 100, 138, 70, 9) +
        dockBox(o, 44, 14, 112, 124, 20, 13) + tank(52, "cw", .72, "#5aa0e8") + tank(110, "dw", .38, "#7a7468") +
        `<path d="${rr(93, 40, 14, 50, 7)}" fill="#0f1115"/>` + led(o, 100, 50, 1.5, "c", "chg") + led(o, 100, 62, 1.5, "w", "chg") +
        bubbles(o, [[64, 86, 1.4], [74, 80, 1.1], [80, 88, 1.6], [62, 76, .9]], "#e6f6ff", 2.6) +
        `<path d="M50 104H150" stroke="#000" stroke-opacity=".2"/>` + ramp(o, 100, 128, 92, 12) +
        bot(o, { x, y, R, h, move: false, pose: 0,
          floor: (o, R) => brush(o, -R * .66, R * .66, R * .4) + brush(o, R * .66, R * .66, R * .4, true),
          top: (o, R) => bump(R) + btns(o, R * .5, "c"),
          over: (lay, R) => turret(Object.assign({}, o, { on: false }), lay, R, -R * .12, R * .28, 5) }) +
        led(o, 100, 174, 1.6, "c", "chg")); }),

    ic("spinmop", "Spin mop", WH, (o) => { const R = 40, x = 100, y = 110, h = 13;
      return svg(o, floorWrap(o, tile(o, "#8b979e", "#818d94", { grout: "#dfe6ea", go: .45, step: 26 }) + trail(o, x, y + h, R * 1.05, "A", true)) +
        bot(o, { x, y, R, h, dl: 9, skirt: .45, skirtCol: "#5aa0e8", skirtOp: .35,
          floor: (o, R) => mopPad(o, -R * .5, R * .05, R * .58) + mopPad(o, R * .5, R * .05, R * .58, true),
          top: (o, R) => `<path d="M${-R * .7} ${-R * .2}A${R * .74} ${R * .74} 0 0 1 ${R * .7} ${-R * .2}Z" fill="url(#${o.uid}-cw)" opacity=".8"/>` +
            `<path d="M${-R * .7} ${-R * .2}A${R * .74} ${R * .74} 0 0 1 ${R * .7} ${-R * .2}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/>` +
            `<circle cy="${R * .3}" r="9" fill="#1c1f24"/>` + ringLed(o, 9, "c", 1.6, 0, R * .3) + `<path d="M-2.5 ${R * .3 - 2}q2.5 -4 5 0a3 3 0 1 1 -5 0z" fill="${o.on ? CYAN : "#5a616b"}"/>` })); }),

    ic("slim", "Slim profile", SV, (o) => { const u = o.uid, R = 48, x = 100, y = 124, h = 6;
      return svg(o, floorWrap(o, wood(o, "#c8a47c", 17) + trail(o, x, y + h, R, "B") + dirt(o, x, y + h) + `<path d="M0 74H200V104H0Z" fill="url(#${u}-us)"/>`) +
        BGW(`<path d="M4 18H196V74H4Z" fill="url(#${u}-sofa)"/><path d="M4 18H196V74H4Z" fill="url(#${u}-edge)" opacity=".5"/>` + [70, 134].map((sx) => `<path d="M${sx} 20V60" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/><path d="M${sx + 1.4} 20V60" stroke="#fff" stroke-opacity=".1"/>`).join("") + `<path d="M4 60H196" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/><path d="M4 61.5H196" stroke="#fff" stroke-opacity=".12"/><path d="M4 74H196" stroke="#000" stroke-opacity=".5" stroke-width="2"/>` +
        `<path d="M20 74h10l-2 14h-6zM170 74h10l-2 14h-6z" fill="url(#${u}-st)"/>`) +
        bot(o, { x, y, R, h, dl: 2, glide: "B", gloss: .45,
          floor: (o, R) => brush(o, -R * .7, R * .6, R * .34) + brush(o, R * .7, R * .6, R * .34, true),
          top: (o, R) => `<circle r="${R * .62}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.4"/><circle r="${R * .6}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>` +
            pill(0, R * .1, 30, 6, "#2a2d33", .2) + led(o, 0, R * .1, 1.2, "g") + seam(R - 3, 40, 140, 1) }),
        `<linearGradient id="${u}-us" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient><linearGradient id="${u}-sofa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5c80"/><stop offset=".75" stop-color="#4a3f5c"/><stop offset="1" stop-color="#2f2840"/></linearGradient>`); }),

    ic("combo", "Vac-mop combo", BL, (o) => { const R = 44, x = 100, y = 110, h = 12;
      return svg(o, floorWrap(o, tile(o, "#b9ae9c", "#ada290", { grout: "#6f6656", go: .4, step: 34 }) + trail(o, x, y + h, R, "A", true) + dirt(o, x, y + h)) +
        bot(o, { x, y, R, h, dl: 4,
          floor: (o, R) => brush(o, -R * .66, R * .66, R * .4) + brush(o, R * .66, R * .66, R * .4, true) +
            `<path d="${rr(-R * .86, -R * .62, R * 1.72, R * .34, 5)}" fill="#e8eef3"/><path d="${rr(-R * .86, -R * .62, R * 1.72, R * .34, 5)}" fill="url(#${o.uid}-mopp)" opacity=".7"/>`,
          top: (o, R) => `<path d="M${-R * .78} ${-R * .3}A${R * .84} ${R * .84} 0 0 1 ${R * .78} ${-R * .3}Z" fill="#101318" fill-opacity=".6"/>` +
            `<path d="M${-R * .72} ${-R * .34}A${R * .78} ${R * .78} 0 0 1 ${R * .72} ${-R * .34}Z" fill="url(#${o.uid}-cw)" opacity=".85"/>` +
            `<path d="M${-R * .6} ${-R * .52}q${R * .3} -6 ${R * .6} 0t${R * .6} 0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>` +
            bump(R) + btns(o, R * .38, "b") })); }),

    ic("square", "Square body", SV, (o) => { const R = 40, x = 100, y = 110, h = 13;
      return svg(o, floorWrap(o, tile(o, "#8f9399", "#878b91", { ys: [48, 66, 90, 122, 164, 220], step: 46, grout: "#000", go: .22 }) + trail(o, x, y + h, R * .95, "A") + dirt(o, x, y + h)) +
        bot(o, { x, y, R, h, dl: 7, shape: "square", path: sqPath,
          floor: (o, R) => brush(o, -R * .78, R * .78, R * .38) + brush(o, R * .78, R * .78, R * .38, true),
          top: (o, R) => `<path d="${rr(-R * .6, -R * .6, R * 1.2, R * 1.2, R * .22)}" fill="#000" fill-opacity=".14"/><path d="${rr(-R * .56, -R * .56, R * 1.12, R * 1.12, R * .2)}" fill="url(#${o.uid}-g)" opacity=".25"/>` +
            `<path d="M${-R * .85} ${R * .7}H${R * .85}" stroke="#000" stroke-opacity=".3" stroke-width="3"/>` +
            `<circle r="11" fill="#1d2025"/>` + ringLed(o, 11, "g", 1.8) + `<circle r="6" fill="url(#${o.uid}-st)"/>` })); }),

    ic("obstacle", "Obstacle light", BK, (o) => { const R = 42, x = 100, y = 106, h = 12;
      return svg(o, floorWrap(o, wood(o, "#5b3e2b", 23) + trail(o, x, y + h, R, "A") + dirt(o, x, y + h) +
        `<path d="M54 160c6 -8 18 -6 22 2c2 4 -6 8 -12 6c-6 -1 -14 -1 -10 -8z" fill="#c9b8e8"/><path d="M58 162c6 -3 12 -2 16 1" stroke="#fff" stroke-opacity=".4" fill="none"/>`) +
        bot(o, { x, y, R, h, dl: 1,
          floor: (o, R) => (o.on ? `<path class="${P}pulse" d="M${-R * .24} ${R * .9}L${-R * .9} ${R * 2.1}L${R * .9} ${R * 2.1}L${R * .24} ${R * .9}Z" fill="url(#${o.uid}-beam)"/>` +
              `<path d="M${-R * .6} ${R * 1.6}H${R * .6}M${-R * .45} ${R * 1.35}H${R * .45}" stroke="#bfe0ff" stroke-opacity=".55" stroke-width="1.4"/>` : "") +
            brush(o, -R * .66, R * .66, R * .4) + brush(o, R * .66, R * .66, R * .4, true),
          top: (o, R) => `<path d="M${pt(R - 1, 55)}A${R - 1} ${R - 1} 0 0 1 ${pt(R - 1, 125)}L${pt(R - 10, 125)}A${R - 10} ${R - 10} 0 0 0 ${pt(R - 10, 55)}Z" fill="#06070a"/>` +
            `<circle cy="${R - 5.5}" r="3" fill="#18263d" stroke="#5a6372" stroke-width=".8"/>` + (o.on ? `<circle cx="-12" cy="${R - 5.5}" r="1.6" fill="#dff1ff"/><circle cx="12" cy="${R - 5.5}" r="1.6" fill="#dff1ff"/>` : "") +
            `<circle r="${R * .6}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="${R * .3}"/><circle r="${R * .45}" fill="#000" fill-opacity=".18"/>` +
            `<path d="${rr(-13, -R * .2, 26, 12, 4)}" fill="#07080b"/>` + (o.on ? `<text x="0" y="${n1(-R * .2 + 9)}" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="8" font-weight="700" fill="${CYAN}">${Math.round(40 + 60 * o.level)}</text>` : "") })); }),

    ic("window", "Window robot", WH, (o) => { const u = o.uid, mv = live(o);
      const body = `<rect x="-30" y="-27" width="64" height="62" rx="16" fill="#000" fill-opacity=".3"/>` +
        `<rect x="-32" y="-32" width="64" height="64" rx="16" fill="url(#${u}-grip)"/>` +
        `<rect x="-28" y="-28" width="56" height="56" rx="13" fill="url(#${u}-sd)"/><rect x="-28" y="-30" width="56" height="55" rx="13" fill="url(#${u}-s)"/>` +
        `<rect x="-24" y="-26" width="48" height="24" rx="10" fill="url(#${u}-g)" opacity=".4"/>` +
        `<circle cy="-1" r="13" fill="#1b1e23"/><circle cy="-1" r="9" fill="url(#${u}-st)"/>` + ringLed(o, 13, "b", 1.6, 0, -1) +
        `<path d="M-6 18h12" stroke="#000" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>` + led(o, 0, 18, 1.3, "g") +
        `<path d="M0 -30C2 -60 -6 -90 4 -140" fill="none" stroke="#e05555" stroke-width="1.6"/>`;
      const lanes = o.on ? `<path d="M48 70H152M152 70V100M152 100H48M48 100V130M48 130H152" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="56" stroke-linejoin="round"/>` : "";
      const spots = [[52, 40, 5], [148, 60, 4], [60, 152, 6], [140, 150, 4], [100, 36, 3], [44, 108, 3], [160, 112, 5]].map((q) => `<circle cx="${q[0]}" cy="${q[1]}" r="${q[2]}" fill="#fff" fill-opacity=".12"/><circle cx="${q[0] - 1}" cy="${q[1] - 1}" r="${q[2] * .4}" fill="#fff" fill-opacity=".15"/>`).join("");
      return svg(o, BGW(`<rect x="10" y="8" width="180" height="184" rx="6" fill="#d9dde2"/><rect x="10" y="8" width="180" height="184" rx="6" fill="url(#${u}-edge)" opacity=".6"/>`) +
        `<rect x="20" y="18" width="160" height="164" fill="#3c4e6c"/>` + `<g clip-path="url(#${u}-gc)">` + (`<rect x="20" y="18" width="160" height="164" fill="url(#${u}-sky)"/>` +
        `<path d="M20 150Q60 132 100 146T180 140V182H20Z" fill="#2c3b2f" fill-opacity=".7"/>` + spots + lanes +
        `<path d="M40 18L20 50M110 18L40 182M150 18L80 182" stroke="#fff" stroke-opacity=".07" stroke-width="16"/>`) +
        `<g transform="translate(100 100)"><g ${mv ? `class="${P}win" style="animation-duration:${(18 - 6 * o.level).toFixed(1)}s"` : `transform="translate(-10 -6)"`}>${body}</g></g></g>` +
        `<rect x="20" y="18" width="160" height="164" fill="none" stroke="#9aa1aa" stroke-width="2"/>` + BGW(`<path d="M12 190H188" stroke="#fff" stroke-opacity=".5"/>`),
        `<clipPath id="${u}-gc"><rect x="20" y="18" width="160" height="164"/></clipPath><linearGradient id="${u}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb2e8"/><stop offset=".6" stop-color="#bcd8f0"/><stop offset="1" stop-color="#e8d9c8"/></linearGradient>`); }),

    ic("pool", "Pool robot", GR, (o) => { const u = o.uid, mv = live(o);
      const trk = (y) => `<path d="${rr(-44, y, 88, 14, 7)}" fill="#1a1d22"/>` + Array.from({ length: 11 }, (_, i) => `<rect x="${-40 + i * 8}" y="${y + 1}" width="3" height="12" rx="1" fill="#33373e"/>`).join("") +
        `<circle cx="-37" cy="${y + 7}" r="5" fill="url(#${u}-st)"/><circle cx="37" cy="${y + 7}" r="5" fill="url(#${u}-st)"/>`;
      const bot2 = `<ellipse cx="0" cy="34" rx="52" ry="7" fill="#03222e" fill-opacity=".5"/>` + trk(18) +
        `<path d="M-46 22C-46 -2 -30 -14 0 -14C30 -14 46 -2 46 22Z" fill="url(#${u}-v)"/><path d="M-46 22C-46 -2 -30 -14 0 -14C30 -14 46 -2 46 22Z" fill="url(#${u}-edge)" opacity=".6"/>` +
        `<path d="M-38 6C-34 -6 -18 -10 0 -10" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2.5" stroke-linecap="round"/>` +
        `<path d="${rr(-20, -2, 40, 12, 6)}" fill="#0d1014" fill-opacity=".75"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${-15 + i * 6} 0v8" stroke="#3b414a" stroke-width="2"/>`).join("") +
        `<path d="M-14 -14C-14 -30 14 -30 14 -14" fill="none" stroke="url(#${u}-dk)" stroke-width="6" stroke-linecap="round"/>` +
        `<rect x="40" y="10" width="9" height="16" rx="3" fill="#1f2328"/><g transform="translate(45 18)"><g ${spinA(o, o.on, false, dur(o, .9, .5))}><circle r="6" fill="none"/><path d="M-5 0H5M0 -5V5" stroke="#9aa3ad" stroke-width="1.4"/></g></g>` +
        led(o, -30, 8, 1.5, "c") +
        `<path d="M0 -26C10 -60 -20 -90 6 -150" fill="none" stroke="#e8c45a" stroke-width="1.8"/>` +
        bubbles(o, [[-8, -24, 1.6], [4, -30, 1.2], [-2, -40, 2], [8, -20, 1]], "#d8f6ff", 2.2);
      let floor = ""; const V = -60;
      for (let j = -7; j <= 7; j++) floor += `<path d="M${n1(100 + j * 16)} 118L${n1(100 + j * 16 * (200 - V) / (118 - V))} 200" stroke="#bfefff" stroke-opacity=".3"/>`;
      [118, 128, 141, 158, 180].forEach((yy) => { floor += `<path d="M0 ${yy}H200" stroke="#bfefff" stroke-opacity=".3"/>`; });
      const caus = `<g class="${P}shim"><path d="M20 140q12 -6 24 0t24 0M90 132q10 -5 20 0t20 0M140 160q12 -6 24 0M40 172q12 -6 24 0t24 0" fill="none" stroke="#e8ffff" stroke-opacity=".5" stroke-width="2"/></g>`;
      return svg(o, `<rect x="6" y="10" width="188" height="182" rx="14" fill="url(#${u}-wat)"/>` + `<g clip-path="url(#${u}-pc)">` + (
        `<rect x="6" y="104" width="188" height="14" fill="#2a8fb3"/><path d="M6 104H194" stroke="#e6fbff" stroke-opacity=".5"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="${8 + i * 16}" y="106" width="14" height="10" fill="#1d7898"/>`).join("") +
        `<rect x="6" y="118" width="188" height="74" fill="#3fb6d6"/>${floor}${caus}` +
        `<path d="M6 24Q50 16 100 24T194 22" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><path d="M6 30Q60 24 110 30T194 30" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.5"/>`) +
        `<g transform="translate(100 140)"><g ${mv ? `class="${P}swim" style="animation-duration:${(16 - 5 * o.level).toFixed(1)}s"` : ""}><circle r="160" fill="none"/>${bot2}</g></g>` +
        `<rect x="6" y="10" width="188" height="182" fill="url(#${u}-ray)"/>` + `</g>`,
        `<clipPath id="${u}-pc"><rect x="6" y="10" width="188" height="182" rx="14"/></clipPath><linearGradient id="${u}-wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd6ec"/><stop offset=".5" stop-color="#2f9fc6"/><stop offset="1" stop-color="#1f7fa8"/></linearGradient>` +
        `<linearGradient id="${u}-ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#003a52" stop-opacity=".25"/></linearGradient>`); }),

    ic("mower", "Lawn mower", SV, (o) => { const u = o.uid, mv = live(o), p = pal(o.color);
      const wheel = (cx, cy, r) => `<g transform="translate(${cx} ${cy})"><circle r="${r}" fill="#121417"/><g ${spinA(o, o.on, false, dur(o, 1.4, .7))}><circle r="${r}" fill="none"/>${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${-r}v4" transform="rotate(${i * 36})" stroke="#3a3f46" stroke-width="3"/>`).join("")}<path d="M${-r * .5} 0H${r * .5}M0 ${-r * .5}V${r * .5}" stroke="#6b737d" stroke-width="2"/></g><circle r="${n1(r * .45)}" fill="url(#${u}-st)"/><circle r="2" fill="#2b2f35"/></g>`;
      const clips = o.on ? [[-46, 20], [-42, 16], [-50, 14], [-44, 24]].map((q, i) => `<rect class="${P}clip" x="${q[0]}" y="${q[1]}" width="2.2" height="1.2" fill="#8fd16a" style="animation-delay:-${n1(i * .25)}s"/>`).join("") : "";
      const m = `<ellipse cx="0" cy="30" rx="56" ry="8" fill="url(#${u}-sh)"/>` + clips +
        `<path d="M-48 24L-44 6H44L50 24Z" fill="#1c1f24"/>` +
        `<path d="M-50 18C-50 -4 -30 -16 2 -16C34 -16 52 -4 52 18C52 24 46 26 40 26H-44C-48 26 -50 23 -50 18Z" fill="url(#${u}-v)"/>` +
        `<path d="M-50 18C-50 -4 -30 -16 2 -16C34 -16 52 -4 52 18C52 24 46 26 40 26H-44C-48 26 -50 23 -50 18Z" fill="url(#${u}-edge)" opacity=".55"/>` +
        `<path d="M-40 0C-30 -10 -10 -13 6 -13" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>` +
        `<path d="M-46 16H48" stroke="${p.k}" stroke-width="1.4"/>` +
        `<path d="M-8 -14C-8 -22 18 -22 18 -14Z" fill="#14171b"/><circle cx="5" cy="-17" r="4.4" fill="${RED}"/><circle cx="4" cy="-18.2" r="1.6" fill="#fff" fill-opacity=".6"/>` +
        `<path d="${rr(-30, -8, 22, 9, 3)}" fill="#0b0d10"/>` + (o.on ? `<rect x="-27" y="-5.5" width="${n1(16 * o.level)}" height="3.4" rx="1" fill="${GREEN}"/>` : "") +
        wheel(-30, 24, 12) + wheel(34, 26, 7) + led(o, 40, 8, 1.4, "g");
      const stripes = [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${-40 + i * 50} 56L${-10 + i * 50} 56L${-60 + i * 70} 200L${-110 + i * 70} 200Z" fill="${i % 2 ? "#4f8f3a" : "#5fa246"}"/>`).join("");
      const tufts = Array.from({ length: 28 }, (_, i) => { const xx = 8 + i * 6.7, yy = 186 + (i % 3) * 3; return `<path d="M${n1(xx)} ${yy}l-2 -9M${n1(xx + 2)} ${yy}l1 -11M${n1(xx + 4)} ${yy}l3 -8" stroke="${i % 2 ? "#3f7f2c" : "#78c255"}" stroke-width="1.4" stroke-linecap="round"/>`; }).join("");
      return svg(o, floorWrap(o, `<rect x="0" y="50" width="200" height="150" fill="#5a9a42"/>` + stripes + `<ellipse cx="120" cy="80" rx="80" ry="20" fill="#fff" fill-opacity=".08"/>`) +
        `<g transform="translate(100 124)"><g ${mv ? `class="${P}mow" style="animation-duration:${(18 - 4 * o.level).toFixed(1)}s"` : ""}><g ${mv ? `class="${P}mowr" style="animation-duration:${(18 - 4 * o.level).toFixed(1)}s"` : ""}><circle r="70" fill="none"/>${m}</g></g></g>` +
        floorWrap(o, tufts, 1)); }),

    ic("stick", "Stick vacuum", BL, (o) => { const u = o.uid, p = pal(o.color);
      const bars = [0, 1, 2, 3].map((i) => { const lit = o.on && (i + 1) / 4 <= o.level + .01, nxt = o.on && !lit && i / 4 < o.level + .25, yy = 97 - i * 6;
        return `<rect x="126" y="${yy}" width="8" height="4" rx="1" fill="${lit ? GREEN : "#3a3f47"}"/>` + (nxt ? `<rect class="${P}chg" x="126" y="${yy}" width="8" height="4" rx="1" fill="${GREEN}"/>` : ""); }).join("");
      const vents = Array.from({ length: 8 }, (_, i) => { const a = rad(i * 45); return `<path d="M118 56L${n1(118 + 6 * Math.cos(a))} ${n1(56 + 6 * Math.sin(a))}" stroke="#4a515b" stroke-width="1"/>`; }).join("");
      return svg(o, BGW(`<rect x="8" y="8" width="184" height="150" fill="#b9ad9c"/><rect x="8" y="8" width="184" height="150" fill="url(#${u}-wl)"/>` +
        `<rect x="8" y="148" width="184" height="12" fill="#f2efe9"/><rect x="8" y="148" width="184" height="1.5" fill="#fff"/><rect x="8" y="158" width="184" height="2" fill="#000" fill-opacity=".2"/>` +
        `<g clip-path="url(#${u}-fc)">${wood(o, "#9c7350", 29, 160)}</g>`) + sh(o, 92, 186, 46, 5) +
        `<path d="${rr(102, 29, 34, 48, 7)}" fill="#000" fill-opacity=".2"/><path d="${rr(100, 26, 34, 48, 7)}" fill="#e6e8eb"/><path d="${rr(100, 26, 34, 48, 7)}" fill="url(#${u}-edge)" opacity=".45"/>` +
        `<circle cx="104.5" cy="30.5" r="1.3" fill="#9aa1aa"/><circle cx="129.5" cy="30.5" r="1.3" fill="#9aa1aa"/>` +
        `<rect x="89" y="104" width="7" height="70" rx="3" fill="url(#${u}-st)"/><path d="M91 106V170" stroke="#fff" stroke-opacity=".55"/>` +
        `<path d="M60 172H124L132 186H52Z" fill="#1c1f24"/><path d="M62 172H122L125 177H59Z" fill="url(#${u}-v)"/><path d="M86 168H100V176H86Z" fill="#2a2e35"/>` +
        `<rect x="56" y="181" width="72" height="4" rx="2" fill="#7c3a3a"/>` +
        `<circle cx="70" cy="180" r="1.4" fill="#555"/><circle cx="114" cy="180" r="1.4" fill="#555"/>` +
        `<path d="${rr(80, 62, 26, 44, 9)}" fill="#0d1014" fill-opacity=".5"/><path d="${rr(81, 63, 24, 42, 8)}" fill="#c3ced8" fill-opacity=".3"/>` +
        `<path d="M82 90Q92 84 104 90V98Q104 104 98 104H88Q82 104 82 98Z" fill="#a39479" fill-opacity=".8"/>` +
        `<path d="${rr(80, 62, 26, 44, 9)}" fill="url(#${u}-clr)" stroke="#fff" stroke-opacity=".32"/><path d="M85 68V100" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>` +
        `<rect x="80" y="94" width="5" height="8" rx="1.5" fill="${p.d}"/>` +
        `<path d="M78 44H108L106 64H80Z" fill="url(#${u}-st)"/>` + [48, 53, 58].map((y) => `<path d="M79 ${y}H107" stroke="#000" stroke-opacity=".25"/>`).join("") +
        `<path d="M104 40H126C132 40 134 46 134 52V62C134 68 130 72 124 72H104Z" fill="url(#${u}-v)"/><path d="M104 40H126C132 40 134 46 134 52V62C134 68 130 72 124 72H104Z" fill="url(#${u}-edge)" opacity=".5"/>` +
        `<circle cx="118" cy="56" r="9" fill="${p.d}"/><circle cx="118" cy="56" r="6.5" fill="#15181c"/>` + vents +
        `<path d="M110 40C110 22 116 14 128 14C138 14 142 20 142 30V76" fill="none" stroke="${p.d}" stroke-width="8" stroke-linecap="round"/><path d="M112 36C113 22 118 17 128 17" fill="none" stroke="${p.l}" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M131 24l-6 10" stroke="#15171b" stroke-width="4" stroke-linecap="round"/>` +
        `<path d="${rr(122, 74, 16, 30, 4)}" fill="#24272d"/><path d="M124 76H136" stroke="#fff" stroke-opacity=".2"/>` + bars + led(o, 130, 80, 1.2, "g", "chg") +
        `<path d="M106 44V68" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>`,
        `<linearGradient id="${u}-wl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient><clipPath id="${u}-fc"><rect x="8" y="160" width="184" height="32"/></clipPath>`); }),

    ic("handheld", "Handheld vac", GR, (o) => { const u = o.uid, p = pal(o.color);
      return svg(o, BGW(`<path d="M4 116H196L196 188H4Z" fill="url(#${u}-ctr)"/><path d="M4 116H196" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/><path d="M4 176H196V190H4Z" fill="#000" fill-opacity=".3"/>` +
        `<path d="M40 132q30 -6 70 2t70 -4" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/><path d="M14 158q40 -8 90 0" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/>`) +
        sh(o, 100, 150, 76, 9) +
        `<path d="M34 134C34 128 40 126 46 126H156C164 126 168 130 168 136V144C168 148 164 150 158 150H44C38 150 34 148 34 144Z" fill="url(#${u}-cr)"/>` +
        `<path d="M40 128H162" stroke="#fff" stroke-opacity=".6"/><path d="M36 144H166" stroke="#000" stroke-opacity=".2"/>` + led(o, 154, 142, 1.6, "a", "chg") +
        `<path d="M28 112L62 104V130L28 124Z" fill="#202328"/><path d="M28 112L62 104" stroke="#fff" stroke-opacity=".3"/><ellipse cx="28" cy="118" rx="3" ry="6.5" fill="#07080a"/>` +
        `<path d="${rr(58, 98, 42, 36, 12)}" fill="#0d1014" fill-opacity=".5"/><path d="${rr(59, 99, 40, 34, 11)}" fill="#c3ced8" fill-opacity=".3"/><path d="M60 120Q78 113 98 121V128Q98 132 92 132H66Q60 132 60 128Z" fill="#9b8f78" fill-opacity=".8"/>` +
        `<path d="${rr(58, 98, 42, 36, 12)}" fill="url(#${u}-clr)" stroke="#fff" stroke-opacity=".3"/><path d="M64 103H94" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>` +
        `<rect x="98" y="96" width="7" height="40" rx="2" fill="url(#${u}-stv)"/>` +
        `<path d="M104 96H132C140 96 144 104 144 114V118C144 128 140 136 132 136H104Z" fill="url(#${u}-v)"/><path d="M104 96H132C140 96 144 104 144 114V118C144 128 140 136 132 136H104Z" fill="url(#${u}-edge)" opacity=".5"/>` +
        Array.from({ length: 5 }, (_, i) => `<path d="M${112 + i * 5} 106V126" stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>`).join("") +
        `<path d="M106 100H132" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M126 98C128 80 140 72 154 74C166 76 170 88 168 102L164 124" fill="none" stroke="${p.d}" stroke-width="9" stroke-linecap="round"/>` +
        `<path d="M130 92C134 80 144 76 154 77" fill="none" stroke="${p.l}" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/><path d="M146 80l4 9" stroke="#16181c" stroke-width="4" stroke-linecap="round"/>` +
        `<path d="${rr(142, 110, 26, 22, 6)}" fill="#25282e"/><path d="M145 113H165" stroke="#fff" stroke-opacity=".18"/>` + led(o, 150, 125, 1.3, "a", "chg") + led(o, 156, 125, 1.3, "a", "chg") + `<circle cx="162" cy="125" r="1.3" fill="#3e434b"/>`,
        `<linearGradient id="${u}-ctr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3c9"/><stop offset=".85" stop-color="#b9b1a4"/><stop offset="1" stop-color="#7f786d"/></linearGradient>` +
        `<linearGradient id="${u}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f4f6"/><stop offset=".6" stop-color="#c9ced4"/><stop offset="1" stop-color="#8a9098"/></linearGradient>`); }),

    ic("washer", "Floor washer", BK, (o) => { const u = o.uid, mv = live(o), p = pal(o.color);
      const roll = `<g clip-path="url(#${u}-rc)"><rect x="60" y="164" width="80" height="14" fill="#cfe2f0"/><g ${mv ? `class="${P}roll" style="animation-duration:${dur(o, .8, .5)}s"` : ""}>${Array.from({ length: 6 }, (_, i) => `<rect x="60" y="${158 + i * 4}" width="80" height="1.6" fill="#7fa3bf" fill-opacity=".7"/>`).join("")}</g></g>`;
      const wet = o.on ? `<path d="M56 186L144 186L170 200H30Z" fill="#dff4ff" fill-opacity=".22"/><path d="M60 192h40M118 196h30" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>` : "";
      const m = sh(o, 100, 184, 54, 6) +
        `<path d="M56 160H144L150 182H50Z" fill="#16181c"/><path d="M58 160H142L146 170H54Z" fill="url(#${u}-v)"/>` + roll +
        `<path d="M86 160L82 92H118L114 160Z" fill="url(#${u}-c)"/>` +
        `<path d="${rr(84, 98, 32, 38, 8)}" fill="#0c0e11" fill-opacity=".6"/><path d="${rr(86, 100, 28, 34, 6)}" fill="#1b1f25"/><path d="${rr(86, 100 + 34 * (1 - (.4 + .5 * o.level)), 28, 34 * (.4 + .5 * o.level), 6)}" fill="url(#${u}-cw)"/>` +
        `<path d="${rr(84, 98, 32, 38, 8)}" fill="url(#${u}-clr)" stroke="#fff" stroke-opacity=".3"/>` + bubbles(o, [[92, 128, 1.2], [104, 124, 1], [98, 130, 1.5]], "#e6f6ff", 2) +
        `<ellipse cx="100" cy="86" rx="20" ry="8" fill="#0b0d10"/><ellipse cx="100" cy="85" rx="16" ry="6" fill="#151a22"/>` + (o.on ? `<ellipse class="${P}pulse" cx="100" cy="85" rx="16" ry="6" fill="none" stroke="${CYAN}" stroke-width="1.6"/><text x="100" y="88" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="7.5" font-weight="700" fill="${CYAN}">${Math.round(30 + 70 * o.level)}%</text>` : "") +
        `<rect x="97" y="22" width="6" height="58" fill="url(#${u}-st)"/><path d="M99 24V78" stroke="#fff" stroke-opacity=".5"/>` +
        `<path d="M84 22C84 10 116 10 116 22" fill="none" stroke="${p.d}" stroke-width="7" stroke-linecap="round"/><path d="M88 16C94 12 106 12 112 16" fill="none" stroke="${p.l}" stroke-opacity=".5" stroke-width="1.6"/>` +
        `<path d="M90 96V156" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>`;
      return svg(o, floorWrap(o, tile(o, "#a7a49d", "#9c9992", { grout: "#5c5952", go: .4, step: 28 }) + wet) +
        `<g ${mv ? `class="${P}push" style="animation-duration:${dur(o, 4, 1.6)}s"` : ""}>${m}</g>`,
        `<clipPath id="${u}-rc"><rect x="60" y="164" width="80" height="14" rx="5"/></clipPath>`); }),

    ic("dock", "Charging dock", WH, (o) => { const R = 44, x = 100, y = 132, h = 12;
      return svg(o, floorWrap(o, wood(o, "#8c8278", 41)) + sh(o, 100, 112, 40, 6) +
        `<path d="${rr(68, 70, 64, 46, 10)}" fill="url(#${o.uid}-dk)"/><path d="${rr(68, 64, 64, 14, 7)}" fill="#3d424a"/><path d="M76 67H124" stroke="#fff" stroke-opacity=".25"/>` +
        `<path d="M74 98H126" stroke="#000" stroke-opacity=".35" stroke-width="2"/>` + led(o, 100, 86, 2, "w", "chg") +
        `<rect x="82" y="110" width="9" height="4" rx="1" fill="url(#${o.uid}-st)"/><rect x="109" y="110" width="9" height="4" rx="1" fill="url(#${o.uid}-st)"/>` +
        bot(o, { x, y, R, h, move: false, pose: 0,
          floor: (o, R) => brush(Object.assign({}, o, { on: false }), -R * .66, R * .66, R * .4) + brush(Object.assign({}, o, { on: false }), R * .66, R * .66, R * .4, true),
          top: (o, R) => bump(R) + `<circle cy="${R * .28}" r="10" fill="#1c1f24"/>` + `<circle cy="${R * .28}" r="10" fill="none" stroke="#2f343b" stroke-width="2"/>` +
            (o.on ? `<g class="${P}chg"><circle cy="${R * .28}" r="10" fill="none" stroke="${AMBER}" stroke-width="2.2"/><circle cy="${R * .28}" r="13" fill="none" stroke="${AMBER}" stroke-opacity=".3" stroke-width="5"/></g>` : "") +
            `<path d="M1.5 ${R * .28 - 6}L-3 ${R * .28 + 1}H0.5L-1.5 ${R * .28 + 6}L3 ${R * .28 - 1}H-.5Z" fill="${o.on ? AMBER : "#59606a"}"/>` + seam(R * .6, 200, 340, 1) })); }),

    ic("stuck", "Stuck alert", BK, (o) => { const R = 44, x = 102, y = 108, h = 12;
      const ring = (o) => (o.on ? `<g class="${P}alarm"><circle r="${R * .8}" fill="none" stroke="${RED}" stroke-opacity=".35" stroke-width="8"/><circle r="${R * .8}" fill="none" stroke="${RED}" stroke-width="2.4"/></g><circle r="${R * .8}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/>` : `<circle r="${R * .8}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2.4"/>`);
      return svg(o, floorWrap(o, wood(o, "#a77d55", 53) + (o.on ? `<ellipse cx="${x}" cy="${y + 14}" rx="78" ry="36" fill="url(#${o.uid}-hr)" opacity=".55"/>` : "") +
        `<path d="M8 150C40 160 60 128 92 140S140 168 196 140" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/><path d="M8 149C40 159 60 127 92 139S140 167 196 139" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.2"/>`) +
        `<g ${live(o) ? `class="${P}wig"` : ""}><g transform="rotate(-8 ${x} ${y})">` +
        bot(o, { x, y, R, h, move: false, pose: 25, gloss: .45,
          floor: (o, R) => brush(Object.assign({}, o, { on: false }), -R * .66, R * .66, R * .4) + brush(Object.assign({}, o, { on: false }), R * .66, R * .66, R * .4, true),
          top: (o, R) => ring(o) + seam(R - 4, 20, 160) + `<circle r="${R * .5}" fill="url(#${o.uid}-glass)"/>` }) + `</g></g>` +
        `<path d="M64 158C80 150 96 160 104 152" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>` +
        (o.on ? `<g transform="translate(${x} ${y - 10})"><g class="${P}alarm"><path d="M0 -12L11 7H-11Z" fill="${RED}"/></g><path d="M0 -6V1" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cy="4.4" r="1.3" fill="#fff"/></g>` : "")); }),

    ic("mini", "Kids mini", BL, (o) => { const R = 32, x = 100, y = 114, h = 11;
      const eye = (ex) => `<g transform="translate(${ex} ${-R * .12})"><g ${live(o) ? `class="${P}blink"` : ""}><ellipse rx="4.4" ry="6" fill="#07090c"/>${o.on ? `<ellipse rx="3" ry="4.4" fill="${CYAN}"/><circle cx="-1" cy="-1.6" r="1.1" fill="#fff"/>` : `<ellipse rx="3" ry="1" cy="1" fill="#4a515c"/>`}</g></g>`;
      return svg(o, floorWrap(o, wood(o, "#d1b48e", 61) + rug(o, "#f5efe6", "play", [34, 82, 166, 82, 184, 182, 16, 182]) + trail(o, x, y + h, R, "B") +
        `<path d="M40 160l9 -2l2 9l-9 2z" fill="#f87171"/><path d="M40 160l9 -2l2 -4l-9 2z" fill="#fca5a5"/><path d="M152 100l8 0l0 8l-8 0z" fill="#fbbf24"/><path d="M152 100l3 -3h8l-3 3z" fill="#fde68a"/>`) +
        bot(o, { x, y, R, h, dl: 5, glide: "B", gloss: .45, skirtCol: "#f2a74b", skirtOp: .9,
          floor: (o, R) => brush(o, -R * .64, R * .7, R * .38) + brush(o, R * .64, R * .7, R * .38, true),
          top: (o, R) => `<circle cx="${-R * .62}" cy="${-R * .62}" r="${R * .26}" fill="#f2a74b"/><circle cx="${R * .62}" cy="${-R * .62}" r="${R * .26}" fill="#f2a74b"/>` +
            `<path d="${rr(-R * .5, -R * .4, R, R * .58, 9)}" fill="#0c0f14"/>` + eye(-R * .22) + eye(R * .22) +
            `<path d="M-5 ${R * .36}Q0 ${R * .48} 5 ${R * .36}" fill="none" stroke="#1d2025" stroke-width="2" stroke-linecap="round"/>` +
            `<circle cx="${-R * .44}" cy="${R * .36}" r="3" fill="#ff9aa8" fill-opacity=".7"/><circle cx="${R * .44}" cy="${R * .36}" r="3" fill="#ff9aa8" fill-opacity=".7"/>` })); }),

    ic("pethair", "Pet hair", SV, (o) => { const R = 44, x = 100, y = 110, h = 13;
      const fur = (q) => q.map((f) => `<path d="M${f[0]} ${f[1]}q4 -3 8 0t8 0" fill="none" stroke="#c9a77a" stroke-width="1.6" stroke-linecap="round"/><path d="M${f[0] + 2} ${f[1] + 2}q4 -3 8 0" fill="none" stroke="#f1e2c6" stroke-width="1" stroke-linecap="round"/>`).join("");
      return svg(o, floorWrap(o, wood(o, "#7a5a40", 71) + rug(o, "#7d8a9a", "shag", [22, 82, 178, 82, 192, 184, 8, 184]) + trail(o, x, y + h, R, "A") +
        fur([[26, 168], [150, 176], [168, 98], [34, 96]].concat(o.on ? [] : [[70, 146], [124, 136], [96, 158]])) +
        `<g fill="#3a2f2a" fill-opacity=".55"><ellipse cx="160" cy="150" rx="4.5" ry="3.4"/><circle cx="155" cy="145" r="1.6"/><circle cx="159" cy="143.5" r="1.6"/><circle cx="163" cy="143.5" r="1.6"/><circle cx="166.5" cy="145.5" r="1.6"/></g>`) +
        bot(o, { x, y, R, h, dl: 8,
          floor: (o, R) => brush(o, -R * .66, R * .66, R * .42, false, 4) + brush(o, R * .66, R * .66, R * .42, true, 4) +
            `<rect x="${-R * .55}" y="${R * .5}" width="${R * 1.1}" height="8" rx="4" fill="#2c3e2e"/>`,
          top: (o, R) => `<path d="${rr(-R * .52, -R * .6, R * 1.04, R * .78, 10)}" fill="#0d1014" fill-opacity=".55"/>` +
            `<path d="${rr(-R * .48, -R * .56, R * .96, R * .7, 8)}" fill="#cbd3db" fill-opacity=".28"/>` +
            `<path d="M${-R * .45} ${-R * .05}Q${-R * .2} ${-R * .28} 0 ${-R * .1}T${R * .45} ${-R * .12}V${R * .12}H${-R * .45}Z" fill="#b89470" fill-opacity=".9"/>` +
            `<path d="M${-R * .4} ${-R * .12}q6 -6 12 0t12 0t12 0" fill="none" stroke="#f1e2c6" stroke-width="1.2" stroke-opacity=".8"/>` +
            `<path d="${rr(-R * .52, -R * .6, R * 1.04, R * .78, 10)}" fill="url(#${o.uid}-clr)" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/>` +
            bump(R) + btns(o, R * .5, "g") })); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "vacuum", tab: "Robot vacuums", group: "Cleaning", kind: "device",
    intro: "Twenty robot vacuums and floor cleaners on real floors. When on, robots glide a lap and turn, side brushes and mop pads spin, the LiDAR turret sweeps and a clean lane shows on the floor; docked ones breathe a charging light. The slider sets suction power.",
    
    css, icons,
  });
})();
