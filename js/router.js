/* ============================================================
   Router — Hash-based SPA navigation
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  SR.Router = {
    currentSection: null,
    currentIndex: -1,

    init: function () {
      var self = this;
      window.addEventListener('hashchange', function () { self.handleRoute(); });
      this.handleRoute();
    },

    navigate: function (sectionId) {
      window.location.hash = '#' + sectionId;
    },

    handleRoute: function () {
      var hash = window.location.hash.replace('#', '') || SR.sections[0].id;
      var idx = SR.sections.findIndex(function (s) { return s.id === hash; });
      if (idx === -1) { hash = SR.sections[0].id; idx = 0; }

      this.currentSection = hash;
      this.currentIndex = idx;

      SR.renderPage(document.getElementById('page-content'), hash);
      SR.Sidebar.updateActive(hash);
      this.updateNav();
      this.updateBreadcrumb(hash, idx);

      SR.Storage.setLastPage(hash);
      document.getElementById('page-content').scrollTop = 0;
      document.getElementById('main-content').scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);

      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    },

    updateNav: function () {
      var idx = this.currentIndex;
      var prev = document.getElementById('btn-prev');
      var next = document.getElementById('btn-next');
      var indicator = document.getElementById('page-indicator');

      prev.disabled = idx === 0;
      next.disabled = idx === SR.sections.length - 1;
      indicator.textContent = 'Page ' + (idx + 1) + ' of ' + SR.sections.length;
    },

    updateBreadcrumb: function (sectionId, idx) {
      var bc = document.getElementById('breadcrumb');
      var section = SR.sections[idx];
      bc.innerHTML = 'Faculty Survey Report &rsaquo; <span>' + section.title + '</span>';
    },

    prev: function () {
      if (this.currentIndex > 0) {
        this.navigate(SR.sections[this.currentIndex - 1].id);
      }
    },

    next: function () {
      if (this.currentIndex < SR.sections.length - 1) {
        this.navigate(SR.sections[this.currentIndex + 1].id);
      }
    }
  };

})(window.SurveyReport);
