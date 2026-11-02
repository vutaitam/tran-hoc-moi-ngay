(() => {
  'use strict';
  const header='import sys\ninput = sys.stdin.readline  # Đọc nhanh một dòng.\n';
  const readWindow=header+'n, limit = map(int, input().split())\na = list(map(int, input().split()))\n';
  const pack=(a,k)=>`${a.length} ${k}\n${a.join(' ')}\n`;
  function random(seed){let state=seed>>>0;return max=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state%max;};}
  const longestSolution=readWindow+`left = total = best = 0; right = -1  # Chưa chọn đầu phải.
for right in range(n):
    total += a[right]
    while total > limit:
        total -= a[left]
        left += 1
    best = max(best, right - left + 1)
print(best)
`;
  const longestBrute=readWindow+`best = 0
for left in range(n):
    total = 0
    for right in range(left, n):
        total += a[right]
        if total <= limit:
            best = max(best, right - left + 1)
print(best)
`;
  const shortestSolution=readWindow+`left = total = 0
best = n + 1
for right in range(n):
    total += a[right]
    while total >= limit:
        best = min(best, right - left + 1)
        total -= a[left]
        left += 1
print(0 if best == n + 1 else best)
`;
  const shortestBrute=readWindow+`best = n + 1
for left in range(n):
    total = 0
    for right in range(left, n):
        total += a[right]
        if total >= limit:
            best = min(best, right - left + 1)
print(0 if best == n + 1 else best)
`;
  const pairSolution=readWindow+`a.sort()
left, right = 0, n - 1
answer = 0
while left < right:
    if a[left] + a[right] <= limit:
        answer += right - left
        left += 1
    else:
        right -= 1
print(answer)
`;
  const pairBrute=readWindow+`answer = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] + a[j] <= limit:
            answer += 1
print(answer)
`;
  const fixedRead=header+'n, k = map(int, input().split())\na = list(map(int, input().split()))\n';
  const fixedSolution=fixedRead+`total = sum(a[:k])
best = total  # Nhận đoạn đầu, kể cả tổng âm.
for right in range(k, n):
    total += a[right] - a[right - k]
    best = max(best, total)
print(best)
`;
  const fixedBrute=fixedRead+`best = None
for left in range(n - k + 1):
    total = 0
    for i in range(left, left + k):
        total += a[i]
    if best is None or total > best:
        best = total
print(best)
`;
  const positiveCases=[[[2,1,3,1,1],4],[[0],0],[[5],4],[[5],5],[[0,0,0],0],[[1,1,1],2],[[9,1,1,1],3],[[1,1,8,1,1],4],[[0,2,0,2,0],2],[[1000000000,1000000000],1000000000],[[5,6,7],1],[Array.from({length:200},(_,i)=>i%5),30]];
  function longestAnswer(a,limit){let best=0;for(let l=0;l<a.length;l++){let total=0;for(let r=l;r<a.length;r++){total+=a[r];if(total<=limit)best=Math.max(best,r-l+1);}}return `${best}\n`;}
  function shortestAnswer(a,limit){let best=a.length+1;for(let l=0;l<a.length;l++){let total=0;for(let r=l;r<a.length;r++){total+=a[r];if(total>=limit)best=Math.min(best,r-l+1);}}return `${best>a.length?0:best}\n`;}
  function pairAnswer(a,limit){let result=0;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]+a[j]<=limit)result++;return `${result}\n`;}
  const longestTests=positiveCases.map(([a,k])=>({input:pack(a,k),output:longestAnswer(a,k)}));
  const shortestCases=positiveCases.map(([a,k])=>[a,Math.max(1,k)]);
  const fixedCases=[[[2,-5,4,3,-1,2],3],[[-7],1],[[0],1],[[-5,-2,-8],2],[[1,2,3],1],[[1,2,3],3],[[0,0,0],2],[[4,-4,4,-4],2],[[1000000000,1000000000],2],[[-1,0,-1],2],[[9,-9,2,3],2],[Array.from({length:200},(_,i)=>i%11-5),27]];
  function fixedAnswer(a,k){let best=-Infinity;for(let l=0;l+k<=a.length;l++){let sum=0;for(let i=l;i<l+k;i++)sum+=a[i];best=Math.max(best,sum);}return `${best}\n`;}
  const trace=`import io, sys, json
snapshots = []
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>' and frame.f_lineno == 6:
        values = frame.f_locals
        right = values['right']
        snapshots.append({'values': values['a'][:] + [values['left'], right, values['total'], values['best']], 'line': 5 if right == -1 else 11})
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
    id:'1-4',slug:'1-4-hai-con-tro',title:'Hai con trỏ và cửa sổ trượt',chapter:1,
    goal:'Giữ một đoạn đang xét, thêm bên phải và bỏ bên trái khi điều kiện cho phép.',
    prerequisite:'Em biết tổng đoạn, sắp xếp và chỉ số bắt đầu từ 0 trong Python.',
    warmup:[
      {question:'Tổng [2, 1, 3] là bao nhiêu?',answer:'6',explanation:'2 + 1 + 3 = 6.',hint:'Cộng cả ba số.'},
      {question:'Bỏ số 2 đầu đoạn, tổng còn bao nhiêu?',answer:'4',explanation:'Lấy tổng cũ 6 trừ số bị bỏ 2.',hint:'Không cần cộng lại từ đầu.'}
    ],
    story:{html:'<p>Trong đề Bài tập về nhà, Quân chọn một đoạn bài liên tiếp để làm.</p><p>Mỗi bài cần thời gian dương. Chọn nhiều bài nhất mà tổng thời gian không vượt thời gian có sẵn.</p>',question:'Có 4 phút, thời gian [2, 1, 3, 1, 1]. Chọn được nhiều nhất mấy bài liên tiếp?',answer:'2',explanation:'Các đoạn ba bài đều vượt 4; đoạn [3, 1] vừa đủ.',hint:'Không được bỏ một bài ở giữa đoạn.'},
    brute:{html:'<p>Thử mỗi điểm đầu, rồi cộng dần đến từng điểm cuối.</p><p>Cách này đúng nhưng nhiều đoạn dùng lại gần hết các số đã cộng.</p>',code:longestBrute,input:'5 4\n2 1 3 1 1\n',output:'2\n',cost:'n × (n + 1) / 2 phép cộng',count(n){return {slow:n*(n+1)/2,fast:2*n,slowLabel:'Cộng lại từng đoạn',fastLabel:'Cửa sổ · tối đa 2n lần thêm, bỏ'};}},
    idea:{html:'<p>“Cửa sổ” là đoạn liên tiếp đang xét. Hai con trỏ left, right đánh dấu hai đầu đoạn.</p><p>Với số không âm, thêm bên phải không làm tổng giảm; bỏ bên trái không làm tổng tăng.</p><p>Đó là tính đơn điệu: giá trị chỉ đổi theo một hướng. Khi tổng quá lớn, bỏ đầu trái đến khi vừa đủ.</p><p>Nếu có số âm, cách co đoạn theo tổng này có thể sai. Ví dụ [5, −4] đạt giới hạn 1 dù số đầu vượt 1.</p><p>Đoạn dài cố định k vẫn trượt được với số âm. Ta luôn bỏ đúng một số và thêm đúng một số.</p>',examples:[
      {question:'Đoạn [2, 1, 3] vượt giới hạn 4. Bỏ số 2, tổng còn bao nhiêu?',answer:'4',explanation:'Đầu trái đi tới một ô; tổng mới bằng 6−2.'},
      {question:'Có 0 phút, dãy [0, 0, 1]. Đoạn hợp lệ dài nhất có mấy số?',answer:'2',explanation:'Hai số 0 vẫn là một đoạn hợp lệ.'},
      {question:'Dãy [−5, −2, −8], đoạn dài đúng 2 có tổng lớn nhất là bao nhiêu?',answer:'-7',explanation:'Hai tổng là −7 và −10; không chọn tổng 0.'}
    ]},
    simulation:{input:'5 4\n2 1 3 1 1\n',alternateInput:'5 2\n0 2 0 2 0\n',inputLabel:'Dòng đầu n và giới hạn; dòng sau n số không âm.',code:longestSolution,
      build(text){const tokens=text.trim().split(/\s+/);if(tokens.some(x=>!/^\d+$/.test(x)))throw Error('Mô phỏng này chỉ nhận số nguyên không âm.');const[n,limit,...a]=tokens.map(Number);if(n<1||n>10||a.length!==n||limit>999||a.some(x=>x>99))throw Error('Cần 1–10 số từ 0 đến 99; giới hạn từ 0 đến 999.');let left=0,total=0,best=0;const states=[],labels=a.map((_,i)=>`a[${i}]`).concat(['left','right','tổng','dài nhất']);const add=(right,line,note)=>states.push({values:a.concat([left,right,total,best]),labels:labels.slice(),roles:a.map((_,i)=>i<left?'excluded':i===right?'current':i>right?'pending':'done').concat(['source','source','done','current']),roleLabels:a.map((_,i)=>i<left?'× Đã rời cửa sổ':i===right?'◎ Vừa thêm':i>right?'… Chưa xét':'✓ Giữ trong cửa sổ').concat(['↗ Đầu trái','↗ Đầu phải','✓ Tổng cửa sổ','◎ Dài nhất đã gặp']),scene:{kind:'window',limit},line,note,predict:'0'});add(-1,5,'Chưa chọn số nào; độ dài tốt nhất bằng 0.');a.forEach((x,right)=>{total+=x;let removed=0;while(total>limit){total-=a[left++];removed++;}best=Math.max(best,right-left+1);add(right,11,`Thêm ${x}, bỏ ${removed} số đầu: tổng ${total}, dài nhất ${best}.`);});states.forEach((state,i)=>{state.predict=String(i+1<states.length?states[i+1].values[n+3]:best);state.question=i<a.length?'Sau lượt tới, độ dài tốt nhất bằng bao nhiêu?':'Đã xong: độ dài tốt nhất bằng bao nhiêu?';if(i===a.length)state.note+=' Đã xét đủ dãy.';});return states;},tracePython:trace},
    model:{code:longestSolution,input:'5 4\n2 1 3 1 1\n',output:'2\n'},
    activities:{
      output:{code:'a = [2, 1, 3, 4]\ntotal = sum(a[:2])\ntotal += a[2] - a[0]\nprint(total)\n',input:'',answer:'4',explanation:'Cửa sổ đổi từ [2,1] sang [1,3].'},
      parsons:{lines:['a = [2, 1, 3]','total = sum(a[:2])','total -= a[0]','total += a[2]','print(total)'],validOrders:[[0,1,2,3,4],[0,1,3,2,4]],output:'4'},
      blank:{prompt:'Điền độ dài đoạn từ left đến right, lấy cả hai đầu.',template:longestSolution.replace('best = max(best, right - left + 1)','best = max(best, ___)'),answer:'right - left + 1',tests:longestTests.slice(0,6)},
      bug:{prompt:'Đoạn có tổng đúng giới hạn vẫn được phép. Sửa điều kiện đang bỏ quá nhiều.',code:longestSolution.replace('while total > limit:','while left <= right and total >= limit:'),line:8,fix:'    while total > limit:',tests:longestTests.slice(0,6)}
    },
    problems:[
      {id:'1-4-longest',title:'1. Đoạn dài nhất vừa giới hạn',level:'Khởi động',statement:'Cho dãy số không âm. Tìm đoạn liên tiếp dài nhất có tổng không vượt S. Không chọn được số nào thì in 0.\n\nDữ liệu vào: dòng đầu n S, dòng sau n số.\n\nKết quả: in độ dài lớn nhất.',constraints:'1 ≤ n ≤ 2000; 0 ≤ S, a[i] ≤ 10⁹.',sample:{...longestTests[0],explanation:'Đoạn [3,1] có tổng 4 và độ dài 2.'},starter:readWindow+'# Giữ đoạn có tổng không vượt limit.\n',hints:['Số không âm giúp tổng đổi thế nào khi thêm hoặc bỏ?','Mỗi lần thêm bên phải, bỏ bên trái khi tổng vượt S.','Sau khi co xong, lấy độ dài right − left + 1. Mỗi đầu chỉ đi tới.'],solution:longestSolution,brute:longestBrute,tests:longestTests,randomInput(seed){const r=random(seed);return pack(Array.from({length:1+r(30)},()=>r(11)),r(35));},hiddenHint:'Em thử S=0, nhiều số 0 và không chọn được số nào.'},
      {id:'1-4-shortest',title:'2. Đoạn ngắn nhất đạt mục tiêu',level:'Cơ bản',statement:'Cho dãy số không âm và S dương. Tìm đoạn liên tiếp ngắn nhất có tổng ít nhất S. Không có đoạn thì in 0.\n\nDữ liệu vào: dòng đầu n S, dòng sau n số.\n\nKết quả: in độ dài nhỏ nhất.',constraints:'1 ≤ n ≤ 2000; 1 ≤ S ≤ 10⁹; 0 ≤ a[i] ≤ 10⁹.',sample:{input:pack([2,1,3,1,1],4),output:'2\n',explanation:'Đoạn [1,3] đủ tổng 4; không có số riêng lẻ đạt 4.'},starter:readWindow+'# Thu ngắn khi tổng đã đạt mục tiêu.\n',hints:['Khi tổng đã đủ, bỏ bên trái có thể cho đoạn tốt hơn không?','Ghi đáp án trước mỗi lần bỏ, khi tổng vẫn ít nhất S.','Nếu chưa gặp đoạn nào, in 0. S dương giúp đoạn rỗng không bao giờ hợp lệ.'],solution:shortestSolution,brute:shortestBrute,tests:shortestCases.map(([a,k])=>({input:pack(a,k),output:shortestAnswer(a,k)})),randomInput(seed){const r=random(seed);return pack(Array.from({length:1+r(30)},()=>r(11)),1+r(60));},hiddenHint:'Em thử không đủ tổng, một số đủ và nhiều số 0.'},
      {id:'1-4-pairs',title:'3. Đếm cặp vừa giới hạn',level:'Cơ bản',statement:'Đếm các cặp vị trí i < j có a[i] + a[j] không vượt P. Hai số bằng nhau ở hai vị trí vẫn là hai phần tử riêng.\n\nDữ liệu vào: dòng đầu n P, dòng sau n số không âm.\n\nKết quả: in số cặp.',constraints:'1 ≤ n ≤ 2000; 0 ≤ P, a[i] ≤ 10⁹.',sample:{input:pack([1,2,3,4],5),output:'4\n',explanation:'Bốn cặp giá trị: (1,2), (1,3), (1,4), (2,3).'},starter:readWindow+'# Sắp xếp rồi xét hai đầu dãy.\n',hints:['Sắp tăng để tổng lớn, nhỏ có thứ tự rõ ràng.','Nếu a[left]+a[right] vừa đủ, mọi đối tác ở giữa đều ghép được với left.','Cộng right−left rồi tăng left; nếu tổng quá lớn, giảm right. Chỉ chạy khi left < right.'],solution:pairSolution,brute:pairBrute,tests:positiveCases.map(([a,k])=>({input:pack(a,k),output:pairAnswer(a,k)})),randomInput(seed){const r=random(seed);return pack(Array.from({length:1+r(30)},()=>r(20)),r(40));},hiddenHint:'Em thử n=1, số trùng và mọi cặp đều hợp lệ.'},
      {id:'1-4-fixed',title:'4. Trượt đoạn dài đúng k',level:'Trung bình',statement:'Chọn đúng k số liên tiếp để tổng lớn nhất. Bài này cho phép số âm.\n\nDữ liệu vào: dòng đầu n k, dòng sau n số nguyên.\n\nKết quả: in tổng lớn nhất.',constraints:'1 ≤ k ≤ n ≤ 2000; −10⁹ ≤ a[i] ≤ 10⁹.',sample:{...{input:pack(fixedCases[0][0],3),output:'6\n'},explanation:'Đoạn [4,3,−1] có tổng 6.'},starter:fixedRead+'# Mỗi bước thêm một số, bỏ một số.\n',hints:['Hai đoạn dài k liên tiếp khác nhau ở những số nào?','Lấy tổng cũ trừ số rời đoạn rồi cộng số mới. Đáp án ban đầu phải là tổng đoạn đầu.','Độ dài cố định nên số âm không làm hỏng bước trượt này.'],solution:fixedSolution,brute:fixedBrute,tests:fixedCases.map(([a,k])=>({input:pack(a,k),output:fixedAnswer(a,k)})),randomInput(seed){const r=random(seed),n=1+r(30);return pack(Array.from({length:n},()=>r(21)-10),1+r(n));},hiddenHint:'Em thử k=1, k=n và dãy toàn âm.'}
    ],
    exams:[
      {id:'brvt-2025-minhhoa-bai3',title:'BAI3 · Bài tập về nhà',note:'Thời gian dương nên cửa sổ co được khi tổng vượt thời gian có sẵn. Giữ độ dài lớn nhất.',hint:'<p>Thêm bài ở bên phải rồi bỏ đầu trái khi quá giờ.</p><p>Không đủ làm một bài thì đáp án bằng 0.</p>',sourceNote:'Đây là đề minh họa từ năm học 2025–2026, không phải đề chính thức năm 2025.'},
      {id:'csp-2024-tro-choi',title:'Câu 3. Trò chơi',note:'Bài thật yêu cầu mọi đoạn dài k đủ tổng, không phải chỉ một đoạn. Hãy tìm đoạn thiếu tổng dài nhất.',hint:'<p>Các số dương giúp tìm đoạn tổng nhỏ hơn m dài nhất bằng cửa sổ.</p><p>Độ dài trả lời lớn hơn độ dài đó một đơn vị, khi tổng cả dãy đủ m.</p>',sourceNote:''},
      {id:'khanhhoa-2024-bai3',title:'BAI3 · Bài 3 — Dãy con k phần tử',note:'Trượt đoạn dài k để cập nhật tổng và số chẵn. Số âm vẫn dùng được vì độ dài cố định.',hint:'<p>Ưu tiên tổng lớn nhất, rồi nhiều số chẵn nhất, rồi vị trí sớm nhất.</p><p>Hòa hoàn toàn thì giữ đoạn cũ.</p>',sourceNote:'Tên mô tả chủ đề do ngân hàng thêm; bản gốc ghi Bài 3.'}
    ],
    remember:{items:['Cửa sổ là một đoạn liên tiếp.','Co theo tổng cần số không âm và điều kiện đơn điệu.','Mỗi đầu chỉ đi một chiều, không quay lại.','Đếm cặp hai đầu cần sắp xếp trước.','Trượt độ dài cố định vẫn dùng với số âm.'],cost:'O(n) nghĩa là số bước tăng theo n; đếm cặp có sắp xếp cần O(n log n).',pitfalls:['Có số âm: đoạn từng quá lớn có thể nhỏ lại, nên không bỏ đầu trái tùy ý.','Tìm đoạn ngắn nhất: ghi đáp án trước khi bỏ số đầu.']},
    next:{text:'Nếu đáp án là một giới hạn, em có thể thử ít giá trị hơn không?',href:'1-5-tim-kiem-nhi-phan.html',title:'Tìm kiếm nhị phân'}
  };
})();
