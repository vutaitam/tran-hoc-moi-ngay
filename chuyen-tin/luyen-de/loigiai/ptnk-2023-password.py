"""PASSWORD — O(log k); đọc stdin, ghi stdout, giữ số 0 đầu mật khẩu.
Khi thi: python3 ptnk-2023-password.py < PASSWORD.INP > PASSWORD.OUT
"""
import sys


def digit_at(pos):
    start = length = 1
    # Các số length chữ số đóng góp 9*start*length vị trí.
    while pos > 9 * start * length:
        pos -= 9 * start * length
        start *= 10
        length += 1
    number = start + (pos - 1) // length
    return str(number)[(pos - 1) % length]


def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    k = int(data[0])
    # Xét riêng bốn vị trí để xử lý ranh giới giữa các số, kể cả 99/100.
    print("".join(digit_at(k + delta) for delta in range(4)))


if __name__ == "__main__":
    main()
