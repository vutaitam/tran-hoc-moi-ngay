#include <iostream>
#include <fstream>
#include <string>
using namespace std;

char digitAt(long long pos) {
    long long start = 1, length = 1;
    // Khối số có length chữ số chiếm 9*start*length vị trí.
    while (pos > 9*start*length) {
        pos -= 9*start*length;
        start *= 10;
        ++length;
    }
    long long number = start + (pos-1)/length;
    return to_string(number)[static_cast<size_t>((pos-1)%length)];
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("PASSWORD.INP");
    ofstream fout;
    if (fin) fout.open("PASSWORD.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    long long k;
    if (!(in >> k)) return 0;
    // In ký tự thay vì số để giữ cả chữ số 0 ở đầu mật khẩu.
    for (int i = 0; i < 4; ++i) out << digitAt(k+i);
    out << '\n';
}
