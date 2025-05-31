---
sidebar_position: 101
---

# Clean Code 2


게슈탈트 법칙으로 이해하는 클린코드: 가독성의 비밀  
>https://velog.io/@teo/cleancode    


유사하지만 미묘한 차이를 지니는 단어들도 있습니다. 가령 'current'는 현재 활성화된 항목을, 'selected'는 사용자에 의해 선택된 항목을 의미합니다.
이러한 미묘한 차이를 이해하고 적절히 사용하면, 코드의 의도를 더 명확히 전달할 수 있으며, 다른 개발자들이 코드를 더 쉽게 이해하고 유지보수할 수 있게 됩니다.
각 이름들은 어떤 차이들이 있을까요?
- create(), add(), push(), insert()
- fetch(), retrieve(), load(), get()
- update(), modify(), edit(), change()
- remove(), delete(), clear(), erase()
- find(), search(), lookup(), query()
- check(), validate(), verify(), test()
- convert(), transform(), parse(), format()
- render(), display(), show(), present()
- toggle(), switch(), flip(), alternate()
- mount(), attach(), append(), connect()
- unmount(), detach(), remove(), disconnect()
- subscribe(), listen(), observe(), watch()
- unsubscribe(), unlisten(), ignore(), stopWatching()
- dispatch(), emit(), trigger(), fire()
- handle(), process(), manage(), deal()
- isOpen, isVisible, isActive, isEnabled
- onSubmit, onSend, onConfirm, onApply
- setState, updateState, setProps, updateProps
- useEffect, useCallback, useMemo, useRef

1. create(), add(), push(), insert()

이들은 데이터를 생성하거나 추가할 때 주로 사용되지만, 각각의 뉘앙스가 달라요.
 - create()
   - 의미: 무언가를 새로 생성한다는 의미. 객체나 리소스가 존재하지 않을 때 사용.
   - 사용 예시: createUser() (새로운 유저 생성)
   - 중점: “없는 것을 새롭게 만듦.”
 - add()
   - 의미: 기존 데이터 구조(리스트, 배열 등)에 새 항목을 추가.
   - 사용 예시: addItemToCart() (장바구니에 항목 추가)
   - 중점: “기존에 존재하는 것에 덧붙임.”
 - push()
   - 의미: 주로 스택(Stack)과 같은 자료구조에서 마지막에 추가.
   - 사용 예시: push(5) (스택에 5 추가)
   - 중점: “순서와 데이터 구조에 기반한 추가.”
 - insert()
   - 의미: 특정 위치에 새 데이터를 삽입.
   - 사용 예시: insert(2, 'item') (인덱스 2에 항목 삽입)
   - 중점: “지정된 위치에 넣음.”

1. fetch(), retrieve(), load(), get()

이들은 데이터를 가져오는 역할을 하지만, 맥락에 따라 다릅니다.
 - fetch()
   - 의미: 주로 외부 리소스(API, 서버 등)로부터 데이터를 가져옴.
   - 사용 예시: fetchDataFromAPI()
   - 중점: “원격에서 데이터를 가져옴.”
 - retrieve()
   - 의미: 저장소(데이터베이스, 캐시 등)에서 데이터를 검색.
   - 사용 예시: retrieveRecordFromDatabase()
   - 중점: “데이터베이스나 저장소로부터 검색.”
 - load()
   - 의미: 메모리나 시스템에 데이터를 읽어들임. 초기화의 의미를 포함.
   - 사용 예시: loadConfigFile()
   - 중점: “시스템에 데이터를 불러와 사용 준비.”
 - get()
   - 의미: 값을 단순히 읽거나 반환. 매우 일반적인 함수 이름.
   - 사용 예시: getUserName()
   - 중점: “어디서든 값을 가져옴.”

