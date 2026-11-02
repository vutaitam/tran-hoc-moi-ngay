#include <algorithm>
#include <array>
#include <cstdint>
#include <deque>
#include <fstream>
#include <iostream>
#include <limits>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // Dùng đúng tệp của đề khi có; nếu không, hỗ trợ stdin/stdout để luyện tập.
    ifstream fin("BAI4.INP");
    ofstream fout;
    if (fin) fout.open("BAI4.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    // LỜI GIẢI MỘT PHẦN: chỉ bảo đảm nhóm N <= 20 (40% số điểm).
    // O(N * tổng a), không phù hợp N=10^5. Không khẳng định lời giải đầy đủ.
    int n;
    if (!(in >> n)) return 0;
    if (n > 20) return 0; // Ngoài phạm vi được công bố, không in đáp án giả.
    vector<int> a(n);
    int sum = 0;
    for (auto& v : a) { in >> v; sum += v; }
    vector<unsigned char> dp(sum+1, 0);
    dp[0] = 1;
    int reach = 0;
    for (int v : a) {
        // Duyệt giảm để mỗi viên chỉ được dùng một lần.
        for (int s = reach; s >= 0; --s) if (dp[s]) dp[s+v] = 1;
        reach += v;
    }
    int answer = 0;
    for (int s = 1; s <= sum; ++s) answer += dp[s] != 0;
    out << answer << '\n';
}
