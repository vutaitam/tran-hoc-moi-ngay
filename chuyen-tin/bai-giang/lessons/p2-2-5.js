(() => {
  'use strict';
  const reader='import sys\ninput = sys.stdin.readline  # Đọc từng dòng.\n';
  const blocks=reader+`n = int(input())
lo, d, total = 1, 1, 0
hi, count = 0, 0
while lo <= n:
    hi = min(n, lo * 10 - 1)
    count = hi - lo + 1
    total += count * d
    lo *= 10
    d += 1
print(total)
`;
  const direct=reader+`n = int(input())
total = 0
for value in range(1, n + 1):
    total += len(str(value))
print(total)
`;
  const blockOracle=reader+`n = int(input())
answer = 0
threshold = 1
while threshold <= n:
    answer += n - threshold + 1
    threshold *= 10
print(answer)
`;
  const digits=reader+`n = int(input())
total = 0
while n > 0:
    total += n % 10
    n //= 10
print(total)
`;
  const digitsBrute=reader+`s = input().strip()
print(sum(int(ch) for ch in s))
`;
  const squares=reader+`from math import isqrt
n = int(input())
a = list(map(int, input().split()))
count = 0
for x in a:
    root = isqrt(x)
    if root * root == x:
        count += 1
print(count)
`;
  const squaresBrute=reader+`n = int(input())
a = list(map(int, input().split()))
count = 0
for x in a:
    lo, hi = 0, x
    while lo <= hi:
        mid = (lo + hi) // 2
        square = mid * mid
        if square == x:
            count += 1
            break
        if square < x:
            lo = mid + 1
        else:
            hi = mid - 1
print(count)
`;
  const kth=reader+`k = int(input())
start, d = 1, 1
while k > 9 * start * d:
    k -= 9 * start * d
    start *= 10
    d += 1
number = start + (k - 1) // d
index = (k - 1) % d
print(str(number)[index])
`;
  const kthBrute=reader+`k = int(input())
def length_to(n):
    total, threshold = 0, 1
    while threshold <= n:
        total += n - threshold + 1
        threshold *= 10
    return total
lo, hi = 1, k
while lo < hi:
    mid = (lo + hi) // 2
    if length_to(mid) >= k:
        hi = mid
    else:
        lo = mid + 1
index = k - length_to(lo - 1) - 1
print(str(lo)[index])
`;
  const random=seed=>{let x=Number(seed)>>>0;return(lo,hi)=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return lo+x%(hi-lo+1);};};
  const digitTests=['12030','0','1','9','10','99','100','1000','9007199254740993','999999999999999999999999999999999999','1000000000000000000000000000000000000','123456789012345678901234567890'].map(s=>({input:s+'\n',output:Array.from(s).reduce((t,ch)=>t+Number(ch),0)+'\n'}));
  function rootExact(value){let n=BigInt(value),lo=0n,hi=n;while(lo<hi){const mid=(lo+hi+1n)/2n;if(mid*mid<=n)lo=mid;else hi=mid-1n;}return lo;}
  const squareCases=[['1','2','4','9','15'],['0'],['1'],['2'],['4','4','4'],['15','16','17'],['99980000','99980001','99980002'],['1000000000'],['999999999999999999','1000000000000000000','1000000000000000001'],['999999999999999999999999999999999999','1000000000000000000000000000000000000'],['9007199254740991','9007199254740992','9007199254740993'],Array.from({length:200},(_,i)=>String(i*i))];
  const squareTests=squareCases.map(a=>({input:a.length+'\n'+a.join(' ')+'\n',output:a.filter(x=>rootExact(x)**2n===BigInt(x)).length+'\n'}));
  function lengthTo(n){n=BigInt(n);let t=0n;for(let p=1n;p<=n;p*=10n)t+=n-p+1n;return t;}
  const blockTests=['13','0','1','8','9','10','11','99','100','101','999','1000','999999999999999999','1000000000000000000'].map(n=>({input:n+'\n',output:lengthTo(n)+'\n'}));
  function kthExpected(k){k=BigInt(k);let lo=1n,hi=k;while(lo<hi){const mid=(lo+hi)/2n;if(lengthTo(mid)>=k)hi=mid;else lo=mid+1n;}return String(lo)[Number(k-lengthTo(lo-1n)-1n)];}
  const kthTests=['20','1','9','10','11','12','189','190','191','192','2889','2890','999999999999999999','1000000000000000000'].map(k=>({input:k+'\n',output:kthExpected(k)+'\n'}));
  const line=text=>blocks.split('\n').indexOf(text)+1;
  const loopLine=line('while lo <= n:'),sumLine=line('    total += count * d'),printLine=line('print(total)');
  function build(text){
    if(!/^\d+$/.test(text.trim()))throw Error('Nhập một số nguyên không âm.');
    const n=Number(text.trim());
    if(!Number.isSafeInteger(n)||n>99999)throw Error('Hình nhận N từ 0 đến 99.999.');
    let lo=1,d=1,total=0,hi=0,count=0;const states=[],rows=[];
    const save=(at,note,stage)=>states.push({values:[lo,d,hi,count,total],labels:['lo · đầu khối','d · độ dài','hi · cuối được lấy','count · số lượng','total · chữ số'],roles:['done','done',hi?'current':'pending',count?'source':'pending','current'],line:at,note,scene:{kind:'digits',n,lo,d,hi,count,total,rows:rows.map(r=>({...r})),stage}});
    save(loopLine,'Chưa đếm chữ số nào. Khối đầu gồm các số từ 1 đến 9.','start');
    while(lo<=n){hi=Math.min(n,lo*10-1);count=hi-lo+1;total+=count*d;rows.push({lo,d,hi,count,contribution:count*d});save(sumLine,`Khối ${d} chữ số lấy ${count} số. Thêm ${count} × ${d} = ${count*d} chữ số.`, 'count');lo*=10;d++;}
    save(printLine,`Tổng cộng ${total} chữ số. ${n===0?'Không viết số nào.':'Đã đếm đủ các số từ 1 đến N.'}`,'answer');
    states.forEach((s,i)=>{s.question=i+1<states.length?'Tổng chữ số total ở bước tiếp theo bằng bao nhiêu?':'Đã đếm xong; không còn khối tiếp theo.';s.predict=String(states[Math.min(i+1,states.length-1)].values[4]);});return states;
  }
  const tracePython=`import io, sys, json
states = []
lines = source.splitlines()
loop_line = lines.index('while lo <= n:') + 1
sum_line = lines.index('    total += count * d') + 1
next_line = lines.index('    lo *= 10') + 1
print_line = lines.index('print(total)') + 1
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v, here = frame.f_locals, frame.f_lineno
        if (here == loop_line and not states) or here in (next_line, print_line):
            shown = sum_line if here == next_line else here
            states.append({'values': [v[x] for x in ('lo','d','hi','count','total')], 'line': shown})
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
    id:'2-5',slug:'2-5-chu-so-khoi',title:'Chữ số, chính phương và đếm theo khối',chapter:2,
    goal:'Tách chữ số, kiểm tra chính phương chính xác và đếm cả khối khi N lớn.',prerequisite:'Biết chia nguyên, phép dư và lũy thừa.',
    warmup:[
      {question:'123 % 10 bằng bao nhiêu?',answer:'3',explanation:'Chia 10 lấy dư cho chữ số cuối.',hint:'123 = 12×10 + 3.'},
      {question:'123 // 10 bằng bao nhiêu?',answer:'12',explanation:'Chia nguyên cho 10 bỏ chữ số cuối của số không âm.',hint:'Không lấy phần dư.'}
    ],
    story:{html:'<p>Bài PASSWORD của Phổ thông Năng khiếu viết liền các số 1, 2, 3, … thành một dãy.</p><p>Thử đoạn 12345678910111213. Đừng nhầm vị trí chữ số với giá trị số đang viết.</p>',question:'Viết từ 1 đến 13 cần bao nhiêu chữ số?',answer:'17',explanation:'Chín số đầu dùng 9 chữ số. Bốn số tiếp theo dùng 4×2=8 chữ số.',hint:'Tách nhóm 1…9 và nhóm 10…13.'},
    brute:{html:'<p>Cách thẳng: viết từng số rồi cộng độ dài. Đúng với dữ liệu nhỏ, nhưng phải xét N số.</p><p>Những số có cùng độ dài đóng góp giống nhau. Ta có thể đếm chúng theo khối.</p>',code:direct,input:'13\n',output:'17\n',cost:'Đếm số vòng lặp chính; cách thẳng còn cần chuyển từng số thành chữ số.',count(n){return {slow:n,fast:String(n).length,slowLabel:'Xét từng số',fastLabel:'Xét từng khối độ dài'};}},
    idea:{html:'<p>Với số không âm, n%10 lấy chữ số cuối; n//10 bỏ chữ số cuối.</p><p>Riêng số 0 có một chữ số. Khi cộng chữ số, vòng lặp rỗng vẫn cho tổng đúng là 0.</p><p>Số chính phương có dạng k². Bài này cho phép k=0 nên 0 cũng được tính.</p><p><code>isqrt(x)</code> trả số nguyên r sao cho r²≤x&lt;(r+1)², với x không âm.</p><p class="formula">x là chính phương ⇔ r = isqrt(x) và r×r = x.</p><p>Dùng <code>from math import isqrt</code>. Không lấy căn bằng số thực rồi ép về số nguyên.</p><p>Số thực chỉ giữ hữu hạn chữ số chính xác. Căn làm tròn có thể sai gần một bình phương lớn.</p><p>Số nguyên Python giữ chính xác; phép nhân r×r vẫn cho phép kiểm tra đúng.</p><p>Để đếm chữ số từ 1 đến N, nhóm các số theo độ dài.</p><p class="formula">1…9: 9 số; 10…99: 90 số; 100…999: 900 số.</p><p>Khối d chữ số bắt đầu tại lo=10^(d−1). Khối đầy có 9×lo số.</p><p>Chặn cuối khối tại hi=min(N,10×lo−1). Khối cuối có thể chưa đầy.</p><p class="formula">Số chữ số được thêm = (hi − lo + 1) × d.</p><p>Muốn tìm chữ số thứ k, trừ các khối đầy trước nó. k bắt đầu từ 1.</p><p class="formula">Số cần tìm = lo + (k−1)//d; chỉ số chữ số = (k−1)%d.</p><p>Chỉ trừ khối khi k lớn hơn số chữ số của khối. Dấu bằng vẫn thuộc khối hiện tại.</p>',examples:[
      {question:'Tổng các chữ số của 12030 bằng bao nhiêu?',answer:'6',explanation:'1+2+0+3+0=6. Các chữ số 0 không làm tăng tổng.'},
      {question:'Có bao nhiêu số chính phương trong 1, 4, 4, 8, 16?',answer:'4',explanation:'Tính từng phần tử: hai số 4 được đếm hai lần.'},
      {question:'Chữ số thứ 12 trong 123456789101112… là gì?',answer:'1',explanation:'Bỏ 9 chữ số đầu; vị trí còn lại là 3. Đó là chữ số đầu của 11.'}
    ]},
    simulation:{input:'123',alternateInput:'9',inputLabel:'Nhập N từ 0 đến 99.999. Đếm chữ số khi viết từ 1 đến N.',code:blocks,build,tracePython,render(root,state,index,states){return window.P2Counting.render(root,state,index,states);}},
    model:{code:blocks,input:blockTests[0].input,output:blockTests[0].output},
    activities:{
      output:{code:blocks,input:'10\n',answer:'11',explanation:'Chín chữ số cho 1…9 và hai chữ số cho 10.'},
      parsons:{lines:['n = 12030','total = 0','while n > 0:','    total += n % 10','    n //= 10','print(total)'],validOrders:[[0,1,2,3,4,5],[1,0,2,3,4,5]],output:'6'},
      blank:{prompt:'Điền phép kiểm tra chính phương sau khi đã lấy căn nguyên.',template:squares.replace('root * root == x','___'),answer:'root * root == x',tests:squareTests},
      bug:{prompt:'Một dòng bỏ mất số cuối mỗi khối. Sửa để đếm đủ cả hai đầu.',code:blocks.replace('count = hi - lo + 1','count = hi - lo'),line:8,fix:'    count = hi - lo + 1',tests:blockTests}
    },
    problems:[
      {id:'2-5-digit-sum',title:'1. Tổng chữ số',level:'Khởi động',statement:'Cho số nguyên không âm n. Tính tổng các chữ số của n.\n\nDữ liệu vào: số n, không có chữ số 0 thừa ở đầu.\n\nKết quả: in tổng chữ số.',constraints:'0 ≤ n ≤ 10³⁶.',sample:{...digitTests[0],explanation:'1+2+0+3+0=6.'},starter:reader+'n = int(input())\n# Lấy từng chữ số cuối.\n',hints:['Lấy chữ số cuối bằng n%10.','Cộng chữ số vừa lấy, rồi bỏ nó bằng n//=10.','Lặp khi n>0. Nếu n=0, tổng ban đầu 0 đã đúng.'],solution:digits,brute:digitsBrute,tests:digitTests,randomInput(seed){const r=random(seed);return r(0,1000000000)+'\n';},hiddenHint:'Thử số 0 và số có nhiều chữ số 0 ở giữa.'},
      {id:'2-5-square-count',title:'2. Đếm số chính phương',level:'Cơ bản',statement:'Cho dãy n số nguyên không âm. Đếm các phần tử là số chính phương. Số 0 cũng được tính; các phần tử bằng nhau vẫn được đếm riêng.\n\nDữ liệu vào: dòng đầu là n. Dòng sau là n số.\n\nKết quả: in số phần tử chính phương.',constraints:'1 ≤ n ≤ 200; 0 ≤ mỗi số ≤ 10³⁶.',sample:{...squareTests[0],explanation:'Các số 1, 4, 9 là chính phương.'},starter:reader+'from math import isqrt\nn = int(input())\na = list(map(int, input().split()))\n# Kiểm tra từng phần tử.\n',hints:['Tính r=isqrt(x) để được căn nguyên chính xác.','x là chính phương khi r*r==x.','Đếm từng phần tử đạt điều kiện; không loại các số trùng nhau.'],solution:squares,brute:squaresBrute,tests:squareTests,randomInput(seed){const r=random(seed),n=r(1,20),a=Array.from({length:n},()=>{const x=r(0,100);return r(0,1)?x*x:r(0,10000);});return n+'\n'+a.join(' ')+'\n';},hiddenHint:'Thử 0, 1, số trùng và hai số ngay cạnh một bình phương lớn.'},
      {id:'2-5-length',title:'3. Viết đến N cần bao nhiêu chữ số?',level:'Cơ bản',statement:'Viết liền các số từ 1 đến N. Đếm tổng số chữ số đã viết. Với N=0, không viết số nào.\n\nDữ liệu vào: số N.\n\nKết quả: in tổng số chữ số.',constraints:'0 ≤ N ≤ 10¹⁸.',sample:{...blockTests[0],explanation:'1…9 dùng 9 chữ số; 10…13 dùng 8 chữ số.'},starter:reader+'n = int(input())\n# Chia thành các khối cùng độ dài.\n',hints:['Khối d chữ số bắt đầu tại 10^(d−1).','Đếm từ lo tới min(N,10*lo−1), gồm cả hai đầu.','Cộng số lượng nhân d; sau đó nhân lo với 10 và tăng d.'],solution:blocks,brute:blockOracle,tests:blockTests,randomInput(seed){const r=random(seed);return r(0,20000)+'\n';},hiddenHint:'Thử 0, 9, 10, 99 và 100. Khối cuối thường chưa đầy.'},
      {id:'2-5-kth',title:'4. Chữ số ở vị trí k',level:'Trung bình',statement:'Viết liên tiếp các số nguyên dương thành dãy 123456789101112…. Tìm chữ số thứ k, với vị trí đầu tiên là 1.\n\nDữ liệu vào: số k.\n\nKết quả: in một chữ số.',constraints:'1 ≤ k ≤ 10¹⁸.',sample:{...kthTests[0],explanation:'Sau 9 chữ số đầu, vị trí còn lại là 11. Đây là chữ số đầu của 15.'},starter:reader+'k = int(input())\n# Bỏ các khối đứng trước vị trí k.\n',hints:['Khối có d chữ số chứa 9*start*d chữ số, với start=10^(d−1).','Chỉ trừ cả khối khi k lớn hơn kích thước khối.','Lấy số start+(k−1)//d, rồi lấy ký tự ở chỉ số (k−1)%d.'],solution:kth,brute:kthBrute,tests:kthTests,randomInput(seed){const r=random(seed);return r(1,10000)+'\n';},hiddenHint:'Thử vị trí 9, 10, 189 và 190; đừng quên trừ 1 trước chia.'}
    ],
    exams:[
      {id:'ptnk-2023-password',title:'PASSWORD · Mật khẩu',note:'Dùng khối độ dài để tìm chữ số tại k, k+1, k+2 và k+3.',hint:'Ghép bốn ký tự, không đổi thành số nguyên. Nhờ vậy mật khẩu không mất số 0 đầu.',sourceNote:'Phổ thông Năng khiếu · Tuyển sinh 2023–2024.'},
      {id:'khtn-2026-sqrt',title:'SQRT · Số chính phương',note:'Dùng isqrt để kiểm tra từng phần tử. Số trùng nhau vẫn được đếm riêng.',hint:'Đề dùng số dương; số 1 được tính. Lấy căn nguyên rồi kiểm tra bình phương có bằng số ban đầu.',sourceNote:'KHTN · Tuyển sinh chuyên Tin 2026–2027.'},
      {id:'haizuka-2024-favoritenum',title:'FAVORITENUM · Chữ số yêu thích',note:'Khi N lớn, đếm các nhóm bội bằng chia nguyên. Trừ nhóm bội chung để không đếm hai lần.',hint:'Tên bài có chữ số, nhưng yêu cầu đếm bội của X hoặc Y. Dùng ƯCLN, BCNN và phép chia nguyên.',sourceNote:'HaiZuka 2024 · Bộ luyện tác giả.'}
    ],
    remember:{items:['n%10 lấy chữ số cuối; n//10 bỏ chữ số cuối của số không âm.','isqrt(x) cho căn nguyên chính xác; kiểm tra r*r==x để nhận chính phương.','Khối d chữ số có 9×10^(d−1) số nếu đã viết hết khối.','Khối cuối chỉ lấy đến N; đếm hai đầu bằng hi−lo+1.','Vị trí k từ 1 phải đổi thành k−1 trước khi chia và lấy dư.'],cost:'O(log N) khối độ dài thay cho O(N) số. Tách chữ số cũng dùng O(log N) bước.',pitfalls:['Không dùng căn số thực để quyết định chính phương khi số lớn.','Bốn chữ số mật khẩu phải ghép thành xâu để giữ số 0 đầu.']},
    next:{text:'Nếu chưa thấy cách đếm, thử các trường hợp nhỏ có giúp tìm quy luật không?',href:'3-1-quy-luat.html',title:'Thử nhỏ để tìm quy luật'}
  };
})();
