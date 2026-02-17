/* ============================================================
   App — Initialization, event binding, and coordination
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  SR.App = {
    init: function () {
      this.applyTheme();
      SR.Sidebar.init();
      this.restoreLastPage();
      SR.Router.init();
      this.bindEvents();
    },

    applyTheme: function () {
      if (SR.Storage.getDarkMode()) {
        document.body.classList.add('dark');
      }
    },

    restoreLastPage: function () {
      if (!window.location.hash) {
        var last = SR.Storage.getLastPage();
        if (last) window.location.hash = '#' + last;
      }
    },

    bindEvents: function () {
      var self = this;

      document.getElementById('btn-menu').addEventListener('click', function () {
        document.getElementById('sidebar').classList.toggle('open');
      });

      document.getElementById('btn-prev').addEventListener('click', function () {
        SR.Router.prev();
      });

      document.getElementById('btn-next').addEventListener('click', function () {
        SR.Router.next();
      });

      document.getElementById('btn-export-html').addEventListener('click', function () {
        SR.Export.exportHTML();
      });

      document.getElementById('btn-print').addEventListener('click', function () {
        window.print();
      });

      document.getElementById('btn-theme').addEventListener('click', function () {
        var isDark = document.body.classList.toggle('dark');
        SR.Storage.setDarkMode(isDark);
        SR.Router.handleRoute();
      });

      document.getElementById('btn-bookmark').addEventListener('click', function () {
        var id = SR.Router.currentSection;
        var added = SR.Storage.toggleBookmark(id);
        self.updateBookmarkBtn(added);
        SR.Sidebar.render();
        self.toast(added ? 'Page bookmarked' : 'Bookmark removed');
      });

      document.getElementById('btn-notes').addEventListener('click', function () {
        self.openNotesModal();
      });

      document.getElementById('modal-close').addEventListener('click', function () {
        document.getElementById('modal-overlay').classList.add('hidden');
      });

      document.getElementById('modal-overlay').addEventListener('click', function (e) {
        if (e.target === this) this.classList.add('hidden');
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          SR.Router.prev();
        }
        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          SR.Router.next();
        }
        if (e.key === 'Escape') {
          document.getElementById('modal-overlay').classList.add('hidden');
          document.getElementById('sidebar').classList.remove('open');
        }
      });

      window.addEventListener('hashchange', function () {
        self.updateBookmarkBtn(SR.Storage.isBookmarked(SR.Router.currentSection));
      });
    },

    updateBookmarkBtn: function (isBookmarked) {
      var btn = document.getElementById('btn-bookmark');
      btn.textContent = isBookmarked ? '★' : '☆';
      btn.classList.toggle('active', isBookmarked);
    },

    openNotesModal: function () {
      var id = SR.Router.currentSection;
      var section = SR.sections.find(function (s) { return s.id === id; });
      var overlay = document.getElementById('modal-overlay');
      var body = document.getElementById('modal-body');

      document.getElementById('modal-title').textContent = 'Notes — ' + (section ? section.title : '');

      var existing = SR.Storage.getNote(id);
      body.innerHTML = '';

      var textarea = document.createElement('textarea');
      textarea.placeholder = 'Add your notes for this section…';
      textarea.value = existing;
      body.appendChild(textarea);

      var btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = 'Save Notes';
      btn.addEventListener('click', function () {
        SR.Storage.setNote(id, textarea.value);
        overlay.classList.add('hidden');
        SR.App.toast('Notes saved');
      });
      body.appendChild(btn);

      overlay.classList.remove('hidden');
      textarea.focus();
    },

    toast: function (message) {
      var t = document.getElementById('toast');
      t.textContent = message;
      t.classList.remove('hidden');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(function () {
        t.classList.add('hidden');
      }, 2500);
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    SR.App.init();
  });

})(window.SurveyReport);
