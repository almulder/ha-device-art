/* Device Art Card: a Lovelace card that shows a drawing which follows an entity's state. No external dependencies. */
(function () {
  "use strict";
  const REG = window.HDA || [];
  const CATALOG = window.HDA_CATALOG || [];
  const NAMES = window.HDA_NAMES || {};
  const H = window.HDAH;

  /* ---------- index: only catalog items are offered ---------- */
  const SETS = {};
  REG.forEach((s) => { if (s && s.id) SETS[s.id] = s; });
  Object.keys(SETS).forEach((sid) => { const s = SETS[sid]; if (NAMES[sid]) s.tab = NAMES[sid]; if (NAMES[sid + ":intro"]) s.intro = NAMES[sid + ":intro"];
    (s.icons || []).forEach((ic) => { const n = NAMES[sid + "/" + ic.id]; if (n) ic.name = n; }); });
  const ITEMS = {};
  const ORDER = [];
  CATALOG.forEach((c) => c.subs.forEach((sb) => sb.items.forEach((k) => {
    let it = null;
    if (k.indexOf("builder:") === 0) { const b = SETS[k.slice(8)]; if (b && typeof b.draw === "function") it = { key: k, builder: b, set: b, name: NAMES[b.id] || b.tab }; }
    else { const p = k.split("/"), set = SETS[p[0]], ic = set && set.icons && set.icons.filter((i) => i.id === p[1])[0]; if (ic) it = { key: k, set, ic, name: ic.name }; }
    if (it && !ITEMS[k]) { it.cat = c.id; it.sub = sb.id; ITEMS[k] = it; ORDER.push(k); }
  })));

  const BASE_CSS = `.hda-nobg .hda-bg{display:none}
@media (prefers-reduced-motion:reduce){.hda-anim *{animation:none!important;transition:none!important}}`;
  /* builders that draw another set's drawing inside their own (a lock on the door, an older doorbell style) */
  const CSS_DEPS = { doorcfg: ["lock", "lock2", "deadbolts"], camdoorbells: ["doorbell"] };
  const cssCache = {};
  function cssFor(key) {
    const it = ITEMS[key]; if (!it) return BASE_CSS;
    if (cssCache[key]) return cssCache[key];
    const parts = [BASE_CSS];
    if (it.builder) (it.builder.id === "treebuilder" ? ["trees"] : ["plants", "flowers"]).forEach((id) => { if (SETS[id] && SETS[id].css) parts.push(SETS[id].css); });
    (CSS_DEPS[it.set && it.set.id] || []).forEach((id) => { if (SETS[id] && SETS[id].css) parts.push(SETS[id].css); });
    if (it.set && it.set.css) parts.push(it.set.css);
    return (cssCache[key] = parts.join("\n"));
  }
  /* resolve "set/icon", "cat/sub/set/icon" or "builder:id" */
  /* drawings that became styles of a builder card: old art key -> [new key, options] (old dashboards keep working) */
  const MOVED = { "doorbell/tall": "dbtall", "doorbell/square": "dbsquare", "doorbell/wedge": "dbwedge", "doorbell/package": "dbpackage",
    "doorbell/intercom": "dbintercom", "doorbell/gatepost": "dbgate", "doorbell/peephole": "dbpeep" };
  const moved = (art) => { const k = String(art || "").trim().split("/").slice(-2).join("/"); return MOVED[k] && ITEMS["camdoorbells/bell"] ? ["camdoorbells/bell", { style: MOVED[k] }] : null; };
  function resolve(art) {
    if (!art) return null;
    art = String(art).trim();
    if (ITEMS[art]) return art;
    const p = art.split("/");
    if (p.length >= 2) { const k = p.slice(-2).join("/"); if (ITEMS[k]) return k; }
    if (ITEMS["builder:" + p[p.length - 1]]) return "builder:" + p[p.length - 1];
    return null;
  }
  let uidN = 0;
  /* render one drawing; o: { on, anim, color, color2, level, parts, opt, bg, plant, pot, pot_color,
     mf, pval, plevel, pcolor, pname, open } — mf (multi-function): parts holds only the parts given, a part left out
     stays closed / off / blank; without mf every switch part follows on and the doors follow open. Only switch parts
     count for the drawing's own on (a door, a reading or a stage don't). */
  const ptype = (t) => (t === "contact" || t === "value" || t === "stage" ? t : "switch");
  const IDLE = /^(off|idle|done|none|standby)$/i;
  function render(key, o) {
    const it = ITEMS[key]; if (!it) return "";
    o = o || {};
    const lvl = Math.max(0.05, Math.min(1, o.level == null ? 0.8 : +o.level || 0));
    if (it.builder) {
      const K = it.builder.catalog ? it.builder.catalog() : null;
      return it.builder.draw({ plant: o.plant || null, pot: o.pot || null, potColor: o.pot_color || null, color: o.color || null }, { on: o.on !== false, anim: !!o.anim, level: lvl, bg: o.bg !== false }) || "";
    }
    const ic = it.ic;
    const opt = {}; (ic.options || []).forEach((op) => { const v = o.opt && o.opt[op.id]; opt[op.id] = op.values.some((x) => x[0] === v) ? v : op.values[0][0]; });
    (ic.options || []).forEach((op) => { if (op.when && [].concat(op.when.is).indexOf(opt[op.when.opt]) < 0) opt[op.id] = op.values[0][0]; });
    const P = ic.parts || [], mf = !!o.mf && P.length > 0, pb = o.parts || {}, pv = o.pval || {};
    if (mf && !(o.opt && o.opt.kit) && (ic.options || []).some((op) => op.id === "kit")) opt.kit = "light";
    const parts = {}, pval = {}; let any = false, sw = 0, stg = null;
    P.forEach((p) => {
      const ty = ptype(p.type), has = pb[p.id] != null, ok = !p.when || [].concat(p.when.is).indexOf(opt[p.when.opt]) >= 0;
      if (ty === "switch") {
        if (has || !mf) parts[p.id] = has ? !!pb[p.id] : o.on !== false;
        if (p.id in parts && ok) { sw++; if (parts[p.id]) any = true; }
      } else if (ty === "contact" && has) parts[p.id] = !!pb[p.id];
      else if (ty === "value" && num(pv[p.id]) !== null) pval[p.id] = num(pv[p.id]);
      else if (ty === "stage" && pv[p.id] != null && pv[p.id] !== "") { pval[p.id] = String(pv[p.id]); if (stg == null || !IDLE.test(pval[p.id])) stg = pval[p.id]; }
    });
    const on = sw ? any : mf ? (stg != null ? !IDLE.test(stg) : true) : o.on !== false;
    const some = (x) => (x && typeof x === "object" && Object.keys(x).length ? x : undefined);
    try {
      return ic.render({ on, anim: !!o.anim, color: o.color || (ic.colors && ic.colors[0]) || "#ffd8a8", color2: o.color2 || (ic.colors2 && ic.colors2[0]) || "#e8e2d6",
        level: lvl, parts, opt, uid: "dac" + (++uidN), mf, open: !mf && !!o.open, pval: some(pval), plevel: some(o.plevel), pcolor: some(o.pcolor), pname: some(o.pname) });
    } catch (e) { return ""; }
  }
  window.DeviceArt = { items: ITEMS, order: ORDER, catalog: CATALOG, names: NAMES, sets: SETS, render, css: cssFor, resolve };

  /* ---------- state mapping ---------- */
  const ON = ["on", "open", "opening", "playing", "heating", "cooling", "cleaning", "running", "home", "active", "printing", "charging", "mowing",
    "washing", "drying", "buffering", "detected", "wet", "true", "yes", "brewing", "cooking", "preheating", "spinning", "rinsing", "streaming", "recording"];
  const toHex = (rgb) => H.to(rgb[0], rgb[1], rgb[2]);
  const num = (v) => (v === null || v === undefined || v === "" || isNaN(+v) ? null : +v);
  function entityOn(st, cfg) {
    if (!st) return false;
    const d = st.entity_id.split(".")[0], s = String(st.state).toLowerCase(), a = st.attributes || {};
    if (cfg.on_states) return [].concat(cfg.on_states).map((x) => String(x).toLowerCase()).indexOf(s) >= 0;
    if (s === "unavailable" || s === "unknown") return false;
    if (d === "lock") return s === "locked" || s === "locking" || s === "jammed";
    if (d === "climate" || d === "water_heater") return a.hvac_action ? ["heating", "cooling", "drying", "fan", "preheating"].indexOf(String(a.hvac_action)) >= 0 : s !== "off";
    if (d === "sensor" || d === "number" || d === "input_number") { const n = num(st.state); return n !== null ? n > (cfg.on_above == null ? 0 : +cfg.on_above) : ON.indexOf(s) >= 0; }
    if (d === "vacuum") return ["cleaning", "returning"].indexOf(s) >= 0;
    if (d === "media_player") return ["playing", "on", "buffering", "paused"].indexOf(s) >= 0;
    return ON.indexOf(s) >= 0;
  }
  function entityLevel(st, cfg) {
    if (cfg.level != null && !cfg.level_attribute) return +cfg.level;
    if (!st) return cfg.level != null ? +cfg.level : 0.8;
    const a = st.attributes || {};
    if (cfg.level_attribute) { const v = num(a[cfg.level_attribute]); if (v !== null) return scale(v, cfg); }
    if (a.brightness != null) return (+a.brightness || 0) / 255;
    if (a.percentage != null) return (+a.percentage || 0) / 100;
    if (a.current_position != null) return (+a.current_position || 0) / 100;
    if (a.volume_level != null) return +a.volume_level || 0;
    if (a.battery_level != null && cfg.level_from_battery) return (+a.battery_level || 0) / 100;
    const d = st.entity_id.split(".")[0];
    if (d === "climate" && a.temperature != null) { const lo = cfg.min != null ? +cfg.min : num(a.min_temp) || 7, hi = cfg.max != null ? +cfg.max : num(a.max_temp) || 35; return (+a.temperature - lo) / ((hi - lo) || 1); }
    const n = num(st.state); if (n !== null) return scale(n, cfg);
    return cfg.level != null ? +cfg.level : 0.8;
  }
  function scale(v, cfg) { const lo = cfg.min != null ? +cfg.min : 0, hi = cfg.max != null ? +cfg.max : 100; return (v - lo) / ((hi - lo) || 1); }
  const clamp = (v) => Math.max(0, Math.min(1, isNaN(v) ? 0.8 : v));

  /* ---------- the card ---------- */
  class DeviceArtCard extends HTMLElement {
    static getConfigElement() { return document.createElement("device-art-card-editor"); }
    static getStubConfig(hass) {
      const ents = hass ? Object.keys(hass.states).filter((e) => e.indexOf("light.") === 0) : [];
      return { art: "pendant/globe", entity: ents[0] || "light.your_light" };
    }
    setConfig(config) {
      if (!config || !config.art) throw new Error("Set 'art' to a drawing, for example art: pendant/globe");
      const mv = !ITEMS[String(config.art).trim()] && moved(config.art);
      if (mv) config = Object.assign({}, config, { art: mv[0], options: Object.assign({}, mv[1], config.options || {}) });
      const key = resolve(config.art);
      if (!key) throw new Error("Unknown art: " + config.art);
      this._config = Object.assign({ show_name: true, show_state: true, animate: true, scenery: true }, config);
      this._key = key; this._last = null;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      this._build();
      this._update(true);
    }
    set hass(h) { this._hass = h; this._update(false); }
    get hass() { return this._hass; }
    getCardSize() { return this._config && this._config.show_name === false ? 3 : 4; }
    getGridOptions() { return { columns: 6, rows: 4, min_columns: 3, min_rows: 2 }; }
    _build() {
      const root = this.shadowRoot, card = customElements.get("ha-card") ? document.createElement("ha-card") : document.createElement("div");
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = cssFor(this._key) + `
:host{display:block}
.dac{position:relative;display:flex;flex-direction:column;align-items:stretch;gap:6px;padding:12px;cursor:pointer;height:100%;box-sizing:border-box}
.dac.static{cursor:default}
.art{position:relative;width:100%;aspect-ratio:1/1;max-height:var(--dac-art-height,none);margin:0 auto}
.art svg{width:100%;height:100%;display:block;position:relative;z-index:1}
.glow{position:absolute;inset:-12%;border-radius:50%;pointer-events:none;z-index:0;filter:blur(8px)}
.info{display:flex;justify-content:space-between;align-items:baseline;gap:8px;min-height:1.2em}
.name{font-weight:500;font-size:14px;color:var(--primary-text-color,#e8e8f0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.state{font-size:12px;color:var(--secondary-text-color,#9a9ab0);white-space:nowrap}
.warn{font-size:12px;color:var(--error-color,#db4437);padding:8px}`;
      card.className = "hda-card";
      card.innerHTML = `<div class="dac"><div class="art"><div class="glow"></div><div class="svg"></div></div><div class="info"><span class="name"></span><span class="state"></span></div></div>`;
      root.appendChild(style); root.appendChild(card);
      this._els = { wrap: card.querySelector(".dac"), art: card.querySelector(".svg"), glow: card.querySelector(".glow"), name: card.querySelector(".name"), state: card.querySelector(".state"), info: card.querySelector(".info") };
      this._els.wrap.addEventListener("click", () => this._tap());
    }
    _reduced() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
    _compute() {
      const c = this._config, h = this._hass, it = ITEMS[this._key];
      const st = h && c.entity ? h.states[c.entity] : null;
      const on = c.entity ? entityOn(st, c) : (c.on !== false);
      const level = clamp(c.entity ? entityLevel(st, c) : (c.level != null ? +c.level : 0.8));
      let color = c.color || null;
      if (!color && st && st.attributes && st.attributes.rgb_color && it.ic && /light/i.test(it.ic.colorLabel || "")) color = toHex(st.attributes.rgb_color);
      const opt = Object.assign({}, c.options || {});
      const from = c.options_from || {};
      Object.keys(from).forEach((id) => {
        const spec = typeof from[id] === "string" ? { entity: from[id] } : from[id] || {};
        const es = h && spec.entity ? h.states[spec.entity] : null; if (!es) return;
        const s = String(es.state), op = it.ic && (it.ic.options || []).filter((x) => x.id === id)[0];
        let v = spec.map && spec.map[s] != null ? spec.map[s] : null;
        if (v == null && op) { const m = op.values.filter((x) => String(x[0]).toLowerCase() === s.toLowerCase() || String(x[1]).toLowerCase() === s.toLowerCase())[0]; if (m) v = m[0]; }
        if (v != null) opt[id] = v;
      });
      // parts: { id: entity } (or { entity, map } for a stage part). multi_function: true = each part follows its own
      // entity and a part left out stays closed / off / blank; else the parts without an entity follow the main one.
      // part_names: { id: name } (your own names, e.g. a rack's drawers). A light part's brightness and color follow it.
      const mf = !!c.multi_function, parts = {}, pval = {}, plevel = {}, pcolor = {};
      const P = (it.ic && it.ic.parts) || [];
      P.forEach((p) => {
        const spec = c.parts && c.parts[p.id], sp = typeof spec === "string" ? { entity: spec } : spec || {};
        const es = h && sp.entity ? h.states[sp.entity] : null, ty = ptype(p.type);
        if (!sp.entity) { if (!mf && ty === "switch") parts[p.id] = on; return; }
        // attribute: read that attribute of the entity instead of its state (climate.x's hvac_action, current_temperature…)
        const at = typeof sp.attribute === "string" && sp.attribute ? sp.attribute : null;
        const raw = !es ? null : at ? (es.attributes || {})[at] : es.state;
        if (ty === "value") { const n = num(raw); if (n !== null) pval[p.id] = n; return; }
        if (ty === "stage") {
          const s = raw == null ? "" : String(raw); let v = sp.map && sp.map[s] != null ? String(sp.map[s]) : null;
          if (v == null) { const m = (p.values || []).filter((x) => String(x[0]).toLowerCase() === s.toLowerCase() || String(x[1]).toLowerCase() === s.toLowerCase())[0]; if (m) v = String(m[0]); }
          if (v != null) pval[p.id] = v; return;
        }
        if (at) {   // (an attribute: on when it's one of on_states, else an "on" word or a number above 0)
          const s = raw == null ? "" : String(raw).toLowerCase(), n = num(raw);
          parts[p.id] = sp.on_states ? [].concat(sp.on_states).map((x) => String(x).toLowerCase()).indexOf(s) >= 0 : raw === true || ON.indexOf(s) >= 0 || (n !== null && n > 0);
          return;
        }
        parts[p.id] = entityOn(es, sp.on_states ? { on_states: sp.on_states } : {});
        const a = (es && es.attributes) || {};
        if (a.brightness != null) plevel[p.id] = (+a.brightness || 0) / 255; else if (a.percentage != null) plevel[p.id] = (+a.percentage || 0) / 100;
        if (a.rgb_color) pcolor[p.id] = toHex(a.rgb_color);
      });
      if (mf || P.length) { const k = (it.ic.options || []).some((x) => x.id === "kit"); if (k && !(c.options && c.options.kit)) opt.kit = mf ? "light" : "none"; }
      // one device: the doors follow its door / contact (open, opening)
      const dom = st ? st.entity_id.split(".")[0] : "", s0 = st ? String(st.state).toLowerCase() : "";
      const open = !mf && !!st && (dom === "binary_sensor" || dom === "cover") && (s0 === "on" || s0 === "open" || s0 === "opening");
      return { on, level, color, color2: c.color2 || null, opt, parts, st, anim: c.animate !== false && !this._reduced(), bg: c.scenery !== false,
        plant: c.plant, pot: c.pot, pot_color: c.pot_color, mf, open, pval, plevel, pcolor, pname: c.part_names || null };
    }
    _update(force) {
      if (!this._config || !this._els) return;
      const s = this._compute(), c = this._config, it = ITEMS[this._key];
      const stKey = s.st ? s.st.state + JSON.stringify(s.st.attributes || {}) : "";
      const key = JSON.stringify([s.on, Math.round(s.level * 100), s.color, s.color2, s.opt, s.parts, s.anim, s.bg, stKey, this._hass ? 1 : 0, s.mf, s.open, s.pval, s.plevel, s.pcolor, s.pname]);
      if (!force && key === this._last) return;
      this._last = key;
      const e = this._els;
      e.wrap.classList.toggle("hda-anim", s.anim);
      e.wrap.classList.toggle("hda-nobg", !s.bg);
      e.wrap.classList.toggle("static", this._action() === "none");
      e.art.innerHTML = render(this._key, s);
      const g = it.ic && it.ic.glow;
      if (g && s.on) { const col = s.color || (it.ic.colors && it.ic.colors[0]) || "#ffd8a8";
        e.glow.style.background = `radial-gradient(circle at ${g.x * 100}% ${g.y * 100}%, ${H.rgba(col, 0.35 * (0.3 + 0.7 * s.level))}, ${H.rgba(col, 0)} ${Math.round(45 * (g.r || 1))}%)`; e.glow.style.display = ""; }
      else e.glow.style.display = "none";
      const name = c.name || (s.st && s.st.attributes && s.st.attributes.friendly_name) || it.name || "";
      e.name.textContent = c.show_name === false ? "" : name;
      let state = "";
      if (c.show_state !== false) {
        if (c.entity && !s.st) state = "Not found";
        else if (s.st) { const h = this._hass; state = h && h.formatEntityState ? h.formatEntityState(s.st) : s.st.state; }
        else state = s.on ? (it.set.onWord || "On") : (it.set.offWord || "Off");
      }
      e.state.textContent = state;
      e.info.style.display = c.show_name === false && c.show_state === false ? "none" : "";
    }
    _action() { const t = this._config.tap_action; const a = typeof t === "string" ? t : t && t.action; if (a) return a;
      const d = (this._config.entity || "").split(".")[0];
      return ["light", "switch", "fan", "input_boolean", "cover", "media_player", "siren", "humidifier", "climate", "vacuum", "valve", "water_heater", "lock"].indexOf(d) >= 0 && d !== "lock" && d !== "climate" ? "toggle" : this._config.entity ? "more-info" : "none"; }
    _tap() {
      const a = this._action(), c = this._config, h = this._hass;
      if (a === "none" || !c.entity) return;
      if (a === "toggle" && h) { h.callService("homeassistant", "toggle", { entity_id: c.entity }); return; }
      if (a === "more-info") { const ev = new Event("hass-more-info", { bubbles: true, composed: true }); ev.detail = { entityId: c.entity }; this.dispatchEvent(ev); }
    }
  }
  if (!customElements.get("device-art-card")) customElements.define("device-art-card", DeviceArtCard);

  /* ---------- a small visual editor: category, group, drawing, entity ---------- */
  class DeviceArtCardEditor extends HTMLElement {
    setConfig(config) { this._config = Object.assign({}, config); this._render(); }
    set hass(h) { this._hass = h; const p = this.querySelector("ha-entity-picker"); if (p) p.hass = h; }
    _fire() { const ev = new Event("config-changed", { bubbles: true, composed: true }); ev.detail = { config: this._config }; this.dispatchEvent(ev); }
    _render() {
      const c = this._config || {}, key = resolve(c.art) || ORDER[0], it = ITEMS[key];
      const cat = it ? it.cat : CATALOG[0].id, catO = CATALOG.filter((x) => x.id === cat)[0] || CATALOG[0];
      const sub = it ? it.sub : catO.subs[0].id, subO = catO.subs.filter((x) => x.id === sub)[0] || catO.subs[0];
      const opt = (v, l, sel) => `<option value="${esc(v)}"${sel ? " selected" : ""}>${esc(l)}</option>`;
      this.innerHTML = `<style>.dace{display:grid;gap:10px}.dace label{display:grid;gap:4px;font-size:13px}.dace select,.dace input{padding:6px;font:inherit}</style>
<div class="dace">
<label>Category<select data-k="cat">${CATALOG.map((x) => opt(x.id, x.name, x.id === catO.id)).join("")}</select></label>
<label>Group<select data-k="sub">${catO.subs.map((x) => opt(x.id, x.name, x.id === subO.id)).join("")}</select></label>
<label>Drawing<select data-k="art">${subO.items.filter((k) => ITEMS[k]).map((k) => opt(k, ITEMS[k].name, k === key)).join("")}</select></label>
<label>Entity<span class="ent"></span></label>
<label>Name<input data-k="name" value="${esc(c.name || "")}"></label>
<label><span><input type="checkbox" data-k="scenery"${c.scenery === false ? "" : " checked"}> Scenery</span></label>
</div>`;
      const host = this.querySelector(".ent");
      if (customElements.get("ha-entity-picker")) { const p = document.createElement("ha-entity-picker"); p.hass = this._hass; p.value = c.entity || ""; p.allowCustomEntity = true;
        p.addEventListener("value-changed", (e) => { this._config.entity = e.detail.value; this._fire(); }); host.appendChild(p); }
      else { host.innerHTML = `<input data-k="entity" value="${esc(c.entity || "")}" placeholder="light.your_light">`; }
      this.querySelectorAll("select,input").forEach((el) => el.addEventListener("change", () => {
        const k = el.dataset.k; if (!k) return;
        if (k === "cat") { const co = CATALOG.filter((x) => x.id === el.value)[0]; const first = co.subs[0].items.filter((i) => ITEMS[i])[0]; if (first) this._config.art = first; }
        else if (k === "sub") { const so = catO.subs.filter((x) => x.id === el.value)[0]; const first = so && so.items.filter((i) => ITEMS[i])[0]; if (first) this._config.art = first; }
        else if (k === "scenery") { if (el.checked) delete this._config.scenery; else this._config.scenery = false; }
        else if (el.value === "") delete this._config[k]; else this._config[k] = el.value;
        this._fire(); this._render();
      }));
    }
  }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  if (!customElements.get("device-art-card-editor")) customElements.define("device-art-card-editor", DeviceArtCardEditor);

  /* version line in the browser console, so anyone can check which release they are running */
  const VERSION = "1.3.0";
  console.info("%c DEVICE-ART-CARD %c v" + VERSION + " · " + Object.keys(ITEMS).length + " drawings ", "background:#7c5cff;color:#fff;font-weight:700;border-radius:3px 0 0 3px", "background:#2a1f5c;color:#fff;border-radius:0 3px 3px 0");
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "device-art-card"))
    window.customCards.push({ type: "device-art-card", name: "Device Art Card", description: "A detailed drawing of your device that follows its state: lights glow, fans spin, screens light up.", preview: true, documentationURL: "https://github.com/almulder/ha-device-art" });
})();
