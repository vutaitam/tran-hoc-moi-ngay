import sys


def main():
    # Đề dùng stdin/stdout. Đọc từng dòng để không giữ toàn bộ mảng.
    read = sys.stdin.buffer.readline
    n = int(read())
    smallest = None
    largest = None
    for _ in range(n):
        m, v = map(int, read().split())
        total = m + v
        if smallest is None or total < smallest:
            smallest = total
        if largest is None or total > largest:
            largest = total
    print(largest - smallest)


if __name__ == '__main__':
    main()
