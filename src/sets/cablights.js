
(function () {
  const H = window.HDAH, P = "hda-cablights-";
  const f = (n) => (+n).toFixed(1);
  const cl = (v) => Math.max(0, Math.min(1, v));
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const E = (cx, cy, rx, ry, fill, more) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${more || ""}/>`;
  const R = (x, y, w, h, fill, more) => `<rect x="${f(x)}" y="${f(y)}" width="${f(Math.max(0, w))}" height="${f(Math.max(0, h))}" fill="${fill}" ${more || ""}/>`;
  const poly = (pts) => pts.map((p) => f(p[0]) + "," + f(p[1])).join(" ");
  const PG = (pts, fill, more) => `<polygon points="${poly(pts)}" fill="${fill}" ${more || ""}/>`;

  function ctx(o, def) {
    const c = o.color || def.colors[0], on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const c2 = o.color2 || def.colors2[0];
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const rgb = H.hx(c2), wood = Math.max(...rgb) - Math.min(...rgb) > 28;
    return { c, c2, on, L, lv, wood, anim: !!o.anim, opt: o.opt || {}, parts: o.parts, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => cl(k * L).toFixed(2) };
  }

  function defs(x, extra) {
    const { c, c2, id, hot } = x, S = H.shade;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("halo"), [[0, c, .85], [.45, c, .3], [1, c, 0]])}
${rg(id("pool"), [[0, hot, .8], [.4, c, .45], [1, c, 0]])}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${lg(id("beam"), [[0, hot, .75], [.35, c, .38], [1, c, 0]], 0, 0, 0, 1)}
${lg(id("wash"), [[0, hot, .5], [.5, c, .22], [1, c, .04]], 0, 0, 0, 1)}
${lg(id("wall"), [[0, "#4a4750"], [1, "#2e2c34"]], 0, 0, 0, 1)}
${lg(id("wood"), [[0, "#8a6440"], [.12, "#6e4e30"], [1, "#3a2818"]], 0, 0, 0, 1)}
${lg(id("fr"), [[0, S(c2, -.32)], [.2, S(c2, .14)], [.45, c2], [1, S(c2, -.4)]])}
${lg(id("frv"), [[0, S(c2, .2)], [.3, c2], [1, S(c2, -.38)]], 0, 0, 0, 1)}
${lg(id("frd"), [[0, S(c2, -.25)], [1, S(c2, -.55)]], 0, 0, 0, 1)}
${lg(id("mir"), [[0, "#8a929c"], [.45, "#4c525a"], [1, "#666d75"]], 0, 0, 1, 1)}
${lg(id("dark"), [[0, "#24232b"], [1, "#121117"]], 0, 0, 0, 1)}
${lg(id("bead"), [[0, S(c2, -.08)], [1, S(c2, -.32)]], 0, 0, 0, 1)}
${lg(id("gls"), [[0, "#fff", .12], [.35, "#fff", .02], [.52, "#fff", .09], [.62, "#fff", .01], [1, "#fff", .05]], 0, 0, 1, 1)}
${lg(id("glint"), [[0, "#fff", 0], [.5, "#fff", .22], [1, "#fff", 0]])}
${lg(id("figsh"), [[0, "#fff", .32], [.3, "#fff", .04], [.62, "#000", .05], [1, "#000", .42]])}
${lg(id("gold"), [[0, "#7a5418"], [.25, "#f6dc8a"], [.5, "#d4a640"], [.8, "#8a5e1a"], [1, "#5a3c10"]])}
${lg(id("silv"), [[0, "#5d636b"], [.28, "#f2f4f6"], [.5, "#b9bfc6"], [.8, "#7a8088"], [1, "#4a4f56"]])}
${lg(id("chrome"), [[0, "#f4f6f8"], [.5, "#9aa1a9"], [1, "#5d636b"]], 0, 0, 0, 1)}
${lg(id("stone"), [[0, "#d9d4cc"], [1, "#9a948c"]], 0, 0, 0, 1)}
${extra || ""}</defs>`;
  }
  function svg(x, s) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, s.defs)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g>${s.fx || ""}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }

  
  const wallBg = (x, y0, y1, seed) => `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${x.url("wall")}"/>` + (() => { const r = rnd(seed || 7); let s = ""; for (let i = 0; i < 36; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(y0 + 2 + r() * (y1 - y0 - 4))}" r="${f(.3 + r() * .6)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .07).toFixed(2)}"/>`; return s; })();
  function floorBoards(x, y0) {
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("wood")}"/><rect x="8" y="${y0 - 5}" width="184" height="5" fill="#d8d4cc" fill-opacity=".42"/><rect x="8" y="${y0 - 5}" width="184" height="1" fill="#fff" fill-opacity=".2"/>`;
    for (let i = -6; i <= 26; i++) { const bx = 8 + i * 9; s += `<path d="M${f(100 + (bx - 100) * .6)} ${y0} L${f(bx + (bx - 100) * .35)} 192" stroke="#000" stroke-opacity=".28" stroke-width=".8"/>`; }
    return s;
  }
  const room = (x, fy, seed) => wallBg(x, 8, fy - 5, seed) + floorBoards(x, fy);
  
  const wallHalo = (x, cx, cy, rx, ry) => x.on ? E(cx, cy, rx, ry, x.url("halo"), `opacity="${x.op(.32)}"`) : "";

  
  const grain = (x, gx, gy, w, h, seed) => {
    if (!x.wood || w < 3 || h < 3) return "";
    const r = rnd(seed || 3); let s = "";
    const vert = h > w;
    for (let i = 0; i < (vert ? Math.max(1, w / 2.2) : Math.max(1, h / 2.2)); i++) {
      if (vert) { const gx2 = gx + .8 + r() * (w - 1.6); s += `<path d="M${f(gx2)} ${f(gy)} q${f((r() - .5) * 1.6)} ${f(h / 2)} 0 ${f(h)}" stroke="#000" stroke-opacity="${(.08 + r() * .1).toFixed(2)}" stroke-width=".5" fill="none"/>`; }
      else { const gy2 = gy + .8 + r() * (h - 1.6); s += `<path d="M${f(gx)} ${f(gy2)} q${f(w / 2)} ${f((r() - .5) * 1.6)} ${f(w)} 0" stroke="#000" stroke-opacity="${(.08 + r() * .1).toFixed(2)}" stroke-width=".5" fill="none"/>`; }
    }
    return s;
  };
  const post = (x, px, py, w, h, seed) => R(px, py, w, h, x.url("fr")) + grain(x, px, py, w, h, seed) + R(px, py, .7, h, "#fff", 'fill-opacity=".12"');
  const rail = (x, px, py, w, h, seed) => R(px, py, w, h, x.url("frv")) + grain(x, px, py, w, h, seed) + R(px, py, w, .7, "#fff", 'fill-opacity=".16"');
  
  const crown = (x, cx, y, w) => rail(x, cx - w / 2 - 5, y, w + 10, 3.2, 11) + rail(x, cx - w / 2 - 3, y + 3.2, w + 6, 2.6, 12) + R(cx - w / 2 - 3, y + 5.8, w + 6, .8, "#000", 'fill-opacity=".35"') + rail(x, cx - w / 2 - 1.5, y + 6.6, w + 3, 3.2, 13);
  const bunFoot = (x, cx, y) => E(cx, y + 2.6, 3.6, 3, x.url("frv")) + E(cx - 1, y + 1.6, 1.4, .8, "#fff", 'fill-opacity=".18"');
  const knob = (cx, cy) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="1.5" fill="#c9a24a"/><circle cx="${f(cx - .4)}" cy="${f(cy - .5)}" r=".5" fill="#fff6d8" fill-opacity=".8"/>`;
  const hinge = (hx, hy) => R(hx, hy, 1.4, 4, "#c9a24a") + R(hx, hy, .5, 4, "#fff6d8", 'fill-opacity=".5"');
  
  function pane(x, pts, clipId, k) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
    return PG(pts, x.url("gls"), `opacity="${k == null ? 1 : k}"`) +
      `<g clip-path="${x.url(clipId)}">` +
      PG([[x0 + w * .1, y0], [x0 + w * .26, y0], [x0 + w * .02, y0 + h * .55], [x0 - w * .14, y0 + h * .55]], "#fff", 'fill-opacity=".05"') +
      PG([[x0 + w * .62, y1], [x0 + w * .72, y1], [x0 + w * .98, y0 + h * .35], [x0 + w * .88, y0 + h * .35]], "#fff", 'fill-opacity=".035"') +
      `<g class="${P}glint">` + PG([[x0 - w * .35, y1], [x0 - w * .2, y1], [x0 + w * .05, y0], [x0 - w * .1, y0]], x.url("glint")) + `</g></g>` +
      `<polyline points="${poly(pts.concat([pts[0]]))}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width=".5"/>`;
  }

  
  const FIG = ["#efe9dc", "#c49a5a", "#5f86c0", "#c0504d", "#6aa36a", "#d8b94a", "#8a6ab8"];
  const BOOK = ["#7a2e2e", "#2e4a6e", "#3e5a3a", "#8a6a3a", "#4a3a5a", "#c8b48a", "#1f3a3a", "#9a4a2a", "#5a5f6a"];
  function contents(x, kind, xL, xR, ys, hh, hl, j) {
    if (kind === "empty" || hh < 4 || xR - xL < 8) return "";
    const w = xR - xL, hot = x.hot, r = rnd(31 + j * 17);
    const ho = (k) => cl(hl * (k == null ? 1 : k)).toFixed(2);
    const rim = (d, k, sw) => hl > .02 ? `<path d="${d}" fill="none" stroke="${hot}" stroke-opacity="${ho(k)}" stroke-width="${sw || .8}" stroke-linecap="round"/>` : "";
    const shd = (cx, rx) => E(cx, ys + .4, rx, Math.max(.8, rx * .22), "#000", 'fill-opacity=".38"');
    const sh2 = (d) => `<path d="${d}" fill="${x.url("figsh")}"/>`;
    let s = "";
    if (kind === "figures") {
      const n = Math.max(2, Math.min(5, Math.floor(w / 19)));
      for (let i = 0; i < n; i++) {
        const cx = xL + w * (i + .5) / n, t = (i + j) % 3, col = FIG[(i * 3 + j * 2) % FIG.length], z = hh * (.82 + r() * .18);
        s += shd(cx, z * .2);
        if (t === 0) { 
          const body = `M${f(cx - z * .15)} ${f(ys - z * .1)} C${f(cx - z * .18)} ${f(ys - z * .42)} ${f(cx - z * .05)} ${f(ys - z * .6)} ${f(cx - z * .07)} ${f(ys - z * .72)} L${f(cx + z * .07)} ${f(ys - z * .72)} C${f(cx + z * .05)} ${f(ys - z * .6)} ${f(cx + z * .18)} ${f(ys - z * .42)} ${f(cx + z * .15)} ${f(ys - z * .1)} Z`;
          s += R(cx - z * .19, ys - z * .1, z * .38, z * .1, "#3a2a20") + R(cx - z * .19, ys - z * .1, z * .38, .6, "#fff", 'fill-opacity=".2"') +
            `<path d="${body}" fill="${col}"/>` + sh2(body) + `<circle cx="${f(cx)}" cy="${f(ys - z * .82)}" r="${f(z * .1)}" fill="${col}"/><circle cx="${f(cx)}" cy="${f(ys - z * .82)}" r="${f(z * .1)}" fill="${x.url("figsh")}"/>` +
            rim(`M${f(cx - z * .07)} ${f(ys - z * .9)} A${f(z * .1)} ${f(z * .1)} 0 0 1 ${f(cx + z * .06)} ${f(ys - z * .9)} M${f(cx - z * .07)} ${f(ys - z * .7)} C${f(cx - z * .05)} ${f(ys - z * .6)} ${f(cx - z * .18)} ${f(ys - z * .42)} ${f(cx - z * .15)} ${f(ys - z * .14)}`);
        } else if (t === 1) { 
          const body = `M${f(cx - z * .07)} ${f(ys - z * .78)} L${f(cx + z * .07)} ${f(ys - z * .78)} C${f(cx + z * .06)} ${f(ys - z * .62)} ${f(cx + z * .22)} ${f(ys - z * .52)} ${f(cx + z * .2)} ${f(ys - z * .26)} C${f(cx + z * .18)} ${f(ys - z * .06)} ${f(cx + z * .1)} ${f(ys)} ${f(cx)} ${f(ys)} C${f(cx - z * .1)} ${f(ys)} ${f(cx - z * .18)} ${f(ys - z * .06)} ${f(cx - z * .2)} ${f(ys - z * .26)} C${f(cx - z * .22)} ${f(ys - z * .52)} ${f(cx - z * .06)} ${f(ys - z * .62)} ${f(cx - z * .07)} ${f(ys - z * .78)} Z`;
          s += `<path d="${body}" fill="${col}"/>` + sh2(body) + E(cx, ys - z * .78, z * .09, z * .03, H.shade(col, -.5)) +
            `<path d="M${f(cx - z * .19)} ${f(ys - z * .36)} Q${f(cx)} ${f(ys - z * .3)} ${f(cx + z * .19)} ${f(ys - z * .36)}" stroke="${H.shade(col, -.35)}" stroke-width="${f(Math.max(.6, z * .04))}" fill="none"/>` +
            rim(`M${f(cx - z * .06)} ${f(ys - z * .7)} C${f(cx - z * .1)} ${f(ys - z * .58)} ${f(cx - z * .2)} ${f(ys - z * .5)} ${f(cx - z * .19)} ${f(ys - z * .3)}`, 1, 1) +
            (hl > .02 ? `<circle cx="${f(cx - z * .1)}" cy="${f(ys - z * .42)}" r="${f(z * .035)}" fill="#fff" fill-opacity="${ho(.9)}"/>` : "");
        } else { 
          const zz = z * .92, b = ys - zz * .06;
          const torso = `M${f(cx - zz * .11)} ${f(b - zz * .62)} L${f(cx + zz * .11)} ${f(b - zz * .62)} L${f(cx + zz * .09)} ${f(b - zz * .34)} L${f(cx - zz * .09)} ${f(b - zz * .34)} Z`;
          s += E(cx, b + zz * .02, zz * .17, zz * .05, "#cfe6ee", 'fill-opacity=".35" stroke="#fff" stroke-opacity=".3" stroke-width=".4"') +
            `<path d="M${f(cx - zz * .07)} ${f(b - zz * .34)} L${f(cx - zz * .09)} ${f(b)} M${f(cx + zz * .07)} ${f(b - zz * .34)} L${f(cx + zz * .1)} ${f(b)}" stroke="${H.shade(col, -.45)}" stroke-width="${f(zz * .08)}" stroke-linecap="round"/>` +
            `<path d="${torso}" fill="${col}"/>` + sh2(torso) +
            `<path d="M${f(cx - zz * .11)} ${f(b - zz * .58)} L${f(cx - zz * .2)} ${f(b - zz * .4)} M${f(cx + zz * .11)} ${f(b - zz * .58)} L${f(cx + zz * .22)} ${f(b - zz * .74)}" stroke="${col}" stroke-width="${f(zz * .065)}" stroke-linecap="round"/>` +
            `<circle cx="${f(cx)}" cy="${f(b - zz * .74)}" r="${f(zz * .1)}" fill="#e9c9a6"/><path d="M${f(cx - zz * .11)} ${f(b - zz * .76)} Q${f(cx)} ${f(b - zz * .92)} ${f(cx + zz * .11)} ${f(b - zz * .76)} Z" fill="${H.shade(col, -.55)}"/>` +
            rim(`M${f(cx - zz * .09)} ${f(b - zz * .82)} Q${f(cx)} ${f(b - zz * .9)} ${f(cx + zz * .08)} ${f(b - zz * .83)} M${f(cx - zz * .11)} ${f(b - zz * .62)} L${f(cx + zz * .1)} ${f(b - zz * .62)}`);
        }
      }
    } else if (kind === "dishes") {
      const pr = Math.min(hh * .46, w * .17);
      const plate = (cx) => { const cy = ys - pr - .8;
        return `<path d="M${f(cx - pr * .5)} ${f(ys)} L${f(cx - pr * .2)} ${f(cy + pr * .4)} M${f(cx + pr * .5)} ${f(ys)} L${f(cx + pr * .2)} ${f(cy + pr * .4)}" stroke="#2a2420" stroke-width=".7"/>` +
          `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(pr)}" fill="#f3efe6"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(pr * .84)}" fill="none" stroke="#3d5f9a" stroke-width="${f(pr * .12)}" stroke-dasharray="${f(pr * .22)} ${f(pr * .1)}"/>` +
          `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(pr * .56)}" fill="#e6dfd0" stroke="#cbc2ae" stroke-width=".5"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(pr * .22)}" fill="none" stroke="#3d5f9a" stroke-opacity=".7" stroke-width=".5"/>` +
          `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(pr)}" fill="${x.url("figsh")}"/>` +
          rim(`M${f(cx - pr * .74)} ${f(cy - pr * .66)} A${f(pr)} ${f(pr)} 0 0 1 ${f(cx + pr * .3)} ${f(cy - pr * .95)}`, 1, 1.1); };
      const bowls = (cx) => { let t = shd(cx, pr * .7); const bw = Math.min(pr * .95, hh * .42);
        for (let k = 0; k < 3; k++) { const by = ys - k * bw * .3; const d = `M${f(cx - bw)} ${f(by - bw * .4)} Q${f(cx - bw * .95)} ${f(by)} ${f(cx)} ${f(by)} Q${f(cx + bw * .95)} ${f(by)} ${f(cx + bw)} ${f(by - bw * .4)} Z`;
          t += `<path d="${d}" fill="#f0ebe1"/>` + sh2(d) + E(cx, by - bw * .4, bw, bw * .1, "#d9d1c1") + `<path d="M${f(cx - bw * .9)} ${f(by - bw * .3)} Q${f(cx)} ${f(by - bw * .18)} ${f(cx + bw * .9)} ${f(by - bw * .3)}" stroke="#3d5f9a" stroke-width=".6" fill="none"/>`; }
        const top = ys - 2 * bw * .3 - bw * .4;
        return t + rim(`M${f(cx - bw)} ${f(top)} Q${f(cx)} ${f(top - bw * .12)} ${f(cx + bw)} ${f(top)}`, 1, 1); };
      s += plate(xL + w * .2) + plate(xL + w * .8) + bowls(xL + w * .5);
    } else if (kind === "glass") {
      const n = Math.max(3, Math.min(6, Math.floor(w / 13)));
      for (let i = 0; i < n; i++) {
        const cx = xL + w * (i + .5) / n, t = (i + j) % 3, z = hh * (t === 2 ? .55 : .95);
        const st = hl > .02 ? H.mix("#ffffff", hot, .5) : "#ffffff", so = hl > .02 ? (.45 + .5 * hl).toFixed(2) : ".42";
        if (t === 2) { 
          const d = `M${f(cx - z * .28)} ${f(ys - z)} L${f(cx + z * .28)} ${f(ys - z)} L${f(cx + z * .23)} ${f(ys)} L${f(cx - z * .23)} ${f(ys)} Z`;
          s += `<path d="${d}" fill="#dff2f6" fill-opacity=".12" stroke="${st}" stroke-opacity="${so}" stroke-width=".55"/>` + R(cx - z * .23, ys - z * .16, z * .46, z * .16, "#dff2f6", 'fill-opacity=".28"') +
            rim(`M${f(cx - z * .17)} ${f(ys - z * .88)} L${f(cx - z * .14)} ${f(ys - z * .25)}`, 1.1, 1);
        } else { 
          const bw = t === 1 ? .09 : .16;
          const bowl = `M${f(cx - z * bw)} ${f(ys - z)} C${f(cx - z * (bw + .02))} ${f(ys - z * .64)} ${f(cx - z * .05)} ${f(ys - z * .48)} ${f(cx)} ${f(ys - z * .47)} C${f(cx + z * .05)} ${f(ys - z * .48)} ${f(cx + z * (bw + .02))} ${f(ys - z * .64)} ${f(cx + z * bw)} ${f(ys - z)} Z`;
          s += E(cx, ys, z * .13, z * .03, "#dff2f6", `fill-opacity=".3" stroke="${st}" stroke-opacity="${so}" stroke-width=".4"`) +
            `<path d="M${f(cx)} ${f(ys)} V${f(ys - z * .47)}" stroke="${st}" stroke-opacity="${so}" stroke-width=".7"/>` +
            `<path d="${bowl}" fill="#dff2f6" fill-opacity=".12" stroke="${st}" stroke-opacity="${so}" stroke-width=".55"/>` +
            (t === 0 && j % 2 ? `<path d="M${f(cx - z * .145)} ${f(ys - z * .72)} C${f(cx - z * .1)} ${f(ys - z * .52)} ${f(cx + z * .1)} ${f(ys - z * .52)} ${f(cx + z * .145)} ${f(ys - z * .72)} Z" fill="#8a1a2a" fill-opacity=".75"/>` : "") +
            rim(`M${f(cx - z * (bw - .04))} ${f(ys - z * .94)} C${f(cx - z * (bw - .03))} ${f(ys - z * .7)} ${f(cx - z * .04)} ${f(ys - z * .56)} ${f(cx - z * .02)} ${f(ys - z * .53)}`, 1.1, 1);
        }
      }
    } else if (kind === "trophies") {
      const pos = [[.2, .76, "silv"], [.5, 1, "gold"], [.8, .7, "gold"]];
      if (w > 70) pos.push([.35, .55, "silv"]);
      pos.sort((a, b) => a[1] - b[1]);
      pos.forEach(([u, k, m]) => {
        const cx = xL + w * u, z = hh * k * .98, bw = z * .2;
        const cup = `M${f(cx - z * .2)} ${f(ys - z)} L${f(cx + z * .2)} ${f(ys - z)} C${f(cx + z * .2)} ${f(ys - z * .62)} ${f(cx + z * .08)} ${f(ys - z * .5)} ${f(cx + z * .04)} ${f(ys - z * .46)} L${f(cx - z * .04)} ${f(ys - z * .46)} C${f(cx - z * .08)} ${f(ys - z * .5)} ${f(cx - z * .2)} ${f(ys - z * .62)} ${f(cx - z * .2)} ${f(ys - z)} Z`;
        s += shd(cx, bw * 1.1) + R(cx - bw, ys - z * .18, bw * 2, z * .18, "#3b2a1f") + R(cx - bw, ys - z * .18, bw * 2, .6, "#fff", 'fill-opacity=".2"') + R(cx - bw * .55, ys - z * .1, bw * 1.1, z * .05, x.url("gold"), 'fill-opacity=".85"') +
          R(cx - bw * .55, ys - z * .26, bw * 1.1, z * .08, x.url(m)) + R(cx - z * .03, ys - z * .47, z * .06, z * .22, x.url(m)) +
          `<path d="M${f(cx - z * .19)} ${f(ys - z * .92)} C${f(cx - z * .36)} ${f(ys - z * .92)} ${f(cx - z * .34)} ${f(ys - z * .66)} ${f(cx - z * .12)} ${f(ys - z * .62)} M${f(cx + z * .19)} ${f(ys - z * .92)} C${f(cx + z * .36)} ${f(ys - z * .92)} ${f(cx + z * .34)} ${f(ys - z * .66)} ${f(cx + z * .12)} ${f(ys - z * .62)}" stroke="${m === "gold" ? "#b8892c" : "#9aa0a8"}" stroke-width="${f(Math.max(.6, z * .045))}" fill="none"/>` +
          `<path d="${cup}" fill="${x.url(m)}"/>` + E(cx, ys - z, z * .2, z * .035, m === "gold" ? "#6a4a14" : "#4a4f56") +
          rim(`M${f(cx - z * .2)} ${f(ys - z)} A${f(z * .2)} ${f(z * .035)} 0 0 0 ${f(cx + z * .2)} ${f(ys - z)}`, 1, 1.1) +
          (hl > .02 ? `<circle cx="${f(cx - z * .1)}" cy="${f(ys - z * .8)}" r="${f(Math.max(.6, z * .04))}" fill="#fff" fill-opacity="${ho(1)}"/>` : "");
      });
    } else if (kind === "books") {
      let bx = xL + 1; const gapAt = xL + w * (.55 + (j % 2) * .15); let k = j * 3, gapDone = false;
      while (bx < xR - 3) {
        if (!gapDone && bx > gapAt) { 
          gapDone = true; const vz = hh * .6, cx = bx + 6;
          const d = `M${f(cx - vz * .14)} ${f(ys)} C${f(cx - vz * .3)} ${f(ys - vz * .5)} ${f(cx - vz * .05)} ${f(ys - vz * .7)} ${f(cx - vz * .06)} ${f(ys - vz)} L${f(cx + vz * .06)} ${f(ys - vz)} C${f(cx + vz * .05)} ${f(ys - vz * .7)} ${f(cx + vz * .3)} ${f(ys - vz * .5)} ${f(cx + vz * .14)} ${f(ys)} Z`;
          s += shd(cx, 4) + `<path d="${d}" fill="#d9cbb2"/>` + sh2(d) + rim(`M${f(cx - vz * .05)} ${f(ys - vz * .9)} C${f(cx - vz * .1)} ${f(ys - vz * .6)} ${f(cx - vz * .25)} ${f(ys - vz * .5)} ${f(cx - vz * .14)} ${f(ys - vz * .12)}`);
          bx += 12; continue;
        }
        const bw = 2.6 + r() * 2.8, bh = hh * (.72 + r() * .3), col = BOOK[k++ % BOOK.length];
        if (bx + bw > xR - 1) break;
        s += R(bx, ys - bh, bw, bh, col) + R(bx + bw - .7, ys - bh, .7, bh, "#000", 'fill-opacity=".35"') + R(bx, ys - bh, .5, bh, "#fff", 'fill-opacity=".14"') +
          R(bx + .3, ys - bh + bh * .12, bw - .6, .6, "#d8b860", 'fill-opacity=".7"') + R(bx + .3, ys - bh * .2, bw - .6, .6, "#d8b860", 'fill-opacity=".55"') +
          (hl > .02 ? R(bx, ys - bh, bw, .7, hot, `fill-opacity="${ho(.9)}"`) : "");
        bx += bw + .25;
      }
    } else if (kind === "bottles") {
      const n = Math.max(3, Math.min(6, Math.floor(w / 14)));
      const T = [["#1e3a24", .95, "#7a1a22"], ["#8a4a14", .8, "#1a1a1a"], ["#bcdce4", .9, "#c9a24a"], ["#2a1c14", .95, "#c9a24a"], ["#c8707e", .85, "#e8e0d0"]];
      for (let i = 0; i < n; i++) {
        const cx = xL + w * (i + .5) / n, [col, k, cap] = T[(i + j * 2) % T.length], z = hh * k, bw = Math.min(z * .13, w / n * .36), sq = col === "#8a4a14";
        const clear = col === "#bcdce4";
        const body = sq ? `M${f(cx - bw * 1.15)} ${f(ys)} V${f(ys - z * .62)} Q${f(cx - bw * 1.15)} ${f(ys - z * .7)} ${f(cx - bw * .4)} ${f(ys - z * .72)} V${f(ys - z * .92)} H${f(cx + bw * .4)} V${f(ys - z * .72)} Q${f(cx + bw * 1.15)} ${f(ys - z * .7)} ${f(cx + bw * 1.15)} ${f(ys - z * .62)} V${f(ys)} Z`
          : `M${f(cx - bw)} ${f(ys)} V${f(ys - z * .56)} C${f(cx - bw)} ${f(ys - z * .7)} ${f(cx - bw * .35)} ${f(ys - z * .72)} ${f(cx - bw * .35)} ${f(ys - z * .8)} V${f(ys - z * .96)} H${f(cx + bw * .35)} V${f(ys - z * .8)} C${f(cx + bw * .35)} ${f(ys - z * .72)} ${f(cx + bw)} ${f(ys - z * .7)} ${f(cx + bw)} ${f(ys - z * .56)} V${f(ys)} Z`;
        const top = sq ? ys - z * .92 : ys - z * .96;
        s += shd(cx, bw * 1.2) + `<path d="${body}" fill="${col}" fill-opacity="${clear ? .45 : .96}" ${clear ? 'stroke="#fff" stroke-opacity=".4" stroke-width=".4"' : ""}/>` + sh2(body) +
          R(cx - bw * (sq ? 1.15 : 1), ys - z * .44, bw * (sq ? 2.3 : 2), z * .2, "#efe6d0", 'fill-opacity=".9"') + R(cx - bw * .4, top - z * .02, bw * .8, z * .1, cap) +
          `<path d="M${f(cx - bw * .55)} ${f(ys - z * .08)} V${f(ys - z * .54)}" stroke="#fff" stroke-opacity="${hl > .02 ? ho(.95) : ".22"}" stroke-width="${f(Math.max(.5, bw * .28))}" stroke-linecap="round" ${hl > .02 ? `style="stroke:${hot}"` : ""}/>` +
          rim(`M${f(cx - bw * .3)} ${f(top)} H${f(cx + bw * .3)}`, 1, 1);
      }
    }
    return s;
  }

  
  function interior(x, g, def) {
    const { ix, iy, iw, ih } = g, n = g.n, k = g.k || .8;
    const V = { x: ix + iw / 2, y: iy + ih * (g.vy == null ? .3 : g.vy) };
    const B = (px, py, kk) => [V.x + (px - V.x) * (kk || k), V.y + (py - V.y) * (kk || k)];
    const kc = k - .14, ko = .9;
    const fl = g.corner ? [ix + iw * .26, ix + iw * .74] : null; 
    
    const shelfPts = (y) => g.corner
      ? [B(ix, y, ko), [fl[0], y], [fl[1], y], B(ix + iw, y, ko), B(V.x, y, kc)]
      : [[ix, y], [ix + iw, y], B(ix + iw, y), B(ix, y)];
    const frontPts = (y) => g.corner ? [B(ix, y, ko), [fl[0], y], [fl[1], y], B(ix + iw, y, ko)] : [[ix, y], [ix + iw, y]];
    const backY = (y) => g.corner ? B(V.x, y, kc)[1] : B(ix, y)[1];
    const type = x.opt.light || def.options[0].values[0][0];
    const kind = x.opt.fill || def.fillDefault;
    const woodShelf = g.shelf === "wood";
    const per = !!def.parts;
    const lit = (j) => { if (!x.on) return 0; if (per && x.parts) return x.parts["s" + (j + 1)] ? 1 : 0; return 1; };
    const top = type === "puck" || type === "spot";
    const each = per || woodShelf; 
    const I = []; for (let j = 0; j < n; j++) I.push(lit(j) * (top && !each ? Math.pow(.8, j) : 1));
    const yT = (j) => iy + ih * j / n, yB = (j) => iy + ih * (j + 1) / n;
    const S = H.shade, c2 = x.c2;
    let s = "";
    
    const bpts = g.corner ? null : [B(ix, iy), B(ix + iw, iy), B(ix + iw, iy + ih), B(ix, iy + ih)];
    const backFill = (pts, side) => {
      if (g.back === "mirror") return PG(pts, x.url("mir"), side ? `opacity="${side > 0 ? .78 : 1}"` : "");
      if (g.back === "bead") { let t = PG(pts, x.url("bead"), side > 0 ? 'opacity=".85"' : ""); const x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0])), y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1])); for (let bx = x0 + 4; bx < x1; bx += 4) t += `<path d="M${f(bx)} ${f(y0)} V${f(y1)}" stroke="#000" stroke-opacity=".22" stroke-width=".5"/>`; return t; }
      if (g.back === "wall") return PG(pts, "#56525c") + PG(pts, x.url("frd"), 'opacity=".25"');
      return PG(pts, x.url("dark"));
    };
    if (g.corner) {
      const cT = B(V.x, iy, kc), cB = B(V.x, iy + ih, kc);
      s += backFill([B(ix, iy, ko), cT, cB, B(ix, iy + ih, ko)], -1) + backFill([cT, B(ix + iw, iy, ko), B(ix + iw, iy + ih, ko), cB], 1) +
        `<path d="M${f(cT[0])} ${f(cT[1])} V${f(cB[1])}" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>`;
    } else {
      s += backFill(bpts, 0);
      if (g.back === "mirror") s += PG([[bpts[0][0] + 6, bpts[0][1]], [bpts[0][0] + 14, bpts[0][1]], [bpts[0][0] + 2, bpts[3][1]], [bpts[0][0] - 6, bpts[3][1]]], "#fff", 'fill-opacity=".06"');
      
      const side = g.sides === "glass" ? `fill="#9aa4ae" fill-opacity=".14"` : `fill="${S(c2, -.4)}"`;
      s += `<polygon points="${poly([[ix, iy], B(ix, iy), B(ix, iy + ih), [ix, iy + ih]])}" ${side}/><polygon points="${poly([[ix + iw, iy], B(ix + iw, iy), B(ix + iw, iy + ih), [ix + iw, iy + ih]])}" ${side}/>` +
        PG([[ix, iy], [ix + iw, iy], B(ix + iw, iy), B(ix, iy)], S(c2, -.5));
      if (g.sides === "glass") s += `<path d="M${f(B(ix, iy)[0])} ${f(B(ix, iy)[1])} V${f(B(ix, iy + ih)[1])} M${f(B(ix + iw, iy)[0])} ${f(B(ix + iw, iy)[1])} V${f(B(ix + iw, iy + ih)[1])}" stroke="#fff" stroke-opacity=".12" stroke-width=".5"/>`;
    }
    
    for (let j = 0; j < n; j++) {
      const y = yB(j), bottom = j === n - 1, pts = shelfPts(y);
      if (bottom) s += PG(pts, g.back === "mirror" ? x.url("mir") : S(c2, -.22), g.back === "mirror" ? 'opacity=".8"' : "");
      else if (woodShelf) s += PG(pts, S(c2, -.12));
      else s += PG(pts, "#bfe3e8", 'fill-opacity=".1"');
    }
    
    const items = [];
    for (let j = 0; j < n; j++) {
      const y = yB(j), by = backY(y), ys = y + (by - y) * (kind === "books" ? .7 : .45);
      const ceilY = yT(j) + (j === 0 ? (g.topInset || 0) : 0) + (woodShelf && j > 0 ? 4 : 1.5);
      const hh = Math.min((ys - ceilY) * .8, 34);
      const pad = (g.xpad || 6) + (g.corner ? iw * .06 : 0);
      const hl = I[j] * x.L;
      items.push(contents(x, kind, ix + pad, ix + iw - pad, ys, hh, hl, j));
    }
    s += items.join("");
    
    const edge = (j) => {
      const y = yB(j), fp = frontPts(y), bottom = j === n - 1;
      if (bottom) return "";
      if (woodShelf) return fp.slice(1).map((p, i) => R(fp[i][0], y - 1, p[0] - fp[i][0], 4, x.url("frv"))).join("") + `<path d="M${f(ix)} ${f(y + 3)} H${f(ix + iw)}" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>`;
      return `<polyline points="${poly(fp)}" fill="none" stroke="#cfeef0" stroke-opacity=".55" stroke-width="1.6"/><polyline points="${poly(fp.map((p) => [p[0], p[1] - .6]))}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".4"/>`;
    };
    
    let dark = "";
    for (let j = 0; j < n; j++) dark += R(ix - 2, yT(j), iw + 4, yB(j) - yT(j) + (j === n - 1 ? 2 : 0), "#05050a", `opacity="${(.55 * (1 - .9 * I[j] * x.L)).toFixed(2)}"`);
    s += dark;
    
    let light = "";
    const fixtures = [];
    const pucks = iw > 80 ? [.2, .5, .8] : [.28, .72];
    const cone = (px, y0, y1, wB, k2, j) => `<polygon points="${poly([[px - 2.2, y0], [px + 2.2, y0], [px + wB, y1], [px - wB, y1]])}" fill="${x.url("beam")}" opacity="${x.op(k2)}"/>`;
    if (top && !each) {
      
      if (type === "puck") pucks.forEach((u) => { const px = ix + iw * u; light += cone(px, iy + 2, iy + ih, iw * .2, .5 * I[0]); fixtures.push([px, iy + 1.2, "puck"]); });
      else { light += cone(V.x, iy + 3, iy + ih, iw * .46, .55 * I[0]); fixtures.push([V.x, iy + 1.5, "spot"]); }
    }
    for (let j = 0; j < n; j++) {
      const a = I[j]; if (!a) continue;
      const t0 = yT(j), t1 = yB(j), by = backY(t1), mid = (t0 + t1) / 2;
      let L2 = "";
      
      L2 += E(V.x, (t1 + by) / 2, iw * .44, Math.max(2.5, Math.abs(t1 - by) * .75), x.url("pool"), `opacity="${x.op(.85 * a)}"`);
      L2 += E(V.x, B(V.x, mid)[1], iw * .36, (t1 - t0) * .5, x.url("halo"), `opacity="${x.op((type === "back" ? .3 : .22) * a)}"`);
      if (top && each) {
        if (type === "puck") pucks.forEach((u) => { const px = ix + iw * u; L2 += cone(px, t0 + 2, t1, Math.min(iw * .2, (t1 - t0) * .55), .55 * a); fixtures.push([px, t0 + (j && woodShelf ? 3.6 : 1.2), "puck", j]); });
        else { L2 += cone(V.x, t0 + 3, t1, iw * .42, .55 * a); fixtures.push([V.x, t0 + (j && woodShelf ? 3.8 : 1.5), "spot", j]); }
      }
      if (type === "front") {
        L2 += R(ix, t0 + (j ? (woodShelf ? 3 : 1) : 0), iw, t1 - t0, x.url("wash"), `opacity="${x.op(.42 * a)}"`);
      }
      if (type === "back") {
        const xs = g.corner ? [B(V.x, t0, kc)[0]] : [B(ix, t0)[0] + 1.2, B(ix + iw, t0)[0] - 1.2];
        xs.forEach((sx) => { L2 += E(sx, B(sx, mid)[1], Math.min(14, iw * .2), (t1 - t0) * .6, x.url("halo"), `opacity="${x.op(.55 * a)}"`); });
      }
      if (type === "edge") L2 += E(V.x, t1, iw * .55, 4.5, x.url("halo"), `opacity="${x.op(.55 * a)}"`);
      light += `<g class="${P}fade" style="animation-delay:${(j * .14).toFixed(2)}s">${L2}</g>`;
    }
    if (!top && !each) {  }
    s += `<g class="${P}fade">${light}</g>`;
    
    for (let j = 0; j < n; j++) s += edge(j);
    let src = "";
    fixtures.forEach(([px, py, t, j]) => {
      const a = j == null ? I[0] : I[j];
      if (t === "puck") src += E(px, py, 4.4, 1.5, x.url("chrome")) + (a ? E(px, py + .5, 3.4, 1, x.hot, `opacity="${x.op(1.2 * a)}"`) + E(px, py + 2, 9, 4, x.url("halo"), `opacity="${x.op(.8 * a)}"`) : E(px, py + .5, 3.2, .9, "#e8e4da", 'fill-opacity=".55"'));
      else src += `<path d="M${f(px - 3)} ${f(py - 1.5)} H${f(px + 3)} L${f(px + 4)} ${f(py + 3)} H${f(px - 4)} Z" fill="${x.url("chrome")}"/>` + (a ? E(px, py + 3, 3.4, 1, x.hot, `opacity="${x.op(1.2 * a)}"`) + E(px, py + 5, 12, 5, x.url("halo"), `opacity="${x.op(.8 * a)}"`) : E(px, py + 3, 3, .8, "#e8e4da", 'fill-opacity=".5"'));
    });
    for (let j = 0; j < n; j++) {
      const a = I[j], t0 = yT(j);
      if (type === "front") { 
        const y = t0 + (j ? (woodShelf ? 3.2 : 1.2) : .6), fp = frontPts(y);
        src += `<polyline points="${poly(fp)}" fill="none" stroke="${a ? x.hot : "#d8d4cc"}" stroke-opacity="${a ? x.op(1.2 * a) : ".35"}" stroke-width="1.2"/>`;
        if (a) src += `<polyline points="${poly(fp.map((p) => [p[0], p[1] + 1.4]))}" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.35 * a)}" stroke-width="3"/>`;
      }
      if (type === "edge" && j < n - 1 + (woodShelf ? 0 : 1)) { 
        const y = yB(j), fp = frontPts(y);
        if (a) src += `<polyline points="${poly(fp)}" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.5 * a)}" stroke-width="4"/><polyline points="${poly(fp)}" fill="none" stroke="${x.hot}" stroke-opacity="${x.op(1.3 * a)}" stroke-width="1.5"/>`;
      }
    }
    if (type === "back") { 
      const lines = g.corner ? [[B(V.x, iy, kc), B(V.x, iy + ih, kc)]] : [[B(ix, iy), B(ix, iy + ih)], [B(ix + iw, iy), B(ix + iw, iy + ih)]];
      lines.forEach(([p0, p1], li) => {
        const dx = g.corner ? 0 : (li ? -1.2 : 1.2);
        src += `<path d="M${f(p0[0] + dx)} ${f(p0[1])} V${f(p1[1])}" stroke="#d8d4cc" stroke-opacity=".3" stroke-width="1.2"/>`;
        for (let j = 0; j < n; j++) if (I[j]) {
          const y0 = Math.max(p0[1], B(p0[0], yT(j))[1]), y1 = Math.min(p1[1], B(p0[0], yB(j))[1]);
          src += `<path d="M${f(p0[0] + dx)} ${f(y0)} V${f(y1)}" stroke="${x.c}" stroke-opacity="${x.op(.4 * I[j])}" stroke-width="4"/><path d="M${f(p0[0] + dx)} ${f(y0)} V${f(y1)}" stroke="${x.hot}" stroke-opacity="${x.op(1.2 * I[j])}" stroke-width="1.2"/>`;
        }
      });
    }
    s += `<g class="${P}fade">${src}</g>`;
    return { s, I, V, B, fl, ko, kc, frontPts, shelfPts };
  }

  
  const LT = [["puck", "Puck lights on top"], ["front", "LED strip, front edge"], ["back", "LED strip, back & sides"], ["edge", "Lit glass shelf edges"], ["spot", "Top spot"]];
  const lightOpt = (first, only) => { const v = LT.filter((t) => !only || only.includes(t[0])); v.sort((a, b) => (b[0] === first) - (a[0] === first)); return { id: "light", name: "Light type", values: v }; };
  const SHELVES = { id: "shelves", name: "Shelves", values: [["3", "3"], ["4", "4"], ["5", "5"]] };
  const FILL = [["figures", "Collectibles"], ["dishes", "Dishes"], ["glass", "Glassware"], ["trophies", "Trophies"], ["books", "Books"], ["bottles", "Bottles"], ["empty", "Empty"]];
  const fillOpt = (first) => { const v = FILL.slice(); v.sort((a, b) => (b[0] === first) - (a[0] === first)); return { id: "fill", name: "Contents", values: v }; };
  const WARM = ["#ffcf8f", "#fff1dc", "#e3eeff", "#b06aff", "#3fa9ff", "#ff5ca8"];
  const FIN = { walnut: "#5a3a22", cherry: "#7a2e1e", oak: "#b08654", black: "#1e1e22", white: "#ece8de", silver: "#b8bec6", espresso: "#3a2a20" };
  function card(o) {
    const def = Object.assign({ picker: true, colorLabel: "Light", colors: WARM, picker2: true, colorLabel2: "Frame", cast: "around", glow: { x: .5, y: .5, r: 1.3 } }, o);
    def.options = [lightOpt(o.light, o.lights), SHELVES, fillOpt(o.fill)];
    def.fillDefault = o.fill;
    const draw = o.draw;
    def.render = function (oo) { return draw(ctx(oo, def), def); };
    delete def.draw;
    return def;
  }
  const nShelves = (x) => +(x.opt.shelves || 3);
  const floorPool = (x, cx, y, rx, I) => x.on ? E(cx, y, rx, 5, x.url("pool"), `opacity="${x.op(.35 * Math.max(...I))}"`) : "";
  const clipRect = (x, name, rx0, ry0, w, h) => `<clipPath id="${x.id(name)}"><rect x="${f(rx0)}" y="${f(ry0)}" width="${f(w)}" height="${f(h)}"/></clipPath>`;

  const icons = [
    
    card({ id: "curio", name: "Curio cabinet", colors2: [FIN.cherry, FIN.walnut, FIN.oak, FIN.black, FIN.white, FIN.espresso], light: "puck", fill: "figures", draw(x, def) {
      const ix = 64, iy = 40, iw = 72, ih = 116;
      const g = interior(x, { ix, iy, iw, ih, n: nShelves(x), back: "mirror", sides: "glass", shelf: "glass" }, def);
      const bg = room(x, 178, 5) + wallHalo(x, 100, 96, 78, 80);
      let fx = E(100, 178, 52, 4, x.url("sh"));
      fx += post(x, 56, 34, 8, 128, 1) + post(x, 136, 34, 8, 128, 2) + rail(x, 56, 34, 88, 6, 3) + rail(x, 56, 156, 88, 6, 4);
      
      fx += `<path d="M58 30 Q100 12 142 30 Z" fill="${x.url("frv")}"/><path d="M62 29 Q100 15 138 29" stroke="#fff" stroke-opacity=".14" fill="none"/><path d="M58 30 Q100 12 142 30" stroke="#000" stroke-opacity=".3" fill="none" stroke-width=".6"/>`;
      fx += crown(x, 100, 26, 88);
      fx += `<g clip-path="${x.url("in")}">${g.s}</g>`;
      
      fx += pane(x, [[ix, iy], [ix + iw, iy], [ix + iw, iy + ih], [ix, iy + ih]], "in") + `<rect x="${ix + .6}" y="${iy + .6}" width="${iw - 1.2}" height="${ih - 1.2}" fill="none" stroke="${x.c2}" stroke-width="1.6"/>` + hinge(ix - .6, 52) + hinge(ix - .6, 140) + knob(ix + iw - 4, 99);
      
      fx += rail(x, 54, 162, 92, 11, 6) + R(70, 164.5, 60, 6, "none", `stroke="#000" stroke-opacity=".35" stroke-width=".6"`) + knob(100, 167.5) + bunFoot(x, 60, 173) + bunFoot(x, 140, 173);
      fx += floorPool(x, 100, 180, 50, g.I);
      return svg(x, { bg, fx, defs: clipRect(x, "in", ix, iy, iw, ih) });
    } }),

    
    card({ id: "cornercurio", name: "Corner curio", colors2: [FIN.walnut, FIN.cherry, FIN.oak, FIN.black, FIN.white, FIN.espresso], light: "puck", fill: "glass", draw(x, def) {
      const ix = 48, iy = 40, iw = 104, ih = 114;
      const g = interior(x, { ix, iy, iw, ih, n: nShelves(x), back: "mirror", sides: "glass", shelf: "glass", corner: true, k: .86 }, def);
      const [l0, l1] = g.fl, P1t = g.B(ix, iy, g.ko), P1b = g.B(ix, iy + ih, g.ko), P4t = g.B(ix + iw, iy, g.ko), P4b = g.B(ix + iw, iy + ih, g.ko);
      
      const bg = room(x, 178, 9) + `<path d="M100 8 V173" stroke="#000" stroke-opacity=".3" stroke-width="1"/><rect x="100" y="8" width="92" height="165" fill="#000" fill-opacity=".08"/>` + wallHalo(x, 100, 96, 80, 80);
      const outline = [P1t, [l0, iy], [l1, iy], P4t, P4b, [l1, iy + ih], [l0, iy + ih], P1b];
      let fx = E(100, 178, 56, 4, x.url("sh"));
      
      const cr = (y, d, fill) => PG([[P1t[0] - d, y + 3], [l0 - d * .4, y], [l1 + d * .4, y], [P4t[0] + d, y + 3], [P4t[0] + d, y + 7], [l1 + d * .4, y + 4], [l0 - d * .4, y + 4], [P1t[0] - d, y + 7]], fill);
      fx += cr(26, 4, x.url("frv")) + cr(31, 2, x.url("frv")) + PG([[P1t[0], 38], [l0, 35], [l1, 35], [P4t[0], 38], [P4t[0], P4t[1]], [l1, iy], [l0, iy], [P1t[0], P1t[1]]], x.url("frd"));
      fx += `<g clip-path="${x.url("in")}">${g.s}</g>`;
      
      fx += pane(x, [P1t, [l0, iy], [l0, iy + ih], P1b], "in", 1.3) + pane(x, [[l0, iy], [l1, iy], [l1, iy + ih], [l0, iy + ih]], "in") + pane(x, [[l1, iy], P4t, P4b, [l1, iy + ih]], "in", 1.3);
      
      fx += R(P1t[0] - 3, P1t[1] - 2, 3.4, P1b[1] - P1t[1] + 4, x.url("frd")) + R(P4t[0] - .4, P4t[1] - 2, 3.4, P4b[1] - P4t[1] + 4, x.url("frd")) +
        post(x, l0 - 2.5, iy - 3, 5, ih + 6, 21) + post(x, l1 - 2.5, iy - 3, 5, ih + 6, 22) + knob(l1 - 6, 98) + hinge(l0 + 2.6, 52) + hinge(l0 + 2.6, 138);
      
      fx += PG([[P1b[0] - 3, P1b[1] + 1], [l0 - 2, iy + ih + 1], [l1 + 2, iy + ih + 1], [P4b[0] + 3, P4b[1] + 1], [P4b[0] + 3, P4b[1] + 13], [l1 + 2, iy + ih + 16], [l0 - 2, iy + ih + 16], [P1b[0] - 3, P1b[1] + 13]], x.url("frv")) +
        `<path d="M${f(l0 - 2)} ${iy + ih + 1} V${iy + ih + 16} M${f(l1 + 2)} ${iy + ih + 1} V${iy + ih + 16}" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>` + bunFoot(x, l0, iy + ih + 16) + bunFoot(x, l1, iy + ih + 16);
      fx += floorPool(x, 100, 180, 48, g.I);
      return svg(x, { bg, fx, defs: `<clipPath id="${x.id("in")}"><polygon points="${poly(outline)}"/></clipPath>` });
    } }),

    
    card({ id: "hutch", name: "China hutch", colors2: [FIN.white, FIN.cherry, FIN.walnut, FIN.oak, FIN.black, "#5f7a6a"], light: "puck", fill: "dishes", draw(x, def) {
      const ix = 52, iy = 34, iw = 96, ih = 78;
      const g = interior(x, { ix, iy, iw, ih, n: nShelves(x), back: "bead", sides: "wood", shelf: "glass", vy: .5, k: .84 }, def);
      const bg = room(x, 178, 13) + wallHalo(x, 100, 72, 76, 52);
      let fx = E(100, 178, 64, 4.5, x.url("sh"));
      fx += post(x, 46, 30, 6, 86, 31) + post(x, 148, 30, 6, 86, 32) + rail(x, 46, 28, 108, 6, 33) + crown(x, 100, 18, 108);
      fx += `<g clip-path="${x.url("in")}">${g.s}</g>`;
      
      const door = (d0) => { let t = pane(x, [[d0, iy], [d0 + iw / 2, iy], [d0 + iw / 2, iy + ih], [d0, iy + ih]], "in");
        t += `<rect x="${f(d0 + 1)}" y="${iy + 1}" width="${f(iw / 2 - 2)}" height="${ih - 2}" fill="none" stroke="${x.c2}" stroke-width="2.4"/><rect x="${f(d0 + 1)}" y="${iy + 1}" width="${f(iw / 2 - 2)}" height="${ih - 2}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".4"/>`;
        t += `<path d="M${f(d0 + iw / 4)} ${iy + 2} V${iy + ih - 2} M${f(d0 + 2)} ${f(iy + ih / 3)} H${f(d0 + iw / 2 - 2)} M${f(d0 + 2)} ${f(iy + ih * 2 / 3)} H${f(d0 + iw / 2 - 2)}" stroke="${x.c2}" stroke-width="1.5"/><path d="M${f(d0 + iw / 4 - .5)} ${iy + 2} V${iy + ih - 2}" stroke="#fff" stroke-opacity=".15" stroke-width=".4"/>`;
        return t; };
      fx += door(ix) + door(ix + iw / 2) + knob(99, 74) + knob(101.5, 74);
      
      fx += rail(x, 38, 112, 124, 5, 34) + R(38, 117, 124, 1, "#000", 'fill-opacity=".4"') + post(x, 41, 118, 118, 51, 35);
      [[44, 120, 55, 12], [101, 120, 55, 12]].forEach(([a, b, w, h]) => { fx += R(a, b, w, h, x.url("frv")) + R(a, b, w, h, "none", 'stroke="#000" stroke-opacity=".35" stroke-width=".6"') + knob(a + w / 2, b + h / 2); });
      [[44, 134, 36], [82, 134, 36], [120, 134, 36]].forEach(([a, b, w], i) => { fx += R(a, b, w, 31, x.url("fr")) + R(a + 3, b + 3, w - 6, 25, "none", 'stroke="#000" stroke-opacity=".3" stroke-width=".6"') + R(a + 3.4, b + 3.4, w - 6.8, .5, "#fff", 'fill-opacity=".15"') + knob(i === 1 ? a + w / 2 : i ? a + 4 : a + w - 4, b + 15); });
      fx += rail(x, 39, 168, 122, 6, 36) + R(42, 174, 5, 4, x.url("frd")) + R(153, 174, 5, 4, x.url("frd"));
      
      if (x.on) fx += E(100, 113.5, 50, 2.6, x.url("pool"), `opacity="${x.op(.6 * g.I[g.I.length - 1])}"`);
      return svg(x, { bg, fx, defs: clipRect(x, "in", ix, iy, iw, ih) });
    } }),

    
    card({ id: "vitrine", name: "Glass tower", colors: ["#e3eeff", "#fff1dc", "#ffcf8f", "#b06aff", "#3fa9ff", "#ff5ca8"], colors2: [FIN.black, FIN.silver, FIN.white, FIN.oak, FIN.walnut],
      parts: [{ id: "s1", name: "Shelf 1" }, { id: "s2", name: "Shelf 2" }, { id: "s3", name: "Shelf 3" }, { id: "s4", name: "Shelf 4", when: { opt: "shelves", is: ["4", "5"] } }, { id: "s5", name: "Shelf 5", when: { opt: "shelves", is: ["5"] } }],
      light: "edge", fill: "figures", draw(x, def) {
      const ix = 68, iy = 34, iw = 64, ih = 134;
      const g = interior(x, { ix, iy, iw, ih, n: nShelves(x), back: "mirror", sides: "glass", shelf: "glass", k: .84, xpad: 4 }, def);
      const bg = room(x, 180, 17) + wallHalo(x, 100, 100, 62, 86);
      let fx = E(100, 180, 44, 3.6, x.url("sh"));
      
      fx += R(64, 22, 72, 12, x.url("frv")) + R(64, 22, 72, .8, "#fff", 'fill-opacity=".2"') + R(64, 33, 72, 1.2, "#000", 'fill-opacity=".4"');
      fx += `<g clip-path="${x.url("in")}">${g.s}</g>`;
      fx += pane(x, [[ix, iy], [ix + iw, iy], [ix + iw, iy + ih], [ix, iy + ih]], "in");
      fx += post(x, 64, 34, 4, 136, 41) + post(x, 132, 34, 4, 136, 42) + `<path d="M${ix + iw - 1} ${iy + 2} V${iy + ih - 2}" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>`;
      
      fx += `<circle cx="${ix + iw - 4}" cy="104" r="1.8" fill="${x.url("chrome")}"/><rect x="${ix + iw - 4.5}" y="103.4" width="1" height="1.6" fill="#222"/>` +
        R(64, 168, 72, 8, x.url("frv")) + R(64, 168, 72, .7, "#fff", 'fill-opacity=".2"') + R(68, 176, 4, 3, "#2a2a2e") + R(128, 176, 4, 3, "#2a2a2e");
      fx += floorPool(x, 100, 182, 40, g.I);
      return svg(x, { bg, fx, defs: clipRect(x, "in", ix, iy, iw, ih) });
    } }),

    
    card({ id: "wallglass", name: "Wall glass cabinet", colors2: [FIN.oak, FIN.walnut, FIN.white, FIN.black, FIN.cherry], light: "front", fill: "glass", glow: { x: .5, y: .45, r: 1.2 }, draw(x, def) {
      const ix = 56, iy = 46, iw = 88, ih = 90;
      const g = interior(x, { ix, iy, iw, ih, n: nShelves(x), back: "dark", sides: "wood", shelf: "glass", vy: .45, k: .84 }, def);
      const bg = wallBg(x, 8, 192, 21) + `<rect x="8" y="170" width="184" height="22" fill="#000" fill-opacity=".14"/><rect x="8" y="169" width="184" height="1.4" fill="#fff" fill-opacity=".1"/>` + wallHalo(x, 100, 92, 74, 64);
      
      let fx = R(54, 42, 98, 108, "#000", 'fill-opacity=".22" rx="4"') + E(102, 150, 48, 5, x.url("sh"), 'opacity=".7"');
      fx += post(x, 50, 40, 6, 102, 51) + post(x, 144, 40, 6, 102, 52) + rail(x, 48, 34, 104, 7, 53) + R(48, 40.6, 104, .8, "#000", 'fill-opacity=".35"') + rail(x, 50, 136, 100, 7, 54);
      fx += `<g clip-path="${x.url("in")}">${g.s}</g>`;
      fx += pane(x, [[ix, iy], [ix + iw, iy], [ix + iw, iy + ih], [ix, iy + ih]], "in") + `<rect x="${ix + 1.2}" y="${iy + 1.2}" width="${iw - 2.4}" height="${ih - 2.4}" fill="none" stroke="${x.c2}" stroke-width="2.6"/>` + knob(ix + iw - 5, 91) + hinge(ix - .4, 56) + hinge(ix - .4, 122);
      
      if (x.on) fx += `<polygon points="60,143 140,143 158,176 42,176" fill="${x.url("beam")}" opacity="${x.op(.22 * g.I[g.I.length - 1])}"/>`;
      return svg(x, { bg, fx, defs: clipRect(x, "in", ix, iy, iw, ih) });
    } }),

    
    card({ id: "winebar", name: "Wine bar cabinet", colors: ["#3fa9ff", "#ffcf8f", "#fff1dc", "#e3eeff", "#b06aff", "#ff5ca8"], colors2: [FIN.black, FIN.espresso, FIN.walnut, FIN.oak, FIN.white], light: "back", fill: "bottles", draw(x, def) {
      const ix = 50, iy = 32, iw = 100, ih = 76;
      const g = interior(x, { ix, iy, iw, ih, n: nShelves(x), back: "mirror", sides: "wood", shelf: "glass", topInset: 9, vy: .55, k: .86, xpad: 7 }, def);
      const bg = room(x, 178, 25) + wallHalo(x, 100, 70, 76, 50);
      let rack = "";
      
      for (let i = 0; i < 7; i++) { const cx = ix + 12 + i * 12.6, a = g.I[0] * x.L, st = a > .02 ? x.hot : "#fff", so = a > .02 ? (.5 + .5 * a).toFixed(2) : ".4";
        rack += `<path d="M${f(cx - 3)} ${iy + 2.4} H${f(cx + 3)} M${f(cx)} ${iy + 2.4} V${iy + 5.2} M${f(cx - 2.6)} ${iy + 5.2} C${f(cx - 2.8)} ${iy + 7.5} ${f(cx - 1)} ${iy + 9} ${f(cx)} ${iy + 9.2} C${f(cx + 1)} ${iy + 9} ${f(cx + 2.8)} ${iy + 7.5} ${f(cx + 2.6)} ${iy + 5.2}" stroke="${st}" stroke-opacity="${so}" stroke-width=".55" fill="#dff2f6" fill-opacity=".12"/>`; }
      rack = `<path d="M${ix + 4} ${iy + 2.2} H${ix + iw - 4}" stroke="#8a9098" stroke-width="1.2"/>` + rack;
      let fx = E(100, 178, 60, 4.5, x.url("sh"));
      fx += post(x, 44, 28, 6, 84, 61) + post(x, 150, 28, 6, 84, 62) + rail(x, 42, 22, 116, 8, 63) + R(42, 29.4, 116, .8, "#000", 'fill-opacity=".35"');
      fx += `<g clip-path="${x.url("in")}">${g.s}${rack}</g>`;
      
      fx += pane(x, [[ix, iy], [ix + iw / 2, iy], [ix + iw / 2, iy + ih], [ix, iy + ih]], "in") + pane(x, [[ix + iw / 2, iy], [ix + iw, iy], [ix + iw, iy + ih], [ix + iw / 2, iy + ih]], "in") +
        `<path d="M100 ${iy} V${iy + ih}" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>` + R(96.2, 60, 1.4, 20, x.url("chrome")) + R(102.4, 60, 1.4, 20, x.url("chrome"));
      
      fx += R(40, 108, 120, 6, x.url("stone")) + R(40, 108, 120, .8, "#fff", 'fill-opacity=".5"') + R(40, 113.4, 120, 1, "#000", 'fill-opacity=".4"');
      if (x.on) fx += E(100, 110, 54, 2.4, x.url("pool"), `opacity="${x.op(.5 * Math.max(...g.I))}"`);
      
      fx += post(x, 42, 114, 116, 56, 64);
      fx += R(47, 118, 52, 48, "#121116");
      let lat = "";
      for (let r2 = 0; r2 < 4; r2++) for (let c = 0; c < 4; c++) {
        const cx = 53.5 + c * 13, cy = 124 + r2 * 12;
        lat += `<circle cx="${f(cx)}" cy="${f(cy)}" r="4.2" fill="#1e3a24"/><circle cx="${f(cx)}" cy="${f(cy)}" r="2.2" fill="${(r2 + c) % 3 ? "#7a1a22" : "#c9a24a"}"/><circle cx="${f(cx - 1.4)}" cy="${f(cy - 1.4)}" r="1" fill="${x.on ? x.hot : "#fff"}" fill-opacity="${x.on ? x.op(.9) : ".25"}"/>`;
      }
      for (let i = -4; i <= 4; i++) lat += `<path d="M${f(47 + i * 12)} 118 l48 48 M${f(99 - i * 12)} 118 l-48 48" stroke="${x.c2}" stroke-width="1.6"/>`;
      fx += `<g clip-path="${x.url("lat")}">${lat}${x.on ? R(47, 118, 52, 48, x.url("halo"), `opacity="${x.op(.18)}"`) : ""}</g>` + R(47, 118, 52, 48, "none", 'stroke="#000" stroke-opacity=".45" stroke-width=".8"');
      fx += R(103, 118, 51, 48, x.url("fr")) + R(106, 121, 45, 42, "none", 'stroke="#000" stroke-opacity=".3" stroke-width=".6"') + R(106, 121.4, 45, .5, "#fff", 'fill-opacity=".14"') + R(107.5, 130, 1.4, 16, x.url("chrome"));
      fx += rail(x, 42, 170, 116, 5, 65) + R(46, 175, 4, 3, "#1a1a1e") + R(150, 175, 4, 3, "#1a1a1e");
      return svg(x, { bg, fx, defs: clipRect(x, "in", ix, iy, iw, ih) + clipRect(x, "lat", 47, 118, 52, 48) });
    } }),

    
    card({ id: "bookcase", name: "Bookcase with LED", colors2: [FIN.walnut, FIN.oak, FIN.white, FIN.black, FIN.espresso], light: "front", lights: ["front", "back", "puck"], fill: "books", draw(x, def) {
      const ix = 46, iy = 30, iw = 108, ih = 136;
      const g = interior(x, { ix, iy, iw, ih, n: nShelves(x), back: "wall", sides: "wood", shelf: "wood", vy: .32, k: .86, xpad: 5 }, def);
      const bg = room(x, 178, 29) + wallHalo(x, 100, 98, 84, 84);
      let fx = E(100, 178, 62, 4.5, x.url("sh"));
      fx += `<g clip-path="${x.url("in")}">${g.s}</g>`;
      fx += post(x, 40, 24, 6, 150, 71) + post(x, 154, 24, 6, 150, 72) + rail(x, 38, 22, 124, 8, 73) + R(38, 29.4, 124, .8, "#000", 'fill-opacity=".35"') +
        rail(x, 40, 166, 120, 9, 74) + R(40, 166, 120, 1, "#000", 'fill-opacity=".3"');
      fx += floorPool(x, 100, 180, 52, g.I);
      return svg(x, { bg, fx, defs: clipRect(x, "in", ix, iy, iw, ih) });
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "cablights",
    tab: "Display cabinet lights",
    group: "Lights",
    kind: "light",
    intro: "Glass display cabinets lit from inside: pick the light type, how many shelves and what is on them; the frame finish is the second swatch row. The glass tower lights each shelf on its own.",
    css: `.hda-anim .hda-cablights-fade{animation:hda-cablights-fade 1.1s ease-out both}
@keyframes hda-cablights-fade{0%{opacity:.25}100%{opacity:1}}
.hda-anim .hda-cablights-glint{animation:hda-cablights-glint 7s ease-in-out infinite}
@keyframes hda-cablights-glint{0%,55%{transform:translate(0,0);opacity:0}60%{opacity:1}90%{opacity:1}100%{transform:translate(160px,0);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-cablights-fade,.hda-anim .hda-cablights-glint{animation:none}}`,
    icons,
  });
})();
