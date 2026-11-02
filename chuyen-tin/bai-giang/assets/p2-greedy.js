(() => {
  'use strict';
  const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const text=(x,y,value,cls='')=>`<text x="${x}" y="${y}" class="${cls}">${esc(value)}</text>`;
  function mark(x,y,w,h,title,inside){return `<g class="p2g-tipmark" tabindex="0" role="img" aria-label="${esc(title)}" data-p2g-tip="${esc(title)}"><title>${esc(title)}</title>${inside}<rect class="p2g-hit" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/></g>`;}
  function card(x,y,w,h,value,label,role='pending'){return mark(x,y,w,h,`${label}: ${value}`,`<rect class="p2g-card p2g-${role}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>${text(x+10,y+21,label,'p2g-small')}${text(x+10,y+45,value,'p2g-value')}`);}
  function table(headers,rows){return `<details class="secondary-details"><summary>Xem bảng tương đương</summary><div class="p2g-tablewrap"><table class="p2g-table"><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;}
  function pattern(state,compact){
    const {cursor,n}=state.scene,groups=Math.ceil((n+1)/3),width=compact?286:640,height=70+groups*88;let svg=text(compact?8:24,25,'Mỗi hàng là một nhóm ba số','p2g-label');const rows=[];
    for(let g=0;g<groups;g++){
      const y=50+g*88;if(!compact)svg+=text(18,y+33,`Nhóm ${g}`,'p2g-small');
      for(let r=0;r<3;r++){
        const i=3*g+r;if(i>n)continue;const x=compact?8+r*91:112+r*163,known=i<=cursor,role=i===cursor?'current':i===cursor-1||i===cursor-2?'source':known?'done':'pending',value=known?(state.values[i]?'1 thắng':'0 thua'):'?';
        if(compact)svg+=mark(x,y,82,62,`${i} viên, dư ${r}: ${known?value:'chưa xét'}`,`<rect class="p2g-card p2g-${role}" x="${x}" y="${y}" width="82" height="62" rx="4"/>${text(x+8,y+22,`n = ${i}`,'p2g-small')}${text(x+8,y+46,value)}`);
        else svg+=card(x,y,145,62,value,`${i} viên · dư ${r}`,role);
        rows.push([i,r,known?(state.values[i]?'1 · thắng':'0 · thua'):'Chưa xét']);
      }
      if(!compact&&g<groups-1)svg+=`<path class="p2g-future" d="M 615 ${y+35} v 62 l -5 -7 m 5 7 l 5 -7"/>`;
    }
    return {title:'Nhóm ba số: thua → thắng → thắng',width,height,svg,caption:'Cùng cột nghĩa là cùng số dư. Dấu hỏi chưa phải kết luận.',summary:'0 thua; từ 3k+1 hoặc 3k+2, lấy phần dư để trả đối thủ về 3k.',key:'◎ Đang xét · ↗ Hai trạng thái có thể đi tới · ? Chưa xét',table:table(['Số viên','Dư khi chia 3','Trạng thái'],rows)};
  }
  function batch(state,compact){
    const {n,d,steps,slow,fast,jump}=state.scene,width=compact?Math.max(286,fast*54+48):Math.max(680,(fast+1)*62+140),height=318,pad=compact?24:64,x=v=>pad+(n===0?0:(n-v)/n)*(width-2*pad);let svg=text(compact?8:24,25,compact?'Cùng điểm đầu và điểm dừng':'Cùng xuất phát, cùng điểm dừng','p2g-label');const rows=[];
    svg+=text(compact?8:24,57,'A · Trừ từng bình','p2g-label')+text(compact?8:24,193,`B · Gộp ${fast} lần trừ`,'p2g-label');
    svg+=`<line class="p2g-axis" x1="${pad}" y1="100" x2="${width-pad}" y2="100"/><line class="p2g-axis" x1="${pad}" y1="230" x2="${width-pad}" y2="230"/>`;
    for(let k=0;k<=fast;k++){
      const value=n-k*d,cx=x(value),done=k<=steps,title=`A, sau ${k} bình: còn ${value} lít`;
      if(k>0){const px=x(value+d);svg+=`<path class="${done?'p2g-link':'p2g-future'}" d="M ${px} 100 Q ${(px+cx)/2} 66 ${cx} 100"/>`;svg+=text((px+cx)/2-10,72,`−${d}`,'p2g-small');}
      svg+=mark(cx-21,82,42,56,title,`<circle class="${k===steps?'p2g-current':done?'p2g-dot':'p2g-pending'}" cx="${cx}" cy="100" r="8"/>${text(cx-10,131,value)}`);rows.push(['A · từng bước',k,value,done?'Đã tới':'Chưa tới']);
    }
    const start=x(n),end=x(jump);svg+=`<path class="p2g-link" d="M ${start} 230 Q ${(start+end)/2} 170 ${end} 230"/>`;
    svg+=mark(start-22,211,44,56,`B bắt đầu: ${n} lít`,`<circle class="p2g-dot" cx="${start}" cy="230" r="8"/>${text(start-10,261,n)}`);
    if(start!==end)svg+=mark(end-22,211,44,56,`B nhảy ${fast} lần, còn ${jump} lít`,`<circle class="p2g-dot" cx="${end}" cy="230" r="8"/>${text(end-10,261,jump)}`);
    svg+=text(Math.max(100,(start+end)/2-30),290,`−${fast} × ${d}`,'p2g-small');
    rows.push(['B · nhảy gộp',fast,jump,'Đã tới']);
    return {title:'Từng bước và nhảy gộp',width,height,svg,currentX:x(slow),caption:'Vị trí ngang biểu diễn lượng đã rót; đường cong nối các trạng thái.',summary:`A đang còn ${slow}; B còn ${jump}. ${steps===fast?'✓ Hai điểm dừng trùng nhau.':'Bấm Tiếp để A đến cùng điểm dừng.'}`,key:'A · nhiều cung ngắn: từng bình. B · một cung dài: nhảy gộp.',table:table(['Đường','Số bình','Nước còn','Tiến độ'],rows)};
  }
  function greedy(state,compact){
    const {a,limit,left,right,pairs,wrong}=state.scene,n=a.length,width=compact?Math.max(286,n*64+16):Math.max(690,n*70+80),height=compact?412:452,x=i=>compact?8+i*64:55+i*70;let svg=text(compact?8:24,26,compact?`Tối đa 2 người · tải ≤ ${limit}`:`Mỗi thuyền tối đa hai người · tải ≤ ${limit}`,'p2g-label');const rows=[];
    svg+=text(compact?8:24,58,compact?`A · Nhẹ trước: ${wrong.length} thuyền`:`A · Hai người nhẹ nhất trước: ${wrong.length} thuyền`,'p2g-label');
    svg+=text(compact?8:24,230,compact?`B · Hai đầu: ${pairs.length} thuyền`:`B · Nhẹ nhất với nặng nhất: ${pairs.length} thuyền đã chọn`,'p2g-label');
    for(let i=0;i<n;i++)svg+=card(x(i),75,54,62,a[i],`#${i+1}`,'done');
    wrong.forEach((p,k)=>{
      const start=x(p[0])+27,end=x(p.at(-1))+27,y=151;
      svg+=`<path class="p2g-link" d="M ${start} 139 v 12 H ${end} v -12"/>`;
      const label=p.map(i=>a[i]).join('+');svg+=text((start+end)/2-14,y+22,label,'p2g-small');rows.push(['A · nhẹ trước',k+1,label,p.reduce((s,i)=>s+a[i],0)]);
    });
    for(let i=0;i<n;i++)svg+=card(x(i),247,54,62,a[i],`#${i+1}`,i<left||i>right?'done':i===left||i===right?'current':'pending');
    pairs.forEach((p,k)=>{
      const start=x(p[0])+27,end=x(p.at(-1))+27,y=326+(pairs.length-1-k)*18;
      svg+=`<path class="p2g-link" d="M ${start} 313 V ${y} H ${end} V 313"/>`;
      rows.push(['B · hai đầu',k+1,p.map(i=>a[i]).join('+'),p.reduce((s,i)=>s+a[i],0)]);
    });
    if(left<=right){const start=x(left)+27,end=x(right)+27;svg+=text(start-15,241,'L ↓','p2g-small');if(left!==right)svg+=text(end-15,241,'H ↓','p2g-small');}
    return {title:'So hai quy tắc ghép thuyền',width,height:Math.max(height,350+pairs.length*18),svg,currentX:x(Math.max(0,right))+27,caption:'Mỗi đường nối là một thuyền; đường một đầu nghĩa là đi riêng.',summary:`${left>right?(wrong.length>pairs.length?'✕ Phản ví dụ: A tốn nhiều thuyền hơn B.':'Hai cách bằng nhau ở dữ liệu này; điều đó chưa chứng minh A đúng.'):'Xét L với H; các thuyền đã chốt không cần đổi lại.'}`,key:'A · nhẹ trước: quy tắc cần bác bỏ. B · hai đầu: quy tắc có chứng minh.',table:table(['Quy tắc','Thuyền','Cân nặng','Tổng tải'],rows)};
  }
  function render(root,state,index,states){
    const draw={'pattern':pattern,'batch':batch,'greedy-proof':greedy}[state.scene?.kind];if(!draw)return false;
    const compact=root.clientWidth<650,result=draw(state,compact);root.classList.add('p2-greedy');
    const sharedLegend=document.getElementById('sim-legend');if(sharedLegend)sharedLegend.hidden=true;
    root.innerHTML=`<h4 class="p2g-title">${esc(result.title)}</h4><div class="p2g-scroll" tabindex="0" aria-label="Hình thuật toán; cuộn ngang để xem đầy đủ"><svg xmlns="http://www.w3.org/2000/svg" class="p2g-svg" viewBox="0 0 ${result.width} ${result.height}" style="min-width:${result.width}px" role="group" aria-label="${esc(result.title)}"><title>${esc(result.title)}</title>${result.svg}</svg></div><p class="p2g-key">${esc(result.key)}</p><p class="p2g-caption">Vuốt ngang hình để xem đầy đủ.</p><p class="p2g-caption">${esc(result.caption)}</p><p class="p2g-summary">${esc(result.summary)}</p><p class="p2g-tooltip" aria-live="polite">Chạm hoặc đặt tiêu điểm vào một hình để xem giá trị.</p>${result.table}`;
    const scroll=root.querySelector('.p2g-scroll'),hasOverflow=scroll.scrollWidth>scroll.clientWidth+2;
    root.querySelector('.p2g-key + .p2g-caption').hidden=!hasOverflow;
    if(hasOverflow&&Number.isFinite(result.currentX))scroll.scrollLeft=Math.max(0,result.currentX-scroll.clientWidth/2);
    const tip=root.querySelector('.p2g-tooltip');
    root.querySelectorAll('[data-p2g-tip]').forEach(mark=>{const show=()=>{tip.textContent=mark.dataset.p2gTip;};mark.addEventListener('pointerenter',show);mark.addEventListener('focus',show);mark.addEventListener('click',show);});
    return true;
  }
  window.P2Greedy={render};
})();
