---
sidebar_position: 8
---

# Greedy (그리디)  

- [Greedy (그리디)](#greedy-그리디)
  - [정의, 증명(직관)](#정의-증명직관)
    - [예, 최소 동전 문제](#예-최소-동전-문제)
  - [문제유형 : 토너먼트 그리디](#문제유형--토너먼트-그리디)
  - [문제유형 : 최적의 선택으로 거리 줄이기](#문제유형--최적의-선택으로-거리-줄이기)
  - [문제유형 : 회의실 배정](#문제유형--회의실-배정)
  - [문제유형 : 밧줄 묶기](#문제유형--밧줄-묶기)


## 정의, 증명(직관)  
그리디 알고리즘 : 매 순간 지역적으로 최적의 선택을 결정하는 알고리즘  
- 완전탐색보다는 낫고, DP보다는 빠르지만 차선책이 나올 수 있다.  
- 코테에서는 최적해의 경우만 나오게 된다.  


수학적 증명 : https://gazelle-and-cs.tistory.com/59   
- 수학적 증명을 알 필요는 없지만, 직관적으로 이해하는것은 필요하다.  

1.Greedy Stays Ahead (탐욕이 늘 앞선다)  
- 느리지만 완벽한 어떠한 로직과 비교해서 빠른 선택을 해도 항상 괜찮은 경우,  
- 예를 들어 10개의 과제가 있고, 과제 완성에 시간이 각기 다른 경우에  
  - A는 빨리 끝내는 과제먼저 골라서 진행하고  
  - B는 어떠한 완벽한 순서로 진행한다고 가정하면, A는 B보다는 특정 기간마다 더 많은 과제를 수행한다.    

2.Certificate Argument (증거 논의)  
- 최소한 기계를 몇 대 써야하는가? 등의 문제에서 피크 타임을 예로 들어서 문제를 접근한다.  
- 상황: 회의실 배정 문제. 겹치는 회의가 많습니다. 최소 몇 개의 회의실이 필요할까요?
  - Greedy의 증거(Certificate) 제출: "자, 이 시간표를 봐. 오후 2시에 회의 5개가 동시에 진행되고 있지? 이 순간에는 물리적으로 방 5개가 무조건 필요해  

3.Exchange Argument (교환 논의)  
- 비유: 젠가 블록 바꿔치기
- 어떠한 완벽한 답안지의 탑을 보고 탑이 무너지거나 높이가 낮아지지 않으면서, 블록을 그리디 탑(내 알고리즘)으로 하나씩 바꿔도 문제가 없는경우.  
- 밧줄 문제에 적용하면: "완벽한 정답이 여기서 밧줄을 안 자르고 버텼다고? 그걸 **'지금 자르는 선택'**으로 바꿔볼게. 어라? 바꿨더니 뒤에 쓸 수 있는 밧줄이 더 늘어나서 이득이면 이득이지 손해는 없네? 그럼 그냥 지금 자르는 게 맞는 거야."

### 예, 최소 동전 문제

어떤 작은 선택이 최적의 해결책인 경우, 그리디를 사용한다.

- 동전의 종류가 [1, 5, 10, 25]이고, 목표 금액이 63이라면, 최소한의 동전을 사용하여 이 금액을 만드는 방법  
  - 가장 큰 동전인 25원을 가능한 한 많이 사용
  - 그 다음 동전을 가장 많이 사용
  - *주의 : 동전이 배수 관계여야 한다.  

```js
function minCoins(coins, target) {
    let count = 0; // 동전의 수를 세기 위한 변수
    coins.sort((a, b) => b - a); // 동전을 내림차순으로 정렬

for (let coin of coins) {  // 목표 금액을 만드는 과정
    while (target >= coin) { // 현재 동전으로 최대한 많이 사용
            target -= coin;
            count++;
        }
    }
    if (target > 0) { // 목표 금액이 0이 되지 않은 경우 만들 수 없는 경우
        return -1; // 또는 "목표 금액을 만들 수 없습니다."와 같은 메시지
    }
    return count; // 목표 금액을 만드는 데 사용한 동전의 수 반환
}

const coins = [5, 10]; const target = 3; // 동전 종류 및 목표 금액
console.log(minCoins(coins, target)); // 출력: -1 (목표 금액을 만들 수 없습니다.)

const coins2 = [1, 5, 10, 25]; const target2 = 63;
console.log(minCoins(coins2, target2)); // 출력: 6 (목표 금액을 만들 수 있습니다.)

```


## 문제유형 : 토너먼트 그리디

예상 대진표 https://school.programmers.co.kr/learn/courses/30/lessons/12985
- 사고과정 : 처음에는 이진탐색으로 접근 했지만, 조건이 틀렸다.
  - 가정 : 서로 다른 전/후 그룹에 속하면 A,B가 만날것이다 - 틀렸다. ( 다른 그룹에 속해도 안만날 수 있다. )  
- 전체를 시뮬레이션할 필요는 없다. 관심사만 본다.  
- 시간복잡도 : N이 2**20승 > 백만 O(log n)
- 접근 : Top Down Greedy

```
// 1, 2, 3, 4, 5, 6, 7, 8,
// -- ceil
// 1, 1, 2, 2, 3, 3, 4, 4,
// 1,    2,    3,    4
// --- ceil
// 1,1,2,2
// 1,  2
// --- ceil
// 1,  1
// 1 ---> 최종 승자
```

## 문제유형 : 최적의 선택으로 거리 줄이기

점프와 순간이동 https://school.programmers.co.kr/learn/courses/30/lessons/12980  
- 사고 과정 : 처음에는 bfs로 생각했다. 
  - BFS는 -> 시간 복잡도 초과, 쓸모없는 노드까지 방문한다. 
  - dp로 생각이 바뀌었다만 중복되는 서브 문제가 없어 시간 초과.
- 그리디 한 방식으로 접근 가능 함
  - 베터리 소모량 최소를 목표로 2가지 선택이며 다른 선택은 없다.
    - 거리 나누기 2 => 최적의 선택 
    - 점프 이동 => 차선의 선택  
- 접근 : Top Down Greedy

```js
// 오답 dp
let d = new Map();
d[1] = 1;
d[0] = 0;

function dp(n){
  if(n <=1) return n;
  if(d[n]) return d[n];
 
  if(n % 2 === 0){
      const dpN_2 = dp(n/2);
      d[n/2] = dpN_2;
      return dpN_2;
  }else{
      const dpN_1 = dp(n-1);
      d[n-1] = dpN_1;
      return dpN_1 + 1;
  }
}
```


## 문제유형 : 회의실 배정    

https://app.codility.com/demo/results/trainingZEU6C4-H3A/  
- 밧줄문제로 치환되었음.  
- 발상 : 그때 그때 최선은 밧줄 길이가 빨리 끝나는것을 선택하는 것이다.  
- 엣지 케이스 : 배열크기가 0인 경우 캐치.  

```js
function solution(A, B) {

    if(A.length === 0) {
        return 0;
    }

    // Implement your solution here
    let lastPosition = B[0];
    let totalCount = 1;

    for(let i =1; i <A.length; i++){
        if(A[i] > lastPosition && B[i] > lastPosition ){
            lastPosition = B[i];
            totalCount +=1;
        }
    }

    return totalCount;
}
```


## 문제유형 : 밧줄 묶기  

https://app.codility.com/programmers/lessons/16-greedy_algorithms/tie_ropes/  
- 엣지 케이스 : 기존의 묶던 밧줄을 버리고 완성된 밧줄을 택한다.  


```js
function solution(K, A) {
    // k보다 작은 경우 루프를 묶는다. 
    // (교환 논의)  
    // - 묶는게 낫지 버리는것보다는
    // - 하지만, 이미 k 이상인 루프가 있다면 안묶어도 된다. 오히려 별도로 가져가는게 이득  

    let tmpSum = 0; 
    let ans = 0;
    for(let i =0; i<A.length; i++){
        if(A[i]>=K){
            ans+=1; // 이미 완성된 경우 정답을 +1 더한다.  
            tmpSum=0; // 엣지 케이스 포인트, 완성된 경우 기존의 묶던 밧줄을 버린다. 
        }else{
            tmpSum += A[i];
            if(tmpSum >= K){ // 루프가 완성된 경우 정답을 +1 더한다
                ans +=1;
                tmpSum = 0;
            }
        }
    } 
    return ans;
}
```