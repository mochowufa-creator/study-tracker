// 统计与进度条
window.Stats = (function () {
  const { $, addDays, daysDiff, formatDate } = Utils;
  let ctx = null;

  function init(context) {
    ctx = context;
    const elTarget = $('#stat-target');
    elTarget.value = Store.loadTarget();
    const onChange = () => { Store.saveTarget(elTarget.value.trim()); update(); };
    elTarget.addEventListener('change', onChange);
    elTarget.addEventListener('blur', onChange);
    applyMarkerImage();
  }

  function applyMarkerImage() {
    const src = Store.loadMarkerImage();
    if (src) $('#progress-marker').src = src;
  }

  function updateProgressMarker() {
    const m = $('#progress-marker');
    if (!m) return;
    m.style.left = $('#progress-fill').style.width;
  }

  function update() {
    const { startDate, today, totalDays } = ctx;
    const passed = Math.max(0, Math.min(totalDays - 1, daysDiff(startDate, today)));
    let completed = 0;
    for (let i = 0; i < totalDays; i++) {
      const d = addDays(startDate, i);
      const data = Store.loadDay(formatDate(d));
      if (data.status === '已完成') completed++;
    }
    $('#stat-total').textContent = totalDays;
    $('#stat-passed').textContent = passed;
    $('#stat-remaining').textContent = totalDays - passed;
    $('#stat-completed').textContent = completed;

    const targetDays = parseInt($('#stat-target').value, 10) || 0;
    if (targetDays > 0) {
      const pct = Math.min(100, Math.round((completed / targetDays) * 100));
      $('#stat-target-progress').textContent = `完成 ${pct}%`;
    } else {
      $('#stat-target-progress').textContent = '完成 0%';
    }

    const pct = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
    $('#progress-text').textContent = pct + '%';
    $('#progress-fill').style.width = pct + '%';
    updateProgressMarker();
  }

  return { init, update, applyMarkerImage };
})();
