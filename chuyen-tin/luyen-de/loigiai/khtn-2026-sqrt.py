import sys
from math import isqrt


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    answer = 0
    for i in range(1, n + 1):
        value = data[i]
        root = isqrt(value)  # Căn nguyên chính xác, không sai số số thực.
        if root * root == value:
            answer += 1
    print(answer)


if __name__ == '__main__':
    main()
