#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <iomanip>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n;if(!(cin>>n))return 0;
    vector<pair<long long,int>> p;
    for(int color=0;color<2;++color)for(int i=0;i<n;++i){
        long long x,y;cin>>x>>y;p.push_back({x*x+y*y,color? -1:1});
    }
    sort(p.begin(),p.end());int balance=0;
    for(size_t i=0;i<p.size();){
        size_t j=i;long long radius2=p[i].first;
        // Tính cả biên: không được kiểm tra cân bằng giữa một nhóm cùng bán kính.
        while(j<p.size()&&p[j].first==radius2){balance+=p[j].second;++j;}
        if(balance==0){cout<<fixed<<setprecision(6)<<sqrt((long double)radius2)<<'\n';return 0;}
        i=j;
    }
}
