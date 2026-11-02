(() => {
  'use strict';
  const py=body=>'import sys\ninput = sys.stdin.readline  # đọc nhanh hơn, em cứ chép nguyên\n'+body;
  const rng=seed=>{let state=(Number(seed)>>>0)||1;return (lo,hi)=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return lo+state%(hi-lo+1);};};
  const test=(input,output)=>({input,output:String(output)});
  const first=py('n = int(input())\na = list(map(int, input().split()))\nb = list(map(int, input().split()))\nanswer = -1\nfor i in range(n):\n    if a[i] != b[i]:\n        answer = i + 1\n        break\nprint(answer)\n');
  const firstBrute=py('n = int(input())\na = list(map(int, input().split()))\nb = list(map(int, input().split()))\npositions = [i + 1 for i in range(n) if a[i] != b[i]]\nprint(min(positions) if positions else -1)\n');
  const counter=py('n = int(input())\na = list(map(int, input().split()))\ncorrect = max(a)\nwrong = 0\nfor value in a:\n    wrong = max(wrong, value)\nif correct == wrong:\n    print("KHOP")\nelse:\n    print(correct, wrong)\n');
  const counterBrute=py('n = int(input())\na = list(map(int, input().split()))\na.sort()\ncorrect = a[-1]\nwrong = sorted(a + [0])[-1]\nprint("KHOP" if correct == wrong else str(correct) + " " + str(wrong))\n');
  const pairs=py('n = int(input())\na = list(map(int, input().split()))\nanswer = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        if a[i] == a[j]:\n            answer += 1\nprint(answer)\n');
  const pairsBrute=py('n = int(input())\na = list(map(int, input().split()))\nordered = 0\nfor i in range(n):\n    for j in range(n):\n        if i != j and a[i] == a[j]:\n            ordered += 1\nprint(ordered // 2)\n');
  const divisible=py('m, p, q = map(int, input().split())\nanswer = -1\nfor x in range(1, m + 1):\n    correct = x % p == 0 or x % q == 0\n    wrong = x % p == 0 and x % q == 0\n    if correct != wrong:\n        answer = x\n        break\nprint(answer)\n');
  const divisibleBrute=py('m, p, q = map(int, input().split())\nleft = set(range(p, m + 1, p))\nright = set(range(q, m + 1, q))\nonly_one = (left | right) - (left & right)\nprint(min(only_one) if only_one else -1)\n');
  const arrays=[[0],[1],[-1],[-3,-2,-8],[0,-1],[1,-9],[-5,-5],[9,9,9],[2,3,4],[-9,-1,-5,-2],[1000000000,-1000000000],Array.from({length:80},(_,i)=>-i-1)];
  const counterTests=arrays.map(a=>test(`${a.length}\n${a.join(' ')}\n`,Math.max(...a)>=0?'KHOP':`${Math.max(...a)} 0`));
  const pairArrays=[[1],[1,1],[1,2],[0,0,0],[-1,-1,2],[3,1,3,1],[-9,-9,-9,-9],[1,2,3,4],[4,4,2,2,4],[1000000000,-1000000000,1000000000],Array(80).fill(7),Array.from({length:80},(_,i)=>i%4)];
  function pairOracle(a){const seen=new Map();let total=0;for(const x of a){total+=seen.get(x)||0;seen.set(x,(seen.get(x)||0)+1);}return total;}
  const pairTests=pairArrays.map(a=>test(`${a.length}\n${a.join(' ')}\n`,pairOracle(a)));
  const resultPairs=[[[1],[1]],[[1],[2]],[[1,2,3],[1,2,4]],[[1,2,3],[8,2,3]],[[1,2,3],[1,8,3]],[[0,0],[0,0]],[[-2,-3],[-2,3]],[[9,9,9],[9,8,7]],[[1,2],[2,1]],[[1000000000],[0]],[Array(100).fill(5),Array(100).fill(5)],[Array(100).fill(5),[...Array(99).fill(5),6]]];
  const firstTests=resultPairs.map(([a,b])=>{const i=a.findIndex((v,i)=>v!==b[i]);return test(`${a.length}\n${a.join(' ')}\n${b.join(' ')}\n`,i<0?-1:i+1);});
  const divCases=[[1,2,3],[10,2,3],[10,3,3],[2,3,5],[3,3,5],[20,4,6],[10,2,4],[100,7,7],[30,11,13],[5000,29,30],[5,8,2],[9,1,3]];
  const divTests=divCases.map(([m,p,q])=>{let ans=-1;for(let x=1;x<=m;x++)if((x%p===0)!==(x%q===0)){ans=x;break;}return test(`${m} ${p} ${q}\n`,ans);});
  const simCode=py('seed, rounds = map(int, input().split())\nstate = seed\nfor case in range(1, rounds + 1):\n    a = []\n    for j in range(3):\n        state = (state * 17 + 11) % 97\n        a.append(state % 11 - 5)\n    correct = a[0]\n    for value in a:\n        correct = max(correct, value)\n    wrong = 0\n    for value in a:\n        wrong = max(wrong, value)\n    mismatch = int(correct != wrong)\n    print(correct, wrong, mismatch)\n');
  const simLine=simCode.split('\n').findIndex(l=>l.trim().startsWith('mismatch ='))+1;
  const tracePython=`import sys, io, json, contextlib\nrecords = []\nprevious = None\ndef trace(frame, event, arg):\n    global previous\n    if frame.f_code.co_filename != '<simulation>':\n        return trace\n    if event in ('line', 'return'):\n        if previous == ${simLine}:\n            v = frame.f_locals\n            records.append({'values': list(v['a']) + [v['correct'], v['wrong'], v['mismatch']], 'line': ${simLine}})\n        previous = frame.f_lineno if event == 'line' else None\n    return trace\nsys.stdin = io.StringIO(text)\nwith contextlib.redirect_stdout(io.StringIO()):\n    sys.settrace(trace)\n    try:\n        exec(compile(source, '<simulation>', 'exec'), {})\n    finally:\n        sys.settrace(None)\nprint(json.dumps(records))\n`;
  const maxCorrect=py('n = int(input())\na = list(map(int, input().split()))\nbest = a[0]\nfor value in a:\n    best = max(best, value)\nprint(best)\n');
  const maxTests=arrays.map(a=>test(`${a.length}\n${a.join(' ')}\n`,Math.max(...a)));
  window.LESSON_DATA={
    id:'0-3',slug:'0-3-doi-chieu',title:'Viết trâu và tìm phản ví dụ',chapter:0,
    goal:'So hai lời giải trên cùng dữ liệu, giữ lại trường hợp lệch rồi tìm lỗi.',
    prerequisite:'Biết đọc dãy số, vòng lặp và câu lệnh if.',
    warmup:[
      {question:'Số lớn nhất trong −4, −2, −7 là bao nhiêu?',answer:'-2',explanation:'−2 lớn hơn −4 và −7; số 0 không nằm trong dãy.',hint:'Các số đều âm; đáp án vẫn phải là một số trong dãy.'},
      {question:'Hai chương trình in 8 và 9 trên cùng dữ liệu. Có chắc ít nhất một chương trình sai không?',answer:'có',explanation:'Với bài chỉ có một đáp án, hai kết quả khác nhau không thể cùng đúng.',hint:'Một dữ liệu chỉ có một kết quả cần in.'}
    ],
    story:{html:'<p>Em tìm số lớn nhất trong dãy. Một bạn đặt best=0, rồi cập nhật khi gặp số lớn hơn.</p><p>Dãy 2, 5, 1 cho đáp án đúng. Nhưng chưa đủ để tin chương trình.</p>',question:'Với dãy −4, −2, −7, chương trình của bạn in số nào?',answer:'0',explanation:'Không số nào lớn hơn 0 nên best giữ nguyên. Đáp án đúng phải là −2.',hint:'Theo dõi best bắt đầu bằng 0.'},
    brute:{html:'<p>Bản trâu đúng thử từng phần tử để tìm lớn nhất. Khởi tạo từ phần tử thật của dãy.</p><p>Ta dùng bản dễ kiểm tra làm mốc, rồi đối chiếu cách mới.</p>',code:maxCorrect,input:'3\n-4 -2 -7\n',output:'-2',cost:'n lần xét',count(n){return {slow:n,fast:n,slowLabel:'Bản đúng: n lần xét',fastLabel:'best=0: cũng n lần, có thể sai'};}},
    idea:{html:'<p>Test là một bộ dữ liệu kiểm tra. Phản ví dụ là dữ liệu làm lộ lỗi của một cách giải.</p><p>Chạy hai lời giải trên cùng dãy nhỏ. Nếu lệch, giữ dãy ấy và tính tay.</p><p>Thử thêm biên: một phần tử, toàn âm, toàn bằng nhau. Khớp nhiều lần chưa phải chứng minh đúng.</p><p>Hạt giống là số giúp sinh lại cùng dãy thử.</p><p>Đổi hạt giống ở hình rồi bấm Dùng dữ liệu này; đối chiếu dùng cùng các dãy ấy.</p>',examples:[
      {question:'Dãy chỉ có −1: khởi tạo best=0 có sai không?',answer:'có',explanation:'Chương trình in 0 thay vì −1; đây là phản ví dụ rất nhỏ.'},
      {question:'Hai kết quả 3, 7, 9 và 3, 8, 9 lệch đầu tiên ở vị trí nào?',answer:'2',explanation:'Giữ dữ liệu của lần thử thứ 2 để tìm lỗi.'},
      {question:'100 test đều khớp đã chứng minh chương trình đúng chưa?',answer:'chưa',explanation:'Có thể chưa thử đúng trường hợp làm lộ lỗi.'}
    ]},
    simulation:{input:'1 8',alternateInput:'7 6',inputLabel:'Hạt giống 0–96 và số lượt 1–10',code:simCode,
      build(text){
        const p=text.trim().split(/\s+/);if(p.length!==2||p.some(x=>!/^\d+$/.test(x)))throw Error('Nhập hạt giống và số lượt, cách nhau bằng dấu cách.');
        const [seed,rounds]=p.map(Number);if(seed>96||rounds<1||rounds>10)throw Error('Hạt giống từ 0 đến 96; số lượt từ 1 đến 10.');
        let state=seed;const snapshots=[];
        for(let k=1;k<=rounds;k++){
          const a=[];for(let j=0;j<3;j++){state=(state*17+11)%97;a.push(state%11-5);}
          let correct=a[0],wrong=0;for(const x of a)correct=Math.max(correct,x);for(const x of a)wrong=Math.max(wrong,x);
          const mismatch=Number(correct!==wrong);
          snapshots.push({testInput:`${a.length}\n${a.join(' ')}\n`,values:[...a,correct,wrong,mismatch],labels:['a[0]','a[1]','a[2]','Bản đúng','best=0','Lệch: 1/0'],roles:['done','done','done','source','source','current'],roleLabels:['✓ Dữ liệu đã xét','✓ Dữ liệu đã xét','✓ Dữ liệu đã xét','↗ Kết quả bản đúng','↗ Kết quả bản cần thử',mismatch?'! Hai kết quả lệch':'✓ Hai kết quả khớp'],line:simLine,scene:{kind:'stress',round:k,seed},predict:'',note:''});
        }
        return snapshots.map((s,i)=>({...s,predict:String(snapshots[Math.min(i+1,rounds-1)].values[5]),question:i+1<rounds?'Dãy tiếp theo làm hai bản lệch không: 1 là có, 0 là không?':'Dãy hiện tại làm hai bản lệch không: 1 là có, 0 là không?',note:i+1<rounds?`Dãy tiếp: ${snapshots[i+1].values.slice(0,3).join(', ')}. So kết quả khởi tạo từ a[0] với từ 0.`:(s.values[5]?'Đã tìm thấy lệch; tính tay dãy hiện tại để xác nhận.':'Lượt cuối khớp; vẫn cần thử các dãy toàn âm.')}));
      },tracePython},
    model:{code:simCode,input:'1 2\n',output:'1 1 0\n-1 0 1'},
    stress:{candidate:maxCorrect.replace('best = a[0]','best = 0'),reference:maxCorrect},
    activities:{
      output:{code:'a = [-4, -2, -7]\nbest = 0\nfor value in a:\n    best = max(best, value)\nprint(best)\n',input:'',answer:'0',explanation:'best=0 là lỗi khi mọi số đều âm.'},
      parsons:{lines:['a = [-4, -2, -7]','best = a[0]','for value in a:','    best = max(best, value)','print(best)'],validOrders:[[0,1,2,3,4]],output:'-2'},
      blank:{prompt:'Khởi tạo best để xử lý cả dãy toàn âm.',template:maxCorrect.replace('best = a[0]','best = ___'),answer:'a[0]',tests:maxTests},
      bug:{prompt:'Chỉ có dòng khởi tạo sai; hãy sửa để tìm phần tử lớn nhất.',code:maxCorrect.replace('best = a[0]','best = 0'),line:5,fix:'best = a[0]',tests:maxTests}
    },
    problems:[
      {id:'0-3-first-difference',title:'Giữ lần lệch đầu tiên',level:'Khởi động',statement:'Hai dãy a, b ghi kết quả của hai chương trình trên n lần thử. Tìm vị trí lệch đầu tiên, đánh số từ 1.\n\nDữ liệu vào: n, dòng a, rồi dòng b; mỗi dãy có n số.\n\nKết quả: vị trí đầu khác nhau; in −1 nếu mọi kết quả khớp.',constraints:'1 ≤ n ≤ 100; |a[i]|, |b[i]| ≤ 1.000.000.000.',sample:{input:'3\n3 7 9\n3 8 9\n',output:'2',explanation:'Chỉ kết quả lần thử thứ 2 lệch.'},starter:py('n = int(input())\na = list(map(int, input().split()))\nb = list(map(int, input().split()))\n# Tìm lần đầu khác nhau.\n'),hints:['So các kết quả ở cùng vị trí.','Duyệt từ trái sang phải; gặp lệch thì dừng.','Không có lệch thì giữ đáp án −1.'],solution:first,brute:firstBrute,tests:firstTests,randomInput(seed){const r=rng(seed),n=r(1,20),a=Array.from({length:n},()=>r(-5,5)),b=a.slice();if(r(0,1))b[r(0,n-1)]+=1;return `${n}\n${a.join(' ')}\n${b.join(' ')}\n`;},hiddenHint:'Thử lệch ngay đầu, ở cuối và không lệch.'},
      {id:'0-3-counterexample',title:'Dãy này có làm lộ lỗi?',level:'Cơ bản',statement:'Bản đúng tìm phần tử lớn nhất. Bản lỗi đặt best=0 rồi lấy lớn hơn giữa best và từng số.\n\nDữ liệu vào: n; dòng sau gồm n số nguyên.\n\nKết quả: nếu hai bản khớp, in KHOP. Nếu lệch, in kết quả đúng rồi kết quả lỗi.',constraints:'1 ≤ n ≤ 80; |a[i]| ≤ 1.000.000.000.',sample:{input:'3\n-4 -2 -7\n',output:'-2 0',explanation:'Dãy toàn âm làm lộ lỗi khởi tạo bằng 0.'},starter:py('n = int(input())\na = list(map(int, input().split()))\n# Chạy cả hai cách trên cùng dãy.\n'),hints:['Không sửa bản lỗi trong bài này; cần đo xem nó in gì.','Bản lỗi không bao giờ cho kết quả âm.','So max(a) với kết quả vòng lặp bắt đầu từ 0.'],solution:counter,brute:counterBrute,tests:counterTests,randomInput(seed){const r=rng(seed),n=r(1,12),negative=seed%3===0,a=Array.from({length:n},()=>r(-9,negative?-1:9));return `${n}\n${a.join(' ')}\n`;},hiddenHint:'Thử một số âm, dãy có 0 và dãy toàn dương.'},
      {id:'0-3-pair-oracle',title:'Viết bản trâu đáng tin',level:'Cơ bản',statement:'Đếm các cặp vị trí i < j có a[i] = a[j]. Dữ liệu nhỏ để em viết bản đối chiếu dễ kiểm tra.\n\nDữ liệu vào: n; dòng sau gồm n số nguyên.\n\nKết quả: số cặp thỏa điều kiện.',constraints:'1 ≤ n ≤ 80; |a[i]| ≤ 1.000.000.000.',sample:{input:'4\n3 1 3 1\n',output:'2',explanation:'Hai cặp là vị trí (1,3) và (2,4).'},starter:py('n = int(input())\na = list(map(int, input().split()))\n# Duyệt mọi cặp i < j.\n'),hints:['Không ghép một vị trí với chính nó.','Với mỗi i, cho j bắt đầu từ i+1.','Nếu hai giá trị bằng nhau, tăng đáp án.'],solution:pairs,brute:pairsBrute,tests:pairTests,randomInput(seed){const r=rng(seed),n=r(1,20),a=Array.from({length:n},()=>r(-3,3));return `${n}\n${a.join(' ')}\n`;},hiddenHint:'Thử một phần tử, toàn bằng nhau và không có số trùng.'},
      {id:'0-3-smallest-counterexample',title:'Tìm phản ví dụ nhỏ nhất',level:'Vận dụng',statement:'Bản đúng nhận x chia hết cho p hoặc q. Bản lỗi chỉ nhận khi x chia hết cả hai.\n\nDữ liệu vào: m, p, q trên một dòng. Xét x từ 1 đến m.\n\nKết quả: x nhỏ nhất làm hai bản khác nhau; in −1 nếu không có.',constraints:'1 ≤ m ≤ 5.000; 1 ≤ p, q ≤ 30.',sample:{input:'10 2 3\n',output:'2',explanation:'2 chia hết cho 2, nhưng không chia hết cho 3.'},starter:py('m, p, q = map(int, input().split())\n# Thử x tăng dần, so hai điều kiện.\n'),hints:['Chia hết được kiểm tra bằng phần dư bằng 0.','Tính riêng điều kiện or và điều kiện and.','Thử x từ 1; dừng tại lần hai điều kiện khác nhau.'],solution:divisible,brute:divisibleBrute,tests:divTests,randomInput(seed){const r=rng(seed);return `${r(1,80)} ${r(1,12)} ${r(1,12)}\n`;},hiddenHint:'Thử p=q, m nhỏ hơn p và q, hoặc p=1.'}
    ],
    exams:[
      {id:'khtn-2025-kcnn',title:'KCNN · Hai giá trị bằng nhau',note:'Viết bản thử mọi cặp trên dãy nhỏ. Dùng nó đối chiếu bản nhớ vị trí đã gặp.',hint:'<p>Thử không có số trùng, mọi số bằng nhau và hai số trùng ở hai đầu.</p><p>Bản trâu cần tìm khoảng cách nhỏ nhất, không chỉ đếm cặp.</p>',sourceNote:''},
      {id:'khanhhoa-2024-bai3',title:'BAI3 · Bài 3 — Dãy con k phần tử',note:'Thử mọi đoạn dài k để kiểm tra bản nhanh. Đừng chỉ so tổng khi có nhiều đoạn bằng nhau.',hint:'<p>Đề còn ưu tiên nhiều số chẵn hơn, rồi vị trí bắt đầu nhỏ hơn.</p><p>Tạo hai đoạn cùng tổng để kiểm tra từng điều kiện phụ.</p>',sourceNote:'Nguồn đăng lại; tên mô tả chủ đề không phải tên chính thức.'},
      {id:'khtn-2025-diem',title:'DIEM · Chênh lệch tổng sức',note:'So cách thử mọi cặp tổng với cách giữ lớn nhất và nhỏ nhất. Dùng các tổng bằng nhau để thử biên.',hint:'<p>Hai bản phải đọc cùng dữ liệu.</p><p>Nếu lệch, giữ vài đội rồi tự cộng từng tổng sức.</p>',sourceNote:''}
    ],
    remember:{items:['Bản đối chiếu phải dễ kiểm tra bằng tay.','Hai lời giải nhận cùng một dữ liệu.','Giữ nguyên dữ liệu gây lệch.','Thử biên bên cạnh dữ liệu ngẫu nhiên.','Khớp nhiều lần không thay chứng minh.'],cost:'Thử mọi cặp cần công việc tăng theo n × n, viết gọn O(n²); dùng cho dữ liệu nhỏ.',pitfalls:['Hai chương trình có thể cùng mắc một lỗi.','Không chỉ so số phép tính; phải so kết quả.']},
    next:{text:'Đã có bản thử mọi cặp. Có thể nhớ số lần gặp để tránh thử lại không?',href:'1-1-tan-suat.html',title:'1.1 · Mảng đếm và tần suất'}
  };
})();
