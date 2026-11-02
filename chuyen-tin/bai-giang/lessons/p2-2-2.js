(() => {
  'use strict';
  const reader = 'import sys\ninput = sys.stdin.readline\n';
  const gcdCode = reader + `a, b = map(int, input().split())
x, y = max(a, b), min(a, b)
q, r = 0, 0
while y != 0:
    q, r = divmod(x, y)  # Cắt q vuông, còn dư r.
    x, y = y, r
print(x)
`;
  const gcdBrute = reader + `a, b = map(int, input().split())
answer = 0
for d in range(1, max(a, b) + 1):
    if a % d == 0 and b % d == 0:
        answer = d
print(answer)
`;
  const lcmCode = reader + `a, b = map(int, input().split())
x, y = a, b
while y:
    x, y = y, x % y
print(a // x * b)
`;
  const lcmBrute = reader + `a, b = map(int, input().split())
answer = a
while answer % b != 0:
    answer += a
print(answer)
`;
  const fractionCode = reader + `a, b = map(int, input().split())
x, y = a, b
while y:
    x, y = y, x % y
print(a // x, b // x)
`;
  const fractionBrute = reader + `a, b = map(int, input().split())
for d in range(min(a, b), 0, -1):
    if a % d == 0 and b % d == 0:
        print(a // d, b // d)
        break
`;
  const arrayCode = reader + `n = int(input())
a = list(map(int, input().split()))
g = 0
for value in a:
    x, y = g, value
    while y:
        x, y = y, x % y
    g = x
print(g)
`;
  const arrayBrute = reader + `n = int(input())
a = list(map(int, input().split()))
for d in range(min(a), 0, -1):
    if all(value % d == 0 for value in a):
        print(d)
        break
`;
  function random(seed) {
    let state = Number(seed) >>> 0;
    return (lo, hi) => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return lo + (state >>> 8) % (hi - lo + 1);
    };
  }
  function gcdExpected(a, b) {
    let answer = 0;
    for (let d = 1; d <= Math.max(a, b); d++) if (a % d === 0 && b % d === 0) answer = d;
    return answer;
  }
  const pairs = [[48,18],[1,1],[1,37],[37,1],[6,6],[7,11],[12,36],[36,12],[35,21],[89,55],[100000,99999],[0,9],[9,0],[0,0]];
  const gcdTests = pairs.map(([a,b]) => ({input:`${a} ${b}\n`,output:gcdExpected(a,b)+'\n'}));
  const positivePairs = [[6,8],[1,1],[1,37],[37,1],[6,6],[7,11],[12,36],[36,12],[35,21],[89,55],[999,1000],[1000,1000]];
  const lcmTests = positivePairs.map(([a,b]) => ({input:`${a} ${b}\n`,output:a/gcdExpected(a,b)*b+'\n'}));
  const fractionTests = positivePairs.map(([a,b]) => { const g=gcdExpected(a,b); return {input:`${a} ${b}\n`,output:`${a/g} ${b/g}\n`}; });
  const arrays = [[12,18,30],[1],[37],[6,6,6],[7,11],[12,24,36],[100,75,50],[8,12,18],[25,50,75,100],[99991,99991],[100000,99999],Array(1000).fill(120)];
  const arrayInput = a => `${a.length}\n${a.join(' ')}\n`;
  const arrayTests = arrays.map(a => {
    let answer = 1;
    for (let d = 1; d <= Math.min(...a); d++) if (a.every(v => v % d === 0)) answer = d;
    return {input:arrayInput(a), output:answer+'\n'};
  });
  function build(text) {
    const tokens = text.trim().split(/\s+/);
    if (tokens.length !== 2 || tokens.some(t => !/^\d+$/.test(t))) throw Error('Em nhập đúng hai số nguyên dương.');
    const [a,b] = tokens.map(Number);
    if (a < 1 || b < 1 || a > 60 || b > 60) throw Error('Mỗi cạnh trong hình từ 1 đến 60.');
    let x=Math.max(a,b),y=Math.min(a,b),q=0,r=0;
    const states=[];
    while (y) {
      q=Math.floor(x/y); r=x%y;
      states.push({values:[x,y,q,r],labels:['x · cạnh dài','y · cạnh ngắn','q · số vuông','r · cạnh dư'],roles:['source','source','done',r ? 'current' : 'done'],roleLabels:['Cạnh đang chia','Cạnh vuông được cắt','Số vuông cắt được','Cạnh phần còn lại'],line:7,scene:{kind:'euclid',x,y,q,r,originalMax:Math.max(a,b),originalMin:Math.min(a,b),ended:false},note:`${x}=${q}×${y}+${r}. Cắt ${q} hình vuông cạnh ${y}; ${r ? `còn hình ${y}×${r}.` : 'không còn phần dư.'}`});
      [x,y]=[y,r];
    }
    states.push({values:[x,y,q,r],labels:['x · ƯCLN','y · đã về 0','q · thương cuối','r · dư cuối'],roles:['done','done','done','done'],roleLabels:['Ước chung lớn nhất','Điều kiện dừng','Thương của lượt cuối','Không còn phần dư'],line:9,scene:{...states[states.length-1].scene,ended:true,gcd:x},note:`Cạnh vuông cuối là ${x}. Đây là ƯCLN của ${a} và ${b}.`});
    states.forEach((s,i)=>{
      s.predict=String(i+1<states.length ? states[i+1].values[1] : 0);
      s.question=i===states.length-1 ? 'Đã dừng vì y=0; x là ƯCLN.' : i===states.length-2 ? 'Sau phép gán, y bằng bao nhiêu để vòng lặp dừng?' : 'Ở lượt cắt tiếp theo, cạnh ngắn y bằng bao nhiêu?';
    });
    return states;
  }
  const tracePython = `import io, sys, json
states = []
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v = frame.f_locals
        if frame.f_lineno in (8, 9):
            line = 7 if frame.f_lineno == 8 else 9
            states.append({'values': [v['x'], v['y'], v['q'], v['r']], 'line': line})
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
    id:'2-2',slug:'2-2-ucln-bcnn',title:'ƯCLN, BCNN và Euclid',chapter:2,
    goal:'Cắt phần dư để tìm ƯCLN; dùng kết quả cho phân số và bội chung.',
    prerequisite:'Biết ước, bội và phép chia lấy dư.',
    warmup:[
      {question:'Ước chung lớn nhất của 12 và 18 là bao nhiêu?',answer:'6',explanation:'Các ước chung là 1, 2, 3, 6; lớn nhất là 6.',hint:'Liệt kê hai nhóm ước rồi tìm phần chung.'},
      {question:'48 chia 18 có số dư bằng bao nhiêu?',answer:'12',explanation:'48=2×18+12.',hint:'Trừ hai lần 18 khỏi 48.'}
    ],
    story:{html:'<p>Em lát hình chữ nhật 48×18 bằng các hình vuông bằng nhau, không cắt vuông.</p><p>Cả 48 và 18 phải chia hết cho cạnh vuông. Em muốn cạnh lớn nhất có thể.</p><p>Thử cắt hai hình vuông cạnh 18 trước. Phần còn lại có cạnh ngắn bao nhiêu?</p>',question:'48−2×18 bằng bao nhiêu?',answer:'12',explanation:'Phần dư là hình 18×12. Ta tiếp tục cắt hình nhỏ hơn.',hint:'Giữ nguyên cạnh 18, trừ hai đoạn 18 trên cạnh dài.'},
    brute:{html:'<p>Ước chung lớn nhất, viết ƯCLN, là ước dương lớn nhất của cả hai số.</p><p>Cách thẳng: thử từng d, giữ ước chung lớn nhất.</p>',code:gcdBrute,input:'48 18\n',output:'6\n',cost:'Xét cặp (n,n−1). Đếm lượt thử d và lượt chia Euclid, không đổi thành thời gian.',count(n){let a=n,b=n-1,steps=0;while(b){[a,b]=[b,a%b];steps++;}return {slow:n,fast:steps,slowLabel:'Thử d từ 1 đến n',fastLabel:'Euclid cho cặp (n,n−1)'};}},
    idea:{html:'<p>Thuật toán Euclid thay hai số bằng số nhỏ và phần dư.</p><p class="formula">ƯCLN(x,y) = ƯCLN(y,x%y), khi y&gt;0.</p><p>Vì x=q×y+r, ước chung của x,y cũng chia r=x−q×y.</p><p>Ngược lại, ước chung của y,r cũng chia x=q×y+r. Hai cặp có cùng các ước chung.</p><p>Trên hình, cắt các vuông cạnh y. Phần dư có hai cạnh y,r.</p><p>Dư luôn nhỏ hơn y, nên hình nhỏ dần. Khi dư bằng 0, cạnh vuông cuối là ƯCLN.</p><p>Code dùng số nguyên không âm. Quy ước ƯCLN(a,0)=a, kể cả ƯCLN(0,0)=0 trong sân tập.</p><p>Bội chung nhỏ nhất, viết BCNN, là bội dương nhỏ nhất của cả hai số dương.</p><p class="formula">g=ƯCLN(a,b); BCNN(a,b)=a//g×b, với a,b&gt;0.</p><p>Viết a=g×u, b=g×v. u,v không còn ước chung lớn hơn 1; bội chung nhỏ nhất là g×u×v.</p><p>Phân số tối giản có tử, mẫu không còn ước chung lớn hơn 1.</p><p>Chia cả tử và mẫu cho ƯCLN để rút gọn. Mẫu phải khác 0.</p>',examples:[
      {question:'ƯCLN(48,18) bằng bao nhiêu?',answer:'6',explanation:'48%18=12; 18%12=6; 12%6=0. Cạnh cuối là 6.'},
      {question:'BCNN(6,8) bằng bao nhiêu?',answer:'24',explanation:'ƯCLN là 2; 6//2×8=24.'},
      {question:'Rút gọn 35/21. Nhập tử và mẫu, cách nhau bằng dấu cách.',answer:'5 3',explanation:'ƯCLN(35,21)=7; chia cả hai số cho 7.'}
    ]},
    simulation:{input:'48 18',alternateInput:'35 21',inputLabel:'Hai cạnh nguyên dương, mỗi cạnh từ 1 đến 60.',code:gcdCode,build,tracePython,render(root,state,index,states){return window.P2Arithmetic.render(root,state,index,states);}},
    model:{code:gcdCode,input:'48 18\n',output:'6\n'},
    activities:{
      output:{code:gcdCode,input:'35 21\n',answer:'7',explanation:'35%21=14; 21%14=7; 14%7=0.'},
      parsons:{lines:['a, b = 48, 18','while b != 0:','    a, b = b, a % b','print(a)'],validOrders:[[0,1,2,3]],output:'6'},
      blank:{prompt:'Điền số dư dùng trong bước Euclid.',template:reader+'a, b = map(int, input().split())\nwhile b:\n    a, b = b, ___\nprint(a)\n',answer:'a % b',tests:gcdTests},
      bug:{prompt:'Dòng cuối in nhầm biến đã bằng 0. Sửa để in ƯCLN.',code:gcdCode.replace('print(x)','print(y)'),line:9,fix:'print(x)',tests:gcdTests}
    },
    problems:[
      {id:'2-2-gcd',title:'1. Cạnh vuông chung',level:'Khởi động',statement:'Cho hai số nguyên không âm a,b. Tìm ƯCLN của chúng. Quy ước ƯCLN(0,0)=0.\n\nDữ liệu vào: hai số a b.\n\nKết quả: ƯCLN cần tìm.',constraints:'0 ≤ a,b ≤ 100.000.',sample:{...gcdTests[0],explanation:'Cả 48 và 18 cùng chia hết cho 6; đó là cạnh lớn nhất.'},starter:reader+'a, b = map(int, input().split())\n# Lặp cho tới số dư bằng không.\n',hints:['Ước chung không đổi khi thay số lớn bằng phần dư.', 'Giữ cặp x,y; khi y khác 0, chuyển thành y,x%y.', 'Dùng phép gán đồng thời; khi y=0, in x.'],solution:gcdCode,brute:gcdBrute,tests:gcdTests,randomInput(seed){const r=random(seed);return `${r(0,1000)} ${r(0,1000)}\n`;},hiddenHint:'Em thử một số bằng 0, cả hai bằng 0 và hai số bằng nhau.'},
      {id:'2-2-lcm',title:'2. Hai chuông cùng reo',level:'Cơ bản',statement:'Hai chuông cùng reo lúc 0. Chuông thứ nhất reo mỗi a giây; chuông thứ hai mỗi b giây. Tìm thời điểm dương đầu tiên cùng reo.\n\nDữ liệu vào: hai số dương a b.\n\nKết quả: thời điểm cần tìm.',constraints:'1 ≤ a,b ≤ 1000.',sample:{...lcmTests[0],explanation:'Chuông reo mỗi 6 và 8 giây cùng reo lần tiếp theo tại giây 24.'},starter:reader+'a, b = map(int, input().split())\n# Tìm ƯCLN rồi suy ra BCNN.\n',hints:['Thời điểm ấy phải là bội của cả a và b.', 'Tính g=ƯCLN(a,b) bằng Euclid.', 'In a//g*b; phép chia nguyên thực hiện trước phép nhân.'],solution:lcmCode,brute:lcmBrute,tests:lcmTests,randomInput(seed){const r=random(seed);return `${r(1,100)} ${r(1,100)}\n`;},hiddenHint:'Em thử a=b, một số chia hết số kia và hai số không có ước chung lớn hơn 1.'},
      {id:'2-2-fraction',title:'3. Rút gọn phân số',level:'Cơ bản',statement:'Cho tử a và mẫu b đều dương. Rút gọn phân số a/b đến tối giản.\n\nDữ liệu vào: hai số a b.\n\nKết quả: tử mới và mẫu mới, cách nhau bằng dấu cách.',constraints:'1 ≤ a,b ≤ 1000.',sample:{...fractionTests[0],explanation:'6/8 rút gọn thành 3/4.'},starter:reader+'a, b = map(int, input().split())\n# Chia cả hai số cho ƯCLN.\n',hints:['Tử và mẫu phải chia cùng một số để giữ giá trị phân số.', 'Số chia lớn nhất là ƯCLN(a,b).', 'Tính g bằng Euclid, rồi in a//g và b//g.'],solution:fractionCode,brute:fractionBrute,tests:fractionTests,randomInput(seed){const r=random(seed);return `${r(1,1000)} ${r(1,1000)}\n`;},hiddenHint:'Em thử tử bằng mẫu, tử lớn hơn mẫu và phân số vốn đã tối giản.'},
      {id:'2-2-array',title:'4. Chia đều nhiều túi',level:'Trung bình',statement:'Có n túi kẹo, túi thứ i chứa aᵢ viên. Chia mỗi túi thành các phần, mọi phần có cùng số viên. Tìm số viên lớn nhất trong mỗi phần, không để dư.\n\nDữ liệu vào: dòng đầu là n. Dòng sau chứa n số dương.\n\nKết quả: ƯCLN của cả dãy.',constraints:'1 ≤ n ≤ 1000; 1 ≤ aᵢ ≤ 100.000.',sample:{...arrayTests[0],explanation:'12, 18 và 30 đều chia hết 6; không có số lớn hơn cùng chia hết.'},starter:reader+'n = int(input())\na = list(map(int, input().split()))\n# Gộp ƯCLN lần lượt từng túi.\n',hints:['Ước chung của cả dãy cũng là ước chung của hai số đầu.', 'Gộp dần: g=ƯCLN(g,aᵢ) sau mỗi túi.', 'Khởi tạo g=0; ƯCLN(0,aᵢ)=aᵢ giúp xử lý túi đầu.'],solution:arrayCode,brute:arrayBrute,tests:arrayTests,randomInput(seed){const r=random(seed),n=r(1,15),g=r(1,20);return arrayInput(Array.from({length:n},()=>g*r(1,30)));},hiddenHint:'Em thử một túi, các túi bằng nhau và ƯCLN giảm về 1 giữa dãy.'}
    ],
    exams:[
      {id:'csp-2026-phan-so-toi-gian',title:'Bài 1. Phân số tối giản',note:'Dùng ƯCLN để nhận biết phân số tối giản. Tìm phân số lớn nhất còn cần xét tổng tử và mẫu.',hint:'Với a+b=n, kiểm tra ƯCLN(a,n)=1. n đến 10¹⁸: không thử mọi tử; cần nhận xét chẵn lẻ.',sourceNote:'Chuyên ĐH Sư phạm Hà Nội 2026 · Bản biên soạn bên thứ ba.'},
      {id:'csp-2024-tong-lon-nhat',title:'Câu 1. Tổng lớn nhất',note:'ƯCLN giúp thử các m nhỏ và nhận ra chặn trên. Ví dụ và quy tắc đồng hạng mâu thuẫn.',hint:'Đặt d=ƯCLN(m,n). Vì d chia n−m nên m+d≤n. Phải làm rõ quy tắc đồng hạng trước khi chọn đáp án.',sourceNote:'Chuyên ĐH Sư phạm Hà Nội 2024 · Nhãn đề chính thức trong bản.'}
    ],
    remember:{items:['ƯCLN(x,y)=ƯCLN(y,x%y) khi y khác 0.', 'Khi y=0, x là ƯCLN; phép gán đồng thời giữ hai giá trị cũ.', 'Hai số nguyên tố cùng nhau nghĩa là ƯCLN bằng 1; chúng không nhất thiết đều nguyên tố.', 'Với a,b dương: BCNN=a//ƯCLN(a,b)×b.', 'Rút gọn phân số bằng cách chia tử và mẫu cho ƯCLN.'],cost:'O(log M) nghĩa là số lượt Euclid tăng chậm theo số chữ số của M=max(a,b). Gộp n số: O(n log M).',pitfalls:['Không dùng công thức BCNN khi cả hai số bằng 0; sân tập BCNN yêu cầu số dương.', 'Gán x=y trước rồi tính x%y làm mất x cũ; dùng x,y=y,x%y.']},
    next:{text:'Muốn nhận biết nhiều số nguyên tố liên tiếp, em có cần thử chia từng số riêng không?',href:'2-3-so-nguyen-to.html',title:'Số nguyên tố, sàng và phân tích'}
  };
})();
