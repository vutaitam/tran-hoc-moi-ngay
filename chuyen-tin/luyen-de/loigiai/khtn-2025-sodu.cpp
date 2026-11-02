#include <iostream>

int main() {
    long long n;
    if (!(std::cin >> n)) return 0;
    // 2^t mod 5 có chu kỳ 4; 3^n mod 4 = 1 nếu n chẵn, 3 nếu n lẻ.
    // Bài hỏi 2^(3^n), tuyệt đối không dựng số lũy thừa khổng lồ.
    std::cout << (n % 2 == 0 ? 2 : 3) << '\n';
}
