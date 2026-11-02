#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

from bisect import bisect_right
from array import array

def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    xs = values[1:]
    maximum = max(xs)
    # Python int không tràn. Tiền tính vào mảng 64-bit để giảm chi phí
    # 100000 lần tìm nhị phân: bisect chạy trong thư viện C.
    sums = array('q', [0])
    total = k = 0
    while True:
        k += 1
        total += k * k
        if total > maximum:
            break
        sums.append(total)
    print(' '.join(str(bisect_right(sums, x) - 1) for x in xs))

if __name__ == '__main__':
    main()

