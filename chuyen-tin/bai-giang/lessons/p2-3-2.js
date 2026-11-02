(() => {
  'use strict';
  const header='import sys\ninput = sys.stdin.readline\n';
  function random(seed){let x=seed>>>0;return max=>{x+=0x6D2B79F5;let z=Math.imul(x^(x>>>15),1|x);z^=z+Math.imul(z^(z>>>7),61|z);return ((z^(z>>>14))>>>0)%max;};}
  const pairRead=header+'n, d = map(int, input().split())\n';
  const pairPack=(n,d)=>`${n} ${d}\n`;
  const pairCases=[[17,5],[0,3],[1,1],[1,2],[5,5],[6,5],[15,5],[16,5],[100,1],[99,10],[1000,33],[100000,97]];
  const bottleSolution=pairRead+'print(n // d, n % d)\n';
  const bottleBrute=pairRead+`count = 0
while n >= d:
    n -= d
    count += 1
print(count, n)
`;
  function bottleAnswer(n,d){let q=0;while(n>=d){n-=d;q++;}return `${q} ${n}\n`;}
  const bottleTests=pairCases.map(([n,d])=>({input:pairPack(n,d),output:bottleAnswer(n,d)}));
  const simulationCode=pairRead+`slow = n
steps = 0
fast_steps = n // d
jump = n % d
while slow >= d:
    slow -= d
    steps += 1
print(steps, slow)
`;
  const walkRead=header+'a, b, t = map(int, input().split())\n';
  const walkSolution=walkRead+'print((t // 2) * (a - b) + (a if t % 2 else 0))\n';
  const walkBrute=walkRead+`position = 0
for step in range(t):
    if step % 2 == 0:
        position += a
    else:
        position -= b
print(position)
`;
  const walkCases=[[4,1,5],[1,1,0],[1,1,1],[1,1,2],[1,5,3],[5,1,4],[2,7,10],[100,3,2],[8,8,9],[3,4,1000],[9,2,9999],[1000000000,1,1]];
  const walkPack=a=>a.join(' ')+'\n';
  function walkAnswer(a,b,t){let p=0;for(let i=0;i<t;i++)p+=i%2?-b:a;return `${p}\n`;}
  const reduceRead=header+'n, k = map(int, input().split())\n';
  const reduceSolution=reduceRead+`steps = 0
while n > 0:
    if n < k:
        steps += n
        break
    remainder = n % k
    steps += remainder
    n -= remainder
    n //= k
    steps += 1
print(steps)
`;
  const reduceBrute=reduceRead+`steps = 0
while n > 0:
    if n % k == 0:
        n //= k
    else:
        n -= 1
    steps += 1
print(steps)
`;
  const reduceCases=[[10,3],[0,2],[1,2],[2,2],[3,2],[8,2],[9,3],[10,10],[10,11],[100,7],[9999,97],[100000,100001]];
  function reduceAnswer(n,k){let a=0;while(n>0){n=n%k===0?n/k:n-1;a++;}return `${a}\n`;}
  const tankRead=header+'m, water = map(int, input().split())\ncapacity = list(map(int, input().split()))\n';
  const tankSolution=tankRead+`answer = []
for size in capacity:
    taken = min(water, size)
    answer.append(taken)
    water -= taken
print(*answer)
`;
  const tankBrute=tankRead+`answer = [0] * m
current = 0
for _ in range(water):
    while current < m and answer[current] == capacity[current]:
        current += 1
    if current == m:
        break
    answer[current] += 1
print(*answer)
`;
  const tankPack=(a,w)=>`${a.length} ${w}\n${a.join(' ')}\n`;
  const tankCases=[[[3,5,2],9],[[1],0],[[1],1],[[1],2],[[2,2,2],3],[[2,2,2],6],[[2,2,2],7],[[10,1,10],11],[[1,10,1],2],[[3,4,5],1],[[100000,100000],150000],[Array(100).fill(7),333]];
  function tankAnswer(a,w){let out=Array(a.length).fill(0),i=0;for(let j=0;j<w;j++){while(i<a.length&&out[i]===a[i])i++;if(i===a.length)break;out[i]++;}return out.join(' ')+'\n';}
  const trace=`import io, sys, json
snapshots = []
previous = 0
def trace(frame, event, arg):
    global previous
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v = frame.f_locals
        if frame.f_lineno == 8:
            snapshots.append({'values': [v['n'], v['d'], v['slow'], v['steps'], v['fast_steps'], v['jump']], 'line': previous})
        previous = frame.f_lineno
    return trace
old_in, old_out = sys.stdin, sys.stdout
try:
    sys.stdin, sys.stdout = io.StringIO(text), io.StringIO()
    sys.settrace(trace)
    exec(compile(source, '<simulation>', 'exec'), {})
finally:
    sys.settrace(None)
    sys.stdin, sys.stdout = old_in, old_out
print(json.dumps(snapshots))
`;
  window.LESSON_DATA={
    id:'3-2',slug:'3-2-gop-buoc',title:'Mô phỏng và gộp bước',chapter:3,
    goal:'Nhận ra thao tác lặp giống nhau, tính số lần gộp và kiểm tra điểm dừng.',
    prerequisite:'Em biết vòng lặp, chia nguyên và chia lấy dư.',
    warmup:[
      {question:'17 chia nguyên cho 5 bằng bao nhiêu?',answer:'3',explanation:'Có ba nhóm đầy đủ, mỗi nhóm 5.',hint:'Tìm số nhóm 5 không vượt 17.'},
      {question:'Sau ba lần trừ 5 từ 17, còn bao nhiêu?',answer:'2',explanation:'17 − 3 × 5 = 2.',hint:'Dùng phép nhân thay ba phép trừ.'}
    ],
    story:{html:'<p>Có 17 lít nước, mỗi bình chứa đúng 5 lít. Chỉ rót những bình đầy, giữ phần nước còn thừa.</p><p>Rót từng bình là đúng. Nếu lượng nước rất lớn, em có cần lặp từng lần không?</p>',question:'Rót được bao nhiêu bình đầy?',answer:'3',explanation:'Ba bình dùng 15 lít, còn 2 lít.',hint:'Thử trừ 5 cho đến khi phần còn lại nhỏ hơn 5.'},
    brute:{html:'<p>Mỗi lượt trừ dung tích một bình, rồi tăng số bình. Dừng khi không đủ nước cho bình tiếp theo.</p><p>Dung tích luôn dương. Vì vậy lượng nước giảm sau mỗi lượt.</p>',code:bottleBrute,input:'17 5\n',output:'3 2\n',cost:'n lượt khi mỗi bình chứa 1 lít',count(n){return {slow:n,fast:2,slowLabel:'Rót từng bình · dung tích 1',fastLabel:'Hai phép chia lấy thương và dư'};}},
    idea:{html:'<p>Mô phỏng là làm đúng từng thao tác trong đề. Gộp bước là thay nhiều thao tác bằng một phép tính.</p><p>Với q = n // d, ta có q × d ≤ n &lt; (q + 1) × d.</p><p>Vì vậy rót được đúng q bình đầy. Phần còn lại r = n − q × d cũng bằng n % d.</p><p><strong>Điều kiện:</strong> d dương và không đổi; không có sự kiện chen giữa các lần rót.</p><p>Kiểm tra sau khi gộp: 0 ≤ r &lt; d. Nếu d thay đổi, công thức một lần này không còn đủ.</p><p>Đường trên chạy từng lần; đường dưới nhảy gộp. Đến cuối, hai đường phải có cùng điểm dừng.</p>',examples:[
      {question:'20 lít, bình 5 lít: còn dư bao nhiêu?',answer:'0',explanation:'Chia vừa hết vẫn rót được bình cuối cùng.'},
      {question:'3 lít, bình 5 lít: rót được mấy bình đầy?',answer:'0',explanation:'Ngay từ đầu không đủ một bình.'},
      {question:'23 lít, bình 7 lít: còn dư bao nhiêu?',answer:'2',explanation:'Gộp ba lần rót, dùng 21 lít.'}
    ]},
    simulation:{input:'17 5\n',alternateInput:'20 5\n',inputLabel:'Nhập n d: 0 ≤ n ≤ 36 và 1 ≤ d ≤ 12.',code:simulationCode,
      build(text){
        const a=text.trim().split(/\s+/);if(a.length!==2||a.some(s=>!/^\d+$/.test(s)))throw Error('Nhập hai số nguyên n và d.');
        const[n,d]=a.map(Number);if(n>36||d<1||d>12)throw Error('Cần n từ 0 đến 36; d từ 1 đến 12.');
        let slow=n,steps=0;const fast=Math.floor(n/d),jump=n%d,states=[];
        function add(line){states.push({values:[n,d,slow,steps,fast,jump],labels:['n ban đầu','d mỗi lần','còn lại từng bước','số lần đã rót','số lần gộp','còn lại nhảy gộp'],roles:['source','source','current','done','done','done'],line,note:`Từng bước còn ${slow}; nhảy gộp còn ${jump}.`,scene:{kind:'batch',n,d,steps,slow,fast,jump},question:'',predict:''});}
        add(7);while(slow>=d){slow-=d;steps++;add(10);}
        states.forEach((s,i)=>{s.question=i<states.length-1?'Rót thêm một bình, đường từng bước còn bao nhiêu lít?':'Đã xong: cả hai đường còn bao nhiêu lít?';s.predict=String(i<states.length-1?states[i+1].values[2]:jump);if(i===states.length-1)s.note=`Hai đường cùng còn ${jump} lít sau ${fast} lần rót.`;});return states;
      },tracePython:trace,render(root,state,index,states){return window.P2Greedy.render(root,state,index,states);}},
    model:{code:simulationCode,input:'17 5\n',output:'3 2\n'},
    activities:{
      output:{code:'n, d = 23, 7\nprint(n // d, n % d)\n',input:'',answer:'3 2',explanation:'Ba nhóm 7 dùng 21, còn 2.'},
      parsons:{lines:['n, d = 17, 5','count = n // d','used = count * d','remainder = n - used','print(count, remainder)'],validOrders:[[0,1,2,3,4]],output:'3 2'},
      blank:{prompt:'Điền lượng nước còn lại sau các bình đầy.',template:bottleSolution.replace('n % d','___'),answer:'n % d',tests:bottleTests.slice(0,8)},
      bug:{prompt:'Code bỏ sót bình cuối khi chia vừa hết. Sửa điều kiện lặp.',code:bottleBrute.replace('n >= d','n > d'),line:5,fix:'while n >= d:',tests:bottleTests.slice(0,8)}
    },
    problems:[
      {id:'3-2-bottles',title:'1. Bình đầy và phần dư',level:'Khởi động',statement:'Có n lít nước, mỗi bình chứa đúng d lít. Rót nhiều bình đầy nhất, rồi giữ lại phần nước dư.\n\nDữ liệu vào: n d trên một dòng.\n\nKết quả: in số bình đầy và lượng nước còn dư.',constraints:'0 ≤ n ≤ 10¹²; 1 ≤ d ≤ 10⁹.',sample:{input:'17 5\n',output:'3 2\n',explanation:'Rót ba bình, còn hai lít.'},starter:pairRead+'# Tính số nhóm và phần dư.\n',hints:['Thử trừ d cho đến khi còn ít hơn d.','Số lần trừ bằng thương nguyên.','In n // d và n % d.'],solution:bottleSolution,brute:bottleBrute,tests:bottleTests,randomInput(seed){const r=random(seed);return pairPack(r(1000),1+r(50));},hiddenHint:'Thử n=0, n<d và n chia hết cho d.'},
      {id:'3-2-walk',title:'2. Bước tới, bước lui',level:'Cơ bản',statement:'Robot bắt đầu tại 0. Lượt lẻ đi tới a đơn vị; lượt chẵn lùi b đơn vị.\n\nDữ liệu vào: ba số a b t.\n\nKết quả: in vị trí sau t lượt, có thể âm.',constraints:'1 ≤ a, b ≤ 10⁹; 0 ≤ t ≤ 10¹².',sample:{input:'4 1 5\n',output:'10\n',explanation:'Hai cặp lượt dịch 6 đơn vị, lượt cuối tiến thêm 4.'},starter:walkRead+'# Gộp mỗi hai lượt liên tiếp.\n',hints:['Sau một cặp tới rồi lui, vị trí đổi bao nhiêu?','Mỗi cặp dịch a−b; có t // 2 cặp.','Nếu t lẻ, cộng thêm a cho lượt cuối.'],solution:walkSolution,brute:walkBrute,tests:walkCases.map(a=>({input:walkPack(a),output:walkAnswer(...a)})),randomInput(seed){const r=random(seed);return walkPack([1+r(20),1+r(20),r(500)]);},hiddenHint:'Thử t=0, t lẻ và a<b.'},
      {id:'3-2-reduce',title:'3. Rút số về không',level:'Trung bình',statement:'Lặp đến khi n=0. Nếu n chia hết cho k thì chia n cho k; ngược lại giảm n một đơn vị.\n\nDữ liệu vào: hai số n k.\n\nKết quả: in tổng số thao tác theo đúng quy tắc trên.',constraints:'0 ≤ n ≤ 10¹²; 2 ≤ k ≤ 10⁹.',sample:{input:'10 3\n',output:'4\n',explanation:'10 → 9 → 3 → 1 → 0, gồm bốn thao tác.'},starter:reduceRead+'# Gộp các lượt giảm một đơn vị.\n',hints:['Trước lần chia kế tiếp, phải giảm bao nhiêu lần?','Giảm n % k lần để tới bội của k.','Nếu n<k, cộng n thao tác rồi dừng; nếu không, thực hiện một lần chia.'],solution:reduceSolution,brute:reduceBrute,tests:reduceCases.map(([n,k])=>({input:pairPack(n,k),output:reduceAnswer(n,k)})),randomInput(seed){const r=random(seed);return pairPack(r(3000),2+r(60));},hiddenHint:'Không chia 0 thêm lần nữa; mỗi phép chia vẫn tính một thao tác.'},
      {id:'3-2-tanks',title:'4. Nước qua các bồn',level:'Trung bình',statement:'Nước đi qua m bồn theo thứ tự. Bồn trước đầy mới chảy sang bồn sau; nước vượt tất cả bồn bị bỏ.\n\nDữ liệu vào: dòng đầu m W; dòng sau m dung tích dương.\n\nKết quả: in lượng nước trong từng bồn.',constraints:'1 ≤ m ≤ 2000; 0 ≤ W ≤ 10¹²; 1 ≤ dung tích ≤ 10⁹.',sample:{input:tankPack([3,5,2],9),output:'3 5 1\n',explanation:'Hai bồn đầu dùng tám lít, bồn cuối nhận một lít.'},starter:tankRead+'# Rót gộp theo từng bồn.\n',hints:['Bồn đầu nhận tối đa bao nhiêu lít?','Mỗi bồn nhận min(nước còn lại, dung tích).','Trừ lượng vừa nhận rồi chuyển sang bồn sau.'],solution:tankSolution,brute:tankBrute,tests:tankCases.map(([a,w])=>({input:tankPack(a,w),output:tankAnswer(a,w)})),randomInput(seed){const r=random(seed);return tankPack(Array.from({length:1+r(15)},()=>1+r(25)),r(400));},hiddenHint:'Thử hết nước giữa một bồn và nước vượt tổng dung tích.'}
    ],
    exams:[
      {id:'khtn-2026-card',title:'CARD · Loại lá bài',note:'KHTN 2026: mô phỏng đúng phép so sánh hai lá đầu. Chỉ giữ trạng thái còn ảnh hưởng tới lượt sau.',hint:'<p>Lá lớn hơn sống sót; hai lá bằng nhau cùng bị loại.</p><p>Không được gộp chỉ bằng giá trị lớn nhất, vì hai giá trị bằng nhau có thể biến mất.</p>',sourceNote:''},
      {id:'hcm-2024-locnuoc',title:'LOCNUOC · Lọc nước',note:'TP.HCM 2024: gộp lượng nước vào từng bồn, thay vì từng lít. Đây là bước mô phỏng một hệ thống.',hint:'<p>Ở một hệ thống, mỗi bồn nhận lượng nhỏ hơn giữa nước còn lại và dung tích.</p><p>Còn phải cộng theo máy và chọn cách xử lý phù hợp với giới hạn toàn bài.</p><p>Đề ghi m ≤ 10⁹ nhưng vẫn yêu cầu m dung tích; giới hạn này chưa có đính chính.</p>',sourceNote:''}
    ],
    remember:{items:['Mô phỏng đúng trước khi bỏ bớt thao tác.','Gộp khi nhiều bước có cùng tác động.','Tính riêng số nhóm đủ và phần dư.','Không nhảy qua sự kiện làm đổi quy tắc.','So trạng thái cuối với bản từng bước.'],cost:'Rót từng bình cần O(n/d) lượt; công thức dùng O(1) phép toán. Rót qua m bồn cần O(m).',pitfalls:['Dùng dấu > thay ≥ sẽ bỏ sót trường hợp vừa đủ.','Gộp bước nhưng quên đếm các phép chia hoặc phần lẻ.']},
    next:{text:'Nếu mỗi bước có nhiều lựa chọn, lựa chọn tốt nhất trước mắt có luôn đúng không?',href:'3-3-tham-lam.html',title:'Tham lam: đúng và phản ví dụ'}
  };
})();
