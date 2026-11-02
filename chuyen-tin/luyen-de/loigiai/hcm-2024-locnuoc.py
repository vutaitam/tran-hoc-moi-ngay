#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

# CÓ ĐIỀU KIỆN: PDF in m <= 10^9. Không đọc đuôi r sau khi hết nước.

def integers():
    # Đọc khối, không read() toàn bộ vì đuôi dung tích có thể cực lớn.
    stream = sys.stdin.buffer
    number = 0
    active = False
    while True:
        block = stream.read1(65536)
        if not block:
            if active:
                yield number
            return
        for c in block:
            if 48 <= c <= 57:
                number = number * 10 + c - 48
                active = True
            elif active:
                yield number
                number = 0
                active = False

def main():
    values = integers()
    n, m = next(values), next(values)
    count = [0] * 100001
    maximum = 0
    for _ in range(n):
        a = next(values)
        count[a] += 1
        maximum = max(maximum, a)
    filled = [0] * (maximum + 1)
    active = n
    for t in range(1, maximum + 1):
        # F(t)-F(t-1) là số hệ thống có ít nhất t lít nước.
        filled[t] = filled[t - 1] + active
        active -= count[t]
    prefix = 0
    answer = []
    for _ in range(m):
        if prefix >= maximum:
            break
        r = next(values)
        end = min(maximum, prefix + r)
        answer.append(str(filled[end] - filled[prefix]))
        prefix = end
    print(' '.join(answer))

if __name__ == '__main__':
    main()

