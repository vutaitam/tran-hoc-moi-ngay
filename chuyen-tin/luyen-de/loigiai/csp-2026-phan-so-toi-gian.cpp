#include <iostream>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int T;if(!(cin>>T))return 0;
    while(T--){
        long long n,a;cin>>n;
        if(n==2)a=1;
        else if(n%2)a=n/2;
        else if(n%4==0)a=n/2-1;
        else a=n/2-2;
        // Tử lớn nhất không vượt n/2 và nguyên tố cùng nhau với n.
        cout<<a<<' '<<n-a<<'\n';
    }
}
