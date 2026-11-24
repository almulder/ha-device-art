
(function () {
  const P = "hda-presence-";
  const f = (n) => (+n).toFixed(1).replace(/\.0$/, "");
  const R2 = Math.PI / 180, sin = (d) => Math.sin(d * R2), cos = (d) => Math.cos(d * R2);
  const DK = "#1b1a20";
  const SW = ["#38bdf8", "#f472b6", "#4ade80", "#fbbf24", "#a78bfa", "#fb923c", "#f87171", "#e5e7eb"];
  const FACE = { id: "face", name: "Facing", values: [["right", "Right"], ["left", "Left"]] };
  const okc = (c) => (/^#[0-9a-f]{6}$/i.test(c || "") ? c : "");
  const pt = (p) => `${f(p[0])} ${f(p[1])}`;
  const pl = (a) => "M" + a.map(pt).join("L");
  const ln = (d, col, w, more) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"${more || ""}/>`;

  
  const GL = "#1d2a36";                         
  const LAMP = "#fff6cc", TAIL = "#d0102e";
  const VEH = {
    car: { s: .29, tx: -1.3, ty: -8,
      body: "M20 134L18 120Q18 109 30 107L62 103.5Q74 84 94 79.5Q108 77 122 78.5Q133 80 147 97L173 101Q184 103.5 185 113L185 127Q185 137 177 138L169.5 138A21.5 21.5 0 0 0 126.5 138L73.5 138A21.5 21.5 0 0 0 30.5 138L25 138Q20 138 20 134Z",
      wells: [[52, 138, 21.5], [148, 138, 21.5]], wheels: [[52, 133.5, 16.5], [148, 133.5, 16.5]],
      win: "M67 102Q78 86 95 82.5Q108 80.5 121 81.8Q130 83 141 99Z", pil: "M102.5 81L108 81L106.6 101.5L101 101.5Z",
      ref: "M88 100L102 84M120 100L128 86", crease: "M24 113Q100 107 182 110", shade: "M76 129H124",
      seam: "M104.5 103L103.5 135M141 101L139 117",
      lamp: "M175 104Q183.5 105.5 184.6 112L176 111.4Q172.8 108 175 104Z", tail: "M18.6 110Q20 107.3 30 107.4L31 113.8L18.5 115Z",
      extra: "M139.5 97.5Q145 92 151 94.5L150 100.5L141 100.5Z" },
    sports: { s: .29, tx: -1.3, ty: -8,
      body: "M16 132L15 121Q15 112 26 110L56 106Q76 88 98 85Q114 84 124 87Q134 92 146 101L176 109Q186 112 186 120L186 128Q186 137 178 138L171.5 138A21.5 21.5 0 0 0 128.5 138L71.5 138A21.5 21.5 0 0 0 28.5 138L22 138Q16 138 16 132Z",
      wells: [[50, 138, 21.5], [150, 138, 21.5]], wheels: [[50, 133, 17], [150, 133, 17]],
      win: "M63 104.5Q80 91 99 88.4Q113 87.5 122 89.6Q131 93.5 139 101.5Z",
      ref: "M88 102L100 89M112 102L119 91", crease: "M20 116Q96 110 182 116", shade: "M74 130H126",
      seam: "M120 103L119 132", scoop: "M80 117Q96 112.5 112 114.5L108 126Q96 123.5 84 125.5Z",
      lamp: "M169 108.5L184 112.6L183.2 116L170.5 112.4Z", tail: "M15.2 114.6L27 112.6L27.4 117.2L15.4 118.4Z",
      spoiler: "M12 109.5L33 105.2L33.6 108.8L14.5 113Z" },
    truck: { s: .29, tx: -1.3, ty: -8,
      body: "M12 132L12 98L14 96L74 96L77 70Q78 64 86 64L132 64Q137 64 140 70L150 92L182 95Q188 96 188 104L188 130Q188 138 180 138L176 138A24 24 0 0 0 128 138L70 138A24 24 0 0 0 22 138L16 138Q12 138 12 132Z",
      wells: [[46, 138, 24], [152, 138, 24]], wheels: [[46, 131, 19], [152, 131, 19]],
      win: "M84 92L86 70L131 70Q134 70 136 74L144 92Z", pil: "M107.6 69.5L113 69.5L112.2 92.5L106.8 92.5Z",
      ref: "M96 90L108 72M120 90L128 74", crease: "M14 98H74M78 106H186", shade: "M72 128H126",
      seam: "M77 97L77 134M110.5 94L110.5 134",
      lamp: "M177 96.5L188 97.8L188 104.5L177.5 102.6Z", tail: "M12.5 100.5H17V113H12.5Z",
      grille: "M183.5 104H189V121H183.5Z", bumper: "M176 123.5H190.5V133.5Q190.5 136 188 136H176ZM9.5 126H19V136H11.5Q9.5 136 9.5 134Z" },
    suv: { s: .29, tx: -1.3, ty: -8,
      body: "M14 132L13 80Q13 70 22 69L124 66Q132 66 136 70L152 92L180 97Q188 99 188 108L188 129Q188 138 180 138L173.5 138A23.5 23.5 0 0 0 126.5 138L71.5 138A23.5 23.5 0 0 0 24.5 138L19 138Q14 138 14 132Z",
      wells: [[48, 138, 23.5], [150, 138, 23.5]], wheels: [[48, 131.5, 18.5], [150, 131.5, 18.5]],
      win: "M23 94L23 76.5Q23 72.8 27.5 72.6L124 70.6Q129 70.6 132 74L146 93Z", pil: "M38.6 72.5L44 72.5L44 94.5L38.6 94.5ZM84.4 71.5L89.8 71.5L89 94L83.6 94Z",
      ref: "M54 92L66 74M106 92L116 74", crease: "M15 104Q100 102 186 105", shade: "M16 131H186",
      seam: "M87 96L87 124",
      lamp: "M178 98.5L187.6 100.6L188 107.6L178.4 105Z", tail: "M13.2 80H19.5V97H13.4Z",
      rails: "M30 62.5H118V66H30Z", grille: "M185.5 109H189V121H185.5Z" },
    semi: { s: .285, tx: -.6, ty: -7.3,
      body: "M8 120L8 54Q8 50 12 50L118 50Q122 50 122 54L122 116L114 116L114 62Q114 52 126 51L148 51Q153 51 155 57L161 88L183 91Q190 92 190 101L190 128Q190 132 187 132A15 15 0 0 0 157 132L157 120Z",
      wells: [], wheels: [[26, 137, 13], [53, 137, 13], [110, 137, 13], [134, 137, 13], [172, 136, 14]],
      win: "M138 60L150 60Q152.4 60 153 63L158 86L138 86Z",
      ref: "M143 84L151 62", crease: "M12 56H118M118 100Q150 98 188 102", shade: "M10 112H120",
      seam: "M135.5 58V115", trailerShade: "M8 54Q8 50 12 50L118 50Q122 50 122 54L122 120L8 120Z",
      ribs: "M20 54V116M32 54V116M44 54V116M56 54V116M68 54V116M80 54V116M92 54V116M104 54V116",
      lamp: "M180 93L186 94V100.5L180.5 99Z", tail: "M8.6 100H12.6V112H8.6Z",
      grille: "M185.5 95.5L191 96.5V124H185.5Z", bumper: "M181 124H193V133Q193 135 191 135H181Z",
      frame: "M10 120H190V129H10Z", stack: "M156.5 40Q156.5 37 159 37Q161.5 37 161.5 40V90H156.5Z",
      tank: "M138 117H154Q156 117 156 119V127Q156 129 154 129H138Q136 129 136 127V119Q136 117 138 117Z",
      sleeper: "M117.5 64H129.5V72H117.5Z" },
  };

  
  function tire(cx, cy, r, k, spin) {
    let s = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#17171b" stroke="#fff" stroke-width="${f(1.2 * k)}"/>` +
      `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .56)}" fill="#c4cad1" stroke="#5b6168" stroke-width="${f(.4 * k)}"/>`;
    if (spin) {
      let h = ""; const ro = r * .48, ri = r * .18;
      for (let i = 0; i < 5; i++) { const a = i * 72 - 90, p = (d, rr) => `${f(cx + cos(a + d) * rr)} ${f(cy + sin(a + d) * rr)}`; h += `M${p(-22, ro)}A${f(ro)} ${f(ro)} 0 0 1 ${p(22, ro)}L${p(13, ri)}A${f(ri)} ${f(ri)} 0 0 0 ${p(-13, ri)}Z`; }
      s += `<g class="${P}spin"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .56)}" fill="#000" fill-opacity="0"/><path d="${h}" fill="#3a3e45"/></g>`;
    }
    return s + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .16)}" fill="#7b828a"/>`;
  }

  function carInner(key, spin) {
    const D = VEH[key], k = 1 / D.s;
    const fl = (d, fill, more) => d ? `<path d="${d}" fill="${fill}"${more || ""}/>` : "";
    const thin = ` stroke="#000" stroke-opacity=".45" stroke-width="${f(.5 * k)}" stroke-linejoin="round"`;
    let s = ln(D.body, "#000", 3.6 * k, ' stroke-opacity=".45"');                      
    if (D.stack) s += fl(D.stack, "#c9cfd5", ` stroke="#fff" stroke-width="${f(1.1 * k)}"`);
    s += D.wells.map(([cx, by, ar]) => `<path d="M${f(cx - ar)} ${by}A${ar} ${ar} 0 0 1 ${f(cx + ar)} ${by}Z" fill="#0f1013"/>`).join("");
    if (D.frame) s += fl(D.frame, "#2a2c31", ` stroke="#fff" stroke-width="${f(1 * k)}"`);
    s += `<path d="${D.body}" fill="currentColor" stroke="#fff" stroke-width="${f(1.5 * k)}" stroke-linejoin="round"/>`;
    if (D.trailerShade) s += fl(D.trailerShade, "#000", ' fill-opacity=".1"') + ln(D.ribs, "#000", 1.4, ' stroke-opacity=".2"');
    s += ln(D.shade, "#000", 8, ' stroke-opacity=".2" stroke-linecap="butt"') + ln(D.crease, "#fff", 3, ' stroke-opacity=".45"') +
      ln(D.seam, "#000", 1.8, ' stroke-opacity=".35"');
    if (D.rails) s += fl(D.rails, "#2a2c31", thin);
    s += fl(D.win, GL, thin) + ln(D.ref, "#fff", 3, ' stroke-opacity=".4"') + fl(D.pil, "currentColor");
    if (D.scoop) s += fl(D.scoop, "#16171b");
    if (D.spoiler) s += fl(D.spoiler, "#24262b", thin);
    if (D.extra) s += fl(D.extra, "currentColor", thin);
    if (D.sleeper) s += fl(D.sleeper, GL, thin);
    if (D.grille) s += fl(D.grille, "#2a2c31", thin);
    if (D.bumper) s += fl(D.bumper, "#cfd5db", thin);
    if (D.tank) s += fl(D.tank, "#cfd5db", thin);
    s += fl(D.lamp, LAMP, thin) + fl(D.tail, TAIL, thin);
    s += D.wheels.map((w) => tire(w[0], w[1], w[2], k, spin)).join("");
    return `<g transform="matrix(${D.s} 0 0 ${D.s} ${D.tx} ${D.ty})">${s}</g>`;
  }

  
  function ik(A, T, a, b, dir) {
    const dx = T[0] - A[0], dy = T[1] - A[1];
    const d = Math.max(Math.abs(a - b) + .01, Math.min(a + b - .01, Math.hypot(dx, dy)));
    const t = Math.atan2(dy, dx), u = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d)))) * -dir;
    return [A[0] + Math.cos(t + u) * a, A[1] + Math.sin(t + u) * a];
  }
  const SKIN = "#e7b08a", SKD = "#c98f6a";
  
  const limb = (pts, w, col, k, rim) => (rim ? ln(pl(pts), "#fff", w + 3.4 * k) : "") + ln(pl(pts), DK, w + 2.2) + ln(pl(pts), col, w);

  
  function bikeInner(q, spin) {
    const s = .24, k = 1 / s, R = [52, 127], F = [148, 127], BB = [92, 131], r = 26, cr = 13;
    const hip = [80, 73], Sh = [111, 46], hand = [139, 72];
    const wheel = (c) => `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="${f(5 + 3.6 * k)}"/>` +
      `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="#fff" stroke-width="${f(5 + 2.4 * k)}"/>` +
      `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="#17171b" stroke-width="6"/>` +
      (spin ? `<g class="${P}spin"><circle cx="${c[0]}" cy="${c[1]}" r="${r - 4}" fill="#000" fill-opacity="0"/>${ln(`M${c[0] - r + 4} ${c[1]}H${c[0] + r - 4}M${c[0]} ${c[1] - r + 4}V${c[1] + r - 4}M${f(c[0] - 15.6)} ${f(c[1] - 15.6)}L${f(c[0] + 15.6)} ${f(c[1] + 15.6)}M${f(c[0] - 15.6)} ${f(c[1] + 15.6)}L${f(c[0] + 15.6)} ${f(c[1] - 15.6)}`, "#9aa1a8", 1.6)}</g>` : "") +
      `<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="#9aa1a8"/>`;
    const tubes = `M${pt(BB)}L82 89M${pt(BB)}L${pt(R)}M83 90L${pt(R)}M82 91L130 86M${pt(BB)}L133 99M130 84L134 101M134 100Q140 112 ${pt(F)}`;
    const leg = (far) => {
      const a = q * 360 + (far ? 205 : 25), Pd = [BB[0] + cos(a) * cr, BB[1] + sin(a) * cr], Ft = [Pd[0] - 2, Pd[1] - 4];
      const K = ik(hip, Ft, 36, 38, -1);
      return ln(`M${pt(BB)}L${pt(Pd)}`, "#5b6168", 3.4) + limb([hip, K], 11, far ? "#15161a" : "#26282e", k, !far) + limb([K, Ft], 9.5, far ? SKD : SKIN, k, !far) +
        ln(`M${f(Ft[0] - 4)} ${f(Ft[1] + 2)}H${f(Ft[0] + 9)}`, DK, 6.4);
    };
    const Ae = ik(Sh, hand, 21, 20, -1);
    return `<g transform="matrix(${s} 0 0 ${s} 4.2 -1.2)">` + wheel(R) + wheel(F) + leg(1) +
      ln(tubes, "#000", 7 + 3.6 * k, ' stroke-opacity=".45"') + ln(tubes, "#fff", 6 + 2.4 * k) + ln(tubes, "currentColor", 6) +
      ln("M81 89L79 79M130 85L133 75L141 75", "#fff", 5 + 2 * k) + ln("M81 89L79 79M130 85L133 75L141 75", "#2d3036", 5) +
      `<path d="M67 78Q69 74 78 74.5L93 76Q94 80 89 80.5L69 81Z" fill="#22242a" stroke="#fff" stroke-width="${f(1.2 * k)}"/>` +
      `<circle cx="${BB[0]}" cy="${BB[1]}" r="9" fill="#3a3e45" stroke="#fff" stroke-width="${f(.8 * k)}"/>` + leg(0) +
      ln("M76 68Q74 77 84 79L92 77Q108 60 117 52Q120 44 112 41Q104 40 98 46Q84 56 76 68Z", "#fff", 2.6 * k) +
      `<path d="M76 68Q74 77 84 79L92 77Q108 60 117 52Q120 44 112 41Q104 40 98 46Q84 56 76 68Z" fill="currentColor" stroke="${DK}" stroke-width="2"/>` +
      ln("M72 72Q74 81 84 81", "#22242a", 7) +
      limb([Sh, Ae, hand], 8, SKIN, k, 1) + ln(`M${pt(Sh)}L${pt([Sh[0] + (Ae[0] - Sh[0]) * .55, Sh[1] + (Ae[1] - Sh[1]) * .55])}`, "currentColor", 8.6) +
      `<circle cx="122" cy="32" r="12.5" fill="${SKIN}" stroke="#fff" stroke-width="${f(1.6 * k)}"/><circle cx="122" cy="32" r="12.5" fill="${SKIN}" stroke="${DK}" stroke-width="2"/>` +
      `<path d="M108 30Q108 16 122 16Q134 16 137 27L124 27Q116 27 108 30Z" fill="currentColor" stroke="${DK}" stroke-width="2"/>` +
      `<path d="M125 28H137L136 33H126Z" fill="#20262e"/><circle cx="135" cy="35.5" r="2" fill="${SKIN}" stroke="${DK}" stroke-width="1.2"/></g>`;
  }

  
  function motoInner(spin) {
    const s = .255, k = 1 / s, R = [50, 126], F = [152, 126], r = 24;
    const hip = [84, 77], Sh = [108, 50], grip = [133, 69], knee = [114, 92], foot = [97, 112];
    const th = ` stroke="#000" stroke-opacity=".45" stroke-width="${f(.5 * k)}" stroke-linejoin="round"`;
    const paint = "M94 84Q103 72 121 72Q133 72 139 80L132 97L100 96ZM36 84L62 82L66 95L44 97Q38 96 36 84ZM132 104Q151 92 172 103L170 108Q151 99 135 109ZM134 64Q146 62 150 74L147 88Q140 90 136 84Z";
    const sil = "M30 100Q36 82 62 82L96 82Q104 70 121 70Q132 64 146 63Q154 70 150 88L170 100L176 110L140 112L126 120L112 136L86 134L70 128L54 112Z";
    return `<g transform="matrix(${s} 0 0 ${s} 2.2 -2.2)">` +
      ln(sil, "#000", 4 * k, ' stroke-opacity=".4"') + `<path d="${sil}" fill="#000" fill-opacity=".001"/>` +
      ln(`M${pt(R)}L92 114`, "#fff", 6 + 2.4 * k) + ln(`M${pt(R)}L92 114`, "#3a3d44", 6) +
      tire(R[0], R[1], r, k, spin) + tire(F[0], F[1], r, k, spin) +
      `<path d="M86 100L122 98L126 116L113 133L93 131L84 117Z" fill="#2c2e33" stroke="#fff" stroke-width="${f(1 * k)}" stroke-linejoin="round"/>` +
      ln("M90 106H121M90 112H122", "#5a5e66", 1.6) +
      ln("M110 132Q96 140 70 128", "#fff", 4 + 2 * k) + ln("M110 132Q96 140 70 128", "#c9cfd5", 4) +
      `<path d="M48 104Q46 98 54 98L88 104L86 113L54 111Q48 111 48 104Z" fill="#c9cfd5" stroke="#fff" stroke-width="${f(1 * k)}"/>` +
      ln(`M137 74L${pt(F)}`, "#fff", 6 + 2.2 * k) + ln(`M137 74L${pt(F)}`, "#c9cfd5", 6) +
      `<path d="${paint}" fill="currentColor" stroke="#fff" stroke-width="${f(1.3 * k)}" stroke-linejoin="round"/>` +
      `<path d="M58 87Q62 82 74 84L98 86L100 94L60 96Z" fill="#1d1e22" stroke="#fff" stroke-width="${f(1 * k)}"/>` +
      ln("M102 80Q115 74 130 76", "#fff", 2.6, ' stroke-opacity=".5"') +
      `<circle cx="147" cy="78" r="5" fill="${LAMP}"${th}/><path d="M34 84.5L38.5 84.2L39.5 91L35 91.5Z" fill="${TAIL}"/>` +
      limb([hip, knee, foot], 12, "#2a3350", k, 1) + ln(`M${foot[0] - 3} ${foot[1] + 2}H${foot[0] + 10}`, DK, 7) +
      ln("M76 74Q74 84 86 86L96 80Q110 64 116 54Q118 44 110 42Q100 41 94 48Q82 60 76 74Z", "#fff", 2.6 * k) +
      `<path d="M76 74Q74 84 86 86L96 80Q110 64 116 54Q118 44 110 42Q100 41 94 48Q82 60 76 74Z" fill="#26282e" stroke="${DK}" stroke-width="2"/>` +
      ln("M84 82Q100 66 111 48", "currentColor", 3) +
      limb([Sh, ik(Sh, grip, 18, 18, -1), grip], 9, "#1b1c21", k, 1) +
      `<circle cx="117" cy="35" r="14" fill="currentColor" stroke="#fff" stroke-width="${f(1.4 * k)}"/>` +
      `<path d="M118 30Q130 29 131 36L130 40Q122 40 118 37Z" fill="#1c2733"/>` +
      ln("M106 27Q113 23 120 24", "#fff", 2.2, ' stroke-opacity=".55"') + `</g>`;
  }

  
  const FIG = {
    person: { head: [29.5, 11.2, 3.7], hair: "M33.1 9.7Q32.3 6.7 29.2 7.2Q25.7 7.5 25.8 11.2Q26 13.3 27.3 13.8L27.9 11.6Q29.5 10 33.1 9.7Z",
      torso: "M26.1 15.7Q28.4 14.4 30.6 15.6L30.8 23Q28.4 24.2 26 23.1Z",
      legs: [[27.8, 22.4], [30.2, 27], [31.4, 31.2]], legs2: [[27.6, 22.4], [25.8, 27], [23.6, 30.7]], lw: 2.8,
      arms: [[28.8, 16.6], [30.6, 20.1], [32.8, 21.4]], arms2: [[28.2, 16.6], [26.5, 20], [25, 22.4]], aw: 2.1 },
    woman: { head: [29.5, 11.2, 3.6], hair: "M33 9.6Q32.4 6.7 29.3 7.1Q25.8 7.3 25.9 11Q25.6 14 24.4 15.6Q26.4 15.8 27.4 13.8L27.9 11.6Q29.6 10 33 9.6Z",
      torso: "M26.4 15.7Q28.5 14.5 30.4 15.6L32.4 25.6Q28.6 27.1 24.6 25.8Z",
      legs: [[29.2, 25.6], [30.4, 28.5], [31.4, 31.4]], legs2: [[27, 25.6], [25.6, 28.4], [24.2, 31]], lw: 2.3,
      arms: [[28.7, 16.6], [30.4, 20.1], [32.5, 21.4]], arms2: [[28.2, 16.6], [26.6, 20], [25.2, 22.3]], aw: 1.9 },
    child: { head: [29, 14.4, 4.3], hair: "M33.3 13.3Q33.1 9.6 29.4 9.7Q25.2 9.6 24.9 13.8Q25 16.2 26.3 16.9L27 14.4Q28 12.9 30 13.1Q31.2 12.2 33.3 13.3Z",
      torso: "M26.2 19.6Q28.3 18.6 30.2 19.6L30.4 25.6Q28.3 26.6 26 25.6Z", pack: "M22.9 20.2Q22.8 19.4 23.8 19.4H26.6V25.2H23.8Q22.9 25.2 22.9 24.2Z",
      legs: [[28, 25.3], [29.8, 28.5], [30.8, 31.6]], legs2: [[27.6, 25.3], [26.1, 28.5], [24.6, 31.3]], lw: 2.4,
      arms: [[28.6, 20.3], [30.1, 22.9], [31.8, 23.9]], arms2: [[28, 20.3], [26.7, 22.8], [25.6, 24.6]], aw: 1.8 },
  };
  const W1 = "#ffffff", W2 = "#c5cbd4", HAIR = "#cfd4db", SHOE = "#4a4f58";
  function figure(key, swap) {
    const F = FIG[key];
    const front = swap ? [F.legs2, F.arms2] : [F.legs, F.arms], back = swap ? [F.legs, F.arms] : [F.legs2, F.arms2];
    
    const L = (pts, w, col) => ln(pl(pts), DK, w + 1.1, ' stroke-opacity=".85"') + ln(pl(pts), col, w);
    const foot = (p, col) => ln(`M${f(p[0] - .8)} ${f(p[1] + .5)}H${f(p[0] + 1.6)}`, col, 1.5);
    const [hx, hy, hr] = F.head;
    let s = L(back[0], F.lw, W2) + foot(back[0][2], SHOE) + L(back[1], F.aw, W2);
    if (F.pack) s += `<path d="${F.pack}" fill="#8e98a6" stroke="${DK}" stroke-width=".55"/>`;
    s += `<path d="${F.torso}" fill="${W1}" stroke="${DK}" stroke-width=".6" stroke-linejoin="round"/>` +
      ln(F.torso.replace(/^M([\d.]+) /, (m, x) => `M${(+x + .4).toFixed(1)} `).split("L")[0] + `L${F.torso.match(/L([\d.]+ [\d.]+)/)[1]}`, W2, .6, ' stroke-opacity="0"') +
      L(front[0], F.lw, W1) + foot(front[0][2], SHOE) +
      `<circle cx="${hx}" cy="${hy}" r="${hr}" fill="${W1}" stroke="${DK}" stroke-width=".6"/>` +
      `<path d="${F.hair}" fill="${HAIR}" stroke="${DK}" stroke-width=".5" stroke-linejoin="round"/>` +
      `<circle cx="${f(hx + hr * .98)}" cy="${f(hy + hr * .2)}" r=".6" fill="${W1}" stroke="${DK}" stroke-width=".4"/>` +
      `<circle cx="${f(hx + hr * .52)}" cy="${f(hy - hr * .05)}" r=".42" fill="${DK}"/>` +
      L(front[1], F.aw, W1);
    return s;
  }
  function disc(inner) {
    return `<circle cx="28" cy="20" r="17.4" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.6"/>` +
      `<circle cx="28" cy="20" r="16.3" fill="currentColor" stroke="#fff" stroke-width="2.2"/>` + inner;
  }

  
  
  const PARTS = {
    car: `<g fill="#fff" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"><path d="M5,29.5L3.8,27.4L3.5,23Q3.7,20.3 6.5,19.6L12.5,18.8C16.5,15.4 19.5,12.6 24,12.2L31,12.1C34.5,12.3 37.5,14.8 41.5,18C46,18.5 49.5,19.3 51.8,20.5Q53.6,21.6 53.7,24.2L53.6,26.8Q53.3,29.2 51.3,29.5L49.2,29.5A6.2,6.2 0 0 0 36.8,29.5L19.2,29.5A6.2,6.2 0 0 0 6.8,29.5Z"/><circle cx="13" cy="29" r="4.9"/><circle cx="43" cy="29" r="4.9"/></g><path d="M6.8,29.5A6.2,6.2 0 0 1 19.2,29.5ZM36.8,29.5A6.2,6.2 0 0 1 49.2,29.5Z" fill="#111827"/><path d="M5,29.5L3.8,27.4L3.5,23Q3.7,20.3 6.5,19.6L12.5,18.8C16.5,15.4 19.5,12.6 24,12.2L31,12.1C34.5,12.3 37.5,14.8 41.5,18C46,18.5 49.5,19.3 51.8,20.5Q53.6,21.6 53.7,24.2L53.6,26.8Q53.3,29.2 51.3,29.5L49.2,29.5A6.2,6.2 0 0 0 36.8,29.5L19.2,29.5A6.2,6.2 0 0 0 6.8,29.5Z" fill="currentColor"/><path d="M3.7,25.6L53.65,25.9L53.6,26.8Q53.3,29.2 51.3,29.5L49.2,29.5A6.2,6.2 0 0 0 36.8,29.5L19.2,29.5A6.2,6.2 0 0 0 6.8,29.5L5,29.5L3.8,27.4Z" fill="#000" opacity=".2"/><path d="M15.2,18.5C18.8,15.4 21,13.4 24.3,13.1L30.8,13C33.8,13.3 36.4,15.4 39.6,18.2Z" fill="#2b3a4e"/><path d="M33.4,13.6L35.4,14.8L32.6,18.2L30.8,18.2Z" fill="#fff" opacity=".22"/><path d="M28,13h1.2v5.4h-1.2Z" fill="currentColor"/><path d="M6.4,20.8L51,21.5" stroke="#fff" stroke-opacity=".5" stroke-width=".8" fill="none"/><path d="M28.6,18.6V28.6M39.2,18.4L38,28.6" stroke="#000" stroke-opacity=".3" stroke-width=".5" fill="none"/><path d="M30.6,20.6h2M41,20.8h2" stroke="#000" stroke-opacity=".4" stroke-width=".7"/><path d="M50.4,20.4L53.2,22L52.8,23.1L49.4,21.6Z" fill="#fff" opacity=".92"/><path d="M3.6,21.2L7,20.1L6.8,21.8L3.5,22.8Z" fill="#dc2626"/><g fill="#1f2937"><circle cx="13" cy="29" r="4.9"/><circle cx="43" cy="29" r="4.9"/></g><g fill="#cbd5e1"><circle cx="13" cy="29" r="2.7"/><circle cx="43" cy="29" r="2.7"/></g><g fill="#64748b"><circle cx="13" cy="29" r="1"/><circle cx="43" cy="29" r="1"/></g>`,
    sports: `<g fill="#fff" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"><path id="UID-b" d="M3.4 29.6L3 25Q2.8 20.8 5.2 19.8L11 18.7C16 17.9 20.5 15.4 26.5 14.5C29.5 14.1 31.8 14.3 33.8 15.6L39.4 19.4C45.5 19.9 50 20.8 53 22.4Q54.7 23.4 54.5 25.6L54 28.2Q53.6 30.3 51.8 30.3H49.8A6.8 6.8 0 0 0 36.2 30.3H19.8A6.8 6.8 0 0 0 6.2 30.3H4.6Q3.4 30.3 3.4 29.6Z"/><path id="UID-w" d="M2.6 15.6L11 16.8Q11.6 17.6 10.8 18H8.6L8.2 19.4H6.6L6.8 18H3.4Z"/><circle cx="43" cy="30.6" r="5.6"/><circle cx="13" cy="30.6" r="5.6"/></g><path d="M6.2 30.3A6.8 6.8 0 0 1 19.8 30.3ZM36.2 30.3A6.8 6.8 0 0 1 49.8 30.3Z" fill="#111827"/><use href="#UID-b" fill="currentColor"/><use href="#UID-w" fill="#1f2937"/><path d="M3.1 25.6L54.4 26.4L54 28.2Q53.6 30.3 51.8 30.3H49.8A6.8 6.8 0 0 0 36.2 30.3H19.8A6.8 6.8 0 0 0 6.2 30.3H4.6Q3.4 30.3 3.4 29.6Z" fill="#000" opacity=".22"/><path d="M16 18.7C19.8 17.2 23.4 15.9 27.4 15.5L31.1 15.5L36.2 19.1Z" fill="#2b3a4e"/><path d="M27.8 15.4L29 15.4L29.6 19H28.2Z" fill="currentColor"/><path d="M31.8 15.9L33.6 17.2L31.6 19H30.4Z" fill="#fff" opacity=".22"/><path d="M5.6 21.4C9 19.6 14 19.8 19 20.2M21 21.2C30 20.6 42 21 52.6 23.4" stroke="#fff" stroke-opacity=".5" stroke-width=".8" fill="none"/><path d="M37.6 23.2Q32 22.4 26 23.6L30.6 24.4Z" fill="#000" opacity=".3"/><path d="M50 22L54.2 23.6L54 24.6L49.2 23.2Z" fill="#fff" opacity=".92"/><path d="M53.8 25.2H54.5L54.3 27.8H53.2Z" fill="#111827"/><path d="M2.9 21.2L5 20.6V23.4L3 23.8Z" fill="#dc2626"/><g fill="#1f2937"><circle cx="13" cy="30.6" r="5.6"/><circle cx="43" cy="30.6" r="5.6"/></g><g fill="#cbd5e1"><circle cx="13" cy="30.6" r="3.6"/><circle cx="43" cy="30.6" r="3.6"/></g><g fill="#64748b"><circle cx="13" cy="30.6" r="1.2"/><circle cx="43" cy="30.6" r="1.2"/></g>`,
    truck: `<defs><path id="UID-b" d="M2.5 29.5V17.8L3 17H22.2L23.4 8.4Q23.6 7 25 7H34.6Q35.6 7 36.2 7.8L40.8 15.2L51.6 16.4Q53.6 16.7 54 18.4L54.6 27.6L55 30.6H50.2A7 7 0 0 0 36.2 30.6H21A7 7 0 0 0 7 30.6H2.5Z"/></defs><g stroke="#fff" stroke-width="3.6" stroke-linejoin="round" fill="#fff"><use href="#UID-b"/><circle cx="14" cy="31" r="5.6"/><circle cx="43.2" cy="31" r="5.6"/></g><use href="#UID-b" fill="currentColor"/><path d="M2.5 24.5H55V30.6H50.2A7 7 0 0 0 36.2 30.6H21A7 7 0 0 0 7 30.6H2.5Z" fill="#000" opacity=".2"/><path d="M3 17H22.2M40.8 15.2L51.6 16.4" stroke="#fff" stroke-width=".8" opacity=".45" fill="none"/><path d="M3.6 17.6H21.8V19H3.6Z" fill="#000" opacity=".3"/><path d="M7 30.6A7 7 0 0 1 21 30.6M36.2 30.6A7 7 0 0 1 50.2 30.6" stroke="#000" stroke-width="1.2" opacity=".3" fill="none"/><path d="M23.2 18.5V29M30 16V29M37.2 16.5V28" stroke="#000" stroke-width=".5" opacity=".3" fill="none"/><path d="M24.9 8.9H29.4V15.3H24.1ZM30.6 8.9H34.4Q35 8.9 35.3 9.4L39 15.3H30.6Z" fill="#2c3e50"/><path d="M31.4 9.6H33.5L31.4 12.6Z" fill="#fff" opacity=".35"/><path d="M36.4 12.6H38.4V14.8H36.4Z" fill="#1f2a36"/><path d="M52.2 17.6Q53.6 17.8 53.9 19L54 20.6H51.6Z" fill="#fff" opacity=".9"/><path d="M53.2 22V27H54.7V22Z" fill="#000" opacity=".35"/><path d="M2.9 18.4H4.2V22.6H2.9Z" fill="#dc2626"/><g fill="#1f2328"><circle cx="14" cy="31" r="5.6"/><circle cx="43.2" cy="31" r="5.6"/></g><g fill="#b8c0c8"><circle cx="14" cy="31" r="2.9"/><circle cx="43.2" cy="31" r="2.9"/></g><g fill="#5b636b"><circle cx="14" cy="31" r="1"/><circle cx="43.2" cy="31" r="1"/></g>`,
    suv: `<defs><path id="UID-b" d="M3.2 27V13.6Q3.3 9.6 5.4 9.3L33.8 8.9Q35.6 8.9 36.5 10L40.8 16.4L51.4 17.4Q53.7 17.8 53.9 20L54.1 26.6Q54 29.2 52 29.2H50.6A7.6 7.6 0 0 0 35.4 29.2H20.6A7.6 7.6 0 0 0 5.4 29.2H4.6Q3.2 29 3.2 27Z"/></defs><g fill="#fff" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"><use href="#UID-b"/><path d="M6.5 6.6H33.5V8.6H6.5Z"/><circle cx="13" cy="30" r="5.9"/><circle cx="43" cy="30" r="5.9"/></g><use href="#UID-b" fill="currentColor"/><path d="M3.2 23.8H54.1L54.1 26.6Q54 29.2 52 29.2H50.6A7.6 7.6 0 0 0 35.4 29.2H20.6A7.6 7.6 0 0 0 5.4 29.2H4.6Q3.2 29 3.2 27Z" fill="#000" opacity=".22"/><path d="M3.6 17.9H40.8L51.5 18.8Q53 19 53.6 19.8" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".8"/><path d="M20.6 26.4H35.4V28.4H20.6Z" fill="#000" opacity=".4"/><path d="M6.5 7.2H33.5M8.5 7.2V9.2M31.5 7.2V9" stroke="#2b3542" stroke-width="1.2" stroke-linecap="round"/><path d="M7.3 10.8H16.9V16.6H12.8L7.3 13Z M18.4 10.8H27.4V16.6H18.4Z M28.9 10.7H35.2Q35.9 10.7 36.3 11.3L39.6 16.6H28.9Z" fill="#2c3b4d"/><path d="M10 13.6L12.4 11.2M20.6 15.6L24 11.4M31 15.8L34 11.4" stroke="#fff" stroke-opacity=".25" stroke-width="1.1"/><path d="M28.2 17.8V26.4M17.6 17.8V26.4M41.4 17.4Q42.6 21 42 24.2" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".5"/><path d="M44.6 16.8L49.6 17.3L49.2 18.2L44.8 17.9Z" fill="#000" opacity=".35"/><path d="M51 18.4Q53.2 18.7 53.8 20.2V21.8L51 21Z" fill="#f8fafc"/><path d="M52.6 22.4H54.1V25.4H52.6Z" fill="#000" opacity=".45"/><path d="M3.2 12.6L4.5 12.4V18.6L3.2 18.8Z" fill="#dc2626"/><path d="M50.6 29.2A7.6 7.6 0 0 0 35.4 29.2M20.6 29.2A7.6 7.6 0 0 0 5.4 29.2" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="2"/><g fill="#1f2328"><circle cx="13" cy="30" r="5.9"/><circle cx="43" cy="30" r="5.9"/></g><g fill="none" stroke="#000" stroke-width="1.1" stroke-dasharray="1.3 1"><circle cx="13" cy="30" r="5.2"/><circle cx="43" cy="30" r="5.2"/></g><g fill="#a3abb5"><circle cx="13" cy="30" r="3"/><circle cx="43" cy="30" r="3"/></g><g fill="#4b5563"><circle cx="13" cy="30" r="1.1"/><circle cx="43" cy="30" r="1.1"/></g>`,
    offroad: `<defs><path id="UID-b" d="M5.2 28V16.6H29.4L30.9 7.4H32.6L31.7 16.4H50.4Q51.8 16.6 51.8 18.2V27.8H49.7A7.2 7.2 0 0 0 35.3 27.8H20.2A7.2 7.2 0 0 0 5.8 27.8Z"/><path id="UID-t" d="M5.6 16.6V8.8Q5.6 7.4 7 7.4H30.9L29.4 16.6Z"/></defs><g fill="#fff" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"><use href="#UID-b"/><use href="#UID-t"/><rect x="1.6" y="13.4" width="4" height="13" rx="1.4"/><path d="M3.4 25.4H7V28.6H3.4ZM49 24.4H54.6V27.8H49Z"/><circle cx="13" cy="30.4" r="6.4"/><circle cx="42.5" cy="30.4" r="6.4"/></g><use href="#UID-b" fill="currentColor"/><path d="M5.2 22.8H51.8V27.8H49.7A7.2 7.2 0 0 0 35.3 27.8H20.2A7.2 7.2 0 0 0 5.8 27.8H5.2Z" fill="#000" opacity=".2"/><path d="M5.6 17.4H29.2M32 17H51.4" stroke="#fff" stroke-opacity=".5" stroke-width=".8" fill="none"/><use href="#UID-t" fill="#2a2f36"/><path d="M7.2 10.8H14V15.4H7.2ZM15.4 10.8H21.6V15.4H15.4ZM23 10.8H29.9L29.2 15.4H23Z" fill="#33475c"/><path d="M8.4 14.6L11 11.4M17 14.6L19.4 11.4M24.6 14.6L27 11.4" stroke="#fff" stroke-opacity=".22" stroke-width="1"/><path d="M22.4 16.8V27.2M30.9 16.8V25.6Q30.9 27.4 33 27.6M15 16.8V25.2" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"/><path d="M30.4 18.4h1.6M30.4 23h1.6M21.9 18.4h1.6M21.9 23h1.6M24.2 18.4h2M16.6 18.4h2" stroke="#2a2f36" stroke-width="1.2"/><path d="M50.2 18.4A1.8 1.8 0 0 1 50.2 22Z" fill="#f8fafc"/><path d="M5.4 17.8H6.4V21.4H5.4Z" fill="#dc2626"/><rect x="1.6" y="13.4" width="4" height="13" rx="1.4" fill="#1f2328"/><path d="M2.9 16.4H4.3V23.4H2.9Z" fill="#9aa3ad"/><path d="M3.4 25.4H7V28.6H3.4ZM49 24.4H54.6V27.8H49ZM20 26.4H35.5V28.2H20Z" fill="#2a2f36"/><path d="M5.6 28A7.4 7.4 0 0 1 20.4 28M35.1 28A7.4 7.4 0 0 1 49.9 28" fill="none" stroke="#2a2f36" stroke-width="2.4"/><g fill="#1f2328" stroke="#1f2328" stroke-width=".9" stroke-dasharray="1.5 .9"><circle cx="13" cy="30.4" r="5.75"/><circle cx="42.5" cy="30.4" r="5.75"/></g><g fill="#a3abb5"><circle cx="13" cy="30.4" r="2.9"/><circle cx="42.5" cy="30.4" r="2.9"/></g><g fill="#4b5563"><circle cx="13" cy="30.4" r="1.1"/><circle cx="42.5" cy="30.4" r="1.1"/></g>`,
    van: `<defs><path id="UID-v" d="M4.8 29.5Q3.6 29.5 3.6 28L3.8 15Q4.6 8.8 9.4 8.1L28 7.5Q31 7.5 33.4 9.2Q40 13.8 46.2 17.6Q50.6 18.2 52.6 19.6Q53.9 20.6 53.9 23L53.9 27Q53.9 29.5 51.6 29.5L50 29.5A6.5 6.5 0 0 0 37 29.5L19.5 29.5A6.5 6.5 0 0 0 6.5 29.5Z"/></defs><g fill="#fff" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"><use href="#UID-v"/><circle cx="13" cy="29.5" r="5"/><circle cx="43.5" cy="29.5" r="5"/></g><use href="#UID-v" fill="currentColor"/><path d="M3.5 24.6H53.9V27Q53.9 29.5 51.6 29.5H50A6.5 6.5 0 0 0 37 29.5H19.5A6.5 6.5 0 0 0 6.5 29.5H4.8Q3.6 29.5 3.6 28Z" fill="#000" opacity=".22"/><path d="M4 19.4L46 18.6Q50.5 19.2 53.2 20.6" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".8"/><path d="M9.4 10.3L16.2 10.1V17.2H6.4Q6.8 11.4 9.4 10.3Z M17.6 10H27.6V17.2H17.6Z M29 9.8H31Q32.6 9.8 34 10.8L42.8 17L29 17.1Z" fill="#2c3b4d"/><path d="M9.6 16.2L12.6 11M20 16.2L23 11M31 16.4L33.4 11.4" stroke="#fff" stroke-opacity=".25" stroke-width="1.1"/><path d="M6.8 18.4H17.2" stroke="#000" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"/><path d="M17 10V24.6M28.3 10V26.4M38.6 24Q38.2 20 42 17.5" fill="none" stroke="#000" stroke-opacity=".32" stroke-width=".55"/><path d="M25.2 20h1.8M30.4 20h1.8M4.6 21.4h1.6" stroke="#000" stroke-opacity=".45" stroke-width=".8"/><path d="M42.2 15.7h2.4l.4 1.9h-2.5z" fill="#000" opacity=".35"/><path d="M49.4 18.4Q52.6 19 53.7 20.8V22.6L49.8 20.6Z" fill="#f8fafc"/><path d="M3.7 14.2L5 13.6V19.4L3.6 19.6Z" fill="#dc2626"/><path d="M50 29.5A6.5 6.5 0 0 0 37 29.5M19.5 29.5A6.5 6.5 0 0 0 6.5 29.5" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/><path d="M19.5 27.7H37V29.5H19.5Z" fill="#000" opacity=".35"/><use href="#UID-v" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/><g fill="#1f2328"><circle cx="13" cy="29.5" r="5"/><circle cx="43.5" cy="29.5" r="5"/></g><g fill="#a3abb5"><circle cx="13" cy="29.5" r="3"/><circle cx="43.5" cy="29.5" r="3"/></g><g fill="#4b5563"><circle cx="13" cy="29.5" r="1.1"/><circle cx="43.5" cy="29.5" r="1.1"/></g>`,
    bike: `<defs><path id="UID-w" d="M3.7 29.6a7.3 7.3 0 1 0 14.6 0a7.3 7.3 0 1 0-14.6 0m34 0a7.3 7.3 0 1 0 14.6 0a7.3 7.3 0 1 0-14.6 0"/><path id="UID-f" d="M11 29.6l14 1-4-13zm10-12h17.5l.9 3.4-14.4 9.6m14.4-9.6l5.6 8.6"/><path id="UID-b" d="M20.6 16.2l.4 1.4m-2.8-1.8h4.6m15.7 1.8l.8-2.4h2.3q1.4 1.4-.2 3.2"/><path id="UID-l" d="M21.5 14.8l5 6.2-4.2 11.2"/><path id="UID-n" d="M21.5 14.8l8.5 3.8-1.7 9"/><path id="UID-a" d="M33.6 9.4l4.4 3.1 3.3 2.7"/><path id="UID-t" d="M19.6 15.8C21 11 27 8 33 7.4c2.2-.1 3.2 2.1 1.8 3.8-3.8 1.4-7.4 3.4-10.2 5.6z"/><path id="UID-h" d="M34.6 5.6a3 3 0 0 1 6 0a3 3 0 0 1-6 0z"/></defs><g stroke="#fff"><use href="#UID-w" stroke-width="5.8"/><use href="#UID-f" stroke-width="5.6"/><use href="#UID-b" stroke-width="5"/><use href="#UID-l" stroke-width="6.6"/><use href="#UID-n" stroke-width="6.6"/><use href="#UID-a" stroke-width="5.6"/><use href="#UID-t" fill="#fff" stroke-width="3.6"/><use href="#UID-h" fill="#fff" stroke-width="3.8"/></g><use href="#UID-w" stroke="#1f2329" stroke-width="2.3"/><use href="#UID-l" stroke-width="3"/><path d="M26.5 21l-4.2 11.2" stroke="#c48a66" stroke-width="1.9"/><path d="M21.5 14.8l5 6.2" stroke="#151a22" stroke-width="2.3"/><use href="#UID-f" stroke-width="3"/><use href="#UID-f" stroke="currentColor" stroke-width="2"/><path d="M21.8 17h16M12 28.2l8.6-9.6" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/><use href="#UID-b" stroke="#1f2329" stroke-width="1.5"/><circle cx="25" cy="30.6" r="2.1" fill="#3a3f47" stroke="#1f2329" stroke-width=".6"/><path d="M21.4 32.8l7.2-4.4" stroke="#1f2329" stroke-width="1.2"/><use href="#UID-n" stroke-width="3.3"/><path d="M30 18.6l-1.7 9" stroke="#eab48c" stroke-width="2.2"/><path d="M21.5 14.8l8.1 3.6" stroke="#2b3340" stroke-width="2.6"/><path d="M27.4 28.3h3" stroke="#1f2329" stroke-width="1.7"/><use href="#UID-t" fill="currentColor" stroke-width=".8"/><path d="M24.6 16.8c2.8-2.2 6.4-4.2 10.2-5.6-1.2 1.8-5.2 3.2-8.8 6z" fill="#000" fill-opacity=".25"/><path d="M21.6 13.2c2-2.6 6-4.6 10.8-5" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/><use href="#UID-a" stroke-width="2.7"/><path d="M36.2 11.2l1.8 1.3 3.3 2.7" stroke="#eab48c" stroke-width="1.7"/><path d="M33.6 9.4l2.8 1.9" stroke="currentColor" stroke-width="2"/><use href="#UID-h" fill="#eab48c" stroke-width=".8"/><path d="M34.3 5.2c.3-2.8 3.1-3.9 5.7-2.6 1 .6 1.4 1.4 1.3 2.2l-4.9-.2z" fill="currentColor" stroke-width=".8"/><path d="M35.8 3.6c1-1 2.6-1.2 3.8-.6" stroke="#fff" stroke-opacity=".55" stroke-width=".6"/><circle cx="39.6" cy="6" r=".45" fill="#241c1c"/>`,
    semi: `<g fill="#fff" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"><rect x="1.5" y="6.5" width="26.5" height="21.5" rx="1"/><path d="M2 28h37v2.4H2z"/><rect x="38.4" y="3.6" width="1.4" height="12"/><path d="M29 29.5V11q0-3.5 3.5-3.5h6q2 0 2.8 2l4.2 8.1 6.7 1.6q1.8.4 1.8 2.3V31h.6v1.4H50V31H29z"/><circle cx="7" cy="34.4" r="4.3"/><circle cx="16" cy="34.4" r="4.3"/><circle cx="33.8" cy="34.4" r="4.3"/><circle cx="48" cy="34.4" r="4.3"/></g><rect x="1.5" y="6.5" width="26.5" height="21.5" rx="1" fill="#eef0f3" stroke="#9ca3af" stroke-width=".6"/><path fill="#c3c8d0" d="M1.5 25h26.5v3H1.5zM1.5 7.5h26.5v1H1.5z"/><path d="M2 28h37v2.4H2z" fill="#374151"/><rect x="38.4" y="3.6" width="1.4" height="12" fill="#cbd5e1"/><path fill="currentColor" d="M29 29.5V11q0-3.5 3.5-3.5h6q2 0 2.8 2l4.2 8.1 6.7 1.6q1.8.4 1.8 2.3V30q0 1-1 1h-.2a4.8 4.8 0 0 0-9.6 0h-4.6a4.8 4.8 0 0 0-9.6 0z"/><path fill="#fff" opacity=".3" d="M29.6 11q0-2.9 2.9-2.9h6q1.6 0 2.3 1.6l.4.8H29.6z"/><path fill="#000" opacity=".2" d="M29 23.5h25V30q0 1-1 1h-.2a4.8 4.8 0 0 0-9.6 0h-4.6a4.8 4.8 0 0 0-9.6 0z"/><path fill="#000" opacity=".35" d="M52.6 21.4h1.4v6.4h-1.4zM38.3 10v19h.5V10z"/><rect x="31" y="11" width="5" height="2.6" rx=".8" fill="#000" opacity=".22"/><path fill="#2b3a4f" d="M39.3 10.4h1.6l3.9 7.2h-5.5z"/><path stroke="#fff" stroke-opacity=".5" stroke-width=".6" d="M41.2 11.2l1.7 3.2"/><rect x="45.6" y="12.6" width="1" height="3" fill="#1f2937"/><path fill="#fde68a" d="M51.8 20.4l2 .6v1.2h-2.2z"/><rect x="49.6" y="28.4" width="5" height="2.6" rx=".6" fill="#9ca3af"/><rect x="39.6" y="25.2" width="4.8" height="3.4" rx="1.4" fill="#d1d5db"/><g fill="#1f2937"><circle cx="7" cy="34.4" r="4.3"/><circle cx="16" cy="34.4" r="4.3"/><circle cx="33.8" cy="34.4" r="4.3"/><circle cx="48" cy="34.4" r="4.3"/></g><g fill="#9ca3af"><circle cx="7" cy="34.4" r="1.9"/><circle cx="16" cy="34.4" r="1.9"/><circle cx="33.8" cy="34.4" r="1.9"/><circle cx="48" cy="34.4" r="1.9"/></g>`,
    motorcycle: `<g fill="#fff" stroke="#fff" stroke-width="3.6"><circle cx="11.5" cy="30.5" r="8"/><circle cx="44.5" cy="30.5" r="8"/><path d="M7.6 15.4L21 17.5 25 8l3.6-3.4Q30 1 33.4 1.2 36 2.4 35.4 6.2l-1.8 2.4 4.8 3.8.4-5.2 2-.2 2.6 6L48 20l-1.2 3L41 26l-5 3-14 2-6-4H5.5v-8z"/></g><path d="M11.5 30.5l10.5-4m-1 3.1L9 26.4" stroke="#9aa3ad" stroke-width="2.4"/><path d="M16 21h19v5l-4 5h-8l-3-4h-4z" fill="#30363e"/><path d="M44.5 30.5L40.5 16" stroke="#b8c0ca" stroke-width="1.7"/><g id="UID-w"><circle cx="11.5" cy="30.5" r="6.7" fill="#30363e" stroke="#1d2127" stroke-width="2.6"/><circle cx="11.5" cy="30.5" r="4.9" fill="none" stroke="#8b95a3" stroke-width="1.1"/><circle cx="11.5" cy="30.5" r="1.7" fill="#d6dde6"/></g><use href="#UID-w" x="33"/><rect x="5.5" y="19" width="11" height="8" rx="2" fill="#2c3138" stroke="#14171b" stroke-width=".6"/><path d="M41.5 14l-2.9-6.4q1.4-.6 2.2-.2l2.4 6z" fill="#cfe6f3" stroke="#6b8797" stroke-width=".5"/><path d="M19 18.6L9 15.2l-1.4 1.4L9 19l7.5 3H21zm8-1.1q3-3.5 10-3l5.5-1.1 5 6.6-1 2.5-5.5 3-5 3-5-.5 2-6-4-1.5z" fill="currentColor" stroke="#1d2127" stroke-width=".6"/><path d="M46.5 22.5l-5.5 3-5 3-5-.5 2-6 8 .4zM21 22h-4.5L9 19l-1.4-2.4L19 20zm.4-4.4l4-9.2 1.6-.4-2.6 9.8z" fill-opacity=".26"/><path d="M28.5 16.6q2.5-1.7 8.5-1.4l4.6-.9 2 2.7q-6.6-.4-15.1-.4zm-19.1-.7l8.6 2.7-1 .5-8.2-2.5z" fill="#fff" fill-opacity=".42"/><path d="M45.6 18.6l1.8 1.8-2 .4z" fill="#fff7d6"/><path id="UID-l" d="M23.5 16.5l8 2.5-2.5 5.8" fill="none" stroke="#241c1c" stroke-width="4.8"/><use href="#UID-l" stroke="#2a2f38" stroke-width="3.4"/><path d="M15.5 18.6q4.5-1 12.5-1l1 2.2-12 .8zm11.3 5.6h4l.8 2.8h-5.4z" fill="#1b1e23"/><path d="M21.4 17.6l4-9.2 5-1.8 1.8 4-5.4 8z" fill="#3a4250" stroke="#241c1c" stroke-width=".8"/><path id="UID-a" d="M30 9l4.2 3.2 3.8 1" fill="none" stroke="#241c1c" stroke-width="3.6"/><use href="#UID-a" stroke="#4a5363" stroke-width="2.3"/><circle cx="38.3" cy="13.3" r="1.2" fill="#15181c"/><path d="M28.6 5.4q0-4 3.4-4 3.6.1 3.6 3.6-.2 2.4-2.6 2.8l-3.6-.2q-.8-.8-.8-2.2z" fill="#2d333b" stroke="#241c1c" stroke-width=".8"/><path d="M32.4 3.4q2.6-.2 3 1.8l-2.8.4z" fill="#7dd3fc" fill-opacity=".6"/>`,
    person: `<circle cx="28" cy="20" r="18" fill="currentColor" stroke="#fff" stroke-width="2"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#2a2f3a" stroke-width="4.3"><path id="UID-fa" d="M29 15.2L31.6 18.9L34.2 20.4"/><path id="UID-fl" d="M27.2 22.4L25.4 27.4L22.8 31.2L25 33.3"/></g><g stroke="#c3cad5" stroke-width="2.7"><use href="#UID-fa"/><use href="#UID-fl"/></g><g stroke="#2a2f3a" stroke-width="4.5"><path id="UID-nl" d="M28.4 22.4L31 27.2L33 32.4L36.2 31.6"/></g><use href="#UID-nl" stroke="#f4f6f9" stroke-width="2.9"/><path d="M29.6 25.4L31 27.2L32.4 31" stroke="#d3d9e1" stroke-width="1.2"/></g><path d="M25.8 14.4Q28.6 12.4 31.6 14.4L30.9 23.1Q28 24.1 25.3 22.9Z" fill="#fff" stroke="#2a2f3a" stroke-width=".9" stroke-linejoin="round"/><path d="M25.8 14.4Q26.7 13.7 27.6 13.5L27.2 23.6Q26.1 23.4 25.3 22.9Z" fill="#d3d9e1"/><path d="M25.5 21.4Q28.2 22.3 31 21.6" fill="none" stroke="#8a929e" stroke-width=".8"/><circle cx="30" cy="9.4" r="3.5" fill="#fbe3d2" stroke="#2a2f3a" stroke-width=".9"/><path d="M27.4 10.6Q27.6 12.4 29.6 12.9Q28.2 11.6 28.1 10.2Z" fill="#e8c2a8"/><path d="M26.6 9.6Q26.3 5.7 30.1 5.8Q33.1 5.9 33.5 8Q31.4 7.2 29.8 8.2Q29 9 28.9 10.8Q27.6 11.4 26.6 9.6Z" fill="#6f7884" stroke="#2a2f3a" stroke-width=".7" stroke-linejoin="round"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#2a2f3a" stroke-width="4.3"><path id="UID-na" d="M28.2 15.2L26.6 19.3L24 21.4"/></g><use href="#UID-na" stroke="#fff" stroke-width="2.7"/></g>`,
    woman: `<circle cx="28" cy="20" r="17.8" fill="currentColor" stroke="#fff" stroke-width="2"/><g transform="translate(0 -.5)"><g stroke-linecap="round" stroke-linejoin="round" fill="none"><path stroke="#1f2937" stroke-width="3.9" d="M30.4 14.4 32.2 18.2 34.2 19.6M28.8 24 27.2 29.4 25 33.2 26.9 34.3"/><path stroke="#c3cbd5" stroke-width="2.7" d="M30.4 14.4 32.2 18.2 34.2 19.6M28.8 24 27.2 29.4 25 33.2 26.9 34.3"/></g><g stroke="#1f2937" stroke-width=".8" stroke-linejoin="round"><path fill="#fff" d="M27.6 19.8h3.8q2.2 3.8 3.6 7.6-5.3 1.4-10.6 0 1.4-4.2 3.2-7.6z"/><path fill="#c3cbd5" stroke="none" d="M29.2 20.2q-.9 4-1.4 7.8-1.8-.1-3-.6 1.3-4 3.2-7.2z"/><path fill="#fff" d="M27.6 13.2q2.2-.8 4 .2 1 2 .3 3.8l-.5 3h-3.8q-.8-3.8 0-7z"/><path fill="#c3cbd5" stroke="none" d="M28.1 13.6q-.6 3.3.3 6.3h-.7q-.9-3.4-.1-6.6z"/></g><g stroke-linecap="round" stroke-linejoin="round" fill="none"><path stroke="#1f2937" stroke-width="3.9" d="M29.7 11.8v1.4M30.2 24 32.4 29.2 33.8 33.3 36 32.9M29.2 14.6 27.6 18.6 25.6 21"/><path stroke="#fff" stroke-width="2.7" d="M29.7 11.8v1.4M30.2 24 32.4 29.2 33.8 33.3 36 32.9M29.2 14.6 27.6 18.6 25.6 21"/></g><g stroke="#1f2937" stroke-width=".8" stroke-linejoin="round"><circle cx="30" cy="8.6" r="3.4" fill="#fff"/><path fill="#c3cbd5" stroke="none" d="M28.6 11.3q2.4.8 4.2-.5-.9 1.7-2.9 1.6z"/><path fill="#4b5563" d="M27.6 6.2q-3.6-.8-5 3.4 0 1.8.8 2.8.4-2.4 2-3.4 1.2-.4 1.8-.9zM33.2 7.4q-.6-3-3.4-2.7-3.6.4-3.2 4.6.2 1.8 1.6 2.7l.9-1.9q-.2-2 1.2-2.6 1.6-.6 2.9-.1z"/></g><circle cx="32.2" cy="8.3" r=".5" fill="#1f2937"/></g>`,
    child: `<circle cx="28" cy="20" r="17.8" fill="currentColor" stroke="#fff" stroke-width="2"/><g stroke-linecap="round" stroke-linejoin="round" stroke="#334155" stroke-width=".9" transform="translate(28 21) scale(1.06) translate(-28.6 -18)"><path d="M28.6 23.4L31 27.2L32.4 30.8" fill="none" stroke-width="3.6"/><path d="M28.6 23.4L31 27.2L32.4 30.8" fill="none" stroke="#d5dce5" stroke-width="2.2"/><path d="M31.4 29.8h2.6q1.4 0 1.4 1.3v.5h-4.5z" fill="#94a3b8" stroke-width=".8"/><path d="M27.8 23.4L26.6 27.4L24 30.2" fill="none" stroke-width="3.6"/><path d="M27.8 23.4L26.6 27.4L24 30.2" fill="none" stroke="#f8fafc" stroke-width="2.2"/><path d="M22.6 28.6l1.9-.9 1.4 2.2-2.2 1.4q-1.2.4-1.5-.6z" fill="#cbd5e1" stroke-width=".8"/><path d="M26.3 21.8h4.9l.6 3.1h-6.3z" fill="#cbd5e1" stroke-width=".8"/><path d="M26.2 16.4Q28.7 15.1 31.1 16.4L31.3 22.4H26.1z" fill="#fff"/><path d="M26.2 16.4q1.1-.3 1.6 0l-.3 6h-1.4z" fill="#dbe2ea" stroke="none"/><rect x="21.6" y="16" width="5.2" height="7.6" rx="2" fill="#e2e8f0"/><path d="M21.7 18.4q2.6 1 5 0" fill="none" stroke-width=".7"/><rect x="22.4" y="20.2" width="2.8" height="2.2" rx=".7" fill="#cbd5e1" stroke="#64748b" stroke-width=".6"/><path d="M26.4 16.4Q29.4 16.6 29.4 20.2" fill="none" stroke="#64748b"/><path d="M29.6 17.2L31.2 20.4L33.6 21.2" fill="none" stroke-width="3.2"/><path d="M29.6 17.2L31.2 20.4L33.6 21.2" fill="none" stroke="#fff" stroke-width="1.9"/><circle cx="33.9" cy="21.3" r="1.1" fill="#fde5d3" stroke-width=".7"/><circle cx="29.6" cy="10" r="5.4" fill="#fde5d3"/><path d="M34.6 11.4q.9.6.3 1.2" fill="#fde5d3" stroke-width=".7"/><path d="M24.4 10.8Q23.8 4.4 29.8 4.5Q34.3 4.6 35 8.6Q32.6 7.6 30.6 6.6Q30.4 9 28.2 9.6Q27.4 12.2 28 14Q25 13.4 24.4 10.8z" fill="#ecc48c"/><path d="M25 11q.4 1.8 2.6 2.6q-.4-1.4.2-3.6z" fill="#d4a46a" stroke="none"/><circle cx="28.6" cy="11" r=".9" fill="#f3c9ae" stroke="none"/><circle cx="32.7" cy="9.9" r=".65" fill="#1e293b" stroke="none"/><path d="M32 13q1 .4 1.8-.2" fill="none" stroke="#9a5b4a" stroke-width=".6"/></g>`,
  };
  

  const DRIVE = ["car", "sports", "truck", "suv", "offroad", "van", "bike", "semi", "motorcycle"], WALK = ["person", "woman", "child"];
  
  function glyph(key, card, uid) {
    if (PARTS[key]) return PARTS[key].replace(/UID/g, uid || "pm-" + key);
    if (VEH[key]) return carInner(key, card);
    if (key === "bike") return bikeInner(0, card);
    if (key === "motorcycle") return motoInner(card);
    if (FIG[key]) return disc(figure(key, false));
    return "";
  }
  function mapSVG(key, color, uid) {
    const g = glyph(key, false, uid), c = okc(color);
    return c ? `<g style="color:${c}">${g}</g>` : g;
  }

  
  function frames(n, dur, draw) {
    let s = "";
    for (let i = 0; i < n; i++) s += `<g class="${P}f${n}${i ? ` ${P}fx` : ""}" style="animation-delay:${(-((n - i) % n) * dur / n).toFixed(3)}s">${draw(i / n)}</g>`;
    return s;
  }
  function card(key, o, def) {
    const c = okc(o.color) || def.colors[0], opt = o.opt || {}, u = o.uid;
    const walk = !!FIG[key];
    let art;
    if (PARTS[key]) art = `<g class="${P}ride">${glyph(key, true, u)}</g>`;
    else if (walk) art = disc(`<g class="${P}bob">${frames(2, .9, (q) => figure(key, q > 0))}</g>`);
    else if (key === "bike") art = frames(4, .8, (q) => bikeInner(q, true));
    else art = glyph(key, true);
    const G = 148;
    const scene = walk ? "" :
      `<g class="hda-bg"><clipPath id="${u}-rd"><rect x="8" y="${G}" width="184" height="15" rx="5"/></clipPath><rect x="8" y="${G}" width="184" height="15" rx="5" fill="#30343b"/>` +
      `<g clip-path="url(#${u}-rd)"><path class="${P}dash" d="M-20 ${G + 8}H226" stroke="#e8e1c4" stroke-opacity=".55" stroke-width="2" stroke-dasharray="14 12"/></g></g>`;
    const streak = walk ? "" : [[70, 26], [96, 38], [120, 24]].map(([y, l], i) =>
      `<rect class="${P}str" style="animation-delay:-${(i * .3).toFixed(1)}s" x="${12 - l + 22}" y="${y}" width="${l}" height="2.6" rx="1.3" fill="#fff" opacity=".0"/>`).join("");
    const flip = opt.face === "left" ? ` transform="translate(200 0) scale(-1 1)"` : "";
    const y0 = walk ? 34 : 34;
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>` +
      `<g${flip}>` +   
      `<g transform="translate(7.6 ${y0}) scale(3.3)" style="color:${c}">${art}</g></g></svg>`;
  }

  const mk = (id, name, walk) => ({ id, name, colors: SW, picker: true, colorLabel: walk ? "Disc" : "Body", options: [FACE], render(o) { return card(id, o, this); } });

  (window.HDA = window.HDA || []).push({
    id: "presence",
    tab: "Presence map icons",
    group: "Home",
    kind: "device",
    intro: "How each person shows on the family map: a vehicle while driving, a figure while walking. Each card is the 56 x 40 map glyph, scaled up.",
    onWord: "Moving", offWord: "Stopped",
    api: { mapSVG, DRIVE, WALK, COLORS: SW },
    css: `
.hda-presence-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-presence-spin{animation:hda-presence-spin .5s linear infinite}
@keyframes hda-presence-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.hda-presence-fx{opacity:0}
.hda-anim .hda-presence-f2{animation:hda-presence-f2 .9s steps(1,end) infinite}
.hda-anim .hda-presence-f4{animation:hda-presence-f4 .8s steps(1,end) infinite}
@keyframes hda-presence-f2{0%{opacity:1}50%{opacity:0}100%{opacity:0}}
@keyframes hda-presence-f4{0%{opacity:1}25%{opacity:0}100%{opacity:0}}
.hda-anim .hda-presence-bob{animation:hda-presence-bob .45s ease-in-out infinite alternate}
@keyframes hda-presence-bob{from{transform:translateY(0)}to{transform:translateY(-.6px)}}
.hda-presence-ride{transform-box:fill-box;transform-origin:center bottom}
.hda-anim .hda-presence-ride{animation:hda-presence-ride .6s ease-in-out infinite alternate}
@keyframes hda-presence-ride{from{transform:translateY(0)}to{transform:translateY(-.5px)}}
.hda-anim .hda-presence-str{animation:hda-presence-str .9s linear infinite}
@keyframes hda-presence-str{0%{opacity:0;transform:translateX(10px)}35%{opacity:.6}100%{opacity:0;transform:translateX(-22px)}}
.hda-anim .hda-presence-dash{animation:hda-presence-dash .5s linear infinite}
@keyframes hda-presence-dash{from{transform:translateX(0)}to{transform:translateX(-26px)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-presence-"]{animation:none!important}}`,
    icons: [mk("car", "Car"), mk("sports", "Sports car"), mk("truck", "Truck"), mk("suv", "SUV"), mk("offroad", "Off-road 4x4"), mk("van", "Van"), mk("bike", "Bike"), mk("semi", "Semi truck"),
      mk("motorcycle", "Motorcycle"), mk("person", "Person", 1), mk("woman", "Woman", 1), mk("child", "Child", 1)],
  });
})();
