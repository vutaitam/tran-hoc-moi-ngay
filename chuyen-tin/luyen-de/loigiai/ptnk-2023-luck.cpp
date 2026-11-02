#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("LUCK.INP");
    ofstream fout;
    if (fin) fout.open("LUCK.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    long long n;
    if (!(in >> n)) return 0;
    // Các lá còn lại luôn là cấp số cộng first, first+step, ...
    long long first = 1, step = 1;
    while (n > 1) {
        first += step;       // Lá thứ hai trở thành lá đầu tiên.
        step *= 3;
        n = (n + 1) / 3;      // Số vị trí 2, 5, 8, ... không vượt n.
    }
    out << first << '\n';
}
