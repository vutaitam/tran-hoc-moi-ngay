#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n,q;if(!(cin>>n>>q))return 0;
    vector<long long>a(n),pref(n+1);for(auto &v:a)cin>>v;
    sort(a.begin(),a.end());for(int i=0;i<n;++i)pref[i+1]=pref[i]+a[i];
    long long shift=0;
    while(q--){
        long long x;cin>>x;shift+=x;
        long long k=lower_bound(a.begin(),a.end(),-shift)-a.begin();
        // Các phần tử trước k âm; phần còn lại không âm.
        long long neg=pref[k]+k*shift;
        long long pos=pref[n]-pref[k]+(n-k)*shift;
        cout<<pos-neg<<'\n';
    }
}
