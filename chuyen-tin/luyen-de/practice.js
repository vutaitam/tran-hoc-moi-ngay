(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const data = window.PRACTICE_DATA;
  if (!data || !Array.isArray(data.problems)) {
    $('result-status').textContent = 'Không đọc được practice-data.js. Giữ file dữ liệu cùng thư mục index.html.';
    return;
  }
  const problems = data.problems;
  const byId = new Map(problems.map(p => [p.id, p]));
  const categories = data.categories;
  const controls = ['school', 'year', 'category', 'difficulty', 'progress', 'search'];
  const normalize = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
  const node = (tag, text = '', cls = '') => { const el = document.createElement(tag); el.textContent = text; if (cls) el.className = cls; return el; };
  const present = value => value || 'Không thấy ghi trong bản đề; cần kiểm tra.';
  const localUrl = path => {
    if (!path || /^(?:[a-z][a-z\d+.-]*:|[\/\\])/i.test(path) || path.split('/').includes('..')) return null;
    return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  };
  const webUrl = value => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : null; } catch { return null; } };
  const link = (label, url) => { const a = node('a', label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };
  const storage = {
    read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { $('storage-warning').hidden = false; return fallback; } },
    write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { $('storage-warning').hidden = false; } }
  };
  const loadedDone = storage.read('dethi-practice-done', []);
  const done = new Set(Array.isArray(loadedDone) ? loadedDone.filter(x => typeof x === 'string') : []);
  const media = matchMedia('(prefers-color-scheme: dark)');
  const dark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : media.matches;
  function syncTheme() { $('theme-label').textContent = dark() ? 'Chế độ tối' : 'Chế độ sáng'; $('theme-toggle').setAttribute('aria-pressed', String(dark())); }
  $('theme-toggle').addEventListener('click', () => { const t = dark() ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('dethi-practice-theme', t); } catch {} syncTheme(); });
  media.addEventListener('change', syncTheme); syncTheme();
  function option(select, value, label) { const o = node('option', label); o.value = String(value); select.append(o); }
  const schools = new Map(problems.map(p => [p.school, p.schoolLabel]));
  for (const [key, label] of schools) option($('school'), key, label);
  [...new Set(problems.map(p => p.year))].sort((a, b) => b - a).forEach(y => option($('year'), y, y));
  categories.forEach((c, i) => option($('category'), i + 1, `${i + 1}. ${c}`));
  const searchable = new Map(problems.map(p => [p.id, normalize([p.title, p.schoolLabel, p.examTitle, p.year, p.statement, p.input, p.output, p.constraints, ...(p.categories || [p.category]).map(c => categories[c - 1])].join(' '))]));
  const statusNames = { verified: 'Code đã kiểm thử · toàn bộ', conditional: 'Code có điều kiện', partial: 'Code chỉ subtask', unavailable: 'Chưa có code kiểm chứng' };
  function pythonStatus(p) { return p.solution?.pythonStatus || p.solution?.status || 'unavailable'; }
  function statusLabel(p) { return p.solution?.python ? (statusNames[pythonStatus(p)] || statusNames.unavailable) : 'Python đang bổ sung' + (p.solution?.cpp ? ' · có C++ phụ' : ''); }
  const isVerified = p => pythonStatus(p) === 'verified' && p.solution?.python && p.solution?.pythonTests?.status === 'passed';
  const verified = problems.filter(isVerified).length;
  const tested = problems.filter(p => p.solution?.python && ['passed', 'conditional'].includes(p.solution?.pythonTests?.status)).length;
  $('coverage').textContent = `${problems.length} bài · ${schools.size} trường/nhóm · ${verified} lời giải Python toàn bộ đã kiểm thử · ${tested} bài có Python đã chạy`;
  let activeId = null;
  let hintsShown = 0;
  let savedFocus = null;
  let applyingHash = false;
  const dialog = $('problem-dialog');
  function writeHash(replace = true) {
    if (applyingHash) return;
    const params = new URLSearchParams();
    for (const id of controls) if ($(id).value) params.set(id === 'search' ? 'q' : id, $(id).value);
    if (activeId) params.set('bai', activeId);
    const hash = params.toString();
    const next = location.pathname + location.search + (hash ? '#' + hash : '');
    try { history[replace ? 'replaceState' : 'pushState'](null, '', next); } catch { location.hash = hash; }
  }
  function markDone(id, checked) {
    if (checked) done.add(id); else done.delete(id);
    storage.write('dethi-practice-done', [...done]);
    if (activeId === id) $('problem-done').checked = checked;
    renderList();
  }
  function renderList() {
    const words = normalize($('search').value).trim().split(/\s+/).filter(Boolean);
    const selected = problems.filter(p => {
      if ($('school').value && p.school !== $('school').value) return false;
      if ($('year').value && String(p.year) !== $('year').value) return false;
      if ($('category').value && !(p.categories || [p.category]).includes(Number($('category').value))) return false;
      if ($('difficulty').value && p.difficulty !== $('difficulty').value) return false;
      if ($('progress').value === 'done' && !done.has(p.id)) return false;
      if ($('progress').value === 'todo' && done.has(p.id)) return false;
      if ($('progress').value === 'verified' && !isVerified(p)) return false;
      return words.every(w => searchable.get(p.id).includes(w));
    });
    const fragment = document.createDocumentFragment();
    for (const p of selected) {
      const tr = node('tr'); tr.dataset.id = p.id;
      const checkCell = node('td');
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = done.has(p.id); checkbox.setAttribute('aria-label', `Đã làm: ${p.title}`);
      checkbox.addEventListener('change', () => markDone(p.id, checkbox.checked)); checkCell.append(checkbox);
      const schoolCell = node('td'); schoolCell.append(node('span', p.schoolLabel, 'school'), node('small', String(p.year)));
      const titleCell = node('td'); const button = node('button', p.title, 'problem-link'); button.type = 'button'; button.dataset.problem = p.id; button.append(node('small', 'Đọc đề & luyện giải →')); button.addEventListener('click', () => openProblem(p.id));
      const subline = node('small', p.publicNote); const badge = node('span', statusLabel(p), 'badge' + (isVerified(p) ? '' : ' warn'));
      titleCell.append(button, subline, badge);
      const categoryCell = node('td', (p.categories || [p.category]).map(c => categories[c - 1]).join(' · '), 'category-label');
      tr.append(checkCell, schoolCell, titleCell, categoryCell, node('td', p.difficulty), node('td', present(p.points)));
      fragment.append(tr);
    }
    $('problem-list').replaceChildren(fragment);
    $('empty').hidden = selected.length > 0;
    document.querySelector('.table-wrap').hidden = selected.length === 0;
    $('result-status').textContent = `${selected.length} / ${problems.length} bài · ${done.size} đã đánh dấu`;
  }
  function setFiltersExpanded(expanded) { $('filter-fields').hidden = !expanded; $('filter-toggle').setAttribute('aria-expanded', String(expanded)); }
  const mobile = matchMedia('(max-width:650px)');
  setFiltersExpanded(!mobile.matches);
  mobile.addEventListener('change', () => setFiltersExpanded(!mobile.matches));
  $('filter-toggle').addEventListener('click', () => setFiltersExpanded($('filter-fields').hidden));
  $('filter-fields').addEventListener('submit', e => e.preventDefault());
  controls.forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', () => { renderList(); writeHash(); }));
  function reset() { controls.forEach(id => $(id).value = ''); renderList(); writeHash(); }
  $('reset').addEventListener('click', reset); $('empty-reset').addEventListener('click', reset);
  function chooseTab(name) {
    ['statement', 'solution'].forEach(key => { const on = name === key; $('tab-' + key).setAttribute('aria-selected', String(on)); $('tab-' + key).tabIndex = on ? 0 : -1; $(key + '-panel').hidden = !on; });
    document.querySelector('.dialog-content').scrollTop = 0;
  }
  for (const name of ['statement', 'solution']) {
    $('tab-' + name).addEventListener('click', () => chooseTab(name));
    $('tab-' + name).addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 'statement' : event.key === 'End' ? 'solution' : name === 'statement' ? 'solution' : 'statement'; chooseTab(next); $('tab-' + next).focus(); } });
  }
  $('go-hints').addEventListener('click', () => { chooseTab('solution'); $('tab-solution').focus(); });
  function definition(list, title, value) { const div = node('div'); div.append(node('dt', title), node('dd', present(value))); list.append(div); }
  function fillProblem(p) {
    hintsShown = 0;
    $('problem-kicker').textContent = `${p.schoolLabel} · ${p.year}`;
    $('problem-title').textContent = p.title;
    $('problem-done').checked = done.has(p.id);
    const urls = $('pdf-links'); urls.replaceChildren();
    // Public release omits PDF/OCR and source-link requirements.
    const source = $('problem-source'); source.replaceChildren(node('small', p.publicNote || ''));
    // Public metadata uses school, year and a compact classification note.
    const warnings = $('problem-warnings'); warnings.replaceChildren();
    if (p.publicWarnings?.length) { const box = node('div', '', 'warning'); box.append(node('strong', 'Lưu ý / cần kiểm tra')); const list = node('ul'); p.publicWarnings.forEach(w => list.append(node('li', w))); box.append(list); warnings.append(box); }
    const meta = $('problem-meta'); meta.replaceChildren();
    [['Điểm', p.points], ['Độ khó', p.difficulty], ['Dạng bài', (p.categories || [p.category]).map(c => categories[c - 1]).join(' · ')], ['Thời gian chạy', p.timeLimit], ['Bộ nhớ', p.memoryLimit], ['Thời gian toàn đề', p.duration], ['File vào', p.inputFile], ['File ra', p.outputFile], ['Ngôn ngữ', p.languages]].forEach(([k, v]) => definition(meta, k, v));
    for (const id of ['statement', 'input', 'output', 'constraints']) $(id).textContent = present(p[id]);
    $('subtasks').replaceChildren(...(p.subtasks?.length ? p.subtasks : ['Không thấy ghi trong bản này; cần kiểm tra.']).map(t => node('li', t)));
    const examples = $('examples'); examples.replaceChildren();
    if (!p.examples?.length) examples.append(node('p', 'Chưa đọc chắc ví dụ; cần kiểm tra trên PDF gốc. Không tự tạo ví dụ rồi gọi là của đề.', 'warning'));
    (p.examples || []).forEach((example, index) => {
      const box = node('div', '', 'example'); box.append(node('div', `Ví dụ ${index + 1}`, 'example-heading'));
      const grid = node('div', '', 'example-grid');
      for (const [label, value] of [['Input', example.input], ['Output', example.output]]) { const col = node('div'); col.append(node('div', label, 'example-label'), node('pre', value)); grid.append(col); }
      box.append(grid); if (example.explanation) box.append(node('div', example.explanation, 'example-explanation')); examples.append(box);
    });
    $('hints').replaceChildren();
    $('next-hint').textContent = 'Mở gợi ý 1'; $('next-hint').hidden = !p.hints?.length;
    $('solution-review').hidden = true; $('code-section').hidden = true; $('source-code').textContent = ''; $('copy-status').textContent = '';
    $('solution-status').replaceChildren(node('span', statusLabel(p), 'badge' + (isVerified(p) ? '' : ' warn')));
    const solution = p.solution || {};
    $('solution-scope').textContent = present(solution.scope);
    $('solution-explanation').textContent = solution.explanation || '';
    $('solution-complexity').textContent = solution.complexity ? 'Độ phức tạp: ' + solution.complexity : '';
    const report = $('test-report'); report.replaceChildren(node('strong', 'Kiểm thử thực tế — Python 3'));
    for (const [label, tests] of [['Python 3', solution.pythonTests], ['C++17 (bản phụ)', solution.tests]]) {
      if (!tests) continue;
      report.append(node('p', label + ': ' + tests.summary));
      report.append(node('p', `Ví dụ: ${tests.sampleCount || 0} · Đối chiếu bản trâu: ${tests.randomCount || 0} · Test biên: ${tests.boundaryCount || 0}`));
      const log = localUrl(tests.logPath); if (log) report.append(link('Nhật ký ' + label, log));
    }
    if (solution.pythonScope) report.append(node('p', 'Phạm vi / tốc độ Python: ' + solution.pythonScope));
    $('show-code').hidden = !solution.python && !solution.cpp;
    if (!solution.python) report.append(node('p', 'Chưa cung cấp Python đã chạy thử cho bài này; không lấy kết quả C++ thay cho Python.'));
    if (!p.hints?.length) $('solution-review').hidden = false;
    chooseTab('statement');
  }
  function openProblem(id, updateHash = true) {
    const p = byId.get(id); if (!p) return;
    if (!dialog.open) savedFocus = document.activeElement;
    activeId = id; fillProblem(p);
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (updateHash) writeHash(false);
    $('close-problem').focus();
  }
  function closeProblem(updateHash = true) {
    const id = activeId;
    activeId = null;
    pendingCodeId = null;
    if (confirmation.open) confirmation.close('cancel');
    if (dialog.open) dialog.close();
    document.body.style.overflow = '';
    if (updateHash) writeHash();
    const fallback = [...document.querySelectorAll('[data-problem]')].find(b => b.dataset.problem === id);
    if (savedFocus?.isConnected) savedFocus.focus(); else fallback?.focus();
  }
  $('close-problem').addEventListener('click', () => closeProblem());
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeProblem(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeProblem(); } });
  $('problem-done').addEventListener('change', () => { if (activeId) markDone(activeId, $('problem-done').checked); });
  $('next-hint').addEventListener('click', () => {
    const p = byId.get(activeId); if (!p || hintsShown >= p.hints.length) return;
    const hint = node('div', '', 'hint'); hint.append(node('h4', 'Gợi ý ' + (hintsShown + 1)), node('p', p.hints[hintsShown])); $('hints').append(hint); hintsShown++;
    $('next-hint').textContent = 'Mở gợi ý ' + (hintsShown + 1);
    if (hintsShown === p.hints.length) { $('next-hint').hidden = true; $('solution-review').hidden = false; }
  });
  const confirmation = $('code-confirm');
  let pendingCodeId = null;
  $('show-code').addEventListener('click', () => {
    const solution = byId.get(activeId)?.solution;
    if (!solution?.python && !solution?.cpp) return;
    pendingCodeId = activeId;
    confirmation.returnValue = '';
    confirmation.showModal();
    $('cancel-code').focus();
  });
  confirmation.addEventListener('close', () => {
    const approved = confirmation.returnValue === 'show' && pendingCodeId === activeId;
    pendingCodeId = null;
    const solution = byId.get(activeId)?.solution;
    if (!approved || (!solution?.python && !solution?.cpp)) return;
    $('code-section').hidden = false;
    chooseCode('python');
    $('code-section').scrollIntoView({ block: 'start' });
  });
  function chooseCode(language) {
    if ($('code-section').hidden) return;
    const solution = byId.get(activeId)?.solution;
    if (!solution) return;
    for (const key of ['python', 'cpp']) {
      $('code-' + key).setAttribute('aria-selected', String(key === language));
      $('code-' + key).tabIndex = key === language ? 0 : -1;
    }
    $('code-content').setAttribute('aria-labelledby', 'code-' + language);
    $('source-code').textContent = solution[language] || 'Chưa có mã đã kiểm thử cho ngôn ngữ này.';
    $('code-scope').textContent = language === 'python' ? [solution.pythonScope, solution.pythonComplexity].filter(Boolean).join('\n') : solution.scope;
    $('copy-status').textContent = '';
    $('copy-code').disabled = !solution[language];
    const path = solution[language + 'Path'];
    const url = localUrl(path);
    $('code-download').hidden = !url;
    if (url) { $('code-download').href = url; $('code-download').download = path.split('/').at(-1); }
  }
  for (const language of ['python', 'cpp']) {
    $('code-' + language).addEventListener('click', () => chooseCode(language));
    $('code-' + language).addEventListener('keydown', event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 'python' : event.key === 'End' ? 'cpp' : language === 'python' ? 'cpp' : 'python';
        chooseCode(next); $('code-' + next).focus();
      }
    });
  }
  $('copy-code').addEventListener('click', async () => {
    const text = $('source-code').textContent;
    try { if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable'); await navigator.clipboard.writeText(text); $('copy-status').textContent = 'Đã copy code.'; }
    catch { const textarea = document.createElement('textarea'); textarea.value = text; textarea.style.position = 'fixed'; textarea.style.opacity = '0'; dialog.append(textarea); textarea.select(); let copied = false; try { copied = document.execCommand('copy'); } catch {} textarea.remove(); $('copy-status').textContent = copied ? 'Đã copy code.' : 'Trình duyệt chặn copy. Hãy chọn đoạn code hoặc tải mã nguồn.'; $('copy-code').focus(); }
  });
  function applyHash() {
    applyingHash = true;
    const hash = new URLSearchParams(location.hash.slice(1));
    for (const id of controls) { const value = hash.get(id === 'search' ? 'q' : id) || ''; if (id === 'search') $(id).value = value; else $(id).value = [...$(id).options].some(o => o.value === value) ? value : ''; }
    renderList();
    const requested = hash.get('bai');
    if (requested && byId.has(requested)) { if (activeId !== requested || !dialog.open) openProblem(requested, false); }
    else if (dialog.open) closeProblem(false);
    applyingHash = false;
  }
  window.addEventListener('hashchange', applyHash);
  window.addEventListener('popstate', applyHash);
  window.addEventListener('storage', event => { if (event.key === 'dethi-practice-done') { const values = storage.read(event.key, []); done.clear(); if (Array.isArray(values)) values.forEach(id => { if (byId.has(id)) done.add(id); }); renderList(); if (activeId) $('problem-done').checked = done.has(activeId); } });
  applyHash();
})();
