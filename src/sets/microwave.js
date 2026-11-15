(function () {
  const P = "hda-microwave-";
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  const H = () => window.HDAH;
  const SS = "#c4c8cc", BS = "#4b4e53", WH = "#f1f1ee", BK = "#1e2023", SL = "#5e6168";
  const MINT = "#a9dcc6", CREAM = "#eee2c2", RED = "#c4302b", NAVY = "#273a5f", COP = "#b8743f", BRASS = "#c9a24a";
  const WOOD = "#8b5a33", SAGE = "#8fa58c", PLAS = "#e7e0d4", GREIGE = "#c9bba6", TERRA = "#c27a5a", PAINTW = "#efebe3";
  const SW = [SS, BS, WH, BK, SL];
  const sw = function () { const r = Array.prototype.slice.call(arguments).concat(SW); return r.filter((c, i) => r.indexOf(c) === i).slice(0, 6); };
  const WARM = "#ffd27a", DISP = "#62e3ff", GRN = "#46e39a";
  const n1 = (v) => (+v).toFixed(1);
  const rgb = (c) => { const h = String(c).replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) || 0); };
  const isMetal = (c) => { const v = rgb(c), mx = Math.max(v[0], v[1], v[2]), mn = Math.min(v[0], v[1], v[2]); return mx - mn < 24 && mx > 52 && mx < 228; };
  const lv = (o) => Math.max(1, Math.min(4, Math.ceil(o.level * 4)));

  function pal(c) { const h = H(); return { l: h.shade(c, .5), s: h.shade(c, .25), m: c, d: h.shade(c, -.25), k: h.shade(c, -.5), e: h.shade(c, -.4) }; }
  const halo = (id, c, a) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a || .8}"/><stop offset=".45" stop-color="${c}" stop-opacity=".25"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color), m = isMetal(o.color);
    return `<defs>
<linearGradient id="${u}-fh" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".16" stop-color="${p.s}"/><stop offset=".42" stop-color="${p.m}"/>${m ? `<stop offset=".68" stop-color="${p.s}"/>` : ""}<stop offset=".9" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-fv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.l}"/><stop offset=".5" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-vsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".22" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<linearGradient id="${u}-tp" x1="0" x2="1"><stop offset="0" stop-color="${p.m}"/><stop offset=".5" stop-color="${p.l}"/><stop offset="1" stop-color="${p.s}"/></linearGradient>
<linearGradient id="${u}-sd" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-fx" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".08" stop-color="#fff" stop-opacity="0"/><stop offset=".9" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".38" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>
<pattern id="${u}-br" width="70" height="2.6" patternUnits="userSpaceOnUse"><path d="M0 .6H70" stroke="#fff" stroke-opacity=".1" stroke-width=".45"/><path d="M0 1.9H30M38 1.9H70" stroke="#000" stroke-opacity=".09" stroke-width=".45"/></pattern>
<linearGradient id="${u}-gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22272e"/><stop offset="1" stop-color="#07090b"/></linearGradient>
<linearGradient id="${u}-cav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffecb6"/><stop offset=".55" stop-color="#f3bb5c"/><stop offset="1" stop-color="#a5621c"/></linearGradient>
<linearGradient id="${u}-cav0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2026"/><stop offset="1" stop-color="#0a0b0d"/></linearGradient>
<radialGradient id="${u}-tt"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></radialGradient>
<pattern id="${u}-perf" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><path d="M0 0H2.6V2.6" fill="none" stroke="#000" stroke-width="1.1" stroke-opacity=".62"/></pattern>
<pattern id="${u}-dots" width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="6" fill="#f3efe6"/><circle cx="2" cy="3" r="1.4" fill="#3f7fc4"/><circle cx="6" cy="3" r=".9" fill="#c4473f"/></pattern>
<linearGradient id="${u}-cer" x1="0" x2="1"><stop offset="0" stop-color="#b9b2a6"/><stop offset=".35" stop-color="#fbf8f1"/><stop offset="1" stop-color="#9d968a"/></linearGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".5" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-stv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2e6ea"/><stop offset=".5" stop-color="#9aa1a9"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfeff"/><stop offset=".35" stop-color="#8f969e"/><stop offset=".55" stop-color="#e9ecef"/><stop offset="1" stop-color="#5d636b"/></linearGradient>
<linearGradient id="${u}-crh" x1="0" x2="1"><stop offset="0" stop-color="#5d636b"/><stop offset=".3" stop-color="#fdfeff"/><stop offset=".55" stop-color="#8f969e"/><stop offset="1" stop-color="#e9ecef"/></linearGradient>
<linearGradient id="${u}-pan" x1="0" x2="1"><stop offset="0" stop-color="#17191c"/><stop offset=".4" stop-color="#4c5158"/><stop offset="1" stop-color="#15171a"/></linearGradient>
<linearGradient id="${u}-ctr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfcac1"/><stop offset="1" stop-color="#8a847a"/></linearGradient>
<linearGradient id="${u}-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2f27" stop-opacity=".75"/><stop offset="1" stop-color="#3b2f27" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-ck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4048"/><stop offset=".35" stop-color="#15181c"/><stop offset="1" stop-color="#0b0c0f"/></linearGradient>
<linearGradient id="${u}-wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9b6d45"/><stop offset=".5" stop-color="#83583a"/><stop offset="1" stop-color="#5b3b24"/></linearGradient>
<pattern id="${u}-grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2C10 1 20 3 40 2M0 4.6C14 5.4 26 3.8 40 4.8" fill="none" stroke="#2a180c" stroke-opacity=".3" stroke-width=".6"/></pattern>
<pattern id="${u}-sub" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="#5c5852"/><g fill="#8f8a82"><rect x=".6" y=".6" width="10.8" height="4.8" rx=".7"/><rect x="12.6" y=".6" width="10.8" height="4.8" rx=".7"/><rect x="-5.4" y="6.6" width="10.8" height="4.8" rx=".7"/><rect x="6.6" y="6.6" width="10.8" height="4.8" rx=".7"/><rect x="18.6" y="6.6" width="10.8" height="4.8" rx=".7"/></g><path d="M1.4 1.3H10.6M13.4 1.3H22.6M7.4 7.3H16.6M19.4 7.3H24M0 7.3H4.6" stroke="#fff" stroke-opacity=".22" stroke-width=".6"/></pattern>
<pattern id="${u}-sq" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#4f5856"/><rect x=".7" y=".7" width="12.6" height="12.6" rx=".9" fill="#7e8b87"/><path d="M1.6 1.6H12" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/></pattern>
<pattern id="${u}-blk" width="32" height="16" patternUnits="userSpaceOnUse"><rect width="32" height="16" fill="#4c4f53"/><g fill="#7a7d81"><rect x=".8" y=".8" width="30.4" height="6.4" rx=".6"/><rect x="-15.2" y="8.8" width="30.4" height="6.4" rx=".6"/><rect x="16.8" y="8.8" width="30.4" height="6.4" rx=".6"/></g><circle cx="9" cy="4" r=".5" fill="#000" fill-opacity=".25"/><circle cx="24" cy="12" r=".6" fill="#000" fill-opacity=".25"/></pattern>
<pattern id="${u}-slot" width="5" height="3.2" patternUnits="userSpaceOnUse"><rect width="5" height="3.2" fill="#000" fill-opacity=".08"/><rect x=".5" y=".6" width="4" height="1.3" rx=".6" fill="#000" fill-opacity=".62"/><rect x=".5" y="1.9" width="4" height=".4" fill="#fff" fill-opacity=".18"/></pattern>
<pattern id="${u}-filt" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#8d949c"/><path d="M0 5L5 0M-1 1L1 -1M4 6L6 4" stroke="#2c3036" stroke-width="1.7"/><path d="M0 3.8L3.8 0" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/></pattern>
<pattern id="${u}-pls" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".55" fill="#000" fill-opacity=".1"/><circle cx="6" cy="7" r=".7" fill="#fff" fill-opacity=".14"/><circle cx="7.5" cy="1.8" r=".45" fill="#000" fill-opacity=".09"/><circle cx="3.6" cy="7.6" r=".4" fill="#000" fill-opacity=".08"/></pattern>
<pattern id="${u}-ham" width="9" height="8" patternUnits="userSpaceOnUse"><path d="M1.4 3.4A3.4 3.4 0 0 1 7.6 3.4" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".8"/><path d="M1.6 5.6A3.4 3.4 0 0 0 7.4 5.6" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".8"/></pattern>
<linearGradient id="${u}-glz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9f2ff" stop-opacity=".5"/><stop offset="1" stop-color="#8fc9e0" stop-opacity=".16"/></linearGradient>
<linearGradient id="${u}-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd99a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd99a" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}-pool"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
${halo(u + "-hw", WARM)}${halo(u + "-hc", DISP)}${halo(u + "-ho", "#ff6a2a")}${halo(u + "-hb", "#5aa9ff")}
<radialGradient id="${u}-fmg" cx=".5" cy=".88" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#aaa"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="${u}-fm" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="url(#${u}-fmg)"/></mask>
<linearGradient id="${u}-fmhg" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".14" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="${u}-fmh" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="url(#${u}-fmhg)"/></mask>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${r} ${r} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${r} ${r} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${r} ${r} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${r} ${r} 0 0 1 ${n1(x + r)} ${n1(y)}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
  const line = (d, op, w) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${op || .35}" stroke-width="${w || .9}"/>`;

  function face(o, d) {
    const u = o.uid;
    return `<path d="${d}" fill="url(#${u}-fh)"/><path d="${d}" fill="url(#${u}-vsh)"/>` + (isMetal(o.color) ? `<path d="${d}" fill="url(#${u}-br)"/>` : "") + `<path d="${d}" fill="url(#${u}-fx)"/>`;
  }
  function box3(o, x, y, w, h, dx, dy) {
    const u = o.uid, e = pal(o.color).e;
    return `<path d="M${x} ${y}L${x + dx} ${y - dy}H${x + w + dx}L${x + w} ${y}Z" fill="url(#${u}-tp)"/>
<path d="M${x + w} ${y}L${x + w + dx} ${y - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="url(#${u}-sd)"/>` + face(o, `M${x} ${y}H${x + w}V${y + h}H${x}Z`) +
      `<path d="M${x} ${y + h}H${x + w}L${x + w + dx} ${y + h - dy}" fill="none" stroke="${e}" stroke-width=".8"/>
<path d="M${x} ${y + .5}H${x + w}L${x + w + dx} ${y - dy + .5}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>`;
  }

  const splash = (o, x, y, w, h, pat) => G(splash0(o, x, y, w, h, pat));
  const splash0 = (o, x, y, w, h, pat) => `<g mask="url(#${o.uid}-fm)" opacity=".62"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${o.uid}-${pat || "sub"})"/></g>`;
  function counter(o, y) { return G(counter0(o, y)); }
  function counter0(o, y) {
    const u = o.uid;
    return `<g mask="url(#${u}-fmh)"><rect x="0" y="${y}" width="200" height="3.4" fill="#ddd8cf"/><rect x="0" y="${y + 3.4}" width="200" height="7" fill="url(#${u}-ctr)"/><rect x="0" y="${y + 10.4}" width="200" height="${Math.max(0, 196 - y)}" fill="url(#${u}-cab)"/><path d="M0 ${y + .4}H200" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/></g>`;
  }
  const counterScene = (o, y, tile) => splash(o, 0, 0, 200, y, tile) + counter(o, y);

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.6, h * .14), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9],
      d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return (SEG[ch] || "").split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  const segW = (h, t) => { let w = 0; for (let i = 0; i < t.length; i++) w += t[i] === ":" ? Math.max(.6, h * .14) + h * .22 : h * .78; return w - h * .22; };
  function seg7(x, y, h, t, blink) {
    let s = "", cx = x; const w = h * .56, g = h * .22, tt = Math.max(.6, h * .14);
    for (let i = 0; i < t.length; i++) { const ch = t[i];
      if (ch === ":") { s += `<g${blink ? ` class="${P}colon"` : ""}><rect x="${n1(cx)}" y="${n1(y + h * .22)}" width="${n1(tt)}" height="${n1(tt)}"/><rect x="${n1(cx)}" y="${n1(y + h * .64)}" width="${n1(tt)}" height="${n1(tt)}"/></g>`; cx += tt + g; }
      else { s += dig(cx, y, h, ch); cx += w + g; } }
    return s;
  }
  function mwDisp(o, x, y, h, col, t) {
    col = col || GRN; t = t || "1:30"; const W = segW(h, t);
    const s = `<g fill="#fff" fill-opacity=".07">${seg7(x, y, h, "8:88")}</g>`;
    if (!o.on) return s;
    return s + `<g opacity=".18"><ellipse class="${P}pulse" cx="${n1(x + W / 2)}" cy="${n1(y + h / 2)}" rx="${n1(W * .75)}" ry="${n1(h * .95)}" fill="${col}"/></g><g fill="${col}">${seg7(x, y, h, t, 1)}</g>`;
  }
  function dispBox(o, x, y, w, h, dh, col, t) {
    const W = segW(dh, t || "1:30");
    return `<path d="${rr(x, y, w, h, 1.6)}" fill="#07090c"/><path d="${rr(x, y, w, h, 1.6)}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>` +
      mwDisp(o, x + (w - W) / 2, y + (h - dh) / 2, dh, col, t) + `<path d="${rr(x, y, w, h * .45, 1.6)}" fill="#fff" fill-opacity=".06"/>`;
  }
  function pbars(o, x, y, n, col) {
    n = n || 5; col = col || GRN; const L = Math.ceil(o.level * n); let s = "";
    for (let i = 0; i < n; i++) { const bh = 1.4 + i * .8, lit = o.on && i < L; s += `<rect x="${n1(x + i * 2.6)}" y="${n1(y - bh)}" width="1.7" height="${n1(bh)}" rx=".4" fill="${lit ? col : "#fff"}" fill-opacity="${lit ? 1 : .1}"/>`; }
    return s;
  }
  function keypad(x, y, c, r, bw, bh, gx, gy, glass) {
    let s = "";
    for (let j = 0; j < r; j++) for (let i = 0; i < c; i++) { const bx = x + i * (bw + gx), by = y + j * (bh + gy);
      s += glass ? `<rect x="${n1(bx)}" y="${n1(by)}" width="${bw}" height="${bh}" rx="1" fill="#fff" fill-opacity=".06" stroke="#fff" stroke-opacity=".08" stroke-width=".4"/><circle cx="${n1(bx + bw / 2)}" cy="${n1(by + bh / 2)}" r=".7" fill="#fff" fill-opacity=".55"/>`
        : `<rect x="${n1(bx)}" y="${n1(by + .5)}" width="${bw}" height="${bh}" rx="1.2" fill="#000" fill-opacity=".28"/><rect x="${n1(bx)}" y="${n1(by)}" width="${bw}" height="${bh}" rx="1.2" fill="#2a2e35"/><rect x="${n1(bx + .7)}" y="${n1(by + .5)}" width="${n1(bw - 1.4)}" height=".7" fill="#fff" fill-opacity=".2"/><circle cx="${n1(bx + bw / 2)}" cy="${n1(by + bh / 2 + .2)}" r=".6" fill="#fff" fill-opacity=".5"/>`; }
    return s;
  }
  function startBtn(o, x, y, w, h) {
    return `<path d="${rr(x, y + .5, w, h, h / 2)}" fill="#000" fill-opacity=".3"/><path d="${rr(x, y, w, h, h / 2)}" fill="${o.on ? "#2fbf72" : "#1f5a3a"}"/>` +
      (o.on ? `<g opacity=".25"><path class="${P}pulse" d="${rr(x - 2, y - 2, w + 4, h + 4, h / 2 + 2)}" fill="${GRN}"/></g>` : "") + `<path d="${rr(x + 1, y + .6, w - 2, h * .35, h * .2)}" fill="#fff" fill-opacity=".3"/>`;
  }
  function knob(o, x, y, r, ang, cls) {
    let t = ""; for (let i = 0; i < 9; i++) { const a = (-120 + i * 30) * Math.PI / 180; t += `<path d="M${n1(x + Math.sin(a) * (r + 1.6))} ${n1(y - Math.cos(a) * (r + 1.6))}L${n1(x + Math.sin(a) * (r + 3))} ${n1(y - Math.cos(a) * (r + 3))}" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>`; }
    return t + `<circle cx="${x}" cy="${y + 1}" r="${r + .8}" fill="#000" fill-opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${o.uid}-cr)"/><circle cx="${x}" cy="${y}" r="${n1(r * .74)}" fill="url(#${o.uid}-stv)"/>` +
      `<g transform="rotate(${n1(ang)} ${x} ${y})"><g class="${cls || ""}"><circle cx="${x}" cy="${y}" r="${n1(r * .74)}" fill="none"/><path d="M${x} ${n1(y - r * .68)}V${n1(y - r * .18)}" stroke="#1d2026" stroke-width="1.5" stroke-linecap="round"/></g></g>` +
      `<path d="M${n1(x - r * .6)} ${n1(y - r * .5)}A${r * .8} ${r * .8} 0 0 1 ${n1(x + r * .3)} ${n1(y - r * .75)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".9"/>`;
  }
  function handleV(o, x, y, h, w) {
    w = w || 5;
    return `<rect x="${x - 1}" y="${y + 3}" width="${w + 2}" height="${h - 6}" rx="${w / 2}" fill="#000" fill-opacity=".3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="url(#${o.uid}-crh)"/>` +
      `<path d="M${x + w * .32} ${y + 3}V${y + h - 3}" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>`;
  }

  function steam(o, x, y, n, h, sp) {
    if (!o.on) return ""; let s = `<g opacity="${(.3 + .65 * o.level).toFixed(2)}">`;
    for (let i = 0; i < n; i++) {
      const xi = x + (i - (n - 1) / 2) * sp, q = h / 4, sg = i % 2 ? 1 : -1, del = (i * .85).toFixed(2);
      const pd = `d="M${n1(xi)} ${n1(y)}q${2 * sg} ${n1(-q / 2)} 0 ${n1(-q)}t0 ${n1(-q)}t0 ${n1(-q)}t0 ${n1(-q)}" fill="none" stroke-linecap="round"`;
      s += `<g class="${P}steam" style="animation-delay:-${del}s;transform:translateY(-${(i * 3) % 7}px)"><path ${pd} stroke="#fff" stroke-opacity=".2" stroke-width="3.6"/><path ${pd} stroke="#fff" stroke-opacity=".75" stroke-width="1.3" stroke-dasharray="${n1(h * .45)} ${n1(h * .3)}"/></g>`;
    }
    return s + `</g>`;
  }
  function food(o, kind, cx, fy, bw) {
    const u = o.uid, on = o.on; let s = "";
    if (kind === "mug") {
      const w = bw * .62, h = bw * .7, x = cx - w / 2, y = fy - h;
      s += `<path d="M${n1(x + w - 1)} ${n1(y + h * .22)}q${n1(w * .42)} 0 ${n1(w * .42)} ${n1(h * .3)}t${n1(-w * .42)} ${n1(h * .32)}" fill="none" stroke="#a9a196" stroke-width="${n1(w * .14)}"/>` +
        `<clipPath id="${u}-fb"><path d="${rr(x, y, w, h, w * .12)}"/></clipPath><path d="${rr(x, y, w, h, w * .12)}" fill="url(#${u}-cer)"/>` +
        `<g clip-path="url(#${u}-fb)"><rect class="${on ? P + "slide" : ""}" x="${n1(x - 8)}" y="${n1(y + h * .38)}" width="${n1(w + 16)}" height="${n1(h * .24)}" fill="url(#${u}-dots)"/><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-fx)"/></g>` +
        `<ellipse cx="${n1(cx)}" cy="${n1(y + .5)}" rx="${n1(w / 2)}" ry="${n1(w * .12)}" fill="#e8e2d6"/><ellipse cx="${n1(cx)}" cy="${n1(y + .9)}" rx="${n1(w / 2 - 1)}" ry="${n1(w * .09)}" fill="#5a3622"/>` + steam(o, cx, y - 1, 2, h * 1.5, w * .35);
    } else if (kind === "plate") {
      const rx = bw * .75;
      s += `<ellipse cx="${n1(cx)}" cy="${n1(fy - 1)}" rx="${n1(rx)}" ry="${n1(rx * .2)}" fill="#efe9de"/><ellipse cx="${n1(cx)}" cy="${n1(fy - 1.4)}" rx="${n1(rx * .74)}" ry="${n1(rx * .14)}" fill="#d6cebf"/>` +
        `<path d="M${n1(cx - rx * .55)} ${n1(fy - 1.6)}Q${n1(cx - rx * .52)} ${n1(fy - rx * .4)} ${n1(cx)} ${n1(fy - rx * .44)}Q${n1(cx + rx * .52)} ${n1(fy - rx * .4)} ${n1(cx + rx * .55)} ${n1(fy - 1.6)}Z" fill="#c4632d"/>` +
        `<path d="M${n1(cx - rx * .4)} ${n1(fy - rx * .3)}Q${n1(cx)} ${n1(fy - rx * .5)} ${n1(cx + rx * .35)} ${n1(fy - rx * .32)}" fill="none" stroke="#f1d27a" stroke-width="1.6" stroke-linecap="round"/>` +
        `<circle cx="${n1(cx - rx * .15)}" cy="${n1(fy - rx * .36)}" r="1" fill="#5c9a3e"/><circle cx="${n1(cx + rx * .18)}" cy="${n1(fy - rx * .33)}" r=".9" fill="#5c9a3e"/>` + steam(o, cx, fy - rx * .44, 3, rx * 1.1, rx * .32);
    } else if (kind === "basket") {
      const w = bw * 1.25, h = bw * .5, x = cx - w / 2, y = fy - h; let fr = "";
      for (let i = 0; i < 10; i++) { const fx = x + 3 + i * (w - 6) / 9, tl = (i % 3 - 1) * 2.4; fr += `<path d="M${n1(fx)} ${n1(y + h * .5)}L${n1(fx + tl)} ${n1(y - h * (.3 + (i * 7 % 5) * .08))}" stroke="${i % 2 ? "#e9a83c" : "#f4c35a"}" stroke-width="2.4" stroke-linecap="square"/>`; }
      s += fr + `<path d="${rr(x, y, w, h, 2)}" fill="#3a3f46"/><path d="${rr(x, y, w, h, 2)}" fill="url(#${u}-perf)"/><path d="${rr(x, y, w, h, 2)}" fill="none" stroke="#8d949c" stroke-width=".8"/>` +
        `<path d="M${n1(x + 1)} ${n1(y + .6)}H${n1(x + w - 1)}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>` + steam(o, cx, y - h * .3, 3, h * 2.2, w * .26);
    } else {
      const w = bw, h = bw * .5, y = fy - h;
      const d = `M${n1(cx - w / 2)} ${n1(y)}Q${n1(cx - w / 2)} ${n1(fy)} ${n1(cx - w * .18)} ${n1(fy)}H${n1(cx + w * .18)}Q${n1(cx + w / 2)} ${n1(fy)} ${n1(cx + w / 2)} ${n1(y)}Z`;
      s += `<clipPath id="${u}-fb"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${u}-cer)"/>` +
        `<g clip-path="url(#${u}-fb)"><rect class="${on ? P + "slide" : ""}" x="${n1(cx - w / 2 - 8)}" y="${n1(y + h * .2)}" width="${n1(w + 16)}" height="${n1(h * .26)}" fill="url(#${u}-dots)"/><rect x="${n1(cx - w / 2)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-fx)"/></g>` +
        `<ellipse cx="${n1(cx)}" cy="${n1(y)}" rx="${n1(w / 2)}" ry="${n1(w * .1)}" fill="#ece6da"/><ellipse cx="${n1(cx)}" cy="${n1(y + .3)}" rx="${n1(w / 2 - 1.4)}" ry="${n1(w * .075)}" fill="#c9732e"/>` +
        `<ellipse cx="${n1(cx - w * .12)}" cy="${n1(y)}" rx="${n1(w * .12)}" ry="${n1(w * .025)}" fill="#fff" fill-opacity=".35"/>` + steam(o, cx, y - 1, 3, h * 2.4, w * .22);
    }
    return s;
  }
  function cavity(o, k, x, y, w, h, opt) {
    opt = opt || {}; const u = o.uid, id = `${u}-cv${k}`, on = o.on, r = opt.r == null ? 3 : opt.r, d = opt.d || rr(x, y, w, h, r);
    const cx = x + w * (opt.cx || .5), fy = y + h * .84, rx = Math.min(w * .36, h * .8), bw = opt.bw || Math.min(w * .36, h * .72), ix = w * .1, iy = h * .12, by = y + h - iy * .6;
    let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${u}-${on ? "cav" : "cav0"})"/><g clip-path="url(#${id})">`;
    s += `<path d="M${x} ${y}L${n1(x + ix)} ${n1(y + iy)}V${n1(by)}L${x} ${y + h}Z" fill="#000" fill-opacity=".14"/><path d="M${x + w} ${y}L${n1(x + w - ix)} ${n1(y + iy)}V${n1(by)}L${x + w} ${y + h}Z" fill="#000" fill-opacity=".22"/>` +
      `<path d="M${n1(x + ix)} ${n1(by)}H${n1(x + w - ix)}L${x + w} ${y + h}H${x}Z" fill="#000" fill-opacity=".1"/>` +
      line(`M${x} ${y}L${n1(x + ix)} ${n1(y + iy)}H${n1(x + w - ix)}L${x + w} ${y}M${n1(x + ix)} ${n1(y + iy)}V${n1(by)}H${n1(x + w - ix)}V${n1(y + iy)}`, on ? .16 : .45, .8);
    if (on) s += `<g opacity="${(.5 + .45 * o.level).toFixed(2)}"><ellipse class="${P}hum" cx="${n1(x + w * .8)}" cy="${n1(y + h * .1)}" rx="${n1(w * .45)}" ry="${n1(h * .55)}" fill="url(#${u}-hw)"/></g><rect x="${n1(x + w * .72)}" y="${n1(y + iy * .5)}" width="${n1(w * .14)}" height="2" rx="1" fill="#fff8e0"/>`;
    if (opt.extra) s += opt.extra(on);
    let mk = ""; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; mk += `<path d="M${n1(Math.cos(a) * rx * .62)} ${n1(Math.sin(a) * rx * .62)}L${n1(Math.cos(a) * rx * .9)} ${n1(Math.sin(a) * rx * .9)}" stroke="#fff" stroke-opacity="${i % 5 ? .28 : .6}" stroke-width="2.4"/>`; }
    s += `<ellipse cx="${n1(cx)}" cy="${n1(fy + 2)}" rx="${n1(rx)}" ry="${n1(rx * .22)}" fill="#000" fill-opacity=".28"/>` +
      `<g transform="translate(${n1(cx)} ${n1(fy)}) scale(1 .22)"><g class="${on ? P + "spin" : ""}"><circle r="${n1(rx)}" fill="url(#${u}-tt)" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>${mk}<circle r="${n1(rx * .3)}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/></g></g>`;
    s += food(o, opt.food || "bowl", cx, fy, bw) + `</g>`;
    return s + `<path d="${d}" fill="url(#${u}-perf)" opacity="${on ? .5 : .85}"/><path d="${d}" fill="url(#${u}-gl)"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".65" stroke-width="1.3"/>`;
  }

  function fanDisp(o, x, y, h, col) {
    col = col || DISP; const w = h * .56, W = w + 11, L = lv(o);
    let s = `<path d="${rr(x - 2, y - 1.8, W + 3, h + 3.6, 1.6)}" fill="#07090c"/><path d="${rr(x - 2, y - 1.8, W + 3, h + 3.6, 1.6)}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width=".5"/><g fill="#fff" fill-opacity=".07">${dig(x, y, h, "8")}</g>`;
    for (let i = 0; i < 4; i++) { const bh = h * (.3 + .7 * (i + 1) / 4), bx = x + w + 2.4 + i * 2.2, lit = o.on && i < L;
      s += `<rect x="${n1(bx)}" y="${n1(y + h - bh)}" width="1.4" height="${n1(bh)}" rx=".4" fill="${lit ? col : "#fff"}" fill-opacity="${lit ? 1 : .1}"/>`; }
    if (o.on) s += `<g opacity=".16"><ellipse class="${P}pulse" cx="${n1(x + W / 2)}" cy="${n1(y + h / 2)}" rx="${n1(W * .8)}" ry="${n1(h)}" fill="${col}"/></g><g fill="${col}">${dig(x, y, h, String(L))}</g>`;
    return s;
  }
  const hbtn = (x, y, r) => `<circle cx="${x}" cy="${y + .4}" r="${r}" fill="#000" fill-opacity=".3"/><circle cx="${x}" cy="${y}" r="${r}" fill="#2a2e35"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".3"/>`;
  function cooktop(o, y, opt) { return G(cooktop0(o, y, opt)); }
  function cooktop0(o, y, opt) {
    opt = opt || {}; const u = o.uid, a = opt.a == null ? 22 : opt.a, b = opt.b == null ? 178 : opt.b, px = opt.px || 100, on = o.on && !opt.cold;
    const bx = [px, px <= 100 ? px + 52 : px - 52];
    let s = `<path d="M${a + 8} ${y}H${b - 8}L${b} ${y + 10}H${a}Z" fill="${opt.gas ? "#1b1d21" : `url(#${u}-ck)`}"/><path d="M${a + 8} ${y}H${b - 8}" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>` +
      `<rect x="${a}" y="${y + 10}" width="${b - a}" height="6" fill="url(#${u}-stv)"/><path d="M${a} ${y + 10}H${b}" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/><path d="M${a} ${y + 16}H${b}" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>`;
    bx.forEach((x, i) => {
      if (opt.gas) {
        s += `<path d="M${x - 20} ${y + 5}H${x + 20}M${x} ${y + 1}V${y + 9}M${x - 13} ${y + 1.5}L${x - 15} ${y + 8.5}M${x + 13} ${y + 1.5}L${x + 15} ${y + 8.5}" stroke="#3c4047" stroke-width="2"/><ellipse cx="${x}" cy="${y + 5}" rx="5" ry="1.4" fill="#2a2d32" stroke="#555a61" stroke-width=".5"/>`;
        if (on && i === 0) for (let f = 0; f < 7; f++) { const fx = x - 6 + f * 2; s += `<path class="${P}flick" style="animation-delay:-${(f * .07).toFixed(2)}s" d="M${fx} ${y + 5}q-1 -2 0 -3.6q1 1.6 0 3.6Z" fill="#5aa9ff"/>`; }
        if (on && i === 0) s += `<ellipse cx="${x}" cy="${y + 4}" rx="10" ry="3" fill="url(#${u}-hb)"/>`;
      } else {
        s += `<ellipse cx="${x}" cy="${y + 5}" rx="17" ry="3.4" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width=".7"/><ellipse cx="${x}" cy="${y + 5}" rx="10" ry="2" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width=".6"/>`;
        if (on && i === 0) s += `<ellipse class="${P}pulse" cx="${x}" cy="${y + 5}" rx="22" ry="5" fill="url(#${u}-ho)"/><ellipse cx="${x}" cy="${y + 5}" rx="17" ry="3.4" fill="none" stroke="#ff5a2a" stroke-opacity=".85" stroke-width="1"/>`;
      }
    });
    if (opt.gas) for (let i = 0; i < 4; i++) { const kx = a + 18 + i * (b - a - 36) / 3; s += `<circle cx="${n1(kx)}" cy="${y + 13}" r="2.2" fill="#1d2026"/><circle cx="${n1(kx - .6)}" cy="${y + 12.4}" r=".7" fill="#fff" fill-opacity=".4"/>`; }
    return s;
  }
  function pan(o, kind, cx, y) { return G(pan0(o, kind, cx, y)); }
  function pan0(o, kind, cx, y) {
    const u = o.uid;
    if (kind === "pot") {
      const r = 15, h = 20;
      return `<path d="M${cx - r - 5} ${y - h + 5}h5M${cx + r} ${y - h + 5}h5" stroke="#5f656d" stroke-width="2.6" stroke-linecap="round"/>` +
        `<path d="M${cx - r} ${y - h}V${y - 1}Q${cx} ${y + 3} ${cx + r} ${y - 1}V${y - h}Z" fill="url(#${u}-st)"/><path d="M${cx - r} ${y - h + 4}Q${cx} ${y - h + 7} ${cx + r} ${y - h + 4}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>` +
        `<ellipse cx="${cx}" cy="${y - h}" rx="${r}" ry="3.6" fill="#d6dadf" stroke="#7d848c" stroke-width=".7"/><ellipse cx="${cx}" cy="${y - h + .6}" rx="${r - 1.6}" ry="2.6" fill="#b5532a"/><ellipse cx="${cx - 4}" cy="${y - h + .2}" rx="4" ry=".8" fill="#fff" fill-opacity=".3"/>`;
    }
    const r = 20;
    return `<path d="M${cx + r - 2} ${y - 6}L${cx + r + 24} ${y - 10}" stroke="#121316" stroke-width="3.6" stroke-linecap="round"/><path d="M${cx + r} ${y - 6.8}L${cx + r + 23} ${y - 10.6}" stroke="#fff" stroke-opacity=".2" stroke-width=".8"/>` +
      `<path d="M${cx - r} ${y - 7}L${cx - r + 3} ${y - 1}Q${cx} ${y + 2} ${cx + r - 3} ${y - 1}L${cx + r} ${y - 7}Z" fill="url(#${u}-pan)"/>` +
      `<ellipse cx="${cx}" cy="${y - 7}" rx="${r}" ry="3.6" fill="#2a2d32" stroke="#6a6f77" stroke-width=".8"/><ellipse cx="${cx}" cy="${y - 6.8}" rx="${r - 2.2}" ry="2.7" fill="#141518"/>` +
      `<g><ellipse cx="${cx - 8}" cy="${y - 7}" rx="3" ry="1.2" fill="#5ea844"/><ellipse cx="${cx + 2}" cy="${y - 6.4}" rx="3.2" ry="1.3" fill="#d9483a"/><ellipse cx="${cx + 9}" cy="${y - 7.2}" rx="2.6" ry="1.1" fill="#f0c04a"/><ellipse cx="${cx - 2}" cy="${y - 7.6}" rx="2.2" ry="1" fill="#e7d6b8"/></g>`;
  }
  function puffs(o, cx, y0, y1, n) {
    if (!o.on) return ""; n = n || 3; const k = (y0 - y1) / 50, d = (3.8 - 1.6 * o.level).toFixed(2); let s = `<g transform="translate(${cx} ${y0}) scale(${k.toFixed(2)})">`;
    for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 8 / k, r = 4.6 / k, del = (i * +d / n).toFixed(2), st = -((i * 17) % 40);
      s += `<g class="${P}puff" style="animation-duration:${d}s;animation-delay:-${del}s;transform:translateY(${st}px) scale(${(1 - st / 40).toFixed(2)})"><circle cx="${n1(x)}" cy="0" r="${n1(r)}" fill="#fff" fill-opacity=".34"/><circle cx="${n1(x + r * .8)}" cy="${n1(-r * .5)}" r="${n1(r * .7)}" fill="#fff" fill-opacity=".28"/><circle cx="${n1(x - r * .7)}" cy="${n1(-r * .3)}" r="${n1(r * .6)}" fill="#fff" fill-opacity=".18"/></g>`; }
    return s + `</g>`;
  }
  function streams(o, cx, yb, w, h, noVortex) {
    if (!o.on) return ""; const d = (2.2 - 1.5 * o.level).toFixed(2); let s = "";
    [-1, 1].forEach((sd) => { for (let j = 0; j < 3; j++) {
      const sx = cx + sd * (w * .32 + j * w * .1), sy = yb + h * (1 - j * .12), ex = cx + sd * (w * .1 + j * w * .05), ey = yb + 1;
      s += `<path class="${P}flow" style="animation-duration:${d}s;animation-delay:-${(j * .3).toFixed(1)}s" d="M${n1(sx)} ${n1(sy)}C${n1(sx)} ${n1(sy - h * .55)} ${n1(ex)} ${n1(ey + h * .45)} ${n1(ex)} ${n1(ey)}" fill="none" stroke="#e4f6ff" stroke-opacity="${(.22 + .25 * o.level).toFixed(2)}" stroke-width="1.2" stroke-dasharray="3 7" stroke-linecap="round"/>`; } });
    if (!noVortex) s += `<g transform="translate(${cx} ${yb + 5}) scale(1 .26)"><g class="${P}spin" style="animation-duration:${(2.6 - 1.8 * o.level).toFixed(2)}s"><circle r="${n1(w * .26)}" fill="none" stroke="#e4f6ff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 9"/><circle r="${n1(w * .15)}" fill="none" stroke="#e4f6ff" stroke-opacity=".45" stroke-width="3" stroke-dasharray="9 7"/></g></g>`;
    return s;
  }
  // (parts) a range hood's light: o._lt (set by the hood parts below) = the Light part, else the drawing's on (as today)
  const LT = (o) => o._lt || o;
  const cones = (o0, xs, y, yc, sp) => { const o = LT(o0); return o.on ? xs.map((x) => `<path d="M${x - 3} ${y}H${x + 3}L${x + (sp || 22)} ${yc}H${x - (sp || 22)}Z" fill="url(#${o.uid}-cone)"/>`).join("") : ""; };
  const pools = (o0, xs, yc, sp) => { const o = LT(o0); return o.on ? xs.map((x) => `<ellipse cx="${x}" cy="${yc + 4}" rx="${(sp || 22) + 8}" ry="5" fill="url(#${o.uid}-pool)"/>`).join("") : ""; };
  const lens = (o0, x, y, w) => { const o = LT(o0); w = w || 8; return o.on ? `<ellipse cx="${x}" cy="${y}" rx="${w * 1.6}" ry="4.5" fill="url(#${o.uid}-hw)"/><ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="1.4" fill="#fff4d6"/>` : `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="1.3" fill="#8a8f96"/><ellipse cx="${x - 1}" cy="${y - .4}" rx="${w / 5}" ry=".5" fill="#fff" fill-opacity=".4"/>`; };
  function hoodScene(o, c) {
    const yc = c.yc || 158, L = c.lights || [], px = c.px || 100; let s = "";
    if (!c.noSplash) s += splash(o, 0, 0, 200, yc, c.tile);
    if (c.island) s += G(`<g mask="url(#${o.uid}-fmh)"><rect x="0" y="${yc + 16}" width="200" height="4" fill="#ddd8cf"/><rect x="0" y="${yc + 20}" width="200" height="6" fill="url(#${o.uid}-ctr)"/><rect x="0" y="${yc + 26}" width="200" height="${174 - yc}" fill="url(#${o.uid}-cab)"/></g>`);
    s += cones(o, L, c.ly, yc + 5, c.sp) + cooktop(o, yc, { gas: c.gas, px: px, a: c.a, b: c.b }) + pools(o, L, yc, c.sp) + pan(o, c.pan || "skillet", px, yc + 5);
    s += streams(o, c.ix || 100, c.iy, c.iw || 100, c.ih || 40) + puffs(o, px, yc - (c.pan === "pot" ? 18 : 6), c.iy + 6, c.np || 3);
    return s;
  }

  const css = `
.hda-microwave-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-microwave-spin{animation:hda-microwave-spin 7s linear infinite}
@keyframes hda-microwave-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-microwave-tick{animation:hda-microwave-spin 40s linear infinite reverse}
.hda-anim .hda-microwave-slide{animation:hda-microwave-slide 1.1s linear infinite}
@keyframes hda-microwave-slide{from{transform:translateX(0)}to{transform:translateX(-8px)}}
.hda-microwave-steam{opacity:.6}
.hda-anim .hda-microwave-steam{animation:hda-microwave-steam 2.6s linear infinite}
@keyframes hda-microwave-steam{0%{transform:translateY(4px);opacity:0}35%{opacity:.95}100%{transform:translateY(-8px);opacity:0}}
.hda-microwave-puff{opacity:.55;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-microwave-puff{animation:hda-microwave-puff 3s ease-out infinite}
@keyframes hda-microwave-puff{0%{transform:translateY(0) scale(.5);opacity:0}20%{opacity:.9}100%{transform:translateY(-50px) scale(1.8);opacity:0}}
.hda-anim .hda-microwave-flow{animation:hda-microwave-flow 1.4s linear infinite}
@keyframes hda-microwave-flow{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}
.hda-anim .hda-microwave-hum{animation:hda-microwave-hum 2.2s ease-in-out infinite}
@keyframes hda-microwave-hum{50%{opacity:.6}}
.hda-anim .hda-microwave-pulse{animation:hda-microwave-pulse 3s ease-in-out infinite}
@keyframes hda-microwave-pulse{50%{opacity:.45}}
.hda-anim .hda-microwave-colon{animation:hda-microwave-colon 1s steps(1,end) infinite}
@keyframes hda-microwave-colon{0%,49%{opacity:1}50%,100%{opacity:.15}}
.hda-microwave-flick{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-microwave-flick{animation:hda-microwave-flick .32s ease-in-out infinite alternate}
@keyframes hda-microwave-flick{from{transform:scaleY(.75)}to{transform:scaleY(1.15)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-microwave-spin,.hda-anim .hda-microwave-tick,.hda-anim .hda-microwave-slide,.hda-anim .hda-microwave-steam,.hda-anim .hda-microwave-puff,.hda-anim .hda-microwave-flow,.hda-anim .hda-microwave-hum,.hda-anim .hda-microwave-pulse,.hda-anim .hda-microwave-colon,.hda-anim .hda-microwave-flick{animation:none!important}}
`;

  const ic = (id, name, colors, render) => ({ id, name, colors, picker: true, colorLabel: "Finish", render });

  const icons = [
    ic("counter", "Countertop", sw(SS), (o) => svg(o,
      counterScene(o, 150, "sub") + sh(o, 100, 151, 82, 4) +
      box3(o, 24, 74, 142, 76, 10, 7) +
      `<path d="${rr(28, 78, 96, 68, 3)}" fill="none" stroke="#000" stroke-opacity=".4"/><path d="M29 78.6H123" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/>` +
      cavity(o, 1, 35, 85, 74, 54, { food: "bowl" }) + handleV(o, 113, 84, 56, 5.5) +
      `<path d="M126 78V146" stroke="#000" stroke-opacity=".3"/>` +
      dispBox(o, 130, 83, 30, 13, 7) + pbars(o, 133, 103, 5) +
      keypad(132, 106, 3, 4, 7, 5, 2.2, 2.4) + startBtn(o, 132, 137, 25, 5.5) +
      `<rect x="30" y="150" width="10" height="2.4" rx="1" fill="#15171a"/><rect x="150" y="150" width="10" height="2.4" rx="1" fill="#15171a"/>` + hl(27, 80, 27, 146, 1.6, .3))),

    ic("pushbtn", "Push-button", sw(WH, CREAM), (o) => { const u = o.uid, b = rr(28, 72, 144, 78, 10); return svg(o,
      counterScene(o, 150, "sub") + sh(o, 100, 151, 82, 4) +
      face(o, b) + `<path d="${rr(28, 72, 144, 24, 10)}" fill="url(#${u}-gl)" opacity=".6"/><path d="${b}" fill="none" stroke="#000" stroke-opacity=".3"/>` +
      `<path d="${rr(34, 78, 92, 66, 7)}" fill="#000" fill-opacity=".08"/>` + cavity(o, 2, 40, 83, 80, 56, { r: 8, food: "plate" }) +
      `<path d="M130 76V146" stroke="#000" stroke-opacity=".22"/>` +
      dispBox(o, 135, 81, 30, 13, 7, DISP) + pbars(o, 138, 102, 5, DISP) +
      [0, 1, 2].map((r) => [0, 1].map((c) => hbtn(143 + c * 14, 108 + r * 7, 2.6)).join("")).join("") +
      `<path d="${rr(135, 128, 30, 15, 4)}" fill="#000" fill-opacity=".25"/><path d="${rr(135, 127, 30, 15, 4)}" fill="url(#${u}-fv)"/><path d="${rr(135, 127, 30, 15, 4)}" fill="none" stroke="#000" stroke-opacity=".35"/>` +
      `<path d="M145 131H155V139H145Z M150 131V139" fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".9"/><path d="M137 128.4H163" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>` +
      `<rect x="34" y="150" width="12" height="2.4" rx="1.2" fill="#15171a"/><rect x="154" y="150" width="12" height="2.4" rx="1.2" fill="#15171a"/>` +
      `<path d="M34 86Q34 76 46 75" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>`); }),

    ic("otr", "Over-the-range", sw(SS), (o) => { const u = o.uid; return svg(o,
      splash(o, 0, 30, 200, 128, "sub") + cones(o, [54, 146], 97, 163, 26) +
      cooktop(o, 158, { cold: true, px: 72 }) + pools(o, [54, 146], 158, 26) + pan(o, "pot", 72, 163) +
      G(`<rect x="0" y="0" width="200" height="32" fill="url(#${u}-wd)"/><rect x="0" y="0" width="200" height="32" fill="url(#${u}-grain)"/>`) +
      G(`<path d="${rr(6, 2, 90, 26, 1.5)} ${rr(104, 2, 90, 26, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/><path d="${rr(12, 6, 78, 18, 1)} ${rr(110, 6, 78, 18, 1)}" fill="none" stroke="#fff" stroke-opacity=".12"/><rect x="0" y="30" width="200" height="2" fill="#000" fill-opacity=".5"/>`) +
      sh(o, 100, 97, 84, 3) + face(o, rr(22, 32, 156, 64, 2)) +
      `<path d="${rr(26, 35, 148, 6, 2)}" fill="#000" fill-opacity=".2"/><path d="${rr(26, 35, 148, 6, 2)}" fill="url(#${u}-slot)"/>` +
      `<path d="${rr(26, 43, 104, 50, 2)}" fill="none" stroke="#000" stroke-opacity=".35"/>` +
      cavity(o, 3, 33, 47, 82, 42, { food: "bowl", bw: 26 }) + handleV(o, 119, 47, 42, 5) +
      dispBox(o, 136, 46, 36, 11, 6.5) + pbars(o, 140, 64, 5) + keypad(137, 67, 3, 3, 9, 4.4, 2.6, 2.2) + startBtn(o, 137, 87, 34, 4.4) +
      `<rect x="22" y="93" width="156" height="4" fill="url(#${u}-sd)"/>` + lens(o, 54, 97, 10) + lens(o, 146, 97, 10)); }),

    ic("builtin", "Built-in trim kit", sw(BS, SS), (o) => { const u = o.uid; return svg(o,
      G(`<rect x="8" y="6" width="184" height="188" fill="url(#${u}-wd)"/><rect x="8" y="6" width="184" height="188" fill="url(#${u}-grain)"/>`) +
      G(`<path d="${rr(16, 10, 168, 34, 2)} ${rr(16, 154, 168, 36, 2)}" fill="#000" fill-opacity=".12" stroke="#000" stroke-opacity=".35"/><path d="${rr(24, 16, 152, 22, 1)}" fill="none" stroke="#fff" stroke-opacity=".14"/>`) +
      G(`<rect x="70" y="166" width="60" height="4" rx="2" fill="url(#${u}-cr)"/><path d="M8 6V194M192 6V194" stroke="#000" stroke-opacity=".4" stroke-width="2"/>`) +
      face(o, rr(24, 48, 152, 102, 2)) + `<path d="${rr(24, 48, 152, 102, 2)}" fill="none" stroke="#000" stroke-opacity=".45"/>` +
      `<rect x="32" y="56" width="136" height="80" fill="#050607"/>` + face(o, rr(34, 57, 132, 78, 1.5)) + `<rect x="34" y="57" width="132" height="78" fill="#000" fill-opacity=".1"/>` +
      `<path d="${rr(37, 60, 92, 72, 2)}" fill="url(#${u}-gs)"/>` + cavity(o, 4, 44, 66, 72, 58, { food: "plate", r: 2 }) + `<path d="${rr(37, 60, 92, 72, 2)}" fill="url(#${u}-gl)" opacity=".6"/>` +
      handleV(o, 120, 66, 58, 4.5) +
      dispBox(o, 135, 62, 28, 11, 6.5) + pbars(o, 137, 81, 5) + keypad(137, 85, 2, 4, 11, 5, 2.2, 2.4) + startBtn(o, 137, 115, 24, 5) +
      `<path d="${rr(40, 139, 120, 6, 2)}" fill="#000" fill-opacity=".25"/><path d="${rr(40, 139, 120, 6, 2)}" fill="url(#${u}-slot)"/>` + hl(27, 52, 27, 146, 1.6, .3)); }),

    ic("drawer", "Drawer", sw(SS), (o) => { const u = o.uid; return svg(o,
      splash(o, 0, 0, 200, 30, "sub") + counter(o, 30) +
      G(`<rect x="0" y="40" width="200" height="160" fill="url(#${u}-wd)"/><rect x="0" y="40" width="200" height="160" fill="url(#${u}-grain)"/><rect x="0" y="40" width="200" height="6" fill="#000" fill-opacity=".35"/>`) +
      G(`<path d="M14 44V196M186 44V196" stroke="#000" stroke-opacity=".3" stroke-width="1.5"/><rect x="0" y="192" width="200" height="8" fill="#16110d"/>`) +
      `<rect x="28" y="52" width="144" height="84" fill="#000" fill-opacity=".45"/>` + face(o, rr(30, 54, 140, 80, 1.5)) +
      `<path d="${rr(30, 54, 140, 12, 1.5)}" fill="url(#${u}-gs)"/>` + dispBox(o, 85, 56, 30, 8, 5) +
      [42, 52, 62, 138, 148, 158].map((x, i) => `<circle cx="${x}" cy="60" r="${i === 5 ? 2 : 1.4}" fill="${o.on ? (i === 5 ? GRN : DISP) : "#fff"}" fill-opacity="${o.on ? .9 : .25}"/>`).join("") +
      `<path d="M30 66.5H170" stroke="#000" stroke-opacity=".5"/><path d="M30 67.5H170" stroke="#fff" stroke-opacity=".35"/>` +
      cavity(o, 5, 46, 76, 108, 46, { food: "bowl", bw: 30 }) +
      `<path d="${rr(82, 126, 36, 3, 1.5)}" fill="#000" fill-opacity=".35"/>` +
      `<path d="${rr(30, 144, 140, 44, 2)}" fill="#000" fill-opacity=".14" stroke="#000" stroke-opacity=".4"/><path d="${rr(36, 150, 128, 32, 1)}" fill="none" stroke="#fff" stroke-opacity=".12"/>` +
      `<rect x="72" y="156" width="56" height="4" rx="2" fill="url(#${u}-cr)"/>` + hl(33, 70, 33, 130, 1.4, .3)); }),

    ic("retro", "Retro", sw(CREAM, MINT, RED, NAVY, WH, BK), (o) => { const u = o.uid, b = rr(28, 66, 144, 84, 20), win = "M40 92Q40 78 54 78H106Q120 78 120 92V130Q120 140 110 140H50Q40 140 40 130Z"; return svg(o,
      counterScene(o, 154, "sq") + sh(o, 100, 155, 80, 4) +
      `<path d="M44 150L40 156H52L50 150Z M150 150L148 156H160L156 150Z" fill="url(#${u}-cr)"/>` +
      face(o, b) + `<path d="${rr(28, 66, 144, 34, 20)}" fill="url(#${u}-gl)" opacity=".75"/><path d="${b}" fill="none" stroke="url(#${u}-cr)" stroke-width="2.6"/>` +
      `<path d="M126 70V146" stroke="url(#${u}-crh)" stroke-width="1.6"/>` +
      cavity(o, 6, 40, 78, 80, 62, { d: win, food: "bowl" }) + `<path d="${win}" fill="none" stroke="url(#${u}-cr)" stroke-width="3.4"/>` +
      `<rect x="121" y="88" width="3.4" height="44" rx="1.7" fill="url(#${u}-crh)"/>` +
      dispBox(o, 134, 77, 28, 10, 5.6, "#ffb347") +
      knob(o, 148, 103, 9.5, -30, o.on ? P + "tick" : "") + knob(o, 148, 128, 7.5, -120 + 240 * o.level) +
      `<path d="M38 82Q40 72 54 70" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2" stroke-linecap="round"/>`); }),

    ic("compact", "Compact dorm", sw(BK, WH, RED, NAVY), (o) => { const u = o.uid; return svg(o,
      G(`<g mask="url(#${u}-fm)" opacity=".55"><rect width="200" height="200" fill="url(#${u}-blk)"/></g>`) +
      `<path d="M40 130L44 124H160L164 130Z" fill="#e9ecef"/><rect x="40" y="130" width="124" height="70" fill="url(#${u}-st)"/><rect x="40" y="130" width="124" height="70" fill="#f1f3f5" fill-opacity=".6"/>` +
      `<path d="M40 137H164" stroke="#000" stroke-opacity=".3"/><rect x="150" y="144" width="4" height="34" rx="2" fill="#000" fill-opacity=".25"/><path d="M42 132V198" stroke="#fff" stroke-opacity=".6"/>` +
      sh(o, 100, 129, 60, 3.5) + box3(o, 48, 86, 96, 42, 8, 5) +
      cavity(o, 7, 52, 90, 60, 34, { food: "mug", bw: 22 }) +
      `<path d="M116 86V128" stroke="#000" stroke-opacity=".35"/>` +
      dispBox(o, 119, 90, 22, 8, 4.6) + keypad(120.5, 102, 2, 3, 9, 4, 1.6, 2, isMetal(o.color) ? 0 : 1) + startBtn(o, 120.5, 120, 19.6, 3.6) +
      `<rect x="52" y="128" width="8" height="2" fill="#111"/><rect x="132" y="128" width="8" height="2" fill="#111"/>`); }),

    ic("combo", "Air-fry combo", sw(BS, SS, BK), (o) => { const u = o.uid;
      const ex = (on) => { let f = ""; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; f += `<path d="M114 100L${n1(114 + Math.cos(a) * 8)} ${n1(100 + Math.sin(a) * 8)}" stroke="#565c64" stroke-width="2.4" stroke-linecap="round"/>`; }
        return `<circle cx="114" cy="100" r="10.5" fill="#000" fill-opacity=".3"/><circle cx="114" cy="100" r="10" fill="url(#${u}-perf)"/><g class="${on ? P + "spin" : ""}" style="animation-duration:.8s">${f}<circle cx="114" cy="100" r="8.5" fill="none"/></g><circle cx="114" cy="100" r="2" fill="url(#${u}-st)"/>` +
          `<path d="M40 86L46 82L52 86L58 82L64 86L70 82L76 86L82 82L88 86L94 82L100 86L106 82L112 86L118 82L124 86" fill="none" stroke="${on ? "#ff6a2a" : "#4a3a33"}" stroke-width="1.8"/>` +
          (on ? `<path class="${P}pulse" d="M38 84H126" stroke="#ff8a3a" stroke-width="8" stroke-opacity=".35"/>` : ""); };
      return svg(o,
      counterScene(o, 150, "sub") + sh(o, 100, 151, 84, 4) + box3(o, 20, 66, 150, 84, 10, 7) +
      `<path d="${rr(24, 70, 142, 76, 3)}" fill="url(#${u}-gs)"/>` +
      cavity(o, 8, 32, 80, 96, 58, { food: "basket", bw: 34, cx: .42, extra: ex }) +
      `<path d="${rr(33, 72, 88, 4, 2)}" fill="url(#${u}-crh)"/>` +
      dispBox(o, 134, 78, 28, 12, 7, DISP) +
      `<path d="M138 98a3 3 0 1 0 0.1 0M144 101q2 -4 0 -6q4 2 2 6z" fill="none" stroke="${o.on ? "#ff8a3a" : "#fff"}" stroke-opacity="${o.on ? 1 : .3}" stroke-width=".9"/>` + pbars(o, 150, 102, 4, DISP) +
      knob(o, 148, 119, 8.5, -120 + 240 * o.level) + startBtn(o, 136, 134, 24, 4.6) +
      `<path d="${rr(24, 70, 142, 76, 3)}" fill="url(#${u}-gl)" opacity=".55"/>`); }),

    ic("smart", "Smart display", sw(BK, SS, WH), (o) => { const u = o.uid, on = o.on, C = 2 * Math.PI * 11, prog = .35;
      const screen = on ? `<circle cx="148" cy="96" r="11" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2.2"/><circle class="${P}pulse" cx="148" cy="96" r="11" fill="none" stroke="${DISP}" stroke-width="2.2" stroke-dasharray="${n1(C * prog)} ${n1(C)}" transform="rotate(-90 148 96)" stroke-linecap="round"/>` +
        `<g fill="#fff">${seg7(148 - segW(6, "1:30") / 2, 93, 6, "1:30", 1)}</g>` +
        [0, 1, 2].map((i) => `<rect x="${133 + i * 11}" y="114" width="8" height="8" rx="2" fill="${["#ff9a4a", "#46e39a", "#62a8ff"][i]}" fill-opacity=".85"/>`).join("") +
        `<rect x="134" y="128" width="28" height="2" rx="1" fill="#fff" fill-opacity=".15"/><rect x="134" y="128" width="${n1(28 * o.level)}" height="2" rx="1" fill="${DISP}"/>` +
        `<path d="M157 79a4 4 0 0 1 6 0M158.4 80.6a2 2 0 0 1 3.2 0" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".7"/>`
        : `<circle cx="148" cy="100" r="1.2" fill="#fff" fill-opacity=".25"/>`;
      const cam = (onn) => onn ? `<circle cx="76" cy="85" r="4" fill="url(#${u}-hc)"/><circle cx="76" cy="85" r="1.4" fill="#0b1a24" stroke="${DISP}" stroke-width=".5"/>` : `<circle cx="76" cy="85" r="1.4" fill="#222"/>`;
      return svg(o,
      counterScene(o, 150, "sub") + sh(o, 100, 151, 82, 4) + box3(o, 22, 68, 148, 82, 10, 7) +
      `<path d="${rr(27, 73, 98, 72, 3)}" fill="url(#${u}-gs)"/>` + cavity(o, 9, 35, 80, 82, 58, { food: "plate", extra: cam }) +
      `<path d="${rr(27, 73, 98, 72, 3)}" fill="url(#${u}-gl)" opacity=".5"/>` +
      `<path d="${rr(129, 74, 38, 70, 4)}" fill="#05070a" stroke="#000" stroke-opacity=".6"/>` + (on ? `<path d="${rr(130, 75, 36, 68, 3.5)}" fill="#0d2230" fill-opacity=".7"/>` : "") + screen +
      `<path d="${rr(129, 74, 38, 30, 4)}" fill="url(#${u}-gl)" opacity=".5"/><path d="${rr(140, 136, 16, 4, 2)}" fill="#fff" fill-opacity="${on ? .5 : .15}"/>`); }),

    ic("sensor", "Sensor touch", sw(SS, BS), (o) => { const u = o.uid, g = (x, y, k) => {
        const c = o.on ? "#d9f6ff" : "#8a9099";
        if (k === 0) return `<path d="M${x - 2.4} ${y + 1}a1.6 1.6 0 0 1 0 -3.2a1.8 1.8 0 0 1 3.4 -.4a1.6 1.6 0 0 1 1.4 3.6Z" fill="none" stroke="${c}" stroke-width=".7"/>`;
        if (k === 1) return `<path d="M${x - 2} ${y - 2}h3.4v3.6h-3.4zM${x + 1.4} ${y - 1}h1.2v1.6h-1.2" fill="none" stroke="${c}" stroke-width=".7"/>`;
        if (k === 2) return `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.9" fill="none" stroke="${c}" stroke-width=".7"/>`;
        return `<circle cx="${x}" cy="${y}" r="2.4" fill="none" stroke="${c}" stroke-width=".7"/><circle cx="${x}" cy="${y}" r="1" fill="none" stroke="${c}" stroke-width=".5"/>`; };
      return svg(o,
      counterScene(o, 152, "sub") + sh(o, 100, 153, 84, 4) + box3(o, 18, 64, 152, 88, 10, 7) +
      `<path d="${rr(22, 68, 108, 80, 3)}" fill="none" stroke="#000" stroke-opacity=".4"/>` +
      `<path d="${rr(28, 74, 90, 68, 2)}" fill="url(#${u}-gs)"/>` + cavity(o, 10, 33, 79, 80, 58, { food: "bowl", bw: 28 }) +
      `<rect x="120" y="72" width="3" height="5" fill="url(#${u}-st)"/><rect x="120" y="139" width="3" height="5" fill="url(#${u}-st)"/>` + handleV(o, 121, 74, 70, 6.5) +
      `<path d="${rr(136, 68, 30, 80, 3)}" fill="url(#${u}-gs)"/>` + dispBox(o, 139, 72, 24, 10, 5.6, DISP) +
      (o.on ? `<circle class="${P}pulse" cx="151" cy="88" r="4.5" fill="url(#${u}-hc)"/><circle cx="151" cy="88" r="1.3" fill="${GRN}"/>` : `<circle cx="151" cy="88" r="1.3" fill="#3a3f46"/>`) +
      [0, 1, 2, 3].map((k) => { const x = 144 + (k % 2) * 14, y = 99 + Math.floor(k / 2) * 10; return `<rect x="${x - 5}" y="${y - 4}" width="10" height="8" rx="1.5" fill="#fff" fill-opacity=".06" stroke="#fff" stroke-opacity=".12" stroke-width=".4"/>` + g(x, y, k); }).join("") +
      knob(o, 151, 130, 8.5, -120 + 240 * o.level) +
      `<path d="${rr(136, 68, 30, 34, 3)}" fill="url(#${u}-gl)" opacity=".5"/>`); }),

    ic("pyramid", "Pyramid chimney", sw(SS, BK, WH), (o) => svg(o,
      hoodScene(o, { tile: "sub", lights: [66, 134], ly: 110, px: 96, pan: "skillet", gas: true, iy: 110, iw: 110, ih: 40 }) +
      face(o, "M84 0H116V64H84Z") + line("M84 34H116", .4) + `<path d="M84 35H116" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>` +
      `<path d="M84 64H87L46 96H36Z" fill="url(#${o.uid}-fv)"/><path d="M113 64H116L164 96H154Z" fill="url(#${o.uid}-sd)"/>` + face(o, "M87 64H113L154 96H46Z") +
      `<path d="M87 64.5H113" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>` +
      face(o, "M34 96H166V108H34Z") + `<path d="M34 96.5H166" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/><path d="M36 108H164L158 111H42Z" fill="#14171b"/>` +
      fanDisp(o, 93, 99.5, 6) + hbtn(76, 102.5, 1.8) + hbtn(84, 102.5, 1.8) + hbtn(116, 102.5, 1.8) + hbtn(124, 102.5, 1.8) +
      lens(o, 66, 110.5, 10) + lens(o, 134, 110.5, 10))),

    ic("glass", "Glass canopy", sw(SS, BK), (o) => { const u = o.uid; return svg(o,
      hoodScene(o, { tile: "sub", lights: [70, 130], ly: 101, px: 84, pan: "pot", iy: 101, iw: 100, ih: 34 }) +
      face(o, "M89 0H111V68H89Z") + line("M89 30H111", .35) +
      face(o, "M80 64H120V84H80Z") +
      `<path d="M24 70Q100 56 176 70L172 80Q100 66 28 80Z" fill="url(#${u}-glz)"/><path d="M24 70Q100 56 176 70" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/><path d="M28 80Q100 66 172 80" fill="none" stroke="#bfe6f2" stroke-opacity=".55" stroke-width="1.4"/>` +
      `<path d="M40 70Q70 63 96 62" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      face(o, "M46 84H154V100H46Z") + `<path d="M46 84.5H154" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/><path d="M48 100H152L148 102.5H52Z" fill="#14171b"/>` +
      fanDisp(o, 93, 89, 6) + hbtn(80, 92, 1.8) + hbtn(87, 92, 1.8) + hbtn(119, 92, 1.8) +
      lens(o, 70, 101, 9) + lens(o, 130, 101, 9)); }),

    ic("island", "Island", sw(SS, BK, WH), (o) => { const u = o.uid; return svg(o,
      G(`<rect x="0" y="0" width="200" height="10" fill="#2d3138"/><path d="M0 10H200" stroke="#fff" stroke-opacity=".15"/>`) +
      hoodScene(o, { noSplash: true, island: true, lights: [70, 130], ly: 106, px: 112, pan: "skillet", a: 30, b: 170, iy: 106, iw: 110, ih: 40 }) +
      face(o, "M80 9H120V12H80Z") + face(o, "M88 12H112V74H88Z") + line("M88 40H112", .35) +
      `<path d="M160 74L168 70V98L160 102Z" fill="url(#${u}-sd)"/>` + face(o, "M40 74H160V102H40Z") + `<path d="M40 74.5H160" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>` +
      `<path d="M40 102H160L150 110H50Z" fill="#202328"/><path d="M48 103.5H152L145 108.5H55Z" fill="url(#${u}-filt)"/><path d="M100 103.5V108.5" stroke="#202328" stroke-width="1.2"/>` +
      fanDisp(o, 94, 85, 6.5) + hbtn(80, 88, 1.9) + hbtn(88, 88, 1.9) + hbtn(120, 88, 1.9) +
      lens(o, 70, 106.5, 9) + lens(o, 130, 106.5, 9)); }),

    ic("undercab", "Under-cabinet", sw(SL, SS, WH, BK), (o) => { const u = o.uid; return svg(o,
      hoodScene(o, { tile: "sub", lights: [56, 100, 144], ly: 88, sp: 18, px: 100, pan: "skillet", iy: 88, iw: 120, ih: 48 }) +
      G(`<rect x="0" y="0" width="200" height="66" fill="url(#${u}-wd)"/><rect x="0" y="0" width="200" height="66" fill="url(#${u}-grain)"/>`) +
      G(`<path d="${rr(4, 4, 94, 58, 1.5)} ${rr(102, 4, 94, 58, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/><path d="${rr(12, 12, 78, 42, 1)} ${rr(110, 12, 78, 42, 1)}" fill="#000" fill-opacity=".08" stroke="#fff" stroke-opacity=".12"/>`) +
      G(`<rect x="90" y="50" width="3" height="8" rx="1.5" fill="url(#${u}-cr)"/><rect x="107" y="50" width="3" height="8" rx="1.5" fill="url(#${u}-cr)"/><rect x="0" y="64" width="200" height="2" fill="#000" fill-opacity=".5"/>`) +
      face(o, "M26 66H174V73L170 85H30L26 73Z") + `<path d="M26 73H174" stroke="#fff" stroke-opacity=".45" stroke-width=".7"/>` +
      `<path d="M30 85H170L166 89H34Z" fill="#202328"/><path d="M40 85.6H160L158 88.4H42Z" fill="url(#${u}-filt)" opacity=".8"/>` +
      fanDisp(o, 138, 74.5, 6) + [0, 1, 2].map((i) => `<rect x="${44 + i * 9}" y="76" width="5" height="5" rx="1" fill="#2a2e35"/><rect x="${44.6 + i * 9}" y="76.5" width="3.8" height=".8" fill="#fff" fill-opacity=".25"/>`).join("") +
      lens(o, 56, 88.5, 8) + lens(o, 100, 88.5, 8) + lens(o, 144, 88.5, 8)); }),

    ic("mantel", "Wood mantel", [WOOD, PAINTW, NAVY, SAGE, SL, BK], (o) => { const u = o.uid, p = pal(o.color), gr = (d) => `<path d="${d}" fill="url(#${u}-grain)" opacity=".8"/>`;
      const corbel = (x, s) => `<path d="M${x} 106H${x + 12 * s}V110Q${x + 12 * s} 114 ${x + 8 * s} 116Q${x + 3 * s} 119 ${x + 4 * s} 125Q${x} 126 ${x} 120Z" fill="url(#${u}-fv)"/><path d="M${x} 106H${x + 12 * s}V110Q${x + 12 * s} 114 ${x + 8 * s} 116Q${x + 3 * s} 119 ${x + 4 * s} 125Q${x} 126 ${x} 120Z" fill="none" stroke="${p.k}" stroke-opacity=".7" stroke-width=".7"/>`;
      return svg(o,
      hoodScene(o, { tile: "sub", lights: [72, 128], ly: 112, px: 116, pan: "pot", gas: true, iy: 112, iw: 100, ih: 26 }) +
      face(o, "M60 0H140V52H60Z") + gr("M60 0H140V52H60Z") + `<path d="${rr(68, 8, 64, 36, 1)}" fill="none" stroke="#000" stroke-opacity=".3"/><path d="${rr(69, 9, 62, 34, 1)}" fill="none" stroke="#fff" stroke-opacity=".18"/>` +
      `<rect x="56" y="50" width="88" height="4" fill="url(#${u}-fv)"/>` +
      face(o, "M60 54H140L168 86H32Z") + gr("M60 54H140L168 86H32Z") +
      `<rect x="24" y="86" width="152" height="3" fill="${p.l}"/><rect x="24" y="89" width="152" height="5" fill="url(#${u}-fv)"/><rect x="24" y="94" width="152" height="2" fill="${p.k}"/>` +
      face(o, "M28 96H172V106H28Z") + gr("M28 96H172V106H28Z") + `<path d="M28 106H172" stroke="#000" stroke-opacity=".5"/>` +
      corbel(30, 1) + corbel(170, -1) +
      `<path d="M44 106H156V113H44Z" fill="url(#${u}-stv)"/><path d="M44 113H156" stroke="#000" stroke-opacity=".5"/>` +
      fanDisp(o, 94, 107.2, 4.4) + lens(o, 72, 113, 8) + lens(o, 128, 113, 8)); }),

    ic("plaster", "Plaster mantel", [PLAS, GREIGE, TERRA, SAGE, NAVY, BK], (o) => { const u = o.uid, p = pal(o.color), b = "M68 0V24C68 56 30 66 26 94H174C170 66 132 56 132 24V0Z"; return svg(o,
      hoodScene(o, { tile: "sq", lights: [68, 132], ly: 114, px: 92, pan: "pot", gas: true, iy: 114, iw: 110, ih: 26 }) +
      face(o, b) + `<path d="${b}" fill="url(#${u}-pls)"/>` + `<path d="M74 4V24C74 52 46 64 38 90" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>` +
      `<rect x="22" y="94" width="156" height="2.4" fill="${p.l}"/>` + face(o, "M22 96.4H178V104H22Z") + `<rect x="22" y="104" width="156" height="2" fill="${p.k}"/>` +
      face(o, "M26 106H174V110H26Z") + `<path d="M26 110H174" stroke="#000" stroke-opacity=".45"/>` +
      `<path d="M40 110H160V114H40Z" fill="url(#${u}-stv)"/>` + fanDisp(o, 93, 97.5, 5) +
      lens(o, 68, 114.4, 8) + lens(o, 132, 114.4, 8)); }),

    ic("downdraft", "Downdraft", sw(SS, BK), (o) => { const u = o.uid, on = o.on, top = on ? 102 : 138; return svg(o,
      splash(o, 0, 0, 200, 142, "sub") +
      (on ? `<rect x="50" y="${top + 6}" width="104" height="${142 - top - 6}" fill="#000" fill-opacity=".3"/>` : "") +
      (on ? `<path d="M46 ${top + 6}H154V142H46Z" fill="url(#${u}-gs)"/><path d="${rr(52, top + 12, 96, 20, 2)}" fill="#000" fill-opacity=".4"/><path d="${rr(52, top + 12, 96, 20, 2)}" fill="url(#${u}-slot)"/>` +
        `<path d="M46 ${top + 6}H154V${top + 22}H46Z" fill="url(#${u}-gl)" opacity=".4"/>` + fanDisp(o, 138, top + 34, 4.6) : "") +
      face(o, `M44 ${top}H156V${top + 6}H44Z`) + `<path d="M44 ${top + .5}H156" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>` +
      (on ? `<path d="M50 ${top + 6.6}H150" stroke="#5aa9ff" stroke-width="1.2"/><path class="${P}pulse" d="M50 ${top + 6.6}H150" stroke="#5aa9ff" stroke-width="4" stroke-opacity=".3"/>` : "") +
      G(`<path d="M6 142H194L200 158H0Z" fill="#cfc9bf"/><path d="M6 142H194L200 158H0Z" fill="url(#${u}-ctr)" opacity=".5"/><rect x="0" y="158" width="200" height="8" fill="url(#${u}-ctr)"/><path d="M0 166H200" stroke="#000" stroke-opacity=".5"/>`) +
      G(`<rect x="0" y="166" width="200" height="30" fill="url(#${u}-cab)"/>`) +
      G(`<path d="M42 144H158L162 155H38Z" fill="url(#${u}-ck)"/><path d="M42 144H158" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>`) +
      `<ellipse cx="128" cy="149.5" rx="16" ry="3" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width=".7"/><ellipse cx="80" cy="149.5" rx="16" ry="3" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width=".7"/>` +
      (on ? `<ellipse class="${P}pulse" cx="80" cy="149.5" rx="21" ry="4.5" fill="url(#${u}-ho)"/><ellipse cx="80" cy="149.5" rx="16" ry="3" fill="none" stroke="#ff5a2a" stroke-opacity=".85"/>` : "") +
      pan(o, "skillet", 80, 151) +
      (on ? streams(o, 100, top + 22, 80, 20, true) + puffs(o, 80, 142, top + 22, 3) : "") +
      `<path d="M2 159H198" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/>`); }),

    ic("ceiling", "Ceiling flush", sw(WH, SS, BK), (o) => { const u = o.uid, L = [42, 158]; return svg(o,
      G(`<path d="M0 0H200V22L182 46H18L0 22Z" fill="#33373e"/><path d="M0 0H200V22L182 46H18L0 22Z" fill="url(#${u}-vsh)"/><path d="M18 46H182" stroke="#fff" stroke-opacity=".12"/>`) +
      hoodScene(o, { noSplash: true, island: true, lights: [], ly: 44, px: 100, pan: "pot", iy: 44, iw: 120, ih: 90, np: 4 }) +
      cones(o, L, 41, 163, 30) + pools(o, L, 158, 30) +
      face(o, "M44 10H156L172 38H28Z") + `<path d="M44 10.5H156" stroke="#000" stroke-opacity=".4"/>` +
      `<path d="M58 15H142L154 33H46Z" fill="#1d2025"/><path d="M60 16.5H140L150 31.5H50Z" fill="url(#${u}-filt)"/><path d="M100 16.5V31.5M80 16.5L75 31.5M120 16.5L125 31.5" stroke="#1d2025" stroke-width="1.2"/>` +
      face(o, "M28 38H172V45H28Z") + `<path d="M28 38.4H172" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/>` +
      fanDisp(o, 94, 39.4, 4.2) + lens(o, 42, 41.5, 10) + lens(o, 158, 41.5, 10)); }),

    ic("angled", "Angled glass", sw(BK, WH, SS, BS), (o) => { const u = o.uid, g = "M50 60H150L172 112H28Z"; return svg(o,
      hoodScene(o, { tile: "sub", lights: [72, 128], ly: 117, px: 104, pan: "skillet", iy: 116, iw: 120, ih: 30 }) +
      face(o, "M90 0H110V60H90Z") + face(o, "M58 50H142V62H58Z") +
      face(o, g) + `<path d="${g}" fill="url(#${u}-gs)" opacity=".35"/><path d="${g}" fill="url(#${u}-gl)"/>` +
      `<path d="M70 60L58 112H74L86 60Z" fill="#fff" fill-opacity=".08"/><path d="M94 60L84 112H90L100 60Z" fill="#fff" fill-opacity=".06"/>` +
      `<path d="M54 64H146L165 108H35Z" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="1.2"/><path d="M50 60.5H150" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>` +
      `<path d="M28 112H172V116H28Z" fill="url(#${u}-stv)"/>` + fanDisp(o, 138, 98, 5) +
      [0, 1, 2].map((i) => `<circle cx="${112 + i * 7}" cy="101" r="1.4" fill="none" stroke="#fff" stroke-opacity="${o.on ? .8 : .3}" stroke-width=".6"/>`).join("") +
      lens(o, 72, 116.4, 9) + lens(o, 128, 116.4, 9)); }),

    ic("copper", "Copper bell", [COP, BRASS, SS, BK, NAVY], (o) => { const u = o.uid, p = pal(o.color), b = "M86 40H114C120 62 150 70 166 94H34C50 70 80 62 86 40Z";
      const riv = (x, y) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="1.2" fill="${p.d}"/><circle cx="${n1(x - .4)}" cy="${n1(y - .4)}" r=".5" fill="${p.l}"/>`;
      let rv = ""; for (let i = 0; i < 13; i++) rv += riv(42 + i * 9.7, 90);
      return svg(o,
      hoodScene(o, { tile: "sq", lights: [70, 130], ly: 108, px: 100, pan: "pot", gas: true, iy: 108, iw: 110, ih: 26 }) +
      face(o, "M86 0H114V40H86Z") + `<path d="M86 0H114V40H86Z" fill="url(#${u}-ham)"/>` +
      [12, 32].map((y) => `<rect x="84" y="${y}" width="32" height="3.4" fill="${p.d}"/><rect x="84" y="${y}" width="32" height="1" fill="${p.l}"/>` + riv(88, y + 1.8) + riv(112, y + 1.8)).join("") +
      face(o, b) + `<path d="${b}" fill="url(#${u}-ham)"/>` +
      `<path d="M92 40C90 62 70 78 64 94" fill="none" stroke="${p.d}" stroke-width="4"/><path d="M108 40C110 62 130 78 136 94" fill="none" stroke="${p.d}" stroke-width="4"/>` +
      riv(91, 50) + riv(86, 66) + riv(77, 80) + riv(109, 50) + riv(114, 66) + riv(123, 80) + rv +
      `<path d="M78 52C66 64 52 74 44 86" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="${rr(30, 94, 140, 11, 5.5)}" fill="url(#${u}-fv)"/><path d="${rr(30, 94, 140, 11, 5.5)}" fill="url(#${u}-ham)"/><path d="M34 96H166" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>` +
      `<path d="M38 105H162V108H38Z" fill="#202328"/>` + fanDisp(o, 93, 96.6, 5) +
      lens(o, 70, 108.4, 8) + lens(o, 130, 108.4, 8)); }),
  ];

  // ---------- (parts) range hoods: Fan + Light parts ----------
  // o.mf = a Multi-Function Image: o.parts holds only the ticked parts; the fan pulls the steam up (and runs the cooking
  // below it, as people do), the light washes the cooktop. A part left out is off. A Device Image (no o.mf, no parts) is today's.
  // The fan's speed: o.plevel.fan, else the slider.
  const HOODS = ["pyramid", "glass", "island", "undercab", "mantel", "plaster", "downdraft", "ceiling", "angled", "copper"];
  icons.forEach((ic) => {
    if (HOODS.indexOf(ic.id) < 0) return;
    const nolamp = ic.id === "downdraft";
    ic.parts = [{ id: "fan", name: "Fan", type: "switch" }].concat(nolamp ? [] : [{ id: "light", name: "Light", type: "switch" }]);
    const R = ic.render;
    ic.render = (o) => {
      const p = o.parts || {};
      if (!o.mf && p.fan == null && p.light == null) return R(o);
      const g = (k) => (o.mf ? !!p[k] : !!o.on && p[k] !== false);
      const fl = o.plevel && o.plevel.fan != null && isFinite(+o.plevel.fan) ? Math.max(0, Math.min(1, +o.plevel.fan)) : o.level;
      return R(Object.assign({}, o, { on: g("fan"), level: fl, _lt: Object.assign({}, o, { on: nolamp ? false : g("light") }) }));
    };
  });

  (window.HDA = window.HDA || []).push({
    id: "microwave", tab: "Microwaves & hoods", group: "Appliances", kind: "device",
    intro: "Ten microwaves and ten range hoods. A running microwave lights up inside, the turntable turns, the dish steams and the display counts down (the slider is power); a running hood pulls swirling air and steam up from the pan, its lights wash the cooktop and the display shows the fan speed. As a Multi-Function Image a hood's Fan and Light are separate parts.",
    
    css, icons,
  });
})();