1. update(), modify(), edit(), change()
 - update(): 기존 데이터의 일부를 새로운 값으로 갱신.
   - 예: updateProfile() (프로필 정보 갱신)
   - 중점: “최신 상태로 갱신.”
 - modify(): 주로 구조나 속성을 일부 수정.
   - 예: modifySettings() (설정 일부 수정)
   - 중점: “약간 변경.”
 - edit(): 사람이 데이터를 직접 수정하는 뉘앙스.
   - 예: editDocument() (문서 수정)
   - 중점: “수동 작업.”
 - change(): 광범위한 의미로 무언가를 바꿈.
   - 예: changePassword() (비밀번호 변경)
   - 중점: “전체적인 변화.”

2. remove(), delete(), clear(), erase()
 - remove(): 특정 항목을 데이터 구조에서 제거.
   - 예: removeItemFromCart()
   - 중점: “제거하고 다른 데이터는 유지.”
 - delete(): 데이터 자체를 영구적으로 삭제.
   - 예: deleteAccount()
   - 중점: “완전 삭제.”
 - clear(): 전체 데이터를 초기화하거나 비움.
   - 예: clearCache()
   - 중점: “내용을 전부 비움.”
 - erase(): 흔적 없이 지움. 데이터와 기록을 제거.
   - 예: eraseDisk()
   - 중점: “지우고 흔적 없음.”

3. find(), search(), lookup(), query()
 - find(): 특정 조건에 맞는 항목을 탐색하고 반환.
   - 예: findUserById()
   - 중점: “특정 항목 찾기.”
 - search(): 더 광범위한 탐색. 결과가 없을 수도 있음.
   - 예: searchFiles()
   - 중점: “대상 전체를 탐색.”
 - lookup(): 특정 데이터베이스나 맵에서 빠른 조회.
   - 예: lookupDefinition()
   - 중점: “미리 정리된 데이터에서 빠르게 찾기.”
 - query(): 데이터베이스나 API에서 복잡한 조건으로 검색.
   - 예: queryDatabase()
   - 중점: “조건에 맞는 검색.”

4. check(), validate(), verify(), test()
 - check(): 단순히 상태나 조건을 확인.
   - 예: checkFileExists()
   - 중점: “간단한 점검.”
 - validate(): 입력값 등이 유효한지 검사.
   - 예: validateInput()
   - 중점: “조건 만족 여부 확인.”
 - verify(): 무언가가 정확하거나 진실인지 확인.
   - 예: verifySignature()
   - 중점: “신뢰성 확인.”
 - test(): 시스템이나 코드를 실행하여 테스트.
   - 예: testFunctionality()
   - 중점: “작동 여부 확인.”

5. convert(), transform(), parse(), format()
 - convert(): 데이터 형식이나 타입을 변환.
   - 예: convertJsonToXml()
   - 중점: “형식 변경.”
 - transform(): 구조나 형태를 근본적으로 변화.
   - 예: transformData()
   - 중점: “구조적 변화.”
 - parse(): 데이터를 분석하고 구성 요소로 분리.
   - 예: parseJson()
   - 중점: “데이터 해석.”
 - format(): 데이터를 특정 방식으로 표현.
   - 예: formatDate()
   - 중점: “표현 방식 변경.”

6. render(), display(), show(), present()
 - render(): 화면이나 UI에 시각적으로 출력.
   - 예: renderPage()
   - 중점: “결과물을 시각화.”
 - display(): 특정 데이터를 화면에 출력.
   - 예: displayMessage()
   - 중점: “간단히 보여줌.”
 - show(): 상태나 정보를 노출하거나 활성화.
   - 예: showPopup()
   - 중점: “보이도록 설정.”
 - present(): 데이터를 명확히 전달.
   - 예: presentReport()
   - 중점: “정리된 형태로 전달.”

