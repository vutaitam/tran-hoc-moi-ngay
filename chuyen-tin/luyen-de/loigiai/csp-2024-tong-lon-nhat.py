import sys

# CÓ ĐIỀU KIỆN: theo nguyên văn chọn m lớn nhất khi đồng hạng.
# Ví dụ 15 -> 12 mâu thuẫn; chương trình trả 14, không giả vờ khớp mẫu.
data = sys.stdin.buffer.read().split()
if data:
    print(int(data[0]) - 1)
