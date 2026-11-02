#include <algorithm>
#include <iostream>
#include <map>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n;
    if (!(std::cin >> n)) return 0;
    std::map<long long, int> last;
    int answer = n;
    for (int i = 0; i < n; ++i) {
        long long x;
        std::cin >> x;
        auto it = last.find(x);
        if (it != last.end()) {
            // Lần xuất hiện gần nhất luôn cho khoảng cách nhỏ nhất tới i.
            answer = std::min(answer, i - it->second);
            it->second = i;
        } else {
            last.emplace(x, i);
        }
    }
    std::cout << (answer == n ? -1 : answer) << '\n';
}
