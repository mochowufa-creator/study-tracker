// 周目标 / 周复盘 / 月总结
window.TextAreas = (function () {
  const { $, debounce, formatDate, getMonthKey, addDays } = Utils;
  let ctx = null;

  function init(context) {
    ctx = context;
    const elGoal = $('#weekly-goal-input');
    const elReview = $('#weekly-review-input');
    const elMonth = $('#monthly-summary-input');

    elGoal.addEventListener('input', debounce(() => Store.saveWeekGoal(elGoal.dataset.week, elGoal.value), 300));
    elReview.addEventListener('input', debounce(() => Store.saveWeekReview(elReview.dataset.week, elReview.value), 300));
    elMonth.addEventListener('input', debounce(() => Store.saveMonthSummary(elMonth.dataset.month, elMonth.value), 300));
  }

  function render(weekStart, offset) {
    const weekKey = formatDate(weekStart);
    const elGoal = $('#weekly-goal-input');
    const elReview = $('#weekly-review-input');
    const elMonth = $('#monthly-summary-input');

    elGoal.dataset.week = weekKey;
    elReview.dataset.week = weekKey;
    elGoal.value = Store.loadWeekGoal(weekKey);
    elReview.value = Store.loadWeekReview(weekKey);
    $('#weekly-goal-label').textContent = `第 ${offset + 1} 周`;
    $('#weekly-review-label').textContent = `第 ${offset + 1} 周`;

    let targetMonthDay = null;
    for (let i = 0; i < 7; i++) {
      const d = addDays(weekStart, i);
      if (ctx.isInRange(d)) { targetMonthDay = d; break; }
    }
    if (!targetMonthDay) targetMonthDay = weekStart;
    const monthKey = getMonthKey(targetMonthDay);
    elMonth.dataset.month = monthKey;
    elMonth.value = Store.loadMonthSummary(monthKey);
    $('#monthly-summary-label').textContent = `${targetMonthDay.getFullYear()}年${targetMonthDay.getMonth() + 1}月`;
  }

  return { init, render };
})();
