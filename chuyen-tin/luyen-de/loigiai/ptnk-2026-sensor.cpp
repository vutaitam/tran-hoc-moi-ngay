#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("SENSOR.INP");
    ofstream fout;
    if (fin) fout.open("SENSOR.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n;
    if (!(in >> n)) return 0;
    vector<long long> pref(n+1, 0);
    for (int i = 1; i <= n; ++i) {
        long long a; in >> a;
        // Tổng 2*i trên [l,r] đúng bằng (r-l+1)*(l+r).
        pref[i] = pref[i-1] + a - 2LL*i;
    }
    sort(pref.begin(), pref.end());
    long long answer = 0;
    for (int i = 0; i <= n;) {
        int j = i+1;
        while (j <= n && pref[j] == pref[i]) ++j;
        long long count = j-i;
        answer += count*(count-1)/2;
        i = j;
    }
    out << answer << '\n';
}
