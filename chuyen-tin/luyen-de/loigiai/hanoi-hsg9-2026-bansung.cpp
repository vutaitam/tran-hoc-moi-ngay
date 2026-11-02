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

// __int128 được Apple clang/g++ hỗ trợ; tránh tràn các moment tới khoảng 4*10^19.
using Wide = __int128;
struct Group { long long position, count; };
bool possible(const vector<long long>& a, long long budget, long long power) {
    deque<Group> groups;
    Wide c0 = 0, c1 = 0, c2 = 0;
    long long used = 0;
    for (long long i = 0; i < static_cast<long long>(a.size()); ++i) {
        // Bỏ nhóm hết tầm: X - (i-p)^2 <= 0.
        while (!groups.empty()) {
            auto g = groups.front();
            long long d = i-g.position;
            if (d*d < power) break;
            c0 -= g.count;
            c1 -= Wide(g.count)*g.position;
            c2 -= Wide(g.count)*g.position*g.position;
            groups.pop_front();
        }
        Wide damage = (Wide(power)-Wide(i)*i)*c0 + 2*Wide(i)*c1 - c2;
        if (damage >= a[i]) continue;
        long long remaining = static_cast<long long>(Wide(a[i])-damage);
        // Bia đầu còn sống bắt buộc nhận đúng số phát tối thiểu này trước khi tiến lên.
        long long shots = (remaining + power-1)/power;
        if (shots > budget-used) return false;
        used += shots;
        groups.push_back({i, shots});
        c0 += shots;
        c1 += Wide(shots)*i;
        c2 += Wide(shots)*i*i;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // Dùng đúng tệp của đề khi có; nếu không, hỗ trợ stdin/stdout để luyện tập.
    ifstream fin("BANSUNG.INP");
    ofstream fout;
    if (fin) fout.open("BANSUNG.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n; long long k;
    if (!(in >> n >> k)) return 0;
    vector<long long> a(n);
    long long high = 1;
    for (int i = 0; i < n; ++i) {
        in >> a[i];
        high = max(high, a[i] + 1LL*i*i); // Một phát bắn từ bia đầu đủ phá hết.
    }
    long long low = 1;
    while (low < high) {
        long long mid = low + (high-low)/2;
        if (possible(a, k, mid)) high = mid;
        else low = mid + 1;
    }
    out << low << '\n';
}
