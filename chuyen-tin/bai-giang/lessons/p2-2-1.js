(() => {
  'use strict';
  const reader = 'import sys\ninput = sys.stdin.readline\n';
  const count = reader + `n = int(input())
d, total = 1, 0
while d * d <= n:
    q, r = divmod(n, d)  # Thương nguyên và số dư.
    if r == 0:
        total += 1 if d == q else 2
    d += 1
print(total)
`;
  const countBrute = reader + `n = int(input())
total = 0
for d in range(1, n + 1):
    if n % d == 0:
        total += 1
print(total)
`;
  const proper = reader + `n = int(input())
total = 0
d = 1
while d * d <= n:
    if n % d == 0:
        q = n // d
        if d < n:
            total += d
        if q != d and q < n:
            total += q
    d += 1
print(total)
`;
  const properBrute = reader + `n = int(input())
print(sum(d for d in range(1, n) if n % d == 0))
`;
  const kth = reader + `n, k = map(int, input().split())
small, large = [], []
d = 1
while d * d <= n:
    if n % d == 0:
        small.append(d)
        if d * d != n:
            large.append(n // d)
    d += 1
divisors = small + large[::-1]  # Đảo nhóm ước lớn.
print(divisors[k - 1] if k <= len(divisors) else -1)
`;
  const kthBrute = reader + `n, k = map(int, input().split())
divisors = [d for d in range(1, n + 1) if n % d == 0]
print(divisors[k - 1] if k <= len(divisors) else -1)
`;
  const multiples = reader + `l, r, k = map(int, input().split())
print(r // k - (l - 1) // k)
`;
  const multiplesBrute = reader + `l, r, k = map(int, input().split())
answer = 0
for x in range(l, r + 1):
    if x % k == 0:
        answer += 1
print(answer)
`;
  function random(seed) {
    let state = Number(seed) >>> 0;
    return (lo, hi) => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return lo + (state >>> 8) % (hi - lo + 1);
    };
  }
  const divisorsOf = n => {
    const result = [];
    for (let d = 1; d <= n; d++) if (n % d === 0) result.push(d);
    return result;
  };
  const numbers = [36, 1, 2, 3, 4, 6, 12, 16, 25, 49, 97, 99991, 100000];
  const countTests = numbers.map(n => ({input: n + '\n', output: divisorsOf(n).length + '\n'}));
  const properTests = numbers.map(n => ({input: n + '\n', output: divisorsOf(n).filter(d => d < n).reduce((a, b) => a + b, 0) + '\n'}));
  const kthCases = [[36, 6], [1, 1], [1, 2], [2, 2], [4, 2], [6, 4], [12, 7], [16, 3], [25, 3], [49, 2], [97, 2], [99991, 3], [100000, 30]];
  const kthTests = kthCases.map(([n, k]) => ({input: `${n} ${k}\n`, output: (divisorsOf(n)[k - 1] ?? -1) + '\n'}));
  const multipleCases = [[4, 20, 3], [1, 1, 1], [1, 1, 2], [6, 6, 3], [7, 7, 3], [1, 12, 12], [12, 24, 12], [2, 8, 1], [1, 100, 101], [99, 101, 10], [1, 100000, 7], [99990, 100000, 100000]];
  const multipleTests = multipleCases.map(([l, r, k]) => {
    let answer = 0;
    for (let x = l; x <= r; x++) if (x % k === 0) answer++;
    return {input: `${l} ${r} ${k}\n`, output: answer + '\n'};
  });
  function build(text) {
    if (!/^\s*\d+\s*$/.test(text)) throw Error('Em nhập một số nguyên dương.');
    const n = Number(text);
    if (n < 1 || n > 144) throw Error('Hình dùng n từ 1 đến 144.');
    let d = 1, total = 0, q = 0, r = 0;
    const states = [], checked = [];
    const snapshot = (line, ended) => ({
      values: [n, d, q, r, total], labels: ['n', 'd', 'q · thương', 'r · dư', 'total · số ước'],
      roles: ['done', ended ? 'done' : 'current', 'done', r ? 'excluded' : 'done', 'done'],
      roleLabels: ['Số cần chia', ended ? 'Mốc đã vượt căn' : 'Ước đang thử', 'Thương vừa tính', 'Dư vừa tính', 'Số ước đã tìm'],
      scene: {kind: 'pairs', n, d, checked: checked.map(row => ({...row})), ended}, line,
      note: ended ? `Đã thử hết d²≤${n}. Có ${total} ước; mỗi cặp chỉ xét một lần.` : r ? `${n} chia ${d} dư ${r}. Không thêm ước nào.` : d === q ? `${d}×${q}=${n}. Hai đầu trùng nhau: chỉ thêm một ước.` : `${d}×${q}=${n}. Một lần chia tìm được hai ước.`,
    });
    while (d * d <= n) {
      q = Math.floor(n / d); r = n % d;
      if (r === 0) total += d === q ? 1 : 2;
      checked.push({d, q, r});
      states.push(snapshot(9, false));
      d++;
    }
    states.push(snapshot(10, true));
    states.forEach((s, i) => {
      s.predict = String(i + 1 < states.length ? states[i + 1].values[4] : total);
      s.question = i === states.length - 1 ? 'Đã dừng. Mọi cặp ước đều được đếm.' : i === states.length - 2 ? 'Khi dừng, total bằng bao nhiêu?' : `Sau khi thử d=${dFor(i)}, total bằng bao nhiêu?`;
    });
    function dFor(i) { return states[i].values[1] + 1; }
    return states;
  }
  const tracePython = `import io, sys, json
states = []
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v = frame.f_locals
        if frame.f_lineno in (9, 10):
            line = frame.f_lineno
            states.append({'values': [v['n'], v['d'], v['q'], v['r'], v['total']], 'line': line})
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
    id: '2-1', slug: '2-1-uoc-boi', title: 'Ước, bội và duyệt đến căn', chapter: 2,
    goal: 'Ghép cặp ước để bớt phép chia; đếm bội bằng hai mốc.',
    prerequisite: 'Biết phép chia nguyên //, số dư % và vòng lặp.',
    warmup: [
      {question: '17 % 5 bằng bao nhiêu?', answer: '2', explanation: '17=5×3+2; phần còn lại là số dư.', hint: 'Lấy 17 trừ bội lớn nhất của 5 không vượt 17.'},
      {question: 'Số nguyên lớn nhất có bình phương không vượt 30 là bao nhiêu?', answer: '5', explanation: '5²=25; 6²=36 đã vượt 30.', hint: 'Thử các bình phương quanh 30.'}
    ],
    story: {html: '<p>Bài Phần thưởng chia 36 gói kẹo, mỗi người nhận số gói bằng nhau.</p><p>Số người nhận phân biệt các cách chia; không xét danh tính từng người.</p><p>Chia cho 4 người được 9 gói mỗi người. Đổi hai số ấy, em được cách nào?</p>', question: 'Đổi lại thành 9 người, mỗi người nhận mấy gói?', answer: '4', explanation: '4×9=9×4=36. Hai cách chia đi thành một cặp.', hint: 'Số người và số gói mỗi người đổi vai.'},
    brute: {html: '<p>Ước dương của n là số dương chia n không dư.</p><p>Cách thẳng: thử mọi d từ 1 đến n. Mỗi d cần một phép chia lấy dư.</p>', code: countBrute, input: '36\n', output: '9\n', cost: 'Đếm phép chia lấy dư; bản ghép cặp dùng divmod cho cả thương và dư.', count(n) { return {slow: n, fast: Math.floor(Math.sqrt(n)), slowLabel: 'Thử từ 1 đến n', fastLabel: 'Thử đến căn nguyên của n'}; }},
    idea: {html: '<p>Nếu d chia hết n thì q=n//d cũng là ước. Ta có d×q=n.</p><p>Trong mỗi cặp, ít nhất một ước không vượt √n, tức căn bậc hai của n.</p><p>Nếu cả hai lớn hơn √n, tích của chúng sẽ lớn hơn n.</p><p class="formula">Thử d khi d×d ≤ n; chia hết thì lấy cả d và n//d.</p><p>Khi d=q, hai ước trùng nhau. Chỉ đếm một lần, như cặp 6×6 của 36.</p><p>Điều kiện: n là số nguyên dương. Dùng d×d≤n để tránh sai số căn bằng số thực.</p><p>Bội dương của k là k, 2k, 3k, … Số bội không vượt x là x//k.</p><p class="formula">Số bội trong [l,r] = r//k − (l−1)//k, với 1≤l≤r và k&gt;0.</p><p>Muốn in các ước tăng dần, giữ hai nhóm. Đảo nhóm ước lớn trước khi nối.</p>', examples: [
      {question: '12 có bao nhiêu ước dương?', answer: '6', explanation: 'Ba cặp 1×12, 2×6, 3×4 cho sáu ước.'},
      {question: '49 có bao nhiêu ước dương?', answer: '3', explanation: 'Cặp 1×49 cho hai ước; cặp 7×7 chỉ thêm một.'},
      {question: 'Từ 4 đến 20 có bao nhiêu bội của 3?', answer: '5', explanation: '6, 9, 12, 15, 18; cũng bằng 20//3−3//3.'}
    ]},
    simulation: {input: '36', alternateInput: '49', inputLabel: 'Một số nguyên dương n, từ 1 đến 144.', code: count, build, tracePython, render(root, state, index, states) { return window.P2Arithmetic.render(root, state, index, states); }},
    model: {code: count, input: '36\n', output: '9\n'},
    activities: {
      output: {code: count, input: '25\n', answer: '3', explanation: 'Các ước là 1, 5, 25; không đếm 5 hai lần.'},
      parsons: {lines: ['n = 12', 'd, total = 1, 0', 'while d * d <= n:', '    if n % d == 0:', '        total += 1 if d * d == n else 2', '    d += 1', 'print(total)'], validOrders: [[0,1,2,3,4,5,6],[1,0,2,3,4,5,6]], output: '6'},
      blank: {prompt: 'Điền điều kiện để nhận cả cặp ở đúng căn bậc hai.', template: count.replace('d * d <= n', '___'), answer: 'd * d <= n', tests: countTests},
      bug: {prompt: 'Một dòng đếm lặp ước giữa khi n là số chính phương. Em sửa dòng ấy.', code: count.replace('total += 1 if d == q else 2', 'total += 2'), line: 8, fix: '        total += 1 if d == q else 2', tests: countTests}
    },
    problems: [
      {id: '2-1-count', title: '1. Bao nhiêu cách chia?', level: 'Khởi động', statement: 'Có n gói kẹo. Chia hết cho một số người, mỗi người nhận bằng nhau. Đếm các số người có thể chọn.\n\nDữ liệu vào: một số nguyên dương n.\n\nKết quả: số ước dương của n.', constraints: '1 ≤ n ≤ 100.000.', sample: {...countTests[0], explanation: '36 có các ước 1, 2, 3, 4, 6, 9, 12, 18, 36.'}, starter: reader + 'n = int(input())\n# Ghép cặp ước của n.\n', hints: ['Số người phải chia hết số gói.', 'Mỗi ước d có bạn ghép n//d; chỉ thử d×d≤n.', 'Chia hết thì cộng 2, riêng d=n//d chỉ cộng 1.'], solution: count, brute: countBrute, tests: countTests, randomInput(seed) {return random(seed)(1, 1000) + '\n';}, hiddenHint: 'Em thử n=1, số nguyên tố và số chính phương.'},
      {id: '2-1-proper', title: '2. Tổng ước nhỏ hơn n', level: 'Cơ bản', statement: 'Cho n dương. Tính tổng mọi ước dương nhỏ hơn n. Mỗi ước chỉ cộng một lần.\n\nDữ liệu vào: một số n.\n\nKết quả: tổng cần tìm; không có ước phù hợp thì in 0.', constraints: '1 ≤ n ≤ 100.000.', sample: {...properTests[0], explanation: '1+2+3+4+6+9+12+18=55; không cộng 36.'}, starter: reader + 'n = int(input())\n# Cộng ước nhưng bỏ chính n.\n', hints: ['Duyệt cặp ước như bài đếm.', 'Kiểm tra từng đầu cặp có nhỏ hơn n không.', 'Chỉ cộng đầu q nếu q khác d; n=1 phải cho tổng 0.'], solution: proper, brute: properBrute, tests: properTests, randomInput(seed) {return random(seed)(1, 1000) + '\n';}, hiddenHint: 'Em thử n=1, n=6 và n=25 để kiểm tra loại n và ước trùng.'},
      {id: '2-1-kth', title: '3. Ước thứ k', level: 'Trung bình', statement: 'Sắp các ước dương của n tăng dần. Tìm ước thứ k, tính từ 1.\n\nDữ liệu vào: hai số n k.\n\nKết quả: ước thứ k; nếu không đủ k ước, in −1.', constraints: '1 ≤ n ≤ 100.000; 1 ≤ k ≤ 100.', sample: {...kthTests[0], explanation: 'Dãy ước là 1, 2, 3, 4, 6, 9, 12, 18, 36; ước thứ sáu là 9.'}, starter: reader + 'n, k = map(int, input().split())\n# Giữ nhóm ước nhỏ và lớn.\n', hints: ['Các d được tìm theo thứ tự tăng dần.', 'Các n//d lại giảm dần; lưu thành nhóm riêng.', 'Đảo nhóm lớn rồi nối sau nhóm nhỏ. Không thêm căn hai lần.'], solution: kth, brute: kthBrute, tests: kthTests, randomInput(seed) {const r=random(seed); return `${r(1, 500)} ${r(1, 30)}\n`;}, hiddenHint: 'Em thử k lớn hơn số ước và k nằm trong nhóm ước lớn.'},
      {id: '2-1-multiples', title: '4. Bội trong đoạn', level: 'Cơ bản', statement: 'Cho đoạn số nguyên dương từ l đến r, kể cả hai đầu. Đếm các số chia hết cho k.\n\nDữ liệu vào: ba số l r k.\n\nKết quả: số lượng bội trong đoạn.', constraints: '1 ≤ l ≤ r ≤ 100.000; 1 ≤ k ≤ 100.001.', sample: {...multipleTests[0], explanation: 'Các bội là 6, 9, 12, 15, 18.'}, starter: reader + 'l, r, k = map(int, input().split())\n# Lấy hai số lượng trừ nhau.\n', hints: ['Có x//k bội dương không vượt x.', 'Đếm đến r rồi bỏ các số trước l.', 'Trừ (l−1)//k, không trừ l//k; đầu l có thể là một bội.'], solution: multiples, brute: multiplesBrute, tests: multipleTests, randomInput(seed) {const r=random(seed),l=r(1,500); return `${l} ${l+r(0,500)} ${r(1,100)}\n`;}, hiddenHint: 'Em thử l=r, l chia hết k và đoạn không có bội.'}
    ],
    exams: [
      {id: 'brvt-2025-minhhoa-bai1', title: 'BAI1 · Phần thưởng', note: 'Ghép cặp ước để đếm các số người nhận kẹo. Cặp ở căn chỉ đóng góp một cách.', hint: 'Bà Rịa – Vũng Tàu 2025, đề minh họa. Đề cho n đến 10¹²; số lượt thử có thể đến một triệu.', sourceNote: 'Đề minh họa · Bà Rịa – Vũng Tàu 2025.'},
      {id: 'csp-2023-so-dac-biet', title: 'Bài 1. Số đặc biệt', note: 'Sinh ước giúp tìm hai ước liên tiếp. Duyệt căn chỉ phù hợp phần dữ liệu nhỏ.', hint: 'Sắp các ước, tìm hai số kề nhau chênh 1. n đến 10¹⁸ cần kỹ thuật phân tích mạnh hơn.', sourceNote: 'Chuyên ĐH Sư phạm Hà Nội 2023 · Thi thử lần 3.'}
    ],
    remember: {items: ['Ước dương d của n thỏa n%d=0; bội của d có dạng d×k.', 'Các ước đi thành cặp d và n//d; một đầu không vượt căn n.', 'Dùng d×d≤n; cặp trùng chỉ đếm một lần.', 'Nhóm ước lớn giảm dần, cần đảo trước khi nối.', 'Với l≥1 và k>0, đếm bội bằng r//k−(l−1)//k.'], cost: 'O(√n) nghĩa là số lượt tăng theo căn n, thay vì n. Đếm bội bằng công thức: O(1).', pitfalls: ['Dùng d×d<n làm mất ước căn khi n là số chính phương.', 'Số 1 có một ước; tổng ước nhỏ hơn 1 bằng 0.']},
    next: {text: 'Nếu cần ước chung lớn nhất của hai số rất lớn, có cần liệt kê hết ước không?', href: '2-2-ucln-bcnn.html', title: 'ƯCLN, BCNN và Euclid'}
  };
})();
