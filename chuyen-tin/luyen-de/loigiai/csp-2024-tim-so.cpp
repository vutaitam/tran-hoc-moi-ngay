#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
// CÓ ĐIỀU KIỆN: giả sử phải chọn x LỚN NHẤT (đề chưa ghi rõ).
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    vector<int>v{0};
    for(int mask=1;mask<(1<<9);++mask){
        int x=0;for(int d=1;d<=9;++d)if(mask>>(d-1)&1)x=x*10+d;
        v.push_back(x);
    }
    sort(v.begin(),v.end());
    int T;if(!(cin>>T))return 0;
    while(T--){int a;cin>>a;cout<<*prev(upper_bound(v.begin(),v.end(),a))<<'\n';}
}
