(function () {
  const P = "hda-media-";
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  const H = () => window.HDAH;
  const n1 = (v) => (+v).toFixed(1);
  const n2 = (v) => (+v).toFixed(2);
  const TVF = ["#1b1d21", "#3d4148", "#8e949b", "#ece9e3", "#b79a6c"];
  const WOOD = ["#7a4b2a", "#b8875a", "#2a2725", "#efece6", "#9a4f32", "#7f9a85"];
  const FRAME = ["#efece6", "#b8875a", "#7a4b2a", "#1b1d21", "#9a6a3a"];
  const FAB = ["#3b3e44", "#e3e0d8", "#c9b49a", "#8aa190", "#4d668a", "#cf8a74"];
  const PLAS = ["#1c1e22", "#f2f2f0", "#5a6068", "#8e949b"];
  const METAL = ["#8e949b", "#b79a6c", "#b8bcc1", "#c7b07f"];
  const WOODS = ["#7a4b2a", "#b8875a", "#9a4f32", "#9a6a3a", "#6b4a30", "#5e3f28"];
  const has = (a, c) => a.indexOf(String(c).toLowerCase()) >= 0;
  const isM = (c) => has(METAL, c), isW = (c) => has(WOODS, c);
  const CY = "#5fd6ff", WARM = "#ffd59a";
  let DEF = [], N = 0, USED = {};

  function pal(c) {
    const h = H(), x = h.hx(c), lt = (x[0] * .3 + x[1] * .59 + x[2] * .11) / 255 > .7;
    return { l: h.shade(c, lt ? .7 : .4), m: c, d: h.shade(c, lt ? -.14 : -.3), k: h.shade(c, lt ? -.32 : -.55), lt };
  }
  const lg = (id, v, st, xy) => `<linearGradient id="${id}" ${xy || (v ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" x2="1"')}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;
  const halo = (id, c, a) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a || .85}"/><stop offset=".45" stop-color="${c}" stop-opacity="${(a || .85) * .3}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const rad = (id, st, at) => `<radialGradient id="${id}" ${at || ""}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</radialGradient>`;

  function mat(o, c, k) {
    const id = o.uid + "-m" + (N++), p = pal(c);
    if (k === "h") DEF.push(lg(id, 0, [[0, p.k], [.25, p.l], [.6, p.m], [1, p.k]]));
    else if (k === "t") DEF.push(lg(id, 0, [[0, p.m], [.5, p.l], [1, p.m]]));
    else if (k === "r") DEF.push(rad(id, [[0, p.l], [.5, p.m], [1, p.k]], 'cx=".36" cy=".3" r=".78"'));
    else DEF.push(lg(id, 1, [[0, p.l], [.35, p.m], [1, p.d]]));
    return `url(#${id})`;
  }
  function tex(o, c, d) {
    const u = o.uid;
    if (isM(c)) return `<path d="${d}" fill="url(#${u}-br)"/><path d="${d}" fill="url(#${u}-ms)"/>`;
    if (isW(c)) return `<path d="${d}" fill="url(#${u}-grain)"/>`;
    return `<path d="${d}" fill="url(#${u}-g)" opacity=".35"/>`;
  }
  const R = (x, y, w, h) => `M${n1(x)} ${n1(y)}h${n1(w)}v${n1(h)}h${n1(-w)}Z`;
  const surf = (o, c, x, y, w, h, k, rx) => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${rx || 0}" fill="${mat(o, c, k)}"/>` + tex(o, c, R(x, y, w, h));

  function defs(o) {
    const u = o.uid;
    return `<defs>
${lg(u + "-wall", 1, [[0, "#fff", .09], [1, "#fff", .035]])}${lg(u + "-flr", 1, [[0, "#5e3e27"], [1, "#2a1a10"]])}
${lg(u + "-fls", 1, [[0, "#000", .5], [1, "#000", 0]])}
${rad(u + "-sh", [[0, "#000", .6], [1, "#000", 0]])}
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-ms" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".2" stop-color="#fff" stop-opacity=".28"/><stop offset=".33" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#fff" stop-opacity=".14"/><stop offset=".85" stop-color="#fff" stop-opacity="0"/></linearGradient>
${lg(u + "-fx", 0, [[0, "#000", .3], [.12, "#000", 0], [.88, "#000", 0], [1, "#000", .35]])}
${lg(u + "-blk", 1, [[0, "#3a3e46"], [.45, "#17191d"], [1, "#08090b"]])}
<linearGradient id="${u}-gls" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#232833"/><stop offset=".55" stop-color="#0a0c11"/><stop offset="1" stop-color="#151920"/></linearGradient>
<linearGradient id="${u}-ref" x1="0" y1="0" x2="1" y2=".7"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".02"/><stop offset=".36" stop-color="#fff" stop-opacity=".13"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/><stop offset=".66" stop-color="#fff" stop-opacity=".06"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>
${lg(u + "-crv", 0, [[0, "#000", .45], [.18, "#000", 0], [.82, "#000", 0], [1, "#000", .45]])}
${lg(u + "-drift", 0, [[0, "#ff4fa0"], [.5, "#7a5cff"], [1, "#2fd6ff"]])}
${rad(u + "-cone", [[0, "#5d636d"], [.3, "#2b2f35"], [.82, "#111317"], [1, "#3a3e45"]])}
${rad(u + "-dome", [[0, "#f6f8fa"], [.4, "#9aa0a8"], [1, "#24272c"]], 'cx=".35" cy=".3"')}
${rad(u + "-knob", [[0, "#f2f4f6"], [.55, "#9ba1a9"], [1, "#3d4148"]], 'cx=".35" cy=".3" r=".8"')}
${rad(u + "-sun", [[0, "#fff4c8", 1], [.3, "#ffd27a", .7], [1, "#ff9a4a", 0]])}
${lg(u + "-leaf", 1, [[0, "#7cc865"], [1, "#2f6b2c"]], 'x1="0" y1="0" x2="1" y2="1"')}${lg(u + "-pot", 0, [[0, "#b8b2a8"], [.4, "#f1ede6"], [1, "#9d978d"]])}
${lg(u + "-brass", 1, [[0, "#f3d98f"], [.5, "#b8893a"], [1, "#6e4f1e"]])}${lg(u + "-chrome", 1, [[0, "#fbfcfd"], [.4, "#9097a0"], [.6, "#e6e9ec"], [1, "#575d65"]])}
<pattern id="${u}-br" width="40" height="5" patternUnits="userSpaceOnUse"><path d="M0 .5H40" stroke="#fff" stroke-opacity=".16" stroke-width=".5"/><path d="M0 2.1H40" stroke="#000" stroke-opacity=".09" stroke-width=".6"/><path d="M0 3.6H40" stroke="#fff" stroke-opacity=".08" stroke-width=".4"/></pattern>
<pattern id="${u}-grain" width="44" height="7" patternUnits="userSpaceOnUse"><path d="M0 2C11 1 22 3.2 44 2M0 5C15 6 28 4.2 44 5.2" fill="none" stroke="#2a170a" stroke-opacity=".32" stroke-width=".6"/></pattern>
<pattern id="${u}-fab" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#000" fill-opacity=".07"/><circle cx=".75" cy=".75" r=".62" fill="#fff" fill-opacity=".13"/><circle cx="2.25" cy="2.25" r=".62" fill="#000" fill-opacity=".2"/></pattern>
<pattern id="${u}-grl" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r=".85" fill="#000" fill-opacity=".55"/></pattern>
<pattern id="${u}-slat" width="200" height="9" patternUnits="userSpaceOnUse"><rect width="200" height="7.6" fill="#c08655" fill-opacity=".5"/><rect y="7.6" width="200" height="1.4" fill="#000" fill-opacity=".5"/><path d="M0 3C40 2 80 4.6 120 3S180 2 200 3" stroke="#5a3418" stroke-opacity=".35" stroke-width=".5" fill="none"/></pattern>
<pattern id="${u}-tile" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M0 .5H20M0 5.5H20M.5 0V5M10.5 5V10" stroke="#fff" stroke-opacity=".11" stroke-width="1" fill="none"/></pattern>
${DEF.join("")}</defs>`;
  }
  function svg(o, body) {
    const s = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o)}<clipPath id="${o.uid}-all"><rect width="200" height="200" rx="6"/></clipPath><g clip-path="url(#${o.uid}-all)">${body}</g></svg>`;
    DEF = []; USED = {};
    return s;
  }
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry || 5)}" fill="url(#${o.uid}-sh)"/>`;

  const SC = {
    sunset: {
      c: "#ff8a5a",
      defs: (u) => lg(u + "-s1", 1, [[0, "#2a1b52"], [.32, "#8a3b7a"], [.5, "#f0784a"], [.6, "#ffc46e"]]) + lg(u + "-s1w", 1, [[0, "#b0546a"], [1, "#24163e"]]),
      d: (u) => `<rect width="160" height="90" fill="url(#${u}-s1)"/>
<g class="${P}pan"><path d="M8 20c10-3 22-3 34 0M96 14c12-3 28-3 42 1M58 30c7-2 15-2 22 0M122 31c6-2 12-2 18 0" stroke="#ffcfb0" stroke-opacity=".55" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>
<circle cx="80" cy="54" r="28" fill="url(#${u}-sun)"/><circle cx="80" cy="54" r="9.5" fill="#fff0bf"/>
<rect y="54" width="160" height="36" fill="url(#${u}-s1w)"/>
<path d="M68 57.5h24M64 62h32M71 66.5h18M60 72h40M73 78h14M66 84h28" stroke="#ffc27a" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round"/>
<path d="M0 54V40C14 38 32 46 50 54Z" fill="#2b1534"/><path d="M160 54V36C142 34 122 44 108 54Z" fill="#331a3e"/>
<path d="M110 26l3 2 3-2M119 22l2 1.5 2-1.5" stroke="#2b1534" fill="none" stroke-width="1"/>`
    },
    ocean: {
      c: "#4fb4ff",
      defs: (u) => lg(u + "-s2", 1, [[0, "#2f7fd6"], [.55, "#a8dcff"]]) + lg(u + "-s2w", 1, [[0, "#36b8e2"], [1, "#0a4a86"]]),
      d: (u) => `<rect width="160" height="90" fill="url(#${u}-s2)"/>
<circle cx="126" cy="18" r="18" fill="url(#${u}-sun)" opacity=".7"/><circle cx="126" cy="18" r="5.5" fill="#fffbe6"/>
<g class="${P}pan" fill="#fff"><g opacity=".92"><ellipse cx="30" cy="20" rx="14" ry="4.5"/><ellipse cx="38" cy="16.5" rx="8" ry="5"/><ellipse cx="24" cy="17.5" rx="6" ry="3.5"/></g><g opacity=".75"><ellipse cx="84" cy="30" rx="12" ry="3.5"/><ellipse cx="90" cy="27" rx="6" ry="4"/></g></g>
<rect y="50" width="160" height="40" fill="url(#${u}-s2w)"/>
<path d="M12 50Q30 40 52 50Z" fill="#2f7a3c"/><path d="M33 47Q34 38 31 32" stroke="#5a3a20" stroke-width="1.6" fill="none"/>
<path d="M31 32q-7-1-10 3M31 32q6-3 10 0M31 32q-3-5-8-5M31 32q4-5 9-4M31 32q0 5-3 7" stroke="#2f8a40" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<path d="M112 47V32L121 46Z" fill="#fff"/><path d="M111 33V47L104 46Z" fill="#eef4fa"/><path d="M102 47.5h21l-3 2.6h-15Z" fill="#7a3b2a"/>
<path d="M0 58q8-2.5 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0M0 68q10-3 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0M0 80q12-3.5 24 0t24 0t24 0t24 0t24 0t24 0t24 0" stroke="#fff" stroke-opacity=".45" stroke-width="1.1" fill="none"/>
<path d="M118 54h14M121 58h9M116 62h18" stroke="#fffbe0" stroke-opacity=".75" stroke-width="1.2"/>`
    },
    mountains: {
      c: "#a9b8ff",
      defs: (u) => lg(u + "-s3", 1, [[0, "#4d65b8"], [.42, "#c99ac0"], [.66, "#ffc9a0"]]) + lg(u + "-s3m", 1, [[0, "#9aa7d8"], [1, "#5a6aa0"]]) + lg(u + "-s3w", 1, [[0, "#d0aec8"], [1, "#2a3666"]]),
      d: (u) => {
        const far = "M0 58L20 32L34 44L56 20L80 48L100 26L124 46L142 28L160 40V62H0Z";
        return `<rect width="160" height="90" fill="url(#${u}-s3)"/><circle cx="90" cy="52" r="26" fill="url(#${u}-sun)" opacity=".85"/>
<path d="${far}" fill="url(#${u}-s3m)"/><path d="M56 20L63 29L58 28L54 31L49 28ZM100 26L106 33L101 32L97 35L94 33ZM142 28L147 34L143 33L139 35Z" fill="#f6f3ff"/>
<path d="M0 62L26 46L46 58L74 42L104 60L132 48L160 58V62Z" fill="#3c4a7c"/>
<rect y="62" width="160" height="28" fill="url(#${u}-s3w)"/><g opacity=".25" transform="matrix(1 0 0 -1 0 124)"><path d="${far}" fill="#e6e0ff"/></g>
<path d="M30 70h30M90 76h40M50 82h24" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
<path d="M2 90L9 64L16 90ZM11 90L19 58L27 90ZM138 90L146 62L154 90ZM149 90L156 68L163 90Z" fill="#141c34"/>`;
      }
    },
    abstract: {
      c: "#c27dff",
      defs: (u) => halo(u + "-ab1", "#ff4fa8", 1) + halo(u + "-ab2", "#25d0ff", 1) + halo(u + "-ab3", "#ffc23a", 1) + halo(u + "-ab4", "#7b4dff", 1),
      d: (u) => `<rect width="160" height="90" fill="#150a2e"/><g class="${P}orb"><circle cx="40" cy="30" r="58" fill="url(#${u}-ab1)"/></g>
<circle cx="124" cy="62" r="62" fill="url(#${u}-ab2)"/><g class="${P}pan"><circle cx="96" cy="6" r="42" fill="url(#${u}-ab3)"/></g><circle cx="66" cy="84" r="44" fill="url(#${u}-ab4)"/>
<path d="M-10 70C30 30 60 90 100 50S150 20 170 40" stroke="#fff" stroke-opacity=".4" stroke-width="1.4" fill="none"/><path d="M-10 79C34 41 64 97 104 59S152 31 170 51" stroke="#fff" stroke-opacity=".16" stroke-width="3.2" fill="none"/>`
    },
    aurora: {
      c: "#4dffb0",
      defs: (u) => lg(u + "-s4", 1, [[0, "#030614"], [1, "#12305a"]]) + lg(u + "-s4a", 1, [[0, "#9dffd8", 0], [.45, "#4dffb0", .8], [1, "#1fd2a0", 0]]) + lg(u + "-s4b", 1, [[0, "#d39bff", 0], [.5, "#a77bff", .6], [1, "#5a3bff", 0]]),
      d: (u) => `<rect width="160" height="90" fill="url(#${u}-s4)"/>
<g fill="#fff">${[[12, 8, .7], [34, 14, .5], [58, 6, .8], [80, 12, .5], [104, 5, .6], [130, 16, .7], [150, 8, .5], [22, 26, .4], [118, 30, .4], [70, 22, .4]].map((s) => `<circle cx="${s[0]}" cy="${s[1]}" r="${s[2]}"/>`).join("")}</g>
<g class="${P}pan"><path d="M-6 52C24 18 54 56 88 26S140 30 166 10L166 30C140 48 112 44 90 48C58 74 28 44 -6 70Z" fill="url(#${u}-s4a)"/></g>
<path d="M-6 40C30 20 60 40 96 14S150 14 166 4L166 14C140 26 110 26 96 30C60 54 30 36 -6 52Z" fill="url(#${u}-s4b)" opacity=".75"/>
<rect y="72" width="160" height="18" fill="#1fd2a0" opacity=".12"/>
<path d="M0 72L22 58L40 66L66 50L92 68L118 56L160 70V76H0Z" fill="#060c18"/><path d="M0 76H160V90H0Z" fill="#081422" opacity=".7"/>
<path d="M6 76L12 60L18 76ZM16 76L22 63L28 76ZM136 76L143 58L150 76Z" fill="#03070e"/>`
    },
    meadow: {
      c: "#8fe07a",
      defs: (u) => lg(u + "-s5", 1, [[0, "#5cb6f2"], [.6, "#e2f4ff"]]) + lg(u + "-s5h", 1, [[0, "#7cc658"], [1, "#3f8a35"]]) + lg(u + "-s5n", 1, [[0, "#4f9e3e"], [1, "#2b5e25"]]),
      d: (u) => `<rect width="160" height="90" fill="url(#${u}-s5)"/><circle cx="26" cy="14" r="18" fill="url(#${u}-sun)" opacity=".7"/><circle cx="26" cy="14" r="5" fill="#fffbe6"/>
<g class="${P}pan" fill="#fff"><g opacity=".95"><ellipse cx="92" cy="18" rx="15" ry="5"/><ellipse cx="100" cy="14" rx="8" ry="6"/><ellipse cx="86" cy="15" rx="6" ry="4"/></g><g opacity=".8"><ellipse cx="140" cy="28" rx="11" ry="3.4"/><ellipse cx="145" cy="25.5" rx="5.5" ry="3.6"/></g></g>
<path d="M0 52C36 40 84 46 160 40V90H0Z" fill="#9fcde6" opacity=".6"/><path d="M0 58C40 44 86 52 160 46V90H0Z" fill="#8ccb6a"/>
<path d="M0 68C46 52 104 74 160 58V90H0Z" fill="url(#${u}-s5h)"/><path d="M0 82C46 70 112 86 160 74V90H0Z" fill="url(#${u}-s5n)"/>
<path d="M118 62V49" stroke="#5a3a22" stroke-width="2"/><circle cx="118" cy="44" r="9" fill="#3f7f35"/><circle cx="114.5" cy="41.5" r="5.5" fill="#5aa448"/>
<path d="M66 90C72 80 82 72 96 64" stroke="#efe0b0" stroke-width="3" fill="none" opacity=".75"/>
<g fill="#fff6a8">${[[20, 80], [34, 84], [50, 78], [120, 82], [138, 86], [146, 78], [28, 74]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="1"/>`).join("")}</g><g fill="#ff8fb8"><circle cx="42" cy="86" r="1"/><circle cx="130" cy="78" r="1"/></g>`
    },
    dunes: {
      c: "#ffb06a",
      defs: (u) => lg(u + "-s6", 1, [[0, "#2b1f5e"], [.38, "#c4527a"], [.62, "#ffb070"]]) + lg(u + "-s6d", 1, [[0, "#e6a25c"], [1, "#a85a2c"]]) + lg(u + "-s6n", 1, [[0, "#bc6a32"], [1, "#6a3214"]]),
      d: (u) => `<rect width="160" height="90" fill="url(#${u}-s6)"/><g class="${P}pan"><path d="M14 18c10-2 20-2 30 0M110 12c8-2 18-2 26 0" stroke="#ffc3a8" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/></g>
<circle cx="104" cy="50" r="26" fill="url(#${u}-sun)"/><circle cx="104" cy="50" r="10" fill="#ffe4a8"/>
<path d="M0 60C28 48 58 50 88 58S140 50 160 54V90H0Z" fill="url(#${u}-s6d)"/><path d="M88 58C108 52 132 50 160 54V58C134 56 110 58 88 58Z" fill="#fff" opacity=".14"/>
<path d="M0 74C36 60 70 64 104 76S150 72 160 70V90H0Z" fill="url(#${u}-s6n)"/><path d="M0 74C36 60 70 64 104 76" stroke="#ffc07a" stroke-opacity=".75" stroke-width="1" fill="none"/>`
    },
    painting: {
      c: "#ffd59a",
      defs: (u) => lg(u + "-s7", 1, [[0, "#7fa9d6"], [.6, "#e8e6da"]]) + lg(u + "-s7f", 1, [[0, "#e2c05a"], [1, "#a0822c"]]),
      d: (u) => {
        let s = 11; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
        let dabs = "";
        const sky = ["#b8d0ec", "#f2efe6", "#9cc0e4", "#ead9b8", "#c9dcef"], fld = ["#f0d46a", "#b8952e", "#9aa83e", "#e8c44c", "#c78a2e"];
        for (let i = 0; i < 46; i++) dabs += `<ellipse cx="${n1(r() * 160)}" cy="${n1(r() * 46)}" rx="${n1(3 + r() * 4)}" ry="${n1(1.2 + r() * 1.4)}" fill="${sky[i % 5]}" opacity=".8" transform="rotate(${n1(r() * 30 - 15)} 80 24)"/>`;
        let field = "";
        for (let i = 0; i < 44; i++) field += `<ellipse cx="${n1(r() * 160)}" cy="${n1(52 + r() * 38)}" rx="${n1(2.5 + r() * 3)}" ry="${n1(1 + r())}" fill="${fld[i % 5]}" opacity=".85"/>`;
        let pop = "";
        for (let i = 0; i < 30; i++) { const y = 58 + r() * 32; pop += `<circle cx="${n1(r() * 160)}" cy="${n1(y)}" r="${n2(.6 + (y - 58) / 22)}" fill="${i % 3 ? "#d6372a" : "#f05a3a"}"/>`; }
        return `<rect width="160" height="90" fill="url(#${u}-s7)"/>${dabs}
<g fill="#4c6b3f">${[[10, 48, 12], [30, 47, 9], [52, 49, 14], [128, 48, 13], [150, 47, 10]].map((t) => `<ellipse cx="${t[0]}" cy="${t[1]}" rx="${t[2]}" ry="5"/>`).join("")}</g><g fill="#6d8c4e">${[[16, 46, 6], [56, 46, 7], [134, 45, 6]].map((t) => `<ellipse cx="${t[0]}" cy="${t[1]}" rx="${t[2]}" ry="3"/>`).join("")}</g>
<rect y="50" width="160" height="40" fill="url(#${u}-s7f)"/>${field}
<path d="M98 64C98 50 126 50 126 64Z" fill="#c4873a"/><path d="M112 51C120 52 126 57 126 64H116Z" fill="#8a5a22" opacity=".55"/><path d="M98 64h28" stroke="#6a4214" stroke-width="1.2"/>${pop}`;
      }
    }
  };

  function scr(o, x, y, w, h, sc, noRef) {
    const u = o.uid;
    if (!o.on) return `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-gls)"/><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-ref)"/>`;
    if (!USED[sc]) { USED[sc] = 1; DEF.push(SC[sc].defs(u)); }
    return `<svg x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">${SC[sc].d(u)}<rect width="160" height="90" fill="url(#${u}-drift)" class="${P}drift" opacity="0"/></svg>` +
      (noRef ? "" : `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-ref)" opacity=".6"/>`);
  }
  function bias(o, sc, cx, cy, rx, ry, op) { return G(bias0(o, sc, cx, cy, rx, ry, op)); }
  function bias0(o, sc, cx, cy, rx, ry, op) {
    if (!o.on) return "";
    if (!USED["hz"]) { USED["hz"] = 1; DEF.push(halo(o.uid + "-hz", SC[sc].c, .9)); }
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${o.uid}-hz)" opacity="${op}"/>`;
  }
  function osd(o, x, y, w) {
    if (!o.on) return "";
    const f = Math.max(.6, (w - 12) * o.level);
    return `<g><rect x="${x}" y="${y}" width="${w}" height="7" rx="3.5" fill="#05070c" fill-opacity=".62"/><path d="M${x + 2.4} ${y + 2.6}h1.5l2-1.6v5l-2-1.6h-1.5Z" fill="#fff"/>
<rect x="${x + 9}" y="${y + 2.9}" width="${w - 12}" height="1.3" rx=".65" fill="#fff" fill-opacity=".3"/><rect x="${x + 9}" y="${y + 2.9}" width="${n1(f)}" height="1.3" rx=".65" fill="#fff"/><circle cx="${n1(x + 9 + f)}" cy="${y + 3.55}" r="1.5" fill="#fff"/></g>`;
  }
  function waves(o, x, y, dir, col, sz) {
    if (!o.on) return "";
    sz = sz || 1;
    const lit = Math.max(1, Math.round(o.level * 4)), c = .7071;
    let s = "";
    for (let i = 0; i < 4; i++) {
      const r = (6 + i * 5) * sz, a = r * c;
      let d;
      if (dir === "r") d = `M${n1(x + a)} ${n1(y - a)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + a)} ${n1(y + a)}`;
      else if (dir === "l") d = `M${n1(x - a)} ${n1(y + a)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x - a)} ${n1(y - a)}`;
      else d = `M${n1(x - a)} ${n1(y - a)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + a)} ${n1(y - a)}`;
      s += i < lit ? `<path d="${d}" fill="none" stroke="${col}" stroke-width="${n1(2 * sz)}" stroke-linecap="round" class="${P}wv" style="animation-delay:${(i * .22).toFixed(2)}s" opacity=".9"/>`
        : `<path d="${d}" fill="none" stroke="${col}" stroke-width="${n1(1.6 * sz)}" stroke-linecap="round" opacity=".13"/>`;
    }
    return s;
  }
  function ring(o, cx, cy, rx, ry, col, half) {
    const d = half ? `M${n1(cx - rx)} ${n1(cy)}A${n1(rx)} ${n1(ry)} 0 0 0 ${n1(cx + rx)} ${n1(cy)}` : `M${n1(cx - rx)} ${n1(cy)}A${n1(rx)} ${n1(ry)} 0 1 0 ${n1(cx + rx)} ${n1(cy)}A${n1(rx)} ${n1(ry)} 0 1 0 ${n1(cx - rx)} ${n1(cy)}`;
    if (!o.on) return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.8"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`;
    return `<g class="${P}pulse"><path d="${d}" fill="none" stroke="${col}" stroke-opacity=".25" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width=".8"/></g>`;
  }
  function cone(o, cx, cy, r, slow) {
    const d = ((slow ? 1.1 : .85) - .5 * o.level).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${n1(r + 1.6)}" fill="#0b0c0e"/><g class="${o.on ? P + "cone" : ""}" style="animation-duration:${d}s"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${o.uid}-cone)"/>
<circle cx="${cx}" cy="${cy}" r="${n1(r * .84)}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".9"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .3)}" fill="url(#${o.uid}-dome)"/></g>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width=".8"/>`;
  }
  const tweet = (o, cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${n1(r + 1.4)}" fill="#0a0b0d"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#2a2d33"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .62)}" fill="url(#${o.uid}-dome)"/>`;
  const led = (o, x, y, col, offc) => o.on ? `<circle cx="${x}" cy="${y}" r="3.4" fill="${col}" opacity=".3"/><circle cx="${x}" cy="${y}" r="1.1" fill="${col}"/><circle cx="${x}" cy="${y}" r=".5" fill="#fff"/>` : `<circle cx="${x}" cy="${y}" r=".9" fill="${offc || "#3a3d42"}"/>`;

  const SEGS = ["abcdef", "bc", "abdeg", "abcdg", "bcfg", "acdfg", "acdefg", "abc", "abcdefg", "abcdfg"];
  function seg(str, x, y, h, col) {
    const w = h * .55, t = h * .14;
    let s = "", cx = x;
    for (const ch of String(str)) {
      if (ch === ":") { s += `<rect x="${n2(cx + .3)}" y="${n2(y + h * .26)}" width="${n2(t)}" height="${n2(t)}"/><rect x="${n2(cx + .3)}" y="${n2(y + h * .64)}" width="${n2(t)}" height="${n2(t)}"/>`; cx += t + h * .3; continue; }
      const on = SEGS[+ch] || "", hh = h / 2 - t * .9;
      const B = { a: [cx + t * .6, y, w - t * 1.2, t], b: [cx + w - t, y + t * .6, t, hh], c: [cx + w - t, y + h / 2 + t * .3, t, hh], d: [cx + t * .6, y + h - t, w - t * 1.2, t], e: [cx, y + h / 2 + t * .3, t, hh], f: [cx, y + t * .6, t, hh], g: [cx + t * .6, y + h / 2 - t / 2, w - t * 1.2, t] };
      for (const k in B) if (on.indexOf(k) >= 0) { const b = B[k]; s += `<rect x="${n2(b[0])}" y="${n2(b[1])}" width="${n2(b[2])}" height="${n2(b[3])}" rx="${n2(t / 3)}"/>`; }
      cx += w + h * .22;
    }
    return `<g fill="${col}">${s}</g>`;
  }
  function arcP(cx, cy, r, a0, a1) {
    const q = Math.PI / 180, x0 = cx + r * Math.cos(a0 * q), y0 = cy + r * Math.sin(a0 * q), x1 = cx + r * Math.cos(a1 * q), y1 = cy + r * Math.sin(a1 * q);
    return `M${n2(x0)} ${n2(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n2(x1)} ${n2(y1)}`;
  }

  function room(o, fy) { return G(room0(o, fy)); }
  function room0(o, fy) {
    const u = o.uid;
    return `<rect width="200" height="200" fill="url(#${u}-wall)"/><rect y="${fy}" width="200" height="${200 - fy}" fill="url(#${u}-flr)"/><rect y="${fy}" width="200" height="${200 - fy}" fill="url(#${u}-grain)"/>
<path d="M0 ${fy + 8}H200M0 ${fy + 18}H200M60 ${fy}V${fy + 8}M150 ${fy + 8}V${fy + 18}M30 ${fy + 18}V200" stroke="#000" stroke-opacity=".28" stroke-width=".8"/><rect y="${fy}" width="200" height="14" fill="url(#${u}-fls)"/>
<rect y="${fy - 6}" width="200" height="6" fill="#ece8e0" fill-opacity=".13"/><rect y="${fy - 6}" width="200" height="1" fill="#fff" fill-opacity=".2"/>`;
  }
  function cabinet(o, x, y, w, h, c, op) {
    op = op || {};
    const d = op.doors || 2, lgL = op.leg || 6, hs = H().shade(c, -.55);
    let s = sh(o, x + w / 2, y + h + lgL, w * .56, 4);
    s += `<path d="M${x + 7} ${y + h}h5l-1.4 ${lgL}h-2.2ZM${x + w - 12} ${y + h}h5l-1.4 ${lgL}h-2.2Z" fill="${hs}"/>`;
    s += surf(o, c, x, y, w, h, "v");
    for (let i = 1; i < d; i++) s += `<path d="M${n1(x + w * i / d)} ${y + 2}V${y + h - 1}" stroke="#000" stroke-opacity=".38" stroke-width="1"/><path d="M${n1(x + w * i / d + 1)} ${y + 2}V${y + h - 1}" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`;
    for (let i = 0; i < d; i++) s += `<rect x="${n1(x + w * (i + .5) / d - 4)}" y="${y + 4.5}" width="8" height="1.6" rx=".8" fill="#e2d2a8" opacity=".85"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="2.5" fill="#000" opacity=".3"/><rect x="${x - 2}" y="${y - 3.5}" width="${w + 4}" height="4" rx="1" fill="${mat(o, H().shade(c, .12), "t")}"/>${tex(o, c, R(x - 2, y - 3.5, w + 4, 4))}<rect x="${x - 2}" y="${y - 3.5}" width="${w + 4}" height=".8" fill="#fff" opacity=".25"/>`;
    return s;
  }
  function shelf(o, x, y, w, c) { return G(shelf0(o, x, y, w, c)); }
  function shelf0(o, x, y, w, c) {
    return `<rect x="${x + 2}" y="${y + 6}" width="${w - 4}" height="6" fill="url(#${o.uid}-fls)"/>` + surf(o, c || "#7a4b2a", x, y, w, 6, "v", 1) + `<rect x="${x}" y="${y}" width="${w}" height=".8" fill="#fff" opacity=".28"/>`;
  }
  function books(x, y) { return G(books0(x, y)); }
  function books0(x, y) {
    let s = "", cx = x;
    [["#8a3f3a", 6, 26], ["#2f4f6f", 5, 30], ["#c9a45c", 7, 23], ["#3f5f4a", 5, 28]].forEach((b) => {
      s += `<rect x="${cx}" y="${y - b[2]}" width="${b[1]}" height="${b[2]}" fill="${b[0]}"/><rect x="${cx}" y="${y - b[2]}" width="1.2" height="${b[2]}" fill="#fff" opacity=".18"/><rect x="${cx}" y="${y - b[2] + 4}" width="${b[1]}" height="1" fill="#fff" opacity=".3"/>`;
      cx += b[1] + .6;
    });
    return s;
  }
  const flatBooks = (x, y, w) => G(flatBooks0(x, y, w));
  const flatBooks0 = (x, y, w) => `<rect x="${x}" y="${y - 4}" width="${w}" height="4" fill="#c9a45c"/><rect x="${x + 2}" y="${y - 7.5}" width="${w - 5}" height="3.5" fill="#2f4f6f"/><rect x="${x}" y="${y - 4}" width="${w}" height=".8" fill="#fff" opacity=".3"/><rect x="${x + 2}" y="${y - 7.5}" width="${w - 5}" height=".7" fill="#fff" opacity=".3"/>`;
  function plant(o, x, y, s) { return G(plant0(o, x, y, s)); }
  function plant0(o, x, y, s) {
    const lv = [[-9, -22, -38], [9, -24, 32], [0, -31, 0], [-14, -13, -64], [14, -14, 62], [-4, -27, -14], [5, -18, 20]];
    return `<g transform="translate(${x} ${y}) scale(${s})">${lv.map((l) => `<ellipse cx="${l[0]}" cy="${l[1]}" rx="4.6" ry="12" transform="rotate(${l[2]} ${l[0]} ${l[1]})" fill="url(#${o.uid}-leaf)"/>`).join("")}
<path d="M-9 -10H9L7 0H-7Z" fill="url(#${o.uid}-pot)"/><rect x="-9.5" y="-11" width="19" height="2.4" rx="1" fill="#f6f3ee"/></g>`;
  }
  const vase = (o, x, y) => G(vase0(o, x, y));
  const vase0 = (o, x, y) => `<path d="M${x - 4} ${y}C${x - 9} ${y - 6} ${x - 7} ${y - 14} ${x - 2.5} ${y - 18}V${y - 22}H${x + 2.5}V${y - 18}C${x + 7} ${y - 14} ${x + 9} ${y - 6} ${x + 4} ${y}Z" fill="url(#${o.uid}-pot)"/>
<path d="M${x} ${y - 22}C${x - 2} ${y - 32} ${x - 8} ${y - 36} ${x - 12} ${y - 38}M${x} ${y - 22}C${x + 1} ${y - 34} ${x + 6} ${y - 40} ${x + 9} ${y - 42}M${x} ${y - 22}V${y - 40}" stroke="#7a6a4a" stroke-width=".9" fill="none"/>
<g fill="#d8c9a0"><ellipse cx="${x - 12}" cy="${y - 38}" rx="2.4" ry="1.4"/><ellipse cx="${x + 9}" cy="${y - 42}" rx="2.4" ry="1.4"/><ellipse cx="${x}" cy="${y - 41}" rx="1.6" ry="2.4"/></g>`;

  function tv(o, x, y, w, h, sc, op) {
    op = op || {};
    const b = op.b || 2.2, c = op.col || o.color, rx = op.r || 1.8;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${mat(o, c, "v")}"/>` + (isM(c) ? tex(o, c, R(x, y, w, h)) : "");
    s += scr(o, x + b, y + b, w - 2 * b, h - 2 * b, sc);
    s += `<rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/>`;
    s += o.on ? `<circle cx="${x + w / 2}" cy="${n1(y + h - b / 2)}" r=".6" fill="#fff" opacity=".35"/>` : `<circle cx="${x + w / 2}" cy="${n1(y + h - b / 2)}" r=".8" fill="#ff4040"/>`;
    return s;
  }
  const pillow = (o, x, y, a, c) => `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 13} ${y - 11}Q${x} ${y - 14} ${x + 13} ${y - 11}Q${x + 15} ${y} ${x + 13} ${y + 11}Q${x} ${y + 14} ${x - 13} ${y + 11}Q${x - 15} ${y} ${x - 13} ${y - 11}Z" fill="${mat(o, c, "v")}"/><path d="M${x - 13} ${y - 11}Q${x} ${y - 14} ${x + 13} ${y - 11}Q${x + 15} ${y} ${x + 13} ${y + 11}Q${x} ${y + 14} ${x - 13} ${y + 11}Q${x - 15} ${y} ${x - 13} ${y - 11}Z" fill="url(#${o.uid}-fab)"/><path d="M${x - 9} ${y - 7}Q${x} ${y - 1} ${x + 9} ${y - 7}" fill="none" stroke="#000" stroke-opacity=".18"/></g>`;
  // (multi-function) o.parts holds only the parts the user ticked. A part left out follows the one device as a Device
  // Image (no o.mf: every part follows o.on and the slider is the volume, exactly as today) and stays off, never
  // animated, as a Multi-Function Image (o.mf). A reading (volume, %) is o.pval.volume when o.mf (left out = no bar).
  const MF = {
    has: (o, k) => !!(o.parts && o.parts[k] != null),
    on: (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on),
    vol: (o) => (!o.mf ? o.level : o.pval && o.pval.volume != null && isFinite(+o.pval.volume) ? Math.max(0, Math.min(1, +o.pval.volume / 100)) : null),
    as: (o, k, lv) => Object.assign({}, o, { on: MF.on(o, k) }, lv === undefined ? {} : { level: lv == null ? 0 : lv }),
  };
  const OFF = { on: false };
  const dropShadow = (x, y, w, h, op) => `<rect x="${x + 3}" y="${y + 4}" width="${w}" height="${h}" rx="2" fill="#000" opacity="${op || .32}"/>`;

  const icons = [
    {
      id: "wall-tv", name: "Wall-mounted TV", colors: TVF, picker: true, colorLabel: "Finish",
      render(o) {
        return svg(o, room(o, 170) + bias(o, "sunset", 100, 80, 104, 68, .7) + dropShadow(22, 35, 156, 90) + tv(o, 22, 35, 156, 90, "sunset", { b: 2.4 }) + osd(o, 30, 113, 46) +
          shelf(o, 42, 150, 116) + books(52, 150) + vase(o, 142, 150) + G(`<rect x="100" y="146" width="22" height="4" rx="2" fill="#15171b"/><circle cx="104" cy="148" r=".8" fill="#555"/>`));
      }
    },
    {
      id: "console-tv", name: "TV on console", colors: WOOD, picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid;
        return svg(o, room(o, 174) + bias(o, "ocean", 100, 80, 100, 62, .6) + cabinet(o, 24, 138, 152, 30, o.color, { doors: 3, leg: 6 }) +
          `<path d="M93 118h14l2 16h-18Z" fill="url(#${u}-blk)"/><ellipse cx="100" cy="134.3" rx="24" ry="2.4" fill="url(#${u}-blk)"/><ellipse cx="100" cy="133.6" rx="22" ry="1.2" fill="#fff" opacity=".12"/>` +
          tv(o, 30, 40, 140, 80, "ocean", { col: "#1b1d21" }) + osd(o, 38, 108, 44) + plant(o, 162, 134.5, .55) + flatBooks(30, 134.5, 20));
      }
    },
    {
      id: "art-tv", name: "Art-frame TV", colors: FRAME, picker: true, colorLabel: "Frame",
      render(o) {
        const u = o.uid, c = o.color;
        DEF.push(lg(u + "-pl", 1, [[0, "#ffe2a8", .5], [1, "#ffe2a8", 0]]));
        let inner = o.on ? `<rect x="36" y="36" width="128" height="72" fill="#f1ece1"/>` + scr(o, 46, 43, 108, 58, "painting", 1) +
          `<rect x="46" y="43" width="108" height="58" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/><rect x="36" y="36" width="128" height="72" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="2.4"/>`
          : scr(o, 36, 36, 128, 72, "painting");
        return svg(o, room(o, 172) + bias(o, "painting", 100, 74, 92, 58, .45) + dropShadow(30, 30, 140, 84, .35) +
          `<rect x="30" y="30" width="140" height="84" fill="${mat(o, c, "v")}"/>` + tex(o, c, R(30, 30, 140, 84)) + `<rect x="30.5" y="30.5" width="139" height="83" fill="none" stroke="#fff" stroke-opacity=".25"/>` +
          `<rect x="35" y="35" width="130" height="74" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/>` + inner + osd(o, 52, 92, 38) +
          (o.on ? `<path d="M76 25H124L146 74H54Z" fill="url(#${u}-pl)"/>` : "") +
          `<path d="M100 30V24" stroke="#6e4f1e" stroke-width="2"/><rect x="74" y="19.5" width="52" height="5.5" rx="2.75" fill="url(#${u}-brass)"/>` + (o.on ? `<rect x="78" y="23.6" width="44" height="1.4" rx=".7" fill="#fff4d6"/>` : "") +
          G(cabinet(o, 46, 146, 108, 22, "#6b4a30", { doors: 2, leg: 4 })) + vase(o, 66, 142.5) + G(`<ellipse cx="134" cy="141" rx="10" ry="3" fill="url(#${u}-pot)"/><path d="M124 141a10 4 0 0 0 20 0" fill="#9d978d"/>`));
      }
    },
    {
      id: "curved-tv", name: "Curved TV", colors: TVF, picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid;
        DEF.push(`<clipPath id="${u}-cv"><path d="M25.5 37.8Q100 53 174.5 37.8V122.2Q100 109.5 25.5 122.2Z"/></clipPath>`);
        return svg(o, room(o, 174) + bias(o, "abstract", 100, 80, 106, 66, .65) + cabinet(o, 22, 148, 156, 20, "#2a2725", { doors: 4, leg: 6 }) +
          `<rect x="95" y="116" width="10" height="27" fill="url(#${u}-blk)"/><path d="M66 145Q100 137 134 145L130 147.5H70Z" fill="url(#${u}-blk)"/>` +
          `<path d="M25 39Q100 54 177 39V129Q100 117 25 129Z" fill="#000" opacity=".3"/>` +
          `<path d="M22 34Q100 50 178 34V126Q100 112 22 126Z" fill="${mat(o, o.color, "h")}"/>` + tex(o, o.color, "M22 34Q100 50 178 34V126Q100 112 22 126Z") +
          `<path d="M22 126Q100 112 178 126V128.6Q100 114.6 22 128.6Z" fill="#000" opacity=".55"/>` +
          `<g clip-path="url(#${u}-cv)">${scr(o, 25, 36, 150, 88, "abstract")}<rect x="22" y="30" width="156" height="100" fill="url(#${u}-crv)"/></g>` +
          `<path d="M22.4 34.4Q100 50.4 177.6 34.4" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>` + osd(o, 36, 104, 44));
      }
    },
    {
      id: "outdoor-tv", name: "Outdoor TV", colors: ["#1b1d21", "#4a4f57", "#5a4636", "#ece9e3", "#8e949b"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        let bulbs = "";
        [[14, 18], [44, 23], [74, 25], [104, 24], [134, 21], [164, 19], [190, 17]].forEach((p) => { bulbs += `<path d="M${p[0]} ${p[1]}v2" stroke="#222" stroke-width="1"/><ellipse cx="${p[0]}" cy="${p[1] + 4.2}" rx="2" ry="2.8" fill="#fff" fill-opacity=".28" stroke="#fff" stroke-opacity=".35" stroke-width=".4"/>`; });
        const grass = (x) => `<path d="M${x - 10} 176h22l-2-24h-18Z" fill="#4a4c50"/><path d="M${x - 10} 152h22v2.5h-22Z" fill="#6a6c70"/><path d="M${x - 6} 152C${x - 10} 136 ${x - 14} 128 ${x - 18} 122M${x} 152C${x} 134 ${x - 2} 126 ${x - 1} 116M${x + 5} 152C${x + 8} 138 ${x + 12} 130 ${x + 18} 124M${x - 2} 152C${x - 4} 140 ${x - 8} 134 ${x - 8} 128M${x + 3} 152C${x + 4} 140 ${x + 6} 132 ${x + 8} 126" stroke="#6aa04a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
        return svg(o, G(`<rect width="200" height="176" fill="#7a4e2e"/><rect width="200" height="176" fill="url(#${u}-slat)"/><rect width="200" height="176" fill="#000" opacity=".3"/>` +
          `<rect y="176" width="200" height="24" fill="#6c6862"/><path d="M0 176H200M0 188H200M40 176V188M110 176V188M175 176V188M70 188V200M140 188V200" stroke="#2c2a27" stroke-width="1"/><rect y="176" width="200" height="6" fill="#000" opacity=".3"/>` +
          `<rect width="200" height="13" fill="#17191e"/><rect y="13" width="200" height="2.5" fill="#000" opacity=".45"/><path d="M0 16Q50 28 100 22T200 14" stroke="#222" stroke-width=".8" fill="none"/>` + bulbs) +
          bias(o, "meadow", 100, 84, 98, 64, .6) + dropShadow(30, 40, 140, 88, .4) + tv(o, 30, 40, 140, 86, "meadow", { b: 5.5, r: 3.5 }) +
          `<rect x="36" y="126" width="128" height="4.5" rx="1.5" fill="${mat(o, c, "v")}"/><path d="M60 128.3h80" stroke="#000" stroke-opacity=".55" stroke-width="1.4" stroke-dasharray="3 2"/>` +
          osd(o, 40, 110, 46) + G(grass(18) + grass(184)));
      }
    },
    {
      id: "projector", name: "Projector & screen", colors: ["#f0f0ee", "#1c1e22", "#8e949b", "#4a5058"], picker: true, colorLabel: "Finish",
      render(o) {
        // (parts) Projector (the lamp, the beam, the picture) and Screen (on = rolled down); the picture shows when both are on
        const u = o.uid, c = o.color, pp = MF.as(o, "projector"), ps = MF.as(o, "screen"), pb = Object.assign({}, o, { on: pp.on && ps.on });
        DEF.push(lg(u + "-bm", 0, [[0, "#fff", .55], [1, "#bfd0ff", .03]]) + lg(u + "-scr", 0, [[0, "#d9dadc"], [.5, "#f6f6f4"], [1, "#dcdddf"]]));
        const scrn = ps.on ? `<rect x="54" y="22" width="136" height="97" fill="url(#${u}-scr)"/>` + (pp.on ? `<rect x="56" y="26" width="132" height="78" fill="#111"/>` + scr(o, 58, 28, 128, 72, "mountains", 1) : `<rect x="56" y="26" width="132" height="78" fill="#e9eaec"/><rect x="56" y="26" width="132" height="78" fill="url(#${u}-scr)" opacity=".5"/>`) +
          `<rect x="52" y="118" width="140" height="3.6" rx="1.8" fill="url(#${u}-chrome)"/><circle cx="122" cy="125.5" r="2.6" fill="none" stroke="#c9ccd1" stroke-width="1.2"/>`
          : `<rect x="52" y="22" width="140" height="3.6" rx="1.8" fill="url(#${u}-chrome)"/><circle cx="122" cy="29.5" r="2.6" fill="none" stroke="#c9ccd1" stroke-width="1.2"/>`;
        return svg(o, room(o, 176) + bias(pb, "mountains", 122, 64, 92, 62, .55) + G(`<rect width="200" height="12" fill="#fff" fill-opacity=".1"/><rect y="12" width="200" height="1.2" fill="#000" fill-opacity=".35"/>`) +
          `<rect x="50" y="13.5" width="144" height="8.5" rx="4.2" fill="${mat(o, "#e4e6ea", "v")}"/><rect x="50" y="13.5" width="5" height="8.5" rx="2" fill="#9aa0a8"/><rect x="189" y="13.5" width="5" height="8.5" rx="2" fill="#9aa0a8"/>` + scrn +
          (pp.on ? `<path d="M46 27.5L186 28V100L46 32.5Z" fill="url(#${u}-bm)" opacity=".3" class="${P}beam"/>` : "") +
          `<rect x="24" y="0" width="4" height="20" fill="#2a2d33"/><rect x="17" y="19" width="18" height="3" rx="1" fill="#2a2d33"/>` +
          `<rect x="5" y="22" width="44" height="17" rx="4.5" fill="${mat(o, c, "v")}"/>` + tex(o, c, R(7, 23, 40, 15)) + `<path d="M10 27h14M10 30h14M10 33h14" stroke="#000" stroke-opacity=".35" stroke-width="1"/>` +
          `<circle cx="42" cy="30.5" r="6.2" fill="#15171b"/><circle cx="42" cy="30.5" r="4.4" fill="url(#${u}-cone)"/>` +
          (pp.on ? `<circle cx="44" cy="30.5" r="9" fill="url(#${u}-hz)"/><circle cx="42.6" cy="30.5" r="2.4" fill="#fff"/>` : `<circle cx="41" cy="29.4" r="1.2" fill="#fff" opacity=".35"/>`) + led(pp, 30, 35.5, "#7cf0a0") +
          osd(o.mf ? OFF : o, 64, 90, 40) + G(
          `<path d="M-4 200V178C-4 170 2 166 10 166H190C198 166 204 170 204 178V200Z" fill="${mat(o, "#3a3f4a", "v")}"/><path d="M-4 200V178C-4 170 2 166 10 166H190C198 166 204 170 204 178V200Z" fill="url(#${u}-fab)"/>` +
          `<path d="M66 168V200M134 168V200" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/><path d="M8 167.5H192" stroke="#fff" stroke-opacity=".18"/>` +
          pillow(o, 34, 170, -8, "#c98a5a") + pillow(o, 164, 170, 7, "#d8cbb4") + pillow(o, 148, 172, -4, "#5d7a8c")));
      }, parts: [{ id: "projector", name: "Projector" }, { id: "screen", name: "Screen" }]
    },
    {
      id: "ust", name: "Short-throw projector", colors: ["#f0f0ee", "#1c1e22", "#5a6068", "#c9b49a"], picker: true, colorLabel: "Finish",
      render(o) {
        // (parts) Projector and Screen (a rising screen: ticked and off = lowered into the cabinet, the picture faint on the
        // wall; left out = always up, as today)
        const u = o.uid, c = o.color, pp = MF.as(o, "projector"), up = MF.has(o, "screen") ? !!o.parts.screen : true;
        DEF.push(lg(u + "-bmu", 1, [[0, "#c9ffe8", .05], [1, "#fff", .55]]));
        return svg(o, room(o, 178) + bias(pp, "aurora", 100, 58, 104, 62, .55) +
          (up ? `<rect x="14" y="12" width="172" height="90" rx="1" fill="#14161b"/><rect x="16" y="14" width="168" height="86" fill="#2a2e35"/><rect x="16" y="14" width="168" height="86" fill="url(#${u}-ref)" opacity=".5"/>` : "") +
          (pp.on ? (up ? scr(o, 16, 14, 168, 86, "aurora", 1) : `<g opacity=".4">${scr(o, 16, 14, 168, 86, "aurora", 1)}</g>`) + `<path d="M86 134H114L184 100H16Z" fill="url(#${u}-bmu)" opacity=".42" class="${P}beam"/>` : "") +
          cabinet(o, 24, 152, 152, 20, "#b8875a", { doors: 3, leg: 6 }) + sh(o, 100, 149, 46, 3.5) +
          `<rect x="56" y="131" width="88" height="18" rx="5" fill="${mat(o, c, "v")}"/>` + tex(o, c, R(58, 132, 84, 16)) +
          `<rect x="58" y="139" width="84" height="9" rx="3.5" fill="${mat(o, H().shade(c, -.12), "v")}"/><rect x="58" y="139" width="84" height="9" rx="3.5" fill="url(#${u}-fab)"/>` +
          `<rect x="80" y="132.5" width="40" height="3.8" rx="1.6" fill="#07090c"/>` + (pp.on ? `<ellipse cx="100" cy="134" rx="22" ry="5" fill="url(#${u}-hz)"/><rect x="82" y="133.2" width="36" height="2" rx="1" fill="#eafff6"/>` : `<rect x="81" y="133" width="18" height="1" fill="#fff" opacity=".2"/>`) +
          led(pp, 136, 135, "#7cf0a0") + osd(o.mf ? OFF : o, 24, 86, 46));
      }, parts: [{ id: "projector", name: "Projector" }, { id: "screen", name: "Screen" }]
    },
    {
      id: "soundbar-tv", name: "Soundbar & TV", colors: FAB, picker: true, colorLabel: "Fabric",
      render(o) {
        // (parts) TV (the picture), Sound (the soundbar's lights and sound waves), Volume (the bar's dots and the TV's bar)
        const u = o.uid, c = o.color, vl = MF.vol(o), pt = MF.as(o, "tv"), ps = MF.as(o, "sound", vl), lit = Math.round(ps.level * 5);
        let dots = "";
        for (let i = 0; i < 5; i++) dots += ps.on && i < lit ? `<circle cx="${90 + i * 5}" cy="126" r="2.4" fill="#fff" opacity=".3"/><circle cx="${90 + i * 5}" cy="126" r="1" fill="#fff"/>` : `<circle cx="${90 + i * 5}" cy="126" r=".9" fill="#000" opacity=".35"/>`;
        return svg(o, room(o, 174) + bias(pt, "dunes", 100, 72, 104, 60, .6) + dropShadow(26, 24, 148, 84) + tv(pt, 26, 24, 148, 84, "dunes", { col: "#1b1d21" }) + osd(vl == null ? OFF : Object.assign({}, pt, { level: vl }), 34, 96, 44) +
          `<rect x="34" y="120" width="136" height="13" rx="6" fill="#000" opacity=".3"/><rect x="32" y="116" width="136" height="13" rx="6" fill="${mat(o, c, "v")}"/><rect x="32" y="116" width="136" height="13" rx="6" fill="url(#${u}-fab)"/><rect x="32" y="116" width="136" height="13" rx="6" fill="url(#${u}-fx)"/>` +
          `<path d="M38 116.8H162" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/><rect x="84" y="122.5" width="32" height="7" rx="3.5" fill="#000" opacity=".2"/>` + dots +
          waves(ps, 30, 122.5, "l", CY, .85) + waves(ps, 170, 122.5, "r", CY, .85) + plant(o, 176, 174, 1.15));
      }, parts: [{ id: "tv", name: "TV" }, { id: "sound", name: "Soundbar" }, { id: "volume", name: "Volume", type: "value", unit: "%", min: 0, max: 100, def: 30 }]
    },
    {
      id: "soundbar-sub", name: "Soundbar & sub", colors: FAB, picker: true, colorLabel: "Fabric",
      render(o) {
        // (parts) TV, Sound (the soundbar), Sub (the subwoofer's cone and light), Volume (the bar's dots, the TV's bar)
        const u = o.uid, c = o.color, vl = MF.vol(o), pt = MF.as(o, "tv"), ps = MF.as(o, "sound", vl), pw = MF.as(o, "sub", vl), lit = Math.round(ps.level * 5);
        let dots = "";
        for (let i = 0; i < 5; i++) dots += ps.on && i < lit ? `<circle cx="${62 + i * 5}" cy="117" r="2.2" fill="#fff" opacity=".3"/><circle cx="${62 + i * 5}" cy="117" r=".9" fill="#fff"/>` : `<circle cx="${62 + i * 5}" cy="117" r=".8" fill="#000" opacity=".35"/>`;
        return svg(o, room(o, 178) + bias(pt, "mountains", 80, 10, 100, 58, .6) + tv(pt, 6, -30, 148, 76, "mountains", { col: "#1b1d21" }) + osd(vl == null ? OFF : Object.assign({}, pt, { level: vl }), 14, 34, 42) +
          cabinet(o, 10, 124, 120, 40, "#5e3f28", { doors: 2, leg: 14 }) + sh(o, 70, 121, 54, 3) +
          `<path d="M22 108L26 104H114L118 108Z" fill="${mat(o, H().shade(c, .15), "t")}"/><rect x="20" y="107.5" width="100" height="13" rx="5.5" fill="${mat(o, c, "v")}"/><rect x="20" y="107.5" width="100" height="13" rx="5.5" fill="url(#${u}-fab)"/><rect x="20" y="107.5" width="100" height="13" rx="5.5" fill="url(#${u}-fx)"/>` + dots +
          sh(o, 164, 178, 30, 4) + `<path d="M140 132L146 126H190L186 132Z" fill="${mat(o, H().shade(c, .12), "t")}"/><path d="M186 132L190 126V172L186 178Z" fill="${H().shade(c, -.45)}"/>` +
          `<rect x="140" y="132" width="46" height="46" rx="2" fill="${mat(o, c, "v")}"/><rect x="140" y="132" width="46" height="46" rx="2" fill="url(#${u}-fab)"/>` + cone(pw, 163, 152, 15, 1) +
          `<rect x="150" y="171" width="26" height="3" rx="1.5" fill="#07080a"/>` + led(pw, 182, 136, "#7cf0a0") + waves(ps, 70, 103, "u", CY, .9));
      }, parts: [{ id: "tv", name: "TV" }, { id: "sound", name: "Soundbar" }, { id: "sub", name: "Subwoofer" }, { id: "volume", name: "Volume", type: "value", unit: "%", min: 0, max: 100, def: 30 }]
    },
    {
      id: "cylinder", name: "Speaker cylinder", colors: FAB, picker: true, colorLabel: "Fabric",
      render(o) {
        const u = o.uid, c = o.color;
        const body = "M76 62V150A24 6 0 0 0 124 150V62Z";
        return svg(o, room(o, 184) + G(`<rect x="20" y="22" width="40" height="52" fill="${mat(o, "#2a2725", "v")}"/><rect x="24" y="26" width="32" height="44" fill="#ece5d6"/><circle cx="46" cy="40" r="6" fill="#e0894a"/><path d="M24 70V58C32 52 40 56 46 60S54 56 56 54V70Z" fill="#5c7a8c"/>`) +
          `<path d="M97 160h6l3 22h-12Z" fill="${mat(o, "#7a4b2a", "h")}"/><ellipse cx="100" cy="183" rx="20" ry="3.5" fill="#3a2414"/>` +
          `<path d="M42 158V162A58 9 0 0 0 158 162V158Z" fill="#4a2e18"/><ellipse cx="100" cy="158" rx="58" ry="9" fill="${mat(o, "#9a6a3a", "t")}"/><ellipse cx="100" cy="158" rx="58" ry="9" fill="url(#${u}-grain)"/>` +
          sh(o, 100, 152, 32, 5) + `<path d="${body}" fill="${mat(o, c, "h")}"/><path d="${body}" fill="url(#${u}-fab)"/>` +
          `<path d="M76 143V150A24 6 0 0 0 124 150V143A24 6 0 0 1 76 143Z" fill="url(#${u}-blk)"/>` +
          `<ellipse cx="100" cy="62" rx="24" ry="6" fill="#1d2024"/><ellipse cx="100" cy="62.6" rx="18" ry="4.2" fill="#2e3238"/><circle cx="92" cy="62" r=".9" fill="#888"/><circle cx="108" cy="62" r=".9" fill="#888"/>` +
          ring(o, 100, 62, 23.2, 5.6, CY) + waves(o, 100, 50, "u", CY) + flatBooks(122, 156, 26) + G(`<path d="M56 152h10v4a5 2 0 0 1-10 0Z" fill="#f1ede6"/><path d="M66 153a3 2.4 0 1 1 0 2.6" fill="none" stroke="#f1ede6" stroke-width="1.2"/>`));
      }
    },
    {
      id: "sphere", name: "Speaker sphere", colors: FAB, picker: true, colorLabel: "Fabric",
      render(o) {
        const u = o.uid, c = o.color;
        DEF.push(halo(u + "-rg", CY, .8));
        return svg(o, room(o, 188) + shelf(o, 14, 150, 172) + books(22, 150) + plant(o, 168, 150, .75) +
          (o.on ? `<ellipse cx="100" cy="150.5" rx="44" ry="6" fill="url(#${u}-rg)"/>` : sh(o, 100, 150, 30, 3)) +
          `<ellipse cx="100" cy="146.5" rx="19" ry="4" fill="#15171b"/>` + ring(o, 100, 146.5, 19, 4, CY, 1) +
          `<circle cx="100" cy="110" r="36" fill="${mat(o, c, "r")}"/><circle cx="100" cy="110" r="36" fill="url(#${u}-fab)"/><circle cx="100" cy="110" r="35.5" fill="none" stroke="#fff" stroke-opacity=".14"/>` +
          `<ellipse cx="88" cy="90" rx="13" ry="7" fill="#fff" opacity=".13" transform="rotate(-28 88 90)"/><ellipse cx="100" cy="76.5" rx="10" ry="2.4" fill="#000" opacity=".16"/>` +
          waves(o, 62, 110, "l", CY, .9) + waves(o, 138, 110, "r", CY, .9));
      }
    },
    {
      id: "puck", name: "Puck speaker", colors: FAB, picker: true, colorLabel: "Fabric",
      render(o) {
        const u = o.uid, c = o.color, top = H().mix(c, "#202226", .6);
        DEF.push(halo(u + "-rg", CY, .7));
        return svg(o, G(`<rect width="200" height="112" fill="url(#${u}-wall)"/><rect y="112" width="200" height="88" fill="${mat(o, "#6e4a30", "v")}"/><rect y="112" width="200" height="88" fill="url(#${u}-grain)"/><rect y="112" width="200" height="10" fill="url(#${u}-fls)"/>` +
          `<path d="M150 112V82C150 74 176 74 176 82V112Z" fill="url(#${u}-pot)"/><path d="M136 56H190L182 16H144Z" fill="${mat(o, "#e8dcc6", "h")}"/><path d="M136 56H190L182 16H144Z" fill="url(#${u}-fab)" opacity=".6"/><path d="M136 56H190" stroke="#fff" stroke-opacity=".3"/><rect x="161.5" y="56" width="3" height="19" fill="url(#${u}-brass)"/>` +
          `<rect x="12" y="104" width="54" height="8" fill="#2f4f6f"/><rect x="16" y="96" width="46" height="8" fill="#a84a3a"/><rect x="12" y="104" width="54" height="1" fill="#fff" opacity=".3"/><rect x="16" y="96" width="46" height="1" fill="#fff" opacity=".3"/>`) +
          (o.on ? `<ellipse cx="100" cy="150" rx="66" ry="14" fill="url(#${u}-rg)"/>` : "") + sh(o, 100, 148, 58, 12) +
          `<path d="M50 128V142A50 17 0 0 0 150 142V128Z" fill="${mat(o, c, "h")}"/><path d="M50 128V142A50 17 0 0 0 150 142V128Z" fill="url(#${u}-fab)"/>` +
          `<ellipse cx="100" cy="128" rx="50" ry="17" fill="${mat(o, top, "v")}"/><ellipse cx="100" cy="128" rx="50" ry="17" fill="url(#${u}-g)" opacity=".25"/><ellipse cx="100" cy="128" rx="49.4" ry="16.6" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>` +
          `<g fill="#000" fill-opacity=".35"><circle cx="78" cy="126" r="2.2"/><circle cx="92" cy="122.5" r="2.2"/><circle cx="108" cy="122.5" r="2.2"/><circle cx="122" cy="126" r="2.2"/></g><path d="M76.8 126h2.4M106.8 122.5h2.4M108 121.3v2.4M90.8 122.5h2.4" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/>` +
          ring(o, 100, 142, 50, 17, CY, 1) + waves(o, 100, 106, "u", CY));
      }
    },
    {
      id: "display", name: "Smart display", colors: FAB, picker: true, colorLabel: "Fabric",
      render(o) {
        const u = o.uid, c = o.color;
        DEF.push(lg(u + "-scrim", 1, [[0, "#06101c", .6], [1, "#06101c", 0]]));
        return svg(o, G(`<rect width="200" height="150" fill="url(#${u}-wall)"/><rect width="200" height="150" fill="url(#${u}-tile)"/>` +
          `<rect y="148" width="200" height="10" fill="${mat(o, "#d9d4ca", "v")}"/><rect y="158" width="200" height="3" fill="#8a857c"/><rect y="161" width="200" height="39" fill="${mat(o, "#4f6159", "v")}"/><path d="M66 164V200M134 164V200" stroke="#000" stroke-opacity=".35"/><rect x="58" y="168" width="2" height="12" rx="1" fill="#d8c9a0"/><rect x="140" y="168" width="2" height="12" rx="1" fill="#d8c9a0"/>`) +
          sh(o, 100, 149, 46, 3.5) + `<path d="M58 149L68 112H132L142 149Z" fill="${mat(o, c, "v")}"/><path d="M58 149L68 112H132L142 149Z" fill="url(#${u}-fab)"/><path d="M58 149L68 112H132L142 149Z" fill="url(#${u}-fx)"/>` +
          `<rect x="40" y="52" width="120" height="74" rx="4" fill="#0c0e12"/><rect x="40.5" y="52.5" width="119" height="73" rx="3.6" fill="none" stroke="#fff" stroke-opacity=".22"/>` +
          scr(o, 44, 56, 112, 66, "meadow") +
          (o.on ? `<rect x="44" y="56" width="112" height="28" fill="url(#${u}-scrim)"/>` + seg("7:30", 52, 62, 13, "#fff") +
            `<circle cx="140" cy="68" r="4.2" fill="#ffd25a"/><path d="M140 61v-2M140 77v-2M133 68h-2M149 68h-2M135 63l-1.4-1.4M145 63l1.4-1.4M135 73l-1.4 1.4M145 73l1.4 1.4" stroke="#ffd25a" stroke-width="1.1"/>` + osd(o, 52, 109, 44) : "") +
          `<circle cx="100" cy="54.2" r=".9" fill="#2a3a4a"/>` + vase(o, 172, 148) + G(`<path d="M14 148V136C14 132 30 132 30 136V148Z" fill="#c9b49a"/><path d="M16 136C16 128 28 128 28 136" fill="none" stroke="#7a6a4a" stroke-width="1.4"/>`));
      }
    },
    {
      id: "box", name: "Streaming box", colors: PLAS, picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        return svg(o, room(o, 178) + bias(o, "sunset", 100, 30, 100, 50, .6) + tv(o, 14, -36, 172, 96, "sunset", { col: "#1b1d21" }) + osd(o, 22, 46, 46) +
          `<path d="M128 106C140 92 150 82 150 60" stroke="#111" stroke-width="2.2" fill="none"/>` +
          cabinet(o, 10, 132, 180, 38, "#7a4b2a", { doors: 3, leg: 8 }) + sh(o, 100, 129, 38, 3) +
          `<path d="M70 112L76 105H128L134 112Z" fill="${mat(o, H().shade(c, .1), "t")}"/><path d="M70 112L76 105H128L134 112Z" fill="url(#${u}-g)" opacity=".5"/>` +
          `<rect x="70" y="111" width="64" height="18" rx="3" fill="${mat(o, c, "v")}"/>` + tex(o, c, R(72, 112, 60, 16)) + `<rect x="70.5" y="111.5" width="63" height="17" rx="2.6" fill="none" stroke="#fff" stroke-opacity=".16"/>` +
          led(o, 124, 120, "#ffffff", "#4a2020") +
          `<g transform="rotate(-6 160 124)"><rect x="142" y="120" width="38" height="7" rx="3.5" fill="#1c1e22"/><rect x="142" y="120" width="38" height="2" rx="1" fill="#fff" opacity=".12"/><circle cx="170" cy="123.5" r="2.2" fill="#3a3e45"/><circle cx="152" cy="123.5" r="1" fill="#555"/><circle cx="157" cy="123.5" r="1" fill="#555"/></g>`);
      }
    },
    {
      id: "stick", name: "Streaming stick", colors: ["#1c1e22", "#f2f2f0", "#7a2e3a", "#3a5f8a", "#5a6068"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        return svg(o, G(`<rect width="200" height="200" fill="url(#${u}-wall)"/>`) + bias(o, "abstract", 56, 86, 96, 76, .6) +
          `<path d="M120 22L131 28V146L120 152Z" fill="${mat(o, "#2e3238", "h")}"/><rect x="122.5" y="99" width="6" height="11" fill="#050608"/>` +
          tv(o, -24, 22, 144, 130, "abstract", { col: "#1b1d21", b: 3 }) + osd(o, 6, 136, 50) +
          `<rect x="124" y="100.5" width="9" height="8" fill="url(#${u}-chrome)"/>` +
          `<rect x="131" y="95" width="46" height="19" rx="6" fill="${mat(o, c, "v")}"/>` + tex(o, c, R(133, 96, 42, 17)) + `<rect x="131.5" y="95.5" width="45" height="18" rx="5.6" fill="none" stroke="#fff" stroke-opacity=".2"/><path d="M140 104.5h18" stroke="#000" stroke-opacity=".22" stroke-width="1.2"/>` +
          led(o, 170, 104.5, "#ffffff") +
          `<path d="M177 104.5C190 104 192 122 186 142S172 186 180 210" stroke="#17191d" stroke-width="2.8" fill="none"/><path d="M177 103.6C189 103.6 190.6 121 185 141" stroke="#fff" stroke-opacity=".15" stroke-width=".8" fill="none"/>`);
      }
    },
    {
      id: "console", name: "Game console", colors: ["#f2f2f0", "#1c1e22", "#7a8a99", "#2c3b5c", "#b23a3a"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color, BL = "#4da3ff";
        const strip = (x) => o.on ? `<rect x="${x - 1.6}" y="74" width="3.2" height="72" fill="${BL}" opacity=".3" class="${P}pulse"/><rect x="${x - .5}" y="74" width="1" height="72" fill="#cfe6ff" class="${P}pulse"/>` : `<rect x="${x - .5}" y="74" width="1" height="72" fill="#000" opacity=".5"/>`;
        return svg(o, room(o, 178) + bias(o, "dunes", 60, 52, 82, 54, .6) + dropShadow(-14, 14, 132, 76) + tv(o, -14, 14, 132, 76, "dunes", { col: "#1b1d21" }) + osd(o, 6, 76, 42) +
          cabinet(o, 6, 150, 188, 22, "#2a2725", { doors: 4, leg: 6 }) + sh(o, 158, 147, 26, 3) +
          `<rect x="149" y="72" width="18" height="75" rx="2" fill="url(#${u}-blk)"/>` +
          `<path d="M136 76C138 70 145 68 151 70V147H140C138 124 136 98 136 76Z" fill="${mat(o, c, "v")}"/><path d="M136 76C138 70 145 68 151 70V147H140C138 124 136 98 136 76Z" fill="url(#${u}-g)" opacity=".35"/>` +
          `<path d="M165 70C171 68 178 70 180 76C180 98 178 124 176 147H165Z" fill="${mat(o, H().shade(c, -.1), "v")}"/>` +
          strip(151.5) + strip(164.5) + led(o, 158, 140, "#ffffff") + `<path d="M152 71.5h12" stroke="#fff" stroke-opacity=".25"/>` +
          `<g transform="matrix(1.15 0 0 .8 -12 25)"><ellipse cx="74" cy="152" rx="26" ry="10" fill="#000" opacity=".35"/><path d="M50 140C50 133 57 132 63 133H85C91 132 98 133 98 140C98 147 94 151 89 148L83 144H65L59 148C54 151 50 147 50 140Z" fill="${mat(o, c, "v")}"/>` +
          `<circle cx="66" cy="141" r="3.4" fill="#1a1c20"/><circle cx="82" cy="141" r="3.4" fill="#1a1c20"/>` + (o.on ? `<rect x="64" y="131.6" width="20" height="2.4" rx="1.2" fill="${BL}"/>` : `<rect x="64" y="131.6" width="20" height="2.4" rx="1.2" fill="#000" opacity=".4"/>`) + `</g>`);
      }
    },
    {
      id: "receiver", name: "AV receiver", colors: ["#1c1e22", "#b8bcc1", "#c7b07f", "#3d4148"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color, vol = Math.round(o.level * 80), dc = "#69d6ff";
        let bars = "";
        const hs = [.5, .8, .65, 1, .7, .9, .55, .75];
        hs.forEach((hh, i) => { const bh = 12 * hh * (.3 + .7 * o.level); bars += `<rect x="${78 + i * 3.6}" y="${n1(123 - bh)}" width="2.4" height="${n1(bh)}" fill="${dc}" class="${o.on ? P + "vu" : ""}" style="animation-delay:${(i * .11).toFixed(2)}s;animation-duration:${(.45 + (i % 3) * .14).toFixed(2)}s"/>`; });
        const a1 = 135 + 270 * o.level;
        const glow = o.on ? `<path d="${arcP(150, 119, 22, 135, 405)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="2.6"/><path d="${arcP(150, 119, 22, 135, a1)}" fill="none" stroke="${dc}" stroke-opacity=".3" stroke-width="6" stroke-linecap="round" class="${P}pulse"/><path d="${arcP(150, 119, 22, 135, a1)}" fill="none" stroke="${dc}" stroke-width="2.2" stroke-linecap="round"/>` : `<path d="${arcP(150, 119, 22, 135, 405)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="2.6"/>`;
        const q = Math.PI / 180, ix = 150 + 9 * Math.cos(a1 * q), iy = 119 + 9 * Math.sin(a1 * q);
        return svg(o, room(o, 184) + `<rect x="10" y="66" width="180" height="112" fill="${mat(o, "#6b4a30", "v")}"/><rect x="10" y="66" width="180" height="112" fill="url(#${u}-grain)"/><rect x="8" y="62" width="184" height="5" rx="1" fill="${mat(o, "#7d5638", "t")}"/>` +
          `<rect x="18" y="74" width="164" height="78" fill="#0a0b0e"/><rect x="18" y="74" width="164" height="14" fill="url(#${u}-fls)"/><rect x="18" y="156" width="164" height="16" fill="#000" opacity=".18"/><rect x="92" y="162" width="16" height="2" rx="1" fill="#e2d2a8"/>` +
          plant(o, 34, 62, .62) + G(`<g transform="rotate(-8 160 62)"><rect x="146" y="34" width="28" height="28" fill="#2f4f6f"/><circle cx="160" cy="48" r="8" fill="#e0894a"/></g><rect x="168" y="36" width="26" height="26" fill="#c9a45c"/><rect x="168" y="36" width="26" height="1" fill="#fff" opacity=".3"/>`) +
          `<path d="M24 92L28 88H172L176 92Z" fill="#1a1c20"/><path d="M40 90H160" stroke="#000" stroke-width="1.6" stroke-dasharray="2 1.5"/>` +
          `<rect x="24" y="92" width="152" height="56" rx="2.5" fill="${mat(o, c, "v")}"/>` + tex(o, c, R(25, 93, 150, 54)) + `<rect x="24.5" y="92.5" width="151" height="55" rx="2.2" fill="none" stroke="#fff" stroke-opacity=".22"/>` +
          `<rect x="34" y="104" width="78" height="22" rx="2" fill="#04060a"/>` + (o.on ? seg(String(vol).padStart(2, "0"), 40, 108, 13, dc) + bars + `<rect x="34" y="104" width="78" height="22" rx="2" fill="${dc}" opacity=".05"/>` : "") + `<rect x="34" y="104" width="78" height="22" rx="2" fill="url(#${u}-ref)"/>` +
          glow + `<circle cx="150" cy="121" r="17" fill="#000" opacity=".35"/><circle cx="150" cy="119" r="17" fill="url(#${u}-knob)"/><circle cx="150" cy="119" r="16" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.6" stroke-dasharray="1 1"/><circle cx="150" cy="119" r="12" fill="url(#${u}-chrome)"/>` +
          `<circle cx="${n2(ix)}" cy="${n2(iy)}" r="1.4" fill="${o.on ? dc : "#333"}"/>` +
          `<circle cx="122" cy="119" r="5.5" fill="url(#${u}-knob)"/><g fill="#000" fill-opacity=".45">${[38, 46, 54, 62, 70, 78, 86, 94, 102].map((x) => `<rect x="${x}" y="134" width="5" height="2.4" rx="1.2"/>`).join("")}</g>` + led(o, 30, 98, "#7cf0a0", "#4a2020") +
          `<rect x="30" y="148" width="10" height="3" fill="#111"/><rect x="160" y="148" width="10" height="3" fill="#111"/>`);
      }
    },
    {
      id: "turntable", name: "Turntable", colors: WOOD, picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        DEF.push(rad(u + "-plt", [[0, "#5a5f66"], [.9, "#c9ccd1"], [1, "#7a8088"]]));
        const arm = o.on ? "M148 102L134 110L114 115" : "M148 102L155 116L153 125";
        const hx = o.on ? 114 : 153, hy = o.on ? 115 : 125;
        let grooves = "";
        for (let r = 15; r <= 33; r += 3) grooves += `<circle r="${r}" fill="none" stroke="#fff" stroke-opacity="${r % 2 ? .06 : .1}" stroke-width=".6"/>`;
        return svg(o, room(o, 176) + cabinet(o, 18, 134, 164, 36, "#6b4a30", { doors: 2, leg: 6 }) + sh(o, 100, 133, 74, 4) +
          `<path d="M30 95H170L176 124H24Z" fill="${mat(o, c, "t")}"/>` + tex(o, c, "M30 95H170L176 124H24Z") + `<path d="M30 95.4H170" stroke="#fff" stroke-opacity=".3"/>` +
          `<rect x="24" y="124" width="152" height="8" fill="${mat(o, H().shade(c, -.2), "v")}"/>` + tex(o, c, R(24, 124, 152, 8)) + `<rect x="24" y="124" width="152" height=".8" fill="#fff" opacity=".25"/>` +
          `<ellipse cx="86" cy="113" rx="38" ry="15.2" fill="#2a2d33"/>` +
          `<g transform="translate(86 110) scale(1 .4)"><circle r="38" fill="url(#${u}-plt)"/><g class="${o.on ? P + "spin" : ""}"><circle r="35" fill="#0d0e10"/>${grooves}<circle r="11" fill="#d24b3b"/><path d="M-10 -2H10V2H-10Z" fill="#f4e6c8"/><circle cx="0" cy="-7" r="1.6" fill="#f4e6c8"/></g><circle r="1.6" fill="#ddd"/>` +
          `<path d="M-30 -20A36 36 0 0 1 10 -34L6 -20A22 22 0 0 0 -18 -12Z" fill="#fff" opacity=".1"/></g>` +
          `<ellipse cx="148" cy="103" rx="7" ry="3.5" fill="url(#${u}-chrome)"/><rect x="149" y="92" width="7" height="6" rx="1.5" fill="url(#${u}-blk)"/><circle cx="156" cy="124" r="1.6" fill="#2a2d33"/>` +
          `<path d="${arm}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="${arm}" fill="none" stroke="#e1e4e8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>` +
          `<rect x="${hx - 4}" y="${hy - 1.6}" width="7" height="3.6" rx="1" fill="#1a1c20"/>` +
          `<circle cx="40" cy="128" r="2.2" fill="url(#${u}-chrome)"/><circle cx="50" cy="128" r="2.2" fill="url(#${u}-chrome)"/>` + led(o, 34, 121, "#ff4b3e") +
          waves(o, 86, 92, "u", WARM, .9));
      }
    },
    {
      id: "bookshelf", name: "Bookshelf speakers", colors: WOOD, picker: true, colorLabel: "Finish",
      render(o) {
        const c = o.color;
        const spk = (x, y, L) => {
          const w = 44, h = 64, side = L ? `M${x + w} ${y}L${x + w + 7} ${y + 3}V${y + h - 1}L${x + w} ${y + h}Z` : `M${x} ${y}L${x - 7} ${y + 3}V${y + h - 1}L${x} ${y + h}Z`;
          return sh(o, x + w / 2, y + h, 30, 3) + `<path d="${side}" fill="${H().shade(c, -.45)}"/>` + tex(o, c, side) + surf(o, c, x, y, w, h, "v", 2) +
            `<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="2" fill="url(#${o.uid}-blk)"/>` + tweet(o, x + w / 2, y + 14, 5.5) + cone(o, x + w / 2, y + 38, 14.5) +
            `<rect x="${x + 14}" y="${y + 54}" width="16" height="3.2" rx="1.6" fill="#000"/><rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="2" fill="none" stroke="#fff" stroke-opacity=".18"/>`;
        };
        return svg(o, room(o, 176) + cabinet(o, 14, 138, 172, 32, "#b8875a", { doors: 3, leg: 6 }) + spk(26, 70, 1) + spk(130, 70, 0) + plant(o, 100, 134.5, .78) +
          G(`<g transform="rotate(-5 84 120)"><rect x="74" y="106" width="22" height="22" fill="#2f4f6f"/><circle cx="85" cy="117" r="6" fill="#e0894a"/></g>`) +
          waves(o, 18, 102, "l", WARM, .8) + waves(o, 182, 102, "r", WARM, .8));
      }
    },
    {
      id: "tower", name: "Tower speakers", colors: FAB, picker: true, colorLabel: "Fabric",
      render(o) {
        const u = o.uid, c = o.color;
        const tw = (x, L) => {
          const y = 34, w = 38, h = 142, side = L ? `M${x + w} ${y}L${x + w + 8} ${y + 4}V${y + h - 2}L${x + w} ${y + h}Z` : `M${x} ${y}L${x - 8} ${y + 4}V${y + h - 2}L${x} ${y + h}Z`;
          const cx = x + w / 2;
          return sh(o, cx, y + h + 3, 30, 4) + `<path d="${side}" fill="${mat(o, "#5e3f28", "v")}"/><path d="${side}" fill="url(#${u}-grain)"/>` +
            `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${mat(o, c, "v")}"/>` +
            `<g opacity="${o.on ? .5 : .28}">${tweet(o, cx, y + 16, 5)}${cone(o, cx, y + 46, 13)}${cone(o, cx, y + 82, 13)}<rect x="${cx - 7}" y="${y + 112}" width="14" height="5" rx="2.5" fill="#000"/></g>` +
            `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#${u}-fab)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#${u}-fx)"/><rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="2.6" fill="none" stroke="#fff" stroke-opacity=".2"/>` +
            `<rect x="${x - 3}" y="${y + h}" width="${w + 6}" height="5" rx="1.5" fill="#1a1c20"/><path d="M${x} ${y + h + 5}l1.5 3 1.5-3M${x + w - 3} ${y + h + 5}l1.5 3 1.5-3" fill="#888"/>` + led(o, cx, y + h - 6, "#9fd8ff");
        };
        return svg(o, room(o, 180) + G(`<ellipse cx="100" cy="191" rx="98" ry="11" fill="#6a3440" opacity=".75"/><ellipse cx="100" cy="191" rx="88" ry="8" fill="none" stroke="#e2c08a" stroke-opacity=".4" stroke-dasharray="3 2"/>` +
          `<rect x="80" y="26" width="40" height="50" fill="${mat(o, "#2a2725", "v")}"/><rect x="83.5" y="29.5" width="33" height="43" fill="#ece5d6"/><rect x="88" y="35" width="12" height="20" fill="#2f4f6f"/><rect x="98" y="43" width="14" height="22" fill="#e0894a"/><circle cx="94" cy="63" r="4" fill="#c9a45c"/>`) +
          plant(o, 100, 178, 1.3) + tw(20, 1) + tw(142, 0) + waves(o, 70, 106, "r", WARM, .75) + waves(o, 130, 106, "l", WARM, .75));
      }
    }
  ];

  (window.HDA = window.HDA || []).push({
    id: "media",
    tab: "TVs & media",
    group: "Home",
    kind: "device",
    levelLabel: "Volume",
    onWord: "Playing", offWord: "Off",
    intro: "Twenty TVs, projectors, speakers and players, each in a bit of living room. When playing, screens show original scenery with a soft glow on the wall, speaker light rings pulse, woofers pump and the record spins; the slider is the volume (on-screen bar, sound waves, LEDs or the receiver knob).",
    
    css: `
.hda-anim .hda-media-drift{animation:hda-media-drift 11s ease-in-out infinite}
@keyframes hda-media-drift{0%,100%{opacity:0}50%{opacity:.24}}
.hda-anim .hda-media-pan{animation:hda-media-pan 14s ease-in-out infinite alternate}
@keyframes hda-media-pan{from{transform:translate(-6px,0)}to{transform:translate(6px,0)}}
.hda-anim .hda-media-orb{animation:hda-media-orb 9s ease-in-out infinite alternate}
@keyframes hda-media-orb{from{transform:translate(0,0)}to{transform:translate(14px,8px)}}
.hda-anim .hda-media-pulse{animation:hda-media-pulse 2.6s ease-in-out infinite}
@keyframes hda-media-pulse{0%,100%{opacity:.55}50%{opacity:1}}
.hda-anim .hda-media-wv{animation:hda-media-wv 1.5s ease-out infinite}
@keyframes hda-media-wv{0%{opacity:.15}30%{opacity:1}100%{opacity:.15}}
.hda-anim .hda-media-cone{transform-box:fill-box;transform-origin:center;animation:hda-media-cone .6s ease-in-out infinite}
@keyframes hda-media-cone{0%,100%{transform:scale(1)}50%{transform:scale(.92)}}
.hda-anim .hda-media-spin{transform-box:fill-box;transform-origin:center;animation:hda-media-spin 1.8s linear infinite}
@keyframes hda-media-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-media-vu{transform-box:fill-box;transform-origin:50% 100%;animation:hda-media-vu .6s ease-in-out infinite alternate}
@keyframes hda-media-vu{from{transform:scaleY(.4)}to{transform:scaleY(1)}}
.hda-anim .hda-media-beam{animation:hda-media-beam 4s ease-in-out infinite}
@keyframes hda-media-beam{0%,100%{opacity:.26}50%{opacity:.4}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-media-drift,.hda-anim .hda-media-pan,.hda-anim .hda-media-orb,.hda-anim .hda-media-pulse,.hda-anim .hda-media-wv,.hda-anim .hda-media-cone,.hda-anim .hda-media-spin,.hda-anim .hda-media-vu,.hda-anim .hda-media-beam{animation:none}}
`,
    icons
  });
})();
