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
    ifstream fin("BAI3.INP");
    ofstream fout;
    if (fin) fout.open("BAI3.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n, k;
    if (!(in >> n >> k)) return 0;
    vector<long long> a(n);
    for (auto& x : a) in >> x;
    long long sum = 0;
    int evens = 0;
    for (int i = 0; i < k; ++i) { sum += a[i]; evens += a[i] % 2 == 0; }
    long long bestSum = sum;
    int bestEvens = evens, start = 0;
    for (int r = k; r < n; ++r) {
        sum += a[r] - a[r-k];
        evens += (a[r] % 2 == 0) - (a[r-k] % 2 == 0);
        // Khi hòa cả hai tiêu chí, giữ chỉ số nhỏ hơn đã gặp trước.
        if (sum > bestSum || (sum == bestSum && evens > bestEvens)) {
            bestSum = sum; bestEvens = evens; start = r-k+1;
        }
    }
    out << start+1 << ' ' << start+k << '\n';
}
