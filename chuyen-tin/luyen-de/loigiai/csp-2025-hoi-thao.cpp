#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n;long long p;if(!(cin>>n>>p))return 0;
    vector<long long>a(n);for(auto&v:a)cin>>v;sort(a.begin(),a.end());
    int l=0,r=n-1;long long ans=0;
    while(l<r){
        if(a[l]+a[r]<=p){ans+=r-l;++l;} // Mọi đối tác l+1..r đều hợp lệ.
        else --r;
    }
    cout<<ans<<'\n';
}
