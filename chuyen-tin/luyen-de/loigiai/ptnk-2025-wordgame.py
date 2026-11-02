"""WORDGAME — DP đoạn O(n²) thời gian, O(n) bộ nhớ; stdin/stdout.
Khi thi: python3 ptnk-2025-wordgame.py < WORDGAME.INP > WORDGAME.OUT
"""
import sys


def main():
    s = sys.stdin.buffer.readline().strip()
    if not s:
        return
    n = len(s)
    dp = [0] * n
    for left in range(n - 2, -1, -1):
        diagonal = 0  # Đoạn rỗng f[left+1][left].
        first = s[left]
        for right in range(left + 1, n):
            old = dp[right]  # f[left+1][right] trước khi ghi đè.
            if first == s[right]:
                dp[right] = diagonal
            else:
                previous = dp[right - 1]  # f[left][right-1].
                dp[right] = 1 + (old if old < previous else previous)
            diagonal = old
    print(dp[-1])


if __name__ == "__main__":
    main()
