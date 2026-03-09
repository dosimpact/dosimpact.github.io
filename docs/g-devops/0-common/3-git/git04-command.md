---
sidebar_position: 4
---

# Github 명령어

## 나만의 명령어 만들기


```bash
# git latest : 최신 브랜치 (main) 체크아웃과 동시에 로컬 브랜치는 드랍
git config --global alias.latest '!git fetch origin && git checkout -B main origin/m
ain'
# 
git config --global alias.ac '!git add --all . && git commit -m'
# git ac "plan template gen"
```

