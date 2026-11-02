"""SENSOR — O(n log n) thời gian, O(n) bộ nhớ; stdin/stdout.
Khi thi: python3 ptnk-2026-sensor.py < SENSOR.INP > SENSOR.OUT
"""
import sys


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(values, None)
    if n is None:
        return
    prefix = [0]
    total = 0
    for i in range(1, n + 1):
        # Tổng 2*i trên [l,r] bằng (l+r)*(r-l+1).
        total += next(values) - 2 * i
        prefix.append(total)
    prefix.sort()
    answer = 0
    count = 0
    previous = None
    for value in prefix:
        if value == previous:
            # Thêm một tiền tố bằng nhau tạo count cặp mới.
            answer += count
            count += 1
        else:
            count = 1
            previous = value
    print(answer)


if __name__ == "__main__":
    main()
