import sys
import heapq

# CÓ ĐIỀU KIỆN: giả sử năng lượng ban đầu bằng 0.
def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(data, 0)
    chosen = []
    energy = 0
    for _ in range(n):
        value = next(data)
        heapq.heappush(chosen, value)
        energy += value
        # Khi âm, bỏ giá trị nhỏ nhất để giữ năng lượng còn lại lớn nhất.
        if energy < 0:
            energy -= heapq.heappop(chosen)
    print(len(chosen))

if __name__ == '__main__':
    main()
