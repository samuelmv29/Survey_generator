/* ============================================================
   Charts — SVG-based chart engine (zero dependencies)
   Supports: bar, hbar, line, donut, gauge, likert, grouped bar
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  var COLORS = SR.CHART_COLORS;
  var ns = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, text) {
    var e = document.createElementNS(ns, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function isDark() { return document.body.classList.contains('dark'); }
  function textColor() { return isDark() ? '#e2e8f0' : '#2d3748'; }
  function mutedColor() { return isDark() ? '#a0aec0' : '#718096'; }
  function gridColor() { return isDark() ? '#4a5568' : '#e2e8f0'; }

  function makeLegend(items) {
    var div = document.createElement('div');
    div.className = 'chart-legend';
    items.forEach(function (item) {
      var span = document.createElement('span');
      span.className = 'legend-item';
      span.innerHTML = '<span class="legend-swatch" style="background:' + item.color + '"></span>' + item.label;
      div.appendChild(span);
    });
    return div;
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log10(v)));
    var norm = v / mag;
    if (norm <= 1) return mag;
    if (norm <= 2) return 2 * mag;
    if (norm <= 5) return 5 * mag;
    return 10 * mag;
  }

  function gridLines(svg, x, y, w, h, max, steps, horizontal) {
    for (var i = 0; i <= steps; i++) {
      var val = (max / steps) * i;
      if (horizontal) {
        var px = x + (val / max) * w;
        svg.appendChild(el('line', { x1: px, y1: y, x2: px, y2: y + h, stroke: gridColor(), 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(el('text', { x: px, y: y + h + 14, 'text-anchor': 'middle', fill: mutedColor(), 'font-size': '11' }, formatVal(val)));
      } else {
        var py = y + h - (val / max) * h;
        svg.appendChild(el('line', { x1: x, y1: py, x2: x + w, y2: py, stroke: gridColor(), 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
        svg.appendChild(el('text', { x: x - 6, y: py + 4, 'text-anchor': 'end', fill: mutedColor(), 'font-size': '11' }, formatVal(val)));
      }
    }
  }

  function formatVal(v) {
    if (v >= 1000) return (v / 1000).toFixed(0) + 'k';
    if (v % 1 !== 0) return v.toFixed(1);
    return '' + v;
  }

  /* ---- Bar Chart ---- */
  SR.createBarChart = function (container, chartDef) {
    var data = chartDef.data;
    var grouped = chartDef.grouped;
    var n = data.length;
    var ml = 50, mr = 20, mt = 10, mb = 50;
    var W = 600, H = 280;
    var cw = W - ml - mr, ch = H - mt - mb;

    var maxVal;
    if (grouped) {
      maxVal = niceMax(Math.max.apply(null, data.map(function (d) { return Math.max(d.value, d.peer || 0); })));
    } else {
      maxVal = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; })));
    }

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid meet' });
    gridLines(svg, ml, mt, cw, ch, maxVal, 5, false);

    var barW = grouped ? (cw / n) * 0.35 : (cw / n) * 0.6;
    var gap = cw / n;

    data.forEach(function (d, i) {
      var x = ml + i * gap + (gap - barW * (grouped ? 2.2 : 1)) / 2;
      var h = (d.value / maxVal) * ch;
      var r = el('rect', {
        x: x, y: mt + ch - h, width: barW, height: h,
        fill: d.color || COLORS[i % COLORS.length], rx: 3, opacity: 0
      });
      r.innerHTML = '<animate attributeName="opacity" from="0" to="0.9" dur="0.4s" begin="' + (i * 0.04) + 's" fill="freeze"/>' +
        '<animate attributeName="height" from="0" to="' + h + '" dur="0.4s" begin="' + (i * 0.04) + 's" fill="freeze"/>' +
        '<animate attributeName="y" from="' + (mt + ch) + '" to="' + (mt + ch - h) + '" dur="0.4s" begin="' + (i * 0.04) + 's" fill="freeze"/>';
      svg.appendChild(r);

      svg.appendChild(el('text', {
        x: x + barW / 2, y: mt + ch - h - 5,
        'text-anchor': 'middle', fill: textColor(), 'font-size': '11', 'font-weight': '600'
      }, formatVal(d.value)));

      if (grouped && d.peer !== undefined) {
        var x2 = x + barW * 1.2;
        var h2 = (d.peer / maxVal) * ch;
        svg.appendChild(el('rect', {
          x: x2, y: mt + ch - h2, width: barW, height: h2,
          fill: '#a0aec0', rx: 3, opacity: 0.7
        }));
        svg.appendChild(el('text', {
          x: x2 + barW / 2, y: mt + ch - h2 - 5,
          'text-anchor': 'middle', fill: mutedColor(), 'font-size': '10'
        }, formatVal(d.peer)));
      }

      var labelX = grouped ? x + barW * 1.1 : x + barW / 2;
      var lbl = el('text', {
        x: labelX, y: mt + ch + 16,
        'text-anchor': 'middle', fill: mutedColor(), 'font-size': '11'
      }, d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label);
      svg.appendChild(lbl);
    });

    var wrap = document.createElement('div');
    wrap.className = 'chart-container';
    wrap.appendChild(svg);
    if (grouped) {
      wrap.appendChild(makeLegend([
        { label: 'Lakewood', color: COLORS[0] },
        { label: 'Peer Avg', color: '#a0aec0' }
      ]));
    }
    container.appendChild(wrap);
  };

  /* ---- Horizontal Bar Chart ---- */
  SR.createHBarChart = function (container, chartDef) {
    var data = chartDef.data;
    var n = data.length;
    var ml = 140, mr = 50, mt = 10, mb = 10;
    var rowH = 30;
    var H = mt + mb + n * rowH;
    var W = 600;
    var cw = W - ml - mr;

    var maxVal = niceMax(Math.max.apply(null, data.map(function (d) { return Math.abs(d.value); })));
    var hasNeg = data.some(function (d) { return d.value < 0; });

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid meet' });

    data.forEach(function (d, i) {
      var y = mt + i * rowH;
      var val = Math.abs(d.value);
      var w = (val / maxVal) * cw;
      var color = d.value < 0 ? '#e53e3e' : (d.color || COLORS[i % COLORS.length]);

      svg.appendChild(el('text', {
        x: ml - 8, y: y + rowH / 2 + 4,
        'text-anchor': 'end', fill: textColor(), 'font-size': '12'
      }, d.label));

      svg.appendChild(el('rect', {
        x: ml, y: y + 4, width: 0, height: rowH - 8,
        fill: color, rx: 3, opacity: 0.85
      }));

      var bar = svg.lastChild;
      bar.innerHTML = '<animate attributeName="width" from="0" to="' + w + '" dur="0.4s" begin="' + (i * 0.03) + 's" fill="freeze"/>';

      svg.appendChild(el('text', {
        x: ml + w + 6, y: y + rowH / 2 + 4,
        fill: textColor(), 'font-size': '11', 'font-weight': '600'
      }, (d.value < 0 ? '' : '') + formatVal(d.value)));
    });

    var wrap = document.createElement('div');
    wrap.className = 'chart-container';
    wrap.appendChild(svg);
    container.appendChild(wrap);
  };

  /* ---- Line Chart ---- */
  SR.createLineChart = function (container, chartDef) {
    var multiline = chartDef.multiline && chartDef.series;
    var seriesList = multiline ? chartDef.series : [{ name: '', color: COLORS[0], data: chartDef.data }];
    var ml = 50, mr = 40, mt = 20, mb = 40;
    var W = 600, H = 260;
    var cw = W - ml - mr, ch = H - mt - mb;

    var allVals = [];
    seriesList.forEach(function (s) { s.data.forEach(function (d) { allVals.push(d.value); }); });
    var minVal = Math.min.apply(null, allVals);
    var maxVal = Math.max.apply(null, allVals);
    var range = maxVal - minVal || 1;
    var padded_min = minVal - range * 0.1;
    var padded_max = maxVal + range * 0.1;
    var padded_range = padded_max - padded_min;

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid meet' });

    var steps = 5;
    for (var i = 0; i <= steps; i++) {
      var val = padded_min + (padded_range / steps) * i;
      var py = mt + ch - ((val - padded_min) / padded_range) * ch;
      svg.appendChild(el('line', { x1: ml, y1: py, x2: ml + cw, y2: py, stroke: gridColor(), 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
      svg.appendChild(el('text', { x: ml - 6, y: py + 4, 'text-anchor': 'end', fill: mutedColor(), 'font-size': '11' }, val.toFixed(1)));
    }

    var labels = seriesList[0].data;
    labels.forEach(function (d, idx) {
      var x = ml + (idx / (labels.length - 1)) * cw;
      svg.appendChild(el('text', { x: x, y: H - 8, 'text-anchor': 'middle', fill: mutedColor(), 'font-size': '11' }, d.label));
    });

    seriesList.forEach(function (series) {
      var pts = series.data.map(function (d, idx) {
        var x = ml + (idx / (series.data.length - 1)) * cw;
        var y = mt + ch - ((d.value - padded_min) / padded_range) * ch;
        return { x: x, y: y, value: d.value };
      });

      var pathD = pts.map(function (p, idx) { return (idx === 0 ? 'M' : 'L') + p.x + ',' + p.y; }).join(' ');
      svg.appendChild(el('path', {
        d: pathD, fill: 'none', stroke: series.color, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
      }));

      pts.forEach(function (p) {
        svg.appendChild(el('circle', { cx: p.x, cy: p.y, r: 4, fill: series.color, stroke: '#fff', 'stroke-width': 2 }));
        svg.appendChild(el('text', {
          x: p.x, y: p.y - 10, 'text-anchor': 'middle', fill: textColor(), 'font-size': '11', 'font-weight': '600'
        }, formatVal(p.value)));
      });
    });

    var wrap = document.createElement('div');
    wrap.className = 'chart-container';
    wrap.appendChild(svg);
    if (multiline) {
      wrap.appendChild(makeLegend(seriesList.map(function (s) { return { label: s.name, color: s.color }; })));
    }
    container.appendChild(wrap);
  };

  /* ---- Donut Chart ---- */
  SR.createDonutChart = function (container, chartDef) {
    var data = chartDef.data;
    var total = data.reduce(function (s, d) { return s + d.value; }, 0);
    var cx = 130, cy = 130, r = 100, inner = 60;
    var W = 260, H = 260;

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid meet' });
    var angle = -90;

    data.forEach(function (d) {
      var sweep = (d.value / total) * 360;
      var startRad = (angle * Math.PI) / 180;
      var endRad = ((angle + sweep) * Math.PI) / 180;

      var x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad);
      var x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad);
      var ix1 = cx + inner * Math.cos(startRad), iy1 = cy + inner * Math.sin(startRad);
      var ix2 = cx + inner * Math.cos(endRad), iy2 = cy + inner * Math.sin(endRad);
      var largeArc = sweep > 180 ? 1 : 0;

      var pathD = 'M' + x1 + ',' + y1 +
        ' A' + r + ',' + r + ' 0 ' + largeArc + ',1 ' + x2 + ',' + y2 +
        ' L' + ix2 + ',' + iy2 +
        ' A' + inner + ',' + inner + ' 0 ' + largeArc + ',0 ' + ix1 + ',' + iy1 + ' Z';

      var path = el('path', { d: pathD, fill: d.color || COLORS[data.indexOf(d) % COLORS.length], opacity: 0.9 });
      svg.appendChild(path);

      var midRad = ((angle + sweep / 2) * Math.PI) / 180;
      var lx = cx + (r + 18) * Math.cos(midRad);
      var ly = cy + (r + 18) * Math.sin(midRad);
      if (sweep > 25) {
        svg.appendChild(el('text', {
          x: lx, y: ly + 4, 'text-anchor': 'middle', fill: textColor(), 'font-size': '11', 'font-weight': '600'
        }, d.value + '%'));
      }

      angle += sweep;
    });

    svg.appendChild(el('text', {
      x: cx, y: cy - 4, 'text-anchor': 'middle', fill: textColor(), 'font-size': '22', 'font-weight': '700'
    }, total > 100 ? '' + total : ''));
    svg.appendChild(el('text', {
      x: cx, y: cy + 14, 'text-anchor': 'middle', fill: mutedColor(), 'font-size': '11'
    }, total > 100 ? 'total' : ''));

    var wrap = document.createElement('div');
    wrap.className = 'chart-container';
    wrap.style.maxWidth = '300px';
    wrap.style.margin = '0 auto';
    wrap.appendChild(svg);
    wrap.appendChild(makeLegend(data.map(function (d, i) {
      return { label: d.label + ' (' + d.value + (total <= 100 ? '%' : '') + ')', color: d.color || COLORS[i % COLORS.length] };
    })));
    container.appendChild(wrap);
  };

  /* ---- Gauge Chart ---- */
  SR.createGauge = function (container, chartDef) {
    var val = chartDef.data.value;
    var max = chartDef.data.max || 5;
    var pct = val / max;
    var W = 200, H = 130;
    var cx = 100, cy = 110, r = 80;
    var startAngle = Math.PI;
    var endAngle = 0;
    var valAngle = startAngle + (endAngle - startAngle) * pct;

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid meet' });

    svg.appendChild(el('path', {
      d: describeArc(cx, cy, r, startAngle, endAngle),
      fill: 'none', stroke: gridColor(), 'stroke-width': 14, 'stroke-linecap': 'round'
    }));

    var color = pct < 0.5 ? '#e53e3e' : pct < 0.7 ? '#ff9100' : pct < 0.85 ? '#2c7be5' : '#00c853';
    svg.appendChild(el('path', {
      d: describeArc(cx, cy, r, startAngle, valAngle),
      fill: 'none', stroke: color, 'stroke-width': 14, 'stroke-linecap': 'round'
    }));

    svg.appendChild(el('text', {
      x: cx, y: cy - 10, 'text-anchor': 'middle', fill: textColor(), 'font-size': '28', 'font-weight': '700'
    }, val.toFixed(2)));
    svg.appendChild(el('text', {
      x: cx, y: cy + 8, 'text-anchor': 'middle', fill: mutedColor(), 'font-size': '12'
    }, 'out of ' + max));

    var wrap = document.createElement('div');
    wrap.className = 'chart-container gauge-wrap';
    wrap.style.maxWidth = '220px';
    wrap.style.margin = '0 auto';
    wrap.appendChild(svg);
    container.appendChild(wrap);
  };

  function describeArc(cx, cy, r, startAngle, endAngle) {
    var x1 = cx + r * Math.cos(startAngle);
    var y1 = cy + r * Math.sin(startAngle);
    var x2 = cx + r * Math.cos(endAngle);
    var y2 = cy + r * Math.sin(endAngle);
    var large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    return 'M' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 0 ' + large + ',1 ' + x2 + ',' + y2;
  }

  /* ---- Likert Chart ---- */
  SR.createLikertChart = function (container, likertDef) {
    var items = likertDef.data;
    var labels = SR.LIKERT_LABELS;
    var colors = SR.LIKERT_COLORS;

    var wrap = document.createElement('div');

    items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'likert-row';

      var lbl = document.createElement('div');
      lbl.className = 'likert-label';
      lbl.textContent = item.label;
      row.appendChild(lbl);

      var track = document.createElement('div');
      track.className = 'likert-bar-track';

      var agreeTotal = item.segments[0] + item.segments[1];

      item.segments.forEach(function (pct, idx) {
        var seg = document.createElement('div');
        seg.className = 'likert-segment';
        seg.style.width = pct + '%';
        seg.style.background = colors[idx];
        seg.title = labels[idx] + ': ' + pct + '%';
        track.appendChild(seg);
      });

      row.appendChild(track);

      var pctEl = document.createElement('div');
      pctEl.className = 'likert-pct';
      pctEl.textContent = agreeTotal + '%';
      pctEl.title = 'Agree + Strongly Agree';
      row.appendChild(pctEl);

      wrap.appendChild(row);
    });

    wrap.appendChild(makeLegend(labels.map(function (l, i) { return { label: l, color: colors[i] }; })));
    container.appendChild(wrap);
  };

  /* ---- Render a chart by type ---- */
  SR.renderChart = function (container, chartDef) {
    switch (chartDef.type) {
      case 'bar': SR.createBarChart(container, chartDef); break;
      case 'hbar': SR.createHBarChart(container, chartDef); break;
      case 'line': SR.createLineChart(container, chartDef); break;
      case 'donut': SR.createDonutChart(container, chartDef); break;
      case 'gauge': SR.createGauge(container, chartDef); break;
      default: container.textContent = 'Unknown chart type: ' + chartDef.type;
    }
  };

})(window.SurveyReport);
