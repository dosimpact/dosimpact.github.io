---
sidebar_position: 2
---

# FE QA Check List    

핵심  
- [ ] PRD에서 꼼꼼히 테스트 케이스들을 작성하는 훈련을 먼저 해야한다.    
- [ ] UI Stress Testing 진행하기 ( 포멧팅, 임계값 대응 )  

## 실수 사례 정리집     

### Bug Case
- 팝오버 UI의 라이프 싸이클 고려 ( 제출중 상태일때 입력, 제출, 팝오버 닫기등의 버튼 일시적 비활성화, 다시 팝오버 오픈하면 입력해두었던 상태 초기화 )  
- 포멧팅, 말줄임, 개행 이슈  
- 의존성 배열 이슈  
```js
// type userDict = { [id:number]:User } 으로 상태 선언함.
// getUserById 으로 사용자 정보를 얻어오는 경우 아래 케이스 적절?

// 👃
const targetUser = useCallback(()=> getUserById(targetId),[targetId]);

// 👀
// 위 경우에는 targetId가 변경되지 않는경우 최신의 유저 정보를 받아올 수 없다.

// ✅
const targetUser = useCallback(()=> getUserById(targetId),[targetId, userDict]);
// userDict이 변한경우에도 targetUser를 갱신해야 한다.  

```


### 스펙 이해  
- 변수값을 반대로 사용했다. 똑바로 변수명 및 의미 파악하자.   
- Validation Figma 스펙 100% 파악 못했다. 내가 우선순위를 자의적 해석함.  
- 엄청 디테일한 스펙인데 막상 구현하니 이상한 경우. 자의적 해석으로 구현함.  
- depth 정의가 기존 로깅과 다른 경우.  
- 2차 방어 코딩, BE에서 포멧팅, 배열 갯수 3개로 제한해서 주겠지? - 믿지마라.  
- 팝오버 상태의 프리패칭 - 캐시를 버리고 실시간성으로 스펙 변경하여 진행.  

