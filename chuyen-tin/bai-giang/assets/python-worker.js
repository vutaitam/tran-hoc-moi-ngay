/* Classic script -> Blob Worker also works from file://. Core downloads stay lazy.
   Blob-worker importScripts is not reliably controlled by a Service Worker: fetch
   the pinned core explicitly, then import local Blobs and supply cached responses. */
window.lessonPythonWorker = function () {
  'use strict';
  const base = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  const files = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
  let python;
  const harness = `
import io as _io, sys as _sys, json as _json, traceback as _traceback

def _lesson_run(code, text):
    class LimitedOutput(_io.StringIO):
        def write(self, value):
            if self.tell() + len(value) > 200000:
                raise RuntimeError('In quá nhiều; em kiểm tra vòng lặp và lệnh in nhé.')
            return super().write(value)
    old_in, old_out, old_err = _sys.stdin, _sys.stdout, _sys.stderr
    output, errors = LimitedOutput(), LimitedOutput()
    result = {'output': '', 'error': ''}
    try:
        _sys.stdin = _io.TextIOWrapper(_io.BytesIO(text.encode('utf-8')), encoding='utf-8')
        _sys.stdout, _sys.stderr = output, errors
        namespace = {'__name__': '__main__'}
        exec(compile(code, '<bai-lam>', 'exec'), namespace)
    except SystemExit as exc:
        if exc.code not in (None, 0):
            result['error'] = 'SystemExit: ' + str(exc.code)
    except BaseException:
        result['error'] = _traceback.format_exc(limit=6)
    finally:
        _sys.stdin, _sys.stdout, _sys.stderr = old_in, old_out, old_err
    result['output'] = output.getvalue()
    result['stderr'] = errors.getvalue()
    return _json.dumps(result)
`;
  async function initialize(cacheName) {
    let cache = null, cached = 0, cacheWarning = false;
    try { if (cacheName && self.caches) cache = await caches.open(cacheName); }
    catch { cacheWarning = true; }
    const responses = new Map();
    for (let index = 0; index < files.length; index++) {
      const file = files[index], url = base + file;
      self.postMessage({type:'phase', phase:'download', file, index:index + 1, total:files.length});
      let response;
      try { response = await cache?.match(url); }
      catch { cacheWarning = true; }
      if (response?.ok) cached++;
      else {
        response = await fetch(url, {mode:'cors', credentials:'omit'});
        if (!response.ok) throw Error('Không tải được ' + file + ' (HTTP ' + response.status + ').');
        // Read the body before moving on: a response header is not a finished download.
        response = new Response(await response.arrayBuffer(), {status:response.status, headers:response.headers});
        if (cache) {
          try { await cache.put(url, response.clone()); }
          catch { cacheWarning = true; }
        }
      }
      responses.set(url, response);
    }
    self.postMessage({type:'phase', phase:'initialize', cached, total:files.length});
    const originalFetch = self.fetch;
    self.fetch = (input, options) => {
      const url = typeof input === 'string' ? input : input.url || String(input);
      const response = responses.get(url);
      return response ? Promise.resolve(response.clone()) : originalFetch.call(self, input, options);
    };
    try {
      for (const file of ['pyodide.asm.js', 'pyodide.js']) {
        const source = await responses.get(base + file).text();
        const url = URL.createObjectURL(new Blob([source], {type:'text/javascript'}));
        try { importScripts(url); } finally { URL.revokeObjectURL(url); }
        responses.delete(base + file);
      }
      python = await loadPyodide({indexURL:base});
      python.runPython(harness);
    } finally {
      self.fetch = originalFetch;
      responses.clear();
    }
    self.postMessage({type:'ready', cached, cacheWarning, cacheAvailable:Boolean(cache)});
  }
  self.onmessage = async ({data}) => {
    try {
      if (data.type === 'load') await initialize(data.cacheName);
      else if (data.type === 'test') {
        python.globals.set('_lesson_code', data.code);
        python.globals.set('_lesson_input', data.input);
        const result = JSON.parse(python.runPython('_lesson_run(_lesson_code, _lesson_input)'));
        self.postMessage({type:'result', ...result});
      }
    } catch (error) { self.postMessage({type:'fatal', error:String(error.message || error)}); }
  };
};
