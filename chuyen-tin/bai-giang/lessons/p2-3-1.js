(() => {
  'use strict';
  const header = 'import sys\ninput = sys.stdin.readline\n';
  const readN = header + 'n = int(input())\n';
  function random(seed) { let x=seed>>>0; return max=>{x+=0x6D2B79F5;let z=Math.imul(x^(x>>>15),1|x);z^=z+Math.imul(z^(z>>>7),61|z);return ((z^(z>>>14))>>>0)%max;}; }
  const pack = n => `${n}\n`;
  const cases = [0,1,2,3,4,5,6,7,29,30,31,1000,100000];
  const gameSolution = readN + 'print(int(n % 3 != 0))\n';
  const gameBrute = readN + `win = [0] * (n + 1)
for i in range(1, n + 1):
    if not win[i - 1] or (i >= 2 and not win[i - 2]):
        win[i] = 1
    else:
        win[i] = 0
print(win[n])
`;
  const gameAnswer = n => { const a=Array(n+1).fill(0);for(let i=1;i<=n;i++)a[i]=Number(!a[i-1]||(i>=2&&!a[i-2]));return `${a[n]}\n`; };
  const gameTests=cases.map(n=>({input:pack(n),output:gameAnswer(n)}));
  const boardRead=header+'rows, cols = map(int, input().split())\n';
  const boardSolution=boardRead+'print((rows * cols + 1) // 2)\n';
  const boardBrute=boardRead+`answer = 0
for r in range(rows):
    for c in range(cols):
        if (r + c) % 2 == 0:
            answer += 1
print(answer)
`;
  const boards=[[1,1],[1,2],[2,1],[2,2],[3,3],[3,4],[4,3],[5,7],[8,8],[1,101],[101,1],[160,101]];
  const boardPack=(r,c)=>`${r} ${c}\n`;
  const boardAnswer=(r,c)=>{let a=0;for(let i=0;i<r;i++)for(let j=0;j<c;j++)if((i+j)%2===0)a++;return `${a}\n`;};
  const oddSolution=readN+'print(n * n)\n';
  const oddBrute=readN+`total = 0
for i in range(1, n + 1):
    total += 2 * i - 1
print(total)
`;
  const alternateSolution=readN+'print(n // 2 if n % 2 == 0 else -(n + 1) // 2)\n';
  const alternateBrute=readN+`answer = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        answer += i
    else:
        answer -= i
print(answer)
`;
  function sumAnswer(n,odd) {let total=0;for(let i=1;i<=n;i++)total+=odd?2*i-1:(i%2?-i:i);return `${total}\n`;}
  const positive=cases.filter(n=>n>0);
  const trace=`import io, sys, json
snapshots = []
previous = 0
def trace(frame, event, arg):
    global previous
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v = frame.f_locals
        if frame.f_lineno == 5:
            snapshots.append({'values': v['win'][:], 'line': previous})
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
    id:'3-1',slug:'3-1-quy-luat',title:'Thử nhỏ để tìm quy luật',chapter:3,
    goal:'Thử vài trường hợp, đặt giả thuyết, rồi chứng minh trước khi dùng công thức.',
    prerequisite:'Em biết vòng lặp, số chẵn lẻ và phép chia lấy dư.',
    warmup:[
      {question:'17 chia 3 dư bao nhiêu?',answer:'2',explanation:'17 = 5 × 3 + 2.',hint:'Tìm bội của 3 gần 17 nhất, không vượt 17.'},
      {question:'Tổng 1 + 3 + 5 bằng bao nhiêu?',answer:'9',explanation:'Ba số lẻ đầu có tổng bằng 3 × 3.',hint:'Cộng lần lượt ba số.'}
    ],
    story:{html:'<p>Có n viên sỏi. Hai bạn luân phiên lấy 1 hoặc 2 viên; ai không lấy được sẽ thua.</p><p>Cả hai đều chọn cách tốt nhất. Em thử n từ 0 đến 6 trước khi đoán quy luật.</p>',question:'Có 3 viên, người đi trước thắng hay thua? Nhập 1 nếu thắng, 0 nếu thua.',answer:'0',explanation:'Lấy 1 thì bạn kia lấy 2; lấy 2 thì bạn kia lấy 1.',hint:'Thử cả hai nước đi của người đầu tiên.'},
    brute:{html:'<p>Gọi win[i] bằng 1 nếu người đang đến lượt thắng với i viên; ngược lại bằng 0.</p><p>Mỗi trạng thái thử lấy 1 hoặc 2 viên. Có nước để đối thủ thua thì mình thắng.</p>',code:gameBrute,input:'7\n',output:'1\n',cost:'Tối đa 2 × n nước đi được xét',count(n){return {slow:2*n,fast:1,slowLabel:'Thử tối đa hai nước mỗi số',fastLabel:'Một phép kiểm tra số dư'};}},
    idea:{html:'<p>Thử nhỏ cho mẫu: thua, thắng, thắng; rồi lặp lại. Đây mới là giả thuyết, chưa phải chứng minh.</p><p>Với 0 viên, không lấy được nên thua. Từ 3k viên, mọi nước đi đều sang nhóm thắng trước đó.</p><p>Từ 3k + 1 hoặc 3k + 2 viên, lấy phần dư để đưa đối thủ về 3k viên.</p><p>Như vậy mỗi nhóm ba số mới lại là thua, thắng, thắng. Lập luận nối tiếp này chứng minh mọi nhóm.</p><p><strong>Điều kiện:</strong> mỗi lượt chỉ lấy 1 hoặc 2 viên; ai không còn nước đi sẽ thua.</p><p>Đổi luật thì phải kiểm tra lại. Nếu được lấy 3 viên, n = 3 không còn là thế thua.</p>',examples:[
      {question:'Với 4 viên, nên lấy mấy viên để đối thủ gặp thế thua?',answer:'1',explanation:'Lấy 1, còn 3 viên.'},
      {question:'Với 8 viên, nên lấy mấy viên?',answer:'2',explanation:'Lấy 2, còn 6 viên, là bội của 3.'},
      {question:'Với 30 viên, win[30] bằng bao nhiêu?',answer:'0',explanation:'30 chia hết cho 3; kết luận dựa trên chứng minh, không chỉ bảng thử.'}
    ]},
    simulation:{input:'11\n',alternateInput:'6\n',inputLabel:'Nhập n từ 0 đến 15; 0 nghĩa là không còn viên sỏi.',code:gameBrute,
      build(text){
        if(!/^\s*\d+\s*$/.test(text))throw Error('Nhập một số nguyên từ 0 đến 15.');
        const n=Number(text.trim());if(n>15)throw Error('Nhập n không vượt 15 để nhìn rõ từng nhóm.');
        const win=Array(n+1).fill(0),states=[];
        function add(i,line,note){states.push({values:win.slice(),labels:win.map((_,j)=>`win[${j}]`),roles:win.map((_,j)=>j===i?'current':j===i-1||j===i-2?'source':j<=i?'done':'pending'),line,note,scene:{kind:'pattern',cursor:i,n},roleLabels:win.map((_,j)=>j>i?'… Chưa kết luận':j===i?'◎ Đang xét':j===i-1||j===i-2?'↗ Nước đi có thể tới':'✓ Đã kết luận'),question:'',predict:''});}
        add(0,4,'0 viên: người đang đến lượt thua vì không thể lấy.');
        for(let i=1;i<=n;i++){win[i]=Number(!win[i-1]||(i>=2&&!win[i-2]));add(i,win[i]?7:9,win[i]?`${i} viên: có nước đưa đối thủ sang thế thua.`:`${i} viên: cả hai nước đều đưa đối thủ sang thế thắng.`);}
        states.forEach((s,i)=>{s.predict=String(i<n?states[i+1].values[i+1]:win[n]);s.question=i<n?`Với ${i+1} viên, win[${i+1}] bằng 0 hay 1?`:`Đã xong: win[${n}] bằng bao nhiêu?`;});return states;
      },tracePython:trace,render(root,state,index,states){return window.P2Greedy.render(root,state,index,states);}},
    model:{code:gameBrute,input:'7\n',output:'1\n'},
    activities:{
      output:{code:'for n in range(4):\n    print(int(n % 3 != 0), end=" ")\n',input:'',answer:'0 1 1 0',explanation:'Các bội của 3 là thế thua.'},
      parsons:{lines:['n = 8','remainder = n % 3','if remainder == 0:','    print(0)','else:','    print(1)'],validOrders:[[0,1,2,3,4,5]],output:'1'},
      blank:{prompt:'Điền số dư của n khi chia cho 3.',template:gameSolution.replace('n % 3','___'),answer:'n % 3',tests:gameTests.slice(0,8)},
      bug:{prompt:'Code đảo ngược thế thắng và thua. Sửa dòng in kết quả.',code:gameSolution.replace('!= 0','== 0'),line:4,fix:'print(int(n % 3 != 0))',tests:gameTests.slice(0,8)}
    },
    problems:[
      {id:'3-1-stones',title:'1. Ai thắng với n viên?',level:'Khởi động',statement:'Hai bạn luân phiên lấy 1 hoặc 2 viên sỏi. Ai không lấy được sẽ thua; cả hai chơi tốt nhất.\n\nDữ liệu vào: một số nguyên n, là số viên ban đầu.\n\nKết quả: in 1 nếu người đi trước thắng, ngược lại in 0.',constraints:'0 ≤ n ≤ 10¹².',sample:{input:'8\n',output:'1\n',explanation:'Lấy 2 viên, đưa đối thủ về 6 viên.'},starter:readN+'# Kiểm tra nhóm của n.\n',hints:['Thử n từ 0 đến 8.','Các thế thua cách nhau 3 viên.','In 0 nếu n chia hết cho 3; ngược lại in 1.'],solution:gameSolution,brute:gameBrute,tests:gameTests,randomInput(seed){return pack(random(seed)(400));},hiddenHint:'Thử n=0, bội của 3 và hai số ngay sau nó.'},
      {id:'3-1-board',title:'2. Ô đen trên bàn cờ',level:'Cơ bản',statement:'Bảng có r hàng và c cột, tô đen trắng xen kẽ như bàn cờ. Ô góc trên bên trái màu đen.\n\nDữ liệu vào: r c trên một dòng.\n\nKết quả: in số ô đen.',constraints:'1 ≤ r, c ≤ 10⁹.',sample:{input:'3 3\n',output:'5\n',explanation:'Các hàng lần lượt có 2, 1, 2 ô đen.'},starter:boardRead+'# Đếm theo cặp ô.\n',hints:['Thử bảng 2×3 và 3×3.','Nếu có số ô chẵn, hai màu bằng nhau.','Nếu cả hai cạnh lẻ, màu đen nhiều hơn một ô.'],solution:boardSolution,brute:boardBrute,tests:boards.map(([r,c])=>({input:boardPack(r,c),output:boardAnswer(r,c)})),randomInput(seed){const r=random(seed);return boardPack(1+r(50),1+r(50));},hiddenHint:'Thử bảng một hàng, một cột và hai cạnh lẻ.'},
      {id:'3-1-odd-sum',title:'3. Ghép các lớp số lẻ',level:'Cơ bản',statement:'Tính tổng n số lẻ dương đầu tiên: 1 + 3 + 5 + ... + (2n − 1).\n\nDữ liệu vào: một số nguyên dương n.\n\nKết quả: in tổng cần tìm.',constraints:'1 ≤ n ≤ 10⁹.',sample:{input:'4\n',output:'16\n',explanation:'1 + 3 + 5 + 7 = 16.'},starter:readN+'# Tìm quy luật rồi chứng minh.\n',hints:['Tính tổng với n từ 1 đến 5.','Từ hình vuông cạnh n−1, thêm một lớp gồm 2n−1 ô.','Vì (n−1)² + 2n−1 = n², tổng luôn bằng n².'],solution:oddSolution,brute:oddBrute,tests:positive.map(n=>({input:pack(n),output:sumAnswer(n,true)})),randomInput(seed){return pack(1+random(seed)(500));},hiddenHint:'Đừng nhầm số lẻ thứ n với tổng n số lẻ.'},
      {id:'3-1-alternate',title:'4. Tổng đổi dấu',level:'Trung bình',statement:'Tính −1 + 2 − 3 + 4 − ... đến số n. Số lẻ bị trừ, số chẵn được cộng.\n\nDữ liệu vào: một số nguyên dương n.\n\nKết quả: in tổng, có thể âm.',constraints:'1 ≤ n ≤ 10¹².',sample:{input:'5\n',output:'-3\n',explanation:'Ghép hai cặp được 2, rồi trừ 5.'},starter:readN+'# Ghép hai số liên tiếp.\n',hints:['Mỗi cặp −(2k−1) + 2k có tổng bao nhiêu?','Nếu n chẵn, có n/2 cặp bằng 1.','Nếu n lẻ, ghép đến n−1 rồi trừ n.'],solution:alternateSolution,brute:alternateBrute,tests:positive.map(n=>({input:pack(n),output:sumAnswer(n,false)})),randomInput(seed){return pack(1+random(seed)(500));},hiddenHint:'Thử n=1 và n lẻ; đáp án không luôn dương.'}
    ],
    exams:[
      {id:'ptnk-2023-luck',title:'LUCK · Số may mắn',note:'PTNK 2023: thử dãy nhỏ để theo dõi các vị trí được giữ. Cần chứng minh quan hệ sau mỗi lượt.',hint:'<p>Vị trí mới j xuất phát từ vị trí cũ 3j − 1.</p><p>Dùng quan hệ này để truy ngược; đừng đoán lá cuối chỉ từ vài bảng thử.</p>',sourceNote:''},
      {id:'ptnk-2026-veryodd',title:'VERYODD · Số rất lẻ',note:'PTNK 2026: thử các ước nhỏ để nhận ra điều kiện chẵn lẻ. Đây chỉ là bước tìm cấu trúc.',hint:'<p>Hai ước cạnh nhau phải khác tính chẵn lẻ. Trên vòng tròn, số ước chẵn và lẻ phải bằng nhau.</p><p>Còn phải xét tổng các ước và đếm các ước phù hợp; bảng thử chưa giải xong bài.</p>',sourceNote:''}
    ],
    remember:{items:['Thử nhỏ giúp tìm giả thuyết, không thay chứng minh.','Ghi rõ trạng thái đầu tiên của quy luật.','Giải thích vì sao nhóm tiếp theo vẫn đúng.','Đổi luật thì kiểm tra lại công thức.','Dùng cách trâu để tìm phản ví dụ.'],cost:'Bảng trò chơi tốn O(n) thời gian và bộ nhớ. Công thức số dư dùng O(1) phép toán.',pitfalls:['Khớp 30 trường hợp không đảm bảo đúng mọi n.','Quên n=0 sẽ làm sai trạng thái đầu của trò chơi.']},
    next:{text:'Nếu nhiều thao tác giống nhau, em có thể tính gộp mà vẫn giữ đúng trạng thái cuối không?',href:'3-2-gop-buoc.html',title:'Mô phỏng và gộp bước'}
  };
})();
