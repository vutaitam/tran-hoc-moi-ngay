import sys

# CÓ ĐIỀU KIỆN: tự chọn điểm xuất phát, chép ký tự đầu miễn phí.
def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    source, target = data[2], data[3]
    positions = {}
    for i, character in enumerate(source):
        positions.setdefault(character, []).append(i)
    if any(character not in positions for character in target):
        print(-1)
        return
    infinity = 10 ** 18
    dp = [infinity] * n
    for i in positions[target[0]]:
        dp[i] = 0
    for k in range(1, m):
        current = positions[target[k - 1]]
        distance = [infinity] * n
        best = infinity
        # min(dp[p]+|p-q|), chỉ p,q mang cùng ký tự hiện tại.
        for i in current:
            best = min(best, dp[i] - i)
            distance[i] = best + i
        best = infinity
        for i in reversed(current):
            best = min(best, dp[i] + i)
            distance[i] = min(distance[i], best - i)
        new = [infinity] * n
        for i in current:
            if distance[i] >= infinity // 2:
                continue
            if i > 0 and source[i - 1] == target[k]:
                new[i - 1] = min(new[i - 1], distance[i] + 1)
            if i + 1 < n and source[i + 1] == target[k]:
                new[i + 1] = min(new[i + 1], distance[i] + 1)
        dp = new
    answer = min(dp)
    print(-1 if answer >= infinity // 2 else answer)

if __name__ == '__main__':
    main()
