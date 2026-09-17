// 应用入口：装配上下文、初始化各模块
(function () {
  const { getMonday, addDays, daysDiff, $ } = Utils;

  // 与设计稿一致的日期范围
  const startDate = new Date(2026, 8, 16); startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(2027, 2, 10); endDate.setHours(23, 59, 59, 999);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const startMon = getMonday(startDate);
  const endMon = getMonday(endDate);
  const totalWeeks = Math.floor(daysDiff(startMon, endMon) / 7) + 1;
  const totalDays = daysDiff(startDate, endDate) + 1;

  function isInRange(d) {
    const t = new Date(d); t.setHours(0, 0, 0, 0);
    return t >= startDate && t <= endDate;
  }
  function getInitialWeekOffset() {
    if (today < startDate) return 0;
    if (today > endDate) return totalWeeks - 1;
    const mon = getMonday(today);
    return Math.floor(daysDiff(startMon, mon) / 7);
  }

  const ctx = {
    startDate, endDate, today,
    startMon, endMon,
    totalWeeks, totalDays,
    isInRange, getInitialWeekOffset,
    initialWeekOffset: getInitialWeekOffset()
  };

  function onWeekChange(weekStart, offset) {
    DayCards.renderWeek(weekStart);
    TextAreas.render(weekStart, offset);
  }

  function afterDaySave() {
    Stats.update();
    const weekStart = addDays(startMon, WeekNav.getOffset() * 7);
    DayCards.renderWeekOverview(weekStart);
  }

  function init() {
    Theme.init();
    Stats.init(ctx);
    Countdown.init(ctx);
    IO.init();
    WeekNav.init(ctx, { onChange: onWeekChange });
    DayCards.init(ctx, { afterSave: afterDaySave });
    TextAreas.init(ctx);
    Gestures.init();

    Stats.update();
    const weekStart = addDays(startMon, ctx.initialWeekOffset * 7);
    onWeekChange(weekStart, ctx.initialWeekOffset);
    $('#week-label').textContent = `第 ${ctx.initialWeekOffset + 1} 周 / 共 ${totalWeeks} 周`;
    $('#week-select').value = ctx.initialWeekOffset;

    if (window.lucide) lucide.createIcons();

    // 注册 Service Worker（PWA）
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
