#include <fstream>
#include <iostream>
using namespace std;
int main() {
    // Đọc file nếu có; khi luyện với stdin không cần tạo file.
    ifstream fin("TILING.INP"); ofstream fout;
    istream* in = &cin; ostream* out = &cout;
    if (fin) { in = &fin; fout.open("TILING.OUT"); out = &fout; }
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; if (!(*in >> n)) return 0;
    // Đi sang phải hoặc xuống dưới đều tăng loại gạch thêm 1.
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) *out << i + j - 1 << (j == n ? '\n' : ' ');
    }
}
