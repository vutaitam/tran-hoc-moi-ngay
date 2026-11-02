import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    current = 0  # Mọi lá bài đều dương nên 0 biểu diễn trạng thái rỗng.
    for i in range(1, n + 1):
        value = data[i]
        # Tiền tố đã xử lý còn tối đa một lá; ghép với lá kế tiếp.
        if current == 0:
            current = value
        elif current == value:
            current = 0
        elif value > current:
            current = value
    print(current)


if __name__ == '__main__':
    main()
