"""STRING — O(|s|) thời gian, đọc stdin/ghi stdout.
Khi thi: python3 ptnk-2026-string.py < STRING.INP > STRING.OUT
"""
import sys
from collections import Counter


def main():
    s = sys.stdin.buffer.readline().rstrip(b"\r\n")
    if not s:
        print(0)
        return
    counts = Counter(s)
    odd = sum(count % 2 for count in counts.values())
    # Mỗi loại chữ có số lần lẻ cần một tâm; các cặp ghép đối xứng tùy ý.
    print(max(1, odd))


if __name__ == "__main__":
    main()
