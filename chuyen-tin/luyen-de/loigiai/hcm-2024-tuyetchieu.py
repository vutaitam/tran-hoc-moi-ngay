#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

from array import array

def main():
    values = map(int, sys.stdin.buffer.read().split())
    n, k = next(values), next(values)
    last = array('i', [0]) * 1000001
    answer = 1000001
    for i, a in enumerate(values, 1):
        # Hai lần liên tiếp cùng mã cho khoảng cách nhỏ nhất cần xét.
        if last[a] and i - last[a] < k:
            answer = min(answer, a)
        last[a] = i
    print(-1 if answer == 1000001 else answer)

if __name__ == '__main__':
    main()

