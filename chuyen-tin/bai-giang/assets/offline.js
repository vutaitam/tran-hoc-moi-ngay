/* Optional #offline-status is a role=status text node. No public API required.
   Register only under this script's ../ scope; do not prefetch any Python CDN URL. */
(() => {
  'use strict';
  const scope = new URL('../', document.currentScript.src);
  const status = document.getElementById('offline-status');
  let registration = null, shellReady = false, pythonReady = false, cacheWarning = false, runtimeWarning = false;
  function text(message) {
    if (!status) return;
    status.textContent = message;
    status.dataset.shellReady = String(Boolean(shellReady));
    status.dataset.pythonReady = String(Boolean(pythonReady));
    status.dataset.cacheWarning = String(Boolean(cacheWarning));
  }
  function render() {
    const network = navigator.onLine === false ? 'Mất mạng · ' : '';
    text(network + (shellReady ? 'Bài học đã lưu đủ để mở lại khi mất mạng. ' : 'Bài học chưa lưu đủ để mở lại khi mất mạng. ') +
      (pythonReady ? 'Python đã lưu đủ; có thể chạy khi mất mạng. ' : 'Python chưa lưu đủ; em cần mạng khi bấm Chạy. ') +
      (cacheWarning ? 'Chưa lưu được đầy đủ; em thử lại khi có mạng.' : 'Bản lưu có thể bị xóa khi máy thiếu chỗ.'));
  }
  function request(type) {
    return new Promise((resolve, reject) => {
      const worker = registration?.active;
      if (!worker) { reject(Error('Chưa có Service Worker đang hoạt động.')); return; }
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(Error('Hết thời gian lưu bài.')); }, 20000);
      channel.port1.onmessage = ({data}) => { clearTimeout(timer); channel.port1.close(); resolve(data); };
      worker.postMessage({type}, [channel.port2]);
    });
  }
  async function refresh(type = 'CACHE_STATUS') {
    try {
      const data = await request(type);
      shellReady = data.shellReady; pythonReady = data.pythonReady;
      cacheWarning = !shellReady || (runtimeWarning && !pythonReady);
    } catch { shellReady = false; pythonReady = false; cacheWarning = true; }
    render();
  }
  if (!/^https?:$/.test(location.protocol)) {
    text('Bản mở trực tiếp vẫn đọc bài và dùng mô phỏng được. Cần mạng để chạy Python. Muốn lưu để học khi mất mạng, em mở bài từ trang web.');
    return;
  }
  if (!window.isSecureContext || !('serviceWorker' in navigator)) {
    text('Chưa lưu được bài để mở lại khi mất mạng. Em vẫn đọc bài và dùng mô phỏng đã mở.');
    return;
  }
  async function start() {
    text('Đang lưu bài học… Python chỉ tải khi em bấm Chạy.');
    try {
      registration = await navigator.serviceWorker.register(new URL('sw.js', scope), {scope:scope.href, updateViaCache:'none'});
      // Wait for our registration, not navigator.serviceWorker.ready, which might
      // belong to the root app while the new scoped worker is still installing.
      if (!registration.active) await new Promise((resolve, reject) => {
        const worker = registration.installing || registration.waiting;
        if (!worker) { reject(Error('Không cài được Service Worker.')); return; }
        const timer = setTimeout(() => reject(Error('Cài Service Worker quá lâu.')), 20000);
        const check = () => {
          if (worker.state === 'activated') { clearTimeout(timer); resolve(); }
          else if (worker.state === 'redundant') { clearTimeout(timer); reject(Error('Service Worker không hoạt động.')); }
        };
        worker.addEventListener('statechange', check); check();
      });
      await refresh('CACHE_SHELL');
    } catch {
      shellReady = false; pythonReady = false; cacheWarning = true;
      text('Chưa lưu được bài để mở lại khi mất mạng. Em vẫn đọc bài và dùng mô phỏng đã mở. Hãy thử tải lại khi có mạng.');
    }
  }
  window.addEventListener('online', () => { if (registration) refresh('CACHE_SHELL'); });
  window.addEventListener('offline', () => { if (registration) refresh(); });
  document.addEventListener('pythoncachechange', event => {
    runtimeWarning = event.detail?.warning || !event.detail?.available;
    if (registration) refresh();
  });
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, {once:true});
})();
