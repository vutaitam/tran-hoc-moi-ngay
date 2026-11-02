#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("WORDGAME.INP");
    ofstream fout;
    if (fin) fout.open("WORDGAME.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    string s;
    if (!(in >> s)) return 0;
    int n = static_cast<int>(s.size());
    vector<int> dp(n, 0);
    for (int l = n-2; l >= 0; --l) {
        int diagonal = 0; // f[l+1][l] = 0, đoạn rỗng.
        for (int r = l+1; r < n; ++r) {
            int old = dp[r]; // f[l+1][r] trước khi ghi đè.
            if (s[l] == s[r]) dp[r] = diagonal;
            else dp[r] = 1 + min(dp[r], dp[r-1]);
            diagonal = old;
        }
    }
    out << dp[n-1] << '\n';
}
