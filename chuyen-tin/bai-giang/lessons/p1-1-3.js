(() => {
  'use strict';
  const header = 'import sys\ninput = sys.stdin.readline  # Đọc nhanh một dòng.\n';
  const readArray = header + 'n = int(input())\na = list(map(int, input().split()))\n';
  const pack = a => `${a.length}\n${a.join(' ')}\n`;
  function random(seed) { let state=seed>>>0; return max=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state%max;}; }
  const arrays = [[5,1,3,1], [0], [-5], [4,4], [3,2,1], [-3,-2,-1], [0,0,1], [-9,5,-9,5], [1000000000,-1000000000], [8,6,4,2], [2,3,2,3,2], Array.from({length:160},(_,i)=>(i*37)%101-50)];
  const sortSolution = readArray + 'a.sort()  # Sắp tăng, giữ cả các số trùng.\nprint(*a)\n';
  const sortBrute = readArray + `for i in range(n):
    smallest = i
    for j in range(i + 1, n):
        if a[j] < a[smallest]:
            smallest = j
    a[i], a[smallest] = a[smallest], a[i]
print(*a)
`;
  const gapSolution = readArray + `a.sort()
answer = a[1] - a[0]
for i in range(1, n):
    answer = min(answer, a[i] - a[i - 1])
print(answer)
`;
  const gapBrute = readArray + `answer = abs(a[1] - a[0])
for i in range(n):
    for j in range(i + 1, n):
        answer = min(answer, abs(a[i] - a[j]))
print(answer)
`;
  function gapAnswer(a) {let best=Infinity;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)best=Math.min(best,Math.abs(a[i]-a[j]));return `${best}\n`;}
  const budgetRead = header + 'n, budget = map(int, input().split())\na = list(map(int, input().split()))\n';
  const budgetSolution = budgetRead + `a.sort()
spent = count = 0
for price in a:
    if spent + price <= budget:
        spent += price
        count += 1
print(count)
`;
  const budgetBrute = budgetRead + `best = 0
for mask in range(1 << n):
    total = count = 0
    for i in range(n):
        if mask & (1 << i):
            total += a[i]
            count += 1
    if total <= budget:
        best = max(best, count)
print(best)
`;
  const budgetPack = (a,budget) => `${a.length} ${budget}\n${a.join(' ')}\n`;
  const budgetCases = [[[5,1,3],4],[[1],0],[[1],1],[[9],8],[[2,2,2],4],[[5,4,3,2,1],6],[[7,7],100],[[1,10,1],2],[[4,2,8],10],[[1000000000,1],1000000000],[Array(16).fill(3),24],[[1,2,3,4,5,6],0]];
  function budgetAnswer(a,budget) {let best=0;for(let mask=0;mask<2**a.length;mask++){let total=0,count=0;for(let i=0;i<a.length;i++)if(mask&(1<<i)){total+=a[i];count++;}if(total<=budget)best=Math.max(best,count);}return `${best}\n`;}
  const budgetTests=budgetCases.map(([a,b])=>({input:budgetPack(a,b),output:budgetAnswer(a,b)}));
  const scheduleRead=header+'n = int(input())\nmeetings = []  # Giữ từng cặp giờ.\nfor _ in range(n):\n    start, finish = map(int, input().split())\n    meetings.append((start, finish))  # Thêm cặp giờ bắt đầu, kết thúc.\n';
  const scheduleSolution=scheduleRead+`meetings.sort(key=lambda item: item[1])  # item[1] là giờ kết thúc để sắp.
end = 0
answer = 0
for start, finish in meetings:
    if start >= end:
        answer += 1
        end = finish
print(answer)
`;
  const scheduleBrute=scheduleRead+`best = 0
for mask in range(1 << n):
    chosen = [meetings[i] for i in range(n) if mask & (1 << i)]
    valid = True
    for i in range(len(chosen)):
        for j in range(i + 1, len(chosen)):
            a, b = chosen[i]
            c, d = chosen[j]
            if not (b <= c or d <= a):
                valid = False
    if valid:
        best = max(best, len(chosen))
print(best)
`;
  const schedulePack=a=>`${a.length}\n${a.map(x=>x.join(' ')).join('\n')}\n`;
  const scheduleCases=[[[0,4],[0,2],[2,3],[3,5]],[[0,1]],[[2,5],[0,2]],[[0,5],[1,4],[2,3]],[[1,2],[1,2]],[[0,1],[1,2],[2,3]],[[3,8],[0,4],[4,5],[5,6]],[[0,10],[1,2],[3,4],[5,6]],[[4,9],[0,3],[3,4]],[[5,7],[0,7],[7,9]],Array.from({length:14},(_,i)=>[i*2,i*2+1]),[[0,1000000000],[0,1],[1,999999999]]];
  function scheduleAnswer(a){let best=0;for(let mask=0;mask<2**a.length;mask++){let valid=true,count=0;for(let i=0;i<a.length;i++)if(mask&(1<<i)){count++;for(let j=0;j<i;j++)if((mask&(1<<j))&&!(a[i][1]<=a[j][0]||a[j][1]<=a[i][0]))valid=false;}if(valid)best=Math.max(best,count);}return `${best}\n`;}
  const trace=`import io, sys, json
snapshots = []
previous = 0
def trace(frame, event, arg):
    global previous
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        values = frame.f_locals
        if frame.f_lineno == 7:
            snapshots.append({'values': values['a'][:] + [values['spent'], values['count']], 'line': previous})
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
    id:'1-3',slug:'1-3-sap-xep-tham-lam',title:'Sắp xếp và chọn từng bước',chapter:1,
    goal:'Sắp xếp để nhìn cấu trúc, rồi giải thích vì sao lựa chọn từng bước không làm mất đáp án.',
    prerequisite:'Em biết duyệt dãy và so sánh. Trong Python, vị trí đầu tiên có chỉ số 0.',
    warmup:[
      {question:'Sắp tăng [5, 1, 3], số đầu tiên là gì?',answer:'1',explanation:'Số nhỏ nhất đứng đầu.',hint:'Tìm số nhỏ nhất trong ba số.'},
      {question:'Trong [1, 3, 5], hai số gần nhau nhất chênh bao nhiêu?',answer:'2',explanation:'1 và 3, hoặc 3 và 5, đều chênh 2.',hint:'So từng cặp đứng cạnh nhau.'}
    ],
    story:{html:'<p>Đề DIEM so tổng sức của các đội. Sắp các tổng sẽ làm lộ hai đầu nhỏ nhất, lớn nhất.</p><p>Với bài mua quà, thứ tự giá còn giúp quyết định món nào nên chọn trước.</p>',question:'Có 6 đồng, giá quà là [5, 1, 3, 2]. Em mua nhiều nhất bao nhiêu món?',answer:'3',explanation:'Chọn giá 1, 2, 3; tổng đúng 6.',hint:'Thử chọn từ món rẻ nhất.'},
    brute:{html:'<p>Muốn xếp giá tăng dần, mỗi lượt tìm món rẻ nhất trong phần chưa xếp.</p><p>Cách làm thẳng này so lại nhiều giá. Lệnh sắp xếp có sẵn giảm số lần so sánh.</p>',code:sortBrute,input:'4\n5 1 3 2\n',output:'1 2 3 5\n',cost:'n × (n − 1) / 2 phép so sánh',count(n){return {slow:n*(n-1)/2,fast:Math.ceil(n*Math.log2(Math.max(1,n))),slowLabel:'Tìm nhỏ nhất từng lượt',fastLabel:'Sắp xếp · xấp xỉ n × log₂n'};}},
    idea:{html:'<p>Sắp xếp đặt các giá trị theo thứ tự. “Tham lam” là chọn điều tốt nhất ngay ở bước đang xét.</p><p>Mua k món: k món rẻ nhất có tổng không lớn hơn bất kỳ cách chọn k món nào.</p><p>Đổi một món đắt lấy món rẻ chưa chọn không giảm số món. Vì vậy chọn lần lượt từ rẻ đến đắt là đúng.</p><p>Với lịch hẹn, chọn lịch kết thúc sớm nhất. Thay lịch đầu bằng lịch này không cản những lịch phía sau.</p>',examples:[
      {question:'Sắp [4, 1, 4], số 4 còn xuất hiện mấy lần?',answer:'2',explanation:'Sắp xếp đổi thứ tự, không xóa số trùng.'},
      {question:'Có 5 đồng, giá [4, 2, 3]. Mua tối đa mấy món?',answer:'2',explanation:'Giá 2 và 3 có tổng đúng 5.'},
      {question:'Các lịch [0,4], [0,2], [2,3] cho chọn tối đa mấy lịch không chồng nhau?',answer:'2',explanation:'Chọn [0,2] rồi [2,3]; kết thúc trùng lúc bắt đầu được phép.'}
    ]},
    simulation:{input:'4 6\n5 1 3 2\n',alternateInput:'5 5\n4 2 1 2 9\n',inputLabel:'Dòng đầu n và tiền; dòng sau n giá dương.',code:budgetSolution,
      build(text) {
        const tokens=text.trim().split(/\s+/);
        if(tokens.some(x=>!/^\d+$/.test(x)))throw Error('Nhập các số nguyên không âm.');
        const[n,budget,...a]=tokens.map(Number);
        if(n<1||n>10||a.length!==n||budget>999||a.some(x=>x<1||x>99))throw Error('Cần 1–10 giá từ 1 đến 99; tiền từ 0 đến 999.');
        const original=a.slice(), order=a.map((price,id)=>({price,id})).sort((x,y)=>x.price-y.price);
        a.sort((x,y)=>x-y);
        let spent=0,count=0;
        const chosen=[],states=[],labels=a.map((_,i)=>`giá ${i+1}`).concat(['đã tiêu','số món']);
        const add=(line,i,note)=>states.push({
          values:a.concat([spent,count]),labels:labels.slice(),
          roles:a.map((_,j)=>j===i?'current':j<i?(chosen.includes(j)?'done':'excluded'):'pending').concat(['done','done']),
          roleLabels:a.map((_,j)=>j>i?'… Chưa xét':chosen.includes(j)?'✓ Đã mua':'× Không mua').concat(['✓ Tiền đã tiêu','✓ Số món đã mua']),
          scene:{kind:'greedy',original:original.slice(),order:order.map(item=>item.id),budget,cursor:i,chosen:chosen.slice()},
          line,note,predict:'0'
        });
        add(6,-1,'Đã sắp giá tăng dần; chưa mua món nào.');
        a.forEach((price,i)=>{const bought=spent+price<=budget;if(bought){spent+=price;count++;chosen.push(i);}add(bought?10:8,i,bought?`Mua giá ${price}: đã tiêu ${spent}, có ${count} món.`:`Giá ${price} vượt tiền còn lại; bỏ qua.`);});
        states.forEach((state,i)=>{const next=i<a.length?state.values[n+1]+(state.values[n]+a[i]<=budget?1:0):count;state.predict=String(next);state.question=i<a.length?'Xét giá tiếp theo, số món đã mua sẽ bằng bao nhiêu?':'Đã xong: mua được bao nhiêu món?';if(i===a.length)state.note+=' Đã xét đủ các món.';});
        return states;
      },tracePython:trace},
    model:{code:budgetSolution,input:'4 6\n5 1 3 2\n',output:'3\n'},
    activities:{
      output:{code:'a = [4, 1, 4, 2]\na.sort()\nprint(a[1])\n',input:'',answer:'2',explanation:'Sau sắp xếp được [1, 2, 4, 4].'},
      parsons:{lines:['a = [5, 1, 3]','a.sort()','spent = 0','for price in a:','    spent += price','print(spent)'],validOrders:[[0,1,2,3,4,5],[0,2,1,3,4,5],[2,0,1,3,4,5]],output:'9'},
      blank:{prompt:'Điền số tiền phải cộng khi mua một món.',template:budgetSolution.replace('spent += price','spent += ___'),answer:'price',tests:budgetTests.slice(0,6)},
      bug:{prompt:'Chương trình mua ít món vì sắp xếp sai chiều. Sửa một dòng.',code:budgetSolution.replace('a.sort()','a.sort(reverse=True)'),line:5,fix:'a.sort()',tests:budgetTests.slice(0,6)}
    },
    problems:[
      {id:'1-3-sort',title:'1. Xếp dãy tăng dần',level:'Khởi động',statement:'Sắp các số từ nhỏ đến lớn, giữ nguyên số lần xuất hiện.\n\nDữ liệu vào: dòng đầu n, dòng sau n số nguyên.\n\nKết quả: in dãy đã sắp trên một dòng.',constraints:'1 ≤ n ≤ 2000; −10⁹ ≤ a[i] ≤ 10⁹.',sample:{input:pack([5,1,3,1]),output:'1 1 3 5\n',explanation:'Hai số 1 đều phải được giữ lại.'},starter:readArray+'# Sắp rồi in đủ các số.\n',hints:['Số nhỏ nhất cần đứng ở đâu?','Sắp xếp không được xóa số trùng.','Dùng a.sort(), rồi print(*a).'],solution:sortSolution,brute:sortBrute,tests:arrays.map(a=>({input:pack(a),output:a.slice().sort((x,y)=>x-y).join(' ')+'\n'})),randomInput(seed){const r=random(seed);return pack(Array.from({length:1+r(30)},()=>r(31)-15));},hiddenHint:'Em thử số trùng, số âm và n=1.'},
      {id:'1-3-gap',title:'2. Hai giá trị gần nhau nhất',level:'Cơ bản',statement:'Chọn hai vị trí khác nhau sao cho chênh lệch giá trị nhỏ nhất.\n\nDữ liệu vào: dòng đầu n, dòng sau n số nguyên.\n\nKết quả: in chênh lệch nhỏ nhất, luôn không âm.',constraints:'2 ≤ n ≤ 2000; −10⁹ ≤ a[i] ≤ 10⁹.',sample:{input:pack([8,1,5,3]),output:'2\n',explanation:'Cặp 1, 3 hoặc 3, 5 đều chênh 2.'},starter:readArray+'# Tìm chênh lệch nhỏ nhất.\n',hints:['Thử mọi cặp có thể làm lại nhiều so sánh.','Sau sắp tăng, chỉ cần so các số đứng cạnh nhau.','Nếu hai số không cạnh nhau, chênh lệch không nhỏ hơn khoảng cách với số nằm giữa.'],solution:gapSolution,brute:gapBrute,tests:arrays.filter(a=>a.length>=2).concat([[1,9],[0,0]]).map(a=>({input:pack(a),output:gapAnswer(a)})),randomInput(seed){const r=random(seed);return pack(Array.from({length:2+r(25)},()=>r(101)-50));},hiddenHint:'Em thử hai số, số trùng và dãy giảm.'},
      {id:'1-3-budget',title:'3. Mua nhiều món nhất',level:'Cơ bản',statement:'Có B đồng và n món, mỗi món chỉ mua một lần. Mua nhiều món nhất mà tổng tiền không vượt B.\n\nDữ liệu vào: dòng đầu n B, dòng sau n giá dương.\n\nKết quả: in số món lớn nhất.',constraints:'1 ≤ n ≤ 18; 0 ≤ B ≤ 10⁹; 1 ≤ giá ≤ 10⁹.',sample:{input:budgetPack([5,1,3,2],6),output:'3\n',explanation:'Mua giá 1, 2, 3, tổng đúng 6.'},starter:budgetRead+'# Chọn món theo một thứ tự tốt.\n',hints:['Muốn mua nhiều món, nên ưu tiên món rẻ hay đắt?','K món rẻ nhất rẻ hơn hoặc bằng mọi cách chọn k món.','Sắp tăng; cộng giá khi tổng mới chưa vượt B.'],solution:budgetSolution,brute:budgetBrute,tests:budgetTests,randomInput(seed){const r=random(seed);return budgetPack(Array.from({length:1+r(10)},()=>1+r(20)),r(70));},hiddenHint:'Em thử hết tiền, vừa đủ tiền và nhiều món cùng giá.'},
      {id:'1-3-meetings',title:'4. Chọn nhiều lịch hẹn',level:'Trung bình',statement:'Mỗi lịch có giờ bắt đầu s và kết thúc t, với s < t. Chọn nhiều lịch nhất không chồng nhau; lịch sau được bắt đầu đúng lúc lịch trước kết thúc.\n\nDữ liệu vào: dòng đầu n, sau đó n dòng s t.\n\nKết quả: in số lịch lớn nhất.',constraints:'1 ≤ n ≤ 16; 0 ≤ s < t ≤ 10⁹.',sample:{input:schedulePack(scheduleCases[0]),output:'3\n',explanation:'Chọn [0,2], [2,3], [3,5].'},starter:scheduleRead+'# Chọn theo giờ kết thúc.\n',hints:['Lịch kết thúc sớm để lại nhiều thời gian hơn hay ít hơn?','Thay lịch đầu bằng lịch kết thúc sớm nhất không cản các lịch phía sau.','Sắp theo t; nhận lịch khi s không nhỏ hơn giờ kết thúc đã chọn.'],solution:scheduleSolution,brute:scheduleBrute,tests:scheduleCases.map(a=>({input:schedulePack(a),output:scheduleAnswer(a)})),randomInput(seed){const r=random(seed);return schedulePack(Array.from({length:1+r(9)},()=>{const s=r(15);return[s,s+1+r(7)];}));},hiddenHint:'Em thử lịch sát nhau, trùng giờ kết thúc và một lịch bao hết.'}
    ],
    exams:[
      {id:'khtn-2025-diem',title:'DIEM · Chênh lệch tổng sức',note:'Sắp các tổng sức để lấy hai đầu là một cách đúng. Nhưng giữ số nhỏ nhất, lớn nhất còn gọn hơn.',hint:'<p>Tính m[i] + v[i] trước, không so riêng hai thành phần.</p><p>Bài này không cần giữ cả thứ tự; một lượt duyệt là đủ.</p>',sourceNote:''},
      {id:'csp-2025-hoi-thao',title:'Bài 2. Hội thao',note:'Sắp cân nặng giúp biết những bạn nào có thể ghép chung. Bài 1.4 sẽ đếm các cặp nhanh hơn.',hint:'<p>Nếu người nhẹ nhất ghép được với người nặng nhất, họ ghép được với mọi người ở giữa.</p><p>Đây là bước sau sắp xếp, không phải mua quà hay chọn lịch.</p>',sourceNote:'Đề tham khảo Chuyên Sư phạm 2025, không phải đề thi chính thức.'}
    ],
    remember:{items:['Sắp xếp đổi vị trí, không xóa dữ liệu.','Cặp gần giá trị nhất nằm cạnh nhau sau sắp.','Mua nhiều món: ưu tiên giá nhỏ nhất.','Chọn lịch: ưu tiên kết thúc sớm nhất.','Mỗi lựa chọn tham lam đều cần lý do đúng.'],cost:'O(n log n) là cách ghi chi phí sắp xếp; lượt chọn tiếp theo là O(n).',pitfalls:['Sắp dãy sẽ mất thứ tự ban đầu; lưu chỉ số nếu đề cần.','Chọn lịch bắt đầu sớm nhất có thể chặn nhiều lịch ngắn.']},
    next:{text:'Sau sắp xếp, có thể bỏ qua cả nhóm cặp mà không thử từng cặp không?',href:'1-4-hai-con-tro.html',title:'Hai con trỏ và cửa sổ trượt'}
  };
})();
