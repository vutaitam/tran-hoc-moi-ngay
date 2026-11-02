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

long long prefix(long long n) {
    long long r = n % 9;
    return (n/9)*45 + r*(r+1)/2;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // Dùng đúng tệp của đề khi có; nếu không, hỗ trợ stdin/stdout để luyện tập.
    ifstream fin("BAI2.INP");
    ofstream fout;
    if (fin) fout.open("BAI2.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    // Có điều kiện: hỗ trợ 1 <= A <= B, gồm ví dụ; không sửa ràng buộc mâu thuẫn của đề.
    long long a, b;
    if (!(in >> a >> b)) return 0;
    out << prefix(b) - prefix(a-1) << '\n';
}
