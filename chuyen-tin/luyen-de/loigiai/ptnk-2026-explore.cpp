#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <utility>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("EXPLORE.INP");
    ofstream fout;
    if (fin) fout.open("EXPLORE.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n, m, k;
    if (!(in >> n >> m >> k)) return 0;
    vector<string> grid(n);
    for (auto& row : grid) in >> row;
    bool allowed[27] = {};
    for (int i = 0; i < k; ++i) { int d; in >> d; allowed[d] = true; }
    vector<pair<int,int>> moves;
    for (int dx = -5; dx <= 5; ++dx) for (int dy = -5; dy <= 5; ++dy) {
        int d = dx*dx+dy*dy;
        if (d > 0 && d <= 26 && allowed[d]) moves.emplace_back(dx,dy);
    }
    const int INF = 1000000000;
    vector<int> wolf(n*m, INF), dist(n*m, -1), q;
    q.reserve(n*m);
    int start = -1, target = -1;
    for (int x = 0; x < n; ++x) for (int y = 0; y < m; ++y) {
        int u = x*m+y;
        if (grid[x][y] == 's') start = u;
        if (grid[x][y] == 't') target = u;
        if (grid[x][y] == 'w') { wolf[u] = 0; q.push_back(u); }
    }
    const int dx[4] = {-1,1,0,0}, dy[4] = {0,0,-1,1};
    // BFS đa nguồn: thời điểm sớm nhất có một con sói tới từng ô.
    for (size_t head = 0; head < q.size(); ++head) {
        int u = q[head], x = u/m, y = u%m;
        for (int d = 0; d < 4; ++d) {
            int a = x+dx[d], b = y+dy[d];
            if (a < 0 || a >= n || b < 0 || b >= m || grid[a][b] == '#') continue;
            int v = a*m+b;
            if (wolf[v] == INF) { wolf[v] = wolf[u]+1; q.push_back(v); }
        }
    }
    q.clear(); q.push_back(start); dist[start] = 0;
    for (size_t head = 0; head < q.size(); ++head) {
        int u = q[head], x = u/m, y = u%m;
        if (u == target) break;
        for (auto [a,b] : moves) {
            a += x; b += y;
            if (a < 0 || a >= n || b < 0 || b >= m || grid[a][b] == '#') continue;
            int v = a*m+b, time = dist[u]+1;
            // Bằng thời điểm sói tới cũng bị bắt, kể cả ở đích.
            // Sói được đứng yên, nên đến muộn hơn không thể an toàn hơn.
            if (dist[v] == -1 && time < wolf[v]) {
                dist[v] = time;
                q.push_back(v);
            }
        }
    }
    out << dist[target] << '\n';
}
