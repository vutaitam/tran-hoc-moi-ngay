(() => {
  'use strict';
  const reader = 'import sys\ninput = sys.stdin.readline  # Đọc từng dòng.\n';
  const maximum = reader + `n = int(input())
a = list(map(int, input().split()))
end = best = a[0]  # Đoạn phải có ít nhất một số.
for i in range(1, n):
    end = max(a[i], end + a[i])
    best = max(best, end)
print(best)
`;
  const minimum = reader + `n = int(input())
a = list(map(int, input().split()))
end = best = a[0]
for i in range(1, n):
    end = min(a[i], end + a[i])
    best = min(best, end)
print(best)
`;
  const maximumBrute = reader + `n = int(input())
a = list(map(int, input().split()))
best = a[0]
for l in range(n):
    total = 0
    for r in range(l, n):
        total += a[r]
        best = max(best, total)
print(best)
`;
  const minimumBrute = maximumBrute.replace('max(best, total)', 'min(best, total)');
  const count = reader + `n, k = map(int, input().split())
a = list(map(int, input().split()))
seen = {0: 1}  # Tổng 0 trước khi đọc dãy.
total = answer = 0
for value in a:
    total += value
    answer += seen.get(total - k, 0)
    seen[total] = seen.get(total, 0) + 1
print(answer)
`;
  const countBrute = reader + `n, k = map(int, input().split())
a = list(map(int, input().split()))
answer = 0
for l in range(n):
    total = 0
    for r in range(l, n):
        total += a[r]
        if total == k:
            answer += 1
print(answer)
`;
  const longest = reader + `n, k = map(int, input().split())
a = list(map(int, input().split()))
first = {0: 0}  # Trước dãy đã đọc 0 số.
total = best = 0
for r in range(1, n + 1):
    total += a[r - 1]
    need = total - k
    if need in first:
        best = max(best, r - first[need])
    if total not in first:
        first[total] = r
print(best)
`;
  const longestBrute = reader + `n, k = map(int, input().split())
a = list(map(int, input().split()))
best = 0
for l in range(n):
    total = 0
    for r in range(l, n):
        total += a[r]
        if total == k:
            best = max(best, r - l + 1)
print(best)
`;
  const arrayInput = a => `${a.length}\n${a.join(' ')}\n`;
  const targetInput = (a, k) => `${a.length} ${k}\n${a.join(' ')}\n`;
  const arrays = [
    [3, -5, 4, -1, 2], [-7], [0], [9], [-8, -3, -9], [0, 0, 0, 0],
    [1, 2, 3, 4], [5, -9, 2], [-2, 3, -1, 4, -8],
    [1000000000, 1000000000, -1], [-1000000000, -1000000000],
    Array.from({length: 150}, (_, i) => i % 2 ? -2 : 3), Array(300).fill(-1)
  ];
  const targetCases = [
    [[1, -1, 1], 1], [[-7], -7], [[-7], 0], [[0], 0], [[0, 0, 0, 0], 0],
    [[-2, -3, -1], -5], [[3, -3, 3, -3], 0], [[1, 2, 3], 10],
    [[1, 2, 3], 6], [[2, -1, 2, -1, 2], 3],
    [[1000000000, 1000000000, -1000000000], 1000000000],
    [Array(300).fill(0), 0], [Array.from({length: 200}, (_, i) => i % 2 ? -1 : 1), 0]
  ];
  function expected(a, k, kind) {
    let answer = kind === 'maximum' ? -Infinity : kind === 'minimum' ? Infinity : 0;
    for (let l = 0; l < a.length; l++) {
      let total = 0;
      for (let r = l; r < a.length; r++) {
        total += a[r];
        if (kind === 'maximum') answer = Math.max(answer, total);
        else if (kind === 'minimum') answer = Math.min(answer, total);
        else if (total === k) answer = kind === 'count' ? answer + 1 : Math.max(answer, r - l + 1);
      }
    }
    return answer + '\n';
  }
  const maxTests = arrays.map(a => ({input: arrayInput(a), output: expected(a, 0, 'maximum')}));
  const minTests = arrays.map(a => ({input: arrayInput(a), output: expected(a, 0, 'minimum')}));
  const countTests = targetCases.map(([a, k]) => ({input: targetInput(a, k), output: expected(a, k, 'count')}));
  const longestTests = targetCases.map(([a, k]) => ({input: targetInput(a, k), output: expected(a, k, 'longest')}));
  function randomCase(seed, withTarget) {
    let state = Number(seed) >>> 0;
    const rand = (lo, hi) => {state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return lo + state % (hi - lo + 1);};
    const n = rand(1, 18), kind = rand(0, 3), a = Array.from({length: n}, () => kind === 0 ? 0 : kind === 1 ? -rand(1, 8) : rand(-8, 8));
    return withTarget ? targetInput(a, rand(-15, 15)) : arrayInput(a);
  }
  function build(text) {
    const tokens = text.trim().split(/\s+/);
    if (tokens.some(v => !/^-?\d+$/.test(v))) throw Error('Em nhập các số nguyên, cách nhau bằng dấu cách.');
    const [n, ...a] = tokens.map(Number);
    if (n < 1 || n > 12 || a.length !== n || a.some(v => Math.abs(v) > 99)) throw Error('Nhập n từ 1 đến 12, rồi đúng n số từ −99 đến 99.');
    const states = [], labels = [...a.map((_, i) => `a[${i}]`), 'end: kết thúc ở đây', 'best: tốt nhất'];
    let end = a[0], best = a[0], start = 0, bestStart = 0, bestEnd = 0;
    // Geometry only: the numeric snapshots still mirror the Python locals.
    const snap = (i, line, note, oldEnd = null, oldStart = null) => states.push({
      values: [...a, end, best], labels: labels.slice(),
      roles: [...a.map((_, j) => j === i ? 'current' : j < i ? 'done' : 'pending'), 'source', 'current'],
      roleLabels: [...a.map((_,j)=>j===i?'◎ Đang xét':j<i?'✓ Đã xét':'… Chưa xét'),'↗ Tổng đoạn kết thúc ở đây','◎ Tổng tốt nhất đã gặp'],
      scene: {kind:'kadane',cursor:i,start,bestStart,bestEnd,oldEnd,oldStart}, line, note
    });
    snap(0, 5, `Bắt đầu bằng ${a[0]}, không lấy đoạn rỗng.`);
    for (let i = 1; i < n; i++) {
      const old = end, oldStart = start;
      if (a[i] > old + a[i]) start = i;
      end = Math.max(a[i], old + a[i]);
      if (end > best) {bestStart = start; bestEnd = i;}
      best = Math.max(best, end);
      snap(i, 8, `Chọn bắt đầu mới (${a[i]}) hoặc nối tiếp (${old}+${a[i]}). end=${end}, best=${best}.`, old, oldStart);
    }
    states.forEach((state, i) => {
      state.predict = String(states[i + 1]?.values[n + 1] ?? best);
      state.question = i < states.length - 1 ? 'Sau ô tiếp theo, best — tổng lớn nhất đã gặp — bằng bao nhiêu?' : 'Đã hết dãy. Không còn ô tiếp theo.';
      if (i === states.length - 1) state.note += ` Đã hết dãy. Tổng đoạn lớn nhất là ${best}.`;
    });
    return states;
  }
  const permutations = values => values.length ? values.flatMap((value, i) => permutations(values.filter((_, j) => j !== i)).map(rest => [value, ...rest])) : [[]];
  const tracePython = `import io, sys, json
states = []
def trace(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename == '<simulation>' and frame.f_lineno == 6:
        v = frame.f_locals
        states.append({'values': v['a'][:] + [v['end'], v['best']], 'line': 8 if 'i' in v else 5})
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
    id: '1-6', slug: '1-6-doan-con', title: 'Đoạn con: lớn nhất và bằng k', chapter: 1,
    goal: 'Tìm đoạn tốt nhất và đếm đoạn tổng bằng k, kể cả khi có số âm.',
    prerequisite: 'Biết tổng tiền tố, vòng lặp và từ điển đếm số lần xuất hiện.',
    warmup: [
      {question: 'Dãy 3, −5, 4 có tổng tiền tố 0, 3, −2, 2. Tổng đoạn vị trí 2..3 là bao nhiêu?', answer: '-1', explanation: 'Lấy 2−3=−1, bỏ phần trước vị trí 2.', hint: 'Tổng đoạn bằng tiền tố cuối trừ tiền tố trước đầu.'},
      {question: 'Tổng đang là 7. Thêm số −5 thì tổng mới bằng bao nhiêu?', answer: '2', explanation: 'Thêm số âm có thể làm tổng giảm.', hint: 'Tính 7+(−5).'}
    ],
    story: {html: '<p>Bài Cảm biến cần đếm các đoạn thỏa điều kiện về tổng.</p><p>Trước hết, thử dãy 3, −5, 4, −1, 2: đoạn liền nhau nào có tổng lớn nhất?</p><p>Em được chọn đầu và cuối, nhưng không được bỏ số ở giữa.</p>', question: 'Tổng lớn nhất là bao nhiêu?', answer: '5', explanation: 'Chọn đoạn 4, −1, 2 được 5. Chỉ lấy 3, 4, 2 không phải đoạn liền nhau.', hint: 'Thử đoạn bắt đầu từ số 4.'},
    brute: {html: '<p>Thử mọi đầu trái l. Mở rộng đầu phải r và cộng thêm từng số.</p><p>Cách này đúng cả khi có số âm. Với n=1000, có 500.500 đoạn cần xét.</p>', code: maximumBrute, input: maxTests[0].input, output: maxTests[0].output, cost: 'Đếm các phép so sánh chọn tổng: mỗi max giữa hai số là một phép; không tính đọc dữ liệu.', count(n) {return {slow:n*(n+1)/2,fast:2*(n-1),slowLabel:'Trâu: so sánh chọn best',fastLabel:'Kadane: so sánh chọn end và best'};}},
    idea: {html: '<p><strong>Kadane:</strong> gọi end là tổng lớn nhất của đoạn kết thúc đúng ở ô đang xét.</p><p>Đoạn ấy chỉ có hai lựa chọn: bắt đầu tại ô mới, hoặc nối ô mới vào đoạn trước.</p><p class="formula">end = max(a[i], end + a[i]); best = max(best, end).</p><p>best là tổng tốt nhất đã gặp ở mọi điểm kết thúc. Hai biến không có cùng nhiệm vụ.</p><p>Khởi tạo cả hai bằng a[0]. Dãy toàn âm vẫn phải chọn ít nhất một số.</p><p><strong>Tổng bằng k:</strong> ta cần nhớ các tổng tiền tố cũ, không chỉ tổng tốt nhất.</p><p class="formula">P[r] − P[l−1] = k ⇔ P[l−1] = P[r] − k.</p><p>Gọi total là tổng đã đọc. Từ điển seen lưu số lần mỗi tổng tiền tố xuất hiện.</p><p>seen.get(t, 0) lấy số lần gặp tổng t; chưa có thì trả 0.</p><p>Trước dãy, tổng 0 xuất hiện một lần: seen={0:1}. Nó giúp tính các đoạn bắt đầu từ ô đầu.</p><p class="formula">Thêm seen.get(total−k, 0) vào đáp án; sau đó mới tăng seen[total].</p><p>Tra trước, lưu sau để không đếm đoạn rỗng khi k=0. Nhiều tiền tố bằng nhau tạo nhiều đoạn khác nhau.</p><p>Ví dụ dãy 0, 0 có các tiền tố 0, 0, 0. Lượt đầu thêm 1 đoạn; lượt sau thêm 2.</p><p>Muốn đoạn dài nhất, lưu vị trí đầu tiên của mỗi tổng thay vì số lần gặp.</p><p>Đừng thay vị trí cũ bằng vị trí mới: đầu càng sớm, đoạn càng dài.</p><p>Số âm làm tổng lúc tăng, lúc giảm. Cửa sổ chỉ thu khi tổng lớn hơn k không còn đúng.</p>', examples: [
      {question: 'Dãy −8, −3, −9 có tổng đoạn lớn nhất là bao nhiêu?', answer: '-3', explanation: 'Chọn riêng −3. Đáp án 0 là chọn đoạn rỗng, không được phép.'},
      {question: 'Dãy 1, −1, 1 có bao nhiêu đoạn tổng bằng 1?', answer: '3', explanation: 'Hai đoạn một số 1 và đoạn cả dãy đều đạt.'},
      {question: 'Dãy 0, 0 có bao nhiêu đoạn không rỗng tổng bằng 0?', answer: '3', explanation: 'Chọn ô đầu, ô cuối hoặc cả hai. Vì thế cần nhớ số lần, không chỉ có hay không.'}
    ]},
    simulation: {input: '5\n3 -5 4 -1 2', alternateInput: '4\n-8 -3 -9 -2', inputLabel: 'Dòng đầu: n; dòng sau: n số. Hình dùng chỉ số từ 0.', code: maximum, build, tracePython},
    model: {code: maximum, input: maxTests[0].input, output: maxTests[0].output},
    activities: {
      output: {code: maximum, input: '3\n-8 -3 -9\n', answer: '-3', explanation: 'best bắt đầu bằng −8, rồi được cập nhật thành −3.'},
      parsons: {lines: ['a = [1, -1, 1]', 'k = 1', 'seen = {0: 1}', 'total = answer = 0', 'for value in a:', '    total += value', '    answer += seen.get(total - k, 0)', '    seen[total] = seen.get(total, 0) + 1', 'print(answer)'], validOrders: permutations([0,1,2,3]).map(order => [...order,4,5,6,7,8]), output: '3'},
      blank: {prompt: 'Điền tổng tiền tố cần tìm để đoạn mới có tổng bằng k.', template: count.replace('total - k', '___'), answer: 'total - k', tests: countTests.slice(0, 11)},
      bug: {prompt: 'Một dòng làm sai khi dãy toàn âm. Sửa để đoạn được chọn luôn có ít nhất một số.', code: maximum.replace('end = best = a[0]  # Đoạn phải có ít nhất một số.', 'end = best = 0'), line: 5, fix: 'end = best = a[0]', tests: maxTests.slice(0, 11)}
    },
    problems: [
      {id: '1-6-max', title: '1. Tổng đoạn lớn nhất', level: 'Khởi động', statement: 'Cho dãy số nguyên. Chọn một đoạn liên tiếp không rỗng có tổng lớn nhất.\n\nDữ liệu vào: dòng đầu ghi n. Dòng sau ghi n số.\n\nKết quả: in tổng lớn nhất.', constraints: '1 ≤ n ≤ 300; mỗi số từ −10⁹ đến 10⁹.', sample: {...maxTests[0], explanation: 'Đoạn 4, −1, 2 có tổng 5.'}, starter: reader + 'n = int(input())\na = list(map(int, input().split()))\n# Đoạn phải có ít nhất một số.\n', hints: ['Thử chọn từng điểm kết thúc của đoạn.', 'end là tổng tốt nhất kết thúc đúng ở đây. Chọn bắt đầu mới hoặc nối tiếp.', 'end=max(a[i],end+a[i]); cập nhật best. Khởi tạo cả hai bằng a[0], không bằng 0.'], solution: maximum, brute: maximumBrute, tests: maxTests, randomInput(seed) {return randomCase(seed, false);}, hiddenHint: 'Em thử một số, dãy toàn âm và đoạn tốt nhất nằm giữa dãy.'},
      {id: '1-6-min', title: '2. Tổng đoạn nhỏ nhất', level: 'Cơ bản', statement: 'Cho dãy số nguyên. Chọn một đoạn liên tiếp không rỗng có tổng nhỏ nhất.\n\nDữ liệu vào: dòng đầu ghi n. Dòng sau ghi n số.\n\nKết quả: in tổng nhỏ nhất.', constraints: '1 ≤ n ≤ 300; mỗi số từ −10⁹ đến 10⁹.', sample: {...minTests[0], explanation: 'Chọn riêng −5. Nối các số bên cạnh không cho tổng nhỏ hơn.'}, starter: reader + 'n = int(input())\na = list(map(int, input().split()))\n# Giữ đoạn nhỏ nhất kết thúc ở đây.\n', hints: ['Bài này giống tổng lớn nhất nhưng đổi tiêu chí chọn.', 'Dùng min để chọn bắt đầu mới hoặc nối tiếp.', 'end=min(a[i],end+a[i]); best=min(best,end). Dãy toàn dương vẫn không được trả 0.'], solution: minimum, brute: minimumBrute, tests: minTests, randomInput(seed) {return randomCase(seed, false);}, hiddenHint: 'Em thử dãy toàn dương, toàn âm và chỉ một số.'},
      {id: '1-6-count', title: '3. Đếm đoạn tổng bằng k', level: 'Cơ bản', statement: 'Cho dãy số nguyên và số k. Đếm các đoạn liên tiếp không rỗng có tổng bằng k. Hai đoạn khác đầu hoặc cuối được tính riêng.\n\nDữ liệu vào: dòng đầu ghi n k. Dòng sau ghi n số.\n\nKết quả: in số đoạn tìm được.', constraints: '1 ≤ n ≤ 300; mỗi số và k từ −10⁹ đến 10⁹.', sample: {...countTests[0], explanation: 'Hai số 1 riêng lẻ và cả dãy tạo ba đoạn.'}, starter: reader + 'n, k = map(int, input().split())\na = list(map(int, input().split()))\n# Đếm các tổng tiền tố đã gặp.\n', hints: ['Nếu tổng hiện tại là total, cần tiền tố cũ bằng total−k.', 'Dùng từ điển lưu số lần mỗi tổng xuất hiện. Bắt đầu với tổng 0 có một lần.', 'Cộng seen.get(total-k,0) trước khi tăng seen[total]. Thứ tự này loại đoạn rỗng.'], solution: count, brute: countBrute, tests: countTests, randomInput(seed) {return randomCase(seed, true);}, hiddenHint: 'Em thử k=0, nhiều số 0, số âm và đoạn bắt đầu ngay ô đầu.'},
      {id: '1-6-longest', title: '4. Đoạn dài nhất tổng bằng k', level: 'Trung bình', statement: 'Cho dãy số nguyên và số k. Tìm độ dài lớn nhất của đoạn liên tiếp không rỗng có tổng bằng k.\n\nDữ liệu vào: dòng đầu ghi n k. Dòng sau ghi n số.\n\nKết quả: in độ dài lớn nhất; không có thì in 0.', constraints: '1 ≤ n ≤ 300; mỗi số và k từ −10⁹ đến 10⁹.', sample: {...longestTests[0], explanation: 'Cả dãy có tổng 1 và dài 3.'}, starter: reader + 'n, k = map(int, input().split())\na = list(map(int, input().split()))\n# Lưu vị trí đầu của từng tổng.\n', hints: ['Cần tiền tố cũ bằng total−k. Muốn đoạn dài, chọn vị trí cũ sớm nhất.', 'first lưu số phần tử đã đọc khi mỗi tổng xuất hiện lần đầu. Bắt đầu first={0:0}.', 'Sau r số, độ dài là r-first[total-k]. Chỉ lưu total khi chưa có trong first.'], solution: longest, brute: longestBrute, tests: longestTests, randomInput(seed) {return randomCase(seed, true);}, hiddenHint: 'Em thử nhiều tiền tố bằng nhau, k=0 và không có đoạn phù hợp.'}
    ],
    exams: [
      {id: 'ptnk-2026-sensor', title: 'SENSOR · Cảm biến', note: 'Đổi mỗi a[i] thành a[i]−2i. Khi đó cần đếm đoạn có tổng bằng 0.', hint: 'Tổng 2i trên [l,r] bằng (r−l+1)(l+r). Hai tổng tiền tố bằng nhau xác định một đoạn đạt.', sourceNote: ''},
      {id: 'hanoi-hsg9-2026-xoadoan', title: 'XOADOAN · Xóa đoạn', note: 'Đổi điều kiện còn lại thành tổng đoạn bị xóa ≥ tổng cả dãy−S. Đây là bất đẳng thức, không phải bằng k.', hint: 'Tiền tố vẫn giúp tính tổng đoạn. Cách đếm bằng từ điển trong bài này chưa giải được điều kiện ≥. Dãy có số âm cần kỹ thuật tiếp theo.', sourceNote: 'HSG lớp 9 Hà Nội 2026, không phải tuyển sinh lớp 10; nguồn đăng lại.'}
    ],
    remember: {items: ['Đoạn liên tiếp không được bỏ số ở giữa; đoạn không rỗng phải chứa ít nhất một số.', 'Kadane giữ end tại điểm kết thúc hiện tại và best trên mọi điểm đã xét.', 'Đếm tổng bằng k: tìm tiền tố cũ bằng tổng hiện tại trừ k.', 'Đếm số đoạn thì lưu số lần; tìm đoạn dài nhất thì lưu vị trí đầu tiên.', 'Luôn thử toàn âm, toàn 0, một số và đoạn bắt đầu từ đầu dãy.'], cost: 'O(n) nghĩa là số bước chính tăng cùng n. Kadane dùng hai tổng; từ điển tiền tố dùng tối đa n+1 khóa.', pitfalls: ['Khởi tạo best=0 làm sai bài tổng lớn nhất khi dãy toàn âm.', 'Lưu tiền tố mới trước khi tra sẽ đếm đoạn rỗng khi k=0.']},
    next: {text: 'Nếu cần đoạn ngắn nhất có tổng ít nhất k và dãy có số âm, em phải nhớ gì thêm?', href: 'index.html', title: 'Trở lại bản đồ để ôn chương 1'}
  };
})();
