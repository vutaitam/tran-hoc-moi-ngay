#include <cmath>
#include <iostream>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n, answer = 0;
    if (!(std::cin >> n)) return 0;
    for (int i = 0; i < n; ++i) {
        long long x;
        std::cin >> x;
        long long k = static_cast<long long>(std::sqrt(static_cast<long double>(x)));
        // Hiệu chỉnh bằng số nguyên để không phụ thuộc làm tròn căn số thực.
        while ((k + 1) * (k + 1) <= x) ++k;
        while (k * k > x) --k;
        if (k * k == x) ++answer;
    }
    std::cout << answer << '\n';
}
