// 工具函数：DOM、日期、字符串、防抖
window.Utils = (function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  function formatDisplay(d) {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  function getWeekday(d) {
    const arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return arr[d.getDay()];
  }
  function getMonday(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
  }
  function addDays(d, n) {
    const date = new Date(d);
    date.setDate(date.getDate() + n);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  function daysDiff(a, b) {
    const ms = 24 * 60 * 60 * 1000;
    return Math.round((b - a) / ms);
  }
  function getMonthKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }
  function formatDateTimeLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
  }

  return {
    $, $$,
    formatDate, formatDisplay, getWeekday, getMonday, addDays, daysDiff, getMonthKey,
    escapeHtml, debounce, formatDateTimeLocal
  };
})();
