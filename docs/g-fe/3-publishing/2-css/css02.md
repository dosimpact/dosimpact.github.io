---
sidebar_position: 2
---

# Text CSS    

## Text  

### Ellipsis Basic  

```js
export const Ellipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

<div style={{width:"100px"}}> # container width 지정 필수
  <Ellipsis>...</Ellipsis>
</div>
```

### Ellipsis 2행  

- overflow hidden 및 text-overflow ellipsis는 기본 설정이지만,    
- display:-webkit-box 및 line-clamp 속성을 이용해야 합니다.  


```js
export const EllipsisLine2 = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

<div style={{width:"100px"}}> # container width 지정 필수
  <EllipsisLine2>...</EllipsisLine2>
</div>

```

## Note  


### -webkit 속성이 붙는 경우

- 브라우저의 호환성 때문이다. 특정 브라우저에서만 해당 기능을 켤 수 있다.  
- -webkit(사파리, 크롬), -moz (Firebox), -o(Opera), 없는것은 표준  
- 브라우저 마다 서로 다른 랜더링 엔진을 사용하고 있다.  


## Icon

### 색상 상속받는 아이콘 설정  


```js
<div>  // 1.text-color 속성을 준다.
  <svg> // 2.svg에서 color를 받는다. (안받아도 괜찮)
    <path> // 3.path에 fill='currentColor'를 주면 상위 text-color를 상속받는다.  
    </path>
  </svg>
</div>
```
