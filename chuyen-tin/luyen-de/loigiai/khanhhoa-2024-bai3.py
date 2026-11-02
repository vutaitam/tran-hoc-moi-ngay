#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    n, k = values[0], values[1]
    a = values[2:]
    total = sum(a[:k])
    evens = sum(x % 2 == 0 for x in a[:k])
    best_total, best_evens, start = total, evens, 0
    for r in range(k, n):
        total += a[r] - a[r - k]
        evens += (a[r] % 2 == 0) - (a[r - k] % 2 == 0)
        # Hòa hoàn toàn thì giữ cửa sổ xuất hiện trước.
        if total > best_total or (total == best_total and evens > best_evens):
            best_total, best_evens, start = total, evens, r - k + 1
    print(start + 1, start + k)

if __name__ == '__main__':
    main()

