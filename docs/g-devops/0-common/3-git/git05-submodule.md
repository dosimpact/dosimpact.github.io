---
sidebar_position: 5
---

# Git 서브모듈 사용법

## 서브모듈이란?

Git 서브모듈(Submodule)은 하나의 Git 저장소 안에 다른 Git 저장소를 포함하는 기능이다.

공통 라이브러리, 별도로 배포되는 모듈, 여러 프로젝트가 공유하는 설정처럼 독립적인 버전 관리가 필요한 저장소를 하나의 프로젝트에서 함께 사용할 때 유용하다.

서브모듈은 일반 디렉터리와 다르게 동작한다. 부모 저장소는 서브모듈 내부의 파일을 직접 관리하지 않고, 서브모듈 저장소의 **특정 커밋 해시**를 기록한다. 따라서 부모 저장소를 체크아웃하면 어떤 버전의 서브모듈을 사용해야 하는지 정확히 알 수 있다.

## 언제 사용하면 좋은가?

서브모듈은 부모 프로젝트와 별도의 변경 이력과 배포 주기를 유지하면서, 특정 커밋을 고정해서 사용해야 할 때 적합하다.

### 공통 코드를 여러 프로젝트에서 공유할 때

여러 프로젝트가 동일한 라이브러리, SDK, 설정 파일 등을 사용하지만 해당 코드를 별도의 저장소에서 관리해야 하는 경우에 사용할 수 있다.

```text
service-a ─┐
           ├─ shared-library 저장소 사용
service-b ─┘
```

각 서비스는 `shared-library`의 서로 다른 커밋을 참조할 수 있으므로, 공통 코드의 업데이트 시점을 프로젝트별로 결정할 수 있다.

### 독립적인 프로젝트를 하나의 작업 공간에 포함할 때

프론트엔드, 백엔드, 플러그인처럼 각각 독립적으로 개발되고 배포되는 저장소를 상위 프로젝트에서 함께 관리해야 할 때 유용하다. 각 저장소의 권한과 커밋 이력을 분리하면서도 필요한 버전 조합을 부모 저장소에 기록할 수 있다.

### 외부 프로젝트의 특정 버전을 고정할 때

외부 오픈 소스나 다른 팀의 저장소를 프로젝트 안에서 직접 참조하되, 원격 저장소의 최신 코드가 아니라 검증된 특정 커밋을 사용해야 하는 경우에 적합하다. 부모 저장소가 커밋 해시를 기록하므로 모든 개발자와 CI 환경에서 동일한 버전을 체크아웃할 수 있다.

### 저장소별 접근 권한을 분리해야 할 때

부모 저장소와 공통 모듈의 접근 권한이나 담당 팀이 다르면 각 저장소를 독립적으로 유지할 수 있다. 단, 부모 저장소를 클론하는 사용자와 CI 환경에도 서브모듈 저장소를 읽을 권한이 있어야 한다.

### 서브모듈이 적합하지 않을 수 있는 경우

서브모듈은 클론 후 초기화가 필요하고, 서브모듈과 부모 저장소에 각각 커밋해야 하므로 일반 디렉터리보다 관리 절차가 복잡하다. 다음과 같은 경우에는 다른 방식을 먼저 고려한다.

- 부모 프로젝트와 항상 함께 변경되는 코드: 별도 저장소로 분리하지 않고 모노레포로 관리
- 버전과 배포가 체계화된 라이브러리: npm, Maven, PyPI 같은 패키지 저장소를 통해 배포
- 외부 저장소의 코드를 가져온 뒤 부모 저장소에서 직접 수정해야 하는 경우: Git subtree 등 다른 방식 검토

즉, **독립적인 저장소를 유지해야 하고 부모 프로젝트가 사용할 정확한 커밋을 고정해야 하는 경우**에 서브모듈을 사용하는 것이 좋다.

## 용어 정리

예를 들어 다음과 같은 구조가 있다고 가정한다.

```text
parent-project/          # 부모 저장소
├── .gitmodules
├── src/
└── libs/
    └── shared-module/   # 서브모듈 저장소
```

### 부모 저장소

서브모듈을 포함하는 바깥쪽 Git 저장소이다. 위 예시에서는 `parent-project`가 부모 저장소이다.

부모 저장소는 서브모듈의 모든 파일을 저장하지 않는다. 대신 아래 정보를 관리한다.

- `.gitmodules`: 서브모듈의 경로와 원격 저장소 URL
- Git 인덱스: 현재 사용 중인 서브모듈의 커밋 해시

### 서브모듈 저장소

부모 저장소 안의 특정 경로에 연결된 별도의 Git 저장소이다. 위 예시에서는 `libs/shared-module`이 서브모듈 저장소이다.

서브모듈은 자체 커밋 이력, 브랜치, 원격 저장소를 가진다. 따라서 서브모듈에서 발생한 변경은 서브모듈 저장소에 별도로 커밋하고 푸시해야 한다.

### 부모 저장소가 서브모듈의 커밋 해시를 보는 원리

부모 저장소는 서브모듈 경로를 일반 디렉터리가 아닌 `gitlink`라는 특별한 항목으로 저장한다. 이 항목에는 부모 저장소가 참조하는 서브모듈의 커밋 해시가 들어 있다.

