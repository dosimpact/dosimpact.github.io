---
sidebar_position: 1
---

# Python uv 설정법

- [Python uv 설정법](#python-uv-설정법)
  - [Index](#index)
  - [About uv?](#about-uv)
  - [uv 설치](#uv-설치)
  - [uv + pyproject.toml 으로 관리하기](#uv--pyprojecttoml-으로-관리하기)
  - [uv + requirements.txt 으로 관리하기](#uv--requirementstxt-으로-관리하기)
  - [실행, 가상환경 활성화, 초기화](#실행-가상환경-활성화-초기화)
  - [uv tool 명령어](#uv-tool-명령어)


## Index  

1, uv + requirements.txt 으로 관리하기  
2, uv + pyproject.toml 으로 관리하기


## About uv?  

uv는 Python 패키지/프로젝트 관리 도구입니다. 쉽게 말해 pip, pip-tools, virtualenv, poetry, pyenv 일부 역할을 빠르게 처리하려는 Rust 기반 도구.  
- 주요 용도는 다음과 같습니다.
  - 패키지 설치: uv pip install requests
  - 가상환경 생성: uv venv
  - 프로젝트 생성/관리: uv init, uv add, uv remove
  - 의존성 잠금 파일 관리: uv lock, uv sync
  - Python 버전 설치/실행: uv python install 3.12
  - 스크립트 실행: uv run script.py
짧게 정리하면: uv는 Python 개발 환경을 빠르고 일관되게 만들기 위한 현대적인 패키지/프로젝트 매니저입니다.  

## uv 설치  

```bash
# --- uv 설치
curl -LsSf https://astral.sh/uv/install.sh | sh
```


## uv + pyproject.toml 으로 관리하기  

TOML은 설정 파일 형식입니다. 확장자는 .toml이고, 뜻은 Tom's Obvious, Minimal Language  
- uv가 'pyproject.toml'을 읽어서 의존성을 관리한다.    

```bash
# 기존 프로젝트의 경우  --- 설치  pyproject.toml 기준으로 python가상 환경 설정 및 의존성 설치  
uv sync
```

```bash
# --- 생성
# 기본 `.venv` 가상환경 생성
uv venv
uv venv --python 3.11

# --- 초기화(필요시)
# 기존에 pyproject.toml이 없는경우 초기화 
uv init

# --- 설치
# pyproject.toml 기준으로 의존성 및 프로젝트 동기화
uv sync

# 프로젝트 의존성 추가
# pyproject.toml, uv.lock, 현재 가상환경에 함께 반영
uv add requests

# 참고:
# uv pip install requests 는 현재 가상환경에만 설치되고
# pyproject.toml 에는 자동 반영되지 않음
```


## uv + requirements.txt 으로 관리하기  

```bash
# --- 생성  
#`.venv` 이름으로 Python 가상환경을 생성합니다.
uv venv .venv
uv venv .venv --python 3.11

# --- 설치  
# 기존의 requirements 의존성이 있다면 설치하기  
uv pip install -r requirements.txt
## 설치 확인
python --version
uv pip list
```

## 실행, 가상환경 활성화, 초기화  

```bash
# --- 실행
# 가상환경을 직접 활성화하지 않고 실행
uv run python main.py

# --- 가상환경 활성화
# 가상환경을 직접 활성화해서 실행할 수도 있음
source .venv/bin/activate
python main.py

# 가상환경 종료
deactivate


# --- 초기화
rm -rf .venv
#  락 파일까지 새로 만들고 싶으면:
rm -rf .venv uv.lock
# 캐시까지 정리하고 싶으면:
uv cache clean && rm -rf .venv uv.lock
```

## uv tool 명령어

`uv tool`은 Python 패키지가 제공하는 CLI 도구를 프로젝트 가상환경과 분리해서 실행하거나 설치하는 명령어입니다. `pipx`와 비슷하게 `ruff`, `black`, `httpie` 같은 실행 도구를 독립된 환경에서 관리할 때 사용합니다.

- `uv tool run`: 도구를 설치하지 않고 일회성으로 실행
- `uvx`: `uv tool run`의 짧은 별칭
- `uv tool install`: 도구를 사용자 환경에 설치하고 PATH에서 실행 가능하게 함
- `uv tool list`: 설치된 도구 목록 확인
- `uv tool upgrade`: 설치된 도구 업데이트
- `uv tool uninstall`: 설치된 도구 제거
- `uv tool dir`: uv가 설치형 도구 환경을 저장하는 위치 확인

```bash
# 설치하지 않고 일회성 실행
uv tool run ruff check .

# uv tool run의 축약형
uvx ruff check .

# 도구 설치
uv tool install ruff

# 설치된 도구 실행
ruff check .

# 설치된 도구 목록 확인
uv tool list

# 도구 업데이트
uv tool upgrade ruff
uv tool upgrade --all

# 도구 제거
uv tool uninstall ruff

# 도구 설치 위치 확인
uv tool dir
```

패키지 이름과 실행 파일 이름이 다르거나, 특정 패키지에서 제공하는 실행 파일을 명확히 지정해야 할 때는 `--from`을 사용합니다.

```bash
# httpie 패키지에서 제공하는 http 실행 파일 실행
uv tool run --from httpie http --version

# 특정 Python 버전으로 도구 실행
uvx --python 3.11 ruff check .

# 특정 Python 버전으로 도구 설치
uv tool install --python 3.11 ruff
```

프로젝트마다 버전을 고정해야 하는 개발 도구라면 `uv add --dev ruff`처럼 프로젝트 의존성으로 관리하는 편이 좋습니다. 반대로 프로젝트와 무관하게 자주 쓰는 CLI 도구라면 `uv tool install`이 적합합니다.

참고: [uv Tools 공식 문서](https://docs.astral.sh/uv/concepts/tools/)
