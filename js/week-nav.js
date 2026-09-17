// 周导航 + 周选择器
window.WeekNav = (function () {
  const { $, addDays, formatDisplay } = Utils;
  let ctx = null;
  let currentOffset = 0;
  let onChangeCallback = null;

  function init(context, callbacks) {
    ctx = context;
    onChangeCallback = callbacks.onChange;
    currentOffset = context.initialWeekOffset;

    $('#btn-prev').addEventListener('click', prev);
    $('#btn-next').addEventListener('click', next);
    $('#btn-today').addEventListener('click', goToday);
    $('#week-select').addEventListener('change', (e) => {
      currentOffset = parseInt(e.target.value, 10);
      emit();
    });

    populateSelect();
  }

  function populateSelect() {
    const sel = $('#week-select');
    sel.innerHTML = '';
    for (let i = 0; i < ctx.totalWeeks; i++) {
      const mon = addDays(ctx.startMon, i * 7);
      const sun = addDays(mon, 6);
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `第 ${i + 1} 周 (${formatDisplay(mon)} - ${formatDisplay(sun)})`;
      sel.appendChild(opt);
    }
  }

  function prev() {
    if (currentOffset > 0) { currentOffset--; emit(); }
  }
  function next() {
    if (currentOffset < ctx.totalWeeks - 1) { currentOffset++; emit(); }
  }
  function goToday() { currentOffset = ctx.initialWeekOffset; emit(); }

  function emit() {
    $('#week-label').textContent = `第 ${currentOffset + 1} 周 / 共 ${ctx.totalWeeks} 周`;
    $('#week-select').value = currentOffset;
    const weekStart = addDays(ctx.startMon, currentOffset * 7);
    onChangeCallback(weekStart, currentOffset);
  }

  function getOffset() { return currentOffset; }
  function setOffset(o) { currentOffset = Math.max(0, Math.min(ctx.totalWeeks - 1, o)); emit(); }

  return { init, prev, next, goToday, getOffset, setOffset };
})();
