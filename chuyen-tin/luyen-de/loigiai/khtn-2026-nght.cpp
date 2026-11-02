#include <algorithm>
#include <array>
#include <cstdint>
#include <iomanip>
#include <iostream>

// Có không quá 2^(4*100) cách chọn tập ô (< 10^121).
// 14 khối cơ số 10^9 chứa tới 126 chữ số, đủ cho toàn bộ đề, không cần Boost.
struct BigInt {
    static constexpr std::uint32_t BASE = 1000000000;
    std::array<std::uint32_t, 14> digit{};
    void add(const BigInt& other) {
        std::uint64_t carry = 0;
        for (int i = 0; i < 14; ++i) {
            std::uint64_t sum = static_cast<std::uint64_t>(digit[i]) + other.digit[i] + carry;
            digit[i] = static_cast<std::uint32_t>(sum % BASE);
            carry = sum / BASE;
        }
    }
    void print() const {
        int i = 13;
        while (i > 0 && digit[i] == 0) --i;
        std::cout << digit[i];
        while (--i >= 0) std::cout << std::setw(9) << std::setfill('0') << digit[i];
    }
};

struct State {
    int best = -1000000;  // Trạng thái chưa thể đạt.
    BigInt ways;
};

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n;
    if (!(std::cin >> n)) return 0;
    std::array<int, 16> population{};
    for (int x = 1; x < 16; ++x) population[x] = population[x >> 1] + (x & 1);
    std::array<State, 256> dp;
    dp[0].best = 0;
    dp[0].ways.digit[0] = 1;
    for (int col = 0; col < n; ++col) {
        int k;
        std::cin >> k;
        int blocked = (k == 0 ? 0 : 1 << (k - 1));
        std::array<State, 256> next;
        for (int a = 0; a < 16; ++a) {
            for (int b = 0; b < 16; ++b) {
                const State& old = dp[a * 16 + b];
                if (old.best < 0) continue;
                for (int c = 0; c < 16; ++c) {
                    if (c & blocked) continue;
                    // Cách một cột: chênh hai hàng; cách hai cột: chênh một hàng.
                    if (c & ((b << 2) | (b >> 2))) continue;
                    if (c & ((a << 1) | (a >> 1))) continue;
                    State& dest = next[b * 16 + c];
                    int score = old.best + population[c];
                    if (score > dest.best) {
                        dest.best = score;
                        dest.ways = old.ways;
                    } else if (score == dest.best) {
                        dest.ways.add(old.ways);
                    }
                }
            }
        }
        dp = next;
    }
    int maximum = -1;
    BigInt count;
    for (const State& s : dp) {
        if (s.best > maximum) {
            maximum = s.best;
            count = s.ways;
        } else if (s.best == maximum) {
            count.add(s.ways);
        }
    }
    std::cout << maximum << ' ';
    count.print();
    std::cout << '\n';
    return 0;
}