7. toggle(), switch(), flip(), alternate()
 - toggle(): 두 상태를 번갈아 전환.
   - 예: toggleDarkMode()
   - 중점: “두 상태 간 전환.”
 - switch(): 여러 상태 중 하나로 변경.
   - 예: switchTheme()
   - 중점: “상태 변경.”
 - flip(): 상태나 방향을 뒤집음.
   - 예: flipCard()
   - 중점: “완전히 뒤집기.”
 - alternate(): 정해진 순서에 따라 교대로 전환.
   - 예: alternateStyles()
   - 중점: “순차적 전환.”

8. mount(), attach(), append(), connect()
 - mount(): 데이터를 UI나 시스템에 연결하고 활성화.
   - 예: mountComponent()
   - 중점: “시스템에 추가.”
 - attach(): 특정 요소를 다른 곳에 결합.
   - 예: attachEventHandler()
   - 중점: “붙임.”
 - append(): 기존 데이터 끝에 추가.
   - 예: appendChild()
   - 중점: “끝에 덧붙임.”
 - connect(): 두 시스템이나 요소를 연결.
   - 예: connectToDatabase()
   - 중점: “연결 설정.”

9. unmount(), detach(), remove(), disconnect()
 - unmount(): UI나 시스템에서 분리하고 비활성화.
   - 예: unmountComponent()
   - 중점: “시스템에서 제거.”
 - detach(): 기존 결합을 해제.
   - 예: detachEventHandler()
   - 중점: “연결 해제.”
 - remove(): 데이터 구조에서 제거.
   - 예: removeItem()
   - 중점: “데이터를 삭제.”
 - disconnect(): 시스템 간 연결을 끊음.
   - 예: disconnectFromServer()
   - 중점: “연결 종료.”

10. subscribe(), listen(), observe(), watch()
 - subscribe(): 특정 이벤트나 데이터를 등록하여 수신.
   - 예: subscribeToNewsletter()
   - 중점: “등록하여 지속적 수신.”
 - listen(): 이벤트 발생을 대기.
   - 예: listenToEvent()
   - 중점: “수동적으로 대기.”
 - observe(): 상태나 변화를 관찰.
   - 예: observeDataChanges()
   - 중점: “변화 추적.”
 - watch(): 상태를 계속 추적.
   - 예: watchFile()
   - 중점: “장기적 관찰.”

11. unsubscribe(), unlisten(), ignore(), stopWatching()
 - unsubscribe(): 특정 구독에서 해제.
   - 예: unsubscribeFromTopic()
   - 중점: “수신 중단.”
 - unlisten(): 이벤트 리스너를 제거.
   - 예: unlistenToEvent()
   - 중점: “이벤트 대기 중단.”
 - ignore(): 데이터를 무시.
   - 예: ignoreWarnings()
   - 중점: “의도적으로 무시.”
 - stopWatching(): 상태나 변화를 추적 중단.
   - 예: stopWatchingFile()
   - 중점: “관찰 종료.”

12. dispatch(), emit(), trigger(), fire()
 - dispatch(): 이벤트를 시스템에 전달.
   - 예: dispatchEvent()
   - 중점: “이벤트 전달.”
 - emit(): 이벤트를 발생시킴.
   - 예: emitSignal()
   - 중점: “방출.”
 - trigger(): 특정 조건에서 동작을 유발.
   - 예: triggerAlert()
   - 중점: “조건 만족 시 실행.”
 - fire(): 이벤트를 즉각적으로 실행.
   - 예: fireCallback()
   - 중점: “즉시 실행.”

13. handle(), process(), manage(), deal()
 - handle(): 입력이나 이벤트를 처리.
   - 예: handleError()
   - 중점: “상황 대처.”
 - process(): 데이터를 처리하여 결과 생성.
   - 예: processData()
   - 중점: “작업 수행.”
 - manage(): 전체 상태를 관리.
   - 예: manageResources()
   - 중점: “효율적 운영.”
 - deal(): 특정 상황에 대처.
   - 예: dealWithProblem()
   - 중점: “문제 해결.”  

