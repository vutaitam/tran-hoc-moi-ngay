(() => {
  'use strict';
  const app = window.LessonApp, data = window.PREFIX_DATA, ux = window.LessonUX;
  const $ = id => document.getElementById(id);
  const esc = app.escape;
  function feedback(id, text, good = false) {
    const el = typeof id === 'string' ? $(id) : id;
    el.textContent = text; el.dataset.state = good ? 'ok' : 'error';
  }
  document.querySelectorAll('form[data-answer]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const correct = form.querySelector('input').value.trim() === form.dataset.answer;
      feedback(form.querySelector('.feedback'), correct ? '✓ ' + form.dataset.explanation : 'Chưa đúng. ' + form.dataset.hint, correct);
      if (correct) app.mark('activities', form.dataset.activity);
    });
  });
  $('brute-code').innerHTML = app.highlight(data.snippets.bruteRange);
  let a = [3, -1, 4, 2, 5], step = 0, l = 2, r = 4, dragStart = null, simulator;
  function fullPrefix() { const pre = [0]; a.forEach(value => pre.push(pre[pre.length - 1] + value)); return pre; }
  function pause() { simulator?.pause(); }
  function setStep(value) { simulator.go(value); }
  window.PrefixVisualState = {get current() {return {a: a.slice(), pre: fullPrefix(), step, l, r};}};
  function renderSimulation() {
    const pre = fullPrefix(), count = a.length + 1;
    const width = Math.max(count * 38 + 60, Math.round($('prefix-chart').parentElement.clientWidth));
    const slot = (width - 75) / count;
    $('prefix-chart').setAttribute('viewBox', `0 0 ${width} 290`);
    $('prefix-chart').style.minWidth = `${count * 38 + 60}px`;
    const low = Math.min(0, ...pre), high = Math.max(1, ...pre), scale = 130 / (high - low);
    const y = value => 180 - (value - low) * scale, zero = y(0);
    const bars = pre.map((value, i) => {
      const x = 55 + slot * i, known = i <= step;
      const selected = i >= l && i <= r;
      const height = Math.abs(value * scale), top = Math.min(y(value), zero);
      const detail = `i=${i}; ${i ? 'a[i]=' + a[i - 1] : 'ô gốc'}; pre[i]=${known ? value : 'chưa tính'}`;
      return `<g tabindex="0" data-index="${i}" aria-label="${esc(detail)}">${selected ? `<rect class="selected" x="${x - slot / 2 + 1}" y="30" width="${slot - 2}" height="225" rx="4"/>` : ''}${known && value !== 0 ? `<rect class="bar" x="${x - 11}" y="${top}" width="22" height="${height}" rx="4"/>` : ''}${known && value === 0 ? `<circle class="bar" cx="${x}" cy="${zero}" r="4"/>` : ''}${i === step ? `<circle class="current" cx="${x}" cy="17" r="5"/>` : ''}<text x="${x}" y="222" text-anchor="middle">${i}</text><text x="${x}" y="247" text-anchor="middle">${i ? a[i - 1] : '—'}</text>${known && i === step ? `<text x="${x}" y="${value >= 0 ? top - 9 : top + height + 18}" text-anchor="middle">${value}</text>` : ''}<rect class="hit" x="${x - slot / 2}" y="28" width="${slot}" height="235"/></g>`;
    }).join('');
    $('prefix-chart').innerHTML = `<title id="chart-title">Tổng tiền tố pre[i] — đã điền đến i=${step}</title><desc id="chart-desc">Cột âm nằm dưới đường 0; chỉ số i và a[i] ghi dưới cột. Bảng phía dưới có đủ số chính xác.</desc><line class="axis" x1="35" y1="${zero}" x2="${width - 10}" y2="${zero}"/><text x="10" y="${zero + 4}">0</text><text x="8" y="222">i</text><text x="0" y="247">a[i]</text>${bars}`;
    $('sim-table').querySelector('tbody').innerHTML = pre.map((value, i) => `<tr${i === step ? ' aria-current="step"' : ''}><td>${i}${i === step ? ' ← đang xét' : ''}</td><td>${i ? a[i - 1] : 'ô đệm'}</td><td>${i <= step ? value : 'chưa tính'}</td></tr>`).join('');
    $('sim-state').textContent = step === 0 ? 'Bắt đầu với pre[0] = 0.' : `i = ${step}: pre[${step}] = pre[${step - 1}] + a[${step}] = ${pre[step - 1]} + (${a[step - 1]}) = ${pre[step]}`;
    $('sim-back').disabled = step === 0; $('sim-next').disabled = step === a.length;
    $('range-l').max = $('range-r').max = a.length;
    $('range-l').value = l; $('range-r').value = r; $('l-value').value = l; $('r-value').value = r;
    $('range-result').textContent = step < r ? `Đoạn [${l}, ${r}]: cần điền đến pre[${r}] trước khi trả lời.` : `[${l}, ${r}]: pre[${r}] − pre[${l - 1}] = ${pre[r]} − (${pre[l - 1]}) = ${pre[r] - pre[l - 1]}`;
    $('predict-question').textContent = step < a.length ? `Đã biết pre[${step}] = ${pre[step]}. Số tiếp theo a[${step + 1}] = ${a[step]}. Em đoán pre[${step + 1}] bằng bao nhiêu?` : 'Bảng đã đủ. Em đổi đoạn hoặc bấm Lùi để thử lại nhé.';
    $('check-predict').disabled = step === a.length; $('predict-value').disabled = step === a.length;
    $('predict-result').textContent = ''; $('predict-value').value = '';
    document.querySelectorAll('.code-line').forEach(line => line.classList.toggle('active', step === 0 ? line.dataset.action === 'init' : line.dataset.action === 'step'));
    document.dispatchEvent(new Event('prefixvisualchange'));
  }
  simulator = window.LessonVisual.stepper($('simulation'), {
    build: () => fullPrefix().map((value, i) => ({i, value})),
    render: state => { step = state.i; renderSimulation(); }
  });
  $('apply-input').onclick = () => {
    const text = $('sim-input').value.trim(), parts = text.split(/[\s,]+/);
    if (!text || parts.length > 10 || parts.some(value => !/^-?\d+$/.test(value) || Math.abs(Number(value)) > 99)) {
      feedback('sim-error', 'Nhập 1–10 số nguyên từ −99 đến 99. Dùng dấu cách hoặc dấu phẩy giữa các số.'); return;
    }
    pause(); a = parts.map(Number); l = 1; r = a.length; $('sim-error').textContent = ''; simulator.rebuild();
  };
  $('sim-input').addEventListener('keydown', event => { if (event.key === 'Enter') $('apply-input').click(); });
  $('check-predict').onclick = () => {
    const expected = fullPrefix()[step + 1];
    const text = $('predict-value').value.trim(), correct = text !== '' && Number(text) === expected;
    feedback('predict-result', correct ? '✓ Đúng. Bấm Tiếp để xem phép gán trong code.' : `Chưa đúng. Em cộng pre[${step}] và a[${step + 1}], nhớ giữ dấu âm.`, correct);
    if (correct) app.mark('activities', 'predict');
  };
  $('range-l').oninput = () => { l = Number($('range-l').value); if (l > r) r = l; renderSimulation(); };
  $('range-r').oninput = () => { r = Number($('range-r').value); if (r < l) l = r; renderSimulation(); };
  function showColumn(target) {
    const group = target.closest('g[data-index]'); if (!group) return;
    $('sim-tooltip').textContent = group.getAttribute('aria-label');
  }
  $('prefix-chart').addEventListener('pointerover', event => showColumn(event.target));
  $('prefix-chart').addEventListener('focusin', event => showColumn(event.target));
  $('prefix-chart').addEventListener('pointerdown', event => {
    const group = event.target.closest('g[data-index]'); if (!group || Number(group.dataset.index) === 0) return;
    pause(); dragStart = Number(group.dataset.index); l = r = dragStart; $('prefix-chart').setPointerCapture(event.pointerId); renderSimulation();
  });
  $('prefix-chart').addEventListener('pointermove', event => {
    if (dragStart === null) return;
    const rect = $('prefix-chart').getBoundingClientRect(), width = $('prefix-chart').viewBox.baseVal.width;
    const x = (event.clientX - rect.left) / rect.width * width;
    const i = Math.max(1, Math.min(a.length, Math.round((x - 55) / ((width - 75) / (a.length + 1)))));
    l = Math.min(dragStart, i); r = Math.max(dragStart, i); renderSimulation();
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) $('prefix-chart').addEventListener(type, () => { dragStart = null; });
  $('go-difference').onclick = () => { $('difference').open = true; };

  const parsonsLines = {size:'n = 3', array:'a = [0, 3, -1, 4]', init:'pre = [0] * (n + 1)', loop:'for i in range(1, n + 1):', body:'    pre[i] = pre[i - 1] + a[i]', output:'print(pre[n])'};
  let order = ['output', 'body', 'size', 'loop', 'array', 'init'], dragged = null;
  function renderParsons(focusId, direction) {
    $('parsons-list').innerHTML = order.map((id, i) => `<li draggable="true" data-id="${id}"><code>${esc(parsonsLines[id])}</code><button type="button" data-move="-1" aria-label="Đưa dòng ${i + 1} lên" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" data-move="1" aria-label="Đưa dòng ${i + 1} xuống" ${i === order.length - 1 ? 'disabled' : ''}>↓</button></li>`).join('');
    if (focusId) $('parsons-list').querySelector(`[data-id="${focusId}"] button[data-move="${direction}"]:not(:disabled)`)?.focus();
  }
  $('parsons-list').addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    const id = button.closest('li').dataset.id, i = order.indexOf(id), to = i + Number(button.dataset.move);
    [order[i], order[to]] = [order[to], order[i]]; renderParsons(id, button.dataset.move);
  });
  $('parsons-list').addEventListener('dragstart', event => { dragged = event.target.closest('li').dataset.id; event.dataTransfer.setData('text/plain', dragged); });
  $('parsons-list').addEventListener('dragover', event => event.preventDefault());
  $('parsons-list').addEventListener('drop', event => {
    event.preventDefault(); const target = event.target.closest('li'); if (!target || !dragged) return;
    const to = order.indexOf(target.dataset.id); order.splice(order.indexOf(dragged), 1); order.splice(to, 0, dragged); dragged = null; renderParsons();
  });
  $('check-parsons').onclick = () => {
    const pos = id => order.indexOf(id);
    const correct = pos('size') < pos('init') && pos('init') < pos('loop') && pos('array') < pos('loop') && pos('body') === pos('loop') + 1 && pos('output') === order.length - 1;
    feedback('parsons-result', correct ? '✓ Đúng! Tạo đủ bảng rồi in pre[n] = 6.' : 'Tạo n trước pre; tạo a và pre trước vòng lặp. Đặt dòng thụt lề ngay dưới for, rồi print cuối cùng.', correct);
    if (correct) app.mark('activities', 'parsons');
  };
  const activityTests = [
    [[3,-1,4,2,5],2,4], [[3,-1,4,2,5],1,5], [[3,-1,4,2,5],1,1], [[3,-1,4,2,5],5,5],
    [[-7],1,1], [[0],1,1], [[-3,-2,-8],2,3], [[1000000000,1000000000],1,2],
    [[1,0,1],2,2], [[4,5,6],1,2], [[-1,1,-1,1],1,4], [[9,-9,2],2,3]
  ].map(([values, left, right]) => ({input:`${values.length} ${left} ${right}\n${values.join(' ')}\n`, output:String(values.slice(left-1, right).reduce((x,y) => x+y,0))}));
  const activityPrefix = 'import sys\ninput = sys.stdin.readline\nn, l, r = map(int, input().split())\na = [0] + list(map(int, input().split()))\npre = [0] * (n + 1)\nfor i in range(1, n + 1):\n    pre[i] = pre[i - 1] + a[i]\n';
  async function checkActivity(id, code) {
    feedback(id + '-result', 'Đang chạy… Bấm Dừng ở sân tập nếu cần.', true);
    const result = await window.PythonRunner.run(code, activityTests);
    ux.showResult($(id + '-result'), result);
    if (result.status === 'AC') app.mark('activities', id);
  }
  $('check-blank').onclick = () => {
    const expression = $('blank-expression').value.trim();
    if (!expression) return feedback('blank-result', 'Em hãy điền biểu thức.');
    checkActivity('blank', activityPrefix + `answer = (${expression})\nprint(answer)\n`);
  };
  $('check-bug').onclick = () => {
    if ($('bug-line').value !== '3') return feedback('bug-result', 'Em thử tính pre[4] − pre[2], rồi so với tổng vị trí 2..4. Dòng nào đã bỏ mất a[l]?');
    const fix = $('bug-fix').value.trim();
    if (!fix) return feedback('bug-result', 'Em hãy nhập dòng sửa.');
    checkActivity('bug', activityPrefix + fix + '\nprint(answer)\n');
  };

  let current = data.problems[0], hint = 0, requestedCode = null;
  const drafts = ux.drafts;
  ux.bindDraft($('code-editor'), () => 'prefix/' + current.id);
  $('problem-select').innerHTML = data.problems.map(problem => `<option value="${esc(problem.id)}">${esc(problem.level)} · ${esc(problem.title)}</option>`).join('');
  function renderProblem() {
    hint = 0;
    $('practice-title').textContent = current.title;
    $('practice-statement').replaceChildren(...current.statement.split(/\n\n+/).map(text => {
      const paragraph = document.createElement('p'); paragraph.textContent = text; return paragraph;
    }));
    $('practice-constraints').textContent = current.constraints; $('sample-input').textContent = current.sample.input;
    $('sample-output').textContent = current.sample.output; $('sample-explanation').textContent = current.sample.explanation;
    $('code-editor').value = drafts.get('prefix/' + current.id) ?? current.starter;
    $('practice-hints').replaceChildren(); $('next-hint').disabled = false; $('next-hint').textContent = 'Mở gợi ý 1';
    $('practice-solution').hidden = true; $('practice-solution').querySelector('code').textContent = '';
    syncCodeButtons();
    $('practice-result').textContent = 'Kết quả sẽ xuất hiện ở đây.'; updateProgress();
  }
  $('problem-select').onchange = () => { drafts.set('prefix/' + current.id, $('code-editor').value); current = data.problems.find(problem => problem.id === $('problem-select').value); renderProblem(); };
  $('next-hint').onclick = () => {
    if (hint >= current.hints.length) return;
    const box = document.createElement('div'); box.className = 'hint'; box.textContent = `Gợi ý ${hint + 1} · ${current.hints[hint]}`; $('practice-hints').append(box); hint++;
    $('next-hint').disabled = hint === current.hints.length; $('next-hint').textContent = hint === current.hints.length ? 'Đã mở đủ 3 gợi ý' : `Mở gợi ý ${hint + 1}`;
  };
  async function runPractice(submit) {
    const id = current.id, code = $('code-editor').value; drafts.set('prefix/' + id, code);
    $('practice-result').textContent = 'Đang chạy…';
    const hiddenHint = current.id === 'all-prefix' ? 'Em thử n=1, số 0 và dãy toàn âm.'
      : current.id === 'fixed-window' ? 'Em thử k=1, k=n và dãy toàn âm.'
      : 'Thử lại các biên: l=1, l=r, r=n.';
    const result = await window.PythonRunner.run(code, submit ? current.tests : [current.sample], {hidden:submit, hiddenHint});
    ux.showResult($('practice-result'), result);
    if (submit && result.status === 'AC') app.mark('ac', id);
  }
  $('run-sample').onclick = () => runPractice(false); $('submit-code').onclick = () => runPractice(true);
  function modelCode() {
    $('model-code').innerHTML = data.snippets.modelRange.trimEnd().split('\n').map((line, i) => {
      const action = /^\s*pre =/.test(line) ? 'init' : /^\s*pre\[i\]\s*=/.test(line) ? 'step' : /pre\[r\]\s*-\s*pre\[l\s*-\s*1\]/.test(line) ? 'query' : 'io';
      return `<button class="code-line" data-action="${action}" type="button"><span class="line-num">${i + 1}</span>${app.highlight(line) || ' '}</button>`;
    }).join('');
  }
  $('model-code').onclick = event => {
    const line = event.target.closest('.code-line'); if (!line) return;
    pause();
    const action = line.dataset.action;
    if (action === 'init') setStep(0);
    else if (action === 'step') setStep(step === a.length ? 1 : step + 1);
    else if (action === 'query') setStep(a.length);
    document.querySelectorAll('.code-line').forEach(el => el.classList.toggle('active', el === line));
    $('code-note').textContent = action === 'io' ? 'Dòng này chưa đổi bảng tổng. Mô phỏng giữ nguyên dãy em chọn.' : $('sim-state').textContent + (action === 'query' ? '\n' + $('range-result').textContent : '');
  };
  document.querySelectorAll('.reveal-code').forEach(button => button.onclick = () => { document.dispatchEvent(new Event('pausevisuals')); requestedCode = button.dataset.code; $('code-confirm').returnValue = ''; $('code-confirm').showModal(); });
  function syncCodeButtons() {
    document.querySelectorAll('[data-hide-code]').forEach(button => { button.hidden = $(button.dataset.hideCode).hidden; });
  }
  document.querySelectorAll('[data-hide-code]').forEach(button => button.onclick = () => {
    $(button.dataset.hideCode).hidden = true; syncCodeButtons();
  });
  $('code-confirm').addEventListener('close', () => {
    if ($('code-confirm').returnValue !== 'show') return;
    if (requestedCode === 'model') { $('model-content').hidden = false; modelCode(); $('model').scrollIntoView(); }
    else if (requestedCode === 'difference') { $('difference-code').hidden = false; $('difference-code').querySelector('code').innerHTML = app.highlight(data.snippets.difference); }
    else if (requestedCode === 'prefix-trace' || requestedCode === 'diff-trace') { $(requestedCode).hidden = false; }
    else { $('practice-solution').hidden = false; $('practice-solution').querySelector('code').innerHTML = app.highlight(current.solution); }
    syncCodeButtons();
  });
  function updateProgress() {
    $('lesson-progress').textContent = `${Object.values(app.progress.activities).filter(Boolean).length}/9 hoạt động xong · ${Object.values(app.progress.ac).filter(Boolean).length}/4 bài luyện đã làm đúng`;
    $('problem-ac').textContent = app.progress.ac[current.id] ? '✓ Đã làm đúng' : 'Chưa làm đúng';
    $('learned').checked = app.progress.learned;
    document.querySelectorAll('[data-exam]').forEach(input => { input.checked = Boolean(app.progress.exams[input.dataset.exam]); });
  }
  $('learned').onchange = () => app.mark('learned', null, $('learned').checked);
  document.querySelectorAll('[data-exam]').forEach(input => input.onchange = () => app.mark('exams', input.dataset.exam, input.checked));
  document.addEventListener('progresschange', updateProgress);
  window.addEventListener('pagehide', pause);
  window.addEventListener('resize', renderSimulation);
  renderSimulation(); renderParsons(); renderProblem();
})();
