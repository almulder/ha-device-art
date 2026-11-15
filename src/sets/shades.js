(function () {
  const P = "hda-shades-";
  const H = () => window.HDAH;
  const f1 = (v) => (+v).toFixed(1), f2 = (v) => (+v).toFixed(2);
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const amt = (o) => (o.on ? cl(+o.level || 0, 0, 1) : 0);
  const an = (o, c) => (o.on ? ` class="${P}${c}"` : "");

  const FAB = ["#e7dfcf", "#f6f4ef", "#a3a7aa", "#3c4047", "#3a5577", "#b9805f"];
  const WOOD = ["#c39563", "#8a5a38", "#f3f0e9", "#5a3a26", "#d8c09a", "#9d9a92"];
  const ALU = ["#d5d9dd", "#f4f4f1", "#2d3034", "#a5845a", "#8ea3b7"];
  const SHEER = ["#f8f6f0", "#efe5d0", "#d7dcdf", "#ead6cb", "#d9e3d3"];
  const PAINT = ["#f3f1eb", "#e9dfca", "#a9aba8", "#2d2e31", "#b88a5c", "#9fae97"];
  const AWN = ["#2e6f8e", "#3d6a43", "#b23b30", "#c9a86a", "#2c3b5a", "#4a4d52"];
  const SCR = ["#3a3d41", "#6e6657", "#a0998c", "#202225", "#e3e1dc"];
  const sw = (L, first) => (first ? [first].concat(L.filter((c) => c !== first)) : L.slice());

  const css = `
.hda-anim .hda-shades-cloud{animation:hda-shades-drift 14s ease-in-out infinite alternate}
@keyframes hda-shades-drift{from{transform:translateX(-7px)}to{transform:translateX(9px)}}
.hda-anim .hda-shades-tree{transform-box:fill-box;transform-origin:50% 100%;animation:hda-shades-tree 4.6s ease-in-out infinite alternate}
@keyframes hda-shades-tree{from{transform:rotate(-1.4deg)}to{transform:rotate(1.6deg)}}
.hda-anim .hda-shades-sway{transform-box:fill-box;transform-origin:50% 0;animation:hda-shades-sway 4.2s ease-in-out infinite alternate}
.hda-anim .hda-shades-sway2{transform-box:fill-box;transform-origin:50% 0;animation:hda-shades-sway 3.4s ease-in-out -1.7s infinite alternate-reverse}
@keyframes hda-shades-sway{from{transform:skewX(-1.1deg)}to{transform:skewX(1.2deg)}}
.hda-anim .hda-shades-soft{transform-box:fill-box;transform-origin:50% 0;animation:hda-shades-soft 5s ease-in-out infinite alternate}
@keyframes hda-shades-soft{from{transform:skewX(-.45deg)}to{transform:skewX(.5deg)}}
.hda-anim .hda-shades-bob{animation:hda-shades-bob 3s ease-in-out infinite alternate}
@keyframes hda-shades-bob{from{transform:translateY(0)}to{transform:translateY(1.4px)}}
.hda-anim .hda-shades-led{animation:hda-shades-led 2.4s ease-in-out infinite}
@keyframes hda-shades-led{0%,100%{opacity:1}50%{opacity:.35}}
.hda-anim .hda-shades-flap{transform-box:fill-box;transform-origin:50% 0;animation:hda-shades-flap 2.2s ease-in-out infinite alternate}
@keyframes hda-shades-flap{from{transform:skewX(-2deg) scaleY(1)}to{transform:skewX(2deg) scaleY(.94)}}
`;

  function defs(o, extra) {
    const u = o.uid, h = H(), c = o.color;
    const l = h.shade(c, .3), m = c, d = h.shade(c, -.22), k = h.shade(c, -.45);
    return `<defs>
<linearGradient id="${u}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a8ad8"/><stop offset=".6" stop-color="#8ac4ee"/><stop offset="1" stop-color="#d6edf8"/></linearGradient>
<radialGradient id="${u}-sun"><stop offset="0" stop-color="#fffbe6" stop-opacity=".95"/><stop offset=".35" stop-color="#fff3c4" stop-opacity=".45"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#95c48a"/><stop offset="1" stop-color="#5f9a5c"/></linearGradient>
<linearGradient id="${u}-lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#84c465"/><stop offset="1" stop-color="#4a883b"/></linearGradient>
<radialGradient id="${u}-leaf" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#98d870"/><stop offset=".55" stop-color="#4d9c40"/><stop offset="1" stop-color="#2b6328"/></radialGradient>
<linearGradient id="${u}-trunk" x1="0" x2="1"><stop offset="0" stop-color="#4a3222"/><stop offset=".5" stop-color="#7a573c"/><stop offset="1" stop-color="#3e2a1c"/></linearGradient>
<linearGradient id="${u}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".55" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>
<radialGradient id="${u}-day"><stop offset="0" stop-color="#fff2cf" stop-opacity=".75"/><stop offset=".5" stop-color="#ffe9b8" stop-opacity=".22"/><stop offset="1" stop-color="#ffe9b8" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-trim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e7e4dd"/><stop offset="1" stop-color="#b8b3a9"/></linearGradient>
<linearGradient id="${u}-sill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#e6e3dc"/><stop offset="1" stop-color="#a49f95"/></linearGradient>
<linearGradient id="${u}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5439"/><stop offset="1" stop-color="#3f2a1d"/></linearGradient>
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".12"/><stop offset=".64" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-fv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></linearGradient>
<linearGradient id="${u}-fx" x1="0" x2="1"><stop offset="0" stop-color="${d}"/><stop offset=".15" stop-color="${m}"/><stop offset=".45" stop-color="${l}"/><stop offset=".85" stop-color="${m}"/><stop offset="1" stop-color="${k}"/></linearGradient>
<linearGradient id="${u}-roll" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d}"/><stop offset=".35" stop-color="${l}"/><stop offset=".7" stop-color="${m}"/><stop offset="1" stop-color="${k}"/></linearGradient>
<linearGradient id="${u}-fold" x1="0" x2="1"><stop offset="0" stop-color="${k}"/><stop offset=".38" stop-color="${l}"/><stop offset=".62" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></linearGradient>
<linearGradient id="${u}-sfold" x1="0" x2="1"><stop offset="0" stop-color="${d}" stop-opacity=".62"/><stop offset=".4" stop-color="${l}" stop-opacity=".34"/><stop offset="1" stop-color="${m}" stop-opacity=".55"/></linearGradient>
<linearGradient id="${u}-fsh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".4" stop-color="#fff" stop-opacity=".2"/><stop offset=".65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<linearGradient id="${u}-slat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h.shade(c, .45)}"/><stop offset=".45" stop-color="${m}"/><stop offset="1" stop-color="${k}"/></linearGradient>
<linearGradient id="${u}-alu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h.shade(c, .7)}"/><stop offset=".3" stop-color="${h.shade(c, .3)}"/><stop offset=".7" stop-color="${m}"/><stop offset="1" stop-color="${k}"/></linearGradient>
<linearGradient id="${u}-stile" x1="0" x2="1"><stop offset="0" stop-color="${d}"/><stop offset=".35" stop-color="${l}"/><stop offset="1" stop-color="${d}"/></linearGradient>
<linearGradient id="${u}-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".5" stop-color="#b9bec4"/><stop offset="1" stop-color="#6f757c"/></linearGradient>
<linearGradient id="${u}-dmetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b6f75"/><stop offset=".45" stop-color="#3a3d42"/><stop offset="1" stop-color="#1c1e21"/></linearGradient>
<linearGradient id="${u}-brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0c0"/><stop offset=".4" stop-color="#d1a456"/><stop offset="1" stop-color="#7a5524"/></linearGradient>
<linearGradient id="${u}-cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".6" stop-color="${m}"/><stop offset="1" stop-color="${k}"/></linearGradient>
<linearGradient id="${u}-int" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1e26"/><stop offset="1" stop-color="#3a3f4a"/></linearGradient>
<linearGradient id="${u}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe2fa" stop-opacity=".75"/><stop offset=".45" stop-color="#8fc6ee" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset=".62" stop-color="#9ccbe9" stop-opacity=".3"/><stop offset="1" stop-color="#9ccbe9" stop-opacity=".1"/></linearGradient>
<pattern id="${u}-cell" width="10" height="8" patternUnits="userSpaceOnUse"><rect width="10" height="8" fill="url(#${u}-cg)"/><rect y="3.6" width="10" height="1.2" fill="#fff" fill-opacity=".16"/><rect y="7.3" width="10" height=".7" fill="#000" fill-opacity=".2"/><rect width="10" height=".6" fill="#fff" fill-opacity=".28"/></pattern>
<pattern id="${u}-pleat" width="10" height="5" patternUnits="userSpaceOnUse"><rect width="10" height="2.6" fill="${l}"/><rect y="2.6" width="10" height="2.4" fill="${d}"/><rect y="2.3" width="10" height=".5" fill="#fff" fill-opacity=".4"/></pattern>
<pattern id="${u}-wv" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5H3M0 2H3" stroke="#000" stroke-opacity=".09" stroke-width=".5"/><path d="M.5 0V3M2 0V3" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/></pattern>
<pattern id="${u}-grain" width="30" height="4" patternUnits="userSpaceOnUse"><path d="M0 1.2C8 .6 14 1.8 30 1.1M0 3C10 2.6 18 3.4 30 2.8" stroke="${k}" stroke-opacity=".4" stroke-width=".45" fill="none"/></pattern>
<pattern id="${u}-mesh" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#fff" fill-opacity=".14"/><rect x="1" y="1" width="1" height="1" fill="#000" fill-opacity=".18"/></pattern>
<pattern id="${u}-ging" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#faf6ee"/><rect width="4" height="8" fill="${m}" fill-opacity=".5"/><rect width="8" height="4" fill="${m}" fill-opacity=".5"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;

  function scenery(o, up) {
    const u = o.uid;
    const clouds = `<g${an(o, "cloud")}><g fill="#fff"><ellipse cx="50" cy="22" rx="11" ry="4.2" opacity=".93"/><ellipse cx="56" cy="18.5" rx="7" ry="5"/><ellipse cx="45" cy="19.5" rx="5.5" ry="3.6"/></g><ellipse cx="51" cy="25" rx="10" ry="1.5" fill="#a5c3dc" opacity=".5"/><g fill="#fff" opacity=".82"><ellipse cx="80" cy="37" rx="8" ry="2.8"/><ellipse cx="84" cy="34.6" rx="4.5" ry="3"/></g></g>`;
    const sun = `<circle cx="86" cy="12" r="24" fill="url(#${u}-sun)"/><circle cx="86" cy="12" r="5.5" fill="#fffbea"/>`;
    if (up) return sun + clouds + `<g${an(o, "tree")}><path d="M-4 104Q8 84 22 80M30 104Q24 92 30 84" stroke="#3e2a1c" stroke-width="2.2" fill="none"/><g fill="#2b5f2a"><circle cx="2" cy="92" r="17"/><circle cx="20" cy="100" r="14"/></g><g fill="url(#${u}-leaf)"><circle cx="0" cy="88" r="15"/><circle cx="17" cy="96" r="12"/><circle cx="30" cy="104" r="9"/><circle cx="-2" cy="70" r="9"/></g></g>`;
    return sun + clouds +
      `<path d="M0 63Q18 54 38 59T72 56Q88 53 100 58V100H0Z" fill="url(#${u}-hill)"/>` +
      `<g fill="#3e7a3c"><circle cx="62" cy="57.5" r="3.4"/><circle cx="67" cy="56.5" r="4.2"/><circle cx="95" cy="56" r="3"/></g>` +
      `<path d="M75 67V59.5L81.5 54L88 59.5V67Z" fill="#efe7da"/><path d="M73.6 60L81.5 53L89.4 60" stroke="#a24c3b" stroke-width="2" fill="none" stroke-linejoin="round"/><rect x="80" y="62" width="3" height="5" fill="#7a5a44"/>` +
      `<path d="M0 72Q50 66 100 71V100H0Z" fill="url(#${u}-lawn)"/><path d="M0 79Q50 74 100 78" stroke="#f2eee4" stroke-width=".7" fill="none" opacity=".8"/>` +
      `<g${an(o, "tree")}><path d="M19 100L21.5 64Q22 57 25.5 52L27.5 52.5Q25.5 59 26.5 66L28 100Z" fill="url(#${u}-trunk)"/><g fill="#2b5f2a"><circle cx="24" cy="45" r="15"/><circle cx="12" cy="52" r="10"/><circle cx="37" cy="52" r="11"/></g><g fill="url(#${u}-leaf)"><circle cx="23" cy="40" r="14"/><circle cx="11" cy="48" r="10"/><circle cx="36" cy="47" r="11"/><circle cx="22" cy="28" r="10"/><circle cx="32" cy="34" r="9"/></g></g>`;
  }
  function view(o, x, y, w, h, opt) {
    opt = opt || {};
    const u = o.uid, k = opt.k || 0, s = Math.max(w, h) / 100;
    const tx = x + (w - 100 * s) / 2, ty = y + h - 100 * s;
    const tr = `translate(${f1(tx)} ${f1(ty)}) scale(${f2(s)})` + (opt.flip ? " translate(100 0) scale(-1 1)" : "");
    const cp = opt.clip ? `<path d="${opt.clip}"/>` : `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    return `<clipPath id="${u}-v${k}">${cp}</clipPath><g clip-path="url(#${u}-v${k})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c9d3dc"/><path d="M${x} ${y}H${x + w * .5}L${x} ${y + h * .75}Z" fill="#fff" opacity=".35"/><path d="M${x + w * .62} ${y}H${x + w * .74}L${x + w * .18} ${y + h}H${x + w * .06}Z" fill="#fff" opacity=".3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#5a6a7a" opacity=".12"/></g><g class="hda-bg"><g clip-path="url(#${u}-v${k})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-sky)"/><g transform="${tr}">${scenery(o, opt.up)}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-gl)"/></g></g>`;
  }
  function glassOut(o, x, y, w, h) {
    const u = o.uid;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-int)"/><path d="M${x} ${y}H${x + w * .55}L${x} ${y + h * .7}Z" fill="url(#${u}-refl)"/><path d="M${x + w * .7} ${y}H${x + w * .82}L${x + w * .2} ${y + h}H${x + w * .08}Z" fill="#fff" opacity=".1"/><g opacity=".3"><ellipse cx="${x + w * .3}" cy="${y + h * .18}" rx="${w * .12}" ry="${h * .04}" fill="#fff"/><ellipse cx="${x + w * .38}" cy="${y + h * .15}" rx="${w * .06}" ry="${h * .05}" fill="#fff"/></g><g opacity=".22" fill="#7fbf6a"><circle cx="${x + w * .82}" cy="${y + h * .72}" r="${w * .14}"/><circle cx="${x + w * .7}" cy="${y + h * .8}" r="${w * .1}"/><rect x="${x + w * .8}" y="${y + h * .8}" width="${w * .03}" height="${h * .2}"/></g>`;
  }

  function room(o, g) {
    const u = o.uid, a = amt(o), fy = g.floor || 180;
    let s = `<rect width="200" height="200" fill="${g.wall || "#5e5666"}"/>`;
    if (g.paper) for (let i = 0; i < 200; i += 12) s += `<rect x="${i}" width="5" height="200" fill="#fff" opacity=".06"/><rect x="${i + 5}" width=".6" height="200" fill="#000" opacity=".08"/>`;
    if (g.wains) s += `<rect y="148" width="200" height="${fy - 148}" fill="#ece8df" opacity=".9"/><rect y="148" width="200" height="3" fill="#fff"/><rect y="151" width="200" height="1.2" fill="#000" opacity=".2"/>` + [14, 62, 110, 158].map((x) => `<rect x="${x}" y="157" width="34" height="${fy - 164}" fill="none" stroke="#000" stroke-opacity=".14"/>`).join("");
    s += `<rect width="200" height="200" fill="url(#${u}-wall)"/>`;
    if (!g.noFloor) s += `<rect y="${fy}" width="200" height="${200 - fy}" fill="url(#${u}-floor)"/><path d="M0 ${fy + 7}H200M0 ${fy + 14}H200" stroke="#000" stroke-opacity=".28" stroke-width=".6"/><path d="M38 ${fy}V${fy + 7}M118 ${fy + 7}V${fy + 14}M168 ${fy}V${fy + 7}M74 ${fy + 14}V200" stroke="#000" stroke-opacity=".25" stroke-width=".6"/><rect y="${fy - 6}" width="200" height="6" fill="#d8d3c9"/><rect y="${fy - 6}" width="200" height="1" fill="#fff" opacity=".55"/><rect y="${fy}" width="200" height="1.4" fill="#000" opacity=".3"/>`;
    if (a > 0) {
      s += `<ellipse cx="${g.x + g.w / 2}" cy="${g.y + g.h * .6}" rx="${f1(g.w * 1.05)}" ry="${f1(g.h)}" fill="url(#${u}-day)" opacity="${f2(.2 + a * .6)}"/>`;
      if (!g.noFloor) s += `<path d="M${g.x + 4} ${fy}H${g.x + g.w - 4}L${g.x + g.w + 28} 200H${g.x - 16}Z" fill="#ffe7b0" opacity="${f2(a * .2)}"/>`;
    }
    return `<g class="hda-bg">${s}</g>`;
  }
  function trim(o, x, y, w, h, t, fill) {
    t = t || 7;
    return `<rect x="${x - t + 2}" y="${y - t + 2}" width="${w + 2 * t}" height="${h + 2 * t}" fill="#000" opacity=".25"/><rect x="${x - t}" y="${y - t}" width="${w + 2 * t}" height="${h + 2 * t}" rx="1" fill="${fill || `url(#${o.uid}-trim)`}"/><rect x="${x - t + 1.5}" y="${y - t + 1.5}" width="${w + 2 * t - 3}" height="${h + 2 * t - 3}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width=".8"/>`;
  }
  function sash(x, y, w, h, m, col) {
    col = col || "#f4f2ee";
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${col}" stroke-width="3"/>`;
    if (m === "cross" || m === "v") s += `<rect x="${x + w / 2 - 1.5}" y="${y}" width="3" height="${h}" fill="${col}"/>`;
    if (m === "cross" || m === "h") s += `<rect x="${x}" y="${y + h / 2 - 2}" width="${w}" height="4" fill="${col}"/><rect x="${x}" y="${y + h / 2 + 2}" width="${w}" height="1" fill="#000" opacity=".15"/>`;
    return s + `<rect x="${x}" y="${y}" width="${w}" height="3" fill="#000" opacity=".2"/><rect x="${x}" y="${y}" width="2.5" height="${h}" fill="#000" opacity=".12"/>`;
  }
  const sill = (o, x, y, w) => `<rect x="${x + 2}" y="${y + 6}" width="${w - 4}" height="6" fill="#000" opacity=".22"/><rect x="${x + 4}" y="${y + 6}" width="${w - 8}" height="4" fill="url(#${o.uid}-trim)"/><rect x="${x}" y="${y}" width="${w}" height="6.5" rx="1.2" fill="url(#${o.uid}-sill)"/><rect x="${x}" y="${y}" width="${w}" height="1" fill="#fff" opacity=".7"/>`;
  function led(o, x, y) {
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="1.3" fill="#5a5f66"/>`;
    return `<g${an(o, "led")}><circle cx="${x}" cy="${y}" r="4" fill="#34d399" opacity=".25"/><circle cx="${x}" cy="${y}" r="1.4" fill="#5ef0b4"/></g>`;
  }
  const shadowLine = (x, y, w, h, op) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" opacity="${op || .2}"/>`;
  const G = {
    roller: { x: 36, y: 42, w: 128, h: 90, mull: "none", wall: "#5d6a72" },
    blackout: { x: 54, y: 36, w: 92, h: 102, mull: "cross", wall: "#3f3a4c" },
    cellular: { x: 46, y: 38, w: 108, h: 98, mull: "h", wall: "#66755f", flip: 1 },
    tdbu: { x: 52, y: 32, w: 96, h: 108, mull: "h", wall: "#7b6656" },
    roman: { x: 50, y: 42, w: 100, h: 94, mull: "v", wall: "#857660", paper: 1 },
    wood: { x: 44, y: 36, w: 112, h: 100, mull: "cross", wall: "#4b5849", flip: 1 },
    mini: { x: 60, y: 40, w: 80, h: 94, mull: "none", wall: "#6c7380" },
    zebra: { x: 40, y: 40, w: 120, h: 94, mull: "v", wall: "#545b6e", flip: 1 },
    shutters: { x: 50, y: 36, w: 100, h: 100, mull: "none", wall: "#6e6252", wains: 1 },
  };
  function stdWindow(o, g) {
    return room(o, g) + trim(o, g.x, g.y, g.w, g.h) + view(o, g.x, g.y, g.w, g.h, g) + sash(g.x, g.y, g.w, g.h, g.mull);
  }
  const stdSill = (o, g) => sill(o, g.x - 11, g.y + g.h + 6, g.w + 22);

  function fabric(o, x, y, w, h, op) {
    const u = o.uid;
    if (h <= 0) return "";
    return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="url(#${u}-fv)" opacity="${op || 1}"/><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="url(#${u}-wv)"/>`;
  }
  const hem = (o, x, y, w, fill) => `<rect x="${f1(x + 1)}" y="${f1(y + 4)}" width="${f1(w - 2)}" height="3" fill="#000" opacity=".18"/><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="4.2" rx="1.6" fill="${fill || `url(#${o.uid}-metal)`}"/><rect x="${f1(x + 1)}" y="${f1(y + .6)}" width="${f1(w - 2)}" height=".8" fill="#fff" opacity=".5"/>`;
  function slats(o, x, y, w, h, n, kind) {
    const u = o.uid, a = pv("tilt", amt(o)), p = h / n, hs = p * (1.12 - .86 * a);
    const fill = kind === "alu" ? `url(#${u}-alu)` : `url(#${u}-slat)`;
    let s = "";
    for (let i = 0; i < n; i++) {
      const yy = y + i * p + (p - hs) / 2;
      if (a > .05) s += shadowLine(f1(x), f1(yy + hs), f1(w), f1(Math.min(2.2, p - hs + .1)), .16);
      s += `<rect x="${f1(x)}" y="${f1(yy)}" width="${f1(w)}" height="${f1(hs)}" rx="${kind === "alu" ? .5 : .9}" fill="${fill}"/>`;
      if (kind === "wood") s += `<rect x="${f1(x)}" y="${f1(yy)}" width="${f1(w)}" height="${f1(hs)}" fill="url(#${u}-grain)"/>`;
      s += `<rect x="${f1(x)}" y="${f1(yy + hs - .6)}" width="${f1(w)}" height=".6" fill="#000" opacity=".35"/>`;
    }
    return s;
  }
  function louvers(o, x, y, w, h, n) {
    const u = o.uid, a = amt(o), p = h / n, hs = p * (1.08 - .76 * a);
    let s = "";
    for (let i = 0; i < n; i++) {
      const yy = y + i * p + (p - hs) / 2;
      if (a > .05) s += shadowLine(f1(x), f1(yy + hs), f1(w), f1(Math.min(3, p - hs + .1)), .2);
      s += `<rect x="${f1(x)}" y="${f1(yy)}" width="${f1(w)}" height="${f1(hs)}" rx="${f1(Math.min(2.5, hs / 2))}" fill="url(#${u}-slat)"/><rect x="${f1(x + 1)}" y="${f1(yy + hs * .22)}" width="${f1(w - 2)}" height=".7" fill="#fff" opacity=".45"/>`;
    }
    return s;
  }
  // (parts) PV = the Multi-Function readings (0..1, null = part not ticked) while a Multi-Function Image renders, else null
  let PV = null;
  const pv = (k, d) => (PV ? (PV[k] == null ? 0 : PV[k]) : d);
  // raised blinds: the slats left below the open ones pile up flat on the bottom rail
  function pile(o, x, y, w, k, kind) {
    const fill = kind === "alu" ? `url(#${o.uid}-alu)` : `url(#${o.uid}-slat)`; let s = "";
    for (let i = 0; i < k; i++) { const yy = y + i * 2.2; s += `<rect x="${f1(x)}" y="${f1(yy)}" width="${f1(w)}" height="2.2" rx=".5" fill="${fill}"/><rect x="${f1(x)}" y="${f1(yy + 1.8)}" width="${f1(w)}" height=".4" fill="#000" opacity=".4"/>`; }
    return s;
  }
  function drape(o, x0, x1, top, bot, n, kind) {
    const u = o.uid, fw = (x1 - x0) / n, e = (b) => (b % 2 ? 2.6 : 0);
    let s = "";
    for (let j = 0; j < n; j++) {
      const xa = x0 + j * fw, xb = xa + fw;
      s += `<path d="M${f1(xa)} ${top}H${f1(xb + .3)}V${f1(bot + e(j + 1))}Q${f1(xa + fw / 2)} ${f1(bot + 2.8)} ${f1(xa)} ${f1(bot + e(j))}Z" fill="url(#${u}-${kind || "fold"})"/>`;
    }
    return s;
  }
  function combEdge(o, x, w, y1, y2) {
    if (y2 - y1 < 4) return "";
    let d = "";
    for (let yy = y1; yy < y2 - 2; yy += 8) { const y3 = Math.min(yy + 8, y2); d += `M${f1(x)} ${f1(yy)}l-2.2 ${f1((y3 - yy) / 2)}L${f1(x)} ${f1(y3)}M${f1(x + w)} ${f1(yy)}l2.2 ${f1((y3 - yy) / 2)}L${f1(x + w)} ${f1(y3)}`; }
    return `<path d="${d}" fill="none" stroke="${H().shade(o.color, -.3)}" stroke-width="1.1" stroke-linejoin="round"/>`;
  }
  const pinch = (x0, x1, top, n) => { let s = ""; const fw = (x1 - x0) / n; for (let j = 1; j < n; j++) s += `<path d="M${f1(x0 + j * fw)} ${top + 1}v6" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`; return s; };

  const icons = [];
  const add = (id, name, colors, label, render) => icons.push({ id, name, colors, picker: true, colorLabel: label, render });

  add("roller", "Roller shade", sw(FAB), "Fabric", (o) => {
    const a = amt(o), g = G.roller, { x, y, w, h } = g, u = o.uid;
    const fb = y + 8 + (h - 12) * (1 - a);
    return svg(o, stdWindow(o, g) +
      `<g${an(o, "soft")}>` + fabric(o, x + 2, y + 5, w - 4, fb - y - 5, .9) +
      `<rect x="${x}" y="${y + 6}" width="2" height="${f1(fb - y - 6)}" fill="#fff6dc" opacity=".6"/><rect x="${x + w - 2}" y="${y + 6}" width="2" height="${f1(fb - y - 6)}" fill="#fff6dc" opacity=".6"/>` +
      hem(o, x + 1, fb, w - 2) + `</g>` +
      `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="9" rx="4.5" fill="url(#${u}-roll)"/><rect x="${x - 4}" y="${y - 3}" width="5" height="11" rx="1.2" fill="url(#${u}-metal)"/><rect x="${x + w - 1}" y="${y - 3}" width="5" height="11" rx="1.2" fill="url(#${u}-metal)"/>` +
      led(o, x + w + 1.5, y + 5) + stdSill(o, g));
  });

  add("blackout", "Blackout roller", sw(FAB, "#3c4047"), "Fabric", (o) => {
    const a = amt(o), g = G.blackout, { x, y, w, h } = g, u = o.uid;
    const fb = y + 10 + (h - 14) * (1 - a), fs = PV && PV.sheer != null ? y + 10 + (h - 14) * (1 - PV.sheer) : 0;
    return svg(o, stdWindow(o, g) +
      `<rect x="${x}" y="${y}" width="4" height="${h}" fill="url(#${u}-dmetal)"/><rect x="${x + w - 4}" y="${y}" width="4" height="${h}" fill="url(#${u}-dmetal)"/>` +
      (fs ? `<rect x="${x + 4}" y="${y + 8}" width="${w - 8}" height="${f1(fs - y - 8)}" fill="#f4f1ea" opacity=".55"/><rect x="${x + 4}" y="${y + 8}" width="${w - 8}" height="${f1(fs - y - 8)}" fill="url(#${u}-wv)" opacity=".5"/>` + hem(o, x + 4, fs, w - 8, `url(#${u}-metal)`) : "") +
      `<rect x="${x + 4}" y="${y + 8}" width="${w - 8}" height="${f1(fb - y - 8)}" fill="url(#${u}-fv)"/><rect x="${x + 4}" y="${y + 8}" width="${w - 8}" height="${f1(fb - y - 8)}" fill="url(#${u}-fx)" opacity=".35"/>` +
      hem(o, x + 3, fb, w - 6, `url(#${u}-dmetal)`) +
      `<rect x="${x - 7}" y="${y - 9}" width="${w + 14}" height="17" rx="2" fill="url(#${u}-roll)"/><rect x="${x - 7}" y="${y - 9}" width="${w + 14}" height="2" fill="#fff" opacity=".25"/><rect x="${x - 7}" y="${y + 6}" width="${w + 14}" height="2" fill="#000" opacity=".3"/>` +
      led(o, x + w + 2, y - 1) + stdSill(o, g) +
      `<rect class="hda-bg" width="200" height="200" fill="#07060c" opacity="${f2((1 - a) * .3)}"/>`);
  });

  add("cellular", "Cellular shade", sw(FAB, "#f6f4ef"), "Fabric", (o) => {
    const a = amt(o), g = G.cellular, { x, y, w, h } = g, u = o.uid;
    const fb = y + 12 + (h - 16) * (1 - a);
    return svg(o, stdWindow(o, g) +
      `<g${an(o, "soft")}><rect x="${x + 2}" y="${y + 6}" width="${w - 4}" height="${f1(fb - y - 6)}" fill="url(#${u}-cell)" opacity=".94"/>` +
      `<rect x="${x + 2}" y="${y + 6}" width="${w - 4}" height="${f1(fb - y - 6)}" fill="url(#${u}-fx)" opacity=".25"/>` +
      combEdge(o, x + 2, w - 4, y + 6, fb) + hem(o, x + 1, fb, w - 2, `url(#${u}-roll)`) + `</g>` +
      `<rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="8" rx="2" fill="url(#${u}-roll)"/><rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="1.4" fill="#fff" opacity=".4"/>` + stdSill(o, g));
  });

  add("tdbu", "Top-down shade", sw(FAB, "#a3a7aa"), "Fabric", (o) => {
    const a = amt(o), g = G.tdbu, { x, y, w, h } = g, u = o.uid;
    let ty = y + 7 + h * .56 * a, by = y + h - 4 - h * .08 * a;
    if (PV) { ty = y + 7 + (h - 17) * pv("top", 0); by = y + h - 4 - (h - 17) * pv("bottom", 0); if (by < ty + 6) { const m = Math.min(Math.max((ty + by) / 2, y + 10), y + h - 7); ty = m - 3; by = m + 3; } }
    const cords = `<path d="M${x + 18} ${y + 6}V${f1(ty)}M${x + w - 18} ${y + 6}V${f1(ty)}" stroke="#eee" stroke-opacity=".7" stroke-width=".6"/>`;
    return svg(o, stdWindow(o, g) + cords +
      `<rect x="${x + 2}" y="${f1(ty)}" width="${w - 4}" height="${f1(by - ty)}" fill="url(#${u}-cell)" opacity=".95"/><rect x="${x + 2}" y="${f1(ty)}" width="${w - 4}" height="${f1(by - ty)}" fill="url(#${u}-fx)" opacity=".25"/>` +
      combEdge(o, x + 2, w - 4, ty, by) + hem(o, x + 1, ty - 2, w - 2, `url(#${u}-roll)`) + hem(o, x + 1, by, w - 2, `url(#${u}-roll)`) +
      `<rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="7" rx="2" fill="url(#${u}-roll)"/>` + stdSill(o, g));
  });

  add("roman", "Roman shade", sw(FAB, "#3a5577"), "Fabric", (o) => {
    const a = amt(o), g = G.roman, x = g.x - 5, y = g.y - 2, w = g.w + 10, h = g.h + 6, u = o.uid, hh = H();
    const n = a > .03 ? Math.round(1 + a * 4) : 0, fh = 8;
    const stackH = n ? n * fh * .72 + fh * .28 : 0;
    const fb = y + Math.max(stackH + 6, h * (1 - a * .92));
    const flatB = fb - stackH;
    let s = fabric(o, x, y, w, flatB - y);
    if (!n) { for (let yy = y + 20; yy < flatB - 6; yy += 20) s += `<rect x="${x}" y="${yy}" width="${w}" height=".8" fill="#000" opacity=".12"/><rect x="${x}" y="${yy + .8}" width="${w}" height=".6" fill="#fff" opacity=".12"/>`;
      s += `<rect x="${x}" y="${f1(fb - 10)}" width="${w}" height="4" fill="${hh.shade(o.color, -.35)}"/>`; }
    for (let i = n - 1; i >= 0; i--) {
      const yy = fb - fh - i * fh * .72;
      s += `<rect x="${x - .5}" y="${f1(yy)}" width="${w + 1}" height="${fh}" rx="3.6" fill="url(#${u}-cg)"/><rect x="${x}" y="${f1(yy)}" width="${w}" height="${fh}" rx="3.6" fill="url(#${u}-wv)"/><rect x="${x + 2}" y="${f1(yy + 1.4)}" width="${w - 4}" height=".9" fill="#fff" opacity=".35"/>`;
      if (i === 0) s += `<rect x="${x}" y="${f1(yy + fh - 3.6)}" width="${w}" height="2.2" fill="${hh.shade(o.color, -.35)}"/>`;
    }
    return svg(o, stdWindow(o, g) + `<rect x="${x + 2}" y="${f1(fb)}" width="${w - 4}" height="3" fill="#000" opacity=".2"/>` + `<g${an(o, "soft")}>${s}</g>` +
      `<rect x="${x - 1}" y="${y - 7}" width="${w + 2}" height="8" rx="1.5" fill="url(#${u}-roll)"/>` + stdSill(o, g));
  });

  add("wood", "Wood blinds", sw(WOOD), "Slats", (o) => {
    const g = G.wood, { x, y, w } = g, u = o.uid, a = amt(o), nO = Math.round(12 * (1 - pv("lift", 0))), ho = (g.h - 2) * nO / 12, h = PV ? ho + (12 - nO) * 2.2 + 2 : g.h;
    const tape = H().shade(o.color, -.12);
    return svg(o, stdWindow(o, g) +
      (PV ? slats(o, x - 4, y + 2, w + 8, ho, nO, "wood") + pile(o, x - 4, y + 2 + ho, w + 8, 12 - nO, "wood") : slats(o, x - 4, y + 2, w + 8, h - 2, 12, "wood")) +
      `<rect x="${x + 14}" y="${y + 1}" width="6" height="${h + 3}" fill="${tape}" opacity=".95"/><rect x="${x + w - 20}" y="${y + 1}" width="6" height="${h + 3}" fill="${tape}" opacity=".95"/><path d="M${x + 14} ${y}v${h + 4}M${x + 20} ${y}v${h + 4}M${x + w - 20} ${y}v${h + 4}M${x + w - 14} ${y}v${h + 4}" stroke="#000" stroke-opacity=".18" stroke-width=".5"/>` +
      `<rect x="${x - 5}" y="${y + h - 1}" width="${w + 10}" height="6" rx="1.2" fill="url(#${u}-slat)"/><rect x="${x - 5}" y="${y + h - 1}" width="${w + 10}" height="6" fill="url(#${u}-grain)"/>` +
      `<rect x="${x - 7}" y="${y - 9}" width="${w + 14}" height="11" rx="1.5" fill="url(#${u}-slat)"/><rect x="${x - 7}" y="${y - 9}" width="${w + 14}" height="11" fill="url(#${u}-grain)"/><rect x="${x - 7}" y="${y - 9}" width="${w + 14}" height="1.4" fill="#fff" opacity=".35"/>` +
      `<path d="M${x - 1} ${y + 2}V${y + 58}" stroke="#eef3f6" stroke-opacity=".75" stroke-width="1.8" stroke-linecap="round" transform="rotate(${f1(a * 6)} ${x - 1} ${y + 2})"/>` + stdSill(o, g));
  });

  add("mini", "Mini blinds", sw(ALU), "Slats", (o) => {
    const g = G.mini, { x, y, w } = g, u = o.uid, nO = Math.round(22 * (1 - pv("lift", 0))), ho = (g.h - 9) * nO / 22, h = PV ? ho + (22 - nO) * 2.2 + 9 : g.h;
    return svg(o, stdWindow(o, g) +
      (PV ? slats(o, x + 1, y + 6, w - 2, ho, nO, "alu") + pile(o, x + 1, y + 6 + ho, w - 2, 22 - nO, "alu") : slats(o, x + 1, y + 6, w - 2, h - 9, 22, "alu")) +
      `<path d="M${x + 24} ${y + 5}V${y + h - 2}M${x + w - 24} ${y + 5}V${y + h - 2}" stroke="#f2f2f2" stroke-opacity=".55" stroke-width=".55"/>` +
      `<rect x="${x + 1}" y="${y + h - 4}" width="${w - 2}" height="3.4" rx="1" fill="url(#${u}-alu)"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="6" rx="1" fill="url(#${u}-alu)"/><rect x="${x}" y="${y}" width="${w}" height="1" fill="#fff" opacity=".5"/>` +
      `<path d="M${x + 7} ${y + 6}V${y + 66}" stroke="#e7f2f8" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/><path d="M${x + 6.4} ${y + 8}V${y + 64}" stroke="#fff" stroke-opacity=".7" stroke-width=".4"/>` + stdSill(o, g));
  });

  add("vertical", "Vertical blinds", sw(FAB, "#f6f4ef"), "Fabric", (o) => {
    const a = amt(o), x = 36, y = 26, w = 128, h = 150, u = o.uid, n = 12, p = w / n, ta = pv("tilt", a), sp = PV ? p * (1 - .8 * pv("lift", 0)) : p, vw = p * (1.1 - .86 * ta);
    let v = "", chain = [];
    for (let i = 0; i < n; i++) {
      const cx = x + sp * (i + .5);
      v += `<rect x="${f1(cx - vw / 2)}" y="${y + 6}" width="${f1(vw)}" height="${h - 10}" fill="url(#${u}-fx)"/><rect x="${f1(cx - vw / 2)}" y="${y + 6}" width="${f1(vw)}" height="${h - 10}" fill="url(#${u}-wv)"/><rect x="${f1(cx - vw / 2)}" y="${y + h - 6}" width="${f1(vw)}" height="2" fill="#000" opacity=".2"/>`;
      if (ta > .05 && (!PV || sp > vw)) v += shadowLine(f1(cx + vw / 2), y + 6, f1(Math.min(2, sp - vw)), h - 10, .14);
      chain.push(f1(cx));
    }
    return svg(o, room(o, { wall: "#776d5d", x, y, w, h, floor: 182 }) + trim(o, x, y, w, h, 6) + view(o, x, y, w, h) + sash(x, y, w, h, "v") +
      `<rect x="${x + w / 2 + 3}" y="${y + 70}" width="2.4" height="16" rx="1.2" fill="#9aa0a6"/>` +
      `<g${an(o, "soft")}>${v}</g><path d="M${chain[0]} ${y + h - 6}H${chain[n - 1]}" stroke="#d8d8d8" stroke-opacity=".6" stroke-width=".7" stroke-dasharray="1.4 1"/>` +
      `<rect x="${x - 2}" y="${y}" width="${w + 4}" height="6" rx="1" fill="url(#${u}-metal)"/>`);
  });

  add("zebra", "Zebra shade", sw(FAB, "#a3a7aa"), "Fabric", (o) => {
    const a = amt(o), g = G.zebra, { x, y, w, h } = g, u = o.uid;
    const phase = PV ? pv("tilt", 0) : cl(a * 2, 0, 1), rise = PV ? pv("lift", 0) : cl((a - .5) * 2, 0, 1);
    const top = y + 8, fb = top + (h - 12) * (1 - .82 * rise);
    let s = `<rect x="${x + 2}" y="${top}" width="${w - 4}" height="${f1(fb - top)}" fill="url(#${u}-fv)" opacity="${f2(.96 - .66 * phase)}"/>`;
    for (let yy = top; yy < fb - 1; yy += 12) {
      const bh = Math.min(6.5, fb - yy);
      s += `<rect x="${x + 2}" y="${f1(yy)}" width="${w - 4}" height="${f1(bh)}" fill="url(#${u}-fv)"/><rect x="${x + 2}" y="${f1(yy)}" width="${w - 4}" height="${f1(bh)}" fill="url(#${u}-wv)"/><rect x="${x + 2}" y="${f1(yy)}" width="${w - 4}" height=".8" fill="#fff" opacity=".3"/><rect x="${x + 2}" y="${f1(yy + bh - .8)}" width="${w - 4}" height=".8" fill="#000" opacity=".22"/>`;
    }
    return svg(o, stdWindow(o, g) + `<g${an(o, "soft")}>${s}` + hem(o, x + 1, fb, w - 2, `url(#${u}-roll)`) + `</g>` +
      `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="12" rx="3" fill="url(#${u}-metal)"/><rect x="${x - 4}" y="${y + 5}" width="${w + 8}" height="2" fill="#000" opacity=".25"/>` + led(o, x + w, y + 2) + stdSill(o, g));
  });

  add("drapes", "Motorized drapes", sw(FAB, "#3a5577"), "Fabric", (o) => {
    const a = amt(o), u = o.uid, top = 28, bot = 176, half = 76;
    const lw = half * (1 - .8 * a), lx1 = 24 + lw, rx0 = 176 - lw;
    return svg(o, room(o, { wall: "#5c5468", x: 60, y: 42, w: 80, h: 94 }) + trim(o, 60, 42, 80, 94) + view(o, 60, 42, 80, 94) + sash(60, 42, 80, 94, "cross") + sill(o, 50, 142, 100) +
      `<rect x="26" y="${top}" width="${f1(lw)}" height="${bot - top}" fill="#000" opacity=".22"/><rect x="${f1(rx0 + 2)}" y="${top}" width="${f1(lw)}" height="${bot - top}" fill="#000" opacity=".22"/>` +
      `<g${an(o, "soft")}>${drape(o, 24, lx1, top, bot, 5)}${pinch(24, lx1, top, 5)}</g><g${an(o, "soft")}>${drape(o, rx0, 176, top, bot, 5)}${pinch(rx0, 176, top, 5)}</g>` +
      `<rect x="20" y="22" width="160" height="6" rx="1.5" fill="url(#${u}-dmetal)"/><rect x="170" y="19" width="16" height="12" rx="3" fill="url(#${u}-dmetal)"/>` + led(o, 181, 25));
  });

  add("sheer", "Sheer curtains", sw(SHEER), "Fabric", (o) => {
    const a = amt(o), u = o.uid, top = 31, bot = 177, half = 68;
    const lw = half * (1 - .74 * a), lx1 = 32 + lw, rx0 = 168 - lw;
    const panel = (x0, x1, cl2) => `<g${an(o, cl2)}><rect x="${f1(x0)}" y="${top}" width="${f1(x1 - x0)}" height="${bot - top}" fill="${o.color}" opacity=".3"/>${drape(o, x0, x1, top, bot, 9, "sfold")}</g>`;
    let rings = ""; for (let i = 0; i < 6; i++) { rings += `<ellipse cx="${f1(34 + i * (lw - 4) / 5)}" cy="30" rx="2.2" ry="3" fill="none" stroke="url(#${u}-brass)" stroke-width="1"/><ellipse cx="${f1(166 - i * (lw - 4) / 5)}" cy="30" rx="2.2" ry="3" fill="none" stroke="url(#${u}-brass)" stroke-width="1"/>`; }
    return svg(o, room(o, { wall: "#7a676c", x: 58, y: 44, w: 84, h: 92 }) + trim(o, 58, 44, 84, 92) + view(o, 58, 44, 84, 92) + sash(58, 44, 84, 92, "cross") + sill(o, 48, 142, 104) +
      panel(32, lx1, "sway") + panel(rx0, 168, "sway2") +
      `<rect x="26" y="28.5" width="148" height="3" rx="1.5" fill="url(#${u}-brass)"/><circle cx="25" cy="30" r="4" fill="url(#${u}-brass)"/><circle cx="175" cy="30" r="4" fill="url(#${u}-brass)"/>` + rings);
  });

  // the sheers parted (Multi-Function, sheer part open): two panels gathered toward the sides, their pleats bunched closer
  function sheers(o, top, bot, sw2) {
    let t = "";
    [[36, 36 + sw2], [164 - sw2, 164]].forEach(([a0, a1]) => { t += `<rect x="${f1(a0)}" y="${top}" width="${f1(a1 - a0)}" height="${bot - top}" fill="#f5f2ea" opacity=".5"/>`; for (let i = 0; i < 8; i++) t += `<rect x="${f1(a0 + (i + .2) * (a1 - a0) / 8)}" y="${top}" width="${f1(Math.max(1, 3.5 * (a1 - a0) / 64))}" height="${bot - top}" fill="#fff" opacity=".26"/>`; });
    return `<g${an(o, "sway2")}>${t}</g>`;
  }
  add("layered", "Drapes over sheers", sw(FAB, "#b9805f"), "Fabric", (o) => {
    const a = amt(o), u = o.uid, top = 30, bot = 177, half = 64;
    const lw = half * (1 - .78 * a), lx1 = 28 + lw, rx0 = 172 - lw;
    let sv = ""; for (let i = 0; i < 16; i++) sv += `<rect x="${36 + i * 8}" y="${top}" width="3.5" height="${bot - top}" fill="#fff" opacity=".22"/>`;
    return svg(o, room(o, { wall: "#3d485b", x: 60, y: 44, w: 80, h: 92 }) + trim(o, 60, 44, 80, 92) + view(o, 60, 44, 80, 92) + sash(60, 44, 80, 92, "cross") + sill(o, 50, 142, 100) +
      (PV && pv("sheer", 0) > 0 ? sheers(o, top, bot, 64 * (1 - .8 * pv("sheer", 0))) : `<g${an(o, "sway2")}><rect x="36" y="${top}" width="128" height="${bot - top}" fill="#f5f2ea" opacity=".42"/>${sv}</g>`) +
      `<rect x="30" y="${top}" width="${f1(lw)}" height="${bot - top}" fill="#000" opacity=".25"/><rect x="${f1(rx0 + 2)}" y="${top}" width="${f1(lw)}" height="${bot - top}" fill="#000" opacity=".25"/>` +
      `<g${an(o, "soft")}>${drape(o, 28, lx1, top, bot, 6)}</g><g${an(o, "soft")}>${drape(o, rx0, 172, top, bot, 6)}</g>` +
      `<rect x="22" y="25.5" width="156" height="4.4" rx="2.2" fill="url(#${u}-trunk)"/><circle cx="20" cy="27.7" r="4.6" fill="url(#${u}-trunk)"/><circle cx="180" cy="27.7" r="4.6" fill="url(#${u}-trunk)"/><circle cx="18.6" cy="26.3" r="1.4" fill="#fff" opacity=".3"/><circle cx="178.6" cy="26.3" r="1.4" fill="#fff" opacity=".3"/>`);
  });

  add("cafe", "Cafe curtains", sw(["#c0463c", "#3a5577", "#5d8a55", "#d9a441", "#333333"]), "Fabric", (o) => {
    const a = amt(o), u = o.uid, x = 50, y = 32, w = 100, h = 96;
    const tile = `<pattern id="${u}-tile" width="14" height="7" patternUnits="userSpaceOnUse"><rect width="14" height="7" fill="#efece6"/><path d="M0 6.5H14M7 0V3M0 3H14M14 3V7M0 3V7" stroke="#c4bfb4" stroke-width=".6"/><rect width="14" height="1.2" fill="#fff" opacity=".5"/></pattern>`;
    const lw = 56 * (1 - .76 * a), rod = 84, cb = 128;
    const panel = (x0, x1, c2) => { let f = ""; const n = 5, fw = (x1 - x0) / n; for (let j = 0; j < n; j++) f += `<rect x="${f1(x0 + j * fw)}" y="${rod}" width="${f1(fw + .3)}" height="${cb - rod}" fill="url(#${u}-fsh)"/>`;
      let ruf = ""; for (let xx = x0 + 2; xx < x1 - 1; xx += 4) ruf += `<circle cx="${f1(xx)}" cy="${rod - 1}" r="2.4" fill="url(#${u}-ging)"/>`;
      return `<g${an(o, c2)}><rect x="${f1(x0)}" y="${rod}" width="${f1(x1 - x0)}" height="${cb - rod}" fill="url(#${u}-ging)"/>${f}<path d="M${f1(x0)} ${cb}H${f1(x1)}" stroke="#000" stroke-opacity=".2" stroke-width="1.2"/>${ruf}</g>`; };
    let val = `<path d="M42 24H158V40` ; for (let i = 0; i < 6; i++) { const xe = 158 - (i + 1) * 116 / 6; val += `Q${f1(xe + 116 / 12)} 49 ${f1(xe)} 40`; } val += "Z";
    let vf = ""; for (let i = 0; i < 9; i++) vf += `<rect x="${f1(42 + i * 116 / 9)}" y="24" width="${f1(116 / 9)}" height="25" fill="url(#${u}-fsh)"/>`;
    return svg(o, room(o, { wall: "#6f7a6a", x, y, w, h, noFloor: true }) +
      `<g class="hda-bg"><rect y="134" width="200" height="40" fill="url(#${u}-tile)"/><rect y="172" width="200" height="8" fill="#9a958d"/><rect y="172" width="200" height="1.5" fill="#fff" opacity=".6"/><rect y="180" width="200" height="20" fill="#3e4c50"/><path d="M66 180V200M134 180V200" stroke="#000" stroke-opacity=".35"/><rect x="58" y="186" width="5" height="1.6" rx=".8" fill="#c9ccd0"/><rect x="137" y="186" width="5" height="1.6" rx=".8" fill="#c9ccd0"/></g>` +
      trim(o, x, y, w, h) + view(o, x, y, w, h) + sash(x, y, w, h, "h") + sill(o, 40, 134, 120) +
      `<g class="hda-bg"><path d="M128 120L130 134H140L142 120Z" fill="#b8643f"/><rect x="127" y="118" width="16" height="3" rx="1" fill="#c97750"/><g fill="url(#${u}-leaf)"><ellipse cx="132" cy="113" rx="4" ry="6" transform="rotate(-20 132 113)"/><ellipse cx="138" cy="112" rx="4" ry="6.5" transform="rotate(18 138 112)"/><ellipse cx="135" cy="109" rx="3.4" ry="6"/></g></g>` +
      panel(44, 44 + lw, "sway") + panel(156 - lw, 156, "sway2") +
      `<rect x="44" y="${rod - 2}" width="112" height="2" rx="1" fill="url(#${u}-brass)"/>` +
      `<g${an(o, "soft")}><path d="${val}" fill="url(#${u}-ging)"/><g clip-path="url(#${u}-vc)">${vf}</g><path d="${val}" fill="none" stroke="#000" stroke-opacity=".15"/></g><clipPath id="${u}-vc"><path d="${val}"/></clipPath>`, tile);
  });

  add("shutters", "Plantation shutters", sw(PAINT), "Finish", (o) => {
    const g = G.shutters, { x, y, w, h } = g, u = o.uid, a = amt(o);
    const panel = (px) => {
      const pw = w / 2, mid = y + 50;
      let s = louvers(o, px + 5, y + 6, pw - 10, mid - y - 8, 5) + louvers(o, px + 5, mid + 3, pw - 10, y + h - mid - 9, 5);
      const rod = (y1, y2) => `<rect x="${px + pw / 2 - 1.3}" y="${y1}" width="2.6" height="${y2 - y1}" rx="1.3" fill="url(#${u}-stile)"/><rect x="${px + pw / 2 - 1.3}" y="${y1}" width="2.6" height="${y2 - y1}" fill="#000" opacity="${f2(.25 * a)}"/>`;
      s += rod(y + 7, mid - 3) + rod(mid + 4, y + h - 7);
      s += `<rect x="${px}" y="${y}" width="5" height="${h}" fill="url(#${u}-stile)"/><rect x="${px + pw - 5}" y="${y}" width="5" height="${h}" fill="url(#${u}-stile)"/>` +
        `<rect x="${px}" y="${y}" width="${pw}" height="6" fill="url(#${u}-slat)"/><rect x="${px}" y="${mid - 2}" width="${pw}" height="5" fill="url(#${u}-slat)"/><rect x="${px}" y="${y + h - 6}" width="${pw}" height="6" fill="url(#${u}-slat)"/>` +
        `<rect x="${px}" y="${y}" width="${pw}" height="${h}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".7"/>`;
      return s;
    };
    return svg(o, stdWindow(o, g) + panel(x) + panel(x + w / 2) +
      `<rect x="${x - 1}" y="${y + 14}" width="2.5" height="9" rx=".8" fill="#8b8f95"/><rect x="${x - 1}" y="${y + h - 23}" width="2.5" height="9" rx=".8" fill="#8b8f95"/><rect x="${x + w - 1.5}" y="${y + 14}" width="2.5" height="9" rx=".8" fill="#8b8f95"/><rect x="${x + w - 1.5}" y="${y + h - 23}" width="2.5" height="9" rx=".8" fill="#8b8f95"/>` + stdSill(o, g));
  });

  add("skylight", "Skylight shade", sw(FAB, "#f6f4ef"), "Fabric", (o) => {
    const a = amt(o), u = o.uid;
    const xl = (yy) => 64 - 20 * (yy - 40) / 92, xr = (yy) => 136 + 20 * (yy - 40) / 92;
    const inner = "M64 40H136L156 132H44Z";
    const yb = 40 + 4 + 88 * (1 - a);
    let pl = "";
    for (let yy = 44, i = 0; yy < yb - .5; yy += 5.2, i++) { const y2 = Math.min(yy + 5.2, yb); pl += `<path d="M${f1(xl(yy))} ${f1(yy)}H${f1(xr(yy))}L${f1(xr(y2))} ${f1(y2)}H${f1(xl(y2))}Z" fill="${i % 2 ? `url(#${u}-fv)` : H().shade(o.color, .18)}"/>`; }
    return svg(o, `<g class="hda-bg"><rect width="200" height="200" fill="#6a625a"/><rect width="200" height="200" fill="url(#${u}-wall)"/>` +
      (a > 0 ? `<ellipse cx="100" cy="88" rx="96" ry="84" fill="url(#${u}-day)" opacity="${f2(.25 + .6 * a)}"/>` : "") +
      `<path d="M50 26H150L176 150H24Z" fill="#000" opacity=".2" transform="translate(2 3)"/>` +
      `<path d="M50 26H150L136 40H64Z" fill="#8a8279"/><path d="M50 26L64 40L44 132L24 150Z" fill="#b1a99e"/><path d="M150 26L176 150L156 132L136 40Z" fill="#9f978d"/><path d="M44 132H156L176 150H24Z" fill="#dcd5c9"/></g>` +
      view(o, 44, 40, 112, 92, { clip: inner, up: true }) +
      `<path d="${inner}" fill="none" stroke="#e9e6df" stroke-width="3"/><path d="M100 40V132" stroke="#e9e6df" stroke-width="2"/>` +
      `<g>${pl}</g><path d="M64 40L44 132M136 40L156 132" stroke="url(#${u}-metal)" stroke-width="2.4"/>` +
      `<path d="M${f1(xl(yb) - 1)} ${f1(yb)}H${f1(xr(yb) + 1)}" stroke="url(#${u}-metal)" stroke-width="3.4" stroke-linecap="round"/>` +
      `<rect x="88" y="35" width="24" height="6" rx="2" fill="url(#${u}-dmetal)"/><rect x="91" y="36.3" width="12" height="3.4" fill="#26324a"/><path d="M95 36.3V39.7M99 36.3V39.7" stroke="#6b85b5" stroke-width=".4"/>` + led(o, 108, 38));
  });

  add("solar", "Solar screen", sw(SCR), "Screen", (o) => {
    const a = amt(o), u = o.uid, x = 52, y = 48, w = 96, h = 88;
    const sid = `<pattern id="${u}-sid" width="20" height="8" patternUnits="userSpaceOnUse"><rect width="20" height="8" fill="#c7ced2"/><rect width="20" height="3" fill="#dde2e5"/><rect y="7" width="20" height="1" fill="#7d878d"/></pattern>`;
    const fb = y + 2 + (h - 2) * (1 - a);
    return svg(o, `<g class="hda-bg"><rect width="200" height="200" fill="url(#${u}-sid)"/><rect width="200" height="200" fill="url(#${u}-wall)" opacity=".18"/>` +
      `<rect width="200" height="14" fill="#efebe3"/><rect y="14" width="200" height="8" fill="#000" opacity=".22"/></g>` +
      trim(o, x, y, w, h, 8) + glassOut(o, x, y, w, h) + sash(x, y, w, h, "cross", "#f2f0ea") +
      `<rect x="${x - 3}" y="${y}" width="4" height="${h}" fill="${H().shade(o.color, -.15)}"/><rect x="${x + w - 1}" y="${y}" width="4" height="${h}" fill="${H().shade(o.color, -.15)}"/>` +
      `<g${an(o, "soft")}><rect x="${x + 1}" y="${y}" width="${w - 2}" height="${f1(fb - y)}" fill="${o.color}" opacity=".86"/><rect x="${x + 1}" y="${y}" width="${w - 2}" height="${f1(fb - y)}" fill="url(#${u}-mesh)"/><rect x="${x + 1}" y="${y}" width="${w - 2}" height="${f1(fb - y)}" fill="url(#${u}-refl)" opacity=".25"/>` +
      hem(o, x - 1, fb - 2, w + 2, `url(#${u}-dmetal)`) + `</g>` +
      `<rect x="${x - 8}" y="${y - 12}" width="${w + 16}" height="13" rx="2" fill="${H().shade(o.color, -.1)}"/><rect x="${x - 8}" y="${y - 12}" width="${w + 16}" height="13" rx="2" fill="url(#${u}-roll)" opacity=".4"/><rect x="${x - 8}" y="${y - 12}" width="${w + 16}" height="1.5" fill="#fff" opacity=".35"/>` + led(o, x + w + 4, y - 6) +
      sill(o, x - 12, y + h + 8, w + 24) +
      `<g class="hda-bg"><g fill="#2c5f2b"><circle cx="40" cy="190" r="22"/><circle cx="160" cy="192" r="22"/><circle cx="100" cy="198" r="18"/></g><g fill="url(#${u}-leaf)"><circle cx="34" cy="184" r="17"/><circle cx="58" cy="190" r="14"/><circle cx="150" cy="186" r="17"/><circle cx="172" cy="192" r="14"/><circle cx="96" cy="194" r="14"/><circle cx="114" cy="196" r="11"/></g></g>`, sid);
  });

  add("awning", "Retractable awning", sw(AWN), "Fabric", (o) => {
    const a = amt(o), u = o.uid, hh = H();
    const stuc = `<linearGradient id="${u}-stuc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdbda6"/><stop offset="1" stop-color="#a99880"/></linearGradient>`;
    const x0 = 28, x1 = 172, yt = 48, yb = yt + 4 + 70 * a, sp = 14 * a, bx0 = x0 - sp, bx1 = x1 + sp, n = 10;
    let st = "", val = "";
    if (a > .03) {
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n, c = i % 2 ? "#f3ecdc" : o.color;
        const ta = x0 + (x1 - x0) * t0, tb = x0 + (x1 - x0) * t1, ba = bx0 + (bx1 - bx0) * t0, bb = bx0 + (bx1 - bx0) * t1;
        st += `<path d="M${f1(ta)} ${yt}H${f1(tb)}L${f1(bb)} ${f1(yb)}H${f1(ba)}Z" fill="${c}"/>`;
        val += `<path d="M${f1(ba)} ${f1(yb)}H${f1(bb)}V${f1(yb + 6)}Q${f1((ba + bb) / 2)} ${f1(yb + 12)} ${f1(ba)} ${f1(yb + 6)}Z" fill="${c}"/>`;
      }
    }
    const shade = a > .03 ? `<path d="M${x0} ${yt}H${x1}L${x1 + 4} ${f1(yt + 62 * a)}H${x0 - 4}Z" fill="#000" opacity="${f2(.32 * a)}"/>` : "";
    return svg(o, `<g class="hda-bg"><rect width="200" height="200" fill="url(#${u}-stuc)"/><rect width="200" height="20" fill="url(#${u}-sky)"/><rect y="18" width="200" height="7" fill="#4b3a2e"/><rect y="25" width="200" height="3" fill="#000" opacity=".25"/>` +
      `<circle cx="176" cy="6" r="14" fill="url(#${u}-sun)"/>` +
      `<rect y="178" width="200" height="22" fill="#8d8a84"/><path d="M0 186H200M0 193H200M30 178V186M80 186V193M130 178V186M170 186V193M55 193V200M115 193V200" stroke="#5f5c57" stroke-width=".7"/></g>` +
      `<rect x="56" y="92" width="88" height="86" fill="#3a332c"/>` + glassOut(o, 60, 96, 80, 82) + `<rect x="98.5" y="96" width="3" height="82" fill="#3a332c"/><rect x="94" y="130" width="2" height="14" rx="1" fill="#c9ccd0"/>` +
      `<g class="hda-bg"><path d="M156 162H180L176 178H160Z" fill="#a85e3e"/><g fill="url(#${u}-leaf)"><circle cx="164" cy="156" r="7"/><circle cx="173" cy="154" r="6.5"/><circle cx="168" cy="148" r="6"/></g></g>` +
      shade +
      (a > .03 ? `<path d="M${x0 + 3} ${yt + 34}L${f1(bx0 + 8)} ${f1(yb)}M${x1 - 3} ${yt + 34}L${f1(bx1 - 8)} ${f1(yb)}" stroke="url(#${u}-dmetal)" stroke-width="2.6" stroke-linecap="round"/>` : "") +
      `<g>${st}</g>` + (a > .03 ? `<path d="M${x0} ${yt}H${x1}L${f1(bx1)} ${f1(yb)}H${f1(bx0)}Z" fill="url(#${u}-fv)" opacity=".0"/><path d="M${x0} ${yt}H${x1}L${f1(bx1)} ${f1(yb)}H${f1(bx0)}Z" fill="#000" opacity=".12"/>` : "") +
      (a > .03 ? `<g${an(o, "flap")}>${val}</g><rect x="${f1(bx0 - 1)}" y="${f1(yb - 2)}" width="${f1(bx1 - bx0 + 2)}" height="4" rx="2" fill="url(#${u}-metal)"/>` : "") +
      `<rect x="${x0 - 4}" y="${yt - 8}" width="${x1 - x0 + 8}" height="11" rx="4" fill="url(#${u}-metal)"/><rect x="${x0}" y="${yt + 1}" width="${x1 - x0}" height="3" fill="${hh.shade(o.color, -.2)}"/>` + led(o, x1, yt - 3), stuc);
  });

  add("panels", "Sliding panels", sw(FAB, "#e7dfcf"), "Fabric", (o) => {
    const a = amt(o), u = o.uid, x = 26, y = 26, w = 148, h = 150, top = 26, bot = 174;
    let s = "";
    for (let i = 0; i < 4; i++) {
      const px = 22 + i * (38.7 - 34.7 * a), pw = 40;
      s += `<rect x="${f1(px - 3)}" y="${top}" width="3" height="${bot - top}" fill="#000" opacity=".25"/>` +
        `<g${an(o, i % 2 ? "sway2" : "soft")}><rect x="${f1(px)}" y="${top}" width="${pw}" height="${bot - top}" fill="url(#${u}-fv)"/><rect x="${f1(px)}" y="${top}" width="${pw}" height="${bot - top}" fill="url(#${u}-wv)"/>` +
        `<rect x="${f1(px)}" y="${top}" width="${pw}" height="${bot - top}" fill="#000" opacity="${f2(.14 - i * .04)}"/>` +
        `<path d="M${f1(px + 9)} ${top}V${bot}M${f1(px + 23)} ${top}V${bot}M${f1(px + 31)} ${top}V${bot}" stroke="#fff" stroke-opacity=".08" stroke-width="1.2"/>` +
        `<rect x="${f1(px)}" y="${bot - 3}" width="${pw}" height="3" fill="url(#${u}-dmetal)"/><rect x="${f1(px)}" y="${top}" width="1" height="${bot - top}" fill="#fff" opacity=".25"/></g>`;
    }
    return svg(o, room(o, { wall: "#686260", x, y, w, h, floor: 182 }) + trim(o, x, y, w, h, 5, `url(#${u}-dmetal)`) + view(o, x, y, w, h) + sash(x, y, w, h, "v", "#3c3936") + s +
      `<rect x="18" y="18" width="164" height="8" rx="1.5" fill="url(#${u}-metal)"/><path d="M18 21H182M18 23.5H182" stroke="#000" stroke-opacity=".18" stroke-width=".5"/>`);
  });

  add("arched", "Arched window", sw(FAB, "#f6f4ef"), "Fabric", (o) => {
    const a = amt(o), u = o.uid, cx = 100, cy = 72, r = 46;
    const clip = "M52 140V72A48 48 0 0 1 148 72V140Z";
    const pt = (t) => `${f1(cx + r * Math.cos(t))} ${f1(cy - r * Math.sin(t))}`;
    let fan = "";
    const half = (t0, t1) => { const n = 8; for (let i = 0; i < n; i++) { const p0 = t0 + (t1 - t0) * i / n, p1 = t0 + (t1 - t0) * (i + 1) / n;
      fan += `<path d="M${cx} ${cy}L${pt(p0)}L${pt(p1)}Z" fill="${i % 2 ? H().shade(o.color, -.12) : H().shade(o.color, .2)}" stroke="#000" stroke-opacity=".12" stroke-width=".4"/>`; } };
    const cov = Math.PI / 2 * (1 - a);
    if (cov > .01) { half(0, cov); half(Math.PI - cov, Math.PI); }
    const fb = 76 + 64 * (1 - a);
    return svg(o, room(o, { wall: "#576470", x: 52, y: 24, w: 96, h: 116, floor: 184 }) +
      `<path d="${clip}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="14" transform="translate(2 2)"/><path d="${clip}" fill="none" stroke="url(#${u}-trim)" stroke-width="14"/>` +
      view(o, 52, 24, 96, 116, { clip }) +
      `<g>${fan}</g>${cov > .01 ? `<path d="M${cx - 8} ${cy}A8 8 0 0 1 ${cx + 8} ${cy}Z" fill="url(#${u}-fv)"/><circle cx="${cx}" cy="${cy - 3}" r="1.6" fill="#fff" opacity=".5"/>` : ""}` +
      `<path d="${clip}" fill="none" stroke="#f4f2ee" stroke-width="3"/><rect x="52" y="70" width="96" height="4" fill="#f4f2ee"/>` +
      `<g${an(o, "soft")}><rect x="54" y="76" width="92" height="${f1(fb - 76)}" fill="url(#${u}-pleat)"/><rect x="54" y="76" width="92" height="${f1(fb - 76)}" fill="url(#${u}-fx)" opacity=".3"/>` + hem(o, 53, fb - 1, 94, `url(#${u}-roll)`) + `</g>` +
      `<rect x="53" y="74" width="94" height="4" rx="1" fill="url(#${u}-roll)"/>` + sill(o, 40, 146, 120));
  });

  add("bay", "Bay window", sw(FAB, "#e7dfcf"), "Fabric", (o) => {
    const a = amt(o), u = o.uid;
    const W3 = [[[24, 50], [68, 40], [68, 128], [24, 140]], [[76, 40], [124, 40], [124, 128], [76, 128]], [[132, 40], [176, 50], [176, 140], [132, 128]]];
    const poly = (q) => "M" + q.map((p) => p[0] + " " + p[1]).join("L") + "Z";
    const clip = W3.map(poly).join("");
    const t = .08 + .92 * (1 - a);
    let sh = "";
    W3.forEach((q, i) => {
      const L = [q[0][0] + (q[3][0] - q[0][0]) * t, q[0][1] + (q[3][1] - q[0][1]) * t], R = [q[1][0] + (q[2][0] - q[1][0]) * t, q[1][1] + (q[2][1] - q[1][1]) * t];
      const d = `M${q[0][0]} ${q[0][1]}L${q[1][0]} ${q[1][1]}L${f1(R[0])} ${f1(R[1])}L${f1(L[0])} ${f1(L[1])}Z`;
      sh += `<path d="${d}" fill="url(#${u}-fv)" opacity=".93"/><path d="${d}" fill="url(#${u}-wv)"/>${i !== 1 ? `<path d="${d}" fill="#000" opacity=".1"/>` : ""}` +
        `<path d="M${f1(L[0])} ${f1(L[1] + 3)}L${f1(R[0])} ${f1(R[1] + 3)}" stroke="#000" stroke-opacity=".2" stroke-width="2"/><path d="M${f1(L[0])} ${f1(L[1])}L${f1(R[0])} ${f1(R[1])}" stroke="url(#${u}-roll)" stroke-width="3.6" stroke-linecap="round"/>` +
        `<path d="M${q[0][0]} ${q[0][1] + 1}L${q[1][0]} ${q[1][1] + 1}" stroke="url(#${u}-roll)" stroke-width="5"/>`;
    });
    return svg(o, room(o, { wall: "#6b5d54", x: 24, y: 40, w: 152, h: 100, floor: 186 }) +
      `<path d="M16 44L72 32H128L184 44V150L128 136H72L16 150Z" fill="#000" opacity=".25" transform="translate(2 2)"/><path d="M16 44L72 32H128L184 44V150L128 136H72L16 150Z" fill="url(#${u}-trim)"/>` +
      view(o, 24, 40, 152, 100, { clip }) + W3.map((q) => `<path d="${poly(q)}" fill="none" stroke="#f4f2ee" stroke-width="2.6"/>`).join("") +
      `<path d="M68 40V128M132 40V128" stroke="#000" stroke-opacity=".12" stroke-width="3"/>` + `<g${an(o, "soft")}>${sh}</g>` +
      `<g class="hda-bg"><path d="M12 150L72 138H128L188 150V158H12Z" fill="#d7cfc2"/><path d="M12 150L72 138H128L188 150" stroke="#fff" stroke-opacity=".5" fill="none"/><rect x="12" y="158" width="176" height="22" fill="#e6e1d8"/><rect x="12" y="158" width="176" height="2" fill="#000" opacity=".2"/><path d="M58 162V178M100 162V178M142 162V178" stroke="#000" stroke-opacity=".12"/>` +
      `<rect x="44" y="136" width="30" height="16" rx="6" fill="url(#${u}-cg)" transform="rotate(-6 59 144)"/><rect x="126" y="136" width="30" height="16" rx="6" fill="url(#${u}-cg)" transform="rotate(6 141 144)"/><path d="M50 140Q59 138 68 137M132 137Q141 138 150 140" stroke="#fff" stroke-opacity=".35" fill="none"/></g>`);
  });

  // ---------- (parts) Multi-Function: position readings as value parts (0-100 %) ----------
  // Blinds: Tilt (slats / vanes / zebra bands open) + Lift (raised; vertical blinds: drawn aside); shutters: Tilt only.
  // Top-down/bottom-up: Top rail (lowered %) + Bottom rail (raised %). Dual layers: Sheer + Blackout (open %).
  // o.mf: o.pval holds the ticked readings. A reading left out: tilt closed, lift down, rails home; in a dual layer the other
  // layer stays out of the way (no sheer layer on the blackout roller, the drapes pulled aside). Device Images: today's look.
  const pc = (id, name, def) => ({ id, name, type: "value", unit: "%", min: 0, max: 100, def });
  const TILT = pc("tilt", "Tilt (open)", 50), LIFT = pc("lift", "Lift (raised)", 40);
  const SP = {
    wood: [TILT, LIFT], mini: [TILT, LIFT], vertical: [TILT, pc("lift", "Drawn aside", 40)], zebra: [pc("tilt", "Bands (see-through)", 60), LIFT], shutters: [TILT],
    tdbu: [pc("top", "Top rail (lowered)", 35), pc("bottom", "Bottom rail (raised)", 15)],
    layered: [pc("sheer", "Sheers (open)", 0), pc("blackout", "Drapes (open)", 60)], blackout: [pc("sheer", "Sheer layer (open)", 30), pc("blackout", "Blackout (open)", 50)],
  };
  icons.forEach((ic) => {
    const ps = SP[ic.id]; if (!ps) return;
    ic.parts = ps; const R = ic.render;
    ic.render = (o) => {
      if (!o.mf) return R(o);
      const pr = o.pval || {}, v = {};
      ps.forEach((p) => { const n = pr[p.id]; v[p.id] = n == null || n === "" || !isFinite(+n) ? null : cl(+n / 100, 0, 1); });
      if ((ic.id === "layered" || ic.id === "blackout") && v.blackout == null && v.sheer != null) v.blackout = 1;
      const t = v.tilt || 0, l = v.lift || 0;
      const lv = ic.id === "tdbu" ? cl((v.top || 0) + (v.bottom || 0), 0, 1) : ic.id === "layered" || ic.id === "blackout" ? v.blackout || 0 : ic.id === "shutters" ? t : cl(l + (1 - l) * t, 0, 1);
      PV = v; try { return R(Object.assign({}, o, { on: lv > 0 || !!v.sheer, level: lv })); } finally { PV = null; }
    };
  });

  (window.HDA = window.HDA || []).push({
    id: "shades", tab: "Blinds & curtains", group: "Home", kind: "device",
    levelLabel: "Open", onWord: "Open", offWord: "Closed",
    intro: "Twenty window coverings on a real window with a sunny yard behind it. The slider sets how far open (blinds and shutters tilt their slats, shades lift, drapes part); Closed shuts them. Open ones let daylight onto the wall, and fabric sways while the clouds drift.",
    
    css, icons,
  });
})();
