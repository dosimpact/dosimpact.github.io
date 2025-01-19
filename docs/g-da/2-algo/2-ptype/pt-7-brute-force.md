---
sidebar_position: 7
---

# Brute Force  

# 풀이법

1. 문제의 가능한 경우의 수를 도출한다. BF가 될 것 같나? 시간제한 조건을 보면됨. | 일부로 풀리겠끔 N제한을 두는경우가 있음.  
2. 풀이 방법 선택 : 그냥 다 해보기 (for문 사용) | *재귀 사용* | 순열 사용  | 비트 마스크 사용.  


### 문제유형. 그냥 다해보기


아홉 난쟁이 https://www.acmicpc.net/problem/2309  
- 노트 : For문으로 하나씩 다 돌려보는 기초.  

ESM날짜
- 특이점 : For 문으로 하나씩 다 돌려봄

테트로미노
- 특이점 : 일부는 BFS 탐색 + 일부는 직접 만들기

- 1,2,3 더하기, 


### 문제 유형, 2차원 배열, 완전탐색
	- + check 후 , 재귀 끝나면 check 취소 # check lock

	- 십자가 놓기 https://www.acmicpc.net/problem/17085
	특이점 : 재귀함수 구현이 더 빡세다, 6중 반복문 만들기

### 문제유형. 재귀함수 설계

1, 2, 3 더하기 https://www.acmicpc.net/problem/9095  
- 노트 : 실버, 재귀함수 설계 기초


	- Nqueen https://programmers.co.kr/learn/courses/30/lessons/12952
	특이점 : 
		좌표를 Z로 두고 하나씩 이동할 수는 있다. 하지만 퀸의 특성으로 빠르게 구현 가능
		- 특정 ROW 퀸이 놓이게 되면, 해당 ROW는 다른 퀸이 놓일 수 없다.
		=> 바로 다음칸 이동 ( 시간단축1 ) ( ❌ 계속 같은 ROW 탐색했었다 )
		- N크기의 보드에서 N개의 퀸을 놓아야 하므로, 적어도 ROW에 하나씩은 놓아야 한다. 
		=> 한 ROW에 퀸을 못 두었다면 그 뒤로 나오는 재귀호출은 무의미 ( 싹을 다 짤라 ) ( 시간단축2 )
		

	- 암호 만들기 
	특이점 : base case 이후에 암호인지 추가 유효성 검사
	
	- 연산자 끼워넣기
	특이점 : combination느낌의 재귀 함수임. 
	
	- 퇴사
	특이점 : DP로 풀수도 있고, 재귀함수 BF로도 풀이가능
	
	- 부분수열의 합
	특이점 : 부분 집합이 0 인경우, 공집합을 제외해야함


### 문제유형. 순열 사용


- 2.1 순열 사용 : 다음 순열 직접 만들기. 외판원순회2
- 2.2 순열을 이용한 조합 사용 : 로또 문제, 연산자끼워넣기 문제.



- example) 다음순열 직접 구현

```js
function nextPermutation(s) {
    let i = s.length - 1; // 뒤에서 갑자기 올라가다 꺾이는 구간
    while (i > 0 && s[i - 1] >= s[i]) {
        i--;
    }
    if (i === 0) {
        return false; // 더 이상의 순열이 없음
    }
    let j = s.length - 1;
    while (s[j] <= s[i - 1]) {
        j--;
    }
    // swap s[i-1]과 s[j]
    [s[i - 1], s[j]] = [s[j], s[i - 1]];
    
    j = s.length - 1;
    while (i < j) {
        // swap s[i]과 s[j]
        [s[i], s[j]] = [s[j], s[i]];
        i++;
        j--;
    }
    return true;
}

// 사용 예시
const arr = [1, 2, 3];
if (nextPermutation(arr)) {
    console.log(arr); // 다음 순열 출력
} else {
    console.log("더 이상 순열이 없습니다.");
}
```


### 문제 유형. 비트 마스크 사용

	- 부분수열의 합
	특이점 : 공집합은 제외이므로, 0000,0001,0010,…,1111을 순회할때, 0000은 빼고 시작한다
	
	- 집합 https://www.acmicpc.net/problem/11723
	특이점 : Bit 연산 및 비트마스크 연습하기 좋은 문제
	


