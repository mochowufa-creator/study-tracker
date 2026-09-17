// 轻量 Toast 通知：替代 alert/confirm
window.Toast = (function () {
  let container;
  function ensure() {
    if (!container) container = Utils.$('#toast-container');
    return container;
  }
  function show(message, type = 'info', duration = 2600) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.textContent = message;
    ensure().appendChild(el);
    setTimeout(() => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
  // 简易确认对话框：返回 Promise<boolean>
  function confirm(message) {
    return new Promise((resolve) => {
      const el = document.createElement('div');
      el.className = 'toast toast-warning';
      el.style.minWidth = '280px';
      const msg = document.createElement('div');
      msg.style.marginBottom = '.5rem';
      msg.textContent = message;
      el.appendChild(msg);
      const btns = document.createElement('div');
      btns.style.display = 'flex';
      btns.style.gap = '.5rem';
      const ok = document.createElement('button');
      ok.textContent = '确定';
      ok.className = 'flex-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground';
      const cancel = document.createElement('button');
      cancel.textContent = '取消';
      cancel.className = 'flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground';
      btns.appendChild(ok); btns.appendChild(cancel);
      el.appendChild(btns);
      ensure().appendChild(el);
      let done = false;
      const finish = (val) => {
        if (done) return;
        done = true;
        el.classList.add('leaving');
        setTimeout(() => el.remove(), 300);
        resolve(val);
      };
      ok.addEventListener('click', () => finish(true));
      cancel.addEventListener('click', () => finish(false));
      setTimeout(() => finish(false), 8000);
    });
  }
  return { show, confirm };
})();
