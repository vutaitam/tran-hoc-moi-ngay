import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    population = [bin(mask).count('1') for mask in range(16)]
    # transitions[state] gồm (mask mới, trạng thái mới, số quân thêm).
    # state = a*16+b giữ hai cột trước; cách 1 cột lệch 2 hàng,
    # cách 2 cột lệch 1 hàng. Không có tấn công trong cùng cột.
    transitions = [[] for _ in range(256)]
    for a in range(16):
        for b in range(16):
            attacked = (b << 2) | (b >> 2) | (a << 1) | (a >> 1)
            transitions[a * 16 + b] = [
                (c, b * 16 + c, population[c])
                for c in range(16) if not c & attacked
            ]
    best = [-1] * 256
    ways = [0] * 256
    best[0], ways[0] = 0, 1
    for k in data[1:n + 1]:
        blocked = 0 if k == 0 else 1 << (k - 1)
        next_best = [-1] * 256
        next_ways = [0] * 256
        for state, score in enumerate(best):
            if score < 0:
                continue
            for mask, destination, gain in transitions[state]:
                if mask & blocked:
                    continue
                candidate = score + gain
                if candidate > next_best[destination]:
                    next_best[destination] = candidate
                    next_ways[destination] = ways[state]
                elif candidate == next_best[destination]:
                    next_ways[destination] += ways[state]
        best, ways = next_best, next_ways
    maximum = max(best)
    # int Python là số nguyên lớn, lưu chính xác L; không lấy modulo.
    count = sum(ways[state] for state in range(256) if best[state] == maximum)
    print(maximum, count)


if __name__ == '__main__':
    main()
