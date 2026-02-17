/* ============================================================
   Storage — localStorage persistence for bookmarks, notes, settings
   ============================================================ */
window.SurveyReport = window.SurveyReport || {};

(function (SR) {
  'use strict';

  var PREFIX = 'sr_';

  function get(key) {
    try { return JSON.parse(localStorage.getItem(PREFIX + key)); }
    catch (e) { return null; }
  }

  function set(key, val) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); }
    catch (e) { /* quota exceeded */ }
  }

  SR.Storage = {
    getLastPage: function () { return get('lastPage') || SR.sections[0].id; },
    setLastPage: function (id) { set('lastPage', id); },

    getBookmarks: function () { return get('bookmarks') || []; },
    isBookmarked: function (id) { return this.getBookmarks().indexOf(id) !== -1; },
    toggleBookmark: function (id) {
      var bm = this.getBookmarks();
      var idx = bm.indexOf(id);
      if (idx === -1) bm.push(id); else bm.splice(idx, 1);
      set('bookmarks', bm);
      return idx === -1;
    },

    getNotes: function () { return get('notes') || {}; },
    getNote: function (id) { return (this.getNotes())[id] || ''; },
    setNote: function (id, text) {
      var notes = this.getNotes();
      if (text) notes[id] = text; else delete notes[id];
      set('notes', notes);
    },

    getDarkMode: function () { return get('darkMode') === true; },
    setDarkMode: function (val) { set('darkMode', val); }
  };

})(window.SurveyReport);
