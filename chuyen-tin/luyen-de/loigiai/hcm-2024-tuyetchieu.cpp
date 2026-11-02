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
    ifstream fin("TUYETCHIEU.INP");
    ofstream fout;
    if (fin) fout.open("TUYETCHIEU.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int n, k;
    if (!(in >> n >> k)) return 0;
    vector<int> last(1000001, 0);
    int answer = 1000001;
    for (int i = 1, a; i <= n; ++i) {
        in >> a;
        // Chỉ lần gần nhất có thể tạo khoảng cách nhỏ nhất.
        if (last[a] && i - last[a] < k) answer = min(answer, a);
        last[a] = i;
    }
    out << (answer == 1000001 ? -1 : answer) << '\n';
}
