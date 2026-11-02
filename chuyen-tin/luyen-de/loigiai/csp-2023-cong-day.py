import sys
from bisect import bisect_left

def main():
    read = sys.stdin.buffer.readline
    first = read().split()
    if not first:
        return
    n, q = map(int, first)
    # Đề ghi n số trên một dòng; đọc theo dòng tránh lưu toàn bộ q truy vấn.
    a = sorted(map(int, read().split()))
    prefix = [0]
    total = 0
    for value in a:
        total += value
        prefix.append(total)
    shift = 0
    result = []
    for _ in range(q):
        shift += int(read())
        k = bisect_left(a, -shift)
        # Đổi dấu tổng của nhóm âm, giữ nguyên tổng nhóm không âm.
        result.append(str(total - 2 * prefix[k] + (n - 2 * k) * shift))
    sys.stdout.write('\n'.join(result))

if __name__ == '__main__':
    main()
