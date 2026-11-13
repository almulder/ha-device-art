window.HDAPA = window.HDAPA || {};
(function () {
  var CFG = { key: "bigr", silver: false, win: true, rack: true, bar: false, dual: false };
  var N = 0;
  function hx(h) { h = (h || "#888888").replace("#", ""); if (h.length === 3) h = h.replace(/(.)/g, "$1$1"); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function mix(a, b, t) { var A = hx(a), B = hx(b); return "#" + A.map(function (v, i) { return ("0" + Math.round(v + (B[i] - v) * t).toString(16)).slice(-2); }).join(""); }
  function dk(c, t) { return mix(c, "#000000", t); }
  function lt(c, t) { return mix(c, "#ffffff", t); }
  function f1(n) { return Math.round(n * 10) / 10; }

  function offG(o, id) {
    if (!o.off) return '<g>';
    return '<filter id="' + id + 'off"><feColorMatrix type="saturate" values=".2"/><feComponentTransfer><feFuncR type="linear" slope=".6"/><feFuncG type="linear" slope=".6"/><feFuncB type="linear" slope=".6"/></feComponentTransfer></filter><g filter="url(#' + id + 'off)">';
  }

  function screen(x, y, w, h, o) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.4" fill="#050506" stroke="#2a2c2f" stroke-width=".5"/>';
    if (o.off) return s;
    var i, r = "";
    for (i = 0; i < 4; i++) r += '<rect x="' + f1(x + 1.8) + '" y="' + f1(y + 2.4 + i * (h - 4.5) / 4) + '" width="1.8" height="1.6" rx=".5" fill="' + (i === 0 ? "#3ddc84" : "#6b7078") + '"/>';
    r += '<rect x="' + f1(x + 5.5) + '" y="' + f1(y + 2.4) + '" width="' + f1(w * .32) + '" height="' + f1(h * .5) + '" rx=".8" fill="' + (o.run ? o.act : "#2a2e33") + '" opacity=".55"/>';
    r += '<rect x="' + f1(x + w * .6) + '" y="' + f1(y + 2.4) + '" width="' + f1(w * .3) + '" height="1.3" rx=".5" fill="#9aa0a8"/>';
    r += '<rect x="' + f1(x + w * .6) + '" y="' + f1(y + 5.4) + '" width="' + f1(w * .2) + '" height="1.1" rx=".5" fill="#5d636b"/>';
    r += '<rect x="' + f1(x + w * .6) + '" y="' + f1(y + 8.4) + '" width="' + f1(w * .25) + '" height="1.1" rx=".5" fill="#5d636b"/>';
    var bw = w - 8, bp = bw * (o.run ? Math.max(.03, o.pct / 100) : 0);
    r += '<rect x="' + f1(x + 5.5) + '" y="' + f1(y + h - 3.6) + '" width="' + f1(bw - 1) + '" height="1.5" rx=".75" fill="#24282d"/>';
    if (bp) r += '<rect x="' + f1(x + 5.5) + '" y="' + f1(y + h - 3.6) + '" width="' + f1(bp - 1) + '" height="1.5" rx=".75" fill="#3ddc84"/>';
    return s + r;
  }

  function part(cx, base, w, maxH, o, id) {
    var p = Math.max(0, Math.min(100, o.pct || 0)) / 100, h = maxH * p, c = o.act || "#3b82f6", s = "";
    if (!o.run || h < .4) return s;
    s += '<clipPath id="' + id + 'pc"><rect x="' + f1(cx - w) + '" y="' + f1(base - h) + '" width="' + f1(w * 2) + '" height="' + f1(h + 1) + '"/></clipPath>';
    s += '<linearGradient id="' + id + 'pg" x1="0" x2="1"><stop offset="0" stop-color="' + lt(c, .3) + '"/><stop offset=".45" stop-color="' + c + '"/><stop offset="1" stop-color="' + dk(c, .45) + '"/></linearGradient>';
    s += '<g clip-path="url(#' + id + 'pc)"><path d="M' + f1(cx - w / 2) + ',' + base + ' v-' + f1(maxH * .7) + ' q0,-' + f1(maxH * .3) + ' ' + f1(w / 2) + ',-' + f1(maxH * .3) + ' q' + f1(w / 2) + ',0 ' + f1(w / 2) + ',' + f1(maxH * .3) + ' v' + f1(maxH * .7) + 'z" fill="url(#' + id + 'pg)"/>';
    for (var y = base - 1.4; y > base - h; y -= 1.4) s += '<line x1="' + f1(cx - w / 2) + '" x2="' + f1(cx + w / 2) + '" y1="' + f1(y) + '" y2="' + f1(y) + '" stroke="#000" stroke-width=".25" opacity=".18"/>';
    s += '</g><rect x="' + f1(cx - w / 2) + '" y="' + f1(base - h - .5) + '" width="' + w + '" height=".9" fill="' + lt(c, .6) + '" opacity=".85"/>';
    return s;
  }

  function head(cx, top, o) {
    var g = '<g class="pa-head">';
    g += '<rect x="' + (cx - 13) + '" y="' + (top - 4) + '" width="26" height="5" rx="1" fill="#2a2b2e"/>';
    g += '<rect x="' + (cx - 11) + '" y="' + top + '" width="22" height="21" rx="3" fill="#323337"/>';
    g += '<rect x="' + (cx - 9.5) + '" y="' + (top + 1.5) + '" width="19" height="14.5" rx="2.4" fill="' + (CFG.silver ? "#5a5d62" : "#4a4c51") + '"/>';
    g += '<rect x="' + (cx - 9.5) + '" y="' + (top + 1.5) + '" width="19" height="3" rx="1.2" fill="#6a6d73"/>';
    g += '<rect x="' + (cx - 5) + '" y="' + (top + 9) + '" width="10" height="1.2" rx=".6" fill="' + (o.off ? "#333" : o.run ? "#e8f2ff" : "#7a808a") + '"/>';
    g += '<circle cx="' + (cx + 6) + '" cy="' + (top + 6) + '" r="1.1" fill="#16171a"/>';
    var nz = CFG.dual ? [cx - 5, cx + 5] : [cx], act = CFG.dual && (o.tool | 0) === 2 ? 1 : 0;
    for (var i = 0; i < nz.length; i++) {
      var n = nz[i], up = CFG.dual && i !== act ? 1.2 : 0;
      g += '<rect x="' + (n - 2.6) + '" y="' + (top + 20 - up) + '" width="5.2" height="2" fill="#8d9298"/>';
      g += '<path d="M' + (n - 2) + ',' + (top + 22 - up) + ' h4 l-1.1,2.8 h-1.8z" fill="#c4953a"/>';
    }
    if (o.run) g += '<circle cx="' + nz[act] + '" cy="' + (top + 25.6) + '" r="1.5" fill="' + o.act + '" opacity=".9"/>';
    return g + '</g>';
  }

  function front(o, id) {
    var W = 154, H = 248, sv = CFG.silver, FL = sv ? 9 : 11, FR = 1.5, s = "";
    var dx0 = FL, dx1 = W - FR, dy0 = 35, dy1 = 239, bwL = 29, bwR = 153;
    if (sv) s += '<linearGradient id="' + id + 'fb" x1="0" x2="1"><stop offset="0" stop-color="#eef0f2"/><stop offset=".03" stop-color="#bfc2c6"/><stop offset=".07" stop-color="#9fa3a8"/><stop offset="1" stop-color="#9fa3a8"/></linearGradient>';
    else s += '<linearGradient id="' + id + 'fb" x1="0" x2="1"><stop offset="0" stop-color="#55575b"/><stop offset=".045" stop-color="#3a3b3e"/><stop offset=".09" stop-color="#2c2d30"/><stop offset=".92" stop-color="#2c2d30"/><stop offset="1" stop-color="#2e2f32"/></linearGradient>';
    s += '<path d="M0,' + H + ' V8 Q0,0 8,0 H' + W + ' V' + H + 'z" fill="url(#' + id + 'fb)"/>';
    s += '<path d="M2,8 Q2,1.6 8,1.6 H' + (W - 8) + '" fill="none" stroke="' + (sv ? "#f6f7f8" : "#6a6c70") + '" stroke-width=".7" opacity=".8"/>';
    s += '<rect x="' + dx0 + '" y="2.5" width="' + (dx1 - dx0) + '" height="31" fill="#0c0d0e"/>';
    s += '<rect x="' + dx0 + '" y="2.5" width="' + (dx1 - dx0) + '" height="1" fill="#2c2e31"/>';
    s += screen(dx0 + 2, 5, 34, 23, o);
    s += '<clipPath id="' + id + 'dc"><rect x="' + dx0 + '" y="' + dy0 + '" width="' + (dx1 - dx0) + '" height="' + (dy1 - dy0) + '" rx="1.5"/></clipPath>';
    s += '<g clip-path="url(#' + id + 'dc)">';
    s += '<rect x="0" y="' + dy0 + '" width="' + W + '" height="' + (dy1 - dy0) + '" fill="#1a1b1d"/>';
    s += '<rect x="' + bwL + '" y="' + dy0 + '" width="' + (bwR - bwL) + '" height="170" fill="#18191b"/>';
    s += '<path d="M' + dx0 + ',' + dy0 + ' L' + bwL + ',' + (dy0 + 6) + ' V' + (dy0 + 170) + ' L' + dx0 + ',' + (dy1 - 10) + 'z" fill="#26272a"/>';
    s += '<rect x="' + (bwL + 8) + '" y="' + (dy0 + 30) + '" width="1.6" height="140" fill="#222326"/><rect x="' + (bwR - 12) + '" y="' + (dy0 + 30) + '" width="1.6" height="140" fill="#222326"/>';
    s += '<rect x="' + dx0 + '" y="47" width="' + (dx1 - dx0) + '" height="5" fill="#55585c"/><rect x="' + dx0 + '" y="47" width="' + (dx1 - dx0) + '" height="1.1" fill="#8b8f94"/>';
    s += '<rect x="' + dx0 + '" y="55" width="' + (dx1 - dx0) + '" height="4.5" fill="#4a4d51"/><rect x="' + dx0 + '" y="55" width="' + (dx1 - dx0) + '" height=".9" fill="#7a7e83"/>';
    s += '<rect x="' + dx0 + '" y="59.5" width="' + (dx1 - dx0) + '" height="2" fill="#000" opacity=".35"/>';
    s += '<path d="M' + (dx0 + 4) + ',66 q20,-4 44,0" fill="none" stroke="#0e0f10" stroke-width="4" opacity=".8"/>';
    var px0 = 34, px1 = 144, pcx = (px0 + px1) / 2;
    s += '<rect x="' + px0 + '" y="161" width="' + (px1 - px0) + '" height="12" fill="#2f3135"/>';
    s += '<rect x="' + (px0 + 3) + '" y="162" width="' + (px1 - px0 - 6) + '" height="9" fill="#3b3e43"/>';
    s += part(pcx, 168, 22, 52, o, id);
    s += '<rect x="' + px0 + '" y="173" width="' + (px1 - px0) + '" height="4" rx="1" fill="#aeb4ba"/><rect x="' + px0 + '" y="173" width="' + (px1 - px0) + '" height="1" fill="#e2e6ea"/>';
    s += '<rect x="0" y="177" width="' + W + '" height="70" fill="#0b0b0c"/>';
    s += '<rect x="' + (px0 + 6) + '" y="177" width="1.6" height="58" fill="#1d1e20"/><rect x="' + (px1 - 8) + '" y="177" width="1.6" height="58" fill="#1d1e20"/>';
    s += head(pcx + 6, 60, o);
    if (o.run && !o.off) {
      s += '<linearGradient id="' + id + 'lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".28"/><stop offset=".55" stop-color="#ffb35c" stop-opacity=".09"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></linearGradient>';
      s += '<rect x="0" y="' + dy0 + '" width="' + W + '" height="145" fill="url(#' + id + 'lg)"/>';
      s += '<rect x="' + dx0 + '" y="' + dy0 + '" width="' + (dx1 - dx0) + '" height="1.6" fill="#fff1d6" opacity=".9"/>';
    }
    s += '<rect x="0" y="' + dy0 + '" width="' + W + '" height="' + (dy1 - dy0) + '" fill="#060607" opacity="' + (o.run ? .42 : .55) + '"/>';
    s += '<linearGradient id="' + id + 'rf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".13"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".07"/><stop offset=".78" stop-color="#fff" stop-opacity="0"/></linearGradient>';
    s += '<rect x="0" y="' + dy0 + '" width="' + W + '" height="' + (dy1 - dy0) + '" fill="url(#' + id + 'rf)"/>';
    s += '</g>';
    s += '<rect x="' + (dx0 + .4) + '" y="' + (dy0 + .4) + '" width="' + (dx1 - dx0 - .8) + '" height="' + (dy1 - dy0 - .8) + '" rx="1.5" fill="none" stroke="#45474b" stroke-width=".8"/>';
    s += '<rect x="' + (dx1 - 2.4) + '" y="112" width="2" height="26" rx="1" fill="#050505" opacity=".8"/>';
    s += '<rect x="0" y="' + dy1 + '" width="' + W + '" height="' + (H - dy1) + '" fill="#1f2022"/>';
    s += '<line x1="' + dx0 + '" x2="' + dx1 + '" y1="33.6" y2="33.6" stroke="#000" stroke-width=".6"/><line x1="0" x2="' + W + '" y1="' + (dy1 + .5) + '" y2="' + (dy1 + .5) + '" stroke="#3c3e41" stroke-width=".5"/>';
    return s;
  }

  function rack(o) {
    var s = "", act = (o.hotend | 0) - 1, x0 = 202, x1 = 249, n = 6;
    s += '<path d="M' + (x0 - 3) + ',170 L' + (x1 + 4) + ',171.2 V174 L' + (x0 - 3) + ',174.4z" fill="#6e7278"/><path d="M' + (x0 - 3) + ',170 L' + (x1 + 4) + ',171.2 V172 L' + (x0 - 3) + ',171z" fill="#b5b9be"/>';
    for (var i = 0; i < n; i++) {
      var t = i / (n - 1), x = x0 + (x1 - x0) * (t * (1 + .08 * (1 - t))), sc = 1 - .2 * t, w = 5.6 * sc, h = 11 * sc, y = 174.4 - .2 * i;
      if (i === act) {
        s += '<rect x="' + f1(x - w / 2) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h * .55) + '" rx=".6" fill="none" stroke="#56595e" stroke-width=".45" stroke-dasharray="1 .8"/>';
        if (!o.off) s += '<circle cx="' + f1(x) + '" cy="' + f1(y - 2.2) + '" r=".9" fill="#3ddc84"/>';
        continue;
      }
      s += '<rect x="' + f1(x - w / 2) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h * .6) + '" rx=".7" fill="#8f949a"/>';
      s += '<rect x="' + f1(x - w / 2) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h * .17) + '" rx=".5" fill="#d3d7db"/>';
      s += '<rect x="' + f1(x + w * .1) + '" y="' + f1(y + h * .22) + '" width="' + f1(w * .28) + '" height="' + f1(h * .34) + '" fill="#6b7076"/>';
      s += '<path d="M' + f1(x - w * .22) + ',' + f1(y + h * .6) + ' h' + f1(w * .44) + ' l-' + f1(w * .12) + ',' + f1(h * .32) + ' h-' + f1(w * .2) + 'z" fill="#c4953a"/>';
      if (!o.off) s += '<circle cx="' + f1(x) + '" cy="' + f1(y - 2.2) + '" r=".6" fill="#5b6067"/>';
    }
    return s;
  }

  var WIN = CFG.silver
    ? "M200,124.6 L251,126.2 Q256,126.4 256,131.4 V256 Q256,261 251,261.2 L200,264 Q195,264.2 195,259 V129.6 Q195,124.4 200,124.6z"
    : "M201,124.2 L251,125.8 Q256,126 256,131 V242 Q256,247 251,247.2 L201,249.8 Q196,250 196,245 V129 Q196,124 201,124.2z";
  function side(o, id) {
    var s = "", sv = CFG.silver;
    if (sv) s += '<linearGradient id="' + id + 'sd" x1="0" x2="1"><stop offset="0" stop-color="#b9bdc1"/><stop offset=".12" stop-color="#abafb3"/><stop offset=".7" stop-color="#999da2"/><stop offset="1" stop-color="#878b90"/></linearGradient>';
    else s += '<linearGradient id="' + id + 'sd" x1="0" x2="1"><stop offset="0" stop-color="#47494d"/><stop offset=".08" stop-color="#3d3f42"/><stop offset=".85" stop-color="#3a3c3f"/><stop offset="1" stop-color="#323336"/></linearGradient>';
    s += '<path d="M169,100 L256,102.6 Q263,103 263,110 V338.6 L169,348z" fill="url(#' + id + 'sd)"/>';
    s += '<path d="M171,101.2 L256,103.8 Q261.8,104.2 261.8,110" fill="none" stroke="' + (sv ? "#f2f4f5" : "#6c6e72") + '" stroke-width=".7"/><line x1="257" y1="112" x2="257" y2="336" stroke="' + (sv ? "#868a8f" : "#2c2d30") + '" stroke-width=".5"/>';
    s += '<path d="M169,338 L263,329 V338.6 L169,348z" fill="#1f2022"/><path d="M169,338 L263,329" stroke="#3c3e41" stroke-width=".5"/>';
    if (sv) s += '<linearGradient id="' + id + 'ce" x1="0" x2="1"><stop offset="0" stop-color="#9a9ea3"/><stop offset=".55" stop-color="#eef0f2"/><stop offset="1" stop-color="#c3c7cb"/></linearGradient>';
    else s += '<linearGradient id="' + id + 'ce" x1="0" x2="1"><stop offset="0" stop-color="#2c2d30"/><stop offset=".55" stop-color="#5b5d61"/><stop offset="1" stop-color="#47494d"/></linearGradient>';
    s += '<path d="M165,100 H171 V339 H165z" fill="url(#' + id + 'ce)"/><path d="M165,339 H171 V348 H165z" fill="#1f2022"/>';
    if (CFG.win) {
      s += '<clipPath id="' + id + 'wc"><path d="' + WIN + '"/></clipPath>';
      s += '<g clip-path="url(#' + id + 'wc)"><rect x="190" y="118" width="70" height="150" fill="#151618"/>';
      s += '<path d="M190,150 L262,152.4 V157 L190,154.6z" fill="#4c4f53"/><path d="M190,150 L262,152.4 V153.2 L190,150.8z" fill="#7d8186"/><path d="M190,158 L262,160.4 V163 L190,160.6z" fill="#3a3d41"/>';
      if (CFG.rack) s += rack(o);
      else s += '<rect x="214" y="166" width="11" height="15" rx="2" fill="#2a2b2e"/><rect x="216" y="168" width="7" height="3" rx="1" fill="#3e4044"/>';
      s += '<path d="M190,' + (sv ? 222 : 212) + ' L262,' + (sv ? 220 : 210) + ' V' + (sv ? 223 : 213) + ' L190,' + (sv ? 225 : 215) + 'z" fill="#55595e" opacity=".8"/>';
      s += '<path d="M232,176 V' + (sv ? 262 : 248) + ' M244,176 V' + (sv ? 262 : 248) + '" stroke="#202124" stroke-width="1.3"/>';
      if (o.run && !o.off) s += '<linearGradient id="' + id + 'sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc77a" stop-opacity=".3"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></linearGradient><rect x="190" y="118" width="70" height="110" fill="url(#' + id + 'sl)"/>';
      s += '<rect x="190" y="118" width="70" height="150" fill="#08090a" opacity="' + (o.run ? .28 : .38) + '"/>';
      s += '<path d="M190,118 L220,118 L190,200z" fill="#fff" opacity=".08"/><path d="M238,118 L246,118 L200,268 L192,268z" fill="#fff" opacity=".05"/>';
      s += '</g><path d="' + WIN + '" fill="none" stroke="#111213" stroke-width="1.6"/>';
    }
    if (CFG.bar) {
      s += '<path d="M210.5,198 L217,198.1 V238 L210.5,238.3z" fill="#1d1e20"/><path d="M217,198.1 L217.8,198.2 V237.9 L217,238z" fill="#5d6064" opacity=".6"/>';
    }
    return s;
  }

  function R(n) { return Math.round(n * 10) / 10; }
  function pts(a) { return a.map(function (p) { return R(p[0]) + "," + R(p[1]); }).join(" "); }
  function pg(a, at) { return '<polygon points="' + pts(a) + '" ' + at + '/>'; }
  function pathOf(a) { return "M" + a.map(function (p) { return R(p[0]) + " " + R(p[1]); }).join("L") + "Z"; }
  function rc(x, y, w, h, at, rx) { return '<rect x="' + R(x) + '" y="' + R(y) + '" width="' + R(Math.max(0, w)) + '" height="' + R(Math.max(0, h)) + '"' + (rx ? ' rx="' + R(rx) + '"' : "") + ' ' + at + '/>'; }
  function ln(x1, y1, x2, y2, at) { return '<path d="M' + R(x1) + ' ' + R(y1) + 'L' + R(x2) + ' ' + R(y2) + '" ' + at + '/>'; }
  function hull(ps) {
    var p = ps.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }), lo = [], up = [], i, q;
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    for (i = 0; i < p.length; i++) { q = p[i]; while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (i = p.length - 1; i >= 0; i--) { q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    up.pop(); lo.pop(); return lo.concat(up);
  }
  function amsDefs(k) {
    function st(o, c, a) { return '<stop offset="' + o + '" stop-color="' + c + '"' + (a != null ? ' stop-opacity="' + a + '"' : "") + '/>'; }
    function lg(id, x2, y2, s) { return '<linearGradient id="' + id + k + '" x1="0" y1="0" x2="' + x2 + '" y2="' + y2 + '">' + s + '</linearGradient>'; }
    return lg("bs", 1, 0, st(0, "#2a2c30") + st(1, "#1a1c1f"))
      + lg("dg", 0, 1, st(0, "#aab3bd", .36) + st(.1, "#ffffff", .2) + st(.24, "#6a727c", .14) + st(.7, "#353a40", .2) + st(1, "#1d2024", .34))
      + lg("ss", 0, 1, st(0, "#000", .55) + st(.3, "#000", .08) + st(.5, "#fff", .14) + st(.7, "#000", 0) + st(1, "#000", .3))
      + lg("gd", 0, 1, st(0, "#e8cb78") + st(1, "#8f6f2a"))
      + lg("fc", 1, 0, st(0, "#6b7077") + st(.35, "#e2e5e8") + st(.6, "#b8bcc1") + st(1, "#62666c"))
      + lg("sb", 0, 1, st(0, "#232529") + st(1, "#141518"))
      + lg("rf", 1, 1, st(0, "#fff", .16) + st(.45, "#fff", .02) + st(1, "#fff", 0))
      + '<pattern id="wp' + k + '" width="1.3" height="8" patternUnits="userSpaceOnUse"><rect width=".45" height="8" fill="#000" fill-opacity=".2"/></pattern>';
  }
  function amsFront(x, y, w, h, k, cols, rx, n, uu, led) {
    n = n || 4; var u = uu || w / 152, o = rc(x, y, w, h, 'fill="url(#sb' + k + ')"', rx);
    o += rc(x, y, w, .13 * h, 'fill="#2c2e33"', rx) + ln(x + 1, y + .4, x + w - 1, y + .4, 'stroke="#fff" stroke-opacity=".25" stroke-width=".6"')
      + ln(x, y + .13 * h, x + w, y + .13 * h, 'stroke="#000" stroke-opacity=".6" stroke-width=".6"');
    for (var i = 0; i < n; i++) {
      var cx = n === 1 ? x + w / 2 : x + w * (.17 + .22 * i), col = cols[i];
      o += rc(cx - 9 * u, y + .15 * h, 18 * u, .75 * h, 'fill="#0a0b0d" fill-opacity=".75"', 1.6 * u);
      o += rc(cx - 6.3 * u, y + .45 * h, 12.6 * u, .4 * h, 'fill="url(#fc' + k + ')"' + (col ? "" : ' fill-opacity=".5"'), 2 * u)
        + rc(cx - 6.3 * u, y + .45 * h, 12.6 * u, .05 * h, 'fill="#3a3d42"');
      if (col) o += rc(cx - .9 * u, y + .17 * h, 1.8 * u, .3 * h, 'fill="' + col + '"');
      o += rc(cx - 4.6 * u, y + .23 * h, 9.2 * u, .11 * h, 'fill="url(#gd' + k + ')"', .8 * u)
        + rc(cx - 4.6 * u, y + .275 * h, 9.2 * u, .02 * h, 'fill="#5a461a" fill-opacity=".7"');
      if (col) o += rc(cx - .9 * u, y + .23 * h, 1.8 * u, .11 * h, 'fill="' + col + '" fill-opacity=".55"');
      o += rc(cx - 7.5 * u, y + .16 * h, 15 * u, .28 * h, 'fill="#d5dce2" fill-opacity=".16" stroke="#fff" stroke-opacity=".38" stroke-width="' + R(.5 * u) + '"', 3.2 * u);
      if (led) o += slotLed(cx, y + .065 * h, 1.3 * u, i, !!col, led);
    }
    return o + rc(x, y, w, h, 'fill="url(#rf' + k + ')"', rx);
  }
  function spools(x0, x1, yT, yB, cols, k) {
    var sw = (x1 - x0) / 4, o = "";
    for (var i = 0; i < 4; i++) {
      var col = cols[i], sx = x0 + i * sw + sw * .04, w = sw * .92, f = Math.max(1, w * .08), hh = yB - yT;
      if (!col) { o += rc(sx + .5, yT + hh * .12, w - 1, hh * .88, 'fill="none" stroke="#9aa1aa" stroke-opacity=".3" stroke-width=".6" stroke-dasharray="2 1.5"', 1); continue; }
      o += rc(sx + f, yT + hh * .06, w - 2 * f, hh * .94, 'fill="' + col + '"') + rc(sx + f, yT + hh * .06, w - 2 * f, hh * .94, 'fill="url(#wp' + k + ')"')
        + rc(sx, yT, f, hh, 'fill="#d4d8dc" fill-opacity=".62"', .6) + rc(sx + w - f, yT, f, hh, 'fill="#d4d8dc" fill-opacity=".62"', .6)
        + rc(sx, yT, w, hh, 'fill="url(#ss' + k + ')"', 1);
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
  function spu(o, k) {
    var cols = (o.colors || []).slice(0, 4); while (cols.length < 4) cols.push(null);
    var X = 15, Y = 100, W = 154, DX = 94, A = 2.6, B = -12 / 248, rx = 2.4;
    function P(x, y, z) { return [x + z * DX, y + z * (A + (y - Y) * B)]; }
    var g = "<defs>" + amsDefs(k) + "</defs>";
    var ht = o.unit === "ht", aF = .8 * W, aw = ht ? aF * .3 : aF, a0 = X + W / 2 - aw / 2, a1 = a0 + aw, z0 = .16, z1 = .78, b1 = Y - 3, b0 = b1 - 38, bh = b1 - b0, hD = 48;
    if (o.unit === "none") return "";
    g += pg([P(a0 + 6, b1, z0), P(a0 + 16, b1, z0), P(a0 + 16, Y, z0), P(a0 + 6, Y, z0)], 'fill="#0b0c0e"') + pg([P(a1 - 16, b1, z0), P(a1 - 6, b1, z0), P(a1 - 6, Y, z0), P(a1 - 16, Y, z0)], 'fill="#0b0c0e"');
    var zd0 = z0 + .02, zd1 = z1 - .02, zc = (zd0 + zd1) / 2, zr = (zd1 - zd0) / 2, e0 = a0 + 1.5, e1 = a1 - 1.5;
    function D(xe, hh, za, zb) { var r = []; for (var t = 0; t <= 16; t++) { var th = Math.PI * t / 16; r.push(P(xe, b0 - hh * Math.sin(th), (za + zb) / 2 - (zb - za) / 2 * Math.cos(th))); } return r; }
    var DR = D(e1, hD, zd0, zd1), hp = pathOf(hull(D(e0, hD, zd0, zd1).concat(DR)));
    var fpT = P(a0, b0, z0), fpB = P(a0, b1, z0), tdy = ((fpT[1] - b0) + (fpB[1] - b1)) / 2;
    var sT = P(a1, b0 + .5, z0), sB = P(a1, b1 - .5, z0);
    g += pg([P(a1, b0, z0), P(a1, b0, z1), P(a1, b1, z1), P(a1, b1, z0)], 'fill="url(#bs' + k + ')"')
      + pg([P(a0, b0, z0), P(a1, b0, z0), P(a1, b0, z1), P(a0, b0, z1)], 'fill="#303237"')
      + '<g transform="translate(' + R(z0 * DX) + ' ' + R(tdy) + ')">' + amsFront(a0, b0, a1 - a0, bh, k, cols, rx * .6, ht ? 1 : 4, aF / 152, { off: !!o.off, run: !!o.run && !o.off, err: !!o.err, slot: Number.isInteger(o.slot) ? o.slot : null }) + '</g>'
      + ln(sT[0], sT[1], sB[0], sB[1], 'stroke="#fff" stroke-opacity=".14" stroke-width=".7"');
    var t0 = P(a1 - Math.min(18, (a1 - a0) * .3), b0 + bh * .5, z1 + .02), t1 = P(X + .93 * W, Y, .97);
    var tp = 'M' + R(t0[0]) + ' ' + R(t0[1]) + 'C' + R(t0[0] + 34) + ' ' + R(t0[1] - 6) + ' ' + R(t1[0] + 16) + ' ' + R(t1[1] - 8) + ' ' + R(t1[0]) + ' ' + R(t1[1]);
    g += '<path d="' + tp + '" fill="none" stroke="#e9edf1" stroke-opacity=".55" stroke-width="1.9" stroke-linecap="round"/><path d="' + tp + '" fill="none" stroke="#8b949e" stroke-opacity=".6" stroke-width=".5"/>';
    g += '<clipPath id="cd' + k + '"><path d="' + hp + '"/></clipPath><path d="' + hp + '" fill="#0c0d10" fill-opacity=".72"/><g clip-path="url(#cd' + k + ')">';
    var x0s = a0 + 5, x1s = a1 - 5;
    g += spools3(P, x0s, x1s, b0 + .04 * hD, .9 * hD, zc, zr * .88, ht ? [cols[0]] : cols);
    g += '<path d="' + hp + '" fill="#1b1f24" fill-opacity=".28"/><path d="' + hp + '" fill="url(#dg' + k + ')"/>'
      + pg([P(e0 + 5, b0 - hD * .87, zc - zr * .5), P(e1, b0 - hD * .87, zc - zr * .5), P(e1, b0 - hD * .97, zc - zr * .25), P(e0 + 5, b0 - hD * .97, zc - zr * .25)], 'fill="#fff" fill-opacity=".2"')
      + pg([P(e0 + 8, b0 - hD * .45, zd0 + .02), P(e1 - 10, b0 - hD * .45, zd0 + .02), P(e1 - 10, b0 - hD * .55, zd0 + .03), P(e0 + 8, b0 - hD * .55, zd0 + .03)], 'fill="#fff" fill-opacity=".07"');
    g += '</g><path d="' + pathOf(DR) + '" fill="#fff" fill-opacity=".05" stroke="#e8edf2" stroke-opacity=".32" stroke-width=".7"/>'
      + '<path d="' + hp + '" fill="none" stroke="#e8edf2" stroke-opacity=".3" stroke-width=".7"/>';
    return g;
  }

  function draw(o) {
    o = o || {};
    if (o.off) o = Object.assign({}, o, { run: false });
    var id = "pa" + CFG.key + (++N), s = "", sv = CFG.silver;
    s += '<svg viewBox="-4 -2 288 372" xmlns="http://www.w3.org/2000/svg"><defs>';
    s += '<filter id="' + id + 'bl" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>';
    s += '</defs>';
    s += '<path d="M10,350 L169,356 L272,343 L270,336 L169,346 L14,344z" fill="#000" opacity=".55" filter="url(#' + id + 'bl)"/>';
    s += offG(o, id);
    s += spu(o, id);
    s += side(o, id);
    s += '<g transform="translate(15,100)">' + front(o, id) + '</g>';
    for (var v = 0; v < 6; v++) s += '<path d="M' + (236 + v * 3.4) + ',' + (298 - v * .3) + ' v20" stroke="' + (sv ? "#7d8186" : "#2a2b2e") + '" stroke-width="1.6" stroke-linecap="round"/>';
    s += '<linearGradient id="' + id + 'af" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".06"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="' + (sv ? .18 : .25) + '"/></linearGradient>';
    s += '<path d="M169,100 L256,102.6 Q263,103 263,110 V338.6 L169,348z" fill="url(#' + id + 'af)"/>';
    s += '<path d="M60,135 L74,135 L30,330 L26,330 L26,290z" fill="#fff" opacity=".05"/><path d="M128,135 L132,135 L90,340 L86,340z" fill="#fff" opacity=".04"/>';
    s += '<rect x="20" y="347" width="12" height="3" rx="1" fill="#0d0d0e"/><rect x="150" y="347" width="14" height="3" rx="1" fill="#0d0d0e"/><path d="M248,338 l10,-1 v3 l-10,1z" fill="#0d0d0e"/>';
    s += '<path d="M17,107 Q17,101.6 23,101.6 H168 L256,104.2" fill="none" stroke="' + (sv ? "#ffffff" : "#8a8d92") + '" stroke-width=".6" opacity=".7"/>';
    s += '<path d="M15,348 L169,348 L263,338.6" fill="none" stroke="#111" stroke-width="1.2"/>';
    s += '</g></svg>';
    return s;
  }

  window.HDAPA[CFG.key] = draw;
})();
