---
sidebar_position: 1
---

# 1. CSS init  

- [1. CSS init](#1-css-init)
	- [1.Reset css, Normalize css](#1reset-css-normalize-css)
	- [2.box-sizing : border-box](#2box-sizing--border-box)
	- [3.font](#3font)


## 1.Reset css, Normalize css  

1.Normalize CSS 
- 브라우저마다 다른 CSS를 동일하게 통일하며, 어느정도 기본 스타일링을 가져가는 경우  

2.Reset CSS
- 처음부터 CSS를 작성하는 경우.  


Reset Css
- ref:https://meyerweb.com/eric/tools/css/reset/  

```css
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
```

normalize css
Ref : https://necolas.github.io/normalize.css/8.0.1/normalize.css


## 2.box-sizing : border-box  

box-sizing의 디폴트값은 content이다.  
- 이는 width, height를 계산할때 margin, padding은 별도로 쌓는다.  
- 문제점 : 자식 요소가 width:100% + padding:20px 라면, 부모 너비를 무조건 40px 넘치게 된다.  
- 아래 index.css에 추가하자.  

```css
* { box-sizing: border-box; }
```


## 3.font    

https://github.com/orioncactus/pretendard   

1.폰트 다운로드 및 로컬에서 서빙하기 
  - web/variable/PretendardVariable.woff2 추출    
2.@import 를 이용해서 cdn 다운로드 
 - @import는 외부의 Css를 가져와서 합치는 기능이다. 
 - 아래 @import 후 css 파일을 보면  @font-face 설정이 있다. 이곳에서 어떤 font-family 이름으로 셋팅되는지 나온다.  


```css
/* css, from cdn */
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");

/* @font-face {
	font-family: 'Pretendard Variable';
	font-weight: 45 920;
	font-style: normal;
	font-display: swap;
	src: url('../../../packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
} */

* {
font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
}

```

```js
// next.js, from local font  
import localFont from 'next/font/local'

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
})
```

