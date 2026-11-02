#include <algorithm>
#include <iostream>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n;
    if (!(std::cin >> n)) return 0;
    long long cur = 0;  // Giá trị dương nên 0 biểu diễn không còn lá bài.
    for (int i = 0; i < n; ++i) {
        long long x;
        std::cin >> x;
        // Tiền tố đã đọc rút gọn thành cur hoặc rỗng.
        if (cur == 0) cur = x;
        else if (cur == x) cur = 0;
        else cur = std::max(cur, x);
    }
    std::cout << cur << '\n';
}
