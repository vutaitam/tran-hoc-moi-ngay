import sys

# CÓ ĐIỀU KIỆN: cặp có thứ tự, cho phép i=j, phù hợp ví dụ.
# Nếu dùng nguyên văn i<j thì kết quả phải đổi thành (answer-n)//2.
def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    n = int(data[0])
    spf = [0] * (n + 1)
    for p in range(2, n + 1):
        if spf[p] == 0:
            for multiple in range(p, n + 1, p):
                if spf[multiple] == 0:
                    spf[multiple] = p
    kernel = [0] * (n + 1)
    count = [0] * (n + 1)
    kernel[1] = 1
    answer = 0
    for x in range(1, n + 1):
        if x > 1:
            p = spf[x]
            rest = x // p
            kernel[x] = kernel[rest // p] if rest % p == 0 else kernel[rest] * p
        # Có c đối tác cũ ở mỗi chiều và cặp (x,x).
        answer += 2 * count[kernel[x]] + 1
        count[kernel[x]] += 1
    print(answer)

if __name__ == '__main__':
    main()
