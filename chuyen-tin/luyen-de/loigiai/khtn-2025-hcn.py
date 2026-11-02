import sys
from bisect import bisect_left


def main():
    read = sys.stdin.buffer.readline
    n = int(read())
    tails = []
    for _ in range(n):
        length, width = map(int, read().split())
        # Đổi giảm theo (diện tích, chiều dài) thành tăng của cặp đổi dấu.
        # Không sắp xếp lại các hình; phải giữ thứ tự ban đầu.
        key = (-length * width, -length)
        position = bisect_left(tails, key)
        if position == len(tails):
            tails.append(key)
        else:
            tails[position] = key  # Cặp bằng nhau không làm tăng độ dài.
    print(len(tails))


if __name__ == '__main__':
    main()
