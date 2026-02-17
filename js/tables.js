/* ============================================================
   Tables — Sortable HTML table generator
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  SR.createTable = function (container, tableDef) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';

    var table = document.createElement('table');
    table.className = 'report-table';

    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    var sortState = { col: -1, asc: true };

    tableDef.headers.forEach(function (h, idx) {
      var th = document.createElement('th');
      th.innerHTML = h + ' <span class="sort-arrow">⇅</span>';
      th.addEventListener('click', function () {
        if (sortState.col === idx) { sortState.asc = !sortState.asc; }
        else { sortState.col = idx; sortState.asc = true; }
        renderBody();
        headRow.querySelectorAll('.sort-arrow').forEach(function (s, si) {
          s.className = 'sort-arrow' + (si === idx ? ' active' : '');
          s.textContent = si === idx ? (sortState.asc ? '↑' : '↓') : '⇅';
        });
      });
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    var rows = tableDef.rows.slice();

    function parseNum(s) {
      if (typeof s !== 'string') return NaN;
      var cleaned = s.replace(/[,$%+−\u2212]/g, '').replace(/[a-zA-Z\s"'()…]/g, '').trim();
      return parseFloat(cleaned);
    }

    function renderBody() {
      var sorted = rows.slice();
      if (sortState.col >= 0) {
        var col = sortState.col;
        var asc = sortState.asc;
        sorted.sort(function (a, b) {
          var va = parseNum(a[col]), vb = parseNum(b[col]);
          if (!isNaN(va) && !isNaN(vb)) return asc ? va - vb : vb - va;
          var sa = (a[col] || '').toString(), sb = (b[col] || '').toString();
          return asc ? sa.localeCompare(sb) : sb.localeCompare(sa);
        });
      }
      tbody.innerHTML = '';
      sorted.forEach(function (row) {
        var tr = document.createElement('tr');
        row.forEach(function (cell, ci) {
          var td = document.createElement('td');
          td.textContent = cell;
          var num = parseNum(cell);
          if (ci > 0 && !isNaN(num)) {
            if (cell.indexOf('+') === 0 || num > 0 && (cell.indexOf('−') === -1 && cell.indexOf('-') === -1)) {
              if (cell.indexOf('+') === 0) td.classList.add('cell-good');
            }
            if (cell.indexOf('−') === 0 || cell.indexOf('-') === 0) {
              if (cell.match(/^[−-]/)) td.classList.add('cell-bad');
            }
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    renderBody();
    wrapper.appendChild(table);
    container.appendChild(wrapper);
  };

})(window.SurveyReport);
