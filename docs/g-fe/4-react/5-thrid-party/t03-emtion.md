---
sidebar_position: 3
---

# Emotion Basic


## Install

```
npm i @emotion/react @emotion/styled emotion-normalize  
npm i @emotion/babel-plugin -D
```

```js
// babel.config.js
{
  "plugins": ["@emotion"]
}

// css props를 같이쓰고 싶다면?  
// https://emotion.sh/docs/css-prop
{
  "presets": [
    [
      "@babel/preset-react",
      { 
        "runtime": "automatic",  // import React를 자동으로 해준다.  
        "importSource": "@emotion/react" // jsx에 css속성을 넣어준다. 
      } 
    ]
  ],
  "plugins": ["@emotion/babel-plugin"]
}
```
📚 plugin vs presets  

- preset은 plugin의 모음이다.   

## normalize css 
normalize css vs reset css 뭐를 선택?  

-	디자인에 대한 완벽한 통제가 필요하고, 모든 스타일을 새롭게 정의하고 싶다면 Reset CSS를 선택
-	기본 스타일을 유지, 브라우저 간의 스타일 차이를 줄이기, Normalize CSS를 사용
- *대부분의 경우는 Normalize CSS가 더 가벼우면서도 실용적


```js
import { css, Global } from '@emotion/react';
import emotionNormalize from 'emotion-normalize';

// ...

<Global
  styles={css`
    ${emotionNormalize}
    html,
    body {
      padding: 0;
      margin: 0;
      background: white;
      min-height: 100%;
      font-family: Helvetica, Arial, sans-serif;
    }
  `}
/>
```
## example  

### css props  

```js
    <div
      className={className}
      css={css`
        display: flex;
        align-items: center;
      `}
    >
```

### styled  

#### props, typing  

```js
import styled from '@emotion/styled';

const SInput = styled.input`
  width: ${props => props.width ?? 'auto'};
  font-size: 30px;
  border-radius: 1px;
  outline: none;
  border: 0 none;
`;
---
import styled from '@emotion/styled';

interface SInputProps {
  width?: string; // width가 optional이므로 '?'를 사용
}

const SInput = styled.input<SInputProps>`
  width: ${(props) => props.width ?? 'auto'};
  font-size: 30px;
  border-radius: 1px;
  outline: none;
  border: 0 none;
`;

export default SInput;
```

#### nested tag  

```js
const ListWrapper = styled(List)`
  height: 50vh;
  li {
    display: flex;
    &.active {
      border-radius: 4px;
    }
  }
`;
```