---
sidebar_position: 1
---

# CSS  


## Text  

### Ellipsis Basic  

### Ellipsis 2행  

- overflow hidden 및 text-overflow ellipsis는 기본 설정이지만,    
- display:-webkit-box 및 line-clamp 속성을 이용해야 합니다.  


```js
import React from "react";
import styled from "@emotion/styled";

const SLineEllipsis = styled.div`
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const LineEllipsis = () => {
  return (
    <SLineEllipsis>
      [HTML/CSS] 말줄임 표시 하는 방법: 1줄, 2줄 예제 [HTML/CSS] 말줄임 표시
      하는 방법: 1줄, 2줄 예제 [HTML/CSS] 말줄임 표시 하는 방법: 1줄, 2줄 예제
    </SLineEllipsis>
  );
};

export default LineEllipsis;

```

## Note  


### -webkit 속성이 붙는 경우

- 브라우저의 호환성 때문이다. 특정 브라우저에서만 해당 기능을 켤 수 있다.  
- -webkit(사파리, 크롬), -moz (Firebox), -o(Opera), 없는것은 표준  
- 브라우저 마다 서로 다른 랜더링 엔진을 사용하고 있다.  