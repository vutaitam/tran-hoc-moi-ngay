#!/usr/bin/env python3
# Python 3: đọc sys.stdin, ghi sys.stdout.
# Khi nộp hệ thống dùng tệp, chuyển hướng stdin/stdout sang tên INP/OUT trong đề.
import sys

# LỜI GIẢI MỘT PHẦN: chỉ bảo đảm N <= 20, tương ứng nhóm 40% số điểm.
def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    n, a = values[0], values[1:]
    if n > 20:
        # Ngoài phạm vi đã công bố: báo rõ trên stderr, không in đáp án giả.
        sys.exit('Lời giải một phần chỉ hỗ trợ N <= 20 (40% số điểm); chưa có lời giải đầy đủ cho N > 20.')
    total = sum(a)
    dp = bytearray(total + 1)
    dp[0] = 1
    reach = 0
    for v in a:
        # Duyệt giảm để không tái sử dụng chính viên ngọc đang xét.
        for s in range(reach, -1, -1):
            if dp[s]:
                dp[s + v] = 1
        reach += v
    print(sum(dp) - 1)  # Loại tổng 0 của tập rỗng.

if __name__ == '__main__':
    main()

