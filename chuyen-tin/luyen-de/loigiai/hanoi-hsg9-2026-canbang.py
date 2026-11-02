#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

from bisect import bisect_left

def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    n, k = values[:2]
    a = sorted(values[2:])
    answer = 0
    for x in a:
        lo = bisect_left(a, x - k)
        hi = bisect_left(a, x + k)
        # Không yêu cầu các phần tử nằm kề nhau trong đầu vào.
        if lo < n and hi < n and a[lo] == x - k and a[hi] == x + k:
            answer += 1
    print(answer)

if __name__ == '__main__':
    main()

