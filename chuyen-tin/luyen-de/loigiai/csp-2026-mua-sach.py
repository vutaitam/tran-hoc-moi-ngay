import sys
from collections import deque

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(data, 0)
    if not n:
        return
    query_count = next(data)
    prices = [next(data) for _ in range(n)]
    result = []
    for _ in range(query_count):
        budget = next(data)
        total = left = answer = 0
        queue = deque()
        for right, price in enumerate(prices):
            total += price
            while queue and prices[queue[-1]] <= price:
                queue.pop()
            queue.append(right)
            # Tiết kiệm ceil(max/2), giá sau giảm là floor(max/2).
            while left <= right and total - (prices[queue[0]] + 1) // 2 > budget:
                if queue[0] == left:
                    queue.popleft()
                total -= prices[left]
                left += 1
            answer = max(answer, right - left + 1)
        result.append(str(answer))
    sys.stdout.write('\n'.join(result))

if __name__ == '__main__':
    main()
