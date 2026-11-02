#include <fstream>
#include <iostream>
#include <numeric>
using namespace std;
int main() {
    ifstream fin("FAVORITENUM.INP"); ofstream fout;
    istream* in = &cin; ostream* out = &cout;
    if (fin) { in = &fin; fout.open("FAVORITENUM.OUT"); out = &fout; }
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long x, y, n;
    // Bộ ví dụ/test đọc X Y N; khác thứ tự N X Y ở câu mô tả PDF.
    if (!(*in >> x >> y >> n)) return 0;
    long long lcm = (x / gcd(x, y)) * y; // <= 10^18 theo giới hạn X,Y.
    // Bội của cả X và Y đã đếm hai lần, cần trừ một lần.
    *out << n / x + n / y - n / lcm << '\n';
}
