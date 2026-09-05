---
sidebar_position: 6
---

# Git Worktree 사용법

## Worktree란?

Git Worktree는 하나의 Git 저장소에 여러 작업 디렉터리를 연결하여, 서로 다른 브랜치를 동시에 체크아웃할 수 있게 하는 기능이다.

일반적인 저장소에서는 브랜치를 바꾸려면 현재 작업 디렉터리에서 `git switch`를 실행해야 한다. Worktree를 사용하면 기존 작업을 그대로 둔 채 다른 디렉터리에서 기능 개발, 긴급 수정, 코드 리뷰를 병렬로 진행할 수 있다.

```text
reason-ball/              # main worktree: main 브랜치
../reason-ball-feature/   # linked worktree: feature/chat 브랜치
../reason-ball-hotfix/    # linked worktree: hotfix/login 브랜치
```

세 디렉터리는 Working Tree와 `HEAD`, Index를 각각 가지지만, Commit 객체와 Branch, Tag 같은 저장소 데이터는 공유한다. 한 Worktree에서 만든 Commit은 다른 Worktree에서도 즉시 조회할 수 있다.

## 언제 사용하면 좋은가?

### 진행 중인 작업을 유지하면서 긴급 수정할 때

현재 브랜치에 커밋하지 않은 변경이 많아도 별도의 Worktree를 만들면 Stash나 강제 브랜치 전환 없이 Hotfix를 시작할 수 있다.

### 여러 기능을 병렬로 개발할 때

기능별 Worktree에 서로 다른 브랜치를 체크아웃하면 각 작업 디렉터리의 변경 파일과 빌드 결과가 섞이지 않는다. 여러 Agent나 개발자가 같은 로컬 저장소에서 독립적인 작업 공간을 사용할 때도 유용하다.

### 다른 브랜치를 실행하거나 비교할 때

현재 개발 서버를 유지하면서 Release 브랜치나 PR 브랜치를 별도 디렉터리에서 실행할 수 있다. 단순 검토라면 Branch를 만들지 않고 Detached HEAD Worktree를 사용할 수도 있다.

### Worktree보다 Clone이 적합한 경우

Worktree는 Git 저장소 데이터를 공유하므로 완전히 격리된 저장소가 필요한 상황에는 맞지 않는다.

- 서로 다른 Git 설정과 Remote 구성이 필요한 경우
- 저장소 자체를 삭제하거나 손상시킬 수 있는 실험을 하는 경우
- 다른 장비나 Container처럼 물리적으로 분리된 환경이 필요한 경우

## Main Worktree와 Linked Worktree

`git clone` 또는 `git init`으로 처음 만든 작업 디렉터리를 Main Worktree라고 한다. `git worktree add`로 추가한 디렉터리는 Linked Worktree라고 한다.

```bash
git worktree list
```

출력 예시는 다음과 같다.

```text
/workspace/reason-ball          a1b2c3d [main]
/workspace/reason-ball-chat     d4e5f6a [feature/chat]
/workspace/reason-ball-review   1234abc (detached HEAD)
```

각 행에는 Worktree 경로, 현재 Commit, 체크아웃한 Branch 또는 Detached HEAD 상태가 표시된다.

## 새 브랜치로 Worktree 추가하기

저장소 바깥의 형제 디렉터리를 Worktree 경로로 사용하는 것이 구조를 구분하기 쉽다.

```bash
cd /workspace/reason-ball
git fetch origin
git worktree add -b feature/chat ../reason-ball-chat main
```

명령의 의미는 다음과 같다.

- `-b feature/chat`: `feature/chat` Branch를 새로 만든다.
- `../reason-ball-chat`: 새 Working Tree를 만들 경로이다.
- `main`: 새 Branch가 시작할 기준 Commit 또는 Branch이다.

생성한 Worktree로 이동하면 바로 새 Branch에서 작업할 수 있다.

```bash
cd ../reason-ball-chat
git status --short --branch
```

## 기존 브랜치로 Worktree 추가하기

이미 존재하는 로컬 Branch는 Branch 이름을 마지막 인자로 전달한다.

