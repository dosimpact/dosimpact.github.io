---
sidebar_position: 1
---

# Python uv 설정법

- [Python uv 설정법](#python-uv-설정법)
- [eg-uv](#eg-uv)
  - [uv + requirements.txt 으로 관리하기](#uv--requirementstxt-으로-관리하기)
  - [uv + pyproject.toml 으로 관리하기](#uv--pyprojecttoml-으로-관리하기)


# eg-uv

1, uv + requirements.txt 으로 관리하기  
2, uv + pyproject.toml 으로 관리하기

## uv + requirements.txt 으로 관리하기  

```bash
# --- uv 설치
curl -LsSf https://astral.sh/uv/install.sh | sh


# --- 생성  
#`.venv` 이름으로 Python 가상환경을 생성합니다.
uv venv .venv
# 특정 Python 버전을 지정하고 싶으면:
uv venv .venv --python 3.11

# --- 활성화  
# 가상환경 활성화
source .venv/bin/activate

# --- 설치  
# 기존의 requirements 의존성이 있다면 설치하기  
uv pip install -r requirements.txt
## 설치 확인
python --version
uv pip list

# --- 실행  
## `uv run`으로 실행하는 방법
## 가상환경을 직접 활성화하지 않고 실행할 수도 있습니다.
uv run python main.py

# 가상환경 종료:
deactivate
```

## uv + pyproject.toml 으로 관리하기

```bash
# --- uv 설치
curl -LsSf https://astral.sh/uv/install.sh | sh

# --- 생성
# 기본 `.venv` 가상환경 생성
uv venv

# 특정 Python 버전을 지정하고 싶으면:
uv venv --python 3.11

# --- 설치
# pyproject.toml 기준으로 의존성 및 프로젝트 동기화
uv sync

# 프로젝트 의존성 추가
# pyproject.toml, uv.lock, 현재 가상환경에 함께 반영
uv add requests

# 참고:
# uv pip install requests 는 현재 가상환경에만 설치되고
# pyproject.toml 에는 자동 반영되지 않음

# 설치 확인
python --version

# --- 실행
# 가상환경을 직접 활성화하지 않고 실행
uv run python main.py

# --- 활성화
# 가상환경을 직접 활성화해서 실행할 수도 있음
source .venv/bin/activate
python main.py

# 가상환경 종료
deactivate
```

