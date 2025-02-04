---
sidebar_position: 8
---

# Greedy

- [Greedy](#greedy)
  - [문제유형 : 토너먼트 그리디](#문제유형--토너먼트-그리디)
  - [문제유형 : 최적의 선택으로 거리 줄이기](#문제유형--최적의-선택으로-거리-줄이기)


어떤 작은 선택이 최적의 해결책인 경우, 그리디를 사용한다.

예)최소 동전 문제
- 동전의 종류가 [1, 5, 10, 25]이고, 목표 금액이 63이라면, 최소한의 동전을 사용하여 이 금액을 만드는 방법  
  - 가장 큰 동전인 25원을 가능한 한 많이 사용
  - 그 다음 동전을 가장 많이 사용

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