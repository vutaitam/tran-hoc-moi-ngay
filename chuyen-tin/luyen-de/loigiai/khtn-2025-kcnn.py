import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    last = {}
    answer = n
    for i in range(n):
        value = data[i + 1]
        previous = last.get(value)
        # Với đầu phải i, lần xuất hiện gần nhất cho khoảng cách nhỏ nhất.
        if previous is not None:
            answer = min(answer, i - previous)
        last[value] = i
    print(-1 if answer == n else answer)


if __name__ == '__main__':
    main()
