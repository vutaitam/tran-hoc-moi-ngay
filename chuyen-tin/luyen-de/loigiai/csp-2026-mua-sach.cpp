#include <iostream>
#include <vector>
#include <deque>
#include <algorithm>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n,k;if(!(cin>>n>>k))return 0;
    vector<long long>a(n);for(auto&x:a)cin>>x;
    while(k--){
        long long budget,sum=0;cin>>budget;int left=0,ans=0;deque<int>q;
        for(int right=0;right<n;++right){
            sum+=a[right];
            while(!q.empty()&&a[q.back()]<=a[right])q.pop_back();q.push_back(right);
            // Giá phải trả = tổng - ceil(giá lớn nhất / 2).
            while(left<=right&&sum-(a[q.front()]+1)/2>budget){
                if(q.front()==left)q.pop_front();sum-=a[left++];
            }
            ans=max(ans,right-left+1);
        }
        cout<<ans<<'\n';
    }
}
