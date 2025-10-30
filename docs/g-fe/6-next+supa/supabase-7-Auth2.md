---
sidebar_position: 7
---

# Supabase Auth DeepDive

참고  
[[10분 테코톡] 홍실의 OAuth 2.0](https://www.youtube.com/watch?v=Mh3LaHmA21I&t=481s)  
[[NHN FORWARD 22] 로그인에 사용하는 OAuth : 과거, 현재 그리고 미래](https://www.youtube.com/watch?v=DQFv0AxTEgM&t=991s)  
[OAuth 2.1의 PKCE 를 통해 AuthorizationCode 방식 개선하기](https://medium.com/@itsinil/oauth-2-1-pkce-%EB%B0%A9%EC%8B%9D-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-14500950cdbf)  

## OAuth 2.0  


인증(Authentication)
- 사용자가 자신이 주장하는 신원을 증명하는 것입니다.  
- 사용자가 자신의 ID와 비밀번호를 입력하면, 시스템은 이를 확인하고 사용자가 누구인지를 인증합니다.

인가(Authorization)
- 인증된 사용자가 특정 자원에 접근할 수 있는 권한이 있는지를 결정하는 것입니다.
- 사용자가 특정 페이지에 접근할 수 있는 권한이 있는지를 확인합니다.  

1.유저가 직접 인증을 수행한다.   
2.권한은 client app이 받는다. (supabase > GoTrue)    


![Alt text](image-9.png)


## OAuth 2.1  

- PKCE  

## PKCE  


#### Implicit flow  

Implicit flow는 OAuth 2.0의 스펙이다.  
- 클라이언트 측에서만 이루어지며, 
- 사용자가 인증을 마치면 액세스 토큰이 URL 프래그먼트에 포함되어 반환
- 이 방법은 간단하고 구현하기 쉽지만, 보안상의 이유로 권장되지 않습니다.

#### PKCE flow

PKCE는 코드 교환용 증명 키(Proof Key for Code Exchange)  

OAuth 2.1의 스펙이다.  
- PKCE flow는 서버 측에서 이루어지며   
- 클라이언트가 인증 코드를 받은 후 서버에 전송하여 액세스 및 리프레시 토큰을 받습니다.   
- 이 방법은 implicit flow보다 보안성이 높으며, 
- 공격자가 액세스 토큰을 탈취하는 것을 방지할 수 있습니다.

애플리케이션과 인증 서버 간에 새로 고침 및 액세스 토큰을 안전하게 교환할 수 있게 해주는 OAuth 프로토콜의 확장   
- 동일 컴퓨터의 다른 애플리케이션과 같은 제3자가 새로 고침 및 액세스 토큰 교환을 가로챌 수 있는 상황에서 사용  
- 모바일 장치에 특히 유용, 단일 페이지 앱에서도 악용될 수 있습니다.   
- PKCE를 사용하면 애플리케이션은 인증 요청을 시작한 동일한 애플리케이션에서만 인증 코드를 토큰으로 교환할 수 있도록 보장할 수 있습니다. 
- 이는 사용자 데이터에 대한 무단 액세스를 방지하는 데 도움이 됩니다.  

ref : https://supabase.com/docs/guides/auth/auth-deep-dive/auth-deep-dive-jwts  


## Part One: JWTs


왜 갑자기 JWT가 인기를 끌고 있는지 궁금하실 수도 있습니다. 답은 마이크로서비스 아키텍처가 대량으로 채택되면서 여러 개의 서로 다른 마이크로서비스(API, 웹사이트, 서버 등)가 사용자가 자신이 말하는 사용자, 즉 '로그인한' 사용자인지 쉽게 검증하고자 하는 상황에 처했기 때문입니다. 기존의 세션 토큰은 각 마이크로서비스가 현재 유효한 세션 토큰의 기록을 유지하거나 사용자가 리소스에 액세스하려고 할 때마다 중앙 데이터베이스를 쿼리하여 세션 토큰의 유효성을 확인해야 하므로 매우 비효율적이므로 이 경우 사용할 수 없습니다. 이러한 의미에서 JWT 기반 인증은 중앙 데이터베이스에 액세스할 필요 없이 jwt_secret을 가진 사람이라면 누구나 토큰을 확인할 수 있으므로 탈중앙화되어 있습니다.

참고: JWT의 한 가지 단점은 세션 토큰처럼 쉽게 취소할 수 없다는 것입니다. JWT가 악의적인 행위자에게 유출된 경우, 시스템 소유자가 업데이트하지 않는 한 jwt_secret(물론 모든 사람의 기존 토큰이 무효화됨) 만료 날짜가 될 때까지 어디에서나 JWT를 사용할 수 있습니다 .


Supabase에서는 세 가지 목적으로 JWT를 발행합니다:

anon key : 이 키는 Supabase API 게이트웨이를 우회하는 데 사용되며 클라이언트 측 코드에서 사용할 수 있습니다.  
service role key : 이 키는 슈퍼 관리자 권한이 있으며 행 수준 보안을 우회할 수 있습니다. 클라이언트 측 코드에 넣지 마세요. 비공개로 유지하세요.   
user specific jwts: 프로젝트/서비스/웹사이트에 로그인하는 사용자에게 발급하는 토큰입니다.  
- 세션 토큰에 해당하는 최신 토큰으로, 사용자가 특정 콘텐츠나 권한에 액세스하는 데 사용할 수 있습니다.  

### anon key  
```
curl 'https://xscduanzzfseqszwzhcy.supabase.co/rest/v1/colors?select=name' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNDIwNTE3NCwiZXhwIjoxOTI5NzgxMTc0fQ.-NBR1WnZyQGpRLdXJfgfpszoZ0EeE6KHatJsDPLIX8c"
```
- JWT token 이다.  
- https://jwt.io/ 에서 확인해 보자.  
- RLS 덕분에 anon key는 공개된 사용자에게 노출되도 괜찮다.  

```
{
  "role": "anon",
  "iss": "supabase",
  "iat": 1614205174,
  "exp": 1929781174
}
```
### service role key

두 번째 키인 서비스 역할 키는 자신의 서버 또는 환경 중 하나에서만 사용해야 하며 최종 사용자와 공유해서는 안 됩니다. 
이 토큰을 사용하여 데이터를 일괄 삽입하는 등의 작업을 수행할 수 있습니다.


### user access token  

- 사용자 액세스 토큰은 예를 들어 호출할 때 발급되는 JWT  
- Authorization Bearer header 에 추가되어서 보내진다.  
```
supabase.auth.signIn({
  email: 'lao.gimmie@gov.sg',
  password: 'They_Live_1988!',
})

curl 'https://xscduanzzfseqszwzhcy.supabase.co/rest/v1/colors?select=name' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNDIwNTE3NCwiZXhwIjoxOTI5NzgxMTc0fQ.-NBR1WnZyQGpRLdXJfgfpszoZ0EeE6KHatJsDPLIX8c" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjE1ODI0Mzg4LCJzdWIiOiIwMzM0NzQ0YS1mMmEyLTRhYmEtOGM4YS02ZTc0OGY2MmExNzIiLCJlbWFpbCI6InNvbWVvbmVAZW1haWwuY29tIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwifSwidXNlcl9tZXRhZGF0YSI6bnVsbCwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.I-_oSsJamtinGxniPETBf-ezAUwDW2sY9bJIThvdX9s"
```



## Part Two: Row Level Security

"내 익명 키가 클라이언트에 있으면 누군가 내 자바스크립트를 읽고 내 키를 훔칠 수 없나요?"라는 흥미로운 질문이 제기될 수 있지만, 대답은 '그렇다'입니다. 바로 이 점이 Postgres 정책이 필요한 이유입니다.

Postgres의 "행 수준 보안" 정책을 사용하면 기본적으로 익명 키가 액세스하도록 허용하거나 허용하지 않는 데이터에 대한 규칙을 설정할 수 있습니다.

예를 들어 익명 키는 특정 테이블에서 읽기만 가능하고 쓰기, 업데이트, 삭제는 불가능해야 한다고 말할 수 있습니다.

그리고 이러한 규칙은 원하는 만큼 복잡할 수 있습니다. 
예를 들어 익명 키는 목요일 오후 4시에서 6시 사이에 삽입된 행을 삭제할 수 있고, ID 열이 짝수인 행만 삭제할 수 있다고 말할 수 있습니다. 꽤 이상하지만 정책의 힘을 보여주는 예시입니다.

리더보드 테이블을 만든다고 가정해 보겠습니다.
웹사이트의 사용자들이 순위표를 읽을 수는 있지만 작성, 업데이트, 삭제는 할 수 없도록 하려고 합니다.
먼저 SQL로 테이블을 정의하고 더미 데이터를 추가합니다:

```
create table leaderboard (
  name text,
  score int
);
insert into leaderboard  (name, score) values  ('Paul', 100),('Leto', 50), ('Chani', 200);


이를 사용하여 테이블에서 자유롭게 읽고 쓸 수 있음을 알 수 있습니다:

// Writing
const { data, error } = await supabase.from('leaderboard').insert({ name: 'Bob', score: 99999 })

// Reading
const { data, error } = await supabase
  .from('leaderboard')
  .select('name, score')
  .order('score', { ascending: false })

```

이제 권한 부여에서 익명 키(JWT)를 보내는 모든 사용자에 대해 테이블을 읽을 수 있도록 정책을 추가해야 합니다: 무기명 헤더에 추가해야 합니다.
```
CREATE POLICY anon_read_leaderboard ON leaderboard
    FOR SELECT
    TO 'anon'
    USING (true);

```
여기서 anon_read_leaderboard는 정책에 대해 선택하는 이름일 뿐입니다. 
리더보드는 테이블 이름입니다. 
FOR SELECT는 이 정책이 읽기(또는 SQL에서 "선택")에 대해서만 적용되기를 원한다는 의미입니다.
TO는 이 정책이 익명 Postgres 역할에만 적용됨을 의미합니다. 그리고 마지막으로 규칙 자체는 'true'로, 익명 사용자에 대한 모든 선택을 허용한다는 의미입니다.
## Part Three: Policies


사용자 기반 행 수준 정책

이제 JWT 역할을 기반으로 테이블에 대한 액세스를 제한하는 방법을 알았으므로 
이를 사용자 관리와 결합하여 사용자가 데이터베이스에서 읽고 쓸 수 있는 데이터를 훨씬 더 효과적으로 제어할 수 있습니다.
먼저 Supabase에서 사용자 세션이 작동하는 방식부터 살펴보고 나중에 사용자 중심 정책 작성으로 넘어가겠습니다.


```
// see full api reference here: /docs/reference/javascript/auth-signup
supabase.auth.signUp({ email, password })
```

기본적으로 사용자에게 확인 이메일이 전송됩니다.  
- 사용자가 이메일의 링크를 클릭하면 사이트로 리디렉션됩니다(대시보드의 인증 > 설정에서 사이트 URL을 제공해야 합니다.). 
- 기본값은 http://localhost:3000)이며 쿼리 매개변수를 포함한 전체 URL은 다음과 같이 표시됩니다:  
- http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjE2NDI5MDY0LCJzdWIiOiI1YTQzNjVlNy03YzdkLTRlYWYtYThlZS05ZWM5NDMyOTE3Y2EiLCJlbWFpbCI6ImFudEBzdXBhYmFzZS5pbyIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIn0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.4IFzn4eymqUNYYo2AHLxNRL8m08G93Qcg3_fblGqDjo&expires_in=3600&refresh_token=RuioJv2eLV05lgH5AlJwTw&token_type=bearer&type=signup

```
// the base url - whatever you set in the Auth Settings in supabase.com/dashboard dashboard
http://localhost:3000/

// note we use the '#' (fragment) instead of '?' query param
// the access token is a JWT issued to the user
#access_token=

// valid for 60 minutes by default
&expires_in=3600

// use to get a new access_token before 60 minutes expires
&refresh_token=RuioJv2eLV05lgH5AlJwTw

// can use as the Authorization: Bearer header in requests to your API
&token_type=bearer

// why was this token issued? was it a signup, login, password reset, or magic link?
&type=signup
```

인증된 역할은 Supabase에서 특별하며, API에 인증된 사용자임을 알리고 요청된 리소스(테이블 또는 행)에 추가한 모든 정책과 JWT를 비교하도록 알립니다.

하위 클레임은 기본적으로 auth.users 테이블에 있는 사용자의 고유 식별자이므로 일반적으로 JWT를 데이터베이스의 행과 일치시키는 데 사용합니다(참고로, 인증 API가 올바르게 작동하려면 인증 스키마에 의존하므로 일반적으로 Supabase 데이터베이스에서 어떤 식으로든 인증 스키마를 변경하지 않는 것이 좋습니다).

