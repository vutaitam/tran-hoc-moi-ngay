/* HTML contract: textarea#code-editor (or textarea[data-code-editor]);
   .code-shortcuts[data-editor="textarea-id"] buttons with data-code-key:
   tab, :, (), [], =, +=. All buttons must have type="button" and readable labels.
   Tab indents; Shift+Tab or Escape then Tab leaves the editor (no keyboard trap). */
(() => {
  'use strict';
  const editors = document.querySelectorAll('textarea#code-editor, textarea[data-code-editor]');
  const states = new WeakMap();
  function changed(editor, inputType = 'insertText') {
    editor.dispatchEvent(new InputEvent('input', {bubbles:true, inputType}));
  }
  function replace(editor, text, start = editor.selectionStart, end = editor.selectionEnd, selectionStart, selectionEnd) {
    const top = editor.scrollTop, left = editor.scrollLeft, direction = editor.selectionDirection;
    editor.setRangeText(text, start, end, 'end');
    if (selectionStart !== undefined) editor.setSelectionRange(selectionStart, selectionEnd ?? selectionStart, direction);
    editor.focus({preventScroll:true});
    editor.scrollTop = top; editor.scrollLeft = left;
    changed(editor);
  }
  function indent(editor) {
    const {value, selectionStart:start, selectionEnd:end} = editor;
    if (start === end) { replace(editor, '    '); return; }
    const first = value.slice(0, start).lastIndexOf('\n') + 1;
    const block = value.slice(first, end), trailingNewline = block.endsWith('\n');
    const lines = block.split('\n');
    const count = lines.length - (trailingNewline ? 1 : 0);
    for (let i = 0; i < count; i++) lines[i] = '    ' + lines[i];
    replace(editor, lines.join('\n'), first, end, start + 4, end + count * 4);
  }
  function newline(editor) {
    const start = editor.selectionStart;
    const before = editor.value.slice(0, start);
    const line = before.slice(before.lastIndexOf('\n') + 1);
    const leading = line.match(/^[\t ]*/)[0];
    const extra = /:\s*(?:#[^\n]*)?$/.test(line) ? '    ' : '';
    replace(editor, '\n' + leading + extra);
  }
  for (const editor of editors) {
    const state = {leaveWithTab:false, pending:null}; states.set(editor, state);
    editor.addEventListener('keydown', event => {
      if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === 'Escape') { state.leaveWithTab = true; return; }
      if (event.key === 'Tab') {
        if (event.shiftKey || state.leaveWithTab) { state.leaveWithTab = false; return; }
        event.preventDefault(); indent(editor);
      } else {
        state.leaveWithTab = false;
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); newline(editor); }
      }
    });
    editor.addEventListener('blur', () => { state.leaveWithTab = false; });
    editor.addEventListener('beforeinput', event => {
      if (event.isComposing || !['insertLineBreak', 'insertParagraph'].includes(event.inputType)) return;
      if (event.cancelable) { event.preventDefault(); newline(editor); }
      else state.pending = {value:editor.value, start:editor.selectionStart, end:editor.selectionEnd};
    });
    // Some virtual keyboards issue non-cancelable beforeinput: repair just that
    // newline from its saved selection, without rewriting normal/composition input.
    editor.addEventListener('input', () => {
      const previous = state.pending; state.pending = null;
      if (!previous) return;
      editor.value = previous.value; editor.setSelectionRange(previous.start, previous.end);
      newline(editor);
    });
  }
  document.querySelectorAll('.code-shortcuts[data-editor]').forEach(toolbar => {
    const editor = document.getElementById(toolbar.dataset.editor);
    if (!states.has(editor)) return;
    toolbar.addEventListener('pointerdown', event => {
      if (event.target.closest('button[data-code-key]')) event.preventDefault(); // Keep keyboard + textarea selection on touch.
    });
    toolbar.addEventListener('click', event => {
      const button = event.target.closest('button[data-code-key]');
      if (!button || button.disabled || editor.disabled || editor.readOnly) return;
      const key = button.dataset.codeKey;
      if (key === 'tab') { indent(editor); return; }
      if (key === '()' || key === '[]') {
        const start = editor.selectionStart, selected = editor.value.slice(start, editor.selectionEnd);
        replace(editor, key[0] + selected + key[1], start, editor.selectionEnd, start + 1, start + 1 + selected.length);
      } else if ([':', '=', '+='].includes(key)) replace(editor, key);
    });
  });
})();
