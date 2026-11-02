#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

def main():
    n, k = map(int, sys.stdin.buffer.read().split())
    # Python int chứa được 7 * 10^9.
    print(n - 7 * k if n >= 7 * k else -1)

if __name__ == '__main__':
    main()

