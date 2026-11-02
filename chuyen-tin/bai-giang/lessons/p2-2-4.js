(() => {
  'use strict';
  const reader = 'import sys\ninput = sys.stdin.readline  # Đọc từng dòng.\n';
  const cycle = reader + `a, b, m = map(int, input().split())
r, k = 1 % m, 0
start, period, target = -1, 0, -1
seen, residues = {}, []
while k < b and r not in seen:
    seen[r] = k
    residues.append(r)
    r = r * a % m
    k += 1
if k < b:
    start = seen[r]
    period = k - start
    target = start + (b - start) % period
    r = residues[target]
print(r)
`;
  const repeated = reader + `a, b, m = map(int, input().split())
r = 1 % m
for _ in range(b):
    r = r * a % m
print(r)
`;
  const decimal = reader + `s = input().strip()
m = int(input())
r = 0
for ch in s:
    r = (r * 10 + int(ch)) % m
print(r)
`;
  const decimalBrute = reader + `s = input().strip()
m = int(input())
print(int(s) % m)
`;
  const power = reader + `a, b, m = map(int, input().split())
print(pow(a, b, m))
`;
  const lastSum = reader + `n, b = map(int, input().split())
answer = 0
for digit in range(10):
    count = n // 10
    if 1 <= digit <= n % 10:
        count += 1
    answer += count * pow(digit, b, 10)
print(answer % 10)
`;
  const lastSumBrute = reader + `n, b = map(int, input().split())
answer = 0
for value in range(1, n + 1):
    answer += value ** b
print(answer % 10)
`;
  const tower = reader + `n = int(input())
print(2 if n % 2 == 0 else 3)
`;
  const towerBrute = reader + `n = int(input())
r, k = 2, 0
seen, values = {}, []
while k < n and r not in seen:
    seen[r] = k
    values.append(r)
    r = (r * r * r) % 5
    k += 1
if k < n:
    first = seen[r]
    r = values[first + (n - first) % (k - first)]
print(r)
`;
  const random = seed => {
    let x = Number(seed) >>> 0;
    return (lo, hi) => {x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return lo + x % (hi - lo + 1);};
  };
  const decimalTests = [
    ['12345', 7], ['0', 1], ['0', 9], ['1', 2], ['00012', 7], ['999', 3],
    ['1000', 16], ['123456789', 97], ['9'.repeat(1000), 997], ['1' + '0'.repeat(999), 999],
    ['9007199254740993', 100], ['100000000000000000000000000000000000000001', 73]
  ].map(([s,m]) => ({input:s+'\n'+m+'\n',output:String(BigInt(s)%BigInt(m))+'\n'}));
  function powExact(a, b, m) {
    let x=BigInt(a),n=BigInt(b),mod=BigInt(m),r=1n%mod;
    while(n){if(n%2n)r=r*x%mod;x=x*x%mod;n/=2n;}return r;
  }
  const powerTests = [[2,7,5],[0,0,7],[0,8,7],[7,0,1],[2,5,8],[6,4,9],
    [3,8,7],[10,3,10],[17,15,19],[5,99,12],[2,'1000000000000000000',31],
    ['1000000000000000000','999999999999999999',50]
  ].map(([a,b,m])=>({input:`${a} ${b} ${m}\n`,output:powExact(a,b,m)+'\n'}));
  const sumTests = [[12,2],[1,0],[1,1],[9,2],[10,2],[11,0],[20,3],[99,7],[100,60],[999,11],[10000,60],[10000,0]]
    .map(([n,b])=>{let total=0n;for(let i=1;i<=n;i++)total+=BigInt(i)**BigInt(b);return {input:`${n} ${b}\n`,output:total%10n+'\n'};});
  const towerTests = [1,2,3,4,5,6,7,8,9,100,999999999,1000000000].map(n=>({input:n+'\n',output:powExact(2,powExact(3,n,4),5)+'\n'}));
  const line = text => cycle.split('\n').indexOf(text)+1;
  const loopLine=line('while k < b and r not in seen:'), incrementLine=line('    k += 1'), selectLine=line('    r = residues[target]'), printLine=line('print(r)');
  function build(text) {
    const parts=text.trim().split(/\s+/);
    if(parts.length!==3||parts.some(x=>!/^\d+$/.test(x)))throw Error('Nhập ba số nguyên không âm: a b m.');
    const [a,b,m]=parts.map(Number);
    if(![a,b,m].every(Number.isSafeInteger)||a>99||b>1000000||m<1||m>12)throw Error('Hình nhận a ≤99, b ≤1.000.000 và m từ 1 đến 12.');
    let r=1%m,k=0,start=-1,period=0,target=-1;
    const seen=new Map(),residues=[],states=[];
    const save=(at,note,stage)=>states.push({values:[k,r,start,period,target],labels:['k · lượt đã nhân','r · số dư','start · đầu chu kỳ','period · độ dài','target · mũ tương đương'],roles:['done','current',start<0?'pending':'done',period?'done':'pending',target<0?'pending':'source'],line:at,note,scene:{kind:'residue',a,b,m,k,r,start,period,target,residues:residues.slice(),stage}});
    save(loopLine,`Bắt đầu từ a⁰: số dư là ${r}. Mỗi mũi tên nhân a rồi lấy dư.`, 'walk');
    while(k<b&&!seen.has(r)){
      seen.set(r,k);residues.push(r);const old=r;r=r*a%m;k++;
      save(incrementLine,`${old} × ${a} chia ${m} dư ${r}. Đã đi ${k} bước.`, 'walk');
    }
    if(k<b){
      start=seen.get(r);period=k-start;target=start+(b-start)%period;
      save(selectLine,`Số dư ${r} đã gặp tại mũ ${start}. Chu kỳ dài ${period}; mũ ${b} quy về ${target}.`, 'cycle');
      r=residues[target];
    }
    save(printLine,`Kết quả là ${r}. ${period?'Chỉ bỏ các vòng trọn trong phần chu kỳ.':'Đã đi đủ số bước cần tính.'}`, 'answer');
    states.forEach((s,i)=>{s.question=i+1<states.length?'Số dư r ở bước tiếp theo bằng bao nhiêu?':'Đã có kết quả; không còn bước tiếp theo.';s.predict=String(states[Math.min(i+1,states.length-1)].values[1]);});
    return states;
  }
  const tracePython = `import io, sys, json
states = []
lines = source.splitlines()
loop_line = lines.index('while k < b and r not in seen:') + 1
increment_line = lines.index('    k += 1') + 1
select_line = lines.index('    r = residues[target]') + 1
print_line = lines.index('print(r)') + 1
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v, here = frame.f_locals, frame.f_lineno
        if here in (loop_line, select_line, print_line):
            shown = increment_line if here == loop_line and v['k'] else here
            states.append({'values': [v[x] for x in ('k','r','start','period','target')], 'line': shown})
    return trace
old_in, old_out = sys.stdin, sys.stdout
sys.stdin, sys.stdout = io.StringIO(text), io.StringIO()
try:
    sys.settrace(trace)
    exec(compile(source, '<simulation>', 'exec'), {})
finally:
    sys.settrace(None)
    sys.stdin, sys.stdout = old_in, old_out
print(json.dumps(states))
`;
  window.LESSON_DATA = {
    id:'2-4',slug:'2-4-mod-luy-thua',title:'Phép mod, lũy thừa và chu kỳ',chapter:2,
    goal:'Giữ số dư nhỏ; nhận ra chu kỳ và tính lũy thừa mà không dựng số khổng lồ.',prerequisite:'Biết phép chia nguyên, vòng lặp và ước chung lớn nhất.',
    warmup:[
      {question:'17 chia 5 dư bao nhiêu?',answer:'2',explanation:'17 = 3×5 + 2. Python viết 17 % 5.',hint:'Bỏ ba nhóm, mỗi nhóm có năm.'},
      {question:'Ước chung lớn nhất của 2 và 5 bằng bao nhiêu?',answer:'1',explanation:'Hai số nguyên tố cùng nhau khi ước chung lớn nhất bằng 1.',hint:'Chỉ có 1 là ước chung của cả hai số.'}
    ],
    story:{html:'<p>Bài SODU của KHTN hỏi số dư của 2^(3^N) khi chia 5.</p><p>Đây là 2 mũ (3 mũ N), không phải (2 mũ 3) mũ N.</p><p>Với N=2, em chỉ cần xét số dư của 2⁹.</p>',question:'2⁹ = 512. Chia 5 dư bao nhiêu?',answer:'2',explanation:'512 = 102×5 + 2. Có thể tìm dư mà không dựng toàn bộ lũy thừa.',hint:'Chữ số cuối là 2.'},
    brute:{html:'<p>Cách thẳng: nhân a đúng b lần. Sau mỗi lần nhân, chỉ giữ số dư.</p><p>Cách này đúng nhưng vẫn cần b lượt. Nếu số dư lặp lại, các bước sau cũng lặp lại.</p>',code:repeated,input:powerTests[0].input,output:powerTests[0].output,cost:'Đếm lượt nhân lấy dư; so cách thẳng với tìm chu kỳ, cố định m=12.',count(n){return {slow:n,fast:Math.min(n,12),slowLabel:'Nhân lần lượt',fastLabel:'Tìm chu kỳ: tối đa 12 lượt'};}},
    idea:{html:'<p>Mod nghĩa là lấy số dư. Với m dương, x % m nằm từ 0 đến m−1.</p><p class="formula">(x + y) % m = ((x % m) + (y % m)) % m.</p><p>Phép nhân cũng cho phép lấy dư trước. Vì vậy, ta luôn giữ các số nhỏ.</p><p><code>pow(a, b, m)</code> tính aᵇ chia m lấy dư, không dựng aᵇ trước.</p><p>Ở đây b không âm, m dương. Python quy ước a⁰=1, kể cả a=0.</p><p>Hàm pow dùng bình phương liên tiếp: số mũ chẵn cho phép chia đôi công việc.</p><p class="formula">a^(2t) = (a^t)²; a^(2t+1) = a × (a^t)².</p><p>Chu kỳ là đoạn trạng thái lặp lại. Cùng số dư và cùng phép nhân sẽ cho cùng bước tiếp.</p><p>Chỉ có m số dư. Sau nhiều nhất m bước, ta gặp một số dư đã thấy.</p><p>Lưu mũ đầu gặp từng số dư. Hai lần gặp cho biết đầu và độ dài chu kỳ.</p><p class="formula">target = start + (b − start) % period.</p><p>Chỉ dùng công thức khi b đã tới phần chu kỳ. Đoạn trước chu kỳ không được bỏ tùy ý.</p><p>Không phải chu kỳ nào cũng dài m−1. Với 2 và m=8, ta có 1 → 2 → 4 → 0 → 0.</p><p>Khi m nguyên tố và a không chia hết cho m, a^(m−1) chia m dư 1.</p><p>Khi đó được giảm số mũ theo m−1. Chu kỳ nhỏ nhất vẫn có thể ngắn hơn.</p><p>Trong SODU, các lũy thừa của 2 chia 5 lặp theo 2, 4, 3, 1.</p><p>3^N chia 4 dư 1 khi N chẵn, dư 3 khi N lẻ. Đáp án tương ứng là 2 và 3.</p>',examples:[
      {question:'2⁷ chia 5 dư bao nhiêu?',answer:'3',explanation:'Chu kỳ dài 4; mũ 7 cho cùng dư với mũ 3.'},
      {question:'2⁵ chia 8 dư bao nhiêu?',answer:'0',explanation:'Từ mũ 3, số dư luôn bằng 0. Không giảm mũ theo 7.'},
      {question:'123 chia 7 dư 4. Ghép thêm chữ số 5 thì số mới chia 7 dư bao nhiêu?',answer:'3',explanation:'Chỉ cần tính (4×10+5)%7 = 3.'}
    ]},
    simulation:{input:'2 19 5',alternateInput:'2 20 8',inputLabel:'Nhập a b m. Hình dùng a≤99, b≤1.000.000, 1≤m≤12.',code:cycle,build,tracePython,render(root,state,index,states){return window.P2Counting.render(root,state,index,states);}},
    model:{code:cycle,input:powerTests[0].input,output:powerTests[0].output},
    activities:{
      output:{code:power,input:'2 5 8\n',answer:'0',explanation:'2⁵=32 chia hết cho 8. Dùng m−1 làm chu kỳ ở đây sẽ sai.'},
      parsons:{lines:['a, b, m = 2, 7, 5','r = 1 % m','for _ in range(b):','    r = r * a % m','print(r)'],validOrders:[[0,1,2,3,4]],output:'3'},
      blank:{prompt:'Ghép thêm một chữ số: điền cách cập nhật số dư.',template:decimal.replace('(r * 10 + int(ch)) % m','___'),answer:'(r * 10 + int(ch)) % m',tests:decimalTests},
      bug:{prompt:'Một dòng bỏ quên m khi tính lũy thừa. Sửa để in đúng số dư.',code:power.replace('print(pow(a, b, m))','print(pow(a, b))'),line:4,fix:'print(pow(a, b, m))',tests:powerTests.slice(0,10)}
    },
    problems:[
      {id:'2-4-decimal',title:'1. Số dài chia lấy dư',level:'Khởi động',statement:'Cho số nguyên không âm viết thành một xâu chữ số. Tính số dư khi chia số đó cho m. Xâu có thể có các số 0 ở đầu.\n\nDữ liệu vào: dòng đầu là xâu chữ số. Dòng sau là m.\n\nKết quả: in số dư.',constraints:'1 đến 1000 chữ số; 1 ≤ m ≤ 1000.',sample:{...decimalTests[0],explanation:'12345 = 1763×7 + 4.'},starter:reader+'s = input().strip()\nm = int(input())\n# Duyệt chữ số từ trái sang phải.\n',hints:['Ghép chữ số d nghĩa là nhân số cũ với 10 rồi cộng d.','Số mới và r×10+d có cùng số dư khi chia m.','Khởi tạo r=0; cập nhật r=(r*10+int(ch))%m.'],solution:decimal,brute:decimalBrute,tests:decimalTests,randomInput(seed){const r=random(seed),n=r(1,45);return Array.from({length:n},()=>r(0,9)).join('')+'\n'+r(1,1000)+'\n';},hiddenHint:'Thử số 0, m=1 và một xâu có nhiều chữ số 0 ở đầu.'},
      {id:'2-4-power',title:'2. Lũy thừa không dựng số lớn',level:'Cơ bản',statement:'Cho a, b và m. Tính số dư của aᵇ khi chia m. Quy ước a⁰=1, kể cả a=0.\n\nDữ liệu vào: ba số a b m.\n\nKết quả: in số dư.',constraints:'0 ≤ a,b ≤ 10¹⁸; 1 ≤ m ≤ 50.',sample:{...powerTests[0],explanation:'2⁷=128 chia 5 dư 3.'},starter:reader+'a, b, m = map(int, input().split())\n# Tính lũy thừa và giữ số dư.\n',hints:['Không tính a**b trước khi lấy dư.','Python có hàm nhận cả cơ số, số mũ và số chia.','Dùng pow(a,b,m); với m=1, kết quả luôn bằng 0.'],solution:power,brute:cycle,tests:powerTests,randomInput(seed){const r=random(seed);return `${r(0,1000)} ${r(0,100)} ${r(1,50)}\n`;},hiddenHint:'Thử b=0, a=0, m=1 và a có ước chung với m.'},
      {id:'2-4-last-sum',title:'3. Chữ số cuối của tổng',level:'Trung bình',statement:'Tìm chữ số cuối của 1ᵇ + 2ᵇ + … + nᵇ.\n\nDữ liệu vào: hai số n b.\n\nKết quả: in một chữ số.',constraints:'1 ≤ n ≤ 10.000; 0 ≤ b ≤ 60.',sample:{...sumTests[0],explanation:'Tổng bình phương từ 1 đến 12 bằng 650.'},starter:reader+'n, b = map(int, input().split())\n# Gom theo chữ số cuối.\n',hints:['Chữ số cuối là số dư khi chia 10.','Các cơ số có cùng chữ số cuối cho cùng dư sau khi nâng lũy thừa.','Mỗi nhóm có n//10 số. Các chữ số từ 1 đến n%10 có thêm một số.'],solution:lastSum,brute:lastSumBrute,tests:sumTests,randomInput(seed){const r=random(seed);return `${r(1,100)} ${r(0,16)}\n`;},hiddenHint:'Thử b=0 và n nằm ngay trước, đúng hoặc sau một bội của 10.'},
      {id:'2-4-tower',title:'4. Tháp lũy thừa',level:'Trung bình',statement:'Cho số nguyên dương n. Tính số dư của 2^(3^n) khi chia 5. Phải tính 3^n trước khi dùng làm số mũ của 2.\n\nDữ liệu vào: số n.\n\nKết quả: in số dư.',constraints:'1 ≤ n ≤ 10⁹.',sample:{...towerTests[0],explanation:'n=1 cho 2³=8, chia 5 dư 3.'},starter:reader+'n = int(input())\n# Xét chu kỳ của số mũ.\n',hints:['Lũy thừa của 2 chia 5 có chu kỳ 4.','3 chia 4 dư −1; 3^n phụ thuộc tính chẵn lẻ của n.','n chẵn: mũ dư 1 nên đáp án 2. n lẻ: mũ dư 3 nên đáp án 3.'],solution:tower,brute:towerBrute,tests:towerTests,randomInput(seed){const r=random(seed);return r(1,1000)+'\n';},hiddenHint:'Đừng đọc 2^(3^n) thành (2³)^n.'}
    ],
    exams:[
      {id:'khtn-2025-sodu',title:'SODU · Phần dư lũy thừa',note:'Dùng chu kỳ 4 của lũy thừa 2. Sau đó xét 3^N chia 4.',hint:'Không dựng tháp lũy thừa. Xét tính chẵn lẻ của N để tìm phần dư số mũ.',sourceNote:'KHTN · Tuyển sinh chuyên Tin 2025.'},
      {id:'haizuka-2024-favoritenum',title:'FAVORITENUM · Chữ số yêu thích',note:'Dùng phép dư để viết cách duyệt kiểm tra bội. Với N lớn, phải đếm bằng công thức.',hint:'Đếm N//X + N//Y − N//BCNN(X,Y). Phép dư giúp kiểm tra lời giải trên dữ liệu nhỏ.',sourceNote:'HaiZuka 2024 · Bộ luyện tác giả.'}
    ],
    remember:{items:['Lấy dư sau mỗi phép cộng hoặc nhân vẫn giữ đúng số dư cuối.','Dùng pow(a,b,m) khi b không âm và m dương.','Số dư lặp lại tạo chu kỳ; nhớ cả vị trí bắt đầu.','Không tự nhận chu kỳ là m−1; kiểm tra điều kiện hoặc tìm chu kỳ thật.','Mũ 0 cho 1%m; với m=1, mọi kết quả dư đều bằng 0.'],cost:'O(b) là b lượt nhân. Tìm chu kỳ dùng O(m) lượt và ô nhớ. Bình phương liên tiếp dùng O(log b) lượt.',pitfalls:['Chia / tạo số thực; lấy dư dùng %, chia nguyên dùng //.','Không giảm số mũ theo m nếu chưa chứng minh đó là chu kỳ.']},
    next:{text:'Khi N quá lớn, có thể đếm cả khối chữ số thay vì viết từng số không?',href:'2-5-chu-so-khoi.html',title:'Chữ số, chính phương và đếm theo khối'}
  };
})();
