// 倒计时模块（支持开始时间 + 结束时间）
window.Countdown = (function () {
  const { $ } = Utils;
  let cfg = null;
  let timer = null;
  let ctx = null;

  function init(context) {
    ctx = context;
    const saved = Store.loadCountdown();
    if (saved && saved.target) {
      cfg = saved;
      // 兼容旧数据：没有 start 时用项目开始日期
      if (!cfg.start) cfg.start = ctx.startDate.getTime();
    } else {
      cfg = { label: '专升本考试', start: ctx.startDate.getTime(), target: ctx.endDate.getTime() };
    }

    $('#btn-countdown-settings').addEventListener('click', openForm);
    $('#btn-countdown-cancel').addEventListener('click', closeForm);
    $('#btn-countdown-save').addEventListener('click', () => {
      const label = $('#countdown-label-input').value.trim() || '倒计时';
      const start = new Date($('#countdown-start-input').value).getTime();
      const target = new Date($('#countdown-target-input').value).getTime();
      if (isNaN(start) || isNaN(target)) { Toast.show('请选择有效的开始和结束时间', 'error'); return; }
      if (start >= target) { Toast.show('开始时间必须早于结束时间', 'error'); return; }
      cfg = { label, start, target };
      Store.saveCountdown(cfg);
      update();
      closeForm();
      Toast.show('倒计时已更新', 'success');
    });

    update();
    timer = setInterval(update, 1000);
  }

  function update() {
    const now = Date.now();
    $('#countdown-label').textContent = cfg.label || '倒计时';

    // 已到达结束时间
    if (now >= cfg.target) {
      $('#countdown-display').textContent = '已到达';
      $('#countdown-sub').textContent = '加油！';
      return;
    }
    // 还没到开始时间：显示距离开始的剩余时间
    if (now < cfg.start) {
      const diff = cfg.start - now;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      $('#countdown-display').textContent = `距开始 ${days}天`;
      $('#countdown-sub').textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      return;
    }
    // 在开始-结束之间：显示距离结束的剩余时间
    const diff = cfg.target - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    $('#countdown-display').textContent = `剩 ${days}天`;
    $('#countdown-sub').textContent =
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function openForm() {
    $('#countdown-label-input').value = cfg.label || '';
    $('#countdown-start-input').value = Utils.formatDateTimeLocal(new Date(cfg.start));
    $('#countdown-target-input').value = Utils.formatDateTimeLocal(new Date(cfg.target));
    // 联动：开始/结束时间互相约束
    const startEl = $('#countdown-start-input');
    const targetEl = $('#countdown-target-input');
    startEl.min = '';
    targetEl.min = startEl.value;
    startEl.max = targetEl.value;
    startEl.onchange = () => { targetEl.min = startEl.value; };
    targetEl.onchange = () => { startEl.max = targetEl.value; };
    $('#countdown-form').classList.remove('hidden');
  }
  function closeForm() { $('#countdown-form').classList.add('hidden'); }

  return { init, update };
})();
