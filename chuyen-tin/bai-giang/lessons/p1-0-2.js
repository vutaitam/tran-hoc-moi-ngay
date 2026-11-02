(() => {
  'use strict';
  const py = body => 'import sys\ninput = sys.stdin.readline  # đọc nhanh hơn, em cứ chép nguyên\n' + body;
  const rng = seed => {let state=(Number(seed)>>>0)||1;return (lo,hi)=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return lo+state%(hi-lo+1);};};
  const test = (input,output) => ({input,output:String(output)});
  const readArray = 'n = int(input())\na = []\nwhile len(a) < n:\n    a.extend(map(int, input().split()))\n';
  const sumCode=py(readArray+'total = 0\nfor value in a:\n    total += value\nprint(total)\n');
  const sumBrute=py('tokens = list(map(int, sys.stdin.read().split()))\nn = tokens[0]\nprint(sum(tokens[1:n + 1]))\n');
  const strength=py('n = int(input())\nm, v = map(int, input().split())\nlow = high = m + v\nfor i in range(n - 1):\n    m, v = map(int, input().split())\n    total = m + v\n    low = min(low, total)\n    high = max(high, total)\nprint(high - low)\n');
  const strengthBrute=py('n = int(input())\na = []\nfor i in range(n):\n    m, v = map(int, input().split())\n    a.append(m + v)\nanswer = 0\nfor x in a:\n    for y in a:\n        answer = max(answer, x - y)\nprint(answer)\n');
  const boxes=py('n, k = map(int, input().split())\nprint((n + k - 1) // k)\n');
  const boxesBrute=py('n, k = map(int, input().split())\nwhole, rest = divmod(n, k)\nif rest != 0:\n    whole += 1\nprint(whole)\n');
  const reverse=py(readArray+'print(*a[::-1])  # In từ cuối về đầu.\n');
  const reverseBrute=py('tokens = list(map(int, sys.stdin.read().split()))\nn = tokens[0]\nanswer = []\nfor i in range(n, 0, -1):\n    answer.append(tokens[i])\nprint(*answer)\n');
  function arrayInput(a,width=3){const lines=[];for(let i=0;i<a.length;i+=width)lines.push(a.slice(i,i+width).join(' '));return `${a.length}\n${lines.join('\n')}\n`;}
  const arrays=[[0],[7],[-9],[1,-1],[1000000000000000000n,1000000000000000000n],[-1000000000000000000n,1n],[2,3,4],[9,8,7,6],[0,0,0],[-4,-2,-7],[1,2,3,4,5],Array.from({length:300},(_,i)=>i%2?i:-i)];
  const sumTests=arrays.map((a,i)=>test(arrayInput(a,i%4+1),a.reduce((s,x)=>s+BigInt(x),0n)));
  const reverseTests=arrays.map((a,i)=>test(arrayInput(a,i%4+1),a.slice().reverse().join(' ')));
  const teamCases=[[[0,0]],[[4,3]],[[1,2],[3,4]],[[0,0],[1000000000,1000000000]],[[5,5],[5,5]],[[9,0],[0,9],[2,2]],[[1,1],[2,2],[3,3]],[[8,3],[0,0]],[[2,8],[4,9]],[[0,1],[0,2],[0,3]],Array.from({length:80},(_,i)=>[i,2*i]),[[1000000000000000000n,1000000000000000000n],[1,2]]];
  const strengthTests=teamCases.map(a=>{const sums=a.map(([m,v])=>BigInt(m)+BigInt(v));const low=sums.reduce((a,b)=>a<b?a:b),high=sums.reduce((a,b)=>a>b?a:b);return test(`${a.length}\n${a.map(p=>p.join(' ')).join('\n')}\n`,high-low);});
  const boxCases=[[0n,1n],[1n,1n],[1n,3n],[2n,3n],[3n,3n],[4n,3n],[9n,4n],[10n,5n],[1000000000000000000n,3n],[999999999999999999n,7n],[17n,100n],[1000000000000000000n,1000000000000000000n]];
  const boxTests=boxCases.map(([n,k])=>test(`${n} ${k}\n`,n/k+(n%k?1n:0n)));
  const simCode=py('n = int(input())\nlow = high = None\nfor row in range(1, n + 1):\n    m, v = map(int, input().split())\n    total = m + v\n    if low is None:\n        low = high = total\n    else:\n        low = min(low, total)\n        high = max(high, total)\n    gap = high - low\n    print(gap)\n');
  const simLine=simCode.split('\n').findIndex(l=>l.trim()==='gap = high - low')+1;
  const tracePython=`import sys, io, json, contextlib\nrecords = []\nprevious = None\ndef trace(frame, event, arg):\n    global previous\n    if frame.f_code.co_filename != '<simulation>':\n        return trace\n    if event in ('line', 'return'):\n        if previous == ${simLine}:\n            v = frame.f_locals\n            records.append({'values': [v['row'], v['total'], v['low'], v['high'], v['gap']], 'line': ${simLine}})\n        previous = frame.f_lineno if event == 'line' else None\n    return trace\nsys.stdin = io.StringIO(text)\nwith contextlib.redirect_stdout(io.StringIO()):\n    sys.settrace(trace)\n    try:\n        exec(compile(source, '<simulation>', 'exec'), {})\n    finally:\n        sys.settrace(None)\nprint(json.dumps(records))\n`;
  window.LESSON_DATA={
    id:'0-2',slug:'0-2-vao-ra',title:'Đọc, in và thử biên',chapter:0,
    goal:'Đọc đủ dữ liệu, in đúng yêu cầu và giữ chính xác số nguyên lớn.',
    prerequisite:'Biết biến, danh sách và vòng lặp for.',
    warmup:[
      {question:'Python đọc "12" bằng input(). Dùng lệnh nào để đổi thành số nguyên?',answer:'int',explanation:'int đổi chữ biểu diễn số nguyên thành số để tính.',hint:'Tên lệnh có ba chữ, xuất hiện trong int(input()).'},
      {question:'Dãy chỉ có một số 8. Lớn nhất trừ nhỏ nhất bằng bao nhiêu?',answer:'0',explanation:'Cùng là số 8 nên hiệu bằng 0.',hint:'Đừng lấy 0 làm số nhỏ nhất ban đầu.'}
    ],
    story:{html:'<p>Đề DIEM tính tổng sức của mỗi đội từ hai số. Sau đó lấy tổng lớn nhất trừ tổng nhỏ nhất.</p><p>Ba đội có số liệu (2,3), (4,5), (1,2).</p>',question:'Chênh lệch tổng sức là bao nhiêu?',answer:'6',explanation:'Các tổng là 5, 9, 3; lấy 9 − 3 = 6.',hint:'Cộng hai số trên từng dòng trước.'},
    brute:{html:'<p>Cách trực tiếp là lưu mọi tổng rồi so từng cặp.</p><p>Nếu chỉ cần lớn nhất và nhỏ nhất, không cần thử mọi cặp.</p>',code:strengthBrute,input:'3\n2 3\n4 5\n1 2\n',output:'6',cost:'khoảng n × n lần so',count(n){return {slow:n*n,fast:2*(n-1),slowLabel:'So mọi cặp tổng sức',fastLabel:'Cập nhật nhỏ nhất và lớn nhất'};}},
    idea:{html:'<p>input() đọc một dòng; split() tách các mục; int đổi mỗi mục thành số nguyên.</p><p>Biết n dòng thì đọc đúng n lần. Nếu n số nằm trên nhiều dòng, đọc tiếp đến khi đủ.</p><p>a.extend(...) thêm các số vừa đọc vào danh sách a.</p><p>Python giữ chính xác số nguyên lớn. Dùng // để chia nguyên; tránh đổi qua số thập phân.</p><p>None nghĩa là chưa có giá trị; is None kiểm tra trạng thái ấy.</p><p>Mô phỏng và code mẫu in hiệu sau từng đội để theo dõi. Bản nộp ở sân tập chỉ in hiệu cuối.</p><p>Test là một bộ dữ liệu kiểm tra. Biên là trường hợp dễ sai, như n=1, số 0 hoặc các số bằng nhau.</p>',examples:[
      {question:'Dòng "8 12" có mấy số sau khi tách?',answer:'2',explanation:'Khoảng trắng ngăn hai mục 8 và 12.'},
      {question:'7 đồ vật, hộp chứa 3 đồ vật: cần mấy hộp?',answer:'3',explanation:'Hai hộp đầy và một hộp chứa đồ còn lại.'},
      {question:'Hai số nguyên 10^18 và 1 cộng lại bằng bao nhiêu?',answer:'1000000000000000001',explanation:'Python cộng số nguyên chính xác; không cần đổi thành số thập phân.'}
    ]},
    simulation:{input:'3\n2 3\n4 5\n1 2',alternateInput:'4\n0 0\n9 8\n1 1\n2 3',inputLabel:'n (1–6), rồi n dòng hai số từ 0 đến 99',code:simCode,
      build(text){
        const lines=text.trim().split(/\n/).map(s=>s.trim());
        if(!/^\d+$/.test(lines[0]||''))throw Error('Dòng đầu cần ghi n từ 1 đến 6.');
        const n=Number(lines[0]);if(n<1||n>6||lines.length!==n+1)throw Error('Cần n từ 1 đến 6 và đúng n dòng số liệu.');
        const rows=lines.slice(1).map(line=>{const p=line.split(/\s+/);if(p.length!==2||p.some(x=>!/^\d+$/.test(x)||Number(x)>99))throw Error('Mỗi đội cần hai số từ 0 đến 99.');return p.map(Number);});
        let low=null,high=null;
        const states=rows.map(([m,v],i)=>{const total=m+v;low=low===null?total:Math.min(low,total);high=high===null?total:Math.max(high,total);return {values:[i+1,total,low,high,high-low],labels:['Đội','Tổng sức','Nhỏ nhất','Lớn nhất','Chênh lệch'],roles:['done','done','source','source','current'],roleLabels:['✓ Đội vừa đọc','✓ Tổng vừa tính','↗ Đầu nhỏ nhất','↗ Đầu lớn nhất','◎ Hiệu vừa tính'],line:simLine,scene:{kind:'read-rows',rows:rows.map(pair=>pair.slice()),row:i}};});
        return states.map((s,i)=>({...s,question:i+1<n?'Sau đội tiếp theo, chênh lệch lớn nhất trừ nhỏ nhất bằng bao nhiêu?':'Chênh lệch cuối bằng bao nhiêu?',note:i+1<n?`Đội tiếp theo có tổng ${rows[i+1][0]+rows[i+1][1]}. Giữ hoặc đổi hai đầu rồi tính hiệu.`:'Đã đọc đủ đội; chênh lệch cuối ở ô bên phải.',predict:String(states[Math.min(i+1,n-1)].values[4])}));
      },tracePython},
    model:{code:simCode,input:'3\n2 3\n4 5\n1 2\n',output:'0\n4\n6'},
    activities:{
      output:{code:'a = [9, 9, 9]\nprint(max(a) - min(a))\n',input:'',answer:'0',explanation:'Lớn nhất và nhỏ nhất cùng bằng 9.'},
      parsons:{lines:['a = [2, 5, 8]','total = 0','for value in a:','    total += value','print(total)'],validOrders:[[0,1,2,3,4],[1,0,2,3,4]],output:'15'},
      blank:{prompt:'Điền số hộp ít nhất, mỗi hộp chứa tối đa k đồ vật.',template:py('n, k = map(int, input().split())\nprint(___)\n'),answer:'(n + k - 1) // k',tests:boxTests},
      bug:{prompt:'Chương trình phải cộng đủ n số; đang bỏ mất số cuối.',code:py(readArray+'total = 0\nfor i in range(n - 1):\n    total += a[i]\nprint(total)\n'),line:8,fix:'for i in range(n):',tests:sumTests}
    },
    problems:[
      {id:'0-2-read-sum',title:'Đọc đủ rồi cộng',level:'Khởi động',statement:'Đọc n số nguyên và in tổng. Các số có thể nằm trên nhiều dòng.\n\nDữ liệu vào: dòng đầu là n; các dòng sau chứa đúng n số.\n\nKết quả: tổng của n số.',constraints:'1 ≤ n ≤ 300; |a[i]| ≤ 10^18; không có dòng trống.',sample:{input:'4\n2 -1\n5 3\n',output:'9',explanation:'2 − 1 + 5 + 3 = 9.'},starter:py('n = int(input())\n# Đọc tiếp cho đến khi đủ n số.\n'),hints:['Một lần đọc chỉ lấy một dòng.','Dùng danh sách và thêm các số vừa đọc.','Khi len(a) bằng n, cộng và in tổng.'],solution:sumCode,brute:sumBrute,tests:sumTests,randomInput(seed){const r=rng(seed),n=r(1,20),a=Array.from({length:n},()=>r(-100,100));return arrayInput(a,r(1,5));},hiddenHint:'Thử mỗi số nằm riêng một dòng và số âm lớn.'},
      {id:'0-2-strength',title:'Chênh lệch tổng sức',level:'Cơ bản',statement:'Mỗi đội có hai số m, v; tổng sức bằng m+v. In tổng sức lớn nhất trừ nhỏ nhất.\n\nDữ liệu vào: n; rồi n dòng, mỗi dòng có m, v.\n\nKết quả: một số nguyên.',constraints:'1 ≤ n ≤ 80; 0 ≤ m, v ≤ 10^18.',sample:{input:'3\n2 3\n4 5\n1 2\n',output:'6',explanation:'Tổng sức là 5, 9, 3; chênh lệch bằng 6.'},starter:py('n = int(input())\n# Đọc hai số của từng đội.\n'),hints:['Cộng m và v trước khi so sánh.','Khởi tạo nhỏ nhất và lớn nhất bằng tổng của đội đầu.','Mỗi đội sau cập nhật hai giá trị; cuối cùng in hiệu.'],solution:strength,brute:strengthBrute,tests:strengthTests,randomInput(seed){const r=rng(seed),n=r(1,12);return `${n}\n${Array.from({length:n},()=>`${r(0,100)} ${r(0,100)}`).join('\n')}\n`;},hiddenHint:'Thử một đội, mọi tổng bằng nhau và số rất lớn.'},
      {id:'0-2-boxes',title:'Số lớn vẫn chia đúng',level:'Cơ bản',statement:'Có n đồ vật; mỗi hộp chứa tối đa k đồ vật. Tính số hộp ít nhất.\n\nDữ liệu vào: n, k trên một dòng.\n\nKết quả: một số nguyên.',constraints:'0 ≤ n ≤ 10^18; 1 ≤ k ≤ 10^18.',sample:{input:'7 3\n',output:'3',explanation:'Hai hộp chứa 6 đồ; đồ cuối cần thêm một hộp.'},starter:py('n, k = map(int, input().split())\n# Chia nguyên, không đổi sang thập phân.\n'),hints:['Nếu chia hết, không cần hộp thừa.','Nếu còn dư, thêm một hộp.','Dùng (n + k - 1) // k.'],solution:boxes,brute:boxesBrute,tests:boxTests,randomInput(seed){const r=rng(seed);const n=BigInt(r(0,999999))*1000000000000n+BigInt(r(0,100));return `${n} ${r(1,1000)}\n`;},hiddenHint:'Thử n=0, n chia hết và n rất lớn.'},
      {id:'0-2-reverse',title:'In đủ theo thứ tự ngược',level:'Vận dụng',statement:'Đọc n số rồi in theo thứ tự từ cuối về đầu. Giữ nguyên số trùng và dấu âm.\n\nDữ liệu vào: n; sau đó là n số, có thể trên nhiều dòng.\n\nKết quả: n số trên một dòng, cách nhau bằng dấu cách.',constraints:'1 ≤ n ≤ 300; |a[i]| ≤ 10^18; không có dòng trống.',sample:{input:'4\n2 -1\n5 3\n',output:'3 5 -1 2',explanation:'Số cuối được in trước; số đầu được in cuối.'},starter:py('n = int(input())\n# Đọc đủ rồi in ngược.\n'),hints:['Không sắp xếp giá trị; chỉ đổi thứ tự vị trí.','Trong Python, a[::-1] tạo danh sách ngược.','print(*a[::-1]) in các số cách nhau bằng dấu cách.'],solution:reverse,brute:reverseBrute,tests:reverseTests,randomInput(seed){const r=rng(seed),n=r(1,20),a=Array.from({length:n},()=>r(-9,9));return arrayInput(a,r(1,5));},hiddenHint:'Thử một số, các số trùng và nhiều dòng.'}
    ],
    exams:[
      {id:'khtn-2025-diem',title:'DIEM · Chênh lệch tổng sức',note:'Mỗi dòng có hai số; cần đọc đủ số đội. Giữ tổng nhỏ nhất và lớn nhất khi đọc.',hint:'<p>Khởi tạo từ đội đầu, không lấy 0 làm nhỏ nhất.</p><p>Đề gốc có ít nhất hai đội; sân tập cho một đội để luyện biên.</p>',sourceNote:''},
      {id:'hanoi-hsg9-2026-choxuan',title:'CHOXUAN · Chợ xuân',note:'Đọc hai số nguyên và in đúng một kết quả. Tích 7 × K có thể lớn hơn số nguyên 32 bit.',hint:'<p>Python tính bằng số nguyên, không cần đổi qua số thập phân.</p><p>Không in câu dẫn hoặc đơn vị tiền trong đáp án.</p>',sourceNote:'Đề HSG lớp 9 Hà Nội, không phải tuyển sinh lớp 10; nguồn đăng lại.'},
      {id:'khanhhoa-2024-bai4',title:'BAI4 · Bài 4 — Tổng số chính phương',note:'Dữ liệu có số tới 10^18. Đọc chính xác số lớn là bước đầu, chưa phải toàn bộ lời giải.',hint:'<p>Cần thêm cách tìm số lượng chính phương phù hợp.</p><p>Không thử từng số tới x; giới hạn quá lớn.</p>',sourceNote:'Nguồn đăng lại; tên mô tả chủ đề không phải tên chính thức.'}
    ],
    remember:{items:['Đọc đúng số dòng hoặc đủ số phần tử.','Đổi chữ thành int trước khi tính.','Số nguyên lớn vẫn tính bằng int.','Chỉ in điều đề yêu cầu.','Thử n=1, số 0, số âm và số trùng.'],cost:'Đọc n số một lượt có công việc tăng theo n, viết gọn O(n).',pitfalls:['Đọc nhanh không cứu được cách thử quá nhiều cặp.','Không khởi tạo nhỏ nhất bằng 0 khi mọi dữ liệu đều dương.']},
    next:{text:'Code chạy được chưa chắc đã đúng. Em đối chiếu hai lời giải thế nào?',href:'0-3-doi-chieu.html',title:'0.3 · Tìm phản ví dụ'}
  };
})();
