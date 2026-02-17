/* ============================================================
   Export — One-click static HTML export with all content inlined
   Converts the SPA into a self-contained, offline-ready HTML file
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  SR.Export = {

    exportHTML: function () {
      var overlay = this.showProgress('Generating full report…');
      var self = this;

      setTimeout(function () {
        try {
          var html = self.buildStaticHTML();
          self.downloadFile(html, 'Lakewood_Faculty_Survey_2025.html', 'text/html');
          self.hideProgress(overlay);
          SR.App.toast('Report exported successfully!');
        } catch (e) {
          self.hideProgress(overlay);
          SR.App.toast('Export failed: ' + e.message);
          console.error(e);
        }
      }, 100);
    },

    buildStaticHTML: function () {
      var tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1100px';
      document.body.appendChild(tempContainer);

      SR.renderAllPages(tempContainer);

      var renderedContent = tempContainer.innerHTML;
      document.body.removeChild(tempContainer);

      var css = this.gatherCSS();
      var toc = this.buildTOC();

      var html = '<!DOCTYPE html>\n' +
        '<html lang="en">\n<head>\n' +
        '<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        '<title>Faculty Survey Report 2025 — Lakewood University</title>\n' +
        '<style>\n' + css + '\n' +
        this.exportStyles() + '\n</style>\n' +
        '</head>\n<body>\n' +
        '<div class="export-wrapper">\n' +
        '<header class="export-header">\n' +
        '<h1>🎓 Lakewood University</h1>\n' +
        '<h2>Faculty Climate & Satisfaction Survey — 2025 Report</h2>\n' +
        '<p class="export-meta">Generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</p>\n' +
        '</header>\n' +
        '<nav class="export-toc">\n' +
        '<h3>Table of Contents</h3>\n' +
        toc + '\n</nav>\n' +
        '<main class="export-content">\n' +
        renderedContent + '\n' +
        '</main>\n' +
        '<footer class="export-footer">\n' +
        '<p>Confidential — Lakewood University Office of Institutional Research</p>\n' +
        '<p>Generated from the Survey Report Generator · ' + new Date().getFullYear() + '</p>\n' +
        '</footer>\n' +
        '</div>\n' +
        '</body>\n</html>';

      return html;
    },

    gatherCSS: function () {
      var css = '';
      var sheets = document.styleSheets;
      for (var i = 0; i < sheets.length; i++) {
        try {
          var rules = sheets[i].cssRules || sheets[i].rules;
          if (rules) {
            for (var j = 0; j < rules.length; j++) {
              css += rules[j].cssText + '\n';
            }
          }
        } catch (e) {
          /* cross-origin stylesheet */
        }
      }
      return css;
    },

    exportStyles: function () {
      return [
        '.export-wrapper { max-width: 1000px; margin: 0 auto; padding: 40px 30px; font-family: "Segoe UI", system-ui, sans-serif; color: #2d3748; }',
        '.export-header { text-align: center; padding: 40px 0 30px; border-bottom: 3px solid #1e3a5f; margin-bottom: 30px; }',
        '.export-header h1 { font-size: 2rem; color: #1e3a5f; margin-bottom: 4px; }',
        '.export-header h2 { font-size: 1.2rem; color: #2c7be5; font-weight: 400; margin-bottom: 8px; }',
        '.export-meta { font-size: .85rem; color: #718096; }',
        '.export-toc { background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 28px; margin-bottom: 36px; }',
        '.export-toc h3 { font-size: 1.1rem; margin-bottom: 12px; color: #1e3a5f; }',
        '.export-toc ol { padding-left: 20px; columns: 2; column-gap: 30px; }',
        '.export-toc li { margin-bottom: 6px; font-size: .88rem; break-inside: avoid; }',
        '.export-toc a { color: #2c7be5; text-decoration: none; }',
        '.export-toc a:hover { text-decoration: underline; }',
        '.export-page { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #e2e8f0; }',
        '.export-footer { text-align: center; padding: 30px 0; border-top: 2px solid #1e3a5f; margin-top: 40px; font-size: .8rem; color: #718096; }',
        '@media print { .export-toc { break-after: page; } .export-page { break-before: page; } .export-footer { break-before: page; } }',
        '.page-break { height: 0; }',
        '@media print { .page-break { page-break-before: always; height: 0; } }'
      ].join('\n');
    },

    buildTOC: function () {
      var ol = '<ol>';
      SR.sections.forEach(function (s) {
        ol += '<li><a href="#' + s.id + '">' + s.icon + ' ' + s.title + '</a></li>';
      });
      ol += '</ol>';
      return ol;
    },

    downloadFile: function (content, filename, mimeType) {
      var blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    },

    showProgress: function (msg) {
      var overlay = document.createElement('div');
      overlay.className = 'export-progress';
      overlay.innerHTML = '<div class="export-progress-inner">' +
        '<div class="spinner"></div>' +
        '<h3>' + (msg || 'Exporting…') + '</h3>' +
        '<p style="color:#718096;font-size:.85rem;">This may take a moment</p></div>';
      document.body.appendChild(overlay);
      return overlay;
    },

    hideProgress: function (overlay) {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  };

})(window.SurveyReport);
