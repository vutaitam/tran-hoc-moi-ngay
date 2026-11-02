import sys


def main():
    n = int(sys.stdin.buffer.read())
    # 2^t modulo 5 có chu kỳ 4; 3^n modulo 4 là 1 (n chẵn) hoặc 3.
    # Biểu thức cần tính là 2^(3^n), không phải (2^3)^n.
    print(2 if n % 2 == 0 else 3)


if __name__ == '__main__':
    main()
