#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

# CÓ ĐIỀU KIỆN: giải 1 <= A <= B để gồm ví dụ, giữ cảnh báo mâu thuẫn PDF.
def prefix(n):
    blocks, rem = divmod(n, 9)
    return blocks * 45 + rem * (rem + 1) // 2

def main():
    a, b = map(int, sys.stdin.buffer.read().split())
    print(prefix(b) - prefix(a - 1))

if __name__ == '__main__':
    main()

