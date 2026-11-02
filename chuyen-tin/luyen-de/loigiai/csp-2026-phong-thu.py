import sys
import heapq

def feasible(intervals, count):
    due = []
    n = len(intervals)
    i = clock = 0
    while i < n or due:
        if not due:
            # Nhảy qua khoảng trống, không quét đến 10^9.
            clock = max(clock, intervals[i][0])
        while i < n and intervals[i][0] <= clock:
            heapq.heappush(due, intervals[i][1])
            i += 1
        if due[0] < clock:
            return False
        # Mỗi thời điểm bắn tối đa count mục tiêu có hạn chót sớm nhất.
        for _ in range(min(count, len(due))):
            heapq.heappop(due)
        clock += 1
    return True

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    test_count = next(data, 0)
    result = []
    for _ in range(test_count):
        n = next(data)
        intervals = sorted((next(data), next(data)) for _ in range(n))
        low, high = 1, n
        while low < high:
            middle = (low + high) // 2
            if feasible(intervals, middle):
                high = middle
            else:
                low = middle + 1
        result.append(str(low))
    sys.stdout.write('\n'.join(result))

if __name__ == '__main__':
    main()
