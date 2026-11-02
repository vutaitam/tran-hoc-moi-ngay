import sys
from bisect import bisect_right

# CÓ ĐIỀU KIỆN: giả sử cần x LỚN NHẤT; bản đề thiếu điều kiện này.
def main():
    choices = [0]
    for mask in range(1, 1 << 9):
        value = 0
        for digit in range(1, 10):
            if mask & (1 << (digit - 1)):
                value = value * 10 + digit
        choices.append(value)
    choices.sort()
    read = sys.stdin.buffer.readline
    first = read()
    if not first:
        return
    # Xuất từng khối để không lưu một triệu dòng kết quả cùng lúc.
    out = []
    for _ in range(int(first)):
        a = int(read())
        out.append(str(choices[bisect_right(choices, a) - 1]))
        if len(out) == 8192:
            sys.stdout.write('\n'.join(out) + '\n')
            out.clear()
    if out:
        sys.stdout.write('\n'.join(out) + '\n')

if __name__ == '__main__':
    main()
