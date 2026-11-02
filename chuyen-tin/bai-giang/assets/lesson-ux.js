(() => {
  'use strict';
  const draftPrefix = 'baigiang-draft-v1:';
  const memory = new Map();
  function draftStatus(text) {
    let node = document.getElementById('draft-status');
    if (!node) {
      const editor = document.querySelector('.editor');
      if (!editor) return;
      node = document.createElement('p'); node.id = 'draft-status';
      node.className = 'muted'; node.setAttribute('role', 'status'); editor.after(node);
    }
    node.textContent = text;
  }
  const drafts = {
    get(id) {
      if (memory.has(id)) return memory.get(id);
      try {
        const saved = localStorage.getItem(draftPrefix + id);
        if (saved !== null) { memory.set(id, saved); return saved; }
      } catch { draftStatus('Không đọc được bản nháp đã lưu trên máy này.'); }
      return undefined;
    },
    set(id, code) {
      memory.set(id, code);
      try { localStorage.setItem(draftPrefix + id, code); draftStatus('Đã lưu nháp trên máy này.'); }
      catch { draftStatus('Chưa lưu được nháp. Em sao chép code trước khi đóng trang nhé.'); }
    }
  };
  function disclosure(title, content, {technical = false} = {}) {
    const details = document.createElement('details');
    details.className = technical ? 'technical-info' : 'secondary-details';
    const summary = document.createElement('summary'); summary.textContent = title;
    details.append(summary);
    if (typeof content === 'string') { const p = document.createElement('p'); p.textContent = content; details.append(p); }
    else if (content) details.append(content);
    return details;
  }
  function technicalInfo(root, content) {
    let details = document.querySelector('.technical-info');
    if (!details) { details = disclosure('ⓘ Thông tin kỹ thuật', null, {technical:true}); root.append(details); }
    if (content) {
      if (typeof content === 'string') { const p = document.createElement('p'); p.textContent = content; details.append(p); }
      else details.append(content);
    }
    return details;
  }
  function showResult(root, result) {
    root.textContent = result.message;
    root.dataset.status = result.status;
    root.dataset.state = result.status === 'AC' ? 'ok' : 'error';
    if (result.detail) {
      const pre = document.createElement('pre'); pre.textContent = result.detail;
      root.append(disclosure('Chi tiết lỗi', pre));
    }
  }
  const boundEditors = new WeakSet();
  function bindDraft(editor, getId) {
    if (boundEditors.has(editor)) return;
    boundEditors.add(editor);
    const save = () => drafts.set(getId(), editor.value);
    editor.addEventListener('input', save);
    window.addEventListener('pagehide', save);
  }
  document.querySelectorAll('textarea[data-draft-key]').forEach(editor => {
    editor.value = drafts.get(editor.dataset.draftKey) ?? editor.value;
    bindDraft(editor, () => editor.dataset.draftKey);
  });
  const desktop = matchMedia('(hover: hover) and (pointer: fine)');
  const setContents = () => document.querySelectorAll('.toc-disclosure').forEach(el => {el.open = desktop.matches;});
  desktop.addEventListener('change', setContents); setContents();
  function revealAnchor() {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target) return;
    for (let node = target; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
  }
  window.addEventListener('hashchange', revealAnchor); revealAnchor();
  window.LessonUX = {drafts, bindDraft, disclosure, technicalInfo, showResult};
})();
