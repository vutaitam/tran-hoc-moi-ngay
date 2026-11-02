"""VERYODD — số rất lẻ chính xác là 2*t² với t lẻ; stdin/stdout.
Khi thi: python3 ptnk-2026-veryodd.py < VERYODD.INP > VERYODD.OUT
Sàng đến 10^6, chia thử chỉ tới căn bậc ba phần dư; không cần Pollard Rho.
"""
import sys
from math import isqrt


def primes_up_to(limit):
    sieve = bytearray(b"\x01") * (limit + 1)
    sieve[0:2] = b"\x00\x00"
    for p in range(2, isqrt(limit) + 1):
        if sieve[p]:
            start = p * p
            sieve[start:limit + 1:p] = b"\x00" * ((limit - start) // p + 1)
    return [p for p in range(3, limit + 1, 2) if sieve[p]]


def count_very_odd(n, primes):
    if n % 2:
        return 0
    while n % 2 == 0:
        n //= 2
    answer = 1
    for p in primes:
        if p * p * p > n:
            break
        exponent = 0
        while n % p == 0:
            n //= p
            exponent += 1
        # Có floor(e/2)+1 cách chọn một số mũ chẵn từ 0..e.
        answer *= exponent // 2 + 1
    # Phần dư còn tối đa hai thừa số nguyên tố kể cả bội.
    # Chỉ bình phương nguyên tố mới tạo thêm ước chính phương khác 1.
    if n > 1 and isqrt(n) ** 2 == n:
        answer *= 2
    return answer


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return
    q = data[0]
    primes = primes_up_to(1_000_000)
    answers = [str(count_very_odd(n, primes)) for n in data[1:q + 1]]
    sys.stdout.write("\n".join(answers) + "\n")


if __name__ == "__main__":
    main()
