(() => {
  'use strict';
  let worker = null, timer = null, active = null;
  const status = document.getElementById('python-status');
  const stop = document.getElementById('stop-python');
  const progress = document.getElementById('python-progress');
  // Scope participates in the name so another lesson deployment keeps its own cache.
  const scope = new URL('../', document.currentScript.src).href;
  const cacheName = /^https?:/.test(scope) ? 'baigiang-pyodide-0.26.4:' + scope : null;
  const normalize = text => String(text).trim().split(/\s+/).filter(Boolean).join(' ');
  const testTimeout = 5000;
  function preview(text) {
    const value = normalize(text);
    if (!value) return '(chưa in gì)';
    const short = value.split(' ').slice(0, 4).join(' ').slice(0, 40);
    return short + (short.length < value.length ? '…' : '');
  }
  function pythonError(error) {
    const lines = [...String(error).matchAll(/File "<bai-lam>", line (\d+)/g)];
    const where = lines.length ? ' ở dòng ' + lines[lines.length - 1][1] : '';
    let reason = 'chưa chạy được', hint = 'Em kiểm tra lại code nhé.';
    if (/IndentationError|TabError/.test(error)) { reason = 'thụt lề chưa đúng'; hint = 'Kiểm tra dấu : và thụt lề.'; }
    else if (/SyntaxError/.test(error)) { reason = 'cú pháp chưa đúng'; hint = 'Kiểm tra dấu : và thụt lề.'; }
    else if (/IndexError/.test(error)) { reason = 'vị trí ngoài dãy'; hint = 'Em kiểm tra chỉ số nhé.'; }
    else if (/NameError/.test(error)) { reason = 'biến chưa được tạo'; hint = 'Em kiểm tra tên biến nhé.'; }
    else if (/ZeroDivisionError/.test(error)) { reason = 'chia cho 0'; hint = 'Em kiểm tra số chia nhé.'; }
    else if (/ValueError|TypeError/.test(error)) { reason = 'dữ liệu chưa phù hợp'; hint = 'Em kiểm tra cách đọc và phép tính nhé.'; }
    else if (/In quá nhiều/.test(error)) { reason = 'in quá nhiều'; hint = 'Em kiểm tra vòng lặp nhé.'; }
    return `Code bị lỗi${where}: ${reason}. ${hint}`;
  }
  function phase(message, completed, total, state = {}) {
    if (status) {
      status.textContent = message;
      for (const key of ['phase', 'index', 'total', 'cached', 'status']) delete status.dataset[key];
      for (const [key, value] of Object.entries(state)) status.dataset[key] = String(value);
    }
    if (!progress) return;
    progress.hidden = false;
    if (completed === undefined) progress.removeAttribute('value');
    else { progress.max = total; progress.value = completed; }
  }
  function controls(busy) {
    document.querySelectorAll('.python-action').forEach(button => { button.disabled = busy; });
    if (stop) stop.disabled = !busy;
    const select = document.getElementById('problem-select');
    if (select) select.disabled = busy;
  }
  function dispose() { clearTimeout(timer); if (worker) worker.terminate(); worker = null; }
  function finish(result) {
    const done = active?.resolve;
    dispose(); active = null; controls(false);
    if (status) {
      status.textContent = result.message;
      status.dataset.phase = 'finished'; status.dataset.status = result.status;
    }
    if (progress) {
      if (result.status === 'AC') progress.value = progress.max;
      progress.hidden = true;
    }
    if (done) done(result);
  }
  function next() {
    const test = active.tests[active.index];
    phase(`Đang chạy test ${active.index + 1}/${active.tests.length}…`, active.index, active.tests.length,
      {phase:'test', index:active.index + 1, total:active.tests.length});
    timer = setTimeout(() => finish({status:'TLE', message:'Code chạy quá lâu. Thử cách nhanh hơn?'}), testTimeout);
    worker.postMessage({type:'test', code:active.code, input:test.input});
  }
  window.PythonRunner = {
    get busy() { return Boolean(active); },
    run(code, tests, options = {}) {
      if (active) return Promise.resolve({status:'BUSY', message:'Python đang chạy lượt khác.'});
      // file:// has no reliable lesson-scoped persistent cache. Only this local
      // preview mode requires network; hosted cached lessons remain runnable offline.
      if (location.protocol === 'file:' && navigator.onLine === false) return Promise.resolve({status:'OFFLINE', message:'Bản mở trực tiếp cần mạng để chạy Python. Em vẫn đọc bài và dùng mô phỏng được.'});
      if (typeof code !== 'string' || !code.trim()) return Promise.resolve({status:'EMPTY', message:'Em hãy viết code trước khi chạy.'});
      if (!Array.isArray(tests) || !tests.length) return Promise.resolve({status:'ERROR', message:'Chưa có test để chạy.'});
      return new Promise(resolve => {
        active = {code, tests, hidden:Boolean(options.hidden),
          hiddenHint:typeof options.hiddenHint === 'string' && options.hiddenHint.trim() ? options.hiddenHint.trim() : 'Em thử lại với trường hợp nhỏ nhất.',
          index:0, outputs:[], resolve}; controls(true);
        phase('Đang chuẩn bị Python…', undefined, undefined, {phase:'prepare'});
        timer = setTimeout(() => finish({status:'ERROR', message:'Chuẩn bị Python quá lâu. Nếu chưa lưu đủ, em cần mạng rồi thử lại.'}), 90000);
        try {
          const url = URL.createObjectURL(new Blob(['(' + window.lessonPythonWorker.toString() + ')()'], {type:'text/javascript'}));
          try { worker = new Worker(url); } finally { URL.revokeObjectURL(url); }
          const current = worker;
          worker.onerror = event => {
            event.preventDefault();
            if (worker === current && active) finish({status:'ERROR', message:'Chưa mở được Python. Em kiểm tra mạng rồi thử lại nhé.', detail:event.message});
          };
          worker.onmessage = ({data}) => {
            if (!active || worker !== current) return;
            if (data.type === 'phase') {
              if (data.phase === 'download') phase('Đang chuẩn bị Python…', undefined, undefined,
                {phase:'download', index:data.index, total:data.total});
              else phase('Sắp sẵn sàng chạy Python…', undefined, undefined,
                {phase:'initialize', cached:data.cached, total:data.total});
              return;
            }
            clearTimeout(timer);
            if (data.type === 'ready') {
              document.dispatchEvent(new CustomEvent('pythoncachechange', {detail:{available:data.cacheAvailable, warning:data.cacheWarning}}));
              next(); return;
            }
            if (data.type === 'fatal') {
              finish({status:'ERROR', message:'Chưa chạy được Python. Nếu chưa lưu đủ, em cần mạng rồi thử lại.', detail:data.error}); return;
            }
            if (data.type !== 'result') return;
            if (data.error) { finish({status:'RE', message:pythonError(data.error), detail:data.error}); return; }
            const expected = active.tests[active.index].output;
            active.outputs.push(data.output);
            if (normalize(data.output) !== normalize(expected)) {
              finish(active.hidden
                ? {status:'WA', message:'Sai ở 1 test ẩn. ' + active.hiddenHint}
                : {status:'WA', message:`Sai ở test ${active.index + 1}. Em in ra ${preview(data.output)}, đáp án là ${preview(expected)}.`, output:data.output}); return;
            }
            active.index++;
            if (active.index === active.tests.length) finish({status:'AC', message:`Đúng hết ${active.tests.length}/${active.tests.length} test 🎉`, outputs:active.outputs});
            else next();
          };
          worker.postMessage({type:'load', cacheName});
        } catch (error) { finish({status:'ERROR', message:'Chưa mở được Python. Em thử tải lại trang nhé.', detail:error.message}); }
      });
    },
    stop() { if (active) finish({status:'STOPPED', message:'Đã dừng.'}); }
  };
  stop?.addEventListener('click', () => window.PythonRunner.stop());
  // Resolve the in-flight call too, so a page restored from BFCache is usable.
  window.addEventListener('pagehide', () => window.PythonRunner.stop());
})();
