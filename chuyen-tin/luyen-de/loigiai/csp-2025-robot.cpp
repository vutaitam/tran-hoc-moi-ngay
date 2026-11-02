#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;
// CÓ ĐIỀU KIỆN: chọn vị trí đầu tùy ý và chép ký tự đầu miễn phí.
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n,m;string s,t;if(!(cin>>n>>m>>s>>t))return 0;
    const long long INF=(1LL<<60);
    vector<long long>dp(n,INF),dist(n),next(n);
    for(int i=0;i<n;++i)if(s[i]==t[0])dp[i]=0;
    for(int k=1;k<m;++k){
        fill(dist.begin(),dist.end(),INF);
        long long best=INF;
        for(int i=0;i<n;++i)if(s[i]==t[k-1]){best=min(best,dp[i]-i);dist[i]=best+i;}
        best=INF;
        for(int i=n-1;i>=0;--i)if(s[i]==t[k-1]){best=min(best,dp[i]+i);dist[i]=min(dist[i],best-i);}
        fill(next.begin(),next.end(),INF);
        // Sau bước chuyển không chép, bước liền kề mới thêm ký tự tiếp theo.
        for(int i=0;i<n;++i)if(s[i]==t[k-1]&&dist[i]<INF/2){
            if(i>0&&s[i-1]==t[k])next[i-1]=min(next[i-1],dist[i]+1);
            if(i+1<n&&s[i+1]==t[k])next[i+1]=min(next[i+1],dist[i]+1);
        }
        dp.swap(next);
    }
    long long ans=*min_element(dp.begin(),dp.end());cout<<(ans>=INF/2?-1:ans)<<'\n';
}
