import sys
from math import gcd
from pathlib import Path


def solve(inp, out):
    # Ví dụ và test tác giả là X Y N; câu mô tả PDF ghi thứ tự khác.
    x, y, n = map(int, inp.read().split())
    lcm = x // gcd(x, y) * y
    # Bao hàm–loại trừ: bội chung chỉ được đếm một lần.
    out.write(str(n // x + n // y - n // lcm) + '\n')


if __name__ == '__main__':
    if Path('FAVORITENUM.INP').is_file():
        with open('FAVORITENUM.INP', 'rb') as inp, open('FAVORITENUM.OUT', 'w') as out:
            solve(inp, out)
    else:
        solve(sys.stdin.buffer, sys.stdout)
