#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

from math import isqrt

def main():
    n = int(sys.stdin.buffer.read())
    answer = 0
    for d in range(1, isqrt(n) + 1):
        if n % d == 0:
            answer += 1 if d * d == n else 2
    print(answer)

if __name__ == '__main__':
    main()

