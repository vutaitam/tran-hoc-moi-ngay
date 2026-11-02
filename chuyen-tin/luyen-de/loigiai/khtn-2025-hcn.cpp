#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n;
    if (!(std::cin >> n)) return 0;
    using Key = std::pair<long long, long long>;
    std::vector<Key> tails;
    tails.reserve(n);
    for (int i = 0; i < n; ++i) {
        long long d, r;
        std::cin >> d >> r;
        // Đổi giảm nghiêm ngặt (diện tích, chiều dài) thành tăng nghiêm ngặt.
        // Đọc theo thứ tự ban đầu, tuyệt đối không sắp xếp lại các hình.
        Key x = {-d * r, -d};
        auto it = std::lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;  // Bằng nhau không được nối dài dãy.
    }
    std::cout << tails.size() << '\n';
}
