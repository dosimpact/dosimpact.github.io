---
sidebar_position: 1
---

# 로그인에 사용하는 OAuth

[NHN FORWARD 22]  : 과거, 현재 그리고 미래

## 인증(Authentication), 인가(Authorization)

인증(Authentication):  
- 인증은 사용자의 신원을 확인하는 과정입니다.  
- 이는 일반적으로 사용자 이름과 비밀번호를 통해 이루어지며, 때로는 이메일, 휴대폰 번호, 생체 인식 등 추가적인 정보를 요구하기도 합니다.  
- 인증 과정을 통해 시스템은 사용자가 자신이 주장하는 사람인지를 확인합니다.  

인가(Authorization): 
- 인가는 이미 인증된 사용자가 시스템의 특정 리소스에 접근하거나 특정 작업을 수행할 권한이 있는지를 결정하는 과정입니다.   
- 예를 들어, 어떤 사용자는 파일을 읽을 권한이 있지만, 다른 사용자는 파일을 읽고 쓸 권한이 있을 수 있습니다.  
- 인가 과정을 통해 시스템은 사용자의 권한을 관리하고 제어합니다.  

## OAuth  

대표적인 적용 사례가 SNS 로그인 이다.  
- SNS 사진 에디터도 있다.  

## OAuth 1.0  

Resource Owner : 사용자
OAuth Client : application  
OAuth Server : 인증, 인가 담당   

OAuth 1.0 문제점  
- scope 개념 없음  
- 토큰 유효기간 문제  
- client 구현 복잡성  

## OAuth 2.0   

Scope 개념 추가  
- 해당 토큰에 대해서 접근 범위(인가) 설정했다.  

Client 복잡성 간소화  
- OAuth 1.0 은 암호화에 복잡한 과정을 거친다. 이러한 단점을 보완 하기 위해   
- OAuth 2.0 에서는 Bearer Token + TLS 도입  
- Bearer Token : 장치를 고려하지 않고 토큰을 소유하고 있는것만으로도 사용 권한을 인정해준다.  
- TLS : https 강제 한다.  

Authorization/Resource Server의 분리(선택적)  
- OAuth 1.0 = Resource Owner 인증 + 인가 토큰 발급 + 보호된 리소스 관리  
- 리소스 관리서버를 분리하자.!  
- OAuth 2.0 = Authz Server (Resource Owner 인증 + 인가 토큰 발급) + Resource Server (보호된 리소스 관리)  

토큰 탈취 문제 개선  
- oauth1.0 에서는 토큰 사용 기간이 매우 길었다. 토큰을 탈취당했을때 오랜 기간 권한이 누출  
- 그래서 Refresh Token 을 도입하게 된다. access token(유효기간 짧음) + refresh token(새로운 AccessToken 발급용)  

제한적인 사용 환경 개선  
- grant 타입 flow가 추가 되었다.  

## ref  
https://www.youtube.com/watch?v=DQFv0AxTEgM&t=573s  
