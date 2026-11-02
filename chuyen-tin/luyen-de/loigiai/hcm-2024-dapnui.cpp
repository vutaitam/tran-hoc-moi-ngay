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
    ifstream fin("DAPNUI.INP");
    ofstream fout;
    if (fin) fout.open("DAPNUI.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n;
    if (!(in >> n)) return 0;
    vector<long long> a(n), left(n), right(n), pref(n + 1), suff(n + 1);
    for (auto& x : a) in >> x;
    for (int i = 0; i < n; ++i) {
        left[i] = i ? max(a[i], left[i-1] + 1) : a[i];
        pref[i+1] = pref[i] + left[i] - a[i];
    }
    for (int i = n-1; i >= 0; --i) {
        right[i] = i+1 < n ? max(a[i], right[i+1] + 1) : a[i];
        suff[i] = suff[i+1] + right[i] - a[i];
    }
    long long answer = numeric_limits<long long>::max();
    // Đỉnh không nằm ở hai đầu, và chỉ tính chi phí đỉnh một lần.
    for (int i = 1; i + 1 < n; ++i)
        answer = min(answer, pref[i] + suff[i+1] + max(left[i], right[i]) - a[i]);
    out << answer << '\n';
}
