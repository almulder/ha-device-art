
(function () {
  const P = "hda-people-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const M = (p) => `M${f(p[0])} ${f(p[1])}`, L = (p) => `L${f(p[0])} ${f(p[1])}`;
  const Q = (c, p) => `Q${f(c[0])} ${f(c[1])} ${f(p[0])} ${f(p[1])}`, C = (a, b, p) => `C${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(p[0])} ${f(p[1])}`;
  const OL = "#241c1c", OW = 1.7, IW = 1.05;

  const SKINS = [["s1", "Light", "#f6d7c3"], ["s2", "Fair", "#f0c3a0"], ["s3", "Medium", "#d9a07a"], ["s4", "Tan", "#b97d55"], ["s5", "Brown", "#8c5a3c"], ["s6", "Deep", "#5e3d2a"]];
  const ZONES = [["auto", "From on/off"], ["home", "Home"], ["away", "Away"], ["work", "Work"], ["school", "School"], ["gym", "Gym"], ["drive", "Driving"]];
  const HEIGHTS = [["avg", "Average"], ["short", "Short"], ["tall", "Tall"]];
  const BUILDS = [["avg", "Average"], ["slim", "Slim"], ["sturdy", "Sturdy"], ["heavy", "Heavy"]];
  const VH = { short: .93, avg: 1, tall: 1.04 };
  const BU = {
    slim:   { S: 19.5, W: 13.5, Hp: 14.5, A: 4.4, Lg: 7, Nk: 3.8, fw: .94, bel: 0 },
    avg:    { S: 22, W: 15.5, Hp: 16.5, A: 5.1, Lg: 8, Nk: 4.4, fw: 1, bel: 0 },
    sturdy: { S: 25, W: 19, Hp: 19, A: 6.2, Lg: 9.4, Nk: 5.4, fw: 1.06, bel: .4 },
    heavy:  { S: 26, W: 23.5, Hp: 22.5, A: 6.9, Lg: 10.6, Nk: 5.9, fw: 1.13, bel: 1 },
  };
  
  const PRE = {
    man:      { hh: 36, B: 132, legR: .536, sw: 1,   g: "m", age: "adult" },
    woman:    { hh: 35, B: 128, legR: .545, sw: .92, g: "f", age: "adult" },
    oldman:   { hh: 36, B: 126, legR: .53,  sw: .98, g: "m", age: "old" },
    oldwoman: { hh: 35, B: 120, legR: .52,  sw: .9,  g: "f", age: "old" },
    teenboy:  { hh: 35, B: 120, legR: .535, sw: .86, g: "m", age: "teen" },
    teengirl: { hh: 34, B: 116, legR: .535, sw: .82, g: "f", age: "teen" },
    boy:      { hh: 34, B: 86,  legR: .47,  sw: .7,  g: "m", age: "kid" },
    girl:     { hh: 34, B: 84,  legR: .47,  sw: .68, g: "f", age: "kid" },
    toddler:  { hh: 33, B: 64,  legR: .4,   sw: .62, g: "n", age: "toddler" },
    baby:     { hh: 26, B: 40,  legR: .4,   sw: .5,  g: "n", age: "baby" },
  };
  const CLO = ["#3b3e46", "#2c3d5e", "#5a4636", "#6b6f78", "#2e4a3c", "#7a2e2e", "#c9c2b4", "#c65b7c", "#d39a2a"];
  const HAIRC = ["#6b4226", "#2a1a10", "#9a6430", "#d4ac5a", "#b8b6b0", "#141414", "#8a3a22"];
  const GRAYS = { "#b8b6b0": 1, "#eeece6": 1, "#c9ccd2": 1, "#8a8880": 1 };
  const first = (all, d) => { const i = Math.max(0, all.findIndex((a) => a[0] === d)); return [all[i]].concat(all.filter((_, k) => k !== i)); };

  function ctx(o, preKey, defs0) {
    const h = N(), opt = o.opt || {}, pr = PRE[preKey] || PRE.man, c = o.color || defs0.c, hc = o.color2 || defs0.h;
    const zone = opt.zone && opt.zone !== "auto" ? opt.zone : (o.on ? "home" : "away");
    const skin = (SKINS.find((s) => s[0] === opt.skin) || SKINS.find((s) => s[0] === defs0.skin) || SKINS[1])[2];
    const b0 = BU[opt.build] || BU.avg, sw = pr.sw, fem = pr.g === "f";
    const b = { S: b0.S * sw * (fem ? .9 : 1), W: b0.W * sw * (fem ? .86 : 1), Hp: b0.Hp * sw * (fem ? 1.08 : 1), A: b0.A * sw * (fem ? .88 : 1), Lg: b0.Lg * sw * (fem ? .96 : 1),
      Nk: b0.Nk * sw * (fem ? .84 : 1), fw: b0.fw, bel: b0.bel * (pr.age === "kid" || pr.age === "toddler" || pr.age === "baby" ? 0 : 1) };
    return { o, u: o.uid, on: !!o.on, zone, pr, preKey, fem, age: pr.age, hair: opt.hair || defs0.hair, outfit: opt.outfit || defs0.outfit, facial: fem || pr.age !== "adult" && pr.age !== "old" ? "none" : (opt.facial || "none"),
      glasses: opt.glasses || "none", mob: opt.mobility || "none", vh: VH[opt.height] || 1, b, skinKey: opt.skin,
      sk: { hl: h.shade(skin, .3), m: skin, d: h.mix(skin, "#a8574a", .32), k: h.shade(skin, -.35) },
      su: { hl: h.shade(c, .25), m: c, d: h.shade(c, -.32), k: h.shade(c, -.5) },
      hc, hp: { hl: h.shade(hc, .4), m: hc, d: h.shade(hc, -.35) },
      id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})` };
  }
  function defs(x) {
    const id = x.id;
    return `<defs>
${rg(id("warm"), [[0, "#ffe2a8", .95], [.5, "#ffc870", .45], [1, "#ffb050", 0]])}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .45]], .5, .45, .75)}
${rg(id("cs"), [[0, "#000", .45], [1, "#000", 0]])}
${lg(id("dn"), [[0, "#000", .45], [1, "#000", 0]], 0, 0, 0, 1)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath></defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;

  
  function backdrop(x, fy) {
    fy = fy || 176; const h = N();
    if (x.zone === "home") {
      return BGW(`${lg(x.id("wl"), [[0, "#a88c6c"], [1, "#d6bf9c"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.url("wl")}"/>
<rect x="58" y="26" width="84" height="${fy - 26}" fill="#f2e6cf"/><rect x="62" y="30" width="76" height="${fy - 30}" fill="#3a2a1c"/><ellipse class="${P}glow" cx="100" cy="${fy - 44}" rx="56" ry="84" fill="${x.url("warm")}"/>
<path d="M138 30L156 38V${fy + 4}L138 ${fy}Z" fill="#8a5a36"/><path d="M141 32L153 38V${fy}L141 ${fy - 2}Z" fill="#a06a40"/><circle cx="143" cy="${fy - 62}" r="1.6" fill="#d9b25a"/>
<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="#7a5a3c"/><path d="M8 ${fy + 6}H192M8 ${fy + 12}H192" stroke="#000" stroke-opacity=".18"/><ellipse cx="100" cy="${fy + 6}" rx="50" ry="8" fill="${x.url("warm")}" opacity=".7"/>`);
    }
    const tint = { away: ["#3a4458", "#58627a"], work: ["#4a5a66", "#6d7d88"], school: ["#4a5a4a", "#6d7d66"], gym: ["#4a4660", "#6a6680"], drive: ["#3e4a5a", "#60708a"] }[x.zone];
    return BGW(`${lg(x.id("wl"), [[0, tint[0]], [1, tint[1]]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.url("wl")}"/><rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="${h.shade(tint[0], -.25)}"/><rect x="8" y="${fy}" width="184" height="5" fill="${x.url("dn")}"/>`);
  }
  function badge(x) {
    const z = x.zone; if (z === "home") return "";
    const col = { away: "#8a94a8", work: "#5a7ab0", school: "#4f9a5a", gym: "#b05a8a", drive: "#4a8ac0" }[z];
    let ic = "";
    if (z === "away") ic = `<path d="M0 -7a5 5 0 0 1 5 5c0 4 -5 9 -5 9s-5 -5 -5 -9a5 5 0 0 1 5 -5z" fill="#fff"/><circle cx="0" cy="-2" r="1.8" fill="${col}"/><path d="M6 4h6M10 1.5l2.5 2.5l-2.5 2.5" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    else if (z === "work") ic = `<path d="${rr(-8, -4, 16, 11, 2)}" fill="#fff"/><path d="M-3 -4v-2.5h6v2.5" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M-8 1h16" stroke="${col}" stroke-width="1.2"/>`;
    else if (z === "school") ic = `<path d="${rr(-6, -6, 12, 14, 3)}" fill="#fff"/><path d="M-3 -6a3 3 0 0 1 6 0" fill="none" stroke="#fff" stroke-width="1.6"/><rect x="-4" y="1" width="8" height="4" rx="1" fill="${col}"/>`;
    else if (z === "gym") ic = `<rect x="-9" y="-4" width="3" height="8" rx="1" fill="#fff"/><rect x="6" y="-4" width="3" height="8" rx="1" fill="#fff"/><rect x="-6" y="-2.6" width="2" height="5.2" fill="#fff"/><rect x="4" y="-2.6" width="2" height="5.2" fill="#fff"/><rect x="-4" y="-1" width="8" height="2" fill="#fff"/>`;
    else ic = `<path d="M-9 3v-3l2.5 -5h13l2.5 5v3Z" fill="#fff"/><circle cx="-5" cy="4" r="2" fill="#fff" stroke="${col}"/><circle cx="5" cy="4" r="2" fill="#fff" stroke="${col}"/><path d="M-5.5 -1l1.5 -3h8l1.5 3Z" fill="${col}"/>`;
    return `<g transform="translate(168 32)"><circle r="14" fill="#000" opacity=".25" transform="translate(1 2)"/><circle r="14" fill="${col}"/><circle r="14" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"/>${ic}</g>`;
  }


  function tube(pts) {
    const n = pts.length, A = [], B2 = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], c = pts[Math.min(n - 1, i + 1)], dx = c[0] - a[0], dy = c[1] - a[1], ln = Math.hypot(dx, dy) || 1, w = pts[i][2];
      A.push([pts[i][0] - dy / ln * w, pts[i][1] + dx / ln * w]); B2.push([pts[i][0] + dy / ln * w, pts[i][1] - dx / ln * w]);
    }
    const sm = (Pp) => { let d = ""; for (let i = 1; i < Pp.length - 1; i++) d += Q(Pp[i], i === Pp.length - 2 ? Pp[i + 1] : [(Pp[i][0] + Pp[i + 1][0]) / 2, (Pp[i][1] + Pp[i + 1][1]) / 2]); return d; };
    const R = B2.slice().reverse();
    return M(A[0]) + sm(A) + L(R[0]) + sm(R) + "Z";
  }
  let CL = 0;
  function part(x, d, fill, shade, shadeFill, wd) {
    const k = x.id("cp" + (CL++));
    return `<clipPath id="${k}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/>` + (shade ? `<g clip-path="url(#${k})"><path d="${shade}" fill="${shadeFill}"/></g>` : "") +
      `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${wd || OW}" stroke-linejoin="round"/>`;
  }
  const line = (d, wd, col, op) => `<path d="${d}" fill="none" stroke="${col || OL}" stroke-width="${wd || IW}" stroke-linecap="round" stroke-linejoin="round"${op ? ` stroke-opacity="${op}"` : ""}/>`;
  const q2 = (dx, dy) => `q${f(dx)} ${f(dy)} ${f(dx * 2)} 0`;

  
  const OF = {
    business: { top: "suit", bot: "trousers", shoe: "oxford", sleeve: "long", pose: "pockets" },
    casual:   { top: "tee", bot: "jeans", shoe: "sneaker", sleeve: "short", pose: "pockets" },
    bizcas:   { top: "shirt", bot: "chinos", shoe: "loafer", sleeve: "rolled", pose: "pockets" },
    formal:   { top: "tux", bot: "tuxpants", shoe: "patent", sleeve: "long", pose: "sides" },
    workout:  { top: "tank", bot: "shorts", shoe: "runner", sleeve: "none", pose: "hip" },
    night:    { top: "pj", bot: "pjpants", shoe: "slipper", sleeve: "long", pose: "sides" },
    outdoor:  { top: "parka", bot: "cargo", shoe: "boot", sleeve: "long", pose: "sides" },
    hoodie:   { top: "hoodie", bot: "joggers", shoe: "sneaker", sleeve: "long", pose: "kanga" },
    uniform:  { top: "coverall", bot: "coverall", shoe: "boot", sleeve: "long", pose: "hip" },
    f_casual:   { top: "tee", bot: "jeans", shoe: "sneaker", sleeve: "short", pose: "pockets" },
    f_business: { top: "blazer", bot: "pencil", shoe: "pump", sleeve: "long", pose: "sides" },
    f_bizcas:   { top: "blouse", bot: "slacks", shoe: "flat", sleeve: "rolled", pose: "pockets" },
    f_formal:   { top: "gowntop", bot: "gown", shoe: "pump", sleeve: "none", pose: "sides" },
    f_workout:  { top: "tank", bot: "leggings", shoe: "runner", sleeve: "none", pose: "hip" },
    f_night:    { top: "pj", bot: "pjpants", shoe: "slipper", sleeve: "long", pose: "sides" },
    f_outdoor:  { top: "parka", bot: "jeans", shoe: "boot", sleeve: "long", pose: "sides" },
    f_hoodie:   { top: "hoodie", bot: "joggers", shoe: "sneaker", sleeve: "long", pose: "kanga" },
    f_uniform:  { top: "polo", bot: "slacks", shoe: "sneaker", sleeve: "short", pose: "hip", lanyard: true },
    k_school:   { top: "polo", bot: "kidpants", shoe: "oxford", sleeve: "short", pose: "sides", pack: true },
    k_schoolg:  { top: "polo", bot: "pleated", shoe: "maryjane", sleeve: "short", pose: "sides", pack: true, socks: true },
    k_play:     { top: "tee", bot: "shorts", shoe: "sneaker", sleeve: "short", pose: "sides" },
    k_playg:    { top: "tee", bot: "denimskirt", shoe: "sneaker", sleeve: "short", pose: "sides" },
    k_pj:       { top: "pj", bot: "pjpants", shoe: "slipper", sleeve: "long", pose: "sides" },
    k_sports:   { top: "jersey", bot: "shorts", shoe: "runner", sleeve: "short", pose: "sides", socks: true },
    k_winter:   { top: "puffer", bot: "jeans", shoe: "boot", sleeve: "long", pose: "sides", hat: true },
    t_romper:   { top: "romper", bot: "romper", shoe: "kidshoe", sleeve: "short", pose: "sides" },
    t_overalls: { top: "overalls", bot: "overalls", shoe: "kidshoe", sleeve: "short", pose: "sides" },
    t_tee:      { top: "tee", bot: "shorts", shoe: "kidshoe", sleeve: "short", pose: "sides" },
    t_pj:       { top: "pj", bot: "pjpants", shoe: "slipper", sleeve: "long", pose: "sides", dino: true },
    t_hoodie:   { top: "hoodie", bot: "joggers", shoe: "kidshoe", sleeve: "long", pose: "sides" },
  };
  const OUT_M = [["business", "Business suit"], ["casual", "Casual"], ["bizcas", "Business casual"], ["formal", "Formal (tuxedo)"], ["workout", "Workout"], ["night", "Nightwear"], ["outdoor", "Outdoor jacket"], ["hoodie", "Hoodie & joggers"], ["uniform", "Work uniform"]];
  const OUT_F = [["f_casual", "Casual"], ["f_business", "Business (blazer and skirt)"], ["f_bizcas", "Business casual"], ["f_formal", "Formal gown"], ["f_workout", "Workout"], ["f_night", "Nightwear"], ["f_outdoor", "Outdoor jacket"], ["f_hoodie", "Hoodie & joggers"], ["f_uniform", "Work uniform (polo)"]];
  const OUT_KB = [["k_school", "School clothes"], ["k_play", "Play clothes"], ["k_pj", "Pajamas"], ["k_sports", "Sports"], ["k_winter", "Winter"]];
  const OUT_KG = [["k_schoolg", "School clothes"], ["k_playg", "Play clothes"], ["k_pj", "Pajamas"], ["k_sports", "Sports"], ["k_winter", "Winter"]];
  const OUT_T = [["t_romper", "Romper"], ["t_overalls", "Overalls"], ["t_tee", "T-shirt and shorts"], ["t_pj", "Dinosaur pajamas"], ["t_hoodie", "Little hoodie"]];
  const PANTS = { trousers: 1, jeans: 1, chinos: 1, tuxpants: 1, pjpants: 1, cargo: 1, joggers: 1, leggings: 1, slacks: 1, kidpants: 1, coverall: 1, overalls: 1 };
  const SKIRTS = { pencil: 1, pleated: 1, denimskirt: 1 };

  
  function figure(x) {
    CL = 0;
    const b = x.b, pr = x.pr, cx = 100, su = x.su, sk = x.sk, h = N(), of = OF[x.outfit] || OF.business;
    const SHIRT = "#f4f3ef", SHIRTD = "#c9cdd6", TIE = "#8e2f2a", TIED = "#5e1d1a";
    const hh = pr.hh, seated = x.mob === "wheel", foot = 186, Bl = pr.B * x.vh, tf = Bl * (1 - pr.legR) / 65, lf = Bl * pr.legR / 75;
    let chin, kneeS = 0;
    if (seated) { kneeS = foot - 38 * lf; chin = kneeS - 13 * lf - 50 * tf; } else chin = foot - Bl;
    const top = chin - hh;
    const Yb = (t) => chin + (t <= 65 ? t * tf : 65 * tf + (t - 65) * lf);
    const sh = Yb(9), ap = Yb(22), bt = Yb(47), belt = Yb(50), hem = Yb(67), cr = Yb(65), kn = seated ? kneeS : Yb(101), an = seated ? foot - 7 * lf : Yb(133), so = foot;
    const S = b.S, W = b.W + b.bel * 1.5, Hj = b.Hp + 1.5 + b.bel, cc = cx + 2.2;
    const pal = (c) => ({ hl: h.shade(c, .25), m: c, d: h.shade(c, -.3), k: h.shade(c, -.5) });
    const BOT = { trousers: su, tuxpants: su, pjpants: su, coverall: su, overalls: su, romper: su, pencil: su, gown: su, jeans: pal("#3f6290"), chinos: pal("#c4a77a"), shorts: pal("#2f333b"),
      cargo: pal("#4a4f42"), joggers: pal("#6f747d"), leggings: pal("#26272c"), slacks: pal("#3a3d44"), kidpants: pal("#2c3d5e"), pleated: pal("#2c3d5e"), denimskirt: pal("#4f74a8") }[of.bot] || su;
    const G = { cx, cc, S, W, Hj, sh, ap, bt, belt, hem, cr, kn, an, so, b, su, sk, SHIRT, SHIRTD, TIE, TIED, BOT, pal, x, lf, tf, seated, top, chin };
    let legs = "", upper = "", head = "", back = "";
    x._sh = sh; x._of = of;
    const lw = b.Lg, lx0 = cx - b.Hp * .5, rx0 = cx + b.Hp * .5;

    
    if (seated) back += wheelchairBack(x, G);
    legs += `<ellipse cx="${cx + 2}" cy="${so + 1}" rx="${f(b.Hp + 15 + (seated ? 14 : 0))}" ry="3.2" fill="${x.url("cs")}"/>`;

    if (seated) {
      
      const longCover = PANTS[of.bot] || of.bot === "gown";
      const thigh = (x0, sd) => tube([[x0, belt + 1, lw * 1.45], [x0 + sd * .6, (belt + kn) / 2, lw * 1.38], [x0 + sd * .8, kn, lw * 1.22]]);
      const shin = (x0, sd) => tube([[x0 + sd * .8, kn, lw * .86], [x0 + sd * 1.2, (kn + an) / 2, lw * .74], [x0 + sd * 1.4, an, lw * .62]]);
      legs += wheelchairFoot(x, G, lx0 + .6, rx0 + 1.4);
      [[lx0, -1], [rx0, 1]].forEach(([x0, sd]) => {
        legs += part(x, shin(x0, sd), longCover ? BOT.m : sk.m, M([x0 + lw * .2, kn]) + L([x0 + 30, kn]) + L([x0 + 30, so]) + L([x0 + lw * .2, so]) + "Z", longCover ? BOT.d : sk.d);
        if (of.socks || of.shoe === "runner") legs += part(x, rr(x0 + sd * 1.4 - lw * .6, an - 4, lw * 1.2, 5, 1.5), "#f4f4f2", null, null, IW);
      });
      legs += shoe(x, lx0 + .6, -1, so, of.shoe, su) + shoe(x, rx0 + 1.4, 1, so, of.shoe, su);
      if (of.bot === "gown") legs += part(x, M([cx - W - 4, belt]) + L([cx + W + 4, belt]) + Q([cx + W + 12, kn + 10], [cx + W + 13, so - 2]) + Q([cx, so + 1.5], [cx - W - 13, so - 2]) + Q([cx - W - 12, kn + 10], [cx - W - 4, belt]) + "Z", BOT.m, M([cx + 2, belt]) + L([cx + 40, belt]) + L([cx + 40, so]) + L([cx + 2, so]) + "Z", BOT.d);
      [[lx0, -1], [rx0, 1]].forEach(([x0, sd]) => { legs += part(x, thigh(x0, sd), SKIRTS[of.bot] || of.bot === "shorts" || of.bot === "romper" || longCover ? BOT.m : sk.m, sd > 0 ? M([x0, belt]) + L([x0 + 30, belt]) + L([x0 + 30, kn + 4]) + L([x0, kn + 4]) + "Z" : null, BOT.d); });
      if (SKIRTS[of.bot]) legs += part(x, M([cx - b.Hp - 2, belt]) + L([cx + b.Hp + 2, belt]) + L([cx + b.Hp + 4, kn + 2]) + Q([cx, kn + 4], [cx - b.Hp - 4, kn + 2]) + "Z", BOT.m, M([cx + 3, belt]) + L([cx + 30, belt]) + L([cx + 30, kn + 6]) + L([cx + 3, kn + 6]) + "Z", BOT.d);
      legs += line(M([cx, belt + 3]) + L([cx, kn - 2]), .8, OL, .7);
      
      [[lx0, -1], [rx0, 1]].forEach(([x0, sd]) => { const kx = x0 + sd * .8, r = lw * 1.18, ry = 3.4 * lf + 1, bare = !longCover;
        legs += part(x, `M${f(kx - r)} ${f(kn)}a${f(r)} ${f(ry)} 0 1 1 ${f(2 * r)} 0a${f(r)} ${f(ry)} 0 1 1 ${f(-2 * r)} 0Z`, bare ? sk.m : BOT.m, `M${f(kx - r - 1)} ${f(kn + ry * .2)}h${f(2 * r + 2)}v${f(ry * 2)}h${f(-2 * r - 2)}Z`, bare ? sk.d : BOT.d, IW) +
          line(M([kx - r * .5, kn - ry * .45]) + Q([kx, kn - ry * .8], [kx + r * .4, kn - ry * .5]), .9, bare ? sk.hl : BOT.hl, .8); });
      if (of.bot === "gown") legs += part(x, M([cx - W - 3, kn - 2]) + L([cx + W + 3, kn - 2]) + Q([cx + W + 11, kn + 10], [cx + W + 12, so - 2]) + Q([cx, so + 1.5], [cx - W - 12, so - 2]) + Q([cx - W - 11, kn + 10], [cx - W - 3, kn - 2]) + "Z", BOT.m, M([cx + 2, kn - 4]) + L([cx + 40, kn - 4]) + L([cx + 40, so]) + L([cx + 2, so]) + "Z", BOT.d);
    } else {
      legs += standingLegs(x, G, of, lx0, rx0, lw, BOT);
    }
    if (x.mob === "walker" && !seated) legs += walker(x, G);

    
    upper += topGarment(x, of, G);
    if (x.fem && x.age !== "kid" && { tee: 1, tank: 1, pj: 1, hoodie: 1 }[of.top]) upper += line(M([cx - S * .55, ap + 4]) + Q([cx - S * .3, ap + 8], [cx - S * .05, ap + 5]) + M([cc + S * .05, ap + 5]) + Q([cc + S * .32, ap + 8], [cc + S * .55, ap + 4]), .7, su.k, .55);
    if (of.dino) {
      
      const dc = h.shade(su.m, .45), dino = (px, py, s, fl) => `<path transform="translate(${f(px)} ${f(py)}) scale(${f(s * fl)} ${f(s)})" d="M-3 0Q-3 -2.2 0 -2.2Q2 -2.2 2.6 -1Q3.4 -3.6 3.6 -5Q4.4 -5.8 5 -5Q4.8 -4.4 4.2 -4.2Q4 -1.6 3.4 .2L3.4 1.6H2.4V.6H-1.4V1.6H-2.4V.6Q-4 .6 -5.6 -.2Q-4.2 -.2 -3 0Z" fill="${dc}" stroke="${su.k}" stroke-width=".25"/>`;
      upper += dino(cx - W * .45, ap + 3, .9, 1) + dino(cx + W * .4, belt - 3, .9, -1) + dino(cx - W * .2, belt + 5, .8, 1);
      legs += dino(lx0 - .5, kn - 3, .8, 1) + dino(rx0 + 3, kn + 6, .8, -1) + dino(lx0, an - 6, .7, -1);
    }
    if (of.pack) upper += line(M([cx - S + 4, sh + 1]) + Q([cx - S + 2, ap], [cx - S + 4.5, belt - 4]), 2.4, "#2a3a5a") + line(M([cx + S - 4, sh + 1]) + Q([cx + S - 2, ap], [cx + S - 4.5, belt - 4]), 2.4, "#2a3a5a") +
      line(M([cx - S + 4, sh + 1]) + Q([cx - S + 2, ap], [cx - S + 4.5, belt - 4]), .5, OL, .8) + line(M([cx + S - 4, sh + 1]) + Q([cx + S - 2, ap], [cx + S - 4.5, belt - 4]), .5, OL, .8);
    if (of.lanyard) upper += line(M([cx - x.b.Nk - 1, sh - 2]) + L([cc - 1, sh + 14]) + M([cx + x.b.Nk + 1, sh - 2]) + L([cc + 1, sh + 14]), .9, "#2f5fb3") + part(x, rr(cc - 3, sh + 14, 6, 8, 1), "#f4f4f2", rr(cc - 3, sh + 14, 6, 2.6, 1), "#2f5fb3", .7);

    
    const poseFor = (sd) => {
      if (seated) return "rest";
      if (x.mob === "walker") return "walker";
      if (x.mob === "cane" && sd < 0) return "cane";
      if (of.pose === "pockets") return x.mob === "cane" ? "side" : "pocket";
      if (of.pose === "kanga") return x.mob === "cane" ? "side" : "kanga";
      if (of.pose === "hip" && sd < 0) return "hip";
      return "side";
    };
    let arms = "";
    arms += arm(x, -1, poseFor(-1), of, G) + arm(x, 1, poseFor(1), of, G);
    if (of.pose === "kanga" && poseFor(-1) === "kanga") arms += kangaPocket(x, G);
    if (seated) arms += wheelchairFront(x, G);

    
    const neck = M([cx - b.Nk, chin - 4]) + L([cx - b.Nk - .4, sh - 2]) + L([cx + b.Nk + .4, sh - 2]) + L([cx + b.Nk, chin - 4]) + "Z";
    head += part(x, neck, sk.m, M([cx - b.Nk - 2, chin - 6]) + Q([cx, chin + 3], [cx + b.Nk + 2, chin - 6]) + L([cx + b.Nk + 2, sh]) + L([cx - b.Nk - 2, sh]) + "Z", sk.d);
    if (of.top === "hoodie") head += hoodCollar(x, cx, sh, b, su);
    if (of.top === "parka" || of.top === "puffer") head += part(x, M([cx - b.Nk - 4, sh - 6]) + Q([cx, sh - 3], [cx + b.Nk + 4, sh - 6]) + L([cx + b.Nk + 6, sh + 2]) + Q([cx, sh + 5], [cx - b.Nk - 6, sh + 2]) + "Z", su.m, M([cx + 1, sh - 8]) + L([cx + 20, sh - 8]) + L([cx + 20, sh + 6]) + L([cx + 1, sh + 6]) + "Z", su.d) + line(M([cc, sh - 3.6]) + L([cc, sh + 4]), 1);
    head += headDraw(x, cx, top, hh, of);
    return { belt, sh, chin, top, back, legs, upper, arms, head, hairBehind: hairBack(x, cx, top, hh, headW(x)) };
  }
  const headW = (x) => 14 * x.b.fw * (x.pr.hh / 36) * (x.age === "kid" ? 1.04 : x.age === "toddler" ? 1.08 : x.age === "baby" ? 1.12 : 1) * (x.fem ? .97 : 1);

  
  function standingLegs(x, G, of, lx0, rx0, lw, BOT) {
    const { cx, cc, belt, cr, kn, an, so, b, su, sk, W } = G;
    let s = "";
    const ankL = [lx0 - .5, an], ankR = [rx0 + 5, an];
    const legPts = (x0, out) => [[x0 + (out ? .5 : -.5), belt + 4, lw + 1], [x0 + (out ? 1.5 : -.5), cr + 8, lw], [x0 + (out ? 3 : 0), kn, lw * .8], [x0 + (out ? 5 : -.5), an, lw * .64]];
    const bareShins = !PANTS[of.bot] && of.bot !== "gown";
    if (bareShins) {
      const fromY = SKIRTS[of.bot] ? (of.bot === "pencil" ? kn - 2 : kn - 8) : kn - 6;
      s += part(x, tube([[lx0 - .5, fromY - 4, lw * .8], [lx0, kn, lw * .74], [lx0 - .5, an, lw * .56]]), sk.m, M([lx0 + 1, fromY - 6]) + L([lx0 + 12, fromY - 6]) + L([lx0 + 12, an + 2]) + L([lx0 + 1, an + 2]) + "Z", sk.d);
      s += part(x, tube([[rx0 + 2.4, fromY - 4, lw * .8], [rx0 + 3, kn, lw * .74], [rx0 + 5, an, lw * .56]]), sk.m, M([rx0 + 4, fromY - 6]) + L([rx0 + 14, fromY - 6]) + L([rx0 + 14, an + 2]) + L([rx0 + 4, an + 2]) + "Z", sk.d);
      if (of.shoe === "runner" || of.socks) [ankL, ankR].forEach((a) => { s += part(x, rr(a[0] - lw * .6, a[1] - (of.socks ? 11 : 4), lw * 1.2, of.socks ? 12 : 5, 1.5), "#f4f4f2", null, null, IW); });
    }
    if (of.bot !== "gown") s += shoe(x, ankL[0], -1, so, of.shoe, su) + shoe(x, ankR[0], 1, so, of.shoe, su);
    if (of.bot === "shorts" || of.bot === "romper") {
      const sL = tube([[lx0 - .5, belt + 4, lw + 1.2], [lx0 - .5, cr + 6, lw + .6], [lx0 - .2, kn - 6, lw + .4]]), sR = tube([[rx0 + .5, belt + 4, lw + 1.2], [rx0 + 1.5, cr + 6, lw + .6], [rx0 + 2.4, kn - 6, lw + .4]]);
      s += part(x, sL, BOT.m, null, null) + part(x, sR, BOT.m, M([rx0, belt]) + L([rx0 + 20, belt]) + L([rx0 + 20, kn]) + L([rx0, kn]) + "Z", BOT.d);
      if (of.bot === "shorts") s += line(M([lx0 - lw - 1.2, kn - 12]) + L([lx0 - lw - .4, kn - 6]), 1.4, "#e8e8e6") + line(M([rx0 + lw + 3.2, kn - 12]) + L([rx0 + lw + 2.6, kn - 6]), 1.4, "#e8e8e6");
    } else if (SKIRTS[of.bot]) {
      const hemY = of.bot === "pencil" ? kn : kn - 6, fl = of.bot === "pencil" ? -1 : of.bot === "pleated" ? 6 : 3;
      const sk2 = M([cx - b.Hp - 1, belt]) + L([cx + b.Hp + 1, belt]) + Q([cx + b.Hp + 2 + fl * .5, (belt + hemY) / 2], [cx + b.Hp + 1 + fl, hemY]) + Q([cx, hemY + 2], [cx - b.Hp - 1 - fl, hemY]) + Q([cx - b.Hp - 2 - fl * .5, (belt + hemY) / 2], [cx - b.Hp - 1, belt]) + "Z";
      s += part(x, sk2, BOT.m, M([cc + 2, belt]) + L([cx + 40, belt]) + L([cx + 40, hemY + 4]) + L([cc + 2, hemY + 4]) + "Z", BOT.d);
      if (of.bot === "pleated") for (let i = -3; i <= 3; i++) s += line(M([cx + i * b.Hp * .3, belt + 3]) + L([cx + i * (b.Hp + 6) * .3, hemY]), .7, BOT.k, .8);
      if (of.bot === "pencil") s += line(M([cc + b.Hp * .4, hemY - 6]) + L([cc + b.Hp * .42, hemY]), .8);
      if (of.bot === "denimskirt") s += line(M([cc, belt + 2]) + L([cc, hemY]), .7, "#d9b26a") + line(M([cx - b.Hp + 1, hemY - 2]) + Q([cx, hemY], [cx + b.Hp - 1, hemY - 2]), .6, "#d9b26a");
    } else if (of.bot === "gown") {
      s += shoe(x, ankL[0] - 1, -1, so, "pump", su) + shoe(x, ankR[0] - 1, 1, so, "pump", su);
      const d = M([cx - W - .5, belt - 1]) + L([cx + W + .5, belt - 1]) + Q([cx + W + 8, cr + 20], [cx + W + 15, so - 2.6]) + Q([cx + 4, so - .6], [cx - W - 15, so - 2.6]) + Q([cx - W - 8, cr + 20], [cx - W - .5, belt - 1]) + "Z";
      s += part(x, d, BOT.m, M([cc + 3, belt]) + L([cx + 60, belt]) + L([cx + 60, so + 4]) + L([cc + 3, so + 4]) + "Z", BOT.d);
      s += line(M([cx - W * .3, belt + 8]) + Q([cx - W * .5, cr + 30], [cx - W - 4, so - 2]), .8, BOT.k, .8) + line(M([cc + W * .2, belt + 10]) + Q([cc + W * .5, cr + 30], [cc + W + 6, so - 2]), .8, BOT.k, .8);
      s += line(M([cx - W * .7, belt + 14]) + Q([cx - W * .8, cr + 26], [cx - W - 9, so - 6]), 1, BOT.hl, .6);
    } else {
      const tight = of.bot === "joggers" || of.bot === "pjpants" || of.bot === "leggings";
      const LL = legPts(lx0, false), RR = legPts(rx0, true);
      if (of.bot === "joggers" || of.bot === "leggings") { LL[3][2] = lw * .55; RR[3][2] = lw * .55; LL[2][2] = lw * .74; RR[2][2] = lw * .74; }
      if (of.bot === "cargo" || of.shoe === "boot") { LL[3][1] = an - 3; RR[3][1] = an - 3; }
      s += part(x, tube(LL), BOT.m, M([lx0 + lw * .25, belt]) + L([lx0 + 40, belt]) + L([lx0 + 40, so]) + L([lx0 + lw * .25, so]) + "Z", BOT.d) +
        part(x, tube(RR), BOT.m, M([rx0 + lw * .35, belt]) + L([rx0 + 40, belt]) + L([rx0 + 40, so]) + L([rx0 + lw * .35, so]) + "Z", BOT.d);
      if (of.bot === "trousers" || of.bot === "tuxpants" || of.bot === "chinos" || of.bot === "slacks" || of.bot === "kidpants") s += line(M([lx0 - .5, cr + 4]) + L([lx0, an - 2]), .8, BOT.k, .7) + line(M([rx0 + 1.5, cr + 4]) + Q([rx0 + 3, kn], [rx0 + 5, an - 2]), .8, BOT.k, .7);
      if (of.bot === "tuxpants") s += line(M([lx0 - lw - .6, cr]) + L([lx0 - lw * .64 - .6, an - 1]), 1.4, "#0c0c0e") + line(M([rx0 + lw + 1.6, cr]) + L([rx0 + 5 + lw * .64, an - 1]), 1.4, "#0c0c0e");
      if (of.bot === "jeans") s += line(M([lx0 - lw * .6, cr]) + q2(2.4, 1.2) + M([rx0 + lw * .5, cr + 1]) + q2(2.4, 1.2), .7, "#a9c3e4", .8) + line(M([lx0 - lw - .5, cr]) + L([lx0 - lw * .64 - .5, an - 1]), .6, "#d9b26a", .8);
      if (of.bot === "cargo") [lx0 - .5, rx0 + 3].forEach((px, i) => { s += part(x, rr(px - lw * .9 + (i ? 1 : 0), kn - 18, lw * 1.1, 9, 1.2), BOT.m, null, null, IW) + line(M([px - lw * .9 + (i ? 1 : 0), kn - 15]) + L([px + lw * .2 + (i ? 1 : 0), kn - 15]), .8); });
      if (of.bot === "joggers") [ankL, ankR].forEach((a) => { s += part(x, rr(a[0] - lw * .6, a[1] - 5, lw * 1.2, 4.6, 1.4), BOT.d, null, null, IW); });
      if (of.bot === "pjpants") s += line(M([lx0 - lw * .2, cr + 8]) + L([lx0, an - 4]), 1.2, BOT.hl, .5) + line(M([rx0 + lw * .3, cr + 8]) + L([rx0 + 4, an - 4]), 1.2, BOT.hl, .5);
      if (of.bot === "overalls") [lx0 - .5, rx0 + 4].forEach((px) => { s += part(x, rr(px - lw * .62, an - 5, lw * 1.24, 4, 1), BOT.d, null, null, IW); });
      if (!tight) s += line(M([lx0 - lw * .6, an - 4]) + Q([lx0, an - 2], [lx0 + lw * .6, an - 4]), .8) + line(M([rx0 + 5 - lw * .6, an - 4]) + Q([rx0 + 5, an - 2], [rx0 + 5 + lw * .6, an - 4]), .8);
      s += line(M([rx0 + lw * .2, kn - 3]) + q2(3, 2) + M([rx0 + lw * .1, kn + 2]) + q2(4, 1.4), .8);
    }
    if (!SKIRTS[of.bot] && of.bot !== "gown") {
      const seat = M([cx - b.Hp - .5, belt + 1]) + L([cx + b.Hp + .5, belt + 1]) + Q([cx + b.Hp + 1.5, cr - 4], [cx + b.Hp * .2, cr + 2]) + L([cx, cr + 4]) + L([cx - b.Hp * .2, cr + 2]) + Q([cx - b.Hp - 1.5, cr - 4], [cx - b.Hp - .5, belt + 1]) + "Z";
      s += part(x, seat, BOT.m, M([cx + b.Hp * .25, belt]) + L([cx + 40, belt]) + L([cx + 40, cr + 6]) + L([cx + b.Hp * .25, cr + 6]) + "Z", BOT.d);
      const elastic = { pjpants: 1, joggers: 1, shorts: 1, leggings: 1, romper: 1, overalls: 1 }[of.bot];
      if (!elastic) s += line(M([cc, belt + 3]) + Q([cc + .5, cr - 6], [cc - .5, cr + 2]), IW);
      else if (of.bot !== "romper" && of.bot !== "overalls") s += line(M([cc - 1.2, belt + 2]) + q2(1.2, 3) + M([cc + .4, belt + 2]) + q2(1.2, 3.4), .7);
    }
    return s;
  }

  
  
  function shoe(x, ax, sd, so, kind, su) {
    const ks = Math.min(1, .5 + .55 * x.pr.sw), s = shoe0(x, ax, sd, so, kind, su);
    return ks < .995 ? `<g transform="translate(${f(ax)} ${f(so)}) scale(${ks.toFixed(3)}) translate(${f(-ax)} ${f(-so)})">${s}</g>` : s;
  }
  function shoe0(x, ax, sd, so, kind, su) {
    const t = ax + sd * 5.5, h0 = ax - sd * 5;
    const base = (hgt, toe) => M([h0, so - 1]) + Q([h0 - sd * .5, so - hgt], [ax - sd * 1.5, so - hgt - .5]) + Q([t + sd * 1, so - hgt], [t + sd * toe, so - 2.5]) + Q([t + sd * (toe + 1), so], [t + sd * (toe - 1.5), so]) + L([h0, so]) + "Z";
    const sole = (c, th) => M([h0 - sd * .4, so - th]) + L([t + sd * 6.5, so - th]) + L([t + sd * 6.5, so + 1]) + L([h0 - sd * .4, so + 1]) + "Z";
    if (kind === "sneaker" || kind === "runner") {
      const body = kind === "runner" ? su.m : "#f2f2ee";
      return part(x, base(7, 5), body, sole("#ddd", 2.4), kind === "runner" ? "#f2f2ee" : "#cfd2d6") + line(M([ax - sd * 1.5, so - 6.6]) + L([ax + sd * 1.5, so - 4.4]) + M([ax - sd * .2, so - 6.8]) + L([ax + sd * 2.6, so - 5]), .7) +
        line(M([h0 + sd * 1.5, so - 3.6]) + Q([ax + sd * 2, so - 2.6], [t + sd * 3, so - 4.5]), .9, kind === "runner" ? "#f2f2ee" : su.m);
    }
    if (kind === "boot") {
      const d = M([h0, so - 1]) + L([h0 - sd * .2, so - 9]) + L([ax + sd * 2.6, so - 9]) + Q([t + sd * 1, so - 6], [t + sd * 4.5, so - 3]) + Q([t + sd * 5.5, so], [t + sd * 3, so]) + L([h0, so]) + "Z";
      return part(x, d, "#6b4a2e", sole("#2a1e14", 2.2), "#2a1e14") + line(M([h0 - sd * .2, so - 7.5]) + L([ax + sd * 2.4, so - 7.5]), .7, "#3a281a") + line(M([ax - sd * .5, so - 8]) + L([ax + sd * 1.8, so - 6]), .6, "#e8d9b0");
    }
    if (kind === "slipper") return part(x, base(5, 5.5), "#8d7f72", sole("#5a4e44", 1.8), "#5a4e44") + line(M([ax - sd * 2, so - 4.6]) + Q([ax + sd * 2, so - 6], [t + sd * 2, so - 3.4]), .8, "#b8ab9c");
    if (kind === "pump") {
      
      const d = M([h0, so - 4.6]) + Q([ax, so - 3.8], [t + sd * 1, so - 3.3]) + Q([t + sd * 5, so - 2.6], [t + sd * 6, so - .5]) + L([ax, so]) + L([h0 + sd * 1.8, so - .2]) + L([h0 + sd * .4, so - 1.4]) + "Z";
      return part(x, rr(h0 - (sd > 0 ? .2 : 1.6), so - 3.4, 1.8, 3.6, .5), "#1c1c20", null, null, .7) + part(x, d, su.d, null, null, IW) + line(M([ax - sd * 1, so - 3.6]) + Q([ax + sd * 2, so - 3.4], [t + sd * 3, so - 2.6]), .7, "#fff", .4);
    }
    if (kind === "flat" || kind === "maryjane") {
      const mj = kind === "maryjane", c2 = mj ? "#141416" : "#2a2a30";
      let s = part(x, base(mj ? 5.4 : 4.6, 4.5), c2, sole("#1e1612", 1.8), "#1e1612") + line(M([ax - sd * .5, so - (mj ? 4.8 : 4)]) + Q([ax + sd * 2, so - 4.4], [t + sd * 2.6, so - 3]), mj ? 1 : .7, "#fff", mj ? .55 : .35);
      if (mj) s += line(M([ax - sd * 2.2, so - 5]) + L([ax + sd * 2.4, so - 4.6]), 1.1, "#141416") + `<circle cx="${f(ax + sd * 2.2)}" cy="${f(so - 4.7)}" r=".7" fill="#c9a24a"/>`;
      else s += line(M([t + sd * .4, so - 3.6]) + q2(sd * .8, -.6), .7, "#c9a24a");
      return s;
    }
    if (kind === "kidshoe") {
      
      return part(x, base(7.4, 5.4), su.m, sole("#f2f2ee", 2.6), "#f2f2ee") + line(M([t - sd * 1, so - 2.6]) + Q([t + sd * 2.6, so - 5.6], [t + sd * 5.2, so - 2.6]), .8) +
        part(x, rr(ax - (sd > 0 ? 2.6 : 3.6), so - 6.6, 6.2, 2.2, 1), "#f2f2ee", null, null, .7);
    }
    const col = kind === "loafer" ? "#7a4a2a" : kind === "patent" ? "#141416" : "#3a2a22";
    return part(x, base(kind === "loafer" ? 5.6 : 6.4, 4.5), col, sole("#1e1612", 2.2), "#1e1612") + line(M([ax - sd * .5, so - 5.8]) + Q([ax + sd * 2, so - 5.2], [t + sd * 2.6, so - 3.4]), kind === "patent" ? 1 : .7, "#fff", kind === "patent" ? .6 : .35) +
      (kind === "loafer" ? line(M([ax - sd * 1, so - 5]) + L([ax + sd * 3, so - 5]), .8, "#3a2416") : "");
  }

  
  function torsoPath(g, hemY, flare, open) {
    const { cx, S, W, ap, belt, sh, b } = g, sd = 1;
    void sd; void open;
    return M([cx - b.Nk - .4, sh - 3.6]) + Q([cx - S * .6, sh - 3.2], [cx - S, sh + .8]) + Q([cx - S - 2.2, sh + 3], [cx - S - 1.4, sh + 9]) + L([cx - S + 1.2, ap]) + Q([cx - W - .5 - b.bel * 2, belt - 8], [cx - W - .5, belt]) +
      Q([cx - W - 1 - flare, hemY - 4], [cx - W - .5 - flare, hemY]) + Q([cx, hemY + 2.2], [cx + W + .5 + flare, hemY]) + Q([cx + W + 1 + flare, hemY - 4], [cx + W + .5, belt]) +
      Q([cx + W + .5 + b.bel * 2, belt - 8], [cx + S - 1.2, ap]) + L([cx + S + 1.4, sh + 9]) + Q([cx + S + 2.2, sh + 3], [cx + S, sh + .8]) + Q([cx + S * .6, sh - 3.2], [cx + b.Nk + .4, sh - 3.6]) + "Z";
  }
  const shadeRight = (g, y1) => M([g.cx + g.S * .45, g.sh - 8]) + L([g.cx + 60, g.sh - 8]) + L([g.cx + 60, y1]) + L([g.cx + g.S * .45, y1]) + "Z";
  function beltDraw(x, g, w) {
    const bk = g.belt - 1.6;
    return part(x, rr(g.cc - w - 2.4, bk, 2 * w + .8, 3.6, 1), "#1f1a18", null, null, IW) + part(x, rr(g.cc - 2.4, bk - .4, 4.8, 4.4, .8), "#c9a24a", null, null, .8) + `<rect x="${f(g.cc - 1)}" y="${f(bk + .9)}" width="2" height="1.8" fill="#1f1a18"/>`;
  }
  function buttons(g, y0, y1, n, col) { let s = ""; for (let i = 0; i < n; i++) { const y = y0 + (y1 - y0) * i / Math.max(1, n - 1); s += `<circle cx="${f(g.cc + .4)}" cy="${f(y)}" r=".8" fill="${col}" stroke="${OL}" stroke-width=".4"/>`; } return s; }
  function topGarment(x, of, g) {
    const { cx, cc, S, W, Hj, sh, ap, bt, belt, hem, b, su, SHIRT, SHIRTD, TIE, TIED } = g;
    let s = "";
    if (GM[of.top]) return garmentMore(x, of, g);
    const collarPts = (col) => part(x, M([cc - b.Nk - .5, sh - 4]) + L([cc - 1.8, sh + 1.4]) + L([cc - b.Nk - 3, sh + 2.6]) + "Z", col, null, null, IW) + part(x, M([cc + b.Nk + .5, sh - 4]) + L([cc + 1.8, sh + 1.4]) + L([cc + b.Nk + 3, sh + 2.6]) + "Z", col, null, null, IW);
    if (of.top === "suit" || of.top === "tux" || of.top === "blazer") {
      const tux = of.top === "tux", blz = of.top === "blazer";
      s += part(x, rr(cc - b.W + 1, sh - 3, 2 * b.W - 2, belt - sh + 4, 3), SHIRT, M([cc + 1, sh - 3]) + L([cc + 30, sh - 3]) + L([cc + 30, belt + 2]) + L([cc + 1, belt + 2]) + "Z", SHIRTD, IW);
      if (blz) {
        s += part(x, M([cx - b.Nk - 1.4, sh - 3]) + Q([cc, sh + 11], [cx + b.Nk + 1.4, sh - 3]) + "Z", g.sk.m, null, null, .9);
        if (x.fem && x.age !== "kid") s += line(M([cc - 3, sh + 9.4]) + Q([cc, sh + 11.4], [cc + 3, sh + 9.4]), .6, g.sk.k, .5);
      } else if (!tux) {
        s += beltDraw(x, g, b.Hp - 1);
        const tieD = M([cc - 1.5, sh + 1.2]) + L([cc + 1.5, sh + 1.2]) + L([cc + 3.2, belt - 4]) + L([cc, belt - 1]) + L([cc - 3.2, belt - 4]) + "Z";
        s += part(x, tieD, TIE, M([cc + .4, sh]) + L([cc + 5, sh]) + L([cc + 5, belt]) + L([cc + .4, belt]) + "Z", TIED, IW) + part(x, M([cc - 2.4, sh - 2.2]) + L([cc + 2.4, sh - 2.2]) + L([cc + 1.6, sh + 1.6]) + L([cc - 1.6, sh + 1.6]) + "Z", TIE, null, null, IW);
        s += line(M([cc - 1.2, sh + 6]) + L([cc + 1.6, sh + 4.5]) + M([cc - 1.8, sh + 12]) + L([cc + 2.3, sh + 10]), .5, "#fff", .25);
      } else {
        
        s += part(x, rr(cc - b.Hp + .6, belt - 4, 2 * b.Hp - 1.2, 6, 1.4), "#121214", null, null, IW) + line(M([cc - b.Hp + 1.5, belt - 2]) + L([cc + b.Hp - 1.5, belt - 2]) + M([cc - b.Hp + 1.5, belt]) + L([cc + b.Hp - 1.5, belt]), .5, "#3a3a40");
        s += buttons(g, sh + 5, belt - 7, 3, "#111") + line(M([cc - 3, sh + 4]) + L([cc - 3, belt - 6]) + M([cc + 3.6, sh + 4]) + L([cc + 3.6, belt - 6]), .5, SHIRTD);
      }
      if (!blz) s += collarPts(SHIRT);
      if (tux) s += part(x, M([cc - 5, sh - 1.6]) + L([cc - 1, sh + .4]) + L([cc - 5, sh + 2.6]) + "Z", "#121214", null, null, IW) + part(x, M([cc + 5, sh - 1.6]) + L([cc + 1, sh + .4]) + L([cc + 5, sh + 2.6]) + "Z", "#121214", null, null, IW) + part(x, rr(cc - 1.4, sh - 1, 2.8, 2.8, .8), "#121214", null, null, IW);
      const panel = (sd) => M([cx + sd * (b.Nk + .4), sh - 3.6]) + Q([cx + sd * (S * .6), sh - 3.2], [cx + sd * S, sh + .8]) + Q([cx + sd * (S + 2.2), sh + 3], [cx + sd * (S + 1.4), sh + 9]) +
        L([cx + sd * (S - 1.2), ap]) + Q([cx + sd * (W + .5 + b.bel * 2), belt - 8], [cx + sd * (W + .5), belt]) + Q([cx + sd * (Hj + .6), hem - 8], [cx + sd * Hj, hem]) +
        Q([cc + sd * (Hj * .62), hem + 2], [cc + sd * (Hj * .45), hem - .5]) + Q([cc + sd * (W * .55), bt + 6], [cc + sd * (W * .5), bt - 2]) + L([cc + sd * 3.4, sh + 4]) + Q([cc + sd * 3, sh - 1.5], [cx + sd * (b.Nk + .4), sh - 3.6]) + "Z";
      s += part(x, panel(-1), su.m, M([cx - S * .2, sh - 6]) + L([cx - 2, sh - 6]) + L([cx - 2, hem + 4]) + L([cx - S * .2, hem + 4]) + "Z", su.d) + part(x, panel(1), su.m, shadeRight(g, hem + 4), su.d);
      const lapel = (sd) => M([cc + sd * (b.Nk + .4), sh - 3.4]) + L([cc + sd * (b.Nk + 6), sh + 6]) + (tux ? "" : L([cc + sd * (b.Nk + 4), sh + 7.6])) + L([cc + sd * (b.Nk + 5.6), sh + 11]) + Q([cc + sd * (W * .62), bt - 8], [cc + sd * (W * .5), bt - 2]) + L([cc + sd * 3.4, sh + 4]) + Q([cc + sd * 3, sh - 1.5], [cc + sd * (b.Nk + .4), sh - 3.4]) + "Z";
      const lc = tux ? N().shade(su.m, -.35) : su.hl;
      s += part(x, lapel(-1), lc, null, null, IW) + part(x, lapel(1), tux ? N().shade(su.m, -.45) : su.m, null, null, IW);
      if (tux) s += line(M([cc - b.Nk - 3, sh + 3]) + Q([cc - W * .4, sh + 14], [cc - W * .45, bt - 4]), .6, "#fff", .35);
      s += `<circle cx="${f(cc - W * .5 + .8)}" cy="${f(bt + 1)}" r="1.2" fill="${su.k}" stroke="${OL}" stroke-width=".6"/>`;
      s += line(M([cx - S * .62, sh + 12]) + L([cx - S * .3, sh + 11.4]), IW) + line(M([cx - Hj + 2.5, hem - 9]) + L([cx - Hj + 9, hem - 9.6]), IW) + line(M([cx + Hj - 2.5, hem - 9]) + L([cx + Hj - 9, hem - 9.6]), IW);
      s += line(M([cx - W * .55, belt - 3]) + Q([cx - W * .4, belt + 3], [cx - W * .5, hem - 4]), .8, su.k, .8) + line(M([cx + W * .62, ap + 6]) + Q([cx + W * .4, belt - 6], [cx + W * .62, belt + 4]), .8, su.k, .8);
      return s;
    }
    if (of.top === "shirt") {
      
      const t = torsoPath(g, belt + 1.5, -1.5);
      s += part(x, t, su.m, shadeRight(g, belt + 4), su.d) + beltDraw(x, g, b.Hp - .5);
      s += line(M([cc, sh + 1]) + L([cc + .2, belt - 1.6]), IW) + line(M([cc + 1.6, sh + 1]) + L([cc + 1.8, belt - 1.6]), .6, su.k, .7) + buttons(g, sh + 5, belt - 5, 4, su.hl);
      s += part(x, rr(cc - W * .7, sh + 9, W * .42, 6, 1), su.m, null, null, .8);
      s += line(M([cx - W * .6, belt - 4]) + q(4, -2) + M([cx + W * .5, belt - 5]) + q(-4, -2), .7, su.k, .7);
      s += collarPts(su.hl) + `<path d="M${f(cc - 1.8)} ${f(sh + 1.4)}L${f(cc)} ${f(sh + 3.4)}L${f(cc + 1.8)} ${f(sh + 1.4)}" fill="none" stroke="${OL}" stroke-width=".7"/>`;
      return s;
    }
    if (of.top === "tee" || of.top === "tank") {
      const t = torsoPath(of.top === "tank" ? Object.assign({}, g, { S: S - 6.5 }) : g, belt + 9, 1);
      s += part(x, t, su.m, shadeRight(g, belt + 14), su.d);
      if (of.top === "tank") {
        
        s += part(x, M([cx - b.Nk - 2, sh - 3]) + Q([cc, sh + 9], [cx + b.Nk + 2, sh - 3]) + L([cx + b.Nk + 1, sh - 4]) + Q([cc, sh + 6], [cx - b.Nk - 1, sh - 4]) + "Z", g.sk.m, null, null, .8);
        s += line(M([cx - S + 3, ap - 1]) + Q([cx - S + 6, ap + 6], [cx - W - .2, ap + 9]) + M([cx + S - 3, ap - 1]) + Q([cx + S - 6, ap + 6], [cx + W + .2, ap + 9]), IW);
        s += line(M([cc - 4, ap + 6]) + L([cc + 4.6, ap + 6]), 1.4, su.hl, .8);
      } else {
        s += line(M([cx - b.Nk - 1.2, sh - 3.2]) + Q([cc, sh + 3.6], [cx + b.Nk + 1.2, sh - 3.2]), 1.6, su.d) + line(M([cx - b.Nk - 1.2, sh - 3.2]) + Q([cc, sh + 3.6], [cx + b.Nk + 1.2, sh - 3.2]), IW);
      }
      s += line(M([cx - S * .5, sh + 10]) + Q([cx - S * .2, sh + 22], [cx + W * .3, belt + 4]), .7, su.k, .7) + line(M([cx + W * .2, belt + 2]) + q(3, 2) + M([cx - W * .7, belt + 5]) + q(3, -1.5), .7, su.k, .7);
      return s;
    }
    if (of.top === "pj") {
      
      const t = torsoPath(g, belt + 9, 1.5), pip = N().mix(su.m, "#ffffff", .7);
      s += part(x, t, su.m, shadeRight(g, belt + 14), su.d);
      for (let i = -3; i <= 3; i++) s += line(M([cx + i * 6, sh + 2]) + L([cx + i * 6 + 1, belt + 9]), .6, su.hl, .4);
      s += line(M([cc + .4, sh + 4]) + L([cc + .8, belt + 10]), 1.4, pip) + buttons(g, sh + 9, belt + 4, 4, pip);
      s += part(x, M([cx - b.Nk - .4, sh - 3.6]) + L([cc - 6, sh + 7]) + L([cc, sh + 4]) + "Z", su.m, null, null, IW) + part(x, M([cx + b.Nk + .4, sh - 3.6]) + L([cc + 6, sh + 7]) + L([cc, sh + 4]) + "Z", su.m, null, null, IW);
      s += line(M([cx - b.Nk - .4, sh - 3.6]) + L([cc - 6, sh + 7]) + M([cx + b.Nk + .4, sh - 3.6]) + L([cc + 6, sh + 7]), 1, pip) + part(x, rr(cc - W * .6, sh + 13, W * .4, 5, 1), su.m, null, null, .8);
      return s;
    }
    if (of.top === "parka") {
      
      const t = torsoPath(g, hem + 4, 2.5);
      s += part(x, t, su.m, shadeRight(g, hem + 8), su.d);
      s += line(M([cc, sh - 1]) + L([cc + .4, hem + 5.5]), 1.3) + line(M([cc + 1.3, sh]) + L([cc + 1.7, hem + 5]), .5, "#c9ccd2");
      s += line(M([cx - W - 1.4, belt]) + Q([cc, belt + 2.2], [cx + W + 1.4, belt]), .8, su.k, .9);
      s += line(M([cx - S * .62, sh + 12]) + L([cx - S * .2, sh + 12]) + M([cx - S * .6, sh + 12]) + L([cx - S * .58, sh + 20]), IW);
      s += line(M([cx - W + 2, belt + 6]) + L([cx - W * .35, belt + 13]) + M([cx + W - 2, belt + 6]) + L([cx + W * .35, belt + 13]), IW);
      s += line(M([cx - W * .6, belt + 2]) + q(3, 1.6) + M([cx + W * .3, ap + 8]) + q(3, -2), .7, su.k, .8);
      return s;
    }
    if (of.top === "hoodie") {
      
      const t = torsoPath(g, belt + 12, 1.5);
      s += part(x, t, su.m, shadeRight(g, belt + 16), su.d);
      s += part(x, rr(cx - W - 1.5, belt + 8.4, 2 * W + 3, 4.4, 1.6), su.d, null, null, IW);
      for (let i = -4; i <= 4; i++) s += line(M([cx + i * W * .22, belt + 9]) + L([cx + i * W * .22, belt + 12.4]), .4, su.k, .6);
      s += line(M([cc - 2.4, sh + 2]) + L([cc - 2.8, sh + 15]) + M([cc + 2.4, sh + 2]) + L([cc + 2.8, sh + 14]), 1, "#f2f2ee") + `<circle cx="${f(cc - 2.8)}" cy="${f(sh + 15.6)}" r=".9" fill="#c9ccd2"/><circle cx="${f(cc + 2.8)}" cy="${f(sh + 14.6)}" r=".9" fill="#c9ccd2"/>`;
      return s;
    }
    if (of.top === "coverall") {
      
      const t = torsoPath(g, belt + 6, 0);
      s += part(x, t, su.m, shadeRight(g, belt + 10), su.d);
      s += part(x, rr(cx - W - .6, belt - 2.4, 2 * W + 1.2, 4, 1.2), su.d, null, null, IW);
      s += line(M([cc, sh + 1]) + L([cc + .4, belt + 14]), 1.2) + line(M([cc + 1.2, sh + 1]) + L([cc + 1.6, belt + 14]), .5, "#c9ccd2");
      s += part(x, rr(cx - S * .7, sh + 9, S * .44, 8, 1), su.m, null, null, .9) + line(M([cx - S * .55, sh + 7]) + L([cx - S * .55, sh + 12]), 1.2, "#3a6ad8");
      s += part(x, rr(cx + S * .22, sh + 10, S * .36, 4.2, .8), "#f2f2ee", null, null, .7);
      s += collarPts(su.hl);
      return s;
    }
    return s;
    function q(dx, dy) { return q2(dx, dy); }
  }
  function hoodCollar(x, cx, sh, b, su) {
    const d = M([cx - b.Nk - 6, sh - 1]) + C([cx - b.Nk - 8, sh - 12], [cx + b.Nk + 8, sh - 12], [cx + b.Nk + 6, sh - 1]) + Q([cx, sh + 4], [cx - b.Nk - 6, sh - 1]) + "Z";
    const inner = M([cx - b.Nk - 2, sh - 2]) + C([cx - b.Nk - 3, sh - 8], [cx + b.Nk + 3, sh - 8], [cx + b.Nk + 2, sh - 2]) + Q([cx, sh + 1.6], [cx - b.Nk - 2, sh - 2]) + "Z";
    return part(x, d, su.m, M([cx + 2, sh - 14]) + L([cx + 30, sh - 14]) + L([cx + 30, sh + 6]) + L([cx + 2, sh + 6]) + "Z", su.d) + part(x, inner, su.k, null, null, IW);
  }

  
  function arm(x, sd, pose, of, g) {
    const { cx, S, W, sh, ap, belt, b, su, sk, SHIRT, so } = g;
    const j = [cx + sd * (S - 2.6), sh + 4.5 - (pose === "hip" ? 1.8 : 0)];
    let el, wr;
    if (pose === "pocket") { el = [cx + sd * (S + 5.5 + b.bel), belt - 7]; wr = [cx + sd * (b.Hp - 2.5), belt + 11]; }
    else if (pose === "hip") { el = [cx + sd * (S + 10.5 + b.bel), belt - 10]; wr = [cx + sd * (W + 3.4 + b.bel * .5), belt - 2]; }
    else if (pose === "walker") { el = [cx + sd * (S + 4.5 + b.bel), belt - 6]; wr = [cx + sd * (b.Hp + 6), belt + 1.5]; }
    else if (pose === "cane") { el = [cx + sd * (S + 4 + b.bel), belt - 3]; wr = [cx + sd * (S + 8 + b.bel), belt + 11]; }
    else if (pose === "rest") { el = [cx + sd * (S + 4 + b.bel), belt - 10]; wr = [cx + sd * (b.Hp + 6.6), belt - 6]; }
    else if (pose === "kanga") { el = [cx + sd * (S + 3 + b.bel), belt - 5]; wr = [cx + sd * (W * .42), belt + 4]; }
    else { const ak = Math.min(1, (g.tf || 1) * 1.15); el = [cx + sd * (S + 2.2 + b.bel), belt - 4 * ak]; wr = [cx + sd * (S + .6 + b.bel), belt + 16 * ak]; }
    const fa = pose === "walker" || pose === "cane" || pose === "rest" ? [(el[0] + wr[0]) / 2 + sd * .6, (el[1] + wr[1]) / 2 + 1] : pose === "hip" ? [(el[0] + wr[0]) / 2 + sd * 1.2, (el[1] + wr[1]) / 2 + 1.4] : pose === "kanga" ? [(el[0] + wr[0]) / 2 + sd * 1.5, (el[1] + wr[1]) / 2 + 2] : [wr[0] + sd * (pose === "pocket" ? 2.4 : .6), wr[1] - 5];
    const sleeve = of.sleeve, skinArm = sleeve === "none" || sleeve === "short" || sleeve === "rolled";
    const full = tube([[j[0], j[1], b.A + .8], [j[0] + sd * 1.6, ap, b.A + .5], [el[0], el[1], b.A * .92], [fa[0], fa[1], b.A * .8], [wr[0], wr[1], b.A * .76]]);
    const shade = sd > 0 ? M([j[0] - 1, sh]) + L([j[0] + 24, sh]) + L([j[0] + 24, wr[1] + 6]) + L([el[0] - b.A * .3, wr[1] + 6]) + Q([el[0] - b.A * .4, el[1]], [j[0] + 1, sh]) + "Z"
      : M([el[0] + b.A * .25, sh + 6]) + Q([el[0] + b.A * .5, el[1]], [wr[0] + b.A * .4, wr[1] + 6]) + L([j[0] + 24, wr[1] + 6]) + L([j[0] + 24, sh + 6]) + "Z";
    let s = "";
    if (skinArm) {
      s += part(x, full, sk.m, shade, sk.d);
      if (sleeve === "short") s += part(x, tube([[j[0], j[1] - 1, b.A + 1.8], [j[0] + sd * 1.4, ap, b.A + 1.6], [j[0] + (el[0] - j[0]) * .42, j[1] + (el[1] - j[1]) * .5, b.A + 1.3]]), of.top === "overalls" ? "#f2efe6" : su.m, sd > 0 ? shade : null, of.top === "overalls" ? "#cfcabc" : su.d);
      if (sleeve === "rolled") {
        const fx2 = fa[0] - el[0], fy2 = fa[1] - el[1], fl = Math.hypot(fx2, fy2) || 1, v = [fx2 / fl, fy2 / fl], E = (t, k) => [el[0] + v[0] * t, el[1] + v[1] * t, k];
        s += part(x, tube([[j[0], j[1] - 1, b.A + 1.4], [j[0] + sd * 1.6, ap, b.A + 1.1], [el[0], el[1], b.A * .98], E(1.6, b.A * .95)]), su.m, sd > 0 ? shade : null, su.d);
        s += part(x, tube([E(.8, b.A * 1.06), E(3, b.A * 1.1), E(4.6, b.A * 1.02)]), su.m, null, null, IW) + part(x, tube([E(3.6, b.A * 1.04), E(5.6, b.A * 1.06), E(7, b.A * .96)]), su.hl, null, null, IW);
        s += line(M([E(2, 0)[0] - v[1] * b.A * .8, E(2, 0)[1] + v[0] * b.A * .8]) + Q([E(2.6, 0)[0], E(2.6, 0)[1]], [E(2, 0)[0] + v[1] * b.A * .8, E(2, 0)[1] - v[0] * b.A * .8]), .55, su.k, .8);
      }
      if (sleeve === "none") s += part(x, M([j[0] - sd * (b.A + .2), j[1] + 4]) + C([j[0] - sd * (b.A + .6), j[1] - 4], [j[0] + sd * (b.A + 2.4), j[1] - 5.4], [j[0] + sd * (b.A + 1.8), j[1] + 5]) + Q([j[0], j[1] + 7], [j[0] - sd * (b.A + .2), j[1] + 4]) + "Z", sk.m, sd > 0 ? M([j[0], j[1] - 8]) + L([j[0] + 12, j[1] - 8]) + L([j[0] + 12, j[1] + 8]) + L([j[0], j[1] + 8]) + "Z" : null, sk.d) +
        line(M([j[0] - sd * (b.A - .6), j[1] + 4.6]) + Q([j[0], j[1] + 6.6], [j[0] + sd * (b.A + 1), j[1] + 5]), .6, sk.k, .6);
    } else {
      s += part(x, full, su.m, shade, su.d);
    }
    s += line(M([el[0] - sd * b.A * .6, el[1] - 2]) + Q([el[0], el[1] + .6], [el[0] + sd * b.A * .55, el[1] - 1.4]), .8, OL, .6);
    const ux = wr[0] - fa[0], uy = wr[1] - fa[1], ul = Math.hypot(ux, uy) || 1, u = [ux / ul, uy / ul], at = (t) => [wr[0] + u[0] * t, wr[1] + u[1] * t];
    
    if (!skinArm) {
      const shirtCuff = of.top === "suit" || of.top === "tux";
      void 0;
      if (shirtCuff) s += part(x, tube([[...at(-.6), b.A * .7], [...at(1.2), b.A * .68], [...at(2.6), b.A * .64]]), SHIRT, null, null, .9) + `<circle cx="${f(at(1.2)[0] - sd * b.A * .35)}" cy="${f(at(1.2)[1])}" r=".55" fill="#9aa0aa"/>`;
      else s += part(x, tube([[...at(-2.4), b.A * .82], [...at(0), b.A * .8]]), of.top === "hoodie" || of.top === "parka" || of.top === "puffer" ? su.d : su.hl, null, null, .9);
    }
    const w0 = skinArm ? 0 : (of.top === "suit" || of.top === "tux" ? 2.6 : 0);
    if (pose === "pocket") {
      s += part(x, tube([[...at(w0), b.A * .56], [...at(w0 + 1.9), b.A * .54]]), sk.m, null, null, .9);
      const pk = at(w0 + 1.5);
      s += line(M([pk[0] - sd * (b.A + 2.4), pk[1] - .6]) + Q([pk[0], pk[1] + 2.6], [pk[0] + sd * (b.A + 2.6), pk[1] - 2]), IW);
    } else if (pose === "cane") {
      
      const p = at(w0 + 3.2), sh2 = M([p[0], p[1] + 1]) + L([p[0] + sd * 1.6, so - 1]);
      const crook = M([p[0], p[1] + 2]) + L([p[0], p[1] - 1.2]) + Q([p[0], p[1] - 5.4], [p[0] - sd * 4, p[1] - 5]) + Q([p[0] - sd * 7.2, p[1] - 4.4], [p[0] - sd * 7, p[1] - 1.2]);
      s += line(sh2 + crook, 3.6, OL) + line(sh2 + crook, 2.1, "#7a4a2a") + line(M([p[0] - sd * .5, p[1] + 4]) + L([p[0] + sd * 1, so - 6]), .6, "#b07a4c", .8) + part(x, rr(p[0] + sd * 1.6 - 1.8, so - 3, 3.6, 3, 1), "#1c1c20", null, null, .7);
      s += hand(x, at(w0 - .2), u, sd, "fist", b);
    } else if (pose === "walker" || pose === "rest") s += hand(x, at(w0 - .2), u, sd, "fist", b);
    else if (pose !== "kanga") s += hand(x, at(w0 - .2), u, sd, pose, b);
    return s;
  }
  
  function hand(x, p, u, sd, pose, b) {
    const sk = x.sk, k = .9 + b.A * .03, n = [-u[1], u[0]];
    const P = (a, c) => [p[0] + u[0] * a * k + n[0] * c * k * sd, p[1] + u[1] * a * k + n[1] * c * k * sd];
    if (pose === "fist") {
      const d = M(P(-.4, -3.2)) + Q(P(2.4, -4.2), P(5.8, -2.8)) + Q(P(8, -.4), P(6.4, 2.6)) + Q(P(3, 4.4), P(-.4, 3.2)) + "Z";
      return part(x, d, sk.m, null, null, IW) + line(M(P(4.4, -2.6)) + Q(P(5.8, 0), P(4.4, 2.6)), .6, sk.k) + line(M(P(2.6, -3.2)) + Q(P(3.6, -1), P(2.6, .6)), .6, sk.k);
    }
    if (pose === "hip") {
      
      const ang = sd * .55, ca = Math.cos(ang), sa = Math.sin(ang), u2 = [u[0] * ca - u[1] * sa, u[0] * sa + u[1] * ca], n2 = [-u2[1], u2[0]], kk = k * .92;
      const H = (a, c) => [p[0] + u2[0] * a * kk + n2[0] * c * kk * sd, p[1] + u2[1] * a * kk + n2[1] * c * kk * sd];
      const d = M(H(0, -3)) + Q(H(3.4, -3.6), H(6.8, -3)) + Q(H(9.4, -2.2), H(9.6, .2)) + Q(H(9.2, 2.6), H(6.6, 3)) + Q(H(3.2, 3.4), H(0, 3)) + "Z";
      return part(x, d, sk.m, M(H(0, .8)) + L(H(12, .8)) + L(H(12, 5)) + L(H(0, 5)) + "Z", sk.d, IW) + line(M(H(6.4, -1.4)) + L(H(9, -1.1)) + M(H(6.4, .4)) + L(H(9.1, .7)) + M(H(6.2, 2)) + L(H(8.4, 2.3)), .55, sk.k);
    }
    const d = M(P(0, -3.2)) + Q(P(3.6, -3.8), P(7.4, -3.1)) + Q(P(10.4, -2.4), P(10.6, 0)) + Q(P(10.4, 2.6), P(7.6, 3.2)) + Q(P(3.4, 3.8), P(0, 3.2)) + "Z";
    const th = M(P(1.6, 2.6)) + Q(P(4.2, 5.4), P(6.6, 4.4)) + Q(P(7.2, 3.4), P(5.6, 2.6)) + Q(P(3.8, 2.2), P(1.6, 2.6)) + "Z";
    return part(x, d, sk.m, M(P(0, .6)) + L(P(12, .6)) + L(P(12, 5)) + L(P(0, 5)) + "Z", sk.d, IW) + part(x, th, sk.m, null, null, .8) +
      line(M(P(7.6, -1.6)) + L(P(10, -1.4)) + M(P(7.6, .2)) + L(P(10.2, .4)) + M(P(7.4, 1.8)) + L(P(9.6, 2.1)), .55, sk.k);
  }

  const GM = { blouse: 1, gowntop: 1, polo: 1, jersey: 1, puffer: 1, romper: 1, overalls: 1 };
  
  function kangaPocket(x, g) {
    const { cx, W, belt, su } = g;
    const pk = M([cx - W * .66, belt + 8.5]) + C([cx - W * .74, belt + 2], [cx - W * .52, belt - 4], [cx - W * .38, belt - 4.5]) + L([cx + W * .45, belt - 4.5]) + C([cx + W * .58, belt - 4], [cx + W * .8, belt + 2], [cx + W * .72, belt + 8.5]) + Q([cx, belt + 10.6], [cx - W * .66, belt + 8.5]) + "Z";
    return part(x, pk, su.m, M([cx + W * .2, belt - 6]) + L([cx + W, belt - 6]) + L([cx + W, belt + 12]) + L([cx + W * .2, belt + 12]) + "Z", su.d, IW) +
      line(M([cx - W * .46, belt - 2]) + Q([cx - W * .62, belt + 3], [cx - W * .5, belt + 7]) + M([cx + W * .52, belt - 2]) + Q([cx + W * .68, belt + 3], [cx + W * .56, belt + 7]), .8) +
      line(M([cx - W * .3, belt + 2]) + Q([cx - W * .18, belt + 4], [cx - W * .05, belt + 2.6]) + M([cx + W * .1, belt + 2.6]) + Q([cx + W * .24, belt + 4], [cx + W * .36, belt + 2]), .7, su.k, .8);
  }

  
  const STEEL = "#b9bec6", STEELD = "#6d737c";
  function walker(x, g) {
    const { cx, b, belt, so } = g, gy = belt + 6, wx = b.Hp + 6;
    let s = "";
    [-1, 1].forEach((sd) => { const px = cx + sd * wx;
      
      s += line(M([px + sd * 2, gy + 2]) + L([px + sd * 3, so - 1]), 1.8, STEELD) + line(M([px, gy]) + L([px - sd * .4, so]), 2.2, STEEL) + line(M([px, gy]) + L([px - sd * .4, so]), .5, OL, .8);
      s += part(x, rr(px - 1.8, gy - 1.4, 3.6, 7, 1.6), "#2a2b30", null, null, .8) + part(x, rr(px - sd * .4 - 2.2, so - 2.6, 4.4, 3.2, 1.4), "#9aa0a8", null, null, .7); });
    s += line(M([cx - wx, gy + 18]) + L([cx + wx, gy + 18]), 2, STEEL) + line(M([cx - wx, gy + 18]) + L([cx + wx, gy + 18]), .5, OL, .8);
    return s;
  }
  function wheelchairBack(x, g) {
    const { cx, b, belt, sh, kn, so, S } = g, wx = b.Hp + 12, wy = (belt + so) / 2 - 2, ry = (so - belt) / 2 + 3;
    let s = "";
    
    s += part(x, rr(cx - S - 1, sh - 4, 2 * S + 2, belt - sh + 6, 3), "#2a2c33", null, null, IW);
    [-1, 1].forEach((sd) => { s += line(M([cx + sd * (S + 1), belt]) + L([cx + sd * (S + 1.6), sh - 12]), 2, STEEL) + part(x, rr(cx + sd * (S + 1.6) - 2, sh - 16, 4, 5, 1.6), "#1d1e22", null, null, .7); });
    
    [-1, 1].forEach((sd) => { const px = cx + sd * wx;
      s += `<ellipse cx="${f(px)}" cy="${f(wy)}" rx="5.2" ry="${f(ry)}" fill="#1c1d22" stroke="${OL}" stroke-width="${OW}"/><ellipse cx="${f(px)}" cy="${f(wy)}" rx="3" ry="${f(ry - 3)}" fill="none" stroke="${STEEL}" stroke-width="1.1"/>` +
        `<ellipse cx="${f(px + sd * 2.6)}" cy="${f(wy)}" rx="1.4" ry="${f(ry - 4.5)}" fill="none" stroke="${STEELD}" stroke-width=".9"/><circle cx="${f(px)}" cy="${f(wy)}" r="1.6" fill="${STEEL}" stroke="${OL}" stroke-width=".6"/>`; });
    void kn;
    return s;
  }
  function wheelchairFoot(x, g, lxA, rxA) {
    const { cx, b, belt, kn, so } = g;
    let s = "";
    
    s += part(x, rr(cx - b.Hp - 6, belt + 1, 2 * b.Hp + 12, 4, 1.4), "#2a2c33", null, null, IW);
    [-1, 1].forEach((sd) => { const px = cx + sd * (b.Hp + 7);
      s += line(M([px, belt + 3]) + L([px - sd * 1, kn + 4]) + L([px - sd * 4, so - 6]), 1.8, STEEL) + `<ellipse cx="${f(px)}" cy="${f(so - 2.4)}" rx="1.8" ry="3" fill="#1c1d22" stroke="${OL}" stroke-width=".8"/>`; });
    [lxA, rxA].forEach((px, i) => { s += part(x, rr(px - 7 + (i ? 1 : -1), so - 1.6, 14, 2.6, 1), STEELD, null, null, .8); });
    return s;
  }
  function wheelchairFront(x, g) {
    const { cx, b, belt } = g;
    let s = "";
    
    [-1, 1].forEach((sd) => { const px = cx + sd * (b.Hp + 7);
      s += part(x, rr(px - 3.4, belt - 4, 6.8, 3, 1.3), "#2a2c33", null, null, .9) + line(M([px, belt - 1]) + L([px, belt + 3]), 1.4, STEEL); });
    return s;
  }

  
  function garmentMore(x, of, g) {
    const { cx, cc, S, W, sh, ap, belt, b, su, SHIRT, SHIRTD } = g;
    let s = "";
    const bust = () => x.fem && (x.age === "adult" || x.age === "old" || x.age === "teen") ? line(M([cx - S * .55, ap + 4]) + Q([cx - S * .3, ap + 8], [cx - S * .05, ap + 5]) + M([cc + S * .05, ap + 5]) + Q([cc + S * .32, ap + 8], [cc + S * .55, ap + 4]), .7, su.k, .55) : "";
    const polCollar = (col) => part(x, M([cx - b.Nk - .6, sh - 3.8]) + L([cc - 1, sh + 2]) + L([cc - b.Nk - 4.4, sh + 2.2]) + "Z", col, null, null, IW) + part(x, M([cx + b.Nk + .6, sh - 3.8]) + L([cc + 1, sh + 2]) + L([cc + b.Nk + 4.4, sh + 2.2]) + "Z", col, null, null, IW);
    if (of.top === "blouse") {
      const t = torsoPath(g, belt + 1.5, -1.5);
      s += part(x, t, su.m, shadeRight(g, belt + 4), su.d) + beltDraw(x, g, b.Hp - .5) + bust();
      s += part(x, M([cx - b.Nk - 1, sh - 3]) + L([cc, sh + 7]) + L([cx + b.Nk + 1, sh - 3]) + "Z", g.sk.m, null, null, .9) + polCollar(su.hl);
      s += line(M([cc, sh + 7]) + L([cc + .2, belt - 1.6]), .8, su.k, .8) + buttons(g, sh + 10, belt - 5, 3, su.hl);
      return s;
    }
    if (of.top === "gowntop") {
      
      const yT = ap - 1;
      s += part(x, M([cx - b.Nk - .4, sh - 3.6]) + Q([cx - S * .6, sh - 3.2], [cx - S + 4, sh + 1]) + L([cx - S + 5, yT + 2]) + L([cx + S - 5, yT + 2]) + L([cx + S - 4, sh + 1]) + Q([cx + S * .6, sh - 3.2], [cx + b.Nk + .4, sh - 3.6]) + "Z", g.sk.m, M([cx + 2, sh - 6]) + L([cx + 40, sh - 6]) + L([cx + 40, yT + 4]) + L([cx + 2, yT + 4]) + "Z", g.sk.d, IW);
      const bod = M([cx - S + 5.5, yT]) + Q([cx - S * .3, yT - 3], [cc, yT + 2]) + Q([cc + S * .3, yT - 3], [cx + S - 5.5, yT]) + Q([cx + W + 2, belt - 6], [cx + W + .5, belt]) + L([cx - W - .5, belt]) + Q([cx - W - 2, belt - 6], [cx - S + 5.5, yT]) + "Z";
      s += part(x, bod, su.m, M([cc + 2, yT - 4]) + L([cx + 40, yT - 4]) + L([cx + 40, belt + 2]) + L([cc + 2, belt + 2]) + "Z", su.d) + bust();
      s += line(M([cx - S + 6, yT + 1]) + L([cx - S + 6.6, sh + 2]) + M([cx + S - 6, yT + 1]) + L([cx + S - 6.6, sh + 2]), .9, su.d);
      s += line(M([cx - W * .5, yT + 6]) + Q([cx - W * .3, belt - 6], [cx - W * .45, belt - 1]), .8, su.hl, .6);
      return s;
    }
    if (of.top === "polo" || of.top === "jersey") {
      const t = torsoPath(g, belt + 8, 1);
      s += part(x, t, su.m, shadeRight(g, belt + 13), su.d) + bust();
      if (of.top === "polo") {
        s += polCollar(su.hl) + line(M([cc, sh - 1]) + L([cc, sh + 9]), .9) + buttons(g, sh + 2, sh + 8, 2, su.hl);
      } else {
        s += line(M([cx - b.Nk - 1.2, sh - 3.2]) + Q([cc, sh + 3.6], [cx + b.Nk + 1.2, sh - 3.2]), 1.8, "#f2f2ee") + line(M([cx - b.Nk - 1.2, sh - 3.2]) + Q([cc, sh + 3.6], [cx + b.Nk + 1.2, sh - 3.2]), IW);
        s += part(x, M([cx - S + 3, ap + 6]) + L([cx + S - 3, ap + 6]) + L([cx + S - 3.4, ap + 10]) + L([cx - S + 3.4, ap + 10]) + "Z", "#f2f2ee", null, null, .8);
      }
      s += line(M([cx - S * .5, sh + 10]) + Q([cx - S * .2, sh + 20], [cx + W * .3, belt + 3]), .7, su.k, .7);
      return s;
    }
    if (of.top === "puffer") {
      const t = torsoPath(g, belt + 10, 3.5);
      s += part(x, t, su.m, shadeRight(g, belt + 14), su.d);
      for (let i = 1; i <= 5; i++) { const y = sh + (belt + 10 - sh) * i / 6; s += line(M([cx - W - 2.5, y]) + Q([cx, y + 2.4], [cx + W + 2.5, y]), .8, su.k, .9); }
      s += line(M([cc, sh - 1]) + L([cc + .4, belt + 11.5]), 1.2) + line(M([cc + 1.2, sh]) + L([cc + 1.6, belt + 11]), .5, "#c9ccd2");
      return s;
    }
    if (of.top === "romper" || of.top === "overalls") {
      const tee = of.top === "overalls" ? "#f2efe6" : su.m, teeD = of.top === "overalls" ? "#cfcabc" : su.d;
      const t = torsoPath(g, belt + 3, 1.5);
      s += part(x, t, tee, shadeRight(g, belt + 6), teeD);
      if (of.top === "overalls") {
        for (let i = 1; i < 5; i++) s += line(M([cx - W - 1, sh + 2 + i * 5.5]) + L([cx + W + 1, sh + 2 + i * 5.5]), 1.2, "#c65b5b", .45);
        const bib = M([cx - W * .62, ap - 1]) + L([cx + W * .62, ap - 1]) + L([cx + W * .66, belt]) + L([cx + W + 1, belt]) + L([cx + W + 1.5, belt + 4]) + L([cx - W - 1.5, belt + 4]) + L([cx - W - 1, belt]) + L([cx - W * .66, belt]) + "Z";
        s += part(x, bib, su.m, M([cc + 2, ap - 2]) + L([cx + 30, ap - 2]) + L([cx + 30, belt + 6]) + L([cc + 2, belt + 6]) + "Z", su.d);
        s += line(M([cx - W * .55, ap]) + L([cx - S + 4, sh]) + M([cx + W * .55, ap]) + L([cx + S - 4, sh]), 2, su.m) + line(M([cx - W * .55, ap]) + L([cx - S + 4, sh]) + M([cx + W * .55, ap]) + L([cx + S - 4, sh]), .5, OL);
        s += `<circle cx="${f(cx - W * .52)}" cy="${f(ap + 1.2)}" r="1" fill="#d9b26a" stroke="${OL}" stroke-width=".5"/><circle cx="${f(cx + W * .52)}" cy="${f(ap + 1.2)}" r="1" fill="#d9b26a" stroke="${OL}" stroke-width=".5"/>`;
        s += part(x, rr(cc - W * .3, ap + 4, W * .6, 5, 1), su.m, null, null, .8);
      } else {
        s += line(M([cx - b.Nk - 1.2, sh - 3.2]) + Q([cc, sh + 3.6], [cx + b.Nk + 1.2, sh - 3.2]), 1.6, su.d) + line(M([cx - b.Nk - 1.2, sh - 3.2]) + Q([cc, sh + 3.6], [cx + b.Nk + 1.2, sh - 3.2]), IW);
        for (let i = 0; i < 3; i++) s += `<circle cx="${f(cc)}" cy="${f(sh + 4 + i * 4)}" r=".7" fill="#f2f2ee" stroke="${OL}" stroke-width=".4"/>`;
      }
      return s;
    }
    void SHIRT; void SHIRTD;
    return s;
  }

  
  const HAIR_M = [["side", "Short side part"], ["crew", "Crew cut"], ["buzz", "Buzz"], ["slick", "Slicked back"], ["messy", "Messy / textured"], ["curly", "Curly short"], ["afro", "Afro"],
    ["long", "Long (shoulder)"], ["bun", "Man bun"], ["pony", "Ponytail"], ["receding", "Receding"], ["bald", "Bald"]];
  function capPath(cx, top, hh, w, lift, hl) {
    return M([cx - w - .6, top + hh * .5]) + C([cx - w - 1.6, top + hh * .14], [cx - w * .7, top - lift], [cx, top - lift]) + C([cx + w * .7, top - lift], [cx + w + 1.6, top + hh * .14], [cx + w + .6, top + hh * .5]) +
      L([cx + w - .4, top + hh * .5]) + Q([cx + w * .8, top + hh * hl], [cx, top + hh * (hl - .02)]) + Q([cx - w * .8, top + hh * hl], [cx - w + .4, top + hh * .5]) + "Z";
  }
  
  function partL(x, d, fill, layers, wd) {
    const k = x.id("cp" + (CL++));
    return `<clipPath id="${k}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/><g clip-path="url(#${k})">${layers}</g><path d="${d}" fill="none" stroke="${OL}" stroke-width="${wd || OW}" stroke-linejoin="round"/>`;
  }
  
  function zig(pts, z, k, cx, w, flip) {
    let d = "";
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], ln = Math.hypot(dx, dy) || 1, sg = flip ? -1 : 1, nx = sg * dy / ln, ny = -sg * dx / ln;
      for (let j = 0; j < z.n; j++) {
        const s0 = lerp(a, b, j / z.n), s1 = lerp(a, b, (j + 1) / z.n), m = lerp(s0, s1, .5), uu = Math.min(1, Math.abs((m[0] - cx) / w)), dp = z.d * k * (z.v ? (1 + z.v * Math.sin(i * 2.3 + j * 1.7)) : 1) * (z.fall ? Math.max(.15, 1 - Math.pow(uu, 4)) : 1);
        if (z.round) { d += Q([m[0] + nx * dp * 2, m[1] + ny * dp * 2], s1); continue; }
        const tip = [m[0] + nx * dp + (z.s ? z.s((m[0] - cx) / w) * k : 0), m[1] + ny * dp];
        const c1 = lerp(s0, tip, .5), c2 = lerp(tip, s1, .5);
        d += Q([c1[0] + nx * dp * .35, c1[1] + ny * dp * .35], tip) + Q([c2[0] + nx * dp * .06, c2[1] + ny * dp * .06], s1);
      }
    }
    return d;
  }
  const strand = (pts, wd, col, op) => line(M(pts[0]) + thru(pts), wd, col, op);
  
  
  const bump = (s, c, r) => Math.max(0, 1 - ((s - c) / r) * ((s - c) / r));
  function scalp(cx, top, hh, w, th, n) {
    const P1 = [.86 * w, 0], P2 = [1.04 * w, .26 * hh], P3 = [w, .5 * hh], out = [];
    for (let i = 0; i <= n; i++) {
      const s = -1 + 2 * i / n, t = Math.abs(s), sd = s < 0 ? -1 : 1, mt = 1 - t;
      const bx = 3 * mt * mt * t * P1[0] + 3 * mt * t * t * P2[0] + t * t * t * P3[0], by = 3 * mt * mt * t * P1[1] + 3 * mt * t * t * P2[1] + t * t * t * P3[1];
      const dx = 3 * mt * mt * P1[0] + 6 * mt * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]), dy = 3 * mt * mt * P1[1] + 6 * mt * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]), ln = Math.hypot(dx, dy) || 1;
      const T = th(s);
      out.push([cx + sd * (bx + dy / ln * T), top + by - dx / ln * T, s]);
    }
    return out;
  }
  function shortMass(x, cx, top, hh, w, sp) {
    const k = hh / 36, hp = x.hp, h = N(), Pt = (u, a, v) => [cx + u * w + a * k, top + v * hh];
    const sb = sp.sb, tv = sp.tv || .42, n = sp.n || 10;
    const S = scalp(cx, top, hh, w, (s) => sp.th(s) * k, n), S2 = S.map((p) => [p[0], p[1]]);
    const z = sp.topZ ? Object.assign({ fall: 1 }, sp.topZ) : null;
    const seg = (pts) => pts.length < 3 ? L(pts[pts.length - 1]) : thru(pts);
    let topEdge = seg(S2);
    if (z) { const i0 = Math.max(0, S.findIndex((p) => p[2] >= (z.from == null ? -1 : z.from))), i1 = z.to == null ? n : Math.max(i0 + 1, S.findIndex((p) => p[2] >= z.to));
      topEdge = (i0 > 0 ? seg(S2.slice(0, i0 + 1)) : "") + zig(S2.slice(i0, i1 + 1), z, k, cx, w) + (i1 < n ? seg(S2.slice(i1)) : ""); }
    const sL = S2[0], sR = S2[n];
    
    const d = M(Pt(-1, .9, sb)) + Q(Pt(-1, -.3, .54), sL) + topEdge + Q(Pt(1, .3, .54), Pt(1, -.9, sb)) +
      Q(Pt(1, -2.4, sb - .08), Pt(1, -2, tv + .04)) + Q(Pt(1, -1.9, tv - .02), sp.line[0]) + (sp.lineZ ? zig(sp.line, sp.lineZ, k, cx, w) : seg(sp.line)) + Q(Pt(-1, 1.9, tv - .02), Pt(-1, 2, tv + .04)) + Q(Pt(-1, 2.4, sb - .08), Pt(-1, .9, sb)) + "Z";
    const fill = sp.soft ? h.mix(hp.m, x.sk.m, .42) : hp.m;
    let ly = "";
    if (sp.fade) { const fc = h.mix(hp.m, x.sk.m, sp.fade); [-1, 1].forEach((sd) => { ly += `<path d="${M(Pt(sd, -8 * sd, sp.fadeY || .47)) + L(Pt(sd, 7 * sd, sp.fadeY || .47)) + L(Pt(sd, 7 * sd, .9)) + L(Pt(sd, -8 * sd, .9))}Z" fill="${fc}"/>`; }); }
    
    const RS = S.filter((p) => p[2] >= .1), outR = RS.map((p) => [p[0] + (p[0] - cx) * .3 + 3, p[1] - 6]), inR = scalp(cx, top, hh, w, (s) => (sp.th(s) - 1.2 - 2.6 * s) * k, n).filter((p) => p[2] >= .1).map((p) => [p[0], p[1]]);
    const shade = M(inR[0]) + thru(inR) + L([inR[inR.length - 1][0], top + hh]) + L([cx + w + 9, top + hh]) + L(outR[outR.length - 1]) + thru(outR.slice().reverse()) + "Z";
    ly += `<path d="${shade}" fill="${hp.d}" opacity="${sp.soft ? .35 : 1}"/>`;
    if (!sp.soft && !sp.noBand) {
      const up = sp.line.map((p) => [p[0], p[1] - 2.4 * k]);
      ly += `<path d="${M(sp.line[0]) + thru(sp.line) + L(up[up.length - 1]) + thru(up.slice().reverse())}Z" fill="${hp.d}" opacity=".8"/>`;
    }
    (sp.cl || []).forEach((c) => { ly += strand(c, .8, OL, .55); });
    (sp.hi || []).forEach((c, i) => { ly += strand(c, (i ? .9 : 1.4) * k, hp.hl, i ? .7 : .95); });
    if (sp.extra) ly += sp.extra;
    return partL(x, d, fill, ly, sp.soft ? .6 : OW);
  }
  function shortHair(x, cx, top, hh, w, st) {
    const k = hh / 36, hp = x.hp, h = N(), Pt = (u, a, v) => [cx + u * w + a * k, top + v * hh];
    if (st === "bald") return `<path d="${M(Pt(.35, 0, .02)) + Q(Pt(.85, 0, .1), Pt(.95, 0, .36))}" fill="none" stroke="${x.sk.d}" stroke-width="${f(2.4 * k)}" stroke-linecap="round" opacity=".5"/>` +
      `<path d="M${f(cx - w * .5)} ${f(top + hh * .12)}Q${f(cx - w * .1)} ${f(top + 1.2)} ${f(cx + w * .25)} ${f(top + 1.8)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>`;
    if (st === "side") return shortMass(x, cx, top, hh, w, { sb: .64, fade: .22, th: (s) => 1.4 + 4.6 * bump(s, .1, .6) + 1.1 * bump(s, -.72, .32), n: 12,
      line: [Pt(1, -1.7, .42), Pt(.68, 0, .32), Pt(.2, 0, .28), Pt(-.42, 0, .29), Pt(-.78, 0, .34), Pt(-1, 1.7, .42)], lineZ: { n: 1, d: 1.5, s: (u) => u < -.42 ? -.8 : 1.4 },
      cl: [[Pt(-.38, 0, .21), Pt(.1, 0, .07), Pt(.55, 0, .09), Pt(.9, 0, .28)], [Pt(-.36, 0, .07), Pt(.1, 0, -.06), Pt(.6, 0, -.03), Pt(.97, 0, .13)], [Pt(-.48, 0, .12), Pt(-.76, 0, .18), Pt(-.96, 0, .34)]],
      hi: [[Pt(-.3, 0, .11), Pt(-.04, 0, -.05), Pt(.3, 0, -.07)], [Pt(-.6, 0, .06), Pt(-.8, 0, .15)]],
      extra: line(M(Pt(-.42, 0, .29)) + Q(Pt(-.45, 0, .12), Pt(-.4, 0, -.06)), 1) });
    if (st === "crew") { let tx = ""; for (let i = -3; i <= 3; i++) tx += line(M(Pt(i * .2, 0, .27)) + L(Pt(i * .19 + .02, 0, .16)), .6, OL, .35);
      return shortMass(x, cx, top, hh, w, { sb: .58, fade: .4, fadeY: .32, th: (s) => 1 + 2.4 * bump(s, 0, .85), n: 10,
        line: [Pt(1, -1.6, .42), Pt(.72, 0, .31), Pt(.3, 0, .28), Pt(-.3, 0, .28), Pt(-.72, 0, .31), Pt(-1, 1.6, .42)], lineZ: { n: 2, d: .55, round: true },
        hi: [[Pt(-.5, 0, .11), Pt(-.2, 0, -.01), Pt(.15, 0, -.02)]], extra: tx }); }
    if (st === "buzz") { let dots = ""; for (let i = 0; i < 70; i++) { const u = ((i * 37) % 100) / 50 - 1, v = ((i * 61) % 100) / 100 * .5 - .02; dots += `<circle cx="${f(cx + u * w)}" cy="${f(top + v * hh)}" r="${f(.32 * k)}" fill="${hp.d}" opacity=".7"/>`; }
      return shortMass(x, cx, top, hh, w, { soft: 1, sb: .56, th: () => .6, n: 10,
        line: [Pt(1, -1.5, .4), Pt(.74, 0, .33), Pt(.4, 0, .28), Pt(0, 0, .27), Pt(-.4, 0, .28), Pt(-.74, 0, .33), Pt(-1, 1.5, .4)],
        extra: dots + `<path d="${M(Pt(.2, 0, -.2)) + Q(Pt(.8, 0, .0), Pt(.7, 0, .5)) + L(Pt(1, 9, .8)) + L(Pt(1, 9, -.4))}Z" fill="${hp.d}" opacity=".3"/>` + strand([Pt(-.5, 0, .1), Pt(-.2, 0, .0), Pt(.1, 0, .01)], 1.1 * k, "#fff", .3) }); }
    if (st === "slick") { const cl = [-.6, -.36, -.12, .12, .36, .6].map((u) => [Pt(u, 0, .25 + Math.abs(u) * .05), Pt(u * .8, 0, .02), Pt(u * .35, 0, -.2)]);
      return shortMass(x, cx, top, hh, w, { sb: .6, fade: .25, fadeY: .4, noBand: 1, th: (s) => 1.2 + 6.2 * bump(s, -.05, .78), n: 10,
        line: [Pt(1, -1.6, .42), Pt(.78, 0, .37), Pt(.6, 0, .25), Pt(.3, 0, .21), Pt(0, 0, .215), Pt(-.3, 0, .21), Pt(-.6, 0, .25), Pt(-.78, 0, .37), Pt(-1, 1.6, .42)],
        cl, hi: [[Pt(-.46, 0, .2), Pt(-.4, 0, -.02), Pt(-.12, 0, -.18)], [Pt(-.22, 0, .19), Pt(-.17, 0, .0), Pt(.03, 0, -.16)]] }); }
    if (st === "messy") return shortMass(x, cx, top, hh, w, { sb: .6, fade: .2, th: (s) => 1.8 + 6.4 * bump(s, 0, .9), n: 8, topZ: { n: 1, d: 2.6, v: .25, s: (u) => Math.round((u + 1) * 3) % 2 ? 1.8 : -1.4 },
      line: [Pt(1, -1.7, .44), Pt(.64, 0, .31), Pt(.22, 0, .32), Pt(-.2, 0, .3), Pt(-.62, 0, .32), Pt(-1, 1.7, .44)], lineZ: { n: 1, d: 3.4, v: .25, s: (u) => u > .3 ? 1 : -1.6 },
      cl: [[Pt(0, 0, -.1), Pt(-.25, 0, .12), Pt(-.4, 0, .4)], [Pt(.05, 0, -.1), Pt(.15, 0, .15), Pt(.2, 0, .42)], [Pt(.1, 0, -.1), Pt(.5, 0, .1), Pt(.64, 0, .38)], [Pt(-.05, 0, -.1), Pt(-.6, 0, .08), Pt(-.86, 0, .3)]],
      hi: [[Pt(-.5, 0, .05), Pt(-.3, 0, -.1), Pt(-.05, 0, -.13)], [Pt(-.18, 0, .2), Pt(-.24, 0, .31)]] });
    if (st === "spiky") return shortMass(x, cx, top, hh, w, { sb: .58, fade: .3, th: (s) => 1.4 + 2.6 * bump(s, 0, .85), n: 8,
      
      topZ: { n: 1, d: 3.6, s: (u) => u * 1.4 },
      line: [Pt(1, -1.6, .42), Pt(.6, 0, .3), Pt(0, 0, .28), Pt(-.6, 0, .3), Pt(-1, 1.6, .42)], lineZ: { n: 2, d: 1, s: () => 0 },
      cl: [[Pt(-.3, 0, .26), Pt(-.35, 0, .05), Pt(-.45, 0, -.16)], [Pt(.05, 0, .26), Pt(.05, 0, .05), Pt(.08, 0, -.2)], [Pt(.4, 0, .26), Pt(.45, 0, .05), Pt(.55, 0, -.14)]],
      hi: [[Pt(-.55, 0, .14), Pt(-.3, 0, -.02), Pt(-.05, 0, -.06)]] });
    if (st === "curly") { let tx = ""; for (let i = 0; i < 24; i++) { const u = ((i * 41) % 100) / 100 * 1.8 - .9, v = ((i * 67) % 100) / 100 * .42 - .12, p = Pt(u, 0, v), r = 1.5 * k;
        tx += `<path d="M${f(p[0] - r)} ${f(p[1] + .4)}a${f(r)} ${f(r)} 0 1 1 ${f(r * 1.6)} ${f(-.4 * r)}" fill="none" stroke="${i % 4 ? hp.d : hp.hl}" stroke-width="${i % 4 ? .8 : 1}" stroke-linecap="round"/>`; }
      return shortMass(x, cx, top, hh, w, { sb: .58, fade: .15, th: (s) => 1.2 + 7.2 * bump(s, 0, .8), n: 9, topZ: { n: 1, d: 1.3, round: true },
        line: [Pt(1, -1.6, .42), Pt(.62, 0, .34), Pt(0, 0, .32), Pt(-.62, 0, .34), Pt(-1, 1.6, .42)], lineZ: { n: 2, d: 1.2, round: true }, extra: tx }); }
    if (st === "bun" || st === "pony") { const T = st === "bun" ? Pt(.08, 0, -.12) : Pt(0, 0, -.1);
      const cl = [-.8, -.5, -.2, .15, .45, .78].map((u) => { const a = Pt(u, 0, .3 + Math.abs(u) * .08); return [a, lerp(a, T, .5).map((v, i) => i ? v : v - u * 1.2 * k), T]; });
      return shortMass(x, cx, top, hh, w, { sb: .55, fade: .12, th: (s) => 1 + 1.6 * bump(s, 0, .9), n: 10,
        line: [Pt(1, -1.5, .42), Pt(.72, 0, .31), Pt(.35, 0, .27), Pt(0, 0, .26), Pt(-.35, 0, .27), Pt(-.72, 0, .31), Pt(-1, 1.5, .42)],
        cl, hi: [[Pt(-.5, 0, .14), Pt(-.35, 0, .0), Pt(-.05, 0, -.06)]] }); }
    if (st === "receding") {
      
      const thin = h.mix(hp.m, x.sk.m, .55);
      let g = `<path d="${M(Pt(-.8, 0, .14)) + C(Pt(-.7, 0, -.06), Pt(.7, 0, -.06), Pt(.8, 0, .14)) + Q(Pt(.4, 0, .06), Pt(0, 0, .08)) + Q(Pt(-.4, 0, .06), Pt(-.8, 0, .14))}Z" fill="${thin}" opacity=".85"/>`;
      [-1, 1].forEach((sd) => { const d = M(Pt(sd, -.4 * sd, .64)) + Q(Pt(sd, 1.1 * sd, .5), Pt(sd, 1.3 * sd, .3)) + Q(Pt(sd, 1 * sd, .12), Pt(sd * .8, 0, .08)) + Q(Pt(sd * .8, 0, .2), Pt(sd, -1.4 * sd, .34)) + Q(Pt(sd, -1.9 * sd, .46), Pt(sd, -2 * sd, .62)) + "Z";
        g += partL(x, d, hp.m, sd > 0 ? `<path d="${M(Pt(.6, 0, 0)) + L(Pt(1.4, 0, 0)) + L(Pt(1.4, 0, .8)) + L(Pt(.6, 0, .8))}Z" fill="${hp.d}"/>` : strand([Pt(-1, -.4, .2), Pt(-1, -.9, .34)], .9 * k, hp.hl, .7), IW); });
      const isl = M(Pt(-.26, 0, .07)) + Q(Pt(0, 0, .02), Pt(.24, 0, .07)) + Q(Pt(.14, 0, .14), Pt(.04, 0, .2)) + Q(Pt(-.04, 0, .13), Pt(-.12, 0, .17)) + Q(Pt(-.2, 0, .12), Pt(-.26, 0, .07)) + "Z";
      g += `<path d="${isl}" fill="${h.mix(hp.m, x.sk.m, .35)}"/>` + line(M(Pt(-.16, 0, .08)) + Q(Pt(-.05, 0, .12), Pt(.02, 0, .18)) + M(Pt(.04, 0, .07)) + Q(Pt(.1, 0, .11), Pt(.12, 0, .15)), .6, hp.d, .7);
      return g + `<path d="M${f(cx - w * .5)} ${f(top + hh * .14)}Q${f(cx - w * .3)} ${f(top + 1.4)} ${f(cx - w * .05)} ${f(top + 1)}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.2" stroke-linecap="round"/>`;
    }
    if (st === "afro") {
      
      const R = afroR(x, cx, top, hh, w), fillD = afroOuter(R) + L(Pt(1, -1.4, .55)) + zig([Pt(1, -1.4, .55), Pt(.66, 0, .33), Pt(0, 0, .29), Pt(-.66, 0, .33), Pt(-1, 1.4, .55)], { n: 3, d: .9, round: true }, k, cx, w) + "Z";
      const hl = M(Pt(1, -1.4, .55)) + zig([Pt(1, -1.4, .55), Pt(.66, 0, .33), Pt(0, 0, .29), Pt(-.66, 0, .33), Pt(-1, 1.4, .55)], { n: 3, d: .9, round: true }, k, cx, w);
      const kc = x.id("cp" + (CL++));
      return `<clipPath id="${kc}"><path d="${fillD}"/></clipPath><path d="${fillD}" fill="${hp.m}"/><g clip-path="url(#${kc})">${afroTex(x, R, hh)}</g><path d="${hl}" fill="none" stroke="${OL}" stroke-width="${IW}"/>`;
    }
    return "";
  }
  
  const afroR = (x, cx, top, hh, w) => ({ cx, cy: top + hh * .34, rx: w + 7.5 * hh / 36, ry: hh * .6, k: hh / 36, top, hh, w });
  function afroOuter(R) {
    let d = ""; const n = 24;
    for (let i = 0; i <= n; i++) { const a = Math.PI * (.8 + i / n * 1.4), p0 = [R.cx + Math.cos(a) * R.rx, Math.min(R.top + R.hh * .7, R.cy + Math.sin(a) * R.ry)];
      if (!i) d += M(p0); else { const am = Math.PI * (.8 + (i - .5) / n * 1.4); d += Q([R.cx + Math.cos(am) * (R.rx + 2.2 * R.k), Math.min(R.top + R.hh * .72, R.cy + Math.sin(am) * (R.ry + 2.2 * R.k))], p0); } }
    return d;
  }
  function afroTex(x, R, hh) {
    const hp = x.hp; let g = `<path d="${M([R.cx + R.rx * .1, R.cy - R.ry - 4]) + Q([R.cx + R.rx * .9, R.cy - R.ry * .6], [R.cx + R.rx * .7, R.cy + R.ry])}L${f(R.cx + R.rx + 6)} ${f(R.cy + R.ry)}L${f(R.cx + R.rx + 6)} ${f(R.cy - R.ry - 4)}Z" fill="${hp.d}"/>`;
    for (let i = 0; i < 70; i++) { const a = i * 2.39996, r = Math.sqrt((i + .5) / 70), px = R.cx + Math.cos(a) * R.rx * r * .95, py = R.cy + Math.sin(a) * R.ry * r * .95, s = 1.6 * R.k;
      g += `<path d="M${f(px - s)} ${f(py + .5)}a${f(s)} ${f(s)} 0 1 1 ${f(s * 1.7)} ${f(-.5)}" fill="none" stroke="${i % 5 === 0 ? hp.hl : hp.d}" stroke-width="${i % 5 === 0 ? .9 : .7}" stroke-linecap="round" stroke-opacity="${i % 5 === 0 ? .9 : .75}"/>`; }
    return g + `<path d="M${f(R.cx - R.rx * .62)} ${f(R.cy - R.ry * .5)}Q${f(R.cx - R.rx * .25)} ${f(R.cy - R.ry * .92)} ${f(R.cx + R.rx * .2)} ${f(R.cy - R.ry * .86)}" fill="none" stroke="${hp.hl}" stroke-width="${f(1.8 * R.k)}" stroke-linecap="round" stroke-opacity=".75"/>`;
    void hh;
  }
  
  function shortBack(x, cx, top, hh, w) {
    const st = x.hair, k = hh / 36, hp = x.hp;
    if (st === "afro") { const R = afroR(x, cx, top, hh, w), d = afroOuter(R) + "Z"; return partL(x, d, hp.m, afroTex(x, R, hh)); }
    if (st === "bun") { const bx = cx + w * .08, by = top - 2.4 * k;
      return partL(x, `M${f(bx - 6 * k)} ${f(by)}a${f(6 * k)} ${f(5 * k)} 0 1 1 ${f(12 * k)} 0a${f(6 * k)} ${f(5 * k)} 0 1 1 ${f(-12 * k)} 0Z`, hp.m,
        `<path d="M${f(bx + 1.5 * k)} ${f(by - 8 * k)}h${f(8 * k)}v${f(14 * k)}h${f(-8 * k)}Z" fill="${hp.d}"/>` + line(M([bx - 4 * k, by - 1.4 * k]) + Q([bx, by - 4.6 * k], [bx + 4 * k, by - 1.6 * k]) + M([bx - 3 * k, by + 1.4 * k]) + Q([bx + .5, by - 1.4 * k], [bx + 4.4 * k, by + .6 * k]), .7, OL, .6) +
        strand([[bx - 4 * k, by - 2.6 * k], [bx - 2 * k, by - 4.4 * k], [bx + 1 * k, by - 4.6 * k]], 1.1 * k, hp.hl, .8)); }
    return "";
  }

  
  const FACIAL = [["none", "None"], ["stubble", "Stubble"], ["mustache", "Mustache"], ["goatee", "Goatee"], ["short", "Short beard"], ["full", "Full beard"]];
  function facialHair(x, cx, top, hh, w, fx, ny, my) {
    const fh = x.facial, chin = top + hh, h = N();
    if (!fh || fh === "none") return { under: "", over: "" };
    const fhc = GRAYS[x.hc] ? h.shade(x.hc, -.12) : x.hp.m, fhd = h.shade(fhc, -.32), fhl = h.shade(fhc, .3);
    const jawR = (drop, b1, cheekY) => M([cx - w * .96, top + hh * .62]) + C([cx - w * (.97 + b1), top + hh * .8], [cx - w * (.72 + b1), chin + drop * .6], [fx, chin + drop]) + C([cx + w * (.72 + b1), chin + drop * .6], [cx + w * (.97 + b1), top + hh * .8], [cx + w * .96, top + hh * .62]) +
      L([cx + w * .84, top + hh * .62]) + Q([cx + w * .66, cheekY], [fx + 5.6, my - .8]) + Q([fx + 5.2, my + 3.2], [fx, my + 3.4]) + Q([fx - 5.2, my + 3.2], [fx - 5.6, my - .8]) + Q([cx - w * .66, cheekY], [cx - w * .84, top + hh * .62]) + "Z";
    const shR = (y1) => `<path d="M${f(fx + 1)} ${f(top)}L${f(cx + w * 2)} ${f(top)}L${f(cx + w * 2)} ${f(y1)}L${f(fx + 1)} ${f(y1)}Z" fill="${fhd}"/>`;
    const mus = (th) => M([fx - 5.2, my]) + Q([fx - 5, my - 2.4 - th], [fx - 2.4, my - 3.1 - th]) + Q([fx - .8, my - 3.5 - th], [fx, my - 2.9 - th]) + Q([fx + .8, my - 3.5 - th], [fx + 2.4, my - 3.1 - th]) + Q([fx + 5, my - 2.4 - th], [fx + 5.2, my]) +
      Q([fx + 4, my - 1.2], [fx + 2, my - 1.5]) + Q([fx, my - 1.1], [fx - 2, my - 1.5]) + Q([fx - 4, my - 1.2], [fx - 5.2, my]) + "Z";
    const musTex = line(M([fx - 3.8, my - 2.2]) + L([fx - 3.5, my - 1.2]) + M([fx - 2.1, my - 2.7]) + L([fx - 1.9, my - 1.6]) + M([fx + 1.8, my - 2.7]) + L([fx + 2, my - 1.6]) + M([fx + 3.5, my - 2.2]) + L([fx + 3.8, my - 1.2]), .5, fhd, .9) +
      line(M([fx - 4.2, my - 1.6]) + Q([fx - 3.3, my - 3], [fx - 1.4, my - 3]), .8, fhl, .8);
    const mustache = (th) => partL(x, mus(th), fhc, shR(my + 2) + musTex, IW);
    if (fh === "stubble") {
      const d = jawR(1.2, 0, ny + 2.4);
      return { under: `<path d="${d}" fill="${fhc}" opacity=".16"/><path d="${jawR(.6, -.03, ny + 3.2)}" fill="${fhc}" opacity=".08"/>`,
        over: `<path d="${mus(-.4)}" fill="${fhc}" opacity=".2"/>` };
    }
    if (fh === "mustache") return { under: "", over: mustache(.2) };
    if (fh === "goatee") {
      const d = M([fx - 5.8, my - .4]) + Q([fx - 6.6, my + 4], [fx - 3.8, chin + .9]) + Q([fx, chin + 2.8], [fx + 3.8, chin + .9]) + Q([fx + 6.6, my + 4], [fx + 5.8, my - .4]) + L([fx + 4.6, my + .5]) + Q([fx, my + 3.7], [fx - 4.6, my + .5]) + "Z";
      return { under: partL(x, d, fhc, shR(chin + 4) + line(M([fx - 3.2, chin - 1]) + q2(1.2, 1.6) + M([fx + .8, chin]) + q2(1.2, 1.6), .6, fhd, .9) + line(M([fx - 4.6, my + 2.6]) + Q([fx - 4.4, chin - 1], [fx - 2.6, chin + .2]), .9, fhl, .7), IW), over: mustache(.2) };
    }
    if (fh === "short") {
      const d = jawR(1.8, .03, my - 1.6);
      const tex = line(M([cx - w * .7, top + hh * .74]) + q2(1, 1.6) + M([cx - w * .4, chin - 2]) + q2(1, 1.6) + M([fx + 2, chin - 1]) + q2(1, 1.6) + M([cx + w * .55, top + hh * .8]) + q2(1, 1.6), .55, fhd, .9) +
        line(M([cx - w * .9, top + hh * .6]) + Q([cx - w * .86, top + hh * .8], [cx - w * .6, chin - 2]), 1, fhl, .6);
      return { under: partL(x, d, fhc, shR(chin + 6) + `<path d="M${f(cx - w)} ${f(chin - 1)}Q${f(fx)} ${f(chin + 3.6)} ${f(cx + w)} ${f(chin - 1)}L${f(cx + w)} ${f(chin + 6)}L${f(cx - w)} ${f(chin + 6)}Z" fill="${fhd}" opacity=".6"/>` + tex, IW), over: mustache(.3) };
    }
    
    const Lt = [cx - w * .96, top + hh * .62], Rt = [cx + w * .96, top + hh * .62];
    const bot = [[cx - w * .84, chin + .4], [fx - w * .46, chin + 4.4], [fx, chin + 6], [fx + w * .46, chin + 4.4], [cx + w * .84, chin + .4]];
    const d = M(Lt) + C([cx - w * 1.04, top + hh * .76], [cx - w * 1.02, chin - 3], bot[0]) + zig(bot, { n: 1, d: 1.8, s: (u) => u * -.8 }, 1, cx, w, true) + C([cx + w * 1.02, chin - 3], [cx + w * 1.04, top + hh * .76], Rt) +
      L([cx + w * .84, top + hh * .62]) + Q([cx + w * .68, my - 2.4], [fx + 5.8, my - 1]) + Q([fx + 5.2, my + 3], [fx, my + 3.2]) + Q([fx - 5.2, my + 3], [fx - 5.8, my - 1]) + Q([cx - w * .68, my - 2.4], [cx - w * .84, top + hh * .62]) + "Z";
    const tex = line(M([cx - w * .62, chin - 2]) + Q([cx - w * .55, chin + 2], [cx - w * .42, chin + 4]) + M([fx - 2, chin]) + Q([fx - 1.6, chin + 3], [fx - 1, chin + 5.6]) + M([fx + 3, chin - .4]) + Q([fx + 3.6, chin + 2.6], [fx + 4.4, chin + 4.6]) + M([cx + w * .7, top + hh * .76]) + Q([cx + w * .74, chin - 2], [cx + w * .66, chin + 1.4]), .7, fhd, .9) +
      line(M([cx - w * .92, top + hh * .6]) + Q([cx - w * .92, top + hh * .85], [cx - w * .64, chin + 1]), 1.2, fhl, .65);
    return { under: partL(x, d, fhc, shR(chin + 10) + `<path d="M${f(cx - w * 1.2)} ${f(chin + 1)}Q${f(fx)} ${f(chin + 5)} ${f(cx + w * 1.2)} ${f(chin + 1)}L${f(cx + w * 1.2)} ${f(chin + 10)}L${f(cx - w * 1.2)} ${f(chin + 10)}Z" fill="${fhd}" opacity=".55"/>` + tex), over: mustache(.5) };
  }

  
  function headDraw(x, cx, top, hh, of) {
    const k = hh / 36, age = x.age, kid = age === "kid" || age === "toddler" || age === "baby", old = age === "old", fem = x.fem;
    const fx = cx + 1.6 * k, sk = x.sk, hp = x.hp, w = headW(x), chin = top + hh;
    const ey = top + hh * (kid ? .6 : .56), ny = top + hh * (kid ? .75 : .72), my = top + hh * (kid ? .865 : .855);
    const cw = kid ? .6 : fem ? .44 : .5, jx = kid ? .94 : fem ? .76 : .8;
    const face = M([cx, top]) + C([cx + w * .86, top], [cx + w * 1.04, top + hh * .26], [cx + w, top + hh * .5]) + C([cx + w * .98, top + hh * .7], [cx + w * jx, top + hh * .86], [cx + w * cw, chin - 1.2 * k]) +
      Q([cx, chin + k], [cx - w * cw, chin - 1.2 * k]) + C([cx - w * jx, top + hh * .86], [cx - w * .98, top + hh * .7], [cx - w, top + hh * .5]) + C([cx - w * 1.04, top + hh * .26], [cx - w * .86, top], [cx, top]) + "Z";
    let g = "";
    [-1, 1].forEach((sd) => { const ex = cx + sd * (w - .8);
      const d = M([ex, ey - 1.5 * k]) + C([ex + sd * 3.4 * k, ey - 3.4 * k], [ex + sd * 4 * k, ey + 3.4 * k], [ex + sd * .6, ny + 1.4 * k]) + "Z";
      g += part(x, d, sd < 0 ? sk.m : sk.d, null, null, IW + .2) + line(M([ex + sd * 1.2 * k, ey - .6 * k]) + Q([ex + sd * 2.8 * k, ey + k], [ex + sd * 1.4 * k, ny - .2]), .7, sk.k); });
    const shade = M([cx + w * .45, top]) + C([cx + w * 1.1, top + hh * .3], [cx + w, top + hh * .8], [cx + w * .2, chin + 2]) + L([cx + w * 2, chin + 2]) + L([cx + w * 2, top]) + "Z";
    g += part(x, face, sk.m, shade, sk.d, OW);
    const blush = kid ? .45 : fem ? .36 : .28;
    g += `<ellipse cx="${f(fx - w * .5)}" cy="${f(ny + .8 * k)}" rx="${f(2.3 * k)}" ry="${f(1.3 * k)}" fill="#e8806a" opacity="${blush}"/><ellipse cx="${f(fx + w * .46)}" cy="${f(ny + .8 * k)}" rx="${f(1.9 * k)}" ry="${f(1.2 * k)}" fill="#e8806a" opacity="${f(blush * .85)}"/>`;
    
    if (old) g += line(M([cx - w * .45, top + hh * .37]) + Q([cx, top + hh * .34], [cx + w * .45, top + hh * .37]) + M([cx - w * .32, top + hh * .43]) + Q([cx, top + hh * .405], [cx + w * .32, top + hh * .43]), .6, sk.k, .55) +
      line(M([fx - 3.8, ny + 1]) + Q([fx - 5.2, my - 1], [fx - 4.6, my + 1.2]) + M([fx + 3.8, ny + 1]) + Q([fx + 5, my - 1], [fx + 4.4, my + 1.2]), .65, sk.k, .55);
    
    const ke = k * (kid ? 1.2 : fem ? 1.06 : 1), es = w * (kid ? .42 : .4), ew = 3.3 * ke, eh = 4 * ke;
    let eyes = "";
    [-1, 1].forEach((sd) => { const ex = fx + sd * es * (sd > 0 ? .94 : 1), e2 = ew * (sd > 0 ? .92 : 1);
      if (x.asleep) { eyes += line(M([ex - e2, ey + .4]) + Q([ex, ey + eh * .75], [ex + e2, ey + .2]), 1.2) + line(M([ex + sd * e2 * .7, ey + eh * .35]) + L([ex + sd * (e2 + .6), ey + eh * .55]), .7); return; }
      eyes += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(e2)}" ry="${f(eh)}" fill="#fff" stroke="${OL}" stroke-width=".55"/>` +
        `<circle cx="${f(ex + 1.1 * ke)}" cy="${f(ey + .5 * ke)}" r="${f(2.15 * ke)}" fill="#7a4a2c" stroke="#3a2214" stroke-width=".55"/><circle cx="${f(ex + 1.1 * ke)}" cy="${f(ey + .9 * ke)}" r="${f(1.4 * ke)}" fill="#5c361f" opacity=".6"/>` +
        `<circle cx="${f(ex + 1.1 * ke)}" cy="${f(ey + .5 * ke)}" r="${f(1.05 * ke)}" fill="#0e0907"/><circle cx="${f(ex + .4 * ke)}" cy="${f(ey - .4 * ke)}" r="${f(.7 * ke)}" fill="#fff"/><circle cx="${f(ex + 1.8 * ke)}" cy="${f(ey + 1.3 * ke)}" r="${f(.32 * ke)}" fill="#fff"/>` +
        `<path d="M${f(ex - e2 - .3)} ${f(ey - .2)}Q${f(ex - .4)} ${f(ey - eh - 1.6 * ke)} ${f(ex + e2 + .4)} ${f(ey - .9 * ke)}l${f(sd * .9)} -.7" fill="none" stroke="${OL}" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<path d="M${f(ex - e2 + .6)} ${f(ey + eh - .5)}Q${f(ex)} ${f(ey + eh + .5)} ${f(ex + e2 - .6)} ${f(ey + eh - .6)}" fill="none" stroke="${sk.k}" stroke-width=".55" stroke-opacity=".7"/>`;
      if (fem) { const oxp = ex + sd * (e2 + .1), oy = ey - eh * (sd > 0 ? .3 : .1);
        eyes += line(M([oxp, oy]) + L([oxp + sd * 1.5 * ke, oy - 1.1 * ke]) + M([oxp - sd * 1.3 * ke, oy - eh * .45]) + L([oxp + sd * .2, oy - eh * .45 - 1.5 * ke]), .8); }
      if (old) eyes += line(M([ex - e2 + .8, ey + eh + 1.2]) + Q([ex, ey + eh + 2.4], [ex + e2 - .4, ey + eh + 1]), .5, sk.k, .5) + line(M([ex + sd * (e2 + 1), ey - .4]) + L([ex + sd * (e2 + 2.6), ey - 1.2]) + M([ex + sd * (e2 + 1), ey + 1]) + L([ex + sd * (e2 + 2.6), ey + 1.6]), .5, sk.k, .55); });
    g += `<g class="${P}blink">${eyes}</g>`;
    
    const browC = GRAYS[x.hc] ? "#8a8880" : N().shade(hp.m, -.25), bt = fem ? .55 : kid ? .8 : old ? 1.2 : 1, ar = fem ? 1.4 : 0;
    if (age !== "baby") [-1, 1].forEach((sd) => { const bx = fx + sd * es * (sd > 0 ? .94 : 1), by = ey - (kid ? 1.1 : 0) * k;
      g += `<path d="M${f(bx - sd * 3.4 * ke)} ${f(by - 5.4 * ke)}Q${f(bx - sd * .2)} ${f(by - (7.6 + ar) * ke)} ${f(bx + sd * 4 * ke)} ${f(by - 4.8 * ke)}Q${f(bx)} ${f(by - (7.6 + ar - 1.4 * bt) * ke)} ${f(bx - sd * 3.2 * ke)} ${f(by - (5.4 - 1.4 * bt) * ke)}Z" fill="${browC}" stroke="${OL}" stroke-width=".5" stroke-linejoin="round"/>`; });
    else [-1, 1].forEach((sd) => { const bx = fx + sd * es; g += line(M([bx - 2.4 * ke, ey - 5.6 * ke]) + Q([bx, ey - 6.6 * ke], [bx + 2.4 * ke, ey - 5.6 * ke]), .6, browC, .6); });
    
    const kn = k * (fem ? .85 : 1);
    if (kid) g += line(M([fx - 1.5 * k, ny + .2]) + Q([fx, ny + 1.5 * k], [fx + 1.5 * k, ny + .1]), .85) + `<ellipse cx="${f(fx - .2)}" cy="${f(ny - 1.2 * k)}" rx="${f(.8 * k)}" ry="${f(.9 * k)}" fill="${sk.hl}" opacity=".8"/>`;
    else g += line(M([fx + .8 * kn, ey + 1.5 * k]) + Q([fx + 2.4 * kn, ny - k], [fx + 1.8 * kn, ny + .6]), .9) + line(M([fx - 1.8 * kn, ny + .4]) + Q([fx - .4 * kn, ny + 1.6], [fx + 1.8 * kn, ny + .6]), .9) +
      `<ellipse cx="${f(fx - .6)}" cy="${f(ny - 1.6)}" rx=".8" ry="1.2" fill="${sk.hl}" opacity=".7"/>`;
    
    const fh = x.facial, FHx = facialHair(x, cx, top, hh, w, fx, ny, my);
    g += FHx.under;
    
    if (kid) g += line(M([fx - 2.6 * k, my - .6]) + Q([fx, my + 1.9 * k], [fx + 2.6 * k, my - .8]), .95) + line(M([fx - .9 * k, my + 2.3 * k]) + Q([fx, my + 2.7 * k], [fx + .9 * k, my + 2.3 * k]), .6, sk.k, .7);
    else if (fem) { const lip = N().mix(sk.m, "#c0485a", .5), lipD = N().shade(lip, -.2);
      g += `<path d="M${f(fx - 3.1)} ${f(my - .2)}Q${f(fx)} ${f(my + 3.4)} ${f(fx + 3.1)} ${f(my - .5)}Q${f(fx)} ${f(my + .8)} ${f(fx - 3.1)} ${f(my - .2)}Z" fill="${lip}" stroke="${OL}" stroke-width=".5"/>` +
        `<path d="M${f(fx - 3.4)} ${f(my - .3)}Q${f(fx - 1.6)} ${f(my - 2.2)} ${f(fx)} ${f(my - 1.3)}Q${f(fx + 1.6)} ${f(my - 2.2)} ${f(fx + 3.4)} ${f(my - .7)}Q${f(fx)} ${f(my + .5)} ${f(fx - 3.4)} ${f(my - .3)}Z" fill="${lipD}" stroke="${OL}" stroke-width=".5"/>` +
        line(M([fx - 3.3, my - .3]) + Q([fx, my + 1.2], [fx + 3.3, my - .7]), .9) + `<ellipse cx="${f(fx - .6)}" cy="${f(my + 1.5)}" rx="1.2" ry=".45" fill="#fff" opacity=".45"/>`; }
    else g += line(M([fx - 3.4, my - .4]) + Q([fx, my + 1.8], [fx + 3.4, my - .8]), 1.1) + (fh === "full" || fh === "short" || fh === "goatee" ? "" : line(M([fx - 1.4, my + 2.2]) + Q([fx, my + 2.8], [fx + 1.4, my + 2.2]), .7, sk.k));
    g += FHx.over;
    g += hairFront(x, cx, top, hh, w);
    if (of && of.hat) g += beanie(x, cx, top, hh, w);
    if (x.glasses !== "none" && age !== "baby") {
      const kg = Math.max(.85, Math.min(1.1, ke));
      g += `<g transform="translate(${f(fx)} ${f(ey)}) scale(${kg.toFixed(3)}) translate(${f(-fx)} ${f(-ey)})">${glasses(x, fx, ey, es / kg, fx + (cx - fx) / kg, w / kg)}</g>`;
    }
    return g;
  }

  
  function glasses(x, fx, ey, es, cx, w) {
    const gl = x.glasses; if (gl === "none") return "";
    const lx = [fx - es, fx + es * .94], y = ey + .3;
    const frame = { rect: "#1c1c20", round: "#6b3f22", browline: "#1c1c20", sun: "#141416", cat: "#7a2e4a" }[gl] || "#1c1c20";
    let s = "";
    const lens = (px) => gl === "round" ? `<circle cx="${f(px)}" cy="${f(y)}" r="4.3"/>` : gl === "cat" ? `<path d="M${f(px - 4.7)} ${f(y - 3.4)}Q${f(px)} ${f(y - 2.6)} ${f(px + 4.7)} ${f(y - 3.6)}Q${f(px + 4.6)} ${f(y + 3.2)} ${f(px)} ${f(y + 3.1)}Q${f(px - 4.4)} ${f(y + 3)} ${f(px - 4.7)} ${f(y - 3.4)}Z"/>` :
      `<rect x="${f(px - 4.5)}" y="${f(y - 3.3)}" width="9" height="6.6" rx="${gl === "sun" ? 2.6 : 1.6}"/>`;
    s += line(M([lx[0] - (gl === "round" ? 4.2 : 4.4), y - 1.4]) + L([cx - w + .6, y - 1.8]) + M([lx[1] + (gl === "round" ? 4.2 : 4.4), y - 1.4]) + L([cx + w - .6, y - 1.8]), 1.1, frame);
    s += line(M([lx[0] + (gl === "round" ? 4.2 : 4.4), y - 1]) + Q([fx + .2, y - 2.6], [lx[1] - (gl === "round" ? 4.2 : 4.4), y - 1]), 1.1, frame);
    lx.forEach((px) => {
      const fill = gl === "sun" ? `fill="#1e2430" fill-opacity=".88"` : `fill="#cfe4f4" fill-opacity=".18"`;
      s += `<g ${fill} stroke="${gl === "browline" ? "#c9a24a" : frame}" stroke-width="${gl === "browline" ? .8 : 1.15}">${lens(px)}</g>`;
      if (gl === "browline") s += line(M([px - 4.6, y - 2.4]) + Q([px, y - 4.6], [px + 4.6, y - 2.6]), 2, frame);
      if (gl === "round") s += `<circle cx="${f(px - 2.6)}" cy="${f(y - 2.2)}" r=".6" fill="#a8743e"/><circle cx="${f(px + 3)}" cy="${f(y + 1.6)}" r=".55" fill="#3a2010"/>`;
      if (gl === "cat") s += line(M([px + (px > fx ? 3.4 : -3.4), y - 3.4]) + L([px + (px > fx ? 5.4 : -5.4), y - 4.6]), 1.6, frame);
      s += line(M([px - 2.4, y + 1.6]) + L([px + .6, y - 2]), gl === "sun" ? .9 : .7, "#fff", gl === "sun" ? .45 : .6);
    });
    return s;
  }

  
  const HAIR_TOP = { afro: 11.5, bun: 8, messy: 11.5, curly: 9, long: 3, side: 8, slick: 8, crew: 4, pony: 2.5, buzz: 1.5, receding: 1, bald: 0,
    spiky: 9, fstraight: 3, fwavy: 4, bob: 4, pixie: 6, fbun: 11, fpony: 6, braids: 3, fcurly: 5, updo: 6, perm: 10, pigtails: 3, tuft: 6, fuzz: .5 };
  const HAIR_W = { pigtails: 10, afro: 6, curly: 1, messy: .5, fcurly: 7, fwavy: 5, fstraight: 4.5, bob: 4.5, perm: 3.5, braids: 3, long: 6, fpony: 6 };
  const LONG = { fstraight: { wave: 0 }, fwavy: { wave: 1.7 }, fcurly: { wave: 2.4, curl: true }, long: { wave: .5, len: 1.45 } };
  const lenFor = (x, st) => LONG[st].len || (x.age === "kid" || x.age === "toddler" ? 1.72 : x.age === "old" ? 1.6 : 1.95);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const thru = (Pp) => { let d = ""; for (let i = 1; i < Pp.length - 1; i++) d += Q(Pp[i], i === Pp.length - 2 ? Pp[i + 1] : [(Pp[i][0] + Pp[i + 1][0]) / 2, (Pp[i][1] + Pp[i + 1][1]) / 2]); return d; };
  const pl = (a, y) => { for (let i = 1; i < a.length; i++) if (y <= a[i][0] || i === a.length - 1) { const t = Math.max(0, Math.min(1, (y - a[i - 1][0]) / ((a[i][0] - a[i - 1][0]) || 1))); return a[i - 1][1] + (a[i][1] - a[i - 1][1]) * t; } return a[0][1]; };
  
  function tips(a, b, k, n) {
    const tp = n === 2 ? [[.25, 3.2], [.5, -2.4], [.75, 2.4]] : [[.17, 3.5], [.36, -2.6], [.52, 4.6], [.68, -2.4], [.84, 2.6]];
    let d = "", prev = a;
    tp.forEach(([t, dy]) => { const p = lerp(a, b, t), y = p[1] + dy * k; d += Q([(prev[0] + p[0]) / 2, Math.max(prev[1], y) + (dy > 0 ? .4 : -.6) * k], [p[0], y]); prev = [p[0], y]; });
    return d + Q([(prev[0] + b[0]) / 2, Math.max(prev[1], b[1]) + .4 * k], b);
  }
  function longLocks(x, cx, top, hh, w, cfg) {
    const hp = x.hp, k = hh / 36, sh = x._sh || top + hh + 9, nk = x.b.Nk, chin = top + hh, ey = top + hh * .56;
    const yb = top + hh * cfg.len, wave = (cfg.wave || 0) * k, vol = (cfg.wave || 0) * .9, y0 = top + hh * .3, N2 = 8;
    const gx = cfg.curl ? 5 : cfg.wave ? 1.6 : 0, outer = [[y0, w + 1.6], [top + hh * .62, w + 2.8 + vol * .5], [chin, w + 3.6 + vol], [Math.max(sh, chin + 2), w + 5 + vol + gx * .6], [yb, w + 4.6 + vol + gx]];
    const inner = [[ey - 2 * k, w - 1.8], [top + hh * .8, w * .9], [chin, nk + 3.6], [Math.max(sh, chin + 2), nk + 2.6], [yb, nk + 4]];
    const wv = (y) => { const t = Math.max(0, (y - y0) / (yb - y0)); return wave * Math.sin(t * Math.PI * (cfg.curl ? 3.6 : 2.6)) * Math.pow(t, .6); };
    let front = "", back = "";
    const side = (sd) => {
      const O = [], I = [];
      for (let i = 0; i <= N2; i++) { const yo = y0 + (yb - 2 * k - y0) * i / N2, yi = ey - 2 * k + (yb - k - (ey - 2 * k)) * i / N2;
        O.push([cx + sd * (pl(outer, yo) + wv(yo)), yo]); I.push([cx + sd * (pl(inner, yi) + wv(yi)), yi]); }
      const d = M(O[0]) + thru(O) + tips(O[N2], I[N2], k) + thru(I.slice().reverse()) + "Z";
      const SH = I.map((p, i) => lerp(p, O[i], sd > 0 ? .55 : .28));
      const shd = M(I[0]) + thru(I) + L(SH[N2]) + thru(SH.slice().reverse()) + "Z";
      let s = part(x, d, hp.m, shd, hp.d, OW);
      [[.36, 1], [.68, 1]].forEach(([fr]) => { const C2 = O.map((p, i) => lerp(p, I[i], fr)).slice(1); C2[C2.length - 1] = [C2[C2.length - 1][0], C2[C2.length - 1][1] - 2.4 * k]; s += line(M(C2[0]) + thru(C2), .75, OL, .6); });
      const H = O.map((p, i) => lerp(p, I[i], .2)).slice(0, 5);
      s += line(M(H[0]) + thru(H), 1.2 * k, hp.hl, sd < 0 ? .85 : .4);
      if (cfg.curl) for (let i = 2; i < N2; i += 1) { const p = lerp(O[i], I[i], i % 2 ? .3 : .62); s += `<path d="M${f(p[0] - 1.4 * k)} ${f(p[1] + .5)}a${f(1.5 * k)} ${f(1.5 * k)} 0 1 1 ${f(2.5 * k)} -.5" fill="none" stroke="${i % 3 ? hp.d : hp.hl}" stroke-width=".7" stroke-linecap="round"/>`; }
      return { s, O, I };
    };
    const Lf = side(-1), Rt = side(1);
    front = Lf.s + Rt.s;
    
    const BO = (sd) => { const P2 = []; for (let i = 0; i <= N2; i++) { const y = top + hh * .25 + (yb - 3 * k - top - hh * .25) * i / N2; P2.push([cx + sd * (pl(outer, y) + 1.8 + wv(y) * .6), y]); } return P2; };
    const bl = BO(-1), br = BO(1), il = [cx - nk - 1, yb - 4 * k], ir = [cx + nk + 1, yb - 4 * k];
    back = part(x, M(bl[0]) + thru(bl) + tips(bl[N2], il, k, 2) + L(ir) + tips(ir, br[N2], k, 2) + thru(br.slice().reverse()) + C([cx + w * .9, top - 4 * k], [cx - w * .9, top - 4 * k], bl[0]) + "Z", hp.d, null, null, OW);
    return { front, back };
  }
  
  function femCap(x, cx, top, hh, w, kind, lift) {
    const k = hh / 36, Pt = (u, a, v) => [cx + u * w + a * k, top + v * hh], pu = kind === "center" ? 0 : -.36, lt = lift == null ? 1.6 : lift;
    const line2 = kind === "center" ? [Pt(1, -1.4, .5), Pt(.72, 0, .32), Pt(.3, 0, .2), Pt(0, 0, .17), Pt(-.3, 0, .2), Pt(-.72, 0, .32), Pt(-1, 1.4, .5)]
      : [Pt(1, -1.4, .5), Pt(.74, 0, .34), Pt(.3, 0, .22), Pt(pu, 0, .17), Pt(-.64, 0, .24), Pt(-1, 1.4, .5)];
    const sweep = (u0, u1, v0) => [Pt(u0, 0, v0), Pt((u0 + u1) / 2, 0, v0 + .02), Pt(u1, 0, .34)];
    return shortMass(x, cx, top, hh, w, { sb: .5, th: (s) => 1 + lt * bump(s, pu * .5, 1.1), n: 10, line: line2, noBand: 1,
      cl: [sweep(pu + .08, .92, .06), sweep(pu + .1, .7, .14), sweep(pu - .06, -.92, .08)],
      hi: [[Pt(pu - .1, 0, .02), Pt(-.5, 0, .1), Pt(-.8, 0, .3)], [Pt(pu + .2, 0, .02), Pt(.45, 0, .08)]],
      extra: line(M(Pt(pu, 0, .17)) + Q(Pt(pu - .02, 0, .06), Pt(pu + .04, 0, -.06)), .9) });
  }
  function hairBack(x, cx, top, hh, w) {
    const st = x.hair, hp = x.hp, k = hh / 36, chin = top + hh;
    if (LONG[st]) return longLocks(x, cx, top, hh, w, Object.assign({ len: lenFor(x, st) }, LONG[st])).back;
    if (st === "bob") return part(x, M([cx - w - 1.4, top + hh * .4]) + C([cx - w - 5, top + hh * .7], [cx - w - 5.5, chin], [cx - w - 3, chin + 2.6 * k]) + L([cx + w + 3, chin + 2.6 * k]) + C([cx + w + 5.5, chin], [cx + w + 5, top + hh * .7], [cx + w + 1.4, top + hh * .4]) + "Z", hp.d, null, null, OW);
    if (st === "fpony") {
      
      const t0 = [cx + w * .1, top - 2 * k], ob = [cx + w + 5.6 * k, top + hh * 1.45], ib = [cx + w + 1 * k, top + hh * 1.32];
      const d = M([t0[0] - 3 * k, t0[1]]) + C([cx + w * .6, top - 9 * k], [cx + w + 10 * k, top + hh * .1], [cx + w + 8 * k, top + hh * .7]) + Q([cx + w + 8 * k, top + hh * 1.1], ob) + tips(ob, ib, k, 2) +
        Q([cx + w + 2.4 * k, top + hh * .8], [cx + w * .7, top + hh * .2]) + Q([cx + w * .4, top - 1], [t0[0] + 3 * k, t0[1] + 1]) + "Z";
      return partL(x, d, hp.m, `<path d="${M([cx + w + 2 * k, top - 10]) + L([cx + w + 30, top - 10]) + L([cx + w + 30, top + hh * 2]) + L([cx + w + 2 * k, top + hh * 2])}Z" fill="${hp.d}"/>` +
        line(M([cx + w * .5, top - 4 * k]) + Q([cx + w + 6 * k, top + hh * .1], [cx + w + 5 * k, top + hh * 1.2]), .75, OL, .55) + line(M([cx + w * .3, top - 5 * k]) + Q([cx + w + 4 * k, top - 3 * k], [cx + w + 6.4 * k, top + hh * .5]), 1.2 * k, hp.hl, .7));
    }
    if (st === "fbun") { const bx = cx, by = top - 4.6 * k;
      return partL(x, `M${f(bx - 7.2 * k)} ${f(by)}a${f(7.2 * k)} ${f(6 * k)} 0 1 1 ${f(14.4 * k)} 0a${f(7.2 * k)} ${f(6 * k)} 0 1 1 ${f(-14.4 * k)} 0Z`, hp.m,
        `<path d="M${f(bx + 2 * k)} ${f(by - 9 * k)}h${f(10 * k)}v${f(16 * k)}h${f(-10 * k)}Z" fill="${hp.d}"/>` + line(M([bx - 5 * k, by - 1.6 * k]) + Q([bx, by - 5.6 * k], [bx + 5 * k, by - 2 * k]) + M([bx - 4 * k, by + 1.8 * k]) + Q([bx + .5, by - 1.6 * k], [bx + 5.4 * k, by + .6 * k]) + M([bx - 6 * k, by + .4 * k]) + Q([bx - 3 * k, by + 4 * k], [bx + 3 * k, by + 4.4 * k]), .7, OL, .6) +
        line(M([bx - 5 * k, by - 3 * k]) + Q([bx - 2 * k, by - 5.4 * k], [bx + 1.4 * k, by - 5.6 * k]), 1.2 * k, hp.hl, .8)); }
    if (st === "perm" || st === "braids" || st === "pigtails" || st === "tuft" || st === "fuzz" || st === "pixie" || st === "updo") return "";
    return shortBack(x, cx, top, hh, w);
  }
  
  function braid(x, x0, y0, x1, y1, k, n) {
    const hp = x.hp; let g = "";
    const P2 = (t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t], seg = (y1 - y0) / n;
    const tipY = y1 + seg * .3, bx = x1;
    g += part(x, M([bx - 1.4 * k, y1]) + L([bx - 2.6 * k, tipY + 3.6 * k]) + L([bx - .8 * k, tipY + 2 * k]) + L([bx + .2 * k, tipY + 4 * k]) + L([bx + 1.4 * k, tipY + 1.8 * k]) + L([bx + 2.6 * k, tipY + 3.2 * k]) + L([bx + 1.6 * k, y1]) + "Z", hp.m, null, null, IW);
    for (let i = n - 1; i >= 0; i--) {
      const t = (i + .5) / n, c = P2(t), wd = (4.8 - 1.6 * t) * k, sd = i % 2 ? 1 : -1;
      
      const a = [c[0] - sd * wd, c[1] - seg * .9], b = [c[0] + sd * wd * .85, c[1] + seg * .7];
      const d = M(a) + Q([c[0] + sd * wd * 1.3, c[1] - seg * .4], b) + Q([c[0] - sd * wd * 1.1, c[1] + seg * .2], a) + "Z";
      g += part(x, d, hp.m, sd > 0 ? `M${f(c[0])} ${f(c[1] - seg)}h20v${f(seg * 2)}h-20Z` : `M${f(c[0] - 20)} ${f(c[1] + seg * .05)}h40v${f(seg)}h-40Z`, hp.d, IW) +
        line(M(lerp(a, b, .25)) + Q([c[0] + sd * wd * .3, c[1] - seg * .2], lerp(a, b, .7)), .8 * k, hp.hl, .7);
    }
    g += part(x, rr(bx - 2.2 * k, y1 - .4 * k, 4.4 * k, 2.2 * k, .9), x.su.m, null, null, .7);
    return g;
  }
  function hairFront(x, cx, top, hh, w) {
    const st = x.hair, hp = x.hp, k = hh / 36, chin = top + hh, Pt = (u, a, v) => [cx + u * w + a * k, top + v * hh];
    if (LONG[st]) {
      const Lk = longLocks(x, cx, top, hh, w, Object.assign({ len: lenFor(x, st) }, LONG[st]));
      return Lk.front + femCap(x, cx, top, hh, w, st === "fwavy" ? "side" : "center", st === "fcurly" ? 3.4 : st === "fwavy" ? 2.6 : 1.4);
    }
    if (st === "bob") {
      let g = "";
      [-1, 1].forEach((sd) => { const d = M([cx + sd * (w + 1.2), top + hh * .36]) + C([cx + sd * (w + 4.4), top + hh * .66], [cx + sd * (w + 5), chin - 2], [cx + sd * (w + 3.2), chin + 2.4 * k]) +
          Q([cx + sd * (w * .9), chin + 3.8 * k], [cx + sd * (w * .64), chin + .4]) + Q([cx + sd * (w * .9), top + hh * .8], [cx + sd * (w - 1.4), top + hh * .5]) + "Z";
        g += partL(x, d, hp.m, `<path d="${M([cx + sd * (w * .64), top]) + L([cx + sd * (w * .95), top]) + L([cx + sd * (w * .95), chin + 6]) + L([cx + sd * (w * .64), chin + 6])}Z" fill="${hp.d}"/>` + (sd > 0 ? `<path d="${M([cx + w + 3.6 * k, top]) + L([cx + w + 12, top]) + L([cx + w + 12, chin + 6]) + L([cx + w + 3.6 * k, chin + 6])}Z" fill="${hp.d}"/>` : "") +
          line(M([cx + sd * (w + 1.6), top + hh * .5]) + Q([cx + sd * (w + 3.4), top + hh * .8], [cx + sd * (w + 1.8), chin + 2]), .75, OL, .6) +
          line(M([cx + sd * (w + 2.6), top + hh * .45]) + Q([cx + sd * (w + 4.2), top + hh * .7], [cx + sd * (w + 3.6), chin - 2]), 1.1 * k, hp.hl, sd < 0 ? .85 : .4), OW); });
      
      const bang = [Pt(1, -1.2, .48), Pt(.75, 0, .41), Pt(.25, 0, .42), Pt(-.25, 0, .42), Pt(-.75, 0, .41), Pt(-1, 1.2, .48)];
      let tx = ""; for (let i = 1; i < 7; i++) { const u = -1 + i * 2 / 7; tx += line(M(Pt(u, 0, .18)) + L(Pt(u * 1.02, 0, .39)), .6, OL, .45); }
      return g + shortMass(x, cx, top, hh, w, { sb: .5, th: (s) => 1.2 + 2.6 * bump(s, 0, 1), n: 10, line: bang, lineZ: { n: 2, d: .7, s: () => 0 }, noBand: 1, extra: tx,
        hi: [[Pt(-.6, 0, .12), Pt(-.25, 0, -.02), Pt(.2, 0, -.02)]] });
    }
    if (st === "pixie") return shortMass(x, cx, top, hh, w, { sb: .62, fade: .15, th: (s) => 1.2 + 4.2 * bump(s, -.1, .75), n: 10,
      
      line: [Pt(1, -1.6, .44), Pt(.78, 0, .42), Pt(.4, 0, .36), Pt(0, 0, .3), Pt(-.36, 0, .24), Pt(-.7, 0, .3), Pt(-1, 1.6, .42)], lineZ: { n: 1, d: 2.6, s: (u) => u > -.36 ? 2.2 : -1 },
      cl: [[Pt(-.4, 0, .1), Pt(0, 0, .14), Pt(.4, 0, .28), Pt(.74, 0, .42)], [Pt(-.3, 0, .0), Pt(.2, 0, .04), Pt(.6, 0, .18), Pt(.92, 0, .36)], [Pt(-.5, 0, .14), Pt(-.8, 0, .24)]],
      hi: [[Pt(-.3, 0, .08), Pt(.05, 0, .06), Pt(.35, 0, .16)], [Pt(-.55, 0, .04), Pt(-.75, 0, .14)]] });
    if (st === "perm") { let tx = ""; for (let i = 0; i < 30; i++) { const u = ((i * 41) % 100) / 100 * 2.1 - 1.05, v = ((i * 67) % 100) / 100 * .62 - .14, p = Pt(u, 0, v), r = 1.6 * k;
        tx += `<path d="M${f(p[0] - r)} ${f(p[1] + .4)}a${f(r)} ${f(r)} 0 1 1 ${f(r * 1.6)} ${f(-.4 * r)}" fill="none" stroke="${i % 4 ? hp.d : hp.hl}" stroke-width="${i % 4 ? .8 : 1}" stroke-linecap="round"/>`; }
      return shortMass(x, cx, top, hh, w, { sb: .7, fade: 0, th: (s) => 3 + 4.4 * bump(s, 0, 1), n: 10, topZ: { n: 1, d: 1.4, round: true, fall: 0 },
        line: [Pt(1, -2, .5), Pt(.62, 0, .32), Pt(0, 0, .3), Pt(-.62, 0, .32), Pt(-1, 2, .5)], lineZ: { n: 2, d: 1.3, round: true }, extra: tx }); }
    if (st === "fbun" || st === "fpony" || st === "updo") {
      const up = st === "updo", T = st === "fbun" ? Pt(0, 0, -.14) : st === "fpony" ? Pt(.1, 0, -.08) : Pt(.25, 0, -.2);
      const cl = [-.84, -.56, -.28, 0, .28, .56, .84].map((u) => { const a = Pt(u, 0, .3 + Math.abs(u) * .1); return [a, [a[0] * .5 + T[0] * .5, a[1] * .4 + T[1] * .6], T]; });
      let g = shortMass(x, cx, top, hh, w, { sb: .52, th: (s) => 1 + (up ? 4.4 : 1) * bump(s, up ? .15 : 0, .95), n: 10,
        line: [Pt(1, -1.5, .44), Pt(.72, 0, .31), Pt(.35, 0, .26), Pt(0, 0, .25), Pt(-.35, 0, .26), Pt(-.72, 0, .31), Pt(-1, 1.5, .44)],
        cl, hi: [[Pt(-.55, 0, .16), Pt(-.4, 0, .0), Pt(-.1, 0, -.06)]] });
      if (st === "fpony") g += part(x, `M${f(cx + w * .1 - 3 * k)} ${f(top - 2 * k)}a${f(3 * k)} ${f(2.2 * k)} 0 1 1 ${f(6 * k)} 0a${f(3 * k)} ${f(2.2 * k)} 0 1 1 ${f(-6 * k)} 0Z`, x.su.m, null, null, .8);
      if (st === "fbun") g += part(x, rr(cx - 4.4 * k, top - 1.6 * k, 8.8 * k, 2.4 * k, 1), x.su.m, null, null, .7);
      
      if (up) [-1, 1].forEach((sd) => { const d = M(Pt(sd, -1.4 * sd, .4)) + Q(Pt(sd, .6 * sd, .6), Pt(sd, -.6 * sd, .8)) + Q(Pt(sd, .2 * sd, .9), Pt(sd, -.4 * sd, .98)); g += line(d, 1.9 * k, OL) + line(d, 1.1 * k, hp.m); });
      return g;
    }
    if (st === "braids" || st === "pigtails") {
      let g = "";
      const yb = top + hh * (st === "braids" ? lenFor(x, "fstraight") : (x.age === "toddler" ? 1.15 : 1.3));
      if (st === "pigtails") [-1, 1].forEach((sd) => {
        
        const t0 = Pt(sd, 1.4 * sd, .3), ob = [cx + sd * (w + 7.6 * k), yb], ib = [cx + sd * (w + 1.6 * k), yb - 2 * k];
        const d = M([t0[0] - sd * 1.6 * k, t0[1] - 1.6 * k]) + C([cx + sd * (w + 7 * k), top + hh * .2], [cx + sd * (w + 8.6 * k), top + hh * .7], ob) + tips(ob, ib, k, 2) + Q([cx + sd * (w + 1.4 * k), top + hh * .7], [t0[0] - sd * 1.2 * k, t0[1] + 2 * k]) + "Z";
        g += partL(x, d, hp.m, `<path d="${M([cx + sd * (w + 1 * k), top + hh * .36]) + L([cx + sd * (w + 2.6 * k), yb + 5]) + L([cx + sd * (w + 1 * k), yb + 5])}Z" fill="${hp.d}"/>` + (sd > 0 ? `<path d="${M([cx + w + 5 * k, top]) + L([cx + w + 20, top]) + L([cx + w + 20, yb + 5]) + L([cx + w + 5 * k, yb + 5])}Z" fill="${hp.d}"/>` : "") +
          line(M([cx + sd * (w + 3.4 * k), top + hh * .45]) + Q([cx + sd * (w + 5.6 * k), top + hh * .8], [cx + sd * (w + 5 * k), yb - 2]), .75, OL, .6) +
          line(M([cx + sd * (w + 3 * k), top + hh * .36]) + Q([cx + sd * (w + 6 * k), top + hh * .5], [cx + sd * (w + 6.6 * k), top + hh * .9]), 1.1 * k, hp.hl, sd < 0 ? .85 : .45)); });
      g += femCap(x, cx, top, hh, w, "center", 1.2);
      if (st === "pigtails") [-1, 1].forEach((sd) => { const t0 = Pt(sd, 1.4 * sd, .3); g += `<ellipse cx="${f(t0[0])}" cy="${f(t0[1])}" rx="${f(1.7 * k)}" ry="${f(2.7 * k)}" fill="${x.su.m}" stroke="${OL}" stroke-width=".8"/>`; });
      else [-1, 1].forEach((sd) => {
        
        g += partL(x, M(Pt(sd, 1.2 * sd, .44)) + Q(Pt(sd, 2.4 * sd, .66), Pt(sd, 2.2 * sd, .8)) + L(Pt(sd, -1.4 * sd, .8)) + Q(Pt(sd, -1.2 * sd, .6), Pt(sd, -.6 * sd, .44)) + "Z", hp.m, sd > 0 ? `<path d="${M(Pt(1, -1, .4)) + L(Pt(1, 9, .4)) + L(Pt(1, 9, .9)) + L(Pt(1, -1, .9))}Z" fill="${hp.d}"/>` : "", IW);
        g += braid(x, cx + sd * (w + 1 * k), top + hh * .78, cx + sd * (w + 3.4 * k), yb, k, 7);
      });
      return g;
    }
    if (st === "tuft" || st === "fuzz") {
      const cap = capPath(cx, top, hh, w, .4, .27);
      let g = `<path d="${cap}" fill="${hp.m}" opacity="${st === "fuzz" ? .5 : .32}"/><path d="${cap}" fill="none" stroke="${OL}" stroke-width=".5" stroke-opacity=".45"/>`;
      if (st === "tuft") { const d = M([cx - 1, top + 1.4]) + C([cx - 2.6 * k, top - 5 * k], [cx + 4 * k, top - 8 * k], [cx + 4.8 * k, top - 3.4 * k]) + C([cx + 5 * k, top - .6 * k], [cx + 1.6 * k, top - .6 * k], [cx + 2 * k, top - 2.8 * k]); g += line(d, 2.8 * k, OL) + line(d, 1.6 * k, hp.m) + line(M([cx - .6, top - 1.4 * k]) + Q([cx + .6 * k, top - 4.6 * k], [cx + 3 * k, top - 5.2 * k]), .6 * k, hp.hl, .8); }
      return g + `<path d="M${f(cx - w * .5)} ${f(top + hh * .12)}Q${f(cx - w * .1)} ${f(top + 1.2)} ${f(cx + w * .25)} ${f(top + 1.8)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f(1.3 * k)}" stroke-linecap="round"/>`;
    }
    return shortHair(x, cx, top, hh, w, st);
  }
  
  function beanie(x, cx, top, hh, w) {
    const k = hh / 36, su = x.su, h = N(), cu = h.mix(su.m, "#ffffff", .55);
    const dome = M([cx - w - 1.8, top + hh * .36]) + C([cx - w - 2.4, top - 2 * k], [cx - w * .6, top - 6.4 * k], [cx, top - 6.4 * k]) + C([cx + w * .6, top - 6.4 * k], [cx + w + 2.4, top - 2 * k], [cx + w + 1.8, top + hh * .36]) + "Z";
    let g = part(x, dome, su.m, M([cx + w * .25, top - 12]) + L([cx + w + 8, top - 12]) + L([cx + w + 8, top + hh * .4]) + L([cx + w * .25, top + hh * .4]) + "Z", su.d, OW);
    for (let i = -3; i <= 3; i++) g += line(M([cx + i * w * .26, top + hh * .2]) + Q([cx + i * w * .3, top - 1], [cx + i * w * .12, top - 5.4 * k]), .55, su.k, .6);
    const cuff = M([cx - w - 2.4, top + hh * .2]) + Q([cx, top + hh * .12], [cx + w + 2.4, top + hh * .2]) + L([cx + w + 2.2, top + hh * .4]) + Q([cx, top + hh * .33], [cx - w - 2.2, top + hh * .4]) + "Z";
    g += part(x, cuff, cu, M([cx + w * .3, top]) + L([cx + w + 8, top]) + L([cx + w + 8, top + hh * .5]) + L([cx + w * .3, top + hh * .5]) + "Z", h.shade(cu, -.18), OW);
    for (let i = -6; i <= 6; i++) g += line(M([cx + i * (w + 1.6) / 6.4, top + hh * .2 - (1 - Math.abs(i) / 7) * 1.6 * k]) + L([cx + i * (w + 1.6) / 6.4, top + hh * .37 - (1 - Math.abs(i) / 7) * 1.4 * k]), .5, h.shade(cu, -.35), .7);
    let pom = ""; const py = top - 7.6 * k, pr2 = 4 * k;
    for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI * 2, r = pr2 + (i % 2 ? .7 : 0) * k, p0 = [cx + Math.cos(a) * r, py + Math.sin(a) * r]; pom += i ? L(p0) : M(p0); }
    g += part(x, pom + "Z", cu, `M${f(cx + .6)} ${f(py - 6)}h8v12h-8Z`, h.shade(cu, -.18), IW);
    return g;
  }

  
  const BABYC = ["#9cc3e4", "#f2b8c6", "#f4e3a1", "#b9dcb4", "#e8e4dc", "#c9b6e4", "#6f8fbf"];
  const BLANKC = ["#f2e6c9", "#cfe3f1", "#f6d1da", "#d9e8c8", "#e6dcf2", "#f0c99a", "#b8c4d6"];
  const BHAIRC = [["brown", "Brown", "#6b4226"], ["dark", "Dark", "#2a1a10"], ["blond", "Blond", "#d4ac5a"], ["red", "Red", "#8a3a22"], ["black", "Black", "#141414"]];
  function babyFigure(x) {
    CL = 0;
    const cx = 100, su = x.su, sk = x.sk, h = N(), bl = { hl: h.shade(x.blank, .3), m: x.blank, d: h.shade(x.blank, -.22), k: h.shade(x.blank, -.4) };
    const shellC = "#40454e", shellD = "#2c3037", pad = "#dcd6ca", padD = "#bfb7a8", hh = x.pr.hh, top = 99, chin = top + hh;
    let back = "", body = "", front = "";
    back += `<ellipse cx="${cx + 1}" cy="187" rx="40" ry="3.2" fill="${x.url("cs")}"/>`;
    
    const hd = M([cx - 36, 148]) + C([cx - 38, 96], [cx - 20, 78], [cx, 78]) + C([cx + 20, 78], [cx + 38, 96], [cx + 36, 148]);
    back += line(hd, 7, OL) + line(hd, 4.6, "#4b5059") + line(M([cx - 33, 128]) + C([cx - 33, 96], [cx - 18, 81], [cx, 81]), 1, "#7d838d", .8);
    back += part(x, rr(cx - 11, 75, 22, 6.4, 3.2), "#26282d", null, null, IW);
    for (let i = -3; i <= 3; i++) back += line(M([cx + i * 2.6, 76.4]) + L([cx + i * 2.6, 79.8]), .6, "#4b5059");
    
    back += part(x, M([cx - 30, 176]) + L([cx - 31, 112]) + C([cx - 31, 90], [cx + 31, 90], [cx + 31, 112]) + L([cx + 30, 176]) + "Z", shellC, M([cx + 10, 80]) + L([cx + 40, 80]) + L([cx + 40, 180]) + L([cx + 10, 180]) + "Z", shellD);
    back += part(x, M([cx - 25, 172]) + L([cx - 25.5, 112]) + C([cx - 25, 96], [cx + 25, 96], [cx + 25.5, 112]) + L([cx + 25, 172]) + "Z", pad, M([cx + 12, 90]) + L([cx + 40, 90]) + L([cx + 40, 176]) + L([cx + 12, 176]) + "Z", padD, IW);
    back += line(M([cx - 25, 132]) + Q([cx - 17, 128], [cx - 16, 110]) + M([cx + 25, 132]) + Q([cx + 17, 128], [cx + 16, 110]), .8, padD) + line(M([cx - 12, 136]) + L([cx - 12, 168]) + M([cx + 12, 136]) + L([cx + 12, 168]), .6, padD, .8);
    
    const tor = M([cx - 11, 128]) + Q([cx - 15, 131], [cx - 15, 140]) + L([cx - 14, 160]) + L([cx + 14, 160]) + L([cx + 15, 140]) + Q([cx + 15, 131], [cx + 11, 128]) + Q([cx, 124.5], [cx - 11, 128]) + "Z";
    body += part(x, tor, su.m, M([cx + 5, 120]) + L([cx + 30, 120]) + L([cx + 30, 162]) + L([cx + 5, 162]) + "Z", su.d);
    body += line(M([cx - 6, 126.6]) + Q([cx, 129.4], [cx + 6, 126.6]), 1.4, su.hl) + line(M([cx - 6, 126.6]) + Q([cx, 129.4], [cx + 6, 126.6]), .6);
    [-1, 1].forEach((sd) => { const st = M([cx + sd * 7.5, 126]) + Q([cx + sd * 6.5, 140], [cx + sd * 2.6, 152]); body += line(st, 3.6, OL) + line(st, 2.4, "#2f333a"); });
    body += line(M([cx, 160]) + L([cx, 153]), 3.6, OL) + line(M([cx, 160]) + L([cx, 153]), 2.4, "#2f333a");
    body += part(x, rr(cx - 5.4, 136.4, 10.8, 3.6, 1.2), "#d0453a", null, null, .8) + part(x, rr(cx - 4.4, 150, 8.8, 6.4, 1.8), "#2a2c31", null, null, .9) + `<circle cx="${cx}" cy="153.2" r="1.5" fill="#d0453a"/>`;
    [-1, 1].forEach((sd) => {
      const ar = tube([[cx + sd * 12.4, 130.5, 3.8], [cx + sd * 16, 139, 3.4], [cx + sd * 14.4, 145, 3.1], [cx + sd * 10.6, 147.4, 2.9]]);
      body += part(x, ar, su.m, sd > 0 ? M([cx + 13, 126]) + L([cx + 30, 126]) + L([cx + 30, 152]) + L([cx + 13, 152]) + "Z" : null, su.d, IW);
      body += part(x, `M${f(cx + sd * 9.6 - 3.1)} 147.8a3.1 2.9 0 1 1 6.2 0a3.1 2.9 0 1 1 -6.2 0Z`, sk.m, sd > 0 ? `M${f(cx + sd * 9.6)} 146h5v6h-5Z` : null, sk.d, IW) + line(M([cx + sd * 9.6 - sd * 1.4, 146.4]) + Q([cx + sd * 9.6, 147.4], [cx + sd * 9.6 + sd * .6, 149.6]), .5, sk.k);
    });
    
    const bk = M([cx - 24, 155]) + Q([cx - 12, 151], [cx + 1, 154]) + Q([cx + 13, 150.6], [cx + 24, 155]) + L([cx + 26.4, 170]) + Q([cx + 27, 178], [cx + 20, 179]) + L([cx - 20, 179]) + Q([cx - 27, 178], [cx - 26.4, 170]) + "Z";
    front += part(x, bk, bl.m, M([cx + 8, 148]) + L([cx + 34, 148]) + L([cx + 34, 182]) + L([cx + 8, 182]) + "Z", bl.d);
    front += `<path d="M${f(cx - 22)} 157.4Q${f(cx - 11)} 153.8 ${f(cx + 1)} 156.6Q${f(cx + 12)} 153.4 ${f(cx + 22)} 157.4" fill="none" stroke="${bl.k}" stroke-width=".7" stroke-dasharray="1.6 1.4"/>`;
    front += line(M([cx - 9, 160]) + Q([cx - 11, 168], [cx - 8, 176]) + M([cx + 6, 159]) + Q([cx + 9, 168], [cx + 7, 176]), .8, bl.k, .7) + line(M([cx - 16, 160]) + Q([cx - 14, 166], [cx - 15, 172]), 1.2, bl.hl, .8);
    front += line(M([cx - 9, 166]) + q2(2.6, -2.2) + M([cx + 3.6, 166]) + q2(2.6, -2.2), .8, bl.k, .8);
    
    [-1, 1].forEach((sd) => { const d = M([cx + sd * 32, 118]) + Q([cx + sd * 36.4, 152], [cx + sd * 30, 178]) + L([cx + sd * 22, 180]) + Q([cx + sd * 26.4, 152], [cx + sd * 25.4, 122]) + "Z";
      front += part(x, d, shellC, sd > 0 ? M([cx + 20, 110]) + L([cx + 40, 110]) + L([cx + 40, 182]) + L([cx + 20, 182]) + "Z" : null, shellD) + line(M([cx + sd * 31, 122]) + Q([cx + sd * 34.6, 150], [cx + sd * 29.6, 172]), .8, "#6d737d", .8); });
    front += part(x, M([cx - 30, 171]) + Q([cx, 177], [cx + 30, 171]) + L([cx + 29, 181]) + Q([cx, 186.6], [cx - 29, 181]) + "Z", shellC, M([cx + 8, 168]) + L([cx + 34, 168]) + L([cx + 34, 188]) + L([cx + 8, 188]) + "Z", shellD);
    front += line(M([cx - 26, 174.6]) + Q([cx, 179.6], [cx + 26, 174.6]), 1, su.m, .9);
    front += part(x, rr(cx - 31, 181.6, 62, 4.8, 2.4), "#25272c", null, null, IW);
    [-1, 1].forEach((sd) => { front += `<circle cx="${f(cx + sd * 34)}" cy="146" r="3.8" fill="#6d737d" stroke="${OL}" stroke-width="${IW}"/><circle cx="${f(cx + sd * 34)}" cy="146" r="1.5" fill="#3a3e45"/>`; });
    const head = headDraw(x, cx, top, hh, null);
    return { top, chin, belt: 156, hh, topAll: 75, back: back + hairBack(x, cx, top, hh, headW(x)), body, head, front };
  }

  
  const GLASSES = [["none", "None"], ["rect", "Rectangle (black)"], ["round", "Round (tortoise)"], ["browline", "Browline (black and gold)"], ["cat", "Cat-eye (plum)"], ["sun", "Sunglasses"]];
  const MOB = [["none", "None"], ["cane", "Cane"], ["walker", "Walker"], ["wheel", "Wheelchair"]];
  const VIEWS = [["full", "Full body"], ["face", "Face"], ["portrait", "Portrait"], ["half", "Half body"]];
  const HAIR_F = [["fstraight", "Long straight"], ["fwavy", "Long wavy"], ["bob", "Bob with bangs"], ["pixie", "Pixie"], ["fbun", "Top bun"], ["fpony", "Ponytail"], ["braids", "Braids"], ["fcurly", "Long curly"], ["afro", "Afro"], ["updo", "Updo (twist)"]];
  const HAIR_OF = [["perm", "Short curls"], ["bob", "Bob with bangs"], ["pixie", "Pixie"], ["fbun", "Bun"], ["updo", "Updo (twist)"], ["fstraight", "Shoulder length"], ["afro", "Afro"]];
  const HAIR_OM = [["receding", "Receding"], ["side", "Short side part"], ["crew", "Crew cut"], ["slick", "Slicked back"], ["buzz", "Buzz"], ["curly", "Curly short"], ["bald", "Bald"]];
  const HAIR_TB = HAIR_M.filter((a) => a[0] !== "receding" && a[0] !== "bald");
  const HAIR_KB = [["messy", "Messy"], ["side", "Side part"], ["crew", "Crew cut"], ["buzz", "Buzz"], ["curly", "Curly"], ["afro", "Afro"]];
  const HAIR_KG = [["pigtails", "Pigtails"], ["fpony", "Ponytail"], ["bob", "Bob with bangs"], ["braids", "Braids"], ["fstraight", "Long straight"], ["fcurly", "Long curly"], ["afro", "Afro"], ["fbun", "Top bun"]];
  const HAIR_TOD = [["tuft", "Little tuft"], ["crew", "Short crop"], ["buzz", "Buzz"], ["messy", "Messy"], ["curly", "Short curly"], ["side", "Side part"], ["spiky", "Spiky top"], ["afro", "Little afro"], ["pigtails", "Pigtails"], ["bob", "Bob with bangs"]];
  const HAIR_BABY = [["tuft", "Little tuft"], ["fuzz", "Soft fuzz"], ["bald", "Bald"], ["curly", "Curls"]];
  const GRAY = ["#b8b6b0", "#eeece6", "#c9ccd2"].concat(HAIRC.filter((c) => c !== "#b8b6b0"));
  const cfirst = (all, c) => [c].concat(all.filter((v) => v !== c));
  
  const CARDS = [
    { id: "man", name: "Adult man", pre: "man", out: OUT_M, hair: HAIR_M, d: { outfit: "business", hair: "side", c: "#3b3e46", h: "#6b4226", skin: "s2" }, mob: 1, build: 1, facial: 1, height: 1 },
    { id: "woman", name: "Adult woman", pre: "woman", out: OUT_F, hair: HAIR_F, d: { outfit: "f_bizcas", hair: "fwavy", c: "#c65b7c", h: "#6b4226", skin: "s3" }, mob: 1, build: 1, height: 1 },
    { id: "oldman", name: "Older man", pre: "oldman", out: OUT_M, hair: HAIR_OM, d: { outfit: "bizcas", hair: "receding", c: "#6b6f78", h: "#b8b6b0", skin: "s2", glasses: "browline" }, mob: 1, build: 1, facial: 1, height: 1, gray: 1 },
    { id: "oldwoman", name: "Older woman", pre: "oldwoman", out: OUT_F, hair: HAIR_OF, d: { outfit: "f_bizcas", hair: "perm", c: "#2e4a3c", h: "#b8b6b0", skin: "s4", glasses: "round" }, mob: 1, build: 1, height: 1, gray: 1 },
    { id: "teenboy", name: "Teen boy", pre: "teenboy", out: OUT_M, hair: HAIR_TB, d: { outfit: "hoodie", hair: "messy", c: "#2c3d5e", h: "#2a1a10", skin: "s5" }, build: 1, height: 1 },
    { id: "teengirl", name: "Teen girl", pre: "teengirl", out: OUT_F, hair: HAIR_F, d: { outfit: "f_casual", hair: "fpony", c: "#d39a2a", h: "#9a6430", skin: "s1" }, build: 1, height: 1 },
    { id: "boy", name: "Young boy", pre: "boy", out: OUT_KB, hair: HAIR_KB, d: { outfit: "k_play", hair: "messy", c: "#7a2e2e", h: "#d4ac5a", skin: "s2" }, height: 1 },
    { id: "girl", name: "Young girl", pre: "girl", out: OUT_KG, hair: HAIR_KG, d: { outfit: "k_playg", hair: "pigtails", c: "#c65b7c", h: "#6b4226", skin: "s4" }, height: 1 },
    { id: "toddler", name: "Toddler", pre: "toddler", out: OUT_T, hair: HAIR_TOD, d: { outfit: "t_overalls", hair: "tuft", c: "#2c3d5e", h: "#9a6430", skin: "s3" } },
    { id: "baby", name: "Baby", pre: "baby", baby: 1, hair: HAIR_BABY, d: { hair: "tuft", c: BABYC[0], h: BLANKC[0], skin: "s2" } },
  ];
  
  function zoom(fg, x, view, topExt, wide) {
    const hh = fg.hh, ey = fg.top + hh * (x.age === "kid" || x.age === "toddler" || x.age === "baby" ? .6 : .56), ex = 99.6;
    if (view === "face") { const yb = fg.chin + (x.facial === "full" ? 9 : x.facial === "short" || x.facial === "goatee" ? 4.5 : 3), k = Math.min(176 / (yb - topExt + 4), 178 / wide); return { k, tx: 100 - k * ex, ty: 12 - k * (topExt - 2) }; }
    if (view === "portrait") { const k = Math.min(2.7, (80 - 13) / (ey - topExt + 2), 180 / (wide + 26)); return { k, tx: 100 - k * ex, ty: 80 - k * ey }; }
    if (view === "half") { const k = Math.min(176 / (fg.belt + 12 - topExt + 3), 3); return { k, tx: 100 - k * ex, ty: 12 - k * (topExt - 3) }; }
    const tA = Math.min(topExt, fg.topAll || topExt);
    let k = tA < 13 ? (186 - 13) / (186 - tA) : 1;
    if (x.age === "kid" || x.age === "toddler" || x.age === "baby" || x.mob === "wheel") k = Math.max(k, Math.min(1.8, (186 - 22) / (186 - tA)));
    return { k, tx: 100 - 100 * k, ty: 187 - 187 * k };
  }
  function makeCard(cd) {
    const opts = [{ id: "view", name: "View", values: VIEWS }];
    if (cd.out) opts.push({ id: "outfit", name: "Outfit", values: first(cd.out, cd.d.outfit) });
    if (cd.mob) opts.push({ id: "mobility", name: "Mobility", values: MOB });
    if (cd.height) opts.push({ id: "height", name: "Height", values: HEIGHTS });
    if (cd.build) opts.push({ id: "build", name: "Build", values: BUILDS });
    opts.push({ id: "hair", name: "Hair", values: first(cd.hair, cd.d.hair) });
    if (cd.baby) opts.push({ id: "hairc", name: "Hair color", values: BHAIRC.map((a) => [a[0], a[1]]) }, { id: "eyes", name: "Eyes", values: [["awake", "Awake"], ["asleep", "Asleep"]] });
    if (cd.facial) opts.push({ id: "facial", name: "Facial hair", values: FACIAL });
    if (!cd.baby) opts.push({ id: "glasses", name: "Glasses", values: first(GLASSES, cd.d.glasses || "none") });
    opts.push({ id: "skin", name: "Skin tone", values: first(SKINS.map((s) => [s[0], s[1]]), cd.d.skin) }, { id: "zone", name: "Zone", values: ZONES });
    const hairOk = {}; cd.hair.forEach((a) => { hairOk[a[0]] = 1; });
    const outOk = {}; (cd.out || []).forEach((a) => { outOk[a[0]] = 1; });
    const build = (o) => {
      const opt = Object.assign({}, o.opt || {});
      if (!hairOk[opt.hair]) delete opt.hair;
      if (!outOk[opt.outfit]) delete opt.outfit;
      if (!cd.mob) delete opt.mobility;
      if (!cd.build) delete opt.build;
      if (!cd.height) delete opt.height;
      if (cd.d.glasses && !opt.glasses) opt.glasses = cd.d.glasses;
      const x = ctx(Object.assign({}, o, { opt }), cd.pre, cd.d);
      if (cd.baby) { const hc = (BHAIRC.find((a) => a[0] === opt.hairc) || BHAIRC[0])[2], h = N();
        x.hc = hc; x.hp = { hl: h.shade(hc, .4), m: hc, d: h.shade(hc, -.35) }; x.blank = o.color2 || cd.d.h; x.asleep = opt.eyes === "asleep"; x.glasses = "none"; }
      const fg = cd.baby ? babyFigure(x) : figure(x);
      if (!fg.hh) fg.hh = x.pr.hh;
      const of = OF[x.outfit] || {}, view = opt.view || "full";
      const topExt = fg.top - Math.max(HAIR_TOP[x.hair] || 0, of.hat && !cd.baby ? 9 * x.pr.hh / 36 : 0);
      const wide = 2 * (headW(x) + 4 + (HAIR_W[x.hair] || 0) * x.pr.hh / 36) + 4;
      return { x, fg, view, topExt, z: zoom(fg, x, view, topExt, wide) };
    };
    return {
      id: cd.id, name: cd.name, colors: cd.baby ? BABYC : cfirst(CLO, cd.d.c), picker: true, colorLabel: cd.baby ? "Onesie" : "Clothes",
      colors2: cd.baby ? BLANKC : (cd.gray ? GRAY : cfirst(HAIRC, cd.d.h)), picker2: true, colorLabel2: cd.baby ? "Blanket" : "Hair",
      options: opts,
      render(o) {
        const { x, fg, view, z } = build(o);
        let person;
        if (cd.baby) person = `${fg.back}<g class="${P}breathe">${fg.body}${fg.head}</g>${fg.front}`;
        else { const R = `rotate(-1.6 100 ${f(fg.belt)})`;
          person = `${fg.back}<g transform="${R}">${fg.hairBehind}</g><g transform="translate(-2 0)">${fg.legs}</g><g class="${P}breathe"><g transform="${R}">${fg.upper}${fg.arms}${fg.head}</g></g>`; }
        let scene = backdrop(x, 168) + (x.zone === "away" ? `<g opacity=".42">${person}</g>` : person);
        if (Math.abs(z.k - 1) > .001) {
          
          scene = scene.replace(/stroke-width="([\d.]+)"/g, (m, v) => `stroke-width="${(v / z.k).toFixed(3)}"`);
          scene = `<g transform="translate(${f(z.tx)} ${f(z.ty)}) scale(${z.k.toFixed(4)})">${scene}</g>`;
        }
        return svg(x, scene + badge(x));
      },
      
      fitTop(o) { const { fg, view, topExt, z } = build(o); const t = view === "full" ? Math.min(topExt, fg.topAll || topExt) : topExt; return z.ty + z.k * t; },
    };
  }
  const icons = CARDS.map(makeCard);

  const css = `
.hda-people-breathe{transform-box:view-box;transform-origin:100px 120px}
.hda-anim .hda-people-breathe{animation:hda-people-breathe 4.2s ease-in-out infinite}
@keyframes hda-people-breathe{0%,100%{transform:translate(0,0)}45%{transform:translate(0,-.6px)}}
.hda-people-blink{transform-box:fill-box;transform-origin:50% 55%}
.hda-anim .hda-people-blink{animation:hda-people-blink 5.5s linear infinite}
@keyframes hda-people-blink{0%,93%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}97%{transform:scaleY(1)}}
.hda-anim .hda-people-glow{animation:hda-people-glow 4s ease-in-out infinite}
@keyframes hda-people-glow{0%,100%{opacity:1}50%{opacity:.8}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-people-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "people",
    tab: "People",
    group: "Home",
    kind: "device",
    onWord: "Home",
    offWord: "Away",
    intro: "People in a clean semi-realistic cartoon style (outlined, cel-shaded): adult man and woman, older man and woman, teen boy and girl, young boy and girl, toddler, and a baby in a car-seat carrier. Each card has a View (face, portrait, half or full body), outfits and hair styles for its age, glasses, skin tone and zone; adults and older people add Mobility (cane, walker, wheelchair). Color = main garment, second color = hair (baby: onesie and blanket).",
    css,
    icons,
  });
})();
