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
    ifstream fin("CANBANG.INP");
    ofstream fout;
    if (fin) fout.open("CANBANG.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n; long long k;
    if (!(in >> n >> k)) return 0;
    vector<long long> a(n);
    for (auto& x : a) in >> x;
    sort(a.begin(), a.end());
    int answer = 0;
    for (auto x : a)
        answer += binary_search(a.begin(), a.end(), x-k)
               && binary_search(a.begin(), a.end(), x+k);
    out << answer << '\n';
}
