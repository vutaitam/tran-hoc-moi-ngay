(() => {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mark = (label, content, className = '') => `<g tabindex="0" role="img" aria-label="${esc(label)}" data-tip="${esc(label)}" class="p2-mark ${className}"><title>${esc(label)}</title>${content}</g>`;
  const table = (headers, rows) => `<details class="secondary-details p2-data"><summary>Xem bảng tương đương</summary><div class="p2-scroll"><table><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  const legend = items => `<div class="p2-legend">${items.map(([role,label])=>`<span class="p2-key p2-${role}">${esc(label)}</span>`).join('')}</div>`;
  function pairs(scene,available) {
    const {n,d,checked,ended}=scene,limit=Math.floor(Math.sqrt(n)),gap=Math.min(70,Math.max(42,(available-44)/limit)),width=Math.max(280,limit*gap+44),first=28;
    let content=`<text x="16" y="25">Ước nhỏ tăng →</text><text x="16" y="223">Ước lớn giảm →</text><path class="p2-fold" d="M ${width-34} 48 Q ${width+2} 120 ${width-34} 192"/><text class="p2-mini" x="${width-120}" y="244">Gập tại √${n}</text>`;
    const rows=[];
    for(let candidate=1;candidate<=limit;candidate++){
      const x=first+(candidate-1)*gap,row=checked[candidate-1],active=candidate===d&&!ended;
      if(!row){
        content+=mark(`d=${candidate}; chưa thử chia`, `<rect class="p2-pending" x="${x-20}" y="52" width="40" height="44" rx="4"/><text x="${x}" y="80" text-anchor="middle">${candidate}</text><text class="p2-mini" x="${x}" y="151" text-anchor="middle">…</text>`);
        rows.push([candidate,'Chưa tính','Chưa tính','… Chưa thử']);
      }else if(row.r){
        content+=mark(`${n} chia ${candidate} dư ${row.r}; không có cặp ước`, `<rect class="p2-excluded" x="${x-20}" y="52" width="40" height="44" rx="4"/><text x="${x}" y="80" text-anchor="middle">${candidate}</text><path class="p2-strike" d="M ${x-19} 59 L ${x+19} 90"/><text class="p2-mini" x="${x}" y="151" text-anchor="middle">dư ${row.r}</text>`,active?'p2-active':'');
        rows.push([candidate,row.q,row.r,'× Không là ước']);
      }else if(row.d===row.q){
        content+=mark(`${candidate}×${candidate}=${n}; hai đầu trùng, chỉ đếm một ước`, `<path class="p2-pair-line" d="M ${x} 57 L ${x} 96 M ${x} 142 L ${x} 184"/><rect class="p2-pair" x="${x-20}" y="97" width="40" height="44" rx="4"/><text x="${x}" y="125" text-anchor="middle">${candidate}</text><text class="p2-mini" x="${x}" y="170" text-anchor="middle">✓ chỉ 1</text>`,active?'p2-active':'');
        rows.push([candidate,row.q,0,'✓ Hai đầu trùng: thêm 1']);
      }else{
        content+=mark(`${candidate}×${row.q}=${n}; cặp này thêm hai ước`, `<path class="p2-pair-line" d="M ${x} 96 L ${x} 149"/><rect class="p2-pair" x="${x-20}" y="52" width="40" height="44" rx="4"/><rect class="p2-pair" x="${x-20}" y="150" width="40" height="44" rx="4"/><text x="${x}" y="80" text-anchor="middle">${candidate}</text><text x="${x}" y="178" text-anchor="middle">${row.q}</text><text class="p2-mini" x="${x+7}" y="126">×</text>`,active?'p2-active':'');
        rows.push([candidate,row.q,0,'✓ Cặp khác nhau: thêm 2']);
      }
    }
    return `<p class="p2-caption">${n}: nối mỗi ước nhỏ với ước lớn; hai đầu gặp nhau thì chỉ giữ một ô.</p>${legend([['pair','│ Cặp ước đã tìm'],['excluded','× Không chia hết'],['pending','… Chưa thử']])}<div class="p2-scroll" tabindex="0" aria-label="Hình cặp ước; cuộn ngang để xem các cột"><svg class="p2-pairs" viewBox="0 0 ${width} 255" style="width:${width}px" role="group" aria-label="Gập cặp ước quanh căn bậc hai">${content}</svg></div>${table(['d','n//d','n%d','Kết luận'],rows)}`;
  }
  function euclid(scene,available) {
    const {x,y,q,r,ended,gcd,originalMax,originalMin}=scene,base=Math.max(150,Math.min(420,available-64)),unit=Math.max(base/originalMax,24/originalMin),left=32,top=55,height=y*unit,width=x*unit,viewWidth=originalMax*unit+64,viewHeight=Math.max(200,originalMin*unit+145);
    let content=`<rect class="p2-original" x="${left}" y="${top}" width="${originalMax*unit}" height="${originalMin*unit}"/><text x="${left}" y="27">Cạnh dài x=${x}</text><text class="p2-mini" x="${left}" y="${top+height+26}">Cạnh ngắn y=${y}</text>`;
    const rows=[];
    for(let i=0;i<q;i++){
      const edge=y*unit,px=left+i*edge;
      content+=mark(`Hình vuông ${i+1}: cạnh ${y}, diện tích ${y*y}`,`<rect class="p2-square" x="${px+1}" y="${top+1}" width="${Math.max(1,edge-2)}" height="${Math.max(1,height-2)}" rx="2"/>${edge>=46?`<text x="${px+edge/2}" y="${top+height/2+6}" text-anchor="middle">${y}×${y}</text>`:''}`);
      rows.push([`Vuông ${i+1}`,y,y,y*y]);
    }
    if(r){
      const px=left+q*y*unit,edge=r*unit;
      content+=mark(`Phần dư: hai cạnh ${y} và ${r}; dùng làm hình ở lượt sau`,`<rect class="p2-remainder" x="${px+1}" y="${top+1}" width="${Math.max(1,edge-2)}" height="${Math.max(1,height-2)}"/>${edge>=48?`<text x="${px+edge/2}" y="${top+height/2+6}" text-anchor="middle">dư ${r}</text>`:''}<path class="p2-remainder-line" d="M ${px+edge/2} ${top+height+3} V ${top+height+36}"/><text class="p2-mini" x="${px+edge/2}" y="${top+height+54}" text-anchor="middle">r=${r}</text>`);
      rows.push(['Phần dư',r,y,r*y]);
    }
    content+=`<rect class="p2-outline" x="${left}" y="${top}" width="${width}" height="${height}"/>`;
    return `<p class="p2-caption">${ended?`Dư bằng 0; cạnh vuông cuối ${gcd} là ƯCLN.`:`${x}=${q}×${y}+${r}. Cắt ${q} vuông cạnh ${y}; phần dư chuyển sang lượt sau.`}</p>${legend([['square','□ Vuông đã cắt'],['remainder','▧ Phần dư giữ lại']])}<p class="p2-scale">Giữ cùng tỷ lệ; khung mờ là kích thước ban đầu.</p><div class="p2-scroll" tabindex="0" aria-label="Hình chữ nhật cắt vuông; cuộn ngang khi cần"><svg class="p2-euclid" style="width:${viewWidth}px" viewBox="0 0 ${viewWidth} ${viewHeight}" role="group" aria-label="Cắt hình ${x} nhân ${y} thành các hình vuông và phần dư">${content}</svg></div><p class="p2-transition">${r?`Phần còn lại: ${y}×${r} → lượt sau lấy x=${y}, y=${r}.`:`${x} chia hết ${y} → y mới bằng 0, dừng.`}</p>${table(['Phần','Cạnh ngang','Cạnh dọc','Diện tích'],rows)}`;
  }
  function sieve(scene) {
    const {n,p,m,prime,ended,initial}=scene;
    const rows=[],cells=[];
    for(let value=0;value<=n;value++){
      const special=value<2,current=!initial&&!ended&&value===m,source=!ended&&value===p,status=special?'special':!prime[value]?'excluded':ended?'prime':'pending';
      const symbol=special?'∅':!prime[value]?'×':ended?'✓':'…';
      const label=special?'Không nguyên tố, không hợp số':!prime[value]?'Hợp số đã gạch':ended?'Số nguyên tố':'Chưa bị gạch';
      const detail=`${value}: ${label}${source?'; p đang sàng':''}${current?`; vừa gạch vì ${value}=${p}×${value/p}`:''}`;
      cells.push(`<div tabindex="0" role="img" aria-label="${esc(detail)}" title="${esc(detail)}" data-tip="${esc(detail)}" class="p2-number p2-${status}${current?' p2-active':''}${source?' p2-source':''}"><span class="p2-number-flag">${source?'p':symbol}</span><strong>${value}</strong>${current?'<span class="p2-now">m</span>':''}</div>`);
      rows.push([value,prime[value]?1:0,label,current?'◎ m vừa gạch':source?'↗ p đang sàng':'']);
    }
    return `<p class="p2-caption">${initial?'Loại riêng 0 và 1. Bắt đầu với p=2, bội đầu tiên là p²=4.':ended?'Các ô ✓ từ 2 trở lên là nguyên tố; ô × là hợp số.':`p=${p}: gạch ${m}=${p}×${m/p}. Các bội cách nhau ${p}.`}</p>${legend([['prime','✓ Nguyên tố khi kết thúc'],['excluded','× Hợp số bị gạch'],['special','∅ Riêng 0 và 1'],['pending','… Chưa bị gạch']])}<div class="p2-scroll" tabindex="0" aria-label="Lưới sàng số; cuộn ngang khi cần"><div class="p2-sieve-grid" role="group" aria-label="Các số từ 0 đến n, tăng theo hàng">${cells.join('')}</div></div>${table(['Số','prime','Kết luận','Vai trò'],rows)}`;
  }
  function render(root,state) {
    root.classList.add('p2-arithmetic');
    const genericLegend=document.getElementById('sim-legend');
    if(genericLegend)genericLegend.hidden=true;
    const scene=state.scene;
    if(!scene)return false;
    root.innerHTML=(scene.kind==='pairs'?pairs(scene,root.clientWidth):scene.kind==='euclid'?euclid(scene,root.clientWidth):sieve(scene))+'<div class="p2-tooltip" role="status" aria-live="polite" hidden></div>';
    const tooltip=root.querySelector('.p2-tooltip');
    const scroll=root.querySelector('.p2-scroll');
    if(scroll.scrollWidth>scroll.clientWidth+1){
      const hint=document.createElement('p');
      hint.className='p2-scroll-hint';
      hint.textContent='Vuốt ngang hình để xem các phần còn lại.';
      scroll.before(hint);
      const current=scroll.querySelector('.p2-active')||scroll.querySelector('.p2-source');
      if(current){
        const bounds=current.getBoundingClientRect(),viewport=scroll.getBoundingClientRect();
        scroll.scrollLeft=Math.max(0,bounds.left-viewport.left-scroll.clientWidth/2+bounds.width/2);
      }
    }
    root.querySelectorAll('[data-tip]').forEach(node=>{
      const show=()=>{tooltip.hidden=false;tooltip.textContent=node.dataset.tip;};
      const hide=()=>{tooltip.hidden=true;};
      node.addEventListener('pointerenter',show);
      node.addEventListener('pointerleave',hide);
      node.addEventListener('focus',show);
      node.addEventListener('blur',hide);
    });
    return true;
  }
  window.P2Arithmetic={render};
})();
