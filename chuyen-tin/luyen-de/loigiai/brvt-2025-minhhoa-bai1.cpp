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
    ifstream fin("BAI1.INP");
    ofstream fout;
    if (fin) fout.open("BAI1.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    long long n;
    if (!(in >> n)) return 0;
    long long answer = 0;
    for (long long d = 1; d <= n/d; ++d)
        if (n % d == 0) answer += (d == n/d ? 1 : 2);
    out << answer << '\n';
}
