#include <iostream>
#include <queue>
#include <vector>
#include <functional>
using namespace std;
// CÓ ĐIỀU KIỆN: năng lượng ban đầu bằng 0 (thân đề không ghi rõ).
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n;if(!(cin>>n))return 0;
    priority_queue<long long,vector<long long>,greater<long long>> chosen;
    long long sum=0;
    for(int i=0;i<n;++i){
        long long x;cin>>x;sum+=x;chosen.push(x);
        // Loại giá trị nhỏ nhất để giữ năng lượng tốt nhất cùng số lượng.
        if(sum<0){sum-=chosen.top();chosen.pop();}
    }
    cout<<chosen.size()<<'\n';
}
