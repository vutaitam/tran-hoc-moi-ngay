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

long long squareSum(long long k) {
    // k <= 2*10^6: chia trước khi nhân; tổng không vượt 2.667*10^18.
    long long a = k, b = k + 1, c = 2*k + 1;
    if (a % 2 == 0) a /= 2; else b /= 2;
    if (a % 3 == 0) a /= 3;
    else if (b % 3 == 0) b /= 3;
    else c /= 3;
    return a*b*c;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // Dùng đúng tệp của đề khi có; nếu không, hỗ trợ stdin/stdout để luyện tập.
    ifstream fin("BAI4.INP");
    ofstream fout;
    if (fin) fout.open("BAI4.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n;
    if (!(in >> n)) return 0;
    for (int i = 0; i < n; ++i) {
        long long x; in >> x;
        long long low = 0, high = 2000000;
        while (low < high) {
            long long mid = (low + high + 1) / 2;
            if (squareSum(mid) <= x) low = mid;
            else high = mid - 1;
        }
        if (i) out << ' ';
        out << low;
    }
    out << '\n';
}
