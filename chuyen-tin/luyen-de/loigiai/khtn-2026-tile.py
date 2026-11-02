import sys


MOD = 998244853  # Đúng hằng số trong PDF, không đổi thành 998244353.


def main():
    n, a, b, c = map(int, sys.stdin.buffer.read().split())
    a %= MOD
    b %= MOD
    c %= MOD
    # f[0] = 1; các chỉ số âm bằng 0. Chỉ cần ba trạng thái gần nhất.
    f1, f2, f3 = 1, 0, 0
    for _ in range(n):
        next_value = (a * f1 + b * f2 + c * f3) % MOD
        f3, f2, f1 = f2, f1, next_value
    print(f1)


if __name__ == '__main__':
    main()
