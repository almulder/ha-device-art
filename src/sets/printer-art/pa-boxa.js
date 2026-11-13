window.HDAPA = window.HDAPA || {};
(function () {
  let N = 0;
  const CF = {"p":"x1c","X":16,"Y":112,"W":146,"H":190,"DX":50,"a":-10,"b":-0.044444444444444446,"rx":3,"sx":0.065,"sy":-0.035,"hs":0.05,"hsy":-0.018,"pal":{"f":["#e6e8eb","#d4d7db","#c2c6ca"],"s":["#c3c7cb","#9ca1a7"],"t":["#dcdfe2","#c6c9cd"],"hd":["#c9ccd0","#9ea2a8","#7a7e85"],"bf":["#eef0f2","#dcdfe2"],"bs":["#d3d6da","#aeb2b8"],"hf":"#141518"},"band":0.11,"dl":0.04,"dr":0.935,"dt":0.2,"db":0.955,"plinth":0,"side":"mark","dual":false,"scr":{"x":-0.045,"y":0.018,"w":0.31,"h":0.15,"zt":-0.02,"zb":-0.07},"spu":{"gen":1,"a0":0.045,"a1":0.955,"z0":0.1,"z1":0.84,"gap":0.016,"bh":0.234,"hD":0.23},"vb":"0 0 224 316"};
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

  function defs(k) {
    const p = CF.pal, st = (o, c, a) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`;
    const lg = (id, x2, y2, s) => `<linearGradient id="${id}${k}" x1="0" y1="0" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
    const g3 = (a) => st(0, a[0]) + st(.45, a[1]) + st(1, a[2] || a[1]);
    return "<defs>"
      + lg("bf", 0, 1, g3(p.f)) + lg("bs", 1, 0, st(0, p.s[0]) + st(1, p.s[1])) + lg("bt", 0, 1, st(0, p.t[0]) + st(1, p.t[1]))
      + lg("bb", 0, 1, st(0, (p.bf || p.f)[0]) + st(1, (p.bf || p.f)[1])) + lg("bbs", 1, 0, st(0, (p.bs || p.s)[0]) + st(1, (p.bs || p.s)[1]))
      + lg("ff", 1, 0, st(0, "#000", .12) + st(.04, "#000", 0) + st(.96, "#000", 0) + st(1, "#000", .16))
      + lg("mt", 1, 0, st(0, "#5e6369") + st(.45, "#e3e6e9") + st(1, "#7b8087"))
      + lg("hd", 0, 1, g3(p.hd))
      + lg("gi", 0, 1, st(0, "#1b1c20") + st(1, "#0a0b0d"))
      + `<radialGradient id="lt${k}" cx=".4" cy="0" r="1">${st(0, "#ffd9a3", .4)}${st(.55, "#ffb766", .1)}${st(1, "#ffb766", 0)}</radialGradient>`
      + lg("dg", 0, 1, st(0, "#aab3bd", .36) + st(.1, "#ffffff", .2) + st(.24, "#6a727c", .14) + st(.7, "#353a40", .2) + st(1, "#1d2024", .34))
      + lg("ss", 0, 1, st(0, "#000", .55) + st(.3, "#000", .08) + st(.5, "#fff", .14) + st(.7, "#000", 0) + st(1, "#000", .3))
      + lg("gd", 0, 1, st(0, "#e8cb78") + st(1, "#8f6f2a"))
      + lg("fc", 1, 0, st(0, "#6b7077") + st(.35, "#e2e5e8") + st(.6, "#b8bcc1") + st(1, "#62666c"))
      + lg("sb", 0, 1, st(0, "#2a2c30") + st(1, "#141518"))
      + lg("s2", 0, 1, st(0, "#4a4f56") + st(.18, "#30343a") + st(1, "#1b1d21"))
      + lg("am", 1, 0, st(0, "#7a4a12") + st(.4, "#e2a24a") + st(1, "#8a5516"))
      + lg("rf", 1, 1, st(0, "#fff", .16) + st(.45, "#fff", .02) + st(1, "#fff", 0))
      + lg("sc", 1, 1, st(0, "#1d2a3d") + st(1, "#0b111b"))
      + lg("sw", 1, 1, st(0, "#3a434c", .45) + st(.35, "#0c0f12", .92) + st(1, "#07090b", .95))
      + `<pattern id="wp${k}" width="1.3" height="8" patternUnits="userSpaceOnUse"><rect width=".45" height="8" fill="#000" fill-opacity=".2"/></pattern>`
      + `<pattern id="lp${k}" width="8" height="1.4" patternUnits="userSpaceOnUse"><rect width="8" height=".4" fill="#000" fill-opacity=".22"/></pattern>`
      + `<filter id="bl${k}" x="-30%" y="-150%" width="160%" height="400%"><feGaussianBlur stdDeviation="4.5"/></filter>`
      + `<filter id="gr${k}" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix type="saturate" values=".12"/><feComponentTransfer><feFuncR type="linear" slope=".62"/><feFuncG type="linear" slope=".62"/><feFuncB type="linear" slope=".62"/></feComponentTransfer></filter>`
      + "</defs>";
  }

  function front(c) {
    const { X, Y, W, H, k } = c, s = c.st, rx = CF.rx || 0, sx = CF.sx * W, sy = CF.sy * H, sd = CF.hs * W, sdy = CF.hsy * W;
    const dx0 = X + CF.dl * W, dx1 = X + CF.dr * W, dy0 = Y + CF.dt * H, dy1 = Y + CF.db * H, dw = dx1 - dx0, dh = dy1 - dy0;
    const ft = Math.max(1.5, .016 * W), gx0 = dx0 + ft, gy0 = dy0 + ft, gx1 = dx1 - ft, gy1 = dy1 - ft, gw = gx1 - gx0, gh = gy1 - gy0;
    const ix = (f) => gx0 + f * gw, iy = (f) => gy0 + f * gh, dark = CF.pal.dark;
    let o = rc(X, Y, W, H, `fill="url(#bf${k})"`, rx);
    if (CF.band) {
      const bh = CF.band * H;
      o += rc(X, Y, W, bh, `fill="url(#bb${k})"`, rx) + rc(X, Y + bh - 2, W, 2, `fill="url(#bb${k})"`)
        + ln(X + .4, Y + bh, X + W - .4, Y + bh, `stroke="#3a3d42" stroke-opacity=".75" stroke-width=".9"`)
        + ln(X + .4, Y + bh + .9, X + W - .4, Y + bh + .9, `stroke="#fff" stroke-opacity=".45" stroke-width=".6"`)
        + ln(X + .4, Y + bh - 1.4, X + W - .4, Y + bh - 1.4, `stroke="#000" stroke-opacity=".12" stroke-width=".6"`);
    }
    if (CF.plinth) o += rc(X, Y + (1 - CF.plinth) * H, W, CF.plinth * H, `fill="${dark ? "#1a1b1e" : "#2b2d31"}"`, rx * .5)
      + ln(X + .5, Y + (1 - CF.plinth) * H, X + W - .5, Y + (1 - CF.plinth) * H, `stroke="#fff" stroke-opacity=".12" stroke-width=".5"`);
    o += rc(X, Y, W, H, `fill="url(#ff${k})"`, rx);
    o += ln(X + rx, Y + .5, X + W - rx, Y + .5, `stroke="#fff" stroke-opacity="${dark ? .22 : .7}" stroke-width=".8"`)
      + ln(X + .5, Y + rx + 1, X + .5, Y + H - rx - 1, `stroke="#fff" stroke-opacity="${dark ? .1 : .5}" stroke-width=".8"`)
      + ln(X + W - .4, Y + rx, X + W - .4, Y + H - rx, `stroke="#fff" stroke-opacity="${dark ? .14 : .8}" stroke-width=".9"`);
    o += rc(dx0 - .9, dy0 - .9, dw + 1.8, dh + 1.8, `fill="none" stroke="#000" stroke-opacity="${dark ? .7 : .35}" stroke-width=".8"`, 1.2)
      + rc(dx0, dy0, dw, dh, `fill="#131417"`, 1)
      + ln(dx0 + 1, dy1 + 1.2, dx1 - 1, dy1 + 1.2, `stroke="#fff" stroke-opacity="${dark ? .1 : .5}" stroke-width=".6"`);
    o += `<clipPath id="cg${k}"><rect x="${R(gx0)}" y="${R(gy0)}" width="${R(gw)}" height="${R(gh)}"/></clipPath><g clip-path="url(#cg${k})">`;
    o += rc(gx0, gy0, gw, gh, `fill="url(#gi${k})"`);
    const bx0 = ix(.1) + sx, bx1 = ix(.9) + sx, by0 = iy(.07) + sy, by1 = iy(.86) + sy;
    o += pg([[gx0, gy0], [bx0, by0], [bx0, by1], [gx0, gy1]], `fill="#1c1d21"`)
      + pg([[gx1, gy0], [bx1, by0], [bx1, by1], [gx1, gy1]], `fill="#121316"`)
      + pg([[gx0, gy0], [gx1, gy0], [bx1, by0], [bx0, by0]], `fill="#212327"`)
      + pg([[gx0, gy1], [gx1, gy1], [bx1, by1], [bx0, by1]], `fill="#0c0d0f"`)
      + rc(bx0, by0, bx1 - bx0, by1 - by0, `fill="#15161a"`);
    for (let j = 1; j < 4; j++) o += ln(bx0 + (bx1 - bx0) * j / 4, by0, bx0 + (bx1 - bx0) * j / 4, by1, `stroke="#000" stroke-opacity=".25" stroke-width=".5"`);
    const fcx = (gx0 + bx0) / 2, fcy = iy(.48), frx = Math.max(2, (bx0 - gx0) * .34), fry = gh * .11;
    o += `<ellipse cx="${R(fcx)}" cy="${R(fcy)}" rx="${R(frx)}" ry="${R(fry)}" fill="#0d0e10" stroke="#34373c" stroke-width=".6"/>`
      + `<ellipse cx="${R(fcx)}" cy="${R(fcy)}" rx="${R(frx * .55)}" ry="${R(fry * .55)}" fill="none" stroke="#2a2c31" stroke-width=".5"/>`
      + `<circle cx="${R(bx1 - .07 * gw)}" cy="${R(by0 + .3 * gh)}" r="${R(.04 * gw)}" fill="#08090a" stroke="#2f3237" stroke-width=".6"/>`;
    if (s.run) o += rc(gx0, gy0, gw, gh, `fill="url(#lt${k})"`);
    else if (!s.off) o += rc(gx0, gy0, gw, gh, `fill="#fff" fill-opacity=".03"`);
    o += rc(ix(.825) + sx * .5, iy(.25), .045 * gw, gh, `fill="#0a0b0d"`)
      + rc(ix(.07) + sx * .2, iy(.24), Math.max(1, .011 * gw), gh, `fill="url(#mt${k})"`)
      + rc(ix(.865) + sx * .5, iy(.24), Math.max(1, .011 * gw), gh, `fill="url(#mt${k})"`);
    o += rc(ix(.02), iy(.012), .96 * gw, Math.max(.8, .01 * gh), `fill="${s.run ? "#fff3dc" : s.off ? "#2a2c30" : "#c9d2db"}" fill-opacity="${s.run ? .95 : .6}"`);
    o += rc(ix(.01), iy(.105), .98 * gw, .06 * gh, `fill="#0b0c0e"`) + rc(ix(.01), iy(.105), .98 * gw, Math.max(.6, .008 * gh), `fill="#7a7f86"`)
      + rc(ix(.01), iy(.165) - .5, .98 * gw, .5, `fill="#3a3d42"`);
    o += rc(ix(.02), iy(.03), .07 * gw, .05 * gh, `fill="#0a0b0c" stroke="#3a3d42" stroke-width=".4"`, .8)
      + `<circle cx="${R(ix(.055))}" cy="${R(iy(.055))}" r="${R(.014 * gw)}" fill="#1e2c3f"/>`;
    const pf = iy(.765), pb = iy(.7) + sy * .6, pe = iy(.8), pl0 = ix(.1), pl1 = ix(.9), pbl0 = ix(.17) + sx * .7, pbl1 = ix(.83) + sx * .7;
    o += pg([[pl0, pf], [pl1, pf], [pbl1, pb], [pbl0, pb]], `fill="#3c3f44"`)
      + pg([[pl0 + 2, pf - .6], [pl1 - 2, pf - .6], [pbl1 - 1.5, pb + .6], [pbl0 + 1.5, pb + .6]], `fill="#4a4d52"`);
    o += rc(pl0, pf, pl1 - pl0, pe - pf, `fill="#c6c9cd"`) + rc(pl0, pe, pl1 - pl0, .03 * gh, `fill="#09090b"`);
    for (let j = 0; j < 4; j++) o += rc(pl0 + (.06 + j * .11) * (pl1 - pl0), pf + (pe - pf) * .38, .07 * (pl1 - pl0), (pe - pf) * .26, `fill="#4e5359" fill-opacity=".7"`);
    if (s.pct > 0) {
      const pw = .17 * gw, ph = .36 * gh * s.pct / 100, pcx = (pl0 + pl1) / 2 + sx * .35 - .06 * gw, pby = (pf + pb) / 2 + 1, psd = pw * .2, psy = -pw * .08;
      o += `<ellipse cx="${R(pcx + psd / 2)}" cy="${R(pby)}" rx="${R(pw * .62)}" ry="1.2" fill="#000" fill-opacity=".4"/>`
        + pg([[pcx + pw / 2, pby], [pcx + pw / 2 + psd, pby + psy], [pcx + pw / 2 + psd, pby - ph + psy], [pcx + pw / 2, pby - ph]], `fill="${sh(s.act, -.45)}"`)
        + pg([[pcx - pw / 2, pby - ph], [pcx + pw / 2, pby - ph], [pcx + pw / 2 + psd, pby - ph + psy], [pcx - pw / 2 + psd, pby - ph + psy]], `fill="${sh(s.act, .35)}"`)
        + rc(pcx - pw / 2, pby - ph, pw, ph, `fill="${s.act}"`) + rc(pcx - pw / 2, pby - ph, pw, ph, `fill="url(#lp${k})"`)
        + rc(pcx - pw / 2, pby - ph, pw, Math.min(ph, 1.2), `fill="${sh(s.act, .45)}"`);
    }
    const dual = !!CF.dual, hcx = ix(.6), hy = iy(.035), hw = (dual ? .26 : .2) * gw, hh = .19 * gh, hx0 = hcx - hw / 2, hx1 = hcx + hw / 2, fr = CF.pal.hf || "#141518";
    let h = `<path d="M${R(hcx + .18 * hw)} ${R(hy + 1)}C${R(hcx + .18 * hw)} ${R(gy0 - 3)} ${R(hcx + .45 * hw)} ${R(gy0 - 1)} ${R(hcx + .55 * hw)} ${R(gy0 - 8)}" stroke="#eceff2" stroke-opacity=".7" stroke-width="${R(Math.max(.9, .012 * gw))}" fill="none"/>`;
    h += pg([[hx1, hy + .08 * hh], [hx1 + sd, hy + .08 * hh + sdy], [hx1 + sd, hy + .84 * hh + sdy], [hx1, hy + .86 * hh]], `fill="${sh(CF.pal.hd[2], -.25)}"`)
      + pg([[hx0 + 1, hy + .3], [hx1 - .5, hy + .3], [hx1 + sd, hy + .3 + sdy], [hx0 + 1 + sd, hy + .3 + sdy]], `fill="${sh(CF.pal.hd[0], .25)}"`);
    h += rc(hx0, hy, hw, .68 * hh, `fill="url(#hd${k})"`, .1 * hw)
      + rc(hx0 + .05 * hw, hy + .6 * hh, .9 * hw, .27 * hh, `fill="${sh(CF.pal.hd[2], -.2)}"`, .06 * hw)
      + rc(hx0 + .05 * hw, hy + .8 * hh, .9 * hw, .07 * hh, `fill="#2a2c30"`);
    const fx = dual ? hcx : hcx - .14 * hw, frr = (dual ? .16 : .2) * hw;
    h += `<circle cx="${R(fx)}" cy="${R(hy + .3 * hh)}" r="${R(frr)}" fill="${fr}" stroke="#4a4d53" stroke-width=".6"/>`
      + `<circle cx="${R(fx)}" cy="${R(hy + .3 * hh)}" r="${R(frr * .35)}" fill="#2e3035"/>`;
    if (!dual) h += ln(hcx + .22 * hw, hy + .08 * hh, hcx + .22 * hw, hy + .6 * hh, `stroke="#000" stroke-opacity=".18" stroke-width=".5"`);
    const nz = dual ? [hcx - .2 * hw, hcx + .2 * hw] : [hcx];
    nz.forEach((nx) => {
      h += pg([[nx - .07 * hw, hy + .87 * hh], [nx + .07 * hw, hy + .87 * hh], [nx + .025 * hw, hy + hh], [nx - .025 * hw, hy + hh]], `fill="#c0a46a"`);
      if (s.run) h += `<circle cx="${R(nx)}" cy="${R(hy + hh)}" r="1" fill="#ff8a3d"/>`;
    });
    h += ln(hx0 + 1, hy + .5, hx1 - 1, hy + .5, `stroke="#fff" stroke-opacity=".7" stroke-width=".5"`);
    o += `<g class="pa-head">${h}</g>`;
    o += pg([[ix(.5), gy0], [ix(.66), gy0], [ix(.3), gy1], [ix(.14), gy1]], `fill="#fff" fill-opacity=".045"`)
      + pg([[ix(.71), gy0], [ix(.75), gy0], [ix(.39), gy1], [ix(.35), gy1]], `fill="#fff" fill-opacity=".035"`)
      + rc(gx0, gy0, gw, gh, `fill="url(#rf${k})"`);
    if (s.off) o += rc(gx0, gy0, gw, gh, `fill="#000" fill-opacity=".45"`);
    o += "</g>";
    const hy2 = dy0 + .455 * dh, hhh = Math.max(2.2, .032 * dh);
    o += rc(dx1 - .07 * dw, hy2, .1 * dw, hhh, `fill="#e8eaec" stroke="#000" stroke-opacity=".35" stroke-width=".4"`, hhh / 2)
      + rc(dx1 - .045 * dw, hy2 + hhh * .38, .05 * dw, hhh * .24, `fill="#8d9196"`);
    o += rc(X + .03 * W, Y + H, .07 * W, .012 * H, `fill="#0b0c0e"`, .5) + rc(X + .9 * W, Y + H, .07 * W, .012 * H, `fill="#0b0c0e"`, .5);
    return o;
  }

  function ams1Front(c) {
    const { x, w, y, h, k } = c, s = c.st, u = c.u || w / 152, rx = c.rx || 0, n = c.n || 4;
    let o = rc(x, y, w, h, `fill="url(#sb${k})"`, rx);
    o += rc(x, y, w, .13 * h, `fill="#2c2e33"`, rx) + ln(x + 1, y + .4, x + w - 1, y + .4, `stroke="#fff" stroke-opacity=".25" stroke-width=".6"`)
      + ln(x, y + .13 * h, x + w, y + .13 * h, `stroke="#000" stroke-opacity=".6" stroke-width=".6"`);
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

  function ams2Front(c) {
    const { x, w, y, h, k } = c, s = c.st, u = w / 152, rx = c.rx || 0;
    let o = rc(x, y, w, h, `fill="url(#s2${k})"`, rx);
    o += ln(x + 1, y + .4, x + w - 1, y + .4, `stroke="#fff" stroke-opacity=".35" stroke-width=".7"`)
      + rc(x, y + h - .12 * h, w, .12 * h, `fill="#0f1012"`, rx) + ln(x + 1, y + .88 * h, x + w - 1, y + .88 * h, `stroke="#fff" stroke-opacity=".1" stroke-width=".5"`);
    for (let i = 0; i < 4; i++) {
      const cx = x + w * (.14 + .24 * i), col = s.cols[i];
      o += rc(cx - 11 * u, y + .04 * h, 22 * u, .8 * h, `fill="#060708" stroke="#3b3e44" stroke-width="${R(.6 * u)}"`, 8 * u)
        + rc(cx - 8.6 * u, y + .12 * h, 2.4 * u, .6 * h, `fill="#fff" fill-opacity=".14"`, 1.2 * u);
      if (CF.amb) o += rc(cx - 5.5 * u, y + .3 * h, 11 * u, .3 * h, `fill="url(#am${k})" fill-opacity=".85"`, 4 * u);
      else o += rc(cx - 5.5 * u, y + .3 * h, 11 * u, .3 * h, `fill="#1c1e22" stroke="#40444a" stroke-width="${R(.4 * u)}"`, 4 * u);
      if (col) o += rc(cx - 1 * u, y, 2 * u, .5 * h, `fill="${col}"`);
      o += `<circle cx="${R(cx)}" cy="${R(y + .72 * h)}" r="${R(1.3 * u)}" fill="${s.off ? "#2a2c30" : col && col.toLowerCase() === s.act.toLowerCase() && s.run ? "#4ade80" : col ? "#f1f5f9" : "#55595f"}"/>`;
    }
    o += rc(x, y, w, .1 * h, `fill="#fff" fill-opacity=".06"`, rx) + rc(x, y, w, h, `fill="url(#rf${k})"`, rx)
      + rc(x + .4, y + .4, w - .8, h - .8, `fill="none" stroke="#c9d1d9" stroke-opacity=".22" stroke-width=".6"`, rx);
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
  function screen(P, sx0, sy0, w, h, zt, zb, s, k) {
    const th = .035, TL = P(sx0, sy0, zt), TR = P(sx0 + w, sy0, zt), BL = P(sx0, sy0 + h, zb), BR = P(sx0 + w, sy0 + h, zb);
    let o = pg([TR, P(sx0 + w, sy0, zt + th), P(sx0 + w, sy0 + h, zb + th), BR], `fill="#26282c"`)
      + pg([TL, TR, P(sx0 + w, sy0, zt + th), P(sx0, sy0, zt + th)], `fill="#4a4d53"`);
    const m = `matrix(${R((TR[0] - TL[0]) / 100 * 1000) / 1000} ${R((TR[1] - TL[1]) / 100 * 1000) / 1000} ${R((BL[0] - TL[0]) / 60 * 1000) / 1000} ${R((BL[1] - TL[1]) / 60 * 1000) / 1000} ${R(TL[0])} ${R(TL[1])})`;
    let sc = `<rect width="100" height="60" rx="7" fill="#0e0f11" stroke="#4a4d53" stroke-width="1.2"/>`;
    if (!s.off) {
      const p = s.pct;
      sc += `<rect x="6" y="6" width="88" height="48" rx="3" fill="url(#sc${k})"/>`
        + `<rect x="11" y="12" width="24" height="24" rx="3" fill="#24324a"/><rect x="16" y="${R(33 - 16 * Math.max(p, 8) / 100)}" width="14" height="${R(16 * Math.max(p, 8) / 100)}" fill="${s.act}"/>`
        + `<rect x="40" y="14" width="34" height="5" rx="2.5" fill="#dbe4ef"/><rect x="40" y="24" width="22" height="4" rx="2" fill="#6b7a90"/>`
        + `<circle cx="83" cy="17" r="4.5" fill="#2c3b54"/><circle cx="83" cy="30" r="4.5" fill="#2c3b54"/>`
        + `<rect x="11" y="43" width="78" height="5" rx="2.5" fill="#2a3446"/>` + (s.run ? `<rect x="11" y="43" width="${R(78 * p / 100)}" height="5" rx="2.5" fill="#22c55e"/>` : "");
    } else sc += `<rect x="6" y="6" width="88" height="48" rx="3" fill="#050607"/>`;
    sc += `<polygon points="6,6 42,6 20,54 6,54" fill="#fff" opacity=".07"/>`;
    return o + `<g transform="${m}">${sc}</g>`;
  }

  function draw(o) {
    const c = CF, s = S(o), k = c.p + (++N), { X, Y, W, H, DX } = c, dark = c.pal.dark;
    const P = (x, y, z) => [x + z * DX, y + z * (c.a + (y - Y) * c.b)];
    let g = defs(k);
    const fb = P(X + W / 2, Y + H, .5);
    g += `<ellipse cx="${R(fb[0] + 2)}" cy="${R(fb[1] + 3)}" rx="${R((W + DX) / 2 + 8)}" ry="7" fill="#000" fill-opacity=".6" filter="url(#bl${k})"/>`;
    g += pg([P(X + W - 6, Y + H, .85), P(X + W, Y + H, .85), P(X + W, Y + H + 2.5, .85), P(X + W - 6, Y + H + 2.5, .85)], `fill="#0b0c0e"`);
    g += pg([P(X, Y, 0), P(X + W, Y, 0), P(X + W, Y, 1), P(X, Y, 1)], `fill="url(#bt${k})"`);
    if (c.band) g += pg([P(X + .035 * W, Y, .04), P(X + .965 * W, Y, .04), P(X + .965 * W, Y, .96), P(X + .035 * W, Y, .96)], `fill="#2b3137"`)
      + pg([P(X + .1 * W, Y, .06), P(X + .3 * W, Y, .06), P(X + .62 * W, Y, .94), P(X + .42 * W, Y, .94)], `fill="#fff" fill-opacity=".07"`);
    g += `<path d="M${pts([P(X + 2, Y, 0), P(X + W, Y, 0), P(X + W, Y, 1)]).replace(/ /g, "L")}" fill="none" stroke="#fff" stroke-opacity="${dark ? .22 : .6}" stroke-width=".7"/>`;
    g += pg([P(X + W, Y, 0), P(X + W, Y, 1), P(X + W, Y + H, 1), P(X + W, Y + H, 0)], `fill="url(#bs${k})"`);
    if (c.band) { const yb = Y + c.band * H;
      g += pg([P(X + W, Y, 0), P(X + W, Y, 1), P(X + W, yb, 1), P(X + W, yb, 0)], `fill="url(#bbs${k})"`)
        + ln(...P(X + W, yb, 0), ...P(X + W, yb, 1), `stroke="#3a3d42" stroke-opacity=".7" stroke-width=".9"`)
        + ln(...P(X + W, yb + .9, 0), ...P(X + W, yb + .9, 1), `stroke="#fff" stroke-opacity=".3" stroke-width=".6"`); }
    if (c.plinth) { const yp = Y + (1 - c.plinth) * H;
      g += pg([P(X + W, yp, 0), P(X + W, yp, 1), P(X + W, Y + H, 1), P(X + W, Y + H, 0)], `fill="${dark ? "#141517" : "#232528"}"`); }
    g += ln(...P(X + W, Y + 1, 0), ...P(X + W, Y + H - 1, 0), `stroke="#fff" stroke-opacity="${dark ? .16 : .55}" stroke-width=".9"`)
      + pg([P(X + W, Y + H - 2, 0), P(X + W, Y + H - 2, 1), P(X + W, Y + H, 1), P(X + W, Y + H, 0)], `fill="#000" fill-opacity=".2"`);
    if (c.side === "mark") {
      const yT = Y + .36 * H, yB = Y + .55 * H, h = yB - yT, zl = .44, zr = .58, mk = dark ? "#0d0e10" : "#26282c";
      g += pg([P(X + W, yT, zl), P(X + W, yT, zr), P(X + W, yT + .38 * h, zr), P(X + W, yT + .5 * h, zl)], `fill="${mk}"`)
        + pg([P(X + W, yT + .58 * h, zl), P(X + W, yT + .46 * h, zr), P(X + W, yB, zr), P(X + W, yB, zl)], `fill="${mk}"`)
        + pg([P(X + W, yB + .1 * h, zl - .05), P(X + W, yB + .1 * h, zr + .05), P(X + W, yB + .14 * h, zr + .05), P(X + W, yB + .14 * h, zl - .05)], `fill="${mk}" fill-opacity=".55"`);
    } else if (c.side === "window") {
      const y0 = Y + .085 * H, y1 = Y + .33 * H, z0 = .1, z1 = .9;
      g += pg([P(X + W, y0 - 1.2, z0 - .015), P(X + W, y0 - 1.2, z1 + .015), P(X + W, y1 + 1.2, z1 + .015), P(X + W, y1 + 1.2, z0 - .015)], `fill="#0c0d0f"`)
        + pg([P(X + W, y0, z0), P(X + W, y0, z1), P(X + W, y1, z1), P(X + W, y1, z0)], `fill="#15181c"`);
      g += pg([P(X + W, y0 + .3 * (y1 - y0), z0), P(X + W, y0 + .3 * (y1 - y0), z1), P(X + W, y0 + .42 * (y1 - y0), z1), P(X + W, y0 + .42 * (y1 - y0), z0)], `fill="#2a2e33"`)
        + pg([P(X + W, y0 + .2 * (y1 - y0), .4), P(X + W, y0 + .2 * (y1 - y0), .58), P(X + W, y0 + .75 * (y1 - y0), .58), P(X + W, y0 + .75 * (y1 - y0), .4)], `fill="#3a3e44"`);
      if (s.run) g += pg([P(X + W, y0, z0), P(X + W, y0, z1), P(X + W, y1, z1), P(X + W, y1, z0)], `fill="#ffb766" fill-opacity=".14"`);
      g += pg([P(X + W, y0, z0), P(X + W, y0, z1), P(X + W, y1, z1), P(X + W, y1, z0)], `fill="url(#sw${k})" fill-opacity=".8"`)
        + pg([P(X + W, y0, .2), P(X + W, y0, .3), P(X + W, y1, .14), P(X + W, y1, .04 + .1)], `fill="#fff" fill-opacity=".06"`);
    }
    g += front({ X, Y, W, H, k, st: s });
    const unit = o.unit || "spu";
    if (unit !== "none") {
    const am = c.spu, ht = unit === "ht", aF = (am.a1 - am.a0) * W, aw = ht ? aF * .3 : aF, a0 = X + (am.a0 + am.a1) / 2 * W - aw / 2, a1 = a0 + aw, z0 = am.z0, z1 = am.z1, b1 = Y - am.gap * H, b0 = b1 - am.bh * H, bh = b1 - b0, hD = am.hD * H, hw = (am.hw || 0) * H;
    g += pg([P(a0 + 6, b1, z0), P(a0 + 16, b1, z0), P(a0 + 16, Y, z0), P(a0 + 6, Y, z0)], `fill="#0b0c0e"`) + pg([P(a1 - 16, b1, z0), P(a1 - 6, b1, z0), P(a1 - 6, Y, z0), P(a1 - 16, Y, z0)], `fill="#0b0c0e"`);
    const zd0 = z0 + .02, zd1 = z1 - .02, zc = (zd0 + zd1) / 2, zr = (zd1 - zd0) / 2, e0 = a0 + 1.5, e1 = a1 - 1.5;
    const D = (xe, hh, za, zb, ww, bb) => { ww = ww || 0; bb = bb == null ? b0 : bb; const r = []; if (ww) r.push(P(xe, bb, za));
      for (let t = 0; t <= 16; t++) { const th = Math.PI * t / 16; r.push(P(xe, bb - ww - hh * Math.sin(th), (za + zb) / 2 - (zb - za) / 2 * Math.cos(th))); }
      if (ww) r.push(P(xe, bb, zb)); return r; };
    const DR = D(e1, hD, zd0, zd1, hw), hp = pathOf(hull(D(e0, hD, zd0, zd1, hw).concat(DR)));
    const fpT = P(a0, b0, z0), fpB = P(a0, b1, z0), tdy = ((fpT[1] - b0) + (fpB[1] - b1)) / 2;
    const fn = am.gen === 2 ? ams2Front : ams1Front;
    g += pg([P(a1, b0, z0), P(a1, b0, z1), P(a1, b1, z1), P(a1, b1, z0)], `fill="url(#sb${k})"`)
      + pg([P(a1, b0, z0), P(a1, b0, z1), P(a1, b1, z1), P(a1, b1, z0)], `fill="#000" fill-opacity=".25"`)
      + pg([P(a0, b0, z0), P(a1, b0, z0), P(a1, b0, z1), P(a0, b0, z1)], `fill="#303237"`)
      + `<g transform="translate(${R(z0 * DX)} ${R(tdy)})">${fn({ x: a0, y: b0, w: a1 - a0, h: bh, k, st: s, rx: 2.4, n: ht ? 1 : 4, u: aF / 152, led: { off: s.off, run: s.run, err: !!(o && o.err), slot: o && Number.isInteger(o.slot) ? o.slot : null } })}</g>`
      + ln(...P(a1, b0 + .5, z0), ...P(a1, b1 - .5, z0), `stroke="#fff" stroke-opacity=".14" stroke-width=".7"`);
    const t0 = P(a1 - Math.min(18, (a1 - a0) * .3), b0 + bh * .5, z1 + .02), t1 = P(X + .93 * W, Y, .97);
    const tp = `M${R(t0[0])} ${R(t0[1])}C${R(t0[0] + 34)} ${R(t0[1] - 6)} ${R(t1[0] + 16)} ${R(t1[1] - 8)} ${R(t1[0])} ${R(t1[1])}`;
    g += `<path d="${tp}" fill="none" stroke="#e9edf1" stroke-opacity=".55" stroke-width="1.9" stroke-linecap="round"/><path d="${tp}" fill="none" stroke="#8b949e" stroke-opacity=".6" stroke-width=".5"/>`;
    g += `<clipPath id="cd${k}"><path d="${hp}"/></clipPath><path d="${hp}" fill="#0c0d10" fill-opacity=".72"/><g clip-path="url(#cd${k})">`;
    const x0s = a0 + 5, x1s = a1 - 5;
    g += spools3(P, x0s, x1s, b0 + .04 * hD, .9 * hD, zc, zr * .88, ht ? [s.cols[0]] : s.cols);
    g += `<path d="${hp}" fill="#1b1f24" fill-opacity="${am.gen === 2 ? .2 : .28}"/><path d="${hp}" fill="url(#dg${k})"/>`
      + pg([P(e0 + 5, b0 - hw - hD * .87, zc - zr * .5), P(e1, b0 - hw - hD * .87, zc - zr * .5), P(e1, b0 - hw - hD * .97, zc - zr * .25), P(e0 + 5, b0 - hw - hD * .97, zc - zr * .25)], `fill="#fff" fill-opacity=".2"`)
      + pg([P(e0 + 8, b0 - hw * .5 - hD * .45, zd0 + .02), P(e1 - 10, b0 - hw * .5 - hD * .45, zd0 + .02), P(e1 - 10, b0 - hw * .5 - hD * .55, zd0 + .03), P(e0 + 8, b0 - hw * .5 - hD * .55, zd0 + .03)], `fill="#fff" fill-opacity=".07"`);
    if (hw) g += pg([P(e0, b0, zd0), P(e1, b0, zd0), P(e1, b0 - hw * .55, zd0), P(e0, b0 - hw * .55, zd0)], `fill="#0d0f12" fill-opacity=".45"`)
      + ln(...P(e0, b0 - hw * .55, zd0), ...P(e1, b0 - hw * .55, zd0), `stroke="#e8edf2" stroke-opacity=".22" stroke-width=".6"`);
    g += "</g>";
    g += `<path d="${pathOf(DR)}" fill="#fff" fill-opacity=".05" stroke="#e8edf2" stroke-opacity=".32" stroke-width=".7"/>`
      + `<path d="${hp}" fill="none" stroke="#e8edf2" stroke-opacity=".3" stroke-width=".7"/>`;
    }
    const sc = c.scr;
    if (sc.stalk) { const n0 = P(X + (sc.x + sc.w * .55) * W, Y + .01 * H, .02);
      g += pg([[n0[0] - 3, n0[1] - 3], [n0[0] + 6, n0[1] - 5], [n0[0] + 6, n0[1] + 1], [n0[0] - 3, n0[1] + 2]], `fill="#121316"`); }
    g += screen(P, X + sc.x * W, Y + sc.y * H, sc.w * W, sc.h * H, sc.zt, sc.zb, s, k);
    const vb = c.vb;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="3D printer"><g${s.off ? ` filter="url(#gr${k})"` : ""}>${g}</g></svg>`;
  }

  window.HDAPA.boxa = function (o) { return draw(o || {}); };
})();
