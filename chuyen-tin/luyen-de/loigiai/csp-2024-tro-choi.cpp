#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n;long long m;if(!(cin>>n>>m))return 0;
    vector<long long>a(n);for(auto&v:a)cin>>v;
    long long sum=0;int left=0,longest=0;
    for(int right=0;right<n;++right){
        sum+=a[right];
        while(left<=right&&sum>=m)sum-=a[left++];
        longest=max(longest,right-left+1);
    }
    // Dài hơn mọi đoạn có tổng <m thì mọi khung đều đạt yêu cầu.
    cout<<longest+1<<'\n';
}
