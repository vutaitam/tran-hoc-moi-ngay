(() => {
  'use strict';
  const reader = 'import sys\ninput = sys.stdin.readline  # Đọc từng dòng.\n';
  const lower = reader + `n, x = map(int, input().split())
a = list(map(int, input().split()))
lo, hi = 0, n  # hi không thuộc khoảng tìm.
while lo < hi:
    mid = (lo + hi) // 2  # Chỉ số ô giữa.
    if a[mid] < x:
        lo = mid + 1
    else:
        hi = mid
print(lo + 1 if lo < n else -1)
`;
  const linear = reader + `n, x = map(int, input().split())
a = list(map(int, input().split()))
answer = -1
for i in range(n):
    if a[i] >= x:
        answer = i + 1
        break
print(answer)
`;
  const count = reader + `n, x = map(int, input().split())
a = list(map(int, input().split()))
lo, hi = 0, n
while lo < hi:
    mid = (lo + hi) // 2  # Chỉ số ô giữa.
    if a[mid] < x:
        lo = mid + 1
    else:
        hi = mid
left = lo  # Vị trí đầu không nhỏ hơn x.
lo, hi = 0, n
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] <= x:
        lo = mid + 1
    else:
        hi = mid
print(lo - left)
`;
  const countBrute = reader + `n, x = map(int, input().split())
a = list(map(int, input().split()))
answer = 0
for value in a:
    if value == x:
        answer += 1
print(answer)
`;
  const square = reader + `x = int(input())
lo, hi = 0, x  # Giữ cả hai đầu lo, hi.
while lo < hi:
    mid = (lo + hi + 1) // 2  # Làm tròn lên để còn tiến.
    if mid * mid <= x:
        lo = mid
    else:
        hi = mid - 1
print(lo)
`;
  const squareBrute = reader + `x = int(input())
answer = 0
while (answer + 1) * (answer + 1) <= x:
    answer += 1
print(answer)
`;
  const capacity = reader + `n, k = map(int, input().split())
a = list(map(int, input().split()))
lo, hi = max(a), sum(a)
while lo < hi:
    mid = (lo + hi) // 2
    groups, total = 1, 0
    for value in a:
        if total + value > mid:
            groups += 1
            total = value
        else:
            total += value
    if groups <= k:
        hi = mid
    else:
        lo = mid + 1
print(lo)
`;
  // Independent quadratic partition oracle: no binary search or greedy grouping.
  const capacityBrute = reader + `n, k = map(int, input().split())
a = list(map(int, input().split()))
pre = [0]
for value in a:
    pre.append(pre[-1] + value)
large = sum(a) + 1
dp = [0] + [large] * n
for groups in range(1, min(k, n) + 1):
    new = [0] + [large] * n
    for r in range(1, n + 1):
        for l in range(r):
            cost = max(dp[l], pre[r] - pre[l])
            new[r] = min(new[r], cost)
    dp = new
print(dp[n])
`;
  const random = seed => {
    let state = Number(seed) >>> 0;
    return (lo, hi) => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return lo + state % (hi - lo + 1);
    };
  };
  const arrayInput = (a, x) => `${a.length} ${x}\n${a.join(' ')}\n`;
  const sortedCases = [
    [[1, 2, 4, 4, 6, 8, 9], 4], [[5], 5], [[5], 6], [[5], -2],
    [[-9, -5, -5, -1], -5], [[0, 0, 0], 0], [[2, 2, 2], 1],
    [[2, 2, 2], 3], [[-3, 0, 4, 10], 3], [[-3, 0, 4, 10], 10],
    [[-1000000000, 0, 1000000000], 1000000000],
    [Array.from({length: 2000}, (_, i) => i - 1000), 500],
    [Array(2000).fill(7), 7]
  ];
  const lowerTests = sortedCases.map(([a, x]) => ({input: arrayInput(a, x), output: String(a.findIndex(v => v >= x) + 1 || -1) + '\n'}));
  const countTests = sortedCases.map(([a, x]) => ({input: arrayInput(a, x), output: a.filter(v => v === x).length + '\n'}));
  const squareTests = [10, 0, 1, 2, 3, 4, 8, 9, 15, 16, 99980000, 99980001, 99980002, 100000000].map(x => {
    let answer = 0;
    while ((answer + 1) ** 2 <= x) answer++;
    return {input: x + '\n', output: answer + '\n'};
  });
  const capacityCases = [
    [[7, 2, 5, 10, 8], 2], [[5], 1], [[1, 2, 3], 1], [[1, 2, 3], 3],
    [[4, 4, 4, 4], 2], [[9, 1, 1, 9], 2], [[1, 1, 1, 1, 1], 2],
    [[1000000000, 1000000000, 1000000000], 1], [[1, 9, 1, 1], 3],
    [[8, 1, 1, 1, 8], 3], [Array(80).fill(100), 7],
    [Array.from({length: 100}, (_, i) => i % 7 + 1), 10]
  ];
  function partitionExpected(a, k) {
    const n = a.length, pre = [0];
    a.forEach(value => pre.push(pre[pre.length - 1] + value));
    let dp = [0, ...Array(n).fill(Infinity)];
    for (let groups = 1; groups <= Math.min(k, n); groups++) {
      const next = [0, ...Array(n).fill(Infinity)];
      for (let r = 1; r <= n; r++) for (let l = 0; l < r; l++) next[r] = Math.min(next[r], Math.max(dp[l], pre[r] - pre[l]));
      dp = next;
    }
    return dp[n];
  }
  const capacityTests = capacityCases.map(([a, k]) => ({input: arrayInput(a, k), output: partitionExpected(a, k) + '\n'}));
  function randomSorted(seed) {
    const rand = random(seed), n = rand(1, 20), a = Array.from({length: n}, () => rand(-12, 12)).sort((a, b) => a - b);
    return arrayInput(a, rand(-15, 15));
  }
  function build(text) {
    const tokens = text.trim().split(/\s+/);
    if (tokens.some(v => !/^-?\d+$/.test(v))) throw Error('Em nhập các số nguyên, cách nhau bằng dấu cách.');
    const [n, x, ...a] = tokens.map(Number);
    if (n < 1 || n > 12 || a.length !== n || !Number.isSafeInteger(x) || Math.abs(x) > 99 || a.some(v => Math.abs(v) > 99)) throw Error('Nhập n từ 1 đến 12, rồi đúng n số từ −99 đến 99.');
    if (a.some((v, i) => i && v < a[i - 1])) throw Error('Dãy cần tăng dần, có thể lặp số.');
    let lo = 0, hi = n, mid = 0;
    const states = [], labels = [...a.map((_, i) => `a[${i}]`), 'lo', 'hi · mốc', 'mid'];
    while (lo < hi) {
      mid = Math.floor((lo + hi) / 2);
      states.push({values: [...a, lo, hi, mid], labels: labels.map((label, i) => i === hi && hi < n ? label + ' · mốc đủ lớn' : label), roles: [...a.map((_, i) => i === mid ? 'current' : i >= lo && i < hi ? 'pending' : 'excluded'), 'done', 'done', 'current'], line: 7,
        note: `Ô giữa có giá trị ${a[mid]}. ${a[mid] < x ? `Nhỏ hơn ${x}: bỏ cả ô giữa và bên trái.` : `Không nhỏ hơn ${x}: lưu mid làm mốc hi, rồi thử bên trái.`} ${hi < n ? 'Mốc hi trong dãy vẫn có thể là đáp án.' : 'Mốc hi=n nằm sau dãy, không phải ô để đọc.'}`});
      if (a[mid] < x) lo = mid + 1; else hi = mid;
    }
    states.push({values: [...a, lo, hi, mid], labels: labels.slice(), roles: [...a.map((_, i) => i === lo ? 'current' : 'excluded'), 'done', 'done', 'done'], line: 12,
      note: (lo < n ? `Hai đầu gặp nhau tại chỉ số ${lo}. Vị trí trong đề là ${lo + 1}.` : 'Hai đầu gặp nhau sau dãy. Không có số đủ lớn.') + ` Đã dừng; mid giữ giá trị cuối ${mid}.`});
    states.forEach((state, i) => {
      const [left, right, middle] = state.values.slice(n), ended = i === states.length - 1;
      state.roleLabels = [...a.map((_, j) => !ended && j === middle ? '◎ Đang xét' : j >= left && j < right ? 'Còn tìm' : j === right ? '◇ Mốc đủ lớn' : '× Đã loại'), 'Mốc trái', 'Mốc phải, không thuộc khoảng', ended ? 'Giá trị cuối, không đọc nữa' : 'Chỉ số đang đọc'];
      state.predict = String(i < states.length - 2 ? states[i + 1].values[n + 2] : -1);
      state.question = i < states.length - 1 ? 'Chỉ số mid ở lượt sau là bao nhiêu? Nếu dừng, nhập −1.' : 'Đã dừng. Không còn lượt tìm tiếp theo.';
    });
    return states;
  }
  const tracePython = `import io, sys, json
states = []
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>':
        v = frame.f_locals
        if frame.f_lineno == 8:
            states.append({'values': v['a'][:] + [v['lo'], v['hi'], v['mid']], 'line': 7})
        elif frame.f_lineno == 12:
            states.append({'values': v['a'][:] + [v['lo'], v['hi'], v['mid']], 'line': 12})
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
    id: '1-5', slug: '1-5-tim-kiem-nhi-phan', title: 'Tìm kiếm nhị phân', chapter: 1,
    goal: 'Bỏ một nửa mỗi lượt; tìm trong dãy và tìm đáp án nhỏ nhất đủ tốt.',
    prerequisite: 'Biết dãy đã sắp xếp, chỉ số và vòng lặp while.',
    warmup: [
      {question: 'Dãy 2, 4, 4, 9 tăng dần. Số đầu tiên không nhỏ hơn 4 nằm ở vị trí nào?', answer: '2', explanation: 'Vị trí 2 chứa số 4 đầu tiên.', hint: 'Không nhỏ hơn nghĩa là lớn hơn hoặc bằng.'},
      {question: 'a = [2, 4, 9]. a[0] bằng bao nhiêu?', answer: '2', explanation: 'Python đánh chỉ số từ 0; vị trí trong đề thường bắt đầu từ 1.', hint: 'Chỉ số 0 là ô đầu.'}
    ],
    story: {html: '<p>Bài Cân bằng cần tìm hai giá trị quanh mỗi số.</p><p>Trước hết, thử tìm số 8 trong dãy 1, 3, 5, 8, 12, 20, 30.</p><p>Nhìn ô giữa trước: em bỏ được bên nào?</p>', question: 'Ô giữa có giá trị bao nhiêu?', answer: '8', explanation: 'Có bảy ô; ô thứ tư là ô giữa.', hint: 'Đếm từ hai đầu vào giữa.'},
    brute: {html: '<p>Cách thẳng: đọc từng ô từ trái sang phải, gặp số đủ lớn thì dừng.</p><p>Mỗi câu hỏi có thể đọc hết n ô. Dãy đã sắp xếp giúp ta bỏ nhiều ô cùng lúc.</p>', code: linear, input: lowerTests[0].input, output: lowerTests[0].output, cost: 'Đếm so sánh giá trị trong trường hợp xấu nhất; dãy đã tăng dần, không tính đọc dữ liệu.', count(n) {return {slow:n,fast:Math.floor(Math.log2(n))+1,slowLabel:'Tìm lần lượt: so sánh giá trị',fastLabel:'Chia đôi: so sánh giá trị'};}},
    idea: {html: '<p>Tìm kiếm nhị phân là chia đôi khoảng còn nghi ngờ sau mỗi lần so sánh.</p><p>Trong dãy tăng dần, ta tìm ô đầu tiên có giá trị lớn hơn hoặc bằng x.</p><p class="formula">a[mid] &lt; x → lo = mid + 1; ngược lại → hi = mid.</p><p>mid là chỉ số ô giữa. Khoảng cần đọc tiếp gồm lo, không gồm hi.</p><p>hi giữ mốc có thể là đáp án; ta chỉ tìm xem còn ô nào sớm hơn.</p><p>Ban đầu lo=0, hi=n. Khi hi=n, chưa có mốc trong dãy; không đọc a[n].</p><p>Khi lo=hi, ta dừng. Nếu lo=n thì không tìm thấy; ngược lại, vị trí trong đề là lo+1.</p><p>Gặp số bằng x vẫn tìm bên trái. Nhờ vậy, số lặp không làm ta bỏ mất ô đầu.</p><p><strong>Tìm theo đáp án:</strong> thử một mức, rồi hỏi mức ấy có làm được không.</p><p>Chia các gói dương thành nhiều nhất k nhóm liên tiếp. Mức tải lớn hơn không làm việc chia khó hơn.</p><p>M là tổng tối đa được phép trong mỗi nhóm. Ghép thêm gói đến khi vượt M thì mở nhóm mới.</p><p>Nhóm hiện tại càng dài, phần còn lại càng ngắn; cách này dùng ít nhóm nhất.</p><p>Nếu cần không quá k nhóm, thử giảm M. Nếu cần nhiều nhóm hơn, phải tăng M.</p><p class="formula">M nhỏ: chưa đủ → M lớn: đủ. Tìm mức đủ đầu tiên.</p>', examples: [
      {question: 'Dãy 1, 2, 4, 4, 6. Tìm vị trí đầu có giá trị từ 4 trở lên.', answer: '3', explanation: 'Hai số 4 cùng đạt; lấy vị trí sớm hơn.'},
      {question: 'Số nguyên lớn nhất có bình phương không vượt 10 là bao nhiêu?', answer: '3', explanation: '3²=9 đạt, nhưng 4²=16 không đạt. Mốc đúng rồi sai chỉ đổi một lần.'},
      {question: 'Gói 7, 2, 5, 10, 8 chia nhiều nhất hai nhóm. Tải nhỏ nhất là bao nhiêu?', answer: '18', explanation: 'Chia [7,2,5] và [10,8] được 18. Mức 17 cần ba nhóm.'}
    ]},
    simulation: {input: '7 4\n1 2 4 4 6 8 9', alternateInput: '5 9\n-3 0 2 4 8', inputLabel: 'Dòng đầu: n x; dòng sau: n số tăng dần. Hình dùng chỉ số từ 0.', code: lower, build, tracePython},
    model: {code: lower, input: lowerTests[0].input, output: lowerTests[0].output},
    activities: {
      output: {code: lower, input: '4 3\n1 3 3 7\n', answer: '2', explanation: 'Tìm số 3 đầu tiên, không dừng ở bất kỳ số 3 nào.'},
      parsons: {lines: ['a = [1, 3, 3, 7]', 'x = 3', 'lo, hi = 0, len(a)', 'while lo < hi:', '    mid = (lo + hi) // 2', '    if a[mid] < x:', '        lo = mid + 1', '    else:', '        hi = mid', 'print(lo + 1)'], validOrders: [[0,1,2,3,4,5,6,7,8,9],[1,0,2,3,4,5,6,7,8,9],[0,2,1,3,4,5,6,7,8,9]], output: '2'},
      blank: {prompt: 'Điền điều kiện để bỏ nửa trái khi ô giữa còn quá nhỏ.', template: lower.replace('a[mid] < x', '___'), answer: 'a[mid] < x', tests: lowerTests.slice(0, 11)},
      bug: {prompt: 'Một dòng làm chương trình bỏ qua các số bằng x. Sửa để lấy vị trí đầu tiên.', code: lower.replace('if a[mid] < x:', 'if a[mid] <= x:'), line: 8, fix: '    if a[mid] < x:', tests: lowerTests.slice(0, 11)}
    },
    problems: [
      {id: '1-5-first', title: '1. Ô đầu đủ lớn', level: 'Khởi động', statement: 'Cho dãy tăng dần, có thể lặp số. Tìm vị trí đầu tiên có giá trị lớn hơn hoặc bằng x. Vị trí bắt đầu từ 1.\n\nDữ liệu vào: dòng đầu ghi n x. Dòng sau ghi n số của dãy.\n\nKết quả: in vị trí tìm được; không có thì in −1.', constraints: '1 ≤ n ≤ 2000; giá trị và x từ −10⁹ đến 10⁹.', sample: {...lowerTests[0], explanation: 'Vị trí 3 là số 4 đầu tiên.'}, starter: reader + 'n, x = map(int, input().split())\na = list(map(int, input().split()))\n# Tìm vị trí đầu đủ lớn.\n', hints: ['Dãy tăng dần nên các ô quá nhỏ đứng trước các ô đủ lớn.', 'Giữ khoảng từ lo đến trước hi. Ô giữa quá nhỏ thì bỏ cả nó.', 'Lặp khi lo<hi; cập nhật lo=mid+1 hoặc hi=mid. Đừng đọc a[n].'], solution: lower, brute: linear, tests: lowerTests, randomInput: randomSorted, hiddenHint: 'Em thử x nhỏ hơn cả dãy, lớn hơn cả dãy và nhiều số trùng.'},
      {id: '1-5-count', title: '2. Có bao nhiêu số x?', level: 'Cơ bản', statement: 'Cho dãy tăng dần. Đếm số lần x xuất hiện.\n\nDữ liệu vào: dòng đầu ghi n x. Dòng sau ghi n số của dãy.\n\nKết quả: in số lần xuất hiện; không có thì in 0.', constraints: '1 ≤ n ≤ 2000; giá trị và x từ −10⁹ đến 10⁹.', sample: {...countTests[0], explanation: 'Có hai số 4 cạnh nhau.'}, starter: reader + 'n, x = map(int, input().split())\na = list(map(int, input().split()))\n# Tìm hai mốc của nhóm x.\n', hints: ['Các số bằng x đứng thành một nhóm liên tiếp.', 'Tìm ô đầu có giá trị ≥x và ô đầu có giá trị >x.', 'Lấy mốc sau trừ mốc trước. Mốc sau có thể bằng n.'], solution: count, brute: countBrute, tests: countTests, randomInput: randomSorted, hiddenHint: 'Em thử không có x, cả dãy bằng x và x nằm cuối dãy.'},
      {id: '1-5-square', title: '3. Bình phương vừa đủ', level: 'Cơ bản', statement: 'Cho số nguyên không âm x. Tìm số nguyên không âm y lớn nhất sao cho y² ≤ x.\n\nDữ liệu vào: một số x.\n\nKết quả: in y.', constraints: '0 ≤ x ≤ 100.000.000.', sample: {...squareTests[0], explanation: '3²=9 ≤10, còn 4²=16 >10.'}, starter: reader + 'x = int(input())\n# Tìm y lớn nhất còn hợp lệ.\n', hints: ['Các số y hợp lệ đứng trước các số không hợp lệ.', 'Bài này giữ cả hai đầu lo, hi. Nếu mid²≤x, giữ mid và thử lớn hơn; ngược lại đặt hi=mid−1.', 'Dùng mid=(lo+hi+1)//2 khi gán lo=mid. Làm tròn lên giúp khoảng luôn ngắn đi.'], solution: square, brute: squareBrute, tests: squareTests, randomInput(seed) {const rand=random(seed); return rand(0, 20000)+'\n';}, hiddenHint: 'Em thử 0, 1 và các số ngay trước hoặc sau một bình phương.'},
      {id: '1-5-load', title: '4. Chia gói theo tải', level: 'Trung bình', statement: 'Có n gói xếp theo thứ tự, mỗi gói nặng một số dương. Chia thành nhiều nhất k nhóm liên tiếp, không bỏ gói. Hãy làm tổng nặng nhất trong các nhóm nhỏ nhất.\n\nDữ liệu vào: dòng đầu ghi n k. Dòng sau ghi n khối lượng.\n\nKết quả: in tổng nhóm nặng nhất nhỏ nhất có thể.', constraints: '1 ≤ k ≤ n ≤ 100; 1 ≤ mỗi khối lượng ≤ 10⁹.', sample: {...capacityTests[0], explanation: 'Hai nhóm [7,2,5] và [10,8] nặng 14 và 18.'}, starter: reader + 'n, k = map(int, input().split())\na = list(map(int, input().split()))\n# Thử một mức tải rồi đếm nhóm.\n', hints: ['Đáp án không nhỏ hơn gói nặng nhất và không lớn hơn tổng cả dãy.', 'Thử mức tải M: ghép thêm gói nếu còn vừa, nếu không thì mở nhóm mới.', 'Cần không quá k nhóm nghĩa là M đủ lớn. Tìm mức đủ đầu tiên bằng chia đôi.'], solution: capacity, brute: capacityBrute, tests: capacityTests, randomInput(seed) {const rand=random(seed),n=rand(1,10),k=rand(1,n);return arrayInput(Array.from({length:n},()=>rand(1,20)),k);}, hiddenHint: 'Em thử k=1, k=n và một gói nặng hơn hẳn các gói còn lại.'}
    ],
    exams: [
      {id: 'hanoi-hsg9-2026-canbang', title: 'CANBANG · Cân bằng', note: 'Với mỗi a[i], tìm cả a[i]−K và a[i]+K trong dãy đã sắp xếp.', hint: 'Dãy gồm các số phân biệt. Mỗi tâm chỉ tính một lần khi tìm thấy cả hai bên.', sourceNote: 'HSG lớp 9 Hà Nội 2026, không phải đề tuyển sinh lớp 10; nguồn đăng lại.'},
      {id: 'csp-2023-cong-day', title: 'Bài 3. Cộng dãy', note: 'Tìm mốc đổi dấu sau mỗi lần cộng chung. Tiền tố giúp cộng nhanh hai phần quanh mốc.', hint: 'Gọi s là tổng lượng đã cộng. Tìm ô đầu a[i]≥−s trong dãy gốc đã sắp xếp.', sourceNote: 'Thi thử lần 3.'},
      {id: 'khanhhoa-2024-bai4', title: 'BAI4 · Bài 4 — Tổng số chính phương', note: 'Muốn lấy nhiều số nhất, chọn các bình phương dương nhỏ nhất. Tìm số lượng bằng nhị phân.', hint: 'Tổng k bình phương đầu là k(k+1)(2k+1)/6. Tổng này tăng theo k; không cần căn bằng số thực.', sourceNote: 'Khánh Hòa 2024; tên chủ đề là mô tả bổ sung, nguồn đăng lại.'}
    ],
    remember: {items: ['Chỉ chia đôi khi điều kiện đổi đúng một lần theo thứ tự đang xét.', 'Tìm trong mảng cần dãy đã sắp xếp; tính cả công sắp xếp nếu dãy chưa có thứ tự.', 'Khoảng [lo,hi) gồm lo, không gồm hi; hi=n không phải ô để đọc.', 'Tìm đáp án nhỏ nhất đủ tốt: đạt thì giảm hi, chưa đạt thì tăng lo.', 'Mỗi lượt phải thu hẹp khoảng; thử kỹ hai phần tử, số lặp và trường hợp không có.'], cost: 'O(log n) nghĩa là số lượt tăng chậm như số lần chia đôi n. Tìm tải: O(n log S), với S là tổng khối lượng.', pitfalls: ['Dãy chưa sắp xếp thì không được bỏ nửa theo giá trị giữa.', 'Gán lo=mid với mid làm tròn xuống có thể lặp mãi khi hi=lo+1.']},
    next: {text: 'Nếu dãy có cả số âm, làm sao tìm đoạn tổng lớn nhất hoặc tổng bằng k?', href: '1-6-doan-con.html', title: 'Đoạn con: lớn nhất và bằng k'}
  };
})();
