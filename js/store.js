// 存储层：localStorage CRUD（与设计稿 key 一致，向后兼容）
window.Store = (function () {
  const LS_PREFIX = 'studyRecord_';

  function get(key) { return localStorage.getItem(LS_PREFIX + key); }
  function set(key, val) { return localStorage.setItem(LS_PREFIX + key, val); }
  function getJSON(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(LS_PREFIX + key)); return v == null ? fallback : v; }
    catch { return fallback; }
  }
  function setJSON(key, val) { localStorage.setItem(LS_PREFIX + key, JSON.stringify(val)); }

  function loadDay(dateStr) { return getJSON('day_' + dateStr, {}); }
  function saveDay(dateStr, data) { setJSON('day_' + dateStr, data); }

  function loadWeekGoal(weekKey) { return get('weekGoal_' + weekKey) || ''; }
  function saveWeekGoal(weekKey, val) { set('weekGoal_' + weekKey, val); }
  function loadWeekReview(weekKey) { return get('weekReview_' + weekKey) || ''; }
  function saveWeekReview(weekKey, val) { set('weekReview_' + weekKey, val); }
  function loadMonthSummary(monthKey) { return get('monthSummary_' + monthKey) || ''; }
  function saveMonthSummary(monthKey, val) { set('monthSummary_' + monthKey, val); }

  function loadCountdown() {
    const raw = get('countdown');
    if (raw) { try { return JSON.parse(raw); } catch {} }
    return null;
  }
  function saveCountdown(cfg) { setJSON('countdown', cfg); }

  function loadTarget() { return get('target') || ''; }
  function saveTarget(val) { set('target', val); }

  function loadMarkerImage() { return get('markerImage') || ''; }
  function saveMarkerImage(dataUrl) { set('markerImage', dataUrl); }

  function loadTheme() { return get('theme') || 'light'; }
  function saveTheme(t) { set('theme', t); }

  function exportAll() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LS_PREFIX)) data[key] = localStorage.getItem(key);
    }
    return data;
  }
  function importAll(data) {
    Object.keys(data || {}).forEach((key) => {
      if (key.startsWith(LS_PREFIX)) localStorage.setItem(key, data[key]);
    });
  }

  return {
    LS_PREFIX,
    get, set, getJSON, setJSON,
    loadDay, saveDay,
    loadWeekGoal, saveWeekGoal, loadWeekReview, saveWeekReview,
    loadMonthSummary, saveMonthSummary,
    loadCountdown, saveCountdown,
    loadTarget, saveTarget,
    loadMarkerImage, saveMarkerImage,
    loadTheme, saveTheme,
    exportAll, importAll
  };
})();
