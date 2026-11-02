#include <iostream>
#include <fstream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("STRING.INP");
    ofstream fout;
    if (fin) fout.open("STRING.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    string s;
    getline(in, s);
    if (!s.empty() && s.back() == '\r') s.pop_back();
    int count[26] = {};
    for (char c : s) ++count[c-'a'];
    int odd = 0;
    for (int x : count) odd += x%2;
    // Mỗi tần suất lẻ cần một tâm; các cặp còn lại phân phối hai bên.
    out << (s.empty() ? 0 : max(1, odd)) << '\n';
}