```bash
git worktree add ../reason-ball-hotfix hotfix/login
```

하나의 Branch는 기본적으로 하나의 Worktree에서만 체크아웃할 수 있다. 이미 다른 Worktree에서 사용 중인 Branch를 다시 연결하면 Git이 작업을 거부한다. 같은 Branch를 두 디렉터리에서 동시에 수정하면 Index와 Working Tree의 관계가 혼란스러워질 수 있기 때문에 제공되는 보호 장치다.

Remote Branch를 새 로컬 Branch로 추적하려면 다음과 같이 작성할 수 있다.

```bash
git fetch origin
git worktree add \
  --track \
  -b fix/login \
  ../reason-ball-fix-login \
  origin/fix/login
```

## 임시 검토용 Detached Worktree 만들기

Branch를 만들지 않고 특정 Commit이나 Remote Branch를 확인하려면 `--detach`를 사용한다.

```bash
git fetch origin
git worktree add --detach ../reason-ball-review origin/main
```

이 방식은 빌드 검증, 이전 Commit 재현, 코드 리뷰에 적합하다. Detached HEAD에서 Commit을 만들면 Branch가 가리키지 않을 수 있으므로, 변경을 보존해야 한다면 먼저 Branch를 만든다.

```bash
cd ../reason-ball-review
git switch -c review/fix
```

## Worktree에서 작업하고 반영하기

Linked Worktree도 일반 저장소와 동일하게 Commit하고 Push할 수 있다.

```bash
cd ../reason-ball-chat
git status
git add src/chat
git commit -m "Add chat feature"
git push -u origin feature/chat
```

Commit, Branch, Tag는 저장소 전체에서 공유된다. 따라서 Main Worktree에서 다음 명령을 실행해도 방금 생성한 Commit과 Branch를 확인할 수 있다.

```bash
cd ../reason-ball
git log --oneline feature/chat -5
```

Working Tree와 Index는 서로 분리되므로 한 Worktree의 수정 파일이 다른 Worktree의 `git status`에 나타나지는 않는다.

## Worktree 제거하기

작업이 끝나면 먼저 변경 상태와 Push 여부를 확인한다.

```bash
git -C ../reason-ball-chat status --short --branch
git -C ../reason-ball-chat log --oneline origin/feature/chat..HEAD
```

보존해야 할 변경과 Push하지 않은 Commit이 없다면 Main Worktree 또는 다른 Worktree에서 제거한다.

```bash
git worktree remove ../reason-ball-chat
```

`git worktree remove`는 Linked Worktree 디렉터리와 연결 정보를 제거하지만 Branch 자체는 삭제하지 않는다. Merge가 끝난 Branch까지 정리하려면 별도로 삭제한다.

```bash
git branch -d feature/chat
```

수정 파일이나 추적되지 않은 파일이 있는 Worktree는 기본적으로 제거되지 않는다. `--force`로 제거할 수 있지만 복구하기 어려운 파일을 잃을 수 있으므로, 상태 확인과 백업 없이 사용하지 않는다.

## 삭제되거나 이동한 Worktree 정리하기

Worktree 디렉터리를 Git 명령 없이 직접 삭제하면 저장소에 연결 정보가 남을 수 있다. 먼저 제거 대상을 미리 확인한다.

```bash
git worktree prune --dry-run --verbose
```

출력 내용을 확인한 다음 더 이상 존재하지 않는 Worktree의 관리 정보만 정리한다.

```bash
git worktree prune --verbose
```

Worktree를 수동으로 이동하여 연결이 깨졌다면 `prune`으로 지우기 전에 연결 복구를 시도한다.

```bash
git worktree repair /new/path/reason-ball-chat
```

가능하면 디렉터리를 직접 이동하는 대신 다음 명령을 사용한다.

```bash
git worktree move ../reason-ball-chat ../worktrees/reason-ball-chat
```

단, Submodule을 포함한 Linked Worktree에는 `git worktree move` 제한이 있을 수 있으므로 현재 Git 버전의 공식 문서를 확인한다.

## 오래 유지할 Worktree 잠그기

