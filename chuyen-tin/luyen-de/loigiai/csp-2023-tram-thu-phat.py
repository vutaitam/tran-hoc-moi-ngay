import sys

def main():
    read = sys.stdin.buffer.readline
    first = read()
    if not first:
        return
    result = []
    for _ in range(int(first)):
        n, k = map(int, read().split())
        positions = [0] + list(map(int, read().split()))
        profits = map(int, read().split())
        dp = [0] * (n + 1)
        j = 0
        for i, profit in enumerate(profits, 1):
            while j + 1 < i and positions[j + 1] <= positions[i] - k:
                j += 1
            # Bỏ i, hoặc lấy i và nối với một tiền tố cách đủ xa.
            dp[i] = max(dp[i - 1], dp[j] + profit)
        result.append(str(dp[n]))
    sys.stdout.write('\n'.join(result))

if __name__ == '__main__':
    main()
