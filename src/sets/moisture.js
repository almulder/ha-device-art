(function () {
  "use strict";
  const P = "hda-moisture-";
  const H = () => window.HDAH;
  const cl = (v, a, b) => Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, v));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("hda-moisture-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("hda-moisture-" + k, JSON.stringify(v)); } catch (e) {} },
  };
  const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  const BLUE = "#3d9dff", AMBER = "#f2a33a", RED = "#ef5a4c";
  function waterColor(l) {
    if (l >= .5) return H().mix("#4fb4ff", BLUE, cl((1 - l) / .5));
    if (l >= .38) return H().mix(BLUE, "#4fb8c8", cl((.5 - l) / .12));
    if (l >= .28) return H().mix("#4fb8c8", "#e3b648", cl((.38 - l) / .1));
    if (l >= .2) return H().mix("#e3b648", AMBER, cl((.28 - l) / .08));
    return H().mix(AMBER, RED, .55 + .45 * cl((.2 - l) / .15));
  }
  function status(l) {
    if (l >= .6) return { t: "Hydrated", c: "#34d399" };
    if (l >= .35) return { t: "OK", c: "#7cc4ff" };
    if (l >= .2) return { t: "Water soon", c: "#fbbf24" };
    return { t: "Needs water", c: "#fb7185" };
  }
  const RATE = .07;

  function sets() { return (window.HDA || []).filter((s) => s && (s.id === "plants" || s.id === "flowers") && s.icons && s.icons.length); }
  function findIcon(setId, iconId) {
    const ss = sets(); let s = ss.filter((x) => x.id === setId)[0];
    let ic = s && s.icons.filter((i) => i.id === iconId)[0];
    if (!ic) { s = ss[0]; ic = s && s.icons[0]; }
    return ic ? { set: s, icon: ic } : null;
  }
  let uidN = 0;
  function plantSvg(c, l) {
    const f = findIcon(c.set, c.plant);
    if (!f) return `<div class="${P}noart">Plant drawings not loaded</div>`;
    try { return f.icon.render({ on: true, anim: !!(document.body.classList.contains("hda-anim")), color: (f.icon.colors || ["#c8693f"])[0], level: Math.max(.04, l), uid: "mst" + (++uidN) }); }
    catch (e) { return ""; }
  }
  function plantName(c) { const f = findIcon(c.set, c.plant); return f ? f.icon.name : "Plant"; }

  const G = {
    drop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c3.4 4.1 6.6 7.9 6.6 11.6A6.6 6.6 0 0 1 5.4 14.4C5.4 10.7 8.6 6.9 12 2.8z" fill="currentColor"/><path d="M8.6 14.6a3.4 3.4 0 0 0 3.2 3.4" stroke="rgba(255,255,255,.75)" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    temp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="16.6" r="1.9" fill="currentColor"/></svg>',
    batt: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="7" width="17" height="10" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="20" y="10" width="2" height="4" rx=".8" fill="currentColor"/><rect x="5" y="9.5" width="BW" height="5" rx="1" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };

  function wavePath(amp) {
    let d = "M0 12";
    for (let i = 0; i < 8; i++) d += ` Q${i * 50 + 25} ${i % 2 ? 12 + amp : 12 - amp} ${(i + 1) * 50} 12`;
    return d + " L400 26 L0 26 Z";
  }

  const css = `
.hda-moisture-root { display: block; }
.hda-moisture-ctl { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; margin: 0 2px 16px; font-size: 12.5px; color: rgba(234, 226, 255, .78); }
.hda-moisture-ctl label { display: inline-flex; align-items: center; gap: 8px; }
.hda-moisture-ctl select { height: 30px; border-radius: 9px; padding: 0 8px; font: inherit; font-size: 13px; color: #f3efff; background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 255, 255, .16); }
.hda-moisture-ctl option, .hda-moisture-ctl optgroup { background: #1d1145; color: #f3efff; }
.hda-moisture-seg { display: inline-flex; padding: 2px; border-radius: 10px; background: rgba(255, 255, 255, .06); border: 1px solid rgba(255, 255, 255, .12); }
.hda-moisture-seg button { height: 26px; padding: 0 11px; border-radius: 8px; font-size: 12.5px; font-weight: 550; color: rgba(234, 226, 255, .75); }
.hda-moisture-seg button[aria-pressed="true"] { background: rgba(167, 139, 250, .28); color: #fff; }
.hda-moisture-ctl .hda-moisture-tip { color: rgba(200, 190, 240, .62); font-size: 12px; }
.hda-moisture-light .hda-moisture-ctl { color: #3b3f5c; }
.hda-moisture-light .hda-moisture-ctl select { color: #1f2033; background: rgba(255, 255, 255, .7); border-color: rgba(31, 32, 51, .15); }
.hda-moisture-light .hda-moisture-ctl option { background: #fff; color: #1f2033; }
.hda-moisture-light .hda-moisture-seg { background: rgba(255, 255, 255, .55); border-color: rgba(31, 32, 51, .12); }
.hda-moisture-light .hda-moisture-seg button { color: #4b4f6b; }
.hda-moisture-light .hda-moisture-seg button[aria-pressed="true"] { background: #8b5cf6; color: #fff; }
.hda-moisture-light .hda-moisture-ctl .hda-moisture-tip { color: #6b6f88; }

.hda-moisture-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: 200px; grid-auto-flow: row dense; gap: 16px; }
.hda-moisture-big { grid-column: span 2; grid-row: span 2; }
.hda-moisture-wide { grid-column: span 2; }
@media (max-width: 1100px) { .hda-moisture-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 180px; } }
@media (max-width: 620px) { .hda-moisture-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 168px; gap: 12px; } }

.hda-moisture-card { position: relative; overflow: hidden; border-radius: 24px; isolation: isolate; color: #f3efff; min-width: 0;
  background: rgba(28, 19, 60, .62); border: 1px solid rgba(255, 255, 255, .1);
  box-shadow: 0 12px 40px rgba(5, 2, 20, .4), inset 0 1px 0 rgba(255, 255, 255, .08); }
.hda-moisture-light .hda-moisture-card { background: rgba(255, 255, 255, .58); border-color: rgba(255, 255, 255, .9); color: #1f2033;
  box-shadow: 0 12px 34px rgba(40, 44, 70, .18), inset 0 1px 0 rgba(255, 255, 255, .9); }


.hda-moisture-water { position: absolute; left: 0; right: 0; bottom: 0; z-index: 1; transition: height .25s ease-out; }
.hda-moisture-water.hda-moisture-rise { transition: height 1.15s cubic-bezier(.22, .9, .3, 1); }
.hda-moisture-body { position: absolute; left: 0; right: 0; top: 0; bottom: 0; overflow: hidden; }
.hda-moisture-body::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 26px;
  background: linear-gradient(rgba(255, 255, 255, .16), rgba(255, 255, 255, 0)); }
.hda-moisture-wave { position: absolute; left: 0; top: -17px; width: 200%; height: 18px; display: block; overflow: visible; }
.hda-moisture-wave.hda-moisture-w2 { top: -21px; height: 22px; left: -50%; }
.hda-anim .hda-moisture-w1 { animation: hda-moisture-wave 7s linear infinite; }
.hda-anim .hda-moisture-w2 { animation: hda-moisture-wave2 11s linear infinite; }
@keyframes hda-moisture-wave { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes hda-moisture-wave2 { from { transform: translateX(0); } to { transform: translateX(50%); } }

.hda-moisture-bub { display: none; position: absolute; top: 0; bottom: 0; width: 8px; }
.hda-moisture-bub b { position: absolute; left: 0; bottom: -8px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .55); background: rgba(255, 255, 255, .16); }
.hda-anim .hda-moisture-bub { display: block; animation: hda-moisture-bub 6s linear infinite; }
.hda-anim .hda-moisture-bub b { animation: hda-moisture-wob 1.6s ease-in-out infinite alternate; }
@keyframes hda-moisture-bub { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: .9; } 85% { opacity: .75; } 100% { transform: translateY(-100%); opacity: 0; } }
@keyframes hda-moisture-wob { from { transform: translateX(-2px); } to { transform: translateX(2px); } }


.hda-moisture-splash { position: absolute; left: 50%; top: -6px; width: 0; height: 0; display: none; }
.hda-moisture-splash.hda-moisture-go { display: block; }
.hda-moisture-splash b { position: absolute; left: -70px; top: -9px; width: 140px; height: 18px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .7); opacity: 0; }
.hda-moisture-splash s { position: absolute; left: -3px; top: -3px; width: 6px; height: 8px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: rgba(255, 255, 255, .85); opacity: 0; }
.hda-moisture-go b { animation: hda-moisture-ring .9s ease-out forwards; }
.hda-moisture-go b + b { animation-delay: .18s; }
.hda-moisture-go s { animation: hda-moisture-dropa .7s ease-out forwards; }
.hda-moisture-go s + s { animation-name: hda-moisture-dropb; }
.hda-moisture-go s + s + s { animation-name: hda-moisture-dropc; }
@keyframes hda-moisture-ring { 0% { transform: scale(.15); opacity: .95; } 100% { transform: scale(1.25); opacity: 0; } }
@keyframes hda-moisture-dropa { 0% { transform: translate(0, 0); opacity: 1; } 55% { transform: translate(-22px, -26px); opacity: 1; } 100% { transform: translate(-34px, 2px); opacity: 0; } }
@keyframes hda-moisture-dropb { 0% { transform: translate(0, 0); opacity: 1; } 55% { transform: translate(4px, -36px); opacity: 1; } 100% { transform: translate(6px, 0); opacity: 0; } }
@keyframes hda-moisture-dropc { 0% { transform: translate(0, 0); opacity: 1; } 55% { transform: translate(26px, -22px); opacity: 1; } 100% { transform: translate(40px, 4px); opacity: 0; } }


.hda-moisture-sheen { position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 3; pointer-events: none; border-radius: inherit;
  background: linear-gradient(125deg, rgba(255, 255, 255, .13) 0%, rgba(255, 255, 255, .03) 32%, rgba(255, 255, 255, 0) 55%, rgba(255, 255, 255, .05) 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .05); }


.hda-moisture-art { position: absolute; z-index: 2; pointer-events: none; }
.hda-moisture-art svg { display: block; width: 100%; height: 100%; overflow: visible; }
.hda-moisture-noart { font-size: 11px; opacity: .6; text-align: center; padding-top: 40%; }
.hda-moisture-big .hda-moisture-art { left: 18%; width: 64%; top: 16%; height: 62%; }
.hda-moisture-wide .hda-moisture-art { left: 2%; width: 44%; top: 6%; height: 90%; }
.hda-moisture-small .hda-moisture-art { left: 20%; width: 60%; top: 17%; height: 60%; }


.hda-moisture-info { position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 4; padding: 14px 16px; pointer-events: none;
  text-shadow: 0 1px 6px rgba(8, 4, 30, .45); }
.hda-moisture-light .hda-moisture-info { text-shadow: 0 1px 6px rgba(255, 255, 255, .7); }
.hda-moisture-info button { pointer-events: auto; }
.hda-moisture-hd { position: absolute; left: 16px; top: 13px; right: 92px; }
.hda-moisture-hd b { display: block; font-size: 16px; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -.01em; }
.hda-moisture-hd small { display: block; font-size: 11.5px; opacity: .72; margin-top: 1px; }
.hda-moisture-pc { position: absolute; right: 16px; top: 10px; text-align: right; line-height: 1; }
.hda-moisture-pc b { font-size: 30px; font-weight: 700; letter-spacing: -.03em; }
.hda-moisture-pc b i { font-style: normal; font-size: 15px; font-weight: 600; opacity: .8; margin-left: 1px; }
.hda-moisture-pc small { display: block; font-size: 10.5px; opacity: .72; margin-top: 4px; letter-spacing: .02em; }
.hda-moisture-ft { position: absolute; left: 14px; right: 14px; bottom: 13px; display: flex; align-items: flex-end; gap: 10px; }
.hda-moisture-ft > div { flex: 1; min-width: 0; }
.hda-moisture-chip { white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px 0 8px; border-radius: 99px; font-size: 12px; font-weight: 650;
  background: rgba(10, 6, 34, .5); border: 1px solid rgba(255, 255, 255, .14); text-shadow: none; color: #fff; }
.hda-moisture-chip i { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.hda-moisture-light .hda-moisture-chip { background: rgba(255, 255, 255, .8); border-color: rgba(31, 32, 51, .1); color: #1f2033; }
.hda-moisture-det { display: block; font-size: 12.5px; font-weight: 550; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hda-moisture-sen { display: flex; flex-wrap: wrap; gap: 2px 10px; font-size: 11.5px; opacity: .85; margin-top: 5px; }
.hda-moisture-sen span { display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
.hda-moisture-sen svg, .hda-moisture-det svg { width: 13px; height: 13px; flex: none; }
.hda-moisture-det svg { vertical-align: -2px; margin-right: 3px; }
.hda-moisture-btn { flex: none; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px 0 11px; border-radius: 99px; font-size: 13px; font-weight: 650;
  color: #fff; background: linear-gradient(180deg, rgba(139, 92, 246, .95), rgba(109, 62, 220, .95)); border: 1px solid rgba(255, 255, 255, .28);
  box-shadow: 0 6px 18px rgba(60, 20, 160, .45), inset 0 1px 0 rgba(255, 255, 255, .3); text-shadow: none; }
.hda-moisture-btn svg { width: 16px; height: 16px; color: #bfe3ff; }
.hda-moisture-btn:active { transform: scale(.96); }
.hda-moisture-btn[disabled] { opacity: .7; }


.hda-moisture-wide .hda-moisture-hd { left: 47%; right: 80px; }
.hda-moisture-wide .hda-moisture-ft { left: 47%; }
.hda-moisture-wide .hda-moisture-ft { right: 12px; bottom: 12px; }
.hda-moisture-wide .hda-moisture-btn { width: 38px; height: 38px; padding: 0; justify-content: center; }
.hda-moisture-wide .hda-moisture-btn span { display: none; }
.hda-moisture-wide .hda-moisture-det { font-size: 12px; }
.hda-moisture-low { color: #fda4af; }
.hda-moisture-light .hda-moisture-low { color: #e11d48; }

.hda-moisture-small .hda-moisture-hd { right: 64px; left: 14px; top: 12px; }
.hda-moisture-small .hda-moisture-hd b { font-size: 14px; }
.hda-moisture-small .hda-moisture-pc { right: 14px; }
.hda-moisture-small .hda-moisture-pc b { font-size: 22px; }
.hda-moisture-small .hda-moisture-pc b i { font-size: 12px; }
.hda-moisture-small .hda-moisture-ft { left: 12px; right: 12px; bottom: 11px; align-items: center; }
.hda-moisture-small .hda-moisture-btn { width: 36px; padding: 0; justify-content: center; }
.hda-moisture-small .hda-moisture-btn span { display: none; }
.hda-moisture-big .hda-moisture-hd b { font-size: 19px; }
.hda-moisture-big .hda-moisture-pc b { font-size: 44px; }
.hda-moisture-big .hda-moisture-pc b i { font-size: 20px; }
.hda-moisture-big .hda-moisture-det { font-size: 14px; }

@media (prefers-reduced-motion: reduce) {
  .hda-moisture-water, .hda-moisture-water.hda-moisture-rise { transition: none; }
  .hda-anim .hda-moisture-w1, .hda-anim .hda-moisture-w2, .hda-anim .hda-moisture-bub b { animation: none; }
  .hda-anim .hda-moisture-bub, .hda-moisture-splash.hda-moisture-go { display: none; }
}
`;

  function initialCards(level) {
    const fl = sets().filter((s) => s.id === "flowers")[0];
    const six = fl ? { set: "flowers", plant: fl.icons[0].id } : { set: "plants", plant: "pothos" };
    return [
      { key: "a", size: "big", set: "plants", plant: store.get("plant", "monstera"), room: "Living room", mode: store.get("mode", "sensor"),
        level, every: 10, days: 0, temp: 71, batt: 88, upd: "Updated 3 min ago" },
      { key: "b", size: "wide", set: "plants", plant: "snake", room: "Bedroom", mode: "sensor", level: .45, temp: 68, batt: 62, upd: "Updated 3 min ago" },
      { key: "c", size: "wide", set: "plants", plant: "lily", room: "Office", mode: "days", every: 7, days: 6 },
      { key: "d", size: "small", set: "plants", plant: "fern", room: "Bathroom", mode: "sensor", level: .18, temp: 74, batt: 91, upd: "Updated 5 min ago" },
      { key: "e", size: "small", set: "plants", plant: "zz", room: "Hallway", mode: "days", every: 14, days: 2 },
      { key: "f", size: "wide", set: six.set, plant: six.plant, room: "Kitchen", mode: "sensor", level: .64, temp: 70, batt: 15, upd: "Updated 1 min ago" },
    ];
  }
  const lvlOf = (c) => (c.mode === "days" ? cl(1 - c.days / c.every) : cl(c.level));
  const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");

  function infoHtml(c, l) {
    const s = status(l), pct = Math.round(l * 100);
    let det, sen = "";
    if (c.mode === "days") {
      const left = c.every - c.days;
      const wat = c.days === 0 ? "Watered today" : "Watered " + plural(c.days, "day") + " ago";
      const nxt = left <= 0 ? "Water today" : left === 1 ? "Water by tomorrow" : left + " days left";
      if (c.size === "big") { det = G.cal + wat + " · every " + plural(c.every, "day"); sen = `<span>${G.drop}${nxt}</span><span>No sensor: counts days since the last tap</span>`; }
      else { det = G.cal + wat; sen = `<span>every ${plural(c.every, "day")} · ${nxt}</span>`; }
    } else {
      const n = Math.round((l - .2) / RATE);
      det = l < .2 ? "Water today" : n <= 0 ? "Water today" : n === 1 ? "Next water tomorrow" : "Next water in " + n + " days";
      if (c.size !== "small") {
        const bw = Math.max(1.5, 12 * c.batt / 100).toFixed(1);
        sen = `<span>${G.temp}Soil ${c.temp}°F</span><span${c.batt < 20 ? ` class="${P}low"` : ""}>${G.batt.replace("BW", bw)}${c.batt}%</span>` +
          (c.size === "big" ? `<span>${G.clock}${esc(c.upd)}</span>` : "");
      }
    }
    const name = esc(plantName(c));
    return `<div class="${P}hd"><b>${name}</b><small>${esc(c.room)}${c.size !== "small" ? (c.mode === "days" ? " · no sensor" : " · soil sensor") : ""}</small></div>
      <div class="${P}pc"><b>${pct}<i>%</i></b><small>${c.mode === "days" ? "estimated" : "water left"}</small></div>
      <div class="${P}ft"><div><span class="${P}chip"><i style="background:${s.c};box-shadow:0 0 8px ${s.c}"></i>${s.t}</span>
        ${c.size === "small" ? "" : `<span class="${P}det">${det}</span>`}${sen ? `<span class="${P}sen">${sen}</span>` : ""}</div>
        <button type="button" class="${P}btn" data-k="${c.key}" aria-label="Watered ${name}">${G.drop}<span>Watered</span></button></div>`;
  }

  function cardShell(c) {
    const bubs = [];
    const n = c.size === "small" ? 4 : 7;
    for (let i = 0; i < n; i++) {
      const sz = 3 + ((i * 7) % 4);
      bubs.push(`<i class="${P}bub" style="left:${(8 + (i * 83) % 84)}%;animation-duration:${(4.5 + (i * 1.7) % 4).toFixed(1)}s;animation-delay:-${((i * 2.3) % 6).toFixed(1)}s"><b style="width:${sz}px;height:${sz}px;animation-delay:-${(i * .4).toFixed(1)}s"></b></i>`);
    }
    return `<div class="${P}card ${P}${c.size}" data-k="${c.key}">
      <div class="${P}water"><div class="${P}body">${bubs.join("")}</div>
        <svg class="${P}wave ${P}w2" viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true"><path d="${wavePath(5)}"/></svg>
        <svg class="${P}wave ${P}w1" viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true"><path d="${wavePath(4)}" stroke-width="1.2"/></svg>
        <i class="${P}splash"><b></b><b></b><s></s><s></s><s></s></i></div>
      <div class="${P}art"></div><div class="${P}sheen"></div><div class="${P}info"></div></div>`;
  }

  function paint(root, c, l, artToo) {
    const el = root.querySelector(`.${P}card[data-k="${c.key}"]`); if (!el) return;
    const wc = waterColor(l), h = H(), light = root.classList.contains(P + "light");
    const top = h.shade(wc, .12), deep = h.shade(wc, -.38);
    const w = el.querySelector(`.${P}water`);
    w.style.height = (5 + l * 85).toFixed(1) + "%";
    el.querySelector(`.${P}body`).style.background =
      `linear-gradient(180deg, ${h.rgba(top, light ? .5 : .52)} 0%, ${h.rgba(wc, light ? .5 : .55)} 45%, ${h.rgba(deep, light ? .62 : .78)} 100%)`;
    const w1 = el.querySelector(`.${P}w1 path`), w2 = el.querySelector(`.${P}w2 path`);
    w1.setAttribute("fill", h.rgba(top, light ? .5 : .52)); w1.setAttribute("stroke", h.rgba(h.shade(wc, .6), .7));
    w2.setAttribute("fill", h.rgba(h.shade(wc, .3), .22));
    el.style.borderColor = l < .2 ? h.rgba(RED, .45) : "";
    if (artToo !== false) el.querySelector(`.${P}art`).innerHTML = plantSvg(c, l);
    el.querySelector(`.${P}info`).innerHTML = infoHtml(c, l);
  }

  let R = null;
  const animOn = () => document.body.classList.contains("hda-anim") && !RM;

  function watered(c) {
    const from = lvlOf(c), el = R.root.querySelector(`.${P}card[data-k="${c.key}"]`);
    if (c.mode === "days") c.days = 0; else { c.level = 1; c.upd = "Updated just now"; }
    if (!animOn() || !el) { paint(R.root, c, 1); return; }
    const w = el.querySelector(`.${P}water`), sp = el.querySelector(`.${P}splash`), btn = el.querySelector(`.${P}btn`);
    if (btn) btn.disabled = true;
    w.classList.add(P + "rise");
    const steps = 9, dur = 1150, t0 = Date.now();
    (R.timers[c.key] || []).forEach(clearTimeout); R.timers[c.key] = [];
    w.style.height = (5 + 85).toFixed(1) + "%";
    for (let i = 1; i <= steps; i++) {
      R.timers[c.key].push(setTimeout(() => {
        const k = Math.min(1, (Date.now() - t0) / dur), e = 1 - Math.pow(1 - k, 3), l = from + (1 - from) * (i === steps ? 1 : e);
        const keepH = w.style.height; paint(R.root, c, l, i % 3 === 0 || i === steps); w.style.height = keepH;
        if (i === steps) {
          w.style.height = (5 + 85).toFixed(1) + "%";
          sp.classList.remove(P + "go"); void sp.offsetWidth; sp.classList.add(P + "go");
          R.timers[c.key].push(setTimeout(() => { sp.classList.remove(P + "go"); w.classList.remove(P + "rise"); }, 1100));
        }
      }, Math.round(dur * i / steps)));
    }
  }

  function mount(el, st) {
    if (R) Object.keys(R.timers).forEach((k) => R.timers[k].forEach(clearTimeout));
    const cards = initialCards(cl(st.level));
    const big = cards[0];
    if (big.mode === "days") big.days = Math.round((1 - cl(st.level)) * big.every);
    const ps = sets();
    const opts = ps.map((s) => `<optgroup label="${esc(s.id === "flowers" ? "Flowering plants" : "Plants")}">${s.icons.map((i) =>
      `<option value="${esc(s.id + ":" + i.id)}"${s.id === big.set && i.id === big.plant ? " selected" : ""}>${esc(i.name)}</option>`).join("")}</optgroup>`).join("");
    el.innerHTML = `<div class="${P}root${st.bg === "light" ? " " + P + "light" : ""}">
      <div class="${P}ctl">
        <label>Big card plant <select class="${P}pick">${opts || "<option>Plant drawings not loaded</option>"}</select></label>
        <span style="display:inline-flex;align-items:center;gap:8px">Big card reads <span class="${P}seg">
          <button type="button" data-m="sensor" aria-pressed="${big.mode === "sensor"}">Sensor</button>
          <button type="button" data-m="days" aria-pressed="${big.mode === "days"}">Days since watered</button></span></span>
        <span class="${P}tip">The Water slider sets the big card. Tap Watered on any card.</span>
      </div>
      <div class="${P}grid">${cards.map(cardShell).join("")}</div></div>`;
    const root = el.firstChild;
    R = { root, cards, timers: {} };
    const sel = root.querySelector(`.${P}pick`);
    if (sel) {
      const saved = store.get("pick", "");
      if (saved && sel.querySelector(`option[value="${saved}"]`)) { sel.value = saved; const p = saved.split(":"); big.set = p[0]; big.plant = p[1]; }
      sel.addEventListener("change", () => { const p = sel.value.split(":"); big.set = p[0]; big.plant = p[1]; store.set("pick", sel.value); paint(root, big, lvlOf(big)); });
    }
    root.querySelector(`.${P}seg`).addEventListener("click", (e) => {
      const b = e.target.closest && e.target.closest("button[data-m]"); if (!b) return;
      const cur = lvlOf(big); big.mode = b.getAttribute("data-m"); store.set("mode", big.mode);
      if (big.mode === "days") big.days = Math.round((1 - cur) * big.every); else big.level = cur;
      root.querySelectorAll(`.${P}seg button`).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      paint(root, big, lvlOf(big));
    });
    root.querySelector(`.${P}grid`).addEventListener("click", (e) => {
      const b = e.target.closest && e.target.closest(`.${P}btn`); if (!b || b.disabled) return;
      const c = cards.filter((x) => x.key === b.getAttribute("data-k"))[0]; if (c) watered(c);
    });
    cards.forEach((c) => paint(root, c, lvlOf(c)));
  }

  function update(st) {
    if (!R || !document.body.contains(R.root)) return;
    const big = R.cards[0]; (R.timers[big.key] || []).forEach(clearTimeout);
    const w = R.root.querySelector(`.${P}card[data-k="a"] .${P}water`); if (w) w.classList.remove(P + "rise");
    if (big.mode === "days") big.days = Math.round((1 - cl(st.level)) * big.every); else { big.level = cl(st.level); big.upd = "Updated just now"; }
    paint(R.root, big, lvlOf(big));
  }

  (window.HDA = window.HDA || []).push({
    id: "moisture", tab: "Plant moisture card", group: "Plants", kind: "custom",
    intro: "The card's background is the water: full and blue after watering, draining to amber, red-ish under 20 %. Reads a soil sensor, or counts days since the last Watered tap.",
    
    css, mount, update,
  });
})();
