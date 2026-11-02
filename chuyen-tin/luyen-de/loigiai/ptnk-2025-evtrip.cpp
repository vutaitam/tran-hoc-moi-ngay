#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("EVTRIP.INP");
    ofstream fout;
    if (fin) fout.open("EVTRIP.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n;
    long long capacity, target;
    if (!(in >> n >> capacity >> target)) return 0;
    vector<long long> stations(n);
    for (auto& x : stations) in >> x;
    sort(stations.begin(), stations.end());
    long long last = 0;
    int next = 0, charges = 0;
    while (last + capacity < target) {
        long long farthest = last;
        while (next < n && stations[next] <= last+capacity) {
            farthest = stations[next++];
        }
        if (farthest <= last) { out << -1 << '\n'; return 0; }
        // Đổi điểm sạc sang trạm xa nhất không làm giảm tầm với về sau.
        last = farthest;
        ++charges;
    }
    out << charges << '\n';
}
