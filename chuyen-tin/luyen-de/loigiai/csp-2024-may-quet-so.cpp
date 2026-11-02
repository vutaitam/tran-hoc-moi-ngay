#include <iostream>
#include <string>
using namespace std;
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    string n,bad;if(!(cin>>n))return 0;cin>>bad;
    bool blocked[10]={};for(char c:bad)blocked[c-'0']=true;
    // dp[đã nhỏ hơn n][đã có chữ số đầu tiên khác 0].
    long long dp[2][2]={};dp[0][0]=1;
    for(char ch:n){
        long long next[2][2]={};int digit=ch-'0';
        for(int less=0;less<2;++less)for(int started=0;started<2;++started)
            for(int d=0;d<10;++d){
                if(!less&&d>digit)continue;
                int ns=started||(d!=0),nl=less||(d<digit);
                // Số 0 đệm ở đầu không phải chữ số của số cần đếm.
                if(ns&&blocked[d])continue;
                next[nl][ns]+=dp[less][started];
            }
        for(int a=0;a<2;++a)for(int b=0;b<2;++b)dp[a][b]=next[a][b];
    }
    cout<<dp[0][1]+dp[1][1]<<'\n';
}
