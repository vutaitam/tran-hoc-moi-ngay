/* Geometry supplements the Python-backed snapshots; it never replaces their values. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const memory = new WeakMap();
  const names = {current:'◎ Đang xét',source:'↗ Lấy từ',done:'✓ Đã xét',excluded:'× Đã bỏ',pending:'… Chưa xét'};
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const text = (x,y,value,cls='',anchor='middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${escape(value)}</text>`;
  const line = (x1,y1,x2,y2,cls='p1-link') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  const tip = (label,body,attrs='') => `<g tabindex="0" role="group" aria-label="${escape(label)}" data-p1-tip="${escape(label)}" ${attrs}><title>${escape(label)}</title>${body}</g>`;
  function card(x,y,label,value,role='pending',status=names[role],width=58) {
    const description = `${label}: ${value}. ${status}`;
    return tip(description, `<rect class="p1-card p1-${role}" x="${x}" y="${y}" width="${width}" height="78" rx="5"/>${text(x+width/2,y+17,label,'p1-small')}${text(x+width/2,y+42,value,'p1-value')}${text(x+width/2,y+63,status,'p1-small')}`);
  }
  function svg(width,height,label,body,fit=false) {
    return `<div class="p1-scroll" tabindex="0" role="group" aria-label="${escape(label)} · cuộn ngang nếu cần"><svg xmlns="${NS}" class="p1-svg" viewBox="0 0 ${width} ${height}" style="width:${width}px;min-width:${fit?0:width}px;${fit?'max-width:100%;':''}" role="group" aria-label="${escape(label)}">${body}</svg></div>`;
  }
  const title = value => `<h4 class="p1-title">${escape(value)}</h4>`;
  const caption = value => `<p class="p1-caption">${escape(value)}</p>`;
  const legend = value => `<p class="p1-key">${escape(value)}</p>`;
  const summary = value => `<p class="p1-summary">${escape(value)}</p>`;
  const arrow = (x,y,label,target=y-27) => tip(label, `${line(x,y,x,target)}<path d="M ${x-5} ${target+8} L ${x} ${target} L ${x+5} ${target+8}" class="p1-arrow"/>${text(x,y+16,label,'p1-pointer')}`);
  const range = (left,right,y,label,width=Infinity) => {
    const half=String(label).length*3.9,x=Math.max(half+12,Math.min(width-half-12,(left+right)/2));
    return `${line(left,y,right,y,'p1-range')}${line(left,y-5,left,y+5,'p1-range')}${line(right,y-5,right,y+5,'p1-range')}${text(x,y+24,label,'p1-range-label')}`;
  };

  function work(state) {
    const {size,maxSize}=state.scene, unit=28, x=64, gridY=115;
    let body=text(16,24,'Một lượt qua dãy','p1-section','start');
    for(let i=0;i<size;i++) body+=tip(`Lượt ${i+1} trong ${size} lượt`, `<rect x="${x+i*unit}" y="36" width="24" height="24" rx="3" class="p1-unit ${i===size-1?'p1-current':''}"/>`);
    body+=text(x+size*unit+12,53,`${size} lượt`,'','start')+text(16,94,'Hai vòng lồng: mỗi hàng có size ô','p1-section','start');
    for(let row=0;row<size;row++)for(let col=0;col<size;col++)body+=tip(`Vòng ngoài ${row+1}, vòng trong ${col+1}`,`<rect x="${x+col*unit}" y="${gridY+row*unit}" width="24" height="24" rx="3" class="p1-unit ${row===size-1||col===size-1?'p1-current':''}"/>`);
    body+=range(x,x+size*unit-4,gridY+size*unit+12,`${size} × ${size} = ${state.values[2]} lượt`);
    return title('Một hàng so với một hình vuông')+summary(`size = ${size} · Một ô là một lượt xét.`)+svg(Math.max(390,x+maxSize*unit+90),gridY+maxSize*unit+60,'Số lượt theo kích thước',body)+legend('◎ Viền đậm: hàng hoặc cột mới khi size tăng.')+caption('Tăng size thêm 1: dãy thêm một ô; hình vuông thêm cả hàng và cột.');
  }

  function readRows(state) {
    const {rows,row}=state.scene, [,total,low,high,gap]=state.values;
    let body=text(15,23,'Mỗi dòng → cộng hai số → giữ hai đầu','p1-section','start');
    rows.forEach(([m,v],i)=>{
      const y=36+i*43,role=i===row?'current':i<row?'done':'pending';
      const label=i===row?'◎ Vừa đọc':i<row?'✓ Đã đọc':'… Chờ đọc';
      body+=tip(`Đội ${i+1}: ${m} + ${v}. ${label}`,`<rect x="12" y="${y}" width="396" height="36" rx="5" class="p1-card p1-${role}"/>${text(25,y+24,`Đội ${i+1}`,'','start')}${text(136,y+24,`${m} + ${v}`)}${text(209,y+24,'→')}${text(258,y+24,i<=row?m+v:'?')}${text(395,y+24,label,'p1-small','end')}`);
    });
    const y=rows.length*43+68,max=Math.max(1,...rows.map(([m,v])=>m+v)),pos=v=>45+v/max*330;
    body+=text(15,y,`Tổng vừa đọc: ${total}`,'p1-section','start')+line(45,y+58,375,y+58,'p1-axis');
    body+=text(45,y+79,0,'p1-small')+text(375,y+79,max,'p1-small');
    body+=tip(`Nhỏ nhất ${low}`,`<circle cx="${pos(low)}" cy="${y+58}" r="6" class="p1-dot"/>${text(pos(low),y+37,`min ${low}`)}`);
    body+=tip(`Lớn nhất ${high}`,`<rect x="${pos(high)-5}" y="${y+53}" width="10" height="10" class="p1-dot"/>${text(pos(high),y+106,`max ${high}`)}`);
    body+=range(pos(low),pos(high),y+127,`${high} − ${low} = ${gap}`,420);
    return title('Đọc đủ từng dòng, không lấy 0 làm nhỏ nhất')+svg(420,y+172,'Các đội và khoảng từ nhỏ nhất đến lớn nhất',body)+caption(`Đã đọc ${row+1}/${rows.length} đội. Chỉ hai đầu được dùng để tính hiệu.`);
  }

  function stress(state,index,states) {
    const [a,b,c,correct,wrong,mismatch]=state.values;
    let body=tip(`Cùng dữ liệu: ${a}, ${b}, ${c}`,`<rect x="15" y="10" width="260" height="58" rx="7" class="p1-card p1-done"/>${text(145,33,'Cùng một dãy thử')}${text(145,56,`${a}     ${b}     ${c}`,'p1-value')}`);
    body+=line(145,68,145,87)+line(73,87,217,87)+line(73,87,73,107)+line(217,87,217,107);
    body+=card(8,109,'Từ a[0]',correct,'source','↗ Bản đúng',130)+card(152,109,'Từ 0',wrong,'source','↗ Bản cần thử',130);
    body+=line(73,187,73,210)+line(217,187,217,210)+line(73,210,217,210)+line(145,210,145,231);
    body+=tip(mismatch?'Hai kết quả lệch: giữ test này để tìm lỗi':'Hai kết quả khớp trên test này',`<rect x="15" y="233" width="260" height="57" rx="7" class="p1-card ${mismatch?'p1-current':'p1-done'}"/>${text(145,258,`${correct} ${mismatch?'≠':'='} ${wrong}`,'p1-value')}${text(145,278,mismatch?'! Lệch · giữ phản ví dụ':'✓ Khớp lần này')}`);
    const seen=states.slice(0,index+1),first=seen.findIndex(s=>s.values[5]===1);
    const history=states.map((s,i)=>`<span class="p1-trial ${i===index?'p1-current':''}" title="${escape(i<=index?`Lượt ${i+1}: ${s.values.slice(0,3).join(', ')}; ${s.values[3]} / ${s.values[4]}`:`Lượt ${i+1}: chưa đối chiếu`)}">${i+1}: ${i>index?'…':s.values[5]?'≠':'='}</span>`).join('');
    return title('Một dữ liệu đi qua hai lời giải')+summary(`Lượt ${index+1} · Hạt giống ${state.scene.seed}`)+svg(290,307,'Hai nhánh chạy cùng một test rồi so kết quả',body)+`<div class="p1-history" aria-label="Lịch sử đối chiếu">${history}</div>`+caption(first>=0?`Phản ví dụ đầu tiên ở lượt ${first+1}: ${states[first].values.slice(0,3).join(', ')}.`:'Chưa thấy lệch. Khớp nhiều lần vẫn chưa chứng minh đúng.');
  }

  function frequency(state) {
    const {input,cursor,current}=state.scene,width=Math.max(292,24+input.length*66);
    const max=Math.max(1,...Array.from({length:6},(_,i)=>input.filter(x=>x===i).length)),baseline=170,height=138;
    let array='';
    input.forEach((value,i)=>array+=card(12+i*66,12,`a[${i}]`,value,i===cursor?'current':i<cursor?'done':'pending',i===cursor?'◎ Đọc':i<cursor?'✓ Đã đọc':'… Chờ'));
    let body=line(25,baseline,283,baseline,'p1-axis');
    for(let level=0;level<=max;level++)body+=text(14,baseline-level*height/max+5,level,'p1-small')+line(25,baseline-level*height/max,283,baseline-level*height/max,'p1-grid');
    state.values.forEach((count,i)=>{
      const x=29+i*42,h=count*height/max,active=i===current;
      let mark=`<rect x="${x}" y="20" width="36" height="200" class="p1-hit"/>`;
      if(count) mark+=`<path d="M ${x+6} ${baseline} V ${baseline-h+4} Q ${x+6} ${baseline-h} ${x+10} ${baseline-h} H ${x+26} Q ${x+30} ${baseline-h} ${x+30} ${baseline-h+4} V ${baseline} Z" class="p1-bar"/>`;
      if(active)mark+=`<rect x="${x+2}" y="${baseline-h-4}" width="32" height="${height/max+8}" rx="4" class="p1-increment"/>${text(x+18,baseline-h-14,'+1')}`;
      mark+=text(x+18,192,i)+text(x+18,215,count,'p1-value');
      body+=tip(`Giá trị ${i}: đã gặp ${count} lần${active?', vừa tăng 1':''}`,mark,`data-count="${count}" data-value="${i}"`);
    });
    body+=text(146,242,'Giá trị → số lần đã gặp','p1-small');
    return title('Gặp giá trị nào, thanh đếm ấy tăng')+svg(width,104,'Dãy đang đọc',array)+summary(current<0?'Chưa tăng bộ đếm nào':`a[${cursor}] = ${current} → count[${current}] tăng 1`)+svg(292,255,'Sáu thanh tần suất',body,true)+legend('◎ Viền đậm và +1: phần thanh vừa tăng.')+caption(`Đã đọc ${cursor+1}/${input.length} số. Chiều cao thanh dùng cùng một đơn vị trong mọi bước.`);
  }

  function greedy(state) {
    const {original,order,budget,cursor,chosen}=state.scene,n=original.length,sorted=state.values.slice(0,n),spent=state.values[n];
    const width=Math.max(440,24+n*66);let body=text(12,24,'Trước sắp xếp · số thẻ giữ nguyên','p1-section','start');
    original.forEach((price,i)=>body+=card(12+i*66,38,`#${i+1}`,price,'done','Giá gốc'));
    order.forEach((old,i)=>body+=line(41+old*66,116,41+i*66,172,i===cursor?'p1-link':'p1-grid'));
    sorted.forEach((price,i)=>{
      const status=i>cursor?'… Chờ':chosen.includes(i)?'✓ Mua':'× Bỏ';
      const role=i===cursor?'current':i>cursor?'pending':chosen.includes(i)?'done':'excluded';
      body+=card(12+i*66,177,`#${order[i]+1}`,price,role,status);
    });
    if(cursor>=0)body+=arrow(41+cursor*66,292,'Xét');
    body+=text(12,341,`Đã tiêu ${spent} / ${budget} · còn ${budget-spent}`,'p1-section','start');
    const meterWidth=width-32;
    body+=tip(`Đã tiêu ${spent} trên ${budget} đồng`, `<rect x="16" y="355" width="${meterWidth}" height="16" rx="4" class="p1-meter-track"/>${budget&&spent?`<rect x="16" y="355" width="${meterWidth*spent/budget}" height="16" rx="4" class="p1-bar"/>`:''}`);
    return title('Xếp thẻ rẻ trước, rồi chọn lần lượt')+svg(width,391,'Thẻ gốc nối với vị trí sau sắp xếp',body)+summary(`✓ Đã mua ${state.values[n+1]} món`)+caption('Số # nhận diện từng món, kể cả khi hai món có cùng giá.');
  }

  function windowDiagram(state,index,states) {
    const n=state.values.length-4,a=state.values.slice(0,n),[left,right,total,best]=state.values.slice(n),{limit}=state.scene;
    const stride=66,start=71,width=Math.max(440,start+(n+1)*stride),center=i=>start+i*stride+29;
    let body='';
    if(left<=right)body+=`<rect class="p1-window" data-window-left="${left}" data-window-right="${right}" x="${start+left*stride-5}" y="8" width="${(right-left+1)*stride+2}" height="91" rx="8"/>`;
    a.forEach((value,i)=>body+=card(start+i*stride,15,`a[${i}]`,value,state.roles[i],i<left?'× Bỏ':i===right?'◎ Thêm':i>right?'… Chờ':'✓ Giữ'));
    if(left===n)body+=card(start+n*stride,15,'Sau dãy','∅','excluded','Biên');
    if(right===-1)body+=text(center(-1),71,'∅','p1-value');
    body+=arrow(center(left)-(left===right?9:0),132,`left=${left}`,98)+arrow(center(right)+(left===right?9:0),182,`right=${right}`,98);
    if(left<=right)body+=range(start+left*stride,start+right*stride+58,218,`Cửa sổ [${left}, ${right}] · dài ${right-left+1}`,width);
    else body+=text(16,240,'Cửa sổ rỗng: left > right','p1-section','start');
    const previous=index>0?states[index-1].values.slice(n):[0,-1,0,0],removed=a.slice(previous[0],left);
    const equation=right<0?'Chưa thêm số nào.':`${previous[2]} + ${a[right]}${removed.map(v=>` − ${v}`).join('')} = ${total}`;
    return title('Thêm bên phải, bỏ bên trái khi quá tổng')+svg(width,266,'Một hàng với hai con trỏ và cửa sổ liên tiếp',body)+summary(`Tổng ${total} ≤ ${limit} · Dài nhất đã gặp: ${best}`)+caption(equation)+legend('✓ Giữ: còn trong cửa sổ · × Bỏ: đã rời cửa sổ.')+caption(index?`left: ${previous[0]} → ${left}; right: ${previous[1]} → ${right}. Hai đầu chỉ đi tới.`:'Ban đầu right=−1 đứng trước dãy. Chưa chọn số nào.');
  }

  function kadane(state) {
    const n=state.values.length-2,a=state.values.slice(0,n),[end,best]=state.values.slice(n),s=state.scene;
    const width=Math.max(440,24+n*66),x=i=>12+i*66;let body='';
    body+=`<rect class="p1-window" x="${x(s.start)-5}" y="7" width="${(s.cursor-s.start+1)*66+2}" height="91" rx="8"/>`;
    a.forEach((value,i)=>body+=card(x(i),14,`a[${i}]`,value,state.roles[i],i===s.cursor?'◎ Xét':i>s.cursor?'… Chờ':i>=s.start?'✓ Nối':'Đã xét'));
    for(let i=s.start;i<s.cursor;i++)body+=line(x(i)+58,56,x(i+1),56,'p1-range');
    body+=range(x(s.start),x(s.cursor)+58,118,`end = ${end} · [${s.start}, ${s.cursor}]`,width);
    body+=range(x(s.bestStart),x(s.bestEnd)+58,176,`best = ${best} · [${s.bestStart}, ${s.bestEnd}]`,width);
    const chooseNew=s.start===s.cursor,extended=s.oldEnd===null?null:s.oldEnd+a[s.cursor];
    const options=s.cursor?`<div class="p1-options"><div class="p1-choice ${chooseNew?'p1-current':'p1-excluded'}"><strong>${chooseNew?'✓':'×'} Bắt đầu mới</strong><span>a[${s.cursor}] = ${a[s.cursor]}</span></div><div class="p1-choice ${chooseNew?'p1-excluded':'p1-current'}"><strong>${chooseNew?'×':'✓'} Nối đoạn trước</strong><span>${s.oldEnd} + (${a[s.cursor]}) = ${extended}</span></div></div>`:caption('Ô đầu khởi tạo cả end và best. Không chọn đoạn rỗng.');
    const tie=s.cursor>0&&a[s.cursor]===extended;
    return title('Kadane: nối đoạn cũ hay bắt đầu mới?')+options+(tie?caption('Khi bằng nhau, cả hai đều được; hình chọn một cách.'):'')+svg(width,228,'Đoạn tốt nhất kết thúc ở đây và đoạn tốt nhất đã gặp',body)+legend('end: kết thúc ở ô đang xét · best: tốt nhất đã gặp.')+legend('✓ Chọn lần này · × Không chọn lần này, không có nghĩa là cách tính sai.');
  }

  function prefix(state,k) {
    const a=state.values.slice(0,-2),r=state.scene.cursor+1,p=[0];
    a.forEach(v=>p.push(p[p.length-1]+v));
    const width=Math.max(440,76+p.length*64),x=i=>46+i*64,visible=p.slice(0,r+1),min=Math.min(0,...p),max=Math.max(0,...p),span=Math.max(1,max-min),y=v=>200-(v-min)/span*110;
    const matches=visible.slice(0,-1).map((v,i)=>v===p[r]-k?i:-1).filter(i=>i>=0);
    let count=0;for(let end=1;end<=r;end++)for(let start=0;start<end;start++)if(p[end]-p[start]===k)count++;
    let body=line(30,y(0),width-20,y(0),'p1-axis')+text(18,y(0)+5,0,'p1-small');
    const path=visible.map((v,i)=>`${i?'L':'M'} ${x(i)} ${y(v)}`).join(' ');
    body+=`<path d="${path}" class="p1-prefix-line"/>`;
    matches.forEach((i,j)=>{
      const path=`M ${x(i)} ${y(p[i])} Q ${(x(i)+x(r))/2} ${38+j*9} ${x(r)} ${y(p[r])}`;
      body+=tip(`P[${r}] − P[${i}] = ${k}; đoạn a[${i}..${r-1}]`,`<path d="${path}" class="p1-match" data-prefix-start="${i}" data-prefix-end="${r}"/>`);
    });
    p.forEach((v,i)=>{
      const processed=i<=r,label=processed?`P[${i}]=${v}${i===r?'; vừa tính':matches.includes(i)?'; tiền tố cần tìm':''}`:`P[${i}]: chưa tính`;
      body+=tip(label,`<rect x="${x(i)-24}" y="72" width="48" height="169" class="p1-hit"/>${processed?`<circle cx="${x(i)}" cy="${y(v)}" r="${i===r?7:5}" class="p1-dot"/>`:text(x(i),147,'…')}${text(x(i),230,`P${i}`,'p1-small')}${i===r||matches.includes(i)?text(x(i),y(v)>180?y(v)-15:y(v)+26,v,'p1-value'):''}`,`data-prefix-index="${i}"`);
    });
    const rows=visible.map((v,i)=>`<tr><td>P[${i}]</td><td>${v}</td><td>${i===r?'◎ Vừa tính':matches.includes(i)?'↗ Ghép được':'✓ Đã lưu'}</td></tr>`).join('');
    const pairs=matches.length?matches.map(i=>caption(`P[${r}] − P[${i}] = ${p[r]} − (${p[i]}) = ${k}; đoạn a[${i}..${r-1}].`)).join(''):caption('Chưa có tiền tố cũ phù hợp với điểm cuối này.');
    const seen=new Map();visible.slice(0,-1).forEach(v=>seen.set(v,(seen.get(v)||0)+1));
    const counts=Array.from(seen,([value,count])=>`<tr><td>${value}</td><td>${count}</td><td>${value===p[r]-k?'↗ Cần tìm':'Đã lưu'}</td></tr>`).join('');
    return caption(`Tổng tiền tố P[${r}] = ${p[r]} · tìm ${p[r]-k}`)+svg(width,249,'Đường tiền tố và các cặp tạo đoạn tổng bằng k',body)+legend('Nét liền: tổng tiền tố · Nét đứt: ghép thành đoạn tổng k.')+summary(`Lượt này thêm ${matches.length} đoạn · Đã đếm ${count} đoạn`)+pairs+`<details class="secondary-details"><summary>Xem bảng tiền tố và số lần</summary><div class="table-scroll"><table><thead><tr><th>Tiền tố</th><th>Tổng</th><th>Trạng thái</th></tr></thead><tbody>${rows}</tbody></table></div>${caption(`Có ${matches.length} tiền tố cũ bằng ${p[r]-k}. Tra trước, lưu P[${r}] sau.`)}<div class="table-scroll"><table><caption>Số lần đã gặp, trước khi lưu tiền tố mới</caption><thead><tr><th>Tổng</th><th>Số lần</th><th>Tra cứu</th></tr></thead><tbody>${counts}</tbody></table></div></details>`;
  }

  const renderers={work, 'read-rows':readRows,stress,frequency,greedy,window:windowDiagram,kadane};
  function bindTooltips(root) {
    const output=root.querySelector('.p1-tooltip');
    function show(event) {
      const mark=event.target.closest('[data-p1-tip]');if(!mark||!root.contains(mark))return;
      output.textContent=mark.dataset.p1Tip;
      const chart=mark.closest('svg'),existing=chart.querySelector('.p1-crosshair');existing?.remove();
      if(mark.dataset.prefixIndex!==undefined) {
        const cross=document.createElementNS(NS,'line'),x=46+Number(mark.dataset.prefixIndex)*64;
        for(const [key,value] of Object.entries({x1:x,x2:x,y1:72,y2:214,class:'p1-crosshair'}))cross.setAttribute(key,value);
        chart.append(cross);
      }
    }
    root.onpointerover=show;
    const saved=memory.get(root);
    if(saved.focusHandler)root.removeEventListener('focusin',saved.focusHandler);
    root.addEventListener('focusin',show);saved.focusHandler=show;
    root.onpointerleave=()=>root.querySelectorAll('.p1-crosshair').forEach(node=>node.remove());
  }
  function scrollHints(root) {
    root.querySelectorAll('.p1-scroll').forEach(node=>{
      let hint=node.nextElementSibling;
      if(!hint?.classList.contains('p1-scroll-hint')) {
        hint=document.createElement('p');hint.className='p1-caption p1-scroll-hint';
        hint.textContent='↔ Vuốt ngang hình để xem phần còn lại.';node.after(hint);
      }
      hint.hidden=node.scrollWidth<=node.clientWidth+1;
    });
  }
  function render(root,data,state,index,states=[]) {
    const kind=state.scene?.kind,draw=renderers[kind];
    if(!['0-1','0-2','0-3','1-1','1-3','1-4','1-6'].includes(data.id)||!draw)return false;
    const old=memory.get(root)||{k:0},newInput=old.states!==states;
    const scroll=newInput?[]:Array.from(root.querySelectorAll('.p1-scroll'),node=>node.scrollLeft);
    old.states=states;
    const stepChanged=newInput||old.index!==index;old.index=index;
    memory.set(root,old);root.classList.add('p1-diagrams');root.dataset.diagram=kind;
    const genericLegend=root.parentElement?.querySelector('#sim-legend');if(genericLegend)genericLegend.hidden=true;
    root.innerHTML=draw(state,index,states);
    if(kind==='kadane') {
      const section=document.createElement('section');section.className='p1-prefix';
      section.innerHTML=title('Hình phụ: hai tiền tố tạo một đoạn')+caption('Cùng dãy đã đọc; hình này minh họa đếm đoạn, không phải biến của code Kadane.')+`<div class="p1-filter"><label>Tổng cần tìm k <input data-prefix-k type="number" min="-999" max="999" step="1" value="${old.k}"></label></div>`+caption('k=0: nối hai tiền tố bằng nhau. P[0]=0 nằm trước số đầu.')+'<div class="p1-prefix-output"></div>';
      root.append(section);
      const output=section.querySelector('.p1-prefix-output');output.innerHTML=prefix(state,old.k);
      section.querySelector('[data-prefix-k]').oninput=event=>{
        const value=event.target.valueAsNumber;
        if(!Number.isInteger(value)||Math.abs(value)>999){event.target.setCustomValidity('Nhập số nguyên từ −999 đến 999.');return;}
        event.target.setCustomValidity('');old.k=value;
        const left=output.querySelector('.p1-scroll')?.scrollLeft||0;
        output.innerHTML=prefix(state,value);output.querySelector('.p1-scroll').scrollLeft=left;scrollHints(output);
      };
    }
    const tooltip=document.createElement('p');tooltip.className='p1-tooltip';tooltip.textContent='Chạm hoặc đặt tiêu điểm lên hình để xem giá trị.';root.append(tooltip);
    root.querySelectorAll('.p1-scroll').forEach((node,i)=>{node.scrollLeft=scroll[i]||0;});
    if(stepChanged) {
      const scrollToMark=mark=>{
        if(!mark)return;
        const container=mark.closest('.p1-scroll'),box=mark.getBoundingClientRect(),frame=container.getBoundingClientRect();
        const left=container.scrollLeft+box.left-frame.left,right=left+box.width;
        if(left<container.scrollLeft+12)container.scrollLeft=Math.max(0,left-12);
        else if(right>container.scrollLeft+container.clientWidth-12)container.scrollLeft=right-container.clientWidth+12;
      };
      if(['frequency','greedy','window','kadane'].includes(kind))scrollToMark(root.querySelector('svg .p1-card.p1-current'));
      if(kind==='window'&&!root.querySelector('svg .p1-card.p1-current'))scrollToMark(root.querySelectorAll('svg .p1-card')[Math.max(0,state.values.at(-3))]);
      if(kind==='kadane')scrollToMark(root.querySelector(`[data-prefix-index="${state.scene.cursor+1}"]`));
    }
    scrollHints(root);
    if(!old.resize&&window.ResizeObserver) {
      old.resize=new ResizeObserver(()=>scrollHints(root));old.resize.observe(root);
    }
    bindTooltips(root);return true;
  }
  window.P1Diagrams={render};
})();
