window.HDAPV = window.HDAPV || {};
(function () {
  let N = 0;
  const R = (n) => Math.round(n * 10) / 10;
  const rgb = (c) => { c = String(c || "#888").replace("#", ""); if (c.length === 3) c = c.replace(/./g, "$&$&"); const n = parseInt(c, 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const sh = (c, t) => "#" + rgb(c).map((v) => { v = t < 0 ? v * (1 + t) : v + (255 - v) * t; v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join("");
  const pts = (a) => a.map((p) => R(p[0]) + "," + R(p[1])).join(" ");
  const pg = (a, at) => `<polygon points="${pts(a)}" ${at}/>`;
  const pathOf = (a) => "M" + a.map((p) => R(p[0]) + " " + R(p[1])).join("L") + "Z";
  const rc = (x, y, w, h, at, rx) => `<rect x="${R(x)}" y="${R(y)}" width="${R(Math.max(0, w))}" height="${R(Math.max(0, h))}"${rx ? ` rx="${R(rx)}"` : ""} ${at}/>`;
  const ln = (x1, y1, x2, y2, at) => `<path d="M${R(x1)} ${R(y1)}L${R(x2)} ${R(y2)}" ${at}/>`;
  function hull(ps) {
    const p = ps.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    up.pop(); lo.pop(); return lo.concat(up);
  }
  function S(o) {
    o = o || {}; const off = !!o.off, run = !off && !!o.run;
    const cols = (o.colors || []).slice(0, 4); while (cols.length < 4) cols.push(null);
    return { off, run, pct: Math.max(0, Math.min(100, +o.pct || 0)), cols, act: o.act || "#2563eb" };
  }
  const wrap = (vb, s, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet"><g${s.off ? ' opacity=".55"' : ""}>${g}</g></svg>`;

  function defs(k, blur) {
    const st = (o, c, a) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`;
    const lg = (id, x2, y2, s) => `<linearGradient id="${id}${k}" x1="0" y1="0" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
    return "<defs>"
      + lg("bf", 0, 1, st(0, "#3a3c41") + st(.45, "#2e3034") + st(1, "#25272a"))
      + lg("bs", 1, 0, st(0, "#2a2c30") + st(1, "#1a1c1f"))
      + lg("bt", 0, 1, st(0, "#4a4d53") + st(1, "#36383d"))
      + lg("mt", 1, 0, st(0, "#5e6369") + st(.45, "#e3e6e9") + st(1, "#7b8087"))
      + lg("hd", 0, 1, st(0, "#f4f5f6") + st(.6, "#d0d3d7") + st(1, "#a6aab0"))
      + lg("gi", 0, 1, st(0, "#1b1c20") + st(1, "#0a0b0d"))
      + `<radialGradient id="lt${k}" cx=".35" cy="0" r="1">${st(0, "#ffd9a3", .34)}${st(.55, "#ffb766", .08)}${st(1, "#ffb766", 0)}</radialGradient>`
      + lg("dg", 0, 1, st(0, "#aab3bd", .36) + st(.1, "#ffffff", .2) + st(.24, "#6a727c", .14) + st(.7, "#353a40", .2) + st(1, "#1d2024", .34))
      + lg("ss", 0, 1, st(0, "#000", .55) + st(.3, "#000", .08) + st(.5, "#fff", .14) + st(.7, "#000", 0) + st(1, "#000", .3))
      + lg("gd", 0, 1, st(0, "#e8cb78") + st(1, "#8f6f2a"))
      + lg("fc", 1, 0, st(0, "#6b7077") + st(.35, "#e2e5e8") + st(.6, "#b8bcc1") + st(1, "#62666c"))
      + lg("sb", 0, 1, st(0, "#232529") + st(1, "#141518"))
      + lg("rf", 1, 1, st(0, "#fff", .16) + st(.45, "#fff", .02) + st(1, "#fff", 0))
      + `<pattern id="wp${k}" width="1.3" height="8" patternUnits="userSpaceOnUse"><rect width=".45" height="8" fill="#000" fill-opacity=".2"/></pattern>`
      + `<pattern id="lp${k}" width="8" height="1.4" patternUnits="userSpaceOnUse"><rect width="8" height=".4" fill="#000" fill-opacity=".22"/></pattern>`
      + `<filter id="bl${k}" x="-30%" y="-150%" width="160%" height="400%"><feGaussianBlur stdDeviation="${blur}"/></filter>`
      + "</defs>";
  }

  function front(c) {
    const { X, Y, W, H, k } = c, s = c.st, rx = c.rx || 0, sx = c.sx || 0, sy = c.sy || 0, hi = !!c.hi;
    const dx0 = X + .06 * W, dx1 = X + .915 * W, dy0 = Y + .13 * H, dy1 = Y + .94 * H, dw = dx1 - dx0, dh = dy1 - dy0;
    const ft = Math.max(1.5, .016 * W), gx0 = dx0 + ft, gy0 = dy0 + ft, gx1 = dx1 - ft, gy1 = dy1 - ft, gw = gx1 - gx0, gh = gy1 - gy0;
    const ix = (f) => gx0 + f * gw, iy = (f) => gy0 + f * gh;
    let o = rc(X, Y, W, H, `fill="url(#bf${k})"`, rx);
    o += ln(X + rx, Y + .5, X + W - rx, Y + .5, `stroke="#fff" stroke-opacity=".2" stroke-width=".7"`)
      + ln(X + .5, Y + rx + 1, X + .5, Y + H - rx - 1, `stroke="#fff" stroke-opacity=".08" stroke-width=".7"`);
    if (hi) o += rc(X + 1.2, Y + 1.2, W - 2.4, H - 2.4, `fill="none" stroke="#fff" stroke-opacity=".05" stroke-width=".6"`, Math.max(0, rx - 1));
    const mx = X + .085 * W, my = Y + .012 * H, mh = .064 * H, scw = .2 * W, dls = mh * 1.15, mw = scw + dls + .03 * W;
    o += rc(mx, my, mw, mh, `fill="#0f1012" stroke="#000" stroke-opacity=".5" stroke-width=".4"`, mh * .2)
      + ln(mx + 1, my + .4, mx + mw - 1, my + .4, `stroke="#fff" stroke-opacity=".2" stroke-width=".5"`);
    const scx = mx + .012 * W, scy = my + .16 * mh, sch = .68 * mh;
    o += rc(scx, scy, scw, sch, `fill="${s.off ? "#030405" : "#060a10"}"`, .6);
    if (!s.off) {
      o += rc(scx + .08 * scw, scy + .2 * sch, .36 * scw, .14 * sch, `fill="#e8edf3" fill-opacity=".85"`)
        + rc(scx + .08 * scw, scy + .46 * sch, .22 * scw, .1 * sch, `fill="#9aa4b0" fill-opacity=".8"`)
        + rc(scx + .64 * scw, scy + .2 * sch, .26 * scw, .3 * sch, `fill="#e8edf3" fill-opacity=".5"`, .4);
      if (s.run) o += rc(scx + .08 * scw, scy + .72 * sch, .84 * scw, .11 * sch, `fill="#2b3038"`) + rc(scx + .08 * scw, scy + .72 * sch, .84 * scw * s.pct / 100, .11 * sch, `fill="#4ade80"`);
    }
    const dlx = scx + scw + .012 * W;
    o += rc(dlx, my + .1 * mh, dls, .8 * mh, `fill="#2b2d31"`, mh * .18)
      + `<circle cx="${R(dlx + dls / 2)}" cy="${R(my + mh / 2)}" r="${R(.28 * mh)}" fill="#17181b" stroke="#62666d" stroke-width=".5"/>`;
    const bx = X + .7 * W, by = Y + .03 * H, bu = .024 * H;
    o += rc(bx, by, bu, bu, `fill="#cfd2d6" fill-opacity=".7"`, .3)
      + rc(bx + bu * 1.4, by + bu * .08, .1 * W, bu * .34, `fill="#cfd2d6" fill-opacity=".55"`)
      + rc(bx + bu * 1.4, by + bu * .6, .065 * W, bu * .26, `fill="#cfd2d6" fill-opacity=".35"`);
    o += rc(dx0 - .9, dy0 - .9, dw + 1.8, dh + 1.8, `fill="none" stroke="#000" stroke-opacity=".6" stroke-width=".7"`, rx * .5 + .5)
      + rc(dx0, dy0, dw, dh, `fill="#131417"`, rx * .4)
      + ln(dx0 + 1, dy0 + .4, dx1 - 1, dy0 + .4, `stroke="#fff" stroke-opacity=".1" stroke-width=".5"`);
    o += `<clipPath id="cg${k}"><rect x="${R(gx0)}" y="${R(gy0)}" width="${R(gw)}" height="${R(gh)}"/></clipPath><g clip-path="url(#cg${k})">`;
    o += rc(gx0, gy0, gw, gh, `fill="url(#gi${k})"`);
    const bx0 = ix(.1) + sx, bx1 = ix(.9) + sx, by0 = iy(.07) + sy, by1 = iy(.86) + sy;
    o += pg([[gx0, gy0], [bx0, by0], [bx0, by1], [gx0, gy1]], `fill="#1c1d21"`)
      + pg([[gx1, gy0], [bx1, by0], [bx1, by1], [gx1, gy1]], `fill="#121316"`)
      + pg([[gx0, gy0], [gx1, gy0], [bx1, by0], [bx0, by0]], `fill="#212327"`)
      + pg([[gx0, gy1], [gx1, gy1], [bx1, by1], [bx0, by1]], `fill="#0c0d0f"`)
      + rc(bx0, by0, bx1 - bx0, by1 - by0, `fill="#15161a"`);
    if (hi) for (let j = 1; j < 4; j++) o += ln(bx0 + (bx1 - bx0) * j / 4, by0, bx0 + (bx1 - bx0) * j / 4, by1, `stroke="#000" stroke-opacity=".25" stroke-width=".5"`);
    const fcx = (gx0 + bx0) / 2, fcy = iy(.5), frx = Math.max(2, (bx0 - gx0) * .34), fry = gh * .12;
    o += `<ellipse cx="${R(fcx)}" cy="${R(fcy)}" rx="${R(frx)}" ry="${R(fry)}" fill="#0d0e10" stroke="#34373c" stroke-width=".6"/>`
      + `<ellipse cx="${R(fcx)}" cy="${R(fcy)}" rx="${R(frx * .55)}" ry="${R(fry * .55)}" fill="none" stroke="#2a2c31" stroke-width=".5"/>`;
    if (s.run) o += rc(gx0, gy0, gw, gh, `fill="url(#lt${k})"`);
    else if (!s.off) o += rc(gx0, gy0, gw, gh, `fill="#fff" fill-opacity=".03"`);
    o += rc(ix(.825) + sx * .5, iy(.25), .045 * gw, gh, `fill="#0a0b0d"`)
      + rc(ix(.07) + sx * .2, iy(.24), Math.max(1, .011 * gw), gh, `fill="url(#mt${k})"`)
      + rc(ix(.865) + sx * .5, iy(.24), Math.max(1, .011 * gw), gh, `fill="url(#mt${k})"`);
    o += rc(ix(.1), iy(.16), .19 * gw, .035 * gh, `fill="#eef0f2" fill-opacity="${s.run ? .95 : s.off ? .2 : .55}"`);
    o += rc(ix(.01), iy(.105), .98 * gw, .06 * gh, `fill="#0b0c0e"`) + rc(ix(.01), iy(.105), .98 * gw, Math.max(.6, .008 * gh), `fill="#7a7f86"`)
      + rc(ix(.01), iy(.165) - .5, .98 * gw, .5, `fill="#3a3d42"`);
    const tx = ix(.47), ty = iy(.118), ts = .035 * gw;
    o += `<path d="M${R(tx)} ${R(ty + ts * .9)}L${R(tx + ts / 2)} ${R(ty)}L${R(tx + ts)} ${R(ty + ts * .9)}Z" fill="#f5c12e"/>`;
    const pf = iy(.765), pb = iy(.7) + sy * .6, pe = iy(.8), pl0 = ix(.1), pl1 = ix(.9), pbl0 = ix(.17) + sx * .7, pbl1 = ix(.83) + sx * .7;
    o += pg([[pl0, pf], [pl1, pf], [pbl1, pb], [pbl0, pb]], `fill="#3c3f44"`);
    if (hi) o += pg([[pl0 + 2, pf - .6], [pl1 - 2, pf - .6], [pbl1 - 1.5, pb + .6], [pbl0 + 1.5, pb + .6]], `fill="#4a4d52"`);
    o += rc(pl0, pf, pl1 - pl0, pe - pf, `fill="#c6c9cd"`) + rc(pl0, pe, pl1 - pl0, .03 * gh, `fill="#09090b"`);
    for (let j = 0; j < 4; j++) o += rc(pl0 + (.06 + j * .11) * (pl1 - pl0), pf + (pe - pf) * .38, .07 * (pl1 - pl0), (pe - pf) * .26, `fill="#4e5359" fill-opacity=".7"`);
    if (s.pct > 0) {
      const pw = .16 * gw, ph = .34 * gh * s.pct / 100, pcx = (pl0 + pl1) / 2 + sx * .35, pby = (pf + pb) / 2 + 1, psd = c.side ? pw * .2 : 0, psy = c.sdy ? -pw * .08 : 0;
      o += `<ellipse cx="${R(pcx + psd / 2)}" cy="${R(pby)}" rx="${R(pw * .62)}" ry="1.2" fill="#000" fill-opacity=".4"/>`;
      if (psd) o += pg([[pcx + pw / 2, pby], [pcx + pw / 2 + psd, pby + psy], [pcx + pw / 2 + psd, pby - ph + psy], [pcx + pw / 2, pby - ph]], `fill="${sh(s.act, -.45)}"`);
      if (psy) o += pg([[pcx - pw / 2, pby - ph], [pcx + pw / 2, pby - ph], [pcx + pw / 2 + psd, pby - ph + psy], [pcx - pw / 2 + psd, pby - ph + psy]], `fill="${sh(s.act, .35)}"`);
      o += rc(pcx - pw / 2, pby - ph, pw, ph, `fill="${s.act}"`) + rc(pcx - pw / 2, pby - ph, pw, ph, `fill="url(#lp${k})"`)
        + rc(pcx - pw / 2, pby - ph, pw, Math.min(ph, 1.2), `fill="${sh(s.act, .45)}"`);
    }
    const hcx = ix(.66), hy = iy(.035), hw = .2 * gw, hh = .19 * gh, hx0 = hcx - hw / 2, hx1 = hcx + hw / 2, sd = c.side || 0, sdy = c.sdy || 0;
    let h = `<path d="M${R(hcx + .18 * hw)} ${R(hy + 1)}C${R(hcx + .18 * hw)} ${R(gy0 - 3)} ${R(hcx + .45 * hw)} ${R(gy0 - 1)} ${R(hcx + .55 * hw)} ${R(gy0 - 8)}" stroke="#eceff2" stroke-opacity=".7" stroke-width="${R(Math.max(.9, .012 * gw))}" fill="none"/>`;
    if (sd) h += pg([[hx1, hy + .08 * hh], [hx1 + sd, hy + .08 * hh + sdy], [hx1 + sd, hy + .84 * hh + sdy], [hx1, hy + .86 * hh]], `fill="#7f838a"`);
    if (sdy < 0) h += pg([[hx0 + 1, hy + .3], [hx1 - .5, hy + .3], [hx1 + sd, hy + .3 + sdy], [hx0 + 1 + sd, hy + .3 + sdy]], `fill="#f7f8f9"`);
    h += rc(hx0, hy, hw, .68 * hh, `fill="url(#hd${k})"`, .1 * hw)
      + rc(hx0 + .05 * hw, hy + .6 * hh, .9 * hw, .27 * hh, `fill="#878b91"`, .06 * hw)
      + rc(hx0 + .05 * hw, hy + .8 * hh, .9 * hw, .07 * hh, `fill="#45494f"`)
      + `<circle cx="${R(hcx - .14 * hw)}" cy="${R(hy + .3 * hh)}" r="${R(.2 * hw)}" fill="#141518" stroke="#43464c" stroke-width=".6"/>`
      + `<circle cx="${R(hcx - .14 * hw)}" cy="${R(hy + .3 * hh)}" r="${R(.07 * hw)}" fill="#2e3035"/>`
      + ln(hcx + .22 * hw, hy + .08 * hh, hcx + .22 * hw, hy + .6 * hh, `stroke="#000" stroke-opacity=".18" stroke-width=".5"`)
      + pg([[hcx - .07 * hw, hy + .87 * hh], [hcx + .07 * hw, hy + .87 * hh], [hcx + .025 * hw, hy + hh], [hcx - .025 * hw, hy + hh]], `fill="#c0a46a"`);
    if (hi) h += ln(hx0 + 1, hy + .5, hx1 - 1, hy + .5, `stroke="#fff" stroke-width=".5"`);
    if (s.run) h += `<circle cx="${R(hcx)}" cy="${R(hy + hh)}" r="1" fill="#ff8a3d"/>`;
    o += `<g class="pa-head">${h}</g>`;
    o += pg([[ix(.5), gy0], [ix(.66), gy0], [ix(.3), gy1], [ix(.14), gy1]], `fill="#fff" fill-opacity=".045"`)
      + pg([[ix(.71), gy0], [ix(.75), gy0], [ix(.39), gy1], [ix(.35), gy1]], `fill="#fff" fill-opacity=".035"`);
    if (hi) o += rc(gx0, gy0, gw, gh, `fill="url(#rf${k})"`);
    if (s.off) o += rc(gx0, gy0, gw, gh, `fill="#000" fill-opacity=".45"`);
    o += "</g>";
    const hy2 = dy0 + .455 * dh, hhh = Math.max(2, .03 * dh);
    o += rc(dx0 + .88 * dw, hy2, .13 * dw, hhh, `fill="#e4e6e8"`, hhh / 2) + rc(dx0 + .91 * dw, hy2 + hhh * .38, .07 * dw, hhh * .24, `fill="#8d9196"`);
    o += rc(X + .03 * W, Y + H, .07 * W, .014 * H, `fill="#0b0c0e"`, .5) + rc(X + .9 * W, Y + H, .07 * W, .014 * H, `fill="#0b0c0e"`, .5);
    return o;
  }

  function amsFront(c) {
    const { x, w, y, h, k } = c, s = c.st, u = c.u || w / 152, rx = c.rx || 0, n = c.n || 4;
    let o = rc(x, y, w, h, `fill="url(#sb${k})"`, rx);
    o += rc(x, y, w, .13 * h, `fill="#2c2e33"`, rx) + ln(x + 1, y + .4, x + w - 1, y + .4, `stroke="#fff" stroke-opacity=".25" stroke-width=".6"`)
      + ln(x, y + .13 * h, x + w, y + .13 * h, `stroke="#000" stroke-opacity=".6" stroke-width=".6"`);
    if (n === 4) o += rc(x + .76 * w, y + .035 * h, .028 * w, .055 * h, `fill="#d6d9dd" fill-opacity=".7"`) + rc(x + .797 * w, y + .045 * h, .08 * w, .04 * h, `fill="#d6d9dd" fill-opacity=".55"`);
    for (let i = 0; i < n; i++) {
      const cx = n === 1 ? x + w / 2 : x + w * (.17 + .22 * i), col = s.cols[i];
      o += rc(cx - 9 * u, y + .15 * h, 18 * u, .75 * h, `fill="#0a0b0d" fill-opacity=".75"`, 1.6 * u);
      o += rc(cx - 6.3 * u, y + .45 * h, 12.6 * u, .4 * h, `fill="url(#fc${k})"${col ? "" : ` fill-opacity=".5"`}`, 2 * u)
        + rc(cx - 6.3 * u, y + .45 * h, 12.6 * u, .05 * h, `fill="#3a3d42"`);
      if (col) o += rc(cx - .9 * u, y + .17 * h, 1.8 * u, .3 * h, `fill="${col}"`);
      o += rc(cx - 4.6 * u, y + .23 * h, 9.2 * u, .11 * h, `fill="url(#gd${k})"`, .8 * u)
        + rc(cx - 4.6 * u, y + .275 * h, 9.2 * u, .02 * h, `fill="#5a461a" fill-opacity=".7"`);
      if (col) o += rc(cx - .9 * u, y + .23 * h, 1.8 * u, .11 * h, `fill="${col}" fill-opacity=".55"`);
      o += rc(cx - 7.5 * u, y + .16 * h, 15 * u, .28 * h, `fill="#d5dce2" fill-opacity=".16" stroke="#fff" stroke-opacity=".38" stroke-width="${R(.5 * u)}"`, 3.2 * u);
      if (c.led) o += slotLed(cx, y + .065 * h, 1.3 * u, i, !!col, c.led);
    }
    o += rc(x, y, w, h, `fill="url(#rf${k})"`, rx);
    return o;
  }

  function spools(x0, x1, yT, yB, s, k) {
    const sw = (x1 - x0) / 4; let o = "";
    for (let i = 0; i < 4; i++) {
      const col = s.cols[i], sx = x0 + i * sw + sw * .04, w = sw * .92, f = Math.max(1, w * .08), hh = yB - yT;
      if (!col) { o += rc(sx + .5, yT + hh * .12, w - 1, hh * .88, `fill="none" stroke="#9aa1aa" stroke-opacity=".3" stroke-width=".6" stroke-dasharray="2 1.5"`, 1); continue; }
      o += rc(sx + f, yT + hh * .06, w - 2 * f, hh * .94, `fill="${col}"`) + rc(sx + f, yT + hh * .06, w - 2 * f, hh * .94, `fill="url(#wp${k})"`)
        + rc(sx, yT, f, hh, `fill="#d4d8dc" fill-opacity=".62"`, .6) + rc(sx + w - f, yT, f, hh, `fill="#d4d8dc" fill-opacity=".62"`, .6)
        + rc(sx, yT, w, hh, `fill="url(#ss${k})"`, 1);
    }
    return o;
  }

  function slotLed(cx, cy, r, i, loaded, st, glowOnly) {
    var q = function (n) { return Math.round(n * 10) / 10; };
    var sel = !st.off && (st.slot === i || (st.slot == null && !!st.err)), glow = sel && (st.run || !!st.err);
    var C = function (rr, fill, op) { return '<circle cx="' + q(cx) + '" cy="' + q(cy) + '" r="' + q(rr) + '" fill="' + fill + '"' + (op != null ? ' fill-opacity="' + op + '"' : "") + '/>'; };
    if (!glow) { if (glowOnly) return ""; return st.off || !loaded ? C(r, "#2a2c30") : C(r, "#eef2f6", st.slot === i ? .95 : .5); }
    var c = st.err ? "#ef4444" : "#4ade80", core = st.err ? "#f87171" : "#ecfdf5";
    r *= 1.5; return '<g>' + C(r * 4.4, c, .18) + C(r * 2.7, c, .36) + C(r * 1.2, core) + '<animate attributeName="opacity" values=".35;1;.35" dur="2.4s" repeatCount="indefinite"/></g>';
  }
  function spools3(P, x0, x1, yc, r, zc, rz, cols) {
    var n = cols.length, sw = (x1 - x0) / n, o = "", TAU = Math.PI * 2, i;
    function ring(x, rr, t0, t1, n) { var a = []; for (var j = 0; j <= n; j++) { var t = t0 + (t1 - t0) * j / n; a.push(P(x, yc - rr * Math.sin(t), zc - rz * rr / r * Math.cos(t))); } return a; }
    function disc(x, rr) { return ring(x, rr, 0, TAU, 28); }
    function cyl(xa, xb, rr) { return pathOf(hull(disc(xa, rr).concat(disc(xb, rr)))); }
    function band(xa, xb, rr, t0, t1) { return pathOf(ring(xa, rr, t0, t1, 10).concat(ring(xb, rr, t1, t0, 10))); }
    function arc(x, rr, t0, t1) { var a = ring(x, rr, t0, t1, 12), d = "M"; for (var j = 0; j < a.length; j++) d += (j ? "L" : "") + (Math.round(a[j][0] * 10) / 10) + " " + (Math.round(a[j][1] * 10) / 10); return d; }
    for (i = 0; i < n; i++) {
      var col = cols[i], sx = x0 + i * sw + sw * .05, w = sw * .9, f = Math.max(.8, w * .08), xa = sx + f, xb = sx + w - f, rw = r * .84, xe = sx + w;
      if (!col) { o += '<path d="' + pathOf(disc(xe, r * .96)) + '" fill="none" stroke="#9aa1aa" stroke-opacity=".35" stroke-width=".6" stroke-dasharray="2 1.5"/>'; continue; }
      o += '<path d="' + cyl(sx, xa, r) + '" fill="#aab0b6" fill-opacity=".22"/>'
        + '<path d="' + cyl(xa, xb, rw) + '" fill="' + col + '"/>'
        + '<path d="' + band(xa, xb, rw, -1.6, -.15) + '" fill="#000" fill-opacity=".32"/>'
        + '<path d="' + band(xa, xb, rw, 2.1, 3.1) + '" fill="#000" fill-opacity=".22"/>'
        + '<path d="' + band(xa, xb, rw, .75, 1.35) + '" fill="#fff" fill-opacity=".26"/>';
      for (var q = 1; q < 4; q++) o += '<path d="' + arc(xa + (xb - xa) * q / 4, rw, -.5, 2.6) + '" fill="none" stroke="#000" stroke-opacity=".13" stroke-width=".4"/>';
      o += '<path d="' + cyl(xb, xe, r) + '" fill="#c9ced3" fill-opacity=".4"/>'
        + '<path d="' + pathOf(disc(xe, r)) + '" fill="#d4d8dc" fill-opacity=".1" stroke="#eef1f4" stroke-opacity=".6" stroke-width=".5"/>'
        + '<path d="' + pathOf(disc(xe, rw)) + '" fill="' + col + '" fill-opacity=".55"/>'
        + '<path d="' + pathOf(disc(xe + .1, r * .3)) + '" fill="#5a6068" fill-opacity=".9"/>'
        + '<path d="' + pathOf(disc(xe + .2, r * .13)) + '" fill="#0d0e10"/>';
    }
    return o;
  }
  const A = { name: "Studio front", draw(o) {
    const s = S(o), k = "p1a" + (++N), X = 20, Y = 100, W = 160, H = 190;
    let g = defs(k, 3);
    g += `<ellipse cx="100" cy="${Y + H + 2}" rx="90" ry="5" fill="#000" fill-opacity=".5" filter="url(#bl${k})"/>`;
    g += rc(32, 97, 14, 3.5, `fill="#0b0c0e"`) + rc(154, 97, 14, 3.5, `fill="#0b0c0e"`);
    g += front({ X, Y, W, H, k, st: s, rx: 2.5 });
    const by = 52, bh = 46, d0 = 28.5, d1 = 171.5, dt = 7, r = 19;
    const dome = `M${d0} ${by}V${dt + r}A${r} ${r} 0 0 1 ${d0 + r} ${dt}H${d1 - r}A${r} ${r} 0 0 1 ${d1} ${dt + r}V${by}Z`;
    g += `<clipPath id="cd${k}"><path d="${dome}"/></clipPath><path d="${dome}" fill="#0d0e11" fill-opacity=".72"/>`;
    g += `<g clip-path="url(#cd${k})">` + spools(33, 167, dt + 5, by, s, k) + rc(d0, dt, d1 - d0, by - dt, `fill="#1b1f24" fill-opacity=".28"`) + `<path d="${dome}" fill="url(#dg${k})"/>`
      + rc(d0, dt + 3.5, d1 - d0, 3.5, `fill="#fff" fill-opacity=".15"`)
      + rc(d0, dt, 6, by - dt, `fill="#000" fill-opacity=".25"`) + rc(d1 - 6, dt, 6, by - dt, `fill="#000" fill-opacity=".25"`) + "</g>";
    g += `<path d="${dome}" fill="none" stroke="#e6ebf0" stroke-opacity=".32" stroke-width=".8"/>`;
    g += amsFront({ x: 25, y: by, w: 150, h: bh, k, st: s, rx: 2.5 });
    return wrap("0 0 200 300", s, g);
  } };

  function iso(o, c) {
    const s = S(o), k = c.p + (++N), { X, Y, W, H, DX } = c, hi = !!c.hi;
    const P = (x, y, z) => [x + z * DX, y + z * (c.a + (y - Y) * c.b)];
    let g = defs(k, hi ? 4.5 : 3);
    const fb = P(X + W / 2, Y + H, .5);
    g += `<ellipse cx="${R(fb[0] + 2)}" cy="${R(fb[1] + 3)}" rx="${R((W + DX) / 2 + 8)}" ry="${hi ? 7 : 5}" fill="#000" fill-opacity="${hi ? .6 : .5}" filter="url(#bl${k})"/>`;
    g += pg([P(X + W - 6, Y + H, .85), P(X + W, Y + H, .85), P(X + W, Y + H + 2.5, .85), P(X + W - 6, Y + H + 2.5, .85)], `fill="#0b0c0e"`);
    if (hi) g += pg([P(X, Y, 0), P(X + W, Y, 0), P(X + W, Y, 1), P(X, Y, 1)], `fill="url(#bt${k})"`)
      + `<path d="M${pts([P(X + 2, Y, 0), P(X + W, Y, 0), P(X + W, Y, 1)]).replace(/ /g, "L")}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".6"/>`;
    g += pg([P(X + W, Y, 0), P(X + W, Y, 1), P(X + W, Y + H, 1), P(X + W, Y + H, 0)], `fill="url(#bs${k})"`);
    if (hi) g += pg([P(X + W, Y + 2, .04), P(X + W, Y + 2, .97), P(X + W, Y + H - 2, .97), P(X + W, Y + H - 2, .04)], `fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"`)
      + ln(...P(X + W, Y + 1, 0), ...P(X + W, Y + H - 1, 0), `stroke="#fff" stroke-opacity=".16" stroke-width=".9"`);
    g += pg([P(X + W, Y + .345 * H, .47), P(X + W, Y + .345 * H, .6), P(X + W, Y + .5 * H, .6), P(X + W, Y + .5 * H, .47)], `fill="#0a0a0c"`)
      + pg([P(X + W, Y + .515 * H, .45), P(X + W, Y + .515 * H, .62), P(X + W, Y + .525 * H, .62), P(X + W, Y + .525 * H, .45)], `fill="#9aa0a6" fill-opacity=".5"`);
    g += front({ X, Y, W, H, k, st: s, rx: c.rx, sx: c.sx * W, sy: c.sy * H, side: c.hs * W, sdy: c.hsy * W, hi });
    const unit = (c.hi && o && o.unit) || "spu";
    if (unit !== "none") {
    const ht = unit === "ht", aF = .91 * W, aw = ht ? aF * .3 : aF, a0 = X + W / 2 - aw / 2, a1 = a0 + aw, z0 = .1, z1 = .84, b0 = Y - .25 * H, b1 = Y - .016 * H, bh = b1 - b0, hD = .24 * H;
    g += pg([P(a0 + 6, b1, z0), P(a0 + 16, b1, z0), P(a0 + 16, Y, z0), P(a0 + 6, Y, z0)], `fill="#0b0c0e"`) + pg([P(a1 - 16, b1, z0), P(a1 - 6, b1, z0), P(a1 - 6, Y, z0), P(a1 - 16, Y, z0)], `fill="#0b0c0e"`);
    const zd0 = z0 + .02, zd1 = z1 - .02, zc = (zd0 + zd1) / 2, zr = (zd1 - zd0) / 2, e0 = a0 + 1.5, e1 = a1 - 1.5;
    const D = (xe, hh, za, zb) => { const r = []; for (let t = 0; t <= 16; t++) { const th = Math.PI * t / 16; r.push(P(xe, b0 - hh * Math.sin(th), (za + zb) / 2 - (zb - za) / 2 * Math.cos(th))); } return r; };
    const DR = D(e1, hD, zd0, zd1), hp = pathOf(hull(D(e0, hD, zd0, zd1).concat(DR)));
    const fpT = P(a0, b0, z0), fpB = P(a0, b1, z0), tdy = ((fpT[1] - b0) + (fpB[1] - b1)) / 2;
    const base = pg([P(a1, b0, z0), P(a1, b0, z1), P(a1, b1, z1), P(a1, b1, z0)], `fill="url(#bs${k})"`)
      + (hi ? pg([P(a0, b0, z0), P(a1, b0, z0), P(a1, b0, z1), P(a0, b0, z1)], `fill="#303237"`) : "")
      + `<g transform="translate(${R(z0 * DX)} ${R(tdy)})">${amsFront({ x: a0, y: b0, w: a1 - a0, h: bh, k, st: s, rx: c.rx * .6, n: ht ? 1 : 4, u: aF / 152, led: hi ? { off: s.off, run: s.run, err: !!(o && o.err), slot: o && Number.isInteger(o.slot) ? o.slot : null } : null })}</g>`
      + (hi ? ln(...P(a1, b0 + .5, z0), ...P(a1, b1 - .5, z0), `stroke="#fff" stroke-opacity=".14" stroke-width=".7"`) : "");
    if (hi) {
      const t0 = P(a1 - Math.min(18, (a1 - a0) * .3), b0 + bh * .5, z1 + .02), t1 = P(X + .93 * W, Y, .97);
      const tp = `M${R(t0[0])} ${R(t0[1])}C${R(t0[0] + 34)} ${R(t0[1] - 6)} ${R(t1[0] + 16)} ${R(t1[1] - 8)} ${R(t1[0])} ${R(t1[1])}`;
      g += `<path d="${tp}" fill="none" stroke="#e9edf1" stroke-opacity=".55" stroke-width="1.9" stroke-linecap="round"/><path d="${tp}" fill="none" stroke="#8b949e" stroke-opacity=".6" stroke-width=".5"/>`;
    }
    if (!c.domeFirst) g += base;
    g += `<clipPath id="cd${k}"><path d="${hp}"/></clipPath><path d="${hp}" fill="#0c0d10" fill-opacity=".72"/><g clip-path="url(#cd${k})">`;
    if (hi) g += spools3(P, a0 + 5, a1 - 5, b0 + .04 * hD, .9 * hD, zc, zr * .88, ht ? [s.cols[0]] : s.cols);
    else {
    const x0s = a0 + 5, x1s = a1 - 5, sw = (x1s - x0s) / 4, zs = zd0 + .1, tsy = P(0, b0, zs)[1] - b0, xr = x0s + 3 * sw + sw * .96;
    if (s.cols[3]) {
      g += `<path d="${pathOf(D(xr, hD * .86, zs, zd1 - .06))}" fill="#d4d8dc" fill-opacity=".34" stroke="#eef1f4" stroke-opacity=".45" stroke-width=".5"/>`
        + `<path d="${pathOf(D(xr, hD * .5, zs + (zd1 - .06 - zs) * .2, zd1 - .06 - (zd1 - .06 - zs) * .2))}" fill="#000" fill-opacity=".18"/>`;
      if (hi) g += `<path d="${pathOf(D(xr - 1.2, hD * .7, zs + .04, zd1 - .1))}" fill="${s.cols[3]}" fill-opacity=".35"/>`;
    }
    g += `<g transform="translate(${R(zs * DX)} ${R(tsy)})">${spools(x0s, x1s, b0 - hD * .86, b0 + 2, s, k)}</g>`;
    }
    g += `<path d="${hp}" fill="#1b1f24" fill-opacity=".28"/><path d="${hp}" fill="url(#dg${k})"/>`
      + pg([P(e0 + 5, b0 - hD * .87, zc - zr * .5), P(e1, b0 - hD * .87, zc - zr * .5), P(e1, b0 - hD * .97, zc - zr * .25), P(e0 + 5, b0 - hD * .97, zc - zr * .25)], `fill="#fff" fill-opacity="${hi ? .2 : .15}"`);
    if (hi) g += pg([P(e0 + 8, b0 - hD * .45, zd0 + .02), P(e1 - 10, b0 - hD * .45, zd0 + .02), P(e1 - 10, b0 - hD * .55, zd0 + .03), P(e0 + 8, b0 - hD * .55, zd0 + .03)], `fill="#fff" fill-opacity=".07"`);
    g += "</g>";
    g += `<path d="${pathOf(DR)}" fill="#fff" fill-opacity=".05" stroke="#e8edf2" stroke-opacity=".32" stroke-width=".7"/>`
      + `<path d="${hp}" fill="none" stroke="#e8edf2" stroke-opacity=".3" stroke-width=".7"/>`;
    if (c.domeFirst) g += base;
    }
    return wrap(c.vb, s, g);
  }

  const B = { name: "Store-photo 3/4", draw(o) {
    return iso(o, { p: "bxb", X: 12, Y: 106, W: 142, H: 180, DX: 46, a: 0, b: -13 / 180, rx: 1.5, sx: .055, sy: -.015, hs: .045, hsy: 0, domeFirst: true, vb: "0 0 212 300" });
  } };
  const C = { name: "Hero render 3/4", draw(o) {
    return iso(o, { p: "bxc", X: 14, Y: 118, W: 146, H: 180, DX: 50, a: -10, b: -8 / 180, rx: 4, sx: .065, sy: -.035, hs: .05, hsy: -.018, hi: true, vb: "0 0 222 312" });
  } };

  window.HDAPV.boxb = [A, B, C];
})();
