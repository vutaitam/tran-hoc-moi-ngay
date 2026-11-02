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
    long long a, b;
    if (!(in >> a >> b)) return 0;
    // a phòng ở riêng không nhận thêm người.
    out << a + (b + 2) / 3 << '\n';
}
