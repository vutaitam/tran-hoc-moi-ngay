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
    ifstream fin("BAI3.INP");
    ofstream fout;
    if (fin) fout.open("BAI3.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n; long long limit;
    if (!(in >> n >> limit)) return 0;
    vector<long long> a(n);
    for (auto& x : a) in >> x;
    long long sum = 0;
    int left = 0, answer = 0;
    for (int right = 0; right < n; ++right) {
        sum += a[right];
        while (sum > limit) sum -= a[left++];
        answer = max(answer, right-left+1);
    }
    out << answer << '\n';
}
