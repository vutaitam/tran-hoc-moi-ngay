#include <iostream>

int main() {
    constexpr long long MOD = 998244853;  // Đúng số in trong PDF, không phải 998244353.
    int n;
    long long a, b, c;
    if (!(std::cin >> n >> a >> b >> c)) return 0;
    a %= MOD; b %= MOD; c %= MOD;
    // Trước bước i, giữ lần lượt f[i-1], f[i-2], f[i-3].
    long long f1 = 1, f2 = 0, f3 = 0;
    for (int i = 1; i <= n; ++i) {
        // Ba tích cộng lại nhỏ hơn 3*10^18, nằm trong long long.
        long long next = (a * f1 + b * f2 + c * f3) % MOD;
        f3 = f2;
        f2 = f1;
        f1 = next;
    }
    std::cout << f1 << '\n';
}
