"""EVTRIP — O(N log N); đọc stdin, ghi stdout.
Khi thi: python3 ptnk-2025-evtrip.py < EVTRIP.INP > EVTRIP.OUT
"""
import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    n, capacity, target = data[:3]
    stations = sorted(data[3:3 + n])
    last = next_index = charges = 0
    while last + capacity < target:
        farthest = last
        reach = last + capacity
        while next_index < n and stations[next_index] <= reach:
            farthest = stations[next_index]
            next_index += 1
        if farthest <= last:
            print(-1)
            return
        # Cùng một lần sạc, chọn trạm xa nhất không làm giảm tầm với về sau.
        last = farthest
        charges += 1
    # Không tính pin đầy ban đầu hoặc việc đã tới đích là một lần sạc.
    print(charges)


if __name__ == "__main__":
    main()