외장 디스크나 Network Share처럼 일시적으로 연결이 끊길 수 있는 경로의 Worktree는 누락된 것으로 판단되어 정리될 수 있다. 이런 Worktree는 이유와 함께 잠글 수 있다.

```bash
git worktree lock \
  --reason "외장 디스크의 장기 지원 브랜치" \
  ../reason-ball-lts
```

다시 이동하거나 제거하려면 잠금을 해제한다.

```bash
git worktree unlock ../reason-ball-lts
```

## Worktree, Clone, Submodule 비교

| 구분 | Worktree | Clone | Submodule |
| --- | --- | --- | --- |
| 목적 | 같은 저장소의 Branch를 병렬 작업 | 저장소를 완전히 별도로 복제 | 다른 저장소의 특정 Commit 포함 |
| Git 객체 | 공유 | 별도 보관 | 부모와 자식이 각각 보관 |
| Working Tree | Worktree마다 분리 | Clone마다 분리 | 부모 안에 자식 저장소 배치 |
| Remote | 기본적으로 공유 | Clone마다 설정 | 부모와 자식이 각각 설정 |
| 대표 사용 사례 | Feature, Hotfix, PR 동시 작업 | 완전 격리 실험 | 독립 프로젝트 버전 고정 |

Worktree와 Submodule은 모두 여러 작업 디렉터리가 보일 수 있지만 목적이 다르다.

- Worktree: **하나의 저장소에서 여러 Branch를 동시에 작업**한다.
- Submodule: **부모 저장소가 다른 저장소의 특정 Commit을 참조**한다.

## Node.js 프로젝트에서 주의할 점

Worktree마다 Working Tree가 분리되므로 Git이 추적하지 않는 파일은 자동으로 공유되지 않는다.

- `node_modules`는 Worktree별로 설치하는 것이 기본이다.
- `.env`처럼 Git에서 제외한 파일은 필요한 값을 별도로 준비해야 한다.
- `.next`, `dist`, `build` 같은 Build 결과도 Worktree별로 생성된다.
- 같은 Port를 사용하는 개발 서버를 동시에 실행하면 충돌하므로 Port를 다르게 지정한다.

```bash
cd ../reason-ball-chat
pnpm install
pnpm dev -- --port 3001
```

의존성 디렉터리를 Symlink로 공유하면 디스크 사용량을 줄일 수 있지만, Branch별 의존성 버전이 다를 때 예측하기 어려운 오류가 생길 수 있다. Package Manager의 전역 Store 기능을 활용하고 `node_modules` 자체는 분리하는 편이 안전하다.

## 자주 사용하는 명령어

```bash
# 연결된 Worktree 확인
git worktree list

# 상세 상태 확인
git worktree list --verbose

# 새 Branch와 Worktree 생성
git worktree add -b feature/chat ../reason-ball-chat main

# 기존 Branch를 Worktree에 연결
git worktree add ../reason-ball-hotfix hotfix/login

# 임시 Detached Worktree 생성
git worktree add --detach ../reason-ball-review origin/main

# 깨끗한 Linked Worktree 제거
git worktree remove ../reason-ball-chat

# 사라진 Worktree의 관리 정보 확인 및 정리
git worktree prune --dry-run --verbose
git worktree prune --verbose

# 이동으로 깨진 연결 복구
git worktree repair /new/path/reason-ball-chat
```

## 안전한 작업 순서

```text
현재 Worktree와 Branch 확인
  → 기준 Branch 최신화
  → 새 Branch와 Linked Worktree 생성
  → Linked Worktree에서 작업·검증·Commit·Push
  → Merge 여부와 남은 변경 확인
  → git worktree remove로 제거
  → 필요하면 Merge된 Branch 삭제
```

Worktree를 단순 복제 디렉터리로 생각하지 않고 Git이 관리하는 연결된 작업 공간으로 다루는 것이 핵심이다. 생성은 `git worktree add`, 제거는 파일 시스템 삭제가 아닌 `git worktree remove`를 사용하는 습관이 중요하다.

## Ref

- [Git 공식 문서: git-worktree](https://git-scm.com/docs/git-worktree.html)
