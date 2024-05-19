---
sidebar_position: 5
---

# 맥북 초기 셋업  

- [맥북 초기 셋업](#맥북-초기-셋업)
  - [설정](#설정)
  - [brew](#brew)
  - [iterms](#iterms)
  - [Install VSCode](#install-vscode)
  - [JS Dev](#js-dev)
  - [중고 맥북 판매 - M1 Air](#중고-맥북-판매---m1-air)


## 설정  
- 터치 패드 - 두 손가락 터치 = 마우스 우클릭. 
- 터치 패드 - 슬라이드 자연스럽게 off 

## brew

```
# install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# command
(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> /Users/dodo/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## iterms

참고 > https://hbase.tistory.com/427

iterms2 를 설치 후 기본 쉘이 bash에서 zsh로 바뀌었다.  

## Install VSCode  

## JS Dev 

```
# node.js install 
brew install nvm

- 1) bash: command not found: nvm
- 2) zsh: command not found: nvm


2. **NVM 스크립트 추가**:
   - 만약 `.zshrc` 파일에 NVM을 로드하는 스크립트가 없다면, 다음 줄을 추가하여 NVM을 로드하도록 설정합니다:
     ```sh
     export NVM_DIR="$HOME/.nvm"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
     ```
   - 파일을 저장하고 닫은 후, Zsh 셸을 다시 시작하거나 `.zshrc` 파일을 다시 소스화하여 변경 사항을 적용합니다:
     ```
     source ~/.zshrc
     ```

```



## 중고 맥북 판매 - M1 Air


```
맥북 에어 중고 판매 ( 60만원 시작 -> 55만원 -> 50만원 ) 
- 배터리 사이클 : 163
- 성능 최대치 : 87%  
맥북 케이스 없음, 정품 충전기 없음 ( 30W 짜리 PD 충전기 하나 구매하시면 됩니다.! - 최저 1만원  )  
```