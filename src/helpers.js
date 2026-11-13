/* Color helpers shared by every drawing set. */
window.HDAH = window.HDAH || (() => {
  const hx = (h) => { h = String(h || "#ffffff").replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); const n = parseInt(h, 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const to = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return to(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };
  const shade = (h, amt) => (amt < 0 ? mix(h, "#000000", -amt) : mix(h, "#ffffff", amt));
  const rgba = (h, a) => { const c = hx(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  return { hx, mix, shade, rgba, to };
})();
