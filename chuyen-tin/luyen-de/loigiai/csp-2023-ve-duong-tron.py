import sys
import math

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(data, 0)
    points = []
    for color in (1, -1):
        for _ in range(n):
            x, y = next(data), next(data)
            points.append((x * x + y * y, color))
    points.sort()
    balance, i = 0, 0
    while i < len(points):
        radius2 = points[i][0]
        # Tính cả biên: cộng hết nhóm cùng khoảng cách rồi mới kiểm tra.
        while i < len(points) and points[i][0] == radius2:
            balance += points[i][1]
            i += 1
        if balance == 0:
            print(f'{math.sqrt(radius2):.6f}')
            return

if __name__ == '__main__':
    main()
