#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <functional>
using namespace std;
bool feasible(const vector<pair<int,int>>&a,int machines){
    priority_queue<int,vector<int>,greater<int>>due;
    int n=a.size(),i=0;long long time=0;
    while(i<n||!due.empty()){
        if(due.empty())time=max(time,(long long)a[i].first);
        while(i<n&&a[i].first<=time){due.push(a[i].second);++i;}
        if(due.top()<time)return false;
        // Quy tắc hạn chót sớm nhất; mỗi bệ bắn tối đa một mục tiêu ở thời điểm này.
        for(int j=0;j<machines&&!due.empty();++j)due.pop();
        ++time;
    }
    return true;
}
int main(){
    ios::sync_with_stdio(false);cin.tie(nullptr);
    int T;if(!(cin>>T))return 0;
    while(T--){
        int n;cin>>n;vector<pair<int,int>>a(n);for(auto&x:a)cin>>x.first>>x.second;
        sort(a.begin(),a.end());int lo=1,hi=n;
        while(lo<hi){int mid=lo+(hi-lo)/2;if(feasible(a,mid))hi=mid;else lo=mid+1;}
        cout<<lo<<'\n';
    }
}
