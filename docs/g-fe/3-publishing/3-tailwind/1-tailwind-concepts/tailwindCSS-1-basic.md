---
sidebar_position: 1
---

# TailwindCSS 1 Concepts   


## Tailwind CSS 스타일을 구성 세 가지 핵심 레이어    

1.**base**
- **기본 스타일(Reset, Normalize, Typography 등)**  
- HTML 태그(h1, p, a 등)에 직접 적용되는 전역 스타일  
- 예시: 브라우저 기본 스타일을 초기화하거나, 폰트 패밀리/사이즈 등 전체에 적용할 스타일

```css
@layer base {
  h1 { font-size: 2rem; }
  body { font-family: 'Pretendard', sans-serif; }
}
```  


2.**utilities**
- **Tailwind의 핵심! 원자적(atomic) 유틸리티 클래스**
- margin, padding, color, flex 등 단일 속성에 대응하는 클래스
- 예시: `mt-4`, `text-center`, `bg-red-500`, `flex`, `p-2` 등

```html
<button class="bg-blue-500 text-white px-4 py-2 rounded">버튼</button>
```


3.**components**
- **재사용 가능한 컴포넌트 스타일**
- 버튼, 카드, 폼 등 여러 곳에서 반복적으로 쓸 수 있는 클래스  
- 보통 `.btn`, `.card` 등 커스텀 클래스로 만듦

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white rounded px-4 py-2;
  }
}
```

- **base**: HTML 태그에 적용되는 전역/기본 스타일
- **components**: 재사용 가능한 커스텀 컴포넌트 스타일
- **utilities**: Tailwind가 제공하는 원자적 클래스(핵심)


```css
@tailwind base; 
@tailwind components;
@tailwind utilities;


- Tailwind를 설치하면 global.css에 위와 같은 디렉티브가 있다.  
- 위 디렉티브는 기본 Tailwind의 기본 스타일을 불러옵니다.    
- 컴파일러는 postcss가 해준다. (필요없는 css 제거 등등 최적화도!)  

- 예를들어 
  - utilities: Tailwind의 모든 유틸리티 클래스(mt-4, bg-blue-500 등)
  - base: Tailwind의 기본 리셋/노멀라이즈/타이포그래피 등
  - components: Tailwind가 제공하는(거의 없음) 기본 컴포넌트 스타일

- 그리고 아래 처럼 선언하여 확장도 가능하다.  
  @layer base { ... }
  @layer components { ... }
  @layer utilities { ... }

- 순서는 매우 중요하다.  
  - base: HTML 태그에 적용되는 기본 스타일(Reset, Normalize 등)이 가장 먼저 적용되어야 함  
  - components: 재사용 컴포넌트 스타일이 base 위에 덮어씌워짐  
  - utilities: 가장 마지막에 적용되어, base와 components 스타일을 쉽게 덮어쓸 수 있음  
  - *하지만 CSS 적용 순서는 프레임워크가 알아서 해준다.!! 

```