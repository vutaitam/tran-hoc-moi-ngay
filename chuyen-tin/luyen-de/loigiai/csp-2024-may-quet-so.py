import sys

def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    digits = data[0]
    blocked = set(data[1]) if len(data) > 1 else set()
    # dp[đã nhỏ hơn n][đã bắt đầu số]. Số 0 đệm không bị chặn.
    dp = [[1, 0], [0, 0]]
    for byte in digits:
        limit = byte - 48
        new = [[0, 0], [0, 0]]
        for less in (0, 1):
            for started in (0, 1):
                for digit in range(10 if less else limit + 1):
                    ns = int(started or digit != 0)
                    nl = int(less or digit < limit)
                    if ns and digit + 48 in blocked:
                        continue
                    new[nl][ns] += dp[less][started]
        dp = new
    # Loại trường hợp chưa bắt đầu: không đếm số 0.
    print(dp[0][1] + dp[1][1])

if __name__ == '__main__':
    main()
