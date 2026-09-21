// 每日卡片渲染 + 编辑 + 周概览
window.DayCards = (function () {
  const { $, addDays, formatDate, formatDisplay, getWeekday, escapeHtml, debounce } = Utils;
  let ctx = null;
  let afterSaveCallback = null;

  function init(context, callbacks) {
    ctx = context;
    afterSaveCallback = callbacks.afterSave;

    const elCards = $('#daily-cards');
    const saveDebounced = debounce((dateStr) => saveCard(dateStr), 300);
    elCards.addEventListener('input', (e) => {
      const card = e.target.closest('article[data-date]');
      if (card) saveDebounced(card.dataset.date);
    });
    elCards.addEventListener('change', (e) => {
      const card = e.target.closest('article[data-date]');
      if (card) saveDebounced(card.dataset.date);
    });
  }

  function statusClasses(status) {
    if (status === '已完成') return 'text-[var(--brand-primary)] border-[var(--brand-primary)] bg-[var(--brand-primary)]/10';
    if (status === '部分完成') return 'text-[var(--brand-warning)] border-[var(--brand-warning)] bg-[var(--brand-warning)]/10';
    if (status === '未完成') return 'text-[var(--brand-error)] border-[var(--brand-error)] bg-[var(--brand-error)]/10';
    return 'text-muted-foreground border-border bg-background';
  }

  function renderCard(d) {
    const dateStr = formatDate(d);
    if (!ctx.isInRange(d)) {
      return `<div class="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center text-muted-foreground">
        <div class="text-sm font-medium">${formatDisplay(d)} ${getWeekday(d)}</div>
        <div class="mt-2 text-xs">不在记录范围内</div>
      </div>`;
    }
    const data = Store.loadDay(dateStr);
    const f = escapeHtml;
    return `<article class="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md fade-in" data-date="${dateStr}">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <div class="text-lg font-semibold text-foreground">${formatDisplay(d)}</div>
          <div class="text-xs text-muted-foreground">${getWeekday(d)}</div>
        </div>
        <span class="status-badge rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClasses(data.status)}">${f(data.status || '待记录')}</span>
      </div>
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-muted-foreground">今日目标（今天要干什么）</label>
          <input type="text" data-field="goal" value="${f(data.goal || '')}" placeholder="例如：背 50 个单词，做一套数学卷" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-muted-foreground">今日科目</label>
          <input type="text" data-field="subject" value="${f(data.subject || '')}" placeholder="例如：数学、英语" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-muted-foreground">学习内容 / 章节</label>
          <input type="text" data-field="content" value="${f(data.content || '')}" placeholder="例如：第三章 函数" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-muted-foreground">完成情况</label>
          <select data-field="status" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">
            <option value="" ${!data.status ? 'selected' : ''}>选择状态</option>
            <option value="已完成" ${data.status === '已完成' ? 'selected' : ''}>已完成</option>
            <option value="部分完成" ${data.status === '部分完成' ? 'selected' : ''}>部分完成</option>
            <option value="未完成" ${data.status === '未完成' ? 'selected' : ''}>未完成</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-muted-foreground">今日总结</label>
          <textarea data-field="summary" rows="2" placeholder="记录今天的收获..." class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">${f(data.summary || '')}</textarea>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-muted-foreground">明日计划</label>
          <input type="text" data-field="plan" value="${f(data.plan || '')}" placeholder="明天打算学什么" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-ring)]">
        </div>
      </div>
    </article>`;
  }

  function renderWeekOverview(weekStart) {
    const el = $('#week-overview');
    if (!el) return;
    let html = '';
    for (let i = 0; i < 7; i++) {
      const d = addDays(weekStart, i);
      const dateStr = formatDate(d);
      const dayName = getWeekday(d);
      const data = Store.loadDay(dateStr);
      const goalText = (data.goal || '').trim();
      const inRange = ctx.isInRange(d);
      html += `<div class="rounded-lg border ${goalText ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/40'} p-2 text-xs ${inRange ? '' : 'opacity-60'}">
        <div class="mb-1 font-medium text-foreground">${dayName}</div>
        <div class="truncate ${goalText ? 'text-foreground' : 'text-muted-foreground'}">${escapeHtml(goalText) || (inRange ? '未设置目标' : '不在范围内')}</div>
      </div>`;
    }
    el.innerHTML = html;
  }

  function renderWeek(weekStart) {
    let html = '';
    for (let i = 0; i < 7; i++) html += renderCard(addDays(weekStart, i));
    $('#daily-cards').innerHTML = html;
    renderWeekOverview(weekStart);
    if (window.lucide) lucide.createIcons();
  }

  function saveCard(dateStr) {
    const card = document.querySelector(`article[data-date="${dateStr}"]`);
    if (!card) return;
    const data = {
      goal: card.querySelector('[data-field="goal"]').value,
      subject: card.querySelector('[data-field="subject"]').value,
      content: card.querySelector('[data-field="content"]').value,
      status: card.querySelector('[data-field="status"]').value,
      summary: card.querySelector('[data-field="summary"]').value,
      plan: card.querySelector('[data-field="plan"]').value,
    };
    Store.saveDay(dateStr, data);
    const badge = card.querySelector('.status-badge');
    badge.className = `status-badge rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClasses(data.status)}`;
    badge.textContent = data.status || '待记录';
    afterSaveCallback();
  }

  return { init, renderWeek, renderWeekOverview, saveCard };
})();
