---
sidebar_position: 20
---

# React Optimization 2 - useDeferredValue 

- [React Optimization 2 - useDeferredValue](#react-optimization-2---usedeferredvalue)
  - [useDeferredValue](#usedeferredvalue)
    - [실전 패턴](#실전-패턴)
    - [Debounce + useDeferredValue 조합](#debounce--usedeferredvalue-조합)


## useDeferredValue

`useDeferredValue`는 React 18에서 도입된 Hook으로, UI 업데이트의 우선순위를 낮춰 성능을 최적화
- 값 자체가 지연되어 업데이트됩니다
- 값이 변경되기 전까지 이전 값을 유지
- 값이 변경되면 의존하는 코드가 트리거됩니다

```ts
const deferredValue = useDeferredValue(value);
```

실행 순서 예시  
- 상황 : 사용자 검색에 300ms의 디바운스 및 필터링 로직에 오래 시간이 걸리니 deffered value를 적용  

```typescript
// 사용자가 "상품명" 입력
console.log('1. searchQuery:', searchQuery); 
// → "상품명" (즉시)

// 300ms 후
console.log('2. debouncedSearchQuery:', debouncedSearchQuery); 
// → "상품명" (debounce 후)

// React가 여유 있을 때 (수 밀리초 ~ 수십 밀리초 후)
console.log('3. deferredSearchQuery:', deferredSearchQuery); 
// → "상품명" (defer 후)

// 이제 필터링 실행
// deferredSearchQuery 에 트리거링 되는 필터링 로직이어야 한다.  
const filteredItems = useMemo(() => {
  console.log('4. 필터링 시작:', deferredSearchQuery);
  return items.filter(...);
}, [items, deferredSearchQuery]);
```

사용해야 할 때
- 무거운 렌더링 작업 (수백~수천 개 항목 필터링/정렬)
- 검색/필터링 (사용자가 타이핑하는 동안)
- 실시간 차트/그래프 업데이트
- 지연되어도 사용자 경험에 영향 없는 경우

사용하지 말아야 할 때
- 즉각 반응 필요 : 페이지네이션, 버튼 클릭 액션 (즉각 피드백 필요), 폼 입력 (직접 입력하는 필드), 가벼운 연산 (성능 이점 없음)


### 실전 패턴

### Debounce + useDeferredValue 조합

```typescript
const [searchQuery, setSearchQuery] = useState(''); // 즉시 변경되는 쿼리  
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); // 300ms늦게 적용되는 값  

// Debounce: 빠른 연속 입력 방지
const debouncedSetSearchQuery = useCallback(
  debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 300),
  []
);

// Deferred: 무거운 렌더링 작업 우선순위 낮춤
const deferredSearchQuery = useDeferredValue(debouncedSearchQuery);

// 필터링: deferredSearchQuery 사용
const filteredItems = useMemo(() => {
  if (!deferredSearchQuery.trim()) return items;
  return items.filter(item => 
    item.name.includes(deferredSearchQuery)
  );
}, [items, deferredSearchQuery]);
```

효과

1. Input 반응성 유지: 사용자 입력은 즉시 반영
2. 불필요한 연산 방지: Debounce로 타이핑 중 연산 스킵
3. 부드러운 UI: 무거운 작업은 우선순위 낮게 처리

주의사항
- 컴포넌트 언마운트 혹은 컴포넌트 hidden (팝오버가 닫힐때) debounce cancel 로직을 넣어주면 좋다.  