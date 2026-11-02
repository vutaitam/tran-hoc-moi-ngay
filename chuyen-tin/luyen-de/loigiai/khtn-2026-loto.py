import sys


# Thuật toán đúng toàn miền input nhưng Python có thể TLE với giới hạn 1 giây:
# trường hợp lớn nhất chứa 101.300.000 mã chuyên đề. Không đọc tất cả vào RAM.
def main():
    read = sys.stdin.buffer.readline
    task = int(read())
    m, k, target = map(int, read().split())
    priority = list(map(int, read().split()))
    rank = [0] * 2027
    for i, topic in enumerate(priority, 1):
        rank[topic] = i
    students = int(read())
    frequency = [0] * 2027
    answer = 0
    for _ in range(students):
        topics = map(int, read().split())
        if task == 2:
            for topic in topics:
                frequency[topic] += 1
            continue
        all_count = core = first = 0
        for topic in topics:
            position = rank[topic]
            if position:
                all_count += 1
                if position <= k:
                    core += 1
                if position < k:
                    first += 1
        # Chọn nhóm nhỏ nhất: tuyệt đối không thay if/elif bằng các if rời.
        if core == k:
            group = 1
        elif all_count == k:
            group = 2
        elif first >= k - 1:
            group = 3
        elif core >= k - 1:
            group = 4
        elif all_count >= k - 1:
            group = 5
        elif all_count >= k - 2:
            group = 6
        else:
            group = 7
        answer += group == target
    if task == 1:
        print(answer)
    else:
        most = max(frequency)
        print(*(i for i in range(1, 2027) if frequency[i] == most))


if __name__ == '__main__':
    main()
