#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

from collections import deque

def possible(a, budget, power):
    groups = deque()
    c0 = c1 = c2 = used = 0
    for i, durability in enumerate(a):
        while groups and (i - groups[0][0]) ** 2 >= power:
            p, count = groups.popleft()
            c0 -= count
            c1 -= count * p
            c2 -= count * p * p
        damage = (power - i * i) * c0 + 2 * i * c1 - c2
        if damage >= durability:
            continue
        # Gộp các phát bắt buộc trúng cùng bia đầu tiên còn sống.
        shots = (durability - damage + power - 1) // power
        used += shots
        if used > budget:
            return False
        groups.append((i, shots))
        c0 += shots
        c1 += shots * i
        c2 += shots * i * i
    return True

def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    n, k = values[:2]
    a = values[2:]
    high = max(x + i * i for i, x in enumerate(a))
    if k == 1:
        print(high)
        return
    low = 1
    # Tăng X không tăng số phát cần: xem chứng minh trạng thái trong lời giải.
    while low < high:
        mid = (low + high) // 2
        if possible(a, k, mid):
            high = mid
        else:
            low = mid + 1
    print(low)

if __name__ == '__main__':
    main()

