---
sidebar_position: 6
---

# Web Security  

- [Web Security](#web-security)
  - [1.Security Details in Your Code](#1security-details-in-your-code)
  - [2.Cross-Site Scripting Attacks(XSS)](#2cross-site-scripting-attacksxss)
    - [2.1 X-XSS-Protection 헤더가 권장되지 않나요?](#21-x-xss-protection-헤더가-권장되지-않나요)
    - [2.2 Content Security Policy(CSP)](#22-content-security-policycsp)
      - [1. HTTP 응답 헤더를 통한 설정](#1-http-응답-헤더를-통한-설정)
      - [2. `<meta>` 태그를 통한 설정](#2-meta-태그를-통한-설정)
      - [안전한 CSP 설정 팁](#안전한-csp-설정-팁)
    - [2.3 라이브러리 모듈 취약성](#23-라이브러리-모듈-취약성)
  - [3.Cross-Site Request Forgery (CSRF, XSRF)](#3cross-site-request-forgery-csrf-xsrf)
  - [4.Cross-Site Resource Sharing (CORS)](#4cross-site-resource-sharing-cors)


## 1.Security Details in Your Code  

JS코드는 누구나 읽을 수 있다. 심지어 소스코드이다.  
- 중요한 기밀데이터를 넣으면 안된다.  
- Google API Key는 특정 도메인만 허용하기 때문에 공개되어도 괜찮다. (보안매커니즘 중 하나)  

## 2.Cross-Site Scripting Attacks(XSS)   

XSS는 공격자가 악성 스크립트를 다른 사용자의 브라우저에서 실행하게 하는 보안 취약점입니다. 
- 주로 웹 애플리케이션이 사용자 입력을 적절히 검증하지 않고 그대로 HTML에 포함시킬 때 발생 한다.  

해커는 악의적인 코드가 담긴 JS 코드를 주입 및 실행시킨다.  
- 다른 사람들이 코드를 애플리케이션에 추가가 가능하다면 XSS 공격 위험에 노출 된다.  
- 예) URL Paramater에 넣은 정보를 innerHTML에 넣는 코드가 있다면, 보안허점이 될 수 있다.  
  - 누군가가 웹사이트 공유 링크에 악의적인 스크립트를 넣고, 뿌릴 수 있다.  
  - img태그의 onError 핸들러에 스크립트 넣기
- 사용자의 입력에 대해서 악의적인 스크립트가 있는지, senitize-html 등을 통해서 점검해야 한다.  


next.config.js 에서 이미지 도메인을 설정하는것도 XSS 방지에 도움이 된다. 

### 2.1 X-XSS-Protection 헤더가 권장되지 않나요?

- 오탐지 문제: 브라우저의 내장 XSS 필터는 종종 정상적인 코드나 콘텐츠를 잘못 인식하여 차단하는 경우가 존재. 
- 안전하지 않은 방어: XSS 방지를 위한 완벽한 해결책으로 간주되지 않으며, 
- 더 나은 대안: 현재는 CSP(Content Security Policy)와 같은 더 강력하고 관리 가능한 보안 메커니즘을 사용하여 XSS 공격을 방지하는 것이 권장됩니다.

### 2.2 Content Security Policy(CSP)

Content Security Policy(CSP) 웹 애플리케이션에서 XSS(Cross-Site Scripting) 및 데이터 도용과 같은 다양한 공격을 방지하기 위해 사용되는 강력한 보안 메커니즘입니다. 
- CSP를 올바르게 설정하면, 브라우저가 페이지에서 실행할 수 있는 콘텐츠의 출처를 제한
- 허용되지 않은 스크립트, 스타일, 이미지 등의 리소스가 로드되는 것을 방지.  

CSP 설정 방법
- CSP는 HTTP 응답 헤더 또는 `<meta>` 태그를 통해 설정할 수 있습니다. ( 주로 HTTP 응답 헤더로 설정하는 것이 일반적)

#### 1. HTTP 응답 헤더를 통한 설정

서버에서 HTTP 응답 헤더에 `Content-Security-Policy`를 추가합니다. 
- 이 헤더는 브라우저가 페이지 로드 시 적용할 CSP 규칙을 정의합니다.
- 예를 들어, 다음과 같이 설정할 수 있습니다:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:;

이 규칙들은 다음과 같은 의미를 갖습니다:
- **default-src 'self'**: 기본 소스는 자기 자신(동일 출처)에서만 로드할 수 있습니다.
- **script-src 'self' https://trusted.cdn.com**: 스크립트는 자기 자신과 `https://trusted.cdn.com`에서만 로드할 수 있습니다.
- **style-src 'self' 'unsafe-inline'**: 스타일은 자기 자신에서만 로드할 수 있지만, 인라인 스타일(`'unsafe-inline'`)도 허용됩니다.
- **img-src 'self' data:**: 이미지는 자기 자신과 `data:` URI 스키마에서만 로드할 수 있습니다.
```

#### 2. `<meta>` 태그를 통한 설정

HTML 문서의 `<head>` 섹션에 `<meta>` 태그를 사용하여 CSP를 설정할 수도 있습니다.   
이 방법은 주로 서버에서 HTTP 응답 헤더를 제어할 수 없는 경우 사용됩니다.  

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
```

CSP는 다양한 지시어(directive)를 통해 페이지 내의 리소스 로딩을 제어할 수 있습니다. 주요 지시어는 다음과 같습니다:

- **default-src**: 기본 콘텐츠의 출처를 지정합니다. 다른 지시어가 별도로 지정되지 않은 경우 이 규칙이 적용됩니다.
- **script-src**: 스크립트의 출처를 지정합니다.
- **style-src**: CSS 스타일시트의 출처를 지정합니다.
- **img-src**: 이미지 파일의 출처를 지정합니다.
- **font-src**: 웹 폰트의 출처를 지정합니다.
- **connect-src**: AJAX 요청, WebSocket 연결 등의 출처를 지정합니다.
- **media-src**: 오디오와 비디오의 출처를 지정합니다.
- **object-src**: 플래시와 같이 `<object>`, `<embed>`, `<applet>` 태그를 통해 로드되는 콘텐츠의 출처를 지정합니다.
- **frame-src**: `<frame>`, `<iframe>` 태그를 통해 로드되는 콘텐츠의 출처를 지정합니다.
- **report-uri**: 위반이 발생했을 때 보고서를 전송할 URI를 지정합니다.
- **report-to**: `report-uri` 대신 사용할 수 있는 최신 방법으로, 위반 보고서의 목적지 그룹을 지정합니다.

#### 안전한 CSP 설정 팁

1. **최소 권한 부여 원칙**: 가능한 한 적은 출처만 허용하도록 설정합니다. 불필요한 출처나 위험한 인라인 스크립트(`'unsafe-inline'`), 평가(`'unsafe-eval'`)를 허용하지 않도록 합니다.
   
2. **차단 대신 보고 모드 사용**: 새로운 CSP 설정을 적용하기 전에 `Content-Security-Policy-Report-Only` 헤더를 사용하여 위반 사항을 보고만 하도록 설정할 수 있습니다. 이를 통해 실제로 차단되기 전에 잠재적인 문제를 미리 발견할 수 있습니다.

   ```plaintext
   Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-violation-report-endpoint/;
   ```

3. **CSP 정책을 지속적으로 검토 및 개선**: 웹 애플리케이션이 업데이트될 때마다 CSP 정책도 이에 맞게 변경하고, 보고서에서 발생한 위반을 검토하여 CSP를 지속적으로 강화해야 합니다.

CSP 적용 사례
- 예를 들어, 특정 페이지에서 외부 스크립트와 스타일을 완전히 차단하고, 이미지와 폰트는 특정 CDN에서만 로드되도록 하려면 다음과 같이 설정할 수 있습니다:
```plaintext
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src https://cdn.example.com; font-src https://cdn.example.com;
```


### 2.3 라이브러리 모듈 취약성  
- npm install 이후로 나오는 취약성에 대해서 반드시 체크하자.  


## 3.Cross-Site Request Forgery (CSRF, XSRF)

- XSS 연관될 수 있지만, 반드시 그렇지 않다.    
- 사용자를 속여서 자격증명은 로컬 페이지의 쿠키를 이용하고, 해커가 준비한 페이지로 요청을 보내도록 하는것.  
- 그러면 사용자의 자격증명이 포함되어 페이지에 요청을 보내게 된다.  

CSRF 토큰 사용: 서버는 각 요청에 고유한 CSRF 토큰을 포함시키고, 이 토큰이 유효한 경우에만 요청을 처리합니다. 이는 양식 제출 시 일반적으로 사용됩니다.
SameSite 쿠키 속성 설정: 쿠키에 SameSite 속성을 설정하여, 동일한 사이트에서만 쿠키가 전송되도록 제한함으로써 CSRF 공격을 예방할 수 있습니다.
이중 제출 쿠키: 요청 본문에 CSRF 토큰을 포함시키고, 동일한 토큰을 쿠키로도 전송하여 일치 여부를 확인하는 방법입니다.

시나리오  
- fake.com 에서 b.com 로 CSRF을 하려고 한다.  

1.fake.com 에서 `withCredentials` 설정:
   - AJAX 요청에서 쿠키를 포함하려면 `XMLHttpRequest` 또는 `fetch` 요청 시 `withCredentials` 속성을 `true`로 설정해야 합니다.
2.b.com 서버의 CORS 설정:
  - `b.com` 서버가 CORS 헤더에서 `Access-Control-Allow-Origin`을 적절히 설정.  
  - cors("*")을 해버리는 경우.  
3.SameSite 쿠키 속성:
   - 쿠키가 `SameSite=None`으로 설정.   
   - `Secure` 속성도 함께 설정되어 있어야 합니다.(HTTPS).    

## 4.Cross-Site Resource Sharing (CORS)  

