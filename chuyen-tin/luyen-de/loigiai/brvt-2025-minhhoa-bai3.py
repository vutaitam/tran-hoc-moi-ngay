#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    n, limit = values[:2]
    a = values[2:]
    left = total = answer = 0
    for right, value in enumerate(a):
        total += value
        # Chỉ đúng vì mọi thời gian t_i đều dương.
        while total > limit:
            total -= a[left]
            left += 1
        answer = max(answer, right - left + 1)
    print(answer)

if __name__ == '__main__':
    main()

