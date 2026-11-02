#include <iostream>
#include <fstream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("STREAK.INP");
    ofstream fout;
    if (fin) fout.open("STREAK.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int t;
    if (!(in >> t)) return 0;
    int cur = 0, best = 0;
    string status;
    while (t--) {
        in >> status;
        // cur: độ dài chuỗi ONLINE kết thúc đúng tại phút đang xét.
        if (status == "ONLINE") ++cur;
        else cur = 0;
        best = max(best, cur);
    }
    out << best << '\n';
}
