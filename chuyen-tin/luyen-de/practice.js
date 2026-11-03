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
  const LINKS = window.LESSON_LINKS || {};              // id bài → bài giảng có nhắc tới bài đó
  const DP = '../bai-giang/quy-hoach-dong';
  // Tên ngắn cho từng dạng (theo thứ tự data.categories) và bài giảng nền tảng của dạng
  const CAT = [
    ['Rẽ nhánh', ['doc-de-do-phuc-tap', '0.1', 'Đọc đề, subtask và độ phức tạp']],
    ['Số học', ['uoc-boi', '2.1', 'Ước, bội, duyệt đến √n']],
    ['Xâu', ['dem-ky-tu', '4.1', 'Duyệt ký tự, đếm 26 chữ cái']],
    ['Mảng', ['mang-dem', '1.1', 'Mảng đếm, tần suất']],
    ['Lưới', ['bfs-luoi', '7.2', 'Loang trên lưới (BFS)']],
    ['Quy hoạch động', [DP, '5.1', 'Quy hoạch động cho người mới bắt đầu']],
    ['Quay lui', ['quay-lui-tap-con', '7.1', 'Quay lui, tập con']],
    ['Ad-hoc', ['thu-nho-tim-quy-luat', '3.1', 'Thử nhỏ để tìm quy luật']]
  ];
  const DIFF = ['Cơ bản', 'Trung bình', 'Khó', 'Rất khó'];
  const lessonHref = file => file.startsWith('../') ? encodeURI(file) + '.html' : '../bai-giang/' + file + '.html';
  const normalize = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
  const node = (tag, text = '', cls = '') => { const el = document.createElement(tag); el.textContent = text; if (cls) el.className = cls; return el; };
  const present = value => value || 'Không thấy ghi trong bản đề; cần kiểm tra.';
  const localUrl = path => {
    if (!path || /^(?:[a-z][a-z\d+.-]*:|[\/\\])/i.test(path) || path.split('/').includes('..')) return null;
    return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  };
  const link = (label, url) => { const a = node('a', label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };
  const storage = {
    read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { $('storage-warning').hidden = false; return fallback; } },
    write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { $('storage-warning').hidden = false; } }
  };
  const loadedDone = storage.read('dethi-practice-done', []);
  const done = new Set(Array.isArray(loadedDone) ? loadedDone.filter(x => byId.has(x)) : []);

  // Giao diện sáng/tối
  const media = matchMedia('(prefers-color-scheme: dark)');
  const dark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : media.matches;
  function syncTheme() { $('theme-toggle').setAttribute('aria-pressed', String(dark())); }
  $('theme-toggle').addEventListener('click', () => { const t = dark() ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('dethi-practice-theme', t); } catch {} syncTheme(); });
  media.addEventListener('change', syncTheme); syncTheme();

  // Đề = nhóm các bài cùng documentId, đề mới trước
  const exams = [];
  for (const p of problems) {
    let e = exams.find(x => x.id === p.documentId);
    if (!e) exams.push(e = { id: p.documentId, school: p.schoolLabel, year: p.year, note: p.publicNote ?? p.type, list: [] });
    e.list.push(p);
  }
  exams.sort((a, b) => b.year - a.year);
  const ordered = exams.flatMap(e => e.list);
  const diffOf = p => Math.max(0, DIFF.indexOf(p.difficulty));
  const catsOf = p => p.categories || [p.category];
  const splitTitle = t => {
    let m = /^([A-Z0-9_]+)\s*·\s*(.+)$/.exec(t); if (m) return [m[1], m[2]];
    m = /^((?:Bài|Câu)\s*\d+)\.\s*(.+)$/.exec(t); return m ? [m[1], m[2]] : ['', t];
  };
  const searchable = new Map(problems.map(p => [p.id, normalize([p.title, p.schoolLabel, p.examTitle, p.year, p.statement, p.input, p.output, p.constraints, ...catsOf(p).map(c => categories[c - 1])].join(' '))]));
  const statusNames = { verified: 'Code đã kiểm thử · toàn bộ', conditional: 'Code có điều kiện', partial: 'Code chỉ subtask', unavailable: 'Chưa có code kiểm chứng' };
  function pythonStatus(p) { return p.solution?.pythonStatus || p.solution?.status || 'unavailable'; }
  function statusLabel(p) { return p.solution?.python ? (statusNames[pythonStatus(p)] || statusNames.unavailable) : 'Python đang bổ sung' + (p.solution?.cpp ? ' · có C++ phụ' : ''); }
  const isVerified = p => pythonStatus(p) === 'verified' && p.solution?.python && p.solution?.pythonTests?.status === 'passed';
  const shortFlag = p => isVerified(p) ? '' : p.solution?.python ? { conditional: 'code có điều kiện', partial: 'code chỉ subtask' }[pythonStatus(p)] || 'chưa kiểm chứng' : 'chưa có Python';
  const verified = problems.filter(isVerified).length;
  $('coverage').innerHTML = `<b>${problems.length} bài</b> từ <b>${exams.length} đề</b> của ${new Set(problems.map(p => p.school)).size} trường/nhóm. <b>${verified} bài</b> có lời giải Python trọn điểm đã chạy thử.`;

  // Trạng thái bộ lọc (ghi vào URL hash để chia sẻ được)
  const state = { q: '', category: '', difficulty: '', todo: false, view: 'de' };
  let activeId = null, hintsShown = 0, savedFocus = null, applyingHash = false;
  const dialog = $('problem-dialog');
  function writeHash(replace = true) {
    if (applyingHash) return;
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.category) params.set('category', state.category);
    if (state.difficulty) params.set('difficulty', state.difficulty);
    if (state.todo) params.set('todo', '1');
    if (state.view !== 'de') params.set('view', state.view);
    if (activeId) params.set('bai', activeId);
    const hash = params.toString();
    try { history[replace ? 'replaceState' : 'pushState'](null, '', location.pathname + location.search + (hash ? '#' + hash : '')); } catch { location.hash = hash; }
  }

  // Chip độ khó và dạng bài
  function chip(label, count, value, key, cls = '') {
    const b = node('button', label, 'chip ' + cls); b.type = 'button'; b.dataset.key = key; b.dataset.value = value;
    if (cls) b.prepend(node('i', '', 'dot'));
    if (count !== null) b.append(node('small', String(count)));
    b.addEventListener('click', () => { state[key] = state[key] === value ? '' : value; render(); writeHash(); });
    return b;
  }
  $('diff-chips').append(chip('Mọi độ khó', null, '', 'difficulty'), ...DIFF.map((d, i) => chip(d, problems.filter(p => p.difficulty === d).length, d, 'difficulty', 'd' + i)));
  $('cat-chips').append(chip('Mọi dạng', null, '', 'category'), ...CAT.map((c, i) => chip(c[0], problems.filter(p => catsOf(p).includes(i + 1)).length, String(i + 1), 'category')));
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { state.view = b.dataset.view; render(); writeHash(); }));
  $('search').addEventListener('input', () => { state.q = $('search').value; render(); writeHash(); });
  $('todo').addEventListener('change', () => { state.todo = $('todo').checked; render(); writeHash(); });
  function reset() { Object.assign(state, { q: '', category: '', difficulty: '', todo: false }); render(); writeHash(); }
  $('reset').addEventListener('click', reset); $('empty-reset').addEventListener('click', reset);

  function markDone(id, checked) {
    if (checked) done.add(id); else done.delete(id);
    storage.write('dethi-practice-done', [...done]);
    if (activeId === id) $('problem-done').checked = checked;
    render();
  }

  // Bảng tiến độ: mỗi ô một bài, xếp theo đề
  function renderBoard() {
    const cells = $('board-cells'); cells.replaceChildren();
    for (const e of exams) {
      const g = node('span', '', 'cg');
      for (const p of e.list) {
        const c = node('button', done.has(p.id) ? '✓' : '', 'cell d' + diffOf(p) + (done.has(p.id) ? ' done' : ''));
        c.type = 'button'; c.title = `${e.school} ${e.year} · ${p.title} · ${p.difficulty}`;
        c.setAttribute('aria-label', c.title + (done.has(p.id) ? ' · đã làm' : ''));
        c.addEventListener('click', () => openProblem(p.id));
        g.append(c);
      }
      cells.append(g);
    }
    $('progress-text').textContent = `Đã làm ${done.size}/${problems.length}`;
    $('progress-fill').style.width = (100 * done.size / problems.length) + '%';
    // Gợi ý bài tiếp theo: bài chưa làm dễ nhất, đề mới trước
    const next = [...ordered].sort((a, b) => diffOf(a) - diffOf(b)).find(p => !done.has(p.id));
    const nu = $('next-up'); nu.hidden = false; nu.replaceChildren();
    if (!next) { nu.append(node('span', 'Đã làm hết ' + problems.length + ' bài. Giỏi lắm! Thử làm lại các bài Khó mà không xem gợi ý.', 'nu-tx')); nu.onclick = null; return; }
    const tx = node('span', '', 'nu-tx'); tx.append(node('small', 'Bài nên làm tiếp · ' + next.difficulty), node('b', next.title + ' (' + next.schoolLabel + ' ' + next.year + ')'));
    nu.append(tx, node('span', '→', 'go')); nu.onclick = () => openProblem(next.id);
  }

  function row(p, sub) {
    const r = node('div', '', 'row' + (done.has(p.id) ? ' done' : ''));
    const tick = node('button', '✓', 'tick'); tick.type = 'button';
    tick.setAttribute('aria-pressed', String(done.has(p.id))); tick.setAttribute('aria-label', 'Đã làm: ' + p.title);
    tick.addEventListener('click', () => markDone(p.id, !done.has(p.id)));
    const [code, name] = splitTitle(p.title);
    const open = node('button', '', 'open'); open.type = 'button'; open.dataset.problem = p.id;
    open.addEventListener('click', () => openProblem(p.id));
    const nm = node('span', '', 'nm'); nm.append(node('b', name));
    const s = node('span', '', 'sub');
    const d = node('span', p.difficulty, 'd' + diffOf(p)); d.prepend(node('i', '', 'dot')); s.append(d);
    const pts = String(p.points || '').trim();          // có bài ghi "2,5", có bài "3 điểm", có bài không ghi
    if (/^\d/.test(pts)) s.append(node('span', /điểm/.test(pts) ? pts : pts + ' điểm'));
    if (sub) s.append(node('span', sub));
    const flag = shortFlag(p); if (flag) s.append(node('span', flag, 'flag'));
    nm.append(s);
    if (code) open.append(node('span', code, 'code-tag'));
    open.append(nm, node('span', '›', 'go'));
    r.append(tick, open);
    return r;
  }

  function group(title, note, list, lesson, rowSub) {
    const g = node('section', '', 'grp');
    const head = node('div', '', 'grp-head'); const tx = node('div', '', 'gh-tx');
    tx.append(node('h3', title)); if (note) tx.append(node('small', note));
    if (lesson) { const a = node('a', `📘 Học trước: Bài ${lesson[1]} · ${lesson[2]}`, 'grp-lesson'); a.href = lessonHref(lesson[0]); tx.append(a); }
    const n = list.filter(p => done.has(p.id)).length;
    head.append(tx, node('span', `${n}/${list.length}`, 'count' + (n === list.length ? ' full' : '')));
    const rows = node('div', '', 'rows'); list.forEach(p => rows.append(row(p, rowSub(p))));
    g.append(head, rows);
    return g;
  }

  function render() {
    $('search').value = state.q; $('todo').checked = state.todo;
    document.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(state[b.dataset.key] === b.dataset.value)));
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
    const words = normalize(state.q).trim().split(/\s+/).filter(Boolean);
    const keep = p => (!state.category || catsOf(p).includes(Number(state.category)))
      && (!state.difficulty || p.difficulty === state.difficulty)
      && (!state.todo || !done.has(p.id))
      && words.every(w => searchable.get(p.id).includes(w));
    const out = $('groups'); out.replaceChildren();
    let shown = 0;
    if (state.view === 'dang') {
      CAT.forEach((c, i) => {
        const list = ordered.filter(p => keep(p) && (state.category ? catsOf(p).includes(i + 1) : p.category === i + 1));
        if (!list.length) return; shown += list.length;
        out.append(group(categories[i], '', list, c[1], p => p.schoolLabel + ' ' + p.year));
      });
    } else {
      for (const e of exams) {
        const list = e.list.filter(keep);
        if (!list.length) continue; shown += list.length;
        out.append(group(`${e.school} · ${e.year}`, e.note, list, null, p => CAT[p.category - 1]?.[0] || ''));
      }
    }
    $('empty').hidden = shown > 0;
    $('result-status').textContent = shown === problems.length ? `${shown} bài` : `${shown}/${problems.length} bài`;
    renderBoard();
  }

  // ---- Hộp xem đề, gợi ý, lời giải ----
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
    const pdf = localUrl(p.pdf);                          // chỉ có ở bản cục bộ; bản công khai không kèm PDF
    if (pdf) for (const page of p.pages || [1]) urls.append(link(`PDF · trang ${page}`, pdf + '#page=' + page));
    const lessons = $('problem-lessons'); lessons.replaceChildren();
    const ls = LINKS[p.id] || [];
    if (ls.length) { const box = node('div', '', 'lessons-box'); box.append(node('b', '📘 Bài giảng có bài này:')); ls.forEach(l => { const a = node('a', `${l[1]} ${l[2]}`); a.href = lessonHref(l[0]); box.append(a); }); lessons.append(box); }
    const source = $('problem-source'); source.replaceChildren(node('p', p.examTitle || ''));
    const note = p.publicNote ?? p.sourceLabel; if (note) source.append(node('p', note));
    const warnings = $('problem-warnings'); warnings.replaceChildren();
    const ws = p.publicWarnings ?? p.warnings;
    if (ws?.length) { const box = node('div', '', 'warning'); box.append(node('strong', 'Lưu ý')); const list = node('ul'); ws.forEach(w => list.append(node('li', w))); box.append(list); warnings.append(box); }
    const meta = $('problem-meta'); meta.replaceChildren();
    [['Điểm', p.points], ['Độ khó', p.difficulty], ['Dạng bài', catsOf(p).map(c => categories[c - 1]).join(' · ')], ['Thời gian chạy', p.timeLimit], ['Bộ nhớ', p.memoryLimit], ['Thời gian toàn đề', p.duration], ['File vào', p.inputFile], ['File ra', p.outputFile], ['Ngôn ngữ', p.languages]].forEach(([k, v]) => definition(meta, k, v));
    for (const id of ['statement', 'input', 'output', 'constraints']) $(id).textContent = present(p[id]);
    $('subtasks').replaceChildren(...(p.subtasks?.length ? p.subtasks : ['Không thấy ghi trong bản này; cần kiểm tra.']).map(t => node('li', t)));
    const examples = $('examples'); examples.replaceChildren();
    if (!p.examples?.length) examples.append(node('p', 'Chưa đọc chắc ví dụ của đề. Không tự tạo ví dụ rồi gọi là của đề.', 'warning'));
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
    const report = $('test-report'); report.replaceChildren(node('strong', 'Kiểm thử thực tế'));
    for (const [label, tests] of [['Python 3', solution.pythonTests], ['C++17 (bản phụ)', solution.tests]]) {
      if (!tests) continue;
      report.append(node('p', label + ': ' + tests.summary));
      report.append(node('p', `Ví dụ: ${tests.sampleCount || 0} · Đối chiếu bản trâu: ${tests.randomCount || 0} · Test biên: ${tests.boundaryCount || 0}`));
      const log = localUrl(tests.logPath); if (log) report.append(link('Nhật ký ' + label, log));
    }
    if (solution.pythonScope) report.append(node('p', 'Phạm vi / tốc độ Python: ' + solution.pythonScope));
    $('show-code').hidden = !solution.python && !solution.cpp;
    if (!solution.python) report.append(node('p', 'Chưa có Python đã chạy thử cho bài này; không lấy kết quả C++ thay cho Python.'));
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
    state.q = hash.get('q') || '';
    state.category = /^[1-8]$/.test(hash.get('category') || '') ? hash.get('category') : '';
    state.difficulty = DIFF.includes(hash.get('difficulty')) ? hash.get('difficulty') : '';
    state.todo = hash.get('todo') === '1';
    state.view = hash.get('view') === 'dang' ? 'dang' : 'de';
    render();
    const requested = hash.get('bai');
    if (requested && byId.has(requested)) { if (activeId !== requested || !dialog.open) openProblem(requested, false); }
    else if (dialog.open) closeProblem(false);
    applyingHash = false;
  }
  window.addEventListener('hashchange', applyHash);
  window.addEventListener('popstate', applyHash);
  window.addEventListener('storage', event => { if (event.key === 'dethi-practice-done') { const values = storage.read(event.key, []); done.clear(); if (Array.isArray(values)) values.forEach(id => { if (byId.has(id)) done.add(id); }); render(); if (activeId) $('problem-done').checked = done.has(activeId); } });
  applyHash();
})();
