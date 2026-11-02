(() => {
  'use strict';
  const header = 'import sys\ninput = sys.stdin.readline  # Đọc nhanh một dòng.\n';
  const readArray = header + 'n = int(input())\na = list(map(int, input().split()))\n';
  const pack = a => `${a.length}\n${a.join(' ')}\n`;
  function random(seed) {
    let state = seed >>> 0;
    return max => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % max; };
  }
  const arrays = [[2,1,2,0,2], [0], [7], [4,4], [1,2,3], [3,3,3,3], [0,1,0], [9,0,9,0], [2,1,2,1], [8,7,6,5], [1,2,3,4,1], Array.from({length:180}, (_,i) => i % 10)];
  const signed = arrays.map((a,i) => i % 2 ? a.map(x => x - 5) : a);
  const frequencySolution = readArray + `q = int(input())
queries = list(map(int, input().split()))
count = [0] * 10  # Một ô cho mỗi giá trị.
for x in a:
    count[x] += 1
for x in queries:
    print(count[x])
`;
  const frequencyBrute = readArray + `q = int(input())
queries = list(map(int, input().split()))
for x in queries:
    answer = 0
    for value in a:
        if value == x:
            answer += 1
    print(answer)
`;
  const freqInput = (a, queries) => pack(a) + `${queries.length}\n${queries.join(' ')}\n`;
  const freqTests = arrays.map(a => { const queries = [0,1,2,9]; return {input:freqInput(a,queries), output:queries.map(x => a.filter(v => v === x).length).join('\n') + '\n'}; });
  const modeSolution = readArray + `count = {}  # Lưu giá trị và số lần gặp.
for x in a:
    count[x] = count.get(x, 0) + 1  # Chưa gặp x thì get trả 0.
best = a[0]
for x in count:
    if count[x] > count[best]:
        best = x
    elif count[x] == count[best] and x < best:
        best = x
print(best, count[best])
`;
  const modeBrute = readArray + `best, most = a[0], 0
for x in a:
    times = 0
    for y in a:
        if x == y:
            times += 1
    if times > most or (times == most and x < best):
        best, most = x, times
print(best, most)
`;
  function modeAnswer(a) {
    const values = [...new Set(a)].sort((x,y) => x-y);
    let best = values[0], most = 0;
    for (const x of values) { const times = a.filter(y => y === x).length; if (times > most) { best = x; most = times; } }
    return `${best} ${most}\n`;
  }
  const pairSolution = readArray + `count = {}
answer = 0
for x in a:
    answer += count.get(x, 0)  # Ghép với những lần gặp trước.
    count[x] = count.get(x, 0) + 1  # Chưa gặp x thì get trả 0.
print(answer)
`;
  const pairBrute = readArray + `answer = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] == a[j]:
            answer += 1
print(answer)
`;
  function pairAnswer(a) { let answer = 0; for(let i=0;i<a.length;i++) for(let j=i+1;j<a.length;j++) if(a[i]===a[j]) answer++; return `${answer}\n`; }
  const distanceSolution = readArray + `last = {}  # Giữ vị trí gần nhất.
answer = n
for i, x in enumerate(a):  # enumerate cho vị trí và giá trị.
    if x in last:  # in kiểm tra đã gặp x.
        answer = min(answer, i - last[x])
    last[x] = i  # Luôn ghi lại vị trí mới.
print(-1 if answer == n else answer)
`;
  const distanceBrute = readArray + `answer = n
for i in range(n):
    for j in range(i + 1, n):
        if a[i] == a[j]:
            answer = min(answer, j - i)
print(-1 if answer == n else answer)
`;
  function distanceAnswer(a) { let best=a.length; for(let i=0;i<a.length;i++) for(let j=i+1;j<a.length;j++) if(a[i]===a[j]) best=Math.min(best,j-i); return `${best===a.length?-1:best}\n`; }
  const simCode = readArray + `count = [0] * 6
for x in a:
    count[x] += 1
print(*count)
`;
  const trace = `import io, sys, json
snapshots = []
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>' and frame.f_lineno == 6:
        values = frame.f_locals
        snapshots.append({'values': values['count'][:], 'line': 7 if 'x' in values else 5})
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
  const miniTests = [
    {input:'5\n2 1 2 0 2\n', output:'3\n'}, {input:'1\n0\n', output:'0\n'},
    {input:'3\n2 2 2\n', output:'3\n'}, {input:'2\n1 3\n', output:'0\n'}
  ];
  window.LESSON_DATA = {
    id:'1-1', slug:'1-1-tan-suat', title:'Mảng đếm và vị trí gần nhất', chapter:1,
    goal:'Biết cần nhớ số lần gặp hay vị trí gần nhất của mỗi giá trị.',
    prerequisite:'Em đã biết vòng lặp. Trong Python, vị trí đầu tiên có chỉ số 0.',
    warmup:[
      {question:'Dãy [4, 7, 4] có bao nhiêu số 4?',answer:'2',explanation:'Số 4 xuất hiện ở đầu và cuối.',hint:'Đánh dấu từng số 4 rồi đếm.'},
      {question:'Đánh số từ 0: hai số 4 trong [4, 7, 4] cách nhau bao nhiêu?',answer:'2',explanation:'Khoảng cách là 2 − 0 = 2.',hint:'Lấy vị trí sau trừ vị trí trước.'}
    ],
    story:{html:'<p>Đề KCNN tìm hai giá trị bằng nhau gần nhất.</p><p>Thử dãy [2, 1, 2, 2]. Gặp số 2 cuối, ta nên nhớ lần xuất hiện nào?</p>',question:'Hai số 2 gần nhất cách nhau bao nhiêu vị trí?',answer:'1',explanation:'Hai số 2 cuối đứng cạnh nhau.',hint:'So khoảng cách với từng số 2 trước đó.'},
    brute:{html:'<p>Thử mọi cặp vị trí là cách làm thẳng, gọi là “trâu”.</p><p>Cách này đúng nhưng hỏi lại nhiều cặp khi dãy dài.</p>',code:distanceBrute,input:'4\n2 1 2 2\n',output:'1\n',cost:'n × (n − 1) / 2 cặp',count(n){return {slow:n*(n-1)/2,fast:n,slowLabel:'Thử mọi cặp',fastLabel:'Nhớ vị trí · xấp xỉ n lượt'};}},
    idea:{html:'<p>Tần suất là số lần một giá trị xuất hiện. count[x] giữ số lần đã gặp x.</p><p>Mã nhỏ, không âm: dùng một dãy đếm. Mã lớn hoặc âm: dùng từ điển, tức bảng ghép giá trị với thông tin.</p><p>Cần khoảng cách thì lưu last[x], vị trí gần nhất. Vị trí cũ xa hơn không cho khoảng cách nhỏ hơn.</p>',examples:[
      {question:'Trong [2, 1, 2], count[2] bằng bao nhiêu?',answer:'2',explanation:'Mỗi lần gặp 2, tăng đúng một lần.'},
      {question:'Đã gặp ba số 5. Số 5 tiếp theo tạo thêm bao nhiêu cặp bằng nhau?',answer:'3',explanation:'Ghép số mới với từng số 5 đã có.'},
      {question:'Số 7 ở vị trí 0, 3, 5. Cặp gần nhất cách nhau bao nhiêu?',answer:'2',explanation:'Chỉ cần so 3−0 và 5−3.'}
    ]},
    simulation:{input:'5\n2 1 2 0 2\n',alternateInput:'4\n5 0 5 3\n',inputLabel:'Dòng đầu là n; dòng sau gồm n số từ 0 đến 5.',code:simCode,
      build(text) {
        const tokens=text.trim().split(/\s+/);
        if(tokens.some(x=>!/^\d+$/.test(x))) throw Error('Em nhập số nguyên không âm nhé.');
        const [n,...a]=tokens.map(Number);
        if(n<1||n>10||a.length!==n||a.some(x=>x>5)) throw Error('Nhập n từ 1 đến 10 và đủ n số từ 0 đến 5.');
        const count=Array(6).fill(0), labels=count.map((_,i)=>`count[${i}]`), states=[];
        const add=(line,current,note)=>states.push({values:count.slice(),labels:labels.slice(),roles:count.map((_,i)=>i===current?'current':'done'),roleLabels:count.map((_,i)=>i===current?'◎ Vừa tăng 1':'✓ Số lần đã đếm'),scene:{kind:'frequency',input:a.slice(),cursor:states.length-1,current},note,line,predict:'0'});
        add(5,-1,'Chưa đọc số nào nên mọi bộ đếm bằng 0.');
        a.forEach(x=>{count[x]++;add(7,x,`Vừa gặp ${x}: count[${x}] tăng thành ${count[x]}.`);});
        states.forEach((state,i)=>{if(i<a.length){const x=a[i];state.predict=String(state.values[x]+1);state.question=`Lần tới gặp ${x}, count[${x}] sẽ bằng bao nhiêu?`;}else{state.predict=String(count[a[n-1]]);state.question=`Đã xong: count[${a[n-1]}] bằng bao nhiêu?`;state.note+=' Đã đếm đủ dãy.';}});
        return states;
      },tracePython:trace},
    model:{code:simCode,input:'5\n2 1 2 0 2\n',output:'1 1 3 0 0 0\n'},
    activities:{
      output:{code:'count = {}\nfor x in [3, 1, 3]:\n    count[x] = count.get(x, 0) + 1  # Chưa gặp x thì get trả 0.\nprint(count[3])\n',input:'',answer:'2',explanation:'get(x, 0) trả 0 nếu chưa gặp x.'},
      parsons:{lines:['a = [2, 2, 1]','count = [0] * 3','for x in a:','    count[x] += 1','print(count[2])'],validOrders:[[0,1,2,3,4],[1,0,2,3,4]],output:'2'},
      blank:{prompt:'Điền lượng cần tăng khi vừa gặp số 2.',template:readArray+'count = 0\nfor x in a:\n    if x == 2:\n        count += ___\nprint(count)\n',answer:'1',tests:miniTests},
      bug:{prompt:'Code đếm số 2 nhưng quên một phần tử. Sửa đúng một dòng.',code:readArray+'count = 0\nfor i in range(1, n):\n    if a[i] == 2:\n        count += 1\nprint(count)\n',line:6,fix:'for i in range(n):',tests:miniTests}
    },
    problems:[
      {id:'1-1-frequency',title:'1. Hỏi số lần xuất hiện',level:'Khởi động',statement:'Cho dãy n số từ 0 đến 9. Mỗi câu hỏi cho x, hãy đếm số lần x xuất hiện.\n\nDữ liệu vào: dòng đầu n, dòng sau n số. Dòng thứ ba ghi q, dòng cuối ghi q giá trị cần hỏi.\n\nKết quả: mỗi câu hỏi in một dòng.',constraints:'1 ≤ n ≤ 2000; 1 ≤ q ≤ 100; 0 ≤ a[i], x ≤ 9.',sample:{...freqTests[0],explanation:'Số 0, 1, 2, 9 xuất hiện lần lượt 1, 1, 3, 0 lần.'},starter:readArray+'q = int(input())\nqueries = list(map(int, input().split()))\n# Đếm rồi trả lời các câu hỏi.\n',hints:['Mỗi câu hỏi cần xem lại cả dãy không?','Chuẩn bị 10 ô, mỗi ô đếm một giá trị.','Gặp x thì tăng count[x]; câu hỏi x chỉ đọc count[x].'],solution:frequencySolution,brute:frequencyBrute,tests:freqTests,randomInput(seed){const r=random(seed),a=Array.from({length:1+r(25)},()=>r(10));return freqInput(a,Array.from({length:1+r(8)},()=>r(10)));},hiddenHint:'Em thử giá trị vắng mặt, số 0 và dãy một số.'},
      {id:'1-1-mode',title:'2. Giá trị xuất hiện nhiều nhất',level:'Cơ bản',statement:'Tìm giá trị xuất hiện nhiều nhất trong dãy. Nếu hòa, chọn giá trị nhỏ nhất.\n\nDữ liệu vào: dòng đầu n, dòng sau n số nguyên.\n\nKết quả: in giá trị được chọn và số lần xuất hiện.',constraints:'1 ≤ n ≤ 2000; −10⁹ ≤ a[i] ≤ 10⁹.',sample:{input:pack([3,1,3,1,2]),output:'1 2\n',explanation:'Số 1 và 3 cùng xuất hiện hai lần; chọn 1.'},starter:readArray+'# Đếm từng giá trị rồi chọn đáp án.\n',hints:['Nếu hai số cùng nhiều lần, em chọn số nào?','Dùng từ điển vì giá trị có thể âm hoặc lớn.','So số lần trước; nếu bằng nhau, lấy giá trị nhỏ hơn.'],solution:modeSolution,brute:modeBrute,tests:signed.map(a=>({input:pack(a),output:modeAnswer(a)})),randomInput(seed){const r=random(seed);return pack(Array.from({length:1+r(25)},()=>r(11)-5));},hiddenHint:'Em thử hòa số lần, toàn số âm và n=1.'},
      {id:'1-1-equal-pairs',title:'3. Đếm cặp bằng nhau',level:'Cơ bản',statement:'Đếm các cặp vị trí i < j có a[i] = a[j]. Hai vị trí khác nhau được tính riêng.\n\nDữ liệu vào: dòng đầu n, dòng sau n số nguyên.\n\nKết quả: in số cặp.',constraints:'1 ≤ n ≤ 2000; −10⁹ ≤ a[i] ≤ 10⁹.',sample:{input:pack([2,2,2,1]),output:'3\n',explanation:'Ba số 2 tạo ba cặp vị trí.'},starter:readArray+'# Đếm mỗi cặp đúng một lần.\n',hints:['Số mới ghép được với những số nào trước đó?','Nếu đã gặp x đúng c lần, x mới tạo thêm c cặp.','Cộng count.get(x, 0) vào đáp án trước khi tăng bộ đếm.'],solution:pairSolution,brute:pairBrute,tests:signed.map(a=>({input:pack(a),output:pairAnswer(a)})),randomInput(seed){const r=random(seed);return pack(Array.from({length:1+r(30)},()=>r(9)-4));},hiddenHint:'Em thử n=1, mọi số giống nhau và không có số trùng.'},
      {id:'1-1-nearest',title:'4. Hai lần gần nhất',level:'Trung bình',statement:'Tìm khoảng cách nhỏ nhất giữa hai vị trí có giá trị bằng nhau. Không có cặp thì in −1.\n\nDữ liệu vào: dòng đầu n, dòng sau n số nguyên.\n\nKết quả: in khoảng cách nhỏ nhất.',constraints:'1 ≤ n ≤ 2000; −10⁹ ≤ a[i] ≤ 10⁹.',sample:{input:pack([7,1,7,2,7]),output:'2\n',explanation:'Hai lần liên tiếp của số 7 cách nhau hai vị trí.'},starter:readArray+'# Nhớ vị trí gần nhất của mỗi số.\n',hints:['Với vị trí mới, lần cũ gần nhất hay xa nhất tốt hơn?','Lưu last[x], rồi so i − last[x] khi gặp lại x.','Kiểm tra x in last; vị trí 0 vẫn hợp lệ. Sau đó luôn gán last[x] = i.'],solution:distanceSolution,brute:distanceBrute,tests:signed.map(a=>({input:pack(a),output:distanceAnswer(a)})),randomInput(seed){const r=random(seed);return pack(Array.from({length:1+r(30)},()=>r(13)-6));},hiddenHint:'Em thử trùng ở vị trí 0, trùng sát nhau và không trùng.'}
    ],
    exams:[
      {id:'khtn-2025-kcnn',title:'KCNN · Hai giá trị bằng nhau',note:'Nhớ vị trí gần nhất để tìm khoảng cách nhỏ nhất. Giá trị âm dùng được làm khóa từ điển.',hint:'<p>Ở vị trí i, chỉ lần xuất hiện gần nhất có thể cho khoảng cách tốt nhất.</p><p>Vị trí 0 hợp lệ; đừng kiểm tra nó như một giá trị đúng hoặc sai.</p>',sourceNote:''},
      {id:'hcm-2024-tuyetchieu',title:'TUYETCHIEU · Tuyệt chiêu',note:'Nhớ lượt dùng gần nhất của mỗi mã. So khoảng cách với thời gian phải chờ.',hint:'<p>Khoảng cách đúng k là hợp lệ. Nhỏ hơn k mới vi phạm.</p><p>Bài thật còn yêu cầu lấy mã vi phạm nhỏ nhất.</p>',sourceNote:'Đề TP.HCM; bản gốc không ghi cho phép Python, nên mã Python chỉ để luyện.'},
      {id:'khtn-2026-loto',title:'LOTO · Phân nhóm năng lực',note:'Nhiệm vụ 2 tìm các chuyên đề được chọn nhiều nhất. Mảng đếm theo mã giải riêng bước này.',hint:'<p>Cộng tần suất của mọi mã được đăng ký.</p><p>In các mã đạt tần suất lớn nhất theo thứ tự tăng dần. Phân nhóm học sinh là phần khác.</p>',sourceNote:'Một ràng buộc phần điểm nhỏ bị gạch; cần kiểm tra bản gốc.'}
    ],
    remember:{items:['Tần suất đếm số lần gặp một giá trị.','Mã nhỏ không âm: dùng mảng đếm.','Giá trị âm hoặc lớn: dùng từ điển.','Khoảng cách gần nhất: nhớ vị trí gần nhất.','Gặp lại thì xét đáp án trước khi ghi vị trí mới.'],cost:'O(n) viết gọn chi phí tăng theo n; từ điển có chi phí tra cứu trung bình.',pitfalls:['Vị trí 0 là vị trí thật, không phải “chưa thấy”.','Tăng bộ đếm trước khi đếm cặp sẽ ghép một số với chính nó.']},
    next:{text:'Nếu hỏi tổng cả đoạn, em cần nhớ gì thay vì đếm từng giá trị?',href:'1-2-tong-tien-to.html',title:'Tổng tiền tố'}
  };
})();
