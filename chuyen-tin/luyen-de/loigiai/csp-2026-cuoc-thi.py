import sys

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(data, 0)
    if not n:
        return
    capacity, budget = next(data), next(data)
    total = rooms = 0
    remainder = []
    for _ in range(n):
        value = next(data)
        total += value
        rooms += (value + capacity - 1) // capacity
        if value % capacity:
            remainder.append(value % capacity)
    remainder.sort()
    limit = rooms - (total + capacity - 1) // capacity
    removed = moved = 0
    for value in remainder:
        # Giới hạn sức chứa toàn cục và ngân sách điều chuyển.
        if removed == limit or moved + value > budget:
            break
        moved += value
        removed += 1
    print(rooms - removed, moved)

if __name__ == '__main__':
    main()
