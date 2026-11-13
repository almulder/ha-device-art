(function () {
  const P = "hda-dishwasher-";
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  const H = () => window.HDAH;
  const SS = "#b9bfc5", BS = "#4b4f56", WH = "#f1f2ef", BK = "#202226", SL = "#676a68";
  const MINT = "#a6d8c1", CREAM = "#efe3c3", RED = "#c63c34", NAVY = "#263a5f", PINK = "#f0a9b5";
  const FIN = [SS, BS, WH, BK, SL];
  const sw = (first, more) => { const a = [first]; FIN.concat(more || []).forEach((c) => { if (a.indexOf(c) < 0) a.push(c); }); return a.slice(0, 7); };
  const n1 = (v) => (+v).toFixed(1);
  const DISP = "#8fdcff", ICE = "#4fb3ff", REDL = "#ff4b4b", GREEN = "#3ddc97", AMB = "#ffb44a", WHT = "#eaf6ff";
  const CY = 52, KY = 176, FY = 184;
  const metal = (o) => { const c = String(o.color).toLowerCase(); return c === SS ? "ss" : c === BS ? "bs" : ""; };
  const lum = (c) => { const h = H().hx(c); return (h[0] * .3 + h[1] * .59 + h[2] * .11) / 255; };
  const done = (o) => o.level >= .97;
  const dry = (o) => o.on && o.level >= .85;
  const remain = (o) => { const r = Math.max(1, Math.round(128 * (1 - o.level))); return Math.floor(r / 60) + ":" + ("0" + (r % 60)).slice(-2); };

  function pal(c) { const h = H(); return { l: h.shade(c, .5), m: c, d: h.shade(c, -.22), k: h.shade(c, -.45), e: h.shade(c, -.5) }; }
  const halo = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset=".45" stop-color="${c}" stop-opacity=".28"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const stops = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("");

  function finStops(o) {
    const m = metal(o), h = H(), c = o.color;
    if (m === "ss") return [[0, "#7c848b"], [.15, "#c6ccd1"], [.3, "#eef1f3"], [.5, "#a5acb3"], [.72, "#dde1e5"], [1, "#80878e"]];
    if (m === "bs") return [[0, "#24272b"], [.15, "#4e5359"], [.3, "#7b8188"], [.5, "#393d42"], [.72, "#60656c"], [1, "#212428"]];
    return [[0, h.shade(c, -.2)], [.2, h.shade(c, .3)], [.55, c], [1, h.shade(c, -.3)]];
  }
  const edgeC = (o) => { const m = metal(o); return m === "ss" ? "#596067" : m === "bs" ? "#121417" : H().shade(o.color, -.5); };

  function defs(o, extra) {
    const u = o.uid;
    return `<defs>
<linearGradient id="${u}-fin" x1="0" x2="1">${stops(finStops(o))}</linearGradient>
<linearGradient id="${u}-finv" x1="0" y1="0" x2="0" y2="1">${stops(finStops(o))}</linearGradient>
<linearGradient id="${u}-fv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".22" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>
<linearGradient id="${u}-gls" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".35" stop-color="#fff" stop-opacity=".04"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-shn" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8f1ff" stop-opacity=".3"/><stop offset=".4" stop-color="#d8f1ff" stop-opacity=".03"/><stop offset=".62" stop-color="#d8f1ff" stop-opacity=".1"/><stop offset="1" stop-color="#d8f1ff" stop-opacity=".02"/></linearGradient>
<linearGradient id="${u}-tub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b434c"/><stop offset=".5" stop-color="#252b32"/><stop offset="1" stop-color="#14181d"/></linearGradient>
<linearGradient id="${u}-tubx" x1="0" x2="1"><stop offset="0" stop-color="#8f99a3" stop-opacity=".2"/><stop offset=".3" stop-color="#c8d0d8" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#8f99a3" stop-opacity=".16"/></linearGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".45" stop-color="#eef1f3"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-stv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f4f6"/><stop offset=".45" stop-color="#a0a7ae"/><stop offset="1" stop-color="#565c63"/></linearGradient>
<linearGradient id="${u}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfeff"/><stop offset=".35" stop-color="#8f969e"/><stop offset=".55" stop-color="#eef0f2"/><stop offset="1" stop-color="#5d636b"/></linearGradient>
<linearGradient id="${u}-brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3a2"/><stop offset=".45" stop-color="#c8963f"/><stop offset="1" stop-color="#7a5520"/></linearGradient>
<linearGradient id="${u}-blk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5f66"/><stop offset=".4" stop-color="#1d2024"/><stop offset="1" stop-color="#0c0d10"/></linearGradient>
<linearGradient id="${u}-dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1015"/><stop offset="1" stop-color="#22272f"/></linearGradient>
<linearGradient id="${u}-ovh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".35" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<linearGradient id="${u}-wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7a670"/><stop offset=".5" stop-color="#b9834f"/><stop offset="1" stop-color="#7d5130"/></linearGradient>
<radialGradient id="${u}-plate" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef2f6"/><stop offset="1" stop-color="#c3ccd6"/></radialGradient>
<radialGradient id="${u}-pf"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".5" stop-color="#e6edf5" stop-opacity=".6"/><stop offset=".78" stop-color="#9fb0c2" stop-opacity=".22"/><stop offset="1" stop-color="#9fb0c2" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-tl" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#e6f4ff" stop-opacity=".55"/><stop offset="1" stop-color="#e6f4ff" stop-opacity="0"/></radialGradient>
${halo(u + "-hb", DISP)}${halo(u + "-hr", REDL)}${halo(u + "-hg", GREEN)}${halo(u + "-ha", AMB)}${halo(u + "-hi", ICE)}${halo(u + "-hw", WHT)}
<pattern id="${u}-br" width="70" height="5" patternUnits="userSpaceOnUse"><path d="M0 .6H70M0 2.2H44M30 3.4H70M0 4.4H52" stroke="#fff" stroke-opacity=".13" stroke-width=".4"/><path d="M8 1.4H70M0 3H26M48 4H70" stroke="#000" stroke-opacity=".09" stroke-width=".4"/></pattern>
<pattern id="${u}-sub" width="20" height="8" patternUnits="userSpaceOnUse"><path d="M0 .4H20M0 4.4H20M.4 0V4M10.4 4V8" stroke="#000" stroke-opacity=".2" stroke-width=".8"/><path d="M0 1.3H20M0 5.3H20" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/></pattern>
<pattern id="${u}-sq" width="11" height="11" patternUnits="userSpaceOnUse"><path d="M0 .4H11M.4 0V11" stroke="#000" stroke-opacity=".2" stroke-width=".8"/><path d="M1.2 1.4H10M1.4 1.2V10" stroke="#fff" stroke-opacity=".28" stroke-width=".6"/></pattern>
<pattern id="${u}-vt" width="6" height="22" patternUnits="userSpaceOnUse"><path d="M.4 0V22M0 .4H6" stroke="#000" stroke-opacity=".18" stroke-width=".7"/><path d="M1.3 1V21" stroke="#fff" stroke-opacity=".26" stroke-width=".5"/></pattern>
<pattern id="${u}-mar" width="90" height="40" patternUnits="userSpaceOnUse"><path d="M0 12C18 8 26 22 44 18S70 4 90 10M10 40C24 30 40 34 52 26S78 30 90 22M60 0C64 8 58 14 66 20" fill="none" stroke="#5d6670" stroke-opacity=".28" stroke-width=".7"/><path d="M0 30C20 26 30 36 50 32" fill="none" stroke="#a6aeb6" stroke-opacity=".3" stroke-width="1.6"/></pattern>
<pattern id="${u}-marw" width="90" height="40" patternUnits="userSpaceOnUse"><path d="M0 12C18 8 26 22 44 18S70 4 90 10M10 40C24 30 40 34 52 26S78 30 90 22" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/></pattern>
<pattern id="${u}-spl" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".45" fill="#000" fill-opacity=".22"/><circle cx="6.5" cy="7" r=".35" fill="#000" fill-opacity=".18"/><circle cx="7" cy="1.5" r=".3" fill="#000" fill-opacity=".14"/></pattern>
<pattern id="${u}-spk" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="2" r=".6" fill="#fff" fill-opacity=".35"/><circle cx="5.5" cy="6" r=".5" fill="#000" fill-opacity=".4"/><circle cx="6" cy="2.5" r=".4" fill="#fff" fill-opacity=".22"/><circle cx="2.5" cy="6.2" r=".45" fill="#c8a37a" fill-opacity=".4"/></pattern>
<pattern id="${u}-bb" width="26" height="12" patternUnits="userSpaceOnUse"><rect width="9" height="12" fill="#fff" fill-opacity=".08"/><rect x="17" width="9" height="12" fill="#000" fill-opacity=".1"/><path d="M9 0V12M17 0V12" stroke="#3a2414" stroke-opacity=".3" stroke-width=".5"/><path d="M0 4H9M17 8H26" stroke="#3a2414" stroke-opacity=".12" stroke-width=".4"/></pattern>
<pattern id="${u}-grain" width="44" height="7" patternUnits="userSpaceOnUse"><path d="M0 2C11 1 22 3 44 2M0 5C15 6 28 4.2 44 5.2" fill="none" stroke="#2c1a0e" stroke-opacity=".22" stroke-width=".55"/></pattern>
<pattern id="${u}-vgrain" width="7" height="44" patternUnits="userSpaceOnUse"><path d="M2 0C1 11 3 22 2 44M5 0C6 15 4.2 28 5.2 44" fill="none" stroke="#2c1a0e" stroke-opacity=".22" stroke-width=".55"/></pattern>
<pattern id="${u}-vent" width="4" height="8" patternUnits="userSpaceOnUse"><rect x=".6" y="1" width="1.6" height="6" rx=".8" fill="#000" fill-opacity=".55"/><rect x="2.2" y="1" width=".5" height="6" fill="#fff" fill-opacity=".08"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" overflow="hidden" style="overflow:hidden">${defs(o, extra)}${body}</svg>`;
  const rr = (x, y, w, h, r) => { r = Math.max(0, Math.min(r, w / 2, h / 2)); return `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${r} ${r} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${r} ${r} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${r} ${r} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${r} ${r} 0 0 1 ${n1(x + r)} ${n1(y)}Z`; };
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 1}" stroke-linecap="round"/>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="url(#${o.uid}-sh)"/>`;

  const TOPS = {
    marble: { b: "#e8ebee", e1: "#f6f7f8", e2: "#bfc5cb", pat: "mar" },
    quartz: { b: "#f1efea", e1: "#fbfaf7", e2: "#cdc8be", pat: "spl" },
    granite: { b: "#2a2c30", e1: "#3c3f45", e2: "#121316", pat: "spk" },
    butcher: { b: "#c08a57", e1: "#d6a36e", e2: "#83552f", pat: "bb" },
    walnut: { b: "#6e4528", e1: "#8a5a3a", e2: "#40261a", pat: "bb" },
    concrete: { b: "#9a9d9c", e1: "#b6b8b7", e2: "#6c6f6e", pat: "spl" },
    soap: { b: "#39413f", e1: "#4b5452", e2: "#1f2524", pat: "marw" },
    laminate: { b: "#e3d8c1", e1: "#efe7d3", e2: "#b3a68b", pat: "spk" },
    redlam: { b: "#cf4339", e1: "#e2584d", e2: "#8f241d", pat: "spk" },
    steel: { b: "#c3c8cd", e1: "#e9ecef", e2: "#7d848b", pat: "br" },
  };
  const FLOORS = { wood: "#8a5c3a", oak: "#c09669", tile: "#d4d1ca", slate: "#43403d", quarry: "#8e4e37", vinyl: "#cdc4b1", check: "#eceae4" };
  const persp = (x, y) => 100 + (x - 100) * (1 + (y - FY) * .065);

  function floor(o, kind) {
    const u = o.uid, c = FLOORS[kind] || FLOORS.wood; let s = `<clipPath id="${u}-flc"><rect x="0" y="${FY}" width="200" height="${200 - FY}"/></clipPath><g clip-path="url(#${u}-flc)"><rect x="0" y="${FY}" width="200" height="${200 - FY}" fill="${c}"/>`;
    if (kind === "check") {
      const rows = [FY, FY + 5, FY + 10.5, 200];
      for (let r = 0; r < 3; r++) for (let i = -6; i < 20; i++) { if ((i + r) % 2) continue;
        const xa = -10 + i * 13, xb = xa + 13, y1 = rows[r], y2 = rows[r + 1];
        s += `<path d="M${n1(persp(xa, y1))} ${y1}L${n1(persp(xb, y1))} ${y1}L${n1(persp(xb, y2))} ${y2}L${n1(persp(xa, y2))} ${y2}Z" fill="#1c1d21"/>`; }
    } else {
      const step = kind === "tile" || kind === "quarry" || kind === "slate" ? 24 : kind === "vinyl" ? 18 : 14;
      for (let x = -80; x <= 280; x += step) s += `<path d="M${x} ${FY}L${n1(persp(x, 200))} 200" stroke="#000" stroke-opacity=".22" stroke-width=".7"/><path d="M${x + 1} ${FY}L${n1(persp(x + 1, 200) + .6)} 200" stroke="#fff" stroke-opacity=".1" stroke-width=".5"/>`;
      if (kind === "wood" || kind === "oak") for (let i = 0; i < 16; i++) { const y = FY + 3 + (i % 3) * 4.2, x = -10 + i * 14 + (i % 2) * 5; s += `<path d="M${n1(persp(x, y))} ${n1(y)}H${n1(persp(x + 14, y))}" stroke="#000" stroke-opacity=".18" stroke-width=".5"/>`; }
      else s += `<path d="M0 ${FY + 6.5}H200" stroke="#000" stroke-opacity=".2" stroke-width=".7"/><path d="M0 ${FY + 7.3}H200" stroke="#fff" stroke-opacity=".12" stroke-width=".5"/>`;
    }
    return s + `</g><rect x="0" y="${FY}" width="200" height="${200 - FY}" fill="url(#${u}-fl)"/>`;
  }
  function pull(o, kind, x, y, len, vert) {
    const u = o.uid;
    if (kind === "none") return "";
    if (kind === "knob" || kind === "bknob") { const f = kind === "knob" ? `url(#${u}-brass)` : `url(#${u}-blk)`; return `<circle cx="${x}" cy="${y + .8}" r="2.4" fill="#000" fill-opacity=".3"/><circle cx="${x}" cy="${y}" r="2.2" fill="${f}"/><circle cx="${x - .7}" cy="${y - .7}" r=".7" fill="#fff" fill-opacity=".7"/>`; }
    if (kind === "cup") return `<path d="M${x - len / 2} ${y}H${x + len / 2}Q${x + len / 2} ${y + 3.6} ${x} ${y + 3.6}Q${x - len / 2} ${y + 3.6} ${x - len / 2} ${y}Z" fill="url(#${u}-cr)"/><path d="M${x - len / 2} ${y}H${x + len / 2}" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>`;
    const f = kind === "brass" ? `url(#${u}-brass)` : kind === "black" ? `url(#${u}-blk)` : `url(#${u}-st${vert ? "" : "v"})`;
    if (vert) return `<rect x="${x - .9}" y="${y + 1}" width="2.6" height="${len}" rx="1.2" fill="#000" fill-opacity=".3"/><rect x="${x - 1.3}" y="${y}" width="2.6" height="${len}" rx="1.3" fill="${f}"/>`;
    return `<rect x="${x - len / 2}" y="${y + 1}" width="${len}" height="2.6" rx="1.2" fill="#000" fill-opacity=".3"/><rect x="${x - len / 2}" y="${y - 1.3}" width="${len}" height="2.6" rx="1.3" fill="${f}"/>`;
  }
  function face(o, s, x, y, w, h) {
    const u = o.uid, st = s.style || "shaker";
    let r = `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx=".8" fill="url(#${u}-cab)"/>`;
    if (s.grain) r += `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-${s.grain === "v" ? "vgrain" : "grain"})"/>`;
    if (s.brush) r += `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-br)"/>`;
    r += `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-cabx)"/>`;
    if (st === "shaker" && w > 14 && h > 12) {
      const b = Math.min(5.5, w * .15, h * .22), ix = x + b, iy = y + b, iw = w - 2 * b, ih = h - 2 * b;
      r += `<rect x="${n1(ix)}" y="${n1(iy)}" width="${n1(iw)}" height="${n1(ih)}" fill="#000" fill-opacity=".06"/>` +
        `<path d="M${n1(ix)} ${n1(iy + ih)}V${n1(iy)}H${n1(ix + iw)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".9"/>` +
        `<path d="M${n1(ix + iw)} ${n1(iy)}V${n1(iy + ih)}H${n1(ix)}" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width=".8"/>`;
    } else r += `<path d="M${n1(x)} ${n1(y)}L${n1(x + w * .5)} ${n1(y)}L${n1(x)} ${n1(y + h * .5)}Z" fill="#fff" fill-opacity=".06"/>`;
    return r + `<path d="M${n1(x + .6)} ${n1(y + .5)}H${n1(x + w - .6)}" stroke="#fff" stroke-opacity=".32" stroke-width=".7"/><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx=".8" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>`;
  }
  function column(o, s, x1, x2, kind, side, top, bot) {
    if (x2 - x1 < 5) return "";
    top = top == null ? CY : top; bot = bot == null ? KY : bot;
    const x = x1 + 1.2, w = x2 - x1 - 2.4, y = top + 1.2, h = bot - top - 2.4, pk = s.pull || "steel", knob = pk === "knob" || pk === "bknob";
    const hz = (yy, ww) => knob ? pull(o, pk, x + w / 2, yy, 0) : pull(o, pk === "cup" ? "cup" : pk, x + w / 2, yy, Math.min(ww, 22));
    let r = "";
    if (kind === "d3" || kind === "d2") {
      const fr = kind === "d3" ? [.24, .36, .4] : [.42, .58]; let yy = y;
      fr.forEach((f) => { const hh = h * f - 1.6; r += face(o, s, x, yy, w, hh) + hz(yy + (pk === "cup" ? 4 : 6), w * .4); yy += h * f; });
      return r;
    }
    if (kind === "dd") {
      const dh = h * .2; r += face(o, s, x, y, w, dh) + hz(y + dh / 2 - (pk === "cup" ? 1.5 : 0), w * .4);
      const yy = y + dh + 1.6, hh = h - dh - 1.6; r += face(o, s, x, yy, w, hh);
      const px = side === "l" ? x + w - 6 : x + 6;
      r += knob ? pull(o, pk, px, yy + 8, 0) : pull(o, pk === "cup" ? "steel" : pk, px, yy + 5, 18, true);
      return r;
    }
    const px = side === "l" ? x + w - 6 : x + 6;
    return face(o, s, x, y, w, h) + (knob ? pull(o, pk, px, y + 8, 0) : pull(o, pk === "cup" ? "steel" : pk, px, y + 5, 18, true));
  }
  function faucet(o, x, y, dir) { return G(faucet0(o, x, y, dir)); }
  function faucet0(o, x, y, dir) {
    const u = o.uid, d = dir || 1, sx = x + d * 15;
    return `<ellipse cx="${x}" cy="${y + 1}" rx="5" ry="1.4" fill="#000" fill-opacity=".3"/><rect x="${x - 3.6}" y="${y - 4}" width="7.2" height="5" rx="1.2" fill="url(#${u}-st)"/>` +
      `<path d="M${x} ${y - 3}V${y - 22}Q${x} ${y - 30} ${x + d * 7.5} ${y - 30}Q${sx} ${y - 30} ${sx} ${y - 22}V${y - 18}" fill="none" stroke="#3e444b" stroke-width="3.8" stroke-linecap="round"/>` +
      `<path d="M${x} ${y - 3}V${y - 22}Q${x} ${y - 30} ${x + d * 7.5} ${y - 30}Q${sx} ${y - 30} ${sx} ${y - 22}V${y - 18}" fill="none" stroke="url(#${u}-st)" stroke-width="2.8" stroke-linecap="round"/>` +
      `<path d="M${x - .6} ${y - 6}V${y - 21}" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/><rect x="${x + d * 3}" y="${y - 12}" width="${d * 5}" height="2" rx="1" fill="url(#${u}-stv)" transform="${d < 0 ? `translate(${2 * x + d * 8} 0) scale(-1 1)` : ""}"/>`;
  }
  function room(o, s) { return G(room0(o, s)); }
  function room0(o, s) {
    const u = o.uid, h = H(), T = TOPS[s.top || "quartz"], c = s.cab || "#eceeec", bx = s.bx || [48, 152], ct = CY - 12;
    let r = `<defs><linearGradient id="${u}-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h.shade(c, .12)}"/><stop offset=".6" stop-color="${c}"/><stop offset="1" stop-color="${h.shade(c, -.16)}"/></linearGradient>
<linearGradient id="${u}-cabx" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".1"/><stop offset=".25" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
<linearGradient id="${u}-cte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.e1}"/><stop offset=".45" stop-color="${T.b}"/><stop offset="1" stop-color="${T.e2}"/></linearGradient>
<linearGradient id="${u}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h.shade(s.wall, -.42)}"/><stop offset=".7" stop-color="${h.shade(s.wall, -.08)}"/><stop offset="1" stop-color="${s.wall}"/></linearGradient></defs>`;
    const wy = s.open ? KY : ct;
    r += `<rect x="0" y="0" width="200" height="${wy}" fill="url(#${u}-wall)"/>` + (s.splash ? `<rect x="0" y="0" width="200" height="${wy}" fill="url(#${u}-${s.splash})"/>` : "");
    if (s.upper) r += `<rect x="0" y="0" width="200" height="11" fill="url(#${u}-cab)"/><rect x="0" y="0" width="200" height="11" fill="url(#${u}-cabx)"/><path d="M0 11H200" stroke="#000" stroke-opacity=".45"/>` +
      `<path d="M0 11H200V30H0Z" fill="#ffe0b0" opacity=".14"/><path d="M0 11.8H200" stroke="#fff4d8" stroke-opacity=".7" stroke-width=".9"/>`;
    const cx2 = s.open ? bx[0] + 3 : 200;
    if (s.open) r += `<rect x="0" y="${KY - 6}" width="200" height="6" fill="${h.shade(s.wall, .25)}"/><path d="M0 ${KY - 6}H200" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/>`;
    r += `<rect x="0" y="${CY}" width="${s.open ? bx[0] : 200}" height="${KY - CY}" fill="#111317"/>`;
    r += `<path d="M0 ${ct}H200" stroke="#000" stroke-opacity=".001"/>` +
      `<rect x="0" y="${ct}" width="${cx2}" height="5" fill="${T.e1}"/><rect x="0" y="${ct}" width="${cx2}" height="5" fill="url(#${u}-${T.pat})"/>` +
      `<rect x="0" y="${ct + 5}" width="${cx2}" height="7" fill="url(#${u}-cte)"/><rect x="0" y="${ct + 5}" width="${cx2}" height="7" fill="url(#${u}-${T.pat})" opacity=".7"/>` +
      `<path d="M0 ${ct + .3}H${cx2}" stroke="#000" stroke-opacity=".25" stroke-width=".8"/><path d="M0 ${ct + 5.2}H${cx2}" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/><path d="M0 ${CY - .2}H${cx2}" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>` +
      (s.open ? `<rect x="${cx2 - 1.4}" y="${ct}" width="1.4" height="12" fill="#000" fill-opacity=".3"/>` : "");
    r += column(o, s, 0, bx[0], s.left || "dd", "l");
    if (!s.open) r += column(o, s, bx[1], 200, s.right || "d3", "r");
    r += `<rect x="0" y="${KY}" width="${s.open ? bx[0] : 200}" height="${FY - KY}" fill="#0e1013"/><path d="M0 ${KY + .5}H${s.open ? bx[0] : 200}" stroke="#000" stroke-opacity=".6"/>`;
    return r + floor(o, s.floor || "wood") + `<rect x="0" y="${FY}" width="200" height="4" fill="#000" fill-opacity=".25"/>`;
  }
  const overhang = (o, x1, x2) => G(overhang0(o, x1, x2));
  const overhang0 = (o, x1, x2) => `<rect x="${x1 == null ? 0 : x1}" y="${CY}" width="${x2 == null ? 200 : x2 - x1}" height="8" fill="url(#${o.uid}-ovh)"/>`;

  function door(o, x, y, w, h, r, k) {
    const u = o.uid, d = rr(x, y, w, h, r == null ? 2 : r), m = metal(o), dk = m === "bs" || lum(o.color) < .3;
    let s = `<path d="${d}" fill="url(#${u}-fin)"/>` + (m ? `<path d="${d}" fill="url(#${u}-br)"/>` : `<path d="${d}" fill="url(#${u}-gls)"/>`) + `<path d="${d}" fill="url(#${u}-fv)"/>`;
    if (o.on && k != null) s += `<clipPath id="${u}-dc${k}"><path d="${d}"/></clipPath><g clip-path="url(#${u}-dc${k})"><path class="${P}sheen" d="M${x - 34} ${y + h}L${x - 14} ${y}H${x - 2}L${x - 22} ${y + h}Z" fill="url(#${u}-shn)"/></g>`;
    return s + `<path d="${d}" fill="none" stroke="${edgeC(o)}" stroke-width=".8"/><path d="M${x + 2} ${y + .8}H${x + w - 2}" stroke="#fff" stroke-opacity="${dk ? .22 : .6}" stroke-width=".9"/>`;
  }
  const kick = (o, x1, x2) => `<rect x="${x1}" y="${KY}" width="${x2 - x1}" height="${FY - KY}" fill="#17191d"/><rect x="${x1 + 8}" y="${KY + 1.5}" width="${x2 - x1 - 16}" height="5" fill="url(#${o.uid}-vent)"/><path d="M${x1} ${KY + .5}H${x2}" stroke="#fff" stroke-opacity=".08"/>`;
  function bar(o, x1, x2, y, kind) {
    const u = o.uid, f = kind === "black" ? `url(#${u}-blk)` : kind === "brass" ? `url(#${u}-brass)` : `url(#${u}-stv)`;
    return `<rect x="${x1 + 3}" y="${y - 1}" width="3" height="5" rx="1" fill="${f}"/><rect x="${x2 - 6}" y="${y - 1}" width="3" height="5" rx="1" fill="${f}"/>` +
      `<rect x="${x1}" y="${y + 3.6}" width="${x2 - x1}" height="4" rx="2" fill="#000" fill-opacity=".3"/><rect x="${x1}" y="${y + 1.6}" width="${x2 - x1}" height="4.4" rx="2.2" fill="${f}"/><path d="M${x1 + 2} ${y + 2.6}H${x2 - 2}" stroke="#fff" stroke-opacity=".75" stroke-width=".7" stroke-linecap="round"/>`;
  }
  const pocket = (x, y, w, h) => `<path d="${rr(x, y, w, h, h / 2)}" fill="#000" fill-opacity=".42"/><path d="${rr(x + 1, y + .8, w - 2, h * .55, h / 3)}" fill="#000" fill-opacity=".4"/><path d="M${x + h / 2} ${y + h - .4}H${x + w - h / 2}" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/>`;
  const glassStrip = (o, x, y, w, h, r) => `<path d="${rr(x, y, w, h, r == null ? 2 : r)}" fill="#0e1116"/><path d="${rr(x, y, w, h, r == null ? 2 : r)}" fill="url(#${o.uid}-gl)"/><path d="M${x + 2} ${y + .6}H${x + w - 2}" stroke="#fff" stroke-opacity=".2" stroke-width=".6"/>`;
  function key(x, y, w, h) { return `<path d="${rr(x, y, w, h, Math.min(1.6, h / 2))}" fill="#2a2f37"/><path d="M${x + 1} ${y + .6}H${x + w - 1}" stroke="#fff" stroke-opacity=".22" stroke-width=".5"/>`; }
  function led(o, x, y, r, c, id) {
    r = r || 1.4; c = c || DISP; id = id || "hb";
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#3e434b"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".2"/>`;
    return `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${n1(r + 4.5)}" fill="url(#${o.uid}-${id})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .4)}" fill="#fff" fill-opacity=".85"/>`;
  }

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", E: "adefg", n: "ceg", d: "bcdeg", b: "cdefg" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.6, h * .14), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9],
      d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return (SEG[ch] || "").split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  const segW = (h, str) => { const w = h * .56, g = h * .24, t = Math.max(.6, h * .14); let W = 0; str.split("").forEach((c) => { W += (c === ":" ? t : w) + g; }); return W - g; };
  function segs(cx, y, h, str, fill, op, blink) {
    const w = h * .56, g = h * .24, t = Math.max(.6, h * .14); let x = cx - segW(h, str) / 2, s = "";
    str.split("").forEach((c) => {
      if (c === ":") { s += `<g${blink ? ` class="${P}blink"` : ""}><rect x="${n1(x)}" y="${n1(y + h * .26)}" width="${n1(t)}" height="${n1(t)}"/><rect x="${n1(x)}" y="${n1(y + h * .66)}" width="${n1(t)}" height="${n1(t)}"/></g>`; x += t + g; }
      else { s += dig(x, y, h, c); x += w + g; }
    });
    return `<g fill="${fill}"${op ? ` fill-opacity="${op}"` : ""}>${s}</g>`;
  }
  function clock(o, cx, y, h, col) {
    col = col || DISP; let s = segs(cx, y, h, "8:88", "#fff", .06);
    if (!o.on) return s;
    return s + `<g opacity=".16"><ellipse class="${P}pulse" cx="${cx}" cy="${n1(y + h / 2)}" rx="${n1(h * 2)}" ry="${n1(h * .95)}" fill="${col}"/></g>` + segs(cx, y, h, done(o) ? "End" : remain(o), col, 0, true);
  }
  function pbar(o, x, y, w, col, h) {
    h = h || 1.6; col = col || DISP; let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" fill-opacity=".1"/>`;
    if (!o.on) return s; const fw = Math.max(h, w * o.level);
    return s + `<rect x="${x}" y="${y}" width="${n1(fw)}" height="${h}" rx="${h / 2}" fill="${col}"/><g opacity=".35"><circle class="${P}pulse" cx="${n1(x + fw)}" cy="${y + h / 2}" r="${h * 2.2}" fill="${col}"/></g>`;
  }
  function spot(o, cx, rx, col, k) {
    if (!o.on) return ""; const id = `${o.uid}-sp${k || 0}`;
    return `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity=".95"/><stop offset=".3" stop-color="${col}" stop-opacity=".5"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>` +
      `<path d="M${cx - 6} ${KY - .8}H${cx + 6}" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/><path d="M${cx - 4} ${KY}L${cx - rx * .8} ${FY + 5}H${cx + rx * .8}L${cx + 4} ${KY}Z" fill="${col}" opacity=".12"/>` +
      `<ellipse class="${P}pulse" cx="${cx}" cy="${FY + 6}" rx="${rx}" ry="5.5" fill="url(#${id})"/><ellipse cx="${cx}" cy="${FY + 6}" rx="${n1(rx * .3)}" ry="1.6" fill="${col}" opacity=".85"/>`;
  }
  function steam(o, x, y, n, sp, sz) {
    let s = "";
    for (let i = 0; i < n; i++) { const xi = x + (i - (n - 1) / 2) * sp + (i % 2 ? 2 : -1), del = (i * .83) % 3;
      s += `<g transform="translate(${n1(xi)} ${y})"><circle class="${P}puff" r="${sz || 6}" fill="url(#${o.uid}-pf)" style="animation-delay:-${del.toFixed(2)}s"/></g>`; }
    return s;
  }
  const vent = (o, x, w) => dry(o) ? steam(o, x, CY - 1, 4, w / 4, 6) : "";

  const plate = (o, cx, cy, r, rim) => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="url(#${o.uid}-plate)" stroke="#5f6c7a" stroke-opacity=".55" stroke-width=".6"/><circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * .62)}" fill="none" stroke="#7d8ea3" stroke-opacity=".25" stroke-width=".6"/><circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r - .5)}" fill="none" stroke="${rim}" stroke-width=".9"/>`;
  function cup(x, y, s, c) {
    return `<path d="M${n1(x - 4 * s)} ${n1(y - 9 * s)}H${n1(x + 4 * s)}L${n1(x + 5 * s)} ${y}H${n1(x - 5 * s)}Z" fill="${c}"/>` +
      `<path d="M${n1(x - 3 * s)} ${n1(y - 8 * s)}L${n1(x - 3.8 * s)} ${n1(y - 1)}" stroke="#fff" stroke-opacity=".55" stroke-width="${n1(1.2 * s)}" stroke-linecap="round"/><path d="M${n1(x + 5 * s)} ${n1(y - 6.5 * s)}q${n1(3 * s)} 0 ${n1(2.6 * s)} ${n1(3 * s)}" fill="none" stroke="${c}" stroke-width="${n1(1.3 * s)}"/>`;
  }
  const glass = (x, y, s) => `<path d="M${n1(x - 3.4 * s)} ${n1(y - 11 * s)}H${n1(x + 3.4 * s)}L${n1(x + 3 * s)} ${y}H${n1(x - 3 * s)}Z" fill="#cfefff" fill-opacity=".22" stroke="#e8f8ff" stroke-opacity=".7" stroke-width=".6"/><path d="M${n1(x - 2 * s)} ${n1(y - 10 * s)}V${n1(y - 1)}" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/>`;
  const bowl = (x, y, s, c) => `<path d="M${n1(x - 7 * s)} ${n1(y - 7 * s)}A${n1(7 * s)} ${n1(5 * s)} 0 0 0 ${n1(x + 7 * s)} ${n1(y - 7 * s)}Z" fill="${c}" transform="rotate(-18 ${x} ${n1(y - 7 * s)})"/><path d="M${n1(x - 7 * s)} ${n1(y - 7 * s)}H${n1(x + 7 * s)}" stroke="#fff" stroke-opacity=".5" stroke-width=".7" transform="rotate(-18 ${x} ${n1(y - 7 * s)})"/>`;
  function rack(x, y, w, h, n, front) {
    const step = w / n; let s = "";
    if (!front) { for (let i = 0; i <= n; i++) s += `<path d="M${n1(x + i * step)} ${y}V${n1(y - h)}" stroke="#aeb7c1" stroke-opacity=".55" stroke-width=".55"/>`; return s + `<path d="M${x} ${n1(y - h)}H${x + w}" stroke="#aeb7c1" stroke-opacity=".5" stroke-width=".6"/>`; }
    s += `<path d="M${x} ${y}H${x + w}" stroke="#c4ccd5" stroke-width="1.1"/><path d="M${x} ${n1(y - h * .45)}H${x + w}" stroke="#c4ccd5" stroke-opacity=".85" stroke-width=".7"/>`;
    for (let i = 0; i <= n; i += 2) s += `<path d="M${n1(x + i * step)} ${y}V${n1(y - h * .45)}" stroke="#c4ccd5" stroke-opacity=".8" stroke-width=".6"/>`;
    return s + `<circle cx="${x + 4}" cy="${y + 1.8}" r="1.6" fill="#3a4048"/><circle cx="${x + w - 4}" cy="${y + 1.8}" r="1.6" fill="#3a4048"/>`;
  }
  function jets(o, ax, ay, L, n, spread) {
    let s = `<g class="${P}fan">`;
    for (let i = 0; i < n; i++) { const a = (-spread + 2 * spread * i / (n - 1)) * Math.PI / 180;
      s += `<path class="${P}jet" d="M${n1(ax + Math.sin(a) * 3)} ${n1(ay - 2)}L${n1(ax + Math.sin(a) * L)} ${n1(ay - Math.cos(a) * L)}" style="animation-delay:-${(i * .13).toFixed(2)}s"/>`; }
    return s + `</g>`;
  }
  function arm(o, cx, y, w) {
    return `<rect x="${cx - 1.5}" y="${y}" width="3" height="5" fill="#59616a"/><g class="${o.on ? P + "arm" : ""}"><rect x="${n1(cx - w / 2)}" y="${y - 1.4}" width="${w}" height="2.8" rx="1.4" fill="url(#${o.uid}-stv)"/><rect x="${n1(cx + w * .3)}" y="${y - 1.4}" width="${n1(w * .16)}" height="2.8" rx="1.4" fill="#59616a"/></g><circle cx="${cx}" cy="${y}" r="2.2" fill="url(#${o.uid}-st)"/>`;
  }
  function tub(o, k, x, y, w, h, opt) {
    opt = opt || {}; const u = o.uid, id = `${u}-tb${k}`, d = opt.d || rr(x, y, w, h, opt.r == null ? 3 : opt.r);
    const ix = x + w * .09, iw = w * .82, iy = y + h * .05, ih = h * .9, cx = x + w / 2;
    let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="#0b0e12"/><g clip-path="url(#${id})">` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-tub)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-tubx)"/>` +
      `<path d="M${x} ${y}L${n1(ix)} ${n1(iy)}V${n1(iy + ih)}L${x} ${y + h}Z" fill="#000" fill-opacity=".3"/><path d="M${x + w} ${y}L${n1(ix + iw)} ${n1(iy)}V${n1(iy + ih)}L${x + w} ${y + h}Z" fill="#000" fill-opacity=".42"/>` +
      `<path d="M${x} ${y + h}L${n1(ix)} ${n1(iy + ih)}H${n1(ix + iw)}L${x + w} ${y + h}Z" fill="#000" fill-opacity=".3"/>`;
    if (o.on) s += `<rect class="${P}pulse" x="${x}" y="${y}" width="${w}" height="${n1(h * .6)}" fill="url(#${u}-tl)"/>`;
    const yl = y + h * .86, yu = y + h * (opt.third ? .55 : .45), rx = x + w * .07, rw = w * .86, pr = Math.min(h * .16, w * .1);
    s += rack(rx, yl, rw, pr * 1.2, 12);
    const np = Math.max(3, Math.floor(rw / (pr * 1.5)));
    for (let i = 0; i < np; i++) { const px = rx + pr * 1.05 + i * (rw - pr * 2.1) / (np - 1); s += plate(o, px, yl - pr * .95 - (i % 2) * 1.6, pr * (i % 2 ? .92 : 1), i % 3 === 1 ? "#5d8fc4" : "#c9d2dc"); }
    s += rack(rx, yl, rw, pr * 1.2, 12, true);
    const us = Math.min(1.1, h / 90);
    s += rack(rx, yu, rw, 8 * us, 12);
    const cols = ["#e9edf1", "#2f6f9f", "#d76b4f", "#f1d38a"]; let ux = rx + 7 * us, i = 0;
    while (ux < rx + rw - 6 * us) {
      const m = i % 4;
      s += m === 1 ? glass(ux, yu, us) : m === 3 ? bowl(ux + 2 * us, yu, us, cols[(i >> 2) % 4]) : cup(ux, yu, us, cols[(i + 1) % 4]);
      ux += (m === 3 ? 16 : 11) * us; i++;
    }
    s += rack(rx, yu, rw, 8 * us, 12, true);
    if (opt.third) {
      const yt = y + h * .2; s += `<path d="M${n1(rx)} ${n1(yt)}H${n1(rx + rw)}" stroke="#c4ccd5" stroke-width=".9"/><path d="M${n1(rx)} ${n1(yt - 4)}H${n1(rx + rw)}" stroke="#c4ccd5" stroke-opacity=".6" stroke-width=".6"/>`;
      for (let j = 0; j < 9; j++) { const xx = rx + 6 + j * (rw - 12) / 8; s += `<path d="M${n1(xx)} ${n1(yt - 1)}L${n1(xx + 5)} ${n1(yt - 4.5)}" stroke="${j % 3 ? "#e4e9ee" : "#9aa5b1"}" stroke-width="1.2" stroke-linecap="round"/>`; }
    }
    s += arm(o, cx, y + h * .97, rw * .62) + arm(o, cx, yu + 2.5, rw * .5);
    if (o.on && !done(o)) {
      const L = h * .42;
      [-.22, .22].forEach((f) => { s += jets(o, cx + rw * f, y + h * .96, L, 5, 34); });
      [-.18, .18].forEach((f) => { s += jets(o, cx + rw * f, yu + 2, h * .3, 4, 30); });
      for (let j = 0; j < 7; j++) s += `<circle class="${P}drip" cx="${n1(x + w * (.12 + j * .125))}" cy="${n1(y + 4 + (j * 7) % 12)}" r=".9" fill="#d6f1ff" style="animation-delay:-${(j * .31).toFixed(2)}s"/>`;
      s += `<rect class="${P}fog" x="${x}" y="${y}" width="${w}" height="${h}" fill="#dff3ff"/>`;
    }
    if (dry(o)) s += `<rect class="${P}fog" x="${x}" y="${y}" width="${w}" height="${h}" fill="#f2f8ff"/>`;
    s += `</g>`;
    if (o.on) for (let j = 0; j < 14; j++) s += `<circle cx="${n1(x + 3 + (j * 37) % (w - 6))}" cy="${n1(y + 3 + (j * 23) % (h - 6))}" r="${j % 3 ? .55 : .85}" fill="#fff" fill-opacity=".3"/>`;
    return s + `<path d="${d}" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/><path d="M${x + w * .1} ${y + h * .55}L${x + w * .3} ${y + 4}" stroke="#fff" stroke-opacity=".12" stroke-width="${n1(w * .07)}" stroke-linecap="round"/>`;
  }

  const css = `
.hda-dishwasher-sheen{opacity:.9}
.hda-anim .hda-dishwasher-sheen{animation:hda-dishwasher-sheen 7s ease-in-out infinite}
@keyframes hda-dishwasher-sheen{0%{transform:translateX(0)}55%,100%{transform:translateX(170px)}}
.hda-anim .hda-dishwasher-pulse{animation:hda-dishwasher-pulse 3s ease-in-out infinite}
@keyframes hda-dishwasher-pulse{50%{opacity:.5}}
.hda-anim .hda-dishwasher-blink{animation:hda-dishwasher-blink 1s steps(1,end) infinite}
@keyframes hda-dishwasher-blink{0%,49%{opacity:1}50%,100%{opacity:.15}}
.hda-dishwasher-arm{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-dishwasher-arm{animation:hda-dishwasher-arm 1.1s linear infinite}
@keyframes hda-dishwasher-arm{0%,100%{transform:scaleX(1)}25%{transform:scaleX(.12)}50%{transform:scaleX(-1)}75%{transform:scaleX(-.12)}}
.hda-dishwasher-fan{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-dishwasher-fan{animation:hda-dishwasher-fan 1.1s ease-in-out infinite}
@keyframes hda-dishwasher-fan{0%,100%{transform:skewX(-14deg)}50%{transform:skewX(14deg)}}
.hda-dishwasher-jet{fill:none;stroke:#c4ecff;stroke-opacity:.8;stroke-width:1.1;stroke-linecap:round;stroke-dasharray:2.4 3.6}
.hda-anim .hda-dishwasher-jet{animation:hda-dishwasher-jet .45s linear infinite}
@keyframes hda-dishwasher-jet{to{stroke-dashoffset:-12}}
.hda-dishwasher-drip{opacity:.7}
.hda-anim .hda-dishwasher-drip{animation:hda-dishwasher-drip 1.4s cubic-bezier(.5,0,1,.5) infinite}
@keyframes hda-dishwasher-drip{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(34px);opacity:0}}
.hda-dishwasher-fog{opacity:.1}
.hda-anim .hda-dishwasher-fog{animation:hda-dishwasher-fog 4s ease-in-out infinite}
@keyframes hda-dishwasher-fog{50%{opacity:.2}}
.hda-dishwasher-puff{opacity:.5;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-dishwasher-puff{animation:hda-dishwasher-puff 3s ease-out infinite}
@keyframes hda-dishwasher-puff{0%{transform:translateY(3px) scale(.35);opacity:0}25%{opacity:.85}100%{transform:translateY(-32px) scale(1.8);opacity:0}}
.hda-dishwasher-needle{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-dishwasher-needle{animation:hda-dishwasher-needle .6s ease-in-out infinite}
@keyframes hda-dishwasher-needle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(3deg)}}
.hda-anim .hda-dishwasher-chase{animation:hda-dishwasher-chase 2.4s linear infinite}
@keyframes hda-dishwasher-chase{0%,100%{opacity:.25}20%{opacity:1}45%{opacity:.25}}
.hda-dishwasher-sparkle{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-dishwasher-sparkle{animation:hda-dishwasher-sparkle 2.2s ease-in-out infinite}
@keyframes hda-dishwasher-sparkle{0%,100%{transform:scale(.2);opacity:0}50%{transform:scale(1);opacity:1}}
.hda-dishwasher-hum{opacity:.35}
.hda-anim .hda-dishwasher-hum{animation:hda-dishwasher-hum 1.6s ease-in-out infinite}
@keyframes hda-dishwasher-hum{0%,100%{opacity:.1;transform:translateY(0)}50%{opacity:.5;transform:translateY(-1px)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-dishwasher-sheen,.hda-anim .hda-dishwasher-pulse,.hda-anim .hda-dishwasher-blink,.hda-anim .hda-dishwasher-arm,.hda-anim .hda-dishwasher-fan,.hda-anim .hda-dishwasher-jet,.hda-anim .hda-dishwasher-drip,.hda-anim .hda-dishwasher-fog,.hda-anim .hda-dishwasher-puff,.hda-anim .hda-dishwasher-needle,.hda-anim .hda-dishwasher-chase,.hda-anim .hda-dishwasher-sparkle,.hda-anim .hda-dishwasher-hum{animation:none!important}}
`;

  function hum(o, x, y, side) {
    if (!o.on) return ""; const d = side < 0 ? -1 : 1;
    return [0, 1, 2].map((i) => `<path class="${P}hum" d="M${x + d * i * 2.6} ${y - 6 + i}q${d * 1.6} 6 0 12" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" style="animation-delay:-${(i * .4).toFixed(1)}s"/>`).join("");
  }

  const ic = (id, name, first, render, swatches, label) => ({ id, name, colors: swatches || sw(first), picker: true, colorLabel: label || "Finish", render });

  const icons = [
    ic("front", "Front controls", SS, (o) => { const u = o.uid; return svg(o,
      room(o, { wall: "#e3e7ea", splash: "sub", top: "marble", cab: "#eef0ec", pull: "steel", floor: "oak" }) + faucet(o, 22, 40) +
      door(o, 49, 53, 102, 122, 2, 1) +
      glassStrip(o, 54, 58, 92, 16) + clock(o, 70, 61.5, 7.5) + pbar(o, 58, 71, 24, DISP, 1.3) +
      [90, 99, 108, 117].map((x) => key(x, 63, 7, 4.4)).join("") + led(o, 129, 65, 1.3) +
      `<circle cx="139" cy="66" r="3.4" fill="#2a2f37"/><circle cx="139" cy="66" r="2" fill="none" stroke="${o.on ? DISP : "#6b727c"}" stroke-width=".8"/><path d="M139 63.6V65.8" stroke="${o.on ? DISP : "#6b727c"}" stroke-width=".8"/>` +
      pocket(80, 79, 40, 8) + hl(51, 82, 51, 168, 1.6, .25) +
      kick(o, 49, 151) + overhang(o) + vent(o, 100, 80)); }),

    ic("hidden", "Top controls", SS, (o) => { return svg(o,
      room(o, { wall: "#ece6db", splash: "sq", top: "quartz", cab: "#2c3d5e", pull: "brass", floor: "wood" }) + faucet(o, 176, 40, -1) +
      door(o, 49, 53, 102, 122, 2, 2) +
      `<rect x="49" y="53" width="102" height="4" fill="#000" fill-opacity=".35"/>` + [62, 70, 78, 86].map((x) => `<rect x="${x}" y="54.2" width="5" height="1.2" rx=".6" fill="#000" fill-opacity=".45"/>`).join("") +
      bar(o, 58, 142, 62) + hl(51, 74, 51, 168, 1.6, .25) +
      kick(o, 49, 151) + spot(o, 100, 30, REDL) + overhang(o) + vent(o, 100, 80)); }),

    ic("projection", "Floor time", BS, (o) => { const u = o.uid; return svg(o,
      room(o, { wall: "#d9d3c7", splash: "vt", top: "granite", cab: "#6b4529", style: "slab", grain: "h", pull: "black", floor: "tile", upper: true }) +
      door(o, 49, 53, 102, 122, 2, 3) + `<path d="M50 61H150" stroke="#000" stroke-opacity=".55" stroke-width="1.6"/><path d="M50 62.5H150" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>` +
      hl(51, 70, 51, 168, 1.4, .18) + kick(o, 49, 151) +
      (o.on ? `<path d="M96 ${KY}L60 ${FY + 9}H140L104 ${KY}Z" fill="#cfeaff" opacity=".08"/><g opacity=".55"><ellipse class="${P}pulse" cx="100" cy="${FY + 6.5}" rx="34" ry="6" fill="url(#${u}-hw)"/></g>` +
        `<g transform="translate(0 ${FY + 3}) scale(1 .42)">${segs(100, 0, 13, done(o) ? "End" : remain(o), "#f2fbff", 0, true)}</g>` +
        `<path d="M64 ${FY + 10.5}H${n1(64 + 72 * o.level)}" stroke="${ICE}" stroke-width="1" stroke-linecap="round" opacity=".9"/>` : "") +
      overhang(o) + vent(o, 100, 80)); }),

    ic("panel", "Panel-ready", "#efeee8", (o) => { const s = { wall: "#e7e9ea", splash: "sub", top: "marble", cab: o.color, pull: "cup", floor: "oak", grain: lum(o.color) < .55 ? "h" : "" };
      return svg(o, room(o, s) + faucet(o, 22, 40) +
      face(o, s, 49.2, 53.2, 101.6, 24) + pull(o, "cup", 100, 60, 22) +
      face(o, s, 49.2, 79, 101.6, 95.8) + pull(o, "steel", 56, 84, 18, true) +
      `<rect x="49" y="${KY}" width="102" height="${FY - KY}" fill="#0e1013"/>` +
      spot(o, 100, 24, ICE) + overhang(o) + vent(o, 100, 60)); }, ["#efeee8", "#2c3e5e", "#8fa58b", "#b98a5a", "#5d3b25", "#2a2b2e", "#cfd3d6"], "Panel"),

    ic("drawer1", "Single drawer", SS, (o) => { const s = { wall: "#dde4e5", splash: "sq", top: "concrete", cab: "#c9c6bb", pull: "steel", floor: "wood" }; return svg(o,
      room(o, s) + `<rect x="48" y="${CY}" width="104" height="${KY - CY}" fill="#111317"/>` +
      door(o, 49, 53, 102, 58, 2, 5) + bar(o, 56, 144, 57) +
      glassStrip(o, 110, 68, 34, 11) + clock(o, 122, 70.5, 6) + led(o, 138, 73.5, 1.1) + pbar(o, 114, 76.6, 20, DISP, 1) +
      `<path d="M50 109.5H150" stroke="#000" stroke-opacity=".3"/>` +
      face(o, s, 49.2, 113, 101.6, 61.8) + pull(o, "steel", 100, 120, 22) +
      `<rect x="49" y="${KY}" width="102" height="${FY - KY}" fill="#0e1013"/>` + overhang(o) + vent(o, 100, 70)); }),

    ic("drawer2", "Double drawer", SS, (o) => { const o2 = Object.assign({}, o, { level: Math.min(1, o.level + .35) }); return svg(o,
      room(o, { wall: "#e9e2d6", splash: "vt", top: "quartz", cab: "#3a3d42", style: "slab", pull: "brass", floor: "oak" }) + `<rect x="48" y="${CY}" width="104" height="${KY - CY}" fill="#0c0d10"/>` +
      door(o, 49, 53, 102, 59.5, 2, 6) + bar(o, 56, 144, 57) + glassStrip(o, 114, 68, 30, 10) + clock(o, 125, 70.2, 5.6) + led(o, 139.5, 73, 1.1) +
      door(o2, 49, 115, 102, 60, 2, 7) + bar(o, 56, 144, 119) + glassStrip(o, 114, 130, 30, 10) + clock(o2, 125, 132.2, 5.6, GREEN) + led(o2, 139.5, 135, 1.1, GREEN, "hg") +
      kick(o, 49, 151) + overhang(o) + vent(o, 100, 70)); }),

    ic("slim", "18-inch slim", WH, (o) => { const ph = o.on ? Math.min(2, Math.floor(o.level * 3)) : -1; return svg(o,
      room(o, { wall: "#efeee9", splash: "sub", top: "butcher", cab: "#8ea38a", pull: "knob", floor: "wood", bx: [64, 136], left: "dd", right: "d3" }) +
      door(o, 65, 53, 70, 122, 2, 8) + glassStrip(o, 69, 58, 62, 13) + clock(o, 84, 60.6, 6.4, DISP) +
      [0, 1, 2].map((i) => `<circle cx="${103 + i * 9}" cy="64.5" r="1.4" fill="${i === ph ? GREEN : i < ph ? "#2d7a57" : "#3e434b"}"${i === ph ? ` class="${P}blink"` : ""}/><rect x="${100.5 + i * 9}" y="67.6" width="5" height="1" rx=".5" fill="#fff" fill-opacity=".2"/>`).join("") +
      pocket(86, 75, 28, 6) + hl(67, 80, 67, 168, 1.4, .3) +
      kick(o, 65, 135) + overhang(o) + vent(o, 100, 56)); }),

    ic("countertop", "Countertop", WH, (o) => { const u = o.uid, ct = 148, p = pal(o.color); const hose = `M163 130C163 140 158 142 152 136`;
      return svg(o,
      G(`<defs><linearGradient id="${u}-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7e93a6"/><stop offset="1" stop-color="#55687a"/></linearGradient><linearGradient id="${u}-cabx" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient><linearGradient id="${u}-wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e9ea3"/><stop offset="1" stop-color="#d7e1e4"/></linearGradient><linearGradient id="${u}-cte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfaf7"/><stop offset="1" stop-color="#cdc8be"/></linearGradient></defs>` +
      `<rect width="200" height="${ct}" fill="url(#${u}-wl)"/><rect width="200" height="${ct}" fill="url(#${u}-sq)"/>` +
      `<rect x="0" y="0" width="200" height="14" fill="url(#${u}-cab)"/><path d="M0 14H200" stroke="#000" stroke-opacity=".4"/><path d="M0 14H200V40H0Z" fill="#ffe0b0" opacity=".14"/>` +
      `<rect x="0" y="${ct}" width="200" height="5" fill="#fbfaf7"/><rect x="0" y="${ct}" width="200" height="5" fill="url(#${u}-spl)"/><rect x="0" y="${ct + 5}" width="200" height="7" fill="url(#${u}-cte)"/><path d="M0 ${ct + 5.2}H200" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>` +
      `<rect x="0" y="${ct + 12}" width="200" height="${200 - ct - 12}" fill="#111317"/>` +
      face(o, { style: "shaker" }, 1.2, ct + 13.2, 98, 40) + face(o, { style: "shaker" }, 101.2, ct + 13.2, 97.6, 40) + pull(o, "steel", 92, ct + 19, 18, true) + pull(o, "steel", 108, ct + 19, 18, true) +
      `<rect x="0" y="${ct + 12}" width="200" height="6" fill="url(#${u}-ovh)"/>` +
      faucet(o, 178, ct, -1)) +
      sh(o, 98, ct + 1.5, 52, 3.5) + `<rect x="48" y="${ct - 2}" width="6" height="3" rx="1" fill="#1d2025"/><rect x="142" y="${ct - 2}" width="6" height="3" rx="1" fill="#1d2025"/>` +
      `<path d="${rr(44, 68, 108, 80, 6)}" fill="url(#${u}-fin)"/><path d="${rr(44, 68, 108, 80, 6)}" fill="url(#${u}-${metal(o) ? "br" : "gls"})"/><path d="${rr(44, 68, 108, 80, 6)}" fill="url(#${u}-fv)"/><path d="${rr(44, 68, 108, 80, 6)}" fill="none" stroke="${edgeC(o)}" stroke-width=".8"/>` +
      `<path d="M50 68.8H146" stroke="#fff" stroke-opacity=".55"/>` +
      tub(o, 8, 50, 76, 70, 64, { r: 4 }) + `<path d="${rr(50, 76, 70, 64, 4)}" fill="none" stroke="${p.e}" stroke-opacity=".5" stroke-width="1.6"/>` + `<rect x="58" y="71.5" width="54" height="3" rx="1.5" fill="#000" fill-opacity=".35"/>` +
      glassStrip(o, 126, 76, 20, 64, 3) + clock(o, 136, 80, 5.5) + [94, 103, 112, 121].map((y) => `<circle cx="136" cy="${y}" r="2.6" fill="#2a2f37"/><circle cx="136" cy="${y}" r="1.4" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".5"/>`).join("") +
      led(o, 136, 131, 1.3, GREEN, "hg") + pbar(o, 130, 136, 12, GREEN, 1) +
      `<path d="${hose}" fill="none" stroke="#1d2025" stroke-width="3.2"/><path d="${hose}" fill="none" stroke="#e6e9ec" stroke-width="2"/>` +
      (dry(o) ? steam(o, 98, 66, 3, 22, 6) : "")); }),

    ic("portable", "Rolling cart", WH, (o) => { const u = o.uid; return svg(o,
      room(o, { wall: "#e6e1d6", splash: "sq", top: "butcher", cab: "#e8e6df", pull: "cup", floor: "wood", bx: [34, 205], open: true, left: "dd" }) +
      faucet(o, 16, 40, 1) +
      `<path d="M31 22C40 22 44 28 44 40C44 58 50 66 62 72" fill="none" stroke="#2a2d32" stroke-width="3"/><path d="M31 22C40 22 44 28 44 40C44 58 50 66 62 72" fill="none" stroke="#8f979f" stroke-width="1.8"/><path d="M31 22C40 22 44 28 44 40" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>` +
      sh(o, 106, 188, 56, 5) +
      `<rect x="60" y="62" width="92" height="112" fill="${pal(o.color).d}"/>` + door(o, 60, 66, 92, 106, 2, 9) +
      `<rect x="56" y="54" width="100" height="9" rx="1.5" fill="url(#${u}-wd)"/><rect x="56" y="54" width="100" height="9" fill="url(#${u}-bb)"/><path d="M57 54.6H155" stroke="#fff" stroke-opacity=".45"/><rect x="58" y="63" width="96" height="3" fill="#000" fill-opacity=".3"/>` +
      glassStrip(o, 64, 70, 84, 13) + clock(o, 80, 72.6, 6.6) + [100, 108, 116, 124].map((x) => key(x, 74.6, 6, 4)).join("") + led(o, 138, 76.6, 1.3) + pbar(o, 68, 80, 22, DISP, 1) +
      pocket(88, 88, 36, 7) + hl(62, 92, 62, 166, 1.4, .25) +
      `<rect x="60" y="172" width="92" height="6" fill="#1b1d21"/>` +
      [70, 142].map((x) => `<rect x="${x - 4}" y="177" width="8" height="4" rx="1" fill="#24282e"/><circle cx="${x}" cy="184" r="4.6" fill="#15171b"/><circle cx="${x}" cy="184" r="2" fill="url(#${u}-st)"/>`).join("") +
      hum(o, 157, 140, 1) + (dry(o) ? steam(o, 106, 52, 4, 20, 6) : "")); }),

    ic("glass", "Glass front", SS, (o) => { return svg(o,
      room(o, { wall: "#eae4d6", splash: "sq", top: "marble", cab: "#2f4c40", pull: "knob", floor: "slate" }) +
      door(o, 49, 53, 102, 122, 3, 10) + glassStrip(o, 96, 56.5, 50, 7, 1.5) + clock(o, 110, 57.8, 4.6) + pbar(o, 119, 59.6, 22, DISP, 1) + led(o, 104, 60, .9) +
      bar(o, 56, 92, 56.5) +
      tub(o, 10, 55, 68, 90, 101, { r: 3 }) + `<path d="${rr(55, 68, 90, 101, 3)}" fill="none" stroke="#1a1d22" stroke-width="1.4"/>` +
      kick(o, 49, 151) + overhang(o) + vent(o, 100, 80)); }),

    ic("retro", "Retro rounded", CREAM, (o) => { const u = o.uid, a = (-130 + 260 * (o.on ? o.level : 0)) * Math.PI / 180; return svg(o,
      room(o, { wall: "#f0ead8", splash: "sq", top: "redlam", cab: "#f5f1e6", pull: "cup", floor: "check" }) +
      G(`<rect x="0" y="45" width="200" height="1.6" fill="url(#${u}-cr)"/><rect x="0" y="50" width="200" height="2" fill="url(#${u}-cr)"/>`) +
      door(o, 50, 54, 100, 120, 11, 11) +
      `<path d="M52 66H148V80H52Z" fill="url(#${u}-cr)"/><path d="M52 66H148M52 80H148" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>` +
      [0, 1, 2, 3, 4].map((i) => `<rect x="${60 + i * 9}" y="68.5" width="7" height="9" rx="1.4" fill="${i === (o.on ? 1 + Math.min(3, Math.floor(o.level * 4)) : -1) ? "#f6f1df" : "#e9e2cc"}"/><rect x="${60 + i * 9}" y="${i === (o.on ? 1 + Math.min(3, Math.floor(o.level * 4)) : -1) ? 75.5 : 76.6}" width="7" height="1.4" fill="#000" fill-opacity=".25"/>`).join("") +
      `<circle cx="128" cy="73" r="9" fill="#000" fill-opacity=".25"/><circle cx="128" cy="72.4" r="8.4" fill="${H().shade(o.color, .2)}"/><circle cx="128" cy="72.4" r="6" fill="url(#${u}-cr)"/>` +
      [-130, -65, 0, 65, 130].map((d) => { const r = d * Math.PI / 180; return `<circle cx="${n1(128 + Math.sin(r) * 7.3)}" cy="${n1(72.4 - Math.cos(r) * 7.3)}" r=".6" fill="#3a3a3a"/>`; }).join("") +
      `<path d="M128 72.4L${n1(128 + Math.sin(a) * 5)} ${n1(72.4 - Math.cos(a) * 5)}" stroke="#b02a22" stroke-width="1.4" stroke-linecap="round"/>` +
      (o.on ? `<circle class="${P}pulse" cx="111" cy="73" r="5" fill="url(#${u}-ha)"/><circle cx="111" cy="73" r="1.6" fill="${AMB}"/>` : `<circle cx="111" cy="73" r="1.6" fill="#6b5a40"/>`) +
      `<path d="M66 92H134" stroke="#000" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>` + `<path d="M66 90.5H134" stroke="url(#${u}-cr)" stroke-width="4" stroke-linecap="round"/><path d="M68 89.6H132" stroke="#fff" stroke-opacity=".8" stroke-width=".7"/>` +
      `<path d="M56 160H144" stroke="url(#${u}-cr)" stroke-width="1.2"/>` + hl(54, 84, 54, 156, 2, .35) +
      kick(o, 50, 150) + overhang(o) + vent(o, 100, 80)); }, sw(CREAM, [MINT, RED, PINK, NAVY]).filter((c) => c !== BS && c !== SL).concat([SS])),

    ic("smart", "Smart display", BS, (o) => { const u = o.uid, C = 2 * Math.PI * 5.4; return svg(o,
      room(o, { wall: "#e6e8ea", splash: "mar", top: "granite", cab: "#f2f2f0", style: "slab", pull: "black", floor: "tile" }) +
      door(o, 49, 53, 102, 122, 2, 12) + glassStrip(o, 52, 57, 96, 20, 3) +
      `<circle cx="64" cy="67" r="5.4" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.6"/>` +
      (o.on ? `<circle cx="64" cy="67" r="5.4" fill="none" stroke="${DISP}" stroke-width="1.6" stroke-dasharray="${n1(C * o.level)} ${n1(C)}" transform="rotate(-90 64 67)" stroke-linecap="round"/><circle class="${P}pulse" cx="64" cy="67" r="9" fill="url(#${u}-hb)"/>` : "") +
      `<path d="M62.6 64.6Q60.8 67 62.6 69.4Q66 67.6 64.4 64.4Z" fill="${o.on ? DISP : "#5d636b"}"/>` +
      clock(o, 92, 62, 10) +
      `<g fill="none" stroke="${o.on ? DISP : "#4d535b"}" stroke-width=".9" stroke-linecap="round"><path d="M118 66A6 6 0 0 1 126 66"/><path d="M119.8 68A3.4 3.4 0 0 1 124.2 68"/></g><circle cx="122" cy="70" r=".9" fill="${o.on ? DISP : "#4d535b"}"/>` +
      `<path d="M134 62L136 66L140 67L136 68L134 72L132 68L128 67L132 66Z" fill="${o.on && dry(o) ? AMB : "#4d535b"}"/>` +
      `<path d="M52 80H148" stroke="#000" stroke-opacity=".5" stroke-width="1.2"/>` + hl(51, 86, 51, 168, 1.4, .2) +
      kick(o, 49, 151) + spot(o, 100, 22, ICE) + overhang(o) + vent(o, 100, 80)); }),

    ic("third", "Third rack", SS, (o) => { return svg(o,
      room(o, { wall: "#f0f0ee", splash: "vt", top: "quartz", cab: "#caa274", style: "slab", grain: "h", pull: "black", floor: "tile" }) +
      door(o, 49, 53, 102, 122, 2, 13) + glassStrip(o, 54, 57, 92, 11) + clock(o, 68, 59.2, 6.4) + pbar(o, 82, 61.8, 30, DISP, 1.2) + [118, 126].map((x) => key(x, 60.4, 6, 4)).join("") + led(o, 139, 62.4, 1.1) +
      `<rect x="62" y="70.5" width="76" height="4" rx="2" fill="#000" fill-opacity=".38"/>` +
      `<path d="${rr(58, 78, 84, 88, 7)}" fill="#000" fill-opacity=".35"/>` + tub(o, 13, 60, 80, 80, 84, { r: 6, third: true }) +
      kick(o, 49, 151) + overhang(o) + vent(o, 100, 80)); }),

    ic("quiet", "Quiet 42 dB", BK, (o) => { const u = o.uid; return svg(o,
      room(o, { wall: "#e8eaeb", splash: "sub", top: "soap", cab: "#5c6d7a", pull: "steel", floor: "wood" }) +
      door(o, 49, 53, 102, 122, 2, 14) + `<path d="M50 59H150" stroke="#000" stroke-opacity=".5" stroke-width="1.4"/><path d="M50 60.4H150" stroke="#fff" stroke-opacity=".15" stroke-width=".6"/>` +
      (o.on ? `<g opacity=".7"><rect class="${P}pulse" x="144" y="64" width="12" height="104" rx="6" fill="url(#${u}-hi)"/></g><rect x="149.4" y="66" width="1.6" height="100" rx=".8" fill="${ICE}"/><rect x="149.6" y="66" width=".6" height="100" fill="#e6f5ff"/>`
        : `<rect x="149.4" y="66" width="1.6" height="100" rx=".8" fill="#2e3340"/>`) +
      `<path d="${rr(122, 64, 22, 9, 2)}" fill="#0b0d10" fill-opacity="${o.on ? 1 : .5}"/>` + (o.on ? segs(132.4, 66, 5, "42db", "#d9f0ff", .9) : "") +
      hl(51, 66, 51, 168, 1.4, .18) + kick(o, 49, 151) + spot(o, 100, 30, ICE) + overhang(o) + vent(o, 100, 80)); }),

    ic("autoopen", "Auto-open dry", SS, (o) => { const u = o.uid, op = o.on; return svg(o,
      room(o, { wall: "#8fb3a0", splash: "sub", top: "walnut", cab: "#f4f4f2", style: "slab", pull: "none", floor: "oak" }) +
      (op ? `<rect x="49" y="53" width="102" height="13" fill="#0a0c0f"/><rect x="52" y="54" width="96" height="11" fill="url(#${u}-tub)"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => cup(62 + i * 11, 64, .7, i % 2 ? "#e9edf1" : "#2f6f9f")).join("") + `<path d="M56 64.4H144" stroke="#c4ccd5" stroke-width=".8"/>` +
        `<rect class="${P}pulse" x="52" y="54" width="96" height="11" fill="url(#${u}-tl)"/>` +
        `<path d="M49 66H151L153 71H47Z" fill="url(#${u}-finv)"/><path d="M49 66H151" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/><path d="M47 71H153" stroke="#000" stroke-opacity=".4" stroke-width=".6"/>` + door(o, 47, 71, 106, 105, 2, 15)
        : door(o, 49, 53, 102, 122, 2)) +
      `<path d="M50 ${op ? 70 : 59}H150" stroke="#000" stroke-opacity=".001"/>` + led(o, 142, op ? 78 : 60, 1.1, AMB, "ha") +
      hl(50, op ? 80 : 64, 50, 168, 1.4, .25) + kick(o, 49, 151) + overhang(o) +
      (op ? steam(o, 100, 60, 6, 16, 8) + steam(o, 100, 50, 3, 30, 6) : "")); }),

    ic("opendrawer", "Open drawer", SS, (o) => { const u = o.uid, s = { wall: "#eef0ee", splash: "sub", top: "butcher", cab: "#e9e2d2", pull: "brass", floor: "wood" };
      let body;
      if (!o.on) body = door(o, 49, 53, 102, 58, 2) + `<path d="M50 56.5H150" stroke="#000" stroke-opacity=".45" stroke-width="2.4"/><path d="M50 58H150" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>` + led(o, 144, 104, 1) + `<path d="M50 109.5H150" stroke="#000" stroke-opacity=".3"/>`;
      else {
        let dishes = "";
        for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const x = (r ? 52 : 56) + i * (r ? 12 : 11), y = r ? 86 : 74, ry = r ? 12 : 9.5, rx = r ? 5 : 4.2, c = (i + r) % 3 === 1 ? "#5d8fc4" : "#aeb9c5";
          dishes += `<g transform="rotate(${(i % 2 ? 6 : -4) + (r ? 0 : 2)} ${n1(x)} ${y})"><ellipse cx="${n1(x)}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${u}-plate)" stroke="${c}" stroke-width="1"/><ellipse cx="${n1(x - .4)}" cy="${y}" rx="${n1(rx * .45)}" ry="${n1(ry * .62)}" fill="none" stroke="#7d8ea3" stroke-opacity=".3" stroke-width=".6"/></g>`; }
        for (let i = 0; i < 12; i++) dishes += `<path d="M${n1(44 + i * 10.2)} 97V88" stroke="#c4ccd5" stroke-opacity=".7" stroke-width=".7"/>`;
        body = `<rect x="48" y="${CY}" width="104" height="58" fill="#07080a"/>` +
          `<path d="M50 56H150L158 100H42Z" fill="url(#${u}-tub)"/><path d="M50 56H150L158 100H42Z" fill="url(#${u}-tubx)"/>` +
          [0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${46 + i * 18} 98L${54 + i * 15.3} 60" stroke="#c4ccd5" stroke-opacity=".35" stroke-width=".6"/>`).join("") +
          dishes + `<path d="M44 96H156" stroke="#c4ccd5" stroke-width="1"/>` +
          `<path d="M38 98H162V124H38Z" fill="url(#${u}-fin)"/><path d="M38 98H162V124H38Z" fill="url(#${u}-${metal(o) ? "br" : "gls"})"/><path d="M38 98H162V124H38Z" fill="url(#${u}-fv)"/><path d="M38 98H162V124H38Z" fill="none" stroke="${edgeC(o)}" stroke-width=".8"/>` +
          `<path d="M38 98.6H162" stroke="#fff" stroke-opacity=".7"/><path d="M40 101.5H160" stroke="#000" stroke-opacity=".45" stroke-width="2.4"/>` +
          `<rect x="40" y="124" width="120" height="5" fill="#000" fill-opacity=".35"/>` +
          [[60, 72], [96, 66], [132, 76], [78, 90], [120, 86]].map((p, i) => `<path class="${P}sparkle" d="M${p[0]} ${p[1] - 4}L${p[0] + 1} ${p[1] - 1}L${p[0] + 4} ${p[1]}L${p[0] + 1} ${p[1] + 1}L${p[0]} ${p[1] + 4}L${p[0] - 1} ${p[1] + 1}L${p[0] - 4} ${p[1]}L${p[0] - 1} ${p[1] - 1}Z" fill="#fff" style="animation-delay:-${(i * .45).toFixed(2)}s"/>`).join("") +
          steam(o, 100, 62, 4, 22, 7) + led(o, 146, 112, 1.2, GREEN, "hg");
      }
      return svg(o, room(o, s) + `<rect x="48" y="${CY}" width="104" height="${KY - CY}" fill="#111317"/>` +
        face(o, s, 49.2, 113, 101.6, 61.8) + pull(o, "brass", 100, 120, 22) + `<rect x="49" y="${KY}" width="102" height="${FY - KY}" fill="#0e1013"/>` +
        (o.on ? `<rect x="40" y="129" width="120" height="10" fill="url(#${u}-ovh)"/>` : "") + overhang(o) + body); }),

    ic("dial", "Classic dial", WH, (o) => { const u = o.uid, a = (-140 + 280 * (o.on ? o.level : 0)) * Math.PI / 180; return svg(o,
      room(o, { wall: "#e8dcc4", splash: "sq", top: "laminate", cab: "#b98250", grain: "v", pull: "knob", floor: "vinyl" }) +
      door(o, 49, 53, 102, 122, 1.5, 17) + `<path d="${rr(49, 53, 102, 24, 1.5)}" fill="#1a1c20"/><path d="M49 53.6H151" stroke="#fff" stroke-opacity=".18"/><path d="M49 77H151" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/>` +
      [0, 1, 2, 3].map((i) => `<rect x="${55 + i * 11}" y="61" width="9" height="6" rx="1" fill="#e6e6e2"/><rect x="${55 + i * 11}" y="66" width="9" height="1" fill="#000" fill-opacity=".3"/>`).join("") +
      [0, 1, 2, 3].map((i) => `<rect x="${57.5 + i * 11}" y="70" width="4" height="1" rx=".5" fill="#fff" fill-opacity=".3"/>`).join("") +
      led(o, 106, 65, 1.3, REDL, "hr") +
      `<circle cx="132" cy="65.6" r="9.4" fill="#000" fill-opacity=".5"/><circle cx="132" cy="65" r="8.6" fill="url(#${u}-stv)"/><circle cx="132" cy="65" r="6.6" fill="#d8dadc"/><circle cx="132" cy="65" r="6.6" fill="url(#${u}-gls)"/>` +
      `<g transform="rotate(${n1(a * 180 / Math.PI)} 132 65)"><rect x="130.8" y="57.6" width="2.4" height="14.8" rx="1.2" fill="#9aa1a9"/><path d="M132 58.4V61.4" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/></g>` +
      [-140, -70, 0, 70, 140].map((d) => { const r = d * Math.PI / 180; return `<circle cx="${n1(132 + Math.sin(r) * 10.6)}" cy="${n1(65 - Math.cos(r) * 10.6)}" r=".6" fill="#fff" fill-opacity=".5"/>`; }).join("") +
      `<path d="M60 77.6H140" stroke="#000" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/>` + hl(51, 84, 51, 168, 1.6, .3) +
      kick(o, 49, 151) + overhang(o) + vent(o, 100, 80)); }),

    ic("commercial", "Commercial", SS, (o) => { const u = o.uid, s = { wall: "#eceeef", splash: "sq", top: "steel", cab: "#b9bfc5", style: "slab", brush: true, pull: "steel", floor: "quarry" };
      const gauge = (cx, cy, v) => { const a = (-120 + 240 * v) * Math.PI / 180, dx = Math.sin(a) * 5.4, dy = -Math.cos(a) * 5.4;
        return `<circle cx="${cx}" cy="${cy + .6}" r="7.6" fill="#000" fill-opacity=".35"/><circle cx="${cx}" cy="${cy}" r="7.4" fill="url(#${u}-st)"/><circle cx="${cx}" cy="${cy}" r="6" fill="#f4f4ef"/>` +
          [-120, -60, 0, 60, 120].map((d) => { const r = d * Math.PI / 180; return `<path d="M${n1(cx + Math.sin(r) * 4.6)} ${n1(cy - Math.cos(r) * 4.6)}L${n1(cx + Math.sin(r) * 5.6)} ${n1(cy - Math.cos(r) * 5.6)}" stroke="#333" stroke-width=".6"/>`; }).join("") +
          `<path d="M${n1(cx + 4.2)} ${n1(cy + 2.4)}A4.8 4.8 0 0 0 ${n1(cx + 4.8)} ${cy}" stroke="${REDL}" stroke-width="1" fill="none"/>` +
          `<g class="${o.on ? P + "needle" : ""}"><path d="M${n1(cx - dx)} ${n1(cy - dy)}L${n1(cx + dx)} ${n1(cy + dy)}" stroke="#000" stroke-opacity="0" stroke-width=".8"/><path d="M${cx} ${cy}L${n1(cx + dx)} ${n1(cy + dy)}" stroke="#c0392b" stroke-width=".9" stroke-linecap="round"/></g><circle cx="${cx}" cy="${cy}" r="1" fill="#222"/>` +
          `<path d="M${cx - 4} ${cy - 3}A5 5 0 0 1 ${cx + 1} ${cy - 5}" stroke="#fff" stroke-opacity=".8" stroke-width=".7" fill="none"/>`; };
      return svg(o, room(o, s) +
      door(o, 49, 53, 102, 27, 1.5) + gauge(64, 66, o.on ? .45 + .25 * o.level : 0) + gauge(86, 66, o.on ? .55 + .3 * o.level : 0) +
      glassStrip(o, 100, 61, 20, 10, 1.5) + clock(o, 110, 63, 5.6, AMB) +
      `<circle cx="135" cy="66" r="6" fill="#1d2025"/><circle cx="135" cy="66" r="4.4" fill="${o.on ? GREEN : "#2c5a43"}"/><circle cx="134" cy="65" r="1.4" fill="#fff" fill-opacity=".5"/>` + (o.on ? `<circle class="${P}pulse" cx="135" cy="66" r="9" fill="url(#${u}-hg)"/>` : "") +
      `<path d="M49 80.4H151" stroke="#000" stroke-opacity=".5" stroke-width="1.2"/>` +
      door(o, 49, 81, 102, 94, 1.5, 18) + bar(o, 52, 148, 84) +
      `<rect x="60" y="100" width="80" height="64" rx="2" fill="none" stroke="#000" stroke-opacity=".12"/>` + hl(51, 96, 51, 170, 1.4, .3) +
      `<rect x="49" y="${KY}" width="102" height="${FY - KY}" fill="url(#${u}-fin)"/><rect x="54" y="${KY + 1.5}" width="92" height="5" fill="url(#${u}-vent)"/>` +
      overhang(o) + (o.on ? steam(o, 100, CY - 1, 4, 24, 6) : "")); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "dishwasher", tab: "Dishwashers", group: "Appliances", kind: "device",
    intro: "Eighteen dishwashers built in under real counters. When running, the spray arms spin and water jets sweep behind glass, solid doors show the time left in segment digits or a light on the floor, a soft sheen hums across the door, and near the end steam puffs out at the top. The slider is the cycle progress.",
    
    css, icons,
  });
})();
