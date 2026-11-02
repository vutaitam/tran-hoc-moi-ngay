#include <array>
#include <fstream>
#include <iostream>
#include <numeric>
#include <string>
using namespace std;
int main() {
    ifstream fin("BUTTONS.INP"); ofstream fout;
    istream* in = &cin; ostream* out = &cout;
    if (fin) { in = &fin; fout.open("BUTTONS.OUT"); out = &fout; }
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s; if (!(*in >> s)) return 0;
    array<int, 26> cnt{};
    for (char ch : s) ++cnt[ch - 'a'];
    int repeats = 0;
    // Số lần lặp phải chia hết mọi tần suất: tối đa là ƯCLN.
    for (int value : cnt) repeats = gcd(repeats, value);
    // Khối nhỏ nhất theo từ điển có các chữ được xếp tăng dần.
    for (int c = 0; c < 26; ++c) *out << string(cnt[c] / repeats, char('a' + c));
    *out << '\n';
}
