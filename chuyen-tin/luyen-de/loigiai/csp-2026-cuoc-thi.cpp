#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n;long long k,m;if(!(cin>>n>>k>>m))return 0;
    long long total=0,rooms=0;vector<long long>rem;
    for(int i=0;i<n;++i){long long a;cin>>a;total+=a;rooms+=(a+k-1)/k;if(a%k)rem.push_back(a%k);}
    sort(rem.begin(),rem.end());
    long long limit=rooms-(total+k-1)/k,removed=0,moved=0;
    for(long long r:rem){
        // Giữ đủ sức chứa toàn cục và không vượt ngân sách điều chuyển.
        if(removed==limit||moved+r>m)break;
        moved+=r;++removed;
    }
    cout<<rooms-removed<<' '<<moved<<'\n';
}
