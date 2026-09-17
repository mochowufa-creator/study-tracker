// 深浅主题切换
window.Theme = (function () {
  const { $ } = Utils;

  function init() {
    const saved = Store.loadTheme();
    apply(saved);
    $('#btn-theme-toggle').addEventListener('click', toggle);
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#0d9488');
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    Store.saveTheme(next);
    Toast.show(`已切换到${next === 'dark' ? '深色' : '浅色'}主题`, 'info', 1500);
  }

  return { init, apply, toggle };
})();
