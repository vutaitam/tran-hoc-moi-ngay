#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

def main():
    a, b = map(int, sys.stdin.buffer.read().split())
    # Phòng riêng không ghép thêm người; b học sinh ghép nhóm tối đa 3.
    print(a + (b + 2) // 3)

if __name__ == '__main__':
    main()

