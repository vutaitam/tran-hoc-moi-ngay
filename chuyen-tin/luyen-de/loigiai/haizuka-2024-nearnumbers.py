import sys
from pathlib import Path


def solve(inp, out):
    limit = int(inp.readline())
    stack = list(range(1, min(limit, 9) + 1))
    values = []
    # Sinh đúng số hợp lệ, không duyệt mọi số từ 1 đến N.
    # Định nghĩa/test chấp nhận 12345; câu phủ nhận trong PDF mâu thuẫn.
    while stack:
        value = stack.pop()
        values.append(value)
        last = value % 10
        for digit in (last - 1, last + 1):
            if 0 <= digit <= 9:
                child = value * 10 + digit
                if child <= limit:
                    stack.append(child)
    values.sort()
    out.write(' '.join(map(str, values)) + '\n')


if __name__ == '__main__':
    if Path('NEARNUMBERS.INP').is_file():
        with open('NEARNUMBERS.INP', 'rb') as inp, open('NEARNUMBERS.OUT', 'w') as out:
            solve(inp, out)
    else:
        solve(sys.stdin.buffer, sys.stdout)