```bash
git ls-tree HEAD libs/shared-module
```

실행 결과는 다음과 비슷하다.

```text
160000 commit a1b2c3d4e5f6...    libs/shared-module
```

- `160000`: 해당 경로가 일반 파일이나 디렉터리가 아니라 서브모듈임을 나타낸다.
- `a1b2c3d4e5f6...`: 부모 저장소가 가리키는 서브모듈의 커밋 해시이다.

부모 저장소에서 서브모듈 경로가 변경된 것으로 표시되는 것은 서브모듈의 파일 하나하나가 바뀌었기 때문이 아니라, 부모 저장소가 참조하는 커밋 해시가 바뀌었기 때문이다.

## 서브모듈 추가 방법

부모 저장소의 루트 디렉터리에서 `git submodule add`를 실행한다.

```bash
cd parent-project
git submodule add https://github.com/example/shared-module.git libs/shared-module
```

명령을 실행하면 다음 두 가지 변경이 생긴다.

1. `.gitmodules` 파일에 서브모듈의 경로와 URL이 추가된다.
2. `libs/shared-module` 경로가 특정 커밋을 가리키는 서브모듈로 등록된다.

`.gitmodules` 파일은 다음과 같은 형태이다.

```ini
[submodule "libs/shared-module"]
  path = libs/shared-module
  url = https://github.com/example/shared-module.git
```

추가된 내용을 부모 저장소에 커밋하고 푸시한다.

```bash
git status
git add .gitmodules libs/shared-module
git commit -m "chore: add shared module"
git push origin main
```

## 서브모듈과 함께 클론하는 방법

### 처음부터 함께 클론하기

`--recurse-submodules` 옵션을 사용하면 부모 저장소를 클론한 뒤, 부모 저장소가 기록한 커밋에 맞춰 서브모듈도 함께 가져온다.

```bash
git clone --recurse-submodules https://github.com/example/parent-project.git
```

### 부모 저장소만 먼저 클론한 경우

이미 부모 저장소를 클론했다면 다음 명령으로 서브모듈을 초기화하고 파일을 가져올 수 있다.

```bash
cd parent-project
git submodule update --init --recursive
```

- `--init`: `.gitmodules` 정보를 바탕으로 아직 초기화하지 않은 서브모듈을 등록한다.
- `--recursive`: 서브모듈 안에 또 다른 서브모듈이 있을 때 함께 처리한다.

부모 저장소의 변경을 가져온 뒤 서브모듈도 기록된 커밋에 맞추려면 다음과 같이 실행한다.

```bash
git pull
git submodule update --init --recursive
```

또는 한 번에 실행할 수 있다.

```bash
git pull --recurse-submodules
```

## 서브모듈 변경 시 Git 커밋 프로세스

서브모듈의 코드를 수정할 때는 **서브모듈 저장소를 먼저 커밋하고 푸시한 다음, 부모 저장소에서 변경된 커밋 해시를 커밋**해야 한다.

### 1. 서브모듈에서 브랜치 확인

서브모듈은 부모 저장소가 지정한 커밋으로 체크아웃되면서 `detached HEAD` 상태일 수 있다. 변경 작업 전 사용할 브랜치로 이동한다.

```bash
cd libs/shared-module
git switch main
git pull origin main
```

### 2. 서브모듈 변경 사항 커밋 및 푸시

```bash
git status
git add .
git commit -m "feat: update shared module"
git push origin main
```

### 3. 부모 저장소에서 서브모듈 커밋 해시 갱신

부모 저장소로 이동하면 서브모듈 경로가 변경된 것으로 표시된다.

```bash
cd ../..
git status
git diff --submodule
```

변경된 서브모듈 참조를 부모 저장소에 커밋하고 푸시한다.

```bash
git add libs/shared-module
git commit -m "chore: update shared module reference"
git push origin main
```

전체 순서는 다음과 같다.

```text
서브모듈 수정
  → 서브모듈 저장소에 커밋
  → 서브모듈 저장소에 푸시
  → 부모 저장소에서 변경된 서브모듈 커밋 해시를 커밋
  → 부모 저장소에 푸시
```

서브모듈 커밋을 원격 저장소에 푸시하지 않고 부모 저장소의 참조만 푸시하면, 다른 사용자는 해당 커밋을 내려받을 수 없다. 따라서 반드시 서브모듈을 먼저 푸시해야 한다.

## 자주 사용하는 명령어

```bash
# 서브모듈의 현재 상태와 부모 저장소가 참조하는 커밋 확인
git submodule status

# 등록된 모든 서브모듈 초기화 및 체크아웃
git submodule update --init --recursive

# 각 서브모듈 원격 브랜치의 최신 커밋 가져오기
git submodule update --remote --recursive

# 서브모듈 커밋 변경 내역 확인
git diff --submodule
```

`git submodule update --remote`는 부모 저장소에 기록된 커밋이 아니라 서브모듈 원격 브랜치의 최신 커밋으로 이동시키는 명령이다. 실행 후에는 변경된 서브모듈 커밋 해시를 부모 저장소에 커밋해야 한다.
