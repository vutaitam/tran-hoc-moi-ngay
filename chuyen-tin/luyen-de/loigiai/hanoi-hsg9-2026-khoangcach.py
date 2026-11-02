#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

from bisect import bisect_left

def main():
    stream = sys.stdin.buffer
    s = stream.readline().strip()
    positions = [[] for _ in range(26)]
    for i, c in enumerate(s, 1):
        positions[c - 97].append(i)
    q = int(stream.readline())
    answer = []
    all_bits = (1 << 26) - 1
    for _ in range(q):
        l, r = map(int, stream.readline().split())
        mask = 0
        # Python dùng danh sách vị trí thay tiền tố 26N để tiết kiệm bộ nhớ.
        for c, indices in enumerate(positions):
            j = bisect_left(indices, l)
            if j < len(indices) and indices[j] <= r:
                mask |= 1 << c
        value = 0
        for d in range(13, 0, -1):
            rotated = ((mask << d) | (mask >> (26 - d))) & all_bits
            if mask & rotated:
                value = d
                break
        answer.append(str(value))
    sys.stdout.write('\n'.join(answer) + '\n')

if __name__ == '__main__':
    main()

