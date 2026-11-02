"""LUCK — O(log n) thời gian, O(1) bộ nhớ. Đọc stdin, ghi stdout.
Khi thi với file: python3 ptnk-2023-luck.py < LUCK.INP > LUCK.OUT
"""
import sys


def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    n = int(data[0])
    # Dãy còn lại luôn là cấp số cộng first, first+step, ...
    first = step = 1
    while n > 1:
        first += step  # Giữ lá tại vị trí 2 trước tiên.
        step *= 3
        n = (n + 1) // 3
    print(first)


if __name__ == "__main__":
    main()
