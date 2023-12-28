---
sidebar_position: 3
---

# 홈서버 (MacMini) 운용 방법 2

<head>
  <meta name="keywords" content="Mac Server, 맥미니 서버, 운용"/>
</head>

## 맥미니 기본 셋업 방법

---

<br/>

### 1. brew 설치

공식 홈페이지를 참고해서 설치하자 - https://brew.sh/ 

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

<br/>

### 2. OS Update

맥OS의 업데이트를 체크하자.!

<br/>

### 3. 맥미니 비번없이 바로 부팅 셋업

맥미니를 종종 껐다가 켜야하는 상황이 발생한다. 그러나 맥미니 서버에 모니터를 계속 달아줄수는 없다. 
- 그러기에 비밀번호 없이 부팅이 가능하도록 초기 셋팅이 필요하다.    
- 설정에서 자동으로 user(계정) 로그인 켜기  
- [how-to-turn-off-password-on-mac](https://www.fonedog.com/ko/powermymac/how-to-turn-off-password-on-mac.html)


<br/>

### 4. [필수셋팅] OS X Server: 잠자기 모드를 차단하는 방법

```
명령어를 입력하면 커버를 닫아도 잠자기 모드가 활성화 되지 않는다.
sudo pmset -c disablesleep 1  

다시 잠자기 모드를 활성화 하려면    명령어를 입력하면 된다.
sudo pmset -c disablesleep 0
```

[잠자기 모드를 차단하는 방법](https://support.apple.com/ko-kr/HT200106)

<br/>

### 5. CodeServer install

brew install 및 brew services로 설치하자.

```
brew install code-server
brew services start code-server 
```
<br/>

### 6. Docker install 

```
brew update
brew upgrade
brew search docker
brew install --cask docker
brew install docker-compose
```
<br/>

### 7. Nginx install 

```
brew search nginx
brew install nginx
```

[ref](https://codewagon.tistory.com/2)
