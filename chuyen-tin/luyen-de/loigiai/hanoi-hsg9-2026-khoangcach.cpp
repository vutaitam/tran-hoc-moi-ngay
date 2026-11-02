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
    ifstream fin("KHOANGCACH.INP");
    ofstream fout;
    if (fin) fout.open("KHOANGCACH.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    string s;
    if (!(in >> s)) return 0;
    int n = static_cast<int>(s.size());
    vector<array<int,26>> pref(n+1);
    pref[0].fill(0);
    for (int i = 0; i < n; ++i) {
        pref[i+1] = pref[i];
        ++pref[i+1][s[i]-'a'];
    }
    int q; in >> q;
    constexpr uint32_t ALL = (uint32_t(1) << 26) - 1;
    while (q--) {
        int l, r; in >> l >> r;
        uint32_t mask = 0;
        for (int c = 0; c < 26; ++c)
            if (pref[r][c] > pref[l-1][c]) mask |= uint32_t(1) << c;
        int answer = 0;
        // Xoay 26 bit d bước: giao khác rỗng nghĩa có hai chữ cách d trên vòng.
        for (int d = 13; d >= 1; --d) {
            uint32_t rotated = ((mask << d) | (mask >> (26-d))) & ALL;
            if (mask & rotated) { answer = d; break; }
        }
        out << answer << '\n';
    }
}
