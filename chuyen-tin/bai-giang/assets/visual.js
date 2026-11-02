(() => {
  'use strict';
  const app = window.LessonApp;
  const roles = {
    current: ['◎', 'Đang xét'], source: ['↗', 'Lấy từ'],
    done: ['✓', 'Đã xong'], excluded: ['×', 'Không lấy'], pending: ['…', 'Chưa tính']
  };
  function legend(root) {
    root.innerHTML = Object.entries(roles).map(([role, [icon, label]]) => `<span class="viz-role viz-${role}">${icon} ${label}</span>`).join('');
  }
  function cells(root, items) {
    root.innerHTML = items.map(item => {
      const role = roles[item.role] ? item.role : 'done';
      const detail = `${item.label}: ${item.value}; ${roles[role][1]}`;
      return `<span tabindex="0" class="viz-cell viz-${role}" aria-label="${app.escape(detail)}" title="${app.escape(detail)}"><small>${app.escape(item.label)}</small><strong>${app.escape(item.value)}</strong><small>${roles[role].join(' ')}</small></span>`;
    }).join('');
  }
  function code(root, source, lines) {
    const all = source.trimEnd().split('\n');
    root.innerHTML = lines.map(n => `<div class="viz-code-line" data-line="${n}"><span class="line-num">${n}</span>${app.highlight(all[n - 1].replace(/\s+#.*$/, ''))}</div>`).join('');
  }
  function highlight(root, line) {
    root.querySelectorAll('[data-line]').forEach(el => {
      const active = Number(el.dataset.line) === line;
      el.classList.toggle('active', active);
      if (active) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
  }
  function stepper(root, cfg) {
    const button = name => root.querySelector(`[data-step="${name}"]`);
    const counter = root.querySelector('[data-step-count]');
    const speed = root.querySelector('[data-step-speed]');
    let states = [], index = 0, timer = null;
    function pause() { clearInterval(timer); timer = null; button('play').textContent = 'Chạy'; button('play').setAttribute('aria-pressed', 'false'); }
    function show() {
      cfg.render(states[index], index);
      counter.textContent = `Bước ${index + 1} / ${states.length}`;
      for (const name of ['first', 'back']) button(name).disabled = index === 0;
      for (const name of ['next', 'last']) button(name).disabled = index === states.length - 1;
      button('play').disabled = states.length < 2;
    }
    function go(value) { index = Math.max(0, Math.min(states.length - 1, value)); if (index === states.length - 1) pause(); show(); }
    function play() {
      if (timer) { pause(); return; }
      if (index === states.length - 1) go(0);
      button('play').textContent = 'Tạm dừng'; button('play').setAttribute('aria-pressed', 'true');
      timer = setInterval(() => go(index + 1), Number(speed.value));
    }
    for (const [name, value] of Object.entries({first: () => 0, back: () => index - 1, next: () => index + 1, last: () => states.length - 1, reset: () => 0})) {
      button(name).onclick = () => { pause(); go(value()); };
    }
    button('play').onclick = play;
    speed.onchange = () => { if (timer) { pause(); play(); } };
    root.addEventListener('keydown', event => {
      if (event.target.closest('input,textarea,select,[contenteditable=true]') || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); pause(); go(index + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    const details = root.closest('details');
    details?.addEventListener('toggle', () => { if (!details.open) pause(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('pagehide', pause);
    document.addEventListener('pausevisuals', pause);
    function rebuild() { pause(); states = cfg.build(); if (!states.length) throw Error('Mô phỏng cần ít nhất một trạng thái'); index = 0; show(); }
    rebuild();
    return {pause, go, rebuild, render: show, get index() {return index;}};
  }
  function experiment(root, cfg) {
    let state = false;
    root.querySelector('[data-experiment-next]').onclick = () => {state = !state; cfg.render(state);};
    cfg.render(state);
  }
  function modes(root, render) {
    const buttons = [...root.querySelectorAll('[data-mode]')];
    let selected = buttons[0].dataset.mode;
    function select(mode) {
      selected = mode;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
      render(mode);
    }
    buttons.forEach(button => {button.onclick = () => select(button.dataset.mode);});
    select(selected);
    return {refresh: () => render(selected)};
  }
  function comparison(root, calculate) {
    const input = root.querySelector('input[type=range]');
    function update() { calculate(Number(input.value)); }
    input.oninput = update;
    root.querySelectorAll('[data-n]').forEach(button => {button.onclick = () => {input.value = button.dataset.n; update();};});
    update();
  }
  window.LessonVisual = {legend, cells, code, highlight, stepper, experiment, modes, comparison};
})();
