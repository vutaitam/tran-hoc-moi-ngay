// LỜI GIẢI MỘT PHẦN: DAG bất kỳ với N <= 22; hoặc D=0 với N<=50.
// Không coi đồ thị phụ thuộc là cây. Không cam kết giải toàn bộ N=50.
#include <iostream>
#include <fstream>
#include <vector>
#include <queue>
#include <functional>
#include <cstdint>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("BLOCKOPT.INP");
    ofstream fout;
    if (fin) fout.open("BLOCKOPT.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n, capacity;
    if (!(in >> n >> capacity)) return 0;
    vector<int> fee(n), size(n);
    for (int i = 0; i < n; ++i) in >> fee[i] >> size[i];
    int d; in >> d;
    vector<uint64_t> prerequisite(n, 0);
    vector<vector<int>> dependents(n);
    vector<int> indegree(n, 0);
    for (int i = 0; i < d; ++i) {
        int a, b; in >> a >> b; --a; --b;
        prerequisite[a] |= uint64_t(1) << b;
        dependents[b].push_back(a);
        ++indegree[a];
    }
    if (d == 0) {
        // Không có phụ thuộc: ba lô 0/1 thông thường.
        vector<int> dp(capacity+1, 0);
        for (int i = 0; i < n; ++i)
            for (int s = capacity; s >= size[i]; --s)
                dp[s] = max(dp[s], dp[s-size[i]]+fee[i]);
        out << dp[capacity] << '\n';
        return 0;
    }
    if (n > 22) {
        // Không in đáp án giả cho phần nằm ngoài phạm vi mã mẫu.
        cerr << "PARTIAL: ho tro N<=22 hoac D=0; DAG N>22 chua duoc giai.\n";
        return 2;
    }
    queue<int> q;
    for (int i = 0; i < n; ++i) if (indegree[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : dependents[u]) if (--indegree[v] == 0) q.push(v);
    }
    vector<int> suffix(n+1, 0);
    for (int i = n-1; i >= 0; --i) suffix[i] = suffix[i+1]+fee[order[i]];
    int best = 0;
    function<void(int,int,int,uint64_t)> dfs = [&](int pos, int used, int total, uint64_t chosen) {
        best = max(best, total);
        if (pos == n || total+suffix[pos] <= best) return;
        int u = order[pos];
        // Trong thứ tự tô-pô này, các tiên quyết đều đã quyết định xong.
        if (used+size[u] <= capacity && (prerequisite[u]&chosen) == prerequisite[u])
            dfs(pos+1, used+size[u], total+fee[u], chosen | (uint64_t(1)<<u));
        dfs(pos+1, used, total, chosen);
    };
    dfs(0, 0, 0, 0);
    out << best << '\n';
}
