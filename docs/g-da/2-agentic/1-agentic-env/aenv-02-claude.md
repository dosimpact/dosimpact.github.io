---
sidebar_position: 2
---

# 2. Claude Code + Ollama 연동 온보딩

- [2. Claude Code + Ollama 연동 온보딩](#2-claude-code--ollama-연동-온보딩)
  - [1. 준비 조건](#1-준비-조건)
  - [2. Ollama 상태 점검](#2-ollama-상태-점검)
    - [2-1. 실행 확인](#2-1-실행-확인)
    - [2-2. 모델 준비 확인](#2-2-모델-준비-확인)
  - [3. Claude Code 설치](#3-claude-code-설치)
    - [3-1. 설치](#3-1-설치)
    - [3-2. 설치 확인](#3-2-설치-확인)
  - [4. Claude Code 연결 테스트(1회성 환경 변수)](#4-claude-code-연결-테스트1회성-환경-변수)
    - [4-1. 실행](#4-1-실행)
    - [4-2. 확인](#4-2-확인)
  - [5. 반복 실행용 고정 설정](#5-반복-실행용-고정-설정)
    - [5-1. 프로젝트 단위 설정 파일](#5-1-프로젝트-단위-설정-파일)
    - [5-2. 실행](#5-2-실행)
    - [5-3. 확인](#5-3-확인)
  - [6. 간편 실행 alias](#6-간편-실행-alias)
    - [6-1. 등록](#6-1-등록)
    - [6-2. 실행/확인](#6-2-실행확인)
  - [7. API 레벨 점검(네트워크 경로 검증)](#7-api-레벨-점검네트워크-경로-검증)
    - [7-1. Anthropic 호환 endpoint 호출](#7-1-anthropic-호환-endpoint-호출)
  - [8. 코딩 모델 품질 비교](#8-코딩-모델-품질-비교)
    - [8-1. 실행](#8-1-실행)
    - [8-2. 확인](#8-2-확인)
  - [공식 문서](#공식-문서)


Ollama를 로컬 런타임으로 두고 Claude Code를 연결하는 과정을
`실행 → 점검` 순서로 정리한 문서입니다.

## 1. 준비 조건

```bash
# 1-1. 실행 환경 확인
uname -a
node -v

# 1-2. Ollama 설치 확인 (버전이 나오면 준비된 상태)
ollama --version

# 1-3. Ollama API 엔드포인트 확인
curl -s http://127.0.0.1:11434

# 1-4. 엔드포인트 상태 미확인 시 로컬 서버 기동
ollama serve

# 1-5. 대상 모델 존재 확인
ollama list

# 1-6. 사용할 모델 준비
ollama pull gemma4:e2b-mlx

# 1-7. Claude Code 바이너리 존재 확인
which claude || npm install -g @anthropic-ai/claude-code

# 1-8. Claude Code 버전 확인
claude --version
```

참고: 위 블록은 Claude Code + Ollama 연동에 필요한 최소 사전 점검 항목을 한 번에 실행할 수 있게 정리한 형태입니다.

## 2. Ollama 상태 점검

### 2-1. 실행 확인

```bash
ollama --version
curl -s http://127.0.0.1:11434
```

출력 기대:

```text
Ollama is running
```

실패 시:

```bash
ollama serve
```

### 2-2. 모델 준비 확인

```bash
ollama list
ollama pull gemma4:e2b-mlx
ollama show gemma4:e2b-mlx
```

## 3. Claude Code 설치

### 3-1. 설치

```bash
npm install -g @anthropic-ai/claude-code
```

### 3-2. 설치 확인

```bash
claude --version
```

## 4. Claude Code 연결 테스트(1회성 환경 변수)

### 4-1. 실행

```bash
ANTHROPIC_AUTH_TOKEN=ollama \
ANTHROPIC_BASE_URL=http://127.0.0.1:11434 \
claude --model gemma4:e2b-mlx -p "현재 프로젝트 파일을 건드리지 말고 구조만 요약해줘."
```

### 4-2. 확인

다른 터미널에서 모델이 붙었는지 확인

```bash
ollama ps
```

`gemma4:e2b-mlx`가 실행 중이면 연결 성공입니다.

주의:
- `ANTHROPIC_BASE_URL`에는 `/api`, `/v1`을 붙이지 않습니다.
- 값은 정확히 `http://127.0.0.1:11434` 이어야 합니다.

## 5. 반복 실행용 고정 설정

### 5-1. 프로젝트 단위 설정 파일

```bash
mkdir -p .claude
cat > .claude/settings.json <<'JSON'
{
  "theme": "dark",
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "ollama",
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:11434"
  }
}
JSON
```

### 5-2. 실행

```bash
claude --model gemma4:e2b-mlx
```

### 5-3. 확인

- 설정 반영 여부: `cat .claude/settings.json`
- 런타임 확인: `ollama ps`

## 6. 간편 실행 alias

### 6-1. 등록

```bash
cat >> ~/.zshrc <<'ZSH'
alias claude-gemma='ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://127.0.0.1:11434 claude --model gemma4:e2b-mlx'
ZSH
source ~/.zshrc


cat >> ~/.zshrc <<'ZSH'
alias claude-gemma='claude --model gemma4:12b-mlx --dangerously-skip-permissions'
ZSH
source ~/.zshrc

```

### 6-2. 실행/확인

```bash
claude-gemma
```

정상 응답이 오면 alias 동작 확인.

## 7. API 레벨 점검(네트워크 경로 검증)

### 7-1. Anthropic 호환 endpoint 호출

```bash
curl -s http://127.0.0.1:11434/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: ollama" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "gemma4:e2b-mlx",
    "max_tokens": 128,
    "messages": [{"role": "user", "content": "한 문장으로 답해줘."}]
  }'
```


## 8. 코딩 모델 품질 비교

### 8-1. 실행

```bash
ollama pull qwen2.5-coder:14b

ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://127.0.0.1:11434 claude --model gemma4:e2b-mlx -p "짧게 요약해줘."
ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://127.0.0.1:11434 claude --model qwen2.5-coder:14b -p "짧게 요약해줘."
```

### 8-2. 확인

- 동일 입력으로 응답 품질/속도 비교
- 느리면 `-p` 출력 길이를 짧게 하고 `num_predict`를 낮춰 사용


## 공식 문서

- Claude Code 설치: https://docs.claude.com/en/docs/claude-code/setup
- Claude Code 환경 변수: https://code.claude.com/docs/en/env-vars
- Ollama Anthropic 호환: https://docs.ollama.com/api/anthropic-compatibility
- Ollama API: https://docs.ollama.com/api
