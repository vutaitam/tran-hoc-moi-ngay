import sys

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(data, 0)
    if not n:
        return
    limit = next(data)
    a = sorted(next(data) for _ in range(n))
    left, right, answer = 0, n - 1, 0
    while left < right:
        if a[left] + a[right] <= limit:
            # Tất cả đối tác left+1..right đều ghép được với left.
            answer += right - left
            left += 1
        else:
            right -= 1
    print(answer)

if __name__ == '__main__':
    main()
