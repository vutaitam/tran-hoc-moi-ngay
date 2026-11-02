#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <random>
#include <cstdint>
using namespace std;
using U = uint64_t;
using W = unsigned __int128;
U mul(U a,U b,U m){ return W(a)*b%m; }
U power(U a,U e,U m){ U r=1; for(;e;e>>=1,a=mul(a,a,m)) if(e&1) r=mul(r,a,m); return r; }
// Bộ cơ sở này cho Miller–Rabin xác định trên toàn miền uint64_t.
bool prime(U n){
    if(n<2) return false;
    for(U p: {2ULL,3ULL,5ULL,7ULL,11ULL,13ULL,17ULL,19ULL,23ULL,29ULL,31ULL,37ULL}){
        if(n%p==0) return n==p;
    }
    U d=n-1; int s=0; while(!(d&1)){d>>=1; ++s;}
    for(U a: {2ULL,325ULL,9375ULL,28178ULL,450775ULL,9780504ULL,1795265022ULL}){
        if(a%n==0) continue;
        U x=power(a%n,d,n); if(x==1 || x==n-1) continue;
        bool ok=false;
        for(int j=1;j<s;++j){x=mul(x,x,n); if(x==n-1){ok=true;break;}}
        if(!ok) return false;
    }
    return true;
}
mt19937_64 rng(20261102);
// Pollard–Rho/Brent: gom các phép gcd; thử lại khi gặp chu trình không hữu ích.
U rho(U n){
    if(n%2==0) return 2;
    if(n%3==0) return 3;
    for(;;){
        U y=rng()%(n-1)+1,c=rng()%(n-1)+1,g=1,r=1,x=0,ys=0;
        auto f=[&](U z){return (mul(z,z,n)+c)%n;};
        while(g==1){
            x=y; for(U i=0;i<r;++i)y=f(y);
            for(U k=0;k<r && g==1;k+=128){
                ys=y; U q=1, len=min<U>(128,r-k);
                for(U i=0;i<len;++i){y=f(y); q=mul(q,x>y?x-y:y-x,n);}
                g=gcd(q,n);
            }
            r*=2;
        }
        if(g==n){do{ys=f(ys);g=gcd(x>ys?x-ys:ys-x,n);}while(g==1);}
        if(g!=n) return g;
    }
}
void factor(U n,vector<U>& out){
    if(n==1)return;
    if(prime(n)){out.push_back(n);return;}
    U d=rho(n);factor(d,out);factor(n/d,out);
}
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int T; if(!(cin>>T))return 0;
    while(T--){
        U n;cin>>n;
        // Hai số liên tiếp luôn có một số chẵn; n lẻ không có đáp án.
        if(n&1){cout<<-1<<'\n';continue;}
        vector<U> f;factor(n,f);sort(f.begin(),f.end());
        vector<U> ds{1};
        for(size_t i=0;i<f.size();){
            size_t j=i;while(j<f.size()&&f[j]==f[i])++j;
            size_t old=ds.size();U pw=1;
            for(size_t e=i;e<j;++e){pw*=f[i];for(size_t k=0;k<old;++k)ds.push_back(ds[k]*pw);}
            i=j;
        }
        sort(ds.begin(),ds.end()); vector<char> take(ds.size(),false);
        for(size_t i=1;i<ds.size();++i)if(ds[i]-ds[i-1]==1)take[i]=take[i-1]=true;
        bool any=false;
        for(size_t i=0;i<ds.size();++i)if(take[i]){if(any)cout<<' ';cout<<ds[i];any=true;}
        if(!any)cout<<-1;cout<<'\n';
    }
}
