#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

from collections import deque

def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    n = values[0]
    prefix = [0]
    for x in values[1:n + 1]:
        prefix.append(prefix[-1] + x)
    target = prefix[-1] - values[n + 1]
    if target <= 0:
        print(0)
        return
    dq = deque()
    answer = n + 1
    for r, total in enumerate(prefix):
        while dq and total - prefix[dq[0]] >= target:
            answer = min(answer, r - dq.popleft())
        # Chỉ số mới ở bên phải và tiền tố nhỏ hơn trội hơn đuôi cũ.
        while dq and prefix[dq[-1]] >= total:
            dq.pop()
        dq.append(r)
    print(answer if answer <= n else -1)

if __name__ == '__main__':
    main()

