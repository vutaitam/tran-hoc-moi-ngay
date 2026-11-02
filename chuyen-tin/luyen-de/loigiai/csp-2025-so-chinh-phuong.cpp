#include <iostream>
#include <vector>
using namespace std;
// CÓ ĐIỀU KIỆN: đếm cặp CÓ THỨ TỰ, cho phép i=j, theo ví dụ.
// Nếu theo đúng i<j của thân đề, đáp án phải là (ans-n)/2.
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int n;if(!(cin>>n))return 0;
    vector<int>spf(n+1),kernel(n+1),count(n+1);kernel[1]=1;
    for(int p=2;p<=n;++p)if(!spf[p])for(int j=p;j<=n;j+=p)if(!spf[j])spf[j]=p;
    long long ans=0;
    for(int x=1;x<=n;++x){
        if(x>1){int p=spf[x],rest=x/p;kernel[x]=(rest%p==0?kernel[rest/p]:kernel[rest]*p);}
        // Thêm x: c cặp theo mỗi chiều và cặp (x,x).
        ans+=2LL*count[kernel[x]]+1;++count[kernel[x]];
    }
    cout<<ans<<'\n';
}
