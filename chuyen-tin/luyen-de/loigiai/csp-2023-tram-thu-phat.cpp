#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int T;if(!(cin>>T))return 0;
    while(T--){
        int n;long long k;cin>>n>>k;
        vector<long long>p(n+1),dp(n+1);
        for(int i=1;i<=n;++i)cin>>p[i];
        int j=0;
        for(int i=1;i<=n;++i){
            long long a;cin>>a;
            while(j+1<i && p[j+1]<=p[i]-k)++j;
            // Chọn i chỉ nối với phương án nằm hoàn toàn trong 1..j.
            dp[i]=max(dp[i-1],dp[j]+a);
        }
        cout<<dp[n]<<'\n';
    }
}
