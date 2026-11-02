#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("ISLANDS.INP");
    ofstream fout;
    if (fin) fout.open("ISLANDS.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int m, n;
    if (!(in >> m >> n)) return 0;
    vector<int> a(m*n), label(m*n, 0), area(1, 0), q;
    for (int& x : a) in >> x;
    const int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
    int best = 0;
    for (int root = 0; root < m*n; ++root) {
        if (!a[root] || label[root]) continue;
        int id = static_cast<int>(area.size());
        q.clear(); q.push_back(root); label[root] = id;
        // BFS lặp: tránh đệ quy sâu trên bảng một triệu ô.
        for (size_t head = 0; head < q.size(); ++head) {
            int x = q[head]/n, y = q[head]%n;
            for (int d = 0; d < 4; ++d) {
                int u = x+dx[d], v = y+dy[d];
                if (u < 0 || u >= m || v < 0 || v >= n) continue;
                int z = u*n+v;
                if (a[z] && !label[z]) {
                    label[z] = id;
                    q.push_back(z);
                }
            }
        }
        area.push_back(static_cast<int>(q.size()));
        best = max(best, area.back());
    }
    for (int x = 0; x < m; ++x) for (int y = 0; y < n; ++y) {
        if (a[x*n+y]) continue;
        int seen[4], count = 0, sum = 1;
        for (int d = 0; d < 4; ++d) {
            int u = x+dx[d], v = y+dy[d];
            if (u < 0 || u >= m || v < 0 || v >= n) continue;
            int id = label[u*n+v];
            if (!id) continue;
            // Một đảo kề nhiều cạnh vẫn chỉ cộng đúng một lần.
            bool duplicate = false;
            for (int j = 0; j < count; ++j) if (seen[j] == id) duplicate = true;
            if (!duplicate) { seen[count++] = id; sum += area[id]; }
        }
        best = max(best, sum);
    }
    out << best << '\n';
}
