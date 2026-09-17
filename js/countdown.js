// 倒计时模块
window.Countdown = (function () {
  const { $ } = Utils;
  let cfg = null;
  let timer = null;
  let ctx = null;

  function init(context) {
    ctx = context;
    cfg = Store.loadCountdown() || { label: '专升本考试', target: ctx.endDate.getTime() };

    $('#btn-countdown-settings').addEventListener('click', openForm);
    $('#btn-countdown-cancel').addEventListener('click', closeForm);
    $('#btn-countdown-save').addEventListener('click', () => {
      const label = $('#countdown-label-input').value.trim() || '倒计时';
      const target = new Date($('#countdown-target-input').value).getTime();
      if (isNaN(target)) { Toast.show('请选择有效的目标日期', 'error'); return; }
      cfg = { label, target };
      Store.saveCountdown(cfg);
      update();
      closeForm();
      Toast.show('倒计时已更新', 'success');
    });

    update();
    timer = setInterval(update, 1000);
  }

  function update() {
    const diff = cfg.target - Date.now();
    $('#countdown-label').textContent = cfg.label || '倒计时';
    if (diff <= 0) {
      $('#countdown-display').textContent = '已到达';
      $('#countdown-sub').textContent = '加油！';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    $('#countdown-display').textContent = `${days}天`;
    $('#countdown-sub').textContent =
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function openForm() {
    $('#countdown-label-input').value = cfg.label || '';
    $('#countdown-target-input').value = Utils.formatDateTimeLocal(new Date(cfg.target));
    $('#countdown-form').classList.remove('hidden');
  }
  function closeForm() { $('#countdown-form').classList.add('hidden'); }

  return { init, update };
})();
