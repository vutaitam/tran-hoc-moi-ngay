#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    n, a = values[0], values[1:]
    left = [0] * n
    pref = [0] * (n + 1)
    height = a[0] - 1
    for i, x in enumerate(a):
        height = max(x, height + 1)
        left[i] = height
        pref[i + 1] = pref[i] + height - x
    # Quét ngược: suffix là chi phí sườn phải, chưa gồm đỉnh đang xét.
    height = a[-1] - 1
    suffix = 0
    answer = None
    for i in range(n - 1, -1, -1):
        height = max(a[i], height + 1)
        if 0 < i < n - 1:
            cost = pref[i] + suffix + max(left[i], height) - a[i]
            if answer is None or cost < answer:
                answer = cost
        suffix += height - a[i]
    print(answer)

if __name__ == '__main__':
    main()

