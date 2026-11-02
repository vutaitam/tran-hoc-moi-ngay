"""ISLANDS — O(mn) thời gian, O(mn) bộ nhớ; đọc stdin, ghi stdout.
Khi thi: python3 ptnk-2023-islands.py < ISLANDS.INP > ISLANDS.OUT
Giới hạn 1 giây khá chặt với Python ở bảng lớn nhất; xem log Python riêng.
"""
import sys


def main():
    stream = sys.stdin.buffer
    first = stream.readline().split()
    if not first:
        return
    m, n = map(int, first)
    width = n + 2
    # Viền -1 cho phép xét bốn láng giềng không cần kiểm tra tọa độ.
    cells = [-1] * ((m + 2) * width)
    values = iter(map(int, stream.read().split()))
    for row in range(1, m + 1):
        base = row * width
        for col in range(1, n + 1):
            cells[base + col] = next(values)
    offsets = (-width, width, -1, 1)
    # Mã 0=nước, 1=đất chưa thăm, mã >=2 là đảo đã được đánh số.
    areas = [0, 0]
    best = 0
    for row in range(1, m + 1):
        base = row * width
        for col in range(1, n + 1):
            root = base + col
            if cells[root] != 1:
                continue
            label = len(areas)
            cells[root] = label
            stack = [root]
            count = 0
            while stack:
                u = stack.pop()
                count += 1
                for delta in offsets:
                    v = u + delta
                    if cells[v] == 1:
                        cells[v] = label  # Đánh dấu ngay khi đưa vào ngăn xếp.
                        stack.append(v)
            areas.append(count)
            if count > best:
                best = count
    for row in range(1, m + 1):
        base = row * width
        for col in range(1, n + 1):
            u = base + col
            if cells[u] != 0:
                continue
            # Một đảo kề nhiều cạnh chỉ được tính một lần.
            labels = {cells[u + delta] for delta in offsets}
            total = 1
            for label in labels:
                if label >= 2:
                    total += areas[label]
            if total > best:
                best = total
    print(best)


if __name__ == "__main__":
    main()
