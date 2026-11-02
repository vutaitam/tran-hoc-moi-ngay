"""EXPLORE — hai BFS, O(nm*M), M<=88; đọc stdin/ghi stdout.
Khi thi: python3 ptnk-2026-explore.py < EXPLORE.INP > EXPLORE.OUT
Đúng toàn bộ phát biểu; 1 giây có thể quá chặt cho Python ở trường hợp lớn.
"""
import sys


def main():
    stream = sys.stdin.buffer
    first = stream.readline().split()
    if not first:
        return
    n, m, k = map(int, first)
    width = m + 10
    size = (n + 10) * width
    infinity = n * m + 1
    # Viền dày 5 ô: mọi bước có d<=26 đều đáp trong mảng đã cấp phát.
    # Ô cấm/viền mang thời điểm 0 nên luôn bị loại khỏi cả hai BFS.
    wolf_time = [0] * size
    wolves = []
    start = target = -1
    for x in range(n):
        row = stream.readline().strip()
        base = (x + 5) * width + 5
        for y, character in enumerate(row):
            u = base + y
            if character == ord("#"):
                continue
            if character == ord("w"):
                wolves.append(u)
            else:
                wolf_time[u] = infinity
            if character == ord("s"):
                start = u
            elif character == ord("t"):
                target = u
    allowed = set(map(int, stream.read().split()))
    moves = [dx * width + dy
             for dx in range(-5, 6) for dy in range(-5, 6)
             if dx * dx + dy * dy in allowed]
    cardinal = (-width, width, -1, 1)
    # Duyệt list bằng for vẫn đọc các phần tử được append: hàng đợi BFS.
    for u in wolves:
        arrival = wolf_time[u] + 1
        for delta in cardinal:
            v = u + delta
            if wolf_time[v] == infinity:
                wolf_time[v] = arrival
                wolves.append(v)
    distance = [-1] * size
    distance[start] = 0
    queue = [start]
    for u in queue:
        arrival = distance[u] + 1
        for delta in moves:
            v = u + delta
            # Sói có thể chờ: chỉ thời gian đến sớm nhất của nhân vật có ích.
            # Đến cùng lúc sói cũng bị bắt, kể cả đích.
            if distance[v] == -1 and arrival < wolf_time[v]:
                if v == target:
                    print(arrival)
                    return
                distance[v] = arrival
                queue.append(v)
    print(-1)


if __name__ == "__main__":
    main()
