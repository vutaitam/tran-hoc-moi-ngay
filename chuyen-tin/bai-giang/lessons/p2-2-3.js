(() => {
  'use strict';
  const reader = 'import sys\ninput = sys.stdin.readline\n';
  const sieve = reader + `n = int(input())
prime = [True] * (n + 1)
prime[0] = prime[1] = False  # 0 và 1 không nguyên tố.
p, m = 2, 0
while p * p <= n:
    if prime[p]:
        for m in range(p * p, n + 1, p):
            prime[m] = False
    p += 1
print(*(i for i in range(2, n + 1) if prime[i]))
`;
  const sieveBrute = reader + `n = int(input())
answer = []
for x in range(2, n + 1):
    valid = True
    for d in range(2, x):
        if x % d == 0:
            valid = False
    if valid:
        answer.append(x)
print(*answer)
`;
  const primeCode = reader + `n = int(input())
valid = n >= 2
d = 2
while d * d <= n:
    if n % d == 0:
        valid = False
        break
    d += 1
print('YES' if valid else 'NO')
`;
  const primeBrute = reader + `n = int(input())
count = 0
for d in range(1, n + 1):
    if n % d == 0:
        count += 1
print('YES' if count == 2 else 'NO')
`;
  const countCode = reader + `n = int(input())
prime = [True] * (n + 1)
prime[0] = prime[1] = False
p = 2
while p * p <= n:
    if prime[p]:
        for m in range(p * p, n + 1, p):
            prime[m] = False
    p += 1
print(sum(prime))
`;
  const countBrute = reader + `n = int(input())
answer = 0
for x in range(2, n + 1):
    valid = True
    for d in range(2, x):
        if x % d == 0:
            valid = False
            break
    if valid:
        answer += 1
print(answer)
`;
  const factorCode = reader + `n = int(input())
factors = []
d = 2
while d * d <= n:
    while n % d == 0:
        factors.append(d)
        n //= d
    d += 1
if n > 1:
    factors.append(n)
print(*factors) if factors else print(1)
`;
  const factorBrute = reader + `n = int(input())
factors = []
while n > 1:
    for d in range(2, n + 1):
        if n % d == 0:
            factors.append(d)
            n //= d
            break
print(*factors) if factors else print(1)
`;
  const squareCode = reader + `n = int(input())
k = 1
d = 2
while d * d <= n:
    exponent = 0
    while n % d == 0:
        n //= d
        exponent += 1
    if exponent % 2 == 1:
        k *= d
    d += 1
if n > 1:
    k *= n
print(k)
`;
  const squareBrute = reader + `from math import isqrt
n = int(input())
for k in range(1, n + 1):
    root = isqrt(n * k)
    if root * root == n * k:
        print(k)
        break
`;
  function random(seed) {
    let state = Number(seed) >>> 0;
    return (lo, hi) => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return lo + (state >>> 8) % (hi - lo + 1);
    };
  }
  function isPrime(n) {
    if (n < 2) return false;
    for (let d=2;d*d<=n;d++) if(n%d===0)return false;
    return true;
  }
  const primeNumbers=[29,0,1,2,3,4,9,25,49,97,99991,100000];
  const primeTests=primeNumbers.map(n=>({input:n+'\n',output:(isPrime(n)?'YES':'NO')+'\n'}));
  const countNumbers=[30,1,2,3,4,10,25,49,97,100,1000,5000];
  const countTests=countNumbers.map(n=>({input:n+'\n',output:Array.from({length:n+1},(_,i)=>i).filter(isPrime).length+'\n'}));
  const factorNumbers=[72,1,2,3,4,8,12,25,49,97,99991,100000];
  const factorTests=factorNumbers.map(n=>{
    const factors=[];let rest=n;
    for(let d=2;d<=rest;d++)while(rest%d===0){factors.push(d);rest/=d;}
    return {input:n+'\n',output:(factors.length?factors.join(' '):'1')+'\n'};
  });
  const squareNumbers=[12,1,2,3,4,8,18,25,49,72,97,9991,10000];
  const squareTests=squareNumbers.map(n=>{
    let k=1;while(!Number.isInteger(Math.sqrt(n*k)))k++;
    return {input:n+'\n',output:k+'\n'};
  });
  function build(text) {
    if(!/^\s*\d+\s*$/.test(text))throw Error('Em nhập một số nguyên n.');
    const n=Number(text);
    if(n<2||n>60)throw Error('Hình dùng n từ 2 đến 60.');
    const prime=Array(n+1).fill(true);prime[0]=prime[1]=false;
    let p=2,m=0;const states=[];
    function add(line,ended,initial=false){
      states.push({values:[p,m,prime.map(Number).join(' ')],labels:['p · số đang sàng','m · bội vừa gạch','prime[0..n] · 1 còn, 0 gạch'],roles:[ended?'done':'current',initial?'pending':ended?'done':'excluded','done'],roleLabels:[ended?'Đã vượt căn n':'Chọn số chưa bị gạch',initial?'Chưa gạch bội nào':ended?'Giá trị cuối, không gạch nữa':'Bội vừa loại','Dãy đánh dấu thật trong code'],line,scene:{kind:'sieve',n,p,m,prime:prime.slice(),ended,initial},note:initial?'0 và 1 không phải số nguyên tố. Các ô còn lại đang chờ kiểm tra.':ended?`Đã xét hết p²≤${n}. Các ô còn lại từ 2 trở lên là số nguyên tố.`:`${m}=${p}×${m/p}. Gạch ô ${m}; ${m===p*p?'bắt đầu từ p².':'tiếp tục cách nhau p ô.'}`});
    }
    add(6,false,true);
    while(p*p<=n){
      if(prime[p])for(m=p*p;m<=n;m+=p){prime[m]=false;add(10,false);}
      if(prime[p])m-=p;
      p++;
    }
    add(12,true);
    states.forEach((s,i)=>{
      const next=states[i+1];s.predict=String(next&&!next.scene.ended?next.scene.m:-1);
      s.question=s.scene.ended?'Đã sàng xong; không còn ô cần gạch.':'Bước sau gạch ô số m nào? Nếu đã dừng, nhập −1.';
    });
    return states;
  }
  const tracePython = `import io, sys, json
states = []
previous_line = None
started = False
def trace(frame, event, arg):
    global previous_line, started
    if event == 'line' and frame.f_code.co_filename == '<simulation>' and frame.f_code.co_name == '<module>':
        v = frame.f_locals
        line = frame.f_lineno
        capture = None
        if line == 7 and not started:
            capture = 6
            started = True
        elif previous_line == 10:
            capture = 10
        elif line == 12:
            capture = 12
        if capture is not None:
            values = [v['p'], v['m'], ' '.join(str(int(x)) for x in v['prime'])]
            states.append({'values': values, 'line': capture})
        previous_line = line
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
  window.LESSON_DATA={
    id:'2-3',slug:'2-3-so-nguyen-to',title:'Số nguyên tố, sàng và phân tích',chapter:2,
    goal:'Kiểm tra một số, sàng cả đoạn và tách số thành các thừa số nguyên tố.',
    prerequisite:'Biết chia hết, cặp ước và duyệt đến căn bậc hai.',
    warmup:[
      {question:'Số 13 có bao nhiêu ước dương?',answer:'2',explanation:'Chỉ có 1 và 13 chia hết 13.',hint:'Thử d=2 và d=3 đã đủ đến căn.'},
      {question:'Nếu 7×7=49, thử chia khi d²<49 có kiểm tra được d=7 không?',answer:'không',explanation:'Cần d²≤49 để không bỏ mất ước ở căn.',hint:'Dấu nhỏ hơn không nhận trường hợp bằng.'}
    ],
    story:{html:'<p>Em cần khoanh các số chỉ có đúng hai ước dương trên bảng từ 0 đến 30.</p><p>Những số ấy gọi là số nguyên tố. Hai ước của chúng là 1 và chính số đó.</p><p>Giữ 2; gạch 4, 6, 8, … bằng một quy tắc. Em tránh được những lần thử chia nào?</p>',question:'Gạch 4, 6, 8, … Số nhỏ nhất chưa gạch, lớn hơn 2, là số nào?',answer:'3',explanation:'3 chưa bị gạch; 4 là bội của 2 nên bị loại.',hint:'Nhìn ngay sau số 2.'},
    brute:{html:'<p>Cách thẳng: với mỗi x, thử các số từ 2 đến x−1.</p><p>Không tìm được ước nào thì x là nguyên tố. Lặp lại cho mọi x đến n.</p>',code:sieveBrute,input:'10\n',output:'2 3 5 7\n',cost:'Đếm phép chia của bản trâu và lần ghi False của sàng; không tính khởi tạo hay đọc kết quả.',count(n){const mark=Array(n+1).fill(true);let fast=2;for(let p=2;p*p<=n;p++)if(mark[p])for(let m=p*p;m<=n;m+=p){mark[m]=false;fast++;}return {slow:(n-1)*(n-2)/2,fast,slowLabel:'Thử mọi ước của từng x',fastLabel:'Ghi False, gồm ô 0 và 1'};}},
    idea:{html:'<p>Số nguyên tố phải từ 2 trở lên. 0 và 1 không nguyên tố, cũng không phải hợp số.</p><p>Hợp số là số nguyên lớn hơn 1 có thêm ước ngoài 1 và chính nó.</p><p>Kiểm tra một số n: thử d từ 2, khi d²≤n. Gặp một ước là biết n không nguyên tố.</p><p>Sàng là đánh dấu cả đoạn để không kiểm tra lại từng số riêng.</p><p class="formula">Giữ p chưa bị gạch; gạch p², p²+p, p²+2p, … đến n.</p><p>Các bội p×2, …, p×(p−1) đã có ước nhỏ hơn p nên được gạch trước.</p><p>Mỗi hợp số có ước nguyên tố không vượt căn của nó. Vì vậy chỉ cần xét p²≤n.</p><p>Điều kiện: cần bảng đánh dấu từ 0 đến n. n quá lớn sẽ không đủ chỗ cho bảng.</p><p>Phân tích thừa số là viết n thành tích các số nguyên tố, như 72=2³×3².</p><p>Thử d từ 2; chia n cho d đến khi không chia hết. Sau đó mới tăng d.</p><p>Nếu còn n&gt;1 sau vòng d²≤n, phần còn lại là một thừa số nguyên tố.</p><p>Số chính phương có mọi số mũ chẵn. Muốn n×k chính phương, bổ sung mỗi thừa số có mũ lẻ.</p><p>Số 1 có phân tích rỗng và là chính phương. Quy ước cách in được ghi riêng trong sân tập.</p>',examples:[
      {question:'Số 1 có phải nguyên tố không?',answer:'không',explanation:'1 chỉ có một ước dương, không đủ hai ước.'},
      {question:'Khi p=3, bắt đầu gạch bội nào?',answer:'9',explanation:'Bắt đầu tại 3²=9; số 6 đã bị gạch khi p=2.'},
      {question:'12=2²×3. k dương nhỏ nhất để 12×k chính phương là bao nhiêu?',answer:'3',explanation:'Thêm một thừa số 3: 12×3=36=6².'}
    ]},
    simulation:{input:'30',alternateInput:'49',inputLabel:'Một số n từ 2 đến 60; hình hiển thị cả ô 0 và 1.',code:sieve,build,tracePython,render(root,state,index,states){return window.P2Arithmetic.render(root,state,index,states);}},
    model:{code:sieve,input:'30\n',output:'2 3 5 7 11 13 17 19 23 29\n'},
    activities:{
      output:{code:primeCode,input:'49\n',answer:'NO',explanation:'49 có ước 7; cần kiểm tra cả d²=n.'},
      parsons:{lines:['n = 12','d = 2','while d * d <= n:','    while n % d == 0:','        print(d)','        n //= d','    d += 1','if n > 1:','    print(n)'],validOrders:[[0,1,2,3,4,5,6,7,8],[1,0,2,3,4,5,6,7,8]],output:'2\n2\n3'},
      blank:{prompt:'Điền bội đầu tiên cần gạch của p.',template:countCode.replace('range(p * p, n + 1, p)','range(___, n + 1, p)'),answer:'p * p',tests:countTests},
      bug:{prompt:'Một dòng bỏ mất ước bằng căn n. Sửa để số 49 không bị nhận nhầm.',code:primeCode.replace('while d * d <= n:', 'while d * d < n:'),line:6,fix:'while d * d <= n:',tests:primeTests}
    },
    problems:[
      {id:'2-3-prime',title:'1. Có phải nguyên tố?',level:'Khởi động',statement:'Cho số nguyên không âm n. Kiểm tra n có đúng hai ước dương không.\n\nDữ liệu vào: một số n.\n\nKết quả: in YES nếu n nguyên tố, ngược lại in NO.',constraints:'0 ≤ n ≤ 100.000.',sample:{...primeTests[0],explanation:'29 chỉ có hai ước dương là 1 và 29.'},starter:reader+'n = int(input())\n# Nhớ loại số nhỏ hơn hai.\n',hints:['0 và 1 không nguyên tố.', 'Thử d từ 2 đến khi d×d vượt n.', 'Gặp n%d=0 thì kết luận NO; không gặp và n≥2 thì YES.'],solution:primeCode,brute:primeBrute,tests:primeTests,randomInput(seed){return random(seed)(0,2000)+'\n';},hiddenHint:'Em thử 0, 1, 2 và bình phương của một số nguyên tố.'},
      {id:'2-3-count',title:'2. Đếm nguyên tố đến n',level:'Cơ bản',statement:'Đếm các số nguyên tố không vượt n.\n\nDữ liệu vào: một số nguyên dương n.\n\nKết quả: số lượng nguyên tố từ 1 đến n.',constraints:'1 ≤ n ≤ 5000.',sample:{...countTests[0],explanation:'Có 10 số nguyên tố không vượt 30.'},starter:reader+'n = int(input())\n# Đánh dấu cả đoạn rồi đếm.\n',hints:['Tạo bảng prime gồm n+1 ô; loại ô 0 và 1.', 'Với p chưa bị gạch, gạch các bội từ p², bước nhảy p.', 'Dừng khi p²>n, rồi đếm các ô còn True.'],solution:countCode,brute:countBrute,tests:countTests,randomInput(seed){return random(seed)(1,300)+'\n';},hiddenHint:'Em thử n=1, n=2 và n đúng bằng bình phương của số nguyên tố.'},
      {id:'2-3-factor',title:'3. Tách thừa số',level:'Cơ bản',statement:'Phân tích n thành các thừa số nguyên tố. In từng thừa số theo thứ tự tăng dần, kể cả số lặp.\n\nDữ liệu vào: một số nguyên dương n.\n\nKết quả: các thừa số cách nhau bằng dấu cách. Riêng n=1, in 1 theo quy ước bài này.',constraints:'1 ≤ n ≤ 100.000.',sample:{...factorTests[0],explanation:'72=2×2×2×3×3; in 2 2 2 3 3.'},starter:reader+'n = int(input())\n# Chia hết một thừa số trước.\n',hints:['Thử d=2 trước; nếu chia hết thì ghi d.', 'Tiếp tục chia n cho d bằng while, không chỉ chia một lần.', 'Sau vòng d²≤n, nếu n>1 thì thêm n; phần còn lại đã nguyên tố.'],solution:factorCode,brute:factorBrute,tests:factorTests,randomInput(seed){return random(seed)(1,2000)+'\n';},hiddenHint:'Em thử n nguyên tố, n là lũy thừa của 2 và n=1.'},
      {id:'2-3-square',title:'4. Nhân thành chính phương',level:'Trung bình',statement:'Cho n dương. Tìm số nguyên dương k nhỏ nhất để n×k là số chính phương.\n\nDữ liệu vào: một số n.\n\nKết quả: giá trị k nhỏ nhất.',constraints:'1 ≤ n ≤ 10.000.',sample:{...squareTests[0],explanation:'12×3=36; k=1 và k=2 chưa tạo số chính phương.'},starter:reader+'n = int(input())\n# Bổ sung các số mũ lẻ.\n',hints:['Trong phân tích của số chính phương, mọi số mũ đều chẵn.', 'Đếm số lần chia hết mỗi thừa số d.', 'Mũ lẻ thì nhân k với d; mũ chẵn thì bỏ qua. Nhớ phần nguyên tố còn lại.'],solution:squareCode,brute:squareBrute,tests:squareTests,randomInput(seed){return random(seed)(1,1000)+'\n';},hiddenHint:'Em thử n vốn là chính phương, n nguyên tố và n có nhiều số mũ lẻ.'}
    ],
    exams:[
      {id:'csp-2025-so-chinh-phuong',title:'Bài 1. Số chính phương',note:'Phân tích thừa số giúp giữ phần có số mũ lẻ. Đếm cặp còn cần gom các phần bằng nhau.',hint:'Hai số có phần mũ lẻ giống nhau thì tích chính phương. Điều kiện i<j và ví dụ mâu thuẫn; cần chọn cách hiểu rõ ràng.',sourceNote:'Chuyên ĐH Sư phạm Hà Nội 2025 · Đề tham khảo.'},
      {id:'csp-2023-so-dac-biet',title:'Bài 1. Số đặc biệt',note:'Phân tích giúp sinh ước để tìm hai ước liên tiếp. Cách thử chia chỉ dùng cho dữ liệu nhỏ.',hint:'n đến 10¹⁸ cần kỹ thuật phân tích mạnh hơn thử chia đến căn. Sau khi sinh ước, còn phải sắp và xét chênh lệch.',sourceNote:'Chuyên ĐH Sư phạm Hà Nội 2023 · Thi thử lần 3.'}
    ],
    remember:{items:['Nguyên tố có đúng hai ước dương; 0 và 1 không nguyên tố.', 'Kiểm tra một số bằng các d thỏa 2≤d và d²≤n.', 'Sàng gạch từ p²; chỉ dùng p chưa bị gạch.', 'Phân tích phải chia hết từng thừa số, rồi giữ phần còn lại lớn hơn 1.', 'Số chính phương có tất cả số mũ nguyên tố chẵn.'],cost:'O(√n) cho kiểm tra hoặc thử chia. Sàng dùng O(n log log n) lượt và O(n) ô nhớ.',pitfalls:['Gạch từ p sẽ xóa chính số nguyên tố p; hãy bắt đầu từ p².', 'Dùng if thay while khi chia thừa số làm mất các lần lặp, như 8=2³.']},
    next:{text:'Khi lũy thừa quá lớn để viết ra, làm sao tính riêng số dư của nó?',href:'2-4-mod-luy-thua.html',title:'Phép mod, lũy thừa và chu kỳ'}
  };
})();
