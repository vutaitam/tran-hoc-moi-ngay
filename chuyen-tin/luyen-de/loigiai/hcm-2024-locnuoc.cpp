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
    ifstream fin("LOCNUOC.INP");
    ofstream fout;
    if (fin) fout.open("LOCNUOC.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    // ĐỀ CẦN KIỂM TRA: PDF ghi m <= 10^9. Không lưu/đọc đuôi r khi hết nước.
    int n;
    long long m;
    if (!(in >> n >> m)) return 0;
    constexpr int LIMIT = 100000;
    vector<long long> count(LIMIT+1), filled(LIMIT+1);
    int maximum = 0;
    for (int i = 0, a; i < n; ++i) {
        in >> a;
        ++count[a];
        maximum = max(maximum, a);
    }
    long long active = n;
    // filled[t] = tổng min(a_i,t), số hệ thống tới được lớp t là active.
    for (int t = 1; t <= maximum; ++t) {
        filled[t] = filled[t-1] + active;
        active -= count[t];
    }
    int prefix = 0;
    bool first = true;
    for (long long j = 0; j < m && prefix < maximum; ++j) {
        int r; in >> r;
        int next = min(maximum, prefix + r);
        if (!first) out << ' ';
        out << filled[next] - filled[prefix];
        first = false;
        prefix = next;
    }
    out << '\n';
}
