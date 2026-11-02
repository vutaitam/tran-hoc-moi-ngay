#include <iostream>
#include <fstream>
#include <vector>
using namespace std;
using int64 = long long;

bool square(int64 x) {
    // Căn nguyên chính xác, không phụ thuộc sai số dấu phẩy động.
    int64 low = 0, high = 1000000000LL;
    while (low < high) {
        int64 mid = (low+high+1)/2;
        if (mid <= x/mid) low = mid;
        else high = mid-1;
    }
    return low*low == x;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ifstream fin("VERYODD.INP");
    ofstream fout;
    if (fin) fout.open("VERYODD.OUT");
    istream& in = fin ? static_cast<istream&>(fin) : cin;
    ostream& out = fin ? static_cast<ostream&>(fout) : cout;
    int q;
    if (!(in >> q)) return 0;
    const int limit = 1000000;
    vector<bool> composite(limit+1, false);
    vector<int> primes;
    for (int i = 2; i <= limit; ++i) if (!composite[i]) {
        primes.push_back(i);
        if (1LL*i*i <= limit)
            for (int j = i*i; j <= limit; j += i) composite[j] = true;
    }
    while (q--) {
        int64 n; in >> n;
        if (n%2) { out << 0 << '\n'; continue; }
        while (n%2 == 0) n /= 2;
        // Số rất lẻ đúng là 2*t*t với t lẻ.
        // Thừa số nguyên tố lẻ mũ e cho floor(e/2)+1 cách chọn mũ chẵn.
        int64 answer = 1;
        for (int p : primes) {
            if (1LL*p*p*p > n) break;
            int exponent = 0;
            while (n%p == 0) { n /= p; ++exponent; }
            answer *= exponent/2+1;
        }
        // Nếu còn >=3 thừa số nguyên tố (kể bội), số nhỏ nhất <= căn bậc ba,
        // trái điều kiện dừng. Phần dư chỉ là 1, p, p*q, hoặc p*p.
        // Chỉ p*p làm tăng số ước chính phương.
        if (n > 1 && square(n)) answer *= 2;
        out << answer << '\n';
    }
}
