// charts.js — hand-drawn SVG bar charts. No library, no canvas, no network:
// every chart is plain SVG built from the numbers in data.js.

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Horizontal bar chart. rows: [{label, value, display, href?, highlight?}]
export function barChart(rows, { maxValue = null, barColor = '#0b5fff', highlightColor = '#e8590c' } = {}) {
  const max = maxValue || Math.max(...rows.map((r) => r.value));
  const rowH = 34;
  const height = rows.length * rowH + 8;
  const bars = rows.map((r, i) => {
    const y = 8 + i * rowH;
    const w = Math.max(2, (r.value / max) * 100);
    const color = r.highlight ? highlightColor : barColor;
    const label = `<text x="0" y="${y + 15}" class="chart-label">${escapeHtml(r.label)}</text>`;
    const bar = `<rect x="150" y="${y}" width="${(w * 4.0).toFixed(1)}" height="20" rx="4" fill="${color}"><title>${escapeHtml(r.label)}: ${escapeHtml(r.display)}</title></rect>`;
    const val = `<text x="${(150 + w * 4.0 + 8).toFixed(1)}" y="${y + 15}" class="chart-value">${escapeHtml(r.display)}</text>`;
    const inner = label + bar + val;
    return r.href ? `<a href="${r.href}">${inner}</a>` : `<g>${inner}</g>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 640 ${height}" role="img" aria-label="Bar chart">${bars}</svg>`;
}

// Small "share of world" meter: a 0-100% bar with a marker.
export function shareMeter(percent, label) {
  const pct = Math.max(0.4, Math.min(100, percent));
  return `<div class="meter" role="img" aria-label="${escapeHtml(label)}: ${percent.toFixed(1)} percent of the world">
    <div class="meter-track"><div class="meter-fill" style="width:${pct.toFixed(1)}%"></div></div>
    <div class="meter-caption"><span>${escapeHtml(label)}</span><strong>${percent.toFixed(1)}% of world</strong></div>
  </div>`;
}
