/* ============================================================
   Pages — Renders each section's data into HTML content
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function renderKPIs(section) {
    if (!section.kpis || !section.kpis.length) return null;
    var row = h('div', 'kpi-row');
    section.kpis.forEach(function (kpi) {
      var card = h('div', 'kpi-card');
      card.appendChild(h('div', 'kpi-label', kpi.label));
      card.appendChild(h('div', 'kpi-value', kpi.value + (kpi.format || '')));

      var sub = h('div', 'kpi-sub');
      if (kpi.change !== null && kpi.change !== undefined) {
        var dir = kpi.change > 0 ? 'up' : kpi.change < 0 ? 'down' : 'flat';
        var arrow = kpi.change > 0 ? '▲' : kpi.change < 0 ? '▼' : '—';
        var changeText = kpi.change > 0 ? '+' + kpi.change : '' + kpi.change;
        sub.appendChild(h('span', 'kpi-change ' + dir, arrow + ' ' + changeText));
        if (dir !== 'flat') sub.appendChild(h('span', '', ' vs 2022'));
      }
      if (kpi.benchmark !== undefined) {
        sub.appendChild(h('span', 'kpi-benchmark', ' · Peer: ' + kpi.benchmark));
      }
      card.appendChild(sub);
      row.appendChild(card);
    });
    return row;
  }

  function renderCharts(section) {
    if (!section.charts || !section.charts.length) return null;
    var useGrid = section.charts.length === 2;
    var wrap = h('div', useGrid ? 'grid-2' : '');

    section.charts.forEach(function (chartDef) {
      var card = h('div', 'content-card');
      card.appendChild(h('div', 'card-title', chartDef.title));
      SR.renderChart(card, chartDef);
      wrap.appendChild(card);
    });
    return wrap;
  }

  function renderLikert(section) {
    if (!section.likert) return null;
    var card = h('div', 'content-card');
    card.appendChild(h('div', 'card-title', section.likert.title));
    SR.createLikertChart(card, section.likert);
    return card;
  }

  function renderTables(section) {
    if (!section.tables || !section.tables.length) return null;
    var frag = document.createDocumentFragment();
    section.tables.forEach(function (tbl) {
      var card = h('div', 'content-card');
      card.appendChild(h('div', 'card-title', tbl.title));
      SR.createTable(card, tbl);
      frag.appendChild(card);
    });
    return frag;
  }

  function renderInsights(section) {
    if (!section.insights || !section.insights.length) return null;
    var card = h('div', 'content-card');
    card.appendChild(h('div', 'card-title', '💡 Key Insights'));
    var ul = h('ul', 'insights-list');
    section.insights.forEach(function (insight) {
      ul.appendChild(h('li', '', insight));
    });
    card.appendChild(ul);
    return card;
  }

  SR.renderPage = function (container, sectionId) {
    var section = SR.sections.find(function (s) { return s.id === sectionId; });
    if (!section) {
      container.innerHTML = '<div class="content-card"><h2>Section not found</h2><p>The requested section "' + sectionId + '" does not exist.</p></div>';
      return;
    }

    container.innerHTML = '';

    container.appendChild(h('h1', 'page-title fade-in', section.icon + ' ' + section.title));
    container.appendChild(h('p', 'page-description fade-in', section.description));

    var kpis = renderKPIs(section);
    if (kpis) container.appendChild(kpis);

    var charts = renderCharts(section);
    if (charts) container.appendChild(charts);

    var likert = renderLikert(section);
    if (likert) container.appendChild(likert);

    var tables = renderTables(section);
    if (tables) container.appendChild(tables);

    var insights = renderInsights(section);
    if (insights) container.appendChild(insights);

    container.scrollTop = 0;
  };

  SR.renderAllPages = function (container) {
    container.innerHTML = '';
    SR.sections.forEach(function (section, idx) {
      if (idx > 0) {
        var pb = h('div', 'page-break');
        container.appendChild(pb);
      }
      var pageDiv = h('div', 'export-page');
      pageDiv.setAttribute('data-section', section.id);

      pageDiv.appendChild(h('h1', 'page-title', section.icon + ' ' + section.title));
      pageDiv.appendChild(h('p', 'page-description', section.description));

      var kpis = renderKPIs(section);
      if (kpis) pageDiv.appendChild(kpis);

      var charts = renderCharts(section);
      if (charts) pageDiv.appendChild(charts);

      var likert = renderLikert(section);
      if (likert) pageDiv.appendChild(likert);

      var tables = renderTables(section);
      if (tables) pageDiv.appendChild(tables);

      var insights = renderInsights(section);
      if (insights) pageDiv.appendChild(insights);

      container.appendChild(pageDiv);
    });
  };

})(window.SurveyReport);
