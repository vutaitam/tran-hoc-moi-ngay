(() => {
  'use strict';
  const header='import sys\ninput = sys.stdin.readline\n';
  function random(seed){let x=seed>>>0;return max=>{x+=0x6D2B79F5;let z=Math.imul(x^(x>>>15),1|x);z^=z+Math.imul(z^(z>>>7),61|z);return ((z^(z>>>14))>>>0)%max;};}
  const boatRead=header+'n, limit = map(int, input().split())\na = sorted(map(int, input().split()))\n';
  const boatSolution=boatRead+`left, right = 0, n - 1
boats = 0
while left <= right:
    if left < right and a[left] + a[right] <= limit:
        left += 1
    right -= 1
    boats += 1
print(boats)
`;
  const boatBrute=boatRead+`from functools import lru_cache
@lru_cache(None)
def solve(mask):
    if mask == 0:
        return 0
    i = (mask & -mask).bit_length() - 1
    rest = mask ^ (1 << i)
    best = 1 + solve(rest)
    for j in range(i + 1, n):
        if rest & (1 << j) and a[i] + a[j] <= limit:
            best = min(best, 1 + solve(rest ^ (1 << j)))
    return best
print(solve((1 << n) - 1))
`;
  const boatPack=(a,c)=>`${a.length} ${c}\n${a.join(' ')}\n`;
  const boatCases=[[[1,2,3,4],5],[[1],1],[[5],5],[[2,3],5],[[3,3],5],[[1,1,1],2],[[1,2,4,4],5],[[2,2,2,2],3],[[1,1,4,4],5],[[5,1,2,3,4],5],[[7,7,7,7,7,7,7,7,7,7,7,7],14],[[1000000000,1],1000000000]];
  function boatAnswer(a,c){const memo=new Map();function rec(mask){if(!mask)return 0;if(memo.has(mask))return memo.get(mask);let i=0;while(!(mask&(1<<i)))i++;const rest=mask^(1<<i);let b=1+rec(rest);for(let j=i+1;j<a.length;j++)if((rest&(1<<j))&&a[i]+a[j]<=c)b=Math.min(b,1+rec(rest^(1<<j)));memo.set(mask,b);return b;}return `${rec((1<<a.length)-1)}\n`;}
  const boatTests=boatCases.map(([a,c])=>({input:boatPack(a,c),output:boatAnswer(a,c)}));
  const coinRead=header+'n = int(input())\n';
  const coinSolution=coinRead+`remaining = n
greedy = 0
for coin in [4, 3, 1]:
    greedy += remaining // coin
    remaining %= coin
best = [0] + [n + 1] * n
for total in range(1, n + 1):
    for coin in [1, 3, 4]:
        if coin <= total:
            best[total] = min(best[total], best[total - coin] + 1)
print(greedy, best[n])
`;
  const coinBrute=coinRead+`remaining = n
greedy = 0
while remaining > 0:
    if remaining >= 4:
        remaining -= 4
    elif remaining >= 3:
        remaining -= 3
    else:
        remaining -= 1
    greedy += 1
answer = n
for fours in range(n // 4 + 1):
    for threes in range((n - 4 * fours) // 3 + 1):
        ones = n - 4 * fours - 3 * threes
        answer = min(answer, fours + threes + ones)
print(greedy, answer)
`;
  const coinCases=[0,1,2,3,4,5,6,7,10,14,99,500];
  function coinAnswer(n){let rest=n,g=0;while(rest){rest-=rest>=4?4:rest>=3?3:1;g++;}let best=n;for(let a=0;a*4<=n;a++)for(let b=0;4*a+3*b<=n;b++)best=Math.min(best,a+b+n-4*a-3*b);return `${g} ${best}\n`;}
  const chargeRead=header+'n, capacity, target = map(int, input().split())\nstations = sorted(map(int, input().split()))\n';
  const chargeSolution=chargeRead+`position = 0
index = 0
stops = 0
while position + capacity < target:
    farthest = position
    while index < n and stations[index] <= position + capacity:
        farthest = stations[index]
        index += 1
    if farthest == position:
        stops = -1
        break
    position = farthest
    stops += 1
print(stops)
`;
  const chargeBrute=chargeRead+`points = [0] + stations + [target]
best = [n + 2] * len(points)
best[0] = 0
for i in range(1, len(points)):
    for j in range(i):
        if points[i] - points[j] <= capacity:
            cost = 0 if i == len(points) - 1 else 1
            best[i] = min(best[i], best[j] + cost)
print(best[-1] if best[-1] <= n else -1)
`;
  const chargePack=(a,c,t)=>`${a.length} ${c} ${t}\n${a.join(' ')}\n`;
  const chargeCases=[[[3,6,8],6,12],[[],5,5],[[],5,6],[[5],5,10],[[4],5,10],[[1,2,3,4,5],3,6],[[2,4,6],2,8],[[2,7],4,9],[[3,6,9],10,11],[[9,3,6],6,12],[Array.from({length:12},(_,i)=>(i+1)*3),6,39],[[999999999],1000000000,1999999999]];
  function chargeAnswer(a,c,t){const p=[0,...a.slice().sort((x,y)=>x-y),t],b=p.map(()=>Infinity);b[0]=0;for(let i=1;i<p.length;i++)for(let j=0;j<i;j++)if(p[i]-p[j]<=c)b[i]=Math.min(b[i],b[j]+(i===p.length-1?0:1));return `${Number.isFinite(b.at(-1))?b.at(-1):-1}\n`;}
  const queueRead=header+'n = int(input())\ntimes = list(map(int, input().split()))\n';
  const queueSolution=queueRead+`times.sort()
clock = 0
answer = 0
for duration in times:
    clock += duration
    answer += clock
print(answer)
`;
  const queueBrute=queueRead+`from itertools import permutations
answer = None
for order in permutations(times):
    clock = total = 0
    for duration in order:
        clock += duration
        total += clock
    if answer is None or total < answer:
        answer = total
print(answer)
`;
  const queuePack=a=>`${a.length}\n${a.join(' ')}\n`;
  const queueCases=[[3,1,2],[1],[1000000000],[1,1],[3,2,1],[1,2,3],[5,5,5],[1,10,1],[9,2,8,3],[4,4,1,4],[8,7,6,5,4,3,2,1],[1000000000,1,1000000000]];
  function queueAnswer(a){let best=Infinity;function visit(rest,clock,total){if(!rest.length){best=Math.min(best,total);return;}rest.forEach((v,i)=>visit(rest.filter((_,j)=>j!==i),clock+v,total+clock+v));}visit(a,0,0);return `${best}\n`;}
  const simCode=boatRead+`wrong_pairs = []
i = 0
while i < n:
    if i + 1 < n and a[i] + a[i + 1] <= limit:
        wrong_pairs.append([i, i + 1])
        i += 2
    else:
        wrong_pairs.append([i])
        i += 1
wrong = len(wrong_pairs)
left, right = 0, n - 1
boats = 0
pairs = []
while left <= right:
    if left < right and a[left] + a[right] <= limit:
        pairs.append([left, right])
        left += 1
    else:
        pairs.append([right])
    right -= 1
    boats += 1
print(boats)
`;
  const simLines=simCode.split('\n'),loopLine=simLines.indexOf('while left <= right:')+1,initialLine=simLines.indexOf('pairs = []')+1,stepLine=simLines.indexOf('    boats += 1')+1;
  const trace=`import io, sys, json
snapshots = []
previous = 0
loop_line = source.splitlines().index('while left <= right:') + 1
def trace(frame, event, arg):
    global previous
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v = frame.f_locals
        if frame.f_lineno == loop_line:
            snapshots.append({'values': v['a'][:] + [v['left'], v['right'], v['boats'], v['wrong']], 'line': previous})
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
    id:'3-3',slug:'3-3-tham-lam',title:'Tham lam: đúng và phản ví dụ',chapter:3,
    goal:'Tìm phản ví dụ cho lựa chọn sai; dùng đổi chỗ để giải thích lựa chọn đúng.',
    prerequisite:'Em biết sắp xếp và hai con trỏ. Hai con trỏ đánh dấu hai đầu phần chưa xử lý.',
    warmup:[
      {question:'Thuyền chở tối đa 5, hai người nặng 2 và 3 có cùng đi được không? Nhập 1 hoặc 0.',answer:'1',explanation:'Tổng đúng 5 vẫn hợp lệ.',hint:'Giới hạn là không vượt 5.'},
      {question:'Xếp tăng [4, 1, 3, 2], người nặng nhất có cân nặng bao nhiêu?',answer:'4',explanation:'Người nặng nhất nằm ở cuối dãy đã sắp.',hint:'Tìm giá trị lớn nhất.'}
    ],
    story:{html:'<p>Bốn bạn nặng 1, 2, 3, 4 cần qua sông. Mỗi thuyền chở tối đa hai bạn, tổng cân nặng không vượt 5.</p><p>Ghép hai bạn nhẹ nhất trước có vẻ hợp lý. Nhưng lựa chọn đó để lại cặp 3 và 4 quá nặng.</p>',question:'Có thể đưa cả bốn bạn qua sông bằng ít nhất mấy thuyền?',answer:'2',explanation:'Ghép 1 với 4, rồi 2 với 3; mỗi thuyền chở đúng 5.',hint:'Thử ghép người nặng nhất với người nhẹ nhất.'},
    brute:{html:'<p>Chọn một người chưa đi; thử cho đi riêng hoặc ghép với từng người còn lại.</p><p>Lấy số thuyền ít nhất trong mọi nhánh hợp lệ. Ghi nhớ kết quả nhóm đã xét để tránh tính lại.</p><p>mask mã hóa nhóm người bằng các bit, là chữ số 0 hoặc 1. Bit 1 nghĩa là người đó chưa đi.</p><p>Bản này chỉ nhằm đối chiếu dữ liệu nhỏ. Em chưa cần thuộc cách viết mã hóa này.</p>',code:boatBrute,input:boatPack([1,2,3,4],5),output:'2\n',cost:'Tối đa n × 2ⁿ lựa chọn theo nhóm',count(n){return {slow:Math.min(1e15,2**n*n),fast:Math.ceil(n*Math.log2(Math.max(1,n)))+n,slowLabel:2**n*n>1e15?'Mốc n × 2ⁿ vượt 10¹⁵; thẻ dừng ở 10¹⁵':'Mốc trên n × 2ⁿ cho các nhóm',fastLabel:'Ước lượng: sắp xếp rồi một lượt ghép'};}},
    idea:{html:'<p>Tham lam là chốt lựa chọn tốt ngay lúc xét. Một phản ví dụ đủ bác bỏ một quy tắc.</p><p>Quy tắc “ghép hai người nhẹ nhất” dùng ba thuyền cho [1, 2, 3, 4], giới hạn 5.</p><p><strong>Điều kiện:</strong> mỗi thuyền tối đa hai người; từng người không nặng hơn giới hạn. Mục tiêu là ít thuyền nhất.</p><p>Gọi L nhẹ nhất, H nặng nhất. Nếu L + H vượt giới hạn, H không thể ghép với ai.</p><p>Nếu ghép được, có một cách tối ưu ghép L với H. Ta giải thích bằng đổi chỗ dưới đây.</p><p>Giả sử cách tối ưu ghép H với x, L với y. Đổi thành H với L, x với y.</p><p>Vì y ≤ H, nên x + y ≤ x + H, vẫn hợp lệ. Số thuyền không đổi.</p><p>Nếu một người đi riêng, phép đổi chỉ chuyển người đi riêng. Nếu cả hai đi riêng, ghép lại còn tốt hơn.</p><p>Vậy luôn có cách tối ưu chứa lựa chọn này. Bỏ người đã ghép rồi lặp lại với phần còn lại.</p>',examples:[
      {question:'[3, 4], giới hạn 5: cần mấy thuyền?',answer:'2',explanation:'Ngay người nhẹ nhất cũng không ghép được với người nặng nhất.'},
      {question:'[1, 2, 3, 4], giới hạn 5: ghép nhẹ nhất trước dùng mấy thuyền?',answer:'3',explanation:'Ghép 1+2, rồi 3 và 4 mỗi người một thuyền.'},
      {question:'[2, 2, 2], giới hạn 4: cách đúng dùng mấy thuyền?',answer:'2',explanation:'Hai người chung thuyền, người cuối đi riêng.'}
    ]},
    simulation:{input:boatPack([1,2,3,4],5),alternateInput:boatPack([1,2,4,4,5],5),inputLabel:'Dòng đầu n và giới hạn; dòng sau 1–10 cân nặng, mỗi số từ 1 đến giới hạn.',code:simCode,
      build(text){
        const t=text.trim().split(/\s+/);if(t.some(s=>!/^\d+$/.test(s)))throw Error('Nhập các số nguyên dương.');
        const[n,limit,...a]=t.map(Number);if(n<1||n>10||a.length!==n||limit<1||limit>99||a.some(x=>x<1||x>limit))throw Error('Cần 1–10 người; cân nặng không vượt giới hạn từ 1 đến 99.');
        a.sort((x,y)=>x-y);const wrong=[];for(let i=0;i<n;){if(i+1<n&&a[i]+a[i+1]<=limit){wrong.push([i,i+1]);i+=2;}else{wrong.push([i]);i++;}}
        let left=0,right=n-1,boats=0;const pairs=[],states=[];
        function add(line,note){states.push({values:a.concat([left,right,boats,wrong.length]),labels:a.map((_,i)=>`cân nặng ${i+1}`).concat(['đầu trái','đầu phải','thuyền đúng','thuyền nhẹ trước']),roles:a.map((_,i)=>i<left||i>right?'done':i===left||i===right?'current':'pending').concat(['current','current','done','done']),line,note,scene:{kind:'greedy-proof',a:a.slice(),limit,left,right,pairs:pairs.map(p=>p.slice()),wrong:wrong.map(p=>p.slice())},question:'',predict:''});}
        add(initialLine,'Đường trên thử ghép hai người nhẹ nhất; đường dưới xét nhẹ nhất với nặng nhất.');
        while(left<=right){const oldRight=right;if(left<right&&a[left]+a[right]<=limit){pairs.push([left,right]);left++;}else pairs.push([right]);right--;boats++;add(stepLine,`${a[oldRight]} đã có thuyền; cách đúng đang dùng ${boats} thuyền.`);}
        states.forEach((s,i)=>{s.question=i<states.length-1?'Sau lượt ghép tiếp theo, cách đúng dùng bao nhiêu thuyền?':'Đã xong: cách đúng cần bao nhiêu thuyền?';s.predict=String(i<states.length-1?states[i+1].values[n+2]:boats);if(i===states.length-1)s.note=`Cách đúng: ${boats} thuyền; nhẹ trước: ${wrong.length} thuyền.`;});return states;
      },tracePython:trace,render(root,state,index,states){return window.P2Greedy.render(root,state,index,states);}},
    model:{code:simCode,input:boatPack([1,2,3,4],5),output:'2\n'},
    activities:{
      output:{code:'coins = [4, 3, 1]\nremaining = 6\ncount = 0\nfor coin in coins:\n    count += remaining // coin\n    remaining %= coin\nprint(count)\n',input:'',answer:'3',explanation:'Chọn lớn trước được 4+1+1, nhưng 3+3 chỉ cần hai đồng.'},
      parsons:{lines:['a = [1, 2, 3, 4]','left, right = 0, len(a) - 1','if a[left] + a[right] <= 5:','    left += 1','right -= 1','print(left, right)'],validOrders:[[0,1,2,3,4,5]],output:'1 2'},
      blank:{prompt:'Điền tổng cân nặng cần kiểm tra trước khi ghép.',template:boatSolution.replace('a[left] + a[right] <= limit','___ <= limit'),answer:'a[left] + a[right]',tests:boatTests.slice(0,8)},
      bug:{prompt:'Code bỏ sót người cuối đi riêng. Sửa điều kiện lặp.',code:boatSolution.replace('while left <= right:','while left < right:'),line:7,fix:'while left <= right:',tests:boatTests.slice(0,8)}
    },
    problems:[
      {id:'3-3-boats',title:'1. Ít thuyền nhất',level:'Cơ bản',statement:'Mỗi thuyền chở tối đa hai người, tổng cân nặng không vượt C. Mỗi người cần đi đúng một lần.\n\nDữ liệu vào: dòng đầu n C; dòng sau n cân nặng.\n\nKết quả: in số thuyền ít nhất.',constraints:'1 ≤ n ≤ 16; 1 ≤ cân nặng ≤ C ≤ 10⁹.',sample:{input:boatPack([1,2,3,4],5),output:'2\n',explanation:'Ghép 1+4 và 2+3.'},starter:boatRead+'# Xét hai đầu dãy đã sắp.\n',hints:['Người nặng nhất luôn cần một thuyền.','Nếu không ghép được với người nhẹ nhất, người nặng nhất phải đi riêng.','Nếu ghép được, đưa cả hai đi; luôn giảm đầu phải và tăng số thuyền.'],solution:boatSolution,brute:boatBrute,tests:boatTests,randomInput(seed){const r=random(seed),c=1+r(30);return boatPack(Array.from({length:1+r(10)},()=>1+r(c)),c);},hiddenHint:'Thử một người, cặp vừa đủ tải và mọi người phải đi riêng.'},
      {id:'3-3-coins',title:'2. Kiểm tra chọn đồng lớn',level:'Trung bình',statement:'Có vô hạn đồng 1, 3, 4. Cách tham lam luôn lấy đồng lớn nhất không vượt số tiền còn lại.\n\nDữ liệu vào: số tiền n.\n\nKết quả: in số đồng của cách tham lam, rồi số đồng ít nhất thực sự.',constraints:'0 ≤ n ≤ 2000.',sample:{input:'6\n',output:'3 2\n',explanation:'Tham lam chọn 4+1+1; tối ưu chọn 3+3.'},starter:coinRead+'# So lựa chọn trước mắt với tối ưu.\n',hints:['Tính riêng cách luôn lấy đồng lớn nhất. Em cũng có thể thử mọi số đồng 4 và đồng 3.','Gọi best[t] là số đồng ít nhất để tạo tổng t. Đặt best[0]=0, rồi tính t tăng từ 1 đến n.','Thử đồng cuối c trong 1,3,4 với c≤t. Tổng t−c nhỏ hơn đã được tính; lấy min(best[t−c]+1).'],solution:coinSolution,brute:coinBrute,tests:coinCases.map(n=>({input:`${n}\n`,output:coinAnswer(n)})),randomInput(seed){return `${random(seed)(300)}\n`;},hiddenHint:'Phải in hai số; chúng có thể khác nhau hoặc bằng nhau.'},
      {id:'3-3-charge',title:'3. Chọn trạm sạc',level:'Trung bình',statement:'Xe bắt đầu tại 0 với pin đầy, đi được tối đa P mỗi lần đầy pin. Các trạm đều sạc đầy tức thì.\n\nDữ liệu vào: n P D; dòng sau là n vị trí trạm khác nhau, nằm giữa 0 và D.\n\nKết quả: in số lần sạc ít nhất để tới D; in −1 nếu không tới được.',constraints:'0 ≤ n ≤ 2000; 1 ≤ P, D ≤ 2 × 10⁹; 0 < trạm < D.',sample:{input:chargePack([3,6,8],6,12),output:'1\n',explanation:'Đi tới trạm 6, sạc một lần rồi đến 12.'},starter:chargeRead+'# Chọn trạm xa nhất còn tới được.\n',hints:['Nếu pin hiện tại đủ tới đích, không cần sạc thêm.','Trong các trạm còn tới được, chọn trạm xa nhất.','Sạc đầy xa hơn không giảm tầm tới; lặp lựa chọn đó, báo −1 nếu không có trạm.'],solution:chargeSolution,brute:chargeBrute,tests:chargeCases.map(([a,c,t])=>({input:chargePack(a,c,t),output:chargeAnswer(a,c,t)})),randomInput(seed){const r=random(seed),t=2+r(70),a=[];for(let x=1;x<t;x++)if(r(5)===0)a.push(x);return chargePack(a,1+r(20),t);},hiddenHint:'Trạm đúng tầm với vẫn tới được; không tính sạc ở đích.'},
      {id:'3-3-queue',title:'4. Xếp việc để xong sớm',level:'Trung bình',statement:'Một máy làm từng việc, không ngắt giữa chừng, bắt đầu lúc 0. Được đổi thứ tự các việc.\n\nDữ liệu vào: dòng đầu n; dòng sau n thời gian xử lý dương.\n\nKết quả: in tổng thời điểm hoàn thành nhỏ nhất.',constraints:'1 ≤ n ≤ 8; 1 ≤ thời gian ≤ 10⁹.',sample:{input:queuePack([3,1,2]),output:'10\n',explanation:'Thứ tự 1,2,3 hoàn thành lúc 1,3,6; tổng là 10.'},starter:queueRead+'# Đổi chỗ hai việc kề nhau.\n',hints:['So hai thứ tự x,y và y,x khi x≤y.','Xong việc ngắn trước giảm tổng thời điểm hoàn thành của cặp đi y−x.','Đổi mọi cặp sai thứ tự; cuối cùng dãy tăng là tối ưu.'],solution:queueSolution,brute:queueBrute,tests:queueCases.map(a=>({input:queuePack(a),output:queueAnswer(a)})),randomInput(seed){const r=random(seed);return queuePack(Array.from({length:1+r(7)},()=>1+r(20)));},hiddenHint:'Cần cộng từng thời điểm hoàn thành, không chỉ cộng thời gian xử lý.'}
    ],
    exams:[
      {id:'ptnk-2025-evtrip',title:'EVTRIP · Hành trình xe điện',note:'PTNK 2025: chọn trạm xa nhất còn tới được khi các trạm đều sạc đầy. Cần kiểm tra đoạn không thể vượt.',hint:'<p>Đổi trạm dừng kế tiếp sang trạm xa nhất không tăng số lần sạc.</p><p>Sau khi sạc đầy, vị trí xa hơn cho tầm tới không ngắn hơn.</p>',sourceNote:''},
      {id:'csp-2026-cuoc-thi',title:'Bài 2. Cuộc thi',note:'Chuyên Sư phạm 2026: tìm lựa chọn giảm phòng với ít người chuyển. Đây là hướng kiểm tra, chưa đủ lời giải.',hint:'<p>Thử nhỏ để tìm phản ví dụ cho từng quy tắc chuyển người.</p><p>Phải xét sức chứa, giới hạn điều chuyển và mục tiêu phụ; không chỉ chọn nơi đông nhất.</p>',sourceNote:''}
    ],
    remember:{items:['Tham lam cần chứng minh, không chỉ trực giác.','Một phản ví dụ đủ bác bỏ quy tắc.','Đổi chỗ mà không làm đáp án xấu hơn.','Ghi rõ điều kiện để phép đổi hợp lệ.','Dùng bản trâu đối chiếu các trường hợp nhỏ.'],cost:'Ghép thuyền cần O(n log n) để sắp xếp và O(n) để chọn. Thử các nhóm cần tối đa O(n × 2ⁿ).',pitfalls:['Hai người nhẹ nhất đi trước có thể làm tốn thuyền.','Chứng minh cho hai người mỗi thuyền không áp dụng khi cho ba người.']},
    next:{text:'Nếu không chứng minh được lựa chọn trước mắt, em cần giữ lại những khả năng nào?',href:'index.html#roadmap',title:'Quay lại lộ trình học'}
  };
})();
