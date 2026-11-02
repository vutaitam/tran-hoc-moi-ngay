"""STREAK — O(T); đọc stdin, ghi stdout.
Khi thi: python3 ptnk-2025-streak.py < STREAK.INP > STREAK.OUT
"""
import sys


def main():
    stream = sys.stdin.buffer
    first = stream.readline()
    if not first:
        return
    t = int(first)
    current = best = 0
    for _ in range(t):
        # Cả IDLE và OFFLINE đều ngắt chuỗi ONLINE.
        if stream.readline().strip() == b"ONLINE":
            current += 1
            if current > best:
                best = current
        else:
            current = 0
    print(best)


if __name__ == "__main__":
    main()
