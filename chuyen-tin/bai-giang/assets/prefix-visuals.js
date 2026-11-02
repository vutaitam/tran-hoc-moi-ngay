(() => {
  'use strict';
  const viz = window.LessonVisual, app = window.LessonApp, data = window.PREFIX_DATA;
  const $ = id => document.getElementById(id);
  document.querySelectorAll('[data-legend]').forEach(viz.legend);
  viz.experiment($('opening-experiment'), {render: removed => {
    viz.cells($('opening-cells'), [3, -1, 4, 2, 5].map((value, i) => ({label: `a[${i + 1}]`, value, role: i === 4 || (removed && i === 0) ? 'excluded' : 'source'})));
    $('opening-result').textContent = removed ? '8 − 3 = 5: bỏ vị trí 1, còn −1 + 4 + 2.' : 'Muốn lấy tổng từ vị trí 2 đến 4, ta bỏ phần nào khỏi 8?';
    $('opening-experiment').querySelector('button').textContent = removed ? 'Khôi phục để thử lại' : 'Bỏ vị trí 1';
  }});
  const format = n => n.toLocaleString('vi-VN');
  const time = n => `${(n / 1000000).toLocaleString('vi-VN', {maximumFractionDigits: 6})} giây (giả định)`;
  viz.comparison($('cost-comparison'), n => {
    $('cost-n-value').value = format(n);
    $('cost-naive').textContent = format(n * n) + ' phép cộng';
    $('cost-prefix').textContent = format(2 * n) + ' phép cộng/trừ';
    $('time-naive').textContent = time(n * n); $('time-prefix').textContent = time(2 * n);
    $('cost-result').textContent = n === 1 ? 'Một câu hỏi ngắn chưa cần chuẩn bị bảng tổng.' : 'Càng nhiều câu hỏi dài, bảng tổng càng tiết kiệm phép tính.';
  });
  viz.code($('prefix-trace-code'), data.snippets.modelRange, [7, 8, 9]);
  function band(start, end, label, type) {
    return `<span class="prefix-band prefix-${type}" style="grid-column:${start} / ${end}">${app.escape(label)}</span>`;
  }
  const queryModes = viz.modes($('query-modes'), mode => {
    const {a, pre, l, r} = window.PrefixVisualState.current;
    viz.cells($('query-array'), a.map((value, i) => ({label: `a[${i + 1}]`, value, role: mode === 'naive' && i + 1 >= l && i + 1 <= r ? 'source' : 'excluded'})));
    viz.cells($('query-prefix'), pre.map((value, i) => ({label: `pre[${i}]`, value, role: mode === 'prefix' && (i === r || i === l - 1) ? 'source' : 'excluded'})));
    $('query-strips').style.setProperty('--prefix-slots', a.length + 1);
    $('query-bands').innerHTML = (l > 1 ? band(2,l+1,mode === 'prefix' ? '− Bỏ' : 'Ngoài đoạn','removed') : '') + band(l+1,r+2,'Giữ','kept');
    [...$('query-array').children].forEach((cell,i) => {
      cell.classList.toggle('prefix-kept',i+1>=l && i+1<=r);
      cell.classList.toggle('prefix-removed',i+1<l);
      if (mode === 'prefix') {
        const label = i+1<l ? '− Bỏ' : i+1<=r ? 'Giữ' : 'Ngoài đoạn';
        cell.lastElementChild.textContent = label;
        cell.title = `a[${i+1}]: ${a[i]}; ${label}; không đọc lại ô này`;
        cell.setAttribute('aria-label',cell.title);
      }
    });
    $('query-explanation').textContent = mode === 'naive'
      ? `Đoạn [${l}, ${r}]: cộng ${r - l + 1} số, được ${pre[r] - pre[l - 1]}. Câu hỏi sau phải cộng lại.`
      : `pre[${r}] − pre[${l - 1}] = ${pre[r]} − (${pre[l - 1]}) = ${pre[r] - pre[l - 1]}. Khi bảng đã có, chỉ cần một phép trừ.`;
  });
  function syncPrefix() {
    const {a, pre, step} = window.PrefixVisualState.current;
    viz.highlight($('prefix-trace-code'), step ? 9 : 7);
    viz.cells($('prefix-sources'), step ? [
      {label: `pre[${step - 1}]`, value: pre[step - 1], role: 'source'},
      {label: `a[${step}]`, value: a[step - 1], role: 'source'},
      {label: `pre[${step}]`, value: pre[step], role: 'current'}
    ] : [{label: 'pre[0]', value: 0, role: 'done'}]);
    queryModes.refresh();
  }
  document.addEventListener('prefixvisualchange', syncPrefix); syncPrefix();

  viz.code($('diff-trace-code'), data.snippets.difference, [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const questions = [
    'Em đoán dấu +3 cần đặt ở ô nào để bắt đầu tại vị trí 2?',
    'Muốn tác động kết thúc sau vị trí 4, dấu −3 phải nằm ở ô nào?',
    'Tổng đang giữ bằng 0. Ô đầu sẽ bằng bao nhiêu?',
    'Ở ô 2 gặp +3, tổng đang giữ thay đổi thế nào?',
    'd[3]=0 thì a[3] bằng 0 hay vẫn bằng 3?',
    'Từ ô 3 sang ô 4 không có dấu mốc mới. Giá trị còn là 3 không?',
    'Đến ô 5 gặp −3. Vì sao đây là lúc tác động kết thúc?',
    'Em giải thích lại: +3 bắt đầu, −3 kết thúc; cộng dồn giữ tác động giữa hai mốc.'
  ];
  let update = {n: 5, l: 2, r: 4, x: 3};
  function buildDifference() {
    const {n, l, r, x} = update;
    const diff = Array(n + 2).fill(0), answer = [], states = [];
    let current = 0;
    const snap = (line, index, message) => states.push({diff: diff.slice(), answer: answer.slice(), current, line, index, message});
    const marks = () => `[${diff.slice(1).join(', ')}]`;
    snap(6, 0, `Khởi tạo: d[1..${n + 1}] = ${marks()}`);
    diff[l] += x; snap(9, l, `Mốc bắt đầu: d[${l}] += (${x}).`);
    diff[r + 1] -= x; snap(10, r + 1, `Mốc dừng: d[${r + 1}] -= (${x}). current là tổng đang giữ, bắt đầu bằng 0.`);
    for (let i = 1; i <= n; i++) {
      const old = current; current += diff[i]; answer.push(current);
      snap(14, i, `a[${i}] = ${old} + (${diff[i]}) = ${current}.${diff[i] === 0 ? ' Gặp 0 thì giữ nguyên tổng đang có.' : ''}${i === n ? ' Đã khôi phục đủ dãy.' : ''}`);
    }
    return states;
  }
  const difference = viz.stepper($('diff-simulation'), {
    build: buildDifference,
    render: (state, step) => {
      const {n, l, r, x} = update;
      viz.cells($('diff-cells'), state.diff.slice(1).map((value, i) => ({label: `d[${i + 1}]`, value, role: i + 1 === state.index ? (step < 3 ? 'current' : 'source') : i === n ? 'excluded' : 'done'})));
      viz.cells($('diff-output'), Array.from({length: n}, (_, i) => ({label: `a[${i + 1}]`, value: state.answer[i] ?? '?', role: i < state.answer.length ? (i === state.answer.length - 1 ? 'current' : 'done') : 'pending'})));
      $('diff-task').textContent = `Thử: cộng ${x} vào đoạn [${l},${r}]. Đoán xem dãy a cuối cùng là gì?`;
      $('diff-strips').style.setProperty('--prefix-slots',n+1);
      $('diff-bands').innerHTML = band(l,r+1,'Tác động','kept') + band(l,l+1,`↓ +(${x})`,'mark') + band(r+1,r+2,`↓ −(${x})`,'mark');
      [...$('diff-output').children].forEach((cell,i)=>cell.classList.toggle('prefix-kept',i+1>=l && i+1<=r));
      $('diff-state').textContent = state.message;
      $('diff-question').textContent = n === 5 && l === 2 && r === 4 && x === 3 ? questions[step]
        : step === 0 ? `Muốn bắt đầu cộng ${x} ở vị trí ${l}, em đặt dấu mốc ở đâu?`
        : step === 1 ? `Muốn dừng sau ${r}, em cần thay đổi ô nào và với dấu gì?`
        : step < n + 2 ? `Tổng đang giữ là ${state.current}. Ô tiếp theo có d bằng ${state.diff[state.answer.length + 1]}; em đoán giá trị mới?`
        : 'Em giải thích lại hai dấu mốc; thử r=n và x âm để kiểm tra ô phụ.';
      viz.highlight($('diff-trace-code'), state.line);
      if (step === n + 2) app.mark('activities', 'difference');
    }
  });
  $('diff-apply').onclick = () => {
    const texts = ['n', 'l', 'r', 'x'].map(key => $('diff-' + key).value.trim());
    const [n, l, r, x] = texts.map(Number);
    if (texts.some(text => !/^-?\d+$/.test(text)) || n < 1 || n > 8 || l < 1 || l > r || r > n || Math.abs(x) > 99) {
      $('diff-error').textContent = 'Nhập số nguyên: n từ 1 đến 8; x từ −99 đến 99. Hai đầu đoạn cần thỏa 1 ≤ l ≤ r ≤ n.'; return;
    }
    update = {n, l, r, x}; $('diff-error').textContent = ''; difference.rebuild();
  };
})();
