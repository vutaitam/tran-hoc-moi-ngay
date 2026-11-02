#include <algorithm>
#include <iostream>
#include <limits>

int main() {
    // Đề dùng stdin/stdout; không cần đổi tên tệp.
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n;
    if (!(std::cin >> n)) return 0;
    long long mn = std::numeric_limits<long long>::max();
    long long mx = std::numeric_limits<long long>::min();
    for (int i = 0; i < n; ++i) {
        long long m, v;
        std::cin >> m >> v;
        // Chỉ cần giữ hai cực trị, không cần lưu toàn bộ dãy.
        mn = std::min(mn, m + v);
        mx = std::max(mx, m + v);
    }
    std::cout << mx - mn << '\n';
}
