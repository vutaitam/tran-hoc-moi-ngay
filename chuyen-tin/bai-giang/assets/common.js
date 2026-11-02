(() => {
  'use strict';
  const key = 'baigiang-progress-v2';
  const lessonIds = new Set(['0-1', '0-2', '0-3', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6',
    '2-1', '2-2', '2-3', '2-4', '2-5', '3-1', '3-2', '3-3']);
  const lessonId = window.LESSON_DATA?.id || '1-2';
  const empty = () => ({version:1, learned:false, activities:{}, ac:{}, exams:{}});
  const allowed = new Set(['warm-index', 'warm-sum', 'story', 'predict', 'output', 'parsons', 'blank', 'bug', 'difference']);
  const problemIds = new Set(['all-prefix', 'range-sum', 'fixed-window', 'range-add']);
  const examIds = new Set(['csp-2023-cong-day', 'ptnk-2026-sensor']);
  let storageError = '', unsaved = false;
  let book = {version:2, lessons:{}};
  function validateEntry(data, legacy) {
    if (!data || typeof data.learned !== 'boolean') throw Error('Tệp tiến độ không phù hợp.');
    const clean = {...empty(), learned:data.learned};
    for (const [field, ids] of [['activities', allowed], ['ac', problemIds], ['exams', examIds]]) {
      if (!data[field] || typeof data[field] !== 'object' || Array.isArray(data[field])) throw Error('Tệp tiến độ còn thiếu thông tin.');
      const entries = Object.entries(data[field]);
      if (entries.length > 100) throw Error('Có quá nhiều mục tiến độ.');
      for (const [id, value] of entries) {
        if ((legacy ? !ids.has(id) : !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) || id.length > 100 || ['constructor','prototype'].includes(id) || typeof value !== 'boolean') throw Error('Có mục tiến độ không phù hợp.');
        clean[field][id] = value;
      }
    }
    return clean;
  }
  function validate(data) {
    if (data?.version === 1) return {version:2, lessons:{'1-2':validateEntry(data, true)}};
    if (data?.version !== 2 || !data.lessons || typeof data.lessons !== 'object' || Array.isArray(data.lessons)) throw Error('Tệp tiến độ không phù hợp.');
    const clean = {version:2, lessons:{}};
    for (const [id, entry] of Object.entries(data.lessons)) {
      if (!lessonIds.has(id)) throw Error('Bài học trong tệp chưa được hỗ trợ.');
      clean.lessons[id] = validateEntry(entry, id === '1-2');
    }
    return clean;
  }
  try {
    const saved = localStorage.getItem(key) || localStorage.getItem('baigiang-progress-v1');
    if (saved) book = validate(JSON.parse(saved));
  } catch { storageError = 'Chưa đọc được tiến độ đã lưu. Tiến độ mới chỉ giữ khi trang còn mở.'; }
  const current = () => book.lessons[lessonId] ||= empty();
  function refresh() {
    if (unsaved) return;
    try { const saved = localStorage.getItem(key); if (saved) book = validate(JSON.parse(saved)); }
    catch { /* Keep usable in-memory progress if storage is unavailable. */ }
  }
  window.addEventListener('storage', event => {
    if (unsaved || event.key !== key || !event.newValue) return;
    try { book = validate(JSON.parse(event.newValue)); document.dispatchEvent(new Event('progresschange')); }
    catch { /* Ignore malformed changes from another tab. */ }
  });
  function status(message) {
    let el = document.getElementById('storage-status');
    if (!el && storageError) {
      const progressNode = document.getElementById('lesson-progress');
      if (!progressNode) return;
      el = document.createElement('p'); el.id = 'storage-status';
      el.setAttribute('role', 'status'); progressNode.after(el);
    }
    if (el) el.textContent = message;
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(book)); unsaved = false; }
    catch { unsaved = true; storageError = 'Chưa lưu được tiến độ. Dấu đã học chỉ giữ khi trang còn mở.'; status(storageError); }
    document.dispatchEvent(new Event('progresschange'));
  }
  window.LessonApp = {
    get progress() { return current(); },
    get allProgress() { return book.lessons; },
    mark(group, id, value = true) {
      refresh();
      const progress = current();
      if (group === 'learned') progress.learned = Boolean(value);
      else if (['activities','ac','exams'].includes(group) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && !['constructor','prototype'].includes(id)) progress[group][id] = Boolean(value);
      else return;
      save();
    },
    escape: text => String(text).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch])),
    highlight(code) {
      const tokens = /#[^\n]*|(?:"[^"\n]*"|'[^'\n]*')|\b(?:import|from|as|def|return|for|in|range|if|else|elif|while|and|or|not|True|False|None|print|int|map|list|len|sum|max|min|input)\b/g;
      let result = '', last = 0;
      for (const match of code.matchAll(tokens)) {
        result += this.escape(code.slice(last, match.index));
        const kind = match[0][0] === '#' ? 'comment' : /^["']/.test(match[0]) ? 'string' : 'keyword';
        result += '<span class="code-' + kind + '">' + this.escape(match[0]) + '</span>';
        last = match.index + match[0].length;
      }
      return result + this.escape(code.slice(last));
    }
  };
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
    const theme = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('dethi-practice-theme', theme); } catch { /* Theme still works for this view. */ }
  });
  document.getElementById('export-progress')?.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(book, null, 2)], {type:'application/json'}));
    const link = document.createElement('a'); link.href = url; link.download = 'tien-do-tin-vao-10.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status('Đã tải tệp tiến độ. Em giữ tệp để dùng khi đổi máy nhé.');
  });
  document.getElementById('import-progress')?.addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 100000) throw Error('Tệp quá lớn (tối đa 100 KB).');
      const imported = validate(JSON.parse(await file.text()));
      refresh();
      for (const [lesson, entry] of Object.entries(imported.lessons)) {
        const target = book.lessons[lesson] ||= empty();
        target.learned ||= entry.learned;
        for (const group of ['activities', 'ac', 'exams']) for (const [id, done] of Object.entries(entry[group])) target[group][id] ||= done;
      }
      save(); status(storageError || 'Đã gộp tiến độ từ tệp; không xóa phần em đã hoàn thành.');
    } catch (error) { status(error instanceof SyntaxError ? 'Chưa đọc được tệp. Em chọn tệp tiến độ đã tải trước đó nhé.' : 'Chưa nhập được. ' + error.message); }
    event.target.value = '';
  });
  status(storageError || 'Tiến độ chỉ lưu trên máy này. Em tải tệp tiến độ để dùng khi đổi máy.');
})();
