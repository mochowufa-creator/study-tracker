// 导入 / 导出 + 进度标记上传
window.IO = (function () {
  const { $ } = Utils;

  function init() {
    $('#btn-export').addEventListener('click', exportRecords);
    $('#btn-import').addEventListener('click', () => $('#import-file').click());
    $('#import-file').addEventListener('change', (e) => {
      importRecords(e.target.files[0]);
      e.target.value = '';
    });

    $('#btn-marker-upload').addEventListener('click', () => $('#marker-file').click());
    $('#marker-file').addEventListener('change', (e) => {
      handleMarkerUpload(e.target.files[0]);
      e.target.value = '';
    });
  }

  function exportRecords() {
    const data = Store.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `专升本学习记录_备份_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toast.show('已导出学习记录', 'success');
  }

  async function importRecords(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object') throw new Error('格式错误');
      const ok = await Toast.confirm('导入后会覆盖当前浏览器中的学习记录，确定继续吗？');
      if (!ok) { Toast.show('已取消导入', 'info'); return; }
      Store.importAll(data);
      Toast.show('导入成功，即将刷新...', 'success');
      setTimeout(() => location.reload(), 900);
    } catch (err) {
      Toast.show('导入失败：文件格式不正确', 'error');
    }
  }

  function handleMarkerUpload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { Toast.show('请上传图片文件', 'error'); return; }
    if (file.size > 1024 * 1024) { Toast.show('图片不能超过 1MB', 'warning'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      Store.saveMarkerImage(dataUrl);
      $('#progress-marker').src = dataUrl;
      Toast.show('进度标记已更新', 'success');
    };
    reader.readAsDataURL(file);
  }

  return { init, exportRecords };
})();
