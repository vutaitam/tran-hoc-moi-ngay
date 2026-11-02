/* This worker's registration scope is this lesson directory, never the host app.
   Bump shell version when the shell contract changes. Never delete other caches. */
'use strict';
const scope = self.registration.scope;
const shellName = 'baigiang-shell-v5:' + scope;
const runtimeName = 'baigiang-pyodide-0.26.4:' + scope;
const runtimeBase = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const runtimeFiles = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
const shellFiles = ['index.html', '1-2-tong-tien-to.html', 'lessons/prefix-data.js',
  'assets/lesson.css', 'assets/visual.css', 'assets/common.js', 'assets/lesson-ux.js', 'assets/home.js', 'assets/prefix.js', 'assets/visual.js', 'assets/prefix-visuals.js',
  'assets/python-worker.js', 'assets/python-runner.js', 'assets/mobile.css', 'assets/mobile.js', 'assets/offline.js',
  '0-1-doc-de.html', '0-2-vao-ra.html', '0-3-doi-chieu.html',
  '1-1-tan-suat.html', '1-3-sap-xep-tham-lam.html', '1-4-hai-con-tro.html', '1-5-tim-kiem-nhi-phan.html', '1-6-doan-con.html',
  'lessons/p1-0-1.js', 'lessons/p1-0-2.js', 'lessons/p1-0-3.js', 'lessons/p1-1-1.js',
  'lessons/p1-1-3.js', 'lessons/p1-1-4.js', 'lessons/p1-1-5.js', 'lessons/p1-1-6.js',
  'assets/lesson-page.js', 'assets/lesson-interactions.js', 'assets/lesson-page.css', 'assets/lesson-catalog.js',
  'assets/search-diagram.js', 'assets/search-diagram.css', 'assets/p1-diagrams.js', 'assets/p1-diagrams.css',
  '2-1-uoc-boi.html', '2-2-ucln-bcnn.html', '2-3-so-nguyen-to.html', '2-4-mod-luy-thua.html', '2-5-chu-so-khoi.html',
  '3-1-quy-luat.html', '3-2-gop-buoc.html', '3-3-tham-lam.html',
  'lessons/p2-2-1.js', 'lessons/p2-2-2.js', 'lessons/p2-2-3.js', 'lessons/p2-2-4.js', 'lessons/p2-2-5.js',
  'lessons/p2-3-1.js', 'lessons/p2-3-2.js', 'lessons/p2-3-3.js',
  'assets/p2-arithmetic.js', 'assets/p2-arithmetic.css', 'assets/p2-counting.js', 'assets/p2-counting.css',
  'assets/p2-greedy.js', 'assets/p2-greedy.css'];
const shellURLs = shellFiles.map(file => new URL(file, scope).href);
const runtimeURLs = runtimeFiles.map(file => runtimeBase + file);
self.addEventListener('install', event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
async function match(name, key) {
  try { return await (await caches.open(name)).match(key); }
  catch { return undefined; }
}
async function put(name, key, response) {
  try { await (await caches.open(name)).put(key, response); return true; }
  catch { return false; } // Quota/private mode must not turn a good network response into an error.
}
async function cacheShell() {
  return Promise.all(shellURLs.map(async url => {
    try {
      const response = await fetch(url, {cache:'reload'});
      return response.ok && await put(shellName, url, response);
    } catch { return Boolean(await match(shellName, url)); }
  }));
}
async function cacheStatus() {
  const [shell, runtime] = await Promise.all([
    Promise.all(shellURLs.map(url => match(shellName, url))),
    Promise.all(runtimeURLs.map(url => match(runtimeName, url)))
  ]);
  return {shellReady:shell.every(response => response?.ok), pythonReady:runtime.every(response => response?.ok)};
}
self.addEventListener('message', event => {
  if (!['CACHE_SHELL', 'CACHE_STATUS'].includes(event.data?.type)) return;
  event.waitUntil((async () => {
    try {
      if (event.data.type === 'CACHE_SHELL') await cacheShell();
      event.ports[0]?.postMessage(await cacheStatus());
    } catch { event.ports[0]?.postMessage({shellReady:false, pythonReady:false}); }
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url), root = new URL(scope);
  const runtime = runtimeURLs.includes(url.href);
  const relative = url.href.startsWith(scope) ? url.pathname.slice(root.pathname.length) : '';
  const local = url.origin === root.origin && url.pathname.startsWith(root.pathname) &&
    (/^(?:[^/]+\.html)?$/.test(relative) || /^(?:assets\/[^/]+\.(?:css|js)|lessons\/[^/]+\.js)$/.test(relative));
  if (!runtime && !local) return; // No root-app, exam, PDF, tools, or unrelated CDN interception.
  const name = runtime ? runtimeName : shellName;
  const key = runtime ? url.href : new URL(relative || 'index.html', scope).href;
  event.respondWith((async () => {
    if (runtime) {
      const cached = await match(name, key);
      if (cached) return cached;
    }
    try {
      // Revalidate the HTTP cache too: a new lesson release must not be hidden
      // behind a still-fresh browser response. Offline still falls back below.
      const response = await fetch(request, runtime ? {} : {cache:'no-cache'});
      if (response.ok) event.waitUntil(put(name, key, response.clone()));
      return response;
    } catch (error) {
      const cached = await match(name, key);
      if (cached) return cached;
      throw error;
    }
  })());
});
