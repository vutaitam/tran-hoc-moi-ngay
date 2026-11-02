import sys
from pathlib import Path


def solve(inp, out):
    n = int(inp.readline())
    # Ô (i, j) có loại i+j-1. Ghi từng hàng, không lưu ma trận.
    for i in range(1, n + 1):
        out.write(' '.join(map(str, range(i, i + n))) + '\n')


if __name__ == '__main__':
    if Path('TILING.INP').is_file():
        with open('TILING.INP', 'rb') as inp, open('TILING.OUT', 'w') as out:
            solve(inp, out)
    else:
        solve(sys.stdin.buffer, sys.stdout)
