"""BLOCKOPT — LỜI GIẢI MỘT PHẦN, không coi DAG là cây.
Hỗ trợ DAG N<=22 (O(2^N), có thể TLE mức 1 giây) hoặc D=0, N<=50.
Ngoài phạm vi này: thoát mã 2, không in đáp án giả. Đọc stdin/ghi stdout.
Khi thi: python3 ptnk-2025-blockopt.py < BLOCKOPT.INP > BLOCKOPT.OUT
"""
import sys
from collections import deque


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    n, capacity = data[:2]
    fee = data[2:2 + 2 * n:2]
    size = data[3:2 + 2 * n:2]
    d = data[2 + 2 * n]
    prerequisite = [0] * n
    dependents = [[] for _ in range(n)]
    indegree = [0] * n
    pos = 3 + 2 * n
    for _ in range(d):
        a, b = data[pos] - 1, data[pos + 1] - 1
        pos += 2
        prerequisite[a] |= 1 << b
        dependents[b].append(a)
        indegree[a] += 1
    if d == 0:
        dp = [0] * (capacity + 1)
        for f, s in zip(fee, size):
            for used in range(capacity, s - 1, -1):
                candidate = dp[used - s] + f
                if candidate > dp[used]:
                    dp[used] = candidate
        print(dp[capacity])
        return
    if n > 22:
        print("PARTIAL: ho tro N<=22 hoac D=0; DAG N>22 chua duoc giai.", file=sys.stderr)
        raise SystemExit(2)
    queue = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in dependents[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    suffix = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        suffix[i] = suffix[i + 1] + fee[order[i]]
    best = 0

    def search(index, used, total, chosen):
        nonlocal best
        if total > best:
            best = total
        if index == n or total + suffix[index] <= best:
            return
        u = order[index]
        # Mọi tiên quyết đã được quyết định trước u trong thứ tự tô-pô.
        required = prerequisite[u]
        if used + size[u] <= capacity and chosen & required == required:
            search(index + 1, used + size[u], total + fee[u], chosen | (1 << u))
        search(index + 1, used, total, chosen)

    search(0, 0, 0, 0)
    print(best)


if __name__ == "__main__":
    main()
