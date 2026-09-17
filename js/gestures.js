// 键盘快捷键 + 移动端滑动切换周
window.Gestures = (function () {
  let hintTimer = null;

  function init() {
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowLeft': WeekNav.prev(); break;
        case 'ArrowRight': WeekNav.next(); break;
        case 't': case 'T': WeekNav.goToday(); break;
        case 'd': case 'D': Theme.toggle(); break;
        case 'e': case 'E': if (window.IO && IO.exportRecords) IO.exportRecords(); break;
      }
    });

    // 移动端滑动切换周
    const target = document.getElementById('daily-records') || document.body;
    let startX = 0, startY = 0, tracking = false;
    target.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    target.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
      showHint();
      if (dx > 0) WeekNav.prev(); else WeekNav.next();
    }, { passive: true });

    // 首次进入提示一次
    if (!sessionStorage.getItem('swipeHintShown')) {
      sessionStorage.setItem('swipeHintShown', '1');
      setTimeout(showHint, 1200);
    }
  }

  function showHint() {
    const el = document.getElementById('swipe-hint');
    if (!el) return;
    el.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => el.classList.remove('show'), 1600);
  }

  return { init };
})();
