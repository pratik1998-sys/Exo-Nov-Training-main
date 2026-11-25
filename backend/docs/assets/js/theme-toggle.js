(function () {
  var STORAGE_KEY = 'catalyst-docs-theme';
  var DARK = 'dark';
  var LIGHT = 'light';

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStored(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function getDefaultTheme() {
    var meta = document.querySelector('meta[name="default-theme"]');
    if (meta && meta.content) return meta.content;
    var el = document.getElementById('default-theme');
    return el ? (el.getAttribute('data-theme') || LIGHT) : LIGHT;
  }

  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
    setStored(isDark ? DARK : LIGHT);
    updateToggleLabel(isDark);
  }

  function updateToggleLabel(isDark) {
    var btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    var icon = btn.querySelector('.theme-toggle-icon');
    var label = btn.querySelector('.theme-toggle-label');
    if (icon) {
      icon.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>';
    }
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  }

  function init() {
    var defaultTheme = getDefaultTheme();
    var stored = getStored();
    var isDark = stored === DARK || (stored !== LIGHT && defaultTheme === DARK);
    applyTheme(isDark);

    var btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        isDark = !document.body.classList.contains('theme-dark');
        applyTheme(isDark);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
