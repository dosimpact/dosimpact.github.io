---
sidebar_position: 5
---

# Next + Radix UI

- [Next + Radix UI](#next--radix-ui)
  - [공식문서](#공식문서)
  - [특징](#특징)
  - [Key Features](#key-features)
    - [Accessible](#accessible)
    - [Unstyled](#unstyled)
    - [Opened](#opened)
    - [Uncontrolled](#uncontrolled)
    - [Developer experience](#developer-experience)
    - [Incremental adoption](#incremental-adoption)
  - [composition (asChild)](#composition-aschild)
  - [Dialog Usage](#dialog-usage)


## 공식문서

https://www.radix-ui.com/primitives/docs/overview/introduction

## 특징 

## Key Features

### Accessible

- 구성 요소는 가능한 경우 WAI-ARIA 디자인 패턴을 준수. 
- 아리아 및 역할 속성, 포커스 관리, 키보드 탐색 등 접근성과 관련된 어려운 구현 세부 사항을 처리합니다. 

### Unstyled

- 컴포넌트는 제로 스타일로 제공
- 스타일링을 완벽하게 제어할 수 있습니다.
- 컴포넌트는 모든 스타일링 솔루션(바닐라 CSS, CSS 전처리기, CSS-in-JS 라이브러리)으로 스타일링할 수 있습니다.
- TailWindCSS랑 잘 붙고, 공식문서에 예시가 잘 되어있다. 

### Opened

- 커스터마이징에 열려있다.
- 각 컴포넌트 부분에 대한 세분화된 액세스를 제공, 자신만의 이벤트 리스너, 프롭 또는 레퍼런스를 추가 가능  


### Uncontrolled

- 해당되는 경우 컴포넌트는 기본적으로 제어되지 않지만 제어할 수도 있습니다. 
- 모든 동작 배선은 내부적으로 처리되므로 로컬 상태를 만들 필요 없이 최대한 원활하게 시작하고 실행할 수 있습니다.

### Developer experience

- 저희의 주요 목표 중 하나는 최상의 개발자 경험을 제공
- radix 프리미티브는 완전한 타입의 API를 제공합니다. 
- 모든 컴포넌트는 유사한 API를 공유하여 일관되고 예측 가능한 경험을 제공
- 사용자가 렌더링된 요소를 완전히 제어할 수 있도록 asChild 프로퍼티를 구현했


### Incremental adoption

- 점직적으로 설치한다.  

```
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tooltip
```


## composition (asChild)

https://www.radix-ui.com/primitives/docs/guides/composition

- DOM 요소를 렌더링하는 모든 Radix 기본 부분은 asChild prop을 허용.   
- asChild로 설정되면 Radix는 기본 DOM 요소를 렌더링하지 않고 대신 부품의 하위 요소를 복제하고 해당 요소를 작동시키는 데 필요한 소품과 동작을 전달합니다.  

예를들어 툴팁같은 경우에 툴팁을 트리거링 해주는 버튼 요소가 있다.
- 버튼 포커싱 -> 툴팁이 나온다.  
- 근데 트리거링 버튼 자체는 Radix 에서 기본적으로 제공해준다.  
- 기본 버튼 자체를 커스터 마이징 하려면 asChild를 넣어 다른 요소로 툴팁컴포넌트와 사용 가능 

---

## Dialog Usage