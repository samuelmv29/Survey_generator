/* ============================================================
   Sidebar — Navigation panel with search and bookmarks
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  SR.Sidebar = {
    init: function () {
      this.nav = document.getElementById('sidebar-nav');
      this.searchInput = document.getElementById('sidebar-search');
      this.render();
      this.bindSearch();
    },

    render: function (filter) {
      var self = this;
      this.nav.innerHTML = '';
      var filterLower = (filter || '').toLowerCase();

      SR.sections.forEach(function (section, idx) {
        if (filterLower && section.title.toLowerCase().indexOf(filterLower) === -1) return;

        var item = document.createElement('div');
        item.className = 'nav-item';
        item.setAttribute('data-section', section.id);

        var icon = document.createElement('span');
        icon.className = 'nav-icon';
        icon.textContent = section.icon;

        var label = document.createElement('span');
        label.textContent = section.title;

        var num = document.createElement('span');
        num.className = 'nav-num';
        num.textContent = (idx + 1) + '/' + SR.sections.length;

        item.appendChild(icon);
        item.appendChild(label);

        if (SR.Storage.isBookmarked(section.id)) {
          var dot = document.createElement('span');
          dot.className = 'bookmark-dot';
          item.appendChild(dot);
        }

        item.appendChild(num);

        item.addEventListener('click', function () {
          SR.Router.navigate(section.id);
        });

        self.nav.appendChild(item);
      });

      this.updateActive(SR.Router.currentSection);
    },

    updateActive: function (sectionId) {
      var items = this.nav.querySelectorAll('.nav-item');
      items.forEach(function (item) {
        item.classList.toggle('active', item.getAttribute('data-section') === sectionId);
      });
    },

    bindSearch: function () {
      var self = this;
      this.searchInput.addEventListener('input', function () {
        self.render(this.value);
      });
    }
  };

})(window.SurveyReport);
