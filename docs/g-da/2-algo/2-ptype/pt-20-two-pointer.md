---
sidebar_position: 12
---

# 투 포인터  


- [투 포인터](#투-포인터)
  - [문제 유형, Distinct value counter (AbsDistinct)](#문제-유형-distinct-value-counter-absdistinct)
  - [문제 유형, (CountDistinctSlices)](#문제-유형-countdistinctslices)


투 포인터 기법 : 2개의 인덱스(포인터)를 사용하여 배열이나 리스트를 순회  
- 애벌레 기법 (Caterpillar method) 라고도 한다.  
- O(n**2) 을 O(n) or O(nlogn)으로 최적화 함.  
- 문제 패턴1, 같은 방향으로 투 포인터 이동  
  - front, back이 0을 가르키다가, back을 고정 후 front가 조건을 만족하는 가장 먼 위치로 이동, 그리고 back을 다시 움직임  
- 문제 패턴2, 두 포인터가 양 끝에서 시작해서 중앙을 향해 이동한다.  

- 정렬 등의 배열의 순서가 결정된 상태에서 순회해야 한다.  
  - 그래야 투 포인터가 이동하면서 다시 백트래킹 할 필요가 없다.  

## 문제 유형, Distinct value counter (AbsDistinct)  

https://app.codility.com/programmers/lessons/15-caterpillar_method/abs_distinct/   

문제 : 배열에서 distinct value의 갯수를 찾는 문제, 단 절대값으로 본다.  
특이점
  - 1. 냄새 : 배열이 non-decreasing order ( 오름차순이 아닌, 즉 같거나 내림차순 ) 
로직
  - 1. 배열의 0, N-1로 투포인터를 장착하고, 각 배열의 끝점만으로 문제의 조건을 판단 가능.    
  - 2. 조건에 따라서 투 포인터를 중앙으로 수렴할 수 있다.  

```js
function solution(A) {
    // 공간 복잡도가 O(n)으로 , 투포인터로 최적화 가능하다.  
    return new Set( A.map(e => Math.abs(e)) ).size
}
---
function solution(A) {
    let left = 0;
    let right = A.length - 1;
    let distinctCount = 0;

    while (left <= right) {
        distinctCount++;

        const leftAbs = Math.abs(A[left]);
        const rightAbs = Math.abs(A[right]);

        if (leftAbs > rightAbs) {
            while (left <= right && Math.abs(A[left]) === leftAbs) {
                left++;
            }
        } else if (rightAbs > leftAbs) {
            while (left <= right && Math.abs(A[right]) === rightAbs) {
                right--;
            }
        } else {
            while (left <= right && Math.abs(A[left]) === leftAbs) {
                left++;
            }
            while (left <= right && Math.abs(A[right]) === rightAbs) {
                right--;
            }
        }
    }

    return distinctCount;
}
```

## 문제 유형, (CountDistinctSlices)


https://app.codility.com/demo/results/training9KGKGW-ZEM/

문제 : 배열에서 distinct value의 Set의 갯수를 구하는 문제  
특이점
  - 1. 냄새 : 배열의 순서가 고정되어 있음.   
  - 2. back, front 포인터를 통해서 내부 Set을 계산이 가능하다.   
로직
  - 1. 시작이 같은 투포인터로 시작한다. 조건에 맞게 front pointer를 최대한 늘린다.  
  - 2. 조건에 맞는 front ~ back의 수를 계산한다.  
  - 3. 조건을 보고 back pointer를 늘린다.   


```js
function solution(M, A) {
    // Implement your solution here
    // 정수 M, 배열 A ( 0, 양수 구성 , 모두 M보다 작거나 같다)
    // A의 슬라이스 = (P,Q) 쌍 ( 0 <= P <= Q < N, 인덱스 ) 정의  
    // => A[P], ... ,A[Q]
    // A의 구별 슬라이스 : 유니크 숫자로 구성   

    // n번 투 포인터를 돌린다.  
    
    let totalSlices = 0;
    let front = 0;
    let back = 0;
    const limit = 1000000000; // 문제에서 제시한 최대 반환값
    const N = A.length;

    // 각 숫자가 현재 슬라이스에 존재하는지 확인하기 위한 배열
    // M은 최대 100,000이므로 배열로 관리하는 것이 Map보다 빠릅니다.
    const seen = new Array(M + 1).fill(false);

    while (front < N) {
        if (seen[A[front]] === false) {
            // 1. front에 있는 숫자가 현재 슬라이스에 없는 경우 (중복 아님)
            seen[A[front]] = true; // 방문 체크
            // back에서 front까지의 모든 부분 배열이 유효하므로 개수를 더함
            // 예: [3, 4]가 유효하다면, 새로 추가된 4로 인해 [4], [3, 4] 2개가 추가됨
            totalSlices += (front - back + 1); // [3] / [3,4], [4] / [3,4,5], [4,5], [5] / [5]/ [5,2], [2]

            // 10억 개를 초과하면 즉시 반환
            if (totalSlices >= limit) {
                return limit;
            }

            front++; // 앞쪽 포인터 전진
        } else {
            // 2. front에 있는 숫자가 이미 존재하는 경우 (중복 발생)
            // 중복된 숫자가 사라질 때까지 back 포인터를 이동시키며 방문 해제
            seen[A[back]] = false;
            back++;
        }
    }

    return totalSlices;
}
```

