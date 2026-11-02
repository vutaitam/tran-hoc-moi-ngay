import sys
from math import gcd
from pathlib import Path


def solve(inp, out):
    s = inp.read().strip()
    counts = [0] * 26
    for ch in s:
        counts[ch - 97] += 1
    # Số khối giống nhau tối đa bằng ƯCLN của các tần suất.
    repeats = 0
    for count in counts:
        repeats = gcd(repeats, count)
    # Xếp chữ tăng dần để khối nhỏ nhất theo thứ tự từ điển.
    out.write(''.join(chr(97 + c) * (counts[c] // repeats) for c in range(26)) + '\n')


if __name__ == '__main__':
    if Path('BUTTONS.INP').is_file():
        with open('BUTTONS.INP', 'rb') as inp, open('BUTTONS.OUT', 'w') as out:
            solve(inp, out)
    else:
        solve(sys.stdin.buffer, sys.stdout)
