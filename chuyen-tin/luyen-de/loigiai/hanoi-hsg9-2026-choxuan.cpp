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
    ifstream fin("CHOXUAN.INP");
    ofstream fout;
    if (fin) fout.open("CHOXUAN.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    long long n, k;
    if (!(in >> n >> k)) return 0;
    // Phép nhân phải ở 64-bit kể cả khi kết quả là -1.
    out << (n >= 7*k ? n - 7*k : -1) << '\n';
}
