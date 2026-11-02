import sys
import math
import random

RNG = random.Random(20261102)

def prime(n):
    if n < 2:
        return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    # Bộ cơ sở Miller–Rabin xác định với số nguyên không dấu 64-bit.
    for a in (2, 325, 9375, 28178, 450775, 9780504, 1795265022):
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True

def rho(n):
    for p in (2, 3, 5):
        if n % p == 0:
            return p
    # Pollard–Rho/Brent gom gcd theo khối, thử lại khi gặp chu trình xấu.
    while True:
        y, c = RNG.randrange(1, n), RNG.randrange(1, n)
        g, r = 1, 1
        while g == 1:
            x = y
            for _ in range(r):
                y = (y * y + c) % n
            k = 0
            while k < r and g == 1:
                ys, product = y, 1
                for _ in range(min(128, r - k)):
                    y = (y * y + c) % n
                    product = product * abs(x - y) % n
                g = math.gcd(product, n)
                k += 128
            r *= 2
        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g != 1:
                    break
        if g != n:
            return g

def factor(n, factors):
    if n == 1:
        return
    if prime(n):
        factors.append(n)
        return
    d = rho(n)
    factor(d, factors)
    factor(n // d, factors)

def solve(n):
    # Trong hai số liên tiếp luôn có một số chẵn.
    if n % 2:
        return '-1'
    factors = []
    factor(n, factors)
    counts = {}
    for p in factors:
        counts[p] = counts.get(p, 0) + 1
    divisors = [1]
    for p, e in counts.items():
        old, power = divisors[:], 1
        for _ in range(e):
            power *= p
            divisors.extend(d * power for d in old)
    divisors.sort()
    chosen = set()
    for a, b in zip(divisors, divisors[1:]):
        if b - a == 1:
            chosen.add(a)
            chosen.add(b)
    return ' '.join(map(str, sorted(chosen))) if chosen else '-1'

def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    count = next(data, 0)
    sys.stdout.write('\n'.join(solve(next(data)) for _ in range(count)))

if __name__ == '__main__':
    main()
