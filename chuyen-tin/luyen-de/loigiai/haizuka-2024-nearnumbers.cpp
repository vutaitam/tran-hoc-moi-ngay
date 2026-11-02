#include <algorithm>
#include <fstream>
#include <iostream>
#include <vector>
using namespace std;
long long limit;
vector<long long> values;
void generate(long long value) {
    if (value > limit) return;
    values.push_back(value);
    int last = int(value % 10);
    for (int next : {last - 1, last + 1}) {
        if (next < 0 || next > 9) continue;
        // Kiểm trước phép nhân; limit <= 10^12 nên long long đủ.
        if (value <= (limit - next) / 10 && limit >= next) generate(value * 10 + next);
    }
}
int main() {
    ifstream fin("NEARNUMBERS.INP"); ofstream fout;
    istream* in = &cin; ostream* out = &cout;
    if (fin) { in = &fin; fout.open("NEARNUMBERS.OUT"); out = &fout; }
    ios::sync_with_stdio(false); cin.tie(nullptr);
    if (!(*in >> limit)) return 0;
    // Không sinh chữ số 0 ở đầu. Một chữ số cũng hợp lệ.
    for (int first = 1; first <= 9; ++first) generate(first);
    sort(values.begin(), values.end());
    for (size_t i = 0; i < values.size(); ++i) *out << values[i] << (i + 1 == values.size() ? '\n' : ' ');
}
