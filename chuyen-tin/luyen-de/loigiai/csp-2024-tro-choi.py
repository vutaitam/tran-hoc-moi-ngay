import sys

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(data, 0)
    if not n:
        return
    threshold = next(data)
    values = [next(data) for _ in range(n)]
    total = left = longest = 0
    for right, value in enumerate(values):
        total += value
        while left <= right and total >= threshold:
            total -= values[left]
            left += 1
        longest = max(longest, right - left + 1)
    # Mọi đoạn dài hơn đoạn tổng <m dài nhất đều hợp lệ.
    print(longest + 1)

if __name__ == '__main__':
    main()
