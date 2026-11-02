#include <algorithm>
#include <array>
#include <cstdio>

// Input có thể có hơn 10^8 mã; đọc đệm để xử lý tuyến tính theo kích thước input.
class FastInput {
    char buffer[1 << 16];
    std::size_t pos = 0, size = 0;
    int get() {
        if (pos == size) {
            size = std::fread(buffer, 1, sizeof(buffer), stdin);
            pos = 0;
            if (size == 0) return EOF;
        }
        return static_cast<unsigned char>(buffer[pos++]);
    }
public:
    bool read(int& value) {
        int ch;
        do { ch = get(); } while (ch != EOF && ch <= ' ');
        if (ch == EOF) return false;
        value = 0;
        while (ch >= '0' && ch <= '9') {
            value = value * 10 + ch - '0';
            ch = get();
        }
        return true;
    }
};

int main() {
    FastInput in;
    int task, m, k, target;
    if (!in.read(task)) return 0;
    in.read(m); in.read(k); in.read(target);
    std::array<int, 2027> rank{}, frequency{};
    for (int i = 1; i <= m; ++i) {
        int x;
        in.read(x);
        rank[x] = i;
    }
    int students, answer = 0;
    in.read(students);
    for (int s = 0; s < students; ++s) {
        int all = 0, core = 0, first = 0;
        for (int j = 0; j < k; ++j) {
            int x;
            in.read(x);
            ++frequency[x];
            int r = rank[x];
            if (r != 0) {
                ++all;
                if (r <= k) ++core;
                if (r < k) ++first;
            }
        }
        // Thứ tự if/else chính là ưu tiên nhóm có số nhỏ nhất.
        int group;
        if (core == k) group = 1;
        else if (all == k) group = 2;
        else if (first >= k - 1) group = 3;
        else if (core >= k - 1) group = 4;
        else if (all >= k - 1) group = 5;
        else if (all >= k - 2) group = 6;
        else group = 7;
        if (group == target) ++answer;
    }
    if (task == 1) {
        std::printf("%d\n", answer);
    } else {
        int most = *std::max_element(frequency.begin() + 1, frequency.end());
        bool printed = false;
        for (int x = 1; x <= 2026; ++x) {
            if (frequency[x] == most) {
                std::printf("%s%d", printed ? " " : "", x);
                printed = true;
            }
        }
        std::printf("\n");
    }
}
