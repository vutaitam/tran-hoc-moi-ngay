(() => {
  'use strict';
  const d = window.LESSON_DATA, app = window.LessonApp, ux = window.LessonUX, visual = window.LessonVisual;
  const $ = id => document.getElementById(id), esc = app.escape;
  const normalize = text => String(text).trim().replace(/\s+/g, ' ');
  const feedback = (id, text, good = false) => { $(id).textContent = text; $(id).dataset.state = good ? 'ok' : 'error'; };
  const answers = {'story-answer':d.story, output:d.activities.output};
  d.warmup.forEach((q,i)=>{answers['warm-'+i]=q;});
  d.idea.examples.forEach((q,i)=>{answers['example-'+i]=q;});
  document.querySelectorAll('[data-answer]').forEach(button => {button.onclick = () => {
    const id = button.dataset.answer, q = answers[id];
    const good = normalize($(id).value).toLocaleLowerCase('vi') === normalize(q.answer).toLocaleLowerCase('vi');
    feedback(id+'-result', good ? '✓ '+q.explanation : 'Chưa đúng. '+(q.hint || 'Em thử tính từng bước nhé.'), good);
    if (good) app.mark('activities', id);
  };});
  document.querySelectorAll('pre code').forEach(node => {node.innerHTML=app.highlight(node.textContent);});
  visual.comparison($('cost-comparison'), n => {
    const cost = d.brute.count(n), number = value => value.toLocaleString('vi-VN');
    $('cost-n-value').value=number(n);
    for (const type of ['slow','fast']) { $('cost-'+type).textContent=number(cost[type]); $('cost-'+type+'-label').textContent=cost[type+'Label']; }
  });
  visual.legend($('sim-legend'));
  let states = d.simulation.build(d.simulation.input), activeState, stateIndex;
  $('sim-input').dataset.applied = d.simulation.input;
  const roleNames = {current:'◎ Đang xét',source:'↗ Lấy từ',done:'✓ Đã xong',excluded:'× Không lấy',pending:'… Chưa tính'};
  visual.code($('sim-code-lines'),d.simulation.code,d.simulation.code.trimEnd().split('\n').map((_,i)=>i+1));
  function codeLines(root, source, interactive) {
    root.innerHTML = source.trimEnd().split('\n').map((line,i)=>interactive
      ? `<button class="code-line" data-model-line="${i+1}" type="button"><span class="line-num">${i+1}</span>${app.highlight(line)}</button>`
      : `<div class="code-line"><span class="line-num">${i+1}</span>${app.highlight(line)}</div>`).join('');
  }
  codeLines($('model-code-lines'),d.model.code,true); codeLines($('bug-code-lines'),d.activities.bug.code,false);
  const sim = visual.stepper($('simulation'), {build:()=>states, render(state,index) {
    activeState=state; stateIndex=index;
    if (!window.SearchDiagram?.render($('sim-cells'),d,state,index,states) && !window.P1Diagrams?.render($('sim-cells'),d,state,index,states) && !d.simulation.render?.($('sim-cells'),state,index,states)) {
      visual.cells($('sim-cells'),state.values.map((value,i)=>({label:state.labels[i],value,role:state.roles[i]})));
    }
    $('sim-note').textContent=state.note;
    $('sim-table').innerHTML=state.values.map((value,i)=>`<tr><td>${esc(state.labels[i])}</td><td>${esc(value)}</td><td>${esc(state.roleLabels?.[i] || roleNames[state.roles[i]])}</td></tr>`).join('');
    visual.highlight($('sim-code-lines'),state.line);
    document.querySelectorAll('[data-model-line]').forEach(button=> {
      const line = Number(button.dataset.modelLine), mapped = d.model.mapping ? d.model.mapping[line] : line;
      const exists = states.some(s=>s.line===mapped);
      button.disabled=!exists; button.classList.toggle('active',exists && mapped===state.line);
    });
    $('predict').value=''; $('predict-result').textContent='';
    const last=index===states.length-1;
    $('predict').disabled=$('predict-check').disabled=last;
    $('predict-label').textContent=last ? 'Đã đến cuối. Em đổi dữ liệu hoặc bấm Lùi nhé.' : (state.question || 'Bước sau cho kết quả nào?');
  }});
  window.LessonSimulation = {get states(){return states;},get index(){return stateIndex;},go:sim.go};
  $('sim-apply').onclick=()=> {
    try {const next=d.simulation.build($('sim-input').value);if(!next.length)throw Error('Em nhập thêm dữ liệu nhé.');states=next;$('sim-input').dataset.applied=$('sim-input').value;sim.rebuild();$('sim-error').textContent='';}
    catch(error){feedback('sim-error',error.message);}
  };
  $('predict-check').onclick=()=> {
    const good=normalize($('predict').value)===normalize(activeState.predict);
    feedback('predict-result',good?'✓ Đúng. Bấm Tiếp để kiểm tra.':'Chưa đúng. Em nhìn ô đang xét và tính bước tiếp theo nhé.',good);
    if(good)app.mark('activities','predict');
  };
  document.querySelectorAll('[data-model-line]').forEach(button=>{button.onclick=()=> {
    const line=Number(button.dataset.modelLine), mapped=d.model.mapping ? d.model.mapping[line] : line;
    const index=states.findIndex(s=>s.line===mapped);if(index>=0){sim.pause();sim.go(index);$('simulation').scrollIntoView({block:'start'});}
  };});
  let revealTarget='';
  const dialog=$('model-dialog');
  const ask=id=>{sim.pause();revealTarget=id;dialog.showModal();};
  document.querySelectorAll('[data-reveal]').forEach(button=>{button.onclick=()=>ask(button.dataset.reveal);});
  document.querySelectorAll('[data-hide]').forEach(button=>{button.onclick=()=>{$(button.dataset.hide).hidden=true;};});
  $('model-cancel').onclick=()=>dialog.close();
  $('model-confirm').onclick=()=>{dialog.close();$(revealTarget).hidden=false;};
  let order=d.activities.parsons.lines.map((_,i)=>i).reverse();
  function renderParsons(focus) {
    $('parsons-list').innerHTML=order.map((id,i)=>`<li draggable="true" data-parsons="${i}"><code>${esc(d.activities.parsons.lines[id])}</code><button data-move="-1" ${i===0?'disabled':''} aria-label="Dòng ${i+1} lên">↑</button><button data-move="1" ${i===order.length-1?'disabled':''} aria-label="Dòng ${i+1} xuống">↓</button></li>`).join('');
    if(focus!==undefined)$('parsons-list').children[focus].querySelector('button:not(:disabled)')?.focus();
  }
  function move(from,to) {if(to<0||to>=order.length)return;const [id]=order.splice(from,1);order.splice(to,0,id);renderParsons(to);$('parsons-result').textContent='';}
  $('parsons-list').onclick=event=>{const button=event.target.closest('[data-move]');if(button)move(Number(button.closest('li').dataset.parsons),Number(button.closest('li').dataset.parsons)+Number(button.dataset.move));};
  let dragged;
  $('parsons-list').ondragstart=event=>{dragged=Number(event.target.closest('li').dataset.parsons);event.dataTransfer.setData('text/plain',String(dragged));};
  $('parsons-list').ondragover=event=>event.preventDefault();
  $('parsons-list').ondrop=event=>{event.preventDefault();const li=event.target.closest('li');if(li&&Number.isInteger(dragged))move(dragged,Number(li.dataset.parsons));dragged=undefined;};
  $('parsons-check').onclick=()=>{const good=d.activities.parsons.validOrders.some(valid=>valid.join(',')===order.join(','));feedback('parsons-result',good?'✓ Thứ tự đúng.':'Chưa đúng. Em kiểm tra biến được tạo trước khi dùng nhé.',good);if(good)app.mark('activities','parsons');};
  renderParsons();
  let current=d.problems[0], hints=0;
  ux.bindDraft($('code-editor'),()=>d.id+'/'+current.id);
  function practice() {
    $('problem-title').textContent=current.title;
    $('practice-statement').innerHTML=window.LessonPage.paragraphs(current.statement);
    $('practice-constraints').textContent=current.constraints;
    $('practice-sample').innerHTML=window.LessonPage.io(current.sample)+window.LessonPage.paragraphs(current.sample.explanation);
    $('code-editor').value=ux.drafts.get(d.id+'/'+current.id) ?? current.starter;
    $('practice-model-code').innerHTML=app.highlight(current.solution);
    $('practice-model').hidden=true;$('practice-hints').textContent='';hints=0;
    $('next-hint').textContent='Gợi ý 1';$('next-hint').disabled=false;
    $('practice-result').textContent='';delete $('practice-result').dataset.status;progress();
  }
  $('problem-select').onchange=()=>{ux.drafts.set(d.id+'/'+current.id,$('code-editor').value);current=d.problems.find(p=>p.id===$('problem-select').value);practice();};
  $('reset-code').onclick=()=>{if(confirm('Xóa bản nháp bài này để viết lại?')){$('code-editor').value=current.starter;ux.drafts.set(d.id+'/'+current.id,current.starter);}};
  $('next-hint').onclick=()=>{const node=document.createElement('div');node.className='hint';node.innerHTML=window.LessonPage.paragraphs(current.hints[hints++]);$('practice-hints').append(node);$('next-hint').disabled=hints===3;$('next-hint').textContent=hints===3?'Đã mở đủ gợi ý':'Gợi ý '+(hints+1);};
  $('practice-model-open').onclick=()=>ask('practice-model');
  const controls=['run-example','submit-code','blank-check','bug-check','stress-run','reset-code','practice-model-open'];
  let running=false;
  async function run(code,tests,target,options={}) {
    if(running)return;
    running=true;controls.forEach(id=>{if($(id))$(id).disabled=true;});$('problem-select').disabled=true;
    $(target).textContent='Đang chuẩn bị Python…';delete $(target).dataset.status;
    try {const result=await window.PythonRunner.run(code,tests,options);ux.showResult($(target),result);return result;}
    finally{running=false;controls.forEach(id=>{if($(id))$(id).disabled=false;});$('problem-select').disabled=false;}
  }
  $('run-example').onclick=()=>run($('code-editor').value,[current.sample],'practice-result');
  $('submit-code').onclick=async()=>{const id=current.id;const result=await run($('code-editor').value,current.tests,'practice-result',{hidden:true,hiddenHint:current.hiddenHint});if(result?.status==='AC')app.mark('ac',id);};
  $('blank-check').onclick=async()=>{const value=$('blank-input').value;if(!value.trim()){feedback('blank-result','Em điền biểu thức trước nhé.');return;}const result=await run(d.activities.blank.template.replace('___',()=>value),d.activities.blank.tests,'blank-result');if(result?.status==='AC')app.mark('activities','blank');};
  $('bug-check').onclick=async()=>{const lines=d.activities.bug.code.split('\n'),line=Number($('bug-line').value);if(!Number.isInteger(line)||line<1||line>lines.length){feedback('bug-result','Em chọn số dòng trong code nhé.');return;}lines[line-1]=$('bug-fix').value;const result=await run(lines.join('\n'),d.activities.bug.tests,'bug-result');if(result?.status==='AC')app.mark('activities','bug');};
  if(d.stress)$('stress-run').onclick=async()=> {
    const code=`import io, sys, contextlib\n\ndef solve(source, text):\n    sys.stdin = io.StringIO(text)\n    output = io.StringIO()\n    with contextlib.redirect_stdout(output):\n        exec(compile(source, '<so-sanh>', 'exec'), {})\n    return output.getvalue().strip()\n\nfor text in ${JSON.stringify(states.map(s=>s.testInput))}:\n    first = solve(${JSON.stringify(d.stress.candidate)}, text)\n    second = solve(${JSON.stringify(d.stress.reference)}, text)\n    if first.split() != second.split():\n        print('Dữ liệu vào:', text, 'Cách đang thử:', first, 'Cách trực tiếp:', second, sep='\\n')\n        break\nelse:\n    print('Khớp')`;
    const result=await run(code,[{input:'',output:'Khớp'}],'stress-result');
    if(result?.status==='WA'){feedback('stress-result','Đã tìm thấy dữ liệu làm hai cách khác nhau:\n'+result.output,true);app.mark('activities','stress');}
    else if(result?.status==='AC')feedback('stress-result',`Hai cách khớp trên ${states.length} dãy đã thử. Em đổi hạt giống để thử tiếp; chưa thể kết luận luôn đúng.`,true);
    if(result?.status==='AC' || result?.status==='WA')$('python-status').textContent='Đã đối chiếu hai cách. Xem kết quả ở phần E.';
  };
  function progress() {
    const p=app.progress;
    $('lesson-progress').textContent=`${p.learned?'✓ Đã học':'Chưa đánh dấu đã học'} · ${Object.values(p.ac).filter(Boolean).length}/${d.problems.length} bài luyện đã làm đúng`;
    $('learned').checked=p.learned;$('problem-ac').textContent=p.ac[current.id]?'✓ Đã làm đúng':'Chưa làm đúng';
    document.querySelectorAll('[data-exam]').forEach(box=>{box.checked=Boolean(p.exams[box.dataset.exam]);});
  }
  $('learned').onchange=()=>app.mark('learned','', $('learned').checked);
  document.querySelectorAll('[data-exam]').forEach(box=>{box.onchange=()=>app.mark('exams',box.dataset.exam,box.checked);});
  document.addEventListener('progresschange',progress);practice();
})();
