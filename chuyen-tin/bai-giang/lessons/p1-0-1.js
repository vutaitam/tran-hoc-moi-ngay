(() => {
  'use strict';
  const py = body => 'import sys\ninput = sys.stdin.readline  # đọc nhanh hơn, em cứ chép nguyên\n' + body;
  const rng = seed => {
    let state = (Number(seed) >>> 0) || 1;
    return (lo, hi) => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return lo + state % (hi - lo + 1); };
  };
  const test = (input, output) => ({input, output: String(output)});
  const money = py('n, k = map(int, input().split())\nprint(n - 7 * k)\n');
  const moneyBrute = py('n, k = map(int, input().split())\nfor day in range(7):\n    n -= k\nprint(n)\n');
  const rooms = py('a, b = map(int, input().split())\nprint(a + (b + 2) // 3)\n');
  const roomsBrute = py('a, b = map(int, input().split())\nrooms = a\nwhile b > 0:\n    rooms += 1\n    b -= 3\nprint(rooms)\n');
  const count = py('n, k = map(int, input().split())\na = list(map(int, input().split()))\nanswer = 0\nfor value in a:\n    if value >= k:\n        answer += 1\nprint(answer)\n');
  const countBrute = py('n, k = map(int, input().split())\na = list(map(int, input().split()))\nchosen = [value for value in a if value >= k]\nprint(len(chosen))\n');
  const pairs = py('n = int(input())\nprint(n * (n - 1) // 2)\n');
  const pairsBrute = py('n = int(input())\nanswer = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        answer += 1\nprint(answer)\n');
  const moneyCases = [[100,10],[70,10],[0,0],[1,1],[1000000000,1000000000],[0,8],[8,0],[71,10],[69,10],[999,3],[999999999,1],[18,3]];
  const roomCases = [[0,0],[0,1],[0,2],[0,3],[0,4],[2,4],[9,0],[1,9],[3,10],[7,11],[1000000000,0],[12,3000]];
  const countCases = [
    [[5],5], [[4],5], [[6],5], [[0,0,0],0], [[-3,-1,-2],-2], [[5,5,5],5],
    [[1,2,3,4],9], [[9,8,7],0], [[-1000000000,1000000000],0], [[1,5,2,5,7],5],
    [Array.from({length:300},(_,i)=>i-150),0], [[0],-1]
  ];
  const countTests = countCases.map(([a,k]) => test(`${a.length} ${k}\n${a.join(' ')}\n`,a.filter(x=>x>=k).length));
  const pairTests = [1,2,3,4,5,8,10,20,31,50,100,300].map(n=>test(`${n}\n`,n*(n-1)/2));
  const simCode = py('n = int(input())\nfor size in range(1, n + 1):\n    one_scan = size\n    all_pairs = size * size\n    print(one_scan, all_pairs)\n');
  const simLine = simCode.split('\n').findIndex(line=>line.includes('all_pairs =')) + 1;
  const tracePython = `import sys, io, json, contextlib\nrecords = []\nprevious = None\ndef trace(frame, event, arg):\n    global previous\n    if frame.f_code.co_filename != '<simulation>':\n        return trace\n    if event in ('line', 'return'):\n        if previous == ${simLine}:\n            v = frame.f_locals\n            records.append({'values': [v['size'], v['one_scan'], v['all_pairs']], 'line': ${simLine}})\n        previous = frame.f_lineno if event == 'line' else None\n    return trace\nsys.stdin = io.StringIO(text)\nwith contextlib.redirect_stdout(io.StringIO()):\n    sys.settrace(trace)\n    try:\n        exec(compile(source, '<simulation>', 'exec'), {})\n    finally:\n        sys.settrace(None)\nprint(json.dumps(records))\n`;
  window.LESSON_DATA = {
    id:'0-1', slug:'0-1-doc-de', title:'Đọc đề và chia phần', chapter:0,
    goal:'Đọc đúng yêu cầu, thử trường hợp nhỏ và đếm số phép tính trước khi viết.',
    prerequisite:'Biết cộng, trừ, nhân và vòng lặp for trong Python.',
    warmup:[
      {question:'Thuê 7 ngày, mỗi ngày 10 đồng. Cần bao nhiêu đồng?',answer:'70',explanation:'Lấy 7 × 10 = 70.',hint:'Giá mỗi ngày phải nhân số ngày.'},
      {question:'Có 5 số. Đi qua từng số một lần cần mấy lượt?',answer:'5',explanation:'Mỗi số được xét đúng một lần.',hint:'Đếm mỗi số là một lượt.'}
    ],
    story:{html:'<p>Bài Chợ xuân hỏi tiền còn lại sau khi thuê gian hàng 7 ngày.</p><p>Em có 100 đồng; giá thuê là 10 đồng mỗi ngày.</p>',question:'Sau khi thuê, còn bao nhiêu đồng?',answer:'30',explanation:'100 − 7 × 10 = 30. Đề hỏi tiền còn lại, không hỏi tiền thuê.',hint:'Tính tiền thuê trước, rồi trừ khỏi 100.'},
    brute:{html:'<p>“Trâu” là cách làm thẳng: trừ tiền thuê từng ngày.</p><p>Cách này đúng; vì luôn có 7 ngày nên cũng đủ nhanh.</p>',code:moneyBrute,input:'100 10\n',output:'30',cost:'7 lần trừ',count(n){return {slow:7,fast:2,slowLabel:'Trừ tiền 7 ngày',fastLabel:'Một phép nhân, một phép trừ'};}},
    idea:{html:'<p>Trước khi code, ghi ba điều: dữ liệu cho gì, cần in gì, giới hạn bao nhiêu.</p><p>Subtask là phần dữ liệu nhỏ hơn, được chấm một phần điểm.</p><p>Test là một bộ dữ liệu kiểm tra. Biên là trường hợp dễ bỏ sót, như n=1 hoặc số 0.</p><p>Một lượt qua n số cần khoảng n phép xét. Hai vòng lồng nhau, mỗi vòng n lượt, cần khoảng n × n lượt.</p><p class="formula">n = 100.000: n × n = 10 tỉ</p>',examples:[
      {question:'Có 70 đồng, thuê 7 ngày giá 10 đồng: còn bao nhiêu?',answer:'0',explanation:'Tiền vừa đủ; kết quả bằng 0 vẫn phải in.'},
      {question:'Một lượt qua 1.000 số cần khoảng bao nhiêu phép xét?',answer:'1000',explanation:'Không có vòng lặp bên trong nên mỗi số chỉ xét một lần.'},
      {question:'Hai vòng, mỗi vòng 1.000 lượt, chạy lồng nhau: bao nhiêu lượt trong?',answer:'1000000',explanation:'1.000 × 1.000 = 1.000.000, không phải 2.000.'}
    ]},
    simulation:{input:'5',alternateInput:'8',inputLabel:'n từ 1 đến 8',code:simCode,
      build(text){
        if(!/^\d+$/.test(text.trim())) throw Error('Nhập một số nguyên từ 1 đến 8.');
        const n=Number(text.trim()); if(n<1||n>8) throw Error('n cần từ 1 đến 8.');
        return Array.from({length:n},(_,i)=>{const size=i+1;return {
          values:[size,size,size*size],labels:['Kích thước size','Một lượt','Hai vòng lồng'],roles:['source','done','current'],roleLabels:['↗ Kích thước đang dùng','✓ Một lượt đã tính','◎ Hai vòng vừa tính'],line:simLine,scene:{kind:'work',size,maxSize:n},
          question:size<n?`Kích thước ${size+1}: hai vòng lồng cần bao nhiêu lượt?`:'Hai vòng lồng hiện cần bao nhiêu lượt?',
          note:`Kích thước hiện tại là ${size}; n=${n} là giới hạn cuối.`,
          predict:String(size<n?(size+1)*(size+1):size*size)
        };});
      },tracePython},
    model:{code:simCode,input:'5\n',output:'1 1\n2 4\n3 9\n4 16\n5 25'},
    activities:{
      output:{code:'n, k = 40, 6\nprint(n - 7 * k)\n',input:'',answer:'-2',explanation:'40 − 42 = −2. Không tự đổi số âm thành 0 khi đề không yêu cầu.'},
      parsons:{lines:['n = 100','k = 10','cost = 7 * k','answer = n - cost','print(answer)'],validOrders:[[0,1,2,3,4],[1,0,2,3,4],[1,2,0,3,4]],output:'30'},
      blank:{prompt:'Điền số tiền còn lại sau 7 ngày.',template:py('n, k = map(int, input().split())\nprint(___)\n'),answer:'n - 7 * k',tests:moneyCases.map(([n,k])=>test(`${n} ${k}\n`,n-7*k))},
      bug:{prompt:'Đếm các số ít nhất bằng k; code đang bỏ mất trường hợp bằng k.',code:count.replace('value >= k','value > k'),line:7,fix:'    if value >= k:',tests:countTests}
    },
    problems:[
      {id:'0-1-money',title:'Tiền còn lại',level:'Khởi động',statement:'Có n đồng, thuê chỗ trong 7 ngày, giá k đồng mỗi ngày. In số tiền còn lại, kể cả khi âm.\n\nDữ liệu vào: hai số n, k trên một dòng.\n\nKết quả: một số nguyên.',constraints:'0 ≤ n, k ≤ 1.000.000.000.',sample:{input:'100 10\n',output:'30',explanation:'Thuê hết 70 đồng, còn 30 đồng.'},starter:py('n, k = map(int, input().split())\n# Tính tiền còn lại.\n'),hints:['Đề hỏi phần còn lại, không hỏi tiền thuê.','Tiền thuê cả tuần bằng 7 × k.','In n − 7 × k, không chặn kết quả âm.'],solution:money,brute:moneyBrute,tests:moneyCases.map(([n,k])=>test(`${n} ${k}\n`,n-7*k)),randomInput(seed){const r=rng(seed);return `${r(0,10000)} ${r(0,3000)}\n`;},hiddenHint:'Thử tiền vừa đủ, thiếu tiền và k=0.'},
      {id:'0-1-rooms',title:'Đủ phòng cho mọi người',level:'Cơ bản',statement:'Có a người cần phòng riêng và b người có thể ở chung. Mỗi phòng chung chứa tối đa 3 người.\n\nDữ liệu vào: hai số a, b trên một dòng.\n\nKết quả: số phòng ít nhất.',constraints:'0 ≤ a ≤ 1.000.000.000; 0 ≤ b ≤ 3.000.',sample:{input:'2 4\n',output:'4',explanation:'Hai phòng riêng và hai phòng chung.'},starter:py('a, b = map(int, input().split())\n# Đếm cả phòng chung chưa đầy.\n'),hints:['Phòng riêng không nhận thêm người ở chung.','Chia b cho 3; nếu dư, cần thêm một phòng.','Số phòng chung là (b + 2) // 3.'],solution:rooms,brute:roomsBrute,tests:roomCases.map(([a,b])=>test(`${a} ${b}\n`,a+Math.ceil(b/3))),randomInput(seed){const r=rng(seed);return `${r(0,100)} ${r(0,100)}\n`;},hiddenHint:'Thử b=0, 1, 2, 3 và 4.'},
      {id:'0-1-threshold',title:'Đọc đúng chữ “ít nhất”',level:'Cơ bản',statement:'Đếm số phần tử có giá trị ít nhất bằng k.\n\nDữ liệu vào: n, k; dòng sau gồm n số nguyên.\n\nKết quả: số phần tử thỏa điều kiện.',constraints:'1 ≤ n ≤ 300; |a[i]|, |k| ≤ 1.000.000.000.',sample:{input:'5 5\n1 5 2 5 7\n',output:'3',explanation:'Hai số 5 và số 7 đều được tính.'},starter:py('n, k = map(int, input().split())\na = list(map(int, input().split()))\n# Đếm số thỏa điều kiện.\n'),hints:['“Ít nhất” bao gồm trường hợp bằng k.','Bắt đầu đếm từ 0; xét từng phần tử.','Nếu value >= k thì tăng biến đếm.'],solution:count,brute:countBrute,tests:countTests,randomInput(seed){const r=rng(seed),n=r(1,20),k=r(-5,5),a=Array.from({length:n},()=>r(-5,5));return `${n} ${k}\n${a.join(' ')}\n`;},hiddenHint:'Thử mọi số đều bằng k.'},
      {id:'0-1-pairs',title:'Đếm lượt bắt tay',level:'Vận dụng',statement:'Có n người; mỗi cặp bắt tay đúng một lần. Không ai bắt tay chính mình.\n\nDữ liệu vào: số nguyên n.\n\nKết quả: số lượt bắt tay.',constraints:'1 ≤ n ≤ 300.',sample:{input:'4\n',output:'6',explanation:'Các cặp: 12, 13, 14, 23, 24, 34.'},starter:py('n = int(input())\n# Mỗi cặp chỉ đếm một lần.\n'),hints:['Với n=1, không có cặp nào.','Mỗi người gặp n−1 người, nhưng mỗi cặp bị đếm hai lần.','In n * (n - 1) // 2.'],solution:pairs,brute:pairsBrute,tests:pairTests,randomInput(seed){return `${rng(seed)(1,61)}\n`;},hiddenHint:'Thử n=1, n=2; đừng đếm cặp theo hai thứ tự.'}
    ],
    exams:[
      {id:'hanoi-hsg9-2026-choxuan',title:'CHOXUAN · Chợ xuân',note:'Đọc đúng “tiền còn lại” và số ngày thuê. Không tự thêm điều kiện kết quả phải dương.',hint:'<p>Viết tiền còn lại = tiền ban đầu − 7 × giá mỗi ngày.</p><p>Đề này không thấy chia nhóm dữ liệu lấy điểm riêng.</p>',sourceNote:'Đề HSG lớp 9 Hà Nội, không phải tuyển sinh lớp 10; nguồn đăng lại.'},
      {id:'khanhhoa-2024-bai1',title:'BAI1 · Bài 1 — Đặt phòng',note:'Phân biệt phòng riêng với phòng chung. Chú ý phòng cuối chưa đủ ba người.',hint:'<p>Phần dữ liệu nhỏ cho b ≤ 10⁶; em có thể thử cách trừ dần.</p><p>Công thức chia làm tròn lên mới xử lý gọn giới hạn đầy đủ.</p>',sourceNote:'Nguồn đăng lại; “Đặt phòng” là mô tả chủ đề.'},
      {id:'khtn-2025-kcnn',title:'KCNN · Hai giá trị bằng nhau',note:'Phần dữ liệu nhỏ cho phép thử các cặp vị trí. Đọc kỹ điều kiện hai vị trí khác nhau.',hint:'<p>Chỉ xét i &lt; j để không lấy chính phần tử ấy.</p><p>Với dãy lớn, cần nhớ vị trí; học tiếp ở bài 1.1.</p>',sourceNote:''}
    ],
    remember:{items:['Gạch dưới đại lượng cần in.','Đọc đủ giới hạn và phần dữ liệu nhỏ.','Thử tay trước khi code.','Đếm lượt chạy của các vòng lặp.','Thử số 0, n=1 và dấu bằng.'],cost:'Người ta viết gọn công việc tăng theo n là O(n), theo n × n là O(n²).',pitfalls:['Không suy ra tốc độ chỉ từ số dòng code.','Không tự thêm điều kiện mà đề không nói.']},
    next:{text:'Đọc đủ nhiều dòng và giữ đúng số lớn thế nào?',href:'0-2-vao-ra.html',title:'0.2 · Đọc, in và thử biên'}
  };
})();
