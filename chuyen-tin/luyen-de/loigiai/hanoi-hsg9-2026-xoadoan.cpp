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
    ifstream fin("XOADOAN.INP");
    ofstream fout;
    if (fin) fout.open("XOADOAN.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n;
    if (!(in >> n)) return 0;
    vector<long long> pref(n+1);
    for (int i = 1; i <= n; ++i) {
        long long a; in >> a; pref[i] = pref[i-1] + a;
    }
    long long s; in >> s;
    long long target = pref[n] - s;
    if (target <= 0) { out << 0 << '\n'; return 0; }
    deque<int> dq;
    int answer = n+1;
    for (int r = 0; r <= n; ++r) {
        while (!dq.empty() && pref[r] - pref[dq.front()] >= target) {
            answer = min(answer, r-dq.front());
            dq.pop_front();
        }
        // Tiền tố mới nhỏ hơn và ở bên phải trội hơn đuôi cũ cho mọi r tương lai.
        while (!dq.empty() && pref[dq.back()] >= pref[r]) dq.pop_back();
        dq.push_back(r);
    }
    out << (answer <= n ? answer : -1) << '\n';
}
