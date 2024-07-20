---
sidebar_position: 7
---

# 정규 표현식   

연습사이트 : https://regex101.com/  

- [정규 표현식](#정규-표현식)
- [1.패턴과 플래그](#1패턴과-플래그)
    - [플래그](#플래그)
    - [str.match로 검색하기](#strmatch로-검색하기)
    - [str.replace로 치환하기](#strreplace로-치환하기)
    - [regexp.test로 일치 여부 확인하기](#regexptest로-일치-여부-확인하기)
- [2.문자 클래스](#2문자-클래스)
    - [문자클래스](#문자클래스)
    - [반대 클래스](#반대-클래스)
    - [점은 '아무 문자’에나 일치](#점은-아무-문자에나-일치)
    - [‘s’ 플래그와 점을 사용해 정말로 모든 문자 찾기](#s-플래그와-점을-사용해-정말로-모든-문자-찾기)

정규식을 이용하면 특정 문자열 패턴과 일치하는지 알 수 있다. 
- 글로벌 모드를 통해서 특정문자열과 일치하는 문자열들을 추출 할 수 있습니다.  
- 시작과 끝 엥커조건을 이용해서 문자열이 온전히 특정 패턴인지 알 수 있다.   

# 1.패턴과 플래그  

목적 : 문자 검색, 문자 교체, 문자 유효성 검사    
구성 : pattern + flag  

```js
// (동적) 패턴에 문자열 템플릿을 사용 가능.
regexp = new RegExp("pattern", "flags");
// (정적) 아래 문법에서는, 정적인 패턴만 가능하다.  
regexp = /pattern/; // 플래그가 없음
regexp = /pattern/gmi; // 플래그 g, m, i가
```

### 플래그

**i**  
- i 플래그가 붙으면 대·소문자 구분 없이 검색합니다. 따라서 A와 a에 차이가 없습니다(아래 예시 참조).    

**g**    
- g 플래그가 붙으면 패턴과 일치하는 모든 것들을 찾습니다. g 플래그가 없으면 패턴과 일치하는 첫 번째 결과만 반환됩니다.    

m  
- 다중 행 모드(multiline mode)를 활성화합니다. 자세한 내용은 앵커 ^와 $의 여러 행 모드, 'm' 플래그에서 다룰 예정입니다.  


s  
- .이 개행 문자 \n도 포함하도록 ‘dotall’ 모드를 활성화합니다. 자세한 내용은 문자 클래스에서 다룰 예정입니다.    

u  
- 유니코드 전체를 지원합니다. 이 플래그를 사용하면 서로게이트 쌍(surrogate pair)을 올바르게 처리할 수 있습니다. 자세한 내용은 유니코드: 'u' 플래그와 \p{...} 클래스에서 다룰 예정입니다.  

y  
- 문자 내 특정 위치에서 검색을 진행하는 ‘sticky’ 모드를 활성화 시킵니다. 자세한 내용은 Sticky flag "y", searching at position에서 다룰 예정입니다.

### str.match로 검색하기  

일치하는 문자열의 index를 찾을때 유용하게 사용된다.    
- g플래그를 이용해서 모두 선택할 것인지, 첫번째 요소만 고를것인지 가능.  
- 검색결과 없다면 null   

```js
let str = "We will, we will rock you";
str.match(/we/gi) // We,we (패턴과 일치하는 부분 문자열 두 개를 담은 배열)

---
let str = "We will, we will rock you";
let result = str.match(/we/i); // 플래그 g 없음
alert( result[0] );     // We (패턴에 일치하는 첫 번째 부분 문자열)
alert( result.length ); // 1
alert( result.index );  // 0 (부분 문자열의 위치)
alert( result.input );  // We will, we will rock you (원본 문자열)


```

### str.replace로 치환하기

```js
// 플래그 g 없음
alert( "We will, we will".replace(/we/i, "I") ); // I will, we will
- 대소문자 구분없으니 첫번째 We선택되며, g플래그가 없으니 이는 I로 변경되고 끝.
// 플래그 g 있음
alert( "We will, we will".replace(/we/ig, "I") ); // I will, I will

//$&를 사용한 예시를 살펴봅시다.
alert( "I love HTML".replace(/HTML/, "$& and JavaScript") ); // I love HTML and JavaScript

```

### regexp.test로 일치 여부 확인하기

```js
let str = "I love JavaScript";
let regexp = /LOVE/i;

alert( regexp.test(str) ); // true

```


# 2.문자 클래스  

자주 사용하는 문자 클래스에는 다음 클래스가 있습니다.  

### 문자클래스  

- \d ('digit(숫자)'의 ‘d’) : 숫자: 0에서 9 사이의 문자  
- \s ('space(공백)'의 ‘s’) : 스페이스, 탭(\t), 줄 바꿈(\n)을 비롯하여 아주 드물게 쓰이는 \v, \f, \r 을 포함하는 공백 기호  
- \w ('word(단어)'의 ‘w’) : ‘단어에 들어가는’ 문자로 라틴 문자나 숫자, 밑줄 _을 포함합니다. 키릴 문자나 힌디 문자같은 비 라틴 문자는 \w에 포함되지 않습니다.  


```js
let str = "+7(903)-123-45-67";
let regexp = /\d/;
alert( str.match(regexp) ); // 7
---
let str = "+7(903)-123-45-67";
let regexp = /\d/g;
alert( str.match(regexp) ); // 일치하는 문자의 배열: 7,9,0,3,1,2,3,4,5,6,7
// 이 배열로 숫자만 있는 전화번호를 만듭시다.
alert( str.match(regexp).join('') ); // 79035419441
---
let str = "Is there CSS4?";
let regexp = /CSS\d/;

alert( str.match(regexp) ); // CSS4
---
alert( "I love HTML5!".match(/\s\w\w\w\w\d/) ); // ' HTML5'


```

### 반대 클래스  

'반대’란 다음 예시들처럼 해당 문자를 제외한 모든 문자에 일치한다는 뜻입니다.  

- \D 숫자가 아닌 문자: \d와 일치하지 않는 일반 글자 등의 모든 문자  
- \S 공백이 아닌 문자: \s와 일치하지 않는 일반 글자 등의 모든 문자  
- \W 단어에 들어가지 않는 문자: \w와 일치하지 않는 비 라틴 문자나 공백 등의 모든 문자   

```js
let str = "+7(903)-123-45-67";
alert( str.match(/\d/g).join('') ); // 79031234567
--- 
let str = "+7(903)-123-45-67";
alert( str.replace(/\D/g, "") ); // 79031234567
```


### 점은 '아무 문자’에나 일치
- 기본적으로는 점은 줄 바꿈 문자 \n와는 일치하지 않습니다.

```js
alert( "Z".match(/./) ); // Z
let regexp = /CS.4/;
alert( "CSS4".match(regexp) ); // CSS4
alert( "CS-4".match(regexp) ); // CS-4
alert( "CS 4".match(regexp) ); // CS 4 (공백도 문자예요.)
alert( "CS4".match(/CS.4/) ); // null, 점과 일치하는 문자가 없기 때문에 일치 결과가 없습니다.
```  

### ‘s’ 플래그와 점을 사용해 정말로 모든 문자 찾기

```js
alert( "A\nB".match(/A.B/) ); // null (일치하지 않음)
alert( "A\nB".match(/A.B/s) ); // A\nB (일치!)
//어느 브라우저에서나 쓸 수 있는 대안
alert( "A\nB".match(/A[\s\S]B/) ); // A\nB (일치!)
alert( "1 - 5".match(/\d-\d/) ); // null, 일치 결과 없음!
alert( "1 - 5".match(/\d - \d/) ); // 1 - 5, 이제 제대로 되네요.
// \s 클래스를 사용해도 됩니다.
alert( "1 - 5".match(/\d\s-\s\d/) ); // 1 - 5, 이것도 됩니다.

```

```
문자 클래스에는 다음 클래스들이 있습니다.
\d – 숫자
\D – 숫자가 아닌 문자
\s – 스페이스, 탭, 줄 바꿈 문자
\S – \s를 제외한 모든 문자
\w – 라틴 문자, 숫자, 밑줄 '_'
\W – \w를 제외한 모든 문자
. – 정규 표현식 's' 플래그가 있으면 모든 문자, 없으면 줄 바꿈 \n을 제외한 모든 문자
```