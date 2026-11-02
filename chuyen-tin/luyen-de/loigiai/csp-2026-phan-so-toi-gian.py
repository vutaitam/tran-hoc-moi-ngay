import sys

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    count = next(data, 0)
    result = []
    for _ in range(count):
        n = next(data)
        if n == 2:
            a = 1
        elif n % 2:
            a = n // 2
        elif n % 4 == 0:
            a = n // 2 - 1
        else:
            a = n // 2 - 2
        # Tử lớn nhất ≤ n/2, nguyên tố cùng nhau với n.
        result.append(f'{a} {n - a}')
    sys.stdout.write('\n'.join(result))

if __name__ == '__main__':
    main()
