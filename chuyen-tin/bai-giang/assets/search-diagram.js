(() => {
  'use strict';
  const esc = text => window.LessonApp.escape(text);
  function render(root, data, state, index, states) {
    if (data.id !== '1-5') return false;
    const n = state.values.length - 3, a = state.values.slice(0, n);
    const [lo, hi, mid] = state.values.slice(n), ended = index === states.length - 1;
    const x = Number(document.getElementById('sim-input').dataset.applied.trim().split(/\s+/)[1]);
    const remaining = hi - lo, history = states.slice(0, index + 1).map(s => s.values[n + 1] - s.values[n]);
    const linear = a.findIndex(value => value >= x), reads = linear < 0 ? n : linear + 1;
    const status = i => !ended && i === mid ? '◎ Đang xét' : i >= lo && i < hi ? 'Còn tìm' : i === hi && hi < n ? '◇ Mốc đủ lớn' : '× Đã loại';
    root.className = 'search-diagram';
    root.innerHTML = `<p class="search-count"><strong>Còn ${remaining} ô cần tìm</strong> · ${history.join(' → ')}</p>
      <p>Tìm ô đầu ≥ ${esc(x)}. Nền sáng là khoảng [lo, hi).</p>
      <div class="search-scroll" tabindex="0" aria-label="Dãy và mũi tên lo, mid, hi; cuộn ngang để xem đủ">
        <div class="search-track" style="--slots:${n + 1}">
          <div class="search-row">${a.map((value, i) => `<div class="search-cell ${i >= lo && i < hi ? 'search-active' : 'search-out'} ${!ended && i === mid ? 'search-current' : ''} ${i === hi ? 'search-bound' : ''}" tabindex="0" title="a[${i}]=${esc(value)}; ${status(i)}" aria-label="a[${i}]=${esc(value)}; ${status(i)}"><small>${i}</small><strong>${esc(value)}</strong><span class="search-symbol">${!ended && i === mid ? '◎' : i === hi ? '◇' : i >= lo && i < hi ? '·' : '×'}</span></div>`).join('')}<div class="search-cell search-sentinel"><small>${n}</small><span>Sau dãy</span></div></div>
          <div class="search-arrow-row">${[...new Set([lo, mid, hi])].map(pos => `<span class="search-arrow" style="grid-column:${pos + 1}">↑${[['lo', lo], ['mid', mid], ['hi', hi]].filter(([, value]) => value === pos).map(([label]) => `<span data-pointer="${label}" data-position="${pos}" class="${label === 'mid' && ended ? 'search-old-mid' : ''}" title="${label}=${pos}${label === 'mid' && ended ? '; giá trị cuối, không đọc nữa' : ''}">${label}</span>`).join('')}</span>`).join('')}</div>
        </div>
      </div>
      <div class="search-key"><span>◎ Đang xét</span><span>◇ Mốc đủ lớn</span><span>× Đã loại</span></div>
      <p>${ended ? (lo < n ? `Đáp án: chỉ số ${lo}, tức vị trí ${lo + 1}.` : 'Mốc sau dãy: không có ô đủ lớn.') : `Bước này chỉ đọc a[${mid}]=${a[mid]}.`}</p>
      <p>Chia đôi: ${Math.min(index + 1, states.length - 1)} lần đọc. Tìm tuần tự cùng dữ liệu: ${reads} lần đọc.</p>
      <p class="muted">Mốc hi có thể là đáp án, dù không còn nằm trong khoảng cần tìm.</p>`;
    document.getElementById('sim-legend').hidden = true;
    const scroll = root.querySelector('.search-scroll');
    const focus = root.querySelector(ended ? '[data-pointer="lo"]' : '[data-pointer="mid"]');
    const offset = focus.getBoundingClientRect().left - scroll.getBoundingClientRect().left;
    if (offset > scroll.clientWidth - 40) scroll.scrollLeft = offset - scroll.clientWidth / 2;
    return true;
  }
  window.SearchDiagram = {render};
})();
