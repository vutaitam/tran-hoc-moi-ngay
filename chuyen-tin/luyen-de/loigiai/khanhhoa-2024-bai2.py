#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

def main():
    n, s = sys.stdin.buffer.read().split()
    # Hai lần thay thế độc lập; bytes.count đếm chồng lấp không phù hợp ở đây.
    aa = bb = 0
    for i in range(1, len(s)):
        aa += s[i - 1] != 66 and s[i] != 66  # Không phải B.
        bb += s[i - 1] != 65 and s[i] != 65  # Không phải A.
    print(max(aa, bb))

if __name__ == '__main__':
    main()

