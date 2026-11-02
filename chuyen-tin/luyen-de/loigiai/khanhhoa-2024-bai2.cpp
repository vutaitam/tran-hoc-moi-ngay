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
    ifstream fin("BAI2.INP");
    ofstream fout;
    if (fin) fout.open("BAI2.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n; string s;
    if (!(in >> n >> s)) return 0;
    int aa = 0, bb = 0;
    for (int i = 1; i < n; ++i) {
        // Hai phương án độc lập: thay toàn bộ * thành A, hoặc thành B.
        aa += s[i-1] != 'B' && s[i] != 'B';
        bb += s[i-1] != 'A' && s[i] != 'A';
    }
    out << max(aa, bb) << '\n';
}
