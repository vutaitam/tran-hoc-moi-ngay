(() => {
  'use strict';
  const escape=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const text=(x,y,value,cls='',anchor='middle')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${escape(value)}</text>`;
  const tip=(label,body)=>`<g tabindex="0" role="group" aria-label="${escape(label)}" data-counting-tip="${escape(label)}"><title>${escape(label)}</title>${body}</g>`;
  const svg=(width,height,label,body)=>`<div class="p2-counting-scroll" tabindex="0" role="group" aria-label="${escape(label)}"><svg xmlns="http://www.w3.org/2000/svg" class="p2-counting-svg" viewBox="0 0 ${width} ${height}" style="width:${width}px;min-width:${width}px" role="group" aria-label="${escape(label)}">${body}</svg></div>`;
  const p=(value,cls='p2-counting-caption')=>`<p class="${cls}">${escape(value)}</p>`;
  const title=value=>`<h4>${escape(value)}</h4>`;
  function table(headers,rows,caption){return `<details class="secondary-details"><summary>${escape(caption)}</summary><div class="table-scroll"><table><thead><tr>${headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>'<tr>'+row.map(value=>`<td>${escape(value)}</td>`).join('')+'</tr>').join('')}</tbody></table></div></details>`;}
  function residue(state,index,states){
    const s=state.scene,{a,b,m,k,r,residues,start,period,target}=s;
    const center={x:145,y:140},radius=99;
    const pos=value=>{const angle=-Math.PI/2+2*Math.PI*value/m;return {x:center.x+radius*Math.cos(angle),y:center.y+radius*Math.sin(angle)};};
    let body='<defs><marker id="p2-counting-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" class="p2-counting-arrowhead"/></marker></defs>';
    body+=`<circle cx="145" cy="140" r="99" class="p2-counting-guide"/>`;
    const edges=residues.map((from,i)=>({from,to:i+1<residues.length?residues[i+1]:from*a%m}));
    edges.forEach(({from,to},i)=>{
      const p1=pos(from),p2=pos(to),active=s.stage==='walk'&&i===edges.length-1;
      let path;
      if(from===to){
        const ux=(p1.x-center.x)/radius,uy=(p1.y-center.y)/radius,px=-uy,py=ux;
        path=`M ${p1.x-16*px-17*ux} ${p1.y-16*py-17*uy} C ${p1.x-52*px-69*ux} ${p1.y-52*py-69*uy}, ${p1.x+52*px-69*ux} ${p1.y+52*py-69*uy}, ${p1.x+16*px-17*ux} ${p1.y+16*py-17*uy}`;
      }
      else{
        const control=center,d1=Math.hypot(control.x-p1.x,control.y-p1.y),d2=Math.hypot(control.x-p2.x,control.y-p2.y);
        const x1=p1.x+(control.x-p1.x)*25/d1,y1=p1.y+(control.y-p1.y)*25/d1,x2=p2.x+(control.x-p2.x)*25/d2,y2=p2.y+(control.y-p2.y)*25/d2;
        path=`M ${x1} ${y1} Q ${control.x} ${control.y} ${x2} ${y2}`;
      }
      body+=tip(`Bước ${i+1}: ${from} × ${a} chia ${m} dư ${to}`,`<path d="${path}" class="p2-counting-hit"/><path d="${path}" class="p2-counting-edge ${active?'p2-counting-edge-current':''}" marker-end="url(#p2-counting-arrow)"/>`);
    });
    for(let value=0;value<m;value++){
      const q=pos(value),role=value===r?'current':residues.includes(value)?'done':'pending',symbol=role==='current'?'◎':role==='done'?'✓':'…';
      const labelX=q.x+(q.x-center.x)*31/radius,labelY=q.y+(q.y-center.y)*31/radius;
      body+=tip(`Số dư ${value}. ${role==='current'?'Đang giữ':role==='done'?'Đã gặp':'Chưa gặp'}`,`<circle cx="${q.x}" cy="${q.y}" r="21" class="p2-counting-node p2-counting-${role}"/>${text(q.x,q.y+6,value,'p2-counting-value')}${text(labelX,labelY+4,symbol,'p2-counting-small')}`);
    }
    body+=text(145,305,`Mỗi bước: × ${a}, rồi % ${m}`,'p2-counting-heading');
    const seq=[...residues];
    if(s.stage==='walk')seq.push(r);
    else if(residues.length)seq.push(residues[residues.length-1]*a%m);
    else seq.push(r);
    const width=Math.max(290,seq.length*64+30),timeline=[];
    seq.forEach((value,i)=>{
      const x=15+i*64,chosen=period>0&&i===target,current=s.stage==='walk'?i===seq.length-1:chosen||(!period&&i===seq.length-1);
      const role=current?'current':start>=0&&i>=start?'source':'done';
      timeline.push(tip(`Mũ ${i}: số dư ${value}${chosen?'; dùng làm đáp án':''}`,`<rect x="${x}" y="31" width="54" height="61" rx="4" class="p2-counting-node p2-counting-${role}"/>${text(x+27,51,`mũ ${i}`,'p2-counting-small')}${text(x+27,77,value,'p2-counting-value')}`));
      if(i<seq.length-1)timeline.push(text(x+59,70,'→'));
    });
    if(period>0){const x1=15+start*64,x2=15+(start+period)*64-10;timeline.push(`<path d="M ${x1} 103 v 9 H ${x2} v -9" class="p2-counting-bracket"/>`+text((x1+x2)/2,133,`Chu kỳ ${period} bước`,'p2-counting-small'));}
    else timeline.push(text(15,125,k<b?'Tiếp tục cho tới khi gặp lại số dư.':'Đã đủ số bước cần tính.','p2-counting-small','start'));
    const tableRows=seq.map((value,i)=>[i,value,start<0?'Đã tính':i<start?'Trước chu kỳ':i===start+period?'Lặp lại đầu chu kỳ':i===target?'Mũ tương đương':'Trong chu kỳ']);
    return title('Vòng số dư: cùng dư, cùng bước tiếp')+p(`Cần tính ${a}^${b} chia ${m} lấy dư.`,'p2-counting-summary')+svg(290,322,'Các số dư và mũi tên nhân lấy dư',body)+p('◎ Đang giữ · ✓ Đã gặp · … Chưa gặp. Mũi tên chỉ các bước đã thực hiện.')+p('Cuộn ngang dãy số mũ để xem các bước khác.')+svg(width,149,'Các số dư theo số mũ; ngoặc chỉ phần chu kỳ',timeline.join(''))+(period?p(`Mũ ${b} → mũ ${target}. ${start?'Phần trước mũ '+start+' không thuộc chu kỳ.':'Chu kỳ bắt đầu ngay từ mũ 0.'}`,'p2-counting-summary'):p('Dãy bên dưới ghi lại số dư đã gặp theo thứ tự.'))+table(['Số mũ','Số dư','Vai trò'],tableRows,'Xem bảng số dư theo mũ');
  }
  function digits(state){
    const s=state.scene,{n,rows,total}=s,levels=Math.max(2,String(Math.max(n,1)).length),height=levels*122+42;
    let body='';const data=[];
    for(let d=1,lo=1;d<=levels;d++,lo*=10){
      const y=16+(d-1)*122,done=rows.find(row=>row.d===d),current=s.stage==='count'&&d===s.d,valid=Math.max(0,Math.min(n,lo*10-1)-lo+1),capacity=9*lo;
      const label=`${d} chữ số: ${lo}…${lo*10-1}`;
      body+=text(14,y+13,label,'p2-counting-heading','start');
      for(let bucket=0;bucket<9;bucket++){
        const x=16+bucket*29,count=done?Math.max(0,Math.min(lo,done.count-bucket*lo)):0;
        const role=!done?(valid?'pending':'excluded'):count===lo?'done':count?'current':'excluded';
        const symbol=!done?(valid?'…':'×'):count===lo?'✓':count?'◐':'×';
        body+=tip(`Nhóm ${lo+bucket*lo}…${lo+(bucket+1)*lo-1}: ${done?count+' số được lấy':valid?'chưa đếm':'ngoài N'}`,`<rect x="${x}" y="${y+28}" width="25" height="28" rx="4" class="p2-counting-node p2-counting-${role}"/>${count?`<rect x="${x+2}" y="${y+48}" width="${21*count/lo}" height="6" rx="2" class="p2-counting-fill"/>`:''}${text(x+12.5,y+46,symbol,'p2-counting-small')}`);
      }
      const isFull=valid===capacity;
      body+=text(16,y+79,done?`${isFull?'✓ Khối đầy':'◐ Phần còn lại'}: ${done.count} × ${d} = ${done.contribution}`:valid?'… Chưa đếm khối này':'× N chưa tới khối này','p2-counting-small','start');
      body+=text(16,y+101,`1 ô: ${lo} số · 1 hàng: ${capacity} số.`,'p2-counting-small','start');
      if(current)body+=`<path d="M 285 ${y+27} v 32 M 279 ${y+27} h 6 M 279 ${y+59} h 6" class="p2-counting-bracket"/>`;
      data.push([d,`${lo}…${lo*10-1}`,capacity,done?done.count:valid?'Chưa đếm':0,done?done.contribution:valid?'Chưa đếm':0]);
    }
    body+=text(16,height-11,'Mỗi hàng có chín nhóm bằng nhau.','p2-counting-small','start');
    return title('Đếm khối đầy, rồi đếm phần còn lại')+p(n?`Viết 1…${n} · Đã đếm ${total} chữ số.`:'N=0: không viết số nào.','p2-counting-summary')+svg(294,height,'Các khối độ dài và phần được lấy đến N',body)+p('✓ Đầy · ◐ Lấy một phần · × Không lấy · … Chưa đếm.')+p('Thanh nhỏ dưới ô biểu diễn phần được lấy. Các hàng dùng đơn vị số lượng khác nhau.')+table(['Độ dài','Khối','Sức chứa','Số đã lấy','Chữ số đã cộng'],data,'Xem bảng các khối chữ số');
  }
  const boundRoots=new WeakSet();
  function render(root,state,index,states){
    const kind=state.scene?.kind;if(kind!=='residue'&&kind!=='digits')return false;
    root.classList.add('p2-counting');
    const genericLegend=root.parentElement.querySelector('#sim-legend');
    if(genericLegend)genericLegend.hidden=true;
    root.innerHTML=(kind==='residue'?residue(state,index,states):digits(state))+'<p class="p2-counting-tooltip" aria-live="polite">Chạm một ô hoặc mũi tên để xem chi tiết.</p>';
    if(kind==='residue'){
      const scroller=root.querySelectorAll('.p2-counting-scroll')[1],mark=scroller.querySelector('.p2-counting-current');
      if(mark){const box=mark.getBoundingClientRect(),frame=scroller.getBoundingClientRect();scroller.scrollLeft+=box.x-frame.x-(frame.width-box.width)/2;}
    }
    const show=event=>{const mark=event.target.closest('[data-counting-tip]');if(mark&&root.contains(mark))root.querySelector('.p2-counting-tooltip').textContent=mark.dataset.countingTip;};
    if(!boundRoots.has(root)){
      root.addEventListener('pointerover',show);root.addEventListener('focusin',show);root.addEventListener('click',show);
      boundRoots.add(root);
    }
    return true;
  }
  window.P2Counting={render};
})();
